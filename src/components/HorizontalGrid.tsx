"use client";

import { useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import Lenis from "lenis";
import { gsap } from "@/lib/gsap";
import type { Piece } from "@/constants/pieces";

interface HorizontalGridProps {
  pieces: Piece[];
}

// Height variants for visual rhythm
const HEIGHT_PATTERN = [
  "55vh", "72vh", "45vh", "68vh", "50vh", "74vh",
];

/**
 * Infinite horizontal scroll gallery.
 * Items are tripled (left copy + center original + right copy).
 * When scroll reaches the edge copies, it silently resets to the center set.
 */
export default function HorizontalGrid({ pieces }: HorizontalGridProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);
  const lenisRef = useRef<Lenis | null>(null);
  const resetLock = useRef(false);

  // Triple the items for infinite illusion
  const tripled = [...pieces, ...pieces, ...pieces];
  const singleSetCount = pieces.length;

  // Calculate the scroll position of the center set
  const getCenterScrollStart = useCallback(() => {
    const items = itemRefs.current;
    const startItem = items[singleSetCount];
    if (!startItem) return 0;
    return startItem.offsetLeft - 64; // account for padding
  }, [singleSetCount]);

  const getCenterScrollEnd = useCallback(() => {
    const items = itemRefs.current;
    const endItem = items[singleSetCount * 2 - 1];
    if (!endItem) return Infinity;
    return endItem.offsetLeft + endItem.offsetWidth;
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

    // Wait for layout to settle, then jump to center set
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const centerStart = getCenterScrollStart();
        lenis.scrollTo(centerStart, { immediate: true });
      });
    });

    // Velocity-based skew + infinite scroll reset
    lenis.on("scroll", (e: { scroll: number; velocity: number; limit: number }) => {
      // Skew
      const skew = Math.max(-3, Math.min(3, e.velocity * 0.12));
      itemRefs.current.forEach((el) => {
        if (el) el.style.transform = `skewX(${skew}deg)`;
      });

      // Infinite scroll: reset to center when reaching edges
      if (resetLock.current) return;

      const centerStart = getCenterScrollStart();
      const centerEnd = getCenterScrollEnd();
      const scrollWidth = centerEnd - centerStart;

      if (e.scroll < centerStart - 100) {
        resetLock.current = true;
        lenis.scrollTo(e.scroll + scrollWidth, { immediate: true });
        requestAnimationFrame(() => { resetLock.current = false; });
      } else if (e.scroll > centerEnd + 100) {
        resetLock.current = true;
        lenis.scrollTo(e.scroll - scrollWidth, { immediate: true });
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
  }, [getCenterScrollStart, getCenterScrollEnd]);

  // Entrance animation
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      itemRefs.current.forEach((el) => {
        if (el) el.style.opacity = "1";
      });
      return;
    }

    // Only animate the center set for entrance
    const centerItems = itemRefs.current.slice(singleSetCount, singleSetCount * 2).filter(Boolean);
    // Make all items visible first (clones shouldn't be hidden)
    itemRefs.current.forEach((el) => {
      if (el) el.style.opacity = "1";
    });

    gsap.fromTo(
      centerItems,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.06,
        duration: 0.7,
        ease: "power3.out",
        delay: 0.15,
      }
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
          gap: "clamp(8px, 1.2vw, 14px)",
          height: "100%",
          padding: "0 var(--grid-margin)",
          paddingBottom: "clamp(40px, 7vh, 72px)",
        }}
      >
        {tripled.map((piece, i) => {
          const heightIdx = i % HEIGHT_PATTERN.length;
          const height = HEIGHT_PATTERN[heightIdx];
          const href =
            piece.type === "project"
              ? `/work/${piece.slug}`
              : `/lab/${piece.slug}`;

          return (
            <Link
              key={`${piece.slug}-${i}`}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              href={href}
              style={{
                display: "block",
                flexShrink: 0,
                width: "clamp(160px, 20vw, 280px)",
                height,
                position: "relative",
                backgroundColor: piece.cover.bg,
                overflow: "hidden",
                textDecoration: "none",
                transition: "transform 0.12s ease-out",
                willChange: "transform",
              }}
              aria-label={`View ${piece.title}`}
            >
              {/* Image */}
              {piece.image && (
                <Image
                  src={piece.image}
                  alt={piece.title}
                  fill
                  sizes="20vw"
                  style={{ objectFit: "cover" }}
                  priority={i >= singleSetCount && i < singleSetCount + 3}
                />
              )}

              {/* Grain */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity: 0.1,
                  filter: "url(#grain)",
                  background: piece.cover.bg,
                  mixBlendMode: "multiply",
                  pointerEvents: "none",
                  zIndex: 1,
                }}
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
