import { headers } from "next/headers";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { asc, desc, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { quoteRequests, vendorBlockedDates, vendorPackages, vendors } from "@/db/schema";
import { auth } from "@/lib/auth";
import { Link } from "@/i18n/navigation";
import { CATEGORIES, CITIES, formatLkr } from "@/lib/vendors";
import {
  addPackageAction, blockDateAction, createVendorAction, deletePackageAction, setQuoteStatusAction, unblockDateAction,
} from "@/app/actions/vendor";

export const instant = false;

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ s?: string }>;
}

const field = "min-h-[var(--target)] w-full rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-raised)] px-[var(--space-3)] text-[length:var(--text-base)]";
const label = "mb-[var(--space-1)] block text-[length:var(--text-sm)] font-medium";
const primary = "min-h-[var(--target)] rounded-[var(--radius-pill)] bg-[var(--accent)] px-[var(--space-6)] text-[length:var(--text-sm)] font-semibold text-[var(--accent-ink)]";
const quiet = "min-h-[var(--target)] rounded-[var(--radius-pill)] border border-[var(--line)] px-[var(--space-4)] text-[length:var(--text-sm)]";
const card = "rounded-[var(--radius-lg)] bg-[var(--surface-raised)] p-[var(--space-6)] shadow-[0_1px_2px_oklch(0_0_0/0.04),0_8px_24px_oklch(0_0_0/0.04)]";

