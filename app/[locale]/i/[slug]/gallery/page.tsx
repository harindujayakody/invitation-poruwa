import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { db } from "@/db";
import { invitations, media } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { invitationContentSchema } from "@/lib/schema/invitation";
import {
  GuestPhotoStream,
  PublicPhotoItem,
} from "@/components/guest/guest-photo-stream";

export const instant = false;

interface GalleryPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: GalleryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const [inv] = await db
    .select({ content: invitations.content })
    .from(invitations)
    .where(eq(invitations.slug, slug))
    .limit(1);

  if (!inv) {
    return {
      title: "Wedding Photo Gallery",
      robots: { index: false, follow: false },
    };
  }

  const parsed = invitationContentSchema.safeParse(inv.content);
  const title = parsed.success
    ? `${parsed.data.couple.partnerOne} & ${parsed.data.couple.partnerTwo} - Live Photo Stream`
    : "Live Wedding Photo Stream";

  return {
    title,
    description: "View and share live candid photos from the wedding celebration.",
    robots: { index: false, follow: false },
  };
}

export default async function PublicGalleryPage({ params }: GalleryPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  // 1. Fetch invitation
  const [inv] = await db
    .select()
    .from(invitations)
    .where(eq(invitations.slug, slug))
    .limit(1);

  if (!inv) {
    notFound();
  }

  const parsedContent = invitationContentSchema.safeParse(inv.content);
  const coupleNames = parsedContent.success
    ? `${parsedContent.data.couple.partnerOne} & ${parsedContent.data.couple.partnerTwo}`
    : "The Wedding Celebration";

  // 2. Fetch approved media
  const approvedRows = await db
    .select({
      id: media.id,
      kind: media.kind,
      storageKey: media.storageKey,
      createdAt: media.createdAt,
    })
    .from(media)
    .where(and(eq(media.invitationId, inv.id), eq(media.moderation, "approved")))
    .orderBy(desc(media.createdAt));

  const photos: PublicPhotoItem[] = approvedRows.map((p) => ({
    id: p.id,
    kind: p.kind,
    storageKey: p.storageKey,
    createdAt: p.createdAt,
  }));

  return (
    <GuestPhotoStream
      slug={slug}
      coupleNames={coupleNames}
      initialPhotos={photos}
      locale={locale}
    />
  );
}
