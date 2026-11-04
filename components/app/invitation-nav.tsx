"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Edit3, Users, CheckCircle2, Bell, LayoutGrid, CreditCard, Camera, Palette } from "lucide-react";

interface InvitationNavProps {
  invitationId: string;
  slug?: string;
}

export function InvitationNav({ invitationId }: InvitationNavProps) {
  const t = useTranslations("invitationNav");
  const pathname = usePathname();

  const tabs = [
    {
      href: `/app/invitations/${invitationId}/edit`,
      label: t("tabEdit"),
      icon: Edit3,
    },
    {
      href: `/app/invitations/${invitationId}/guests`,
      label: t("tabGuests"),
      icon: Users,
    },
    {
      href: `/app/invitations/${invitationId}/rsvp`,
      label: t("tabRsvp"),
      icon: CheckCircle2,
    },
    {
      href: `/app/invitations/${invitationId}/reminders`,
      label: t("tabReminders"),
      icon: Bell,
    },
    {
      href: `/app/invitations/${invitationId}/seating`,
      label: t("tabSeating"),
      icon: LayoutGrid,
    },
    {
      href: `/app/invitations/${invitationId}/gallery`,
      label: t("tabGallery"),
      icon: Camera,
    },
    {
      href: `/app/invitations/${invitationId}/custom-design`,
      label: t("tabCustomDesign"),
      icon: Palette,
    },
    {
      href: `/app/invitations/${invitationId}/publish`,
      label: t("tabPublish"),
      icon: CreditCard,
    },
  ];

  return (
    <div className="mb-[var(--space-6)] w-full overflow-x-auto border-b border-[var(--line)]">
      <nav
        aria-label="Invitation sections"
        className="flex min-w-max items-center gap-[var(--space-2)] pb-[var(--space-2)]"
      >
        {tabs.map((tab) => {
          const isActive = pathname === tab.href || pathname.startsWith(tab.href);
          const Icon = tab.icon;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="inline-flex items-center gap-[var(--space-2)] rounded-[var(--radius-md)] px-[var(--space-4)] py-[var(--space-2)] text-[length:var(--text-sm)] font-medium transition-colors focus:outline-none focus:ring-1 focus:ring-[var(--focus)]"
              style={{
                backgroundColor: isActive ? "var(--surface)" : "transparent",
                color: isActive ? "var(--ink)" : "var(--ink-muted)",
                border: isActive ? "1px solid var(--line)" : "1px solid transparent",
                minHeight: "var(--target)",
              }}
            >
              <Icon
                className="h-4 w-4"
                style={{ color: isActive ? "var(--accent)" : "currentColor" }}
                strokeWidth={1.5}
              />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
