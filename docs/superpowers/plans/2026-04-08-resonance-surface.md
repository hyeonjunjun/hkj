# Resonance Surface Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the HKJ portfolio from a generic editorial template into a neo-brutalist resonance surface — cold mineral ground, monospace architecture, a single living waveform, and editorial restraint.

**Architecture:** Single-page scroll homepage with left-shifted content column, fixed canvas waveform at 60vh, ghost Fragment Mono letterforms as spatial architecture. Three routes: `/` (homepage), `/work/[slug]` (modular case study), `/about` (quiet page). Persistent waveform + nav across all pages via layout. Page transitions via Framer Motion AnimatePresence.

**Tech Stack:** Next.js 16 App Router, TypeScript, Tailwind CSS v4, GSAP + ScrollTrigger, Framer Motion, Canvas API, Lenis, Zustand

**Spec:** `docs/superpowers/specs/2026-04-08-resonance-surface-design.md`

---

## Chunk 1: Foundation — Surface, Typography, Data Model

### Task 1: CSS Foundation

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Rewrite globals.css with mineral surface and ink system**

```css
@import "tailwindcss";

:root {
  --surface: #f0f0ed;
  --ink-full: rgba(35, 32, 28, 1.00);
  --ink-primary: rgba(35, 32, 28, 0.82);
  --ink-secondary: rgba(35, 32, 28, 0.52);
  --ink-muted: rgba(35, 32, 28, 0.35);
  --ink-faint: rgba(35, 32, 28, 0.20);
  --ink-ghost: rgba(35, 32, 28, 0.10);
  --ink-whisper: rgba(35, 32, 28, 0.05);
  --font-body: var(--font-sans), "Helvetica Neue", system-ui, sans-serif;
  --font-mono: var(--font-fragment), "SF Mono", "Consolas", monospace;
  --font-display: var(--font-serif), "Georgia", serif;
  --ease-swift: cubic-bezier(.23, .88, .26, .92);
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { -webkit-text-size-adjust: 100%; }
*::-webkit-scrollbar { display: none; }
* { scrollbar-width: none; }

body {
  background: var(--surface);
  color: var(--ink-primary);
  font-family: var(--font-body);
  font-size: 15px;
  font-weight: 400;
  line-height: 1.7;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-x: hidden;
  letter-spacing: -0.01em;
}

::selection { background: var(--ink-ghost); }
:focus-visible { outline: 1px solid var(--ink-muted); outline-offset: 3px; }
a { color: inherit; text-decoration: none; }

.skip-to-content {
  position: absolute; top: -100px; left: 24px;
  z-index: 999; padding: 8px 16px;
  background: var(--ink-full); color: var(--surface);
  font: 500 11px/1 var(--font-mono);
  letter-spacing: 0.06em; text-decoration: none;
  transition: top 0.3s var(--ease-swift);
}
.skip-to-content:focus { top: 8px; }

/* Chrome text gradient for project numbers */
.chrome-text {
  background: linear-gradient(
    135deg,
    var(--ink-muted) 0%,
    var(--ink-ghost) 30%,
    var(--ink-secondary) 50%,
    var(--ink-ghost) 70%,
    var(--ink-muted) 100%
  );
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Image treatment: desaturated, slightly contrasty */
.image-treatment {
  filter: saturate(0.7) contrast(1.05);
}

@media (hover: none) {
  /* Mobile: no blur in animations, use opacity+scale instead */
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    animation-delay: 0ms !important;
  }
}
```

- [ ] **Step 2: Verify build passes**

Run: `npm run build`
Expected: Compiled successfully

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "feat: mineral surface + ink system + chrome text"
```

---

### Task 2: Tailwind Config

**Files:**
- Modify: `tailwind.config.ts`

- [ ] **Step 1: Update tailwind config with ink/surface palette**

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: "var(--surface)",
        "ink-full": "var(--ink-full)",
        "ink-primary": "var(--ink-primary)",
        "ink-secondary": "var(--ink-secondary)",
        "ink-muted": "var(--ink-muted)",
        "ink-faint": "var(--ink-faint)",
        "ink-ghost": "var(--ink-ghost)",
        "ink-whisper": "var(--ink-whisper)",
      },
      fontFamily: {
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
        display: ["var(--font-display)"],
      },
      transitionTimingFunction: {
        swift: "var(--ease-swift)",
      },
      screens: {
        mobile: { max: "768px" },
        tablet: { min: "769px", max: "1024px" },
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 2: Commit**

```bash
git add tailwind.config.ts
git commit -m "feat: tailwind ink/surface palette + tablet breakpoint"
```

---

### Task 3: Data Model Update

**Files:**
- Modify: `src/constants/pieces.ts`
- Modify: `src/store/useStore.ts`

- [ ] **Step 1: Extend Piece interface with resonance fields**

```typescript
export type PieceType = "project" | "experiment";
export type WaveMode = "sine" | "noise";

