"use client";

import { MessageCircle } from "lucide-react";

export function ConciergeCta() {
  const whatsappNumber = "+94771234567";
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
    "Hello! I am planning a Sri Lankan wedding and would like to know more about your digital invitations.",
  )}`;

  return (
    <section className="py-[var(--space-18)] bg-gradient-to-b from-[#fcf9f2] to-[#f5eedf]">
      <div className="mx-auto max-w-4xl px-[var(--space-6)] md:px-[var(--space-12)]">
        <div className="rounded-3xl border border-amber-900/10 bg-white p-8 md:p-12 shadow-lg flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-left">
            <span className="text-[11px] font-bold tracking-widest text-rose-600 uppercase">
              SRI LANKAN WEDDING ADVISOR
            </span>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-[var(--ink)]">
              Need assistance with your wedding design?
            </h2>
            <p className="text-sm text-[var(--ink-muted)] max-w-md leading-[1.6]">
              Our Colombo team is here to help you set up Auspicious Nakath timings, customize Sinhala/Tamil fonts, or plan your seating arrangements.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-6 py-3.5 text-sm font-semibold text-white shadow-md hover:bg-emerald-700 transition-all hover:shadow-lg min-h-[var(--target)]"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
