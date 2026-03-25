# Hero Section: "The Wall"

## Concept

The entire page background becomes a sunlit wall. A full-page WebGL canvas fixed behind all content renders soft light rays falling diagonally across the paper surface. The `#f7f6f3` paper gains dimension — warm where light hits, cool where shadow rests. Content sits on this wall like text on the side of a sunlit building.

The light responds to the viewer's actual time of day. The site feels different every time you visit — not because of interaction, but because of time.

## Feeling

Intimacy. Calm. Slowing down. A digital corner of quiet. The deliberate absence of interaction — you're witnessing something, not performing something.

## Technical Approach

### Rendering Layer

- Full-page `<canvas>` element, `position: fixed`, `inset: 0`, `z-index: -1`
- WebGL fragment shader renders the light composition
- Sits behind all page content — the page "floats" on the wall
- Canvas covers the full viewport, not constrained to any layout width

### Light Composition

The shader renders:

1. **2-3 soft light shafts** — wide diagonal bands with gaussian-soft edges. Not volumetric god rays — more like sunlight through a tall window hitting plastered wall. Each shaft has slightly different width, angle, and intensity for naturalism.

2. **Shadow regions** — the areas between shafts. Subtle cool shift (violet-grey undertone: `rgba(0.48, 0.38, 0.42, ~0.04)`) layered under the paper color.

3. **Paper grain** — fine noise texture across the entire surface (`noise(uv * 18.0) * 0.012`). Gives the wall materiality — reads as plaster or cotton paper.

4. **Slow drift** — light angle shifts ~5° over 10 minutes. Imperceptible in real time. Noticeable if you leave the tab open or revisit.

5. **Soft vignette** — edges slightly darker, focusing attention toward center.

### Time-of-Day System

Uses `new Date().getHours()` + minutes to compute a normalized time value (0–1 over 24h). This value drives:

| Time | Light color | Direction | Intensity | Shadow tone |
|---|---|---|---|---|
| 6–9am | Cool white, hint of blue (`0.92, 0.93, 0.96`) | From left (east), low angle ~25° | 0.6 | Cool blue-grey |
| 9am–3pm | Neutral warm (`0.95, 0.92, 0.88`) | From above-left, steep ~60° | 1.0 | Neutral |
| 3–6pm | Golden amber (`0.82, 0.65, 0.42`) | From right (west), low angle ~25° | 0.85 | Warm amber |
| 6–9pm | Deep amber → rose (`0.76, 0.52, 0.40`) | From far right, very low ~15° | 0.5 | Warm rose |
| 9pm–6am | Faint blue-grey moonlight (`0.85, 0.86, 0.90`) | Diffuse, no strong direction | 0.2 | Cool violet |

Transitions between states interpolate smoothly over real minutes using the continuous time value — never snapped.

### Shader Uniforms

```glsl
uniform float u_time;        // wall clock seconds for drift animation
uniform vec2  u_resolution;  // canvas pixel dimensions
uniform float u_dayPhase;    // 0.0–1.0 representing 24h cycle
uniform vec3  u_lightColor;  // interpolated from time-of-day table
uniform float u_lightAngle;  // interpolated direction in radians
uniform float u_lightIntensity; // interpolated brightness
uniform vec3  u_shadowTone;  // interpolated cool/warm shadow color
```

### Interaction

**None.** No cursor response. No click effects. No scroll parallax. The light responds only to time — something the viewer cannot control. This is what makes it calm.

### Performance

- Renders at `Math.min(devicePixelRatio, 1.5)` — sharp enough for soft gradients, saves GPU
- **30fps cap** via `setTimeout` in the render loop (no need for 60fps — movement is imperceptible)
- `prefers-reduced-motion`: renders a single static frame at current time of day, no animation loop
- WebGL unavailable fallback: flat `#f7f6f3` background (CSS already handles this)
- Light uniforms update once per minute (time doesn't change fast enough to need per-frame updates)

### Component Structure

```
src/components/WallLight.tsx    — "use client", full-page WebGL canvas
```

Single component. No dependencies beyond `useReducedMotion` hook. Dynamically imported in `layout.tsx` with `ssr: false` since it needs `window` and `Date`.

### Integration

In `layout.tsx`, render `<WallLight />` as the first child of `<body>`, before the skip-to-content link. It's `position: fixed` so it doesn't affect layout flow.

The existing `page-container` and all content render on top with their existing `background: transparent` (or `background: var(--paper)` removed — the wall IS the background).

### What the Visitor Experiences

You open the site at 4pm. The page feels warm — light falls from the right in golden amber. Your name sits in the light. Project cards below catch the edge of a soft shadow. Nothing moves, or so you think.

You come back the next morning. The light is cooler, from the left. The same page feels different. Not redesigned — re-lit. The site is alive, but quietly. It doesn't demand attention. It rewards it.

## Success Criteria

1. Visitor cannot immediately tell the background is animated — it should feel like "this page has nice warm tones" not "oh a shader"
2. Visiting at different times of day produces noticeably different moods
3. Performance: no frame drops, no jank on scroll, < 5% GPU usage
4. Falls back gracefully — flat paper is still a good-looking site
5. Zero interaction handlers — the component has no event listeners
