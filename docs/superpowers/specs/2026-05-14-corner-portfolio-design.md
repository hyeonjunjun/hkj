# Corner Portfolio — Ryan Jun (Design)

**Date:** 2026-05-14
**Deadline:** May 23, 2026 networking event (9 days)
**Status:** Direction locked after 7+ prior iterations. Honest critique applied — terminal costume layer dropped. **stray** studio framing also parked — this is *personal*, just Ryan Jun.

---

## 1. Concept

A **corner portfolio**: a quiet, monospace, vertical column where Ryan Jun shares his work and his thoughts as a feed of dated notes. The form gets out of the way so the voice can land. Over time the corner accumulates — that accumulation is the trailblazer / star / name-recognition path, not the single-page spectacle.

The portfolio is **personal**, not studio-branded. Pure Ryan Jun. The "stray" studio framing is parked — it may return later when there's a team or a body of work to operate as a studio, but right now this is one person's small corner of the internet.

The signature element — the meme-able detail that travels in screenshots — is a **zero-audio audio player**: a persistent on-page fixture that displays a rotating playlist of song titles + artist + runtime metadata, with NO actual audio. Solves the copyright constraint cleanly; signals music-coded BTS / Fred Again sensibility; gives a Twitter-thread-able weirdness without gimmickry overshadowing content.

**Three qualities the page must carry** (added 2026-05-14 — without these, the corner reads too bare):
- **Details** — micro-craft moments that reward looking closely (tabular numerals, considered hover states, asterisk dividers, micro-typography, a build-hash flourish, a live indicator)
- **Motion** — subtle, ambient, never aggressive (stagger-fade entrance, view transitions, audio-fixture title cross-fade, cursor wake, a faint drifting background element)
- **Ambience** — atmosphere through texture and color, not spectacle (paper grain, light/dark parity, very-slow time-of-day color drift, generous breathing room in type)

## 2. Reference corners

These are the *actual* corners that work — corners by accumulation, unadorned, not performing a craft costume:

- **Tomoya Okada** — small personal corner; minimal page chrome but craft-rich details, subtle motion, and atmospheric quietude. The closest reference for the *details + motion + ambience* layer we want.
- **Robin Rendle** — 900+ numbered notes under a small bio.
- **Maggie Appleton** — digital garden with consistent notes.
- **Craig Mod** — scholarly-journal cadence, asterisk dividers, dated everything.
- **Patrick Collison** — minimal text site, named things you can click.
- **Maciej Cegłowski (Idle Words)** — pure text, voice in the writing.
- **Flora Guo** — dictionary-entry framing + writing/notes archive.

None of them perform a "terminal" costume. All of them have **monospace or near-monospace typography, a vertical column, and writing** — with Tomoya Okada specifically the precedent for layering in motion + ambience without losing the corner spirit.

## 3. Rejected during this brainstorm (do not reintroduce)

- **Terminal / SSH costume** — `ryan@stray:~$` prompts, fake `ls projects/`, command-line theater. Rejected because: saturated genre; demands a curt voice that contradicts Ryan's actual atmospheric / music-coded range; reads as defense mechanism.
- **Actually SSH-able server** — parked. Could ship later as a separate viral drop, but not the corner move.
- **Single-viewport hero** (from the 2026-05-12 dark-tracklist lock) — corners don't lock content to one viewport; the feed needs to scroll.
- **Cloud-gazing / pareidolia sky** (earlier this session) — soft, poetic, did not signal star / presence / viral.

## 4. What gets reused from prior work

The 2026-05-12 dark-tracklist lock built infrastructure that fits this direction *exactly*. We do not restart.

