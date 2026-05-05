# HKJ_OS — Studio Operating System Direction

**Date:** 2026-05-05
**Status:** Direction (canonical) — pending user review
**Supersedes:** [2026-05-02-aino-hs68-framework.md](./2026-05-02-aino-hs68-framework.md) as the operative direction for `/`. The aino+hs68 framework is preserved as the spec for the **mobile fallback route `/classic`**, not retired.
**Extends:** the existing token system, theme system, and content models from the prior rollout.

---

## What this is

A pivot from the editorial portfolio direction (aino + hs68 framework) to a **fictional studio operating system** as the primary portfolio surface. Not a Mac OS Classic mockup. Not a Windows 95 nostalgia trip. Not a literal terminal clone. An authored OS — built with HKJ's existing taste system applied to UI patterns OS interfaces traditionally use (windows, file system, menu bar, desktop) but with the visual chrome reinvented from scratch.

The reference: ZUI_OS (Awwwards Nominee, Feb 2026) — "feels used, not presented." A fictional OS that captures the *feeling* of legacy computing inside a new system the designer authored, rather than copying any specific OS.

The departure from ZUI_OS: HKJ_OS uses warm-paper register (or dark-mode toggle), microtype-driven chrome (no pixel icons, no raster window borders), cloudscape desktop wallpaper, and the existing PP Neue Montreal / Geist / Newsreader type system. It is recognizably a continuation of the prior taste investment, just applied to a new idiom.

---

## Why this direction

The prior aino+hs68 framework optimized for editorial polish and recruiter-readability. It's the safe-and-good move. The HKJ_OS direction optimizes differently — for technical signaling, memorability, and creative-technologist positioning.

The strategic case for OS:

1. **The taste investment compounds.** PP Neue Montreal, warm paper, microtype rigor, theme system, motion grammar — all carry forward, just applied to OS chrome instead of editorial layouts.
2. **Each piece of work gets its own room.** A "Project Window" is a real surface; a tile-in-a-grid is a thumbnail. Case studies become first-class.
3. **The boot sequence has a job.** The Phase 6 ASCII preloader becomes the boot screen — already-built infrastructure.
4. **Cloud wallpaper integrates naturally.** The cinematic cumulus aesthetic the user proposed sits behind windows as desktop wallpaper, present but not dominant.
5. **Vibe-coded fast.** With Cursor + Claude, OS chrome that historically took months can be built in 2–4 weeks of disciplined work.

---

## What this is NOT

Explicit retirement list. Do not propose any of these.

- **Mac OS Classic mockup.** No traffic-light close/minimize buttons. No gradient title bars. No Susan Kare pixel icons.
- **Windows 95 nostalgia.** No bevel chrome. No Tahoma fonts. No System Sound bootup.
- **Linux terminal clone.** Terminal is an optional app, not the entire surface.
- **Desktop computer skeuomorphism.** No fake brushed aluminum. No fake CRT scanlines. No fake speakers.
- **Pixel raster icons.** All "icons" are typographic — a glyph (◇ ✎ ◑ ⊕ ⌧) + microtype label.
- **Drop shadows that read as 2010-era Material.** Window separation comes from hairlines, not shadows.
- **Generic OS UX patterns** copy-pasted (right-click context menus, Cmd+Tab app switcher, full window resizing). HKJ_OS picks which OS metaphors earn their place; the rest are skipped.

---

## The OS metaphor — applied selectively

OS interfaces have many primitives. HKJ_OS uses the ones that serve the portfolio and skips the rest.

### Adopted

- **Desktop** — the home surface. Cloudscape wallpaper. Ambient.
- **Menu bar** — fixed top, carries the brand mark and live status (time, theme).
- **Dock / Sidebar** — left or bottom, lists available apps as glyph + label.
- **Windows** — each app opens as a window. Draggable. Closable. Z-stacked.
- **File system metaphor for work** — projects are "files" in folders inside Finder.
- **Boot sequence** — runs once per session before the desktop appears.

### NOT adopted (deliberately)

- **Window resizing handles** — windows have fixed sizes per app. Dragging = position only.
- **Maximize / fullscreen** — no maximize button. Windows are always windowed. The desktop and the cloudscape are part of the experience.
- **Right-click context menus** — adds complexity, low value, mobile-incompatible.
- **Multiple desktops / Spaces** — single desktop only.
- **Notification center** — no system notifications.
- **Trash / Recycle Bin** — no destructive ops; everything is read-only.
- **System Settings as an app** — theme toggle lives in the menu bar, not a settings app.

---

## Visual system — applied to OS chrome

### Tokens (unchanged from prior specs)

