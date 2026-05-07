# Ryan Jun — Portfolio Creative Direction
## The Art Direction Bible

> Last updated 2026-05-06. Supersedes the 2026-04-24 studio-catalog direction.
>
> **Brand structure.** The website is a personal portfolio under
> *Ryan Jun*. The masthead, OG card, favicon, and metadata all carry
> the personal mark. *Stray Studio* is a forthcoming creative agency
> and design studio — mentioned editorially on `/studio` as part of
> the practice notes, not promoted as the site's owner. The document
> below was originally drafted around "Stray" as the brand; the
> language has been kept where it speaks to the editorial register
> that holds across the portfolio (the monograph metaphor, the
> strays, the four tests). Where it would mislead about the site's
> ownership, it's been corrected.

---

## The Feeling

Someone opens the site. Within 3 seconds they should feel:

"This is quiet. This is warm. This person has an eye. I want to scroll slowly."

Not impressed. Not overwhelmed. Not "wow, cool animation." Just a room they want to stay in. The portfolio is a space with good light, good proportion, and nothing competing for their attention. The work is already there, already breathing, and they arrived.

---

## The Register

The portfolio operates at ONE register — never shifts, never raises its voice.

That register is: **a well-edited monograph lying open on a concrete table in a room with one large window.**

Not a magazine (too loud). Not a gallery wall card (too institutional). Not a tech startup landing page (too eager). Not a fashion lookbook (too styled). A monograph. Something that was printed in an edition of 500 and placed in the right bookstores without a press release. You find it or you don't.

Every decision — type size, spacing, motion timing, image crop, copy length — gets tested against this register. If it belongs in the monograph, it stays. If it would feel out of place in a quietly printed book on a concrete table, it goes.

---

## The Light

The portfolio has a specific quality of light. Not literal lighting effects — the tonal quality of the entire experience.

**The light is: late morning, overcast, through a north-facing window.**

This means:

- Even illumination. No harsh shadows, no dramatic contrast in the UI chrome.
- Warm but not golden. The off-white ground (`#FBFAF6`) is the color of paper under this light.
- Pure black ink, softened by warm paper. The primary ink is `#000000` and the lower hierarchy steps are `rgba(0,0,0,0.92 / 0.72 / 0.48 / 0.14)`. Why opacity steps and not solid greys: black at reduced opacity *takes on the paper's warmth*, so secondary text reads as ink soaked into the page rather than cold grey printed on top of it. Solid neutral greys would clash with the warm ground.
- No pure white anywhere. The ground is always `#FBFAF6`. Pure `#FFFFFF` would break the light quality like a fluorescent tube in a candlelit room.
- No pure black backgrounds. Even when dark video appears (the homepage hero), it sits within the warm paper margins. The portfolio frame is always paper.

---

## The Pace

The site has a specific reading speed. Not scroll speed — the rate at which the viewer encounters new information.

**The pace is: one idea per viewport height.**

On the homepage, each scroll-stop gives you one thing: the hero video, then a project pair, then the positioning statement, then more projects. Never two ideas competing in the same viewport. The generous vertical spacing (64–120px between rows) is what creates this pace — it prevents the viewer from seeing the next thing before they've absorbed the current thing.

In case studies, the pace alternates: media (feel) → text (think) → media (feel) → text (think). Never two text blocks in a row. Never three media blocks in a row. The alternation creates a reading rhythm like turning pages in a book — image spread, text spread, image spread.

---

## The Media

### Photography / Video Direction for Project Covers

Every project cover gets art directed to feel like it belongs in the same room. The principles below are **aspirational** — they describe what the portfolio should be when every cover has been color-graded for the system. Until then, accept that some covers will sit slightly outside the room. Don't ship a cover that sits *jarringly* outside it.

**Color temperature.** Covers lean warm-neutral. Cool-toned projects should have warmth lifted in post so blue reads as warm-grey-blue, not cold-digital-blue. Hot-toned projects should be desaturated until they sit comfortably on the warm paper ground.

**Contrast.** Medium contrast across covers. No crushed blacks, no blown whites. Tonal range compressed — like a scan of a printed page where the darkest dark is 95% and the lightest light is 5%.

**Grain.** A subtle, uniform grain in post on homepage covers, matched to the paper grain of the background. The covers sit ON the paper. They should feel like they were printed on it.

**Aspect ratios.** Each project takes its natural ratio. Art direct the crop so the composition leads the eye to center or center-left.

**Operational gate.** Before adding a new project to the homepage: does the cover meet at least the warm/contrast bar? If not, fix it before shipping or hold the project in a placeholder slot. Do not lower the bar for the room.

