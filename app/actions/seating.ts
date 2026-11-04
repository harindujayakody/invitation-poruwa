"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { invitations, seatingTables, seatAssignments, guests } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { z } from "zod";

const createTableSchema = z.object({
  invitationId: z.string().uuid(),
  label: z.string().min(1, "Table name is required").max(60),
  capacity: z.number().int().min(1).max(30).default(10),
  x: z.number().int().default(0),
  y: z.number().int().default(0),
});

export async function createTableAction(formData: {
  invitationId: string;
  label: string;
  capacity?: number;
  x?: number;
  y?: number;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "unauthorized" };
  }

  const parsed = createTableSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid input" };
  }

  const { invitationId, label, capacity, x, y } = parsed.data;

  // Verify ownership
  const [inv] = await db
    .select({ id: invitations.id })
    .from(invitations)
    .where(and(eq(invitations.id, invitationId), eq(invitations.ownerId, session.user.id)))
    .limit(1);

  if (!inv) {
    return { error: "not_found_or_unauthorized" };
  }

  const [inserted] = await db
    .insert(seatingTables)
    .values({
      invitationId,
      label: label.trim(),
      capacity,
      x,
      y,
      published: false,
    })
    .returning();

  return { success: true, table: inserted };
}

const updateTableSchema = z.object({
  tableId: z.string().uuid(),
  label: z.string().min(1).max(60).optional(),
  capacity: z.number().int().min(1).max(30).optional(),
  x: z.number().int().optional(),
  y: z.number().int().optional(),
  published: z.boolean().optional(),
});

export async function updateTableAction(data: {
  tableId: string;
  label?: string;
  capacity?: number;
  x?: number;
  y?: number;
  published?: boolean;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "unauthorized" };
  }

  const parsed = updateTableSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid input" };
  }

  const { tableId, label, capacity, x, y, published } = parsed.data;

  // Verify owner
  const [target] = await db
    .select({ tableId: seatingTables.id })
    .from(seatingTables)
    .innerJoin(invitations, eq(seatingTables.invitationId, invitations.id))
    .where(and(eq(seatingTables.id, tableId), eq(invitations.ownerId, session.user.id)))
    .limit(1);

  if (!target) {
    return { error: "not_found_or_unauthorized" };
  }

  await db
    .update(seatingTables)
    .set({
      ...(label ? { label: label.trim() } : {}),
      ...(capacity !== undefined ? { capacity } : {}),
      ...(x !== undefined ? { x } : {}),
      ...(y !== undefined ? { y } : {}),
      ...(published !== undefined ? { published } : {}),
    })
    .where(eq(seatingTables.id, tableId));

  return { success: true };
}

export async function deleteTableAction(tableId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "unauthorized" };
  }

  const [target] = await db
    .select({ tableId: seatingTables.id })
    .from(seatingTables)
    .innerJoin(invitations, eq(seatingTables.invitationId, invitations.id))
    .where(and(eq(seatingTables.id, tableId), eq(invitations.ownerId, session.user.id)))
    .limit(1);

  if (!target) {
    return { error: "not_found_or_unauthorized" };
  }

  // Delete assignments then table
  await db.delete(seatAssignments).where(eq(seatAssignments.tableId, tableId));
  await db.delete(seatingTables).where(eq(seatingTables.id, tableId));

  return { success: true };
}

export async function assignGuestToTableAction(guestId: string, tableId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "unauthorized" };
  }

  // Verify ownership of table
  const [tableTarget] = await db
    .select({
      tableId: seatingTables.id,
      invitationId: seatingTables.invitationId,
      capacity: seatingTables.capacity,
    })
    .from(seatingTables)
    .innerJoin(invitations, eq(seatingTables.invitationId, invitations.id))
    .where(and(eq(seatingTables.id, tableId), eq(invitations.ownerId, session.user.id)))
    .limit(1);

  if (!tableTarget) {
    return { error: "table_not_found_or_unauthorized" };
  }

  // Verify guest belongs to same invitation
  const [guestTarget] = await db
    .select({
      id: guests.id,
      headsInvited: guests.headsInvited,
    })
    .from(guests)
    .where(and(eq(guests.id, guestId), eq(guests.invitationId, tableTarget.invitationId)))
    .limit(1);

  if (!guestTarget) {
    return { error: "guest_not_found" };
  }

  // Upsert assignment
  await db
    .insert(seatAssignments)
    .values({
      guestId,
      tableId,
    })
    .onConflictDoUpdate({
      target: [seatAssignments.guestId],
      set: { tableId },
    });

  return { success: true };
}

export async function unassignGuestAction(guestId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "unauthorized" };
  }

  // Verify owner through guest -> invitation
  const [target] = await db
    .select({ guestId: guests.id })
    .from(guests)
    .innerJoin(invitations, eq(guests.invitationId, invitations.id))
    .where(and(eq(guests.id, guestId), eq(invitations.ownerId, session.user.id)))
    .limit(1);

  if (!target) {
    return { error: "not_found_or_unauthorized" };
  }

  await db.delete(seatAssignments).where(eq(seatAssignments.guestId, guestId));

  return { success: true };
}

export async function togglePublishSeatingAction(invitationId: string, published: boolean) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "unauthorized" };
  }

  const [inv] = await db
    .select({ id: invitations.id })
    .from(invitations)
    .where(and(eq(invitations.id, invitationId), eq(invitations.ownerId, session.user.id)))
    .limit(1);

  if (!inv) {
    return { error: "not_found_or_unauthorized" };
  }

  await db
    .update(seatingTables)
    .set({ published })
    .where(eq(seatingTables.invitationId, invitationId));

  return { success: true, published };
}
