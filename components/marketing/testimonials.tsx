"use client";

import { Star, Heart } from "lucide-react";

export function Testimonials() {
  const reviews = [
    {
      couple: "Kasun & Sanduni",
      location: "Colombo · Shangri-La Wedding",
      quote:
        "Sent personal WhatsApp invitations to 380 guests in under 15 minutes. Our relatives in Australia and UK RSVP'd immediately, and we saved over Rs. 65,000 on printing cards!",
      rating: 5,
    },
    {
      couple: "Rohan & Priyanthi",
      location: "Kandy · Earl's Regency",
      quote:
        "The seating arrangement builder and entrance QR easel was the biggest hit. Guests just scanned the sign at the ballroom entrance and found their table without any crowd.",
      rating: 5,
    },
    {
      couple: "Suresh & Meera",
      location: "Colombo · Hindu Muhurtham",
      quote:
        "The bilingual typography and auspicious Muhurtham schedule looked stunning. Guests loved the live photo stream where everyone uploaded candids throughout the evening.",
      rating: 5,
    },
  ];

  return (
    <section className="py-[var(--space-18)] bg-[var(--surface)] border-b border-[var(--line)]">
      <div className="mx-auto max-w-6xl px-[var(--space-6)] md:px-[var(--space-12)]">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[length:var(--text-xs)] font-bold tracking-widest text-rose-600 uppercase">
            REAL CELEBRATIONS
          </span>
          <h2 className="font-display text-[length:var(--text-3xl)] font-bold tracking-tight text-[var(--ink)] sm:text-4xl">
            Couples who loved their invitations
          </h2>
          <p className="text-[length:var(--text-base)] text-[var(--ink-muted)]">
            Over 500+ couples across Sri Lanka and overseas have chosen our digital wedding platform.
          </p>
        </div>

        <div className="mt-[var(--space-12)] grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <div
              key={i}
              className="rounded-2xl border border-[var(--line)] bg-[var(--surface-sunken)] p-6 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex gap-1 text-amber-500 mb-4">
                  {Array.from({ length: r.rating }).map((_, idx) => (
                    <Star key={idx} className="h-4 w-4 fill-amber-500" />
                  ))}
                </div>
                <blockquote className="text-xs text-stone-800 leading-[1.7] italic">
                  &ldquo;{r.quote}&rdquo;
                </blockquote>
              </div>

              <div className="mt-6 pt-4 border-t border-[var(--line)] flex items-center justify-between">
                <div>
                  <h3 className="font-display text-sm font-semibold text-[var(--ink)]">
                    {r.couple}
                  </h3>
                  <p className="text-[11px] text-[var(--ink-muted)]">{r.location}</p>
                </div>
                <Heart className="h-4 w-4 text-rose-500 fill-rose-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
