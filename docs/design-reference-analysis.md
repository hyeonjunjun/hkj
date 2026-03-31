# Design Reference Analysis — Taste Skill Framework

> Applied with DESIGN_VARIANCE: 8, MOTION_INTENSITY: 6, VISUAL_DENSITY: 4

## Sites Studied

| Site | URL | Why It Matters |
|------|-----|----------------|
| **Cathy Dolle** | cathydolle.com | Primary reference — List/Slider toggle, 11px mono, fashion-archive feel |
| **Corentin Bernadou** | corentinbernadou.com | Infinite horizontal carousel, text-heavy, minimal chrome |
| **Jin Su Park** | jinsupark.com | Numbered grid (01-67), category filters, live clocks |
| **Will Phan** | willphan.com | Dark-first, blur hover effects, 1s cubic-bezier transitions |
| **iamrobin** | iamrob.in | Scroll-snap carousel, spring easing (.34,1.56,.64,1), staggered hero |
| **Chris Shu** | chrisshu.com | Ultra-minimal (no scroll), #000 bg, #e8e8e8 text, max-w 440px |
| **Tayte.co** | tayte.co | Lenis scroll, Montreal Medium, sticky cards, analog clock, blur(2px) fade-in |
| **New Genre** | newgenre.studio | Two-typeface system, spacious whitespace, card + service tags |

---

## Pattern 1: The Universal Easing Curve

Every premium site picks ONE curve and uses it everywhere. Consistency = the "weight."

| Site | Primary Easing | Duration Range |
|------|---------------|----------------|
| Cathy Dolle | `ease-in-out` | 200ms (all) |
| Tayte.co | `cubic-bezier(0.65, 0, 0.35, 1)` | 150ms/200ms/500ms/800ms |
| Will Phan | `cubic-bezier(0.59, 0.14, 0.35, 0.99)` | 1000ms |
| iamrobin | `cubic-bezier(.34, 1.56, .64, 1)` (spring) | 600ms |
| TLB | `cubic-bezier(.19, 1, .22, 1)` | 750ms |

**What HKJ currently does:** Mixes `power2.out`, `power3.out`, `expo.out`, `cubic-bezier(.16,1,.3,1)`, `cubic-bezier(.19,1,.22,1)`, and `cubic-bezier(.22,1,.36,1)` — six different curves across the same page. This creates inconsistency. Objects don't feel like they live in the same physical world.

**Recommendation:** Pick ONE. Based on MOTION_INTENSITY: 6, the right curve is:
```
cubic-bezier(0.16, 1, 0.3, 1)
```
This is the "weighted deceleration" curve — fast start, very long tail. Used by Stripe, Linear, Vercel. Apply it to EVERYTHING: hover, snap, entrance, crossfade, underlines, view transitions.

