"use client";

import { useLocale } from "next-intl";
import { Check, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

export function PricingSection() {
  const locale = useLocale();

  const isSinhala = locale === "si";
  const isTamil = locale === "ta";

  const plans = [
    {
      name: "Essential",
      price: "Rs. 2,900",
      desc: isSinhala
        ? "කුඩා උත්සව සහ තනි උත්සව අවස්ථා සඳහා වඩාත් සුදුසුයි."
        : "Perfect for intimate gatherings and single-event ceremonies.",
      features: [
        "Single digital invitation site",
        "Up to 150 guests with personal WhatsApp links",
        "Real-time RSVP headcount tracker",
        "Auspicious Nakath times & Google Maps",
        "Bilingual typography (Sinhala, Tamil, English)",
      ],
      popular: false,
      cta: isSinhala ? "Essential තෝරන්න" : "Choose Essential",
    },
    {
      name: "Complete",
      price: "Rs. 4,900",
      desc: isSinhala
        ? "සාම්ප්‍රදායික ශ්‍රී ලාංකික මංගල උත්සව සඳහා වඩාත්ම ජනප්‍රිය පැකේජය."
        : "Our most popular package for traditional Sri Lankan celebrations.",
      features: [
        "Unlimited guests & WhatsApp links",
        "Interactive Seating Plan & Table Finder",
        "Reception Entrance Print-Ready QR Easel",
        "Live Guest Photo Stream & moderation",
        "WhatsApp Delivery Tracking & Reminders",
        "Multi-event timeline (Poruwa, Reception, Homecoming)",
      ],
      popular: true,
      cta: isSinhala ? "Complete තෝරන්න" : "Choose Complete",
    },
    {
      name: "Signature Concierge",
      price: "Rs. 8,900",
      desc: isSinhala
        ? "කොළඹ වෘත්තීය නිර්මාණ ශිල්පියෙකුගේ පූර්ණ සහය සමඟ."
        : "Full bespoke artisan service with personal Colombo designer assistance.",
      features: [
        "Everything in Complete plan",
        "1 Complimentary custom hand-drawn artwork",
        "Custom Sinhala/Tamil Nakath calligraphy",
        "Dedicated WhatsApp wedding coordinator",
        "Priority 24-hour turnaround",
      ],
      popular: false,
      cta: isSinhala ? "Signature තෝරන්න" : "Choose Signature",
    },
  ];

  return (
    <section id="pricing" className="py-20 md:py-28 bg-[var(--surface-sunken)] border-b border-[var(--line)]">
      <div className="mx-auto max-w-6xl px-[var(--space-6)] md:px-[var(--space-12)]">
        {/* Section Header without repetitive eyebrow */}
        <div className="text-left md:text-center max-w-3xl mx-auto space-y-4">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--ink)]">
            {isSinhala
              ? "එක්වරක් පමණක් ගෙවන්න. සැඟවුණු මාසික ගාස්තු නැත."
              : isTamil
              ? "ஒருமுறை மட்டும் கட்டணம். மறைமுக சந்தாக்கள் எதுவும் இல்லை."
              : "One-time payment. No hidden subscriptions."}
          </h2>
          <p className="text-base sm:text-lg text-[var(--ink-muted)] leading-relaxed">
            {isSinhala
              ? "ආරාධනය සාදා පෙරදසුන බැලීම සම්පූර්ණයෙන්ම නොමිලේ. ප්‍රකාශයට පත් කිරීමට සූදානම් වූ විට PayHere හරහා එක්වරක් ගෙවන්න."
              : isTamil
              ? "வடிவமைத்து முன்னோட்டம் பார்ப்பது முற்றிலும் இலவசம். அச்சிடத் தயாரானதும் ஒருமுறை மட்டும் PayHere ஊடாகப் பணம் செலுத்துங்கள்."
              : "Free to build and preview your invitation. Pay once via PayHere when you are ready to publish and send to guests."}
          </p>
        </div>

        {/* 3 Pricing Cards with Generous Paddings */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 items-stretch">
          {plans.map((p, idx) => (
            <div
              key={idx}
              className={`relative rounded-3xl p-8 sm:p-10 flex flex-col justify-between transition-all duration-200 ${
                p.popular
                  ? "border-2 border-rose-600 bg-white shadow-2xl md:-translate-y-2 z-10"
                  : "border border-stone-200 bg-white shadow-xs hover:border-stone-400 hover:shadow-md"
              }`}
            >
              {p.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-rose-600 px-5 py-1 text-xs font-bold text-white uppercase tracking-wider shadow-sm">
                  MOST POPULAR
                </div>
              )}

              <div>
                <h3 className="font-display text-2xl font-bold text-[var(--ink)]">{p.name}</h3>
                <p className="mt-2 text-xs sm:text-sm text-[var(--ink-muted)] leading-relaxed">{p.desc}</p>

                <div className="mt-6 pb-6 border-b border-stone-100 flex items-baseline">
                  <span className="text-4xl font-extrabold text-[var(--ink)]">{p.price}</span>
                  <span className="text-xs text-[var(--ink-muted)] font-medium ml-2">one-time</span>
                </div>

                <ul className="mt-8 space-y-4 text-sm text-[var(--ink)]">
                  {p.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" strokeWidth={2.5} />
                      <span className="leading-snug">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Generous Plan Buttons */}
              <div className="mt-10 pt-4">
                <Link
                  href="/login?mode=signup"
                  className={`inline-flex w-full items-center justify-center gap-2.5 rounded-full py-4 px-8 text-base font-bold shadow-sm transition-all duration-200 min-h-[50px] ${
                    p.popular
                      ? "bg-rose-600 text-white hover:bg-rose-700 hover:shadow-md"
                      : "border-2 border-stone-200 bg-white text-stone-800 hover:border-stone-400 hover:bg-stone-50"
                  }`}
                >
                  <span>{p.cta}</span>
                  <ArrowRight className="h-4.5 w-4.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
