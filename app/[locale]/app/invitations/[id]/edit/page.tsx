import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { invitations } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { InvitationEditor } from "@/components/editor/invitation-editor";
import { InvitationContent } from "@/lib/schema/invitation";
import { InvitationNav } from "@/components/app/invitation-nav";
import { Link } from "@/i18n/navigation";
import { ArrowLeft } from "lucide-react";

export const instant = false;

interface EditorPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function InvitationEditorPage({ params }: EditorPageProps) {
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

  const t = await getTranslations("editor");
  const content = inv.content as InvitationContent;

  return (
    <div className="mx-auto w-full max-w-6xl">
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

      <InvitationEditor
        invitationId={inv.id}
        slug={inv.slug}
        initialTemplateSlug={inv.templateSlug}
        initialDefaultLocale={inv.defaultLocale as "si" | "ta" | "en"}
        initialEventDate={inv.eventDate ? new Date(inv.eventDate).toISOString().split("T")[0] : null}
        initialContent={content}
        locale={locale}
      />
    </div>
  );
}
