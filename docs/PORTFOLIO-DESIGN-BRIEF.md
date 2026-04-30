# Hyeonjoon Jun — Portfolio Design Brief

**As of 2026-04-30**

---

## Philosophy

The portfolio is a **studio catalog** grounded in Kenya Hara's principle of *ma* — emptiness as active material. One register (paper), one voice, applied with devotion across every surface. The interface holds the work; it never competes with it. The positioning sits on the line between **Rauno Freiberg's** editorial-engineer quietness and **Joanie Lemercier's** luminous-catalog restraint.

Guiding rule: *if removing it doesn't hurt the composition, it shouldn't be there.*

---

## Architecture

### Routes (4)

| Path | Purpose | Folio |
|---|---|---|
| `/` | Studio catalog — 2×n grid of square plates | §01 |
| `/studio` | Bio, engagements, contact, colophon — consolidated | §02 |
| `/bookmarks` | Living bibliography — read / watch / keep / visit | §03 |
| `/notes` | Dated stream, working-out-loud entries | §04 |
| `/work/[slug]` | Case study detail | №NN |
| `/notes/[slug]` | Note detail with running-head band | N-NNN |

The information architecture is three sections (studio, bookmarks, notes) plus work detail pages. `/about`, `/contact`, and `/colophon` were collapsed into a single `/studio` page — one room, not three doors.

### Layout Components (3)

| Component | Role |
|---|---|
| `PaperGrain` | Static SVG fractal-noise overlay, 0.055 opacity, multiply blend. The only atmospheric element. |
| `NavCoordinates` | Fixed top nav: `hyeonjoon jun · design engineer` left, `studio / bookmarks / notes` right. Hides on scroll-down, reveals on scroll-up. |
| `Folio` | Fixed top-right stamp: `HKJ / §NN / 2026`. Hidden below 960px. |

### Content Components (2)

| Component | Role |
|---|---|
| `CaseStudy` | Modular case study template — eyebrow, title, ledger, plate, editorial sections, next-project link. `useSectionReveal` handles staggered entrance. |
| `CopyEmailLink` | Email link with clipboard copy. 1.2s "copied" micro-state. No toast. |

**Total component count: 7** (including RouteAnnouncer for a11y). Nothing decorative, nothing idle.

---

## Typography

**Two fonts. The mono register is retired entirely.**

| Stack | Font | Role |
|---|---|---|
| `--font-stack-sans` | Geist Sans | Everything — chrome, labels, captions, metadata, microtype. Proportional humanist sans calibrated for both 9px and 15px. |
| `--font-stack-serif` | Newsreader (variable 400–600) | Long-form prose — case study body, note detail body. Screen-optimized serif with optical sizing. |

