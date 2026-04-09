"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { PIECES, type Piece } from "@/constants/pieces";
import { CASE_STUDIES } from "@/constants/case-studies";

const allPieces = [...PIECES].sort((a, b) => a.order - b.order);

interface CaseStudyProps {
  piece: Piece;
}

export default function CaseStudy({ piece }: CaseStudyProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cs = CASE_STUDIES[piece.slug];

  const currentIdx = allPieces.findIndex((p) => p.slug === piece.slug);
  const nextPiece = allPieces[(currentIdx + 1) % allPieces.length];

  useEffect(() => {
    if (!containerRef.current) return;
    const sections = containerRef.current.querySelectorAll("[data-reveal]");

    gsap.fromTo(
      sections,
      { opacity: 0, y: 32, filter: "blur(3px)" },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.5,
        stagger: 0.06,
        ease: "power3.out",
        delay: 0.15,
      }
    );
  }, [piece.slug]);

  return (
    <div
      ref={containerRef}
      style={{
        maxWidth: 900,
        margin: "0 auto",
        paddingInline: "clamp(24px, 5vw, 64px)",
      }}
    >
      {/* ── Hero metadata ── */}
      <div
        data-reveal
        style={{
          paddingTop: 96,
          paddingBottom: 48,
          opacity: 0,
        }}
      >
        <span
          className="font-mono uppercase"
          style={{
            fontSize: 10,
            letterSpacing: "0.06em",
            color: "var(--ink-muted)",
          }}
        >
          {piece.number} / {piece.title.toUpperCase()} / {piece.status === "wip" ? "IN PROGRESS" : piece.year} / {piece.sector.toUpperCase()}
        </span>
      </div>

      {/* ── Hero image ── */}
      {piece.image && (
        <div data-reveal style={{ marginBottom: 64, opacity: 0 }}>
          <Image
            src={piece.image}
            alt={piece.title}
            width={1600}
            height={1000}
            sizes="900px"
            className="w-full"
            style={{ display: "block", objectFit: "cover" }}
            priority
          />
        </div>
      )}

      {/* ── Narrative lede ── */}
      {cs?.paradox && (
        <div data-reveal style={{ marginBottom: 48, opacity: 0 }}>
          <p
            className="font-display italic"
            style={{
              fontSize: "clamp(18px, 2.5vw, 24px)",
              lineHeight: 1.4,
              fontWeight: 400,
              color: "var(--ink-primary)",
              maxWidth: "54ch",
            }}
          >
            {cs.paradox}
          </p>
        </div>
      )}

      {cs?.stakes && (
        <div data-reveal style={{ marginBottom: 64, opacity: 0 }}>
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

      {/* ── Editorial body ── */}
      {cs?.editorial && (
        <div data-reveal style={{ marginBottom: 64, opacity: 0 }}>
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

      {/* ── Process ── */}
      {cs?.process && (
        <div data-reveal style={{ marginBottom: 64, opacity: 0 }}>
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

      {/* ── Process steps ── */}
      {cs?.processSteps && cs.processSteps.length > 0 && (
        <div data-reveal style={{ marginBottom: 64, opacity: 0 }}>
          <SectionLabel>Process</SectionLabel>
          <div className="flex flex-col" style={{ gap: 32 }}>
            {cs.processSteps.map((step, i) => (
              <div key={i} className="flex" style={{ gap: 20 }}>
                <span
                  className="font-mono"
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.04em",
                    fontVariantNumeric: "tabular-nums",
                    color: "var(--ink-ghost)",
                    flexShrink: 0,
                    width: 20,
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

      {/* ── Highlights ── */}
      {cs?.highlights && cs.highlights.length > 0 && (
        <div data-reveal style={{ marginBottom: 64, opacity: 0 }}>
          <SectionLabel>Key Details</SectionLabel>
          <div className="flex flex-col" style={{ gap: 40 }}>
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
                    marginBottom: 12,
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
                  }}
                >
                  {h.challenge}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Engineering ── */}
      {cs?.engineering && (
        <div data-reveal style={{ marginBottom: 64, opacity: 0 }}>
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
          <div className="flex flex-wrap" style={{ gap: 8 }}>
            {cs.engineering.signals.map((s) => (
              <span
                key={s}
                className="font-mono uppercase"
                style={{
                  fontSize: 9,
                  letterSpacing: "0.06em",
                  color: "var(--ink-muted)",
                  padding: "4px 8px",
                  border: "1px solid var(--ink-whisper)",
                }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── Statistics ── */}
      {cs?.statistics && cs.statistics.length > 0 && (
        <div data-reveal style={{ marginBottom: 64, opacity: 0 }}>
          <SectionLabel>Numbers</SectionLabel>
          <div className="flex flex-wrap" style={{ gap: 32 }}>
            {cs.statistics.map((stat) => (
              <div key={stat.label}>
                <span
                  className="font-mono block"
                  style={{
                    fontSize: 20,
                    fontVariantNumeric: "tabular-nums",
                    color: "var(--ink-primary)",
                    letterSpacing: "-0.02em",
                    lineHeight: 1.2,
                  }}
                >
                  {stat.value}
                </span>
                <span
                  className="font-mono uppercase"
                  style={{
                    fontSize: 9,
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

      {/* ── Videos ── */}
      {cs?.videos && cs.videos.length > 0 && (
        <div data-reveal style={{ marginBottom: 64, opacity: 0 }}>
          <SectionLabel>Media</SectionLabel>
          <div
            className="grid"
            style={{
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
                  className="w-full"
                  style={{
                    display: "block",
                    aspectRatio: v.aspect || "16/9",
                    objectFit: "cover",
                  }}
                />
                {v.caption && (
                  <span
                    className="font-mono uppercase block"
                    style={{
                      fontSize: 9,
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
          data-reveal
          style={{
            borderTop: "1px solid var(--ink-whisper)",
            paddingTop: 48,
            paddingBottom: 72,
            opacity: 0,
          }}
        >
          <Link
            href={`/work/${nextPiece.slug}`}
            className="group block"
          >
            <span
              className="font-mono uppercase block"
              style={{
                fontSize: 10,
                letterSpacing: "0.06em",
                color: "var(--ink-muted)",
                marginBottom: 12,
              }}
            >
              Next Project
            </span>
            <span
              className="font-display block"
              style={{
                fontSize: "clamp(18px, 2.5vw, 24px)",
                fontWeight: 400,
                lineHeight: 1.35,
                color: "var(--ink-primary)",
                transition: "color 0.3s var(--ease-swift)",
              }}
            >
              {nextPiece.title}
            </span>
            <span
              className="font-mono uppercase"
              style={{
                fontSize: 10,
                letterSpacing: "0.06em",
                color: "var(--ink-ghost)",
                marginTop: 4,
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

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="font-mono uppercase block"
      style={{
        fontSize: 10,
        letterSpacing: "0.06em",
        color: "var(--ink-muted)",
        marginBottom: 24,
      }}
    >
      {children}
    </span>
  );
}
