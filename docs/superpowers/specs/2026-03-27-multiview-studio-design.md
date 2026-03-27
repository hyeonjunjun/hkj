# HKJ Portfolio v3: Multi-View Studio — Design Spec

## Concept

A multi-view portfolio inspired by TLB (betteroff.studio). Three views — **Index, Drift, Archive** — show the same pool of 14 items (projects, brands, explorations) in fundamentally different spatial arrangements. GSAP FLIP transitions animate items between views. Two pages total: homepage (3 views + detail overlay) and About. Avant-garde fashion typography (Margiela/CDG register). Monochromatic palette with switchable light/dark mode.

## References

- **TLB (betteroff.studio)** — multi-view system, GSAP FLIP transitions, music widget, 3D perspective Surf view, image skew on scroll
- **Jasmine Gunarto** — Break section naming, full-screen carousel, dark palette with purple accent
- **Maison Margiela** — numbered systems, white/nude/black only, intentional irregularity
- **Comme des Garçons** — mixed typography, asymmetry as system

## Tech Stack

- **Next.js 16** (App Router)
- **TypeScript** (strict)
- **Tailwind CSS v4**
- **GSAP** + **FLIP plugin** — view transitions, 3D transforms, scroll-linked animations, preloader choreography
- **framer-motion** — UI animations (hover states, overlay enter/exit, detail panel)
- **Lenis** — smooth scroll
- **Zustand** — view state, theme state, mobile menu, overlay state

## Fonts

Three roles, avant-garde fashion register:

| Role | Font | Usage |
|------|------|-------|
| Display | **PP Neue Montreal Bold** (or Tusker Grotesk) — condensed bold sans | HKJ mark, view names at large scale |
| Body | **Satoshi** (variable) — clean grotesque | Descriptions, nav, body text, UI |
| System | **Fragment Mono** — editorial mono | Labels, metadata, clock, numbered items (01–14), tags |

Margiela touch: **numbered items everywhere.** Projects are 01–14. Tags in mono. The numbering creates systematic feel that contrasts with expressive display type.

## Color

### Light Mode (default during daytime 6am–6pm)

```css
--paper: #f7f6f3;
--ink-full: rgba(35, 32, 28, 1.00);
--ink-primary: rgba(35, 32, 28, 0.82);
--ink-secondary: rgba(35, 32, 28, 0.52);
--ink-muted: rgba(35, 32, 28, 0.35);
--ink-faint: rgba(35, 32, 28, 0.20);
--ink-ghost: rgba(35, 32, 28, 0.10);
--ink-whisper: rgba(35, 32, 28, 0.05);
```

### Dark Mode (default at night 6pm–6am, toggle override)

```css
--paper: #0a0908;
--ink-full: rgba(240, 235, 227, 1.00);
--ink-primary: rgba(240, 235, 227, 0.85);
--ink-secondary: rgba(240, 235, 227, 0.55);
--ink-muted: rgba(240, 235, 227, 0.38);
--ink-faint: rgba(240, 235, 227, 0.20);
--ink-ghost: rgba(240, 235, 227, 0.10);
--ink-whisper: rgba(240, 235, 227, 0.05);
```

**No accent color** except the blue dot (`#4A90D9`) on item 01.

Time-of-day sets initial mode. Manual toggle overrides. Stored in localStorage.

## Pages

```
/           Homepage (Index / Drift / Archive views + detail overlay)
/about      About page (unique visual expression)
```

No other routes. Case studies, explorations, writing — all accessed via detail overlays on the homepage.

---

## Homepage Layout

### Navigation Bar

```
Index, Drift, Archive              HKJ/2026              9:02 PM EST · ABOUT
```

- **Left:** View switcher — `Index`, `Drift`, `Archive`. Fragment Mono, 11px, uppercase, tracking 0.06em. Active view: `--ink-full` + underline. Inactive: `--ink-muted`. Underline animates `scaleX(0→1)` on switch, `transform-origin` follows direction.
- **Center:** `HKJ/2026` — Display font, bold, large (`clamp(28px, 4vw, 48px)`). The visual anchor. Year updates automatically.
- **Right:** NYC clock (Fragment Mono, 11px, `--ink-muted`) + `ABOUT` link (Fragment Mono, 11px, uppercase). + Theme toggle (subtle sun/moon icon, 12px).
- **Height:** 56px. Fixed top. `z-index: 100`.
- **Background:** transparent, no blur.

