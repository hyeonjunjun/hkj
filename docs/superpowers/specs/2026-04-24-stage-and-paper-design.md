# Stage & Paper — Dual-Register Design Spec

**Date:** 2026-04-24
**Status:** Draft — pending user review
**Extends:** [2026-04-22-taste-polish-design.md](./2026-04-22-taste-polish-design.md)

---

## Goal

Shift the portfolio from a single editorial register to a **dual-register system** — a dark, luminous **Stage** for presenting work, and the existing mono-first **Paper** for writing — while retaining the design-engineer identity and extending the ma / music / natural-minimalism register locked in the prior spec.

## Why this change

The prior direction (paper-and-ink editorial, cathydolle-derived mirror index, Hara-lineage restraint) is coherent and correct for writing, thinking, and reading. It is not adequate for presenting real-time, generative, or media-heavy work — which, given the catalog (Clouds at Sea / Gyeol / Pane / Sift), is the actual weight of the portfolio.

The positioning claim is specific: this is **an A/V-inspired design-engineer portfolio, not an A/V studio portfolio.** The category stays ("design engineer"); the presentation register rises to the altitude where A/V studios like Universal Everything, Joanie Lemercier, Field.io, and takram sit. The move is underwritten by a claim about the moment:

> AI has collapsed the cost of technical exploration. The ability to ship a point-cloud depth-map or a path-blur generative hero is no longer a credential — it's a commodity. Taste is the remaining moat. A portfolio that demonstrates taste at A/V-studio altitude — while labeled and read as design engineering — reads as senior in the only way that matters in 2026.

The neighbours this creates, and the conversation this invites, are listed in §12.

## Principles

1. **Two registers, never mixed within a page.** Stage or Paper — not both. Crossing is the tell.
2. **Title + identity stay.** "Hyeonjoon Jun · design engineer" is preserved. The portfolio does not rebrand as a studio.
3. **AI collapses technique; taste is the moat.** Every decision is a taste decision, not a technical one.
4. **Restraint amplifies the work, decoration diminishes it.** Everything added has to earn its weight twice.
5. **The frame must meet the content.** An A/V frame around a thin case study reads worse than a plain card around a thin case study. This spec commits the content to meeting the frame.
6. **Nendo's `!` over Hara's emptiness.** Emptiness stays as the ground; the move is one small, specific surprise per page that makes the emptiness mean something.
7. **Music is registered, never played.** No audio. No waveforms. No oscillator-driven visuals. The musicality lives entirely in pacing, cut rhythm, and arrival.

---

## The Two Registers

### Stage — dark, luminous, generative-adjacent
**Routes:** `/`, `/work/[slug]`

**What it's for:** presenting work as *luminous objects on dark paper*. The work is the subject; the page is the gallery.

**Visual vocabulary:**
- Dark ground (`--stage`, single value)
- Luminous media with halation — object-as-altar photography, the perfume-bottle reference
- Data-annotation scaffold around every artifact (the Andrew Quinn workshop poster is the reference)
- Path-blur motion — trace, smear, long-exposure arrival
- Gambetta at high weight for hero titles (on dark, the serif reads as cinematic rather than editorial)

### Paper — mono-first, editorial, Hara-lineage
**Routes:** `/about`, `/shelf`, `/colophon`, `/notes`, `/notes/[slug]`

**What it's for:** thinking, reading, archiving. Studio writing.

**Visual vocabulary:** unchanged from the taste-polish spec. Paper ground, mono-first, Gambetta at reading weight in prose only, existing ease curves, existing reveal hook, existing folio.

### `/contact` — judgment call, flagged as open question
`/contact` is currently paper. It could arguably move to stage (the contact page is a gallery plate — one object, one moment). Recommendation: **keep paper.** The card-as-composition already works, and moving it would double the stage footprint without doubling the value. Flagged in §15.

---

## Tokens & Color Discipline

### Additions
```css
/* Stage register */
--stage:    #0A0A09;   /* warmer than pure black, continuous with --ink (#111110) */
--stage-2:  #14140F;   /* one tier lighter for card surfaces on dark */
--stage-3:  #1E1D16;   /* hairlines on stage */
--glow:     #F8F5EC;   /* luminous accent — a warm moonlight, not pure white */
--glow-2:   rgba(248, 245, 236, 0.55); /* same glow, damped */
```

