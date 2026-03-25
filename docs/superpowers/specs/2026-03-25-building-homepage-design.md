# Homepage Concept: "The Building"

## Concept

The entire homepage is a New York building rendered in gestural watercolor strokes. You start on the rooftop (sky + rooftop details + intro text), scroll down past the roofline into the facade (projects as windows), and reach street level (footer). The building is never fully drawn — faint architectural fragments bleed into the paper background. It feels like looking at a building through a watercolor painting someone started and stopped.

## Feeling

Intimacy. Calm. Specificity. This is someone's building, someone's rooftop, someone's city. Not a generic portfolio — a place.

## Structure (top to bottom)

### 1. Sky + Rooftop (above the fold)

**Sky:** WallLight canvas (already exists, `position: fixed`) reads as sky at the top of the page. Time-of-day aware — warm amber at golden hour, cool blue morning, dark at night.

**Rooftop details** (procedural watercolor, positioned absolutely):
- **Lanterns:** 2-3 small warm-toned watercolor blobs at varying heights, connected by a faint line (string lights). Subtle warm glow that intensifies slightly at night (time-aware).
- **Fence/railing:** A horizontal line with vertical posts — drawn as wobbly hand-rendered strokes, not straight CSS lines. Faint ink wash, barely darker than the paper. Runs across the top third of the viewport.
- **Shrubbery/planters:** 2-3 organic watercolor patches in muted green-grey, sitting on the roofline. Irregular edges like wet paint bleeding. One taller (a small tree), others low (potted plants).
- **Roofline/parapet:** A horizontal stroke suggesting the top edge of a building — a faint cornice line with slight thickness variation (like a loaded brush dragged across paper).

**Intro text** sits among the rooftop details:
- "design engineer building, conceptualizing, designing products and the stories behind them."
- "NEW YORK · OPEN TO WORK"
- Text is positioned as if you're standing on the roof looking out. The rooftop details frame it — fence below, lanterns above, planters to the sides.

### 2. Facade (work section)

**Transition:** Below the roofline, the WallLight reads as a sunlit wall. The paper takes on the faintest warm wash.

**Window frames** around project cards:
- Faint procedural strokes suggesting window casings — a lintel (top bar), sill (bottom bar), side edges
- Each window is slightly different — some have more detail, others barely there
- The existing Cover component sits inside these frames unchanged

**Between windows:**
- Occasional watercolor marks — a drainpipe suggestion (thin vertical line), a fire escape fragment (small geometric grid), a shadow cast from a cornice above
- Brick texture washes — faint warm-brown noise patches on one side of a window, fading into paper on the other
- Never complete, always gestural

**Density gradient:** Denser near the roofline (most architectural detail), sparser toward the bottom. The building dissolves as you scroll.

### 3. Street Level (footer)

Building strokes fade out completely. Pure paper. Footer with contact and links sits here.

## Technical Approach

### BuildingOverlay Component

A single `"use client"` component rendered in `page.tsx` that draws all the gestural architectural elements.

**Canvas vs SVG decision:** SVG. The elements are static shapes (strokes, washes, blobs) that don't need per-frame updates. SVG gives us:
- Crisp rendering at any DPR
- CSS-based opacity/color that can respond to time-of-day via CSS variables
- No GPU overhead beyond WallLight
- Easier to position relative to page scroll height

**Structure:**
```
src/components/BuildingOverlay.tsx
```

The component renders an absolutely-positioned SVG that spans the full page height. It contains:

**Rooftop group** (y: 0 to ~40vh):
- `<path>` elements for fence posts and rails with hand-wobble (noise-displaced control points)
- `<ellipse>` and `<circle>` for lantern blobs with feGaussianBlur for glow
- `<path>` for string light line connecting lanterns
- `<path>` elements for shrubbery — organic closed shapes with irregular edges
- `<rect>` + noise for planter boxes
- `<line>` or `<path>` for roofline/parapet with stroke-width variation via `<feTurbulence>` displacement

**Facade group** (y: ~40vh to page bottom - footer):
- `<rect>` with rounded corners and noise-displaced edges for window frames around each project card
- `<path>` elements for drainpipes, fire escape fragments
- `<rect>` with `<feTurbulence>` fill for brick wash patches
- Opacity decreases toward the bottom (density gradient)

**All strokes use:**
- `stroke: rgba(var(--ink-rgb), 0.06–0.15)` — faint, warm ink tones
- `stroke-linecap: round` and `stroke-linejoin: round` for organic feel
- `<feTurbulence>` + `<feDisplacementMap>` on paths for hand-wobble
- `fill: none` for line elements, very low opacity fills for washes

**Shrubbery uses:**
- `fill: rgba(80, 90, 65, 0.08–0.12)` — muted green-grey
- `<feGaussianBlur stdDeviation="2-4">` for soft edges
- Irregular closed paths (generated from perlin-displaced circles)

**Lanterns use:**
- `fill: rgba(200, 160, 80, 0.08)` — warm amber, very faint
- Slightly stronger fill at night hours (time-aware via CSS class on body or data attribute)
- `<feGaussianBlur stdDeviation="6-8">` for glow

### Positioning

The SVG overlay is `position: absolute` inside the page-container, `pointer-events: none`, `z-index: 0`. Content sits at `z-index: 1` (via `position: relative`).

Elements are positioned using the page's known layout:
- Rooftop details: `0` to `~40vh` (hero area)
- Window frames: calculated from the project card positions (use `useEffect` + `getBoundingClientRect` on mount to measure card positions, then render SVG frames around them)
- Facade details: scattered between card positions

### Procedural Generation

All shapes are generated once on mount from a seeded random function (so they're consistent across refreshes but look hand-drawn). The seed is fixed (e.g., `42`) so the building looks the same every visit.

**Hand-wobble function:**
```ts
function wobble(points: [number, number][], seed: number, amount: number): string {
  // Displace each point by noise(seed + index) * amount
  // Return SVG path d attribute
}
```

### Performance

- SVG renders once, no animation loop
- `pointer-events: none` prevents interaction overhead
- `will-change: transform` not needed (static)
- Total SVG DOM: ~50-80 elements (not heavy)
- Lantern glow time-awareness: CSS class toggle, not per-frame

### Fallback

If the page has no projects (empty state), no facade elements render. Only the rooftop.

## What Stays the Same

- WallLight canvas — unchanged, reads as sky at top and wall below
- Cover component — unchanged, project cards just sit inside window frames
- Navigation, footer, all inner pages — unchanged
- The building elements are purely decorative — remove them and the portfolio works perfectly

## Success Criteria

1. The building feeling is suggested, not illustrated — a visitor might not consciously think "building" but they feel "place"
2. Rooftop details (lanterns, fence, shrubbery) create warmth and specificity
3. Window frames make the project cards feel situated, not floating
4. The watercolor quality is convincing — strokes look hand-drawn, not computed
5. Performance: zero impact on scroll performance (static SVG, no JS animation)
6. Removing the overlay leaves a fully functional, good-looking portfolio
