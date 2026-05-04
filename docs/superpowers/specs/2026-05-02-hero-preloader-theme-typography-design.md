# Hero / Preloader / Theme / Typography — Design Spec

**Date:** 2026-05-02
**Status:** Draft — pending user review
**Extends:** [2026-05-02-portfolio-as-project-direction.md](./2026-05-02-portfolio-as-project-direction.md) (amended in same commit window)
**Supersedes (partially):** the home page composition from [2026-05-02-monograph-direction-design.md](./2026-05-02-monograph-direction-design.md) — 2-column grid retires in favor of 3-up tile grid for the hero. Caption discipline, view-toggle, microtype rigor, and `WorkPlate`/`WorkList`/`ViewToggle` components stay.

---

## Goal

Land five coupled changes that together transform the home page from a single-register catalog into a **dark-or-light themed site fronted by an aino-derived hero**:

1. **Preloader** — full-viewport looping ASCII video on first visit per session, captioned with its source dataset (spiral / circular / mathematical / foundation-of-life motion), dismissed by click anywhere with a ~600ms staggered exit animation.
2. **3-up tile hero** — replaces the 2-column home grid. 3 columns × N rows, each tile is a `WorkPlate`, with a reserved zone occupying one cell for the theme toggle today + future content tomorrow.
3. **Theme system** — full-site light/dark with time-of-day default (light 7am–7pm local; dark otherwise), manual toggle in the nav SETTINGS slot, `localStorage` persistence overrides time-of-day for returning visitors.
4. **Typography pass** — replace Geist Sans with **PP Neue Montreal** (Pangram Pangram, free for personal). Newsreader stays for body prose. Theme-responsive microtype tracking (~0.01em tighter in dark).
5. **Hover effects** — adopt aino's character-scramble effect on tile titles (1–3 characters, alphanumeric pool, 150–200ms scramble, once per hover enter, non-recurring while hovered, reduced-motion safe).

The five changes ship together because they couple: the theme system needs the new tokens before the hero or preloader can render correctly; PP Neue Montreal needs to load before the scramble effect renders; the preloader needs the theme tokens for its dark ground.

---

## Why this change

**The honest read.** The user's prior session feedback ("what we have right now is nothing") and the post-monograph reckoning surfaced that the warm-paper single-register direction landed too quietly for the design-engineer-at-A/V-altitude positioning the portfolio is actually claiming. The intersection-direction at `da88371` (aino + Hara + ASCII + ambient + media) reopened ASCII and ambient motion conditionally; this spec lands the conditional reopening as concrete primitives.

**The lineage stays.** Hara's emptiness, aino's microtype rigor, the documentary-equality principle, the existing caption discipline (number / title / role / description / optional meta), the four-curve easing catalog, the `useReducedMotion` and `useSectionReveal` hooks — all preserved. The 2-col grid was the visible expression of "warm restraint"; the 3-up grid in dark mode is the visible expression of "warm restraint at A/V-studio altitude." Same restraint, different register.

**What this is NOT.** Not a return to the prior Stage register (Stage was per-page, with a cinematic motion grammar and 1.1s wordmark entrance — both stay retired). Not a return to the cinematic preloader (that had no source caption and no dismissal). Not a third register layered on top of monograph (theme system is global, not page-scoped). The retired primitives stay retired; what's new is genuinely new.

---

## §1 Preloader

### Purpose

A single, captioned, dismissable ASCII state that establishes the site's register before the catalog is visible. Runs once per browser session.

### Source content

**Theme:** spiral, circular, mathematical, foundation-of-life motion. Slow, subtle, gentle, natural. Candidate datasets:

- **Phyllotaxis** — Fibonacci-spiral seed packing (137.508° golden angle), N=1000 to N=2000 points
- **Vortex / fluid simulation** — slow-rotation field
- **Lorenz attractor** — slow trace path
- **Sunflower seed packing** — concentric phyllotactic rendering
- **Galactic rotation** — slow-spiral particle field
- **Mitosis / cell division** — gentle phase progression

