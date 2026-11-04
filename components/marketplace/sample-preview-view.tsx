"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { CulturalTemplate } from "@/lib/templates";
import { TemplateRenderer } from "@/components/templates/template-renderer";
import { InvitationContent } from "@/lib/schema/invitation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

interface SamplePreviewViewProps {
  template: CulturalTemplate;
  locale: string;
}

export function SamplePreviewView({ template, locale }: SamplePreviewViewProps) {
  const t = useTranslations("marketplace");
  const pathname = usePathname();
  const router = useRouter();

  // Realistic sample content based on the template
  const getSampleContent = (): InvitationContent => {
    const isSinhala = locale === "si";
    const isTamil = locale === "ta";

    let partnerOne = "Kasun Perera";
    let partnerTwo = "Sanduni Jayawardena";
    let quote = "Together, we step into a lifetime of shared dreams and cherished moments.";

    if (template.category === "church") {
      partnerOne = "Rohan Fernando";
      partnerTwo = "Priyanthi De Silva";
      quote = "Love is patient, love is kind. Blessed to begin our journey together.";
    } else if (template.category === "hindu") {
      partnerOne = isTamil ? "சுரேஷ் சுந்தரம்" : "Suresh Sundaram";
      partnerTwo = isTamil ? "மீரா சிவகுமார்" : "Meera Sivakumar";
      quote = "Under the divine blessings of our elders and deities, two families unite as one.";
    } else if (template.category === "muslim") {
      partnerOne = "Tariq Mansoor";
      partnerTwo = "Fatima Rameez";
      quote = "And We created you in pairs. Blessed to unite in faith and love.";
    }

    const localizedEvents = isSinhala
      ? template.defaultEvents.si
      : isTamil
      ? template.defaultEvents.ta
      : template.defaultEvents.en;

    const sampleEventDate = "2026-12-21T09:42:00.000Z";

    return {
      couple: {
        partnerOne,
        partnerTwo,
        partnerOneParents: isSinhala
          ? "මහින්ද සහ ශිරාණි පෙරේරා යුවළගේ පුත්"
          : isTamil
          ? "சுந்தரம் & லட்சுமி அவர்களின் புதல்வன்"
          : "Son of Mr. & Mrs. M. Perera",
        partnerTwoParents: isSinhala
          ? "සුනිල් සහ චිත්‍රා ජයවර්ධන යුවළගේ දියණිය"
          : isTamil
          ? "சிவகுமார் & சாந்தி அவர்களின் புதல்வி"
          : "Daughter of Mr. & Mrs. S. Jayawardena",
      },
      story: {
        quote,
      },
      events: localizedEvents.map((ev, i) => ({
        id: `ev-${i}`,
        title: ev.title,
        venue: ev.venue,
        sort: i,
        startsAt: i === 0 ? "09:42 AM" : "12:30 PM",
        address: "Colombo, Sri Lanka",
        mapUrl: "https://maps.google.com",
        notes: ev.notes,
      })),
      eventDate: sampleEventDate,
      sections: {
        showCover: true,
        showEvents: true,
        showStory: true,
        showRsvp: true,
        showGifts: false,
      },
    };
  };

  const sampleContent = getSampleContent();
  const templateName =
    locale === "si" ? template.name.si : locale === "ta" ? template.name.ta : template.name.en;

  const [simulatedRsvp, setSimulatedRsvp] = useState<"accepted" | "declined" | null>(null);

  const switchLocale = (newLocale: string) => {
    // Current path is /samples/[slug]
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="min-h-screen bg-[var(--surface-sunken)] pb-[var(--space-12)]">
      {/* Top sticky sample showcase banner */}
      <header
        role="banner"
        className="sticky top-0 z-50 flex items-center justify-between border-b border-[var(--line)] bg-[var(--surface)] px-[var(--space-4)] py-[var(--space-3)] sm:px-[var(--space-6)]"
      >
        <div className="flex items-center gap-[var(--space-3)]">
          <Link
            href="/templates"
            className="inline-flex items-center gap-1.5 text-[length:var(--text-xs)] font-medium text-[var(--ink-muted)] hover:text-[var(--ink)] focus:outline-none min-h-[var(--target)]"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
            <span className="hidden sm:inline">{t("backToTemplates")}</span>
          </Link>
          <span className="text-[var(--line)]">|</span>
          <span className="text-[length:var(--text-xs)] font-semibold text-[var(--ink)]">
            {templateName}
          </span>
        </div>

        <div className="flex items-center gap-[var(--space-3)]">
          {/* Locale switcher */}
          <div className="flex items-center gap-1 text-[length:var(--text-xs)]">
            <button
              type="button"
              onClick={() => switchLocale("si")}
              className={`px-2 py-1 rounded-[var(--radius-sm)] ${locale === "si" ? "bg-[var(--line)] font-bold text-[var(--ink)]" : "text-[var(--ink-muted)]"} min-h-[var(--target)]`}
            >
              සිං
            </button>
            <button
              type="button"
              onClick={() => switchLocale("ta")}
              className={`px-2 py-1 rounded-[var(--radius-sm)] ${locale === "ta" ? "bg-[var(--line)] font-bold text-[var(--ink)]" : "text-[var(--ink-muted)]"} min-h-[var(--target)]`}
            >
              தம
            </button>
            <button
              type="button"
              onClick={() => switchLocale("en")}
              className={`px-2 py-1 rounded-[var(--radius-sm)] ${locale === "en" ? "bg-[var(--line)] font-bold text-[var(--ink)]" : "text-[var(--ink-muted)]"} min-h-[var(--target)]`}
            >
              EN
            </button>
          </div>

          {/* Primary CTA */}
          <Link
            href={`/app/new?template=${template.id}`}
            className="inline-flex items-center gap-1.5 rounded-[var(--radius-md)] bg-[var(--accent)] px-[var(--space-3)] py-[var(--space-2)] text-[length:var(--text-xs)] font-medium text-white hover:opacity-90 focus:outline-none min-h-[var(--target)]"
          >
            <span>{t("useThisDesignNow")}</span>
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
          </Link>
        </div>
      </header>

      {/* Main Preview Container — centered phone-style layout with authentic tokens */}
      <main className="mx-auto mt-[var(--space-6)] max-w-lg px-[var(--space-4)]">
        <div className="overflow-hidden rounded-[var(--radius-xl)] border border-[var(--line)] bg-[var(--surface)] shadow-md">
          {/* Cultural template render */}
          <TemplateRenderer
            templateId={template.id}
            content={sampleContent}
            locale={locale}
            isMockup={false}
          />

          {/* Simulated RSVP Card Preview */}
          <div className="border-t border-[var(--line)] bg-[var(--surface)] p-[var(--space-6)]">
            <h3 className="font-display text-[length:var(--text-base)] font-semibold text-[var(--ink)]">
              {locale === "si"
                ? "ආරාධනය පිළිගැනීම (නියැදි RSVP පෝරමය)"
                : locale === "ta"
                ? "உங்கள் வருகையை உறுதிப்படுத்துங்கள்"
                : "Confirm Your Attendance (Sample RSVP)"}
            </h3>
            <p className="mt-[var(--space-1)] text-[length:var(--text-xs)] text-[var(--ink-muted)]">
              {locale === "si"
                ? "ඔබගේ ආරාධිතයින්ට WhatsApp හරහා ලැබෙන සජීවී ප්‍රතිචාර දැක්වීමේ අත්දැකීම."
                : locale === "ta"
                ? "விருந்தினர்கள் WhatsApp மூலம் எளிதாக பதிலளிக்கும் முறை."
                : "How each of your guests will experience responding via their personal link."}
            </p>

            <div className="mt-[var(--space-4)] flex gap-[var(--space-3)]">
              <button
                type="button"
                onClick={() => setSimulatedRsvp("accepted")}
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-[var(--radius-md)] border border-[var(--line)] px-[var(--space-3)] py-[var(--space-2)] text-[length:var(--text-xs)] font-medium transition-colors min-h-[var(--target)]"
                style={{
                  backgroundColor: simulatedRsvp === "accepted" ? "var(--accent)" : "var(--surface)",
                  color: simulatedRsvp === "accepted" ? "white" : "var(--ink)",
                }}
              >
                <CheckCircle2 className="h-4 w-4" strokeWidth={1.5} />
                <span>
                  {locale === "si" ? "පැමිණේ" : locale === "ta" ? "வருகிறேன்" : "Attending"}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSimulatedRsvp("declined")}
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-[var(--radius-md)] border border-[var(--line)] px-[var(--space-3)] py-[var(--space-2)] text-[length:var(--text-xs)] font-medium transition-colors min-h-[var(--target)]"
                style={{
                  backgroundColor: simulatedRsvp === "declined" ? "var(--ink-muted)" : "var(--surface)",
                  color: simulatedRsvp === "declined" ? "white" : "var(--ink)",
                }}
              >
                <span>
                  {locale === "si" ? "පැමිණිය නොහැක" : locale === "ta" ? "வர இயலாது" : "Cannot Attend"}
                </span>
              </button>
            </div>

            {simulatedRsvp && (
              <div className="mt-[var(--space-3)] rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-sunken)] p-[var(--space-3)] text-[length:var(--text-xs)] text-[var(--ink)]">
                {simulatedRsvp === "accepted"
                  ? locale === "si"
                    ? "ස්තූතියි! ඔබේ සහභාගීත්වය මනාල යුවළගේ පාලක පුවරුවට ක්ෂණිකව එකතු විය."
                    : locale === "ta"
                    ? "நன்றி! உங்கள் வருகை மணமக்களின் டாஷ்போர்டில் பதிவு செய்யப்பட்டது."
                    : "Simulated response recorded! Couple sees updated headcount instantly."
                  : locale === "si"
                  ? "ඔබගේ සුබපැතුම් මනාල යුවළ වෙත යොමු කරන ලදී."
                  : locale === "ta"
                  ? "உங்கள் வாழ்த்துக்கள் மணமக்களுக்கு தெரிவிக்கப்பட்டது."
                  : "Response noted. The couple is notified with gratitude."}
              </div>
            )}
          </div>
        </div>

        {/* Bottom CTA block */}
        <div className="mt-[var(--space-6)] text-center">
          <Link
            href={`/app/new?template=${template.id}`}
            className="inline-flex w-full items-center justify-center gap-[var(--space-2)] rounded-[var(--radius-md)] bg-[var(--accent)] px-[var(--space-4)] py-[var(--space-3)] text-[length:var(--text-sm)] font-medium text-white hover:opacity-90 min-h-[var(--target)]"
          >
            <span>{t("useThisDesignNow")}</span>
            <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
          </Link>
        </div>
      </main>
    </div>
  );
}
