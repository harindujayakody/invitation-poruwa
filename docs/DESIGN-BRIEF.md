# Design brief (answers for `/impeccable teach`)

These are starting proposals from the blueprint. Edit them, then answer the teach prompts from this file and commit whatever Impeccable writes.

## Product and audience
- Product: digital wedding invitations for Sri Lankan weddings, sent on WhatsApp.
- Users: couples (mostly on phones, aged 25 to 40) and their guests (all ages, mostly on mid-range Android phones).
- Primary job: couple creates and sends in about 10 minutes; guest opens a personal link and RSVPs.
- Languages: Sinhala, Tamil, English.

## Direction
Editorial and quiet, like a printed invitation suite. Generous space, one accent colour, real typography, ornament used rarely and only where the culture calls for it (for example a poruwa motif on a traditional template, never on the dashboard).
NOTE: warm cream surfaces, a high-contrast serif and a warm clay accent are very common in generated designs. Treat the palette in tokens.css as a placeholder and make a deliberate choice after reviewing real screens.

## Anti-references (do not look like)
- Generic AI SaaS landing pages: gradient pills, sparkle icons, glow, glassmorphism.
- Template-farm invitation sites with cluttered ornament on every screen.

## Tone of writing
Plain verbs, sentence case, no filler. Buttons say exactly what happens ("Send on WhatsApp", "Publish"). Errors explain what went wrong and how to fix it.

## Constraints
- 360 px first. Touch targets 44 px. WCAG 2.2 AA.
- Guest page: under 150 KB gzipped JavaScript, LCP under 2.5 s on mid-range Android over 4G.
- Motion: native CSS first, one signature moment per surface, reduced motion respected.
