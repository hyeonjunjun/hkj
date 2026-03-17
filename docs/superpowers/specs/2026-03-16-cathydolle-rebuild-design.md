# HKJ Portfolio: Cathydolle-Faithful Rebuild

## Overview

Rebuild the HKJ Studio portfolio homepage as a cathydolle.com-faithful reconstruction. The homepage is a single full-viewport surface containing only a project list (or slider), no scroll, no additional sections. The design communicates taste through restraint, generous whitespace, and typographic precision. Projects feel like discoveries in a curated sequence.

Cathydolle's exact design system is adopted: vw-based column grid, 11px uppercase monospace labels, alternating-free sequential list, clip-path page transitions, and image-split preloader. HKJ's warm palette, serif/sans/mono font trio, and grain overlay provide differentiation.

## Guiding Principles

1. **Whitespace is content.** Every gap is intentional. With few projects, rows breathe more.
2. **One font size for UI.** All navigational and list text is 11px JetBrains Mono uppercase.
3. **Three-tier easing.** `cubic-bezier(0.86, 0, 0.07, 1)` for cinematic moments (page transitions, preloader). `cubic-bezier(0.4, 0, 0.2, 1)` at `200ms` for micro-interactions (hover, toggle). `[0.16, 1, 0.3, 1]` (expo-out) for content entrance reveals. No other curves.
4. **No decorative elements.** No shadows, no rounded corners, no icons, no borders on content.
5. **Scalability.** The list must look good with 3 projects or 20.

## Tech Stack (Unchanged)

- Next.js 16 + React 19
- Tailwind CSS v4
- GSAP (ScrollTrigger, timeline) + Framer Motion (AnimatePresence, layoutId, animate)
- Lenis smooth scroll
- Zustand (minimal state)

## Color & Typography (Unchanged)

| Token | Value |
|---|---|
| `--color-bg` | `#F5F2ED` (warm off-white) |
| `--color-surface` | `#EDE9E3` |
| `--color-border` | `#D5D0C8` |
| `--color-border-strong` | `#C2BBB0` |
| `--color-text` | `#1A1917` (near-black) |
| `--color-text-secondary` | `#4A4540` |
| `--color-text-dim` | `#7A756D` |
| `--color-text-ghost` | `#A8A29E` |
| `--color-accent` | `#B8956A` (burnished gold) |
| `--color-accent-2` | `#7D6B5D` |
| `--color-ink` | `#E5E0D8` |
| `--font-display` | GT Alpina (300, 400, 400i, 500) |
| `--font-sans` | Sohne (300, 400, 500) |
| `--font-mono` | JetBrains Mono |

GT Alpina appears only on case study pages and the contact email display. All homepage UI text is JetBrains Mono 11px uppercase.

