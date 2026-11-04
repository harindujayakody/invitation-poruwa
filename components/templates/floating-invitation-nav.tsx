"use client";

import { Home, Calendar, Camera, MapPin, MailCheck } from "lucide-react";

interface FloatingInvitationNavProps {
  activeSection?: string;
  onNavigate?: (sectionId: string) => void;
  accentColor?: string;
}

export function FloatingInvitationNav({
  activeSection = "home",
  onNavigate,
}: FloatingInvitationNavProps) {
  const items = [
    { id: "home", label: "Home", icon: Home },
    { id: "events", label: "Events", icon: Calendar },
    { id: "gallery", label: "Gallery", icon: Camera },
    { id: "venue", label: "Venue", icon: MapPin },
    { id: "rsvp", label: "RSVP", icon: MailCheck },
  ];

  const handleClick = (id: string) => {
    if (onNavigate) {
      onNavigate(id);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <nav
      aria-label="Invitation navigation"
      className="sticky bottom-3 z-30 mx-auto flex items-center justify-center gap-1.5 rounded-full border border-amber-900/10 bg-amber-50/85 px-3 py-1.5 backdrop-blur-md shadow-lg"
      style={{
        maxWidth: "fit-content",
        boxShadow: "0 8px 24px -4px rgba(180, 83, 9, 0.15)",
      }}
    >
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeSection === item.id;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => handleClick(item.id)}
            title={item.label}
            aria-label={item.label}
            className={`flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200 ${
              isActive
                ? "bg-amber-700 text-white shadow-sm scale-105"
                : "text-amber-900/70 hover:bg-amber-200/60 hover:text-amber-950"
            }`}
          >
            <Icon className="h-4 w-4" strokeWidth={1.75} />
          </button>
        );
      })}
    </nav>
  );
}
