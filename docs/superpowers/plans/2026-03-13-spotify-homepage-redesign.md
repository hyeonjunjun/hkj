# Spotify-Inspired Homepage Redesign — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current homepage (HeroToGridSection/ProjectListView toggle) with a Spotify Desktop-inspired single-page app shell featuring typographic project index, Now Playing side panel, and media player bar.

**Architecture:** Single-page app shell on the homepage — three zones (nav, main content, panel) with a fixed player bar. Views (Index/Selects/Info) swap via AnimatePresence within the main content area. No page routing between views. Panel pushes content on large screens, overlays on smaller ones.

**Tech Stack:** Next.js 16, React 19, Zustand 5, Framer Motion 12, GSAP 3 + ScrollTrigger, Lenis, Tailwind CSS v4

**Spec:** `docs/superpowers/specs/2026-03-13-spotify-homepage-redesign.md`

---

## File Structure

| File | Action | Responsibility |
|------|--------|----------------|
| `src/lib/store.ts` | Modify | Add activeView, activeProject, isPanelOpen, isPlaying, playerVisible. Remove viewMode, gridRevealed. |
| `src/constants/navigation.ts` | Modify | Add view-switching link type alongside existing overlay type. Update NAV_LINKS and MENU_LINKS. |
| `src/components/StudioPreloader.tsx` | Rewrite | Typographic preloader (hkj / progress bar / loading.../ready) |
| `src/components/ProjectRow.tsx` | Create | Shared row for Index and Selects views. Renders number, title, meta, optional thumbnail. |
| `src/components/GhostRow.tsx` | Create | Redacted "in development" row. No interactivity. |
| `src/components/ProjectIndex.tsx` | Create | Hero block + list of ProjectRow/GhostRow components (Index view) |
| `src/components/ProjectSelects.tsx` | Create | Hero block + rows with thumbnails (Selects view) |
| `src/components/InfoView.tsx` | Create | Inline about + contact content (replaces AboutOverlay) |
| `src/components/NowPlayingPanel.tsx` | Create | Side panel showing project specs, "View Case Study" link |
| `src/components/PlayerBar.tsx` | Create | Fixed bottom bar: play/pause, prev/next, project title, progress |
| `src/components/AppShell.tsx` | Create | Layout orchestrator: main area + panel slot + player bar. Breakpoint-aware push/overlay. |
| `src/app/page.tsx` | Rewrite | Thin wrapper rendering AppShell |
| `src/components/GlobalNav.tsx` | Modify | Add Index/Selects/Info view links with active underline |
| `src/components/MobileMenu.tsx` | Modify | Add view links as numbered menu items |
| `src/app/layout.tsx` | Modify | Remove AboutOverlay import/render (replaced by InfoView inside AppShell) |

**Archived (not deleted, just unused):** HeroToGridSection.tsx, ProjectGridView.tsx, ProjectListView.tsx
**Removed:** ViewModeToggle.tsx, AboutOverlay.tsx

---

## Chunk 1: Foundation — Store, Constants, Preloader

### Task 1: Update Zustand Store

**Files:**
- Modify: `src/lib/store.ts`

- [ ] **Step 1: Replace store types and state**

Replace the entire contents of `src/lib/store.ts` with:

```typescript
import { create } from "zustand";

export type OverlayType = "about" | "contact" | null;
export type ActiveView = "index" | "selects" | "info";

interface StudioState {
  /** True once critical resources are loaded */
  isLoaded: boolean;
  setLoaded: (v: boolean) => void;

  /** Currently visible section for nav tracking */
  activeSection: string;
  setActiveSection: (s: string) => void;

  /** Project slug being transitioned to (for page transition) */
  transitionProject: string | null;
  setTransitionProject: (id: string | null) => void;

  /** Active full-screen overlay (contact only now — about moved to InfoView) */
  activeOverlay: OverlayType;
  setActiveOverlay: (overlay: OverlayType) => void;

  /** Current homepage view */
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;

  /** Active project id for Now Playing panel + player bar */
  activeProject: string | null;
  setActiveProject: (id: string | null) => void;

  /** Whether the Now Playing panel is open */
  isPanelOpen: boolean;
  setIsPanelOpen: (open: boolean) => void;

  /** Global video play/pause state */
  isPlaying: boolean;
  togglePlayback: () => void;

  /** Whether the player bar has been revealed */
  playerVisible: boolean;
  setPlayerVisible: (v: boolean) => void;
}

export const useStudioStore = create<StudioState>((set) => ({
  isLoaded: false,
  setLoaded: (v) => set({ isLoaded: v }),

  activeSection: "hero",
  setActiveSection: (s) => set({ activeSection: s }),

  transitionProject: null,
  setTransitionProject: (id) => set({ transitionProject: id }),

  activeOverlay: null,
  setActiveOverlay: (overlay) => set({ activeOverlay: overlay }),

  activeView: "index",
  setActiveView: (view) => set({ activeView: view }),

  activeProject: null,
  setActiveProject: (id) => set({ activeProject: id }),

  isPanelOpen: false,
  setIsPanelOpen: (open) => set({ isPanelOpen: open }),

  isPlaying: true,
  togglePlayback: () => set((s) => ({ isPlaying: !s.isPlaying })),

  playerVisible: false,
  setPlayerVisible: (v) => set({ playerVisible: v }),
}));
```

- [ ] **Step 2: Fix imports across codebase**

The removed exports `ViewMode`, `viewMode`, `setViewMode`, `gridRevealed`, `setGridRevealed` are used in:
- `src/app/page.tsx` — will be rewritten in Task 10, skip for now
- `src/components/HeroToGridSection.tsx` — being archived, skip
- `src/components/ui/ViewModeToggle.tsx` — being removed, skip

No other files import these. Verify:

Run: `grep -r "viewMode\|gridRevealed\|ViewMode" src/ --include="*.tsx" --include="*.ts" -l`

Expected: Only `page.tsx`, `store.ts`, `HeroToGridSection.tsx`, `ViewModeToggle.tsx`

