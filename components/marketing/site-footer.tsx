"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Heart, Mail } from "lucide-react";

export function SiteFooter() {
  const t = useTranslations("footer");
  const locale = useLocale();
  const year = "2026";

  const isSinhala = locale === "si";
  const isTamil = locale === "ta";

  return (
    <footer className="mt-auto bg-[#1a1412] text-stone-300 border-t border-stone-800">
      <div className="mx-auto max-w-6xl px-[var(--space-6)] py-16 md:py-20 md:px-[var(--space-12)]">
        {/* 4-Column Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Column 1: Brand Wordmark & Mission */}
          <div className="lg:col-span-4 space-y-4">
            <Link
              href="/"
              className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-white focus:outline-none"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-600 text-white shadow-sm">
                <Heart className="h-4.5 w-4.5 fill-white text-white" strokeWidth={1.5} />
              </div>
              <span className="font-display tracking-tight text-xl font-bold text-white">
                suba<span className="text-rose-400">.lk</span>
              </span>
            </Link>

            <p className="text-sm text-stone-400 leading-relaxed max-w-sm">
              {isSinhala
                ? "ශ්‍රී ලාංකීය මංගල්‍යයක් සැලසුම් කිරීමට අවශ්‍ය සියල්ල එකම තැනක: සේවා සපයන්නන්, මිල ගණන්, අයවැය සහ ආරාධනා."
                : isTamil
                ? "இலங்கைத் திருமணத்தைத் திட்டமிடத் தேவையான அனைத்தும் ஒரே இடத்தில்: சேவை வழங்குநர்கள், விலைகள், பட்ஜெட் மற்றும் அழைப்பிதழ்கள்."
                : "Everything you need to plan a Sri Lankan wedding in one place: vendors with clear prices, your budget and your invitations."}
            </p>

            <div className="pt-2 flex flex-col gap-2 text-xs text-stone-400">
              <a
                href="mailto:hello@suba.lk"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Mail className="h-4 w-4 text-rose-500" />
                <span>hello@suba.lk</span>
              </a>
            </div>
          </div>

          {/* Column 2: Templates */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">
              {isSinhala ? "ආරාධනා මෝස්තර" : isTamil ? "வார்ப்புருக்கள்" : "Cultural Designs"}
            </h3>
            <ul className="space-y-2.5 text-sm text-stone-400">
              <li>
                <Link href="/templates" className="hover:text-white transition-colors">
                  Kandyan Poruwa Traditional
                </Link>
              </li>
              <li>
                <Link href="/templates" className="hover:text-white transition-colors">
                  Church & Cathedral Elegance
                </Link>
              </li>
              <li>
                <Link href="/templates" className="hover:text-white transition-colors">
                  Hindu Sacred Muhurtham
                </Link>
              </li>
              <li>
                <Link href="/templates" className="hover:text-white transition-colors">
                  Islamic Nikah & Walima
                </Link>
              </li>
              <li>
                <Link href="/templates" className="hover:text-white transition-colors">
                  Modern Botanical Watercolor
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Platform Features */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">
              {isSinhala ? "පහසුකම්" : isTamil ? "அம்சங்கள்" : "Features"}
            </h3>
            <ul className="space-y-2.5 text-sm text-stone-400">
              <li>
                <Link href="/#features" className="hover:text-white transition-colors">
                  WhatsApp 1-Tap Links
                </Link>
              </li>
              <li>
                <Link href="/#features" className="hover:text-white transition-colors">
                  Interactive Seating Plan
                </Link>
              </li>
              <li>
                <Link href="/#features" className="hover:text-white transition-colors">
                  Live Guest Photo Stream
                </Link>
              </li>
              <li>
                <Link href="/#features" className="hover:text-white transition-colors">
                  Entrance QR Easel Poster
                </Link>
              </li>
              <li>
                <Link href="/#features" className="hover:text-white transition-colors">
                  Auspicious Nakath Times
                </Link>
              </li>
              <li>
                <Link href="/#features" className="hover:text-white transition-colors">
                  Headcount & Dietary RSVP
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Support & Trust */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">
              {isSinhala ? "විමසීම් සහ සහය" : "Support"}
            </h3>
            <ul className="space-y-2.5 text-sm text-stone-400">
              <li>
                <Link href="/#pricing" className="hover:text-white transition-colors">
                  Pricing & Plans
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="hover:text-white transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t("terms")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t("privacy")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t("contact")}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <p>
            {t("copyright", { year })} · suba.lk
          </p>
          <p className="flex items-center gap-1.5 text-stone-400">
            <span>Crafted for Sri Lankan celebrations</span>
            <span className="text-rose-500">·</span>
            <span>සුබ මංගලම්</span>
            <span className="text-rose-500">·</span>
            <span>சுப மங்கலம்</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
