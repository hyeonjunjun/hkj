"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import Lenis from "lenis";
import { gsap } from "@/lib/gsap";
import type { Piece } from "@/constants/pieces";

interface HorizontalGridProps {
  pieces: Piece[];
  onCenterChange?: (index: number) => void;
  onScrollProgress?: (progress: number) => void;
}

// Height AND width variants for organic rhythm — [width, height]
const LAYOUT_PATTERN: Array<[string, string]> = [
  ["clamp(180px, 22vw, 300px)", "55vh"],   // medium, short
  ["clamp(240px, 30vw, 420px)", "72vh"],   // wide, tall
  ["clamp(140px, 16vw, 220px)", "45vh"],   // narrow, shorter
  ["clamp(220px, 26vw, 360px)", "68vh"],   // medium-wide, medium-tall
  ["clamp(160px, 18vw, 260px)", "50vh"],   // narrow-medium, medium
  ["clamp(260px, 32vw, 450px)", "74vh"],   // widest, tallest
];

export default function HorizontalGrid({
  pieces,
  onCenterChange,
  onScrollProgress,
}: HorizontalGridProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);
  const lenisRef = useRef<Lenis | null>(null);
  const resetLock = useRef(false);
  const activeRef = useRef(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const tripled = [...pieces, ...pieces, ...pieces];
  const singleSetCount = pieces.length;

  const getCenterScrollStart = useCallback(() => {
    const item = itemRefs.current[singleSetCount];
    return item ? item.offsetLeft - 64 : 0;
  }, [singleSetCount]);

  const getCenterScrollEnd = useCallback(() => {
    const item = itemRefs.current[singleSetCount * 2 - 1];
    return item ? item.offsetLeft + item.offsetWidth : Infinity;
  }, [singleSetCount]);

  // Lenis setup
  useEffect(() => {
    const wrapper = wrapperRef.current;
    const content = contentRef.current;
    if (!wrapper || !content) return;

    const lenis = new Lenis({
      wrapper,
      content,
      orientation: "horizontal" as const,
      smoothWheel: true,
      lerp: 0.07,
      wheelMultiplier: 1.2,
      touchMultiplier: 1.5,
    });
    lenisRef.current = lenis;

    // Jump to center set
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        lenis.scrollTo(getCenterScrollStart(), { immediate: true });
      });
    });

    lenis.on("scroll", (e: { scroll: number; velocity: number; limit: number }) => {
      // Velocity skew
      const skew = Math.max(-3, Math.min(3, e.velocity * 0.1));
      itemRefs.current.forEach((el) => {
        if (el) el.style.transform = `skewX(${skew}deg)`;
      });

      // Center item detection
      const containerCenter = wrapper.clientWidth / 2;
      let closest = 0;
      let minDist = Infinity;
      for (let i = singleSetCount; i < singleSetCount * 2; i++) {
        const el = itemRefs.current[i];
        if (!el) continue;
        const itemCenter = el.offsetLeft + el.offsetWidth / 2 - e.scroll;
        const dist = Math.abs(itemCenter - containerCenter);
        if (dist < minDist) {
          minDist = dist;
          closest = i - singleSetCount;
        }
      }
      if (closest !== activeRef.current) {
        activeRef.current = closest;
        onCenterChange?.(closest);
      }

      // Progress
      const centerStart = getCenterScrollStart();
      const centerEnd = getCenterScrollEnd();
      const scrollWidth = centerEnd - centerStart;
      if (scrollWidth > 0) {
        const progress = Math.max(0, Math.min(1, (e.scroll - centerStart) / scrollWidth));
        onScrollProgress?.(progress);
      }

      // Infinite reset
      if (resetLock.current) return;
      const cStart = getCenterScrollStart();
      const cEnd = getCenterScrollEnd();
      const sWidth = cEnd - cStart;

      if (e.scroll < cStart - 200) {
        resetLock.current = true;
        lenis.scrollTo(e.scroll + sWidth, { immediate: true });
        requestAnimationFrame(() => { resetLock.current = false; });
      } else if (e.scroll > cEnd + 200) {
        resetLock.current = true;
        lenis.scrollTo(e.scroll - sWidth, { immediate: true });
        requestAnimationFrame(() => { resetLock.current = false; });
      }
    });

    let raf: number;
    function tick(time: number) {
      lenis.raf(time);
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, [getCenterScrollStart, getCenterScrollEnd, singleSetCount, onCenterChange, onScrollProgress]);

  // Entrance
  useEffect(() => {
    itemRefs.current.forEach((el) => {
      if (el) el.style.opacity = "1";
    });

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const centerItems = itemRefs.current
      .slice(singleSetCount, singleSetCount * 2)
      .filter(Boolean);

    gsap.fromTo(
      centerItems,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, stagger: 0.05, duration: 0.6, ease: "power3.out", delay: 0.15 }
    );
  }, [singleSetCount]);

  return (
    <div
      ref={wrapperRef}
      style={{
        width: "100%",
        height: "100%",
        overflowX: "auto",
        overflowY: "hidden",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      <div
        ref={contentRef}
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: "clamp(6px, 1vw, 12px)",
          height: "100%",
          padding: "0 var(--grid-margin)",
          paddingBottom: "clamp(36px, 6vh, 64px)",
        }}
      >
        {tripled.map((piece, i) => {
          const patternIdx = i % LAYOUT_PATTERN.length;
          const [width, height] = LAYOUT_PATTERN[patternIdx];
          const href =
            piece.type === "project"
              ? `/work/${piece.slug}`
              : `/lab/${piece.slug}`;
          const realIdx = i % singleSetCount;
          const isHovered = hoveredIndex === i;
          const num = String(realIdx + 1).padStart(2, "0");

          const isDark = isDarkColor(piece.cover.bg);
          const textColor = isDark
            ? "rgba(255,252,245,0.88)"
            : "rgba(28,26,23,0.80)";
          const mutedColor = isDark
            ? "rgba(255,252,245,0.40)"
            : "rgba(28,26,23,0.30)";

          return (
            <Link
              key={`${piece.slug}-${i}`}
              ref={(el) => { itemRefs.current[i] = el; }}
              href={href}
              style={{
                display: "block",
                flexShrink: 0,
                width,
                height,
                position: "relative",
                backgroundColor: piece.cover.bg,
                overflow: "hidden",
                textDecoration: "none",
                transition: "transform 0.12s ease-out",
                willChange: "transform",
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
                  sizes="30vw"
                  style={{
                    objectFit: "cover",
                    transition: "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
                    transform: isHovered ? "scale(1.04)" : "scale(1)",
                  }}
                  priority={i >= singleSetCount && i < singleSetCount + 3}
                />
              )}

              {/* Grain */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity: 0.08,
                  filter: "url(#grain)",
                  background: piece.cover.bg,
                  mixBlendMode: "multiply",
                  pointerEvents: "none",
                  zIndex: 1,
                }}
              />

              {/* Hover overlay — title + number + tags */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  zIndex: 3,
                  pointerEvents: "none",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  padding: "clamp(8px, 2%, 14px)",
                  opacity: isHovered ? 1 : 0,
                  transition: "opacity 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
                }}
              >
                {/* Top: number */}
                <span
                  className="font-mono"
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.06em",
                    color: mutedColor,
                  }}
                >
                  {num}
                </span>

                {/* Bottom: title + tags */}
                <div
                  style={{
                    transform: isHovered ? "translateY(0)" : "translateY(6px)",
                    transition: "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
                  }}
                >
                  <p
                    className="font-display"
                    style={{
                      fontSize: "clamp(13px, 1.4vw, 18px)",
                      fontWeight: 400,
                      lineHeight: 1.15,
                      color: textColor,
                      marginBottom: 3,
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
          );
        })}
      </div>
    </div>
  );
}

function isDarkColor(hex: string): boolean {
  const clean = hex.replace("#", "");
  if (clean.length < 6) return false;
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.5;
}
