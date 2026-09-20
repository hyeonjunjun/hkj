# Single-Size Type System + Column Grid — Design

**Date:** 2026-09-20
**Status:** Approved by user in brainstorm, pending implementation plan

## Context

A measured teardown of three reference portfolios — `dylan.camera`, `ard.works`, `cathydolle.com` — was carried out on 2026-09-19/20 by pulling shipped CSS and reading computed styles from the rendered DOM via Playwright at fixed viewports. The findings, not impressions:

| | dylan.camera | ard.works | cathydolle.com |
|---|---|---|---|
| Stack | Next.js + styled-components, Lenis, OGL, Mux, Sanity | Nuxt/Vue static | Next.js App Router, Tailwind, Sanity |
| Typeface | Gerstner Programm — one | RHUber-Normal + TimesLTPro | Neue Montreal — one |
| Rendered sizes | **12px, everything** (52 of 78 leaf nodes) | 16px/400 lh 22px (84 of 87 leaf nodes) | 11px/500 and 11px/400 |
| Letter-spacing | none declared | `0` in all 9 declarations | `normal` everywhere |
| Grid | 12 col → 6 col ≤768px, 12px gap | 12 col, 10px gutter, 8px baseline | 12 col, fluid |
| Palette | 3 colours | black/white | black/white |

All three resolve every width through a 12-column formula and land between 107px and 112px per column at a 1440px viewport. None of them tracks its type. None uses more than two weights.

The current `hkjstudio` build inverts this: hierarchy is carried by five type sizes, six text opacities and `tracking-[0.15em]`, while widths are decided per component.

### Current state, recorded

- **Five font families load** in `src/app/layout.tsx`. `Instrument Serif` (`font-serif`) and `Courier Prime` (`font-mono` / `font-courier`) have **zero component uses** — they are downloaded on every page load and never painted.
- `public/fonts/DepartureMono-Regular.woff2` exists on disk and is referenced by no loader.
- `font-instrument-sans` — 43 uses. `font-display` (General Sans) — 5 real uses plus 2 in tests. `font-sans` (Inter Tight) — body default, 1 explicit use.
- Type scale in `tailwind.config.ts`: `micro 11px / meta 13px / body 16px / title 19px / display clamp(2rem, 4vw, 3.25rem)`. Four of five steps sit inside an 11–19px band.
- `tracking-[0.15em]` — 11 uses. `uppercase` — 23 uses.
- `font-medium` (500) — **24 uses**, but the Instrument Sans loader requests only `["400","700"]`, so every one of them is synthesized or snapped.
- Text opacity steps in use: `/70 ×3`, `/60 ×5`, `/50 ×12`, `/40 ×21`, `/30 ×2`, `/20 ×1`. Separately `/10 ×8` and `/5 ×7` serve rules and fills.
- **Ten distinct `max-w-[…]` values** across the codebase: 1500, 1100, 1000, 900, 720, 640, 600, 560, 450, 380px. `grid-cols-12` appears exactly once.
- Three different blacks render on the case study page: `rgb(28,28,26)` (`--ws-ink`), `rgb(18,18,18)` (`--ink`), and `rgb(0,0,0)` where Inter Tight leaks through.
- Stale comments assert behaviour that no longer exists — see "Documentation corrections" below.

### The reference layout this spec follows

Measured from `cathydolle.com/case-study/ard` at 1495×990:

```
 Y     COL  SPAN   TYPE                          CONTENT
   8    1     2    11px/500 UC  lh 16.5   Cathy Dolle
   8    3     —    11px/500 UC  lh 16.5   Scroll Up to Previous Project
   8    9     1    11px/500 UC  lh 16.5   About
  99    3     4    11px/500 UC  lh 12.1   ARD               ← label
  99    7     2    11px/500 UC  lh 12.1   ROLES             ← label
  99    9     —    11px/500 UC  lh 12.1   LINK              ← label
 127    3     2    11px/400 --  lh 12.1   A team of enthusiasts…
 127    7     2    11px/400 UC  lh 12.1   Designer
 139    7     2    11px/400 UC  lh 12.1   Developer
 267    3     7    IMG  859×483  (16:9)
1232    3     7    IMG  859×483  (16:9)
2445    7     3    IMG  363×529  (portrait, offset right)
 273   11     1    MINIMAP RAIL
```

The entire page is 11px. There is no `h1`. Hierarchy comes from **weight (500 vs 400) and leading (12.1 vs 16.5) only**.

## Scope

**In scope:**

1. A single-size type system replacing the five-step scale.
2. A 12-column fluid grid replacing the ten ad-hoc `max-w` values.
3. Rebuilding `src/app/works/[slug]/page.tsx` on both.
4. The case-study scroll minimap (`cathydolle.com` pattern), desktop only.
5. Deleting the two dead font families and the orphaned font file.
6. Correcting stale documentation comments.

