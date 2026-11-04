import { getTranslations, setRequestLocale } from "next-intl/server";
import { and, asc, eq, type SQL } from "drizzle-orm";
import { db } from "@/db";
import { vendors } from "@/db/schema";
import { Link } from "@/i18n/navigation";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { CategoryIcon } from "@/components/hub/category-icon";
import { CATEGORIES, CITIES, formatLkr, type Category } from "@/lib/vendors";

export const instant = false;

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string; city?: string }>;
}

export default async function VendorsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("hub");
  const sp = await searchParams;
  const category = CATEGORIES.includes(sp.category as Category) ? (sp.category as Category) : undefined;
  const city = (CITIES as readonly string[]).includes(sp.city ?? "") ? sp.city : undefined;

  const where: SQL[] = [eq(vendors.published, true)];
  if (category) where.push(eq(vendors.category, category));
  if (city) where.push(eq(vendors.city, city));
  // shortcut: no pagination; add limit/offset once a category passes ~100 vendors.
  const rows = await db.select().from(vendors).where(and(...where)).orderBy(asc(vendors.name)).limit(100);

  const chip = (active: boolean) =>
    `inline-flex min-h-[var(--target)] items-center rounded-[var(--radius-md)] px-[var(--space-4)] text-[length:var(--text-sm)] ${active ? "bg-[var(--accent)] text-[var(--accent-ink)]" : "bg-[var(--accent-blush)] text-[var(--ink)]"}`;
  const qs = (c?: string, ci?: string) => {
    const p = new URLSearchParams();
    if (c) p.set("category", c);
    if (ci) p.set("city", ci);
    const s = p.toString();
    return s ? `/vendors?${s}` : "/vendors";
  };

  return (
    <div className="flex min-h-screen flex-col bg-[var(--surface)] text-[var(--ink)]">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-[var(--space-4)] py-[var(--space-8)] sm:px-[var(--space-6)]">
        <h1 className="font-display text-[length:var(--text-2xl)]">
          {category ? t(`categories.${category}`) : t("allVendors")}
          {city ? ` · ${t(`cities.${city}`)}` : ""}
        </h1>

        <nav aria-label={t("service")} className="mt-[var(--space-4)] flex flex-wrap gap-[var(--space-2)]">
          <Link href={qs(undefined, city)} className={chip(!category)}>{t("all")}</Link>
          {CATEGORIES.map((c) => <Link key={c} href={qs(c, city)} className={chip(category === c)}>{t(`categories.${c}`)}</Link>)}
        </nav>
        <nav aria-label={t("city")} className="mt-[var(--space-2)] flex flex-wrap gap-[var(--space-2)]">
          <Link href={qs(category)} className={chip(!city)}>{t("anyCity")}</Link>
          {CITIES.map((c) => <Link key={c} href={qs(category, c)} className={chip(city === c)}>{t(`cities.${c}`)}</Link>)}
        </nav>

        {rows.length === 0 ? (
          <p className="mt-[var(--space-8)] max-w-[56ch] text-[var(--ink-muted)]">{t("empty")}</p>
        ) : (
          <ul className="mt-[var(--space-6)] grid gap-[var(--space-4)] sm:grid-cols-2 lg:grid-cols-3">
            {rows.map((v) => (
              <li key={v.id}>
                <Link href={`/vendors/${v.slug}`} className="block rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface-raised)] p-[var(--space-4)] transition-transform duration-[var(--dur-fast)] hover:-translate-y-0.5">
                  <div className="flex items-center gap-[var(--space-2)] text-[length:var(--text-sm)] text-[var(--accent)]">
                    <CategoryIcon category={v.category} size={16} />
                    {t(`categories.${v.category}`)} · {t.has(`cities.${v.city}`) ? t(`cities.${v.city}`) : v.city}
                  </div>
                  <p className="mt-[var(--space-2)] text-[length:var(--text-lg)] font-semibold">{v.name}</p>
                  {v.priceFromLkr ? <p className="mt-[var(--space-1)] text-[length:var(--text-sm)] text-[var(--ink-muted)]">{t("from", { price: formatLkr(v.priceFromLkr) })}</p> : null}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
