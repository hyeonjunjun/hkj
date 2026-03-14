# Spotify-Inspired Homepage Redesign

**Date:** 2026-03-13
**Status:** Design Approved
**Scope:** Homepage rewrite — single-page app shell with typographic project index, Now Playing panel, and media player bar

---

## 1. Overview

Replace the current homepage (HeroToGridSection / ProjectListView toggle) with a Spotify Desktop-inspired single-page app shell. The gallery IS the homepage — no separate landing page. The preloader fades directly into the gallery.

**References:**
- [ethanandtom.com](https://www.ethanandtom.com/) — Index/Selects typographic toggle, video thumbnails in rows
- Spotify Desktop — Now Playing side panel, playlist library layout, bottom media player bar

**Core metaphor:** The portfolio is a playlist. Projects are tracks. The Now Playing panel shows what's selected. The player bar controls navigation.

---

## 2. Architecture: Single-Page App Shell

The homepage is a persistent layout with three zones. Views swap via AnimatePresence — no page routing between Index/Selects/Info.

```
+--------------------------------------------------+
|  GlobalNav  [HKJ]   Index  Selects  Info    [=]  |
+--------------------------------------------------+
|                                    |              |
|   Main Content Area                | Now Playing  |
|   (Index / Selects / Info)         | Panel        |
|                                    | (380px)      |
|                                    |              |
+--------------------------------------------------+
|  >  |<  >|   Project Title         ===*=====  2/4|
|            Player Bar (56px fixed bottom)         |
+--------------------------------------------------+
```

**No routing between views.** Index, Selects, and Info are component swaps within the same page. The panel and player bar are persistent chrome.

---

## 3. Hero Section

A system identification block at the top of the Index and Selects views. Matches the Nothing OS / Teenage Engineering aesthetic.

```
                    HKJ STUDIO
                    ----------
                    DESIGN ENGINEERING
                    NYC & SEOUL

                    SYS.PORTFOLIO v2.0
                    4 PROJECTS LOADED
                    2 IN DEVELOPMENT
```

- Monospace-heavy, centered, generous letter-spacing
- Grid background (existing `grid-lines` utility)
- Height: ~40vh
- "4 PROJECTS LOADED / 2 IN DEVELOPMENT" is a live count derived from `PROJECTS` array length and ghost count
- Entrance: GSAP stagger on each line after preloader completes (existing pattern)

---

## 4. Index View (Default)

Single-column typographic list. Each row represents a project.

### Row layout

```
| [01]  SIFT: DIGITAL SANCTUARY                    |
|       Mobile . AI -- 2025                         |
|----------------------------------------------------|
```

- Full-width rows, ~80-100px height, 1px hairline dividers between rows
- Number: mono `[01]`, dim
- Title: display font, uppercase
- Meta: `sector -- year`, mono, dim
- Hover: background shifts to `rgba(0,0,0,0.03)`, 1px left accent border appears, cursor changes to "project" context
- Click: opens Now Playing panel + sets player bar active project

### Ghost rows

Two ghost rows at positions 5 and 6:

```
| [05]  ################                            |
|       ??? -- 2026                                  |
|       in development                               |
|----------------------------------------------------|
| [06]  ####################                         |
|       ??? -- 20??                                   |
|       maybe the idea will come soon                |
|----------------------------------------------------|
```

- Title: Unicode block characters (randomized width), dim opacity
- Sector: `???` mono
- Year: `2026` / `20??`
- Tagline: italic, dim, unique per ghost
- No click handler, no hover state, no cursor context change
- Player bar skips ghosts when using prev/next

---

## 5. Selects View

Same rows as Index with a thumbnail column added.

### Thumbnail specs

- Size: 160x100px (16:10 aspect), overflow hidden, 2px border-radius
- Position: left of title text
- Static projects: hero image, grayscale-to-color on row hover
- Projects with videos: first video clip, muted autoplay loop
- Video focus rule: only the video closest to viewport center plays (IntersectionObserver, `rootMargin: "-40% 0px -40% 0px"`); others show poster frame
- Ghost rows: 160x100 rectangle with CSS noise grain texture
- Row height increases to ~120-140px to accommodate thumbnails

### Index-to-Selects transition

- Thumbnail column slides in from left (translateX -40px to 0, staggered per row)
- Row height animates from ~80px to ~120px
- Text content stays in place

---

## 6. Info View

Replaces the current AboutOverlay. Renders inline in the main content area when "Info" is selected in nav.

- Editorial layout: serif italic headline, capabilities list, contact info
- Reuses content from current AboutOverlay + ContactOverlay
- Same warm typographic gallery aesthetic
- No panel interaction in this mode
- ContactOverlay remains accessible from Info view as a link/CTA

---

## 7. Now Playing Panel

Side panel that shows project summary when a row is clicked.

### Content (maps to Project interface)

```
X -------------------------

  [01]
  SIFT: DIGITAL SANCTUARY

  -------------------------

  CLIENT    HKJ Studio
  ROLE      Design & Eng
  SECTOR    Mobile . AI
  YEAR      2025
  -------------------------

  "Curate your digital
   diet. A digital
   sanctuary that..."       <- project.pitch

  -------------------------

  STACK
  React Native
  Supabase
  GPT-4o
  -------------------------

  TAGS
  Digital Sanctuary
  UX of AI
  React Native
  -------------------------

  [ VIEW CASE STUDY -> ]   <- links to /work/[slug]
```

- Width: 380px
- 1px left border (no shadow)
- Background: same as page bg
- Close: minimal X top-right, mono
- Typography: spec table uses mono labels + sans values (TE hardware spec sheet pattern)

### Responsive behavior

| Breakpoint | Panel behavior |
|---|---|
| >= 1280px | Push main content left, 380px panel |
| 1024-1279px | Overlay with backdrop dim, 380px |
| 768-1023px | Bottom sheet, 60vh height |
| < 768px | Navigate directly to `/work/[slug]` |

### Interaction model

- Click row: opens panel with that project (or closes if same row clicked again)
- Click different row while panel open: crossfade panel content (AnimatePresence mode="wait")
- Click outside (overlay/sheet modes): closes panel
- "View Case Study" link: navigates to `/work/[slug]`

---

## 8. Player Bar

Fixed bottom media control bar. Part of the app shell chrome.

### Layout

```
+------------------------------------------------------+
|  >  |<  >|    SIFT: DIGITAL SANCTUARY    ====*====   |
|              Mobile . AI -- 2025            2 / 4     |
+------------------------------------------------------+
```

- Height: 56px desktop, 48px mobile
- Background: 1px top border separating from content
- Left zone: play/pause (toggles all video autoplay globally), prev/next skip buttons
- Center zone: active project title (display) + sector/year (mono, dim)
- Right zone: progress indicator "2 / 4" (mono), thin accent progress line at top of bar
- Page content needs `padding-bottom: 56px` to prevent overlap

### Visibility

- Hidden on initial page load
- Slides up (translateY 100% to 0, 400ms, power3.out) on first row click
- Stays visible for the rest of the session

### Skip behavior

- Next/prev cycles through real projects only (skips ghosts)
- Sets `activeProject` in store, updates panel if open
- Scrolls active row into view via Lenis `scrollTo(targetRow, { offset: -100, duration: 1.2 })`
- Wraps: after last project, goes to first

### Mobile

- Simplified: play/pause icon + truncated title + "2/4" counter
- No skip buttons (tap rows directly)

---

## 9. Preloader Handoff

The existing StudioPreloader (image cycling box -> viewport fill) runs as-is. On completion:

1. Preloader opacity fades to 0 (300ms)
2. Index view is rendered beneath with hero section
3. Hero lines entrance via GSAP stagger (600ms, stagger 0.08)
4. Player bar remains hidden until first interaction
5. Panel closed on initial load
6. `isLoaded = true` set in store

No changes to StudioPreloader component.

---

## 10. Nav Integration

### Desktop GlobalNav

Add `Index | Selects | Info` links to the existing nav bar. These function as view switchers (not route links).

- Active view has underline indicator (existing spring underline pattern)
- Clicking active view is a no-op
- Links use `setActiveView()` from store

### Mobile Menu

Index/Selects/Info links added to the existing MobileMenu as numbered menu items. Clicking sets the active view and closes the menu.

---

## 11. Animation Specs

| Transition | Type | Duration | Easing |
|---|---|---|---|
| Index to/from Selects | Thumbnail slide in/out + row height | 400ms | power3.inOut |
| Index/Selects to/from Info | AnimatePresence crossfade (opacity + y:20) | 500ms | [0.16, 1, 0.3, 1] |
| Panel open | translateX(100% to 0) + main content width shrink | 500ms | power3.out |
| Panel close | Reverse of open | 400ms | power3.in |
| Panel content swap | AnimatePresence mode="wait", opacity crossfade | 300ms | linear |
| Player bar entrance | translateY(100% to 0) | 400ms | power3.out |
| Row hover | background-color transition | 200ms | ease |
| Preloader to gallery | opacity 1 to 0 | 300ms | ease |
| Hero lines entrance | GSAP stagger, y:20 to 0, opacity | 600ms stagger 0.08 | power3.out |

---

## 12. Lenis Integration

- Panel push: when panel opens/closes, main content width animates. Call `lenis.resize()` after transition completes (500ms timeout or `onTransitionEnd`)
- Player bar: fixed position, does not affect scroll height. Page content uses `padding-bottom: 56px`
- Skip/scroll: player bar prev/next uses `lenis.scrollTo()` to smoothly scroll the active row into view

---

## 13. State Management

Additions to the Zustand store (`src/lib/store.ts`):

```typescript
activeView: "index" | "selects" | "info"
setActiveView: (view: "index" | "selects" | "info") => void
activeProject: string | null          // project id for panel + player
setActiveProject: (id: string | null) => void
isPanelOpen: boolean
setIsPanelOpen: (open: boolean) => void
isPlaying: boolean                    // global video play/pause state
togglePlayback: () => void
playerVisible: boolean                // player bar has been revealed
setPlayerVisible: (v: boolean) => void
```

Existing state that can be removed:
- `viewMode` (replaced by `activeView`)
- `gridRevealed` (no longer needed without HeroToGridSection)

---

## 14. Component Breakdown

### New components

| Component | Responsibility |
|---|---|
| `AppShell.tsx` | Layout wrapper: nav, main area, panel slot, player bar slot. Handles panel push/overlay logic per breakpoint. |
| `ProjectIndex.tsx` | Index view: hero block + typographic list of ProjectRow/GhostRow components |
| `ProjectSelects.tsx` | Selects view: hero block + rows with video/image thumbnails |
| `InfoView.tsx` | Inline about + contact content (replaces AboutOverlay) |
| `NowPlayingPanel.tsx` | Side panel with project specs and "View Case Study" link |
| `PlayerBar.tsx` | Fixed bottom bar: play/pause, prev/next, project info, progress |
| `ProjectRow.tsx` | Shared row component used by both Index and Selects. Props control whether thumbnail is shown. |
| `GhostRow.tsx` | Redacted "in development" row. No interactivity. |

### Modified components

| Component | Changes |
|---|---|
| `GlobalNav.tsx` | Add Index/Selects/Info view links with active underline |
| `MobileMenu.tsx` | Add view links as numbered menu items |
| `store.ts` | Add new state (activeView, activeProject, isPanelOpen, isPlaying, playerVisible). Remove viewMode, gridRevealed. |
| `page.tsx` | Rewrite to render AppShell |

### Archived/removed

| Component | Action | Reason |
|---|---|---|
| `HeroToGridSection.tsx` | Archive | Replaced by ProjectIndex |
| `ProjectGridView.tsx` | Archive | Already reference-only |
| `ViewModeToggle.tsx` | Remove | Replaced by nav links |
| `AboutOverlay.tsx` | Remove | Replaced by InfoView |

### Unchanged

StudioPreloader, Cursor, ContactOverlay, TransitionOverlay, SmoothScroll, all case study components, all hooks, all constants, globals.css, ProjectListView (archived as reference).

---

## 15. Mobile Responsive Summary

| Breakpoint | Nav | Content | Panel | Player Bar |
|---|---|---|---|---|
| >= 1280px | Full bar + view links | Full width (pushed when panel open) | 380px push | Full controls |
| 1024-1279px | Full bar + view links | Full width | 380px overlay + dim | Full controls |
| 768-1023px | Hamburger + mobile menu | Full width | Bottom sheet 60vh | Simplified |
| < 768px | Hamburger + mobile menu | Single column | Navigate to /work/[slug] | Icon + title + counter |

---

## 16. Risks and Mitigations

| Risk | Mitigation |
|---|---|
| Panel push + Lenis scroll conflict | Call `lenis.resize()` after panel transition completes |
| Multiple simultaneous video playback | Single-focus-video: only viewport-center video plays |
| Vertical emptiness (7 rows only ~490px) | ~40vh hero section provides visual weight |
| Player bar overlapping footer content | `padding-bottom: 56px` on page content when bar is visible |
| Mobile bottom sheet + player bar overlap | Bottom sheet sits above player bar (higher z-index) |

---

## 17. Implementation Notes

These are clarifications surfaced during spec review:

- **Navigation constants:** `src/constants/navigation.ts` needs updating. The `NAV_LINKS` array and `NavLink` interface must support view-switching (Index/Selects/Info) alongside the existing overlay pattern (ContactOverlay). Plan this as part of the GlobalNav modification.
- **activeOverlay + activeView interaction:** When the user is on InfoView and opens ContactOverlay, `activeView` stays `"info"` and `activeOverlay` becomes `"contact"`. The existing overlay system supports this without changes.
- **Footer CTA removal:** The current "LET'S work together" footer CTA section is removed. Contact flow moves to InfoView (which links to ContactOverlay).
- **activeSection cleanup:** The existing `activeSection` store field may become dead code. Audit during implementation and remove if unused.
