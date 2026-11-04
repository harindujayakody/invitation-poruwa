"use client";

import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { CULTURAL_TEMPLATES } from "@/lib/templates";
import { ArrowRight, Eye } from "lucide-react";

export function DesignsCarousel() {
  const locale = useLocale();

  return (
    <section id="templates" className="py-20 md:py-24 bg-[var(--surface)] border-b border-[var(--line)]">
      <div className="mx-auto max-w-6xl px-[var(--space-6)] md:px-[var(--space-12)]">
        {/* Section Header without repetitive eyebrow */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="space-y-3">
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--ink)]">
              {locale === "si"
                ? "ඔබගේ මංගල දිනයට ගැළපෙන ආරාධනා සැලසුම්"
                : locale === "ta"
                ? "உங்கள் திருமணத்திற்கான பிரத்தியேக வடிவமைப்புத் தொகுப்பு"
                : "40+ customizable designs for your special celebration"}
            </h2>
            <p className="text-base sm:text-lg text-[var(--ink-muted)] max-w-2xl leading-relaxed">
              {locale === "si"
                ? "පොරුව චාරිත්‍ර, පල්ලි විවාහ, හින්දු මුහුර්තම් සහ ඉස්ලාමීය නිකාහ් උත්සව සඳහා ශ්‍රී ලාංකීය සංස්කෘතික අනන්‍යතාවයන්ගෙන් සමන්විතයි."
                : locale === "ta"
                ? "பொருவா சடங்குகள், தேவாலயத் திருமணங்கள், இந்து முகூர்த்தம் மற்றும் இஸ்லாமிய நிக்காஹ் நிகழ்வுகளுக்காக வடிவமைக்கப்பட்டது."
                : "From ceremonial Kandyan Poruwa rituals to Church weddings, Hindu Muhurtham and Islamic Nikah celebrations."}
            </p>
          </div>

          <Link
            href="/templates"
            className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-6 py-3 text-sm font-semibold text-stone-800 shadow-xs hover:bg-stone-50 hover:border-stone-400 transition-all shrink-0 min-h-[44px]"
          >
            <span>{locale === "si" ? "සියලු සැලසුම් බලන්න" : locale === "ta" ? "அனைத்து வடிவமைப்புகளும்" : "Browse all designs"}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Horizontal scrollable carousel with generous cards */}
        <div className="mt-12 flex gap-6 overflow-x-auto pb-6 scrollbar-thin">
          {CULTURAL_TEMPLATES.map((tpl) => {
            const name = locale === "si" ? tpl.name.si : locale === "ta" ? tpl.name.ta : tpl.name.en;
            const desc = locale === "si" ? tpl.description.si : locale === "ta" ? tpl.description.ta : tpl.description.en;

            return (
              <div
                key={tpl.id}
                className="group relative flex-none w-[280px] sm:w-[310px] rounded-3xl border border-[var(--line)] bg-white p-4 sm:p-5 transition-all duration-200 hover:border-stone-400 hover:shadow-lg flex flex-col justify-between"
              >
                {/* Visual card container */}
                <div
                  className="relative h-72 w-full rounded-2xl p-5 flex flex-col justify-between overflow-hidden border border-black/5 shadow-inner"
                  style={{ backgroundColor: tpl.surfaceColor, color: tpl.inkColor }}
                >
                  <div
                    className="absolute top-0 left-0 h-1.5 w-full"
                    style={{ backgroundColor: tpl.accentColor }}
                  />

                  <div className="text-center pt-3">
                    <span
                      className="text-[11px] font-bold uppercase tracking-wider block"
                      style={{ color: tpl.accentColor }}
                    >
                      {tpl.category}
                    </span>
                    <h3 className="font-display mt-3 text-xl font-medium">
                      {locale === "si" ? "කසුන් & සඳුනි" : locale === "ta" ? "கசுன் & சந்துனி" : "Kasun & Sanduni"}
                    </h3>
                  </div>

                  <div className="border-t border-black/10 pt-3 text-xs opacity-75 text-center">
                    {tpl.defaultEvents.en[0]?.title || "Ceremony"} · Colombo
                  </div>
                </div>

                {/* Details */}
                <div className="mt-4 px-1">
                  <h4 className="text-base font-bold text-[var(--ink)]">{name}</h4>
                  <p className="mt-1 text-xs text-[var(--ink-muted)] line-clamp-2 leading-relaxed">{desc}</p>

                  <div className="mt-4 flex items-center justify-between pt-3 border-t border-[var(--line)]">
                    <div className="flex gap-1.5">
                      <span className="h-3.5 w-3.5 rounded-full border border-black/10" style={{ backgroundColor: tpl.accentColor }} />
                      <span className="h-3.5 w-3.5 rounded-full border border-black/10" style={{ backgroundColor: tpl.surfaceColor }} />
                      <span className="h-3.5 w-3.5 rounded-full border border-black/10" style={{ backgroundColor: tpl.inkColor }} />
                    </div>

                    <Link
                      href={`/samples/${tpl.id}`}
                      className="rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 px-4 py-2 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors min-h-[36px]"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>{locale === "si" ? "පෙරදසුන" : locale === "ta" ? "முன்னோட்டம்" : "Preview"}</span>
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