| Asset | Status in corner portfolio |
|---|---|
| 10-role `t-*` mono-only type framework (Departure Mono primary, Geist Mono fallback) | Reused as-is |
| Color register (pure black + cool off-white + rationed Solari amber accent) | Reused; corner is dark-default with light-mode parity |
| `PaperGrain` `mix-blend-mode: overlay` 0.06 | Reused as ambient texture |
| Light/dark toggle | Reused |
| `PixelEQ` 5-bar pixel art component | Reused inside the audio player |
| Speed-line cursor wake | Reused as ambient |
| `Preloader` (cloud-ASCII curtain with drifting lede words) | Reused, once-per-session |
| Route transition view-transition `rj-mark` | Reused on the masthead element |

What gets retired:
- Setlist-as-hero single-viewport composition
- 3-column home body (setlist · active image · intro+meta)
- AR panoramic exploration components
- Cloud-gazing spec / sprite pipeline

## 5. Page composition

The home page (`/`) is the whole corner. Structure top-to-bottom:

1. **Masthead** — `RYAN JUN` (one line, mono, small caps lockup using existing `t-monument` or `t-statement` role). No co-naming; just the principal.
2. **Identity strip** — a one-line description of who/what/want, written in the user's voice. Editable like a `now`-page header. *(Content authored during the 9-day sprint, not in this spec.)*
3. **Playing-now line** (the zero-audio audio player) — persistent, single-line treatment: `▶ track-title — artist · 03:42` with PixelEQ bars idling. Rotates a curated playlist on a fixed interval (e.g. cycle every 12s) so the rotation is visible without being noisy.
4. **Notes feed** — reverse-chronological vertical list. Each note row is a single line:
   `N042  2026-05-14  process  on staying in one place  ↗`
   Numbered, dated, category tag, title, arrow that indicates clickable detail.
5. **Footer / colophon** — quiet. `ryan jun · independent practice · © 2026`. Live time. Theme toggle. Build hash micro-flourish.

That's the whole page.

## 6. Notes — categories, structure, detail

**Initial categories (auto-pick — user may override):**
- `project` — case-study writeups of work
- `process` — short thoughts, sketches, fragments in progress
- `log` — terse changelog of what was shipped this week / month

Three is enough variety to feel alive, not so many you can't fill them. Robin Rendle uses one undifferentiated stream; Flora uses several. Three is the middle path that fits a 9-day launch.

**Index row** (the feed line):
`NNNN  YYYY-MM-DD  category  title  ↗`
- `NNNN` — monotonic note number, letter-prefixed catalog style (e.g. `N001`, `N002`, …) consistent with existing USB001-style colophon convention
- Date in ISO YYYY-MM-DD
- Category tag (lowercase, mono)
- Title in `t-row` weight, sentence case
- Arrow glyph that's also the click target

**Detail page** (`/notes/[slug]` — slug is canonical; the `NNNN` number is presentational only):
- Same masthead and audio fixture as home (continuity)
- Above the fold: note header — number, date, category, title
- Body: long-form text in `t-prose` with mono support for code/quotes
- Below: back to corner link, optional next/previous note
- Project notes can embed images/video; process and log notes are mostly text
- View-transition continuity from feed row to detail header

**Seed content for May 23 launch (minimum):**
- 1 project note (one of: Sift, Halo Halo!, Gyeol — full case-study with images)
- 1 process note (short, on something Ryan is thinking about — voice-rich)
- 1 log note (what shipped this week, including this corner launch)

## 7. Zero-audio audio player — design

**Premise:** the player displays the metadata of a song *as if it were playing*, but the page never emits audio. Copyright-safe by construction.

**Single-line layout (v0):**
```
▮▮▮▮▮  ▶  Sevdaliza — Marilyn Monroe  ·  03:21 / 04:14
```
- PixelEQ bars on the left (already built; cycle pre-baked patterns at 150ms)
- Play glyph (static, just for affordance — clicking does nothing or pops a small note explaining the conceit)
- Track title — artist
- Faux progress: `mm:ss / mm:ss` showing a position that advances slowly toward the runtime, then rotates to the next track

**Rotation:**
- Curated playlist of **8 tracks** target (held in `playlist.ts`)
- A track "plays" for its declared runtime, then rotates to the next
- Tab-visibility-aware: rotation pauses when `document.hidden`
- No persistent state across refreshes (each load picks up wherever the rotation is in real time, computed from a fixed epoch)

