# Hero Section Research: Single-Viewport Project Viewing

> Research conducted 2026-03-30. Focused on implementable techniques for HKJ Studio portfolio using GSAP + Next.js (no Three.js).

---

## Current State

The existing hero has:
- Monumental "HKJ" brand name as backdrop (opacity 0.12, clamp 180-480px)
- Featured image on the left (38vw, crossfade on hover)
- Project index text list on the right (11px mono, uppercase)
- Hover on index item swaps the featured image
- Tagline bottom-left, scroll cue bottom-center

**What it lacks:** The hero feels static between hover interactions. The image swap is CSS crossfade only -- no spatial movement, no cursor reactivity, no ambient life. The project index is small and passive. There is no sense of browsing or discovery.

---

## Pattern 1: Dennis Snellenberg Hover-Following Image (The Proven Pattern)

**Source:** dennissnellenberg.com, Olivier Larose tutorial reconstruction

### How It Works
A text list of projects occupies the viewport. On hover over any project name, a modal image appears near the cursor and follows the mouse with a smooth delay. The image swaps as the user moves between different project names.

### Exact Technical Details

**GSAP quickTo for mouse following:**
```js
// Three separate quickTo instances create layered trailing
let xMoveContainer = gsap.quickTo(modal, "left", { duration: 0.8, ease: "power3" });
let yMoveContainer = gsap.quickTo(modal, "top",  { duration: 0.8, ease: "power3" });

// Cursor dot trails slightly faster
let xMoveCursor = gsap.quickTo(cursor, "left", { duration: 0.5, ease: "power3" });
let yMoveCursor = gsap.quickTo(cursor, "top",  { duration: 0.5, ease: "power3" });

// Label trails fastest
let xMoveLabel = gsap.quickTo(label, "left", { duration: 0.45, ease: "power3" });
let yMoveLabel = gsap.quickTo(label, "top",  { duration: 0.45, ease: "power3" });
```

**Staggered durations create the "trailing" feel:**
- Container (image): 0.8s
- Cursor dot: 0.5s
- "View" label: 0.45s
- All use `power3` easing

**Image dimensions:** 300px wide, height auto (roughly 400px for 4:5 ratio)

**Scale animation on enter/exit (Framer Motion):**
```js
const scaleAnimation = {
  initial: { scale: 0, x: "-50%", y: "-50%" },
  enter:  { scale: 1, x: "-50%", y: "-50%", transition: { duration: 0.4, ease: [0.76, 0, 0.24, 1] } },
  closed: { scale: 0, x: "-50%", y: "-50%", transition: { duration: 0.4, ease: [0.32, 0, 0.67, 0] } },
};
```

**Image swap mechanism:**
- All images stacked vertically inside the modal
- `top: index * -100%` shifts to show the correct image
- CSS transition handles the sliding between images
- No clip-path -- it is a scale-from-center reveal

**Key insight:** The magic is in the DELAY DIFFERENTIAL between cursor and image container. The image visibly lags behind the cursor, creating a physical "dragging" sensation.

### Applicability to HKJ
**HIGH.** The current site already has a project text list on the right. Instead of a fixed image on the left, the image could follow the cursor when hovering over the index. This eliminates the static left-side image and makes every hover interaction feel alive.

---

## Pattern 2: GSAP Observer -- Wheel/Keyboard Project Navigation

**Source:** GSAP Observer plugin docs, Codrops carousel mastery article

### How It Works
Instead of (or in addition to) hover, the user scrolls the mouse wheel or presses arrow keys to cycle through projects -- all within the hero, without page scroll. The viewport is pinned; wheel input navigates between project slides.

### Technical Details

```js
gsap.registerPlugin(Observer);

Observer.create({
  target: window,          // or the hero section element
  type: "wheel,touch",     // listen to wheel and touch
  tolerance: 50,           // 50px minimum before triggering
  onDown: () => nextProject(),
  onUp: () => previousProject(),
  // Available: deltaX, deltaY, velocityX, velocityY
});
```

**Key configuration:**
- `tolerance: 50` prevents accidental triggers
- `debounce: true` (default) batches events per frame
- `wheelSpeed: 1` multiplier for sensitivity
- `lockAxis: true` to prevent diagonal confusion

**Transition between projects (from Codrops):**
- Exit: `ease: "power2.in"`, 0.3s duration
- Enter: `ease: "power1.inOut"`, 0.4-0.5s duration
- Staggered text reveals: 0.14-0.2s stagger between elements
- Image parallax: `xPercent` shift 0-50% based on progress
- Active slide opacity 1, inactive 0.3

**Editorial carousel feel (not generic):**
- Progress indicators that update dynamically
- Function-based values so each slide animates differently
- `onChange` callbacks trigger synchronized text reveals
- `horizontalLoop()` helper for seamless infinite cycling

### Applicability to HKJ
**MEDIUM-HIGH.** Could replace or augment the hover-index pattern. Wheel events within the hero cycle through projects, with the image area performing editorial transitions. Combined with the hover-index, this gives TWO input methods: hover to preview, wheel to browse sequentially.

