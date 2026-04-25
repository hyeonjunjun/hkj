# Studio Catalog — Design Spec

**Date:** 2026-04-24
**Status:** Draft — pending user review
**Supersedes:** [2026-04-24-stage-and-paper-design.md](./2026-04-24-stage-and-paper-design.md)
**Extends:** [2026-04-22-taste-polish-design.md](./2026-04-22-taste-polish-design.md)

---

## Goal

Retire the dual-register Stage/Paper architecture. Return to a single paper-grounded register, tuned to the narrow line between **Rauno Freiberg's editorial-engineer quietness** and **Joanie Lemercier's luminous-catalog restraint**. The portfolio reads as one voice throughout — a studio catalog, not a studio showcase.

## Why this change

The stage-and-paper implementation shipped 20+ commits of real craft but the outcome, in honest review, *performs* restraint rather than *embodies* it. A cinematic entrance, halation glow on media plates, dark-stage register for work pages, blur-in-transit on view-transitions, Gambetta-700 cinematic titles, and data-annotation scaffolds stacked together read as showmanship — the exact mode the user said this portfolio should not be in.

Contemporary portfolios that actually embody taste at senior level share one property: **one register, one voice, applied with devotion across every surface.** Rauno Freiberg, Paco Coursey, Joanie Lemercier, Craig Mod, Nendo's press pages — none of these sites switch personalities between "about me" and "work." They are quiet everywhere.

The positioning statement tightens:

> **An A/V-inspired design-engineer portfolio** that reads as a studio catalog — the heartfeltness of Craig Mod, the engineering rigor of Rauno Freiberg, the luminous restraint of Joanie Lemercier, grounded in Kenya Hara's *ma*. One register. One voice. Interactions as fine as Rauno's, content as luminous as Lemercier's, writing as earnest as Mod's.

The **ambience** the user named returns — not through a dark register, but through the Hara principle that every element on a page sits in an *active emptiness*. The paper grain, the microtype, the section breath, the long-exposure photographs in case studies: these are atmospheric, but they're atmospheric because of what's **absent around them**, not because of a theatrical frame.

## The Rauno–Lemercier line

These are the two magnetic poles. Our site sits on the line between.

| Rauno (editorial engineer) | Lemercier (luminous studio) |
|---|---|
| Paper ground | Paper ground (his site, not his installations) |
| Mono-first type | Serif + mono at reading sizes |
| Subtle 40×40px craft | Almost no interface at all |
| Archive-feeling lists | Monograph-style project pages |
| Keyboard-first navigation | Link-first navigation |
| "Here are the things I made" | "Here is a catalog of work" |
| Interactions carry the taste | Content carries the taste |