export interface Piece {
  slug: string;
  title: string;
  type: PieceType;
  order: number;
  number: string;
  sector: string;
  description: string;
  accent: string;
  frequency: number;
  amplitude: number;
  waveMode: WaveMode;
  status: "shipped" | "wip";
  year: number;
  image?: string;
  coverArt?: string;
  video?: string;
  tags: string[];
}

export const PIECES: Piece[] = [
  {
    slug: "gyeol",
    title: "Gyeol: \uACB0",
    type: "project",
    order: 1,
    number: "01",
    sector: "Material Science",
    description: "Conceptual fragrance and e-commerce brand rooted in Korean craft traditions.",
    accent: "#8B7355",
    frequency: 0.004,
    amplitude: 6,
    waveMode: "sine",
    status: "shipped",
    year: 2026,
    image: "/images/gyeol-display-hanji.webp",
    coverArt: "/images/gyeol-spring.webp",
    video: "/assets/gyeol-broll-combined.mp4",
    tags: ["brand", "ecommerce", "3d"],
  },
  {
    slug: "sift",
    title: "Sift",
    type: "project",
    order: 2,
    number: "02",
    sector: "Mobile / AI",
    description: "AI-powered tool for finding what matters in your camera roll.",
    accent: "#CF957B",
    frequency: 0.006,
    amplitude: 3,
    waveMode: "sine",
    status: "shipped",
    year: 2025,
    image: "/images/sift-v2.webp",
    tags: ["mobile", "ai", "product"],
  },
  {
    slug: "promptineer",
    title: "Promptineer",
    type: "project",
    order: 3,
    number: "03",
    sector: "Design Systems",
    description: "A design system that orchestrates consistency across product surfaces.",
    accent: "",
    frequency: 0,
    amplitude: 4,
    waveMode: "noise",
    status: "wip",
    year: 2026,
    tags: ["design-system", "ui"],
  },
  {
    slug: "clouds-at-sea",
    title: "Clouds at Sea",
    type: "experiment",
    order: 4,
    number: "04",
    sector: "WebGL / Generative",
    description: "Somewhere between water and sky, the horizon dissolves.",
    accent: "#8BA4B8",
    frequency: 0.002,
    amplitude: 10,
    waveMode: "sine",
    status: "shipped",
    year: 2026,
    video: "/assets/cloudsatsea.mp4",
    tags: ["webgl", "generative"],
  },
];
```

- [ ] **Step 2: Update store with activeProjectZone**

```typescript
import { create } from "zustand";

interface StoreState {
  hoveredSlug: string | null;
  setHoveredSlug: (slug: string | null) => void;
  activeZoneSlug: string | null;
  setActiveZoneSlug: (slug: string | null) => void;
}

export const useStore = create<StoreState>((set) => ({
  hoveredSlug: null,
  setHoveredSlug: (slug) => set({ hoveredSlug: slug }),
  activeZoneSlug: null,
  setActiveZoneSlug: (slug) => set({ activeZoneSlug: slug }),
}));
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: Compiled successfully

- [ ] **Step 4: Commit**

```bash
git add src/constants/pieces.ts src/store/useStore.ts
git commit -m "feat: resonance data model — accent, frequency, amplitude, waveMode"
```

---

## Chunk 2: Persistent Elements — Waveform, Nav, Layout

### Task 4: Waveform Canvas

**Files:**
- Create: `src/components/Waveform.tsx`

This is the heart of the site. A fixed `<canvas>` element rendering a single sine wave that responds to cursor proximity and scroll position.

- [ ] **Step 1: Create Waveform component**

