# RYKJUN Portfolio — Project Framework

> The governing document. Replaces all previous versions.
> March 27, 2026.

---

## The site in one sentence

A single-viewport grid of everything you've shipped, with your name in the corner.

---

## 1. Concept

The homepage is a gallery wall. Every cover is visible at once — no scrolling, no sections, no hierarchy between projects and experiments. They all live in one stream. Your name sits small at the top. Navigation is minimal. The grid fills the viewport.

Click any cover. It FLIP-transitions into a full detail page — the cover physically travels from its grid position into the hero of the detail page. Back returns it to where it was. The homepage is always one click away, always in the same state you left it.

This is the entire homepage. There is no bio section, no "now" section, no experiment teaser, no footer content on the homepage. Those live on separate pages accessed through navigation. The homepage does one thing: show your work and let people enter it.

---

## 2. The story the site tells

**Distance → Curiosity → Immersion → Return.**

**Distance (the grid).** The visitor sees everything at once. Covers are small, colorful, abstract. Minimal text. No descriptions visible.

**Curiosity (the hover).** A cover lifts toward them. A shadow forms beneath it. Neighboring covers dim slightly.

**Immersion (the detail page).** They click. The cover expands to fill their viewport. The color field is now the full environment.

**Return (back to the grid).** The detail page contracts back into the cover. They pick up another.

---

## 3. Homepage

### Layout

The grid fills `100vh` minus the nav height. Covers are square. Columns adapt to item count and viewport width. Every cover visible without scrolling.

### Grid behavior

| Item count | Desktop | Tablet | Mobile |
|---|---|---|---|
| 4–6 | 3 cols | 2 cols | 2 cols |
| 7–12 | 4 cols | 3 cols | 2 cols |
| 13–20 | 5 cols | 4 cols | 3 cols |
| 20+ | 6 cols | 4 cols | 3 cols (scrollable) |

Gap: 8–12px. Covers size to fill available space.

### Nav

```
HKJ                                      Work  Lab  About
```

"HKJ" links home. "Work" and "Lab" filter the grid. "About" navigates to the about page.

### Homepage load

No entrance animation. The grid is present when the page loads. Stillness is the statement.

---

## 4. Pages

```
/                       The grid (all pieces)
/work                   Filtered: projects only
/lab                    Filtered: experiments only
/work/[slug]            Project detail
/lab/[slug]             Experiment detail
/about                  Bio, philosophy, contact
```

---

## 5. The cover system

- Square, border-radius 6px
- Unique background color
- Title: display serif, bottom area
- Track number: mono, small, top-left, faint
- Grain texture: SVG noise, 20–30% opacity
- No pure black or white. Every color has warmth.
- Adjacent covers contrast.

---

## 6. Interaction design

### Cover hover

```
TranslateY: -3px    Scale: 1.03    Duration: 350ms
Shadow: 0 8px 24px rgba(35,32,28, 0.08)
Easing enter: cubic-bezier(0.16, 1, 0.3, 1)
Sibling dimming: opacity 0.85, 300ms
```

### Cover press

```
Scale: 0.97    Duration: 80ms
```

### FLIP: grid → detail (~800ms total)

Phase 1 (0–200ms): Non-clicked covers fade out, rippling from clicked.
Phase 2 (100–700ms): Clicked cover FLIP-expands. power3.out.
Phase 3 (500–900ms): Detail content fades in, stagger 40ms.

### FLIP: detail → grid (~600ms total)

Phase 1 (0–200ms): Content fades out.
Phase 2 (100–600ms): Hero contracts to cover position.
Phase 3 (400–700ms): Covers fade back in.

### Reduced motion

FLIP → 150ms crossfade. Hovers → instant opacity. Reveals → disabled.

---

## 7. Typography

| Role | Usage | Criteria |
|---|---|---|
| Display | Cover titles, headings | Serif with character |
| Body | Descriptions, nav | Humanist sans |
| System | Numbers, metadata, "HKJ" | Geometric mono |

---

## 8. Color

```css
--paper: #f7f6f3;
--ink-primary: rgba(35, 32, 28, 0.82);
--ink-secondary: rgba(35, 32, 28, 0.52);
--ink-muted: rgba(35, 32, 28, 0.35);
--ink-faint: rgba(35, 32, 28, 0.2);
--ink-ghost: rgba(35, 32, 28, 0.1);
--ink-whisper: rgba(35, 32, 28, 0.05);
```

---

## 9. Principles

1. **The homepage is the work.**
2. **Everything ships into one stream.**
3. **The transition is the craft.**
4. **Distance → Curiosity → Immersion → Return.**
5. **Warmth is the default. Code is the discovery.**
6. **If removing it doesn't make the site worse, remove it.**
7. **The site should feel like someone made it on purpose.**
8. **Don't chase the award. Build something the award chases.**
