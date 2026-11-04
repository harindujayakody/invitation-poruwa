"use client";

import { useLocale } from "next-intl";
import {
  MessageSquare,
  LayoutGrid,
  Camera,
  QrCode,
  CalendarDays,
  Users,
  Check,
  Send,
} from "lucide-react";

export function FeaturesShowcase() {
  const locale = useLocale();

  const isSinhala = locale === "si";
  const isTamil = locale === "ta";

  return (
    <section id="features" className="py-20 md:py-28 bg-[var(--surface)] border-b border-[var(--line)]">
      <div className="mx-auto max-w-6xl px-[var(--space-6)] md:px-[var(--space-12)]">
        {/* Section Header without repetitive red uppercase eyebrow */}
        <div className="text-left md:text-center max-w-3xl mx-auto space-y-4">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--ink)]">
            {isSinhala
              ? "ඔබගේ මංගල දිනයට අවශ්‍ය සියලු පහසුකම් එකම තැනකින්"
              : isTamil
              ? "உங்கள் திருமணத்திற்கு தேவையான அனைத்து நவீன வசதிகளும்"
              : "Everything you need for your wedding day"}
          </h2>
          <p className="text-base sm:text-lg text-[var(--ink-muted)] leading-relaxed">
            {isSinhala
              ? "ශ්‍රී ලාංකික සිරිත් විරිත් ගෞරවයෙන් සුරකිමින්, සති ගණනක් වැයවන වෙහෙසකර රාජකාරි පැය කිහිපයකින් නිමකර ගන්න."
              : isTamil
              ? "இலங்கை கலாச்சார மரபுகளைப் பேணி, வாரக்கணக்கிலான கடினமான பணிகளை இலகுவாக நிறைவு செய்யுங்கள்."
              : "Built specifically for Sri Lankan weddings, honoring traditional customs while saving weeks of manual coordination."}
          </p>
        </div>

        {/* 6 Rich, Visual Feature Cards with Generous Paddings */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Card 1: WhatsApp Click-to-Send Links */}
          <div className="rounded-3xl border border-[var(--line)] bg-white p-7 sm:p-8 shadow-xs hover:border-stone-400 hover:shadow-lg transition-all flex flex-col justify-between">
            <div>
              {/* Mini UI Illustration: WhatsApp Message Bubble */}
              <div className="h-36 rounded-2xl bg-[#efeae2] p-3 flex flex-col justify-center border border-stone-200 shadow-inner">
                <div className="bg-white rounded-xl p-3 shadow-xs space-y-1.5 border border-emerald-900/10">
                  <div className="flex items-center justify-between text-[11px] font-bold text-emerald-800">
                    <span>Kasun &amp; Sanduni&apos;s Wedding</span>
                    <span className="text-[10px] text-stone-600 font-normal">10:42 AM</span>
                  </div>
                  <p className="text-[11px] text-stone-700 leading-tight">
                    Dear Uncle Sunil, we warmly invite you & family to our wedding celebration...
                  </p>
                  <div className="mt-1 bg-stone-100 rounded px-2 py-1 text-[10px] text-emerald-700 font-mono font-medium flex items-center justify-between">
                    <span>suba.lk/i/kasun-sanduni?token=9f8...</span>
                    <Send className="h-2.5 w-2.5 text-emerald-600" />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 border border-rose-100">
                  <MessageSquare className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <span className="rounded-full bg-stone-100 px-3.5 py-1 text-xs font-semibold text-stone-700">
                  Instant Delivery
                </span>
              </div>

              <h3 className="font-display mt-5 text-xl font-bold text-[var(--ink)]">
                {isSinhala ? "WhatsApp ක්ලික් සබැඳි" : "WhatsApp Click-to-Send Links"}
              </h3>
              <p className="mt-2 text-sm text-[var(--ink-muted)] leading-relaxed">
                {isSinhala
                  ? "සෑම අමුත්තෙකුටම 128-bit ආරක්ෂිත සුවිශේෂී සබැඳියක් සමඟ ආචාරශීලී පණිවිඩයක් එක් තට්ටුවකින් WhatsApp හරහා යවන්න."
                  : "Each guest gets their own personalized link with a unique 128-bit token. Send individually with one tap — no app to download and no chaotic WhatsApp group."}
              </p>
            </div>
          </div>

          {/* Card 2: Interactive Seating Plan */}
          <div className="rounded-3xl border border-[var(--line)] bg-white p-7 sm:p-8 shadow-xs hover:border-stone-400 hover:shadow-lg transition-all flex flex-col justify-between">
            <div>
              {/* Mini UI Illustration: Banquet Table Mockup */}
              <div className="h-36 rounded-2xl bg-stone-50 p-3 flex items-center justify-center gap-4 border border-stone-200 shadow-inner">
                <div className="h-20 w-20 rounded-full border-2 border-dashed border-rose-400 bg-white flex flex-col items-center justify-center shadow-xs">
                  <span className="text-[10px] font-bold text-stone-800">Table 01</span>
                  <span className="text-[9px] text-rose-600 font-semibold">Bride Family</span>
                  <span className="text-[9px] text-stone-600 font-medium">8 Seats</span>
                </div>
                <div className="h-20 w-20 rounded-full border-2 border-dashed border-amber-400 bg-white flex flex-col items-center justify-center shadow-xs">
                  <span className="text-[10px] font-bold text-stone-800">Table 02</span>
                  <span className="text-[9px] text-amber-700 font-semibold">Groom Family</span>
                  <span className="text-[9px] text-stone-600 font-medium">8 Seats</span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 border border-rose-100">
                  <LayoutGrid className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <span className="rounded-full bg-stone-100 px-3.5 py-1 text-xs font-semibold text-stone-700">
                  Wedding Day
                </span>
              </div>

              <h3 className="font-display mt-5 text-xl font-bold text-[var(--ink)]">
                {isSinhala ? "අන්තර්ක්‍රියාකාරී ආසන සැලැස්ම" : "Interactive Seating Plan"}
              </h3>
              <p className="mt-2 text-sm text-[var(--ink-muted)] leading-relaxed">
                {isSinhala
                  ? "මංගල භෝජන ශාලාවේ මේස සහ ආසන පහසුවෙන් සැලසුම් කරන්න. අමුත්තන්ට ඔවුන්ගේ නමින් මේස අංකය සෙවිය හැක."
                  : "Drag-and-drop banquet tables, assign guests by bride or groom side, and let guests look up their table number right from their phone."}
              </p>
            </div>
          </div>

          {/* Card 3: Live Guest Photo Gallery */}
          <div className="rounded-3xl border border-[var(--line)] bg-white p-7 sm:p-8 shadow-xs hover:border-stone-400 hover:shadow-lg transition-all flex flex-col justify-between">
            <div>
              {/* Mini UI Illustration: Photo Grid */}
              <div className="h-36 rounded-2xl bg-stone-50 p-2.5 grid grid-cols-3 gap-2 border border-stone-200 shadow-inner">
                <div className="rounded-xl bg-amber-100 flex items-center justify-center text-xs font-bold text-amber-800 border border-amber-200">
                  Poruwa
                </div>
                <div className="rounded-xl bg-rose-100 flex items-center justify-center text-xs font-bold text-rose-800 border border-rose-200">
                  Couple
                </div>
                <div className="rounded-xl bg-stone-200 flex items-center justify-center text-xs font-bold text-stone-800 border border-stone-300">
                  Ballroom
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 border border-rose-100">
                  <Camera className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <span className="rounded-full bg-stone-100 px-3.5 py-1 text-xs font-semibold text-stone-700">
                  Real-time Memories
                </span>
              </div>

              <h3 className="font-display mt-5 text-xl font-bold text-[var(--ink)]">
                {isSinhala ? "සජීවී ඡායාරූප එකතුව" : "Live Guest Photo Gallery"}
              </h3>
              <p className="mt-2 text-sm text-[var(--ink-muted)] leading-relaxed">
                {isSinhala
                  ? "අමුත්තන් ගන්නා සුන්දර ඡායාරූප සජීවීව එක්කළ හැක. යුවළට අනුමත කිරීමෙන් පසු ඒවා ප්‍රදර්ශනය කළ හැක."
                  : "Guests upload candid moments directly from their camera roll. Couple moderation dashboard lets you approve photos before they go live on the wall."}
              </p>
            </div>
          </div>

          {/* Card 4: Reception Entrance QR Easel */}
          <div className="rounded-3xl border border-[var(--line)] bg-white p-7 sm:p-8 shadow-xs hover:border-stone-400 hover:shadow-lg transition-all flex flex-col justify-between">
            <div>
              {/* Mini UI Illustration: QR Easel Poster */}
              <div className="h-36 rounded-2xl bg-amber-50/60 p-3 flex items-center justify-center border border-amber-200 shadow-inner">
                <div className="bg-white px-4 py-2 rounded-xl border border-stone-300 shadow-xs flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-stone-900 flex items-center justify-center text-white">
                    <QrCode className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-stone-500 block">Welcome Easel</span>
                    <span className="text-xs font-bold text-stone-800">Scan for your table</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 border border-rose-100">
                  <QrCode className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <span className="rounded-full bg-stone-100 px-3.5 py-1 text-xs font-semibold text-stone-700">
                  Print Ready
                </span>
              </div>

              <h3 className="font-display mt-5 text-xl font-bold text-[var(--ink)]">
                {isSinhala ? "පිළිගැනීමේ QR පුවරුව" : "Reception Entrance QR Easel"}
              </h3>
              <p className="mt-2 text-sm text-[var(--ink-muted)] leading-relaxed">
                {isSinhala
                  ? "ශාලා පිවිසුම සඳහා A3/A2 ප්‍රමාණයේ මුද්‍රණය කළ හැකි QR පුවරුවක් ක්ෂණිකව බාගත කරගන්න. තත්පර 2කින් මේසය සොයාගත හැක."
                  : "Generate a high-resolution, print-ready QR welcome sign for your venue entrance. Arriving guests scan to see their exact table in 2 seconds."}
              </p>
            </div>
          </div>

          {/* Card 5: Auspicious Nakath Timeline */}
          <div className="rounded-3xl border border-[var(--line)] bg-white p-7 sm:p-8 shadow-xs hover:border-stone-400 hover:shadow-lg transition-all flex flex-col justify-between">
            <div>
              {/* Mini UI Illustration: Nakath Timeline */}
              <div className="h-36 rounded-2xl bg-stone-50 p-3 flex flex-col justify-center space-y-2 border border-stone-200 shadow-inner">
                <div className="bg-white rounded-lg p-2 border border-stone-200 flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-800">පොරුව නැකත: 09:42 AM</span>
                  <span className="text-[10px] bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded">Auspicious</span>
                </div>
                <div className="bg-white rounded-lg p-2 border border-stone-200 flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-800">මංගල භෝජනය: 12:30 PM</span>
                  <span className="text-[10px] text-stone-500">Ballroom</span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 border border-rose-100">
                  <CalendarDays className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <span className="rounded-full bg-stone-100 px-3.5 py-1 text-xs font-semibold text-stone-700">
                  Auspicious Times
                </span>
              </div>

              <h3 className="font-display mt-5 text-xl font-bold text-[var(--ink)]">
                {isSinhala ? "සුබ නැකත් කාලසටහන" : "Multi-Event Ceremony Timeline"}
              </h3>
              <p className="mt-2 text-sm text-[var(--ink-muted)] leading-relaxed">
                {isSinhala
                  ? "පොරුව චාරිත්‍ර, පල්ලි විවාහය, භෝජන සංග්‍රහය සහ දෙවන ගමන (Homecoming) සඳහා නිශ්චිත නැකත් වේලාවන් සහ සිතියම්."
                  : "Dedicated sections for Poruwa ceremony, Church nuptials, Reception lunch, and Homecoming with Nakath countdowns and venue Google Maps."}
              </p>
            </div>
          </div>

          {/* Card 6: Headcount & Dietary RSVP Tracker */}
          <div className="rounded-3xl border border-[var(--line)] bg-white p-7 sm:p-8 shadow-xs hover:border-stone-400 hover:shadow-lg transition-all flex flex-col justify-between">
            <div>
              {/* Mini UI Illustration: RSVP Telemetry */}
              <div className="h-36 rounded-2xl bg-emerald-50/50 p-3.5 flex flex-col justify-center space-y-2 border border-emerald-200 shadow-inner">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-950">
                  <span>RSVP Responses</span>
                  <span>248 / 300</span>
                </div>
                <div className="w-full bg-stone-200 h-2.5 rounded-full overflow-hidden flex">
                  <div className="bg-emerald-600 h-full w-[78%]" />
                  <div className="bg-rose-500 h-full w-[12%]" />
                  <div className="bg-stone-400 h-full w-[10%]" />
                </div>
                <div className="flex justify-between text-[10px] text-stone-600 font-medium">
                  <span className="flex items-center gap-1"><Check className="h-3 w-3 text-emerald-600" /> 194 Attending</span>
                  <span>30 Declined</span>
                  <span>24 Pending</span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 border border-rose-100">
                  <Users className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <span className="rounded-full bg-stone-100 px-3.5 py-1 text-xs font-semibold text-stone-700">
                  Live Telemetry
                </span>
              </div>

              <h3 className="font-display mt-5 text-xl font-bold text-[var(--ink)]">
                {isSinhala ? "RSVP සහ ආහාර මනාප වාර්තාව" : "Headcount & Dietary RSVP Tracker"}
              </h3>
              <p className="mt-2 text-sm text-[var(--ink-muted)] leading-relaxed">
                {isSinhala
                  ? "පැමිණෙන සංඛ්‍යාව, නිර්මාංශ සහ හලාල් ආහාර අවශ්‍යතා තත්‍ය කාලීනව ලබාගෙන හෝටලයට CSV ලැයිස්තුවක් ලෙස භාරදෙන්න."
                  : "Track accepted, declined, and pending responses in real time. Filter by vegetarian, halal, or allergy requirements and export catering CSVs."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