**Why this is the signature:**
- It's the meme-able detail. Someone screenshots `▶ Fred Again — Adore U · 02:48 / 03:34` and asks "wait, does this actually play music?" — and the answer reveals the conceit.
- It signals music-coded BTS/Fred Again sensibility without requiring on-site audio.
- It makes the corner feel inhabited — there's always *something* playing, even when no one is reading.

**Placement:** under the masthead, above the identity strip. Always visible without competing for attention.

**Click affordance (v0):** clicking the play glyph opens a small tooltip/popover: `"this player has no audio. (copyright.) the titles rotate."` This makes the conceit explicit when probed.

## 7.5 Details, Motion, Ambience (Tomoya Okada layer)

Without this layer, the corner reads bare. With it, the corner has craft. Three sub-layers, each restrained.

### Details

Micro-craft moments that reward looking closely. Each one earns its place; none are decoration.

- **Tabular numerals** everywhere numbers appear (note numbers, dates, runtimes, time live). Existing `.tabular` modifier.
- **Asterisk dividers** between note groups by month/year in the feed (Craig Mod move). Three asterisks centered, generous whitespace above/below.
- **Live indicator** — small dot pulsing slowly next to the live time in the footer. Solari amber accent (rationed). One of the three accent placements.
- **Build hash** in the footer corner (`build · a3f1d7c`) — engineering tell without performing engineer-coded identity.
- **Hover micro-motion on note rows** — title shifts 2px right, arrow rotates 8°. 180ms. Cubic-bezier(.22, 1, .36, 1).
- **Considered colophon hover** — date in a row shows `2026-05-14 · 1 day ago` on hover. Existing tabular numerals.
- **Italic Newsreader** accent for the one-line identity strip ONLY. Existing serif accent usage.
- **OG image** auto-generated per note with the same masthead lockup + note title + number. Existing OG pulse.

### Motion

Subtle, ambient, never aggressive. The page should *feel alive*, not animated.

- **Stagger-fade entrance** on note list items at first paint. 12ms stagger per row, 280ms fade + 4px translateY each. Triggered once per page load, not on scroll.
- **Audio fixture title cross-fade** when a track rotates: outgoing title fades 240ms while incoming fades in 240ms, 80ms overlap. No layout shift (fixed width allocated for max-width title).
- **PixelEQ bars** — existing 150ms tick, no change.
- **Cursor wake** — existing speed-line cursor, retained as ambient.
- **View transitions** — `rj-mark` from masthead, `note-NNNN` per note row carrying the row's title block into the detail page header. Existing 520ms cubic-bezier(.22, 1, .36, 1).
- **Audio fixture click feedback** — play glyph 1.06× scale punch on click, 120ms.
- **Reduced-motion** — all of the above respect `prefers-reduced-motion`: stagger collapses to instant; cross-fade collapses to instant swap; cursor wake disabled.

### Ambience

Atmosphere through texture and color. No weather, no particles, no clouds.

- **Paper grain overlay** — existing `PaperGrain` at 0.06 mix-blend overlay. Static. Works on both dark and light.
- **Very-slow color drift** — a near-imperceptible hue shift on the background base over a 20-minute cycle (e.g. dark register subtly warms toward dusk-amber and cools back). Amplitude small enough that a screenshot doesn't show it, but a long visit feels lived-in. Optional — can ship without if budget tight.
- **Light/dark parity** — both themes must carry the *same* corner feeling. Light is the user-default per prior preference; dark exists as alternative.
- **Generous breathing room** — line-height 1.6 in `t-prose`, 80ch max measure on detail pages, big top margin on the masthead.
- **No moving images on the home feed** — atmosphere comes from type and color, not video.

## 8. Component boundaries

Each unit has one clear purpose:

