# Cathydolle-Faithful Rebuild — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the HKJ Studio portfolio as a cathydolle.com-faithful reconstruction — full-viewport homepage with list/slider toggle, image-split preloader, clip-path page transitions, and sequential case study pages with scroll-to-navigate.

**Architecture:** Delete 11 unused files (R3F, old sections, custom cursor), rewrite 9 files (Hero as 3-file module, preloader, page transition, case study, layout/CSS/store/nav), add 3 new files (ListView, SliderView, useScrollNavigate hook). The homepage is a single `100svh` surface with no scroll. Case study pages use a narrow offset content column with GSAP scroll reveals. Both GSAP (ScrollTrigger animations) and Framer Motion (AnimatePresence, layoutId, drag) remain.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS v4, GSAP + Framer Motion, Lenis, Zustand

**Spec:** `docs/superpowers/specs/2026-03-16-cathydolle-rebuild-design.md`

**Testing:** This is a visual frontend rebuild with no existing test infrastructure. Verification is via `npm run build` (compile check) and visual inspection in `npm run dev`. Each commit must pass `npm run build`.

---

## File Structure

### Files to Delete (11)

| File | Reason |
|---|---|
| `src/components/Cursor.tsx` | Custom cursor removed |
| `src/components/ui/ScrollProgress.tsx` | Homepage progress bar removed |
| `src/components/WorksGallery.tsx` | R3F gallery, unused |
| `src/components/ProjectCover.tsx` | R3F cover, unused |
| `src/components/sections/Works.tsx` | Old works section, unused |
| `src/components/sections/About.tsx` | Not imported anywhere |
| `src/components/sections/Capabilities.tsx` | Not imported anywhere |
| `src/components/case-study/VideoShowcase.tsx` | Case study rewrite replaces |
| `src/components/case-study/GutPunchCloser.tsx` | Case study rewrite replaces |
| `src/components/ui/SequentialVideo.tsx` | Only imported by deleted `work/page.tsx` |
| `src/app/work/page.tsx` | Redundant — homepage IS the project list |

### Files to Create (3)

| File | Responsibility |
|---|---|
| `src/components/hero/ListView.tsx` | Single-column project list with stagger entrance animation |
| `src/components/hero/SliderView.tsx` | Horizontal drag gallery with full-height image cards |
| `src/hooks/useScrollNavigate.ts` | Scroll-to-navigate hook for case study pages (wheel delta accumulation → threshold → navigate) |

### Files to Rewrite (9)

| File | Change Summary |
|---|---|
| `src/components/sections/Hero.tsx` | Shell: 100svh flex column, header (logo + toggle + about), content (AnimatePresence), footer (email). Imports ListView/SliderView. |
| `src/components/StudioPreloader.tsx` | Image-split animation: box appear → expand → split thumbnails → chrome reveal. GSAP timeline. |
| `src/components/PageTransition.tsx` | 1.75s clip-path enter + scale/opacity exit with cinematic easing. |
| `src/app/page.tsx` | `<Hero />` only — remove Contact, Colophon imports. |
| `src/app/layout.tsx` | Remove `Cursor` and `ScrollProgress` imports. |
| `src/app/globals.css` | Add vw-based column grid utilities (`--grid-gutter`, `.span-w-N`, `.span-ml-N`, `.padding-x-1`, `.gutter-gap`). |
| `src/constants/navigation.ts` | Work → `"/"`, remove Contact anchor, keep About. |
| `src/lib/store.ts` | Remove `hoveredProject`/`activeProject` (orphaned). |
| `src/app/work/[slug]/page.tsx` | Full rewrite: span-w-7 offset layout, metadata, media gallery with GSAP scroll reveals, scroll-to-navigate, scroll progress, keyboard nav. |

### Files Unchanged (14)

`SmoothScroll.tsx`, `GlobalNav.tsx` (minor pathname check), `MobileMenu.tsx`, `Contact.tsx`, `Colophon.tsx`, `projects.ts`, `contact.ts`, `gsap.ts`, `utils.ts`, `useReducedMotion.ts`, `template.tsx`, `not-found.tsx`, `opengraph-image.tsx`, `about/page.tsx` (minor).

---

## Chunk 1: Cleanup & Foundation

### Task 1: Delete unused files and clean imports (atomic)

**Why atomic:** Deleting files before removing their imports would break the build. This task does both in one commit.

**Files:**
- Modify: `src/app/layout.tsx:6,9,82-84` (remove Cursor, ScrollProgress imports + JSX)
- Delete: `src/components/Cursor.tsx`
- Delete: `src/components/ui/ScrollProgress.tsx`
- Delete: `src/components/WorksGallery.tsx`
- Delete: `src/components/ProjectCover.tsx`
- Delete: `src/components/sections/Works.tsx`
- Delete: `src/components/sections/About.tsx`
- Delete: `src/components/sections/Capabilities.tsx`
- Delete: `src/components/case-study/VideoShowcase.tsx`
- Delete: `src/components/case-study/GutPunchCloser.tsx`
- Delete: `src/components/ui/SequentialVideo.tsx`
- Delete: `src/app/work/page.tsx`

- [ ] **Step 1: Remove Cursor and ScrollProgress from layout.tsx**

In `src/app/layout.tsx`, remove these import lines:
```typescript
// DELETE: import Cursor from "@/components/Cursor";
// DELETE: import ScrollProgress from "@/components/ui/ScrollProgress";
```

Remove from JSX body:
```tsx
{/* DELETE: <Cursor /> */}
{/* DELETE: <ScrollProgress /> */}
```

The result should be:

```tsx
// layout.tsx body contents
<StudioPreloader />
<GlobalNav />

{/* Grain overlay */}
<div className="noise-grain" />

<PageTransition />
<SmoothScroll>{children}</SmoothScroll>
```

- [ ] **Step 2: Delete all 11 files**

