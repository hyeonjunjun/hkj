"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * CornerStamp — a small, slow-morphing ASCII composition rendered as a
 * signature mark in one corner of its parent. Canvas-rendered; glyphs
 * evolve via a per-cell sine-field, threshold-gated so about a quarter
 * of the cells carry a character at any moment. Reads as a typographic
 * hanko stamp that never quite settles.
 *
 * Parent positioning controls where the stamp lives — component renders
 * a fixed 120×120 canvas.
 */

const GLYPHS = "·⋅∙─│┌┐└┘┼·";
const CELL = 10;
const FONT_PX = 11;
const SIZE = 120; // px square
const COLS = Math.floor(SIZE / CELL);
const ROWS = Math.floor(SIZE / CELL);
const SPEED = 0.35;
const THRESHOLD = 0.62;

export default function CornerStamp() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = SIZE * dpr;
    canvas.height = SIZE * dpr;
    canvas.style.width = `${SIZE}px`;
    canvas.style.height = `${SIZE}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const fontStack = `${FONT_PX}px var(--font-mono, "SF Mono"), "Consolas", monospace`;
    const start = performance.now();
    let rafId = 0;

    const field = (c: number, r: number, t: number) => {
      const cx = c - COLS / 2;
      const cy = r - ROWS / 2;
      const radial = Math.sqrt(cx * cx + cy * cy) / (COLS * 0.5);
      const ring = Math.sin(radial * 3.2 - t * 0.8);
      const drift = Math.sin(c * 0.4 + t * 0.6) * Math.cos(r * 0.35 - t * 0.5);
      return (ring * 0.6 + drift * 0.4) * 0.4 + 0.5;
    };

    const render = (now: number) => {
      const t = reduced ? 0 : ((now - start) / 1000) * SPEED;
      ctx.clearRect(0, 0, SIZE, SIZE);
      ctx.font = fontStack;
      ctx.textBaseline = "top";

      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const v = field(c, r, t);
          if (v < THRESHOLD) continue;
          const idx = Math.floor((v + c * 0.27 + r * 0.19) * GLYPHS.length);
          const ch = GLYPHS[idx % GLYPHS.length];
          const alpha = ((v - THRESHOLD) / (1 - THRESHOLD)) * 0.62 + 0.28;
          ctx.fillStyle = `rgba(17, 17, 16, ${alpha.toFixed(3)})`;
          ctx.fillText(ch, c * CELL, r * CELL);
        }
      }

      if (!reduced) rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(rafId);
  }, [reduced]);

  return (
    <canvas
      ref={canvasRef}
      className="corner-stamp"
      aria-hidden
      style={{
        position: "absolute",
        pointerEvents: "none",
        zIndex: 2,
      }}
    />
  );
}
