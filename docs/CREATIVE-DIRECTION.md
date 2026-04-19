# Hyeonjoon — Creative Direction

> A design engineer's portfolio at the intersection of data, math, creativity, and visualization. Real media as subject; mono + math as language. Last updated 2026-04-18.

---

## 1. Concept

**The site is a data-viz artifact, not a portfolio catalog.**

Real scenery lives full-bleed behind every page. On top of it, live computed data (sampled from the scene, cursor, time) renders as telemetry. Work lives as blob-tracked entries that drift subtly, lock onto focus, and reveal via a detail panel that slides in from the edge. Every value on screen is derived from something real — brightness sampled from the video, cursor velocity in px/s, uptime in seconds with milliseconds — not decorative placeholder data.

The site is more TouchDesigner than camera. More scientific-plot than product page. More Refik-Anadol-studio than agency portfolio.

## 2. Taste lineage

| Reference | What it contributes |
|---|---|
| **TouchDesigner / creative coding** | Live-sampled data, feedback overlays, vector-field ornament, chromatic events as signature moments |
| **Teenage Engineering** | Technical instrumentation, specification labels, dense mono typography |
| **Nothing** | Dot-matrix restraint, monochrome discipline punctuated by a single accent |
| **Refik Anadol / Field.io / Universal Everything** | Real media treated as data to be visualized; mathematical aesthetic |
| **Wabi-sabi / Japanese design** | Hanada sky blue (縹色), imperfection, asymmetric restraint |
| **Camera / plotter aesthetics** | Blob-tracking boxes with live RGB readouts; mathematically derived coordinates |
| **Editorial annotation (magazine spec sheets)** | Thin-line callouts on product media with bold labels |
| **Diaristic handwritten annotation (Instagram ski photos)** | Caveat-script callouts on personal media for emotional context |

*Deprioritized:* explicit game references (Zelda Sheikah slate / WuWa character screen) — the site draws atmospheric mood from games but doesn't mimic their UI.

## 3. Architecture

### Layer model

Every page has five conceptual layers (bottom to top):

1. **Environment** — persistent across routes via `src/components/Environment.tsx`. Low-opacity backdrop video on non-home routes, subtle radial atmosphere gradients drifting on a 40s cycle, vignette, time-of-day tint, 4 corner glyph watermarks. On the homepage, the scene video is promoted to full opacity; Environment still contributes the drift + vignette + glyphs.

2. **Content** — page-specific (the viewfinder, an about composition, a case study, a shelf of objects).

3. **Chrome** — top-bar brand + nav (suppressed on home; home has its own chrome). Bottom `SystemBar` (also suppressed on home).

4. **Interaction** — custom cursor (`Reticle.tsx`) renders as a bracketed dot `[ · ]` with coord readout when over lockable elements. Tints to Hanada on lock.

5. **Ornament / transition** — `PageTransition.tsx` warp on route change (Hanada wash + corner brackets + rune altar, 780ms total). Colophon overlay mounted in layout, accessible via `?` key or button.

### Homepage — Viewfinder (current committed direction)

Single-viewport, no scroll. Five internal layers:

1. **Scene** — `/assets/cloudsatsea.mp4` full-bleed, `filter: saturate(0.92) contrast(1.02)`.
2. **Tracking boxes** — 4 blob-tracking overlays plotted at aesthetic percentages. Each drifts with sine/cosine noise (±1.4% idle), shows `[NN] TITLE` label below + live X/Y coords above. Active box gets Hanada corners, breathing pulse, live RGB color swatch (sampled from scene pixel at box center). Inactive boxes ghost to 0.18 opacity.
3. **Top chrome** — two rows. Row 1: brand-mark `● HYEONJOON` left, `ABOUT / SHELF / CONTACT` nav right. Row 2: six live data stats — `LUX` (avg brightness), `RGB` (sampled center pixel), `CHROMA` (saturation), `WB` (warm/cool bias), `VEL` (cursor velocity in px/s), `t` (uptime in seconds).
4. **Signature waveform** — thin SVG polyline above the archive, plotting 120 LUX samples over the last ~10s. The scene breathing as data.
5. **Archive dock** — fixed bottom. Horizontal row of 4 project cards with 140px thumbnails (video/image), mono label (`[NN] TITLE` + sector below), Hanada corner-bracket highlight + lift on active.
6. **Detail panel** — slides in from the right on hover/pin. Frosted dark glass, Hanada left spine, corner brackets. Contains project media, classification, mono uppercase title, description (sans for legibility), 2×2 stats (STATUS, INDEX in Hanada mono), compact ENTER button with arrow-slide on hover.

