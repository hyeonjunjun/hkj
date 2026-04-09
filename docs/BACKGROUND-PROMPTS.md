# Background Illustration — AI Generation Prompts

## The Brief

A single, large-format illustration that serves as the GROUND PLANE of the portfolio. It sits behind all content at reduced opacity. It should feel like you're looking out a window into a vast, quiet space — not like a wallpaper pattern or a desktop background.

Key constraints:
- Must work at very low opacity (8-15%) behind white text
- Must have a clear light source (upper-right) that motivates the gold accent color
- Must have density variation (not uniform) — more detail in one region, emptiness elsewhere
- Must not compete with typography — the composition should have a "quiet zone" in the center-left where project titles live
- Resolution: generate at 4K minimum (3840x2160), export as WebP at quality 85

---

## Base Prompt (Start Here)

```
A vast night sky seen from a high elevation, looking slightly upward. 
Deep charcoal-black void (#0D0D0D) as the dominant tone. A luminous 
crescent moon positioned in the upper-right quadrant, emitting a warm 
golden atmospheric halo. Scattered stars with varied brightness — 
denser near the moon, sparse toward the lower-left. Subtle nebula 
wisps in muted earth tones (amber, deep blue-grey) near the horizon 
line. The mood is solitary, contemplative, vast. No clouds. No 
landscape. No text. Photographic realism with a slight film grain 
texture. Captured on medium format film. 16:9 aspect ratio.
```

## Variations to Try

### V1 — More Atmospheric
```
[base prompt] + Emphasize atmospheric haze around the moon — 
concentric rings of diminishing gold light bleeding into the void. 
The haze should feel like moisture in the air catching moonlight. 
Stars are slightly diffused through the atmosphere.
```

### V2 — More Minimal
```
[base prompt] + Extremely sparse composition. Only 30-40 visible 
stars. The moon is smaller, more distant. The void dominates 90% of 
the frame. The emptiness is the subject. Inspired by Hiroshi Sugimoto 
seascapes — the boundary between something and nothing.
```

### V3 — More Textural
```
[base prompt] + Heavy film grain throughout. The darkness has visible 
texture — like looking at a darkroom print. Stars have slight halation 
(bright cores with soft bloom). The moon's glow has chromatic 
aberration at the edges — slight blue fringing. Shot on expired Kodak 
Portra 800 pushed two stops.
```

### V4 — With Horizon
```
[base prompt] + A barely visible horizon line in the lower 10% of the 
frame — the faintest suggestion of a landscape or ocean, almost 
indistinguishable from the sky. The liminal space between ground and 
sky. The horizon is felt more than seen — a slight gradient shift 
from pure void to marginally warmer darkness.
```

### V5 — Korean Night Sky
```
A night sky photographed from the Korean countryside, Gangwon-do 
province. Deep void black with the Milky Way faintly visible as a 
diagonal band from lower-left to upper-right. A warm-toned crescent 
moon in the upper-right with atmospheric golden halo. The light has 
the quality of Korean autumn — clear, cold air, sharp stars. Film 
grain. No light pollution. No foreground elements. Medium format, 
16:9 crop.
```

---

## Style Modifiers (Append to Any Prompt)

### For More WuWa Feel
```
+ Color grading: deep shadows with warm gold highlights. 
The darkness is not neutral — it leans slightly warm (#0D0D0B). 
Light sources have a supernatural quality — slightly more luminous 
than physically accurate, as if the moon is a designed light, not 
a natural one.
```

### For More Editorial Feel
```
+ The composition follows the rule of thirds precisely. The moon 
sits at the upper-right intersection point. The densest star cluster 
sits at the upper-right third. The lower-left two-thirds are 
intentionally empty — designed to hold typography.
```

### For Grain / Texture
```
+ ISO 3200 film grain. Visible at 100% zoom but not distracting at 
normal viewing distance. The grain gives the digital void a physical 
quality — like looking at a printed photograph rather than a screen.
```

### For Depth
```
+ Three planes of depth: foreground stars (few, bright, slightly 
defocused), midground stars (most of them, sharp), background stars 
(many, tiny, nearly invisible). The depth creates parallax potential 
if the image is later split into layers.
```

---

## Implementation Notes

Once you have the illustration:

1. Export as WebP at quality 85, max dimension 3840px
2. Place at `/public/images/sky.webp`
3. Apply as a fixed background via CSS:
```css
body::after {
  content: "";
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background: url('/images/sky.webp') center/cover no-repeat fixed;
  opacity: 0.12;  /* start here, adjust to taste */
}
```
4. All content needs `position: relative; z-index: 1;` to sit above
5. The opacity is the key lever — too high and it fights the text, too low and you lose the atmosphere. 0.10-0.15 is the sweet spot.

### Layering for Parallax (Optional)
If you want subtle parallax on scroll, generate the illustration in LAYERS:
- Layer 1: Moon + atmospheric halo (moves slowest, 0.1x scroll speed)
- Layer 2: Bright foreground stars (moves at 0.3x)
- Layer 3: Dense star field (moves at 0.15x)

Each layer is a separate image, positioned fixed with GSAP scroll-linked transforms.

### Color Harmony Check
The illustration's gold halo should match or complement `--gold: #C4A265`. When generating, look for:
- Moon glow in the range of #B89A58 to #D4B070
- If the AI gives you a cool-toned moon, re-generate — it MUST be warm gold to match the design system
