# Taste Polish Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a coherent taste / restraint / craft upgrade across the HKJ portfolio — OpenType discipline, unified hover vocabulary, native scroll + deliberate transitions, two structural surfaces (`/colophon`, `/notes`), shelf verticals, and a command palette — without introducing a single new design token, font, or easing curve.

**Architecture:** Phased, non-breaking additions + one library removal (Lenis). Each phase ships a coherent slice independently. Every new component composes from the existing token + type + motion catalog documented in [globals.css](../../src/app/globals.css) and [TASKS.md](../../TASKS.md).

**Tech Stack:**
- Next.js 16 App Router (existing)
- React 19 client components (existing)
- Fragment Mono (variable mono) + Gambetta (variable serif) via `next/font/local`
- View Transitions API (native, no library) — Phase 2
- `cmdk` + `vaul` (new dependencies) — Phase 3b
- **Removed**: `lenis` — Phase 1

**Reference spec:** [docs/superpowers/specs/2026-04-22-taste-polish-design.md](../specs/2026-04-22-taste-polish-design.md)

---

## File Structure

Files created, modified, or deleted across all phases:

### Created
- `src/components/Folio.tsx` — mono microtype corner label
- `src/components/CommandPalette.tsx` — cmdk wrapper w/ theme
- `src/hooks/useSectionReveal.ts` — IntersectionObserver hook for case-study reveal
- `src/app/colophon/page.tsx` — typographic manifesto route
- `src/app/notes/page.tsx` — notes index route
- `src/app/notes/[slug]/page.tsx` — notes detail route
- `src/constants/notes.ts` — note data + type

### Modified
- `src/app/globals.css` — font-feature-settings selectors, underline-color vocabulary, remove old `.prose a` border-bottom, `scroll-behavior: smooth`, view-transition CSS
- `src/app/layout.tsx` — drop SmoothScroll, add Folio calls via pages, mount CommandPalette (Phase 3b)
- `src/app/page.tsx` — drop `.cd__mail` border-bottom, add Folio, add `⌘K` footer hint (Phase 3b)
- `src/app/about/page.tsx` — drop `.about__mail` border-bottom, add Folio, tight en-dashes
- `src/app/contact/page.tsx` — drop `.card__handle` border-bottom, add Folio
- `src/app/shelf/page.tsx` — rewrite for grouped verticals, add Folio
- `src/app/work/[slug]/page.tsx` — add Folio, add `view-transition-name` on title
- `src/components/NavCoordinates.tsx` — scroll-hide logic, optional weight-nudge on wordmark
- `src/components/CaseStudy.tsx` — `view-transition-name` on title, section reveal hook wiring
- `src/components/GutterStrip.tsx` — `view-transition-name` on strip row titles, drop `data-lenis-prevent`
- `src/constants/shelf.ts` — add `group: ShelfGroup` field, seed WATCH / KEEP / VISIT items
- `src/constants/experience.ts` — tight en-dashes in periods
- `package.json` — remove `lenis`, add `cmdk` + `vaul` (Phase 3b)

### Deleted
- `src/components/SmoothScroll.tsx`

Each task below touches a contained set of the above. Tasks run in numerical order within each chunk; chunks run in order 1 → 2 → 3 → 4.

---

## Chunk 1: Phase 1 — Typographic & interaction chrome

**Output of this chunk:** Every existing page reads as typographically fluent, hover vocabulary is unified, nav hides on scroll down, a Folio corner-stamp is live site-wide, Lenis is gone, native scroll is back. No new routes. No new libraries.

**Estimated:** ~1 day across 7 tasks.

---

### Task 1: Verify Fragment Mono font capabilities

**Files:**
- Inspect: `src/fonts/fragment-mono/FragmentMono-Regular.woff2`
- Inspect: `src/fonts/gambetta/Gambetta-Variable.woff2`

- [ ] **Step 1: Check Fragment Mono weight axis**

Run:
```bash
ls -la src/fonts/fragment-mono/ && cat src/app/layout.tsx | grep -A 3 fragmentMono
```

Expected: confirm it's `FragmentMono-Regular.woff2` (non-variable, single weight). If you see `Variable` in the filename or `weight: "100 900"` in the config, it's variable.

- [ ] **Step 2: Check Gambetta OpenType coverage**

If you have access to a font inspector (e.g. FontDrop.info), upload `src/fonts/gambetta/Gambetta-Variable.woff2` and confirm presence of `onum`, `lnum`, `tnum` features. If no inspector is available, assume present — Gambetta is a well-known typeface with standard OT coverage.

- [ ] **Step 3: Record findings**

Write two boolean facts at the top of a scratch note (or in commit message of Task 2):
```
Fragment Mono has weight axis: [YES | NO]
Gambetta has onum feature:     [YES | NO]
```

These determine whether Task 6 (weight nudge) and part of Task 2 (onum declaration) ship or are skipped.

- [ ] **Step 4: No commit required**

This is a pre-flight check, not a code change.

---

### Task 2: Typographic micro-discipline

**Files:**
- Modify: `src/app/globals.css` (add OT selector rules)
- Modify: `src/constants/experience.ts` (em → en dashes)
- Modify: `src/constants/shelf.ts` (spot-check year ranges)
- Modify: `src/components/CaseStudy.tsx` (hanging-punctuation + text-wrap)

- [ ] **Step 1: Read current globals.css**

Run:
```bash
cat src/app/globals.css | head -80
```

Locate the `:root` block with existing tokens (`--paper`, `--ink`, etc.). Confirm no `--ft-*` tokens exist (we must NOT add any).

- [ ] **Step 2: Add OpenType selector rules to globals.css**

Append to `globals.css` (no new tokens — rules apply to existing classes):

```css
/* ─── OpenType discipline ────────────────────────────────────────────────── */

/* Old-style figures in prose (Gambetta serif — case-study body only).
   Skip the onum declaration if Gambetta audit from Task 1 shows no onum. */
.case__prose,
.case__prose--lead,
.case__prose--step {
  font-feature-settings: "onum" on;
  hanging-punctuation: first last;
  text-wrap: pretty;
}

/* Tabular lining numerals in grids, ledgers, stats, dates */
.tabular,
.case__ledger-row,
.case__stat-val,
.shelf__row-year {
  font-feature-settings: "tnum" on, "lnum" on;
  font-variant-numeric: tabular-nums lining-nums;
}
```

- [ ] **Step 3: Update experience.ts date ranges to tight en-dashes**

Open `src/constants/experience.ts`. Replace em-dashes in `period` values with tight en-dashes (no surrounding spaces):

```ts
// BEFORE
{ period: "2024 — Present", role: "Independent",            org: "Design engineering" },
{ period: "2023 — 2024",    role: "Design technologist",    org: "" },
{ period: "2021 — 2023",    role: "Frontend developer",     org: "" },

// AFTER
{ period: "2024–Present",   role: "Independent",            org: "Design engineering" },
{ period: "2023–2024",      role: "Design technologist",    org: "" },
{ period: "2021–2023",      role: "Frontend developer",     org: "" },
```

The character to use is en-dash U+2013 (`–`), NOT em-dash U+2014 (`—`) or hyphen-minus `-`.

- [ ] **Step 4: Audit shelf.ts for year ranges**

Run:
```bash
grep -En "[0-9] — [0-9]|[0-9]—[0-9]" src/constants/shelf.ts
```

Expected: no matches (shelf uses single years, not ranges). If any match appears, convert to tight en-dash. (`-E` is required for POSIX alternation `|` on most greps.)

- [ ] **Step 5: Verify no new hex values or tokens**

Run:
```bash
git diff src/app/globals.css | grep "^+" | grep -E "#[0-9a-fA-F]{3,6}|--[a-z-]+:"
```

Expected: no lines. If any appear, revert that change — Task 2 must introduce zero new tokens or colors.

- [ ] **Step 6: Type check**

Run: `npx tsc --noEmit`
Expected: exit code 0, no output.

- [ ] **Step 7: Commit**

```bash
git add src/app/globals.css src/constants/experience.ts src/constants/shelf.ts src/components/CaseStudy.tsx
git commit -m "feat(type): opentype discipline + tight en-dashes

- font-feature-settings onum on .case__prose* (Gambetta)
- tnum + lnum on .tabular / .case__ledger-row / .case__stat-val / .shelf__row-year
- hanging-punctuation + text-wrap: pretty on case-study prose
- tight en-dashes in experience.ts date ranges (no spaces)
- no new tokens, hex values, or easing curves"
```

---

### Task 3: Unified hover vocabulary

**Files:**
- Modify: `src/app/globals.css` (replace `.prose a` border, add underline vocabulary + arrow glyph class)
- Modify: `src/app/about/page.tsx` (drop `.about__mail` border-bottom rule)
- Modify: `src/app/contact/page.tsx` (drop `.card__handle` border-bottom rule)
- Modify: `src/app/page.tsx` (drop `.cd__mail` border-bottom rule)

- [ ] **Step 1: Locate and delete the existing `.prose a` rules in globals.css**

Run:
```bash
grep -En "^\.prose a" src/app/globals.css
```

Expected: find two rules around line 139–144:

```css
.prose a { color: var(--ink); border-bottom: 1px solid var(--ink-hair); }
.prose a:hover { border-bottom-color: var(--ink); }
```

