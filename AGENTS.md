# Project rules (read first)

Product: digital wedding invitations for Sri Lankan couples. Couples build an invitation site, send each guest a personal WhatsApp link, and track RSVPs and seating. Languages: Sinhala (si), Tamil (ta), English (en).

Read before any work: `docs/BLUEPRINT.md` and `docs/DESIGN-BRIEF.md`.

## Stack
Next.js 16 App Router, TypeScript strict, Tailwind v4, shadcn/ui, Lucide icons, Drizzle + Postgres, Zod, next-intl, Playwright, Vitest.

## Design rules
- Use tokens from `styles/tokens.css` only. No hard-coded colours, radii, spacing or font sizes in components.
- Banned: pill badges above headlines, sparkle or wand icons, decorative gradients, glassmorphism, glow shadows, nested cards, three identical icon-title-text feature cards, centred-everything layouts, emoji as icons.
- One primary action per view. Left-aligned text with a 45 to 75 character measure.
- Icons: Lucide only, 16, 20 or 24 px, stroke 1.5, imported per icon.
- Sinhala and Tamil text: set `lang`, never add letter-spacing or text-transform, no faux italic or faux bold, line-height 1.7 for body.
- Touch targets at least 44x44 px. Design at 360 px wide first.

## Motion rules
- Native CSS first (scroll-driven animation, View Transitions). Motion library only for drag, layout and presence animation.
- Animate transform, opacity and clip-path only. Wrap scroll effects in `@supports (animation-timeline: view())`.
- Respect `prefers-reduced-motion`. Content must be visible with no JS and no animation support.
- One signature moment per surface. No smooth-scroll hijacking libraries.

## Engineering rules
- Server Components by default. Client components only for the editor, seating canvas, RSVP form and the opening animation.
- Server Actions for authenticated changes; Route Handlers only for webhooks and signed uploads.
- Validate every input with Zod. Scope every query by the signed-in owner. Never log or expose guest tokens.
- All user-facing strings go through next-intl. No hard-coded copy in components.
- Never add a dependency without stating why. Guest page budget: under 150 KB gzipped JS.

## Before finishing any UI change
1. Run the Impeccable `audit` and `critique` commands on the changed screen.
2. Check at 360, 768 and 1280 px, in si and en.
3. Run `npm run lint`, `npm run typecheck`, `npm test`.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
