# Taste Polish — Design Spec

**Date** 2026-04-22 · **Baseline commit** `a1142d6` · **Author** HKJ

## Context

The portfolio has reached a coherent baseline — Cathy Dolle-derived
index + media strip, mono-only typography, studio-catalog voice, no
ambient motion, four real projects. Principles are documented in
[TASKS.md](/TASKS.md).

The next push: make the site **exude taste, restraint, and depth of
knowledge** — not through decoration, but through a set of small,
lineage-literate additions that signal craft at every scale
(typography, interaction, structure, motion). Two research passes
informed this spec:

1. *Taste-forward personal portfolios beyond design engineers* —
   surveyed Hara/NDC, Morrison, Fukasawa, Irma Boom, Craig Mod,
   Rendle, Chimero, Tim Brown, Vanschneider, Apartamento, Monocle.
2. *Restrained interaction / animation / transition patterns in
   2025–2026* — surveyed TLB, Josh Comeau, Vercel design, Emil
   Kowalski, Paco Coursey, Granola, Arc, Vaul, Sonner, cmdk, Things.

Findings fold into one coherent push, staged across three phases.

## Goals

- Give every existing page a typographic "fluent" upgrade through
  OpenType features + hanging punctuation + en-dashes — zero new
  components, site-wide feel change.
- Introduce a unified hover vocabulary (underline-color fade + 6 px
  arrow slide) so every interactive element reads from the same
  grammar.
- Add one temporal surface (`/notes`) and one craft-manifesto surface
  (`/colophon`) so the site stops reading as purely static.
- Expand `/shelf` from a flat bibliography into named verticals
  (*Read / Watch / Keep / Visit*) — masthead register, not blog.
- Replace Lenis smooth-scroll with native scrolling + deliberate
  per-interaction timings, preserving friction without hijacking the
  trackpad.
- Ship View Transitions API crossfades between `/` and
  `/work/[slug]` — browser-native, reduced-motion-safe, the single
  biggest platform-literacy signal available in 2026.
- Every new surface inherits the existing design tokens, type system,
  and motion catalog. **Brand coherence is non-negotiable.**

## Non-goals (negative list)

Explicitly excluded, each with a reason:

- **Lenis / global smooth-scroll library.** Hostile to native
  trackpad momentum; violates the stated direction of
  reduced-motion-friendliness; removes visible idle motion.
- **Keyboard shortcut legend overlay.** Cut per user direction.
  Can revisit later if palette warrants it.
- **`animation-timeline: scroll()` progress bars.** 2022-awwwards
  residue; Safari-partial; would introduce idle motion we've banned.
- **Cursor-following mix-blend previews.** Cargo-culted in 2025;
  already absent from the current build; do not reintroduce.
- **Text-mask reveals on every heading.** Template-scent; reserve
  for one-off moments only (not in this spec).
- **Animated number counters.** SaaS register, not studio register.
- **New fonts, new colors, new easing curves.** The existing palette
  and motion catalog carry the direction. New surfaces compose from
  what's already defined; do not invent.

## Brand coherence — mandatory for every new surface

Every addition in this spec must:

1. **Use only the existing design tokens** from
   [globals.css](/src/app/globals.css): `--paper`, `--ink`, `--ink-2`,
   `--ink-3`, `--ink-4`, `--ink-hair`, `--ink-ghost`. No new hexes.
2. **Use only the existing fonts** — Fragment Mono site-wide;
   Gambetta serif reserved strictly for `.case__prose` on
   `/work/[slug]`.
3. **Reuse existing type primitives** from globals: `.eyebrow`,
   `.plate-mark`, `.prose`, `.tabular`. New pages compose from
   these, not new ones.
4. **Reuse the existing motion catalog**: `cubic-bezier(.4,0,.2,1)`
   (`--ease`) for standard eases, `cubic-bezier(.22,1,.36,1)` for
   ease-out-quart reveals, `cubic-bezier(.33,.12,.15,1)` for hover
   slides. No new curves.
