# Homepage Timeline Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the homepage's empty middle band with a scroll-driven, chronological (newest→oldest) timeline of Works, retire the standalone `/works` room page in favor of Nav's "works" link pointing home, and resize/reposition ThesisStatement to make room.

**Architecture:** Pure, fully-unit-testable logic (nav active-matching, damping math, gesture classification, nearest-stop detection, sort order) lives in `src/lib/`, decoupled from DOM. Presentational pieces (`TimelineStop`, `TimelineAxis`) are dumb components driven entirely by props. A single client-component orchestrator (`HomeTimeline`) wires the pure logic to real DOM events (wheel, scroll, keyboard, focus) and a `requestAnimationFrame` loop — this is the only place scroll physics and React state meet. Everything else in the plan (Nav fix, Thesis resize, `/works` retirement) is small and independent of the timeline itself.

**Tech Stack:** Next.js 16 App Router, TypeScript strict, Tailwind CSS v4, Vitest + React Testing Library (already configured — `npm test` runs `vitest run`), Playwright (already a devDependency, used throughout this project for manual/visual verification since there's no existing E2E test suite to extend). No animation libraries.

**Work happens directly on `master`** — this project's established convention (confirmed in prior sessions) is no worktrees/branches; ignore the writing-plans skill's default worktree assumption for this repo.

---

## Chunk 1: Nav active-state fix + pure timeline logic library

### Task 1: Extract and fix Nav's active-state matching

**Context:** Today `Nav.tsx` computes `isActive` inline as `pathname === item.href || pathname?.startsWith(\`${item.href}/\`)`. Once Task 6 changes the "works" `NavItem.href` from `/works` to `/`, this breaks: `/works/placeholder-i` no longer starts with `//`, so the "works" tab goes dark on every case-study page. Per the approved spec (`docs/superpowers/specs/2026-07-13-homepage-timeline-design.md`, §5), the fix is to also match on the item's `room` field, which already exists on `NavItem` and is independent of `href`.

**Files:**
- Create: `src/lib/navActive.ts`
- Create: `src/lib/navActive.test.ts`
- Modify: `src/components/Nav.tsx:1-30` (import and use the extracted function)

- [ ] **Step 1: Write the failing tests**

Create `src/lib/navActive.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { isNavItemActive } from "./navActive";
import type { NavItem } from "@/data/studio";

const worksItem: NavItem = { label: "works", href: "/", room: "works" };
const archiveItem: NavItem = { label: "archive", href: "/archive", room: "archive" };

describe("isNavItemActive", () => {
  it("matches when pathname equals href exactly", () => {
    expect(isNavItemActive("/", worksItem)).toBe(true);
    expect(isNavItemActive("/archive", archiveItem)).toBe(true);
  });

  it("matches a room-prefixed sub-path even when href doesn't share that prefix", () => {
    // The bug case: href is "/" but the room is "works", and a case-study
    // page at /works/[slug] should still light up the "works" tab.
    expect(isNavItemActive("/works/placeholder-i", worksItem)).toBe(true);
  });

  it("matches a room-prefixed sub-path when href and room already agree", () => {
    expect(isNavItemActive("/archive/some-entry", archiveItem)).toBe(true);
  });

  it("does not match an unrelated path", () => {
    expect(isNavItemActive("/references", worksItem)).toBe(false);
    expect(isNavItemActive("/info", archiveItem)).toBe(false);
  });

  it("does not match a path that merely starts with the same characters", () => {
    // "/archived-notes" should not match the "archive" room's prefix check.
    expect(isNavItemActive("/archived-notes", archiveItem)).toBe(false);
  });

  it("returns false for a null pathname (usePathname can return null during render)", () => {
    expect(isNavItemActive(null, worksItem)).toBe(false);
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test -- src/lib/navActive.test.ts`
Expected: FAIL — `Cannot find module './navActive'` (file doesn't exist yet)

- [ ] **Step 3: Write the implementation**

Create `src/lib/navActive.ts`:

```typescript
import type { NavItem } from "@/data/studio";

/**
 * Whether a NavItem should render as "active" for the given pathname.
 *
 * Matches on exact href equality, OR on the item's `room` — checked as
 * its own path segment (`/${room}/`), not a raw string prefix, so
 * "/archive/x" matches the "archive" room but "/archived-notes" doesn't.
 *
 * The room-based check matters independently of href: if a room's link
 * ever points somewhere other than "/{room}" (e.g. "works" pointing at
 * "/" instead of "/works"), sub-pages under "/{room}/..." still need to
 * light up the right tab.
 */
export function isNavItemActive(pathname: string | null, item: NavItem): boolean {
  if (pathname === null) return false;
  if (pathname === item.href) return true;
  return pathname.startsWith(`/${item.room}/`);
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm test -- src/lib/navActive.test.ts`
Expected: PASS (6 tests)

- [ ] **Step 5: Wire it into Nav.tsx**

In `src/components/Nav.tsx`, replace the inline active-check. Current relevant lines:

```tsx
            const isActive =
              pathname === item.href || pathname?.startsWith(`${item.href}/`);
```

Replace with:

```tsx
            const isActive = isNavItemActive(pathname, item);
```

Add the import near the top of the file, alongside the other imports:

```tsx
import { isNavItemActive } from "@/lib/navActive";
```

- [ ] **Step 6: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 7: Commit**

```bash
git add src/lib/navActive.ts src/lib/navActive.test.ts src/components/Nav.tsx
git commit -m "$(cat <<'EOF'
fix: extract Nav active-state check, add room-based matching

Pulls the inline href-matching logic out of Nav.tsx into a tested pure
function, and adds a room-based fallback match so a nav item whose href
doesn't share its room's path prefix (an upcoming requirement) still
highlights correctly on that room's sub-pages.
EOF
)"
```

(Note: `data/studio.ts`'s "works" href doesn't change to `/` until Task 8 — this task alone is a safe, independent fix that changes no visible behavior yet, since today every item's href and room already agree.)

---

### Task 2: Pure timeline motion helpers

**Context:** All the scroll-physics math the timeline needs — damping interpolation, wheel-gesture direction, nearest-stop lookup, keyboard-step clamping, and the newest-to-oldest sort — can be written and tested as plain functions with no DOM dependency. This is the "hard logic" chunk; `HomeTimeline.tsx` (Task 5) just calls these.

**Files:**
- Create: `src/lib/timelineMotion.ts`
- Create: `src/lib/timelineMotion.test.ts`

- [ ] **Step 1: Write the failing tests**

Create `src/lib/timelineMotion.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import {
  dampStep,
  classifyWheelGesture,
  findNearestIndex,
  clampIndex,
  sortWorksForTimeline,
} from "./timelineMotion";
import type { Work } from "@/data/works";

describe("dampStep", () => {
  it("moves partway from current toward target by the damping factor", () => {
    expect(dampStep(0, 100, 0.1)).toBeCloseTo(10);
    expect(dampStep(50, 50, 0.1)).toBe(50);
  });

  it("snaps to target once within a small epsilon, to avoid infinite tiny steps", () => {
    // 0.05px away, well under the 0.1px settle threshold.
    expect(dampStep(99.95, 100, 0.1)).toBe(100);
  });
});

describe("classifyWheelGesture", () => {
  it("classifies a vertical-dominant gesture (plain mouse wheel)", () => {
    expect(classifyWheelGesture({ deltaX: 0, deltaY: 40 })).toBe("vertical");
  });

  it("classifies a horizontal-dominant gesture (trackpad swipe)", () => {
    expect(classifyWheelGesture({ deltaX: 40, deltaY: 5 })).toBe("horizontal");
  });

  it("treats an exact tie as horizontal (let native scroll handle it)", () => {
    expect(classifyWheelGesture({ deltaX: 20, deltaY: 20 })).toBe("horizontal");
  });
});

describe("findNearestIndex", () => {
  it("returns the index of the center closest to the target", () => {
    expect(findNearestIndex([0, 100, 200, 300], 210)).toBe(2);
  });

  it("returns 0 for an empty-adjacent edge case (single center)", () => {
    expect(findNearestIndex([150], 9999)).toBe(0);
  });

  it("breaks exact ties toward the earlier (lower) index", () => {
    expect(findNearestIndex([0, 100], 50)).toBe(0);
  });
});

describe("clampIndex", () => {
  it("clamps below zero up to zero", () => {
    expect(clampIndex(-1, 5)).toBe(0);
  });

  it("clamps at-or-above length down to length - 1 (no wraparound)", () => {
    expect(clampIndex(5, 5)).toBe(4);
    expect(clampIndex(99, 5)).toBe(4);
  });

  it("passes through an in-range index unchanged", () => {
    expect(clampIndex(2, 5)).toBe(2);
  });
});

describe("sortWorksForTimeline", () => {
  const work = (id: string, year: string, index: number): Work => ({
    id,
    slug: id,
    index,
    romanNumeral: String(index),
    title: `Title ${id}`,
    caption: "caption",
    description: "description",
    category: "WORK",
    year,
    status: "LIVE",
    role: "role",
    media: { type: "placeholder", alt: "alt", aspectRatio: "square" },
    layout: {
      desktopColumn: "left",
      desktopVerticalAnchor: 0,
      desktopSize: "sm",
      captionPosition: "below",
    },
  });

  it("sorts newest year first", () => {
    const input = [work("a", "2024", 1), work("b", "2026", 2), work("c", "2025", 3)];
    expect(sortWorksForTimeline(input).map((w) => w.id)).toEqual(["b", "c", "a"]);
  });

  it("breaks same-year ties by index, descending", () => {
    const input = [work("a", "2025", 1), work("b", "2025", 3), work("c", "2025", 2)];
    expect(sortWorksForTimeline(input).map((w) => w.id)).toEqual(["b", "c", "a"]);
  });

  it("does not mutate the input array", () => {
    const input = [work("a", "2024", 1), work("b", "2026", 2)];
    const inputCopy = [...input];
    sortWorksForTimeline(input);
    expect(input).toEqual(inputCopy);
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test -- src/lib/timelineMotion.test.ts`
Expected: FAIL — `Cannot find module './timelineMotion'`

- [ ] **Step 3: Write the implementation**

Create `src/lib/timelineMotion.ts`:

```typescript
import type { Work } from "@/data/works";

/** Below this distance-to-target (px), snap instead of taking another tiny step. */
const SETTLE_EPSILON_PX = 0.1;

/**
 * One frame of eased interpolation toward `target`. Used by HomeTimeline's
 * requestAnimationFrame loop so wheel-driven scrolling feels like inertia
 * rather than snapping directly to raw deltas. Snaps to `target` once the
 * remaining distance is imperceptible, so the loop can stop cleanly
 * instead of approaching forever.
 */
export function dampStep(current: number, target: number, damping: number): number {
  const next = current + (target - current) * damping;
  return Math.abs(target - next) < SETTLE_EPSILON_PX ? target : next;
}

export type WheelGesture = "horizontal" | "vertical";

/**
 * Classifies a wheel event's dominant axis. "vertical" means a plain
 * mouse wheel or an incidental vertical trackpad move — HomeTimeline
 * redirects these into horizontal scroll, since the page itself never
 * scrolls vertically. An exact tie classifies as "horizontal" so it's
 * left to pass through to native scroll rather than being redirected.
 */
export function classifyWheelGesture(delta: { deltaX: number; deltaY: number }): WheelGesture {
  return Math.abs(delta.deltaY) > Math.abs(delta.deltaX) ? "vertical" : "horizontal";
}

/**
 * Index of the center in `centers` closest to `targetCenter`. Ties break
 * toward the earlier (lower) index. Used to find which timeline stop is
 * nearest the container's center, driving the active-stop title/emphasis.
 */
export function findNearestIndex(centers: number[], targetCenter: number): number {
  let bestIndex = 0;
  let bestDistance = Infinity;
  for (let i = 0; i < centers.length; i++) {
    const distance = Math.abs(centers[i] - targetCenter);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestIndex = i;
    }
  }
  return bestIndex;
}

/** Clamps `index` into `[0, length - 1]` — no wraparound at either end. */
export function clampIndex(index: number, length: number): number {
  return Math.max(0, Math.min(index, length - 1));
}

/**
 * Sorts Works newest → oldest by year (a "lookback"/retrospective read —
 * scrolling forward moves backward through time). Same-year entries
 * break ties by `index`, descending. Does not mutate its input.
 */
export function sortWorksForTimeline(works: Work[]): Work[] {
  return [...works].sort((a, b) => {
    if (a.year !== b.year) return b.year.localeCompare(a.year);
    return b.index - a.index;
  });
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm test -- src/lib/timelineMotion.test.ts`
Expected: PASS (14 tests)

- [ ] **Step 5: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 6: Commit**

```bash
git add src/lib/timelineMotion.ts src/lib/timelineMotion.test.ts
git commit -m "$(cat <<'EOF'
feat: add pure timeline motion helpers

Damping interpolation, wheel-gesture classification, nearest-stop
lookup, keyboard-step clamping, and the newest-to-oldest sort — all
pure and unit-tested, with no DOM dependency. HomeTimeline (next chunk)
wires these to real scroll/wheel/keyboard events.
EOF
)"
```

---

## Chunk 2: Timeline components

### Task 3: TimelineStop (presentational)

**Context:** One Work's content within the timeline: media at its own aspect ratio (not the uniform sizing WorkTile uses), roman numeral, category, the new `status` field, and the italic serif caption. No title here — the big above-row title (Task 5) is driven by whichever stop is active, not duplicated per-stop.

`MediaRenderer` (in `WorkTile.tsx`) currently only supports **width-driven** sizing: every branch (video/image/placeholder) sets `w-full` on its root element and lets `aspect-ratio` derive height from that width. The timeline needs the opposite — a **shared height**, with width varying per `aspectRatio` — so `MediaRenderer` needs a small, backward-compatible addition: an optional `fit` prop (`"width"` default, matching every existing caller unchanged; `"height"` for the timeline).

Getting a fixed-height box to derive a variable width from `aspect-ratio` requires the box to be sized via shrink-to-fit (a flex item, not a plain block filling its container) — a plain block child with `width: auto` fills all available width regardless of `aspect-ratio`, it doesn't shrink to content. So `TimelineStop`'s media wrapper must be a single-item **row flex container with a fixed height** (`flex h-[…]`); the flex-sizing algorithm then computes the sole item's width from its height via the aspect ratio, which is standard, well-supported CSS behavior — no JS measurement needed.

**Files:**
- Create: `src/components/timeline/TimelineStop.tsx`
- Create: `src/components/timeline/TimelineStop.test.tsx`
- Modify: `src/components/works/WorkTile.tsx` (add the `fit` prop to `MediaRenderer`, described above)
- Create: `src/components/works/WorkTile.test.tsx` (first test file for this component — covers only the new `fit` prop, not the whole file)

- [ ] **Step 1: Write the failing test for `MediaRenderer`'s new `fit` prop**

Create `src/components/works/WorkTile.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MediaRenderer } from "./WorkTile";
import type { MediaAsset } from "@/lib/types";

const media: MediaAsset = { type: "placeholder", alt: "Placeholder for Work", aspectRatio: "square" };

describe("MediaRenderer fit prop", () => {
  it("defaults to width-driven sizing (w-full, no forced height)", () => {
    render(<MediaRenderer media={media} />);
    const root = screen.getByRole("img");
    expect(root).toHaveClass("w-full");
    expect(root).not.toHaveClass("h-full");
  });

  it("switches to height-driven sizing (h-full, w-auto) when fit='height'", () => {
    render(<MediaRenderer media={media} fit="height" />);
    const root = screen.getByRole("img");
    expect(root).toHaveClass("h-full");
    expect(root).toHaveClass("w-auto");
    expect(root).not.toHaveClass("w-full");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- src/components/works/WorkTile.test.tsx`
Expected: FAIL — `fit` doesn't exist on `MediaRenderer`'s props yet, and the default-case assertions fail too since the component doesn't build `sizeClasses` conditionally

- [ ] **Step 3: Add the `fit` prop to `MediaRenderer`**

In `src/components/works/WorkTile.tsx`, current relevant lines (27–85):

```tsx
const mediaClasses =
  "block h-auto w-full object-cover transition-[filter] duration-[240ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:brightness-[1.04]";

/** Exported so mobile/preview surfaces can reuse it with a forced aspect ratio. */
export function MediaRenderer({
  media,
  aspectOverride,
}: {
  media: MediaAsset;
  aspectOverride?: string;
}) {
  const style = { aspectRatio: aspectOverride ?? ASPECT_RATIO_CSS[media.aspectRatio] };

  if (media.type === "video") {
    return (
      <video
        className={mediaClasses}
        style={style}
        muted
        playsInline
        loop
        preload="metadata"
        autoPlay
        poster={media.fallbackSrc}
        aria-label={media.alt}
      >
        {media.src && <source src={media.src} />}
      </video>
    );
  }

  if (media.type === "image" && media.src) {
    return (
      <div className="relative w-full overflow-hidden" style={style}>
        <Image
          src={media.src}
          alt={media.alt}
          fill
          sizes="(max-width: 1024px) 45vw, 320px"
          loading="lazy"
          className={mediaClasses}
        />
      </div>
    );
  }

  return (
    <div
      className="flex w-full items-center justify-center bg-paper-shade transition-[filter] duration-[240ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:brightness-[1.04]"
      style={style}
      role="img"
      aria-label={media.alt}
    >
      <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-mist">
        Placeholder
      </span>
    </div>
  );
}
```

Replace with:

```tsx
const mediaClassesBase =
  "block object-cover transition-[filter] duration-[240ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:brightness-[1.04]";

/**
 * Exported so mobile/preview surfaces can reuse it with a forced aspect ratio.
 *
 * `fit` controls which dimension is authoritative: "width" (default, used by
 * every existing caller) sizes to 100% of the parent's width and derives
 * height from `aspect-ratio`. "height" (used by the homepage timeline) sizes
 * to 100% of the parent's height and derives width from `aspect-ratio`
 * instead — this only produces a varying width if the parent itself is a
 * single-item flex container with a fixed height (shrink-to-fit sizing),
 * not a plain block box.
 */
export function MediaRenderer({
  media,
  aspectOverride,
  fit = "width",
}: {
  media: MediaAsset;
  aspectOverride?: string;
  fit?: "width" | "height";
}) {
  const style = { aspectRatio: aspectOverride ?? ASPECT_RATIO_CSS[media.aspectRatio] };
  const sizeClasses = fit === "height" ? "h-full w-auto" : "h-auto w-full";

  if (media.type === "video") {
    return (
      <video
        className={`${mediaClassesBase} ${sizeClasses}`}
        style={style}
        muted
        playsInline
        loop
        preload="metadata"
        autoPlay
        poster={media.fallbackSrc}
        aria-label={media.alt}
      >
        {media.src && <source src={media.src} />}
      </video>
    );
  }

  if (media.type === "image" && media.src) {
    return (
      <div className={`relative overflow-hidden ${sizeClasses}`} style={style}>
        <Image
          src={media.src}
          alt={media.alt}
          fill
          sizes="(max-width: 1024px) 45vw, 320px"
          loading="lazy"
          className={mediaClassesBase}
        />
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-center bg-paper-shade transition-[filter] duration-[240ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:brightness-[1.04] ${sizeClasses}`}
      style={style}
      role="img"
      aria-label={media.alt}
    >
      <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-mist">
        Placeholder
      </span>
    </div>
  );
}
```

Note: `sizeClasses` is shared across all three branches now — the image branch's `<Image fill>` element itself still uses only `mediaClassesBase` (no `sizeClasses`), since `fill` already sizes it to 100%/100% of its wrapper `div` regardless of `fit`; `sizeClasses` only needs to apply to that wrapper.

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- src/components/works/WorkTile.test.tsx`
Expected: PASS (2 tests)

