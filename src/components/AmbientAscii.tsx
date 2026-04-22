"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * AmbientAscii — a real ASCII-art backdrop rendered by mapping a
 * density field onto a character ramp. Covers the whole viewport
 * with genuine glyph coverage (not a sparse scatter), y-modulated so
 * density grows toward the bottom — reads as atmospheric distance.
 *
 * Sits above the page's opaque background (z-index: 2) at ~32%
 * opacity without a blend mode so the characters render as actual
 * dark-gray ink on paper rather than a barely-perceptible multiply.
 *
 * Reduced-motion clients get a single paint, no rAF loop.
 */

// Density ramp: space (sparsest — renders nothing) → @ (densest).
const RAMP = " .,:;!lrLYU0@";
const CELL_FONT_PX = 11;
const CELL_W = 9;
const CELL_H = 14;
const SPEED = 0.06;

export default function AmbientAscii() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let rafId = 0;
    const start = performance.now();

    let cssW = 0;
    let cssH = 0;
    let cols = 0;
    let rows = 0;

    const fontStack = `${CELL_FONT_PX}px var(--font-mono, "SF Mono"), "Consolas", monospace`;

    const measure = () => {
      cssW = window.innerWidth;
      cssH = window.innerHeight;
      canvas.width = Math.floor(cssW * dpr);
      canvas.height = Math.floor(cssH * dpr);
      canvas.style.width = `${cssW}px`;
      canvas.style.height = `${cssH}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(cssW / CELL_W) + 1;
      rows = Math.ceil(cssH / CELL_H) + 1;
    };

    measure();
    window.addEventListener("resize", measure);

    /** Uniform multi-harmonic noise, y-modulated for atmospheric depth. */
    const field = (c: number, r: number, t: number) => {
      const yNorm = r / Math.max(1, rows); // 0 top, 1 bottom

      // Three sine harmonics at different spatial + temporal frequencies.
      const n1 =
        Math.sin(c * 0.082 + t * 0.11) *
        Math.cos(r * 0.098 - t * 0.07);
      const n2 = Math.sin((c - r) * 0.14 + t * 0.05) * 0.62;
      const n3 = Math.sin(c * 0.22 + r * 0.19 + t * 0.03) * 0.32;

      // Rough 0..1 after normalizing.
      const base = (n1 + n2 + n3 + 1.94) / 3.88;

      // y-modulation: sparser at top (sky), denser at bottom (ground).
      // Smooth curve rather than hard zones — the landscape reads as
      // gradient, not strata.
      const yDepth = 0.25 + Math.pow(yNorm, 1.3) * 0.95;

      return base * yDepth;
    };

    const render = (now: number) => {
      const t = reduced ? 0 : ((now - start) / 1000) * SPEED;

      ctx.clearRect(0, 0, cssW, cssH);
      ctx.font = fontStack;
      ctx.textBaseline = "top";

      for (let r = 0; r < rows; r++) {
        const y = r * CELL_H;
        for (let c = 0; c < cols; c++) {
          const v = field(c, r, t);
          if (v <= 0.03) continue;

          const idx = Math.min(
            RAMP.length - 1,
            Math.max(0, Math.floor(v * RAMP.length))
          );
          const ch = RAMP[idx];
          if (ch === " ") continue;

          // Per-cell alpha climbs with density so denser glyphs hold.
          const alpha = 0.30 + v * 0.55;
          ctx.fillStyle = `rgba(17, 17, 16, ${alpha.toFixed(3)})`;
          ctx.fillText(ch, c * CELL_W, y);
        }
      }

      if (!reduced) rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", measure);
    };
  }, [reduced]);

  return (
    <canvas
      ref={canvasRef}
      className="ambient-ascii"
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 2,
        opacity: 0.32,
      }}
    />
  );
}
