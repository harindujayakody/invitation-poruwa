"use client";

import { useLocale } from "next-intl";
import { Check, X, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

export function CostComparison() {
  const locale = useLocale();

  const isSinhala = locale === "si";
  const isTamil = locale === "ta";

  return (
    <section className="py-20 md:py-28 bg-[var(--surface-sunken)] border-b border-[var(--line)]">
      <div className="mx-auto max-w-5xl px-[var(--space-6)] md:px-[var(--space-12)]">
        {/* Section Header without repetitive eyebrow */}
        <div className="text-left md:text-center max-w-3xl mx-auto space-y-4">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--ink)]">
            {isSinhala
              ? "මුද්‍රිත කාඩ්පත් සඳහා වැයවන රු. 70,000 කට අධික මුදලක් ඉතිරි කරගන්න"
              : isTamil
              ? "அச்சிடப்படும் அழைப்பிதழ்களுடன் ஒப்பிடுகையில் ரூ. 70,000 வரை சேமிக்கலாம்"
              : "Save over Rs. 70,000 compared to printed wedding cards"}
          </h2>
          <p className="text-base sm:text-lg text-[var(--ink-muted)] leading-relaxed">
            {isSinhala
              ? "ශ්‍රී ලංකාවේ අමුත්තන් 300 කට කාඩ්පත් මුද්‍රණය කිරීමට කඩදාසි, මුද්‍රණ ගාස්තු, ලියුම් කවර සහ කාඩ්පත් බෙදීමට යන ගමන් වියදම් සඳහා විශාල මුදලක් වැයවේ."
              : isTamil
              ? "300 விருந்தினர்களுக்கான அழைப்பிதழ்களை அச்சிடுதல், உறைகள் மற்றும் வீடுகளுக்கு சென்று வழங்குவதற்கான பயணச் செலவு என பெரும் தொகை விரயமாகிறது."
              : "Printing 300 wedding cards in Sri Lanka costs a fortune in paper, custom calligraphy, envelopes, and days wasted delivering cards in traffic."}
          </p>
        </div>

        {/* Side-by-Side Comparison Cards with Generous Paddings */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Traditional Printed Cards */}
          <div className="rounded-3xl border border-stone-300 bg-white p-8 sm:p-10 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-stone-200 pb-5">
                <div>
                  <h3 className="font-display text-xl font-bold text-stone-800">
                    Traditional Printed Cards
                  </h3>
                  <p className="text-xs text-stone-500 mt-1">300 Guests in Sri Lanka</p>
                </div>
                <span className="text-2xl font-bold text-stone-700">
                  Rs. 75,000+
                </span>
              </div>

              <ul className="mt-7 space-y-4 text-sm text-stone-700">
                <li className="flex items-start gap-3">
                  <X className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                  <span>Printing & embossed parchment paper: Rs. 45,000 - 65,000</span>
                </li>
                <li className="flex items-start gap-3">
                  <X className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                  <span>Custom envelopes & wax seals: Rs. 15,000</span>
                </li>
                <li className="flex items-start gap-3">
                  <X className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                  <span>Fuel, courier & weeks delivering cards: Rs. 15,000+</span>
                </li>
                <li className="flex items-start gap-3">
                  <X className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                  <span>Zero RSVP tracking (couples must call everyone)</span>
                </li>
                <li className="flex items-start gap-3">
                  <X className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                  <span>Date or timing change requires 100% full reprint</span>
                </li>
              </ul>
            </div>

            <div className="mt-9 pt-5 border-t border-stone-100 text-xs text-stone-500">
              Average delivery time: 3 - 4 weeks of coordination
            </div>
          </div>

          {/* Suba.lk Digital Wedding Platform */}
          <div className="relative rounded-3xl border-2 border-rose-600 bg-white p-8 sm:p-10 shadow-xl flex flex-col justify-between">
            <div className="absolute -top-3.5 right-8 rounded-full bg-rose-600 px-4 py-1 text-xs font-bold text-white uppercase tracking-wider shadow-sm">
              93% SAVINGS
            </div>

            <div>
              <div className="flex items-center justify-between border-b border-stone-200 pb-5">
                <div>
                  <h3 className="font-display text-xl font-bold text-stone-900">
                    Suba.lk Digital Platform
                  </h3>
                  <p className="text-xs text-rose-600 font-semibold mt-1">One-time payment, publish forever</p>
                </div>
                <div>
                  <span className="text-3xl font-extrabold text-rose-600">
                    Rs. 4,900
                  </span>
                  <span className="block text-xs text-stone-500 text-right">one-off</span>
                </div>
              </div>

              <ul className="mt-7 space-y-4 text-sm text-stone-800">
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" strokeWidth={2.5} />
                  <span className="font-semibold text-stone-900">Unlimited guests via personal WhatsApp links</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" strokeWidth={2.5} />
                  <span>Live RSVP headcount & dietary requirement tracking</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" strokeWidth={2.5} />
                  <span>Interactive seating charts & reception entrance QR easel</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" strokeWidth={2.5} />
                  <span>Live guest photo stream & ceremonial background music</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" strokeWidth={2.5} />
                  <span>Instant edits and updates right from your phone anytime</span>
                </li>
              </ul>
            </div>

            {/* Generous Primary Action Button */}
            <div className="mt-8 pt-4">
              <Link
                href="/login?mode=signup"
                className="inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-rose-600 px-8 py-4 text-base font-bold text-white shadow-md transition-all duration-200 hover:bg-rose-700 hover:shadow-lg min-h-[50px]"
              >
                <span>{isSinhala ? "නොමිලේ ඔබේ ආරාධනය අරඹන්න" : isTamil ? "இலவசமாகத் தொடங்குங்கள்" : "Start free now"}</span>
                <ArrowRight className="h-4.5 w-4.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
