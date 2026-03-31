# The Cloud Sky — Design Specification

> Plan A: San Rita-style pannable cloud canvas with pinned project markers.
> Plan B (fallback): jungheonlee-style ASCII/particle sky on black background.

## Concept

The homepage is an interactive sky. A large, high-resolution cloud photograph serves as a pannable canvas (3-4x viewport size). Projects are pinned as markers at hand-picked coordinates. You drag to explore. Hovering a marker reveals project info. Clicking navigates to the detail page. The sky IS the portfolio.

## Reference

**sanrita.ca:** Full-viewport terrain map, drag-to-pan, pinned project markers, sidebar nav with icon+text links, edge labels (clock, copyright, editorial taglines), "Scroll to enter our world" invitation, "Latest hot spot" corner card.

## Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│ TOP BAR (fixed)                                                      │
│ HKJ  New York · 10:33  ● Live              Est. 2025                │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│ SIDEBAR    ┌─────────────────────────────────────────────┐           │
│ (fixed)    │                                             │           │
│            │   PANNABLE CLOUD CANVAS (250vw × 200vh)     │           │
│ ● Map      │                                             │           │
│ ● Projects │     ○ 01 GYEOL         ○ 04 SPRING GRAIN   │           │
│ ● About    │                                             │           │
│ ● Contact  │            ○ 02 SIFT                        │           │
│ ● LinkedIn │                                             │           │
│ ● GitHub   │     ○ 03 CONDUCTOR          ○ 05 RAIN       │           │
│            │                                             │           │
│ Legend:    │               Drag to explore                │           │
│ ─ Brand    │                                             │           │
│ ─ Product  │     ○ 06 CLOUDS AT SEA                      │           │
│ ─ Lab      │                                             │           │
│            └─────────────────────────────────────────────┘           │
│                                                                      │
├──────────────────────────────────────────────────────────────────────┤
│ BOTTOM BAR (fixed)                                                   │
│ © HKJ Studio · 72px                  Latest: GYEOL (2026)           │
└──────────────────────────────────────────────────────────────────────┘
```

## Canvas

- Container: `width: 250vw; height: 200vh` (5000px × 2000px at 1920×1080 viewport)
- Background: single high-res cloud photograph, `background-size: cover`
- Initial position: centered on the canvas (`transform: translate(-75vw, -50vh)`)
- **Drag-to-pan:** `mousedown` sets dragging state, `mousemove` updates `translate(x, y)`, `mouseup` stops. `cursor: grab` default, `cursor: grabbing` while dragging.
- **Momentum:** On release, velocity carries the pan with friction decay (factor 0.95 per frame). Stops when velocity < 0.5px.
- **Boundaries:** Soft-clamp translate values so you can't pan past the edges. Allow ~20px overscroll with rubber-band snap back.
- **Touch support:** `touchstart`, `touchmove`, `touchend` mirror mouse behavior.
- **Placeholder:** CSS gradient `linear-gradient(135deg, #2a3040 0%, #1a1e28 40%, #0e1018 100%)` until real cloud photo is added.
- **Performance:** `will-change: transform` on the canvas container. `transform` only — no `top/left` animation.

## Project Markers

- Positioned absolutely within the canvas: `position: absolute; left: X%; top: Y%`
- Coordinates hand-picked per project (you adjust these to taste)

**Default state:**
- Small circle: `8px × 8px`, `border-radius: 50%`, `background: rgba(var(--fg-rgb), 0.4)`, `border: 1px solid rgba(var(--fg-rgb), 0.15)`
- Project number next to it: Fragment Mono, 11px, `--fg-3`
- Subtle pulse animation on the dot: `scale(1) → scale(1.3) → scale(1)`, 3s loop, staggered per marker

**Hover state:**
- Dot brightens to `--fg`
- Tooltip appears (see Hover Tooltip below)
- Non-hovered markers dim to `opacity: 0.3`
- Transition: 300ms ease

**Click:** Navigates to `/work/[slug]` or `/lab/[slug]`

### Marker Coordinates (starting positions — adjustable)

| Project | x% | y% |
|---------|----|----|
| GYEOL | 20% | 30% |
| SIFT | 55% | 20% |
| CONDUCTOR | 35% | 55% |
| SPRING GRAIN | 75% | 35% |
| RAIN ON STONE | 60% | 65% |
| CLOUDS AT SEA | 25% | 75% |
| Statement marker | 45% | 45% |

## Hover Tooltip

- Same style as current hover popover: dark frosted glass, 380×150px
- Positioned near the marker, offset to avoid cursor
- Contains: number, description, project name (bold), year + tag
- If project has image: shows in left 170px panel
- `pointer-events: none`
- Animate in: `opacity 0→1, translateY 6px→0, scale 0.98→1`, 200ms

## Sidebar Navigation (San Rita style)

- `position: fixed; left: 0; top: 50%; transform: translateY(-50%)`
- `z-index: 10`
- Vertical list of links with small icons (can be text-only initially):
  - Map (home)
  - Projects (links to projects page or scrolls to markers)
  - About
  - Contact (mailto)
  - LinkedIn
  - GitHub
- Font: Fragment Mono, 11px, `--fg-3`, hover `--fg`
- Padding-left: `var(--gutter)`
- Below the links: **Legend**
  - `● Brand  ● Product  ● Lab`
  - Small dots, Fragment Mono 10px, `--fg-4`

## Edge Labels (San Rita style)

These labels around the edges create the "designed artifact" feel:

- **Top-left:** `HKJ` (mark)
- **Top-center:** Live clock (Fragment Mono, 11px, `--fg-3`)
- **Top-right:** `Est. 2025`
- **Bottom-left:** `© HKJ Studio` + technical detail (e.g., font size, gap size — like San Rita's `72px | 6apt`)
- **Bottom-center:** editorial tagline or discipline labels
- **Bottom-right:** "Latest project" card — small dark card with most recent project name, like San Rita's "Latest hot spot: GZNA"
- **Left edge (vertical text):** `DESIGN & DEVELOPMENT` rotated 90deg, `--fg-4` — like San Rita's edge labels
- **Right edge (vertical text):** `CRAFTED · HAND-CODED` rotated -90deg, `--fg-4`

## Center Invitation

- On first load: `DRAG TO EXPLORE` centered in viewport
- Fragment Mono, 14px, `--fg-3`, letter-spacing `0.1em`, uppercase
- Fades away after first drag interaction (`opacity 1→0`, 500ms)
- Does not reappear once dismissed

## Entrance Animation

1. (0–0.8s): Sky canvas starts zoomed in 20% (`scale(1.2)`) and animates to `scale(1)` with `power4.out`
2. (0.5–1.0s): Edge labels fade in, `--fg-4` color, staggered
3. (0.8–1.5s): Markers fade in one by one, staggered 100ms each
4. (1.0–1.5s): Sidebar nav slides in from left
5. (1.2s): "DRAG TO EXPLORE" text fades in
6. `prefers-reduced-motion`: everything visible immediately, no animation

## Filters

- Bottom bar or sidebar legend doubles as filter
- Clicking `Brand` dims all non-Brand markers to `opacity: 0.1`
- Clicking `All` restores all markers
- Transition: 300ms

## Design Tokens

Same dark palette as current:
```css
:root {
  --bg: #0e0e0e;
  --bg-rgb: 14, 14, 14;
  --fg: #eae6df;
  --fg-rgb: 234, 230, 223;
  --fg-2: rgba(234, 230, 223, 0.60);
  --fg-3: rgba(234, 230, 223, 0.30);
  --fg-4: rgba(234, 230, 223, 0.12);
}
```

## Typography

- Mono: Fragment Mono — all UI text, labels, markers, metadata
- Body: General Sans — tooltip descriptions, bio text
- Display: DM Serif Display — statement marker text only

## Pages

```
/                     → Cloud Sky (this spec)
/work/[slug]          → Project detail (keep existing)
/lab/[slug]           → Experiment detail (keep existing)
/about                → About page (keep existing)
```

## Plan B Reference

If this direction doesn't work visually, fallback to:
- jungheonlee.com architecture
- ASCII or particle art rendering of a sky/cloudscape
- Black background, white particles/characters
- Interactive hero element (the ASCII sky)
- Clean project list below
- Same data, different visual treatment

## What You Provide

1. **Cloud photograph** — high-res (4000px+ wide), aerial or upward-facing cloud panorama
2. **Marker coordinates** — which projects sit where on the sky (defaults provided above)
3. **Statement text** — "Drag to explore" or your preferred invitation
4. **Edge label text** — taglines, technical details, discipline labels

## Technical Notes

- No Three.js, no WebGL, no canvas element — pure DOM + CSS transforms
- Drag-to-pan: vanilla JS mousedown/mousemove/mouseup
- Momentum: `requestAnimationFrame` loop with velocity decay
- All markers are `<Link>` elements with absolute positioning
- Performance: single CSS `transform: translate(x, y)` on the canvas container. GPU-composited.
- Mobile: touch events mirror mouse. Sidebar collapses to hamburger.

## Verification

1. `npx next build` passes
2. Cloud canvas fills viewport with sky gradient placeholder
3. Drag pans the canvas smoothly in all directions
4. Momentum carries pan after release with friction decay
5. Boundaries prevent panning past edges
6. Markers visible at their coordinates
7. Hover shows tooltip with project info
8. Click navigates to detail page
9. "DRAG TO EXPLORE" appears on load, fades on first drag
10. Edge labels visible at viewport corners
11. Sidebar nav with links
12. Entrance zoom-out animation plays
13. Filters dim/show markers by category
14. Mobile: touch drag works, sidebar is hamburger
15. `prefers-reduced-motion`: no animations
