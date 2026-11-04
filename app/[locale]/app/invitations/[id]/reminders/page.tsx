import { setRequestLocale, getTranslations } from "next-intl/server";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { invitations, guests, deliveries, rsvps } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { invitationContentSchema } from "@/lib/schema/invitation";
import { InvitationNav } from "@/components/app/invitation-nav";
import {
  DeliveryRemindersView,
  ReminderGuestItem,
} from "@/components/reminders/delivery-reminders-view";
import { Link } from "@/i18n/navigation";
import { ArrowLeft } from "lucide-react";

export const instant = false;

interface RemindersPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function RemindersPage({ params }: RemindersPageProps) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect(`/${locale}/login`);
  }

  // Strictly owner-scoped query
  const [inv] = await db
    .select()
    .from(invitations)
    .where(and(eq(invitations.id, id), eq(invitations.ownerId, session.user.id)))
    .limit(1);

  if (!inv) {
    notFound();
  }

  const parsedContent = invitationContentSchema.safeParse(inv.content);
  const coupleNames = parsedContent.success
    ? `${parsedContent.data.couple.partnerOne} & ${parsedContent.data.couple.partnerTwo}`
    : "The Wedding Celebration";

  // Fetch guests joined with deliveries and rsvps
  const rawRows = await db
    .select({
      id: guests.id,
      name: guests.name,
      phoneE164: guests.phoneE164,
      headsInvited: guests.headsInvited,
      side: guests.side,
      token: guests.token,
      rsvpStatus: rsvps.status,
      sentAt: deliveries.sentAt,
      firstOpenedAt: deliveries.firstOpenedAt,
      reminderSentAt: deliveries.reminderSentAt,
      reminderCount: deliveries.reminderCount,
    })
    .from(guests)
    .leftJoin(deliveries, eq(guests.id, deliveries.guestId))
    .leftJoin(rsvps, eq(guests.id, rsvps.guestId))
    .where(eq(guests.invitationId, id))
    .orderBy(guests.name);

  // De-duplicate guests (if multiple event RSVPs exist)
  const guestMap = new Map<string, ReminderGuestItem>();
  for (const row of rawRows) {
    if (!guestMap.has(row.id)) {
      guestMap.set(row.id, {
        id: row.id,
        name: row.name,
        phoneE164: row.phoneE164,
        headsInvited: row.headsInvited,
        side: row.side,
        token: row.token,
        rsvpStatus: row.rsvpStatus || "pending",
        sentAt: row.sentAt,
        firstOpenedAt: row.firstOpenedAt,
        reminderSentAt: row.reminderSentAt,
        reminderCount: row.reminderCount || 0,
      });
    } else if (row.rsvpStatus === "accepted" || row.rsvpStatus === "declined") {
      const existing = guestMap.get(row.id)!;
      existing.rsvpStatus = row.rsvpStatus;
    }
  }

  const initialGuests: ReminderGuestItem[] = Array.from(guestMap.values());

  const headersList = await headers();
  const host = headersList.get("host") || "localhost:3000";
  const proto = headersList.get("x-forwarded-proto") || "http";
  const origin = `${proto}://${host}`;

  const t = await getTranslations("reminders");

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

      <InvitationNav invitationId={id} slug={inv.slug} />

      <div className="mb-[var(--space-6)] text-left">
        <h1 className="font-display text-[length:var(--text-3xl)] leading-tight text-[var(--ink)]">
          {t("title")}
        </h1>
        <p className="mt-[var(--space-1)] text-[length:var(--text-sm)] text-[var(--ink-muted)]">
          {t("subtitle", { slug: inv.slug })}
        </p>
      </div>

      <DeliveryRemindersView
        slug={inv.slug}
        coupleNames={coupleNames}
        initialGuests={initialGuests}
        origin={origin}
        locale={locale}
      />
    </div>
  );
}
