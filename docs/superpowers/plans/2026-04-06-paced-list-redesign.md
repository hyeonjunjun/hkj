# The Paced List — Full Redesign Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild HKJ Studio as a minimalist editorial portfolio with atmospheric depth (WuWa-inspired), Framer Motion interactions, custom cursor, ambient particles, and geometric frame system.

**Architecture:** Vertical-scroll editorial homepage with alternating asymmetric project sections. Shared Framer Motion `layoutId` transitions to detail pages. Canvas-based ambient particle layer. Custom cursor overlay with spring physics. Lenis smooth scroll across all pages.

**Tech Stack:** Next.js App Router, Tailwind CSS, Framer Motion, Lenis, Canvas API, inline SVG

**Spec:** `docs/superpowers/specs/2026-04-06-paced-list-redesign.md`

---

## Chunk 1: Foundation — Cleanup, Tokens, Tailwind Config, Lenis

### Task 1: Remove deprecated components and files

**Files:**
- Delete: `src/components/TransitionContext.tsx`
- Delete: `src/components/TransitionLink.tsx`
- Delete: `src/components/PageShell.tsx`
- Delete: `src/components/ViewToggle.tsx`
- Delete: `src/components/ScrollProgress.tsx`
- Delete: `src/lib/gsap.ts`
- Delete: `src/app/work/page.tsx`
- Delete: `src/app/work/[slug]/page.tsx`
- Delete: `src/app/lab/page.tsx`
- Delete: `src/app/lab/[slug]/page.tsx`

- [ ] **Step 1: Delete old components**

```bash
rm src/components/TransitionContext.tsx
rm src/components/TransitionLink.tsx
rm src/components/PageShell.tsx
rm src/components/ViewToggle.tsx
rm src/components/ScrollProgress.tsx
rm src/lib/gsap.ts
```

- [ ] **Step 2: Delete old route files**

```bash
rm -rf src/app/work
rm -rf src/app/lab
```

- [ ] **Step 3: Commit cleanup**

```bash
git add -A
git commit -m "chore: remove deprecated components and old routes for redesign"
```

### Task 2: Rebuild globals.css — color tokens, resets, base styles

**Files:**
- Rewrite: `src/app/globals.css`

The entire globals.css is gutted and rebuilt. Keep only: Tailwind import, CSS custom properties (new color tokens), resets, scrollbar hiding, skip-to-content, reduced motion, and a small set of custom utility classes for the geometric frame and particle canvas.

- [ ] **Step 1: Write new globals.css**

```css
@import "tailwindcss";

/* ═══ COLOR SYSTEM — Dark-first ═══ */

:root {
  --bg: #0a0a0b;
  --bg-elevated: #111113;
  --fg: rgba(240, 238, 232, 0.88);
  --fg-2: rgba(240, 238, 232, 0.50);
  --fg-3: rgba(240, 238, 232, 0.20);
  --fg-4: rgba(240, 238, 232, 0.08);

  /* Gradient accent stops — use in linear-gradient() */
  --accent-warm-1: #c8a455;
  --accent-warm-2: #d4a04a;
  --accent-warm-3: #e8c08a;
  --accent-cool-1: #4a8a8c;
  --accent-cool-2: #3d6e8a;
  --accent-cool-3: #2a4a6e;

  --font-body: var(--font-sans), system-ui, sans-serif;
  --font-mono: var(--font-fragment), "SF Mono", monospace;
  --font-display: var(--font-serif), Georgia, serif;
  --ease: cubic-bezier(0.16, 1, 0.3, 1);
}

html.light {
  --bg: #f5f3ee;
  --bg-elevated: #eceae4;
  --fg: rgba(20, 18, 15, 0.82);
  --fg-2: rgba(20, 18, 15, 0.50);
  --fg-3: rgba(20, 18, 15, 0.20);
  --fg-4: rgba(20, 18, 15, 0.08);
}

/* ═══ RESETS ═══ */

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { -webkit-text-size-adjust: 100%; }
*::-webkit-scrollbar { display: none; }
* { scrollbar-width: none; }

body {
  background: var(--bg);
  color: var(--fg);
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 400;
  line-height: 1.5;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

::selection { background: var(--fg-4); }
:focus-visible { outline: 1px solid var(--fg-3); outline-offset: 3px; }

/* ═══ SKIP TO CONTENT ═══ */

.skip-to-content {
  position: absolute; top: -100px; left: 24px;
  z-index: 999; padding: 8px 16px;
  background: var(--fg); color: var(--bg);
  font: 500 10px/1 var(--font-mono);
  letter-spacing: 0.04em;
  text-decoration: none;
  transition: top 0.3s var(--ease);
}
.skip-to-content:focus { top: 8px; }

/* ═══ PARTICLE CANVAS ═══ */

.particle-canvas {
  position: fixed;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}

/* ═══ CUSTOM CURSOR ═══ */

.cursor-overlay {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  pointer-events: none;
  mix-blend-mode: difference;
}

/* Hide native cursor on desktop */
@media (hover: hover) and (pointer: fine) {
  html { cursor: none; }
  a, button, [role="button"] { cursor: none; }
}

/* ═══ GEOMETRIC FRAME ═══ */

.geo-frame {
  position: relative;
}

.geo-frame svg {
  position: absolute;
  inset: -1px;
  width: calc(100% + 2px);
  height: calc(100% + 2px);
  pointer-events: none;
}

/* ═══ REDUCED MOTION ═══ */

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    animation-delay: 0ms !important;
  }
}
```

- [ ] **Step 2: Verify the file compiles**

```bash
cd c:/Users/Ryan Jun/.gemini/antigravity/scratch/hkjstudio && npx next build 2>&1 | head -30
```

