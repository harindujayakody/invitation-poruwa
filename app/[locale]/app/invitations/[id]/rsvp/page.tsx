import { setRequestLocale, getTranslations } from "next-intl/server";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { invitations, guests, rsvps } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { InvitationNav } from "@/components/app/invitation-nav";
import { RsvpTrackerView, GuestRsvpRow } from "@/components/rsvp/rsvp-tracker-view";
import { Link } from "@/i18n/navigation";
import { ArrowLeft } from "lucide-react";

export const instant = false;

interface RsvpPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function RsvpPage({ params }: RsvpPageProps) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect(`/${locale}/login`);
  }

  // Strictly owner-scoped
  const [inv] = await db
    .select()
    .from(invitations)
    .where(and(eq(invitations.id, id), eq(invitations.ownerId, session.user.id)))
    .limit(1);

  if (!inv) {
    notFound();
  }

  const rawRows = await db
    .select({
      id: guests.id,
      name: guests.name,
      phoneE164: guests.phoneE164,
      headsInvited: guests.headsInvited,
      side: guests.side,
      groupName: guests.groupName,
      rsvpStatus: rsvps.status,
      headsAttending: rsvps.headsAttending,
      message: rsvps.message,
      respondedAt: rsvps.respondedAt,
    })
    .from(guests)
    .leftJoin(rsvps, eq(guests.id, rsvps.guestId))
    .where(eq(guests.invitationId, id))
    .orderBy(desc(rsvps.respondedAt), desc(guests.createdAt));

  const t = await getTranslations("rsvpTracker");

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="mb-[var(--space-6)]">
        <Link
          href="/app"
          className="inline-flex items-center gap-[var(--space-2)] text-[length:var(--text-xs)] font-medium text-[var(--ink-muted)] hover:text-[var(--ink)] focus:outline-none"
          style={{ minHeight: "36px" }}
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
          <span>{t("backToDashboard")}</span>
        </Link>
      </div>

      <InvitationNav invitationId={inv.id} slug={inv.slug} />

      <div className="mb-[var(--space-6)] text-left">
        <h1 className="font-display text-[length:var(--text-3xl)] leading-tight text-[var(--ink)]">
          {t("title")}
        </h1>
        <p className="mt-[var(--space-1)] text-[length:var(--text-sm)] text-[var(--ink-muted)]">
          {t("subtitle", { slug: inv.slug })}
        </p>
      </div>

      <RsvpTrackerView
        slug={inv.slug}
        initialRows={rawRows as GuestRsvpRow[]}
        locale={locale}
      />
    </div>
  );
}