---

## Pattern 3: Mouse-Position Parallax (Ambient Life Layer)

**Source:** GSAP community, Antstack magnetic parallax tutorial

### How It Works
Elements within the hero shift slightly based on cursor position relative to viewport center. Different elements move at different speeds/directions, creating a layered depth effect that makes the page feel "alive" even when the user is just idly moving their mouse.

### Technical Implementation

```js
const hero = document.querySelector('.hero');
const layers = document.querySelectorAll('.parallax-layer');

// Movement multipliers per layer (higher = more movement)
const speeds = [0.02, 0.04, 0.06]; // subtle!

hero.addEventListener('mousemove', (e) => {
  const rect = hero.getBoundingClientRect();
  // Normalize to -1...+1 from center
  const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
  const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

  layers.forEach((layer, i) => {
    gsap.to(layer, {
      x: x * speeds[i] * rect.width,
      y: y * speeds[i] * rect.height,
      duration: 0.8,
      ease: "power2.out",
    });
  });
});

// Reset on mouse leave
hero.addEventListener('mouseleave', () => {
  layers.forEach((layer) => {
    gsap.to(layer, { x: 0, y: 0, duration: 1.2, ease: "elastic.out(1, 0.75)" });
  });
});
```

**Recommended multipliers for subtlety:**
- Brand name backdrop: 0.01-0.02 (barely perceptible)
- Featured image: 0.03-0.04 (gentle drift)
- UI labels: 0 (anchored, not moving)
- Decorative elements: 0.05-0.06 (most responsive)

**Reset easing:** `elastic.out(1, 0.75)` gives a gentle bounce-back when cursor leaves

### Applicability to HKJ
**HIGH.** The monumental "HKJ" backdrop and the featured image are perfect candidates. Even 10-20px of cursor-driven drift would transform the hero from a flat composition to a spatial one. Zero performance cost. Immediate "alive" feeling.

---

## Pattern 4: Animated Grain Texture (Ambient Life)

**Source:** CSS-Tricks, grained.js

### Complete Implementation

```css
.hero::after {
  content: "";
  position: fixed;
  top: -100%;
  left: -50%;
  width: 300%;
  height: 300%;
  opacity: 0.03;           /* very subtle -- 0.03 to 0.08 range */
  background-image: url("/grain.png");  /* ~400px repeating grain */
  animation: grain 8s steps(10) infinite;
  pointer-events: none;
  z-index: 999;
}

@keyframes grain {
  0%, 100% { transform: translate(0, 0); }
  10% { transform: translate(-5%, -10%); }
  20% { transform: translate(-15%, 5%); }
  30% { transform: translate(7%, -25%); }
  40% { transform: translate(-5%, 25%); }
  50% { transform: translate(-15%, 10%); }
  60% { transform: translate(15%, 0%); }
  70% { transform: translate(0%, 15%); }
  80% { transform: translate(3%, 35%); }
  90% { transform: translate(-10%, 10%); }
}
```

**SVG filter alternative (no image needed):**
```html
<svg style="display:none">
  <filter id="grain">
    <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
    <feColorMatrix type="saturate" values="0"/>
  </filter>
</svg>
```

**Key:** Keep opacity between 0.03-0.05 for portfolio work. Higher values feel "grungy" rather than refined.

### Applicability to HKJ
**ALREADY PRESENT** (partially). The current site has grain overlays on images. An animated full-viewport grain would add continuous subtle motion to the entire hero.

---

## Pattern 5: Niccolo Miranda -- Paper Portfolio (Metaphor-Driven Hero)

**Source:** niccolomiranda.com

### Design Concept
The entire portfolio is framed as a vintage newspaper. The hero contains a draggable horizontal carousel of project cards. Page transitions use a "paper curtain" WebGL effect -- paper appears to fold/ripple between views.

### Key Techniques
- Horizontal drag carousel within the hero viewport
- Continuous marquee text animations that pause on interaction
- Canvas-based paper transition (custom shaders with ripple/curve)
- Testimonial section integrated into the single viewport
- Each project card has thumbnail + descriptive text + link

### Applicability to HKJ
**LOW-MEDIUM for direct copying, HIGH for concept.** The newspaper metaphor is unique to Miranda. But the idea of a draggable project carousel within the hero -- where you physically interact with project cards rather than just hovering over a text list -- is strong. HKJ could have a horizontal strip of project thumbnails that the user drags or scrolls through.

---

## Pattern 6: SJ Zhang -- Digital Garden Dashboard (sj.land)

**Source:** sj.land

### Design Concept
Not a portfolio in the traditional sense. The homepage is a personal dashboard: greeting + curated content blocks (updates, products, reading list, design work). Left sidebar has keyboard shortcuts (1-9, 0, -). Light/dark/auto toggle.

### Key Techniques
- Keyboard-driven navigation via sidebar shortcuts
- Content organized as curated "blocks" not project cards
- Scannable information density over visual spectacle
- App-like feel: built with Next.js, navigation feels like software

