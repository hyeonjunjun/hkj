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
    const perim = 2 * (w + h);

    if (isActive) {
      /* ── Phase 1: Initial bounce (0-0.8s)
           Fast energy pulse — large displacement that decays
         ── Phase 2: Calm flow (0.8s+)
           Gentle sine undulation traveling along the border */

      const bounceDecay = Math.max(0, 1 - timeSinceActive / 0.8);
      const bounceAmp = bounceDecay * 4; // px displacement during bounce
      const bounceSpeed = 12; // fast oscillation during bounce

      const calmAmp = 1.8; // px displacement during calm flow
      const calmSpeed = 0.4; // slow traveling wave
      const calmWaveLen = 0.15; // wavelength as fraction of perimeter

      // The bright segment: a region of higher brightness that
      // slowly sweeps around the perimeter
      const brightPos = (time * 0.06) % 1.0; // slow sweep, 0-1
      const brightWidth = 0.25; // 25% of perimeter is bright

      ctx.save();
      ctx.translate(PAD, PAD);

      // Draw the flowing border as a thick path with varying alpha
      for (let seg = 0; seg < SAMPLES; seg++) {
        const t0 = seg / SAMPLES;
        const t1 = (seg + 1) / SAMPLES;

        const p0 = getPerimeterPoint(t0, w, h);
        const p1 = getPerimeterPoint(t1, w, h);

        // Calculate displacement for this point
        const wave = Math.sin(t0 * (1 / calmWaveLen) * Math.PI * 2 - time * calmSpeed * Math.PI * 2);
        const displacement = wave * calmAmp + Math.sin(t0 * 30 + time * bounceSpeed) * bounceAmp;

        const wave1 = Math.sin(t1 * (1 / calmWaveLen) * Math.PI * 2 - time * calmSpeed * Math.PI * 2);
        const displacement1 = wave1 * calmAmp + Math.sin(t1 * 30 + time * bounceSpeed) * bounceAmp;

        // Displaced positions
        const x0 = p0.x + p0.nx * displacement;
        const y0 = p0.y + p0.ny * displacement;
        const x1 = p1.x + p1.nx * displacement1;
        const y1 = p1.y + p1.ny * displacement1;

        // Brightness: smooth falloff from bright segment
        let dist = Math.abs(t0 - brightPos);
        if (dist > 0.5) dist = 1 - dist; // wrap around
        const brightFactor = Math.max(0, 1 - dist / (brightWidth / 2));
        const smoothBright = brightFactor * brightFactor * (3 - 2 * brightFactor); // smoothstep

        // Base alpha + bright boost
        const baseAlpha = 0.15; // dim static border
        const brightAlpha = 0.85;
        const alpha = baseAlpha + smoothBright * (brightAlpha - baseAlpha);

        // Color: dim segments are white, bright segments are gold
        const r = Math.round(255 - smoothBright * (255 - cr));
        const g = Math.round(255 - smoothBright * (255 - cg));
        const b = Math.round(255 - smoothBright * (255 - cb));

        // Line width varies: thicker in bright segment
        const lineW = 1 + smoothBright * 1;

        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        ctx.lineWidth = lineW;
        ctx.lineCap = "round";
        ctx.stroke();

        // Glow layer on bright segments
        if (smoothBright > 0.1) {
          ctx.beginPath();
          ctx.moveTo(x0, y0);
          ctx.lineTo(x1, y1);
          ctx.strokeStyle = `rgba(${cr}, ${cg}, ${cb}, ${smoothBright * 0.15})`;
          ctx.lineWidth = lineW + 6;
          ctx.filter = "blur(4px)";
          ctx.stroke();
          ctx.filter = "none";
        }
      }

      // Corner accent dots — small bright circles at the 4 corners
      const corners = [
        { x: 0, y: 0 },
        { x: w, y: 0 },
        { x: w, y: h },
        { x: 0, y: h },
      ];
      for (const c of corners) {
        const grad = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, 6);
        grad.addColorStop(0, `rgba(${cr}, ${cg}, ${cb}, 0.6)`);
        grad.addColorStop(0.5, `rgba(${cr}, ${cg}, ${cb}, 0.15)`);
        grad.addColorStop(1, `rgba(${cr}, ${cg}, ${cb}, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(c.x, c.y, 6, 0, Math.PI * 2);
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

    /* ── Inner glow when active ──────────────────────────── */
    if (isActive) {
      ctx.save();
      ctx.translate(PAD, PAD);
      const glowGrad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) * 0.7);
      glowGrad.addColorStop(0, `rgba(${cr}, ${cg}, ${cb}, 0.04)`);
      glowGrad.addColorStop(0.5, `rgba(${cr}, ${cg}, ${cb}, 0.02)`);
      glowGrad.addColorStop(1, `rgba(${cr}, ${cg}, ${cb}, 0)`);
      ctx.fillStyle = glowGrad;
      ctx.fillRect(-10, -10, w + 20, h + 20);
      ctx.restore();
    }

    /* ── Outer bloom when active ─────────────────────────── */
    if (isActive) {
      ctx.save();
      ctx.translate(PAD, PAD);
      const bloomGrad = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.4, w / 2, h / 2, Math.max(w, h) * 0.9);
      bloomGrad.addColorStop(0, `rgba(${cr}, ${cg}, ${cb}, 0.06)`);
      bloomGrad.addColorStop(0.6, `rgba(${cr}, ${cg}, ${cb}, 0.025)`);
      bloomGrad.addColorStop(1, `rgba(${cr}, ${cg}, ${cb}, 0)`);
      ctx.fillStyle = bloomGrad;
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
  cornerSize = 16,
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
  activeRef.current = active;
  accentRef.current = accentColor;

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
