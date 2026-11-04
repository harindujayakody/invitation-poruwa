"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { invitations, invitationEvents } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getTemplateById } from "@/lib/templates";
import { invitationContentSchema, InvitationContent } from "@/lib/schema/invitation";
import { z } from "zod";

const createSchema = z.object({
  templateSlug: z.string().min(1),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .max(50, "Slug too long")
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  partnerOne: z.string().min(1, "Name is required"),
  partnerTwo: z.string().min(1, "Name is required"),
  defaultLocale: z.enum(["si", "ta", "en"]).default("si"),
});

export async function createInvitationAction(formData: {
  templateSlug: string;
  slug: string;
  partnerOne: string;
  partnerTwo: string;
  defaultLocale: "si" | "ta" | "en";
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "unauthorized" };
  }

  const parsed = createSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid input" };
  }

  const { templateSlug, slug, partnerOne, partnerTwo, defaultLocale } = parsed.data;

  // Check slug uniqueness
  const existing = await db
    .select({ id: invitations.id })
    .from(invitations)
    .where(eq(invitations.slug, slug))
    .limit(1);

  if (existing.length > 0) {
    return { error: "slug_taken" };
  }

  const template = getTemplateById(templateSlug);
  const defaultEventsForLocale =
    template.defaultEvents[defaultLocale] || template.defaultEvents.si;

  const initialEvents = defaultEventsForLocale.map((ev, idx) => ({
    id: `ev-${idx + 1}`,
    title: ev.title,
    venue: ev.venue,
    notes: ev.notes || "",
    startsAt: "",
    sort: idx,
  }));

  const initialContent: InvitationContent = {
    couple: {
      partnerOne,
      partnerTwo,
    },
    events: initialEvents,
    sections: {
      showCover: true,
      showEvents: true,
      showStory: true,
      showRsvp: true,
      showGifts: false,
    },
    story: {
      quote:
        defaultLocale === "si"
          ? "ජීවිත දෙකක්, එකම සෙනෙහසකින් එක්වන උතුම් දිනය"
          : defaultLocale === "ta"
          ? "இரு மனங்கள் இணையும் இனிய தருணம்"
          : "Two hearts, two souls, united in love and friendship.",
    },
  };

  const [inserted] = await db
    .insert(invitations)
    .values({
      ownerId: session.user.id,
      slug,
      templateSlug,
      status: "draft",
      defaultLocale,
      content: initialContent,
    })
    .returning({ id: invitations.id, slug: invitations.slug });

  // Also insert initial events into invitation_events table
  if (initialEvents.length > 0) {
    await db.insert(invitationEvents).values(
      initialEvents.map((ev, idx) => ({
        invitationId: inserted.id,
        title: ev.title,
        venue: ev.venue,
        notes: ev.notes,
        sort: idx,
      })),
    );
  }

  return { success: true, invitationId: inserted.id, slug: inserted.slug };
}

const updateSchema = z.object({
  id: z.string().uuid(),
  templateSlug: z.string().optional(),
  defaultLocale: z.enum(["si", "ta", "en"]).optional(),
  eventDate: z.string().optional().nullable(),
  content: invitationContentSchema,
});

export async function updateInvitationAction(data: {
  id: string;
  templateSlug?: string;
  defaultLocale?: "si" | "ta" | "en";
  eventDate?: string | null;
  content: InvitationContent;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "unauthorized" };
  }

  const parsed = updateSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid input" };
  }

  const { id, templateSlug, defaultLocale, eventDate, content } = parsed.data;

  // Scope query strictly by session owner
  const [inv] = await db
    .select()
    .from(invitations)
    .where(and(eq(invitations.id, id), eq(invitations.ownerId, session.user.id)))
    .limit(1);

  if (!inv) {
    return { error: "not_found_or_unauthorized" };
  }

  await db
    .update(invitations)
    .set({
      content,
      ...(templateSlug ? { templateSlug } : {}),
      ...(defaultLocale ? { defaultLocale } : {}),
      ...(eventDate ? { eventDate: new Date(eventDate) } : {}),
    })
    .where(eq(invitations.id, id));

  return { success: true };
}
