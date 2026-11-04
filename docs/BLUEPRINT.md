# Blueprint summary (condensed)

The full blueprint lives in the Claude doc "Digital Wedding Invitation Platform: Technical & Design Blueprint". Export it as Markdown and replace this file if you want the long version.

## Goals
- Couple flow (pick design, add details, add guests, send) in under 10 minutes on a phone.
- Guest invitation loads in under 2 s on a mid-range Android over 4G, in si, ta or en.
- One design language across marketing, dashboard and invitations, enforced by tokens and a written brief.
- Scroll and entrance animation that stays smooth on low-end phones.

## Anti-goals
No AI-product look (gradient pills, sparkles, glassmorphism). No bloat: no feature without a user task, no dependency for one effect, guest page under about 150 KB JS.

## Scope
- MVP: sign-up, free build and preview, pay-once publish; 8 to 12 templates; editor with section toggles and live preview; guest list with CSV import; personal guest links and WhatsApp click-to-send; RSVP per event with live dashboard; map link and add-to-calendar.
- Phase 2: seating plan, QR entrance sign, guest photo gallery, planning tools, multi-event invitations.
- Phase 3: custom-design requests, delivery tracking and reminders, template marketplace.

## Stack
Next.js 16 (App Router, RSC), TypeScript strict, shadcn/ui, Tailwind v4, Lucide, Noto Sans/Serif Sinhala via next/font, Postgres + Drizzle, Better Auth or Auth.js, Cloudflare R2, PayHere, Resend, Inngest or Vercel Cron, next-intl, Vitest, Playwright, Sentry.

## Fonts
No font named "Google Sans Sinhala" was found. Google's Sinhala fonts are Noto Sans Sinhala (UI/body) and Noto Serif Sinhala (ceremonial headings). Both are OFL licensed.

## Motion layers
1. Native CSS scroll-driven animation and transitions (Chrome/Edge 115+, Safari 26+, Firefox 159+). Always guard with @supports.
2. View Transitions for navigation.
3. Motion library for drag, layout and presence only.
4. GSAP ScrollTrigger only if one pinned section cannot be done in CSS.
Rules: transform/opacity/clip-path only; 120-200 ms for UI, 400-700 ms for reveals; reduced motion respected; content visible without JS.

## Pages
Public: /, /templates, /samples/[slug], /pricing, /how-to-use, /blog, /contact.
Couple: /login, /onboard, /app, /app/invitations/[id]/{edit,guests,rsvp,seating,gallery}, /app/plan, /app/billing.
Guest: /i/[slug]?g=<token> (cached shell + small dynamic guest part; noindex; per-invitation OG image).
Team: /admin. Machines: /api/webhooks/*.

## Data model
users, invitations (content JSON), invitation_events, guests (unique token), guest_events, rsvps (one per guest per event), deliveries, seating_tables, seat_assignments, media, orders, templates, audit_log. See db/schema.ts.

## Key flows
Create and publish (draft preview, autosave, PayHere checkout, verified idempotent webhook). Add guests (validate, E.164 +94, 128-bit token). Send (wa.me click-to-send; "sent" = couple's mark, "opened" = first token load). RSVP (Server Action, token check, rate limit). Seating (publish plan; guests see table).

## Security and privacy
Owner-scoped queries with cross-tenant tests; 128-bit guest tokens, revocable; rate limits; signed uploads with moderation; minimum personal data, export/delete on request, retention after event; confirm Sri Lanka PDPA (No. 9 of 2022) obligations with a local lawyer.

## Gates
A foundations (tokens, /design route, one template end to end at 360 px in si and en, CI). B MVP launch (e2e loop in every locale, budgets met, payment webhook tested, pilot done). C phase 2 (seating/gallery used, no a11y blockers).
