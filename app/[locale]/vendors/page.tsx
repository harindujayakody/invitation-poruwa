import { getTranslations, setRequestLocale } from "next-intl/server";
import { and, asc, eq, type SQL } from "drizzle-orm";
import { ShieldCheck } from "lucide-react";
import { db } from "@/db";
import { vendorBlockedDates, vendors } from "@/db/schema";
import { Link } from "@/i18n/navigation";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { CategoryIcon } from "@/components/hub/category-icon";
import { TINTS } from "@/components/hub/hub-home";
import { TabBar } from "@/components/hub/tab-bar";
import { CATEGORIES, CITIES, formatLkr, type Category } from "@/lib/vendors";

export const instant = false;

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string; city?: string; date?: string; free?: string }>;
}

export default async function VendorsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("hub");
  const sp = await searchParams;
  const category = CATEGORIES.includes(sp.category as Category) ? (sp.category as Category) : undefined;
  const city = (CITIES as readonly string[]).includes(sp.city ?? "") ? sp.city : undefined;
  const date = sp.date && /^\d{4}-\d{2}-\d{2}$/.test(sp.date) ? sp.date : undefined;
  const freeOnly = Boolean(date) && sp.free === "1";

  const where: SQL[] = [eq(vendors.published, true)];
  if (category) where.push(eq(vendors.category, category));
  if (city) where.push(eq(vendors.city, city));
  // shortcut: no pagination; add limit/offset once a category passes ~100 vendors.
  const [all, blocked] = await Promise.all([
    db.select().from(vendors).where(and(...where)).orderBy(asc(vendors.name)).limit(100),
    date ? db.select({ vendorId: vendorBlockedDates.vendorId }).from(vendorBlockedDates).where(eq(vendorBlockedDates.date, date)) : Promise.resolve([]),
  ]);
  const booked = new Set(blocked.map((b) => b.vendorId));
  const rows = freeOnly ? all.filter((v) => !booked.has(v.id)) : all;

  const chip = (active: boolean) =>
    `inline-flex min-h-[var(--target)] items-center whitespace-nowrap rounded-[var(--radius-pill)] px-[var(--space-4)] text-[length:var(--text-sm)] font-bold ${active ? "bg-[var(--ink)] text-[var(--surface)]" : "border border-[var(--line)] bg-[var(--surface-raised)] text-[var(--ink)]"}`;
  const qs = (o: { category?: string; city?: string; free?: boolean }, path = "/vendors") => {
    const p = new URLSearchParams();
    if (o.category) p.set("category", o.category);
    if (o.city) p.set("city", o.city);
    if (date) p.set("date", date);
    if (o.free) p.set("free", "1");
    const s = p.toString();
    return s ? `${path}?${s}` : path;
  };
  const cityName = (c: string) => (t.has(`cities.${c}`) ? t(`cities.${c}`) : c);
  const status = "rounded-[var(--radius-pill)] px-[var(--space-3)] py-0.5 text-[length:var(--text-xs)] font-bold";

  return (
    <div className="flex min-h-screen flex-col bg-[var(--surface)] text-[var(--ink)]">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-[var(--space-4)] py-[var(--space-8)] sm:px-[var(--space-6)]">
        <h1 className="font-display text-[length:var(--text-2xl)]">
          {category ? t(`categories.${category}`) : t("allVendors")}
          {city ? ` · ${cityName(city)}` : ""}
        </h1>

        <form className="mt-[var(--space-4)] flex flex-wrap items-end gap-[var(--space-2)]">
          {category ? <input type="hidden" name="category" value={category} /> : null}
          {city ? <input type="hidden" name="city" value={city} /> : null}
          <label className="flex flex-col gap-0.5 rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-raised)] px-[var(--space-3)] py-[var(--space-1)] text-[length:var(--text-xs)] font-bold text-[var(--ink-muted)]">
            {t("yourDate")}
            <input type="date" name="date" defaultValue={date} className="min-h-7 bg-transparent text-[length:var(--text-base)] font-semibold text-[var(--ink)]" />
          </label>
          {/* The button toggles the filter: submitting while it is on turns it off */}
          <input type="hidden" name="free" value={freeOnly ? "0" : "1"} />
          <button aria-pressed={freeOnly} className={chip(freeOnly)}>{t("freeOnly")}</button>
        </form>

        <nav aria-label={t("service")} className="mt-[var(--space-4)] flex flex-wrap gap-[var(--space-2)]">
          <Link href={qs({ city, free: freeOnly })} className={chip(!category)}>{t("all")}</Link>
          {CATEGORIES.map((c) => <Link key={c} href={qs({ category: c, city, free: freeOnly })} className={chip(category === c)}>{t(`categories.${c}`)}</Link>)}
        </nav>
        <nav aria-label={t("city")} className="mt-[var(--space-2)] flex flex-wrap gap-[var(--space-2)]">
          <Link href={qs({ category, free: freeOnly })} className={chip(!city)}>{t("anyCity")}</Link>
          {CITIES.map((c) => <Link key={c} href={qs({ category, city: c, free: freeOnly })} className={chip(city === c)}>{cityName(c)}</Link>)}
        </nav>

        {rows.length === 0 ? (
          <p className="mt-[var(--space-8)] max-w-[56ch] text-[var(--ink-muted)]">{t("empty")}</p>
        ) : (
          <ul className="mt-[var(--space-6)] grid gap-[var(--space-4)] sm:grid-cols-2 lg:grid-cols-3">
            {rows.map((v) => (
              <li key={v.id}>
                <Link
                  href={qs({}, `/vendors/${v.slug}`)}
                  className="flex h-full flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface-raised)] transition-transform duration-[var(--dur-fast)] hover:-translate-y-0.5"
                >
                  {/* Tinted cover until vendors can upload photos (needs R2 storage) */}
                  <div className={`flex h-28 items-end justify-between p-[var(--space-3)] ${TINTS[CATEGORIES.indexOf(v.category) % 3]}`}>
                    <CategoryIcon category={v.category} size={24} />
                    {v.verified ? (
                      <span className={`inline-flex items-center gap-1 bg-[var(--surface-raised)] text-[var(--success)] ${status}`}>
                        <ShieldCheck size={16} strokeWidth={1.5} aria-hidden /> {t("verified")}
                      </span>
                    ) : null}
                  </div>
                  <div className="flex flex-1 flex-col gap-[var(--space-1)] p-[var(--space-4)]">
                    <p className="font-display text-[length:var(--text-lg)] font-extrabold">{v.name}</p>
                    <p className="text-[length:var(--text-sm)] text-[var(--ink-muted)]">{t(`categories.${v.category}`)} · {cityName(v.city)}</p>
                    <div className="mt-auto flex flex-wrap items-center justify-between gap-[var(--space-2)] pt-[var(--space-2)]">
                      {v.priceFromLkr ? <span className="text-[length:var(--text-sm)] font-semibold tabular-nums">{t("from", { price: formatLkr(v.priceFromLkr) })}</span> : <span />}
                      {date ? (
                        booked.has(v.id)
                          ? <span className={`bg-[var(--muted)] text-[var(--ink-muted)] ${status}`}>{t("dateBooked")}</span>
                          : <span className={`bg-[var(--accent-mint)] text-[var(--success)] ${status}`}>{t("dateFree")}</span>
                      ) : null}
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
      <SiteFooter />
      <TabBar active="vendors" />
    </div>
  );
}