The component must:
- Render a full-width canvas at `position: fixed`, `top: 60vh`, `z-index: 1`, `pointer-events: none`
- Draw a single anti-aliased sine wave line (1px stroke)
- At rest: 8px amplitude, 0.003 frequency, `--ink-ghost` color, 0.3Hz oscillation
- Lerp all values toward targets (never snap): `lerp(current, target, 0.04)`
- Cursor interaction: when mouse is within 200px of waveform y-position, add gaussian amplitude bump (+20px at center, 150px width) centered on cursor x
- Accept `targetColor`, `targetFrequency`, `targetAmplitude`, `waveMode` as props or from store
- For `waveMode: "noise"`: randomize frequency per frame within ±50% range
- Respect `prefers-reduced-motion`: draw static horizontal line, no animation
- Use `requestAnimationFrame` loop, budget <4ms per frame
- Canvas height: 120px (centered on the line at 60px)
- Anti-alias: use half-pixel offset on lineWidth

Key implementation details:
- Color lerping: parse hex to RGB, lerp each channel, reconstruct
- Sine wave function: `y = amplitude * Math.sin(x * frequency + phase)`
- Gaussian bump: `extra = cursorAmplitude * Math.exp(-0.5 * ((x - cursorX) / 75)^2)`
- Phase advances by `speed` (0.0008) per frame

- [ ] **Step 2: Verify it renders in isolation**

Temporarily import into `layout.tsx` and check that the waveform draws on the page.

- [ ] **Step 3: Commit**

```bash
git add src/components/Waveform.tsx
git commit -m "feat: waveform canvas — sine wave with cursor pluck interaction"
```

---

### Task 5: Nav Coordinates

**Files:**
- Rewrite: `src/components/Nav.tsx` → `src/components/NavCoordinates.tsx`

- [ ] **Step 1: Create NavCoordinates — floating text, no container**

The component must:
- Fixed position, top-right: `padding: 20px clamp(24px, 5vw, 64px)`
- Render: `WORK   ABOUT   10:47 PM EST` — Fragment Mono, 11px, uppercase, `--ink-muted`
- No container, no background, no border — floating text in space
- On case study pages (`/work/*`): show project title left of nav links in `--ink-ghost`
- Active link: `--ink-primary` (Work active on `/` and `/work/*`, About active on `/about`)
- Clock: NycClock component (keep existing), hidden on mobile
- GSAP entrance: `opacity:0, y:10, blur:2px` → clear, 500ms, 60ms stagger
- z-index: 50

- [ ] **Step 2: Delete old Nav.tsx**

```bash
rm src/components/Nav.tsx
```

- [ ] **Step 3: Commit**

```bash
git add src/components/NavCoordinates.tsx
git commit -m "feat: nav coordinates — floating text, no container"
```

---

### Task 6: Layout with Persistent Elements

**Files:**
- Modify: `src/app/layout.tsx`
- Create: `src/components/PageTransition.tsx`

- [ ] **Step 1: Create PageTransition wrapper**

AnimatePresence wrapper using `mode="wait"`. Wraps page children with exit/enter animations:
- Exit: `opacity: 0`, 300ms
- Enter: `opacity: 0, y: 32, filter: blur(3px)` → clear, 500ms (desktop) or `opacity: 0, y: 16, scale: 0.98` → clear (mobile — no blur)
- Use `usePathname()` as key for AnimatePresence

- [ ] **Step 2: Update layout.tsx**

The layout must:
- Load fonts: General Sans (local, `--font-sans`), Newsreader (Google, `--font-serif`), Fragment Mono (local, `--font-fragment`)
- Render persistent elements OUTSIDE `<main>`: `<Waveform />` and `<NavCoordinates />`
- Render `<RouteAnnouncer />` (keep for a11y)
- Wrap `{children}` in `<PageTransition>`
- Skip-to-content link

- [ ] **Step 3: Verify build and check all three routes render**

Run: `npm run build`
Expected: All routes compile: `/`, `/about`, `/work/[slug]`

- [ ] **Step 4: Commit**

```bash
git add src/app/layout.tsx src/components/PageTransition.tsx
git commit -m "feat: layout with persistent waveform + nav, page transitions"
```

---

## Chunk 3: Homepage — The Opening Measure + Work Sequence

### Task 7: Ghost Letters

**Files:**
- Create: `src/components/GhostLetters.tsx`

- [ ] **Step 1: Create GhostLetters component**

