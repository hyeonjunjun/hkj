# Homepage Timeline — Design

**Date:** 2026-07-13
**Status:** Approved by user in brainstorm, pending spec review

## Context

The current landing page (`/`) is a quiet masthead: giant wordmark + standfirst top-left, Nav top-right, ThesisStatement bottom-right, CornerMark bottom-left, and a deliberately empty middle. That emptiness was intentional at launch ("Option ii... revisit once real content exists"). This spec is that revisit.

The site currently has four rooms — Works, Archive, References, Info — each reached via Nav. Works has its own room at `/works` with a poster composition (`WorkGrid`/`WorkTile`) of three placeholder pieces, plus individual case-study pages at `/works/[slug]`.

## Scope decision

This brainstorm surfaced a much larger vision than "add a works layout to the homepage." To keep this buildable, the session was explicitly scoped down. **In scope for this spec:**

- A new horizontal, scroll-driven timeline component filling the homepage's empty middle band
- Resizing/repositioning `ThesisStatement` to make room for it
- Deleting `src/app/works/page.tsx`; Nav's "works" link points to `/` instead (see §5 for the active-state fix this requires)
- `/works/[slug]` individual case-study pages are unaffected and stay
- `WorkGrid.tsx`/`WorkTile.tsx` become unused by this spec but are **left in place, not deleted** — the deferred grid-Works-view work is likely to reuse or adapt this poster-composition logic, so removing it now would mean rebuilding it later

**Explicitly deferred** (separate future brainstorms, not touched by this spec or its implementation):

- A separate grid-layout view of Works (distinct from the homepage timeline) — needs its own routing decision now that `/works` is retiring
- Archive redesigned as a Pinterest-style masonry scroll (currently a dated Courier feed)
- Info → About migration, with About eventually hosting the thesis statement instead of the homepage

Do not implement any of the deferred items as part of this spec's plan.

## Reference

User supplied a screenshot resembling a site called "THE LOOKBACK" — a horizontal media row with varied tile aspect ratios, a large title above the row describing the current chapter, and a dense tick-mark date axis below it. This is the primary visual reference for section 2 below. (Earlier references to "TLB" and "devouring details" were unverified by the assistant at the time of the brainstorm — this screenshot is what resolved "TLB.")

## Design

### 1. Layout & page structure

The homepage stays single-viewport **on desktop** — no page-level scroll there, unchanged from every other room's constraint (the existing `md:h-screen md:overflow-hidden` on `page.tsx` already scopes this to `md` and up; that scoping doesn't change). Vertical structure, top to bottom, all within one 1440×900-class viewport on desktop:

1. Masthead (unchanged): giant wordmark + standfirst top-left, Nav top-right
2. **New:** the timeline — a fixed-height, full-bleed-width section in the middle band
3. ThesisStatement (resized/repositioned, see §3) and CornerMark, bottom, as today

Only the timeline scrolls, and only internally/horizontally — the page around it never moves, on desktop. On mobile/tablet the page already scrolls vertically today (the existing mobile layout is normal document flow, no viewport lock) and continues to; the timeline there is just a natively-swipeable horizontal strip within that normal flow, no custom wheel-redirect logic needed since touch scrolling handles it natively. Adding the timeline band does not newly introduce mobile scroll — mobile already scrolls, and stays exempt from the desktop no-scroll rule the same way every other room already is.

### 2. Timeline visual structure & content

