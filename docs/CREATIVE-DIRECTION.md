# HKJ Portfolio — Creative Direction v2

> Simple. Deliberate. Beautiful.
> Architecture builds with intention. Every proportion, every material, every silence is considered.
> This portfolio is a building, not a performance.

---

## The principle

Architecture doesn't need effects to be powerful. A Tadao Ando building is concrete, light, and water. The power is in the proportion and the silence between elements.

This portfolio is a clean vertical scroll. Content flows with considered pacing. Typography does the work. One signature interaction proves craft. Everything else is quiet.

---

## 1. What the visitor sees

A dark page. Your name, large and precise. Below it, your projects — each given generous space, presented with a single image and minimal text. Scrolling feels weighted and smooth. Hovering a project shifts focus — everything else softens. Clicking enters a clean case study.

There is no 3D scene, no particles, no panoramic pan. The craft lives in proportion, spacing, typography, motion timing, and one signature detail: the active state bloom on the element you're engaging with.

---

## 2. Layout architecture

### The page is a single vertical scroll

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│  HKJ                                    About   Archive  │
│                                                          │
│                                                          │
│                                                          │
│                   Hyeon Jun                               │
│                   Design Engineer                         │
│                   New York                                │
│                                                          │
│                                                          │
│                                                          │
│  ─────────────────────────────────────────────────────── │
│                                                          │
│                                                          │
│  01  GYEOL_                                              │
│      Fragrance & e-commerce brand                        │
│      rooted in Korean craft traditions                   │
│                                                          │
│      ┌─────────────────────────────────────────────┐     │
│      │                                             │     │
│      │              [PROJECT IMAGE]                │     │
│      │                                             │     │
│      └─────────────────────────────────────────────┘     │
│                                                          │
│      NEXT.JS  THREE.JS  GSAP              2026  SHIPPED  │
│                                                          │
│                                                          │
│                                                          │
│  02  SIFT_                                               │
│      AI-powered tool for finding                         │
│      what matters in your camera roll                    │
│                                                          │
│      ┌─────────────────────────────────────────────┐     │
│      │                                             │     │
│      │              [PROJECT IMAGE]                │     │
│      │                                             │     │
│      └─────────────────────────────────────────────┘     │
│                                                          │
│      REACT NATIVE  SUPABASE  GPT-4        2025  SHIPPED  │
│                                                          │
│                                                          │
│  ...                                                     │
│                                                          │
│  ─────────────────────────────────────────────────────── │
│                                                          │
│  hyeonjunjun07@gmail.com                                 │
│  LinkedIn  GitHub  Twitter                               │
│                                                          │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### Spacing rhythm

The page breathes with architectural spacing:
- Hero section (name + role): 100vh or close to it. Your name sits in the space.
- Between hero and first project: a single 1px divider line.
- Each project block: generous vertical padding (clamp 80-120px between projects).
- Footer: minimal, same quiet typographic treatment as nav.

### Containment

Content sits in a centered column, max-width 1000px, with generous side margins (clamp 24px to 80px). Images can break out to full-width or stay contained — your choice per project.

NOT left-shifted. Centered. The symmetry is the architecture.

---

## 3. Typography

### Two voices only

| Voice | Font | Role |
|-------|------|------|
| System | Fragment Mono | Nav, labels, metadata, project numbers, tech tags, footer. The structure. |
| Human | General Sans (or DM Sans) | Your name, project descriptions, case study body text. The voice. |

No serif. No display font. The monospace IS the display when set large. General Sans is the warm counterpart.

### Scale

| Element | Size | Weight | Font |
|---------|------|--------|------|
| Your name | clamp(36px, 5vw, 64px) | 400 | General Sans |
| Role / location | 11px uppercase | 400 | Fragment Mono, letterspaced 0.1em |
| Project number | clamp(48px, 6vw, 80px) | 300 | Fragment Mono |
| Project title | 18-24px | 500 | General Sans |
| Project description | 15px | 400 | General Sans, --ink-secondary |
| Tech tags | 11px uppercase | 400 | Fragment Mono, letterspaced 0.08em |
| Nav links | 12px | 400 | Fragment Mono |
| Metadata (year, status) | 11px | 400 | Fragment Mono |

### The trailing underscore