5. **Match the existing page composition grammar**:
   - Centered `max-width` container (640–820 px depending on density)
   - Eyebrow (`About · A short account · 2026`) → title → body
     sections, consistent top rhythm
   - Section headers use the shelf pattern: uppercase mono label +
     tabular count (`02 Entries`), border-bottom 1 px `var(--ink)`
   - Row content uses the shelf pattern: grid with thin
     `var(--ink-hair)` dividers between items
6. **Every interactive element speaks the unified hover vocabulary
   defined in Phase 1** — underline-color fade, 6 px arrow slide,
   tonal opacity shift.

Violating any of the above invalidates the coherence goal; corner
cases resolve toward restraint.

## Friction preservation (no Lenis)

Removing Lenis means native scroll, which is sharper by default.
Friction is preserved deliberately via:

- **Wheel-snap strip** on `/` unchanged — 920 ms ease-in-out-cubic
  per project is the single biggest friction surface.
- **View Transitions** at 300 ms crossfade between pages — weight
  per navigation.
- **All CSS transitions at 160–400 ms** — the perception of weight
  per interaction, repeated across the site, reads as a friction
  budget without hijacking scroll.
- **`scroll-behavior: smooth`** on `html` for in-page anchor clicks
  only (native; no library).
- **Case-study line reveals at 280 ms / 50 ms stagger** — first-paint
  friction in long-form surfaces.

Cumulatively: zero idle motion, but every user action is met with a
considered transition in the 150–400 ms band.

---

## Phase 1 — Typographic & interaction chrome

**Scope**: code-only. No new content. Touches every existing page.
**Estimated**: ~1 day.

### 1.1 Typographic micro-discipline (site-wide)

Add feature-settings rules **directly to selectors** in globals.css —
no new root-level custom properties (brand coherence requires zero
new tokens). Gambetta is a variable serif with documented OpenType
features (`onum`, `lnum`, `tnum`). **Fragment Mono is a monospaced
display font with limited OT coverage — verify `onum` support at
implementation time; if unsupported, drop the `onum` declarations
rather than substitute.**

```css
/* Old-style figures in prose (variable / serif body text only) */
.case__prose,
.case__prose--lead,
.case__prose--step {
  font-feature-settings: "onum" on;
  hanging-punctuation: first last;
  text-wrap: pretty;
}

/* Tabular lining in grids, ledgers, stats, dates */
.tabular,
.case__ledger-row,
.case__stat-val,
.shelf__row-year,
.strip__caption .tabular {
  font-feature-settings: "tnum" on, "lnum" on;
  font-variant-numeric: tabular-nums lining-nums;
}
```

Audit content site-wide for:

- **Tight en-dashes** in date ranges (no surrounding spaces): `2023 — 2024` → `2023–2024`. En-dash (U+2013) for ranges; em-dash (U+2014) reserved for parenthetical asides only — where em-dashes stay, keep them spaced (`line — line`).
- **True typographic quotes** where any new prose is introduced (not retroactive across mono surfaces).
- **Hyphen vs. minus** in coordinates: `−74.00°` uses `−` (U+2212), already correct in contact.tsx — verify.

Touched files:
- `src/app/globals.css` (add selector rules; no new tokens)
- `src/app/about/page.tsx` (timeline em → en dashes, no spaces)
- `src/constants/experience.ts` (same)
- `src/constants/shelf.ts` (spot-check year ranges → tight en-dash)
- `src/components/CaseStudy.tsx` (`.case__prose` uses `hanging-punctuation` + `text-wrap: pretty`)

### 1.2 Unified hover vocabulary

One grammar across all interactive text. **Migration note**: the
existing `.prose a { border-bottom: 1px solid var(--ink-hair); }`
rule in globals.css must be **replaced** (not layered) so we don't
stack two underline mechanisms. Audit all `border-bottom` hover
patterns on anchors (`.about__mail`, `.card__handle`, `.cd__mail`)
and consolidate to the single `text-decoration-color` mechanism
below.

