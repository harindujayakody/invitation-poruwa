export interface CulturalTemplate {
  id: string;
  category: "traditional" | "church" | "hindu" | "muslim" | "modern";
  name: {
    en: string;
    si: string;
    ta: string;
  };
  description: {
    en: string;
    si: string;
    ta: string;
  };
  accentColor: string;
  surfaceColor: string;
  inkColor: string;
  fontClass: string;
  defaultEvents: {
    en: Array<{ title: string; venue: string; notes?: string }>;
    si: Array<{ title: string; venue: string; notes?: string }>;
    ta: Array<{ title: string; venue: string; notes?: string }>;
  };
}

export const CULTURAL_TEMPLATES: CulturalTemplate[] = [
  {
    id: "poruwa-traditional",
    category: "traditional",
    name: {
      en: "Poruwa Traditional",
      si: "පොරුව චාරිත්‍ර",
      ta: "பொருவா பாரம்பரியம்",
    },
    description: {
      en: "Traditional Sri Lankan wedding with auspicious nakath times and Poruwa ceremony details.",
      si: "නැකත් වේලාවන් සහ පොරුව චාරිත්‍ර සඳහා විශේෂිත සාම්ප්‍රදායික ආරාධනය.",
      ta: "சுப நேரங்கள் மற்றும் பொருவா சடங்குகளுடன் கூடிய பாரம்பரிய அழைப்பிதழ்.",
    },
    accentColor: "oklch(0.42 0.12 25)", // Terracotta Clay
    surfaceColor: "oklch(0.985 0.008 85)", // Warm Cream
    inkColor: "oklch(0.18 0.01 45)",
    fontClass: "font-display",
    defaultEvents: {
      en: [
        { title: "Poruwa Ceremony", venue: "The Grand Ballroom, Colombo", notes: "Nakath time: 09:42 AM" },
        { title: "Wedding Reception", venue: "The Grand Ballroom, Colombo", notes: "Lunch and celebrations" },
      ],
      si: [
        { title: "පොරුව චාරිත්‍රය", venue: "ග්‍රෑන්ඩ් බෝල්රූම්, කොළඹ", notes: "සුබ නැකත: පෙ.ව. 09:42 ට" },
        { title: "විවාහ මංගල භෝජන සංග්‍රහය", venue: "ග්‍රෑන්ඩ් බෝල්රූම්, කොළඹ", notes: "දිවා භෝජන සංග්‍රහය සහ සුබපැතුම්" },
      ],
      ta: [
        { title: "பொருவா சடங்கு", venue: "தி கிராண்ட் பால்ரூம், கொழும்பு", notes: "சுப நேரம்: மு.ப. 09:42" },
        { title: "திருமண வரவேற்பு", venue: "தி கிராண்ட் பால்ரூம், கொழும்பு", notes: "மதிய உணவு மற்றும் கொண்டாட்டம்" },
      ],
    },
  },
  {
    id: "church-elegance",
    category: "church",
    name: {
      en: "Church & Cathedral Elegance",
      si: "දේවස්ථාන ගෞරවය",
      ta: "தேவாலய பாரம்பரியம்",
    },
    description: {
      en: "Classic editorial layout for solemn church vows and evening reception celebrations.",
      si: "දේවස්ථාන විවාහ ගිවිසුම සහ සන්ධ්‍යා පිළිගැනීමේ උත්සවය සඳහා සම්භාව්‍ය ආරාධනය.",
      ta: "தேவாலய திருமண வாக்குறுதிகள் மற்றும் மாலை வரவேற்பிற்கான அமைதியான வடிவமைப்பு.",
    },
    accentColor: "oklch(0.35 0.08 240)", // Deep Navy Slate
    surfaceColor: "oklch(0.99 0.004 90)", // Ivory
    inkColor: "oklch(0.16 0.01 240)",
    fontClass: "font-display",
    defaultEvents: {
      en: [
        { title: "Holy Matrimony Service", venue: "St. Thomas' Cathedral", notes: "Service commences at 3:00 PM" },
        { title: "Evening Reception", venue: "Galle Face Hotel, Colombo", notes: "Cocktails and dinner from 6:30 PM" },
      ],
      si: [
        { title: "ශුද්ධ වූ විවාහ දේව මෙහෙය", venue: "ශාන්ත තෝමස් දෙව්මැදුර", notes: "ප.ව. 3:00 ට ආරම්භ වේ" },
        { title: "සන්ධ්‍යා පිළිගැනීමේ උත්සවය", venue: "ගෝල් ෆේස් හෝටලය, කොළඹ", notes: "ප.ව. 6:30 සිට රාත්‍රී භෝජනය" },
      ],
      ta: [
        { title: "திருமண ஆராதனை", venue: "புனித தோமையார் பேராலயம்", notes: "பி.ப. 3:00 மணிக்கு தொடங்குகிறது" },
        { title: "மாலை வரவேற்பு", venue: "காலி முக ஹோட்டல், கொழும்பு", notes: "பி.ப. 6:30 முதல் இரவு விருந்து" },
      ],
    },
  },
  {
    id: "hindu-traditional",
    category: "hindu",
    name: {
      en: "Tamil Hindu Muhurtham",
      si: "හින්දු මුහුර්තම්",
      ta: "ஹிந்து பாரம்பரிய முகூர்த்தம்",
    },
    description: {
      en: "Auspicious Tamil Hindu wedding invitation with Muhurtham and Thaali ceremony.",
      si: "සුබ මුහුර්තම් සහ තාලි චාරිත්‍ර සහිත හින්දු විවාහ ආරාධනය.",
      ta: "சுப முகூர்த்தம் மற்றும் தாலி தாரண சடங்குகளுடன் கூடிய மங்களகரமான அழைப்பிதழ்.",
    },
    accentColor: "oklch(0.38 0.15 20)", // Deep Crimson Maroon
    surfaceColor: "oklch(0.985 0.01 75)", // Warm Sandalwood
    inkColor: "oklch(0.18 0.02 25)",
    fontClass: "font-display",
    defaultEvents: {
      en: [
        { title: "Subha Muhurtham & Kanyadanam", venue: "Sri Ponnambalavaneswarar Temple Hall", notes: "Muhurtham: 08:30 AM – 10:00 AM" },
        { title: "Wedding Luncheon", venue: "Temple Banquet Hall", notes: "Traditional vegetarian feast" },
      ],
      si: [
        { title: "සුභ මුහුර්තම් සහ කන්‍යාදානම", venue: "ශ්‍රී පොන්නම්බලවානේශ්වරර් ශාලාව", notes: "මුහුර්තම්: පෙ.ව. 08:30 – 10:00" },
        { title: "විවාහ දිවා භෝජනය", venue: "සම්ප්‍රදායික ශාලාව", notes: "සාම්ප්‍රදායික නිර්මාංශ භෝජන සංග්‍රහය" },
      ],
      ta: [
        { title: "சுப முகூர்த்தம் & கன்னிகாதானம்", venue: "ஸ்ரீ பொன்னம்பலவாணேஸ்வரர் மண்டபம்", notes: "முகூர்த்த நேரம்: மு.ப. 08:30 – 10:00" },
        { title: "திருமண விருந்து", venue: "மண்டப விருந்து மண்டபம்", notes: "பாரம்பரிய அறுசுவை சைவ உணவு" },
      ],
    },
  },
  {
    id: "nikah-elegance",
    category: "muslim",
    name: {
      en: "Islamic Nikah & Walima",
      si: "ඉස්ලාමීය නිකාහ් සහ වලීමා",
      ta: "இஸ்லாமிய நிக்காஹ் & வலீமா",
    },
    description: {
      en: "Refined aesthetic for Nikah ceremony followed by Walima banquet.",
      si: "නිකාහ් චාරිත්‍රය සහ වලීමා භෝජන සංග්‍රහය සඳහා විශේෂිත උත්සව ආරාධනය.",
      ta: "நிக்காஹ் மற்றும் வலீமா விருந்துக்கான நேர்த்தியான வடிவமைப்பு.",
    },
    accentColor: "oklch(0.36 0.10 160)", // Deep Emerald Green
    surfaceColor: "oklch(0.985 0.006 95)", // Champagne Tint
    inkColor: "oklch(0.16 0.02 160)",
    fontClass: "font-display",
    defaultEvents: {
      en: [
        { title: "Nikah Ceremony", venue: "Dawatagaha Mosque, Colombo", notes: "Immediately after Asr prayers" },
        { title: "Walima Banquet", venue: "Cinnamon Grand, Colombo", notes: "Dinner from 7:30 PM onwards" },
      ],
      si: [
        { title: "නිකාහ් උත්සවය", venue: "දවටගහ පල්ලිය, කොළඹ", notes: "අසර් යාඥාවෙන් පසුව" },
        { title: "වලීමා භෝජන සංග්‍රහය", venue: "සිනමන් ග්‍රෑන්ඩ්, කොළඹ", notes: "ප.ව. 7:30 සිට රාත්‍රී භෝජනය" },
      ],
      ta: [
        { title: "நிக்காஹ் சடங்கு", venue: "தவடகஹா பள்ளிவாசல், கொழும்பு", notes: "அஸர் தொழுகைக்குப் பின்" },
        { title: "வலீமா விருந்து", venue: "சின்னமன் கிராண்ட், கொழும்பு", notes: "இரவு 7:30 மணி முதல்" },
      ],
    },
  },
  {
    id: "botanical-ceylon",
    category: "modern",
    name: {
      en: "Tropical Ceylon Garden",
      si: "ලංකා උද්භිද උද්‍යාන",
      ta: "வெப்பமண்டல இலங்கை தோட்டம்",
    },
    description: {
      en: "Lush tropical minimalism with cinnamon, lotus, and monstera botanical aesthetics.",
      si: "නෙළුම් සහ කුරුඳු පත්‍ර ආභාෂය සහිත එළිමහන් උද්‍යාන විවාහ ආරාධනය.",
      ta: "தாமரை மற்றும் இலவங்க இலைகளுடன் கூடிய வெளிப்புற தோட்ட திருமண அழைப்பிதழ்.",
    },
    accentColor: "oklch(0.40 0.10 135)", // Botanical Sage
    surfaceColor: "oklch(0.985 0.01 100)", // Sand Linen
    inkColor: "oklch(0.18 0.01 135)",
    fontClass: "font-display",
    defaultEvents: {
      en: [
        { title: "Garden Vows & Ceremony", venue: "Brief Garden by Bevis Bawa, Bentota", notes: "Sunset ceremony at 4:30 PM" },
        { title: "Dinner Under the Stars", venue: "The Lawn, Brief Garden", notes: "Music, toasts & dinner" },
      ],
      si: [
        { title: "උද්‍යාන විවාහ පොරොන්දුව", venue: "බ්‍රීෆ් ගාඩන්, බෙන්තොට", notes: "සන්ධ්‍යා උත්සවය ප.ව. 4:30 ට" },
        { title: "රාත්‍රී භෝජන සංග්‍රහය", venue: "ප්‍රධාන තණතිල්ල, බෙන්තොට", notes: "සංගීතය සහ භෝජනය" },
      ],
      ta: [
        { title: "தோட்டத் திருமண சடங்கு", venue: "ப்ரீஃப் கார்டன், பெந்தோட்டை", notes: "மாலை 4:30 மணிக்கு" },
        { title: "இரவு விருந்து", venue: "முற்றவெளி மைதானம், பெந்தோட்டை", notes: "இசை மற்றும் இரவு விருந்து" },
      ],
    },
  },
  {
    id: "galle-heritage",
    category: "modern",
    name: {
      en: "Galle Fort Heritage",
      si: "ගාල්ල කොටුව උරුමය",
      ta: "காலி கோட்டை பாரம்பரியம்",
    },
    description: {
      en: "Timeless architectural elegance inspired by historic ramparts and colonial arches.",
      si: "ඓතිහාසික ගාලු කොටුවේ ගෘහ නිර්මාණ ආභාෂය සහිත අභිමානවත් ආරාධනය.",
      ta: "வரலாற்று சிறப்புமிக்க காலி கோட்டையின் அழகுடன் கூடிய அழைப்பிதழ்.",
    },
    accentColor: "oklch(0.36 0.11 250)", // Coastal Indigo
    surfaceColor: "oklch(0.988 0.005 80)", // Antique Parchment
    inkColor: "oklch(0.18 0.01 250)",
    fontClass: "font-display",
    defaultEvents: {
      en: [
        { title: "Wedding Ceremony", venue: "The Ramparts, Galle Fort", notes: "Ocean view ceremony at 4:00 PM" },
        { title: "Heritage Reception", venue: "Amangalla Ballroom, Galle", notes: "Dinner and dancing" },
      ],
      si: [
        { title: "විවාහ උත්සවය", venue: "කොටු පවුර, ගාල්ල", notes: "මුහුදු තීරයේ ප.ව. 4:00 ට" },
        { title: "උරුම පිළිගැනීමේ සාදය", venue: "අමන්ගල්ල ශාලාව, ගාල්ල", notes: "රාත්‍රී භෝජනය සහ සංගීතය" },
      ],
      ta: [
        { title: "திருமண சடங்கு", venue: "காலி கோட்டை முகப்பு", notes: "கடற்கரை காட்சியில் மாலை 4:00 மணிக்கு" },
        { title: "பாரம்பரிய வரவேற்பு", venue: "அமங்கல்லா அரங்கம், காலி", notes: "இரவு விருந்து மற்றும் இசை" },
      ],
    },
  },
  {
    id: "minimal-ivory",
    category: "modern",
    name: {
      en: "Modern Editorial Ivory",
      si: "නවීන සරල අලංකාරය",
      ta: "நவீன எளிய நேர்த்தி",
    },
    description: {
      en: "High-contrast editorial serif, generous whitespace, and pure minimalist typography.",
      si: "ඉහළ අලංකාරයක් සහිත සරල නවීන මුද්‍රිත පන්නයේ ආරාධනය.",
      ta: "எழுத்துகளின் நேர்த்தியுடன் கூடிய நவீன எளிய வடிவமைப்பு.",
    },
    accentColor: "oklch(0.25 0.02 50)", // Carbon Black
    surfaceColor: "oklch(0.99 0.003 90)", // Ivory Paper
    inkColor: "oklch(0.15 0.01 50)",
    fontClass: "font-display",
    defaultEvents: {
      en: [
        { title: "Marriage Ceremony", venue: "Waters Edge, Battaramulla", notes: "Guest arrival from 10:00 AM" },
        { title: "Luncheon Reception", venue: "The Grand Lawn, Waters Edge", notes: "Lunch and celebrations" },
      ],
      si: [
        { title: "විවාහ චාරිත්‍රය", venue: "වෝටර්ස් එජ්, බත්තරමුල්ල", notes: "පෙ.ව. 10:00 ට අමුත්තන් පැමිණීම" },
        { title: "දිවා භෝජන සංග්‍රහය", venue: "ප්‍රධාන තණතිල්ල, වෝටර්ස් එජ්", notes: "දිවා ආහාරය සහ සැමරුම්" },
      ],
      ta: [
        { title: "திருமண விழா", venue: "வாட்டர்ஸ் எட்ஜ், பத்தரமுல்ல", notes: "மு.ப. 10:00 மணி முதல் விருந்தினர் வருகை" },
        { title: "மதிய உணவு வரவேற்பு", venue: "பிரதான புல்வெளி மைதானம்", notes: "மதிய உணவு மற்றும் கொண்டாட்டம்" },
      ],
    },
  },
  {
    id: "reception-night",
    category: "traditional",
    name: {
      en: "Homecoming & Evening Gala",
      si: "දෙවන ගමන (Homecoming)",
      ta: "மறுவீடு அழைப்பு (Homecoming)",
    },
    description: {
      en: "Sleek evening ambiance designed specifically for Homecoming and ballroom receptions.",
      si: "දෙවන ගමන (Homecoming) සහ හෝටල් උත්සව ශාලා සාද සඳහාම නිර්මාණය කළ ආරාධනය.",
      ta: "மறுவீடு விருந்து மற்றும் மாலை வரவேற்பிற்கான சிறப்பு வடிவமைப்பு.",
    },
    accentColor: "oklch(0.48 0.14 70)", // Warm Champagne Gold
    surfaceColor: "oklch(0.985 0.008 85)", // Warm Pearl
    inkColor: "oklch(0.18 0.01 50)",
    fontClass: "font-display",
    defaultEvents: {
      en: [
        { title: "Homecoming Reception", venue: "Shangri-La Ballroom, Colombo", notes: "Reception begins at 7:00 PM" },
      ],
      si: [
        { title: "දෙවන ගමන පිළිගැනීමේ සාදය", venue: "ෂැංග්‍රි-ලා හෝටලය, කොළඹ", notes: "ප.ව. 7:00 ට ආරම්භ වේ" },
      ],
      ta: [
        { title: "மறுவீடு வரவேற்பு விழா", venue: "சாங்ரி-லா அரங்கம், கொழும்பு", notes: "மாலை 7:00 மணிக்கு தொடங்குகிறது" },
      ],
    },
  },
];

export function getTemplateById(id: string): CulturalTemplate {
  return CULTURAL_TEMPLATES.find((t) => t.id === id) || CULTURAL_TEMPLATES[0];
}
