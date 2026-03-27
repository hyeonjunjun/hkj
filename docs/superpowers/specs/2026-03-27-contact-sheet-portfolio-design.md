# HKJ Portfolio v2: "The Sheet" — Design Spec

## Concept

One screen. 14 project thumbnails arranged in a dense, curated grid. All visible at once. A blue dot above the first project sets the viewer's bearing. Hover to magnify and reveal details. Click to enter. The homepage is a contact sheet — the full creative output of a design engineer, brand designer, and founder, laid out for examination.

## Identity

**HKJ** is a studio website. It showcases personal projects, professional work, and brands created by Ryan Jun (Hyeon Jun). The site serves recruiters, clients, and peers equally. It should demonstrate craft through interaction quality, not visual spectacle.

## Tech Stack

- **Next.js 16** (App Router)
- **TypeScript** (strict)
- **Tailwind CSS v4**
- **framer-motion** — all animations (springs, layoutId transitions, AnimatePresence)
- **Lenis** — smooth scroll on inner pages only (no scroll on homepage)
- **Zustand** — minimal store (mobile menu state)

## Fonts

- **Display:** Newsreader (variable, self-hosted) — project titles, headings
- **Body:** Satoshi (variable, self-hosted) — descriptions, nav, body text
- **System:** Fragment Mono (self-hosted) — metadata, labels, tags, clock

## Color

Ink-on-paper. One accent.

```css
--paper: #f7f6f3;
--ink-full: rgba(35, 32, 28, 1.00);
--ink-primary: rgba(35, 32, 28, 0.82);
--ink-secondary: rgba(35, 32, 28, 0.52);
--ink-muted: rgba(35, 32, 28, 0.35);
--ink-faint: rgba(35, 32, 28, 0.20);
--ink-ghost: rgba(35, 32, 28, 0.10);
--ink-whisper: rgba(35, 32, 28, 0.05);
--accent-blue: #4A90D9;
```

No other colors on the base page. Project images provide all visual variety.

## Pages

```
/                   Homepage (contact sheet)
/work/[slug]        Case study detail
/exploration        Flat gallery (no detail pages)
/writing            Journal list
/writing/[slug]     Journal entry
/about              Bio, philosophy, contact
```

---

## Homepage Layout

### Structure

```
┌──────────────────────────────────────────────────┐
│ HKJ                                       ABOUT  │  ← fixed nav, 48px
│                                                  │
│        ●                                         │  ← blue dot above item 1
│  ┌────┐ ┌────┐ ┌────┐ ┌──────────┐ ┌────┐      │
│  │ 01 │ │ 02 │ │ 03 │ │    04    │ │ 05 │      │  ← row 1
│  │    │ │    │ │    │ │  (wide)  │ │    │      │
│  └────┘ └────┘ └────┘ └──────────┘ └────┘      │
│  ┌──────────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐      │
│  │    06    │ │ 07 │ │ 08 │ │ 09 │ │ 10 │      │  ← row 2
│  │  (wide)  │ │    │ │    │ │    │ │    │      │
│  └──────────┘ └────┘ └────┘ └────┘ └────┘      │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐                    │
│  │ 11 │ │ 12 │ │ 13 │ │ 14 │                    │  ← row 3 (partial)
│  │    │ │    │ │    │ │    │                    │
│  └────┘ └────┘ └────┘ └────┘                    │
│                                                  │
│  design engineer · brands · software     NYC     │  ← fixed bottom bar
└──────────────────────────────────────────────────┘
```

### Grid Specification

- CSS Grid: `grid-template-columns: repeat(5, 1fr)`
- Gap: `8px`
- Max width: `1200px`, centered with `margin: 0 auto`
- Side padding: `24px`
- Each cell: square aspect ratio (`aspect-ratio: 1`)
- "Wide" items: `grid-column: span 2` (2-3 items get this treatment for hierarchy)
- The grid is vertically centered in the viewport (between nav and bottom bar)

### Grid Item Assignment (14 items)