**Delete both of these lines.** (The new consolidated block in Step 2 replaces them — don't leave both versions in the file.) Verify:

```bash
grep -En "^\.prose a" src/app/globals.css
```

Expected after deletion: no matches.

- [ ] **Step 2: Append new underline vocabulary to globals.css**

Append a new block to `globals.css` (after the existing `.prose` rules, in the "House voice primitives" section):

```css
/* ─── Unified hover vocabulary ──────────────────────────────────────────── */

/* Underline-color fade — default for inline links and meaningful handles */
a.link, .prose a, .shelf__row-link,
.about__mail, .card__handle, .cd__mail {
  color: var(--ink);
  text-decoration: underline;
  text-decoration-color: transparent;
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
  border-bottom: none;
  transition: text-decoration-color 180ms var(--ease);
}
a.link:hover, .prose a:hover, .shelf__row-link:hover,
.about__mail:hover, .card__handle:hover, .cd__mail:hover {
  text-decoration-color: currentColor;
}

/* Arrow-glyph slide — for "forward" action glyphs next to labels */
.arrow-glyph {
  display: inline-block;
  transition: transform 200ms cubic-bezier(0.33, 0.12, 0.15, 1);
}
*:hover > .arrow-glyph,
*:focus-visible > .arrow-glyph { transform: translateX(6px); }
```

- [ ] **Step 3: Remove local border-bottom on `.about__mail`**

Open `src/app/about/page.tsx`. Find the style block. Locate:

```css
.about__mail {
  color: var(--ink);
  border-bottom: 1px solid var(--ink-hair);
  transition: border-color 180ms var(--ease);
}
.about__mail:hover { border-bottom-color: var(--ink); }
```

Delete both rules entirely — the consolidated globals.css block now handles this.

- [ ] **Step 4: Remove local border-bottom on `.card__handle`**

Open `src/app/contact/page.tsx`. Find:

```css
.card__handle {
  ...
  padding-bottom: 2px;
  border-bottom: 1px solid var(--ink-hair);
  transition: border-color 180ms var(--ease), color 180ms var(--ease);
}
.card__handle:hover {
  border-bottom-color: var(--ink);
}
```

Replace with (preserve `padding-bottom: 2px` for baseline alignment, drop borders):

```css
.card__handle {
  ...
  padding-bottom: 2px;
}
```

(Keep other declarations in the block intact — this is a surgical removal of border + transition + hover.)

- [ ] **Step 5: Remove local border-bottom on `.cd__mail`**

Open `src/app/page.tsx`. Find:

```css
.cd__mail {
  justify-self: start;
  color: var(--ink);
  border-bottom: 1px solid var(--ink-hair);
  transition: border-color 180ms var(--ease), color 180ms var(--ease);
}
.cd__mail:hover { border-bottom-color: var(--ink); }
.cd__mail[data-copied] {
  color: var(--ink-3);
  border-bottom-color: var(--ink);
}
```

Replace with (keep `justify-self`, `data-copied` color shift, lose border):

```css
.cd__mail { justify-self: start; }
.cd__mail[data-copied] { color: var(--ink-3); }
```

- [ ] **Step 6: Type check + visual smoke test**

Run: `npx tsc --noEmit`
Expected: exit code 0.

Run: `curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/`
Expected: `200`.

Load `/`, `/about`, `/contact`, `/shelf` in the browser. On each, hover the email link or an inline link. Confirm:
- Underline fades in (180 ms), not a border appearing
- Underline is 1 px, offset 3 px from baseline
- No double-underline / border stacking
- No layout shift on hover

- [ ] **Step 7: Commit**

```bash
git add src/app/globals.css src/app/about/page.tsx src/app/contact/page.tsx src/app/page.tsx
git commit -m "feat(hover): unified underline-color fade across all link patterns

- single globals.css rule handles .prose a, .shelf__row-link,
  .about__mail, .card__handle, .cd__mail
- text-decoration-color transitions from transparent to currentColor
  over 180ms ease
- removes scattered border-bottom hover patterns in page-local styles
- adds .arrow-glyph class with 6px translateX slide on parent hover"
```

---

### Task 4: Remove Lenis

**Files:**
- Delete: `src/components/SmoothScroll.tsx`
- Modify: `src/app/layout.tsx` (drop import + mount)
- Modify: `src/components/GutterStrip.tsx` (drop `data-lenis-prevent` attribute)
- Modify: `src/app/globals.css` (add `scroll-behavior: smooth` on html)
- Modify: `package.json` (remove `lenis` dependency)

- [ ] **Step 1: Confirm Lenis is only used by SmoothScroll**

Run:
```bash
grep -rn "lenis\|Lenis\|SmoothScroll" src/
```

Expected: matches in `src/app/layout.tsx` (import + mount), `src/components/SmoothScroll.tsx` (the component itself), and `src/components/GutterStrip.tsx` (`data-lenis-prevent` attribute).

If any other file imports `lenis` or uses `SmoothScroll`, it must be handled before proceeding.

- [ ] **Step 2: Delete SmoothScroll.tsx**

Run:
```bash
rm src/components/SmoothScroll.tsx
```

- [ ] **Step 3: Remove SmoothScroll import + mount from layout.tsx**

Open `src/app/layout.tsx`. Delete:
- The `import SmoothScroll from "@/components/SmoothScroll";` line
- The `<SmoothScroll />` element in the body

- [ ] **Step 4: Remove `data-lenis-prevent` from GutterStrip.tsx**

Open `src/components/GutterStrip.tsx`. Find the root `<div>` of the component (has `className="strip"`). Remove the `data-lenis-prevent` attribute.

- [ ] **Step 5: Add native smooth scroll for anchor clicks to globals.css**

In `globals.css`, in the `html` rule (or add one if none exists), add:

```css
html { scroll-behavior: smooth; }
```

Place it near the top-level reset section. Native only — no library.

- [ ] **Step 6: Remove lenis from package.json**

Open `package.json`. In `dependencies`, remove the `"lenis": "^..."` line. Save.

Run:
```bash
npm install
```

Expected: lenis uninstalled; no errors. `package-lock.json` updates automatically.

- [ ] **Step 7: Type check**

Run: `npx tsc --noEmit`
Expected: exit code 0.

- [ ] **Step 8: Regression tests (from spec §1.6)**

Start the dev server (`npm run dev`) and manually verify:

1. Load `/` — scroll the GutterStrip with the wheel. Snap fires cleanly over 920 ms. Looping boundary (piece 4 → piece 1) teleports invisibly.
2. Load `/about`, `/shelf`, `/contact` — page scroll uses native trackpad momentum. No artificial smoothing lag.
3. Load `/work/gyeol` — scroll top to bottom with the wheel. No stuttering. Wheel events do NOT trigger GutterStrip behavior (GutterStrip is only on `/`).
4. Press arrow keys (or `Space` / `Shift-Space`) on `/about`, `/shelf`. Native page-scroll activates.

If any regression is observed, do NOT commit — diagnose first.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "refactor(scroll): remove lenis, restore native scroll + html smooth-scroll

- deletes src/components/SmoothScroll.tsx
- drops lenis dependency from package.json
- removes data-lenis-prevent from GutterStrip (no longer needed)
- adds scroll-behavior: smooth on html for native anchor scrolling
- GutterStrip wheel-snap unchanged (already native-friendly)
- friction preserved via wheel-snap + deliberate CSS transitions (160-400ms)"
```

---

### Task 5: Folio component

**Files:**
- Create: `src/components/Folio.tsx`
- Modify: `src/app/page.tsx` (mount Folio with token `§01`)
- Modify: `src/app/about/page.tsx` (mount Folio with token `§02`)
- Modify: `src/app/shelf/page.tsx` (mount Folio with token `§03`)
- Modify: `src/app/contact/page.tsx` (mount Folio with token `§04`)
- Modify: `src/app/work/[slug]/page.tsx` (mount Folio with token `№{order}`)

- [ ] **Step 1: Create Folio component**

Create `src/components/Folio.tsx`:

```tsx
"use client";

/**
 * Folio — tiny mono microtype pinned to the top-right of every route.
 * Renders `HKJ / <token> / <YYYY>[.<month>]`. Component owns the frame
 * (HKJ prefix + year suffix) so a caller typo can't drift the brand
 * mark or year; callers pass only the middle token.
 */
type FolioProps = {
  /** Middle segment — e.g. "§02", "N-001", "№02". */
  token: string;
  /** Optional 2-digit month (e.g. "04"); appends ".<month>" to the year. */
  month?: string;
};

const YEAR = 2026;

export default function Folio({ token, month }: FolioProps) {
  const year = month ? `${YEAR}.${month}` : `${YEAR}`;
  return (
    <div className="folio" aria-hidden>
      HKJ&nbsp;/&nbsp;{token}&nbsp;/&nbsp;{year}
      <style>{`
        .folio {
          position: fixed;
          top: 24px;
          right: 24px;
          z-index: 51;
          font-family: var(--font-stack-mono);
          font-size: 9px;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: var(--ink-4);
          pointer-events: none;
          /* Hide on narrow viewports to avoid colliding with mobile nav */
        }
        @media (max-width: 640px) {
          .folio { display: none; }
        }
      `}</style>
    </div>
  );
}
```

- [ ] **Step 2: Mount on home `/`**

Open `src/app/page.tsx`. Import Folio at the top:

```tsx
import Folio from "@/components/Folio";
```

Inside the `<main>` element (at the top, before the `<section>`), add:

```tsx
<Folio token="§01" />
```

- [ ] **Step 3: Mount on `/about`**

`src/app/about/page.tsx`, same pattern: import + `<Folio token="§02" />` at the top of `<main>`.

- [ ] **Step 4: Mount on `/shelf`**

`src/app/shelf/page.tsx`: `<Folio token="§03" />`.

- [ ] **Step 5: Mount on `/contact`**

`src/app/contact/page.tsx`: `<Folio token="§04" />`.

- [ ] **Step 6: Mount on `/work/[slug]` with dynamic token**

Open `src/app/work/[slug]/page.tsx`. After finding the `piece` by slug, render Folio with the order-based token:

```tsx
<Folio token={`№${String(piece.order).padStart(2, "0")}`} />
```

- [ ] **Step 7: Type check + visual verification**

Run: `npx tsc --noEmit`
Expected: exit code 0.

Load each route in the browser. Confirm top-right of each page shows:
- `/` → `HKJ / §01 / 2026`
- `/about` → `HKJ / §02 / 2026`
- `/shelf` → `HKJ / §03 / 2026`
- `/contact` → `HKJ / §04 / 2026`
- `/work/gyeol` → `HKJ / №02 / 2026`

On a viewport <640 px wide, folio should be hidden.

- [ ] **Step 8: Commit**

```bash
git add src/components/Folio.tsx src/app/page.tsx src/app/about/page.tsx src/app/shelf/page.tsx src/app/contact/page.tsx src/app/work/[slug]/page.tsx
git commit -m "feat(folio): corner microtype label per route

- new Folio component, 9px mono ink-4 at top: 24px right: 24px
- owns HKJ / <token> / <YYYY>[.<month>] frame; callers pass token only
- mounted on all existing routes with stable section numbering
  (§01-04 for home/about/shelf/contact, №NN for work/[slug])
- hidden under 640px width to avoid nav collision"
```

---

### Task 6: Nav hide-on-scroll-down, reveal-on-scroll-up

**Files:**
- Modify: `src/components/NavCoordinates.tsx`

- [ ] **Step 1: Read current NavCoordinates.tsx**

Run: `cat src/components/NavCoordinates.tsx | head -60`

Locate the component function signature and the inline style block.

- [ ] **Step 2: Add scroll-direction state + effect**

Inside the `NavCoordinates` function, add at the top (after `const pathname = usePathname();`):

```tsx
const [hidden, setHidden] = useState(false);
useEffect(() => {
  let lastY = window.scrollY;
  let rafPending = false;
  const update = () => {
    rafPending = false;
    const y = window.scrollY;
    const scrollingDown = y > lastY;
    const next = scrollingDown && y > 80;
    // Only call setState on actual change — avoids re-renders per scroll frame
    setHidden((prev) => (prev === next ? prev : next));
    lastY = y;
  };
  const onScroll = () => {
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(update);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  return () => window.removeEventListener("scroll", onScroll);
}, []);
```

Add the `useState` and `useEffect` imports if not present:

```tsx
import { useEffect, useState } from "react";
```

- [ ] **Step 3: Apply `data-hidden` attribute conditionally**

Find the root `<nav>` element. Add the attribute:

```tsx
<nav
  aria-label="Primary"
  className="nav"
  data-hidden={hidden ? "" : undefined}
>
```

- [ ] **Step 4: Add CSS for the hide transform**

In the inline `<style>` block of NavCoordinates.tsx, locate the `.nav` rule. Add `transform` + `transition` declarations and the `[data-hidden]` state:

```css
.nav {
  position: fixed;
  /* ... existing declarations ... */
  transform: translateY(0);
  transition: transform 200ms var(--ease);
}
.nav[data-hidden] { transform: translateY(-100%); }

@media (prefers-reduced-motion: reduce) {
  .nav { transition: none; }
  .nav[data-hidden] { transform: none; }  /* never hide under reduced-motion */
}
```

- [ ] **Step 5: Type check + visual verification**

Run: `npx tsc --noEmit`
Expected: exit code 0.

Load `/about` in the browser. Scroll down the page slowly. Observe:
- Nav slides up out of view once scroll exceeds ~80 px
- Scroll back up → nav slides back into view
- On `/` (height: 100svh, no scroll) → nav never moves

Also: simulate `prefers-reduced-motion: reduce` (devtools Rendering panel). Confirm nav never hides.

- [ ] **Step 6: Commit**

```bash
git add src/components/NavCoordinates.tsx
git commit -m "feat(nav): hide on scroll down, reveal on scroll up

- useState + useEffect track scroll direction via rAF-throttled listener
- [data-hidden] attribute + transform: translateY(-100%) hide when
  scrolling down past 80px
- 200ms var(--ease) transition
- reduced-motion: nav never hides (transition and transform disabled)
- / is unaffected (no scrollable overflow)"
```

---

### Task 7: Variable-font weight nudge on wordmark *(conditional)*

**Only run this task if Task 1's Fragment Mono check confirmed a weight axis.**

**Files:**
- Modify: `src/components/NavCoordinates.tsx` (add wordmark hover rule)

- [ ] **Step 1: Decide to skip or ship**

Look at Task 1's recorded fact. If `Fragment Mono has weight axis: NO`, skip the rest of this task. No substitute, no scale-transform. Mark the task complete and move to Chunk 2.

If `YES`, continue.

- [ ] **Step 2: Add variation-settings transition on `.nav__mark`**

In `NavCoordinates.tsx`, find the `.nav__mark` CSS rule. Add:

```css
.nav__mark {
  /* ...existing declarations ... */
  font-variation-settings: "wght" 400;
  transition:
    opacity 180ms var(--ease),
    font-variation-settings 150ms var(--ease);
}
.nav__mark:hover {
  font-variation-settings: "wght" 460;
}
```

- [ ] **Step 3: Type check + visual verification**

Run: `npx tsc --noEmit`
Expected: exit code 0.

Hover the `hyeonjoon jun · design engineer` wordmark in the nav. It should subtly weigh up (400 → 460) over 150 ms.

- [ ] **Step 4: Commit**

```bash
git add src/components/NavCoordinates.tsx
git commit -m "feat(nav): variable-font weight nudge on wordmark hover

- font-variation-settings 'wght' 400 → 460 over 150ms
- hover reward is legibility nuance, not motion
- restricted to .nav__mark only (single surface)"
```

---

**End of Chunk 1.** Phase 1 ships: 7 tasks, 5–7 commits (Task 7 may skip), zero new tokens / fonts / curves introduced, zero content burden.

Pause here for chunk 1 review before proceeding to Chunk 2.

---

## Chunk 2: Phase 2 — Cross-route & structural transitions

**Output of this chunk:** Navigating from `/` to a `/work/[slug]` page crossfades over 300 ms via the View Transitions API, with the project title doing a shared-element morph. Case-study §-sections fade in as you scroll. Reduced-motion clients see neither.

**Estimated:** ~0.5 day across 2 tasks.

---

### Task 8: View Transitions API — root crossfade + shared title

**Files:**
- Modify: `next.config.ts` (enable view transitions experimental flag)
- Modify: `src/app/globals.css` (view-transition pseudo-element CSS)
- Modify: `src/app/page.tsx` (add `view-transition-name: work-title` on the ACTIVE text-column title)
- Modify: `src/components/CaseStudy.tsx` (add `view-transition-name: work-title` on the h1)

**Important clarification**: The shared element is the **active text-column
title** (`.cd__name`) — NOT a strip plate. The GutterStrip contains media
only; titles live in the left/right text columns. On `/`, only the active
row (matched to `activeIdx`) carries `view-transition-name`. On
`/work/[slug]`, the `<h1 className="case__title">` carries it. One source
+ one destination = the browser morphs the text between them regardless
of which link the user actually clicked (text row OR strip plate). Strip
plate clicks still get the root crossfade without the shared-element
morph, which is fine.

- [ ] **Step 1: Enable view transitions in next.config.ts**

Next.js 16 does NOT enable view transitions automatically. Either set the
experimental flag or wrap routes in `<ViewTransitions>` from
`next/view-transitions`. Using the flag is simpler:

Open `next.config.ts`. Add to the config:

```ts
const nextConfig: NextConfig = {
  // ...existing config...
  experimental: {
    viewTransition: true,
  },
};
```

If the Next version in `package.json` is older than the flag introduction,
fall back to wrapping `{children}` in `src/app/layout.tsx` with
`<ViewTransitions>` from `next/view-transitions`.

Verify by running `npm run dev` — no config errors.

- [ ] **Step 2: Add view-transition CSS to globals.css**

Append to `globals.css`:

```css
/* ─── View transitions ────────────────────────────────────────────────────
   Browser-native shared-element crossfades on route change. Opt-in per
   element via view-transition-name. Reduced-motion explicitly overridden
   because browsers do NOT auto-skip these — the author must opt out. */

::view-transition-old(root),
::view-transition-new(root) {
  animation-duration: 300ms;
  animation-timing-function: cubic-bezier(0.41, 0.1, 0.13, 1);
}

::view-transition-old(work-title),
::view-transition-new(work-title) {
  animation-duration: 420ms;
  animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
}

@media (prefers-reduced-motion: reduce) {
  ::view-transition-old(root),
  ::view-transition-new(root),
  ::view-transition-old(work-title),
  ::view-transition-new(work-title) {
    animation: none;
  }
}
```

- [ ] **Step 3: Set `view-transition-name` on the ACTIVE text-column title**

Open `src/app/page.tsx`. The text columns render `.cd__name` spans — two on the left side (`left.map`), two on the right (`right.map`). Only the row matching `activeIdx` should carry the view-transition-name, so there's exactly one element per page with `view-transition-name: work-title` at any moment.

In the `left.map` block, the existing render is:

```tsx
<span className="cd__name">{displayTitle(p.title)}</span>
```

Replace with:

```tsx
<span
  className="cd__name"
  style={
    active ? ({ viewTransitionName: "work-title" } as React.CSSProperties) : undefined
  }
>
  {displayTitle(p.title)}
</span>
```

(`active` is the boolean already defined in the map scope: `const active = i === activeIdx;` for left column, `const active = globalIdx === activeIdx;` for right.)

Do the same substitution in the `right.map` block. No change to GutterStrip — the strip contains media, not titles. Plate clicks navigate and still receive the root crossfade without a shared-element morph, which is correct.

- [ ] **Step 4: Set `view-transition-name` on the CaseStudy title**

Open `src/components/CaseStudy.tsx`. Find the `<h1 className="case__title">`. Add inline style:

```tsx
<h1
  className="case__title"
  style={{ viewTransitionName: "work-title" } as React.CSSProperties}
>
  {piece.title}
</h1>
```

- [ ] **Step 5: Type check + navigation test**

Run: `npx tsc --noEmit`
Expected: exit code 0.

In a Chrome-based browser:
1. Load `/`
2. Click the active project's text column row (e.g. `01 / clouds at sea`)
3. Navigate transition: root crossfades for 300 ms, title morphs from the row's position to the h1 position over 420 ms
4. Browser back → reverse transition
5. Navigate by clicking a strip plate: root crossfades 300 ms but NO shared-element morph (plates don't carry the name). This is expected and correct.
6. Inspect DevTools Rendering panel → simulate `prefers-reduced-motion: reduce`. Navigate again: instant, no animation.
7. In Safari older than 18: instant navigation, no animation, no errors. (Skip if only Safari 18+ is available.)

- [ ] **Step 6: Commit**

```bash
git add next.config.ts src/app/globals.css src/app/page.tsx src/components/CaseStudy.tsx
git commit -m "feat(transitions): view-transitions api crossfade + shared work-title

- experimental.viewTransition enabled in next.config.ts
- ::view-transition-old/new(root) crossfade 300ms cubic-bezier(.41,.1,.13,1)
- ::view-transition-old/new(work-title) morph 420ms cubic-bezier(.22,1,.36,1)
- view-transition-name: work-title on the ACTIVE .cd__name in the text
  columns (only one element carries it at any time, matching activeIdx)
- view-transition-name: work-title on the CaseStudy h1
- strip plate clicks get root crossfade only; text-row clicks get the
  shared-element morph as well
- explicit @media (prefers-reduced-motion: reduce) animation: none override
  (browsers do not auto-skip these)
- older Safari/Firefox without the API fall back to instant navigation"
```

---

### Task 9: Case-study section reveal

**Files:**
- Create: `src/hooks/useSectionReveal.ts`
- Modify: `src/components/CaseStudy.tsx` (wire hook + data-revealed attribute on each `.case__section`)
- Modify: inline CSS in `CaseStudy.tsx` (reveal rules)

- [ ] **Step 1: Create the IntersectionObserver hook**

Create `src/hooks/useSectionReveal.ts`:

```tsx
"use client";

import { useEffect, useRef } from "react";

/**
 * useSectionReveal — attaches an IntersectionObserver that sets
 * data-revealed="" on each observed element once it crosses the
 * threshold. Fires once per element; disconnects when the whole
 * collection has revealed.
 */
export function useSectionReveal<T extends HTMLElement = HTMLElement>() {
  const containerRef = useRef<T | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      // Mark everything revealed immediately; skip the observer entirely.
      container
        .querySelectorAll<HTMLElement>(".case__section")
        .forEach((el) => el.setAttribute("data-revealed", ""));
      return;
    }

    const targets = Array.from(
      container.querySelectorAll<HTMLElement>(".case__section")
    );
    let revealed = 0;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !entry.target.hasAttribute("data-revealed")) {
            entry.target.setAttribute("data-revealed", "");
            observer.unobserve(entry.target);
            revealed += 1;
            if (revealed >= targets.length) observer.disconnect();
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -10% 0px" }
    );

    targets.forEach((t) => observer.observe(t));

    return () => observer.disconnect();
  }, []);

  return containerRef;
}
```

- [ ] **Step 2: Wire the hook in CaseStudy.tsx**

Open `src/components/CaseStudy.tsx`. At the top of the function body:

```tsx
import { useSectionReveal } from "@/hooks/useSectionReveal";

