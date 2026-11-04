"use client";

import { Palette, Edit3, Send } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      num: "01",
      icon: Palette,
      title: "Pick your wedding design",
      desc: "Choose from authentic Sri Lankan templates crafted for Poruwa rituals, church weddings, Hindu Muhurtham, and receptions.",
    },
    {
      num: "02",
      icon: Edit3,
      title: "Add your names, venues & Nakath times",
      desc: "Customize dates, auspicious times, family notes, venue Google Maps, and background ceremonial music with live phone preview.",
    },
    {
      num: "03",
      icon: Send,
      title: "Send personal links on WhatsApp",
      desc: "Every guest receives their own 128-bit private link. Tap to send with zero app to install and track live RSVPs as they arrive.",
    },
  ];

  return (
    <section id="how-it-works" className="py-[var(--space-18)] bg-[var(--surface-sunken)] border-b border-[var(--line)]">
      <div className="mx-auto max-w-6xl px-[var(--space-6)] md:px-[var(--space-12)]">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[length:var(--text-xs)] font-bold tracking-widest text-rose-600 uppercase">
            SIMPLE & FAST
          </span>
          <h2 className="font-display text-[length:var(--text-3xl)] font-bold tracking-tight text-[var(--ink)] sm:text-4xl">
            How it works in 3 easy steps
          </h2>
          <p className="text-[length:var(--text-base)] text-[var(--ink-muted)]">
            Create, preview, and dispatch your wedding invitations to 300+ guests in under 10 minutes.
          </p>
        </div>

        <div className="mt-[var(--space-12)] grid grid-cols-1 md:grid-cols-3 gap-[var(--space-8)]">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="relative rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-display text-3xl font-extrabold text-stone-200">
                      {step.num}
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-50 text-rose-600">
                      <Icon className="h-5 w-5" strokeWidth={1.75} />
                    </div>
                  </div>

                  <h3 className="font-display mt-4 text-lg font-semibold text-[var(--ink)]">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm text-[var(--ink-muted)] leading-[1.6]">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
