# Cloud Gazing — Portfolio Concept (Design)

**Date:** 2026-05-14
**Status:** Discovery concept, isolated on `/v/cloud-gazing`. Does not replace or block the locked dark-tracklist register on master.
**Author:** Ryan / Hyeon Jun (with Claude)

---

## 1. Concept

A full-bleed sky portfolio. The viewer is flat on their back, looking straight up. Clouds drift overhead in semi-realistic WuWa-grade rendering. Most clouds are nostalgic childhood pareidolia — sheep, cat, dog, dragon, whale, bunny, turtle, pointing-hand. Among them drift a few **out-of-place silhouettes** that don't belong in a children's sky — *those are the projects*. The viewer catches them by their wrongness: a phone-shaped cloud, a chair-shaped cloud, a building-shaped cloud.

Hover reveals a glass tag with the cloud's name (`sheep` / project title). Click on a project cloud rises a glass project panel up from the bottom; the sky never leaves. The page reads as cloud-gazing first, portfolio second.

The mechanic also tacitly demonstrates contemporary spatial / AR UI fluency — glass HUD overlays, parallaxed depth, atmospheric panels — the same vocabulary as visionOS, modern game HUDs, and the existing site chrome.

---

## 2. Anchor decisions (locked)

| Decision | Choice |
|---|---|
| Anchor metaphor | Pareidolia — work emerges from cloud shapes |
| Shape literalness | Literal-recognizable silhouettes |
| Shape mapping | Out-of-place = the projects; familiar animals = ambient population |
| Aesthetic register | Semi-realistic game-sky (WuWa target); cute Nintendo as graceful fallback |
| POV / framing | Flat on back, full-bleed sky, no horizon |
| Interaction model | Pointer-as-gaze (cursor drives parallax + hover-tag reveal) |
| Open mechanic | Glass HUD project panel rises over still-drifting sky |
| Render technique | Two-tier: shader-based ambient cumulus field + painted hero sprites with feathered bottoms that dissolve into the field (matches WuWa whale reference) |
| Route / isolation | `app/v/cloud-gazing/page.tsx` on master, fully isolated from existing routes |

Auto-mode picks on previously-deferred items (override anytime in implementation):
- **Animal roster, v0:** sheep, dog, cat, dragon, whale, bunny, turtle, pointing-hand (8 painted hero sprites).
- **Project silhouettes:** one man-made silhouette per portfolio piece. Workflow: black-and-white SVG of the top profile → used as the top-edge mask while painting the cloud sprite in Procreate / Photoshop. Final asset is a transparent PNG/WebP sprite with painted internal shading.

---

## 3. Sky composition

**Population (8–12 clouds visible at any time):**
- 5–7 comfort clouds drawn from the animal roster
- 3–5 anomaly clouds — the projects, each cast as a man-made silhouette
- 1–2 atmospheric cirrus streaks (no shape, pure mood)

**Drift behavior:**
- Direction: E→W primary drift, parallax-rotated per layer
- Cycle: each cloud takes ~45–90s to cross fully
- Spawning: new clouds enter from off-screen on staggered intervals, never staged
- Mix: roster is shuffled so repeats are spaced; project clouds always present at least one on screen

**Mood / palette (default — matches WuWa reference screenshot):**
- Clean cobalt-to-cerulean blue sky gradient, brighter near the implied off-screen sun (upper-left)
- Bright white cloud tops, soft blue-shadowed undersides, painted internal shading
- Subtle warm haze near the horizon edge of the sky dome
- Bright but not blown-out — mid-day clarity, not golden hour
- Very-slow mood clock (10+ minute cycle) optionally drifts toward warmer dusk-amber. Never night.

---

## 4. Interaction & open mechanic

**Pointer = gaze.**
- Mouse position drives subtle parallax across all sky layers (far ~0.2×, near ~1.2×).
- Smoothing: lerp ~0.08 — dreamy, not snappy. Feels like a head following a thought, not a 1:1 follow.

**Hover.**
- Cursor near a cloud (hit-test against SDF bounds with a generous radius) → glass tag fades in beside the cloud.
- Tag content: animals say `sheep / dragon / whale`. Projects say their actual title.
- Tag uses existing chrome-text utility and the established glass HUD material values.

**Click.**
- Animal cloud → micro-delight only (subtle bob, tag pulse). No navigation.
- Project cloud → glass panel slides up from the bottom, occupying ~60–70% of viewport height. Sky remains visible and animated above the panel.
- URL updates to `/v/cloud-gazing#<project-slug>` for shareability.
- Close: Esc, close button, or click on visible sky → panel drops back down. URL hash clears.

**Panel content reuse:**
- Reuses the existing project-page content components where possible. Glass panel is a new container that wraps existing case-study content blocks at a different aspect.

---

## 5. Render architecture