**Our synthesis.** Rauno informs the *interface* (how the site operates — restraint, keyboard fluency, hover hygiene, typography discipline). Lemercier informs the *content* (what's in the frames — luminous photographs, centered plates, quiet captions, whole-page breathing room). Neither informs the *pitch* — there is no pitch; this is a catalog.

---

## Principles

1. **One register.** Paper ground everywhere. No dark mode. No Stage. If a surface wants atmosphere, it's achieved through whitespace, type, and (where appropriate) long-exposure photographs — never through color shift or theatrical framing.
2. **One voice.** Every page feels made by the same hand on the same day. The transitions between routes are the same transitions; the typography on `/about` is the same typography on `/work/[slug]`; the reveal cadence on a case-study section is the same cadence on a notes detail page.
3. **No set pieces.** No cinematic entrance. No loading moment. No hero animation. The site opens as it lives.
4. **Interactions as marginalia.** Every micro-interaction is a piece of marginalia — small, tuned, felt-not-seen. A hover underline, a section reveal, a view-transition crossfade. Nothing larger.
5. **The content carries the luminosity.** Long-exposure photographs or quiet cover images do the emotional work on case studies. The interface holds them; it doesn't compete.
6. **Restraint through subtraction.** Every feature has to earn its weight. When in doubt, cut. Hara's emptiness is active material.
7. **`!` moments over ambient motion.** The site never moves on idle. Delight is placed, not flowed. Each page has one specific, hand-tuned detail that rewards careful reading.

---

## What stays · what goes · what tunes

### From `stage-and-paper` — retire in full
These get reverted to their pre-stage state or deleted entirely:

- **Dark Stage register.** `--stage*` and `--glow*` tokens removed from `globals.css`. The `html[data-register="stage"]` scoping CSS removed.
- **RegisterController.** Component deleted. The `data-register` attribute is no longer written.
- **CinematicEntrance.** Component deleted. No 1.1s overlay. No `sessionStorage` gating. No register crossfade at tail.
- **EntranceClickGate.** Component deleted. No click queuing (no entrance to queue against).
- **Halation on GutterStrip plates.** Inset glow-hair outlines, radial vignette `::after`, outer glow `box-shadow` — all removed. Plates return to their paper-ground lifting (a paper-tinted background, a `--ink-hair` edge).
- **Gambetta 700 on case study title.** Reverts to `var(--font-stack-mono)` weight 380 (paper-register setting).
- **Data-annotation `.case__annot` row above the plate.** Removed. The existing eyebrow (`Work · New York · year · №NNN`) already carries the data grammar; adding a second row was accretion.
- **Long-exposure smear on case-study plate arrival.** Reverted; the plate arrives as it did before the stage work — useSectionReveal handles all reveals uniformly.
- **Lateral drift section reveal on stage.** Reverted to the existing `translateY(8px)` vertical rise on all registers (there is only one register now).
- **Path-blur hover on `.cd__name`.** Removed. The existing opacity transition on `.cd__link` already carries the focus-shift grammar — the blur was added decoration.
- **Blur-in-transit on work-title view-transition.** Removed. The view-transition morph reverts to the taste-polish spec's default (approved ease-out-quart, no filter).
- **Cross-register `view-transition-class` rules.** Removed. Only one register exists; no cross-register transitions can fire.
- **Command palette.** **Retired.** See §13 for the reasoning. If the user disagrees, this is the single biggest flag in this spec.

### From `stage-and-paper` — preserve
- **All `!` moments.** The `!` moment practice was the one piece of stage-and-paper work that aligned with the new direction. Each hand-tuned detail survives.
- **TASKS.md documentation.** The `!` moment log stays and is updated to remove register-scoping language.

### From `taste-polish` (the prior spec) — preserve in full
Everything from [2026-04-22-taste-polish-design.md](./2026-04-22-taste-polish-design.md) remains:

- Fragment Mono + Gambetta (variable 300–800) — the two-face discipline.
- OpenType features (`onum` on prose, `tnum + lnum` on tabular).
- Tight en-dashes in experience ranges.
- Unified underline-color hover on links (`.prose a`, `.cd__mail`, `.about__mail`, `.card__handle`, `a.link`), arrow-glyph slide.
- `.shelf__row-link` NOT in the underline vocabulary (grid row, background-hover is its hover signal).
- Folio stamp per route (`HKJ / §0N / 2026`) — now paper-scoped only.
- Nav hide-on-scroll-down, reveal-on-scroll-up.
- View Transitions API (`experimental.viewTransition: true`), shared-element `work-title` morph between active `.cd__name` and `.case__title`.
- `useSectionReveal` hook and the vertical-rise 8px reveal on `.case__section`.
- Shelf Read/Watch/Keep/Visit verticals.
- `/colophon` typographic manifesto.
- `/notes` dated stream with running-head band on detail pages.
- `⌘K` footer hint on home — removed only if command palette is retired (see §13).

---

## The single register

### Color
The existing paper-and-ink palette, unchanged. No new tokens.

```
--paper:   #FBFAF6   (body ground)
--paper-2: #F4F3EE   (lifted plate ground)
--paper-3: #E8E7E1   (hairline-adjacent surfaces)
--ink:     #111110   (text, primary)
--ink-2:   #55554F   (prose body, secondary)
--ink-3:   #8E8E87   (meta, tertiary)
--ink-4:   #BFBEB8   (folio, near-subliminal)
--ink-hair: rgba(17,17,16,0.10)   (hairlines)
--ink-ghost: rgba(17,17,16,0.06)  (row hover tint)
```

No `--stage*`, no `--glow*`, no `--palette-overlay` token. Those files are purged.

### Typography
Fragment Mono + Gambetta, exactly as in taste-polish. No size/weight additions. Specifically:

- **Hero titles on `/work/[slug]`** — `var(--font-stack-mono)`, weight 380, size `clamp(32px, 4.2vw, 52px)`, letter-spacing `-0.012em`. No Gambetta 700 on stage titles — that was the theatrical move.
- **Case-study prose** — Gambetta at weight 380, size 17px, line-height 1.75.
- **Notes body prose** — Gambetta, same as case study.
- **Everything else** — Fragment Mono, size per existing scale, letter-spacing 0.22em when uppercased.

### Motion grammar

All motion is user-triggered or first-paint. Nothing on idle. The approved easing catalog holds — no additions:

- `cubic-bezier(.4, 0, .2, 1)` — default ease
- `cubic-bezier(.22, 1, .36, 1)` — ease-out-quart (reveals, wheel-snap)
- `cubic-bezier(.33, .12, .15, 1)` — hover-slide (arrow-glyph)
- `cubic-bezier(.41, .1, .13, 1)` — view-transition root

**Budgets:**
- Hover underline fade: 180ms
- Arrow-glyph slide: 200ms
- Section reveal (vertical rise): 280ms, 50ms stagger capped at 5
- Route crossfade: 300ms (single register, no 420ms stage extension)
- View-transition title morph: 420ms (default — no filter, no blur)
- GutterStrip wheel-snap: 920ms

**Rauno-adjacent additions welcomed if they're subtle:**
- A focus-ring that appears with a 120ms crossfade rather than instantly (keyboard navigation micro-craft).
- Inline link hovers can gain a hairline-underline-slide in addition to the color fade — width 0→100% over 160ms, cubic-bezier(.33,.12,.15,1). This is in the taste-polish backlog and can land now.
- Table rows / ledger rows can gain a ghost-background hover — 120ms fade — as a Rauno-style legibility cue. Already in use on shelf and notes rows.

**No cinematic set-pieces:**
- No entrance overlay
- No path-blur arrivals
- No smear or trace on heroes
- No opacity alternating by index
- No filter-based motion anywhere

### Layout

**Measure.** The existing max-widths hold: 640–820px on reading pages, 760px on case studies. Wider-than-reading pages become suspicious — the catalog is a measure-disciplined document.

**Composition.** Whitespace does the compositional work. Every page has an explicit `padding-top: clamp(88px, 12vh, 128px)` above the eyebrow, and a matching `padding-bottom: clamp(56px, 9vh, 96px)` at the foot. This vertical breathing is the ambience the user asked for — *yohaku no bi* applied to the time axis of a scroll.

**Case-study plate.** The existing `.case__plate` (cover image in an editorial frame with corner plate-marks + fig caption) stays — this is *exactly* the Lemercier-catalog presentation. Plate-marks (`HKJ / PL. №001`, `2026`) are marginalia, not chrome — they read as an archive print would. Keep untouched.

**Home.** Cathydolle-mirror-index + `GutterStrip` carousel **retired** (2026-04-25 update). The home is now a **scaling 2-column grid of uniform 4:5 media plates** — each piece's cover video or image at the same aspect, captioned below in mono microtype (number · title · sector). The grid grows `2 × n` as more pieces ship; sub-720px it collapses to a single column. Cover videos play only while in viewport (IntersectionObserver, threshold 0.35); reduced-motion clients see static posters. View-transition shared-element morph is named per-slug (`work-title-${slug}`) so multiple titles can coexist on the grid without collision.

The wheel-snap carousel was a clever interaction the site no longer needs. The grid is what a contemporary monograph catalog actually does — plates given documentary equality, no mechanism to learn, mobile works without effort, the visual rhythm comes from the work's own dimensions cropped to a uniform editorial frame.

---

## Interactions

The one place the taste-polish spec's Hara-leaning work really lived. Preserved in full:

- **Hover underline-color fade** on inline links and meaningful handles. 180ms. Global.
- **Arrow-glyph slide** on `.arrow-glyph` — 6px translateX on parent hover/focus-visible. 200ms, approved curve.
- **Section reveal** via `useSectionReveal` — 8px vertical rise + opacity, 280ms, 50ms stagger capped at 5. One treatment across all case-study and note-detail sections.
- **View-transitions** — 300ms root crossfade, 420ms shared-element `work-title` morph. No filter, no blur. The shared-element is Gambetta 380 to Mono 380 (same weight, different face) — that's the only typographic "morph" the site does.
- **Nav hide-on-scroll-down, reveal-on-scroll-up.** rAF-throttled, functional setState. Reduced-motion never hides.
- **Wheel-snap on GutterStrip** — 920ms cubic-bezier(.22,1,.36,1). Preserved.
- **Copy-email micro-state** — 1.2s "copied" flip. Preserved.

### New, optional (Rauno-flavored)
These earn their weight by being invisible until useful:

- **Hairline underline slide on inline links** (in addition to color fade). Not a replacement; both happen. Width 0→100% over 160ms. Only on `.prose a` and similar editorial anchors.
- **Tabular number stat tickers** — if any stat is present on a case study, the number animates from 0 to its final value over 600ms when its section reveals. Rauno-style *"numbers as characters with life"*. Only if numeric stats exist in the case study data; deferred if not.

Both of the above are **optional**, called out as judgment calls for user approval. Safe to skip if they feel like accretion.

---

## Components — what survives, what retires

### Survive, untouched
- `Folio.tsx` — paper-scoped again (remove the `html[data-register="stage"]` branch)
- `NavCoordinates.tsx` — remove the stage color rules; hide-on-scroll logic stays
- `GutterStrip.tsx` — remove halation CSS; mechanics and paper-adjacent media frame stay
- `CopyEmailLink.tsx` — unchanged
- `PaperGrain.tsx` — unchanged; this is the only atmospheric element that stays
- `CaseStudy.tsx` — revert the stage-palette remap, revert Gambetta 700, remove `.case__annot` row, remove lateral-drift reveal, remove hero smear; keep `!` moments (Gyeol 結 separator, Clouds coordinate line)
- `useSectionReveal` — unchanged; CSS reading `[data-revealed]` is the original vertical rise only

### Retire (delete files)
- `RegisterController.tsx`
- `CinematicEntrance.tsx`
- `EntranceClickGate.tsx`
- **Optionally**, `CommandPalette.tsx` (see §13)

### Clean up
- `globals.css` — remove all stage tokens, remove cross-register view-transition rules, remove the `html { background: var(--stage) }` override on data-register. Revert `--palette-overlay` removal depends on palette survival (§13).
- `layout.tsx` — remove RegisterController, CinematicEntrance, EntranceClickGate imports + mounts. Palette depends on §13.
- `page.tsx` — remove all `html[data-register="stage"]` CSS branches. Remove active-title `translateY(-1px)` stage scoping and rescope to unconditional (the baseline nudge `!` moment survives as a stand-alone rule). Remove path-blur hover keyframe and its media queries.
- `work/[slug]/page.tsx` — unchanged structurally.
- `about/page.tsx`, `shelf/page.tsx`, `contact/page.tsx`, `colophon/page.tsx`, `notes/*` — unchanged (they were always Paper).

---

## Signature dialect — preserved, but presented on paper

The stage-and-paper spec's §7 commitment to **long-exposure still photography** as the portfolio's recurring visual dialect stays. What changes is the presentation:

- Photographs display on paper ground, not dark stage.
- The plate that frames them is `.case__plate` with a `--paper-2` ground — exactly how Lemercier's own catalog presents his installation stills.
- Each photograph pairs with EXIF-grade metadata in the `fig` caption (`ƒ/8 · 30s · ISO 64 · dawn, Brooklyn`) — one line, Fragment Mono microtype, below the frame.
- The photographic commitment still holds: one per case study, four total, within 8 weeks. Or the B fallback (ASCII fields sampled from real natural data, captioned with source) — same commitment level, different medium.

The *ambience* the user named earlier in this conversation (music, clear skies, sunsets, wind, Hara's *ma*) lives in these photographs, not in the interface. An interface can't hold atmosphere authentically; a photograph of a real moment can. This is the honest architecture.

---

## `!` moments — all preserved

Each hand-placed per the prior spec; documented in `TASKS.md`. Restated here for continuity. On a paper-only site each one stops being register-scoped and just *is*:

- `/` — active row's `.cd__name` carries `translateY(-1px)`. Invisible systematically; felt on careful read.
- `/work/gyeol` — second eyebrow separator becomes `結`.
- `/work/clouds-at-sea` — `.case__coord` line shows `40°43′N 73°59′W · horizon dissolve`.
- `/about` — `::first-letter` drop cap on the argument paragraph ("I treat AI as a collaborator…").
- `/shelf` — Butterfly Stool year reads `"1954 –"` (open-ended — still present).
- `/colophon` — live `NEXT_PUBLIC_BUILD_SHA` build hash.
- `/notes/[slug]` — `runheadKeyword` shown at full ink in the running-head band.
- `/contact` — deferred (honest placeholder; better unfilled than faked).

---

## Cinematic entrance — definitively no

Removed. The site opens as it lives. No overlay, no wordmark, no `sessionStorage` gate, no register crossfade. This is the single biggest reversal and the most important one — a cinematic entrance was the most *performing-restraint* move in the prior spec.

The philosophy: **a studio catalog doesn't announce itself.** A monograph you pick off a shelf opens at whatever page the binding falls to. You don't watch a logo fade up before you can read. A visitor arriving at `/about` sees `/about` immediately. A visitor arriving at `/work/gyeol` sees Gyeol immediately. That's the move.

---

## Command palette — recommend retirement

**The case for retirement:**
- `⌘K` palettes are SaaS vocabulary. Linear, Raycast, Vercel, GitHub use them. Rauno, Paco, Lemercier, Mod, Nendo do not.
- A catalog is navigated with hands and patience. The visitor's choice to follow a link or open the nav is part of the reading.
- The palette was added in the taste-polish spec as a discoverability feature; its existence forced the `⌘K` footer hint, which reads as "technical creator signaling." That signaling is at odds with the studio-catalog register.
- Removing it cuts two dependencies (`cmdk`, `vaul`) and simplifies the layout.tsx / page.tsx surfaces.

**The case for keeping it:**
- It's invisible until invoked (`⌘K` or `/`). Users who don't use it don't feel it.
- Rauno does subtle keyboard fluency via arrow keys elsewhere; a palette is a cousin of that.
- If the site grows past four projects + a handful of essays, a palette gets useful.
- The user explicitly praised this addition at taste-polish time.

**Recommendation: retire.** If the user disagrees, flag in §17 and keep. If kept, the `⌘K` footer hint on `/` stays; if retired, the hint also goes.

---

## Phased revert plan (sketch — detailed plan follows spec approval)

Each phase is verifiable, non-breaking for other surfaces, and committed independently. Rough shape:

### Phase 1 — delete the set pieces
- Delete `CinematicEntrance.tsx` + `EntranceClickGate.tsx`
- Remove their mounts + imports from `layout.tsx`
- Remove `sessionStorage` gate references
- Remove `window.__hkjEntranceComplete` reliance in `CommandPalette.go()` (if palette survives)

### Phase 2 — retire the Stage register
- Delete `RegisterController.tsx`
- Remove `data-register` attribute writing
- Remove `--stage*`, `--glow*`, `--palette-overlay` tokens from `globals.css`
- Remove all `html[data-register="stage"]` CSS branches across `page.tsx`, `GutterStrip.tsx`, `NavCoordinates.tsx`, `Folio.tsx`, `CaseStudy.tsx`, `CommandPalette.tsx`
- Remove cross-register view-transition rules

### Phase 3 — revert case study to Paper
- Delete the `.case` local-token remap on stage
- Revert `.case__title` to mono weight 380
- Remove `.case__annot` row + its CSS
- Remove case-hero-smear keyframe + its media queries
- Remove lateral-drift section reveal variant
- Revert any blur-in-transit view-transition keyframes

### Phase 4 — optionally retire command palette
- Delete `CommandPalette.tsx`
- Remove mount from `layout.tsx`
- Remove `⌘K` footer hint from home
- Uninstall `cmdk` + `vaul` from `package.json`
- (If retained instead: keep everything as-is from palette-land)

### Phase 5 — polish cleanup + optional Rauno additions
- Verify all Paper surfaces render as they did before the stage work
- Optionally: hairline underline slide on `.prose a` links
- Optionally: stat-number tickers on case-study numerics
- Update `TASKS.md` `!` moment log (remove register-scoping language)

---

## Preservation — what survives untouched

- `taste-polish` spec — every feature it delivered still holds, except where stage-and-paper demolished and this revert restores.
- `!` moments — all 7 in-use plus the deliberately-deferred `/contact` one.
- Existing editorial pages (`/about`, `/shelf`, `/colophon`, `/notes`, `/contact`).
- GutterStrip wheel-snap + view-transitions shared-element.
- Fonts, tokens (paper-ink only), easing catalog (four curves total).
- All principles from TASKS.md §Principles-to-hold-against.

---

## Open questions — all resolved (2026-04-25)

1. ~~**Command palette — retire or keep?**~~ **Retired.** Mobile session deleted `CommandPalette.tsx` + `cmdk`/`vaul` deps. `⌘K` hint also removed.
2. ~~**Optional Rauno additions — ship in the revert, or defer?**~~ **Hairline underline slide on `.prose a` shipped** (paper marking-up, sumi-e-adjacent gesture). **Stat-number tickers permanently dropped** — wrong register; SaaS pitch-deck vocabulary, not catalog vocabulary.
3. ~~**Signature dialect — still committing to long-exposure photographs within 8 weeks?**~~ **Reframed as aspirational, no deadline.** Long-exposure photographs are the upgrade-as-they-arrive visual register; the portfolio ships excellent with existing media. ASCII fallback dropped — wrong register for paper monograph.

## Composition update — 2026-04-25

The user critique landed: even with the studio-catalog register, the cathydolle mirror-gutter + GutterStrip carousel was over-engineered. Replaced with a simple **2-column grid of uniform 4:5 plates**, scaling 2 × n as more pieces ship. The `GutterStrip` and `CatalogFrame` components retired entirely (~580 lines of code removed). The `.case__annot` data-annotation row above case-study plates also removed — it duplicated data already shown in the eyebrow + ledger + plate-marks. Hara's subtraction principle held all the way.

## Composition update II — 2026-04-25 (Asian-monograph refinement)

After 4 parallel research surveys (Asian + Western masters, Asian + Western portfolios) converged on a finding: the 2-col 4:5 grid sat in the *least-defensible* compositional territory. Contemporary practice clusters at small-plate dense grids OR full-column single plates per scroll-stop; the middle reads as editorial template. The studio-catalog/monograph register pulls hard toward the small-plate side, especially in the Asian-portfolio set (nendo, Daikoku Design Institute, Wang Zhi-Hong, studio fnt).

Changes:
- **Home header (eyebrow + studio-name h1) removed entirely.** Folio + nav carry studio identity in the chrome. Catalog opens immediately — *the index IS the home* (nendo move).
- **Plate aspect 4:5 → 1:1 (square).** Documentary equality across pieces; Daikoku/nendo tile rhythm.
- **Container max-width 920 → 760px.** Plates now ~360px square at desktop — Wang Zhi-Hong's "deliberately small so caption typography can stand" register.
- **Caption restructured to vertical stack.** Title on its own line above a meta row (number · sector · year).
- **Row gap > column gap.** ~64px row vs ~28px column, so each row gets its own breath.

Reference set the user studies: [daikoku.ndc.co.jp](https://daikoku.ndc.co.jp/), [wangzhihong.com](https://wangzhihong.com/), [nendo.jp/en](https://www.nendo.jp/en/), [joanielemercier.com](https://joanielemercier.com), [6a.co.uk](https://6a.co.uk).

---

## Verification criteria

For the revert plan:

- **V1** — zero references to `--stage`, `--glow`, `--palette-overlay` in the entire `src/` tree after phase 2.
- **V2** — `RegisterController`, `CinematicEntrance`, `EntranceClickGate` source files deleted. No imports remain.
- **V3** — approved easing catalog unchanged (the four curves).
- **V4** — two fonts total (Fragment Mono + Gambetta 300–800).
- **V5** — `html[data-register]` attribute is not present on any route.
- **V6** — site loads without an entrance overlay. First paint is the destination content.
- **V7** — GutterStrip renders with paper-tinted plates and `--ink-hair` edges. No glow, no vignette.
- **V8** — case-study title renders in mono, weight 380.
- **V9** — case-study reveal uses vertical rise 8px; no lateral drift.
- **V10** — view-transition title morph fires with 420ms duration, no filter.
- **V11** — all 7 `!` moments present and unchanged.
- **V12** — all Paper routes return 200 and render pixel-identical to their pre-stage state (modulo the `!` moments, which stay).
- **V13** — if command palette retired: `cmdk` + `vaul` gone from `package.json`, no `⌘K` anywhere.
- **V14** — `TASKS.md` `!` moments section updated to remove register-scoping language.
- **V15** — Core Web Vitals: LCP and INP on every route ≤ the taste-polish-baseline values.

---

## The closing frame

What this spec commits: the portfolio is a **studio catalog**, not a studio showcase. A visitor arrives into a single calm register, reads the work, follows the writing, feels atmosphere through ink-and-paper composition rather than theatrical framing. Lemercier's luminosity arrives through the photographs in the case studies. Rauno's engineering rigor arrives through the interface that frames them. Hara's *ma* is the ground everything sits on.

The palette is paper. The ink is ink. The voice is one. That's the direction.
