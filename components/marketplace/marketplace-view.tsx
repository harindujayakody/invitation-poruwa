"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { CULTURAL_TEMPLATES, CulturalTemplate } from "@/lib/templates";
import {
  Eye,
  ArrowRight,
  CheckCircle2,
  Heart,
  MessageSquare,
  LayoutGrid,
  Camera,
} from "lucide-react";

interface MarketplaceViewProps {
  locale: string;
}

export function MarketplaceView({ locale }: MarketplaceViewProps) {
  const t = useTranslations("marketplace");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    { id: "all", label: t("categoryAll") },
    { id: "traditional", label: t("categoryTraditional") },
    { id: "church", label: t("categoryChurch") },
    { id: "hindu", label: t("categoryHindu") },
    { id: "muslim", label: t("categoryMuslim") },
    { id: "modern", label: t("categoryModern") },
  ];

  const filteredTemplates = CULTURAL_TEMPLATES.filter((tpl) => {
    if (selectedCategory === "all") return true;
    return tpl.category === selectedCategory;
  });

  const getTemplateName = (tpl: CulturalTemplate) => {
    if (locale === "si") return tpl.name.si;
    if (locale === "ta") return tpl.name.ta;
    return tpl.name.en;
  };

  const getTemplateDesc = (tpl: CulturalTemplate) => {
    if (locale === "si") return tpl.description.si;
    if (locale === "ta") return tpl.description.ta;
    return tpl.description.en;
  };

  return (
    <div className="space-y-[var(--space-10)]">
      {/* Header section */}
      <div>
        <h1 className="font-display text-[length:var(--text-3xl)] font-bold tracking-tight text-[var(--ink)] md:text-[length:var(--text-4xl)]">
          {t("title")}
        </h1>
        <p className="mt-[var(--space-2)] max-w-prose text-[length:var(--text-base)] text-[var(--ink-muted)] leading-[1.7]">
          {t("subtitle")}
        </p>

        <div className="mt-[var(--space-4)] flex flex-wrap items-center gap-[var(--space-3)]">
          <span className="inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--surface)] px-[var(--space-3)] py-[var(--space-1)] text-[length:var(--text-xs)] font-medium text-[var(--ink)]">
            <CheckCircle2 className="h-3.5 w-3.5 text-[var(--ok)]" strokeWidth={1.5} />
            {t("badgeFreePreview")}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--surface)] px-[var(--space-3)] py-[var(--space-1)] text-[length:var(--text-xs)] font-medium text-[var(--ink)]">
            <CheckCircle2 className="h-3.5 w-3.5 text-[var(--ok)]" strokeWidth={1.5} />
            {t("badgePayOnce")}
          </span>
        </div>
      </div>

      {/* Category filter buttons */}
      <div className="w-full overflow-x-auto border-b border-[var(--line)] pb-[var(--space-2)]">
        <nav
          aria-label="Template categories"
          className="flex min-w-max items-center gap-[var(--space-2)]"
        >
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className="inline-flex items-center rounded-[var(--radius-md)] px-[var(--space-4)] py-[var(--space-2)] text-[length:var(--text-sm)] font-medium transition-colors focus:outline-none focus:ring-1 focus:ring-[var(--focus)] min-h-[var(--target)]"
                style={{
                  backgroundColor: isSelected ? "var(--surface)" : "transparent",
                  color: isSelected ? "var(--ink)" : "var(--ink-muted)",
                  border: isSelected ? "1px solid var(--line)" : "1px solid transparent",
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 gap-[var(--space-6)] sm:grid-cols-2 lg:grid-cols-3">
        {filteredTemplates.map((tpl) => {
          const tplName = getTemplateName(tpl);
          const tplDesc = getTemplateDesc(tpl);

          return (
            <article
              key={tpl.id}
              data-testid="template-marketplace-card"
              className="flex flex-col rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface)] p-[var(--space-4)] transition-all hover:border-[var(--ink-muted)]"
            >
              {/* Visual preview box */}
              <div
                className="relative flex h-48 w-full flex-col justify-between overflow-hidden rounded-[var(--radius-md)] p-[var(--space-4)] border border-[var(--line)]"
                style={{
                  backgroundColor: tpl.surfaceColor,
                  color: tpl.inkColor,
                }}
              >
                {/* Decorative cultural top band */}
                <div
                  className="absolute left-0 top-0 h-1.5 w-full"
                  style={{ backgroundColor: tpl.accentColor }}
                />

                <div className="pt-2">
                  <div className="flex items-center gap-1.5">
                    <Heart className="h-3 w-3" style={{ color: tpl.accentColor }} strokeWidth={1.5} />
                    <span
                      className="text-[10px] font-medium uppercase tracking-wider"
                      style={{ color: tpl.accentColor }}
                    >
                      {tpl.category}
                    </span>
                  </div>
                  <h3
                    className="font-display mt-2 text-[length:var(--text-lg)] font-normal leading-tight"
                    style={{ color: tpl.inkColor }}
                  >
                    {locale === "si" ? "කසුන් & සඳුනි" : locale === "ta" ? "சுரேஷ் & மீரா" : "Kasun & Sanduni"}
                  </h3>
                </div>

                <div className="border-t border-black/10 pt-2 text-[11px] opacity-75">
                  {tpl.defaultEvents.en[0]?.title || "Ceremony"} · Colombo
                </div>
              </div>

              {/* Template details */}
              <div className="mt-[var(--space-4)] flex flex-1 flex-col justify-between space-y-[var(--space-4)]">
                <div>
                  <h2 className="text-[length:var(--text-base)] font-semibold text-[var(--ink)]">
                    {tplName}
                  </h2>
                  <p className="mt-[var(--space-1)] text-[length:var(--text-xs)] text-[var(--ink-muted)] line-clamp-2 leading-[1.6]">
                    {tplDesc}
                  </p>

                  {/* Swatches */}
                  <div className="mt-[var(--space-3)] flex items-center gap-[var(--space-2)]">
                    <span className="text-[length:var(--text-xs)] text-[var(--ink-muted)]">Palette:</span>
                    <div className="flex items-center gap-1.5">
                      <span
                        className="h-3.5 w-3.5 rounded-full border border-black/10"
                        style={{ backgroundColor: tpl.accentColor }}
                        title="Accent Color"
                      />
                      <span
                        className="h-3.5 w-3.5 rounded-full border border-black/10"
                        style={{ backgroundColor: tpl.surfaceColor }}
                        title="Surface Color"
                      />
                      <span
                        className="h-3.5 w-3.5 rounded-full border border-black/10"
                        style={{ backgroundColor: tpl.inkColor }}
                        title="Ink Color"
                      />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-[var(--space-2)] pt-[var(--space-2)] border-t border-[var(--line)]">
                  <Link
                    href={`/samples/${tpl.id}`}
                    className="inline-flex w-full items-center justify-center gap-[var(--space-2)] rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface)] px-[var(--space-3)] py-[var(--space-2)] text-[length:var(--text-xs)] font-medium text-[var(--ink)] hover:bg-[var(--line)] focus:outline-none focus:ring-1 focus:ring-[var(--focus)] min-h-[var(--target)]"
                  >
                    <Eye className="h-3.5 w-3.5" strokeWidth={1.5} />
                    <span>{t("livePreview")}</span>
                  </Link>

                  <Link
                    href={`/app/new?template=${tpl.id}`}
                    className="inline-flex w-full items-center justify-center gap-[var(--space-2)] rounded-[var(--radius-md)] bg-[var(--accent)] px-[var(--space-3)] py-[var(--space-2)] text-[length:var(--text-xs)] font-medium text-white hover:opacity-90 focus:outline-none focus:ring-1 focus:ring-[var(--focus)] min-h-[var(--target)]"
                  >
                    <span>{t("useTemplate")}</span>
                    <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Platform Features Section */}
      <section
        aria-labelledby="features-heading"
        className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface)] p-[var(--space-6)]"
      >
        <h2
          id="features-heading"
          className="font-display text-[length:var(--text-xl)] font-semibold text-[var(--ink)]"
        >
          {t("featuresTitle")}
        </h2>

        <div className="mt-[var(--space-4)] grid grid-cols-1 gap-[var(--space-4)] sm:grid-cols-2">
          <div className="flex items-start gap-[var(--space-3)]">
            <MessageSquare className="h-5 w-5 shrink-0 text-[var(--accent)]" strokeWidth={1.5} />
            <p className="text-[length:var(--text-sm)] text-[var(--ink-muted)]">
              {t("feature1")}
            </p>
          </div>
          <div className="flex items-start gap-[var(--space-3)]">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-[var(--accent)]" strokeWidth={1.5} />
            <p className="text-[length:var(--text-sm)] text-[var(--ink-muted)]">
              {t("feature2")}
            </p>
          </div>
          <div className="flex items-start gap-[var(--space-3)]">
            <LayoutGrid className="h-5 w-5 shrink-0 text-[var(--accent)]" strokeWidth={1.5} />
            <p className="text-[length:var(--text-sm)] text-[var(--ink-muted)]">
              {t("feature3")}
            </p>
          </div>
          <div className="flex items-start gap-[var(--space-3)]">
            <Camera className="h-5 w-5 shrink-0 text-[var(--accent)]" strokeWidth={1.5} />
            <p className="text-[length:var(--text-sm)] text-[var(--ink-muted)]">
              {t("feature4")}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
