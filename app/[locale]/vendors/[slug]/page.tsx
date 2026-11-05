import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { and, asc, eq } from "drizzle-orm";
import { MessageCircle } from "lucide-react";
import { db } from "@/db";
import { vendorPackages, vendors } from "@/db/schema";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { CategoryIcon } from "@/components/hub/category-icon";
import { requestQuoteAction } from "@/app/actions/quote";
import { formatLkr } from "@/lib/vendors";

export const instant = false;

interface Props {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<{ quote?: string }>;
}

export default async function VendorPage({ params, searchParams }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("hub");
  const { quote } = await searchParams;

  const [vendor] = await db.select().from(vendors).where(and(eq(vendors.slug, slug), eq(vendors.published, true))).limit(1);
  if (!vendor) notFound();
  const packages = await db.select().from(vendorPackages).where(eq(vendorPackages.vendorId, vendor.id)).orderBy(asc(vendorPackages.sortOrder));

  const field = "min-h-[var(--target)] w-full rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-raised)] px-[var(--space-3)] text-[length:var(--text-base)]";
  const label = "mb-[var(--space-1)] block text-[length:var(--text-sm)] font-medium";
  const cityName = t.has(`cities.${vendor.city}`) ? t(`cities.${vendor.city}`) : vendor.city;

  return (
    <div className="flex min-h-screen flex-col bg-[var(--surface)] text-[var(--ink)]">
      <SiteHeader />
      <main className="mx-auto grid w-full max-w-6xl flex-1 gap-[var(--space-8)] px-[var(--space-4)] py-[var(--space-8)] sm:px-[var(--space-6)] lg:grid-cols-[1.4fr_1fr]">
        <div>
          <p className="flex items-center gap-[var(--space-2)] text-[length:var(--text-sm)] text-[var(--accent)]">
            <CategoryIcon category={vendor.category} size={16} /> {t(`categories.${vendor.category}`)} · {cityName}
            {vendor.verified ? <span className="ml-[var(--space-2)] rounded-[var(--radius-sm)] bg-[var(--accent-mint)] px-[var(--space-2)] text-[var(--success)]">{t("verified")}</span> : null}
          </p>
          <h1 className="mt-[var(--space-2)] font-display text-[length:var(--text-2xl)]">{vendor.name}</h1>
          {vendor.description ? <p className="mt-[var(--space-3)] max-w-[60ch] text-[var(--ink-muted)]">{vendor.description}</p> : null}

          <h2 className="mt-[var(--space-8)] text-[length:var(--text-lg)] font-semibold">{t("packages")}</h2>
          <ul className="mt-[var(--space-3)] grid gap-[var(--space-3)]">
            {packages.map((p) => (
              <li key={p.id} className="rounded-[var(--radius-lg)] bg-[var(--accent-blush)] p-[var(--space-4)]">
                <div className="flex items-baseline justify-between gap-[var(--space-4)]">
                  <span className="font-semibold">{p.name}</span>
                  <span className="font-semibold tabular-nums">{formatLkr(p.priceLkr)}</span>
                </div>
                {p.includes ? <p className="mt-[var(--space-1)] text-[length:var(--text-sm)] text-[var(--ink-muted)]">{p.includes}</p> : null}
              </li>
            ))}
          </ul>
          {vendor.whatsapp ? (
            <a href={`https://wa.me/${vendor.whatsapp}`} className="mt-[var(--space-4)] inline-flex min-h-[var(--target)] items-center gap-[var(--space-2)] text-[length:var(--text-sm)] text-[var(--ink)] underline">
              <MessageCircle size={16} strokeWidth={1.5} aria-hidden /> {t("whatsapp")}
            </a>
          ) : null}
        </div>

        <section id="quote" className="h-fit rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface-raised)] p-[var(--space-6)]">
          <h2 className="text-[length:var(--text-lg)] font-semibold">{t("quoteTitle")}</h2>
          {quote === "sent" ? (
            <p role="status" className="mt-[var(--space-3)] rounded-[var(--radius-md)] bg-[var(--accent-mint)] p-[var(--space-3)] text-[var(--success)]">{t("quoteSent")}</p>
          ) : (
            <form action={requestQuoteAction} className="mt-[var(--space-4)] grid gap-[var(--space-3)]">
              {quote === "invalid" || quote === "limit" ? (
                <p role="alert" className="text-[length:var(--text-sm)] text-[var(--danger)]">{t(quote === "invalid" ? "quoteInvalid" : "quoteLimit")}</p>
              ) : null}
              <input type="hidden" name="locale" value={locale} />
              <input type="hidden" name="slug" value={vendor.slug} />
              <div><label className={label} htmlFor="q-name">{t("yourName")}</label><input id="q-name" name="name" required minLength={2} maxLength={80} className={field} /></div>
              <div><label className={label} htmlFor="q-phone">{t("phone")}</label><input id="q-phone" name="phone" type="tel" inputMode="tel" required placeholder="077 123 4567" className={field} /></div>
              <div className="grid grid-cols-2 gap-[var(--space-3)]">
                <div><label className={label} htmlFor="q-date">{t("date")}</label><input id="q-date" name="eventDate" type="date" className={field} /></div>
                <div><label className={label} htmlFor="q-guests">{t("guests")}</label><input id="q-guests" name="guestCount" type="number" min={1} max={5000} className={field} /></div>
              </div>
              <div><label className={label} htmlFor="q-msg">{t("message")}</label><textarea id="q-msg" name="message" maxLength={1000} rows={3} className={`${field} py-[var(--space-2)]`} /></div>
              <button className="min-h-[var(--target)] rounded-[var(--radius-md)] bg-[var(--accent)] font-semibold text-[var(--accent-ink)]">{t("sendQuote")}</button>
              <p className="text-[length:var(--text-xs)] text-[var(--ink-muted)]">{t("quotePrivacy")}</p>
            </form>
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
