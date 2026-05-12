# Portfolio direction — canonical (2026-05-12)

This is the single source of truth for the portfolio's design direction. Prior
direction docs in this folder (`CREATIVE-DIRECTION.md`, `DEPARTURE-BOARD-DIRECTION.md`,
`MICROTYPOGRAPHY.md`, `design-reference-analysis.md`) are **retired**. They're
preserved for archaeology but should not be referenced for active decisions.

---

## Philosophy

Raw simplicity in the output. Depth comes from restraint, not from features. Every
visible element has earned its place; if removing it changes nothing, remove it.

Music is the **ethos**, not the **chrome**. The site should feel like a record you
can put on — not like a music player. "Brings people together" means inhabited,
intimate, like-you're-in-the-room — *not* impressive. The site is hosted; it's
not a billboard. The site **is** the work. Don't impress; *be present*.

The greatest creative thought can be explained simply. The portfolio's job is to
make that simplicity visible without making it look easy.

---

## Reference orbit

### Music (primary)

The artists whose *substance* we're modeling on, not just their aesthetic:

- **Fred Again..** — diary as music. Voice-memo track titles (`marea (we've lost dancing)`,
  `stayinit`). Tracks built from real samples of real friends. In-progress, intimate,
  in-public. The work is *titled like a song*, not labeled like a deliverable.
- **Boris Acket** — reactive installation light + sound. The viewer's body matters.
  Ambient, breathing, alive in the room.
- **Joe Hisaishi** — one melody returns, transformed, across an entire film's arc.
  Restraint. Patience. The discipline to let one motif bloom slowly.

The structural lessons:

1. A **signature** — the one thing that makes the artist recognizable in 3 seconds.
2. **Patience** — nothing happens fast; the audience earns the climax.
3. **Intimacy** — work built from the artist's actual life.
4. **The body matters** — pointer, scroll, time of day, the device shapes the
   experience.
5. **Music brings people together** — the work isn't impressive in a vacuum; it
   works in a room with other people.

### Web design

Editorial-poster portfolios that are small, type-led, alive, type-disciplined.
Specific URLs TBD — Ryan to send the reference set; this section gets filled in
once those land.

### Album graphic (primary visual reference)

Fred Again — **USB001** back-cover manifest. Six-column tracklist (SIDE / NUMBER /
WAVEFORM / TRACK TITLE / BPM / TIME), small uniform type, framed pill in
lower-left, credits block in lower-right, vast negative space in the middle.
Our home page is a direct adaptation of this composition with columns mapped:

| Fred (album) | Portfolio |
|---|---|
| SIDE → A / B / C / D | **TYPE** — BRAND / PRODUCT / MOBILE |
| NUMBER → [1] [2] | **NO.** — [01] [02] |
| WAVEFORM → audio strip | **WORK-RATE** — unicode block elements showing work intensity |
| TRACK TITLE | **PROJECT** |
| BPM | **CLIENT** |
| TIME | **DURATION** |

---

## Parameters (the spec)

### Aesthetic register

- **Single composition** that fits one viewport on desktop. Poster, not magazine.
  Scroll allowed on case studies and `/about`, never on `/`.
- **Pure black ground** (`#000`), warm cream ink (`#F8F8F8`). Solari amber
  (`#E8B25A`) only on truly-live signals — three places maximum.
- **Editorial discipline** — four type sizes total (~9.5 / 11 / 12.5 / 13px),
  three letter-spacings (flat / `0.08em` / `0.16em`), two weights (400 / 500).
  Hierarchy lives in color + weight + position, never in type scale.
- **Album-cover composition** — manifest at or near top, intentional negative
  space in the middle, colophon at the bottom. The empty space is *the design*.
- **Mono-only** typography — Geist Mono primary. No sans except as fallback.

### What's on the home

- **Masthead** — short. `rj` mark, two links (`index`, `about`). Nothing else
  up here.
- **Setlist of work** — six columns (TYPE / NO. / WORK-RATE / PROJECT / CLIENT /
  DURATION), small uniform type. The setlist *is* the page.
- **Colophon** at the bottom — `[Side A/B]` framed pill, the name + role + city
  as **metadata** (not headline), email + domain + listening signal (PixelEQ +
  Last.fm NowPlaying).
