"use client";

import { useLocale } from "next-intl";
import { Star, Heart } from "lucide-react";

export function Testimonials() {
  const locale = useLocale();

  const isSinhala = locale === "si";
  const isTamil = locale === "ta";

  const reviews = [
    {
      couple: isSinhala ? "කසුන් සහ සඳුනි" : isTamil ? "கசுன் & சந்துனி" : "Kasun & Sanduni",
      location: "Colombo · Shangri-La Wedding",
      quote: isSinhala
        ? "අමුත්තන් 380 දෙනෙකුට විනාඩි 15 කින් පුද්ගලික WhatsApp සබැඳි යැව්වා. ඕස්ට්‍රේලියාවේ සහ එංගලන්තයේ ඉන්න අපේ ඥාතීන් ක්ෂණිකව RSVP කළා. මුද්‍රණ වියදම් රු. 65,000 කට වඩා ඉතිරි වුණා!"
        : "Sent personal WhatsApp invitations to 380 guests in under 15 minutes. Our relatives in Australia and UK RSVP'd immediately, and we saved over Rs. 65,000 on printing cards!",
      rating: 5,
    },
    {
      couple: isSinhala ? "රොහාන් සහ ප්‍රියන්ති" : isTamil ? "ரோஹன் & பிரியந்தி" : "Rohan & Priyanthi",
      location: "Kandy · Earl's Regency",
      quote: isSinhala
        ? "ශාලා පිවිසුමේ තැබූ QR පුවරුවෙන් අමුත්තන් ඔවුන්ගේ මේස අංකය තත්පර ගණනකින් සොයාගත්තා. කිසිම පෝලිමක් හෝ තදබදයක් ඇති වුණේ නැහැ. අමුත්තන් ගොඩක් පැහැදුනා."
        : "The seating arrangement builder and entrance QR easel was the biggest hit. Guests just scanned the sign at the ballroom entrance and found their table without any crowd.",
      rating: 5,
    },
    {
      couple: isSinhala ? "සුරේෂ් සහ මීරා" : isTamil ? "சுரேஷ் & மீரா" : "Suresh & Meera",
      location: "Colombo · Hindu Muhurtham",
      quote: isSinhala
        ? "ද්විභාෂා අකුරු හැඩතල සහ නැකත් වේලාවන් ඉතා අලංකාරව දිස්වුණා. අමුත්තන් සජීවීව ඡායාරූප උඩුගත කිරීම උත්සවයේ අමතක නොවන මතකයක් වුණා."
        : "The bilingual typography and auspicious Muhurtham schedule looked stunning. Guests loved the live photo stream where everyone uploaded candids throughout the evening.",
      rating: 5,
    },
  ];

  return (
    <section className="py-20 md:py-24 bg-[var(--surface)] border-b border-[var(--line)]">
      <div className="mx-auto max-w-6xl px-[var(--space-6)] md:px-[var(--space-12)]">
        {/* Section Header without repetitive eyebrow */}
        <div className="text-left md:text-center max-w-3xl mx-auto space-y-4">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--ink)]">
            {isSinhala ? "අපගේ සේවාව අගය කළ මනාල යුවළවල්" : isTamil ? "எங்கள் சேவையை மெச்சிய மணமக்கள்" : "Couples who loved their invitations"}
          </h2>
          <p className="text-base sm:text-lg text-[var(--ink-muted)] leading-relaxed">
            {isSinhala
              ? "ශ්‍රී ලංකාවේ සහ විදේශයන්හි වෙසෙන යුවළවල් 500+ කට අධික සංඛ්‍යාවක් Suba.lk තෝරාගෙන ඇත."
              : isTamil
              ? "இலங்கையிலும் வெளிநாடுகளிலும் 500+ க்கும் மேற்பட்ட ஜோடிகள் Suba.lk ஐத் தேர்ந்தெடுத்துள்ளனர்."
              : "Over 500+ couples across Sri Lanka and overseas have chosen Suba.lk for their digital wedding invitations."}
          </p>
        </div>

        {/* 3 Generous Review Cards */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((r, i) => (
            <div
              key={i}
              className="rounded-3xl border border-[var(--line)] bg-white p-8 sm:p-9 shadow-xs hover:border-stone-400 hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex gap-1.5 text-amber-500 mb-5">
                  {Array.from({ length: r.rating }).map((_, idx) => (
                    <Star key={idx} className="h-5 w-5 fill-amber-500" />
                  ))}
                </div>
                <blockquote className="text-sm sm:text-base text-stone-800 leading-relaxed italic">
                  &ldquo;{r.quote}&rdquo;
                </blockquote>
              </div>

              <div className="mt-8 pt-5 border-t border-[var(--line)] flex items-center justify-between">
                <div>
                  <h3 className="font-display text-base font-bold text-[var(--ink)]">
                    {r.couple}
                  </h3>
                  <p className="text-xs text-[var(--ink-muted)] mt-0.5">{r.location}</p>
                </div>
                <Heart className="h-5 w-5 text-rose-500 fill-rose-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
