"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { InvitationContent, EventItem } from "@/lib/schema/invitation";
import { CULTURAL_TEMPLATES } from "@/lib/templates";
import { updateInvitationAction } from "@/app/actions/invitation";
import { TemplateRenderer } from "@/components/templates/template-renderer";
import { toast } from "sonner";
import {
  Save,
  Loader2,
  Plus,
  Trash2,
  Eye,
  Edit3,
} from "lucide-react";

interface InvitationEditorProps {
  invitationId: string;
  slug: string;
  initialTemplateSlug: string;
  initialDefaultLocale: "si" | "ta" | "en";
  initialEventDate: string | null;
  initialContent: InvitationContent;
  locale: string;
}

export function InvitationEditor({
  invitationId,
  slug,
  initialTemplateSlug,
  initialDefaultLocale,
  initialEventDate,
  initialContent,
  locale,
}: InvitationEditorProps) {
  const t = useTranslations("editor");

  const [templateSlug, setTemplateSlug] = useState(initialTemplateSlug);
  const [contentLocale, setContentLocale] = useState<"si" | "ta" | "en">(initialDefaultLocale);
  const [eventDate, setEventDate] = useState<string>(initialEventDate || "");
  const [content, setContent] = useState<InvitationContent>(initialContent);
  const [saving, setSaving] = useState(false);

  // Mobile viewport toggle between form editor and phone preview
  const [mobileTab, setMobileTab] = useState<"edit" | "preview">("edit");

  // Couple field updates
  function updateCouple(field: string, value: string) {
    setContent((prev) => ({
      ...prev,
      couple: {
        ...prev.couple,
        [field]: value,
      },
    }));
  }

  // Story field updates
  function updateStory(field: string, value: string) {
    setContent((prev) => ({
      ...prev,
      story: {
        ...prev.story,
        [field]: value,
      },
    }));
  }

  // Events management
  function updateEvent<K extends keyof EventItem>(id: string, field: K, value: EventItem[K]) {
    setContent((prev) => ({
      ...prev,
      events: prev.events.map((ev) => (ev.id === id ? { ...ev, [field]: value } : ev)),
    }));
  }

  function addEvent() {
    const newId = `ev-${Date.now()}`;
    const newEvent: EventItem = {
      id: newId,
      title: contentLocale === "si" ? "නව උත්සවය" : contentLocale === "ta" ? "புதிய நிகழ்வு" : "New Event",
      venue: "",
      startsAt: "",
      notes: "",
      sort: content.events.length,
    };
    setContent((prev) => ({
      ...prev,
      events: [...prev.events, newEvent],
    }));
  }

  function removeEvent(id: string) {
    setContent((prev) => ({
      ...prev,
      events: prev.events.filter((ev) => ev.id !== id),
    }));
  }

  // Save changes
  async function handleSave() {
    setSaving(true);
    try {
      const res = await updateInvitationAction({
        id: invitationId,
        templateSlug,
        defaultLocale: contentLocale,
        eventDate: eventDate || null,
        content: {
          ...content,
          eventDate: eventDate || undefined,
        },
      });

      if (res.error) {
        toast.error(t("saveError"));
      } else {
        toast.success(t("saveSuccess"));
      }
    } catch {
      toast.error(t("saveError"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="w-full">
      {/* Top action bar */}
      <div
        className="mb-[var(--space-6)] flex flex-wrap items-center justify-between gap-[var(--space-4)] rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface)] p-[var(--space-4)] md:px-[var(--space-6)]"
      >
        <div>
          <span className="text-[length:var(--text-xs)] text-[var(--ink-muted)]">
            {t("invitationUrl")}:
          </span>
          <p className="font-mono text-[length:var(--text-sm)] font-medium text-[var(--ink)]">
            wedding.lk/i/{slug}
          </p>
        </div>

        <div className="flex items-center gap-[var(--space-3)]">
          {/* Mobile switcher: Edit / Preview */}
          <div className="inline-flex rounded-[var(--radius-md)] border border-[var(--line)] p-[2px] lg:hidden">
            <button
              type="button"
              onClick={() => setMobileTab("edit")}
              className="inline-flex items-center gap-[var(--space-1)] rounded-[var(--radius-sm)] px-[var(--space-3)] py-[var(--space-1)] text-[length:var(--text-xs)] font-medium"
              style={{
                backgroundColor: mobileTab === "edit" ? "var(--ink)" : "transparent",
                color: mobileTab === "edit" ? "var(--surface)" : "var(--ink-muted)",
                minHeight: "36px",
              }}
            >
              <Edit3 className="h-3.5 w-3.5" strokeWidth={1.5} />
              <span>{t("editTab")}</span>
            </button>
            <button
              type="button"
              onClick={() => setMobileTab("preview")}
              className="inline-flex items-center gap-[var(--space-1)] rounded-[var(--radius-sm)] px-[var(--space-3)] py-[var(--space-1)] text-[length:var(--text-xs)] font-medium"
              style={{
                backgroundColor: mobileTab === "preview" ? "var(--ink)" : "transparent",
                color: mobileTab === "preview" ? "var(--surface)" : "var(--ink-muted)",
                minHeight: "36px",
              }}
            >
              <Eye className="h-3.5 w-3.5" strokeWidth={1.5} />
              <span>{t("previewTab")}</span>
            </button>
          </div>

          <button
            type="button"
            disabled={saving}
            onClick={handleSave}
            className="inline-flex items-center gap-[var(--space-2)] rounded-[var(--radius-md)] px-[var(--space-4)] py-[var(--space-2)] text-[length:var(--text-sm)] font-medium text-[var(--accent-ink)] transition-colors hover:bg-[color-mix(in_oklch,var(--accent),black_12%)] focus:outline-none focus:ring-2 focus:ring-[var(--focus)] disabled:opacity-50 cursor-pointer"
            style={{
              backgroundColor: "var(--accent)",
              minHeight: "var(--target)",
            }}
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} />
                <span>{t("saving")}</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" strokeWidth={1.5} />
                <span>{t("saveButton")}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Editor Split View: Form on Left, Live Phone on Right */}
      <div className="grid grid-cols-1 gap-[var(--space-8)] lg:grid-cols-12">
        {/* LEFT COLUMN: Form Controls */}
        <div
          className={`space-y-[var(--space-6)] lg:col-span-7 ${mobileTab === "preview" ? "hidden lg:block" : "block"}`}
        >
          {/* Section 1: Template Style & Language */}
          <div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface)] p-[var(--space-5)] text-left">
            <h2 className="font-display text-[length:var(--text-lg)] text-[var(--ink)]">
              {t("styleSectionTitle")}
            </h2>
            <p className="mt-1 text-[length:var(--text-xs)] text-[var(--ink-muted)]">
              {t("styleSectionSub")}
            </p>

            <div className="mt-[var(--space-4)] grid grid-cols-1 gap-[var(--space-4)] sm:grid-cols-2">
              <div>
                <label
                  htmlFor="template-select"
                  className="block text-[length:var(--text-xs)] font-medium text-[var(--ink)]"
                >
                  {t("chooseTemplate")}
                </label>
                <select
                  id="template-select"
                  value={templateSlug}
                  onChange={(e) => setTemplateSlug(e.target.value)}
                  className="mt-1 block w-full rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface)] px-[var(--space-3)] py-[var(--space-2)] text-[length:var(--text-sm)] text-[var(--ink)] focus:border-[var(--focus)] focus:outline-none"
                  style={{ minHeight: "var(--target)" }}
                >
                  {CULTURAL_TEMPLATES.map((tpl) => (
                    <option key={tpl.id} value={tpl.id}>
                      {tpl.name[locale as keyof typeof tpl.name] || tpl.name.en}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="language-select"
                  className="block text-[length:var(--text-xs)] font-medium text-[var(--ink)]"
                >
                  {t("invitationLanguage")}
                </label>
                <select
                  id="language-select"
                  value={contentLocale}
                  onChange={(e) => setContentLocale(e.target.value as "si" | "ta" | "en")}
                  className="mt-1 block w-full rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface)] px-[var(--space-3)] py-[var(--space-2)] text-[length:var(--text-sm)] text-[var(--ink)] focus:border-[var(--focus)] focus:outline-none"
                  style={{ minHeight: "var(--target)" }}
                >
                  <option value="si">සිංහල (Sinhala)</option>
                  <option value="ta">தமிழ் (Tamil)</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Couple & Date */}
          <div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface)] p-[var(--space-5)] text-left">
            <h2 className="font-display text-[length:var(--text-lg)] text-[var(--ink)]">
              {t("coupleSectionTitle")}
            </h2>
            <p className="mt-1 text-[length:var(--text-xs)] text-[var(--ink-muted)]">
              {t("coupleSectionSub")}
            </p>

            <div className="mt-[var(--space-4)] space-y-[var(--space-4)]">
              <div className="grid grid-cols-1 gap-[var(--space-4)] sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="partner-one"
                    className="block text-[length:var(--text-xs)] font-medium text-[var(--ink)]"
                  >
                    {t("partnerOneLabel")}
                  </label>
                  <input
                    id="partner-one"
                    type="text"
                    value={content.couple.partnerOne}
                    onChange={(e) => updateCouple("partnerOne", e.target.value)}
                    placeholder="Kasun"
                    className="mt-1 block w-full rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface)] px-[var(--space-3)] py-[var(--space-2)] text-[length:var(--text-sm)] text-[var(--ink)] focus:border-[var(--focus)] focus:outline-none"
                    style={{ minHeight: "var(--target)" }}
                  />
                </div>

                <div>
                  <label
                    htmlFor="partner-two"
                    className="block text-[length:var(--text-xs)] font-medium text-[var(--ink)]"
                  >
                    {t("partnerTwoLabel")}
                  </label>
                  <input
                    id="partner-two"
                    type="text"
                    value={content.couple.partnerTwo}
                    onChange={(e) => updateCouple("partnerTwo", e.target.value)}
                    placeholder="Sanduni"
                    className="mt-1 block w-full rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface)] px-[var(--space-3)] py-[var(--space-2)] text-[length:var(--text-sm)] text-[var(--ink)] focus:border-[var(--focus)] focus:outline-none"
                    style={{ minHeight: "var(--target)" }}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="event-date"
                  className="block text-[length:var(--text-xs)] font-medium text-[var(--ink)]"
                >
                  {t("weddingDateLabel")}
                </label>
                <input
                  id="event-date"
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="mt-1 block w-full rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface)] px-[var(--space-3)] py-[var(--space-2)] text-[length:var(--text-sm)] text-[var(--ink)] focus:border-[var(--focus)] focus:outline-none"
                  style={{ minHeight: "var(--target)" }}
                />
              </div>

              <div className="grid grid-cols-1 gap-[var(--space-4)] sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="p1-parents"
                    className="block text-[length:var(--text-xs)] font-medium text-[var(--ink)]"
                  >
                    {t("partnerOneParentsLabel")}
                  </label>
                  <input
                    id="p1-parents"
                    type="text"
                    value={content.couple.partnerOneParents || ""}
                    onChange={(e) => updateCouple("partnerOneParents", e.target.value)}
                    placeholder={t("parentsPlaceholder")}
                    className="mt-1 block w-full rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface)] px-[var(--space-3)] py-[var(--space-2)] text-[length:var(--text-sm)] text-[var(--ink)] focus:border-[var(--focus)] focus:outline-none"
                    style={{ minHeight: "var(--target)" }}
                  />
                </div>

                <div>
                  <label
                    htmlFor="p2-parents"
                    className="block text-[length:var(--text-xs)] font-medium text-[var(--ink)]"
                  >
                    {t("partnerTwoParentsLabel")}
                  </label>
                  <input
                    id="p2-parents"
                    type="text"
                    value={content.couple.partnerTwoParents || ""}
                    onChange={(e) => updateCouple("partnerTwoParents", e.target.value)}
                    placeholder={t("parentsPlaceholder")}
                    className="mt-1 block w-full rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface)] px-[var(--space-3)] py-[var(--space-2)] text-[length:var(--text-sm)] text-[var(--ink)] focus:border-[var(--focus)] focus:outline-none"
                    style={{ minHeight: "var(--target)" }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Wedding Events */}
          <div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface)] p-[var(--space-5)] text-left">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-[length:var(--text-lg)] text-[var(--ink)]">
                  {t("eventsSectionTitle")}
                </h2>
                <p className="mt-1 text-[length:var(--text-xs)] text-[var(--ink-muted)]">
                  {t("eventsSectionSub")}
                </p>
              </div>

              <button
                type="button"
                onClick={addEvent}
                className="inline-flex items-center gap-[var(--space-1)] rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface)] px-[var(--space-3)] py-[var(--space-1)] text-[length:var(--text-xs)] font-medium text-[var(--ink)] hover:bg-[var(--surface-muted)] cursor-pointer"
                style={{ minHeight: "36px" }}
              >
                <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
                <span>{t("addEvent")}</span>
              </button>
            </div>

            <div className="mt-[var(--space-4)] space-y-[var(--space-4)]">
              {content.events.map((ev, idx) => (
                <div
                  key={ev.id}
                  className="rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--bg)] p-[var(--space-4)]"
                >
                  <div className="flex items-center justify-between mb-[var(--space-3)]">
                    <span className="text-[length:var(--text-xs)] font-semibold text-[var(--accent)]">
                      {t("eventNumber", { num: idx + 1 })}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeEvent(ev.id)}
                      className="text-[var(--danger)] hover:opacity-80 p-1"
                      title={t("removeEvent")}
                      aria-label={t("removeEvent")}
                    >
                      <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                    </button>
                  </div>

                  <div className="space-y-[var(--space-3)]">
                    <div className="grid grid-cols-1 gap-[var(--space-3)] sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor={`ev-title-${ev.id}`}
                          className="block text-[length:var(--text-xs)] font-medium text-[var(--ink-muted)]"
                        >
                          {t("eventTitleLabel")}
                        </label>
                        <input
                          id={`ev-title-${ev.id}`}
                          type="text"
                          value={ev.title}
                          onChange={(e) => updateEvent(ev.id, "title", e.target.value)}
                          placeholder="Poruwa Ceremony / Church Vows"
                          className="mt-1 block w-full rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--surface)] px-[var(--space-2)] py-[var(--space-1)] text-[length:var(--text-sm)] text-[var(--ink)] focus:outline-none"
                          style={{ minHeight: "36px" }}
                        />
                      </div>

                      <div>
                        <label
                          htmlFor={`ev-time-${ev.id}`}
                          className="block text-[length:var(--text-xs)] font-medium text-[var(--ink-muted)]"
                        >
                          {t("eventTimeLabel")}
                        </label>
                        <input
                          id={`ev-time-${ev.id}`}
                          type="text"
                          value={ev.startsAt || ""}
                          onChange={(e) => updateEvent(ev.id, "startsAt", e.target.value)}
                          placeholder="e.g. 09:42 AM or 6:30 PM"
                          className="mt-1 block w-full rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--surface)] px-[var(--space-2)] py-[var(--space-1)] text-[length:var(--text-sm)] text-[var(--ink)] focus:outline-none"
                          style={{ minHeight: "36px" }}
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor={`ev-venue-${ev.id}`}
                        className="block text-[length:var(--text-xs)] font-medium text-[var(--ink-muted)]"
                      >
                        {t("eventVenueLabel")}
                      </label>
                      <input
                        id={`ev-venue-${ev.id}`}
                        type="text"
                        value={ev.venue}
                        onChange={(e) => updateEvent(ev.id, "venue", e.target.value)}
                        placeholder="Grand Ballroom, Colombo"
                        className="mt-1 block w-full rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--surface)] px-[var(--space-2)] py-[var(--space-1)] text-[length:var(--text-sm)] text-[var(--ink)] focus:outline-none"
                        style={{ minHeight: "36px" }}
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-[var(--space-3)] sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor={`ev-notes-${ev.id}`}
                          className="block text-[length:var(--text-xs)] font-medium text-[var(--ink-muted)]"
                        >
                          {t("eventNotesLabel")}
                        </label>
                        <input
                          id={`ev-notes-${ev.id}`}
                          type="text"
                          value={ev.notes || ""}
                          onChange={(e) => updateEvent(ev.id, "notes", e.target.value)}
                          placeholder="Auspicious nakath time / dress code"
                          className="mt-1 block w-full rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--surface)] px-[var(--space-2)] py-[var(--space-1)] text-[length:var(--text-sm)] text-[var(--ink)] focus:outline-none"
                          style={{ minHeight: "36px" }}
                        />
                      </div>

                      <div>
                        <label
                          htmlFor={`ev-map-${ev.id}`}
                          className="block text-[length:var(--text-xs)] font-medium text-[var(--ink-muted)]"
                        >
                          {t("eventMapLabel")}
                        </label>
                        <input
                          id={`ev-map-${ev.id}`}
                          type="url"
                          value={ev.mapUrl || ""}
                          onChange={(e) => updateEvent(ev.id, "mapUrl", e.target.value)}
                          placeholder="https://maps.google.com/..."
                          className="mt-1 block w-full rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--surface)] px-[var(--space-2)] py-[var(--space-1)] text-[length:var(--text-sm)] text-[var(--ink)] focus:outline-none"
                          style={{ minHeight: "36px" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Story & Blessings */}
          <div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface)] p-[var(--space-5)] text-left">
            <h2 className="font-display text-[length:var(--text-lg)] text-[var(--ink)]">
              {t("storySectionTitle")}
            </h2>
            <p className="mt-1 text-[length:var(--text-xs)] text-[var(--ink-muted)]">
              {t("storySectionSub")}
            </p>

            <div className="mt-[var(--space-4)]">
              <label
                htmlFor="story-quote"
                className="block text-[length:var(--text-xs)] font-medium text-[var(--ink)]"
              >
                {t("quoteLabel")}
              </label>
              <textarea
                id="story-quote"
                rows={3}
                value={content.story?.quote || ""}
                onChange={(e) => updateStory("quote", e.target.value)}
                placeholder={t("quotePlaceholder")}
                className="mt-1 block w-full rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface)] px-[var(--space-3)] py-[var(--space-2)] text-[length:var(--text-sm)] text-[var(--ink)] focus:border-[var(--focus)] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Live Sticky Phone Mockup */}
        <div
          className={`lg:col-span-5 ${mobileTab === "edit" ? "hidden lg:block" : "block"}`}
        >
          <div className="sticky top-[var(--space-6)] flex flex-col items-center">
            <div className="mb-[var(--space-3)] flex items-center justify-between w-full max-w-[360px] px-2 text-[length:var(--text-xs)] text-[var(--ink-muted)]">
              <span>{t("livePreviewLabel")}</span>
              <span className="font-mono">360 × 640</span>
            </div>

            {/* Live rendered phone container */}
            <div className="w-full flex justify-center overflow-hidden">
              <TemplateRenderer
                templateId={templateSlug}
                content={{
                  ...content,
                  eventDate: eventDate || undefined,
                }}
                locale={contentLocale}
                isMockup={true}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
