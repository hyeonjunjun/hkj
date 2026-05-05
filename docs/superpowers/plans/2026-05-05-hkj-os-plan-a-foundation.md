# HKJ_OS — Plan A: Foundation + Classic Split Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a non-interactive desktop foundation — cloudscape wallpaper + dock visible, existing `Frame` chrome preserved as the menu-bar role — with mobile/touch devices redirected to `/classic` which preserves the current simplified hello-stake home.

**Architecture:** Layer OS chrome onto the current `Frame`-based site rather than replacing it. The `Frame` component already provides TL identity, TR nav, BR action slot, BL ma. We add: a `<CloudscapeWallpaper>` (fixed position, z-index behind Frame), a `<Dock>` (left-vertical, fixed, app glyphs as launchers — no functional clicks yet), and a `/classic` route that preserves the existing simple page for mobile. The desktop "ships" non-interactive — visual register lands; window machinery comes in Plan B.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript strict, Geist Sans + Geist Mono + Newsreader (existing), Tailwind v4, vanilla CSS via `<style>` JSX (existing pattern), edge middleware for mobile UA redirect.

**Spec:** [docs/superpowers/specs/2026-05-05-hkj-os-design.md](../specs/2026-05-05-hkj-os-design.md). This plan implements **Phase 1 only**. Plans B and C cover Phases 2–6.

**Important rebase note.** The spec assumes a clean-slate Phase 1 that builds Desktop + MenuBar + Dock. The codebase has shifted: a `Frame` component exists already and plays the menu-bar role (TL, TR, BR, BL fixed-position chrome). This plan adapts: Frame is preserved; we add cloudscape and dock as additional layered chrome. The visual outcome matches the spec; the structural decomposition differs.

**Verification posture:** Per task: `npx tsc --noEmit` + `npm run lint` + `npm run build` + smoke check via `curl localhost:3000`. Existing 11 tests (5 useTheme + 6 ScrambleText) carry forward; no new tests in Plan A — windows ship in Plan B and that's where the testable logic lives.

---

## File Structure

### Files to create