```css
:root {
  --paper:   #FBFAF6;   /* desktop ground (light theme) */
  --paper-2: #F4F3EE;   /* window background */
  --paper-3: #E8E7E1;   /* window header / menu bar */
  --ink:     #111110;
  --ink-2:   #55554F;
  --ink-3:   #8E8E87;
  --ink-4:   #BFBEB8;
  --ink-hair: rgba(17,17,16,0.10);
  --ink-ghost: rgba(17,17,16,0.06);
  --microtype-tracking: 0.12em;
}

html[data-theme="dark"] {
  --paper:   #0E0D09;
  --paper-2: #16150F;
  --paper-3: #24221A;
  --ink:     #F8F5EC;
  --ink-2:   #C8C5BC;
  --ink-3:   #8E8C85;
  --ink-4:   #555349;
  --ink-hair:  rgba(248,245,236,0.10);
  --ink-ghost: rgba(248,245,236,0.06);
  --microtype-tracking: 0.11em;
}
```

### Type

- **Geist Sans** (chrome face) — pending PP Neue Montreal swap when fonts arrive
- **Newsreader** (body serif, only inside long-form Notes content)
- Mono retired
- Microtype tracking via `var(--microtype-tracking)`
- All UI chrome (menu bar, window titles, dock labels) at 10–11px microtype tracked
- Window body content at 14–15px body
- Long-form Notes content uses Newsreader at 16–17px

### Window chrome (the authored part)

Windows have:

- **No drop shadow.** Separation from desktop comes from a 1px `var(--ink-hair)` border + the wallpaper color difference.
- **Title bar** at top: 32px tall, `var(--paper-3)` background, hairline bottom border. Contains:
  - Left: app glyph + name in microtype (`◇ FINDER`)
  - Right: close button only — a single `×` at 14px, `var(--ink-3)` color, hover lifts to `var(--ink)`. No minimize, no maximize.
- **Body**: `var(--paper-2)` background, internal padding `clamp(20px, 3vw, 36px)`, scrollable if content exceeds the fixed window height.
- **Drag affordance**: cursor changes to `grab` over the title bar.

### App glyphs (typographic icon system)

No raster icons. Each app has a single Unicode glyph + label.

| App | Glyph | Label |
|---|---|---|
| Finder | ◇ | FINDER |
| Notes | ✎ | NOTES |
| Bookmarks | ◑ | BOOKMARKS |
| Studio | ⊕ | STUDIO |
| Terminal | ⌧ | TERMINAL |
| Theme toggle (menu bar) | ☼ / ☾ | (no label) |

Glyphs render at 14–16px in `var(--ink)` color. Hover state: scale 1.1 + color shift to `var(--ink-2)`. Active app (window currently focused): glyph in `var(--ink)`, others damped to `var(--ink-3)`.

### Cursor

System default. No custom pixel cursor. The earlier `CursorReadout` component stays retired.

### Cloudscape wallpaper

Fixed-position `<video>` (with poster fallback `<picture>`) element at z-index 0, behind all OS content.

**Real asset (Phase 6):**
- Source: long-exposure cloudscape video, ~10s seamless loop, ≤2MB compressed `.webm`
- Origin: real footage (user-shot or licensed stock)
- Treatment: full-bleed cover, slight `filter: saturate(0.85) contrast(0.95)` for restraint
- Overlay: `var(--paper)` at 30–40% opacity so the cloudscape reads as ambient atmosphere, not foreground
- Theme-responsive: same video; overlay color flips per theme (warm paper overlay in light; warm dark in dark)
- `prefers-reduced-motion`: video pauses on first frame
- `prefers-reduced-data`: video not loaded; poster only

**Placeholder asset (Phases 1–5, before real footage lands):**
- A static `public/assets/cloudscape-placeholder.jpg` — low-res cloudscape JPEG, ~50KB. License a quick stock photo or use any cloud reference image. The implementer ships the placeholder JPEG in Phase 1 so the desktop renders as intended even before real footage is available.
- Renders identically to the final asset's poster fallback — `<img>` with `object-fit: cover` + the same theme-responsive overlay
- Phase 6 swaps the JPEG for the real `.webm` + poster pair; nothing else in the implementation changes

The cloudscape is the SINGLE most distinctive visual choice. It's what makes HKJ_OS feel like HKJ_OS and not just any custom-OS portfolio.

---

## Components — full inventory

### New (this direction adds)

