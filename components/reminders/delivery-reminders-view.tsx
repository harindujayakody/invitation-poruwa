"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { normalizeLkPhone, buildWhatsAppLink } from "@/lib/phone";
import { recordReminderSentAction } from "@/app/actions/reminders";
import { toast } from "sonner";
import {
  Bell,
  Eye,
  Clock,
  Send,
  CheckCircle2,
  Phone,
  Search,
} from "lucide-react";

export interface ReminderGuestItem {
  id: string;
  name: string;
  phoneE164: string | null;
  headsInvited: number;
  side: string | null;
  token: string;
  rsvpStatus: "pending" | "accepted" | "declined";
  sentAt: Date | string | null;
  firstOpenedAt: Date | string | null;
  reminderSentAt: Date | string | null;
  reminderCount: number;
}

interface DeliveryRemindersViewProps {
  slug: string;
  coupleNames: string;
  initialGuests: ReminderGuestItem[];
  origin: string;
  locale: string;
}

export function DeliveryRemindersView({
  slug,
  coupleNames,
  initialGuests,
  origin,
  locale,
}: DeliveryRemindersViewProps) {
  const t = useTranslations("reminders");

  const [guests, setGuests] = useState<ReminderGuestItem[]>(initialGuests);
  const [activeFilter, setActiveFilter] = useState<
    "all_pending" | "opened_unanswered" | "unopened" | "reminded"
  >("all_pending");
  const [searchQuery, setSearchQuery] = useState("");

  // Default reminder template based on locale
  const defaultTemplate = useMemo(() => {
    if (locale === "si") {
      return `ආයුබෝවන් {name}, {couple} ගේ විවාහ මංගල උත්සවය සඳහා අප එවූ ආරාධනාව ඔබට ලැබෙන්නට ඇතැයි සිතමු. හෝටලයේ ආසන සහ ආහාර සැකසුම් කටයුතු සඳහා කරුණාකර ඔබගේ පැමිණීම මෙහි සටහන් කරන්න: {link} ස්තූතියි!`;
    }
    if (locale === "ta") {
      return `வணக்கம் {name}, {couple} திருமணத்திற்கான அழைப்பிதழ் உங்களுக்கு கிடைத்திருக்கும் என நம்புகிறோம். விருந்து இருக்கை ஏற்பாடுகளுக்காக தயவுசெய்து உங்கள் வருகையை உறுதிப்படுத்தவும்: {link} நன்றி!`;
    }
    return `Dear {name}, we hope you received the invitation for {couple}'s wedding! To help us finalize banquet seating and catering, please kindly confirm your attendance here: {link} We look forward to celebrating with you!`;
  }, [locale]);

  const [customTemplate, setCustomTemplate] = useState(defaultTemplate);

  // Metrics
  const totalGuests = guests.length;
  const sentCount = guests.filter((g) => g.sentAt !== null).length;
  const openedCount = guests.filter((g) => g.firstOpenedAt !== null).length;
  const pendingCount = guests.filter((g) => g.rsvpStatus === "pending").length;

  const openedUnansweredCount = guests.filter(
    (g) => g.firstOpenedAt !== null && g.rsvpStatus === "pending",
  ).length;

  const unopenedPendingCount = guests.filter(
    (g) => g.firstOpenedAt === null && g.rsvpStatus === "pending",
  ).length;

  const remindedCount = guests.filter((g) => g.reminderCount > 0).length;

  // Filtered List
  const filteredGuests = useMemo(() => {
    let result = guests;

    // Filter tab
    if (activeFilter === "all_pending") {
      result = result.filter((g) => g.rsvpStatus === "pending");
    } else if (activeFilter === "opened_unanswered") {
      result = result.filter((g) => g.firstOpenedAt !== null && g.rsvpStatus === "pending");
    } else if (activeFilter === "unopened") {
      result = result.filter((g) => g.firstOpenedAt === null && g.rsvpStatus === "pending");
    } else if (activeFilter === "reminded") {
      result = result.filter((g) => g.reminderCount > 0);
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (g) =>
          g.name.toLowerCase().includes(q) ||
          (g.phoneE164 && g.phoneE164.includes(q)),
      );
    }

    return result;
  }, [guests, activeFilter, searchQuery]);

  // Build personalized WhatsApp reminder URL
  function buildReminderLink(guest: ReminderGuestItem): string | null {
    if (!guest.phoneE164) return null;
    const norm = normalizeLkPhone(guest.phoneE164);
    if (!norm) return null;

    const personalUrl = `${origin}/i/${slug}?g=${guest.token}`;
    const text = customTemplate
      .replace(/\{name\}/g, guest.name)
      .replace(/\{couple\}/g, coupleNames)
      .replace(/\{link\}/g, personalUrl);

    return buildWhatsAppLink(norm, text);
  }

  // Handle WhatsApp Reminder Click
  async function handleSendReminder(guest: ReminderGuestItem) {
    const waUrl = buildReminderLink(guest);
    if (!waUrl) {
      toast.error("Valid phone number required for WhatsApp reminder");
      return;
    }

    // Open WhatsApp
    window.open(waUrl, "_blank", "noopener,noreferrer");

    // Optimistically update & record server-side
    const now = new Date();
    setGuests((prev) =>
      prev.map((g) =>
        g.id === guest.id
          ? {
              ...g,
              reminderCount: g.reminderCount + 1,
              reminderSentAt: now,
            }
          : g,
      ),
    );

    try {
      const res = await recordReminderSentAction(guest.id);
      if (res.success) {
        toast.success(t("reminderSentSuccess"));
      }
    } catch {
      // Still opened WhatsApp
    }
  }

  function formatShortDate(val: Date | string | null): string {
    if (!val) return "—";
    const d = new Date(val);
    return d.toLocaleDateString(locale === "si" ? "si-LK" : "en-GB", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className="w-full space-y-[var(--space-6)] text-left">
      {/* Metrics Bar */}
      <div className="grid grid-cols-2 gap-[var(--space-3)] sm:grid-cols-4">
        <div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface)] p-[var(--space-4)]">
          <span className="text-[length:var(--text-xs)] text-[var(--ink-muted)]">
            {t("metricTotalGuests")}
          </span>
          <p className="mt-1 font-display text-[length:var(--text-2xl)] font-semibold text-[var(--ink)]">
            {totalGuests}
          </p>
        </div>

        <div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface)] p-[var(--space-4)]">
          <span className="text-[length:var(--text-xs)] text-[var(--ink-muted)]">
            {t("metricSent")}
          </span>
          <p className="mt-1 font-display text-[length:var(--text-2xl)] font-semibold text-[var(--ink)]">
            {sentCount}
            <span className="text-[length:var(--text-xs)] font-normal text-[var(--ink-muted)] ml-1">
              / {totalGuests}
            </span>
          </p>
        </div>

        <div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface)] p-[var(--space-4)]">
          <span className="text-[length:var(--text-xs)] text-[var(--ink-muted)]">
            {t("metricOpened")}
          </span>
          <p className="mt-1 font-display text-[length:var(--text-2xl)] font-semibold text-[var(--accent)]">
            {openedCount}
            <span className="text-[length:var(--text-xs)] font-normal text-[var(--ink-muted)] ml-1">
              ({totalGuests > 0 ? Math.round((openedCount / totalGuests) * 100) : 0}%)
            </span>
          </p>
        </div>

        <div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface)] p-[var(--space-4)]">
          <span className="text-[length:var(--text-xs)] text-[var(--ink-muted)]">
            {t("metricPending")}
          </span>
          <p className="mt-1 font-display text-[length:var(--text-2xl)] font-semibold text-amber-700">
            {pendingCount}
          </p>
        </div>
      </div>

      {/* Reminder Message Template Preview */}
      <div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface)] p-[var(--space-4)] space-y-[var(--space-2)]">
        <div className="flex items-center justify-between">
          <label
            htmlFor="reminder-template"
            className="text-[length:var(--text-xs)] font-medium text-[var(--ink)]"
          >
            {t("templateLabel")}
          </label>
          <span className="text-[11px] text-[var(--ink-muted)]">
            Placeholders: &#123;name&#125;, &#123;couple&#125;, &#123;link&#125;
          </span>
        </div>
        <textarea
          id="reminder-template"
          rows={2}
          value={customTemplate}
          onChange={(e) => setCustomTemplate(e.target.value)}
          className="w-full rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--bg)] p-[var(--space-2)] text-[length:var(--text-xs)] text-[var(--ink)] leading-relaxed focus:outline-none focus:border-[var(--accent)]"
        />
      </div>

      {/* Controls & Filter Bar */}
      <div className="space-y-[var(--space-3)]">
        <div className="flex flex-wrap items-center justify-between gap-[var(--space-3)] border-b border-[var(--line)] pb-[var(--space-3)]">
          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1">
            <button
              type="button"
              onClick={() => setActiveFilter("all_pending")}
              className={`rounded-[var(--radius-md)] px-[var(--space-3)] py-1.5 text-[length:var(--text-xs)] font-medium transition-colors cursor-pointer ${
                activeFilter === "all_pending"
                  ? "bg-[var(--ink)] text-[var(--surface)]"
                  : "border border-[var(--line)] bg-[var(--surface)] text-[var(--ink-muted)] hover:text-[var(--ink)]"
              }`}
            >
              {t("filterAllPending", { count: pendingCount })}
            </button>

            <button
              type="button"
              onClick={() => setActiveFilter("opened_unanswered")}
              className={`rounded-[var(--radius-md)] px-[var(--space-3)] py-1.5 text-[length:var(--text-xs)] font-medium transition-colors cursor-pointer ${
                activeFilter === "opened_unanswered"
                  ? "bg-[var(--accent)] text-[var(--accent-ink)]"
                  : "border border-[var(--line)] bg-[var(--surface)] text-[var(--ink-muted)] hover:text-[var(--ink)]"
              }`}
            >
              {t("filterOpenedNotReplied", { count: openedUnansweredCount })}
            </button>

            <button
              type="button"
              onClick={() => setActiveFilter("unopened")}
              className={`rounded-[var(--radius-md)] px-[var(--space-3)] py-1.5 text-[length:var(--text-xs)] font-medium transition-colors cursor-pointer ${
                activeFilter === "unopened"
                  ? "bg-amber-800 text-white"
                  : "border border-[var(--line)] bg-[var(--surface)] text-[var(--ink-muted)] hover:text-[var(--ink)]"
              }`}
            >
              {t("filterUnopened", { count: unopenedPendingCount })}
            </button>

            <button
              type="button"
              onClick={() => setActiveFilter("reminded")}
              className={`rounded-[var(--radius-md)] px-[var(--space-3)] py-1.5 text-[length:var(--text-xs)] font-medium transition-colors cursor-pointer ${
                activeFilter === "reminded"
                  ? "bg-[var(--surface-muted)] text-[var(--ink)] font-semibold border border-[var(--line)]"
                  : "border border-[var(--line)] bg-[var(--surface)] text-[var(--ink-muted)] hover:text-[var(--ink)]"
              }`}
            >
              {t("filterReminded", { count: remindedCount })}
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--ink-muted)]"
              strokeWidth={1.5}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search pending guests…"
              aria-label="Search pending guests"
              className="w-full rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface)] pl-9 pr-3 py-1.5 text-[length:var(--text-xs)] text-[var(--ink)] focus:outline-none focus:border-[var(--accent)]"
              style={{ minHeight: "36px" }}
            />
          </div>
        </div>

        {/* Guest Reminder List */}
        {filteredGuests.length === 0 ? (
          <div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface)] p-[var(--space-12)] text-center space-y-[var(--space-2)]">
            <CheckCircle2 className="mx-auto h-8 w-8 text-[var(--success)]" strokeWidth={1.5} />
            <h3 className="font-display text-[length:var(--text-lg)] text-[var(--ink)]">
              {pendingCount === 0 ? t("emptyPendingTitle") : t("emptyFilterTitle")}
            </h3>
            {pendingCount === 0 && (
              <p className="text-[length:var(--text-xs)] text-[var(--ink-muted)]">
                {t("emptyPendingSub")}
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-[var(--space-3)]">
            {filteredGuests.map((guest) => {
              const hasOpened = guest.firstOpenedAt !== null;
              const hasPhone = Boolean(guest.phoneE164);

              return (
                <div
                  key={guest.id}
                  data-testid="reminder-guest-card"
                  className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface)] p-[var(--space-4)] flex flex-col sm:flex-row sm:items-center justify-between gap-[var(--space-3)]"
                >
                  {/* Left: Guest Details */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-display text-[length:var(--text-base)] font-semibold text-[var(--ink)]">
                        {guest.name}
                      </h4>
                      <span className="rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--surface-muted)] px-1.5 py-0.5 text-[11px] text-[var(--ink-muted)]">
                        {guest.headsInvited} {guest.headsInvited === 1 ? "seat" : "seats"}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-[var(--space-3)] text-[length:var(--text-xs)] text-[var(--ink-muted)]">
                      {guest.phoneE164 ? (
                        <span className="inline-flex items-center gap-1 font-mono">
                          <Phone className="h-3 w-3" strokeWidth={1.5} />
                          {guest.phoneE164}
                        </span>
                      ) : (
                        <span className="italic">No phone number</span>
                      )}

                      {/* Timeline Badges */}
                      {hasOpened ? (
                        <span className="inline-flex items-center gap-1 text-[var(--accent)] font-medium">
                          <Eye className="h-3 w-3" strokeWidth={1.5} />
                          {t("openedAt", { time: formatShortDate(guest.firstOpenedAt) })}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[var(--ink-muted)]">
                          <Clock className="h-3 w-3" strokeWidth={1.5} />
                          {t("statusUnopened")}
                        </span>
                      )}

                      {guest.reminderCount > 0 && (
                        <span className="inline-flex items-center gap-1 rounded-[var(--radius-sm)] bg-amber-50 border border-amber-200 px-1.5 py-0.2 text-amber-800 font-medium">
                          <Bell className="h-3 w-3" strokeWidth={1.5} />
                          {t("remindedTimes", { count: guest.reminderCount })}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right: Reminder Action Button */}
                  <div>
                    {hasPhone ? (
                      <button
                        type="button"
                        onClick={() => handleSendReminder(guest)}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] px-[var(--space-4)] py-[var(--space-2)] text-[length:var(--text-xs)] font-medium text-[var(--accent-ink)] transition-colors hover:bg-[color-mix(in_oklch,var(--accent),black_12%)] focus:outline-none cursor-pointer"
                        style={{
                          backgroundColor: "var(--accent)",
                          minHeight: "38px",
                        }}
                      >
                        <Send className="h-3.5 w-3.5" strokeWidth={1.5} />
                        <span>{t("sendReminderButton")}</span>
                      </button>
                    ) : (
                      <span className="text-[length:var(--text-xs)] text-[var(--ink-muted)] italic">
                        Phone needed to send
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
