# HKJ Framework

> The governing document for hkjstudio.com.
> A design engineering studio website. Personal projects alongside professional work.
> Every decision exists because it makes the site better for the visitor and the work.

---

## What this site is

A studio website for HKJ — a design engineering practice based in New York. It shows work (personal and professional), demonstrates craft, and makes it easy for someone to understand what the studio does, how it thinks, and whether they want to work with it.

It should feel like a well-made book that happens to be interactive. Warm, typographic, material. Like opening something someone spent time on.

## What this site is not

- Not a tech demo. No shader heroes, no WebGL canvases on the homepage.
- Not dark mode. The warmth of paper is the identity.
- Not a creative developer portfolio. This is a studio, not a playground.
- Not a clone of any reference. Paco, Rauno, Bao, Aristide — they inform taste, not templates.

---

## 1. Identity

### The brand is the material

HKJ's visual identity is ink on paper. One warm ground color. One ink color at multiple opacities. Three typefaces with strict roles. That's it. The constraint IS the brand.

No logo mark. The wordmark is "HKJ" set in Fragment Mono, uppercase, letterspaced. Every time it appears, it looks identical. This is the logo.

### The duality

Two layers that coexist without competing:

**Surface:** Warm, typographic, considered. Paper tone, serif display text, generous spacing. This is what a visitor sees first. It reads as someone with taste and care.

**Substrate:** Code-structured. Monospace metadata, sequential numbering, and — selectively — computational reveals (text dissolving into monospace characters during transitions, noise-based image materialization). This is what a visitor discovers through interaction. It reads as someone who thinks in systems.

The surface never goes away. The substrate never dominates.

---

## 2. Color

### One ink. One paper. That's the foundation.

```css
--paper: #f7f6f3;

--ink-full:      rgba(35, 32, 28, 1.00);
--ink-primary:   rgba(35, 32, 28, 0.82);
--ink-secondary: rgba(35, 32, 28, 0.52);
--ink-muted:     rgba(35, 32, 28, 0.35);
--ink-faint:     rgba(35, 32, 28, 0.20);
--ink-ghost:     rgba(35, 32, 28, 0.10);
--ink-whisper:   rgba(35, 32, 28, 0.05);
```

No accent color on the base page. No gradients. No colored links. The ink opacity scale handles all hierarchy.

### Project colors

Each project gets its own color identity on its case study page. Project covers on the homepage use the project's color as background for color-field covers, or show photography. These are the ONLY place non-ink colors appear.

---

## 3. Typography

Three fonts. Three roles. No exceptions.

| Role | Font | Usage |
|------|------|-------|
| Display | Newsreader (variable, italic) | Project titles, philosophy statement, editorial headings |
| Body | Satoshi (variable) | Descriptions, paragraphs, navigation |
| System | Fragment Mono | Dates, metadata, labels, clock, wordmark, section numbers |

### Scale

| Element | Size | Notes |
|---------|------|-------|
| Philosophy statement | clamp(22px, 3vw, 32px) | The largest text. Newsreader italic. |
| Project title (cover) | clamp(18px, 2.5vw, 24px) | Newsreader. Prominent but not competing. |
| Body text | 15px | Satoshi. Comfortable reading. |
| Nav links | 11px | Fragment Mono, uppercase, letterspaced. |
| Section labels | 10-11px | Fragment Mono, uppercase, letterspaced. Always --ink-muted. |
| Metadata | 10px | Fragment Mono. The quietest voice. |

### Rules

- `text-rendering: optimizeLegibility` on body
- `font-feature-settings: "kern" 1, "liga" 1` on display text
- `font-feature-settings: "tnum" 1` on mono (tabular numbers for clock)
- Line height: 1.35 for display, 1.7 for body
- `letter-spacing: -0.01em` on Satoshi body
- `letter-spacing: 0.06em` on Fragment Mono labels
- Never bold body text. Hierarchy through opacity and size only.
- Max reading width: 54ch for body text, 900px for cover grid

