# Multi-View Studio Portfolio Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a multi-view homepage (Index/Drift/Archive) with GSAP FLIP transitions between views, detail overlays, preloader choreography, and light/dark mode.

**Architecture:** Single homepage with 3 view modes sharing the same 14-item content pool. GSAP FLIP animates items between views. framer-motion handles UI animations (hovers, overlays). Zustand manages view state, theme, overlay. Only 2 routes: `/` and `/about`.

**Tech Stack:** Next.js 16, TypeScript, Tailwind v4, GSAP (FLIP plugin), framer-motion, Lenis, Zustand

**Spec:** `docs/superpowers/specs/2026-03-27-multiview-studio-design.md`

---

## File Structure

### New files
- `src/components/Preloader.tsx` — Homepage entrance choreography (GSAP timeline)
- `src/components/ViewSwitcher.tsx` — Index/Drift/Archive toggle with animated underline
- `src/components/views/IndexView.tsx` — Dense 5-col grid layout
- `src/components/views/DriftView.tsx` — 3D perspective fan with scroll-linked wave
- `src/components/views/ArchiveView.tsx` — Chronological timeline by year
- `src/components/GridItem.tsx` — Shared thumbnail component across all views
- `src/components/BlueDot.tsx` — Pulsing blue indicator on item 01
- `src/components/DetailOverlay.tsx` — FLIP-expand project detail panel
- `src/components/BottomBar.tsx` — Fixed bottom info bar
- `src/components/NYCClock.tsx` — Live EST clock
- `src/components/ThemeToggle.tsx` — Light/dark mode switch
- `src/lib/gsap.ts` — GSAP + FLIP plugin registration
- `src/lib/theme.ts` — Time-of-day theme detection + localStorage persistence
- `src/lib/flip.ts` — FLIP transition utility (record state, animate between views)

### Rewritten
- `src/app/globals.css` — Add dark mode tokens via `[data-theme="dark"]`, add Drift 3D styles
- `src/app/layout.tsx` — Add theme provider, GSAP setup, Preloader
- `src/app/page.tsx` — ViewSwitcher + active view + DetailOverlay + BottomBar
- `src/components/GlobalNav.tsx` — Brand mark center, view switcher left, clock+about right
- `src/components/MobileMenu.tsx` — Add view links
- `src/lib/store.ts` — Add view state, theme state, overlay state, preloader state
- `src/constants/sheet-items.ts` — Add `number` field (01-14), `gallery` array

### Kept as-is
- `src/fonts/` — All font files
- `src/constants/projects.ts`, `case-studies.ts`, `explorations.ts`, `journal.ts`, `contact.ts`
- `src/components/RouteAnnouncer.tsx`
- `src/hooks/useReducedMotion.ts`
- `src/lib/utils.ts`
- `public/images/`, `public/assets/`

### Deleted
- `src/components/ContactSheet.tsx` — Replaced by IndexView
- `src/components/SheetItem.tsx` — Replaced by GridItem

---

## Chunk 1: Foundation — GSAP, Store, Theme, Tokens

### Task 1: Install GSAP and register FLIP plugin

**Files:**
- Modify: `package.json`
- Create: `src/lib/gsap.ts`

- [ ] **Step 1: Install GSAP**

```bash
cd "c:/Users/Ryan Jun/.gemini/antigravity/scratch/hkjstudio"
npm install gsap
```

- [ ] **Step 2: Create GSAP registration file**

Create `src/lib/gsap.ts`:

```typescript
import { gsap } from "gsap";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(Flip, ScrollTrigger);
}

export { gsap, Flip, ScrollTrigger };
```

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json src/lib/gsap.ts
git commit -m "chore: install gsap, register FLIP + ScrollTrigger plugins"
```

### Task 2: Expand Zustand store

**Files:**
- Rewrite: `src/lib/store.ts`

- [ ] **Step 1: Rewrite store with all state slices**

```typescript
import { create } from "zustand";

export type ViewMode = "index" | "drift" | "archive";
export type ThemeMode = "light" | "dark";

interface StudioStore {
  // View
  activeView: ViewMode;
  setActiveView: (view: ViewMode) => void;

  // Theme
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;

  // Mobile menu
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;

  // Detail overlay
  activeItemId: string | null;
  setActiveItemId: (id: string | null) => void;

