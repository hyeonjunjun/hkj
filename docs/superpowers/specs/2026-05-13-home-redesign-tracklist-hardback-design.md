# Home redesign — Tracklist Hardback

**Date:** 2026-05-13
**Status:** Design (draft, pre-implementation)
**Author:** Ryan Jun (with Claude)
**Scope:** Refine the home page (`/`) of the personal portfolio. No changes to sub-pages or sub-page architecture.

---

## Context

The portfolio direction has been locked since 2026-05-12 as **dark tracklist register + multidisciplinary BTS/Fred Again positioning**. Six earlier homepage directions were rejected over a two-week period; the user explicitly committed to the lock. This redesign refines the *execution* of that lock, not a new aesthetic.

The recent brief evolution: the user has asked to move from BTS and Fred Again as **atmospheric inspiration** to **direct visual references** (specific compositions, motifs, materials), and to lift execution to **Codrops-tier** — the level of motion and interaction polish that wins on awwwards.com / codrops.com today.

### Current state of `/`

- Single-viewport hero (`height: 100dvh; overflow: hidden`).
- 3-column body: left = setlist of 7 pieces flat (no category split), center = active piece's media plate or "In development" placeholder, right = intro lede + contact + now-playing + active piece meta.
- Top row: wordmark left, nav cluster right.
- Bottom: copyright strip, folio elsewhere.
- The catalog now contains 5 case-study pieces (LA28 wip + 4 concept) and 2 personal pieces (Sift, Gyeol). All 7 render flat as setlist rows. 4 of the 5 case studies are concepts with no media — they fall back to a generic "In development" placeholder in the center plate.

### Problems with the current state

1. **No visible case-study / personal hierarchy.** Sift and Gyeol read as siblings to the concept work, which buries the positioning anchor.
2. **Concept pieces show broken plates.** The "In development" fallback is honest but feels like a defect — visual debt on 4 of 7 rows.
3. **Motion is functional, not signature.** Cursor wake and theme toggle exist, but the page does not yet quote BTS/Fred Again at the *visual* level the brief now asks for.

---

## Goals

1. **Visible hierarchy.** Case-study pieces (§01–§05) read as the primary line; personal pieces (Sift, Gyeol) read as a quieter B-side — both in one viewport.
2. **Concept plate language.** Replace the "In development" fallback with a typographic plate. Type IS the plate. No fake imagery. Matches the dark-tracklist register and quotes Fred Again's USB001 back-cover grammar directly.
3. **Codrops-tier motion in the viewport.** Five named moves: View Transition slice on plate swap, per-letter title reveal, radial theme-toggle wipe, tonearm row hover, preserved cursor wake.
4. **No scroll on `/` desktop.** Single-viewport rule is hard-locked.
5. **Both themes work.** Light is the default; dark is the alternative; everything must work in both.
6. **Honor `prefers-reduced-motion`.** All motion has a static fallback.

## Non-goals

- New aesthetic exploration. The lock is the lock; this redesign refines execution, not direction.
- Sub-page redesigns. `/about`, `/contact`, `/notes`, `/work`, `/work/[slug]` stay as they are.
- Real mock-up assets for the 4 concept pieces (e.g., hand-designed brand posters per concept). Future work — see "Out of scope" below.
- Scroll-driven motion on `/`. Single-viewport stays.
- New runtime dependencies. View Transitions is native; no GSAP, no Framer Motion, no Three.js for this pass.

---

## Design

### 1. Composition

3-column body stays. The visible change is **SIDE A / SIDE B** in the left column.

