"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { ChevronDown } from "lucide-react";

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const locale = useLocale();

  const isSinhala = locale === "si";
  const isTamil = locale === "ta";

  const faqs = [
    {
      q: isSinhala
        ? "WhatsApp හරහා ආරාධනා යැවීම ක්‍රියාත්මක වන්නේ කෙසේද?"
        : "How does sending on WhatsApp work?",
      a: isSinhala
        ? "ඔබගේ පුවරුවෙන් අමුත්තන්ගේ නාම ලැයිස්තුව එක්කර එක් තට්ටුවකින් ආචාරශීලී WhatsApp පණිවිඩයක් සමඟ ඔවුන්ගේ පෞද්ගලික සබැඳිය විවෘත වේ. අමුත්තන්ට කිසිදු App එකක් ඩවුන්ලෝඩ් කිරීමට අවශ්‍ය නොවන අතර, WhatsApp සමූහ (groups) සෑදීමක් සිදු නොවේ."
        : "From your couple dashboard, you can import your guest list from a CSV or add contacts one by one. With one tap, a customized polite WhatsApp message opens with that guest's private link. There is no chaotic group chat created and no app for guests to install.",
    },
    {
      q: isSinhala
        ? "වැඩිහිටි ඥාතීන්ට තම දුරකථනයෙන් ආරාධනය පහසුවෙන් කියවිය හැකිද?"
        : "Can elder relatives view the invitation easily on their phones?",
      a: isSinhala
        ? "ඔව්! ඕනෑම ජංගම දුරකථනයක පැහැදිලිව පෙනෙන පරිදි විශාල සිංහල සහ දෙමළ අකුරු, ඉහළ වර්ණ පරස්පරතාව (contrast) සහ පහසු RSVP බොත්තම් සහිතව නිර්මාණය කර ඇති නිසා වැඩිහිටියන්ට පවා අපහසුවකින් තොරව භාවිත කළ හැක."
        : "Yes! The guest experience is designed specifically for high legibility on any mobile phone (Android or iPhone). Large Sinhala and Tamil ceremonial fonts, high contrast, and one-tap RSVP buttons mean elderly uncles and aunties can use it effortlessly.",
    },
    {
      q: isSinhala
        ? "සිංහල සහ දෙමළ භාෂාවන් සම්පූර්ණයෙන්ම භාවිත කළ හැකිද?"
        : "Are Sinhala and Tamil languages fully supported?",
      a: isSinhala
        ? "අනිවාර්යයෙන්ම. ශ්‍රී ලාංකික විවාහ උත්සව බහුභාෂාමය වේ. මනාල යුවළගේ නම්, දෙමව්පියන්ගේ ආශිර්වාද සටහන් සහ නැකැත් වේලාවන් සිංහල, දෙමළ හෝ ඉංග්‍රීසි භාෂාවෙන් ඇතුළත් කළ හැකි අතර, අමුත්තන්ට කැමති භාෂාවකට මාරු විය හැක."
        : "Absolutely. Sri Lankan weddings are multilingual. You can write your names, parents' blessing notes, and auspicious Nakath times in Sinhala (සිංහල), Tamil (தமிழ்), or English, and guests can toggle between languages.",
    },
    {
      q: isSinhala
        ? "පිළිගැනීමේ ශාලා පිවිසුම් QR පුවරුව (Entrance QR Easel) යනු කුමක්ද?"
        : "What is the Reception Entrance QR Sign?",
      a: isSinhala
        ? "ඔබගේ ආසන සැලැස්ම සකස් කළ පසු, ශාලා පිවිසුමේ තැබිය හැකි A3/A2 ප්‍රමාණයේ උසස් තත්ත්වයේ QR කේතයක් සහිත Welcome Easel PDF එකක් ලබාගත හැක. අමුත්තන් ශාලාවට ඇතුළු වන විට එය ස්කෑන් කර තත්පර 2කින් තම මේස අංකය දැනගත හැක."
        : "Once you arrange your banquet tables in the seating builder, our system generates a print-ready A3/A2 welcome easel PDF with a high-resolution QR code. When guests arrive at your hall, they scan it to immediately see their assigned table number.",
    },
    {
      q: isSinhala
        ? "උත්සව වේලාවන් හෝ ස්ථානය වෙනස් වුවහොත් වෙනස් කළ හැකිද?"
        : "Can I update details if my event timings or venue change?",
      a: isSinhala
        ? "ඔව්! මුද්‍රිත කාඩ්පත්වල සිදුවන වැරදි සඳහා නැවත මුද්‍රණය කිරීමට සිදුවුවත්, ඩිජිටල් ආරාධනා පත්‍රයේ තොරතුරු ඔබගේ දුරකථනයෙන් ඕනෑම වේලාවක වෙනස් කළ හැක. සියලුම අමුත්තන්ගේ සබැඳි ක්ෂණිකව යාවත්කාලීන වේ."
        : "Yes! Unlike printed wedding cards where a mistake requires a complete reprint, your digital invitation can be edited at any time from your phone dashboard. All guest links update instantly in real time.",
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-[var(--surface-sunken)] border-b border-[var(--line)]">
      <div className="mx-auto max-w-4xl px-[var(--space-6)] md:px-[var(--space-12)]">
        {/* Section Header */}
        <div className="text-left md:text-center space-y-4">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--ink)]">
            {isSinhala ? "නිතර අසන ප්‍රශ්න සහ පිළිතුරු" : isTamil ? "அடிக்கடி கேட்கப்படும் கேள்விகள்" : "Questions answered"}
          </h2>
          <p className="text-base sm:text-lg text-[var(--ink-muted)]">
            {isSinhala
              ? "ශ්‍රී ලාංකීය විවාහ ඩිජිටල් ආරාධනා සම්බන්ධයෙන් ඔබට ඇති ගැටලු සඳහා පිළිතුරු."
              : "Everything you need to know about setting up and sending your digital wedding invitations."}
          </p>
        </div>

        {/* Generous Accordion List */}
        <div className="mt-14 space-y-4">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className="rounded-3xl border border-stone-200 bg-white shadow-xs overflow-hidden transition-all hover:border-stone-400"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="flex w-full items-center justify-between px-7 sm:px-8 py-5 sm:py-6 text-left text-base sm:text-lg font-bold text-[var(--ink)] focus:outline-none min-h-[56px]"
                >
                  <span className="pr-4">{faq.q}</span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-100 text-stone-700 shrink-0">
                    <ChevronDown
                      className={`h-4.5 w-4.5 text-stone-600 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </button>
                {isOpen && (
                  <div className="px-7 sm:px-8 pb-7 pt-2 text-sm sm:text-base text-stone-600 leading-relaxed border-t border-stone-100">
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
