"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { submitRsvpAction } from "@/app/actions/rsvp";
import { toast } from "sonner";
import {
  CheckCircle2,
  XCircle,
  MapPin,
  Loader2,
} from "lucide-react";

export interface EventItemData {
  id: string;
  title: string;
  venue?: string | null;
  mapUrl?: string | null;
  notes?: string | null;
  startsAt?: Date | string | null;
}

export interface ExistingRsvpData {
  eventId: string;
  status: "pending" | "accepted" | "declined";
  headsAttending: number | null;
  message: string | null;
}

interface RsvpFormProps {
  invitationSlug: string;
  guestToken: string | null;
  guestName?: string | null;
  headsInvited: number;
  events: EventItemData[];
  initialRsvps: ExistingRsvpData[];
  locale?: string;
}

export function RsvpForm({
  invitationSlug,
  guestToken,
  headsInvited,
  events,
  initialRsvps,
}: RsvpFormProps) {
  const t = useTranslations("guestInvite");

  // State map per event
  const [eventResponses, setEventResponses] = useState<
    Record<
      string,
      {
        status: "accepted" | "declined" | "pending";
        heads: number;
        message: string;
      }
    >
  >(() => {
    const initialMap: Record<
      string,
      { status: "accepted" | "declined" | "pending"; heads: number; message: string }
    > = {};

    for (const ev of events) {
      const existing = initialRsvps.find((r) => r.eventId === ev.id);
      if (existing && existing.status !== "pending") {
        initialMap[ev.id] = {
          status: existing.status,
          heads: existing.headsAttending ?? headsInvited,
          message: existing.message || "",
        };
      } else {
        initialMap[ev.id] = {
          status: "accepted",
          heads: headsInvited,
          message: "",
        };
      }
    }

    return initialMap;
  });

  const [hasSubmitted, setHasSubmitted] = useState<boolean>(
    initialRsvps.some((r) => r.status === "accepted" || r.status === "declined"),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  function handleStatusChange(eventId: string, status: "accepted" | "declined") {
    setEventResponses((prev) => ({
      ...prev,
      [eventId]: {
        ...prev[eventId],
        status,
        heads: status === "accepted" ? (prev[eventId]?.heads || headsInvited) : 0,
      },
    }));
  }

  function handleHeadsChange(eventId: string, heads: number) {
    const clamped = Math.max(1, Math.min(heads, headsInvited));
    setEventResponses((prev) => ({
      ...prev,
      [eventId]: {
        ...prev[eventId],
        heads: clamped,
      },
    }));
  }

  function handleMessageChange(eventId: string, message: string) {
    setEventResponses((prev) => ({
      ...prev,
      [eventId]: {
        ...prev[eventId],
        message,
      },
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!guestToken) {
      toast.error("No valid guest token provided.");
      return;
    }

    setIsSubmitting(true);
    setSubmissionSuccess(false);

    try {
      const payload = events.map((ev) => {
        const resp = eventResponses[ev.id];
        return {
          eventId: ev.id,
          status: resp?.status === "declined" ? ("declined" as const) : ("accepted" as const),
          headsAttending: resp?.status === "declined" ? 0 : (resp?.heads || headsInvited),
          message: resp?.message?.trim() || undefined,
        };
      });

      const res = await submitRsvpAction({
        token: guestToken,
        slug: invitationSlug,
        responses: payload,
      });

      if (res.error) {
        toast.error(res.error);
        return;
      }

      if (res.success) {
        setHasSubmitted(true);
        setSubmissionSuccess(true);
        toast.success(t("successMessage"));
      }
    } catch {
      toast.error("Failed to submit RSVP. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (events.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="rsvp-heading"
      className="w-full max-w-xl mx-auto my-[var(--space-10)] px-[var(--space-4)] text-left"
    >
      <div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface)] p-[var(--space-6)] sm:p-[var(--space-8)] shadow-sm">
        <div className="text-left mb-[var(--space-6)]">
          <span
            className="text-[length:var(--text-xs)] font-medium uppercase tracking-wider"
            style={{ color: "var(--accent)" }}
          >
            RSVP
          </span>
          <h2
            id="rsvp-heading"
            className="font-display text-[length:var(--text-2xl)] font-normal text-[var(--ink)] mt-1"
          >
            {t("rsvpSectionTitle")}
          </h2>
          <p className="mt-1 text-[length:var(--text-sm)] text-[var(--ink-muted)]">
            {t("rsvpSubtitle")}
          </p>
        </div>

        {/* Public view notice if no guest token */}
        {!guestToken ? (
          <div
            className="rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-muted)] p-[var(--space-4)] text-[length:var(--text-sm)] text-[var(--ink-muted)]"
          >
            <p>{t("publicNotice")}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-[var(--space-6)]">
            {/* Event RSVP cards */}
            <div className="space-y-[var(--space-4)]">
              {events.map((ev) => {
                const currentResp = eventResponses[ev.id] || {
                  status: "accepted",
                  heads: headsInvited,
                  message: "",
                };
                const isAccepted = currentResp.status === "accepted";
                const isDeclined = currentResp.status === "declined";

                return (
                  <div
                    key={ev.id}
                    className="rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--bg)] p-[var(--space-4)] space-y-[var(--space-4)]"
                  >
                    <div>
                      <h3 className="font-display text-[length:var(--text-base)] font-medium text-[var(--ink)]">
                        {ev.title}
                      </h3>
                      {ev.venue && (
                        <p className="text-[length:var(--text-xs)] text-[var(--ink-muted)] mt-1 flex items-center gap-1">
                          <MapPin className="h-3 w-3" strokeWidth={1.5} />
                          <span>{ev.venue}</span>
                        </p>
                      )}
                      {ev.notes && (
                        <p className="text-[length:var(--text-xs)] text-[var(--ink-muted)] mt-1">
                          {ev.notes}
                        </p>
                      )}
                    </div>

                    {/* Radio Choice: Accept or Decline */}
                    <div className="grid grid-cols-2 gap-[var(--space-2)]">
                      <button
                        type="button"
                        onClick={() => handleStatusChange(ev.id, "accepted")}
                        className="flex items-center justify-center gap-[var(--space-2)] rounded-[var(--radius-md)] border px-[var(--space-3)] py-[var(--space-2)] text-[length:var(--text-xs)] font-medium transition-colors cursor-pointer"
                        style={{
                          minHeight: "var(--target)",
                          borderColor: isAccepted ? "var(--accent)" : "var(--line)",
                          backgroundColor: isAccepted
                            ? "color-mix(in oklch, var(--accent) 10%, var(--surface))"
                            : "var(--surface)",
                          color: isAccepted ? "var(--accent)" : "var(--ink)",
                        }}
                      >
                        <CheckCircle2 className="h-4 w-4" strokeWidth={1.5} />
                        <span>{t("acceptOption")}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleStatusChange(ev.id, "declined")}
                        className="flex items-center justify-center gap-[var(--space-2)] rounded-[var(--radius-md)] border px-[var(--space-3)] py-[var(--space-2)] text-[length:var(--text-xs)] font-medium transition-colors cursor-pointer"
                        style={{
                          minHeight: "var(--target)",
                          borderColor: isDeclined ? "var(--ink-muted)" : "var(--line)",
                          backgroundColor: isDeclined
                            ? "var(--surface-muted)"
                            : "var(--surface)",
                          color: isDeclined ? "var(--ink)" : "var(--ink-muted)",
                        }}
                      >
                        <XCircle className="h-4 w-4" strokeWidth={1.5} />
                        <span>{t("declineOption")}</span>
                      </button>
                    </div>

                    {/* If accepted, show heads attending input */}
                    {isAccepted && headsInvited > 1 && (
                      <div className="pt-2 border-t border-[var(--line)]">
                        <label
                          htmlFor={`heads-${ev.id}`}
                          className="block text-[length:var(--text-xs)] font-medium text-[var(--ink)]"
                        >
                          {t("headsAttendingLabel")}
                        </label>
                        <div className="mt-1 flex items-center gap-[var(--space-2)]">
                          <input
                            id={`heads-${ev.id}`}
                            type="number"
                            min={1}
                            max={headsInvited}
                            value={currentResp.heads}
                            onChange={(e) =>
                              handleHeadsChange(ev.id, parseInt(e.target.value, 10) || 1)
                            }
                            className="w-24 rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface)] px-[var(--space-3)] py-[var(--space-2)] text-[length:var(--text-sm)] text-[var(--ink)] focus:outline-none focus:border-[var(--focus)]"
                            style={{ minHeight: "var(--target)" }}
                          />
                          <span className="text-[length:var(--text-xs)] text-[var(--ink-muted)]">
                            / {headsInvited} {headsInvited === 1 ? "seat" : "seats"}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Wishes / Dietary Notes */}
                    <div className="pt-2 border-t border-[var(--line)]">
                      <label
                        htmlFor={`msg-${ev.id}`}
                        className="block text-[length:var(--text-xs)] font-medium text-[var(--ink)]"
                      >
                        {t("messageLabel")}
                      </label>
                      <input
                        id={`msg-${ev.id}`}
                        type="text"
                        value={currentResp.message}
                        onChange={(e) => handleMessageChange(ev.id, e.target.value)}
                        placeholder={t("messagePlaceholder")}
                        className="mt-1 block w-full rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface)] px-[var(--space-3)] py-[var(--space-2)] text-[length:var(--text-xs)] text-[var(--ink)] focus:outline-none focus:border-[var(--focus)]"
                        style={{ minHeight: "var(--target)" }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Submission feedback */}
            {submissionSuccess && (
              <div
                role="status"
                className="rounded-[var(--radius-md)] p-[var(--space-4)] text-[length:var(--text-sm)] font-medium"
                style={{
                  backgroundColor: "color-mix(in oklch, var(--success) 12%, transparent)",
                  color: "var(--success)",
                  border: "1px solid var(--success)",
                }}
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" strokeWidth={1.5} />
                  <span>{t("successMessage")}</span>
                </div>
              </div>
            )}

            {/* Submit button */}
            <div className="pt-[var(--space-2)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-[var(--space-3)]">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-[var(--space-2)] rounded-[var(--radius-md)] px-[var(--space-6)] py-[var(--space-3)] text-[length:var(--text-sm)] font-medium text-[var(--accent-ink)] transition-colors hover:bg-[color-mix(in_oklch,var(--accent),black_12%)] focus:outline-none cursor-pointer disabled:opacity-50"
                style={{
                  backgroundColor: "var(--accent)",
                  minHeight: "var(--target)",
                }}
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} />
                ) : (
                  <span>{hasSubmitted ? t("updateButton") : t("submitButton")}</span>
                )}
              </button>

              {hasSubmitted && !submissionSuccess && (
                <span className="text-[length:var(--text-xs)] text-[var(--ink-muted)]">
                  {t("editResponse")}
                </span>
              )}
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
