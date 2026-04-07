# The Theater — Cinematic Portfolio Redesign

**Date:** 2026-04-07
**Status:** Draft
**Replaces:** Paced List / Game UI iterations (2026-04-06)

---

## 1. Design Intent

A cinematic, ambient portfolio that feels like inhabiting a space rather than browsing a website. One persistent viewport. FLIP animations between states. A 3D object as the visual anchor. Editorial metadata as the information layer. Pure monochrome — the work's own imagery provides all color.

**References:**
- Wuthering Waves: matte materiality, atmospheric restraint, monochrome-plus-accent, content dominates chrome
- Cosmos catalog: structured key:value metadata, large photography, warm neutrals
- Cathy Dolle / TLB: FLIP animations, preloader as ritual, spatial continuity
- Fold phone lockscreen: information density with extreme calm, thin structural lines

**Guiding principle:** The interface should feel like it barely exists. The 3D object and the typography are the only things that matter. Everything else recedes.

---

## 2. Architecture — "The Theater"

The site is one persistent viewport that transforms between states. There are no page navigations — only FLIP transitions that morph content in place.

### States

1. **Preloader** → resolves into Main Stage
2. **Main Stage: Index** (default) — project selector + 3D object
3. **Main Stage: Archive** — experiment selector + 3D object
4. **Main Stage: About** — profile info + 3D object (scaled down)
5. **Detail View** — FLIP expansion from Index/Archive, scrollable

### Transition Model

- Preloader → Main Stage: black plane wipes away, elements FLIP into position
- Tab switches (Index ↔ Archive ↔ About): content FLIPs in place, 3D object swaps texture
- Index/Archive → Detail: 3D object FLIP-expands, metadata rearranges, becomes scrollable
- Detail → Back: everything FLIP-reverses to Main Stage state

All transitions use Framer Motion `layoutId` for spatial continuity. No page-level route transitions — this is a single-page application with URL updates via `history.pushState` or Next.js shallow routing.

---

## 3. Preloader

- Black screen.
- Centered numeric counter in Fragment Mono, 10px, wide tracking. Rolls from `000` to `100`.
- Optional: thin horizontal progress line expanding from center.
- Small detail text below counter — coordinates, date, or system-style text. Not branding.
- At `100`: brief hold (~400ms), then black plane clips away (vertical wipe or scale) to reveal Main Stage.
- Total duration: ~2-3 seconds.
- "HKJ" mark and tab strip appear as part of the Main Stage chrome *after* the reveal, not during the preloader.

---

## 4. Main Stage Layout

A single full-viewport screen (`100dvh × 100vw`, `overflow: hidden`).

### Top Bar
- Left: "HKJ" mark in Fragment Mono, 11-12px, tracking 0.02em
- Right: tab strip — "Index / Archive / About" in Fragment Mono, 10px, uppercase, tracking 0.08em
- Active tab: full `--fg` opacity. Inactive: `--fg-3`. Sliding underline indicator using `layoutId`.
- Top bar has a thin bottom border (`--fg-4`)

### Left Zone (~40% of viewport)
- Padded generously from the left edge: `clamp(32px, 8vw, 96px)`
- Content vertically centered
- Content changes based on active tab (see Section 5)

### Right Zone (~60% of viewport)
- Contains the persistent React Three Fiber `<Canvas>`
- 3D CD case object floating in the center of this zone
- The canvas bleeds slightly past the conceptual center — no hard boundary between zones
- Dark void background (matches `--bg`)

### Bottom Bar
- Thin top border (`--fg-4`)
- Left: contextual info (project year, item count, location depending on tab)
- Right: small detail text (version, coordinates, or similar system text)
- Fragment Mono, 9px

---

## 5. Tab Content

### Index Tab (default)

**Left zone — Project Selector:**
- Vertical list of project titles
- Each row: number (01, 02, 03...) + title in General Sans 14-15px
- Selected project: full opacity. Unselected: `--fg-3`
- Clicking a row selects it — the metadata below updates, the 3D object swaps texture
- No hover states on the list beyond cursor change — the selection *is* the interaction

**Left zone — Active Project Metadata (below selector):**
Structured key:value grid in Fragment Mono:
```
N:        01
Title:    Gyeol
Year:     2026
Type:     Brand / E-commerce / 3D
Status:   Shipped
```
Below the grid: description paragraph in General Sans, 13px, `--fg-2`, max-width ~320px.

Below description: "View project →" link in mono 9px uppercase. This triggers the FLIP expansion to Detail View.