### Discipline
- **Two palettes, one per register.** `--paper` / `--ink-*` drive Paper. `--stage` / `--glow` drive Stage. Never combined.
- **No third palette.** No acid accent colors (green, cyan, magenta). The glow is the only non-monochrome move, and it's still monochromatic — just warmer.
- **The existing paper-and-ink tokens are untouched.** Zero regression on Paper routes.
- **`--stage` is deliberately warmer than black.** Black + white reads as contrast; warmed dark + warmed glow reads as *light* — it's the difference between a gallery and a screenshot.

### What this rules out
- Per-project accent colors. The catalog reads as one voice.
- Gradients as ornament. A gradient is only permissible if it's a photograph — i.e., a real light source captured.
- Opacity as "softening." Every color is chosen; nothing is dimmed by 40% because it "felt too strong."

---

## Data-Annotation Grammar

The current microtype vocabulary (`HKJ / §04 / 2026`, `№NN`, tabular counts, shelf year columns) is already pointing at this. The extension is a coherent set of annotation primitives that frame work without decorating it — the Andrew Quinn workshop poster vocabulary applied with restraint.

### Primitives to add
| Primitive | Usage | Example |
|---|---|---|
| **Coordinate pair** | Positional marker on a plate | `40°43′N 73°59′W` |
| **Parameter value** | A named float, as if read from a node | `θ = 0.567408` |
| **Module label** | Short ALL-CAPS spaced tag | `PROC / FIELD-03` |
| **Frame/timecode** | For video artifacts | `00:14:22.08` |
| **Signal** | A one-line piece of real metadata | `∂ media · 3.7MB · h264` |
| **Crosshair** | Visual marker on media, not type | `+` at intersections |

### Rules
- **Every annotation must be real.** No lorem. `θ = 0.567408` is a fake on the workshop poster; ours are actual parameters of the real artifact. If Gyeol's b-roll runs at 30fps with a specific grade, the annotation says that. Otherwise it's performance.
- **Annotations sit in `--glow-2`** (damped glow) — present, not shouting.
- **Never more than 4 annotations per plate.** Beyond that it reads as VJ chrome.
- **Fragment Mono at 9px / 0.22em tracking** — the existing folio metric extended.

### What this replaces
The plate marks (`.plate-mark`) and eyebrow (`.eyebrow`) on Stage routes. On Paper, those keep their current styling.

---

## Motion Grammar

### Paper — unchanged
Everything from taste-polish holds: `var(--ease)`, the 180ms underline-color fade, the 200ms arrow-slide on `.arrow-glyph`, the 280ms section reveal, view-transition 300ms root / 420ms shared morph, the 920ms wheel-snap on the strip.

### Stage — a new vocabulary
The motion grammar shifts from *ease curves* to **trace, blur, decay**. Path-blur and long-exposure as visual philosophy.

#### Hover on a stage plate
Direction-aware motion blur that dissipates over ~320ms. The blur direction is derived from the cursor's approach vector (the vector from its previous `mousemove` to the element's bounding box). Implementation: a very subtle `filter: blur()` + `transform: translate()` on a clone layer that trails the plate for one frame.

Budget: 320ms total. Reduced-motion: static, no blur, no translate.

#### Arrival on a case-study hero
Long-exposure *smear* — the hero media arrives with a 1.5px horizontal motion trail that resolves over 480ms. Feels like a frozen moment of a moving shutter.

Budget: 480ms. Reduced-motion: instant.

#### Scroll into a stage section
Section arrives with a subtle lateral drift (±4px) + opacity fade, not the current 8px vertical translate. The direction of drift alternates by section index — section 1 drifts right, section 2 drifts left. Creates a breathing cadence, not a uniform stagger.

Budget: 360ms, 60ms stagger capped at 5. Reduced-motion: instant.

#### Navigation `/` → `/work/[slug]`
The existing view-transition shared-element on `.cd__name` / `.case__title` stays. On Stage, the root crossfade is extended to 420ms (was 300ms) because the darker ground needs a longer beat to feel cinematic rather than abrupt. The shared-title morph gains a **motion blur during transit** — a real `filter: blur(2px)` at midpoint that resolves to clean at end — which is the "path-blur in transit" that makes the whole thing read as a camera move, not a fade.

Budget: 420ms root + 480ms title morph. Reduced-motion: instant.

### New easing additions
None. The approved catalog holds — `cubic-bezier(.4,0,.2,1)`, `cubic-bezier(.22,1,.36,1)`, `cubic-bezier(.33,.12,.15,1)`, `cubic-bezier(.41,.1,.13,1)`. The blur/smear is achieved via `filter` and `transform` changes under existing curves, not new curves.

