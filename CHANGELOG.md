# Changelog

All notable changes to the Sri Lankan Digital Wedding Invitation Platform are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-11-04

### Added

#### Cultural Wedding Invitation Theme Redesign (Impeccable Craft)
- **Sandakada Pahana (Moonstone Mandala)**: Crafted an intricate SVG vector moonstone arc featuring concentric lotus petals (*Piyum*) and traditional wave motifs with a golden radial gradient.
- **Kandyan Bridal Regalia Illustration**: Feathered transparent illustration of a Sri Lankan couple in traditional Kandyan Nilame and Osari ceremonial attire.
- **Procedural Web Audio Flute Synthesizer**: Built a lightweight Web Audio API synthesizer that plays an auspicious Sri Lankan pentatonic flute melody without loading heavy MP3 assets.
- **Floating Invitation Navigation Dock**: Added a frosted-glass bottom dock with 5 quick-action icons (Home, Events/Nakath, Photo Gallery, Google Maps Location, and RSVP).
- **Localized Parental Blessings**: Added two-column ceremonial layout for parents' blessings with native Sinhala (*මනාල පාර්ශ්වය*, *මනාලියගේ පාර්ශ්වය*), Tamil (*மணமகன் வீட்டார்*, *மணமகள் வீட்டார்*), and English labels.

#### High-Conversion Marketing Platform (INVITATION.LK Alignment)
- **Split Hero with iPhone 16 Pro Mockup**: Built a photorealistic iPhone chassis with titanium bevel, Dynamic Island, status bar, and live interactive invitation preview.
- **Cultural Designs Carousel**: Added a horizontal scrollable showcase of 8 cultural templates (Poruwa, Kandyan, Temple Lotus, Southern Coast, Christian, Muhurtham, Nikah, and Royal Maroon).
- **Interactive "How It Works" Flow**: 4-step walkthrough with visual status dots and an embedded studio tablet mockup.
- **Comprehensive Feature Showcase**: 6 signature mobile screen cards highlighting WhatsApp links, banquet seating, photo streams, entrance QR easels, Nakath timelines, and dietary RSVP tracking.
- **Printed vs. Digital Cost Calculator**: Visual comparison card highlighting Rs. 70,000+ savings compared to traditional 300-card print runs.
- **Verified Couple Testimonials**: 5-star review cards from couples in Colombo, Kandy, and overseas.
- **PayHere-Integrated Pricing Matrix**: Transparent 3-tier pricing (Essential Rs. 2,900, Complete Rs. 4,900, Signature Concierge Rs. 8,900).
- **Real Moments Video Carousel**: 5 vertical celebration reels highlighting traditional Magul Bera, ballroom entrances, and sacred Muhurtham ceremonies.
- **FAQ Accordion & Concierge Advisor**: Interactive accordion addressing WhatsApp usage, elderly accessibility, and direct advisor contact.
- **Floating WhatsApp Widget**: Persistent bottom-right WhatsApp chat button for direct concierge support.

#### Phase 1: MVP Core & Authentication
- **Couple Authentication**: Better Auth / HttpOnly cookie sessions with Argon2id password hashing and owner-scoped queries.
- **Live Preview Invitation Editor**: Split-screen live preview supporting instant customization of couple names, parental notes, event schedules, and story quotes.
- **WhatsApp Click-to-Send Engine**: Sri Lankan phone number normalizer (`+94` E.164 format) and dynamic WhatsApp URL builder (`wa.me`).
- **128-Bit Cryptographic Guest Tokens**: Unique secure link generation per guest, preventing enumeration attacks.
- **Per-Event RSVP Engine**: Event-by-event RSVP submission (Poruwa, Reception, Homecoming) with dietary requirements and real-time dashboard telemetry.
- **PayHere Publishing Gate**: Integrated domestic Sri Lankan payment gateway with server-side MD5 signature hash verification and idempotent webhooks.

#### Phase 2: Complete Wedding Day Capabilities
- **Banquet Seating Arrangement Builder**: Drag-and-drop banquet table layout tool with guest assignment and capacity tracking.
- **Reception Entrance QR Easel & Table Locator**: High-resolution print-ready entrance QR sign and a 2-second guest table lookup page (`/i/[slug]/tables`).
- **Live Guest Photo Stream**: Real-time guest candid photo uploads with couple moderation queue and approval stream.

#### Phase 3: Growth & Operations
- **WhatsApp Delivery Telemetry & Reminders**: Real-time link open tracking with 1-click automated WhatsApp RSVP reminders.
- **Custom Design Concierge Queue**: Couple custom design request submission form with hand-drawn sketch attachment support and admin review queue.
- **Public Template Marketplace**: Filterable template marketplace with live sample demonstrations and category tabs.

### Tested & Verified
- **87 Playwright End-to-End Tests**: Complete passing suite across 3 viewports (`phone-360`, `tablet-768`, `desktop-1280`) in both Sinhala (`si`) and English (`en`).
- **18 Vitest Unit Tests**: Pure cryptographic and normalization test suite with 100% pass rate.
- **0 Lint & Typecheck Errors**: Strict TypeScript 5.8 and ESLint compliance.
