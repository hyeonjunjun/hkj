# Windswept Landing Page — Design

**Date:** 2026-07-13
**Status:** Approved by user in brainstorm, pending spec review

## Context

The homepage timeline shipped earlier today (`docs/superpowers/specs/2026-07-13-homepage-timeline-design.md`) looked, in the user's words, "not even close" once seen live — a mostly-empty viewport with a barely-visible filmstrip and a disconnected thesis statement. Rather than iterate on that layout, the user brought a fully-specified new creative direction, "Windswept Studio," and asked for it to become the new homepage.

## Scope decision

Windswept's own brief describes a locked-viewport homepage built around a curated index of 3-4 works. The user reviewed a proposed execution of that ("Specimen Index" — a bracketed list of works whose hover reveals a preview) and rejected it: **work-index/list-driven homepages are something the user has been deliberately avoiding**, independent of execution quality. Do not re-propose this pattern.

**Revised, in-scope for this spec:**

- The homepage (`/`) becomes a **pure landing page** — identity only, no work content of any kind.
- Nav becomes the "doors" into the existing four rooms (Works/Archive/References/Info) — unchanged destinations, restyled labels.
- This is a **component-craft pass**, not an information-architecture pass. The goal is a beautifully executed landing page using the Windswept visual/motion system, not solving how to showcase work — the user doesn't yet have enough shipped work to show in a professional capacity and plans a real work-showcase redesign in mid-August.

**Explicitly out of scope / deferred:**

- Any work index, list, or catalog on the homepage (rejected pattern, see above)
- Redesigning Archive, References, or Info's content or their rooms' own visual register — **these stay exactly as they are today**, confirmed by the user
- The mid-August work-showcase redesign (separate future brainstorm)
- `src/app/works/[slug]` case-study pages (untouched)

## Design

### 1. Visual system

- **Typography:**
  - Structural headers (the identity name + philosophy statement): **General Sans**, heavy weight, tight tracking (`tracking-tighter`, ~`-0.03em`). Chosen over the brief's named Monument Grotesk/Helvetica Now (both commercial) as the closest free equivalent — self-hosted via `next/font/local`, matching this project's existing self-hosted-font convention (Inter Tight, Instrument Serif, Courier Prime are all `next/font`, currently via `next/font/google`; General Sans isn't on Google Fonts, so it needs local `.woff2` files added to the project rather than a Fontshare CDN `<link>`, to stay consistent with this project's no-external-runtime-dependency posture).
  - Metadata/timestamps/availability/nav labels: the project's **existing** mono register (Courier Prime, already wired to `font-mono` project-wide) — uppercase, `tracking-[0.2em]`, 10-11px. No new mono face needed; this already matches the Windswept brief's "mechanical, uppercase, micro-scale" spec.
