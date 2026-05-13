# Home redesign — Agency Portfolio register

**Date:** 2026-05-13
**Status:** Design (draft, pre-implementation)
**Author:** Ryan Jun (with Claude)
**Scope:** Replace the home page composition + introduce a site-wide chrome and page-transition system. The home becomes a single-viewport index showcasing the work catalog through a card carousel, framed by a persistent chrome layer (sitebar, CTA pill, logo, nav, back button).
**Supersedes:** [2026-05-13-home-redesign-tracklist-hardback-design.md](2026-05-13-home-redesign-tracklist-hardback-design.md) (Tracklist Hardback direction retired "for now").

---

## Context

### Direction shift

The Tracklist Hardback (mono-only, single-poster, Fred Again USB001-coded) was approved on 2026-05-13 through five review iterations and committed at `8800f0c`. Within the same day the user revisited the direction and pivoted to an **agency-portfolio register**: chrome-driven layout (sitebar pill, CTA pill, persistent nav), cover-transition page navigation, card-carousel home composition. This is the seventh direction shift in two weeks and the user is aware of that history.

The user provided a detailed input document describing the architectural pattern they want to adopt. That document references specific values "extracted from NaughtyDuk's source." This spec **adopts the architectural pattern** (chrome elements, transition state machine, carousel composition, intro animation choreography) **but uses values, tokens, and naming that originate in this project's existing brand system** — the `t-*` mono typography framework, the `--paper`/`--ink` color tokens, the Departure Mono + Geist Mono stack. The line is between studying the technique and reproducing the implementation; this spec stays on the study side.

### What stays from the existing site

- Next.js 16 App Router (no Vite migration).
- React 19.
- The 10-role `t-*` typography utility framework in `globals.css`.
- The `--paper` / `--ink` / `--accent` color token system, including light/dark theme via `data-theme` on `<html>`.
- The Departure Mono + Geist Mono font stack.
- The pieces data shape in `src/constants/pieces.ts` (`category`, `status`, `cover?`, `number`, etc.) — already restructured into case-study and personal.
- The notes data and `/notes` route.
- The `/about` and `/contact` pages.
- The `/work` and `/work/[slug]` routes (with adjustments to case-study renderers).
- Light default, dark alternative — both themes must work.
- Native View Transitions API for the shared wordmark morph between routes (still useful).

### What changes

- The home page composition (current Plate variation, 3-column setlist) is **replaced** by a card carousel inside a single viewport.
- The current top chrome (`Frame.tsx`) is **replaced** by a chrome layer of five fixtures: Sitebar (top), CTA Pill (right edge), Logo (bottom-left), Nav (top-right), Back Button (top-left when not on `/`).
- Page navigation between routes runs through a **cover-transition system**: a full-bleed overlay covers the page, the route changes underneath, the cover reveals the new page. Custom React Context state machine, GSAP-driven timelines, consuming Next's `useRouter` for the actual navigation.
- Adds **GSAP** as a runtime dependency (~50KB gzipped, core only — no club plugins).
- Adds an **intro animation** on first session-load (gated by `sessionStorage`).
- Adds a **client / discipline marquee** in the bottom bar.
- The cursor / motion vocabulary (M1-M5 from the prior spec, including the airflow shader) is **out of scope for this pass** — those moves were tied to the Tracklist Hardback aesthetic and need to be reconsidered against the new register before any of them carry forward.

---

## Goals

