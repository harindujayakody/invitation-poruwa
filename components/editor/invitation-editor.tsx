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
  ExternalLink,
  Copy,
  Check,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
  const [copied, setCopied] = useState(false);

  // Mobile viewport toggle between form editor and phone preview
  const [mobileTab, setMobileTab] = useState<"edit" | "preview">("edit");

  function copyLink() {
    navigator.clipboard.writeText(`https://suba.lk/i/${slug}`);
    setCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  }

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
      {/* Top action bar with ShadCN Card styling */}
      <Card className="mb-8 p-5 sm:p-6 rounded-3xl border border-stone-200 bg-white shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">
            {t("invitationUrl")}
          </span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-bold text-stone-900 bg-stone-100 px-3 py-1 rounded-lg border border-stone-200">
              suba.lk/i/{slug}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={copyLink}
              className="gap-1.5 h-8 px-2.5 text-xs text-stone-600"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? "Copied" : "Copy"}</span>
            </Button>
            <a
              href={`/i/${slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex"
            >
              <Button variant="ghost" size="sm" className="gap-1 h-8 px-2.5 text-xs text-stone-600">
                <ExternalLink className="h-3.5 w-3.5" />
                <span>Open site</span>
              </Button>
            </a>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Mobile switcher: Edit / Preview */}
          <div className="inline-flex rounded-xl border border-stone-200 bg-stone-100 p-1 lg:hidden">
            <button
              type="button"
              onClick={() => setMobileTab("edit")}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                mobileTab === "edit" ? "bg-white text-stone-900 shadow-xs" : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <Edit3 className="h-3.5 w-3.5" />
              <span>{t("editTab")}</span>
            </button>
            <button
              type="button"
              onClick={() => setMobileTab("preview")}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                mobileTab === "preview" ? "bg-white text-stone-900 shadow-xs" : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <Eye className="h-3.5 w-3.5" />
              <span>{t("previewTab")}</span>
            </button>
          </div>

          <Button
            type="button"
            disabled={saving}
            onClick={handleSave}
            size="default"
            className="gap-2 px-6 shadow-md hover:shadow-lg"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>{t("saving")}</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>{t("saveButton")}</span>
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Editor Split View: Form on Left, Live Phone on Right */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* LEFT COLUMN: Form Controls */}
        <div
          className={`space-y-6 lg:col-span-7 ${mobileTab === "preview" ? "hidden lg:block" : "block"}`}
        >
          {/* Section 1: Template Style & Language */}
          <Card className="rounded-3xl border border-stone-200 bg-white shadow-xs">
            <CardHeader>
              <CardTitle>{t("styleSectionTitle")}</CardTitle>
              <CardDescription>{t("styleSectionSub")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="template-select" className="text-xs font-semibold text-stone-700">
                    {t("chooseTemplate")}
                  </Label>
                  <select
                    id="template-select"
                    value={templateSlug}
                    onChange={(e) => setTemplateSlug(e.target.value)}
                    className="h-11 w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2 text-sm text-stone-900 shadow-xs outline-none focus:border-rose-500 focus:ring-3 focus:ring-rose-500/20"
                  >
                    {CULTURAL_TEMPLATES.map((tpl) => (
                      <option key={tpl.id} value={tpl.id}>
                        {tpl.name[locale as keyof typeof tpl.name] || tpl.name.en}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language-select" className="text-xs font-semibold text-stone-700">
                    {t("invitationLanguage")}
                  </Label>
                  <select
                    id="language-select"
                    value={contentLocale}
                    onChange={(e) => setContentLocale(e.target.value as "si" | "ta" | "en")}
                    className="h-11 w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2 text-sm text-stone-900 shadow-xs outline-none focus:border-rose-500 focus:ring-3 focus:ring-rose-500/20"
                  >
                    <option value="si">සිංහල (Sinhala)</option>
                    <option value="ta">தமிழ் (Tamil)</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Couple & Date */}
          <Card className="rounded-3xl border border-stone-200 bg-white shadow-xs">
            <CardHeader>
              <CardTitle>{t("coupleSectionTitle")}</CardTitle>
              <CardDescription>{t("coupleSectionSub")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="partner-one" className="text-xs font-semibold text-stone-700">
                    {t("partnerOneLabel")}
                  </Label>
                  <Input
                    id="partner-one"
                    type="text"
                    value={content.couple.partnerOne}
                    onChange={(e) => updateCouple("partnerOne", e.target.value)}
                    placeholder="Kasun"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="partner-two" className="text-xs font-semibold text-stone-700">
                    {t("partnerTwoLabel")}
                  </Label>
                  <Input
                    id="partner-two"
                    type="text"
                    value={content.couple.partnerTwo}
                    onChange={(e) => updateCouple("partnerTwo", e.target.value)}
                    placeholder="Sanduni"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="event-date" className="text-xs font-semibold text-stone-700">
                  {t("weddingDateLabel")}
                </Label>
                <Input
                  id="event-date"
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="p1-parents" className="text-xs font-semibold text-stone-700">
                    {t("partnerOneParentsLabel")}
                  </Label>
                  <Input
                    id="p1-parents"
                    type="text"
                    value={content.couple.partnerOneParents || ""}
                    onChange={(e) => updateCouple("partnerOneParents", e.target.value)}
                    placeholder={t("parentsPlaceholder")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="p2-parents" className="text-xs font-semibold text-stone-700">
                    {t("partnerTwoParentsLabel")}
                  </Label>
                  <Input
                    id="p2-parents"
                    type="text"
                    value={content.couple.partnerTwoParents || ""}
                    onChange={(e) => updateCouple("partnerTwoParents", e.target.value)}
                    placeholder={t("parentsPlaceholder")}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 3: Wedding Events */}
          <Card className="rounded-3xl border border-stone-200 bg-white shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>{t("eventsSectionTitle")}</CardTitle>
                <CardDescription className="mt-1">{t("eventsSectionSub")}</CardDescription>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addEvent}
                className="gap-1.5 border-stone-300"
              >
                <Plus className="h-4 w-4" />
                <span>{t("addEvent")}</span>
              </Button>
            </CardHeader>

            <CardContent className="space-y-4">
              {content.events.map((ev, idx) => (
                <div
                  key={ev.id}
                  className="rounded-2xl border border-stone-200 bg-stone-50/80 p-5 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <Badge variant="rose" className="px-2.5 py-0.5 text-xs font-bold">
                      {t("eventNumber", { num: idx + 1 })}
                    </Badge>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => removeEvent(ev.id)}
                      className="text-stone-400 hover:text-red-600 hover:bg-red-50"
                      title={t("removeEvent")}
                      aria-label={t("removeEvent")}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor={`ev-title-${ev.id}`} className="text-xs font-medium text-stone-600">
                        {t("eventTitleLabel")}
                      </Label>
                      <Input
                        id={`ev-title-${ev.id}`}
                        type="text"
                        value={ev.title}
                        onChange={(e) => updateEvent(ev.id, "title", e.target.value)}
                        placeholder="Poruwa Ceremony / Church Vows"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor={`ev-time-${ev.id}`} className="text-xs font-medium text-stone-600">
                        {t("eventTimeLabel")}
                      </Label>
                      <Input
                        id={`ev-time-${ev.id}`}
                        type="text"
                        value={ev.startsAt || ""}
                        onChange={(e) => updateEvent(ev.id, "startsAt", e.target.value)}
                        placeholder="e.g. 09:42 AM or 6:30 PM"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor={`ev-venue-${ev.id}`} className="text-xs font-medium text-stone-600">
                      {t("eventVenueLabel")}
                    </Label>
                    <Input
                      id={`ev-venue-${ev.id}`}
                      type="text"
                      value={ev.venue}
                      onChange={(e) => updateEvent(ev.id, "venue", e.target.value)}
                      placeholder="Grand Ballroom, The Kingsbury Colombo"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor={`ev-notes-${ev.id}`} className="text-xs font-medium text-stone-600">
                        {t("eventNotesLabel")}
                      </Label>
                      <Input
                        id={`ev-notes-${ev.id}`}
                        type="text"
                        value={ev.notes || ""}
                        onChange={(e) => updateEvent(ev.id, "notes", e.target.value)}
                        placeholder="Auspicious nakath time / dress code"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor={`ev-map-${ev.id}`} className="text-xs font-medium text-stone-600">
                        {t("eventMapLabel")}
                      </Label>
                      <Input
                        id={`ev-map-${ev.id}`}
                        type="url"
                        value={ev.mapUrl || ""}
                        onChange={(e) => updateEvent(ev.id, "mapUrl", e.target.value)}
                        placeholder="https://maps.google.com/..."
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Section 4: Story & Blessings */}
          <Card className="rounded-3xl border border-stone-200 bg-white shadow-xs">
            <CardHeader>
              <CardTitle>{t("storySectionTitle")}</CardTitle>
              <CardDescription>{t("storySectionSub")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="story-quote" className="text-xs font-semibold text-stone-700">
                  {t("quoteLabel")}
                </Label>
                <textarea
                  id="story-quote"
                  rows={3}
                  value={content.story?.quote || ""}
                  onChange={(e) => updateStory("quote", e.target.value)}
                  placeholder={t("quotePlaceholder")}
                  className="w-full rounded-xl border border-stone-300 bg-white p-3.5 text-sm text-stone-900 shadow-xs outline-none focus:border-rose-500 focus:ring-3 focus:ring-rose-500/20"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: Live Sticky Phone Mockup */}
        <div
          className={`lg:col-span-5 ${mobileTab === "edit" ? "hidden lg:block" : "block"}`}
        >
          <div className="sticky top-24 flex flex-col items-center">
            <div className="mb-3 flex items-center justify-between w-full max-w-[360px] px-2 text-xs font-medium text-stone-500">
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-rose-600" />
                <span>{t("livePreviewLabel")}</span>
              </span>
              <span className="font-mono bg-stone-100 px-2 py-0.5 rounded text-[11px]">360 × 640</span>
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
