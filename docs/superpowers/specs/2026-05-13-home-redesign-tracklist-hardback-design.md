# Home redesign — Tracklist Hardback

**Date:** 2026-05-13
**Status:** SUPERSEDED on 2026-05-13 by [2026-05-13-agency-portfolio-redesign-design.md](2026-05-13-agency-portfolio-redesign-design.md). User said "tracklist dead for now" — direction shifted to an agency-portfolio register. This document is preserved in case the Tracklist Hardback returns; do not implement from it without re-approval.
**Author:** Ryan Jun (with Claude)
**Scope:** Refine the home page (`/`) of the personal portfolio. No changes to sub-pages or sub-page architecture.

---

## Context

The portfolio direction has been locked since 2026-05-12 as **dark tracklist register + multidisciplinary BTS/Fred Again positioning**. Six earlier homepage directions were rejected over a two-week period; the user explicitly committed to the lock. This redesign refines the *execution* of that lock, not a new aesthetic.

The recent brief evolution: the user has asked to move from BTS and Fred Again as **atmospheric inspiration** to **direct visual references** (specific compositions, motifs, materials), and to lift execution to **Codrops-tier** — the level of motion and interaction polish that wins on awwwards.com / codrops.com today.

### Current state of `/`

- Single-viewport hero (`height: 100dvh; overflow: hidden`).
- 3-column body: left = setlist of 7 pieces flat (no category split), center = active piece's media plate or "In development" placeholder, right = intro lede + contact + now-playing + active piece meta.
- Top row: wordmark left, nav cluster right.
- Bottom: copyright strip, folio elsewhere.
- The catalog now contains 5 case-study pieces (LA28 wip + 4 concept) and 2 personal pieces (Sift, Gyeol). All 7 render flat as setlist rows. 4 of the 5 case studies are concepts with no media — they fall back to a generic "In development" placeholder in the center plate.

### Problems with the current state

1. **No visible case-study / personal hierarchy.** Sift and Gyeol read as siblings to the concept work, which buries the positioning anchor.
2. **Concept pieces show broken plates.** The "In development" fallback is honest but feels like a defect — visual debt on 4 of 7 rows.
3. **Motion is functional, not signature.** Cursor wake and theme toggle exist, but the page does not yet quote BTS/Fred Again at the *visual* level the brief now asks for.

---

## Goals

1. **Visible hierarchy.** Case-study pieces (§01–§05) read as the primary line; personal pieces (Sift, Gyeol) read as a quieter B-side — both in one viewport.
2. **Concept plate language.** Replace the "In development" fallback with a typographic plate. Type IS the plate. No fake imagery. Matches the dark-tracklist register and quotes Fred Again's USB001 back-cover grammar directly.
3. **Codrops-tier motion in the viewport.** Five named moves: View Transition slice on plate swap, per-letter title reveal, radial theme-toggle wipe, tonearm row hover, preserved cursor wake.
4. **No scroll on `/` desktop.** Single-viewport rule is hard-locked.
5. **Both themes work.** Light is the default; dark is the alternative; everything must work in both.
6. **Honor `prefers-reduced-motion`.** All motion has a static fallback.

## Non-goals

- New aesthetic exploration. The lock is the lock; this redesign refines execution, not direction.
- Sub-page redesigns. `/about`, `/contact`, `/notes`, `/work`, `/work/[slug]` stay as they are.
- Real mock-up assets for the 4 concept pieces (e.g., hand-designed brand posters per concept). Future work — see "Out of scope" below.
- Scroll-driven motion on `/`. Single-viewport stays.
- New runtime dependencies. View Transitions is native; WebGL2 (used for the airflow cursor) is native. No GSAP, no Framer Motion, no Three.js, no fluid-sim library for this pass.
- No multi-frame physics tuning UI or runtime sim parameter controls on the airflow cursor — constants (dissipation, viscosity, gust radius, color) are baked into the shader and the consumer cannot adjust them at runtime.
- No mobile/touch airflow effect. Touch-primary devices intentionally get the OS cursor, no canvas, no replacement.

---

## Design

### 1. Composition

3-column body stays. The visible change is **SIDE A / SIDE B** in the left column.

```
┌──────────────────────────────────────────────────────────────────────┐
│ RYAN JUN®                       Work, About, Contact · NYC 14:32 · ◐ │
│ ─────────────────────────────────────────────────────────────────── │
│                                                                      │
│  SIDE A                                                              │
│  §01  LA28                          02:30 · wip   ●                  │
│  §02  AI Hardware Brand             02:14 · concept                  │
│  §03  Spatial Audio Brand           02:48 · concept                  │
│  §04  Album Cover System            03:32 · concept                  │
│  §05  Concept Car Brand             04:06 · concept                  │
│                                                                      │
│         [ CENTER PLATE — type or media for active row ]              │
│                                                                      │
│  ─── SIDE B ─────────────────────                                    │
│  §06  Sift                          06:42 · shipped                  │
│  §07  Gyeol: 결                      08:24 · shipped                  │
│                                                                      │
│  Right column unchanged: intro lede · contact · now-playing · meta   │
│ ─────────────────────────────────────────────────────────────────── │
│ © 2026 Ryan Jun                                              [folio] │
└──────────────────────────────────────────────────────────────────────┘
```