Note: Build will fail due to missing components (removed in Task 1). That's expected — we're building incrementally. Just verify no CSS syntax errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "style: rebuild globals.css with new color tokens and minimal resets"
```

### Task 3: Update Tailwind config

**Files:**
- Modify: `tailwind.config.ts`

Update the Tailwind config to define custom colors from CSS variables, font families, and the ease timing function.

- [ ] **Step 1: Rewrite tailwind.config.ts**

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        "bg-elevated": "var(--bg-elevated)",
        fg: "var(--fg)",
        "fg-2": "var(--fg-2)",
        "fg-3": "var(--fg-3)",
        "fg-4": "var(--fg-4)",
        "accent-warm-1": "var(--accent-warm-1)",
        "accent-warm-2": "var(--accent-warm-2)",
        "accent-warm-3": "var(--accent-warm-3)",
        "accent-cool-1": "var(--accent-cool-1)",
        "accent-cool-2": "var(--accent-cool-2)",
        "accent-cool-3": "var(--accent-cool-3)",
      },
      fontFamily: {
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
        display: ["var(--font-display)"],
      },
      transitionTimingFunction: {
        ease: "var(--ease)",
      },
      screens: {
        mobile: { max: "768px" },
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 2: Commit**

```bash
git add tailwind.config.ts
git commit -m "config: update Tailwind with new color tokens, fonts, and timing"
```

### Task 4: Update next.config.ts — add redirects

**Files:**
- Modify: `next.config.ts`

Add redirect rules for old `/work` and `/lab` routes to new `/index` and `/archive` routes.

- [ ] **Step 1: Add new redirects to next.config.ts**

Add these to the existing `redirects()` array:

```ts
{ source: "/work", destination: "/index", permanent: true },
{ source: "/work/:slug", destination: "/index/:slug", permanent: true },
{ source: "/lab", destination: "/archive", permanent: true },
{ source: "/lab/:slug", destination: "/archive/:slug", permanent: true },
```

- [ ] **Step 2: Commit**

```bash
git add next.config.ts
git commit -m "config: add redirects from /work and /lab to /index and /archive"
```

### Task 5: Update layout.tsx — remove PageShell, add Lenis + AnimatePresence

**Files:**
- Modify: `src/app/layout.tsx`

Remove `PageShell` wrapper and `TransitionLink`. Add Lenis smooth scroll provider. The layout renders all global components: RouteAnnouncer, ParticleCanvas, Cursor, Nav, skip-to-content link, and children. These are NOT duplicated in individual pages. Lenis is initialized in a client component wrapper.

- [ ] **Step 1: Create Lenis provider component**

Create: `src/components/SmoothScroll.tsx`

```tsx
"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  return <>{children}</>;
}
```

- [ ] **Step 2: Update layout.tsx**

Replace the `PageShell` import and usage. Remove `TransitionLink`. Add `SmoothScroll` wrapper.

```tsx
import type { Metadata } from "next";
import localFont from "next/font/local";
import { DM_Serif_Display } from "next/font/google";
import "./globals.css";
import RouteAnnouncer from "@/components/RouteAnnouncer";
import SmoothScroll from "@/components/SmoothScroll";
import ParticleCanvas from "@/components/ParticleCanvas";
import Cursor from "@/components/Cursor";
import Nav from "@/components/Nav";

const generalSans = localFont({
  src: "../fonts/general-sans/GeneralSans-Variable.woff2",
  variable: "--font-sans",
  weight: "200 700",
  display: "swap",
  preload: true,
});

const fragmentMono = localFont({
  src: "../fonts/fragment-mono/FragmentMono-Regular.woff2",
  variable: "--font-fragment",
  weight: "400",
  display: "swap",
  preload: true,
});

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://hkjstudio.com"),
  title: { default: "HKJ", template: "%s — HKJ" },
  description:
    "Design engineering at the intersection of craft and systems thinking.",
  openGraph: {
    title: "HKJ",
    description:
      "Design engineering at the intersection of craft and systems thinking.",
    url: "https://hkjstudio.com",
    siteName: "HKJ",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HKJ",
    description:
      "Design engineering at the intersection of craft and systems thinking.",
    creator: "@hyeonjunjun",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{if(localStorage.getItem("theme")==="light"){document.documentElement.classList.add("light")}}catch(e){}})()`,
          }}
        />
      </head>
      <body
        className={`${generalSans.variable} ${fragmentMono.variable} ${dmSerif.variable}`}
      >
        <RouteAnnouncer />
        <ParticleCanvas />
        <Cursor />
        <Nav />
        <SmoothScroll>
          <a href="#main" className="skip-to-content">
            Skip to content
          </a>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/SmoothScroll.tsx src/app/layout.tsx
git commit -m "feat: rebuild layout with Lenis, ParticleCanvas, Cursor, and Nav"
```

### Task 6: Rebuild Nav component

**Files:**
- Rewrite: `src/components/Nav.tsx`

New nav: "HKJ" mark left, links right (Index, Archive, About, ThemeToggle). Uses Framer Motion for active indicator. Uses Next.js `Link` directly (no TransitionLink). Fragment Mono for all text.

- [ ] **Step 1: Write new Nav.tsx**

```tsx
"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import ThemeToggle from "./ThemeToggle";

const NAV_LINKS = [
  { href: "/index", label: "Index" },
  { href: "/archive", label: "Archive" },
  { href: "/about", label: "About" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-[clamp(24px,6vw,48px)] h-12 bg-bg/80 backdrop-blur-sm border-b border-fg-4">
      <Link
        href="/"
        className="font-mono text-[13px] tracking-[0.01em] text-fg no-underline hover:opacity-70 transition-opacity duration-300"
      >
        HKJ
      </Link>

      <div className="flex items-center gap-5">
        {NAV_LINKS.map((link) => {
          const isActive =
            pathname === link.href || pathname.startsWith(link.href + "/");
          return (
            <Link
              key={link.href}
              href={link.href}
              className="relative font-mono text-[10px] uppercase tracking-[0.06em] no-underline transition-colors duration-300"
              style={{ color: isActive ? "var(--fg)" : "var(--fg-3)" }}
            >
              {link.label}
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -bottom-1 left-0 right-0 h-px"
                  style={{
                    background:
                      "linear-gradient(90deg, var(--accent-warm-1), var(--accent-warm-2))",
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
        <ThemeToggle />
      </div>
    </nav>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Nav.tsx
git commit -m "feat: rebuild Nav with Framer Motion active indicator and new routes"
```

---

## Chunk 2: Core Components — Geometric Frame, Particles, Cursor

### Task 7: Build GeometricFrame component

**Files:**
- Create: `src/components/GeometricFrame.tsx`

SVG-based frame with corner accents. Framer Motion `motion.path` for draw-on animation. Accepts `variant` prop for different contexts (homepage, thumbnail, hero, portrait). Hover glow effect via warm gradient.

- [ ] **Step 1: Write GeometricFrame.tsx**