// inside CaseStudy component:
const containerRef = useSectionReveal<HTMLElement>();
```

Attach the ref to the outer `<article className="case">` element:

```tsx
<article ref={containerRef} className="case">
```

- [ ] **Step 3: Add reveal CSS inside CaseStudy.tsx inline style block**

In the `<style>{}` block, append:

```css
/* Section reveal on scroll — fires once via IntersectionObserver */
.case__section {
  opacity: 0;
  transform: translateY(8px);
  transition:
    opacity 280ms var(--ease),
    transform 280ms var(--ease);
}
.case__section[data-revealed] {
  opacity: 1;
  transform: none;
}
/* Stagger up to 5 sections; rest reveal without delay */
.case__section:nth-child(2) { transition-delay: 50ms; }
.case__section:nth-child(3) { transition-delay: 100ms; }
.case__section:nth-child(4) { transition-delay: 150ms; }
.case__section:nth-child(5) { transition-delay: 200ms; }

@media (prefers-reduced-motion: reduce) {
  .case__section,
  .case__section[data-revealed] {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
```

- [ ] **Step 4: Type check + visual verification**

Run: `npx tsc --noEmit`
Expected: exit code 0.

Load `/work/gyeol`. Scroll slowly. Each `§`-section fades in + slides up 8 px as it enters the viewport, 280 ms, with a 50 ms stagger on the first five. Remaining sections reveal immediately.

Simulate `prefers-reduced-motion: reduce`. All sections are visible from page load; no transitions.

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useSectionReveal.ts src/components/CaseStudy.tsx
git commit -m "feat(case-study): intersection-observer section reveal

- new src/hooks/useSectionReveal.ts hook attaches IntersectionObserver
  with threshold 0.1, rootMargin: 0px 0px -10% 0px
- sets data-revealed on each .case__section once per element, fires once
- CaseStudy attaches hook via containerRef on the outer <article>
- CSS: opacity 0 + 8px translateY → 0, 280ms var(--ease), 50ms stagger
  capped at 5 children
- reduced-motion: sections revealed instantly on mount, no observer"
```

---

**End of Chunk 2.** Phase 2 ships: 2 tasks, 2 commits, browser-native cross-route transitions + first-paint friction in case studies.

Pause for chunk 2 review before proceeding to Chunk 3.

---

## Chunk 3: Phase 3a — Colophon + shelf verticals

**Output of this chunk:** Two structural additions — a `/colophon` typographic manifesto page, and a `/shelf` rewrite that groups entries into named verticals (*Read / Watch / Keep / Visit*).

**Estimated:** ~1 day across 2 tasks.

---

### Task 10: Shelf verticals — data model + rendered grouping

**Files:**
- Modify: `src/constants/shelf.ts` (add `ShelfGroup` type + `group` field on each item, seed new items)
- Modify: `src/app/shelf/page.tsx` (render grouped by `ShelfGroup`, new titles)

- [ ] **Step 1: Extend ShelfItem type**

Open `src/constants/shelf.ts`. At the top, add the new type:

```ts
export type ShelfGroup = "READ" | "WATCH" | "KEEP" | "VISIT";
```

Update the `ShelfItem` interface:

```ts
export interface ShelfItem {
  id: string;
  kind: ShelfKind;
  group: ShelfGroup;        // NEW — required
  title: string;
  attribution?: string;
  year?: string;
  href?: string;
  note?: string;
}
```

- [ ] **Step 2: Assign existing items to READ group**

Every existing item in the `SHELF` array should get `group: "READ"` as a new field. Books go under READ because they're things to read; existing PORTFOLIO + ESSAY + ARCHIVE items are all things read online.

In each existing item, add `group: "READ",` near the `kind` field.

- [ ] **Step 3: Seed 2-3 items each for WATCH, KEEP, VISIT**

After the existing READ items, append new entries. Examples to adapt — user will replace with real curation later:

```ts
// ── WATCH ────────────────────────────────────────────────────────
{
  id: "w01",
  kind: "ESSAY",       // treat talks/films as essay-adjacent for now
  group: "WATCH",
  title: "Jasper Morrison — A Super Normal Conversation",
  attribution: "Vitra Design Museum",
  year: "2018",
  href: "https://www.youtube.com/results?search_query=jasper+morrison+super+normal",
  note: "Morrison in his own voice. The clearest primary source for what documentary equality means in practice.",
},
{
  id: "w02",
  kind: "ESSAY",
  group: "WATCH",
  title: "The Shape of the Invisible",
  attribution: "Kenya Hara · talks",
  year: "2015",
  note: "Hara's lecture format on emptiness — the precursor to Designing Design as a book.",
},

// ── KEEP ─────────────────────────────────────────────────────────
{
  id: "k01",
  kind: "ARCHIVE",
  group: "KEEP",
  title: "OP-1 Field",
  attribution: "Teenage Engineering",
  note: "The instrument as a catalog. Manual typography on a portable device.",
},
{
  id: "k02",
  kind: "ARCHIVE",
  group: "KEEP",
  title: "Butterfly Stool",
  attribution: "Sori Yanagi · Vitra",
  year: "1954",
  note: "Near my desk. A reminder that the best objects don't explain themselves.",
},

// ── VISIT ────────────────────────────────────────────────────────
{
  id: "v01",
  kind: "ARCHIVE",
  group: "VISIT",
  title: "MUJI 5th Avenue",
  attribution: "Manhattan",
  href: "https://www.muji.com/us/en/",
  note: "Not for the shopping — for the layout. A classroom on how to arrange a shelf.",
},
{
  id: "v02",
  kind: "ARCHIVE",
  group: "VISIT",
  title: "Strand Bookstore",
  attribution: "East Village",
  href: "https://www.strandbooks.com/",
  note: "Where most of the books under READ were found.",
},
```

- [ ] **Step 4: Update shelf/page.tsx GROUPS declaration**

Open `src/app/shelf/page.tsx`. Replace the existing `GROUPS` (which groups by `ShelfKind`) with groups by `ShelfGroup`:

```tsx
import { SHELF, type ShelfGroup } from "@/constants/shelf";

const GROUPS: Array<{ group: ShelfGroup; label: string }> = [
  { group: "READ",  label: "Read"  },
  { group: "WATCH", label: "Watch" },
  { group: "KEEP",  label: "Keep"  },
  { group: "VISIT", label: "Visit" },
];
```

- [ ] **Step 5: Update the filter logic**

In the render, update the section filter:

```tsx
{GROUPS.map((g) => {
  const items = SHELF.filter((s) => s.group === g.group);
  if (items.length === 0) return null;
  return (
    <section key={g.group} className="shelf__group">
      {/* existing inner markup unchanged */}
    </section>
  );
})}
```

Keep everything else in the render unchanged — the section header, the list, the rows, the footer all stay.

- [ ] **Step 6: Type check**

Run: `npx tsc --noEmit`
Expected: exit code 0. If type errors about missing `group` on existing items appear, go back to Step 2 and ensure every existing `SHELF` item has `group: "READ"`.

- [ ] **Step 7: Visual verification**

Load `/shelf` in the browser. Confirm:
- Four group sections visible: Read, Watch, Keep, Visit
- Each section has its own count (e.g. `04 Entries`)
- Under each, the rows render in shelf grammar (year · title · attribution · optional note)
- Existing READ items (books, portfolios, essays, archives) all appear under the Read section
- New items under Watch, Keep, Visit render with the seed content above

- [ ] **Step 8: Commit**

```bash
git add src/constants/shelf.ts src/app/shelf/page.tsx
git commit -m "feat(shelf): grouped masthead verticals — read / watch / keep / visit

- new ShelfGroup type: READ | WATCH | KEEP | VISIT
- every existing item grouped under READ (books/portfolios/essays/archives)
- seeded 2 items each under WATCH (talks), KEEP (objects), VISIT (NYC)
- /shelf/page.tsx renders by group instead of by kind
- visual grammar unchanged — single shelf row pattern per group"
```

---

### Task 11: `/colophon` — typographic manifesto page

**Files:**
- Create: `src/app/colophon/page.tsx`

- [ ] **Step 1: Scaffold the colophon page**

Create `src/app/colophon/page.tsx`. Compose exclusively from existing globals.css primitives — `.eyebrow`, `.plate-mark`, `.tabular` — and the shelf-style section headers. Use the same `max-width` as shelf (820px):

```tsx
"use client";

import Folio from "@/components/Folio";

const BUILD_SHA = process.env.NEXT_PUBLIC_BUILD_SHA ?? "dev";

export default function ColophonPage() {
  return (
    <main id="main" className="colophon">
      <Folio token="§06" />

      <article className="colophon__inner">
        <header className="colophon__head">
          <p className="eyebrow">
            <span>Colophon</span>
            <span className="eyebrow__sep">·</span>
            <span>Typographic notes</span>
            <span className="eyebrow__sep">·</span>
            <span className="tabular">2026</span>
          </p>
          <h1 className="colophon__title">How this site is set.</h1>
        </header>

        <section className="colophon__section">
          <header className="colophon__section-head">
            <span className="colophon__section-label">Typefaces</span>
            <span className="colophon__section-count tabular">02 Faces</span>
          </header>
          <dl className="colophon__list">
            <div className="colophon__row">
              <dt className="colophon__row-name">Fragment Mono</dt>
              <dd className="colophon__row-body">
                Weiredesign (Weir &amp; Tobias Frere-Jones after WFMU), 2019.
                Every visible surface except case-study body prose. The
                mono register is the whole site — nav, labels, ledgers,
                titles, captions.
              </dd>
            </div>
            <div className="colophon__row">
              <dt className="colophon__row-name">Gambetta</dt>
              <dd className="colophon__row-body">
                Hubert Jocham, Indestructible Type Co., 2021. Variable
                serif. Reserved strictly for long-form prose on
                <code> /work/[slug]</code> case studies. Long-form reading
                faces need to breathe; mono alone would fatigue.
              </dd>
            </div>
          </dl>
        </section>

        <section className="colophon__section">
          <header className="colophon__section-head">
            <span className="colophon__section-label">Grid</span>
            <span className="colophon__section-count tabular">Perfect Fourth</span>
          </header>
          <dl className="colophon__list">
            <div className="colophon__row">
              <dt className="colophon__row-name">Scale</dt>
              <dd className="colophon__row-body">
                9 px → 10 → 12 → 15 → 20 → 27 → 36 → 48 → 64 → 88.
                Modular ratio 1.333 (Perfect Fourth).
              </dd>
            </div>
            <div className="colophon__row">
              <dt className="colophon__row-name">Measure</dt>
              <dd className="colophon__row-body">
                <code>--measure-narrow: 48ch</code> ·
                <code> --measure-body: 62ch</code>. Long-form case-study
                prose holds to these.
              </dd>
            </div>
            <div className="colophon__row">
              <dt className="colophon__row-name">Palette</dt>
              <dd className="colophon__row-body">
                Paper <code>#FBFAF6</code> through Ink <code>#111110</code>,
                with four tonal tiers between. No accent. No second hue.
              </dd>
            </div>
          </dl>
        </section>

        <section className="colophon__section">
          <header className="colophon__section-head">
            <span className="colophon__section-label">Motion</span>
            <span className="colophon__section-count tabular">03 Curves</span>
          </header>
          <dl className="colophon__list">
            <div className="colophon__row">
              <dt className="colophon__row-name"><code>--ease</code></dt>
              <dd className="colophon__row-body">
                <code>cubic-bezier(.4,0,.2,1)</code> — standard ease for
                opacity fades, color transitions, default state changes.
              </dd>
            </div>
            <div className="colophon__row">
              <dt className="colophon__row-name">Ease-out-quart</dt>
              <dd className="colophon__row-body">
                <code>cubic-bezier(.22,1,.36,1)</code> — ease-out for
                reveals, the strip wheel-snap (920 ms), view-transition
                shared-element morph.
              </dd>
            </div>
            <div className="colophon__row">
              <dt className="colophon__row-name">Hover-slide</dt>
              <dd className="colophon__row-body">
                <code>cubic-bezier(.33,.12,.15,1)</code> — Vercel-lineage
                curve for the 6 px arrow slide on any <code>.arrow-glyph</code>.
              </dd>
            </div>
            <div className="colophon__row">
              <dt className="colophon__row-name">Windows</dt>
              <dd className="colophon__row-body">
                Every user-triggered motion sits in a 120–400 ms window.
                View transitions 300 ms. Wheel-snap 920 ms. No ambient
                motion anywhere on the site.
              </dd>
            </div>
          </dl>
        </section>

        <section className="colophon__section">
          <header className="colophon__section-head">
            <span className="colophon__section-label">Stack</span>
            <span className="colophon__section-count tabular">2026</span>
          </header>
          <dl className="colophon__list">
            <div className="colophon__row">
              <dt className="colophon__row-name">Framework</dt>
              <dd className="colophon__row-body">
                Next.js 16 App Router, React 19, TypeScript. Native
                View Transitions API for cross-route morphs — no animation
                library.
              </dd>
            </div>
            <div className="colophon__row">
              <dt className="colophon__row-name">Scroll</dt>
              <dd className="colophon__row-body">
                Native. No smooth-scroll library. Friction carried by
                deliberate 160–400 ms transitions and the wheel-snap carousel.
              </dd>
            </div>
            <div className="colophon__row">
              <dt className="colophon__row-name">Host</dt>
              <dd className="colophon__row-body">Vercel.</dd>
            </div>
          </dl>
        </section>

        <section className="colophon__section">
          <header className="colophon__section-head">
            <span className="colophon__section-label">Lineage</span>
            <span className="colophon__section-count tabular">05 Refs</span>
          </header>
          <dl className="colophon__list">
            <div className="colophon__row">
              <dt className="colophon__row-name">Kenya Hara</dt>
              <dd className="colophon__row-body">
                <em>Designing Design</em>. Emptiness as active material.
              </dd>
            </div>
            <div className="colophon__row">
              <dt className="colophon__row-name">Jasper Morrison &amp; Naoto Fukasawa</dt>
              <dd className="colophon__row-body">
                <em>Super Normal</em>. Documentary equality across the catalog.
              </dd>
            </div>
            <div className="colophon__row">
              <dt className="colophon__row-name">Dieter Rams</dt>
              <dd className="colophon__row-body">Less, but better.</dd>
            </div>
            <div className="colophon__row">
              <dt className="colophon__row-name">Rauno Freiberg</dt>
              <dd className="colophon__row-body">
                Craft in 40×40 px details.
              </dd>
            </div>
            <div className="colophon__row">
              <dt className="colophon__row-name">Cathy Dolle</dt>
              <dd className="colophon__row-body">
                The mirrored index mechanic this homepage inherits.
              </dd>
            </div>
          </dl>
        </section>

        <footer className="colophon__foot">
          <span>Hyeonjoon Jun</span>
          <span className="colophon__foot-dot" aria-hidden>·</span>
          <span>New York</span>
          <span className="colophon__foot-dot" aria-hidden>·</span>
          <span className="tabular">Build {BUILD_SHA}</span>
        </footer>
      </article>

      <style>{`
        .colophon {
          min-height: 100svh;
          padding: clamp(88px, 12vh, 128px) clamp(24px, 4vw, 72px) clamp(56px, 9vh, 96px);
          display: flex;
          justify-content: center;
          color: var(--ink);
        }
        .colophon__inner {
          width: 100%;
          max-width: 820px;
          display: grid;
          gap: clamp(48px, 7vh, 72px);
        }

        .colophon__head { display: grid; gap: 18px; }
        .colophon__title {
          font-family: var(--font-stack-mono);
          font-weight: 400;
          font-size: clamp(22px, 2.4vw, 30px);
          line-height: 1.35;
          letter-spacing: -0.005em;
          color: var(--ink);
          margin: 6px 0 0;
          max-width: 32ch;
        }

        .colophon__section { display: grid; gap: 12px; }
        .colophon__section-head {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          padding-bottom: 10px;
          border-bottom: 1px solid var(--ink);
        }
        .colophon__section-label {
          font-family: var(--font-stack-mono);
          font-size: 10px;
          letter-spacing: 0.26em;
          text-transform: uppercase;
          color: var(--ink);
        }
        .colophon__section-count {
          font-family: var(--font-stack-mono);
          font-size: 9px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--ink-3);
        }

        .colophon__list { margin: 0; display: grid; gap: 0; }
        .colophon__row {
          display: grid;
          grid-template-columns: 180px 1fr;
          gap: 20px;
          padding: 14px 0;
          border-bottom: 1px solid var(--ink-hair);
        }
        .colophon__row-name {
          font-family: var(--font-stack-mono);
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--ink-3);
          align-self: baseline;
        }
        .colophon__row-body {
          font-family: var(--font-stack-serif);
          font-size: 15px;
          line-height: 1.7;
          color: var(--ink-2);
          margin: 0;
          font-feature-settings: "onum" on;
        }
        .colophon__row-body code {
          font-family: var(--font-stack-mono);
          font-size: 12px;
          color: var(--ink-3);
          padding: 1px 4px;
          background: var(--ink-ghost);
          border-radius: 2px;
        }
        .colophon__row-body em {
          font-style: italic;
        }

        .colophon__foot {
          display: flex;
          align-items: baseline;
          gap: 10px;
          padding-top: 16px;
          border-top: 1px solid var(--ink-hair);
          font-family: var(--font-stack-mono);
          font-size: 9px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--ink-3);
        }
        .colophon__foot-dot { color: var(--ink-4); }

        @media (max-width: 640px) {
          .colophon__row {
            grid-template-columns: 1fr;
            gap: 4px;
          }
        }
      `}</style>
    </main>
  );
}
```

