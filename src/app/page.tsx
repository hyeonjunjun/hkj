"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { PIECES } from "@/constants/pieces";
import { CONTACT_EMAIL, SOCIALS } from "@/constants/contact";

const pieces = [...PIECES].sort((a, b) => a.order - b.order);

const TAG_MAP: Record<string, string> = {
  brand: "BD", ecommerce: "BD", "3d": "BD",
  mobile: "PD", ai: "AI", product: "PD",
  "design-system": "PD", ui: "PD",
  texture: "CD", material: "CD", webgl: "CD", generative: "CD",
};
function getTag(tags: string[]): string {
  for (const t of tags) if (TAG_MAP[t]) return TAG_MAP[t];
  return "CD";
}

type Filter = "all" | "brand" | "product" | "lab";
function matchesFilter(p: (typeof pieces)[0], f: Filter): boolean {
  if (f === "all") return true;
  if (f === "lab") return p.type === "experiment";
  if (f === "brand") return p.tags.some((t) => ["brand", "ecommerce", "3d", "texture", "material"].includes(t));
  if (f === "product") return p.tags.some((t) => ["mobile", "ai", "product", "design-system", "ui", "webgl", "generative"].includes(t));
  return true;
}

// Marker positions on the canvas (percentage of canvas size)
const MARKER_POSITIONS: Record<string, { x: number; y: number }> = {
  gyeol: { x: 20, y: 30 },
  sift: { x: 55, y: 20 },
  conductor: { x: 35, y: 55 },
  "spring-grain": { x: 75, y: 35 },
  "rain-on-stone": { x: 60, y: 65 },
  "clouds-at-sea": { x: 25, y: 75 },
};

const STATEMENT_POS = { x: 45, y: 45 };