### View: Index

Dense thumbnail grid. All 14 items visible at once.

- CSS Grid: `repeat(5, 1fr)`, gap `8px`
- Max width: `1200px`, centered
- Each item: square (`aspect-ratio: 1`)
- Wide items (2-3): `grid-column: span 2`
- Vertically centered between nav and bottom edge
- Items numbered 01–14 in Fragment Mono at top-left corner of each thumbnail, `--ink-whisper` (barely visible, discovered on close inspection)

### View: Drift

3D perspective fan. Items tilted at varied angles creating depth.

- Parent: `perspective: 1000px`
- Items: `transform-style: preserve-3d`, each with unique `rotateY(±15deg)`, `rotateX(±5deg)`, `translateZ(-50 to 50px)` values
- Items arranged in a loose horizontal arc — not a grid
- **Scroll modulates wave intensity:** faster scroll = items tilt more dramatically (±25deg). Slow/stopped = calm (±5deg). Driven by scroll velocity via Lenis + GSAP.
- **Hover:** item "peeps out" — translates forward (`translateZ(30px)`) and straightens rotation
- **Image skew on scroll:** images `skewY(±2deg)` based on scroll direction. Snaps back on stop.
- `cursor: grab` on the container, `cursor: grabbing` while dragging

### View: Archive

Chronological timeline organized by year.

- Horizontal flow per year: images in a row, scrollable horizontally
- Year labels (`2026`, `2025`) in display type, large, left-aligned
- Vertical scroll between year sections
- Items sized by type: WORK items larger, EXPLORE items smaller
- Month sub-labels optional (Fragment Mono, small)

### Bottom Bar

Fixed bottom, 32px height:
- Left: `design engineer · brands · software` — Fragment Mono, 10px, `--ink-muted`
- Right: `NYC` or email — Fragment Mono, 10px, `--ink-muted`

---

## Preloader — Homepage Entrance Choreography

Not a separate loading screen. The homepage itself assembles in front of you.

### Phase 1: Shell (0–0.5s)

