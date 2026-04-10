"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { PIECES, type Piece } from "@/constants/pieces";
import { CONTACT_EMAIL } from "@/constants/contact";

const allPieces = [...PIECES].sort((a, b) => a.order - b.order);

/* ════════════════════════════════════════════════════════════
   Hotspot positions within the panoramic scene
   (normalized 0-1 coordinates — they move WITH the pan)
   ════════════════════════════════════════════════════════════ */

type LabelSide = "left" | "right" | "top" | "bottom";

interface Hotspot {
  slug: string;
  x: number;
  y: number;
  labelSide: LabelSide;
}

const HOTSPOTS: Hotspot[] = [
  { slug: "gyeol", x: 0.72, y: 0.34, labelSide: "left" },
  { slug: "sift", x: 0.26, y: 0.54, labelSide: "right" },
  { slug: "promptineer", x: 0.62, y: 0.68, labelSide: "right" },
  { slug: "clouds-at-sea", x: 0.40, y: 0.24, labelSide: "bottom" },
];

export default function Home() {
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const panRef = useRef({ x: 0, y: 0 });
  const velocityRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX / window.innerWidth;
      mouseRef.current.y = e.clientY / window.innerHeight;
    };
    window.addEventListener("mousemove", onMove);

    const animate = () => {
      const mouse = mouseRef.current;
      /* Map mouse (0-1) to pan (-1 to +1) — center is neutral */
      const targetX = (mouse.x - 0.5) * 2;
      const targetY = (mouse.y - 0.5) * 2;

      /* Spring physics — heavy camera feel with real momentum.
         stiffness: how hard the spring pulls toward target
         friction: velocity RETENTION per frame (closer to 1 = more momentum)
         With friction 0.93, velocity only loses 7% per frame → carries
         through the target and overshoots, then oscillates back. */
      const stiffness = 0.08;
      const friction = 0.93;

      velocityRef.current.x += (targetX - panRef.current.x) * stiffness;
      velocityRef.current.y += (targetY - panRef.current.y) * stiffness;
      velocityRef.current.x *= friction;
      velocityRef.current.y *= friction;

      panRef.current.x += velocityRef.current.x;
      panRef.current.y += velocityRef.current.y;

      if (sceneRef.current) {
        /* Scene scaled 1.25 → 12.5% overflow each axis.
           Pan amplitude bumped to ±8% X, ±5% Y so the weight is visible. */
        const tx = -panRef.current.x * 8;
        const ty = -panRef.current.y * 5;
        sceneRef.current.style.transform = `scale(1.25) translate3d(${tx}%, ${ty}%, 0)`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const hoveredPiece = hoveredSlug ? allPieces.find((p) => p.slug === hoveredSlug) : null;

  return (
    <main
      id="main"
      style={{
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        position: "relative",
        background: "#0a0a0c",
      }}
    >
      {/* ════════════════════════════════════════════════════════
          LAYER 0 — The scene
          Full-viewport video, scaled for pan headroom.
          Transform updated via rAF (willChange transform).
          ════════════════════════════════════════════════════════ */}
      <div
        ref={sceneRef}
        style={{
          position: "absolute",
          inset: 0,
          transformOrigin: "center center",
          willChange: "transform",
          transform: "scale(1.25)",
        }}
      >
        <video
          src="/assets/cloudsatsea.mp4"
          autoPlay
          muted
          loop
          playsInline
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "brightness(0.7) saturate(0.85) contrast(1.08)",
          }}
        />

        {/* Warm atmospheric haze — golden hour push */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 100% 80% at 60% 40%, rgba(196,162,101,0.05) 0%, transparent 60%)",
            mixBlendMode: "screen",
            pointerEvents: "none",
          }}
        />

        {/* Subtle vignette — edges and bottom darken for HUD readability */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `
              linear-gradient(90deg, rgba(10,10,12,0.4) 0%, rgba(10,10,12,0.1) 20%, transparent 45%, transparent 80%, rgba(10,10,12,0.25) 100%),
              linear-gradient(180deg, rgba(10,10,12,0.25) 0%, transparent 15%, transparent 72%, rgba(10,10,12,0.5) 100%)
            `,
            pointerEvents: "none",
          }}
        />

        {/* ════════════════════════════════════════════════════
            LAYER 1 — Hotspots (children of scene, inherit pan)
            ════════════════════════════════════════════════════ */}
        {HOTSPOTS.map((hotspot) => {
          const piece = allPieces.find((p) => p.slug === hotspot.slug);
          if (!piece) return null;
          const isHovered = hoveredSlug === hotspot.slug;
          const isDimmed = hoveredSlug !== null && !isHovered;

          return (
            <div
              key={hotspot.slug}
              style={{
                position: "absolute",
                left: `${hotspot.x * 100}%`,
                top: `${hotspot.y * 100}%`,
                transform: "translate(-50%, -50%)",
                zIndex: 10,
                pointerEvents: "auto",
              }}
              onMouseEnter={() => setHoveredSlug(hotspot.slug)}
              onMouseLeave={() => setHoveredSlug(null)}
            >
              {/* The hotspot dot — link to case study */}
              <Link
                href={`/work/${piece.slug}`}
                aria-label={`View ${piece.title} case study`}
                style={{
                  position: "relative",
                  display: "block",
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  border: "1px solid rgba(196,162,101,0.7)",
                  background: isHovered ? "rgba(196,162,101,0.5)" : "rgba(196,162,101,0.18)",
                  boxShadow: isHovered
                    ? "0 0 24px 5px rgba(196,162,101,0.4), 0 0 48px 12px rgba(196,162,101,0.2), inset 0 0 8px rgba(255,240,200,0.7)"
                    : "0 0 14px 3px rgba(196,162,101,0.25), inset 0 0 4px rgba(255,240,200,0.4)",
                  opacity: isDimmed ? 0.4 : 1,
                  cursor: "pointer",
                  transition: "all 0.4s cubic-bezier(.23,.88,.26,.92)",
                }}
              >
                {/* Pulsing outer ring */}
                <span
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    inset: -5,
                    borderRadius: "50%",
                    border: "1px solid rgba(196,162,101,0.3)",
                    animation: "hotspot-pulse 2.8s ease-in-out infinite",
                  }}
                />
                {/* Second ring for depth */}
                <span
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    inset: -12,
                    borderRadius: "50%",
                    border: "1px solid rgba(196,162,101,0.12)",
                    animation: "hotspot-pulse 2.8s ease-in-out 0.6s infinite",
                  }}
                />
              </Link>

              {/* Editorial label — appears on hover */}
              {isHovered && <HotspotLabel piece={piece} side={hotspot.labelSide} />}
            </div>
          );
        })}
      </div>

      {/* ════════════════════════════════════════════════════════
          LAYER 2 — Glass HUD (fixed viewport position)
          ════════════════════════════════════════════════════════ */}

      {/* Top-left: HKJ wordmark */}
      <div
        style={{
          position: "fixed",
          top: "clamp(20px, 3vh, 32px)",
          left: "clamp(28px, 3.5vw, 52px)",
          zIndex: 60,
        }}
      >
        <span
          className="font-mono uppercase"
          style={{
            fontSize: 12,
            letterSpacing: "0.14em",
            color: "rgba(255,255,255,0.9)",
          }}
        >
          HKJ
        </span>
      </div>

      {/* Bottom-left: Identity panel */}
      <div
        style={{
          position: "fixed",
          bottom: "clamp(20px, 3vh, 32px)",
          left: "clamp(28px, 3.5vw, 52px)",
          zIndex: 60,
          padding: "12px 18px",
          background: "rgba(10,10,12,0.28)",
          backdropFilter: "blur(18px) saturate(1.15)",
          WebkitBackdropFilter: "blur(18px) saturate(1.15)",
          border: "1px solid rgba(255,255,255,0.05)",
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        {/* Corner registration marks */}
        <HudCorners />

        <span
          className="font-display italic"
          style={{
            fontSize: 14,
            color: "rgba(255,255,255,0.9)",
            letterSpacing: "-0.01em",
            lineHeight: 1.2,
          }}
        >
          Hyeon Jun
        </span>
        <span
          className="font-mono uppercase"
          style={{
            fontSize: 9,
            letterSpacing: "0.14em",
            color: "rgba(255,255,255,0.35)",
          }}
        >
          Design Engineer · New York
        </span>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="font-mono"
          style={{
            fontSize: 10,
            letterSpacing: "0.04em",
            color: "rgba(196,162,101,0.65)",
            marginTop: 2,
            transition: "color 0.3s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(196,162,101,1)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(196,162,101,0.65)")}
        >
          {CONTACT_EMAIL}
        </a>
      </div>

      {/* Bottom-right: System readout */}
      <div
        style={{
          position: "fixed",
          bottom: "clamp(20px, 3vh, 32px)",
          right: "clamp(28px, 3.5vw, 60px)",
          zIndex: 60,
          padding: "12px 18px",
          background: "rgba(10,10,12,0.28)",
          backdropFilter: "blur(18px) saturate(1.15)",
          WebkitBackdropFilter: "blur(18px) saturate(1.15)",
          border: "1px solid rgba(255,255,255,0.05)",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: 4,
          minWidth: 160,
        }}
      >
        <HudCorners />

        <span
          className="font-mono uppercase"
          style={{
            fontSize: 9,
            letterSpacing: "0.14em",
            color: "rgba(255,255,255,0.35)",
          }}
        >
          Environment
        </span>
        <span
          className="font-mono"
          style={{
            fontSize: 11,
            letterSpacing: "0.04em",
            color: "rgba(255,255,255,0.75)",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          Clouds at Sea
        </span>
        <span
          className="font-mono uppercase"
          style={{
            fontSize: 9,
            letterSpacing: "0.14em",
            color: "rgba(196,162,101,0.5)",
            marginTop: 2,
          }}
        >
          {String(HOTSPOTS.length).padStart(2, "0")} Signals Detected
        </span>
      </div>

      {/* Bottom-center: Contextual prompt */}
      <div
        style={{
          position: "fixed",
          bottom: "clamp(20px, 3vh, 32px)",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 60,
          padding: "10px 22px",
          background: "rgba(10,10,12,0.35)",
          backdropFilter: "blur(18px) saturate(1.15)",
          WebkitBackdropFilter: "blur(18px) saturate(1.15)",
          border: "1px solid rgba(196,162,101,0.18)",
          display: "flex",
          alignItems: "center",
          gap: 14,
          minWidth: 320,
          justifyContent: "center",
        }}
      >
        <HudCorners color="rgba(196,162,101,0.55)" />

        <span style={{ width: 18, height: 1, background: "rgba(196,162,101,0.35)" }} />
        <span
          className="font-mono uppercase"
          style={{
            fontSize: 10,
            letterSpacing: "0.16em",
            color: "rgba(255,255,255,0.6)",
            whiteSpace: "nowrap",
          }}
        >
          {hoveredPiece
            ? `Click ● to Enter ${hoveredPiece.title}`
            : "Move to Explore · Hover a Signal"}
        </span>
        <span style={{ width: 18, height: 1, background: "rgba(196,162,101,0.35)" }} />
      </div>

      {/* ════════════════════════════════════════════════════════
          Keyframes
          ════════════════════════════════════════════════════════ */}
      <style>{`
        @keyframes hotspot-pulse {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.75; transform: scale(1.5); }
        }
        @keyframes label-emerge {
          0% { opacity: 0; transform: scale(0.96); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </main>
  );
}

/* ════════════════════════════════════════════════════════════
   Corner registration marks for glass HUD panels
   ════════════════════════════════════════════════════════════ */
function HudCorners({ color = "rgba(196,162,101,0.4)" }: { color?: string }) {
  const mark: React.CSSProperties = {
    position: "absolute",
    width: 5,
    height: 5,
    pointerEvents: "none",
  };
  return (
    <>
      <span aria-hidden style={{ ...mark, top: -1, left: -1, borderTop: `1px solid ${color}`, borderLeft: `1px solid ${color}` }} />
      <span aria-hidden style={{ ...mark, top: -1, right: -1, borderTop: `1px solid ${color}`, borderRight: `1px solid ${color}` }} />
      <span aria-hidden style={{ ...mark, bottom: -1, left: -1, borderBottom: `1px solid ${color}`, borderLeft: `1px solid ${color}` }} />
      <span aria-hidden style={{ ...mark, bottom: -1, right: -1, borderBottom: `1px solid ${color}`, borderRight: `1px solid ${color}` }} />
    </>
  );
}

/* ════════════════════════════════════════════════════════════
   Editorial hotspot label with thin connecting line
   ════════════════════════════════════════════════════════════ */
function HotspotLabel({ piece, side }: { piece: Piece; side: LabelSide }) {
  const LINE_LEN = 56;
  const LABEL_OFFSET = 80;

  /* Wrapper positioning — which side of the dot the label sits on */
  const wrapperStyle: Record<LabelSide, React.CSSProperties> = {
    left: { right: LABEL_OFFSET, top: "50%", transform: "translateY(-50%)" },
    right: { left: LABEL_OFFSET, top: "50%", transform: "translateY(-50%)" },
    top: { bottom: LABEL_OFFSET, left: "50%", transform: "translateX(-50%)" },
    bottom: { top: LABEL_OFFSET, left: "50%", transform: "translateX(-50%)" },
  };

  /* Connecting line — from edge of panel back toward hotspot dot */
  const lineStyle: Record<LabelSide, React.CSSProperties> = {
    left: {
      position: "absolute",
      right: -LINE_LEN,
      top: "50%",
      width: LINE_LEN,
      height: 1,
      background: "linear-gradient(90deg, rgba(196,162,101,0.7) 0%, rgba(196,162,101,0.15) 100%)",
    },
    right: {
      position: "absolute",
      left: -LINE_LEN,
      top: "50%",
      width: LINE_LEN,
      height: 1,
      background: "linear-gradient(270deg, rgba(196,162,101,0.7) 0%, rgba(196,162,101,0.15) 100%)",
    },
    top: {
      position: "absolute",
      bottom: -LINE_LEN,
      left: "50%",
      width: 1,
      height: LINE_LEN,
      background: "linear-gradient(180deg, rgba(196,162,101,0.7) 0%, rgba(196,162,101,0.15) 100%)",
    },
    bottom: {
      position: "absolute",
      top: -LINE_LEN,
      left: "50%",
      width: 1,
      height: LINE_LEN,
      background: "linear-gradient(0deg, rgba(196,162,101,0.7) 0%, rgba(196,162,101,0.15) 100%)",
    },
  };

  return (
    <div
      style={{
        position: "absolute",
        pointerEvents: "none",
        animation: "label-emerge 0.4s cubic-bezier(.23,.88,.26,.92) forwards",
        transformOrigin: "center",
        ...wrapperStyle[side],
      }}
    >
      {/* Label panel */}
      <div
        style={{
          position: "relative",
          padding: "10px 16px",
          minWidth: 160,
          background: "rgba(10,10,12,0.75)",
          backdropFilter: "blur(14px) saturate(1.1)",
          WebkitBackdropFilter: "blur(14px) saturate(1.1)",
          border: "1px solid rgba(196,162,101,0.35)",
        }}
      >
        {/* Corner marks */}
        <HudCorners color="rgba(196,162,101,0.8)" />

        {/* Top meta row */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 4 }}>
          <span
            className="font-mono"
            style={{
              fontSize: 9,
              letterSpacing: "0.1em",
              color: "var(--gold, #C4A265)",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {piece.number}
          </span>
          <span
            className="font-mono uppercase"
            style={{ fontSize: 9, letterSpacing: "0.12em", color: "rgba(255,255,255,0.3)" }}
          >
            · {piece.sector}
          </span>
        </div>

        {/* Title */}
        <div
          className="font-display italic"
          style={{
            fontSize: 15,
            color: "rgba(255,255,255,0.95)",
            lineHeight: 1.15,
            letterSpacing: "-0.01em",
            whiteSpace: "nowrap",
          }}
        >
          {piece.title}
        </div>

        {/* Status line */}
        <div
          className="font-mono uppercase"
          style={{
            fontSize: 8,
            letterSpacing: "0.14em",
            color: "rgba(255,255,255,0.35)",
            marginTop: 5,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {piece.status === "wip" ? "WIP · " : ""}
          {piece.year} · Click to Enter
        </div>

        {/* Connecting line back to hotspot */}
        <div style={lineStyle[side]} />
      </div>
    </div>
  );
}
