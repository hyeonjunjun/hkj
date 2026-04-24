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
/* Stage register — locked */
--stage:    #0E0D09;   /* warmed near-black; continuous with --ink (#111110) */
--stage-2:  #16150F;   /* one tier lighter for card surfaces on stage */
--stage-3:  #24221A;   /* hairlines on stage */
--glow:     #F8F5EC;   /* luminous accent — warm moonlight, not pure white */
--glow-2:   rgba(248, 245, 236, 0.55); /* same glow, named-damped — see discipline below */
--glow-hair: rgba(248, 245, 236, 0.10); /* stage equivalent of --ink-hair */
```

### Discipline
- **Two palettes, one per register.** `--paper` / `--ink-*` drive Paper. `--stage` / `--glow*` drive Stage. Never combined in a single surface.
- **No third palette.** No acid accent colors (green, cyan, magenta). The glow is the only non-monochrome move, and it's monochromatic warmth — not hue.
- **The existing paper-and-ink tokens are untouched.** Zero regression on Paper routes.
- **`--stage` is deliberately warmer than black.** Black + white reads as contrast; warmed dark + warmed glow reads as *light* — the difference between a gallery and a screenshot.
- **Opacity is named, never ad-hoc.** A damped color must exist as a token (`--glow-2`, `--glow-hair`, `--ink-ghost`, `--ink-hair`) — never inline `rgba(…, 0.55)` in component CSS. Damping is a design decision, not a softening escape hatch.

### What this rules out
- Per-project accent colors. The catalog reads as one voice.
- Gradients as ornament. A gradient is only permissible if it's a photograph — i.e., a real light source captured.
- Inline opacity to "tone down" a color. If you want something softer, reach for the named damped token or add a new one.

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

#### Navigation within Stage (`/` → `/work/[slug]` or `/work/x` → `/work/y`)
The existing view-transition shared-element on `.cd__name` / `.case__title` stays. Root crossfade is extended to 420ms (was 300ms) because the darker ground needs a longer beat to feel cinematic rather than abrupt. The shared-title morph gains a **motion blur during transit** — a real `filter: blur(2px)` at midpoint that resolves to clean at end — which is the "path-blur in transit" that makes the whole thing read as a camera move, not a fade.

Budget: 420ms root + 480ms title morph. Reduced-motion: instant.

#### Navigation within Paper (`/about` ↔ `/shelf` ↔ `/notes` etc.)
Unchanged from prior spec: 300ms root crossfade on `var(--ease)`. No shared-element morphs between Paper routes.

#### Cross-register navigation (e.g. `/` → `/about`, or `/shelf` → `/work/gyeol`)
A register shift *is* a scene change. The grammar acknowledges it as an intentional hard cut, not a soft blend — but softened just enough not to strobe:

- **Root crossfade duration:** 420ms (matches the longer of the two registers — the destination's duration if destination is Stage, else the source's).
- **No shared-element morphs.** `work-title` is explicitly Stage-only DOM. If a future seasonal variant moves the home index to Paper, that shared-element wiring must be re-scoped or removed.
- **No `::view-transition-new/old(root)` filter changes on cross-register.** The color crossfade itself — `#0E0D09` ↔ `#FBFAF6` — is the transition. A blur on top of that reads as a seizure.

Implementation: a `[data-prev-register]` body attribute set by the layout at nav-start, compared to current `[data-register]`, toggles a `view-transition-class: cross-register` on the root transition. CSS scopes the longer fallback duration on that class.

### Path-blur performance envelope (locked in-spec)
`filter: blur()` on a compositor layer is jank-prone on mid-range Android. Mitigations are part of the grammar, not left to the implementer:

- **Hover path-blur is desktop-only:** `@media (hover: hover) and (pointer: fine)` gates the entire hover-blur path. Touch devices get the existing opacity shift only.
- **Blur radius is capped at 2px sitewide.** Larger radii multiply compositor cost non-linearly.
- **`filter` is paired with `will-change: filter` on mount and removed after the motion resolves** — always in pairs, never left on.
- **`prefers-reduced-data: reduce` disables filter-based motion entirely** (opacity/transform fallback only).
- **Sub-768px viewport disables the case-study hero long-exposure smear** (arrival is opacity-only at that size).

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

### Lock: C — long-exposure still photograph
Reasons, in priority order:

1. **Self-similarity with the motion grammar.** The interface moves with path-blur, smear, and long-exposure trace (§6). The content is long-exposure photography. Form and content rhyme. Neither A nor B can match this argument — it's the decisive one.
2. **Excellent execution is legibly distinguishable from mediocre execution.** The web is saturated with point-clouds-of-natural-form (A) by 2026; they read as derivative regardless of execution quality. ASCII fields (B) read as "design engineer who knows code" at any execution level. Photography is the only medium where taste itself is the visible variable.
3. **Natural minimalism made literal.** Dawn light, water over stone, wind — the user named these explicitly.
4. **Zero ambient-motion risk** (true of all three, but relevant given prior spec history).