```css
/* Underline-color fade — the default for any inline link */
a.link, .prose a, .shelf__row-link,
.about__mail, .card__handle,
.cd__mail {
  text-decoration: underline;
  text-decoration-color: transparent;
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
  transition: text-decoration-color 180ms var(--ease);
  /* remove any existing border-bottom from these selectors */
  border-bottom: none;
}
a.link:hover, .prose a:hover, .shelf__row-link:hover,
.about__mail:hover, .card__handle:hover,
.cd__mail:hover {
  text-decoration-color: currentColor;
}

/* Arrow-glyph slide — appears next to any "forward" action */
.arrow-glyph {
  display: inline-block;
  transition: transform 200ms cubic-bezier(0.33, 0.12, 0.15, 1);
}
*:hover > .arrow-glyph,
*:focus-visible > .arrow-glyph { transform: translateX(6px); }
```

Apply to:
- Shelf external links (`.shelf__row-link`)
- Case-study "next entry" navigation
- Contact card handles
- About mail link
- Homepage mail link
- Nav links (home mark + about/shelf/contact) — underline only on the current-route item

Files touched by the consolidation:
- `src/app/globals.css` (remove `.prose a { border-bottom }`, add new rules)
- `src/app/about/page.tsx` (remove local `.about__mail` border-bottom rule)
- `src/app/contact/page.tsx` (remove local `.card__handle` border-bottom rule)
- `src/app/page.tsx` (remove local `.cd__mail` border-bottom rule)

### 1.3 Nav hide-on-scroll-down, reveal-on-scroll-up

Replace the always-fixed nav behavior:

```tsx
// NavCoordinates.tsx
const [hidden, setHidden] = useState(false);
useEffect(() => {
  let lastY = 0;
  const onScroll = () => {
    const y = window.scrollY;
    setHidden(y > lastY && y > 80);
    lastY = y;
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  return () => window.removeEventListener("scroll", onScroll);
}, []);
```

```css
.nav {
  transform: translateY(0);
  transition: transform 200ms var(--ease);
}
.nav[data-hidden] { transform: translateY(-100%); }
```

On `/` (height: 100svh, no scroll), this is a no-op — nav stays put.
On `/about`, `/shelf`, `/work/[slug]`, scrolling down hides it
cleanly.

### 1.4 Variable-font weight nudge on wordmark

Only if Fragment Mono has a weight axis (verify at implementation
time). If yes:

```css
.nav__mark {
  font-variation-settings: "wght" 400;
  transition: font-variation-settings 150ms var(--ease);
}
.nav__mark:hover { font-variation-settings: "wght" 460; }
```

If Fragment Mono is static-weight only, skip this item entirely — do
not substitute weight-swap or scale-transform. Restraint.

### 1.5 Folio component

New component: `src/components/Folio.tsx`. Renders mono microtype
pinned to the top-right corner of every route, below the nav.

**Format is a pure function** of the middle token. Folio owns the
`HKJ / … / YYYY[.MM]` frame so a caller typo can't drift the brand
mark or year. Callers pass only the middle token:

```ts
type FolioProps = {
  token: string;       // middle segment only, e.g. "§02", "N-001", "№02"
  month?: string;      // optional "04" — when present, appends ".04" to the year
};
// Renders: HKJ / <token> / <YYYY>[.<month>]
```

Usage per route (caller → rendered):
- `/` — `token="§01"` → `HKJ / §01 / 2026`
- `/about` — `token="§02"` → `HKJ / §02 / 2026`
- `/shelf` — `token="§03"` → `HKJ / §03 / 2026`
- `/contact` — `token="§04"` → `HKJ / §04 / 2026`
- `/work/[slug]` — `token="№{order}"` → `HKJ / №02 / 2026`
- `/colophon` — `token="§06"` → `HKJ / §06 / 2026` *(Phase 3a)*
- `/notes` — `token="§05"` → `HKJ / §05 / 2026` *(Phase 3b)*
- `/notes/[slug]` — `token="N-{num}" month="04"` →
  `HKJ / N-001 / 2026.04` *(Phase 3b)*

Section numbering is stable — About is always §02 because that's
its nav position, even if new routes ship later.

```css
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
}
```

### 1.6 Remove Lenis

Delete:
- `src/components/SmoothScroll.tsx`
- Lenis import + mount in `layout.tsx`
- Lenis npm dependency from `package.json`
- `data-lenis-prevent` from `GutterStrip.tsx` (no longer needed)

