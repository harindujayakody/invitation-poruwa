"use client";

import { useLocale } from "next-intl";
import { MessageCircle, Sparkles } from "lucide-react";

export function ConciergeCta() {
  const locale = useLocale();

  const isSinhala = locale === "si";
  const isTamil = locale === "ta";

  const whatsappNumber = "+94771234567";
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
    isSinhala
      ? "ආයුබෝවන්! මම ශ්‍රී ලාංකික විවාහ උත්සවයක් සැලසුම් කරමින් සිටිමි. ඔබගේ ඩිජිටල් ආරාධනා පිළිබඳ වැඩිදුර විස්තර දැනගැනීමට කැමැත්තෙමි."
      : "Hello! I am planning a Sri Lankan wedding and would like to know more about Suba.lk digital invitations.",
  )}`;

  return (
    <section className="py-20 md:py-28 bg-[var(--surface)]">
      <div className="mx-auto max-w-5xl px-[var(--space-6)] md:px-[var(--space-12)]">
        <div className="rounded-3xl border border-amber-900/10 bg-gradient-to-br from-[#fffdfa] via-[#fdfbf6] to-[#f7f1e4] p-10 sm:p-12 md:p-16 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="space-y-4 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-100/80 px-4 py-1 text-xs font-bold text-amber-900 border border-amber-200">
              <Sparkles className="h-3.5 w-3.5 text-amber-700" />
              <span>{isSinhala ? "කොළඹ මංගල උපදේශක සහය" : "Sri Lankan Wedding Advisor"}</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[var(--ink)] leading-snug">
              {isSinhala
                ? "ඔබගේ ආරාධනා සැලසුම සඳහා උපකාර අවශ්‍යද?"
                : isTamil
                ? "உங்கள் திருமண வடிவமைப்புக்கு உதவி தேவையா?"
                : "Need assistance with your wedding design?"}
            </h2>
            <p className="text-base text-[var(--ink-muted)] max-w-xl leading-relaxed">
              {isSinhala
                ? "සුබ නැකත් වේලාවන් සකස් කිරීම, සිංහල/දෙමළ අක්ෂර වින්‍යාසය හෝ ආසන සැලැස්ම සකස් කිරීමට අපගේ කොළඹ කාර්යාලයීය කණ්ඩායම සතුටින් උදවු කිරීමට සූදානම්."
                : isTamil
                ? "சுப முகூர்த்த நேரங்கள், எழுத்துருக்கள் அல்லது மேசை அமைப்பைத் திட்டமிட எங்கள் கொழும்பு குழு எப்போதும் தயாராக உள்ளது."
                : "Our Colombo team is here to help you set up Auspicious Nakath timings, customize Sinhala/Tamil fonts, or plan your banquet seating arrangements."}
            </p>
          </div>

          <div className="shrink-0">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-base font-bold px-9 py-4 shadow-md hover:shadow-lg transition-all min-h-[52px]"
            >
              <MessageCircle className="h-5 w-5" />
              <span>{isSinhala ? "WhatsApp මඟින් විමසන්න" : isTamil ? "WhatsApp இல் தொடர்பு கொள்ளுங்கள்" : "Chat on WhatsApp"}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