The component must:
- Render "HKJ" in Fragment Mono at `clamp(240px, 40vw, 480px)`
- Positioned in the lower-left quadrant of the first viewport
- H's left stroke cropped by viewport edge by ~15% (negative left margin or `left: -5vw`)
- Color: `--ink-ghost` (0.10)
- GSAP parallax: on scroll, translateY at 0.3x scroll speed, opacity fades from 0.10 to 0.03
- Entrance: fade from 0 to 0.10 over 600ms (part of homepage choreography)
- `letter-spacing: 0.02em`
- `position: absolute` within the first viewport section, NOT fixed
- Hidden on mobile (simplified to `50vw` if kept, or omit)

- [ ] **Step 2: Commit**

```bash
git add src/components/GhostLetters.tsx
git commit -m "feat: ghost HKJ letterforms — spatial architecture"
```

---

### Task 8: Work Sequence

**Files:**
- Rewrite: `src/components/WorkIndex.tsx` → `src/components/WorkSequence.tsx`
- Create: `src/components/MarginImage.tsx`

- [ ] **Step 1: Create MarginImage component**

The component must:
- `position: fixed`, right-aligned to viewport edge with 24px right padding
- Vertical: centered in viewport (`top: 50%, transform: translateY(-50%)`)
- Width: 280px desktop, 200px tablet, hidden mobile
- Framer Motion AnimatePresence: enter `opacity: 0` → `opacity: 0.85` (500ms), exit → `opacity: 0` (300ms)
- Image has `.image-treatment` class (desaturation + contrast)
- Grain overlay via `::after` pseudo-element with SVG feTurbulence at 0.03 opacity
- z-index: 5
- `pointer-events: none`

- [ ] **Step 2: Create WorkSequence component**

The component must:
- Content column: `max-width: 900px`, `margin-left: 8vw` (left-shifted, not centered)
- Structural line: 1px vertical line at column left edge, `--ink-whisper`, full content height
- No section header — work begins as continuation of first viewport
- Each project row: ghost number (clamp 120-200px, `--ink-whisper`, positioned behind title) + number (11px, chrome gradient) + sector/year (11px, `--ink-muted`, right-aligned) on same baseline + title (Fragment Mono, clamp 28-40px) below + description (General Sans, 15px, `--ink-secondary`, max 42ch) below + 1px rule `--ink-ghost`
- Uniform spacing: `clamp(48px, 8vh, 72px)` between projects
- **Hover behavior:**
  - On hover: all OTHER projects → `--ink-whisper` (0.05), instant, no transition
  - Hovered project stays `--ink-primary`
  - MarginImage appears for hovered project (if it has an image)
  - Update store: `setHoveredSlug(slug)` for waveform color linking
- On hover-out: all return to `--ink-primary`, MarginImage fades, `setHoveredSlug(null)`
- **Scroll-linked waveform zones:** Use IntersectionObserver or scroll listener to detect which project is at viewport center, call `setActiveZoneSlug(slug)`
- GSAP entrance: rows reveal with `opacity:0, y:40, blur:4px` → clear, 600ms, 100ms stagger, triggered on scroll
- Mobile: no ghost numbers, no margin images, project images inline below description at 100% width, full-width column with 24px padding
- Chrome number gradient: `background-position` linked to scroll Y via GSAP

- [ ] **Step 3: Delete old WorkIndex.tsx and HoverImage.tsx (if exists)**

```bash
rm src/components/WorkIndex.tsx src/components/HoverImage.tsx 2>/dev/null
```

- [ ] **Step 4: Verify build**

Run: `npm run build`

- [ ] **Step 5: Commit**

```bash
git add src/components/WorkSequence.tsx src/components/MarginImage.tsx
git commit -m "feat: work sequence — left-shifted column, inverted dimming, margin images"
```

---

### Task 9: Homepage Composition

**Files:**
- Rewrite: `src/app/page.tsx`
- Modify: `src/components/HeroSection.tsx` → incorporate into page or rewrite
- Modify: `src/components/Footer.tsx`

- [ ] **Step 1: Rewrite homepage**

The page composition:
1. First viewport section (100vh, relative positioned):
   - `<GhostLetters />` — absolute positioned, lower-left
   - Colophon — absolute positioned, bottom-right: `DESIGN ENGINEERING · NEW YORK · 2026`, Fragment Mono 11px, `--ink-ghost`
   - (Waveform and NavCoordinates are in layout, always visible)