---

## 4. Spacing

```
4px   — micro: tag padding, inline gaps
8px   — small: tight internal spacing
12px  — compact: related elements
16px  — standard: list items, internal padding
24px  — comfortable: component padding, page side padding
32px  — room: gap between label and content
48px  — break: between content blocks
56px  — section: between major sections
72px  — breath: hero top margin, pre-footer space
```

Every value on-scale. Section-to-section is always consistent. When in doubt, more space.

---

## 5. Structure

### Pages

```
/                       Homepage (studio landing)
/work/[slug]            Project case study
/exploration            Visual studies gallery (flat, no detail pages)
/writing                Notes and observations
/writing/[slug]         Individual entry
/about                  Studio info, experience, contact
```

### Homepage sections

| Order | Section | Purpose |
|---|---|---|
| 1 | Identity | Studio philosophy — one sentence, Newsreader italic |
| 2 | Status | NEW YORK · OPEN TO WORK — Fragment Mono |
| 3 | Work | Project list with hover-activated covers |
| 4 | Exploration | Small preview, link to gallery |
| 5 | Now | What the studio is currently working on (updated monthly) |
| 6 | Footer | Email, socials, colophon |

The work section is the visual center of gravity. Everything above sets context. Everything below is supporting detail.

### Content priority (5-second test)

A first-time visitor should understand three things within 5 seconds:
1. Studio name and what it does
2. The quality of the work (through the covers)
3. How to see more or get in touch

---

## 6. Work presentation

### Homepage: Text list with hover-activated covers

At rest, the work section is typographic:
```
01  GYEOL: 결                     Material Science · 2026
02  Sift                          Mobile / AI · 2025
03  Conductor                     Design Systems · 2026 · In Progress
```

Each row: project number (Fragment Mono, --ink-ghost) + title (Newsreader) + metadata (Fragment Mono, --ink-muted).

On hover: the project's cover image appears — a full-width reveal below the text row, or a cursor-following thumbnail beside the text. The image materializes with the dissolve shader (noise-based, ink-on-paper feel).

On click: FLIP transition — the cover image morphs into the case study hero. The substrate briefly becomes visible (monospace character scramble overlay at 0.2 opacity for 200ms).

On mobile: covers are always visible in a stacked layout. No hover interaction.

### Case study pages

Full editorial layout. Max-width 900px for content. Can break to full-width for images. Structure:
- Hero metadata (title, role, year, sector)
- Narrative lede (paradox/stakes)
- Editorial body
- Process steps
- Key details / highlights
- Engineering section
- Media (videos, images with scroll-triggered reveals)
- Closing statement
- Prev/next navigation

---

## 7. Animation

### Foundation: Rauno's vocabulary

All reveals use blur as the primary primitive. Content comes into focus, not slides into position.

```css
--ease-swift: cubic-bezier(.23, .88, .26, .92);
```

### Presets

| Context | From | To | Duration | Stagger |
|---------|------|----|----------|---------|
| Hero text | opacity:0, y:40, blur:4px | clear | 600ms | 80ms |
| Nav elements | opacity:0, y:10, blur:2px | clear | 500ms | 60ms |
| Project cards | autoAlpha:0, y:40, scale:0.97, blur:4px | clear | 600ms | 100ms |
| Section content | opacity:0, y:32, blur:3px | clear | 500ms | 60ms |
| Metadata | opacity:0, y:8, blur:1px | clear | 400ms | 40ms |
| Mask text | yPercent:100, opacity:0 | clear | 750ms, expo.out | 75ms |
| Exit | clear | opacity:0, y:-40, blur:4px | 400ms | — |

### Two tempos only

- **Immediate** (100-200ms): hover states, tooltips, press feedback
- **Considered** (400-750ms): page entrances, scroll reveals, transitions

No middle ground. The gap is intentional.

### Preloader

