import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { BUDGET_SPLIT, formatLkr } from "@/lib/vendors";

export const instant = false;

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ total?: string }>;
}

/** Free budget planner. Server-rendered GET form: no JS, no sign-in, nothing stored. */
export default async function BudgetPage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("hub");
  const raw = Number((await searchParams).total);
  const total = Number.isFinite(raw) && raw >= 50_000 && raw <= 500_000_000 ? raw : 3_000_000;

  return (
    <div className="flex min-h-screen flex-col bg-[var(--surface)] text-[var(--ink)]">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-[var(--space-4)] py-[var(--space-8)] sm:px-[var(--space-6)]">
        <h1 className="font-display text-[length:var(--text-2xl)]">{t("budgetTitle")}</h1>
        <p className="mt-[var(--space-2)] max-w-[60ch] text-[var(--ink-muted)]">{t("budgetIntro")}</p>

        <form className="mt-[var(--space-6)] flex flex-wrap items-end gap-[var(--space-3)]">
          <div>
            <label htmlFor="b-total" className="mb-[var(--space-1)] block text-[length:var(--text-sm)] font-medium">{t("budgetTotal")}</label>
            <input id="b-total" name="total" type="number" min={50000} step={50000} defaultValue={total} className="min-h-[var(--target)] w-56 rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-raised)] px-[var(--space-3)] tabular-nums" />
          </div>
          <button className="min-h-[var(--target)] rounded-[var(--radius-md)] bg-[var(--accent)] px-[var(--space-6)] font-semibold text-[var(--accent-ink)]">{t("budgetUpdate")}</button>
        </form>

        <ul className="mt-[var(--space-8)] grid gap-[var(--space-4)]">
          {Object.entries(BUDGET_SPLIT).map(([cat, share]) => (
            <li key={cat}>
              <div className="flex items-baseline justify-between gap-[var(--space-4)]">
                {cat === "other" ? (
                  <span className="font-medium">{t("budgetOther")}</span>
                ) : (
                  <Link href={`/vendors?category=${cat}`} className="font-medium underline decoration-[var(--line)] underline-offset-4">{t(`categories.${cat}`)}</Link>
                )}
                <span className="tabular-nums">{formatLkr(total * share)}</span>
              </div>
              <div className="mt-[var(--space-1)] h-3 overflow-hidden rounded-[var(--radius-sm)] bg-[var(--accent-blush)]">
                <div className="h-full origin-left rounded-[var(--radius-sm)] bg-[var(--accent-rose)]" style={{ width: `${share * 100}%` }} />
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-[var(--space-6)] text-[length:var(--text-xs)] text-[var(--ink-muted)]">{t("budgetNote")}</p>
      </main>
      <SiteFooter />
    </div>
  );
}