**ASCII above is schematic only.** Vertical stacking of SIDE A → plate → SIDE B in the diagram represents which column they live in (the left/setlist column), not their actual position. The center plate stays in the center column — `grid-template-columns: 0.8fr 4fr 1fr` is unchanged from current.

**Specifics:**

- **SIDE A label** sits above the case-study tracklist in the left column. Class: `t-eyebrow`. Copy: **"SIDE A"** (committed; not deferred).
- **SIDE B label** sits above the personal tracklist in the left column, preceded by a hairline rule (`t-rule`). Copy: **"SIDE B"** (committed).
- **Personal rows render dimmer** — title color drops from `--ink` (active) / `--ink-2` (default) to `--ink-3`. Row meta drops to `--ink-4`. Indent: `clamp(8px, 1vw, 16px)` from the case-study row's left edge.
- **Row gap tightens** from current ~12px to ~6-8px to fit 7 rows + 2 labels in the same vertical space. The right column stays at its current width; only the left column changes.
- **Center plate is shared between SIDE A and SIDE B**. Personal pieces (Sift, Gyeol) have real covers — the plate renders their image as it does today.

**Vertical fit (reference: 1366×768 laptop, smallest supported desktop):**

Available viewport: 768px. Subtract top row (48px) + bottom row (40px) + container padding (top 24, bottom 24) = ~632px for the body.

Left column allocation: SIDE A eyebrow (14px line) + 5 case-study rows × 28px (line-height 1.15 at type-row 13-15px, plus 6px gap) = 14 + 5×28 = 154px. Then hairline rule (12px gap) + SIDE B eyebrow (14px) + 2 personal rows × 28px = 12 + 14 + 56 = 82px. Total left column = 236px, comfortably inside 632px.

Center plate: fills the remaining ~400px of vertical space at aspect ratio 4/3 — frame width is the constraint, not height. Confirmed fit at 1366×768. At 1440×900 there's additional breathing room.

If the row+labels math fails on any common viewport during implementation, the fallback is to tighten the row line-height (currently 1.15) to 1.1, not to relax the single-viewport rule.

**Edge cases:**

- Mobile (≤640px): the 3-column grid collapses to a stack. SIDE A list, plate, SIDE B list, right column — all stack vertically. Single-viewport rule relaxes here (mobile naturally scrolls).
- If a piece is reclassified personal → case-study or vice versa, it just moves to the other list — no data shape change required (the `category` field on `Piece` already drives this).

### 2. Plate language — typographic plates

Today the center plate renders piece media if available, "In development" placeholder otherwise. Four of five case studies have no media, so the placeholder is the visible state most of the time.

**New behavior:** when `piece.cover === undefined`, render a **typographic plate** instead.

```
┌─────────────────────────────────────────┐
│                                         │
│  §02                              concept│
│                                         │
│   AI HARDWARE                           │
│   BRAND                                 │
│                                         │
│                                         │
│   Brand · Product · Identity            │
│                                         │
└─────────────────────────────────────────┘
```

**Composition:**

- **Top-left:** piece code (`§02`). Class: `t-code` + `tabular`.
- **Top-right:** status (`concept`, `wip`, `shipped`). Class: `t-meta`. When status is `wip`, color flips to `--accent` (amber) to match the existing live tag.
- **Middle (anchor):** piece title at display-monumental scale. `font-size: clamp(80px, 9vw, 160px)`, `font-weight: 500`, `letter-spacing: -0.04em` (track-tightest), `line-height: 0.95`, `text-transform: uppercase`, mono. Wraps onto multiple lines if needed; `overflow-wrap: anywhere` allows a single long word to break rather than overflow the frame.
- **Bottom-left:** sector lockup (`Brand · Product · Identity`). Class: `t-meta`. Renders empty string gracefully if `piece.sector` is undefined.

**Frame:** 1px hairline (`--ink-hair`) matches the existing image plate frame. Aspect ratio: `4 / 3` (constant for typographic plates — `coverAspect` is not relevant when there is no cover).

**Background:** `--paper` ground (whichever theme is active). No decorative texture. The type carries the plate.

**Light/dark behavior:** all colors use existing tokens (`--ink`, `--ink-3`, `--accent`), so light and dark themes render identically without per-theme overrides.

**ConceptPlate component contract:**

```ts
interface ConceptPlateProps {
  piece: Piece;          // requires: piece.title, piece.number, piece.status, piece.sector?
  className?: string;    // optional passthrough for parent layout slots
}
```