| Component | Path | Responsibility |
|---|---|---|
| `<BootSequence>` | `src/components/os/BootSequence.tsx` | Renders on first session-load. ASCII text loader, then fades to desktop. **Reuses existing `usePreloaderState` hook unchanged** — file and exported symbol stay; we treat the existing `"active" / "dismissed"` states as `"booting" / "booted"` semantically. The localStorage key changes from `hkj.preloader.dismissed` to `hkj_os.booted` (per the persistence-keys table below). |
| `<Desktop>` | `src/components/os/Desktop.tsx` | Top-level container. Renders cloudscape wallpaper, menu bar, dock, and active windows. |
| `<CloudscapeWallpaper>` | `src/components/os/CloudscapeWallpaper.tsx` | Fixed-position video/poster element. Theme-aware overlay. |
| `<MenuBar>` | `src/components/os/MenuBar.tsx` | Top fixed bar. Brand mark left, live time + theme toggle right. |
| `<Dock>` | `src/components/os/Dock.tsx` | **Left side, vertical** (locked). Renders app glyphs as launchers. |
| `<Window>` | `src/components/os/Window.tsx` | Base window primitive. Title bar + body slot + close button + drag handler. Receives `app` config. |
| `<Finder>` | `src/components/os/apps/Finder.tsx` | The default-open app. File browser of work pieces. Each piece is a "file" — double-click opens its Project Window. |
| `<ProjectWindow>` | `src/components/os/apps/ProjectWindow.tsx` | Renders a case study inside a window. Wraps existing `<CaseStudy>` content. |
| `<Notes>` | `src/components/os/apps/Notes.tsx` | List of essays + detail view inside the window. |
| `<Bookmarks>` | `src/components/os/apps/Bookmarks.tsx` | Shelf as a windowed view. |
| `<Studio>` | `src/components/os/apps/Studio.tsx` | About + contact + colophon as a single window. |
| `<Terminal>` | `src/components/os/apps/Terminal.tsx` | OPTIONAL (Phase 5+). CLI mode with `ls`, `cd`, `cat`, `theme`, `reset`. |
| `useWindowManager` hook | `src/hooks/useWindowManager.ts` | State machine: which windows are open, their positions, z-stack order, focused window. Persists to localStorage. |

### Survives from prior rollouts

| Component | Status |
|---|---|
| Theme system: `useTheme`, `ThemeInit`, `ThemeToggle` | Becomes system theme preference; ThemeToggle moves to MenuBar |
| `usePreloaderState` + Preloader infrastructure | Repurposed as boot sequence state |
| `useReducedMotion`, `useSectionReveal` | Carry forward unchanged |
| `ScrambleText` | Used in MenuBar text, app glyph hover |
| Content models: `PIECES`, `CASE_STUDIES`, `notes.ts`, `shelf.ts` | Unchanged. Apps consume these. |
| Vitest setup + 19 existing tests | Preserved. New tests for `useWindowManager`. |
| `RouteAnnouncer`, `PaperGrain`, `globals.css` tokens | Carry forward |

### Retired (delete from disk)

These were Phase 5 framework components that don't fit OS metaphor.

| Component | Reason |
|---|---|
| `WorkPlate` | Replaced by Finder file rows + ProjectWindow |
| `WorkList` | Replaced by Finder list-view mode |
| `ViewToggle` | Replaced by Finder's view-mode toggle (icon vs list) inside the Finder window |
| `ReservedZone` | No longer needed — toggles live in MenuBar |
| `Folio` | Replaced by MenuBar |
| `NavCoordinates` | Replaced by MenuBar + Dock |
| `HomeViewInit` | Replaced by `WindowManagerInit` (init script reading window state from localStorage) |
| `useHomeView` | Replaced by Finder's view-mode local state |
| `CursorReadout`, `StatusReadout`, `PixelMark` | Already retired in prior pass; confirm gone |
| The 5-section home from `src/app/page.tsx` | Replaced by `<Desktop>` |

### Mobile fallback (preserved at `/classic`)

The aino+hs68 editorial framework gets PRESERVED, not retired, at the route `/classic`. On viewports ≤720px, `/` redirects to `/classic`. The aino+hs68 work survives as the touch-friendly view of the same content.

This means **none of the prior implementation is wasted** — the home gets the OS, mobile gets the editorial. Both routes share the same data sources.

The `/classic` route uses `<WorkPlate>`, `<WorkList>`, etc. — components that would otherwise be retired stay alive there.

---

## Apps — detailed specs

### Finder

The default app, opens automatically when the boot sequence ends. The first thing the visitor sees inside the desktop.

**Window dimensions:** 720×520px (locked; not resizable).
**Position on first open:** centered.
**Window title:** `◇ FINDER · /work`.