**Out of scope / deferred to the next brainstorm:**

- **The hero works layout on the homepage.** The user has explicitly sequenced this as the follow-on piece. `src/components/home/WorkShowcase.tsx` and `HomeIndex.tsx` are not restructured here — they inherit the new type tokens and nothing more.
- Buying or licensing a new typeface. Instrument Sans is retained. (Noted during brainstorm: the references all use licensed faces with more character — Neue Montreal is ~$50–90 from Pangram Pangram. This is a real gap but a separate decision.)
- Archive, Journal, Info and Gallery room *layouts*. They inherit the type tokens; their composition is untouched.
- Motion. The measured reference values (`200ms`, `cubic-bezier(0.65, 0, 0.35, 1)`) are recorded for later but `src/lib/motion.ts` is not changed in this spec.

## Design

### 1. Type tokens

One size for the entire site. **12px**, not the reference's 11px: Neue Montreal holds at 11px where Instrument Sans is looser, and this site carries real paragraphs where `cathydolle.com` carries a 45-character blurb. 12px is also exactly what `dylan.camera` runs sitewide. It is one token if it needs to move.

```css
--t-size:     12px;   /* the only font-size on the site */
--t-lh-tight: 14px;   /* labels, data, anything single-line */
--t-lh-read:  18px;   /* prose */
--t-w-label:  500;
--t-w-body:   400;
```

`letter-spacing: 0` everywhere. No exceptions.

### 2. Type roles

Four roles, separated only by weight, leading and case:

| Role | Spec | Applied to |
|---|---|---|
| `label` | 12 / 500 / uppercase / lh 14 | section headings, field labels, nav links |
| `value` | 12 / 400 / uppercase / lh 14 | metadata values, years, tags, captions |
| `prose` | 12 / 400 / sentence case / lh 18 | descriptions, body paragraphs |
| `wordmark` | 12 / 500 / lowercase / lh 14 | `ryan jun` |

**`text-display` is deleted.** The case study `h1` becomes `label` — 12px/500 uppercase — matching how `ARD` is set on the reference page. This is the most visually drastic consequence of the change and is intended: presence moves from type to imagery.

Implementation note: these should be exposed as Tailwind utilities (`text-label`, `text-value`, `text-prose`) bundling size + weight + leading + case, so no component re-specifies them. The existing `fontSize` keys `micro`/`meta`/`body`/`title`/`display` are removed.

### 3. Weights

**Add `500` to the Instrument Sans loader** in `src/app/layout.tsx`. It currently requests `["400","700"]` while 24 components ask for `font-medium`. Under the new system 500 is the hinge of the entire hierarchy, so it must be a real cut.

`700` is retained only if something still needs it after migration; if nothing does, drop it and load `["400","500"]`.

### 4. Ink

Collapse six text opacities to two, plus one for rules:

```css
--ink        /* full — labels, values, prose */
--ink-mute   /* 45% — secondary only, one step */
--rule       /* 10% — hairlines */
--ember      /* unchanged, the single accent */
```

The `/5` fills currently used for image placeholders become `--rule` or a dedicated `--fill` token — implementer's call, but it must be one token, not a second opacity ladder.

Resolve the three-blacks problem: `--ws-ink` is the site's ink. Inter Tight must stop leaking through as `rgb(0,0,0)` — audit the Preloader and any component relying on the `font-sans` body default.

### 5. Grid

Adopt `cathydolle.com`'s fluid formula directly:

```
columns: 12
gutter:  100vw / 180          → exactly 8px at 1440
outer:   one gutter
column:  7.7315vw             → 111.3px at 1440
```

This satisfies `12 columns + 13 gutters = 100vw` exactly. Verified: `12(7.7315) + 13(0.5556) = 100.00vw`.

**Content starts at column 3.** Columns 1–2 are reserved margin; the wordmark lives there and nothing else does.

Media is sized in column spans, never pixels:
- **7 columns** — 16:9 plate (the default)
- **3 columns** — portrait plate, offset to column 7

All ten `max-w-[…]` values are replaced by span utilities. `--edge-margin: clamp(16px, 2vw, 32px)` is superseded by the grid's outer gutter; remove it once no component references it.

Prose measure is **2 columns (~45 characters)** — deliberately narrow, and a large part of why the reference reads as editorial.

### 6. Case study layout

`src/app/works/[slug]/page.tsx`, rebuilt:

```
nav        wordmark col 1 · nav links right-aligned
header     TITLE col 3 · ROLE col 7 · YEAR col 9          label
           values directly beneath each, +24px offset      value
prose      col 3, span 2                                   prose
hero       col 3, span 7, 16:9
sections   label col 3 → body col 3 span 2
           media col 3 span 7, or col 7 span 3 (portrait)
caption    value, directly under its plate
next       col 3, LEFT-ALIGNED
```