### Media in Case Studies

Inside case studies, the media gets more room to be itself — covers are the curated selection, case-study interiors are the full story. But:

**No media sits edge-to-edge on the viewport.** It always lives within the page margins. The paper ground is always visible around the media. The media is ON the page, not IS the page. This is the monograph principle.

**Maximum 1–2 full-bleed moments per case study.** These are the moments where the image breaks the margin and runs edge-to-edge. Use them for the single most powerful image in the project — the one that defines everything. The fact that it breaks the rule IS what makes it powerful. If every image is full-bleed, none of them are.

**Video in case studies plays on click, not autoplay.** A poster frame is visible. The viewer chooses to engage. The CaseHero's centered play disc is the monograph equivalent of a tipped-in plate — visible, but the act of engaging is deliberate.

**The homepage hero is the one autoplay exception.** It's the gate. It begins playing on arrival, muted/looped/silent, and pauses when scrolled past. Sound is never offered — silence is the editorial choice. (Contrast: HS68's "Unmute" affordance, which we explicitly don't carry.)

---

## The Mobile Register

A monograph held in two hands reads differently than one lying on a concrete table. The portfolio's register has to hold in both postures.

**The mobile feeling.** Same room, same light, same paper — but you're closer to the page. Your peripheral vision sees the edges. The composition has to be more vertical, more direct, fewer competing elements per viewport.

**What collapses, what holds.**

- The variable grid (Row Types A–E) collapses to single-column at ≤760px. Each project takes a full screen-width. The asymmetric pair becomes two stacked plates.
- The hero video shortens (`56–78svh` instead of `72–92svh`) so the catalog line is hinted below — the viewer knows there's more before they scroll.
- The Folio is hidden below 640px. Mobile screens don't have margin to spare for a corner stamp. The Frame masthead carries the identity alone.
- The footer's three slots (location · contact · socials) collapse to a single left-aligned stack.
- The Frame's nav drops its inter-link gap from ~36px to 14px to fit "Work · Studio · Contact" without wrapping.

