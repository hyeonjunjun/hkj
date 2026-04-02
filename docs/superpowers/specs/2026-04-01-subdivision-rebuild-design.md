# HKJ Studio — Subdivision-Style Full Rebuild

> Design spec for restructuring the entire site around Subdivision's mechanical, border-constructed aesthetic.
> April 1, 2026.

---

## Context

The current site has a headline + 3-column image card grid — structurally a standard portfolio with surface polish. The goal is a fundamental restructuring of layout, motion, and content hierarchy modeled on subdivision.work's mechanical precision. This is not a reskin — it's a rebuild of how the site presents, animates, and transitions.

**Primary reference:** subdivision.work (border-drawing construction, technical grid, dark-first)
**Supporting references:** lovably.com (dense visual grid for toggle view), bodeyco.com (full-background image on hover), newapology.com (editorial restraint)

---

## Decisions Made

| Decision | Choice |
|----------|--------|
| Homepage default | Typographic list (Subdivision-style) |
| Alternative view | Lovably-style visual grid (toggle) |
| Entrance choreography | Border-drawing construction (lines draw, content staggers in) |
| Row structure | Grid columns: number / title / tags / year |
| Hover behavior | Project image takes over full background behind list |
| Color mode | Dark default with light toggle |
| Page transitions | Subdivision-style: dissolve out, new page constructs itself |
| Scope | Full rebuild — all pages adopt new system |

---

## 1. Color System

Dark-first with warm tint. Light mode via toggle, persisted to `localStorage`.

### Dark (default)

```css
--bg:   #0a0a09;
--fg:   rgba(245, 245, 240, 1.00);    /* primary text */
--fg-2: rgba(245, 245, 240, 0.50);    /* secondary */
--fg-3: rgba(245, 245, 240, 0.22);    /* muted — metadata, borders */
--fg-4: rgba(245, 245, 240, 0.08);    /* ghost — row dividers */
--fg-5: rgba(245, 245, 240, 0.04);    /* whisper — subtle dividers */
```

### Light

```css
--bg:   #f7f6f3;                       /* warm paper */
--fg:   rgba(35, 32, 28, 0.82);
--fg-2: rgba(35, 32, 28, 0.50);
--fg-3: rgba(35, 32, 28, 0.22);
--fg-4: rgba(35, 32, 28, 0.08);
--fg-5: rgba(35, 32, 28, 0.04);
```

### Shared variables (both modes)

```css
--ease: cubic-bezier(0.16, 1, 0.3, 1);
--pad:  clamp(24px, 4vw, 48px);
--font-body:    var(--font-sans), system-ui, sans-serif;
--font-mono:    var(--font-fragment), "SF Mono", monospace;
--font-display: var(--font-serif), Georgia, serif;
```

No time-based auto-switching. Toggle only. The theme script in `layout.tsx` must be updated to remove time-based logic and default to dark.

---

## 2. Typography

Three fonts, three roles. No exceptions.

| Role | Font | Size | Usage |
|------|------|------|-------|
| Display | DM Serif Display | 14–16px | Project titles in list rows |
| Body | General Sans | 11–13px | Nav links, descriptions, body text |
| System | Fragment Mono | 10–11px | Numbers, metadata, tags, year, wordmark, clock |

### Rules

- All labels/metadata: Fragment Mono, uppercase, `letter-spacing: 0.04em`, `--fg-3`
- Wordmark "HKJ": Fragment Mono, 13px, uppercase, `letter-spacing: 0.04em`, `--fg`
- Never bold body text — hierarchy via opacity + size only
- `text-rendering: optimizeLegibility` on body
- `-webkit-font-smoothing: antialiased`

---

## 3. Homepage — Typographic List (Default View)

Full viewport, no scroll. Three zones: nav, project list, footer.

### Layout