- **Vast negative space** between manifest and colophon. Inviolable.
- **Floating cover preview** on row hover — Rauno / Bureau Borsche pattern.
  Single fixed element, lerps toward the cursor.

### Voice

- Each project carries a **voice-memo-style subtitle** — parenthetical, lowercase,
  intimate. `la28 (when the weather speaks)`, `sift (what to keep)`,
  `gyeol (밤 늦게 — late at night)`. The work is titled like a song.
- **Work-rate waveforms are real** — each project has a 12-sample `workLog`
  array (intensities 0–7) mapped to unicode block elements. Schema designed for
  later live-data sourcing.
- A **signature** recurs across pages — one shape, phrase, or custom mark; same
  motif, different register on each page. Current pick: **the 12-bar work-rate
  strip** used three ways (home setlist / case-study poster / about cumulative
  curve). Pending Ryan's confirmation.
- **Time-aware** colophon — knows the hour, knows when the reader last visited,
  says so quietly.

### Motion

- **Patience** — transitions linger ~400–600ms. The page rewards waiting.
- **Slight-overshoot spring** — `cubic-bezier(0.34, 1.2, 0.64, 1)` on every hover.
  Reads as physical, not animated. Defined once as `--ps-spring` on `.ps`.
- **Live tag breathes** — WIP work pulses at a 3.6s opacity cycle.
- **Reader's body matters** — pointer trail, idle breath shift, scroll-aware
  noise floor. Boris-tier reactivity, but quiet. (Phase 3.)
- **Page-entry stagger** — header first, rows 50ms apart, all on the same spring.
- **Reduced-motion** users get a still version that still feels considered.

### Substance

- The site is built from Ryan's **actual life** — `madeWhile` (track Ryan was
  listening to), `lastTouched` (real timestamp), `process` (a sentence per
  project from when it was being made).
- **Voice-memo prose > brochure copy** — lowercase, intimate, casual specifics.
  No fabricated bio facts. If unknown, blank.
- Each project must have substance **before** it ships: subtitle, made-while,
  work-rate, eventually a real case-study surface.

### Anti-patterns (never)

- ❌ Display-size hero name ("RYAN JUN." in 100px type).
- ❌ Gradient blobs, glassmorphism, glossy effects, bento grids, hero videos.
- ❌ Music-player chrome as primary UI — no carousels, scrubbers, or track
  counters dominating the page.
- ❌ "Vibecode" look — pastel gradients, glossy buttons, AI-generated decoration.
- ❌ Generic dev-portfolio chrome — no command-K palette, fake terminal cursor,
  Linear-style polish-without-personality.
- ❌ Fabricated personal facts.
- ❌ Design *pivots*. The setlist composition is the floor; refine, don't
  replace.

### Success criteria

- A first-time viewer sees 3 seconds and **remembers one specific thing**.
- First visit reads as **"this is a person, not a system."**
- Third visit reads as **"there's more here than I noticed."**
- The site can be **put on in the background, like a record**.
- Nothing on the page screams. Every element earns its volume.

---

## Roadmap

Phases in dependency order. Each one is shippable on its own.

| # | Phase | Reference | Cost | What it gives |
|---|---|---|---|---|
| 0 | Pick the signature | — | conversation | North star for every other decision |
| 1 | **Aliveness layer** ✅ shipped | Brian Lovin, Tonsky | 1 session | Pulsing live tag, last-visit stamp, time-of-day shift, `workLog` schema |
| 2 | **Typography + motion signature** ✅ shipped | Rauno | 1 session | 4-size scale, spring token, row hover, entry stagger |
| 3 | **Voice-memo titles + made-while notes** | Fred | 1 session | Substance becomes visible; PROJECT column gets parenthetical subtitle; hover preview reveals one-line note from making |
| 4 | **Returning motif across pages** | Joe | 1–2 sessions | Work-rate strip becomes the recurring shape; same motif, different register, every page |
| 5 | **Reactive ambient** | Boris | 1 session | Pointer trails, idle breath, time-aware colophon richer. The page is alive in the room |
| 6 | **Patient hover** | Joe | 0.5 session | Every interaction slows from 320ms to ~600ms; site rewards waiting |
| 7 | **The set — opt-in audio** | Fred | 1 session | Play button; 4-track set, one song per project, waveforms animate in time; site becomes a listening session |
| 8 | **Case studies as zines** | All three | 2–3 sessions | Each project gets a single-composition page that carries its substance; the returning shape blooms here |

