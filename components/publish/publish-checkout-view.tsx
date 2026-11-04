"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import {
  createCheckoutOrderAction,
  simulateSandboxPaymentAction,
} from "@/app/actions/payment";
import { PLANS } from "@/lib/payhere";
import { toast } from "sonner";
import {
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  CreditCard,
  Check,
  Loader2,
} from "lucide-react";

interface PublishCheckoutViewProps {
  invitationId: string;
  slug: string;
  status: "draft" | "published" | "archived";
  publishedAt: Date | string | null;
  templateName: string;
  partnerNames: string;
  hasDate: boolean;
  guestCount: number;
  locale: string;
}

export function PublishCheckoutView({
  invitationId,
  slug,
  status: initialStatus,
  publishedAt: initialPublishedAt,
  templateName,
  partnerNames,
  hasDate,
  guestCount,
  locale,
}: PublishCheckoutViewProps) {
  const t = useTranslations("publish");
  type TranslationKey = Parameters<typeof t>[0];
  const router = useRouter();

  const [status, setStatus] = useState<"draft" | "published" | "archived">(initialStatus);
  const [publishedAt, setPublishedAt] = useState<Date | string | null>(initialPublishedAt);

  const [selectedPlan, setSelectedPlan] = useState<"essential" | "complete" | "signature">("complete");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  const isPublished = status === "published";
  const liveUrl = `/${locale}/i/${slug}`;

  // Proceed with real PayHere Checkout
  async function handlePayHereCheckout() {
    setIsProcessing(true);
    try {
      const res = await createCheckoutOrderAction({
        invitationId,
        plan: selectedPlan,
      });

      if (res.error) {
        toast.error(res.error);
        setIsProcessing(false);
        return;
      }

      if (res.success && res.payhereParams) {
        // Build dynamic form to submit to PayHere checkout
        const form = document.createElement("form");
        form.method = "POST";
        form.action = res.checkoutUrl;

        Object.entries(res.payhereParams).forEach(([key, val]) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = String(val);
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
      }
    } catch {
      toast.error(t("paymentError"));
      setIsProcessing(false);
    }
  }

  // Developer / Sandbox payment simulation
  async function handleSimulatePayment() {
    setIsSimulating(true);
    try {
      const orderRes = await createCheckoutOrderAction({
        invitationId,
        plan: selectedPlan,
      });

      if (orderRes.error || !orderRes.orderId) {
        toast.error(orderRes.error || t("paymentError"));
        setIsSimulating(false);
        return;
      }

      const simRes = await simulateSandboxPaymentAction(orderRes.orderId);

      if (simRes.success) {
        setStatus("published");
        setPublishedAt(new Date());
        toast.success(t("paymentSuccess"));
        router.refresh();
      } else {
        toast.error(t("paymentError"));
      }
    } catch {
      toast.error(t("paymentError"));
    } finally {
      setIsSimulating(false);
    }
  }

  return (
    <div className="w-full space-y-[var(--space-8)] text-left">
      {/* Published Live Confirmation Banner */}
      {isPublished && (
        <div
          className="rounded-[var(--radius-lg)] border p-[var(--space-6)] text-left"
          style={{
            borderColor: "color-mix(in oklch, var(--success) 35%, transparent)",
            backgroundColor: "color-mix(in oklch, var(--success) 8%, var(--surface))",
          }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-[var(--space-4)]">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-[var(--success)]" strokeWidth={1.5} />
                <h3 className="font-display text-[length:var(--text-lg)] font-semibold text-[var(--ink)]">
                  {t("alreadyPublished")}
                </h3>
              </div>
              <p className="text-[length:var(--text-xs)] text-[var(--ink-muted)]">
                {publishedAt ? t("publishedOn", { date: new Date(publishedAt).toLocaleDateString(locale) }) : ""}
              </p>
              <p className="font-mono text-[length:var(--text-xs)] text-[var(--ink)] pt-1">
                wedding.lk/i/{slug}
              </p>
            </div>

            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-[var(--space-2)] rounded-[var(--radius-md)] px-[var(--space-5)] py-[var(--space-2)] text-[length:var(--text-sm)] font-medium text-[var(--accent-ink)] transition-colors hover:bg-[color-mix(in_oklch,var(--accent),black_12%)] focus:outline-none"
              style={{
                backgroundColor: "var(--accent)",
                minHeight: "var(--target)",
              }}
            >
              <span>{t("viewLiveSite")}</span>
              <ExternalLink className="h-4 w-4" strokeWidth={1.5} />
            </a>
          </div>
        </div>
      )}

      {/* Pre-Publish Checklist */}
      <div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface)] p-[var(--space-6)] text-left">
        <h3 className="font-display text-[length:var(--text-lg)] font-medium text-[var(--ink)] mb-[var(--space-4)]">
          {t("checklistTitle")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[var(--space-3)] text-[length:var(--text-xs)]">
          <div className="flex items-center gap-[var(--space-2)]">
            <CheckCircle2 className="h-4 w-4 text-[var(--success)]" strokeWidth={1.5} />
            <span className="text-[var(--ink)]">{t("checkNames")}: <strong>{partnerNames}</strong></span>
          </div>

          <div className="flex items-center gap-[var(--space-2)]">
            <CheckCircle2 className="h-4 w-4 text-[var(--success)]" strokeWidth={1.5} />
            <span className="text-[var(--ink)]">
              {t("checkDesign", { theme: templateName })}
            </span>
          </div>

          <div className="flex items-center gap-[var(--space-2)]">
            <CheckCircle2 className="h-4 w-4 text-[var(--success)]" strokeWidth={1.5} />
            <span className="text-[var(--ink)]">
              {hasDate ? t("checkDate") : t("checkDate")}
            </span>
          </div>

          <div className="flex items-center gap-[var(--space-2)]">
            <CheckCircle2 className="h-4 w-4 text-[var(--success)]" strokeWidth={1.5} />
            <span className="text-[var(--ink)]">
              {t("checkGuests", { count: guestCount })}
            </span>
          </div>
        </div>
      </div>

      {/* Plan Selection Section */}
      <div className="space-y-[var(--space-4)]">
        <div>
          <h3 className="font-display text-[length:var(--text-2xl)] font-normal text-[var(--ink)]">
            {t("choosePlanTitle")}
          </h3>
          <p className="mt-1 text-[length:var(--text-sm)] text-[var(--ink-muted)]">
            {t("choosePlanSubtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-[var(--space-4)] md:grid-cols-3">
          {(Object.keys(PLANS) as Array<"essential" | "complete" | "signature">).map(
            (planKey) => {
              const plan = PLANS[planKey];
              const isSelected = selectedPlan === planKey;

              return (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  className="relative flex flex-col justify-between rounded-[var(--radius-lg)] border p-[var(--space-5)] transition-all cursor-pointer text-left"
                  style={{
                    backgroundColor: isSelected
                      ? "color-mix(in oklch, var(--accent) 4%, var(--surface))"
                      : "var(--surface)",
                    borderColor: isSelected
                      ? "var(--accent)"
                      : "var(--line)",
                    borderWidth: isSelected ? "2px" : "1px",
                  }}
                >
                  {plan.popular && (
                    <span
                      className="absolute -top-3 right-4 rounded-[var(--radius-sm)] px-[var(--space-2)] py-[1px] text-[length:var(--text-xs)] font-medium text-[var(--accent-ink)]"
                      style={{ backgroundColor: "var(--accent)" }}
                    >
                      {t("popularBadge")}
                    </span>
                  )}

                  <div>
                    <h4 className="font-display text-[length:var(--text-lg)] font-semibold text-[var(--ink)]">
                      {t(plan.nameKey as TranslationKey)}
                    </h4>
                    <p className="mt-1 text-[length:var(--text-xs)] text-[var(--ink-muted)] min-h-[36px]">
                      {t(plan.descKey as TranslationKey)}
                    </p>

                    <div className="my-[var(--space-4)]">
                      <span className="text-[length:var(--text-xs)] font-medium text-[var(--ink-muted)] uppercase">
                        {t("currencyPrefix")}{" "}
                      </span>
                      <span className="font-display text-[length:var(--text-3xl)] font-bold text-[var(--ink)]">
                        {plan.priceLkr.toLocaleString()}
                      </span>
                      <span className="text-[length:var(--text-xs)] text-[var(--ink-muted)]">
                        {" "}/ wedding
                      </span>
                    </div>

                    <ul className="space-y-[var(--space-2)] text-[length:var(--text-xs)] text-[var(--ink)] mb-[var(--space-6)]">
                      {plan.features.map((featKey) => (
                        <li key={featKey} className="flex items-start gap-2">
                          <Check className="h-3.5 w-3.5 mt-0.5 text-[var(--accent)] flex-shrink-0" strokeWidth={1.5} />
                          <span>{t(featKey as TranslationKey)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPlan(plan.id);
                    }}
                    className="w-full rounded-[var(--radius-md)] border px-[var(--space-3)] py-[var(--space-2)] text-[length:var(--text-xs)] font-medium transition-colors"
                    style={{
                      minHeight: "var(--target)",
                      borderColor: isSelected ? "var(--accent)" : "var(--line)",
                      backgroundColor: isSelected ? "var(--accent)" : "transparent",
                      color: isSelected ? "var(--accent-ink)" : "var(--ink)",
                    }}
                  >
                    {isSelected ? "Selected Plan" : "Choose Plan"}
                  </button>
                </div>
              );
            },
          )}
        </div>

        {/* Action Button Row */}
        <div className="pt-[var(--space-4)] flex flex-wrap items-center gap-[var(--space-3)]">
          <button
            type="button"
            disabled={isProcessing || isSimulating}
            onClick={handlePayHereCheckout}
            className="inline-flex items-center gap-[var(--space-2)] rounded-[var(--radius-md)] px-[var(--space-6)] py-[var(--space-3)] text-[length:var(--text-sm)] font-medium text-[var(--accent-ink)] transition-colors hover:bg-[color-mix(in_oklch,var(--accent),black_12%)] focus:outline-none cursor-pointer disabled:opacity-50"
            style={{
              backgroundColor: "var(--accent)",
              minHeight: "var(--target)",
            }}
          >
            {isProcessing ? (
              <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} />
            ) : (
              <CreditCard className="h-4 w-4" strokeWidth={1.5} />
            )}
            <span>{t("payButton")} (LKR {PLANS[selectedPlan].priceLkr.toLocaleString()})</span>
          </button>

          {/* Sandbox Simulation button for local dev & automated E2E tests */}
          <button
            type="button"
            disabled={isProcessing || isSimulating}
            onClick={handleSimulatePayment}
            className="inline-flex items-center gap-[var(--space-2)] rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface)] px-[var(--space-4)] py-[var(--space-3)] text-[length:var(--text-sm)] font-medium text-[var(--ink)] hover:bg-[var(--surface-muted)] cursor-pointer disabled:opacity-50"
            style={{ minHeight: "var(--target)" }}
          >
            {isSimulating ? (
              <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} />
            ) : (
              <ShieldCheck className="h-4 w-4 text-[var(--accent)]" strokeWidth={1.5} />
            )}
            <span>{t("simButton")}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