### The "no ambient motion" rule
**Preserved.** Every motion above is user-triggered (hover, arrival, scroll, navigation) or first-paint (see §9 entrance). Nothing moves on idle.

---

## Signature Dialect

The portfolio needs **one recurring visual move** that identifies it from five feet away. Three candidates — pick one, commit:

### A. Point-cloud / depth-map of natural form
**Lineage:** Kinect-aesthetic. Memo Akten, Kyle McDonald, early Ryoichi Kurokawa.
**What it looks like:** a grayscale point-cloud of a natural subject (breath, a hand, a cloud, wheat in wind) rendered with visible data density — either as a static frame at the hero of each case study, or as a single site-wide signature element that paused-mid-motion.
**Pros:** strongest technical signature — reads as TD-lineage most clearly. Pairs directly with the Andrew Quinn workshop poster reference. The data-annotation grammar layers on top of it naturally (every vertex is a real datum).
**Cons:** most technically expensive to produce well. Requires actual depth data or a convincing simulated equivalent. Risk: reads as "generic generative" if the source isn't specific enough.

### B. ASCII field sampled from natural phenomena
**Lineage:** Zach Lieberman's morning sketches, Everest Pipkin, the "data in nature" instinct the user named.
**What it looks like:** a low-density ASCII field placed once per page as a found object — but the field isn't decorative; it's a real sampling of something (dawn light intensity over 12 minutes, wind speed at a specific location, the spectral density of a bird call). The characters are the visualization; the caption is the data source.
**Pros:** continuous with the mono-first type vocabulary. Cheapest to produce. Most legibly "design engineer who thinks in code."
**Cons:** ASCII experiments were rejected in the prior session — the user was clear this wasn't the direction. Reviving them requires acknowledging why *these* are different (they're data, not decoration; they're static, not animated; they caption their source).

