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

### Why this is not the retired cinematic entrance

The prior Stage spec retired a 1.1s cinematic wordmark entrance. This preloader is a different primitive on four counts:

1. **Real captioned source.** The ASCII renders a real dataset (phyllotaxis, vortex, attractor) named in microtype at the bottom-left. The retired entrance had no source — just a wordmark.
2. **User-dismissed, not timer-dismissed.** Click anywhere ends it. No fixed timeline. The retired entrance ran on a 1.1s budget regardless of input.
3. **Session-gated, not per-route.** Once dismissed, it stays dismissed for the whole session across every navigation. The retired entrance fired on first hit only via `sessionStorage('hkj.entered')` but conceptually was a per-app entrance with theatrics.
4. **No wordmark, no register theatrics.** The preloader contains a dataset, not a logo. There is no "HKJ" or "Hyeonjoon Jun" reveal. The exit is a content fade, not a register handoff.

This is a guarded entrance state (data + dismissal), not a cinematic entrance (theatre + timer).

### Purpose

A single, captioned, dismissable ASCII state that establishes the site's register before the catalog is visible. Runs once per browser session (or per first-ever-visit — see Persistence below).

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
   
   Recommendation: **pre-rendered `.webm`** for web playback. Asset size budget: **≤1.5MB** for a 10s loop at 720p ASCII-density. (Initial 500KB target was optimistic; realistic compressed `.webm` of dense ASCII frames is 1–2MB.) Falls back to a static first-frame if `.webm` not supported, or under `prefers-reduced-data: reduce`.

**Source caption:** rendered in microtype at the bottom-left corner of the preloader viewport. Format: `<DATASET-NAME> · <PARAMETERS>`. Example: `PHYLLOTAXIS · 137.508° · N=1597`. The caption is the legitimization — the loop is data, not decoration, because the source is named. (No date in the caption — the dataset is timeless; date adds noise without adding meaning.)

### Display

- **Viewport:** full `100svh`, no scroll on the preloader page
- **Color scoping:** the preloader renders dark **regardless of the resolved theme**. It does NOT use `--paper` / `--ink` (those would flip to light values for visitors whose stored theme is `light`). Instead, the preloader scopes its own colors via inline literals on a `.preloader` root: `background: #0E0D09` (warm near-black), `color: #F8F5EC` (warm off-white). When the preloader dismisses, `<main>` becomes visible and inherits the resolved `--paper` / `--ink` values normally. The preloader is always dark; the rest of the site is theme-aware.
- **ASCII:** `#F8F5EC` warm off-white, centered horizontally, vertically centered or weighted slightly toward upper-third (avoid bottom-clipping on portrait viewports)
- **Source caption:** bottom-left margin, PP Neue Montreal 11px, `var(--microtype-tracking)` tracking (effective `0.11em` since preloader is forced-dark), uppercase, color `rgba(248, 245, 236, 0.55)` (damped warm off-white inline literal — the preloader is theme-independent)
- **Dismiss hint:** bottom-right margin, PP Neue Montreal 11px, 0.02em, lowercase, color `rgba(248, 245, 236, 0.55)`. Text: `click to enter →` (the `→` arrow shares the existing `.arrow-glyph` slide micro-interaction on hover — but the dismiss hint itself is not the click target; clicking ANYWHERE dismisses)

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

**Default: `localStorage` (preloader fires once, ever).** A returning visitor who has dismissed the preloader does NOT see it again on subsequent sessions. Reasons:

- Repeat visitors (recruiters re-checking a portfolio, friends sharing the URL) are higher-value than first-time visitors. Forcing them through the preloader on every fresh tab opens the same friction the prior cinematic-entrance retirement was rejecting.
- The preloader's value is "establish the register on first contact"; that's a one-time intent.
- A "reset" mechanism (clear localStorage, hard refresh) is available for the user themselves to re-experience the preloader during design iteration.

Mechanism: `localStorage.setItem('hkj.preloader.dismissed', '1')` on dismissal. Init script reads localStorage and skips render if set.

**Alternative: `sessionStorage`** — preloader fires once per browser session (every fresh tab). Available as a one-line config switch in the implementation if the user wants the more frequent ritual. NOT the default.

### Component shape