**The visual target (locked from WuWa reference screenshot):** pareidolia shapes are not free-standing objects. They are *silhouettes embedded into larger painted cumulus masses*. The body of each hero cloud reads as naturalistic cumulus; the top edge is sculpted to form the recognizable shape (whale's back, dragon's spine, project's outline); the bottom dissolves into ambient cloud bulk. Plus the occasional discrete designed cloud (e.g. a spiraling vortex) for variety.

This gives us a two-tier system instead of one.

### 5.1 Two tiers

**Tier 1 — Ambient cumulus field (base sky).**
- Shader-based FBM cumulus across the whole sky
- Soft puffy noise with internal volume shading (light from upper-left, blue-shadowed underbelly)
- Slow drift, slow morph
- No specific shapes — this is the *bed* the pareidolia clouds sit on

**Tier 2 — Hero pareidolia clouds (painted sprites).**
- Each hero shape is a hand-painted (or AI-generated + refined) PNG/WebP sprite with painted internal shading already baked in
- The sprite is **shaped at its top edge** to form the recognizable silhouette (whale's back, etc.)
- The sprite's **bottom edge is feathered/dissolved** so it integrates into the Tier 1 cumulus field rather than floating discretely
- Optional shader pass on the sprite: subtle UV displacement via FBM noise → "breathing" edges over time, without losing the painted shading inside

**Plus: occasional discrete designed clouds** (Tier 2b)
- 1–2 fully designed clouds with distinctive silhouettes that *do* float discretely (the WuWa-vortex equivalent)
- For our concept: this is where the most ambitious project shapes can live — a fully painted phone-cloud or building-cloud that exists as its own object

### 5.2 Layer stack (R3F passes, far → near)

1. **Sky-dome gradient** — single shader, drives day/warmth via a slow "mood clock" uniform.
2. **Cirrus high layer** — 1–2 wispy sprite quads with painted shading, slow drift, near-zero parallax.
3. **Tier 1 ambient cumulus** — fragment shader, FBM noise + internal shading, full-screen quad. Medium drift.
4. **Tier 2 hero clouds** — painted sprites with feathered bottoms, composited over the cumulus field with soft blend. Medium-near parallax.
5. **Tier 2b discrete designed clouds** (optional, 0–2 on screen) — same sprite technique, sharper edges all around, near parallax.
6. **Atmospheric tint + bloom post-pass** — final color grading.

### 5.3 Why this is the right technique

- **Matches the WuWa reference exactly** — that's the look.
- **Art-driven, not shader-driven** — the hard work is painting good cloud sprites, not writing a heroic shader. Painting is iterable; shaders are not.
- **Cheap GPU** — sprite composites are nearly free on modern hardware. We're not raymarching, we're not running heavy FBM per shape.
- **Graceful degradation built in** — the fallback path (cute Nintendo) is *the same architecture* with chunkier painted sprites. The cumulus base can be simplified to a single gradient.

### 5.4 Art asset pipeline

For each pareidolia shape (animals + projects):
1. Black silhouette SVG of the shape's top profile (whale's back, dragon's spine, phone outline, etc.)
2. Paint the cloud body in Procreate / Photoshop using the silhouette as the top mask; bottom feathers out into transparency
3. Internal shading painted by hand: bright tops, soft blue undersides, subtle volumetric falloff
4. Export as transparent PNG/WebP at ~1024px wide
5. (Optional AI assist) — silhouette + Procreate cumulus brush + AI inpainting can speed this up significantly

Roster v0: 8 animals + N project shapes. Estimated ~30 min per painted cloud once the workflow is set.

### 5.5 Animation clocks (shader uniforms only, never React state)

- `uTime.drift` — fast (seconds): cloud translation across the sky (both tiers)
- `uTime.morph` — slow (minutes): noise input shifts for Tier 1 base + sprite edge breathing for Tier 2
- `uTime.mood` — very slow (10+ minutes): sky color grade

---

## 6. Performance plan

**Budget targets:**
- 60 fps on M1+ MacBook integrated GPU
- 60 fps on 2021+ Windows mid-spec laptops
- 30–45 fps on 2020+ mid-tier mobile

**Guardrails:**
- DPR capped at 1.5 on retina screens
- Max 5 layered shader passes
- Max 3 FBM octaves in the Tier 1 cumulus shader
- All hero sprites packed into a single texture atlas → 1 texture bind for all hero clouds in a pass
- Pointer + time updates via Three.js uniforms only — never React state
- `useFrame` lerps pointer toward target each frame
- RAF paused when `document.hidden`
- Cloud population capped at 12 simultaneous shapes

**Graceful degradation triggers (any of):**
- `window.matchMedia('(prefers-reduced-motion: reduce)').matches`
- `navigator.hardwareConcurrency <= 4`
- coarse pointer detected (`window.matchMedia('(pointer: coarse)').matches`) — mobile / touch
- runtime fps probe drops below 30fps sustained for 3s after first paint

**Fallback behavior:**
- Disable edge-breathing displacement on hero sprites (static silhouettes)
- Reduce Tier 1 cumulus shader to 1 FBM octave or replace with a static painted backdrop
- Drop bloom post-pass; rely on baked highlights in the sprites
- Same scene graph, same architecture, simpler materials

---

## 7. Route, isolation, and codebase impact

**New files:**
- `src/app/v/cloud-gazing/page.tsx` — the route
- `src/app/v/cloud-gazing/layout.tsx` — own layout if needed, isolated from main site chrome
- `src/components/cloud-gazing/` — all new components live here
  - `Sky.tsx` — the Canvas root and scene orchestration
  - `SkyDome.tsx` — gradient backdrop with mood clock
  - `CumulusField.tsx` — Tier 1 shader-based ambient cumulus full-screen pass
  - `Cirrus.tsx` — high cirrus sprites
  - `HeroCloudLayer.tsx` — Tier 2 painted sprite clouds, composited over field
  - `HeroCloud.tsx` — single painted-sprite cloud with hit-testing
  - `DesignedCloud.tsx` — Tier 2b discrete designed cloud (vortex / sharp project shape)
  - `PostFX.tsx` — bloom + tint pass
  - `GazeTag.tsx` — glass hover tag
  - `ProjectPanel.tsx` — rising glass project panel
  - `useCloudPopulation.ts` — spawn / cycle logic
  - `usePointerUniform.ts` — pointer → ref → uniform pipe
  - `shaders/cumulus.frag.glsl` — Tier 1 FBM cumulus shader
  - `shaders/sky.frag.glsl` — gradient + mood
  - `shaders/heroCloud.frag.glsl` — sprite sampler + edge-breathing displacement
  - `shaders/postfx.frag.glsl` — bloom + tint
  - `assets/cloudManifest.ts` — registry of painted cloud sprites + metadata
- `public/cloud-gazing/sprites/animals/` — painted PNG/WebP sprites: sheep, dog, cat, dragon, whale, bunny, turtle, hand
- `public/cloud-gazing/sprites/projects/` — painted PNG/WebP sprites, one per project
- `public/cloud-gazing/sprites/cirrus/` — high cirrus wisps
- `public/cloud-gazing/sprites/designed/` — discrete designed clouds (vortex, etc.)

**Reuses (no edits):**
- Existing glass HUD vocabulary and chrome-text utility
- Existing easing / motion tokens
- Existing project content blocks (rendered inside `ProjectPanel`)

**Zero impact on existing routes.** Master stays shippable throughout development.

---

## 8. Component boundaries

Each component has one clear purpose, communicates through props, and is independently testable:

- **`Sky`** — composes the Canvas, owns the RAF, owns the shared uniforms (`uTime`, `uPointer`). Knows nothing about projects.
- **`SkyDome`** — gradient backdrop, owns the mood clock.
- **`CumulusField`** — Tier 1 ambient cumulus shader pass. Pure visual layer.
- **`HeroCloudLayer`** — given a list of `HeroCloud` descriptors, renders them at a given depth. Knows nothing about hit-testing or panels.
- **`HeroCloud`** — given a sprite id + drift descriptor + parallax depth, renders one painted-sprite cloud and reports hover state up.
- **`DesignedCloud`** — Tier 2b discrete designed cloud (sharper-edged sprite). Same interface as `HeroCloud`.
- **`useCloudPopulation`** — pure logic that produces the current population of clouds (animals + projects). Easily unit-testable.
- **`usePointerUniform`** — pointer → smoothed ref → uniform. Pure, isolated.
- **`GazeTag`** — given an anchor position and a label, renders the glass hover tag. Knows nothing about cloud internals.
- **`ProjectPanel`** — given a project slug, renders the case content. Knows nothing about clouds.

**Hash routing:** `ProjectPanel` is controlled by URL hash. On mount, if `window.location.hash` matches a project slug, the panel pops open. `popstate` listener handles back/forward navigation. This means `/v/cloud-gazing#<project-slug>` deep-links cleanly on direct load.

This boundary means: the sky can be developed and tuned without ever touching project panel logic, and vice versa. Either piece can be replaced independently.

---

## 9. Phasing (intent, not a plan)

1. **Sky-only spike** — sky dome + Tier 1 cumulus + one painted hero cloud (whale, per the WuWa reference) + pointer parallax. Validate the look and the performance floor against the reference screenshot.
2. **Population & roster** — full animal sprite atlas (8 hero clouds), spawning/cycling, drift mix.
3. **Hover & tags** — hit-testing on sprite alpha bounds with generous radius, glass tag reveal.
4. **Project panel** — anomaly clouds, click → panel rise, hash routing including deep-link on mount.
5. **Mood & polish** — mood clock, bloom tuning, cirrus, atmospheric tint, occasional Tier 2b designed cloud.
6. **Fallback path** — reduced-motion / mobile sprite fallback with the guardrail triggers from §6.

Each phase ships a working `/v/cloud-gazing` page. We can stop after any phase and still have a usable experience.

---

## 10. Open questions for implementation

- Exact project silhouettes — defined per project during phase 4
- Whether the project panel reuses existing case-study route content directly via portal or duplicates the components
- Whether to add a faint ambient sound layer (wind, distant birds) — out of scope for v0, flagged for v1
- Whether the mood clock is real-time-of-day responsive (dawn shows at actual dawn, etc.) — interesting, out of scope for v0