### Deprioritized (amplifiers, not substance)

These were in earlier plans. Held until substance is in place:

- 3D vinyl in the negative space (Mk.gee reference)
- Personal API edge routes (`/api/last-commit`, `/api/currently-reading`, etc.)
- Variable-axis typography moments (custom letterform / OPTYPE tied to scroll)

They amplify substance. Without substance to amplify, they're polish on a
generic body.

---

## Architecture notes

### Branch model

**Single branch** — `master` only. The `polish-main` and `departure-board`
branches were merged into master via PR #1 (commit `d9d534c`) and deleted from
origin on 2026-05-11. Future work goes on `master` or fresh feature branches
off `master`.

### Tech stack

- **Next.js 16** with Turbopack, React 19, TypeScript
- **Type tokens** (4 sizes / 3 letter-spacings / 2 weights) scoped to `.ps` in
  `src/components/HomeView.tsx`
- **Color tokens** live in `src/app/globals.css` (`--paper`, `--ink`, `--ink-2`,
  `--ink-3`, `--ink-4`, `--ink-hair`, `--ink-ghost`, `--accent`, `--accent-2`)
- **Motion token** — `--ps-spring: cubic-bezier(0.34, 1.2, 0.64, 1)` for every
  hover and entry animation on the page
- **`Piece` schema** in `src/constants/pieces.ts` carries the substance:
  `workLog: number[]` (12 samples, 0–7), `client`, `started`, `ended`. To add:
  `subtitle`, `madeWhile`, `lastTouched`, `process`.

### Files orphaned but kept

These exist in the repo but are not currently mounted on the home page. Decision
on removal pending:

- `PlaylistCarousel`, `ScrubberTimeline`, `TrackCounter`, `VUMeter`,
  `SegmentClock`, `ToggleSwitch`, `PercentageLoader`, `DitherCover`

### Brand constants

- **Name**: Ryan Jun (alias `rj`)
- **Domain**: `hyeonjunjun.com`
- **Email**: `rykjun@gmail.com`
- **Location**: New York
- **Active since**: 2024
- **Release codename**: Vol. 01 / RJ001

---

## Open questions

These need Ryan's input before the next phase begins:

1. **Signature direction confirmed?**
   My pick: voice-memo titles (Fred) + returning waveform motif (Joe), in
   combination. Other candidates: custom letterform, returning phrase, custom
   color, specific time.

2. **Audio?**
   Opt-in 4-track set ("the set" — one song per project)? Yes / no / later?

3. **Personal API?**
   Live data for `lastTouched`, `currentlyReading`, etc — or hand-edited JSON
   for v1?

4. **Sub-pages?**
   `/work`, `/studio`, `/contact` — keep as-is, redesign in the editorial
   register, or fold into `/`?

5. **Scroll on `/` ever allowed**, e.g., a second viewport-tall section "below
   the fold"? Or absolute discipline: single composition only?

6. **Web design references** — Ryan to send a curated reference set so the
   "Reference orbit → Web design" section can be filled in concretely.

---

## Retired directions (do not revive)

For session continuity — these were explored and rejected. Don't propose
returning to them without explicit request.

1. **Hara / wabi-sabi warm-paper monograph** — too quiet for the work.
2. **Stray Studio rebrand** — wrong brand identity; reverted to Ryan Jun.
3. **Departure-board (Solari split-flap)** — costume, not concept.
4. **Music-player chrome as primary UI** (PlaylistCarousel + ScrubberTimeline +
   TrackCounter + VUMeter) — "dilutes the taste." Music as system was too
   literal. Music as ethos is the answer.
5. **Editorial magazine** (long-scroll lede + currently + Pentagram index +
   notes) — too literal a translation of Brian-Lovin/Frank-Chimero. Wasn't
   single-composition enough.
6. **Display-tier hero name** (`Ryan Jun.` in 100px) — competes with the work
   manifest. The name is metadata, not headline.

Each retirement is informative: the next direction must avoid the failure mode
that retired the previous one.
