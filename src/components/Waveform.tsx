"use client";

import { useRef, useEffect } from "react";
import { useStore } from "@/store/useStore";
import { PIECES, type WaveMode } from "@/constants/pieces";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/* ── color helpers ─────────────────────────────────────── */

interface RGB {
  r: number;
  g: number;
  b: number;
}

const REST_COLOR: RGB = { r: 35, g: 32, b: 28 };
const REST_ALPHA = 0.1;

function hexToRgb(hex: string): RGB {
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.substring(0, 2), 16),
    g: parseInt(h.substring(2, 4), 16),
    b: parseInt(h.substring(4, 6), 16),
  };
}

function lerpN(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/* ── wave state (mutable, no React state) ──────────────── */

interface WaveState {
  amplitude: number;
  frequency: number;
  color: RGB;
  alpha: number;
  phase: number;
  waveMode: WaveMode;
}

/* ── rest defaults ─────────────────────────────────────── */

const REST_AMPLITUDE = 8;
const REST_FREQUENCY = 0.003;
const SPEED = 0.0008;
const LERP = 0.04;

/* ── component ─────────────────────────────────────────── */

export default function Waveform() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const reducedMotion = useReducedMotion();

  /* mutable refs so the rAF loop never triggers re-renders */
  const cursorRef = useRef({ x: -9999, y: -9999 });
  const stateRef = useRef<WaveState>({
    amplitude: REST_AMPLITUDE,
    frequency: REST_FREQUENCY,
    color: { ...REST_COLOR },
    alpha: REST_ALPHA,
    phase: 0,
    waveMode: "sine",
  });

  /* read store values outside the loop (zustand subscribe) */
  const slugRef = useRef<string | null>(null);

  useEffect(() => {
    const unsub = useStore.subscribe((s) => {
      slugRef.current = s.hoveredSlug ?? s.activeZoneSlug ?? null;
    });
    return unsub;
  }, []);

  /* ── canvas resize ─────────────────────────────────── */

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let resizeTimer: ReturnType<typeof setTimeout>;

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      canvas!.width = window.innerWidth * dpr;
      canvas!.height = 120 * dpr;
      canvas!.style.width = `${window.innerWidth}px`;
      canvas!.style.height = "120px";
      const ctx = canvas!.getContext("2d");
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resize();

    function onResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 150);
    }

    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  /* ── mouse tracking ────────────────────────────────── */

  useEffect(() => {
    function onMove(e: MouseEvent) {
      cursorRef.current.x = e.clientX;
      cursorRef.current.y = e.clientY;
    }
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  /* ── animation loop ────────────────────────────────── */

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const st = stateRef.current;

    function frame() {
      if (!ctx || !canvas) return;

      const w = parseFloat(canvas.style.width);
      const h = 120;
      const centerY = h / 2;

      /* ── determine targets from slug ── */
      const slug = slugRef.current;
      const piece = slug ? PIECES.find((p) => p.slug === slug) : null;

      let targetAmp = REST_AMPLITUDE;
      let targetFreq = REST_FREQUENCY;
      let targetColor: RGB = REST_COLOR;
      let targetAlpha = REST_ALPHA;
      let targetMode: WaveMode = "sine";

      if (piece) {
        targetAmp = piece.amplitude || REST_AMPLITUDE;
        targetFreq = piece.frequency || REST_FREQUENCY;
        if (piece.accent) {
          targetColor = hexToRgb(piece.accent);
          targetAlpha = 1;
        }
        targetMode = piece.waveMode;
      }

      /* ── lerp current → target ── */
      if (reducedMotion) {
        st.color = { ...targetColor };
        st.alpha = targetAlpha;
      } else {
        st.amplitude = lerpN(st.amplitude, targetAmp, LERP);
        st.frequency = lerpN(st.frequency, targetFreq, LERP);
        st.color.r = lerpN(st.color.r, targetColor.r, LERP);
        st.color.g = lerpN(st.color.g, targetColor.g, LERP);
        st.color.b = lerpN(st.color.b, targetColor.b, LERP);
        st.alpha = lerpN(st.alpha, targetAlpha, LERP);
        st.waveMode = targetMode;
      }

      /* ── clear ── */
      ctx.clearRect(0, 0, w, h);

      /* ── reduced motion: static line ── */
      if (reducedMotion) {
        ctx.beginPath();
        ctx.moveTo(0, centerY);
        ctx.lineTo(w, centerY);
        const c = st.color;
        ctx.strokeStyle = `rgba(${Math.round(c.r)},${Math.round(c.g)},${Math.round(c.b)},${st.alpha.toFixed(2)})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        return;
      }

      /* ── advance phase ── */
      st.phase += SPEED;

      /* ── cursor proximity ── */
      const waveScreenY = window.innerHeight * 0.6; // 60vh
      const cursorY = cursorRef.current.y;
      const cursorX = cursorRef.current.x;
      const distY = Math.abs(cursorY - waveScreenY);
      const cursorActive = distY < 200;

      /* ── draw wave ── */
      ctx.beginPath();

      for (let x = 0; x <= w; x += 1) {
        let freq = st.frequency;

        // noise mode: jitter frequency
        if (st.waveMode === "noise") {
          freq *= 0.5 + Math.random();
        }

        let y =
          centerY + st.amplitude * Math.sin(x * freq + st.phase);

        // cursor gaussian bump
        if (cursorActive) {
          const proximity = 1 - distY / 200;
          const extra = 20 * proximity;
          const dx = (x - cursorX) / 75;
          y += extra * Math.exp(-0.5 * dx * dx);
        }

        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      const c = st.color;
      ctx.strokeStyle = `rgba(${Math.round(c.r)},${Math.round(c.g)},${Math.round(c.b)},${st.alpha.toFixed(2)})`;
      ctx.lineWidth = 1.5;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.stroke();

      /* secondary ghost line — creates depth/echo effect */
      ctx.globalAlpha = 0.15;
      ctx.lineWidth = 4;
      ctx.filter = "blur(3px)";
      ctx.stroke();
      ctx.filter = "none";
      ctx.globalAlpha = 1;

      rafRef.current = requestAnimationFrame(frame);
    }

    rafRef.current = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: "calc(60vh - 60px)",
        left: 0,
        width: "100%",
        height: "120px",
        zIndex: 1,
        pointerEvents: "none",
      }}
      aria-hidden="true"
    />
  );
}