- [ ] **Step 2: Add NEXT_PUBLIC_BUILD_SHA env injection (optional but nice)**

For the `Build {BUILD_SHA}` footer to show the git short-SHA in production, set the env var at build time. On Vercel, set `NEXT_PUBLIC_BUILD_SHA=$VERCEL_GIT_COMMIT_SHA` in project settings. For local dev it falls back to `"dev"`. No code change needed beyond what's already in Step 1.

- [ ] **Step 3: Type check + route verification**

Run: `npx tsc --noEmit`
Expected: exit code 0.

Run the dev server. Load `/colophon`:
- Page loads; eyebrow, title, five sections visible (Typefaces, Grid, Motion, Stack, Lineage), footer signoff
- Folio visible top-right: `HKJ / §06 / 2026`
- Section headers match shelf grammar (label + count, 1 px border-bottom)
- Row content: name column 180 px mono, body column serif prose with `code` inlines
- No new hex values, no new fonts
- On <640 px, rows stack to single column

- [ ] **Step 4: Commit**

```bash
git add src/app/colophon/page.tsx
git commit -m "feat(colophon): typographic manifesto route

- new /colophon page with five sections: typefaces, grid, motion, stack, lineage
- composed from existing primitives (.eyebrow, .plate-mark, shelf-style
  section headers, hairline rules)
- name column: 180px mono 10px; body column: Gambetta serif 15px with
  mono <code> inlines
- Folio §06 at top-right
- optional NEXT_PUBLIC_BUILD_SHA env var populates build hash in footer"
```