The title's per-letter spans (for M2) are emitted by ConceptPlate so the structure is unified — see Motion §M2 for the markup. The component is server-renderable; no `"use client"` required at this layer (the parent HomeView already opts in).

**Accessibility:**

- The title's parent element carries `aria-label={piece.title}` so screen readers announce the title as one word, not letter-by-letter. Each per-letter span carries `aria-hidden="true"`.
- The plate frame carries `role="img"` and an `aria-label` describing the piece (`${piece.title} — ${piece.sector}`).
- Keyboard focus path: rows in the setlist are anchors; focusing a row triggers the same active-slug change as hover (see Motion §M1 for trigger).

**Pieces affected:**

- §02 AI Hardware Brand — typographic plate
- §03 Spatial Audio Brand — typographic plate
- §04 Album Cover System — typographic plate
- §05 Concept Car Brand — typographic plate
- §01 LA28 — has video, keeps image plate
- §06 Sift, §07 Gyeol — have images, keep image plate

When a real asset later lands for any concept, dropping a `cover` field on the piece automatically swaps to the image plate. No code change needed.

### 3. Motion — Codrops-tier inside the single viewport

Five moves. Each ships independently; later moves don't block earlier ones.

**Activation model (applies to M1, M2, M4):**

Today the active piece swaps on row hover. Confirmed unchanged in this design — hover is the trigger. Keyboard `:focus-visible` on a row produces the same swap (existing behavior). No auto-rotation. Click navigates to `/work/[slug]` via the row's Link.

**M1. View Transition slice on plate swap.**

The center plate currently swaps via key-remount + cross-fade. New behavior: horizontal **slice wipe** when active piece changes.

- **Trigger:** State-driven swap, so the View Transition is initiated explicitly via `document.startViewTransition(() => setActiveSlug(next))` in the hover handler. Next.js's `experimental.viewTransition` config exposes the `<ViewTransition>` wrapper for route transitions (used by the existing wordmark morph); same-document state changes use `document.startViewTransition` directly. The flag in `next.config.ts` does not auto-wrap state updates.
- **Naming:** a single shared `view-transition-name: plate` on the plate frame (the `<div class="obys__plate-frame">` containing either the image or the ConceptPlate). Same-name VTs swap the old and new captures of the same element — exactly the slice-wipe behavior we want, no per-slug enumeration of CSS rules.
- **Keyframes:** in `globals.css`:

  ```css
  ::view-transition-old(plate) {
    animation: plate-out 380ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }
  ::view-transition-new(plate) {
    animation: plate-in 380ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }
  @keyframes plate-out {
    from { clip-path: inset(0 0 0 0); }
    to   { clip-path: inset(0 0 0 100%); }
  }
  @keyframes plate-in {
    from { clip-path: inset(0 100% 0 0); }
    to   { clip-path: inset(0 0 0 0); }
  }
  ```

  The outgoing plate's content collapses to the right edge; the incoming plate reveals from the left edge. They cross at the midpoint.

- **Re-entrancy:** if the user hovers multiple rows quickly, only the latest VT runs. The browser auto-skips queued transitions (well-defined behavior).
- **Reduced motion:** `@media (prefers-reduced-motion: reduce) { ::view-transition-old(plate), ::view-transition-new(plate) { animation: none; } }` — instant swap.
- **Browser support:**
  - **Chromium 111+ / Edge 111+:** full support.
  - **Safari 18.0+:** same-document View Transitions supported (released stable). The slice wipe works.
  - **Firefox (no VT support as of 2026):** the `document.startViewTransition` check inside HomeView gates the call. If unavailable, the state update happens directly — plate swaps **instantly**, no fade or wipe (intentional: degrading gracefully without simulating an animation that the API would have given us).

**M2. Per-letter title reveal on initial mount.**

The typographic plate's title performs a letter-stagger reveal **only on the first render of the page**. Subsequent plate swaps via M1 do not re-trigger M2 — those swaps are handled entirely by the VT slice wipe, and the new title appears at its final state inside the new VT capture. This avoids the M1/M2 collision the reviewer flagged.

- **Implementation:** ConceptPlate emits the title as one parent `<h2 aria-label={piece.title} className="concept-plate__title">` containing one `<span aria-hidden="true" style={{ "--i": index }}>` per character (whitespace preserved). The animation is **gated** by a `[data-initial-render]` attribute on `<html>` so it only runs during the first 1500ms after page mount:

  ```css
  /* Default state: title is fully visible, no animation. Subsequent
     ConceptPlate mounts/re-renders (after the gate is removed) render
     here — no flicker, no replay. */
  .concept-plate__title span {
    display: inline-block;
  }

  /* During the initial-render window, letters animate in. */
  :where([data-initial-render]) .concept-plate__title span {
    opacity: 0;
    transform: translateY(0.6em);
    animation: letter-rise 280ms cubic-bezier(0.2, 0.7, 0.2, 1) forwards;
    animation-delay: calc(var(--i) * 20ms);
  }
  @keyframes letter-rise {
    to { opacity: 1; transform: translateY(0); }
  }
  ```

  HomeView's mount effect adds `data-initial-render` to `<html>` immediately and removes it after 1500ms. By the time any subsequent plate swap (M1) fires, the gate is gone — M1 alone handles the swap, M2 is dormant. This is the explicit answer to the M1/M2 collision: M2 is **strictly first-paint only**, the CSS rule guarantees it.

