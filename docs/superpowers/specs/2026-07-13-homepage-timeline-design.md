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
- Retiring the standalone `/works` room page; Nav's "works" link points to `/` instead
- `/works/[slug]` individual case-study pages are unaffected and stay

**Explicitly deferred** (separate future brainstorms, not touched by this spec or its implementation):

- A separate grid-layout view of Works (distinct from the homepage timeline) — needs its own routing decision now that `/works` is retiring
- Archive redesigned as a Pinterest-style masonry scroll (currently a dated Courier feed)
- Info → About migration, with About eventually hosting the thesis statement instead of the homepage

Do not implement any of the deferred items as part of this spec's plan.

## Reference

User supplied a screenshot resembling a site called "THE LOOKBACK" — a horizontal media row with varied tile aspect ratios, a large title above the row describing the current chapter, and a dense tick-mark date axis below it. This is the primary visual reference for section 2 below. (Earlier references to "TLB" and "devouring details" were unverified by the assistant at the time of the brainstorm — this screenshot is what resolved "TLB.")

## Design

### 1. Layout & page structure

The homepage stays single-viewport on desktop — **no page-level scroll**, unchanged from every other room's constraint. Vertical structure, top to bottom, all within one 1440×900-class viewport:

1. Masthead (unchanged): giant wordmark + standfirst top-left, Nav top-right
2. **New:** the timeline — a fixed-height, full-bleed-width section in the middle band
3. ThesisStatement (resized/repositioned, see §3) and CornerMark, bottom, as today

Only the timeline scrolls, and only internally/horizontally — the page around it never moves. On mobile/tablet, the timeline is a natively-swipeable horizontal strip; no custom wheel-redirect logic is needed there since touch scrolling handles it natively.

### 2. Timeline visual structure & content

- **Ordering:** all Works from `data/works.ts`, sorted **newest → oldest by year** (a "lookback"/retrospective read — scrolling forward moves backward through time). Ties (same year) break by existing `index` field, descending.
- **Varied media sizes:** each stop renders at its own `media.aspectRatio` (portrait/square/landscape/wide) rather than a forced uniform tile size. All stops share a **common height**; width varies naturally per aspect ratio, matching the reference's filmstrip rhythm.
- **Large responsive title above the row:** shows the currently-"active" Work's title + year at a hero-adjacent scale. Updates (quick opacity crossfade, or instant swap under reduced-motion) as the active stop changes — this is what makes the focus interaction legible, not just a tile-level scale/opacity nudge.
- **Dense tick-mark axis below the row:** a ruler-style scrubber, many fine unlabeled ticks with **year labels** at intervals (our data is year-granular, not month-granular like the reference). Includes a progress indicator synced to the same scroll ratio as the media row.
- **Active-stop detail:** the tile nearest the center of the timeline section gets a subtle emphasis (scale/opacity), neighbors dim slightly — reinforced by the title update above.
- Per-stop content reuses existing conventions: `MediaRenderer` (from `WorkTile.tsx`, already exported), roman numeral, italic serif caption (the site's one serif-italic accent), category/status.

### 3. Thesis statement

Stays on the homepage for this spec (the About migration is deferred work). Shrinks roughly 35% — `clamp(56px,6vw,92px)` → approximately `clamp(36px,4vw,60px)` — and stays bottom-right. Position offset is retuned only as needed for clean clearance now that the timeline occupies real vertical space above it; the existing right-edge alignment with Nav (both reference the same `--edge-margin` token) is preserved.

### 4. Technical approach

A genuinely custom-built scroll surface — no animation library, consistent with the project's existing "no Framer Motion / GSAP / Lenis" constraint, but a hand-rolled equivalent of what those libraries would provide:

- **Native horizontal scroll container** (`overflow-x: auto`) holds the media row. Trackpad horizontal swipe and touch swipe work natively — no JS needed for those two input paths.
- **Vertical wheel → horizontal redirect:** a `wheel` listener scoped to the timeline section only (not `window`) detects a vertical-dominant gesture (plain mouse wheel, or an incidental vertical trackpad move) and redirects it into horizontal scroll movement, since the page itself never scrolls vertically.
- **Hand-rolled inertia:** a `requestAnimationFrame` loop interpolates the actual scroll position toward a "target" position each frame (`current += (target - current) * damping`) rather than snapping directly to raw wheel deltas — the same idea Lenis provides, hand-coded to stay within the no-libraries rule.
- **Active-stop detection:** each frame (throttled via rAF, not on every scroll event), find whichever tile's center is closest to the container's center; that's the active stop driving the title update and emphasis styling.
- **Accessibility:**
  - `prefers-reduced-motion` disables the rAF inertia loop entirely (direct snap, no easing), consistent with the global reduced-motion handling already in place project-wide.
  - Each tile is a real focusable link (`<a>`/`<Link>`), so Tab navigation uses the browser's native `scrollIntoView` — a working keyboard path independent of the custom mouse/touch logic.
  - Explicit Left/Right arrow-key handling added on top, advancing one stop at a time, for a better keyboard experience than relying on native scroll-into-view alone.
- New client component: `src/components/timeline/HomeTimeline.tsx` (plus likely a co-located `TimelineAxis.tsx` for the tick-mark ruler), consuming `works` from `data/works.ts`.

## Out of scope / explicit non-goals

- No changes to Archive, References, or Info/About in this spec
- No new routing for a "grid Works view" — that's deferred along with the routing question it raises
- No page-level scroll on the homepage, under any circumstance
- No third-party animation/scroll libraries

## Open questions for implementation planning

- Exact pixel budget for the timeline section's fixed height, balanced against the masthead and thesis/corner-mark reserves at common viewport sizes — to be measured and tuned during implementation using the same iterative measure-then-adjust approach used throughout this project, not fully pre-computed here.
- Exact easing/damping constant for the inertia loop — start with a reasonable value (e.g. 0.12) and tune by feel.
