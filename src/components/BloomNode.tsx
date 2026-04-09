"use client";

import {
  useRef,
  useEffect,
  useCallback,
  type ReactNode,
  type CSSProperties,
} from "react";

/* ════════════════════════════════════════════════════════════
   BloomNode — 1:1 WuWa active-state treatment

   Layers (inactive → active cascade):
     1. Border brightens + gold tint           0-200ms
     2. Inner glow fills the glass             100-400ms
     3. Outer bloom radiates into void         200-500ms
     4. Particle motes orbit the border        300ms+
     5. Corner marks brighten to gold          0-200ms

   Reverse: particles die → bloom contracts →
            glow fades → border dims           400ms total
   ════════════════════════════════════════════════════════════ */

interface BloomNodeProps {
  active: boolean;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Gold accent override — defaults to --gold (#C4A265) */
  accentColor?: string;
  /** Size of corner registration marks in px */
  cornerSize?: number;
  /** Disable particle canvas (for small elements) */
  noParticles?: boolean;
  /** HTML element type */
  as?: "div" | "button" | "a" | "li" | "nav";
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

/* ── Particle system (Canvas 2D) ─────────────────────────── */

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  maxLife: number;
  /** Which edge the particle spawned from: 0=top, 1=right, 2=bottom, 3=left */
  edge: number;
}

function spawnParticle(w: number, h: number): Particle {
  const edge = Math.floor(Math.random() * 4);
  let x: number, y: number;

  switch (edge) {
    case 0: // top
      x = Math.random() * w;
      y = 0;
      break;
    case 1: // right
      x = w;
      y = Math.random() * h;
      break;
    case 2: // bottom
      x = Math.random() * w;
      y = h;
      break;
    default: // left
      x = 0;
      y = Math.random() * h;
      break;
  }

  // Drift outward from the edge + slight upward float
  const angle = Math.atan2(y - h / 2, x - w / 2) + (Math.random() - 0.5) * 0.8;
  const speed = 0.15 + Math.random() * 0.35;

  return {
    x,
    y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed - 0.1, // slight upward bias
    size: 1.2 + Math.random() * 2.5,
    life: 1.0,
    maxLife: 2 + Math.random() * 2, // 2-4 seconds
    edge,
  };
}

function runParticleCanvas(
  canvas: HTMLCanvasElement,
  activeRef: { current: boolean },
  accentRef: { current: string }
) {
  const ctx = canvas.getContext("2d")!;
  if (!canvas.getContext("2d")) return () => {};

  const particles: Particle[] = [];
  const MAX_PARTICLES = 15;
  let raf = 0;
  let spawnTimer = 0;

  function resize() {
    const rect = canvas.parentElement?.getBoundingClientRect();
    if (!rect) return;
    const dpr = Math.min(window.devicePixelRatio, 2);
    const pad = 40;
    canvas.width = (rect.width + pad * 2) * dpr;
    canvas.height = (rect.height + pad * 2) * dpr;
    canvas.style.width = `${rect.width + pad * 2}px`;
    canvas.style.height = `${rect.height + pad * 2}px`;
    canvas.style.left = `${-pad}px`;
    canvas.style.top = `${-pad}px`;
    ctx.resetTransform();
    ctx.scale(dpr, dpr);
  }

  resize();

  function hexToRgb(hex: string): [number, number, number] {
    const h = hex.replace("#", "");
    return [
      parseInt(h.substring(0, 2), 16),
      parseInt(h.substring(2, 4), 16),
      parseInt(h.substring(4, 6), 16),
    ];
  }

  function frame() {
    const w = parseFloat(canvas.style.width);
    const h = parseFloat(canvas.style.height);
    const pad = 40;

    ctx.clearRect(0, 0, w, h);

    if (activeRef.current) {
      // Spawn particles from edges
      spawnTimer += 1 / 60;
      if (spawnTimer > 0.15 && particles.length < MAX_PARTICLES) {
        // Spawn relative to the inner content area (not the padded canvas)
        const innerW = w - pad * 2;
        const innerH = h - pad * 2;
        const p = spawnParticle(innerW, innerH);
        p.x += pad;
        p.y += pad;
        particles.push(p);
        spawnTimer = 0;
      }
    }

    const [cr, cg, cb] = hexToRgb(accentRef.current);

    // Update and draw particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= (1 / 60) / p.maxLife;

      if (p.life <= 0) {
        particles.splice(i, 1);
        continue;
      }

      // Fade curve: quick in, linger, fade out
      const fadeIn = Math.min((1 - p.life) * 8, 1);
      const fadeOut = p.life;
      const alpha = Math.min(fadeIn, fadeOut);

      // Hot white core → gold mid → transparent edge
      const grad = ctx.createRadialGradient(
        p.x, p.y, 0,
        p.x, p.y, p.size * 6
      );
      // White-hot center
      grad.addColorStop(0, `rgba(255, 240, 200, ${alpha * 0.9})`);
      // Gold mid
      grad.addColorStop(0.15, `rgba(${Math.min(cr + 60, 255)}, ${Math.min(cg + 50, 255)}, ${cb + 30}, ${alpha * 0.7})`);
      // Warm falloff
      grad.addColorStop(0.4, `rgba(${cr}, ${cg}, ${cb}, ${alpha * 0.25})`);
      grad.addColorStop(1, `rgba(${cr}, ${cg}, ${cb}, 0)`);

      ctx.globalCompositeOperation = "lighter";
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = "source-over";
    }

    raf = requestAnimationFrame(frame);
  }