- **Duration math:** each letter animates over 280ms; staggered 20ms per index; total = 280 + (n − 1) × 20 ms. "AI HARDWARE BRAND" (17 visible chars + spaces) = 280 + 19×20 = ~660ms total to last letter at full state. The 1500ms gate window comfortably covers the longest concept title.
- **Reduced motion:** the `:where([data-initial-render])` rule is wrapped in `@media (prefers-reduced-motion: no-preference) { ... }` so it never applies under reduce-motion. Under reduce, letters render at default (visible, no transform) from frame 0.

**M3. Radial theme-toggle wipe.**

Today the toggle flips `data-theme="dark"` on `<html>`. New behavior: clicking the toggle launches a **clip-path circle wipe** from the click position.

- **Mechanism (revised):** the data-theme flip happens **immediately at t=0**, so the new theme's tokens (paper, ink) are live as the wipe runs. The wipe is a **shrinking overlay painted with the OLD theme's paper color** — it shrinks to a single point at the click position over 600ms, revealing the new theme underneath.
- **Implementation:**

  In ThemeToggle's click handler:

  ```ts
  // Module-scope ref so re-entrancy can clear an in-flight wipe.
  let wipeTimer: ReturnType<typeof setTimeout> | null = null;

  function apply(next: Theme, e: MouseEvent) {
    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("rj-theme", next); } catch {}
      return;
    }

    // Re-entrancy: cancel any in-flight wipe. Toggling the attribute off
    // and back on across a tick forces the CSS animation to restart from
    // the new click position rather than continue with the prior origin.
    if (wipeTimer) {
      clearTimeout(wipeTimer);
      root.removeAttribute("data-theme-wiping");
      wipeTimer = null;
    }

    // Read the current --paper as a resolved color BEFORE flipping theme.
    const oldPaper = getComputedStyle(root).getPropertyValue("--paper").trim();
    root.style.setProperty("--wipe-paper-from", oldPaper);
    root.style.setProperty("--wipe-x", `${e.clientX}px`);
    root.style.setProperty("--wipe-y", `${e.clientY}px`);

    root.setAttribute("data-theme", next);
    try { localStorage.setItem("rj-theme", next); } catch {}

    // Force a reflow so the attribute removal above is committed before
    // we re-add it below — without this, the CSS animation does not
    // restart on a rapid second click.
    void root.offsetWidth;

    root.setAttribute("data-theme-wiping", "");
    wipeTimer = setTimeout(() => {
      root.removeAttribute("data-theme-wiping");
      root.style.removeProperty("--wipe-paper-from");
      root.style.removeProperty("--wipe-x");
      root.style.removeProperty("--wipe-y");
      wipeTimer = null;
    }, 600);
  }
  ```

  In `globals.css`:

  ```css
  html[data-theme-wiping]::before {
    content: "";
    position: fixed;
    inset: 0;
    background: var(--wipe-paper-from);
    clip-path: circle(150% at var(--wipe-x) var(--wipe-y));
    animation: theme-wipe 600ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
    z-index: 9000;             /* above PaperGrain (z 5) and Frame (z 50); below airflow cursor canvas (z 9999) and Preloader (z 10000) */
    pointer-events: none;       /* clicks pass through to the toggle */
  }
  @keyframes theme-wipe {
    to { clip-path: circle(0% at var(--wipe-x) var(--wipe-y)); }
  }
  ```

- **Risks addressed:**
  - **Z-index:** overlay at `9000` sits above page content, PaperGrain (z 5), and Frame (z 50); below the airflow cursor canvas (z 9999) and the Preloader (z 10000). Preloader runs only on first-visit, so no z-stack conflict in practice.
  - **Pointer-events:** `none` on the overlay — clicks pass through; the toggle itself stays responsive even mid-wipe.
  - **Re-entrancy (committed):** rapid second click cancels the in-flight wipe and restarts from the new click position. The handler clears the timeout, removes `[data-theme-wiping]`, forces a reflow (`void root.offsetWidth`), then re-adds the attribute to restart the CSS animation. Without the reflow the attribute-toggle is batched and the animation does not restart.
  - **FOUC on initial paint:** unchanged. The inline `<head>` script in `layout.tsx` already sets `data-theme` synchronously before paint. M3 only activates on user clicks.
  - **Mobile (≤640px):** wipe runs identically — the radial `circle(150% at x y)` from a small viewport's toggle position covers the screen fine. No mobile-specific behavior change.
