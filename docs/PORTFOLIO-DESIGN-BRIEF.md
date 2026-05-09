# Ryan Jun — Portfolio Design Brief

**As of 2026-05-09**

## The Direction

The homepage is a single ruled surface — a timetable of an entire practice. Work, identity, writing, reading, and location coexist on one scroll. The layout borrows from Japanese train timetable design: density that stays legible because the grid is precise, not because there's whitespace everywhere. The conceptual frame shifts from "monograph laid open on a concrete table" to "an index card for a life in progress." Every section earns its place. Nothing decorates.

The identity is Ryan Jun, design engineer, New York. No studio name for now. The brand emerges from the decisions in the work, not from a wordmark.

## The Timetable Principles

From Japanese railway timetable design (時刻表), these specific techniques inform the layout:

Stem-and-leaf separation. Structural information (section labels, row numbers) sits in a heavier weight or separate column from data information (titles, descriptions, dates). The structural column is mono; the data column is sans. Weight alone creates the hierarchy — no size change needed.

Hairline rule separation. Sections are divided by 0.5px rules (retina) / 1px (standard). The rules do the spatial work so the type can be tight. Density stays legible because the grid is visible but nearly weightless.

Blank cells as data. Express trains that skip stations leave cells empty. The white gaps form a visual staircase showing speed. On the portfolio: WIP projects show "In progress" in faint ink while shipped projects show ● at full ink. The absence communicates.

2–3 color maximum. Black for base, opacity steps for hierarchy. No accent color. Color differentiates state (shipped vs in progress), never decorates.

Weight variation within one family. Station names in medium, route headers in bold, minute digits in regular. Same principle: Geist Mono at weight 500 for the frame mark, weight 400 for nav links. Same family, same size, same color — weight does the job.

## The Homepage Structure

Top to bottom, one continuous ruled surface:

The page opens with a void — `clamp(120px, 28vh, 280px)` of empty warm paper. On a 13" laptop this is breathing room; on a 27" display it's a statement. The emptiness is the first thing the visitor reads.

Identity header. RYAN JUN left-aligned, NEW YORK right-aligned. Below: "Design engineer" left, "2026" right. Geist Mono, 10px, `--ink-3`. Hairline rule below.

Featured image. One full-width photograph or video within cols 2–11, 3:2 aspect. The single piece of media on the page — this is what prevents the index from being flat. It proves visual ability before any text. Below it: a caption in Geist Sans — "Gyeol: 結. Material science. 2026." — attached tight at 10px margin-top so it reads as part of the image, not a separate element. Hairline rule below.

Work index. Section label "WORK" at `--ink-3`. Rows as a CSS grid: number (mono, `--ink-4`, tabular-nums), title (sans, `--ink-2`), sector (sans, `--ink-3`), year (mono, tabular-nums, `--ink-3`), status (● at full `--ink` for shipped, "In progress" at `--ink-4` for WIP). Rows link to `/work/[slug]`. Hairline rule below.

Currently. Section label "CURRENTLY" at `--ink-4` (one step fainter than other labels because the prose below is the real content). 2–3 sentences in Geist Sans, `--ink-2`, max 48ch. Available for work, location, what you're focused on. Hairline rule below.

Notes. Section label "NOTES" at `--ink-3`, with "updated" right-aligned at `--ink-4`. 1–3 rows matching the work index proportions. Note number, title, date, arrow glyph. Hairline rule below.

Reading. Section label "READING" at `--ink-3`, with "4 of 17" right-aligned at `--ink-4`. 3–5 entries as title — author, one per line, Geist Sans, `--ink-2`. Hairline rule below.

Footer. Email (copy-on-click) left-aligned. Weather line right-aligned: real temperature, conditions, humidity for New York, fetched at build time or edge. Korean seasonal word (봄/여름/가을/겨울) at `--ink-3`, one step more present than the weather data at `--ink-4`. The weather is context; the Korean word is personal.

## Preventing Flatness

The risk with a timetable-index layout is reading as a developer's README. Five specific moves prevent this:

The featured image breaks the index. One full-width photograph sitting between the identity header and the work index. This is the single visual statement. Without it, the page is a spreadsheet. With it, the page is a catalog that happens to be organized like a timetable.

Asymmetric vertical rhythm. Not every section gets the same gap. The void at top is 120–280px. The gap after the featured image caption is tight (48px — the caption pulls toward the image). The gap between WORK and CURRENTLY is medium (64px). The gap before the footer is generous (96px). The rhythm accelerates then decelerates.

Two type registers. Geist Mono for structural chrome (section labels, numbers, dates, status dots, weather). Geist Sans for content the visitor reads (project titles, the CURRENTLY paragraph, note titles, book titles). The timetable's lesson: the grid is mono, the content is sans.

Opacity as depth. Section headers at `--ink-3`. Row numbers at `--ink-4`. Status dots at full `--ink`. Hairline rules at `--ink-hair`. The page has visual layers despite being spatially flat.

The weather line grounds it. Real data for New York right now, plus the seasonal Korean word. This is the detail that makes it yours and not a template.

## Micro-Decisions (Rauno/Emil Level)

These are the 1–2px decisions that separate "clean" from "crafted."

