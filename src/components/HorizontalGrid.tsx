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
 * Wheel-driven horizontal gallery.
 *
 * No Lenis, no ScrollTrigger, no DOM tripling.
 * Wheel/touch delta → GSAP quickTo for smooth interpolated translateX.
 * Clamped to content bounds (no infinite loop — clean, no clipping).
 * Vertical stagger on items for organic wave rhythm.
 */

const LAYOUT: Array<{ w: string; h: string; align: "flex-start" | "flex-end" | "center" }> = [
  { w: "clamp(200px, 24vw, 340px)", h: "52vh", align: "flex-end" },
  { w: "clamp(280px, 34vw, 480px)", h: "68vh", align: "flex-start" },
  { w: "clamp(160px, 18vw, 240px)", h: "40vh", align: "center" },
  { w: "clamp(240px, 28vw, 400px)", h: "62vh", align: "flex-end" },
  { w: "clamp(180px, 20vw, 280px)", h: "46vh", align: "flex-start" },
  { w: "clamp(300px, 36vw, 500px)", h: "72vh", align: "center" },
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

    // Calculate bounds
    const updateBounds = () => {
      maxScroll.current = Math.max(0, track.scrollWidth - container.clientWidth);
    };
    updateBounds();
    window.addEventListener("resize", updateBounds);

    // Smooth animation loop
    let raf: number;
    const tick = () => {
      // Lerp toward target
      const prev = scrollX.current;
      scrollX.current += (targetX.current - scrollX.current) * 0.08;

      // Velocity for skew
      velocityRef.current = scrollX.current - prev;
      const skew = gsap.utils.clamp(-2, 2, velocityRef.current * 0.3);

      // Apply transform
      track.style.transform = `translateX(${-scrollX.current}px)`;

      // Skew items
      itemRefs.current.forEach((el) => {
        if (el) el.style.transform = `skewX(${skew}deg)`;
      });

      // Center item detection
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

    // Wheel handler
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      // Use deltaY (vertical scroll) to drive horizontal movement
      const delta = e.deltaY || e.deltaX;
      targetX.current = gsap.utils.clamp(
        0,
        maxScroll.current,
        targetX.current + delta
      );
    };

    // Touch handlers
    let touchStartX = 0;
    let touchStartScroll = 0;

    const onTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
      touchStartScroll = targetX.current;
    };

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const deltaX = touchStartX - e.touches[0].clientX;
      targetX.current = gsap.utils.clamp(
        0,
        maxScroll.current,
        touchStartScroll + deltaX
      );
    };

    container.addEventListener("wheel", onWheel, { passive: false });
    container.addEventListener("touchstart", onTouchStart, { passive: true });
    container.addEventListener("touchmove", onTouchMove, { passive: false });

    // Entrance animation
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.fromTo(
        itemRefs.current.filter(Boolean),
        { clipPath: "inset(100% 0% 0% 0%)", opacity: 0 },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          opacity: 1,
          duration: 0.9,
          stagger: 0.07,
          ease: "power3.out",
          delay: 0.3,
        }
      );
    } else {
      itemRefs.current.forEach((el) => {
        if (el) {
          el.style.opacity = "1";
          el.style.clipPath = "none";
        }
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
          gap: "clamp(10px, 1.5vw, 18px)",
          height: "100%",
          padding: "0 clamp(24px, 6vw, 100px)",
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
          const num = String(i + 1).padStart(2, "0");

          const isDark = isDarkBg(piece.cover.bg);
          const textColor = isDark
            ? "rgba(255,252,245,0.90)"
            : "rgba(28,26,23,0.82)";
          const mutedColor = isDark
            ? "rgba(255,252,245,0.40)"
            : "rgba(28,26,23,0.28)";

          return (
            <div
              key={piece.slug}
              ref={(el) => { itemRefs.current[i] = el; }}
              style={{
                flexShrink: 0,
                width: layout.w,
                height: layout.h,
                alignSelf: layout.align,
                position: "relative",
                opacity: 0,
                clipPath: "inset(100% 0% 0% 0%)",
              }}
            >
              <Link
                href={href}
                style={{
                  display: "block",
                  width: "100%",
                  height: "100%",
                  position: "relative",
                  backgroundColor: piece.cover.bg,
                  overflow: "hidden",
                  textDecoration: "none",
                }}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                aria-label={`View ${piece.title}`}
              >
                {/* Image */}
                {piece.image && (
                  <Image
                    src={piece.image}
                    alt={piece.title}
                    fill
                    sizes="(max-width: 768px) 60vw, 30vw"
                    style={{
                      objectFit: "cover",
                      transition: "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
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
                    zIndex: 1,
                  }}
                />

                {/* Hover overlay */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    zIndex: 3,
                    pointerEvents: "none",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    padding: "clamp(10px, 2.5%, 16px)",
                    opacity: isHovered ? 1 : 0,
                    transition: "opacity 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
                  }}
                >
                  <span
                    className="font-mono"
                    style={{ fontSize: 9, letterSpacing: "0.06em", color: mutedColor }}
                  >
                    {num}
                  </span>
                  <div
                    style={{
                      transform: isHovered ? "translateY(0)" : "translateY(8px)",
                      transition: "transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)",
                    }}
                  >
                    <p
                      className="font-display"
                      style={{
                        fontSize: "clamp(14px, 1.6vw, 20px)",
                        fontWeight: 400,
                        lineHeight: 1.15,
                        color: textColor,
                        marginBottom: 2,
                      }}
                    >
                      {piece.title}
                    </p>
                    <p
                      className="font-mono"
                      style={{
                        fontSize: 9,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        color: mutedColor,
                      }}
                    >
                      {piece.tags.slice(0, 2).join(" / ")}
                    </p>
                  </div>
                </div>
              </Link>
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