  // Preloader
  preloaderDone: boolean;
  setPreloaderDone: (done: boolean) => void;
}

export const useStudioStore = create<StudioStore>((set) => ({
  activeView: "index",
  setActiveView: (view) => set({ activeView: view }),

  theme: "light",
  setTheme: (theme) => set({ theme }),
  toggleTheme: () => set((s) => ({ theme: s.theme === "light" ? "dark" : "light" })),

  mobileMenuOpen: false,
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),

  activeItemId: null,
  setActiveItemId: (id) => set({ activeItemId: id }),

  preloaderDone: false,
  setPreloaderDone: (done) => set({ preloaderDone: done }),
}));
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/store.ts
git commit -m "feat: expand Zustand store — view, theme, overlay, preloader state"
```

### Task 3: Create theme system

**Files:**
- Create: `src/lib/theme.ts`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Create theme detection + persistence utility**

Create `src/lib/theme.ts`:

```typescript
import type { ThemeMode } from "./store";

export function getInitialTheme(): ThemeMode {
  if (typeof window === "undefined") return "light";

  // Check localStorage override
  const stored = localStorage.getItem("hkj-theme");
  if (stored === "light" || stored === "dark") return stored;

  // Time-of-day default (NYC EST = UTC-5, EDT = UTC-4)
  const now = new Date();
  const nyc = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }));
  const hour = nyc.getHours();
  return (hour >= 6 && hour < 18) ? "light" : "dark";
}

