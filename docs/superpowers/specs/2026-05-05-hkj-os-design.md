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

Fixed-position `<video>` (or `<picture>` with poster fallback) element at z-index 0, behind all OS content.

- Source: long-exposure cloudscape video, ~10s seamless loop, ≤2MB compressed `.webm`
- Treatment: full-bleed cover, slight `filter: saturate(0.85) contrast(0.95)` for restraint
- Overlay: `var(--paper)` at 30–40% opacity layered on top so the cloudscape reads as ambient atmosphere, not foreground
- Theme-responsive: same video, but the overlay color flips per theme (warm paper overlay in light mode; warm dark overlay in dark mode)
- `prefers-reduced-motion`: video pauses on first frame
- `prefers-reduced-data`: video not loaded; static poster only

The cloudscape is the SINGLE most distinctive visual choice. It's what makes HKJ_OS feel like HKJ_OS and not just any custom-OS portfolio.

---

## Components — full inventory

### New (this direction adds)

| Component | Path | Responsibility |
|---|---|---|
| `<BootSequence>` | `src/components/os/BootSequence.tsx` | Renders on first session-load. ASCII text loader, then fades to desktop. Uses existing `usePreloaderState` hook (renamed conceptually to "boot state"). |
| `<Desktop>` | `src/components/os/Desktop.tsx` | Top-level container. Renders cloudscape wallpaper, menu bar, dock, and active windows. |
| `<CloudscapeWallpaper>` | `src/components/os/CloudscapeWallpaper.tsx` | Fixed-position video/poster element. Theme-aware overlay. |
| `<MenuBar>` | `src/components/os/MenuBar.tsx` | Top fixed bar. Brand mark left, live time + theme toggle right. |
| `<Dock>` | `src/components/os/Dock.tsx` | Left or bottom (desktop choice TBD per Phase 1 prototype). Renders app glyphs as launchers. |
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

`useWindowManager` hook governs all window state.

**State shape:**
```ts
type WindowId = "finder" | "notes" | "bookmarks" | "studio" | "terminal" | `project-${string}`;

type WindowState = {
  id: WindowId;
  position: { x: number; y: number };
  zIndex: number;
  isFocused: boolean;
};

type WindowManagerState = {
  windows: Record<WindowId, WindowState>;
  zCounter: number;  // monotonic increment for z-stack
  focusedId: WindowId | null;
};
```

**Operations:**
- `openWindow(id, openerPosition?)` — adds a window if not present; brings to front; focuses
- `closeWindow(id)` — removes from open list
- `focusWindow(id)` — brings to front; updates focus
- `moveWindow(id, position)` — updates position during drag
- `reset()` — closes all windows, returns to bare desktop

**Persistence:**
- Window state persisted to `localStorage('hkj_os.windows')` on every state change (debounced 200ms)
- On boot, init script reads localStorage and restores the prior session's open windows + positions
- "Reset" command (or query string `?reset=1`) clears the persisted state

**Initial state on first-ever visit:**
- Boot sequence runs (~1.5s)
- Boot ends → Finder opens centered automatically
- No other windows open

**Z-stack:**
- Most recently focused window has highest z-index
- Click any window's title bar = brings to front
- z-counter monotonically increments to avoid collisions

**Stop rule:**
- Maximum 5 simultaneous windows. Opening a 6th = oldest is closed automatically.
- Prevents the desktop from becoming a graveyard of forgotten windows.

---

## Boot sequence

Reuses Phase 6 preloader infrastructure. Renamed conceptually to "boot."

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

Viewports ≤720px (touch devices) cannot reasonably operate windowed UI. Strategy:

1. The aino+hs68 editorial framework lives at the route `/classic`
2. A middleware redirect: if request is from a touch device OR viewport-width ≤720px, redirect `/` → `/classic`
3. Deep-linked URLs (`/work/[slug]`, `/notes/[slug]`, etc.) work on both — they render the same content; OS wraps them in a window, classic renders them as full pages
4. The `/classic` route uses ALL the prior components: `WorkPlate`, `WorkList`, `ViewToggle`, etc. They survive there.

**Detection logic** (init script in root layout):
```js
const isTouch = window.matchMedia("(pointer: coarse)").matches;
const isNarrow = window.innerWidth <= 720;
if (isTouch || isNarrow) {
  // already on /classic? do nothing.
  // on /? redirect to /classic.
}
```

This means **all prior implementation work has a home**. The OS direction doesn't waste any of it.

---

## Phased rollout

Each phase ships independently. Earlier phases must remain working when later phases land.

### Phase 1 — Desktop foundation

- Create `src/app/page.tsx` rewrite: server-renders `<Desktop>` only (no apps yet)
- Build `<CloudscapeWallpaper>` (placeholder asset accepted)
- Build `<MenuBar>` with brand mark + theme toggle + live time
- Build `<Dock>` with all 5 app glyphs, no functional click handlers yet
- Move existing aino+hs68 home to `/classic`
- Add middleware redirect for touch/mobile
- Verify: desktop renders with wallpaper + menu bar + dock; clicking dock items does nothing yet (or alert)

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
- **V14:** All 19 existing unit tests pass; new `useWindowManager` tests added (target 5+).

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

## Open questions for user

These are content/scope decisions only the user can make.

1. **Dock position — left side or bottom?** Both are valid. Bottom = Mac-coded, left = Windows/Linux-coded. Since we're avoiding direct OS mimicry, the choice becomes purely aesthetic. Recommendation: **left**, vertical, because it mirrors aino's left-aligned brand mark and gives the desktop more horizontal real estate for windows.

2. **First-open default — Finder or empty desktop?** When boot completes, does Finder auto-open (showing work immediately) or does the user see an empty desktop with the dock visible (must click to enter)? Recommendation: **Finder auto-opens** — visitors should see work, not be made to click first.

3. **Cloudscape video source.** Three options:
   - **(A)** User shoots / supplies real long-exposure footage (best fit, takes time)
   - **(B)** License from a stock library (~$200, ships sooner)
   - **(C)** AI-generate via Runway/Sora (free or low-cost, but generative cloud loops can look uncanny)
   Recommendation: **A** if the user has time; **B** otherwise. Avoid C for the home wallpaper — too important to feel synthetic.

4. **Terminal app — Phase 5 or skip entirely?** Adds power-user appeal but real maintenance cost (commands need to actually work). If skipped, the Terminal glyph is removed from the dock. Recommendation: **skip in v1**; add later if desired.

5. **Project Window for placeholders.** Untitled placeholders (`untitled-01` etc.) — when double-clicked in Finder, do they open a "Coming soon" stub window or do nothing? Recommendation: **stub window** with a coming-soon message and the placeholder microtype.

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
