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
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--accent-ink)]">
          <Heart className="h-4.5 w-4.5 fill-[var(--accent-ink)] text-[var(--accent-ink)]" strokeWidth={1.5} />
        </div>
        <span className="font-display tracking-tight text-[length:var(--text-lg)] font-bold">
          suba<span className="text-[var(--accent)]">.lk</span>
        </span>
      </Link>

      {/* Navigation links */}
      <nav className="flex items-center gap-[var(--space-4)]">
        <Link
          href="/vendors"
          className="hidden text-[length:var(--text-sm)] font-medium text-[var(--ink-muted)] hover:text-[var(--ink)] md:inline-flex md:items-center min-h-[var(--target)] px-1 whitespace-nowrap"
        >
          {tHub("navVendors")}
        </Link>
        <Link
          href="/plan/budget"
          className="hidden text-[length:var(--text-sm)] font-medium text-[var(--ink-muted)] hover:text-[var(--ink)] lg:inline-flex lg:items-center min-h-[var(--target)] px-1 whitespace-nowrap"
        >
          {tHub("navBudget")}
        </Link>
        <Link
          href="/app/vendor"
          className="hidden text-[length:var(--text-sm)] font-medium text-[var(--ink-muted)] hover:text-[var(--ink)] xl:inline-flex xl:items-center min-h-[var(--target)] px-1 whitespace-nowrap"
        >
          {tHub("navForVendors")}
        </Link>
        <Link
          href="/templates"
          className="hidden text-[length:var(--text-sm)] font-medium text-[var(--ink-muted)] hover:text-[var(--ink)] xl:inline-flex xl:items-center min-h-[var(--target)] px-1 whitespace-nowrap"
        >
          {t("templates")}
        </Link>
        <Link
          href="/#how-it-works"
          className="hidden text-[length:var(--text-sm)] font-medium text-[var(--ink-muted)] hover:text-[var(--ink)] 2xl:inline-flex 2xl:items-center min-h-[var(--target)] px-1 whitespace-nowrap"
        >
          How to use
        </Link>
        <Link
          href="/#features"
          className="hidden text-[length:var(--text-sm)] font-medium text-[var(--ink-muted)] hover:text-[var(--ink)] 2xl:inline-flex 2xl:items-center min-h-[var(--target)] px-1 whitespace-nowrap"
        >
          Features
        </Link>
        <Link
          href="/#pricing"
          className="hidden text-[length:var(--text-sm)] font-medium text-[var(--ink-muted)] hover:text-[var(--ink)] 2xl:inline-flex 2xl:items-center min-h-[var(--target)] px-1 whitespace-nowrap"
        >
          {t("pricing")}
        </Link>

        {/* Language selector */}
        <div className="hidden sm:flex items-center">
          <LocaleSwitcher />
        </div>

        <Link
          href="/login"
          className="hidden text-[length:var(--text-sm)] font-semibold text-[var(--ink-muted)] hover:text-[var(--ink)] sm:inline-flex sm:items-center min-h-[var(--target)] px-2 whitespace-nowrap"
        >
          {t("login")}
        </Link>

        {/* Primary CTA button with generous padding */}
        <Link
          href="/login?mode=signup"
          className="inline-flex items-center justify-center whitespace-nowrap rounded-[var(--radius-pill)] bg-[var(--accent)] px-[var(--space-4)] text-[length:var(--text-sm)] font-semibold text-[var(--accent-ink)] transition-opacity duration-[var(--dur-fast)] hover:opacity-90 min-h-[var(--target)]"
        >
          <span className="2xl:hidden">{t("getStartedShort")}</span>
          <span className="hidden 2xl:inline">{t("getStarted")}</span>
        </Link>
      </nav>
    </header>
  );
}