export function applyTheme(theme: ThemeMode) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("hkj-theme", theme);
}
```

- [ ] **Step 2: Add dark mode tokens to globals.css**

Add to `src/app/globals.css` after the `:root` block:

```css
[data-theme="dark"] {
  --paper: #0a0908;
  --ink-full: rgba(240, 235, 227, 1.00);
  --ink-primary: rgba(240, 235, 227, 0.85);
  --ink-secondary: rgba(240, 235, 227, 0.55);
  --ink-muted: rgba(240, 235, 227, 0.38);
  --ink-faint: rgba(240, 235, 227, 0.20);
  --ink-ghost: rgba(240, 235, 227, 0.10);
  --ink-whisper: rgba(240, 235, 227, 0.05);
  --ink-rgb: 240, 235, 227;
}
```

Also remove `overflow: hidden` from `body` (views may need scroll). Instead add:
```css
[data-view="index"] { overflow: hidden; height: 100vh; }
[data-view="drift"] { overflow-x: hidden; }
[data-view="archive"] { overflow-x: hidden; }
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/theme.ts src/app/globals.css
git commit -m "feat: add theme system — time-of-day default + dark mode tokens"
```

### Task 4: Update sheet-items.ts with numbers

**Files:**
- Modify: `src/constants/sheet-items.ts`

- [ ] **Step 1: Add `number` and `gallery` fields to SheetItemData**

Add to the interface:
```typescript
number: string; // "01" through "14"
gallery?: string[]; // additional images for detail overlay
```

Add `number: "01"` through `number: "14"` to each item in order. Add empty `gallery: []` to items with no additional images.

- [ ] **Step 2: Commit**

```bash
git add src/constants/sheet-items.ts
git commit -m "feat: add numbered items (01-14) + gallery fields to sheet items"
```

---

## Chunk 2: Core Components — GridItem, BlueDot, Views

### Task 5: Create GridItem component

**Files:**
- Create: `src/components/GridItem.tsx`
- Delete: `src/components/SheetItem.tsx`

- [ ] **Step 1: Create GridItem**

`"use client"` component. Shared across all 3 views. Props: `{ item: SheetItemData; style?: React.CSSProperties; className?: string }`.

Key behaviors:
- Wraps in `motion.div` with `whileHover={{ scale: 1.05 }}` spring (stiffness 400, damping 30)
- `data-flip-id={item.id}` attribute on the root — GSAP FLIP uses this to match items across views
- Image: `<Image fill sizes="20vw" className="object-cover" />` with `border-radius: 6px`, `overflow: hidden`
- Color field items: div with `backgroundColor` + grain pattern
- Number badge: `item.number` at top-left, Fragment Mono 9px, `--ink-whisper`
- Type tag on hover: bottom-right, Fragment Mono 9px, fades in
- WIP badge if `item.wip`
- Shadow on hover: `boxShadow: "0 8px 32px rgba(var(--ink-rgb), 0.08)"`
- `onClick`: calls `setActiveItemId(item.id)` from Zustand store

- [ ] **Step 2: Delete SheetItem.tsx**

```bash
rm -f src/components/SheetItem.tsx
```

- [ ] **Step 3: Commit**

```bash
git add src/components/GridItem.tsx
git rm src/components/SheetItem.tsx
git commit -m "feat: add GridItem — shared thumbnail with FLIP data attributes"
```

### Task 6: Create BlueDot (keep from v2)

**Files:**
- Keep: `src/components/BlueDot.tsx` (already exists from contact sheet build)

No changes needed. The BlueDot component already has the pulse animation and tooltip. Skip this task.

### Task 7: Create IndexView

**Files:**
- Create: `src/components/views/IndexView.tsx`
- Delete: `src/components/ContactSheet.tsx`

- [ ] **Step 1: Create IndexView**

`"use client"` component. The dense 5-column grid.

- Imports `SHEET_ITEMS` and renders each as `<GridItem>`
- CSS Grid: `gridTemplateColumns: repeat(5, 1fr)`, gap `8px`, `maxWidth: 1200px`, centered
- Wide items: `gridColumn: "span 2"` based on `item.wide`
- Grid wrapper: `display: flex`, `alignItems: center`, `justifyContent: center`, `height: calc(100vh - 88px)` (56px nav + 32px bottom bar)
- First item has `<BlueDot>` positioned above it
- Each item wrapped in a div with `data-flip-id={item.id}` for FLIP targeting
- No entrance animation here — the Preloader handles that

- [ ] **Step 2: Delete ContactSheet.tsx**

```bash
rm -f src/components/ContactSheet.tsx
```

- [ ] **Step 3: Commit**

```bash
git add src/components/views/IndexView.tsx
git rm src/components/ContactSheet.tsx
git commit -m "feat: add IndexView — dense 5-col grid for FLIP system"
```

### Task 8: Create DriftView

**Files:**
- Create: `src/components/views/DriftView.tsx`

- [ ] **Step 1: Create DriftView**

`"use client"` component. The 3D perspective fan.

- Container: `perspective: 1000px`, `transformStyle: preserve-3d`, `height: calc(100vh - 88px)`, `overflow: hidden`
- Items arranged in a horizontal arc using absolute positioning or flexbox with transform
- Each item gets unique transform values based on its index:
  - `rotateY`: varies from -15deg to +15deg across items
  - `rotateX`: subtle ±3deg
  - `translateZ`: varies -50px to +50px (depth)
  - `translateX`: spread horizontally across the viewport
- All items have `data-flip-id={item.id}` for FLIP
- Container is scrollable (Lenis) — scroll position modulates the rotation values:
  - Use `useEffect` + Lenis `scroll` event to track velocity
  - Higher velocity = wider rotation range (±25deg max)
  - On stop: ease back to calm (±5deg)
- Image skew on scroll: `skewY(±2deg)` based on scroll direction via GSAP quickTo
- `cursor: grab` on container
- Hover on item: `translateZ(30px)` forward + reduce rotation (straighten)

This is the most complex component. Take care with:
- The 3D transforms must not break FLIP calculations (use `data-flip-id` on a wrapper div, not the transformed element itself)
- Performance: use `will-change: transform` on items
- Reduced motion: disable 3D, show items in a simple horizontal row

- [ ] **Step 2: Commit**

```bash
git add src/components/views/DriftView.tsx
git commit -m "feat: add DriftView — 3D perspective fan with scroll-linked wave"
```

### Task 9: Create ArchiveView

**Files:**
- Create: `src/components/views/ArchiveView.tsx`

- [ ] **Step 1: Create ArchiveView**

`"use client"` component. Chronological timeline.

- Group `SHEET_ITEMS` by `year` (descending: 2026, 2025)
- Each year section:
  - Year label: display font, large (`clamp(36px, 5vw, 56px)`)
  - Horizontal row of items: `display: flex`, `gap: 16px`, `overflowX: auto`, scrollbar hidden
  - Items sized by type: WORK = 280px wide, BRAND = 240px wide, EXPLORE = 200px wide
  - Each item rendered as `<GridItem>` with `data-flip-id`
- Vertical scroll between year sections
- Year sections have `paddingTop: var(--space-section)`

- [ ] **Step 2: Commit**

```bash
git add src/components/views/ArchiveView.tsx
git commit -m "feat: add ArchiveView — chronological timeline by year"
```

---

## Chunk 3: FLIP System, View Switching, Nav

### Task 10: Create FLIP transition utility

**Files:**
- Create: `src/lib/flip.ts`

- [ ] **Step 1: Create FLIP utility**

```typescript
import { Flip } from "@/lib/gsap";