```bash
rm -f src/components/Cursor.tsx \
      src/components/ui/ScrollProgress.tsx \
      src/components/WorksGallery.tsx \
      src/components/ProjectCover.tsx \
      src/components/sections/Works.tsx \
      src/components/sections/About.tsx \
      src/components/sections/Capabilities.tsx \
      src/components/case-study/VideoShowcase.tsx \
      src/components/case-study/GutPunchCloser.tsx \
      src/components/ui/SequentialVideo.tsx \
      src/app/work/page.tsx
```

- [ ] **Step 3: Remove empty directories if any**

```bash
rmdir src/components/case-study 2>/dev/null || true
ls src/components/ui/ 2>/dev/null || rmdir src/components/ui 2>/dev/null
```

- [ ] **Step 4: Verify build**

```bash
npm run build
```

Expected: Build succeeds.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: delete 11 unused files and clean layout imports"
```

---

### Task 3: Simplify homepage — Hero only

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Remove Contact and Colophon**

Replace entire file with:

```tsx
import Hero from "@/components/sections/Hero";

export default function Home() {
  return (
    <main>
      <Hero />
    </main>
  );
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "refactor: homepage renders Hero only (remove Contact, Colophon)"
```

---

### Task 4: Clean store.ts — remove orphaned state

**Files:**
- Modify: `src/lib/store.ts`

- [ ] **Step 1: Remove `activeProject` and `hoveredProject`**

Replace entire file with:

```typescript
import { create } from "zustand";

interface StudioState {
  /** True once critical resources are loaded */
  isLoaded: boolean;
  setLoaded: (v: boolean) => void;

  /** Whether the fixed nav bar is visible */
  navVisible: boolean;
  setNavVisible: (v: boolean) => void;

  /** Whether the mobile menu is open */
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (v: boolean) => void;

  /** Page transition in progress */
  isTransitioning: boolean;
  setTransitioning: (v: boolean) => void;
}

export const useStudioStore = create<StudioState>((set) => ({
  isLoaded: false,
  setLoaded: (v) => set({ isLoaded: v }),

  navVisible: false,
  setNavVisible: (v) => set({ navVisible: v }),

  mobileMenuOpen: false,
  setMobileMenuOpen: (v) => set({ mobileMenuOpen: v }),

  isTransitioning: false,
  setTransitioning: (v) => set({ isTransitioning: v }),
}));
```

- [ ] **Step 2: Search for any remaining references to removed state**

```bash
grep -r "activeProject\|hoveredProject\|setActiveProject\|setHoveredProject" src/ --include="*.tsx" --include="*.ts"
```

Expected: No matches (all consumers were in deleted files).

- [ ] **Step 3: Verify build**

```bash
npm run build
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/store.ts
git commit -m "refactor: remove orphaned activeProject and hoveredProject from store"
```

---

### Task 5: Update navigation constants

**Files:**
- Modify: `src/constants/navigation.ts`

- [ ] **Step 1: Update links**

Replace entire file with:

```typescript
export interface NavLink {
  label: string;
  href: string;
}

export const NAV_LINKS: NavLink[] = [
  { label: "Work", href: "/" },
  { label: "About", href: "/about" },
];

export const MENU_LINKS: NavLink[] = [
  { label: "Work", href: "/" },
  { label: "About", href: "/about" },
];
```

Changes: `Work` href `#work` → `/`, removed `Contact` entry.

- [ ] **Step 2: Verify build**

```bash
npm run build
```

- [ ] **Step 3: Commit**

```bash
git add src/constants/navigation.ts
git commit -m "refactor: update nav links — Work points to /, remove Contact"
```

---

### Task 6: Add vw-based column grid to globals.css

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Add grid gutter variables**

Add inside the existing `:root` block (before the closing brace on line 44):

```css
  /* ── vw Column Grid ── */
  --grid-gutter: 0.56vw;  /* Desktop default */
```

Then add responsive overrides after `:root`, before `/* ── Base ── */`:

```css
@media (max-width: 1023px) {
  :root { --grid-gutter: 1.04vw; }
}
@media (max-width: 767px) {
  :root { --grid-gutter: 2.13vw; }
}
```

**Note:** Desktop is the default (no `@media` wrapper). Tablet/mobile override downward with `max-width`. This matches cathydolle's exact pattern from spec Section 6.1.

- [ ] **Step 2: Add span utility classes inside `@layer utilities`**

Add after the existing `.hairline` rule inside `@layer utilities`:

```css
  /* ── Column grid spans ── */
  .gutter-gap { gap: var(--grid-gutter); }
  .padding-x-1 { padding-left: var(--grid-gutter); padding-right: var(--grid-gutter); }

  /* Desktop-first span widths; tablet/mobile via media queries below */
  .span-w-1 { width: 7.73vw; }
  .span-w-2 { width: 16.02vw; }
  .span-w-3 { width: 24.31vw; }
  .span-w-4 { width: 32.59vw; }
  .span-w-5 { width: 40.88vw; }
  .span-w-7 { width: 57.45vw; }
  .span-w-8 { width: 65.74vw; }
  .span-w-12 { width: 98.89vw; }

  .span-ml-1 { margin-left: 7.73vw; }
  .span-ml-2 { margin-left: 16.57vw; }
```

- [ ] **Step 3: Add responsive overrides after `@layer utilities` block**

Add after the `@layer utilities { ... }` closing brace:

```css
/* ── Grid responsive overrides ── */
@media (min-width: 768px) and (max-width: 1023px) {
  .span-w-1 { width: 7.20vw; }
  .span-w-2 { width: 15.45vw; }
  .span-w-3 { width: 23.70vw; }
  .span-w-4 { width: 31.94vw; }
  .span-w-5 { width: 40.19vw; }
  .span-w-7 { width: 56.68vw; }
  .span-w-8 { width: 64.93vw; }
  .span-w-12 { width: 97.92vw; }
  .span-ml-1 { margin-left: 7.20vw; }
  .span-ml-2 { margin-left: 16.49vw; }
}

@media (max-width: 767px) {
  .span-w-1 { width: 14.18vw; }
  .span-w-2 { width: 30.49vw; }
  .span-w-3 { width: 46.80vw; }
  .span-w-4 { width: 63.11vw; }
  .span-w-5 { width: 79.42vw; }
  .span-w-7 { width: 95.73vw; }
  .span-w-8 { width: 95.73vw; }
  .span-w-12 { width: 95.73vw; }
  .span-ml-1 { margin-left: 14.18vw; }
  .span-ml-2 { margin-left: 32.62vw; }
}
```

- [ ] **Step 4: Update the CSS comment at the top**

Change line 8 from:
```css
 * Motion: GSAP-only, power3.out reveals, opacity from 0.15
```
To:
```css
 * Motion: GSAP (ScrollTrigger) + Framer Motion (AnimatePresence, layoutId)
```

- [ ] **Step 5: Verify build**

```bash
npm run build
```

- [ ] **Step 6: Commit**

```bash
git add src/app/globals.css
git commit -m "feat: add vw-based column grid utilities to globals.css"
```

---

### Task 7: Remove unused npm packages

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Uninstall R3F and unused packages**

```bash
npm uninstall @react-three/fiber @react-three/drei @react-three/postprocessing three @types/three simplex-noise leva use-sound
```

- [ ] **Step 2: Check if lucide-react is still used**

```bash
grep -r "lucide-react" src/ --include="*.tsx" --include="*.ts"
```

If no matches, also uninstall:

```bash
npm uninstall lucide-react
```

- [ ] **Step 3: Check if react-intersection-observer is still used**

```bash
grep -r "react-intersection-observer" src/ --include="*.tsx" --include="*.ts"
```

If no matches, also uninstall:

```bash
npm uninstall react-intersection-observer
```

- [ ] **Step 4: Verify build**

```bash
npm run build
```

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: remove unused dependencies (R3F, three, leva, use-sound, simplex-noise)"
```

---

## Chunk 2: Homepage — Hero Rewrite

### Task 8: Create ListView component

**Files:**
- Create: `src/components/hero/ListView.tsx`

- [ ] **Step 1: Create the hero directory**

```bash
mkdir -p src/components/hero
```

- [ ] **Step 2: Write ListView.tsx**

```tsx
"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { PROJECTS } from "@/constants/projects";

const ease = [0.16, 1, 0.3, 1] as const;

const staggerContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07, delayChildren: 0.15 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease },
  },
};

