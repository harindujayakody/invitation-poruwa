"use client";

import { Check, X } from "lucide-react";
import { Link } from "@/i18n/navigation";

export function CostComparison() {
  return (
    <section className="py-[var(--space-18)] bg-[var(--surface-sunken)] border-b border-[var(--line)]">
      <div className="mx-auto max-w-5xl px-[var(--space-6)] md:px-[var(--space-12)]">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[length:var(--text-xs)] font-bold tracking-widest text-emerald-600 uppercase">
            MASSIVE SAVINGS
          </span>
          <h2 className="font-display text-[length:var(--text-3xl)] font-bold tracking-tight text-[var(--ink)] sm:text-4xl">
            Save over Rs. 70,000 compared to printed wedding cards
          </h2>
          <p className="text-[length:var(--text-base)] text-[var(--ink-muted)]">
            Printing 300 wedding cards in Sri Lanka costs a fortune in paper, custom calligraphy, envelopes, and days wasted delivering cards in traffic.
          </p>
        </div>

        <div className="mt-[var(--space-12)] grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Traditional Printed Cards */}
          <div className="rounded-2xl border border-stone-300 bg-white p-7 opacity-85 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-stone-200 pb-4">
                <div>
                  <h3 className="font-display text-lg font-semibold text-stone-800">
                    Traditional Printed Cards
                  </h3>
                  <p className="text-xs text-stone-700">300 Guests in Sri Lanka</p>
                </div>
                <span className="text-xl font-bold text-stone-700">
                  Rs. 75,000+
                </span>
              </div>

              <ul className="mt-6 space-y-3 text-xs text-stone-800">
                <li className="flex items-center gap-2.5">
                  <X className="h-4 w-4 text-red-500 shrink-0" />
                  <span>Printing & embossed parchment paper: Rs. 45,000 - 65,000</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <X className="h-4 w-4 text-red-500 shrink-0" />
                  <span>Envelopes & custom gold wax seals: Rs. 15,000</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <X className="h-4 w-4 text-red-500 shrink-0" />
                  <span>Fuel, couriers & weeks spent traveling: Rs. 15,000+</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <X className="h-4 w-4 text-red-500 shrink-0" />
                  <span>Zero RSVP tracking (couples have to call everyone)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <X className="h-4 w-4 text-red-500 shrink-0" />
                  <span>Corrections or date change requires 100% reprint</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-stone-100 text-xs text-stone-700">
              Average turnaround time: 3 - 4 weeks
            </div>
          </div>

          {/* Invitation.lk Digital Wedding */}
          <div className="relative rounded-2xl border-2 border-rose-600 bg-white p-7 shadow-xl flex flex-col justify-between">
            <div className="absolute -top-3.5 right-6 rounded-full bg-rose-600 px-3.5 py-0.5 text-[11px] font-bold text-white uppercase tracking-wider shadow-sm">
              93% SAVINGS
            </div>

            <div>
              <div className="flex items-center justify-between border-b border-stone-200 pb-4">
                <div>
                  <h3 className="font-display text-lg font-bold text-stone-900">
                    Invitation.lk Digital Platform
                  </h3>
                  <p className="text-xs text-stone-700">One-time payment, publish forever</p>
                </div>
                <div>
                  <span className="text-2xl font-extrabold text-rose-600">
                    Rs. 4,900
                  </span>
                  <span className="block text-[10px] text-stone-700 text-right">one-off</span>
                </div>
              </div>

              <ul className="mt-6 space-y-3 text-xs text-stone-800">
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span className="font-medium text-stone-900">Unlimited guests via personal WhatsApp links</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Live RSVP headcount & dietary requirement tracking</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Interactive seating charts & reception entrance QR sign</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Live guest photo stream & ceremonial flute audio</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Instant edits anytime right from your phone</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-stone-100 flex items-center justify-between">
              <span className="text-xs text-stone-700 font-medium">Ready in under 10 minutes</span>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-full bg-rose-600 px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-rose-700"
              >
                Start free now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
