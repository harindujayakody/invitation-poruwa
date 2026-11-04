"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Download,
  Phone,
  MessageSquare,
} from "lucide-react";

export interface GuestRsvpRow {
  id: string;
  name: string;
  phoneE164: string | null;
  headsInvited: number;
  side: string | null;
  groupName: string | null;
  rsvpStatus: "pending" | "accepted" | "declined" | null;
  headsAttending: number | null;
  message: string | null;
  respondedAt: Date | string | null;
}

interface RsvpTrackerViewProps {
  slug: string;
  initialRows: GuestRsvpRow[];
  locale: string;
}

export function RsvpTrackerView({
  slug,
  initialRows,
  locale,
}: RsvpTrackerViewProps) {
  const t = useTranslations("rsvpTracker");

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sideFilter, setSideFilter] = useState<string>("all");

  // De-duplicate rows by guest id (take most recent response if multiple events)
  const uniqueGuests = Object.values(
    initialRows.reduce<Record<string, GuestRsvpRow>>((acc, row) => {
      if (!acc[row.id] || (row.respondedAt && !acc[row.id].respondedAt)) {
        acc[row.id] = row;
      }
      return acc;
    }, {}),
  );

  // Metrics
  const totalInvitedHeads = uniqueGuests.reduce((acc, g) => acc + (g.headsInvited || 1), 0);
  const attendingHeads = uniqueGuests
    .filter((g) => g.rsvpStatus === "accepted")
    .reduce((acc, g) => acc + (g.headsAttending || 0), 0);
  const declinedCount = uniqueGuests.filter((g) => g.rsvpStatus === "declined").length;
  const pendingCount = uniqueGuests.filter(
    (g) => !g.rsvpStatus || g.rsvpStatus === "pending",
  ).length;

  const acceptanceRate =
    totalInvitedHeads > 0
      ? Math.round((attendingHeads / totalInvitedHeads) * 100)
      : 0;

  // Filtered rows
  const filteredGuests = uniqueGuests.filter((g) => {
    const matchesSearch =
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (g.phoneE164 && g.phoneE164.includes(searchQuery));

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "accepted" && g.rsvpStatus === "accepted") ||
      (statusFilter === "declined" && g.rsvpStatus === "declined") ||
      (statusFilter === "pending" && (!g.rsvpStatus || g.rsvpStatus === "pending"));

    const matchesSide =
      sideFilter === "all" ||
      (sideFilter === "bride" && g.side === "bride") ||
      (sideFilter === "groom" && g.side === "groom") ||
      (sideFilter === "both" && g.side === "both");

    return matchesSearch && matchesStatus && matchesSide;
  });

  // Export CSV
  function handleExportCsv() {
    const headers = [
      "Guest Name",
      "Phone",
      "Side",
      "Group",
      "Heads Invited",
      "Heads Attending",
      "Status",
      "Message / Dietary",
      "Responded At",
    ];

    const rows = uniqueGuests.map((g) => [
      `"${g.name.replace(/"/g, '""')}"`,
      g.phoneE164 || "",
      g.side || "both",
      g.groupName || "",
      g.headsInvited,
      g.headsAttending ?? 0,
      g.rsvpStatus || "pending",
      `"${(g.message || "").replace(/"/g, '""')}"`,
      g.respondedAt ? new Date(g.respondedAt).toISOString() : "",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `rsvp-report-${slug}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="space-y-[var(--space-6)] text-left">
      {/* Metrics Bar */}
      <div className="grid grid-cols-2 gap-[var(--space-3)] sm:grid-cols-4">
        <div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface)] p-[var(--space-4)]">
          <span className="text-[length:var(--text-xs)] text-[var(--ink-muted)]">
            {t("metricAttendingHeads")}
          </span>
          <p className="mt-1 font-display text-[length:var(--text-2xl)] font-semibold text-[var(--accent)]">
            {attendingHeads}
            <span className="text-[length:var(--text-xs)] font-normal text-[var(--ink-muted)] ml-1">
              / {totalInvitedHeads}
            </span>
          </p>
        </div>

        <div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface)] p-[var(--space-4)]">
          <span className="text-[length:var(--text-xs)] text-[var(--ink-muted)]">
            {t("metricDeclined")}
          </span>
          <p className="mt-1 font-display text-[length:var(--text-2xl)] font-semibold text-[var(--ink)]">
            {declinedCount}
          </p>
        </div>

        <div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface)] p-[var(--space-4)]">
          <span className="text-[length:var(--text-xs)] text-[var(--ink-muted)]">
            {t("metricPending")}
          </span>
          <p className="mt-1 font-display text-[length:var(--text-2xl)] font-semibold text-[var(--ink)]">
            {pendingCount}
          </p>
        </div>

        <div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface)] p-[var(--space-4)]">
          <span className="text-[length:var(--text-xs)] text-[var(--ink-muted)]">
            {t("metricAcceptanceRate")}
          </span>
          <p className="mt-1 font-display text-[length:var(--text-2xl)] font-semibold text-[var(--success)]">
            {acceptanceRate}%
          </p>
        </div>
      </div>

      {/* Action / Search / Filters Row */}
      <div className="flex flex-wrap items-center justify-between gap-[var(--space-3)]">
        <div className="flex flex-wrap items-center gap-[var(--space-3)] flex-1 min-w-[260px]">
          <div className="relative flex-1 min-w-[180px]">
            <Search className="absolute left-[var(--space-3)] top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--ink-muted)]" strokeWidth={1.5} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="w-full rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--bg)] pl-9 pr-[var(--space-3)] py-[var(--space-1)] text-[length:var(--text-sm)] text-[var(--ink)] focus:outline-none focus:ring-1 focus:ring-[var(--focus)]"
              style={{ minHeight: "38px" }}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--bg)] px-[var(--space-3)] py-[var(--space-1)] text-[length:var(--text-xs)] font-medium text-[var(--ink)] focus:outline-none"
            style={{ minHeight: "38px" }}
            aria-label={t("filterStatus")}
          >
            <option value="all">{t("statusAll")}</option>
            <option value="accepted">{t("statusAccepted")}</option>
            <option value="declined">{t("statusDeclined")}</option>
            <option value="pending">{t("statusPending")}</option>
          </select>

          <select
            value={sideFilter}
            onChange={(e) => setSideFilter(e.target.value)}
            className="rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--bg)] px-[var(--space-3)] py-[var(--space-1)] text-[length:var(--text-xs)] font-medium text-[var(--ink)] focus:outline-none"
            style={{ minHeight: "38px" }}
            aria-label={t("filterSide")}
          >
            <option value="all">All sides</option>
            <option value="bride">Bride side</option>
            <option value="groom">Groom side</option>
            <option value="both">Both sides</option>
          </select>
        </div>

        <button
          type="button"
          onClick={handleExportCsv}
          className="inline-flex items-center gap-[var(--space-2)] rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface)] px-[var(--space-4)] py-[var(--space-2)] text-[length:var(--text-xs)] font-medium text-[var(--ink)] hover:bg-[var(--surface-muted)] cursor-pointer focus:outline-none"
          style={{ minHeight: "38px" }}
        >
          <Download className="h-3.5 w-3.5 text-[var(--accent)]" strokeWidth={1.5} />
          <span>{t("exportCsv")}</span>
        </button>
      </div>

      {/* Guest Responses Table / Cards */}
      {filteredGuests.length === 0 ? (
        <div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface)] p-[var(--space-10)] text-center">
          <Users className="mx-auto h-8 w-8 text-[var(--ink-muted)]" strokeWidth={1.5} />
          <h3 className="mt-[var(--space-3)] font-display text-[length:var(--text-lg)] text-[var(--ink)]">
            {uniqueGuests.length === 0 ? t("noResponsesTitle") : "No matching responses"}
          </h3>
          <p className="mt-1 text-[length:var(--text-sm)] text-[var(--ink-muted)] max-w-md mx-auto">
            {uniqueGuests.length === 0 ? t("noResponsesSub") : "Try clearing your filters or search."}
          </p>
        </div>
      ) : (
        <div className="space-y-[var(--space-3)]">
          {filteredGuests.map((guest) => {
            const isAccepted = guest.rsvpStatus === "accepted";
            const isDeclined = guest.rsvpStatus === "declined";
            const isPending = !guest.rsvpStatus || guest.rsvpStatus === "pending";

            return (
              <div
                key={guest.id}
                className="flex flex-col justify-between gap-[var(--space-3)] rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface)] p-[var(--space-4)] sm:flex-row sm:items-center"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-[var(--space-2)]">
                    <h4 className="font-display text-[length:var(--text-base)] font-medium text-[var(--ink)]">
                      {guest.name}
                    </h4>
                    {guest.side && guest.side !== "both" && (
                      <span
                        className="rounded-[var(--radius-sm)] px-[var(--space-2)] py-[1px] text-[length:var(--text-xs)]"
                        style={{
                          backgroundColor: "color-mix(in oklch, var(--accent) 10%, transparent)",
                          color: "var(--accent)",
                        }}
                      >
                        {guest.side === "bride" ? "Bride side" : "Groom side"}
                      </span>
                    )}
                    {guest.groupName && (
                      <span className="text-[length:var(--text-xs)] text-[var(--ink-muted)]">
                        • {guest.groupName}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-[var(--space-3)] text-[length:var(--text-xs)] text-[var(--ink-muted)]">
                    {guest.phoneE164 && (
                      <span className="inline-flex items-center gap-1 font-mono">
                        <Phone className="h-3 w-3" strokeWidth={1.5} />
                        {guest.phoneE164}
                      </span>
                    )}

                    <span>
                      Invited: {guest.headsInvited} {guest.headsInvited === 1 ? "seat" : "seats"}
                    </span>

                    {guest.respondedAt && (
                      <span>
                        Responded: {new Date(guest.respondedAt).toLocaleDateString(locale)}
                      </span>
                    )}
                  </div>

                  {guest.message && (
                    <p className="mt-1 text-[length:var(--text-xs)] italic text-[var(--ink)] flex items-start gap-1">
                      <MessageSquare className="h-3 w-3 mt-0.5 text-[var(--accent)] flex-shrink-0" strokeWidth={1.5} />
                      <span>&ldquo;{guest.message}&rdquo;</span>
                    </p>
                  )}
                </div>

                {/* Status Indicator */}
                <div className="flex items-center gap-[var(--space-2)]">
                  {isAccepted && (
                    <span
                      className="inline-flex items-center gap-1.5 rounded-[var(--radius-md)] px-[var(--space-3)] py-[var(--space-1)] text-[length:var(--text-xs)] font-medium"
                      style={{
                        backgroundColor: "color-mix(in oklch, var(--success) 12%, transparent)",
                        color: "var(--success)",
                        border: "1px solid var(--success)",
                      }}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                      <span>Attending ({guest.headsAttending} seats)</span>
                    </span>
                  )}

                  {isDeclined && (
                    <span
                      className="inline-flex items-center gap-1.5 rounded-[var(--radius-md)] px-[var(--space-3)] py-[var(--space-1)] text-[length:var(--text-xs)] font-medium"
                      style={{
                        backgroundColor: "var(--surface-muted)",
                        color: "var(--ink-muted)",
                        border: "1px solid var(--line)",
                      }}
                    >
                      <XCircle className="h-3.5 w-3.5" strokeWidth={1.5} />
                      <span>Declined</span>
                    </span>
                  )}

                  {isPending && (
                    <span
                      className="inline-flex items-center gap-1.5 rounded-[var(--radius-md)] px-[var(--space-3)] py-[var(--space-1)] text-[length:var(--text-xs)] font-medium"
                      style={{
                        backgroundColor: "var(--surface-muted)",
                        color: "var(--ink-muted)",
                        border: "1px solid var(--line)",
                      }}
                    >
                      <Clock className="h-3.5 w-3.5" strokeWidth={1.5} />
                      <span>Awaiting response</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
