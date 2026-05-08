# stray — Creative Direction

> **Brand: stray, a creative studio.** The studio is one person right now (Ryan Jun, Hyeonjoon Jun, New York) but the brand is named to outlast the founder count. The masthead, OG card, favicon, and metadata all carry the studio mark. Ryan Jun is identified on `/studio` as the practice's founder, not promoted as the site's owner.
>
> **Last updated 2026-05-06.** Supersedes the earlier "HKJ Studio" / "Hyeonjoon Jun" / "Ryan Jun personal portfolio" framings — those were transitional. The studio name is locked.
>
> This document is the canonical creative direction. It captures the philosophy, the systems, the references, and the roadmap. A fresh session (or a continuation on mobile) should be able to pick up cold from here without losing context.

---

## The Conceptual Frame

> **A monograph laid open on a concrete table. The work is the room.**

Every design decision answers to that one sentence. When in doubt, test against it: does this element belong in the monograph? If it would feel out of place in a quietly printed book on a concrete table, it goes.

This is the **one frame** that locks the work. The earlier session draft floated four candidates ("studio of one," "subtraction is the practice," "built where it ships," etc) — those are all true descriptions of the practice but only one of them does the load-bearing work of *the frame*. The monograph metaphor:

- Sets the register (editorial, restrained, physical)
- Determines the type system (mono chrome + sans reading, like a printed catalog)
- Determines the color system (warm paper, pure ink)
- Determines the pace (one idea per spread)
- Determines the grid (12-col with consistent margins, like book pages)
- Determines the strays (hand-placed details, like a printer's marks)

If the monograph metaphor and the work ever conflict, the metaphor wins. That's how a brand stays coherent.

---

## The Feeling

Someone opens the site. Within 3 seconds they should feel:

> *This is quiet. This is warm. This person has an eye. I want to scroll slowly.*

Not impressed. Not overwhelmed. Not "wow, cool animation." A room they want to stay in. The portfolio is a space with good light, good proportion, and nothing competing for their attention. The work is already there, already breathing, and they arrived.

---

## The Register

The portfolio operates at ONE register — never shifts, never raises its voice.

That register is the monograph (above). Not a magazine (too loud). Not a gallery wall card (too institutional). Not a tech startup landing page (too eager). Not a fashion lookbook (too styled). A monograph — printed in an edition of 500, placed in the right bookstores without a press release. You find it or you don't.

---

## The Light

The portfolio has a specific quality of light. Not literal lighting effects — the tonal quality of the entire experience.

> **Late morning, overcast, through a north-facing window.**

This means:
- Even illumination. No harsh shadows, no dramatic contrast in the UI chrome.
- Warm but not golden. The off-white ground (`#FBFAF6`) is the color of paper under this light.
- Pure black ink, softened by warm paper. Primary ink at `#000000`, lower hierarchy steps as `rgba(0,0,0,X)` so secondary text inherits the paper's warmth (ink absorbs into the page rather than cold grey overlaid on top).
- No pure white. `#FBFAF6` is the ground.
- No pure black backgrounds. Even when dark video appears (the LA28 hero), it sits within the warm paper margins.

---

## The Pace

> **One idea per viewport height.**

On the homepage, each scroll-stop gives you one thing: the LA28 hero, then a featured pair, then the positioning statement, then a single offset. Never two ideas competing in the same viewport. The generous vertical spacing (64–120px between rows) prevents the viewer from seeing the next thing before they've absorbed the current thing.

In case studies, the pace alternates: media (feel) → text (think) → media (feel) → text (think). Never two text blocks in a row. Never three media blocks in a row.

---

## The Type System (current shipped state)

Two families, no more:

- **Geist Sans** — reading type. Plate titles, body, prose, statement, lede, page titles, ledger values.
- **Geist Mono** — chrome. Frame mark, nav, eyebrows, captions (number + year), footer chrome, ledger keys, view toggle, list-view sector, folio.

```
--type-nav        10px      mono chrome (nav, eyebrow, label)
--type-number     10px
--type-meta       9px       caption desc, ledger key
--type-folio      8px
--type-title      clamp(12, 0.85vw, 13.5)   plate titles, sans
--type-body       clamp(12.5, 0.8vw, 13.5)
--type-statement  clamp(15, 1.6vw, 18)      home statement, lede
--type-display    clamp(20, 2.4vw, 28)      page titles, case hero
```

Mono tracking: 0.06em uppercase. Tighter than the old 0.12em sans tracking — mono letters are wide enough that wider tracking reads as wandering.

Frame mark sits at `font-weight: 500`; nav links at 400. Same family, same size, same color — weight differentiation does the hierarchy job.

---

## The Color System (current shipped state)

```
--paper        #FBFAF6                  warm off-white (HS68 line)
--paper-2      #F4F3EE
--paper-3      #E8E7E1
--ink          #000000                  pure black titles + mark
--ink-2        rgba(0, 0, 0, 0.92)      body, prose, lede
--ink-3        rgba(0, 0, 0, 0.72)      chrome (eyebrow, nav, captions)
--ink-4        rgba(0, 0, 0, 0.48)      faintest (folio, separators)
--ink-hair     rgba(0, 0, 0, 0.14)      hairline rules
```

Aino-aligned: pure-black primary ink, opacity steps for hierarchy. The opacity steps inherit the paper's warmth so secondary text reads as ink absorbed into the page rather than cold neutral grey overlaid. No solid neutral greys.

---

## The Grid System (current shipped state)

**12-column grid with content at columns 2–11.** Cols 1 and 12 are outer paper gutters that hold consistent ratio at every viewport size — the ratio of paper to content is fixed by the column system, not by viewport math.

```
.home {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  column-gap: var(--gap-plates);
  row-gap: var(--space-row);
  max-width: 1440px;
  margin-inline: auto;
  padding: 0 var(--margin-page);
}

/* Default: every direct child sits at cols 2-11 */
.home > * { grid-column: 2 / -2; }
```

Sub-row sections use `grid-template-columns: subgrid` so internal cells inherit the parent column tracks exactly.

Current homepage placements:
- Hero / LA28: cols 2/-2 (full 10-col content row, 16:9 video)
- Asymmetric pair: 6 + 4 cols
- Statement: cols 4 / span 6 (centered 6 cols)
- Single offset: cols 1 / span 5 inside the subgrid (5 cols, 5 cols of paper to right)
- Footer: cols 2/-2

Mobile (≤760px): grid collapses to 1fr; every cell spans full width.

> **Important — system inconsistency, currently being addressed.** The 12-col grid is currently only applied to `HomeView`. `/work`, `/studio`, `/contact`, `/work/[slug]` use ad-hoc layouts with arbitrary max-widths (1080px, 1440px). This is the **biggest cohesiveness gap** on the site right now. Roadmap item #1 is to apply the 12-col system to every page.

---

## The Media

### Project Covers (aspirational direction)

Every project cover gets art directed to feel like it belongs in the same room. The principles below describe what the portfolio *should* be when every cover has been color-graded for the system. Until then, accept that some covers will sit slightly outside the room. **Don't ship a cover that sits jarringly outside it.**

- **Color temperature.** Lean warm-neutral. Cool-toned projects have warmth lifted in post. Hot-toned projects desaturated until they sit on the warm paper.
- **Contrast.** Medium. No crushed blacks, no blown whites. Tonal range compressed — like a scan of a printed page (darkest = 95%, lightest = 5%).
- **Grain.** Subtle, uniform grain matched to the paper.
- **Aspect ratios.** Each project takes its natural ratio.

**Operational gate:** before adding a new project to the homepage — does the cover meet at least the warm/contrast bar? If not, fix it before shipping or hold it in a placeholder slot. **Don't lower the bar for the room.**

### Hero Video (current shipped state)

The homepage opens with `cloudsatsea.mp4` as the LA28 piece's cover — autoplay, muted, looped, playsInline. Now sits inside the 12-col grid as the catalog's first item, not as a separate hero section. WIP status (LA28) gives it a backdrop-filter blur on hover (visual stays intact, becomes un-clarified — the work is in progress).

The video's first frame fills in once metadata loads; before that, paper-2 is the fallback.

### Case Studies

- No media sits edge-to-edge on the viewport. Always lives within page margins. The paper ground is always visible around the media.
- **Maximum 1–2 full-bleed moments per case study.** Use them for the single most powerful image. The fact that it breaks the rule IS what makes it powerful.
- Video plays on click, not autoplay. Poster frame visible. Engagement deliberate.

---

## The Mobile Register

A monograph held in two hands reads differently than one lying on a concrete table. The portfolio's register has to hold in both postures.

What collapses, what holds:

- The 12-col grid collapses to single-column at ≤760px.
- Hero video shortens (`48–64svh` instead of `56–72svh`) so the catalog line is hinted below.
- Folio is hidden below 640px.
- Footer's three slots collapse to a stacked single column.
- Frame's nav drops inter-link gap from 36px to 14px.

What does **not** change: type sizes (chrome stays 10/9/8px regardless of viewport — the monograph register doesn't shrink to fit phones).

---

## Typography Art Direction

### Chrome Type — Geist Mono

Rubber-stamped onto the page by a meticulous librarian. Small, precise, uppercase, 0.06em tracking. Voice of the system, not the author. When someone sees `02 · Halo Halo! · 2026` they should feel the same thing they feel reading a museum wall label or a library catalog card. Factual, quiet, certain.

### Title Type — Geist Sans

Project titles are small (12–13.5px). **Captions for the media, not headings that precede it.** Image → caption, not title → image. The viewer sees the cover first, then reads the caption. This is the monograph principle.

Titles never wrap to more than one line on desktop. Shorten if needed.

### Display Type — Geist Sans 380

Page titles and case study titles at 20–28px, weight 380. The one moment the portfolio speaks above a whisper. Should feel like the title page of a chapter — present, clear, set in generous space, not shouting.

### Prose Type — Geist Sans

Case study editorial in Geist Sans at 12.5–13.5px, line-height 1.65, max-width 56ch. The portfolio is sans-only — no second typeface. Editorial typesetting via `text-wrap: pretty`, `font-variant-numeric` on figures, hanging punctuation where supported.

Prose sections never exceed 3–4 paragraphs before being interrupted by media. >150 words without an image break = blog post register, not monograph register. Add an image. Return to pace.

### The Positioning Statement

> *"A design-engineering studio of one. Working between interface and identity, sketch to ship."*

Set in `--type-statement` (15–18px), Geist Sans, weight 400, color `--ink-2`, centered between project rows, max 50–55ch, `text-wrap: balance`. Two declarative sentences, plural-studio voice. The only place on the homepage where the studio speaks about itself.

---

## Interaction Art Direction

### The Hover Dim

When the viewer hovers over a project, surrounding projects dim. Not a UI pattern — an atmospheric event. The light in the room shifts to illuminate the thing you're looking at. 400ms, opacity 0.5. Speed of a slow blink.

### The WIP Backdrop Blur (LA28's signature treatment)

Pieces with `status: "wip"` get a frosted overlay on hover. Visual stays intact (video keeps playing underneath), un-clarified (backdrop-blur 10px + saturate 0.85). Communicates "this is in progress, not yet revealed." Currently only LA28; future-proofed for any in-progress piece.

### The Scroll

Native scroll. The four-dep ceiling forbids Lenis. Weight comes from element spacing, not JS interpolation.

### The Frame Hide

Masthead hides on scroll-down past 80px, reappears on scroll-up. 250ms transition. Fast enough to feel responsive; slow enough to feel chosen.

### The Route Transition

Browser-native view-transitions. 200ms ease-out + 80ms paper hold + 350ms ease-in. The 80ms hold is the gutter of a book, the breath between sentences. Don't shorten it below 60ms.

### The Shared-Element Morph

Catalog plate frames carry `view-transition-name: work-cover-{slug}` matching the case study hero. Click → cover travels.

---

## Grid Art Direction

The 12-col grid isn't just layout — it's editorial composition.

### Composition Principles

- **Asymmetry over symmetry.** Imbalance creates visual tension symmetry can't. Hierarchy is spatial, not typographic.
- **Offset over centered.** When a single project sits alone (Row D, ~5 cols pushed left), the empty space on the right IS the composition. Don't fill it.
- **The positioning statement breaks the pattern.** Centered, lighter color, `--ink-2` — the only text-only moment on the homepage. An epigraph between chapters.

---

## Content Art Direction

### Project Captions

Three columns, single row:

```
02       Halo Halo!                                       2026
```

Number (mono micro), title (sans editorial), year (mono micro flush right). No sector. No description. The work does the selling. The caption indexes.

### Case Study Writing

> **A thoughtful friend explaining their work over coffee.** Not formal. Not casual. Not academic. Not marketing. A person who cares about what they made, explaining why they made it, in specific terms, without jargon or self-promotion.

> ✅ "The spacing scale is 8px because every measurement should feel deliberate. 4px was too tight for body text gutters. 12px was too loose for caption-to-image gaps. 8px was the value where everything felt placed rather than flowed."
>
> ❌ "I leveraged a carefully crafted 8px spacing system to create a harmonious visual rhythm that enhances the user experience."

### The Studio Page

Single editorial column. Eyebrow → title → lede → three practice notes → marginalia facts.

Current lede: *"stray is a creative studio working between interface and identity systems. Small on purpose — one set of hands, Ryan Jun, carrying the work from first sketch through final ship."*

---

## The Hand-Placed Details (Strays)

Every page gets one detail that a system wouldn't produce. The stray marks — the thing that strayed from the grid, the line that broke the pattern. Proof a human directed this, not a template.

These details should NEVER be pointed out or explained. They reward attention.

```
Homepage:       The positioning statement has one word at a different
                weight — so subtle you'd miss it in a screenshot but
                feel it when reading.

Case study:     One image breaks the margin by exactly 8px on one side.
                Not full-bleed. Just 8px past. A stray.

Studio page:    The third practice note's first sentence is personal in
                a way the first two aren't. The shift is felt, not
                announced.

Bookmarks:      One entry has a personal annotation that reveals why
                this reference matters to you specifically.

Footer:         The location reads "New York" by default, but on the
                rare day the studio is working from elsewhere, hand-
                edit to that city. Single source of geographic truth
                in code, not a CMS.
```

The portfolio has a system, and within that system, something has wandered. That wandering is the studio's signature — present, not announced. **The studio's name itself describes the design method: the stray that escapes the grid.**

---

## Failure Modes

The monograph principle has to extend to the system's failures.

- **Hero video fails to autoplay** (iOS Low Power Mode, autoplay-blocked browsers): paper-2 background fallback. No "tap to play" badge. Silence is in the register; apology UI is not.
- **Cover image fails to load** (404, slow connection): plate's paper-2 frame remains. Caption sits below normally. No broken-image icon.
- **Slow connection.** Chrome (Frame, Folio, footer) loads with HTML. Catalog captions render immediately; covers fill in.
- **JS disabled.** Frame stays present (no scroll-hide). Plates videos play continuously. Email link falls back to mailto. View-transitions are skipped (graceful native fallback).
- **`prefers-reduced-motion: reduce`.** All transitions hard-cut. Hero video does not autoplay; paper-2 fallback. The page is fully present and fully usable, with no motion.

---

## First Paint

The "within 3 seconds" feeling is only true if the technical numbers cooperate.

- LCP < 1.8s on fast 3G.
- CLS = 0. Every plate frame has fixed `aspect-ratio`. Hero has fixed `clamp(56svh, 64svh, 72svh)`.
- TBT < 200ms. Mostly server-rendered.
- Bundle: four production deps + framework fonts. No animation libraries currently. No carousel libraries. No UI kits.

---

## Quiet Read — Accessibility as Atmosphere

The monograph principle holds at every entry point. The page reads as well aloud as it does silently.

- Skip-to-content is the first focusable element.
- One `<main id="main">`, one `<header>`, one `<footer>` per page.
- Color contrast: `--ink`, `--ink-2`, `--ink-3` all clear WCAG AAA at 7:1+. `--ink-4` is decorative-only.
- `:focus-visible { outline: 1px solid var(--ink); outline-offset: 3px; }` everywhere.
- All interactions reachable in DOM order. CaseHero play button keyboard-toggleable.

---

## The Quality Bar

Before shipping any page, four external mirrors:

1. **The YSL test.** Does media dominate the viewport? Is chrome invisible until needed?
2. **The Aino test.** Is the grid variable and composed? Is chrome in a single mono register?
3. **The HS68 test.** Is type small enough? Tracking tight enough? Does warm paper feel physical?
4. **The Wang Zhi-Hong test.** Is the void around the work doing compositional work? Could a Taipei book designer recognize the catalog discipline?

If all four pass, ship it. If three pass and one fails, the failure tells you what to fix.

A fifth, internal test — **the Stray test:** *is there one detail on this page that strayed from the system?* Apply it last, after the four external mirrors.

---

## Reference Set

### Editorial Neighbors (the lineage)

- **HS68.la** — fashion house, est. 1968 by Richard Lim. Source of: the entrance video gate, numbered nav cadence, 80/20 media-to-text ratio, warm off-white ground.
- **Aino.agency** — Scandinavian design + tech agency. Source of: variable editorial grid, project numbering system (`A001`, `A002`), Grid/List toggle, mono chrome, single mid-page positioning sentence, flat single-row footer, "one-sized monospace" register.
- **YSL** — luxury fashion. Source of: minimal UI chrome confidence, media-dominant viewport, whisper-tracked tiny chrome.
- **Obys.agency** — most restrained of the studio set. Numbered grid 01–19, category tags, three-page nav (Work / About / Contact). Cohesive through extreme restraint. Quote: *"The studio is shaped by people who care deeply about design and the process behind."*
- **Studio Namma** — Paris/Barcelona/London creative studio. Source of: timezone stamps in footer, Plans (pricing) page, Approach (methodology) page, dedicated case study pages.
- **Wang Zhi-Hong** — Taiwanese editorial book designer. Source of: catalog-as-art-object, gravity-low text placement, void above content as designed material.
- **Daikoku Design Institute** — Japanese monograph precision. Systematic numbering. Folio as identity element.
- **Julia Krantz** — personal-first designer site. Source of: Press / Speaking / Podcasts / blog as depth elements that make personal framing work.
- **Off-Menu (off-menu.com / offmenu.design)** — modern startup-coded studio. AI assistant Remi as embedded signature. "Book a Call" CTA. Pricing page.

### Anti-References (do not drift toward)

- **NaughtyDuk** — heavy WebGL/GSAP entertainment-industry register. The gravity well to avoid. If anything on the site starts to feel like NaughtyDuk, cut it.

### Spiritual References (the philosophy)

- **Kenya Hara — *Designing Design*.** Hara's *ma* and the subtraction principle: *"does this earn its weight twice?"*
- Designers cited via Hara: Tanaka, Fukasawa, Morrison, Satoh, Miyake, Kawakubo, Yamamoto, Kuramata, Yanagi, Ando, Sejima, Sugimoto, Moriyama.
- **Rauno Freiberg** (rauno.me/craft) — design-engineer who writes about HOW he builds his interactions. Closest neighbor in technique.
- **Paco Coursey** (paco.me) — created cmdk. Speed as design quality.
- **Emil Kowalski** (emilkowal.ski) — created vaul, sonner. Micro-interaction precision.

### Codrops Case Studies Studied (May 2026)

Studied for technique, stack, and signature-move thinking:

- **Thibault Guignand** (thibaultguignand.com) — Vite/React/TypeScript + GSAP + Lenis + OGL (rewrote from Three.js). Concept: *"a technical handshake — a site for web people."* Signature: persistent flowmap with texture swap. Build: weeks of core, polish stretched. Quote: *"a codebase I felt I truly owned line by line."*
- **Tomoya Okada (4Wide)** (4wide.jp) — Astro + Swup + WordPress + GSAP + Three.js. Concept: balance expressiveness with business clarity. Signature: synchronized scroll-driven text + radial distortion + blur on About page. Build: 3 months.
- **Artem Shcherban** (artemshcherban.com) — Webflow + GSAP. Concept: *"designing against the gallery"* — separate metadata from imagery via modals. Signature: dual-track project system (standard cards + SVG-masked "wow effect" for featured work). Build: 6 iterations over 2 years.
- **Ravi Klaassens (R-K '26)** (raviklaassens.com) — Webflow + GSAP + Barba + Unicorn Studio + Howler.js + Bunny.net + Umami + Finsweet. Concept: *"led by presence. Not volume."* Signature: animated swords fighting in the footer (philosophical, not technical). Build: 1 year.

### What All Four Codrops Portfolios Share

- **One conceptual frame** locks every decision. Not a pattern library — a single sentence.
- **One signature move** makes the site theirs. Not five, not three. One.
- **GSAP is the de facto orchestration layer.** All four use it.
- **Stacks vary widely.** No two are alike. The discipline is "own your stack," not "use the right stack."
- **Iteration is destructive.** All four killed earlier directions. Thibault rewrote Three.js → OGL midway. Artem killed a 3D gallery. Ravi abandoned "Falconcept" and "Paramor."
- **Months to years.** Nothing built in a session.

---

## Cohesiveness Audit

### What's Cohesive

- Type system holds across pages.
- Color palette consistent.
- Caption format uniform across plates.
- Frame masthead and footer share mono register.
- 12-col grid on `HomeView` (just shipped).

### Where Cohesiveness Breaks

1. **Every page uses a different layout rhythm.** HomeView is 12-col grid. `/work` is a 2-col grid in 1440px. `/studio`, `/contact`, `/work/[slug]` are 1-col reading layouts in 1080px. The eye has to recalibrate per page. **Biggest cohesion problem.**
2. **Container widths are arbitrary.** 1440 / 1440 / 1080 / 1080 / 1080 / 880 (statement). Six numbers, no system.
3. **Hover language is inconsistent.** Plates dim siblings. Frame links color-shift. Footer socials underline-grow. ViewToggle color-shifts. Three vocabularies, none unified.
4. **No connecting motif beyond type.** Pixelated cloud lives only in favicon and OG card. Nothing recurring on the actual pages says "this is the same studio."
5. **The "physical paper" promise doesn't fully materialize.** PaperGrain at 0.04 multiply is below visibility threshold on most monitors. Plates have a 1px black hairline outline that reads as "border" not "paper edge." Section breaks rely on big vertical gaps with no rules between them.

---

## Signature Move Candidates

Ryan needs ONE move that's only stray's. Five candidates, in increasing intervention:

1. **The Folio that follows the work.** Already partially built — fixed bottom-right page-stamp, mono microtype, updates per route. Could be elaborated: track scroll position, show "page X of Y," become a tiny progress mark.
2. **The PaperGrain that responds.** Grain very slightly more visible when visitor pauses (200ms+ no scroll, no movement). A studio that breathes when you're still. Pure rAF + reduced-motion guard, no library.
3. **The cloud-fade signature on hover.** ⭐ The WIP backdrop-blur shipped on LA28, elaborated to *every* hover. Plate hovers, footer link hovers, section transitions all use a brief atmospheric blur instead of color shift. The whole site starts to breathe atmosphere. Lowest-risk, highest-cohesion — uses what's already shipped and elevates it from "WIP feature" to "studio language."
4. **The strays as scroll-tied marks.** Tiny editorial marks (margin numbers, footnote daggers, centered "·" between sections) appear in the gutter as the page scrolls. Pure CSS scroll-driven if committed to that frontier; one-line JS otherwise.
5. **A sequenced page-turn transition.** Instead of view-transition crossfade, content slides up like a printed page being lifted off a stack. Distinctive, monograph-coherent. Needs orchestration View Transitions alone can't deliver — would benefit from GSAP.

**Recommended:** start with (3). It's the move that comes for free if we elevate the WIP overlay to a system-wide hover language. The whole site's breathing language becomes "atmosphere, not contrast."

---

## The Constraint Question

The four-dep ceiling (geist + next + react + react-dom) is currently doing more work as a *position* than as a *practical constraint*. Almost every interaction on the site is achievable with native CSS.

But — every Codrops case study studied uses GSAP. Every one. GSAP is the de facto orchestration layer for design-engineer portfolios. The difference between a CSS transition and a GSAP timeline isn't decoration — it's the entire vocabulary of *how* an interaction feels. A 0.97 active-scale on press in CSS feels like a button. The same scale with GSAP's `back.out(2)` ease feels like a finger.

**The honest decision:**

- **Option A: Hold the four-dep ceiling.** Commit to native CSS frontiers — `scroll-timeline`, `view-timeline`, `animation-timeline: scroll()`. These are standardized but Safari/Firefox support is patchy. Building on them now means the signature move only works for half the visitors.
- **Option B: Add GSAP as the fifth dep.** Document it explicitly: *"Five deps. GSAP is the orchestration layer; nothing else."* Update this doc to reflect the new ceiling.
- **Option C: Add Motion (formerly Framer Motion).** Smaller than GSAP, more React-native, less mature for orchestration. Also a fifth dep.

**Recommendation:** Option B. GSAP. Five deps, documented as the exception. The portfolio will feel meaningfully more crafted with one library that the entire reference set uses; defending the four-dep ceiling at the cost of signature moves is purity over impact.

This decision is **pending your sign-off** — don't add GSAP without explicit go-ahead.

---

## Discovery Sources (where to find ideas to combine)

For studying technique with code-level depth:

- **rauno.me/craft** — Rauno Freiberg's articles on specific gestures (Stagger, Magnetic, etc). Closest aesthetic neighbor with explained code.
- **paco.me** and **emilkowal.ski** — inspect-element archeology on portfolios that ship the patterns we want.
- **Olivier Larose** (blog.olivierlarose.com) — tutorials specifically for portfolio interactions in Next.js. Cleanest match for what we're building.
- **Codrops** (tympanus.net/codrops) — long-form case studies (the four we just studied came from here). New ones drop weekly.

For single-interaction learning:

- **cubic-bezier.com** — interactive easing curve editor. Bookmark.
- **easings.net** — visual reference for named easing curves with code.
- **Josh Comeau's blog** — pedagogical depth on specific interaction craft.
- **motion.dev/examples** — interactive examples even if not using Motion.

For visual ideas (browse before knowing what to build):

- **cosmos.so** — designer-curated mood boards. Search "interaction" / "scroll" / "editorial" / "minimal".
- **godly.website** — high-craft personal sites, editorial bias.
- **siteinspire.com** — minimal portfolio filter is good.
- **are.na** — channels like "Editorial web design" and "Microinteractions".
- **awwwards.com** — useful but biased toward maximalism. Filter Minimal + Typography only.

---

## Roadmap — What We Are Working On

In priority order. Items 1–3 are **system** moves (make underlying consistency real); 4–6 are **finish** moves (visual polish that depends on system being in place); 7–9 are **content/depth** moves (what makes the portfolio feel like a working studio).

### System (next pass)

1. **Apply the 12-col cols-2-11 grid to every page.** `/work`, `/studio`, `/contact`, `/work/[slug]` all adopt `repeat(12, minmax(0, 1fr))` with content at cols 2-11. Studio prose at cols 4-9 (centered 6 cols, same as homepage statement). Case study editorial at cols 4-9. Case study hero at cols 2-11. **Single highest-leverage move for cohesiveness.**
2. **Tokenize the width system.** Three CSS tokens replace the six magic numbers:
    ```
    --width-page:    1440px;   /* outer container */
    --width-prose:   60ch;     /* reading text max */
    --width-figure:  900px;    /* media max */
    ```
   Every container references one of these. No more locally-decided widths.
3. **Unify hover vocabulary.** Two patterns only:
   - Link-like elements (nav, footer socials, prose links, case study next, plate captions): hairline-underline-grow 0% → 100%, 180ms ease.
   - Grouped collections (catalog plates, list view rows): sibling-dim opacity 0.5 on non-hovered.
   - Color-shift-only hover gets retired.

### Finish (after system holds)

4. **Echo the cloud monogram twice on the actual site.** Once at the foot of each case study (small, ink-3, between editorial and "Next →" link — like a publisher's mark closing a chapter). Once on `/studio` next to the eyebrow. Becomes the recurring visual that says *this is the same studio*.
5. **Strengthen the paper register.** PaperGrain → 0.06 multiply (still subtle, visible at sRGB). Replace plate hairline outlines with a paper-edge: hairline at top + inset `0 0 0 1px rgba(0,0,0,0.04)` shadow inside (reads as printed plate sitting on page, not 1px black border). Add hairline rules above each major section break with small mono section labels (e.g., `§ Work` / `— Studio`) — chapter headers in a monograph.
6. **Add section-label microtype.** Every page section gets a small mono label hung above the hairline rule. This is what makes editorial books feel coherent — every section announces itself in the same voice.

### Content / Depth (independent priority)

7. **Write the Sift case study editorial.** Highest single-leverage credibility move. 60–100 words minimum. Without it, two of three case studies render fallback prose.
8. **Add a "Currently —" line on `/studio`** above the practice notes. One sentence: *"Currently — Halo Halo! signage, LA28 brand campaign, available for select 2026 commissions."* Updates manually.
9. **Add `/notes`** with three short entries (100–300 words each). A decision made on a project, a reference that shaped a piece, a process note. Off Menu calls this "Writing"; Julia Krantz calls hers "Magic Fabric." stray could call it "Notes." Adding `/notes` is the move that transforms the site from "portfolio" register into "studio in progress" register.

### Constraint Decision (open)

- **Add GSAP as a fifth dep?** Pending sign-off. Honest framing: yes, add it, document it as the exception, and signature moves like sequenced page-turn transitions become possible. Defending four-dep purity costs more in expressive vocabulary than it gains in restraint signal.

### Items Not Going to Be Built

- ~~`/lab` or `/playground` route~~ — explicitly opposed by user. Don't propose this naming again.

---

## What This Document Is NOT

This is not the design spec (you have that — typography values, spacing tokens, color variables in `globals.css`). This is not `CLAUDE.md` (technical instructions for the build agent). This is not the brand identity guide (wordmark, palette).

This is how the person art directing the portfolio — Ryan — makes decisions when the spec doesn't have an answer. When the spec says *"use --type-title at clamp(12px, 0.85vw, 13.5px)"* and you're staring at a project title wondering if it's right, this document says: *"Is it small enough to feel like a caption, not a heading? Does the media speak louder than the title? Then it's right."*

The spec is the score. **This document is how to play it.**
