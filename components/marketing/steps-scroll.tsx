"use client";

import { useTranslations } from "next-intl";
import { Palette, PenLine, Send, BarChart3 } from "lucide-react";
import type { ReactNode } from "react";

const stepIcons: Record<number, ReactNode> = {
  0: <Palette size={24} strokeWidth={1.5} aria-hidden="true" />,
  1: <PenLine size={24} strokeWidth={1.5} aria-hidden="true" />,
  2: <Send size={24} strokeWidth={1.5} aria-hidden="true" />,
  3: <BarChart3 size={24} strokeWidth={1.5} aria-hidden="true" />,
};

/*
 * Phone preview screens — placeholder representations of each step.
 * These use simple CSS shapes instead of real screenshots.
 */
function PhoneScreen({ step }: { step: number }) {
  const colours = [
    "var(--accent)",
    "var(--success)",
    "var(--ink-muted)",
    "var(--accent)",
  ];
  return (
    <div
      className="flex h-full flex-col items-start justify-end p-[var(--space-6)]"
      style={{ backgroundColor: "var(--surface-raised)" }}
    >
      {/* Placeholder content blocks */}
      <div
        className="mb-[var(--space-4)] h-3 w-3/4 rounded-[var(--radius-sm)]"
        style={{ backgroundColor: colours[step], opacity: 0.2 }}
      />
      <div
        className="mb-[var(--space-3)] h-3 w-1/2 rounded-[var(--radius-sm)]"
        style={{ backgroundColor: colours[step], opacity: 0.35 }}
      />
      <div
        className="mb-[var(--space-6)] h-20 w-full rounded-[var(--radius-md)]"
        style={{ backgroundColor: colours[step], opacity: 0.12 }}
      />
      <div
        className="h-10 w-2/3 rounded-[var(--radius-md)]"
        style={{ backgroundColor: colours[step], opacity: 0.6 }}
      />
    </div>
  );
}

function PhoneFrame({
  children,
  visible,
}: {
  children: ReactNode;
  visible: boolean;
}) {
  return (
    <div
      className="aspect-[9/19.5] w-[220px] overflow-hidden rounded-[28px] border-2 transition-opacity duration-[var(--dur-reveal)]"
      style={{
        borderColor: "var(--line)",
        backgroundColor: "var(--surface-raised)",
        opacity: visible ? 1 : 0,
      }}
      aria-hidden="true"
    >
      {/* Notch */}
      <div className="mx-auto mt-[var(--space-2)] h-5 w-20 rounded-full" style={{ backgroundColor: "var(--line)" }} />
      {children}
    </div>
  );
}

export function StepsScroll() {
  const t = useTranslations("steps");

  const steps = [
    { title: t("s1Title"), desc: t("s1Desc") },
    { title: t("s2Title"), desc: t("s2Desc") },
    { title: t("s3Title"), desc: t("s3Desc") },
    { title: t("s4Title"), desc: t("s4Desc") },
  ];

  return (
    <section
      className="relative px-[var(--space-6)] py-[var(--space-18)] md:px-[var(--space-12)]"
      style={{ backgroundColor: "var(--surface)" }}
    >
      <h2
        className="mb-[var(--space-8)] text-[length:var(--text-sm)] font-medium uppercase tracking-wide"
        style={{ color: "var(--ink-muted)" }}
      >
        {t("label")}
      </h2>

      {/* Grid: steps text on left, sticky phone on right (desktop) */}
      <div className="md:grid md:grid-cols-[1fr_280px] md:gap-[var(--space-12)]">
        {/* Steps list */}
        <div className="flex flex-col gap-[var(--space-18)]">
          {steps.map((step, i) => (
            <div
              key={i}
              className="scroll-step flex items-start gap-[var(--space-4)]"
              data-step={i}
            >
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)]"
                style={{
                  backgroundColor: "var(--accent)",
                  color: "var(--accent-ink)",
                }}
              >
                {stepIcons[i]}
              </div>
              <div style={{ maxWidth: "var(--measure)" }}>
                <h3
                  className="text-[length:var(--text-lg)] font-semibold leading-[var(--leading-heading)]"
                  style={{ color: "var(--ink)" }}
                >
                  {step.title}
                </h3>
                <p
                  className="mt-[var(--space-2)] text-[length:var(--text-base)] leading-[var(--leading-body)]"
                  style={{ color: "var(--ink-muted)" }}
                >
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Sticky phone preview — visible on md+ only */}
        <div
          className="sticky-phone hidden md:block"
          style={{ position: "sticky", top: "var(--space-12)", alignSelf: "start" }}
        >
          {/*
            CSS scroll-driven animation: each .scroll-step triggers a phone
            screen change via animation-timeline: view(). We use CSS only
            inside @supports. Without support, all screens are stacked and
            the first is visible.
          */}
          {steps.map((_, i) => (
            <div
              key={i}
              className="phone-screen absolute inset-0"
              style={{
                opacity: i === 0 ? 1 : 0,
                zIndex: i === 0 ? 1 : 0,
              }}
            >
              <PhoneFrame visible={i === 0}>
                <PhoneScreen step={i} />
              </PhoneFrame>
            </div>
          ))}

          {/* Base frame that holds position */}
          <div style={{ visibility: "hidden" }}>
            <PhoneFrame visible={false}>
              <PhoneScreen step={0} />
            </PhoneFrame>
          </div>
        </div>
      </div>

      {/*
        Scroll-driven animation for the phone.
        Uses CSS only — wrapped in @supports for progressive enhancement.
        Content is fully visible without animation support.
      */}
      <style>{`
        @supports (animation-timeline: view()) {
          @media (prefers-reduced-motion: no-preference) and (min-width: 768px) {
            .scroll-step[data-step="0"] {
              view-timeline: --step0 block;
            }
            .scroll-step[data-step="1"] {
              view-timeline: --step1 block;
            }
            .scroll-step[data-step="2"] {
              view-timeline: --step2 block;
            }
            .scroll-step[data-step="3"] {
              view-timeline: --step3 block;
            }

            .phone-screen:nth-child(1) {
              animation: fadePhone linear both;
              animation-timeline: --step0;
              animation-range: exit 0% exit 50%;
              opacity: 1;
              z-index: 1;
            }
            .phone-screen:nth-child(2) {
              animation: showPhone linear both;
              animation-timeline: --step1;
              animation-range: entry 20% cover 40%;
              z-index: 2;
            }
            .phone-screen:nth-child(3) {
              animation: showPhone linear both;
              animation-timeline: --step2;
              animation-range: entry 20% cover 40%;
              z-index: 3;
            }
            .phone-screen:nth-child(4) {
              animation: showPhone linear both;
              animation-timeline: --step3;
              animation-range: entry 20% cover 40%;
              z-index: 4;
            }
          }
        }

        @keyframes fadePhone {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        @keyframes showPhone {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: none; }
        }
      `}</style>
    </section>
  );
}