---

**End of Chunk 3.** Phase 3a ships: 2 tasks, 2 commits, `/colophon` route live, `/shelf` grouped into four verticals.

Pause for chunk 3 review before proceeding to Chunk 4.

---

## Chunk 4: Phase 3b — Notes + command palette

**Output of this chunk:** `/notes` is live as a dated numbered stream with index + detail routes. A `⌘K` command palette lets users jump to any route or action. A tiny `⌘K` microtype hint in the site footer announces the palette exists.

**Estimated:** ~1.5 days across 3 tasks.

---

### Task 12: Notes data model + index page + detail page

**Files:**
- Create: `src/constants/notes.ts`
- Create: `src/app/notes/page.tsx`
- Create: `src/app/notes/[slug]/page.tsx`

- [ ] **Step 1: Create the notes data file**

Create `src/constants/notes.ts`:

```ts
export interface Note {
  slug: string;      // "n-001"
  number: string;    // "001"
  date: string;      // "2026-04-22" (ISO for sorting)
  dateLabel: string; // "2026.04.22" (display)
  month: string;     // "04" (for Folio month segment)
  title: string;
  excerpt: string;   // visible on /notes
  body: string;      // plain prose (paragraphs separated by \n\n)
  tags?: string[];
}

/**
 * Notes — weekly / monthly short-form. Numbered from N-001.
 * Visible gaps in the numbering (e.g. missing N-002) read as editorial
 * honesty (Roden pattern). Published entries only; drafts live elsewhere.
 */
export const NOTES: Note[] = [
  {
    slug: "n-001",
    number: "001",
    date: "2026-04-22",
    dateLabel: "2026.04.22",
    month: "04",
    title: "On restraint as the hardest move",
    excerpt:
      "Notes from the last two weeks building out the portfolio's taste polish — why removing ambient motion was the single biggest quality upgrade.",
    body:
      "The harder lesson of the last two weeks: every time I added something tasteful, the site got worse.\n\n" +
      "I tried five different ambient ASCII directions. Flowers swaying. A drifting marquee. A morphing corner stamp. A density-mapped landscape. A field of dots at every opacity from 7% to 32%. None of them stayed.\n\n" +
      "The thing that finally worked was cutting them all. The site reads more like a studio catalog now and less like a portfolio template. Morrison's lesson about documentary equality — treat every object the same — applies to motion too. The absence of ambient motion is itself the restraint.",
    tags: ["process", "restraint"],
  },
];
```

