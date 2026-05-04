# Hero / Preloader / Theme / Typography Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the hero/preloader/theme/typography spec ([2026-05-02-hero-preloader-theme-typography-design.md](../specs/2026-05-02-hero-preloader-theme-typography-design.md)) — five coupled changes that transform the home page from a single-register catalog into a dark-or-light themed site fronted by an aino-derived hero with a session-gated ASCII preloader.

**Architecture:** Six phases ship in sequence. Phase 1 lays theme tokens + `useTheme` hook + inline init script. Phase 2 builds the `ThemeToggle` UI inside a new `ReservedZone` container. Phase 3 swaps Geist Sans → PP Neue Montreal via `next/font/local`. Phase 4 rewrites the home page grid from 2-col to 3-col and integrates `ReservedZone` + `ViewToggle` into one cell. Phase 5 adds the `ScrambleText` primitive on tile titles. Phase 6 ships the preloader (server-rendered DOM + client dismiss + inline init script). Phases 1–4 are independently shippable; 5–6 are additive.

**Tech Stack:** Next.js 15 (app router), React 19, TypeScript strict, Tailwind v4 + CSS variables, vitest + jsdom + @testing-library/react (existing test infra from monograph rollout), `next/font/local` for PP Neue Montreal. No GSAP, no Framer Motion, no Three.js.

**Verification posture:** Per-task `npx tsc --noEmit` + `npm run lint` + `npm run build`. Unit tests on logic-bearing units (`useTheme`, `usePreloaderState`, `ScrambleText` eligibility). Visual components rely on type check + manual smoke. Phase 6 also requires `Save-Data: on` smoke test (DevTools header).

---

## File Structure

### Files to create

| Path | Phase | Responsibility |
|---|---|---|
| `src/hooks/useTheme.ts` | 1 | `{ theme, setTheme, toggle }` hook. DOM `data-theme` is canonical; localStorage write-only. `useSyncExternalStore` shape. |
| `src/hooks/__tests__/useTheme.test.ts` | 1 | Default time-of-day, persistence, toggle, invalid-storage. |
| `src/components/ThemeInit.tsx` | 1 | Server component, inline `<script>` for `<head>`. Reads localStorage; falls back to time-of-day. Sets `data-theme`. |
| `src/components/ThemeToggle.tsx` | 2 | Client. Sun/moon glyph button. Calls `useTheme.toggle`. Rotate-on-hover. |
| `src/components/ReservedZone.tsx` | 2 | Client. Grid-cell-shaped container. Holds `ThemeToggle` + `ViewToggle` + future content. |
| `public/fonts/PPNeueMontreal-Regular.woff2` | 3 | PP Neue Montreal Regular (400) — self-hosted from Pangram Pangram free distribution. |
| `public/fonts/PPNeueMontreal-Medium.woff2` | 3 | PP Neue Montreal Medium (500). |
| `src/components/ScrambleText.tsx` | 5 | Client. Splits text into per-character spans. Triggers character-cycle on hover-enter. ASCII-eligibility-only. |
| `src/components/__tests__/ScrambleText.test.tsx` | 5 | Eligibility regex, edge cases (0 eligible, fewer-than-count eligible), aria attribution. |
| `src/components/Preloader.tsx` | 6 | Server. Renders preloader DOM (background, ASCII video element, caption, dismiss hint). Mounts `PreloaderInit` + `PreloaderClient`. |
| `src/components/PreloaderInit.tsx` | 6 | Server. Inline `<script>` reading `localStorage('hkj.preloader.dismissed')` and setting `data-preloader-state`. |
| `src/components/PreloaderClient.tsx` | 6 | Client. Document-level click/keydown listener. Runs exit animation. Writes localStorage. |
| `src/hooks/usePreloaderState.ts` | 6 | Hook for the preloader state — `useSyncExternalStore` shape, DOM canonical. |
| `src/hooks/__tests__/usePreloaderState.test.ts` | 6 | Default active, persistence (localStorage), dismiss flow. |
| `public/assets/preloader-ascii.webm` | 6 | Pre-rendered ASCII video asset. ≤1.5MB target. Phyllotaxis (default) or chosen dataset. |
| `public/assets/preloader-ascii-frame.png` | 6 | Static first-frame fallback for `prefers-reduced-data` and `.webm`-unsupported clients. |

### Files to modify

| Path | Phase | Change |
|---|---|---|
| `src/app/globals.css` | 1 | Add `html[data-theme="dark"]` token block. Add `--microtype-tracking` token (light: 0.12em; dark: 0.11em). |
| `src/components/WorkPlate.tsx` | 1, 5 | Replace inline `letter-spacing: 0.12em` on `.plate__role`/`.plate__meta` with `var(--microtype-tracking)`. Phase 5: wrap `.plate__title` text in `<ScrambleText>`. |
| `src/components/WorkList.tsx` | 1 | Same microtype-tracking var swap on `.worklist__num`/`.worklist__year`/`.worklist__role`. |
| `src/app/page.tsx` | 1, 2, 4, 6 | Phase 1: footer microtype tracking var swap. Phase 2: mount `ReservedZone` at end of existing 2-col grid (transitional). Phase 4: switch `.home__gallery` to 3-col grid; reserved zone occupies row 1 col 3; flow rule for piece cells; mobile collapse rule. Phase 6: mount `<Preloader>` and `<PreloaderInit>`. |
| `src/app/layout.tsx` | 1, 3 | Phase 1: mount `<ThemeInit>` in `<head>` (or as top of body since Next.js App Router restricts head children — see Phase 1 task notes). Phase 3: replace `import { GeistSans } from "geist/font/sans"` with `next/font/local` PP Neue Montreal declaration. Update body className. |
| `src/components/ViewToggle.tsx` | 4 | Strip `position: fixed` from CSS; the toggle now flows inside `ReservedZone`. |
| `src/components/NavCoordinates.tsx` | 1 (audit only) | Verify color references use `var(--ink-*)` tokens — they should already; if any inline hex values exist, replace. |
| `src/components/Folio.tsx` | 1 (audit only) | Same audit. |
| `src/components/CopyEmailLink.tsx` | 1 (audit only) | Same audit. |
| `src/components/PaperGrain.tsx` | 1 (audit only) | Verify it works on dark ground (it uses mix-blend-multiply at 0.055 opacity — needs verification on dark; may need theme-aware blend mode). |

### Files to verify untouched

- `src/components/HomeViewInit.tsx`, `src/components/CaseStudy.tsx`, `src/hooks/useHomeView.ts`, `src/hooks/useReducedMotion.ts`, `src/hooks/useSectionReveal.ts`, all `/studio`, `/bookmarks`, `/notes` routes — should render correctly in both themes after Phase 1.

---

## Chunk 0: Setup + asset acquisition

Pre-implementation work. Acquire the PP Neue Montreal font files and the preloader ASCII video asset. Both are content tasks the implementer can defer to the user; the plan documents the requirements clearly so they can be acquired in parallel with code work.

### Task 0.1: Acquire PP Neue Montreal font files

**Files:**
- Download to: `public/fonts/PPNeueMontreal-Regular.woff2`
- Download to: `public/fonts/PPNeueMontreal-Medium.woff2`

- [ ] **Step 1: Download from Pangram Pangram**

