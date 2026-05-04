# Portfolio as Project — Direction

**Date:** 2026-05-02
**Status:** Direction (not a full spec — frames the next spec rather than prescribing implementation)
**Anchored to:** the user's recorded taste profile (warm restraint, monograph composition, natural motion, reduction-as-conviction) — extended, not replaced
**Extends:** [2026-05-02-monograph-direction-design.md](./2026-05-02-monograph-direction-design.md)
**Conditionally reinstates** primitives the monograph spec retired (ASCII, ambient motion) — under explicit conditions stated below.

---

## The reframe

The portfolio is not a vessel for other work. The portfolio **is** the project.

The honest read of the bottleneck — five of seven plates are placeholders, two real cases are half-written, the long-exposure photograph commitment is unfunded. Waiting for the work to mature before designing is the wrong order. Treating the portfolio itself as a design exercise — a designed object whose subject happens to be one designer's practice — flips the polarity. The design choices become the visible work. The portfolio is what's shipped, not what's framed.

This is a Hara move. *Designing Design* is itself a designed object. The Lars Müller catalogues are themselves designed objects. The portfolio sits in the same category — a publication where the typesetting, the rhythm, the captions, and the empty space all *are* the design, and the projects within are like plates in a monograph: present but secondary to the framing voice.

Practical consequence: design decisions stop waiting on content. The site is allowed to be substantive while the catalog is partially populated, because the framing itself carries the substance.

---

## The intersection

Five references, one synthesis. Each contributes a specific ingredient; each is also explicitly limited.

### Aino — *discipline*

**Take:** microtype as the system's connective tissue. Project codes, coordinate-style locators, role tags as small all-caps tracked microtype. Caption density as a working principle. The discipline that makes a single tile feel like a record-card from a real archive, not a thumbnail in a grid.

**Leave:** the cinematic-agency mode. The dark luminous ground. The full-bleed 2-up media as the only composition. The brand-code naming convention (`A001 NUDIE JEANS`). The wide-tracked uppercase title-as-wordmark — too coded for a personal portfolio.

### Kenya Hara — *emptiness*

**Take:** emptiness as active material. *Ma* — the silence that gives the sound meaning. The principle that what is *removed* is the design move. Reduction-as-conviction. Documentary equality across pieces (no hero, no demoted). Generous vertical air. The argument paragraph approach to writing.

**Leave:** none — Hara is the spiritual center, not a constrained ingredient.

### ASCII — *texture*

**Take:** ASCII as ambient typographic field — data rendered as type, captioned with its source. A sampling of natural phenomena (dawn light intensity over 12 minutes, wind speed at a location, the spectral density of a recording) translated into characters and presented *with its source caption*. The ASCII is not decoration; it is data made legible.

**Leave:** ASCII as decorative animation. Drifting glyphs, looping fields, animated transitions, ASCII-as-preloader. All previously rejected and stay rejected.

The condition that makes ASCII earn its place this time: **every ASCII surface must be a real sampling of a real source, captioned with that source.** Not arbitrary character density. Not procedural texture. A specific dataset rendered as type, with the dataset named. If the source isn't real, the surface isn't built.

### Ambient — *settling*

**Take:** motion as natural phenomenon. Fog settling, eyes adjusting, attention narrowing. The reveal hook on first paint. The underline-color fade on hover. Wheel-snap when it returns. Section reveals at 280ms vertical translate + opacity. The four-curve easing catalog. Movement that *resolves into stillness*, never sustains.

**Leave:** idle motion theatre. Cinematic preloaders. Path-blur. Long-exposure smear. Lateral drift. ASCII glyph drift. Anything that moves on idle. Anything that performs.

The condition that makes ambient earn its place this time: **every motion must trigger from a user action, scroll position, or first paint — and resolve to stillness within 480ms.** No background loops. No idle ticks.

### Media-focused — *substance*

**Take:** photography and video as the central content of the catalog plates. Real material with real captions — EXIF, coordinate, location, source. Plates carry their content; captions carry their context. The photograph is the work.

**Leave:** stock imagery. Placeholder asset references. Decorative B-roll. The plate is empty, or it is real — never filler.

The condition: **every media surface must be authored by the designer or licensed as a real source.** When real material isn't available, the cell stays a placeholder with honest copy ("Coming"), not a stock fallback.

---

## What the synthesis actually looks like

The four constraints (Hara, aino, ASCII, ambient) all converge on a single rule:

> **Each surface is either real material or honest emptiness — never decoration.**

Hara's emptiness, aino's microtype rigor, ASCII's data-as-type, and ambient's natural-motion-into-stillness all share this rule. They reject the same thing: arbitrary content. They permit the same thing: substantive content surrounded by honest negative space.

This is the through-line. When in doubt about whether something earns its place: is it real, or is it decoration? Real stays. Decoration goes.

---

## Principles for the work ahead

