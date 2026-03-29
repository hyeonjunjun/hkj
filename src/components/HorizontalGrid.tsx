"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import type { Piece } from "@/constants/pieces";

interface HorizontalGridProps {
  pieces: Piece[];
  onCenterChange?: (index: number) => void;
}

/*
 * Wheel-driven horizontal gallery — Awwwards reference implementation.
 *
 * - Varied item sizes with dramatic contrast (200px → 480px)
 * - Vertical stagger (top/center/bottom alignment)
 * - Titles visible at rest (not just on hover)
 * - Dim-siblings on hover (opacity 0.4)
 * - Image scale(1.05) on hover
 * - Clip-path entrance with easeInOutQuart
 * - Velocity-based skew (±2deg)
 * - 20px gaps (editorial standard)
 */

// Dramatic size variation — [width, height, verticalAlign]
const LAYOUT: Array<{
  w: string;
  h: string;
  align: "flex-start" | "flex-end" | "center";
}> = [
  { w: "clamp(220px, 26vw, 380px)", h: "56vh", align: "flex-end" },
  { w: "clamp(300px, 36vw, 500px)", h: "72vh", align: "flex-start" },
  { w: "clamp(160px, 18vw, 240px)", h: "40vh", align: "center" },
  { w: "clamp(260px, 30vw, 440px)", h: "65vh", align: "flex-end" },
  { w: "clamp(180px, 20vw, 280px)", h: "48vh", align: "flex-start" },
  { w: "clamp(340px, 38vw, 520px)", h: "74vh", align: "center" },
];

