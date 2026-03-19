# Cinematic Redesign Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform hkjstudio.com from a warm light editorial portfolio into a cinematic dark portfolio with a Cathydolle-style List/Slider homepage, cool atmospheric palette, and layered registers (cinematic homepage + professional inner pages).

**Architecture:** Full palette swap in CSS variables, remove time-based theming system, replace dictionary Hero with two new homepage modes (List + Slider) sharing a chrome layer, upgrade page transitions to cinematic quality, and update all inner pages to the new dark palette.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS v4, GSAP + Framer Motion, Lenis, Zustand, HTML5 Video

**Spec:** `docs/superpowers/specs/2026-03-19-cinematic-redesign-design.md`

---

## File Map

### New Files
| File | Responsibility |
|------|---------------|
| `src/components/homepage/ViewToggle.tsx` | List/Slider toggle control |
| `src/components/homepage/HomepageChrome.tsx` | Shared chrome: wordmark, nav links, email, toggle, counter |
| `src/components/homepage/HomepageList.tsx` | List mode: project rows with hover fade |
| `src/components/homepage/HomepageSlider.tsx` | Slider mode: video/poster card carousel |
| `src/components/homepage/VideoCard.tsx` | Single project card: video, poster, or gradient fallback |
| `src/components/Preloader.tsx` | Minimal "hkj" wordmark fade preloader |
| `src/app/works/page.tsx` | Rewritten as 301 redirect to `/` |

### Modified Files
| File | Changes |
|------|---------|
| `src/app/globals.css` | Full palette swap, remove time themes, update grain |
| `src/lib/store.ts` | Remove time state, add viewMode + activeProjectIndex + isLoaded |
| `src/constants/navigation.ts` | Remove "Work" link, rename "Coddiwompling" → "Coddiwomple" |
| `src/app/layout.tsx` | Remove TimeProvider, add Preloader |
| `src/app/page.tsx` | Replace Hero with homepage components |
| `src/components/GlobalNav.tsx` | Remove PixelArt, remove "Menu" button, hide on homepage |
| `src/components/MobileMenu.tsx` | Fix z-index from z-[60] to z-[9500] |
| `src/components/PageTransition.tsx` | Enhanced cinematic overlay + reduced-motion |
| `src/app/about/page.tsx` | Inline color adjustments (minimal, most via CSS vars) |
| `src/app/coddiwomple/page.tsx` | Fix opacity:0 accessibility bug |
| `src/app/work/[slug]/page.tsx` | Fix Escape key → `/` instead of `/works` |
| `src/app/not-found.tsx` | Palette update (uses CSS vars, minimal changes) |
| `src/app/opengraph-image.tsx` | Update hardcoded colors |

### Deleted Files
| File | Reason |
|------|--------|
| `src/components/TimeProvider.tsx` | Time-based theming removed |
| `src/components/PixelArt.tsx` | Tied to time theming |
| `src/components/ProjectCover.tsx` | Replaced by VideoCard |
| `src/components/sections/Hero.tsx` | Replaced by homepage components |
| `src/components/sections/WorkIndex.tsx` | Absorbed into HomepageList |
| `src/lib/time.ts` | Time utilities no longer needed |

> **Note:** `StudioPreloader` was already deleted in a prior session and is not on disk. No action needed for it.

---

## Chunk 1: Foundation — Palette, Store, Cleanup

### Task 1: Swap globals.css palette

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Replace `:root` color tokens (lines 25–47)**

Replace the entire Light Warm Palette block and Ink scale with:

```css
/* ── Ink Opacity Scale ── */
--ink: 212, 208, 202;
--ink-primary: rgba(var(--ink), 0.85);
--ink-secondary: rgba(var(--ink), 0.55);
--ink-muted: rgba(var(--ink), 0.38);
--ink-faint: rgba(var(--ink), 0.22);
--ink-ghost: rgba(var(--ink), 0.12);
--ink-whisper: rgba(var(--ink), 0.06);

/* ── Cool Atmospheric Palette ── */
--color-bg: #0C0D10;
--color-bg-rgb: 12, 13, 16;
--color-surface: #141619;
--color-elevated: #1A1E26;
--color-border: rgba(var(--color-text-rgb), 0.06);
--color-border-strong: rgba(var(--color-text-rgb), 0.12);
--color-text: #D4D0CA;
--color-text-rgb: 212, 208, 202;
--color-text-secondary: #8A8580;
--color-text-dim: #555250;
--color-text-ghost: #333130;
--color-accent: #8BA4B8;
--color-warm: #B89A78;
```

Note: `--color-accent-2` renamed to `--color-warm`. `--color-ink` removed. `--color-elevated` is a new token.

- [ ] **Step 2: Delete time-aware palette blocks (lines 65–117)**

Remove everything from `/* ── Time-Aware Palettes ── */` through the grain opacity adjustments for dawn/dusk/night.

- [ ] **Step 3: Update grain overlay (lines 194–205)**

Change `.noise-grain::before`:
```css
.noise-grain::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image: url('/assets/grain-200x200.png');
  background-repeat: repeat;
  background-size: 200px 200px;
  opacity: 0.03;
  pointer-events: none;
  z-index: 100;
  mix-blend-mode: screen;
}
```

Note: z-index changes from 1 to 100. `mix-blend-mode` changes from `multiply` to `screen` for dark backgrounds. This means MobileMenu (currently z-[60]) will be invisible behind the grain — this is fixed in Task 3.

- [ ] **Step 4: Update cover grain for dark theme (lines 207–224)**