No separate overlay. Content reveals in place:
1. Nav elements fade in first (the fixtures of the room)
2. Philosophy statement reveals with mask or blur animation
3. Project list reveals with stagger
4. Scroll-triggered: sections below the fold

Repeat visits: quick 0.3s fade-in, no choreography.

### Page transitions

FLIP for project cards → case study. Standard overlay fade for nav links.

Exit: content fades to paper color (0.3s). Enter: new content blur-reveals (0.5s). The paper background is constant — no flash, no black.

### Substrate reveal (the signature moment)

During FLIP page transitions, a brief (200ms) overlay of monospace characters at low opacity (0.15) appears between the exit and enter phases. Like the computational layer briefly becoming visible before the new content resolves. Not every transition — only project card → case study.

### Hover states

Links: opacity steps up + warm underline draws from left (300ms, scaleX 0→1).
Project rows: cover image materializes with dissolve shader.
Active: scale(0.97) for 100ms.

### Scroll reveals

ScrollTrigger, threshold 85% viewport, once:true. Uses REVEAL_CONTENT preset.

### prefers-reduced-motion

All animation disabled. Content visible immediately. Site remains fully functional.

---

## 8. Components

### NYC Clock

Live New York time in the nav bar. Fragment Mono, 10px, --ink-muted. Format: `10:47 PM EST`. Updates every minute. Small, personal, grounding.

### Now Playing (optional — keep if it adds personality)

Tiny widget in nav: album art (24x24) + song title + artist. Fragment Mono. Updated manually via constants. If it clutters the nav, remove it.

### DissolveImage

WebGL noise-based reveal for project images. FBM noise dissolves a mask on viewport entry. Falls back to opacity reveal. Duration: 1.2s.

### GrainTexture

SVG feTurbulence overlay for color-field project covers (WIP projects without images). Barely visible. Gives flat color fields materiality.

---

## 9. Technical

### Stack

```
Next.js 16 (App Router)
TypeScript (strict)
Tailwind CSS v4
GSAP (ScrollTrigger, Flip, SplitText)
Lenis (smooth scroll)
Zustand (minimal state)
Vercel (deployment)
```

### Performance targets

| Metric | Target |
|--------|--------|
| LCP | < 2.0s |
| CLS | < 0.05 |
| INP | < 100ms |
| Lighthouse | 90+ |
| Initial JS | < 150KB gzipped |
| Fonts | < 130KB total |

### What was removed (and why)

| Component | Why removed |
|-----------|-------------|
| WallLight shader | Flat paper is better than a shader that looks like flat grey. The warmth comes from the color, not a canvas. |
| Time-of-day palette | Requires every variant to be excellent. Night mode flattened the brand. |
| Vinyl + cat | Fun but wrong for a studio site. Too playful, not considered enough. |
| KineticText | Too much motion for a book-like surface. Static text with mask reveals is more confident. |
| Custom cursor | Overused pattern. Default cursor is fine. |
| BuildingOverlay | Decorative, not structural. Removed. |
| Spatial audio | Scope creep. Maybe v2. |

### What stays

| Component | Why kept |
|-----------|---------|
| NYC Clock | Personal, grounding, small. |
| DissolveImage | Fits ink-on-paper metaphor. |
| FLIP transitions | The single most impressive portfolio interaction. |
| Blur-reveal presets | Rauno-level polish, proven effective. |
| Preloader (simplified) | Content revealing in place, no dark overlay. |
| TransitionLink | Smooth internal navigation. |
| GrainTexture | Material quality on color-field covers. |

---

## 10. Principles

1. **If removing it doesn't make the site worse, remove it.**
2. **The work is louder than the container.**
3. **Warmth is the default. Code is the discovery.**
4. **Typography does the heavy lifting. Everything else supports it.**
5. **One ink, one paper, three fonts. That's the brand.**
6. **The site should feel like someone made it on purpose.**
7. **Ship, then polish. Never polish what hasn't shipped.**
