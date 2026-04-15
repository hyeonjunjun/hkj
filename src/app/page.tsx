"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { PIECES } from "@/constants/pieces";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const allPieces = [...PIECES].sort((a, b) => a.order - b.order);

/* Curated aspect ratios for masonry — varied, intentional */
const ASPECT: Record<string, string> = {
  gyeol: "4 / 5",
  sift: "3 / 4",
  promptineer: "5 / 4",
  "clouds-at-sea": "16 / 10",
};

export default function Home() {
  const mainRef = useRef<HTMLElement>(null);
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-reveal]", {
        opacity: 0,
        y: 20,
        duration: 0.8,
        stagger: 0.08,
        ease: "power2.out",
        delay: 0.2,
      });
      gsap.utils.toArray<HTMLElement>("[data-tile]").forEach((el, i) => {
        gsap.from(el, {
          opacity: 0,
          y: 30,
          duration: 0.7,
          delay: i * 0.05,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });
    }, mainRef);
    return () => ctx.revert();
  }, []);

  return (
    <main
      ref={mainRef}
      id="main"
      style={{ position: "relative", zIndex: 1 }}
    >
      {/* ════════ HERO ════════ */}
      <section
        style={{
          minHeight: "100svh",
          padding: "clamp(80px, 12vh, 160px) clamp(24px, 5vw, 80px) 48px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          maxWidth: 1400,
          margin: "0 auto",
        }}
      >
        {/* Small introduction kicker */}
        <div
          data-reveal
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--ink-muted)",
            marginBottom: 40,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span
            aria-hidden
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#4ade80",
              display: "inline-block",
              animation: "pulse 2s ease-in-out infinite",
            }}
          />
          Available for select projects — 2026
        </div>

        {/* The big statement — human, with a touch of italic for warmth */}
        <h1
          data-reveal
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "clamp(40px, 6.5vw, 108px)",
            fontWeight: 400,
            lineHeight: 1.02,
            letterSpacing: "-0.035em",
            color: "var(--ink)",
            margin: 0,
            maxWidth: "18ch",
          }}
        >
          I&apos;m{" "}
          <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400 }}>
            Hyeon
          </span>
          ,
          <br />
          a design engineer building brands and digital artifacts in New York.
        </h1>

        {/* Currently working on — dated, specific, human */}
        <div
          data-reveal
          style={{
            marginTop: 56,
            maxWidth: 560,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--ink-faint)",
            }}
          >
            Currently
          </span>
          <p
            style={{
              fontSize: 16,
              lineHeight: 1.55,
              color: "var(--ink-muted)",
              margin: 0,
            }}
          >
            Exploring creative direction, brand identity, and visual systems
            generated with AI — treating the model as a collaborator, not a
            shortcut. Writing about what I learn at{" "}
            <Link
              href="/archive"
              style={{
                color: "var(--ink)",
                textDecoration: "underline",
                textDecorationThickness: 1,
                textUnderlineOffset: 3,
              }}
            >
              the archive
            </Link>
            .
          </p>
        </div>

        {/* Scroll indicator */}
        <div
          data-reveal
          style={{
            marginTop: "auto",
            paddingTop: 80,
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--ink-faint)",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span>Selected work</span>
          <span aria-hidden>↓</span>
        </div>
      </section>

      {/* ════════ MASONRY GRID ════════ */}
      <section
        style={{
          padding: "0 clamp(24px, 5vw, 80px) 160px",
          maxWidth: 1400,
          margin: "0 auto",
          columnCount: 2,
          columnGap: "clamp(16px, 2.5vw, 32px)",
        }}
        className="masonry"
      >
        {allPieces.map((piece, i) => {
          const isHovered = hoveredSlug === piece.slug;
          const isDimmed = hoveredSlug !== null && !isHovered;
          return (
            <Link
              key={piece.slug}
              href={`/work/${piece.slug}`}
              data-tile
              onMouseEnter={() => setHoveredSlug(piece.slug)}
              onMouseLeave={() => setHoveredSlug(null)}
              style={{
                display: "block",
                breakInside: "avoid",
                marginBottom: "clamp(16px, 2.5vw, 32px)",
                opacity: isDimmed ? 0.4 : 1,
                transition: "opacity 0.3s var(--ease)",
              }}
            >
              {/* Image */}
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: ASPECT[piece.slug] ?? "4 / 5",
                  overflow: "hidden",
                  background: "var(--ink-ghost)",
                  borderRadius: 2,
                }}
              >
                {piece.image ? (
                  <Image
                    src={piece.image}
                    alt={piece.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    style={{
                      objectFit: "cover",
                      transform: isHovered ? "scale(1.02)" : "scale(1)",
                      transition: "transform 0.6s var(--ease)",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "var(--font-mono)",
                      fontSize: 11,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "var(--ink-faint)",
                    }}
                  >
                    {piece.status === "wip" ? "In progress" : piece.title}
                  </div>
                )}
              </div>

              {/* Caption — under each tile, minimal */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  marginTop: 12,
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  letterSpacing: "0.02em",
                }}
              >
                <span style={{ color: "var(--ink)", fontWeight: 500 }}>
                  <span style={{ color: "var(--ink-faint)", marginRight: 10 }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {piece.title.replace(/_$/, "")}
                </span>
                <span style={{ color: "var(--ink-muted)" }}>
                  {piece.sector}
                </span>
              </div>
            </Link>
          );
        })}
      </section>

      {/* ════════ FOOTER ════════ */}
      <footer
        style={{
          padding: "48px clamp(24px, 5vw, 80px)",
          maxWidth: 1400,
          margin: "0 auto",
          borderTop: "1px solid var(--ink-ghost)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          flexWrap: "wrap",
          gap: 16,
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          letterSpacing: "0.04em",
          color: "var(--ink-muted)",
        }}
      >
        <a
          href="mailto:hyeonjunjun07@gmail.com"
          style={{ color: "var(--ink)" }}
        >
          hyeonjunjun07@gmail.com
        </a>
        <span>© {new Date().getFullYear()} Hyeon Jun — New York</span>
      </footer>

      {/* Mobile: single column masonry */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(0.85); }
        }
        @media (max-width: 768px) {
          .masonry { column-count: 1 !important; }
        }
        @media (min-width: 1200px) {
          .masonry { column-count: 3 !important; }
        }
      `}</style>
    </main>
  );
}