- **Reduced motion:** instant theme swap, no overlay, no wipe (early-return in the handler).

**M4. Tonearm row hover underbar.**

The current row hover does a color shift, number scale, and hairline rule via `::after`. Refine the hairline rule into a **2px tonearm bar** that slides in from the left.

- **Color (committed):** `--ink` in light theme (off-black, legible on warm paper), `--accent` (amber) in dark theme. CSS rule: `.obys__setlist-link::after { background: var(--ink); } :root[data-theme="dark"] .obys__setlist-link::after { background: var(--accent); }`.
- **Slide-in behavior:** existing `::after` element. Change `height: 1px` → `2px`. `transform-origin: left center; transform: scaleX(0); transition: transform 220ms cubic-bezier(0.22, 1, 0.36, 1)`. On hover/focus: `transform: scaleX(1)`.
- **Exit behavior (revised):** the bar collapses left-to-right when hover ends — same `transform-origin: left`, scaling back to `scaleX(0)`. The two-direction "tonearm lifts off the groove from the right" idea is dropped; the simpler left-to-left animation reads cleanly enough and avoids the two-pseudo-element complexity the reviewer flagged. The metaphor stays — the needle drops, the needle lifts — but the lift direction matches the drop direction.
- **LA28 interaction:** LA28's existing live amber pulse persists (whole row pulses opacity at 2.6s). The tonearm bar appears on hover regardless of `wip` status; on LA28 the bar reads as an extension of the pulse.
- **Reduced motion:** `transition: none`; the bar appears at full scale immediately on hover.

**M5. Airflow cursor (WebGL2).**

Replaces the existing speed-line cursor wake. A fullscreen WebGL2 canvas runs a three-pass fluid simulation: cursor motion injects directional velocity + perpendicular swirl into a flow field; the field advects, diffuses, and dissipates each frame; a render pass samples the flow and draws an atmospheric shimmer (FBM noise stretched along flow direction, layered for interference, with subtle directional streak lines). At rest, the field decays to zero — the effect only appears under motion.

This is the signature creative-web move. Editorial restraint at first paint, technical density on interaction.

- **Scope:** site-wide. Mounted in `layout.tsx`, persists across all routes. The OS cursor is hidden via `body { cursor: none }` applied conditionally (only when the canvas is created).
- **Visual character per theme:**
  - Dark theme: cool blue-white shimmer (`vec3(0.75, 0.92, 1.0)`) → pure white at peak velocity. Matches the cool off-white ink register.
  - Light theme: ink shimmer using the resolved `--ink` token (approximately `vec3(0.05, 0.04, 0.04)` — the off-black ink color, not literal pure black, so it harmonizes with the rest of the system). Same alpha curve as dark, just inverted color stop. Single shader uniform `uTint` updated via MutationObserver on `data-theme`; same observer pattern ThemeToggle already uses.
- **Z-index:** `9999` (above content). Canvas is alpha-blended; content beneath shows through; only the shimmer is opaque. The cursor effect reads as a true cursor, not an atmospheric backdrop.
- **Guard rails (all gate canvas creation; if any fails, the OS cursor stays visible and no canvas is added to the DOM):**
  - `matchMedia('(pointer: fine)').matches` — only on devices with a precise pointer; touch-primary devices get nothing.
  - `matchMedia('(prefers-reduced-motion: reduce)').matches` — reduced-motion users get nothing.
  - WebGL2 context availability — graceful no-op on browsers without support.
- **Performance:**
  - Simulation runs at 0.5× display resolution; DPR capped at 1.5. At 1440×900 → sim at 720×450 → ~324K texels per pass × 3 passes/frame = ~58M texels/sec at 60fps. Well within any modern GPU.
  - RGBA16F float textures (ping-pong) hold the flow field.
  - Render shader early-exits with `discard`-equivalent (`fragColor = vec4(0); return;`) for static areas where the flow field is zero — saves fillrate when nothing is moving.
  - `Page Visibility API`: `requestAnimationFrame` loop pauses when tab is hidden.
  - `IntersectionObserver`: secondary pause when the canvas scrolls out of view (defensive — canvas is `position: fixed` so this rarely fires, included per implementation reference).
  - `powerPreference: 'low-power'` on context creation — battery-conscious.
- **Shader passes** (all GLSL ES 3.00):
  - *Inject:* writes a gaussian velocity burst at cursor position (radius ~0.07 UV) plus a perpendicular swirl (radius ~0.035) for rotational eddies. The swirl is signed left/right of the cursor's travel direction — this is what makes the effect read as "air" rather than "water."
  - *Advect & diffuse:* semi-Lagrangian backward trace along the velocity field (×14 texel scale), Jacobi-style diffusion mixing with cardinal neighbors at 0.10 viscosity, dissipation at 0.975 per frame.
  - *Render:* FBM (5 octaves) stretched along flow direction (3× along axis, 0.35× perpendicular = thin streaks), three noise layers at offset scales mixed for shimmer, optional high-frequency directional streak overlay (`pow(fract(proj * 120 + time * 2.5), 10)`) gated by velocity magnitude > 0.03, mask gated by `smoothstep(0, 0.05, velMag)` so static regions are fully transparent.