### C. Long-exposure still photograph
**Lineage:** Joanie Lemercier, Daisuke Yokota, Hiroshi Sugimoto's Seascapes.
**What it looks like:** one long-exposure photograph per case study — a frozen moment of natural motion (water over stone, headlights on a rural road, a bird's arc across dawn sky, light under a door). Printed at luminous density on the stage ground. Paired with its EXIF data as annotation (`ƒ/8 · 30s · ISO 64`).
**Pros:** statically rendered — zero ambient-motion risk. Photography is a medium distinct from the generative/type work already in the catalog, so it *adds* rather than overlaps. "Natural minimalism" the user named, made literal. Path-blur and trace motion grammar in the interface mirrors the long-exposure content — the form is self-similar.
**Cons:** requires the user to have or make the photographs. Not a generative move, so it doesn't signal "I can code this" the way A or B would.

### Recommendation
**C — long-exposure still photograph.** Reasons:
1. It's the cleanest match for the natural-minimalism / ma / music register the user has been grounding in.
2. It's the only option that doesn't risk violating the no-ambient-motion rule.
3. The interface motion (path-blur, smear, trace) is a visual rhyme of the content (long-exposure). The self-similarity is a compositional strength.
4. It's the hardest to fake — which means if done well it reads as taste, not technique. Exactly the moat the positioning stakes.

B is the backup. A is a stretch — only if the user wants to commit to producing real depth data, which is a project of its own.

**Flagged as open question §15 — the pick determines a lot.**

---

## Type

### Current
Fragment Mono (9–13px, all UI chrome, titles on Paper) + Gambetta (17px prose body only, `/work/[slug]` case studies, `/notes/[slug]` detail).

### Question
Does Stage need a third face for hero titles?

### Options
- **Add a chunky display sans.** Candidates: Migra, Pangram Sans Rounded, GT Maru, Söhne Breit. One weight, hero use only.
- **Push Gambetta to high weight on Stage.** Gambetta is variable — 700–800 weight on dark ground reads as cinematic serif, not editorial serif. Zero new font loads.
- **Stay with Fragment Mono at large sizes.** The current mono-first discipline held all the way up. Test at 48–88px on dark before assuming it fails.

### Recommendation
**Push Gambetta to weight 700 on Stage hero titles.** Reasons:
1. No new font load — stays inside the 2-face discipline.
2. Gambetta at high weight on a dark warm ground reads as *cinematic title card*, not *editorial serif*. It's the same face behaving differently in a different register — which is exactly what dual-register design wants.
3. Preserves continuity with `/notes/[slug]` (Gambetta body), so the two faces each serve one purpose across both registers.
4. A display sans would be the easy move and would date fast. Gambetta Black on dark will age better.

Pairs with Fragment Mono at existing sizes for all microtype (annotations, folio, nav). No change on Paper.

---

## The `!` Moment Practice

One **specific, hidden, unexpected detail per page** — Nendo's exclamation mark. This is a *practice*, not a component. It isn't systematized in tokens or primitives; it's a hand-tuned piece of design placed by judgment on each surface.

### Rules
- **One per page.** Two is a theme; one is a gesture.
- **Discoverable, not announced.** Nobody scrolling past should notice it; anybody reading carefully should.
- **Specific to the page.** It cannot be a site-wide feature.
- **Must serve the page.** Not decoration added on top — a micro-choice that deepens the reading.

### Examples for each surface
| Surface | Candidate `!` moment |
|---|---|
| `/` (home) | The active piece's title has a hand-tuned baseline shift of −1px that makes it sit slightly proud of the others, in addition to the opacity shift. Invisible until you notice it. |
| `/work/gyeol` | The eyebrow's `·` separators are replaced with `結` (Korean character for *gyeol*, meaning texture/grain) — the project's namesake character used as a literal grain of punctuation. |
| `/work/clouds-at-sea` | The hero's long-exposure still is paired with a coordinate annotation — and the coordinate is the exact location of the horizon line in the photograph. Technical caption as poetry. |
| `/about` | One paragraph's first letter has a half-line drop cap in Gambetta — hand-placed, invisible systematically, but it makes that paragraph read as the important one. |
| `/shelf` | One row's `year` field is a range instead of a year (e.g., `1954 – ` for the Butterfly Stool, signaling "still present in my life"). A tiny grammatical move that carries meaning. |
| `/colophon` | The `Build` SHA is set in Fragment Mono and is actually live — it changes per deploy. A rare small piece of *live* typography. |
| `/notes/[slug]` | The running-head band shows the note number + title *and* one em-dashed word — the single word that's load-bearing in the essay. A hand-picked keyword, not auto-generated. |
| `/contact` | Hover on the email handle, and the `@` glyph is replaced briefly with the coordinates `40°43′N 73°59′W`. Pokes at "where the correspondent writes from." |

These are candidates — the actual `!` moments get decided in implementation, not in the spec. What the spec locks is the **practice**.

---

## Cinematic Entrance (Preloader)

### Question posed
Should the portfolio have a preloader?

### Short answer
**Yes — but not as a "preloader" in the conventional sense. As a stage-establishing first frame.** Details below.

### Rationale

**Why it's worth adding:**
- It establishes the Stage register before any content shows — the visitor arrives into the dark, not into a white flash followed by a dark page.
- It's the most obvious place for the site's first `!` moment — the opening shot of a film before the scene begins.
- It's a *ma* move — the silence before the sound. The breath before speech. Philosophically continuous with everything the prior spec locked.
- Nendo and takram-adjacent sites use opening frames; Universal Everything, Field.io, Active Theory all use them. It's genre-appropriate for the altitude being claimed.

**Why a conventional preloader would be wrong:**
- Gating on asset load reads as performative — "wait to receive my importance."
- It punishes Core Web Vitals and returning visitors.
- It's the single most common "A/V studio pretender" tell. The exact line the positioning must not cross.

### Specification

**Runs once per session.** `sessionStorage.getItem('hkj.entered')` flag. First visit to any route in a browser session triggers the entrance; all subsequent navigations (same session) use the existing view-transitions directly.

**Non-blocking on assets.** The entrance is a *timed first frame*, not a progress bar. It runs for a fixed duration regardless of network. Assets load in the background; when the entrance resolves, they're either ready (nice) or not (the view fades in progressively as it would normally).

**Duration and shape:**
```
t = 0ms      Stage fades up from black — the --stage color establishes
t = 200ms    Studio mark (HKJ wordmark) arrives, --glow, centered, with a
             very slight motion blur that resolves over 240ms
t = 440ms    Wordmark holds, sustained
t = 900ms    Wordmark fades, stage remains
t = 1100ms   Route content begins arriving inside the stage
t = 1400ms   Transition complete
```
Total: ~1.4s on first hit, 0ms on subsequent. This is a budget, not a contract — the numbers get tuned at implementation.

**Reduced-motion:** skip entirely. Stage appears instantly, content renders normally.

**Paper routes on first hit:** this is a tension. If the first route is `/about` (a Paper route), does the dark entrance run? Two options:
- **Entrance runs on every first hit, then fades to Paper cleanly.** Establishes brand on first arrival regardless of deep link. More consistent. Risk: odd to see a dark moment before a paper page.
- **Entrance runs only when first route is `/` or `/work/[slug]` (Stage routes).** More coherent. Risk: visitors who deep-link to `/shelf` from a post never see the brand's opening statement.

Recommendation: **option 1.** The entrance is a brand move, not a register move. Even deep-linking to `/shelf` should see the studio identity established first. The entrance is always Stage; the destination is whatever route was requested.

### What's explicitly not being built
- No loading bar, percentage, spinner
- No "skip intro" button
- No audio
- No animated logo lockup
- No parallax / generative visual during the entrance
- Just: stage fades up, wordmark appears, wordmark fades, route arrives. Four moments.

---

## Preservation — what we keep from the prior session

Non-negotiable. Everything from `2026-04-22-taste-polish-design.md` remains:

- Fragment Mono + Gambetta (2 faces) — **Gambetta gains a high-weight usage for Stage hero titles**
- Approved easing catalog: `cubic-bezier(.4,0,.2,1)` / `(.22,1,.36,1)` / `(.33,.12,.15,1)` / `(.41,.1,.13,1)` — no additions
- Paper-and-ink token system for Paper register — untouched
- Folio stamp per route — existing behavior, appears in both registers
- View-transitions API wiring — extended (longer duration + blur on Stage)
- `useSectionReveal` hook — used on Paper; Stage has its own motion but can share the hook
- CommandPalette (cmdk, `⌘K`) — unchanged, works across both registers, background is `--paper` (doesn't shift to stage even in Stage routes, stays coherent with its identity as a writing-style tool)
- `/notes`, `/colophon`, `/shelf`, `/about`, `/contact` — Paper register, unchanged
- `GutterStrip` wheel-snap on `/` — media treatment shifts (see §4 motion grammar), mechanics unchanged
- Hover vocabulary (underline-color fade on links, `.arrow-glyph` slide) — unchanged on Paper; Stage uses its own (path-blur)
- The `!` moments already added (⌘K footer hint, running-head on notes, etc.) — all preserved, counted as the existing `!` moment for those surfaces

---

## Neighbours

If this lands, the portfolio no longer sits with "personal design-engineer portfolios" alone. The conversation widens:

**Design engineers at A/V-adjacent altitude:**
- [Rauno Freiberg](https://rauno.me) — Vercel, product-engineering rigor in archival presentation
- [Paco Coursey](https://paco.me) — same seam
- [Bruno Simon](https://bruno-simon.com) — WebGL as a design-engineer signature
- [Jordan Singer](https://jsngr.xyz) — design + AI + tools

**A/V studios that read as credible "thinking" practices:**
- [Joanie Lemercier](https://joanielemercier.com) — light and landscape
- [Ryoichi Kurokawa](https://ryoichikurokawa.com) — A/V, data + glitch + nature
- [Universal Everything](https://universaleverything.com) — dark + generative + choreography
- [Nonotak](https://nonotak.com) — light installations
- [Field.io](https://field.io) — design-and-technology studio
- [takram](https://takram.com) — design innovation firm, Japanese lineage

The portfolio aspires to be legibly of the first group — a design engineer — while having the presentation altitude of the second. That is the positioning.

---

## Phased Rollout

### Phase 1 — Tokens and Stage foundation
- Add `--stage`, `--stage-2`, `--stage-3`, `--glow`, `--glow-2` to `globals.css`
- Add a body-level `data-register` attribute that routes set via layout or directly on their `<main>` element
- Add `html[data-register="stage"]` and `html[data-register="paper"]` rules; all Stage-specific styling scopes to the former
- No visual change yet — foundation only
- Verification: type check clean, all routes render paper (no regression)

### Phase 2 — Home stage
- Home (`/`) shifts to `data-register="stage"`
- `--paper` references in `src/app/page.tsx` replaced with `--stage`
- `--ink` references replaced with `--glow`
- `GutterStrip` media treatment updated: halation, luminous object presentation
- Path-blur on `.cd__name` hover (direction-aware)
- Mirror-index mechanic preserved; visual skin only

### Phase 3 — `/work/[slug]` stage
- Case studies shift to `data-register="stage"`
- `CaseStudy.tsx` gets a dark theme: `--stage` ground, `--glow` body text, Gambetta at weight 700 for h1
- Hero media gains halation + long-exposure smear on arrival
- Data-annotation layer: add `case__coord`, `case__param`, `case__signal` primitives
- Signature dialect (long-exposure still if C is picked) replaces current hero image pattern

### Phase 4 — Cinematic entrance
- New `CinematicEntrance.tsx` component mounted in `layout.tsx`
- `sessionStorage` gating; runs on first route hit
- Dark stage → wordmark → resolve into route
- Reduced-motion skip

### Phase 5 — `!` moment audit
- Walk every page, place exactly one hand-tuned detail per surface
- Document each in TASKS.md so they aren't accidentally removed in future refactors

Each phase ships independently. Paper routes never regress.

---

## Risks

**Taste exposure.** The Stage register amplifies both strength and weakness. A dark-luminous case study with thin content reads worse than a plain card with thin content. This commits the user to bringing each case study's content to meet the frame — Pane and Clouds at Sea need real write-ups before their Stage plates can ship well. Flagged as a content-debt accelerator, not a concern about the design direction.

**Positioning legibility.** "A/V-inspired design engineer" is a narrower audience than "design engineer" alone. If the user's primary goal is broad job-market discoverability (general SaaS / product roles), this direction reduces that surface area. If the goal is specific — senior hires at design-forward agencies, creative-tech studios, or lead roles — it increases precision and reduces noise. Needs to be confirmed.

**Performance vs. cinematic budget.** Filters (`blur()`), shared-element view transitions, and the cinematic entrance all cost frames. On mobile, particularly mid-range Android, these can drop below 60fps. Mitigation: use `will-change` / `contain` carefully, gate expensive motion behind `@media (min-resolution: …)` or a simple user-agent width check, always ship a reduced-motion fallback.

**Discoverability of `!` moments.** By definition, these are hidden. If nobody finds them, they're dead weight. Mitigation: they're not dead weight even if undiscovered — they're the difference between *hand-made* and *template*. A careful reader feels the difference even without identifying it.

**Lock-in on signature dialect.** Picking long-exposure still (C) means committing to producing real photographs over time. If the user isn't a photographer yet, this is a craft commitment. Mitigation: one photograph per case study is 4 photographs total. Achievable. The photographs also become material for `/notes`.

---

## Open Questions for User

These must be resolved before `writing-plans` can begin:

1. **Signature dialect: A (point-cloud), B (ASCII-data), or C (long-exposure still)?** Recommendation: C. Lock this before Phase 3.
2. **Type addition: Gambetta at 700 on Stage, or a new display sans?** Recommendation: Gambetta at 700.
3. **`--glow` accent: warm moonlight (#F8F5EC as specified), a specific signal color, or something else?** Recommendation: warm moonlight — preserves the monochrome discipline.
4. **`--stage` exact value: `#0A0A09`, deeper (#070706), warmer (#0E0D09)?** Recommendation: the warmer end — `#0E0D09` or `#100E08`. Pure black reads as web, warmed near-black reads as theatre.
5. **`/contact` register: Paper (current) or Stage?** Recommendation: Paper. `/contact` is writing grammar, not exhibition grammar.
6. **Cinematic entrance on first-hit to Paper routes: run it anyway (option 1) or only on Stage first-hits (option 2)?** Recommendation: option 1. Brand move, not register move.
7. **Cinematic entrance duration: the proposed 1.4s budget — feels right, too long, or too short?**
8. **Is the phased rollout acceptable, or should Phases 2–4 ship as a single slice?** Recommendation: phased. Each phase is verifiable independently.

---

## Verification Criteria

For the eventual plan derived from this spec:

- **V1:** No tokens added beyond `--stage-*` and `--glow-*`.
- **V2:** No easing curves added beyond the approved four.
- **V3:** No third typeface loaded (Gambetta at weight 700 reuses the existing variable file).
- **V4:** All Paper routes render pixel-identical before and after Phase 1 (token foundation).
- **V5:** Every Stage route sets `data-register="stage"`; every Paper route sets `data-register="paper"` or no value.
- **V6:** Cinematic entrance runs ≤ 1× per session via `sessionStorage` flag.
- **V7:** Reduced-motion disables: entrance, path-blur, long-exposure smear, all filter-based motion. Site still navigates and reads.
- **V8:** Core Web Vitals: no regression on LCP or INP for Paper routes; Stage routes measured separately with an acceptable degradation budget (≤ 10% on LCP).
- **V9:** One `!` moment per page, documented in TASKS.md.
- **V10:** `GutterStrip` wheel-snap mechanics unchanged from current behavior.
- **V11:** CommandPalette, Folio, `⌘K` hint, view-transitions all preserved and functional across both registers.

---
