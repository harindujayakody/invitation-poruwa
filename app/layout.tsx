import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "suba.lk — Digital Wedding Invitations for Sri Lanka",
  description: "Create elegant digital wedding invitations with Sinhala, Tamil, and English typography, WhatsApp RSVPs, Auspicious Nakath timings, and seating plans.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
