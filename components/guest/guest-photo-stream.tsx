"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  Camera,
  Upload,
  Heart,
  ArrowLeft,
  X,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

export interface PublicPhotoItem {
  id: string;
  kind: string;
  storageKey: string;
  createdAt: Date | string;
}

interface GuestPhotoStreamProps {
  slug: string;
  coupleNames: string;
  initialPhotos: PublicPhotoItem[];
  locale: string;
}

export function GuestPhotoStream({
  slug,
  coupleNames,
  initialPhotos,
  locale,
}: GuestPhotoStreamProps) {
  const t = useTranslations("guestGallery");

  const [photos, setPhotos] = useState<PublicPhotoItem[]>(initialPhotos);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<PublicPhotoItem | null>(null);

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (file.size > 10 * 1024 * 1024) {
      toast.error(t("uploadError"));
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`/api/invitations/${slug}/photos`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(t("uploadSuccess"));
        // If auto-approved, append to photos
        if (data.moderation === "approved") {
          setPhotos((prev) => [
            {
              id: data.mediaId,
              kind: "guest",
              storageKey: data.url,
              createdAt: new Date().toISOString(),
            },
            ...prev,
          ]);
        }
      } else {
        toast.error(data.error || t("uploadError"));
      }
    } catch {
      toast.error(t("uploadError"));
    } finally {
      setIsUploading(false);
      // Reset input
      e.target.value = "";
    }
  }

  return (
    <div
      lang={locale}
      className="min-h-screen bg-[var(--bg)] text-[var(--ink)] flex flex-col items-center selection:bg-[var(--accent)] selection:text-[var(--accent-ink)]"
    >
      {/* Top Header */}
      <header className="w-full max-w-4xl px-[var(--space-4)] py-[var(--space-3)] flex items-center justify-between text-[length:var(--text-xs)]">
        <Link
          href={`/i/${slug}`}
          className="inline-flex items-center gap-[var(--space-1)] text-[var(--ink-muted)] hover:text-[var(--ink)]"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
          <span>{t("backToInvite")}</span>
        </Link>

        {/* Language switch */}
        <nav
          aria-label="Language selection"
          className="flex items-center gap-[var(--space-1)] rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface)] p-[2px]"
        >
          <Link
            href={`/si/i/${slug}/gallery`}
            className={`rounded-[var(--radius-sm)] px-[var(--space-2)] py-[2px] transition-colors ${
              locale === "si"
                ? "bg-[var(--accent)] text-[var(--accent-ink)] font-medium"
                : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
            }`}
          >
            සිංහල
          </Link>
          <Link
            href={`/ta/i/${slug}/gallery`}
            className={`rounded-[var(--radius-sm)] px-[var(--space-2)] py-[2px] transition-colors ${
              locale === "ta"
                ? "bg-[var(--accent)] text-[var(--accent-ink)] font-medium"
                : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
            }`}
          >
            தமிழ்
          </Link>
          <Link
            href={`/en/i/${slug}/gallery`}
            className={`rounded-[var(--radius-sm)] px-[var(--space-2)] py-[2px] transition-colors ${
              locale === "en"
                ? "bg-[var(--accent)] text-[var(--accent-ink)] font-medium"
                : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
            }`}
          >
            EN
          </Link>
        </nav>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-4xl px-[var(--space-4)] py-[var(--space-6)] flex flex-col space-y-[var(--space-6)] text-left">
        {/* Title & Upload Action */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-[var(--space-4)] border-b border-[var(--line)] pb-[var(--space-6)]">
          <div className="space-y-[var(--space-1)]">
            <div className="inline-flex items-center gap-1.5 text-[length:var(--text-xs)] text-[var(--accent)] font-medium uppercase tracking-wider">
              <Heart className="h-3.5 w-3.5 text-[var(--accent)]" strokeWidth={1.5} />
              <span>{coupleNames}</span>
            </div>
            <h1 className="font-display text-[length:var(--text-3xl)] font-semibold text-[var(--ink)]">
              {t("title")}
            </h1>
            <p className="text-[length:var(--text-xs)] text-[var(--ink-muted)] max-w-lg">
              {t("subtitle", { couple: coupleNames })}
            </p>
          </div>

          {/* Upload Button */}
          <div>
            <label
              htmlFor="photo-upload-input"
              className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] px-[var(--space-5)] py-[var(--space-2)] text-[length:var(--text-sm)] font-medium text-[var(--accent-ink)] transition-colors hover:bg-[color-mix(in_oklch,var(--accent),black_12%)] focus:outline-none cursor-pointer"
              style={{
                backgroundColor: "var(--accent)",
                minHeight: "var(--target)",
              }}
            >
              {isUploading ? (
                <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} />
              ) : (
                <Upload className="h-4 w-4" strokeWidth={1.5} />
              )}
              <span>{isUploading ? t("uploading") : t("uploadButton")}</span>
            </label>
            <input
              id="photo-upload-input"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              disabled={isUploading}
              onChange={handleFileSelect}
              className="sr-only"
            />
          </div>
        </div>

        {/* Photos Grid */}
        {photos.length === 0 ? (
          <div
            data-testid="empty-photo-gallery"
            className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface)] p-[var(--space-12)] text-center space-y-[var(--space-3)]"
          >
            <Camera className="mx-auto h-8 w-8 text-[var(--ink-muted)]" strokeWidth={1.5} />
            <h2 className="font-display text-[length:var(--text-lg)] text-[var(--ink)]">
              {t("noPhotosYet")}
            </h2>
            <p className="text-[length:var(--text-xs)] text-[var(--ink-muted)]">
              {t("fileLimits")}
            </p>
          </div>
        ) : (
          <div
            data-testid="public-photo-grid"
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-[var(--space-3)] sm:gap-[var(--space-4)]"
          >
            {photos.map((photo) => (
              <button
                key={photo.id}
                type="button"
                onClick={() => setSelectedPhoto(photo)}
                className="group relative aspect-square w-full rounded-[var(--radius-md)] overflow-hidden border border-[var(--line)] bg-[var(--surface-muted)] text-left focus:outline-none cursor-pointer"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.storageKey}
                  alt="Wedding candid photo"
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </button>
            ))}
          </div>
        )}
      </main>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-[var(--space-4)]"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative max-w-3xl max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedPhoto(null)}
              className="absolute -top-10 right-0 text-white hover:text-white/80 p-1"
              aria-label="Close"
            >
              <X className="h-6 w-6" strokeWidth={1.5} />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedPhoto.storageKey}
              alt="Wedding celebration full photo"
              className="max-h-[80vh] w-auto rounded-[var(--radius-lg)] object-contain shadow-2xl"
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="w-full max-w-4xl px-[var(--space-4)] py-[var(--space-8)] text-center text-[length:var(--text-xs)] text-[var(--ink-muted)]">
        <p>{t("footerText")}</p>
      </footer>
    </div>
  );
}