/**
 * Captures FLIP state of all items with data-flip-id,
 * then after the view changes, animates them to new positions.
 */
export function flipTransition(
  container: HTMLElement,
  onViewChange: () => void,
  options?: { duration?: number; ease?: string; onComplete?: () => void }
) {
  const items = container.querySelectorAll("[data-flip-id]");
  const state = Flip.getState(items);

  // Change the view (this triggers React re-render with new layout)
  onViewChange();

  // After next frame, animate from old state to new state
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const newItems = container.querySelectorAll("[data-flip-id]");
      Flip.from(state, {
        targets: newItems,
        duration: options?.duration ?? 0.6,
        ease: options?.ease ?? "expo.out",
        absolute: true,
        onComplete: options?.onComplete,
      });
    });
  });
}
```

Note: The double `requestAnimationFrame` ensures React has committed the DOM changes before FLIP calculates the new positions.

- [ ] **Step 2: Commit**

```bash
git add src/lib/flip.ts
git commit -m "feat: add FLIP transition utility for view switching"
```

### Task 11: Create ViewSwitcher

**Files:**
- Create: `src/components/ViewSwitcher.tsx`

- [ ] **Step 1: Create ViewSwitcher**

`"use client"` component. Three text buttons: Index, Drift, Archive.

- Uses `useStudioStore` for `activeView` and `setActiveView`
- Each button: Fragment Mono, 11px, uppercase, tracking 0.06em
- Active: `--ink-full` + animated underline (`scaleX(0→1)`, `transform-origin` based on direction)
- Inactive: `--ink-muted`
- Hover: `--ink-secondary`
- On click: calls the FLIP transition via a ref to the view container (passed as prop or context)
- Gap between buttons: 24px
- Underline: 1px solid `--ink-full`, `transition: transform 0.3s cubic-bezier(.23,1,.32,1)`

- [ ] **Step 2: Commit**

```bash
git add src/components/ViewSwitcher.tsx
git commit -m "feat: add ViewSwitcher — Index/Drift/Archive toggle with underline"
```

### Task 12: Rewrite GlobalNav

**Files:**
- Rewrite: `src/components/GlobalNav.tsx`

- [ ] **Step 1: Rewrite GlobalNav with brand mark + view switcher + clock**

`"use client"` component. Fixed top, 56px height, z-100, transparent bg.

Layout: 3 zones

- **Left:** `<ViewSwitcher />` (desktop only, hidden on mobile)
- **Center:** `HKJ/2026` — display font, bold, `clamp(20px, 3vw, 32px)`, `--ink-full`. Links to `/` (resets to Index view).
- **Right:** `<NYCClock />` + `<ThemeToggle />` + `<Link href="/about">ABOUT</Link>` (Fragment Mono 11px)
- **Mobile (<768px):** Left shows hamburger, center shows `HKJ`, right shows `ABOUT`

Padding: `0 24px`. Flex layout, `justify-between`, `align-center`.

- [ ] **Step 2: Commit**

```bash
git add src/components/GlobalNav.tsx
git commit -m "feat: rewrite GlobalNav — brand mark center, views left, clock right"
```

### Task 13: Create NYCClock

**Files:**
- Create: `src/components/NYCClock.tsx`

- [ ] **Step 1: Create NYCClock**

`"use client"` component. Displays live NYC time.

- `useState` for time string, `useEffect` with `setInterval(1000)` (but only update displayed string every minute to avoid unnecessary re-renders — compare formatted string before setting)
- Format: `9:02 PM EST` — Fragment Mono, `--text-meta` size, `--ink-muted`
- Uses `toLocaleString("en-US", { timeZone: "America/New_York", hour: "numeric", minute: "2-digit", hour12: true })`
- Append `EST` or `EDT` based on current offset

- [ ] **Step 2: Commit**

```bash
git add src/components/NYCClock.tsx
git commit -m "feat: add NYCClock — live EST time display"
```

### Task 14: Create ThemeToggle

**Files:**
- Create: `src/components/ThemeToggle.tsx`

- [ ] **Step 1: Create ThemeToggle**

`"use client"` component. Small sun/moon icon toggle.

- Uses `useStudioStore` for `theme` and `toggleTheme`
- On click: toggles theme, calls `applyTheme()` from `src/lib/theme.ts`
- Icon: sun (☀) for light mode, moon (☾) for dark mode — rendered as text, 12px, `--ink-muted`
- `transition: opacity 150ms`
- `aria-label: "Toggle dark mode"`

- [ ] **Step 2: Commit**

```bash
git add src/components/ThemeToggle.tsx
git commit -m "feat: add ThemeToggle — light/dark mode switch"
```

---

## Chunk 4: Detail Overlay, Preloader, Homepage

### Task 15: Create DetailOverlay

**Files:**
- Create: `src/components/DetailOverlay.tsx`

- [ ] **Step 1: Create DetailOverlay**

`"use client"` component. Opens when `activeItemId` is set in store.

- Uses `AnimatePresence` + `motion.div` for enter/exit
- Background dimmer: fixed overlay, `bg rgba(var(--ink-rgb), 0.3)`, `pointer-events: auto`
- Content: the clicked item's image FLIP-expands to ~80% viewport width, centered
  - Use GSAP FLIP: on open, record the thumbnail's rect, then animate to the expanded rect
  - On close, reverse the FLIP
- Detail panel: slides in from right (or below on mobile) with `motion.div`
  - Number: Fragment Mono, large, `--ink-muted`
  - Title: display font, large
  - Description: Satoshi, body size
  - Tags: Fragment Mono, uppercase
  - Gallery: horizontal thumbnail strip if `item.gallery` has items
  - External link if `item.href`
- Close: click dimmer, press Escape, or click "×" button
- Body scroll lock when open

- [ ] **Step 2: Commit**

```bash
git add src/components/DetailOverlay.tsx
git commit -m "feat: add DetailOverlay — FLIP-expand detail panel"
```

### Task 16: Create Preloader

**Files:**
- Create: `src/components/Preloader.tsx`

- [ ] **Step 1: Create Preloader**

`"use client"` component. Homepage entrance choreography using GSAP timeline.

- Checks `sessionStorage.getItem("hkj-visited")` for repeat visits
- Uses `useStudioStore` for `setPreloaderDone`

**First visit sequence (GSAP timeline):**
1. Phase 1 (0–0.5s): `HKJ/2026` fades in at viewport center (large, display font). Use `gsap.fromTo` on a centered div.
2. Phase 2 (0.5–1.2s): Nav elements fade in with stagger. `HKJ/2026` animates from center to nav position using GSAP (position + scale change). View switcher underline animates to "Index".
3. Phase 3 (1.2–2.5s): Grid items enter — each `[data-flip-id]` element animates from off-screen with `rotation`, `skew`, `blur`, `scale(0.8)` to final position. Stagger 0.04s. Spring-like overshoot via GSAP ease `back.out(1.2)`.
4. Phase 4 (2.5s): Set `preloaderDone(true)`, set `sessionStorage.setItem("hkj-visited", "1")`.

**Repeat visit:** Skip Phase 1-2. Items stagger in with less displacement (0.02s stagger, shorter distance). Total ~0.8s.

**Reduced motion:** Skip all. Set `preloaderDone(true)` immediately.

The Preloader renders nothing visible — it orchestrates GSAP animations on existing DOM elements. It's a controller, not a visual component.

- [ ] **Step 2: Commit**

```bash
git add src/components/Preloader.tsx
git commit -m "feat: add Preloader — homepage entrance choreography"
```

### Task 17: Rewrite homepage (page.tsx)

**Files:**
- Rewrite: `src/app/page.tsx`

- [ ] **Step 1: Rewrite homepage**

`"use client"` component (needs store access).

```tsx
- Imports: IndexView, DriftView, ArchiveView, BottomBar, DetailOverlay, Preloader
- Uses useStudioStore for activeView, preloaderDone
- Ref on the view container div for FLIP targeting

