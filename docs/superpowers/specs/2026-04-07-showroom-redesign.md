# The Showroom — Minimalist Editorial + 3D Product Showcase

**Date:** 2026-04-07
**Status:** Draft
**Replaces:** The Theater poster-composition iteration

---

## 1. Design Intent

A minimalist editorial portfolio that feels like a luxury product showroom. The 3D rendered object is the hero — everything else is precise annotation. The UI barely exists. You're inspecting a product in space, with a small placard of information beside it.

**Reference pattern:** Bang & Olufsen product pages + Wuthering Waves character inspection + Rimowa Unique configurator + Leica product photography pages.

**Core rule:** The 3D object dominates. Text annotates. Hierarchy is through opacity, not size.

---

## 2. Design Principles

1. **Object dominance** — 3D render occupies 55-65% of viewport. It IS the content.
2. **Hierarchy through opacity** — Primary text at 88%, secondary at 50%, tertiary at 20%. Size stays within a tight 10-26px range.
3. **Microtypographic precision** — Every text element has exact font-size, weight, letter-spacing, line-height. No defaults.
4. **Structured negative space** — Dark void is active. Spacing is measured. Margins generous and consistent.
5. **Studio lighting as atmosphere** — No particles, no gradients, no glows. The 3D object's 3-point lighting creates all visual warmth.

---

## 3. Typography System

| Token | Font | Size | Weight | Tracking | Line-height | Usage |
|-------|------|------|--------|----------|-------------|-------|
| `mark` | Gambetta | 20px | 500 | -0.01em | 1 | "HKJ" site mark only |
| `heading` | Gambetta | 26px | 500 | -0.02em | 1.2 | Project title, about lead |
| `subheading` | Gambetta | 18px | 400 | -0.01em | 1.3 | Case study section titles |
| `body` | Switzer | 13px | 400 | -0.005em | 1.7 | Descriptions, paragraphs |
| `body-sm` | Switzer | 11px | 400 | 0 | 1.6 | Secondary text |
| `label` | Fragment Mono | 10px | 400 | 0.08em | 1 | Tabs, section headers (UPPERCASE) |
| `meta` | Fragment Mono | 9px | 400 | 0.06em | 1.8 | Metadata keys/values (UPPERCASE) |
| `micro` | Fragment Mono | 8px | 400 | 0.06em | 1 | Tags, cursor Hz, socials (UPPERCASE) |

No other sizes. No other weights. No other trackings. These are the only eight type styles in the entire site.

Fonts:
- **Gambetta** (Fontshare, local variable woff2, weight 300-700) — modern transitional serif with wedge serifs
- **Switzer** (Fontshare, local variable woff2, weight 100-900) — neo-grotesque with squared counters
- **Fragment Mono** (local woff2, weight 400) — monospaced, slab-adjacent

---

## 4. Color System

```
--bg:     #0a0a0b                           near-black, faintly warm
--fg:     rgba(240, 238, 232, 0.88)         primary text
--fg-2:   rgba(240, 238, 232, 0.50)         secondary text
--fg-3:   rgba(240, 238, 232, 0.20)         tertiary / labels
--fg-4:   rgba(240, 238, 232, 0.08)         borders, dividers
```

No accent colors. Pure monochrome. The 3D object's cover art texture provides all color in the experience.

---

## 5. Spacing System (8px base)

| Token | Value | Usage |
|-------|-------|-------|
| `xs` | 4px | Inline gaps |
| `sm` | 8px | Label-to-value gap |
| `md` | 16px | Between text blocks |
| `lg` | 24px | Section separators (with divider) |
| `xl` | 32px | Major section breaks |
| `2xl` | 48px | Between zones |

---

## 6. Layout — The Viewport Grid

```
Viewport: 100vw × 100dvh, overflow: hidden
Grid: 12 columns, 16px gaps
Margin: clamp(32px, 6vw, 80px) left and right
```

### Zone allocation

- **TopBar:** full width, height 52px, bottom border 1px `--fg-4`
- **Text column:** grid columns 1-4 (~30% width), max-width 320px, vertically centered
- **3D canvas:** grid columns 5-12 (~65% width), fills zone edge to edge
- **BottomBar:** full width, height 40px, top border 1px `--fg-4`
- **Gap:** no hard boundary. Canvas renders behind text column. Object positioned so it appears to the right of text.

### TopBar

- Left: "HKJ" in `mark` style. In detail view: "← BACK" in `label` style.
- Right: tab strip (INDEX / ARCHIVE / ABOUT) in `label` style. Active: `--fg`, inactive: `--fg-3`. Sliding 1px underline via `layoutId`. In detail view: project title in `meta` style.
- Bottom border: 1px `--fg-4`.

### BottomBar

- Left: contextual info in `meta` style (year for index, count for archive, "New York" for about)
- Right: "v1.0" in `meta` style
- Top border: 1px `--fg-4`

---

## 7. Screens

### 7.1 Index (default)

**Text column:**