2. Work sequence section:
   - `<WorkSequence />`
3. Footer section:
   - `clamp(100px, 15vh, 180px)` empty space before
   - Email + social links: Fragment Mono 11px, single line
   - Copyright: Fragment Mono 11px, `--ink-ghost`
   - 72px empty space after

Entrance choreography (first visit only, sessionStorage flag):
1. Waveform draws left-to-right (800ms) — triggered from layout/waveform component
2. Nav coordinates blur-reveal (500ms, 60ms stagger)
3. Ghost letters fade 0 → 0.10 (600ms)
4. Colophon reveals (400ms)
5. Work sequence: scroll-triggered

- [ ] **Step 2: Delete old HeroSection.tsx**

The philosophy statement from HeroSection is removed from the homepage. It only appears on the About page now.

```bash
rm src/components/HeroSection.tsx
```

- [ ] **Step 3: Rewrite Footer.tsx**

Minimal footer — not a component block, just a few lines of mono text:
```
hyeonjunjun07@gmail.com         LINKEDIN  GITHUB  TWITTER
© 2026 HKJ Studio
```

- [ ] **Step 4: Verify build and dev server**

Run: `npm run build && npm run dev`

- [ ] **Step 5: Commit**

```bash
git add src/app/page.tsx src/components/Footer.tsx
git commit -m "feat: homepage composition — opening measure + work sequence + footer"
```

---

## Chunk 4: Case Study Page

### Task 10: Modular Case Study

**Files:**
- Rewrite: `src/components/CaseStudy.tsx`
- Modify: `src/app/work/[slug]/page.tsx`

- [ ] **Step 1: Rewrite CaseStudy with modular block system**

Same left-shifted column (max-width 900px, margin-left 8vw).

Fixed structure:
1. Metadata bar (96px top padding): `01 / GYEOL: 결 / 2026 / MATERIAL SCIENCE` — Fragment Mono 11px, `--ink-muted`, chrome gradient on number
2. 72px silence
3. Paradox line — Newsreader italic, `clamp(20px, 2.5vw, 28px)`, `--ink-primary` (the warm breath)
4. 48px gap
5. Stakes paragraph — General Sans 15px, `--ink-secondary`, max 54ch

Then modular blocks rendered from case study data. Each block type:
- **TextBlock:** label (Fragment Mono 11px uppercase `--ink-muted`) + body (General Sans 15px `--ink-secondary` max 54ch) + 64px bottom gap
- **StepsBlock:** numbered steps (Fragment Mono numbers + title + copy) + 64px gap
- **HighlightsBlock:** title + description + challenge (Newsreader italic `--ink-muted`) + 64px gap
- **SignalsBlock:** copy + tag pills (1px `--ink-ghost` border) + 64px gap
- **StatsBlock:** large mono numbers ~24px + tiny 11px labels + 64px gap
- **MediaBlock:** image/video bleeds to right viewport edge, `.image-treatment`, grain overlay, scroll-triggered opacity reveal + 64px gap

Hero image after stakes: full-bleed right (extends from column left edge to viewport right edge). `.image-treatment` + grain overlay. GSAP scroll-triggered blur-reveal (desktop) or opacity-reveal (mobile).

Next project link at bottom: rule + NEXT label + title + sector/year, same structure as homepage row.

All sections: GSAP ScrollTrigger reveals, threshold 85%, once: true, `opacity:0, y:32, blur:3px` → clear (desktop) or `opacity:0, y:16, scale:0.98` (mobile).

- [ ] **Step 2: Update work/[slug]/page.tsx**