**Effects:**
- **Spot focus** — when a work is active, a radial spotlight follows the active tracking box's drifting position; rest of scene darkens via feathered gradient.
- **Chromatic sweep** — on `activeSlug` change, a 220ms left-to-right RGB-split sweep crosses the scene as a switch signature.

**Interaction:**
- `activeSlug = pinnedSlug ?? hoveredSlug`
- 80ms hover debounce prevents flicker
- Click = pin/unpin
- Keyboard: `← → ↑ ↓ J K` cycle, `Enter` opens (triggers warp), `Esc` dismisses
- URL hash syncs on pin
- Tracking boxes are visual ornament only — they don't initiate state; the archive does

### Other pages

- **`/about`** — first-person editorial. Portrait block uses the new `AnnotatedMedia` component with handwritten Caveat callouts (`me ↓`, `design engineer`, `ny, 2026`) over a gradient placeholder. Philosophy statement in serif italic with first-person voice. Experience + Contact are plain `▸ LABEL` zine-style sections (AsciiFrame retired here; chrome is for media, not text).
- **`/shelf`** — cassette/zine register. Warmer `#EFEDE4` paper cards with typewriter `[ KIND ]` plates, Newsreader italic titles, `☐ TAG` checkbox tags. Seeded with 4 placeholders (MIXTAPE, BOOK, ZINE, RECORD). Different visual register from the viewfinder — explicitly a different room.
- **`/work/[slug]`** — case study pages. Hero image uses `AnnotatedMedia` with editorial callouts (Gyeol seeded with three: hanji paper, korean seal, display light — thin-line + corner-bracket + mono label). AsciiFrame wraps hero + video media only; text blocks are unframed with `▸ LABEL` headings.

## 4. Design system

### Palette

```css
--paper:         #F7F7F5   /* warm bone, default bg */
--paper-2:       #EFEFEC   /* cards, elevated surface */
--paper-3:       #E6E6E2   /* deep surface */
--ink:           #1C1C1A   /* primary text */
--ink-2:         #5A5A56   /* body muted */
--ink-3:         #92928E   /* muted label */
--ink-4:         #C6C6C2   /* faint label */

--accent:        #5B89B5   /* Hanada — twilight sky, signature */
--accent-soft:   rgba(91, 137, 181, 0.12)
--accent-deep:   #3E6C98

--ink-ghost:     rgba(28, 28, 26, 0.08)
```

Accent usage is **scarce**: ENTER glyph, SHIPPED dot, active nav, reticle hover lock, stat values, colophon keycaps, tracking-box active corners, chromatic sweep. Never on body text or large surfaces.

### Typography

Four font stacks loaded via `next/font`:

| Stack | Font | Role |
|---|---|---|
| `--font-stack-sans` | General Sans | Body paragraph text (legibility) |
| `--font-stack-serif` | Newsreader italic | Editorial titles, signature |
| `--font-stack-mono` | Fragment Mono | Labels, telemetry, UI chrome |
| `--font-stack-hand` | Caveat | Handwritten annotations (About, hero media) |

**Hierarchy principle:** mono dominates UI chrome. Sans only appears in descriptive paragraphs. Serif italic is reserved for rare signature moments (name in SystemBar/About signoff). Hand is exclusively for annotation callouts.

### Easing