- Renders:
  <div data-view={activeView} ref={viewContainerRef}>
    {activeView === "index" && <IndexView />}
    {activeView === "drift" && <DriftView />}
    {activeView === "archive" && <ArchiveView />}
  </div>
  <BottomBar />
  <DetailOverlay />
  <Preloader containerRef={viewContainerRef} />
```

The `data-view` attribute on the container drives CSS overflow behavior per view.

- [ ] **Step 2: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: rewrite homepage — multi-view with Preloader + DetailOverlay"
```

### Task 18: Rewrite layout.tsx

**Files:**
- Rewrite: `src/app/layout.tsx`

- [ ] **Step 1: Rewrite layout**

- Keep font declarations (Newsreader, Satoshi, Fragment Mono)
- Add `suppressHydrationWarning` on `<html>` (for theme attribute)
- Add a `ThemeInitializer` client component (or inline script) that:
  - Reads `localStorage` or time-of-day
  - Sets `data-theme` on `<html>` before paint (to avoid flash)
  - This should be a `<script dangerouslySetInnerHTML>` in `<head>` for zero-FOUC
- Body: font variables, `<GlobalNav />`, `<main>{children}</main>`, `<RouteAnnouncer />`
- No Lenis on homepage (views handle their own scroll)

- [ ] **Step 2: Commit**