```
┌──────────────────────────────────────────────────────────────────────┐
│ RYAN JUN®                       Work, About, Contact · NYC 14:32 · ◐ │
│ ─────────────────────────────────────────────────────────────────── │
│                                                                      │
│  SIDE A                                                              │
│  §01  LA28                          02:30 · wip   ●                  │
│  §02  AI Hardware Brand             02:14 · concept                  │
│  §03  Spatial Audio Brand           02:48 · concept                  │
│  §04  Album Cover System            03:32 · concept                  │
│  §05  Concept Car Brand             04:06 · concept                  │
│                                                                      │
│         [ CENTER PLATE — type or media for active row ]              │
│                                                                      │
│  ─── SIDE B ─────────────────────                                    │
│  §06  Sift                          06:42 · shipped                  │
│  §07  Gyeol: 결                      08:24 · shipped                  │
│                                                                      │
│  Right column unchanged: intro lede · contact · now-playing · meta   │
│ ─────────────────────────────────────────────────────────────────── │
│ © 2026 Ryan Jun                                              [folio] │
└──────────────────────────────────────────────────────────────────────┘
```

**Specifics:**

- **SIDE A label** sits above the case-study tracklist. Class: `t-eyebrow`. Copy: "SIDE A".
- **SIDE B label** sits above the personal tracklist, preceded by a hairline rule (`t-rule`). Copy: "SIDE B".
- **Personal rows render dimmer** — title color drops from `--ink` (active) / `--ink-2` (default) to `--ink-3`. Row meta drops to `--ink-4`. Indent: `clamp(8px, 1vw, 16px)` from the case-study row's left edge.
- **Row gap tightens** from current ~12px to ~6-8px to fit 7 rows + 2 labels in the same vertical space. The right column stays at its current width; only the left column changes.
- **Center plate is shared between SIDE A and SIDE B**. Personal pieces (Sift, Gyeol) have real covers — the plate renders their image as it does today.

**Edge cases:**

- Mobile (≤640px): the 3-column grid collapses to a stack. SIDE A list, plate, SIDE B list, right column — all stack vertically. Single-viewport rule relaxes here (mobile naturally scrolls).
- If a piece is reclassified personal → case-study or vice versa, it just moves to the other list — no data shape change required (the `category` field on `Piece` already drives this).

### 2. Plate language — typographic plates

Today the center plate renders piece media if available, "In development" placeholder otherwise. Four of five case studies have no media, so the placeholder is the visible state most of the time.

**New behavior:** when `piece.cover === undefined`, render a **typographic plate** instead.

```
┌─────────────────────────────────────────┐
│                                         │
│  §02                              concept│
│                                         │
│   AI HARDWARE                           │
│   BRAND                                 │
│                                         │
│                                         │
│   Brand · Product · Identity            │
│                                         │
└─────────────────────────────────────────┘
```

**Composition:**

- **Top-left:** piece code (`§02`). Class: `t-code` + `tabular`.
- **Top-right:** status (`concept`, `wip`, `shipped`). Class: `t-meta`. When status is `wip`, color flips to `--accent` (amber) to match the existing live tag.
- **Middle (anchor):** piece title at display-monumental scale. `font-size: clamp(80px, 9vw, 160px)`, `font-weight: 500`, `letter-spacing: -0.04em` (track-tightest), `line-height: 0.95`, `text-transform: uppercase`, mono. Wraps onto multiple lines if needed.
- **Bottom-left:** sector lockup (`Brand · Product · Identity`). Class: `t-meta`.

**Frame:** 1px hairline (`--ink-hair`) matches the existing image plate frame. Aspect ratio: same as the existing plate frame's default (`coverAspect ?? "4 / 3"`).

**Background:** `--paper` ground (whichever theme is active). No decorative texture. The type carries the plate.

**Light/dark behavior:** all colors use existing tokens (`--ink`, `--ink-3`, `--accent`), so light and dark themes render identically without per-theme overrides.

**Pieces affected:**

- §02 AI Hardware Brand — typographic plate
- §03 Spatial Audio Brand — typographic plate
- §04 Album Cover System — typographic plate
- §05 Concept Car Brand — typographic plate
- §01 LA28 — has video, keeps image plate
- §06 Sift, §07 Gyeol — have images, keep image plate

When a real asset later lands for any concept, dropping a `cover` field on the piece automatically swaps to the image plate. No code change needed.

### 3. Motion — Codrops-tier inside the single viewport

