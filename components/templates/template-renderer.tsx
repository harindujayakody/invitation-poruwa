"use client";

import { CulturalTemplate, getTemplateById } from "@/lib/templates";
import { InvitationContent } from "@/lib/schema/invitation";
import { SandakadaPahanaMandala } from "@/components/templates/sandakada-pahana-mandala";
import { WeddingMusicPlayer } from "@/components/templates/wedding-music-player";
import { FloatingInvitationNav } from "@/components/templates/floating-invitation-nav";
import { Calendar, MapPin, ExternalLink, Heart } from "lucide-react";
import Image from "next/image";

interface TemplateRendererProps {
  templateId: string;
  content: InvitationContent;
  locale?: string;
  isMockup?: boolean;
}

export function TemplateRenderer({
  templateId,
  content,
  locale = "si",
  isMockup = false,
}: TemplateRendererProps) {
  const template: CulturalTemplate = getTemplateById(templateId);

  const accent = content.themeOverrides?.accentColor || template.accentColor;
  const surface = template.surfaceColor || "#fcf9f2";
  const ink = template.inkColor || "#2b1c11";

  const partnerOne = content.couple.partnerOne || "Kasun";
  const partnerTwo = content.couple.partnerTwo || "Sanduni";
  const events = content.events || [];

  const isTraditionalPoruwa =
    templateId === "poruwa-traditional" ||
    templateId === "kandyan-heritage" ||
    template.category === "traditional";

  return (
    <div
      id="home"
      lang={locale}
      className={`relative w-full transition-all ${
        isMockup
          ? "max-w-[360px] rounded-[32px] overflow-hidden"
          : "w-full"
      }`}
      style={{
        backgroundColor: surface,
        color: ink,
        minHeight: isMockup ? "640px" : "auto",
        lineHeight: locale === "si" || locale === "ta" ? 1.7 : 1.5,
      }}
    >
      {/* Decorative top cultural band / motif */}
      <div
        className="h-1.5 w-full"
        style={{
          background: `linear-gradient(90deg, ${accent}, #d97706, ${accent})`,
        }}
      />

      {/* Floating ceremonial music button */}
      <div className="absolute right-4 top-5 z-20">
        <WeddingMusicPlayer />
      </div>

      <div className="px-[var(--space-5)] py-[var(--space-6)] text-center relative">
        {/* Ornate Sandakada Pahana Mandala Arch for Traditional & Poruwa Templates */}
        {isTraditionalPoruwa ? (
          <div className="mb-[var(--space-2)] -mt-2">
            <SandakadaPahanaMandala accentColor={accent} />
          </div>
        ) : (
          <div className="mb-[var(--space-3)] flex items-center justify-center gap-[var(--space-2)]">
            <span
              className="h-[1px] w-8"
              style={{ backgroundColor: accent, opacity: 0.4 }}
            />
            <Heart className="h-3.5 w-3.5" style={{ color: accent }} strokeWidth={1.5} />
            <span
              className="h-[1px] w-8"
              style={{ backgroundColor: accent, opacity: 0.4 }}
            />
          </div>
        )}

        {/* Ceremonial Auspicious Banner */}
        <div className="space-y-1">
          <p
            className="font-serif italic text-[length:var(--text-base)] tracking-wider"
            style={{ color: accent }}
          >
            {locale === "si"
              ? "ආදර ආරාධනයයි !"
              : locale === "ta"
              ? "அன்பான அழைப்பிதழ் !"
              : "Love's Sacred Union"}
          </p>
          <p
            className="text-[length:var(--text-xs)] font-medium uppercase tracking-widest opacity-80"
            style={{ color: accent }}
          >
            {locale === "si"
              ? "විවාහ ආරාධනය"
              : locale === "ta"
              ? "திருமண அழைப்பிதழ்"
              : "Wedding Invitation"}
          </p>
        </div>

        {/* Auspicious Opening Blessings Phrasing */}
        <p className="mt-[var(--space-3)] mx-auto max-w-[32ch] text-[length:var(--text-xs)] text-[var(--ink-muted)] leading-[1.6]">
          {locale === "si"
            ? "දෙගුරුන්ගේ ආශිර්වාදයෙන් යුතුව අප දෙදෙනාගේ මංගල දින සැමරුමෙහිදී එක්වන ලෙස ගෞරවයෙන් ආරාධනා කරමු."
            : locale === "ta"
            ? "பெற்றோரின் ஆசியுடன் எங்கள் திருமண நன்னாளில் கலந்து கொண்டு வாழ்த்துமாறு அன்போடு அழைக்கின்றோம்."
            : "With the divine blessings of our parents, we warmly invite you to celebrate the joyous union of"}
        </p>

        {/* Parents Two-Column Blessing notes if provided */}
        {(content.couple.partnerOneParents || content.couple.partnerTwoParents) && (
          <div className="mt-[var(--space-4)] grid grid-cols-2 gap-[var(--space-2)] border-y border-amber-900/10 py-[var(--space-3)] text-[11px] text-[var(--ink-muted)] text-center">
            <div className="px-1 border-r border-amber-900/10">
              <span className="block font-medium text-[var(--ink)]">
                {locale === "si" ? "මනාල පාර්ශ්වය" : locale === "ta" ? "மணமகன் வீட்டார்" : "Groom's Family"}
              </span>
              <p className="mt-0.5 leading-[1.4]">{content.couple.partnerOneParents || (locale === "si" ? "සුනිල් පෙරේරා සහ මැතිණිය" : "Mr. & Mrs. Perera")}</p>
            </div>
            <div className="px-1">
              <span className="block font-medium text-[var(--ink)]">
                {locale === "si" ? "මනාලියගේ පාර්ශ්වය" : locale === "ta" ? "மணமகள் வீட்டார்" : "Bride's Family"}
              </span>
              <p className="mt-0.5 leading-[1.4]">{content.couple.partnerTwoParents || (locale === "si" ? "රන්ජිත් ප්‍රනාන්දු සහ මැතිණිය" : "Mr. & Mrs. Jayawardena")}</p>
            </div>
          </div>
        )}

        {/* Couple names calligraphy */}
        <h2
          className="font-display mt-[var(--space-4)] text-[length:var(--text-3xl)] font-normal leading-tight tracking-tight"
          style={{ color: ink }}
        >
          {partnerOne}
          <span
            className="block my-[var(--space-1)] text-[length:var(--text-xl)] font-serif italic"
            style={{ color: accent }}
          >
            &
          </span>
          {partnerTwo}
        </h2>

        {/* The Traditional Sri Lankan Kandyan Couple Illustration */}
        <div className="my-[var(--space-5)] flex justify-center">
          <div className="relative w-44 h-36 drop-shadow-md transition-transform hover:scale-105">
            <Image
              src="/images/kandyan-couple-transparent.png"
              alt="Traditional Sri Lankan wedding couple in Kandyan attire"
              fill
              sizes="(max-width: 768px) 180px, 200px"
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Date if provided */}
        {content.eventDate && (
          <div
            className="mt-[var(--space-2)] inline-flex items-center gap-[var(--space-2)] rounded-[var(--radius-md)] px-[var(--space-4)] py-[var(--space-2)] text-[length:var(--text-sm)] font-medium"
            style={{
              border: `1px solid color-mix(in oklch, ${accent} 25%, transparent)`,
              backgroundColor: "color-mix(in oklch, var(--surface) 60%, transparent)",
            }}
          >
            <Calendar className="h-4 w-4" style={{ color: accent }} strokeWidth={1.5} />
            <span>
              {new Date(content.eventDate).toLocaleDateString(locale, {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        )}

        {/* Story / Quote */}
        {content.story?.quote && (
          <div className="mt-[var(--space-6)] px-[var(--space-2)]">
            <blockquote
              className="font-serif italic text-[length:var(--text-sm)] leading-[1.7]"
              style={{ color: "var(--ink-muted)" }}
            >
              &ldquo;{content.story.quote}&rdquo;
            </blockquote>
          </div>
        )}

        {/* Events Section */}
        {events.length > 0 && (
          <div id="events" className="mt-[var(--space-8)] space-y-[var(--space-4)] text-left">
            <h2
              className="font-display text-center text-[length:var(--text-lg)] font-medium"
              style={{ color: ink }}
            >
              {locale === "si"
                ? "උත්සව විස්තර සහ සුබ නැකත්"
                : locale === "ta"
                ? "நிகழ்வு விவரங்கள் & சுப முகூர்த்தம்"
                : "Celebration Details & Auspicious Times"}
            </h2>

            {events.map((ev, index) => (
              <div
                key={ev.id || index}
                className="rounded-[var(--radius-md)] p-[var(--space-4)] transition-shadow hover:shadow-sm"
                style={{
                  border: `1px solid color-mix(in oklch, ${accent} 20%, transparent)`,
                  backgroundColor: "var(--surface)",
                }}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-[length:var(--text-base)] font-medium" style={{ color: ink }}>
                    {ev.title}
                  </h3>
                  {ev.startsAt && (
                    <span
                      className="text-[length:var(--text-xs)] font-semibold rounded px-2 py-0.5 bg-amber-100/70"
                      style={{ color: accent }}
                    >
                      {ev.startsAt}
                    </span>
                  )}
                </div>

                <div className="mt-[var(--space-2)] flex items-start gap-[var(--space-2)] text-[length:var(--text-xs)] text-[var(--ink-muted)]">
                  <MapPin className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" strokeWidth={1.5} />
                  <span>
                    {ev.venue}
                    {ev.address ? `, ${ev.address}` : ""}
                  </span>
                </div>

                {ev.notes && (
                  <p
                    className="mt-[var(--space-2)] text-[length:var(--text-xs)] italic font-medium"
                    style={{ color: accent }}
                  >
                    {ev.notes}
                  </p>
                )}

                {ev.mapUrl && (
                  <div id="venue" className="mt-[var(--space-3)]">
                    <a
                      href={ev.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-[var(--space-1)] text-[length:var(--text-xs)] font-medium hover:underline focus:outline-none"
                      style={{ color: accent, minHeight: "36px" }}
                    >
                      <span>
                        {locale === "si"
                          ? "සිතියම බලන්න (Google Maps)"
                          : locale === "ta"
                          ? "வரைபடத்தைப் பார்க்க"
                          : "View on Google Maps"}
                      </span>
                      <ExternalLink className="h-3 w-3" strokeWidth={1.5} />
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* RSVP Card Preview */}
        <div id="rsvp" className="mt-[var(--space-8)] pt-[var(--space-4)] border-t border-[var(--line)]">
          <p className="text-[length:var(--text-xs)] text-[var(--ink-muted)] mb-[var(--space-2)]">
            {locale === "si"
              ? "සෑම අමුත්තෙකුටම පුද්ගලික RSVP සබැඳියක් ඇත"
              : locale === "ta"
              ? "ஒவ்வொரு விருந்தினருக்கும் தனிப்பட்ட RSVP இணைப்பு உள்ளது"
              : "Each guest receives a personal RSVP link"}
          </p>
          <div
            className="inline-flex w-full items-center justify-center rounded-[var(--radius-md)] px-[var(--space-4)] py-[var(--space-2)] text-[length:var(--text-sm)] font-medium shadow-sm transition-opacity hover:opacity-95"
            style={{
              backgroundColor: accent,
              color: "var(--accent-ink)",
              minHeight: "var(--target)",
            }}
          >
            {locale === "si"
              ? "සහභාගීත්වය තහවුරු කරන්න (RSVP)"
              : locale === "ta"
              ? "பங்கேற்பை உறுதிப்படுத்தவும் (RSVP)"
              : "Confirm Your Attendance (RSVP)"}
          </div>
        </div>

        {/* Cultural blessing closer */}
        <div className="mt-[var(--space-6)] pb-[var(--space-6)] text-[length:var(--text-xs)] text-[var(--ink-muted)]">
          <p className="font-serif italic text-amber-800">
            {locale === "si"
              ? "ඔබ සැමට ජය මංගලම් වේවා!"
              : locale === "ta"
              ? "எல்லோருக்கும் மங்களம் உண்டாகட்டும்!"
              : "Blessings & warmest wishes"}
          </p>
        </div>

        {/* Floating Bottom Navigation Dock */}
        <FloatingInvitationNav accentColor={accent} />
      </div>
    </div>
  );
}
