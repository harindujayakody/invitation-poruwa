"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { invitations, media } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { z } from "zod";

const mediaIdSchema = z.string().uuid();

export async function approvePhotoAction(mediaId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "unauthorized" };
  }

  const parsed = mediaIdSchema.safeParse(mediaId);
  if (!parsed.success) {
    return { error: "Invalid photo ID" };
  }

  // Verify ownership of the photo via invitation
  const [photo] = await db
    .select({
      id: media.id,
      invitationId: media.invitationId,
    })
    .from(media)
    .innerJoin(invitations, eq(media.invitationId, invitations.id))
    .where(and(eq(media.id, parsed.data), eq(invitations.ownerId, session.user.id)))
    .limit(1);

  if (!photo) {
    return { error: "not_found_or_unauthorized" };
  }

  await db
    .update(media)
    .set({ moderation: "approved" })
    .where(eq(media.id, parsed.data));

  return { success: true };
}

export async function rejectPhotoAction(mediaId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "unauthorized" };
  }

  const parsed = mediaIdSchema.safeParse(mediaId);
  if (!parsed.success) {
    return { error: "Invalid photo ID" };
  }

  // Verify ownership
  const [photo] = await db
    .select({
      id: media.id,
    })
    .from(media)
    .innerJoin(invitations, eq(media.invitationId, invitations.id))
    .where(and(eq(media.id, parsed.data), eq(invitations.ownerId, session.user.id)))
    .limit(1);

  if (!photo) {
    return { error: "not_found_or_unauthorized" };
  }

  await db
    .update(media)
    .set({ moderation: "rejected" })
    .where(eq(media.id, parsed.data));

  return { success: true };
}

export async function deletePhotoAction(mediaId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "unauthorized" };
  }

  const parsed = mediaIdSchema.safeParse(mediaId);
  if (!parsed.success) {
    return { error: "Invalid photo ID" };
  }

  // Verify ownership
  const [photo] = await db
    .select({
      id: media.id,
    })
    .from(media)
    .innerJoin(invitations, eq(media.invitationId, invitations.id))
    .where(and(eq(media.id, parsed.data), eq(invitations.ownerId, session.user.id)))
    .limit(1);

  if (!photo) {
    return { error: "not_found_or_unauthorized" };
  }

  await db.delete(media).where(eq(media.id, parsed.data));

  return { success: true };
}