- **Palette:** paper `#F4F3EF`, ink `#1C1C1A`, one accent `#1845C2` (a deep cobalt/royal blue — a deliberate departure from the brief's stated "editorial orange/red," chosen explicitly by the user). Accent is rationed: the live/availability indicator, the active-state underline on nav doors, and crosshair marks — nowhere else.
  - **Scoping constraint:** the project's existing root tokens (`--paper: #F8F9FA`, `--ink: #121212`, `--ember: oklch(60% 0.14 50)` in `globals.css`) are shared sitewide, including by Archive/References/Info. Since those rooms must stay visually untouched, Windswept's palette is introduced as **new, distinctly-named tokens** (e.g. `--ws-paper`, `--ws-ink`, `--ws-accent`) scoped to the landing page only — not a redefinition of the shared root tokens.
- **Texture:** no `box-shadow` anywhere. Separation via 1px dashed hairlines and a small number of deliberately-placed `+` crosshair marks at grid intersections — restrained, not a repeating pattern.

### 2. Landing page composition

Locked `100vh`/`100vw`, zero scroll (matches the existing project convention of `md:h-screen md:overflow-hidden` already used for `/`, just without a scrollable timeline inside it). Asymmetrical CSS Grid, mostly empty:

- **Lower-left, locked:** identity name + philosophy statement, in General Sans heavy — the single "loud" element on the page.
- **A corner, small:** availability / location / live time, in the bracketed mono register, e.g. `( AVAILABLE ) // NEW YORK // 16:03 EST`.
- **Top-right:** the nav "doors" (see below).
- Everything else is genuine empty space — not a container reserved for future content, an intentional compositional choice.

### 3. Nav "doors"

Each room link renders in a bracketed punctuation register: `[ WORKS ]`, `[ ARCHIVE ]`, `[ REFERENCES ]`, `[ INFO ]`. Active state (already correctly computed by the existing `isNavItemActive` room-based matcher) gets the accent-blue underline instead of the current amber (`--ember`) one.

**Scoping constraint:** `Nav.tsx` is shared — it's rendered both on the landing page and, via `RoomHeader.tsx`, on every room page. Restyling it in place would change the nav's appearance on Archive/References/Info too, which contradicts "those rooms stay untouched." Resolution: Nav gets a landing-specific rendering path (a `variant` prop, mirroring the pattern `Wordmark.tsx` already uses for its own `"room"` vs default variant) so `RoomHeader`'s usage is provably unaffected.

Similarly, **`Wordmark.tsx` already branches on a `variant` prop** (`"room"` is used by `RoomHeader`, default is used by the landing page) — the Windswept typography/color treatment applies only to the default variant. The `"room"` variant stays exactly as it renders today.

`Standfirst.tsx`, `ThesisStatement.tsx`, and `CornerMark.tsx` are landing-page-only components (not used by `RoomHeader` or any room), so they can be restyled in place freely with no cross-room impact.

`HomeTimeline.tsx` is **retired from `/`** — same treatment as `WorkGrid.tsx` after the earlier `/works` retirement: left in the repo, unused, in case a future direction (the mid-August redesign) wants it back.

### 4. Motion

**Framer Motion** is added as a new dependency — the project's first exception to its established "no animation libraries, hand-rolled CSS/rAF only" convention (confirmed explicitly by the user; chosen over GSAP as a better fit for "designing components that get added into the project," being composition/prop-driven rather than imperative-timeline-driven).

- **Entrance:** identity block + nav doors fade/drift in on load, staggered — same restrained timing philosophy as the existing `src/lib/motion.ts` constants (this file's `easing`/`duration`/`delay` values should inform, not be duplicated by, the new Framer Motion variants).
- **Nav door hover:** a subtle horizontal drift (~6px) plus the accent underline sweeping in, eased with `cubic-bezier(0.16, 1, 0.3, 1)` — the brief's specified "organic deceleration" curve, used consistently everywhere motion appears.
- **Directional SVG blur:** reserved for exactly one moment — the identity statement's entrance — rather than applied broadly, so it reads as a signature flourish rather than decoration. Implemented as a horizontal-only Gaussian blur SVG filter (`stdDeviation="8,0"`), not a CSS `filter: blur()` (which blurs uniformly, not directionally).
- **Reduced motion:** respects `prefers-reduced-motion` — drift and directional blur are disabled, replaced with instant or fade-only transitions, matching the standard every other component in this project already follows (`MotionReveal`, `HomeTimeline`'s reduced-motion handling, etc.).

## Out of scope / explicit non-goals

- No work index, list, or catalog of any kind on the homepage
- No changes to Archive, References, or Info's own content or visual register
- No changes to `/works/[slug]` case-study pages
- No GSAP (Framer Motion only, per the user's explicit choice)
- No new nav destinations — the four existing rooms are unchanged

## Open questions for implementation planning

- Exact CSS Grid template / column structure for the asymmetrical layout — to be composed and iteratively measured in the browser, the same way the homepage timeline's height budget was tuned, rather than fully pre-specified here.
- General Sans font files need to be sourced (Fontshare, free license) and added to the project before implementation can begin — not something to defer to "figure out during coding."
