# RYKJUN Portfolio — Project Framework

> The governing document. Replaces all previous versions.
> 2026-05-30 (revised, evening).

---

## TL;DR

A **horizontal-scroll portfolio** that borrows blit.studio's freeform vw/vh canvas and pinned-scroll mechanic, adapted with a biomimicry vocabulary and an open-sky accent palette. The vertical axis is replaced by a horizontal scrub. Layout is freeform absolute placement, not a baseline grid — every element lives on a panel canvas via vw/vh coordinates. The wordmark stays small; the work does the talking.

- **Frame:** viewport is fixed at 100vw × 100vh. The "page" is a track of N×100vw-wide panels scrubbed horizontally by vertical wheel/trackpad input (GSAP ScrollTrigger, pinned).
- **Type:** Archivo grotesque, lowercase, weights 400/500/600/700. Display is **smaller than blit's** — `clamp(1.6rem, 3vw, 3.2rem)`. Wordmark in the nav is `clamp(0.9rem, 1.05vw, 1.05rem)` bold.
- **Color:** warm bone paper + warm ink, plus a rationed **open-sky palette** — dawn pink, hazy blue (primary accent), low-sun, dusk indigo, overcast pearl. No fiery orange-red.
- **Voice:** **biomimicry** — vocabulary borrowed from natural systems. Section labels: `field`, `specimen`, `current`, `weather`, `study`. Statement copy reaches for forms borrowed from living things.
- **Build order:** scroll engine → 4 panel types as static placeholders → real data wired (Sanity later) → animation polish → a11y + reduced-motion fallback.

---

## What this replaces

- The **editorial-engineered "catalog of one"** direction from earlier 2026-05-30 (the morning framework). That direction is archived at [/v2-editorial](src/app/v2-editorial/) next to [/blit](src/app/blit/) — both kept as negative-space references for what we are *not* doing.
- All previous home directions (corner, dark tracklist, cloud-gazing, stage & paper, etc.) remain superseded.

---

## 1. Concept

The portfolio is a **landscape, not a stack.** Every project is one frame in a horizontal sequence. The scroll wheel pulls the world sideways at a softly delayed rate; the page feels weighted, like dragging fabric. There is no chrome competing with the work — just a small wordmark, a thin progress hairline, and the panels themselves.

The **biomimicry** layer is voice + ornament, not skeleton. Section labels, panel statements, hover micro-copy, and one ornament per panel borrow from natural-systems vocabulary (tendril, current, weather, lattice, canopy, drift, mycelium, bloom). The visual surface stays restrained — open-sky tints, a lot of paper, one strong moment per panel.

The **open-sky** layer is the color register. Replace blit's orange-red accent with a five-tone sky palette used semantically: dawn for warmth, haze for the primary accent, sun for emphasis, dusk for depth, overcast for hairlines. No single tone dominates; each appears in a defined role.

---

## 2. Influences (and anti-influences)

**Reach for:**
- **blit.studio** — pinned horizontal scroll mechanic, freeform vw/vh placement, alternating media bleed, scrub momentum, • prefix labels
- **Olafur Eliasson / Studio Drift** — atmospheric color, slow durational feel
- **Bjork visual collaborations (Inez & Vinoodh, M/M Paris)** — biomimetic surface, living forms
- **Daikoku Design Institute** — restraint, single loud thing per spread
- **Anthropic-research art direction, Apple "Earth" film** — open-sky tonality

**Explicitly NOT:**
- Strict baseline grids, vertical scroll registers (the editorial direction)
- blit's orange-red `#ff4200` accent — too aggressive, replaced with the sky palette
- Massive top-left wordmark (blit-scale display) — wordmark stays small
- Generic dev-portfolio tropes (custom cursor reading "view" is still fine in moderation per spec §1.5 but kept restrained)

---

## 3. Principles

1. **The scroll is the page.** Vertical input → horizontal travel. Pin the viewport while the track moves. Nothing scrolls vertically except the document-level fallback for reduced-motion.
2. **Freeform vw/vh placement.** No CSS grid, no columns, no gutters. Every element on a panel sits at an explicit `left`/`top` in viewport units, expressed via CSS variables so the placement can be data-driven.
3. **Panels are compositions, not templates.** Each panel is designed. The four panel types (Statement / Feature / Split / Interlude) are starting points, not stamps.
4. **One loud thing per panel.** Either one big statement, or one big media, or one fragmented word — never all three.
5. **Smaller wordmark.** The nav wordmark is body-sized, not display-sized. The display weight goes to project titles and statements, not branding.
6. **Open-sky color, semantic use.** Sky tones never appear as backgrounds. They appear on: hover indicators, progress hairline, the `●` label glyph, one ornament per panel.
7. **Biomimicry voice.** Statement copy and section labels favor natural-systems vocabulary. Avoid tech vocabulary, studio jargon, "we craft" language.
8. **Scrub momentum without bounce.** ScrollTrigger `scrub: 1.2`. No spring overshoot — critically damped.
9. **Restraint in motion.** Hover scales `1.03` max. Entry stagger 80ms max. Nothing flashes.
10. **Reduced-motion = vertical fallback.** When `prefers-reduced-motion`, the horizontal track unrolls vertically and scroll-jacking is off entirely.

---

## 4. Vocabulary