**Production pipeline:**

1. Generate the source video using a prompt-driven AI tool (Runway, Sora, Pika, etc.) — duration 8–20s, looping seamlessly, slow circular/spiral motion
2. Convert video → ASCII via online tool (image-to-ASCII libraries, manyfold's video-ascii, or `ffmpeg` + custom shader)
3. Output options:
   - **Pre-rendered `.webm`** — most performant; one HTTP request, browser handles playback
   - **Frame sequence as JSON** — array of strings, JS rendering loop in canvas
   - **Single static frame + CSS transform animation** — cheapest; loses the temporal dimension
   
   Recommendation: **pre-rendered `.webm`** for web playback. Asset size budget: ≤500KB for a 10s loop at 720p ASCII-density. Falls back to a static first-frame if `.webm` not supported.

**Source caption:** rendered in microtype at the bottom-left corner of the preloader viewport. Format: `<DATASET-NAME> · <PARAMETERS> · <DATE>`. Example: `PHYLLOTAXIS · 137.508° · N=1597 · 2026-05-02`. The caption is the legitimization — the loop is data, not decoration, because the source is named.

### Display

- **Viewport:** full `100svh`, no scroll on the preloader page
- **Background:** `--stage` (warm near-black, `#0E0D09`)
- **ASCII:** `--glow` (warm off-white, `#F8F5EC`), centered horizontally, vertically centered or weighted slightly toward upper-third (avoid bottom-clipping on portrait viewports)
- **Source caption:** bottom-left margin, PP Neue Montreal 11px, 0.12em tracking, uppercase, `--glow-3` (damped)
- **Dismiss hint:** bottom-right margin, PP Neue Montreal 11px, 0.02em, lowercase, `--glow-3`. Text: `click to enter →` (the `→` arrow shares the existing `.arrow-glyph` slide micro-interaction on hover — but the dismiss hint itself is not the click target; clicking ANYWHERE dismisses)

### Dismissal

- **Click anywhere** on the document → exit animation begins
- **Keypress `Enter`, `Space`, or `Escape`** → exit animation begins (a11y)
- The preloader is NOT focus-trapped; tab-key navigation skips through it to the hero

### Exit animation

- **Duration:** 600ms total
- **Pattern:** each ASCII character (or each glyph in the rendered output) fades out via `opacity: 1 → 0` with a randomized per-character delay between 0–200ms. Duration of each character's fade = 400ms. Total span: 0–600ms.
- **Hero render-in:** the hero composition (3-up grid + reserved zone + nav) renders behind the fading preloader during the entire exit window. Z-index management: preloader at z=10, hero at z=1.
- **Reduced motion** (`prefers-reduced-motion: reduce`): preloader instant-removes on dismiss. No fade. `display: none` on the next frame.
- **Reduced data** (`prefers-reduced-data: reduce`): preloader does not load the `.webm` at all. Renders the static first frame only. Dismissal still works.

### Persistence

- `sessionStorage.setItem('hkj.preloader.dismissed', '1')` on dismissal
- On any subsequent page load in the same browser session: do not render the preloader. Hero renders directly.
- New session (browser tab closed and reopened, or tab loses sessionStorage): preloader returns

### Component shape

- New component: `src/components/Preloader.tsx`
- Server component renders the preloader DOM + an inline blocking `<script>` (theme-flash mitigation pattern, like `HomeViewInit`) that reads `sessionStorage` and sets `data-preloader-state="dismissed" | "active"` on `<html>` before paint
- CSS gates visibility: `html[data-preloader-state="active"] .preloader { display: block; }` and `html[data-preloader-state="dismissed"] .preloader { display: none; }`
- Client-side `Preloader` body listens for click/keypress, runs the exit animation, writes sessionStorage, sets the dismissed state

### Mounted only on the home route

The preloader does NOT appear on `/work/[slug]`, `/studio`, `/bookmarks`, `/notes`. It is the home-route entry state, not a site-wide entry state.

---

## §2 Hero composition (3-up tile grid)

### Layout

- **Grid:** 3 columns × N rows, max-width 1480px, `margin-inline: auto`
- **Column gap:** `clamp(20px, 2vw, 36px)` — tight; tiles are the content
- **Row gap:** `clamp(32px, 4vh, 56px)` — same as monograph spec's tightened row-gap
- **Cell aspect:** plates honor `coverAspect` per piece (existing); placeholders default to `4 / 5`
- **Cell width** at 1480px max: `(1480 - 2*36) / 3 ≈ 469px` per tile

### Cell distribution

7 pieces + reserved zone = 8 cells. Layout:

```
┌────────┬────────┬────────┐
│ 01     │ 02     │ Resvd  │   row 1
│ Untitl │ Gyeol  │ (theme │
│        │        │  togl) │
├────────┼────────┼────────┤
│ 03     │ 04     │ 05     │   row 2
│ Untitl │ Sift   │ Untitl │
├────────┼────────┼────────┤
│ 06     │ 07     │   ⌗    │   row 3 — empty cell or spacer
│ Untitl │ Untitl │        │
└────────┴────────┴────────┘
```

The reserved zone is the **top-right cell** (row 1, col 3). Reasons:
- aino's SETTINGS area is top-right; placing the theme toggle there is register-consistent
- The gallery has top-right reserved real estate already (the `ViewToggle` lives there in the prior spec) — the reserved zone replaces or absorbs it
- Visually balances the top row; piece №01 in row 1 col 1, piece №02 in row 1 col 2 (the most-attended cells), reserved zone in row 1 col 3 as a quieter element

The `ViewToggle` (`gallery / list`) **moves into the reserved zone** as one of its primary occupants, alongside the new theme toggle. The reserved zone becomes a small UI cluster: theme toggle (sun/moon glyph) + view toggle (`gallery / list`) + (future) status indicators.

The **bottom-right cell of row 3** (piece №08 slot) is left empty — visual breathing room. If/when an 8th piece ships, it occupies this cell naturally.

### Mobile collapse

- Below 720px: grid collapses to **1 column**. Pieces stack in `order` sequence; reserved zone moves to top-of-page (above piece №01) or absorbs into the nav as a horizontal cluster.

### Tile rendering

Tiles use the existing `WorkPlate` component (plus the `placeholder` mode for untitled cells). Caption format unchanged from the most recent typography pass: index line (`02 — 2026`), title, role (uppercase tracked), description.

### What about the catalog list view?

The `gallery / list` toggle stays. List view of 7 pieces still renders as the typeset row index it was. The toggle's `data-home-view` attribute on `<html>` continues to govern visibility — gallery view shows the 3-up tile grid; list view shows the worklist.

---

## §3 Theme system

### Tokens

```css
:root {
  /* Light mode (existing) */
  --paper:   #FBFAF6;
  --paper-2: #F4F3EE;
  --paper-3: #E8E7E1;
  --ink:     #111110;
  --ink-2:   #55554F;
  --ink-3:   #8E8E87;
  --ink-4:   #BFBEB8;
  --ink-hair: rgba(17, 17, 16, 0.10);
  --ink-ghost: rgba(17, 17, 16, 0.06);
  
  /* Microtype tracking — theme-responsive (overridden in dark mode) */
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
  --ink-hair: rgba(248, 245, 236, 0.10);
  --ink-ghost: rgba(248, 245, 236, 0.06);
  
  /* Tighter tracking on dark for legibility */
  --microtype-tracking: 0.11em;
}
```

**Discipline:** all components reference the semantic tokens (`--paper`, `--ink`, etc.), NOT specific hex values. The light/dark switch is purely a re-binding of those names. Existing CSS that already references `--paper` and `--ink-*` works unchanged. Components that currently inline-hardcode warm-paper hex values (none should remain after the prior taste-polish + monograph passes, but verify in implementation) get refactored to tokens.

**No `--stage*` / `--glow*` tokens** — those were the prior Stage spec's separate-namespace tokens. This spec re-uses `--paper` / `--ink` semantically; the *values* swap based on `data-theme`. Simpler model, less name proliferation, only one set of CSS variables to touch in components.

### Switch mechanism

1. **First visit (no `localStorage('hkj.theme')`):**
   - An inline blocking `<script>` in `<head>` reads `new Date().getHours()`
   - If hour is 7–18 (inclusive 7am, exclusive 7pm), set `data-theme="light"`; else `data-theme="dark"`
   - Applied to `<html>` before paint — no flash

2. **Manual toggle in nav:**
   - Sun ☀ glyph (visible in light mode) or moon ☾ glyph (visible in dark mode), positioned in the reserved zone of the hero
   - Click → flips theme on `<html>` → writes `localStorage.setItem('hkj.theme', 'light' | 'dark')`
   - Toggle uses `useSyncExternalStore` (same shape as `useHomeView` from the monograph spec)

3. **Returning visit (`localStorage('hkj.theme')` exists):**
   - Inline head-script reads localStorage first; sets `data-theme` accordingly
   - Time-of-day rule is skipped — the user has expressed a preference

### Theme toggle UI

- **Component:** new `src/components/ThemeToggle.tsx`
- **Location:** in the reserved zone of the hero (top-right cell of row 1) AND optionally in the nav's SETTINGS area — but not duplicated; reserved zone is the primary location
- **Glyph:** Unicode sun ☀ and moon ☾ characters, sized 14–16px, colored at `--ink` (current theme)
- **Hover:** glyph rotates 180° over 320ms on `--ease`. The character itself does NOT scramble (the toggle is too small for the scramble to read — it just rotates)
- **Click:** flips theme. The glyph swaps via opacity crossfade (180ms). The page's CSS variables re-bind atomically.
- **a11y:** `aria-label="Switch to dark mode"` / `"Switch to light mode"`, `aria-pressed` reflects current state, keyboard-focusable

### Init script

New component: `src/components/ThemeInit.tsx` — server component, renders an inline `<script>` similar to `HomeViewInit`:

```ts
(function(){
  try {
    var stored = localStorage.getItem('hkj.theme');
    var theme;
    if (stored === 'light' || stored === 'dark') {
      theme = stored;
    } else {
      var h = new Date().getHours();
      theme = (h >= 7 && h < 19) ? 'light' : 'dark';
    }
    document.documentElement.dataset.theme = theme;
  } catch (e) {
    document.documentElement.dataset.theme = 'light';
  }
})();
```

Mounted in `app/layout.tsx` (root layout) so every page gets the theme attribute set before paint.

---

## §4 Typography

### Faces

- **PP Neue Montreal** (Pangram Pangram, free for personal/small-commercial license) — chrome face. Replaces Geist Sans across all UI text.
- **Newsreader** (Google Fonts, variable optical-size) — body serif. Long-form prose only. Unchanged.
- **Mono** — stays retired. Tabular figures via PP Neue Montreal's OpenType `tnum` feature.

### Loading

- PP Neue Montreal loaded via `next/font/local` from self-hosted `.woff2` files in `public/fonts/`
- Pangram Pangram's free distribution includes Regular (400) and Medium (500) at minimum; we use both
- Font-display: `swap` (matches Geist's behavior)
- Variable token `--font-stack-sans` updates from Geist to PP Neue Montreal
- Newsreader continues via Google Fonts as `--font-stack-serif`

### Calibration

PP Neue Montreal at the existing sizes:

- **Microtype** (9–11px, uppercase, tracked): renders cleanly. The face is calibrated for screens at small sizes.
- **Body** (14–17px, sentence case): slightly more humanist character than Geist; subtle improvement.
- **Display** (32–60px+): more authored than Geist. Visible improvement.

### Theme-responsive character spacing

A new token `--microtype-tracking` controls the tracking of all uppercase microtype rows (`.plate__role`, `.worklist__role`, `.plate__meta`, footer microtype, nav microtype). Default (light mode): `0.12em`. Dark mode: `0.11em` (`html[data-theme="dark"]` re-binds).

**Why:** white-on-dark is more legible at slightly tighter tracking; black-on-light wants slightly wider tracking. The 0.01em delta is subtle but measurable on letter density.

Microtype rows update from inline `letter-spacing: 0.12em` to `letter-spacing: var(--microtype-tracking)`.

### Sizes / weights — unchanged

Existing values from the recent typography tuning hold:
- Index (sentence case): 11px / 0.02em
- Title: 19px / weight 400 / -0.012em
- Role (uppercase): 11px / `var(--microtype-tracking)`
- Description: 14px / 1.6 line-height / 44ch
- Footer microtype: 11px / `var(--microtype-tracking)` uppercase

### Display register (new)

PP Neue Montreal Medium (500) at 32–48px / -0.02em / line-height 1.05 — used for the hero title or framing-voice statement when content fills the reserved zone in the future. Not actively used in this spec; sized so future content has a defined slot.

---

## §5 Hover effects — character-scramble

### Behavior

On hover-enter of a tile title:

1. The title's text is rendered as a sequence of `<span>` elements, one per character (split once on initial render, no per-frame DOM manipulation)
2. Hover-enter event handler: randomly pick **2 character positions** from the alphanumeric subset of the title (positions whose original character is in `[A-Za-z0-9]`)
3. Each picked character "scrambles" — cycles through 4 random alphanumeric glyphs at 40ms per swap (4 × 40ms = 160ms total), then resolves to the original character
4. **One-shot:** the scramble fires once on hover-enter. While the cursor stays inside the tile, no further scramble. Re-enters the tile = re-fires the scramble.
5. Korean characters, em-dashes, colons, and other non-alphanumeric glyphs in titles (`Gyeol: 결`) are **never** scrambled — they stay still during the effect. Only positions in the alphanumeric set are eligible.

### Restraint dial

The `<ScrambleText>` component accepts a `count` prop (default `2`). `count={1}` for very subtle (one character at a time); `count={3}` for more aino-aggressive. Site-wide setting via a constant or component default.

### Reduced motion

`prefers-reduced-motion: reduce` → scramble disabled entirely. Hover-enter on tile titles produces no visible change. Static color stays at base ink.

### Component shape

New primitive: `src/components/ScrambleText.tsx`. Wraps a string. Props: `text: string`, `count?: number` (default 2), `duration?: number` (default 160ms per character), `pool?: string` (default `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`). Returns a `<span>` containing per-character `<span>` children. Hover behavior driven by `onMouseEnter` (component-scoped — no global listener).

Used initially on `WorkPlate.title` in the home grid. Available for `CaseStudy.title` if hover scramble is later wanted there.

### Other hover states (unchanged)

- Cover image on `WorkPlate`: existing crossfade to `coverAlt` if present; 1.012 scale fallback otherwise
- `.prose a` underline-color fade — kept
- `.arrow-glyph` slide on `→` — kept
- Theme toggle glyph: 180° rotate on hover (this spec; not scramble)

---

## Components — final inventory for this spec

### New

- `src/components/Preloader.tsx` (server component for SSR + inline init script)
- `src/components/PreloaderClient.tsx` (client component for the dismissal handler + exit animation)
- `src/hooks/usePreloaderState.ts` (manages sessionStorage + DOM attribute, `useSyncExternalStore` shape)
- `src/components/ThemeToggle.tsx` (sun/moon glyph + click handler, lives in reserved zone)
- `src/components/ThemeInit.tsx` (server component, inline init script for `<head>`)
- `src/hooks/useTheme.ts` (manages localStorage + DOM attribute)
- `src/components/ReservedZone.tsx` (the hero's reserved cell; contains theme toggle + view toggle + future content slots)
- `src/components/ScrambleText.tsx` (character-scramble primitive)
- `public/fonts/PPNeueMontreal-Regular.woff2`, `PPNeueMontreal-Medium.woff2` (self-hosted PP Neue Montreal)

### Modified

- `src/app/page.tsx` — home route gets `<Preloader>` mount; `.home__gallery` shifts from 2-col to 3-col grid CSS; reserved-zone cell positioned in the grid
- `src/app/layout.tsx` — mount `<ThemeInit>` in document `<head>`; load PP Neue Montreal via `next/font/local`; remove Geist Sans loader
- `src/app/globals.css` — add `html[data-theme="dark"]` token re-bindings; add `--microtype-tracking` token; replace `--font-stack-sans` body to PP Neue Montreal
- `src/components/WorkPlate.tsx` — wrap `.plate__title` text in `<ScrambleText>`; replace inline `letter-spacing: 0.12em` on `.plate__role` and `.plate__meta` with `var(--microtype-tracking)`
- `src/components/WorkList.tsx` — same microtype-tracking token swap
- `src/components/ViewToggle.tsx` — moved into `<ReservedZone>` rather than free-floating fixed top-right
- `src/components/HomeViewInit.tsx` — unchanged in spec; verify it still works alongside `ThemeInit` and `Preloader` head-scripts

### Retired (verify absent / remove if present)

- Any direct references to Geist Sans variable name in CSS (font-stack updates wholesale via `--font-stack-sans`)
- Any per-component `--stage*` / `--glow*` references (this spec doesn't use them; uses `--paper` / `--ink` re-binding)

---

## Tokens — final added/changed

```css
/* Added */
--microtype-tracking: 0.12em;        /* light default */

/* Re-bound for dark mode (existing tokens, dark values) */
html[data-theme="dark"] {
  --paper:   #0E0D09;
  --paper-2: #16150F;
  --paper-3: #24221A;
  --ink:     #F8F5EC;
  --ink-2:   #C8C5BC;
  --ink-3:   #8E8C85;
  --ink-4:   #555349;
  --ink-hair: rgba(248, 245, 236, 0.10);
  --ink-ghost: rgba(248, 245, 236, 0.06);
  --microtype-tracking: 0.11em;
}

/* Font stack — value changes; name stays */
--font-stack-sans: var(--font-pp-neue-montreal), -apple-system, "SF Pro Text", system-ui, sans-serif;
```

No new namespace tokens. No `--stage*`. No `--glow*`. The same `--paper` / `--ink-*` family carries both registers via re-binding.

---

## Phased rollout

Each phase ships independently. No phase regresses earlier phases.

### Phase 1 — Theme infrastructure

- Add `html[data-theme="dark"]` token block to `globals.css`
- Add `--microtype-tracking` variable + apply to `.plate__role`, `.worklist__role`, `.plate__meta`, etc.
- Build `useTheme` hook (`useSyncExternalStore` pattern)
- Build `ThemeInit` server component (inline head script)
- Mount `ThemeInit` in root `layout.tsx`
- Verification: type check, lint, build clean. Site renders in light mode by default at all hours (manual override only); time-of-day rule confirmed working in browser; `localStorage('hkj.theme')` persists across reloads.

### Phase 2 — Theme toggle UI

- Build `ThemeToggle` component (sun/moon glyph + rotate hover)
- Build `ReservedZone` component (container for theme toggle + future content)
- Mount `ReservedZone` in `src/app/page.tsx` (currently as a free-floating fixed top-right; will move into the grid in Phase 4)
- Verification: toggle flips theme on `<html>`; persists to localStorage; reduced-motion respected.

### Phase 3 — PP Neue Montreal typography swap

- Acquire PP Neue Montreal Regular + Medium `.woff2` files; place in `public/fonts/`
- Replace `next/font/google` Geist with `next/font/local` PP Neue Montreal in `layout.tsx`
- Update `--font-stack-sans` in `globals.css`
- Verification: type check, build clean. All UI text renders in PP Neue Montreal. No Flash-of-Unstyled-Text. Microtype legibility verified at 9–11px.

### Phase 4 — 3-up grid + reserved zone integration

- Update `src/app/page.tsx`: change `.home__gallery` CSS from 2-col to 3-col grid
- Move `ViewToggle` from free-floating fixed top-right INTO `ReservedZone`
- `ReservedZone` becomes a real grid cell (top-right of row 1)
- Verification: home renders 3-up grid; reserved zone occupies the cell; theme toggle and view toggle both work from inside the reserved zone; mobile collapse to 1 col still works.

### Phase 5 — `ScrambleText` + tile title hover

- Build `ScrambleText` component
- Wrap `.plate__title` text in `<ScrambleText count={2}>` inside `WorkPlate`
- Verification: tile title hover triggers scramble; reduced-motion disables it; 1–3 dial works.

### Phase 6 — Preloader

- Acquire ASCII video asset (generate + convert per source pipeline above); place in `public/assets/preloader-ascii.webm` (and a static first-frame PNG fallback at `public/assets/preloader-ascii-frame.png`)
- Build `Preloader`, `PreloaderClient` components, `usePreloaderState` hook
- Mount `<Preloader>` in `src/app/page.tsx` (home route only, NOT in `layout.tsx`)
- Verification: preloader renders on first home-page visit; click anywhere dismisses with ~600ms staggered fade; sessionStorage persists; reload within session does not show preloader; new browser session does.

Each phase commits independently. Phases 1–4 can ship without Phases 5–6; Phases 5–6 are additive enhancements on top.

---

## Verification criteria

- **V1:** `data-theme="light" | "dark"` is the only theme attribute. No `data-register`. No `--stage*` / `--glow*` tokens.
- **V2:** `localStorage('hkj.theme')` overrides time-of-day on returning visits.
- **V3:** Time-of-day default produces `light` between 7am–7pm local, `dark` otherwise, on first visits without localStorage.
- **V4:** Theme toggle in reserved zone flips theme + writes localStorage atomically. Reduced-motion respected.
- **V5:** PP Neue Montreal loaded as `--font-stack-sans`. Geist Sans no longer in any CSS or `next/font` declaration.
- **V6:** Microtype tracking is `var(--microtype-tracking)` (0.12em light, 0.11em dark) on `.plate__role`, `.worklist__role`, `.plate__meta`, footer microtype, nav microtype.
- **V7:** `ScrambleText` produces a 2-character scramble on hover-enter of `.plate__title`. Disabled under reduced-motion. Skips non-alphanumeric characters (Korean, em-dash, colon).
- **V8:** Home `.home__gallery` is `grid-template-columns: 1fr 1fr 1fr`. Reserved zone occupies row 1 col 3. Mobile (≤720px) collapses to 1 col.
- **V9:** Preloader renders on first home-page visit per session. Dismisses via click anywhere. Exit animation is staggered character fade ~600ms. `sessionStorage('hkj.preloader.dismissed')` prevents re-render in same session. Reduced-motion = instant dismiss.
- **V10:** Preloader does NOT appear on `/work/[slug]`, `/studio`, `/bookmarks`, `/notes`.
- **V11:** All Paper routes still render correctly in both light and dark modes — no hardcoded warm-paper hex values in components.
- **V12:** `prefers-reduced-data: reduce` skips loading the preloader `.webm` (uses static PNG fallback). Skips non-essential ScrambleText (already disabled by reduced-motion).
- **V13:** Core Web Vitals: LCP not regressed by preloader (preloader is dismissed before LCP candidate paints — verify in real-user testing). INP unaffected.
- **V14:** Source caption renders on the preloader: `PHYLLOTAXIS · 137.508° · N=1597 · 2026-05-02` (or whichever real source dataset is chosen).

---

## Risks

**Preloader as friction.** Even one-time-per-session, a preloader is friction. Visitors who want to skim the catalog quickly hit the preloader on every fresh tab. Mitigation: dismissal is universal-click (not a button), captioned, fast (≤600ms exit), and skipped under reduced-motion / reduced-data. If real-user testing shows >10% of visitors abandon at the preloader, drop the preloader-on-first-visit behavior to preloader-on-first-ever-visit (`localStorage` instead of `sessionStorage`) or remove entirely.

**ASCII source asset cost.** Producing a quality looping ASCII-rendered video of phyllotaxis / vortex / Lorenz is non-trivial — AI video generation + frame-by-frame ASCII conversion + seamless looping. Estimated 2–4 hours of asset work plus iteration. If the asset isn't excellent, the preloader fails its mission.

**Theme system + preloader interaction.** Preloader is dark-only (per spec). On a returning visitor with `localStorage('hkj.theme', 'light')`, dismissing the preloader transitions from dark preloader to light hero — a hard register cut. Mitigation: the cut is at user-action time (their click), not idle, and the 600ms exit fade gives the eye time to adapt. Acceptable trade-off; alternatively, the preloader could read the resolved theme and render dark or light accordingly (more work, marginal benefit).

**PP Neue Montreal license drift.** Pangram Pangram's free-for-personal license is not unlimited — large commercial use requires a paid license. If the portfolio ever becomes a hosted business asset (e.g., HKJ Studio sells services), the license needs revisiting. Documented; not a blocker.

**The third (or fourth?) reinstatement of dark mode.** This direction has cycled through dark register multiple times. Mitigation: this iteration is *theme system*, not *dual register*. Path-blur, cinematic entrance, per-page register switching all stay retired. Theme is one global attribute, not a composition device. The register doesn't carry motion or layout; it only carries color. That's a meaningfully different commitment than prior cycles.

**Character scramble on Korean characters.** The `결` in `Gyeol: 결` is intentionally never scrambled. If a future title has only non-alphanumeric characters, the scramble would silently no-op. Mitigation: confirm at content time; the spec intentionally accepts no-op as the failure mode (a Korean-only title hovers with no scramble — fine).

---

## Open questions for user

The spec locks most decisions. These are the genuine remaining content/scope decisions:

1. **ASCII source dataset.** Spec lists candidates (phyllotaxis, vortex, Lorenz, sunflower seed packing, galactic rotation, mitosis). Which one — or do you want to evaluate by producing one or two and choosing? If undecided, default = phyllotaxis (most aligned with "foundation of life" + visually beautiful + algorithmically clean).

2. **Preloader sessionStorage vs localStorage.** Spec defaults to `sessionStorage` (preloader returns each new browser session). If you want it to appear *only on the very first ever visit* (and never again), it's a one-line change to `localStorage`. The trade-off is between "mood-establishing every session" vs "respect-the-visitor-after-first-meeting."

3. **Reserved zone content.** Spec puts theme toggle + view toggle there. Future content is open: a live time/coordinate (`19:42 NY`)? A "now" line? The build SHA from the colophon? Status feed? Not blocking for this spec — the zone is built; you fill it later.

---

## Locked in this spec

- 5-section change set: preloader, 3-up hero, theme system, PP Neue Montreal, character-scramble hover
- All ship together (Phase 1–6 sequence; Phases 1–4 can ship without 5–6)
- Theme system is global, not per-page register; light/dark via `data-theme` on `<html>`
- Time-of-day default (7am–7pm light, else dark) on first visits; `localStorage` override otherwise
- PP Neue Montreal replaces Geist; Newsreader stays; mono retired
- ScrambleText: 2 characters default, alphanumeric pool, 160ms scramble, one-shot per hover-enter
- Preloader: full-viewport ASCII, real captioned source, click-anywhere dismiss, 600ms staggered fade exit, sessionStorage-gated, home route only

---