Replace the cover-grain rules (remove the night-specific override since the base is now dark):
```css
.cover-grain::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url('/assets/grain-200x200.png');
  background-repeat: repeat;
  background-size: 200px 200px;
  opacity: 0.06;
  mix-blend-mode: screen;
  pointer-events: none;
}
```

- [ ] **Step 5: Remove body background transition (line 132)**

Remove the `transition: background-color 2s ease, color 1.5s ease;` property entirely from body (no more theme transitions).

- [ ] **Step 6: Update file header comment (lines 3–9)**

```css
/**
 * HKJ — Cool Atmospheric Dark
 *
 * Type: GT Alpina (display) + Söhne (body) + JetBrains Mono (metadata)
 * Palette: Cool dark base, warm off-white text, steel-blue accent
 * Motion: GSAP (ScrollTrigger) + Framer Motion (AnimatePresence, layoutId, drag)
 */
```

- [ ] **Step 7: Verify dev server renders dark background**

Run: `npm run dev` (should already be running on port 3001)
Open http://localhost:3001 — page should have `#0C0D10` dark background with light text.

- [ ] **Step 8: Commit**

```bash
git add src/app/globals.css
git commit -m "feat: swap palette to cool atmospheric dark theme

Replace warm light editorial palette with cool dark cinematic.
Remove time-based theme variants. Update grain overlay for dark bg."
```

---

### Task 2: Clean up store, remove time system, fix MobileMenu z-index

> **Important:** This task combines store rewrite, TimeProvider/PixelArt deletion, layout update, and MobileMenu z-index fix into a single atomic commit. The intermediate state where `store.ts` removes TimePeriod but TimeProvider still imports it would break the build if committed separately.

**Files:**
- Modify: `src/lib/store.ts`
- Modify: `src/app/layout.tsx`
- Modify: `src/components/GlobalNav.tsx`
- Modify: `src/components/MobileMenu.tsx` (line 96: z-[60] → z-[9500])
- Delete: `src/lib/time.ts`
- Delete: `src/components/TimeProvider.tsx`
- Delete: `src/components/PixelArt.tsx`

- [ ] **Step 1: Rewrite store.ts**

Replace entire file with:

```ts
import { create } from "zustand";

interface StudioState {
  /** Whether the initial preloader has played */
  isLoaded: boolean;
  setIsLoaded: (v: boolean) => void;

  /** Whether the mobile menu is open */
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (v: boolean) => void;

  /** Homepage view mode */
  viewMode: "list" | "slider";
  setViewMode: (v: "list" | "slider") => void;

  /** Active project index in slider mode */
  activeProjectIndex: number;
  setActiveProjectIndex: (v: number) => void;

  /** Page transition state */
  isTransitioning: boolean;
  pendingRoute: string | null;
  startTransition: (route: string) => void;
  endTransition: () => void;
}

export const useStudioStore = create<StudioState>((set) => ({
  isLoaded: false,
  setIsLoaded: (v) => set({ isLoaded: v }),

  mobileMenuOpen: false,
  setMobileMenuOpen: (v) => set({ mobileMenuOpen: v }),

  viewMode: "list",
  setViewMode: (v) => set({ viewMode: v }),

  activeProjectIndex: 0,
  setActiveProjectIndex: (v) => set({ activeProjectIndex: v }),

  isTransitioning: false,
  pendingRoute: null,
  startTransition: (route) =>
    set({ isTransitioning: true, pendingRoute: route }),
  endTransition: () =>
    set({ isTransitioning: false, pendingRoute: null }),
}));
```

- [ ] **Step 2: Update layout.tsx — remove TimeProvider**

In `src/app/layout.tsx`:
- Remove line 8: `import TimeProvider from "@/components/TimeProvider";`
- Remove line 80: `<TimeProvider />`

- [ ] **Step 3: Update GlobalNav.tsx — remove PixelArt**

In `src/components/GlobalNav.tsx`:
- Remove the PixelArt import (search for `import PixelArt`)
- Remove the `<PixelArt />` JSX usage
- Replace the left section with just the "hkj" text link (keep TransitionLink to "/")
- Remove the `useStudioStore` import of `timePeriod`/`timeOverride` if present
- Remove the redundant desktop "Menu" button (the one without responsive hiding classes)
- Update z-index: change `z-50` to `z-[500]` on the `<nav>` element (currently line 77). The spec's z-index table requires GlobalNav at 500, above the grain overlay at 100.

- [ ] **Step 4: Fix MobileMenu z-index**

In `src/components/MobileMenu.tsx`, line 96: change `z-[60]` to `z-[9500]`.

This is critical: the grain overlay is now z-index 100 (changed in Task 1), so MobileMenu at z-[60] would render behind it and be invisible.

- [ ] **Step 5: Delete removed files**

```bash
rm -f src/components/TimeProvider.tsx
rm -f src/components/PixelArt.tsx
rm -f src/lib/time.ts
```

- [ ] **Step 6: Verify dev server compiles cleanly**

Check terminal — no more import errors for TimeProvider, PixelArt, time.ts, or TimePeriod type.

- [ ] **Step 7: Commit**

```bash
git rm src/components/TimeProvider.tsx src/components/PixelArt.tsx src/lib/time.ts
git add src/lib/store.ts src/app/layout.tsx src/components/GlobalNav.tsx src/components/MobileMenu.tsx
git commit -m "refactor: remove time-based theming system, update store

Delete TimeProvider, PixelArt, time.ts. Rewrite store for cinematic
redesign (viewMode, activeProjectIndex, isLoaded). Fix MobileMenu
z-index from 60 to 9500 (above grain overlay at z-100)."
```