export default function Home() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: -75, y: -50 }); // vw/vh units
  const velRef = useRef({ x: 0, y: 0 });
  const draggingRef = useRef(false);
  const lastMouseRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef(0);
  const hasDraggedRef = useRef(false);

  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeFilter, setActiveFilter] = useState<Filter>("all");
  const [showInvite, setShowInvite] = useState(true);
  const [time, setTime] = useState("");

  const hoveredPiece = pieces.find((p) => p.slug === hoveredSlug);

  // Clock
  useEffect(() => {
    const fmt = () => setTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }));
    fmt();
    const i = setInterval(fmt, 1000);
    return () => clearInterval(i);
  }, []);

  // Apply canvas position
  const applyTransform = useCallback(() => {
    if (!canvasRef.current) return;
    canvasRef.current.style.transform = `translate(${posRef.current.x}vw, ${posRef.current.y}vh)`;
  }, []);

  // Momentum loop
  useEffect(() => {
    const loop = () => {
      if (!draggingRef.current) {
        const vx = velRef.current.x;
        const vy = velRef.current.y;
        if (Math.abs(vx) > 0.01 || Math.abs(vy) > 0.01) {
          posRef.current.x += vx;
          posRef.current.y += vy;
          velRef.current.x *= 0.95;
          velRef.current.y *= 0.95;

          // Boundaries: clamp with rubber-band
          const minX = -150; // can't pan past left edge
          const maxX = 0;
          const minY = -100;
          const maxY = 0;
          if (posRef.current.x < minX) { posRef.current.x += (minX - posRef.current.x) * 0.2; velRef.current.x = 0; }
          if (posRef.current.x > maxX) { posRef.current.x += (maxX - posRef.current.x) * 0.2; velRef.current.x = 0; }
          if (posRef.current.y < minY) { posRef.current.y += (minY - posRef.current.y) * 0.2; velRef.current.y = 0; }
          if (posRef.current.y > maxY) { posRef.current.y += (maxY - posRef.current.y) * 0.2; velRef.current.y = 0; }

          applyTransform();
        }
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [applyTransform]);

  // Drag handlers
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      draggingRef.current = true;
      document.body.classList.add("is-dragging");
      lastMouseRef.current = { x: e.clientX, y: e.clientY };
      velRef.current = { x: 0, y: 0 };
    };
    const onMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      if (!draggingRef.current) return;
      const dx = e.clientX - lastMouseRef.current.x;
      const dy = e.clientY - lastMouseRef.current.y;
      // Convert px to vw/vh
      const vwPx = window.innerWidth / 100;
      const vhPx = window.innerHeight / 100;
      posRef.current.x += dx / vwPx;
      posRef.current.y += dy / vhPx;
      velRef.current = { x: dx / vwPx, y: dy / vhPx };
      lastMouseRef.current = { x: e.clientX, y: e.clientY };
      applyTransform();
      if (!hasDraggedRef.current) {
        hasDraggedRef.current = true;
        setShowInvite(false);
      }
    };
    const onUp = () => {
      draggingRef.current = false;
      document.body.classList.remove("is-dragging");
    };

    // Touch
    const onTouchStart = (e: TouchEvent) => {
      draggingRef.current = true;
      lastMouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      velRef.current = { x: 0, y: 0 };
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!draggingRef.current) return;
      const dx = e.touches[0].clientX - lastMouseRef.current.x;
      const dy = e.touches[0].clientY - lastMouseRef.current.y;
      const vwPx = window.innerWidth / 100;
      const vhPx = window.innerHeight / 100;
      posRef.current.x += dx / vwPx;
      posRef.current.y += dy / vhPx;
      velRef.current = { x: dx / vwPx, y: dy / vhPx };
      lastMouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      applyTransform();
      if (!hasDraggedRef.current) { hasDraggedRef.current = true; setShowInvite(false); }
    };
    const onTouchEnd = () => { draggingRef.current = false; };

    window.addEventListener("mousedown", onDown);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);

    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [applyTransform]);

  // Entrance animation
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.querySelectorAll(".edge-label, .sidebar, .invitation, .latest-card, .marker").forEach((el) => {
        (el as HTMLElement).style.opacity = "1";
      });
      return;
    }

    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

    // Zoom out
    if (canvasRef.current) {
      gsap.set(canvasRef.current, { scale: 1.2 });
      tl.to(canvasRef.current, { scale: 1, duration: 1.2 }, 0);
    }

    // Edge labels
    tl.to(".edge-label", { opacity: 1, duration: 0.5, stagger: 0.05 }, 0.4);

    // Sidebar
    tl.to(".sidebar", { opacity: 1, x: 0, duration: 0.5 }, 0.6);

    // Markers
    tl.to(".marker", { opacity: 1, duration: 0.4, stagger: 0.1 }, 0.8);

    // Invitation
    tl.to(".invitation", { opacity: 1, duration: 0.4 }, 1.2);

    // Latest card
    tl.to(".latest-card", { opacity: 1, duration: 0.4 }, 1.0);
  }, []);

  const filters: { label: string; value: Filter }[] = [
    { label: "All", value: "all" },
    { label: "Brand", value: "brand" },
    { label: "Product", value: "product" },
    { label: "Lab", value: "lab" },
  ];

  return (
    <>
      {/* ═══ PANNABLE CANVAS ═══ */}
      <div
        ref={canvasRef}
        className={`sky-canvas entrance-zoom${hoveredSlug ? " has-hover" : ""}`}
        id="main"
      >
        {/* Project markers */}
        {pieces.map((piece) => {
          const pos = MARKER_POSITIONS[piece.slug];
          if (!pos) return null;
          const globalIdx = pieces.indexOf(piece);
          const href = piece.type === "project" ? `/work/${piece.slug}` : `/lab/${piece.slug}`;
          const visible = matchesFilter(piece, activeFilter);

          return (
            <Link
              key={piece.slug}
              href={href}
              className="marker"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                opacity: visible ? undefined : 0.08,
                animationDelay: `${globalIdx * 0.4}s`,
              }}
              onMouseEnter={(e) => { e.stopPropagation(); setHoveredSlug(piece.slug); }}
              onMouseLeave={() => setHoveredSlug(null)}
              onClick={(e) => e.stopPropagation()}
            >
              <span className="marker-dot" />
              <span className="marker-label">
                {String(globalIdx + 1).padStart(2, "0")} {piece.title}
              </span>
            </Link>
          );
        })}

        {/* Statement marker */}
        <div
          className="marker marker--statement"
          style={{ left: `${STATEMENT_POS.x}%`, top: `${STATEMENT_POS.y}%` }}
        >
          <span className="marker-label">
            Build with intention.<br />
            Make things that feel right.
          </span>
        </div>
      </div>

      {/* ═══ HOVER TOOLTIP ═══ */}
      {hoveredPiece && (
        <div
          className="tooltip"
          style={{
            left: Math.min(mousePos.x + 16, (typeof window !== "undefined" ? window.innerWidth : 1440) - 400),
            top: Math.min(mousePos.y - 70, (typeof window !== "undefined" ? window.innerHeight : 900) - 170),
          }}
        >
          <div className="tooltip-image">
            {hoveredPiece.image ? (
              <Image
                src={hoveredPiece.image}
                alt={hoveredPiece.title}
                width={340}
                height={200}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <div className="tooltip-color" style={{ backgroundColor: hoveredPiece.cover.bg }} />
            )}
          </div>
          <div className="tooltip-text">
            <span className="tooltip-num">{String(pieces.indexOf(hoveredPiece) + 1).padStart(2, "0")}</span>
            <span className="tooltip-desc">{hoveredPiece.description}</span>
            <span className="tooltip-name">{hoveredPiece.title}</span>
            <div className="tooltip-meta">
              <span>{hoveredPiece.year}</span>
              <span>{getTag(hoveredPiece.tags)}</span>
            </div>
          </div>
        </div>
      )}

      {/* ═══ SIDEBAR NAV ═══ */}
      <nav className="sidebar">
        <Link href="/">Map</Link>
        <Link href="/about">About</Link>
        <a href={`mailto:${CONTACT_EMAIL}`}>Contact</a>
        {SOCIALS.map((s) => (
          <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer">{s.label}</a>
        ))}

        <div className="sidebar-legend">
          {filters.map((f) => (
            <div
              key={f.value}
              className={`sidebar-legend-item${activeFilter === f.value ? " active" : ""}`}
              onClick={() => setActiveFilter(f.value)}
            >
              <span className="sidebar-legend-dot" />
              {f.label}
            </div>
          ))}
        </div>
      </nav>

      {/* ═══ EDGE LABELS ═══ */}
      <span className="edge-label edge-tl">HKJ</span>
      <span className="edge-label edge-tc">{time}</span>
      <span className="edge-label edge-tr">Est. 2025</span>
      <span className="edge-label edge-bl">Design & development</span>
      <span className="edge-label edge-bc">Brands, products, concepts</span>

      <span className="edge-left-vert">DESIGN & DEVELOPMENT</span>
      <span className="edge-right-vert">CRAFTED AND HAND-CODED</span>

      {/* ═══ CENTER INVITATION ═══ */}
      <div className={`invitation${!showInvite ? " hidden" : ""}`}>
        Drag to explore
      </div>

      {/* ═══ LATEST PROJECT CARD ═══ */}
      <Link href={`/work/${pieces[0].slug}`} className="latest-card">
        <span className="latest-card-label">Latest project</span>
        <span className="latest-card-name">{pieces[0].title}</span>
        <span>{pieces[0].year}</span>
      </Link>
    </>
  );
}
