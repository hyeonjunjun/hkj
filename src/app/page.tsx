"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import { PIECES } from "@/constants/pieces";
import PageTransition from "@/components/PageTransition";

function isDarkColor(hex: string): boolean {
  const clean = hex.replace("#", "");
  if (clean.length < 6) return false;
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.5;
}

const pieces = [...PIECES].sort((a, b) => a.order - b.order);

export default function Home() {
  const gridRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      if (navRef.current) navRef.current.style.opacity = "1";
      if (gridRef.current) {
        gsap.set(gridRef.current.children, { autoAlpha: 1, scale: 1 });
      }
      return;
    }

    const tl = gsap.timeline({ defaults: { ease: "expo.out" }, delay: 0.15 });

    // Nav fade
    tl.fromTo(
      navRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.6 },
      0
    );

    // Grid cards stagger from center
    if (gridRef.current) {
      tl.fromTo(
        gridRef.current.children,
        { autoAlpha: 0, scale: 0.96 },
        {
          autoAlpha: 1,
          scale: 1,
          duration: 0.8,
          stagger: { each: 0.06, from: "center" },
        },
        0.1
      );
    }
  }, []);

  const cols = pieces.length <= 4 ? 2 : pieces.length <= 6 ? 3 : 4;
  const rows = Math.ceil(pieces.length / cols);

  return (
    <PageTransition>
      <div
        style={{
          height: "100dvh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "var(--paper)",
        }}
      >
        {/* ── Nav ── */}
        <header
          ref={navRef}
          style={{
            height: 48,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 var(--grid-margin)",
            opacity: 0,
          }}
        >
          <span
            className="font-mono"
            style={{
              fontSize: "var(--text-label)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--ink-full)",
            }}
          >
            HKJ
          </span>
          <nav style={{ display: "flex", gap: 24, alignItems: "center" }}>
            {[
              { label: "Work", href: "/work" },
              { label: "Lab", href: "/lab" },
              { label: "About", href: "/about" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="font-mono"
                style={{
                  fontSize: "var(--text-label)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--ink-secondary)",
                  textDecoration: "none",
                  transition: "color var(--dur-hover) var(--ease-out)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--ink-full)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--ink-secondary)";
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </header>

        {/* ── Archive Grid — fills remaining viewport ── */}
        <main
          id="main"
          style={{
            flex: 1,
            padding: "0 var(--grid-margin) var(--grid-margin)",
            minHeight: 0,
          }}
        >
          <div
            ref={gridRef}
            className="archive-grid"
            style={{
              height: "100%",
              gridTemplateColumns: `repeat(${cols}, 1fr)`,
              gridTemplateRows: `repeat(${rows}, 1fr)`,
            }}
          >
            {pieces.map((piece, i) => {
              const dark = isDarkColor(piece.cover.bg);
              const textColor = dark
                ? "rgba(255,252,245,0.85)"
                : "rgba(28,26,23,0.72)";
              const mutedColor = dark
                ? "rgba(255,252,245,0.40)"
                : "rgba(28,26,23,0.30)";
              const num = String(i + 1).padStart(2, "0");
              const href =
                piece.type === "project"
                  ? `/work/${piece.slug}`
                  : `/lab/${piece.slug}`;

              return (
                <Link
                  key={piece.slug}
                  href={href}
                  style={{
                    display: "block",
                    position: "relative",
                    backgroundColor: piece.cover.bg,
                    textDecoration: "none",
                    overflow: "hidden",
                    transition: "transform var(--dur-hover) var(--ease-out)",
                    transform:
                      hoveredIndex === i
                        ? "translateY(-2px)"
                        : "translateY(0)",
                  }}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  aria-label={`View ${piece.title}`}
                >
                  {/* Grain */}
                  <div
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      inset: 0,
                      opacity: 0.18,
                      filter: "url(#grain)",
                      background: piece.cover.bg,
                      mixBlendMode: "multiply",
                      pointerEvents: "none",
                      zIndex: 1,
                    }}
                  />

                  {/* Content */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      padding: "clamp(10px, 2%, 18px)",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      zIndex: 2,
                    }}
                  >
                    {/* Top: number + type */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                      }}
                    >
                      <span
                        className="font-mono"
                        style={{
                          fontSize: "var(--text-meta)",
                          letterSpacing: "0.06em",
                          color: mutedColor,
                        }}
                      >
                        {num}
                      </span>
                      <span
                        className="font-mono"
                        style={{
                          fontSize: "var(--text-meta)",
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                          color: mutedColor,
                        }}
                      >
                        {piece.year}
                      </span>
                    </div>

                    {/* Bottom: title + tags */}
                    <div>
                      <p
                        className="font-display"
                        style={{
                          fontSize: "clamp(14px, 1.8vw, 22px)",
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
                          fontSize: "var(--text-meta)",
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
        </main>
      </div>
    </PageTransition>
  );
}