- Italics globally suppressed (`i, em, cite, q { font-style: normal }`)
- Emphasis through weight, tracking, and caps only
- Letter-spacing calibrated for proportional sans: 0.08em uppercased (halved from mono's 0.16em)
- Tabular figures via OpenType `tnum` feature where alignment is needed (no mono face required)
- Old-style figures (`onum`) on serif prose
- `hanging-punctuation: first last` and `text-wrap: pretty` on case study prose

---

## Palette

```
--paper:     #FBFAF6    body ground
--paper-2:   #F4F3EE    lifted surfaces (plates, cards)
--paper-3:   #E8E7E1    hairline-adjacent
--ink:       #111110    primary text
--ink-2:     #55554F    prose body, secondary
--ink-3:     #8E8E87    meta, tertiary
--ink-4:     #BFBEB8    folio, near-subliminal
--ink-hair:  rgba(17,17,16,0.10)    hairlines
--ink-ghost: rgba(17,17,16,0.06)    row hover tint
```

**No accent color.** Ink hierarchy does all the work. No Hanada blue, no gold, no signal color. The restraint is total.

---

## Homepage Composition

The homepage is an **Asian-monograph catalog** inspired by Wang Zhi-Hong and Daikoku Design Institute. The index IS the home — no eyebrow, no h1, no header text.

- **Vertical void**: `clamp(200px, 36vh, 360px)` top padding. The catalog arrives only after a real pause. The emptiness is the first thing the visitor reads.
- **2-column grid**: max-width 600px, centered. Each plate is ~290px — deliberately small so caption typography can stand alongside.
- **Square plates**: uniform 1:1 aspect ratio. Video covers autoplay (IntersectionObserver, reduced-motion aware). Image covers fill. WIP projects show `"In development · [year]"` in plate-mark microtype.
- **Museum captions**: mixed-case, sentence-shaped, period-terminated. `"Clouds at Sea. WebGL / Generative. 2026."` — not data spec lines.
- **Footer**: email (copy-on-click) + `2026 · new york`, separated by a hairline rule.

---

## Case Study Structure

Each `/work/[slug]` page follows a modular editorial template:

1. **Eyebrow** — `Work · New York · [sep] · [year] · №NNN`
2. **Title** — Geist Sans, weight 380, `clamp(32px, 4.2vw, 52px)`. View-transition shared element.
3. **Subtitle** — description from `pieces.ts`
4. **Ledger** — `dl` grid: Sector / Role / Year / Status / Tags
5. **Plate** — hero image/video in a frame with plate-marks (`HKJ / PL. №NNN`, year) and `Fig. 01` caption
6. **Modular sections** (§01–§07): stakes, paradox, editorial, process, steps, highlights, engineering, statistics, video gallery
7. **Next project** — footer link cycling through the catalog

All sections use `useSectionReveal` — IntersectionObserver-based, 8px vertical rise, 280ms, 50ms stagger capped at 5. Reduced-motion: all revealed immediately.

**View transitions**: cover image morphs from home tile to case study plate (480ms, per-slug named). Title morphs between home caption and case study h1 (420ms).

---

## `!` Moments

One hand-placed detail per page. Invisible systematically, felt on careful reading.

| Page | Detail |
|---|---|
| `/` | Active row title sits 1px proud (`translateY(-1px)`) |
| `/work/gyeol` | Second eyebrow separator is `結` instead of `·` |
| `/work/clouds-at-sea` | Coordinate line: `40°43′N 73°59′W · horizon dissolve` |
| `/studio` | `::first-letter` drop cap on the AI collaborator paragraph |
| `/bookmarks` | Butterfly Stool year reads `"1954 –"` (open-ended — still present) |
| `/notes/[slug]` | `runheadKeyword` shown at full ink in running-head band |

---

## Interaction Vocabulary

**Three gestures, applied globally:**

1. **Underline-color fade** (180ms) — inline links. Transparent → currentColor on hover. `.bookmarks__row-link` excluded (uses ghost background instead).
2. **Hairline underline slide** (220ms) — editorial `.prose a` only. Background-image line draws left-to-right, paired with color fade.
3. **Arrow-glyph slide** (200ms) — forward action indicators. 6px `translateX` on parent hover/focus.

**Motion budgets:**

- Hover: 180–220ms
- Section reveal: 280ms, 50ms stagger
- Route crossfade: 300ms
- Title morph: 420ms
- Cover morph: 480ms

Nothing on idle. No ambient motion. No cinematic set-pieces.

---

## Content State

### Projects (4)

| # | Title | Status | Cover | Case Study |
|---|---|---|---|---|
| 01 | Clouds at Sea | Shipped | Video (16:9) | Full (editorial + paradox) |
| 02 | Gyeol: 結 | Shipped | Video (3:4, 68% width) | Full (editorial + process + highlights + stats + 4 videos) |
| 03 | Pane | WIP | None (placeholder) | Minimal (paradox + stakes) |
| 04 | Sift | Shipped | Image (9:16, 54% width) | Full (editorial + process + highlights + stats) |

### Notes (1)

- **N-001**: "On restraint as the hardest move" — process reflection on removing ambient motion. Tags: process, restraint.

### Bookmarks (17 displayed, 23 total)

READ group shown: 4 books (Hara, Fukasawa/Morrison, Alexander, Rams), 5 portfolios (Kowalski, Guo, Dolle, Freiberg, Mod), 2 essays, 3 archives (Muji, TE, Vitsœ). WATCH/KEEP/VISIT groups exist but are sparse and hidden.

---

## Dependencies

```json
{
  "geist": "^1.7.0",
  "next": "16.1.6",
  "react": "19.2.3",
  "react-dom": "19.2.3"
}
```

Four production dependencies. Everything else is devDependencies (Tailwind, TypeScript, ESLint, testing).

---

## What's Retired

Across this session and the latest commits, the following were cut:

- Fragment Mono (replaced by Geist Sans)
- Gambetta variable serif (replaced by Newsreader)
- The entire mono register (proportional sans everywhere now)
- GutterStrip wheel-snap carousel
- CatalogFrame component
- Cathydolle mirror-gutter homepage layout
- Stage register (dark mode), RegisterController
- CinematicEntrance, EntranceClickGate
- CommandPalette (cmdk), ⌘K hint
- 9 unused npm packages (three.js, gsap, framer-motion, zustand, supabase, etc.)
- Zustand store, motion.ts constants, utils.ts

---

## The Design in One Sentence

A paper-ground studio catalog with four dependencies, two fonts, no accent color, and one hand-placed detail per page — where the emptiness above the first project is as designed as the project itself.
