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
    <div className="mb-8 w-full overflow-x-auto scrollbar-none pb-2">
      <nav
        aria-label="Invitation sections"
        className="inline-flex min-w-max items-center gap-1.5 rounded-2xl bg-stone-100 p-1.5 border border-stone-200/90 shadow-inner"
      >
        {tabs.map((tab) => {
          const isActive = pathname === tab.href || pathname.startsWith(tab.href);
          const Icon = tab.icon;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all min-h-[40px] ${
                isActive
                  ? "bg-white text-stone-900 shadow-sm border border-stone-200/80"
                  : "text-stone-600 hover:text-stone-900 hover:bg-white/60 border border-transparent"
              }`}
            >
              <Icon
                className={`h-4 w-4 ${isActive ? "text-rose-600" : "text-stone-500"}`}
                strokeWidth={isActive ? 2 : 1.75}
              />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