Dark/empty screen (current theme's `--paper`). The `HKJ/2026` brand mark fades in at viewport center — large display type. Nav elements invisible.

### Phase 2: Structure (0.5–1.2s)

Nav elements fade in with stagger (view switcher left, clock+about right). The `HKJ/2026` mark GSAP-FLIPs from center to its final nav position (shrinks, moves up). View switcher animates underline to "Index" (default view). The page skeleton is visible but no content.

### Phase 3: Content (1.2–2.5s)

Grid items enter with displacement:
- Each thumbnail flies in from a random off-screen direction
- During flight: `rotate(±8deg)`, `skew(±3deg)`, `filter: blur(2px)`, `scale(0.8)`
- On landing: `rotate(0)`, `skew(0)`, `blur(0)`, `scale(1)` — spring physics via GSAP
- Stagger: `0.04s` per item (14 × 0.04 = 0.56s total)
- Items land in their Index grid positions

### Phase 4: Live (2.5s+)

Blue dot pulses. Site interactive. Preloader complete.

### Repeat Visits (sessionStorage)

Skip Phase 1-2. Items stagger in with less displacement (shorter flight, 0.02s stagger). Total ~0.8s.

### prefers-reduced-motion

No animation. Content appears immediately.

---

## GSAP FLIP View Transitions

When switching between Index ↔ Drift ↔ Archive:

1. `FLIP.getState()` — record bounding rects of all visible items
2. Switch view layout (DOM changes, new CSS applied)
3. `FLIP.from()` — animate each item from old rect to new rect
4. Duration: `0.6s`, ease: `Expo.easeOut` (`cubic-bezier(.19, 1, .22, 1)`)
5. Only viewport-visible items animate (IntersectionObserver gate)
6. During transition: items have slight `rotate` and `skew` (momentum feel)

**Drift 3D handling:** When FLIPping to/from Drift, the system must account for 3D transforms (`perspective`, `rotateY`, `translateZ`) in the source/target rects. GSAP FLIP supports this but requires `nested: true` and `absoluteOnLeave: true` flags.

---

## Hover Interaction (All Views)

- Thumbnail scales to `1.05` — spring (framer-motion `whileHover`)
- Shadow: `0 8px 32px rgba(--ink-rgb, 0.08)`
- Type tag appears at bottom-right: `WORK` / `BRAND` / `EXPLORE` (Fragment Mono 9px)
- After 300ms hover: caption panel with title + description + "View →"

## Project Detail Overlay

Click an item → GSAP FLIP animates the thumbnail to fill ~80% of viewport (centered, large). A detail panel slides in beside/below:

- Title (display type, large)
- Number (01–14, Fragment Mono)
- Description (Satoshi, body size)
- Tags (Fragment Mono)
- Additional images if available (thumbnail strip)
- External link if applicable
- Close: cursor-following "×" on desktop, fixed top-right on mobile

The homepage stays in the background (dimmed, `pointer-events: none`). No route change. Close reverses the FLIP.

---

## About Page

Unique visual expression (to be designed in detail later). Route: `/about`.

Requirements:
- Distinct from homepage — its own layout, potentially interactive
- Bio, philosophy, contact, socials
- Dark or unique palette (not just homepage in a different color)
- GSAP page transition from homepage (fade/morph)

---

## Mobile (< 768px)

- **Index:** 3-column grid
- **Drift:** Simplified — items in a vertical stack with subtle rotation (no full 3D)
- **Archive:** Vertical scroll, one year section at a time
- **View switcher:** Horizontal tabs at top (swipeable)
- **Detail overlay:** Full-screen
- **Nav:** Hamburger → full-screen menu with view links + About
- **Preloader:** Simplified — items stagger in from bottom, no random directions

---

## Content Pool

Same 14 items from `sheet-items.ts`. Each item has:
- `id`, `title`, `type` (WORK/BRAND/EXPLORE), `number` (01–14)
- `image` (path) or `color` (hex for placeholders)
- `description`, `year`
- `wide` (boolean, for Index grid)
- `wip` (boolean)
- `href` (external link, optional)
- `gallery` (additional images, optional)

---

## Components

| Component | File | Purpose |
|-----------|------|---------|
| `Preloader` | `src/components/Preloader.tsx` | Homepage entrance choreography |
| `ViewSwitcher` | `src/components/ViewSwitcher.tsx` | Index/Drift/Archive toggle with underline animation |
| `IndexView` | `src/components/views/IndexView.tsx` | Dense 5-col grid |
| `DriftView` | `src/components/views/DriftView.tsx` | 3D perspective fan with scroll-linked wave |
| `ArchiveView` | `src/components/views/ArchiveView.tsx` | Chronological timeline |
| `GridItem` | `src/components/GridItem.tsx` | Individual thumbnail (shared across views) |
| `BlueDot` | `src/components/BlueDot.tsx` | Pulsing blue indicator |
| `DetailOverlay` | `src/components/DetailOverlay.tsx` | Project detail panel (FLIP expand) |
| `GlobalNav` | `src/components/GlobalNav.tsx` | Nav bar with view switcher, brand mark, clock |
| `BottomBar` | `src/components/BottomBar.tsx` | Fixed bottom info bar |
| `NYCClock` | `src/components/NYCClock.tsx` | Live EST clock |
| `ThemeToggle` | `src/components/ThemeToggle.tsx` | Light/dark toggle |
| `MobileMenu` | `src/components/MobileMenu.tsx` | Full-screen mobile nav |

## Dependencies

**Add:** `gsap` (with FLIP plugin), `framer-motion`
**Keep:** `lenis`, `zustand`, `next`, `tailwindcss`

## Design Principles

1. **Three views, one pool.** The same 14 items in three spatial metaphors. The views ARE the interaction design.
2. **GSAP FLIP is the flagship.** Items animating between views is the thing people share. It must be flawless.
3. **Margiela register.** Numbered items, mono labels, monochromatic, intentional irregularity. Restraint = confidence.
4. **No routes except About.** Everything happens on the homepage. Detail overlays, not page navigations.
5. **The preloader IS the homepage.** Not a separate screen — the page assembling itself.