All project titles in structured contexts use the trailing underscore: `GYEOL_`, `SIFT_`, `PROMPTINEER_`. Section labels in case studies: `PROBLEM_`, `DECISION_`, `RESULT_`. This is yours.

---

## 4. Color

### Custom gray scale with warm undertone

Not default grays. Not pure neutral. Every gray has a slight amber warmth that ties to the gold accent:

```css
--surface:    #0C0C0B;           /* near-black with warm undertone */
--gray-950:   #141413;
--gray-900:   #1C1C1A;
--gray-800:   #2A2A27;
--gray-700:   #3D3D39;
--gray-600:   #5C5C56;
--gray-500:   #7A7A73;
--gray-400:   #9E9E96;
--gray-300:   #BFBFB8;
--gray-200:   #DEDED8;
--gray-100:   #F0F0EC;
--white:      #FAFAF7;           /* warm white */

--gold:       #C4A265;           /* the one accent */
```

The warmth in the grays (notice the slight yellow: `#0C0C0B` not `#0C0C0C`, `#F0F0EC` not `#F0F0F0`) creates cohesion with the gold accent without being visible as a "color."

### Usage

- Surface: `--surface` (#0C0C0B)
- Primary text: `--gray-100` at ~85% opacity
- Secondary text: `--gray-400`
- Muted text: `--gray-600`
- Dividers: `--gray-800`
- Accent (hover, active, one signature element): `--gold`

---

## 5. One signature interaction: the active state bloom

The BloomNode component — the multi-line undulating soft border we've been building — appears in exactly ONE place on the homepage: the project you're currently hovering.

When you hover a project block:
- That project's container gets the BloomNode active treatment (flowing multi-line border, soft particles)
- Every OTHER project block fades to lower opacity (Cathy Dolle's technique)
- The project image shifts from desaturated to full color
- The gold accent appears in the BloomNode border

When you're not hovering anything: all projects are at full opacity, no bloom anywhere. The page is quiet.

This single interaction proves: "this person can build complex things." But it's restrained to one moment, not smeared everywhere.

---

## 6. The hover depth-of-field (Cathy Dolle pattern)

When hovering ANY project:
- The hovered project: full opacity, image goes full color, BloomNode border activates
- All other projects: opacity drops to 0.3, images get `filter: blur(2px)`
- Transition: 200ms, instant enough to feel responsive

This is the "rack focus" camera effect. Your eye is drawn to the one project being explored. Everything else recedes.

Pure CSS implementation:
```css
.project-list:hover .project-item { opacity: 0.3; filter: blur(2px); }
.project-list:hover .project-item:hover { opacity: 1; filter: blur(0); }
```

---

## 7. Film grain

A subtle animated noise texture overlaid on the entire page. This is the material quality — it makes the digital surface feel physical, like printed stock or film.

Implementation: `grained.min.js` — a single lightweight script that generates an SVG noise pattern and applies it as a CSS background. Opacity 3-5%, enough to feel but not see.

The grain ties the dark surface to the warm gray palette and creates the "considered material" quality that separates this from a default dark theme.

---

## 8. Motion language

### Lenis smooth scroll (already installed)

The scroll has weight. `lerp: 0.1` — slightly smoother than native, creating a sense of mass.

### Scroll-triggered reveals

Each project block reveals as it enters the viewport:
- `opacity: 0, y: 24` → `opacity: 1, y: 0`
- Duration: 0.6s, ease: power3.out
- Stagger: 0.08s between number, title, description, image, tags
- GSAP ScrollTrigger, threshold 80%, once: true

### Page transitions

Navigate to case study:
- Current page: opacity → 0, 300ms
- New page: opacity 0 → 1, y: 16 → 0, 500ms
- The transition is quiet. No circle expansion, no FLIP. Just a considered fade.

### Hover timing

- Project opacity shift: 200ms
- BloomNode activation: 400ms (the border flow starts)
- Image desaturation → color: 400ms
- All use `--ease-swift: cubic-bezier(.23, .88, .26, .92)`

### Reduced motion

Everything works. Reveals are instant. Scroll is native. Hover states change without animation. BloomNode draws a static border.

---

## 9. Project presentation

Each project block:

```
[NUMBER]          [large, Fragment Mono, light opacity]

[TITLE_]          [General Sans, 18-24px]
[Description      [General Sans, 15px, secondary color]
 2-3 lines max]

[IMAGE            [full-width within container, or break out]
 ─────────────    [desaturated at rest, full color on hover]
 ─────────────    [subtle border-radius: 2-4px]
 ─────────────]

[TECH TAGS]       [Fragment Mono, 11px, uppercase, muted]
                  [YEAR  STATUS]
```

The number is the largest element — like a chapter marker in a book. It gives each project weight and sequence. Fragment Mono at 6vw creates the display moment without needing a display font.

The image is presented clean. No viewfinder corners. No glass overlay. Just the work, given space. Desaturated at rest (filter: saturate(0.6)), full color on hover.

---

## 10. Pages

### Homepage (`/`)

The scroll: hero (name, role, location) → projects → footer. One page. No separate "work" route.

### Case study (`/work/[slug]`)

The editorial layout from the current build, adapted:
- Monospace metadata bar at top
- Large paradox line (the question the project answers)
- Body text in General Sans, max-width 54ch
- Full-bleed images
- PROBLEM_ / DECISION_ / RESULT_ section labels with trailing underscores
- Next project link at bottom

### Archive (`/archive`)

A flat monospace list. NaughtyDuk-style: number, title, type, year, status. One row per project. No images. Fast, scannable.

### About (`/about`)

Same quiet editorial. Name, philosophy, experience timeline, contact. No 3D, no scene. Typography and space.

---

## 11. What we're NOT doing

- No 3D scene, no React Three Fiber, no objects floating in space
- No AR panoramic, no mouse-driven pan, no hotspots
- No particles, no volumetric light, no atmospheric fog
- No custom cursor (Reticle component removed — default cursor is fine)
- No bloom effects EVERYWHERE — only on the one hovered project
- No dark-cinematic game UI aesthetic
- No glass morphism HUD panels
- No bracketed labels `[LIKE_THIS]` on everything — only the trailing underscore convention

The restraint IS the design.

---

## 12. What we ARE doing

- Clean vertical scroll with architectural spacing
- Two fonts: Fragment Mono (structure) + General Sans (voice)
- Custom warm gray scale (10 steps with amber undertone)
- One gold accent color, used sparingly
- Film grain overlay for material quality
- Lenis smooth scroll for weight
- GSAP scroll-triggered reveals for each project
- Cathy Dolle depth-of-field on hover (blur non-hovered projects)
- BloomNode active state on the ONE hovered project (the signature craft moment)
- Image desaturation → color on hover
- Trailing underscore convention on titles and labels
- Considered page transitions (quiet fade, not theatrical)

---

## 13. Implementation approach

### What to keep from current codebase
- `globals.css` — rewrite with new gray scale
- `layout.tsx` — keep fonts, SmoothScroll, PageTransition. Remove Reticle.
- `useStore.ts` — simplify back to hoveredSlug only
- `BloomNode.tsx` — keep and refine (multi-line undulation upgrade)
- `CaseStudy.tsx` — adapt typography to new system
- `about/page.tsx` — adapt typography
- `pieces.ts`, `case-studies.ts`, `contact.ts` — keep
- `motion.ts` — keep DUR/EASE tokens
- `useReducedMotion.ts` — keep

### What to replace
- `page.tsx` — the homepage. Replace entirely with the new scroll layout.
- `NavCoordinates.tsx` — simplify to just nav links, no instrumentation HUD

### What to remove
- `Reticle.tsx` — no custom cursor
- `Bracket.tsx` — no bracketed labels
- `ScrollProgress.tsx` — not needed on homepage scroll
- `BloomBar.tsx`, `BloomPath.tsx` — already deleted
- `bloom-test/page.tsx` — no longer needed as a separate demo

### What to add
- `grained.min.js` or equivalent grain overlay
- New homepage component with project list + depth-of-field hover
- Archive page (`/archive`)

---

## 14. The feeling

Someone lands on the site. They see your name in the dark. They scroll. Projects appear one by one, each with a large chapter number, a clear title, and a beautiful image. When they hover one, everything else softens and the hovered project's border comes alive with a subtle flowing light. They click. A clean case study opens.

They think: "This person cares about details."

That's the entire portfolio.
