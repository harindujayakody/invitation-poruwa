"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, Printer, ExternalLink, QrCode } from "lucide-react";

interface EntranceSignViewProps {
  invitationId: string;
  slug: string;
  coupleNames: string;
  eventDate?: string | null;
  venue?: string | null;
  qrSvg: string;
  tableLocatorUrl?: string;
}

export function EntranceSignView({
  invitationId,
  slug,
  coupleNames,
  eventDate,
  venue,
  qrSvg,
  tableLocatorUrl,
}: EntranceSignViewProps) {
  const t = useTranslations("entranceSign");

  function handlePrint() {
    window.print();
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-[var(--space-6)] text-left">
      {/* Top Controls Bar (hidden during printing) */}
      <div className="print:hidden flex flex-wrap items-center justify-between gap-[var(--space-3)] border-b border-[var(--line)] pb-[var(--space-4)]">
        <Link
          href={`/app/invitations/${invitationId}/seating`}
          className="inline-flex items-center gap-[var(--space-2)] text-[length:var(--text-xs)] font-medium text-[var(--ink-muted)] hover:text-[var(--ink)] focus:outline-none"
          style={{ minHeight: "36px" }}
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
          <span>{t("backToSeating")}</span>
        </Link>

        <div className="flex items-center gap-[var(--space-2)]">
          <Link
            href={`/i/${slug}/tables`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-[var(--space-2)] rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface)] px-[var(--space-3)] py-[var(--space-2)] text-[length:var(--text-xs)] font-medium text-[var(--ink)] hover:bg-[var(--surface-muted)] focus:outline-none"
            style={{ minHeight: "38px" }}
          >
            <ExternalLink className="h-3.5 w-3.5 text-[var(--accent)]" strokeWidth={1.5} />
            <span>{t("previewButton")}</span>
          </Link>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-[var(--space-2)] rounded-[var(--radius-md)] px-[var(--space-4)] py-[var(--space-2)] text-[length:var(--text-xs)] font-medium text-[var(--accent-ink)] transition-colors hover:bg-[color-mix(in_oklch,var(--accent),black_12%)] focus:outline-none cursor-pointer"
            style={{
              backgroundColor: "var(--accent)",
              minHeight: "38px",
            }}
          >
            <Printer className="h-4 w-4" strokeWidth={1.5} />
            <span>{t("printButton")}</span>
          </button>
        </div>
      </div>

      {/* Screen Helper Notice */}
      <div className="print:hidden rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-muted)] p-[var(--space-3)] text-[length:var(--text-xs)] text-[var(--ink-muted)]">
        <p>{t("subtitle")}</p>
      </div>

      {/* PRINT-READY ENTRANCE SIGN CARD */}
      <section
        id="entrance-sign-card"
        className="mx-auto max-w-xl rounded-[var(--radius-xl)] border-2 border-[var(--line)] bg-[var(--surface)] p-[var(--space-8)] sm:p-[var(--space-12)] text-center shadow-sm print:border-none print:shadow-none print:p-0 print:m-0 print:max-w-none"
      >
        {/* Subtle decorative inner border */}
        <div className="rounded-[var(--radius-lg)] border border-[color-mix(in_oklch,var(--accent)_30%,transparent)] p-[var(--space-6)] sm:p-[var(--space-8)] flex flex-col items-center justify-center space-y-[var(--space-6)]">
          {/* Header */}
          <div className="space-y-[var(--space-2)]">
            <span
              className="text-[length:var(--text-xs)] font-medium uppercase tracking-widest block"
              style={{ color: "var(--accent)" }}
            >
              {t("welcomeToWedding")}
            </span>
            <h1 className="font-display text-[length:var(--text-3xl)] sm:text-[length:var(--text-4xl)] font-semibold text-[var(--ink)] leading-tight">
              {coupleNames}
            </h1>
            {(eventDate || venue) && (
              <p className="text-[length:var(--text-xs)] text-[var(--ink-muted)] font-medium">
                {eventDate} {eventDate && venue ? "•" : ""} {venue}
              </p>
            )}
          </div>

          {/* QR Code Container */}
          <div className="rounded-[var(--radius-lg)] border-2 border-[var(--line)] bg-[var(--surface)] p-[var(--space-4)] shadow-xs flex flex-col items-center">
            <div
              className="w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full"
              dangerouslySetInnerHTML={{ __html: qrSvg }}
            />
            <div className="mt-[var(--space-2)] inline-flex items-center gap-1.5 text-[length:var(--text-xs)] text-[var(--ink-muted)] font-mono">
              <QrCode className="h-3.5 w-3.5 text-[var(--accent)]" strokeWidth={1.5} />
              <span>wedding.lk/i/{slug}/tables</span>
            </div>
          </div>

          {/* Instructions */}
          <div className="max-w-sm space-y-1 text-center">
            <h2 className="font-display text-[length:var(--text-base)] font-semibold text-[var(--ink)]">
              {t("scanToFindTable")}
            </h2>
            <p className="text-[length:var(--text-xs)] text-[var(--ink-muted)] leading-relaxed">
              {t("instruction", { url: tableLocatorUrl || `wedding.lk/i/${slug}/tables` })}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