- Reveals: `cubic-bezier(0.16, 1, 0.3, 1)`
- Dismisses: `cubic-bezier(0.5, 0, 0.75, 0)`
- Chromatic events: `cubic-bezier(0.22, 1, 0.36, 1)`
- Never transition layout properties (`top`, `left`, `width`). Transform + opacity only.

## 5. Components

| Component | Purpose |
|---|---|
| `Environment.tsx` | Persistent atmospheric layer — backdrop video, radial atmosphere, vignette, time-tint, corner glyph watermarks |
| `Reticle.tsx` | Custom cursor `[ · ]`, lock label readout when over `[data-reticle-lock]` elements, Hanada tint on lock |
| `NavCoordinates.tsx` | Top nav (wordmark + links). Suppressed on `/` via `usePathname()` null-return |
| `SystemBar.tsx` | Bottom bar with availability pill + Hyeonjoon signature + scroll/path + email. Suppressed on `/` |
| `ColophonOverlay.tsx` | `?` device overlay — Sheikah-slate-weathered sitemap + typefaces + stack + live telemetry (uptime, moon phase, daylight) + keycap close hints |
| `PageTransition.tsx` | Route-change warp: Hanada wash + rune altar + corner brackets, 780ms |
| `AsciiFrame.tsx` | Corner-bracket chrome around media artifacts (hero images, videos). Reserved for MEDIA only, never text |
| `AsciiGradient.tsx` | Character-ramp density gradient `" ·-:=+*▒▓█"` — used as divider ornament |
| `Annotation.tsx` (`AnnotatedMedia`) | Photo callout overlay — two variants: `hand` (Caveat, squiggly path, arrowhead) and `editorial` (mono brand + bold label, thin elbow line, corner-bracket terminus) |

## 6. Rules for new work

1. **Is this a moment in the room, or the room?** If it's a moment (work tile, photo, essay) → give it its register-appropriate chrome and deliberate placement. If it's the room (sky, audio, time, ambient ornament) → mount in `Environment.tsx` for persistence; keep quiet.
2. **AsciiFrame is for media only.** Chrome marks "look at this." Text breathes without chrome. Use `▸ LABEL` mono headings for text sections.
3. **Accent is scarce.** Hanada appears at key moments only — live values, active states, signature glyphs. Never plastered.
4. **Every data value should be computed.** Don't write static telemetry. Sample from the scene, derive from cursor motion, compute from time. Decorative data is poor taste.
5. **Transform + opacity only.** No layout-triggering animation properties.
6. **Keyboard-first.** New focusable surfaces need visible focus states in `var(--accent)` and arrow-key cycling where list-like.
7. **Register boundaries.** Homepage = viewfinder (data register). `/shelf` = zine (analog register). Case studies = manual (instrumentation register). About = editorial. Don't mix registers within a page.
8. **Annotations speak two voices:** handwritten (Caveat, personal, diaristic) for hero/portrait photos; editorial (mono + bold, thin line) for project design decisions.

## 7. Current state (2026-04-18)

- ✅ Viewfinder homepage with live-sampled data (LUX, RGB, CHROMA, WB, VEL, t)
- ✅ Animated blob tracking (noise drift + active lock-on + live RGB swatch)
- ✅ Spot-focus scene treatment (radial spotlight follows active box)
- ✅ Chromatic RGB-split sweep on switch
- ✅ Signature brightness waveform above archive
- ✅ Annotation primitive (hand + editorial variants) applied to About portrait + Gyeol hero
- ✅ Warp page transition between routes
- ✅ Colophon `?` device with live telemetry
- ✅ `/shelf` in zine register
- ✅ Hydration clean (SSR + client render match)

## 8. Short TODO (not yet implemented)

- Real portrait photo to replace About gradient placeholder
- Real hanji photography for Gyeol annotations (current coordinates are placeholders)
- Additional case studies to populate `/work/*` (sift, clouds, pane have data, not all have media)
- Additional `heroAnnotations` for sift/clouds/pane case studies
- Atmospheric audio toggle (deferred)
- Viewfinder black-mat frame + safe-area fiducials (noted in critique, not yet executed)
