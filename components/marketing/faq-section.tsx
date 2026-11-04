"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "How does sending on WhatsApp work?",
      a: "From your couple dashboard, you can import your guest list from a CSV or add contacts one by one. With one tap, a customized polite WhatsApp message opens with that guest's private link. There is no chaotic group chat created and no app for guests to install.",
    },
    {
      q: "Can elder relatives view the invitation easily on their phones?",
      a: "Yes! The guest experience is designed specifically for high legibility on any mobile phone (Android or iPhone). Large Sinhala and Tamil ceremonial fonts, high contrast, and one-tap RSVP buttons mean elderly uncles and aunties can use it effortlessly.",
    },
    {
      q: "Are Sinhala and Tamil languages fully supported?",
      a: "Absolutely. Sri Lankan weddings are multilingual. You can write your names, parents' blessing notes, and auspicious Nakath times in Sinhala (සිංහල), Tamil (தமிழ்), or English, and guests can toggle between languages.",
    },
    {
      q: "What is the Reception Entrance QR Sign?",
      a: "Once you arrange your banquet tables in the seating builder, our system generates a print-ready A3/A2 welcome easel PDF with a high-resolution QR code. When guests arrive at your hall, they scan it to immediately see their assigned table number.",
    },
    {
      q: "Can I update details if my event timings or venue change?",
      a: "Yes! Unlike printed wedding cards where a mistake requires a complete reprint, your digital invitation can be edited at any time from your phone dashboard. All guest links update instantly in real time.",
    },
  ];

  return (
    <section className="py-[var(--space-18)] bg-[var(--surface)] border-b border-[var(--line)]">
      <div className="mx-auto max-w-4xl px-[var(--space-6)] md:px-[var(--space-12)]">
        <div className="text-center space-y-3">
          <span className="text-[length:var(--text-xs)] font-bold tracking-widest text-rose-600 uppercase">
            COMMON QUESTIONS
          </span>
          <h2 className="font-display text-[length:var(--text-3xl)] font-bold tracking-tight text-[var(--ink)] sm:text-4xl">
            Questions answered
          </h2>
        </div>

        <div className="mt-[var(--space-10)] space-y-4">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className="rounded-2xl border border-[var(--line)] bg-[var(--surface-sunken)] overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="flex w-full items-center justify-between p-5 text-left text-sm font-semibold text-[var(--ink)] focus:outline-none min-h-[var(--target)]"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-stone-500 transition-transform duration-200 shrink-0 ml-4 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-[var(--ink-muted)] leading-[1.7] border-t border-[var(--line)] pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