1. **The portfolio is the project.** Design decisions stop waiting on content; the framing itself carries the substance.
2. **Emptiness and density alternate — no uniform middle.** A page either has dense substance (a long-form essay, a photograph at scale, a thick microtype caption block) or it has generous emptiness (large vertical air, reserved cells with single-line captions). The middle ground — half-populated grids, mid-sized everything — is where portfolios become forgettable.
3. **ASCII appears as data, not decoration.** Every ASCII surface is captioned with its source. If the source is not real, the surface is not built.
4. **Motion settles into stillness, never performs.** All motion is user-triggered, scroll-triggered, or first-paint. Resolution to stillness ≤ 480ms. No idle background loops.
5. **Media is visible, framed by quiet.** Real photographs and real video populate cells. Placeholder cells stay honest ("Untitled · Coming") and form rhythm rather than apology.
6. **Microtype is the system's connective tissue.** The 11px tracked uppercase locator, the role-tag row, the EXIF caption — these glue the page together. They earn their place by being thick enough to read as a real archive, never thin enough to feel like template metadata.
7. **Reduction reveals conviction.** Every component, every line of copy, every easing curve has to earn its place against this question: *if this were removed, would the design be better?* When the answer is yes, remove. When the answer is no, keep — and stop second-guessing.

---

## What this changes from the monograph spec

The monograph spec ([2026-05-02-monograph-direction-design.md](./2026-05-02-monograph-direction-design.md)) retired:

- ASCII (in any form)
- All ambient motion
- The cinematic entrance
- The Stage register
- Path-blur / long-exposure-smear motion grammar

This direction conditionally reinstates the first two — ASCII and ambient motion — under the strict conditions stated above. The path-blur / long-exposure-smear motion grammar **stays retired**.

**Amendment 2026-05-02 (post-da88371):** the next-spec brainstorm for the home hero surfaced two further narrow exceptions to retired primitives, both of which earn their place against the direction's "real material or honest emptiness" rule:

1. **A one-time-per-session preloader.** A full-viewport ASCII state with a real captioned source dataset (spiral / circular / mathematical / foundation-of-life motion — phyllotaxis, vortex, attractor, etc.). Plays until the user dismisses with a click anywhere on the page. Defined exit animation (~600ms staggered character fade). `sessionStorage`-gated so it does not return for the same browser session. **This is not the cinematic 1.1s wordmark entrance** the prior specs retired — that was theatrical chrome with no source caption and no dismissal mechanism. This is a captioned data state with explicit user dismissal, which the direction's ASCII rule already permits in spirit; the amendment makes the temporal pattern (looping until interaction) explicit.

2. **Dark register on the full site.** Theme system with light/dark, time-of-day default (light 7am–7pm local; dark otherwise), manual toggle in the nav SETTINGS slot, persistent override via `localStorage`. The site is no longer single-warm-paper. **This is not the prior Stage register** — that was a per-page register switch (Stage on `/`, Paper on `/studio`) that crossed within a session and drove a cinematic motion grammar. This is a single global theme that applies uniformly to every page; both ground tones share the same composition, the same microtype, the same component shapes. Crossing within a page is impossible (theme is `<html>`-scoped); crossing within a session is opt-in (manual toggle).

The monograph composition (2-column grid, microtype captions, list/gallery toggle) **stays** — but the home page composition itself is being revisited as a 3-up tile grid for the hero state per the next spec. The catalog mechanic and caption rigor are unchanged; the grid shape is.

The 2026-05-02-monograph-direction-design.md remains the operative implementation reference for caption discipline, view-toggle persistence, and motion grammar. The next spec (`2026-05-02-hero-preloader-theme-typography-design.md`) extends it with the preloader, theme system, 3-up hero composition, typography pass (PP Neue Montreal), and aino-style character-scramble hover effect.

---

## What's open

This is a direction, not a spec. The next spec — to be written when ready — will need to resolve:

- **Where ASCII appears.** Candidates: a single ambient field on the home page below the catalog, captioned with its source dataset; embedded in case studies as a data-rendering of project metrics; in a `/notes` essay about the practice itself.
- **What the ambient motion grammar is, concretely.** The four-curve catalog stays. What new triggered motions earn places? Hover-into-stillness on plates? A scroll-driven reveal on case-study sections? A breath-rate cursor coordinate readout?
- **How "portfolio as project" manifests in copy.** A `/studio` essay on the framing? An /about page that argues for the practice? A `/colophon` that documents the design system itself?
- **The relationship between the catalog (work) and the framing voice.** When the catalog has only two real pieces, how does the rest of the site carry weight? Through writing. Through the studio essay. Through the bookmarks. Through the notes. The framing voice is what fills the room while the catalog matures.

These are next-spec questions, not direction questions.

---

## Locked in this direction

- The portfolio is the project. The framing is the substance.
- Five-way synthesis: aino (discipline) + Hara (emptiness) + ASCII (data) + ambient (settling) + media-focused (substance).
- ASCII reinstated **as captioned real-data typographic fields** AND **as a one-time-per-session preloader with click-dismiss + exit animation** (amendment, post-da88371).
- Ambient motion reinstated **as triggered motion that resolves to stillness ≤ 480ms**.
- **Dark register reinstated as a global theme** (amendment) — theme system with light/dark, time-of-day default, manual toggle, `localStorage` persistence. Path-blur / long-exposure / cinematic-1.1s-entrance grammar stays retired.
- Typography evolves: **PP Neue Montreal** (Pangram Pangram, free for personal) replaces Geist Sans as the chrome face. Newsreader stays for body prose.
- The same four-easing-curve catalog. No new system-level primitives without a follow-up spec.

---
