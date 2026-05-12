# Ryan Jun — Creative Direction

> **Brand: Ryan Jun.** Personal portfolio, design engineer, New York. Studio of one. Mark is the initials `rj` in the masthead; the full name appears as metadata in the colophon. The brief experimental rename to "stray, a creative studio" has been retired — the working register is too coupled to Ryan-the-person to be carried by a studio mark. Studio framing may return later when the team grows; right now the portfolio reads as one author.
>
> **Last updated 2026-05-10.** Supersedes the 2026-05-06 "stray creative studio" draft, which was itself a transitional rename from "Hyeonjoon Jun / HKJ Studio." The brand has cycled through enough variants this month — leave this one alone unless there's a concrete reason to migrate again.
>
> This document is the canonical creative direction. It captures the philosophy, the systems, the references, and the roadmap of what *actually ships in code*. A fresh session (or a continuation on mobile) should be able to pick up cold from here without losing context.

---

## The Conceptual Frame

> **A single-viewport tracklist on a black ground. The work is the setlist; the author is the credit strip.**

The portfolio is a *back-cover poster* in the Fred Again `USB001` line — the artist's name doesn't appear typeset huge anywhere on the back cover. It sits in the bottom credit strip as metadata ("Fred again.. USB001 USB Volume 1"). The middle of the composition is *huge* negative space. The tracklist is the headline.

Every design decision answers to that frame: if it would feel out of place on the back of a quietly-printed white-label record, it goes. The tracklist is data and reads as data; the author is colophon and reads as colophon; the negative middle is the design.

This is a deliberate pivot from the earlier "monograph laid open on a concrete table" frame. Both were editorial; the previous was print-coded (warm paper, sans reading), this one is music/data-coded (black ground, mono throughout, tabular alignment).

---

## The Feeling

Someone opens the site. Within 3 seconds they should feel:

> *This is alive. This is precise. This person has been working. I want to read the setlist.*

Not warm. Not soft. Not "monograph on a table." Closer to a tour board at a venue right before doors — composed, lit, ready. The chrome reads as **signal**, not decoration. The amber accent on a live tag tells you the studio is on the air right now.

---

## The Register

Single dark register. Never shifts to light. Never softens to warm.

The reference set for this register:
- **juliakrantz.com** — *the line*. Pure black ground, cool off-white type (`#F8F8F8`), alpha steps on a single foreground value. Hairline rules read as drawn lines, not tinted edges. Mono-only.
- **Fred Again `USB001` back cover** — *the composition*. Tracklist as hero, name as metadata, vast middle, sparse top + dense bottom strip.
- **Bureau Borsche / Rauno Freiberg** — *the floating cover preview*. Mouse follows; a small frame trails the cursor showing the project's cover.

The register doesn't lean editorial-print anymore. It leans editorial-music — the back of a record sleeve, a departure board, a setlist taped to a wall. The work is rigorous, but the atmosphere is signal not paper.

---

## The Light

> **A black ground under a single amber boarding light.**

This means:
- The page is `#000000` everywhere. Pure black. No tinted darks. (Token: `--paper: #000000`.)
- The primary ink is `#F8F8F8` — a cool off-white, not pure. Lower hierarchy steps are `rgba(248, 248, 248, X)` so secondary text reads as the same ink at lower opacity, not as a separate cool grey.
- One accent: **Solari amber `#E8B25A`**. Used only on truly-live elements:
  1. The `live` tag next to `status: "wip"` pieces.
  2. The amber pulse glyph on the OG card next to the role line.
  3. Reserved for one future "boarding cue" if one ever ships.
  Three places, no more. The discipline keeps the amber as signal; if it shows up on a fourth element, it becomes costume.
- No tinted edges. Hairlines are `rgba(248, 248, 248, 0.12)` — neutral ink at hairline opacity.
- `PaperGrain` blends `mix-blend-mode: overlay` at `0.06` opacity. On the black ground this reads as faint board-grain; on inverted light surfaces (if any return) it would read as paper texture. Same noise SVG, different surface.

---

## The Pace

> **One screen. No scroll.**