**Body content:**
- View-mode toggle in body header: `Icons / List` (Finder's local state)
- Path bar: `/work` (or `/work/featured`, `/work/placeholder` if folder navigation is added)
- Files area: each `Piece` from `PIECES` rendered as a file row or icon
  - Icon mode: 4-col grid, each cell = small thumbnail + filename (`gyeol.proj`, `sift.proj`, `untitled-01.proj`, etc.)
  - List mode: typeset rows like the prior `WorkList` (number, title, year, sector, description)
- Double-click on a file = opens that piece in a `ProjectWindow`
- Single-click on a file = highlight in `var(--ink-hair)` background

### ProjectWindow

Opens when a `.proj` file is double-clicked in Finder. Renders the case study content for that piece.

**Window dimensions:** 880×640px (locked).
**Position:** opens offset 24px below-right of Finder, or in cascade if multiple opened.
**Window title:** `◇ {PIECE_TITLE} — {YEAR}` e.g., `◇ GYEOL: 결 — 2026`.

**Body content:**
- Wraps the existing `<CaseStudy piece={piece} />` component
- Caption rigor (number, title, role, description, meta) preserved
- Photographs slot from Phase 5 case-study spec preserved
- Editorial sections render inside the window with internal scroll

**Placeholder pieces** (`piece.placeholder === true`, e.g. `untitled-01`, `untitled-03`, `untitled-05–07`): a `ProjectWindow` opens but its body renders a stub:

```
P{NN} — Untitled
Coming.

[microtype: this piece is in development; check back later
 or browse other work in the Finder.]
```

No CaseStudy content; just the stub. Window dimensions unchanged. Avoids the empty-window failure mode and keeps the file-system metaphor honest (every file opens to *something*).

### Notes

Window title: `✎ NOTES`.

**Window dimensions:** 720×560px.
**Body:** two-pane layout.
- Left: list of essays (from existing `notes.ts`)
- Right: selected essay rendered with Newsreader body type
- Default selection: first essay
- Reveal hook (`useSectionReveal`) preserved on essay sections

### Bookmarks

Window title: `◑ BOOKMARKS`.

**Window dimensions:** 720×600px.
**Body:** the shelf — each entry as a row (image left, title + creator + year + note right). Filter chips at top (`KEEP / WATCH / VISIT` if present in data).

### Studio

Window title: `⊕ STUDIO`.

**Window dimensions:** 640×580px.
**Body:** about / contact / colophon stacked. Contains the `<CopyEmailLink>`, the studio essay, and the live build SHA.

### Terminal (optional, deferred to Phase 5)

Window title: `⌧ TERMINAL`.

**Window dimensions:** 640×440px.
**Body:** monospace text area + input prompt.
**Commands:**
- `help` — list all commands
- `ls [path]` — list files
- `cd [folder]` — change folder (no-op for now; just feedback)
- `cat [file]` — print file contents (or open in window)
- `theme [light|dark]` — switch theme
- `open [app]` — open an app window (`open finder`, `open notes`, etc.)
- `reset` — clear localStorage, reload
- `whoami` — print user identity ("HYEONJOON JUN · DESIGN ENGINEER · NEW YORK")

Optional. Power-user feature. Ship in Phase 5+ once core is solid.

---

## Window manager — state machine

`useWindowManager` hook governs all window state. Built on `useSyncExternalStore` like the project's other hooks (`useTheme`, `useHomeView`, `usePreloaderState`) — DOM-or-store-canonical, localStorage write-only persistence.

### State shape

```ts
type WindowId = "finder" | "notes" | "bookmarks" | "studio" | "terminal" | `project-${string}`;

type WindowState = {
  id: WindowId;
  position: { x: number; y: number };  // top-left in viewport pixels
  zIndex: number;
  isFocused: boolean;
  openedAt: number;        // Date.now() when first opened this session
  lastFocusedAt: number;   // Date.now() when most recently focused
};

type WindowManagerState = {
  windows: Record<WindowId, WindowState>;
  zCounter: number;  // monotonic, unbounded — see Z-stack note
  focusedId: WindowId | null;
};
```

### Operations

- `openWindow(id, openerPosition?)` — adds a window if not present; brings to front; focuses; sets `openedAt = lastFocusedAt = Date.now()`
- `closeWindow(id)` — removes from open list
- `focusWindow(id)` — brings to front; updates `lastFocusedAt = Date.now()`; assigns next z-counter
- `moveWindow(id, position)` — updates position during drag (transform-based render; see Drag mechanic below)
- `reset()` — closes all windows, returns to bare desktop

### Drag mechanic — locked

Pointer-based dragging on title bars. The flow:

1. `pointerdown` on title bar (excluding the close button hit area):
   - Capture pointer (`element.setPointerCapture(e.pointerId)`)
   - Record drag offset: `offsetX = e.clientX - position.x`, `offsetY = e.clientY - position.y`
   - Set window data attribute `data-dragging="true"`
   - Focus the window (brings to front)
2. `pointermove` (only when `dragging` is set):
   - Compute new position: `nextX = e.clientX - offsetX`, `nextY = e.clientY - offsetY`
   - Constrain to viewport bounds (window must remain ≥40px visible on each axis)
   - Update via rAF-throttled state update
3. `pointerup` / `pointercancel`:
   - Release pointer capture
   - Clear `data-dragging`
   - Final state commits to `useWindowManager`; persistence debounce (200ms) flushes

**Render strategy:** windows position via `transform: translate(var(--x), var(--y))`, where `--x` and `--y` are CSS variables set inline from state. Avoids reflow on every drag frame.

**Cursor states:** `cursor: grab` on title bar default; `cursor: grabbing` while dragging; `cursor: pointer` on close button.

### Persistence

- Window state persisted to `localStorage("hkj_os.windows")` on every state change (debounced 200ms)
- On boot, init script reads localStorage and restores the prior session's open windows + positions
- Query string `?reset=1` or Terminal `reset` command clears the persisted state and reloads to a bare boot

### Initial state on first-ever visit

- Boot sequence runs (~1.4s)
- Boot ends → Finder opens centered automatically (locked behavior — was Open Q2)
- No other windows open

### Z-stack

- Most recently focused window has highest z-index
- Click any window's title bar = brings to front, updates `lastFocusedAt`
- `zCounter` increments by 1 each focus operation; assigned to the focused window's `zIndex`
- **No normalization needed.** `Number.MAX_SAFE_INTEGER ≈ 9 × 10^15` — even at 100 focus operations per second for 10 years continuous, won't overflow. Counter is intentionally unbounded.

### 5-window cap

Maximum 5 simultaneous windows. Opening a 6th window closes the **least-recently-focused** window automatically (using `lastFocusedAt` field). Rationale: a window the user has been ignoring for the longest is the least valuable to keep alive. This is deterministic — never ambiguous about which window closes.

Prevents the desktop from becoming a graveyard of forgotten windows.

---

## Boot sequence

Reuses the existing `usePreloaderState` hook + `Preloader` / `PreloaderClient` / `PreloaderInit` files **without renaming them**. The `<BootSequence>` component is a new component that consumes the same hook. Conceptual mapping:

- `usePreloaderState().state === "active"` → "booting" (BootSequence visible)
- `usePreloaderState().state === "dismissed"` → "booted" (Desktop visible)

The localStorage key migrates from `hkj.preloader.dismissed` → `hkj_os.booted`. The hook's STORAGE_KEY constant updates; the rest of the hook is unchanged. Existing `usePreloaderState` tests carry forward; only the storage-key assertion updates.

**Visual:**
- t=0: black screen (or warm-paper / warm-dark depending on theme)
- t=0–200ms: ASCII text appears top-left: `HKJ_OS / 0.1.0`
- t=200–800ms: status lines tick in below: `LOADING SYSTEM...` → `LOADING WALLPAPER...` → `LOADING APPS... 5/5` → `WELCOME, HYEONJOON.`
- t=800–1100ms: cloudscape wallpaper fades up behind text
- t=1100–1400ms: text fades out, menu bar + dock fade in
- t=1400ms: Finder opens centered, focused
- Boot complete

**Total budget:** 1.4s.

**Persistence:**
- `localStorage('hkj_os.booted')` set on boot completion
- Subsequent visits in the same browser skip the boot sequence; desktop appears immediately
- "Reset" command re-runs boot

**Reduced motion:** instant boot — text appears, menu bar / dock / Finder appear simultaneously, no fades.

**Reduced data:** wallpaper poster instead of video; rest unchanged.

---

## Mobile fallback — `/classic`

Viewports ≤720px (touch devices) cannot reasonably operate windowed UI. Two-layer redirect strategy:

### Layer 1 — Edge middleware (Next.js `middleware.ts`)

Cheap, no flash. Sniffs `User-Agent` for known mobile patterns (`iPhone`, `Android`, `Mobile`). If matched and request path is `/`, rewrites to `/classic`. This catches the bulk of mobile traffic at the edge before any HTML is generated.

```ts
// middleware.ts (sketch — implementer to refine the UA list)
export function middleware(req: NextRequest) {
  const ua = req.headers.get("user-agent") ?? "";
  const isMobileUA = /iPhone|Android.*Mobile|Mobile/i.test(ua);
  const path = req.nextUrl.pathname;
  if (isMobileUA && path === "/") {
    return NextResponse.rewrite(new URL("/classic", req.url));
  }
}
```

### Layer 2 — Client-side detection fallback

For ambiguous cases the UA can't catch (laptops with touchscreens, iPad in desktop mode, Surface devices). An init script in root layout:

```js
const coarse = window.matchMedia("(pointer: coarse)").matches;
const narrow = window.innerWidth <= 720;
const onHome = window.location.pathname === "/";
if (onHome && (coarse && narrow)) {
  // Both signals required — coarse-pointer alone (laptop touchscreen)
  // does NOT redirect; need narrow viewport too.
  window.location.replace("/classic");
}
```

### Edge cases handled

- **Laptop with touchscreen** (coarse-pointer + wide viewport): stays on `/` (OS). Both signals required for client redirect.
- **iPad landscape** (>720px + coarse-pointer): stays on `/` (OS). The viewport check protects this.
- **iPad portrait** (≤720px + coarse-pointer): redirects to `/classic`. Correct.
- **Crawlers / bots** (UA not matching mobile patterns): served `/` HTML by middleware, but `/` is JS-heavy. SEO-critical content lives at `/classic` URLs (`/classic/work/gyeol`, etc.) which are server-rendered — sitemap points to those.

### User overrides

Query string overrides for debugging and user choice:
- `?force=os` on `/classic` → redirect to `/` with cookie `hkj_force=os` (bypasses both layers)
- `?force=classic` on `/` → redirect to `/classic` with cookie `hkj_force=classic`
- Cookies last 30 days; user can clear cookies to reset

### Deep-linked URLs

Routes work on both surfaces:
- `/work/[slug]` — on `/`, opens as `ProjectWindow` (URL becomes `/?app=project&slug={slug}` after hydration); on `/classic`, renders as full page
- `/notes/[slug]` — same pattern, opens in `Notes` app on `/`, full page on `/classic`
- The OS surface hydrates window state from URL query string on first load (deep-link → window opens)

This means **all prior implementation work has a home**. The OS direction doesn't waste any of it.

---

## Phased rollout

Each phase ships independently. Earlier phases must remain working when later phases land.

**Implementation note: this spec decomposes into three plans, not one.** A single 12-component / 6-phase implementation plan is too large for the writing-plans skill to produce a usable document. The phases group into three discrete plans:

1. **Plan A — Foundation + classic split** (Phase 1): desktop chrome + middleware + `/classic` route migration. Self-contained, ships a working but minimal site.
2. **Plan B — Window primitive + apps** (Phases 2 + 3): `<Window>`, `useWindowManager`, all 5 apps. Depends on A's surfaces; delivers all interactive apps.
3. **Plan C — Boot + polish + cloudscape** (Phases 4 + 5 + 6): boot sequence, animations, Terminal (deferred), real asset acquisition. Depends on B; mostly polish.

Each plan goes through the standard write → review → user-approve → execute cycle independently. Plan B does not start until Plan A is shipped to disk (not necessarily live, but committed). Plan C similarly waits on B.


### Phase 1 — Desktop foundation (non-interactive shippable state)

**Deliverable:** the desktop visually renders with all chrome but no apps function. This is an intentionally non-interactive shippable state — it answers "does the visual register land?" before investing in window machinery.

- Create `src/app/page.tsx` rewrite: server-renders `<Desktop>` only (no apps yet)
- Build `<CloudscapeWallpaper>` consuming the placeholder JPEG (`public/assets/cloudscape-placeholder.jpg`)
- Build `<MenuBar>` with brand mark + theme toggle + live time
- Build `<Dock>` with all 5 app glyphs (no functional click handlers — clicks are no-op or log to console)
- Move existing aino+hs68 home to `/classic` (full implementation of the framework doc)
- Build edge middleware (`middleware.ts`) for mobile UA redirect to `/classic`
- Build client-side fallback redirect (init script) for ambiguous devices
- Add `?force=os` / `?force=classic` query-string overrides + cookie machinery

**Verify:**
- Desktop renders with cloudscape + menu bar + dock visible
- Theme toggle in menu bar flips theme on `<html>` (existing `useTheme` behavior)
- Live time in menu bar ticks each second
- `/classic` renders the aino+hs68 framework correctly
- Mobile UA → `/classic` redirect works (test with curl + UA spoofing)
- Mobile viewport (<720px) + coarse-pointer → `/classic` redirect works (test in DevTools device emulation)
- Laptop with simulated touchscreen (coarse-pointer + wide viewport) stays on `/`
- Force overrides work both directions
- Type check, lint, build, all tests pass (count unchanged from prior baseline)

### Phase 2 — Window primitive + Finder

- Build `<Window>` primitive (title bar, close, drag, fixed dimensions)
- Build `useWindowManager` hook + tests
- Build `<Finder>` app
- Wire dock-click to open Finder
- Persist window state to localStorage
- Verify: Finder opens, drags, closes, persists across reload

### Phase 3 — ProjectWindow + remaining apps (Notes, Bookmarks, Studio)

- Build `<ProjectWindow>` (wraps existing `CaseStudy`)
- Wire Finder file double-click to open ProjectWindow
- Build `<Notes>`, `<Bookmarks>`, `<Studio>` apps
- Wire dock-click for each app
- Verify: all 5 apps open, render content correctly, persist state, drag works

### Phase 4 — Boot sequence

- Repurpose `usePreloaderState` → `useBootState`
- Build `<BootSequence>` — ASCII text + cloudscape fade-in + finder auto-open
- Wire init script to gate boot vs immediate-desktop on `localStorage('hkj_os.booted')`
- Verify: first visit boots; subsequent visits skip; reset replays

### Phase 5 — Polish + Terminal (optional)

- Window focus state visual polish (active vs inactive chrome)
- Window-open animation (scale-up from dock position, 240ms)
- Window-close animation (scale-down, 200ms)
- Build optional Terminal app with command set
- Final accessibility pass

### Phase 6 — Asset acquisition + Cloudscape video

- Acquire/produce cloudscape video (real long-exposure footage; ≤2MB `.webm` + poster fallback)
- Replace placeholder cloudscape with real asset
- Final verification: Core Web Vitals not regressed; mobile fallback works; all routes accessible

---

## Persistence keys

Single namespace table for all localStorage keys.

| Key | Set by | Purpose | Migration note |
|---|---|---|---|
| `hkj.theme` | `useTheme` (existing) | Theme preference (`"light" \| "dark"`) | Predates OS rollout — kept un-namespaced for continuity with `/classic` |
| `hkj_os.booted` | `usePreloaderState` (renamed key) | Boot sequence completed flag | Migrated from `hkj.preloader.dismissed`; old key deleted on first OS load if found |
| `hkj_os.windows` | `useWindowManager` | Open windows + positions + z-stack | New key |
| `hkj_force` | Cookie set by `?force=os/classic` overrides | User-pinned route preference, 30-day expiry | New key, cookie not localStorage |

The split between `hkj.*` (theme — predates OS) and `hkj_os.*` (OS-specific) is intentional. Theme preference is shared between `/` and `/classic`; OS-specific state belongs only to `/`.

## Routing table

Deep-link behavior on both surfaces.

| URL | `/` (OS) | `/classic` (editorial) |
|---|---|---|
| `/` | Desktop with Finder auto-open (first visit), or restored window state (return visit) | Redirected here from mobile / forced |
| `/classic` | (n/a) | Editorial home (aino+hs68 framework) |
| `/work/[slug]` | Hydrates desktop + auto-opens that piece's `ProjectWindow` | Renders the case study as a full page |
| `/notes/[slug]` | Hydrates desktop + auto-opens `Notes` app with that essay selected | Renders essay as a full page |
| `/studio` | Hydrates desktop + auto-opens `Studio` app | Renders studio page directly |
| `/bookmarks` | Hydrates desktop + auto-opens `Bookmarks` app | Renders shelf as a full page |

URL → window-state hydration on `/`: an init script reads `window.location.pathname`. If it matches `/work/[slug]` etc., the window manager's initial state opens the corresponding window pre-positioned at center, in addition to (or instead of) Finder auto-open.

Crawlers and SEO: sitemap.xml lists `/classic/*` URLs as canonical for content. `/` is the visual experience; `/classic` is the indexable surface. `<link rel="canonical" href="/classic/work/gyeol">` on the OS surface points crawlers to the editorial version.

## Accessibility

Windowed UI has accessibility implications the spec must address explicitly.

### Keyboard

- **Tab** moves focus between interactive elements within the focused window (standard behavior)
- **Shift+Tab** reverse-focus (standard)
- **Esc** closes the focused window (in addition to clicking the `×` button)
- **Cmd+`** (or **Ctrl+`** on non-Mac) cycles focus between open windows in `lastFocusedAt` order
- **Cmd+W** (or **Ctrl+W**) closes the focused window — same as Esc
- Arrow keys: nothing global; let individual app components define behavior (e.g., Finder uses arrows to navigate file rows)

