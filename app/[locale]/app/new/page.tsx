import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { TemplatePicker } from "@/components/templates/template-picker";
import { Link } from "@/i18n/navigation";
import { ArrowLeft } from "lucide-react";

export const instant = false;

interface NewInvitationPageProps {
  params: Promise<{ locale: string }>;
}

export default async function NewInvitationPage({ params }: NewInvitationPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect(`/${locale}/login`);
  }

  const t = await getTranslations("templates");

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

      <div className="mb-[var(--space-8)] text-left">
        <h1 className="font-display text-[length:var(--text-3xl)] leading-tight text-[var(--ink)]">
          {t("pickerTitle")}
        </h1>
        <p className="mt-[var(--space-2)] text-[length:var(--text-base)] text-[var(--ink-muted)] max-w-2xl">
          {t("pickerSub")}
        </p>
      </div>

      <TemplatePicker locale={locale} />
    </div>
  );
}
