"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { CULTURAL_TEMPLATES, CulturalTemplate } from "@/lib/templates";
import { createInvitationAction } from "@/app/actions/invitation";
import { toast } from "sonner";
import { Check, ArrowRight, Loader2 } from "lucide-react";

interface TemplatePickerProps {
  locale: string;
}

export function TemplatePicker({ locale }: TemplatePickerProps) {
  const t = useTranslations("templates");
  const router = useRouter();

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeTemplate, setActiveTemplate] = useState<CulturalTemplate | null>(null);

  // Form fields
  const [partnerOne, setPartnerOne] = useState("");
  const [partnerTwo, setPartnerTwo] = useState("");
  const [slug, setSlug] = useState("");
  const [invitationLocale, setInvitationLocale] = useState<"si" | "ta" | "en">(
    (locale as "si" | "ta" | "en") || "si",
  );
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const categories = [
    { id: "all", label: t("catAll") },
    { id: "traditional", label: t("catTraditional") },
    { id: "church", label: t("catChurch") },
    { id: "hindu", label: t("catHindu") },
    { id: "muslim", label: t("catMuslim") },
    { id: "modern", label: t("catModern") },
  ];

  const filteredTemplates =
    selectedCategory === "all"
      ? CULTURAL_TEMPLATES
      : CULTURAL_TEMPLATES.filter((tpl) => tpl.category === selectedCategory);

  // Auto-slugify when names change if slug was not manually touched
  function handlePartnerChange(p1: string, p2: string) {
    setPartnerOne(p1);
    setPartnerTwo(p2);
    const combined = `${p1}-${p2}`
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setSlug(combined);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!activeTemplate) return;
    setErrorMessage(null);

    if (!partnerOne.trim() || !partnerTwo.trim()) {
      setErrorMessage(t("namesRequired"));
      return;
    }

    if (!slug.trim()) {
      setErrorMessage(t("slugRequired"));
      return;
    }

    setLoading(true);

    try {
      const res = await createInvitationAction({
        templateSlug: activeTemplate.id,
        slug: slug.trim(),
        partnerOne: partnerOne.trim(),
        partnerTwo: partnerTwo.trim(),
        defaultLocale: invitationLocale,
      });

      if (res.error) {
        if (res.error === "slug_taken") {
          setErrorMessage(t("slugTaken"));
        } else {
          setErrorMessage(res.error);
        }
        setLoading(false);
        return;
      }

      if (res.success && res.invitationId) {
        toast.success(t("createdSuccess"));
        router.push(`/app/invitations/${res.invitationId}/edit`);
      }
    } catch {
      setErrorMessage(t("genericError"));
      setLoading(false);
    }
  }

  return (
    <div className="w-full">
      {/* Category filter tabs */}
      <div
        role="tablist"
        aria-label="Template categories"
        className="mb-[var(--space-8)] flex flex-wrap gap-[var(--space-2)]"
      >
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              role="tab"
              aria-selected={isSelected}
              onClick={() => setSelectedCategory(cat.id)}
              className="rounded-[var(--radius-md)] px-[var(--space-4)] py-[var(--space-2)] text-[length:var(--text-xs)] font-medium transition-colors focus:outline-none focus:ring-1 focus:ring-[var(--focus)] cursor-pointer"
              style={{
                backgroundColor: isSelected ? "var(--ink)" : "var(--surface)",
                color: isSelected ? "var(--surface)" : "var(--ink-muted)",
                border: "1px solid var(--line)",
                minHeight: "var(--target)",
              }}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Templates grid */}
      <div className="grid grid-cols-1 gap-[var(--space-6)] sm:grid-cols-2 lg:grid-cols-3">
        {filteredTemplates.map((tpl) => {
          const isChosen = activeTemplate?.id === tpl.id;
          const templateName = tpl.name[locale as keyof typeof tpl.name] || tpl.name.en;
          const templateDesc = tpl.description[locale as keyof typeof tpl.description] || tpl.description.en;

          return (
            <div
              key={tpl.id}
              className="flex flex-col justify-between rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface)] p-[var(--space-5)] text-left transition-shadow duration-[var(--dur-base)]"
              style={{
                boxShadow: isChosen
                  ? `0 0 0 2px var(--accent)`
                  : "none",
              }}
            >
              <div>
                {/* Visual template sample banner */}
                <div
                  className="mb-[var(--space-4)] flex h-36 flex-col justify-center rounded-[var(--radius-md)] p-[var(--space-4)] text-center"
                  style={{
                    backgroundColor: tpl.surfaceColor,
                    color: tpl.inkColor,
                    border: `1px solid color-mix(in oklch, ${tpl.accentColor} 25%, transparent)`,
                  }}
                >
                  <div
                    className="mx-auto mb-2 h-1 w-10 rounded-full"
                    style={{ backgroundColor: tpl.accentColor }}
                  />
                  <p
                    className="font-display text-[length:var(--text-lg)] font-normal leading-tight"
                    style={{ color: tpl.inkColor }}
                  >
                    Kasun & Sanduni
                  </p>
                  <p
                    className="mt-1 text-[length:var(--text-xs)] uppercase tracking-wider"
                    style={{ color: tpl.accentColor }}
                  >
                    {tpl.category}
                  </p>
                </div>

                <h3 className="font-display text-[length:var(--text-lg)] text-[var(--ink)]">
                  {templateName}
                </h3>
                <p className="mt-[var(--space-1)] text-[length:var(--text-xs)] leading-[1.6] text-[var(--ink-muted)]">
                  {templateDesc}
                </p>
              </div>

              <div className="mt-[var(--space-6)]">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTemplate(tpl);
                    setErrorMessage(null);
                  }}
                  className="inline-flex w-full items-center justify-center gap-[var(--space-2)] rounded-[var(--radius-md)] px-[var(--space-4)] py-[var(--space-2)] text-[length:var(--text-sm)] font-medium transition-colors focus:outline-none focus:ring-1 focus:ring-[var(--focus)] cursor-pointer"
                  style={{
                    backgroundColor: isChosen ? "var(--accent)" : "var(--surface-muted)",
                    color: isChosen ? "var(--accent-ink)" : "var(--ink)",
                    minHeight: "var(--target)",
                    border: isChosen ? "none" : "1px solid var(--line)",
                  }}
                >
                  {isChosen ? (
                    <>
                      <Check className="h-4 w-4" strokeWidth={1.5} />
                      <span>{t("selected")}</span>
                    </>
                  ) : (
                    <span>{t("selectDesign")}</span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Details drawer / form when a template is selected */}
      {activeTemplate && (
        <div
          className="mt-[var(--space-10)] rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface)] p-[var(--space-6)] text-left md:p-[var(--space-8)]"
          style={{
            borderLeft: `4px solid var(--accent)`,
          }}
        >
          <div className="mb-[var(--space-6)]">
            <h2 className="font-display text-[length:var(--text-xl)] text-[var(--ink)]">
              {t("setupHeading")}
            </h2>
            <p className="mt-[var(--space-1)] text-[length:var(--text-sm)] text-[var(--ink-muted)]">
              {t("setupSub")}
            </p>
          </div>

          {errorMessage && (
            <div
              role="alert"
              aria-live="polite"
              className="mb-[var(--space-4)] rounded-[var(--radius-md)] px-[var(--space-3)] py-[var(--space-2)] text-[length:var(--text-sm)] font-medium"
              style={{
                backgroundColor: "color-mix(in oklch, var(--danger) 12%, transparent)",
                color: "var(--danger)",
                border: "1px solid var(--danger)",
              }}
            >
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleCreate} className="space-y-[var(--space-4)] max-w-xl">
            <div className="grid grid-cols-1 gap-[var(--space-4)] sm:grid-cols-2">
              <div>
                <label
                  htmlFor="p1-name"
                  className="block text-[length:var(--text-sm)] font-medium text-[var(--ink)]"
                >
                  {t("partnerOneLabel")}
                </label>
                <input
                  id="p1-name"
                  type="text"
                  required
                  disabled={loading}
                  value={partnerOne}
                  onChange={(e) => handlePartnerChange(e.target.value, partnerTwo)}
                  placeholder={t("partnerOnePlaceholder")}
                  className="mt-[var(--space-1)] block w-full rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface)] px-[var(--space-3)] py-[var(--space-2)] text-[length:var(--text-base)] text-[var(--ink)] placeholder:text-[var(--ink-muted)] focus:border-[var(--focus)] focus:outline-none focus:ring-1 focus:ring-[var(--focus)]"
                  style={{ minHeight: "var(--target)" }}
                />
              </div>

              <div>
                <label
                  htmlFor="p2-name"
                  className="block text-[length:var(--text-sm)] font-medium text-[var(--ink)]"
                >
                  {t("partnerTwoLabel")}
                </label>
                <input
                  id="p2-name"
                  type="text"
                  required
                  disabled={loading}
                  value={partnerTwo}
                  onChange={(e) => handlePartnerChange(partnerOne, e.target.value)}
                  placeholder={t("partnerTwoPlaceholder")}
                  className="mt-[var(--space-1)] block w-full rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface)] px-[var(--space-3)] py-[var(--space-2)] text-[length:var(--text-base)] text-[var(--ink)] placeholder:text-[var(--ink-muted)] focus:border-[var(--focus)] focus:outline-none focus:ring-1 focus:ring-[var(--focus)]"
                  style={{ minHeight: "var(--target)" }}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="invitation-slug"
                className="block text-[length:var(--text-sm)] font-medium text-[var(--ink)]"
              >
                {t("slugLabel")}
              </label>
              <div className="mt-[var(--space-1)] flex items-center rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface)] px-[var(--space-3)] py-[var(--space-1)] focus-within:border-[var(--focus)] focus-within:ring-1 focus-within:ring-[var(--focus)]">
                <span className="text-[length:var(--text-xs)] text-[var(--ink-muted)]">
                  wedding.lk/i/
                </span>
                <input
                  id="invitation-slug"
                  type="text"
                  required
                  disabled={loading}
                  value={slug}
                  onChange={(e) =>
                    setSlug(
                      e.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9-]/g, "-"),
                    )
                  }
                  placeholder="kasun-sanduni"
                  className="ml-1 block w-full bg-transparent py-[var(--space-1)] text-[length:var(--text-sm)] text-[var(--ink)] focus:outline-none"
                  style={{ minHeight: "36px" }}
                />
              </div>
              <p className="mt-1 text-[length:var(--text-xs)] text-[var(--ink-muted)]">
                {t("slugHint")}
              </p>
            </div>

            <div>
              <label
                htmlFor="default-locale"
                className="block text-[length:var(--text-sm)] font-medium text-[var(--ink)]"
              >
                {t("languageLabel")}
              </label>
              <select
                id="default-locale"
                disabled={loading}
                value={invitationLocale}
                onChange={(e) => setInvitationLocale(e.target.value as "si" | "ta" | "en")}
                className="mt-[var(--space-1)] block w-full rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface)] px-[var(--space-3)] py-[var(--space-2)] text-[length:var(--text-sm)] text-[var(--ink)] focus:border-[var(--focus)] focus:outline-none focus:ring-1 focus:ring-[var(--focus)] cursor-pointer"
                style={{ minHeight: "var(--target)" }}
              >
                <option value="si">සිංහල (Sinhala)</option>
                <option value="ta">தமிழ் (Tamil)</option>
                <option value="en">English</option>
              </select>
            </div>

            <div className="pt-[var(--space-4)]">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-[var(--space-2)] rounded-[var(--radius-md)] px-[var(--space-6)] py-[var(--space-3)] text-[length:var(--text-base)] font-medium text-[var(--accent-ink)] transition-colors hover:bg-[color-mix(in_oklch,var(--accent),black_12%)] focus:outline-none focus:ring-2 focus:ring-[var(--focus)] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                style={{
                  backgroundColor: "var(--accent)",
                  minHeight: "var(--target)",
                }}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} />
                    <span>{t("creatingButton")}</span>
                  </>
                ) : (
                  <>
                    <span>{t("continueToEditor")}</span>
                    <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