- [ ] **Step 5: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors (existing callers of `MediaRenderer` — `WorkGrid.tsx`, `src/app/works/[slug]/page.tsx` — don't pass `fit`, so they keep today's width-driven behavior via the default)

- [ ] **Step 6: Write the failing test for TimelineStop**

Create `src/components/timeline/TimelineStop.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import TimelineStop from "./TimelineStop";
import type { Work } from "@/data/works";

const work: Work = {
  id: "work-01",
  slug: "placeholder-i",
  index: 1,
  romanNumeral: "I",
  title: "Placeholder Title I",
  caption: "placeholder caption",
  description: "description",
  category: "WORK",
  year: "2025",
  status: "LIVE",
  role: "role",
  media: { type: "placeholder", alt: "Placeholder for Work I", aspectRatio: "portrait" },
  layout: {
    desktopColumn: "left",
    desktopVerticalAnchor: 0,
    desktopSize: "md",
    captionPosition: "below",
  },
};

describe("TimelineStop", () => {
  it("renders the roman numeral, category, status, and caption", () => {
    render(<TimelineStop work={work} isActive={false} />);
    expect(screen.getByText(/I \/ WORK/)).toBeInTheDocument();
    // "LIVE" is a substring of the same <p> as the numeral/category
    // ("• I / WORK · LIVE"), so an exact string match would find no element —
    // use a regex for a substring match against that element's text content.
    expect(screen.getByText(/LIVE/)).toBeInTheDocument();
    expect(screen.getByText("placeholder caption")).toBeInTheDocument();
  });

  it("links to the work's case-study page", () => {
    render(<TimelineStop work={work} isActive={false} />);
    expect(screen.getByRole("link")).toHaveAttribute("href", "/works/placeholder-i");
  });

  it("applies the active emphasis class only when isActive is true", () => {
    const { rerender } = render(<TimelineStop work={work} isActive={false} />);
    expect(screen.getByRole("link")).not.toHaveClass("opacity-100");

    rerender(<TimelineStop work={work} isActive={true} />);
    expect(screen.getByRole("link")).toHaveClass("opacity-100");
  });
});
```

