"use client";

import { useEffect, useRef } from "react";

// Low → high density. Characters chosen for monospace visual weight progression.
const RAMP = " .`'·,-:;!i+*x#%@";

type Props = {
  /** Cell width in CSS px at DPR 1. Larger = chunkier ASCII. */
  cell?: number;
};

export default function AsciiCosmos({ cell = 9 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointerRef = useRef({ nx: 0, ny: 0, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const CELL = cell;
    const LINE = Math.round(CELL * 1.65);

    let W = 0;
    let H = 0;
    let cols = 0;
    let rows = 0;
    let rafId = 0;
    let lastDraw = 0;
    const FPS = 24; // chunkier temporal feel — feels like an oscilloscope, not a game
    const MIN_FRAME = 1000 / FPS;

    const resize = () => {
      const parent = canvas.parentElement;
      W = parent ? parent.clientWidth : window.innerWidth;
      H = parent ? parent.clientHeight : window.innerHeight;
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(W / CELL) + 1;
      rows = Math.ceil(H / LINE) + 1;
    };

    // Deterministic pseudo-hash
    const hash = (a: number, b: number) => {
      const s = Math.sin(a * 12.9898 + b * 78.233) * 43758.5453;
      return s - Math.floor(s);
    };

    const onPointer = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointerRef.current.nx = (e.clientX - rect.left) / rect.width - 0.5;
      pointerRef.current.ny = (e.clientY - rect.top) / rect.height - 0.5;
      pointerRef.current.active = true;
    };
    const onLeave = () => {
      pointerRef.current.active = false;
    };
    canvas.addEventListener("pointermove", onPointer);
    canvas.addEventListener("pointerleave", onLeave);

    const boot = performance.now();
    let smoothPx = 0;
    let smoothPy = 0;

    const draw = (t: number) => {
      // Very slow pointer smoothing — reads as gravitational drift rather than input
      const targetX = pointerRef.current.active ? pointerRef.current.nx : 0;
      const targetY = pointerRef.current.active ? pointerRef.current.ny : 0;
      smoothPx += (targetX - smoothPx) * 0.015;
      smoothPy += (targetY - smoothPy) * 0.015;

      const breath = 1 + 0.04 * Math.sin(t * 0.0009);

      ctx.fillStyle = "#030408";
      ctx.fillRect(0, 0, W, H);

      const fontPx = Math.round(LINE * 0.78);
      ctx.font = `${fontPx}px "Fragment Mono", ui-monospace, "JetBrains Mono", "SFMono-Regular", Menlo, monospace`;
      ctx.textBaseline = "top";

      // Scene origin — drifts slowly with cursor
      const cx = W * 0.5 + smoothPx * W * 0.06;
      const cy = H * 0.5 + smoothPy * H * 0.06;
      const scale = Math.min(W, H) * 0.5;

      const tSec = t / 1000;

      // Jet axis rotation: slight long-period drift so it breathes
      const jetAngle = Math.PI / 4 + Math.sin(tSec * 0.04) * 0.02; // ~45° diagonal
      const cosJ = Math.cos(jetAngle);
      const sinJ = Math.sin(jetAngle);

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const px = c * CELL + CELL * 0.5;
          const py = r * LINE + LINE * 0.5;
          const x = (px - cx) / scale;
          const y = (py - cy) / scale;
          const dist = Math.sqrt(x * x + y * y);

          // ---- Core (bright saturated disk) ----
          const core = Math.exp(-dist * 6.5) * 2.2 * breath;
          const coreHalo = Math.exp(-dist * 2.2) * 0.28;

          // ---- 4-point diffraction spikes (thin, sharp, dominant) ----
          // Perpendicular is very tight; parallel falls off moderately.
          const spikeH =
            Math.exp(-Math.abs(y) * 95) *
            Math.exp(-Math.abs(x) * 1.8) *
            1.35;
          const spikeV =
            Math.exp(-Math.abs(x) * 95) *
            Math.exp(-Math.abs(y) * 1.8) *
            1.35;

          // Secondary diagonal spikes — much weaker, shorter
          const d1 = (x + y) * 0.7071;
          const d2 = (x - y) * 0.7071;
          const spikeD1 =
            Math.exp(-Math.abs(d2) * 140) *
            Math.exp(-Math.abs(d1) * 3.0) *
            0.42;
          const spikeD2 =
            Math.exp(-Math.abs(d1) * 140) *
            Math.exp(-Math.abs(d2) * 3.0) *
            0.42;

          // ---- Bipolar protostellar jet (asymmetric, dominant feature) ----
          const along = x * cosJ + y * sinJ; // projection onto jet axis
          const perp = -x * sinJ + y * cosJ; // perpendicular distance
          const jetWidth = 0.02 + 0.045 * Math.abs(along);
          const jetStrength = along > 0 ? 1.0 : 0.4; // brighter toward lower-right
          // Clumpiness — slow movement along the jet
          const clump =
            0.5 +
            0.5 *
              Math.abs(
                Math.sin(along * 14 + tSec * 0.35) *
                  Math.cos(along * 28 + tSec * 0.12)
              );
          const jetFalloff = Math.exp(-Math.abs(along) * 0.38);
          const jet =
            Math.exp(-Math.abs(perp) / jetWidth) *
            jetFalloff *
            jetStrength *
            clump *
            1.65;

          // ---- Dust cloud (upper-left, smoothly falling off) ----
          // Value noise with bilinear interp — no grid artifacts.
          const ns = 3.5;
          const sx = x * ns + tSec * 0.04;
          const sy = y * ns - tSec * 0.025;
          const ix = Math.floor(sx);
          const iy = Math.floor(sy);
          const fx = sx - ix;
          const fy = sy - iy;
          const sm = (v: number) => v * v * (3 - 2 * v);
          const u0 = sm(fx);
          const v0 = sm(fy);
          const na = hash(ix, iy);
          const nb = hash(ix + 1, iy);
          const nc = hash(ix, iy + 1);
          const nd = hash(ix + 1, iy + 1);
          const smoothNoise =
            na * (1 - u0) * (1 - v0) +
            nb * u0 * (1 - v0) +
            nc * (1 - u0) * v0 +
            nd * u0 * v0;
          // Dust sits along the jet axis, upper-left of the core
          const dux = x + 0.55;
          const duy = y + 0.35;
          const ddist2 = dux * dux + duy * duy;
          const dustEnv = Math.exp(-ddist2 * 14); // very tight Gaussian
          // Only show dust when noise happens to be high — sparse wisps, not a solid blob
          const dust = dustEnv * Math.max(0, smoothNoise - 0.35) * 0.85;

          // ---- Sparse background starfield (bright pinpoints only) ----
          let stars = 0;
          const h = hash(c * 1.7, r * 2.3);
          if (h > 0.9975) {
            const twink = 0.55 + 0.45 * Math.sin(tSec * 1.5 + c * 0.31 + r * 0.19);
            stars = 0.9 * twink;
          }

          const density =
            core +
            coreHalo +
            spikeH +
            spikeV +
            spikeD1 +
            spikeD2 +
            jet +
            dust +
            stars;

          if (density < 0.16) continue;

          // Map density → ramp index (soft knee at the bright end for bloom feel)
          const compressed = density > 1.6 ? 1.6 + (density - 1.6) * 0.35 : density;
          const idx = Math.min(
            RAMP.length - 1,
            Math.max(0, Math.floor((compressed / 1.9) * (RAMP.length - 1)))
          );
          const ch = RAMP[idx];

          // Alpha: low densities fade; bright cells fully opaque
          const alpha = Math.min(1, 0.2 + density * 1.1);
          // Subtle warmth toward center
          const warmth = Math.min(1, core * 0.5 + coreHalo * 1.8);
          const rC = Math.round(234 + warmth * 18);
          const gC = Math.round(226 + warmth * 20);
          const bC = Math.round(212 + warmth * 34);
          ctx.fillStyle = `rgba(${rC}, ${gC}, ${bC}, ${alpha})`;
          ctx.fillText(ch, c * CELL, r * LINE);
        }
      }
    };

    const frame = (now: number) => {
      if (now - lastDraw >= MIN_FRAME) {
        draw(now - boot);
        lastDraw = now;
      }
      if (!reduced) rafId = requestAnimationFrame(frame);
    };

    resize();
    window.addEventListener("resize", resize);

    if (reduced) {
      draw(0);
    } else {
      rafId = requestAnimationFrame(frame);
    }

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointermove", onPointer);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, [cell]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        display: "block",
        background: "#030408",
      }}
    />
  );
}