**What does not change.** Type sizes (the chrome stays at 10px / 9px / 8px regardless of viewport — the monograph register doesn't shrink to fit phones). The clamp() values for display and statement allow them to soften slightly on smaller screens without re-scaling the whole system.

**The mobile gut-check.** Hold the phone vertically at reading distance. Does each scroll-stop still feel like one composed thing, or does it feel like a page that gave up and stacked? If it feels stacked, the composition wasn't designed; it was inherited.

---

## The Typography Art Direction

The spec defines the type scale. The creative direction defines how type FEELS on the page.

The type system is **two families, no more**. Geist Sans for reading type (titles, body, prose, statement, lede, plate titles). Geist Mono for chrome (nav, eyebrows, captions, footer chrome, ledger keys, view-toggle, project numbers, year, folio). The hierarchy is: *editorial type sits in sans; data and chrome speak in mono*.

### Chrome Type — Geist Mono

This text should feel like it was rubber-stamped onto the page by a meticulous librarian. Small, precise, uppercase, 0.06em tracking (mono letters are wide enough that wider tracking reads as wandering). It's the voice of the system — not the author, the institution. When someone sees `02 · Gyeol: 結 · 2026` they should feel the same thing they feel reading a museum wall label or a library catalog card. Factual, quiet, certain.

Sizes: nav and project number 10px, meta and ledger key 9px, folio 8px. One whisper-register, three slightly different sizes, applied consistently across nav / footer / eyebrows / captions / ledger.

**Art direction note:** Chrome type never appears alone in large amounts. It's always anchoring or annotating media. If a page area has chrome type as the dominant visual element, something is wrong — add media or remove text.

### Title Type — Geist Sans

Project titles on the homepage are small (12–13.5px). This is a deliberate art direction choice, not a constraint. Titles are CAPTIONS for the media, not headings that precede it. The viewer sees the project cover first, then reads the caption. This inverts the standard portfolio pattern (title → image) into the monograph pattern (image → caption).

**Art direction note:** Titles never wrap to more than one line on desktop. If a project name is too long, shorten it. "Clouds at Sea" fits. "A Generative WebGL Exploration of Oceanic Horizons" doesn't belong here.

### Display Type — Geist Sans 380

The case study title and the studio/contact page titles sit at 20–28px, weight 380 (lighter than regular 400). This is the one moment the portfolio speaks above a whisper. It should feel like the title page of a chapter in a monograph — present, clear, set in generous space, but not shouting. Weight 380 keeps the letters from feeling heavy. They should breathe.

If display ever feels too small in practice, the answer is to make the surrounding white space larger, not the type. The display reads big when it's the only thing within a clear margin of itself.

### Prose Type — Geist Sans

Case study editorial prose runs in Geist Sans at 12.5–13.5px, line-height 1.65, max-width 56ch (≈65–75 characters per line). The portfolio is sans-only — adding a serif would break the four-dependency ceiling and the single-typeface discipline.

The prose should feel like reading a well-typeset essay despite the sans surface. Achieved through: text-wrap pretty, hanging punctuation where supported, old-style numerals via `font-variant-numeric: oldstyle-nums lining-nums` (where the figure context demands), generous line-height, and the conscious cap on line length. This is the voice of the author — not the institution (chrome), not the catalog (titles), but the person explaining why they made what they made.

**Art direction note:** Prose sections should never exceed 3–4 paragraphs before being interrupted by media. If you're writing more than 150 words without an image break, the case study has become a blog post. Add an image. Return to the monograph pace.

### The Positioning Statement

Set in `--type-statement` (15–18px), Geist Sans, weight 400, letter-spacing -0.005em, color `--ink-2`. Centered between project rows, max 50–55ch, text-wrap balance.

The current statement reads: *"A design-engineering studio of one. Working between interface and identity, sketch to ship."* Two declarative sentences in Aino's plural-studio voice. The statement is the only place on the homepage where the studio speaks about itself. The rest is the work and the chrome.

---

## The Interaction Art Direction

The spec defines the motion values. The creative direction defines what interactions MEAN.

### The Hover Dim

When the viewer hovers over a project, the surrounding projects dim. This isn't a UI pattern — it's an atmospheric event. The light in the room shifts to illuminate the thing you're looking at. The dim should feel like peripheral vision softening, not like elements being turned off. The timing (400ms) is the speed of a slow blink. The opacity (0.5) is the visibility of something in your periphery when you're focused on something else.

### The Scroll

Scrolling should feel like being carried, not like pushing. The page responds immediately but the content has weight — it doesn't feel like a feed, it feels like a surface with mass. We use native scrolling, not Lenis or a smooth-scroll library — the four-dependency ceiling forbids the addition, and on modern browsers the native scroll feels right when the content is sized correctly. The intentional weight comes from the spacing between elements, not from JS interpolation.

### The Frame Hide

The masthead hides on scroll-down past 80px and reappears on scroll-up. The threshold is the height where the viewer has clearly committed to reading the page below. The 250ms hide / show is fast enough to feel responsive, slow enough to feel like a chosen gesture rather than a panicked reaction.

### The Route Transition

Browser-native view-transitions handle the page change. The brief moment of empty paper ground (80ms hold) between exit (200ms ease-in) and entrance (350ms cubic-bezier) is the most important frame in the entire transition. It's the gutter of a book. The breath between sentences. The viewer sees the paper — just the paper — for a fraction of a second. This reminds them, subconsciously, that they're reading a composed object, not scrolling a feed. Don't skip this hold. Don't shorten it below 60ms. That moment of nothing is the signature.

### The Shared-Element Morph

When you click a catalog plate to open its case study, the plate's frame morphs into the case-study hero (`view-transition-name: work-cover-{slug}`). The morph is browser-native, free of JS animation libraries, and gives the click a felt weight — the cover doesn't disappear and reappear; it travels.

---

## The Grid Art Direction

The variable grid (Row Types A–E) isn't just a layout system — it's editorial composition. Each homepage scroll-stop is a SPREAD, and each spread is composed the way a book designer composes a double-page opening.

### Composition Principles

**Asymmetry over symmetry.** When two projects sit side by side (Row Type C, 58/38), the imbalance creates visual tension that symmetry can't. The larger project pulls the eye first, then the eye discovers the smaller one. The hierarchy is spatial, not typographic.

**Offset over centered.** When a single project sits alone (Row Type D, ~45% width pushed left or right), the empty space on the opposite side IS the composition. Don't fill it. Don't add text there. The emptiness is saying: this project is confident enough to share the viewport with nothing.

**The positioning statement breaks the pattern.** Between project rows, the statement is the only text-only moment on the homepage. It should feel like an epigraph in a book — a quiet voice between chapters. Centered, weight 400, color `--ink-2` (one step softer than `--ink`). It's not part of the catalog. It's the author's voice, briefly audible.

---

## The Content Art Direction

### Project Captions

Homepage captions are factual and short. Three columns, single row:

```
02       Gyeol: 結                                       2026
```

Number (mono micro), title (sans editorial), year (mono micro flush right). No sector. No description. No "a beautiful exploration of." No "an innovative approach to." The caption indexes; the cover sells.

Sector ("Brand · Ecommerce · 3D") moves to the case study ledger where there's room for it.

### Case Study Writing

The editorial voice in case studies is: **a thoughtful friend explaining their work over coffee.** Not formal. Not casual. Not academic. Not marketing. A person who cares about what they made, explaining why they made it, in specific terms, without jargon or self-promotion.

> Good: "The spacing scale is 8px because every measurement should feel deliberate. 4px was too tight for body text gutters. 12px was too loose for caption-to-image gaps. 8px was the value where everything felt placed rather than flowed."
>
> Bad: "I leveraged a carefully crafted 8px spacing system to create a harmonious visual rhythm that enhances the user experience."

> Good: "The hover dims the other projects because I wanted the viewer to feel like the room quieted down around the thing they're looking at."
>
> Bad: "An innovative hover interaction creates an immersive focal experience by dynamically adjusting the opacity of surrounding elements."

Write the way you think. If you wouldn't say it to a friend, don't write it in a case study.

### The Studio Page

The page is one editorial column, max 56ch. Three short notes under inline bold subheads (*Concept to code.* / *Design and engineering.* / *Quiet by design.*), then a single marginalia line of facts: *Founded 2021 · New York · Selective for 2026.*

No timeline. No 5-column stat ledger. No 3-column "values" cards. No "from a young age I was passionate about design." The voice is the same plural-studio register as the homepage statement.

---

## The Hand-Placed Details

Every page gets one detail that a system wouldn't produce. These are the stray marks — the thing that strayed from the grid, the line that broke the pattern. They prove a human directed this, not a template.

These details should NEVER be pointed out or explained. They exist for the viewer who looks carefully. They reward attention.

```
Homepage:       The positioning statement has one word at a different
                weight — so subtle you'd miss it in a screenshot but
                feel it when reading.

Case study:     One image in each case study breaks the margin by
                exactly 8px on one side. Not full-bleed. Just 8px
                past the margin. A stray.

Studio page:    The bio's three notes follow Concept / Design /
                Quiet — but the third note's first sentence is
                personal in a way the first two aren't. The shift
                is felt, not announced.

Bookmarks:      One entry has a note that goes beyond the format —
                a personal annotation that reveals why this reference
                matters to you specifically.

Footer:         The location reads "New York" by default, but on
                the rare day the studio is working from elsewhere,
                it can be hand-edited to that city. The single
                source of geographic truth lives in code, not in
                a CMS.
```

These are the stray moments. The portfolio has a system, and within that system, something has wandered. That wandering is a craft signature — present, not announced.

(The earlier draft of this document included a "midnight rollover shows both years for one second" detail. It was cut: it required idle JS clock-watching, which contradicts CLAUDE.md's no-animation-on-idle rule, and "Nobody will ever see this" became a justification for indulgent invisible work. The 8px margin break and the personal sentence are the strong strays. The midnight rollover was the precious one.)

---

## The Failure Modes

The monograph principle has to extend to the system's failures. A book whose spine cracks is still a book; it's not allowed to become something else just because something went wrong.

**Hero video fails to autoplay** (iOS Low Power Mode, low-data preference, autoplay-blocked browsers). The poster frame is visible. The frame's `var(--paper-2)` background sits underneath in case the poster is also slow to load. No "tap to play" badge appears — silence and stillness are inside the register, an apology UI is not. The page reads as paper with a still image at the top. Acceptable.

**Cover image fails to load** (404, slow connection, network drop). The plate's `var(--paper-2)` frame remains. The caption (number / title / year) sits below it normally. The viewer reads the title and registers that this project exists; the missing cover is information, not a hole. Don't render a broken-image icon, don't render alt text in place of the image — let the paper-2 rectangle stand.

**Slow connection.** The chrome (Frame, Folio, footer) loads with the HTML. The masthead is readable before any image arrives. The catalog plates render their captions immediately and the covers fill in as they arrive. The page is usable at every stage.

**JS disabled.** The Frame's hide-on-scroll-down doesn't work — it stays present, which is the sensible failure. The CatalogPlate IO-based video pause doesn't work — videos play continuously in their plates, costing some battery. The CopyEmailLink falls back to its `mailto:` href. View-transitions are skipped (browsers without VT support also fall back to no transition). Every interaction has a graceful no-JS path.

**`prefers-reduced-motion: reduce`.** All transitions hard-cut. The hero video does not autoplay; the poster shows in its place. The view-transitions are bypassed. The page is fully present and fully usable, with no motion.

**Edge case — the homepage with no real projects.** Until any work has been added, the page renders the hero, the statement, the placeholder pair, and the footer. The placeholders read as "Untitled / Reserved" with paper-2 covers. The page is honest about being a forming catalog rather than pretending to be full.

---

## The First Paint

The "within 3 seconds" feeling at the top of this document is only true if the technical numbers cooperate. If LCP is 4 seconds, the viewer never gets to the feeling.

**Performance budget.**

- LCP (Largest Contentful Paint): under 1.8s on a fast 3G connection. The LCP element is the hero video's poster frame on `/`, the case-study hero on `/work/[slug]`. These are `next/image` priority assets where the path allows.
- CLS (Cumulative Layout Shift): zero. Every plate frame has a fixed `aspect-ratio`. The hero has a fixed `clamp(72svh, 86svh, 92svh)` height. No element pushes neighbors when it loads.
- TBT (Total Blocking Time): under 200ms. The page is mostly server-rendered. Client components (Frame's scroll listener, CatalogPlate's IO, HomeHero's IO, CopyEmailLink) are small.
- Bundle: shipped with the four production dependencies and no more. Geist fonts ship with the framework. No animation libraries, no carousel libraries, no UI kits.

**The HTML is readable before any CSS or JS lands.** The mobile-first cascade is light enough that even if the stylesheet hits the wire late, the unstyled HTML is structurally legible. No `display: none` chrome elements, no JS-required content.

---

## The Quiet Read — Accessibility as Atmosphere

The monograph principle holds at every entry point. The page reads as well aloud as it does silently.

**Semantic landmarks.** Every page has one `<main id="main">`, one `<header>` (the Frame masthead), one `<footer>`. Skip-to-content link is keyboard-reachable as the first focusable element on each page. Route changes announce via `RouteAnnouncer` to assistive tech.

**Color contrast.** Body and primary chrome (`--ink`, `--ink-2`, `--ink-3` on `--paper`) all clear WCAG AAA at 7:1 or better. `--ink-4` (rgba 0.48) is reserved for decorative text only — folio, separator dots, faint accents — never for content that must be read. The folio is `aria-hidden`; the separator dots are `aria-hidden`; the placeholders carry their own `--ink-3` text which is clearly readable.

**Focus.** `:focus-visible { outline: 1px solid var(--ink); outline-offset: 3px; }` on every interactive element. The outline is the same pure black as the primary ink — it reads as a deliberate hairline, not a browser default.

**Reduced motion.** Respected on every transition, view-transition, hover-slide, and the homepage hero video. The page is fully usable with no motion.

**Reduced data and reduced transparency.** The PaperGrain is at 0.04 opacity multiply blend — invisible to a screen reader, near-invisible under high-contrast OS settings. The mix-blend-mode is decoration, never information.

**Keyboard.** All catalog plates, ViewToggle buttons, nav links, footer links, and the CopyEmailLink are reachable in DOM order. The CaseHero play button is keyboard-toggleable.

**Screen reader read-through.** The page in order: skip link → masthead (mark + nav) → main (eyebrow → title → media → captions) → footer. Aria labels carry the studio sections (`Featured`, `Statement`, `Index`, `Studio reel`, `Colophon`).

The accessibility is not a checklist. It's the same principle as the type, the light, and the pace: one register, applied with care, everywhere.

---

## The Quality Bar

Before shipping any page or update, four tests:

**The YSL test.** Does the media dominate the viewport? Is the chrome invisible until needed? Would a creative director at a luxury house look at this and nod?

**The Aino test.** Is the grid variable and composed? Does each row feel like a considered spread? Is the chrome in a single mono register, captions flat, footer one row?

**The HS68 test.** Is the type small enough? Is the tracking tight enough for mono? Does the warm ground feel like a physical surface?

**The Wang Zhi-Hong test.** Is the void above and around the work doing the same compositional work as the work itself? Could a Taipei book designer pick this up, recognize the catalog discipline, and not need to translate?

If all four pass, ship it. If three pass and one fails, the failure tells you what to fix.

(There's a fifth, internal test — the Stray test: *is there one detail on this page that strayed from the system?* Apply it last, after the four external mirrors, so the strays answer to the room and not just to themselves.)

---

## What This Document Is NOT

This is not the design spec (you have that — typography values, spacing tokens, color variables, motion budgets). This is not the CLAUDE.md (you have that — technical instructions for the build agent). This is not the brand identity (wordmark, palette, system).

This is how the person art directing the portfolio — you — makes decisions when the spec doesn't have an answer. When the spec says "use --type-title at clamp(12px, 0.85vw, 13.5px)" and you're staring at a project title wondering if it's right, this document says: "Is it small enough to feel like a caption, not a heading? Does the media speak louder than the title? Then it's right."

The spec is the score. This document is how to play it.
