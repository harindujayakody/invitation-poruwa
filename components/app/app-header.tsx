"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { authClient } from "@/lib/auth-client";
import { LocaleSwitcher } from "@/components/common/locale-switcher";
import { Heart, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <header className="sticky top-0 z-40 flex flex-wrap items-center justify-between gap-4 border-b border-[var(--line)] bg-[var(--surface)]/95 px-[var(--space-6)] py-3 backdrop-blur-md md:px-[var(--space-12)]">
      {/* Brand Wordmark & Heart Logo */}
      <div className="flex items-center gap-4">
        <Link
          href="/app"
          className="flex items-center gap-2.5 text-[length:var(--text-lg)] font-bold tracking-tight text-[var(--ink)] focus:outline-none"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-600 text-white shadow-sm">
            <Heart className="h-4.5 w-4.5 fill-white text-white" strokeWidth={1.5} />
          </div>
          <span className="font-display tracking-tight text-[length:var(--text-lg)] uppercase font-extrabold">
            Suba<span className="text-rose-600">.lk</span>
          </span>
        </Link>

        {/* User Pill Badge */}
        <div className="hidden sm:inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-3 py-1 text-xs text-stone-600 shadow-xs">
          <div className="flex h-4 w-4 items-center justify-center rounded-full bg-rose-100 text-rose-700">
            <User className="h-2.5 w-2.5" />
          </div>
          <span className="font-semibold text-stone-800">{user.name || "Couple Account"}</span>
          <span className="text-stone-400">·</span>
          <span className="text-stone-500 truncate max-w-[180px]">{user.email}</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <LocaleSwitcher />

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleSignOut}
          className="gap-2 text-xs font-semibold text-stone-700 hover:text-stone-900 border-stone-300"
          aria-label={t("signOut")}
        >
          <LogOut className="h-3.5 w-3.5 text-stone-500" strokeWidth={1.75} />
          <span>{t("signOut")}</span>
        </Button>
      </div>
    </header>
  );
}