The home is a **single-viewport poster** at `height: 100dvh; overflow: hidden`. The viewer sees the whole composition at once — masthead, setlist, vast negative middle, colophon strip — without scrolling. Mobile (≤720px) is the only exception: there the page becomes scrollable because the rows stack.

This is the biggest break from the earlier "one idea per viewport height" framing. That was a scroll-paced editorial. This is a poster — the whole thing is read at once, then re-read, then re-read.

Case studies still scroll (they're the long-form). The studio, contact, and notes pages still scroll. But the home is locked to a single viewport.

---

## The Type System

**Mono-only.** Geist Mono is the primary face site-wide. Geist Sans remains in the stack as a fallback for any rare component that opts out, but every role-based class explicitly sets `font-family: var(--font-stack-mono)`. The site is a mono-only commitment.

### The 10 type roles

Every text element on the site is one of these. The names are role-based, not size-based, so a future scale rebalance reuses the names without renaming references.

```
--type-monument:  clamp(36px, 5.5vw, 48px)    /* page-anchor wordmark (OBYS-tier) */
--type-display:   clamp(48px, 9vw, 96px)      /* hero name — used ONCE per page */
--type-statement: clamp(15px, 1.4vw, 18px)    /* hero positioning sentence */
--type-row:       clamp(13px, 1vw, 15px)      /* primary list rows, project titles */
--type-prose:     clamp(13px, 0.95vw, 14.5px) /* paragraphs, longer body */
--type-section:   11px                         /* SECTION LABELS — caps */
--type-meta:      10px                         /* meta lines — caps */
--type-caption:   10px                         /* captions — case-sensitive */
--type-footnote:  9px                          /* footer build info — caps */
--type-eyebrow:   9px                          /* hero eyebrow — caps, weight 500 */
```

### The `t-*` utility framework

Every text role gets a class. Compose with `.tabular` / `.caps` / `.dim` / `.dimmer` / `.live` modifiers. The framework is in `globals.css`:

- `t-monument` — the page anchor wordmark
- `t-display` — hero name
- `t-statement` — hero positioning
- `t-row` — list-row titles
- `t-prose` — paragraph body
- `t-section` — uppercase section labels
- `t-meta` — uppercase meta lines (counts, last-updated)
- `t-caption` — case-sensitive captions
- `t-footnote` — faintest footer micro
- `t-eyebrow` — above-the-name eyebrows
- `t-code` — alphanumeric codes, tabular nums
- `t-rule` — hairline rule
- `t-sep` — separator glyph between meta items

Pages compose from these classes; inline-style typography is retired. When working on a new section, check what role it is first, then use the matching class. Don't add an eleventh role without retiring one.

### Tracking scale (8 steps)

```
--track-tightest:  -0.04em   /* display — name */
--track-tight:     -0.025em  /* large body */
--track-snug:      -0.005em  /* medium body */
--track-normal:    0         /* default mono prose */
--track-loose:     0.06em    /* mono caps, tight */
--track-loosest:   0.10em    /* mono caps, comfortable */
--track-section:   0.16em    /* section labels */
--track-eyebrow:   0.20em    /* eyebrows — max */
```

Mono-only sites lean on tracking + caps for hierarchy because they can't lean on family contrast. The scale is intentionally wide so the difference between an eyebrow (`0.20em`) and a meta line (`0.10em`) is visually felt.

### Line-height scale (5 steps)

```
--lh-tight:  1.05   /* display */
--lh-snug:   1.15   /* row titles, statement */
--lh-body:   1.5    /* default body */
--lh-prose:  1.65   /* paragraphs */
--lh-loose:  1.8    /* generous prose */
```

---

## The Color System

```
--paper:     #000000                    /* ground — pure black */
--paper-2:   #0A0A0A                    /* lifted cell hover */
--paper-3:   #161616                    /* hairline-adjacent surface */
--ink:       #F8F8F8                    /* primary — titles, mark, sym */
--ink-2:     rgba(248,248,248,0.92)     /* prose */
--ink-3:     rgba(248,248,248,0.45)     /* chrome — labels, meta, nav */
--ink-4:     rgba(248,248,248,0.30)     /* faintest — folio, sub-meta */
--ink-hair:  rgba(248,248,248,0.12)     /* hairline rules */
--ink-ghost: rgba(248,248,248,0.04)
--accent:    #E8B25A                    /* warm Solari amber — rationed */
--accent-2:  rgba(232,178,90,0.55)      /* dimmed accent (pulse trough) */
```

The warm `#FBFAF6` paper, warm `#55554F` greys, and pure-black ink hierarchy from the earlier monograph direction are all retired. The whole system is mirror-imaged into a dark register.

---

## Page Geometry

```
--max-width:     1200px              /* container max */
--margin-page:   clamp(24px, 4vw, 56px)
```

The home overrides max-width for the setlist (`max-width: 1480px`) because the tracklist needs the horizontal real estate. Other pages (`/studio`, `/contact`, `/work/[slug]`) sit at narrower `920px` or `1080px` reading containers.

### Spacing scale (7 steps)

```
--space-hairline:  1px
--space-tight:     4px
--space-1:         8px
--space-2:         16px
--space-3:         24px
--space-4:         32px
--space-5:         64px
--space-6:         clamp(96px, 12vw, 128px)    /* between sections — load-bearing */
--space-7:         clamp(140px, 18vw, 200px)   /* hero → first section */
```

`--space-6` is the load-bearing "silence that makes mono prose readable" rhythm.

---

## The Home Composition (`HomeView.tsx`)

Single-viewport poster, four grid rows: masthead, setlist, negative-space spacer, colophon.

### Layout

```
┌─ MASTHEAD ──────────────────────────────────────────────────┐
│ rj                                       index   about     │
├─────────────────────────────────────────────────────────────┤
│ TYPE   NO.   WORK-RATE        PROJECT     CLIENT   DURATION│  ← SETLIST = HERO
│ ────────────────────────────────────────────────────────── │
│ BRAND  [01]  ▁▁▂▃▄▆▇████▇    LA28 LIVE   Personal  04.26→ │
│ BRAND  [02]  ▂▄▇█▇▆▅▃▂▁▁▁    Halo Halo!  Halo Halo  04.26 │
│ PROD   [03]  ▁▂▃▅▆▇█▇▆▅▃▁    Sift        Self       09.25 │
│ BRAND  [04]  ▁▂▃▅▇█████▆▃    Gyeol: 결    Gyeol      02.26 │
│                                                             │
│                                                             │
│                                                             │
│                  (vast negative space)                      │
│                                                             │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ [Side A/B]                              Ryan Jun           │  ← bottom strip
│                                          design engineer    │     name as METADATA
│                                          new york / 2024 → │
│                                          shift · since      │
│                                                             │
│ rykjun@gmail.com   ·   hyeonjunjun.com    ⏵ NowPlaying     │
└─────────────────────────────────────────────────────────────┘
```

### Masthead

- `rj` mark left (mono, weight 500, lowercase, `--type-mark` 13px)
- Two nav links right: `index` (=/work) and `about` (=/studio). No `contact` link — contact lives in the colophon strip.
- The `Frame` component is **suppressed on `/`** because the home owns its own masthead. Frame renders on every other route.

### Setlist (the hero)

Columns, with relative widths:
- `TYPE` (`0.5fr` min `64px`) — uppercase short type: `BRAND`, `PROD`, `MOBL`, derived from `piece.sector`
- `NO.` (`0.3fr` min `40px`) — bracketed: `[01]`, `[02]`, ...
- `WORK-RATE` (`2.4fr` min `180px`) — unicode block-element waveform driven by `piece.workLog: number[]` (12 samples, 0–7 each)
- `PROJECT` (`3fr` min `180px`) — title with optional `live` amber tag for `wip` pieces
- `CLIENT` (`0.7fr` min `100px`) — `piece.client` field
- `DURATION` (`1fr` min `110px`) — `04.26 — 09.26` or `04.26 → live`

All cells at `--ps-t-meta` (`11px`) or `--ps-t-body` (`12.5px`). Hierarchy from color (`--ink` vs `--ink-3`) and weight (500 vs 400), not from size. The waveform is the visual heartbeat of the row.

Hover: row tints to `--paper-2` (`#0A0A0A`), title cell slides right `4px` with a slight-overshoot spring, dim cells brighten one step to `--ink-2`. A floating cover preview frame (`260px × 3/4 aspect`) trails the cursor showing the piece's cover.

Entry stagger: header fades in first (180ms delay), then rows trail in with 50ms increments (240/290/340/390/440/490ms).

### Negative space

An explicit `min-height: 0` grid row between the setlist and the colophon. The vast empty middle is the design — *don't fill it*. On mobile (≤720px) this row is `display: none` to let the colophon sit directly under the rows.

### Colophon

Two stacked strips:

1. **Credit row:** `[Side A/B]` pill bottom-left + Ryan Jun colophon bottom-right (name `--type-mark`, then `design engineer`, then `new york · 2024 → present`, then a dimmer aliveness line: `shift · since`).
2. **Contact strip:** email · personal URL on the left, `listening` block on the right (PixelEQ + NowPlaying).

The aliveness line:
- `shiftLabel` — derived from current hour: `morning shift` / `afternoon shift` / `evening shift` / `late shift`
- `sinceLabel` — derived from `localStorage["rj-last-visit"]`: `first visit`, `welcome back`, `since 2 days ago`, etc.

Both are client-only (rendered empty on first paint to avoid hydration mismatch, then fade in once mounted).

---

## Other Pages

### `/studio`

- Single editorial column at `max-width: 920px`
- Header: eyebrow `Studio` (t-eyebrow), title `A studio of one.` (t-display, sentence case, tracking `-0.03em`), lede (t-prose, lowercase, mentions Ryan Jun)
- Section 1 — `Practice`: header (t-section + t-meta `03 notes`), then three numbered notes (Concept to code / Design and engineering / Quiet by design). Numbers as `t-code`, titles inline in the body.
- Section 2 — `Currently`: header (t-section + t-meta date stamp), then a `dl` ledger (Based / Status / Founded / Contact). Email at the end with the underline-fade hover.
- Sections separated by `<hr className="t-rule" />`.

### `/contact`

- Single editorial column at `max-width: 920px`
- Header: eyebrow + display title (`Get in touch.`) + lede (lowercase, mono prose)
- Primary email at display scale (clamp 20–32px), weight 500, underline-fade hover. The page's center of gravity.
- "Elsewhere" section: numbered (01, 02, ...) social rows with `↗` arrows
- All sections separated by hairline rules

### `/work`

- Catalog index, `WorkIndex.tsx`. Eyebrow `Work` + title `Selected work and projects.` + Grid/List toggle.
- Grid view: 2-col plate grid using `CatalogPlate` with `piece.coverAspect` respected
- List view: hairline rows (`ListView.tsx`)
- localStorage key: `rj.work.view`

### `/work/[slug]`

- Case study at `max-width: 1080px`
- Header: eyebrow (`Work · 02 · 2026`), title (sentence case), description (lowercase prose)
- Hero (`CaseHero` component, full-bleed inside container)
- 4-column metadata ledger (Role / Sector / Year / Status) with hairline above and below
- Editorial body (mono prose paragraphs, lowercase, max-width 56ch)
- Next-project link with `→` arrow
- All using `t-*` utility classes

---

## Aliveness Signals

The site has to communicate *the studio is on the air right now*. These are the signals:

1. **`live` tag on `wip` pieces** — amber, micro size, opacity-only heartbeat at 3.6s cycle. Only LA28 currently carries it.
2. **NowPlaying** — Last.fm "now playing" line in the colophon. Polls `/api/now-playing` every 60s. Falls back to silent (renders nothing) when API unavailable. Track name + artist as a link to the play page, with relative timestamp (`now playing` or `03:42 ago`).
3. **PixelEQ** — 5 vertical pixel-art bars next to NowPlaying. Pre-baked patterns, ~150ms tick rate, bars desync naturally. Not audio-reactive — ambient motion only. Frozen at mid-height on `prefers-reduced-motion`.
4. **Time-of-day shift label** — `morning shift` / `afternoon shift` / etc, in the credit block.
5. **Since-last-visit stamp** — `first visit` / `welcome back` / `since 3 days ago`, derived from localStorage.
6. **Row hover spring** — slight title translate-x + dim-cell brighten on row hover. Reads as "responsive surface."
7. **Floating cover preview** — cursor-tracked frame that materializes when hovering a row.

The discipline: motion is only present where the studio is *being alive* — the live tag, the EQ, the cover preview that follows. Everywhere else is still.

---

## Components

### `Preloader`

- Once-per-session opening curtain (sessionStorage key `rj-curtain-shown`).
- Renders a hand-laid character-cloud field (ASCII cumulus of `+` and `.` marks) with lede words drifting in at specific row/col positions (`old soul`, `late-night`, `mixes`, `voice memos`, `ryan jun`).
- Total duration: 2800ms. Fades up, holds, fades down. Skipped entirely on `prefers-reduced-motion` and after first session-view.
- Sits at `z-index: 10000`, `pointer-events: none`. Doesn't block the page underneath; just covers it visually.

### `NowPlaying`

- Polls `/api/now-playing` every 60s, renders artist + track + relative timestamp.
- Returns nothing when API is unconfigured or fails — no error UI, no spinner.
- Track name as link to play page; lowercase typography throughout.

### `PixelEQ`

- 5 vertical bars (2px wide each) cycling through pre-baked height patterns at 150ms intervals.
- `image-rendering: pixelated` for crisp 8-bit feel at high-DPI.
- Reduced-motion: bars freeze at static low-amplitude state.

### `PaperGrain`

- Fixed full-viewport noise overlay, `mix-blend-mode: overlay`, `0.06` opacity.
- Same SVG works on dark and light surfaces — board grain on dark, paper texture on light.

### `Folio`

- Fixed bottom-right page stamp. `--type-footnote` (9px), mono uppercase, `--ink-4`.
- Suppressed on `/` (home carries its own colophon).
- Renders `/work` → `WORK · INDEX · {N}`, `/work/[slug]` → `§{number} · {title}`, `/studio` → `STUDIO · NEW YORK`, `/contact` → `CONTACT`.
- Hidden below 640px.

### `Frame`

- Sticky masthead — `rj` mark + nav links (Work / Studio / Contact).
- Hidden on `/`.
- Hides on scroll-down past 80px, reveals on scroll-up. Dark `rgba(0,0,0,0.92)` glass background, backdrop-blur.
- Mark at weight 500, links at 400.

### `CatalogPlate` + `WIP overlay`

- Still exists. Used by `WorkIndex` (`/work`).
- Carries `view-transition-name: work-cover-{slug}` for shared-element morph to the case study hero.
- `cat-plate__wip` overlay on pieces with `status: "wip"`: backdrop-filter blur on hover. Visual stays intact, un-clarified — the work is in progress.

### Pieces (`pieces.ts`) — current data shape

```ts
interface Piece {
  slug, title, type, order, number, sector, description,
  status: "shipped" | "wip",
  year, started,
  image?, cover?, coverFit?, coverAspect?,
  tags,
  coverAlt?, placeholder?,

  // NEW for the tracklist register:
  runtime?: string,            // decorative MM:SS for tracklist column
  client?: string,             // "Personal" / "Halo Halo!" / "Self" / "Gyeol"
  workLog?: number[],          // 12 intensity samples, 0–7, render as ▁▂▃▄▅▆▇█
  ended?: string,              // YYYY-MM or undefined when still wip
  waveform?: string,           // DEPRECATED — kept as fallback for workLog
}
```

The catalog:

```
§01  LA28          wip       Brand · Campaign · Personal       2026   video, 16/9
§02  Halo Halo!    shipped   Brand · Café                       2026   image, 3/4
§03  Sift          shipped   Mobile · AI · Product              2025   image, 9/16
§04  Gyeol: 결      shipped   Brand · Ecommerce · 3D             2026   image, 3/4
```

---

## Hand-Placed Details (the strays)

Every page gets one detail that a system wouldn't produce. They reward attention but should never be pointed out.

```
Home:        The aliveness line in the colophon (shift · since) only
             appears after client-only effects fire — a faint hairline
             above it appears with it. Quietly says "the studio is on."

Home:        The waveform on a row is the *real* work intensity over
             the project's months, not decoration. Hand-curated, but
             the schema (workLog[]) is API-shaped for future live data.

Home:        The cursor-tracked cover preview only appears on
             pointer-fine devices. Mobile gets nothing — that's
             on purpose; the cover preview is a desktop-only stray.

Case study:  One image breaks the margin by exactly 8px on one side.
             Not full-bleed. Just 8px past. A stray.

Studio:      The third practice note ("Quiet by design") is the only
             one that names a position rather than a process. Felt,
             not announced.

Preloader:   The drifting words ("old soul", "late-night", "mixes",
             "voice memos") are from the studio's lede. The preloader
             tells the visitor what they're about to read, in pieces,
             before the page itself does.
```

These are the strays. The portfolio has a system, and within that system, something has wandered. That wandering is the studio's signature — present, not announced.

---

## Failure Modes

The departure-board principle has to extend to the system's failures.

- **NowPlaying API unconfigured / failing** → renders nothing. The `listening` label and PixelEQ also remain visible without it; the line just truncates. Silence is in register; an error toast is not.
- **localStorage unavailable** (private mode) → since-line silently absent.
- **Cover image fails to load** (404, slow): the plate's `paper-2` (`#0A0A0A`) frame remains. Caption sits below normally.
- **JS disabled** → Frame stays present (no scroll-hide). Setlist still renders. NowPlaying / PixelEQ / Preloader / cover preview all absent. Aliveness line absent. Page is usable as a static tracklist.
- **`prefers-reduced-motion: reduce`** → Preloader skipped. PixelEQ bars freeze. Live-tag pulse stilled. Row-hover spring stilled. All view-transitions hard-cut. Page is fully present and usable, with no motion.
- **Hero video on the LA28 plate fails to autoplay** → not applicable in the new direction: the home doesn't have a hero video anymore. The video plays only on `/work/la28`.

---

## First Paint

- LCP < 1.8s on fast 3G. The LCP element on `/` is the row-li containing the longest project title (largest contentful text block).
- CLS = 0. Setlist rows have explicit `padding` and `align-items: center` so they don't shift when the cover preview or aliveness line mounts.
- TBT < 200ms. The page is mostly server-rendered. Client islands: HomeView (scroll/cover-preview/aliveness), Preloader, NowPlaying, PixelEQ, Frame, Folio, CopyEmailLink.
- Bundle: four production deps + framework fonts. **No animation libraries currently.** GSAP decision still open (see Constraint Question below).

---

## Quiet Read — Accessibility

- Skip-to-content is the first focusable element.
- One `<main id="main">`, one `<header>`, one `<footer>` per page.
- Color contrast on dark register: `#F8F8F8` on `#000000` = max contrast. `--ink-2` (0.92α) = ~19:1. `--ink-3` (0.45α) = ~7.5:1 — passes AAA. `--ink-4` is decorative-only.
- `:focus-visible { outline: 1px solid var(--ink); outline-offset: 3px; }`.
- Setlist rows are `<li>` inside `<ol>`, with `role="columnheader"` on the header cells. Tab order matches visual order.
- `prefers-reduced-motion` respected on Preloader, PixelEQ, live-tag pulse, row entry stagger, row hover spring, view transitions.
- NowPlaying track link is keyboard-reachable; PixelEQ is `aria-hidden role="presentation"`.

---

## The Quality Bar

Before shipping any page, the tests:

1. **The Krantz test.** Is the ground pure `#000` and the ink a single cool off-white with alpha steps? Are hairlines neutral, not tinted?
2. **The Fred Again test.** Is the tracklist or equivalent data the hero — is the author's name in the credit position, not the headline?
3. **The Bureau Borsche test.** Is there one micro-interaction that follows the cursor or signals presence?
4. **The Rauno test.** Would inspect-element reveal a deliberate easing curve, a deliberate stagger, a deliberate baseline alignment — not a default browser transition?

A fifth, internal test: **the stray test.** *Is there one detail on this page that a system wouldn't produce?* Apply last.

---

## Reference Set

### The new line

- **juliakrantz.com** — *the line*. Pure-black + cool off-white + alpha steps + mono-only. Personal-first portfolio that earns the personal framing through Press / Speaking / Podcasts depth. Quoted in the `globals.css` header.
- **Fred Again `USB001` back cover** — *the composition*. Tracklist as hero, name as metadata, vast middle, dense bottom strip.
- **Bureau Borsche** — floating cursor-tracked cover preview. The cover doesn't sit on the row; it trails the cursor.
- **Rauno Freiberg** (rauno.me/craft) — interaction-craft neighbor. Spring easings, stagger discipline, presence-led micro-motion.
- **OBYS Agency** — monument-tier wordmark scale. Numbered grid, category tags, restraint.
- **Codrops case studies, May 2026** — Thibault Guignand, Tomoya Okada (4Wide), Artem Shcherban, Ravi Klaassens. Each studied for stack + concept + signature move + iteration story. See git history for full notes.

### The previous line (retired)

These still inform spiritual register but no longer drive visual decisions:

- **HS68.la, Aino.agency, YSL** — the warm-paper editorial line. The site is no longer in their neighborhood; it's in Krantz's.
- **Wang Zhi-Hong, Daikoku Design Institute** — monograph print discipline. Still informs typographic restraint but the warm-paper / image-as-caption shape is retired.
- **Kenya Hara's *Designing Design*** — the *ma* principle still applies. The vast negative middle on the home IS active *ma*.

### Anti-references (do not drift toward)

- **NaughtyDuk** — heavy WebGL/GSAP entertainment-industry register. The gravity well to avoid.

---

## Cohesiveness Audit

### What's cohesive now

- One register top-to-bottom. The dark ground + cool off-white + amber accent reads as one decision.
- One type family (mono) site-wide. No sans/mono switching to manage.
- The `t-*` utility framework means every text role has one source of truth.
- All pages use the same `t-rule` hairline + `t-section` label section-break pattern.
- The amber accent is rationed (live tag + OG pulse glyph) and reads as signal.

### Where cohesiveness still breaks

1. **Page geometries don't share a system.** Home uses `1480px` setlist + viewport-locked grid. `/studio` uses `920px`. `/contact` uses `920px`. `/work` uses the catalog's own widths. `/work/[slug]` uses `1080px`. Five widths, no token. (The earlier "12-col cols-2-11" system shipped on the old home is gone — the new home doesn't use grid columns at all.)
2. **`/work` still uses the old `CatalogPlate` register.** Plates have warm-paper-era styling that survives because the component was never updated for the dark register. Inspect: plates probably look OK on dark because of background reuse, but the WIP overlay was tuned for warm paper.
3. **`Folio` color/typography was tuned for the old register.** It uses `--ink-4` which now resolves to `rgba(248,248,248,0.30)` — fine on dark, but the comment in the file still references the old "Wang Zhi-Hong / Daikoku monograph folios" rationale.
4. **No connecting motif outside the home.** The waveform is unique to the setlist. The amber `live` tag is unique to wip pieces. The colophon strip is unique to the home. None of these signature elements appear on `/studio`, `/contact`, or case studies. The home reads as a signature poster; the rest reads as quiet documentation pages. That asymmetry can be a feature, but it's worth being deliberate about.

---

## The Constraint Question

**Open: add GSAP as a fifth dep?**

The Codrops case studies all use GSAP as their orchestration layer. The site currently does its row entry stagger via raw CSS `animation-delay` per nth-child, which works but caps out at simple opacity/transform timelines. Spring physics (`back.out(2)`) on the row hover, scrub-driven scroll reveals on case study sections, and a sequenced page-turn transition are all out of reach without an orchestration library.

The four-dep ceiling has been doing more work as a *position* than as a *practical constraint*. The new direction's signature moves (waveform tracklist, floating cover preview, PixelEQ, live tag pulse) are all CSS-only — they don't need GSAP. But if the next move is the page-turn transition or a scroll-driven setlist reveal, GSAP becomes the right tool.

Recommendation unchanged from previous session: **add GSAP, document it as the fifth dep, the exception.** Decision still pending Ryan's sign-off.

---

## Discovery Sources

For technique with code-level depth:
- **rauno.me/craft** — closest aesthetic neighbor with explained code.
- **paco.me / emilkowal.ski** — inspect-element archeology.
- **Olivier Larose** (blog.olivierlarose.com) — Next.js portfolio tutorials.
- **Codrops** (tympanus.net/codrops) — long-form case studies. The four studied in the previous session (Thibault, 4Wide, Artem, Ravi) are templates of the form.

For single-interaction learning:
- **cubic-bezier.com**, **easings.net**, **Josh Comeau's blog**, **motion.dev/examples**.

For visual ideas:
- **cosmos.so**, **godly.website**, **siteinspire.com**, **are.na** (Editorial web design + Microinteractions channels), **awwwards.com** (Minimal + Typography filter only).

---

## Roadmap — What's Open

System (consolidation):
1. **Resolve the page-geometry inconsistency.** Pick one of: (a) tokenize three widths (`--width-home`, `--width-narrow`, `--width-prose`) and have each page reference one; (b) extend the home's `1480px` setlist treatment to other pages where useful; (c) accept the per-page sizing and document why each width exists. Currently there's no system.
2. **Audit `/work` against the dark register.** The `CatalogPlate` was built for the warm-paper direction. Plates on `/work` need a once-over to confirm they read right against the new background.
3. **Confirm `Folio` works on the dark register.** Inspect the four route-specific stamps for legibility at `--ink-4` opacity on `#000`.

Finish (cross-page coherence):
4. **Echo one home-signature element on other pages.** The waveform is too specific to projects, but the amber `live` indicator could appear on `/studio` Currently section ("active" / "on the air" stamp) when work is in flight. Or the colophon's `listening` block could persist into the case study footers.
5. **Section labels on case studies.** Right now the case study has eyebrow → title → ledger → body. Adding a small `t-section` label above the body ("Editorial") and the ledger ("Project") would echo the home's section discipline.

Content depth:
6. **Write the Sift case study editorial.** Two of three (now three of four with LA28) case studies render fallback prose. Highest single-leverage credibility move.
7. **Add `/notes`.** Three short entries, lowercase, mono prose, t-rule separated. The decision Ryan made on a project, a reference, a process note. Off Menu calls this "Writing"; Julia Krantz calls hers "Magic Fabric." Ryan can name it.

Open decision:
- **Add GSAP as fifth dep?** Pending sign-off.

Will not build:
- ~~`/lab` or `/playground`~~ — explicitly opposed by user.
- ~~"stray, a creative studio" brand~~ — retired this cycle. May return if the studio grows past one person; until then, Ryan Jun personal.

---

## What Was Retired This Cycle

So a future session doesn't reintroduce these:

- **The "stray" brand.** Wordmark, OG card, layout metadata, /studio Stray-Studio note — all replaced with Ryan Jun + `rj` initials.
- **The warm-paper monograph register.** `#FBFAF6` ground, warm `#55554F` greys, sans/mono hybrid, image-as-caption discipline. The new register is dark + mono-only + tracklist-as-hero.
- **The 12-col cols-2-11 grid on the home.** The setlist composition doesn't use grid columns at all — it uses tabular row alignment. The grid system survived only in concept (other pages might still adopt it).
- **The hero-video-as-LA28 plate.** LA28 is now a row in the setlist, not a 16:9 hero. The cloudsatsea video lives on `/work/la28`.
- **The pixelated cloud monogram in the OG card.** Replaced by the "Ryan Jun" wordmark + amber pulse glyph + departure-board frame. (The favicon `icon.tsx` still uses the cloud — that's the only surviving cloud surface.)
- **The "stray marks" editorial vocabulary as a brand mechanic.** The strays-as-hand-placed-details concept survives, but the literal name "stray" no longer telegraphs it.

---

## What This Document Is NOT

This is not the design spec (`globals.css` is the spec — the tokens are the source of truth). This is not `CLAUDE.md` (Ryan's authored instructions for the build agent). This is not the brand identity guide (wordmark, palette, system).

This is how Ryan makes decisions when the spec doesn't have an answer. When the spec says *"use `--type-row` at clamp(13px, 1vw, 15px)"* and Ryan is staring at a project title wondering if it's right, this document says: *"Is it small enough to read as a row in a tracklist? Does the waveform speak louder than the title? Then it's right."*

The spec is the score. **This document is how to play it.**
