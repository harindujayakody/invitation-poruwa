"use client";

import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRight, Play, CheckCircle2 } from "lucide-react";
import { PhoneMockupFrame } from "@/components/marketing/phone-mockup-frame";
import { TemplateRenderer } from "@/components/templates/template-renderer";
import { InvitationContent } from "@/lib/schema/invitation";

export function Hero() {
  const locale = useLocale();

  const isSinhala = locale === "si";
  const isTamil = locale === "ta";

  // Authentic Sri Lankan couple sample content for the phone showcase
  const sampleContent: InvitationContent = {
    couple: {
      partnerOne: isSinhala ? "දුල්හානි" : isTamil ? "துல்ஹானி" : "Dulhani",
      partnerTwo: isSinhala ? "නිමේෂ්" : isTamil ? "நிமேஷ்" : "Nimesh",
      partnerOneParents: isSinhala
        ? "සුනිල් සහ චිත්‍රා පෙරේරා යුවළගේ පුත්"
        : isTamil
        ? "சுந்தரம் & லட்சுமி அவர்களின் புதல்வன்"
        : "Son of Mr. & Mrs. S. Perera",
      partnerTwoParents: isSinhala
        ? "රංජිත් සහ හේමා ජයවර්ධන යුවළගේ දියණිය"
        : isTamil
        ? "சிவகுமார் & சாந்தி அவர்களின் புதல்வி"
        : "Daughter of Mr. & Mrs. R. Jayawardena",
    },
    story: {
      quote: isSinhala
        ? "ආදරය ඉවසයි, කරුණාවන්තය. අපේ නව දිවි ගමනට ආශිර්වාද කරන්න."
        : isTamil
        ? "அன்பும் அமைதியும் நிறைந்த எங்கள் புதுவாழ்வுக்கு உங்கள் நல்வாழ்த்துக்களை வேண்டுகிறோம்."
        : "Two souls, one sacred journey. Blessed to step forward together.",
    },
    events: [
      {
        id: "ev-poruwa",
        title: isSinhala ? "පොරුව චාරිත්‍රය" : isTamil ? "பொருவா சடங்கு" : "Poruwa Ceremony",
        venue: "The Kingsbury Hotel, Colombo",
        startsAt: "09:42 AM",
        address: "Janadhipathi Mawatha, Colombo 01",
        mapUrl: "https://maps.google.com",
        notes: isSinhala ? "සුබ නැකත: පෙ.ව. 09:42 ට" : "Nakath time: 09:42 AM",
        sort: 0,
      },
      {
        id: "ev-reception",
        title: isSinhala ? "මංගල භෝජන සංග්‍රහය" : isTamil ? "திருமண வரவேற்பு" : "Wedding Reception",
        venue: "The Balmoral Ballroom, Colombo",
        startsAt: "12:30 PM",
        address: "Janadhipathi Mawatha, Colombo 01",
        mapUrl: "https://maps.google.com",
        notes: isSinhala ? "දිවා භෝජනය සහ සුබපැතුම්" : "Lunch & celebrations",
        sort: 1,
      },
    ],
    eventDate: "2026-12-21T09:42:00.000Z",
    sections: {
      showCover: true,
      showEvents: true,
      showStory: true,
      showRsvp: true,
      showGifts: false,
    },
  };

  return (
    <section className="relative overflow-hidden border-t border-[var(--line)] bg-[var(--surface-raised)] pt-12 pb-20 md:pt-16 md:pb-28">

      <div className="mx-auto max-w-6xl px-[var(--space-6)] md:px-[var(--space-12)]">
        <div className="grid grid-cols-1 items-center gap-[var(--space-12)] lg:grid-cols-12 lg:gap-[var(--space-8)]">
          {/* Left Column: Headline, Description & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[var(--ink)] leading-[1.12]">
              {isSinhala ? (
                <>
                  ඔබගේ මංගල ආරාධනය,{" "}
                  <span className="text-rose-600 block sm:inline">WhatsApp හරහා යවන්න.</span>
                </>
              ) : isTamil ? (
                <>
                  உங்கள் திருமண அழைப்பிதழ்,{" "}
                  <span className="text-rose-600 block sm:inline">WhatsApp மூலம் பகிருங்கள்.</span>
                </>
              ) : (
                <>
                  Your wedding invitation,{" "}
                  <span className="text-rose-600 block sm:inline">sent on WhatsApp.</span>
                </>
              )}
            </h2>

            <p className="text-lg sm:text-xl text-[var(--ink-muted)] leading-relaxed max-w-[54ch]">
              {isSinhala
                ? "සෑම අමුත්තෙකුටම පුද්ගලික සබැඳියක්, සජීවී RSVP ප්‍රතිචාර, ආසන සැලැස්ම සහ උත්සව කාලසටහන සමඟ විනාඩි දහයකින් සාදාගන්න."
                : isTamil
                ? "விருந்தினர் ஒவ்வொருவருக்கும் தனித்துவமான இணைப்பு, உடனடி RSVP மற்றும் நிகழ்வு விவரங்களுடன் 10 நிமிடங்களில் அழகான அழைப்பிதழ் தளம்."
                : "A beautiful invitation site with RSVP, every event and a personal link for each guest. Built in ten minutes."}
            </p>

            {/* CTAs with generous tactile padding */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/login?mode=signup"
                className="inline-flex items-center justify-center gap-2.5 rounded-full bg-rose-600 px-8 py-3.5 text-base font-semibold text-white shadow-md transition-all duration-200 hover:bg-rose-700 hover:shadow-lg hover:-translate-y-0.5 min-h-[48px]"
              >
                <span>{isSinhala ? "නොමිලේ අරඹන්න" : isTamil ? "இலவசமாகத் தொடங்குங்கள்" : "Start free"}</span>
                <ArrowRight className="h-4.5 w-4.5" strokeWidth={2} />
              </Link>

              <Link
                href="/samples/poruwa-traditional"
                className="inline-flex items-center justify-center gap-2.5 rounded-full border border-stone-300 bg-white px-7 py-3.5 text-base font-medium text-stone-800 shadow-xs transition-all duration-200 hover:bg-stone-50 hover:border-stone-400 min-h-[48px]"
              >
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-stone-100 text-stone-700">
                  <Play className="h-2.5 w-2.5 fill-stone-700 translate-x-0.5" />
                </div>
                <span>{isSinhala ? "සජීවී ආදර්ශය" : isTamil ? "நேரடி மாதிரி" : "Live demo"}</span>
              </Link>
            </div>

            {/* Value bullets */}
            <div className="pt-4 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs sm:text-sm text-[var(--ink-muted)]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600 shrink-0" strokeWidth={2} />
                <span>Sinhala, Tamil & English</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600 shrink-0" strokeWidth={2} />
                <span>128-bit secure guest links</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600 shrink-0" strokeWidth={2} />
                <span>Under 150 KB fast load</span>
              </div>
            </div>
          </div>

          {/* Right Column: The iPhone 16 Pro Mockup */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <PhoneMockupFrame className="w-full">
              <TemplateRenderer
                templateId="poruwa-traditional"
                content={sampleContent}
                locale={locale}
                isMockup={false}
              />
            </PhoneMockupFrame>
          </div>
        </div>
      </div>
    </section>
  );
}