```
PROJECTS                               ← label, --fg-3, mb 24px

01    Gyeol                            ← selected: body 13px, --fg, weight 500
02    Sift                             ← unselected: body 13px, --fg-3, weight 400
03    Promptineer                      ← unselected: body 13px, --fg-3, weight 400

────── divider 1px --fg-4              ← mt 24px, mb 24px

N          01                          ← meta grid: keys --fg-3, values --fg-2
TITLE      GYEOL                         grid-template-columns: 64px 1fr
YEAR       2026                          gap: 8px 16px
TYPE       BRAND / ECOMMERCE / 3D
STATUS     SHIPPED

                                       ← mt 16px
Conceptual fragrance and               ← body 13px, --fg-2, max-width 280px
e-commerce brand rooted in
Korean craft traditions.

                                       ← mt 24px
VIEW PROJECT →                         ← label, --fg
```

Selector: clicking a row updates metadata + 3D texture. Transition: text crossfades (200ms), texture crossfades on object (300ms).

**3D canvas:** CD case with selected project's cover art. Studio-lit. Slow rotation. Interactive drag across full canvas.

### 7.2 Archive

Identical structure to Index. Label: "ARCHIVE". Filters for experiments. Same metadata grid, same description, same "VIEW DETAILS →" CTA.

When switching from Index → Archive tab: text column content crossfades via `AnimatePresence`. 3D object swaps texture to first experiment.

### 7.3 About

**Text column:**

```
PROFILE                                ← label, --fg-3, mb 16px

Design engineer building               ← heading, Gambetta 26px, --fg
at the intersection of
craft and systems thinking.

                                       ← mt 16px
I care about type, motion,             ← body 13px, --fg-2, max-width 280px
and the invisible details that
make digital products feel
considered.

────── divider                         ← mt 24px, mb 24px

LOCATION     NEW YORK                  ← meta grid
FOCUS        DESIGN ENGINEERING
EXPERIENCE   3+ YEARS
STATUS       AVAILABLE

────── divider                         ← mt 24px, mb 24px

2024 —     Freelance Design Engineer   ← meta dates, body-sm roles
2023 — 24  Design Technologist
2021 — 23  Frontend Developer

────── divider                         ← mt 24px, mb 24px

hyeonjunjun07@gmail.com                ← body-sm 11px, --fg-2
LINKEDIN  GITHUB  TWITTER              ← micro 8px, --fg-3
```

**3D canvas:** Object scales to 0.7x and shifts right. No texture — shows matte dark surface. Or stays with last-selected project texture at reduced lighting.

### 7.4 Detail View (single viewport, panel tabs)

Triggered by "VIEW PROJECT →".

**Transition (300ms):**
1. TopBar: "HKJ" crossfades to "← BACK". Tabs crossfade to project title.
2. Text column: selector + metadata crossfades to detail content.
3. 3D object: stays in place, no movement.

**Text column in detail state:**

```
01 — PROJECT                           ← meta, --fg-3, mb 16px

Gyeol                                  ← heading, Gambetta 26px, --fg

────── divider                         ← mt 16px, mb 16px

OVERVIEW   PROCESS   ENGINEERING       ← panel tabs in label style
                                         active: --fg, inactive: --fg-3
                                         sliding underline via layoutId

────── divider                         ← mt 16px, mb 16px

[Panel content — scrollable within text column if needed]

OVERVIEW:
  Conceptual fragrance and             ← body 13px, --fg-2
  e-commerce brand rooted in
  Korean craft traditions.

  ────── divider

  BRAND / ECOMMERCE / 3D              ← micro tags with borders
  2026 — SHIPPED                       ← meta

PROCESS:
  Material Research                    ← subheading, Gambetta 18px

  We started by cataloging             ← body 13px, --fg-2
  200+ physical textures...

ENGINEERING:
  Engineering                          ← subheading, Gambetta 18px

  The rendering pipeline uses          ← body 13px, --fg-2
  a custom PBR shader stack...

  WEBGL 2.0   PBR SHADING             ← micro tags with borders
  DISPLACEMENT MAPS
```

Panel content area scrolls within the text column bounds if content exceeds viewport height. Everything else (TopBar, BottomBar, 3D canvas) stays fixed.

**Back:** "← BACK" reverses the transition. Detail crossfades out, selector crossfades in.

---

## 8. 3D Scene

### Object — CD Case v1

- Geometry: `BoxGeometry(2, 2, 0.12)` — square, thin, sharp edges
- Front face: project texture or `cover.bg` solid. `MeshStandardMaterial`, roughness 0.85, metalness 0.05.
- Other faces: `#0d0d0d`, roughness 0.95, metalness 0.

### Lighting — 3-point studio

| Light | Type | Position | Intensity | Color |
|-------|------|----------|-----------|-------|
| Key | Directional | [3, 4, 5] | 0.8 | #f0eee8 |
| Fill | Directional | [-3, 0, 3] | 0.25 | #e0ddd5 |
| Rim | Directional | [0, -2, -4] | 0.15 | #ffffff |
| Ambient | Ambient | — | 0.1 | — |