/** Vendor dashboard. The /app layout already requires a session; every query is scoped to the owner. */
export default async function VendorDashboard({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, th] = await Promise.all([getTranslations("vendorTools"), getTranslations("hub")]);
  const { s } = await searchParams;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;

  const mine = await db.select().from(vendors).where(eq(vendors.ownerId, session.user.id)).orderBy(asc(vendors.createdAt));
  const ids = mine.map((v) => v.id);
  const [pkgs, blocked, quotes] = ids.length
    ? await Promise.all([
        db.select().from(vendorPackages).where(inArray(vendorPackages.vendorId, ids)).orderBy(asc(vendorPackages.sortOrder)),
        db.select().from(vendorBlockedDates).where(inArray(vendorBlockedDates.vendorId, ids)).orderBy(asc(vendorBlockedDates.date)),
        db.select().from(quoteRequests).where(inArray(quoteRequests.vendorId, ids)).orderBy(desc(quoteRequests.createdAt)).limit(100),
      ])
    : [[], [], []];
  const hidden = (vendorId: string) => (
    <>
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="vendorId" value={vendorId} />
    </>
  );

  return (
    <div className="mx-auto grid max-w-4xl gap-[var(--space-8)]">
      <header>
        <h1 className="font-display text-[length:var(--text-2xl)]">{t("title")}</h1>
        <p className="mt-[var(--space-2)] max-w-[60ch] text-[var(--ink-muted)]">{t("intro")}</p>
        {s ? <p role="status" className="mt-[var(--space-3)] text-[length:var(--text-sm)] text-[var(--ink-muted)]">{t(`status.${s}`)}</p> : null}
      </header>

      {mine.map((v) => {
        const vq = quotes.filter((q) => q.vendorId === v.id);
        return (
          <section key={v.id} className="grid gap-[var(--space-4)]">
            <div className={card}>
              <div className="flex flex-wrap items-baseline justify-between gap-[var(--space-3)]">
                <h2 className="text-[length:var(--text-xl)] font-semibold">{v.name}</h2>
                <span className="text-[length:var(--text-sm)] text-[var(--ink-muted)]">
                  {th(`categories.${v.category}`)} · {v.published ? t("live") : t("pending")}
                </span>
              </div>
              {v.published ? <Link href={`/vendors/${v.slug}`} className="mt-[var(--space-2)] inline-block text-[length:var(--text-sm)] underline">{t("viewPublic")}</Link> : null}
            </div>

            <div className={card}>
              <h3 className="font-semibold">{t("quotes")} ({vq.length})</h3>
              {vq.length === 0 ? <p className="mt-[var(--space-2)] text-[var(--ink-muted)]">{t("noQuotes")}</p> : (
                <ul className="mt-[var(--space-3)] grid gap-[var(--space-3)]">
                  {vq.map((q) => (
                    <li key={q.id} className="rounded-[var(--radius-md)] bg-[var(--accent-blush)] p-[var(--space-4)]">
                      <div className="flex flex-wrap justify-between gap-[var(--space-2)]">
                        <strong>{q.name}</strong>
                        <span className="text-[length:var(--text-sm)] text-[var(--ink-muted)]">{q.eventDate ?? "—"} · {q.guestCount ?? "—"} {th("guests")}</span>
                      </div>
                      {q.message ? <p className="mt-[var(--space-1)] text-[length:var(--text-sm)]">{q.message}</p> : null}
                      <div className="mt-[var(--space-3)] flex flex-wrap items-center gap-[var(--space-2)]">
                        <a href={`https://wa.me/${q.phone}`} className={primary + " inline-flex items-center"}>{t("replyWhatsapp")}</a>
                        {(["replied", "closed"] as const).filter((st) => st !== q.status).map((st) => (
                          <form key={st} action={setQuoteStatusAction}>
                            {hidden(v.id)}
                            <input type="hidden" name="id" value={q.id} />
                            <input type="hidden" name="status" value={st} />
                            <button className={quiet}>{t(`mark.${st}`)}</button>
                          </form>
                        ))}
                        <span className="text-[length:var(--text-xs)] text-[var(--ink-muted)]">{t(`quoteStatus.${q.status}`)}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="grid gap-[var(--space-4)] md:grid-cols-2">
              <div className={card}>
                <h3 className="font-semibold">{th("packages")}</h3>
                <ul className="mt-[var(--space-3)] grid gap-[var(--space-2)]">
                  {pkgs.filter((p) => p.vendorId === v.id).map((p) => (
                    <li key={p.id} className="flex items-center justify-between gap-[var(--space-2)]">
                      <span>{p.name} · <span className="tabular-nums">{formatLkr(p.priceLkr)}</span></span>
                      <form action={deletePackageAction}>{hidden(v.id)}<input type="hidden" name="id" value={p.id} /><button className={quiet}>{t("remove")}</button></form>
                    </li>
                  ))}
                </ul>
                <form action={addPackageAction} className="mt-[var(--space-4)] grid gap-[var(--space-3)]">
                  {hidden(v.id)}
                  <div><label className={label} htmlFor={`pn-${v.id}`}>{t("packageName")}</label><input id={`pn-${v.id}`} name="name" required minLength={2} maxLength={80} className={field} /></div>
                  <div><label className={label} htmlFor={`pp-${v.id}`}>{t("price")}</label><input id={`pp-${v.id}`} name="priceLkr" type="number" min={0} required className={field} /></div>
                  <div><label className={label} htmlFor={`pi-${v.id}`}>{t("includes")}</label><input id={`pi-${v.id}`} name="includes" maxLength={300} className={field} /></div>
                  <button className={primary}>{t("addPackage")}</button>
                </form>
              </div>

              <div className={card}>
                <h3 className="font-semibold">{t("blockedDates")}</h3>
                <ul className="mt-[var(--space-3)] grid gap-[var(--space-2)]">
                  {blocked.filter((b) => b.vendorId === v.id).map((b) => (
                    <li key={b.id} className="flex items-center justify-between gap-[var(--space-2)]">
                      <span className="tabular-nums">{b.date}</span>
                      <form action={unblockDateAction}>{hidden(v.id)}<input type="hidden" name="id" value={b.id} /><button className={quiet}>{t("remove")}</button></form>
                    </li>
                  ))}
                </ul>
                <form action={blockDateAction} className="mt-[var(--space-4)] flex flex-wrap items-end gap-[var(--space-2)]">
                  {hidden(v.id)}
                  <div className="flex-1"><label className={label} htmlFor={`bd-${v.id}`}>{th("date")}</label><input id={`bd-${v.id}`} name="date" type="date" required className={field} /></div>
                  <button className={primary}>{t("blockDate")}</button>
                </form>
              </div>
            </div>
          </section>
        );
      })}

      <section className={card}>
        <h2 className="text-[length:var(--text-xl)] font-semibold">{mine.length ? t("addAnother") : t("listBusiness")}</h2>
        <form action={createVendorAction} className="mt-[var(--space-4)] grid gap-[var(--space-3)] md:grid-cols-2">
          <input type="hidden" name="locale" value={locale} />
          <div className="md:col-span-2"><label className={label} htmlFor="v-name">{t("businessName")}</label><input id="v-name" name="name" required minLength={2} maxLength={80} className={field} /></div>
          <div><label className={label} htmlFor="v-cat">{th("service")}</label>
            <select id="v-cat" name="category" className={field}>{CATEGORIES.map((c) => <option key={c} value={c}>{th(`categories.${c}`)}</option>)}</select></div>
          <div><label className={label} htmlFor="v-city">{th("city")}</label>
            <select id="v-city" name="city" className={field}>{CITIES.map((c) => <option key={c} value={c}>{th(`cities.${c}`)}</option>)}</select></div>
          <div><label className={label} htmlFor="v-wa">{t("whatsapp")}</label><input id="v-wa" name="whatsapp" type="tel" placeholder="077 123 4567" className={field} /></div>
          <div><label className={label} htmlFor="v-price">{t("priceFrom")}</label><input id="v-price" name="priceFromLkr" type="number" min={0} className={field} /></div>
          <div className="md:col-span-2"><label className={label} htmlFor="v-desc">{t("description")}</label><textarea id="v-desc" name="description" rows={3} maxLength={1500} className={`${field} py-[var(--space-2)]`} /></div>
          <div className="md:col-span-2 flex flex-wrap items-center gap-[var(--space-3)]">
            <button className={primary}>{t("submit")}</button>
            <span className="text-[length:var(--text-xs)] text-[var(--ink-muted)]">{t("reviewNote")}</span>
          </div>
        </form>
      </section>
    </div>
  );
}