### Screen reader semantics

- Each window: `role="dialog"` with `aria-labelledby` pointing to the title-bar text element
- Title bar text is the accessible name; the close button has `aria-label="Close {appName}"`
- Dock is a `<nav aria-label="Apps">`; each item is a `<button>` (not a link) since opening an app is a state change, not navigation
- Menu bar is a `<header>` with brand link + utility `<nav aria-label="System">`
- Cloudscape wallpaper is `<div aria-hidden="true">` — purely decorative
- Active window has `aria-modal="false"` (not modal — the user can interact with other open windows)

### Focus management

- Opening a new window moves keyboard focus into that window (the body, or first focusable element)
- Closing a window returns focus to the dock item that opened it (or the previously-focused window if open)
- Dragging does NOT change focus (only `pointerdown` on the title bar focuses)
- `focus-visible` outlines on all interactive elements at `1px var(--ink)` with `outline-offset: 2px`

### Reduced motion / data

Already covered in §Cloudscape and §Boot sequence. Confirm:
- `prefers-reduced-motion: reduce` → instant boot, no window-open/close animations, video paused on first frame
- `prefers-reduced-data: reduce` → no `.webm` request, poster image only

## Verification criteria

- **V1:** No new design tokens. `--paper`, `--ink-*`, `--microtype-tracking` carry forward.
- **V2:** No raster icons anywhere. All app icons are typographic glyphs (◇ ✎ ◑ ⊕ ⌧).
- **V3:** No drop shadows on windows. Separation comes from hairlines + wallpaper contrast.
- **V4:** No window resizing. Each app has fixed dimensions.
- **V5:** No more than 5 simultaneous windows.
- **V6:** Cloudscape wallpaper loads only on viewports >720px AND with `prefers-reduced-data` not set; otherwise poster fallback.
- **V7:** Mobile (≤720px or `pointer: coarse`) redirects to `/classic`.
- **V8:** `/classic` route preserves the aino+hs68 editorial framework with `WorkPlate`/`WorkList`/`ViewToggle` etc.
- **V9:** Boot sequence runs only on first session-load; subsequent visits go straight to desktop.
- **V10:** Window state persists in `localStorage('hkj_os.windows')`. Reload restores positions + open apps.
- **V11:** Reduced motion: instant boot, no window-open animations, video wallpaper paused on first frame.
- **V12:** Reduced data: wallpaper static poster only, no `.webm` request.
- **V13:** Theme toggle in MenuBar flips theme; persisted in `localStorage('hkj.theme')` (existing behavior).
- **V14:** Existing unit tests pass with adjustments. The 19 tests baseline shifts as components migrate:
  - `useTheme` (5 tests) — carry forward unchanged
  - `useHomeView` (5 tests) — moves to `/classic` route; tests still pass against the components there
  - `usePreloaderState` (3 tests) — carry forward; one test updated for new storage key (`hkj_os.booted`)
  - `ScrambleText` (6 tests) — carry forward unchanged
  - **New tests target ≥5** for `useWindowManager` (open/close, focus, drag-position update, 5-window cap eviction, persistence round-trip)
  - **Total target after Phase 2:** ≥24 tests passing

