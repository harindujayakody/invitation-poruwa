import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wedding Invitations",
  description: "Digital wedding invitations for Sri Lanka",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