- [ ] **Step 3: Commit**

```bash
git add src/lib/store.ts
git commit -m "feat(store): replace viewMode/gridRevealed with app shell state

Add activeView, activeProject, isPanelOpen, isPlaying, playerVisible.
Remove viewMode, gridRevealed, ViewMode type."
```

---

### Task 2: Update Navigation Constants

**Files:**
- Modify: `src/constants/navigation.ts`

- [ ] **Step 1: Add view property to NavLink interface**

Replace contents of `src/constants/navigation.ts`:

```typescript
import type { OverlayType, ActiveView } from "@/lib/store";

export interface NavLink {
  label: string;
  href?: string;
  overlay?: OverlayType;
  view?: ActiveView;
}

export const NAV_LINKS: NavLink[] = [
  { label: "index", view: "index" },
  { label: "selects", view: "selects" },
  { label: "info", view: "info" },
];

export const MENU_LINKS: NavLink[] = [
  { label: "index", view: "index" },
  { label: "selects", view: "selects" },
  { label: "info", view: "info" },
  { label: "lab", href: "/lab" },
];
```

Note: "contact" overlay is now accessed from within InfoView, not from the nav. The `overlay` property stays on the interface for potential future use.

- [ ] **Step 2: Commit**

```bash
git add src/constants/navigation.ts
git commit -m "feat(nav): update links to view-switching pattern

Replace works/about/contact with index/selects/info view links.
Lab link remains as href navigation."
```

---

### Task 3: Rewrite StudioPreloader

**Files:**
- Rewrite: `src/components/StudioPreloader.tsx`

- [ ] **Step 1: Write the typographic preloader**

Replace contents of `src/components/StudioPreloader.tsx`:

```tsx
"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { gsap } from "@/lib/gsap";
import { useStudioStore } from "@/lib/store";

type Phase = "loading" | "ready" | "exit";

const MIN_DISPLAY_MS = 2000;
const TIMEOUT_MS = 4000;

export default function StudioPreloader() {
  const setLoaded = useStudioStore((s) => s.setLoaded);
  const [phase, setPhase] = useState<Phase>("loading");
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const startTime = useRef(Date.now());
  const fontsReady = useRef(false);

  // Track font loading
  useEffect(() => {
    const handleReady = () => { fontsReady.current = true; };
    document.fonts.ready.then(handleReady);
    const timeout = setTimeout(handleReady, TIMEOUT_MS);
    return () => clearTimeout(timeout);
  }, []);

  // Animate progress bar
  useEffect(() => {
    if (phase !== "loading") return;

    const tl = gsap.timeline();

    // Phase 1: Animate to ~65% quickly
    tl.to(
      { val: 0 },
      {
        val: 65,
        duration: 1.2,
        ease: "power2.out",
        onUpdate() {
          const v = Math.round(this.targets()[0].val);
          setProgress(v);
        },
      }
    );

    // Phase 2: Slow crawl to 100% — waits for fonts
    tl.to(
      { val: 65 },
      {
        val: 100,
        duration: 1.5,
        ease: "power1.inOut",
        onUpdate() {
          const v = Math.round(this.targets()[0].val);
          setProgress(v);
        },
        onComplete: () => {
          const elapsed = Date.now() - startTime.current;
          const remaining = Math.max(0, MIN_DISPLAY_MS - elapsed);

          // Wait for minimum display time, then go to ready
          setTimeout(() => {
            if (fontsReady.current) {
              setPhase("ready");
            } else {
              // Fonts still loading — wait for them
              const check = setInterval(() => {
                if (fontsReady.current) {
                  clearInterval(check);
                  setPhase("ready");
                }
              }, 100);
            }
          }, remaining);
        },
      }
    );

    return () => { tl.kill(); };
  }, [phase]);

  // Ready hold → exit
  useEffect(() => {
    if (phase !== "ready") return;
    const timer = setTimeout(() => setPhase("exit"), 400);
    return () => clearTimeout(timer);
  }, [phase]);

  // Exit animation
  useEffect(() => {
    if (phase !== "exit") return;
    const el = containerRef.current;
    if (!el) return;

    gsap.to(el, {
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        setLoaded(true);
      },
    });
  }, [phase, setLoaded]);

  // Don't render after loaded
  const isLoaded = useStudioStore((s) => s.isLoaded);
  if (isLoaded) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[1000] flex items-center justify-center"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <div className="flex flex-col items-center gap-4">
        {/* Studio name */}
        <span
          className="font-mono tracking-[0.3em] uppercase"
          style={{
            fontSize: "var(--text-sm)",
            color: "var(--color-text)",
          }}
        >
          hkj
        </span>

        {/* Progress bar */}
        <div className="relative w-48 h-[1px]" style={{ backgroundColor: "var(--color-border)" }}>
          <div
            ref={progressRef}
            className="absolute top-0 left-0 h-full transition-none"
            style={{
              width: `${progress}%`,
              backgroundColor: "var(--color-accent)",
            }}
          />
        </div>

        {/* Status text + percentage */}
        <div className="flex items-center gap-3">
          <span
            className="font-mono lowercase"
            style={{
              fontSize: "var(--text-micro)",
              letterSpacing: "0.15em",
              color: "var(--color-text-secondary)",
            }}
          >
            {phase === "ready" || phase === "exit" ? "ready" : "loading..."}
          </span>
          <span
            className="font-mono"
            style={{
              fontSize: "var(--text-micro)",
              color: "var(--color-text-ghost)",
            }}
          >
            {progress}%
          </span>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify build compiles**

Run: `npx next build --no-lint 2>&1 | tail -5`

Expected: Build succeeds (may have warnings from pages still importing old store exports — that's expected until Task 10).

- [ ] **Step 3: Commit**

```bash
git add src/components/StudioPreloader.tsx
git commit -m "feat(preloader): rewrite to typographic loading screen

