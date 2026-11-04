"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Heart } from "lucide-react";

export function SiteHeader() {
  const t = useTranslations("nav");

  return (
    <header
      className="sticky top-0 z-50 flex items-center justify-between border-b border-[var(--line)] bg-[var(--surface)]/90 px-[var(--space-6)] py-[var(--space-3)] backdrop-blur-md md:px-[var(--space-12)]"
    >
      {/* Brand Wordmark & Heart Logo */}
      <Link
        href="/"
        className="flex items-center gap-2 text-[length:var(--text-lg)] font-bold tracking-tight text-[var(--ink)] focus:outline-none"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-600 text-white shadow-sm">
          <Heart className="h-4 w-4 fill-white text-white" strokeWidth={1.5} />
        </div>
        <span className="font-display tracking-tight text-[length:var(--text-lg)] uppercase">
          Suba<span className="text-rose-600">.lk</span>
        </span>
      </Link>

      {/* Navigation links */}
      <nav className="flex items-center gap-[var(--space-6)]">
        <Link
          href="/templates"
          className="hidden text-[length:var(--text-sm)] font-medium text-[var(--ink-muted)] hover:text-[var(--ink)] md:inline-flex md:items-center min-h-[var(--target)]"
        >
          {t("templates")}
        </Link>
        <Link
          href="/#how-it-works"
          className="hidden text-[length:var(--text-sm)] font-medium text-[var(--ink-muted)] hover:text-[var(--ink)] lg:inline-flex lg:items-center min-h-[var(--target)]"
        >
          How to use
        </Link>
        <Link
          href="/#features"
          className="hidden text-[length:var(--text-sm)] font-medium text-[var(--ink-muted)] hover:text-[var(--ink)] lg:inline-flex lg:items-center min-h-[var(--target)]"
        >
          Features
        </Link>
        <Link
          href="/#pricing"
          className="hidden text-[length:var(--text-sm)] font-medium text-[var(--ink-muted)] hover:text-[var(--ink)] md:inline-flex md:items-center min-h-[var(--target)]"
        >
          {t("pricing")}
        </Link>

        <Link
          href="/login"
          className="hidden text-[length:var(--text-sm)] font-medium text-[var(--ink-muted)] hover:text-[var(--ink)] sm:inline-flex sm:items-center min-h-[var(--target)]"
        >
          {t("login")}
        </Link>

        {/* Primary CTA button */}
        <Link
          href="/login"
          className="inline-flex items-center justify-center rounded-full bg-rose-600 px-[var(--space-5)] py-[var(--space-2)] text-[length:var(--text-sm)] font-medium text-white shadow-sm transition-all duration-200 hover:bg-rose-700 hover:shadow min-h-[var(--target)]"
        >
          {t("getStarted")}
        </Link>
      </nav>
    </header>
  );
}
