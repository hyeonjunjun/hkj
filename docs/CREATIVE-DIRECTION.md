# HKJ — Creative Direction
## "Resonance Archive"

> This is not a website. It is a terminal into a personal archive that exists in space. Every element — navigation, project entries, detail views — shares one material language: light emitting from darkness, captured in glass and wire.

---

## I. The World

You are looking at an interface floating in a night sky. Stars behind, void around, and in front of you: a system of luminous nodes, thin structural lines, and quiet typography. The interface feels like it was designed by someone who builds instruments, not pages.

The sky is not decoration. It is the ground plane. Content doesn't sit ON a background — it exists WITHIN an environment. The distinction matters: elements have depth, light bleeds between layers, and your cursor creates subtle gravitational disturbance in the particles around you.

---

## II. Material Language — "Luminal Glass"

Every interactive element in the portfolio shares one material: a thin-bordered container that EMITS light when active. This is the 1:1 WuWa active state treatment, applied universally.

### The Inactive State
- A thin border (1px) in `rgba(255,255,255,0.06)`
- Content inside at `rgba(255,255,255,0.3)` — readable but quiet
- No fill. The void shows through. The element is transparent glass.
- Subtle corner marks (4px L-shapes at each corner, same color as border) — registration marks, like a viewfinder

### The Active / Hover State (The Bloom)
This is the signature moment. When an element becomes active, it doesn't just "highlight" — it ignites:

**Layer 1 — The border brightens** to `rgba(255,255,255,0.25)` and gains a gold tint toward `--gold` (#C4A265)

**Layer 2 — Inner glow** appears: `box-shadow: inset 0 0 30px rgba(196,162,101,0.08)` — a warm light fills the glass from inside

**Layer 3 — Outer bloom** radiates: `box-shadow: 0 0 40px 8px rgba(196,162,101,0.06), 0 0 80px 20px rgba(196,162,101,0.03)` — the light spills into the surrounding void

**Layer 4 — Particle motes** (Canvas 2D): 8-15 tiny bright dots orbit slowly around the element's border. They have individual radial gradients (hot center, warm falloff), additive blending, and drift outward with slight upward float. They spawn from the border edges and die after 2-3 seconds.

**Layer 5 — Corner brightening**: The 4 corner registration marks shift from border color to `--gold` at 0.5 opacity. They become the brightest structural points.

**The transition**: Inactive → Active happens over 600ms. The border brightens first (0-200ms), then the inner glow fades in (100-400ms), then the outer bloom expands (200-500ms), then particles begin spawning (300ms+). It's a cascade, not a switch. Active → Inactive reverses over 400ms — particles die first, bloom contracts, glow fades, border dims.

### Where This Material Appears
- **Project nodes** on the homepage
- **Navigation items** (the active page)
- **The moon** (always in active state — the one permanently luminous element)
- **Case study section markers** as you scroll
- **Interactive buttons/links** on hover (ghost brackets become bloom brackets)
- **The clock indicator** (subtle, always-active pulse)

This is ONE material applied everywhere. The consistency IS the design system. You never see a hover effect that doesn't use this vocabulary.

---

## III. Design System

### Color

```
VOID:       #0D0D0D          The darkness. Not black — deep warm charcoal.
GOLD:       #C4A265          The one accent. Warm brass. Only appears in bloom states.
WHITE:      7 opacity stops    Content hierarchy, all on void.
  --ink-full:     rgba(255,255,255, 1.00)
  --ink-primary:  rgba(255,255,255, 0.85)
  --ink-secondary:rgba(255,255,255, 0.55)
  --ink-muted:    rgba(255,255,255, 0.30)
  --ink-faint:    rgba(255,255,255, 0.15)
  --ink-ghost:    rgba(255,255,255, 0.08)
  --ink-whisper:  rgba(255,255,255, 0.04)
```

No other colors exist in the system chrome. Project images bring their own color — but the INTERFACE is void + white + gold. Always.

### Typography

```
PRIMARY:    Fragment Mono     All structural text. The system voice. 
                              At 11px it's metadata. At 8vw it's architecture.
ACCENT:     Newsreader        Italic only. Appears in TWO places:
                              Homepage title cluster + Case study paradox lede.
                              It's the human voice in a machine interface.
BODY:       General Sans      Readable passages. 16px on dark. Max 52ch.
```

Scale matters more than font choice:
- **Architecture**: `clamp(7vw, 9vw, 140px)` — the project titles on homepage
- **Reading**: `16px` — body text in case studies
- **System**: `11px` — metadata, nav, labels, timestamps
- **Ghost**: `clamp(100px, 12vw, 160px)` — background numbers, felt not read

### Spacing

The interface uses a 4-unit base: `4, 8, 12, 16, 24, 32, 48, 64, 96`.

But spacing is not uniform. The portfolio uses **cinematic spacing** — the gap between elements communicates tempo:
- Tight (8-16px): elements that belong together (label + value)
- Standard (24-32px): elements within a section
- Breath (48-64px): between sections
- Silence (96px+): dramatic pauses (after metadata bar, before first body text)

---

## IV. The Environment (AI-Generated Illustration)

The background is a single curated illustration — a night sky with moon — generated via AI and art-directed by the creative director. NOT a procedural Three.js scene. The illustration is a fixed background image at 10-15% opacity.

### What the illustration contains
- Deep void (#0D0D0D dominant tone)
- Crescent moon in upper-right with warm golden atmospheric halo
- Stars with density variation (dense near moon, sparse lower-left)
- Subtle nebula wisps in muted earth tones
- Film grain texture for physical quality
- Compositional quiet zone in center-left for typography

### How it's implemented
- Single WebP image at 4K resolution, `background: fixed, center/cover`
- Applied as `body::after` pseudo-element at `opacity: 0.12`
- Optional: split into 2-3 layers for subtle scroll parallax via GSAP
- See `docs/BACKGROUND-PROMPTS.md` for generation prompts

### Why illustration, not procedural
- A directed image has compositional intention. Procedural is random.
- Lighter payload than Three.js (one image vs a 3D runtime)
- The creative director chose this sky. It's personal, not generated at runtime.
- The illustration can be updated, iterated, swapped — it's an asset, not code.

---

## V. Components

### 1. The Navigation Ring

Not a bar. Not floating text. A small cluster of NODES in the top-right, connected by thin lines.

```
            ○ WORK
            │
            ○ ABOUT
            │
            ○ 9:41PM
```

Each node is a small circle (6px diameter, 1px border `--ink-ghost`). Connected by 1px vertical lines. The active node gets the full bloom treatment (glow, particles, gold border). Label sits 12px to the left in Fragment Mono 11px.

The HKJ wordmark sits alone in the top-left. Fragment Mono, 12px, `--ink-muted`. It's a maker's mark, not a logo.

Bottom corners: `04` (left) and `NEW YORK 2026` (right). Same quiet metadata.

### 2. The Project Constellation (Homepage)

Projects are NOT listed vertically. They exist as a constellation of nodes in the center of the viewport. Each project is a luminous node positioned at a composed coordinate (not random, not a grid — placed like stars in a constellation diagram).

```
                        ○ Sift
                       ╱
            ○─────────○ Gyeol: 결
                       ╲
                        ○ Promptineer
                       ╱
            ○─────────○ Clouds at Sea
```

Connection lines (1px, `--ink-whisper`) link them into a network.

**At rest:** Each node shows its number (01, 02, 03, 04) in Fragment Mono 11px. The project title sits alongside in Newsreader italic at `clamp(3vw, 5vw, 48px)`. Metadata (sector · year) below in Fragment Mono 11px `--ink-muted`.

**On hover:** The hovered node ignites with the full bloom treatment. Its connection lines brighten. Other nodes dim to `--ink-whisper`. The project's hero image fades in as a large atmospheric panel behind the constellation at 12% opacity, desaturated — a memory surfacing.

**On click:** GSAP Flip — the node expands, the title scales up, the hero image fills the viewport. The constellation dissolves. You enter the project's world.

**On mobile:** The constellation collapses into a vertical list (nodes become left-aligned with connection lines becoming a vertical path). Same bloom on tap. Same transition on click.

### 3. The Waveform (Persistent)

The horizontal frequency line at ~60vh. Now it's not just a wave — it's part of the constellation's connective tissue. When a project node is hovered, the waveform section nearest to that node's vertical position pulses with the project's frequency signature.

**Rest:** White at 0.06 alpha, 6px amplitude, slow oscillation. The echo/glow line gives it depth.

**Active:** Tints toward gold, amplitude increases. The waveform is the resonance readout for whatever the user is engaging with.

### 4. The Case Study View

When you enter a project, the constellation is gone. You're in the project's space.

**Layout:** Left-shifted column (max-width 900px, margin-left 8vw). Same marginalia frame (corners, wordmark, nav ring). But now the nav ring's project node is in full bloom state.

**Structure:**
```
[metadata bar — Fragment Mono 11px, gold chrome number]

        96px silence

[paradox lede — Newsreader italic, the human voice]

        48px

[stakes — General Sans 16px, --ink-secondary]

[hero image — bleeds right, viewfinder corner marks,
 image-treatment filter, scroll-triggered reveal]

[modular blocks — each with bloom-state section markers
 that ignite as you scroll past them]

[next project — a single node with connection line
 pointing to the next project. Bloom on hover.]
```

The section markers along the left edge are small nodes (same 6px circles) that ignite with bloom as their section enters the viewport. This creates a vertical "progress constellation" — you can see how deep into the case study you are by which nodes are lit.

### 5. The Viewfinder Image Frame

Images are placed inside thin-bordered containers with corner registration marks (the "luminal glass" material). On scroll-reveal, the image fades in while the frame's corners brighten with gold. On hover, the frame gets the subtle bloom treatment.

```
┌╴                              ╶┐
│   8px padding                   │
│   ┌─────────────────────────┐   │
│   │                         │   │
│   │      IMAGE              │   │
│   │      (desaturated,      │   │
│   │       contrast-boosted) │   │
│   │                         │   │
│   └─────────────────────────┘   │
│                                 │
└╴                              ╶┘
```

Corner marks: 16px arms, 1px thick. They extend OUTWARD from the border.

### 6. Ghost Brackets (Links/CTAs)

```
[ VIEW CASE STUDY ]
```

Brackets are `--ink-ghost`. Text is `--ink-muted`. On hover: brackets shift to `--gold` at 0.4, text shifts to `--ink-primary`. The bracket characters physically are Fragment Mono at 13px while the text is 11px — the brackets are slightly oversized containers.

No movement. Just light levels. WuWa discipline.

### 7. The About View

Same environment, same frame. The constellation is replaced by a single centered block of text.

The philosophy statement in Newsreader italic at the same scale as homepage titles — it's the ONE moment where words fill the space that projects normally occupy. This is the "character screen" — where you learn about the person behind the work.

Experience timeline uses the same node system — each role is a node on a vertical line, with the current role in bloom state.

---

## VI. Motion Language

### Two Tempos Only
- **Immediate (0-200ms):** Hover states, dimming, cursor response, node state changes
- **Considered (400-800ms):** Page transitions, bloom cascade, constellation rearrangement

### The Bloom Cascade (the signature animation)
See Section II. Border → inner glow → outer bloom → particles. 600ms total, staggered start times create the feeling of light propagating outward from the center.

### Page Transition
1. Current content fades to void (300ms)
2. Constellation nodes rearrange (if navigating between pages) or a single node expands (if entering a project)
3. New content blur-reveals (500ms)
4. The star field is ALWAYS present — it never transitions. Continuity.

### Scroll Reveals
Content enters via simple opacity + y-shift (no blur on mobile). The section marker nodes ignite as each section enters the viewport. This is the ONLY scroll-triggered motion.

### Reduced Motion
- Star field: static (no twinkle, no parallax)
- Bloom: instant state change (no cascade)
- Transitions: instant content swap
- Waveform: static line
- Everything still functional, just still.

---

## VII. Technical Architecture

```
Canvas 2D         → Bloom particles (per-component, small overlay canvases)
CSS                → Bloom glow (box-shadow cascade), borders, transitions
GSAP              → Scroll triggers, Flip transitions, entrance sequences
Framer Motion     → Presence animations (mount/unmount)
Next.js 16        → Routing, SSR, image optimization
Background        → AI-generated illustration (static asset, CSS-applied)
```

NO Three.js. The environment is an image. The interactivity lives in HTML/CSS/Canvas 2D. The bloom particles are small overlay canvases positioned absolutely over each active element — one per bloom instance, ~200x200px each, lightweight.

---

## VIII. What This Is NOT

- Not a website with a star background. The stars are the GROUND, not wallpaper.
- Not a dark mode portfolio. The darkness is the material of the world.
- Not a template with effects. Every component shares one material language (luminal glass).
- Not performative. The bloom effect serves a UX purpose: it tells you what's active, what's interactive, what's alive. Form follows function, then transcends it.

---

## IX. Implementation Priority

1. **The bloom component** — get the 1:1 WuWa active state working as a reusable React component. This is the DNA. Everything else depends on it.
2. **The navigation ring** — replace floating text nav with node-based system using bloom.
3. **The project constellation** — replace the vertical work list with composed node layout.
4. **The star field refinement** — cursor influence on stars, density tuning, nebula adjustment.
5. **The case study adaptation** — viewfinder frames, section marker nodes, scroll-triggered bloom.
6. **Page transitions** — constellation-based navigation between views.