- **`CornerPage`** — owns the page layout (masthead → audio fixture → identity strip → notes feed → footer). Knows nothing about note internals.
- **`Masthead`** — renders `RYAN JUN` lockup. Hosts the `rj-mark` view-transition-name for cross-page continuity. Pure presentation.
- **`AudioFixture`** — renders the zero-audio player. Owns the playlist rotation logic and the PixelEQ animation. Self-contained.
- **`IdentityStrip`** — renders the one-line description. Editable via MDX or a constants file.
- **`NotesFeed`** — given a list of note frontmatter, renders the indexed rows. Pure list.
- **`NoteRow`** — given a single note's frontmatter, renders one feed row. Pure presentation.
- **`NoteDetail`** — given a note's MDX content, renders the detail page. Reuses `Masthead` and `AudioFixture`.
- **`useRotatingPlaylist`** — pure hook: given a playlist + epoch, returns `(currentTrack, positionSeconds)`. Easily unit-testable.

## 9. Content authoring model

Notes are MDX files in `src/content/notes/` with frontmatter:

```yaml
---
number: 42
date: 2026-05-14
category: process
title: on staying in one place
slug: on-staying-in-one-place
---
```

Build time:
- Read all `.mdx` files under `src/content/notes/`
- Sort by `date` desc, then `number` desc
- Pre-render the feed and individual note routes

This is the simplest CMS — files on disk. No DB, no headless CMS. Ryan can write a new note by adding a markdown file and pushing.

## 10. Performance and quality bar

- LCP < 1.5s on cold load (text-first page; near-trivial)
- Audio fixture: no setState per frame; rotation runs off a single timestamp computation
- View transitions on masthead from `/` → `/notes/[slug]` and back
- Preloader runs once per session (existing behavior)
- Accessibility:
  - Notes feed is semantic `<ol>` with `<li>`
  - Audio fixture is `aria-hidden="true"` for the rotating track display (announcing a new title every ~12s is disruptive). A single sr-only `<span>` adjacent to the fixture explains: *"This is a silent music-metadata fixture. No audio plays. Track titles rotate visually for atmosphere."*
  - PixelEQ bars are decorative; mark `aria-hidden`

## 11. Phasing — 9-day sprint to May 23

Sketch only; details belong in the implementation plan from writing-plans skill.

| Days | Phase | Deliverable |
|---|---|---|
| Thu–Fri May 14–15 | **Identity** (hardest content task — do not slip) | One-breath statement of who/what/want. Masthead lockup decided. Initial playlist curated (8 tracks). |
| Sat–Sun May 16–17 | **Skeleton + retire prior** | Page scaffolded: `Masthead`, `AudioFixture` static (no rotation yet), `IdentityStrip`, empty `NotesFeed`. Reuses existing typography + color. **Retire** prior home components no longer in use (single-viewport hero, 3-column body, AR panoramic exploration, cloud-gazing scaffolding if any). |
| Mon May 18 | **Audio rotation** | `useRotatingPlaylist` working, PixelEQ wired, click affordance shipped. |
| Tue May 19 | **Notes feed** | MDX content pipeline, frontmatter loader, `NoteRow` + feed rendering with 1 seed note. |
| Wed May 20 | **Note detail** | `/notes/[slug]` route, MDX rendering, view transitions wired. |
| Thu May 21 | **Seed content** | All 3 seed notes written (1 project, 1 process, 1 log). |
| Fri May 22 | **Polish + deploy** | Light/dark parity, theme toggle, footer, deploy to production. Pitch rehearsed. |
| **Fri May 23** | **Networking event** | URL + one-breath pitch. Ready. |

## 12. Open questions (resolve during the plan, not now)

- Exact masthead form: one-line vs two-line?
- Audio fixture placement: under masthead vs floating bottom-right?
- Click-on-play-glyph behavior: tooltip-only vs small modal explaining the conceit?
- Whether category tags are filterable in the feed (probably YES for v1.1, NOT for v0)
- Whether to keep `Preloader` and `PaperGrain` on every page or only `/`
- Domain & deployment: existing domain or a new `stray`-flavored one?