Five moves. Each ships independently; later moves don't block earlier ones.

**M1. View Transition slice on plate swap.**

The center plate currently swaps via key-remount + cross-fade. New behavior: horizontal **slice wipe** when active piece changes.

- Implementation: per-plate `view-transition-name: plate-${slug}` on the plate root. On slug change, the browser captures old and new states.
- CSS keyframes for `::view-transition-old(.plate-*)` and `::view-transition-new(.plate-*)`: outgoing masks out left-to-right via `clip-path: inset(0 0 0 0 → 0 0 0 100%)` over 380ms; incoming reveals right-to-left via `clip-path: inset(0 100% 0 0 → 0 0 0 0)` over 380ms, intersecting at the midpoint.
- Easing: `cubic-bezier(0.22, 1, 0.36, 1)` (matches existing wordmark route transition).
- Browser support: View Transitions API works in Chromium-based browsers and Safari TP. Firefox without VT just falls back to the prior cross-fade — graceful.
- Reduced motion: `transition-duration: 1ms` override on the VT pseudo-elements.

**M2. Per-letter title reveal on typographic plate.**

When the active piece changes to one rendering a typographic plate, the title performs a letter-stagger reveal.

- Implementation: split title into `<span>`s per character (whitespace preserved). Each span starts at `transform: translateY(0.6em); opacity: 0`. On mount/activeSlug change, stagger 20ms per letter, `cubic-bezier(0.2, 0.7, 0.2, 1)` ease, 280ms total reveal regardless of word length.
- Stagger uses CSS `animation-delay: calc(var(--i) * 20ms)` with `--i` set inline per span — no JS animation loop.
- Reduced motion: spans render at final state immediately.

**M3. Radial theme-toggle wipe.**

Today the toggle flips `data-theme="dark"` on `<html>`. New behavior: clicking the toggle launches a **clip-path circle wipe** from the click position.

- Implementation: on click, capture `e.clientX/Y`, write to CSS custom properties `--wipe-x` and `--wipe-y` on `<html>`. Then add a transient `[data-theme-wiping]` attribute that runs a 600ms keyframe: a pseudo-element overlay covers the page with the *new* theme's `--paper`, with `clip-path: circle(0% at var(--wipe-x) var(--wipe-y))` animating to `circle(150% at var(--wipe-x) var(--wipe-y))`. At the keyframe midpoint (300ms), swap `data-theme`. At end (600ms), remove the overlay.
- Why a pseudo-element overlay rather than a direct `clip-path` on `<html>`: the toggle itself needs to stay clickable during the wipe, and clipping the whole HTML element would also clip the toggle's wipe origin.
- Browser support: `clip-path: circle()` is universal.
- Reduced motion: instant theme swap, no wipe.

**M4. Tonearm row hover underbar.**

The current row hover does a color shift, number scale, and hairline rule via `::after`. Refine the hairline rule into a **2px amber tonearm bar** that slides in from the left.

- Implementation: existing `::after` element. Change `height: 1px` → `2px`. Color: `--accent`. Add `transform-origin: left center; transform: scaleX(0); transition: transform 220ms cubic-bezier(0.22, 1, 0.36, 1)`. On hover: `transform: scaleX(1)`. On exit: `transform-origin: right center; transform: scaleX(0)` — slides out the opposite direction. (Two `::after` rules with state-based origin, or a single `::after` with JS swap. CSS-only approach: use `:not(:hover)::after { transform-origin: right }` as the exit state.)
- LA28's existing live amber pulse persists. The tonearm bar appears on hover regardless of `wip` status; on LA28 the bar reads as an extension of the live pulse.
- Reduced motion: `transition: none`; bar appears at full scale immediately on hover.

**M5. Cursor wake.**

Existing speed-line cursor wake stays. No changes.

---

## Components and files

### New / changed

