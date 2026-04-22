"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * AmbientAscii — the site's wallpaper. A sparse canvas of tiny dot
 * glyphs drifting very slowly across the whole viewport, mounted
 * site-wide as a fixed background layer.
 *
 * Replaces the prior SVG paper-grain. One texture register, not two.
 * At ~11% opacity + mix-blend-multiply, reads as typographic grain
 * rather than decoration.
 *
 * Reduced-motion clients get a single paint, no rAF loop.
 */

const GLYPHS = "·⋅∙∶∷∴"; // tiny, off-center dot characters only — never letters
const CELL_FONT_PX = 11;
const CELL_W = 17;
const CELL_H = 22;
const DENSITY_THRESHOLD = 0.78; // sparse — paper grain under the garden, not a field of its own
const SPEED = 0.05;             // very slow drift; garden carries the motion now

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

    const field = (c: number, r: number, t: number) => {
      const a = Math.sin(c * 0.23 + t * 0.14) * Math.cos(r * 0.19 - t * 0.11);
      const b = Math.sin((c - r) * 0.17 + t * 0.09) * 0.6;
      return (a + b) * 0.32 + 0.5;
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
          if (v < DENSITY_THRESHOLD) continue;

          const glyphIdx = Math.floor((v + c * 0.31 + r * 0.19) * GLYPHS.length);
          const ch = GLYPHS[glyphIdx % GLYPHS.length];
          const alpha = ((v - DENSITY_THRESHOLD) / (1 - DENSITY_THRESHOLD)) * 0.55 + 0.25;
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
        zIndex: 0,
        opacity: 0.10,
        mixBlendMode: "multiply",
      }}
    />
  );
}