```
┌─────────────────────────────────────────────────┐
│ HKJ                ☰/▦  ○  Work  Lab  About     │  Nav
├─────────────────────────────────────────────────┤
│ 01   GYEOL             Brand · Ecommerce    2026│  Project rows
│─────────────────────────────────────────────────│  (titles rendered
│ 02   SIFT              Mobile · AI          2025│   as-is from data,
│─────────────────────────────────────────────────│   all uppercase)
│ 03   PROMPTINEER       Design System        2026│
│─────────────────────────────────────────────────│
│ 04   SPRING GRAIN      Texture · Material   2026│
│─────────────────────────────────────────────────│
│ 05   RAIN ON STONE     Texture · Material   2026│
│─────────────────────────────────────────────────│
│ 06   CLOUDS AT SEA     WebGL · Generative   2026│
├─────────────────────────────────────────────────┤
│ New York · 10:47 PM          hyeonjunjun07@…    │  Footer
└─────────────────────────────────────────────────┘
```

> **Note:** The ASCII diagram is illustrative. Titles, tags, years, and statuses are rendered from `src/constants/pieces.ts` data — never hardcoded. WIP projects (currently only PROMPTINEER) show "WIP" in place of year and title at `--fg-2` opacity.

### Row Structure

CSS Grid: `[32px] [1fr] [auto] [60px]`

- **Col 1**: Track number — Fragment Mono, 10px, `--fg-4`
- **Col 2**: Title — DM Serif Display, 14-16px, `--fg`
- **Col 3**: Tags — Fragment Mono, 10px, uppercase, `--fg-3`
- **Col 4**: Year or "WIP" — Fragment Mono, 10px, `--fg-3`

Row height: flexible, padding `18px 0`. Separated by `1px solid var(--fg-4)`.

WIP projects: title at `--fg-2` opacity, "WIP" instead of year.

All 6 pieces shown (projects + experiments in one stream, sorted by order).

### Nav

Left: `HKJ` (Fragment Mono, 13px, uppercase, `--fg`).

Right: view toggle `☰`/`▦` (list/grid), theme toggle `○`/`●`, then `Work · Lab · About` (Fragment Mono, 11px, `--fg-3`, hover → `--fg`).

- `Work` and `Lab` are **client-side filters on the homepage** — they do not navigate to separate routes. Clicking `Work` stays on `/` and filters the list to `type === "project"`. Clicking `Lab` filters to `type === "experiment"`. Clicking the active filter again (or `HKJ`) resets to show all.
- No URL change when filtering (no query params). This is intentional — the homepage is one view, filters are ephemeral.
- The existing `/work` and `/lab` routes currently redirect to `/` — this stays unchanged.
- Active filter indicated by `--fg` opacity on the active link.
- `About` navigates to `/about`.
- View toggle position: immediately left of the theme toggle. Persists to `localStorage` alongside theme preference.

### Footer

Left: `New York · {time}` (Fragment Mono, 10px, `--fg-3`).
Right: email link (Fragment Mono, 10px, `--fg-3`, hover → `--fg`).

Clock updates every 60 seconds. Must use `timeZone: "America/New_York"` in `toLocaleTimeString` options so the time is always NYC time regardless of user's location.

---

## 4. Homepage — Grid View (Toggle)

Toggle button near the nav (icon-based: list/grid) switches between views.

### Grid Layout

- CSS Grid: 3 columns desktop, 2 tablet, 2 mobile
- Square aspect ratio covers, `border-radius: 6px`
- Gap: `clamp(8px, 1.5vw, 12px)`
- Fills available viewport space between nav and footer

### Cover Design

- Background: project's `cover.bg` color
- Title: DM Serif Display, bottom area of cover, `cover.text` color
- Track number: Fragment Mono, 10px, top-left, faint opacity
- Grain texture: existing SVG feTurbulence overlay at 20-30% opacity

### Hover

- `translateY(-3px)`, `scale(1.03)`, 350ms, `--ease`
- Shadow: `0 8px 24px rgba(0,0,0,0.15)` (dark mode)
- Siblings dim to 0.85 opacity, 300ms

### Entrance

Same border-construction choreography, then covers fade in with stagger (80ms per cover).

---

## 5. Hover — Background Image Takeover (List View)

When cursor enters a project row:

1. **Image layer**: Project image (or `cover.bg` color for WIP) fades in behind the entire list. Position: fixed, full viewport, `z-index: -1`. Opacity: 15-20%. Filter: `blur(20px)`. Transition: 300ms ease.
2. **Hovered row**: Text brightens to full `--fg`.
3. **Non-hovered rows**: Dim to `--fg-3`.
4. **Crossfade**: Moving between rows crossfades the background image (300ms).
5. **Mouse leave**: Image fades out, all rows return to default opacity.