- [ ] **Step 7: Run the test to verify it fails**

Run: `npm test -- src/components/timeline/TimelineStop.test.tsx`
Expected: FAIL — `Cannot find module './TimelineStop'`

- [ ] **Step 8: Write the implementation**

Create `src/components/timeline/TimelineStop.tsx`:

```tsx
import Link from "next/link";
import type { Work } from "@/data/works";
import { MediaRenderer } from "@/components/works/WorkTile";

interface TimelineStopProps {
  work: Work;
  isActive: boolean;
}

const MEDIA_HEIGHT = "h-[40vh]";

/**
 * One stop in the homepage timeline. Unlike WorkTile (which forces a
 * uniform width per desktopSize for the poster composition), each stop
 * here renders at its own natural aspect ratio and a shared height —
 * width varies per item, matching the reference's filmstrip rhythm.
 *
 * The media wrapper below is a single-item row flex container with a
 * fixed height (not a plain block box) — that's what makes `fit="height"`
 * on MediaRenderer actually derive a varying width from `aspect-ratio`;
 * see the Task 3 context note in the plan for why a plain block wrapper
 * doesn't work here. Captions sit below at their natural height, not
 * inside the fixed-height box, so caption line-wrapping never affects
 * the media row's height.
 *
 * `status` (e.g. "LIVE") appears here for the first time in the UI —
 * WorkTile doesn't render it.
 */
export default function TimelineStop({ work, isActive }: TimelineStopProps) {
  const { slug, romanNumeral, category, status, caption, media } = work;
  const captionId = `${work.id}-timeline-caption`;

  return (
    <article aria-labelledby={captionId} className="shrink-0">
      <Link
        href={`/works/${slug}`}
        className={`group block transition-[opacity,filter] duration-[240ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isActive ? "opacity-100 brightness-100" : "opacity-70 brightness-95"
        }`}
      >
        <div className={`flex ${MEDIA_HEIGHT}`}>
          <MediaRenderer media={media} fit="height" />
        </div>
        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.08em] text-mist">
          • {romanNumeral} / {category} · {status}
        </p>
        <p
          id={captionId}
          className="mt-1 max-w-[200px] font-serif text-[15px] italic leading-snug text-ink"
        >
          {caption}
        </p>
      </Link>
    </article>
  );
}
```

