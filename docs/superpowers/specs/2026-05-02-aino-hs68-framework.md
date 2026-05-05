# Portfolio Design Framework — Aino + HS68 Synthesis

**Date:** 2026-05-02
**Status:** Direction (canonical reference)
**Supersedes:** all prior framework / direction docs in this rollout (the monograph spec, the portfolio-as-project direction, the hero-preloader spec). Implementation specs may still draw from those documents for component-level decisions, but **layout and visual direction are governed by this doc.**

---

## What this document is

A consolidated, observation-grounded design direction for the HKJ portfolio. Built by direct re-analysis of the two reference sites the user has explicitly named — **aino.agency** and **hs68.la** — and an honest accounting of where the current implementation breaks from those references.

This document is the answer to "what are we actually building."

---

## The two references

### Reference A — aino.agency

A Stockholm/Gothenburg digital agency building "premium storefronts." The site is a portfolio of work for clients like Nudie Jeans, SanDisk, Samsoe Samsoe, Sweet SKTBS.

**What we are taking from aino:**

1. **Two-cluster nav** — `Aino` left, `[Work] [Services] [About] [Play] [Contact] [menu]` right. Distributed minimally; the work IS the page.
2. **2-up featured work tiles** — featured projects rendered side by side at large scale, full-bleed media.
3. **Project codes overlaid on media** — `A002 SANDISK` rendered lower-left of the tile, on top of the image, not below it.
4. **Numbered project taxonomy** — every piece has a code (`A001`, `A002`, ...). The numbers ARE the catalog identity.
5. **Work-index page distinct from home** — separate route shows the full catalog (single column, image + metadata below); home shows hero + featured + secondary grid.
6. **Tight vertical rhythm between sections** — minimal negative space; sections flow continuously.
7. **Microtype-as-data** — every label is functional metadata, not decorative chrome.

**What we are explicitly NOT taking from aino:**

- Pure black/dark ground (we stay warm paper)
- Cinematic-agency motion grammar (path-blur, theatrical entrances — retired in prior specs)
- Brand-code naming conventions for the user (we use `№` editorial prefix, not `A###`)

### Reference B — hs68.la

LA tailoring brand "High Society," est. 1968. The site is a heritage commerce experience — collection categories, atelier, archive, editorial.

**What we are taking from hs68:**

1. **Centered hero with brand text + tagline + location** — the brand stake is the first thing the visitor sees, calmly stated.
2. **Body-sized brand statement** — descriptive paragraph in the second section, body type. **No display-scale typography moment anywhere.**
3. **Numbered organization in the nav** — `1 COLLECTION`, `2 ATELIER`, `3 ARCHIVE`, `4 EDITORIAL`. Numbers prefix labels in the nav menu only; not repeated as section headers.
4. **Small grid of category-tiles** (4 tiles) — not a sprawling catalog. Each tile is a category entry point: image + label.
5. **Generous vertical rhythm** — substantial whitespace between sections.
6. **Rich footer** — help links, Instagram, newsletter signup, full address, footer image.
7. **Heritage-statement framing** — the site argues for itself in a calm declarative way (`independent fashion house, est 1968`).

**What we are explicitly NOT taking from hs68:**

- Commerce specifics (Book Now, search, bag, size guide)
- Multiple sub-categories (Man / Woman / Bespoke / Objects)
- Actual heritage flex (we have one year of practice, not 56)

---

## Reference analysis — exact scroll sequences

### Aino homepage scroll

| Section | Content | Visual function |
|---|---|---|
| 1 | Nav + hero statement (one body-sized sentence, e.g. "We build premium storefronts where brands grow and consumers fall in love.") | Brand stake |
| 2 | **2-up featured tiles** — SanDisk (A002) and Samsoe Samsoe (A004) side-by-side, full-bleed media | Hero work |
| 3 | **2-col secondary grid** — 8+ projects (Nudie Jeans, Emma S, All Blues, Gulled, Beyond Medals, Socksss, Tinted, Sweet SKTBS, Molo) | Catalog continuation |
| 4 | Footer — `GBG/OSL`, "New Business" + email, social links | Contact + metadata |