Visit [pangrampangram.com](https://pangrampangram.com/products/neue-montreal). Locate the free trial weights (typically Regular + Medium). Some distributions name them as `PPNeueMontreal-Variable.woff2` (variable font) — that's also acceptable; if you use the variable file, only one file is needed and the loader config changes accordingly.

The download bundles a license PDF; read it once. Free for personal / small-commercial use; revisit if portfolio scope changes.

- [ ] **Step 2: Place files in `public/fonts/`**

```bash
mkdir -p public/fonts
# Move downloaded files into public/fonts/PPNeueMontreal-Regular.woff2 and PPNeueMontreal-Medium.woff2
ls -la public/fonts/
```

Expected: two `.woff2` files (or one variable `.woff2`), each ~50–200KB.

- [ ] **Step 3: Commit (assets only, no code)**

```bash
git add public/fonts/PPNeueMontreal-Regular.woff2 public/fonts/PPNeueMontreal-Medium.woff2
git commit -m "chore(fonts): add PP Neue Montreal woff2 files

Phase 3 prep. Self-hosted fonts replace Geist Sans as the chrome
face. Pangram Pangram free-for-personal license."
```

**Note:** if the user prefers to defer font acquisition until Phase 3, this task can be skipped now and reactivated then. Phase 3 is the consumer.

### Task 0.2: Defer ASCII video asset until Phase 6

The preloader asset (`public/assets/preloader-ascii.webm` + `preloader-ascii-frame.png`) requires AI video generation + video→ASCII conversion. Work through that pipeline in Phase 6, not now. The plan documents the asset spec so the user can produce it in parallel with Phases 1–5 code work.

**Asset requirements (defer to Phase 6):**

- Source theme: spiral / circular / mathematical / foundation-of-life motion. Default = phyllotaxis (Fibonacci 137.508° golden-angle seed packing).
- Source production: AI video generation (Runway, Sora, Pika) → 8–20s seamless loop → ASCII conversion (online tool or `ffmpeg` + custom shader).
- Output: `.webm` (≤1.5MB target, realistic 1–2MB acceptable). Plus a static first-frame `.png` for fallback.
- Caption text (rendered separately by the component, not baked into asset): `PHYLLOTAXIS · 137.508° · N=1597` (or whichever dataset is chosen).

Phase 6 has the full task list for the preloader; this task is just the heads-up that the asset is the long pole.

### Task 0.3: Confirm baseline gates clean

**Files:** none modified

- [ ] **Step 1: Run gates**

```bash
npx tsc --noEmit
npm run lint
npm run test
npm run build
```

Expected: all clean. If anything fails, fix before continuing — Phase 1 needs a clean baseline to compare against.

---

## Chunk 1: Phase 1 — theme tokens + useTheme + ThemeInit

Add the dark-mode token block, the `--microtype-tracking` variable, the `useTheme` hook, the `ThemeInit` server component, and mount the init script in the root layout. Audit existing components for hardcoded colors.

### Task 1.1: Add dark-mode token block to `globals.css`

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Read current globals.css token section**

```bash
grep -n -A 20 ":root {" src/app/globals.css | head -30
```

Confirm the existing token block (`--paper`, `--ink-*`, etc.) is at the top of the `:root {}` block.

- [ ] **Step 2: Add `--microtype-tracking` to `:root`**

In `src/app/globals.css`, inside the `:root { ... }` block, after the `--ink-hair` declaration, add:

```css
  /* Microtype tracking — theme-responsive (overridden in dark mode) */
  --microtype-tracking: 0.12em;
```

- [ ] **Step 3: Add `html[data-theme="dark"]` block**

Immediately after the `:root { ... }` closing brace, add:

```css
/* Dark mode — re-binds semantic tokens. No --stage* / --glow*
   namespace tokens; same --paper / --ink-* family carries both
   registers. */
html[data-theme="dark"] {
  --paper:   #0E0D09;
  --paper-2: #16150F;
  --paper-3: #24221A;
  --ink:     #F8F5EC;
  --ink-2:   #C8C5BC;
  --ink-3:   #8E8C85;
  --ink-4:   #555349;
  --ink-hair:  rgba(248, 245, 236, 0.10);
  --ink-ghost: rgba(248, 245, 236, 0.06);
  --microtype-tracking: 0.11em;
}
```

- [ ] **Step 4: Verify type check + build**

```bash
npx tsc --noEmit
npm run build
```

Expected: clean. Site still renders in light mode (no `data-theme` attribute set yet).

- [ ] **Step 5: Manual smoke — set `data-theme="dark"` in DevTools**

```bash
npm run dev
```

Open `http://localhost:3000` in a browser. In DevTools console:

```js
document.documentElement.dataset.theme = 'dark';
```

The page should re-paint with warm-near-black background and warm off-white text. All routes (`/`, `/work/[slug]`, `/studio`, `/bookmarks`, `/notes`) should look correct in dark mode. If anything looks broken (specific component with hardcoded warm-paper hex), note it for Task 1.5.

Run `delete document.documentElement.dataset.theme;` to revert.

- [ ] **Step 6: Stage + commit**

```bash
git add src/app/globals.css
git commit -m "feat(theme): add dark-mode token block + --microtype-tracking

Phase 1 of hero/preloader/theme rollout. Adds html[data-theme='dark']
re-binding of --paper / --ink-* / --ink-hair / --ink-ghost. Adds
--microtype-tracking variable (0.12em light, 0.11em dark). No
component changes yet — components still use existing inline values
or var(--ink-*) which now respond to theme."
```

### Task 1.2: Replace inline `letter-spacing: 0.12em` with `var(--microtype-tracking)`

**Files:**
- Modify: `src/components/WorkPlate.tsx`
- Modify: `src/components/WorkList.tsx`
- Modify: `src/app/page.tsx`

Make the microtype tracking theme-responsive across all components currently using `0.12em` for uppercase microtype.

- [ ] **Step 1: Audit current uses**

```bash
grep -nE "letter-spacing:\s*0\.12em" src/
```

Expected matches:
- `src/components/WorkPlate.tsx` — `.plate__role`, `.plate__meta`
- `src/components/WorkList.tsx` — `.worklist__year`, `.worklist__role`
- `src/app/page.tsx` — `.home__foot`

- [ ] **Step 2: Replace each with `var(--microtype-tracking)`**

In each file, replace `letter-spacing: 0.12em;` with `letter-spacing: var(--microtype-tracking);` for the rules above. Do NOT change rules using other tracking values (e.g., `.plate__index` at `0.02em`).

- [ ] **Step 3: Verify gates**

```bash
npx tsc --noEmit && npm run lint && npm run build
```

Expected: clean. Visual rendering unchanged in light mode (token resolves to 0.12em). In dark mode (manual DevTools test), tracking should tighten to 0.11em.

- [ ] **Step 4: Commit**

```bash
git add src/components/WorkPlate.tsx src/components/WorkList.tsx src/app/page.tsx
git commit -m "feat(theme): microtype tracking now theme-responsive via var()

Replaces inline 0.12em letter-spacing on uppercase microtype rows
with var(--microtype-tracking). Light mode unchanged (0.12em);
dark mode tightens to 0.11em for legibility."
```

### Task 1.3: Build `useTheme` hook

**Files:**
- Create: `src/hooks/useTheme.ts`

Mirror the `useHomeView` shape from the monograph rollout — `useSyncExternalStore` with DOM as canonical, localStorage as write-only persistence.

- [ ] **Step 1: Read the existing `useHomeView` for reference**

```bash
cat src/hooks/useHomeView.ts
```

Note the patterns: `getSnapshot` reads from DOM/storage; `getServerSnapshot` returns a default; `subscribe` listens for storage events + an in-module pubsub set; `setView` writes everything atomically.

- [ ] **Step 2: Write `useTheme.ts`**

Create `src/hooks/useTheme.ts`:

```ts
"use client";

import { useCallback, useSyncExternalStore } from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "hkj.theme";
const DOM_KEY = "theme"; // -> data-theme

function timeOfDayDefault(): Theme {
  const h = new Date().getHours();
  return h >= 7 && h < 19 ? "light" : "dark";
}

function getSnapshot(): Theme {
  if (typeof document === "undefined") return "light";
  const v = document.documentElement.dataset[DOM_KEY];
  return v === "dark" ? "dark" : "light";
}

function getServerSnapshot(): Theme {
  return "light";
}

const listeners = new Set<() => void>();

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) cb();
  };
  if (typeof window !== "undefined") {
    window.addEventListener("storage", onStorage);
  }
  return () => {
    listeners.delete(cb);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", onStorage);
    }
  };
}

/**
 * Reads + writes the resolved theme. Source-of-truth model:
 * `document.documentElement.dataset.theme` is canonical at runtime.
 * `localStorage('hkj.theme')` is write-only persistence — read once
 * by ThemeInit before paint, then ignored at runtime. The hook
 * subscribes to the DOM attribute via useSyncExternalStore; setTheme
 * writes both the DOM attribute and localStorage atomically.
 */
export function useTheme(): {
  theme: Theme;
  setTheme: (next: Theme) => void;
  toggle: () => void;
} {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setTheme = useCallback((next: Theme) => {
    if (typeof document === "undefined") return;
    document.documentElement.dataset[DOM_KEY] = next;
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore localStorage failures (private mode, quota)
    }
    listeners.forEach((cb) => cb());
  }, []);

  const toggle = useCallback(() => {
    setTheme(getSnapshot() === "light" ? "dark" : "light");
  }, [setTheme]);

  return { theme, setTheme, toggle };
}

// Exported for the inline init script and tests
export { timeOfDayDefault, STORAGE_KEY };
```

- [ ] **Step 3: Type check**

```bash
npx tsc --noEmit
```

Expected: clean.

- [ ] **Step 4: Don't commit yet** — Task 1.4 commits the hook + tests together.

### Task 1.4: Test `useTheme` hook

**Files:**
- Create: `src/hooks/__tests__/useTheme.test.ts`

- [ ] **Step 1: Write the tests**

Create `src/hooks/__tests__/useTheme.test.ts`:

```ts
import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useTheme } from "../useTheme";

describe("useTheme", () => {
  beforeEach(() => {
    window.localStorage.clear();
    delete document.documentElement.dataset.theme;
  });

  it("returns light when DOM has no data-theme", async () => {
    const { result } = renderHook(() => useTheme());
    await waitFor(() => expect(result.current.theme).toBe("light"));
  });

  it("returns dark when DOM has data-theme='dark'", async () => {
    document.documentElement.dataset.theme = "dark";
    const { result } = renderHook(() => useTheme());
    await waitFor(() => expect(result.current.theme).toBe("dark"));
  });

  it("setTheme writes DOM attribute and localStorage", () => {
    const { result } = renderHook(() => useTheme());
    act(() => result.current.setTheme("dark"));
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(window.localStorage.getItem("hkj.theme")).toBe("dark");
  });

  it("toggle flips between light and dark", async () => {
    const { result } = renderHook(() => useTheme());
    await waitFor(() => expect(result.current.theme).toBe("light"));
    act(() => result.current.toggle());
    expect(result.current.theme).toBe("dark");
    expect(window.localStorage.getItem("hkj.theme")).toBe("dark");
    act(() => result.current.toggle());
    expect(result.current.theme).toBe("light");
    expect(window.localStorage.getItem("hkj.theme")).toBe("light");
  });

  it("reading from DOM is canonical, not localStorage", async () => {
    // Set localStorage but NOT the DOM attribute
    window.localStorage.setItem("hkj.theme", "dark");
    const { result } = renderHook(() => useTheme());
    // Hook should read DOM (which is unset → "light"), not localStorage
    await waitFor(() => expect(result.current.theme).toBe("light"));
  });
});
```

- [ ] **Step 2: Run the tests**

```bash
npm run test
```

Expected: all 5 new tests pass + the 5 existing `useHomeView` tests still pass = 10 total.

- [ ] **Step 3: Commit hook + tests together**

```bash
git add src/hooks/useTheme.ts src/hooks/__tests__/useTheme.test.ts
git commit -m "feat(theme): add useTheme hook + tests

Phase 1. useSyncExternalStore-based hook reads from
document.documentElement.dataset.theme as source of truth and writes
to localStorage('hkj.theme') for persistence. Tests cover default,
DOM-read, persistence, toggle, and DOM-vs-localStorage canonicality."
```

### Task 1.5: Build `ThemeInit` + mount in root layout

**Files:**
- Create: `src/components/ThemeInit.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Write `ThemeInit.tsx`**

Create `src/components/ThemeInit.tsx`:

```tsx
/**
 * Inline blocking script rendered in the document head (via root
 * layout). Reads localStorage('hkj.theme'); falls back to time-of-day
 * (light 7am-7pm local; dark otherwise). Sets data-theme on <html>
 * synchronously before paint to eliminate theme flash.
 *
 * Pattern: theme-flash mitigation. The script is tiny, synchronous,
 * and runs once per route load before client hydration.
 *
 * NOT next/script (beforeInteractive only valid in root layout AND
 * blocks app paint differently than a plain <script>). A plain
 * <script> tag with dangerouslySetInnerHTML, server-rendered as part
 * of the layout HTML, is the canonical theme-flash mitigation pattern.
 */
export default function ThemeInit() {
  const code = `(function(){try{var s=localStorage.getItem('hkj.theme');var t;if(s==='light'||s==='dark'){t=s;}else{var h=new Date().getHours();t=(h>=7&&h<19)?'light':'dark';}document.documentElement.dataset.theme=t;}catch(e){document.documentElement.dataset.theme='light';}})();`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
```

- [ ] **Step 2: Mount `<ThemeInit>` in root layout**

In `src/app/layout.tsx`, add the import and mount it. Next.js App Router does NOT have a `<head>` slot in `RootLayout` directly; instead, `<head>` is composed via `metadata` + the implicit document head. For a plain inline `<script>`, we render it as the **first child of `<body>`** — it executes synchronously during HTML parsing, before any styled content paints.

Modify `src/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { Newsreader } from "next/font/google";
import "./globals.css";
import RouteAnnouncer from "@/components/RouteAnnouncer";
import NavCoordinates from "@/components/NavCoordinates";
import PaperGrain from "@/components/PaperGrain";
import ThemeInit from "@/components/ThemeInit";

// ... newsreader declaration unchanged ...

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${GeistSans.variable} ${newsreader.variable}`}>
        <ThemeInit />
        <PaperGrain />
        <RouteAnnouncer />
        <NavCoordinates />
        <a href="#main" className="skip-to-content">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
```

`<ThemeInit />` is the **first child of `<body>`**, before any visible content. It executes synchronously during HTML parsing.

- [ ] **Step 3: Verify gates + smoke test**

```bash
npx tsc --noEmit && npm run lint && npm run build
npm run dev
```

Open `http://localhost:3000`. View source. Verify:
- A `<script>` tag with the theme-init IIFE appears as the first child of `<body>`
- `<html data-theme="light">` (or `"dark"` depending on local time) is set before any visible content paints
- No flash on page load (try refreshing several times — the page should appear in its theme immediately)

In DevTools console:

```js
// Confirm the hook can read it
document.documentElement.dataset.theme
// → "light" (between 7am-7pm) or "dark" otherwise

// Confirm localStorage starts empty
localStorage.getItem('hkj.theme')
// → null

// Set localStorage directly, reload, verify override
localStorage.setItem('hkj.theme', 'dark');
location.reload();
// → page should now load in dark mode regardless of time

// Clean up
localStorage.removeItem('hkj.theme');
location.reload();
```

- [ ] **Step 4: Commit**

```bash
git add src/components/ThemeInit.tsx src/app/layout.tsx
git commit -m "feat(theme): mount ThemeInit inline script in root layout

Phase 1. Server component renders an inline IIFE as the first child
of <body>. Reads localStorage('hkj.theme'); falls back to time-of-day
default (light 7am-7pm; dark otherwise). Sets data-theme on <html>
before paint, eliminating theme flash for returning visitors."
```

### Task 1.6: Audit components for hardcoded warm-paper colors

**Files:**
- Read-only audit, possibly modify: `src/components/NavCoordinates.tsx`, `src/components/Folio.tsx`, `src/components/CopyEmailLink.tsx`, `src/components/PaperGrain.tsx`

- [ ] **Step 1: Search for hardcoded hex values**

```bash
grep -rnE "#FBFAF6|#F4F3EE|#E8E7E1|#111110|#55554F|#8E8E87|#BFBEB8" src/components/
```

Expected: any matches found should be changed to use the corresponding `var(--paper)` / `var(--paper-2)` / etc. tokens, so they respond to the dark theme.

- [ ] **Step 2: Test PaperGrain visibility on dark**

`PaperGrain` uses `mix-blend-mode: multiply` at 0.055 opacity. On dark backgrounds, multiply blend can disappear or invert. Open the page with `data-theme="dark"` in DevTools and inspect the `<svg>` for PaperGrain — is the grain visible at all? If not, the blend mode may need to switch to `screen` for dark mode. Apply a theme-aware fix:

```css
.paper-grain {
  mix-blend-mode: multiply;
}
html[data-theme="dark"] .paper-grain {
  mix-blend-mode: screen;
  opacity: 0.04;
}
```

- [ ] **Step 3: Run gates**

```bash
npx tsc --noEmit && npm run lint && npm run build && npm run test
```

All pass.

- [ ] **Step 4: Commit if any changes**

```bash
git add <changed files>
git commit -m "chore(theme): make components theme-responsive

Phase 1 audit. Replaces any hardcoded warm-paper hex values with
var(--paper) / var(--ink-*) tokens. PaperGrain switches blend mode
to 'screen' on dark to remain visible."
```

If audit found nothing, no commit needed.

---

## Chunk 2: Phase 2 — ThemeToggle + ReservedZone

Build the sun/moon glyph toggle and the reserved-zone container. Mount the reserved zone at the end of the existing 2-col grid as a transitional placement; Phase 4 collapses it into the 3-col grid cell.

### Task 2.1: Build `ReservedZone.tsx`

**Files:**
- Create: `src/components/ReservedZone.tsx`

Build the container that will eventually hold theme toggle + view toggle + future content. Phase 2 ships it with theme toggle inside; Phase 4 adds view toggle.

- [ ] **Step 1: Write the component**

Create `src/components/ReservedZone.tsx`:

```tsx
"use client";

import ThemeToggle from "@/components/ThemeToggle";

/**
 * ReservedZone — grid-cell-shaped container in the home hero.
 *
 * In Phase 2, mounts as the LAST cell of the existing 2-col grid
 * (transitional placement). In Phase 4, the home grid switches to
 * 3-col and the reserved zone moves to row 1 col 3.
 *
 * Holds the theme toggle today; in Phase 4 also holds the view
 * toggle (gallery/list); future fillable with status feeds, "now"
 * lines, build SHA, etc.
 */
export default function ReservedZone() {
  return (
    <aside className="reserved" aria-label="Settings">
      <div className="reserved__cluster">
        <ThemeToggle />
      </div>

      <style>{`
        .reserved {
          display: grid;
          align-items: end;
          justify-items: end;
          padding: clamp(20px, 3vh, 36px);
          min-height: 0;
        }
        .reserved__cluster {
          display: inline-flex;
          align-items: baseline;
          gap: clamp(12px, 2vw, 20px);
          font-family: var(--font-stack-sans);
          font-size: 11px;
          letter-spacing: var(--microtype-tracking);
          text-transform: lowercase;
          color: var(--ink-3);
        }
      `}</style>
    </aside>
  );
}
```

- [ ] **Step 2: Type check**

```bash
npx tsc --noEmit
```

Expected: TypeScript will fail because `ThemeToggle` doesn't exist yet — that's fine, build it next.

- [ ] **Step 3: Don't commit yet** — Task 2.3 commits everything together.

### Task 2.2: Build `ThemeToggle.tsx`

**Files:**
- Create: `src/components/ThemeToggle.tsx`

- [ ] **Step 1: Write the component**

Create `src/components/ThemeToggle.tsx`:

```tsx
"use client";

import { useTheme } from "@/hooks/useTheme";

/**
 * ThemeToggle — single button. Sun glyph in light mode flips to
 * moon glyph in dark mode (or vice versa). Click toggles theme.
 * Rotates 180° on hover. Reduced-motion respected.
 *
 * The button itself is the only visible element — there's no label
 * text. aria-label provides the accessible name; aria-pressed
 * reflects the current state.
 */
export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isLight = theme === "light";
  const targetMode = isLight ? "dark" : "light";

  return (
    <>
      <button
        type="button"
        className="theme-toggle"
        onClick={toggle}
        aria-label={`Switch to ${targetMode} mode`}
        aria-pressed={!isLight}
      >
        <span className="theme-toggle__glyph" aria-hidden>
          {isLight ? "☼" : "☾"}
        </span>
      </button>

      <style>{`
        .theme-toggle {
          background: transparent;
          border: 0;
          padding: 4px;
          margin: 0;
          cursor: pointer;
          color: inherit;
          line-height: 1;
        }
        .theme-toggle__glyph {
          display: inline-block;
          font-size: 14px;
          color: var(--ink);
          transition: transform 320ms var(--ease), color 200ms var(--ease);
        }
        .theme-toggle:hover .theme-toggle__glyph {
          transform: rotate(180deg);
          color: var(--ink-2);
        }
        .theme-toggle:focus-visible {
          outline: 1px solid var(--ink);
          outline-offset: 4px;
        }

        @media (prefers-reduced-motion: reduce) {
          .theme-toggle__glyph { transition: none; }
          .theme-toggle:hover .theme-toggle__glyph { transform: none; }
        }
      `}</style>
    </>
  );
}
```

- [ ] **Step 2: Type check + lint**

```bash
npx tsc --noEmit && npm run lint
```

Expected: clean.

### Task 2.3: Mount ReservedZone at end of existing home grid

**Files:**
- Modify: `src/app/page.tsx`

This is the transitional placement — the reserved zone appears as the next cell after the last piece in the existing 2-col grid. Phase 4 will move it to row 1 col 3 of a new 3-col grid. The component is the same; only its position in the parent layout changes.

- [ ] **Step 1: Mount `<ReservedZone />` after the gallery's last `<WorkPlate>`**

In `src/app/page.tsx`, modify the `home__gallery` section to include the reserved zone at the end:

```tsx
import ReservedZone from "@/components/ReservedZone";
// ... other imports unchanged ...

// Inside <section className="home__gallery">:
<section className="home__gallery" aria-label="Studio catalog (gallery)">
  {pieces.map((piece) => (
    <WorkPlate key={piece.slug} piece={piece} />
  ))}
  <ReservedZone />
</section>
```

The reserved zone occupies the next available cell in the 2-col grid (cell 8 — row 4 col 2). It's a transitional location; Phase 4 will place it row 1 col 3 of a 3-col grid.

- [ ] **Step 2: Verify gates + smoke**

```bash
npx tsc --noEmit && npm run lint && npm run build && npm run test
npm run dev
```

Open `http://localhost:3000`. Verify:
- Theme toggle (sun/moon glyph) appears at the end of the gallery, in the next-cell slot
- Click the toggle → theme flips, page re-paints
- Reload the page after toggling → theme persists (localStorage)
- DevTools `prefers-reduced-motion: reduce` → hover doesn't rotate the glyph; click still flips

- [ ] **Step 3: Commit ReservedZone + ThemeToggle + page.tsx mount together**

```bash
git add src/components/ReservedZone.tsx src/components/ThemeToggle.tsx src/app/page.tsx
git commit -m "feat(theme): ReservedZone + ThemeToggle (transitional placement)

Phase 2 of hero/preloader/theme rollout. ReservedZone is the
container that will hold theme toggle + view toggle + future
content; mounted at end of existing 2-col grid in Phase 2 as a
transitional placement. Phase 4 will move it to row 1 col 3 of a
3-col grid.

ThemeToggle is the sun/moon glyph button. Click flips theme via
useTheme hook (DOM canonical, localStorage write-only). Rotates
180° on hover; reduced-motion safe."
```

---

## Chunk 3: Phase 3 — PP Neue Montreal swap

Replace Geist Sans with PP Neue Montreal via `next/font/local`. Verify Geist is fully removed.

### Task 3.1: Verify font assets present

**Files:**
- Read-only check: `public/fonts/`

- [ ] **Step 1: Confirm `.woff2` files exist**

```bash
ls -la public/fonts/PPNeueMontreal-Regular.woff2 public/fonts/PPNeueMontreal-Medium.woff2
```

Expected: both files exist (acquired in Task 0.1). If not, halt and complete Task 0.1 first.

If user has only the variable file (`PPNeueMontreal-Variable.woff2`), the loader config in Task 3.2 changes — note the variation in step.

### Task 3.2: Replace `next/font` Geist with `next/font/local` PP Neue Montreal

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Update `src/app/layout.tsx`**

Replace the Geist import + loader with `next/font/local`:

```tsx
import type { Metadata } from "next";
import localFont from "next/font/local";
import { Newsreader } from "next/font/google";
import "./globals.css";
import RouteAnnouncer from "@/components/RouteAnnouncer";
import NavCoordinates from "@/components/NavCoordinates";
import PaperGrain from "@/components/PaperGrain";
import ThemeInit from "@/components/ThemeInit";

const ppNeueMontreal = localFont({
  src: [
    {
      path: "../../public/fonts/PPNeueMontreal-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/PPNeueMontreal-Medium.woff2",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-pp-neue-montreal",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "500", "600"],
  display: "swap",
});

// metadata block unchanged

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${ppNeueMontreal.variable} ${newsreader.variable}`}>
        <ThemeInit />
        <PaperGrain />
        <RouteAnnouncer />
        <NavCoordinates />
        <a href="#main" className="skip-to-content">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
```

**Note for variable-font users:** if you have the single `PPNeueMontreal-Variable.woff2` file instead of separate Regular + Medium files, the `src` array becomes one entry:

```tsx
src: [{ path: "../../public/fonts/PPNeueMontreal-Variable.woff2", style: "normal" }],
```

(no `weight` prop; the variable file declares its own range.)

- [ ] **Step 2: Update `--font-stack-sans` in globals.css**

Find the existing line in `src/app/globals.css`:

```css
--font-stack-sans:  var(--font-geist-sans), -apple-system, "SF Pro Text", system-ui, sans-serif;
```

Replace with:

```css
--font-stack-sans:  var(--font-pp-neue-montreal), -apple-system, "SF Pro Text", system-ui, sans-serif;
```

Newsreader's `--font-stack-serif` declaration stays as-is.

- [ ] **Step 3: Remove the `geist` package dependency**

```bash
npm uninstall geist
```

This removes `geist` from `package.json` dependencies.

- [ ] **Step 4: Verify gates**

```bash
npx tsc --noEmit && npm run lint && npm run build
```

Expected: all clean. The build should succeed; Next.js will generate the font CSS for PP Neue Montreal.

- [ ] **Step 5: Geist removal grep checklist**

Per the spec's Phase 3 verification:

```bash
grep -rnE "geist|Geist|GEIST" src/ app/ 2>/dev/null
grep -rn "geist" package.json
grep -rnE "--font-geist|font-geist-sans|font-geist-mono" src/ 2>/dev/null
```

Expected: zero matches (or only matches inside doc comments referencing the prior face — which should also be removed if found). The `package.json` grep should be empty after Step 3's `npm uninstall`.

- [ ] **Step 6: Smoke test**

```bash
npm run dev
```

Open `http://localhost:3000`. Verify:
- Microtype (9–11px uppercase) renders cleanly in PP Neue Montreal
- Body (14–17px) renders cleanly
- No flash of unstyled text on load
- Look at character shapes — `R`, `Q`, `g`, `a` are the most distinguishing letters; they should look different from Geist (more authored character)

- [ ] **Step 7: Commit**

```bash
git add src/app/layout.tsx src/app/globals.css package.json package-lock.json
git commit -m "feat(typography): swap Geist Sans → PP Neue Montreal

Phase 3 of hero/preloader/theme rollout. Self-hosted PP Neue
Montreal (Pangram Pangram free-personal license) replaces Geist
Sans as the chrome face. Loaded via next/font/local from
public/fonts/. --font-stack-sans CSS variable updates to reference
--font-pp-neue-montreal; the variable name (--font-stack-sans)
stays the same so consuming components don't change.

Newsreader unchanged (still next/font/google).

geist npm package removed from dependencies."
```

---

## Chunk 4: Phase 4 — 3-up grid + ReservedZone integration

Switch the home gallery from 2-col to 3-col grid. Move `ViewToggle` into `ReservedZone`. Apply the layout flow rule (reserved zone always row 1 col 3; pieces flow document order skipping that cell).

### Task 4.1: Migrate `ViewToggle` into `ReservedZone`

**Files:**
- Modify: `src/components/ViewToggle.tsx`
- Modify: `src/components/ReservedZone.tsx`

- [ ] **Step 1: Strip `position: fixed` from ViewToggle**

In `src/components/ViewToggle.tsx`, the existing CSS includes `position: fixed; top: ...; right: ...;` (mounted free-floating). Remove those properties so the toggle flows naturally inside its container.

Find the existing `.view-toggle` rule and replace with:

```css
.view-toggle {
  display: inline-flex;
  align-items: baseline;
  gap: 0;
  font-family: var(--font-stack-sans);
  font-size: 11px;
  letter-spacing: var(--microtype-tracking);
  text-transform: lowercase;
  color: var(--ink-3);
  background: transparent;
}
```

Remove the `position: fixed`, `top`, `right`, `z-index` properties that were positioning it free-floating.

- [ ] **Step 2: Mount ViewToggle inside ReservedZone**

In `src/components/ReservedZone.tsx`, add the import and place `<ViewToggle />` next to `<ThemeToggle />`:

```tsx
"use client";

import ThemeToggle from "@/components/ThemeToggle";
import ViewToggle from "@/components/ViewToggle";

export default function ReservedZone() {
  return (
    <aside className="reserved" aria-label="Settings">
      <div className="reserved__cluster">
        <ThemeToggle />
        <ViewToggle />
      </div>

      <style>{`
        /* … existing CSS unchanged … */
      `}</style>
    </aside>
  );
}
```

- [ ] **Step 3: Verify gates + smoke**

```bash
npx tsc --noEmit && npm run lint && npm run build
npm run dev
```

Open `http://localhost:3000`. Verify:
- Both theme toggle (☼/☾) and view toggle (gallery/list) appear inside the reserved zone, side by side
- Click theme toggle → theme flips
- Click view toggle → gallery/list view switches (existing behavior)
- ViewToggle is no longer free-floating in top-right; it lives in the reserved zone

- [ ] **Step 4: Don't commit yet** — Task 4.2 commits the grid change together with this migration.

### Task 4.2: Switch home gallery to 3-col grid

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Read current `src/app/page.tsx`**

Note the existing `.home__gallery` CSS (2-col grid, max-width 1240px). The reserved zone is currently mounted at the end of the gallery (transitional from Phase 2).

- [ ] **Step 2: Rewrite `.home__gallery` CSS to 3-col grid + flow rule**

Replace the `.home__gallery` rule with:

```css
/* 3-col catalog grid. aino-derived; max-width 1480px. Reserved
   zone always occupies row 1 col 3; pieces flow in document order
   skipping that cell; trailing empty cells are breathing room.
   Mobile collapses to 1 col with reserved zone moved to top. */
.home__gallery {
  max-width: 1480px;
  margin-inline: auto;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  column-gap: clamp(20px, 2vw, 36px);
  row-gap: clamp(32px, 4vh, 56px);
}

/* Reserved zone is always row 1, col 3. Locked. */
.home__gallery > .reserved {
  grid-row: 1;
  grid-column: 3;
}

/* Pieces flow document-order. Cells skip row 1 col 3 because the
   reserved zone occupies it. CSS Grid's auto-placement with an
   explicit row/col on .reserved handles this — pieces fill
   remaining cells in document order. */

@media (max-width: 720px) {
  .home__gallery {
    grid-template-columns: 1fr;
  }
  /* Reserved zone moves to top of gallery on mobile. */
  .home__gallery > .reserved {
    grid-row: auto;
    grid-column: auto;
    order: -1;
  }
}
```

The CSS Grid auto-placement algorithm handles the flow: when one cell has explicit `grid-row` and `grid-column`, other items auto-place into remaining cells in document order. So pieces fill cells skipping row 1 col 3, no extra logic needed.

- [ ] **Step 3: Update `.home` and `.home__list` for the wider grid**

In the same file, update padding to suit the wider 3-col layout:

```css
.home {
  min-height: 100svh;
  background: var(--paper);
  color: var(--ink);
  padding: clamp(140px, 26vh, 240px) clamp(20px, 4vw, 64px) clamp(56px, 9vh, 88px);
  display: grid;
  gap: clamp(40px, 6vh, 72px);
}
```

The horizontal padding tightens slightly (max 64px instead of 80px) since the grid is now 1480px wide.

The `.home__list` and `.home__foot` widths stay narrower (920px / 1240px) — list view reads better narrow.

- [ ] **Step 4: Verify gates + smoke**

```bash
npx tsc --noEmit && npm run lint && npm run build
npm run dev
```

Open `http://localhost:3000`. Verify:
- Gallery view: 3-col grid renders. 7 pieces + reserved zone = 8 cells. Layout matches the spec diagram (row 1: piece №01, piece №02, reserved zone; row 2: pieces №03/04/05; row 3: pieces №06/07, then empty).
- Reserved zone is in row 1 col 3 with theme toggle + view toggle inside.
- Click each piece — `viewTransitionName` morph still works (cover + title).
- Reduce viewport to 720px — gallery collapses to 1 col, reserved zone appears at top of gallery.
- Toggle to list view — typeset row index renders, reserved zone still visible (it's on the gallery only — verify by reading `.home__list` rules).

Wait — actually the reserved zone is INSIDE `.home__gallery`. When the user toggles to list view, `.home__gallery` is hidden via `html[data-home-view="list"] .home__gallery { display: none; }`, which would hide the reserved zone too. That's a problem — the toggles need to be visible in list view too.

**Fix:** the `ReservedZone` should NOT live inside `.home__gallery`. It needs to be a sibling of both `.home__gallery` and `.home__list`, positioned independently. Restructure:

```tsx
<main id="main" className="home">
  <Folio token="§01" />
  
  {/* Reserved zone is positioned independently of gallery/list views */}
  <div className="home__reserved-wrapper">
    <ReservedZone />
  </div>
  
  <section className="home__gallery">{ ... pieces ... }</section>
  <section className="home__list"><WorkList pieces={pieces} /></section>
  
  <footer className="home__foot">{ ... }</footer>
</main>
```

And update CSS:

```css
.home__reserved-wrapper {
  max-width: 1480px;
  margin-inline: auto;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  column-gap: clamp(20px, 2vw, 36px);
}
.home__reserved-wrapper > .reserved {
  grid-column: 3;
}

@media (max-width: 720px) {
  .home__reserved-wrapper {
    grid-template-columns: 1fr;
  }
}
```

The wrapper aligns the reserved zone to the same grid as the gallery (so it sits in column 3 visually) but is structurally a sibling of both gallery and list — visible regardless of view.

Update `.home__gallery` accordingly:

```css
.home__gallery {
  max-width: 1480px;
  margin-inline: auto;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  column-gap: clamp(20px, 2vw, 36px);
  row-gap: clamp(32px, 4vh, 56px);
}

@media (max-width: 720px) {
  .home__gallery {
    grid-template-columns: 1fr;
  }
}
```

The reserved zone is no longer styled as a grid cell of `.home__gallery`. The visual effect (reserved zone in row 1 col 3 of the gallery) is achieved via the wrapper's grid and the reserved zone's `grid-column: 3`. Pieces flow naturally in `.home__gallery` 3-col with all cells available.

Wait — this has a side-effect: the gallery now has a 1st row of pieces (3 cells) without the reserved zone. So 7 pieces fill rows 1–3 with last row having 1 piece. Layout:
```
Row 1: piece 01 | piece 02 | piece 03
Row 2: piece 04 | piece 05 | piece 06
Row 3: piece 07 | (empty) | (empty)
```
With the reserved zone visually overlaid at the same column position as col 3, but in its own row above the gallery.

Actually the reserved zone wrapper is ABOVE the gallery (sibling), so it appears as a row of its own:

```
[reserved-wrapper row]:  (empty col 1) | (empty col 2) | reserved zone
[gallery row 1]:          piece 01      | piece 02      | piece 03
[gallery row 2]:          piece 04      | piece 05      | piece 06
[gallery row 3]:          piece 07      | (empty)       | (empty)
```

Hmm, that's a wider hero with the reserved zone standalone above the pieces. Different from the spec's "row 1 col 3" mental model but functionally clearer.

**Decision:** lock the wrapper-as-sibling pattern. The reserved zone's row appears above the gallery. The visual hierarchy is: nav → reserved zone → 3-col gallery. The reserved zone reads as a settings strip at the top of the catalog.

If you want the reserved zone to appear *inside* the first gallery row (per the spec diagram), the alternative is to render the reserved zone twice — once for gallery (CSS visible only when gallery view) and once for list (CSS visible only when list view) — but that doubles the components. The wrapper-sibling approach is simpler.

Update spec footnote (file edits only — don't change the spec doc itself; the design intent is preserved, just the layout structure is implementer-clarified).

- [ ] **Step 5: Re-verify smoke after structural change**

```bash
npm run dev
```

Open `http://localhost:3000`. Confirm:
- Reserved zone appears at the top of the catalog area (above the 3-col gallery), aligned to column 3
- Gallery view: 7 pieces in 3 cols, last row has piece 07 + 2 empty cells
- List view: switches normally; reserved zone is still visible (sibling, not gallery-child)
- Mobile: reserved zone moves to top via `order: -1` or by being a sibling above the gallery, both compatible

Adjust mobile CSS if needed:

```css
@media (max-width: 720px) {
  .home__reserved-wrapper {
    grid-template-columns: 1fr;
  }
  .home__reserved-wrapper > .reserved {
    grid-column: auto;
  }
}
```

- [ ] **Step 6: Commit Task 4.1 + Task 4.2 together**

```bash
git add src/components/ViewToggle.tsx src/components/ReservedZone.tsx src/app/page.tsx
git commit -m "feat(home): 3-col grid + ReservedZone integration

Phase 4 of hero/preloader/theme rollout. Home gallery shifts from
2-col to 3-col (max-width 1480px). Reserved zone lives in its own
sibling wrapper above the gallery, aligned to column 3 — visible
in both gallery and list views (sibling of both, not child of
either).

ViewToggle migrates from free-floating fixed top-right into the
reserved zone, alongside the new ThemeToggle. Both toggles read
from their respective hooks (useHomeView, useTheme) — DOM-canonical,
localStorage-persistent.

Mobile (≤720px): grid collapses to 1 col; reserved zone stacks at
top above pieces."
```

---

## Chunk 5: Phase 5 — ScrambleText

Build the character-scramble primitive and integrate it on tile titles.

### Task 5.1: Build `ScrambleText.tsx`

**Files:**
- Create: `src/components/ScrambleText.tsx`

- [ ] **Step 1: Write the component**

Create `src/components/ScrambleText.tsx`:

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type Props = {
  text: string;
  /** Number of characters to scramble per hover-enter. Default 2. */
  count?: number;
  /** Per-character total scramble duration in ms. Default 160. */
  duration?: number;
  /** Random glyph pool for the scramble. Default ASCII alphanumeric. */
  pool?: string;
  /** className for the wrapper span. */
  className?: string;
  /** Additional inline style on the wrapper. */
  style?: React.CSSProperties;
};

const DEFAULT_POOL =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const ELIGIBLE_RE = /[A-Za-z0-9]/;

/**
 * ScrambleText — splits text into per-character spans and runs a
 * brief character-cycle on hover-enter (aino-derived effect).
 * Eligibility: ASCII Latin alphanumeric only (`/[A-Za-z0-9]/`).
 * Non-alphanumeric characters (CJK, accented Latin, punctuation,
 * spaces) are never scrambled — they stay still.
 *
 * One-shot per hover-enter; does not recur while cursor stays in.
 * Reduced-motion: scramble disabled, hover does nothing visually.
 *
 * a11y: wrapper carries aria-label={text}; per-character spans are
 * aria-hidden so screen readers read the original text naturally.
 */
export default function ScrambleText({
  text,
  count = 2,
  duration = 160,
  pool = DEFAULT_POOL,
  className,
  style,
}: Props) {
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLSpanElement>(null);
  const [, forceRender] = useState(0);
  const scrambleStateRef = useRef<{ [index: number]: string }>({});

  // Indices eligible for scrambling
  const eligibleIndices = [...text].reduce<number[]>((acc, ch, i) => {
    if (ELIGIBLE_RE.test(ch)) acc.push(i);
    return acc;
  }, []);

  function startScramble() {
    if (reduced) return;
    if (eligibleIndices.length === 0) return;

    // Pick min(count, eligible.length) random positions
    const k = Math.min(count, eligibleIndices.length);
    const shuffled = [...eligibleIndices].sort(() => Math.random() - 0.5);
    const picked = shuffled.slice(0, k);

    const swapsPerChar = 4;
    const swapInterval = duration / swapsPerChar;

    picked.forEach((idx) => {
      let swapCount = 0;
      const interval = setInterval(() => {
        if (swapCount >= swapsPerChar) {
          clearInterval(interval);
          delete scrambleStateRef.current[idx];
          forceRender((n) => n + 1);
          return;
        }
        const randomChar = pool[Math.floor(Math.random() * pool.length)];
        scrambleStateRef.current[idx] = randomChar;
        swapCount++;
        forceRender((n) => n + 1);
      }, swapInterval);
    });
  }

  return (
    <span
      ref={containerRef}
      className={className}
      style={style}
      aria-label={text}
      onMouseEnter={startScramble}
    >
      {[...text].map((ch, i) => (
        <span key={i} aria-hidden="true">
          {scrambleStateRef.current[i] ?? ch}
        </span>
      ))}
    </span>
  );
}
```

- [ ] **Step 2: Type check**

```bash
npx tsc --noEmit
```

Expected: clean.

### Task 5.2: Test `ScrambleText`

**Files:**
- Create: `src/components/__tests__/ScrambleText.test.tsx`

- [ ] **Step 1: Write tests**

Create `src/components/__tests__/ScrambleText.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import ScrambleText from "../ScrambleText";

describe("ScrambleText", () => {
  it("renders the text as per-character spans", () => {
    const { container } = render(<ScrambleText text="abc" />);
    const spans = container.querySelectorAll("span span");
    expect(spans).toHaveLength(3);
    expect(spans[0].textContent).toBe("a");
    expect(spans[1].textContent).toBe("b");
    expect(spans[2].textContent).toBe("c");
  });

  it("wrapper has aria-label of full text", () => {
    const { container } = render(<ScrambleText text="Gyeol" />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.getAttribute("aria-label")).toBe("Gyeol");
  });

  it("per-character spans are aria-hidden", () => {
    const { container } = render(<ScrambleText text="ab" />);
    const innerSpans = container.querySelectorAll("span span");
    innerSpans.forEach((s) => {
      expect(s.getAttribute("aria-hidden")).toBe("true");
    });
  });

  it("preserves non-alphanumeric characters in render", () => {
    const { container } = render(<ScrambleText text="Gyeol: 결" />);
    const spans = container.querySelectorAll("span span");
    expect(spans).toHaveLength(8); // G,y,e,o,l,:, ,결
    expect(spans[5].textContent).toBe(":");
    expect(spans[6].textContent).toBe(" ");
    expect(spans[7].textContent).toBe("결");
  });

  it("renders text with zero alphanumeric characters", () => {
    const { container } = render(<ScrambleText text="결: 結" />);
    const spans = container.querySelectorAll("span span");
    expect(spans).toHaveLength(4); // 결,:, ,結
    // No assertion on scramble — hover would no-op
  });
});
```

- [ ] **Step 2: Run tests**

```bash
npm run test
```

Expected: all 5 new tests pass + existing tests still pass.

- [ ] **Step 3: Don't commit yet** — Task 5.3 commits component + tests + integration.

### Task 5.3: Integrate `ScrambleText` into `WorkPlate.title`

**Files:**
- Modify: `src/components/WorkPlate.tsx`

- [ ] **Step 1: Wrap `.plate__title` text in `<ScrambleText>`**

In `src/components/WorkPlate.tsx`, find the title rendering:

```tsx
<span
  className="plate__title"
  style={{ viewTransitionName: titleVtName } as React.CSSProperties}
>
  {piece.title}
</span>
```

Replace with:

```tsx
<ScrambleText
  text={piece.title}
  count={2}
  className="plate__title"
  style={{ viewTransitionName: titleVtName } as React.CSSProperties}
/>
```

Add the import at the top:

```tsx
import ScrambleText from "@/components/ScrambleText";
```

For the **placeholder** branch (the static plate without a Link wrapper, around lines 162–185 of the current file), DON'T wrap the title in ScrambleText — placeholders have no hover (cursor doesn't change to pointer; the cell isn't interactive). Leave the placeholder title as a plain `<span className="plate__title">{piece.title}</span>`.

- [ ] **Step 2: Verify gates + smoke**

```bash
npx tsc --noEmit && npm run lint && npm run test && npm run build
npm run dev
```

Open `http://localhost:3000`. Hover over a piece tile (e.g., Gyeol). Verify:
- Title characters briefly cycle through random glyphs (~160ms)
- Korean character `결` doesn't scramble (skipped as non-alphanumeric)
- After ~160ms the title resolves back to original
- DevTools `prefers-reduced-motion: reduce` — hover does nothing visually
- Hover on a placeholder tile (Untitled) — no scramble (cell isn't interactive)

- [ ] **Step 3: Commit ScrambleText + tests + WorkPlate integration**

```bash
git add src/components/ScrambleText.tsx src/components/__tests__/ScrambleText.test.tsx src/components/WorkPlate.tsx
git commit -m "feat(scramble): add ScrambleText character-cycle on tile titles

Phase 5 of hero/preloader/theme rollout. New ScrambleText primitive
splits text into per-character spans and runs a brief character
cycle on hover-enter. Eligibility: ASCII Latin alphanumeric only
(/[A-Za-z0-9]/) — Korean, em-dash, and other non-alphanumeric
characters in titles like 'Gyeol: 결' stay still.

Default: 2 characters scrambled per hover, 160ms per character,
4 swaps per scramble. Reduced-motion disables it. a11y: wrapper
aria-label carries the full text; per-character spans are
aria-hidden so screen readers read the title naturally.

WorkPlate's link branch wraps title in ScrambleText. Placeholder
branch leaves title plain (cell isn't interactive)."
```

---

## Chunk 6: Phase 6 — Preloader

Build the preloader: server-rendered DOM, inline localStorage init script, client-side dismissal handler with exit animation.

### Task 6.1: Acquire ASCII video assets

**Files:**
- Place at: `public/assets/preloader-ascii.webm`
- Place at: `public/assets/preloader-ascii-frame.png`

This is the long-pole content task. Per the spec:

- [ ] **Step 1: Generate source video**

Use a prompt-driven AI video tool (Runway, Sora, Pika, or similar). Prompt theme:

> "A slow, gentle, mathematical animation of phyllotaxis — Fibonacci spiral seed packing at 137.508° golden angle. Concentric circles of small dots gradually accumulating from the center outward. Monochrome white-on-black. Seamlessly looping. 10 seconds. Slow, meditative pacing."

Iterate until the result feels gentle and natural. Common pitfalls: too fast, too colorful, too "AI-generated" looking. Aim for monochrome, slow, and clean.

Alternative datasets (per spec): vortex/fluid sim, Lorenz attractor, sunflower seed packing, galactic rotation, mitosis. Phyllotaxis is the recommended default.

- [ ] **Step 2: Convert video → ASCII**

Tools:
- [video-ascii](https://www.npmjs.com/package/video-ascii) (npm CLI)
- [asciinema](https://asciinema.org) — for terminal recordings, not video
- Custom: `ffmpeg` extracts frames; per-frame image-to-ASCII via Python (`pillow` + character-density mapping)
- Online: search "video to ASCII converter" — pick one that outputs `.webm` or per-frame `.png` sequences

The output should be a `.webm` of the ASCII rendering, not the source video. Aim for ASCII character density ~80×40 per frame, white-on-transparent-or-black, 24fps or 30fps.

- [ ] **Step 3: Compress and verify size**

```bash
# If ffmpeg available, recompress to ensure ≤1.5MB:
ffmpeg -i input.webm -c:v libvpx-vp9 -b:v 800k -an output.webm
ls -la output.webm
```

Target: ≤1.5MB. If larger, reduce bitrate or shorten loop duration to 8s.

- [ ] **Step 4: Extract a static fallback frame**

```bash
ffmpeg -i public/assets/preloader-ascii.webm -ss 00:00:01 -vframes 1 public/assets/preloader-ascii-frame.png
```

This grabs one frame at 1s and saves as PNG. Used for `prefers-reduced-data` and `.webm`-unsupported fallback.

- [ ] **Step 5: Place files + commit**

```bash
ls -la public/assets/preloader-ascii.webm public/assets/preloader-ascii-frame.png
git add public/assets/preloader-ascii.webm public/assets/preloader-ascii-frame.png
git commit -m "chore(assets): add preloader ASCII video + static fallback

Phase 6 prep. Pre-rendered phyllotaxis (Fibonacci 137.508°) ASCII
video, ~10s seamless loop. Static first-frame PNG for reduced-data
and .webm-unsupported fallback."
```

**If user defers asset generation:** the rest of Phase 6 can ship with placeholder asset paths; the preloader will render a broken video element until the assets land. The spec accepts this — the slot is wired ahead of content.

### Task 6.2: Build `usePreloaderState` hook

**Files:**
- Create: `src/hooks/usePreloaderState.ts`
- Create: `src/hooks/__tests__/usePreloaderState.test.ts`

- [ ] **Step 1: Write the hook**

Create `src/hooks/usePreloaderState.ts`:

```ts
"use client";

import { useCallback, useSyncExternalStore } from "react";

export type PreloaderState = "active" | "dismissed";

const STORAGE_KEY = "hkj.preloader.dismissed";
const DOM_KEY = "preloaderState";

// Set to "session" to use sessionStorage instead. Default "local".
const STORAGE: "local" | "session" = "local";

function storage(): Storage | null {
  if (typeof window === "undefined") return null;
  return STORAGE === "local" ? window.localStorage : window.sessionStorage;
}

function getSnapshot(): PreloaderState {
  if (typeof document === "undefined") return "active";
  const v = document.documentElement.dataset[DOM_KEY];
  return v === "dismissed" ? "dismissed" : "active";
}

function getServerSnapshot(): PreloaderState {
  return "active";
}

const listeners = new Set<() => void>();

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function usePreloaderState(): {
  state: PreloaderState;
  dismiss: () => void;
} {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const dismiss = useCallback(() => {
    if (typeof document === "undefined") return;
    document.documentElement.dataset[DOM_KEY] = "dismissed";
    try {
      storage()?.setItem(STORAGE_KEY, "1");
    } catch {
      // ignore
    }
    listeners.forEach((cb) => cb());
  }, []);

  return { state, dismiss };
}

export { STORAGE_KEY };
```

- [ ] **Step 2: Write tests**

Create `src/hooks/__tests__/usePreloaderState.test.ts`:

```ts
import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { usePreloaderState } from "../usePreloaderState";

describe("usePreloaderState", () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
    delete document.documentElement.dataset.preloaderState;
  });

  it("defaults to active when DOM has no data-preloader-state", async () => {
    const { result } = renderHook(() => usePreloaderState());
    await waitFor(() => expect(result.current.state).toBe("active"));
  });

  it("returns dismissed when DOM has data-preloader-state='dismissed'", async () => {
    document.documentElement.dataset.preloaderState = "dismissed";
    const { result } = renderHook(() => usePreloaderState());
    await waitFor(() => expect(result.current.state).toBe("dismissed"));
  });

  it("dismiss writes DOM attribute and localStorage", () => {
    const { result } = renderHook(() => usePreloaderState());
    act(() => result.current.dismiss());
    expect(document.documentElement.dataset.preloaderState).toBe("dismissed");
    expect(window.localStorage.getItem("hkj.preloader.dismissed")).toBe("1");
  });
});
```

- [ ] **Step 3: Run tests**

```bash
npm run test
```

Expected: all 3 new tests pass.

- [ ] **Step 4: Commit**

```bash
git add src/hooks/usePreloaderState.ts src/hooks/__tests__/usePreloaderState.test.ts
git commit -m "feat(preloader): add usePreloaderState hook + tests

Phase 6 of hero/preloader/theme rollout. useSyncExternalStore-based
hook reads from document.documentElement.dataset.preloaderState as
canonical source. Default storage backend is localStorage
(one-time-ever); a single-line constant switches to sessionStorage
for the more frequent ritual."
```

### Task 6.3: Build `PreloaderInit.tsx` (inline init script)

**Files:**
- Create: `src/components/PreloaderInit.tsx`

- [ ] **Step 1: Write the component**

Create `src/components/PreloaderInit.tsx`:

```tsx
/**
 * Inline blocking script rendered ahead of <main> on the home route
 * only. Reads localStorage('hkj.preloader.dismissed') and sets
 * data-preloader-state="dismissed" | "active" on <html> before the
 * preloader DOM parses — so CSS visibility resolves correctly on
 * first paint.
 *
 * Pairs with usePreloaderState. Mounted in src/app/page.tsx, NOT in
 * root layout (preloader is home-route-only).
 *
 * Pattern: theme-flash mitigation, identical shape to ThemeInit.
 */
export default function PreloaderInit() {
  const code = `(function(){try{var v=localStorage.getItem('hkj.preloader.dismissed');document.documentElement.dataset.preloaderState=(v==='1')?'dismissed':'active';}catch(e){document.documentElement.dataset.preloaderState='active';}})();`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
```

- [ ] **Step 2: Don't commit yet** — Tasks 6.4–6.5 commit together.

### Task 6.4: Build `PreloaderClient.tsx` (dismiss handler + exit animation)

**Files:**
- Create: `src/components/PreloaderClient.tsx`

- [ ] **Step 1: Write the component**

Create `src/components/PreloaderClient.tsx`:

```tsx
"use client";

import { useEffect } from "react";
import { usePreloaderState } from "@/hooks/usePreloaderState";

/**
 * PreloaderClient — listens for click anywhere on the document and
 * for keypress (Enter/Space/Escape). On any of those, runs the exit
 * animation by adding a class to the preloader root, then dismisses
 * via the hook (which writes localStorage and updates the DOM
 * attribute, hiding the preloader via CSS).
 *
 * Reduced motion: skip the animation; immediate dismiss.
 */
export default function PreloaderClient() {
  const { state, dismiss } = usePreloaderState();

  useEffect(() => {
    if (state !== "active") return;

    function handleDismiss() {
      const root = document.querySelector(".preloader") as HTMLElement | null;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduced || !root) {
        dismiss();
        return;
      }

      // Add exiting class to trigger CSS-driven staggered fade
      root.classList.add("preloader--exiting");
      // After animation completes, dismiss (CSS hides the preloader)
      window.setTimeout(() => {
        dismiss();
      }, 600);
    }

    function onClick() {
      handleDismiss();
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Enter" || e.key === " " || e.key === "Escape") {
        e.preventDefault();
        handleDismiss();
      }
    }

    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [state, dismiss]);

  return null;
}
```

- [ ] **Step 2: Don't commit yet** — Task 6.5 ships everything together.

### Task 6.5: Build `Preloader.tsx` (server component DOM)

**Files:**
- Create: `src/components/Preloader.tsx`

- [ ] **Step 1: Write the component**

Create `src/components/Preloader.tsx`:

```tsx
import PreloaderClient from "@/components/PreloaderClient";

/**
 * Preloader — renders the preloader DOM (ASCII video, source caption,
 * dismiss hint). Server component (no "use client"). Color and
 * visibility are theme-INDEPENDENT — preloader is always dark
 * regardless of resolved theme. Inline literal hex values used
 * instead of --paper / --ink tokens.
 *
 * Visibility governed by data-preloader-state on <html>:
 * - "active" → display block
 * - "dismissed" → display none
 * - unset → fallback to active (no JS / blocked script)
 *
 * Mount only on the home route (src/app/page.tsx).
 */
export default function Preloader() {
  return (
    <>
      <div className="preloader" role="presentation" aria-hidden="true">
        <video
          className="preloader__video"
          src="/assets/preloader-ascii.webm"
          poster="/assets/preloader-ascii-frame.png"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
        <span className="preloader__caption">
          PHYLLOTAXIS · 137.508° · N=1597
        </span>
        <span className="preloader__hint">
          click to enter
          <span className="arrow-glyph"> →</span>
        </span>
      </div>

      <PreloaderClient />

      <style>{`
        .preloader {
          position: fixed;
          inset: 0;
          z-index: 100;
          background: #0E0D09;
          color: #F8F5EC;
          display: grid;
          place-items: center;
          padding: clamp(20px, 3vh, 36px) clamp(20px, 4vw, 64px);
          opacity: 1;
          transition: opacity 600ms var(--ease);
        }
        html[data-preloader-state="dismissed"] .preloader {
          display: none;
        }
        html:not([data-preloader-state]) .preloader {
          /* No-JS fallback — show the preloader. Click handler still
             dismisses if JS lands later. */
        }
        .preloader--exiting {
          opacity: 0;
          pointer-events: none;
        }
        .preloader__video {
          max-width: 80vw;
          max-height: 70vh;
          width: auto;
          height: auto;
          object-fit: contain;
        }
        .preloader__caption {
          position: absolute;
          left: clamp(20px, 4vw, 64px);
          bottom: clamp(20px, 3vh, 36px);
          font-family: var(--font-stack-sans);
          font-size: 11px;
          letter-spacing: 0.11em;
          text-transform: uppercase;
          color: rgba(248, 245, 236, 0.55);
        }
        .preloader__hint {
          position: absolute;
          right: clamp(20px, 4vw, 64px);
          bottom: clamp(20px, 3vh, 36px);
          font-family: var(--font-stack-sans);
          font-size: 11px;
          letter-spacing: 0.02em;
          text-transform: lowercase;
          color: rgba(248, 245, 236, 0.55);
        }

        @media (prefers-reduced-motion: reduce) {
          .preloader { transition: none; }
          .preloader--exiting { opacity: 0; }
        }

        @media (prefers-reduced-data: reduce) {
          .preloader__video {
            display: none;
          }
          /* Static PNG via background fallback */
          .preloader::after {
            content: "";
            background: url('/assets/preloader-ascii-frame.png') center / contain no-repeat;
            position: absolute;
            inset: clamp(20px, 5vh, 60px) clamp(20px, 5vw, 80px);
          }
        }
      `}</style>
    </>
  );
}
```

- [ ] **Step 2: Don't commit yet** — Task 6.6 mounts and commits.

### Task 6.6: Mount Preloader + PreloaderInit on home route

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Mount in correct order**

Per the spec's locked init-script ordering: `ThemeInit` (root layout, runs first on every route) → `HomeViewInit` (home page) → `PreloaderInit` (home page).

In `src/app/page.tsx`, add the imports and mounts. The order in JSX matters for the inline scripts — they execute in document order during HTML parsing.

```tsx
import CopyEmailLink from "@/components/CopyEmailLink";
import Folio from "@/components/Folio";
import HomeViewInit from "@/components/HomeViewInit";
import ViewToggle from "@/components/ViewToggle";  // (still imported for ReservedZone)
import WorkPlate from "@/components/WorkPlate";
import WorkList from "@/components/WorkList";
import ReservedZone from "@/components/ReservedZone";
import Preloader from "@/components/Preloader";
import PreloaderInit from "@/components/PreloaderInit";
import { PIECES } from "@/constants/pieces";

export default function Home() {
  const pieces = PIECES;

  return (
    <>
      {/* Order matters — inline scripts run in document order */}
      <HomeViewInit />
      <PreloaderInit />
      <Preloader />
      <main id="main" className="home">
        <Folio token="§01" />
        
        <div className="home__reserved-wrapper">
          <ReservedZone />
        </div>
        
        <section className="home__gallery" aria-label="Studio catalog (gallery)">
          {pieces.map((piece) => (
            <WorkPlate key={piece.slug} piece={piece} />
          ))}
        </section>
        
        <section className="home__list" aria-label="Studio catalog (list)">
          <WorkList pieces={pieces} />
        </section>
        
        <footer className="home__foot">
          <CopyEmailLink className="home__mail" />
          <span className="home__loc tabular">2026 · new york</span>
        </footer>
        
        {/* style block unchanged from prior tasks */}
      </main>
    </>
  );
}
```

`<HomeViewInit />` and `<PreloaderInit />` are server components rendering plain `<script>` tags — they execute synchronously during HTML parse, before `<main>` paints. `<Preloader />` is the actual preloader DOM (rendered as a fixed-position overlay).

- [ ] **Step 2: Verify gates**

```bash
npx tsc --noEmit && npm run lint && npm run test && npm run build
```

Expected: all clean.

- [ ] **Step 3: Smoke test the full preloader flow**

```bash
npm run dev
```

Open `http://localhost:3000` (clear localStorage first):

```js
localStorage.clear();
location.reload();
```

Verify:
- Preloader appears full-viewport on first load (after clearing localStorage)
- Phyllotaxis ASCII video plays (or static PNG fallback if `.webm` not yet acquired)
- Source caption renders bottom-left: `PHYLLOTAXIS · 137.508° · N=1597`
- Dismiss hint renders bottom-right: `click to enter →`
- Click anywhere on the page → exit animation runs (~600ms opacity fade), preloader disappears, hero is revealed beneath
- Reload the page → preloader does NOT re-appear (localStorage persists)
- Clear localStorage → preloader returns on reload

Test reduced-motion:

```js
// In DevTools, Rendering panel → "Emulate CSS media feature prefers-reduced-motion: reduce"
// Reload, click → preloader dismisses instantly (no fade)
```

Test reduced-data:

```js
// In DevTools, Network panel → "Throttling" → "Save-Data: on" (or set custom header)
// Reload — verify preloader.webm is NOT requested in the Network tab
// The static PNG should appear as a CSS background instead
```

Test on `/work/[slug]`:

```js
// Navigate to /work/gyeol — preloader should NOT appear (it's home-only)
```

- [ ] **Step 4: Commit Phase 6 components + integration together**

```bash
git add src/components/Preloader.tsx src/components/PreloaderClient.tsx src/components/PreloaderInit.tsx src/app/page.tsx
git commit -m "feat(preloader): full-viewport ASCII preloader with click dismiss

Phase 6 of hero/preloader/theme rollout. Three new components:
- PreloaderInit: server component, inline IIFE that reads
  localStorage('hkj.preloader.dismissed') and sets
  data-preloader-state on <html> before paint.
- PreloaderClient: client component, listens for click anywhere
  on document or keypress (Enter/Space/Escape). Runs the 600ms
  opacity exit animation, then dismisses via the hook.
- Preloader: server component, renders fixed-position overlay
  (z=100) with the ASCII video, source caption ('PHYLLOTAXIS ·
  137.508° · N=1597'), and dismiss hint. Theme-independent
  (always dark via inline literal hex). Reduced-motion = instant
  dismiss. Reduced-data = static PNG background instead of .webm.

Mounted only on the home route. localStorage default
(one-time-ever); switch to sessionStorage in usePreloaderState.ts
constant for the more frequent ritual."
```

### Task 6.7: Final smoke + verification

- [ ] **Step 1: Run all gates one final time**

```bash
npx tsc --noEmit && npm run lint && npm run test && npm run build
```

Expected: clean.

- [ ] **Step 2: Walk every route in both themes**

```bash
npm run dev
```

For each route in light AND dark mode:
- `/` (gallery view)
- `/` (list view)
- `/work/gyeol`
- `/work/sift`
- `/work/untitled-01` (404 expected for placeholder)
- `/studio`
- `/bookmarks`
- `/notes`
- `/notes/<a-real-slug>`

For each: confirm the page renders correctly in both themes; microtype tracking shifts (0.12em → 0.11em); typography is PP Neue Montreal; PaperGrain is visible; nav/folio render in correct theme color.

- [ ] **Step 3: Commit any final polish**

If smoke surfaced any issues, fix and commit. Otherwise no final commit needed.

---

## Done

Six phases shipped:

- **Phase 1:** dark-mode token block, `--microtype-tracking` variable, `useTheme` hook with tests, `ThemeInit` inline script, audit of components for hardcoded colors.
- **Phase 2:** `ReservedZone` container, `ThemeToggle` glyph button. Mounted at end of existing 2-col grid as transitional placement.
- **Phase 3:** PP Neue Montreal swap via `next/font/local`. Geist fully removed.
- **Phase 4:** Home gallery shifts to 3-col grid. `ViewToggle` migrates from free-floating into `ReservedZone`. Reserved zone is a sibling of gallery and list (visible in both views).
- **Phase 5:** `ScrambleText` component with tests. Integrated on `WorkPlate.title` (link branch only — placeholders stay plain).
- **Phase 6:** Preloader full system (server DOM, inline init script, client dismissal handler, hook with tests). Asset acquisition documented; defer-or-do per user preference.

Open content tasks for the user (independent of this plan):
- Confirm the ASCII source dataset (default: phyllotaxis)
- Generate + convert the preloader video asset (Phase 6.1)
- Decide localStorage vs sessionStorage default (locked default = localStorage)
- Reserved zone future content (status feed, "now" line, etc.)

---