Typographic. Mono numbers in the work index need optical baseline alignment with sans titles — mono sits slightly higher at the same font-size; compensate with `translateY(1px)` on the number span. Hairline rules at `border-width: 0.5px` which rounds correctly on HiDPI and falls back to 1px on standard. Section labels sit at the hairline rule's top edge with `padding-top: 0` so the label reads as stamped onto the line. Letter-spacing must be tested at each size — `0.06em` at 10px and `0.08em` at 9px; the right value is where characters are distinct but the word reads as one unit. The → arrow on note rows should be Geist Sans (not Mono — sans arrows look gestural, mono arrows look mechanical), at `--ink-4` resting, `--ink` on hover with 3px `translateX` over 200ms.

Spatial. Row height in the work index tapers: first row gets `padding-top: 16px` (more air after the section label), middle rows get `12px`, last row gets `12px` top and `0` bottom (the rule below closes the section). The featured image caption margin-top is 10px — the distance where the caption reads as attached to the image. Test by squinting; if you can see the gap, it's too big. The gap between CURRENTLY prose and the next rule is `clamp(48px, 6vh, 72px)` — prose sections breathe, index sections are tight. This contrast makes density feel intentional. The email and weather in the footer need at least 40% of content width between them so they read as two independent pieces anchored to opposite edges.

Interaction. Work index row hover: the hovered title transitions from `--ink-2` to `--ink` over `160ms`, siblings transition from `--ink-2` to `--ink-4` over `240ms`. Enter fast, leave slow — the eye follows what moves first. This is the Rauno pattern. The ● status dot does not respond to hover — it's state, not interaction. The email "copied" state must not cause layout shift — use `min-width` set to the email's rendered width. Focus-visible outlines: `outline-offset: 2px` on dense work rows (3px creates a visible gap), `outline-offset: 4px` on the featured image. The featured image has no hover state — it's a photograph, not a button. The caption carries the link affordance via underline-color fade.

Color. The ● status dot must be full `--ink` (#000), not `--ink-2` — at 6px, a dot at 0.92 opacity disappears on some displays. The CURRENTLY section label should be `--ink-4` (not `--ink-3` like other labels) because the prose below at `--ink-2` is the real content — the label needs to recede further. The Korean seasonal word at `--ink-3`, the weather data at `--ink-4` — one step of opacity separates "this is mine" from "this is context."

Easing. One curve for all hover transitions: `cubic-bezier(.4, 0, .2, 1)` (the existing `--ease`). Vary only the duration. Consistency across interactions is what makes it feel like one hand made it. Enter durations shorter than exit durations everywhere.

## Typography

Two families, no more.

Geist Sans is the reading face. Project titles, prose body, note titles, book titles, the CURRENTLY paragraph, the featured image caption. Everything the visitor actually reads.

Geist Mono is the chrome face. The frame mark, nav, section labels, row numbers, dates, status indicators, the weather line, the folio stamp. Everything structural. Mono tracking at 0.06em uppercase at 10px, 0.08em at 9px.

Frame mark at weight 500; nav links at weight 400. Same family, same size, same color — weight differentiation does the hierarchy.

Italics globally suppressed. Emphasis through weight, tracking, and caps only.

## Palette

```
--paper      #FBFAF6              body ground (warm off-white)
--paper-2    #F4F3EE              lifted surfaces
--paper-3    #E8E7E1              hairline-adjacent
--ink        #000000              pure black — titles, mark, status dots
--ink-2      rgba(0,0,0, 0.92)    body prose, project titles
--ink-3      rgba(0,0,0, 0.72)    chrome, section labels, nav, captions
--ink-4      rgba(0,0,0, 0.48)    faintest — folio, row numbers, weather
--ink-hair   rgba(0,0,0, 0.14)    hairline rules
```

No accent color. Opacity steps inherit paper warmth — secondary text reads as ink absorbed into the page rather than cold grey overlaid. No solid neutral greys.

## Grid

12-column grid with content at columns 2–11. Columns 1 and 12 are outer paper gutters. The ratio of paper to content is fixed by the column system, not viewport math. Max-width 1440px, centered.

This grid applies to every page — the homepage, case studies, studio, all routes. The biggest cohesiveness principle: the margins never change between pages.

Mobile (≤760px): grid collapses to single column; every cell spans full width.

## What Stays From Current Codebase

The 12-col grid system and its tokens. The color system. Geist Sans + Geist Mono. The Folio component (fixed bottom-right page stamp). PaperGrain (static SVG fractal-noise overlay). Frame (nav). CopyEmailLink (email copy micro-state). The case study page structure and its modular sections. The ! moments (結 separator, coordinate line, drop cap).

## What Changes

HomeView is rewritten as a single ruled surface — no gallery/list toggle, no CatalogPlate grid. The index IS the view. The featured image replaces the catalog grid of plates as the single visual statement. ViewToggle, HomeViewInit, ListView, WorkPlate, WorkList all retire. A weather component is added (build-time or edge fetch). A seasonal word utility is added (date-based Korean season).

## Content

Four projects: LA28 (WIP, brand campaign, 2026), Halo Halo! (identity, 2026), Sift (mobile/AI, 2025), Gyeol: 結 (material science, 2026). One note: N-001, On restraint as the hardest move. Reading list: 4 displayed of 17 total.

## Dependencies

Four production: geist, next, react, react-dom. GSAP approved as fifth when scroll-driven interactions (ink density, parallax-within-frame, clip-path page transitions) are built in a later phase. Not added until needed.

## The Design in One Sentence

A warm-paper timetable of an entire practice — where the hairline rules do the spatial work, the featured photograph does the visual work, and the empty space at the top does the hardest work of all.
