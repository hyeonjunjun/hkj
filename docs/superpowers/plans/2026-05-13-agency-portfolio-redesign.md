# Agency Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the home page composition and introduce a site-wide chrome + page-transition system per the agency-portfolio spec.

**Architecture:** Next.js 16 App Router. A custom React Context state machine drives a GSAP-powered cover transition between routes. A chrome layer (Sitebar, CTAPill, Logo, Nav, BackButton) replaces the existing Frame component. The home renders as a 7-piece carousel in a 3-slot frame with typographic plates for concept pieces (no media). An intro animation gates on `sessionStorage` and waits for a Preloader handoff event.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, GSAP (core only, no club plugins), react-fast-marquee, existing 10-role `t-*` typography utility framework, existing `--paper`/`--ink` theme tokens. No new typefaces.

**Spec:** `docs/superpowers/specs/2026-05-13-agency-portfolio-redesign-design.md` (commit `78d1fb3`).

**Workflow:**
- Work directly on `master`. No worktrees, no feature branches (per project preference at `feedback_workflow.md`).
- Commit after each task per the checklist, not in batches.
- Push to origin (`git push origin master`) at the end of each chunk.
- Skip tasks marked as already-passing on this codebase only if explicitly verified — never skip "to save time."

**Verification approach:** This is a frontend visual redesign. TDD applies to the state machine, partition logic, and slot arithmetic. The rest is manual visual verification at the dev server (`npm run dev`) plus `npm run build` clean each chunk.

---

## File Structure

### New files

```
src/
  components/
    transition/
      TransitionProvider.tsx       # Context + state machine
      TransitionCover.tsx          # GSAP-driven cover overlay
      TransitionLink.tsx           # Next Link wrapper with click intercept
      useRouteTransition.ts        # Hook consuming the context
    chrome/
      Sitebar.tsx                  # Top pill with three columns
      CTAPill.tsx                  # Right-edge contact pill
      Nav.tsx                      # Top-right nav cluster + ThemeToggle
      Logo.tsx                     # Bottom-left wordmark
      BackButton.tsx               # Top-left pill (conditional)
    home/
      IndexCarousel.tsx            # 7-piece carousel in 3-slot frame
      ConceptPlate.tsx             # Typographic plate for cover-less pieces
      DisciplineTicker.tsx         # Bottom marquee
      CrosshairLines.tsx           # Decorative SVG
      IntroAnimation.tsx           # First-session GSAP timeline (no DOM)
docs/superpowers/specs/2026-05-13-agency-portfolio-redesign-design.md  # already committed
docs/superpowers/plans/2026-05-13-agency-portfolio-redesign.md         # this file
```

### Changed files

```
src/app/layout.tsx                 # Mount TransitionProvider, new chrome, TransitionCover, <main data-page-root>
src/components/HomeView.tsx        # Slim shell that renders carousel + bottom bar; OR deleted in favor of inline render in page.tsx
src/components/Preloader.tsx       # Dispatch rj-preloader-done CustomEvent on fade-out
src/app/globals.css                # Carousel transitions, intro animation keyframes, remove dead Tracklist Hardback rules
package.json                       # Add gsap + react-fast-marquee
```

### Deleted files

```
src/components/Frame.tsx           # Replaced by Sitebar + Logo + Nav + BackButton
```

---

## Chunk 0: Setup — dependencies and scaffolding

### Task 0.1: Install runtime dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install gsap and react-fast-marquee**

```bash
npm install gsap react-fast-marquee
```

Expected output:
```
added 2 packages, and audited N packages in Xs
```

- [ ] **Step 2: Verify versions in package.json**

```bash
grep -E '"gsap"|"react-fast-marquee"' package.json
```

Expected: both packages listed under `dependencies` with current versions.

- [ ] **Step 3: Verify build still passes**

```bash
npx next build 2>&1 | tail -5
```

Expected: build succeeds, no new warnings.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "deps: add gsap (core) and react-fast-marquee for redesign"
```

---

### Task 0.2: (removed)

Directory placeholders aren't needed — the first real file added to each directory will create it. The implementer can skip ahead to Chunk 1.

---

## Chunk 1: TransitionProvider state machine

The transition state machine is the heart of the redesign. It needs unit tests because every other component depends on its contract.

### Task 1.1: Define the context contract type

**Files:**
- Create: `src/components/transition/types.ts`

- [ ] **Step 1: Write the type module**

```ts
// src/components/transition/types.ts

export type TransitionPhase = "idle" | "covering" | "exiting";

export type TransitionContextValue = {
  phase: TransitionPhase;
  isTransitioning: boolean;
  pendingPath: string | null;
  startTransition: (path: string) => void;
  onCoverComplete: () => void;
  onExitComplete: () => void;
  registerDisposer: (key: string, fn: () => void) => void;
  unregisterDisposer: (key: string) => void;
};
```

- [ ] **Step 2: Verify tsc passes**

```bash
npx tsc --noEmit 2>&1 | tail -5
```

Expected: no output (clean).

- [ ] **Step 3: Commit**

```bash
git add src/components/transition/types.ts
git commit -m "feat(transition): define context contract type"
```

---

### Task 1.2: Write failing tests for the state machine

**Files:**
- Create: `src/components/transition/TransitionProvider.test.tsx`

- [ ] **Step 1: Write the failing test file**

```tsx
// src/components/transition/TransitionProvider.test.tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { TransitionProvider } from "./TransitionProvider";
import { useRouteTransition } from "./useRouteTransition";

// Mock next/navigation. Hoist the push spy so we can assert on calls.
const pushSpy = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushSpy }),
}));

beforeEach(() => {
  pushSpy.mockClear();
});