- [ ] **Step 9: Run the test to verify it passes**

Run: `npm test -- src/components/timeline/TimelineStop.test.tsx`
Expected: PASS (3 tests)

- [ ] **Step 10: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 11: Commit**

```bash
git add src/components/timeline/TimelineStop.tsx src/components/timeline/TimelineStop.test.tsx src/components/works/WorkTile.tsx src/components/works/WorkTile.test.tsx
git commit -m "$(cat <<'EOF'
feat: add TimelineStop, teach MediaRenderer a height-driven fit mode

TimelineStop needs shared-height/varying-width media tiles, the
opposite of MediaRenderer's existing width-driven default. Adds an
opt-in `fit="height"` mode (existing callers are unaffected by the
default) and wraps it in a single-item fixed-height flex container,
which is what makes aspect-ratio correctly derive a varying width.
EOF
)"
```

---

### Task 4: TimelineAxis (tick-mark ruler)

**Context:** The dense tick-mark scrubber below the media row: many fine unlabeled ticks, year labels at year boundaries, and a progress indicator. Pure presentational — driven by `works` (for year boundaries) and a `progress` ratio (0–1) from HomeTimeline.

**Files:**
- Create: `src/components/timeline/TimelineAxis.tsx`
- Create: `src/components/timeline/TimelineAxis.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/components/timeline/TimelineAxis.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import TimelineAxis from "./TimelineAxis";

describe("TimelineAxis", () => {
  it("renders one year label per distinct year, in the order given", () => {
    render(<TimelineAxis years={["2026", "2025", "2024"]} progress={0} />);
    const labels = screen.getAllByText(/^20\d\d$/).map((el) => el.textContent);
    expect(labels).toEqual(["2026", "2025", "2024"]);
  });

  it("deduplicates repeated years", () => {
    render(<TimelineAxis years={["2026", "2026", "2025"]} progress={0} />);
    expect(screen.getAllByText(/^20\d\d$/)).toHaveLength(2);
  });

  it("positions the progress indicator per the progress ratio", () => {
    render(<TimelineAxis years={["2026", "2025"]} progress={0.5} />);
    const indicator = screen.getByTestId("timeline-axis-progress");
    expect(indicator).toHaveStyle({ left: "50%" });
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- src/components/timeline/TimelineAxis.test.tsx`
Expected: FAIL — `Cannot find module './TimelineAxis'`

