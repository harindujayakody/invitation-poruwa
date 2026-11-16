import { getLocale, getTranslations } from "next-intl/server";
import { ChevronRight, Mail, Search, Wallet } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { CATEGORIES, CITIES } from "@/lib/vendors";
import { CategoryIcon } from "./category-icon";

// Tile colours cycle pink, sage, gold so the grid reads as a set, not a wall of one colour.
export const TINTS = [
  "bg-[var(--accent-blush)] text-[var(--accent)]",
  "bg-[var(--accent-mint)] text-[var(--success)]",
  "bg-[var(--accent-honey)] text-[var(--accent-honey-ink)]",
] as const;

const fieldLabel = "flex flex-1 basis-36 flex-col gap-0.5 rounded-[var(--radius-md)] bg-[var(--accent-blush)] px-[var(--space-3)] py-[var(--space-2)] text-[length:var(--text-xs)] font-bold text-[var(--ink-muted)]";
const fieldInput = "min-h-7 w-full bg-transparent text-[length:var(--text-base)] font-semibold text-[var(--ink)]";

/** Hub home: search by service, city and wedding date; service tiles; planning and invitation entry points. Works without JS. */
export async function HubHome() {
  const [t, locale] = await Promise.all([getTranslations("hub"), getLocale()]);
  const features = [
    { href: "/vendors", Icon: Search, title: "f1Title", text: "f1Text" },
    { href: "/plan/budget", Icon: Wallet, title: "f2Title", text: "f2Text" },
    { href: "/invitations", Icon: Mail, title: "f3Title", text: "f3Text" },
  ] as const;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-[var(--space-12)] px-[var(--space-4)] pt-[var(--space-8)] pb-[var(--space-12)] sm:px-[var(--space-6)] md:pt-[var(--space-12)]">
      <section className="flex flex-col gap-[var(--space-4)]">
        <h1 className="max-w-[16ch] font-display text-[length:var(--text-3xl)] text-[var(--ink)]">{t("title")}</h1>
        <p className="max-w-[52ch] text-[length:var(--text-base)] text-[var(--ink-muted)]">{t("subtitle")}</p>

        <form
          action={`/${locale}/vendors`}
          className="mt-[var(--space-2)] flex max-w-3xl flex-wrap gap-[var(--space-2)] rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface-raised)] p-[var(--space-2)]"
        >
          <label className={fieldLabel}>
            {t("service")}
            <select name="category" className={fieldInput}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{t(`categories.${c}`)}</option>)}
            </select>
          </label>
          <label className={fieldLabel}>
            {t("city")}
            <select name="city" className={fieldInput}>
              <option value="">{t("anyCity")}</option>
              {CITIES.map((c) => <option key={c} value={c}>{t(`cities.${c}`)}</option>)}
            </select>
          </label>
          <label className={fieldLabel}>
            {t("weddingDate")}
            <input type="date" name="date" className={fieldInput} />
          </label>
          <button className="inline-flex min-h-[var(--target)] flex-1 basis-36 items-center justify-center gap-[var(--space-2)] whitespace-nowrap rounded-[var(--radius-pill)] bg-[var(--accent)] px-[var(--space-6)] font-display text-[length:var(--text-base)] font-extrabold text-[var(--accent-ink)]">
            <Search size={20} strokeWidth={1.5} aria-hidden /> {t("findVendors")}
          </button>
        </form>
      </section>

      <section className="flex flex-col gap-[var(--space-4)]">
        <h2 className="font-display text-[length:var(--text-xl)]">{t("browseTitle")}</h2>
        <ul className="grid grid-cols-3 gap-x-[var(--space-2)] gap-y-[var(--space-4)] sm:grid-cols-5 lg:grid-cols-9">
          {CATEGORIES.map((c, i) => (
            <li key={c}>
              <Link href={`/vendors?category=${c}`} className="group flex flex-col items-center gap-[var(--space-2)] text-center text-[length:var(--text-sm)] font-bold text-[var(--ink)]">
                <span className={`flex size-16 items-center justify-center rounded-[var(--radius-lg)] transition-transform duration-[var(--dur-fast)] group-hover:-translate-y-0.5 ${TINTS[i % 3]}`}>
                  <CategoryIcon category={c} size={24} />
                </span>
                {t(`categories.${c}`)}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <Link href="/plan/budget" className="flex max-w-3xl items-center gap-[var(--space-4)] rounded-[var(--radius-lg)] bg-[var(--ink)] p-[var(--space-4)] text-[var(--surface)]">
        <span className="flex size-12 flex-none items-center justify-center rounded-[var(--radius-md)] bg-[var(--accent-honey)] text-[var(--accent-honey-ink)]">
          <Wallet size={24} strokeWidth={1.5} aria-hidden />
        </span>
        <span className="flex flex-1 flex-col">
          <span className="font-display text-[length:var(--text-base)] font-extrabold">{t("planCtaTitle")}</span>
          <span className="text-[length:var(--text-sm)] opacity-85">{t("planCtaText")}</span>
        </span>
        <ChevronRight size={20} strokeWidth={1.5} aria-hidden />
      </Link>

      <section className="flex flex-col gap-[var(--space-4)]">
        <h2 className="font-display text-[length:var(--text-xl)]">{t("featuresTitle")}</h2>
        <ul className="grid gap-[var(--space-4)] md:grid-cols-3">
          {features.map(({ href, Icon, title, text }, i) => (
            <li key={href}>
              <Link href={href} className="flex h-full flex-col gap-[var(--space-3)] rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface-raised)] p-[var(--space-6)] transition-transform duration-[var(--dur-fast)] hover:-translate-y-0.5">
                <span className={`flex size-12 items-center justify-center rounded-[var(--radius-md)] ${TINTS[i % 3]}`}>
                  <Icon size={24} strokeWidth={1.5} aria-hidden />
                </span>
                <span className="font-display text-[length:var(--text-lg)] font-extrabold">{t(title)}</span>
                <span className="text-[length:var(--text-sm)] text-[var(--ink-muted)]">{t(text)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