describe("TransitionProvider", () => {
  it("starts in idle phase", () => {
    const { result } = renderHook(() => useRouteTransition(), {
      wrapper: TransitionProvider,
    });
    expect(result.current.phase).toBe("idle");
    expect(result.current.isTransitioning).toBe(false);
    expect(result.current.pendingPath).toBe(null);
  });

  it("transitions idle → covering on startTransition and flips isTransitioning", () => {
    const { result } = renderHook(() => useRouteTransition(), {
      wrapper: TransitionProvider,
    });
    act(() => result.current.startTransition("/about"));
    expect(result.current.phase).toBe("covering");
    expect(result.current.isTransitioning).toBe(true);
    expect(result.current.pendingPath).toBe("/about");
  });

  it("ignores startTransition while not idle", () => {
    const { result } = renderHook(() => useRouteTransition(), {
      wrapper: TransitionProvider,
    });
    act(() => result.current.startTransition("/about"));
    act(() => result.current.startTransition("/contact"));
    expect(result.current.pendingPath).toBe("/about");
  });

  it("transitions covering → exiting on onCoverComplete and runs disposers", () => {
    const disposer = vi.fn();
    const { result } = renderHook(() => useRouteTransition(), {
      wrapper: TransitionProvider,
    });
    act(() => result.current.registerDisposer("test", disposer));
    act(() => result.current.startTransition("/about"));
    act(() => result.current.onCoverComplete());
    expect(result.current.phase).toBe("exiting");
    expect(disposer).toHaveBeenCalledOnce();
  });

  it("calls router.push exactly once with pendingPath during onCoverComplete", () => {
    const { result } = renderHook(() => useRouteTransition(), {
      wrapper: TransitionProvider,
    });
    act(() => result.current.startTransition("/about"));
    act(() => result.current.onCoverComplete());
    expect(pushSpy).toHaveBeenCalledTimes(1);
    expect(pushSpy).toHaveBeenCalledWith("/about");
  });

  it("runs disposers before router.push", () => {
    const calls: string[] = [];
    pushSpy.mockImplementation((path: string) => calls.push(`push:${path}`));
    const disposer = vi.fn(() => calls.push("dispose"));
    const { result } = renderHook(() => useRouteTransition(), {
      wrapper: TransitionProvider,
    });
    act(() => result.current.registerDisposer("a", disposer));
    act(() => result.current.startTransition("/about"));
    act(() => result.current.onCoverComplete());
    expect(calls).toEqual(["dispose", "push:/about"]);
  });

  it("runs multiple disposers in insertion order", () => {
    const order: string[] = [];
    const { result } = renderHook(() => useRouteTransition(), {
      wrapper: TransitionProvider,
    });
    act(() => result.current.registerDisposer("first", () => order.push("first")));
    act(() => result.current.registerDisposer("second", () => order.push("second")));
    act(() => result.current.startTransition("/about"));
    act(() => result.current.onCoverComplete());
    expect(order).toEqual(["first", "second"]);
  });

  it("unregisterDisposer prevents the disposer from running on onCoverComplete", () => {
    const disposer = vi.fn();
    const { result } = renderHook(() => useRouteTransition(), {
      wrapper: TransitionProvider,
    });
    act(() => result.current.registerDisposer("test", disposer));
    act(() => result.current.unregisterDisposer("test"));
    act(() => result.current.startTransition("/about"));
    act(() => result.current.onCoverComplete());
    expect(disposer).not.toHaveBeenCalled();
  });

  it("transitions exiting → idle on onExitComplete and clears pendingPath", () => {
    const { result } = renderHook(() => useRouteTransition(), {
      wrapper: TransitionProvider,
    });
    act(() => result.current.startTransition("/about"));
    act(() => result.current.onCoverComplete());
    act(() => result.current.onExitComplete());
    expect(result.current.phase).toBe("idle");
    expect(result.current.isTransitioning).toBe(false);
    expect(result.current.pendingPath).toBe(null);
  });

  it("throws if useRouteTransition called outside provider", () => {
    expect(() => renderHook(() => useRouteTransition())).toThrow(
      /useRouteTransition must be used within TransitionProvider/i,
    );
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
npx vitest run src/components/transition/TransitionProvider.test.tsx
```

Expected: tests fail because `TransitionProvider` and `useRouteTransition` don't exist yet.

---

### Task 1.3: Implement the hook and provider

**Files:**
- Create: `src/components/transition/useRouteTransition.ts`
- Create: `src/components/transition/TransitionProvider.tsx`

- [ ] **Step 1: Implement the hook**

```ts
// src/components/transition/useRouteTransition.ts
"use client";

import { createContext, useContext } from "react";
import type { TransitionContextValue } from "./types";

export const TransitionContext = createContext<TransitionContextValue | null>(null);

export function useRouteTransition(): TransitionContextValue {
  const ctx = useContext(TransitionContext);
  if (!ctx) {
    throw new Error(
      "useRouteTransition must be used within TransitionProvider",
    );
  }
  return ctx;
}
```

- [ ] **Step 2: Implement the provider**

State updaters must be pure (StrictMode runs them twice; concurrent rendering may run them speculatively). Reading and writing across pieces of state happens via refs (`phaseRef`, `pendingPathRef`) so no setter has side effects. The callbacks read the ref, decide, then call setters once each with simple values.

```tsx
// src/components/transition/TransitionProvider.tsx
"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { TransitionContext } from "./useRouteTransition";
import type { TransitionPhase, TransitionContextValue } from "./types";

export function TransitionProvider({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<TransitionPhase>("idle");
  const [pendingPath, setPendingPath] = useState<string | null>(null);
  const phaseRef = useRef<TransitionPhase>("idle");
  const pendingPathRef = useRef<string | null>(null);
  const disposers = useRef<Map<string, () => void>>(new Map());
  const router = useRouter();

  // Mirror state into refs so callbacks read consistent values without
  // closure staleness. Effects run after commit so the ref lags by one
  // render — acceptable here because the only readers are user-driven
  // callbacks (clicks, GSAP onComplete) that fire after commit.
  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);
  useEffect(() => {
    pendingPathRef.current = pendingPath;
  }, [pendingPath]);

  const startTransition = useCallback((path: string) => {
    if (phaseRef.current !== "idle") return;
    phaseRef.current = "covering";
    pendingPathRef.current = path;
    setPendingPath(path);
    setPhase("covering");
  }, []);

  const onCoverComplete = useCallback(() => {
    // Run disposers first so any in-flight rAF / observer / timeline is cleaned up
    disposers.current.forEach((fn, key) => {
      try {
        fn();
      } catch (e) {
        console.error(`[TransitionProvider] disposer "${key}" threw:`, e);
      }
    });
    disposers.current.clear();

    const path = pendingPathRef.current;
    if (path) router.push(path);

    phaseRef.current = "exiting";
    setPhase("exiting");
  }, [router]);

  const onExitComplete = useCallback(() => {
    phaseRef.current = "idle";
    pendingPathRef.current = null;
    setPhase("idle");
    setPendingPath(null);
  }, []);

  const registerDisposer = useCallback((key: string, fn: () => void) => {
    disposers.current.set(key, fn);
  }, []);

  const unregisterDisposer = useCallback((key: string) => {
    disposers.current.delete(key);
  }, []);

  const value = useMemo<TransitionContextValue>(
    () => ({
      phase,
      isTransitioning: phase !== "idle",
      pendingPath,
      startTransition,
      onCoverComplete,
      onExitComplete,
      registerDisposer,
      unregisterDisposer,
    }),
    [
      phase,
      pendingPath,
      startTransition,
      onCoverComplete,
      onExitComplete,
      registerDisposer,
      unregisterDisposer,
    ],
  );

  return (
    <TransitionContext.Provider value={value}>
      {children}
    </TransitionContext.Provider>
  );
}
```

- [ ] **Step 3: Run the tests**

```bash
npx vitest run src/components/transition/TransitionProvider.test.tsx
```

Expected: all 6 tests pass.

- [ ] **Step 4: tsc + eslint clean**

```bash
npx tsc --noEmit && npx eslint src/components/transition
```

Expected: clean.

- [ ] **Step 5: Commit**

```bash
git add src/components/transition/
git commit -m "feat(transition): provider + hook with state machine + tests"
```

---

## Chunk 2: TransitionCover + GSAP scaffolding

The cover overlay component owns the GSAP timelines. Layout wraps `{children}` in `<main data-page-root>` so the cover timeline targets a stable selector. The existing Frame stays in place at this chunk — chrome replacement is Chunk 4.

### Task 2.1: Wrap layout children in `<main data-page-root>`

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Read the current layout**

```bash
cat src/app/layout.tsx
```

Note the structure — the `{children}` slot currently sits as a direct body child.

- [ ] **Step 2: Wrap children in a main element with id and data-page-root**

Edit `src/app/layout.tsx`. Find the line `{children}` and wrap it:

```tsx
<main id="main" data-page-root>{children}</main>
```

Both attributes are required:
- `id="main"` is the existing skip-link target (`<a href="#main">Skip to content</a>` is already in layout.tsx). Removing this would regress keyboard accessibility.
- `data-page-root` is the stable selector the cover timeline targets — `id` alone is too overloaded to rely on for animation.

- [ ] **Step 3: Verify build**

```bash
npx next build 2>&1 | tail -5
```

Expected: build succeeds. Routes still render normally.

- [ ] **Step 4: Verify visually**

Start the dev server (`npm run dev` in another terminal) and load `/`. Confirm no visual regression. Inspect the DOM — `<main data-page-root>` should wrap the page content.

- [ ] **Step 5: Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat(layout): wrap children in <main data-page-root>"
```

---

### Task 2.2: Create TransitionCover with GSAP timelines

**Files:**
- Create: `src/components/transition/TransitionCover.tsx`

- [ ] **Step 1: Implement the component**

```tsx
// src/components/transition/TransitionCover.tsx
"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useRouteTransition } from "./useRouteTransition";

export function TransitionCover() {
  const { phase, onCoverComplete, onExitComplete } = useRouteTransition();
  const rootRef = useRef<HTMLDivElement>(null);
  const borderRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const coverTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const revealTimelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (phase !== "covering") return;
    if (!rootRef.current || !borderRef.current || !fillRef.current) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pageRoot = document.querySelector<HTMLElement>("[data-page-root]");
    if (!pageRoot) {
      console.error("[TransitionCover] [data-page-root] not found in DOM");
      return;
    }

    rootRef.current.style.visibility = "visible";

    if (reduce) {
      // Reduced-motion: single 100ms tween, state machine preserved
      const tl = gsap.timeline({ onComplete: onCoverComplete });
      tl.to(fillRef.current, { height: "100%", duration: 0.1 });
      coverTimelineRef.current = tl;
      return () => {
        tl.kill();
      };
    }

    const tl = gsap.timeline();
    tl.to(pageRoot, {
      scale: 0.96,
      filter: "blur(6px)",
      opacity: 0.5,
      duration: 0.9,
      ease: "power2.in",
    }, 0);
    tl.to(borderRef.current, {
      borderWidth: "12vh",
      duration: 0.8,
      ease: "expo.inOut",
    }, 0.3);
    tl.to(fillRef.current, {
      height: "100%",
      duration: 0.8,
      ease: "expo.inOut",
    }, 0.5);
    // Hold tween — the onComplete fires only after fill is fully covering
    tl.to({}, { duration: 0.8, onComplete: onCoverComplete });

    coverTimelineRef.current = tl;
    return () => {
      tl.kill();
    };
  }, [phase, onCoverComplete]);

  useEffect(() => {
    if (phase !== "exiting") return;
    if (!rootRef.current || !borderRef.current || !fillRef.current) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pageRoot = document.querySelector<HTMLElement>("[data-page-root]");
    if (!pageRoot) return;

    if (reduce) {
      const tl = gsap.timeline({
        onComplete: () => {
          // Clear any GSAP-applied inline styles on page-root so a
          // reduced-motion toggle mid-session doesn't leave stale
          // blur/scale/opacity from a prior full-motion transition.
          if (pageRoot) {
            gsap.set(pageRoot, { clearProps: "transform,filter,opacity" });
          }
          if (rootRef.current) rootRef.current.style.visibility = "hidden";
          onExitComplete();
        },
      });
      tl.to(fillRef.current, { height: "0%", duration: 0.1 });
      revealTimelineRef.current = tl;
      return () => tl.kill();
    }

    const tl = gsap.timeline();
    tl.to(fillRef.current, {
      height: "0%",
      duration: 0.7,
      ease: "expo.inOut",
    }, 0.2);
    tl.to(borderRef.current, {
      borderWidth: 0,
      duration: 0.7,
      ease: "expo.inOut",
    }, 0.4);
    tl.to(pageRoot, {
      scale: 1,
      filter: "blur(0px)",
      opacity: 1,
      duration: 0.9,
      ease: "power2.out",
      onComplete: () => {
        // Clear GSAP-applied inline styles so a subsequent reduced-motion
        // toggle (or a future cover) starts from a clean slate.
        gsap.set(pageRoot, { clearProps: "transform,filter,opacity" });
        if (rootRef.current) rootRef.current.style.visibility = "hidden";
        onExitComplete();
      },
    }, 0.4);

    revealTimelineRef.current = tl;
    return () => {
      tl.kill();
      // If we unmount mid-reveal, clear any styles we already applied.
      if (pageRoot) {
        gsap.set(pageRoot, { clearProps: "transform,filter,opacity" });
      }
    };
  }, [phase, onExitComplete]);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        pointerEvents: "none",
        visibility: "hidden",
      }}
    >
      <div
        ref={borderRef}
        style={{
          position: "absolute",
          inset: 0,
          borderStyle: "solid",
          borderColor: "var(--ink)",
          borderWidth: 0,
          overflow: "hidden",
        }}
      >
        <div
          ref={fillRef}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: "0%",
            background: "var(--ink)",
          }}
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: tsc + eslint clean**

```bash
npx tsc --noEmit && npx eslint src/components/transition/TransitionCover.tsx
```

Expected: clean.

- [ ] **Step 3: Commit**

```bash
git add src/components/transition/TransitionCover.tsx
git commit -m "feat(transition): cover overlay with GSAP timelines + reduced-motion"
```

---

### Task 2.3: Mount TransitionProvider + TransitionCover in layout

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Import provider and cover**

Add at the top of `src/app/layout.tsx`:

```tsx
import { TransitionProvider } from "@/components/transition/TransitionProvider";
import { TransitionCover } from "@/components/transition/TransitionCover";
```

- [ ] **Step 2: Wrap body content in TransitionProvider, mount TransitionCover**

Inside the `<body>` element, wrap the existing content (skip link, RouteAnnouncer, Preloader, Frame, children, Folio, PaperGrain) in `<TransitionProvider>`. Mount `<TransitionCover />` immediately after `<Frame />` (or anywhere inside the provider; it positions itself via fixed positioning).

Final structure:

```tsx
<body className={`${GeistSans.variable} ${GeistMono.variable}`}>
  <a href="#main" className="skip-to-content">Skip to content</a>
  <TransitionProvider>
    <RouteAnnouncer />
    <Preloader />
    <Frame />
    <TransitionCover />
    <main data-page-root>{children}</main>
    <Folio />
    <PaperGrain />
  </TransitionProvider>
</body>
```

- [ ] **Step 3: Build clean**

```bash
rm -rf .next && npx next build 2>&1 | tail -8
```

Expected: build succeeds, all routes still listed.

- [ ] **Step 4: Manual verification**

In `npm run dev`:
1. Load `/` — no visual change.
2. Open DevTools console. Inspect the rendered React tree (or `document.querySelector("[data-page-root]")`) — confirm it exists.
3. Inspect `document.querySelector("[style*='z-index: 100']")` — TransitionCover root should exist with `visibility: hidden`.

- [ ] **Step 5: Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat(layout): mount TransitionProvider and TransitionCover"
```

---

### Task 2.4: Manual phase-tick verification

This is a verification-only task to confirm the state machine + cover animation work before wiring TransitionLink.

- [ ] **Step 1: Add a temporary devtools test**

In the dev console while on `/`:

```js
// Expose the transition context for manual testing (TEMPORARY, not committed)
// Open React DevTools, find TransitionProvider, copy its props.value to window.__rt
// Then:
window.__rt.startTransition("/about");
```

Expected sequence:
- Cover overlay becomes visible.
- Page content blurs + scales down + fades.
- Border closes inward.
- Fill rises from bottom.
- After ~2.1s total, page navigates to `/about`.
- Cover reveals over ~1.3s, showing the new page.
- Final state: on `/about`, no cover, no leftover styles on page-root.

If any step fails (e.g., cover doesn't reach 100% height before navigation), fix before proceeding. Common issue: GSAP timeline `onComplete` attached to wrong tween.

- [ ] **Step 2: Reduced-motion verification**

In DevTools, enable `prefers-reduced-motion: reduce` (Rendering panel). Repeat the manual phase-tick:

```js
window.__rt.startTransition("/contact");
```

Expected: brief ~100ms ink flash, route changes, brief ink flash off. No blur, no scale, no border. State machine still ticks through phases.

- [ ] **Step 3: No commit (verification only)**

---

### Task 2.5: Push Chunk 2

- [ ] **Step 1: Push to origin**

```bash
git push origin master
```

Expected: push succeeds.

---

## Chunk 3: TransitionLink wired through existing Frame

The TransitionLink is the entry point for navigation. The existing Frame's nav links get rewired to use it. Frame stays in place at this chunk — full chrome replacement is Chunk 4.

**Silent dependency note:** The existing `Frame.tsx` returns `null` on `/` (the home owns its own chrome in `HomeView`). HomeView's nav cluster is not rewired in this chunk — it stays as plain `next/link` Links. As a result, **transitions from `/` to a sub-page still happen instantly during Chunk 3**. Only sub-page → sub-page navigation exercises the cover. The full home → sub-page flow lands in Chunk 4 when HomeView's chrome is replaced. Don't be alarmed if home navigations look unchanged after Chunk 3.

### Task 3.1: Implement TransitionLink

**Files:**
- Create: `src/components/transition/TransitionLink.tsx`

- [ ] **Step 1: Implement the component**

```tsx
// src/components/transition/TransitionLink.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { useRouteTransition } from "./useRouteTransition";

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string;
  children: ReactNode;
  showActiveIndicator?: boolean;
};

export function TransitionLink({
  href,
  children,
  showActiveIndicator = false,
  onClick,
  ...rest
}: Props) {
  const { startTransition, isTransitioning } = useRouteTransition();
  const pathname = usePathname();
  const isActive = pathname === href;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Pass-through to caller's onClick first
    onClick?.(e);
    if (e.defaultPrevented) return;
    // Honor modifier-key clicks (open in new tab, etc.) by NOT intercepting
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    if (!isTransitioning && !isActive) startTransition(href);
  };

  return (
    <Link href={href} onClick={handleClick} {...rest}>
      {showActiveIndicator && isActive && (
        <span aria-hidden style={{ marginRight: "0.4em" }}>►</span>
      )}
      {children}
    </Link>
  );
}
```

- [ ] **Step 2: tsc + eslint**

```bash
npx tsc --noEmit && npx eslint src/components/transition/TransitionLink.tsx
```

Expected: clean.

- [ ] **Step 3: Commit**

```bash
git add src/components/transition/TransitionLink.tsx
git commit -m "feat(transition): TransitionLink wrapper around next/link"
```

---

### Task 3.2: Rewire existing Frame nav to use TransitionLink

**Files:**
- Modify: `src/components/Frame.tsx`

- [ ] **Step 1: Replace Link imports with TransitionLink**

In `src/components/Frame.tsx`, change:

```tsx
import Link from "next/link";
```

to:

```tsx
import { TransitionLink as Link } from "@/components/transition/TransitionLink";
```

(Alias as `Link` so the existing JSX doesn't need to change. The TransitionLink supports the same `href` prop.)

- [ ] **Step 2: Verify the Frame's mark link also uses TransitionLink**

The Frame has a `<Link href="/" className="frame__mark">`. With the alias above, that link now routes through the cover transition.

- [ ] **Step 3: Build**

```bash
rm -rf .next && npx next build 2>&1 | tail -5
```

Expected: clean.

- [ ] **Step 4: Manual verification (dev server)**

In `npm run dev`:
1. Load `/about`.
2. Click the "Work" link in the top nav.
3. Verify: cover slides up, route changes to `/work`, cover reveals.
4. Round-trip time: ~3.5s.
5. Click an external mailto or similar — not affected (TransitionLink only handles same-app routes).

- [ ] **Step 5: Commit**

```bash
git add src/components/Frame.tsx
git commit -m "feat(transition): rewire Frame nav links through TransitionLink"
```

---

### Task 3.3: Push Chunk 3

- [ ] **Step 1: Push to origin**

```bash
git push origin master
```

---

## Chunk 4: Chrome replacement — Sitebar, Logo, Nav, CTAPill, BackButton

This chunk replaces Frame.tsx entirely. Five new chrome components are mounted in layout.

### Task 4.1: Implement Sitebar

**Files:**
- Create: `src/components/chrome/Sitebar.tsx`

The Sitebar has three columns: wordmark+discipline (left), live clock+date (center), availability (right). Live clock updates every 60s. When `pathname !== "/"`, the Sitebar emits a left-padding "reserve slot" of ~120px so the BackButton (Chunk 4 also) sits inside it.

- [ ] **Step 1: Write the component**

```tsx
// src/components/chrome/Sitebar.tsx
"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const RESERVE_PX = 120; // width carved out for BackButton when off-home

function formatNYC(now: Date): { time: string; date: string } {
  const time = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(now);
  const date = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now).replace(/\//g, ".");
  return { time, date };
}

export function Sitebar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [stamp, setStamp] = useState(() => formatNYC(new Date()));

  useEffect(() => {
    const id = setInterval(() => setStamp(formatNYC(new Date())), 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <header
      className="sitebar"
      role="banner"
      aria-label="Site header"
      data-off-home={isHome ? undefined : ""}
    >
      <span className="t-footnote sitebar__left">
        {isHome && (
          <>
            Ryan Jun
            <span className="t-sep">·</span>
            <span>Multidisciplinary design / engineering / direction</span>
          </>
        )}
      </span>
      <span className="t-footnote tabular sitebar__center">
        {stamp.date} <span className="t-sep">·</span> NYC {stamp.time}
      </span>
      <span className="t-footnote sitebar__right">
        Selective for q3 2026
      </span>

      <style>{`
        .sitebar {
          position: fixed;
          top: var(--margin-page);
          left: var(--margin-page);
          right: var(--margin-page);
          height: 32px;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: clamp(16px, 2vw, 32px);
          padding: 0 16px;
          background: var(--ink);
          color: var(--paper);
          border-radius: 4px;
          z-index: 50;
          pointer-events: auto;
        }
        .sitebar[data-off-home] {
          padding-left: ${RESERVE_PX}px;
        }
        .sitebar__left { justify-self: start; }
        .sitebar__center { justify-self: center; }
        .sitebar__right { justify-self: end; }
        .sitebar .t-footnote { color: var(--paper); }
        .sitebar .t-sep { color: var(--paper); opacity: 0.5; margin: 0 0.4em; }
        @media (max-width: 640px) {
          .sitebar {
            grid-template-columns: 1fr;
            height: auto;
            padding: 6px 12px;
          }
          .sitebar[data-off-home] { padding-left: 12px; }
          .sitebar__left { display: none; }
          .sitebar__right { display: none; }
        }
      `}</style>
    </header>
  );
}
```

- [ ] **Step 2: tsc + eslint clean**

```bash
npx tsc --noEmit && npx eslint src/components/chrome/Sitebar.tsx
```

Expected: clean.

- [ ] **Step 3: Commit**

```bash
git add src/components/chrome/Sitebar.tsx
git commit -m "feat(chrome): Sitebar with three columns + live clock"
```

---

### Task 4.2: Implement Logo

**Files:**
- Create: `src/components/chrome/Logo.tsx`

- [ ] **Step 1: Write the component**

```tsx
// src/components/chrome/Logo.tsx
"use client";

import { TransitionLink } from "@/components/transition/TransitionLink";

export function Logo() {
  return (
    <TransitionLink
      href="/"
      className="logo"
      aria-label="Ryan Jun — home"
    >
      rj
      <style>{`
        .logo {
          position: fixed;
          bottom: var(--margin-page);
          left: var(--margin-page);
          z-index: 50;
          font-family: var(--font-stack-mono);
          font-size: var(--type-meta);
          font-weight: 500;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--ink);
          pointer-events: auto;
          /* Preserve the shared-element wordmark VT from the prior Frame.
             Sub-pages also use this name on their own wordmark surrogate
             (Sitebar's left text on home, BackButton arrow off-home —
             actually only one VT per page is allowed; the Logo carries
             the VT identity site-wide since it appears on every route). */
          view-transition-name: rj-mark;
        }
      `}</style>
    </TransitionLink>
  );
}
```

- [ ] **Step 2: tsc + eslint**

```bash
npx tsc --noEmit && npx eslint src/components/chrome/Logo.tsx
```

Expected: clean.

- [ ] **Step 3: Commit**

```bash
git add src/components/chrome/Logo.tsx
git commit -m "feat(chrome): Logo wordmark bottom-left"
```

---

### Task 4.3: Implement Nav (with ThemeToggle nested)

**Files:**
- Create: `src/components/chrome/Nav.tsx`

The Nav has four routes (INDEX, WORK, ABOUT, CONTACT) and hosts the existing ThemeToggle at the right end.

- [ ] **Step 1: Write the component**

```tsx
// src/components/chrome/Nav.tsx
"use client";

import { TransitionLink } from "@/components/transition/TransitionLink";
import ThemeToggle from "@/components/ThemeToggle";

const ROUTES = [
  { href: "/", label: "Index" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Nav() {
  return (
    <nav
      className="nav"
      role="navigation"
      aria-label="Primary"
    >
      {ROUTES.map((route, i) => (
        <span key={route.href} className="nav__cell">
          {i > 0 && <span className="t-sep nav__sep" aria-hidden>·</span>}
          <TransitionLink
            href={route.href}
            className="t-footnote nav__link"
            showActiveIndicator
          >
            {route.label}
          </TransitionLink>
        </span>
      ))}
      <span className="nav__theme">
        <ThemeToggle />
      </span>

      <style>{`
        .nav {
          position: fixed;
          top: var(--margin-page);
          right: calc(var(--margin-page) + 56px); /* clear of CTA pill overhang */
          z-index: 50;
          display: inline-flex;
          align-items: baseline;
          gap: 0;
          height: 32px;
        }
        .nav__cell { display: inline-flex; align-items: baseline; }
        .nav__sep { color: var(--ink-4); }
        .nav__link {
          color: var(--ink-3);
          text-transform: uppercase;
          transition: color 180ms var(--ease);
          padding: 0 8px;
        }
        .nav__link:hover { color: var(--ink); }
        .nav__theme { margin-left: 16px; }
        @media (max-width: 640px) {
          .nav { right: var(--margin-page); }
          .nav__link { padding: 0 6px; }
        }
      `}</style>
    </nav>
  );
}
```

- [ ] **Step 2: tsc + eslint**

```bash
npx tsc --noEmit && npx eslint src/components/chrome/Nav.tsx
```

- [ ] **Step 3: Manual verification (after Chunk 4 mounts the chrome)**

After Chunk 4 (when Nav is actually rendered), verify:
- ThemeToggle renders inline next to the nav links at the right end of the cluster, no layout overlap or stacking issue.
- Hovering links flips them to `--ink`; clicking the active link no-ops.
- Active link gets the `►` prefix (via `showActiveIndicator`).

- [ ] **Step 4: Commit**

```bash
git add src/components/chrome/Nav.tsx
git commit -m "feat(chrome): Nav with TransitionLink + ThemeToggle"
```

---

### Task 4.4: Implement CTAPill

**Files:**
- Create: `src/components/chrome/CTAPill.tsx`

- [ ] **Step 1: Write the component**

```tsx
// src/components/chrome/CTAPill.tsx
"use client";

import { CONTACT_EMAIL } from "@/constants/contact";

function CalendarIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      aria-hidden="true"
    >
      <rect x="1.5" y="2.5" width="9" height="8" />
      <line x1="1.5" y1="4.5" x2="10.5" y2="4.5" />
      <line x1="3.5" y1="1.5" x2="3.5" y2="3.5" />
      <line x1="8.5" y1="1.5" x2="8.5" y2="3.5" />
    </svg>
  );
}

export function CTAPill() {
  return (
    <a
      className="cta-pill"
      href={`mailto:${CONTACT_EMAIL}`}
      aria-label="Contact via email"
    >
      <CalendarIcon />
      <span className="t-footnote cta-pill__label">Available</span>

      <style>{`
        .cta-pill {
          position: fixed;
          right: -3px;
          top: 50%;
          transform: translateY(-50%);
          z-index: 50;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: var(--ink);
          color: var(--paper);
          padding: 8px 16px 8px 12px;
          border-radius: 4px 0 0 4px;
          transition: opacity 180ms var(--ease);
        }
        .cta-pill:hover { opacity: 0.85; }
        .cta-pill__label {
          color: var(--paper);
          text-transform: uppercase;
        }
      `}</style>
    </a>
  );
}
```

- [ ] **Step 2: tsc + eslint**

```bash
npx tsc --noEmit && npx eslint src/components/chrome/CTAPill.tsx
```

- [ ] **Step 3: Commit**

```bash
git add src/components/chrome/CTAPill.tsx
git commit -m "feat(chrome): CTAPill right-edge mailto link"
```

---

### Task 4.5: Implement BackButton

**Files:**
- Create: `src/components/chrome/BackButton.tsx`

- [ ] **Step 1: Write the component**

```tsx
// src/components/chrome/BackButton.tsx
"use client";

import { usePathname } from "next/navigation";
import { useRouteTransition } from "@/components/transition/useRouteTransition";

export function BackButton() {
  const pathname = usePathname();
  const { startTransition, isTransitioning } = useRouteTransition();

  if (pathname === "/") return null;

  return (
    <button
      type="button"
      className="back-btn"
      aria-label="Return to index"
      onClick={() => {
        if (!isTransitioning) startTransition("/");
      }}
    >
      <span aria-hidden>←</span>
      <span className="t-footnote back-btn__label">Index</span>

      <style>{`
        .back-btn {
          position: fixed;
          top: var(--margin-page);
          left: var(--margin-page);
          z-index: 51; /* one above Sitebar */
          display: inline-flex;
          align-items: center;
          gap: 8px;
          height: 32px;
          padding: 0 16px;
          background: var(--ink);
          color: var(--paper);
          border: 0;
          border-radius: 4px;
          cursor: pointer;
          font-family: var(--font-stack-mono);
          transition: opacity 180ms var(--ease);
        }
        .back-btn:hover { opacity: 0.85; }
        .back-btn__label {
          color: var(--paper);
          text-transform: uppercase;
        }
      `}</style>
    </button>
  );
}
```

- [ ] **Step 2: tsc + eslint**

```bash
npx tsc --noEmit && npx eslint src/components/chrome/BackButton.tsx
```

- [ ] **Step 3: Commit**

```bash
git add src/components/chrome/BackButton.tsx
git commit -m "feat(chrome): BackButton conditional render off-home"
```

---

### Task 4.6: Replace Frame in layout

**Files:**
- Modify: `src/app/layout.tsx`
- Delete: `src/components/Frame.tsx`

- [ ] **Step 1: Update layout.tsx imports**

Remove the `Frame` import, add the new chrome imports:

```tsx
import { Sitebar } from "@/components/chrome/Sitebar";
import { Nav } from "@/components/chrome/Nav";
import { Logo } from "@/components/chrome/Logo";
import { CTAPill } from "@/components/chrome/CTAPill";
import { BackButton } from "@/components/chrome/BackButton";
```

- [ ] **Step 2: Replace `<Frame />` with the new chrome cluster**

In the `<body>` JSX, replace `<Frame />` with:

```tsx
<Sitebar />
<Nav />
<Logo />
<CTAPill />
<BackButton />
```

Order within the JSX is irrelevant (all are `position: fixed`), but group them together for readability.

- [ ] **Step 3: Delete the old Frame.tsx**

```bash
git rm src/components/Frame.tsx
```

- [ ] **Step 4: Build clean**

```bash
rm -rf .next && npx next build 2>&1 | tail -8
```

Expected: build succeeds. No reference to `Frame` should remain.

- [ ] **Step 5: Manual verification, light theme**

In `npm run dev`:
1. `/` — Sitebar (top, three columns), Nav (top-right), Logo (bottom-left), CTAPill (right edge half-overhanging), Folio (bottom-right). No BackButton.
2. `/about` — same chrome, BackButton appears top-left, Sitebar's left text disappears (and left-pad reserve makes room).
3. Repeat for `/contact`, `/notes`, `/work`, `/work/<slug>`.
4. Click BackButton on a sub-page — cover transition runs, returns to `/`.

- [ ] **Step 6: Manual verification, dark theme**

Toggle to dark. Repeat. Confirm all chrome pills invert correctly (cool-white pills on black ground).

- [ ] **Step 7: Commit**

```bash
git add src/app/layout.tsx src/components/Frame.tsx
git commit -m "feat(chrome): replace Frame with Sitebar+Nav+Logo+CTAPill+BackButton"
```

---

### Task 4.7: Push Chunk 4

```bash
git push origin master
```

---

## Chunk 5: IndexCarousel (image faces only)

The home becomes a 7-piece carousel in a 3-slot frame. This chunk lands the carousel with image/video faces only — concept pieces render a temporary placeholder. ConceptPlate lands in Chunk 6.

### Task 5.1: Slot calculation logic with tests

**Files:**
- Create: `src/components/home/carouselSlot.ts`
- Create: `src/components/home/carouselSlot.test.ts`

The slot value is `(pieceIndex - activeIndex + N) % N` where `N` is the piece count. Slot 0 = center, slot 1 = right, slot N-1 = left, others = hidden.

- [ ] **Step 1: Write the failing test**

```ts
// src/components/home/carouselSlot.test.ts
import { describe, it, expect } from "vitest";
import { computeSlot, type SlotRole } from "./carouselSlot";

describe("computeSlot", () => {
  it("returns center for the active piece", () => {
    expect(computeSlot(2, 2, 7)).toEqual({ slot: 0, role: "center" });
  });

  it("returns right-of-center for active + 1", () => {
    expect(computeSlot(3, 2, 7)).toEqual({ slot: 1, role: "right" });
  });

  it("returns left-of-center for active - 1 (wrapping)", () => {
    expect(computeSlot(1, 2, 7)).toEqual({ slot: 6, role: "left" });
  });

  it("wraps left from index 0", () => {
    expect(computeSlot(6, 0, 7)).toEqual({ slot: 6, role: "left" });
  });

  it("returns hidden for any other slot", () => {
    expect(computeSlot(4, 2, 7)).toEqual({ slot: 2, role: "hidden" });
    expect(computeSlot(5, 2, 7)).toEqual({ slot: 3, role: "hidden" });
  });
});
```

- [ ] **Step 2: Run test, verify fail**

```bash
npx vitest run src/components/home/carouselSlot.test.ts
```

Expected: tests fail because `carouselSlot.ts` doesn't exist.

- [ ] **Step 3: Implement carouselSlot**

```ts
// src/components/home/carouselSlot.ts
export type SlotRole = "center" | "left" | "right" | "hidden";

export function computeSlot(
  pieceIndex: number,
  activeIndex: number,
  count: number,
): { slot: number; role: SlotRole } {
  const slot = (pieceIndex - activeIndex + count) % count;
  let role: SlotRole;
  if (slot === 0) role = "center";
  else if (slot === 1) role = "right";
  else if (slot === count - 1) role = "left";
  else role = "hidden";
  return { slot, role };
}
```

- [ ] **Step 4: Verify tests pass**

```bash
npx vitest run src/components/home/carouselSlot.test.ts
```

Expected: 5 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/components/home/carouselSlot.ts src/components/home/carouselSlot.test.ts
git commit -m "feat(home): slot calculation with wrap, tested"
```

---

### Task 5.2: Implement IndexCarousel (image faces only, placeholder for concepts)

**Files:**
- Create: `src/components/home/IndexCarousel.tsx`

- [ ] **Step 1: Implement the component**

```tsx
// src/components/home/IndexCarousel.tsx
"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { PIECES } from "@/constants/pieces";
import { computeSlot, type SlotRole } from "./carouselSlot";

const COUNT = PIECES.length;

export function IndexCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  const navigate = useCallback((delta: number) => {
    setActiveIndex((current) => (current + delta + COUNT) % COUNT);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      // Bail if the user is typing somewhere — don't hijack arrows.
      const target = document.activeElement;
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        (target instanceof HTMLElement && target.isContentEditable)
      ) {
        return;
      }
      if (e.key === "ArrowLeft") navigate(-1);
      else if (e.key === "ArrowRight") navigate(1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate]);

  return (
    <section className="carousel" aria-label="Work carousel">
      {PIECES.map((piece, pieceIndex) => {
        const { role } = computeSlot(pieceIndex, activeIndex, COUNT);
        return (
          <article
            key={piece.slug}
            className="carousel__card"
            data-role={role}
            aria-current={role === "center"}
            // All cards stay focusable so keyboard users can tab through
            // the catalog even when only 3 are visible. Hidden cards
            // are reachable via focus per the spec.
            tabIndex={0}
            onFocus={() => setActiveIndex(pieceIndex)}
            onClick={() => setActiveIndex(pieceIndex)}
          >
            <CardFace piece={piece} />
          </article>
        );
      })}

      <style>{`
        .carousel {
          position: relative;
          width: 100%;
          height: 100%;
          display: grid;
          place-items: center;
          perspective: 1200px;
        }
        .carousel__card {
          position: absolute;
          width: 28vw;
          aspect-ratio: 4 / 5;
          border: 1px solid var(--ink-hair);
          background: var(--paper-2);
          cursor: pointer;
          transform-style: preserve-3d;
          transition:
            transform 480ms cubic-bezier(0.22, 1, 0.36, 1),
            opacity 480ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .carousel__card[data-role="center"] {
          transform: translateX(0) scale(1) rotateY(0);
          opacity: 1;
          z-index: 3;
        }
        .carousel__card[data-role="right"] {
          transform: translateX(60%) scale(0.7) rotateY(-8deg);
          opacity: 0.55;
          z-index: 2;
        }
        .carousel__card[data-role="left"] {
          transform: translateX(-60%) scale(0.7) rotateY(8deg);
          opacity: 0.55;
          z-index: 2;
        }
        .carousel__card[data-role="hidden"] {
          transform: translateX(120%) scale(0.4);
          opacity: 0;
          pointer-events: none;
          z-index: 1;
        }
        @media (prefers-reduced-motion: reduce) {
          .carousel__card { transition: none; }
        }
        @media (max-width: 760px) {
          .carousel__card { width: 70vw; }
        }
      `}</style>
    </section>
  );
}

function CardFace({ piece }: { piece: typeof PIECES[number] }) {
  if (piece.cover?.kind === "video") {
    return (
      <video
        src={piece.cover.src}
        muted
        loop
        playsInline
        autoPlay
        preload="metadata"
        className="card-media"
        aria-label={`${piece.title} cover`}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    );
  }
  if (piece.cover?.kind === "image") {
    return (
      <Image
        src={piece.cover.src}
        alt={`${piece.title} cover`}
        fill
        sizes="(max-width: 760px) 70vw, 28vw"
        style={{ objectFit: "cover" }}
      />
    );
  }
  // Concept piece placeholder — replaced by ConceptPlate in Chunk 6
  return (
    <div
      className="t-meta dim"
      style={{
        position: "absolute",
        inset: 0,
        display: "grid",
        placeItems: "center",
      }}
    >
      Concept plate (chunk 6)
    </div>
  );
}
```

- [ ] **Step 2: tsc + eslint**

```bash
npx tsc --noEmit && npx eslint src/components/home/IndexCarousel.tsx
```

- [ ] **Step 3: Commit**

```bash
git add src/components/home/IndexCarousel.tsx
git commit -m "feat(home): IndexCarousel with slot-driven 3-of-7 frame"
```

---

### Task 5.3: Replace HomeView with IndexCarousel

**Files:**
- Modify: `src/components/HomeView.tsx`

The existing HomeView is the 3-column setlist. It gets replaced with a slim shell that renders the carousel. The bottom bar (ticker + tagline) lands in Chunk 7; for now just the carousel.

- [ ] **Step 1: Reduce HomeView.tsx to a shell**

Replace the entire contents of `src/components/HomeView.tsx` with:

```tsx
// src/components/HomeView.tsx
"use client";

import { IndexCarousel } from "@/components/home/IndexCarousel";

export default function HomeView() {
  return (
    <div className="home">
      <IndexCarousel />

      <style>{`
        .home {
          position: relative;
          width: 100%;
          height: 100dvh;
          overflow: hidden;
          padding-top: calc(var(--margin-page) + 48px); /* clear sitebar */
          padding-bottom: calc(var(--margin-page) + 48px); /* clear bottom bar */
        }
      `}</style>
    </div>
  );
}
```

The HomeView component no longer takes a `pieces` prop (it reads from `PIECES` directly via IndexCarousel). Update `src/app/page.tsx` to remove the prop:

- [ ] **Step 2: Update page.tsx if needed**

```bash
cat src/app/page.tsx
```

If page.tsx passes pieces as a prop, update it:

```tsx
// src/app/page.tsx
import HomeView from "@/components/HomeView";

export default function Page() {
  return <HomeView />;
}
```

- [ ] **Step 3: Build clean**

```bash
rm -rf .next && npx next build 2>&1 | tail -8
```

Expected: build succeeds.

- [ ] **Step 4: Manual verification**

In `npm run dev` at `/`:
1. Three cards visible — center, left-off, right-off.
2. Left/right arrow keys rotate active piece. Wrap from piece 0 to piece 6 and back.
3. Click a side card — it slides to center.
4. Center card shows LA28 video (or image for Sift/Gyeol depending on starting index).
5. Concept pieces (AI Hardware, etc.) show the placeholder text "Concept plate (chunk 6)".
6. Tab key moves focus through center card; check `aria-current="true"` on inspector.

- [ ] **Step 5: Commit**

```bash
git add src/components/HomeView.tsx src/app/page.tsx
git commit -m "feat(home): replace HomeView setlist with IndexCarousel shell"
```

---

### Task 5.4: Push Chunk 5

```bash
git push origin master
```

---

## Chunk 6: ConceptPlate

### Task 6.1: Implement ConceptPlate

**Files:**
- Create: `src/components/home/ConceptPlate.tsx`

- [ ] **Step 1: Write the component**

```tsx
// src/components/home/ConceptPlate.tsx
import type { Piece } from "@/constants/pieces";

type Props = {
  piece: Piece;
  className?: string;
};

const STATUS_LABEL: Record<Piece["status"], string> = {
  concept: "concept",
  wip: "wip",
  shipped: "shipped",
};

export function ConceptPlate({ piece, className = "" }: Props) {
  return (
    <div
      className={`concept-plate ${className}`}
      role="img"
      aria-label={`${piece.title}${piece.sector ? ` — ${piece.sector}` : ""}`}
    >
      <span className="t-code tabular concept-plate__num">§{piece.number}</span>
      <span
        className={`t-meta concept-plate__status${piece.status === "wip" ? " live" : ""}`}
      >
        {STATUS_LABEL[piece.status]}
      </span>
      <h2
        className="concept-plate__title"
        aria-label={piece.title}
      >
        {piece.title}
      </h2>
      {piece.sector && (
        <span className="t-meta concept-plate__sector">{piece.sector}</span>
      )}

      <style>{`
        .concept-plate {
          position: absolute;
          inset: 0;
          display: grid;
          grid-template-rows: auto 1fr auto;
          padding: clamp(12px, 1.5vw, 20px);
          background: var(--paper-2);
        }
        .concept-plate__num {
          grid-row: 1;
          grid-column: 1;
          color: var(--ink-3);
          align-self: start;
        }
        .concept-plate__status {
          grid-row: 1;
          grid-column: 2;
          color: var(--ink-3);
          justify-self: end;
          align-self: start;
        }
        .concept-plate__status.live { color: var(--accent); }
        .concept-plate__title {
          grid-row: 2;
          grid-column: 1 / span 2;
          align-self: center;
          font-family: var(--font-stack-mono);
          font-size: clamp(40px, 5vw, 80px);
          font-weight: 500;
          letter-spacing: -0.04em;
          line-height: 0.95;
          color: var(--ink);
          text-transform: uppercase;
          margin: 0;
          overflow-wrap: anywhere;
        }
        .concept-plate__sector {
          grid-row: 3;
          grid-column: 1 / span 2;
          color: var(--ink-3);
          align-self: end;
        }
      `}</style>
    </div>
  );
}
```

(Note: the title is one text node, not per-letter spans. The per-letter reveal from the prior spec is out of scope here — inside a card frame in the carousel, the title is small enough that a per-letter reveal would be visually busy.)

- [ ] **Step 2: tsc + eslint**

```bash
npx tsc --noEmit && npx eslint src/components/home/ConceptPlate.tsx
```

- [ ] **Step 3: Commit**

```bash
git add src/components/home/ConceptPlate.tsx
git commit -m "feat(home): ConceptPlate typographic card face"
```

---

### Task 6.2: Wire ConceptPlate into IndexCarousel

**Files:**
- Modify: `src/components/home/IndexCarousel.tsx`

- [ ] **Step 1: Import ConceptPlate and replace placeholder**

In `src/components/home/IndexCarousel.tsx`, replace the placeholder `<div>` in `CardFace` for the no-cover case with `<ConceptPlate piece={piece} />`:

```tsx
import { ConceptPlate } from "./ConceptPlate";

// ... inside CardFace:

  // Concept piece: typographic plate
  return <ConceptPlate piece={piece} />;
```

Delete the old placeholder div.

- [ ] **Step 2: Build clean**

```bash
rm -rf .next && npx next build 2>&1 | tail -5
```

Expected: clean.

- [ ] **Step 3: Manual verification**

At `/`:
1. Navigate to a concept piece (AI Hardware, Spatial Audio, Album Cover System, Concept Car) via arrow keys.
2. Center card now shows the typographic plate: §NN top-left, status top-right, large uppercase title middle, sector lockup bottom.
3. Side cards (off-center) also render the typographic plate at reduced opacity.
4. LA28 (wip) shows status in amber (`--accent`).
5. Light/dark theme — both render correctly.

- [ ] **Step 4: Commit**

```bash
git add src/components/home/IndexCarousel.tsx
git commit -m "feat(home): wire ConceptPlate for cover-less pieces in carousel"
```

---

### Task 6.3: Push Chunk 6

```bash
git push origin master
```

---

## Chunk 7: DisciplineTicker + tagline bottom bar

### Task 7.1: Implement DisciplineTicker

**Files:**
- Create: `src/components/home/DisciplineTicker.tsx`

- [ ] **Step 1: Write the component**

```tsx
// src/components/home/DisciplineTicker.tsx
"use client";

import Marquee from "react-fast-marquee";

const DISCIPLINES = [
  "Brand Identity",
  "Design Engineering",
  "Creative Direction",
  "Art Direction",
  "Motion",
  "Editorial",
  "Product",
];

export function DisciplineTicker() {
  return (
    <div className="ticker" aria-label="Disciplines">
      <Marquee
        speed={32}
        gradient={false}
        pauseOnHover
        autoFill
      >
        {DISCIPLINES.map((d, i) => (
          <span key={i} className="t-meta ticker__item">
            {d}
            <span className="t-sep ticker__sep" aria-hidden>·</span>
          </span>
        ))}
      </Marquee>

      <style>{`
        .ticker {
          width: 100%;
          color: var(--ink-3);
          text-transform: uppercase;
        }
        .ticker__item {
          margin-right: 24px;
          white-space: nowrap;
        }
        .ticker__sep {
          margin-left: 24px;
          color: var(--ink-4);
        }
        @media (prefers-reduced-motion: reduce) {
          /* react-fast-marquee emits an inner element with class
             "rfm-marquee" (verify in the DOM at implementation time).
             Plain CSS — not styled-jsx :global — works here because
             we're using a bare <style> tag, not <style jsx>. */
          .rfm-marquee {
            animation-play-state: paused !important;
          }
        }
      `}</style>
    </div>
  );
}
```

- [ ] **Step 2: tsc + eslint**

```bash
npx tsc --noEmit && npx eslint src/components/home/DisciplineTicker.tsx
```

- [ ] **Step 3: Commit**

```bash
git add src/components/home/DisciplineTicker.tsx
git commit -m "feat(home): DisciplineTicker bottom marquee"
```

---

### Task 7.2: Mount ticker + tagline in HomeView

**Files:**
- Modify: `src/components/HomeView.tsx`

- [ ] **Step 1: Add bottom bar with ticker + tagline**

```tsx
// src/components/HomeView.tsx
"use client";

import { IndexCarousel } from "@/components/home/IndexCarousel";
import { DisciplineTicker } from "@/components/home/DisciplineTicker";

const TAGLINE = "Design, engineering, direction — one practice across surfaces.";

export default function HomeView() {
  return (
    <div className="home">
      <IndexCarousel />

      <footer className="home__bottom">
        <div className="home__ticker">
          <DisciplineTicker />
        </div>
        <p className="t-meta home__tagline">{TAGLINE}</p>
      </footer>

      <style>{`
        .home {
          position: relative;
          width: 100%;
          height: 100dvh;
          overflow: hidden;
          padding-top: calc(var(--margin-page) + 48px);
          padding-bottom: calc(var(--margin-page) + 48px);
        }
        .home__bottom {
          position: fixed;
          bottom: var(--margin-page);
          left: calc(var(--margin-page) + 48px); /* clear logo */
          right: calc(var(--margin-page) + 48px); /* clear folio */
          display: grid;
          grid-template-columns: 1fr 280px;
          gap: clamp(20px, 3vw, 48px);
          align-items: end;
          z-index: 40;
          pointer-events: none;
        }
        .home__ticker {
          pointer-events: auto;
          min-width: 0;
        }
        .home__tagline {
          color: var(--ink-2);
          text-align: right;
          max-width: 280px;
        }
        @media (max-width: 760px) {
          .home__bottom {
            grid-template-columns: 1fr;
            row-gap: 12px;
          }
          .home__tagline { text-align: left; }
        }
      `}</style>
    </div>
  );
}
```

- [ ] **Step 2: Build clean**

```bash
rm -rf .next && npx next build 2>&1 | tail -5
```

- [ ] **Step 3: Manual verification**

At `/`:
1. Bottom bar shows ticker on left (scrolling) + tagline on right.
2. Hover the ticker — pauses.
3. Carousel still navigable; bottom bar doesn't overlap chrome (Logo, Folio).

- [ ] **Step 4: Commit**

```bash
git add src/components/HomeView.tsx
git commit -m "feat(home): mount DisciplineTicker + tagline in bottom bar"
```

---

### Task 7.3: Push Chunk 7

```bash
git push origin master
```

---

## Chunk 8: Crosshair lines decoration

### Task 8.1: Implement CrosshairLines

**Files:**
- Create: `src/components/home/CrosshairLines.tsx`

- [ ] **Step 1: Write the SVG component**

```tsx
// src/components/home/CrosshairLines.tsx
export function CrosshairLines() {
  return (
    <svg
      className="crosshair"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {/* vectorEffect="non-scaling-stroke" + strokeWidth="1" yields a
          crisp 1-CSS-pixel line regardless of how the SVG is scaled
          across the viewport. */}
      <line x1="0" y1="0" x2="50" y2="50" stroke="var(--ink)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      <line x1="100" y1="0" x2="50" y2="50" stroke="var(--ink)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      <line x1="0" y1="100" x2="50" y2="50" stroke="var(--ink)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      <line x1="100" y1="100" x2="50" y2="50" stroke="var(--ink)" strokeWidth="1" vectorEffect="non-scaling-stroke" />

      <style>{`
        .crosshair {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          opacity: 0.06;
          pointer-events: none;
          z-index: 0;
        }
      `}</style>
    </svg>
  );
}
```

- [ ] **Step 2: Mount in IndexCarousel**

In `src/components/home/IndexCarousel.tsx`, add the crosshair as the first child of the `<section className="carousel">`:

```tsx
import { CrosshairLines } from "./CrosshairLines";

// inside the return:
<section className="carousel" aria-label="Work carousel">
  <CrosshairLines />
  {/* ... existing cards */}
</section>
```

- [ ] **Step 3: tsc + eslint**

```bash
npx tsc --noEmit && npx eslint src/components/home/
```

- [ ] **Step 4: Manual verification**

At `/`:
1. Faint diagonal lines from the four viewport corners meeting at the center, behind the cards.
2. Lines visible in both themes (very low opacity).

- [ ] **Step 5: Commit + push**

```bash
git add src/components/home/CrosshairLines.tsx src/components/home/IndexCarousel.tsx
git commit -m "feat(home): crosshair lines decoration behind carousel"
git push origin master
```

---

## Chunk 9: IntroAnimation + Preloader handoff

### Task 9.1: Dispatch `rj-preloader-done` event from Preloader

**Files:**
- Modify: `src/components/Preloader.tsx`

- [ ] **Step 1: Set a sticky module flag + dispatch the event**

The handoff needs both a sticky flag (so a late-mounting listener can still see "Preloader done" synchronously) and an event (so a listener attached early can react in real time). Race-free.

At the top of `Preloader.tsx`, expose a module-level flag attached to `window`:

```ts
// Sticky flag visible across the module + window so any consumer can
// read it synchronously without waiting for the rj-preloader-done event.
function markPreloaderDone() {
  if (typeof window === "undefined") return;
  (window as unknown as { __rjPreloaderDone?: boolean }).__rjPreloaderDone = true;
  window.dispatchEvent(new CustomEvent("rj-preloader-done"));
}
```

Replace each existing exit point in the Preloader effect with `markPreloaderDone()`:

```ts
// At the "already shown" early exit:
if (sessionStorage.getItem(SESSION_KEY)) {
  markPreloaderDone();
  return;
}

// At the reduced-motion early exit:
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  sessionStorage.setItem(SESSION_KEY, "1");
  markPreloaderDone();
  return;
}

// At the end-of-timeline transition to "done":
const doneAt = setTimeout(() => {
  sessionStorage.setItem(SESSION_KEY, "1");
  markPreloaderDone();
  setPhase("done");
}, TOTAL_MS);
```

- [ ] **Step 2: tsc + eslint**

```bash
npx tsc --noEmit && npx eslint src/components/Preloader.tsx
```

- [ ] **Step 3: Commit**

```bash
git add src/components/Preloader.tsx
git commit -m "feat(preloader): dispatch rj-preloader-done event for intro handoff"
```

---

### Task 9.2: Implement IntroAnimation

**Files:**
- Create: `src/components/home/IntroAnimation.tsx`

- [ ] **Step 1: Write the component**

```tsx
// src/components/home/IntroAnimation.tsx
"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { useRouteTransition } from "@/components/transition/useRouteTransition";

const INTRO_KEY = "rj-intro-played";
const PRELOADER_TIMEOUT_MS = 4000;

declare global {
  interface Window {
    __rjPreloaderDone?: boolean;
  }
}

export function IntroAnimation() {
  const { registerDisposer, unregisterDisposer } = useRouteTransition();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(INTRO_KEY)) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      sessionStorage.setItem(INTRO_KEY, "1");
      return;
    }

    let started = false;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let timeline: gsap.core.Timeline | null = null;
    let handler: (() => void) | null = null;

    // Apply pre-intro state via CSS class on <html> so there's no FOUC
    // between paint and the GSAP fromTo() running. CSS rule lives in
    // globals.css under html.intro-pending — see Task 9.3.
    document.documentElement.classList.add("intro-pending");

    function start() {
      if (started) return;
      started = true;
      if (timeoutId) clearTimeout(timeoutId);

      // Remove the pre-intro class — GSAP fromTo() will set initial
      // state via the "from" object, then animate to the final values.
      document.documentElement.classList.remove("intro-pending");

      const tl = gsap.timeline({
        onComplete: () => {
          sessionStorage.setItem(INTRO_KEY, "1");
          unregisterDisposer("intro");
          timeline = null;
        },
      });

      // Animate the Sitebar's clip-path rather than width to avoid the
      // left+right+width geometry conflict (width takes precedence when
      // all three are set, producing undefined behavior in the snap).
      tl.fromTo(
        ".sitebar",
        { clipPath: "inset(0 100% 0 0)" },
        {
          clipPath: "inset(0 0% 0 0)",
          duration: 0.9,
          ease: "power3.inOut",
        },
        0,
      );
      tl.fromTo(
        ".carousel__card",
        { scale: 0.96, filter: "blur(6px) saturate(0)", opacity: 0.4 },
        {
          scale: 1,
          filter: "blur(0px) saturate(1)",
          opacity: 1,
          duration: 0.7,
          ease: "power2.out",
          stagger: 0.08,
        },
        1.0,
      );
      tl.fromTo(
        ".home__bottom",
        { opacity: 0 },
        { opacity: 1, duration: 0.5 },
        1.3,
      );

      timeline = tl;

      // Disposer: if user navigates mid-intro, kill the timeline cleanly
      registerDisposer("intro", () => {
        if (timeline) timeline.kill();
      });
    }

    // Race-free Preloader handoff. Read the sticky flag first (Preloader
    // sets window.__rjPreloaderDone synchronously when it finishes /
    // bails). If the flag is true, start immediately. Otherwise listen
    // for the event with a timeout fallback.
    if (window.__rjPreloaderDone) {
      start();
    } else {
      handler = () => start();
      window.addEventListener("rj-preloader-done", handler, { once: true });
      timeoutId = setTimeout(() => {
        if (handler) window.removeEventListener("rj-preloader-done", handler);
        start(); // fallback if event never arrives
      }, PRELOADER_TIMEOUT_MS);
    }

    return () => {
      document.documentElement.classList.remove("intro-pending");
      if (handler) window.removeEventListener("rj-preloader-done", handler);
      if (timeoutId) clearTimeout(timeoutId);
      if (timeline) timeline.kill();
      unregisterDisposer("intro");
    };
  }, [registerDisposer, unregisterDisposer]);

  return null;
}
```

- [ ] **Step 2: Add the pre-intro CSS rule to prevent first-paint flash**

In `src/app/globals.css`, add:

```css
/* Pin pre-intro state on first session-load until GSAP fromTo() takes
   over. Prevents a flash of full-width Sitebar / fully-saturated cards
   between paint and animation start. */