- [ ] **Step 3: Write the implementation**

Create `src/components/timeline/TimelineAxis.tsx`:

```tsx
interface TimelineAxisProps {
  /** Years in display order (may repeat — one label per distinct year is shown). */
  years: string[];
  /** Scroll progress, 0 (start) to 1 (end). */
  progress: number;
}

const TICKS_PER_YEAR = 12;

/**
 * The dense tick-mark scrubber below the media row. Fine unlabeled ticks
 * give a sense of temporal density; labels mark each distinct year in
 * `years` (deduplicated, in the order given — this project's data is
 * year-granular, unlike the month-granular reference). The progress
 * indicator is a plain position readout, not itself interactive — the
 * media row above is where scrolling actually happens.
 */
export default function TimelineAxis({ years, progress }: TimelineAxisProps) {
  const distinctYears = years.filter((year, i) => years.indexOf(year) === i);
  const tickCount = Math.max(distinctYears.length * TICKS_PER_YEAR, 1);

  return (
    <div className="relative w-full">
      <div className="flex items-end gap-[2px]" aria-hidden="true">
        {Array.from({ length: tickCount }, (_, i) => (
          <span
            key={i}
            className={
              i % TICKS_PER_YEAR === 0
                ? "h-3 w-px bg-ink-soft"
                : "h-1.5 w-px bg-paper-edge"
            }
          />
        ))}
      </div>
      <div className="mt-2 flex justify-between font-mono text-[10px] uppercase tracking-[0.08em] text-mist">
        {distinctYears.map((year) => (
          <span key={year}>{year}</span>
        ))}
      </div>
      <span
        data-testid="timeline-axis-progress"
        className="absolute top-0 h-3 w-[2px] -translate-x-1/2 bg-ember"
        style={{ left: `${progress * 100}%` }}
      />
    </div>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- src/components/timeline/TimelineAxis.test.tsx`
Expected: PASS (3 tests)

- [ ] **Step 5: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 6: Commit**

```bash
git add src/components/timeline/TimelineAxis.tsx src/components/timeline/TimelineAxis.test.tsx
git commit -m "feat: add TimelineAxis tick-mark ruler component"
```

---

### Task 5: HomeTimeline (orchestrator)

**Context:** This is where scroll physics meets React. Renders the big active-stop title (with `aria-live`), the native horizontal scroll track (scrollbar hidden, reusing the same technique as `.corner-slider__track` in `src/components/corner/ProjectSlider.tsx` — note that component itself isn't part of any currently-routed page, it's precedent from an earlier design direction, but the scrollbar-hiding CSS is sound and worth reusing rather than reinventing), `TimelineStop`s inside it, and `TimelineAxis` below. Wires: vertical-wheel→horizontal redirect, a `requestAnimationFrame` inertia loop, active-stop detection (decoupled from the inertia loop per spec — it must keep working under reduced motion), Left/Right arrow-key stepping, and focus-resync so Tab navigation doesn't fight the inertia loop.

**Files:**
- Create: `src/components/timeline/HomeTimeline.tsx`
- Create: `src/components/timeline/HomeTimeline.test.tsx`
- Modify: `src/app/globals.css` (scrollbar-hiding utility class)

- [ ] **Step 1: Add the scrollbar-hiding utility class**

In `src/app/globals.css`, add near the existing `.nav-link` rules:

```css
/* ── Timeline track — native horizontal scroll, scrollbar hidden ──
   (TimelineAxis's progress indicator is the visible scroll indicator,
   reusing the same technique as .corner-slider__track in
   src/components/corner/ProjectSlider.tsx.) */
.timeline-track {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.timeline-track::-webkit-scrollbar {
  display: none;
}
```

- [ ] **Step 2: Write the failing smoke test**

Full interactive scroll/wheel/rAF physics can't be meaningfully exercised in jsdom (no real layout, no real wheel/scroll event timing) — that's verified manually via the running dev server in Task 6, matching how every other interactive piece in this project has been verified. This test covers what jsdom *can* legitimately check: correct render given data, and that the reduced-motion path doesn't crash.

Create `src/components/timeline/HomeTimeline.test.tsx`:

```tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import HomeTimeline from "./HomeTimeline";
import { works } from "@/data/works";
import { sortWorksForTimeline } from "@/lib/timelineMotion";

function mockMatchMedia(reducedMotion: boolean) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockImplementation((query: string) => ({
      matches: query.includes("prefers-reduced-motion") ? reducedMotion : false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  );
}

describe("HomeTimeline", () => {
  beforeEach(() => {
    mockMatchMedia(false);
  });

  it("renders one stop per Work, plus the active-stop title region", () => {
    render(<HomeTimeline works={works} />);
    expect(screen.getAllByRole("article")).toHaveLength(works.length);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("shows the newest Work's title by default (sorted newest-first)", () => {
    render(<HomeTimeline works={works} />);
    const newest = sortWorksForTimeline(works)[0];
    expect(screen.getByRole("status")).toHaveTextContent(newest.title);
  });

  it("renders without throwing when prefers-reduced-motion is set", () => {
    mockMatchMedia(true);
    expect(() => render(<HomeTimeline works={works} />)).not.toThrow();
  });
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `npm test -- src/components/timeline/HomeTimeline.test.tsx`
Expected: FAIL — `Cannot find module './HomeTimeline'`

- [ ] **Step 4: Write the implementation**

Create `src/components/timeline/HomeTimeline.tsx`:

```tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Work } from "@/data/works";
import {
  classifyWheelGesture,
  clampIndex,
  dampStep,
  findNearestIndex,
  sortWorksForTimeline,
} from "@/lib/timelineMotion";
import TimelineAxis from "./TimelineAxis";
import TimelineStop from "./TimelineStop";

const DAMPING = 0.12;
const WHEEL_TO_SCROLL_RATIO = 1;

interface HomeTimelineProps {
  works: Work[];
}