Specific defects this fixes, all observed in a full-page render at 1440×900:

- **The metadata sidebar becomes in-column label/value pairs.** Currently a 5-field stack in `md:col-span-4` sets the row height while the description — one short line — floats alone in a 7-column well, leaving roughly 200px of empty cell. Pairing label and value within their own columns removes the dead cell.
- **Three small-type roles stop being identical.** `CLIENT` (field label), `PROCESS` (section heading) and `FIG. 01` (caption) all currently render as `11px/500/uppercase/0.15em/ink-40`. Under the new system section headings are `label` and the other two are `value`.
- **The axis break goes.** The next-project block is currently `text-center` while the whole page is left-aligned. It moves to column 3.
- **Spacing goes onto a unit.** Current values are 64/96/80/112/128px with `gap-8`/`gap-12` mixed in. Spacing becomes multiples of 8 (the gutter at 1440): 8, 16, 24, 32, 48, 64, 96.

### 7. Scroll minimap

Desktop-only rail on case study pages, measured from `cathydolle.com/case-study/ard`:

```
container   position: fixed; right: 0; top: 50%; translateY(-50%)
            width: one grid column (7.7315vw)
            margin: one gutter
            flex column, justify-center, row-gap: one gutter
            hidden below md
inner       width/height 100%, transform: scale(0.6), origin centre
            → content laid out at full column width, then scaled
thumbnails  aspect-video (16:9), object-cover
            hover:opacity-50, cursor-pointer → jumps to that section
indicator   position absolute, top 0, left 0, width 100%
            aspect-ratio 16/19, 1px border
            translates down proportionally to scroll progress
```

One thumbnail per case-study section. The rail is one grid column wide because it belongs to the same grid as the page — it is not an independently-tuned width.

A scroll-progress percentage sits bottom-left on the reference. Optional here; include only if it earns its place.

### 8. Deletions

- `Instrument Serif` and `Courier Prime` from `src/app/layout.tsx`, plus their `fontFamily` entries in `tailwind.config.ts` (`serif`, `courier`, `mono`).
- `public/fonts/DepartureMono-Regular.woff2`.
- `fontSize` keys `micro`, `meta`, `body`, `title`, `display` from `tailwind.config.ts`.
- All 11 `tracking-[0.15em]` occurrences.

**Caution:** `font-mono` currently resolves to Courier Prime through an indirection in `tailwind.config.ts`. Removing the `mono` key means any stray `font-mono` falls back to the browser default monospace. Grep for it before deleting; current count is 0 component uses, but confirm at implementation time.

### 9. Documentation corrections

These comments assert behaviour that does not exist and will mislead the next pass:

- `src/app/layout.tsx:25-30` and `tailwind.config.ts:58-64` — both claim Courier Prime renders every `font-mono` class "across every room." Zero components use it.
- `src/app/page.tsx:8` and `src/components/RoomHeader.tsx:22` — both describe "the plain serif clock." `Clock.tsx` is Instrument Sans, and its own comment correctly says "plain grotesk."

Also update `memory/project_design_system.md`, which still specifies **Fragment Mono / Newsreader / General Sans** — none of Fragment Mono or Newsreader exist in this codebase.

## Risks

1. **12px prose is small for extended reading.** The journal route is where this bites hardest. Mitigation: `--t-lh-read` at 18px gives it air, and a single token override on that one route is available if it proves uncomfortable in use. Accept for now; review after the journal has real content.
2. **Deleting `text-display` is not cosmetically reversible in an afternoon.** Every page loses its large type at once. This was explicitly chosen by the user over a two-size compromise.
3. **`font-medium` is currently synthetic.** Adding the real 500 cut will shift the apparent weight of 24 existing usages — expect the site to look slightly different even before the layout changes land.
4. **Large uncommitted surface.** Per `memory/project_uncommitted_history_gap.md`, much of `src/` has no git history, so diffs in this area will look larger than the actual change. Do not trust `git blame` here.

## Verification

- `npm run build` and `npm run lint` clean.
- `npm test` — existing tests in `Standfirst.test.tsx`, `ThesisStatement.test.tsx`, `CornerMark.test.tsx` assert on classes that this spec changes. They must be updated, not deleted.
- Rendered check at 1440×900 of `/works/placeholder-i`: exactly one computed `font-size` across all leaf text nodes; `letter-spacing: normal` on every node; no `rgb(0,0,0)` text.
- Column arithmetic: at 1440, gutter computes to exactly 8px and a column to 111.3px.

## Open items

- Whether `700` survives migration, or the loader drops to `["400","500"]`.
- Whether the scroll-progress readout is included.
- The hero works layout — next brainstorm, per the user's sequencing.
