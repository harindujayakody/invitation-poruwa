"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const localeNames: Record<string, string> = {
  si: "සිංහල",
  ta: "தமிழ்",
  en: "English",
};

export function LocaleSwitcher() {
  const currentLocale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  function onSelectLocale(nextLocale: string) {
    if (nextLocale === currentLocale) return;
    router.replace(pathname, { locale: nextLocale });
  }

  return (
    <div
      role="group"
      aria-label="Language selection"
      className="inline-flex items-center gap-[var(--space-1)] rounded-[var(--radius-md)] p-[2px]"
      style={{
        backgroundColor: "var(--surface-muted)",
        border: "1px solid var(--line)",
      }}
    >
      {routing.locales.map((loc) => {
        const isActive = loc === currentLocale;
        return (
          <button
            key={loc}
            type="button"
            lang={loc}
            onClick={() => onSelectLocale(loc)}
            className="rounded-[var(--radius-sm)] px-[var(--space-2)] text-[length:var(--text-xs)] font-medium transition-colors focus:outline-none focus:ring-1 focus:ring-[var(--focus)] cursor-pointer"
            style={{
              minHeight: "var(--target)",
              minWidth: "40px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: isActive ? "var(--surface)" : "transparent",
              color: isActive ? "var(--ink)" : "var(--ink-muted)",
              boxShadow: isActive ? "0 1px 2px rgba(0,0,0,0.05)" : "none",
            }}
          >
            {localeNames[loc] || loc}
          </button>
        );
      })}
    </div>
  );
}