### Contact shadow

- `ContactShadows` from drei: opacity 0.3, blur 2, far 4
- Positioned below object on invisible ground plane
- Grounds the object — gives it presence

### Behavior

- Idle rotation: Y axis, 0.08 rad/s
- Cursor tilt: max 6 degrees (0.1 rad), lerp factor 0.04. Heavy, weighty feel.
- Drag: full-canvas drag via invisible plane. Velocity decay 0.93.
- Hover scale: 1.03x on mesh hover.
- Camera: position `[0, 0, 5]`, FOV 40. Telephoto, flat, photographic.

### Texture transitions

- Fade out current material opacity (200ms)
- Swap texture
- Fade in new material opacity (200ms)

### Canvas config

```tsx
<Canvas
  camera={{ position: [0, 0, 5], fov: 40 }}
  gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
  dpr={[1, 2]}
  frameloop="always"
/>
```

---

## 9. Cursor

- Dot: 5px, `--fg` at 0.4 opacity. Scales to 8px with velocity.
- Hz text: Fragment Mono 8px, `--fg` at 0.15 opacity. 12px right of dot.
- Over interactive elements: Hz → contextual label ("View", "Back", "Select")
- Idle (2s): dot 0.1, text 0.05
- Spring: stiffness 500, damping 35, mass 0.3
- Touch: hidden

---

## 10. Preloader

- Black screen, centered content
- Counter: Fragment Mono 11px, tracking 0.2em. Odometer digit roll 000→100, ease-out curve, 2.2s.
- Detail: "40.7128° N" in micro style, `--fg-3`
- Progress: 64px × 1px line, `--fg-4` track, `--fg-3` fill
- Hold at 100: 400ms
- Exit: clip-path wipe upward, 500ms
- Calls `setPreloaderDone()` after exit

---

## 11. Technical Architecture

### State (Zustand)

```ts
{
  preloaderDone: boolean
  activeTab: "index" | "archive" | "about"
  selectedSlug: string
  isDetailExpanded: boolean
  activeDetailPanel: "overview" | "process" | "engineering"
}
```

### Routing

Single-page UX. URL updates via `window.history.pushState`. Routes for SEO:
- `/` — Index tab
- `/archive` — Archive tab
- `/about` — About tab
- `/index/[slug]` — Detail expanded for project
- `/archive/[slug]` — Detail expanded for experiment

### What changes from current build

**Keep:**
- `src/store/useTheaterStore.ts` — add `activeDetailPanel` field
- `src/components/Preloader.tsx` — minor refinements (64px line, 5→dot size)
- `src/components/Cursor.tsx` — minor refinements (5px dot, 0.4 opacity)
- `src/hooks/useCursorState.ts` — unchanged
- `src/hooks/useURLSync.ts` — unchanged
- `src/components/TopBar.tsx` — restyle to spec
- `src/components/BottomBar.tsx` — restyle to spec
- `src/components/CDCase.tsx` — update geometry (0.12 thickness), camera, lighting
- `src/components/Scene3D.tsx` — update lighting, add ContactShadows, camera changes
- `src/constants/pieces.ts`, `src/constants/case-studies.ts`, `src/constants/contact.ts` — unchanged
- `src/app/globals.css` — strip particles CSS, keep resets and tokens
- `src/app/layout.tsx` — remove ParticleCanvas import

**Rebuild:**
- `src/components/views/IndexView.tsx` — complete rewrite to text-column layout
- `src/components/views/ArchiveView.tsx` — complete rewrite matching Index
- `src/components/views/AboutView.tsx` — complete rewrite to structured bio
- `src/components/views/DetailView.tsx` — complete rewrite with panel tabs
- `src/components/TheaterStage.tsx` — update layout to 30/65 split, remove full-viewport logic

**Remove:**
- `src/components/ParticleCanvas.tsx` — no particles in this design. Studio lighting is the atmosphere.

### Dependencies

All already installed:
- `framer-motion` — `AnimatePresence`, `layoutId`, `useSpring`
- `@react-three/fiber` + `@react-three/drei` — Canvas, useTexture, ContactShadows
- `zustand` — state management
- `three` — geometry, materials

---

## 12. Responsive (>768px only for v1)

Mobile is deferred. The single-viewport 3D experience requires desktop. On mobile (<768px), show a simplified version:
- Hide 3D canvas
- Full-width text column
- Static project images instead of 3D object
- Tab strip moves to bottom

---

## 13. Accessibility

- `prefers-reduced-motion`: instant transitions, no 3D rotation, no cursor animation
- Skip-to-content link
- Route announcer for URL changes
- Keyboard: Tab through selector, Enter to select/expand, Arrow keys for panel tabs
- Focus-visible outlines on all interactive elements
- 3D canvas `aria-hidden="true"`
- All text meets WCAG AA on `--bg`
