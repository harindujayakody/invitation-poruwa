# Design System Specification & Cultural Brand Standards

> **Platform**: Digital Wedding Invitation Platform for Sri Lanka  
> **Brand Direction**: Authentic Sri Lankan Cultural Heritage Meets Modern Editorial Craft  
> **Design Skill**: Impeccable Design Standard  
> **Token Authority**: `styles/tokens.css`

---

## 1. Aesthetic Point of View

Sri Lankan weddings are ceremonies of profound cultural reverence, family blessing, and community celebration. Our design language bridges historic Kandyan, Low Country, and Southern traditions with modern mobile-first digital accessibility.

Rather than adopting generic Western digital wedding templates or noisy AI-generated visual tropes (such as gradient pills, glassmorphism, or sparkle badges), the interface draws from **traditional Sri Lankan craftsmanship**:
- **Warm Ivory Parchment**: Recalling handmade parchment wedding invitations and temple ola-leaf manuscripts.
- **Sandakada Pahana (Moonstone / Mandala)**: Concentric architectural arcs inspired by Anuradhapura and Polonnaruwa stone carvings, featuring sacred lotus petals (*Piyum*) and continuous wave motifs (*Liyavel*).
- **Ceremonial Calligraphy**: Honoring the natural curved cadence of Sinhala (*ආදර ආරාධනයයි*) and Tamil (*அன்பான அழைப்பிதழ்*) script.
- **Regal Nilame & Osari Regalia**: Celebrating traditional Kandyan Mul Anduma and gold-embroidered bridal Osari.

---

## 2. Color System & OKLCH Tokens

All colors are defined strictly in the perceptual **OKLCH** color space in `styles/tokens.css` to ensure uniform luminance and contrast across devices.

### 2.1 Core Palette Tokens

| Token Name | OKLCH Value | Visual Representation | Semantic Role |
|---|---|---|---|
| `--surface` | `oklch(0.985 0.015 85)` | `#fcf9f2` Warm Ivory | Main page background, parchment invitations |
| `--surface-sunken` | `oklch(0.96 0.02 85)` | `#f7f2e7` Muted Sand | Card backgrounds, sunken table rows |
| `--surface-raised` | `oklch(1 0 0)` | `#ffffff` Pure White | Elevated modal dialogs, phone mockup frames |
| `--ink` | `oklch(0.18 0.03 50)` | `#2b1c11` Warm Deep Brown | Primary body text, headings, prominent copy |
| `--ink-muted` | `oklch(0.42 0.03 50)` | `#69584c` Sepia Gray | Secondary labels, descriptions, timestamps |
| `--line` | `oklch(0.88 0.02 85)` | `#e8e0d0` Subtle Border | Card boundaries, dividers, table separators |
| `--accent` | `oklch(0.55 0.16 55)` | `#b45309` Amber Ochre | Primary cultural accents, ceremonial buttons |
| `--accent-gold` | `oklch(0.72 0.14 75)` | `#d97706` Ornate Gold | Sandakada Pahana vectors, dock icons, halos |
| `--accent-rose` | `oklch(0.58 0.22 15)` | `#e11d48` Rose Magenta | High-intent CTAs (*Start free ->*), highlight text |
| `--accent-soft` | `oklch(0.94 0.04 65)` | `#fef3c7` Soft Gold | Pill backgrounds, subtle badge backdrops |

> [!IMPORTANT]
> **Zero Hardcoded Colors**: No arbitrary hex values (`#ff0000`, etc.) are permitted in components. All styles must map directly to tokens in `styles/tokens.css` or use CSS variables.

---

## 3. Typography & Multi-Script Standards

The platform operates fluently across **Sinhala**, **Tamil**, and **English**. Script-specific typography rules are non-negotiable to maintain cultural dignity and readability.

### 3.1 Font Stacks

```css
/* Display & Ceremonial Heading Font */
--font-display: "Noto Serif Sinhala", "Playfair Display", Georgia, serif;

/* Body & UI Font */
--font-body: "Noto Sans Sinhala", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;

/* Tamil Fallback Font */
--font-tamil: "Noto Sans Tamil", "Noto Serif Tamil", sans-serif;
```

### 3.2 Sinhala & Tamil Script Rules