- **Ordering:** all Works from `data/works.ts`, sorted **newest → oldest by year** (a "lookback"/retrospective read — scrolling forward moves backward through time). Ties (same year) break by existing `index` field, descending.
- **Varied media sizes:** each stop renders at its own `media.aspectRatio` (portrait/square/landscape/wide) rather than a forced uniform tile size. All stops share a **common height**; width varies naturally per aspect ratio, matching the reference's filmstrip rhythm.
- **Large responsive title above the row:** shows the currently-"active" Work's title + year at a hero-adjacent scale. Updates (quick opacity crossfade, or instant swap under reduced-motion) as the active stop changes — this is what makes the focus interaction legible, not just a tile-level scale/opacity nudge.
- **Dense tick-mark axis below the row:** a ruler-style scrubber, many fine unlabeled ticks with **year labels** at intervals (our data is year-granular, not month-granular like the reference). Includes a progress indicator synced to the same scroll ratio as the media row.
- **Active-stop detail:** the tile nearest the center of the timeline section gets a subtle emphasis (scale/opacity), neighbors dim slightly — reinforced by the title update above.
- Per-stop content reuses existing conventions: `MediaRenderer` (from `WorkTile.tsx`, already exported), roman numeral, italic serif caption (the site's one serif-italic accent), category. **`status` (e.g. "LIVE"/"IN DEVELOPMENT") is a new addition** — current `WorkTile.tsx` doesn't render it; the timeline stop is the first place it appears in the UI.
- Only 3 placeholder Works exist today, so a growth story isn't a hard requirement here; the deferred grid-view work is the intended answer for "many works" usability (dense-axis legibility, tile virtualization, etc.), not this component.

### 3. Thesis statement

Stays on the homepage for this spec (the About migration is deferred work). Shrinks roughly 35% at every breakpoint the component defines, not just the largest — mobile `36px` → ~`24px`, tablet `48px` → ~`32px`, desktop `clamp(56px,6vw,92px)` → approximately `clamp(36px,4vw,60px)` — and stays bottom-right. Position offset is retuned only as needed for clean clearance now that the timeline occupies real vertical space above it; the existing right-edge alignment with Nav (both reference the same `--edge-margin` token) is preserved.

### 4. Technical approach

A genuinely custom-built scroll surface — no animation library, consistent with the project's existing "no Framer Motion / GSAP / Lenis" constraint, but a hand-rolled equivalent of what those libraries would provide:

- **Native horizontal scroll container** (`overflow-x: auto`) holds the media row. Trackpad horizontal swipe and touch swipe work natively — no JS needed for those two input paths.
- **Vertical wheel → horizontal redirect:** a `wheel` listener scoped to the timeline section only (not `window`) branches explicitly on gesture direction: only when `|deltaY| > |deltaX|` (a vertical-dominant gesture — plain mouse wheel, or an incidental vertical trackpad move) does it call `preventDefault()` and redirect into horizontal movement. Genuine horizontal wheel/trackpad deltas (`|deltaX| >= |deltaY|`) pass through untouched and let the native horizontal scroll handle them directly.
- **Hand-rolled inertia:** a `requestAnimationFrame` loop interpolates the actual scroll position toward a single shared `target` value each frame (`current += (target - current) * damping`) rather than snapping directly to raw wheel deltas — the same idea Lenis provides, hand-coded to stay within the no-libraries rule.
- **Single source of truth for `target`:** all three ways the scroll position can change — wheel input, arrow-key stepping, and native Tab-focus `scrollIntoView` — write to this same `target` value, so the rAF loop never fights another input path:
  - Wheel input updates `target` by the (redirected) delta.
  - Left/Right arrow keys update `target` to the adjacent stop's offset directly (not a direct `scrollIntoView` call), so keyboard stepping gets the same smoothing as wheel input. The keydown listener is scoped to while focus is within the timeline section (not a global `window` handler), so it never captures arrow keys used elsewhere on the page. At the first/last stop, Left/Right is a no-op (no wraparound).
  - A `focus` listener on each tile resyncs `target` to that tile's own offset immediately when focus lands on it (native Tab navigation triggers the browser's own instant `scrollIntoView`) — without this resync, the rAF loop would try to pull the view back toward its previous, now-stale target on the very next frame, fighting the browser's focus-scroll.
- **Active-stop detection runs independently of the inertia toggle.** This is a state-detection routine, not an animation — it must keep running under `prefers-reduced-motion` even though the inertia *smoothing* is disabled there (see below), because the title update and `aria-live` announcement depend on it regardless of motion preference. Concretely: the two concerns share a rAF loop when motion is allowed, but detection also has a plain `scroll` event listener (throttled via rAF for the read, not the easing) as its baseline mechanism, so it has a working path with zero dependency on the inertia loop's on/off state.
- **Accessibility:**
  - `prefers-reduced-motion` disables the inertia *interpolation* only (direct snap to `target`, no eased approach) — it does not disable active-stop detection, the title update, or the `aria-live` announcement, which all keep running per the point above.
  - Each tile is a real focusable link (`<a>`/`<Link>`), so Tab navigation uses the browser's native `scrollIntoView` — a working keyboard path independent of the custom mouse/touch logic (see the `target`-resync rule above for how this coexists with the inertia loop).
  - Explicit Left/Right arrow-key handling added on top, advancing one stop at a time, for a better keyboard experience than relying on native scroll-into-view alone.
  - The title-above-the-row region gets `aria-live="polite"` so screen-reader users are told when the active stop (and its title/year) changes, rather than the update being silently visual-only.
- New client component: `src/components/timeline/HomeTimeline.tsx` (plus likely a co-located `TimelineAxis.tsx` for the tick-mark ruler), consuming `works` from `data/works.ts`.

### 5. Nav active-state fix (required by the `/works` retirement)

Today, `Nav.tsx`'s active-state check (`pathname === item.href || pathname?.startsWith(`${item.href}/`)`) works because the "works" `NavItem.href` is `/works`, so it also matches `/works/[slug]` case-study pages via the `startsWith` branch. Once `href` becomes `/`, that same check no longer matches `/works/some-slug` (`"/works/some-slug".startsWith("//")` is false) — the "works" tab would go dark on every case-study page, silently breaking navigation feedback on pages this spec claims are untouched.

Fix: `NavItem` already carries a `room: RoomKey` field distinct from `href`. Extend the active check to also match on room, not just href: a nav item is active if `pathname === item.href` **or** `pathname.startsWith(`/${item.room}/`)`. For "works" (`room: "works"`), this correctly re-matches `/works/[slug]` pages regardless of what `href` points to. This is a general rule, not a one-off special case for "works" — it costs nothing for the other three rooms, whose `href` and `room` already agree.

## Out of scope / explicit non-goals

- No changes to Archive, References, or Info/About in this spec
- No new routing for a "grid Works view" — that's deferred along with the routing question it raises
- No page-level scroll on the homepage **on desktop** — mobile already scrolls today and is unaffected by this constraint, consistent with every other room
- No third-party animation/scroll libraries

## Open questions for implementation planning

- Exact pixel budget for the timeline section's fixed height, balanced against the masthead and thesis/corner-mark reserves at common viewport sizes — to be measured and tuned during implementation using the same iterative measure-then-adjust approach used throughout this project, not fully pre-computed here.
- Exact easing/damping constant for the inertia loop — start with a reasonable value (e.g. 0.12) and tune by feel.