export default function ListView() {
  const router = useRouter();
  const needsScroll = PROJECTS.length > 8;

  return (
    <motion.div
      className="flex flex-col justify-center h-full padding-x-1"
      style={{
        padding: "10vh 0",
        overflowY: needsScroll ? "auto" : "hidden",
        scrollbarWidth: "none",
      }}
      variants={staggerContainer}
      initial="hidden"
      animate="show"
    >
      {PROJECTS.map((project, i) => (
        <motion.button
          key={project.id}
          onClick={() => !project.wip && router.push(`/work/${project.id}`)}
          disabled={project.wip}
          variants={fadeUp}
          className="flex items-center gutter-gap"
          style={{
            height: `clamp(8vh, ${80 / PROJECTS.length}vh, 18vh)`,
            cursor: project.wip ? "default" : "pointer",
          }}
        >
          {/* Number */}
          <span
            className="font-mono italic"
            style={{
              fontSize: "11px",
              color: "var(--color-text-ghost)",
            }}
          >
            {String(i + 1).padStart(2, "0")}/
          </span>

          {/* Title */}
          <span
            className="font-mono uppercase"
            style={{
              fontSize: "11px",
              fontWeight: 500,
              letterSpacing: "0.08em",
              color: project.wip
                ? "var(--color-text-ghost)"
                : "var(--color-text-dim)",
              transition: "all 200ms cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            <span
              style={{
                transition: "color 200ms cubic-bezier(0.4, 0, 0.2, 1)",
              }}
              onMouseEnter={(e) => {
                if (!project.wip)
                  (e.target as HTMLElement).style.color = "var(--color-text)";
              }}
              onMouseLeave={(e) => {
                if (!project.wip)
                  (e.target as HTMLElement).style.color = "var(--color-text-dim)";
              }}
            >
              {project.title}
            </span>
            {project.wip && (
              <span style={{ opacity: 0.4, marginLeft: 8 }}>(WIP)</span>
            )}
          </span>
        </motion.button>
      ))}
    </motion.div>
  );
}
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

- [ ] **Step 4: Commit**

```bash
git add src/components/hero/ListView.tsx
git commit -m "feat: create ListView component — single-column project list"
```

---

### Task 9: Create SliderView component

**Files:**
- Create: `src/components/hero/SliderView.tsx`

- [ ] **Step 1: Write SliderView.tsx**

```tsx
"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { PROJECTS } from "@/constants/projects";

const ease = [0.16, 1, 0.3, 1] as const;

export default function SliderView() {
  const router = useRouter();
  const activeProjects = PROJECTS.filter((p) => !p.wip);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragX = useMotionValue(0);
  const dragXSmooth = useSpring(dragX, { stiffness: 200, damping: 30 });
  const wasDragged = useRef(false);
  const [dragLeft, setDragLeft] = useState(-600);

  // Measure scroll width after mount for drag constraints (SSR-safe)
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const scrollW = container.scrollWidth - container.clientWidth;
    setDragLeft(-scrollW);
  }, []);

  return (
    <div ref={containerRef} className="h-full overflow-hidden padding-x-1">
      <motion.div
        className="flex h-full gutter-gap"
        drag="x"
        dragConstraints={{ left: dragLeft, right: 0 }}
        dragElastic={0.15}
        style={{ x: dragXSmooth }}
        onDragStart={() => {
          wasDragged.current = false;
        }}
        onDrag={() => {
          wasDragged.current = true;
        }}
      >
        {activeProjects.map((project, i) => (
          <motion.div
            key={project.id}
            className="relative shrink-0 h-full overflow-hidden cursor-grab active:cursor-grabbing"
            style={{ width: "32.59vw" }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.7,
              delay: i * 0.1,
              ease,
            }}
            onClick={() => {
              if (!wasDragged.current) router.push(`/work/${project.id}`);
            }}
          >
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 63vw, 33vw"
              quality={90}
              draggable={false}
            />

            {/* Label overlay */}
            <motion.div
              className="absolute bottom-0 left-0 right-0"
              style={{ padding: "1.25rem" }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.5 + i * 0.1,
                duration: 0.6,
                ease,
              }}
            >
              <span
                className="font-mono uppercase"
                style={{
                  fontSize: "11px",
                  letterSpacing: "0.1em",
                  color: "#fff",
                  textShadow: "0 1px 4px rgba(0,0,0,0.4)",
                }}
              >
                {project.title}
              </span>
            </motion.div>
          </motion.div>
        ))}

        {/* WIP projects rendered with reduced opacity */}
        {PROJECTS.filter((p) => p.wip).map((project, i) => (
          <motion.div
            key={project.id}
            className="relative shrink-0 h-full overflow-hidden"
            style={{ width: "32.59vw", opacity: 0.5 }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 0.5, scale: 1 }}
            transition={{
              duration: 0.7,
              delay: (activeProjects.length + i) * 0.1,
              ease,
            }}
          >
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 63vw, 33vw"
              quality={90}
              draggable={false}
            />
            <div
              className="absolute bottom-0 left-0 right-0"
              style={{ padding: "1.25rem" }}
            >
              <span
                className="font-mono uppercase"
                style={{
                  fontSize: "11px",
                  letterSpacing: "0.1em",
                  color: "#fff",
                  textShadow: "0 1px 4px rgba(0,0,0,0.4)",
                }}
              >
                {project.title} (WIP)
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
```

**Note:** The `dragConstraints.left` uses a runtime calculation. Since this is a client component, `window` is available. However, for SSR safety, default to -600. Alternatively, use a ref-based constraint after mount. The implementer should use `useRef` + `useEffect` to measure the scroll container width and set constraints dynamically.

- [ ] **Step 2: Verify build**

```bash
npm run build
```

- [ ] **Step 3: Commit**

```bash
git add src/components/hero/SliderView.tsx
git commit -m "feat: create SliderView component — horizontal drag gallery"
```

---

### Task 10: Rewrite Hero.tsx — shell component

**Files:**
- Rewrite: `src/components/sections/Hero.tsx`

- [ ] **Step 1: Replace Hero.tsx with new shell**

```tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStudioStore } from "@/lib/store";
import { CONTACT_EMAIL } from "@/constants/contact";
import ListView from "@/components/hero/ListView";
import SliderView from "@/components/hero/SliderView";

type ViewMode = "list" | "slider";

const ease = [0.16, 1, 0.3, 1] as const;
const easeIn = [0.4, 0, 1, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease },
  },
};

const viewTransition = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease },
  },
  exit: {
    opacity: 0,
    y: -12,
    transition: { duration: 0.3, ease: easeIn },
  },
};

export default function Hero() {
  const isLoaded = useStudioStore((s) => s.isLoaded);
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  return (
    <motion.section
      id="hero"
      className="relative flex flex-col"
      style={{
        height: "100svh",
        overflow: "hidden",
        backgroundColor: "var(--color-bg)",
      }}
      initial="hidden"
      animate={isLoaded ? "show" : "hidden"}
    >
      {/* ── Header ── */}
      <motion.div
        className="flex items-center padding-x-1"
        style={{
          paddingTop: "clamp(1.2rem, 2.5vh, 1.8rem)",
          paddingBottom: "clamp(1.2rem, 2.5vh, 1.8rem)",
        }}
        variants={fadeUp}
      >
        {/* Logo */}
        <span
          className="font-mono uppercase shrink-0"
          style={{
            fontSize: "11px",
            color: "var(--color-text)",
            letterSpacing: "0.08em",
          }}
        >
          HKJ
        </span>

        {/* View toggle */}
        <div className="flex gap-3 ml-4 relative">
          {(["list", "slider"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className="font-mono uppercase relative"
              style={{
                fontSize: "11px",
                letterSpacing: "0.1em",
                color:
                  viewMode === mode
                    ? "var(--color-text)"
                    : "var(--color-text-ghost)",
                transition: "color 0.3s ease",
              }}
            >
              {mode}
              {viewMode === mode && (
                <motion.div
                  layoutId="viewIndicator"
                  className="absolute -bottom-1 left-0 right-0 h-[1px]"
                  style={{ backgroundColor: "var(--color-text)" }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 30,
                  }}
                />
              )}
            </button>
          ))}
        </div>

        {/* About link — pushed right */}
        <a
          href="/about"
          className="font-mono uppercase ml-auto"
          style={{
            fontSize: "11px",
            letterSpacing: "0.1em",
            color: "var(--color-text-ghost)",
            transition: "color 0.3s ease",
          }}
          onMouseEnter={(e) =>
            ((e.target as HTMLElement).style.color = "var(--color-text)")
          }
          onMouseLeave={(e) =>
            ((e.target as HTMLElement).style.color = "var(--color-text-ghost)")
          }
        >
          About
        </a>
      </motion.div>

      {/* ── Content ── */}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          {viewMode === "list" ? (
            <motion.div
              key="list"
              variants={viewTransition}
              initial="initial"
              animate="animate"
              exit="exit"
              className="h-full"
            >
              <ListView />
            </motion.div>
          ) : (
            <motion.div
              key="slider"
              variants={viewTransition}
              initial="initial"
              animate="animate"
              exit="exit"
              className="h-full"
            >
              <SliderView />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Footer ── */}
      <motion.div
        className="padding-x-1 flex justify-end"
        style={{ paddingBottom: "clamp(1rem, 2vh, 1.5rem)" }}
        variants={fadeUp}
      >
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="font-mono uppercase"
          style={{
            fontSize: "11px",
            letterSpacing: "0.08em",
            color: "var(--color-text-ghost)",
            transition: "color 0.3s ease",
          }}
          onMouseEnter={(e) =>
            ((e.target as HTMLElement).style.color = "var(--color-text-dim)")
          }
          onMouseLeave={(e) =>
            ((e.target as HTMLElement).style.color = "var(--color-text-ghost)")
          }
        >
          {CONTACT_EMAIL}
        </a>
      </motion.div>
    </motion.section>
  );
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

- [ ] **Step 3: Visual check**

```bash
npm run dev
```

Open `http://localhost:3000`. Verify:
- Full viewport, no scroll
- Header: "HKJ" left, List/Slider toggle center-left, "About" right
- Footer: email right-aligned
- List view: numbered rows, centered, generous whitespace
- Slider toggle: drag-to-scroll image gallery
- Toggle animates underline smoothly

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/Hero.tsx
git commit -m "feat: rewrite Hero — cathydolle-faithful 100svh shell with header/content/footer"
```

---

## Chunk 3: Preloader & Page Transitions

### Task 11: Rewrite StudioPreloader — image-split animation

**Files:**
- Rewrite: `src/components/StudioPreloader.tsx`

- [ ] **Step 1: Replace StudioPreloader.tsx**

```tsx
"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { useStudioStore } from "@/lib/store";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { PROJECTS } from "@/constants/projects";

const SESSION_KEY = "hkj-visited";
const CINEMATIC = "cubic-bezier(0.86, 0, 0.07, 1)";

export default function StudioPreloader() {
  const setLoaded = useStudioStore((s) => s.setLoaded);
  const isLoaded = useStudioStore((s) => s.isLoaded);
  const prefersReduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const thumbRefs = useRef<(HTMLDivElement | null)[]>([]);
  const headerRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState(true);

  const activeProjects = PROJECTS.filter((p) => !p.wip);

  useEffect(() => {
    // Skip if already visited or prefers-reduced-motion
    if (typeof window !== "undefined") {
      if (sessionStorage.getItem(SESSION_KEY) || prefersReduced) {
        setLoaded(true);
        setShouldRender(false);
        return;
      }
    }

    const el = containerRef.current;
    const box = boxRef.current;
    if (!el || !box) return;

    const tl = gsap.timeline({
      defaults: { ease: "power3.inOut" },
      onComplete: () => {
        gsap.to(el, {
          opacity: 0,
          duration: 0.4,
          ease: "power2.in",
          onComplete: () => {
            sessionStorage.setItem(SESSION_KEY, "1");
            setLoaded(true);
            setShouldRender(false);
          },
        });
      },
    });

    // Wait for fonts + images
    const fontsReady = document.fonts.ready;
    const timeout = new Promise((r) => setTimeout(r, 3000));

    Promise.race([fontsReady, timeout]).then(() => {
      // Phase 1 — Box appear (0.4s)
      tl.fromTo(
        box,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.4 }
      );

      // Phase 2 — Box expand (0.6s)
      tl.to(box, {
        width: "32.59vw",
        height: "auto",
        duration: 0.6,
      });

      // Show first thumbnail inside box
      if (thumbRefs.current[0]) {
        tl.fromTo(
          thumbRefs.current[0],
          { clipPath: "inset(100% 0 0 0)" },
          { clipPath: "inset(0% 0 0 0)", duration: 0.6 },
          "<"
        );
      }

      // Phase 3 — Split & distribute (0.8s)
      thumbRefs.current.forEach((thumb, i) => {
        if (!thumb) return;
        tl.to(
          thumb,
          {
            opacity: 0,
            scale: 0.6,
            y: -40,
            duration: 0.5,
          },
          `split+=${i * 0.1}`
        );
      });

      tl.to(box, { opacity: 0, duration: 0.3 }, "split+=0.3");

      // Phase 4 — Chrome reveal (0.4s)
      // Signal Hero that preloader is done so Hero's header/footer
      // fade in via isLoaded-gated entrance animations.
      // The preloader's onComplete callback sets isLoaded=true,
      // which triggers Hero's fadeUp variants on header and footer.
    });
  }, [setLoaded, prefersReduced]);

  if (!shouldRender || isLoaded) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[1000] flex items-center justify-center"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      {/* Central box with project thumbnails */}
      <div
        ref={boxRef}
        className="relative overflow-hidden flex items-center justify-center"
        style={{
          width: 60,
          height: 80,
          backgroundColor: "var(--color-border)",
        }}
      >
        {activeProjects.map((project, i) => (
          <div
            key={project.id}
            ref={(el) => { thumbRefs.current[i] = el; }}
            className="absolute inset-0"
            style={{
              clipPath: i === 0 ? undefined : "inset(100% 0 0 0)",
            }}
          >
            <Image
              src={project.image}
              alt=""
              fill
              className="object-cover"
              sizes="33vw"
              priority={i === 0}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
```

**Implementation note:** This is a simplified version of the spec's 4-phase animation. The thumbnails are stacked inside the box. Phase 3 animates them out (shrink/fade/translate up), which reveals the Hero's list view underneath since the preloader overlay fades out on completion. The Hero component's `isLoaded`-gated entrance animations then fire.

- [ ] **Step 2: Verify build**

```bash
npm run build
```

- [ ] **Step 3: Visual check in dev**

```bash
npm run dev
```

Open in incognito (no sessionStorage). Verify:
- Small centered box appears
- Box expands, first project image reveals
- Thumbnails shrink/fade upward
- Preloader fades out, Hero appears with entrance animation

- [ ] **Step 4: Commit**

```bash
git add src/components/StudioPreloader.tsx
git commit -m "feat: rewrite StudioPreloader — cathydolle-style image-split animation"
```

---

### Task 12: Update PageTransition — cathydolle timing

**Files:**
- Rewrite: `src/components/PageTransition.tsx`

- [ ] **Step 1: Replace PageTransition.tsx**

```tsx
"use client";

import { useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, animate, useMotionValue } from "framer-motion";

/**
 * PageTransition — Cathydolle-faithful clip-path + scale transition
 *
 * Enter: clip-path inset(100% 0 0 0) → inset(0 0 0 0), 1.75s
 * Exit:  scale 1 → 0.9, opacity 1 → 0.25, 1.75s
 * Easing: cubic-bezier(0.86, 0, 0.07, 1)
 */
const CINEMATIC = [0.86, 0, 0.07, 1] as const;
const DURATION = 1.75;

export default function PageTransition() {
  const pathname = usePathname();
  const isFirstRender = useRef(true);
  const clipProgress = useMotionValue(100); // inset top %
  const overlayOpacity = useMotionValue(0);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const sequence = async () => {
      // Enter: clip-path reveals from bottom to top
      clipProgress.set(100);
      overlayOpacity.set(1);

      await animate(clipProgress, 0, {
        duration: DURATION,
        ease: CINEMATIC,
      });

      // After reveal completes, hide overlay
      overlayOpacity.set(0);
      clipProgress.set(100);
    };

    sequence();
  }, [pathname, clipProgress, overlayOpacity]);

  return (
    <motion.div
      className="fixed inset-0 z-[999] pointer-events-none"
      style={{
        opacity: overlayOpacity,
        clipPath: useMotionValue(0) as never, // handled below
        backgroundColor: "var(--color-bg)",
      }}
    />
  );
}
```

**Implementation note:** The spec describes a two-layer transition: current page exits (scale 1→0.9, opacity 1→0.25) while the new page enters (clip-path inset reveal). Both 1.75s with `cubic-bezier(0.86, 0, 0.07, 1)`.

The implementer should use `template.tsx` (already exists, currently a passthrough) to orchestrate: on pathname change, animate the outgoing children with scale+opacity, then clip-reveal the incoming page. Use `useStudioStore.isTransitioning` to coordinate timing. The clip-path overlay approach shown above is a starting point — refine to achieve the two-layer visual effect where old page recedes behind the incoming page.

- [ ] **Step 2: Verify build**

```bash
npm run build
```

- [ ] **Step 3: Commit**

```bash
git add src/components/PageTransition.tsx
git commit -m "feat: update PageTransition — 1.75s cinematic clip-path timing"
```

---

## Chunk 4: Case Study Pages & Navigation

### Task 13: Create useScrollNavigate hook

**Files:**
- Create: `src/hooks/useScrollNavigate.ts`

- [ ] **Step 1: Write the hook**

```typescript
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { PROJECTS } from "@/constants/projects";

const THRESHOLD = 1750; // px of accumulated wheel delta before navigating

interface ScrollNavigateOptions {
  currentSlug: string;
}

export function useScrollNavigate({ currentSlug }: ScrollNavigateOptions) {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [direction, setDirection] = useState<"next" | "prev" | null>(null);
  const accumulatedDelta = useRef(0);
  const isNavigating = useRef(false);

  const activeProjects = PROJECTS.filter((p) => !p.wip);
  const currentIndex = activeProjects.findIndex((p) => p.id === currentSlug);

  const nextProject =
    activeProjects[(currentIndex + 1) % activeProjects.length];
  const prevProject =
    activeProjects[
      (currentIndex - 1 + activeProjects.length) % activeProjects.length
    ];

  const navigateTo = useCallback(
    (slug: string) => {
      if (isNavigating.current) return;
      isNavigating.current = true;
      router.replace(`/work/${slug}`, { scroll: false });
      // Reset after navigation
      setTimeout(() => {
        isNavigating.current = false;
        setProgress(0);
        setDirection(null);
        accumulatedDelta.current = 0;
      }, 600);
    },
    [router]
  );

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isNavigating.current) return;

      const scrollTop = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;
      const atTop = scrollTop <= 25;
      const atBottom = scrollTop >= scrollHeight - clientHeight - 25;

      if (!atTop && !atBottom) {
        // Reset if not at boundary
        accumulatedDelta.current = 0;
        setProgress(0);
        setDirection(null);
        return;
      }

      const delta = e.deltaY;

      // At bottom, scrolling down → next project
      if (atBottom && delta > 0) {
        accumulatedDelta.current += Math.abs(delta);
        setDirection("next");
      }
      // At top, scrolling up → previous project
      else if (atTop && delta < 0) {
        accumulatedDelta.current += Math.abs(delta);
        setDirection("prev");
      } else {
        // Wrong direction — reset
        accumulatedDelta.current = 0;
        setProgress(0);
        setDirection(null);
        return;
      }

      const pct = Math.min(
        (accumulatedDelta.current / THRESHOLD) * 100,
        100
      );
      setProgress(pct);

      if (pct >= 100) {
        if (direction === "next" && nextProject) {
          navigateTo(nextProject.id);
        } else if (direction === "prev" && prevProject) {
          navigateTo(prevProject.id);
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [direction, nextProject, prevProject, navigateTo]);

  return {
    progress,
    direction,
    nextProject,
    prevProject,
  };
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useScrollNavigate.ts
git commit -m "feat: create useScrollNavigate hook — wheel delta accumulation for project navigation"
```

---

### Task 14: Rewrite case study page

**Files:**
- Rewrite: `src/app/work/[slug]/page.tsx`

- [ ] **Step 1: Replace page.tsx**

```tsx
"use client";

import { useParams } from "next/navigation";
import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { PROJECTS } from "@/constants/projects";
import { useScrollNavigate } from "@/hooks/useScrollNavigate";

export default function CaseStudy() {
  const { slug } = useParams();
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollPercent, setScrollPercent] = useState(0);

  const project = PROJECTS.find((p) => p.id === slug);
  const { progress, direction, nextProject, prevProject } =
    useScrollNavigate({ currentSlug: slug as string });

  // Scroll progress indicator
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;
      const scrollY = window.scrollY;
      const pct = Math.round((scrollY / (scrollHeight - clientHeight)) * 100);
      setScrollPercent(Math.max(0, Math.min(pct, 100)));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // GSAP scroll reveals for media (spec Section 7.4)
  useEffect(() => {
    if (!containerRef.current) return;

    // Image reveals: opacity + y
    const imageEls = containerRef.current.querySelectorAll("[data-media-reveal='image']");
    imageEls.forEach((el, i) => {
      gsap.fromTo(el,
        { opacity: 0, y: 75 },
        { opacity: 1, y: 0, duration: 1.5, delay: i * 0.1, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 75%", once: true } }
      );
    });

    // Video reveals: opacity + y + scale (spec: scale 2→1)
    const videoEls = containerRef.current.querySelectorAll("[data-media-reveal='video']");
    videoEls.forEach((el, i) => {
      gsap.fromTo(el,
        { opacity: 0, y: 75, scale: 2 },
        { opacity: 1, y: 0, scale: 1, duration: 1.5, delay: i * 0.1, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 75%", once: true } }
      );
    });

    // Text reveals (spec Section 7.5)
    const textEls = containerRef.current.querySelectorAll("[data-text-reveal]");
    textEls.forEach((el, i) => {
      gsap.fromTo(el,
        { opacity: 0, y: 5, filter: "blur(4px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.75, delay: i * 0.122, ease: "power3.out" }
      );
    });

    // Role text has different stagger (0.2s per spec)
    const roleEls = containerRef.current.querySelectorAll("[data-role-reveal]");
    roleEls.forEach((el, i) => {
      gsap.fromTo(el,
        { opacity: 0, y: 5, filter: "blur(4px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.75, delay: i * 0.2, ease: "power3.out" }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [slug]);

  // Keyboard navigation (spec Section 7.9)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        window.location.href = "/";
        return;
      }

      // Arrow Up/Down: scroll to adjacent media block
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        const blocks = Array.from(
          document.querySelectorAll("[data-media-reveal]")
        );
        if (!blocks.length) return;

        const scrollY = window.scrollY + window.innerHeight / 2;
        const currentIdx = blocks.findIndex(
          (el) => (el as HTMLElement).offsetTop > scrollY
        );

        const targetIdx =
          e.key === "ArrowDown"
            ? Math.min(currentIdx >= 0 ? currentIdx : blocks.length - 1, blocks.length - 1)
            : Math.max((currentIdx >= 0 ? currentIdx : blocks.length) - 2, 0);

        blocks[targetIdx]?.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }

      // Spacebar: toggle video play/pause
      if (e.key === " ") {
        e.preventDefault();
        const videos = document.querySelectorAll("video");
        videos.forEach((v) => {
          const rect = v.getBoundingClientRect();
          if (rect.top < window.innerHeight && rect.bottom > 0) {
            v.paused ? v.play() : v.pause();
          }
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!project) {
    return (
      <div
        className="w-full h-screen flex items-center justify-center font-mono uppercase"
        style={{
          fontSize: "11px",
          letterSpacing: "0.2em",
          color: "var(--color-text-dim)",
        }}
      >
        project not found
      </div>
    );
  }

  // Collect all media from the project
  const mediaItems: Array<{
    type: "image" | "video";
    src: string;
    poster?: string;
    aspect?: string;
  }> = [];

  // Editorial images
  project.editorial.images?.forEach((img) => {
    mediaItems.push({ type: "image", src: img });
  });

  // Process step images
  project.processSteps?.forEach((step) => {
    if (step.image) {
      mediaItems.push({ type: "image", src: step.image, aspect: "4/3" });
    }
  });

  // Videos
  project.videos?.forEach((video) => {
    mediaItems.push({
      type: "video",
      src: video.src,
      poster: video.poster,
      aspect: video.aspect,
    });
  });

  return (
    <div
      ref={containerRef}
      className="min-h-screen"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      {/* ── Content column ── */}
      <div
        className="span-w-7 span-ml-2 py-[10vh]"
        style={{
          /* Mobile override handled by media queries on span classes */
        }}
      >
        {/* ── Project Metadata ── */}
        <div className="mb-16">
          <h1
            className="font-mono uppercase"
            style={{
              fontSize: "11px",
              letterSpacing: "0.08em",
              color: "var(--color-text)",
            }}
            data-text-reveal
          >
            {project.title}
          </h1>

          <p
            className="font-mono uppercase mt-4"
            style={{
              fontSize: "11px",
              lineHeight: "110%",
              color: "var(--color-text-dim)",
            }}
            data-text-reveal
          >
            {project.pitch}
          </p>

          <div className="flex gap-8 mt-6">
            <div data-text-reveal>
              <span
                className="font-mono uppercase block"
                style={{
                  fontSize: "11px",
                  color: "var(--color-text-ghost)",
                  marginBottom: "4px",
                }}
              >
                Role
              </span>
              <span
                className="font-mono uppercase"
                style={{
                  fontSize: "11px",
                  color: "var(--color-text-dim)",
                }}
              >
                {project.role}
              </span>
            </div>

            <div data-text-reveal>
              <span
                className="font-mono uppercase block"
                style={{
                  fontSize: "11px",
                  color: "var(--color-text-ghost)",
                  marginBottom: "4px",
                }}
              >
                Year
              </span>
              <span
                className="font-mono uppercase"
                style={{
                  fontSize: "11px",
                  color: "var(--color-text-dim)",
                }}
              >
                {project.year}
              </span>
            </div>
          </div>
        </div>

        {/* ── Media Gallery ── */}
        <div className="flex flex-col gap-8">
          {mediaItems.map((item, i) => (
            <div key={i} data-media-reveal={item.type}>
              {item.type === "image" ? (
                <div
                  className="relative w-full overflow-hidden"
                  style={{
                    aspectRatio: item.aspect || "16/10",
                  }}
                >
                  {item.src.startsWith("/placeholder") ? (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{
                        backgroundColor: "var(--color-surface)",
                      }}
                    >
                      <span
                        className="font-mono uppercase"
                        style={{
                          fontSize: "11px",
                          color: "var(--color-text-ghost)",
                        }}
                      >
                        Media Pending
                      </span>
                    </div>
                  ) : (
                    <Image
                      src={item.src}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 95vw, 57vw"
                      quality={90}
                    />
                  )}
                </div>
              ) : (
                <div
                  className="relative w-full overflow-hidden"
                  style={{ aspectRatio: item.aspect || "16/9" }}
                >
                  <video
                    src={item.src}
                    poster={item.poster}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Scroll progress ── */}
      <div
        className="fixed bottom-0 right-0 padding-x-1"
        style={{
          paddingBottom: "clamp(1rem, 2vh, 1.5rem)",
        }}
      >
        <span
          className="font-mono"
          style={{
            fontSize: "11px",
            color: "var(--color-text-ghost)",
          }}
        >
          {scrollPercent} %
        </span>
      </div>

      {/* ── Scroll-to-navigate progress bar ── */}
      {progress > 0 && direction && (
        <div
          className="fixed left-0 right-0 flex items-center justify-center"
          style={{
            [direction === "next" ? "bottom" : "top"]: "2rem",
          }}
        >
          <div className="flex items-center gap-3">
            <div
              style={{
                width: 120,
                height: 2,
                backgroundColor: "var(--color-border)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${progress}%`,
                  height: "100%",
                  backgroundColor: "var(--color-text-dim)",
                  transition: "width 100ms linear",
                }}
              />
            </div>
            <span
              className="font-mono uppercase"
              style={{
                fontSize: "11px",
                color: "var(--color-text-ghost)",
              }}
            >
              {direction === "next"
                ? nextProject?.title
                : prevProject?.title}
            </span>
          </div>
        </div>
      )}

      {/* ── Mobile nav buttons (< 768px) ── */}
      <div
        className="md:hidden padding-x-1 pb-8 flex justify-between"
      >
        {prevProject && (
          <a
            href={`/work/${prevProject.id}`}
            className="font-mono uppercase"
            style={{
              fontSize: "11px",
              color: "var(--color-text-dim)",
              letterSpacing: "0.08em",
            }}
          >
            ← {prevProject.title}
          </a>
        )}
        {nextProject && (
          <a
            href={`/work/${nextProject.id}`}
            className="font-mono uppercase ml-auto"
            style={{
              fontSize: "11px",
              color: "var(--color-text-dim)",
              letterSpacing: "0.08em",
            }}
          >
            {nextProject.title} →
          </a>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

- [ ] **Step 3: Visual check in dev**

```bash
npm run dev
```

Navigate to a project from the homepage. Verify:
- Narrow content column (~57vw), offset left (~16.5vw)
- 11px mono text throughout — title same size as metadata
- Media blocks reveal on scroll (opacity + y translate)
- Scroll progress percentage in bottom-right
- Scrolling past bottom/top boundary shows progress bar → navigates to next/prev project
- Escape key returns to homepage

- [ ] **Step 4: Commit**

```bash
git add src/app/work/[slug]/page.tsx
git commit -m "feat: rewrite case study page — cathydolle-faithful layout with scroll-to-navigate"
```

---

### Task 15: Update GlobalNav — hide on homepage

**Files:**
- Modify: `src/components/GlobalNav.tsx:19` (add pathname check)

- [ ] **Step 1: Add homepage detection**

At the top of the `GlobalNav` component function, add:

```tsx
const pathname = usePathname();

// Don't render on homepage — homepage has its own header
if (pathname === "/") return null;
```

Import `usePathname` is already present (line 4). The existing `MobileMenu` render can stay — it will only show when GlobalNav is rendered (non-homepage pages).

- [ ] **Step 2: Remove hero-based scroll trigger logic**

The current GlobalNav hides itself until scrolling past the `#hero` element. Since the GlobalNav no longer renders on the homepage at all, remove the `heroTrigger` ScrollTrigger. Keep only the direction-based show/hide for case study pages:

Replace the scroll show/hide `useEffect` (lines 43-90) with:

```tsx
useEffect(() => {
  if (!navRef.current) return;

  const nav = navRef.current;

  // Start visible on non-homepage pages
  gsap.set(nav, { y: 0, opacity: 1 });

  // Direction-based show/hide
  const directionTrigger = ScrollTrigger.create({
    trigger: document.body,
    start: "top top",
    end: "bottom bottom",
    onUpdate: (self) => {
      if (self.direction === 1) {
        gsap.to(nav, { y: -100, opacity: 0, duration: 0.3, ease: "power2.in", overwrite: true });
      } else {
        gsap.to(nav, { y: 0, opacity: 1, duration: 0.3, ease: "power3.out", overwrite: true });
      }
    },
  });

  return () => {
    directionTrigger.kill();
  };
}, []);
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

- [ ] **Step 4: Commit**

```bash
git add src/components/GlobalNav.tsx
git commit -m "refactor: GlobalNav hidden on homepage, simplified scroll-direction show/hide"
```

---

### Task 16: Final build verification & cleanup

- [ ] **Step 1: Full build check**

```bash
npm run build
```

Expected: Build succeeds with no errors.

- [ ] **Step 2: Check for any remaining references to deleted files**

```bash
grep -r "Cursor\|ScrollProgress\|WorksGallery\|ProjectCover\|VideoShowcase\|GutPunchCloser\|SequentialVideo" src/ --include="*.tsx" --include="*.ts" -l
```

Expected: No matches (all imports cleaned).

- [ ] **Step 3: Check for any unused imports**

```bash
npm run lint
```

Fix any lint errors.

- [ ] **Step 4: Visual smoke test**

```bash
npm run dev
```

Verify end-to-end flow:
1. Homepage loads with preloader (first visit)
2. Second visit skips preloader (sessionStorage)
3. List view shows numbered project rows
4. Slider toggle works, drag-to-scroll works
5. Clicking a project triggers page transition
6. Case study page renders with offset column layout
7. Media reveals on scroll
8. Scroll progress percentage updates
9. Scroll-to-navigate at boundaries works
10. GlobalNav visible on case study, hidden on homepage
11. Escape key returns to homepage
12. Mobile: nav buttons instead of scroll-to-navigate

- [ ] **Step 5: Commit any remaining fixes**

```bash
git add -A
git commit -m "chore: final cleanup and verification"
```

---

## Summary

| Chunk | Tasks | Commits |
|---|---|---|
| 1: Cleanup & Foundation | Tasks 1-7 | 7 commits |
| 2: Homepage | Tasks 8-10 | 4 commits |
| 3: Preloader & Transitions | Tasks 11-12 | 2 commits |
| 4: Case Study & Navigation | Tasks 13-16 | 4 commits |
| **Total** | **16 tasks** | **~17 commits** |