Simplified: find piece by slug, render `<CaseStudy piece={piece} />`. No nav/footer (they're in layout).

Wait — nav is in layout but footer is NOT (footer is page-specific content). So the work page needs its own footer or the footer is part of CaseStudy's next-project section.

Decision: Footer (email/socials) only appears on homepage. Case study pages end with the "next project" link. About page has its own contact section.

- [ ] **Step 3: Verify with `/work/gyeol` and `/work/sift`**

Run: `npm run dev`, navigate to both case study URLs.

- [ ] **Step 4: Commit**

```bash
git add src/components/CaseStudy.tsx src/app/work/[slug]/page.tsx
git commit -m "feat: modular case study — block vocabulary, bleed images, scroll reveals"
```

---

## Chunk 5: About Page + Waveform Integration + Polish

### Task 11: About Page

**Files:**
- Rewrite: `src/app/about/page.tsx`

- [ ] **Step 1: Rewrite about page**

Same left-shifted column. The quietest page.

1. Philosophy statement (96px top padding): Newsreader italic, `clamp(22px, 3vw, 32px)`, `--ink-primary` — intentional repetition, the warm breath
2. 24px gap
3. Body: 2 paragraphs, General Sans 15px, `--ink-secondary`, max 54ch
4. 48px gap
5. Experience section: Fragment Mono label + timeline rows (period in Fragment Mono 11px `--ink-muted` tabular-nums | role in General Sans 15px `--ink-primary`, separated by `--ink-ghost` rules)
6. 48px gap
7. Contact: "For work inquiries, reach me at [email]" — General Sans 15px. Social links as Fragment Mono 11px uppercase single line.
8. 72px bottom space

GSAP entrance: all `[data-reveal]` elements, `opacity:0, y:32, blur:3px` → clear, 500ms, 60ms stagger.

No images. No interactions beyond ambient waveform.

- [ ] **Step 2: Commit**

```bash
git add src/app/about/page.tsx
git commit -m "feat: about page — the quiet page, philosophy + experience + contact"
```

---

### Task 12: Waveform ↔ Store Integration

**Files:**
- Modify: `src/components/Waveform.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Connect waveform to store**

The waveform reads from the store:
- `hoveredSlug`: when set, lerp toward that project's accent/frequency/amplitude
- `activeZoneSlug`: when no hover, lerp toward the scroll-active project's values
- When neither: use rest state (8px amplitude, 0.003 freq, `--ink-ghost` color)

Lookup project data from `PIECES` array by slug to get accent/frequency/amplitude/waveMode.

Color lerping: parse hex → RGB channels → lerp each → reconstruct for canvas strokeStyle.

- [ ] **Step 2: Verify waveform responds to hover and scroll**

Dev server: hover projects on homepage, verify waveform color/frequency changes. Scroll through projects, verify scroll-linked color transitions.

- [ ] **Step 3: Commit**

```bash
git add src/components/Waveform.tsx
git commit -m "feat: waveform responds to hover + scroll zone — radio-dial tuning"
```

---

### Task 13: Entrance Choreography

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/components/Waveform.tsx`
- Modify: `src/components/NavCoordinates.tsx`
- Modify: `src/components/GhostLetters.tsx`

- [ ] **Step 1: Implement first-visit entrance sequence**

Check `sessionStorage.getItem('hkj-visited')`:
- If not set (first visit): run choreography, then set flag
- If set (repeat visit): quick 300ms fade-in, no choreography

Choreography sequence (GSAP timeline):
1. t=0: Waveform draws left-to-right (clip-path or progressive path drawing, 800ms)
2. t=400ms: Nav coordinates blur-reveal (500ms, 60ms stagger)
3. t=600ms: Ghost letters fade 0→0.10 (600ms)
4. t=800ms: Colophon reveals (400ms)
5. Work sequence: scroll-triggered (independent of choreography)

- [ ] **Step 2: Commit**

```bash
git add src/app/page.tsx src/components/Waveform.tsx src/components/NavCoordinates.tsx src/components/GhostLetters.tsx
git commit -m "feat: entrance choreography — waveform draw, staggered reveals"
```

---

### Task 14: Chrome Scroll Effect

**Files:**
- Modify: `src/components/WorkSequence.tsx`

- [ ] **Step 1: Add scroll-linked chrome gradient to project numbers**

Use GSAP ScrollTrigger to update `background-position` on `.chrome-text` elements as the user scrolls. Each number's gradient shifts position based on its scroll progress, creating the brushed-aluminum-catching-light effect.

```typescript
// In WorkSequence, after mount:
gsap.to(".chrome-text", {
  backgroundPosition: "100% 100%",
  ease: "none",
  scrollTrigger: {
    trigger: ".work-sequence",
    start: "top bottom",
    end: "bottom top",
    scrub: 1,
  },
});
```

- [ ] **Step 2: Commit**

```bash
git add src/components/WorkSequence.tsx
git commit -m "feat: chrome gradient on project numbers — scroll-linked metallic sheen"
```

---

### Task 15: Cleanup + 404 Page

**Files:**
- Modify: `src/app/not-found.tsx`
- Delete: `src/components/HeroSection.tsx` (if not already)
- Delete: `src/components/Nav.tsx` (if not already)
- Delete: `src/components/WorkIndex.tsx` (if not already)

- [ ] **Step 1: Update 404 page**

Minimal: same left-shifted column. Fragment Mono 11px: `404 — NOT FOUND`. General Sans 15px: "This page doesn't exist." Link back to `/`. Waveform and nav are present (they're in layout).

- [ ] **Step 2: Delete unused components**

```bash
rm -f src/components/HeroSection.tsx src/components/Nav.tsx src/components/WorkIndex.tsx src/components/HoverImage.tsx
```

- [ ] **Step 3: Final build verification**

Run: `npm run build`
Expected: All routes compile, no unused imports, no errors.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: cleanup unused components, update 404 page"
```

---

## Chunk 6: Responsive + Reduced Motion + Final Verification

### Task 16: Responsive Adjustments

**Files:**
- Modify: `src/components/WorkSequence.tsx`
- Modify: `src/components/GhostLetters.tsx`
- Modify: `src/components/NavCoordinates.tsx`
- Modify: `src/components/CaseStudy.tsx`

- [ ] **Step 1: Mobile breakpoint adjustments (< 768px)**

Across all components:
- Ghost letters: scale to 50vw or hide entirely
- Content column: full-width, 24px inline padding, no left-shift
- Ghost numbers: hidden
- Margin images: hidden. Project images display inline below description, 100% width, `.image-treatment`
- Nav clock: hidden
- Case study bleed images: full-width (already edge-to-edge)
- Spacing: 72→48, 48→32, 32→24, 24→16
- Blur-reveal fallback: `opacity:0, y:16, scale:0.98` instead of blur

- [ ] **Step 2: Tablet breakpoint (768-1024px)**

- Left-shift reduced to 4vw
- Margin images: 200px wide
- Ghost letters: 30vw

- [ ] **Step 3: Commit**

```bash
git add src/components/WorkSequence.tsx src/components/GhostLetters.tsx src/components/NavCoordinates.tsx src/components/CaseStudy.tsx
git commit -m "feat: responsive — mobile/tablet breakpoints, blur fallback"
```

---

### Task 17: Reduced Motion

**Files:**
- Modify: `src/components/Waveform.tsx`
- Modify: `src/components/PageTransition.tsx`
- Modify: all components with GSAP reveals

- [ ] **Step 1: Implement reduced motion across all components**

Use `useReducedMotion` hook (already exists in `src/hooks/useReducedMotion.ts`):
- Waveform: static horizontal line, no animation, no cursor response. Color still shifts on hover (instant).
- Page transitions: instant swap, no fade/blur
- Entrance choreography: skipped
- Scroll reveals: content visible immediately
- Hover dimming: still works (already instant)

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: reduced motion — static waveform, instant transitions"
```

---

### Task 18: Final Verification

- [ ] **Step 1: Build check**

Run: `npm run build`
Expected: All routes compile, no warnings.

- [ ] **Step 2: Dev server walkthrough**

Run: `npm run dev`

Verify each item:
- [ ] Homepage: ghost HKJ letters visible, waveform breathing, projects in left-shifted column
- [ ] Structural line visible at column edge
- [ ] Hover any project: others fade to whisper (0.05), margin image appears, waveform shifts color
- [ ] Chrome gradient on project numbers shifts with scroll
- [ ] Scroll through projects: waveform color transitions between project accents
- [ ] Click project: page fades to surface, case study blur-reveals, waveform maintains color
- [ ] Case study: metadata bar with chrome number, paradox lede in Newsreader italic, modular body sections, bleed images with desaturation + grain
- [ ] Next project link at case study bottom
- [ ] About: philosophy statement (Newsreader italic), experience timeline, contact
- [ ] Mobile: inline images, no ghost numbers, full-width column, waveform present
- [ ] First visit entrance: waveform draws, then content reveals in sequence
- [ ] Repeat visit: quick fade-in

- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "feat: resonance surface — complete neo-brutalist portfolio"
```
