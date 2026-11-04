"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { useLocale } from "next-intl";

interface MomentVideo {
  id: string;
  couple: {
    en: string;
    si: string;
    ta: string;
  };
  event: {
    en: string;
    si: string;
    ta: string;
  };
  venue: string;
  duration: string;
  bgGradient: string;
}

const MOMENTS: MomentVideo[] = [
  {
    id: "m1",
    couple: {
      en: "Dulhani & Nimesh",
      si: "දුල්හානි & නිමේෂ්",
      ta: "துல்ஹானி & நிமேஷ்",
    },
    event: {
      en: "Poruwa Blessing & Magul Bera",
      si: "පොරුව චාරිත්‍රය සහ මඟුල් බෙර",
      ta: "பொருவா சடங்கு மற்றும் மங்கள மேளம்",
    },
    venue: "The Kingsbury, Colombo",
    duration: "0:45",
    bgGradient: "from-amber-900/80 via-stone-900/60 to-black/90",
  },
  {
    id: "m2",
    couple: {
      en: "Kasun & Sanduni",
      si: "කසුන් & සඳුනි",
      ta: "கசுன் & சந்துனி",
    },
    event: {
      en: "Grand Ballroom Entrance",
      si: "මංගල ප්‍රවේශය සහ සංග්‍රහය",
      ta: "திருமண மண்டப பிரவேசம்",
    },
    venue: "Shangri-La, Colombo",
    duration: "1:12",
    bgGradient: "from-rose-950/80 via-stone-900/60 to-black/90",
  },
  {
    id: "m3",
    couple: {
      en: "Suresh & Meera",
      si: "සුරේෂ් & මීරා",
      ta: "சுரேஷ் & மீரா",
    },
    event: {
      en: "Sacred Muhurtham Nuptials",
      si: "මුහුර්තම් චාරිත්‍රය",
      ta: "புனித முகூர்த்த சடங்கு",
    },
    venue: "Ramakrishna Hall, Colombo",
    duration: "0:58",
    bgGradient: "from-red-950/80 via-stone-900/60 to-black/90",
  },
  {
    id: "m4",
    couple: {
      en: "Rohan & Priyanthi",
      si: "රොහාන් & ප්‍රියන්ති",
      ta: "ரோஹன் & பிரியந்தி",
    },
    event: {
      en: "Kandyan Dancers & Oil Lamp",
      si: "උඩරට නර්තනය සහ පහන දැල්වීම",
      ta: "கண்டிய நடனம் & மங்கள விளக்கேற்றல்",
    },
    venue: "Earl's Regency, Kandy",
    duration: "1:20",
    bgGradient: "from-yellow-950/80 via-stone-900/60 to-black/90",
  },
  {
    id: "m5",
    couple: {
      en: "Malik & Fatima",
      si: "මලික් & ෆාතිමා",
      ta: "மாலிக் & பாத்திமா",
    },
    event: {
      en: "Nikah Ceremony & Celebration",
      si: "නිකාහ් උත්සවය සහ භෝජනය",
      ta: "நிக்காஹ் விழா & விருந்து",
    },
    venue: "Jetwing Lighthouse, Galle",
    duration: "1:05",
    bgGradient: "from-emerald-950/80 via-stone-900/60 to-black/90",
  },
];

export function RealMoments() {
  const locale = useLocale();
  const [activeMoment, setActiveMoment] = useState<string | null>(null);

  const isSinhala = locale === "si";
  const isTamil = locale === "ta";

  return (
    <section className="py-20 md:py-24 bg-[var(--surface)] border-b border-[var(--line)]">
      <div className="mx-auto max-w-6xl px-[var(--space-6)] md:px-[var(--space-12)]">
        {/* Section Header */}
        <div className="max-w-3xl space-y-3 text-left">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--ink)]">
            {isSinhala
              ? "සැබෑ මංගල සැමරුම්, සජීවීව"
              : isTamil
              ? "நேரடி திருமண கொண்டாட்டங்கள்"
              : "Real moments, real celebrations"}
          </h2>
          <p className="text-base sm:text-lg text-[var(--ink-muted)] leading-relaxed">
            {isSinhala
              ? "ශ්‍රී ලාංකික යුවළවල් අපගේ ඩිජිටල් ආරාධනා සමඟ තම විශේෂ දිනය සමරන ආකාරය බලන්න."
              : isTamil
              ? "இலங்கை தம்பதிகள் எவ்வாறு எங்கள் டிஜிட்டல் அழைப்பிதழ் மூலம் தங்கள் சிறப்பான நாளை கொண்டாடுகிறார்கள் என்பதைப் பாருங்கள்."
              : "See how couples across Sri Lanka bring their wedding celebration to life with personalized digital invitations."}
          </p>
        </div>

        {/* Video Cards Grid / Carousel */}
        <div className="mt-12 flex gap-6 overflow-x-auto pb-6 scrollbar-thin">
          {MOMENTS.map((m) => {
            const coupleName =
              isSinhala ? m.couple.si : isTamil ? m.couple.ta : m.couple.en;
            const eventName =
              isSinhala ? m.event.si : isTamil ? m.event.ta : m.event.en;
            const isPlaying = activeMoment === m.id;

            return (
              <div
                key={m.id}
                className="group relative flex-none w-[260px] sm:w-[280px] h-[390px] rounded-3xl overflow-hidden border border-stone-200/60 bg-stone-900 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                {/* Visual Backdrop with Rich Cultural Ambiance */}
                <div
                  className={`absolute inset-0 bg-gradient-to-b ${m.bgGradient} opacity-90`}
                />

                {/* Subtle ornamental patterns inside card */}
                <div
                  className="absolute inset-0 opacity-15 pointer-events-none"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 50% 30%, rgba(255,255,255,0.4) 0%, transparent 60%)",
                  }}
                />

                {/* Top Badge: Duration & Audio indicator */}
                <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between text-xs text-white/90">
                  <span className="rounded-full bg-black/40 backdrop-blur-md px-3 py-1 font-medium border border-white/10">
                    {m.duration}
                  </span>
                  <span className="rounded-full bg-rose-600/90 px-2.5 py-0.5 text-[11px] font-semibold text-white">
                    HD
                  </span>
                </div>

                {/* Center Play Button Overlay with generous hit target */}
                <button
                  type="button"
                  onClick={() => setActiveMoment(isPlaying ? null : m.id)}
                  aria-label={`Play highlight of ${coupleName}`}
                  className="absolute inset-0 m-auto h-16 w-16 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white shadow-xl transition-transform duration-300 group-hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
                >
                  <Play className="h-7 w-7 ml-1 fill-white text-white" />
                </button>

                {/* Bottom Overlay with Couple & Venue Details */}
                <div className="absolute bottom-0 left-0 right-0 p-6 z-10 bg-gradient-to-t from-black via-black/80 to-transparent">
                  <h3 className="font-display text-lg font-bold text-white tracking-tight leading-snug">
                    {coupleName}
                  </h3>
                  <p className="text-xs text-amber-200/90 mt-1 font-medium truncate">
                    {eventName}
                  </p>
                  <p className="text-xs text-stone-400 mt-0.5 truncate">
                    {m.venue}
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