html.intro-pending .sitebar {
  clip-path: inset(0 100% 0 0);
}
html.intro-pending .carousel__card {
  opacity: 0.4;
  filter: blur(6px) saturate(0);
  transform: scale(0.96);
}
html.intro-pending .home__bottom {
  opacity: 0;
}
```

- [ ] **Step 3: tsc + eslint**

```bash
npx tsc --noEmit && npx eslint src/components/home/IntroAnimation.tsx
```

- [ ] **Step 4: Commit**

```bash
git add src/components/home/IntroAnimation.tsx src/app/globals.css
git commit -m "feat(home): IntroAnimation with sticky preloader flag + pre-intro CSS"
```

---

### Task 9.3: Mount IntroAnimation in HomeView

**Files:**
- Modify: `src/components/HomeView.tsx`

- [ ] **Step 1: Mount IntroAnimation**

Add `<IntroAnimation />` inside the `<div className="home">` (no DOM impact, only side effects):

```tsx
import { IntroAnimation } from "@/components/home/IntroAnimation";

// inside the return, anywhere inside the .home div:
<IntroAnimation />
```

- [ ] **Step 2: Manual verification**

In a fresh browser session (DevTools → Application → Clear storage):
1. Load `/`. Preloader runs (~2.8s).
2. After Preloader fades, intro animation plays: Sitebar widens, cards focus in, bottom bar fades in. Total ~1.86s.
3. Reload — Preloader skipped, intro skipped (both flags set).
4. Clear storage, enable reduced-motion, reload. Preloader skipped via reduced-motion path. Intro also skipped; both flags written.

- [ ] **Step 3: Commit + push**

```bash
git add src/components/HomeView.tsx
git commit -m "feat(home): mount IntroAnimation"
git push origin master
```

---

## Chunk 10: Final cleanup + verification

### Task 10.1: Verify no dead Tracklist Hardback CSS rules remain (no-op expected)

**Files:**
- Verify: `src/app/globals.css`

The Tracklist Hardback spec was retired before its CSS shipped — these rules were never added. This task is a sanity check.

- [ ] **Step 1: Grep for dead-rule signatures**

```bash
grep -n "view-transition-old(plate)\|view-transition-new(plate)\|data-theme-wiping\|letter-rise\|data-initial-render" src/app/globals.css || echo "clean"
```

Expected output: `clean`. If any match is found, delete the surrounding rule block and commit.

- [ ] **Step 2: No commit (verification only)**

---

### Task 10.2: Full route walkthrough verification

This is verification-only, no commits.

- [ ] **Step 1: Build production bundle**

```bash
rm -rf .next && npx next build && npx next start &
```

Wait for "Ready" message. Then in a browser at `http://localhost:3000`:

- [ ] **Step 2: Verify each route in light theme**

For each of `/`, `/about`, `/contact`, `/notes`, `/work`, `/work/la28`:
- Chrome renders: Sitebar (top), Nav + ThemeToggle (top-right), Logo (bottom-left), CTAPill (right edge), Folio (bottom-right).
- On sub-pages: BackButton appears top-left, Sitebar's left text gone.
- Navigating between routes triggers the cover transition (~3.5s round-trip).
- BackButton on sub-pages returns to `/` through the same cover transition.

- [ ] **Step 3: Verify each route in dark theme**

Toggle to dark. Repeat. Confirm all chrome pills invert correctly.

- [ ] **Step 4: Verify home composition**

At `/`:
- 3 cards visible; LA28 video plays in center on first load.
- Arrow keys navigate; wrap around. Click a side card to bring it center.
- Concept pieces (§02-§05) render typographic plates.
- Crosshair lines visible behind cards (low opacity).
- Bottom bar: ticker on left scrolls, tagline on right fixed.

- [ ] **Step 5: Verify reduced-motion**

Enable `prefers-reduced-motion: reduce` (OS-level or DevTools Rendering panel). Reload `/`. Verify:
- Cover transitions are near-instant (~100ms flash).
- Intro animation is skipped.
- Ticker is paused.
- Carousel transitions are instant.
- State machine ticks correctly (DevTools React tab → TransitionProvider state).

