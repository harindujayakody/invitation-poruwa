"use server";

import { db } from "@/db";
import { invitations, guests, invitationEvents, rsvps, deliveries } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { z } from "zod";
import { rateLimit } from "@/lib/rate-limit";

const rsvpItemSchema = z.object({
  eventId: z.string().uuid(),
  status: z.enum(["accepted", "declined"]),
  headsAttending: z.number().int().min(0).max(20).optional(),
  message: z.string().max(500).optional(),
});

const submitRsvpSchema = z.object({
  token: z.string().min(5),
  slug: z.string().min(1),
  responses: z.array(rsvpItemSchema).min(1),
});

export async function submitRsvpAction(data: {
  token: string;
  slug: string;
  responses: Array<{
    eventId: string;
    status: "accepted" | "declined";
    headsAttending?: number;
    message?: string;
  }>;
}) {
  const parsed = submitRsvpSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid input" };
  }

  const { token, slug, responses } = parsed.data;

  // Keyed by token so a leaked link can't be hammered; 20 submits per 10 minutes is plenty for a real guest.
  if (!rateLimit(`rsvp:${token}`, 20, 10 * 60_000)) {
    return { error: "too_many_requests" };
  }

  // 1. Verify invitation exists
  const [inv] = await db
    .select({ id: invitations.id })
    .from(invitations)
    .where(eq(invitations.slug, slug))
    .limit(1);

  if (!inv) {
    return { error: "invitation_not_found" };
  }

  // 2. Verify guest token matches this invitation
  const [guest] = await db
    .select({
      id: guests.id,
      headsInvited: guests.headsInvited,
      name: guests.name,
    })
    .from(guests)
    .where(and(eq(guests.token, token), eq(guests.invitationId, inv.id)))
    .limit(1);

  if (!guest) {
    return { error: "invalid_guest_token" };
  }

  // 3. Verify events belong to this invitation
  const validEvents = await db
    .select({ id: invitationEvents.id })
    .from(invitationEvents)
    .where(eq(invitationEvents.invitationId, inv.id));

  const validEventIds = new Set(validEvents.map((e) => e.id));

  const now = new Date();
  const savedResponses = [];

  for (const resp of responses) {
    if (!validEventIds.has(resp.eventId)) {
      continue;
    }

    const heads =
      resp.status === "accepted"
        ? Math.min(Math.max(resp.headsAttending ?? guest.headsInvited, 1), guest.headsInvited)
        : 0;

    const [saved] = await db
      .insert(rsvps)
      .values({
        guestId: guest.id,
        eventId: resp.eventId,
        status: resp.status,
        headsAttending: heads,
        message: resp.message?.trim() || null,
        respondedAt: now,
      })
      .onConflictDoUpdate({
        target: [rsvps.guestId, rsvps.eventId],
        set: {
          status: resp.status,
          headsAttending: heads,
          message: resp.message?.trim() || null,
          respondedAt: now,
        },
      })
      .returning();

    savedResponses.push(saved);
  }

  return {
    success: true,
    responses: savedResponses,
  };
}

export async function recordFirstOpenAction(token: string, slug: string) {
  try {
    const [inv] = await db
      .select({ id: invitations.id })
      .from(invitations)
      .where(eq(invitations.slug, slug))
      .limit(1);

    if (!inv) return;

    const [guest] = await db
      .select({ id: guests.id })
      .from(guests)
      .where(and(eq(guests.token, token), eq(guests.invitationId, inv.id)))
      .limit(1);

    if (!guest) return;

    const [del] = await db
      .select()
      .from(deliveries)
      .where(eq(deliveries.guestId, guest.id))
      .limit(1);

    if (del && !del.firstOpenedAt) {
      await db
        .update(deliveries)
        .set({ firstOpenedAt: new Date() })
        .where(eq(deliveries.guestId, guest.id));
    }
  } catch {
    // Non-blocking telemetry
  }
}
