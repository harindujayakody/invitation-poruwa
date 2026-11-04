"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { invitations, customDesignRequests } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { z } from "zod";
import { uploadPhotoFile } from "@/lib/storage";

const submitCustomDesignSchema = z.object({
  invitationId: z.string().uuid(),
  requestType: z.enum([
    "nakath_calligraphy",
    "poruwa_motif",
    "family_crest",
    "music_audio",
    "full_bespoke",
  ]),
  title: z.string().trim().min(3).max(120),
  description: z.string().trim().min(10).max(2000),
  contactWhatsapp: z.string().trim().min(9).max(25),
});

export async function submitCustomDesignAction(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "unauthorized" };
  }

  const raw = {
    invitationId: formData.get("invitationId"),
    requestType: formData.get("requestType"),
    title: formData.get("title"),
    description: formData.get("description"),
    contactWhatsapp: formData.get("contactWhatsapp"),
  };

  const parsed = submitCustomDesignSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      error: "invalid_input",
      details: parsed.error.flatten().fieldErrors,
    };
  }

  // Verify ownership of the invitation
  const [invitation] = await db
    .select({ id: invitations.id })
    .from(invitations)
    .where(and(eq(invitations.id, parsed.data.invitationId), eq(invitations.ownerId, session.user.id)))
    .limit(1);

  if (!invitation) {
    return { error: "not_found_or_unauthorized" };
  }

  // Handle optional attachment
  let attachmentUrl: string | undefined = undefined;
  const attachment = formData.get("attachment");
  if (attachment instanceof File && attachment.size > 0) {
    const uploadRes = await uploadPhotoFile(attachment, parsed.data.invitationId);
    if (!uploadRes.success) {
      return { error: uploadRes.error || "Failed to upload reference image" };
    }
    attachmentUrl = uploadRes.url;
  }

  await db.insert(customDesignRequests).values({
    invitationId: parsed.data.invitationId,
    userId: session.user.id,
    requestType: parsed.data.requestType,
    title: parsed.data.title,
    description: parsed.data.description,
    contactWhatsapp: parsed.data.contactWhatsapp,
    attachmentUrl: attachmentUrl || null,
    status: "pending",
  });

  revalidatePath(`/app/invitations/${parsed.data.invitationId}/custom-design`);

  return { success: true };
}

export async function getCustomDesignRequestsAction(invitationId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "unauthorized", requests: [] };
  }

  // Verify ownership
  const [invitation] = await db
    .select({ id: invitations.id })
    .from(invitations)
    .where(and(eq(invitations.id, invitationId), eq(invitations.ownerId, session.user.id)))
    .limit(1);

  if (!invitation) {
    return { error: "not_found_or_unauthorized", requests: [] };
  }

  const requests = await db
    .select()
    .from(customDesignRequests)
    .where(eq(customDesignRequests.invitationId, invitationId))
    .orderBy(desc(customDesignRequests.createdAt));

  return { success: true, requests };
}
