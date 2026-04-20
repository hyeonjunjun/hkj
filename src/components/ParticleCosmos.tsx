"use client";

import { useEffect, useRef } from "react";

type Props = {
  /** Public-path URL to the hero cosmos image. Drop your 1:1 reference into
   *  public/assets/cosmos-hero.jpg to replace it without touching code. */
  imageSrc?: string;
  /** Particle count for the foreground starfield. Scales with viewport area. */
  particleCount?: number;
  /** Max Ken Burns zoom factor over the loop period. 1.04 = 4% zoom. */
  zoomMax?: number;
  /** Full zoom cycle length in ms. */
  loopMs?: number;
};

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  baseAlpha: number;
  phase: number;
  kind: "star" | "dust" | "sparkle";
};

const DEFAULT_IMAGE = "/assets/cosmos-hero.jpg";

export default function ParticleCosmos({
  imageSrc = DEFAULT_IMAGE,
  particleCount,
  zoomMax = 1.045,
  loopMs = 120_000,
}: Props) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointerRef = useRef({ nx: 0, ny: 0, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0;
    let H = 0;
    let rafId = 0;
    let particles: Particle[] = [];

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resize = () => {
      const parent = canvas.parentElement;
      const w = parent ? parent.clientWidth : window.innerWidth;
      const h = parent ? parent.clientHeight : window.innerHeight;
      W = w;
      H = h;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const seed = () => {
      const area = W * H;
      const target =
        particleCount ??
        Math.round(Math.min(2800, Math.max(900, area * 0.0018)));
      particles = [];
      for (let i = 0; i < target; i++) {
        const r = Math.random();
        let kind: Particle["kind"];
        if (r < 0.08) kind = "sparkle";
        else if (r < 0.45) kind = "dust";
        else kind = "star";

        const size =
          kind === "sparkle"
            ? 1.2 + Math.random() * 1.4
            : kind === "star"
              ? 0.7 + Math.random() * 0.9
              : 0.6 + Math.random() * 1.1;
        const baseAlpha =
          kind === "sparkle"
            ? 0.85 + Math.random() * 0.1
            : kind === "star"
              ? 0.45 + Math.random() * 0.45
              : 0.12 + Math.random() * 0.18;
        const speedMult = kind === "dust" ? 0.22 : 0.1;
        const angle = Math.random() * Math.PI * 2;
        particles.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: Math.cos(angle) * speedMult,
          vy: Math.sin(angle) * speedMult,
          size,
          baseAlpha,
          phase: Math.random() * Math.PI * 2,
          kind,
        });
      }
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

    const frame = (now: number) => {
      const t = now - boot;
      // Smooth pointer towards 0 when inactive (particles recenter)
      const targetPx = pointerRef.current.active ? pointerRef.current.nx : 0;
      const targetPy = pointerRef.current.active ? pointerRef.current.ny : 0;
      smoothPx += (targetPx - smoothPx) * 0.04;
      smoothPy += (targetPy - smoothPy) * 0.04;

      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = "source-over";

      // Particle pass — additive for star glow
      ctx.globalCompositeOperation = "lighter";

      const parallaxMagX = 12;
      const parallaxMagY = 8;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (!reduced) {
          p.x += p.vx;
          p.y += p.vy;
          p.phase += 0.012;
          // Wrap around edges
          if (p.x < -5) p.x = W + 5;
          else if (p.x > W + 5) p.x = -5;
          if (p.y < -5) p.y = H + 5;
          else if (p.y > H + 5) p.y = -5;
        }

        // Parallax — dust moves more, stars less (Depth cue)
        const pMul = p.kind === "dust" ? 1.6 : p.kind === "star" ? 0.6 : 1.0;
        const px = p.x - smoothPx * parallaxMagX * pMul;
        const py = p.y - smoothPy * parallaxMagY * pMul;

        // Twinkle — star and sparkle pulse asynchronously
        let alpha = p.baseAlpha;
        if (!reduced) {
          if (p.kind === "star") {
            alpha *= 0.7 + 0.3 * Math.sin(p.phase * 1.6);
          } else if (p.kind === "sparkle") {
            alpha *= 0.55 + 0.45 * Math.sin(p.phase * 0.9);
          }
        }

        // Color — sparkles warm, stars cool, dust faint blue
        if (p.kind === "sparkle") {
          const g = ctx.createRadialGradient(px, py, 0, px, py, p.size * 3);
          g.addColorStop(0, `rgba(255, 236, 200, ${Math.min(1, alpha)})`);
          g.addColorStop(0.5, `rgba(255, 200, 140, ${alpha * 0.4})`);
          g.addColorStop(1, `rgba(255, 180, 120, 0)`);
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(px, py, p.size * 3, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.kind === "star") {
          ctx.fillStyle = `rgba(230, 230, 240, ${alpha})`;
          ctx.fillRect(px - p.size / 2, py - p.size / 2, p.size, p.size);
        } else {
          // dust
          ctx.fillStyle = `rgba(140, 170, 210, ${alpha})`;
          ctx.fillRect(px - p.size / 2, py - p.size / 2, p.size, p.size);
        }
      }

      ctx.globalCompositeOperation = "source-over";

      rafId = window.requestAnimationFrame(frame);
    };

    resize();
    window.addEventListener("resize", resize);
    rafId = window.requestAnimationFrame(frame);

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointermove", onPointer);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, [particleCount]);

  return (
    <div ref={wrapRef} className="cosmos-wrap" aria-hidden>
      {/* Base photographic layer — the Hubble image. Ken Burns zoom via CSS. */}
      <div
        className="cosmos-bg"
        style={{
          backgroundImage: `url(${imageSrc})`,
          animationDuration: `${loopMs}ms`,
          ["--zoom-max" as string]: String(zoomMax),
        }}
      />
      {/* Hidden image for preload + onload signaling */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imageRef}
        src={imageSrc}
        alt=""
        style={{ display: "none" }}
        decoding="async"
      />
      {/* Particle canvas — additive blending */}
      <canvas ref={canvasRef} className="cosmos-canvas" />
      {/* Vignette — darkens edges, keeps focus central */}
      <div className="cosmos-vignette" />
      {/* Grain — film noise overlay */}
      <div className="cosmos-grain" />

      <style>{`
        .cosmos-wrap {
          position: absolute;
          inset: 0;
          overflow: hidden;
          background: #050710;
        }
        .cosmos-bg {
          position: absolute;
          inset: -4%;
          background-position: center;
          background-size: cover;
          background-repeat: no-repeat;
          filter: saturate(1.08) contrast(1.02);
          animation-name: cosmos-ken-burns;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
          animation-direction: alternate;
          will-change: transform;
        }
        @keyframes cosmos-ken-burns {
          0%   { transform: scale(1) translate3d(0, 0, 0); }
          100% { transform: scale(var(--zoom-max, 1.045)) translate3d(-1%, -0.5%, 0); }
        }
        .cosmos-canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          display: block;
          mix-blend-mode: screen;
        }
        .cosmos-vignette {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            radial-gradient(
              ellipse at center,
              rgba(0, 0, 0, 0) 35%,
              rgba(0, 0, 0, 0.28) 72%,
              rgba(0, 0, 0, 0.55) 100%
            );
        }
        .cosmos-grain {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.08;
          background-image: url("/assets/grain-200x200.png");
          background-size: 200px 200px;
          mix-blend-mode: overlay;
        }
        @media (prefers-reduced-motion: reduce) {
          .cosmos-bg { animation: none; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