| Path | Responsibility |
|---|---|
| `src/components/os/CloudscapeWallpaper.tsx` | Fixed-position image element behind all content. Renders the placeholder JPEG; theme-responsive overlay. |
| `src/components/os/Dock.tsx` | Left-vertical fixed-position dock with 4 app glyphs (◇ FINDER · ✎ NOTES · ◑ SHELF · ⊕ ABOUT). Click handlers are no-op for Plan A. |
| `public/assets/cloudscape-placeholder.jpg` | ~50KB low-res cloudscape JPEG, single asset until Plan C swaps in real footage. |
| `src/app/classic/page.tsx` | Mobile-fallback home — preserves the current hello-stake page content (Ryan Jun statement + featured plates). |
| `src/app/classic/layout.tsx` | Optional minimal layout for `/classic` — inherits root layout but may suppress the Dock (mobile doesn't get OS chrome). |
| `middleware.ts` (project root) | Edge middleware: mobile UA → rewrite `/` to `/classic`. iPad UA explicitly handled. |

### Files to modify

| Path | Change |
|---|---|
| `src/app/layout.tsx` | Mount `<CloudscapeWallpaper>` (after `<PaperGrain>`, before `<Frame>`) and `<Dock>` (after `<Frame>`). Both render only when path is `/` (use a small client wrapper or always render — see Task 4). |
| `src/app/page.tsx` | Restructure as a thin "desktop body" — drops the existing hello-stake content (which moves to `/classic`). Plan A leaves the body empty; Plan B fills it with windows. |
| `src/components/os/__tests__/` | Empty directory; no tests in Plan A. Set up only if needed by Plan B. |

### Files to verify untouched (existing patterns we depend on)

- `src/components/Frame.tsx` — the persistent chrome. **Do not modify.** Reads pathname; renders TL/TR/BR. Plan A layers around it, doesn't change it.
- `src/components/PaperGrain.tsx`, `src/components/RouteAnnouncer.tsx`, `src/components/ThemeInit.tsx` — kept, mounted in layout, no changes.
- `src/components/CaseStudy.tsx`, `src/components/WorkPlate.tsx`, `src/components/ScrambleText.tsx`, `src/components/CopyEmailLink.tsx` — kept; used by classic fallback page.
- `src/hooks/useTheme.ts`, `src/hooks/useReducedMotion.ts`, `src/hooks/useSectionReveal.ts` — carry forward.
- `src/app/globals.css` — token system unchanged. No new tokens.
- `src/constants/pieces.ts` — content unchanged.

---

## Chunk 0: Asset + setup

### Task 0.1: Acquire placeholder cloudscape JPEG

**Files:**
- Create: `public/assets/cloudscape-placeholder.jpg`

- [ ] **Step 1: Source a low-resolution cloudscape image**

The placeholder ships with Plan A so the desktop renders deterministically before Plan C's real footage lands. Requirements:
- Single static JPEG, ~50–100KB
- 1920×1080 minimum dimensions (downscaled is fine — it'll be `object-fit: cover` clipped)
- Subject: cloudscape similar to the user's reference image (cumulus, dramatic horizon, warm light)
- License: CC0 / public domain / user-supplied

**Sources:**
- [Unsplash](https://unsplash.com/s/photos/cloudscape) — search "cloudscape" / "cumulus" / "sky horizon" — most images are CC0
- [Pexels](https://www.pexels.com/search/cloudscape/) — same license
- User-supplied: if the user has a personal photograph they want as the placeholder, drop it in `public/assets/cloudscape-placeholder.jpg`

Recommended (if no preference): grab a CC0 cumulus/horizon image from Unsplash that matches the warm-tone aesthetic. ~50KB after running through `cwebp -q 75` or `mozjpeg`.

- [ ] **Step 2: Place + verify**

```bash
mkdir -p public/assets
# ...drop the JPEG in...
ls -la public/assets/cloudscape-placeholder.jpg
```

File size should be < 200KB. Visually confirm it matches the warm-cloud aesthetic in your image viewer.

- [ ] **Step 3: Stage + commit**

```bash
git add public/assets/cloudscape-placeholder.jpg
git commit -m "chore(assets): add placeholder cloudscape JPEG

Plan A foundation. Single static asset behind <CloudscapeWallpaper>
until Plan C swaps in real long-exposure .webm footage. License:
CC0 / user-supplied."
```

### Task 0.2: Confirm baseline gates clean

**Files:** none modified

- [ ] **Step 1: Run gates**

```bash
npx tsc --noEmit
npm run lint
npm run test
npm run build
```

Expected: all clean. Test count should be 11 (5 useTheme + 6 ScrambleText). If anything fails, fix before continuing.

---

## Chunk 1: CloudscapeWallpaper component

### Task 1.1: Build the component

**Files:**
- Create: `src/components/os/CloudscapeWallpaper.tsx`

- [ ] **Step 1: Create the directory + file**

```bash
mkdir -p src/components/os
```

- [ ] **Step 2: Write the component**

Write `src/components/os/CloudscapeWallpaper.tsx` with this exact content:

```tsx
/**
 * CloudscapeWallpaper — fixed-position image element behind all
 * OS content. Renders the placeholder JPEG until Plan C's real
 * .webm asset lands (then this component will gain a <video>
 * branch with the same overlay treatment).
 *
 * Layered behind <Frame> chrome and <Dock> via z-index. Theme-
 * responsive overlay — warm-paper overlay in light, warm-dark
 * overlay in dark. The cloud reads as ambient atmosphere, not
 * foreground.
 *
 * prefers-reduced-data: rendered identically (single static JPEG
 * is already minimal data — no .webm to skip yet).
 *
 * Server component. No interactivity. The image loads via Next.js
 * <Image> with `priority` and `fill` for responsive cover.
 */
import Image from "next/image";

export default function CloudscapeWallpaper() {
  return (
    <div className="cloudscape" aria-hidden>
      <Image
        src="/assets/cloudscape-placeholder.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="cloudscape__media"
        style={{ objectFit: "cover" }}
      />
      <div className="cloudscape__overlay" />

      <style>{`
        .cloudscape {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
        }
        .cloudscape__media {
          filter: saturate(0.85) contrast(0.95);
        }
        .cloudscape__overlay {
          position: absolute;
          inset: 0;
          background: var(--paper);
          opacity: 0.35;
          transition: background-color 200ms var(--ease),
                      opacity 200ms var(--ease);
        }
        html[data-theme="dark"] .cloudscape__overlay {
          opacity: 0.55;
        }
        @media (prefers-reduced-motion: reduce) {
          .cloudscape__overlay { transition: none; }
        }
      `}</style>
    </div>
  );
}
```

- [ ] **Step 3: Type check**

```bash
npx tsc --noEmit
```

Expected: clean. The component is server-rendered (no `"use client"`), uses `next/image`, and has no hooks or state.

- [ ] **Step 4: Don't commit yet** — Task 1.2 mounts and commits.

### Task 1.2: Mount CloudscapeWallpaper in root layout

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Read the current layout to know exact mount order**

```bash
cat src/app/layout.tsx
```

The current order inside `<body>` is: `<ThemeInit /> → <PaperGrain /> → <RouteAnnouncer /> → <Frame />`. CloudscapeWallpaper goes **between PaperGrain and RouteAnnouncer**. Reasons:

- After `<ThemeInit>` so the inline script has set `data-theme` first
- After `<PaperGrain>` so PaperGrain stays at z-index 1 and the cloudscape sits at z-index 0 below it (PaperGrain still does its multiply-blend texture work over the cloud + paper background)
- Before `<Frame>` so Frame's chrome (which uses `z-index: 50`) renders cleanly above

- [ ] **Step 2: Add the import + mount**

In `src/app/layout.tsx`:

Add the import at the top:
```tsx
import CloudscapeWallpaper from "@/components/os/CloudscapeWallpaper";
```

Inside the `<body>`:
```tsx
<body className={`${GeistSans.variable} ${GeistMono.variable} ${newsreader.variable}`}>
  <ThemeInit />
  <PaperGrain />
  <CloudscapeWallpaper />
  <RouteAnnouncer />
  <Frame />
  <a href="#main" className="skip-to-content">
    Skip to content
  </a>
  {children}
</body>
```

- [ ] **Step 3: Verify gates + smoke**

```bash
npx tsc --noEmit && npm run lint && npm run build
```

Expected: all clean.

```bash
npm run dev  # in background; or use existing dev server
curl -s http://localhost:3000/ | grep -c "cloudscape"
```

Expected: ≥1 (the rendered class).

In a browser at `http://localhost:3000/`:
- The cloudscape JPEG should be visible behind the existing Frame chrome
- The Frame chrome (Ryan Jun TL, nav TR, email BR) renders cleanly on top
- PaperGrain texture is still visible
- Toggle `data-theme="dark"` in DevTools — the overlay should darken (opacity 0.55 + dark `--paper` color) so the cloud reads less bright

- [ ] **Step 4: Commit**

```bash
git add src/components/os/CloudscapeWallpaper.tsx src/app/layout.tsx
git commit -m "feat(os): add CloudscapeWallpaper as fixed background

Plan A foundation. Renders placeholder JPEG at z-index 0 behind
all content with a theme-responsive paper overlay (35% opacity in
light, 55% in dark). Loaded via next/image with priority for LCP.
Frame chrome and PaperGrain layer above it cleanly.

Plan C will swap the JPEG for real long-exposure .webm footage
and add a video branch to this component."
```

---

## Chunk 2: Dock component

### Task 2.1: Build the Dock

**Files:**
- Create: `src/components/os/Dock.tsx`

- [ ] **Step 1: Write the component**

Write `src/components/os/Dock.tsx`:

```tsx
"use client";

import { usePathname } from "next/navigation";

/**
 * Dock — left-vertical fixed-position app launcher. Four app
 * glyphs (◇ Finder · ✎ Notes · ◑ Shelf · ⊕ About) stacked
 * vertically. Click handlers are no-op in Plan A — the dock
 * renders as visual furniture, signaling "an OS is here," but
 * window machinery doesn't ship until Plan B.
 *
 * Hidden on /classic and on small viewports (mobile gets the
 * editorial fallback, no dock).
 *
 * Glyph + label microtype rendered vertically. Each item is a
 * <button> (semantic — opening an app is a state change, not
 * navigation). aria-disabled until Plan B wires real handlers.
 */

type DockApp = {
  id: string;
  glyph: string;
  label: string;
};

const APPS: DockApp[] = [
  { id: "finder", glyph: "◇", label: "Finder" },
  { id: "notes",  glyph: "✎", label: "Notes" },
  { id: "shelf",  glyph: "◑", label: "Shelf" },
  { id: "about",  glyph: "⊕", label: "About" },
];

export default function Dock() {
  const pathname = usePathname();
  // Don't render the dock on /classic or its sub-routes.
  if (pathname?.startsWith("/classic")) return null;

  return (
    <nav aria-label="Apps" className="dock">
      {APPS.map((app) => (
        <button
          key={app.id}
          type="button"
          className="dock__item"
          aria-disabled="true"
          aria-label={`Open ${app.label} (not yet available)`}
          title={`${app.label} — coming soon`}
        >
          <span className="dock__glyph" aria-hidden>{app.glyph}</span>
          <span className="dock__label">{app.label}</span>
        </button>
      ))}

      <style>{`
        .dock {
          position: fixed;
          left: clamp(20px, 4vw, 56px);
          top: 50%;
          transform: translateY(-50%);
          z-index: 40;
          display: grid;
          gap: clamp(20px, 2.4vh, 32px);
        }
        .dock__item {
          background: transparent;
          border: 0;
          padding: 4px 0;
          margin: 0;
          cursor: pointer;
          color: inherit;
          display: grid;
          gap: 6px;
          justify-items: center;
          line-height: 1;
        }
        .dock__item[aria-disabled="true"] {
          cursor: default;
          opacity: 0.65;
        }
        .dock__glyph {
          font-family: var(--font-stack-sans);
          font-size: 18px;
          color: var(--ink);
          transition: color 200ms var(--ease), transform 200ms var(--ease);
        }
        .dock__label {
          font-family: var(--font-stack-mono);
          font-size: 9px;
          letter-spacing: 0.10em;
          text-transform: uppercase;
          color: var(--ink-3);
          transition: color 200ms var(--ease);
        }
        .dock__item:not([aria-disabled="true"]):hover .dock__glyph {
          color: var(--ink-2);
          transform: scale(1.1);
        }
        .dock__item:not([aria-disabled="true"]):hover .dock__label {
          color: var(--ink-2);
        }
        .dock__item:focus-visible {
          outline: 1px solid var(--ink);
          outline-offset: 4px;
        }

        @media (prefers-reduced-motion: reduce) {
          .dock__glyph, .dock__label { transition: none; }
          .dock__item:hover .dock__glyph { transform: none; }
        }

        @media (max-width: 720px) {
          .dock { display: none; }
        }
      `}</style>
    </nav>
  );
}
```

- [ ] **Step 2: Type check**

```bash
npx tsc --noEmit
```

Expected: clean.

- [ ] **Step 3: Don't commit yet** — Task 2.2 mounts and commits.

### Task 2.2: Mount Dock in root layout

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Add the import + mount**

Add to the imports:
```tsx
import Dock from "@/components/os/Dock";
```

Inside `<body>`, mount Dock **after Frame** (so Frame's chrome stays above-right and Dock sits at left-center):

```tsx
<body className={`${GeistSans.variable} ${GeistMono.variable} ${newsreader.variable}`}>
  <ThemeInit />
  <PaperGrain />
  <CloudscapeWallpaper />
  <RouteAnnouncer />
  <Frame />
  <Dock />
  <a href="#main" className="skip-to-content">
    Skip to content
  </a>
  {children}
</body>
```

- [ ] **Step 2: Verify gates + smoke**

```bash
npx tsc --noEmit && npm run lint && npm run build
```

Expected: clean.

In a browser at `http://localhost:3000/`:
- Dock visible at left-center, vertical, 4 items (◇ Finder, ✎ Notes, ◑ Shelf, ⊕ About)
- Each item shows glyph + small uppercase mono label below
- Hovering an item — no visible state change because they're all `aria-disabled="true"` (this is intentional in Plan A; Plan B wires real interactivity)
- Resize viewport below 720px — Dock disappears (mobile fallback)
- Visit `/classic` — Dock disappears (the early-return guard)

- [ ] **Step 3: Commit**

```bash
git add src/components/os/Dock.tsx src/app/layout.tsx
git commit -m "feat(os): add Dock — left-vertical app launcher

Plan A foundation. Four app glyphs (◇ Finder · ✎ Notes ·
◑ Shelf · ⊕ About) stacked vertically at left-center, fixed.
Click handlers no-op (aria-disabled='true') in Plan A — visual
furniture only; Plan B wires window opening.

Hidden on /classic routes and below 720px viewport (mobile fallback
keeps the editorial chrome only)."
```

---

## Chunk 3: /classic route + mobile redirect

### Task 3.1: Create the /classic route

**Files:**
- Create: `src/app/classic/page.tsx`
- Optionally create: `src/app/classic/layout.tsx`

- [ ] **Step 1: Create the directory**

```bash
mkdir -p src/app/classic
```

- [ ] **Step 2: Create the page**

The `/classic` page preserves the current home content (hello-stake + featured plates) so mobile and forced-classic visitors see something coherent. The current `src/app/page.tsx` IS this content already — we copy it.

Read the current `src/app/page.tsx`:

```bash
cat src/app/page.tsx
```

Create `src/app/classic/page.tsx` with the same content but with one structural change: this page does NOT need to coexist with the Dock (the layout's Dock component already early-returns on `/classic`), and it should keep the existing hero+featured layout.

```tsx
"use client";

import WorkPlate from "@/components/WorkPlate";
import { PIECES } from "@/constants/pieces";

/**
 * /classic — the editorial fallback for mobile and forced-classic
 * visitors. Preserves the hello-stake + featured-plates layout
 * that the OS surface (/) replaces.
 *
 * Frame chrome (TL identity, TR nav, BR action) renders normally
 * via the root layout — the Dock and CloudscapeWallpaper are
 * suppressed for /classic by their own pathname checks.
 */
export default function ClassicHome() {
  const featured = PIECES.filter((p) => !p.placeholder).slice(0, 2);

  return (
    <main id="main" className="classic-home">
      <section className="classic-home__stake" aria-label="Introduction">
        <p className="classic-home__lede">
          Ryan Jun is a designer and engineer in New York,
          building interfaces, brands, and the small things between them.
        </p>
        <p className="classic-home__location tabular">2026 — New York</p>
      </section>

      {featured.length > 0 && (
        <section className="classic-home__featured" aria-label="Featured work">
          {featured.map((piece) => (
            <WorkPlate key={piece.slug} piece={piece} />
          ))}
        </section>
      )}

      <style>{`
        .classic-home {
          min-height: 100svh;
          padding: clamp(140px, 24vh, 220px) clamp(24px, 4vw, 56px) clamp(80px, 12vh, 120px);
          display: grid;
          gap: clamp(64px, 12vh, 120px);
          align-content: start;
          position: relative;
          z-index: 1;
        }
        .classic-home__stake {
          max-width: 760px;
          margin-inline: auto;
          width: 100%;
          display: grid;
          gap: 14px;
        }
        .classic-home__lede {
          font-family: var(--font-stack-sans);
          font-weight: 400;
          font-size: clamp(16px, 1.5vw, 19px);
          line-height: 1.5;
          color: var(--ink);
          margin: 0;
          max-width: 38ch;
        }
        .classic-home__location {
          font-family: var(--font-stack-mono);
          font-size: 11px;
          letter-spacing: 0.10em;
          text-transform: uppercase;
          color: var(--ink-3);
          margin: 0;
          font-variant-numeric: tabular-nums;
        }
        .classic-home__featured {
          max-width: 1240px;
          margin-inline: auto;
          width: 100%;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(20px, 3vw, 48px);
        }
        @media (max-width: 720px) {
          .classic-home__featured {
            grid-template-columns: 1fr;
            row-gap: clamp(32px, 5vh, 56px);
          }
        }
      `}</style>
    </main>
  );
}
```

- [ ] **Step 3: Type check**

```bash
npx tsc --noEmit
```

Expected: clean.

- [ ] **Step 4: Smoke test**

Visit `http://localhost:3000/classic` in a browser. Should render:
- Frame chrome (TL identity, TR nav, BR email)
- The hello-stake paragraph + location line
- 2 featured plates (Gyeol + Sift) below
- NO Dock visible (pathname starts with /classic — early return in Dock)
- NO CloudscapeWallpaper... wait, the wallpaper IS rendered in layout. We need to suppress it on /classic too.

Hmm — the spec says cloudscape only on `/`. The `<CloudscapeWallpaper>` doesn't currently have a pathname guard. We need to add one.

- [ ] **Step 5: Add pathname guard to CloudscapeWallpaper**

The CloudscapeWallpaper is currently a server component. To check pathname we need to either (a) make it client and use `usePathname`, or (b) move it to a client wrapper, or (c) leave it visible on `/classic` and accept that.

Option (c) is fine actually — a cloudscape behind the editorial mobile fallback is harmless and consistent (same visual register, just different content layout). But let's match the spec: cloud only on `/`.

Convert `src/components/os/CloudscapeWallpaper.tsx` to a client component with a pathname guard:

Edit `src/components/os/CloudscapeWallpaper.tsx`:

```tsx
"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";

/**
 * CloudscapeWallpaper — fixed-position image element behind all
 * OS content. Renders only on the OS surface (/), not /classic.
 *
 * Theme-responsive paper overlay. Plan C will swap the JPEG for
 * real .webm footage and add a video branch.
 */
export default function CloudscapeWallpaper() {
  const pathname = usePathname();
  if (pathname?.startsWith("/classic")) return null;

  return (
    <div className="cloudscape" aria-hidden>
      <Image
        src="/assets/cloudscape-placeholder.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="cloudscape__media"
        style={{ objectFit: "cover" }}
      />
      <div className="cloudscape__overlay" />

      <style>{`
        .cloudscape {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
        }
        .cloudscape__media {
          filter: saturate(0.85) contrast(0.95);
        }
        .cloudscape__overlay {
          position: absolute;
          inset: 0;
          background: var(--paper);
          opacity: 0.35;
          transition: background-color 200ms var(--ease),
                      opacity 200ms var(--ease);
        }
        html[data-theme="dark"] .cloudscape__overlay {
          opacity: 0.55;
        }
        @media (prefers-reduced-motion: reduce) {
          .cloudscape__overlay { transition: none; }
        }
      `}</style>
    </div>
  );
}
```

- [ ] **Step 6: Verify**

```bash
npx tsc --noEmit && npm run lint && npm run build
```

Expected: clean.

Browser smoke:
- `/` shows cloudscape + dock + frame
- `/classic` shows frame + hello-stake content; NO cloudscape, NO dock

- [ ] **Step 7: Don't commit yet** — Task 3.2 ships the middleware together.

### Task 3.2: Build mobile-redirect middleware

**Files:**
- Create: `middleware.ts` (project root, NOT in `src/`)

- [ ] **Step 1: Create the middleware file**

Write `middleware.ts` at the project root:

```ts
import { NextRequest, NextResponse } from "next/server";

/**
 * Mobile redirect middleware (HKJ_OS Plan A).
 *
 * Layer 1 of the two-layer mobile fallback strategy. Edge-runs
 * before any HTML is generated. Sniffs User-Agent for known
 * mobile patterns (including iPad, which Apple ships without
 * "Mobile" in the UA).
 *
 * If matched and the path is "/", rewrites to /classic. The
 * client-side Layer 2 (matchMedia coarse-pointer + viewport)
 * lives elsewhere and catches ambiguous devices that pass this
 * filter — see <ClassicGate> (Plan B).
 *
 * User overrides via ?force=os | ?force=classic + cookie are
 * NOT yet implemented in Plan A — added in Plan B alongside
 * window state machinery.
 */

// Matches: iPhone, Android Mobile, iPad, generic Mobile, Opera Mobi.
// Excludes desktop Chrome on Linux that has "Mobile" in some
// extension UA strings — the regex requires explicit mobile context.
const MOBILE_UA = /iPhone|iPad|iPod|Android.*Mobile|Mobile.*(Safari|Firefox)|Opera Mobi/i;

export function middleware(req: NextRequest) {
  const ua = req.headers.get("user-agent") ?? "";
  const path = req.nextUrl.pathname;

  // Only rewrite the home route. Sub-routes have their own
  // /classic equivalents (or land directly without rewriting).
  if (path === "/" && MOBILE_UA.test(ua)) {
    return NextResponse.rewrite(new URL("/classic", req.url));
  }

  return NextResponse.next();
}

export const config = {
  // Match only / — no need to run middleware on every asset request.
  matcher: ["/"],
};
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

Expected: clean. The build output should mention middleware compilation.

- [ ] **Step 3: Smoke test the middleware with curl + UA spoofing**

In one terminal, ensure dev server is running. In another:

```bash
# Desktop UA — should NOT redirect
curl -sI -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" http://localhost:3000/ | head -1
# Expected: HTTP/1.1 200 OK (no rewrite)

# Mobile UA — should serve /classic content
curl -s -A "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15" http://localhost:3000/ | grep -c "classic-home"
# Expected: ≥1 (the /classic page is served via rewrite)

# iPad UA — should also serve /classic
curl -s -A "Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15" http://localhost:3000/ | grep -c "classic-home"
# Expected: ≥1

# Android UA — should also serve /classic
curl -s -A "Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 Mobile" http://localhost:3000/ | grep -c "classic-home"
# Expected: ≥1
```

If any of these don't match expected, fix the UA regex and re-test.

- [ ] **Step 4: Commit Tasks 3.1 + 3.2 together**

```bash
git add src/app/classic/page.tsx src/components/os/CloudscapeWallpaper.tsx middleware.ts
git commit -m "feat(os): /classic route + mobile UA redirect middleware

Plan A foundation. /classic preserves the hello-stake + featured
plates layout for mobile / forced-classic visitors. Edge middleware
sniffs UA (iPhone | iPad | Android Mobile | Opera Mobi) and rewrites
/ to /classic for known-mobile traffic before any HTML is generated.

CloudscapeWallpaper converted to client component to read pathname
and skip rendering on /classic routes.

Layer 2 (client-side coarse-pointer + viewport check) and force-
override query strings + cookies deferred to Plan B."
```

---

## Chunk 4: page.tsx restructure to OS desktop

The current `src/app/page.tsx` IS the editorial hello-stake — it's now duplicated at `/classic`. The OS surface (`/`) needs to be a thin desktop body that's mostly empty in Plan A; Plan B fills it with windows.

### Task 4.1: Replace page.tsx with the OS desktop

**Files:**
- Modify: `src/app/page.tsx` (full replacement)

- [ ] **Step 1: Read current page.tsx for reference**

```bash
cat src/app/page.tsx
```

The content moves to `/classic` (already done in Task 3.1). The new `src/app/page.tsx` is a thin desktop body.

- [ ] **Step 2: Replace the file**

Write `src/app/page.tsx`:

```tsx
/**
 * / — the OS desktop surface.
 *
 * Plan A: thin desktop body. CloudscapeWallpaper, Frame, and Dock
 * render via the root layout. This component renders nothing
 * visible — the desktop IS the wallpaper + chrome — but provides
 * the <main> landmark for accessibility and a future container
 * for windows.
 *
 * Plan B will populate this with <WindowManager /> + windows.
 *
 * Server component. No interactivity in Plan A.
 */
export default function Home() {
  return (
    <main id="main" className="desktop" aria-label="Desktop">
      <style>{`
        .desktop {
          /* Fill viewport behind the fixed-position Frame and Dock.
             No content yet — windows ship in Plan B. */
          position: relative;
          z-index: 1;
          min-height: 100svh;
          width: 100%;
          /* No padding — windows position themselves absolutely
             relative to the viewport, not the desktop padding. */
        }
      `}</style>
    </main>
  );
}
```

- [ ] **Step 3: Verify gates**

```bash
npx tsc --noEmit && npm run lint && npm run test && npm run build
```

Expected: all clean. Tests still 11/11.

- [ ] **Step 4: Smoke test in browser**

Visit `http://localhost:3000/`:
- Cloudscape JPEG visible behind everything (full viewport, with overlay)
- Frame chrome at TL/TR/BR (Ryan Jun, work/garden/shelf/about, email)
- Dock at left-center vertical (◇ ✎ ◑ ⊕)
- No content in the middle of the desktop — empty by design
- No Dock items respond to clicks (aria-disabled)

Visit `http://localhost:3000/classic`:
- No cloudscape
- No Dock
- Frame chrome present
- Hello-stake paragraph + featured plates render

Toggle theme via DevTools (`document.documentElement.dataset.theme = "dark"`):
- `/` cloudscape overlay darkens
- All chrome adapts to dark theme

- [ ] **Step 5: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat(os): / becomes thin OS desktop surface

Plan A foundation. The editorial hello-stake content moved to
/classic in the prior commit. / now renders only an empty <main>
landmark with the desktop class. CloudscapeWallpaper, Frame, and
Dock are mounted in the root layout and provide all visible
content for Plan A.

Plan B will populate this with <WindowManager /> and the
interactive windowed apps (Finder, Notes, Shelf, About)."
```

---

## Chunk 5: Final verification + smoke

### Task 5.1: Full gates + cross-route smoke

**Files:** none modified

- [ ] **Step 1: Run all gates one final time**

```bash
npx tsc --noEmit
npm run lint
npm run test
npm run build
```

Expected: all clean. Test count 11.

- [ ] **Step 2: Walk every route in both themes**

In a browser, walk:

- `/` (light): cloudscape + frame + dock visible; main empty
- `/` (dark, set via DevTools): cloudscape overlay darkens; chrome flips
- `/classic` (light): no cloudscape, no dock; frame + hello-stake + 2 plates
- `/classic` (dark): same content, dark theme
- `/work/gyeol`: existing case-study route — should render normally (not affected by Plan A)
- `/about`, `/garden`, `/shelf`: these routes may or may not have pages yet — note their state, don't fix in Plan A
- `/random-404`: standard not-found

For each: confirm no console errors, no hydration warnings, build SHA renders correctly if visible anywhere.

- [ ] **Step 3: Mobile redirect simulation**

Use DevTools "Toggle device toolbar" → iPhone 14 Pro:
- Visit `/` — should show /classic content (mobile UA triggered the rewrite)
- Verify no Dock visible

Use Linux Chrome (desktop):
- Visit `/` — should show OS desktop with cloudscape + dock

Use curl with iPad UA:
```bash
curl -s -A "Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15" http://localhost:3000/ | grep -c "classic-home"
```
Expected: ≥1.

- [ ] **Step 4: Build size check**

```bash
npm run build
```

Look at the output for `/` and `/classic` route sizes. Plan A should add minimal weight: cloudscape JPEG (≤200KB), the new components (~3KB JS each gzipped), middleware (~1KB). Total addition < 250KB. If the JPEG is dramatically larger, recompress.

- [ ] **Step 5: No commit needed if everything passes**

If smoke surfaces issues, fix and commit. Otherwise Plan A is complete.

---

## Done

Plan A ships:

- **Cloudscape wallpaper** behind the OS surface, theme-responsive overlay, placeholder JPEG until Plan C
- **Dock** at left-center vertical with 4 app glyphs (visual furniture only — clicks no-op in Plan A)
- **/classic route** preserves the editorial hello-stake home; mobile UAs auto-redirect there via edge middleware
- **/ desktop surface** thin and ready for window machinery in Plan B

What's deferred to Plan B:
- Window primitive + `useWindowManager` hook
- All 4 apps (Finder, Notes, Shelf, About) — actual functional clicks on dock
- Layer-2 client-side mobile fallback (coarse-pointer + viewport check)
- ?force=os / ?force=classic query overrides + cookies
- URL-based deep-link hydration (e.g., visiting /work/gyeol on / opens the ProjectWindow)

What's deferred to Plan C:
- Boot sequence
- Real cloudscape `.webm` asset
- Window-open / close animations
- Optional Terminal app

**Ready to execute?**

Per the writing-plans skill, this harness has subagents available, so the standard execution path is **superpowers:subagent-driven-development** — fresh subagent per task with two-stage review.

---