Add:

```css
html { scroll-behavior: smooth; }    /* native, anchor-click only */
```

No other substitute — native scroll carries.

**Regression verification (required before merge)**:
1. Load `/` — GutterStrip wheel-snap fires cleanly; 920 ms
   ease-in-out-cubic animation unchanged; teleport loop still
   silent.
2. Load `/about`, `/shelf`, `/contact` — pages scroll with native
   trackpad momentum; no stutter or double-buffer.
3. Load `/work/gyeol` — scroll to footer and back; wheel events
   outside the strip do NOT trigger the strip (GutterStrip is on
   `/` only, but confirm no stray listeners leak).
4. `⌘ ↑ / ↓` arrow keys on `/about`, `/shelf`, `/contact` — native
   page scroll behavior restored.

---

## Phase 2 — Cross-route & structural transitions

**Scope**: code-only. Build on Phase 1.
**Estimated**: ~0.5 day.

### 2.1 View Transitions API between `/` and `/work/[slug]`

Next.js 15+ supports view transitions via `unstable_ViewTransition`
or the native browser API wired through the app router. Enable it
on work routes specifically, not site-wide (keeps behavior explicit
and opt-in).

Shared element: the project title text (`CLOUDS AT SEA`, etc.)
receives a **single static** `view-transition-name: work-title` on
both the home strip row and the case-study head. Only one title
animates per navigation (the one the user clicks), so a single name
is correct — and a generated per-slug name would require runtime
CSS, which we avoid. If two titles were to animate simultaneously
it would be a UX bug, not a feature.

```css
/* Root crossfade for any page transition */
::view-transition-old(root),
::view-transition-new(root) {
  animation-duration: 300ms;
  animation-timing-function: cubic-bezier(0.41, 0.1, 0.13, 1);
}

/* Shared-element title morph (home row title ↔ case-study title) */
::view-transition-old(work-title),
::view-transition-new(work-title) {
  animation-duration: 420ms;
  animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
}

/* Reduced-motion: disable transitions explicitly.
   Browsers do NOT auto-skip ::view-transition-* based on the
   media query — the author must opt out. */
@media (prefers-reduced-motion: reduce) {
  ::view-transition-old(root),
  ::view-transition-new(root),
  ::view-transition-old(work-title),
  ::view-transition-new(work-title) {
    animation: none;
  }
}
```

Graceful degradation: browsers without View Transitions API support
(older Safari, Firefox without the flag) fall back to instant
navigation — no animation, no JS error. Feature is progressive by
nature.

### 2.2 Case-study line reveal on `§` sections

Each `§` section in `/work/[slug]` fades in once on entering the
viewport. IntersectionObserver fires with `threshold: 0.1`,
`rootMargin: 0px 0px -10% 0px`.

```tsx
// Hook: useSectionReveal in src/hooks/
```

```css
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
.case__section:nth-child(2) { transition-delay: 50ms; }
.case__section:nth-child(3) { transition-delay: 100ms; }
.case__section:nth-child(4) { transition-delay: 150ms; }
.case__section:nth-child(5) { transition-delay: 200ms; }
/* cap the stagger at 5; subsequent sections reveal immediately */

@media (prefers-reduced-motion: reduce) {
  .case__section { opacity: 1; transform: none; transition: none; }
}
```

---

## Phase 3 — Structural additions + content

Split into **two sub-passes** because the content-heavy items
(`/notes` + `⌘K` palette theming) are tighter than originally
budgeted.

### Phase 3a — Colophon + shelf verticals *(~1 day)*
Code-heavy, minimal new content.

### Phase 3b — Notes + command palette *(~1.5 days)*
Content + library theming.

Both sub-passes follow the same brand-coherence rules as Phase 1–2.

### 3.1 `/colophon` — typographic manifesto *(Phase 3a)*

Route: `src/app/colophon/page.tsx`. Composed from the same
primitives as `/about` and `/shelf`. Structure:

- Eyebrow: `Colophon · Typographic notes · 2026`
- Title: *"How this site is set."* (or similar, one sentence)
- Sections (same shelf-style headers, hairline rules):
  - **Typefaces** — Fragment Mono (everywhere), Gambetta
    (case-study prose only). Each listed with foundry, designer, year,
    weight range, and a one-line note on why.
  - **Grid** — measurement unit, breakpoints, type scale (Perfect
    Fourth 1.333), measure tokens (`--measure-narrow: 48ch`,
    `--measure-body: 62ch`).
  - **Motion** — the three easing curves in use and what each is
    for: `--ease` (standard), `cubic-bezier(.22,1,.36,1)` (ease-out
    reveals), `cubic-bezier(.33,.12,.15,1)` (hover slides). Wheel
    snap duration (920 ms), view-transition duration (300 ms).
  - **Stack** — Next.js version, Node, hosted on Vercel (or
    wherever). Stack pages link out.
  - **Lineage** — one-line references: Hara / Morrison / Rams /
    Rauno / Cathy Dolle. Inspiration, not appropriation.
  - **Commit** — current git short-SHA, built-from date. Hot-swapped
    at build time via env.

Footer signoff identical to `/about` and `/shelf`.

No new hex values, no new fonts. Strictly composed from existing
primitives. Reference: Tim Brown's `nicewebtype.com`.

### 3.2 `/notes` — dated stream *(Phase 3b)*

Route: `src/app/notes/page.tsx` + `src/app/notes/[slug]/page.tsx`.
Data in `src/constants/notes.ts`.

Data model:

```ts
export interface Note {
  slug: string;           // "n-001"
  number: string;         // "001"
  date: string;           // "2026-04-22" (ISO for sorting)
  dateLabel: string;      // "April 2026" or "2026.04.22"
  title: string;
  excerpt: string;        // first-line / summary, visible on /notes
  body: string;           // markdown or MDX
  tags?: string[];
}
```

Index page (`/notes`): eyebrow + title + month-grouped list of
entries. Each row: `N-001 · 2026.04.22 · Title · → arrow`.
Visual grammar identical to shelf.

Detail page (`/notes/[slug]`): eyebrow + number + date + title +
body (Gambetta serif for prose, same as case studies). Sticky
running head on scroll showing `N-001 · Title` in mono microtype.

Launch content: 2–3 entries scaffolded at ship, content to be
written by user. Placeholder entries include `N-000` marked `draft —
not yet published` so the visible numbering can evolve naturally.

Folio on `/notes/[slug]`: `HKJ / N-001 / 2026.04`.

### 3.3 Shelf verticals *(Phase 3a)*

Extend `src/constants/shelf.ts` with a new `group` field:

```ts
export type ShelfGroup = "READ" | "WATCH" | "KEEP" | "VISIT";
```

Keep existing `kind` (BOOK / PORTFOLIO / ESSAY / ARCHIVE) nested
under groups:

- **READ** — books, essays, writing I return to
- **WATCH** — films, series, talks
- **KEEP** — physical objects, tools, products
- **VISIT** — NYC places, galleries, shops, neighborhoods

Rewrite `/shelf/page.tsx` to render grouped masthead style: each
group gets its own section header (shelf pattern), then rows inside.

Content: bootstrap with existing shelf items under READ; add 2–3
items each to WATCH / KEEP / VISIT at launch, then user curates.

### 3.4 `⌘K` command palette via `cmdk` *(Phase 3b)*

Install dependencies: `cmdk` + `vaul` (for mobile drawer). **Note**:
`cmdk` ships unstyled primitives — every element (`[cmdk-input]`,
`[cmdk-item][data-selected]`, `[cmdk-group-heading]`) needs an
explicit rule below. Budget accordingly.

New component: `src/components/CommandPalette.tsx`. Mounted in
`layout.tsx` behind `⌘K` / `⌃K` / `/` keyboard trigger.

**Discoverability**: since we cut the keyboard legend, add a single
mono microtype hint in the site footer: `⌘K` (9 px, ink-4,
0.24em tracking). One glyph, one key — no overlay, no explanation.
The visitor either recognizes it or discovers by keyboard.

Groups:
- **Work** — Clouds at Sea, Gyeol, Pane, Sift (jumps to case study)
- **Writing** — Notes index + recent entries (if notes shipped)
- **Browse** — About, Shelf, Colophon, Contact
- **Actions** — Copy email, Open LinkedIn, Open Cosmos, Open X

