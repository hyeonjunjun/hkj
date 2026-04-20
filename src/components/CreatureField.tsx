"use client";

import { useEffect, useRef } from "react";
import type { Mode } from "@/hooks/useMode";
import type { Theme } from "@/hooks/useTheme";

type Props = {
  mode: Mode;
  theme: Theme;
  count?: number;
};

type Creature = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  ax: number;
  ay: number;
  phase: number;
  size: number;
  alpha: number; // 0..1 — used for scatter/enter transitions
};

const DEFAULT_COUNT = 22;
const MAX_SPEED = 1.15;
const MAX_ACCEL = 0.08;
const CURSOR_ATTR_RADIUS = 420;
const CURSOR_ATTR_WEIGHT = 0.035;
const SEPARATION_RADIUS = 22;
const NEIGHBOR_RADIUS = 70;
const SEPARATION_WEIGHT = 1.6;
const ALIGNMENT_WEIGHT = 0.9;
const COHESION_WEIGHT = 0.55;

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function limit(vx: number, vy: number, max: number): [number, number] {
  const m = Math.hypot(vx, vy);
  if (m > max) {
    const k = max / m;
    return [vx * k, vy * k];
  }
  return [vx, vy];
}

export default function CreatureField({
  mode,
  theme,
  count = DEFAULT_COUNT,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const creaturesRef = useRef<Creature[]>([]);
  const modeRef = useRef<Mode>(mode);
  const themeRef = useRef<Theme>(theme);
  const pointerRef = useRef({ x: 0, y: 0, active: false });
  const dimRef = useRef({ w: 0, h: 0, dpr: 1 });
  const rafRef = useRef<number | null>(null);
  const transitionRef = useRef({ t: 1, from: mode, to: mode }); // 1 = stable

  // Keep refs synced with props
  useEffect(() => {
    const prev = modeRef.current;
    if (prev !== mode) {
      // begin a transition: scatter old, enter new
      transitionRef.current = { t: 0, from: prev, to: mode };
    }
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    dimRef.current.dpr = dpr;

    const resize = () => {
      const parent = canvas.parentElement;
      const w = parent ? parent.clientWidth : window.innerWidth;
      const h = parent ? parent.clientHeight : window.innerHeight;
      dimRef.current.w = w;
      dimRef.current.h = h;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    // Seed creatures
    const seed = (): Creature[] => {
      const { w, h } = dimRef.current;
      const arr: Creature[] = [];
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = rand(0.3, 0.8);
        arr.push({
          x: rand(0.1 * w, 0.9 * w),
          y: rand(0.15 * h, 0.85 * h),
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          ax: 0,
          ay: 0,
          phase: Math.random() * Math.PI * 2,
          size: rand(0.9, 1.15),
          alpha: 1,
        });
      }
      return arr;
    };
    creaturesRef.current = seed();

    // Pointer
    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointerRef.current.x = e.clientX - rect.left;
      pointerRef.current.y = e.clientY - rect.top;
      pointerRef.current.active = true;
    };
    const onLeave = () => {
      pointerRef.current.active = false;
    };
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Color resolver — read from CSS tokens so dark theme swaps automatically
    const getInkColor = (alpha: number) => {
      const isDark = themeRef.current === "dark";
      // inline values matching globals.css tokens (avoids getComputedStyle per-frame)
      if (isDark) {
        return `rgba(234, 226, 212, ${alpha})`;
      }
      return `rgba(28, 28, 26, ${alpha})`;
    };

    const getStardustColor = (alpha: number) => `rgba(245, 239, 227, ${alpha})`;

    // Draw a single creature based on current mode
    const drawCreature = (c: Creature, currentMode: Mode) => {
      const angle = Math.atan2(c.vy, c.vx);
      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.rotate(angle);
      const a = c.alpha;

      if (currentMode === "sea") {
        // Fish — elongated oval body + triangle tail
        ctx.fillStyle = getInkColor(0.72 * a);
        const L = 11 * c.size;
        const B = 3.4 * c.size;
        ctx.beginPath();
        ctx.ellipse(0, 0, L, B, 0, 0, Math.PI * 2);
        ctx.fill();
        // tail
        ctx.beginPath();
        ctx.moveTo(-L, 0);
        ctx.lineTo(-L - 5 * c.size, -3 * c.size);
        ctx.lineTo(-L - 5 * c.size, 3 * c.size);
        ctx.closePath();
        ctx.fill();
      } else if (currentMode === "land") {
        // Bee — round body with faint wing arcs
        ctx.fillStyle = getInkColor(0.75 * a);
        const R = 3.4 * c.size;
        ctx.beginPath();
        ctx.arc(0, 0, R, 0, Math.PI * 2);
        ctx.fill();
        // wings — thin arcs above body
        const wingFlap = Math.sin(c.phase) * 0.3 + 0.7;
        ctx.strokeStyle = getInkColor(0.28 * a * wingFlap);
        ctx.lineWidth = 1;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.arc(-1, -2 * c.size, 3 * c.size, Math.PI, Math.PI * 1.8);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(1, -2 * c.size, 3 * c.size, Math.PI * 1.2, Math.PI * 2);
        ctx.stroke();
      } else if (currentMode === "sky") {
        // Bird — open chevron V
        ctx.strokeStyle = getInkColor(0.78 * a);
        ctx.lineWidth = 1.4;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        const W = 8 * c.size;
        const H = 3 * c.size;
        ctx.beginPath();
        ctx.moveTo(-W, H);
        ctx.lineTo(0, -H * 0.4);
        ctx.lineTo(W, H);
        ctx.stroke();
      } else {
        // SPACE — star / cross primitive
        const isDark = themeRef.current === "dark";
        if (isDark) {
          // bright point + subtle halo
          ctx.fillStyle = `rgba(245, 239, 227, ${0.92 * a})`;
          ctx.beginPath();
          ctx.arc(0, 0, 1.4 * c.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = `rgba(245, 239, 227, ${0.22 * a})`;
          ctx.beginPath();
          ctx.arc(0, 0, 3.2 * c.size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // ink 4-ray cross (tiny plus)
          ctx.strokeStyle = getInkColor(0.72 * a);
          ctx.lineWidth = 1;
          ctx.lineCap = "round";
          const L = 3 * c.size;
          ctx.beginPath();
          ctx.moveTo(-L, 0);
          ctx.lineTo(L, 0);
          ctx.moveTo(0, -L);
          ctx.lineTo(0, L);
          ctx.stroke();
        }
      }

      ctx.restore();

      // Stardust aura — ALL modes in dark theme (conceptual reveal)
      if (themeRef.current === "dark" && currentMode !== "space") {
        const particles = 3;
        for (let k = 0; k < particles; k++) {
          const pAngle = c.phase + (k * Math.PI * 2) / particles + performance.now() * 0.0003;
          const pDist = 9 + Math.sin(c.phase * 0.8 + k) * 3;
          const px = c.x + Math.cos(pAngle) * pDist;
          const py = c.y + Math.sin(pAngle) * pDist * 0.7;
          const pAlpha = (0.25 + Math.sin(c.phase + k * 1.7) * 0.2) * a;
          ctx.fillStyle = getStardustColor(Math.max(0, pAlpha));
          ctx.fillRect(px, py, 1, 1);
        }
      }
    };

    // Simulation step — Reynolds boids + cursor attraction + bounds
    const step = () => {
      const { w, h } = dimRef.current;
      const creatures = creaturesRef.current;
      const p = pointerRef.current;
      const t = transitionRef.current;

      // Advance transition: 0 scattering → 0.5 swapped → 1 stable
      if (t.t < 1) {
        t.t = Math.min(1, t.t + 0.018);
      }
      const scattering = t.t < 0.45 && t.from !== t.to; // first half = scatter old
      const settling = t.t >= 0.45 && t.t < 1 && t.from !== t.to;
      const transitionDone = t.t >= 1;

      for (let i = 0; i < creatures.length; i++) {
        const c = creatures[i];
        c.ax = 0;
        c.ay = 0;

        if (!reduced && !scattering) {
          // Boids forces
          let sepX = 0, sepY = 0, sepN = 0;
          let alignX = 0, alignY = 0, alignN = 0;
          let cohX = 0, cohY = 0, cohN = 0;

          for (let j = 0; j < creatures.length; j++) {
            if (i === j) continue;
            const o = creatures[j];
            const dx = c.x - o.x;
            const dy = c.y - o.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < SEPARATION_RADIUS * SEPARATION_RADIUS && d2 > 0.01) {
              const d = Math.sqrt(d2);
              sepX += dx / d;
              sepY += dy / d;
              sepN++;
            }
            if (d2 < NEIGHBOR_RADIUS * NEIGHBOR_RADIUS) {
              alignX += o.vx;
              alignY += o.vy;
              alignN++;
              cohX += o.x;
              cohY += o.y;
              cohN++;
            }
          }

          if (sepN > 0) {
            c.ax += (sepX / sepN) * SEPARATION_WEIGHT * 0.05;
            c.ay += (sepY / sepN) * SEPARATION_WEIGHT * 0.05;
          }
          if (alignN > 0) {
            c.ax += ((alignX / alignN) - c.vx) * ALIGNMENT_WEIGHT * 0.04;
            c.ay += ((alignY / alignN) - c.vy) * ALIGNMENT_WEIGHT * 0.04;
          }
          if (cohN > 0) {
            const tx = cohX / cohN;
            const ty = cohY / cohN;
            c.ax += (tx - c.x) * COHESION_WEIGHT * 0.0006;
            c.ay += (ty - c.y) * COHESION_WEIGHT * 0.0006;
          }

          // Cursor attraction — slow, only when pointer is in canvas
          if (p.active) {
            const dx = p.x - c.x;
            const dy = p.y - c.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < CURSOR_ATTR_RADIUS * CURSOR_ATTR_RADIUS) {
              const falloff = 1 - Math.sqrt(d2) / CURSOR_ATTR_RADIUS;
              c.ax += dx * CURSOR_ATTR_WEIGHT * 0.004 * falloff;
              c.ay += dy * CURSOR_ATTR_WEIGHT * 0.004 * falloff;
            }
          }

          // Bounds — gentle steer back inward
          const margin = 60;
          if (c.x < margin) c.ax += (margin - c.x) * 0.0004;
          if (c.x > w - margin) c.ax -= (c.x - (w - margin)) * 0.0004;
          if (c.y < margin) c.ay += (margin - c.y) * 0.0004;
          if (c.y > h - margin) c.ay -= (c.y - (h - margin)) * 0.0004;
        }

        // scattering — apply outward push away from center
        if (scattering) {
          const dx = c.x - w / 2;
          const dy = c.y - h / 2;
          const d = Math.hypot(dx, dy) || 1;
          c.ax += (dx / d) * 0.12;
          c.ay += (dy / d) * 0.12;
          // fade
          c.alpha = Math.max(0, 1 - t.t / 0.45);
        } else if (settling) {
          // just after swap — fade in new creatures from edges
          const ease = (t.t - 0.45) / 0.55;
          c.alpha = Math.min(1, ease * 1.4);
        } else if (transitionDone) {
          c.alpha = 1;
        }

        if (!reduced) {
          // Apply acceleration
          const [clampedAx, clampedAy] = limit(c.ax, c.ay, MAX_ACCEL);
          c.vx += clampedAx;
          c.vy += clampedAy;
          // Clamp velocity
          const [cvx, cvy] = limit(c.vx, c.vy, MAX_SPEED);
          c.vx = cvx;
          c.vy = cvy;
          c.x += c.vx;
          c.y += c.vy;
          c.phase += 0.08;
        }

        // Respawn if scattered beyond bounds (for settling phase)
        if (settling && (c.x < -30 || c.x > w + 30 || c.y < -30 || c.y > h + 30)) {
          // re-enter from a random edge
          const edge = Math.floor(Math.random() * 4);
          const speed = rand(0.6, 1.0);
          if (edge === 0) { c.x = -10; c.y = rand(0, h); c.vx = speed; c.vy = rand(-0.3, 0.3); }
          else if (edge === 1) { c.x = w + 10; c.y = rand(0, h); c.vx = -speed; c.vy = rand(-0.3, 0.3); }
          else if (edge === 2) { c.x = rand(0, w); c.y = -10; c.vx = rand(-0.3, 0.3); c.vy = speed; }
          else { c.x = rand(0, w); c.y = h + 10; c.vx = rand(-0.3, 0.3); c.vy = -speed; }
        }

        // If stable and creature drifted off-screen somehow, wrap back
        if (transitionDone && !reduced) {
          if (c.x < -20) c.x = w + 20;
          else if (c.x > w + 20) c.x = -20;
          if (c.y < -20) c.y = h + 20;
          else if (c.y > h + 20) c.y = -20;
        }
      }

      // Render
      ctx.clearRect(0, 0, w, h);
      const currentMode = settling || transitionDone ? t.to : t.from;
      for (let i = 0; i < creatures.length; i++) {
        const c = creatures[i];
        if (c.alpha <= 0.01) continue;
        drawCreature(c, currentMode);
      }

      rafRef.current = window.requestAnimationFrame(step);
    };

    rafRef.current = window.requestAnimationFrame(step);

    return () => {
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, [count]);

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
      }}
    />
  );
}