Image preloading: on homepage mount, preload all project images to prevent flash on first hover. If an image fails to load, fall back to the project's `cover.bg` color as a full-viewport wash instead.

---

## 6. Entrance Animation — Border Construction

Plays on every page load (homepage, detail, about).

### Sequence

**Phase 1 (0–600ms):** Top border line draws left → right.
- `scaleX(0 → 1)`, `transform-origin: left`
- 1px solid `--fg-4`

**Phase 2 (300–800ms):** Nav content fades in.
- Stagger: 40ms per element
- `opacity: 0 → 1`, `translateY: 8px → 0`

**Phase 3 (600–1200ms):** Main content rows/sections fade in.
- Stagger: 80ms per row
- Each row's bottom border draws as the row appears
- `opacity: 0 → 1`, `translateY: 12px → 0`

**Phase 4 (1000–1400ms):** Footer fades in.

### Easing

`cubic-bezier(0.16, 1, 0.3, 1)` — existing `--ease` variable.

### Repeat Visits

Same-session navigation back to a page: abbreviated 300ms fade-in, no full choreography. Tracked via `sessionStorage` set of visited paths.

### Reduced Motion

`prefers-reduced-motion: reduce` → all animation disabled, content visible immediately, borders drawn, full opacity.

---

## 7. Page Transitions

### Exit (leaving any page)

Content fades to 0 opacity over 300ms. Background color stays. Then route pushes.

### Enter (arriving at new page)

Full border-construction entrance plays (Section 6). The new page assembles itself from nothing.

### Implementation

`PageShell` client component wrapping page content:
- Lives in `layout.tsx`, wraps `{children}` — so all routes get it automatically.
- On mount: triggers entrance animation via CSS classes (`.page-enter`).
- Provides `navigateTo(href)` via React context (`TransitionContext`). Any component (client or server-rendered) that needs transition-aware links uses a `TransitionLink` client component that consumes this context.
- `TransitionLink` replaces all `<Link>` and `<a onClick={navigateTo}>` patterns across the site. It's a thin wrapper: renders an `<a>`, intercepts click, calls `navigateTo` from context.
- Exit sequence: adds `.page-exit` class → 300ms fade → `router.push(href)`.
- Enter sequence: on mount, plays border-construction entrance (Section 6).
- Detail pages remain server components — `PageShell` wraps their output in `layout.tsx`, not inside each page file.

### Repeat visits (abbreviated entrance)

When navigating back to a previously visited page in the same session: 300ms opacity fade-in only. No border draw, no stagger. The full page appears at once.

Tracked via `sessionStorage` key `hkj-visited` storing a JSON array of paths. On mount, if current path is in the array, use abbreviated entrance. Otherwise, full choreography and add path to array.

---

## 8. Detail Pages (`/work/[slug]`, `/lab/[slug]`)

### Entrance

Same border-construction from Section 6.

### Layout

Adopts new color/type system. Dark background, warm tint. Structure:

- **Nav**: Same global nav (HKJ left, links right) with back context
- **Hero**: Full-width project image, title overlay (DM Serif Display), metadata below (Fragment Mono)
- **Editorial body**: Max-width 900px centered, case study sections
- **Scroll reveals**: Sections animate in on scroll (GSAP ScrollTrigger, 85% threshold, `opacity: 0 → 1`, `translateY: 32px → 0`, 500ms)
- **Prev/Next**: Bottom navigation to adjacent projects
- **Scroll progress**: Updated to new color system

### Content

Existing case study data (`CASE_STUDIES` constant) drives content. No changes to data layer.

---

## 9. About Page

### Entrance

Same border-construction.

### Layout

- Philosophy statement: DM Serif Display, `clamp(22px, 3vw, 32px)`
- Bio: General Sans, 15px, max-width 54ch
- Experience timeline: Fragment Mono labels + General Sans descriptions
- Contact: email + social links
- All within the border-constructed frame
- Scroll reveals for sections below fold

