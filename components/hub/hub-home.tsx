import { getLocale, getTranslations } from "next-intl/server";
import { Heart, Wallet } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { CATEGORIES, CITIES } from "@/lib/vendors";
import { CategoryIcon } from "./category-icon";

/** Hub entry: search by service + city, category tiles, free tools. Plain GET form, works without JS. */
export async function HubHome() {
  const [t, locale] = await Promise.all([getTranslations("hub"), getLocale()]);
  return (
    <section className="mx-auto w-full max-w-6xl px-[var(--space-4)] pt-[var(--space-12)] pb-[var(--space-8)] sm:px-[var(--space-6)]">
      <h1 className="max-w-[20ch] font-display text-[length:var(--text-3xl)] text-[var(--ink)]">{t("title")}</h1>
      <p className="mt-[var(--space-3)] max-w-[56ch] text-[length:var(--text-base)] text-[var(--ink-muted)]">{t("subtitle")}</p>

      <form action={`/${locale}/vendors`} className="mt-[var(--space-6)] grid gap-[var(--space-2)] rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface-raised)] p-[var(--space-2)] sm:grid-cols-[1fr_1fr_auto]">
        <label className="sr-only" htmlFor="hub-cat">{t("service")}</label>
        <select id="hub-cat" name="category" className="min-h-[var(--target)] rounded-[var(--radius-md)] bg-[var(--accent-blush)] px-[var(--space-3)] text-[length:var(--text-sm)]">
          {CATEGORIES.map((c) => <option key={c} value={c}>{t(`categories.${c}`)}</option>)}
        </select>
        <label className="sr-only" htmlFor="hub-city">{t("city")}</label>
        <select id="hub-city" name="city" className="min-h-[var(--target)] rounded-[var(--radius-md)] bg-[var(--accent-blush)] px-[var(--space-3)] text-[length:var(--text-sm)]">
          <option value="">{t("anyCity")}</option>
          {CITIES.map((c) => <option key={c} value={c}>{t(`cities.${c}`)}</option>)}
        </select>
        <button className="min-h-[var(--target)] rounded-[var(--radius-pill)] bg-[var(--accent)] px-[var(--space-6)] text-[length:var(--text-sm)] font-semibold text-[var(--accent-ink)]">{t("search")}</button>
      </form>

      <ul className="mt-[var(--space-8)] grid grid-cols-2 gap-[var(--space-3)] sm:grid-cols-3">
        {CATEGORIES.map((c) => (
          <li key={c}>
            <Link href={`/vendors?category=${c}`} className="flex min-h-[var(--target)] items-center gap-[var(--space-2)] rounded-[var(--radius-lg)] bg-[var(--accent-blush)] p-[var(--space-4)] text-[length:var(--text-sm)] font-semibold text-[var(--ink)] transition-transform duration-[var(--dur-fast)] hover:-translate-y-0.5">
              <span className="text-[var(--accent)]"><CategoryIcon category={c} /></span>
              {t(`categories.${c}`)}
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-[var(--space-6)] flex flex-wrap gap-[var(--space-3)] text-[length:var(--text-sm)]">
        <Link href="/plan/budget" className="inline-flex min-h-[var(--target)] items-center gap-[var(--space-2)] rounded-[var(--radius-md)] border border-[var(--line)] px-[var(--space-4)] text-[var(--ink)]">
          <Wallet size={16} strokeWidth={1.5} aria-hidden /> {t("budgetLink")}
        </Link>
        <Link href="/templates" className="inline-flex min-h-[var(--target)] items-center gap-[var(--space-2)] rounded-[var(--radius-md)] border border-[var(--line)] px-[var(--space-4)] text-[var(--ink)]">
          <Heart size={16} strokeWidth={1.5} aria-hidden /> {t("invitesLink")}
        </Link>
      </div>
    </section>
  );
}
