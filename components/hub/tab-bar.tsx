import { getTranslations } from "next-intl/server";
import { Home, Mail, Search, Wallet } from "lucide-react";
import { Link } from "@/i18n/navigation";

const TABS = [
  { key: "home", href: "/", label: "tabHome", Icon: Home },
  { key: "vendors", href: "/vendors", label: "tabVendors", Icon: Search },
  { key: "plan", href: "/plan/budget", label: "tabPlan", Icon: Wallet },
  { key: "invites", href: "/invitations", label: "tabInvites", Icon: Mail },
] as const;

/** Phone-only bottom navigation. Renders its own spacer so page content never hides behind it. */
export async function TabBar({ active }: { active?: (typeof TABS)[number]["key"] }) {
  const t = await getTranslations("hub");
  return (
    <>
      <div className="h-20 lg:hidden" aria-hidden />
      <nav
        aria-label={t("service")}
        className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-[var(--line)] bg-[var(--surface-raised)] px-[var(--space-2)] pt-[var(--space-1)] pb-[max(var(--space-2),env(safe-area-inset-bottom))] lg:hidden"
      >
        {TABS.map(({ key, href, label, Icon }) => (
          <Link
            key={key}
            href={href}
            aria-current={active === key ? "page" : undefined}
            className={`flex min-h-[var(--target)] flex-col items-center justify-center gap-0.5 text-[length:var(--text-xs)] font-bold ${active === key ? "text-[var(--accent)]" : "text-[var(--ink-muted)]"}`}
          >
            <Icon size={20} strokeWidth={1.5} aria-hidden />
            {t(label)}
          </Link>
        ))}
      </nav>
    </>
  );
}