  raf = requestAnimationFrame(frame);

  const onResize = () => resize();
  window.addEventListener("resize", onResize);

  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("resize", onResize);
  };
}

/* ── Main component ──────────────────────────────────────── */

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

  // Start/stop particle canvas
  useEffect(() => {
    if (noParticles || !canvasRef.current) return;
    cleanupRef.current = runParticleCanvas(canvasRef.current, activeRef, accentRef);
    return () => {
      cleanupRef.current?.();
    };
  }, [noParticles]);

  /* ── CSS for the bloom cascade ─────────────────────────── */
  /* WuWa's active state is BOLD. The element is a lantern.
     The glow actually illuminates the surrounding void. */

  const borderColor = active
    ? `rgba(196, 162, 101, 0.6)`
    : `rgba(255, 255, 255, 0.06)`;

  const combinedShadow = active
    ? [
        // Inner glow — warm light filling the glass
        `inset 0 0 20px rgba(196, 162, 101, 0.15)`,
        `inset 0 0 50px rgba(196, 162, 101, 0.07)`,
        // Tight outer glow — the bright edge bloom
        `0 0 15px 2px rgba(196, 162, 101, 0.2)`,
        // Medium bloom — light radiating outward
        `0 0 40px 8px rgba(196, 162, 101, 0.12)`,
        // Wide atmospheric bloom — illuminating the void
        `0 0 80px 24px rgba(196, 162, 101, 0.06)`,
        `0 0 120px 40px rgba(196, 162, 101, 0.03)`,
      ].join(", ")
    : "none";

  const cornerColor = active
    ? `rgba(196, 162, 101, 0.8)`
    : `rgba(255, 255, 255, 0.06)`;

  const cs = cornerSize;

  const containerStyle: CSSProperties = {
    position: "relative",
    border: `1px solid ${borderColor}`,
    boxShadow: combinedShadow,
    transition: active
      ? "border-color 200ms var(--ease-swift), box-shadow 500ms var(--ease-swift) 100ms"
      : "border-color 200ms var(--ease-swift), box-shadow 300ms var(--ease-swift)",
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
      {/* Corner registration marks — 4 L-shaped marks OUTSIDE the border */}
      {/* Top-left */}
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          top: -1,
          left: -1,
          width: cs,
          height: cs,
          borderTop: `1px solid ${cornerColor}`,
          borderLeft: `1px solid ${cornerColor}`,
          pointerEvents: "none",
          transition: "border-color 200ms var(--ease-swift)",
        }}
      />
      {/* Top-right */}
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          top: -1,
          right: -1,
          width: cs,
          height: cs,
          borderTop: `1px solid ${cornerColor}`,
          borderRight: `1px solid ${cornerColor}`,
          pointerEvents: "none",
          transition: "border-color 200ms var(--ease-swift)",
        }}
      />
      {/* Bottom-left */}
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: -1,
          left: -1,
          width: cs,
          height: cs,
          borderBottom: `1px solid ${cornerColor}`,
          borderLeft: `1px solid ${cornerColor}`,
          pointerEvents: "none",
          transition: "border-color 200ms var(--ease-swift)",
        }}
      />
      {/* Bottom-right */}
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: -1,
          right: -1,
          width: cs,
          height: cs,
          borderBottom: `1px solid ${cornerColor}`,
          borderRight: `1px solid ${cornerColor}`,
          pointerEvents: "none",
          transition: "border-color 200ms var(--ease-swift)",
        }}
      />

      {/* Vertical light streak — the WuWa signature line through the element */}
      {active && (
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "-40%",
            bottom: "-40%",
            left: "50%",
            width: 1,
            transform: "translateX(-0.5px)",
            background: `linear-gradient(
              180deg,
              transparent 0%,
              rgba(196, 162, 101, 0.03) 15%,
              rgba(196, 162, 101, 0.12) 35%,
              rgba(196, 162, 101, 0.25) 50%,
              rgba(196, 162, 101, 0.12) 65%,
              rgba(196, 162, 101, 0.03) 85%,
              transparent 100%
            )`,
            pointerEvents: "none",
            zIndex: -1,
            opacity: active ? 1 : 0,
            transition: "opacity 400ms var(--ease-swift)",
          }}
        />
      )}

      {/* Particle canvas — positioned to overflow beyond the border */}
      {!noParticles && (
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          style={{
            position: "absolute",
            pointerEvents: "none",
            zIndex: -1,
          }}
        />
      )}

      {/* Content */}
      {children}
    </Tag>
  );
}