```tsx
"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface GeometricFrameProps {
  variant?: "default" | "thumbnail" | "hero" | "portrait";
  accentGradient?: "warm" | "cool";
  children: React.ReactNode;
  className?: string;
  layoutId?: string;
}

const CORNER_SIZE = 8;

export default function GeometricFrame({
  variant = "default",
  accentGradient = "warm",
  children,
  className = "",
  layoutId,
}: GeometricFrameProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const gradientId = `frame-glow-${accentGradient}`;
  const glowColor =
    accentGradient === "warm"
      ? "var(--accent-warm-1)"
      : "var(--accent-cool-1)";

  return (
    <motion.div
      ref={ref}
      className={`geo-frame relative ${className}`}
      layoutId={layoutId}
    >
      {children}
      <svg
        className="absolute inset-[-1px] w-[calc(100%+2px)] h-[calc(100%+2px)] pointer-events-none"
        preserveAspectRatio="none"
      >
        <defs>
          <radialGradient id={gradientId} cx="0" cy="0" r="1">
            <stop offset="0%" stopColor={glowColor} stopOpacity="0.4" />
            <stop offset="100%" stopColor={glowColor} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Main frame border — use viewBox-relative coords */}
        <motion.rect
          x="0.5%"
          y="0.5%"
          width="99%"
          height="99%"
          fill="none"
          stroke="var(--fg-3)"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Corner accent — top-left */}
        <motion.line
          x1="0"
          y1={CORNER_SIZE}
          x2="0"
          y2="0"
          stroke="var(--fg-2)"
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : {}}
          transition={{ duration: 0.3, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        />
        <motion.line
          x1="0"
          y1="0"
          x2={CORNER_SIZE}
          y2="0"
          stroke="var(--fg-2)"
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : {}}
          transition={{ duration: 0.3, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Glow dot — top-left corner, pulses once */}
        {variant !== "thumbnail" && (
          <motion.circle
            cx="0"
            cy="0"
            r="12"
            fill={`url(#${gradientId})`}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: [0, 1, 0] } : {}}
            transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
          />
        )}
      </svg>
    </motion.div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/GeometricFrame.tsx
git commit -m "feat: GeometricFrame component with SVG draw-on and corner glow"
```

### Task 8: Build ambient particle system

**Files:**
- Create: `src/components/ParticleCanvas.tsx`

Canvas-based particle system. ~30-50 particles drifting slowly. Warm gold and cool teal dots. Responds to cursor proximity. Respects `prefers-reduced-motion`. Runs on its own rAF loop.

- [ ] **Step 1: Write ParticleCanvas.tsx**

```tsx
"use client";

import { useEffect, useRef, useCallback } from "react";

interface ParticleCanvasProps {
  density?: "normal" | "dense";
  cursorResponsive?: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  opacity: number;
}

const WARM_COLORS = ["#c8a455", "#d4a04a", "#e8c08a"];
const COOL_COLORS = ["#4a8a8c", "#3d6e8a", "#2a4a6e"];

export default function ParticleCanvas({
  density = "normal",
  cursorResponsive = true,
}: ParticleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const rafRef = useRef<number>(0);

  const initParticles = useCallback(
    (width: number, height: number) => {
      const count = density === "dense" ? 50 : 35;
      const allColors = [...WARM_COLORS, ...COOL_COLORS];
      const particles: Particle[] = [];

      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.15,
          vy: -Math.random() * 0.1 - 0.02,
          radius: Math.random() * 1.5 + 0.5,
          color: allColors[Math.floor(Math.random() * allColors.length)],
          opacity: Math.random() * 0.03 + 0.02,
        });
      }
      return particles;
    },
    [density]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (particlesRef.current.length === 0) {
        particlesRef.current = initParticles(canvas.width, canvas.height);
      }
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    if (cursorResponsive) {
      window.addEventListener("pointermove", onMouseMove);
    }

    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particlesRef.current) {
        if (!prefersReduced) {
          p.x += p.vx;
          p.y += p.vy;

          // Cursor interaction
          if (cursorResponsive) {
            const dx = p.x - mouseRef.current.x;
            const dy = p.y - mouseRef.current.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 150) {
              const force = (150 - dist) / 150;
              p.vx += (dx / dist) * force * 0.01;
              p.vy += (dy / dist) * force * 0.01;
            }
          }

          // Dampen velocity
          p.vx *= 0.999;
          p.vy *= 0.999;

          // Wrap around edges
          if (p.x < 0) p.x = canvas.width;
          if (p.x > canvas.width) p.x = 0;
          if (p.y < 0) p.y = canvas.height;
          if (p.y > canvas.height) p.y = 0;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMouseMove);
    };
  }, [initParticles, cursorResponsive]);

  return <canvas ref={canvasRef} className="particle-canvas" />;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ParticleCanvas.tsx
git commit -m "feat: ambient particle canvas with cursor interaction and reduced motion"
```

### Task 9: Build custom cursor component

**Files:**
- Create: `src/components/Cursor.tsx`
- Create: `src/hooks/useCursorState.ts`

Geometric reticle cursor with spring physics. Multiple states: default, media-hover, link-hover, idle, fast-movement. Uses Framer Motion `useMotionValue` and `useSpring`.

- [ ] **Step 1: Write useCursorState.ts**

```ts
"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export type CursorState = "default" | "media" | "link" | "idle";

export function useCursorState() {
  const [state, setState] = useState<CursorState>("default");
  const [velocity, setVelocity] = useState(0);
  const lastPos = useRef({ x: 0, y: 0 });
  const idleTimer = useRef<ReturnType<typeof setTimeout>>();

  const resetIdle = useCallback(() => {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    if (state === "idle") setState("default");
    idleTimer.current = setTimeout(() => setState("idle"), 2000);
  }, [state]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      const v = Math.sqrt(dx * dx + dy * dy);
      setVelocity(v);
      lastPos.current = { x: e.clientX, y: e.clientY };
      resetIdle();
    };

    const onOver = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("[data-cursor='media']")) {
        setState("media");
      } else if (
        target.closest("a") ||
        target.closest("button") ||
        target.closest("[data-cursor='link']")
      ) {
        setState("link");
      } else {
        setState("default");
      }
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerover", onOver);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, [resetIdle]);

  return { state, velocity };
}
```

- [ ] **Step 2: Write Cursor.tsx**

```tsx
"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useCursorState } from "@/hooks/useCursorState";

const springConfig = { stiffness: 300, damping: 28, mass: 0.5 };