export default function HomeTimeline({ works }: HomeTimelineProps) {
  const sorted = useMemo(() => sortWorksForTimeline(works), [works]);

  const trackRef = useRef<HTMLDivElement>(null);
  const stopRefs = useRef<Array<HTMLElement | null>>([]);
  const targetRef = useRef(0);
  const reducedMotionRef = useRef(false);
  const rafRef = useRef<number | undefined>(undefined);

  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  // Track prefers-reduced-motion live (not just at mount), since it can
  // change without a page reload.
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotionRef.current = media.matches;
    const onChange = () => {
      reducedMotionRef.current = media.matches;
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  // Active-stop detection: intentionally its own effect, independent of
  // the inertia loop below, so it keeps working under reduced motion
  // (see spec §4 — this is state detection, not animation).
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const detectActive = () => {
      const trackRect = track.getBoundingClientRect();
      const containerCenter = trackRect.left + trackRect.width / 2;
      const centers = stopRefs.current.map((el) => {
        if (!el) return containerCenter;
        const rect = el.getBoundingClientRect();
        return rect.left + rect.width / 2;
      });
      const nearest = findNearestIndex(centers, containerCenter);
      setActiveIndex(nearest);

      const maxScroll = track.scrollWidth - track.clientWidth;
      setProgress(maxScroll > 0 ? track.scrollLeft / maxScroll : 0);
    };

    detectActive();
    track.addEventListener("scroll", detectActive, { passive: true });
    return () => track.removeEventListener("scroll", detectActive);
  }, [sorted.length]);

  // Wheel → horizontal redirect + hand-rolled inertia loop.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    targetRef.current = track.scrollLeft;

    const onWheel = (event: WheelEvent) => {
      if (classifyWheelGesture(event) !== "vertical") return; // let native horizontal scroll handle it
      event.preventDefault();
      const maxScroll = track.scrollWidth - track.clientWidth;
      targetRef.current = Math.max(
        0,
        Math.min(targetRef.current + event.deltaY * WHEEL_TO_SCROLL_RATIO, maxScroll),
      );
    };

    const tick = () => {
      if (reducedMotionRef.current) {
        track.scrollLeft = targetRef.current;
      } else {
        track.scrollLeft = dampStep(track.scrollLeft, targetRef.current, DAMPING);
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    track.addEventListener("wheel", onWheel, { passive: false });
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      track.removeEventListener("wheel", onWheel);
      if (rafRef.current !== undefined) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Arrow-key stepping, scoped to focus within the track (not window).
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const track = trackRef.current;
    if (!track) return;
    const nextIndex = clampIndex(
      activeIndex + (event.key === "ArrowRight" ? 1 : -1),
      sorted.length,
    );
    const nextEl = stopRefs.current[nextIndex];
    if (!nextEl) return;
    targetRef.current = nextEl.offsetLeft;
  };

  // Native Tab-focus triggers the browser's own instant scrollIntoView;
  // resync `target` immediately so the inertia loop doesn't fight it on
  // the next frame.
  const handleFocus = (index: number) => {
    const el = stopRefs.current[index];
    if (el) targetRef.current = el.offsetLeft;
  };

  const activeWork = sorted[activeIndex];

  return (
    <section aria-label="Works timeline" className="flex h-[55vh] flex-col justify-end gap-4">
      <p
        role="status"
        aria-live="polite"
        className="px-[var(--edge-margin)] font-sans text-[28px] font-bold leading-[1.1] tracking-[-0.02em] text-ink md:text-[40px]"
      >
        {activeWork.title} — {activeWork.year}
      </p>
      <div
        ref={trackRef}
        onKeyDown={handleKeyDown}
        className="timeline-track flex items-start gap-6 overflow-x-auto px-[var(--edge-margin)]"
      >
        {sorted.map((work, index) => (
          <div
            key={work.id}
            ref={(el) => {
              stopRefs.current[index] = el;
            }}
            onFocus={() => handleFocus(index)}
          >
            <TimelineStop work={work} isActive={index === activeIndex} />
          </div>
        ))}
      </div>
      <div className="px-[var(--edge-margin)]">
        <TimelineAxis years={sorted.map((w) => w.year)} progress={progress} />
      </div>
    </section>
  );
}
```

**Notes for the implementer:**
- The `h-[55vh]` on the section and `TimelineStop`'s `MEDIA_HEIGHT` (`h-[40vh]`, set in Task 3) are starting values, not final — Task 6 tunes the real height budget against the masthead and Thesis/CornerMark reserves via the browser, the same iterative measure-then-adjust approach used throughout this project. Don't treat these numbers as settled.
- `items-start` on `.timeline-track` is deliberate: each `TimelineStop`'s media box is height-locked (`h-[40vh]`), but the caption text below it varies slightly in height depending on how the caption line-wraps. Without `items-start`, the track's default flex cross-axis behavior (`align-items: stretch`) would stretch every per-stop wrapper `div` to match the tallest sibling, which does nothing useful here (the media box is already fixed) but can visually misalign the caption baselines across stops. `items-start` keeps each stop's own natural height.
- `stopRefs.current[index] = el` inside `.map` mutates a ref array directly — safe here since it's a plain mutable ref, not state, and always re-runs in the same order on every render.
- This component does not itself handle `prefers-reduced-motion` for anything CSS-driven (there isn't any CSS transition to disable here) — the only motion is the JS inertia loop, which is why `reducedMotionRef` is checked inside `tick()` directly rather than relying on the project's global CSS reduced-motion rule (which only reaches `transition`/`animation` properties, not a hand-rolled rAF loop).

- [ ] **Step 5: Run the test to verify it passes**

Run: `npm test -- src/components/timeline/HomeTimeline.test.tsx`
Expected: PASS (3 tests)

- [ ] **Step 6: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors. If `stopRefs.current[index] = el` inside the ref callback produces a strict-mode type complaint about the callback needing to return `void`, wrap it in braces (`(el) => { stopRefs.current[index] = el; }`) — already written that way above.

- [ ] **Step 7: Commit**

```bash
git add src/components/timeline/HomeTimeline.tsx src/components/timeline/HomeTimeline.test.tsx src/app/globals.css
git commit -m "$(cat <<'EOF'
feat: add HomeTimeline orchestrator

Wires the pure timelineMotion helpers to real wheel/scroll/keyboard/
focus events: vertical-wheel-to-horizontal redirect, hand-rolled rAF
inertia, active-stop detection decoupled from the inertia loop (so it
keeps working under prefers-reduced-motion), and arrow-key stepping
that shares the same target-position mechanism as wheel input.
EOF
)"
```

---

## Chunk 3: Integration, Thesis resize, /works retirement, final verification

### Task 6: Wire HomeTimeline into the homepage and tune the height budget

**Context:** Add `HomeTimeline` to `page.tsx`'s middle band, then iteratively verify (via the running dev server + Playwright, matching this project's established methodology) that the whole composition fits one viewport on desktop with no collisions, and that mobile still scrolls naturally.

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Add HomeTimeline to the page**

Current `src/app/page.tsx`:

```tsx
import { studio } from "@/data/studio";
import Wordmark from "@/components/Wordmark";
import Nav from "@/components/Nav";
import Standfirst from "@/components/Standfirst";
import ThesisStatement from "@/components/ThesisStatement";
import CornerMark from "@/components/CornerMark";