This seeds one note. Additional entries are added by editing this file.

- [ ] **Step 2: Create the notes index page**

Create `src/app/notes/page.tsx`. Group entries by month-year for the header rhythm. Use shelf patterns:

```tsx
"use client";

import Link from "next/link";
import Folio from "@/components/Folio";
import { NOTES } from "@/constants/notes";

function groupByMonth(notes: typeof NOTES) {
  const groups: Record<string, typeof NOTES> = {};
  for (const n of notes) {
    const key = n.date.slice(0, 7); // "2026-04"
    (groups[key] ??= []).push(n);
  }
  return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]));
}

function formatMonthHeader(ym: string) {
  const [y, m] = ym.split("-");
  const date = new Date(Number(y), Number(m) - 1, 1);
  return date.toLocaleString("en-US", { month: "long", year: "numeric" });
}

export default function NotesIndexPage() {
  const sorted = [...NOTES].sort((a, b) => b.date.localeCompare(a.date));
  const grouped = groupByMonth(sorted);

  return (
    <main id="main" className="notes">
      <Folio token="§05" />

      <article className="notes__inner">
        <header className="notes__head">
          <p className="eyebrow">
            <span>Notes</span>
            <span className="eyebrow__sep">·</span>
            <span>Working out loud</span>
            <span className="eyebrow__sep">·</span>
            <span className="tabular">2026</span>
          </p>
          <h1 className="notes__title">Short entries, dated.</h1>
        </header>

        {grouped.map(([ym, items]) => (
          <section key={ym} className="notes__group">
            <header className="notes__group-head">
              <span className="notes__group-label">{formatMonthHeader(ym)}</span>
              <span className="notes__group-count tabular">
                {String(items.length).padStart(2, "0")} Entries
              </span>
            </header>

            <ol className="notes__list">
              {items.map((n) => (
                <li key={n.slug} className="notes__row">
                  <Link href={`/notes/${n.slug}`} className="notes__row-link">
                    <span className="notes__row-num tabular">N-{n.number}</span>
                    <span className="notes__row-date tabular">{n.dateLabel}</span>
                    <span className="notes__row-title">{n.title}</span>
                    <span className="notes__row-arrow arrow-glyph" aria-hidden>→</span>
                  </Link>
                </li>
              ))}
            </ol>
          </section>
        ))}

        <footer className="notes__foot">
          <span>Numbered from N-001.</span>
          <span className="notes__foot-dot" aria-hidden>·</span>
          <span className="tabular">Visible gaps are draft issues.</span>
        </footer>
      </article>

      <style>{`
        .notes {
          min-height: 100svh;
          padding: clamp(88px, 12vh, 128px) clamp(24px, 4vw, 72px) clamp(56px, 9vh, 96px);
          display: flex;
          justify-content: center;
          color: var(--ink);
        }
        .notes__inner {
          width: 100%;
          max-width: 820px;
          display: grid;
          gap: clamp(48px, 7vh, 72px);
        }

        .notes__head { display: grid; gap: 18px; }
        .notes__title {
          font-family: var(--font-stack-mono);
          font-weight: 400;
          font-size: clamp(22px, 2.4vw, 30px);
          line-height: 1.35;
          letter-spacing: -0.005em;
          color: var(--ink);
          margin: 6px 0 0;
          max-width: 32ch;
        }

        .notes__group { display: grid; gap: 12px; }
        .notes__group-head {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          padding-bottom: 10px;
          border-bottom: 1px solid var(--ink);
        }
        .notes__group-label {
          font-family: var(--font-stack-mono);
          font-size: 10px;
          letter-spacing: 0.26em;
          text-transform: uppercase;
          color: var(--ink);
        }
        .notes__group-count {
          font-family: var(--font-stack-mono);
          font-size: 9px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--ink-3);
        }

        .notes__list { list-style: none; margin: 0; padding: 0; }
        .notes__row { border-bottom: 1px solid var(--ink-hair); }
        .notes__row-link {
          display: grid;
          grid-template-columns: 64px 110px 1fr 22px;
          gap: 20px;
          align-items: baseline;
          padding: 14px 0;
          color: var(--ink);
          transition: background 200ms var(--ease);
        }
        .notes__row-link:hover { background: var(--ink-ghost); }
        .notes__row-num {
          font-family: var(--font-stack-mono);
          font-size: 9px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--ink-4);
        }
        .notes__row-date {
          font-family: var(--font-stack-mono);
          font-size: 10px;
          letter-spacing: 0.14em;
          color: var(--ink-3);
        }
        .notes__row-title {
          font-family: var(--font-stack-mono);
          font-size: 13px;
          letter-spacing: 0;
          color: var(--ink);
        }
        .notes__row-arrow {
          font-family: var(--font-stack-mono);
          font-size: 12px;
          color: var(--ink-3);
          text-align: right;
        }

        .notes__foot {
          display: flex;
          align-items: baseline;
          gap: 10px;
          padding-top: 16px;
          border-top: 1px solid var(--ink-hair);
          font-family: var(--font-stack-mono);
          font-size: 9px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--ink-3);
        }
        .notes__foot-dot { color: var(--ink-4); }

        @media (max-width: 640px) {
          .notes__row-link {
            grid-template-columns: 56px 1fr 18px;
            gap: 12px 14px;
          }
          .notes__row-date { display: none; }
        }
      `}</style>
    </main>
  );
}
```

- [ ] **Step 3: Create the notes detail page**

Create `src/app/notes/[slug]/page.tsx`:

```tsx
"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import Folio from "@/components/Folio";
import { NOTES } from "@/constants/notes";

export default function NoteDetailPage() {
  const params = useParams<{ slug: string }>();
  const note = NOTES.find((n) => n.slug === params?.slug);

  if (!note) {
    return (
      <main id="main" className="note-404">
        <p className="eyebrow">
          <span>Notes</span>
          <span className="eyebrow__sep">·</span>
          <span>Not found</span>
        </p>
        <p className="note-404__body">
          No entry at that address.{" "}
          <Link href="/notes" className="note-404__link">
            Back to the index
          </Link>
          .
        </p>
        <style>{`
          .note-404 {
            min-height: 100svh;
            padding: clamp(96px, 14vh, 160px) clamp(24px, 6vw, 72px);
            display: grid;
            gap: 20px;
            place-content: center;
          }
          .note-404__body {
            font-family: var(--font-stack-serif);
            font-weight: 380;
            font-size: 17px;
            line-height: 1.6;
            color: var(--ink-2);
            max-width: 40ch;
          }
          .note-404__link { color: var(--ink); }
        `}</style>
      </main>
    );
  }

  const paragraphs = note.body.split("\n\n");

  return (
    <main id="main" className="note">
      <Folio token={`N-${note.number}`} month={note.month} />

      <div className="note__runhead" aria-hidden>
        <span>N-{note.number}</span>
        <span className="note__runhead-dot">·</span>
        <span>{note.title}</span>
      </div>

      <article className="note__inner">
        <header className="note__head">
          <p className="eyebrow">
            <span>Note</span>
            <span className="eyebrow__sep">·</span>
            <span className="tabular">N-{note.number}</span>
            <span className="eyebrow__sep">·</span>
            <span className="tabular">{note.dateLabel}</span>
          </p>
          <h1 className="note__title">{note.title}</h1>
        </header>

        <section className="note__body">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </section>

        <footer className="note__foot">
          <Link href="/notes" className="note__back arrow-glyph-host">
            <span className="arrow-glyph" aria-hidden>←</span>
            <span>All notes</span>
          </Link>
        </footer>
      </article>

      <style>{`
        .note {
          min-height: 100svh;
          padding: clamp(88px, 12vh, 128px) clamp(24px, 4vw, 72px) clamp(56px, 9vh, 96px);
          display: flex;
          justify-content: center;
          color: var(--ink);
        }
        .note__inner {
          width: 100%;
          max-width: 640px;
          display: grid;
          gap: clamp(40px, 6vh, 64px);
        }

        /* Sticky running head — tiny mono band above content on scroll */
        .note__runhead {
          position: sticky;
          top: 56px;
          z-index: 45;
          display: flex;
          gap: 10px;
          padding: 8px 0;
          font-family: var(--font-stack-mono);
          font-size: 9px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--ink-3);
          background: linear-gradient(to bottom, var(--paper) 60%, transparent 100%);
          backdrop-filter: none;
          align-self: center;
          max-width: 640px;
          width: 100%;
          padding-inline: clamp(24px, 4vw, 72px);
          margin-left: calc(50% - 50vw);
          box-sizing: border-box;
          /* sit above article scroll */
          pointer-events: none;
        }
        .note__runhead-dot { color: var(--ink-4); }

        .note__head { display: grid; gap: 18px; }
        .note__title {
          font-family: var(--font-stack-serif);
          font-weight: 400;
          font-size: clamp(24px, 2.6vw, 32px);
          line-height: 1.3;
          letter-spacing: -0.005em;
          color: var(--ink);
          margin: 6px 0 0;
          max-width: 32ch;
          font-feature-settings: "onum" on;
        }

        .note__body {
          display: grid;
          gap: 1.4em;
          font-family: var(--font-stack-serif);
          font-size: 17px;
          line-height: 1.75;
          color: var(--ink-2);
          font-feature-settings: "onum" on;
          hanging-punctuation: first last;
          text-wrap: pretty;
        }
        .note__body p { margin: 0; max-width: 56ch; }

        .note__foot {
          padding-top: 24px;
          border-top: 1px solid var(--ink-hair);
        }
        .note__back {
          display: inline-flex;
          align-items: baseline;
          gap: 10px;
          font-family: var(--font-stack-mono);
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--ink-3);
        }
        /* Reverse the arrow-glyph direction: back-arrow slides left on hover.
           Higher specificity than *:hover > .arrow-glyph from globals.css. */
        .note__back:hover > .arrow-glyph,
        .note__back:focus-visible > .arrow-glyph {
          transform: translateX(-6px);
        }
      `}</style>
    </main>
  );
}
```

- [ ] **Step 4: Type check + visual verification**

Run: `npx tsc --noEmit`
Expected: exit code 0.

Load `/notes`:
- Eyebrow + title visible
- One section header "April 2026" + count "01 Entries"
- One row: `N-001 · 2026.04.22 · On restraint as the hardest move · →`
- Hover → faint ghost background + arrow slide 6 px right

Click → `/notes/n-001`:
- Folio top-right shows `HKJ / N-001 / 2026.04`
- Sticky running head band shows `N-001 · On restraint as the hardest move` as you scroll
- Body prose in Gambetta serif, `onum`, `hanging-punctuation`
- `← All notes` link at the bottom; arrow slides left on hover

- [ ] **Step 5: Commit**

```bash
git add src/constants/notes.ts src/app/notes/page.tsx src/app/notes/[slug]/page.tsx
git commit -m "feat(notes): dated numbered stream — index + detail routes

- new src/constants/notes.ts with Note type and NOTES array (seeded with
  N-001)
- /notes index: month-grouped list, shelf-style grammar, N-NNN · date ·
  title · arrow-glyph rows
- /notes/[slug] detail: eyebrow + serif h1 + Gambetta body prose with
  onum + hanging-punctuation; sticky running head band on scroll
- Folio per route: §05 on index, N-NNN with month on detail
- 404 fallback for missing slug
- reverse arrow-glyph on '← All notes' back-link"
```

---

### Task 13: Install cmdk + vaul and build CommandPalette

**Files:**
- Modify: `package.json` (install cmdk + vaul)
- Create: `src/components/CommandPalette.tsx`
- Modify: `src/app/layout.tsx` (mount CommandPalette)

- [ ] **Step 1: Install dependencies**

Run:
```bash
npm install cmdk vaul
```

Expected: both packages install cleanly. Package.json has new entries under `dependencies`.

- [ ] **Step 2: Create CommandPalette component**

