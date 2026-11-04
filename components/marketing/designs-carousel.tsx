"use client";

import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { CULTURAL_TEMPLATES } from "@/lib/templates";
import { ArrowRight, Eye } from "lucide-react";

export function DesignsCarousel() {
  const locale = useLocale();

  return (
    <section id="templates" className="py-[var(--space-18)] bg-[var(--surface)] border-b border-[var(--line)]">
      <div className="mx-auto max-w-6xl px-[var(--space-6)] md:px-[var(--space-12)]">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <span className="text-[length:var(--text-xs)] font-bold tracking-widest text-rose-600 uppercase">
              CULTURAL COLLECTION
            </span>
            <h2 className="font-display mt-2 text-[length:var(--text-2xl)] font-bold tracking-tight text-[var(--ink)] sm:text-4xl">
              40+ customizable designs for your special celebration
            </h2>
            <p className="mt-2 text-[length:var(--text-base)] text-[var(--ink-muted)] max-w-xl">
              From ceremonial Kandyan Poruwa rituals to Church weddings, Hindu Muhurtham and Islamic Nikah celebrations.
            </p>
          </div>

          <Link
            href="/templates"
            className="inline-flex items-center gap-2 text-[length:var(--text-sm)] font-semibold text-rose-600 hover:text-rose-700 min-h-[var(--target)]"
          >
            <span>Browse all designs</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Horizontal scrollable carousel */}
        <div className="mt-[var(--space-8)] flex gap-[var(--space-5)] overflow-x-auto pb-4 scrollbar-thin">
          {CULTURAL_TEMPLATES.map((tpl) => {
            const name = locale === "si" ? tpl.name.si : locale === "ta" ? tpl.name.ta : tpl.name.en;
            const desc = locale === "si" ? tpl.description.si : locale === "ta" ? tpl.description.ta : tpl.description.en;

            return (
              <div
                key={tpl.id}
                className="group relative flex-none w-[260px] sm:w-[280px] rounded-2xl border border-[var(--line)] bg-[var(--surface-sunken)] p-3 transition-all hover:border-stone-400 hover:shadow-md"
              >
                {/* Visual card container */}
                <div
                  className="relative h-64 w-full rounded-xl p-4 flex flex-col justify-between overflow-hidden border border-black/5"
                  style={{ backgroundColor: tpl.surfaceColor, color: tpl.inkColor }}
                >
                  <div
                    className="absolute top-0 left-0 h-1.5 w-full"
                    style={{ backgroundColor: tpl.accentColor }}
                  />

                  <div className="text-center pt-2">
                    <span
                      className="text-[10px] font-semibold uppercase tracking-wider block"
                      style={{ color: tpl.accentColor }}
                    >
                      {tpl.category}
                    </span>
                    <h3 className="font-display mt-2 text-lg font-medium">
                      {locale === "si" ? "කසුන් & සඳුනි" : "Kasun & Sanduni"}
                    </h3>
                  </div>

                  <div className="border-t border-black/10 pt-2 text-[10px] opacity-75 text-center">
                    {tpl.defaultEvents.en[0]?.title || "Ceremony"} · Colombo
                  </div>
                </div>

                {/* Details */}
                <div className="mt-3 px-1">
                  <h4 className="text-sm font-semibold text-[var(--ink)]">{name}</h4>
                  <p className="mt-0.5 text-xs text-[var(--ink-muted)] line-clamp-2">{desc}</p>

                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-[var(--line)]">
                    <div className="flex gap-1.5">
                      <span className="h-3 w-3 rounded-full border border-black/10" style={{ backgroundColor: tpl.accentColor }} />
                      <span className="h-3 w-3 rounded-full border border-black/10" style={{ backgroundColor: tpl.surfaceColor }} />
                      <span className="h-3 w-3 rounded-full border border-black/10" style={{ backgroundColor: tpl.inkColor }} />
                    </div>

                    <Link
                      href={`/samples/${tpl.id}`}
                      className="text-xs font-semibold text-rose-600 hover:underline inline-flex items-center gap-1"
                    >
                      <Eye className="h-3 w-3" />
                      Preview
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