export default function Landing() {
  return (
    <main className="relative min-h-screen w-full bg-paper font-sans md:h-screen md:overflow-hidden">
      <div className="static flex flex-col items-start gap-8 px-[var(--edge-margin)] pt-[var(--edge-margin)] md:absolute md:inset-x-0 md:top-0 md:z-10 md:flex-row md:items-start md:justify-between md:gap-0 md:px-[var(--edge-margin)] md:pt-[var(--edge-margin)]">
        <div>
          <Wordmark />
          <Standfirst />
        </div>
        <Nav items={studio.navItems} />
      </div>

      <ThesisStatement />
      <CornerMark />
    </main>
  );
}
```

Replace with:

```tsx
import { studio } from "@/data/studio";
import { works } from "@/data/works";
import Wordmark from "@/components/Wordmark";
import Nav from "@/components/Nav";
import Standfirst from "@/components/Standfirst";
import ThesisStatement from "@/components/ThesisStatement";
import CornerMark from "@/components/CornerMark";
import HomeTimeline from "@/components/timeline/HomeTimeline";

export default function Landing() {
  return (
    <main className="relative min-h-screen w-full bg-paper font-sans md:h-screen md:overflow-hidden">
      <div className="static flex flex-col items-start gap-8 px-[var(--edge-margin)] pt-[var(--edge-margin)] md:absolute md:inset-x-0 md:top-0 md:z-10 md:flex-row md:items-start md:justify-between md:gap-0 md:px-[var(--edge-margin)] md:pt-[var(--edge-margin)]">
        <div>
          <Wordmark />
          <Standfirst />
        </div>
        <Nav items={studio.navItems} />
      </div>

      <div className="mt-8 px-[var(--edge-margin)] md:absolute md:inset-x-0 md:top-[38%] md:mt-0 md:px-0">
        <HomeTimeline works={works} />
      </div>

      <ThesisStatement />
      <CornerMark />
    </main>
  );
}
```

**Important:** this is a **single** mounted `HomeTimeline` instance, toggled between normal document flow (mobile) and absolute positioning (desktop) via responsive classes on one wrapper `div` — matching the exact pattern already used by the masthead `div` and by `ThesisStatement.tsx` in this same file (`static ... md:absolute ...`). Do **not** render two separate `<HomeTimeline>` instances gated by `hidden`/`md:hidden` on sibling wrappers: `HomeTimeline` is a `"use client"` component that starts a `requestAnimationFrame` loop and `scroll`/`wheel` listeners unconditionally in `useEffect`, tied to mount lifetime, not CSS visibility — two mounted instances means two perpetual rAF loops running simultaneously at every viewport width (CSS `display: none` doesn't unmount a component or pause its effects), plus duplicate DOM (two `aria-label="Works timeline"` sections, two `role="status"` regions), which would also break Task 6 Step 2's and Task 9's DOM queries that assume a single match.

**Note:** the `md:top-[38%]` placement and the mobile `mt-8` are starting points, not final — Step 2 below tunes them for real. On mobile this pushes the timeline into normal document flow, below the stacked masthead, consistent with mobile already scrolling per the spec.

- [ ] **Step 2: Start the dev server and measure the actual composition**

Run: `npm run dev` (background)

Then, with Playwright (this project's established verification method — see prior session transcripts for the exact pattern), at minimum:
- Screenshot `/` at 1440×900 and confirm `document.documentElement.scrollHeight === document.documentElement.clientHeight` (no desktop scroll)
- Measure `HomeTimeline`'s rendered `<section>` bounding rect, and `ThesisStatement`'s and `CornerMark`'s rects, confirming no overlap between any pair
- **Confirm the varied-width filmstrip actually renders**, i.e. that Task 3's `fit="height"` flex approach works in a real browser and not just in theory: query the two `article` elements for `placeholder-i` (`aspectRatio: "portrait"`, 3/4) and `placeholder-ii` (`aspectRatio: "square"`, 1/1) — e.g. via each stop's `a[href]` — and get their media box's `getBoundingClientRect()`. Assert both media boxes have the same `height` (within a couple px), and that `placeholder-i`'s width is measurably narrower than `placeholder-ii`'s width, proportional to 3/4 vs 1/1. If instead both widths come out equal, `fit="height"` isn't taking effect — recheck that `TimelineStop`'s media wrapper is a flex container (not a plain block) before touching anything else.
- Screenshot at 375px width (mobile) and confirm the page scrolls naturally with no horizontal overflow (`scrollWidth === clientWidth`)
- Screenshot at 900px width (tablet) for the same checks

If any collision or overflow is found, adjust the `md:top-[...]` percentage, `HomeTimeline`'s `h-[55vh]`/`TimelineStop`'s `MEDIA_HEIGHT`, or Thesis's position (Task 7 may need revisiting in tandem) — then re-measure. Repeat until clean. This is expected to take a few iterations; don't skip re-measuring after each adjustment.

- [ ] **Step 3: Manually verify the interaction**

With the dev server running, in an actual browser (not just Playwright headless measurement):
- Confirm mouse-wheel scrolling over the timeline moves it horizontally, and the page itself does not scroll
- Confirm trackpad/touch horizontal swipe also moves it
- Confirm Tab-ing through the stops moves focus and the view follows without visibly fighting/jittering
- Confirm Left/Right arrow keys (with focus inside the timeline) step between stops
- Confirm the title above the row updates as the active stop changes
- Toggle OS-level "reduce motion" and confirm the timeline snaps instead of easing, and the title still updates

- [ ] **Step 4: Typecheck and build**

Run: `npx tsc --noEmit`
Expected: no errors

Run: `npm run build`
Expected: build succeeds, `/` listed as a static route

- [ ] **Step 5: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: add HomeTimeline to the homepage"
```

---

### Task 7: Resize and reposition ThesisStatement

**Context:** Per spec §3, shrink ~35% at every breakpoint tier (not just the largest), retune position only as needed for clearance now that the timeline occupies real space above it. The right-edge alignment with Nav (both via `--edge-margin`) must be preserved.

**Files:**
- Modify: `src/components/ThesisStatement.tsx`

- [ ] **Step 1: Update the type scale**

Current `src/components/ThesisStatement.tsx`:

```tsx
import { studio } from "@/data/studio";
import { delay, duration } from "@/lib/motion";
import MotionReveal from "./MotionReveal";

export default function ThesisStatement() {
  return (
    <div className="static px-[var(--edge-margin)] pb-8 md:absolute md:bottom-[var(--edge-margin)] md:right-[var(--edge-margin)] md:max-w-[55vw] md:px-0 md:pb-0">
      <MotionReveal delay={delay.thesis} duration={duration.reveal}>
        <p className="thesis text-[36px] font-bold leading-[1] tracking-[-0.03em] text-ink md:text-[48px] lg:text-[clamp(56px,6vw,92px)]">
          {studio.thesis}
        </p>
      </MotionReveal>
    </div>
  );
}
```

Replace the `<p>`'s className (36/48/clamp(56,6vw,92) → 24/32/clamp(36,4vw,60), each ~35% down):

```tsx
        <p className="thesis text-[24px] font-bold leading-[1] tracking-[-0.03em] text-ink md:text-[32px] lg:text-[clamp(36px,4vw,60px)]">
```

- [ ] **Step 2: Re-measure clearance against the timeline (desktop)**

With the dev server running, re-run the same Playwright measurement from Task 6 Step 2, confirming Thesis's rect still doesn't overlap `HomeTimeline`'s section or `CornerMark`. Since Thesis is now smaller, this should only get easier to satisfy, but verify rather than assume — if Task 6's height budget was tuned assuming the *old*, larger Thesis size, there may now be room to loosen `HomeTimeline`'s own height slightly; that's a judgment call, not required.

- [ ] **Step 3: Confirm right-edge alignment with Nav still holds**

Measure `document.querySelector('nav').getBoundingClientRect().right` and `document.querySelector('p.thesis').getBoundingClientRect().right` at 1440×900 — should be equal (both reference `--edge-margin`, unchanged by this task).

- [ ] **Step 4: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 5: Commit**

```bash
git add src/components/ThesisStatement.tsx
git commit -m "$(cat <<'EOF'
style: shrink ThesisStatement ~35% at every breakpoint

Makes room for the new homepage timeline above it. Right-edge
alignment with Nav is unaffected (both reference --edge-margin).
EOF
)"
```

---

### Task 8: Retire the standalone /works room page

**Context:** Per spec, `/works` (the index page) is deleted; `/works/[slug]` case-study pages are untouched; Nav's "works" link points to `/`. `WorkGrid.tsx`/`WorkTile.tsx` are left in place (unused by this spec, but `WorkTile.tsx` is still imported by the new `TimelineStop.tsx` for `MediaRenderer`, and both may be reused by the deferred grid-Works-view work) — do not delete them.

**Files:**
- Delete: `src/app/works/page.tsx`
- Modify: `src/data/studio.ts:navItems` (works href: `/works` → `/`)

- [ ] **Step 1: Update the Nav href**

In `src/data/studio.ts`, find:

```typescript
    { label: "works", href: "/works", room: "works" },
```

Replace with:

```typescript
    { label: "works", href: "/", room: "works" },
```

- [ ] **Step 2: Delete the works index page**

```bash
git rm src/app/works/page.tsx
```

- [ ] **Step 3: Verify no other file imports the deleted page or its now-orphaned WorkGrid usage**

Run: `grep -rn "components/works/WorkGrid" src/app/`
Expected: no matches (confirms `WorkGrid` is now only imported by the deleted page, and nothing else references it — consistent with Task's context note that it's intentionally left in place but unused)

- [ ] **Step 4: Typecheck and build**

Run: `npx tsc --noEmit`
Expected: no errors

Run: `npm run build`
Expected: build succeeds; `/works` is no longer in the route list; `/works/[slug]` (with its existing `generateStaticParams` paths) still is

- [ ] **Step 5: Verify routing behavior manually**

With the dev server running:
- `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/works` → expect `404`
- `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/works/placeholder-i` → expect `200`

- [ ] **Step 6: Verify the Nav active-state fix from Task 1 actually resolves the bug it was written for**

Navigate to `/works/placeholder-i` in a browser (or via Playwright) and confirm the "works" nav tab shows its active-state underline — this is the exact scenario Task 1's `isNavItemActive` fix exists for; confirm it end-to-end now that the href has actually changed.

- [ ] **Step 7: Commit**

```bash
git add src/data/studio.ts
git commit -m "$(cat <<'EOF'
feat: retire standalone /works room page

Nav's "works" link now points home, where the new timeline lives.
/works/[slug] case-study pages are unaffected. WorkGrid.tsx/WorkTile.tsx
are left in place (WorkTile's MediaRenderer is still used by
TimelineStop; both may be reused by the deferred grid-Works-view work).
EOF
)"
```

---

### Task 9: Full verification pass

**Context:** Same rigor as every prior verification pass in this project: typecheck, build, full test suite, visual/interaction checks across breakpoints, accessibility spot-checks.

**Files:** none (verification only)

- [ ] **Step 1: Run the full test suite**

Run: `npm test`
Expected: all tests pass, including every test file added in this plan (`navActive.test.ts`, `timelineMotion.test.ts`, `TimelineStop.test.tsx`, `TimelineAxis.test.tsx`, `HomeTimeline.test.tsx`) plus the pre-existing `TransitionProvider.test.tsx`

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Production build**

Run: `npm run build`
Expected: succeeds, no new warnings beyond the pre-existing unrelated ones (browserslist, package.json module-type notice)

- [ ] **Step 4: Full-site screenshot pass**

With the dev server running, screenshot `/`, `/works/placeholder-i`, `/archive`, `/references`, `/info` at 1440×900, 900×900 (tablet), and 375×812 (mobile). Confirm:
- No horizontal overflow at any width (`scrollWidth === clientWidth`)
- No vertical scroll on `/` at desktop/tablet widths
- No visual collisions between the timeline, Thesis, CornerMark, and masthead at any of the three widths
- The "works" nav tab is active on `/` and on `/works/placeholder-i`, and correctly inactive elsewhere

- [ ] **Step 5: Accessibility spot-check**

- Tab through the entire homepage keyboard-only; confirm every interactive element (nav links, timeline stops, thesis if it becomes a link — it isn't — corner mark has none) gets a visible focus ring (2px ember, 2px offset, per the global `:focus-visible` rule)
- Confirm the timeline's `aria-live="polite"` region is present and updates (inspect via browser devtools accessibility tree, or a screen reader if available)
- Confirm reduced-motion (OS setting or Playwright's `reducedMotion: 'reduce'` context option) disables the timeline's easing without breaking the title updates

- [ ] **Step 6: Final commit (if any cleanup was needed)**

If Steps 1–5 required any fixes, commit them now with a clear message. If everything already passed cleanly, there's nothing to commit here — the plan is complete as of Task 8's commit.