export default function Cursor() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);
  const { state, velocity } = useCursorState();
  const [isTouch, setIsTouch] = useState(true); // Default true to avoid flash

  useEffect(() => {
    setIsTouch(window.matchMedia("(hover: none)").matches);
  }, []);

  useEffect(() => {
    if (isTouch) return;

    const onMove = (e: PointerEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [mouseX, mouseY, isTouch]);

  if (isTouch) return null;

  const size = state === "media" ? 48 : state === "link" ? 8 : 20;
  const tickOpacity = state === "idle" ? 0.1 : state === "link" ? 0 : 0.4;
  const tickRotation = state === "idle" ? 45 : velocity > 10 ? velocity * 0.5 : 0;

  return (
    <motion.div
      className="cursor-overlay"
      style={{ x: springX, y: springY }}
    >
      <motion.svg
        width={80}
        height={80}
        viewBox="-40 -40 80 80"
        style={{ transform: "translate(-50%, -50%)" }}
      >
        {/* Main circle */}
        <motion.circle
          cx="0"
          cy="0"
          fill="none"
          stroke="var(--accent-cool-1)"
          strokeWidth="1"
          animate={{ r: size / 2, opacity: state === "idle" ? 0.2 : 0.5 }}
          transition={{ type: "spring", ...springConfig }}
        />

        {/* Tick marks at cardinal points */}
        <motion.g
          animate={{ rotate: tickRotation, opacity: tickOpacity }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        >
          {[0, 90, 180, 270].map((angle) => (
            <motion.line
              key={angle}
              x1="0"
              y1={-(size / 2 + 3)}
              x2="0"
              y2={-(size / 2 + 7)}
              stroke="var(--accent-cool-1)"
              strokeWidth="1"
              transform={`rotate(${angle})`}
              animate={{
                y1: -(size / 2 + 3),
                y2: -(size / 2 + 7),
              }}
              transition={{ type: "spring", ...springConfig }}
            />
          ))}
        </motion.g>

        {/* Warm glow on media hover */}
        {state === "media" && (
          <motion.circle
            cx="0"
            cy="0"
            r="24"
            fill="none"
            stroke="var(--accent-warm-1)"
            strokeWidth="0.5"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.3, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", ...springConfig }}
          />
        )}
      </motion.svg>
    </motion.div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useCursorState.ts src/components/Cursor.tsx
git commit -m "feat: custom geometric cursor with spring physics and state variants"
```

---

## Chunk 3: Homepage

### Task 10: Build homepage hero section

**Files:**
- Create: `src/components/HeroSection.tsx`

Above-the-fold: tagline in DM Serif Display with a faint radial gradient glow behind it. ~40vh spacing below nav.

- [ ] **Step 1: Write HeroSection.tsx**

```tsx
"use client";

import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="relative flex items-end min-h-[60vh] px-[clamp(24px,6vw,48px)] pb-[clamp(24px,4vh,48px)]">
      {/* Faint radial glow */}
      <div
        className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full opacity-[0.04] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse, var(--accent-warm-1), transparent 70%)",
        }}
      />

      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="font-display text-[clamp(28px,4vw,36px)] font-normal tracking-[-0.01em] leading-[1.2]"
        style={{ color: "var(--fg)" }}
      >
        Design engineering
      </motion.h1>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/HeroSection.tsx
git commit -m "feat: homepage hero section with tagline and radial glow"
```

### Task 11: Build ProjectSection component

**Files:**
- Create: `src/components/ProjectSection.tsx`

A single project section for the homepage. Alternating asymmetric layout. Media in GeometricFrame. Scroll-triggered staggered reveal via Framer Motion `whileInView`. Click navigates to detail page.

- [ ] **Step 1: Write ProjectSection.tsx**

```tsx
"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import GeometricFrame from "./GeometricFrame";
import type { Piece } from "@/constants/pieces";

interface ProjectSectionProps {
  piece: Piece;
  index: number;
}

const spring = { type: "spring" as const, stiffness: 120, damping: 20, mass: 0.8 };

export default function ProjectSection({ piece, index }: ProjectSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const isEven = index % 2 === 1;
  const detailPath =
    piece.type === "project"
      ? `/index/${piece.slug}`
      : `/archive/${piece.slug}`;

  return (
    <section
      ref={ref}
      className={`flex items-center gap-[clamp(24px,4vw,64px)] px-[clamp(24px,6vw,48px)] min-h-[60vh] ${
        isEven ? "flex-row-reverse" : "flex-row"
      } mobile:flex-col mobile:gap-8`}
    >
      {/* Media side — 60% */}
      <div className="w-[60%] mobile:w-full">
        <Link href={detailPath} data-cursor="media">
          <GeometricFrame
            layoutId={`frame-${piece.slug}`}
            accentGradient={piece.type === "project" ? "warm" : "cool"}
          >
            {piece.video ? (
              <motion.video
                src={piece.video}
                autoPlay
                muted
                loop
                playsInline
                className="w-full aspect-[16/10] object-cover block"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.3 }}
              />
            ) : piece.image ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Image
                  src={piece.image}
                  alt={piece.title}
                  width={1200}
                  height={750}
                  sizes="60vw"
                  className="w-full aspect-[16/10] object-cover block"
                  priority={index === 0}
                />
              </motion.div>
            ) : (
              <motion.div
                className="w-full aspect-[16/10] flex items-center justify-center"
                style={{ background: piece.cover.bg }}
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <span className="font-mono text-[11px] uppercase tracking-[0.06em] text-fg-3">
                  In progress
                </span>
              </motion.div>
            )}
          </GeometricFrame>
        </Link>
      </div>

      {/* Text side — 40% */}
      <div className="w-[40%] mobile:w-full">
        {/* Thin line that draws */}
        <motion.div
          className="h-px mb-4"
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          style={{ transformOrigin: isEven ? "right" : "left", background: "var(--fg-4)" }}
          transition={{ duration: 0.4, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        />

        <motion.h2
          className="font-display text-[clamp(22px,3vw,32px)] font-normal tracking-[-0.01em] leading-[1.2] mb-2"
          style={{ color: "var(--fg)" }}
          initial={{ opacity: 0, y: 14 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ ...spring, delay: 0.6 }}
        >
          <Link href={detailPath} className="no-underline" style={{ color: "inherit" }}>
            {piece.title}
          </Link>
        </motion.h2>

        <motion.p
          className="text-[13px] leading-[1.6] mb-3"
          style={{ color: "var(--fg-2)" }}
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ ...spring, delay: 0.7 }}
        >
          {piece.description}
        </motion.p>

        <motion.div
          className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.06em]"
          style={{ color: "var(--fg-3)" }}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.8 }}
        >
          <span>{piece.status === "wip" ? "WIP" : piece.year}</span>
          {piece.tags.slice(0, 2).map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ProjectSection.tsx
git commit -m "feat: ProjectSection with asymmetric layout, frame, and scroll reveal"
```

### Task 12: Assemble homepage

**Files:**
- Rewrite: `src/app/page.tsx`

Compose: Nav, ParticleCanvas, Cursor, HeroSection, ProjectSections (all pieces sorted by order), Footer.

- [ ] **Step 1: Write new page.tsx**

```tsx
import HeroSection from "@/components/HeroSection";
import ProjectSection from "@/components/ProjectSection";
import Footer from "@/components/Footer";
import { PIECES } from "@/constants/pieces";

const allPieces = [...PIECES].sort((a, b) => a.order - b.order);

// Note: Nav, ParticleCanvas, and Cursor are rendered in layout.tsx — do NOT duplicate here.

export default function Home() {
  return (
    <main id="main">

      <HeroSection />

      <div className="flex flex-col gap-[clamp(20vh,35vh,40vh)]">
        {allPieces.map((piece, i) => (
          <ProjectSection key={piece.slug} piece={piece} index={i} />
        ))}
      </div>

      <div className="px-[clamp(24px,6vw,48px)] mt-[20vh]">
        <Footer />
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Update Footer.tsx to use plain Link instead of TransitionLink**

Replace `TransitionLink` imports with Next.js `Link` in `src/components/Footer.tsx`.

- [ ] **Step 3: Build and verify homepage renders**

```bash
cd c:/Users/Ryan Jun/.gemini/antigravity/scratch/hkjstudio && npm run dev
```

Open `http://localhost:3000` and verify:
- Nav renders with HKJ mark and links
- Particles visible in background
- Custom cursor works on hover
- Hero tagline visible
- Project sections appear on scroll with staggered reveals
- Geometric frames draw on scroll entry
- Alternating left/right layout

- [ ] **Step 4: Commit**

```bash
git add src/app/page.tsx src/components/Footer.tsx
git commit -m "feat: assemble editorial homepage with paced project sections"
```

---

## Chunk 4: Index, Archive, and Detail Pages

### Task 13: Build Index page (/index)

**Files:**
- Create: `src/app/index/page.tsx`

Two-panel layout: project list left, preview panel right. Row hover updates preview.

- [ ] **Step 1: Write src/app/index/page.tsx**

```tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "@/components/Footer";
import GeometricFrame from "@/components/GeometricFrame";
import { PIECES } from "@/constants/pieces";

const projects = PIECES.filter((p) => p.type === "project").sort(
  (a, b) => a.order - b.order
);

// Note: Nav, ParticleCanvas, and Cursor are rendered in layout.tsx — do NOT duplicate here.

export default function IndexPage() {
  const [hoveredSlug, setHoveredSlug] = useState<string>(
    projects[0]?.slug ?? ""
  );
  const hoveredProject = projects.find((p) => p.slug === hoveredSlug) ?? projects[0];

  return (
    <main id="main" className="min-h-screen">

      <div className="pt-16 px-[clamp(24px,6vw,48px)]">
        <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-fg-3 block mb-8">
          Index
        </span>

        <div className="flex gap-12 mobile:flex-col">
          {/* Left: project list */}
          <div className="w-[65%] mobile:w-full">
            {projects.map((piece) => (
              <Link
                key={piece.slug}
                href={`/index/${piece.slug}`}
                className="group flex items-center gap-4 py-4 border-b border-fg-4 no-underline transition-colors duration-300"
                onMouseEnter={() => setHoveredSlug(piece.slug)}
                data-cursor="link"
              >
                {/* Thumbnail */}
                <div className="w-[120px] h-[90px] flex-shrink-0 overflow-hidden">
                  <GeometricFrame variant="thumbnail">
                    {piece.image ? (
                      <Image
                        src={piece.image}
                        alt={piece.title}
                        width={120}
                        height={90}
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                      />
                    ) : (
                      <div
                        className="w-full h-full"
                        style={{ background: piece.cover.bg }}
                      />
                    )}
                  </GeometricFrame>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <span className="font-body text-[15px] text-fg block truncate">
                    {piece.title}
                  </span>
                  <span className="text-[13px] text-fg-2 block truncate">
                    {piece.description}
                  </span>
                </div>

                {/* Year */}
                <span className="font-mono text-[11px] text-fg-3 tabular-nums flex-shrink-0">
                  {piece.status === "wip" ? "WIP" : piece.year}
                </span>
              </Link>
            ))}
          </div>

          {/* Right: preview panel */}
          <div className="w-[35%] sticky top-20 self-start mobile:hidden">
            <GeometricFrame>
              <AnimatePresence mode="wait">
                <motion.div
                  key={hoveredProject?.slug}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  {hoveredProject?.video ? (
                    <video
                      src={hoveredProject.video}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="w-full aspect-[4/3] object-cover"
                    />
                  ) : hoveredProject?.image ? (
                    <Image
                      src={hoveredProject.image}
                      alt={hoveredProject.title}
                      width={600}
                      height={450}
                      className="w-full aspect-[4/3] object-cover"
                    />
                  ) : (
                    <div
                      className="w-full aspect-[4/3]"
                      style={{ background: hoveredProject?.cover.bg }}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </GeometricFrame>

            <div className="mt-4">
              <p className="font-display text-[18px] text-fg mb-1">
                {hoveredProject?.title}
              </p>
              <p className="text-[13px] text-fg-2 mb-3">
                {hoveredProject?.description}
              </p>
              <div className="flex gap-2 flex-wrap">
                {hoveredProject?.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-mono text-[10px] uppercase tracking-[0.06em] text-fg-3 border border-fg-4 rounded-sm px-2 py-0.5"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-[10vh]">
          <Footer />
        </div>
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/index/page.tsx
git commit -m "feat: Index page with two-panel layout and hover preview"
```

### Task 14: Build Archive page (/archive)

**Files:**
- Create: `src/app/archive/page.tsx`

Same row structure as Index but lighter — no preview panel, cool gradient frames, experiments only.

- [ ] **Step 1: Write src/app/archive/page.tsx**

```tsx
import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/Footer";
import GeometricFrame from "@/components/GeometricFrame";
import { PIECES } from "@/constants/pieces";

const experiments = PIECES.filter((p) => p.type === "experiment").sort(
  (a, b) => a.order - b.order
);

// Note: Nav, ParticleCanvas, and Cursor are rendered in layout.tsx — do NOT duplicate here.

export default function ArchivePage() {
  return (
    <main id="main" className="min-h-screen">

      <div className="pt-16 px-[clamp(24px,6vw,48px)]">
        <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-fg-3 block mb-8">
          Archive
        </span>

        <div className="max-w-[800px]">
          {experiments.map((piece) => (
            <Link
              key={piece.slug}
              href={`/archive/${piece.slug}`}
              className="group flex items-center gap-4 py-4 border-b border-fg-4 no-underline transition-colors duration-300"
              data-cursor="link"
            >
              <div className="w-[120px] h-[90px] flex-shrink-0 overflow-hidden">
                <GeometricFrame variant="thumbnail" accentGradient="cool">
                  {piece.video ? (
                    <video
                      src={piece.video}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : piece.image ? (
                    <Image
                      src={piece.image}
                      alt={piece.title}
                      width={120}
                      height={90}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-full h-full"
                      style={{ background: piece.cover.bg }}
                    />
                  )}
                </GeometricFrame>
              </div>

              <div className="flex-1 min-w-0">
                <span className="font-body text-[15px] text-fg block">
                  {piece.title}
                </span>
              </div>

              <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-fg-3 flex-shrink-0">
                {piece.type === "experiment" ? "Experiment" : "Project"}
              </span>

              <span className="font-mono text-[11px] text-fg-3 tabular-nums flex-shrink-0">
                {piece.status === "wip" ? "WIP" : piece.year}
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-[10vh]">
          <Footer />
        </div>
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/archive/page.tsx
git commit -m "feat: Archive page with cool-gradient frames and lightweight rows"
```

### Task 15: Build project detail page (/index/[slug])

**Files:**
- Create: `src/app/index/[slug]/page.tsx`

Detail page with hero in GeometricFrame, case study content, and next-project link.

- [ ] **Step 1: Write src/app/index/[slug]/page.tsx**

```tsx
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { PIECES } from "@/constants/pieces";
import { CASE_STUDIES } from "@/constants/case-studies";
import GeometricFrame from "@/components/GeometricFrame";
import Footer from "@/components/Footer";
import DetailContent from "@/components/DetailContent";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return PIECES.filter((p) => p.type === "project").map((p) => ({
    slug: p.slug,
  }));
}

// Note: Nav, ParticleCanvas, and Cursor are rendered in layout.tsx — do NOT duplicate here.

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const piece = PIECES.find((p) => p.slug === slug && p.type === "project");
  if (!piece) notFound();

  const cs = CASE_STUDIES[piece.slug];
  const projects = PIECES.filter((p) => p.type === "project").sort(
    (a, b) => a.order - b.order
  );
  const currentIndex = projects.findIndex((p) => p.slug === piece.slug);
  const nextProject = projects[(currentIndex + 1) % projects.length];

  return (
    <main id="main" className="min-h-screen">

      {/* Hero */}
      <div className="pt-16 px-[clamp(24px,6vw,48px)]">
        <GeometricFrame variant="hero" layoutId={`frame-${piece.slug}`}>
          {piece.image ? (
            <Image
              src={piece.image}
              alt={piece.title}
              width={1600}
              height={1000}
              className="w-full aspect-[16/10] object-cover block"
              priority
            />
          ) : (
            <div
              className="w-full aspect-[16/10]"
              style={{ background: piece.cover.bg }}
            />
          )}
        </GeometricFrame>
      </div>

      {/* Header */}
      <header className="px-[clamp(24px,6vw,48px)] pt-10 pb-6 max-w-[900px]">
        <h1 className="font-display text-[clamp(22px,3vw,32px)] font-normal tracking-[-0.01em] leading-[1.2] text-fg mb-2">
          {piece.title}
        </h1>
        <p className="text-[13px] leading-[1.6] text-fg-2 mb-4 max-w-[500px]">
          {piece.description}
        </p>
        <div className="flex items-center gap-4">
          <span className="font-mono text-[11px] text-fg-3 tabular-nums">
            {piece.status === "wip" ? "WIP" : piece.year}
          </span>
          {piece.tags.map((tag) => (
            <span
              key={tag}
              className="font-mono text-[10px] uppercase tracking-[0.06em] text-fg-3 border border-fg-4 rounded-sm px-2 py-0.5"
            >
              {tag}
            </span>
          ))}
        </div>
      </header>

      {/* Case study content */}
      <DetailContent caseStudy={cs} fallbackDescription={piece.description} />

      {/* Next project */}
      {nextProject && (
        <div className="border-t border-fg-4 mx-[clamp(24px,6vw,48px)] pt-10 pb-20">
          <Link
            href={`/index/${nextProject.slug}`}
            className="no-underline group"
            data-cursor="link"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-fg-3 block mb-2">
              Next
            </span>
            <span className="font-display text-[clamp(18px,2.5vw,24px)] text-fg-2 group-hover:text-fg transition-colors duration-300">
              {nextProject.title}
            </span>
          </Link>
        </div>
      )}

      <div className="px-[clamp(24px,6vw,48px)]">
        <Footer />
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Create DetailContent client component**

Create: `src/components/DetailContent.tsx`

```tsx
"use client";

import { motion } from "framer-motion";
import type { CaseStudy } from "@/constants/case-studies";

interface DetailContentProps {
  caseStudy?: CaseStudy;
  fallbackDescription: string;
}

const reveal = {
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { type: "spring", stiffness: 120, damping: 20, mass: 0.8, delay: 0.1 },
};

export default function DetailContent({
  caseStudy: cs,
  fallbackDescription,
}: DetailContentProps) {
  if (!cs) {
    return (
      <article className="max-w-[700px] px-[clamp(24px,6vw,48px)] py-14">
        <p className="text-[14px] leading-[1.7] text-fg-2">{fallbackDescription}</p>
      </article>
    );
  }

  return (
    <article className="max-w-[700px] px-[clamp(24px,6vw,48px)] py-14">
      <motion.h2
        {...reveal}
        className="font-display text-[clamp(20px,3vw,28px)] font-normal tracking-[-0.01em] leading-[1.2] text-fg mb-4"
      >
        {cs.editorial.heading}
      </motion.h2>

      {cs.editorial.subhead && (
        <motion.p
          {...reveal}
          className="font-mono text-[10px] uppercase tracking-[0.06em] text-fg-3 mb-4"
        >
          {cs.editorial.subhead}
        </motion.p>
      )}

      <motion.p {...reveal} className="text-[14px] leading-[1.7] text-fg-2">
        {cs.editorial.copy}
      </motion.p>

      {cs.process && (
        <>
          <div className="relative h-px bg-fg-4 my-10">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-fg-4 rotate-45" />
          </div>
          <motion.h3
            {...reveal}
            className="font-mono text-[10px] uppercase tracking-[0.06em] text-fg-3 mb-4"
          >
            {cs.process.title}
          </motion.h3>
          <motion.p {...reveal} className="text-[14px] leading-[1.7] text-fg-2">
            {cs.process.copy}
          </motion.p>
        </>
      )}

      {cs.engineering && (
        <>
          <div className="relative h-px bg-fg-4 my-10">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-fg-4 rotate-45" />
          </div>
          <motion.h3
            {...reveal}
            className="font-mono text-[10px] uppercase tracking-[0.06em] text-fg-3 mb-4"
          >
            {cs.engineering.title}
          </motion.h3>
          <motion.p {...reveal} className="text-[14px] leading-[1.7] text-fg-2">
            {cs.engineering.copy}
          </motion.p>
          <motion.div {...reveal} className="flex gap-2 flex-wrap mt-4">
            {cs.engineering.signals.map((signal) => (
              <span
                key={signal}
                className="font-mono text-[10px] uppercase tracking-[0.06em] text-fg-3 border border-fg-4 rounded-sm px-2 py-0.5"
              >
                {signal}
              </span>
            ))}
          </motion.div>
        </>
      )}
    </article>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/index/[slug]/page.tsx src/components/DetailContent.tsx
git commit -m "feat: project detail page with geometric hero and case study content"
```

### Task 16: Build archive detail page (/archive/[slug])

**Files:**
- Create: `src/app/archive/[slug]/page.tsx`

Same structure as project detail but for experiments. Cool gradient on frame. Uses CASE_STUDIES if available.

- [ ] **Step 1: Write src/app/archive/[slug]/page.tsx**

```tsx
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { PIECES } from "@/constants/pieces";
import { CASE_STUDIES } from "@/constants/case-studies";
import GeometricFrame from "@/components/GeometricFrame";
import DetailContent from "@/components/DetailContent";
import Footer from "@/components/Footer";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return PIECES.filter((p) => p.type === "experiment").map((p) => ({
    slug: p.slug,
  }));
}

// Note: Nav, ParticleCanvas, and Cursor are rendered in layout.tsx — do NOT duplicate here.

export default async function ArchiveDetailPage({ params }: Props) {
  const { slug } = await params;
  const piece = PIECES.find(
    (p) => p.slug === slug && p.type === "experiment"
  );
  if (!piece) notFound();

  const cs = CASE_STUDIES[piece.slug];
  const experiments = PIECES.filter((p) => p.type === "experiment").sort(
    (a, b) => a.order - b.order
  );
  const currentIndex = experiments.findIndex((p) => p.slug === piece.slug);
  const nextExperiment = experiments[(currentIndex + 1) % experiments.length];

  return (
    <main id="main" className="min-h-screen">

      <div className="pt-16 px-[clamp(24px,6vw,48px)]">
        <GeometricFrame
          variant="hero"
          accentGradient="cool"
          layoutId={`frame-${piece.slug}`}
        >
          {piece.video ? (
            <video
              src={piece.video}
              autoPlay
              muted
              loop
              playsInline
              className="w-full aspect-[16/10] object-cover block"
            />
          ) : piece.image ? (
            <Image
              src={piece.image}
              alt={piece.title}
              width={1600}
              height={1000}
              className="w-full aspect-[16/10] object-cover block"
              priority
            />
          ) : (
            <div
              className="w-full aspect-[16/10]"
              style={{ background: piece.cover.bg }}
            />
          )}
        </GeometricFrame>
      </div>

      <header className="px-[clamp(24px,6vw,48px)] pt-10 pb-6 max-w-[900px]">
        <h1 className="font-display text-[clamp(22px,3vw,32px)] font-normal tracking-[-0.01em] leading-[1.2] text-fg mb-2">
          {piece.title}
        </h1>
        <p className="text-[13px] leading-[1.6] text-fg-2 mb-4 max-w-[500px]">
          {piece.description}
        </p>
        <div className="flex items-center gap-4">
          <span className="font-mono text-[11px] text-fg-3 tabular-nums">
            {piece.status === "wip" ? "WIP" : piece.year}
          </span>
          {piece.tags.map((tag) => (
            <span
              key={tag}
              className="font-mono text-[10px] uppercase tracking-[0.06em] text-fg-3 border border-fg-4 rounded-sm px-2 py-0.5"
            >
              {tag}
            </span>
          ))}
        </div>
      </header>

      <DetailContent caseStudy={cs} fallbackDescription={piece.description} />

      {nextExperiment && nextExperiment.slug !== piece.slug && (
        <div className="border-t border-fg-4 mx-[clamp(24px,6vw,48px)] pt-10 pb-20">
          <Link
            href={`/archive/${nextExperiment.slug}`}
            className="no-underline group"
            data-cursor="link"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-fg-3 block mb-2">
              Next
            </span>
            <span className="font-display text-[clamp(18px,2.5vw,24px)] text-fg-2 group-hover:text-fg transition-colors duration-300">
              {nextExperiment.title}
            </span>
          </Link>
        </div>
      )}

      <div className="px-[clamp(24px,6vw,48px)]">
        <Footer />
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/archive/[slug]/page.tsx
git commit -m "feat: archive detail page with cool gradient frame"
```

---

## Chunk 5: About Page, 404, and Final Polish

### Task 17: Rebuild About page

**Files:**
- Rewrite: `src/app/about/page.tsx`

Character-portrait energy. Geometric frame on portrait. Details as stat block. Denser particles.

- [ ] **Step 1: Rewrite about/page.tsx**

```tsx
"use client";

import { motion } from "framer-motion";
import { SOCIALS, CONTACT_EMAIL } from "@/constants/contact";
import GeometricFrame from "@/components/GeometricFrame";
import Footer from "@/components/Footer";

// Note: Nav, ParticleCanvas, and Cursor are rendered in layout.tsx.
// The spec calls for denser particles on /about — this can be achieved later
// by passing route context to ParticleCanvas via a React context or URL check.

const reveal = {
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { type: "spring", stiffness: 120, damping: 20, mass: 0.8 },
};

const STATS = [
  { label: "Location", value: "New York" },
  { label: "Focus", value: "Design Engineering" },
  { label: "Status", value: "Available for select projects" },
];

const EXPERIENCE = [
  { period: "2024–", role: "HKJ Studio", desc: "Independent design engineering" },
  { period: "2023–24", role: "Product", desc: "Mobile & AI products" },
  { period: "2022–23", role: "Design Systems", desc: "Component architecture & tokens" },
];

export default function AboutPage() {
  return (
    <main id="main" className="min-h-screen">

      <section className="pt-[clamp(80px,12vh,140px)] px-[clamp(24px,6vw,48px)] pb-20 max-w-[680px]">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-mono text-[10px] uppercase tracking-[0.06em] text-fg-3 block mb-8"
        >
          About
        </motion.span>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="font-display text-[clamp(22px,3vw,32px)] leading-[1.3] text-fg mb-5 max-w-[58ch] tracking-[-0.01em]"
        >
          HKJ is a one-person design engineering practice based in New York.
          I care about type, motion, and the invisible details that make
          software feel intentional.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-[15px] leading-[1.7] text-fg-2 max-w-[54ch] tracking-[-0.01em]"
        >
          Previously, I worked on products across mobile, AI, and design
          systems. I believe the best digital work borrows from the rigor of
          print and the warmth of physical objects.
        </motion.p>

        <motion.p
          {...reveal}
          className="font-mono text-[10px] leading-[1.7] text-fg-3 tracking-[0.04em] max-w-[48ch] mt-8"
        >
          When I&rsquo;m not pushing pixels, I&rsquo;m probably hunting for
          good light to photograph, reading about material science, or making
          pour-overs that take too long.
        </motion.p>

        {/* Divider with diamond */}
        <div className="relative h-px bg-fg-4 mt-10 mb-8">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-fg-4 rotate-45" />
        </div>

        {/* Stats block — character sheet style */}
        <motion.div {...reveal}>
          <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-fg-3 block mb-4">
            Details
          </span>
          <div className="grid grid-cols-2 gap-x-8 gap-y-3 mb-8">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <span className="font-mono text-[10px] text-fg-3 tracking-[0.04em] block">
                  {stat.label}
                </span>
                <span className="text-[13px] text-fg">{stat.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Experience */}
        <motion.div {...reveal}>
          <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-fg-3 block mb-4">
            Experience
          </span>
          <div className="flex flex-col gap-3">
            {EXPERIENCE.map((exp) => (
              <div key={exp.period} className="flex flex-col gap-1">
                <span className="font-mono text-[10px] text-fg-3 tracking-[0.04em]">
                  {exp.period}
                </span>
                <span className="text-[15px] text-fg-2 leading-[1.5] tracking-[-0.01em]">
                  <span className="text-fg">{exp.role}</span> &mdash; {exp.desc}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Divider */}
        <div className="relative h-px bg-fg-4 mt-10 mb-8">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-fg-4 rotate-45" />
        </div>

        {/* Contact */}
        <motion.div {...reveal}>
          <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-fg-3 block mb-4">
            Get in touch
          </span>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-[15px] text-fg no-underline tracking-[-0.01em]"
            data-cursor="link"
          >
            {CONTACT_EMAIL}
          </a>
        </motion.div>

        {/* Socials */}
        <motion.div {...reveal} className="mt-6">
          <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-fg-3 mr-4">
            See also:
          </span>
          {SOCIALS.map((link, i) => (
            <span key={link.label}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[10px] uppercase tracking-[0.06em] text-fg-3 no-underline hover:text-fg transition-colors duration-300"
                data-cursor="link"
              >
                {link.label}
              </a>
              {i < SOCIALS.length - 1 && (
                <span className="font-mono text-[10px] text-fg-3 mx-2">·</span>
              )}
            </span>
          ))}
        </motion.div>
      </section>

      <div className="px-[clamp(24px,6vw,48px)]">
        <Footer />
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/about/page.tsx
git commit -m "feat: rebuild About page with character-sheet stats and dense particles"
```

### Task 18: Restyle 404 page

**Files:**
- Modify: `src/app/not-found.tsx`

Replace `TransitionLink` with `Link`. Match new design system.

- [ ] **Step 1: Rewrite not-found.tsx**

```tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <h1 className="font-display text-[clamp(32px,5vw,48px)] font-normal text-fg mb-4 tracking-[-0.02em]">
          404
        </h1>
        <p className="text-[14px] text-fg-2 mb-6">
          This page doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="font-mono text-[10px] uppercase tracking-[0.06em] text-fg-3 no-underline hover:text-fg transition-colors duration-300"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/not-found.tsx
git commit -m "style: restyle 404 page for new design system"
```

### Task 19: Clean up unused constants and hooks

**Files:**
- Evaluate: `src/constants/projects.ts` — may be unused now (Index page reads directly from PIECES)
- Keep: `src/hooks/useReducedMotion.ts` — still useful
- Keep: `src/lib/utils.ts` — cn() utility still needed

- [ ] **Step 1: Check if projects.ts is imported anywhere**

```bash
grep -r "from.*projects" src/ --include="*.tsx" --include="*.ts" | grep -v node_modules | grep -v "constants/projects.ts"
```

If unused, delete it.

- [ ] **Step 2: Commit any cleanup**

```bash
git add -A
git commit -m "chore: clean up unused constants and imports"
```

### Task 20: Full build verification

- [ ] **Step 1: Run the build**

```bash
cd c:/Users/Ryan Jun/.gemini/antigravity/scratch/hkjstudio && npm run build
```

Fix any type errors or build failures.

- [ ] **Step 2: Run dev server and test all routes**

```bash
npm run dev
```

Test checklist:
- [ ] `http://localhost:3000` — homepage loads, particles, cursor, scroll, project sections
- [ ] `http://localhost:3000/index` — project list with preview panel
- [ ] `http://localhost:3000/archive` — experiment list
- [ ] `http://localhost:3000/index/gyeol` — detail page with case study
- [ ] `http://localhost:3000/about` — about page with dense particles
- [ ] `http://localhost:3000/nonexistent` — 404 page
- [ ] Theme toggle works (dark ↔ light)
- [ ] Nav active indicator slides between pages
- [ ] Redirects: `/work` → `/index`, `/lab` → `/archive`

- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "feat: complete Paced List redesign — editorial homepage, game-UI atmosphere"
```
