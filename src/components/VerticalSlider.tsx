"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { gsap, Observer } from "@/lib/gsap";
import type { Piece } from "@/constants/pieces";

interface VerticalSliderProps {
  pieces: Piece[];
  onActiveChange?: (index: number) => void;
}

export default function VerticalSlider({
  pieces,
  onActiveChange,
}: VerticalSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const slidesRef = useRef<(HTMLDivElement | null)[]>([]);
  const currentRef = useRef(0);
  const animatingRef = useRef(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const gotoSection = useCallback(
    (index: number, direction: 1 | -1) => {
      if (animatingRef.current) return;

      // Wrap around
      const wrapped =
        ((index % pieces.length) + pieces.length) % pieces.length;
      if (wrapped === currentRef.current) return;

      animatingRef.current = true;
      const slides = slidesRef.current;
      const prev = currentRef.current;

      const tl = gsap.timeline({
        defaults: { duration: 0.9, ease: "power3.inOut" },
        onComplete: () => {
          animatingRef.current = false;
          currentRef.current = wrapped;
          setCurrentIndex(wrapped);
          onActiveChange?.(wrapped);
        },
      });

      // Outgoing slide
      tl.to(slides[prev], {
        yPercent: -110 * direction,
        autoAlpha: 0,
        ease: "power3.inOut",
      });

      // Incoming slide
      tl.fromTo(
        slides[wrapped],
        { yPercent: 110 * direction, autoAlpha: 1 },
        { yPercent: 0, ease: "power3.inOut" },
        "<"
      );

      // Parallax on the image inside incoming slide
      const img = slides[wrapped]?.querySelector("[data-slide-img]");
      if (img) {
        tl.fromTo(
          img,
          { yPercent: 25 * direction, scale: 1.08 },
          { yPercent: 0, scale: 1, duration: 1.1, ease: "power3.out" },
          "<"
        );
      }
    },
    [pieces.length, onActiveChange]
  );

  useEffect(() => {
    const slides = slidesRef.current;

    // Stack all slides off-screen, show first
    gsap.set(slides, { yPercent: 100, autoAlpha: 0 });
    gsap.set(slides[0], { yPercent: 0, autoAlpha: 1 });

    // GSAP Observer — wheel, touch, drag
    const obs = Observer.create({
      target: containerRef.current!,
      type: "wheel,touch,pointer",
      tolerance: 60,
      onUp: () => gotoSection(currentRef.current - 1, -1),
      onDown: () => gotoSection(currentRef.current + 1, 1),
      wheelSpeed: -1,
      preventDefault: true,
    });

    // Arrow keys
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        gotoSection(currentRef.current + 1, 1);
      }
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        gotoSection(currentRef.current - 1, -1);
      }
    };
    window.addEventListener("keydown", handleKey);

    return () => {
      obs.kill();
      window.removeEventListener("keydown", handleKey);
    };
  }, [gotoSection]);

  const piece = pieces[currentIndex];
  const isDark = isDarkColor(piece.cover.bg);
  const textColor = isDark
    ? "rgba(255,252,245,0.85)"
    : "rgba(28,26,23,0.82)";
  const mutedColor = isDark
    ? "rgba(255,252,245,0.35)"
    : "rgba(28,26,23,0.28)";

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        cursor: "grab",
      }}
    >
      {/* Slides */}
      {pieces.map((p, i) => {
        const href =
          p.type === "project" ? `/work/${p.slug}` : `/lab/${p.slug}`;

        return (
          <div
            key={p.slug}
            ref={(el) => {
              slidesRef.current[i] = el;
            }}
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: p.cover.bg,
            }}
          >
            {/* Cover image / color field with grain */}
            <Link
              href={href}
              style={{
                position: "relative",
                width: "clamp(280px, 50vw, 640px)",
                aspectRatio: "3/4",
                overflow: "hidden",
                display: "block",
              }}
              aria-label={`View ${p.title}`}
            >
              <div
                data-slide-img
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundColor: p.cover.bg,
                  filter: "brightness(0.92)",
                }}
              />
              {/* Grain overlay */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity: 0.15,
                  filter: "url(#grain)",
                  background: p.cover.bg,
                  mixBlendMode: "multiply",
                  pointerEvents: "none",
                }}
              />
            </Link>
          </div>
        );
      })}

      {/* Bottom overlay — project info */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "0 var(--grid-margin) 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          zIndex: 10,
          pointerEvents: "none",
          transition: "color 0.4s ease",
        }}
      >
        {/* Left: category */}
        <span
          className="font-mono"
          style={{
            fontSize: 10,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: mutedColor,
            transition: "color 0.4s ease",
          }}
        >
          {piece.tags.slice(0, 2).join(" / ")}
        </span>

        {/* Center: title */}
        <span
          className="font-display"
          style={{
            fontSize: "clamp(16px, 2.5vw, 28px)",
            fontWeight: 400,
            letterSpacing: "0.02em",
            color: textColor,
            transition: "color 0.4s ease",
          }}
        >
          {piece.title}
        </span>

        {/* Right: counter */}
        <span
          className="font-mono"
          style={{
            fontSize: 10,
            letterSpacing: "0.06em",
            fontVariantNumeric: "tabular-nums",
            color: mutedColor,
            transition: "color 0.4s ease",
          }}
        >
          {String(currentIndex + 1).padStart(2, "0")} /{" "}
          {String(pieces.length).padStart(2, "0")}
        </span>
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
