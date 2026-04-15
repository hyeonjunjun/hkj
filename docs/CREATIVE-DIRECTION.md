# HKJ Portfolio — Creative Framework

> Editorial product design for a solo design engineer.
> Mathematical type, golden-ratio layout, atomic design methodology, ink-and-paper palette.

---

## 1. The Three Voices

Three typefaces, three roles, no overlap.

| Role | Font | Purpose |
|---|---|---|
| **Expressive** | Newsreader (serif, italic available) | Project titles, hero statement, pull quotes — the human, warm voice |
| **Definitive** | General Sans (sans) | Body copy, descriptions, paragraphs — the reading voice |
| **Product** | Fragment Mono | Metadata, labels, numbers, roles, UI chrome — the strict, product-edge voice |

Never mix: a paragraph is always sans. A label is always mono. A title is always serif.

## 2. Modular Type Scale — Perfect Fourth (1.333)

Every text size comes from this scale. No arbitrary values.

```
--t-micro:   9px     (12 ÷ 1.333)
--t-small:   12px    (base ÷ 1.333)
--t-body:    16px    (base)
--t-h4:      21px    (16 × 1.333)
--t-h3:      28px    (21 × 1.333)
--t-h2:      37px    (28 × 1.333)
--t-h1:      50px    (37 × 1.333)
--t-display: 67px    (50 × 1.333)
--t-hero:    89px    (67 × 1.333)
```

Usage rules:
- Body paragraphs: `t-body` (16px) sans, line-height 1.55
- Project titles: `t-h2` or `t-h3` serif italic
- Hero statement: `t-display` or `t-hero` serif
- Metadata/labels: `t-small` or `t-micro` mono uppercase, letterspaced 0.08-0.12em
- H1 (page titles): `t-h1` serif

Line heights are inversely proportional to size: display 1.02, h1-h2 1.1, h3-h4 1.25, body 1.55.

## 3. Ink and Paper Palette

Lowered contrast. Warm off-black on cool newsprint. No pure black, no pure white.

```css
--paper:     #F7F7F5  /* cool off-white, newsprint */
--paper-2:   #EFEFEC  /* panel background */
--paper-3:   #E6E6E2  /* divider background */
--ink:       #1C1C1A  /* deep warm black */
--ink-2:     #5A5A56  /* muted text */
--ink-3:     #92928E  /* faint text, tertiary */
--ink-4:     #C6C6C2  /* ghost, dividers */
--accent:    #C4A265  /* one accent — used rarely */
```

Ink hierarchy:
- Primary text (body, titles): `--ink`
- Secondary text (captions, descriptions): `--ink-2`
- Metadata, labels: `--ink-3`
- Dividers, strokes: `--ink-4`

## 4. Golden Ratio Layout — 62/38

Asymmetric composition. Content sits left-heavy or right-heavy, never centered.

**Case study hero:**
- Image/media: 62% column width
- Text/narrative: 38% column width
- Gap: 48px minimum

**Project tiles (masonry):**
- Image: 62% of tile height
- Caption block: 38% (counted with whitespace)

**Page container:**
- Max-width: 1280px
- Horizontal padding: `clamp(24px, 4vw, 64px)`
- Vertical spacing between major sections: 120-200px (asymmetric, not uniform)

## 5. Narrative Atomic Design — Case Study Structure

Case studies are magazine features on a product. They treat the work as a system, not a screenshot.

Structure:
1. **Cover spread** — metadata bar, pull-quote paradox, hero image (62/38 split)
2. **Overview** — written narrative, 54ch column
3. **Atoms** — exhibition-style display of color tokens, type scale, spacing values, buttons. Each atom has a label, a specimen, and a value.
4. **Molecules** — small component combinations (form fields, nav items, cards)
5. **Organisms** — full components in context (data tables, full navs, complex cards)
6. **In context** — final product screens, full-bleed imagery
7. **Next project** — a single link with the 62/38 preview

Every atom/molecule/organism section has a monospace section label (`[ATOMS]`, `[MOLECULES]`, `[ORGANISMS]`), a serif section heading, and a sans body explanation.

## 6. Motion Language

Simple, purposeful, never decorative.

- **Reveal on mount**: opacity 0 → 1, y 16 → 0, 0.6s, ease `cubic-bezier(.4, 0, .2, 1)`, stagger 0.06s
- **Reveal on scroll**: same values, ScrollTrigger at 85% viewport, once only
- **Hover (tiles)**: image scale 1 → 1.015 over 0.5s; siblings opacity 1 → 0.4 over 0.3s
- **Page transitions**: quiet opacity fade, 300ms exit + 500ms enter
- **Reduced motion**: everything snaps to final state instantly

## 7. Personality

The site has ONE living element to prove it's maintained:

- A small green pulsing dot + kicker near the hero: `Available for select projects — 2026`
- A `Currently` statement below the hero — dated, specific, human. Describes the CURRENT focus (creative direction + AI visual work).
- Updated monthly. Proves the portfolio isn't a resume — it's a living document.

## 8. Applied Across Pages

### Homepage (`/`)
- Fixed nav top (mix-blend-mode: difference over content)
- Hero: micro availability kicker → expressive serif statement → body sans "Currently" paragraph
- Masonry gallery: 2-3 columns responsive, varied aspect ratios, depth-of-field hover
- Footer: email + copyright in mono

### Case study (`/work/[slug]`)
- Metadata bar (mono)
- Paradox line (serif italic, large)
- 62/38 hero split (image + stakes narrative)
- Atomic design sections: Atoms / Molecules / Organisms
- In-context screens
- Next project link (62/38 mini-hero)

### About (`/about`)
- Small intro kicker (mono)
- Philosophy (serif italic, h2 scale)
- Body paragraphs (sans, 54ch, 16px)
- Experience timeline: [year → year] mono periods + sans role
- Contact section

## 9. What We're NOT Doing

- No 3D scene, no particles, no AR panoramic
- No BloomNode glow effects — that component is retired for this direction
- No aggressive animations
- No dark theme (the framework is ink-on-paper, light)
- No custom cursor
- No bracketed labels `[LIKE_THIS]` everywhere — mono alone is the "product" signal
