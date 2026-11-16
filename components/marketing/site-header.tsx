"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Heart } from "lucide-react";
import { LocaleSwitcher } from "@/components/common/locale-switcher";

const link = "items-center whitespace-nowrap px-1 text-[length:var(--text-sm)] font-bold text-[var(--ink)] hover:text-[var(--accent)] min-h-[var(--target)]";

export function SiteHeader() {
  const t = useTranslations("nav");
  const tHub = useTranslations("hub");

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between gap-[var(--space-4)] border-b border-[var(--line)] bg-[var(--surface-raised)] px-[var(--space-4)] py-[var(--space-2)] md:px-[var(--space-12)]">
      <Link href="/" className="flex items-center gap-2 font-display text-[length:var(--text-lg)] font-extrabold text-[var(--ink)]">
        <span className="flex size-9 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--accent-ink)]">
          <Heart size={20} strokeWidth={1.5} aria-hidden />
        </span>
        <span>suba<span className="text-[var(--accent)]">.lk</span></span>
      </Link>

      {/* Phones and tablets use the bottom tab bar for these links */}
      <nav className="hidden flex-1 items-center gap-[var(--space-6)] lg:flex">
        <Link href="/vendors" className={`inline-flex ${link}`}>{tHub("navVendors")}</Link>
        <Link href="/plan/budget" className={`inline-flex ${link}`}>{tHub("navPlan")}</Link>
        <Link href="/invitations" className={`inline-flex ${link}`}>{tHub("navInvitations")}</Link>
        <Link href="/app/vendor" className={`hidden xl:inline-flex ${link} font-semibold text-[var(--ink-muted)]`}>{tHub("navForVendors")}</Link>
      </nav>

      <div className="flex items-center gap-[var(--space-2)]">
        <LocaleSwitcher />
        <Link href="/login" className={`hidden lg:inline-flex ${link}`}>{t("login")}</Link>
        <Link
          href="/login?mode=signup"
          className="hidden min-h-[var(--target)] items-center whitespace-nowrap rounded-[var(--radius-pill)] bg-[var(--accent)] px-[var(--space-4)] font-display text-[length:var(--text-sm)] font-extrabold text-[var(--accent-ink)] sm:inline-flex"
        >
          {t("getStartedShort")}
        </Link>
      </div>
    </header>
  );
}
