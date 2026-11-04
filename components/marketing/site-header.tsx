"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Heart } from "lucide-react";
import { LocaleSwitcher } from "@/components/common/locale-switcher";

export function SiteHeader() {
  const t = useTranslations("nav");
  const tHub = useTranslations("hub");

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-[var(--line)] bg-[var(--surface)]/95 px-[var(--space-6)] py-[var(--space-3)] backdrop-blur-md md:px-[var(--space-12)]">
      {/* Brand Wordmark & Heart Logo */}
      <Link
        href="/"
        className="flex items-center gap-2.5 text-[length:var(--text-lg)] font-bold tracking-tight text-[var(--ink)] focus:outline-none"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-600 text-white shadow-sm">
          <Heart className="h-4.5 w-4.5 fill-white text-white" strokeWidth={1.5} />
        </div>
        <span className="font-display tracking-tight text-[length:var(--text-lg)] uppercase font-extrabold">
          Suba<span className="text-rose-600">.lk</span>
        </span>
      </Link>

      {/* Navigation links */}
      <nav className="flex items-center gap-[var(--space-6)]">
        <Link
          href="/vendors"
          className="hidden text-[length:var(--text-sm)] font-medium text-[var(--ink-muted)] hover:text-[var(--ink)] md:inline-flex md:items-center min-h-[var(--target)] px-2"
        >
          {tHub("navVendors")}
        </Link>
        <Link
          href="/plan/budget"
          className="hidden text-[length:var(--text-sm)] font-medium text-[var(--ink-muted)] hover:text-[var(--ink)] md:inline-flex md:items-center min-h-[var(--target)] px-2"
        >
          {tHub("navBudget")}
        </Link>
        <Link
          href="/templates"
          className="hidden text-[length:var(--text-sm)] font-medium text-[var(--ink-muted)] hover:text-[var(--ink)] md:inline-flex md:items-center min-h-[var(--target)] px-2"
        >
          {t("templates")}
        </Link>
        <Link
          href="/#how-it-works"
          className="hidden text-[length:var(--text-sm)] font-medium text-[var(--ink-muted)] hover:text-[var(--ink)] lg:inline-flex lg:items-center min-h-[var(--target)] px-2"
        >
          How to use
        </Link>
        <Link
          href="/#features"
          className="hidden text-[length:var(--text-sm)] font-medium text-[var(--ink-muted)] hover:text-[var(--ink)] lg:inline-flex lg:items-center min-h-[var(--target)] px-2"
        >
          Features
        </Link>
        <Link
          href="/#pricing"
          className="hidden text-[length:var(--text-sm)] font-medium text-[var(--ink-muted)] hover:text-[var(--ink)] md:inline-flex md:items-center min-h-[var(--target)] px-2"
        >
          {t("pricing")}
        </Link>

        {/* Language selector */}
        <div className="hidden sm:flex items-center">
          <LocaleSwitcher />
        </div>

        <Link
          href="/login"
          className="hidden text-[length:var(--text-sm)] font-semibold text-[var(--ink-muted)] hover:text-[var(--ink)] sm:inline-flex sm:items-center min-h-[var(--target)] px-3"
        >
          {t("login")}
        </Link>

        {/* Primary CTA button with generous padding */}
        <Link
          href="/login?mode=signup"
          className="inline-flex items-center justify-center rounded-full bg-rose-600 px-6 py-2.5 text-[length:var(--text-sm)] font-semibold text-white shadow-sm transition-all duration-200 hover:bg-rose-700 hover:shadow-md hover:-translate-y-0.5 min-h-[44px]"
        >
          {t("getStarted")}
        </Link>
      </nav>
    </header>
  );
}
