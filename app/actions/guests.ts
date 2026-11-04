"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { invitations, guests, deliveries } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { normalizeLkPhone } from "@/lib/phone";
import crypto from "crypto";
import { z } from "zod";

function generateGuestToken(): string {
  return crypto.randomBytes(16).toString("base64url");
}

const addGuestSchema = z.object({
  invitationId: z.string().uuid(),
  name: z.string().min(1, "Name is required").max(120),
  phone: z.string().optional().or(z.literal("")),
  headsInvited: z.number().int().min(1).max(20).default(1),
  side: z.enum(["bride", "groom", "both"]).optional(),
  groupName: z.string().max(60).optional(),
  addressAs: z.string().max(60).optional(),
});

export async function addGuestAction(formData: {
  invitationId: string;
  name: string;
  phone?: string;
  headsInvited: number;
  side?: "bride" | "groom" | "both";
  groupName?: string;
  addressAs?: string;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "unauthorized" };
  }

  const parsed = addGuestSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid input" };
  }

  const { invitationId, name, phone, headsInvited, side, groupName, addressAs } =
    parsed.data;

  // Verify ownership
  const [inv] = await db
    .select({ id: invitations.id })
    .from(invitations)
    .where(and(eq(invitations.id, invitationId), eq(invitations.ownerId, session.user.id)))
    .limit(1);

  if (!inv) {
    return { error: "not_found_or_unauthorized" };
  }

  let formattedPhone: string | null = null;
  if (phone && phone.trim().length > 0) {
    const norm = normalizeLkPhone(phone.trim());
    if (!norm) {
      return { error: "invalid_phone" };
    }
    formattedPhone = `+${norm}`;
  }

  const token = generateGuestToken();

  const [inserted] = await db
    .insert(guests)
    .values({
      invitationId,
      name: name.trim(),
      phoneE164: formattedPhone,
      headsInvited,
      side: side || "both",
      groupName: groupName?.trim() || null,
      addressAs: addressAs?.trim() || null,
      token,
    })
    .returning();

  // Create delivery record
  await db.insert(deliveries).values({
    guestId: inserted.id,
    channel: "whatsapp",
  });

  return { success: true, guestId: inserted.id, token: inserted.token };
}

export async function deleteGuestAction(guestId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "unauthorized" };
  }

  // Verify owner through invitation
  const [target] = await db
    .select({ guestId: guests.id, ownerId: invitations.ownerId })
    .from(guests)
    .innerJoin(invitations, eq(guests.invitationId, invitations.id))
    .where(and(eq(guests.id, guestId), eq(invitations.ownerId, session.user.id)))
    .limit(1);

  if (!target) {
    return { error: "not_found_or_unauthorized" };
  }

  await db.delete(guests).where(eq(guests.id, guestId));
  return { success: true };
}

export async function markGuestSentAction(guestId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "unauthorized" };
  }

  // Verify owner
  const [target] = await db
    .select({ guestId: guests.id })
    .from(guests)
    .innerJoin(invitations, eq(guests.invitationId, invitations.id))
    .where(and(eq(guests.id, guestId), eq(invitations.ownerId, session.user.id)))
    .limit(1);

  if (!target) {
    return { error: "not_found_or_unauthorized" };
  }

  const now = new Date();
  await db
    .update(deliveries)
    .set({ sentAt: now })
    .where(eq(deliveries.guestId, guestId));

  return { success: true, sentAt: now.toISOString() };
}

const importSchema = z.object({
  invitationId: z.string().uuid(),
  rows: z.array(
    z.object({
      name: z.string().min(1),
      phone: z.string().optional().or(z.literal("")),
      headsInvited: z.number().int().min(1).max(20).default(1),
      side: z.enum(["bride", "groom", "both"]).optional(),
      groupName: z.string().optional(),
    }),
  ),
});

export async function importGuestsAction(data: {
  invitationId: string;
  rows: Array<{
    name: string;
    phone?: string;
    headsInvited?: number;
    side?: "bride" | "groom" | "both";
    groupName?: string;
  }>;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "unauthorized" };
  }

  const parsed = importSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid input" };
  }

  const { invitationId, rows } = parsed.data;

  // Verify ownership
  const [inv] = await db
    .select({ id: invitations.id })
    .from(invitations)
    .where(and(eq(invitations.id, invitationId), eq(invitations.ownerId, session.user.id)))
    .limit(1);

  if (!inv) {
    return { error: "not_found_or_unauthorized" };
  }

  let importedCount = 0;
  const insertedGuests: (typeof guests.$inferSelect)[] = [];

  for (const row of rows) {
    if (!row.name || !row.name.trim()) continue;

    let formattedPhone: string | null = null;
    if (row.phone && row.phone.trim().length > 0) {
      const norm = normalizeLkPhone(row.phone.trim());
      if (norm) {
        formattedPhone = `+${norm}`;
      }
    }

    const token = generateGuestToken();

    const [inserted] = await db
      .insert(guests)
      .values({
        invitationId,
        name: row.name.trim(),
        phoneE164: formattedPhone,
        headsInvited: row.headsInvited || 1,
        side: row.side || "both",
        groupName: row.groupName?.trim() || null,
        token,
      })
      .returning();

    await db.insert(deliveries).values({
      guestId: inserted.id,
      channel: "whatsapp",
    });

    insertedGuests.push(inserted);
    importedCount++;
  }

  return { success: true, count: importedCount, guests: insertedGuests };
}