---

## Risks

**Time investment.** 4–8 weeks realistic. Vibe-coded with Cursor/Claude, 2–4 weeks if disciplined. Real risk if scope creeps (Music app, Calculator, ASCII clock, etc.).

**Mobile fallback is real work.** Building `/classic` properly = the aino+hs68 framework gets actually implemented (it currently exists as a doc but the home redirected away from it). Estimate: 1 week.

**Cloudscape asset.** Real long-exposure cloud footage isn't trivial — either shoot it (1 day if conditions cooperate, can take weeks if not) or license stock (~$200). Risk: ships without asset, looks broken until asset lands.

**The "OS-portfolio is derivative" critique.** Many exist. Defense: HKJ_OS uses HKJ's authored taste system applied to OS chrome, not Mac/Win mimicry. The cloudscape + microtype-only icons + warm-paper register make it visually distinct. Whether this lands depends on execution quality.

**Performance.** Multiple simultaneous open windows + cloudscape video + theme switching = real frame budget. Mitigations: cloudscape opacity overlay (so video can be lower resolution); window count cap at 5; React 19's new compiler optimizations.

**SEO.** OS-portfolios are JS-heavy. Crawlers won't see content inside windows. Mitigation: `/classic` route is fully server-rendered with all content; sitemap points to `/classic` URLs (`/classic/work/gyeol`, `/classic/notes/[slug]`, etc.). `/` becomes the visual experience; `/classic` is the indexable surface.