Duration tiers (like Tayte.co's system):
- `--duration-fast: 200ms` — hover states, cursor follow, opacity toggles
- `--duration-base: 500ms` — underlines, info crossfade, view toggle
- `--duration-slow: 800ms` — carousel snap, entrance stagger, page transitions
- `--duration-heavy: 1200ms` — FLIP transitions, major state changes

---

## Pattern 2: Typography as the Only Hierarchy

None of these sites use size to create hierarchy. They all use **opacity + weight + case**.

| Site | Body Size | Label Size | Hierarchy Method |
|------|-----------|------------|-----------------|
| Cathy Dolle | 11px | 11px | opacity + uppercase + font-medium |
| Chris Shu | 16px | 16px | paragraph breaks only |
| Tayte.co | 11px (0.6875rem) | 11px | color (#1A1A19 vs #ABABA8) |
| Jin Su Park | ~14px | ~10px | numbering + color |

**What HKJ currently does:** Mixed — some elements use display serif at clamp(28px, 4vw, 56px), while labels are 10-11px mono. The info panel uses a large serif title next to tiny mono metadata. This creates two visual languages on one page.

**Recommendation:** For VISUAL_DENSITY: 4 (Art Gallery mode) — use ONE size for the homepage. Everything 11px Fragment Mono, uppercase. Hierarchy via:
- Active/current: `var(--fg)` (full opacity)
- Secondary: `var(--fg-3)` (35% opacity)
- Ghost: `var(--fg-4)` (15% opacity)

The display serif (DM Serif Display) should be reserved ONLY for project detail pages and the About page — never on the homepage carousel/list.

---

## Pattern 3: The Slider/Carousel Physics

**Cathy Dolle's slider (from screenshots):**
- Images are **vertically stacked in the center** of the viewport
- Each image is roughly 50-60% viewport width
- Images are tightly packed — touching or overlapping slightly
- Scroll advances through them smoothly
- Current image is full opacity, adjacent ones visible but not current
- The list items on both sides serve as navigation + context

**Corentin Bernadou:**
- Infinite horizontal carousel with wrapped loop
- Text-heavy items (project names only, no images in the list)

**iamrobin:**
- `scroll-snap-type` with `scroll-behavior: smooth`
- `cursor: grab` / `grabbing`
- Spring easing `cubic-bezier(.34, 1.56, .64, 1)` — overshoots then settles

**Tayte.co:**
- Lenis smooth scroll
- Sticky cards that layer on top of each other
- Cards fade in from `opacity: 0; filter: blur(2px)`

**What creates "weight" in scroll:**
1. **Friction** — velocity decays over time, not instantly
2. **Overshoot on snap** — spring easing that goes past target, then settles back
3. **Blur during motion** — items slightly blur while moving fast, sharpen when still
4. **Slow deceleration tail** — the last 20% of the animation takes 50% of the time

**Recommendation for HKJ carousel:**
- Use `cubic-bezier(.34, 1.56, .64, 1)` for snap (iamrobin's spring — overshoots then settles)
- Add `filter: blur(0.5px)` during velocity > threshold, remove when still
- Friction at 0.94 (slightly less than current 0.92 for longer coast)
- Snap duration 1.0s (slow, heavy settle)

---

## Pattern 4: Color — Monochrome Is Non-Negotiable

| Site | Background | Text | Accent |
|------|-----------|------|--------|
| Cathy Dolle | #000000 | #FFFFFF | none |
| Chris Shu | #000000 | #e8e8e8 | none |
| Tayte.co | #FFFFFF | #1A1A19 | #007AFF (clock seconds) |
| TLB | #FFFFFF | #000000 | #fac9c7 (subtle rose) |
| iamrobin | var(--bg-color) | var(--text-color) | sticker colors |

**HKJ current:** `#faf9f6` bg, `#1a1917` fg — warm monochrome. Zero accent. This is correct. Don't add any.

**Taste skill Rule 2 confirms:** Max 1 accent, saturation < 80%. HKJ has zero — even better.

---

## Pattern 5: Hover Is Breath, Not Event

| Site | Hover Behavior | Duration |
|------|---------------|----------|
| Cathy Dolle | Opacity change on non-hovered items (dimming) | 200ms |
| Chris Shu | Opacity to 0.6 | 200ms |
| Tayte.co | Opacity to 0.5 | 150ms |
| Will Phan | translate(-8px, -6px) + shadow + blur(3px) | 1000ms |
| iamrobin | background-color transition + scale | ~300ms |

**The pattern:** Most sites use ONLY opacity for hover. No scale, no translate, no shadow. The exceptions (Will Phan) use very long durations (1s) to make the movement feel deliberate, not snappy.

**Recommendation for HKJ:**
- **Carousel hover:** Remove `scale(1.03) translateY(-2px)`. Replace with opacity-only: hovered item stays at full opacity, all others dim to `0.7`. Duration: `500ms cubic-bezier(0.16, 1, 0.3, 1)`.
- **List hover:** Keep current opacity dimming (already correct). Make image preview follow with more lag (lerp 0.06 instead of 0.08).

---

## Pattern 6: Entrance — Still, Then Breath

| Site | Entrance Pattern | Total Duration |
|------|-----------------|----------------|
| Cathy Dolle | Items start `opacity: 0`, stagger in | ~400ms |
| Tayte.co | Cards: `opacity: 0; blur(2px)` → visible | ~500ms |
| iamrobin | Hero: 1s ease-out fade, icons: .6s spring stagger | ~2s |
| Chris Shu | No animation — content is just there | 0ms |

**Taste skill (MOTION_INTENSITY: 6):** Use CSS transition cascades for load-ins. Focus on `transform` and `opacity`. No spring overshoots on entrance.

**Recommendation:**
- Items: `opacity: 0 → 1`, `blur(1px) → blur(0)`, stagger 0.08s each
- Duration: 600ms per item
- No `translateY` — horizontal elements shouldn't move vertically on entrance
- Nav/footer: 400ms fade, simultaneous with first items
- Total entrance: ~1s

---

## Pattern 7: The Scroll Progress Signal

| Site | Progress Indicator |
|------|-------------------|
| Cathy Dolle | `0%` bottom-left (scroll position as percentage) |
| Corentin Bernadou | `0%` counter |
| HKJ current | `01/06` counter + progress bar |

**Recommendation:** Keep `01/06` counter (matches Cathy Dolle's numbering). The progress bar is good for carousel context. No percentage needed.

---

## Summary: What to Change in HKJ

### Immediate (Taste Skill Violations)
1. **Unify easing** — ONE curve everywhere: `cubic-bezier(0.16, 1, 0.3, 1)`
2. **Unify durations** — 4 tiers: 200ms / 500ms / 800ms / 1200ms
3. **Remove carousel hover scale/translate** — opacity only
4. **Remove display serif from homepage** — mono only, hierarchy via opacity

### Carousel Physics
5. **Spring snap easing** — `cubic-bezier(.34, 1.56, .64, 1)` for settle with overshoot
6. **Friction 0.94** — longer coast
7. **Motion blur** — `filter: blur(0.5px)` while velocity > 2, clear when still
8. **Snap duration 1.0s** — heavy

### Entrance
9. **Add blur dissolve** — `blur(1px) → 0` alongside opacity
10. **Remove translateY** from entrance — let items appear in place
11. **Stagger 0.08s** — slightly slower

### ListView
12. **Lerp 0.06** — heavier image follow
13. **Hover dim to 0.25** — more contrast between active and inactive (Cathy Dolle dims hard)
