import type { ReactNode } from "react";
import {
  Hanken_Grotesk,
  Newsreader,
  Noto_Sans_Sinhala,
  Noto_Serif_Sinhala,
} from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { Toaster } from "@/components/ui/sonner";

const latin = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-latin",
  display: "swap",
});
const latinSerif = Newsreader({
  subsets: ["latin"],
  variable: "--font-latin-serif",
  display: "swap",
});
const sinhala = Noto_Sans_Sinhala({
  subsets: ["sinhala"],
  variable: "--font-sinhala",
  display: "swap",
});
const sinhalaSerif = Noto_Serif_Sinhala({
  subsets: ["sinhala"],
  variable: "--font-sinhala-serif",
  display: "swap",
  preload: false,
});

const fontVars = [
  latin.variable,
  latinSerif.variable,
  sinhala.variable,
  sinhalaSerif.variable,
].join(" ");

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate locale
  if (!routing.locales.includes(locale as typeof routing.locales[number])) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className={fontVars}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
          <Toaster />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
