"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PIECES, type Piece } from "@/constants/pieces";
import { CASE_STUDIES } from "@/constants/case-studies";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { DUR } from "@/lib/motion";
import ScrollProgress from "@/components/ScrollProgress";

gsap.registerPlugin(ScrollTrigger);

const allPieces = [...PIECES].sort((a, b) => a.order - b.order);

interface CaseStudyProps {
  piece: Piece;
}

// T1.8 — Bracket section labels
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="font-mono uppercase block"
      style={{
        fontSize: 11,
        letterSpacing: "0.06em",
        color: "var(--ink-muted)",
        marginBottom: 24,
      }}
    >
      [{children}]
    </span>
  );
}

export default function CaseStudy({ piece }: CaseStudyProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const cs = CASE_STUDIES[piece.slug];
  const reducedMotion = useReducedMotion();

  const currentIdx = allPieces.findIndex((p) => p.slug === piece.slug);
  const nextPiece = allPieces[(currentIdx + 1) % allPieces.length];

  // Fixed header elements (metadata, silence, paradox, stakes) — simple entrance
  useEffect(() => {
    if (!containerRef.current) return;

    const fixedEls = containerRef.current.querySelectorAll("[data-entrance]");
    const blocks = containerRef.current.querySelectorAll("[data-reveal]");

    if (reducedMotion) {
      // Show everything immediately — no animation
      gsap.set(fixedEls, { opacity: 1, y: 0, filter: "blur(0px)" });
      if (heroRef.current) gsap.set(heroRef.current, { opacity: 1, y: 0 });
      gsap.set(blocks, { opacity: 1, y: 0, filter: "blur(0px)" });
      return;
    }

    gsap.fromTo(
      fixedEls,
      { opacity: 0, y: 24, filter: "blur(2px)" },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: DUR.reveal,
        stagger: 0.07,
        ease: "power3.out",
        delay: 0.1,
      }
    );

    // Hero image reveal
    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current,
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: DUR.reveal,
          ease: "power3.out",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top 85%",
            once: true,
          },
        }
      );
    }

    // Modular blocks — scroll-triggered reveals
    blocks.forEach((block) => {
      gsap.fromTo(
        block,
        { opacity: 0, y: 32, filter: "blur(3px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: DUR.reveal,
          ease: "power3.out",
          scrollTrigger: {
            trigger: block,
            start: "top 85%",
            once: true,
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [piece.slug, reducedMotion]);

  // Column layout — left-shifted, same as homepage
  const colStyle: React.CSSProperties = {
    maxWidth: 900,
    marginLeft: "8vw",
    marginRight: 0,
    paddingInline: 0,
  };

  // Responsive: on mobile fall back to full-width with 24px padding
  // We handle this with a wrapper that has a responsive class

  return (
    <div
      ref={containerRef}
      className="case-study-outer"
      style={{ paddingBottom: 0 }}
    >
      {/* T1.9 — ScrollProgress ribbon, first child */}
      <ScrollProgress />

      <style>{`
        .case-study-outer {
          --col-max: 900px;
          --col-offset: 8vw;
        }
        .case-study-col {
          max-width: var(--col-max);
          margin-left: var(--col-offset);
          margin-right: 0;
        }
        /* Hero bleed: extend from column left to right viewport edge */
        .case-study-bleed {
          max-width: var(--col-max);
          margin-left: var(--col-offset);
          /* Break column to right edge */
          margin-right: calc(-1 * (100vw - var(--col-max) - var(--col-offset)));
        }
        @media (max-width: 767px) {
          .case-study-col,
          .case-study-bleed {
            max-width: none;
            margin-left: 0;
            margin-right: 0;
            padding-inline: 24px;
          }
        }
      `}</style>

      {/* ── 1. Metadata bar ── */}
      {/* T1.8 — Bracketed metadata: [number] / TITLE / [year] / [SECTOR] */}
      <div
        className="case-study-col"
        data-entrance
        style={{
          paddingTop: 96,
          opacity: 0,
        }}
      >
        <span
          className="font-mono uppercase"
          style={{
            fontSize: 11,
            letterSpacing: "0.06em",
            color: "var(--ink-muted)",
          }}
        >
          [<span className="chrome-text">{piece.number}</span>]
          {" / "}
          {piece.title.toUpperCase()}
          {" / "}
          [{piece.status === "wip" ? "IN PROGRESS" : piece.year}]
          {" / "}
          [{piece.sector.toUpperCase()}]
        </span>
      </div>

      {/* ── 2. Silence — 72px ── */}
      <div style={{ height: 72 }} aria-hidden />

      {/* ── 3. Paradox line ── */}
      {cs?.paradox && (
        <div
          className="case-study-col"
          data-entrance
          style={{ marginBottom: 48, opacity: 0 }}
        >
          <p
            className="font-display italic"
            style={{
              fontSize: "clamp(20px, 2.5vw, 28px)",
              lineHeight: 1.35,
              fontWeight: 400,
              color: "var(--ink-primary)",
              maxWidth: "54ch",
            }}
          >
            {cs.paradox}
          </p>
        </div>
      )}

      {/* ── 5. Stakes paragraph ── */}
      {cs?.stakes && (
        <div
          className="case-study-col"
          data-entrance
          style={{ marginBottom: 0, opacity: 0 }}
        >
          <p
            className="font-body"
            style={{
              fontSize: 15,
              lineHeight: 1.7,
              color: "var(--ink-secondary)",
              maxWidth: "54ch",
            }}
          >
            {cs.stakes}
          </p>
        </div>
      )}

      {/* ── 6. Hero image — bleed right ── */}
      {piece.image && (
        <div
          ref={heroRef}
          className="case-study-bleed"
          style={{
            marginTop: 64,
            marginBottom: 80,
            opacity: 0,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={piece.image}
            alt={piece.title}
            className="image-treatment"
            style={{
              display: "block",
              width: "100%",
              height: "auto",
              objectFit: "cover",
            }}
          />
        </div>
      )}

      {/* ── Modular blocks ── */}

      {/* TextBlock: editorial */}
      {cs?.editorial && (
        <div
          className="case-study-col"
          data-reveal
          style={{ marginBottom: 64, opacity: 0 }}
        >
          <SectionLabel>{cs.editorial.heading}</SectionLabel>
          <p
            className="font-body"
            style={{
              fontSize: 15,
              lineHeight: 1.7,
              color: "var(--ink-secondary)",
              maxWidth: "54ch",
            }}
          >
            {cs.editorial.copy}
          </p>
        </div>
      )}

      {/* TextBlock: process */}
      {cs?.process && (
        <div
          className="case-study-col"
          data-reveal
          style={{ marginBottom: 64, opacity: 0 }}
        >
          <SectionLabel>{cs.process.title}</SectionLabel>
          <p
            className="font-body"
            style={{
              fontSize: 15,
              lineHeight: 1.7,
              color: "var(--ink-secondary)",
              maxWidth: "54ch",
            }}
          >
            {cs.process.copy}
          </p>
        </div>
      )}

      {/* StepsBlock: processSteps */}
      {cs?.processSteps && cs.processSteps.length > 0 && (
        <div
          className="case-study-col"
          data-reveal
          style={{ marginBottom: 64, opacity: 0 }}
        >
          <SectionLabel>Process</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            {cs.processSteps.map((step, i) => (
              <div key={i} style={{ display: "flex", gap: 20 }}>
                <span
                  className="font-mono"
                  style={{
                    fontSize: 11,
                    letterSpacing: "0.04em",
                    fontVariantNumeric: "tabular-nums",
                    color: "var(--ink-ghost)",
                    flexShrink: 0,
                    width: 24,
                    paddingTop: 2,
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h4
                    className="font-display"
                    style={{
                      fontSize: 16,
                      fontWeight: 400,
                      lineHeight: 1.35,
                      color: "var(--ink-primary)",
                      marginBottom: 8,
                    }}
                  >
                    {step.title}
                  </h4>
                  <p
                    className="font-body"
                    style={{
                      fontSize: 15,
                      lineHeight: 1.7,
                      color: "var(--ink-secondary)",
                      maxWidth: "54ch",
                    }}
                  >
                    {step.copy}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* HighlightsBlock */}
      {cs?.highlights && cs.highlights.length > 0 && (
        <div
          className="case-study-col"
          data-reveal
          style={{ marginBottom: 64, opacity: 0 }}
        >
          <SectionLabel>Key Details</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
            {cs.highlights.map((h) => (
              <div key={h.id}>
                <h4
                  className="font-display"
                  style={{
                    fontSize: 16,
                    fontWeight: 400,
                    lineHeight: 1.35,
                    color: "var(--ink-primary)",
                    marginBottom: 8,
                  }}
                >
                  {h.title}
                </h4>
                <p
                  className="font-body"
                  style={{
                    fontSize: 15,
                    lineHeight: 1.7,
                    color: "var(--ink-secondary)",
                    maxWidth: "54ch",
                    marginBottom: 10,
                  }}
                >
                  {h.description}
                </p>
                <p
                  className="font-display italic"
                  style={{
                    fontSize: 14,
                    lineHeight: 1.5,
                    color: "var(--ink-muted)",
                    maxWidth: "54ch",
                  }}
                >
                  {h.challenge}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SignalsBlock: engineering */}
      {cs?.engineering && (
        <div
          className="case-study-col"
          data-reveal
          style={{ marginBottom: 64, opacity: 0 }}
        >
          <SectionLabel>{cs.engineering.title}</SectionLabel>
          <p
            className="font-body"
            style={{
              fontSize: 15,
              lineHeight: 1.7,
              color: "var(--ink-secondary)",
              maxWidth: "54ch",
              marginBottom: 20,
            }}
          >
            {cs.engineering.copy}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {cs.engineering.signals.map((s) => (
              <span
                key={s}
                className="font-mono uppercase"
                style={{
                  fontSize: 11,
                  letterSpacing: "0.06em",
                  color: "var(--ink-muted)",
                  padding: "4px 8px",
                  border: "1px solid var(--ink-ghost)",
                }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* StatsBlock */}
      {cs?.statistics && cs.statistics.length > 0 && (
        <div
          className="case-study-col"
          data-reveal
          style={{ marginBottom: 64, opacity: 0 }}
        >
          <SectionLabel>Numbers</SectionLabel>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 40 }}>
            {cs.statistics.map((stat) => (
              <div key={stat.label}>
                <span
                  className="font-mono block"
                  style={{
                    fontSize: 24,
                    fontVariantNumeric: "tabular-nums",
                    color: "var(--ink-primary)",
                    letterSpacing: "-0.02em",
                    lineHeight: 1.2,
                    marginBottom: 4,
                  }}
                >
                  {stat.value}
                </span>
                <span
                  className="font-mono uppercase block"
                  style={{
                    fontSize: 11,
                    letterSpacing: "0.06em",
                    color: "var(--ink-muted)",
                  }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MediaBlock: videos */}
      {cs?.videos && cs.videos.length > 0 && (
        <div
          className="case-study-col"
          data-reveal
          style={{ marginBottom: 64, opacity: 0 }}
        >
          <SectionLabel>Media</SectionLabel>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 16,
            }}
          >
            {cs.videos.map((v, i) => (
              <div key={i}>
                <video
                  src={v.src}
                  poster={v.poster}
                  autoPlay
                  muted
                  loop
                  playsInline
                  style={{
                    display: "block",
                    width: "100%",
                    aspectRatio: v.aspect || "16/9",
                    objectFit: "cover",
                  }}
                />
                {v.caption && (
                  <span
                    className="font-mono block"
                    style={{
                      fontSize: 11,
                      letterSpacing: "0.04em",
                      color: "var(--ink-ghost)",
                      marginTop: 8,
                    }}
                  >
                    {v.caption}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Next project ── */}
      {nextPiece && (
        <div
          className="case-study-col"
          data-reveal
          style={{
            borderTop: "1px solid var(--ink-ghost)",
            paddingTop: 48,
            paddingBottom: 72,
            opacity: 0,
          }}
        >
          <Link href={`/work/${nextPiece.slug}`} style={{ display: "block" }}>
            <span
              className="font-mono uppercase block"
              style={{
                fontSize: 11,
                letterSpacing: "0.06em",
                color: "var(--ink-muted)",
                marginBottom: 12,
              }}
            >
              Next
            </span>
            <span
              className="font-mono block"
              style={{
                fontSize: "clamp(18px, 2.5vw, 24px)",
                fontWeight: 400,
                lineHeight: 1.3,
                color: "var(--ink-primary)",
                marginBottom: 4,
              }}
            >
              {nextPiece.title}
            </span>
            <span
              className="font-mono uppercase block"
              style={{
                fontSize: 11,
                letterSpacing: "0.06em",
                color: "var(--ink-muted)",
              }}
            >
              {nextPiece.sector} · {nextPiece.year}
            </span>
          </Link>
        </div>
      )}
    </div>
  );
}
