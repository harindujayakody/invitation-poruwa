"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { authClient } from "@/lib/auth-client";
import { LocaleSwitcher } from "@/components/common/locale-switcher";
import { LogOut } from "lucide-react";

interface AppHeaderProps {
  user: {
    name?: string | null;
    email: string;
  };
}

export function AppHeader({ user }: AppHeaderProps) {
  const t = useTranslations("auth");

  async function handleSignOut() {
    await authClient.signOut();
    window.location.href = window.location.pathname.replace(/\/app(\/.*)?$/, "/login");
  }

  return (
    <header
      className="flex flex-wrap items-center justify-between gap-[var(--space-4)] px-[var(--space-6)] py-[var(--space-4)] md:px-[var(--space-12)]"
      style={{
        borderBottom: "1px solid var(--line)",
        backgroundColor: "var(--surface)",
      }}
    >
      <div className="flex items-center gap-[var(--space-4)]">
        <Link
          href="/app"
          className="text-[length:var(--text-base)] font-semibold text-[var(--ink)] focus:outline-none focus:ring-1 focus:ring-[var(--focus)]"
          style={{ minHeight: "var(--target)", display: "inline-flex", alignItems: "center" }}
        >
          Wedding
        </Link>
        <span
          className="hidden text-[length:var(--text-xs)] text-[var(--ink-muted)] sm:inline-block"
        >
          {user.name ? `${user.name} (${user.email})` : user.email}
        </span>
      </div>

      <div className="flex items-center gap-[var(--space-4)]">
        <LocaleSwitcher />

        <button
          type="button"
          onClick={handleSignOut}
          className="inline-flex items-center gap-[var(--space-2)] rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface)] px-[var(--space-3)] py-[var(--space-2)] text-[length:var(--text-xs)] font-medium text-[var(--ink)] transition-colors hover:bg-[var(--surface-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--focus)] cursor-pointer"
          style={{ minHeight: "var(--target)" }}
          aria-label={t("signOut")}
        >
          <LogOut className="h-4 w-4 text-[var(--ink-muted)]" strokeWidth={1.5} />
          <span className="hidden sm:inline">{t("signOut")}</span>
        </button>
      </div>
    </header>
  );
}
