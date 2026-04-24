# Portfolio — Tasks & Updates

Working document. Captures the current design direction, what's shipped,
and what's next. Updated 2026-04-22.

## Direction

**Studio catalog, not observation log.** The portfolio presents made
objects as plates — each piece given documentary equality. Voice is
neutral and past-tense, not field-notes. Tactility lives in static
paper grain + micro-typography, not in ambient motion.

**Reference lineage** (from [/shelf](src/app/shelf/page.tsx)):

- Kenya Hara — *Designing Design* — emptiness as active material
- Morrison & Fukasawa — *Super Normal* — documentary equality
- Dieter Rams / Vitsœ — restraint as the hardest design move
- Rauno Freiberg — craft in 40×40px details
- Emil Kowalski — shipped components over packaging
- Cathy Dolle — mirrored numbered index (the home mechanic)
- Muji / Teenage Engineering — manual-design discipline
- Craig Mod — scholarly-journal cadence on a personal site

**Principle**: every animation is triggered by a user action or a
first-paint event, never on idle. 120–400ms windows. Respect
`prefers-reduced-motion`.

**Voice**: simple, minimalist, confident. The shelf title sets the
register — *"A list of resources I refer to."* Same grammar across
pages: an article, a noun, a first-person verb. Not poetic, not
performative. No adjectives where a noun will do.

---

## Shipped — 2026-04-22 session

### Direction shift
- Metadata descriptions and OG card register swapped from
  "Observation log" → "Work from the studio" in
  [layout.tsx](src/app/layout.tsx) and
  [opengraph-image.tsx](src/app/opengraph-image.tsx).

### Paper and motion
- Deleted `AmbientAscii.tsx` (full-viewport flow field) and
  `CornerStamp.tsx` (reticle). No ambient motion anywhere.
- Deleted `AmbientGarden.tsx` (five box-drawing pictograms).
- Added [PaperGrain.tsx](src/components/PaperGrain.tsx) — single static
  SVG turbulence filter, 0.055 opacity, mix-blend-multiply. Mounted
  globally. Zero rAF cost.

### Microinteractions
- Added [CopyEmailLink.tsx](src/components/CopyEmailLink.tsx) — click
  to copy, 1.2s "copied" micro-state, falls back to mailto on
  unsupported browsers. Wired into homepage foot and contact card.