- **No new runtime dependency.** WebGL2 is browser-native. Total new code is one component file (`AirflowCursor.tsx`) with embedded GLSL strings.
- **Reduced motion:** the entire effect is skipped. No canvas is created, no GPU work happens, and `document.body.style.cursor = "none"` is **never applied** — the OS cursor stays as the only cursor indicator. This is also the intentional fallback for touch-only devices and browsers without WebGL2 support. A reduced-motion desktop user gets no cursor effect at all (no airflow, no replacement speed-line).
- **Hybrid pointer devices (touchscreen laptops, iPad with trackpad):** these report `pointer: fine`, so the canvas mounts. Touch events also inject velocity into the simulation at touch points — known acceptable behavior; not a bug to fix.
- **Theme listener lifecycle:** the MutationObserver is created once in the component's mount effect (empty dependency array). Since `AirflowCursor` mounts at the layout root, it persists across all SPA navigation. The observer is torn down only if the entire page unmounts (full reload).
- **View Transition interaction with M1:** the airflow canvas carries no `view-transition-name`, so it is not captured by M1's plate VT. The canvas continues animating uninterrupted during the 380ms slice wipe.

---

## Components and files

### New / changed

- **`src/components/HomeView.tsx`** (changed — covers composition + M1/M2 setup + speed-line removal)
  - Split the setlist render loop into two passes: SIDE A (case-study) and SIDE B (personal). Use `piece.category` to partition.
  - Add SIDE A / SIDE B eyebrow labels with hairline rule between.
  - Personal rows render with dimmer ink classes and indent — CSS-only, no new component.
  - Tighten row gap.
  - The center plate frame branches on `piece.cover` to render either the existing media plate or `<ConceptPlate piece={piece} />`. The frame element (single shared parent) carries `view-transition-name: plate` — one static name, not per-slug.
  - Wrap the hover-driven `setActiveSlug` call in `document.startViewTransition(() => setActiveSlug(next))` when the API is available; fall back to a plain state update otherwise. The startViewTransition wrapper is what makes M1 actually run — the `view-transition-name` alone does nothing without an explicit transition call.
  - On mount, add a `[data-initial-render]` attribute to `<html>` (or to HomeView's root) and remove it after 1500ms via `setTimeout`. This attribute gates M2 — see ConceptPlate notes.
  - **Remove the existing speed-line cursor wake** (state refs, rAF loop, `obys__cursor`/`obys__cursor-line` JSX, related CSS). The airflow cursor at the layout level supersedes it entirely. The `cursorTo`/`cursorLeave` body-attribute handlers can stay — they encode hover state for potential future use, even if the speed-line consumer is gone.

- **`src/components/ConceptPlate.tsx`** (new, ~60 lines)
  - Single-purpose component: renders the typographic plate for a piece without media. Inputs: `piece`. Outputs: a framed plate with code, status, title (per-letter spans), sector lockup.
  - All typography from `t-*` classes plus inline overrides for the monumental title size.
  - Per-letter spans generated server-side (deterministic; no animation flicker on hydration).
  - **M2 gating:** the per-letter animation is scoped to `:where([data-initial-render]) .concept-plate__title span` — it only runs while the initial-render attribute is present on `<html>` (first 1500ms after mount). Subsequent ConceptPlate mounts or re-renders triggered by slug changes never re-trigger M2, because the gating attribute has been removed by then. This is the explicit answer to the "ConceptPlate remount" concern: M2 fires once per page load, period.

- **`src/components/ThemeToggle.tsx`** (changed)
  - On click: (1) capture the current `--paper` value via `getComputedStyle(root).getPropertyValue("--paper")` BEFORE flipping; (2) write `--wipe-paper-from`, `--wipe-x`, `--wipe-y` to `<html>` style; (3) set `data-theme` to the new value immediately (t=0, not deferred); (4) add `[data-theme-wiping]` to `<html>`; (5) start a 600ms cleanup timer that removes the attribute and the inline CSS vars.
  - **Re-entrancy:** clicking the toggle again during an in-flight wipe cancels the running timer, removes `[data-theme-wiping]` synchronously (forcing the animation to abort), then proceeds with the new wipe from the new click position. The wipe never queues — only one wipe runs at a time, latest click wins.
  - Honor `prefers-reduced-motion` — early-return on the wipe (still flips `data-theme` and writes localStorage).

- **`src/app/globals.css`** (changed)
  - Add `::view-transition-old(plate)` and `::view-transition-new(plate)` rules with the slice-wipe `@keyframes` (M1). Single shared name, not a glob — VT does not support glob selectors.
  - Add `html[data-theme-wiping]::before` pseudo-element overlay with the `theme-wipe` keyframe (M3).
  - Add the per-letter title `letter-rise` keyframe, scoped under `:where([data-initial-render])` so it only runs during the first 1500ms (M2).
  - Add reduced-motion overrides for all new motion (animation: none on the VT pseudo-elements, instant theme swap on `[data-theme-wiping]`, instant final state on letter-rise).

- **`src/components/AirflowCursor.tsx`** (new, ~500 lines including GLSL)
  - Client component. Mounts once at `layout.tsx`. Encapsulates the WebGL2 setup, shader compilation, render loop, theme listener, and teardown.
  - **Guard rails on mount:** check `matchMedia('(pointer: fine)')`, `matchMedia('(prefers-reduced-motion: reduce)')`, and WebGL2 availability. If any fails, return `null` — no canvas created, no `cursor: none`.
  - **Theme listener:** `MutationObserver` on `<html>` watching `data-theme`; updates a `uTint` uniform on the render shader. Cleans up on unmount.
  - **Performance gating:** `Page Visibility API` + `IntersectionObserver` pause the `requestAnimationFrame` loop when the page is hidden or the canvas is offscreen. Resume on visibility restore.
  - **DPR + sim resolution:** display canvas at `devicePixelRatio` capped at 1.5; simulation textures at 0.5× display.
  - **`cursor: none` application:** sets `document.body.style.cursor = "none"` only after canvas is in the DOM. Restored on unmount.
  - GLSL is per the reference implementation provided — three passes (inject, advect+diffuse, render), RGBA16F ping-pong textures, full-screen triangle-strip quad, low-power context.

- **`src/app/layout.tsx`** (changed)
  - Add `<AirflowCursor />` mounted next to `<Frame />`, `<Folio />`, etc. — site-wide presence. No props.

### Unchanged

- `src/constants/pieces.ts` — data shape already supports this design (`category`, `cover?`, `status` with concept value).
- `src/constants/notes.tsx` — not touched.
- All sub-page files (`/about`, `/contact`, `/notes`, `/work`, `/work/[slug]`).
- `src/components/Frame.tsx`, `src/components/Folio.tsx` — chrome unaffected.

---

## Data model implications

None. The `Piece` interface in `src/constants/pieces.ts` already has:
- `category: "case-study" | "personal"` — drives SIDE A / SIDE B partition
- `status: "concept" | "wip" | "shipped"` — drives plate top-right label
- `cover?: CatalogCover` — when undefined, triggers typographic plate fallback
- `number` (string) — drives the `§NN` code
- `sector` (string) — drives the bottom-left lockup on the typographic plate

The current data already represents the design's needs. No migration.

---

## Trade-offs and decisions

### Why Approach 1 (Tracklist Hardback) over 2 and 3

- **Approach 2** (Map of the Soul, layered cards) risks skeuomorphic drift — the rest of the site is flat editorial mono. Stacked rotated cards would read as a different design vocabulary.
- **Approach 3** (Actual Life liner notes, text-only) removes the center plate, which has been the strongest visual anchor on the home through every iteration. Losing it is a high-risk change late in the cycle.
- **Approach 1** (Tracklist Hardback) keeps the existing 3-column architecture and replaces only what's broken (the missing-asset plates). Smallest distance from current state for the largest visible improvement.

### Why "type as plate" instead of mocking up imagery for the concepts

- Speed: 4 concept plates × hand-designed posters = days of design work. Type-as-plate ships in one component.
- Honesty: these are concept projects. A type-only plate reads as "this is the brief, the artifact follows" — accurate. A mocked poster reads as "this exists," which it doesn't yet.
- Composability: if a real concept poster lands later, dropping it into `cover` automatically replaces the typographic plate. No code change needed.

### Why no scroll on home

- The user has reconfirmed the single-viewport lock in this session (Approach A from the clarifying-question round).
- Adding scroll would also require redesigning the bottom-of-page colophon (currently sits in the viewport's bottom row) and the sub-page route transitions (which assume the home owns its own one-screen identity).
- Codrops-tier motion is still achievable inside one viewport — M1–M5 demonstrate this.

### Why native View Transitions over a motion library

- Already enabled in `next.config.ts` via `experimental.viewTransition: true`.
- The existing route transition (shared wordmark across `/` and sub-pages) uses the same API. Adding plate VT extends an existing pattern rather than introducing a new motion stack.
- No new dependency, no bundle size cost.
- Firefox (no VT) falls back to instant swap via the `if (document.startViewTransition)` guard — visually less rich than Chromium/Safari, but the rest of the home reads identically.

---

## Testing strategy

This is a frontend visual change. Verification is primarily manual:

1. **Build passes** — `npx tsc --noEmit`, `npx eslint`, `npx next build` all clean.
2. **Visual check, light theme** — load `/`, verify SIDE A / SIDE B split renders, all 7 rows fit in one viewport, personal rows render dimmer, concept plates show typographic treatment, LA28/Sift/Gyeol still show image plates.
3. **Visual check, dark theme** — toggle, verify same as above with inverted ground.
4. **Motion check** — hover (or keyboard-focus) each setlist row, verify the plate slice wipe fires on every active-slug change, the row's tonearm bar slides in on hover/focus and collapses on exit. The per-letter title reveal only fires on initial page load — confirm it on first paint and verify it does NOT re-fire on subsequent row hovers (intentional).

5. **Airflow cursor check** — on a desktop browser with a mouse, verify the OS cursor is hidden and the WebGL shimmer follows pointer motion site-wide. Move slowly: subtle streaks. Move fast: visible directional shimmer with perpendicular swirl. Hold still 1s: field decays to invisible. Switch theme: shimmer color flips between cool-white (dark) and ink (light) within one frame. On a touch device or with reduced-motion enabled: the OS cursor remains visible, no canvas exists in the DOM (`document.querySelector('canvas#airflow-canvas')` returns null). Perf verification: open Chrome DevTools Performance panel and confirm the rAF loop stays under ~3ms per frame on integrated graphics. Safari verification by visual smoothness only (no per-canvas GPU metric exposed in DevTools).
6. **Theme wipe** — click the theme toggle from different positions on the page, verify the wipe radiates from the click point.
7. **Reduced motion** — toggle `prefers-reduced-motion` in devtools or OS, verify all motion becomes instant and no airflow canvas is created.
8. **Mobile (≤640px)** — verify the stack layout renders, no horizontal overflow, SIDE A / SIDE B labels remain, OS cursor unchanged (touch device → no airflow canvas).
9. **Existing tests** — `npx vitest run` should still pass; no test file is being changed.

Cross-browser:
- Chrome / Edge / Arc (Chromium 111+): full motion experience including M1 (VT slice) and M5 (airflow cursor).
- Safari 18+: full motion experience (same-document View Transitions are stable; WebGL2 fully supported).
- Firefox (no VT support as of 2026): **M5 airflow cursor runs fully** (WebGL2 works in Firefox). Only **M1 plate swap is instant** — no slice, no fade, the code path skips `document.startViewTransition` when undefined. **M3 theme wipe is instant**. All other motion (per-letter reveal on initial mount, tonearm hover) works since they're CSS animations.

---

## Out of scope (deliberate, do not include)

- Hand-designed concept posters per piece (AI Hardware, Spatial Audio, Album Cover, Concept Car). Future work — when one of these is real, it replaces the typographic plate via `cover`.
- Scroll-driven motion. The single-viewport lock is hard.
- Sub-page redesigns. Each sub-page (`/about`, `/contact`, `/notes`, `/work`, `/work/[slug]`) stays at its current design.
- New animation library. Native View Transitions + CSS keyframes + `requestAnimationFrame` (already used for cursor wake).
- Workload-waveform under setlist rows. Earlier roadmap item; can be added later as a row affordance without conflicting with this design.

---

## Open decisions

(Decisions previously here have been resolved and folded into the design above. Remaining items below are visual polish that requires implementation review to decide:)

- **Per-letter reveal on image plates.** Currently scoped to typographic plates only. If hover transitions on image plates feel flat by comparison, could add a brief title overlay on image plates too. Decide during implementation visual QA — not a blocker.

---

## Implementation order (for planning)

When the implementation plan is written from this spec, the recommended order is:

1. **SIDE A / SIDE B split** — composition change, no new components. Smallest change, biggest perceived hierarchy win.
2. **ConceptPlate component** — typographic plate without motion. Makes concept rows feel intentional immediately.
3. **M2 per-letter title reveal** — adds motion to ConceptPlate.
4. **M5 airflow cursor** — promoted in the order because it's the signature creative-web move; landing it earlier means the page reads as itself even if later motion polish slips. Largest single piece of new code (~500 lines incl. GLSL), but isolated to one new component + a `layout.tsx` mount.
5. **M1 plate slice transition** — View Transition on plate swap.
6. **M4 tonearm row hover** — refine existing row hover.
7. **M3 radial theme-toggle wipe** — cinematic theme event.

Each step ships independently; each step is visually verifiable.

---

## Success criteria

- All 7 setlist pieces visible in one viewport with clear case-study / personal hierarchy.
- Zero "In development" placeholders on the home — every concept piece reads as intentional via the typographic plate.
- At least three of M1–M4 motion moves shipped and verifiable on hover/click.
- M5 airflow cursor active site-wide on desktop with mouse; absent on touch / reduced-motion / no-WebGL2.
- Light and dark themes both render coherently, including the airflow shimmer color flip.
- `prefers-reduced-motion` honored across all new motion (no airflow canvas, no plate slice, no theme wipe, no letter-rise).
- Build clean, no regression in existing pages or sub-page route transitions.
- No new runtime dependency (WebGL2 is browser-native).
