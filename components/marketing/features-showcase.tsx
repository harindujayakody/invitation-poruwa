"use client";

import {
  MessageSquare,
  LayoutGrid,
  Camera,
  QrCode,
  CalendarDays,
  Users,
} from "lucide-react";

export function FeaturesShowcase() {
  const features = [
    {
      icon: MessageSquare,
      title: "WhatsApp Click-to-Send Links",
      badge: "Instant Delivery",
      desc: "Each guest gets their own personalized link with a unique 128-bit token. Send individually with one tap — no app to download and no chaotic WhatsApp group.",
    },
    {
      icon: LayoutGrid,
      title: "Interactive Seating Plan",
      badge: "Wedding Day",
      desc: "Drag-and-drop banquet tables, assign guests by bride or groom side, and let guests look up their table number right from their phone.",
    },
    {
      icon: Camera,
      title: "Live Guest Photo Gallery",
      badge: "Real-time Memories",
      desc: "Guests upload candid moments directly from their camera roll. Couple moderation dashboard lets you approve photos before they go live on the wall.",
    },
    {
      icon: QrCode,
      title: "Reception Entrance QR Easel",
      badge: "Print Ready",
      desc: "Generate a high-resolution, print-ready QR welcome sign for your venue entrance. Arriving guests scan to see their exact table in 2 seconds.",
    },
    {
      icon: CalendarDays,
      title: "Multi-Event Ceremony Timeline",
      badge: "Auspicious Times",
      desc: "Dedicated sections for Poruwa ceremony, Church nuptials, Reception lunch, and Homecoming with Nakath countdowns and venue Google Maps.",
    },
    {
      icon: Users,
      title: "Headcount & Dietary RSVP Tracker",
      badge: "Live Telemetry",
      desc: "Track accepted, declined, and pending responses in real time. Filter by vegetarian, halal, or allergy requirements and export catering CSVs.",
    },
  ];

  return (
    <section id="features" className="py-[var(--space-18)] bg-[var(--surface)] border-b border-[var(--line)]">
      <div className="mx-auto max-w-6xl px-[var(--space-6)] md:px-[var(--space-12)]">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[length:var(--text-xs)] font-bold tracking-widest text-rose-600 uppercase">
            COMPLETE OPERATING SYSTEM
          </span>
          <h2 className="font-display text-[length:var(--text-3xl)] font-bold tracking-tight text-[var(--ink)] sm:text-4xl">
            Everything you need for your wedding day
          </h2>
          <p className="text-[length:var(--text-base)] text-[var(--ink-muted)]">
            Built specifically for Sri Lankan weddings, honoring traditional customs while saving weeks of manual coordination.
          </p>
        </div>

        <div className="mt-[var(--space-12)] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[var(--space-6)]">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="rounded-2xl border border-[var(--line)] bg-[var(--surface-sunken)] p-6 transition-all hover:border-stone-400 hover:shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-rose-600 border border-rose-100">
                      <Icon className="h-5 w-5" strokeWidth={1.75} />
                    </div>
                    <span className="rounded-full bg-stone-100 px-3 py-1 text-[11px] font-semibold text-stone-700">
                      {f.badge}
                    </span>
                  </div>

                  <h3 className="font-display mt-4 text-base font-semibold text-[var(--ink)]">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-xs text-[var(--ink-muted)] leading-[1.6]">
                    {f.desc}
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