**The third pivot of the layout direction.** This is now the third major layout direction explored in this rollout (Stage→monograph, monograph→aino-hs68, aino-hs68→OS). Risk: pivot fatigue, partial implementations stacking up. Mitigation: this spec is committed to as canonical; aino-hs68 framework explicitly preserved as `/classic`; nothing prior gets fully abandoned.

---

## Open question for user

One genuinely open decision remains.

**Cloudscape video source — three options:**

- **(A)** User shoots / supplies real long-exposure footage (best fit, takes time)
- **(B)** License from a stock library (~$200, ships sooner)
- **(C)** AI-generate via Runway/Sora (free or low-cost, but generative cloud loops can look uncanny)

Recommendation: **A** if the user has time; **B** otherwise. Avoid C for the home wallpaper — too important to feel synthetic. This is the only decision the implementation cannot proceed without — the placeholder JPEG ships in Phase 1 and the real asset swaps in Phase 6.

### Resolved (lifted from prior open questions)

- **Dock position:** locked to **left, vertical**. Mirrors aino's left-aligned brand mark, gives the desktop more horizontal real estate for windows.
- **First-open default:** locked to **Finder auto-opens** after boot. Visitors see work immediately; no make-them-click-first friction.
- **Terminal app:** locked to **skip in v1**. Removed from initial Dock. Can be added in a later phase if desired without disrupting the rest.
- **Placeholder behavior:** locked to **stub `ProjectWindow`** with "Coming." message — see §Apps / ProjectWindow.

---

## Locked in this spec

- HKJ_OS becomes the operative direction for `/`
- Aino+hs68 framework preserved at `/classic` for mobile and SEO
- No raster icons; typographic glyphs only
- No drop shadows; hairline separators
- No resizing; fixed window dimensions per app
- 5-window cap (oldest closes when 6th opens)
- Cloudscape wallpaper as the single signature visual move
- Cursor stays default (no custom pixel cursor)
- Existing theme system, content models, and 19 tests carry forward
- Phase 6 ASCII preloader infrastructure repurposed as boot sequence
- All retired-component lists from prior specs remain retired

---

## File location & lifecycle

This document lives at `docs/superpowers/specs/2026-05-05-hkj-os-design.md` and is the **canonical layout direction** going forward. Implementation specs and plans (in `docs/superpowers/plans/`) reference and conform to this doc.

The aino+hs68 framework doc at `docs/superpowers/specs/2026-05-02-aino-hs68-framework.md` is **preserved as the spec for the `/classic` mobile fallback route** — it does not become stale; it governs that surface.

When this framework changes, this doc gets amended with a dated section noting what shifted and why. The framework should not silently drift.

---