### The contingency
This lock is **conditional on a photograph-production commitment.** C requires four long-exposure photographs (one per case study) in the next 8 weeks. If that commitment isn't real, the lock drops to **B (ASCII field, sampled from real natural data)** as the fallback — strictly more "design engineer" legible, cheaper to iterate, and the "decorative ASCII was rejected" concern is handled by insisting every character is a real datum with a captioned source.

**Accept the C commitment or downgrade to B. Flag in §15 as the single remaining content-scope question.**

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

### Lock: Gambetta at weight 700 on Stage hero titles
The existing `Gambetta-Variable.woff2` is loaded in `layout.tsx` with `weight: "300 800"` — 700 is confirmed inside the axis range. No new font load. No new file. Reasons:

1. Stays inside the 2-face discipline.
2. Gambetta at high weight on a dark warm ground reads as *cinematic title card*, not *editorial serif*. One face, two registers, two voices — exactly what dual-register wants.
3. Preserves continuity with `/notes/[slug]` (Gambetta body), so each face keeps a single role across both registers.
4. A display sans would be the easy move and would date fast. Gambetta at 700 on dark will age better.

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
| `/contact` | The `Availability` cluster's handwritten-style tick is a single tuned glyph the user drew once — it's the only hand-vectored mark on the site, used exactly here. A trace of the person in an otherwise type-only composition. |

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

**Non-blocking on assets.** The entrance is a *timed first frame*, not a progress bar. It runs for a fixed duration regardless of network. Assets load in the background.

**Non-blocking on LCP.** The entrance renders as a **transparent overlay above the destination route**, not a blocking layer that replaces it. The real content paints behind the overlay and LCP fires on actual content, not on the wordmark. This is the load-bearing technical choice: the entrance looks like it owns the first 1.1s but mechanically it's a veil over a page that's already rendering.

**Duration and shape (tightened from 1.4s to 1.1s per review — every 100ms is LCP won back):**
```
t = 0ms      Overlay visible, stage color (--stage) at full opacity
             Destination route is rendering underneath
t = 150ms    Stage fully established; wordmark (HKJ) begins fading in
t = 330ms    Wordmark at full --glow, centered, slight motion-blur tail
             resolving to clean
t = 730ms    Wordmark begins fading
t = 850ms    Wordmark gone; overlay begins crossfade to destination register
             (see register crossfade below)
t = 1100ms   Overlay fully transparent; destination route visible as itself
t = 1100ms+  sessionStorage.setItem('hkj.entered', '1');
             window.__hkjEntranceComplete = true
             view-transitions armed for subsequent navigation
```

**Register crossfade at the tail.** If the destination route is a Paper route, the overlay at t=850ms→1100ms doesn't fade straight from `--stage` to transparent — it crossfades from `--stage` through neutral to `--paper-transparent`, so the first Paper impression isn't preceded by a hard flash from dark to light. Destination Stage routes skip this step; the overlay fades straight to transparent.

**Entrance-complete flag gates view-transitions.** The navigation-layer (CommandPalette, Link clicks) must check `window.__hkjEntranceComplete === true` before triggering a view-transition. If the user clicks a Link during the entrance (1.1s window), navigation is queued and fires immediately after the entrance resolves. Prevents the VT from firing against a page still mid-reveal.

**Reduced-motion:** skip entirely. Overlay not mounted. `hkj.entered` set immediately on first paint.

### What's explicitly not being built
- No loading bar, percentage, spinner
- No "skip intro" button
- No audio
- No animated logo lockup
- No parallax / generative visual during the entrance
- Four moments, in order: overlay appears → wordmark in → wordmark out → overlay out.

---

## Preservation — what we keep from the prior session

Non-negotiable. Everything from `2026-04-22-taste-polish-design.md` remains:

- **Fragment Mono + Gambetta** (2 faces). Gambetta gains a weight-700 usage for Stage hero titles; axis range already loaded.
- **Approved easing catalog:** `cubic-bezier(.4,0,.2,1)` / `(.22,1,.36,1)` / `(.33,.12,.15,1)` / `(.41,.1,.13,1)` — no additions.
- **Paper-and-ink token system** — untouched. All Paper routes render pixel-identical after Phase 1.
- **`/notes`, `/colophon`, `/shelf`, `/about`, `/contact`** — Paper register, unchanged.
- **`GutterStrip` wheel-snap mechanics** — unchanged. Media treatment (halation, luminous framing) shifts in Phase 2.
- **CommandPalette (cmdk, `⌘K`)** — keeps its Paper-backed dialog identity in both registers (writing-style tool). But the overlay behind it is *register-aware*: `--palette-overlay` token that is `rgba(17,17,16,0.18)` on Paper routes and `rgba(248,245,236,0.12)` on Stage routes, so the veil remains perceptible on either ground. Dialog content itself (Paper background, ink text) never changes.
- **View-transitions API wiring** — extended: Stage-internal navigation uses the new 420ms + blur-in-transit treatment; Paper-internal unchanged; cross-register gets the explicit hard-cut rule from §6.
- **`useSectionReveal` hook** — stays as a generic observer mechanism. Currently only consumed by `CaseStudy.tsx` (on `.case__section`), which is moving to Stage. The hook is unchanged; the CSS that reads `[data-revealed]` is rewritten in Phase 3 to use the Stage motion vocabulary (lateral drift + opacity, alternating direction by index) instead of the current vertical translate + opacity.
- **Hover vocabulary** — underline-color fade on links stays on Paper. Stage uses path-blur. `.arrow-glyph` slide stays on both registers — it's a generic primitive.
- **`NavCoordinates` and `Folio`** — both use ink tokens (`var(--ink)`, `var(--ink-3)`, `var(--ink-4)`) that are invisible on `--stage`. Both components gain register-aware color via CSS:
  ```css
  html[data-register="stage"] .nav__mark,
  html[data-register="stage"] .folio { color: var(--glow); }
  html[data-register="stage"] .nav__link,
  html[data-register="stage"] .nav__mark-role { color: var(--glow-2); }
  ```
  The components themselves don't change; only their inline `<style>` blocks gain a Stage branch.