1. **Single-viewport home (desktop).** No scroll on `/`. The card carousel + chrome + bottom bar all fit in `h-svh`.
2. **Chrome layer reads as one system.** Sitebar, CTA pill, nav, logo, back button share a typographic register (mono, micro caps, tabular nums) and a positional grammar (corner-anchored, fixed, low-distraction).
3. **Cover transition makes navigation feel cinematic without being slow.** Cover phase ≤ 2.1s, reveal phase ≤ 1.3s, total round-trip per route change ≤ 3.5s (including Next's render time). The cover sequence is the brand's "scene change."
4. **Intro animation lands on first visit only.** Once per session, gated by `sessionStorage`. Subsequent navigations skip directly to the page-reveal portion of the transition.
5. **Concept pieces (4 of 5 case-studies have no media) render with intent, not as broken placeholders.** Each concept card face is a typographic plate inside the carousel frame — carries forward the ConceptPlate idea from the prior spec.
6. **Light and dark themes both work.** Chrome elements, cover overlay, and card faces all theme-aware via existing tokens.
7. **`prefers-reduced-motion` honored.** Cover transitions collapse to instant route swap; intro animation skipped; carousel rotation pauses or slows.

## Non-goals

- WebGL or Three.js for the carousel. DOM cards with CSS 3D perspective handle v1. WebGL upgrade is a future pass.
- The airflow cursor / typographic plate / per-letter title reveal / radial theme wipe motion from the prior spec. Those tied to the Tracklist Hardback register; reconsidered against the new register in a future pass.
- New typefaces. Departure Mono + Geist Mono stay.
- Color palette overhaul. The user's input document proposed a `#121212 / #1e1e1e / #f2f2f4` ramp; this spec uses the existing `--paper` / `--ink` ramp which serves the same purpose and preserves the working theme system.
- A separate `/work` index page redesign. The carousel is on `/`; `/work` continues to use the existing WorkIndex + ListView + CatalogPlate components. Sub-page route consistency lands in a later pass.
- Sub-page redesigns (`/about`, `/contact`, `/notes`, `/work/[slug]`).
- GSAP club plugins (SplitText, MorphSVG, etc.). Core only. Text reveals via CSS `clip-path`.
- Custom keyboard shortcuts or command palette.
- Real per-concept artifacts (microsites, demos). Tracked as a separate next-up project.

---

## Architecture

The site has three layers stacked at fixed z-indices:

```
z 10000    Preloader (existing, first-visit curtain)
z   100    TransitionCover (full-bleed overlay, only visible during transitions)
z    50    Chrome layer (Sitebar, Logo, Nav, BackButton, CTAPill, ThemeToggle, Folio)
z     1    Page content
z     0    Decorative SVG (crosshair lines on /)
```

The chrome and TransitionCover live in `layout.tsx` so they persist across routes. The page content slot (`{children}`) renders the current route's tree underneath.

---

## Chrome — components and behavior

Five chrome fixtures, all `position: fixed`. All use mono typography from the `t-*` framework, micro caps, tabular nums. All theme-aware.

### Sitebar (top center-spanning pill)

A horizontal pill anchored to the top edge with margin from the viewport edge. Three columns:

- **Left** — wordmark + discipline label. "Ryan Jun · Multidisciplinary design / engineering / direction" (uppercase mono micro).
- **Center** — live clock + GMT date. Reads from `Intl.DateTimeFormat` against America/New_York; updates every minute (no per-second tick, keeps repaints down).
- **Right** — availability signal. "Available for q3 2026" or "Selective for q3 2026" (matches existing `/about` Status row).

Visual treatment:
- Background: `--ink` (resolves to near-black in light theme, cool off-white in dark theme).
- Foreground: `--paper` (warm off-white in light, near-black in dark).
- Type: `t-footnote` (9px caps mono, weight 400, wide tracking).
- Container: `rounded-md` (~4px), padding `var(--space-1) var(--space-2)` (8/16).
- Width: animates from 0 to `calc(100% - 2 * var(--margin-page))` on first session-load via the intro animation; subsequent navigations skip the width animation (already at final state).

The Sitebar is independent of the existing `Frame.tsx` (which is now retired — see Components and files).

### Logo (bottom-left)

A wordmark monogram. Default = lowercase "rj" (matches the existing Frame `.frame__mark` letterform). Uses `t-meta` size or slightly larger if optical balance demands.

- Position: `position: fixed; bottom: var(--margin-page); left: var(--margin-page);`.
- Color: `--ink` (theme-resolved).
- Optional: wrap in `mix-blend-mode: difference` so the mark always reads against varying card backgrounds in the carousel. Mix-blend has known bug edges (Safari occasional rendering issues with backdrop-filter); ship without it first, add if visual review demands.
- No animation on hover.
- Link target: `/` (the home; same as the Sitebar wordmark would be).

### Nav (top-right cluster)

Four routes as horizontal mono caps row, anchored to the top-right and offset left by the CTA Pill's width.

Routes:
```
INDEX  ·  WORK  ·  ABOUT  ·  CONTACT
```

Visual treatment:
- Each item: `t-footnote` size, weight 400, micro caps, tabular nums, color `--ink-3` (dimmed).
- Active route: color `--ink` (full ink), prefix glyph `►` (a triangle) with `0.4em` gap. Border-left or background does not change.
- Separator dot between items: `t-sep` glyph at `--ink-4`.
- Hover (non-active items): transition to `--ink` over 180ms.
- Each item is a `<TransitionLink>` — clicking fires `startTransition(to)` instead of immediate navigation.

### CTA Pill (right edge)

A vertically centered pill anchored to the right edge with negative right inset so it sits half on, half off the viewport edge (small ~3-4px overhang). Reads as a "tab" attached to the screen.

Content:
```
[ calendar icon · 12px ]  AVAILABLE
```

Visual treatment:
- Background: `--ink` (theme-resolved).
- Foreground: `--paper`.
- Type: `t-footnote`, micro caps, tabular nums.
- Container: `rounded-l-md` (only left edge rounded; right is the off-screen edge).
- Padding: `var(--space-1) var(--space-2)`.
- Position: `position: fixed; right: -3px; top: 50%; transform: translateY(-50%);`.
- The "calendar icon" is a 12×12 SVG inlined in the component. Single stroke, current color.
- Action on click: `mailto:` link using `CONTACT_EMAIL` from existing `src/constants/contact.ts`. Plain `<a>` tag, not a TransitionLink — leaves the site to the mail client.

**Theme intent (both themes).** The pill always renders in the inverse register: in light theme it's a near-black pill against a warm-paper ground; in dark theme it's a cool off-white pill against a pure-black ground. This is intentional — the pill is meant to read as a contrasted "tab" attached to the screen edge in both themes. The same inverted-pill pattern applies to the Sitebar and BackButton for visual coherence. If a more nuanced (less contrasted) treatment is wanted, that's an open decision for a future pass.

### Back button (top-left, conditional)

Appears only when `pathname !== "/"`.

- **Behavior:** clicking fires `startTransition("/")` — uses the cover-transition system to return to the home, NOT `window.history.back()`. This guarantees a clean transition from any sub-page.
- **Visual treatment:** pill style matching the Sitebar register.
  - Background: `--ink`, foreground: `--paper`.
  - Content: `← INDEX` (arrow glyph + uppercase label, mono micro caps).
- **Geometry resolution.** The Sitebar pill is full-width along the top edge. The BackButton would otherwise overlap the Sitebar's left third. Resolution: when `pathname !== "/"`, the Sitebar emits a left-padding "reserve slot" matching the BackButton's width + gap (~120px on desktop), and drops its left-column wordmark text. The BackButton sits inside that reserved slot. The BackButton is at `z-51` (one above the Sitebar's `z-50`) so any antialiasing edges remain crisp. On mobile (≤640px), the Sitebar collapses to a single line and the BackButton replaces the Sitebar's left text entirely.
- **Conditional render:** handled by reading `usePathname()` in the component; returns `null` on `/`. The Sitebar reads the same pathname to decide whether to emit the left-pad reserve slot.

### ThemeToggle (top-right, inside Nav cluster)

The existing `ThemeToggle` component is retained but repositioned to sit at the right end of the nav cluster, immediately to the left of the CTA Pill. No behavioral change. The radial-wipe theme transition from the Tracklist Hardback spec is **dropped** — theme toggle is instant in this pass.

### Folio (bottom-right, retained)

The existing `Folio.tsx` component continues to render the per-route stamp at the bottom-right (`WORK / INDEX / 05`, `§02 / AI HARDWARE BRAND`, etc.). No changes.

---

## Index page — carousel layout

The home (`/`) renders as a single viewport. Composition:

```
┌──────────────────────────────────────────────────────────────┐
│  SITEBAR  ────────────────────────  NAV   THEMETOGGLE   CTA  │  ← chrome layer
├──────────────────────────────────────────────────────────────┤
│                                                              │
│      crosshair  ─  ─  ─                                      │
│                                                              │
│   ┌───────┐    ┌───────────┐    ┌───────┐                    │
│   │       │    │           │    │       │                    │
│   │ side  │    │ dominant  │    │ side  │  ← 3-card row      │
│   │       │    │           │    │       │                    │
│   └───────┘    └───────────┘    └───────┘                    │
│                                                              │
│      crosshair  ─  ─  ─                                      │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│ LOGO       DISCIPLINE TICKER ─────────────       TAGLINE     │  ← bottom bar
└──────────────────────────────────────────────────────────────┘
```

### The carousel

The carousel visualizes the catalog (7 pieces total: 5 case-study + 2 personal) through a **3-slot frame**: center (dominant), left (off-center), right (off-center). Only 3 cards are visually present at any time; the other 4 are hidden but still in the DOM.

**DOM model:** 7 absolutely-positioned `<article>` elements (one per piece), all children of the carousel container. Each card carries an inline CSS custom property `--slot` that controls its position. The slot value is computed as `(pieceIndex - activeIndex + 7) % 7` and represents the card's position relative to the active piece. Slot 0 = center, slot 1 = right-offset, slot 6 = left-offset, slots 2-5 = hidden (off-screen, `opacity: 0`, `pointer-events: none`).

```
piece index:   0   1   2   3   4   5   6
activeIndex=0: 0   1   2   3   4   5   6   ← slots
              CTR R  hide hide hide hide  L
activeIndex=2: 5   6   0   1   2   3   4   ← slots
              hide L  CTR R  hide hide hide
```

CSS uses `--slot` to drive transforms via a single rule with conditional values (or per-slot data attributes, equivalent). All cards transition the same `transform` and `opacity` properties:

- Slot 0 (center): `transform: translateX(0) scale(1) rotateY(0); opacity: 1;`
- Slot 1 (right): `transform: translateX(60%) scale(0.7) rotateY(-8deg); opacity: 0.55;`
- Slot 6 (left): `transform: translateX(-60%) scale(0.7) rotateY(8deg); opacity: 0.55;`
- Slots 2-5 (hidden): `transform: translateX(120%) scale(0.4); opacity: 0; pointer-events: none;`

Transitions: `transform 480ms cubic-bezier(0.22, 1, 0.36, 1), opacity 480ms`. Same easing the site already uses.

**Navigation:**
- Click a visible side card → it becomes active. `setActiveIndex(pieceIndex)`.
- Left/right arrow keys → `setActiveIndex((activeIndex ± 1 + 7) % 7)`. The carousel wraps; left from piece 0 wraps to piece 6.
- Tab focus moves through all 7 `<article>` elements in DOM order; focused-but-not-active pieces are reachable but not rendered visually (`opacity: 0`).
- Default active: `pieces[0]` (LA28).

**Aspect:** each card frame is `aspect-ratio: 4 / 5` (portrait), max width `28vw`.

### Card face rendering

Each card renders one of two faces depending on whether the piece has media:

**Image / video face** (LA28, Sift, Gyeol):
- Renders `piece.cover.src` via `next/image` or `<video>` (same path the current HomeView uses, retained verbatim).
- Aspect ratio per `piece.coverAspect`.

**Typographic face** (AI Hardware, Spatial Audio, Album Cover System, Concept Car):
- Carries forward the `ConceptPlate` component from the prior spec (the spec is retired, but this component design is reused as-is).
- Composition: top-left = `§NN` code (t-code), top-right = status (concept), middle = title at large monumental scale (clamp 60-120px, uppercase, weight 500), bottom-left = sector lockup (t-meta).
- Background: card-face fill at `--paper-2` (lifted from `--paper` by one step — subtle differentiation from page bg).
- Border: 1px `--ink-hair`.

The two faces share the same outer frame (same aspect, same border, same scale animation behavior in the carousel).

### Carousel transitions

Card swap when active changes:
- Center card scales down + translates outward to take the position of one side; the side card scales up + translates inward to take center. Duration 480ms.
- Opacity adjusts in parallel (0.55 ↔ 1.0).
- No View Transition API for the carousel swap — DOM transitions are simpler here.

### Crosshair / grid decoration

Subtle SVG lines running from the four viewport corners and meeting at the center of the carousel area. Opacity `0.06`, stroke `var(--ink)`. Pure decoration, `pointer-events: none`. Sits at z-0 behind the cards.

### Bottom bar

Anchored to the bottom of the viewport, sits inside the page content z-layer (not in chrome — the chrome's Logo and Folio are corner-anchored separately).

Three sections:
- **Left** — empty (the Logo fixture occupies this corner via the chrome layer).
- **Center** — discipline marquee. A horizontally scrolling row of comma-separated disciplines: `Brand Identity · Design Engineering · Creative Direction · Art Direction · Motion · Editorial · Product · ...`. Uses `react-fast-marquee` (~5KB gzipped) for the scroll behavior, mono caps micro typography, color `--ink-3`. Pauses on hover.
- **Right** — tagline. One sentence, fixed (not scrolling), right-aligned, color `--ink-2`. Copy: TBD by user (current placeholder: "Design, engineering, direction — one practice across surfaces."). Width capped at ~280px.

---

## Page transition system

A custom React Context state machine drives the cover overlay. Built on Next App Router (not react-router-dom).

### Phase state machine

```
   startTransition(path)
           │
   ┌───────▼───────┐
   │   covering    │  cover slides up, page blurs+scales down
   └───────┬───────┘
           │  onCoverComplete()  → router.push(path) (Next navigation)
   ┌───────▼───────┐
   │   exiting     │  disposers run, route renders new tree
   └───────┬───────┘
           │  onExitComplete()
   ┌───────▼───────┐
   │     idle      │  cover slides down, new page reveals
   └───────────────┘
```

State values: `"idle" | "covering" | "exiting"`. Default: `"idle"`.

### TransitionProvider

A client component at the app root. Owns:
- `phase: "idle" | "covering" | "exiting"` state. Default `"idle"`.
- `pendingPath: string | null` state.
- `isTransitioning: boolean` — derived as `phase !== "idle"`. Exposed in the context value so consumers don't have to compute it.
- A `disposers` ref (`Map<string, () => void>`) — components can register cleanup callbacks (rAF loops, observers, etc.) that fire during `onCoverComplete` before the new route mounts. First v1 consumer: `IntroAnimation` registers its in-flight GSAP timeline so a mid-intro navigation kills it cleanly before the page swaps. Additional consumers (carousel rAF if added, etc.) can register later.
- `startTransition(path)` — entry point used by TransitionLink and BackButton.
- `onCoverComplete()` — called by TransitionCover when the cover phase finishes. Runs disposers in order, then calls `router.push(pendingPath)` and sets phase to `"exiting"`.
- `onExitComplete()` — called by TransitionCover when the reveal phase finishes. Resets phase to `"idle"`.
- Re-entrancy guard: `startTransition` no-ops if `phase !== "idle"`.

**Exposed context contract:**
```ts
type TransitionContextValue = {
  phase: "idle" | "covering" | "exiting";
  isTransitioning: boolean;
  pendingPath: string | null;
  startTransition: (path: string) => void;
  onCoverComplete: () => void;
  onExitComplete: () => void;
  registerDisposer: (key: string, fn: () => void) => void;
  unregisterDisposer: (key: string) => void;
};
```

**Hook name:** `useRouteTransition` (the project hook). Avoids name collision with React 19's built-in `useTransition` from `react`. The file is `src/components/transition/useRouteTransition.ts`.

### TransitionCover

A full-bleed element at `z-100`, hidden by default (`visibility: hidden`), made visible only during the `covering` and `exiting` phases.

Three internal layers:
1. **Page-content layer** — not in TransitionCover itself; this is the page content slot. Targeted by GSAP via a **stable selector `[data-page-root]`** placed on a `<main>` wrapper around `{children}` in `layout.tsx`. The selector is the explicit target — never use "body's first element" or similar fragile querySelectors, since the body's actual first element depends on chrome mount order.
2. **Border layer** — a `div` with `border-style: solid; border-color: var(--ink); border-width: 0`. Animates to `border-width: 12vh` during the cover phase, creating a "frame closing inward" effect.
3. **Fill layer** — a `div` with `height: 0%`, `background: var(--ink)`. Animates to `height: 100%` rising from the bottom, then back to `0%` during reveal.

There is no logo / GIF in the center for this first pass — the cover is a clean ink fill. Open decision: add a wordmark animation later if reviews demand spectacle.

### GSAP timelines

The cover animation is a single `gsap.timeline()` with the cover sequence offsets in seconds. The reveal animation is a separate timeline. Both call `onCoverComplete` / `onExitComplete` as `onComplete` callbacks.

**Cover phase** (the page exits, cover comes in). Targets, properties, and offsets calibrated to this site's existing 380-600ms motion vocabulary — *not* reproduced from any third-party reference:

- Page content (`[data-page-root]`): `scale: 1 → 0.96`, `filter: blur(0) → blur(6px)`, `opacity: 1 → 0.5` over **0.9s**, ease `power2.in`, offset `+0s` (ends at 0.9s).
- Border div: `border-width: 0 → 12vh` over **0.8s**, ease `expo.inOut`, offset `+0.3s` (ends at 1.1s).
- Fill div: `height: 0% → 100%` over **0.8s**, ease `expo.inOut`, offset `+0.5s` (ends at 1.3s).
- Hold at full cover: **0.8s** (no animation; pure GSAP `.to({}, { duration: 0.8 })` for timeline pacing).

Total cover duration: **2.1s** before `onCoverComplete()` fires. The `onCoverComplete` callback is attached to the *hold tween's* `onComplete` — the last tween in the timeline — guaranteeing the fill layer is fully opaque (100% height) before disposers run and `router.push` is called. This is snappier than the input reference because this site's existing motion vocabulary trends faster (the prior plate VT was 380ms, the prior theme wipe was 600ms — restraint is the brand).

**Reveal phase** (the new page appears, cover leaves):
- Fill div: `height: 100% → 0%` over **0.7s**, ease `expo.inOut`, offset `+0.2s` (ends at 0.9s).
- Border div: `border-width: 12vh → 0` over **0.7s**, ease `expo.inOut`, offset `+0.4s` (ends at 1.1s).
- Page content (`[data-page-root]`): `scale: 0.96 → 1`, `filter: blur(6px) → blur(0)`, `opacity: 0.5 → 1` over **0.9s**, ease `power2.out`, offset `+0.4s` (ends at 1.3s).

Total reveal duration: **1.3s** before `onExitComplete()` fires. The `onExitComplete` callback is attached to the page-content tween's `onComplete` — the longest path in the reveal timeline.

Total round-trip per navigation: ~3.5s (cover 2.1s + Next render ≤0.1s + reveal 1.3s). Sub-pages return to home via the BackButton flow through the same timeline.

### TransitionLink

A thin wrapper around `<Link>` from `next/link` that intercepts the click and routes through `startTransition`:

```tsx
function TransitionLink({ to, children, ...props }) {
  const { startTransition, isTransitioning } = useRouteTransition();
  const pathname = usePathname();
  const isActive = pathname === to;

  return (
    <Link
      href={to}
      onClick={(e) => {
        // Allow modifier-key clicks to behave as native (open in new tab, etc.)
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        if (!isTransitioning && !isActive) startTransition(to);
      }}
      {...props}
    >
      {isActive && <span className="mr-1" aria-hidden>►</span>}
      {children}
    </Link>
  );
}
```

The `<Link>` `href` is preserved so right-click "Open in new tab" / "Copy link" still works. Only un-modified left-clicks are intercepted.

### Why a custom state machine over native View Transitions

Native View Transitions can't deliver this exact sequence (border + fill + page-content choreographed over 2.1s with offsets). VT is optimized for fast same-state transitions, not for cinematic scene changes. The custom state machine + GSAP is the right tool for this specific cover-then-uncover behavior. View Transitions can still be used for the shared wordmark morph between routes (still works — the wordmark VT and the cover overlay don't conflict because the cover overlay is `z-100` above the VT).

### `next.config.ts`

`experimental.viewTransition: true` stays on (needed for the wordmark morph). No new Next config required.

---

## Intro animation (first session-load)

Gated by `sessionStorage.getItem("rj-intro-played")`. If absent, plays once and writes the flag.

**Preloader handoff.** The existing `Preloader.tsx` runs its own first-visit curtain (separate `sessionStorage` key, ~2.8s). The IntroAnimation must not start while the Preloader is still on screen.

Handoff mechanism:
- Preloader dispatches `window.dispatchEvent(new CustomEvent("rj-preloader-done"))` when its fade-out finishes.
- IntroAnimation's mount effect listens for that event. If the Preloader's `sessionStorage` flag is already set on mount (i.e., this isn't a first visit), IntroAnimation runs immediately. Otherwise it waits up to 4s for the event before starting (timeout fallback in case the Preloader was skipped for any reason).
- Both sessionStorage flags (`rj-curtain-shown` and `rj-intro-played`) are independent. First visit: Preloader runs, then Intro runs. Second visit: neither runs.

Sequence (offsets are measured from the moment IntroAnimation actually starts, post-Preloader):
1. Page mounts with chrome elements in their initial states:
   - Sitebar: `width: 0` (invisible).
   - Cards: `scale: 0.96`, `filter: blur(6px) saturate(0)`, `opacity: 0.4`.
   - Bottom bar: `opacity: 0`.
2. **0.0s** — Sitebar animates `width: 0 → calc(100% - 2 * var(--margin-page))` over **0.9s**, ease `power3.inOut`.
3. **0.9s** — Sitebar inner text reveals via `clip-path: inset(0 0 0 100%) → inset(0 0 0 0%)` per text node over **0.5s**, ease `expo.inOut`. CSS animation, no GSAP.
4. **1.0s** — Cards animate to final state: `scale: 1`, `filter: blur(0) saturate(1)`, `opacity: 1`. Staggered 80ms per card (3 visible cards = last starts at 1.16s, ends 1.86s). Each card takes 0.7s, ease `power2.out`.
5. **1.3s** — Bottom bar fades in: `opacity: 0 → 1` over **0.5s** (ends 1.8s).

Total intro: ~**1.86s** before page is fully interactive (longest path: cards).

Reduced-motion: skip the entire intro, render everything at final state immediately. Still writes the `sessionStorage` flag (so the user doesn't get the intro on a future toggle of their preference).

**Disposer integration.** IntroAnimation registers its GSAP timeline via `registerDisposer("intro", () => timeline.kill())` on mount. If the user clicks a nav link mid-intro, `startTransition` runs and `onCoverComplete` (when it fires) calls the disposer, killing the intro timeline cleanly before navigation completes.

---

## Concept piece face — typographic plate

When a card's piece has `cover === undefined`, the card renders a `<ConceptPlate>` instead of an image. The full component composition is described below — no need to read prior (superseded) docs.

Composition:
- Top-left: `§NN` (t-code, tabular).
- Top-right: status (t-meta) — typically "concept" for this set.
- Middle: title at `clamp(60px, 7vw, 120px)`, uppercase, weight 500, mono, tracking `-0.04em`, line-height `0.95`. Renders wrapped at word boundaries; `overflow-wrap: anywhere` allows a long word to break.
- Bottom-left: sector lockup (t-meta).

Accessibility:
- Parent of title carries `aria-label={piece.title}`.
- Per-letter spans are not used in this pass (the per-letter reveal from the prior spec depended on the typographic plate being the only thing on screen — inside the carousel frame it would be too busy). Title is one text node.

The plate respects the card's `aspect-ratio: 4 / 5` frame. Type sits inside generous padding so the composition reads as a poster.

---

## Theme integration

All chrome elements and the cover overlay use theme-token colors:

- `--paper` = page background. Light: warm off-white `#FBFAF6`. Dark: pure black `#000000`. Existing tokens.
- `--ink` = foreground. Light: `#000000`. Dark: cool off-white `#F8F8F8`. Existing tokens.
- Sitebar / BackButton / CTAPill background = `--ink` (dark pill on light bg in light theme, light pill on dark bg in dark theme).
- Sitebar / BackButton / CTAPill foreground = `--paper` (inverse of bg, matches existing inverse-pill pattern).
- Cover overlay fill = `--ink`. The fill color resolves to the *current* theme's ink — so transitioning from light to light: cover is black ink filling up. From dark to dark: cover is off-white ink filling up. Consistent with the brand's contrast register.
- Theme toggle is instant in this pass (the radial wipe from the prior spec is out).

---

## Reduced motion / accessibility

Every motion move has a static fallback:

- **Cover transition under reduced-motion:** the state-machine semantics are **preserved end-to-end** — the timeline still runs, `onCoverComplete` still fires, disposers still run, `router.push(pendingPath)` still happens, `onExitComplete` still fires, `phase` returns to `"idle"`. Only the *visible* animation collapses: the cover timeline becomes a single `gsap.to(fillRef, { height: "100%", duration: 0.1 })` with `onComplete: onCoverComplete`, and the reveal timeline becomes a single `gsap.to(fillRef, { height: "0%", duration: 0.1 })` with `onComplete: onExitComplete`. The page-content blur/scale/opacity tweens are skipped entirely. Visual outcome: a brief 100ms ink flash on each route change, no choreography.
- **Intro animation under reduced-motion:** entire intro skipped, elements render at final state immediately. `sessionStorage` flag is still written (so toggling reduce-motion later doesn't re-run the intro).
- **Carousel rotation:** transitions drop to `0.01ms` via the existing `@media (prefers-reduced-motion: reduce)` global rule. Active piece swap is instant.
- **Marquee ticker:** static (CSS `animation-play-state: paused`).
- **Wordmark morph between routes** (existing View Transitions feature): unchanged behavior; native VT honors reduced-motion already.

Keyboard:
- TransitionLink works with keyboard (left-click intercepts only; Enter key still triggers click).
- Carousel: left/right arrow keys swap active card. Tab moves focus through visible cards.
- Theme toggle: existing keyboard behavior preserved.

Screen readers:
- Sitebar marked `role="banner"` with `aria-label="Site header"`.
- Nav marked `role="navigation"` with `aria-label="Primary"`.
- BackButton: `aria-label="Return to index"`.
- Cover overlay: `aria-hidden="true"` (decorative, doesn't affect screen reader navigation).
- Active card in carousel: `aria-current="true"`.

---

## Browser support

- **Chromium 111+ / Edge 111+ / Arc:** full motion. GSAP cover transition, native VT wordmark morph, all CSS animations.
- **Safari 18+:** GSAP cover transition works; CSS animations work. The native VT wordmark morph between routes requires Safari 18.2+ for stable same-document VT integration with Next's experimental flag — on Safari 18.0-18.1, the wordmark morph degrades to instant swap (acceptable). Next 16's `experimental.viewTransition` is still flagged as experimental upstream; behavior may shift in future Next releases.
- **Firefox:** GSAP cover transition runs identically (GSAP is browser-agnostic). CSS animations work. The wordmark morph between routes degrades to instant in Firefox via the existing `if (document.startViewTransition)` guard. Everything else works.

---

## Components and files

### New files

- **`src/components/transition/TransitionProvider.tsx`** (~100 lines).
  Context provider with the phase state machine. Consumes `useRouter` from `next/navigation`. Exposes `startTransition`, `onCoverComplete`, `onExitComplete`, `registerDisposer`, `unregisterDisposer`. Throws if `useRouteTransition` is called outside the provider.

- **`src/components/transition/TransitionCover.tsx`** (~150 lines).
  The cover overlay element. Owns the GSAP timelines (cover phase + reveal phase). Subscribes to `phase` from context: when phase becomes `"covering"`, plays the cover timeline; when phase becomes `"exiting"`, plays the reveal timeline. Calls `onCoverComplete` / `onExitComplete` from the appropriate timeline `onComplete` (hold tween for cover, page-content tween for reveal).
  Internal refs: `borderRef`, `fillRef`. The page-content tween targets `[data-page-root]` (the `<main>` wrap in layout.tsx) via a stable selector — never the body's first element.

- **`src/components/transition/TransitionLink.tsx`** (~30 lines).
  Wraps `next/link`'s `Link`. Intercepts click, calls `startTransition`. Active-route detection via `usePathname`.

- **`src/components/transition/useRouteTransition.ts`** (~10 lines).
  Hook that consumes the context. Named `useRouteTransition` (not `useTransition`) to avoid name collision with React 19's built-in `useTransition` from `react`. Throws if called outside the provider.

- **`src/components/chrome/Sitebar.tsx`** (~120 lines).
  The top pill. Three columns: wordmark+discipline (left), live clock+date (center), availability (right). Live clock uses `setInterval` at 60s, cleaned up on unmount.

- **`src/components/chrome/CTAPill.tsx`** (~40 lines).
  The right-edge pill. SVG calendar icon, mailto link to `CONTACT_EMAIL`.

- **`src/components/chrome/BackButton.tsx`** (~30 lines).
  Conditional render via `usePathname() !== "/"`. Fires `startTransition("/")` on click.

- **`src/components/chrome/Logo.tsx`** (~25 lines).
  The bottom-left wordmark. TransitionLink to `/`.

- **`src/components/chrome/Nav.tsx`** (~50 lines).
  The top-right cluster. Four TransitionLinks (INDEX, WORK, ABOUT, CONTACT) with separators. Hosts the ThemeToggle at the right end.

- **`src/components/home/IndexCarousel.tsx`** (~250 lines).
  The 3-card carousel for the home. Reads `PIECES`, partitions by `category`, renders card row with active-piece state, click + keyboard navigation, CSS 3D transitions.

- **`src/components/home/ConceptPlate.tsx`** (~50 lines).
  Typographic card face. Carries forward unchanged from the prior spec.

- **`src/components/home/DisciplineTicker.tsx`** (~30 lines).
  Wraps `react-fast-marquee`. Hardcoded discipline list.

- **`src/components/home/CrosshairLines.tsx`** (~15 lines).
  Decorative SVG. Four lines from corners to center.

- **`src/components/home/IntroAnimation.tsx`** (~80 lines).
  Client component that runs the intro GSAP timeline on mount if `sessionStorage` flag is absent. Writes the flag. Returns `null` (no DOM beyond what's already there — the intro animates existing chrome and cards via their CSS state classes).

### Changed files

- **`src/app/layout.tsx`** (changed).
  - Wrap `<html>` body content in `<TransitionProvider>`.
  - Mount chrome fixtures: `<Sitebar />`, `<Nav />`, `<Logo />`, `<BackButton />`, `<CTAPill />`. Remove the existing `<Frame />`.
  - Mount `<TransitionCover />` at z-100 (above everything except the Preloader at z-10000).
  - **Wrap `{children}` in `<main data-page-root>{children}</main>`** so the TransitionCover GSAP timeline can target a stable selector. The `data-page-root` attribute is the single source of truth for what gets blur/scale/opacity-animated during a transition.
  - Keep `<Folio />`, `<PaperGrain />`, `<Preloader />`, `<RouteAnnouncer />`.
  - Keep the existing theme init script in `<head>`.
  - Mount `<IntroAnimation />` at the body root (no DOM, only effects).

- **`src/components/HomeView.tsx`** (replaced or stripped).
  - Either delete entirely and replace with `<IndexCarousel />`, or strip to a thin shell that renders `<CrosshairLines />`, `<IndexCarousel />`, and the bottom bar (DisciplineTicker + tagline).
  - The current 3-column setlist composition is removed.
  - The existing cursor wake JS is removed.
  - The right-column intro lede + NowPlaying — drop for now; can re-introduce in a later pass.

- **`src/components/Frame.tsx`** (removed).
  - Functionality split: top mark → Sitebar wordmark + Logo (bottom-left); top nav → Nav (top-right); ThemeToggle → nested into Nav. The `Frame.tsx` file is deleted.

- **`src/app/globals.css`** (changed).
  - Add chrome-layer CSS variables for the pill geometry (if any not already covered by existing tokens).
  - Add intro animation CSS (state classes, clip-path keyframes for text reveal).
  - Add carousel transition CSS (the 480ms transform transitions between card slots).
  - Remove the dead Tracklist Hardback-specific rules: `::view-transition-old(plate)`, `::view-transition-new(plate)`, `[data-theme-wiping]::before`, `:where([data-initial-render]) .concept-plate__title span` letter-rise. None of these are referenced by the new design.

- **`package.json`** (changed).
  - Add `gsap` (core only, latest).
  - Add `react-fast-marquee` (latest).

### Unchanged files

- `src/constants/pieces.ts` — data shape supports both card faces unchanged.
- `src/constants/notes.tsx` — not touched.
- `src/constants/contact.ts` — provides `CONTACT_EMAIL` to the CTA Pill.
- `src/components/ThemeToggle.tsx` — kept; nested inside Nav.
- `src/components/Folio.tsx` — kept; bottom-right per-route stamp.
- `src/components/PaperGrain.tsx` — kept.
- `src/components/Preloader.tsx` — kept; runs before the IntroAnimation. They don't conflict because Preloader is once-per-session and IntroAnimation is too.
- `src/components/NowPlaying.tsx`, `LiveTime.tsx`, `PixelEQ.tsx` — kept in the codebase, but the home no longer mounts them. The /about page could surface them in a later pass.
- All sub-page routes (`/about`, `/contact`, `/notes`, `/work`, `/work/[slug]`).

---

## Implementation order

Each step ships independently and is visually verifiable. **Reduced-motion overrides are written inline as part of every step that introduces motion**, not deferred to a final step — a step is not "done" until both the full-motion and reduced-motion paths work.

1. **TransitionProvider + TransitionCover + TransitionLink scaffolding.** No visible behavior yet — provider mounted, cover invisible. Verify the state machine ticks through phases when `startTransition` is called manually (devtools). Includes the `<main data-page-root>{children}</main>` wrap in layout.tsx.

2. **Wire BackButton + Nav links to use TransitionLink.** Route changes run through the state machine but with no animation. Verify navigation still works end-to-end. The existing `Frame.tsx` is still in place at this step — chrome replacement happens in step 4.

3. **GSAP cover timeline + reduced-motion fallback.** The cover overlay animates against `[data-page-root]`. The existing `Frame.tsx` chrome is still rendered above the cover (z-50 below cover's z-100, so visually correct). Includes the reduced-motion code path (single 100ms tween, state-machine preserved). Verify cover-then-reveal sequence renders correctly on each route change; verify reduced-motion path is functional and disposers still fire.

4. **Chrome replacement: Sitebar + Logo + Nav + CTAPill + BackButton.** Removes `Frame.tsx`. The new chrome layer replaces the existing top frame across all routes. Theme-aware (light/dark via existing tokens). Static at this step — no intro animation yet. Verify all routes render with the new chrome and no visual regressions.

5. **Replace HomeView with IndexCarousel (image faces only first).** The home renders the 7-piece carousel (3-slot frame), image pieces (LA28, Sift, Gyeol) render real media; the 4 concept pieces render a temporary placeholder pending step 6. Includes the reduced-motion override for carousel transitions (instant swap). Keyboard navigation (arrow keys, Tab) works.

6. **ConceptPlate card faces.** The 4 concept pieces now render typographic plates inside the carousel frames per §"Concept piece face" below.

7. **DisciplineTicker + tagline bottom bar.** The home's bottom strip is complete. Includes reduced-motion override (marquee paused).

8. **Crosshair lines decoration.** Subtle background detail. No motion.

9. **IntroAnimation + Preloader handoff.** First-session entrance choreography lands. Includes reduced-motion path (intro skipped, final state immediate, sessionStorage still written). Verify on first session-load that the Preloader handoff event fires correctly and the intro waits for it.

Steps 1-4 are foundational; the page is navigable + cinematic after step 3 (and chrome lands in step 4 without breaking transitions). Steps 5-7 build the visible home. Steps 8-9 are polish. Each step lands reduced-motion as it lands its motion.

---

## Testing strategy

Manual verification:

1. **Build clean.** `npx tsc --noEmit`, `npx eslint`, `npx next build` all pass.
2. **Chrome visual, light theme.** Load `/`, verify Sitebar (top), Nav (top-right), Logo (bottom-left), CTAPill (right edge with overhang), Folio (bottom-right). No overlap.
3. **Chrome visual, dark theme.** Toggle, verify all chrome inverts via theme tokens.
4. **Sub-page chrome.** Navigate to `/about`, `/contact`, `/notes`, `/work`, `/work/[slug]`. Confirm Sitebar's left wordmark drops in favor of the BackButton on each sub-page.
5. **Cover transition.** Click each Nav link. Verify cover sequence: page blur+scale, border closes, fill rises, hold, fill drops, border opens, page reveal. Round-trip time ≤ 3.5s.
6. **BackButton.** From each sub-page, click `← INDEX`. Verify same cover sequence runs in reverse direction (cover is the same; only `pendingPath` differs).
7. **Carousel.** Verify the 3-card row on `/`. Click side cards — they slide to center. Press arrow keys — same. Tab focus reaches each card.
8. **Concept card faces.** Verify §02-§05 render typographic plates with title, code, status, sector inside the card frame.
9. **DisciplineTicker.** Bottom-center scrolls. Hover pauses.
10. **Intro animation.** Hard reload `/` (clear sessionStorage first). Verify sequence: Sitebar widens, text reveals, cards focus in, bottom bar fades. Reload again — intro should NOT re-fire.
11. **Reduced motion.** Toggle OS / devtools setting. Verify cover is near-instant, intro is skipped, carousel transitions are 100ms.
12. **Mobile (≤640px).** Layout stacks: Sitebar may collapse to a single line, Nav may move to a hamburger or simpler row, cards stack vertically with scroll. (Detailed mobile composition deferred — see Open decisions.)
13. **Existing tests.** `npx vitest run` should still pass.

---

## Success criteria

- All 7 routes (`/`, `/about`, `/contact`, `/notes`, `/work`, `/work/[slug]`, plus a 404) navigate via the cover transition. No route uses a hard cut (except under reduced-motion).
- Chrome layer renders consistently across all routes; BackButton appears only off-`/`.
- Home carousel shows all 7 pieces (5 case-study + 2 personal) with active piece in center; concept pieces use typographic plates.
- Intro animation plays exactly once per session.
- Light and dark themes both work for chrome, cover, and cards.
- `prefers-reduced-motion` honored across cover, intro, carousel.
- Build clean. No new console errors. No regression on sub-page routes.
- GSAP and react-fast-marquee are the only two new runtime dependencies.

---

## Open decisions

- **Mobile layout.** The single-viewport rule relaxes on mobile (existing behavior). The detailed mobile composition for the carousel, chrome stack, and ticker is deferred to implementation visual review. First pass will use stacked cards + simplified chrome (Sitebar collapses to one row, Nav collapses to a hamburger or dropped routes).
- **Cover overlay center content.** First pass: empty (clean ink fill). Future passes could add a wordmark animation or rotating monogram.
- **Discipline ticker copy.** First pass uses: `Brand Identity · Design Engineering · Creative Direction · Art Direction · Motion · Editorial · Product`. User to refine.
- **Tagline copy** (bottom-right, fixed). First pass: "Design, engineering, direction — one practice across surfaces." User to refine.
- **Sitebar availability copy.** First pass: "Selective for q3 2026" (matches `/about` Status row). User to refine.
- **Logo mix-blend.** Ship without `mix-blend-mode: difference` first; add only if visual review demands. Edge cases (Safari rendering with backdrop-filter) can be assessed once the carousel is live.
- **Carousel piece order.** First pass: render in `order` field sequence (1-7), active = first. Future pass could permute or curate.

---

## Risks

- **GSAP licensing.** Core GSAP is free for commercial use; club plugins (SplitText, MorphSVG, etc.) require a Club GreenSock license. This spec uses **core only** — no licensing risk.
- **Cover transition feels slow.** Total ~3.5s per route change is editorial-paced, not instant. If users find it frustrating during heavy navigation, the durations can shorten in a follow-up pass (the timeline is centralized in TransitionCover, single-file change).
- **WebGL vs DOM carousel.** First pass uses DOM with CSS 3D perspective. If the visual register doesn't read as "carousel-y" enough, a future pass could upgrade to Three.js / R3F. Out of scope for this pass.
- **Chrome density on small viewports.** Five fixtures + a bottom bar leave little room for content on viewports ≤1024px wide. Mobile design (open decision above) needs to drop or collapse fixtures cleanly.
- **The site has now had 7 design directions in 2 weeks.** This is the seventh. The previous lock ("Tracklist Hardback") lasted hours. Implementing this direction will take days. If the user pivots again mid-implementation, work is lost. The implementation order is structured so the foundational pieces (TransitionProvider, chrome, theme integration) survive any subsequent visual pivot — only the home composition is direction-specific.

---

## Out of scope (deliberate)

- The Tracklist Hardback motion vocabulary (M1 plate slice, M2 letter-rise, M3 radial theme wipe, M4 tonearm, M5 airflow cursor). Future re-evaluation against this register.
- Per-concept real artifacts (microsites at `/demo/<slug>`). Tracked as a separate project.
- WebGL carousel upgrade.
- Custom command palette / keyboard shortcuts.
- Per-page OG image generation.
- `/work` index redesign — keeps the current WorkIndex + ListView + CatalogPlate components for now.
- Sub-page redesigns.