- **`src/components/HomeView.tsx`** (changed)
  - Split the setlist render loop into two passes: SIDE A (case-study) and SIDE B (personal). Use `piece.category` to partition.
  - Add SIDE A / SIDE B eyebrow labels with hairline rule between.
  - Personal rows render with dimmer ink classes and indent — CSS-only, no new component.
  - Tighten row gap.
  - The center plate component (currently inline `<PlateMedia>` or similar) needs to branch on `piece.cover` to render either media or `<ConceptPlate>`. Both branches set `view-transition-name: plate-${piece.slug}` on the frame.

- **`src/components/ConceptPlate.tsx`** (new, ~60 lines)
  - Single-purpose component: renders the typographic plate for a piece without media. Inputs: `piece`. Outputs: a framed plate with code, status, title (per-letter spans), sector lockup.
  - All typography from `t-*` classes plus inline overrides for the monumental title size.
  - Per-letter spans generated server-side (deterministic; no animation flicker on hydration).

- **`src/components/ThemeToggle.tsx`** (changed)
  - On click, capture coordinates, set `--wipe-x` / `--wipe-y` custom properties, add `[data-theme-wiping]` to `<html>`, defer `data-theme` swap to midpoint via `setTimeout` (300ms), remove `[data-theme-wiping]` at end (600ms).
  - Honor `prefers-reduced-motion` — skip the wipe entirely.

- **`src/app/globals.css`** (changed)
  - Add `::view-transition-group(.plate-*)`, `::view-transition-old(.plate-*)`, `::view-transition-new(.plate-*)` rules implementing M1.
  - Add `[data-theme-wiping]::before` pseudo-element overlay for M3.
  - Add `@keyframes` for the theme wipe and the per-letter title reveal.
  - Add reduced-motion overrides for all new motion.

### Unchanged

- `src/constants/pieces.ts` — data shape already supports this design (`category`, `cover?`, `status` with concept value).
- `src/constants/notes.tsx` — not touched.
- All sub-page files (`/about`, `/contact`, `/notes`, `/work`, `/work/[slug]`).
- `src/components/Frame.tsx`, `src/components/Folio.tsx` — chrome unaffected.

---

## Data model implications

None. The `Piece` interface in `src/constants/pieces.ts` already has:
- `category: "case-study" | "personal"` — drives SIDE A / SIDE B partition
- `status: "concept" | "wip" | "shipped"` — drives plate top-right label
- `cover?: CatalogCover` — when undefined, triggers typographic plate fallback
- `number` (string) — drives the `§NN` code
- `sector` (string) — drives the bottom-left lockup on the typographic plate

The current data already represents the design's needs. No migration.

---

## Trade-offs and decisions

### Why Approach 1 (Tracklist Hardback) over 2 and 3

- **Approach 2** (Map of the Soul, layered cards) risks skeuomorphic drift — the rest of the site is flat editorial mono. Stacked rotated cards would read as a different design vocabulary.
- **Approach 3** (Actual Life liner notes, text-only) removes the center plate, which has been the strongest visual anchor on the home through every iteration. Losing it is a high-risk change late in the cycle.
- **Approach 1** (Tracklist Hardback) keeps the existing 3-column architecture and replaces only what's broken (the missing-asset plates). Smallest distance from current state for the largest visible improvement.

### Why "type as plate" instead of mocking up imagery for the concepts

- Speed: 4 concept plates × hand-designed posters = days of design work. Type-as-plate ships in one component.
- Honesty: these are concept projects. A type-only plate reads as "this is the brief, the artifact follows" — accurate. A mocked poster reads as "this exists," which it doesn't yet.
- Composability: if a real concept poster lands later, dropping it into `cover` automatically replaces the typographic plate. No code change needed.

### Why no scroll on home