**Right zone:**
3D CD case with the selected project's cover art as texture. Slow Y-axis rotation. Cursor-responsive tilt.

### Archive Tab

- Same structure as Index but filtered for experiments
- Uses cool version of the 3D object lighting or a subtle visual distinction
- Fewer items — the list is shorter, more breathing room

### About Tab

- Left zone expands: project selector morphs into bio content
- Lead paragraph in DM Serif Display, 28-32px — "Design engineer building at the intersection of craft and systems thinking."
- Below: body text in General Sans, 14px
- Below: structured stats in key:value format:
```
Location:     New York
Focus:        Design Engineering
Experience:   3+ years
Status:       Available
```
- Below: experience entries (period / role / description)
- Below: contact email + social links in mono 9px
- Right zone: 3D object scales down and drifts to a secondary position (lower-right, smaller). Or morphs to a different simple object.

---

## 6. Detail View (FLIP Expansion)

Triggered by clicking "View project →" or clicking the 3D object.

**FLIP animation (~500ms):**
1. The 3D CD case expands from its position in the right zone — grows to become a large hero element at the top of a scrollable view
2. The metadata on the left rearranges: title grows to display size, description expands, case study content begins appearing below
3. The tab strip gains a "← Back" element that reverses the FLIP on click
4. The viewport transitions from `overflow: hidden` to scrollable

**Detail layout (scrollable):**
- Sticky top bar with "← Back" left, project title right
- Hero area: the 3D object (now large) or a full-width image/video
- Project header: title in DM Serif Display, description, tags as small badges, year
- Case study content: editorial heading, subhead, body copy, process, engineering sections
- Diamond dividers between sections
- "Next project" link at bottom — clicking it FLIPs back to Main Stage with the next project selected

**Back transition:**
- Clicking "← Back": everything FLIP-reverses. The hero contracts back into the CD case. The metadata shrinks back into the selector. The viewport locks to `overflow: hidden` again.

---

## 7. 3D Scene

**Tech:** React Three Fiber + @react-three/drei

**The Object — CD Case (v1):**
- Simple box geometry with slightly rounded edges
- Dimensions roughly 1:1:0.1 ratio (square case, thin)
- Front face: project cover art as texture (mapped from `piece.image` or a dedicated cover field)
- Spine: thin, shows project title text (optional, could be a texture)
- Back: matte dark, nearly invisible
- Material: `MeshStandardMaterial` with `roughness: 0.85`, `metalness: 0.05` — matte, not shiny

**Lighting:**
- One directional light: warm-white, low intensity, positioned top-left
- One ambient light: very dim, just enough to fill shadows
- No environment map. No reflections. Flat and matte.

**Behavior:**
- Idle: slow Y-axis rotation (~0.1 rad/s)
- Cursor influence: the object tilts slightly toward the cursor position (parallax via `useSpring`). Max tilt: ~8 degrees on each axis.
- On project switch: current texture fades out (opacity → 0, ~200ms), new texture fades in (~200ms). The object itself doesn't move or resize during switch.
- On FLIP to detail: the object scales up and repositions via Framer Motion `layoutId` — the R3F canvas resizes to match.

**Performance:**
- Single `<Canvas>` that persists across all states. Never unmounts.
- Low poly geometry. No complex shaders.
- `frameloop="demand"` or `"always"` at low resolution for battery-conscious rendering.

---

## 8. Cursor

**The Frequency Cursor:**

A custom cursor that displays a "frequency" value based on mouse velocity.

- **Default:** small dot (6px) + tiny mono number next to it showing `0.00` in Hz
- **Moving:** velocity is calculated frame-by-frame. Higher velocity = higher Hz value. Range: `0.00` (idle) to `~120.00` (fast flick). The number updates via `useSpring` — smooth, not jumpy.
- **Over interactive elements:** the Hz number swaps to a contextual label — "View" or "Select" — in the same mono type, same position.
- **Idle (2+ seconds):** number dims to near-invisible, dot shrinks slightly. Revives on movement.
- **On touch devices:** cursor hidden entirely, native touch interactions.

**Styling:**
- Dot: `--fg` at 0.5 opacity, scales 6px → 10px with velocity
- Hz text: Fragment Mono, 8px, `--fg-3`, positioned 10px right of dot
- No rings, no tick marks, no reticle. Just the dot and the number.

