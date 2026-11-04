"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import {
  approvePhotoAction,
  rejectPhotoAction,
  deletePhotoAction,
} from "@/app/actions/gallery";
import { toast } from "sonner";
import {
  Camera,
  Check,
  X,
  Trash2,
  ExternalLink,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";

export interface GalleryPhotoItem {
  id: string;
  kind: string;
  storageKey: string;
  moderation: "pending" | "approved" | "rejected";
  createdAt: Date | string;
}

interface GalleryModerationViewProps {
  invitationId: string;
  slug: string;
  initialPhotos: GalleryPhotoItem[];
  locale: string;
}

export function GalleryModerationView({
  slug,
  initialPhotos,
}: GalleryModerationViewProps) {
  const t = useTranslations("gallery");
  const router = useRouter();

  const [photos, setPhotos] = useState<GalleryPhotoItem[]>(initialPhotos);
  const [activeFilter, setActiveFilter] = useState<"all" | "pending" | "approved" | "rejected">(
    initialPhotos.some((p) => p.moderation === "pending") ? "pending" : "all",
  );
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Metrics
  const totalPhotos = photos.length;
  const approvedCount = photos.filter((p) => p.moderation === "approved").length;
  const pendingCount = photos.filter((p) => p.moderation === "pending").length;
  const rejectedCount = photos.filter((p) => p.moderation === "rejected").length;

  // Filtered list
  const displayedPhotos = photos.filter((p) => {
    if (activeFilter === "all") return true;
    return p.moderation === activeFilter;
  });

  async function handleApprove(photoId: string) {
    setProcessingId(photoId);
    try {
      const res = await approvePhotoAction(photoId);
      if (res.success) {
        setPhotos((prev) =>
          prev.map((p) => (p.id === photoId ? { ...p, moderation: "approved" } : p)),
        );
        toast.success(t("photoApproved"));
        router.refresh();
      } else {
        toast.error(res.error || t("genericError"));
      }
    } catch {
      toast.error(t("genericError"));
    } finally {
      setProcessingId(null);
    }
  }

  async function handleReject(photoId: string) {
    setProcessingId(photoId);
    try {
      const res = await rejectPhotoAction(photoId);
      if (res.success) {
        setPhotos((prev) =>
          prev.map((p) => (p.id === photoId ? { ...p, moderation: "rejected" } : p)),
        );
        toast.success(t("photoRejected"));
        router.refresh();
      } else {
        toast.error(res.error || t("genericError"));
      }
    } catch {
      toast.error(t("genericError"));
    } finally {
      setProcessingId(null);
    }
  }

  async function handleDelete(photoId: string) {
    if (!confirm(t("confirmDelete"))) return;

    setProcessingId(photoId);
    try {
      const res = await deletePhotoAction(photoId);
      if (res.success) {
        setPhotos((prev) => prev.filter((p) => p.id !== photoId));
        toast.success(t("photoDeleted"));
        router.refresh();
      } else {
        toast.error(res.error || t("genericError"));
      }
    } catch {
      toast.error(t("genericError"));
    } finally {
      setProcessingId(null);
    }
  }

  return (
    <div className="w-full space-y-[var(--space-6)] text-left">
      {/* Metrics Bar */}
      <div className="grid grid-cols-2 gap-[var(--space-3)] sm:grid-cols-4">
        <div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface)] p-[var(--space-4)]">
          <span className="text-[length:var(--text-xs)] text-[var(--ink-muted)]">
            {t("metricTotalPhotos")}
          </span>
          <p className="mt-1 font-display text-[length:var(--text-2xl)] font-semibold text-[var(--ink)]">
            {totalPhotos}
          </p>
        </div>

        <div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface)] p-[var(--space-4)]">
          <span className="text-[length:var(--text-xs)] text-[var(--ink-muted)]">
            {t("metricPending")}
          </span>
          <p
            className="mt-1 font-display text-[length:var(--text-2xl)] font-semibold"
            style={{ color: pendingCount > 0 ? "var(--accent)" : "var(--ink)" }}
          >
            {pendingCount}
          </p>
        </div>

        <div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface)] p-[var(--space-4)]">
          <span className="text-[length:var(--text-xs)] text-[var(--ink-muted)]">
            {t("metricApproved")}
          </span>
          <p className="mt-1 font-display text-[length:var(--text-2xl)] font-semibold text-[var(--success)]">
            {approvedCount}
          </p>
        </div>

        <div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface)] p-[var(--space-4)]">
          <span className="text-[length:var(--text-xs)] text-[var(--ink-muted)]">
            {t("metricRejected")}
          </span>
          <p className="mt-1 font-display text-[length:var(--text-2xl)] font-semibold text-[var(--ink-muted)]">
            {rejectedCount}
          </p>
        </div>
      </div>

      {/* Action Row & Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-[var(--space-3)] border-b border-[var(--line)] pb-[var(--space-3)]">
        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveFilter("all")}
            className={`rounded-[var(--radius-md)] px-[var(--space-3)] py-1.5 text-[length:var(--text-xs)] font-medium transition-colors cursor-pointer ${
              activeFilter === "all"
                ? "bg-[var(--ink)] text-[var(--surface)]"
                : "border border-[var(--line)] bg-[var(--surface)] text-[var(--ink-muted)] hover:text-[var(--ink)]"
            }`}
          >
            {t("filterAll", { count: totalPhotos })}
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter("pending")}
            className={`rounded-[var(--radius-md)] px-[var(--space-3)] py-1.5 text-[length:var(--text-xs)] font-medium transition-colors cursor-pointer ${
              activeFilter === "pending"
                ? "bg-[var(--accent)] text-[var(--accent-ink)]"
                : "border border-[var(--line)] bg-[var(--surface)] text-[var(--ink-muted)] hover:text-[var(--ink)]"
            }`}
          >
            {t("filterPending", { count: pendingCount })}
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter("approved")}
            className={`rounded-[var(--radius-md)] px-[var(--space-3)] py-1.5 text-[length:var(--text-xs)] font-medium transition-colors cursor-pointer ${
              activeFilter === "approved"
                ? "bg-[var(--success)] text-white"
                : "border border-[var(--line)] bg-[var(--surface)] text-[var(--ink-muted)] hover:text-[var(--ink)]"
            }`}
          >
            {t("filterApproved", { count: approvedCount })}
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter("rejected")}
            className={`rounded-[var(--radius-md)] px-[var(--space-3)] py-1.5 text-[length:var(--text-xs)] font-medium transition-colors cursor-pointer ${
              activeFilter === "rejected"
                ? "bg-[var(--ink-muted)] text-[var(--surface)]"
                : "border border-[var(--line)] bg-[var(--surface)] text-[var(--ink-muted)] hover:text-[var(--ink)]"
            }`}
          >
            {t("filterRejected", { count: rejectedCount })}
          </button>
        </div>

        {/* View Live Stream Link */}
        <Link
          href={`/i/${slug}/gallery`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface)] px-[var(--space-3)] py-[var(--space-2)] text-[length:var(--text-xs)] font-medium text-[var(--ink)] hover:bg-[var(--surface-muted)]"
          style={{ minHeight: "36px" }}
        >
          <ExternalLink className="h-3.5 w-3.5 text-[var(--accent)]" strokeWidth={1.5} />
          <span>{t("openGuestGallery")}</span>
        </Link>
      </div>

      {/* Photo Stream Grid */}
      {displayedPhotos.length === 0 ? (
        <div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface)] p-[var(--space-12)] text-center space-y-[var(--space-2)]">
          <Camera className="mx-auto h-8 w-8 text-[var(--ink-muted)]" strokeWidth={1.5} />
          <h3 className="font-display text-[length:var(--text-lg)] text-[var(--ink)]">
            {activeFilter === "pending" ? t("emptyPending") : t("emptyGallery")}
          </h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[var(--space-4)]">
          {displayedPhotos.map((photo) => {
            const isProcessing = processingId === photo.id;

            return (
              <div
                key={photo.id}
                data-testid="moderation-photo-card"
                className="group relative rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface)] overflow-hidden shadow-xs flex flex-col justify-between"
              >
                {/* Photo Image Aspect Container */}
                <div className="relative aspect-square w-full bg-[var(--surface-muted)] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.storageKey}
                    alt="Uploaded wedding photo"
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />

                  {/* Moderation Status Pill */}
                  <div className="absolute top-2 left-2">
                    {photo.moderation === "pending" && (
                      <span className="inline-flex items-center gap-1 rounded-[var(--radius-sm)] border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-800">
                        <Clock className="h-3 w-3" strokeWidth={1.5} />
                        Pending
                      </span>
                    )}
                    {photo.moderation === "approved" && (
                      <span className="inline-flex items-center gap-1 rounded-[var(--radius-sm)] border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-800">
                        <CheckCircle2 className="h-3 w-3" strokeWidth={1.5} />
                        Approved
                      </span>
                    )}
                    {photo.moderation === "rejected" && (
                      <span className="inline-flex items-center gap-1 rounded-[var(--radius-sm)] border border-rose-200 bg-rose-50 px-2 py-0.5 text-[11px] font-medium text-rose-800">
                        <XCircle className="h-3 w-3" strokeWidth={1.5} />
                        Rejected
                      </span>
                    )}
                  </div>
                </div>

                {/* Moderation Controls Footer */}
                <div className="p-[var(--space-3)] border-t border-[var(--line)] flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1">
                    {photo.moderation !== "approved" && (
                      <button
                        type="button"
                        disabled={isProcessing}
                        onClick={() => handleApprove(photo.id)}
                        className="inline-flex items-center gap-1 rounded-[var(--radius-sm)] px-2 py-1 text-[length:var(--text-xs)] font-medium text-[var(--accent-ink)] hover:bg-[color-mix(in_oklch,var(--accent),black_12%)] cursor-pointer disabled:opacity-50"
                        style={{
                          backgroundColor: "var(--accent)",
                          minHeight: "30px",
                        }}
                      >
                        {isProcessing ? (
                          <Loader2 className="h-3 w-3 animate-spin" strokeWidth={1.5} />
                        ) : (
                          <Check className="h-3 w-3" strokeWidth={1.5} />
                        )}
                        <span>{t("approveButton")}</span>
                      </button>
                    )}

                    {photo.moderation !== "rejected" && (
                      <button
                        type="button"
                        disabled={isProcessing}
                        onClick={() => handleReject(photo.id)}
                        className="inline-flex items-center gap-1 rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--surface)] px-2 py-1 text-[length:var(--text-xs)] font-medium text-[var(--ink-muted)] hover:text-[var(--danger)] hover:bg-[var(--surface-muted)] cursor-pointer disabled:opacity-50"
                        style={{ minHeight: "30px" }}
                      >
                        <X className="h-3 w-3" strokeWidth={1.5} />
                        <span>{t("rejectButton")}</span>
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={() => handleDelete(photo.id)}
                    className="text-[var(--ink-muted)] hover:text-[var(--danger)] p-1 rounded-[var(--radius-sm)] focus:outline-none"
                    title={t("deleteButton")}
                    aria-label={t("deleteButton")}
                  >
                    <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
