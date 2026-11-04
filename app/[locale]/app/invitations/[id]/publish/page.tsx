import { setRequestLocale, getTranslations } from "next-intl/server";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { invitations, guests } from "@/db/schema";
import { eq, and, count } from "drizzle-orm";
import { InvitationNav } from "@/components/app/invitation-nav";
import { PublishCheckoutView } from "@/components/publish/publish-checkout-view";
import { invitationContentSchema } from "@/lib/schema/invitation";
import { getTemplateById } from "@/lib/templates";
import { Link } from "@/i18n/navigation";
import { ArrowLeft } from "lucide-react";

export const instant = false;

interface PublishPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function PublishPage({
  params,
}: PublishPageProps) {
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

  // Count guests
  const [guestCountRow] = await db
    .select({ count: count() })
    .from(guests)
    .where(eq(guests.invitationId, id));

  const guestCount = guestCountRow?.count || 0;

  const parsed = invitationContentSchema.safeParse(inv.content);
  const partnerNames = parsed.success
    ? `${parsed.data.couple.partnerOne} & ${parsed.data.couple.partnerTwo}`
    : "Couple";

  const template = getTemplateById(inv.templateSlug);
  const templateName =
    template.name[locale as "en" | "si" | "ta"] || template.name.en;

  const t = await getTranslations("publish");

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

      <PublishCheckoutView
        invitationId={inv.id}
        slug={inv.slug}
        status={inv.status}
        publishedAt={inv.publishedAt}
        templateName={templateName}
        partnerNames={partnerNames}
        hasDate={Boolean(inv.eventDate)}
        guestCount={guestCount}
        locale={locale}
      />
    </div>
  );
}
