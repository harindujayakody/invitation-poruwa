"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { submitCustomDesignAction } from "@/app/actions/custom-design";
import { toast } from "sonner";
import {
  Palette,
  Clock,
  CheckCircle2,
  AlertCircle,
  Phone,
  FileText,
  ExternalLink,
  Loader2,
  Info,
} from "lucide-react";

export interface CustomDesignRequestItem {
  id: string;
  requestType: string;
  title: string;
  description: string;
  contactWhatsapp: string;
  attachmentUrl: string | null;
  status: string;
  adminNotes: string | null;
  createdAt: Date | string;
}

interface CustomDesignViewProps {
  invitationId: string;
  slug: string;
  initialRequests: CustomDesignRequestItem[];
  locale: string;
}

export function CustomDesignView({
  invitationId,
  initialRequests,
}: CustomDesignViewProps) {
  const t = useTranslations("customDesign");
  const router = useRouter();

  const [requests, setRequests] = useState<CustomDesignRequestItem[]>(initialRequests);
  const [submitting, setSubmitting] = useState(false);
  const [requestType, setRequestType] = useState<string>("nakath_calligraphy");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [contactWhatsapp, setContactWhatsapp] = useState("+94 ");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim() || !description.trim() || !contactWhatsapp.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("invitationId", invitationId);
      formData.append("requestType", requestType);
      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("contactWhatsapp", contactWhatsapp.trim());
      if (selectedFile) {
        formData.append("attachment", selectedFile);
      }

      const res = await submitCustomDesignAction(formData);

      if (res.error) {
        toast.error(res.error);
        return;
      }

      toast.success(t("successToast"));
      // Reset form
      setTitle("");
      setDescription("");
      setSelectedFile(null);

      // Append optimistic item
      const optimisticItem: CustomDesignRequestItem = {
        id: crypto.randomUUID(),
        requestType,
        title: title.trim(),
        description: description.trim(),
        contactWhatsapp: contactWhatsapp.trim(),
        attachmentUrl: null,
        status: "pending",
        adminNotes: null,
        createdAt: new Date(),
      };
      setRequests([optimisticItem, ...requests]);
      router.refresh();
    } catch {
      toast.error("Failed to submit design request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in_review":
        return {
          label: t("statusInReview"),
          icon: Clock,
          color: "var(--accent)",
          bg: "var(--surface)",
        };
      case "completed":
        return {
          label: t("statusCompleted"),
          icon: CheckCircle2,
          color: "var(--ok)",
          bg: "var(--surface)",
        };
      case "declined":
        return {
          label: t("statusDeclined"),
          icon: AlertCircle,
          color: "var(--critical)",
          bg: "var(--surface)",
        };
      default:
        return {
          label: t("statusPending"),
          icon: Clock,
          color: "var(--ink-muted)",
          bg: "var(--surface)",
        };
    }
  };

  const getRequestTypeName = (type: string) => {
    switch (type) {
      case "nakath_calligraphy":
        return t("typeNakath");
      case "poruwa_motif":
        return t("typePoruwa");
      case "family_crest":
        return t("typeCrest");
      case "music_audio":
        return t("typeMusic");
      case "full_bespoke":
        return t("typeBespoke");
      default:
        return type;
    }
  };

  return (
    <div className="space-y-[var(--space-6)]">
      {/* Header */}
      <div>
        <h1 className="font-display text-[length:var(--text-2xl)] font-bold tracking-tight text-[var(--ink)]">
          {t("title")}
        </h1>
        <p className="mt-[var(--space-1)] max-w-prose text-[length:var(--text-base)] text-[var(--ink-muted)] leading-[1.7]">
          {t("subtitle")}
        </p>
      </div>

      {/* Artisan Concierge Info Banner */}
      <section
        aria-labelledby="concierge-banner-heading"
        className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface)] p-[var(--space-4)] md:p-[var(--space-5)]"
      >
        <div className="flex items-start gap-[var(--space-3)]">
          <Palette className="h-5 w-5 shrink-0 text-[var(--accent)]" strokeWidth={1.5} />
          <div className="space-y-[var(--space-2)]">
            <h2
              id="concierge-banner-heading"
              className="text-[length:var(--text-base)] font-semibold text-[var(--ink)]"
            >
              {t("conciergeBadge")} · {t("signatureBenefit")}
            </h2>
            <div className="space-y-[var(--space-1)] text-[length:var(--text-sm)] text-[var(--ink-muted)]">
              <p>{t("step1")}</p>
              <p>{t("step2")}</p>
              <p>{t("step3")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Grid: Form on Left/Top, Existing List on Right/Bottom */}
      <div className="grid grid-cols-1 gap-[var(--space-6)] lg:grid-cols-12">
        {/* Request Form */}
        <section
          aria-labelledby="form-heading"
          className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface)] p-[var(--space-5)] lg:col-span-7"
        >
          <h2
            id="form-heading"
            className="text-[length:var(--text-lg)] font-semibold text-[var(--ink)]"
          >
            {t("formTitle")}
          </h2>

          <form onSubmit={handleSubmit} className="mt-[var(--space-4)] space-y-[var(--space-4)]">
            {/* Request Type */}
            <div>
              <label
                htmlFor="requestType"
                className="block text-[length:var(--text-sm)] font-medium text-[var(--ink)]"
              >
                {t("requestTypeLabel")}
              </label>
              <select
                id="requestType"
                value={requestType}
                onChange={(e) => setRequestType(e.target.value)}
                className="mt-[var(--space-1)] block w-full rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface)] px-[var(--space-3)] py-[var(--space-2)] text-[length:var(--text-base)] text-[var(--ink)] focus:outline-none focus:ring-1 focus:ring-[var(--focus)] min-h-[var(--target)]"
              >
                <option value="nakath_calligraphy">{t("typeNakath")}</option>
                <option value="poruwa_motif">{t("typePoruwa")}</option>
                <option value="family_crest">{t("typeCrest")}</option>
                <option value="music_audio">{t("typeMusic")}</option>
                <option value="full_bespoke">{t("typeBespoke")}</option>
              </select>
            </div>

            {/* Title / Subject */}
            <div>
              <label
                htmlFor="title"
                className="block text-[length:var(--text-sm)] font-medium text-[var(--ink)]"
              >
                {t("titleLabel")}
              </label>
              <input
                id="title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t("titlePlaceholder")}
                className="mt-[var(--space-1)] block w-full rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface)] px-[var(--space-3)] py-[var(--space-2)] text-[length:var(--text-base)] text-[var(--ink)] focus:outline-none focus:ring-1 focus:ring-[var(--focus)] min-h-[var(--target)]"
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-[length:var(--text-sm)] font-medium text-[var(--ink)]"
              >
                {t("descLabel")}
              </label>
              <textarea
                id="description"
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t("descPlaceholder")}
                className="mt-[var(--space-1)] block w-full rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface)] p-[var(--space-3)] text-[length:var(--text-base)] text-[var(--ink)] leading-[1.7] focus:outline-none focus:ring-1 focus:ring-[var(--focus)]"
              />
            </div>

            {/* WhatsApp Number */}
            <div>
              <label
                htmlFor="contactWhatsapp"
                className="block text-[length:var(--text-sm)] font-medium text-[var(--ink)]"
              >
                {t("whatsappLabel")}
              </label>
              <div className="relative mt-[var(--space-1)]">
                <input
                  id="contactWhatsapp"
                  type="text"
                  required
                  value={contactWhatsapp}
                  onChange={(e) => setContactWhatsapp(e.target.value)}
                  placeholder={t("whatsappPlaceholder")}
                  className="block w-full rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface)] pl-[var(--space-8)] pr-[var(--space-3)] py-[var(--space-2)] text-[length:var(--text-base)] text-[var(--ink)] focus:outline-none focus:ring-1 focus:ring-[var(--focus)] min-h-[var(--target)]"
                />
                <Phone
                  className="absolute left-[var(--space-2)] top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--ink-muted)]"
                  strokeWidth={1.5}
                />
              </div>
            </div>

            {/* Attachment Reference */}
            <div>
              <label
                htmlFor="attachment"
                className="block text-[length:var(--text-sm)] font-medium text-[var(--ink)]"
              >
                {t("attachLabel")}
              </label>
              <div className="mt-[var(--space-1)] flex items-center gap-[var(--space-3)]">
                <input
                  id="attachment"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setSelectedFile(e.target.files[0]);
                    }
                  }}
                  className="block w-full text-[length:var(--text-sm)] text-[var(--ink-muted)] file:mr-[var(--space-3)] file:rounded-[var(--radius-sm)] file:border-0 file:bg-[var(--line)] file:px-[var(--space-3)] file:py-[var(--space-2)] file:text-[length:var(--text-sm)] file:font-medium file:text-[var(--ink)] hover:file:cursor-pointer min-h-[var(--target)]"
                />
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-[var(--space-2)]">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex w-full items-center justify-center gap-[var(--space-2)] rounded-[var(--radius-md)] bg-[var(--accent)] px-[var(--space-4)] py-[var(--space-3)] text-[length:var(--text-sm)] font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50 min-h-[var(--target)]"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} />
                    <span>{t("submitting")}</span>
                  </>
                ) : (
                  <>
                    <Palette className="h-4 w-4" strokeWidth={1.5} />
                    <span>{t("submitButton")}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </section>

        {/* Existing Requests List */}
        <section
          aria-labelledby="existing-heading"
          className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface)] p-[var(--space-5)] lg:col-span-5"
        >
          <div className="flex items-center justify-between border-b border-[var(--line)] pb-[var(--space-3)]">
            <h2
              id="existing-heading"
              className="text-[length:var(--text-lg)] font-semibold text-[var(--ink)]"
            >
              {t("existingTitle")}
            </h2>
            <span className="text-[length:var(--text-xs)] text-[var(--ink-muted)]">
              ({requests.length})
            </span>
          </div>

          <div className="mt-[var(--space-4)] space-y-[var(--space-3)]">
            {requests.length === 0 ? (
              <div className="py-[var(--space-8)] text-center">
                <Info className="mx-auto h-8 w-8 text-[var(--ink-muted)]" strokeWidth={1.5} />
                <p className="mt-[var(--space-2)] text-[length:var(--text-sm)] text-[var(--ink-muted)]">
                  {t("emptyState")}
                </p>
              </div>
            ) : (
              requests.map((item) => {
                const badge = getStatusBadge(item.status);
                const BadgeIcon = badge.icon;
                const formattedDate = new Date(item.createdAt).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                });

                return (
                  <article
                    key={item.id}
                    data-testid="custom-design-card"
                    className="rounded-[var(--radius-md)] border border-[var(--line)] p-[var(--space-3)]"
                  >
                    <div className="flex items-start justify-between gap-[var(--space-2)]">
                      <div>
                        <span className="text-[length:var(--text-xs)] font-medium text-[var(--accent)]">
                          {getRequestTypeName(item.requestType)}
                        </span>
                        <h3 className="text-[length:var(--text-sm)] font-semibold text-[var(--ink)]">
                          {item.title}
                        </h3>
                      </div>
                      <span
                        className="inline-flex items-center gap-1 rounded-[var(--radius-sm)] border border-[var(--line)] px-[var(--space-2)] py-0.5 text-[length:var(--text-xs)] font-medium"
                        style={{ color: badge.color }}
                      >
                        <BadgeIcon className="h-3 w-3" strokeWidth={1.5} />
                        <span>{badge.label}</span>
                      </span>
                    </div>

                    <p className="mt-[var(--space-2)] text-[length:var(--text-xs)] text-[var(--ink-muted)] line-clamp-3 leading-[1.6]">
                      {item.description}
                    </p>

                    <div className="mt-[var(--space-3)] flex items-center justify-between border-t border-[var(--line)] pt-[var(--space-2)] text-[length:var(--text-xs)] text-[var(--ink-muted)]">
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" strokeWidth={1.5} />
                        {item.contactWhatsapp}
                      </span>
                      <span>{formattedDate}</span>
                    </div>

                    {item.attachmentUrl && (
                      <div className="mt-[var(--space-2)] pt-[var(--space-1)]">
                        <a
                          href={item.attachmentUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[length:var(--text-xs)] text-[var(--accent)] hover:underline"
                        >
                          <FileText className="h-3 w-3" strokeWidth={1.5} />
                          <span>View reference file</span>
                          <ExternalLink className="h-3 w-3" strokeWidth={1.5} />
                        </a>
                      </div>
                    )}
                  </article>
                );
              })
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
