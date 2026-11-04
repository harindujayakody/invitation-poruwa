"use client";

import { useTranslations } from "next-intl";
import { Calendar, Download } from "lucide-react";

interface CalendarLinksProps {
  title: string;
  eventDate?: Date | string | null;
  venue?: string | null;
  notes?: string | null;
  locale?: string;
}

export function CalendarLinks({
  title,
  eventDate,
  venue,
  notes,
}: CalendarLinksProps) {
  const t = useTranslations("guestInvite");

  if (!eventDate) return null;

  const dateObj = new Date(eventDate);
  if (isNaN(dateObj.getTime())) return null;

  // Google Calendar URL
  const startTime = dateObj.toISOString().replace(/-|:|\.\d\d\d/g, "");
  // Default duration 4 hours
  const endDateObj = new Date(dateObj.getTime() + 4 * 60 * 60 * 1000);
  const endTime = endDateObj.toISOString().replace(/-|:|\.\d\d\d/g, "");

  const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    title,
  )}&dates=${startTime}/${endTime}&location=${encodeURIComponent(
    venue || "",
  )}&details=${encodeURIComponent(notes || "")}`;

  // Download ICS
  function downloadIcs() {
    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//suba.lk//Wedding Invitation//EN",
      "BEGIN:VEVENT",
      `SUMMARY:${title}`,
      `DTSTART:${startTime}`,
      `DTEND:${endTime}`,
      `LOCATION:${venue || ""}`,
      `DESCRIPTION:${notes || ""}`,
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.toLowerCase().replace(/[^a-z0-9]/g, "-")}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-[var(--space-2)] my-[var(--space-4)]">
      <a
        href={googleUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-[var(--space-2)] rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface)] px-[var(--space-3)] py-[var(--space-2)] text-[length:var(--text-xs)] font-medium text-[var(--ink)] hover:bg-[var(--surface-muted)] focus:outline-none"
        style={{ minHeight: "38px" }}
      >
        <Calendar className="h-3.5 w-3.5 text-[var(--accent)]" strokeWidth={1.5} />
        <span>{t("googleCalendar")}</span>
      </a>

      <button
        type="button"
        onClick={downloadIcs}
        className="inline-flex items-center gap-[var(--space-2)] rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface)] px-[var(--space-3)] py-[var(--space-2)] text-[length:var(--text-xs)] font-medium text-[var(--ink)] hover:bg-[var(--surface-muted)] focus:outline-none cursor-pointer"
        style={{ minHeight: "38px" }}
      >
        <Download className="h-3.5 w-3.5 text-[var(--ink-muted)]" strokeWidth={1.5} />
        <span>{t("appleCalendar")}</span>
      </button>
    </div>
  );
}
