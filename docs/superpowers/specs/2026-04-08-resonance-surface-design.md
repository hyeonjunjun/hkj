# HKJ Studio — Resonance Surface Design Spec

> A cold monolith with one warm breath — monospace structure, mineral surface, a single living frequency line.

---

## Context

The portfolio for HKJ (Hyeon Jun / Ryan Jun), a design engineer positioning as creative director. The site must prove directorial taste — not showcase work in a template, but demonstrate compositional craft through every spatial relationship, typographic decision, and interaction timing.

**Design DNA:** Wuthering Waves' principle that theme IS ontology. The resonance concept isn't decorative — it's the singular interactive thread that runs through every page. Everything else is editorial restraint.

**Supersedes:** This spec replaces both `RYKJUN-PROJECT-FRAMEWORK.md` (gallery-wall grid concept) and `HKJ-FRAMEWORK.md` (text-list with hover covers). The editorial scroll with resonance layer is the new direction. Those framework files should be updated or archived after implementation.

**References:**
- WuWa: compression-and-release color, material specificity, resonance ontology, diegetic interface
- Project Hail Mary: isolation, technical precision, discovery through constraint
- Cyberpunk 2077: HUD aesthetics, chrome materiality, neon-on-dark accent discipline
- Bao To: opacity hierarchy, inverted hover dimming, extreme type restraint
- Cathy Dolle: numbered typographic index, fashion-archive aesthetic
- Aino: project numbering as architecture, mathematical grid, ASCII mode system
- Brutalist architecture: raw concrete, exposed structure, honest materials, monolithic presence

---

## Design Principles

1. **Composition, not components.** No nav bars, hero sections, or footers. Spatial relationships between elements at extreme scale contrast.
2. **One living element.** The waveform line carries the entire resonance concept. Nothing else animates at rest. Restraint makes the one moving thing powerful.
3. **Ink on mineral.** Cool ground color (concrete, not paper). One ink at seven opacity stops. Project accent colors appear ONLY in the waveform and margin images — compression-and-release.
4. **The grid is left-shifted.** Content column sits left of center (~8vw offset), activating the right margin as compositional negative space. A vertical structural line marks the column edge.
5. **Monospace is the primary voice.** Fragment Mono at scale IS the brutalist statement. Newsreader drops to accent role — only philosophy/paradox lines. The system font carries the architecture.
6. **Exposed structure.** Grid lines, column markers, dividers are visible, not hidden. The structure is honest — like exposed concrete in brutalist architecture.
7. **Consistent system, precise deviations.** All projects share one typographic structure. Images breaking the column grid are the ONLY deviations. Deviations are loud because the system is strict.

---

## Color

```css
--surface: #f0f0ed;           /* mineral — cooler, concrete-like, not warm paper */
--ink-full:      rgba(35, 32, 28, 1.00);
--ink-primary:   rgba(35, 32, 28, 0.82);
--ink-secondary: rgba(35, 32, 28, 0.52);
--ink-muted:     rgba(35, 32, 28, 0.35);
--ink-faint:     rgba(35, 32, 28, 0.20);
--ink-ghost:     rgba(35, 32, 28, 0.10);
--ink-whisper:   rgba(35, 32, 28, 0.05);
```

## Easing

```css
--ease-swift: cubic-bezier(.23, .88, .26, .92);
```

All transitions use `--ease-swift` unless stated otherwise. This is the single easing curve for the entire site.

Background is ALWAYS `--surface`. Never shifts on any page. Project accent colors exist only in:
- The waveform line color (on hover/scroll proximity)
- The margin hover image

Project accent colors:
- Gyeol: `#8B7355` (warm amber — intentionally distinct from ink base `#23201c`)
- Sift: `#CF957B` (terra cotta)
- Promptineer: none (unstable/WIP)
- Clouds at Sea: `#8BA4B8` (oceanic blue-gray)

---

## Typography