---

## 10. Mobile Adaptations

- **List view**: Tags column hidden on mobile (< 768px). Grid becomes `[32px] [1fr] [60px]`.
- **Grid view**: 2 columns on mobile.
- **Hover background**: Disabled on touch devices. Tap goes directly to detail.
- **Row tap**: Full row is tap target, navigates to detail.
- **Nav**: Same layout, may wrap to two lines on very small screens.
- **Entrance**: Same choreography, touch devices don't disable it (only `prefers-reduced-motion` does).

---

## 11. Files to Modify

| File | Change |
|------|--------|
| `src/app/globals.css` | Full rewrite — dark-first variables, border-draw keyframes, list/grid styles, hover states, transitions, responsive |
| `src/app/page.tsx` | Full rewrite — typographic list, grid toggle, hover background, entrance, filtering |
| `src/app/layout.tsx` | Dark default theme, PageShell integration, font setup unchanged |
| `src/app/about/page.tsx` | Adopt new color/type system, border entrance via PageShell |
| `src/app/work/[slug]/page.tsx` | Adopt new system, border entrance, updated nav/colors |
| `src/app/lab/[slug]/page.tsx` | Same treatment as work detail |
| `src/components/PageShell.tsx` | **New** — entrance/exit animation wrapper, lives in layout.tsx |
| `src/components/TransitionLink.tsx` | **New** — transition-aware link, replaces all nav links |
| `src/components/TransitionContext.tsx` | **New** — React context providing `navigateTo` |
| `src/components/Nav.tsx` | **New** — shared nav component (HKJ + links + toggles), extracted from inline nav in each page |
| `src/components/Footer.tsx` | **New** — shared footer component (clock + email) |
| `src/components/ThemeToggle.tsx` | **New** — dark/light toggle (circle icon, `aria-label="Toggle theme"`) |
| `src/components/ViewToggle.tsx` | **New** — list/grid toggle (icon-based, `aria-label="Toggle view"`) |
| `src/components/ScrollProgress.tsx` | Update colors to new variable system, fix hardcoded email to use `CONTACT_EMAIL` |
| `src/components/RouteAnnouncer.tsx` | No change (accessibility, keep as-is) |
| `src/app/not-found.tsx` | Adopt new color/type/border system |

### Not Changed

- `src/constants/pieces.ts` — data layer stays
- `src/constants/case-studies.ts` — content stays
- `src/constants/contact.ts` — stays
- `src/lib/gsap.ts` — GSAP setup stays, used for scroll reveals
- `public/` — assets stay

### Legacy variable cleanup

The about page and detail pages use legacy CSS variables (`--ink-primary`, `--ink-secondary`, `--ink-muted`, `--text-meta`, `--text-body`, `--fg-5`, etc.) that are not in the new system. These must all be migrated to the new `--fg` / `--fg-2` / `--fg-3` / `--fg-4` / `--fg-5` scale. No legacy variables should survive the rewrite.

---

## 12. Verification

1. `npm run build` — no errors
2. `npm run dev` — verify:
   - Homepage loads with border-construction entrance on dark bg
   - All 6 pieces visible in typographic list
   - Work/Lab filters work
   - List ↔ Grid toggle works
   - Hover on rows triggers background image takeover
   - Click row → exit dissolve → detail page constructs itself
   - Detail pages render with new color/type system
   - About page renders correctly
   - Theme toggle (dark ↔ light) works and persists
   - Mobile: tags hidden, grid 2-col, no hover background
   - `prefers-reduced-motion`: no animations, content visible
3. `npm run lint` — no errors
4. Additional checks:
   - Verify `sessionStorage` repeat-visit logic (navigate away and back — should get abbreviated entrance)
   - Verify clock shows NYC time regardless of user timezone
   - Verify keyboard navigation (Tab through rows, Enter to navigate)
   - Verify image preload completes before hover is active (or fallback to `cover.bg` works)
   - Verify theme persists across page refresh
   - Verify theme toggle has `aria-label` and is keyboard-operable
   - Verify `not-found.tsx` uses new design system
   - Verify no legacy CSS variables remain (`--ink-*`, `--text-*`)
