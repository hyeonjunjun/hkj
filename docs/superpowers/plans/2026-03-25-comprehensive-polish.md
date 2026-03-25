# Comprehensive Portfolio Polish Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the HKJ portfolio from rough prototype to awwwards-submission quality by applying research-backed patterns from top design engineer portfolios.

**Architecture:** Systematic polish across 6 layers — typography rendering, layout tightening, animation choreography, page consistency, mobile responsiveness, and performance. Each task produces a visible improvement that builds on the last. No new features — only refinement of what exists.

**Tech Stack:** Next.js 16 (App Router), GSAP 3.14 + ScrollTrigger + Flip, Lenis, Tailwind v4, Zustand

**Specs:**
- `docs/superpowers/specs/2026-03-25-the-evening-complete-design.md`
- `docs/superpowers/specs/2026-03-25-animation-framework-design.md`
- `docs/superpowers/specs/2026-03-25-portfolio-research-analysis.md`

**Research source:** Deep analysis of Rauno Freiberg, Paco Coursey, Bao To, Dennis Snellenberg, Aristide Benoist, Emil Kowalski + Devouring Details animation vocabulary.

---

## File Structure

### Modified (polish — no new files needed)

| File | What changes |
|------|-------------|
| `src/app/globals.css` | Typography rendering rules, mask-line usage, nav spacing, mobile breakpoints |
| `src/app/page.tsx` | Hero layout refinement, section spacing, mask text reveal on philosophy |
| `src/app/layout.tsx` | Font rendering settings, meta viewport |
| `src/app/work/[slug]/page.tsx` | Consistent spacing, transparent bg, blur reveals, typography alignment |
| `src/app/about/page.tsx` | Layout restructure, typography polish, same "Evening" feel as homepage |
| `src/app/writing/page.tsx` | Typography alignment, spacing consistency |
| `src/app/writing/[slug]/page.tsx` | Same polish |
| `src/app/exploration/page.tsx` | Gallery spacing, image hover refinement |
| `src/components/GlobalNav.tsx` | Tighter spacing, active states, TransitionLink everywhere |
| `src/components/Footer.tsx` | Consistent spacing, TransitionLink, warm divider |
| `src/components/Cover.tsx` | Tighter hover timing, remove unused Image import |
| `src/components/MobileMenu.tsx` | Full restyle for "Evening" feel |
| `src/components/Vinyl.tsx` | Canvas sizing fix, entrance animation |
| `src/components/KineticText.tsx` | Timing adjustments for preloader coordination |
| `src/components/Preloader.tsx` | Smoother exit into content reveals |
| `src/lib/animations.ts` | Already updated — no changes needed |

---

## Chunk 1: Typography & Rendering Foundation

The single highest-impact polish layer. Typography rendering is what separates "developer site" from "design engineer site."

### Task 1: Global typography rendering rules

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Add font-feature-settings and text-rendering to globals.css**

In the `body` rule, add:
```css
text-rendering: optimizeLegibility;
font-feature-settings: "kern" 1, "liga" 1;
```