export default function HorizontalGrid({
  pieces,
  onCenterChange,
}: HorizontalGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);
  const scrollX = useRef(0);
  const targetX = useRef(0);
  const maxScroll = useRef(0);
  const activeRef = useRef(0);
  const velocityRef = useRef(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    const updateBounds = () => {
      maxScroll.current = Math.max(0, track.scrollWidth - container.clientWidth);
    };
    updateBounds();
    window.addEventListener("resize", updateBounds);

    // Smooth RAF loop
    let raf: number;
    const tick = () => {
      const prev = scrollX.current;
      scrollX.current += (targetX.current - scrollX.current) * 0.08;
      velocityRef.current = scrollX.current - prev;

      // Skew
      const skew = gsap.utils.clamp(-2, 2, velocityRef.current * 0.25);
      track.style.transform = `translateX(${-scrollX.current}px) skewX(${skew}deg)`;

      // Center detection
      const centerX = container.clientWidth / 2 + scrollX.current;
      let closest = 0;
      let minDist = Infinity;
      itemRefs.current.forEach((el, i) => {
        if (!el) return;
        const mid = el.offsetLeft + el.offsetWidth / 2;
        const dist = Math.abs(mid - centerX);
        if (dist < minDist) {
          minDist = dist;
          closest = i;
        }
      });
      if (closest !== activeRef.current) {
        activeRef.current = closest;
        onCenterChange?.(closest);
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // Wheel
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY || e.deltaX;
      targetX.current = gsap.utils.clamp(0, maxScroll.current, targetX.current + delta);
    };

    // Touch
    let touchStartX = 0;
    let touchStartScroll = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
      touchStartScroll = targetX.current;
    };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const deltaX = touchStartX - e.touches[0].clientX;
      targetX.current = gsap.utils.clamp(0, maxScroll.current, touchStartScroll + deltaX);
    };

    container.addEventListener("wheel", onWheel, { passive: false });
    container.addEventListener("touchstart", onTouchStart, { passive: true });
    container.addEventListener("touchmove", onTouchMove, { passive: false });

    // Entrance — clip-path reveal with easeInOutQuart
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.fromTo(
        itemRefs.current.filter(Boolean),
        { clipPath: "inset(100% 0% 0% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 0.9,
          stagger: 0.06,
          ease: "circ.inOut",
          delay: 0.4,
        }
      );
    } else {
      itemRefs.current.forEach((el) => {
        if (el) el.style.clipPath = "none";
      });
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", updateBounds);
      container.removeEventListener("wheel", onWheel);
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchmove", onTouchMove);
    };
  }, [onCenterChange]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
        cursor: "grab",
        userSelect: "none",
      }}
    >
      <div
        ref={trackRef}
        style={{
          display: "flex",
          gap: 20,
          height: "100%",
          padding: "0 var(--grid-margin)",
          paddingBottom: "clamp(32px, 5vh, 56px)",
          alignItems: "center",
          willChange: "transform",
        }}
      >
        {pieces.map((piece, i) => {
          const layout = LAYOUT[i % LAYOUT.length];
          const href =
            piece.type === "project"
              ? `/work/${piece.slug}`
              : `/lab/${piece.slug}`;
          const isHovered = hoveredIndex === i;
          const isDimmed = hoveredIndex !== null && hoveredIndex !== i;
          const num = String(i + 1).padStart(2, "0");

          const isDark = isDarkBg(piece.cover.bg);
          const textOnCover = isDark
            ? "rgba(255,252,245,0.90)"
            : "rgba(42,37,32,0.82)";
          const mutedOnCover = isDark
            ? "rgba(255,252,245,0.45)"
            : "rgba(42,37,32,0.32)";

          return (
            <div
              key={piece.slug}
              ref={(el) => { itemRefs.current[i] = el; }}
              style={{
                flexShrink: 0,
                width: layout.w,
                alignSelf: layout.align,
                display: "flex",
                flexDirection: "column",
                gap: 10,
                clipPath: "inset(100% 0% 0% 0%)",
                opacity: isDimmed ? 0.4 : 1,
                transition: "opacity 300ms cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            >
              {/* Image container */}
              <Link
                href={href}
                style={{
                  display: "block",
                  width: "100%",
                  height: layout.h,
                  position: "relative",
                  backgroundColor: piece.cover.bg,
                  overflow: "hidden",
                  textDecoration: "none",
                }}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                aria-label={`View ${piece.title}`}
              >
                {piece.image && (
                  <Image
                    src={piece.image}
                    alt={piece.title}
                    fill
                    sizes="(max-width: 768px) 60vw, 30vw"
                    style={{
                      objectFit: "cover",
                      transition: "transform 600ms cubic-bezier(0.22, 1, 0.36, 1)",
                      transform: isHovered ? "scale(1.05)" : "scale(1)",
                    }}
                    priority={i < 3}
                  />
                )}

                {/* Grain */}
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    inset: 0,
                    opacity: 0.06,
                    filter: "url(#grain)",
                    background: piece.cover.bg,
                    mixBlendMode: "multiply",
                    pointerEvents: "none",
                  }}
                />

                {/* Number — always visible, top-left */}
                <span
                  className="font-mono"
                  style={{
                    position: "absolute",
                    top: 12,
                    left: 14,
                    fontSize: "var(--text-label)",
                    letterSpacing: "var(--tracking-label)",
                    color: mutedOnCover,
                    zIndex: 2,
                  }}
                >
                  {num}
                </span>
              </Link>

              {/* Title + tags — ALWAYS visible below image */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  gap: 12,
                }}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <span
                  className="font-body"
                  style={{
                    fontSize: "var(--text-body)",
                    color: "var(--ink-90)",
                    lineHeight: "var(--leading-body)",
                  }}
                >
                  {piece.title}
                </span>
                <span
                  className="font-mono"
                  style={{
                    fontSize: "var(--text-label)",
                    letterSpacing: "var(--tracking-label)",
                    textTransform: "uppercase",
                    color: "var(--ink-muted)",
                    flexShrink: 0,
                  }}
                >
                  {piece.tags[0]}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function isDarkBg(hex: string): boolean {
  const c = hex.replace("#", "");
  if (c.length < 6) return false;
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.5;
}
