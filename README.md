# Sri Lankan Digital Wedding Invitation Platform

> **An award-winning, culturally authentic digital wedding invitation platform built specifically for Sri Lankan couples.**  
> Create a custom wedding invitation website, send each guest a personalized WhatsApp link, track RSVPs per event, organize banquet seating, and project a live photo stream on your wedding day.

[![Next.js 16](https://img.shields.io/badge/Next.js-16_App_Router-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript Strict](https://img.shields.io/badge/TypeScript-5.8_Strict-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4_OKLCH-38bdf8?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-PostgreSQL_17-c5f015?style=flat&logo=postgresql)](https://orm.drizzle.team/)
[![E2E Tests](https://img.shields.io/badge/Playwright-87%2F87_Passed-green?style=flat&logo=playwright)](https://playwright.dev/)
[![i18n](https://img.shields.io/badge/i18n-Sinhala_%7C_Tamil_%7C_English-rose?style=flat)](https://next-intl.dev/)

---

## 1. What We Used (Tech Stack)

The architecture is built from the ground up on modern web primitives prioritizing **instant load times over mobile 4G (< 2s)**, strict **type safety**, and a **guest bundle under 150 KB gzipped**:

| Domain | Technology | Implementation Detail |
|---|---|---|
| **Core Framework** | **Next.js 16 (App Router)** | Full React Server Components (RSC) architecture with Server Actions for authenticated mutations and View Transitions for smooth page transitions. |
| **Language** | **TypeScript 5.8 (Strict)** | Zero `any` policy with shared Zod schema validation between database records and UI forms. |
| **Styling & Tokens** | **Tailwind CSS v4 + OKLCH** | 100% token-driven design system via `styles/tokens.css` with no hardcoded inline colors or arbitrary values. |
| **Database & ORM** | **PostgreSQL 17 + Drizzle ORM** | Relational schema with JSONB support, owner-scoped queries, and row-level isolation hosted on Supabase. |
| **Authentication** | **Better Auth / Cookie Sessions** | HttpOnly, SameSite=Lax session management with Argon2id password hashing and owner-scoped data isolation. |
| **Payments** | **PayHere Sri Lanka** | Automated payment gateway checkout supporting LKR card payments, mobile wallets, and server-side MD5 signature hash validation. |
| **Internationalization** | **`next-intl`** | Tri-lingual routing supporting Sinhala (`si`), Tamil (`ta`), and English (`en`) with culturally accurate typography. |
| **Audio Synthesis** | **Web Audio API** | Lightweight procedural audio synthesizer creating ceremonial wedding flute melodies in real time (< 2 KB code, 0 MB audio downloads). |
| **Testing Suite** | **Playwright + Vitest** | 18 unit tests for crypto and phone validation + 87 Playwright E2E tests across 3 screen sizes (360px, 768px, 1280px) and 2 languages. |

---

## 2. What Design We Used (The Impeccable Design System)

The design honors **Sri Lankan cultural craft** rather than generic modern AI-startup tropes. Built following the `/impeccable` design principles:

### Traditional Sri Lankan Poruwa Theme
- **Warm Ivory Parchment**: Recalling traditional handmade invitation paper (`#fcf9f2` / `oklch(0.985 0.015 85)`).
- **Sandakada Pahana (Moonstone Mandala)**: Intricate SVG vector half-circle arc with sacred lotus petals (*Piyum*) and golden radial gradient.
- **Ceremonial Calligraphy**: Dedicated display typography for auspicious blessings (*"ආදර ආරාධනයයි !"* / *"அன்பான அழைப்பிதழ் !"*).
- **Kandyan Bridal Couple**: Authentic illustration of bride in traditional embroidered *Osari* with head jewelry and groom in *Kandyan Nilame* Mul Anduma regalia.
- **Floating Frosted Navigation Dock**: Quick access to Home, Events/Nakath, Photo Gallery, Google Maps directions, and RSVP.
- **Ceremonial Wedding Flute Synthesis**: Auspicious pentatonic wedding flute melody played via native Web Audio API oscillators.

### Strict Design Quality Floor
- **No Pill Badges Above Headlines**: Headings carry their own weight without decorative eyebrow badges.
- **No Sparkles, Wands, or Gradients on Text**: High-contrast, legible typography readable under direct Sri Lankan sunlight.
- **Mobile-First Standard**: Designed at **360px width first**; touch targets strictly **$\ge 44\times 44$ px**.
- **Multi-Script Typography Rules**: `lang` attribute set on all Sinhala/Tamil nodes, line-height $\ge 1.7$, no faux italic/bold, and zero letter-spacing.

---

## 3. Core Capabilities & Product Features

### For the Couple
- **Interactive Live Preview Editor**: Real-time customization of names, parental blessings, event schedules (Poruwa, Reception, Homecoming), and story quotes.
- **Guest List & CSV Import**: Add guests manually or import spreadsheets; validates and normalizes Sri Lankan phone numbers to `+94` E.164.
- **Personalized WhatsApp Links**: Send individual 128-bit secure guest links with one tap via `wa.me` links — no group chats, no app download.
- **Real-Time RSVP Telemetry**: Live dashboard tracking attending, declined, and pending headcounts with dietary requirements (Vegetarian, Halal, Allergies).
- **Interactive Banquet Seating Planner**: Drag-and-drop banquet table arrangement canvas with live capacity meters and side assignment (Bride / Groom).
- **Reception Entrance QR Easel**: High-resolution print-ready welcome sign generator with a 2-second table lookup QR code for venue entrances.
- **Live Guest Photo Stream Moderation**: Review and approve candid guest photos in real time before projecting them onto reception screens.
- **WhatsApp Delivery Tracking & Reminders**: Track which guests opened their link, with 1-click automated reminders for pending RSVPs.
- **Custom Design Concierge**: Submit custom design requests with hand-drawn sketches directly to Colombo artisan designers.

### For the Guest
- **Frictionless Experience**: Instant mobile load (< 2s) with personalized greetings (*"Mr. & Mrs. Perera"*).
- **Multi-Event RSVP**: Respond separately to Poruwa, Church ceremony, Reception lunch, or Homecoming.
- **Nakath Times & Venue Directions**: Countdown timer to auspicious wedding moments with one-tap Google Maps and Uber integration.
- **Guest Table Finder**: Arriving guests search their name to view their exact table and seat in 2 seconds.
- **Direct Candid Photo Upload**: Snap photos directly from the mobile browser to upload to the wedding memory wall.

---

## 4. System Architecture

```
app/[locale]/
├── page.tsx                     (Marketing landing page with iPhone 16 Pro split hero)
├── (auth)/
│   └── login/page.tsx           (Couple authentication & session management)
├── app/
│   ├── page.tsx                 (Couple master dashboard & status telemetry)
│   └── invitations/[id]/
│       ├── edit/page.tsx        (Live preview cultural invitation editor)
│       ├── guests/page.tsx      (Guest list management & WhatsApp click-to-send)
│       ├── rsvp/page.tsx        (Real-time headcount & dietary telemetry)
│       ├── seating/page.tsx     (Interactive banquet table canvas & assignment)
│       ├── gallery/page.tsx     (Live photo uploads & couple moderation stream)
│       ├── reminders/page.tsx   (WhatsApp delivery tracking & automated reminders)
│       ├── entrance-sign/       (Print-ready reception entrance QR sign easel)
│       └── checkout/page.tsx    (PayHere payment gateway publishing gate)
├── i/[slug]/
│   ├── page.tsx                 (Personalized guest invitation view)
│   └── tables/page.tsx          (Reception entrance 2-second table finder)
└── api/
    └── webhooks/
        └── payhere/route.ts     (PayHere MD5 verified idempotent webhook handler)
```

For comprehensive technical specifications, database schema diagrams, and security protocols, see [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).  
For the complete design system token guide, see [`DESIGN.md`](DESIGN.md).

---

## 5. Getting Started (Local Development)

### Prerequisites
- Node.js 20+ (LTS)
- PostgreSQL 17 (or Supabase instance)
- npm or pnpm

### 1. Clone the repository
```bash
git clone https://github.com/harindujayakody/invitation-poruwa.git
cd invitation-poruwa
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env.local` and configure your credentials:
```bash
cp .env.example .env.local
```
Fill in your database URL and payment credentials:
```env
APP_URL=http://localhost:3000
DATABASE_URL=postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres

# Auth Secret
AUTH_SECRET=your-32-byte-secret-key-here

# PayHere Sri Lanka Credentials
PAYHERE_MERCHANT_ID=your_merchant_id
PAYHERE_MERCHANT_SECRET=your_merchant_secret

# Object Storage (Cloudflare R2 or S3)
STORAGE_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
STORAGE_BUCKET=wedding-photos
STORAGE_ACCESS_KEY_ID=your_access_key
STORAGE_SECRET_ACCESS_KEY=your_secret_key
```

### 4. Push Database Schema
```bash
npm run db:push
```

### 5. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000/si](http://localhost:3000/si) or [http://localhost:3000/en](http://localhost:3000/en) to view the application.

---

## 6. Testing & Quality Verification

### Run Unit Tests (Vitest)
Executes unit tests for phone normalizers, WhatsApp message builders, and PayHere signature generation:
```bash
npm test
```

### Run End-to-End Tests (Playwright)
Runs the full suite of **87 Playwright E2E tests** covering every feature across 3 device viewports (`phone-360`, `tablet-768`, `desktop-1280`) in both Sinhala and English:
```bash
npm run e2e
```

### Static Analysis
```bash
npm run typecheck   # Strict TypeScript checks
npm run lint        # ESLint analysis
```

---

## 7. Production Deployment

1. **Vercel / Next.js Host**: Connect the repository to Vercel. Set build command to `npm run build`.
2. **Database Migrations**: Run `npm run db:push` against your production PostgreSQL instance.
3. **PayHere Webhook Configuration**: Set your PayHere IPN URL to:
   ```
   https://yourdomain.lk/api/webhooks/payhere
   ```
4. **Cloudflare R2 / S3**: Ensure CORS is enabled on the media bucket for wedding photo uploads.

---

## 8. License & Acknowledgments

- **License**: Apache 2.0.
- **Cultural Assets**: Traditional Sandakada Pahana vector vectors and Kandyan bridal illustrations crafted exclusively for this project.
- **Author**: Harindu Jayakody ([@harindujayakody](https://github.com/harindujayakody)).
