// Example root layout. Merge into app/layout.tsx.
// Fonts are self-hosted by next/font at build time. Latin faces are placeholders.
import type { ReactNode } from "react";
import { Hanken_Grotesk, Newsreader, Noto_Sans_Sinhala, Noto_Serif_Sinhala } from "next/font/google";

const latin = Hanken_Grotesk({ subsets: ["latin"], variable: "--font-latin", display: "swap" });
const latinSerif = Newsreader({ subsets: ["latin"], variable: "--font-latin-serif", display: "swap" });
const sinhala = Noto_Sans_Sinhala({ subsets: ["sinhala"], variable: "--font-sinhala", display: "swap" });
const sinhalaSerif = Noto_Serif_Sinhala({ subsets: ["sinhala"], variable: "--font-sinhala-serif", display: "swap", preload: false });

export default function RootLayout({ children }: { children: ReactNode }) {
  // Set lang from the active locale (next-intl). "si" shown as a placeholder.
  return (
    <html lang="si" className={`${latin.variable} ${latinSerif.variable} ${sinhala.variable} ${sinhalaSerif.variable}`}>
      <body>{children}</body>
    </html>
  );
}