- New component: `src/components/Preloader.tsx`
- Server component renders the preloader DOM + an inline blocking `<script>` (theme-flash mitigation pattern, like `HomeViewInit`) that reads `localStorage` and sets `data-preloader-state="dismissed" | "active"` on `<html>` before paint
- CSS gates visibility: `html[data-preloader-state="active"] .preloader { display: block; }` and `html[data-preloader-state="dismissed"] .preloader { display: none; }`
- Client-side `PreloaderClient` body listens for click/keypress, runs the exit animation, writes localStorage, sets the dismissed state

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

7 pieces + 1 reserved zone + 1 empty cell = 9 cells, fitting a 3×3 grid. Layout:

```
┌────────┬────────┬────────┐
│ 01     │ 02     │ Resvd  │   row 1 — pieces №01, №02, reserved zone
│ Untitl │ Gyeol  │ (theme │
│        │        │  togl) │
├────────┼────────┼────────┤
│ 03     │ 04     │ 05     │   row 2 — pieces №03, №04, №05
│ Untitl │ Sift   │ Untitl │
├────────┼────────┼────────┤
│ 06     │ 07     │   ⌗    │   row 3 — pieces №06, №07, empty cell
│ Untitl │ Untitl │        │
└────────┴────────┴────────┘
```

**Layout rule (locked, scales with catalog):**

- **Reserved zone is always row 1, col 3.** It does not move when the catalog grows or shrinks.
- **Pieces flow in document order (`piece.order`)**, filling cells left-to-right, top-to-bottom, **skipping** the reserved cell at row 1 col 3.
- **Trailing empty cells** in the final row are left empty (visual breathing room). When pieces fill the grid exactly, no empty trailing cell appears.

Reasons for the row-1-col-3 placement:
- aino's SETTINGS area is top-right; placing the theme toggle there is register-consistent
- The gallery has top-right reserved real estate already (the `ViewToggle` lived there in the prior spec) — the reserved zone replaces or absorbs it
- Visually balances the top row; piece №01 in row 1 col 1, piece №02 in row 1 col 2 (the most-attended cells), reserved zone in row 1 col 3 as a quieter element

The `ViewToggle` (`gallery / list`) **moves into the reserved zone** as one of its primary occupants, alongside the new theme toggle. The reserved zone becomes a small UI cluster: theme toggle (sun/moon glyph) + view toggle (`gallery / list`) + (future) status indicators.

**Future scaling note:** at small catalog counts (current: 7), the reserved zone's prominence is balanced. As the catalog grows past ~16 pieces (6 rows), the reserved zone becomes a tiny percentage of total grid real estate — at that point, future-spec territory: relocate to a sidebar, repeat at row N col 3, or absorb into the nav. Not in scope for this spec.

### Mobile collapse

- Below 720px: grid collapses to **1 column**. Pieces stack in `order` sequence; **reserved zone moves to the top of the gallery, above piece №01**. The reserved zone becomes a small horizontal strip on mobile (theme toggle + view toggle inline-flex) rather than a cell. This is locked — the alternative (absorb into nav) was considered and rejected because the nav is fixed and adding the toggles there crowds the existing nav items.

### Tile rendering

Tiles use the existing `WorkPlate` component (plus the `placeholder` mode for untitled cells). Caption format unchanged from the most recent typography pass: index line (`02 — 2026`), title, role (uppercase tracked), description.

### What about the catalog list view?

The `gallery / list` toggle stays. List view of 7 pieces still renders as the typeset row index it was. The toggle's `data-home-view` attribute on `<html>` continues to govern visibility — gallery view shows the 3-up tile grid; list view shows the worklist.

---

## §3 Theme system

### Why this is not the retired Stage register

The prior Stage spec retired a per-page register switch (Stage on `/`, Paper on `/studio`, cinematic motion grammar between them). This theme system is a different primitive on three counts:

1. **Single global register, applied uniformly.** Theme is `data-theme` on `<html>` — every route inherits the same value. There is no Stage-on-this-page-Paper-on-that-page mechanism. Crossing within a session is opt-in (manual toggle) and re-paints the entire site, not just one page.
2. **Color only — no motion or composition coupling.** The theme switch re-binds `--paper` / `--ink-*`. Path-blur, long-exposure smear, lateral drift, cinematic 1.1s entrance — all retired primitives — stay retired. The theme system carries zero motion grammar of its own.
3. **User-controllable, not designer-imposed.** Time-of-day default exists for first visits; once the user toggles, their preference persists. The retired Stage register was a fixed designer choice with no user agency.