```bash
git add src/app/layout.tsx
git commit -m "refactor: rewrite layout — theme initializer, minimal shell"
```

---

## Chunk 5: About Page, Mobile, Polish, Build

### Task 19: Rewrite MobileMenu

**Files:**
- Rewrite: `src/components/MobileMenu.tsx`

- [ ] **Step 1: Rewrite MobileMenu with view links**

Same structure as v2 but add view switcher links:
- "Index", "Drift", "Archive" — each sets the view and closes the menu
- "About" — navigates to `/about`
- Contact email + socials at bottom

- [ ] **Step 2: Commit**

```bash
git add src/components/MobileMenu.tsx
git commit -m "feat: rewrite MobileMenu — add view switcher links"
```

### Task 20: Rewrite About page

**Files:**
- Rewrite: `src/app/about/page.tsx`

- [ ] **Step 1: Rewrite About page**

A distinct visual expression. Use `data-page-scrollable` for scroll. Key sections:
- Bio (who you are, what you do)
- Philosophy (how you think about design)
- Experience
- Contact + socials

Use framer-motion `whileInView` for section reveals. The About page should feel different from the homepage — could use a different background treatment, larger type, or editorial layout.

- [ ] **Step 2: Commit**

```bash
git add src/app/about/page.tsx
git commit -m "feat: rewrite About page — distinct editorial expression"
```

### Task 21: Delete dead pages and files

**Files:**
- Delete: `src/app/exploration/page.tsx`
- Delete: `src/app/writing/page.tsx`
- Delete: `src/app/writing/[slug]/page.tsx`
- Delete: `src/app/work/[slug]/page.tsx`

These routes no longer exist — all content is accessed via the homepage detail overlay.

Also clean up:
- Delete `src/components/ContactSheet.tsx` if not already deleted
- Delete any remaining dead files

- [ ] **Step 1: Delete dead pages**

```bash
rm -rf src/app/exploration src/app/writing src/app/work
rm -f src/components/ContactSheet.tsx src/components/SheetItem.tsx
```

- [ ] **Step 2: Update next.config.ts redirects**

Add redirects for old routes to `/`:
```typescript
{ source: "/work/:slug", destination: "/", permanent: false },
{ source: "/exploration", destination: "/", permanent: false },
{ source: "/writing", destination: "/", permanent: false },
{ source: "/writing/:slug", destination: "/", permanent: false },
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "chore: delete dead pages — all content via homepage overlay"
```

### Task 22: Build check and fix errors

- [ ] **Step 1: Run build**

```bash
npm run build
```

- [ ] **Step 2: Fix all errors**

Common issues: missing imports, type errors, GSAP SSR issues (wrap in `typeof window` checks), framer-motion ease types.

- [ ] **Step 3: Commit fixes**

```bash
git add -A
git commit -m "fix: resolve build errors"
```

### Task 23: Push and deploy

- [ ] **Step 1: Push**

```bash
git push origin master
```
