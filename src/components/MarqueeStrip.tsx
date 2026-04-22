"use client";

import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * MarqueeStrip — a thin horizontal band of drifting ASCII characters
 * fixed to the bottom of the viewport on every page. Pure CSS animation
 * (no rAF), looped via duplicated content + transform: translateX.
 * Pointer-events none, reads as a typographic status-bar signal that
 * the site is alive.
 */

// A long-ish glyph string; duplicated once in the DOM so the animation
// can translate by -50% and loop seamlessly.
const STRIP = [
  "·", "⋅", "∙", "·", "∶", "·", "─", "·", "∷", "⋅",
  "·", "∙", "∴", "·", "⋅", "─", "·", "∷", "∙", "⋅",
  "·", "∶", "⋅", "·", "∴", "·", "─", "∙", "·", "⋅",
  "∷", "·", "⋅", "∙", "·", "∶", "·", "⋅", "∴", "·",
  "─", "·", "∙", "⋅", "·", "∷", "·", "∶", "⋅", "·",
  "∙", "·", "⋅", "∴", "·", "─", "∙", "·", "⋅", "∶",
  "·", "∷", "·", "⋅", "∙", "·", "∴", "⋅", "·", "─",
  "∙", "·", "∶", "⋅", "·", "∷", "·", "⋅", "∙", "·",
].join("   ");

export default function MarqueeStrip() {
  const reduced = useReducedMotion();

  return (
    <div className="marquee" aria-hidden>
      <div
        className="marquee__track"
        data-reduced={reduced ? "" : undefined}
      >
        <span className="marquee__segment">{STRIP}</span>
        <span className="marquee__segment">{STRIP}</span>
      </div>

      <style>{`
        .marquee {
          position: fixed;
          bottom: 4px;
          left: 0;
          right: 0;
          height: 14px;
          overflow: hidden;
          pointer-events: none;
          z-index: 2;
          -webkit-mask-image: linear-gradient(
            to right,
            transparent 0,
            black 120px,
            black calc(100% - 120px),
            transparent 100%
          );
          mask-image: linear-gradient(
            to right,
            transparent 0,
            black 120px,
            black calc(100% - 120px),
            transparent 100%
          );
        }

        .marquee__track {
          display: flex;
          flex-wrap: nowrap;
          white-space: nowrap;
          animation: marquee-drift 96s linear infinite;
          font-family: var(--font-stack-mono);
          font-size: 10px;
          letter-spacing: 0.18em;
          color: var(--ink-3);
          will-change: transform;
        }
        .marquee__track[data-reduced] { animation: none; }

        .marquee__segment {
          flex: 0 0 auto;
          padding-right: 2em;
        }

        @keyframes marquee-drift {
          from { transform: translate3d(0, 0, 0); }
          to   { transform: translate3d(-50%, 0, 0); }
        }

        @media (prefers-reduced-motion: reduce) {
          .marquee__track { animation: none; }
        }
      `}</style>
    </div>
  );
}