| Role | Font | Usage |
|------|------|-------|
| Primary | Fragment Mono | Project titles, ghost letters, numbers, nav, labels, ALL structural text |
| Accent | Newsreader (variable, italic) | Philosophy statement, case study paradox lines ONLY — the warm breath |
| Body | General Sans (variable) | Descriptions, paragraphs, body copy |

Fragment Mono at scale is the neo-brutalist signature. Monospace at 40vw is architecture. Newsreader appears rarely — when it does, it's an event.

| Element | Size | Weight | Details |
|---------|------|--------|---------|
| Ghost HKJ letters | `clamp(240px, 40vw, 480px)` | 400 | Fragment Mono, `--ink-ghost` (0.10), parallax |
| Philosophy statement | `clamp(22px, 3vw, 32px)` | 400 | Newsreader italic, `--ink-primary` — the ONE warm moment |
| Project title | `clamp(28px, 3.5vw, 40px)` | 400 | Fragment Mono, `--ink-primary` |
| Case study paradox | `clamp(20px, 2.5vw, 28px)` | 400 | Newsreader italic, `--ink-primary` — the other warm moment |
| Body text | 15px | 400 | General Sans, `--ink-secondary`, max 54ch |
| Project description | 15px | 400 | General Sans, `--ink-secondary`, max 42ch |
| Nav links | 11px | 400 | Fragment Mono, uppercase, 0.06em tracking |
| Section labels | 10px | 400 | Fragment Mono, uppercase, 0.06em tracking, `--ink-muted` |
| Metadata | 10px | 400 | Fragment Mono, 0.04em tracking, `--ink-muted` |
| Ghost numbers | `clamp(120px, 15vw, 200px)` | 400 | Fragment Mono, `--ink-whisper` (0.05) |
| Project numbers (chrome) | 10px | 400 | Fragment Mono, chrome gradient (see Chrome section) |
| Clock | 10px | 400 | Fragment Mono, tabular-nums, `--ink-muted` |
| Colophon | 9px | 400 | Fragment Mono, `--ink-ghost` |

Typography rules:
- `text-rendering: optimizeLegibility` on body
- `font-feature-settings: "kern" 1, "liga" 1` on Newsreader (accent)
- `font-feature-settings: "tnum" 1` on Fragment Mono
- `letter-spacing: -0.01em` on General Sans body
- `letter-spacing: 0.06em` on Fragment Mono labels
- `letter-spacing: 0.02em` on Fragment Mono at display scale (titles, ghost letters)
- Never bold. Hierarchy through opacity and size only.

---

## Chrome Accent

One material-specific detail: project numbers (`01`, `02`, `03`, `04`) in the work sequence use a subtle chrome gradient on the text, creating a brushed-metal sheen:

```css
.chrome-text {
  background: linear-gradient(
    135deg,
    var(--ink-muted) 0%,
    var(--ink-ghost) 30%,
    var(--ink-secondary) 50%,
    var(--ink-ghost) 70%,
    var(--ink-muted) 100%
  );
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

The gradient position shifts with scroll (`background-position` linked to scroll Y), creating a subtle light-catching effect as you scroll past each number. Like brushed aluminum rotating under a light source. This is the ONE material flourish in an otherwise flat design.

Applied to: project numbers in the work sequence and case study metadata bar number only. Nothing else.

---

## Page 1: Homepage

### First Viewport — The Opening Measure

Full-viewport composition. Three elements at extreme scale contrast:

**1. Ghost HKJ letterforms**
- Fragment Mono, `clamp(240px, 40vw, 480px)`
- Positioned in the lower-left quadrant
- The H's left stroke cropped by viewport edge by ~15%
- Color: `--ink-ghost` (0.10)
- On scroll: parallax upward at 0.3x scroll speed, fading to `--ink-whisper` (0.03)
- These letters are spatial architecture, not a logo placement

**2. Waveform line**
- `<canvas>` element, `position: fixed`, full viewport width
- Vertical position: ~60vh
- At rest: single sine wave, amplitude 8px, slow oscillation (~0.3Hz) — visible, not subtle
- Color: `--ink-ghost` at rest (0.10 — present on the surface, not hiding)
- Responds to cursor proximity: amplitude increases within 200px radius of pointer
- Responds to scroll: color and frequency shift based on nearest project zone
- Persists across all pages (fixed position, never removed)
- Line weight: 1px
- Rendering: `requestAnimationFrame`, anti-aliased via canvas lineWidth + half-pixel offset

**3. Nav coordinates**
- Fixed position, top-right: `padding: 20px clamp(24px, 5vw, 64px)`
- Content: `WORK   ABOUT   10:47 PM EST`
- Fragment Mono, 11px, uppercase, `--ink-muted`
- No container, no background, no border. Floating text.
- On case study pages: project title appears left of nav links in `--ink-ghost`

**4. Colophon**
- `position: absolute` (scrolls away with first viewport — not persistent). Bottom-right: `padding: 20px clamp(24px, 5vw, 64px)`
- Content: `DESIGN ENGINEERING · NEW YORK · 2026`
- Fragment Mono, 9px, `--ink-ghost`

### Work Sequence — Below the Fold

Content column: max-width 900px, margin-left ~8vw (left-shifted, not centered). The right margin is active negative space.

**Structural line:** A vertical 1px line in `--ink-whisper` runs the full height of the page at the content column's left edge. This is a bleed mark — exposed structure. It anchors the grid visually and says "this layout is intentional."

No "SELECTED WORK" label. No section header. The work sequence begins as a continuation of the first viewport's composition.

**Each project follows one structure:**

```
[ghost number, ~200px, --ink-whisper, behind title]

[number] ...................... [SECTOR · YEAR]    ← Fragment Mono, 10px (number has chrome gradient)
[Title]                                            ← Fragment Mono, clamp(28-40px)
[One-sentence description, max 42ch]               ← General Sans, 15px, --ink-secondary
──────────────────────────────────────────────────  ← 1px rule, --ink-ghost (visible, not hidden)
```

Number and metadata sit on the same baseline, left and right respectively. Title below. Description below that. Rule below that.

Spacing between projects: uniform `clamp(48px, 8vh, 72px)`. Consistent rhythm — the content creates variation, not the spacing.

**Hover behavior — inverted dimming + margin image:**

On hover of any project block:
1. All OTHER projects shift to `--ink-whisper` (0.05) — instant, no transition. Nearly invisible. Brutalist focus.
2. Hovered project stays at full `--ink-primary`.
3. In the right margin (the negative space), a project image fades in at fixed position, right-aligned to viewport edge. 500ms fade, 85% opacity. Grain overlay (feTurbulence, 0.03). This is a figure plate — editorial convention.
4. The fixed waveform line shifts color to the project's accent over 400ms.
5. Waveform frequency character adjusts: tighter for technical projects, slower for generative.

On hover-out: image fades (300ms), all projects return to full ink, waveform returns to `--ink-ghost`.

**Project-specific waveform behaviors:**
- Gyeol: warm amber tint, medium-high frequency, moderate amplitude
- Sift: terra cotta tint, tight high frequency, low amplitude
- Promptineer: no color shift, waveform becomes irregular/noisy (unstable — WIP)
- Clouds at Sea: oceanic blue-gray, slow deep oscillation, high amplitude

**Scroll-linked waveform (when not hovering):**
As each project enters the viewport center, the waveform color and character transitions to match that project. Creates a "radio dial" feeling — scrolling tunes through frequencies.

**Ghost numbers:**
Each project has a ~200px Fragment Mono number (`01`, `02`, `03`, `04`) positioned behind the title text at `--ink-whisper` (0.05). These are not labels — they're spatial architecture, like watermarks on paper. They create a sense of index and sequence without being "read."

### Footer

Not a traditional footer. After the last project, `clamp(100px, 15vh, 180px)` of empty space, then:

```
hyeonjunjun07@gmail.com         LINKEDIN  GITHUB  TWITTER
```

Fragment Mono, 10px. Email at `--ink-secondary`, social links at `--ink-muted`. Single line. Below: `© 2026 HKJ Studio` in Fragment Mono, 9px, `--ink-ghost`.

Then `72px` of surface. The page ends with emptiness. The composition breathes out.

---

## Page 2: Case Study (`/work/[slug]`)

### Transition

Current page fades to surface color (300ms). Waveform shifts to project accent color during the gap. New page content blur-reveals (500ms): `opacity:0, y:32, filter:blur(3px)` → clear.

The waveform stays fixed throughout — it's the thread connecting all pages.

### Layout

Same left-shifted column (max-width 900px, margin-left ~8vw). Same grid. Same typography system. Consistency across pages = the magazine has one grid.

### Structure

**1. Metadata bar** (top, after 96px padding for nav clearance)
```
01 / GYEOL: 결 / 2026 / MATERIAL SCIENCE
```
Fragment Mono, 10px, uppercase, `--ink-muted`, 0.06em tracking.

**2. Silence** — 72px of empty space. Let the metadata sit alone.

**3. Paradox line** (the editorial lede)
Newsreader italic, `clamp(20px, 2.5vw, 28px)`, `--ink-primary`, max 54ch.
> *Can a screen ever truly feel like a physical surface?*

One question. Large. Italic. The reader sits with it.

**4. Stakes paragraph** — 48px below paradox.
General Sans, 15px, `--ink-secondary`, max 54ch. 2-3 sentences. Why this matters.

**5. Hero image** — full-bleed break.
The image extends from the content column's left edge to the RIGHT viewport edge. It breaks the column intentionally — the editorial "bleed." Grain overlay. Blur-reveal on scroll-enter (GSAP ScrollTrigger, threshold 85%, once: true).

**6. Body sections** — modular block vocabulary, not a prescribed sequence.

Each block follows one pattern:
```
SECTION LABEL                    ← Fragment Mono, 10px, uppercase, --ink-muted
                                 ← 24px gap
