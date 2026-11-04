"use client";

import { MessageCircle } from "lucide-react";

export function FloatingWhatsApp() {
  const whatsappNumber = "+94771234567";
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
    "Hello! I am planning a wedding and have a question about Invitation.lk",
  )}`;

  return (
    <aside
      aria-label="WhatsApp quick chat"
      className="fixed bottom-5 right-5 z-40"
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-2.5 rounded-full bg-emerald-600 pl-3 pr-4 py-2.5 text-white shadow-xl hover:bg-emerald-700 transition-all duration-200 hover:scale-105"
        style={{ minHeight: "44px" }}
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20">
          <MessageCircle className="h-4 w-4 fill-white" />
        </div>
        <div className="hidden sm:block text-left">
          <span className="block text-[11px] font-bold leading-tight">Chat with us</span>
          <span className="block text-[9px] text-emerald-100 leading-tight">on WhatsApp</span>
        </div>
      </a>
    </aside>
  );
}
