# Hyeonjoon Jun — Portfolio Design Brief

**As of 2026-05-03**

## Philosophy

The portfolio is not a vessel for other work. The portfolio is itself the project. Design decisions stop waiting on content; the framing carries the substance. Each surface is either real material or honest emptiness — never decoration.

The design synthesizes five references. Kenya Hara's ma (emptiness as active material) is the spiritual center. Aino's microtype discipline (project codes, role tags, caption density) informs the typographic register. ASCII as data rendered into typography is conditionally present under strict non-decorative rules. Ambient motion follows natural-settling behavior (fog, eyes adjusting) — user-triggered only, resolving to stillness within 480ms, no idle loops. Media is real photography and video with real captions, or honest emptiness.

The positioning sits on the line between Rauno Freiberg's editorial-engineer quietness and Joanie Lemercier's luminous-catalog restraint, with aino and TLB as the direct compositional references for the homepage grid.

Guiding rule: if removing it doesn't hurt the composition, it shouldn't be there.

## Entry Sequence

The homepage opens with a three-phase sequence that demonstrates the portfolio's thesis — data as typography resolving into real media resolving into the catalog.

Phase 1: a pre-rendered ASCII frame of the cloudsatsea video occupies the full viewport. Visible on first paint with no flash of empty page. This is not a loading screen — it is the first piece of content. ASCII as honest representation of video data.

Phase 2: the ASCII crossfades into the actual cloudsatsea video, approximately 1.5–2 seconds after paint. The data resolves into the source material.

Phase 3: the video fades or dissolves into the paper-ground catalog, approximately 1 second later. The media yields to the work.

Total sequence is roughly 3 seconds. No interaction required, no navigation blocked during the sequence. Once-per-session via sessionStorage — return visits go straight to the catalog. Reduced-motion users skip directly to the catalog.

## Architecture

The information architecture has four primary routes. The root is the studio catalog showing a 2-column grid of work with a gallery/list toggle. The studio page consolidates bio, engagements, contact, and colophon into one surface. Bookmarks is a living bibliography organized by read, watch, keep, and visit. Notes is a dated stream of working-out-loud entries. Work detail pages and note detail pages are reached from their respective indexes.

The layout is built from three persistent components. PaperGrain is a static SVG fractal-noise overlay at 0.055 opacity with multiply blend — the only atmospheric element. NavCoordinates is a fixed top nav that hides on scroll-down and reveals on scroll-up. Folio is a fixed top-right stamp reading HKJ / §NN / 2026, hidden below 960px. Total component count is 7 including RouteAnnouncer for accessibility and the new entry sequence components. Nothing decorative, nothing idle.

## Typography

Two fonts. Geist Sans is the sans stack used for everything — chrome, labels, captions, metadata, microtype. It is a proportional humanist sans calibrated for both 9px and 15px. Newsreader (variable 400–600) is the serif stack reserved for long-form prose in case study body and note detail body, a screen-optimized serif with optical sizing. Italics are globally suppressed. Emphasis comes through weight, tracking, and caps only. Letter-spacing is calibrated for proportional sans at 0.08em uppercased. Tabular figures come from OpenType tnum where alignment is needed. Old-style figures via onum are used on serif prose. Hanging punctuation and text-wrap pretty are applied to case study prose.

## Palette

The palette is paper-and-ink with no accent color. Paper is #FBFAF6 for the body ground, paper-2 is #F4F3EE for lifted surfaces, paper-3 is #E8E7E1 for hairline-adjacent areas. Ink is #111110 for primary text, ink-2 is #55554F for prose body, ink-3 is #8E8E87 for meta, ink-4 is #BFBEB8 for folio and near-subliminal elements. Ink-hair is rgba(17,17,16,0.10) for hairlines and ink-ghost is rgba(17,17,16,0.06) for row hover tint. Ink hierarchy does all the work. No accent color. The restraint is total.

## Homepage Composition