---

### Task 3: Update navigation constants

**Files:**
- Modify: `src/constants/navigation.ts`

- [ ] **Step 1: Rewrite navigation.ts**

```ts
export interface NavLink {
  label: string;
  href: string;
}

export const NAV_LINKS: NavLink[] = [
  { label: "About", href: "/about" },
  { label: "Coddiwomple", href: "/coddiwomple" },
];

export const MENU_LINKS: NavLink[] = [
  { label: "About", href: "/about" },
  { label: "Coddiwomple", href: "/coddiwomple" },
];
```

- [ ] **Step 2: Commit**

```bash
git add src/constants/navigation.ts
git commit -m "refactor: update nav links for cinematic redesign

Remove Work link (homepage is now the project index).
Rename Coddiwompling to Coddiwomple to match route."
```

---

## Chunk 2: Homepage — Chrome, List Mode, Toggle

### Task 4: Create ViewToggle

> **Important:** ViewToggle must be created BEFORE HomepageChrome, because HomepageChrome imports ViewToggle. Creating them in the wrong order would break the build at the HomepageChrome commit.

**Files:**
- Create: `src/components/homepage/ViewToggle.tsx`

- [ ] **Step 1: Create the homepage directory**

```bash
mkdir -p src/components/homepage
```

- [ ] **Step 2: Write ViewToggle component**

```tsx
"use client";

import { useStudioStore } from "@/lib/store";

export default function ViewToggle() {
  const viewMode = useStudioStore((s) => s.viewMode);
  const setViewMode = useStudioStore((s) => s.setViewMode);

  return (
    <div
      className="flex gap-3 font-mono uppercase tracking-[0.1em]"
      style={{ fontSize: "var(--text-micro)" }}
      role="tablist"
      aria-label="View mode"
    >
      <button
        role="tab"
        aria-selected={viewMode === "list"}
        onClick={() => setViewMode("list")}
        className="transition-opacity duration-200"
        style={{
          color: viewMode === "list"
            ? "var(--color-text-secondary)"
            : "var(--color-text-ghost)",
          opacity: viewMode === "list" ? 1 : 0.6,
        }}
      >
        List
      </button>
      <button
        role="tab"
        aria-selected={viewMode === "slider"}
        onClick={() => setViewMode("slider")}
        className="transition-opacity duration-200"
        style={{
          color: viewMode === "slider"
            ? "var(--color-text-secondary)"
            : "var(--color-text-ghost)",
          opacity: viewMode === "slider" ? 1 : 0.6,
        }}
      >
        Slider
      </button>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/homepage/ViewToggle.tsx
git commit -m "feat: add ViewToggle component

List/Slider toggle with role=tablist for accessibility.
Wired to Zustand viewMode state."
```

---

### Task 5: Create HomepageChrome

**Files:**
- Create: `src/components/homepage/HomepageChrome.tsx`

- [ ] **Step 1: Write HomepageChrome component**

> **Responsive behavior:** Desktop shows bottom bar as a single row (email left, counter/toggle right). Mobile (<768px) stacks the bottom bar: email on first line, toggle + location on second line. This uses a `md:` breakpoint.

```tsx
"use client";

import { useStudioStore } from "@/lib/store";
import { NAV_LINKS } from "@/constants/navigation";
import { CONTACT_EMAIL } from "@/constants/contact";
import TransitionLink from "@/components/TransitionLink";
import ViewToggle from "@/components/homepage/ViewToggle";
import { PROJECTS } from "@/constants/projects";

const activeProjects = PROJECTS.filter((p) => !p.wip);

export default function HomepageChrome() {
  const viewMode = useStudioStore((s) => s.viewMode);
  const activeProjectIndex = useStudioStore((s) => s.activeProjectIndex);

  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 200, padding: "var(--page-px)" }}
    >
      {/* Top bar */}
      <div className="flex justify-between items-start pointer-events-auto">
        {/* Wordmark */}
        <TransitionLink
          href="/"
          className="font-mono uppercase tracking-[0.1em] transition-opacity duration-200 hover:opacity-70"
          style={{
            fontSize: "var(--text-micro)",
            color: "var(--color-text-dim)",
          }}
        >
          hkj
        </TransitionLink>

        {/* Nav links — hidden on mobile, MobileMenu handles it */}
        <nav className="hidden md:flex gap-6" aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <TransitionLink
              key={link.href}
              href={link.href}
              className="font-mono uppercase tracking-[0.1em] transition-opacity duration-200 hover:opacity-70"
              style={{
                fontSize: "var(--text-micro)",
                color: "var(--color-text-dim)",
              }}
            >
              {link.label}
            </TransitionLink>
          ))}
        </nav>

        {/* Mobile hamburger — triggers MobileMenu */}
        <button
          className="md:hidden font-mono uppercase tracking-[0.1em] transition-opacity duration-200 hover:opacity-70"
          style={{ fontSize: "var(--text-micro)", color: "var(--color-text-dim)" }}
          onClick={() => useStudioStore.getState().setMobileMenuOpen(true)}
          aria-label="Open menu"
        >
          Menu
        </button>
      </div>

      {/* Bottom bar — desktop: single row; mobile: stacked */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-auto"
        style={{ padding: "var(--page-px)" }}
      >
        {/* Desktop bottom bar */}
        <div className="hidden md:flex justify-between items-end">
          {/* Email */}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="font-display italic transition-opacity duration-200 hover:opacity-70"
            style={{
              fontSize: "var(--text-small)",
              color: "var(--color-text-dim)",
            }}
          >
            {CONTACT_EMAIL}
          </a>

          {/* Right: counter or location + toggle */}
          <div className="flex items-end gap-8">
            {viewMode === "slider" ? (
              <span
                className="font-mono uppercase tracking-[0.1em]"
                style={{
                  fontSize: "var(--text-micro)",
                  color: "var(--color-text-ghost)",
                }}
              >
                {String(activeProjectIndex + 1).padStart(2, "0")} /{" "}
                {String(activeProjects.length).padStart(2, "0")}
              </span>
            ) : (
              <span
                className="font-mono uppercase tracking-[0.1em]"
                style={{
                  fontSize: "var(--text-micro)",
                  color: "var(--color-text-ghost)",
                }}
              >
                NYC
              </span>
            )}
            <ViewToggle />
          </div>
        </div>

        {/* Mobile bottom bar — stacked */}
        <div className="flex md:hidden flex-col gap-3">
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="font-display italic transition-opacity duration-200 hover:opacity-70"
            style={{
              fontSize: "var(--text-small)",
              color: "var(--color-text-dim)",
            }}
          >
            {CONTACT_EMAIL}
          </a>
          <div className="flex justify-between items-end">
            {viewMode === "slider" ? (
              <span
                className="font-mono uppercase tracking-[0.1em]"
                style={{
                  fontSize: "var(--text-micro)",
                  color: "var(--color-text-ghost)",
                }}
              >
                {String(activeProjectIndex + 1).padStart(2, "0")} /{" "}
                {String(activeProjects.length).padStart(2, "0")}
              </span>
            ) : (
              <span
                className="font-mono uppercase tracking-[0.1em]"
                style={{
                  fontSize: "var(--text-micro)",
                  color: "var(--color-text-ghost)",
                }}
              >
                NYC
              </span>
            )}
            <ViewToggle />
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify file created**

```bash
ls src/components/homepage/HomepageChrome.tsx
```

- [ ] **Step 3: Commit**

```bash
git add src/components/homepage/HomepageChrome.tsx
git commit -m "feat: add HomepageChrome component