### Applicability to HKJ
**LOW for visual approach, MEDIUM for keyboard navigation.** The keyboard shortcut concept (press 1-6 to jump to a project) could complement wheel/hover navigation. The dashboard density conflicts with HKJ's editorial restraint.

---

## Pattern 7: Cathy Dolle -- Typographic Index as Hero

**Source:** cathydolle.com (previously analyzed)

### Key Techniques
- Numbered typographic index IS the hero (01/ARD, 02/Project Name...)
- 11px uppercase text, 11vh row height per project
- Alternating left/right alignment creates asymmetric rhythm
- List/Slider toggle switches between text-only and image views
- Black and white only, hover reveals images

### Applicability to HKJ
**HIGH for the index pattern.** HKJ already has a text index. Cathy Dolle proves that a text index CAN be the entire hero if given enough spatial rhythm (11vh per item) and interaction depth (hover image reveals, view mode toggle).

---

## Recommended Implementation Strategy for HKJ

### Tier 1: Immediate Impact (implement first)

**1a. Cursor-following image on hover (Dennis Snellenberg pattern)**
Replace the fixed left-side image with a cursor-following modal. When hovering over a project name in the right-side index, the project image appears near the cursor and follows it with GSAP quickTo delay.

Technical specs:
- Image size: 320px wide, 4:5 ratio (400px tall)
- Container quickTo duration: 0.8s, ease: "power3"
- Scale enter: 0.4s, ease: [0.76, 0, 0.24, 1]
- Scale exit: 0.4s, ease: [0.32, 0, 0.67, 0]
- Image swap: CSS top offset (`index * -100%`)
- Position: pointer-events none on the modal container

**1b. Mouse-position parallax on brand name + image**
Add subtle cursor-driven drift to the "HKJ" backdrop and the image.

Technical specs:
- Brand name: multiply cursor offset by 0.015 (10-15px max movement)
- Image: multiply by 0.03 (15-25px max movement)
- Transition: gsap.to with duration 0.8s, ease "power2.out"
- Mouse leave reset: duration 1.2s, ease "elastic.out(1, 0.75)"

### Tier 2: Enhanced Browsing

**2a. Wheel navigation through projects (GSAP Observer)**
While cursor is within the hero, mouse wheel cycles through projects sequentially. Each cycle updates the featured image and highlights the corresponding index item.

Technical specs:
- Observer tolerance: 50px
- Image transition: clip-path inset reveal, 0.5s, ease "circ.inOut"
- Text highlight transition: 0.25s color change
- Debounce: true (default)

**2b. Keyboard navigation**
Arrow up/down or number keys (1-6) select projects within the hero.

### Tier 3: Atmospheric Layer

**3a. Animated full-viewport grain**
Add the CSS grain animation as a viewport-level overlay.

- Opacity: 0.03
- Animation: 8s steps(10) infinite
- Layer: fixed position, 300% width/height, z-index above content

**3b. Subtle counter/metadata animation**
Show a project counter (01/06) that animates on project change. Show project year and tags that crossfade with each selection.

---

## Sites Studied

| Site | Hero Pattern | Key Technique | Quality |
|------|-------------|---------------|---------|
| dennissnellenberg.com | Text list + cursor-following image | GSAP quickTo trailing, scale reveal | Proven, Awwwards SOTD |
| niccolomiranda.com | Draggable horizontal carousel + paper metaphor | WebGL transitions, drag interaction | Awwwards SOTM |
| aristidebenoist.com | Developer portfolio with motion focus | Could not extract details (JS-rendered) | Awwwards SOTD 2025 |
| sj.land | Dashboard/garden with keyboard nav | Sidebar shortcuts, content blocks | Unique approach |
| tomsears.me | Text-first credentials hero | Minimalist, reputation-driven | Clean but static |
| cathydolle.com | Numbered typographic index | 11px text, 11vh rows, view toggle | Awwwards SOTD 2026 |

---

## Key Principles Extracted

1. **The trailing delay IS the magic.** Dennis Snellenberg's image doesn't just appear -- it lags 0.3-0.8s behind the cursor. This single detail transforms a hover effect into a physical sensation.

2. **Multiple input methods prevent dead zones.** Hover + wheel + keyboard means there is always something the user can do. No "now what?" moments.

3. **Ambient motion should be imperceptible until you look for it.** Grain at 0.03 opacity, parallax at 15px max movement. If a user notices the effect consciously, it is too strong.

4. **The text list is underrated.** Both Snellenberg and Dolle prove that a typographic project index, done with enough spatial rhythm, IS the hero. You do not need a grid of thumbnails.

5. **Image reveal > image swap.** A scale-from-zero or clip-path reveal feels intentional. A CSS opacity crossfade feels like loading. The 0.4s scale animation with [0.76, 0, 0.24, 1] easing is the standard.

6. **The hero should have state.** Current project, hover state, scroll position -- these should all be visible. A counter (01/06), highlighted index item, and active image create a sense of "I am here in this collection."