The homepage references aino and TLB as direct compositional models. The catalog is one composition with two views: a vertical sequence of full-width plates (gallery, default) or a typeset row index (list). The toggle between them is the home's hand-placed moment — discoverable but unannounced. View preference persists via a data attribute on the html element, set before paint.

The gallery view is a 2-column grid at max-width 1240px with uniform plates. Row gap is tightened to match aino's 24–32px vertical density. Captions read as museum labels — mixed case, sentence-shaped, period-terminated. The list view is a typeset row index with project codes, titles, sectors, and years.

The catalog now includes 7 pieces with 5 untitled placeholders alongside the 2 shipped projects with full media (Clouds at Sea and Gyeol) plus Sift and Pane.

The footer shows email (copy-on-click) and 2026 · new york separated by a hairline rule.

## Case Study Structure

Each work detail page follows a modular editorial template. It opens with an eyebrow, then the title as a view-transition shared element, then the subtitle, then a ledger grid showing sector, role, year, status, and tags. The plate shows the hero image or video with plate-marks and a figure caption. Photographs are now embedded as plates between editorial sections with EXIF-style metadata captions. Modular sections follow covering stakes, paradox, editorial, process, steps, highlights, engineering, statistics, and video gallery. A next-project footer link cycles through the catalog, skipping placeholders.

All sections use intersection-observer-based staggered reveal — 8px vertical rise over 280ms with 50ms stagger capped at 5. View transitions morph the cover image from home tile to case study plate at 480ms and the title between home caption and case study heading at 420ms.

## Moments

One hand-placed detail per page, invisible systematically, felt on careful reading. On the home page the gallery/list toggle is the moment. On the Gyeol case study the second eyebrow separator is the character 結 instead of a dot. On the Clouds at Sea case study a coordinate line reads 40°43′N 73°59′W · horizon dissolve. On the studio page there is a first-letter drop cap on the AI collaborator paragraph, plus a live build SHA in the colophon section. On bookmarks the Butterfly Stool year reads 1954 – with the dash open-ended. On note detail pages the running-head keyword is shown at full ink.

## Interaction Vocabulary

Three gestures applied globally. Underline-color fade at 180ms on inline links transitions from transparent to currentColor on hover, with bookmarks row links excluded since they use ghost background instead. Hairline underline slide at 220ms on editorial prose links draws a background-image line left-to-right paired with the color fade. Arrow-glyph slide at 200ms on forward action indicators translates 6px on parent hover or focus.

Motion budgets are hover at 180–220ms, section reveal at 280ms with 50ms stagger, route crossfade at 300ms, title morph at 420ms, cover morph at 480ms, and the entry sequence at approximately 3 seconds once per session. Nothing on idle. No ambient loops.

## Content State

The catalog includes 7 pieces. Clouds at Sea is shipped with a video cover and a full case study. Gyeol is shipped with a video cover and a full case study including process, highlights, stats, and 4 video plates. Pane is work-in-progress with no cover and a minimal case study. Sift is shipped with an image cover and a full case study. Five additional pieces are untitled placeholders.

There is one note: N-001, On restraint as the hardest move, a process reflection on removing ambient motion. Bookmarks show 17 items from the READ group including books, portfolios, essays, and archives. WATCH, KEEP, and VISIT groups exist but are sparse and hidden.

## Dependencies

Four production dependencies: geist, next, react, and react-dom. Everything else is devDependencies for Tailwind, TypeScript, ESLint, and testing.

## What Stays Retired

Stage register and dark mode. Cinematic entrance overlay that blocks navigation. Path-blur grammar. Command palette. Fragment Mono and Gambetta (replaced by Geist Sans and Newsreader). The mono register entirely. All previously removed npm packages.

## The Design in One Sentence

A paper-ground studio catalog where the portfolio is itself the project — opening with data rendered as typography resolving into real media, then yielding to a warm-paper grid of work with four dependencies, two fonts, no accent color, and one hand-placed detail per page.