| Slot | Project | Type | Size | Image |
|------|---------|------|------|-------|
| 01 | Gyeol: 결 | WORK | 1×1 | gyeol-display-hanji.webp |
| 02 | Sift | WORK | 1×1 | sift-v2.webp |
| 03 | Conductor | WORK | 1×1 | color field (#3d3830) + grain |
| 04 | [Brand A] | BRAND | 2×1 (wide) | TBD brand mark |
| 05 | Spring Grain | EXPLORE | 1×1 | gyeol-spring.webp |
| 06 | [Brand B] | BRAND | 2×1 (wide) | TBD brand mark |
| 07 | Rain on Stone | EXPLORE | 1×1 | gyeol-rain.webp |
| 08 | Hanji Display | EXPLORE | 1×1 | gyeol-display-hanji.webp |
| 09 | Green Tea | EXPLORE | 1×1 | gyeol-green-tea.webp |
| 10 | Cushion | EXPLORE | 1×1 | cushion-gyeol.webp |
| 11 | Clouds at Sea | EXPLORE | 1×1 | clouds thumbnail |
| 12 | [Project D] | WORK | 1×1 | TBD |
| 13 | [Project E] | WORK | 1×1 | TBD |
| 14 | [Brand C] | BRAND | 1×1 | TBD |

Items marked TBD use color field + grain placeholder (same as Conductor).

---

## The Blue Dot

- Size: `8px` circle
- Color: `var(--accent-blue)` (#4A90D9)
- Position: centered above thumbnail #1 (Gyeol), `12px` gap above the image
- Animation: subtle pulse (`scale: 1 → 1.3 → 1`, `opacity: 1 → 0.6 → 1`, 2s loop, ease-in-out)
- Hover: shows tooltip `start here` in Fragment Mono 9px, appears with spring animation
- This is the ONLY non-ink color on the homepage

---

## Hover Interaction

### Phase 1: Approach (cursor enters thumbnail, immediate)

- Thumbnail: `scale(1.05)` via `whileHover`, spring (stiffness: 400, damping: 30)
- Shadow: `0 8px 32px rgba(35, 32, 28, 0.08)` fades in
- Type tag fades in at bottom-right corner of image: `WORK` / `BRAND` / `EXPLORE`
  - Fragment Mono, 9px, uppercase, `--ink-muted`
  - `opacity: 0 → 1`, spring, 150ms

### Phase 2: Examine (cursor stays 300ms+)

- Caption panel appears below the thumbnail (or beside if near edge)
- Content:
  - Title: Newsreader italic, 18px, `--ink-primary`
  - Description: Satoshi, 13px, `--ink-secondary`, one line, truncated
  - "View →" link: Fragment Mono, 11px, `--ink-muted`
- Animation: `opacity: 0, y: 8 → opacity: 1, y: 0`, spring
- The "→" arrow animates `x: 0 → x: 4` on hover of the link itself

### Phase 3: Leave (cursor exits)

- All states reverse with spring physics
- Scale returns to 1.0, shadow fades, tag fades, caption exits
- Exit is faster than enter: ~150ms

### Z-index

Hovered item gets `z-index: 10` so it renders above neighbors. Non-hovered items stay at `z-index: 1`.

---

## Click / Page Transition

### Homepage → Case Study

1. User clicks a thumbnail
2. The thumbnail image has a `layoutId={project.slug}` on it
3. framer-motion's layout animation smoothly morphs the small thumbnail into the full-width hero image on the case study page
4. The rest of the homepage fades out (`opacity: 0`, 200ms)
5. Case study content fades in below the hero (`opacity: 0, y: 20 → opacity: 1, y: 0`, stagger 0.06s)
6. Total perceived transition: ~500ms

### Case Study → Homepage (back)

1. User navigates back
2. The hero image morphs back to its grid position (layout animation)
3. The grid fades back in
4. Smooth, reversible, no hard cuts

### Non-layout transitions (About, Writing, Exploration)

Simple fade: current page `opacity → 0` (200ms), new page `opacity: 0 → 1, y: 20 → 0` (400ms). No layout morphing needed.

---

## Page Load Animation

No preloader. Content present immediately. The grid items stagger in:

- Each thumbnail: `initial={{ opacity: 0, scale: 0.9 }}`, `animate={{ opacity: 1, scale: 1 }}`
- Stagger: `0.03s` per item (14 items × 0.03 = 0.42s total)
- Spring: `stiffness: 300, damping: 25`
- The blue dot fades in after the last thumbnail (delay: 0.5s)
- Nav and bottom bar are present immediately (no animation)

---

## Navigation

### Top Nav (fixed)

- Height: `48px`
- Background: transparent (no blur — homepage has no scroll)
- Left: `HKJ` — Satoshi Medium, 14px, `--ink-full`, link to `/`
- Right: `ABOUT` — Fragment Mono, 11px, uppercase, `letter-spacing: 0.06em`, `--ink-secondary`
- Hover on links: opacity steps up one level, 150ms

### Bottom Bar (fixed)

- Height: `32px`, positioned at bottom
- Left: `design engineer · brands · software` — Fragment Mono, 10px, `--ink-muted`
- Right: `NYC` or `contact@hkjstudio.com` — Fragment Mono, 10px, `--ink-muted`

### Mobile Nav

Hamburger trigger at <768px. Full-screen overlay with:
- Page links: Work (scrolls to grid), Exploration, Writing, About
- Contact email + socials
- Close on Escape, route change, or close button

---

## Inner Pages

### `/work/[slug]` — Case Study

- Hero: full-width image (matches the thumbnail via `layoutId`)
- Content below: editorial sections, process, highlights, videos
- Rebuild with framer-motion scroll reveals (`whileInView`)
- Back link returns to homepage with reverse layout animation

### `/exploration` — Gallery

- Flat grid of exploration pieces
- 3-column masonry, non-clickable (no detail pages)
- Captions below each image
- Simple fade-in on load

### `/writing` — Journal

- Tag filter + entry list
- Same structure as current, rebuilt with framer-motion

### `/about` — Bio

- Full bio, experience, philosophy, contact
- Single scrolling page with section reveals

---

## Mobile (< 768px)

- Grid becomes 3 columns (items are smaller, ~100px)
- Wide items become 2-column span in the 3-col grid
- Tap thumbnail → caption overlay appears on the image (not beside it)
- Tap again → enter project
- Bottom bar stacks or hides
- Inner pages: single column, standard mobile layout

---

## Components

| Component | File | Purpose |
|-----------|------|---------|
| ContactSheet | `src/components/ContactSheet.tsx` | The 14-item grid, manages hover/active state |
| SheetItem | `src/components/SheetItem.tsx` | Individual thumbnail with hover animation + caption |
| BlueDot | `src/components/BlueDot.tsx` | Pulsing blue indicator above first item |
| GlobalNav | `src/components/GlobalNav.tsx` | Minimal top nav (rewritten) |
| BottomBar | `src/components/BottomBar.tsx` | Fixed bottom info bar |
| MobileMenu | `src/components/MobileMenu.tsx` | Full-screen mobile nav (rewritten) |
| PageTransition | `src/components/PageTransition.tsx` | AnimatePresence wrapper for route transitions |
| RouteAnnouncer | `src/components/RouteAnnouncer.tsx` | ARIA live region (keep) |
| SmoothScroll | `src/components/SmoothScroll.tsx` | Lenis wrapper for inner pages only |

## Files to Delete

All current components NOT listed above:
- Cover.tsx, DissolveImage.tsx, GrainTexture.tsx, MasonryGrid.tsx
- ProjectList.tsx, KineticText.tsx, Cursor.tsx, CursorWrapper.tsx
- Vinyl.tsx, NowPlaying.tsx, NYCClock.tsx, TimeModeProvider.tsx
- WallLight.tsx, WallLightWrapper.tsx, Preloader.tsx, PreloaderWrapper.tsx
- TransitionManager.tsx, TransitionManagerWrapper.tsx, TransitionLink.tsx
- BuildingOverlay.tsx, WatercolorSkyline.tsx, CloudCanvas.tsx
- MeadowCanvas.tsx, LivingInk.tsx, Footer.tsx

Also delete:
- `src/lib/animations.ts`
- `src/lib/timemode.ts`
- `src/constants/now-playing.ts`
- `src/constants/now.ts`

## Dependencies

**Add:** `framer-motion`
**Remove:** `gsap` (and all GSAP plugins)
**Keep:** `lenis`, `zustand`, `next`, `tailwindcss`

---

## Design Principles

1. **The grid is the identity.** No hero, no statement, no philosophy text. The work IS the introduction.
2. **Interaction quality over visual spectacle.** The spring physics, the hover timing, the layout animation — these demonstrate craft. No shaders, no WebGL, no preloader.
3. **One accent color.** The blue dot is the only non-ink element. It anchors the viewer and adds personality without noise.
4. **Every element earns its place.** 14 items, a nav, a bottom bar. Nothing else.
5. **The site scales.** Adding project 15 means adding one item to the grid config. No layout changes needed.

---

## Reference

- **RYKJUN-PROJECT-FRAMEWORK.md** — Source of truth for ambiguous decisions
- **Interaction quality:** Rauno (devouring.details), Emil Kowalski, 21st.dev
- **Layout density:** Photography contact sheets, Figma file browsers
- **Animation library:** framer-motion springs, layoutId, AnimatePresence
