"use client";

import {
  useRef,
  useEffect,
  type ReactNode,
  type CSSProperties,
} from "react";

/* ════════════════════════════════════════════════════════════
   BloomNode — WuWa active-state treatment

   The border LINE ITSELF transforms when active:
   - Inactive: static, thin, rigid rectangle
   - Active (initial): fast energy pulse — the line displaces
     rapidly like a circuit completing (the "bounce")
   - Active (settled): calm, ethereal undulation — the line
     breathes with a slow sine wave traveling along the
     perimeter. Varying brightness. Smooth fade where the
     flowing segment meets the static dim border.

   Everything is Canvas 2D. No CSS borders.
   ════════════════════════════════════════════════════════════ */

interface BloomNodeProps {
  active: boolean;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  accentColor?: string;
  cornerSize?: number;
  noParticles?: boolean;
  as?: "div" | "button" | "a" | "li" | "nav";
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

/* ── Border + particle renderer ──────────────────────────── */

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  maxLife: number;
}

function spawnParticle(w: number, h: number, pad: number): Particle {
  const perim = 2 * (w + h);
  const pos = Math.random() * perim;
  let x: number, y: number;
  if (pos < w) { x = pos; y = 0; }
  else if (pos < w + h) { x = w; y = pos - w; }
  else if (pos < 2 * w + h) { x = w - (pos - w - h); y = h; }
  else { x = 0; y = h - (pos - 2 * w - h); }

  const angle = Math.atan2(y - h / 2, x - w / 2) + (Math.random() - 0.5) * 0.6;
  const speed = 0.1 + Math.random() * 0.25;
  return {
    x: x + pad, y: y + pad,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed - 0.06,
    size: 1.0 + Math.random() * 2.0,
    life: 1.0,
    maxLife: 2.5 + Math.random() * 2,
  };
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

/* ── The main canvas renderer ────────────────────────────── */

function runBloomCanvas(
  canvas: HTMLCanvasElement,
  activeRef: { current: boolean },
  accentRef: { current: string },
  noParticles: boolean,
) {
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  if (!ctx) return () => {};

  /* Respect prefers-reduced-motion: render a single static frame and stop */
  const prefersReduced = typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const PAD = 60;
  let raf = 0;
  let time = 0;
  let activeSince = -1; // timestamp when active started, -1 = not active
  let wasActive = false;
  const particles: Particle[] = [];
  let spawnTimer = 0;

  function resize() {
    const rect = canvas.parentElement?.getBoundingClientRect();
    if (!rect) return;
    const dpr = Math.min(window.devicePixelRatio, 2);
    canvas.width = (rect.width + PAD * 2) * dpr;
    canvas.height = (rect.height + PAD * 2) * dpr;
    canvas.style.width = `${rect.width + PAD * 2}px`;
    canvas.style.height = `${rect.height + PAD * 2}px`;
    canvas.style.left = `${-PAD}px`;
    canvas.style.top = `${-PAD}px`;
    ctx.resetTransform();
    ctx.scale(dpr, dpr);
  }
  resize();

  /* ── Get points along the rectangle perimeter ─────────── */
  function getPerimeterPoint(
    t: number, // 0-1 normalized position along perimeter
    w: number,
    h: number,
  ): { x: number; y: number; nx: number; ny: number } {
    // nx, ny = outward-facing normal
    const perim = 2 * (w + h);
    const d = t * perim;

    if (d < w) {
      return { x: d, y: 0, nx: 0, ny: -1 };
    } else if (d < w + h) {
      return { x: w, y: d - w, nx: 1, ny: 0 };
    } else if (d < 2 * w + h) {
      return { x: w - (d - w - h), y: h, nx: 0, ny: 1 };
    } else {
      return { x: 0, y: h - (d - 2 * w - h), nx: -1, ny: 0 };
    }
  }

  function frame() {
    const cw = parseFloat(canvas.style.width);
    const ch = parseFloat(canvas.style.height);
    const w = cw - PAD * 2;
    const h = ch - PAD * 2;

    ctx.clearRect(0, 0, cw, ch);

    /* Under reduced motion: draw a static inactive border and stop looping */
    if (prefersReduced) {
      ctx.save();
      ctx.translate(PAD, PAD);
      ctx.strokeStyle = `rgba(255, 255, 255, 0.06)`;
      ctx.lineWidth = 1;
      ctx.strokeRect(0, 0, w, h);
      ctx.restore();
      return; // no rAF reschedule — one static frame only
    }

    time += 1 / 60;

    const isActive = activeRef.current;

    // Track activation timing
    if (isActive && !wasActive) {
      activeSince = time;
    }
    wasActive = isActive;

    const [cr, cg, cb] = hexToRgb(accentRef.current);
    const timeSinceActive = activeSince > 0 ? time - activeSince : 0;

    /* ── Draw the border ─────────────────────────────────── */

    // How many sample points around the perimeter
    const SAMPLES = 200;

    if (isActive) {
      /* ── Phase 1: Initial bounce (0-0.8s)
           Fast energy pulse — large displacement that decays
         ── Phase 2: Calm flow (0.8s+)
           Multi-line overlapping undulation with additive blending */

      /* ── BOUNCE: one clean pulse that decays exponentially ── */
      const bounceDecay = Math.exp(-timeSinceActive * 5); // fast exp decay
      const bounceAmp = bounceDecay * 2.5;
      const bounceFreq = 8;

      /* ── BRIGHT SEGMENT: tight, intense highlight ── */
      const brightPos = (time * 0.04) % 1.0; // very slow sweep
      const brightWidth = 0.12; // 12% of perimeter — concentrated

      /* ── Multi-line configs: overlapping semi-transparent strokes ── */
      const LINE_CONFIGS = [
        { ampScale: 1.0,  phaseSpeed: 0.25, phaseOffset: 0.0,  alpha: 0.30, width: 2.0, blur: 3 },
        { ampScale: 0.7,  phaseSpeed: 0.18, phaseOffset: 1.8,  alpha: 0.22, width: 2.5, blur: 4 },
        { ampScale: 1.3,  phaseSpeed: 0.32, phaseOffset: 3.6,  alpha: 0.18, width: 1.5, blur: 2 },
        { ampScale: 0.5,  phaseSpeed: 0.14, phaseOffset: 5.2,  alpha: 0.12, width: 3.0, blur: 5 },
      ];

      /* ── Triple-sine displacement (pseudo-noise) ── */
      function displacement(t: number, config: typeof LINE_CONFIGS[0]): number {
        const baseAmp = 1.2 * config.ampScale;
        const wave1 = Math.sin(t * 31.4 + time * config.phaseSpeed * 6.28 + config.phaseOffset);
        const wave2 = Math.sin(t * 17.7 + time * config.phaseSpeed * 4.10 + config.phaseOffset * 1.3) * 0.6;
        const wave3 = Math.sin(t * 53.1 + time * config.phaseSpeed * 2.73 + config.phaseOffset * 0.7) * 0.3;
        const bounceWave = Math.sin(t * 20 + time * bounceFreq);
        return (wave1 + wave2 + wave3) * baseAmp + bounceWave * bounceAmp;
      }

      ctx.save();
      ctx.translate(PAD, PAD);

      /* ── Draw all 4 lines with additive blending ── */
      ctx.globalCompositeOperation = "lighter";

      for (const config of LINE_CONFIGS) {
        ctx.filter = `blur(${config.blur}px)`;
        ctx.lineWidth = config.width;
        ctx.lineCap = "round";
        ctx.strokeStyle = `rgba(${cr}, ${cg}, ${cb}, ${config.alpha})`;

        ctx.beginPath();
        for (let seg = 0; seg <= SAMPLES; seg++) {
          const t = seg / SAMPLES;
          const p = getPerimeterPoint(t, w, h);
          const disp = displacement(t, config);
          const x = p.x + p.nx * disp;
          const y = p.y + p.ny * disp;
          if (seg === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
      }

      /* ── Bright segment overlay pass ── */
      ctx.filter = "blur(6px)";
      ctx.lineWidth = 2.5;
      ctx.lineCap = "round";

      for (let seg = 0; seg < SAMPLES; seg++) {
        const t0 = seg / SAMPLES;
        const t1 = (seg + 1) / SAMPLES;

        let dist = Math.abs(t0 - brightPos);
        if (dist > 0.5) dist = 1 - dist;
        if (dist > brightWidth / 2) continue; // outside bright window

        const brightRaw = Math.max(0, 1 - dist / (brightWidth / 2));
        const smoothBright = brightRaw * brightRaw * (3 - 2 * brightRaw);

        const p0 = getPerimeterPoint(t0, w, h);
        const p1 = getPerimeterPoint(t1, w, h);

        // Use first config for bright segment displacement
        const disp0 = displacement(t0, LINE_CONFIGS[0]);
        const disp1 = displacement(t1, LINE_CONFIGS[0]);

        const x0 = p0.x + p0.nx * disp0;
        const y0 = p0.y + p0.ny * disp0;
        const x1 = p1.x + p1.nx * disp1;
        const y1 = p1.y + p1.ny * disp1;

        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.strokeStyle = `rgba(255, 240, 200, ${smoothBright * 0.5})`;
        ctx.stroke();
      }

      /* ── Reset blending and filter ── */
      ctx.filter = "none";
      ctx.globalCompositeOperation = "source-over";

      // Corner accent — tiny bright points at the 4 vertices
      const corners = [
        { x: 0, y: 0 },
        { x: w, y: 0 },
        { x: w, y: h },
        { x: 0, y: h },
      ];
      for (const c of corners) {
        // Tight bright dot
        const grad = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, 4);
        grad.addColorStop(0, `rgba(255, 235, 180, 0.7)`);
        grad.addColorStop(0.3, `rgba(${cr}, ${cg}, ${cb}, 0.35)`);
        grad.addColorStop(1, `rgba(${cr}, ${cg}, ${cb}, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(c.x, c.y, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    } else {
      // Inactive: simple static dim border
      ctx.save();
      ctx.translate(PAD, PAD);
      ctx.strokeStyle = `rgba(255, 255, 255, 0.06)`;
      ctx.lineWidth = 1;
      ctx.strokeRect(0, 0, w, h);
      ctx.restore();
    }

    /* ── Subtle atmospheric fill when active ────────────── */
    if (isActive) {
      ctx.save();
      ctx.translate(PAD, PAD);

      // Very faint warm wash inside — barely perceptible
      const innerGrad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) * 0.6);
      innerGrad.addColorStop(0, `rgba(${cr}, ${cg}, ${cb}, 0.025)`);
      innerGrad.addColorStop(1, `rgba(${cr}, ${cg}, ${cb}, 0)`);
      ctx.fillStyle = innerGrad;
      ctx.fillRect(0, 0, w, h);

      // Outer atmospheric bloom — the light spilling into the void
      const outerGrad = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.5, w / 2, h / 2, Math.max(w, h) * 0.85);
      outerGrad.addColorStop(0, `rgba(${cr}, ${cg}, ${cb}, 0.035)`);
      outerGrad.addColorStop(0.5, `rgba(${cr}, ${cg}, ${cb}, 0.015)`);
      outerGrad.addColorStop(1, `rgba(${cr}, ${cg}, ${cb}, 0)`);
      ctx.fillStyle = outerGrad;
      ctx.fillRect(-PAD, -PAD, w + PAD * 2, h + PAD * 2);

      ctx.restore();
    }

    /* ── Particles ───────────────────────────────────────── */
    if (!noParticles) {
      if (isActive) {
        spawnTimer += 1 / 60;
        if (spawnTimer > 0.15 && particles.length < 15) {
          particles.push(spawnParticle(w, h, PAD));
          spawnTimer = 0;
        }
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= (1 / 60) / p.maxLife;
        if (p.life <= 0) { particles.splice(i, 1); continue; }

        const fadeIn = Math.min((1 - p.life) * 6, 1);
        const alpha = Math.min(fadeIn, p.life);
        const r = p.size * 5;

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
        grad.addColorStop(0, `rgba(255, 245, 210, ${alpha * 0.8})`);
        grad.addColorStop(0.15, `rgba(${Math.min(cr + 50, 255)}, ${Math.min(cg + 40, 255)}, ${cb + 20}, ${alpha * 0.5})`);
        grad.addColorStop(0.4, `rgba(${cr}, ${cg}, ${cb}, ${alpha * 0.15})`);
        grad.addColorStop(1, `rgba(${cr}, ${cg}, ${cb}, 0)`);

        ctx.globalCompositeOperation = "lighter";
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalCompositeOperation = "source-over";
      }
    }

    raf = requestAnimationFrame(frame);
  }

  raf = requestAnimationFrame(frame);
  const onResize = () => resize();
  window.addEventListener("resize", onResize);
  return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
}

/* ── Component ───────────────────────────────────────────── */

export default function BloomNode({
  active,
  children,
  className = "",
  style = {},
  accentColor = "#C4A265",
  noParticles = false,
  as: Tag = "div",
  onClick,
  onMouseEnter,
  onMouseLeave,
}: BloomNodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(active);
  const accentRef = useRef(accentColor);
  const cleanupRef = useRef<(() => void) | null>(null);

  /* Keep refs in sync with props — effect-based to avoid updating during render */
  useEffect(() => {
    activeRef.current = active;
  }, [active]);
  useEffect(() => {
    accentRef.current = accentColor;
  }, [accentColor]);

  useEffect(() => {
    if (!canvasRef.current) return;
    cleanupRef.current = runBloomCanvas(canvasRef.current, activeRef, accentRef, noParticles);
    return () => { cleanupRef.current?.(); };
  }, [noParticles]);

  const containerStyle: CSSProperties = {
    position: "relative",
    overflow: "visible",
    border: "none",
    ...style,
  };

  return (
    <Tag
      className={className}
      style={containerStyle}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* The entire border, glow, bloom, and particles
          are rendered on this single canvas */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          pointerEvents: "none",
          zIndex: -1,
        }}
      />
      {children}
    </Tag>
  );
}