- **Existing `!` moments** (⌘K footer hint, notes running-head, etc.) — preserved as features. Phase 5's `!` moment audit revisits whether they still qualify as *the* `!` moment for their surface or whether a stronger one should replace them. No grandfathering.

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
- Add `--stage`, `--stage-2`, `--stage-3`, `--glow`, `--glow-2`, `--glow-hair`, `--palette-overlay` to `globals.css`.
- **Lock `data-register` to the `<html>` element.** Set via a client-side effect in each route's layout (or via a `RegisterController` mounted in `app/layout.tsx` that reads `usePathname()` and writes `document.documentElement.dataset.register`). **Never on body or main** — view-transitions re-render body/main during transit, and a register attribute on those hosts would cause mid-morph flashes of the wrong register. `<html>` survives the transition.
- Add `html[data-register="stage"]` and `html[data-register="paper"]` scope rules. All Stage-specific styling scopes to the former; the default (`[data-register="paper"]` or absent) keeps current Paper behavior.
- No visual change yet — foundation only.
- Verification: type check clean, all routes render paper (no regression); view-transitions between two Paper routes unchanged.

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

**Performance on mid-range devices.** Filters (`blur()`) + shared-element view-transitions + the entrance all cost frames. The path-blur performance envelope (§6) locks the mitigations in-spec rather than leaving them to implementer judgment: desktop-only hover blur, 2px cap, paired `will-change`, `prefers-reduced-data` opt-out, sub-768px disables hero smear.

**Cross-register nav strobe.** Going from `#0E0D09` (Stage) to `#FBFAF6` (Paper) via a 300ms crossfade could read as a flash rather than a transition. §6 accepts this as a deliberate hard cut (a register shift *is* a scene change) but tunes the duration to 420ms and forbids shared-element morphs across the boundary. If users complain, a longer neutral-hold at midpoint is the fallback — not yet spec'd but not ruled out.

**Discoverability of `!` moments.** By definition, these are hidden. If nobody finds them, they're dead weight. Mitigation: they're not dead weight even if undiscovered — they're the difference between *hand-made* and *template*. A careful reader feels the difference even without identifying it.

**Lock-in on signature dialect.** Picking long-exposure still (C) means committing to producing real photographs over time. If the user isn't a photographer yet, this is a craft commitment. Mitigation: one photograph per case study is 4 photographs total. Achievable. The photographs also become material for `/notes`.

---

## Open Questions for User

Most of the spec is locked. These are the three real decisions left for the user:

1. **Photograph-production commitment for signature dialect C.**
   The spec locks C (long-exposure still) contingent on producing four photographs (one per case study) in the next 8 weeks. Accept the commitment, or downgrade to B (real-data ASCII)? This is the single biggest scope call in the spec — decide before Phase 3 begins.

2. **`--glow` accent color.**
   Spec locks warm moonlight `#F8F5EC`. Confirm, or propose an alternative *within the monochrome-warmth discipline* (no acid colors, no hues — just shades of warm white/off-white). The user may also want to define a "deep glow" for specific accents (e.g., a slightly more saturated warm yellow for a single highlight surface).

3. **Cinematic entrance philosophy.**
   Spec locks: runs once per session, 1.1s budget, transparent overlay above destination content (LCP-safe), register crossfade at tail for Paper destinations. Three things to confirm:
   - The 1.1s budget (cinematic enough, not too long?)
   - Option 1 for Paper first-hits (entrance always runs, with register crossfade at the end) vs. option 2 (skip entrance on Paper first-hits entirely)
   - Whether the wordmark during entrance is "HKJ" (matches folio) or "Hyeonjoon Jun · design engineer" (matches nav) or something third

### Locked in spec (no longer open)
- Signature dialect = C (long-exposure still), fallback B — resolved by Q1 above
- Type addition = Gambetta at 700 (axis range 300–800 already loaded)
- `--stage` = `#0E0D09` (warmed near-black)
- `/contact` = Paper register
- `data-register` host = `<html>` (never body or main)
- Phased rollout (Phases 1–5, each independently shippable)
- All preservation claims in §11
- All motion grammar in §6 including path-blur performance envelope
- `useSectionReveal` stays; Phase 3 rewrites the CSS it reads, not the hook

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