Styling requirements (explicit — cmdk has no defaults to override,
only primitives to style from zero):

```css
[cmdk-root] {
  background: var(--paper);
  border: 1px solid var(--ink-hair);
  width: 540px;
  max-width: calc(100vw - 48px);
}
[cmdk-input] {
  font-family: var(--font-stack-mono);
  font-size: 14px;
  padding: 16px;
  background: transparent;
  border: none;
  border-bottom: 1px solid var(--ink-hair);
  color: var(--ink);
  width: 100%;
}
[cmdk-input]::placeholder { color: var(--ink-4); }
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
[cmdk-overlay] {
  position: fixed;
  inset: 0;
  background: rgba(17, 17, 16, 0.18);
  /* No backdrop-filter — keeps it crisp, avoids blur on cheap GPUs */
}
```

- No icons, no color accents — text-only
- Mobile: `vaul` drawer (full-height, same styling primitives)
- Entrance: 150 ms opacity + 4 px Y translate. Exit: same, reversed
- No auto-open on mount. No fuzzy-search highlight beyond
  `[cmdk-item][data-selected="true"]` state

---

## Verification

After implementation, end-to-end verification:

1. `npx tsc --noEmit` → zero errors.
2. `npm run dev` → all routes load:
   - `/` (home) — nav fixed, no hide-reveal (page is 100svh)
   - `/about`, `/shelf`, `/contact` — nav hides on scroll down, reveals on up
   - `/colophon` — loads with typographic manifesto, inherits eyebrow + title + sections grammar
   - `/notes` — loads with 2–3 scaffold entries, grouped by month
   - `/notes/n-001` — loads single entry with sticky running head
   - `/work/gyeol` — view transition from `/` strip to case study (300 ms crossfade, 420 ms title morph)
3. Hover any text link → underline fades in, 180 ms.
4. Hover any arrow-glyph → arrow slides 6 px over 200 ms.
5. `⌘K` anywhere → palette opens, 150 ms fade-in. Arrow keys navigate. Enter routes.
6. Case-study sections fade in on scroll, max 5 staggered.
7. `prefers-reduced-motion: reduce` → all opacity fades retained, all transform / translate removed. Keyboard palette still works.
8. `scroll-behavior: smooth` on anchor clicks; otherwise native scroll — confirm trackpad momentum is restored after removing Lenis.
9. Folio visible top-right of every route at correct `§` number.
10. Typographic audit: tabular-nums in the strip caption + shelf row-year; old-style figs in case-study prose; en-dashes in all date ranges.
11. No new hex values introduced (diff check against `globals.css`).
12. No new easing curves introduced (search for `cubic-bezier(`).

## Risks + open items

- **Fragment Mono weight axis**: unknown if variable. If not,
  Phase 1.4 (wordmark weight nudge) is skipped entirely. No
  substitute.
- **Fragment Mono OpenType coverage**: `onum` support unverified at
  spec time. If missing, Phase 1.1 drops the `onum` declaration and
  keeps only `tnum`/`lnum` (which are well-supported in mono faces).
- **cmdk primitives are unstyled by default** (not "own default
  styles" as we previously assumed). Phase 3b's CSS block covers
  every primitive explicitly to prevent drift.
- **Notes content burden**: spec ships a scaffold + 2–3 entries.
  Ongoing writing is the user's practice, not this spec's scope.
- **Shelf verticals content**: spec ships the grouping + 2–3 items
  per new vertical. Deeper curation is out of scope.
- **View Transitions** support varies. Safari 18+ supports;
  older Safari falls back gracefully (instant navigation, no error).
  Firefox support is behind a flag as of early 2026 — no polyfill.

## Post-implementation TODO (out of scope)

- A `/press` or `/exhibitions` page if/when the practice accumulates
  institutional recognition.
- Typography-specimen page for Fragment Mono itself (nicewebtype
  tier).
- Gyeol + Sift case-study prose rewrite in the new voice (flagged
  in [TASKS.md](/TASKS.md) content backlog).