In the `.font-display` rule (create if doesn't exist), add:
```css
.font-display {
  font-family: var(--font-display);
  text-rendering: optimizeLegibility;
  font-feature-settings: "kern" 1, "liga" 1, "calt" 1;
}
```

Ensure `.font-mono` has:
```css
.font-mono {
  font-family: var(--font-mono);
  font-feature-settings: "tnum" 1; /* tabular numbers for clock alignment */
}
```

- [ ] **Step 2: Verify these class rules exist and are correct**

Run: `grep -n "font-display\|font-mono\|text-rendering" src/app/globals.css`

- [ ] **Step 3: Add meta viewport and theme-color to layout.tsx**

In the `metadata` export, add:
```tsx
other: {
  "theme-color": "#f7f6f3",
},
```

This sets the browser chrome color to match the paper background.

- [ ] **Step 4: Build and commit**

```bash
npm run build 2>&1 | grep -c "Compiled successfully"
git add src/app/globals.css src/app/layout.tsx
git commit -m "polish(typography): add ligatures, kerning, text-rendering, theme-color"
```

### Task 2: Nav bar spacing and polish

**Files:**
- Modify: `src/components/GlobalNav.tsx`

- [ ] **Step 1: Read the current GlobalNav**

Understand the current layout. The nav should be:
- Height: 48px
- Left: `RYAN JUN` (TransitionLink) + `DESIGN ENGINEER` label + `NYCClock`
- Right: nav links (Work, Exploration, Writing, About) with `data-link` attribute
- All text: Fragment Mono, 10-11px, uppercase, letter-spacing 0.06em
- Active page: `--ink-primary` color. Inactive: `--ink-muted`
- Background: `var(--bg)` (not transparent — needs to be readable over content)
- No blur, no shadow

- [ ] **Step 2: Ensure nav background uses --bg not transparent**

The nav must have `backgroundColor: "var(--bg)"` so it's readable when scrolled over content. Add `transition: background-color 2s ease` so it smoothly shifts with time mode.

- [ ] **Step 3: Tighten nav item gap**

Research shows 24-32px gap between nav items is standard. Ensure the gap between Work/Exploration/Writing/About is `24px`. The gap between identity section and nav links should be `auto` (flexbox space-between).

- [ ] **Step 4: Ensure all nav links use TransitionLink with data-link**

Every internal link in the nav should be `<TransitionLink>` with `data-link` attribute for the hover underline effect.

- [ ] **Step 5: Build and commit**

```bash
npm run build 2>&1 | grep -c "Compiled successfully"
git add src/components/GlobalNav.tsx
git commit -m "polish(nav): tighten spacing, ensure bg color, consistent TransitionLink"
```

### Task 3: Footer consistency

**Files:**
- Modify: `src/components/Footer.tsx`

- [ ] **Step 1: Read the current Footer**

- [ ] **Step 2: Ensure footer has warm top border**

Add a `1px solid rgba(var(--ink-rgb), 0.06)` top border with generous top padding (`var(--space-breath)`).

- [ ] **Step 3: Ensure footer links use TransitionLink**

Internal links (if any) should use TransitionLink. External links (GitHub, X, LinkedIn) stay as `<a>` tags.

- [ ] **Step 4: Add colophon**

Below the social links, add a small colophon:
```
© 2026 HKJ Studio · Built with Next.js
```
In Fragment Mono, `--text-meta`, `--ink-ghost` color.

- [ ] **Step 5: Build and commit**

```bash
npm run build 2>&1 | grep -c "Compiled successfully"
git add src/components/Footer.tsx
git commit -m "polish(footer): warm border, colophon, TransitionLink"
```

---

## Chunk 2: Homepage Layout Polish

### Task 4: Hero section refinement

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Read current page.tsx hero section**

- [ ] **Step 2: Apply mask-line reveal to philosophy text**

Wrap the KineticText in a `.mask-line` wrapper so the text slides up from behind an overflow:hidden mask. This gives the text-reveal the "line by line" quality of Devouring Details.

Actually, KineticText already handles its own per-character animation. Keep it. But wrap the `NEW YORK · OPEN TO WORK` status line in a mask-line reveal:

```tsx
<div className="mask-line">
  <div data-hero-el style={{ opacity: 0 }}>
    <span>New York</span>
    <span>·</span>
    <span>Open to work</span>
  </div>
</div>
```

- [ ] **Step 3: Ensure hero vertical rhythm matches spec**

- Top padding: `clamp(120px, 22vh, 220px)` ✓ (already set)
- Gap between vinyl and text: `var(--space-break)` (48px) — may need increase to `clamp(32px, 5vh, 56px)`
- Bottom padding before work section: `clamp(60px, 12vh, 120px)` ✓

- [ ] **Step 4: Ensure project card gap matches research**

Between project cards: `clamp(48px, 6vh, 72px)` ✓ (already set after iteration 5 fix)

- [ ] **Step 5: Build and commit**

```bash
npm run build 2>&1 | grep -c "Compiled successfully"
git add src/app/page.tsx
git commit -m "polish(hero): mask-line status, tighter vertical rhythm"
```

### Task 5: Work section — fader hover timing

**Files:**
- Modify: `src/components/Cover.tsx`

- [ ] **Step 1: Read current Cover.tsx**

- [ ] **Step 2: Ensure hover timing uses ease-swift (150ms)**

The research says: instant on, 150ms ease-out off. The fader dim transition should be:
- Dim in: `300ms ease-swift` (fast but not instant — gives context)
- Recover out: `200ms ease-swift` (faster than dim-in for snappy feel)

Currently it's `400ms ease-out`. Update both dimmed and focused transitions to use `cubic-bezier(.23, .88, .26, .92)` (ease-swift) at 300ms/200ms.

- [ ] **Step 3: Remove unused Image import if present**

Check if `import Image from "next/image"` is imported but only DissolveImage is used.

- [ ] **Step 4: Build and commit**

```bash
npm run build 2>&1 | grep -c "Compiled successfully"
git add src/components/Cover.tsx
git commit -m "polish(cover): faster fader timing, ease-swift, cleanup"
```

---

## Chunk 3: Inner Pages — Consistent "Evening" Feel

The case study, about, writing, and exploration pages must feel like the same site as the homepage. Currently they're disconnected.

### Task 6: Case study page polish

**Files:**
- Modify: `src/app/work/[slug]/page.tsx`

- [ ] **Step 1: Read current case study page**

- [ ] **Step 2: Update spacing to match the spec**

- Top padding: `clamp(80px, 12vh, 140px)` (generous, matches hero spacing energy)
- Max-width: `var(--max-cover)` (900px) for the content column
- Section gaps: `clamp(48px, 6vh, 72px)` between major sections
- Ensure `backgroundColor: "transparent"` (WallLight shows through)

- [ ] **Step 3: Use REVEAL_CONTENT presets for scroll-triggered sections**

Import `REVEAL_CONTENT` from `@/lib/animations` and use for all `[data-section-reveal]` elements. Replace any remaining hardcoded GSAP values.

- [ ] **Step 4: Use REVEAL_META for metadata rows**

Import `REVEAL_META` and use for the role/year/sector metadata block.

- [ ] **Step 5: Add TransitionLink for prev/next project navigation**

Replace `<Link>` with `<TransitionLink>` for the prev/next project links.

- [ ] **Step 6: Build and commit**

```bash
npm run build 2>&1 | grep -c "Compiled successfully"
git add src/app/work/[slug]/page.tsx
git commit -m "polish(casestudy): consistent spacing, reveal presets, TransitionLink"
```

### Task 7: About page — full restyle

**Files:**
- Modify: `src/app/about/page.tsx`

- [ ] **Step 1: Read current about page**

- [ ] **Step 2: Update layout to match Evening spec**

- Max-width: `var(--max-text)` (540px) — tighter than homepage, reading-focused
- Top padding: `clamp(80px, 12vh, 140px)`
- Use same section divider style: `1px solid rgba(var(--ink-rgb), 0.06)`
- Transparent background

- [ ] **Step 3: Ensure all text uses correct token sizes**

- Section labels (About, Experience, Get in touch): Fragment Mono, `--text-meta`, uppercase, `--ink-muted`
- Body paragraphs: Satoshi, `--text-body` (15px), `--ink-primary`, line-height 1.7
- Experience items: Fragment Mono dates + Satoshi descriptions

- [ ] **Step 4: Add TransitionLink for internal links, data-link for hover underlines**

- [ ] **Step 5: Build and commit**

```bash
npm run build 2>&1 | grep -c "Compiled successfully"
git add src/app/about/page.tsx
git commit -m "polish(about): consistent Evening styling, spacing, tokens"
```

### Task 8: Writing pages polish

**Files:**
- Modify: `src/app/writing/page.tsx`
- Modify: `src/app/writing/[slug]/page.tsx`

- [ ] **Step 1: Read both writing pages**

- [ ] **Step 2: Update spacing and typography**

Same principles as about page:
- Max-width: `var(--max-text)` (540px) for the reading column
- Top padding: `clamp(80px, 12vh, 140px)`
- Article titles: Newsreader italic, `--text-title` (18-22px)
- Article body: Satoshi, 15px, line-height 1.7
- Metadata (date, tags): Fragment Mono, `--text-meta`

- [ ] **Step 3: Replace Link with TransitionLink for internal navigation**

Journal entry links, back links, next-entry links — all TransitionLink.

- [ ] **Step 4: Build and commit**

```bash
npm run build 2>&1 | grep -c "Compiled successfully"
git add src/app/writing/
git commit -m "polish(writing): consistent spacing, TransitionLink, typography"
```

### Task 9: Exploration gallery polish

**Files:**
- Modify: `src/app/exploration/page.tsx`

- [ ] **Step 1: Read current exploration page**

- [ ] **Step 2: Update spacing**

- Top padding: `clamp(80px, 12vh, 140px)`
- Grid gap: `16px` horizontal, `clamp(32px, 4vh, 48px)` vertical
- Title: Newsreader italic, `clamp(24px, 3.5vw, 32px)` — not the oversized `clamp(2.2rem, 4.5vw, 3.2rem)` currently

- [ ] **Step 3: Ensure image hover uses ease-swift**

Replace the inline `cubic-bezier(0.16, 1, 0.3, 1)` on hover transitions with the shared `--ease-swift` variable for consistency.

- [ ] **Step 4: Build and commit**

```bash
npm run build 2>&1 | grep -c "Compiled successfully"
git add src/app/exploration/page.tsx
git commit -m "polish(exploration): consistent spacing, title size, ease-swift hovers"
```

---

## Chunk 4: Mobile Responsiveness

Awwwards judges check mobile FIRST. This is a hard blocker.

### Task 10: Mobile breakpoints and layout

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/app/page.tsx`
- Modify: `src/components/GlobalNav.tsx`
- Modify: `src/components/Cover.tsx`

- [ ] **Step 1: Add mobile-specific CSS to globals.css**

```css
@media (max-width: 768px) {
  :root {
    --page-px: 16px;
    --max-cover: 100%;
    --max-text: 100%;
  }

  .page-container {
    padding-left: var(--page-px);
    padding-right: var(--page-px);
  }
}

@media (max-width: 480px) {
  :root {
    --page-px: 12px;
  }
}
```

- [ ] **Step 2: Ensure the vinyl scales on mobile**

The vinyl already uses `clamp(260px, 30vw, 420px)` — at 375px viewport that's ~112px which is too small. Change to `clamp(200px, 55vw, 420px)` — gives ~206px at 375px width.

- [ ] **Step 3: Ensure the nav is usable on mobile**

The desktop nav links should hide at `768px` (already handled by CSS). The mobile menu trigger should be visible. Verify the mobile menu works and uses TransitionLink.

- [ ] **Step 4: Ensure project cards are full-width on mobile**

The cover grid should be single-column on mobile (already is via the flex column layout). Verify images scale properly.

- [ ] **Step 5: Ensure the custom cursor is hidden on touch devices**

Already handled by `@media (hover: none)` in globals.css. Verify.

- [ ] **Step 6: Build and commit**

```bash
npm run build 2>&1 | grep -c "Compiled successfully"
git add src/app/globals.css src/app/page.tsx src/components/GlobalNav.tsx src/components/Cover.tsx src/components/Vinyl.tsx
git commit -m "polish(mobile): responsive breakpoints, vinyl sizing, nav verification"
```

---

## Chunk 5: Performance & Final Polish

### Task 11: Image optimization verification

**Files:**
- Verify: `public/images/`

- [ ] **Step 1: Verify all images are webp**

```bash
ls -la public/images/
```

Ensure no PNGs remain. All should be webp.

- [ ] **Step 2: Verify blur placeholders are set**

Check `src/constants/projects.ts` — Gyeol and Sift should have `coverBlur` fields.

- [ ] **Step 3: Verify exploration images are webp**

Check `src/constants/explorations.ts` — all image paths should point to `.webp` files.

### Task 12: Preloader → content reveal choreography

**Files:**
- Modify: `src/components/Preloader.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Ensure preloader exit triggers content reveals**

The homepage `useEffect` checks `loaded` from the store. Verify this works:
1. Preloader finishes → calls `setLoaded()`
2. Homepage useEffect fires when `loaded` becomes true
3. GSAP reveals play with appropriate delays

The total choreography should be:
- 0-2.5s: Preloader dark overlay fades
- 2.5-3.0s: Nav elements reveal (REVEAL_NAV)
- 2.8-3.5s: Vinyl fades in (scale 0.96 → 1, blur 4px → 0)
- 3.0-3.8s: Philosophy text reveals (KineticText spring entrance)
- 3.5-4.2s: Status line reveals
- Scroll-triggered: Project cards reveal on scroll (REVEAL_CARD)

- [ ] **Step 2: Verify KineticText delay coordination**

KineticText has `delay: 1.8` for first visit, `delay: 0.4` for repeat. This should be `delay: 0.5` after the preloader's `setLoaded()` fires (the hero parent reveals first, then KineticText animates inside it).

- [ ] **Step 3: Build and commit**

```bash
npm run build 2>&1 | grep -c "Compiled successfully"
git add src/components/Preloader.tsx src/app/page.tsx
git commit -m "polish(choreography): tighten preloader → content reveal timing"
```

### Task 13: Final build verification and push

- [ ] **Step 1: Clean build**

```bash
rm -rf .next && npm run build
```

Expect: `Compiled successfully`, all routes rendering, 0 TypeScript errors.

- [ ] **Step 2: Check all routes**

```
/ — homepage
/work/gyeol — case study
/work/sift — case study
/exploration — gallery
/writing — journal
/writing/on-restraint — journal entry
/about — about page
```

- [ ] **Step 3: Push to deploy**

```bash
git push
```

- [ ] **Step 4: Verify Vercel deployment**

Check that the build passes on Vercel and all pages load correctly on the production URL.

---

## Success Criteria

After all 13 tasks:

1. **Typography**: Ligatures enabled, kerning on, text-rendering optimized. Display text uses Newsreader italic ≤32px. Body at 15px. Mono labels at 10-11px.
2. **Layout**: Consistent max-widths (900px covers, 540px text). Generous spacing between sections. No dark voids or excessive empty space.
3. **Animations**: All pages use blur-reveal presets from `animations.ts`. Hover timing at 150-300ms with ease-swift. Scroll reveals at 85% viewport threshold.
4. **Consistency**: Every page feels like the same "Evening" — same tokens, same spacing rhythm, same animation vocabulary.
5. **Mobile**: Responsive breakpoints at 768px and 480px. Vinyl scales. Nav switches to mobile menu. Custom cursor hidden on touch.
6. **Performance**: Build passes clean. No TypeScript errors. All images webp with blur placeholders.
7. **Navigation**: All internal links use TransitionLink. FLIP transitions on project cards. Hover underlines on all links.