Body copy. Max 54ch. 15px.       ← General Sans, --ink-secondary
                                 ← 64px gap before next block
```

Available block types (each project uses only what serves it):
- **Text block:** label + body copy (editorial overview, process description)
- **Steps block:** numbered steps (`01`-`04`, Fragment Mono numbers + title + copy)
- **Highlights block:** title + description + challenge in Newsreader italic
- **Signals block:** engineering copy + signal tags (1px `--ink-ghost` borders)
- **Stats block:** large mono numbers ~24px + tiny labels below, flex row
- **Media block:** image or video (bleeds right — see below)

Per-project block selection defined in case study data. Gyeol might use: text → steps → highlights → signals → media. Sift might use: text → text → highlights → stats. The vocabulary is fixed; the sequence is per-project. Editorial, not template.

**7. Media breaks** — images and videos break the column grid same as hero (bleed to right viewport edge). These are the only spatial deviations. Scroll-triggered blur-reveal. Video captions in Fragment Mono, 9px, `--ink-ghost`.

**8. Next project**
```
────────────────────────────────────────────
NEXT
[Title]                         [SECTOR · YEAR]
────────────────────────────────────────────
```
Same structure as a homepage project row. Clicking triggers page-fade transition.

---

## Page 3: About (`/about`)

Same grid. Same column. The quietest page.

**1. Philosophy statement** — same as homepage. Newsreader italic, `clamp(22px, 3vw, 32px)`. Intentional repetition — like an epigraph.

**2. Body** — two paragraphs. General Sans, 15px, `--ink-secondary`, max 54ch.

**3. Experience** — section label + timeline:
```
EXPERIENCE

