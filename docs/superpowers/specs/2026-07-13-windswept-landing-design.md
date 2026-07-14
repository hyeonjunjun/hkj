# Windswept Landing Page — Design

**Date:** 2026-07-13
**Status:** Approved by user in brainstorm, pending spec review

## Blocking prerequisite

**General Sans font files must be sourced (Fontshare, free license) and added to the project before implementation can begin.** Unlike this project's current fonts (Inter Tight, Instrument Serif, Courier Prime — all `next/font/google`), General Sans isn't on Google Fonts, so it needs local `.woff2` files loaded via `next/font/local`. This is not something to defer to "figure out during coding." While sourcing the files, confirm the exact weight name that maps to "heavy" in this brief's sense (Fontshare's free tier includes multiple weights — confirm whether Bold or a heavier Extrabold/Black-equivalent cut is available and intended, rather than guessing during implementation).

## Context

The homepage timeline shipped earlier today (`docs/superpowers/specs/2026-07-13-homepage-timeline-design.md`) looked, in the user's words, "not even close" once seen live — a mostly-empty viewport with a barely-visible filmstrip and a disconnected thesis statement. Rather than iterate on that layout, the user brought a fully-specified new creative direction, "Windswept Studio," and asked for it to become the new homepage.

## Scope decision

Windswept's own brief describes a locked-viewport homepage built around a curated index of 3-4 works. The user reviewed a proposed execution of that ("Specimen Index" — a bracketed list of works whose hover reveals a preview) and rejected it: **work-index/list-driven homepages are something the user has been deliberately avoiding**, independent of execution quality. Do not re-propose this pattern.

**Revised, in-scope for this spec:**

- The homepage (`/`) becomes a **pure landing page** — identity only, no work content of any kind.
- Nav becomes the "doors" into the existing rooms — Archive/References/Info are genuine distinct destinations, restyled labels only. **Works is a partial exception, worth naming explicitly:** `studio.ts` already points the "works" nav item at `href: "/"` (a deliberate choice from the earlier homepage-timeline work, since `/works` as a standalone index was retired then). With `HomeTimeline` now also retired, clicking `[ WORKS ]` lands on the same pure-identity screen as the "door" itself — there is no distinct Works room to walk into until the mid-August work-showcase redesign. Not a blocker for this spec, just something to expect rather than be surprised by during implementation.
- This is a **component-craft pass**, not an information-architecture pass. The goal is a beautifully executed landing page using the Windswept visual/motion system, not solving how to showcase work — the user doesn't yet have enough shipped work to show in a professional capacity and plans a real work-showcase redesign in mid-August.

**Explicitly out of scope / deferred:**

- Any work index, list, or catalog on the homepage (rejected pattern, see above)
- Redesigning Archive, References, or Info's content or their rooms' own visual register — **these stay exactly as they are today**, confirmed by the user
- The mid-August work-showcase redesign (separate future brainstorm)
- `src/app/works/[slug]` case-study pages (untouched)

## Design

### 1. Visual system

- **Typography:**
  - Structural headers (the identity name + philosophy statement): **General Sans**, heavy weight, tight tracking (`tracking-tighter`, ~`-0.03em`). Chosen over the brief's named Monument Grotesk/Helvetica Now (both commercial) as the closest free equivalent — self-hosted via `next/font/local`, matching this project's existing self-hosted-font convention (Inter Tight, Instrument Serif, Courier Prime are all `next/font`, currently via `next/font/google`; General Sans isn't on Google Fonts, so it needs local `.woff2` files added to the project rather than a Fontshare CDN `<link>`, to stay consistent with this project's no-external-runtime-dependency posture). Needs its **own** Tailwind utility (e.g. `font-display`), not a redefinition of `--font-sans`/`font-sans` — that utility is currently wired to Inter Tight and used by `Wordmark`'s `"room"` variant, `Standfirst`, and Nav's non-landing labels, all of which must keep rendering in Inter Tight untouched.
  - Metadata/timestamps/availability/nav labels: the project's **existing** mono register (Courier Prime, already wired to `font-mono` project-wide) — uppercase, `tracking-[0.2em]`, 10-11px. No new mono face needed; this already matches the Windswept brief's "mechanical, uppercase, micro-scale" spec.