Replace image-cycling box with centered mono text (hkj / progress bar / loading.../ready).
Three-phase state machine: loading → ready → exit.
Minimum 2s display, 4s timeout fallback."
```

---

## Chunk 2: View Components — Rows, Index, Selects, Info

### Task 4: Create ProjectRow Component

**Files:**
- Create: `src/components/ProjectRow.tsx`

- [ ] **Step 1: Write ProjectRow**

```tsx
"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import type { Project } from "@/constants/projects";

interface ProjectRowProps {
  project: Project;
  index: number;
  isActive: boolean;
  showThumbnail?: boolean;
  onClick: (id: string) => void;
}

export default function ProjectRow({
  project,
  index,
  isActive,
  showThumbnail = false,
  onClick,
}: ProjectRowProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const num = String(index + 1).padStart(2, "0");
  const hasVideo = project.videos && project.videos.length > 0;

  // Video focus: play/pause based on data-in-focus attribute
  useEffect(() => {
    if (!showThumbnail || !hasVideo) return;
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { rootMargin: "-40% 0px -40% 0px" }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [showThumbnail, hasVideo]);

  return (
    <motion.button
      data-project-row={project.id}
      data-cursor="project"
      onClick={() => onClick(project.id)}
      className="project-card group w-full text-left flex items-center gap-6 transition-colors duration-200"
      style={{
        padding: showThumbnail ? "20px var(--page-px)" : "24px var(--page-px)",
        borderBottom: "1px solid var(--color-border)",
        backgroundColor: isActive ? "rgba(0,0,0,0.03)" : "transparent",
        borderLeft: isActive
          ? "2px solid var(--color-accent)"
          : "2px solid transparent",
      }}
      whileHover={{ backgroundColor: "rgba(0,0,0,0.03)" }}
    >
      {/* Thumbnail (Selects mode only) */}
      {showThumbnail && (
        <div
          className="relative overflow-hidden flex-shrink-0"
          style={{ width: 160, height: 100, borderRadius: 2 }}
        >
          {hasVideo ? (
            <video
              ref={videoRef}
              src={project.videos![0].src}
              poster={project.image}
              muted
              loop
              playsInline
              preload="metadata"
              className="w-full h-full object-cover project-card-img"
            />
          ) : (
            <Image
              src={project.image}
              alt={project.title}
              fill
              sizes="160px"
              className="object-cover project-card-img"
            />
          )}
        </div>
      )}

      {/* Number */}
      <span
        className="font-mono flex-shrink-0"
        style={{
          fontSize: "var(--text-micro)",
          letterSpacing: "0.1em",
          color: "var(--color-text-ghost)",
          width: "2.5em",
        }}
      >
        [{num}]
      </span>

      {/* Text content */}
      <div className="flex-1 min-w-0">
        <div
          className="font-sans font-medium uppercase truncate"
          style={{
            fontSize: "var(--text-base)",
            letterSpacing: "0.04em",
            color: "var(--color-text)",
          }}
        >
          {project.title}
        </div>
        <div
          className="font-mono mt-1"
          style={{
            fontSize: "var(--text-micro)",
            letterSpacing: "0.1em",
            color: "var(--color-text-secondary)",
          }}
        >
          {project.sector} — {project.year}
        </div>
      </div>
    </motion.button>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ProjectRow.tsx
git commit -m "feat: create ProjectRow component

Shared row for Index and Selects views. Renders number, title, sector/year.
Optional thumbnail with IntersectionObserver video focus.
Active state: accent left border + subtle background."
```

---

### Task 5: Create GhostRow Component

**Files:**
- Create: `src/components/GhostRow.tsx`

- [ ] **Step 1: Write GhostRow**

```tsx
"use client";

interface GhostRowProps {
  index: number;
  year: string;
  tagline: string;
  showThumbnail?: boolean;
}

const BLOCK_CHARS = "█";

function randomBlocks(): string {
  const len = 8 + Math.floor(Math.random() * 10);
  return BLOCK_CHARS.repeat(len);
}

// Generate once at module level so they don't change on re-render
const GHOST_TITLES = [randomBlocks(), randomBlocks()];

export default function GhostRow({
  index,
  year,
  tagline,
  showThumbnail = false,
}: GhostRowProps) {
  const num = String(index + 1).padStart(2, "0");
  const ghostIndex = index - 4; // Ghosts start at position 5 (index 4)
  const title = GHOST_TITLES[ghostIndex] || GHOST_TITLES[0];

  return (
    <div
      className="flex items-center gap-6"
      style={{
        padding: showThumbnail ? "20px var(--page-px)" : "24px var(--page-px)",
        borderBottom: "1px solid var(--color-border)",
        borderLeft: "2px solid transparent",
        opacity: 0.4,
      }}
    >
      {/* Ghost thumbnail placeholder */}
      {showThumbnail && (
        <div
          className="flex-shrink-0"
          style={{
            width: 160,
            height: 100,
            borderRadius: 2,
            backgroundColor: "var(--color-surface)",
          }}
        />
      )}

      {/* Number */}
      <span
        className="font-mono flex-shrink-0"
        style={{
          fontSize: "var(--text-micro)",
          letterSpacing: "0.1em",
          color: "var(--color-text-ghost)",
          width: "2.5em",
        }}
      >
        [{num}]
      </span>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <div
          className="font-sans font-medium uppercase"
          style={{
            fontSize: "var(--text-base)",
            letterSpacing: "0.04em",
            color: "var(--color-text-ghost)",
          }}
        >
          {title}
        </div>
        <div
          className="font-mono mt-1"
          style={{
            fontSize: "var(--text-micro)",
            letterSpacing: "0.1em",
            color: "var(--color-text-ghost)",
          }}
        >
          ??? — {year}
        </div>
        <div
          className="font-serif italic mt-0.5"
          style={{
            fontSize: "var(--text-micro)",
            color: "var(--color-text-ghost)",
          }}
        >
          {tagline}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/GhostRow.tsx
git commit -m "feat: create GhostRow component

Redacted 'in development' row with block character titles.
No click handler, no hover state, no cursor context."
```

---

### Task 6: Create HeroBlock (shared between Index and Selects)

**Files:**
- Create: `src/components/HeroBlock.tsx`

- [ ] **Step 1: Write HeroBlock**

```tsx
"use client";

import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";
import { useStudioStore } from "@/lib/store";
import { PROJECTS } from "@/constants/projects";

const GHOST_COUNT = 2;

export default function HeroBlock() {
  const isLoaded = useStudioStore((s) => s.isLoaded);
  const containerRef = useRef<HTMLDivElement>(null);

  const projectCount = PROJECTS.length;

  // GSAP stagger entrance after preloader
  useEffect(() => {
    if (!isLoaded) return;
    const lines = containerRef.current?.querySelectorAll("[data-hero-line]");
    if (!lines?.length) return;

    gsap.fromTo(
      lines,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: "power3.out",
      }
    );
  }, [isLoaded]);

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center justify-center text-center"
      style={{
        minHeight: "40vh",
        padding: "clamp(4rem, 10vh, 8rem) var(--page-px)",
      }}
    >
      <div
        data-hero-line
        className="font-mono uppercase tracking-[0.3em] opacity-0"
        style={{
          fontSize: "var(--text-lg)",
          color: "var(--color-text)",
          marginBottom: "0.75rem",
        }}
      >
        HKJ
      </div>

      <div
        data-hero-line
        className="opacity-0"
        style={{
          width: "3rem",
          height: "1px",
          backgroundColor: "var(--color-border-strong)",
          marginBottom: "1.5rem",
        }}
      />

      <div
        data-hero-line
        className="font-mono lowercase tracking-[0.2em] opacity-0"
        style={{
          fontSize: "var(--text-sm)",
          color: "var(--color-text-secondary)",
          marginBottom: "0.25rem",
        }}
      >
        design engineering
      </div>

      <div
        data-hero-line
        className="font-mono lowercase tracking-[0.2em] opacity-0"
        style={{
          fontSize: "var(--text-sm)",
          color: "var(--color-text-secondary)",
          marginBottom: "2rem",
        }}
      >
        nyc &amp; seoul
      </div>

      <div
        data-hero-line
        className="font-mono lowercase tracking-[0.15em] opacity-0"
        style={{
          fontSize: "var(--text-micro)",
          color: "var(--color-text-ghost)",
          marginBottom: "0.125rem",
        }}
      >
        portfolio v2.0
      </div>

      <div
        data-hero-line
        className="font-mono lowercase tracking-[0.15em] opacity-0"
        style={{
          fontSize: "var(--text-micro)",
          color: "var(--color-text-ghost)",
          marginBottom: "0.125rem",
        }}
      >
        {projectCount} projects loaded
      </div>

      <div
        data-hero-line
        className="font-mono lowercase tracking-[0.15em] opacity-0"
        style={{
          fontSize: "var(--text-micro)",
          color: "var(--color-text-ghost)",
        }}
      >
        {GHOST_COUNT} in development
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/HeroBlock.tsx
git commit -m "feat: create HeroBlock component

Typographic identity block shared between Index and Selects views.
GSAP stagger entrance after preloader. Live project/ghost counts."
```

---

### Task 7: Create ProjectIndex View

**Files:**
- Create: `src/components/ProjectIndex.tsx`

- [ ] **Step 1: Write ProjectIndex**

```tsx
"use client";

import { useRouter } from "next/navigation";
import { PROJECTS } from "@/constants/projects";
import { useStudioStore } from "@/lib/store";
import { useTransitionStore } from "@/store/useTransitionStore";
import HeroBlock from "@/components/HeroBlock";
import ProjectRow from "@/components/ProjectRow";
import GhostRow from "@/components/GhostRow";

const GHOSTS = [
  { year: "2026", tagline: "in development" },
  { year: "20??", tagline: "maybe the idea will come soon" },
];

export default function ProjectIndex() {
  const router = useRouter();
  const activeProject = useStudioStore((s) => s.activeProject);
  const setActiveProject = useStudioStore((s) => s.setActiveProject);
  const isPanelOpen = useStudioStore((s) => s.isPanelOpen);
  const setIsPanelOpen = useStudioStore((s) => s.setIsPanelOpen);
  const playerVisible = useStudioStore((s) => s.playerVisible);
  const setPlayerVisible = useStudioStore((s) => s.setPlayerVisible);
  const startTransition = useTransitionStore((s) => s.start);

  const handleRowClick = (id: string) => {
    // Mobile: navigate directly to case study (no panel)
    if (window.innerWidth < 768) {
      const row = document.querySelector(`[data-project-row="${id}"]`);
      const rect = row?.getBoundingClientRect();
      startTransition(`/work/${id}`, {
        x: rect ? rect.left + rect.width / 2 : window.innerWidth / 2,
        y: rect ? rect.top + rect.height / 2 : window.innerHeight / 2,
      });
      setTimeout(() => router.push(`/work/${id}`), 100);
      return;
    }

    // First interaction: show player bar
    if (!playerVisible) setPlayerVisible(true);

    if (activeProject === id && isPanelOpen) {
      // Toggle off if clicking same project
      setIsPanelOpen(false);
    } else {
      setActiveProject(id);
      setIsPanelOpen(true);
    }
  };

  const totalProjects = PROJECTS.length;

  return (
    <div>
      <HeroBlock />

      <div style={{ borderTop: "1px solid var(--color-border)" }}>
        {PROJECTS.map((project, i) => (
          <ProjectRow
            key={project.id}
            project={project}
            index={i}
            isActive={activeProject === project.id}
            onClick={handleRowClick}
          />
        ))}
        {GHOSTS.map((ghost, i) => (
          <GhostRow
            key={`ghost-${i}`}
            index={totalProjects + i}
            year={ghost.year}
            tagline={ghost.tagline}
          />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ProjectIndex.tsx
git commit -m "feat: create ProjectIndex view

Typographic project list with HeroBlock, ProjectRow, and GhostRow.
Row clicks open Now Playing panel and reveal player bar."
```

---

### Task 8: Create ProjectSelects View

**Files:**
- Create: `src/components/ProjectSelects.tsx`

- [ ] **Step 1: Write ProjectSelects**

```tsx
"use client";

import { useRouter } from "next/navigation";
import { PROJECTS } from "@/constants/projects";
import { useStudioStore } from "@/lib/store";
import { useTransitionStore } from "@/store/useTransitionStore";
import HeroBlock from "@/components/HeroBlock";
import ProjectRow from "@/components/ProjectRow";
import GhostRow from "@/components/GhostRow";

const GHOSTS = [
  { year: "2026", tagline: "in development" },
  { year: "20??", tagline: "maybe the idea will come soon" },
];

export default function ProjectSelects() {
  const router = useRouter();
  const activeProject = useStudioStore((s) => s.activeProject);
  const setActiveProject = useStudioStore((s) => s.setActiveProject);
  const isPanelOpen = useStudioStore((s) => s.isPanelOpen);
  const setIsPanelOpen = useStudioStore((s) => s.setIsPanelOpen);
  const playerVisible = useStudioStore((s) => s.playerVisible);
  const setPlayerVisible = useStudioStore((s) => s.setPlayerVisible);
  const startTransition = useTransitionStore((s) => s.start);

  const handleRowClick = (id: string) => {
    // Mobile: navigate directly to case study (no panel)
    if (window.innerWidth < 768) {
      const row = document.querySelector(`[data-project-row="${id}"]`);
      const rect = row?.getBoundingClientRect();
      startTransition(`/work/${id}`, {
        x: rect ? rect.left + rect.width / 2 : window.innerWidth / 2,
        y: rect ? rect.top + rect.height / 2 : window.innerHeight / 2,
      });
      setTimeout(() => router.push(`/work/${id}`), 100);
      return;
    }

    if (!playerVisible) setPlayerVisible(true);

    if (activeProject === id && isPanelOpen) {
      setIsPanelOpen(false);
    } else {
      setActiveProject(id);
      setIsPanelOpen(true);
    }
  };

  const totalProjects = PROJECTS.length;

  return (
    <div>
      <HeroBlock />

      <div style={{ borderTop: "1px solid var(--color-border)" }}>
        {PROJECTS.map((project, i) => (
          <ProjectRow
            key={project.id}
            project={project}
            index={i}
            isActive={activeProject === project.id}
            showThumbnail
            onClick={handleRowClick}
          />
        ))}
        {GHOSTS.map((ghost, i) => (
          <GhostRow
            key={`ghost-${i}`}
            index={totalProjects + i}
            year={ghost.year}
            tagline={ghost.tagline}
            showThumbnail
          />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ProjectSelects.tsx
git commit -m "feat: create ProjectSelects view

Same as ProjectIndex but with video/image thumbnails per row.
Ghost rows show noise grain placeholder thumbnails."
```

---

### Task 9: Create InfoView

**Files:**
- Create: `src/components/InfoView.tsx`

- [ ] **Step 1: Write InfoView**

Port content from existing `AboutOverlay.tsx` (capabilities list, editorial copy) and add contact CTA that opens ContactOverlay.

```tsx
"use client";

import { motion } from "framer-motion";
import { useStudioStore } from "@/lib/store";
import { SOCIALS, CONTACT_EMAIL } from "@/constants/contact";

const CAPABILITIES = [
  "Design Systems",
  "React / Next.js",
  "React Native",
  "Motion Design",
  "Prototyping",
  "Visual Design",
  "WebGL / 3D",
  "AI Integration",
];

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

export default function InfoView() {
  const setActiveOverlay = useStudioStore((s) => s.setActiveOverlay);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5, ease }}
      className="section-padding"
      style={{ paddingTop: "clamp(4rem, 10vh, 8rem)", paddingBottom: "clamp(6rem, 12vh, 10rem)" }}
    >
      <div className="max-w-[900px] mx-auto">
        {/* Editorial intro */}
        <h2
          className="editorial-display mb-8"
          style={{ fontSize: "var(--text-2xl)", color: "var(--color-text)" }}
        >
          <em>Design engineer</em> building at the intersection of craft and code.
        </h2>

        <p
          className="font-sans mb-16"
          style={{
            fontSize: "var(--text-base)",
            lineHeight: 1.7,
            color: "var(--color-text-secondary)",
            maxWidth: "56ch",
          }}
        >
          HKJ Studio is a one-person design engineering practice based between
          New York and Seoul. We build products that feel considered — from
          system design to pixel-level detail.
        </p>

        {/* Capabilities */}
        <div className="mb-16">
          <span
            className="micro block mb-6"
            style={{ color: "var(--color-text-ghost)" }}
          >
            capabilities
          </span>
          <div>
            {CAPABILITIES.map((cap, i) => (
              <div
                key={cap}
                className="py-3"
                style={{
                  borderBottom: i < CAPABILITIES.length - 1
                    ? "1px solid var(--color-border)"
                    : "none",
                }}
              >
                <span
                  className="font-sans"
                  style={{
                    fontSize: "var(--text-sm)",
                    color: "var(--color-text)",
                  }}
                >
                  {cap}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="mb-16">
          <span
            className="micro block mb-6"
            style={{ color: "var(--color-text-ghost)" }}
          >
            contact
          </span>

          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="font-mono block mb-4 hover:text-[var(--color-accent)] transition-colors"
            style={{
              fontSize: "var(--text-sm)",
              color: "var(--color-text)",
            }}
          >
            {CONTACT_EMAIL}
          </a>

          <div className="flex gap-6">
            {SOCIALS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono hover:text-[var(--color-accent)] transition-colors"
                style={{
                  fontSize: "var(--text-micro)",
                  letterSpacing: "0.1em",
                  color: "var(--color-text-secondary)",
                }}
              >
                {social.label}
              </a>
            ))}
          </div>
        </div>

        {/* Full contact overlay trigger */}
        <button
          onClick={() => setActiveOverlay("contact")}
          data-cursor="project"
          className="group headline-mixed"
        >
          <span
            className="font-sans font-medium uppercase"
            style={{
              fontSize: "var(--text-xl)",
              color: "var(--color-text)",
            }}
          >
            let&apos;s{" "}
          </span>
          <em
            className="group-hover:text-[var(--color-accent)] transition-colors duration-400"
            style={{
              fontSize: "var(--text-xl)",
              color: "var(--color-text)",
            }}
          >
            work together.
          </em>
        </button>
      </div>
    </motion.div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/InfoView.tsx
git commit -m "feat: create InfoView replacing AboutOverlay

Inline about + contact content with capabilities list.
ContactOverlay accessible via 'let's work together' CTA."
```

---

## Chunk 3: Shell + Chrome — AppShell, Panel, Player Bar, Nav, Page

### Task 10: Create NowPlayingPanel

**Files:**
- Create: `src/components/NowPlayingPanel.tsx`

- [ ] **Step 1: Write NowPlayingPanel**

```tsx
"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useStudioStore } from "@/lib/store";
import { PROJECTS } from "@/constants/projects";
import { useTransitionStore } from "@/store/useTransitionStore";

export default function NowPlayingPanel() {
  const router = useRouter();
  const activeProject = useStudioStore((s) => s.activeProject);
  const isPanelOpen = useStudioStore((s) => s.isPanelOpen);
  const setIsPanelOpen = useStudioStore((s) => s.setIsPanelOpen);
  const startTransition = useTransitionStore((s) => s.start);

  const project = PROJECTS.find((p) => p.id === activeProject);
  const projectIndex = PROJECTS.findIndex((p) => p.id === activeProject);
  const num = projectIndex >= 0 ? String(projectIndex + 1).padStart(2, "0") : "00";

  const handleViewCaseStudy = (e: React.MouseEvent) => {
    if (!project) return;
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    startTransition(`/work/${project.id}`, {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    });
    setTimeout(() => router.push(`/work/${project.id}`), 100);
  };

  if (!isPanelOpen || !project) return null;

  // Desktop push (>= 1280): side panel
  // Tablet overlay (1024-1279): side panel with backdrop (handled in AppShell)
  // Tablet sheet (768-1023): bottom sheet
  // Mobile (< 768): never shown (rows navigate directly)

  return (
    <motion.aside
      initial={{ x: "100%", y: 0 }}
      animate={{ x: 0, y: 0 }}
      exit={{ x: "100%", y: 0 }}
      transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
      className="h-full overflow-y-auto hidden md:block
        max-lg:fixed max-lg:bottom-0 max-lg:left-0 max-lg:right-0 max-lg:z-40
        max-lg:h-[60vh] max-lg:w-full max-lg:rounded-t-xl
        lg:relative lg:h-full lg:w-[380px]"
      style={{
        borderLeft: "1px solid var(--color-border)",
        backgroundColor: "var(--color-bg)",
      }}
    >
      {/* Close button */}
      <div
        className="sticky top-0 flex justify-end p-4"
        style={{ backgroundColor: "var(--color-bg)" }}
      >
        <button
          onClick={() => setIsPanelOpen(false)}
          className="font-mono hover:text-[var(--color-accent)] transition-colors"
          style={{
            fontSize: "var(--text-sm)",
            color: "var(--color-text-secondary)",
          }}
        >
          &#x2715;
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={project.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="px-6 pb-12"
        >
          {/* Number + Title */}
          <span
            className="font-mono block mb-2"
            style={{
              fontSize: "var(--text-micro)",
              letterSpacing: "0.1em",
              color: "var(--color-text-ghost)",
            }}
          >
            [{num}]
          </span>
          <h3
            className="font-sans font-medium uppercase mb-6"
            style={{
              fontSize: "var(--text-lg)",
              letterSpacing: "0.04em",
              color: "var(--color-text)",
            }}
          >
            {project.title}
          </h3>

          <div className="hairline mb-6" />

          {/* Spec table */}
          {[
            { label: "CLIENT", value: project.client },
            { label: "ROLE", value: project.role },
            { label: "SECTOR", value: project.sector },
            { label: "YEAR", value: project.year },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between py-2">
              <span
                className="font-mono"
                style={{
                  fontSize: "var(--text-micro)",
                  letterSpacing: "0.1em",
                  color: "var(--color-text-ghost)",
                }}
              >
                {label}
              </span>
              <span
                className="font-sans"
                style={{
                  fontSize: "var(--text-xs)",
                  color: "var(--color-text-secondary)",
                }}
              >
                {value}
              </span>
            </div>
          ))}

          <div className="hairline my-6" />

          {/* Pitch */}
          <p
            className="font-serif italic mb-6"
            style={{
              fontSize: "var(--text-sm)",
              lineHeight: 1.6,
              color: "var(--color-text-secondary)",
            }}
          >
            &ldquo;{project.pitch}&rdquo;
          </p>

          <div className="hairline mb-6" />

          {/* Stack */}
          <span
            className="micro block mb-3"
            style={{ color: "var(--color-text-ghost)" }}
          >
            stack
          </span>
          <div className="flex flex-wrap gap-2 mb-6">
            {project.schematic.stack.map((tech) => (
              <span
                key={tech}
                className="font-mono"
                style={{
                  fontSize: "var(--text-micro)",
                  color: "var(--color-text-secondary)",
                  padding: "2px 8px",
                  border: "1px solid var(--color-border)",
                  borderRadius: 2,
                }}
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="hairline mb-6" />

          {/* Tags */}
          <span
            className="micro block mb-3"
            style={{ color: "var(--color-text-ghost)" }}
          >
            tags
          </span>
          <div className="flex flex-wrap gap-2 mb-8">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="font-sans"
                style={{
                  fontSize: "var(--text-micro)",
                  color: "var(--color-text-ghost)",
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="hairline mb-6" />

          {/* View Case Study CTA */}
          <button
            onClick={handleViewCaseStudy}
            data-cursor="project"
            className="font-mono uppercase tracking-[0.15em] hover:text-[var(--color-accent)] transition-colors"
            style={{
              fontSize: "var(--text-xs)",
              color: "var(--color-text)",
            }}
          >
            view case study →
          </button>
        </motion.div>
      </AnimatePresence>
    </motion.aside>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/NowPlayingPanel.tsx
git commit -m "feat: create NowPlayingPanel component

Side panel showing project specs with AnimatePresence content swap.
Uses TransitionOverlay for case study navigation."
```

---

### Task 11: Create PlayerBar

**Files:**
- Create: `src/components/PlayerBar.tsx`

- [ ] **Step 1: Write PlayerBar**

```tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useStudioStore } from "@/lib/store";
import { PROJECTS } from "@/constants/projects";

export default function PlayerBar() {
  const playerVisible = useStudioStore((s) => s.playerVisible);
  const activeProject = useStudioStore((s) => s.activeProject);
  const setActiveProject = useStudioStore((s) => s.setActiveProject);
  const isPlaying = useStudioStore((s) => s.isPlaying);
  const togglePlayback = useStudioStore((s) => s.togglePlayback);
  const isPanelOpen = useStudioStore((s) => s.isPanelOpen);
  const setIsPanelOpen = useStudioStore((s) => s.setIsPanelOpen);

  const currentIndex = PROJECTS.findIndex((p) => p.id === activeProject);
  const project = currentIndex >= 0 ? PROJECTS[currentIndex] : null;

  const skip = (direction: 1 | -1) => {
    const len = PROJECTS.length;
    const next = ((currentIndex + direction) % len + len) % len;
    setActiveProject(PROJECTS[next].id);
    if (isPanelOpen) setIsPanelOpen(true); // keep panel open

    // Scroll row into view
    const row = document.querySelector(`[data-project-row="${PROJECTS[next].id}"]`);
    if (row) {
      row.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <AnimatePresence>
      {playerVisible && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
          className="fixed bottom-0 left-0 right-0 z-40 flex items-center"
          style={{
            height: 56,
            borderTop: "1px solid var(--color-border)",
            backgroundColor: "var(--color-bg)",
          }}
        >
          {/* Progress line */}
          {project && (
            <div
              className="absolute top-0 left-0 h-[2px]"
              style={{
                width: `${((currentIndex + 1) / PROJECTS.length) * 100}%`,
                backgroundColor: "var(--color-accent)",
                transition: "width 0.4s ease",
              }}
            />
          )}

          {/* Left: Controls */}
          <div className="flex items-center gap-1 pl-4 md:pl-6">
            <button
              onClick={togglePlayback}
              className="font-mono hover:text-[var(--color-accent)] transition-colors p-2"
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--color-text)",
              }}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? "❚❚" : "▶"}
            </button>

            <button
              onClick={() => skip(-1)}
              className="font-mono hover:text-[var(--color-accent)] transition-colors p-2 hidden md:block"
              style={{
                fontSize: "var(--text-micro)",
                color: "var(--color-text-secondary)",
              }}
              aria-label="Previous project"
            >
              ◁
            </button>

            <button
              onClick={() => skip(1)}
              className="font-mono hover:text-[var(--color-accent)] transition-colors p-2 hidden md:block"
              style={{
                fontSize: "var(--text-micro)",
                color: "var(--color-text-secondary)",
              }}
              aria-label="Next project"
            >
              ▷
            </button>
          </div>

          {/* Center: Project info */}
          <div className="flex-1 min-w-0 px-4">
            {project && (
              <div className="truncate">
                <span
                  className="font-sans font-medium uppercase"
                  style={{
                    fontSize: "var(--text-xs)",
                    letterSpacing: "0.04em",
                    color: "var(--color-text)",
                  }}
                >
                  {project.title}
                </span>
                <span
                  className="font-mono ml-3 hidden sm:inline"
                  style={{
                    fontSize: "var(--text-micro)",
                    color: "var(--color-text-ghost)",
                  }}
                >
                  {project.sector} — {project.year}
                </span>
              </div>
            )}
          </div>

          {/* Right: Position */}
          <div className="pr-4 md:pr-6">
            <span
              className="font-mono"
              style={{
                fontSize: "var(--text-micro)",
                color: "var(--color-text-ghost)",
              }}
            >
              {currentIndex >= 0 ? currentIndex + 1 : "—"} / {PROJECTS.length}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/PlayerBar.tsx
git commit -m "feat: create PlayerBar component

Fixed bottom bar with play/pause, prev/next, project info, progress.
Slides up on first interaction, stays visible for session."
```

---

### Task 12: Create AppShell

**Files:**
- Create: `src/components/AppShell.tsx`

- [ ] **Step 1: Write AppShell**

```tsx
"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useStudioStore } from "@/lib/store";
import ProjectIndex from "@/components/ProjectIndex";
import ProjectSelects from "@/components/ProjectSelects";
import InfoView from "@/components/InfoView";
import NowPlayingPanel from "@/components/NowPlayingPanel";
import PlayerBar from "@/components/PlayerBar";

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

export default function AppShell() {
  const activeView = useStudioStore((s) => s.activeView);
  const isPanelOpen = useStudioStore((s) => s.isPanelOpen);
  const setIsPanelOpen = useStudioStore((s) => s.setIsPanelOpen);
  const playerVisible = useStudioStore((s) => s.playerVisible);

  return (
    <>
      <div
        className="flex min-h-screen transition-all duration-500 ease-out"
        style={{
          paddingBottom: playerVisible ? 56 : 0,
        }}
      >
        {/* Main content area */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            {activeView === "index" && (
              <motion.div
                key="index"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5, ease }}
              >
                <ProjectIndex />
              </motion.div>
            )}
            {activeView === "selects" && (
              <motion.div
                key="selects"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5, ease }}
              >
                <ProjectSelects />
              </motion.div>
            )}
            {activeView === "info" && (
              <motion.div
                key="info"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5, ease }}
              >
                <InfoView />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Now Playing Panel — desktop push (>= 1280px) */}
        <AnimatePresence>
          {isPanelOpen && (
            <NowPlayingPanel />
          )}
        </AnimatePresence>
      </div>

      {/* Backdrop for overlay/sheet mode (768-1279px) */}
      <AnimatePresence>
        {isPanelOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-30 hidden md:block xl:hidden"
            style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
            onClick={() => setIsPanelOpen(false)}
          />
        )}
      </AnimatePresence>

      <PlayerBar />
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/AppShell.tsx
git commit -m "feat: create AppShell layout component

Three-zone layout: main content (view swap) + panel slot + player bar.
AnimatePresence crossfade between Index/Selects/Info views."
```

---

### Task 13: Update GlobalNav

**Files:**
- Modify: `src/components/GlobalNav.tsx`

- [ ] **Step 1: Update GlobalNav to use view-switching links**

Replace the nav link rendering logic. The key changes:
1. Import `ActiveView` type and `NAV_LINKS` (now has `view` property)
2. `handleClick` checks for `link.view` (sets activeView) instead of only `link.overlay`
3. Active underline matches `activeView` state (persistent underline on active view, hover underline on others)

In `GlobalNav.tsx`:

**Add imports:**
```tsx
import { useRouter } from "next/navigation";
import type { ActiveView } from "@/lib/store";
```

**Add store selectors (inside component body):**
```tsx
const router = useRouter();
const activeView = useStudioStore((s) => s.activeView);
const setActiveView = useStudioStore((s) => s.setActiveView);
```

**Replace the handleClick function:**
```tsx
const handleClick = useCallback(
  (e: React.MouseEvent, link: NavLink) => {
    e.preventDefault();
    if (link.view) {
      setActiveView(link.view);
    } else if (link.overlay) {
      setActiveOverlay(link.overlay);
    } else if (link.href) {
      router.push(link.href);
    }
  },
  [setActiveOverlay, setActiveView, router]
);
```

**Update the underline `animate` condition** (line ~129 in current GlobalNav):

Change:
```tsx
animate={{ scaleX: hoveredLink === link.label ? 1 : 0 }}
```
To:
```tsx
animate={{ scaleX: link.view === activeView || hoveredLink === link.label ? 1 : 0 }}
```

This gives active view links a persistent underline, while hover underline works on all links.

- [ ] **Step 2: Verify the nav renders correctly**

Run: `npx next build --no-lint 2>&1 | tail -5`

Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/components/GlobalNav.tsx
git commit -m "feat(nav): add view-switching links (index/selects/info)

handleClick now supports view property alongside overlay.
Active view gets spring underline indicator."
```

---

### Task 14: Update MobileMenu

**Files:**
- Modify: `src/components/MobileMenu.tsx`

- [ ] **Step 1: Update MobileMenu to handle view links**

Update the `handleNavigate` function to handle `link.view`:

```tsx
// Add to imports:
import type { ActiveView } from "@/lib/store";

// In component, add:
const setActiveView = useStudioStore((s) => s.setActiveView);

// In handleNavigate, add view handling:
if (link.view) {
  onClose();
  setTimeout(() => setActiveView(link.view!), 300);
}
```

The MENU_LINKS constant (now imported from updated navigation.ts) already has the correct items: index, selects, info, lab.

- [ ] **Step 2: Commit**

```bash
git add src/components/MobileMenu.tsx
git commit -m "feat(mobile-menu): add view-switching support

handleNavigate handles view links alongside overlays and hrefs."
```

---

### Task 15: Rewrite Homepage + Update Layout

**Files:**
- Rewrite: `src/app/page.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Rewrite page.tsx**

Replace contents of `src/app/page.tsx`:

```tsx
"use client";

import AppShell from "@/components/AppShell";

export default function Home() {
  return (
    <main>
      <AppShell />
    </main>
  );
}
```

- [ ] **Step 2: Remove AboutOverlay from layout.tsx**

In `src/app/layout.tsx`, remove the `AboutOverlay` import and its `<AboutOverlay />` render. Keep `ContactOverlay` (still used from InfoView CTA).

- [ ] **Step 3: Delete ViewModeToggle and AboutOverlay**

```bash
rm -f src/components/ui/ViewModeToggle.tsx
rm -f src/components/AboutOverlay.tsx
```

- [ ] **Step 4: Full build verification**

Run: `npx next build --no-lint 2>&1 | tail -20`

Expected: Build succeeds with no errors. Warnings about unused files (HeroToGridSection, ProjectGridView, ProjectListView) are acceptable — they're archived.

- [ ] **Step 5: Commit**

```bash
git add src/app/page.tsx src/app/layout.tsx
git add -u src/components/ui/ViewModeToggle.tsx src/components/AboutOverlay.tsx
git commit -m "feat: wire up AppShell on homepage, remove old components

page.tsx now renders AppShell. AboutOverlay removed (replaced by InfoView).
ViewModeToggle removed (replaced by nav links).
ContactOverlay kept in layout.tsx (accessible from InfoView)."
```

---

### Task 16: Smoke Test + Polish

- [ ] **Step 1: Run dev server and verify**

Run: `npx next dev`

Check:
1. Preloader shows "hkj / progress bar / loading.../ready" then fades
2. Index view renders with hero block + project rows + ghost rows
3. Clicking a row opens the Now Playing panel on the right
4. Player bar slides up on first row click
5. Nav links switch between Index / Selects / Info views
6. Selects view shows thumbnails next to project rows
7. Info view shows capabilities + contact CTA
8. "View Case Study" in panel navigates to `/work/[slug]`
9. Player bar prev/next cycles through projects
10. Mobile: hamburger menu shows view links
11. Tablet (768-1023px): panel opens as bottom sheet with 60vh height + backdrop
12. Mobile (< 768px): clicking row navigates directly to case study, no panel

- [ ] **Step 2: Fix any visual issues found during smoke test**

Address spacing, typography, or animation timing issues discovered.

- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "fix: polish visual issues from smoke test"
```