### Aino work-index page (`/work`)

- Single-column layout, varied tile heights
- Each tile: full-bleed image + project code + name + year **below** the image (`A001 Nudie Jeans 2025`)
- Grid/List view toggle near top
- Below grid: numbered list of all 38 projects (`001` through `038`)

### HS68 homepage scroll

| Section | Content | Visual function |
|---|---|---|
| 1 | Centered "High Society" + tagline "HS 68 Old Traditions / New Details" + location "90048 LA CA" + nav (logo + 1-4 numbered sections + search + bag) | Brand stake (full viewport) |
| 2 | Body-sized brand statement paragraph | Operator copy |
| 3 | **4-tile collection grid** — `MAN`, `EST. 1968`, Teenage Engineering doll product, `WOMAN` | Category navigation |
| 4 | "Book an Appointment" CTA | Primary action |
| 5 | "HS68 BESPOKE ARCHIVES · 27 See All" header + 4 numbered archive tiles (01–04) — Prince, LeBron, Post Malone, Mank | Cultural / archive depth |
| 6 | Footer — help links, Instagram, newsletter signup, address, full-width footer image | Rich contact + brand close |

---

## The synthesis — HKJ portfolio framework

The references diverge in some places (aino is tight; hs68 is generous; aino is dark; hs68 is warm) and agree in others (both are scroll-driven narratives, not single grids; both put text overlaid on media in tile cells; neither has display-scale typography). The HKJ framework picks where to lean and where to combine.

### Where we lean Aino

- 2-up featured work treatment (the headline projects get scale)
- Project codes overlaid on media at lower-left
- Work-index page shape (separate `/work` route, single-column, metadata below)
- Microtype-as-data discipline

### Where we lean HS68