- **Palette:** paper `#F4F3EF`, ink `#1C1C1A`, one accent `#1845C2` (a deep cobalt/royal blue — a deliberate departure from the brief's stated "editorial orange/red," chosen explicitly by the user). Accent is rationed: the live/availability indicator, the active-state underline on nav doors, and crosshair marks — nowhere else.
  - **Scoping constraint:** the project's existing root tokens (`--paper: #F8F9FA`, `--ink: #121212`, `--ember: oklch(60% 0.14 50)` in `globals.css`) are shared sitewide, including by Archive/References/Info. Since those rooms must stay visually untouched, Windswept's palette is introduced as **new, distinctly-named tokens** (e.g. `--ws-paper`, `--ws-ink`, `--ws-accent`) scoped to the landing page only — not a redefinition of the shared root tokens.
- **Texture:** no `box-shadow` anywhere. Separation via 1px dashed hairlines and a small number of deliberately-placed `+` crosshair marks at grid intersections — restrained, not a repeating pattern.

### 2. Landing page composition

Locked `100vh`/`100vw`, zero scroll (matches the existing project convention of `md:h-screen md:overflow-hidden` already used for `/`, just without a scrollable timeline inside it). Asymmetrical CSS Grid, mostly empty:

- **Lower-left, locked:** one composed block combining `Wordmark` (studio name), `Standfirst` (short supporting line, nested directly beneath the name, matching how it's already nested in the current `page.tsx`), and `ThesisStatement` (the larger philosophy statement) — in General Sans heavy for the name and thesis. Standfirst itself stays in the project's existing sans (Inter Tight, `font-sans`, its current size) — it's a supporting line, not a structural header, so it doesn't get the new display face; this is the one component in the block that keeps its current typography untouched. This whole block is the single "loud" element on the page.
- **Bottom-right:** `CornerMark`'s landing variant — availability / location / live time, in the bracketed mono register, e.g. `( AVAILABLE ) // NEW YORK // 16:03 EST`. This is a deliberate corner reassignment: `CornerMark` renders bottom-left today, which is now occupied by the identity block above, so its landing variant moves to the diagonally-opposite corner instead — balancing the top-right nav doors. Its pulsing indicator dot switches from `--ember` to `--ws-accent` here, consistent with the accent-rationing rule in the Visual System section above (the dot is one of the three places the accent is allowed to appear).
- **Top-right:** the nav "doors" (see below).
- Everything else (including the entire top-left quadrant) is genuine empty space — not a container reserved for future content, an intentional compositional choice.

### 3. Nav "doors"

Each room link renders in a bracketed punctuation register: `[ WORKS ]`, `[ ARCHIVE ]`, `[ REFERENCES ]`, `[ INFO ]`. Active state (already correctly computed by the existing `isNavItemActive` room-based matcher) gets the accent-blue underline instead of the current amber (`--ember`) one.

**Scoping constraint:** `Nav.tsx` is shared — it's rendered both on the landing page and, via `RoomHeader.tsx`, on every room page, and **unlike `Wordmark.tsx`, neither call site passes any variant argument today** (`RoomHeader.tsx` and `page.tsx` both currently call `<Nav items={studio.navItems} />` identically). This matters for which side of a new `variant` prop should be the *default*: `Wordmark`'s existing convention is safe only because `RoomHeader` already explicitly passes `variant="room"` to opt out of the landing styling — there's no equivalent existing opt-out for Nav. So Nav's new `variant` prop must run the opposite way: **the default (no `variant` prop passed) stays exactly Nav's current rendering** — this is what `RoomHeader.tsx` keeps calling, completely untouched — **and `page.tsx` is the one that changes**, explicitly passing a new `variant="landing"` to opt in. Do not give Nav a `default = landing-styled` convention like Wordmark's; that would silently break `RoomHeader`'s untouched call site. Concretely, the landing variant differs from today's Nav in three ways, all scoped to that variant only: bracketed-label typography instead of plain text, the new `--ws-accent` color instead of `--ember` for the active-state indicator, and a Framer Motion hover-drift replacing the existing CSS `.nav-link::after` underline transition (see Motion, below, on how the two motion systems divide responsibility rather than both applying to the same element).

Separately, **`Wordmark.tsx` already branches on a `variant` prop** (`"hero"` is the default, used by the landing page; `"room"` is explicitly passed by `RoomHeader`) — the Windswept typography/color treatment applies only to the default `"hero"` variant. The `"room"` variant stays exactly as it renders today. (Note this is the opposite default-safety shape from Nav, above — Wordmark's existing callers already handle the distinction, Nav's don't yet.)

**`CornerMark.tsx` needs the same variant treatment — it is NOT landing-page-only.** Its own doc comment says it's "present on the landing masthead and every room," and it's directly imported (not via `RoomHeader`) in every room page (`archive`, `archive/[slug]`, `info`, `references`, `works/[slug]`) plus `not-found.tsx` and the landing page itself. Since Section 2 above calls for the availability/location/live-time content CornerMark already renders to appear in the new bracketed mono register, `CornerMark` needs a `variant` prop exactly like `Wordmark`'s: a new landing variant gets the Windswept treatment, and the default/room variant — used everywhere else — stays byte-for-byte what it renders today.

`Standfirst.tsx` and `ThesisStatement.tsx` genuinely are landing-page-only (confirmed: only referenced in `page.tsx`), so they can be restyled in place freely with no cross-room impact. (`ThesisStatement.tsx`'s own doc comment incorrectly claims it's "present on the landing masthead and every room" — the same stale-comment failure mode that caused the original `CornerMark` scoping error in this spec. Worth correcting that comment during implementation so it doesn't mislead someone later.)

`HomeTimeline.tsx` is **retired from `/`** — same treatment as `WorkGrid.tsx` after the earlier `/works` retirement: left in the repo, unused, in case a future direction (the mid-August redesign) wants it back.

### 4. Motion

**Framer Motion** is the project's first real *use* of an animation library — a deliberate exception to its established "no animation libraries, hand-rolled CSS/rAF only" convention (confirmed explicitly by the user; chosen over GSAP as a better fit for "designing components that get added into the project," being composition/prop-driven rather than imperative-timeline-driven). No install step is required: `framer-motion` is already present in `package.json` (alongside several other unused leftover dependencies — `gsap`, `lenis`, `three`, `@react-three/fiber`, `react-fast-marquee` — from earlier abandoned directions), just never imported anywhere in `src/`.

**Division of responsibility between the two motion systems, to avoid stacking both on the same element:** every component's existing (non-landing) variant keeps using `MotionReveal` exactly as it does today — Nav's default render, Wordmark's `"room"` variant, CornerMark's default/room variant, and every room page are untouched. Only the new landing-variant components (Nav's landing variant, Wordmark's default variant, CornerMark's landing variant, `Standfirst`, `ThesisStatement`) use Framer Motion for their entrance instead of `MotionReveal` — never both on one element.

- **Entrance:** identity block + nav doors fade/drift in on load, staggered — same restrained timing philosophy as the existing `src/lib/motion.ts` constants (this file's `easing`/`duration`/`delay` values should inform, not be duplicated by, the new Framer Motion variants).
- **Nav door hover:** a subtle horizontal drift (~6px) plus the accent underline sweeping in, eased with `cubic-bezier(0.16, 1, 0.3, 1)` — the brief's specified "organic deceleration" curve, used consistently everywhere motion appears.
- **Directional SVG blur:** reserved for exactly one moment — the identity statement's entrance — rather than applied broadly, so it reads as a signature flourish rather than decoration. Implemented as a horizontal-only Gaussian blur SVG filter (`stdDeviation="8,0"`), not a CSS `filter: blur()` (which blurs uniformly, not directionally).
- **Reduced motion:** respects `prefers-reduced-motion`, but this needs its **own explicit wiring**, not a free ride off the existing global rule. The project's current blanket CSS rule (`transition-duration: 0.01ms !important` under `prefers-reduced-motion` in `globals.css`) only neutralizes motion driven by an inline CSS `transition` property — which is how `MotionReveal` animates, but Framer Motion drives its animations through its own engine, not `transition-duration`, so that global rule will not reach the new landing-variant components at all. Framer Motion needs its own reduced-motion handling — either `useReducedMotion()` per component or a single `<MotionConfig reducedMotion="user">` wrapping the landing page's Framer-Motion-driven components — so drift/blur genuinely disable rather than appearing to (per this project's standard, matching `MotionReveal` and `HomeTimeline`'s existing reduced-motion behavior in outcome, even though the mechanism must differ).
- **Carrying forward a known layout gotcha:** `CornerMark.tsx` and `ThesisStatement.tsx`'s existing doc comments both note that positioning must live on an *outer* wrapper div, never on the element `MotionReveal` animates directly — any element with an active CSS `transform` becomes a containing block for absolutely-positioned descendants regardless of its own `position` value, which silently breaks positioning if violated. Framer Motion's `motion.div` sets `transform` the same way; the landing-variant replacements must keep positioning on an outer wrapper, not on the `motion.div` itself, or this bug resurfaces.

## Out of scope / explicit non-goals

- No work index, list, or catalog of any kind on the homepage
- No changes to Archive, References, or Info's own content or visual register
- No changes to `/works/[slug]` case-study pages
- No GSAP (Framer Motion only, per the user's explicit choice)
- No new nav destinations — the four existing rooms are unchanged

## Open questions for implementation planning

- Exact CSS Grid template / column structure for the asymmetrical layout — to be composed and iteratively measured in the browser, the same way the homepage timeline's height budget was tuned, rather than fully pre-specified here.

(See "Blocking prerequisite" at the top of this document for the General Sans font-sourcing requirement.)
