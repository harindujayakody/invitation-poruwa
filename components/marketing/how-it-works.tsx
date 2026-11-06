"use client";

import { useLocale } from "next-intl";
import { Palette, Clock, Send, Users } from "lucide-react";

export function HowItWorks() {
  const locale = useLocale();

  const isSinhala = locale === "si";
  const isTamil = locale === "ta";

  const steps = [
    {
      num: "01",
      icon: Palette,
      title: isSinhala
        ? "ඔබගේ මංගල සැලසුම තෝරන්න"
        : isTamil
        ? "வடிவமைப்பைத் தேர்வு செய்யுங்கள்"
        : "Choose your wedding template",
      desc: isSinhala
        ? "පොරුව චාරිත්‍ර, පල්ලි විවාහ, හින්දු මුහුර්තම් හෝ නිකාහ් උත්සව සඳහා විශේෂයෙන් නිමවූ අව්‍යාජ ශ්‍රී ලාංකික මෝස්තර."
        : isTamil
        ? "பொருவா, தேவாலயம், இந்து முகூர்த்தம் மற்றும் நிக்காஹ் நிகழ்வுகளுக்காக வடிவமைக்கப்பட்ட கலாச்சார வார்ப்புருக்கள்."
        : "Pick from authentic cultural templates crafted for Poruwa rituals, church weddings, Hindu Muhurtham, and receptions.",
    },
    {
      num: "02",
      icon: Clock,
      title: isSinhala
        ? "නම්, ස්ථාන සහ සුබ නැකත් වේලාවන් එක් කරන්න"
        : isTamil
        ? "பெயர்கள், முகூர்த்த நேரம் & நிகழ்விடங்களை உள்ளிடுங்கள்"
        : "Add names, venues & auspicious Nakath times",
      desc: isSinhala
        ? "සුබ නැකැත් වේලාවන්, දෙමව්පියන්ගේ ආශිර්වාද සටහන්, Google Maps ස්ථාන සහ පසුබිම් මංගල වාදන දුරකථන පෙරදසුන සමඟ සකසන්න."
        : isTamil
        ? "சுப முகூர்த்த நேரம், பெற்றோர் வாழ்த்துக்கள், கூகிள் வரைபட வழிகாட்டல் மற்றும் பின்னணி மங்கள இசையை நேரலையாக அமையுங்கள்."
        : "Customize dates, auspicious times, family notes, venue Google Maps, and background ceremonial music with live phone preview.",
    },
    {
      num: "03",
      icon: Send,
      title: isSinhala
        ? "WhatsApp හරහා සෑම අමුත්තෙකුටම පුද්ගලිකව යවන්න"
        : isTamil
        ? "WhatsApp மூலம் தனிப்பயன் இணைப்புகளைப் பகிருங்கள்"
        : "Send personal links on WhatsApp",
      desc: isSinhala
        ? "සෑම අමුත්තෙකුටම 128-bit ආරක්ෂිත සුවිශේෂී සබැඳියක් හිමිවේ. එක් ක්ලික් එකකින් WhatsApp විවෘත වේ — සමූහ (groups) සෑදීමක් අවශ්‍ය නොවේ."
        : isTamil
        ? "ஒவ்வொரு விருந்தினருக்கும் தனிப்பட்ட 128-bit இணைப்பு. வாட்ஸ்அப் மூலம் ஒரு தட்டலில் அனுப்புங்கள் — குழுக்கள் அமைக்கத் தேவையில்லை."
        : "Every guest receives their own 128-bit private link. Tap to send with zero app to install and no chaotic WhatsApp groups.",
    },
    {
      num: "04",
      icon: Users,
      title: isSinhala
        ? "සජීවී RSVP, ආහාර මනාප සහ ආසන කළමනාකරණය කරන්න"
        : isTamil
        ? "நேரடி RSVP, உணவு விருப்பங்கள் & மேசை ஒதுக்கீட்டைப் பெறுங்கள்"
        : "Track live RSVPs & banquet seating",
      desc: isSinhala
        ? "පැමිණෙන සහ නොපැමිණෙන අමුත්තන්, නිර්මාංශ/හලාල් ආහාර අවශ්‍යතා සහ මේස අංක සජීවීව නිරීක්ෂණය කරන්න."
        : isTamil
        ? "வருகை தரும் விருந்தினர் எண்ணிக்கை, சைவ/ஹலால் உணவு விருப்பங்கள் மற்றும் மேசை எண்களை நிகழ்நேரத்தில் அறிந்து கொள்ளுங்கள்."
        : "Track accepted, declined, vegetarian, and halal headcounts in real-time with banquet table assignments.",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-[var(--surface-sunken)] border-b border-[var(--line)]">
      <div className="mx-auto max-w-6xl px-[var(--space-6)] md:px-[var(--space-12)]">
        {/* Section Header */}
        <div className="text-left md:text-center max-w-3xl mx-auto space-y-4">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--ink)]">
            {isSinhala ? "මිනිත්තු කිහිපයකින් ක්‍රියාත්මක වන අයුරු" : isTamil ? "எளிய 4 படிகளில் உங்கள் அழைப்பிதழ்" : "How it works in 4 easy steps"}
          </h2>
          <p className="text-base sm:text-lg text-[var(--ink-muted)] leading-relaxed">
            {isSinhala
              ? "ආරාධනා පත්‍ර සැලසුම් කිරීමේ සිට අමුත්තන් 300+ දෙනෙකුට යැවීම දක්වා විනාඩි 10 කින් සම්පූර්ණ කරගන්න."
              : isTamil
              ? "வடிவமைப்பு முதல் 300+ விருந்தினர்களுக்கு வாட்ஸ்அப்பில் பகிரும் வரை 10 நிமிடங்களில் நிறைவு செய்யலாம்."
              : "Create, preview, and dispatch your wedding invitations to 300+ guests in under 10 minutes."}
          </p>
        </div>

        {/* 2-Column Split: Interactive Steps on Left, Studio Laptop Preview on Right */}
        <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Steps List Column */}
          <div className="lg:col-span-6 space-y-4">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.num}
                  className="rounded-3xl border border-[var(--line)] bg-white p-6 sm:p-7 shadow-xs hover:border-stone-400 hover:shadow-md transition-all flex items-start gap-5"
                >
                  <div className="flex flex-col items-center shrink-0">
                    <span className="font-display text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 rounded-full h-8 w-8 flex items-center justify-center">
                      {step.num}
                    </span>
                  </div>

                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4.5 w-4.5 text-stone-700" strokeWidth={1.75} />
                      <h3 className="font-display text-lg font-bold text-[var(--ink)]">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-sm text-[var(--ink-muted)] leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Studio Laptop / Dashboard Frame Mockup on Right */}
          <div className="lg:col-span-6">
            <div className="rounded-3xl border border-stone-300 bg-white shadow-xl overflow-hidden">
              {/* Window Titlebar */}
              <div className="bg-stone-100 border-b border-stone-200 px-5 py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-red-400 inline-block" />
                  <span className="h-3 w-3 rounded-full bg-amber-400 inline-block" />
                  <span className="h-3 w-3 rounded-full bg-emerald-400 inline-block" />
                  <span className="text-xs text-stone-500 font-mono ml-2">suba.lk/app/editor</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Live Preview
                </div>
              </div>

              {/* Mockup Dashboard Content */}
              <div className="p-6 bg-[#faf8f5] grid grid-cols-1 sm:grid-cols-12 gap-4">
                {/* Form fields mockup on left */}
                <div className="sm:col-span-7 space-y-3">
                  <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-2">
                    <span className="text-[10px] uppercase font-bold text-stone-500 block">Couple Names</span>
                    <div className="h-8 bg-stone-50 border border-stone-200 rounded-lg px-3 flex items-center text-xs font-semibold text-stone-800">
                      Dulhani & Nimesh
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-2">
                    <span className="text-[10px] uppercase font-bold text-stone-500 block">Auspicious Poruwa Nakath</span>
                    <div className="h-8 bg-stone-50 border border-stone-200 rounded-lg px-3 flex items-center justify-between text-xs text-stone-800 font-medium">
                      <span>09:42 AM · Magul Bera</span>
                      <span className="text-rose-600 text-[10px] font-bold">Confirmed</span>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-2">
                    <span className="text-[10px] uppercase font-bold text-stone-500 block">Venue & Location</span>
                    <div className="h-8 bg-stone-50 border border-stone-200 rounded-lg px-3 flex items-center text-xs text-stone-700">
                      The Kingsbury Hotel, Colombo
                    </div>
                  </div>

                  <div className="pt-2">
                    <div className="w-full bg-rose-600 text-white rounded-full py-2.5 px-4 text-xs font-bold text-center shadow-xs">
                      Send to 320 Guests on WhatsApp
                    </div>
                  </div>
                </div>

                {/* Live mini phone card on right */}
                <div className="sm:col-span-5 flex justify-center">
                  <div className="w-[170px] bg-[#fcf9f2] rounded-2xl border-2 border-stone-800 shadow-md p-3 flex flex-col justify-between text-center relative overflow-hidden">
                    <div className="w-8 h-1 bg-stone-800 rounded-full mx-auto mb-2" />
                    
                    <div className="space-y-1 py-4">
                      <span className="text-[9px] text-amber-700 font-bold uppercase block tracking-wider">ආරාධනයයි</span>
                      <h4 className="font-display text-sm font-bold text-stone-900">දුල්හානි & නිමේෂ්</h4>
                      <p className="text-[9px] text-stone-500">2026 දෙසැම්බර් 21</p>
                      <div className="pt-2">
                        <span className="inline-block bg-rose-100 text-rose-700 text-[9px] font-bold px-2 py-0.5 rounded-full">
                          නැකත: 09:42 AM
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-stone-200 pt-2 text-[9px] text-stone-600 font-medium">
                      The Kingsbury · Colombo
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