### Tokens

**Light mode tokens are unchanged from current `globals.css`** — preserved verbatim. (Note: these values diverge slightly from the monograph spec doc's prescribed values; the *implemented* values are canonical.)

**Dark mode tokens are net-new** — added as a `html[data-theme="dark"]` block that re-binds the same semantic names. No `--stage*` / `--glow*` namespace tokens; the same `--paper` / `--ink-*` family carries both registers.

```css
:root {
  /* Light mode — preserved from current globals.css */
  --paper:   #FBFAF6;
  --paper-2: #F4F3EE;
  --paper-3: #E8E7E1;
  --ink:     #111110;
  --ink-2:   #55554F;
  --ink-3:   #8E8E87;
  --ink-4:   #BFBEB8;
  --ink-hair: rgba(17, 17, 16, 0.10);
  --ink-ghost: rgba(17, 17, 16, 0.06);
  
  /* Microtype tracking — theme-responsive (overridden in dark mode). NEW token. */
  --microtype-tracking: 0.12em;
}

/* Dark mode — NEW. Re-binds semantic tokens; no namespace explosion. */
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

The `0.01em` microtype tracking delta (light → dark) is calibrated against the current Geist Sans rendering. Re-verify after PP Neue Montreal swap (Phase 3); may need a micro-adjustment if PPNM's rendering shifts the legibility threshold.

**Discipline:** all components reference the semantic tokens (`--paper`, `--ink`, etc.), NOT specific hex values. The light/dark switch is purely a re-binding of those names. Existing CSS that already references `--paper` and `--ink-*` works unchanged. Components that currently inline-hardcode warm-paper hex values (none should remain after the prior taste-polish + monograph passes, but verify in implementation) get refactored to tokens.

**No `--stage*` / `--glow*` tokens** — those were the prior Stage spec's separate-namespace tokens. This spec re-uses `--paper` / `--ink` semantically; the *values* swap based on `data-theme`. Simpler model, less name proliferation, only one set of CSS variables to touch in components.

### Switch mechanism

**Source-of-truth model:** `document.documentElement.dataset.theme` (the DOM attribute) is the **single canonical source of truth at runtime**. `localStorage('hkj.theme')` is **write-only persistence** — read once by the init script before paint, then ignored at runtime. The `useTheme` hook subscribes to the DOM attribute (not localStorage); when the toggle fires, it writes both the DOM attribute (via dataset assignment) and localStorage (for next-visit init), then notifies subscribers.

This pattern mirrors `useHomeView` and is hydration-safe: SSR doesn't know the resolved theme; the inline init script sets the attribute synchronously before paint; React hydrates and reads the attribute via `useSyncExternalStore`.

1. **First visit (no `localStorage('hkj.theme')`):**
   - Inline blocking `<script>` (in `<head>`) reads `new Date().getHours()`
   - If hour is 7–18 (inclusive 7am, exclusive 7pm), set `data-theme="light"`; else `data-theme="dark"`
   - Applied to `<html>` before paint — no flash

2. **Manual toggle in reserved zone:**
   - Sun ☀ glyph (visible in light mode) or moon ☾ glyph (visible in dark mode)
   - Click → `useTheme.setTheme(next)` → writes `document.documentElement.dataset.theme = next` AND `localStorage.setItem('hkj.theme', next)` AND notifies in-module pubsub subscribers
   - All `useTheme` consumers re-read the DOM attribute via `useSyncExternalStore`

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

### Inline blocking script ordering — locked

By Phase 6, the home route renders three inline blocking scripts before paint:

1. **`ThemeInit`** (in `<head>` via root `layout.tsx`) — runs first on every route. Sets `data-theme` on `<html>`. **Always-on**, app-global.
2. **`HomeViewInit`** (rendered ahead of `<main>` via home `page.tsx`) — runs on the home route only. Sets `data-home-view` on `<html>`.
3. **`PreloaderInit`** (rendered ahead of `<main>` via home `page.tsx`, after `HomeViewInit`) — runs on the home route only. Reads `localStorage('hkj.preloader.dismissed')`. Sets `data-preloader-state="dismissed"` if previously dismissed; otherwise sets `data-preloader-state="active"`.

The order matters because subsequent scripts may need the attributes from earlier scripts (none currently do, but the discipline is locked: `ThemeInit` first, `HomeViewInit` second, `PreloaderInit` third). All three are tiny, synchronous, and execute in document order.

`PreloaderInit` is structured the same way as `HomeViewInit` — a server component returning a plain `<script dangerouslySetInnerHTML>` tag, mounted in the home `page.tsx`. `next/script` with `strategy="beforeInteractive"` is NOT used (only valid in root layout).

---

## §4 Typography

### Faces

- **PP Neue Montreal** (Pangram Pangram, free for personal/small-commercial license) — chrome face. Replaces Geist Sans across all UI text.
- **Newsreader** — body serif. Long-form prose only. **Stays exactly as-is** — loaded via the existing `next/font/google` declaration unchanged. Only the chrome face swaps; the prose face is untouched.
- **Mono** — stays retired. Tabular figures via PP Neue Montreal's OpenType `tnum` feature.

### Geist removal — grep checklist

After Phase 3 ships, verify Geist is fully removed:

```bash
grep -rnE "geist|Geist|GEIST" src/ app/ public/ globals.css 2>/dev/null
grep -rnE "--font-geist|font-geist-sans|font-geist-mono" src/ 2>/dev/null
grep -rn "next/font/google" src/app/layout.tsx
```

Expected:
- First grep: no matches (or only matches inside comments referencing the prior face — which should also be removed if found)
- Second grep: no matches
- Third grep: should show only the Newsreader import, not Geist

The `--font-stack-sans` CSS variable name **stays the same**; only its first value changes from `var(--font-geist-sans)` to `var(--font-pp-neue-montreal)`. Components reference `--font-stack-sans` and don't need to change. **However**, any direct references to `var(--font-geist-sans)` (if any exist) WILL silently break — the grep checklist catches them.

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

1. The title's text is rendered as a sequence of `<span>` elements, one per character (split once on initial render, no per-frame DOM manipulation). The wrapper carries `aria-label={text}` (full original string) and the per-character spans are `aria-hidden="true"` — screen readers read the title naturally; the spans are presentational only.
2. Hover-enter event handler: randomly pick **2 eligible character positions** from the title.
3. **Eligibility rule (locked):** a position is eligible iff its original character matches the regex `/[A-Za-z0-9]/` — **ASCII Latin alphanumeric only.** All other characters — including extended Latin (`é`, `ü`), CJK (`결`, `結`, `決`), Cyrillic, Greek, Arabic numerals in non-Latin scripts, fullwidth digits, em-dashes, colons, spaces, and any punctuation — are **never** scrambled. They stay still during the effect.
4. **Edge case — fewer than `count` eligible positions:** if `eligible.length >= count`, scramble `count` random eligible positions. If `0 < eligible.length < count`, scramble all eligible positions. If `eligible.length === 0` (e.g., a title like `결: 結` has zero ASCII alphanumeric characters), the scramble no-ops — hover produces no visible change. Acceptable; titles with zero eligibility are rare and the silent no-op is the correct fallback.
5. Each picked character "scrambles" — cycles through 4 random alphanumeric glyphs at 40ms per swap (4 × 40ms = 160ms total), then resolves to the original character.
6. **One-shot:** the scramble fires once on hover-enter. While the cursor stays inside the tile, no further scramble. Re-enters the tile = re-fires the scramble.

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
- `src/hooks/usePreloaderState.ts` (manages localStorage by default — sessionStorage configurable via constant — and DOM attribute; `useSyncExternalStore` shape)
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

The `--font-pp-neue-montreal` variable is exposed by the `next/font/local` declaration in `app/layout.tsx`. The `variable: '--font-pp-neue-montreal'` config option in that declaration must match the name referenced here.

No new namespace tokens. No `--stage*`. No `--glow*`. The same `--paper` / `--ink-*` family carries both registers via re-binding.

---

## Phased rollout

Each phase ships independently. No phase regresses earlier phases.

### Phase 1 — Theme infrastructure

- Add `html[data-theme="dark"]` token block to `globals.css`
- Add `--microtype-tracking` variable + apply to `.plate__role`, `.worklist__role`, `.plate__meta`, footer microtype, nav microtype
- Build `useTheme` hook (`useSyncExternalStore` pattern, DOM as canonical, localStorage write-only)
- Build `ThemeInit` server component (inline head script per §3 Switch mechanism)
- Mount `ThemeInit` in root `layout.tsx`
- Verification: type check, lint, build clean. Site renders in light mode 7am–7pm local; dark otherwise (verify by clearing localStorage and reloading at different system clock times). `localStorage('hkj.theme')` persists across reloads — when set, overrides time-of-day. Manual toggle UI is NOT yet built (Phase 2); test by manually editing `data-theme` in devtools or running `document.documentElement.dataset.theme = 'dark'` in console.

### Phase 2 — Theme toggle UI (skip free-floating intermediate)

- Build `ThemeToggle` component (sun/moon glyph + rotate hover)
- Build `ReservedZone` component as a **grid-cell-shaped container** from the start — same shape it'll occupy in Phase 4. Internally positions itself absolutely or via CSS grid; externally it's a single component the home page mounts.
- During Phase 2 only (before Phase 4's 3-col grid lands), the `ReservedZone` is mounted at the **end** of the existing 2-col `.home__gallery` grid as the next cell after the last piece — visually appears on the home page in the natural slot, doesn't require the 3-col layout yet.
- The `ViewToggle` (currently fixed top-right via `position: fixed`) **stays fixed until Phase 4** — Phase 2 does NOT migrate it. Phase 4 collapses both into the grid cell together.
- Verification: theme toggle renders in `ReservedZone` cell; flips theme on `<html>`; persists to localStorage; reduced-motion respected. `ViewToggle` continues to work in its current fixed-top-right position alongside the new theme toggle's reserved-zone position (briefly two top-right UI elements until Phase 4 unifies them).

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
- Verification: preloader renders on first home-page visit; click anywhere dismisses with ~600ms staggered fade; localStorage persists; reload after dismissal does not show preloader (within or across sessions). With DevTools `Save-Data: on` header set, verify `.webm` not requested — only the static PNG fallback loads.

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
- **V9:** Preloader renders on first home-page visit ever (localStorage default). Dismisses via click anywhere. Exit animation is staggered character fade ~600ms. `localStorage('hkj.preloader.dismissed')` prevents re-render across sessions. Reduced-motion = instant dismiss. (Optional: configurable to `sessionStorage` via a one-line constant if the more frequent ritual is wanted.)
- **V10:** Preloader does NOT appear on `/work/[slug]`, `/studio`, `/bookmarks`, `/notes`.
- **V11:** All Paper routes still render correctly in both light and dark modes — no hardcoded warm-paper hex values in components.
- **V12:** `prefers-reduced-data: reduce` skips loading the preloader `.webm` (uses static PNG fallback). ScrambleText is gated on `prefers-reduced-motion`, NOT on `prefers-reduced-data` — the scramble has no asset cost (CPU only) so reduced-data does not apply to it.
- **V13:** Core Web Vitals: LCP not regressed by preloader (preloader is dismissed before LCP candidate paints — verify in real-user testing). INP unaffected.
- **V14:** Source caption renders on the preloader: `PHYLLOTAXIS · 137.508° · N=1597` (or whichever real source dataset is chosen). No date in the caption.

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

2. **Preloader localStorage vs sessionStorage.** Spec defaults to **`localStorage`** (preloader fires once, ever — returning visitors skip it). If you want the more frequent ritual ("mood-establishing every fresh tab"), it's a one-line config switch to `sessionStorage`. The default favors visitor respect; the alternative favors atmosphere.

3. **Reserved zone content.** Spec puts theme toggle + view toggle there. Future content is open: a live time/coordinate (`19:42 NY`)? A "now" line? The build SHA from the colophon? Status feed? Not blocking for this spec — the zone is built; you fill it later.

---

## Locked in this spec

- 5-section change set: preloader, 3-up hero, theme system, PP Neue Montreal, character-scramble hover
- All ship together (Phase 1–6 sequence; Phases 1–4 can ship without 5–6)
- Theme system is global, not per-page register; light/dark via `data-theme` on `<html>`
- Time-of-day default (7am–7pm light, else dark) on first visits; `localStorage` override otherwise
- PP Neue Montreal replaces Geist; Newsreader stays; mono retired
- ScrambleText: 2 characters default, alphanumeric pool, 160ms scramble, one-shot per hover-enter
- Preloader: full-viewport ASCII, real captioned source, click-anywhere dismiss, 600ms staggered fade exit, **localStorage-gated** (one-time-ever; configurable to sessionStorage), home route only, theme-independent (always dark via inline literals)

---
