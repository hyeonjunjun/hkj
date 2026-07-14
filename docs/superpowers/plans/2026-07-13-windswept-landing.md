# Windswept Landing Page Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current simple homepage with a locked-viewport, zero-scroll "Windswept" identity landing page (new palette, General Sans display type, Framer Motion), while leaving Archive/References/Info's visual register and every shared component's non-landing rendering completely untouched.

**Architecture:** Three shared components (`Nav`, `Wordmark`, `CornerMark`) gain a `variant` prop — their existing rendering (used by every room, mostly via `RoomHeader`) stays byte-for-byte unchanged, and a new landing-only variant carries the Windswept treatment. Two components (`Standfirst`, `ThesisStatement`) are landing-page-only already, so they're restyled in place. A new small primitive (`WindBlurReveal`) implements the directional-blur entrance using the same reliable setTimeout+CSS-transition mechanism as the existing `MotionReveal`, reserved for exactly the Wordmark identity mark. Everything else Windswept-branded (`Nav` landing variant, `CornerMark` landing variant, `Standfirst`, `ThesisStatement`) uses Framer Motion (`framer-motion`, already an unused dependency in `package.json`) for its entrance instead of `MotionReveal`. New color/font tokens are added under distinct names (`--ws-paper`, `--ws-ink`, `--ws-accent`, `font-display`) rather than redefining the shared root tokens, so nothing else on the site can be affected even by accident.

**Tech Stack:** Next.js 16 App Router, TypeScript strict, Tailwind CSS v4, Framer Motion (first real use — already installed, never imported), Vitest + React Testing Library, Playwright as a devDependency for ad-hoc manual/visual verification (no E2E suite exists).

**Work happens directly on `master`** — this project's established convention, no worktrees/branches.

**A note on two implementation-mechanism decisions this plan makes, not fully dictated by the spec (flagging for the plan review):**
1. The spec describes the composition as "asymmetrical CSS Grid, mostly empty." This plan instead uses the **absolute-corner-anchor technique already used by every existing corner element in this codebase** (`ThesisStatement`, `CornerMark`, the masthead div) rather than introducing a literal `display: grid`. It produces the same asymmetrical, mostly-empty, three-corner-anchored composition the spec calls for, with less architectural deviation from the rest of the project.
2. The spec reserves the directional SVG blur for "the identity statement's entrance" without naming a specific component. This plan targets it at **`Wordmark`** (the identity mark itself) rather than `ThesisStatement`, since "identity" maps most directly to the studio mark, and it's the single largest/loudest element on the page.

---

## Chunk 1: Foundation — font, color tokens, motion constants

### Task 1: Source and register the General Sans font (blocking prerequisite)

**Context:** Per the spec, General Sans isn't on Google Fonts, so it needs local `.woff2` files loaded via `next/font/local`. This must happen before any component can reference the new display face.

**Files:**
- Create: `src/fonts/general-sans/` (directory holding the downloaded `.woff2` files)
- Modify: `src/app/layout.tsx`
- Modify: `tailwind.config.ts`

- [ ] **Step 1: Discover the current, correct download links**

Fetch Fontshare's own product page for General Sans to get the currently-valid CSS embed snippet and direct `.woff2` URLs — do not guess or hard-code an API URL, since Fontshare's exact API path may have changed since this plan was written:

**Do not hardcode a specific weight list in this query — that would make the "confirm the heaviest weight" check below circular** (Fontshare's API only returns `@font-face` blocks for weights explicitly requested in the query string; a query for `@400,500,600,700` can never reveal an 800 or 900 even if the family has one, since it never asked for it). Request the face with no weight filter instead, so the response reveals every weight the family actually has:

```bash
curl -s "https://api.fontshare.com/v2/css?f%5B%5D=general-sans&display=swap" -o /tmp/general-sans.css
cat /tmp/general-sans.css
```

If that returns valid CSS with `@font-face` blocks and `src: url(...)` woff2 links, proceed to Step 2. If it returns an error, 404, or HTML instead of CSS, use WebFetch on `https://www.fontshare.com/fonts/general-sans` to find the current correct embed code/API path, and adapt the command above accordingly.

**Confirm the heaviest available weight before downloading — don't assume.** Read every `font-weight` value across the returned `@font-face` blocks (or the `font-weight: <min> <max>` range declaration, if the response uses the variable-range form instead of discrete blocks). At the time this plan was written, 700 (Bold) was confirmed as the heaviest cut available — no Extrabold/Black exists in this family — but verify this against what the fetched CSS actually contains rather than trusting this plan's prose, since font families do get updated. Use whichever weight is genuinely the heaviest for "heavy," and note it when reporting back if it's not 700.

**Only need Regular (400, for any future body use) and the heaviest weight confirmed above.** Don't download unused weights.

- [ ] **Step 2: Download the woff2 files**

Extract the `url(...)` values from the fetched CSS for the two weights needed (Regular/400 and the heaviest weight confirmed in Step 1 — ignore `@font-face` blocks for any other weight in the response, since Step 1's query fetched the whole family). **These URLs are protocol-relative** (e.g. `//cdn.fontshare.com/wf/ABC123.woff2`, no scheme prefix) — `curl` cannot fetch a URL without a scheme, so each one needs `https:` prepended before downloading, or the download will silently fail (empty file, no error). Worked example: an extracted value of `//cdn.fontshare.com/wf/ABC123.woff2` becomes `https://cdn.fontshare.com/wf/ABC123.woff2` — the full corrected URL. Do not literally concatenate a `https:` literal in front of the original value as a separate step if you're also substituting it into a template that already starts with `https:` — that produces the malformed, doubled `https:https://cdn.fontshare.com/wf/ABC123.woff2` (curl will fail on this). Substitute only the single, complete, already-corrected URL into the commands below:

```bash
mkdir -p src/fonts/general-sans
curl -s -o src/fonts/general-sans/GeneralSans-Regular.woff2 "<full corrected https:// URL for weight 400>"
curl -s -o src/fonts/general-sans/GeneralSans-Bold.woff2 "<full corrected https:// URL for the heaviest weight confirmed in Step 1>"
```

- [ ] **Step 3: Verify the downloaded files are genuinely valid woff2 fonts, not error pages**

```bash
file src/fonts/general-sans/GeneralSans-Regular.woff2
file src/fonts/general-sans/GeneralSans-Bold.woff2
ls -la src/fonts/general-sans/
```

Expected: both report as a font/binary type (not "ASCII text" or "HTML document"), and both files are more than a few KB (a failed download often produces a tiny HTML error page instead). **If either file is not a real woff2 font, STOP — do not fabricate a placeholder file, do not silently substitute a different font, and do not proceed with a broken/fake font file. Report BLOCKED with exactly what happened (the curl output, the `file` output) so a human can resolve the download.**

- [ ] **Step 4: Register the font in `layout.tsx`**

Current `src/app/layout.tsx` (read the actual file first — it may have changed since this plan was written):

```tsx
import type { Metadata } from "next";
import { Courier_Prime, Inter_Tight, Instrument_Serif } from "next/font/google";
import "./globals.css";

const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});
```

Add a `next/font/local` import and font instance alongside the existing `next/font/google` ones:

```tsx
import type { Metadata } from "next";
import { Courier_Prime, Inter_Tight, Instrument_Serif } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

/**
 * Windswept's structural-header display face — used only by the
 * landing page's Wordmark (hero variant) and ThesisStatement, not the
 * project's default sans (Inter Tight, --font-sans). Self-hosted since
 * General Sans isn't on Google Fonts.
 */
const generalSans = localFont({
  src: [
    { path: "../fonts/general-sans/GeneralSans-Regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/general-sans/GeneralSans-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-display",
  display: "swap",
});
```

Then add `generalSans.variable` to the `<html className>` list (find the current `className` on the `<html>` element and append it):

```tsx
      className={`${interTight.variable} ${instrumentSerif.variable} ${courierPrime.variable} ${generalSans.variable}`}
```

- [ ] **Step 5: Add the `font-display` Tailwind utility**

In `tailwind.config.ts`, inside the existing `fontFamily` object (find it — do not redefine `sans`, only add a new key):

```ts
        display: ["var(--font-display)", "General Sans", "sans-serif"],
```

- [ ] **Step 6: Verify**

Run: `npx tsc --noEmit` — expect no errors.
Run: `npm run build` — expect success (confirms the font files load correctly at build time; a broken/missing font file usually fails the build here).

- [ ] **Step 7: Commit**

```bash
git add src/fonts/general-sans/ src/app/layout.tsx tailwind.config.ts
git commit -m "$(cat <<'EOF'
feat: add self-hosted General Sans font for the Windswept landing page

Not on Google Fonts, so loaded via next/font/local. Only Regular (400)
and the heaviest weight confirmed available (Bold/700 at the time of
writing -- verify this matches what Step 1 actually confirmed before
using this exact wording). Wired to a new font-display Tailwind
utility, kept separate from font-sans (Inter Tight) so no existing
component is affected.
EOF
)"
```

---

### Task 2: Windswept color tokens

**Context:** New, distinctly-named CSS custom properties and Tailwind color utilities — not redefinitions of the shared `--paper`/`--ink`/`--ember` tokens every room depends on.

**Files:**
- Modify: `src/app/globals.css`
- Modify: `tailwind.config.ts`

- [ ] **Step 1: Add the new tokens to `globals.css`**

In `src/app/globals.css`, inside the existing `:root { ... }` block (current content — verify against the real file first):

```css
:root {
  --paper: #F8F9FA;
  --paper-shade: oklch(90% 0.012 85);
  --paper-hover: oklch(94% 0.010 85);
  --paper-deep: oklch(86% 0.015 85);
  --ink: #121212;
  --ink-soft: oklch(35% 0.010 60);
  --mist: oklch(58% 0.012 75);
  --mist-deep: oklch(48% 0.014 75);
  --ember: oklch(60% 0.14 50);
  --paper-edge: oklch(90% 0.005 60);
  --edge-margin: clamp(16px, 2vw, 32px);
}
```

Add three new lines at the end of this block, with a comment explaining why they're separate from the tokens above:

```css
  /* Windswept landing-page palette -- new, distinctly-named tokens
     (not redefinitions of --paper/--ink/--ember above), so Archive,
     References, Info, and every other room's shared styling is
     completely unaffected. Used only by landing-variant components. */
  --ws-paper: #F4F3EF;
  --ws-ink: #1C1C1A;
  --ws-accent: #1845C2;
```

- [ ] **Step 2: Add the Tailwind color utilities**

In `tailwind.config.ts`, inside the existing `colors` object (do not remove or modify any existing entry):

```ts
        "ws-paper": "var(--ws-paper)",
        "ws-ink": "var(--ws-ink)",
        "ws-accent": "var(--ws-accent)",
```

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit` — expect no errors (Tailwind config changes aren't type-checked directly, but this confirms nothing else broke).
Run: `npm run build` — expect success.

- [ ] **Step 4: Commit**

```bash
git add src/app/globals.css tailwind.config.ts
git commit -m "$(cat <<'EOF'
feat: add Windswept color tokens (ws-paper, ws-ink, ws-accent)

New, distinctly-named tokens rather than redefining the shared
--paper/--ink/--ember root tokens, so Archive/References/Info and
every other room's visual register stays completely unaffected.
EOF
)"
```

---

### Task 3: Framer Motion timing constants

**Context:** `src/lib/motion.ts` centralizes every entrance-animation constant, but its values are in milliseconds — Framer Motion's `transition.duration`/`transition.delay` are in seconds. Add pre-converted seconds versions and the shared easing curve here, rather than repeating a `/1000` conversion at every landing-variant call site.

**Files:**
- Modify: `src/lib/motion.ts`
- Create: `src/lib/motion.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/lib/motion.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { delay, duration, delaySeconds, durationSeconds, windEasing } from "./motion";

describe("delaySeconds / durationSeconds", () => {
  it("converts every delay constant to seconds", () => {
    expect(delaySeconds.wordmark).toBeCloseTo(delay.wordmark / 1000);
    expect(delaySeconds.standfirst).toBeCloseTo(delay.standfirst / 1000);
    expect(delaySeconds.nav).toBeCloseTo(delay.nav / 1000);
    expect(delaySeconds.thesis).toBeCloseTo(delay.thesis / 1000);
    expect(delaySeconds.cornerMark).toBeCloseTo(delay.cornerMark / 1000);
  });

  it("converts every duration constant to seconds", () => {
    expect(durationSeconds.fast).toBeCloseTo(duration.fast / 1000);
    expect(durationSeconds.base).toBeCloseTo(duration.base / 1000);
    expect(durationSeconds.slow).toBeCloseTo(duration.slow / 1000);
    expect(durationSeconds.reveal).toBeCloseTo(duration.reveal / 1000);
  });
});

describe("windEasing", () => {
  it("is the Windswept brief's organic-deceleration cubic-bezier tuple", () => {
    expect(windEasing).toEqual([0.16, 1, 0.3, 1]);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- src/lib/motion.test.ts`
Expected: FAIL — `delaySeconds`/`durationSeconds`/`windEasing` don't exist yet.

- [ ] **Step 3: Add the new exports**

In `src/lib/motion.ts`, append after the existing `delay` export (don't modify `easing`, `duration`, or `delay` themselves):

```typescript
/**
 * Framer Motion's `transition.duration`/`transition.delay` are expressed
 * in seconds, unlike every other constant in this file (milliseconds).
 * These two objects pre-convert the existing scale so the Windswept
 * landing page's Framer Motion components share the same coordinated
 * timing without repeating a `/1000` conversion at every call site.
 */
export const delaySeconds = {
  wordmark: delay.wordmark / 1000,
  standfirst: delay.standfirst / 1000,
  nav: delay.nav / 1000,
  thesis: delay.thesis / 1000,
  cornerMark: delay.cornerMark / 1000,
} as const;

export const durationSeconds = {
  fast: duration.fast / 1000,
  base: duration.base / 1000,
  slow: duration.slow / 1000,
  reveal: duration.reveal / 1000,
} as const;

/** The Windswept brief's "organic deceleration" curve, as a Framer Motion cubic-bezier tuple. */
export const windEasing: [number, number, number, number] = [0.16, 1, 0.3, 1];
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- src/lib/motion.test.ts`
Expected: PASS (3 tests)

- [ ] **Step 5: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 6: Commit**

```bash
git add src/lib/motion.ts src/lib/motion.test.ts
git commit -m "feat: add Framer Motion timing constants (seconds, windEasing)"
```

---

## Chunk 2: New primitive + shared-component variants

### Task 4: `WindBlurReveal` — the directional-blur entrance primitive

**Context:** The Windswept brief's signature entrance — a horizontal-only Gaussian blur that resolves into crisp focus, "caught in a gust of wind." CSS `filter: blur()` blurs uniformly in both axes, so this needs an inline SVG `feGaussianBlur` filter with `stdDeviation="8 0"` (X-only). Framer Motion's `animate` prop is not used here — its `filter` animation support targets standard CSS filter functions, not a `url(#id)` reference to a custom SVG filter, so smoothly interpolating between "blurred" and "sharp" that way is unreliable. Instead this reuses the exact same proven mechanism `MotionReveal` already uses (a `setTimeout`-driven `visible` boolean plus an inline CSS `transition`), which handles a `filter: url(#id)` → `filter: none` toggle correctly and, as a side benefit, inherits `prefers-reduced-motion` handling for free from the existing global CSS rule — no separate reduced-motion wiring needed for this component.

**Files:**
- Create: `src/components/WindBlurReveal.tsx`
- Create: `src/components/WindBlurReveal.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/components/WindBlurReveal.test.tsx`:

```tsx
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import WindBlurReveal from "./WindBlurReveal";

describe("WindBlurReveal", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders its children", () => {
    render(
      <WindBlurReveal>
        <p>Studio name</p>
      </WindBlurReveal>,
    );
    expect(screen.getByText("Studio name")).toBeInTheDocument();
  });

  it("renders the SVG directional-blur filter definition", () => {
    const { container } = render(
      <WindBlurReveal>
        <p>Studio name</p>
      </WindBlurReveal>,
    );
    const filterEl = container.querySelector("filter#wind-blur feGaussianBlur");
    expect(filterEl).toHaveAttribute("stdDeviation", "8 0");
  });

  it("starts blurred/faded and settles to sharp/visible after the delay", () => {
    const { container } = render(
      <WindBlurReveal delay={500} duration={600}>
        <p>Studio name</p>
      </WindBlurReveal>,
    );
    const wrapper = container.querySelector("div[style]");
    expect(wrapper).toHaveStyle({ opacity: "0", filter: "url(#wind-blur)" });

    vi.advanceTimersByTime(500);

    expect(wrapper).toHaveStyle({ opacity: "1", filter: "none" });
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- src/components/WindBlurReveal.test.tsx`
Expected: FAIL — `Cannot find module './WindBlurReveal'`

- [ ] **Step 3: Write the implementation**

Create `src/components/WindBlurReveal.tsx`:

```tsx
"use client";

import { useEffect, useState, type ReactNode } from "react";

interface WindBlurRevealProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
}

/**
 * The Windswept brief's signature "caught in a gust of wind before
 * settling into crisp focus" entrance -- reserved for exactly the
 * Wordmark identity mark per the design spec, not applied broadly.
 *
 * Uses the same setTimeout + CSS-transition mechanism as MotionReveal
 * (not Framer Motion) specifically because Framer Motion's `filter`
 * animation support targets standard CSS filter functions (`blur()`,
 * `brightness()`, etc.), not a `url(#id)` reference to a custom SVG
 * filter -- CSS `filter: blur()` alone can't do a directional
 * (X-axis-only) blur, so this needs the SVG `feGaussianBlur
 * stdDeviation="8 0"` filter, driven the same reliable way MotionReveal
 * already drives opacity/transform. As a side effect, this inherits
 * prefers-reduced-motion handling for free from the global CSS rule in
 * globals.css, the same way MotionReveal does -- no separate wiring
 * needed here.
 */
export default function WindBlurReveal({ children, delay = 0, duration = 600 }: WindBlurRevealProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <>
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <defs>
          <filter id="wind-blur">
            <feGaussianBlur stdDeviation="8 0" />
          </filter>
        </defs>
      </svg>
      <div
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateX(0)" : "translateX(-16px)",
          filter: visible ? "none" : "url(#wind-blur)",
          transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1), transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1), filter ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`,
        }}
      >
        {children}
      </div>
    </>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- src/components/WindBlurReveal.test.tsx`
Expected: PASS (3 tests)

- [ ] **Step 5: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 6: Commit**

```bash
git add src/components/WindBlurReveal.tsx src/components/WindBlurReveal.test.tsx
git commit -m "feat: add WindBlurReveal directional-blur entrance primitive"
```

---

### Task 5: `Nav` landing variant

**Context:** `Nav.tsx` is shared — rendered on the landing page and, via `RoomHeader.tsx`, on every room page — and **neither current call site passes a `variant` argument today**. This means the new variant's *default* must stay exactly today's rendering (so `RoomHeader`'s untouched call site is provably safe), and it's `page.tsx` (in Task 10) that will explicitly opt in with `variant="landing"`. This is the opposite default-safety shape from `Wordmark`'s existing `variant` prop (where `RoomHeader` already explicitly passes `variant="room"` today) — don't copy that convention here.

**Files:**
- Modify: `src/components/Nav.tsx`
- Create: `src/components/Nav.test.tsx` (first test file for this component)

- [ ] **Step 1: Write the failing tests**

Create `src/components/Nav.test.tsx`:

```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Nav from "./Nav";
import type { NavItem } from "@/data/studio";

// usePathname() returns null in this project's test environment (no
// router-context mock exists) -- and isNavItemActive explicitly returns
// false for a null pathname, so every item would render as inactive
// without this mock, making the active-state assertions below
// impossible to exercise. "/" matches the "works" item's href.
vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

const items: NavItem[] = [
  { label: "works", href: "/", room: "works" },
  { label: "archive", href: "/archive", room: "archive" },
];

describe("Nav default (room) variant", () => {
  it("renders plain-text labels, no brackets", () => {
    render(<Nav items={items} />);
    expect(screen.getByText("works")).toBeInTheDocument();
    expect(screen.queryByText("[ works ]")).not.toBeInTheDocument();
  });
});

describe("Nav landing variant", () => {
  it("renders each label wrapped in brackets", () => {
    render(<Nav items={items} variant="landing" />);
    expect(screen.getByText(/\[\s*works\s*\]/)).toBeInTheDocument();
    expect(screen.getByText(/\[\s*archive\s*\]/)).toBeInTheDocument();
  });

  it("uses uppercase styling and the ws-accent color on the active link, not ember", () => {
    render(<Nav items={items} variant="landing" />);
    const activeLink = screen.getByRole("link", { name: /works/i });
    expect(activeLink.className).toContain("uppercase");
    const underline = activeLink.querySelector("span[aria-hidden]");
    expect(underline).toHaveClass("bg-ws-accent");
    expect(underline).not.toHaveClass("bg-ember");
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test -- src/components/Nav.test.tsx`
Expected: FAIL — `variant` prop doesn't exist yet, landing-specific assertions find nothing.

- [ ] **Step 3: Write the implementation**

Current `src/components/Nav.tsx` (verify against the real file first):

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/data/studio";
import { delay, duration } from "@/lib/motion";
import { isNavItemActive } from "@/lib/navActive";
import MotionReveal from "./MotionReveal";

interface NavProps {
  items: NavItem[];
}

export default function Nav({ items }: NavProps) {
  const pathname = usePathname();

  return (
    <MotionReveal delay={delay.nav} duration={duration.reveal}>
      <nav aria-label="Primary">
        <ul className="flex flex-wrap items-center gap-6 lg:gap-14">
          {items.map((item) => {
            const isActive = isNavItemActive(pathname, item);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`nav-link relative inline-block font-sans text-[15px] text-ink lg:text-[18px] ${
                    isActive ? "font-medium" : "font-normal"
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span aria-hidden="true" className="absolute -bottom-1 left-0 h-[2px] w-full bg-ember" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </MotionReveal>
  );
}
```

Replace with:

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import type { NavItem } from "@/data/studio";
import { delay, duration, durationSeconds, windEasing } from "@/lib/motion";
import { isNavItemActive } from "@/lib/navActive";
import MotionReveal from "./MotionReveal";

interface NavProps {
  items: NavItem[];
  /**
   * "room" (default) is today's plain-text nav, shared by RoomHeader on
   * every room page -- unchanged. Deliberately the default: neither
   * RoomHeader.tsx nor the landing page passes a variant today, so
   * defaulting to "room" keeps RoomHeader's call site provably
   * unaffected. "landing" is the Windswept bracketed-door treatment,
   * opted into explicitly only by the landing page.
   */
  variant?: "room" | "landing";
}

/**
 * Primary navigation, shared across the landing masthead and every room.
 * The active room (matched against the current pathname) gets weight 500
 * and a persistent 2px ember underline, 4px below the baseline — distinct
 * from the ink hover-underline every link gets (see .nav-link in
 * globals.css), which only appears on hover/focus.
 */
export default function Nav({ items, variant = "room" }: NavProps) {
  const pathname = usePathname();

  if (variant === "landing") {
    return (
      <nav aria-label="Primary">
        <ul className="flex flex-wrap items-center gap-6 lg:gap-10">
          {items.map((item) => {
            const isActive = isNavItemActive(pathname, item);
            return (
              <li key={item.href}>
                <motion.div whileHover={{ x: 6 }} transition={{ duration: durationSeconds.base, ease: windEasing }}>
                  <Link
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className="relative inline-block font-mono text-[11px] uppercase tracking-[0.2em] text-ws-ink"
                  >
                    [ {item.label} ]
                    {isActive && (
                      <span
                        aria-hidden="true"
                        className="absolute -bottom-1 left-0 h-[2px] w-full bg-ws-accent"
                      />
                    )}
                  </Link>
                </motion.div>
              </li>
            );
          })}
        </ul>
      </nav>
    );
  }

  return (
    <MotionReveal delay={delay.nav} duration={duration.reveal}>
      <nav aria-label="Primary">
        <ul className="flex flex-wrap items-center gap-6 lg:gap-14">
          {items.map((item) => {
            const isActive = isNavItemActive(pathname, item);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`nav-link relative inline-block font-sans text-[15px] text-ink lg:text-[18px] ${
                    isActive ? "font-medium" : "font-normal"
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="absolute -bottom-1 left-0 h-[2px] w-full bg-ember"
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </MotionReveal>
  );
}
```

The `room` branch (from the JSDoc comment above `Nav` through the closing `MotionReveal`) is byte-for-byte identical to the original file, including its original multi-line formatting — confirming `RoomHeader.tsx`'s untouched call site renders exactly what it did before. Only the new `variant` prop, the `motion`/timing-constant imports, and the new `if (variant === "landing")` branch above it are additions.

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm test -- src/components/Nav.test.tsx`
Expected: PASS (3 tests)

- [ ] **Step 5: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 6: Commit**

```bash
git add src/components/Nav.tsx src/components/Nav.test.tsx
git commit -m "$(cat <<'EOF'
feat: add Nav landing variant (bracketed doors, Framer Motion hover)

Default variant is byte-identical to today's rendering -- RoomHeader's
untouched call site is unaffected. The landing page (wired in a later
task) opts in explicitly with variant="landing".
EOF
)"
```

---

### Task 6: `Wordmark` hero-variant restyle

**Context:** `Wordmark.tsx` already has a `variant` prop (`"hero"` default, `"room"` explicitly passed by `RoomHeader`) — unlike Nav, this one's existing convention is safe to build on directly, since `RoomHeader` already opts out. Only the `"hero"` variant gets the Windswept treatment (General Sans, `--ws-ink`, the `WindBlurReveal` entrance from Task 4); `"room"` stays untouched.

**Files:**
- Modify: `src/components/Wordmark.tsx`
- Create: `src/components/Wordmark.test.tsx` (first test file for this component)

- [ ] **Step 1: Write the failing tests**

Create `src/components/Wordmark.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Wordmark from "./Wordmark";

describe("Wordmark hero variant (default)", () => {
  it("renders as an h1 in the display font and ws-ink color", () => {
    render(<Wordmark />);
    const heading = screen.getByRole("heading", { level: 1 });
    const mark = heading.querySelector("span");
    expect(mark).toHaveClass("font-display");
    expect(mark).toHaveClass("text-ws-ink");
    expect(mark).not.toHaveClass("font-sans");
  });

  it("uses WindBlurReveal for its entrance, not MotionReveal", () => {
    // This is the component's actual functional change in this task --
    // assert on WindBlurReveal's own DOM signature (the SVG directional-
    // blur filter it renders) rather than just the inner span's classes,
    // so a regression to MotionReveal (or no reveal wrapper at all)
    // would actually fail this test.
    const { container } = render(<Wordmark />);
    expect(container.querySelector("filter#wind-blur")).toBeInTheDocument();
  });
});

describe("Wordmark room variant", () => {
  it("keeps the existing font-sans/text-ink rendering, wrapped in a link, no h1", () => {
    render(<Wordmark variant="room" />);
    expect(screen.queryByRole("heading", { level: 1 })).not.toBeInTheDocument();
    const link = screen.getByRole("link");
    const mark = link.querySelector("span");
    expect(mark).toHaveClass("font-sans");
    expect(mark).toHaveClass("text-ink");
    expect(mark).not.toHaveClass("font-display");
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test -- src/components/Wordmark.test.tsx`
Expected: FAIL — hero variant still renders `font-sans`/`text-ink`, not `font-display`/`text-ws-ink`.

- [ ] **Step 3: Write the implementation**

Current `src/components/Wordmark.tsx` (verify against the real file first):

```tsx
import Link from "next/link";
import { studio } from "@/data/studio";
import { delay, duration } from "@/lib/motion";
import MotionReveal from "./MotionReveal";

interface WordmarkProps {
  variant?: "hero" | "room";
}

export default function Wordmark({ variant = "hero" }: WordmarkProps) {
  const sizeClasses =
    variant === "hero"
      ? "text-[72px] md:text-[100px] lg:text-[clamp(140px,14vw,220px)]"
      : "text-[60px]";

  const mark = (
    <span
      className={`font-sans font-bold leading-[0.85] tracking-[-0.04em] text-ink ${sizeClasses}`}
    >
      {studio.wordmark}
    </span>
  );

  return (
    <MotionReveal delay={delay.wordmark} duration={duration.reveal}>
      {variant === "hero" ? (
        <h1>{mark}</h1>
      ) : (
        <div role="banner">
          <Link href="/">{mark}</Link>
        </div>
      )}
    </MotionReveal>
  );
}
```

Replace with:

```tsx
import Link from "next/link";
import { studio } from "@/data/studio";
import { delay, duration } from "@/lib/motion";
import MotionReveal from "./MotionReveal";
import WindBlurReveal from "./WindBlurReveal";

interface WordmarkProps {
  /**
   * "hero" (default) is the full-size landing masthead mark, rendered as
   * an <h1>. "room" is the shrunk 60px mark used in RoomHeader, wrapped
   * in a link back to "/" instead — a page should have exactly one <h1>,
   * and that's the landing page's job, not every room's.
   */
  variant?: "hero" | "room";
}

/** The studio's mark. Mobile/tablet sizes are flat pixel values for the hero variant; desktop scales fluidly with viewport width. */
export default function Wordmark({ variant = "hero" }: WordmarkProps) {
  if (variant === "hero") {
    return (
      <WindBlurReveal delay={delay.wordmark} duration={duration.reveal}>
        <h1>
          <span className="font-display font-bold leading-[0.85] tracking-[-0.04em] text-ws-ink text-[72px] md:text-[100px] lg:text-[clamp(140px,14vw,220px)]">
            {studio.wordmark}
          </span>
        </h1>
      </WindBlurReveal>
    );
  }

  return (
    <MotionReveal delay={delay.wordmark} duration={duration.reveal}>
      <div role="banner">
        <Link href="/">
          <span className="font-sans font-bold leading-[0.85] tracking-[-0.04em] text-ink text-[60px]">
            {studio.wordmark}
          </span>
        </Link>
      </div>
    </MotionReveal>
  );
}
```

The `room` branch's original two doc comments (on `WordmarkProps.variant` and on `Wordmark` itself) are preserved verbatim above. Its JSX is restructured, not copied verbatim — the original computed a shared `mark` variable and a `variant === "hero" ? ... : ...` ternary; this version writes the `room` case out directly as its own `return`. The rendered DOM and class list are equivalent to the original (same elements, same classes, same values), which is what actually matters for "RoomHeader's call site is unaffected" — but the source text itself is not character-identical, only its output is. Only the `hero` branch's content actually changes in substance.

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm test -- src/components/Wordmark.test.tsx`
Expected: PASS (3 tests)

- [ ] **Step 5: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 6: Commit**

```bash
git add src/components/Wordmark.tsx src/components/Wordmark.test.tsx
git commit -m "$(cat <<'EOF'
feat: restyle Wordmark's hero variant for Windswept

General Sans + ws-ink, entrance switched to WindBlurReveal (the
directional-blur signature moment). The room variant (used by
RoomHeader on every room page) is untouched.
EOF
)"
```

---

### Task 7: `CornerMark` landing variant

**Context:** `CornerMark.tsx` is **not** landing-page-only — it's directly imported (not via `RoomHeader`) in every room page plus `not-found.tsx` and the landing page. Like `Nav`, it needs a `variant` prop where the default stays exactly today's rendering (bottom-left, all 5 fields: name©/EST year/location/availability/Clock). The new `"landing"` variant moves to the **bottom-right** corner (the identity block now occupies bottom-left, per Task 10) and shows only 3 fields — availability, location, live time — in the bracketed single-line register, dropping the studio name/founding-year fields since `Wordmark` already shows the name.

**Files:**
- Modify: `src/components/CornerMark.tsx`
- Create: `src/components/CornerMark.test.tsx` (first test file for this component)

- [ ] **Step 1: Write the failing tests**

Create `src/components/CornerMark.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import CornerMark from "./CornerMark";
import { studio } from "@/data/studio";

describe("CornerMark default (room) variant", () => {
  it("renders the full studio-info stack, positioned bottom-left", () => {
    const { container } = render(<CornerMark />);
    expect(screen.getByText(`${studio.fullName}©`, { exact: false })).toBeInTheDocument();
    expect(screen.getByText(`EST ${studio.established}`)).toBeInTheDocument();
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain("md:left-[var(--edge-margin)]");
  });
});

describe("CornerMark landing variant", () => {
  it("renders only availability/location/time, positioned bottom-right, no studio name", () => {
    const { container } = render(<CornerMark variant="landing" />);
    expect(screen.queryByText(`${studio.fullName}©`, { exact: false })).not.toBeInTheDocument();
    expect(screen.queryByText(`EST ${studio.established}`)).not.toBeInTheDocument();
    expect(screen.getByText(new RegExp(studio.availability, "i"))).toBeInTheDocument();
    expect(screen.getByText(studio.location)).toBeInTheDocument();
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain("md:right-[var(--edge-margin)]");
  });

  it("uses ws-accent for the indicator dot, not ember", () => {
    render(<CornerMark variant="landing" />);
    const dot = screen.getByText("•");
    expect(dot).toHaveClass("text-ws-accent");
    expect(dot).not.toHaveClass("text-ember");
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test -- src/components/CornerMark.test.tsx`
Expected: FAIL — `variant` prop doesn't exist yet.

- [ ] **Step 3: Write the implementation**

Current `src/components/CornerMark.tsx` (verify against the real file first):

```tsx
import { studio } from "@/data/studio";
import { delay, duration } from "@/lib/motion";
import Clock from "./Clock";
import MotionReveal from "./MotionReveal";

export default function CornerMark() {
  return (
    <div className="static px-[var(--edge-margin)] pb-[var(--edge-margin)] md:absolute md:bottom-[var(--edge-margin)] md:left-[var(--edge-margin)] md:px-0 md:pb-0">
      <MotionReveal delay={delay.cornerMark} duration={duration.reveal}>
        <aside
          aria-label="Studio information"
          className="flex flex-col gap-1 font-mono text-[10px] uppercase tracking-[0.08em] text-mist"
        >
          <p>
            <span
              aria-hidden="true"
              className="text-ember animate-[pulse-soft_2400ms_ease-in-out_infinite]"
            >
              •
            </span>{" "}
            {studio.fullName}©
          </p>
          <p>EST {studio.established}</p>
          <p>{studio.location}</p>
          <p>{studio.availability}</p>
          <Clock />
        </aside>
      </MotionReveal>
    </div>
  );
}
```

Replace with:

```tsx
"use client";

import { motion } from "framer-motion";
import { studio } from "@/data/studio";
import { delay, duration, delaySeconds, durationSeconds, windEasing } from "@/lib/motion";
import Clock from "./Clock";
import MotionReveal from "./MotionReveal";

interface CornerMarkProps {
  /**
   * "room" (default) is today's full studio-info stack, used on the
   * landing masthead and every room -- unchanged, since neither this
   * page's other callers pass a variant today. "landing" is the
   * Windswept treatment: repositioned to the opposite corner (the
   * identity block now occupies bottom-left), showing only
   * availability/location/time, since Wordmark already carries the
   * studio name elsewhere on the landing page.
   */
  variant?: "room" | "landing";
}

/**
 * Bottom-left studio info stack, present on the landing masthead and
 * every room. The leading ember dot pulses via the global `pulse-soft`
 * keyframe (disabled automatically under prefers-reduced-motion via the
 * global rule in globals.css).
 *
 * Positioning lives on this outer div, not on the element MotionReveal
 * wraps directly — see the comment in ThesisStatement.tsx for why: an
 * active `transform` on an ancestor (which MotionReveal always sets,
 * even at rest) makes that ancestor a containing block for absolutely-
 * positioned descendants regardless of its own `position` value.
 *
 * (This doc comment describes the room/default variant below, which is
 * unchanged from the original file. The landing variant, added in this
 * task, is a separate branch with its own positioning/motion approach.)
 */
export default function CornerMark({ variant = "room" }: CornerMarkProps) {
  if (variant === "landing") {
    return (
      <div className="static px-[var(--edge-margin)] pb-[var(--edge-margin)] md:absolute md:bottom-[var(--edge-margin)] md:right-[var(--edge-margin)] md:px-0 md:pb-0">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delaySeconds.cornerMark, duration: durationSeconds.reveal, ease: windEasing }}
        >
          <aside
            aria-label="Studio information"
            className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ws-ink"
          >
            <span
              aria-hidden="true"
              className="text-ws-accent animate-[pulse-soft_2400ms_ease-in-out_infinite]"
            >
              •
            </span>
            <span>( {studio.availability} )</span>
            <span aria-hidden="true">//</span>
            <span>{studio.location}</span>
            <span aria-hidden="true">//</span>
            <Clock />
          </aside>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="static px-[var(--edge-margin)] pb-[var(--edge-margin)] md:absolute md:bottom-[var(--edge-margin)] md:left-[var(--edge-margin)] md:px-0 md:pb-0">
      <MotionReveal delay={delay.cornerMark} duration={duration.reveal}>
        <aside
          aria-label="Studio information"
          className="flex flex-col gap-1 font-mono text-[10px] uppercase tracking-[0.08em] text-mist"
        >
          <p>
            <span
              aria-hidden="true"
              className="text-ember animate-[pulse-soft_2400ms_ease-in-out_infinite]"
            >
              •
            </span>{" "}
            {studio.fullName}©
          </p>
          <p>EST {studio.established}</p>
          <p>{studio.location}</p>
          <p>{studio.availability}</p>
          <Clock />
        </aside>
      </MotionReveal>
    </div>
  );
}
```

Note: this file gains `"use client"` (it didn't have one before) — required because the landing variant directly renders `<motion.div>` JSX. Since both variants now live in one client-boundary file, this converts the `"room"` variant from a server-renderable subtree to a client component on every page that renders `CornerMark` too (every room page via `RoomHeader`'s siblings, plus `not-found.tsx`, which imports `CornerMark` directly), not just the landing page — a small increase in client JS shipped everywhere, accepted here as the cost of keeping both variants in one file rather than splitting into two. Note also the positioning classes stay on the plain outer `<div>`, never on the `motion.div` itself — the same containing-block gotcha this file's own restored doc comment already warns about (an active `transform`, which `motion.div` always sets, makes an element a containing block for absolutely-positioned descendants).

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm test -- src/components/CornerMark.test.tsx`
Expected: PASS (3 tests)

- [ ] **Step 5: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 6: Commit**

```bash
git add src/components/CornerMark.tsx src/components/CornerMark.test.tsx
git commit -m "$(cat <<'EOF'
feat: add CornerMark landing variant

Default variant (used on the landing masthead today and every room)
stays exactly as it renders now. The new landing variant repositions
to bottom-right and shows only availability/location/time in the
bracketed register, since Wordmark already carries the studio name.
EOF
)"
```

---

## Chunk 3: Landing-only components + page composition + verification

### Task 8: `Standfirst` restyle

**Context:** `Standfirst.tsx` is genuinely landing-page-only (confirmed: only referenced in `page.tsx`), so it's safe to restyle in place. Per the design spec, its **typography stays untouched** (Inter Tight/`font-sans`, current size) — it's a supporting line, not a structural header, so it doesn't get General Sans. Only its color changes (to `--ws-ink`, for consistency with the rest of the composed identity block) and its entrance switches from `MotionReveal` to Framer Motion, per the landing-variant motion convention.

**Files:**
- Modify: `src/components/Standfirst.tsx`
- Create: `src/components/Standfirst.test.tsx` (first test file for this component)

- [ ] **Step 1: Write the failing test**

Create `src/components/Standfirst.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Standfirst from "./Standfirst";
import { studio } from "@/data/studio";

describe("Standfirst", () => {
  it("renders the standfirst copy in the existing sans font, ws-ink color", () => {
    render(<Standfirst />);
    const p = screen.getByText(studio.standfirst);
    expect(p).toHaveClass("font-sans");
    expect(p).toHaveClass("text-ws-ink");
    expect(p).not.toHaveClass("font-display");
    expect(p).not.toHaveClass("text-ink");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- src/components/Standfirst.test.tsx`
Expected: FAIL — still renders `text-ink`, not `text-ws-ink`.

- [ ] **Step 3: Write the implementation**

Current `src/components/Standfirst.tsx` (verify against the real file first):

```tsx
import { studio } from "@/data/studio";
import { delay, duration } from "@/lib/motion";
import MotionReveal from "./MotionReveal";

export default function Standfirst() {
  return (
    <MotionReveal delay={delay.standfirst} duration={duration.reveal}>
      <p className="mt-10 max-w-[380px] font-sans text-[14px] leading-[1.5] text-ink">
        {studio.standfirst}
      </p>
    </MotionReveal>
  );
}
```

Replace with:

```tsx
"use client";

import { motion } from "framer-motion";
import { studio } from "@/data/studio";
import { delaySeconds, durationSeconds, windEasing } from "@/lib/motion";

/**
 * Short supporting line beneath Wordmark in the landing page's composed
 * identity block. Typography intentionally stays the project's existing
 * sans (Inter Tight) rather than General Sans -- only structural headers
 * (the name, the thesis) get the display treatment.
 */
export default function Standfirst() {
  return (
    <motion.p
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delaySeconds.standfirst, duration: durationSeconds.reveal, ease: windEasing }}
      className="mt-2 max-w-[380px] font-sans text-[14px] leading-[1.5] text-ws-ink"
    >
      {studio.standfirst}
    </motion.p>
  );
}
```

Note: `mt-10` → `mt-2` — a starting-point tightening now that this component sits inside Task 10's single corner-anchored identity block (Wordmark + Standfirst + ThesisStatement stacked together) rather than in its own separately-spaced position; `mt-10`'s original spacing was tuned for a different layout context. This is not based on any change to Wordmark's own size (Task 6 changes Wordmark's font/color/entrance only, not its size classes). Re-check this value during Task 11's browser verification and adjust if it looks wrong.

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- src/components/Standfirst.test.tsx`
Expected: PASS (1 test)

- [ ] **Step 5: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 6: Commit**

```bash
git add src/components/Standfirst.tsx src/components/Standfirst.test.tsx
git commit -m "feat: restyle Standfirst for Windswept (color + Framer Motion entrance)"
```

---

### Task 9: `ThesisStatement` restyle

**Context:** `ThesisStatement.tsx` is genuinely landing-page-only. Its doc comment currently claims it's "present on the landing masthead and every room," which is **false** (confirmed: only referenced in `page.tsx`) — fix this while touching the file. It also currently self-positions absolutely bottom-right; under the new composition it's nested inside the identity block (Task 10 places that whole block), so drop the positioning wrapper entirely.

**Files:**
- Modify: `src/components/ThesisStatement.tsx`
- Create: `src/components/ThesisStatement.test.tsx` (first test file for this component)

- [ ] **Step 1: Write the failing test**

Create `src/components/ThesisStatement.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ThesisStatement from "./ThesisStatement";
import { studio } from "@/data/studio";

describe("ThesisStatement", () => {
  it("renders the thesis copy in the display font, ws-ink color", () => {
    render(<ThesisStatement />);
    const p = screen.getByText(studio.thesis);
    expect(p).toHaveClass("font-display");
    expect(p).toHaveClass("text-ws-ink");
    expect(p).not.toHaveClass("text-ink");
  });

  it("no longer self-positions absolutely (nested in the identity block instead)", () => {
    const { container } = render(<ThesisStatement />);
    expect(container.innerHTML).not.toContain("md:absolute");
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test -- src/components/ThesisStatement.test.tsx`
Expected: FAIL — still renders `font-bold` sans classes and `text-ink`, still wrapped in an absolutely-positioned div.

- [ ] **Step 3: Write the implementation**

Current `src/components/ThesisStatement.tsx` (verify against the real file first):

```tsx
import { studio } from "@/data/studio";
import { delay, duration } from "@/lib/motion";
import MotionReveal from "./MotionReveal";

/**
 * Bottom-right statement, present on the landing masthead and every
 * room. Absolutely positioned within the poster canvas on tablet/desktop;
 * falls back to normal document flow on mobile.
 *
 * Positioning lives on this outer div, not on the element MotionReveal
 * wraps directly — MotionReveal sets an inline `transform` on its own
 * wrapper, and CSS makes *any* element with an active transform (even
 * translateY(0)) a containing block for absolutely-positioned
 * descendants, regardless of that element's own `position` value. Put
 * `absolute` on the same node MotionReveal wraps and it positions itself
 * relative to MotionReveal's zero-height wrapper instead of <main>.
 */
export default function ThesisStatement() {
  return (
    <div className="static px-[var(--edge-margin)] pb-8 md:absolute md:bottom-[var(--edge-margin)] md:right-[var(--edge-margin)] md:max-w-[55vw] md:px-0 md:pb-0">
      <MotionReveal delay={delay.thesis} duration={duration.reveal}>
        <p className="thesis text-[24px] font-bold leading-[1] tracking-[-0.03em] text-ink md:text-[32px] lg:text-[clamp(36px,4vw,60px)]">
          {studio.thesis}
        </p>
      </MotionReveal>
    </div>
  );
}
```

Replace with:

```tsx
"use client";

import { motion } from "framer-motion";
import { studio } from "@/data/studio";
import { delaySeconds, durationSeconds, windEasing } from "@/lib/motion";

/**
 * The philosophy statement, nested inside the landing page's composed
 * identity block (alongside Wordmark and Standfirst) -- landing-page-only,
 * not used by any room. Positioning is handled by the parent block
 * (see page.tsx), not by this component itself.
 */
export default function ThesisStatement() {
  return (
    <motion.p
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delaySeconds.thesis, duration: durationSeconds.reveal, ease: windEasing }}
      className="thesis mt-6 font-display text-[24px] font-bold leading-[1] tracking-[-0.03em] text-ws-ink md:text-[32px] lg:text-[clamp(36px,4vw,60px)]"
    >
      {studio.thesis}
    </motion.p>
  );
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm test -- src/components/ThesisStatement.test.tsx`
Expected: PASS (2 tests)

- [ ] **Step 5: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 6: Commit**

```bash
git add src/components/ThesisStatement.tsx src/components/ThesisStatement.test.tsx
git commit -m "$(cat <<'EOF'
feat: restyle ThesisStatement for Windswept, fix stale doc comment

Now nested in the landing page's composed identity block instead of
self-positioning -- drops its own absolute-positioning wrapper. Also
corrects the doc comment's false claim that this component is used on
every room (confirmed: only page.tsx references it).
EOF
)"
```

---

### Task 10: Rewrite `page.tsx`

**Context:** Compose the three corner-anchored zones using this project's established absolute-corner-anchor technique (matching how `ThesisStatement`/`CornerMark` have always positioned themselves) rather than a literal CSS Grid: Nav's landing variant top-right, the identity block (`Wordmark` + `Standfirst` + `ThesisStatement`) bottom-left, `CornerMark`'s landing variant bottom-right (self-positioning, needs no wrapper from this file). Wrap everything in `<MotionConfig reducedMotion="user">` so the new Framer-Motion-driven components (`Nav` landing, `CornerMark` landing, `Standfirst`, `ThesisStatement`) get real reduced-motion handling — the project's existing global CSS rule only reaches `MotionReveal`/`WindBlurReveal`, not Framer Motion.

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Rewrite the page**

Current `src/app/page.tsx` (verify against the real file first — confirm it still has no `HomeTimeline` import, since a prior direction that wired one in was since reverted):

```tsx
import { studio } from "@/data/studio";
import Wordmark from "@/components/Wordmark";
import Nav from "@/components/Nav";
import Standfirst from "@/components/Standfirst";
import ThesisStatement from "@/components/ThesisStatement";
import CornerMark from "@/components/CornerMark";

export default function Landing() {
  return (
    <main className="relative min-h-screen w-full bg-paper font-sans md:h-screen md:overflow-hidden">
      <div className="static flex flex-col items-start gap-8 px-[var(--edge-margin)] pt-[var(--edge-margin)] md:absolute md:inset-x-0 md:top-0 md:z-10 md:flex-row md:items-start md:justify-between md:gap-0 md:px-[var(--edge-margin)] md:pt-[var(--edge-margin)]">
        <div>
          <Wordmark />
          <Standfirst />
        </div>
        <Nav items={studio.navItems} />
      </div>

      <ThesisStatement />
      <CornerMark />
    </main>
  );
}
```

Replace with:

```tsx
import { MotionConfig } from "framer-motion";
import { studio } from "@/data/studio";
import Wordmark from "@/components/Wordmark";
import Nav from "@/components/Nav";
import Standfirst from "@/components/Standfirst";
import ThesisStatement from "@/components/ThesisStatement";
import CornerMark from "@/components/CornerMark";

/**
 * Windswept landing page -- a locked, zero-scroll identity page, no
 * work content. Three corner-anchored zones, using this project's
 * established absolute-corner-anchor technique (the same pattern
 * ThesisStatement/CornerMark have always used) rather than a literal
 * CSS Grid: nav "doors" top-right, the composed identity block
 * (Wordmark + Standfirst + ThesisStatement) bottom-left, CornerMark's
 * landing variant bottom-right (self-positioning). Everything else is
 * intentional empty space.
 *
 * <MotionConfig reducedMotion="user"> gives the new Framer-Motion-driven
 * components (Nav landing variant, CornerMark landing variant,
 * Standfirst, ThesisStatement) real prefers-reduced-motion handling --
 * the project's existing global CSS rule only reaches MotionReveal/
 * WindBlurReveal (both CSS-transition-driven), not Framer Motion.
 */
export default function Landing() {
  return (
    <MotionConfig reducedMotion="user">
      <main className="relative min-h-screen w-full bg-ws-paper font-sans md:h-screen md:overflow-hidden">
        <div className="static flex justify-end px-[var(--edge-margin)] pt-[var(--edge-margin)] md:absolute md:top-0 md:right-0 md:px-[var(--edge-margin)] md:pt-[var(--edge-margin)]">
          <Nav items={studio.navItems} variant="landing" />
        </div>

        <div className="static px-[var(--edge-margin)] pb-8 md:absolute md:bottom-[var(--edge-margin)] md:left-[var(--edge-margin)] md:max-w-[55vw] md:px-0 md:pb-0">
          <Wordmark />
          <Standfirst />
          <ThesisStatement />
        </div>

        <CornerMark variant="landing" />
      </main>
    </MotionConfig>
  );
}
```

- [ ] **Step 2: Typecheck and build**

Run: `npx tsc --noEmit`
Expected: no errors

Run: `npm run build`
Expected: success

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "$(cat <<'EOF'
feat: rewrite landing page as the Windswept identity layout

Three corner-anchored zones (nav doors top-right, identity block
bottom-left, studio info bottom-right), MotionConfig wrapper for real
reduced-motion handling on the new Framer-Motion components.
EOF
)"
```

---

### Task 11: Full verification pass

**Context:** This is the task where exact spacing/positioning gets tuned against the real browser, matching this project's established measure-then-adjust methodology (used for the homepage timeline's height budget previously). It's also the critical regression gate: five shared components changed in this plan, and the entire point of the `variant` design was that Archive/References/Info must be provably unaffected — this task is where that gets checked against the real running site, not just reasoned about.

**Files:** none (verification and iterative tuning only — but re-open Tasks 5/7/9/10 if tuning requires touching their sizing/spacing values, and re-run their tests/typecheck after any such change)

- [ ] **Step 1: Run the full test suite**

Run: `npm test`
Expected: all tests pass, including every new test file from this plan (`motion.test.ts`, `WindBlurReveal.test.tsx`, `Nav.test.tsx`, `Wordmark.test.tsx`, `CornerMark.test.tsx`, `Standfirst.test.tsx`, `ThesisStatement.test.tsx`) plus every pre-existing test file.

- [ ] **Step 2: Typecheck and build**

Run: `npx tsc --noEmit` — expect no errors.
Run: `npm run build` — expect success, `/` listed as a static route.

- [ ] **Step 3: Critical regression check — every other room is genuinely unaffected**

Start the dev server (`npm run dev`, background, or use an already-running one). Using a Playwright script (this repo's established ad-hoc verification method):

- Screenshot `/archive`, `/references`, `/info`, `/works/placeholder-i` (or whichever `works/[slug]` static params currently exist) at 1440×900 and 375×812.
- Confirm each room's Nav renders the **old** plain-text style (no brackets, `bg-ember` underline on the active item, not `bg-ws-accent`).
- Confirm each room's `CornerMark` (rendered via `RoomHeader` or directly) still shows the full 5-field stack (studio name©, EST year, location, availability, Clock), bottom-left, in the `--mist`/`--ember` palette — not the new 3-field bracketed bottom-right version.
- Confirm none of these pages render any element with the `text-ws-ink`, `bg-ws-paper`, `bg-ws-accent`, or `font-display` Tailwind classes (grep the rendered HTML for these class names — checking for the mere *presence* of the underlying `--ws-*` CSS custom properties isn't a meaningful test, since they're declared on the shared `:root` block in Task 2 and so cascade to every element on every page regardless of whether anything actually uses them).

If ANY of these checks fail, that's a real regression from this plan's variant work — stop and fix it before proceeding; do not treat it as acceptable collateral.

- [ ] **Step 4: Landing page composition — measure and tune**

At 1440×900, 1280×720 (a tighter case), 900-wide (tablet), and 375-wide (mobile):

- Confirm no vertical scroll on desktop/tablet (`document.documentElement.scrollHeight === clientHeight`), no horizontal overflow anywhere (`scrollWidth === clientWidth`).
- Confirm the three zones (nav top-right, identity block bottom-left, corner-mark bottom-right) don't overlap each other or the top masthead area.
- Confirm the identity block's internal spacing (`Standfirst`'s `mt-2`, `ThesisStatement`'s `mt-6`, flagged in Tasks 8/9 as values to re-check) looks intentional, not cramped or excessive, given Wordmark's actual rendered size.
- If any collision or awkward spacing is found, adjust the specific spacing/position values in `page.tsx`, `Standfirst.tsx`, or `ThesisStatement.tsx` — re-run each file's own tests and `npx tsc --noEmit` after any change — and re-measure. Iterate until clean.

- [ ] **Step 5: Font and motion sanity checks**

- Confirm `Wordmark` and `ThesisStatement` visually render in General Sans (not falling back to the `sans-serif` generic in the `font-display` stack — a fallback would indicate the font files didn't load, worth investigating immediately since Task 1 already verified them at build time).
- Confirm `Wordmark`'s entrance shows the directional blur-to-sharp effect on load (refresh and watch, or inspect the DOM immediately after mount to catch the `filter: url(#wind-blur)` state before it resolves).
- Confirm Nav door hover produces the horizontal drift.
- With `page.emulateMedia({ reducedMotion: 'reduce' })` (or OS-level reduced motion), confirm: `Wordmark`'s blur/drift entrance is disabled (inherits this for free via the global CSS rule), and the Framer-Motion-driven components (`Nav` landing hover-drift, `CornerMark`/`Standfirst`/`ThesisStatement` entrances) are also disabled — this is the real test of `MotionConfig reducedMotion="user"` actually working, not just being present in the code.

- [ ] **Step 6: Accessibility spot-check**

- Tab through the landing page keyboard-only; confirm every interactive element (the 4 nav doors) gets a visible focus ring per the global `:focus-visible` rule.
- Confirm `Wordmark`'s `<h1>` is still the page's only `<h1>` (unchanged structurally from before this plan).

- [ ] **Step 7: Final commit (if any tuning was needed)**

If Steps 4-5 required spacing/value adjustments, commit them now with a clear message referencing what was tuned and why. If everything already passed cleanly, there's nothing to commit here.
