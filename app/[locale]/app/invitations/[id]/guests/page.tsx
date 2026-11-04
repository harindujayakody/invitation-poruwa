import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { invitations, guests, deliveries } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { GuestListManager } from "@/components/guests/guest-list-manager";
import { InvitationNav } from "@/components/app/invitation-nav";
import { Link } from "@/i18n/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const instant = false;

interface GuestsPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function GuestsPage({ params }: GuestsPageProps) {
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

  const rawGuests = await db
    .select({
      id: guests.id,
      name: guests.name,
      phoneE164: guests.phoneE164,
      headsInvited: guests.headsInvited,
      groupName: guests.groupName,
      side: guests.side,
      token: guests.token,
      createdAt: guests.createdAt,
      sentAt: deliveries.sentAt,
      firstOpenedAt: deliveries.firstOpenedAt,
    })
    .from(guests)
    .leftJoin(deliveries, eq(guests.id, deliveries.guestId))
    .where(eq(guests.invitationId, id))
    .orderBy(desc(guests.createdAt));

  const t = await getTranslations("guests");

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="mb-4">
        <Link href="/app">
          <Button variant="ghost" size="sm" className="gap-2 text-stone-600 hover:text-stone-900">
            <ArrowLeft className="h-4 w-4" />
            <span>{t("backToDashboard")}</span>
          </Button>
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

      <GuestListManager
        invitationId={inv.id}
        slug={inv.slug}
        initialGuests={rawGuests}
        locale={locale}
      />
    </div>
  );
}
