# Homepage Redesign: "The Late Session"

## Concept

The site is a warm, dim creative space — a late-night studio session. The music influence lives in the pacing and warmth, not the UI, except for two deliberate references: a spinning vinyl with a pixelated cat in the hero, and a "now playing" widget in the nav. Everything else is atmospheric.

## Hero: The Vinyl

A CSS/canvas-rendered vinyl record centered in the hero area. Album art in the center label (current "now playing" album). A pixelated cat sprite (~32x32px) sits on the record, spinning with it.

### Interaction

- **Default state:** Vinyl spins slowly (~1 revolution per 8s). Cat rides along, rotating.
- **Cursor grab:** Click and drag on the vinyl to spin manually. Follows drag with momentum. Release → decays back to natural slow spin. Cat stays on.
- **Cursor proximity:** When cursor approaches the record, cat's eyes/head track toward it (curious cat watching movement).
- **Atmosphere link:** Faster spin = WallLight shader brightens slightly (room energy rising). Slow/stopped = dim, intimate.

### Visual

- Vinyl: visible grooves (concentric circles, slight opacity variation). Grooves catch WallLight ambient light.
- Size: `clamp(200px, 30vw, 360px)`
- Center label: album art of current "now playing" song, circular crop
- Cat: pixel-art sprite, 2-3 frame idle animation (tail swish or ear twitch). Deliberately pixelated, charming. Sits off-center on the record.
- At night: warm amber reflections on grooves. Day: soft natural light on black vinyl.

### Component

`src/components/Vinyl.tsx` — `"use client"`. Canvas-based rendering for the vinyl + cat sprite. Uses refs for spin state, mouse tracking, momentum physics. Communicates spin speed to WallLight via Zustand store (new field: `vinylSpeed: number`).

### Philosophy Text

Beside or below the vinyl:

```
the quiet details are the loudest ones.
```

Newsreader italic, `clamp(22px, 3vw, 32px)`. Below: `NEW YORK · OPEN TO WORK` in Fragment Mono `--text-meta`.

## Nav: Now Playing Widget

A tiny (~200px wide) "now playing" display in the nav bar, right side before nav links.

### Visual

- 24x24px album art (rounded 4px corners)
- Song title + artist in Fragment Mono, `--text-meta` size, single line, truncated with ellipsis
- 3-bar animated equalizer icon (CSS-only, tiny bars bouncing at different speeds)
- All at `--ink-muted` opacity

### Data

Stored in constants:

```ts
// src/constants/now-playing.ts
export const NOW_PLAYING = {
  title: "Nikes",
  artist: "Frank Ocean",
  album: "Blonde",
  art: "/images/now-playing.webp", // manually placed album art
};
```

Updated manually by editing the constant + swapping the image. No API integration.

### Component

`src/components/NowPlaying.tsx` — server component or simple client component. Reads from constant. The equalizer bars are CSS-only `@keyframes`.

## Work Section: "The Fader"

No "SELECTED WORK" label. Projects in a single vertical column, full width (900px max).

### Signature Hover Interaction

When hovering a project card:
- **Hovered card:** `scale(1.01)`, warm glow `box-shadow: 0 12px 40px rgba(180, 140, 80, 0.08)` (amber at night: `rgba(200, 160, 80, 0.12)`)
- **All OTHER cards:** `opacity: 0.4`, `filter: blur(1px)`, `transition: 0.4s ease-out`
- **On mouse leave:** everything returns to `opacity: 1`, `filter: none`, `transition: 0.3s ease-out`

This creates focus and drama — like turning up one fader in a mix. Everything else drops back.

### Implementation

The parent grid container gets an `onMouseEnter`/`onMouseLeave` per card that sets a `hoveredId` state. All cards read this state and apply dimming styles if `hoveredId !== null && hoveredId !== thisId`.

## Now Section

Below projects. Fragment Mono label "NOW". 2-3 sentences in body text.

```ts
// src/constants/now.ts
export const NOW_TEXT = "finishing conductor. reading 'the timeless way of building' by christopher alexander. making pour-overs that take too long.";
```

Updated monthly by editing the constant.

## Exploration Teaser

Same structure as current. Links to `/exploration` (flat gallery, no detail routes).

## Footer

Email, socials, colophon. Unchanged.

## Files Created

- `src/components/Vinyl.tsx` — Interactive vinyl record + cat sprite
- `src/components/NowPlaying.tsx` — Nav "now playing" widget
- `src/constants/now-playing.ts` — Current song data
- `src/constants/now.ts` — "Now" section text

## Files Modified

- `src/app/page.tsx` — New hero (Vinyl + philosophy), fader hover on covers, Now section
- `src/components/GlobalNav.tsx` — Add NowPlaying widget
- `src/components/Cover.tsx` — Accept `dimmed` prop for fader effect
- `src/lib/store.ts` — Add `vinylSpeed` field for atmosphere link

## Files Deleted

- `src/components/BuildingOverlay.tsx` — if not already deleted

## Success Criteria

1. The vinyl + cat is the screenshot moment — someone sees it and wants to share the link
2. Spinning the vinyl feels physical — momentum, drag, natural decay
3. The cat is charming without being childish — pixel art, small, subtle idle animation
4. Fader hover creates genuine focus — you notice only the hovered project
5. Now Playing widget feels personal — "this person has taste in music"
6. The philosophy statement is a BELIEF, not a description
7. Time-of-day system continues working — vinyl grooves reflect ambient light