1. **Always Set `lang` Attribute**: Any component or container holding Sinhala or Tamil copy must specify `lang="si"` or `lang="ta"`.
2. **Body Line-Height Floor**: Sinhala and Tamil glyphs contain ascending and descending diacritics (*Kombuva*, *Ispilla*, *Paapilla*). Body line-height must be set to at least **`1.7`** (never `1.2` or `1.4`) to prevent diacritic clipping.
3. **No Faux Italic or Faux Bold**: Do not apply `font-style: italic` to Sinhala or Tamil script where an authentic italic face does not exist. Use weight steps (400 vs 600) for distinction.
4. **Zero Letter-Spacing & Text-Transform**: Never apply `tracking-wide`, `tracking-tight`, or `uppercase`/`lowercase` to Sinhala or Tamil words. It breaks the ligature joins of complex conjunct consonants.

### 3.3 Text Measure & Hierarchy

- **Line Measure**: 45 to 75 characters per line (`max-w-[65ch]`) to optimize reading comfort.
- **Single `<h1>` Semantic Invariant**: Every rendered route must feature exactly one `<h1>` element. Subordinate headings (such as couple names inside previews or section titles) must use `<h2>` or `<h3>`.

---

## 4. Layout, Breakpoints & Touch Targets

### 4.1 Mobile-First Philosophy
Over 85% of wedding guests in Sri Lanka open their invitations on a mobile device via WhatsApp. All interfaces are authored for **360px width first**, then progressively enhanced for tablets and desktops.

| Breakpoint | Viewport Width | Primary Use Case |
|---|---|---|
| **Phone** | `360px - 640px` | Guest WhatsApp invitation, RSVP submission, table lookup |
| **Tablet** | `768px - 1024px` | Reception entrance check-in easel, couple on-the-go editing |
| **Desktop** | `1280px+` | Couple studio, banquet drag-and-drop seating canvas, analytics |

### 4.2 Touch Targets
- All interactive controls (buttons, links, tab icons, RSVP radio targets) have a minimum dimension of **$44\times 44\text{ px}$**.
- Floating bottom docks include safety margins for iOS home indicator bars and Android system navigation gestures.

---

## 5. Cultural Motifs & Visual Assets

### 5.1 Sandakada Pahana (Moonstone Arc)
- Rendered as clean, scalable vector SVG ([`SandakadaPahanaMandala`](file:///d:/Project%20Infiax/wedding-invite/components/templates/sandakada-pahana-mandala.tsx)).
- Features half-circle concentric geometry:
  - Outer flame band (*Gini Silla*)
  - Middle lotus flower petal arc (*Nelum Mal*)
  - Inner geometric band with radial golden gradient.
- Optimized for instant SVG DOM rendering with zero layout shift (CLS = 0).

### 5.2 Traditional Bridal Regalia Illustration
- Authentic illustration representing a Sri Lankan couple in traditional Kandyan attire:
  - Groom: *Kandyan Nilame* in ceremonial Mul Anduma, gold chain, and four-cornered hat (*Thuppattiya*).
  - Bride: *Kandyan Osari* in ivory and gold embroidery, Nalalpatiya headpiece, Agrapatiya, and seven traditional necklace chains.
- Asset stored as feathered transparent PNG (`public/images/kandyan-couple-transparent.png`) with responsive `next/image` sizing.

---

## 6. Sound Synthesis Design (Auditory Tokens)

Instead of autoplaying intrusive or high-bandwidth audio files, the platform provides a conscious auditory experience:

- **Synthesizer Melody**: Authentic ceremonial flute motif based on the auspicious pentatonic rāga (Sa, Ri, Ga, Pa, Dha).
- **Waveform**: Pure sine oscillator with warm analog envelope shaping.
- **Visual Feedback**: Pulsing sound-wave ripple indicator while music is active.
- **User Control**: Explicit user activation toggle; remembers mute preference across views.

---

## 7. Banned Patterns & Anti-Patterns (Quality Floor)

To preserve authenticity and maintain a timeless aesthetic, the following patterns are strictly banned:

| Pattern | Status | Reason |
|---|---|---|
| **Pill Badges Above Headlines** | ❌ Banned | Saturated AI startup look; headings must speak for themselves. |
| **Sparkle or Wand Icons** | ❌ Banned | Devalues the solemnity and cultural weight of marriage ceremonies. |
| **Gradient Text** | ❌ Banned | Hard to read on mobile screens under direct Sri Lankan sunlight. |
| **Generic Glassmorphism** | ❌ Banned | Low contrast and high GPU consumption on mid-range Android phones. |
| **Centred-Everything Layouts** | ❌ Banned | Marketing pages must maintain strong left-aligned editorial hierarchy. |
| **Nested Cards** | ❌ Banned | Card inside card inside card creates visual clutter and padding fatigue. |
| **Emoji as Primary Icons** | ❌ Banned | Inconsistent rendering across Android manufacturers; use Lucide SVG icons. |