- The user has reconfirmed the single-viewport lock in this session (Approach A from the clarifying-question round).
- Adding scroll would also require redesigning the bottom-of-page colophon (currently sits in the viewport's bottom row) and the sub-page route transitions (which assume the home owns its own one-screen identity).
- Codrops-tier motion is still achievable inside one viewport — M1–M5 demonstrate this.

### Why native View Transitions over a motion library

- Already enabled in `next.config.ts` via `experimental.viewTransition: true`.
- The existing route transition (shared wordmark across `/` and sub-pages) uses the same API. Adding plate VT extends an existing pattern rather than introducing a new motion stack.
- No new dependency, no bundle size cost.
- Firefox falls back to default cross-fade — graceful.

---

## Testing strategy

This is a frontend visual change. Verification is primarily manual:

1. **Build passes** — `npx tsc --noEmit`, `npx eslint`, `npx next build` all clean.
2. **Visual check, light theme** — load `/`, verify SIDE A / SIDE B split renders, all 7 rows fit in one viewport, personal rows render dimmer, concept plates show typographic treatment, LA28/Sift/Gyeol still show image plates.
3. **Visual check, dark theme** — toggle, verify same as above with inverted ground.
4. **Motion check** — hover each setlist row, verify the plate slice wipe fires, the title (on concept plates) does a per-letter reveal, the row's tonearm bar slides in/out.
5. **Theme wipe** — click the theme toggle from different positions on the page, verify the wipe radiates from the click point.
6. **Reduced motion** — toggle `prefers-reduced-motion` in devtools or OS, verify all motion becomes instant.
7. **Mobile (≤640px)** — verify the stack layout renders, no horizontal overflow, SIDE A / SIDE B labels remain.
8. **Existing tests** — `npx vitest run` should still pass; no test file is being changed.

Cross-browser:
- Chrome / Edge / Arc (Chromium): full motion experience.
- Safari TP: full motion experience.
- Firefox: graceful fallback (no plate slice, no theme wipe — default cross-fade and instant theme swap).

---

## Out of scope (deliberate, do not include)

- Hand-designed concept posters per piece (AI Hardware, Spatial Audio, Album Cover, Concept Car). Future work — when one of these is real, it replaces the typographic plate via `cover`.
- Scroll-driven motion. The single-viewport lock is hard.
- Sub-page redesigns. Each sub-page (`/about`, `/contact`, `/notes`, `/work`, `/work/[slug]`) stays at its current design.
- New animation library. Native View Transitions + CSS keyframes + `requestAnimationFrame` (already used for cursor wake).
- Workload-waveform under setlist rows. Earlier roadmap item; can be added later as a row affordance without conflicting with this design.

---

## Open decisions

- **Side label copy.** "SIDE A / SIDE B" is the proposed copy. Alternatives: "CASE STUDIES / PERSONAL", "A / B", "SELECTED / ARCHIVE". Decision deferred to implementation; default is "SIDE A / SIDE B" because it carries the music-coded register most directly.
- **Tonearm color in light theme.** Amber on a light ground may read too soft. If so, override to `--ink` in light theme. Decide during implementation visual review.
- **Per-letter reveal on image plates.** Currently scoped to typographic plates only. If hover transitions on image plates feel flat by comparison, could add a brief title overlay on image plates too. Deferred — see how it reads first.

---

## Implementation order (for planning)

When the implementation plan is written from this spec, the recommended order is:

1. **SIDE A / SIDE B split** — composition change, no new components. Smallest change, biggest perceived hierarchy win.
2. **ConceptPlate component** — typographic plate without motion. Makes concept rows feel intentional immediately.
3. **M2 per-letter title reveal** — adds motion to ConceptPlate.
4. **M1 plate slice transition** — View Transition on plate swap.
5. **M4 tonearm row hover** — refine existing row hover.
6. **M3 radial theme-toggle wipe** — cinematic theme event.

Each step ships independently; each step is visually verifiable. M5 (cursor wake) is already shipped.

---

## Success criteria

- All 7 setlist pieces visible in one viewport with clear case-study / personal hierarchy.
- Zero "In development" placeholders on the home — every concept piece reads as intentional via the typographic plate.
- At least three of M1–M4 motion moves shipped and verifiable on hover/click.
- Light and dark themes both render coherently.
- `prefers-reduced-motion` honored across all new motion.
- Build clean, no regression in existing pages or sub-page route transitions.