Create `src/components/CommandPalette.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { CONTACT_EMAIL, NETWORKS } from "@/constants/contact";
import { PIECES } from "@/constants/pieces";
import { NOTES } from "@/constants/notes";

/**
 * CommandPalette — ⌘K / ⌃K / "/" to open. Custom theme using the site's
 * existing design tokens only. No icons, no color accents. Groups:
 *   - Work      (per piece)
 *   - Writing   (notes index + recent entries)
 *   - Browse    (About, Shelf, Colophon, Contact)
 *   - Actions   (copy email, external handles)
 */
export default function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "/" && !(e.target instanceof HTMLInputElement) &&
          !(e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const go = (path: string) => {
    setOpen(false);
    router.push(path);
  };

  const openExternal = (href: string) => {
    setOpen(false);
    window.open(href, "_blank", "noopener,noreferrer");
  };

  const copyEmail = async () => {
    setOpen(false);
    try {
      await navigator.clipboard?.writeText(CONTACT_EMAIL);
    } catch {
      window.location.href = `mailto:${CONTACT_EMAIL}`;
    }
  };

  if (!open) return null;

  return (
    <div className="palette" aria-hidden={!open}>
      <div className="palette__overlay" onClick={() => setOpen(false)} />
      <Command label="Site navigation" className="palette__root">
        <Command.Input
          placeholder="Type to filter — Work, Writing, Browse, Actions"
          autoFocus
        />
        <Command.List>
          <Command.Empty>No results.</Command.Empty>

          <Command.Group heading="Work">
            {PIECES.map((p) => (
              <Command.Item
                key={p.slug}
                onSelect={() => go(`/work/${p.slug}`)}
                value={`work ${p.title} ${p.sector}`}
              >
                <span>{p.title.replace(/:\s*[一-鿿가-힯]+/, "")}</span>
                <span className="palette__hint">{p.sector}</span>
              </Command.Item>
            ))}
          </Command.Group>

          {NOTES.length > 0 && (
            <Command.Group heading="Writing">
              <Command.Item onSelect={() => go("/notes")} value="notes all">
                <span>All notes</span>
                <span className="palette__hint">/notes</span>
              </Command.Item>
              {NOTES.slice(0, 3).map((n) => (
                <Command.Item
                  key={n.slug}
                  onSelect={() => go(`/notes/${n.slug}`)}
                  value={`note ${n.title} ${n.number}`}
                >
                  <span>{n.title}</span>
                  <span className="palette__hint">N-{n.number}</span>
                </Command.Item>
              ))}
            </Command.Group>
          )}

          <Command.Group heading="Browse">
            <Command.Item onSelect={() => go("/about")} value="about">
              <span>About</span>
              <span className="palette__hint">/about</span>
            </Command.Item>
            <Command.Item onSelect={() => go("/shelf")} value="shelf">
              <span>Shelf</span>
              <span className="palette__hint">/shelf</span>
            </Command.Item>
            <Command.Item onSelect={() => go("/colophon")} value="colophon">
              <span>Colophon</span>
              <span className="palette__hint">/colophon</span>
            </Command.Item>
            <Command.Item onSelect={() => go("/contact")} value="contact">
              <span>Contact</span>
              <span className="palette__hint">/contact</span>
            </Command.Item>
          </Command.Group>

          <Command.Group heading="Actions">
            <Command.Item onSelect={copyEmail} value="copy email">
              <span>Copy email</span>
              <span className="palette__hint">{CONTACT_EMAIL}</span>
            </Command.Item>
            {NETWORKS.map((n) => (
              <Command.Item
                key={n.label}
                onSelect={() => openExternal(n.href)}
                value={`open ${n.label} ${n.handle}`}
              >
                <span>Open {n.label}</span>
                <span className="palette__hint">{n.handle}</span>
              </Command.Item>
            ))}
          </Command.Group>
        </Command.List>
      </Command>

      <style>{`
        .palette {
          position: fixed;
          inset: 0;
          z-index: 100;
          display: grid;
          place-items: start center;
          padding-top: 18vh;
        }
        .palette__overlay {
          position: absolute;
          inset: 0;
          background: rgba(17, 17, 16, 0.18);
          animation: palette-overlay-in 150ms var(--ease) both;
        }

        [cmdk-root].palette__root {
          position: relative;
          z-index: 1;
          background: var(--paper);
          border: 1px solid var(--ink-hair);
          width: 540px;
          max-width: calc(100vw - 48px);
          box-shadow: 0 18px 40px rgba(17, 17, 16, 0.08);
          animation: palette-in 150ms var(--ease) both;
          font-family: var(--font-stack-mono);
        }

        [cmdk-input] {
          font-family: var(--font-stack-mono);
          font-size: 14px;
          letter-spacing: 0.02em;
          padding: 16px;
          background: transparent;
          border: none;
          border-bottom: 1px solid var(--ink-hair);
          color: var(--ink);
          width: 100%;
          outline: none;
        }
        [cmdk-input]::placeholder {
          color: var(--ink-4);
          text-transform: none;
          letter-spacing: 0;
        }

        [cmdk-list] {
          max-height: 60vh;
          overflow-y: auto;
          padding: 8px 0 12px;
        }

        [cmdk-group-heading] {
          font-family: var(--font-stack-mono);
          font-size: 9px;
          letter-spacing: 0.26em;
          text-transform: uppercase;
          color: var(--ink-4);
          padding: 14px 16px 6px;
        }

        [cmdk-item] {
          font-family: var(--font-stack-mono);
          font-size: 11px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--ink-3);
          padding: 10px 16px;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 16px;
          cursor: pointer;
        }
        [cmdk-item][data-selected="true"] {
          background: var(--ink-ghost);
          color: var(--ink);
        }
        .palette__hint {
          color: var(--ink-4);
          font-size: 9px;
          letter-spacing: 0.18em;
          text-transform: lowercase;
        }

        [cmdk-empty] {
          padding: 24px 16px;
          font-family: var(--font-stack-mono);
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--ink-4);
        }

        @keyframes palette-in {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: none; }
        }
        @keyframes palette-overlay-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        @media (prefers-reduced-motion: reduce) {
          [cmdk-root].palette__root,
          .palette__overlay {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
```

Vaul (mobile drawer) is intentionally not wired in this task — the palette works on mobile as a centered dialog. If drawer behavior becomes desired, wrap `Command` in a `Drawer.Root` / `Drawer.Portal` / `Drawer.Content` from vaul. Out of scope for this task.

- [ ] **Step 3: Mount CommandPalette in layout.tsx**

Open `src/app/layout.tsx`. Import CommandPalette and add inside the `<body>`:

```tsx
import CommandPalette from "@/components/CommandPalette";

// inside <body>:
<CommandPalette />
```

- [ ] **Step 4: Type check + full interaction test**

Run: `npx tsc --noEmit`
Expected: exit code 0.

Load any route. Press `⌘K` (Mac) or `⌃K` (Windows):
- Palette opens with a 150 ms fade + 4 px translate
- Input has focus, placeholder reads "Type to filter — Work, Writing, Browse, Actions"
- Type "gy" → filters to `GYEOL`
- Arrow down/up navigates; Enter routes to `/work/gyeol`
- Escape closes
- Click outside also closes

Select an Actions item:
- "Copy email" → writes to clipboard, palette closes
- "Open LinkedIn" → opens in new tab, palette closes

On reduced-motion: palette opens instantly, no translate.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json src/components/CommandPalette.tsx src/app/layout.tsx
git commit -m "feat(palette): command palette via cmdk — keyboard-first navigation

- installs cmdk + vaul (vaul staged for future mobile drawer wrap)
- new CommandPalette component: ⌘K / ⌃K / \"/\" to open, Escape to close
- four groups: Work, Writing, Browse, Actions
- text-only, mono throughout, single paper background, no icons/colors
- custom theme for every cmdk primitive (library ships unstyled)
- 150ms opacity + 4px translate entrance, overlay 150ms
- reduced-motion: animations disabled, palette instant"
```

---

### Task 14: `⌘K` footer hint + final polish

**Files:**
- Modify: `src/app/page.tsx` (home footer gets `⌘K` hint)
- Modify: `src/app/about/page.tsx` (optional — the hint could live site-wide)

For discoverability, add a tiny `⌘K` microtype hint to the home footer. One glyph, one key, no explanation. Visitors either recognize the convention or discover by keystroke.

- [ ] **Step 1: Add ⌘K hint to home footer**

Open `src/app/page.tsx`. Locate the `.cd__foot` block in the rendered JSX. Add a new span between the existing children:

```tsx
<footer className="cd__foot">
  <CopyEmailLink className="cd__mail" />
  <span className="cd__foot-role">design engineer</span>
  <span className="cd__loc tabular">2026, new york</span>
  <kbd className="cd__kbd" aria-label="Press Command K to open command palette">⌘K</kbd>
</footer>
```

- [ ] **Step 2: Style the kbd**

In the home page inline `<style>` block, append:

```css
.cd__kbd {
  font-family: var(--font-stack-mono);
  font-size: 9px;
  letter-spacing: 0.24em;
  color: var(--ink-4);
  padding: 0;
  background: transparent;
  border: none;
  justify-self: end;
  grid-column: 4;
}

@media (max-width: 640px) {
  .cd__kbd { display: none; }
}
```

Update the footer grid to accommodate the 4th column:

```css
.cd__foot {
  display: grid;
  grid-template-columns: 1fr auto 1fr auto;   /* was 1fr auto 1fr */
  /* ... other declarations unchanged ... */
}
```

- [ ] **Step 3: Type check + verification**

Run: `npx tsc --noEmit`
Expected: exit code 0.

Load `/`. The footer now shows four items left-to-right:
- `rykjun@gmail.com` (left, underlined)
- `design engineer` (center-left)
- `2026, new york` (center-right)
- `⌘K` (right, ink-4 microtype)

Click `⌘K` (actually press the shortcut) → palette opens. The visual hint + the shortcut now agree.

On <640 px, `⌘K` hint is hidden; palette still works via keyboard.

- [ ] **Step 4: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat(home): ⌘K footer hint for palette discoverability

- tiny 9px mono ink-4 kbd element in the home footer
- grid extended from 3 to 4 columns (email / role / loc / shortcut)
- hidden under 640px (palette still triggerable via keyboard)
- one glyph, one key, no legend — discovery by recognition or keystroke"
```

---

**End of Chunk 4.** Phase 3b ships: 3 tasks, 3 commits. `/notes` live with index + detail, CommandPalette mounted site-wide, `⌘K` hint visible on home.

---

## Final Verification (all chunks shipped)

Run the full spec verification checklist. Each item should pass.

- [ ] **V1: Type check clean**

Run: `npx tsc --noEmit`
Expected: exit code 0.

- [ ] **V2: All routes return 200**

Run the dev server. Check each:
```bash
for r in / /about /shelf /contact /colophon /notes /notes/n-001 /work/gyeol /work/sift /work/pane /work/clouds-at-sea; do
  curl -s -o /dev/null -w "%{http_code} $r\n" http://localhost:3000$r
done
```
Expected: all 200.

- [ ] **V3: Folio on every route**

Visit each route; folio visible top-right with correct token.

- [ ] **V4: Hover vocabulary unified**

Hover an email link and a shelf external link. Both underline-color fade (180 ms); neither shows a stacked border.

- [ ] **V5: Nav hide on scroll**

On `/about`, `/shelf`, scroll down: nav hides. Scroll up: nav reveals. On `/`: nav never moves.

- [ ] **V6: Lenis gone**

Check `package.json` — no `lenis` entry. Check `src/components/` — no `SmoothScroll.tsx`. Trackpad scroll feels native.

- [ ] **V7: View transitions fire**

Navigate `/` → `/work/gyeol` by clicking the Gyeol row. Root crossfade 300 ms + title morph 420 ms (Chromium). Safari 17 or Firefox without flag → instant.

- [ ] **V8: Case-study section reveal**

`/work/gyeol` scroll slowly. Sections fade + 8 px up-translate with 50 ms stagger on first 5.

- [ ] **V9: Shelf verticals**

`/shelf` has four named sections: Read, Watch, Keep, Visit. Each with counts. Rows render in shelf grammar.

- [ ] **V10: Colophon renders**

`/colophon` has five sections: Typefaces, Grid, Motion, Stack, Lineage. Footer signature. Folio §06. Gambetta body prose with mono `<code>` inlines.

- [ ] **V11: Notes works**

`/notes` index + `/notes/n-001` detail. Running head sticky on scroll. Folio `N-001 / 2026.04` on detail.

- [ ] **V12: Command palette works**

`⌘K` anywhere opens palette. Arrow keys navigate. Enter routes. Copy-email action copies to clipboard. Escape closes.

- [ ] **V13: Reduced-motion degrades gracefully**

Simulate via DevTools. View transitions instant, section reveal instant, palette instant, nav never hides.

- [ ] **V14: No new tokens / hexes / easing curves**

Scope hex checks to `globals.css` only — Task 11's `/colophon` page
intentionally renders descriptive hex values (`#FBFAF6`, `#111110`) inside
JSX as documentation of the existing palette; those are documentation
content, not token definitions.

```bash
# Check globals.css only — any new hex declarations or custom properties
git diff --unified=0 a1142d6..HEAD -- src/app/globals.css | grep -E "^\+[^+]" | grep -E "#[0-9a-fA-F]{3,6}|\s--[a-z][a-z0-9-]+:" | grep -v "#FBFAF6\|#F4F3EE\|#E8E7E1\|#111110\|#55554F\|#8E8E87\|#BFBEB8\|--paper\|--ink\|--font-\|--ease\|--measure-\|--t-"
```
Expected: no output (all additions reuse existing tokens).

```bash
git diff a1142d6..HEAD -- src/ | grep "cubic-bezier(" | grep -vE "cubic-bezier\(\.4,0,\.2,1\)|cubic-bezier\(0\.22,1,0\.36,1\)|cubic-bezier\(0\.33,0\.12,0\.15,1\)|cubic-bezier\(0\.41,0\.1,0\.13,1\)"
```
Expected: no output (all easings reuse existing catalog + the two newly-approved spec curves for view transitions).

- [ ] **V15: All tasks committed, history clean**

```bash
git log --oneline a1142d6..HEAD
```
Expected: 13–15 commits across the four chunks, each with a meaningful scoped message.

---

## Post-implementation TODO

These are explicitly out of scope for this plan but flagged for future passes:

- Rewrite Gyeol + Sift case-study prose in the new voice (TASKS.md content backlog)
- Typography-specimen page for Fragment Mono itself (nicewebtype tier)
- `/press` / `/exhibitions` page if institutional recognition accumulates
- Additional `NOTES` entries (ongoing practice, not spec work)
- Vaul mobile drawer wrap for CommandPalette if drawer behavior becomes desired