**Note:** MEMORY.md references an older dark palette (#111110 bg). The light palette above is the current, approved palette in `globals.css`. MEMORY.md will be updated to match.

## Grain Overlay

Kept. `noise-grain::before` pseudo-element, `opacity: 0.06`, `mix-blend-mode: multiply`, fixed position, `pointer-events: none`, `z-index: 1`.

---

## 1. Homepage Structure

The homepage is `100svh`, `overflow: hidden`. No scroll. Three stacked regions:

```
Header  — fixed height, natural content
Content — flex-1, project display (list or slider)
Footer  — fixed height, single line
```

### 1.1 Header

- Height: natural, with `padding: clamp(1.2rem, 2.5vh, 1.8rem)` vertical
- Horizontal padding: vw-based `padding-x-1` (matching column grid)
- Contents:
  - **Left:** "HKJ" — JetBrains Mono, 11px, uppercase, `letter-spacing: 0.08em`, `color: var(--color-text)`
  - **Center-left (ml-4):** List / Slider toggle
    - Two buttons, JetBrains Mono, 11px, uppercase, `letter-spacing: 0.1em`
    - Inactive: `color: var(--color-text-ghost)`
    - Active: `color: var(--color-text)` with 1px underline via Framer Motion `layoutId="viewIndicator"`, `spring: { stiffness: 400, damping: 30 }`
    - Color transition: `0.3s ease`
  - **Right:** "About" link — same font spec as toggle, navigates to `/about`

### 1.2 Content Area

- `flex: 1`, `overflow: hidden`
- Contains either ListView or SliderView based on toggle state
- Framer Motion `AnimatePresence mode="wait"` handles view transitions:
  - Enter: `opacity: 0, y: 20` -> `opacity: 1, y: 0` over `0.6s` with `[0.16, 1, 0.3, 1]` (expo-out)
  - Exit: `opacity: 1, y: 0` -> `opacity: 0, y: -12` over `0.3s` with `[0.4, 0, 1, 1]` (ease-in)

### 1.3 Footer

- Height: natural, with `padding-bottom: clamp(1rem, 2vh, 1.5rem)`
- Horizontal padding: vw-based `padding-x-1`
- Contents:
  - **Right-aligned:** `CONTACT_EMAIL` from `src/constants/contact.ts` ("hello@hkjstudio.com") — JetBrains Mono, 11px, uppercase, `letter-spacing: 0.08em`, `color: var(--color-text-ghost)`
  - Hover: `color: var(--color-text-dim)`, `transition: color 0.3s ease`
  - Click: `mailto:${CONTACT_EMAIL}` link

---

## 2. List View

A single vertical column of project rows filling the content area.

### 2.1 Container

- `display: flex`, `flex-direction: column`, `justify-content: center`
- `padding: 10vh 0` (generous top/bottom breathing room)
- `height: 100%`
- Horizontal padding: `padding-x-1` (vw-based)

### 2.2 Project Rows

Each row is a flex container with a number and title.

**Layout:**
- `display: flex`, `align-items: center`, `gap: gutter-gap` (vw-based)
- Height: dynamic based on project count
  - Formula: available height (after py-10vh) divided by project count
  - Minimum: `8vh`
  - Maximum: `18vh`
  - With 3 projects: ~`20vh` each (generous)
  - With 12 projects: ~`6.6vh` each (compact, use min `8vh` and allow scroll)
- All rows left-aligned consistently (no alternating)

**Row content:**
- **Number:** `01/` — JetBrains Mono, 11px, italic, `color: var(--color-text-ghost)`
- **Title:** `GYEOL: 결` — JetBrains Mono, 11px, uppercase, `font-weight: 500`, `letter-spacing: 0.08em`
  - Default: `color: var(--color-text-dim)`
  - Hover: `color: var(--color-text)`
  - WIP: `color: var(--color-text-ghost)` with "(WIP)" suffix at `opacity: 0.4`
- **Gap between number and title:** `gutter-gap-1` (vw-based, ~0.56vw desktop)

**Hover behavior:**
- `transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1)` (cathydolle's exact transition)
- Text color shift only — no translation, no scale
- `cursor: pointer` on non-WIP projects

**Click:** Navigates to `/work/[slug]` via Next.js router, triggering page transition.

**Entrance animation (Framer Motion):**
- `staggerContainer`: children stagger at `0.07s`, delay `0.15s`
- Each row: `fadeUp` variant — `opacity: 0, y: 12` -> `opacity: 1, y: 0` over `0.9s` with `[0.16, 1, 0.3, 1]`

### 2.3 Scalability

- When projects exceed what fits in the viewport (roughly >8-10), the container switches to `overflow-y: auto` with hidden scrollbar
- Row height clamps at minimum `8vh` to maintain readability
- The list naturally grows: adding a project to `PROJECTS` array is the only change needed

---

## 3. Slider View

Horizontally scrollable full-height project images.

### 3.1 Container

- `display: flex`, `height: 100%`, `overflow: hidden`
- Horizontal padding: `padding-x-1` (vw-based)
- `gap: gutter-gap` (vw-based, ~0.56vw desktop)

### 3.2 Project Cards

Each project is a full-height image card.

**Layout:**
- Width: `span-w-4` (~32.6vw on desktop, ~63vw on mobile)
- Height: fills container (content area height)
- `flex-shrink: 0`
- Image: `object-fit: cover`, fills entire card
- Aspect ratio: determined by container height, not forced

**Label overlay:**
- Positioned `absolute bottom-0 left-0 right-0`, `padding: 1.25rem`
- Text: project title — JetBrains Mono, 11px, uppercase, `letter-spacing: 0.1em`
- Color: `#fff` with `text-shadow: 0 1px 4px rgba(0,0,0,0.4)`
- WIP projects: image at `opacity: 0.5`, "(WIP)" appended to title

**Scrolling:**
- Framer Motion `drag="x"` with constraints
- `dragElastic: 0.15`
- `useMotionValue` + `useSpring({ stiffness: 200, damping: 30 })` for momentum
- Click-through prevention: track `wasDragged` ref, only navigate on clean click

**Entrance animation:**
- Each card: `opacity: 0, scale: 0.95` -> `opacity: 1, scale: 1`
- Duration: `0.7s`, delay: `i * 0.1s`
- Easing: `[0.16, 1, 0.3, 1]`

**No image parallax on drag** (simpler than current implementation).

---

## 4. Preloader

Cathydolle-style image-split entrance animation.

### 4.1 Sequence (GSAP Timeline)

Total duration: ~2.5s. Easing: `cubic-bezier(0.86, 0, 0.07, 1)` throughout.

**Phase 1 — Box Appear (0s - 0.4s):**
- Centered rectangle, `60px x 80px`
- `opacity: 0` -> `opacity: 1`, `scale: 0.8` -> `scale: 1`
- Fill: `var(--color-border)` (#D5D0C8)
- Duration: `0.4s`

**Phase 2 — Box Expand (0.4s - 1.0s):**
- Rectangle scales to contain project thumbnails
- `width: 60px` -> `width: span-w-4` (~32vw), `height: 80px` -> height to match image aspect
- First project image fades in inside the box via `clip-path: inset(100% 0 0 0)` -> `inset(0)`
- Duration: `0.6s`

**Phase 3 — Split & Distribute (1.0s - 1.8s):**
- The box "splits" — each project thumbnail separates
- The preloader always uses the same animation regardless of view mode (list is the default). Thumbnails shrink and fade out while translating upward, revealing the text list underneath.
- Duration: `0.8s`
- Stagger: `0.1s` between each project image
- The preloader does NOT need to know the current view mode — it always resolves to list view.

**Phase 4 — Chrome Reveal (1.8s - 2.2s):**
- Header fades in: `opacity: 0` -> `opacity: 1`, `y: -8` -> `y: 0`
- Footer fades in: same
- Toggle becomes interactive
- Duration: `0.4s`

### 4.2 Skip Logic

- `sessionStorage.getItem('hkj-visited')`: if truthy, skip to a simple `0.3s` fade-in
- Set `sessionStorage.setItem('hkj-visited', '1')` after first preloader completes
- Also skip if `prefers-reduced-motion: reduce`

### 4.3 Implementation

- Full-viewport fixed overlay, `z-index: 50`, `background: var(--color-bg)`
- Managed by Zustand `isLoaded` state (existing pattern)
- GSAP timeline with `.to()` chains
- On complete: overlay fades out and is removed from DOM

---

## 5. Page Transitions

Cathydolle's exact transition timing, implemented via Framer Motion.

### 5.1 Exit Animation

- Current page: `scale: 1` -> `scale: 0.9`, `opacity: 1` -> `opacity: 0.25`
- Duration: `1.75s`
- Easing: `cubic-bezier(0.86, 0, 0.07, 1)`
- Z-index: 1 (behind incoming page)

### 5.2 Enter Animation

- New page: `clip-path: inset(100% 0 0 0)` -> `clip-path: inset(0 0 0 0)`
- Duration: `1.75s`
- Easing: `cubic-bezier(0.86, 0, 0.07, 1)`
- Z-index: 1000 (on top)

### 5.3 Implementation

Update existing `PageTransition.tsx` to use these values instead of current timing. Use Framer Motion `animate()` imperative API (already in place).

---

## 6. vw-Based Column Grid

New CSS utility classes in `globals.css`, matching cathydolle's grid math.

### 6.1 Gutter Variables

```css
:root {
  --grid-gutter: 0.56vw;  /* desktop default */
}
@media (max-width: 1023px) {
  :root { --grid-gutter: 1.04vw; }
}
@media (max-width: 767px) {
  :root { --grid-gutter: 2.13vw; }
}
```

### 6.2 Utility Classes

```css
.gutter-gap { gap: var(--grid-gutter); }
.padding-x-1 { padding-left: var(--grid-gutter); padding-right: var(--grid-gutter); }
```

Column span widths (desktop values, responsive variants follow cathydolle's ratios):

| Class | Desktop | Tablet | Mobile |
|---|---|---|---|
| `.span-w-1` | `7.73vw` | `7.20vw` | `14.18vw` |
| `.span-w-2` | `16.02vw` | `15.45vw` | `30.49vw` |
| `.span-w-3` | `24.31vw` | `23.70vw` | `46.80vw` |
| `.span-w-4` | `32.59vw` | `31.94vw` | `63.11vw` |
| `.span-w-5` | `40.88vw` | `40.19vw` | `79.42vw` |
| `.span-w-7` | `57.45vw` | `56.68vw` | `95.73vw` |
| `.span-w-8` | `65.74vw` | `64.93vw` | `95.73vw` |
| `.span-w-12` | `98.89vw` | `97.92vw` | `95.73vw` |

Margin classes:

| Class | Desktop | Tablet | Mobile |
|---|---|---|---|
| `.span-ml-1` | `7.73vw` | `7.20vw` | `14.18vw` |
| `.span-ml-2` | `16.57vw` | `16.49vw` | `32.62vw` |

Spans 6, 9, 10, 11 are omitted because the homepage only uses spans 1-5, 7-8, and 12. If needed for case study pages, derive with: `span-w-N = (N * column_width) + ((N - 1) * gutter)` where column_width = `(100vw - 13 * gutter) / 12`.

These are defined as Tailwind `@layer utilities` in `globals.css`.

---

## 7. Navigation Changes

### 7.1 GlobalNav

- Visible on all pages EXCEPT homepage (homepage has its own header)
- On non-homepage pages: fixed position, contains "HKJ" logo + "Work" (links to `/`) + "About" links
- Scroll-direction show/hide behavior preserved
- Backdrop blur preserved

### 7.2 MobileMenu

- Adapted for new structure
- Homepage mobile: header collapses toggle into a simpler layout
- Non-homepage: existing behavior

### 7.3 Contact & About Accessibility

- Contact: accessible via About page and email in homepage footer
- About: accessible via "About" link in header on homepage and GlobalNav on other pages
- Colophon: moved to bottom of About page

---

## 8. Files to Delete

| File | Reason |
|---|---|
| `src/components/Cursor.tsx` | Custom cursor removed |
| `src/components/ui/ScrollProgress.tsx` | Progress bar removed from homepage |
| `src/components/WorksGallery.tsx` | R3F gallery, unused |
| `src/components/ProjectCover.tsx` | R3F cover, unused |
| `src/components/sections/Works.tsx` | Old works section, unused |
| `src/app/work/page.tsx` | `/work` index route — redundant, homepage IS the project list |

## 9. Files to Rewrite

| File | Change |
|---|---|
| `src/components/sections/Hero.tsx` | Full rewrite: single-column list + slider, vw grid, cathydolle-faithful |
| `src/components/StudioPreloader.tsx` | Full rewrite: image-split animation |
| `src/components/PageTransition.tsx` | Update timing to cathydolle's 1.75s cubic-bezier |
| `src/app/page.tsx` | Homepage = Hero only (remove Contact, Colophon) |
| `src/app/layout.tsx` | Remove Cursor, ScrollProgress imports |
| `src/app/globals.css` | Add vw-based column grid utilities |
| `src/constants/navigation.ts` | Update: `Work` -> `{ label: "Work", href: "/" }`, remove `Contact` anchor (use `mailto:` or remove), keep `About` |
| `src/lib/store.ts` | Remove `hoveredProject` / `setHoveredProject` (orphaned after R3F deletion). Remove `activeProject` / `setActiveProject` if unused. Keep `isLoaded`, `navVisible`, `mobileMenuOpen`, `isTransitioning`. |

## 10. Files Unchanged

| File | Reason |
|---|---|
| `src/components/SmoothScroll.tsx` | Lenis config unchanged. Note: on homepage (no-scroll), Lenis is safe because `overflow: hidden` prevents scroll events. No conditional disabling needed. |
| `src/components/GlobalNav.tsx` | Minor: hide on homepage via pathname check |
| `src/components/MobileMenu.tsx` | Minor adaptation |
| `src/components/sections/Contact.tsx` | Stays, used on About page |
| `src/components/sections/Colophon.tsx` | Stays, used on About page |
| `src/app/work/[slug]/page.tsx` | Case study pages unchanged |
| `src/app/about/page.tsx` | Add Contact + Colophon sections to bottom |
| `src/app/lab/page.tsx` | Unchanged, kept as-is |
| `src/constants/projects.ts` | Data unchanged |
| `src/constants/contact.ts` | Unchanged. Footer reads `CONTACT_EMAIL` from here. |
| `src/lib/gsap.ts` | Unchanged |

## 11. Dependency Cleanup

Remove unused npm packages after R3F and other deletions:

| Package | Reason |
|---|---|
| `@react-three/fiber` | R3F components deleted |
| `@react-three/drei` | R3F components deleted |
| `@react-three/postprocessing` | R3F components deleted |
| `three` | R3F components deleted |
| `@types/three` | R3F components deleted |
| `simplex-noise` | Only used in R3F components |
| `leva` | R3F debug UI, unused |
| `use-sound` | No audio in the project |
| `lucide-react` | Verify usage; remove if no icons remain |
| `react-intersection-observer` | Verify usage; may be replaced by ScrollTrigger |

---

## Responsive Behavior Summary

| Breakpoint | Behavior |
|---|---|
| Desktop (>= 1024px) | Full layout, vw-based grid, list/slider toggle |
| Tablet (768-1023px) | Adjusted vw gutters, list/slider toggle preserved |
| Mobile (< 768px) | Larger row heights (18vh), slider card width ~63vw, toggle may default to list, mobile nav |

## Success Criteria

1. Homepage loads in under 2s, preloader plays on first visit
2. Adding a project to `PROJECTS` array requires zero layout changes
3. The site feels spacious with 3 projects AND dense with 12
4. Page transitions between homepage and case studies feel seamless
5. A designer visiting the site notices the typography and spacing before anything else
