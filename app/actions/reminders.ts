"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { invitations, guests, deliveries } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { z } from "zod";

const guestIdSchema = z.string().uuid();

export async function recordReminderSentAction(guestId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "unauthorized" };
  }

  const parsed = guestIdSchema.safeParse(guestId);
  if (!parsed.success) {
    return { error: "Invalid guest ID" };
  }

  // Verify ownership
  const [target] = await db
    .select({
      id: guests.id,
      invitationId: guests.invitationId,
    })
    .from(guests)
    .innerJoin(invitations, eq(guests.invitationId, invitations.id))
    .where(and(eq(guests.id, parsed.data), eq(invitations.ownerId, session.user.id)))
    .limit(1);

  if (!target) {
    return { error: "not_found_or_unauthorized" };
  }

  const [existingDelivery] = await db
    .select()
    .from(deliveries)
    .where(eq(deliveries.guestId, parsed.data))
    .limit(1);

  if (existingDelivery) {
    const [updated] = await db
      .update(deliveries)
      .set({
        reminderSentAt: new Date(),
        reminderCount: sql`${deliveries.reminderCount} + 1`,
      })
      .where(eq(deliveries.guestId, parsed.data))
      .returning();

    return {
      success: true,
      reminderSentAt: updated.reminderSentAt,
      reminderCount: updated.reminderCount,
    };
  } else {
    const [inserted] = await db
      .insert(deliveries)
      .values({
        guestId: parsed.data,
        channel: "whatsapp",
        sentAt: new Date(),
        reminderSentAt: new Date(),
        reminderCount: 1,
      })
      .returning();

    return {
      success: true,
      reminderSentAt: inserted.reminderSentAt,
      reminderCount: inserted.reminderCount,
    };
  }
}