- Plate press on `GutterStrip` — `scale(0.988)` over 240ms on hover,
  honors reduced-motion. [GutterStrip.tsx:294-306](src/components/GutterStrip.tsx#L294-L306).

### Cleanup
- Homepage footer reworked from `flex` + spacer to
  `grid-template-columns: 1fr auto 1fr` with a centered
  `design engineer` tagline between email and location.
- `AmbientGarden` homepage-only scoping became moot after deletion.
- Dead `SOCIALS` alias removed from [contact.ts](src/constants/contact.ts).
- `EXPERIENCE` moved out of [about/page.tsx](src/app/about/page.tsx) into
  [constants/experience.ts](src/constants/experience.ts). Unattributed
  roles drop the `org` field entirely rather than carrying empty strings.
- Softened cathydolle note on [shelf.ts](src/constants/shelf.ts) from
  "the mechanic this site borrows" to a less self-footnoting line.

---

## Retired this session (do not re-propose)

Multiple ambient-motion directions were attempted and rejected. The
eventual direction — static paper grain only, no idle animation — is
load-bearing. Past attempts:

- **AmbientAscii** — full-viewport canvas of drifting dot glyphs
  (`·⋅∙∶∷∴`) rendered via sine field. Tried at opacities 0.07 → 0.11
  → 0.22 → 0.32 with various densities, thresholds, blend modes, and
  a radial center-mask. Always read as either invisible or too busy
  depending on the dial. Cut for [PaperGrain.tsx](src/components/PaperGrain.tsx).
- **Density-mapped ASCII landscape** — same canvas, but with a
  character ramp (`.,:;!lrLYU0@`) zoned into sky / horizon / ground
  bands. Rendered as real image-to-ASCII atmosphere but still felt
  like decoration on top of content.
- **AmbientGarden** — five finely-detailed natural elements anchored
  at viewport corners (hanging branch, thin twig, flower on stem,
  grass tuft, diagonally drifting leaf), each with its own CSS
  keyframe sway on `transform-origin: top` or `bottom`. Genuinely
  pretty; cut because it made the site feel like a botanical print,
  not a studio catalog.
- **MarqueeStrip** — thin (`14px`) fixed band at `bottom: 4px`
  drifting an ASCII pattern sideways over 96s via CSS translate.
  Read as a "live status ticker" which contradicted the studio
  register.
- **CornerStamp** — 120×120 canvas at home top-right, radial sine
  field morphing box-drawing glyphs like a stamp being pressed.
  Interesting; cut because the stamp read as signature gimmick.
- **Running head** proposed but not built (still in backlog).

Principle solidified: **no ambient motion.** Anything that moves on
idle is cut. Motion is reserved for user-triggered micro-states
(plate press, copy-email toast, wheel-snap on GutterStrip).

---

## Backlog

### Microinteractions (proposed, not yet shipped)

- [ ] **Hairline underline slide** on external links (shelf page
  especially) — width 0 → 100% width transition at 160ms on hover.
  Rauno/Emil register.
- [ ] **First-paint title reveal** — eyebrow + h1 on each page fade in
  with 8–12px upward slide over 400ms. Triggers once on mount, not on
  scroll.
- [ ] **View transitions on route change** — 180–240ms fade between
  routes. Consider Next.js View Transitions API or CSS-only fade.
- [ ] **Case study section reveal** — each `§` section fades+slides
  in as it enters viewport, once only, 400ms.
- [ ] **Plate press on static figures** — case study plates get the
  same 0.988 scale treatment on hover, matching GutterStrip.

### Static editorial marginalia

- [ ] **Running head** — top-right on each page, e.g.
  `H.J. · №004 · 2026`. Hard-coded per route for editorial control.
- [ ] **Folio** — bottom-center page number or date-coded tick.
- [ ] **Section marks** — `§`, `№`, or `·` used intentionally once
  per page as a plate label.

### Content

- [ ] Fill or remove `pane` in [case-studies.ts](src/constants/case-studies.ts)
  (currently intentional but flagged for future decision).
- [ ] Fill or remove `clouds-at-sea` in [case-studies.ts](src/constants/case-studies.ts).
- [ ] Sift in [case-studies.ts](src/constants/case-studies.ts) is
  partially populated — bring to Gyeol parity or trim.
- [ ] Rewrite Gyeol + Sift editorial copy in the new voice. Current
  prose is hold-over from the observation-log era and reads
  performative ("Sift elevates your digital consumption…"). Should
  match the shelf register: *"A list of resources I refer to."*
- [ ] Homepage body prose — currently absent by design. Decide if any
  copy belongs here or keep skeletal.
- [ ] About page body — review three short paragraphs for final voice.

### Dead code

- [ ] [CatalogFrame.tsx](src/components/CatalogFrame.tsx) — old
  vertical-stack catalog frame component, replaced by `GutterStrip`.
  Nothing imports it. Delete.

### Open questions

- **Grain weight** — is 0.055 opacity too heavy, too flat, or right?
  One-line tune in [PaperGrain.tsx:24](src/components/PaperGrain.tsx#L24).
- **Korean strip on homepage index** — current pattern strips `결` from
  `gyeol: 결` on the home list, shows full bilingual form on detail
  plate. Intentional asymmetry or unify?
- **`/work` vs `/` redundancy** — both list the same four pieces.
  Intentional as "browse vs. index", but worth revisiting if content
  grows past four pieces.
- **GutterStrip wheel-only input** — no touch handler; mobile visitors
  see entry #1 only. Intentional per prior call, but a swipe handler
  would unlock mobile without affecting desktop behavior.

---

## Principles to hold against

1. **No ambient motion.** Anything that moves on idle gets cut.
2. **Mono-first — with one exception.** Gambetta reserved for case-study
   prose *and* Stage hero titles (variable, weight 700). Everything else
   is Fragment Mono.
3. **Documentary equality.** Every piece treated with the same editorial
   weight — no hero project, no demoted projects.
4. **Tactility through paper, hairlines, and microtype** — not through
   decoration or generated effects.
5. **Trust the type system.** `.eyebrow`, `.plate-mark`, `.prose`, and
   `.meta` primitives in [globals.css](src/app/globals.css) do the
   compositional work; new pages should compose from these, not invent.
6. **Two registers, never mixed within a page.** Stage (dark, luminous)
   vs. Paper (editorial). Crossing is the tell. See
   [2026-04-24-stage-and-paper-design.md](docs/superpowers/specs/2026-04-24-stage-and-paper-design.md).

---

## `!` Moments — one per page, do not remove casually

Each hand-placed per
[stage-and-paper spec §10](docs/superpowers/specs/2026-04-24-stage-and-paper-design.md#the--moment-practice).
Discoverable to a careful reader, invisible to a scroller. Documenting
here so refactors don't silently drop them.

- `/` — the active row's `.cd__name` carries `translateY(-1px)` on stage.
  Baseline nudge. Invisible systematically; felt on careful read.
  ([src/app/page.tsx](src/app/page.tsx))
- `/work/gyeol` — second eyebrow separator `·` becomes `結`. Project's
  namesake character (Korean *gyeol* — texture/grain) used as one grain
  of punctuation.
  ([src/components/CaseStudy.tsx](src/components/CaseStudy.tsx))
- `/work/clouds-at-sea` — `.case__coord` line reads
  `40°43′N 73°59′W · horizon dissolve`. Real coordinate; the
  long-exposure locus of the horizon.
  ([src/components/CaseStudy.tsx](src/components/CaseStudy.tsx))
- `/about` — one paragraph (the AI-as-collaborator line) receives a
  Gambetta `::first-letter` drop cap. The argument paragraph.
  ([src/app/about/page.tsx](src/app/about/page.tsx))
- `/shelf` — Butterfly Stool year reads `"1954 –"` (open-ended range).
  "Still present in my life."
  ([src/constants/shelf.ts](src/constants/shelf.ts))
- `/colophon` — Build SHA is live (`NEXT_PUBLIC_BUILD_SHA` from Vercel).
  Rare piece of genuinely live typography.
  ([src/app/colophon/page.tsx](src/app/colophon/page.tsx))
- `/notes/[slug]` — running-head band shows a hand-picked essay keyword
  at full ink alongside the title at ink-3. The word that carries the
  essay. N-001 → *restraint*.
  ([src/app/notes/[slug]/page.tsx](src/app/notes/[slug]/page.tsx),
  [src/constants/notes.ts](src/constants/notes.ts))
- `/contact` — **deferred.** Intentionally unplaced until a specific,
  non-forced detail is identified. Candidates: a hand-drawn SVG tick for
  the availability cluster, a micro-state change on email copy, a shift
  in the cluster grammar. Left honest rather than filled with ceremony.
