"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import Lenis from "lenis";
import { gsap } from "@/lib/gsap";
import type { Piece } from "@/constants/pieces";

interface VerticalSliderProps {
  pieces: Piece[];
  onActiveChange?: (index: number) => void;
}

function isDarkColor(hex: string): boolean {
  const clean = hex.replace("#", "");
  if (clean.length < 6) return false;
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.5;
}

export default function VerticalSlider({
  pieces,
  onActiveChange,
}: VerticalSliderProps) {
  const scrollWrapperRef = useRef<HTMLDivElement>(null);
  const scrollContentRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const infoRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const activeRef = useRef(0);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // ── Lenis setup + center detection ──
  useEffect(() => {
    const wrapper = scrollWrapperRef.current;
    const content = scrollContentRef.current;
    if (!wrapper || !content) return;

    const lenis = new Lenis({
      wrapper,
      content,
      orientation: "vertical" as const,
      smoothWheel: true,
      lerp: 0.08,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });
    lenisRef.current = lenis;

    // Center detection on scroll
    lenis.on("scroll", (e: { scroll: number }) => {
      const containerCenter = wrapper.clientHeight / 2;
      let closest = 0;
      let minDist = Infinity;

      itemRefs.current.forEach((el, i) => {
        if (!el) return;
        const itemCenter = el.offsetTop + el.offsetHeight / 2 - e.scroll;
        const dist = Math.abs(itemCenter - containerCenter);
        if (dist < minDist) {
          minDist = dist;
          closest = i;
        }
      });

      if (closest !== activeRef.current) {
        activeRef.current = closest;
        setActiveIndex(closest);
        onActiveChange?.(closest);
      }
    });

    // RAF loop
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
  }, [onActiveChange]);

  // ── Text crossfade on activeIndex change ──
  useEffect(() => {
    if (!infoRef.current) return;

    tlRef.current?.kill();

    const tl = gsap.timeline();
    tlRef.current = tl;

    tl.to(infoRef.current, {
      opacity: 0,
      y: 6,
      duration: 0.15,
      ease: "power2.in",
    });
    tl.set(infoRef.current, {}); // sync point — React has re-rendered with new content
    tl.to(infoRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.3,
      ease: "power2.out",
    });
  }, [activeIndex]);

  // ── Entrance animation ──
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const validItems = itemRefs.current.filter(Boolean);
    gsap.fromTo(
      validItems,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.07,
        duration: 0.7,
        ease: "power3.out",
        delay: 0.15,
      }
    );

    if (infoRef.current) {
      gsap.fromTo(
        infoRef.current,
        { opacity: 0, x: -16 },
        { opacity: 1, x: 0, duration: 0.6, ease: "power2.out", delay: 0.3 }
      );
    }
  }, []);

  // ── Keyboard navigation ──
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!lenisRef.current) return;
      const scrollAmount = window.innerHeight * 0.7;
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        lenisRef.current.scrollTo(
          lenisRef.current.scroll + scrollAmount,
          { duration: 0.8 }
        );
      }
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        lenisRef.current.scrollTo(
          lenisRef.current.scroll - scrollAmount,
          { duration: 0.8 }
        );
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const piece = pieces[activeIndex];
  const dark = isDarkColor(piece.cover.bg);
  const textColor = dark
    ? "rgba(255,252,245,0.85)"
    : "rgba(28,26,23,0.82)";
  const mutedColor = dark
    ? "rgba(255,252,245,0.35)"
    : "rgba(28,26,23,0.28)";

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {/* ── Left Panel: Project Info ── */}
      <div
        style={{
          width: "40%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 var(--grid-margin)",
          position: "relative",
          zIndex: 10,
        }}
      >
        <div ref={infoRef} style={{ maxWidth: 320 }}>
          {/* Counter */}
          <span
            className="font-mono"
            style={{
              fontSize: 10,
              letterSpacing: "0.06em",
              color: mutedColor,
              display: "block",
              marginBottom: 16,
              fontVariantNumeric: "tabular-nums",
              transition: "color 0.4s ease",
            }}
          >
            {String(activeIndex + 1).padStart(2, "0")} /{" "}
            {String(pieces.length).padStart(2, "0")}
          </span>

          {/* Title */}
          <h2
            className="font-display"
            style={{
              fontSize: "clamp(20px, 3vw, 36px)",
              fontWeight: 400,
              lineHeight: 1.1,
              color: textColor,
              marginBottom: 12,
              transition: "color 0.4s ease",
            }}
          >
            {piece.title}
          </h2>

          {/* Description */}
          <p
            style={{
              fontSize: 13,
              lineHeight: 1.55,
              color: mutedColor,
              marginBottom: 20,
              transition: "color 0.4s ease",
            }}
          >
            {piece.description}
          </p>

          {/* Tags */}
          <span
            className="font-mono"
            style={{
              fontSize: 10,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: mutedColor,
              display: "block",
              marginBottom: 6,
              transition: "color 0.4s ease",
            }}
          >
            {piece.tags.slice(0, 3).join(" / ")}
          </span>

          {/* Year */}
          <span
            className="font-mono"
            style={{
              fontSize: 10,
              letterSpacing: "0.06em",
              color: mutedColor,
              transition: "color 0.4s ease",
            }}
          >
            {piece.year}
          </span>

          {/* View link */}
          <Link
            href={
              piece.type === "project"
                ? `/work/${piece.slug}`
                : `/lab/${piece.slug}`
            }
            className="font-mono"
            style={{
              display: "block",
              fontSize: 10,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: textColor,
              textDecoration: "none",
              marginTop: 24,
              transition: "color 0.4s ease, opacity 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "0.6";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1";
            }}
          >
            View project →
          </Link>
        </div>
      </div>

      {/* ── Right Panel: Scrollable Carousel Strip ── */}
      <div
        ref={scrollWrapperRef}
        style={{
          width: "60%",
          height: "100%",
          overflowY: "auto",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <div
          ref={scrollContentRef}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            padding: "0 var(--grid-margin) 0 0",
          }}
        >
          {/* Top spacer — allows first item to reach center */}
          <div style={{ height: "50vh", flexShrink: 0 }} />

          {/* Carousel items */}
          {pieces.map((p, i) => {
            const isActive = i === activeIndex;
            const href =
              p.type === "project" ? `/work/${p.slug}` : `/lab/${p.slug}`;

            return (
              <div
                key={p.slug}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                style={{
                  position: "relative",
                  height: "65vh",
                  flexShrink: 0,
                  backgroundColor: p.cover.bg,
                  overflow: "hidden",
                  transform: isActive ? "scale(1.02)" : "scale(1)",
                  opacity: isActive ? 1 : 0.6,
                  transition:
                    "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s ease",
                  cursor: "pointer",
                }}
                onClick={() => {
                  window.location.href = href;
                }}
              >
                {/* Image if available */}
                {p.image && (
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    sizes="60vw"
                    style={{ objectFit: "cover" }}
                    priority={i === 0}
                  />
                )}

                {/* Grain overlay */}
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    inset: 0,
                    opacity: 0.12,
                    filter: "url(#grain)",
                    background: p.cover.bg,
                    mixBlendMode: "multiply",
                    pointerEvents: "none",
                    zIndex: 1,
                  }}
                />
              </div>
            );
          })}

          {/* Bottom spacer — allows last item to reach center */}
          <div style={{ height: "50vh", flexShrink: 0 }} />
        </div>
      </div>
    </div>
  );
}
