"use client";

import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * AmbientGarden — a small set of finely-detailed ASCII natural elements
 * anchored at the edges of the viewport. Each element is a `<pre>` with
 * a hand-composed glyph composition; motion is pure CSS — subtle rotate
 * keyframes at slightly different durations so no two sway in unison.
 *
 * Branches hang from their attachment point (transform-origin top);
 * stems stand up (transform-origin bottom). Tiny — 9px mono, tight
 * line-height. Mix-blend-multiply so the characters darken whatever
 * sits behind them rather than floating visibly. Hidden under 640px —
 * too delicate for small viewports.
 */
export default function AmbientGarden() {
  const reduced = useReducedMotion();

  return (
    <div
      className="garden"
      aria-hidden
      data-reduced={reduced ? "" : undefined}
    >
      {/* 01 — Hanging branch, top-left.
          Anchors at top, swings slowly. */}
      <pre className="g g--branch-tl">{`┬
│
│
│·
│ ╲
│  ·
│ ·
·`}</pre>

      {/* 02 — Thin twig with a single leaf, right side, mid-upper. */}
      <pre className="g g--twig-tr">{`┐
│
│
│ ·
│╱
·`}</pre>

      {/* 03 — Small flower on stem, bottom-left.
          Roots at bottom, leans slightly. */}
      <pre className="g g--flower-bl">{` ·o·
·o·
 ·
 │
 │
 │`}</pre>

      {/* 04 — Grass tuft, bottom-right, tiny. */}
      <pre className="g g--grass-br">{`·  ·  ·
│╲│ ╱│
│ │  │`}</pre>

      {/* 05 — Single drifting leaf, falls diagonally, very slow. */}
      <pre className="g g--leaf-drift">{` ·
  ╲
   ·
    ·`}</pre>

      <style>{`
        .garden {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 1;
          font-family: var(--font-stack-mono);
          mix-blend-mode: multiply;
        }

        .g {
          position: absolute;
          margin: 0;
          font-size: 9px;
          line-height: 1.08;
          letter-spacing: 0;
          color: var(--ink);
          opacity: 0.42;
          white-space: pre;
          will-change: transform;
        }

        /* 01 — Hanging branch, top-left. Origin at top, pendulum sway. */
        .g--branch-tl {
          top: clamp(64px, 9vh, 96px);
          left: clamp(10px, 1.2vw, 22px);
          transform-origin: 50% 6%;
          animation: sway-a 9.2s ease-in-out infinite alternate;
        }

        /* 02 — Thin twig, top-right. Different phase, lighter sway. */
        .g--twig-tr {
          top: clamp(96px, 12vh, 140px);
          right: clamp(14px, 2vw, 32px);
          transform-origin: 50% 4%;
          animation: sway-b 11.6s ease-in-out infinite alternate;
          opacity: 0.35;
        }

        /* 03 — Flower on stem, bottom-left. Origin at base of stem. */
        .g--flower-bl {
          bottom: clamp(64px, 9vh, 96px);
          left: clamp(20px, 3vw, 52px);
          transform-origin: 50% 100%;
          animation: sway-c 10.4s ease-in-out infinite alternate;
          opacity: 0.44;
        }

        /* 04 — Grass tuft, bottom-right. */
        .g--grass-br {
          bottom: clamp(52px, 7vh, 84px);
          right: clamp(22px, 3vw, 56px);
          transform-origin: 50% 100%;
          animation: sway-d 7.8s ease-in-out infinite alternate;
          opacity: 0.38;
        }

        /* 05 — Drifting leaf, enters top-right, falls to bottom-left.
           Long cycle — most of the time it's offscreen. */
        .g--leaf-drift {
          top: -20px;
          right: 22%;
          opacity: 0;
          animation: leaf-drift 38s linear infinite;
        }

        /* ── Sway keyframes, subtly different per element ────────── */
        @keyframes sway-a {
          from { transform: rotate(-1.8deg); }
          to   { transform: rotate(1.6deg); }
        }
        @keyframes sway-b {
          from { transform: rotate(1.4deg); }
          to   { transform: rotate(-1.2deg); }
        }
        @keyframes sway-c {
          from { transform: rotate(-2.4deg); }
          to   { transform: rotate(2deg); }
        }
        @keyframes sway-d {
          from { transform: rotate(-1.3deg) skewX(-2deg); }
          to   { transform: rotate(1.8deg) skewX(1.5deg); }
        }

        /* Drifting leaf — translate from top-right to bottom-left, slow
           rotate through 360°, fade in then out. */
        @keyframes leaf-drift {
          0%   { transform: translate3d(0, 0, 0) rotate(0deg); opacity: 0; }
          8%   { opacity: 0.36; }
          92%  { opacity: 0.36; }
          100% {
            transform: translate3d(-44vw, 88vh, 0) rotate(320deg);
            opacity: 0;
          }
        }

        .garden[data-reduced] .g { animation: none; }
        @media (prefers-reduced-motion: reduce) {
          .g { animation: none; }
        }

        @media (max-width: 640px) {
          .garden { display: none; }
        }
      `}</style>
    </div>
  );
}