**Implementation:**
- `useMotionValue` + `useSpring` for position and velocity
- Velocity → Hz mapping: `hz = Math.min(120, velocity * 0.8)` (tunable)
- Render as fixed-position div with `pointer-events: none`

---

## 9. Visual System

### Color — Pure Monochrome

```
--bg:     #0a0a0b     (near-black, faintly warm)
--fg:     rgba(240, 238, 232, 0.88)   (warm off-white)
--fg-2:   rgba(240, 238, 232, 0.50)
--fg-3:   rgba(240, 238, 232, 0.20)
--fg-4:   rgba(240, 238, 232, 0.08)
```

No accent color. Active states use full `--fg`. Inactive states use `--fg-3`. The 3D object's cover art textures provide all color in the experience.

### Typography — Three Roles, Strict

| Role | Font | Size | Usage |
|------|------|------|-------|
| Structure | Fragment Mono | 8-11px, uppercase, 0.08-0.14em tracking | Nav, labels, metadata keys, counter, cursor Hz, tab strip |
| Display | DM Serif Display | 28-48px, -0.02em tracking | Project titles, about lead paragraph |
| Body | General Sans | 13-14px, regular | Descriptions, case study copy |

### Atmosphere

- Particles: 15-20 max, opacity 0.015-0.03. Barely perceptible. Can be removed entirely if the 3D scene provides enough visual interest.
- No gradients, no glows, no atmospheric radials. The 3D scene's lighting is the atmosphere.
- The dark void *is* the design. Negative space does the work.

---

## 10. Technical Architecture

### Routing

This is a single-page app in terms of UX, but uses Next.js App Router for SEO/SSR:
- `/` — renders the preloader + Main Stage (Index tab)
- `/index/[slug]` — renders Main Stage with Detail View expanded for that project
- `/archive` — renders Main Stage with Archive tab active
- `/about` — renders Main Stage with About tab active

URL updates via shallow routing (`router.push(url, { shallow: true })` or `window.history.pushState`) so the page doesn't remount. The state management (which tab, which project, whether detail is expanded) drives the UI, not the route.

### State

A single Zustand store (already installed) or React context:
```
{
  activeTab: "index" | "archive" | "about"
  selectedProject: string (slug)
  isDetailExpanded: boolean
  preloaderDone: boolean
}
```

### Key Dependencies
- `framer-motion` — FLIP (`layoutId`), springs, AnimatePresence
- `@react-three/fiber` + `@react-three/drei` — 3D scene (already have `three` installed)
- `zustand` — state management (already installed)
- React Three Fiber and Framer Motion coexist: the R3F canvas lives in a `motion.div` with a `layoutId` so it participates in FLIP transitions.

### What Gets Removed
- `TransitionProvider.tsx`, `GameLink.tsx` — replaced by in-page state transitions
- `Nav.tsx` — replaced by in-page tab strip
- `SmoothScroll.tsx` / Lenis — no scrolling (except detail view, which uses native scroll)
- `GeometricFrame.tsx`, `HeroSection.tsx`, `ProjectSection.tsx` — no longer applicable
- `ui-panel` CSS and all panel/corner-accent styles
- Separate page files for `/index/page.tsx`, `/archive/page.tsx`, `/about/page.tsx` — everything renders from one root component
- `DetailView.tsx`, `DetailContent.tsx` — rebuilt as part of the unified stage

### What Gets Kept
- `ParticleCanvas.tsx` — simplified (fewer particles)
- `Cursor.tsx` — rebuilt as frequency cursor
- `pieces.ts`, `case-studies.ts`, `contact.ts` — data layer unchanged
- `RouteAnnouncer.tsx` — accessibility
- Font setup in `layout.tsx`
- Color tokens in `globals.css` (simplified)

---

## 11. Responsive

**Desktop (>768px):** Full experience as described.

**Mobile (<768px):**
- 3D canvas hidden or replaced with a static image
- Left/right layout becomes full-width stacked
- Tab strip moves to bottom of screen (thumb-accessible)
- Frequency cursor disabled (touch devices)
- Preloader simplified (counter only, no progress line)
- Detail view is standard scrollable page

---

## 12. Accessibility

- Skip-to-content link preserved
- Route announcer for URL changes
- Keyboard navigation: Tab through selector items, Enter to select/expand
- `prefers-reduced-motion`: all FLIP transitions become instant (0ms), 3D rotation stops, particles freeze
- 3D canvas has `aria-hidden="true"` — it's decorative
- All text meets WCAG AA contrast against `--bg`
- Focus-visible outlines on all interactive elements
