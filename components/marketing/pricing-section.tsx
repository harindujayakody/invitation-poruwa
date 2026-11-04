"use client";

import { Check, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

export function PricingSection() {
  const plans = [
    {
      name: "Essential",
      price: "Rs. 2,900",
      desc: "Perfect for intimate gatherings and single-event ceremonies.",
      features: [
        "Single digital invitation site",
        "Up to 150 guests with WhatsApp links",
        "Real-time RSVP headcount tracker",
        "Auspicious Nakath times & venue maps",
        "Bilingual typography (Sinhala, Tamil, English)",
      ],
      popular: false,
      cta: "Choose Essential",
    },
    {
      name: "Complete",
      price: "Rs. 4,900",
      desc: "Our most popular package for traditional Sri Lankan celebrations.",
      features: [
        "Unlimited guests & WhatsApp links",
        "Interactive Seating Plan & Table Finder",
        "Reception Entrance Print-Ready QR Easel",
        "Live Guest Photo Stream & moderation",
        "WhatsApp Delivery Tracking & Reminders",
        "Multi-event timeline (Poruwa, Reception, Homecoming)",
      ],
      popular: true,
      cta: "Choose Complete",
    },
    {
      name: "Signature Concierge",
      price: "Rs. 8,900",
      desc: "Full bespoke artisan service with personal Colombo designer assistance.",
      features: [
        "Everything in Complete plan",
        "1 Complimentary custom hand-drawn artwork",
        "Custom Sinhala/Tamil Nakath calligraphy",
        "Dedicated WhatsApp wedding coordinator",
        "Priority 24-hour turnaround",
      ],
      popular: false,
      cta: "Choose Signature",
    },
  ];

  return (
    <section id="pricing" className="py-[var(--space-18)] bg-[var(--surface-sunken)] border-b border-[var(--line)]">
      <div className="mx-auto max-w-6xl px-[var(--space-6)] md:px-[var(--space-12)]">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[length:var(--text-xs)] font-bold tracking-widest text-rose-600 uppercase">
            CLEAR & HONEST PRICING
          </span>
          <h2 className="font-display text-[length:var(--text-3xl)] font-bold tracking-tight text-[var(--ink)] sm:text-4xl">
            One-time payment. No hidden subscriptions.
          </h2>
          <p className="text-[length:var(--text-base)] text-[var(--ink-muted)]">
            Free to build and preview your invitation. Pay once via PayHere when you are ready to publish and send to guests.
          </p>
        </div>

        <div className="mt-[var(--space-12)] grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((p, idx) => (
            <div
              key={idx}
              className={`relative rounded-3xl p-7 flex flex-col justify-between transition-all duration-200 ${
                p.popular
                  ? "border-2 border-rose-600 bg-white shadow-xl scale-105 z-10"
                  : "border border-stone-200 bg-white/80 shadow-xs"
              }`}
            >
              {p.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-rose-600 px-4 py-1 text-[11px] font-bold text-white uppercase tracking-wider shadow-sm">
                  MOST POPULAR
                </div>
              )}

              <div>
                <h3 className="font-display text-lg font-bold text-[var(--ink)]">{p.name}</h3>
                <p className="mt-1 text-xs text-[var(--ink-muted)] leading-[1.5]">{p.desc}</p>

                <div className="mt-5 pb-5 border-b border-stone-100">
                  <span className="text-3xl font-extrabold text-[var(--ink)]">{p.price}</span>
                  <span className="text-xs text-[var(--ink-muted)] ml-1">one-time</span>
                </div>

                <ul className="mt-6 space-y-3 text-xs text-[var(--ink)]">
                  {p.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2.5">
                      <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" strokeWidth={2} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-4">
                <Link
                  href="/login"
                  className={`inline-flex w-full items-center justify-center gap-2 rounded-full py-3 text-xs font-semibold shadow-sm transition-all ${
                    p.popular
                      ? "bg-rose-600 text-white hover:bg-rose-700 hover:shadow"
                      : "border border-stone-300 bg-stone-50 text-stone-800 hover:bg-stone-100"
                  } min-h-[var(--target)]`}
                >
                  <span>{p.cta}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
