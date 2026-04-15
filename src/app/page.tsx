"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { PIECES } from "@/constants/pieces";
import AsciiFrame from "@/components/AsciiFrame";
import gsap from "gsap";

const bySlug = (slug: string) => PIECES.find((p) => p.slug === slug)!;

const TILES = [
  { piece: bySlug("gyeol"), area: "gyeol", ratio: "4 / 3", priority: true },
  { piece: bySlug("sift"), area: "sift", ratio: "4 / 5", priority: true },
  { piece: bySlug("clouds-at-sea"), area: "clouds", ratio: "21 / 9", priority: false },
  { piece: bySlug("promptineer"), area: "prompt", ratio: "1 / 1", priority: false },
];

export default function Home() {
  const mainRef = useRef<HTMLElement>(null);
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-reveal]", {
        opacity: 0,
        y: 16,
        duration: 0.8,
        stagger: 0.08,
        ease: "power2.out",
        delay: 0.2,
      });
    }, mainRef);
    return () => ctx.revert();
  }, []);

  return (
    <main ref={mainRef} id="main" style={{ position: "relative", zIndex: 1, paddingTop: "clamp(72px, 10vh, 120px)" }}>
      <div className="hero-grid">
        {TILES.map(({ piece, area, ratio, priority }) => {
          const isHovered = hoveredSlug === piece.slug;
          const isDimmed = hoveredSlug !== null && !isHovered;
          return (
            <Link
              key={piece.slug}
              href={`/work/${piece.slug}`}
              data-reveal
              data-tile={area}
              data-reticle-lock
              data-reticle-label={`${piece.number} ${piece.title}`.toUpperCase()}
              onMouseEnter={() => setHoveredSlug(piece.slug)}
              onMouseLeave={() => setHoveredSlug(null)}
              className={`hero-tile hero-tile--${area}`}
              style={{
                opacity: isDimmed ? 0.5 : 1,
              }}
            >
              <AsciiFrame
                topLeft={`${piece.number} / ${piece.title}`}
                topRight={String(piece.year)}
                bottomLeft={piece.sector}
                bottomRight={piece.status === "wip" ? "IN PROGRESS" : "SHIPPED"}
                padding={0}
              >
                <div className="hero-tile__media" style={{ aspectRatio: ratio }}>
                  <span className="hero-tile__enter">ENTER &rarr;</span>
                  {piece.video ? (
                    <video
                      src={piece.video}
                      autoPlay
                      muted
                      loop
                      playsInline
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : piece.image ? (
                    <Image
                      src={piece.image}
                      alt={piece.title}
                      fill
                      sizes="(max-width: 767px) 100vw, 60vw"
                      style={{ objectFit: "cover" }}
                      priority={priority}
                    />
                  ) : (
                    <div className="hero-tile__wip">IN PROGRESS &middot; 2026</div>
                  )}
                </div>
              </AsciiFrame>
            </Link>
          );
        })}
      </div>

      <footer className="hero-signoff" data-reveal>
        <div className="hero-signoff__name">Hyeonjoon</div>
        <div className="hero-signoff__role">
          DESIGN ENGINEER &middot; NEW YORK &middot; AVAILABLE 2026
        </div>
        <div className="hero-signoff__email">
          <a href="mailto:hyeonjunjun07@gmail.com">hyeonjunjun07@gmail.com</a>
        </div>
      </footer>

      <style>{`
        .hero-grid {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: clamp(16px, 2vw, 32px);
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 clamp(24px, 4vw, 64px);
        }
        .hero-tile {
          display: block;
          transition: opacity 0.3s var(--ease);
          position: relative;
        }
        .hero-tile--gyeol { grid-column: 1 / span 7; }
        .hero-tile--sift { grid-column: 8 / span 5; }
        .hero-tile--clouds { grid-column: 1 / span 8; }
        .hero-tile--prompt { grid-column: 9 / span 4; }
        .hero-tile__media {
          position: relative;
          width: 100%;
          overflow: hidden;
          background: var(--paper-2);
        }
        .hero-tile__enter {
          position: absolute;
          top: 12px;
          right: 12px;
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.12em;
          color: var(--ink);
          background: var(--paper);
          padding: 4px 8px;
          opacity: 0;
          transform: translateY(-4px);
          transition: opacity 240ms var(--ease), transform 240ms var(--ease);
          pointer-events: none;
          z-index: 2;
        }
        .hero-tile:hover .hero-tile__enter {
          opacity: 1;
          transform: translateY(0);
        }
        .hero-tile__wip {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--ink-muted);
          background: var(--paper-2);
        }
        .hero-signoff {
          margin: clamp(64px, 10vh, 120px) clamp(24px, 4vw, 64px) clamp(48px, 8vh, 96px) auto;
          max-width: 420px;
          text-align: right;
          padding-right: clamp(24px, 4vw, 64px);
        }
        .hero-signoff__name {
          font-family: var(--font-serif);
          font-style: italic;
          font-size: clamp(28px, 3.5vw, 48px);
          line-height: 1.1;
          letter-spacing: -0.02em;
          color: var(--ink);
        }
        .hero-signoff__role {
          font-family: var(--font-mono);
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--ink-muted);
          margin-top: 16px;
        }
        .hero-signoff__email {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--ink);
          margin-top: 8px;
        }
        .hero-signoff__email a {
          color: inherit;
          text-decoration: underline;
          text-underline-offset: 3px;
        }
        @media (max-width: 767px) {
          .hero-grid {
            gap: 16px;
          }
          .hero-tile--gyeol,
          .hero-tile--sift,
          .hero-tile--clouds,
          .hero-tile--prompt {
            grid-column: 1 / -1;
          }
        }
      `}</style>
    </main>
  );
}
