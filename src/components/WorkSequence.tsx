"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PIECES } from "@/constants/pieces";
import { useStore } from "@/store/useStore";
import MarginImage from "./MarginImage";

gsap.registerPlugin(ScrollTrigger);

export default function WorkSequence() {
  const containerRef = useRef<HTMLElement>(null);
  const rowRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [hoveredSlug, setLocalHovered] = useState<string | null>(null);
  const setHoveredSlug = useStore((s) => s.setHoveredSlug);
  const setActiveZoneSlug = useStore((s) => s.setActiveZoneSlug);

  const hoveredPiece = PIECES.find((p) => p.slug === hoveredSlug);
  const marginSrc = hoveredPiece?.coverArt || hoveredPiece?.image || null;

  const handleEnter = useCallback(
    (slug: string) => {
      setLocalHovered(slug);
      setHoveredSlug(slug);
    },
    [setHoveredSlug]
  );

  const handleLeave = useCallback(() => {
    setLocalHovered(null);
    setHoveredSlug(null);
  }, [setHoveredSlug]);

  // GSAP reveal on scroll
  useEffect(() => {
    const rows = rowRefs.current.filter(Boolean) as HTMLElement[];
    rows.forEach((row) => {
      gsap.fromTo(
        row,
        { opacity: 0, y: 40, filter: "blur(4px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: row,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    });

    // Chrome gradient scroll-linked sheen on project numbers
    gsap.to(".chrome-text", {
      backgroundPosition: "100% 100%",
      ease: "none",
      scrollTrigger: {
        trigger: ".work-sequence",
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  // Scroll zone tracking via IntersectionObserver
  useEffect(() => {
    const rows = rowRefs.current.filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const slug = (entry.target as HTMLElement).dataset.slug;
            if (slug) setActiveZoneSlug(slug);
          }
        });
      },
      { threshold: 0.5 }
    );

    rows.forEach((row) => observer.observe(row));
    return () => observer.disconnect();
  }, [setActiveZoneSlug]);

  return (
    <>
      <section
        ref={containerRef}
        style={{
          position: "relative",
          maxWidth: 900,
          marginLeft: "8vw",
          paddingTop: "clamp(48px, 8vh, 72px)",
        }}
        className="work-sequence"
      >
        {/* Structural bleed line — desktop only */}
        <div
          className="hidden md:block"
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            width: 1,
            background: "var(--ink-whisper)",
          }}
        />

        {PIECES.map((piece, i) => {
          const isDimmed = hoveredSlug !== null && hoveredSlug !== piece.slug;

          return (
            <Link
              key={piece.slug}
              href={`/work/${piece.slug}`}
              ref={(el) => {
                rowRefs.current[i] = el;
              }}
              data-reveal
              data-slug={piece.slug}
              onMouseEnter={() => handleEnter(piece.slug)}
              onMouseLeave={handleLeave}
              style={{
                display: "block",
                position: "relative",
                paddingBottom: "clamp(48px, 8vh, 72px)",
                paddingLeft: 24,
                opacity: 0,
                color: isDimmed
                  ? "var(--ink-whisper)"
                  : "var(--ink-primary)",
                transition: "none",
              }}
            >
              {/* Ghost number — desktop only */}
              <span
                className="hidden md:block font-mono"
                aria-hidden="true"
                style={{
                  position: "absolute",
                  top: -20,
                  left: 0,
                  fontSize: "clamp(120px, 15vw, 200px)",
                  lineHeight: 1,
                  color: isDimmed
                    ? "var(--ink-whisper)"
                    : "var(--ink-whisper)",
                  pointerEvents: "none",
                  userSelect: "none",
                  zIndex: 0,
                }}
              >
                {piece.number}
              </span>

              {/* Meta row */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <span
                  className={`font-mono uppercase ${isDimmed ? "" : "chrome-text"}`}
                  style={{
                    fontSize: 11,
                    letterSpacing: "0.06em",
                    color: isDimmed ? "inherit" : undefined,
                    WebkitTextFillColor: isDimmed ? "var(--ink-whisper)" : undefined,
                  }}
                >
                  {piece.number}
                </span>
                <span
                  className="font-mono uppercase"
                  style={{
                    fontSize: 11,
                    letterSpacing: "0.06em",
                    color: isDimmed
                      ? "var(--ink-whisper)"
                      : "var(--ink-muted)",
                  }}
                >
                  {piece.sector} &middot; {piece.year}
                </span>
              </div>

              {/* Title */}
              <h2
                className="font-mono"
                style={{
                  fontSize: "clamp(28px, 3.5vw, 40px)",
                  letterSpacing: "0.02em",
                  lineHeight: 1.2,
                  marginTop: 8,
                  position: "relative",
                  zIndex: 1,
                  color: "inherit",
                }}
              >
                {piece.title}
              </h2>

              {/* Description */}
              <p
                className="font-body"
                style={{
                  fontSize: 15,
                  color: isDimmed
                    ? "var(--ink-whisper)"
                    : "var(--ink-secondary)",
                  maxWidth: "42ch",
                  marginTop: 8,
                  position: "relative",
                  zIndex: 1,
                  fontFamily: "var(--font-body)",
                }}
              >
                {piece.description}
              </p>

              {/* Mobile inline image */}
              {(piece.image || piece.coverArt) && (
                <div className="block md:hidden" style={{ marginTop: 16 }}>
                  <Image
                    src={piece.coverArt || piece.image!}
                    alt={piece.title}
                    width={600}
                    height={400}
                    className="image-treatment"
                    style={{
                      width: "100%",
                      height: "auto",
                      display: "block",
                    }}
                  />
                </div>
              )}

              {/* Divider */}
              <div
                aria-hidden="true"
                style={{
                  height: 1,
                  background: "var(--ink-ghost)",
                  marginTop: "clamp(48px, 8vh, 72px)",
                }}
              />
            </Link>
          );
        })}
      </section>

      {/* Margin image — desktop hover */}
      <MarginImage
        src={marginSrc}
        alt={hoveredPiece?.title ?? ""}
      />

      {/* Mobile overrides */}
      <style jsx global>{`
        @media (max-width: 767px) {
          .work-sequence {
            margin-left: 0 !important;
            padding-inline: 24px !important;
            max-width: 100% !important;
          }
        }
      `}</style>
    </>
  );
}