2024 —              Independent, Design Engineering
2023 — 24           Design Technologist
2021 — 23           Frontend Developer
```
Fragment Mono for periods (10px, tabular-nums, `--ink-muted`). General Sans for roles (15px, `--ink-primary`). Separated by `--ink-whisper` rules.

**4. Contact** — not styled differently from body text.
"For work inquiries, reach me at hyeonjunjun07@gmail.com" — General Sans, 15px.
Social links as a single line of Fragment Mono, 10px, uppercase.

No images. No interactions beyond the ambient waveform. Restraint proves confidence.

---

## The Waveform — Technical Spec

The single interactive element. A `<canvas>` with `position: fixed`, `z-index: 1`, `pointer-events: none`.

### Rendering

- Canvas: full viewport width, ~120px height (centered on the line)
- Line: single path, 1px stroke, anti-aliased
- Draw function: sine wave with variable frequency, amplitude, and phase
- Update: `requestAnimationFrame`, ~60fps
- Smoothing: values lerp toward targets (never snap), `lerp(current, target, 0.04)`

### Parameters

| Parameter | Rest State | On Hover | Description |
|-----------|-----------|----------|-------------|
| amplitude | 8px | varies per project | Base wave height — visible at rest |
| frequency | 0.003 | varies per project | Wave tightness |
| speed | 0.0008 | 0.0008 | Phase advance per frame |
| color | `--ink-ghost` | project accent | Stroke color |
| cursorInfluence | 200px radius | 200px radius | Amplitude boost near pointer |
| cursorAmplitude | +20px at center | +20px at center | Extra amplitude from cursor proximity — responds with conviction |

### Scroll-linked behavior

Each project occupies a "zone" defined by its DOM position. As the viewport center crosses into a project's zone:
- `targetColor` lerps toward that project's accent
- `targetFrequency` lerps toward that project's frequency value
- Transition feel: smooth radio-dial tuning, not discrete switching

### Project frequency map

| Project | Frequency | Amplitude | Character |
|---------|-----------|-----------|-----------|
| Gyeol | 0.004 | 6px | Medium-high freq, moderate amp — warm, textured |
| Sift | 0.006 | 3px | Tight freq, low amp — precise, digital |
| Promptineer | noise mode | 4px | Irregular, freq randomized per frame — unstable |
| Clouds at Sea | 0.002 | 10px | Slow freq, high amp — oceanic, breathing |

### Cursor interaction

When the cursor is within 200px of the waveform's y-position:
- Local amplitude increases based on distance: `extra = 20 * (1 - distance/200)`
- Applied as a gaussian bump centered on cursor x-position, width ~150px
- Creates a "pluck" effect — like touching a string

### Reduced motion

If `prefers-reduced-motion: reduce`:
- Waveform draws as a static horizontal line at `--ink-ghost`
- No animation, no cursor response
- Color still shifts on hover (instant, no lerp)
- All blur-reveal entrance animations disabled — content visible immediately
- Page transitions: instant swap, no fade/blur
- Entrance choreography: skipped entirely
- Hover dimming: still works (already instant)

---

## Animation Presets

All reveals use blur as the primary primitive. Content comes into focus, not slides into position.

| Context | From | To | Duration | Stagger |
|---------|------|----|----------|---------|
| First viewport elements | `opacity:0, y:40, blur:4px` | clear | 600ms | 80ms |
| Nav coordinates | `opacity:0, y:10, blur:2px` | clear | 500ms | 60ms |
| Project rows | `opacity:0, y:40, blur:4px` | clear | 600ms | 100ms |
| Case study sections | `opacity:0, y:32, blur:3px` | clear | 500ms | 60ms |
| Metadata | `opacity:0, y:8, blur:1px` | clear | 400ms | 40ms |
| Page exit | clear | `opacity:0` to paper | 300ms | — |
| Page enter | blur:3px, y:32 | clear | 500ms | 60ms |
| Margin image in | `opacity:0` | `opacity:0.85` | 500ms | — |
| Margin image out | `opacity:0.85` | `opacity:0` | 300ms | — |
| Hover dimming | `--ink-primary` | `--ink-whisper` | instant | — |

Two tempos only:
- **Immediate** (0-200ms): hover states, dimming, cursor response
- **Considered** (400-600ms): page transitions, scroll reveals, image fades

No middle ground. The gap is intentional.

### Entrance choreography (no preloader)

1. Waveform appears first — draws from left to right over 800ms (a line being drawn)
2. Nav coordinates blur-reveal (500ms, 60ms stagger)
3. Ghost HKJ letters fade from 0 to 0.10 over 600ms
4. Colophon reveals (400ms)
5. Below-fold project rows: scroll-triggered, 100ms stagger

Repeat visits (sessionStorage flag): quick 300ms fade-in, no choreography.

---

## Responsive

### Mobile (< 768px)

- Ghost HKJ letters: scale to `50vw`, maintain lower-left position
- Content column: full-width with `24px` inline padding. No left-shift.
- Project titles: `clamp(24px, 6vw, 32px)`
- Ghost numbers: hidden on mobile (they need desktop-scale space to work)
- Margin hover images: disabled (no hover on touch). Instead, project images display inline below description at 100% width.
- Waveform: still present, amplitude reduced. No cursor interaction (no hover). Scroll-linked color only.
- Nav: same position, same size. Clock hidden on mobile.
- Case study bleed images: full-width (no bleed needed, already edge-to-edge)
- Mobile spacing scale: 72px→48px, 48px→32px, 32px→24px, 24px→16px (specific values, not percentage)

### Tablet (768px - 1024px)

- Left-shift reduced to ~4vw
- Margin images: smaller (200px wide, aspect ratio preserved from source image)
- Ghost letters: `30vw`

---

## Margin Image Spec

- Position: `position: fixed`, right-aligned to viewport edge with `24px` right padding
- Vertical position: centered vertically in viewport (`top: 50%, transform: translateY(-50%)`)
- Width: `280px` on desktop, `200px` on tablet. Hidden on mobile.
- Height: auto (preserve source aspect ratio)
- Grain overlay: SVG feTurbulence, `opacity: 0.03`, overlaid via pseudo-element
- Image source: `piece.image` or `piece.coverArt` field — first available
- For projects without images (Promptineer): no margin image appears on hover
- z-index: 5 (above content, below nav)

---

## Scroll Zone Boundaries

Each project's "zone" for scroll-linked waveform color is defined by:
- Zone start: the project element's `offsetTop - (viewport height / 2)`
- Zone end: the next project's `offsetTop - (viewport height / 2)`, or `document.scrollHeight` for the last project
- When viewport center is between zone start and zone end, the waveform lerps toward that project's color and frequency
- Between zones: linear interpolation between adjacent project parameters for smooth transitions
- Recalculated on resize (debounced, 150ms)

---

## Routes

```
/                  Homepage (opening measure + work sequence + footer)
/work/[slug]       Case study (editorial detail page)
/about             Studio info (the quiet page)
```

---

## Technical Stack

```
Next.js 16 (App Router)
TypeScript (strict)
Tailwind CSS v4
GSAP (ScrollTrigger for scroll-linked reveals)
Framer Motion (hover states, AnimatePresence for margin images)
Canvas API (waveform — no WebGL, no Three.js)
Lenis (smooth scroll)
Zustand (minimal: hoveredSlug only)
```

No Three.js. No WebGL. No heavy dependencies. The craft is in the composition, not the tech stack.

### Animation library boundaries

- **GSAP** owns: scroll-triggered reveals (ScrollTrigger), entrance choreography sequencing, waveform draw-in animation, parallax (ghost letters)
- **Framer Motion** owns: hover state transitions (AnimatePresence for margin images), layout animations if needed
- **CSS transitions** own: color changes (hover dimming, link hover states) — these are instant or use `transition` property with `--ease-swift`
- **Canvas API** owns: waveform rendering (requestAnimationFrame loop, independent of GSAP/FM)
- **Rule:** GSAP and Framer Motion never animate the same element. If an element needs both scroll-triggered entry AND hover animation, GSAP handles entry, then hands off to CSS/FM for hover.

### Page transition mechanism

Page transitions use a shared layout wrapper in `layout.tsx` that:
1. Listens for route changes via `usePathname()`
2. On route change: applies exit animation to `<main>` content (opacity → 0, 300ms)
3. After exit completes: React renders new page content
4. Applies enter animation (opacity: 0, y: 32, blur: 3px → clear, 500ms)
5. The waveform canvas and nav coordinates live OUTSIDE `<main>` in the layout, so they persist without re-rendering across routes
6. Implementation: a `PageTransition` wrapper component using Framer Motion's `AnimatePresence` with `mode="wait"`

### Loading states

During route transitions, the surface background is always visible. No skeleton, no spinner. The 300ms exit + 500ms enter creates an 800ms total transition where the page is "breathing" — content fades out, surface holds, content fades in. The waveform's continuous animation provides visual continuity.

---

## Files to Create/Modify

| File | Purpose |
|------|---------|
| `src/components/Waveform.tsx` | Fixed canvas waveform — the living element |
| `src/components/GhostLetters.tsx` | The 40vw HKJ letterforms with parallax |
| `src/components/NavCoordinates.tsx` | Floating nav text, top-right |
| `src/components/WorkSequence.tsx` | Project list with hover dimming + margin images |
| `src/components/MarginImage.tsx` | Fixed-position image in right margin on hover |
| `src/components/CaseStudy.tsx` | Full editorial case study layout |
| `src/components/Footer.tsx` | Minimal email + social line |
| `src/app/page.tsx` | Homepage composition |
| `src/app/work/[slug]/page.tsx` | Case study page |
| `src/app/about/page.tsx` | About page |
| `src/app/globals.css` | Ink/paper system, typography rules |
| `src/app/layout.tsx` | Font loading, waveform + nav (persistent elements) |
| `src/store/useStore.ts` | Minimal: hoveredSlug, activeProjectZone |
| `src/constants/pieces.ts` | Project data with accent colors and frequency values |
| `src/components/PageTransition.tsx` | AnimatePresence wrapper for route transitions |
| `src/app/not-found.tsx` | 404 page — surface background, waveform, minimal "not found" text |

---

## Data Model

```typescript
interface Piece {
  slug: string;
  title: string;
  type: "project" | "experiment";
  order: number;
  number: string;            // "01", "02", etc.
  sector: string;            // "Material Science", "Mobile / AI"
  description: string;       // One sentence, max ~42 words
  accent: string;            // Hex color for waveform tint
  frequency: number;         // Waveform frequency value (0.002-0.006)
  amplitude: number;         // Waveform amplitude in px (3-10)
  waveMode: "sine" | "noise"; // "noise" for WIP/unstable projects
  status: "shipped" | "wip";
  year: number;
  image?: string;            // Used for margin image + case study hero
  coverArt?: string;         // Fallback for margin image
  video?: string;            // Used in case study media section
  tags: string[];
}
```

The `accent`, `frequency`, `amplitude`, and `waveMode` fields are the resonance signature — each project's unique frequency identity.

---

## Verification

- Homepage: ghost HKJ letters visible, waveform breathing, projects in left-shifted column
- Hover any project: others fade to ghost, margin image appears, waveform shifts color
- Scroll through projects: waveform color transitions between project accents
- Click project: page fades to paper, case study blur-reveals, waveform maintains color
- Case study: metadata bar, paradox lede, body sections, bleed images, next project link
- About: quiet page, all type, no images
- Mobile: inline images, no ghost numbers, full-width column, waveform present
- Reduced motion: static waveform line, no blur reveals, instant transitions
- First visit entrance: waveform draws, then content reveals in sequence
- Repeat visit: quick fade-in, no choreography