Shared chrome layer for homepage: wordmark, nav links, email,
counter/location, and ViewToggle slot. z-index 200.
Responsive: desktop row bottom bar, mobile stacked."
```

---

### Task 6: Create HomepageList

**Files:**
- Create: `src/components/homepage/HomepageList.tsx`

- [ ] **Step 1: Write HomepageList component**

> **AnimatePresence integration:** This component is wrapped in `motion.div` with `initial`, `animate`, and `exit` props so AnimatePresence can manage transitions between List and Slider modes.

```tsx
"use client";

import { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { PROJECTS } from "@/constants/projects";
import TransitionLink from "@/components/TransitionLink";

const activeProjects = PROJECTS.filter((p) => !p.wip);

export default function HomepageList() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = useCallback((i: number) => setHoveredIndex(i), []);
  const handleMouseLeave = useCallback(() => setHoveredIndex(null), []);

  return (
    <motion.div
      ref={listRef}
      className="flex flex-col justify-center items-center"
      style={{
        height: "100dvh",
        padding: "var(--page-px)",
        paddingTop: "80px",
        paddingBottom: "80px",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="w-full max-w-[900px] flex flex-col" style={{ gap: "28px" }}>
        {activeProjects.map((project, i) => {
          const isHovered = hoveredIndex === i;
          const isFaded = hoveredIndex !== null && !isHovered;

          return (
            <TransitionLink
              key={project.id}
              href={`/work/${project.id}`}
              aria-label={`Project ${i + 1}: ${project.title}, ${project.year}`}
              className="flex justify-between items-baseline font-mono uppercase tracking-[0.05em] transition-opacity"
              style={{
                fontSize: "var(--text-micro)",
                color: "var(--color-text)",
                opacity: isFaded ? 0.3 : 1,
                transitionDuration: "200ms",
                transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
              }}
              onMouseEnter={() => handleMouseEnter(i)}
              onMouseLeave={handleMouseLeave}
            >
              {/* Left: number + title */}
              <span className="flex gap-4">
                <span
                  className="inline-block"
                  style={{
                    width: "2ch",
                    color: "var(--color-text-ghost)",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{project.title}</span>
              </span>

              {/* Right: sector + year */}
              <span className="flex gap-6">
                <span
                  className="hidden md:inline"
                  style={{ color: "var(--color-text-ghost)" }}
                >
                  {project.tags.slice(0, 2).join(" · ")}
                </span>
                <span style={{ color: "var(--color-text-ghost)" }}>
                  {project.year}
                </span>
              </span>
            </TransitionLink>
          );
        })}
      </div>
    </motion.div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/homepage/HomepageList.tsx
git commit -m "feat: add HomepageList component

Full-viewport project list with hover fade effect.
Cathydolle-style: mono uppercase, opacity interactions.
Wrapped in motion.div for AnimatePresence transitions."
```

---

### Task 7: Wire homepage with List mode

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/components/GlobalNav.tsx`

- [ ] **Step 1: Rewrite page.tsx**

> **AnimatePresence mode="wait":** Wrapping list/slider in AnimatePresence ensures smooth dissolve transitions between modes. The `key` prop tells AnimatePresence these are different components to animate between.

```tsx
"use client";

import { AnimatePresence } from "framer-motion";
import { useStudioStore } from "@/lib/store";
import HomepageChrome from "@/components/homepage/HomepageChrome";
import HomepageList from "@/components/homepage/HomepageList";

export default function Home() {
  const viewMode = useStudioStore((s) => s.viewMode);

  return (
    <main style={{ height: "100dvh", overflow: "hidden" }}>
      <HomepageChrome />
      <AnimatePresence mode="wait">
        {viewMode === "list" && <HomepageList key="list" />}
        {/* Slider mode added in next chunk */}
      </AnimatePresence>
    </main>
  );
}
```

- [ ] **Step 2: Hide GlobalNav on homepage**

In `src/components/GlobalNav.tsx`, add homepage detection at the top of the component function:

```tsx
import { usePathname } from "next/navigation";
// ... inside the component:
const pathname = usePathname();
const isHome = pathname === "/";

// Early return — homepage has its own chrome (HomepageChrome)
// Only render MobileMenu on homepage (for hamburger access)
if (isHome) {
  return <MobileMenu />;
}
```

This prevents GlobalNav from overlapping HomepageChrome's z-200 layer. The MobileMenu is still rendered so mobile users can access the hamburger.

- [ ] **Step 3: Verify homepage renders list mode**

Open http://localhost:3001 — should see dark background with project list, chrome elements (wordmark, nav, email, toggle), and hover fade working. GlobalNav should NOT be visible on the homepage.

- [ ] **Step 4: Commit**

```bash
git add src/app/page.tsx src/components/GlobalNav.tsx
git commit -m "feat: wire homepage with List mode and chrome

Replace Hero component with HomepageChrome + HomepageList.
Full-viewport, no-scroll homepage with project index.
Hide GlobalNav on homepage (HomepageChrome provides its own)."
```

---

## Chunk 3: Slider Mode

### Task 8: Create VideoCard

**Files:**
- Create: `src/components/homepage/VideoCard.tsx`

- [ ] **Step 1: Write VideoCard component**

```tsx
"use client";

import { useRef, useEffect } from "react";
import type { Project } from "@/constants/projects";

interface VideoCardProps {
  project: Project;
  index: number;
  isActive: boolean;
}

export default function VideoCard({ project, index, isActive }: VideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;
    if (isActive) {
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
    }
  }, [isActive]);

  const hasVideo = !!project.cardVideo;
  const hasImage = !!project.image;

  return (
    <div
      className="relative flex flex-col justify-end"
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "var(--color-surface)",
        padding: "var(--page-px)",
      }}
      aria-label={`Project ${index + 1}: ${project.title}, ${project.tags.slice(0, 2).join(" and ")}, ${project.year}`}
    >
      {/* Media area — letterboxed center */}
      <div
        className="absolute inset-0 flex items-center justify-center overflow-hidden"
        style={{ padding: "clamp(2rem, 6vh, 5rem) var(--page-px)" }}
      >
        {hasVideo ? (
          <video
            ref={videoRef}
            src={project.cardVideo}
            muted
            loop
            playsInline
            preload={isActive ? "auto" : "none"}
            poster={project.image || undefined}
            className="w-full h-full object-cover"
            style={{ aspectRatio: "16/9", maxHeight: "60vh", borderRadius: "2px" }}
            aria-hidden="true"
          />
        ) : hasImage ? (
          <img
            src={project.image}
            alt=""
            className="w-full h-full object-cover"
            style={{ aspectRatio: "16/9", maxHeight: "60vh", borderRadius: "2px" }}
            aria-hidden="true"
          />
        ) : (
          /* Gradient fallback */
          <div
            className="w-full flex items-center justify-center"
            style={{
              aspectRatio: "16/9",
              maxHeight: "60vh",
              backgroundColor: project.cover.bg,
              borderRadius: "2px",
            }}
          >
            <span
              className="font-display italic"
              style={{
                fontSize: "var(--text-display)",
                color: project.cover.text,
                opacity: 0.6,
              }}
            >
              {project.title}
            </span>
          </div>
        )}
      </div>

      {/* Metadata overlay — bottom */}
      <div className="relative z-10 mt-auto" style={{ paddingBottom: "24px" }}>
        <span
          className="font-mono uppercase tracking-[0.1em] block"
          style={{
            fontSize: "var(--text-micro)",
            color: "var(--color-text-ghost)",
            marginBottom: "8px",
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <h2
          className="font-display italic"
          style={{
            fontSize: "var(--text-display)",
            color: "var(--color-text)",
            lineHeight: 1.1,
            marginBottom: "8px",
          }}
        >
          {project.title}
        </h2>
        <div className="flex justify-between items-baseline">
          <span
            className="font-mono uppercase tracking-[0.1em]"
            style={{
              fontSize: "var(--text-micro)",
              color: "var(--color-text-ghost)",
            }}
          >
            {project.tags.slice(0, 2).join(" · ")}
          </span>
          <span
            className="font-mono uppercase tracking-[0.1em]"
            style={{
              fontSize: "var(--text-micro)",
              color: "var(--color-text-ghost)",
            }}
          >
            {project.year}
          </span>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/homepage/VideoCard.tsx
git commit -m "feat: add VideoCard component

Project card with 3-tier fallback: video > image > gradient.
Plays/pauses video based on isActive prop."
```

---

### Task 9: Create HomepageSlider

**Files:**
- Create: `src/components/homepage/HomepageSlider.tsx`

- [ ] **Step 1: Write HomepageSlider component**

> **SSR safety:** `window.innerWidth` is not available during SSR. The component uses `useState` + `useEffect` to safely read window dimensions client-side and update on resize. The `cardWidth` and `peek` values default to safe fallbacks until hydrated.

> **Responsive PEEK:** Desktop 60px, tablet 40px, mobile 0px (full-width cards).

```tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import { useStudioStore } from "@/lib/store";
import { PROJECTS } from "@/constants/projects";
import TransitionLink from "@/components/TransitionLink";
import VideoCard from "@/components/homepage/VideoCard";

const activeProjects = PROJECTS.filter((p) => !p.wip);

/** Responsive peek: 60px desktop, 40px tablet, 0px mobile */
function getPeek(width: number): number {
  if (width < 768) return 0;
  if (width < 1024) return 40;
  return 60;
}

export default function HomepageSlider() {
  const activeIndex = useStudioStore((s) => s.activeProjectIndex);
  const setActiveIndex = useStudioStore((s) => s.setActiveProjectIndex);

  // SSR-safe window dimensions
  const [windowWidth, setWindowWidth] = useState(1200); // safe default
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    setHydrated(true);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const peek = getPeek(windowWidth);
  const cardWidth = windowWidth - peek;

  const x = useMotionValue(0);

  const goTo = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(index, activeProjects.length - 1));
      setActiveIndex(clamped);
      animate(x, -clamped * cardWidth, {
        type: "tween",
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
      });
    },
    [setActiveIndex, x, cardWidth]
  );

  // Snap to current index when window resizes
  useEffect(() => {
    if (hydrated) {
      animate(x, -activeIndex * cardWidth, { duration: 0 });
    }
  }, [cardWidth, activeIndex, x, hydrated]);

  const handleDragEnd = useCallback(
    (_: any, info: { offset: { x: number }; velocity: { x: number } }) => {
      const swipe = info.offset.x;
      const velocity = info.velocity.x;
      if (swipe < -50 || velocity < -500) {
        goTo(activeIndex + 1);
      } else if (swipe > 50 || velocity > 500) {
        goTo(activeIndex - 1);
      } else {
        goTo(activeIndex);
      }
    },
    [activeIndex, goTo]
  );

  // Arrow key navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goTo(activeIndex + 1);
      if (e.key === "ArrowLeft") goTo(activeIndex - 1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, goTo]);

  return (
    <motion.div
      className="relative overflow-hidden"
      style={{ height: "100dvh", cursor: "grab" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        className="flex h-full"
        style={{ x }}
        drag="x"
        dragConstraints={{
          left: -(activeProjects.length - 1) * cardWidth,
          right: 0,
        }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
      >
        {activeProjects.map((project, i) => (
          <TransitionLink
            key={project.id}
            href={`/work/${project.id}`}
            className="block flex-shrink-0 h-full"
            style={{ width: `${cardWidth}px` }}
            draggable={false}
          >
            <VideoCard
              project={project}
              index={i}
              isActive={i === activeIndex}
            />
          </TransitionLink>
        ))}
        {/* Spacer for last card peek */}
        {peek > 0 && (
          <div className="flex-shrink-0" style={{ width: `${peek}px` }} />
        )}
      </motion.div>
    </motion.div>
  );
}
```

- [ ] **Step 2: Update page.tsx to include slider**

In `src/app/page.tsx`, add the slider import and render:

```tsx
"use client";

import { AnimatePresence } from "framer-motion";
import { useStudioStore } from "@/lib/store";
import HomepageChrome from "@/components/homepage/HomepageChrome";
import HomepageList from "@/components/homepage/HomepageList";
import HomepageSlider from "@/components/homepage/HomepageSlider";

export default function Home() {
  const viewMode = useStudioStore((s) => s.viewMode);

  return (
    <main style={{ height: "100dvh", overflow: "hidden" }}>
      <HomepageChrome />
      <AnimatePresence mode="wait">
        {viewMode === "list" && <HomepageList key="list" />}
        {viewMode === "slider" && <HomepageSlider key="slider" />}
      </AnimatePresence>
    </main>
  );
}
```

- [ ] **Step 3: Verify both modes work**

Open http://localhost:3001:
- List mode: project rows with hover fade. Click "Slider" toggle.
- Slider mode: cards with drag/swipe. Arrow keys work. Click "List" toggle to go back.
- Mode transitions: dissolve/fade between list and slider (AnimatePresence mode="wait").
- GYEOL card should show video (if asset exists), others show fallback.
- Mobile (DevTools 390px): no peek, full-width cards, stacked bottom bar.

- [ ] **Step 4: Commit**

```bash
git add src/components/homepage/HomepageSlider.tsx src/app/page.tsx
git commit -m "feat: add HomepageSlider with drag/swipe navigation

Cinematic video card carousel with Framer Motion drag.
Arrow keys, velocity-based swipe, responsive peek (60/40/0px).
SSR-safe window dimensions. AnimatePresence mode transitions."
```

---

## Chunk 4: Transitions, Preloader, Nav Updates

### Task 10: Upgrade PageTransition

**Files:**
- Modify: `src/components/PageTransition.tsx`

- [ ] **Step 1: Rewrite PageTransition with enhanced animation**

> **z-index note:** The current PageTransition uses `zIndex: 9999`. This changes to `9000` to match the spec's z-index hierarchy (Section 14). The Preloader (z-9999, added in Task 11) is the only element above the transition overlay.

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useStudioStore } from "@/lib/store";

export default function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const { isTransitioning, pendingRoute, endTransition } = useStudioStore();
  const [phase, setPhase] = useState<"idle" | "entering" | "exiting">("idle");
  const prevPathname = useRef(pathname);

  // Check reduced motion preference (SSR-safe)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  useEffect(() => {
    setPrefersReducedMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }, []);

  // Phase 1: Overlay enters
  useEffect(() => {
    if (isTransitioning && pendingRoute) {
      if (prefersReducedMotion) {
        router.push(pendingRoute);
        return;
      }
      setPhase("entering");
      const timer = setTimeout(() => {
        router.push(pendingRoute);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning, pendingRoute, router, prefersReducedMotion]);

  // Phase 2: Route changed, overlay exits
  useEffect(() => {
    if (pathname !== prevPathname.current) {
      prevPathname.current = pathname;
      if (isTransitioning) {
        if (prefersReducedMotion) {
          endTransition();
          return;
        }
        setPhase("exiting");
        const timer = setTimeout(() => {
          setPhase("idle");
          endTransition();
        }, 600);
        return () => clearTimeout(timer);
      }
    }
  }, [pathname, isTransitioning, endTransition, prefersReducedMotion]);

  if (phase === "idle" && !isTransitioning) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9000,
        backgroundColor: "var(--color-bg)",
        opacity: phase === "entering" ? 1 : phase === "exiting" ? 0 : 0,
        transition: `opacity 600ms cubic-bezier(0.86, 0, 0.07, 1)`,
        pointerEvents: isTransitioning ? "all" : "none",
      }}
    />
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/PageTransition.tsx
git commit -m "feat: upgrade PageTransition to cinematic quality

600ms overlay with cinematic easing. SSR-safe reduced-motion check.
z-index 9000 per spec."
```

---

### Task 11: Create Preloader

**Files:**
- Create: `src/components/Preloader.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Write Preloader component**

> **prefers-reduced-motion:** When reduced motion is preferred, skip the preloader entirely (immediately mark as loaded).

```tsx
"use client";

import { useEffect, useState } from "react";
import { useStudioStore } from "@/lib/store";

export default function Preloader() {
  const isLoaded = useStudioStore((s) => s.isLoaded);
  const setIsLoaded = useStudioStore((s) => s.setIsLoaded);
  const [phase, setPhase] = useState<"visible" | "fading" | "done">(
    isLoaded ? "done" : "visible"
  );

  // Respect prefers-reduced-motion: skip preloader entirely
  useEffect(() => {
    if (isLoaded) return;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) {
      setPhase("done");
      setIsLoaded(true);
      return;
    }
    // Hold for 0.8s, then fade out
    const holdTimer = setTimeout(() => setPhase("fading"), 800);
    return () => clearTimeout(holdTimer);
  }, [isLoaded, setIsLoaded]);

  useEffect(() => {
    if (phase === "fading") {
      const fadeTimer = setTimeout(() => {
        setPhase("done");
        setIsLoaded(true);
      }, 700);
      return () => clearTimeout(fadeTimer);
    }
  }, [phase, setIsLoaded]);

  if (phase === "done") return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        backgroundColor: "var(--color-bg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: phase === "fading" ? 0 : 1,
        transition: "opacity 700ms cubic-bezier(0.86, 0, 0.07, 1)",
        pointerEvents: phase === "fading" ? "none" : "all",
      }}
    >
      <span
        className="font-mono uppercase tracking-[0.1em]"
        style={{
          fontSize: "var(--text-micro)",
          color: "var(--color-text-dim)",
          animation: "fadeIn 600ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
        }}
      >
        hkj
      </span>
    </div>
  );
}
```

- [ ] **Step 2: Add Preloader to layout.tsx**

In `src/app/layout.tsx`, add import and render before GlobalNav:
```tsx
import Preloader from "@/components/Preloader";
```
Add `<Preloader />` after `<body>` opening tag, before `<GlobalNav />`.

- [ ] **Step 3: Verify preloader plays on first load**

Hard refresh http://localhost:3001 — should see "hkj" wordmark fade in on dark screen, hold briefly, then fade out to reveal homepage. Subsequent navigations should skip it.

- [ ] **Step 4: Commit**

```bash
git add src/components/Preloader.tsx src/app/layout.tsx
git commit -m "feat: add minimal cinematic preloader

Dark screen with 'hkj' wordmark fade-in, 0.8s hold, 0.7s fade-out.
Only plays on first visit (isLoaded in Zustand). z-index 9999.
Respects prefers-reduced-motion (skips entirely)."
```

---

## Chunk 5: Inner Pages, Redirect, Cleanup

### Task 12: Update inner pages for dark palette

**Files:**
- Modify: `src/app/about/page.tsx`
- Modify: `src/app/coddiwomple/page.tsx`
- Modify: `src/app/work/[slug]/page.tsx`
- Modify: `src/app/not-found.tsx`
- Modify: `src/app/opengraph-image.tsx`

- [ ] **Step 1: Fix Coddiwomple accessibility bug**

In `src/app/coddiwomple/page.tsx`, find the gallery items that have `style={{ opacity: 0 }}` (around line 89). Remove the inline `opacity: 0`. Instead, add a CSS class or use GSAP's `autoAlpha` which handles `visibility` + `opacity`. The simplest fix: change the GSAP `from` vars to set `autoAlpha: 0` (GSAP will set `visibility: hidden` + `opacity: 0` initially and animate to `autoAlpha: 1`).

Replace inline `opacity: 0` on the item wrapper with nothing (let it default to visible), and update the GSAP animation to use `gsap.from(el, { autoAlpha: 0, ... })` which handles the initial hidden state properly and respects reduced-motion users who don't run JS animations.

- [ ] **Step 2: Fix case study Escape key**

In `src/app/work/[slug]/page.tsx`, find the keyboard handler for Escape (search for `Escape`). Change `router.push("/works")` to `router.push("/")`.

- [ ] **Step 3: Update opengraph-image.tsx colors**

In `src/app/opengraph-image.tsx`, change:
- `backgroundColor: "#F5F2ED"` → `backgroundColor: "#0C0D10"`
- `color: "#1A1917"` → `color: "#D4D0CA"`
- `color: "#7A756D"` → `color: "#555250"`

- [ ] **Step 4: Verify inner pages render correctly on dark palette**

Open each page and verify text is readable, no invisible text, dividers visible:
- http://localhost:3001/about
- http://localhost:3001/coddiwomple
- http://localhost:3001/work/gyeol
- http://localhost:3001/404-test (for not-found)

Most pages should already look correct since they use CSS variables. The main issue would be any hardcoded colors.

- [ ] **Step 5: Commit**

```bash
git add src/app/coddiwomple/page.tsx src/app/work/[slug]/page.tsx src/app/opengraph-image.tsx
git commit -m "fix: update inner pages for dark palette

Fix Coddiwomple opacity:0 accessibility bug.
Fix case study Escape key to navigate to / instead of /works.
Update OG image hardcoded colors."
```

---

### Task 13: Add /works redirect

**Files:**
- Modify: `src/app/works/page.tsx`

- [ ] **Step 1: Rewrite works/page.tsx as redirect**

```tsx
import { redirect } from "next/navigation";

export default function WorksPage() {
  redirect("/");
}
```

- [ ] **Step 2: Verify redirect**

Navigate to http://localhost:3001/works — should immediately redirect to homepage.

- [ ] **Step 3: Commit**

```bash
git add src/app/works/page.tsx
git commit -m "feat: redirect /works to homepage

Homepage is now the project index. /works redirects for
backward compatibility."
```

---

### Task 14: Delete dead code

**Files:**
- Delete: `src/components/sections/Hero.tsx`
- Delete: `src/components/sections/WorkIndex.tsx`
- Delete: `src/components/ProjectCover.tsx`

- [ ] **Step 1: Verify nothing imports these files**

Search for imports of Hero, WorkIndex, and ProjectCover across the codebase. They should no longer be imported anywhere after previous tasks.

- [ ] **Step 2: Delete files**

```bash
rm -f src/components/sections/Hero.tsx
rm -f src/components/sections/WorkIndex.tsx
rm -f src/components/ProjectCover.tsx
```

- [ ] **Step 3: Check for empty directories**

```bash
ls src/components/sections/
```

If the `sections/` directory is now empty, remove it:
```bash
rmdir src/components/sections 2>/dev/null || true
```

- [ ] **Step 4: Verify dev server still compiles**

Check terminal for any remaining import errors.

- [ ] **Step 5: Commit**

```bash
git rm src/components/sections/Hero.tsx src/components/sections/WorkIndex.tsx src/components/ProjectCover.tsx
git commit -m "chore: remove dead components

Delete Hero (replaced by HomepageList/Slider), WorkIndex
(absorbed into HomepageList), ProjectCover (replaced by VideoCard)."
```

---

### Task 15: Final verification pass

- [ ] **Step 1: Full site walkthrough**

Test every route:
1. `/` — Homepage list mode, hover fade, toggle to slider
2. `/` slider — Drag/swipe cards, arrow keys, counter updates
3. `/` — Toggle between list and slider — dissolve transition (AnimatePresence)
4. `/work/gyeol` — Case study renders, scroll works, next project link
5. `/about` — About page renders, all text legible
6. `/coddiwomple` — Gallery loads, images visible (not hidden by opacity:0)
7. `/works` — Redirects to `/`
8. `/nonexistent` — 404 page renders
9. Browser back/forward — Transitions work

- [ ] **Step 2: Mobile check**

Use browser DevTools responsive mode (390×844):
1. Homepage list — rows stack correctly, toggle visible in stacked bottom bar
2. Homepage slider — swipe works, no peek (full width cards)
3. Nav — hamburger works, mobile menu opens/closes (z-[9500] above grain)
4. Inner pages — text legible, no horizontal overflow

- [ ] **Step 3: Keyboard navigation check**

1. Tab through homepage chrome elements
2. Arrow keys in slider mode
3. Escape from case study goes to `/`
4. ViewToggle accessible via keyboard (role=tablist)

- [ ] **Step 4: Reduced motion check**

Enable `prefers-reduced-motion: reduce` in browser DevTools:
1. Preloader skips entirely (immediate homepage)
2. Page transitions are instant (no overlay animation)
3. List/Slider toggle still works (instant swap, no dissolve)
4. Coddiwomple gallery items are visible (not hidden by opacity:0)

- [ ] **Step 5: Commit any final fixes**

```bash
git add -A
git commit -m "fix: final polish from verification pass"
```

---

## Summary

| Chunk | Tasks | What It Delivers |
|-------|-------|------------------|
| 1: Foundation | 1–3 | Dark palette, clean store, no time theming, updated nav, MobileMenu z-fix |
| 2: Homepage Chrome + List | 4–7 | Working homepage in list mode with full chrome, GlobalNav hidden on homepage |
| 3: Slider Mode | 8–9 | Video card carousel with drag/swipe/keyboard, responsive peek, AnimatePresence |
| 4: Transitions + Nav | 10–11 | Cinematic page transitions, preloader with reduced-motion, cleaned nav |
| 5: Pages + Cleanup | 12–15 | Inner pages updated, dead code removed, full verification including accessibility |

Each chunk produces a working, navigable site. No chunk leaves the site in a broken state.
