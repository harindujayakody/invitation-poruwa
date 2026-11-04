import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { invitations } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { Link } from "@/i18n/navigation";
import { Plus, ArrowRight, Calendar, Users, Eye } from "lucide-react";

export const instant = false;

interface DashboardPageProps {
  params: Promise<{ locale: string }>;
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect(`/${locale}/login`);
  }

  const t = await getTranslations("dashboard");

  // Scope strictly by logged-in owner
  const userInvitations = await db
    .select()
    .from(invitations)
    .where(eq(invitations.ownerId, session.user.id))
    .orderBy(desc(invitations.createdAt));

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="mb-[var(--space-8)] flex flex-wrap items-center justify-between gap-[var(--space-4)]">
        <div>
          <h1 className="font-display text-[length:var(--text-3xl)] leading-tight tracking-normal text-[var(--ink)]">
            {t("title")}
          </h1>
          <p className="mt-[var(--space-1)] text-[length:var(--text-sm)] text-[var(--ink-muted)]">
            {t("greeting", { name: session.user.name || session.user.email })}
          </p>
        </div>

        <Link
          href="/app/new"
          className="inline-flex items-center gap-[var(--space-2)] rounded-[var(--radius-md)] px-[var(--space-4)] py-[var(--space-2)] text-[length:var(--text-sm)] font-medium text-[var(--accent-ink)] transition-colors duration-[var(--dur-base)] hover:bg-[color-mix(in_oklch,var(--accent),black_12%)] focus:outline-none focus:ring-2 focus:ring-[var(--focus)]"
          style={{
            backgroundColor: "var(--accent)",
            minHeight: "var(--target)",
          }}
        >
          <Plus className="h-4 w-4" strokeWidth={1.5} />
          <span>{t("createCta")}</span>
        </Link>
      </div>

      {userInvitations.length === 0 ? (
        <div
          className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface)] p-[var(--space-8)] text-left md:p-[var(--space-12)]"
        >
          <h2 className="font-display text-[length:var(--text-xl)] text-[var(--ink)]">
            {t("emptyHeading")}
          </h2>
          <p className="mt-[var(--space-2)] max-w-xl text-[length:var(--text-base)] leading-[1.7] text-[var(--ink-muted)]">
            {t("emptyState")}
          </p>
          <div className="mt-[var(--space-6)]">
            <Link
              href="/app/new"
              className="inline-flex items-center gap-[var(--space-2)] rounded-[var(--radius-md)] px-[var(--space-4)] py-[var(--space-2)] text-[length:var(--text-base)] font-medium text-[var(--accent-ink)] transition-colors duration-[var(--dur-base)] hover:bg-[color-mix(in_oklch,var(--accent),black_12%)] focus:outline-none focus:ring-2 focus:ring-[var(--focus)]"
              style={{
                backgroundColor: "var(--accent)",
                minHeight: "var(--target)",
              }}
            >
              <Plus className="h-4 w-4" strokeWidth={1.5} />
              <span>{t("createCta")}</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-[var(--space-4)]">
          {userInvitations.map((inv) => {
            const statusLabel =
              inv.status === "published"
                ? t("statusPublished")
                : inv.status === "archived"
                ? t("statusArchived")
                : t("statusDraft");

            const isPublished = inv.status === "published";

            return (
              <div
                key={inv.id}
                className="flex flex-col justify-between gap-[var(--space-4)] rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface)] p-[var(--space-5)] sm:flex-row sm:items-center"
              >
                <div>
                  <div className="flex items-center gap-[var(--space-3)]">
                    <h2 className="font-display text-[length:var(--text-lg)] text-[var(--ink)]">
                      {inv.slug}
                    </h2>
                    <span
                      className="inline-flex items-center rounded-[var(--radius-sm)] px-[var(--space-2)] py-[2px] text-[length:var(--text-xs)] font-medium"
                      style={{
                        backgroundColor: isPublished
                          ? "color-mix(in oklch, var(--success) 15%, transparent)"
                          : "var(--surface-muted)",
                        color: isPublished ? "var(--success)" : "var(--ink-muted)",
                        border: "1px solid var(--line)",
                      }}
                    >
                      {statusLabel}
                    </span>
                  </div>

                  <div className="mt-[var(--space-2)] flex flex-wrap items-center gap-[var(--space-4)] text-[length:var(--text-xs)] text-[var(--ink-muted)]">
                    {inv.eventDate && (
                      <span className="inline-flex items-center gap-[var(--space-1)]">
                        <Calendar className="h-3.5 w-3.5" strokeWidth={1.5} />
                        {new Date(inv.eventDate).toLocaleDateString(locale, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-[var(--space-1)]">
                      <Users className="h-3.5 w-3.5" strokeWidth={1.5} />
                      {t("guestsCount", { count: 0 })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-[var(--space-3)]">
                  {isPublished && (
                    <a
                      href={`/i/${inv.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-[var(--space-1)] rounded-[var(--radius-md)] border border-[var(--line)] px-[var(--space-3)] py-[var(--space-2)] text-[length:var(--text-xs)] font-medium text-[var(--ink)] transition-colors hover:bg-[var(--surface-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--focus)]"
                      style={{ minHeight: "var(--target)" }}
                    >
                      <Eye className="h-3.5 w-3.5 text-[var(--ink-muted)]" strokeWidth={1.5} />
                      <span>{t("viewCta")}</span>
                    </a>
                  )}

                  <Link
                    href={`/app/invitations/${inv.id}/edit`}
                    className="inline-flex items-center gap-[var(--space-1)] rounded-[var(--radius-md)] bg-[var(--surface-muted)] px-[var(--space-3)] py-[var(--space-2)] text-[length:var(--text-xs)] font-medium text-[var(--ink)] transition-colors hover:bg-[var(--line)] focus:outline-none focus:ring-1 focus:ring-[var(--focus)]"
                    style={{ minHeight: "var(--target)" }}
                  >
                    <span>{t("editCta")}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-[var(--ink-muted)]" strokeWidth={1.5} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