- Warm-paper ground (we stay light, not dark)
- Generous vertical rhythm between sections (not aino's tight pack)
- Centered brand-stake hero (HS68's "High Society" centered approach)
- Body-sized typography (no display-scale moment)
- Numbered nav organization (1 / 2 / 3 prefixes)
- Rich footer
- Categorical 4-tile section pattern (HS68's collection grid, applied to writing/links)

### Where we synthesize

- 2 nav clusters (aino), with numbered prefixes on nav items (HS68)
- Hero is brand stake (HS68 centered) but with an aino-style action link cluster below ([View work →] [About the studio →])
- Featured work section uses aino's 2-up pattern
- Catalog grid uses HS68's calmer 4-tile rhythm (fewer pieces per row, more breathing room)
- Mixed cell types: real-piece tiles AND placeholder cells AND text-label cells coexist (HS68's mixed-content grid)

---

## Home page structure (target)

Six sections. Scroll-driven narrative.

```
┌───────────────────────────────────────────────────────────────┐
│ NAV (fixed top)                                               │
│  ┌─────────────────┐                  ┌──────────────────┐   │
│  │ HKJ Hyeonjoon   │                  │ 01 Studio        │   │
│  │ Jun · Design    │                  │ 02 Bookmarks     │   │
│  │ Engineer        │                  │ 03 Notes      ☼  │   │
│  └─────────────────┘                  └──────────────────┘   │
└───────────────────────────────────────────────────────────────┘

SECTION 1 — HERO
┌───────────────────────────────────────────────────────────────┐
│                                                               │
│            Hyeonjoon Jun                                      │
│            A studio practice in design and engineering.       │
│            New York · 2025 —                                  │
│                                                               │
│            [View work →]   [About the studio →]               │
│                                                               │
└───────────────────────────────────────────────────────────────┘

SECTION 2 — FEATURED WORK (2-up, the only real pieces shipped)
┌───────────────────────────────────────────────┬───────────────┐
│                                               │               │
│   [GYEOL — full-bleed media, hero tile]       │  [SIFT —      │
│                                               │   full-bleed  │
│                                               │   media,      │
│                                               │   hero tile]  │
│                                               │               │
│   P02 GYEOL · 2026                            │  P04 SIFT · 2025
└───────────────────────────────────────────────┴───────────────┘

SECTION 3 — CATALOG (smaller, 3-col, the placeholders)
┌─────────────┬─────────────┬─────────────┐
│ P01         │ P03         │ P05         │
│ TBD         │ TBD         │ TBD         │
├─────────────┼─────────────┼─────────────┤
│ P06         │ P07         │             │
│ TBD         │ TBD         │             │
└─────────────┴─────────────┴─────────────┘

SECTION 4 — WRITING / NAVIGATION (4-tile, HS68-coded)
┌─────────────┬─────────────┬─────────────┬─────────────┐
│             │             │             │             │
│   STUDIO    │  BOOKMARKS  │    NOTES    │  COLOPHON   │
│   essay     │   shelf     │   essays    │  build SHA  │
│             │             │             │             │
└─────────────┴─────────────┴─────────────┴─────────────┘

SECTION 5 — FOOTER
┌───────────────────────────────────────────────────────────────┐
│ rykjun@gmail.com · @hyeonjunjun · NYC · 2026                  │
│                                                               │
│ [optional: full-width subtle footer image]                    │
└───────────────────────────────────────────────────────────────┘
```

---

## Component inventory — final state

### Components that survive

- `NavCoordinates.tsx` — restructure to 2 clusters (brand left, links + utility right). Numbered nav items kept.
- `WorkPlate.tsx` — split into two variants (Featured / Catalog) OR refactor into one component with a `variant` prop:
  - **Featured variant**: full-bleed media, project code + name overlaid lower-left
  - **Catalog variant**: smaller media, project code + name overlaid lower-left (same overlay treatment, smaller scale)
- `WorkList.tsx` — kept for the optional list-view toggle (deferred — see "Open questions")
- `ScrambleText.tsx` — kept; used on tile titles (in overlay or below, depending on variant)
- `ThemeToggle.tsx`, `useTheme.ts`, `ThemeInit.tsx` — kept; theme system is sound
- `HomeViewInit.tsx` + `useHomeView.ts` — kept; view-toggle persistence
- `ViewToggle.tsx` — kept; lives in nav utility cluster
- `CopyEmailLink.tsx` — kept; lives in footer
- `PaperGrain.tsx` — kept; theme-responsive
- `RouteAnnouncer.tsx` — kept; a11y
- `Preloader.tsx` + `PreloaderClient.tsx` + `PreloaderInit.tsx` + `usePreloaderState.ts` — kept (Phase 6 from prior spec); awaiting ASCII video asset

### Components to retire (delete from disk)

- `CursorReadout.tsx` — neither reference has a custom cursor with coordinate readout
- `StatusReadout.tsx` — neither reference has live status microtype at a fixed corner
- `PixelMark.tsx` — neither reference has a pixel-grid wordmark
- `Folio.tsx` — already dropped from layout; delete the file
- `ReservedZone.tsx` — orphaned after toggles moved into nav; delete the file

### Components to add

- `<HeroSection>` — body-sized brand statement + 2 action links (aino CTA pattern)
- `<FeaturedWork>` — 2-up grid of the real pieces (Gyeol + Sift), large scale
- `<CatalogGrid>` — 3-col grid of the placeholders (P01, P03, P05–07), smaller scale than featured
- `<WritingTiles>` — HS68-coded 4-tile section linking to /studio, /bookmarks, /notes, /colophon (or fewer if 4 doesn't make sense)

---

## Design system

### Color (unchanged from prior specs)

```css
:root {
  --paper:   #FBFAF6;   /* warm cream ground */
  --paper-2: #F4F3EE;
  --paper-3: #E8E7E1;
  --ink:     #111110;   /* warm near-black */
  --ink-2:   #55554F;
  --ink-3:   #8E8E87;
  --ink-4:   #BFBEB8;
  --ink-hair:  rgba(17, 17, 16, 0.10);
  --ink-ghost: rgba(17, 17, 16, 0.06);
  --microtype-tracking: 0.12em;
}

html[data-theme="dark"] {
  --paper:   #0E0D09;
  --paper-2: #16150F;
  --paper-3: #24221A;
  --ink:     #F8F5EC;
  --ink-2:   #C8C5BC;
  --ink-3:   #8E8C85;
  --ink-4:   #555349;
  --ink-hair:  rgba(248, 245, 236, 0.10);
  --ink-ghost: rgba(248, 245, 236, 0.06);
  --microtype-tracking: 0.11em;
}
```

### Typography

- **Geist Sans** (chrome face — pending PP Neue Montreal swap when fonts arrive)
- **Newsreader** (body serif, long-form prose only)
- Mono retired
- **No display-scale type anywhere on the home.** The hero brand statement is body-sized (16–22px). The featured-tile project codes are microtype (10–11px). HS68 and aino confirm: there is no giant typography moment.
- Microtype tracking: `var(--microtype-tracking)` (0.12em light, 0.11em dark)
- Sentence case for body / titles; UPPERCASE for microtype tags only

### Spacing (target — leans HS68 generous)

- Section gap: `clamp(64px, 10vh, 120px)` — generous breathing room between sections
- Grid gap (within a grid): `clamp(20px, 2vw, 36px)` — tight inside, breathy between
- Hero padding-top (below nav): `clamp(120px, 20vh, 200px)`
- Footer padding-top: `clamp(80px, 12vh, 120px)`

### Motion

- 4 easing curves locked (no additions): `(.4,0,.2,1)`, `(.22,1,.36,1)`, `(.33,.12,.15,1)`, `(.41,.1,.13,1)`
- All motion user-triggered or first-paint; settles to stillness ≤ 480ms
- `useSectionReveal` hook handles scroll-into-view section reveals
- Tile hover: image crossfade (if `coverAlt`) or 1.012 scale
- ScrambleText on tile titles (1–3 character cycle)
- View Transitions API on route changes (existing wiring preserved)

### What does NOT exist (was added by mistake; getting retired)

- No custom cursor / coordinate readout
- No live status indicator (time, build SHA at fixed corner)
- No pixel-grid wordmark
- No display-scale hero typography
- No standalone Folio component
- No ReservedZone wrapper

---

## Tile content — specific rules

### Featured variant (Section 2 — Gyeol, Sift)

- Full-bleed media (image or video) at large scale (each tile ~50% of viewport width on desktop, full-width on mobile)
- Aspect ratio respects per-piece `coverAspect` (Gyeol 3/4, Sift 9/16)
- **Project code + name overlaid lower-left** of the media: `P02 GYEOL · 2026`
- Microtype: 10–11px, uppercase, tracked, white-on-image (sufficient contrast via subtle scrim if needed)
- No caption block below the image — all text overlaid

### Catalog variant (Section 3 — placeholders P01, P03, P05–07)

- Smaller scale (3-col grid, ~33% width per cell)
- 4/5 aspect ratio (uniform)
- Paper-2 fill (no media for placeholders)
- Crosshair markers at corners (existing — keep)
- **Project code + name overlaid lower-left** at smaller scale: `P01 — TBD`
- No caption block below

### Writing tiles (Section 4 — Studio, Bookmarks, Notes, Colophon)

- Smaller still, 4-col grid, ~25% width per cell
- Could be image OR text-label per tile (HS68 mixes)
- For HKJ: probably text-label only (we don't have stock imagery for studio/bookmarks/notes)
- Each tile: large category name + small description
- Border-only or paper-2 fill, depending on visual rhythm test

---

## What we are NOT doing (explicit retirement list)

These have been considered or attempted and explicitly retired. Do not re-propose without amending this doc.

- Stage / dark / cinematic register as the home ground (theme system stays; per-page register switching does not)
- Display-scale hero typography (28–48px statements)
- ASCII as decoration / looping / preloader animation (preloader exists per Phase 6 spec but its content is captioned data, not arbitrary)
- Custom cursor with coordinate readout
- Live status block at fixed page corner
- Pixel-grid wordmark mark
- 1-page everything-on-home grid (the home is a scroll-driven narrative, not a single grid)
- Caption block BELOW image on home tiles (text goes OVERLAID)
- 7-piece uniform 3-col grid (real pieces and placeholders get different treatment now)

---

## Implementation guidance — what changes

**To execute this framework, the implementation work needed:**

1. **Page restructure**: `src/app/page.tsx` becomes 5 sections (hero, featured, catalog, writing, footer), not 1 grid + reserved zone wrapper.

2. **WorkPlate refactor**: text overlays on media instead of caption block below. Possibly two variants (Featured vs Catalog) or one variant with size-prop scaling.

3. **Component retirement**:
   - Delete `src/components/CursorReadout.tsx`
   - Delete `src/components/StatusReadout.tsx`
   - Delete `src/components/PixelMark.tsx`
   - Delete `src/components/Folio.tsx` (already unused)
   - Delete `src/components/ReservedZone.tsx` (already unused)
   - Remove their mounts from `src/app/layout.tsx` and `src/app/page.tsx`

4. **Nav restructure**: 2 clusters (brand left, links + utility right). Drop the centered links — combine with the right utility cluster.

5. **New components**:
   - `src/components/HeroSection.tsx` — brand statement + 2 action links
   - `src/components/FeaturedWork.tsx` — 2-up tiles for real pieces
   - `src/components/CatalogGrid.tsx` — 3-col grid for placeholders
   - `src/components/WritingTiles.tsx` — 4-tile section for writing/links

6. **Hero typography reduction**: from `clamp(28px, 4vw, 48px)` down to `clamp(16px, 2vw, 22px)`.

7. **Spacing increase**: section gaps grow from `clamp(40px, 6vh, 72px)` to `clamp(64px, 10vh, 120px)`.

---

## Open questions for user

1. **Studio essay content** — Section 4 wants tiles for `/studio`, `/bookmarks`, `/notes`, plus optionally `/colophon`. If `/colophon` doesn't exist, what's the fourth tile? Or is the section a 3-tile row?

2. **Action link copy** — `[View work →]` and `[About the studio →]` are placeholder labels. Confirm or rewrite.

3. **Hero brand statement copy** — currently proposed:
   > "Hyeonjoon Jun. A studio practice in design and engineering. New York · 2025 —"
   
   That's three statements. Confirm or rewrite. Could be more like aino's single-sentence proposition: `"A studio practice — taste, considered code, slow rhythm."`

4. **Footer image** — HS68 has a full-width footer image. Do we want one? If yes, what image (a workspace shot, a long-exposure, a typographic mark)? If no, we keep the footer as text-only.

5. **WorkList toggle** — currently there's a `gallery / list` toggle in the nav. With the new home structure (hero + featured + catalog + writing + footer), the "list view" makes less sense — what does it list? Options: keep the toggle (works only on Section 3), remove the toggle entirely, or move list view to a separate `/work` route (aino's pattern — separate work-index page).

---

## Decision log — what's been confirmed

- Two references locked: aino.agency + hs68.la
- Warm-paper ground (light theme) is default; dark mode toggle exists
- Numbered nav (`01 STUDIO`, etc.) — confirmed
- 5-section scroll narrative (hero, featured, catalog, writing, footer) — proposed; awaiting user confirmation
- 2-cluster nav (drop centered links) — proposed; awaiting user confirmation
- Text overlaid on tiles, not below — proposed; awaiting user confirmation
- Retire CursorReadout, StatusReadout, PixelMark, Folio, ReservedZone — proposed; awaiting user confirmation
- Hero typography reduced to body size — proposed; awaiting user confirmation

---

## File location & lifecycle

This document lives at `docs/superpowers/specs/2026-05-02-aino-hs68-framework.md`.

It is the **canonical reference** for layout and design direction going forward. Implementation specs (`-design.md` files) and plans (in `docs/superpowers/plans/`) may exist separately for component-level detail, but they should reference and conform to this framework.

When the framework changes, this doc gets amended with a dated section noting what shifted and why. The framework should not silently drift.

---