- [ ] **Step 6: Verify mobile breakpoint**

Resize to ≤640px width. Verify:
- Sitebar collapses to single-line (center column only).
- Nav collapses (or falls back gracefully).
- Cards stack or shrink to 70vw width.
- Bottom bar collapses to single column.

- [ ] **Step 7: Existing test suite**

```bash
npx vitest run
```

Expected: all tests pass, including the new TransitionProvider and carouselSlot tests.

- [ ] **Step 8: Final lint + tsc**

```bash
npx tsc --noEmit && npx eslint src
```

Expected: clean.

---

### Task 10.3: Final commit + push

If any of the verification steps surfaced fixes:

```bash
git add <changed files>
git commit -m "fix: <description from verification>"
```

Then push:

```bash
git push origin master
```

---

## Done criteria

The plan is complete when:

- [ ] All routes navigate via the cover transition (cover 2.1s, reveal 1.3s).
- [ ] Chrome layer renders consistently across all routes; BackButton appears only off-`/`.
- [ ] Home carousel shows all 7 pieces in 3-slot frame; concept pieces use typographic plates.
- [ ] Intro animation plays exactly once per session, after Preloader handoff.
- [ ] Light and dark themes both work for chrome, cover, and cards.
- [ ] `prefers-reduced-motion` honored: cover near-instant, intro skipped, carousel instant, ticker paused.
- [ ] Build clean. `npx tsc`, `npx eslint`, `npx next build`, `npx vitest run` all pass.
- [ ] No regression on `/about`, `/contact`, `/notes`, `/work`, `/work/[slug]`.
- [ ] `gsap` and `react-fast-marquee` are the only new runtime dependencies.
- [ ] `src/components/Frame.tsx` is deleted.