| Old (editorial) | New (biomimicry + open-sky) |
|---|---|
| folio / catalog | field / collection |
| writing / work / link / listen / note | specimen / study / current / weather / drift |
| W001, P001 (folio code) | sp.001, st.001, cu.001, we.001, dr.001 (lowercase, period-delimited) |
| spine + top strip + bottom strip | small nav + bottom progress hairline |
| `editorial` / `engineered` | `field-recorded` / `slow-built` |
| `recto` | `panel` |
| `frontispiece` | `opening` |
| baseline grid | panel canvas |

Section labels appear with a leading `●` glyph in the open-sky-haze color: `● specimen`, `● current`, `● weather`.

---

## 5. Tokens (canonical)

```css
:root {
  /* paper register — warm bone, atmospheric */
  --paper:        #F7F5EE;
  --paper-2:      #ECEAE2;
  --ink:          #1A1816;
  --ink-2:        rgba(26, 24, 22, 0.55);
  --ink-3:        rgba(26, 24, 22, 0.32);
  --hint:         #6B6663;

  /* open-sky accents — semantic, rationed */
  --sky-dawn:     #E8C5B5;   /* dawn pink */
  --sky-haze:     #7AA6CA;   /* hazy blue — primary accent */
  --sky-sun:      #F2D88A;   /* low sun — emphasis */
  --sky-dusk:     #4A6B8C;   /* dusk indigo — depth */
  --sky-overcast: #C7D2D8;   /* overcast pearl — hairlines */

  --accent:       var(--sky-haze);

  /* type — smaller than blit, lowercase grotesque */
  --type-xl:      clamp(1.6rem, 3vw, 3.2rem);     /* large display */
  --type-lg:      clamp(1.1rem, 1.6vw, 1.6rem);   /* project title */
  --type-md:      clamp(0.9rem, 1.05vw, 1.05rem); /* body, nav */
  --type-sm:      clamp(0.75rem, 0.85vw, 0.9rem); /* caption */
  --type-xs:      clamp(0.62rem, 0.72vw, 0.74rem);/* label, meta */

  /* space — vw-based micro-grid */
  --space:        0.833vw;                         /* base micro-spacing */
  --panel-pad-x:  5vw;
  --panel-pad-y:  8vh;
  --media-radius: 4px;
}
```

Dark variant flips `--paper` ↔ `--ink`. Sky tones stay (they read on both).

---

## 6. Panel typology

Four reusable panel types (per spec §1.3), with the vocabulary adapted to biomimicry:

- **Panel A — Statement (opening / interlude).** Large lowercase statement in the lower-left quadrant; small media or word fragment upper-right. Used for section transitions and brand statements.
- **Panel B — Feature.** Single project, large media bleed (40–55vw), metadata top-left or bottom-left prefixed with `●`. Secondary media displaced at a different vertical offset.
- **Panel C — Split.** Two projects side-by-side at different vertical offsets and sizes. Floating text labels between them.
- **Panel D — Interlude / weather.** A breathing panel with a single biomimicry word or ornament. No project content. ~Every 3–4 panels.

Composition rules (alternating left/right anchor, `vw`/`vh` placement variables, etc.) per spec §1.3 and §2.4.

---

## 7. Tech (per spec §2.1)

- Next.js 16 (App Router) — already in use
- CSS Modules + CSS custom properties (scoped per component)
- **GSAP + ScrollTrigger** — already installed (`gsap@3.15.0`)
- Sanity.io CMS (Phase 3+; Phase 1 uses hardcoded placeholder data)
- Lenis (`lenis@1.3.23`) already installed — pair with GSAP for smooth scroll if needed; otherwise rely on ScrollTrigger only

---

## 8. Phasing

Per spec §2.8, adapted to our state.

| Phase | Deliverable | State |
|---|---|---|
| 1 | Scroll engine + 4 static panel types + Nav + ProgressBar | **in progress** |
| 2 | All 4 panel components with prop-driven layout (vw/vh placement vars) | pending |
| 3 | Sanity schema + Studio setup (`project`, `trackConfig` docs) | pending |
| 4 | Data layer + dynamic panels (GROQ query → typed components) | pending |
| 5 | Polish: hover micro-motion, entry stagger, cursor, progress bar | pending |
| 6 | Performance, a11y, reduced-motion vertical fallback | pending |

---

## 9. Anti-patterns (rule out explicitly)

- ❌ Vertical scroll on the main track (reduced-motion fallback only)
- ❌ Orange-red accent (`#ff4200` or equivalent)
- ❌ Blit-scale top-left wordmark
- ❌ CSS grid or column-based layout inside panels (vw/vh placement only)
- ❌ Tech-coded vocabulary in statement copy (`craft`, `build`, `ship`, `stack`)
- ❌ More than one loud element per panel
- ❌ Bouncing/spring scroll momentum (critically damped scrub only)
- ❌ Skeleton states, loading spinners, fake terminal preloaders

---

## 10. Done = the test

- Visiting `/v2` shows a horizontal track of 5+ panels that scrubs cleanly under vertical wheel/trackpad input
- The wordmark in the nav reads as body-sized, not display-sized
- The accent color anywhere on screen is from the sky palette
- At least one panel uses biomimicry vocabulary in its statement copy
- `prefers-reduced-motion` falls back to a stacked vertical layout
- The four panel types each have one composed instance in the track
