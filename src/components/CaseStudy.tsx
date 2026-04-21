"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PIECES, type Piece } from "@/constants/pieces";
import { CASE_STUDIES } from "@/constants/case-studies";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { DUR } from "@/lib/motion";
gsap.registerPlugin(ScrollTrigger);

const allPieces = [...PIECES].sort((a, b) => a.order - b.order);

interface CaseStudyProps {
  piece: Piece;
}

function Section({ index, label, children }: { index: string; label: string; children: React.ReactNode }) {
  return (
    <div className="cs-col" data-reveal>
      <div className="cs-section-label">
        <span className="cs-section-label__key">{index}</span>
        <span>{label}</span>
      </div>
      <div className="cs-section-body">{children}</div>
    </div>
  );
}

export default function CaseStudy({ piece }: CaseStudyProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const cs = CASE_STUDIES[piece.slug];
  const reducedMotion = useReducedMotion();

  const currentIdx = allPieces.findIndex((p) => p.slug === piece.slug);
  const nextPiece = allPieces[(currentIdx + 1) % allPieces.length];

  useEffect(() => {
    if (!containerRef.current) return;
    const fixedEls = containerRef.current.querySelectorAll("[data-entrance]");
    const blocks = containerRef.current.querySelectorAll("[data-reveal]");

    if (reducedMotion) {
      gsap.set(fixedEls, { opacity: 1, y: 0 });
      if (heroRef.current) gsap.set(heroRef.current, { opacity: 1, y: 0 });
      gsap.set(blocks, { opacity: 1, y: 0 });
      return;
    }

    gsap.fromTo(
      fixedEls,
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: DUR.reveal, stagger: 0.05, ease: "power3.out", delay: 0.08 }
    );
    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: DUR.reveal, ease: "power3.out",
          scrollTrigger: { trigger: heroRef.current, start: "top 85%", once: true } }
      );
    }
    blocks.forEach((block) => {
      gsap.fromTo(
        block,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: DUR.reveal, ease: "power3.out",
          scrollTrigger: { trigger: block, start: "top 85%", once: true } }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [piece.slug, reducedMotion]);

  const sectionIndex = (n: number) => String(n).padStart(2, "0");

  let secNo = 0;
  const next = () => { secNo += 1; return sectionIndex(secNo); };

  return (
    <div ref={containerRef} className="cs-outer">
      <style>{`
        .cs-outer {
          --col-max: 720px;
          --col-offset: clamp(24px, 8vw, 128px);
          padding-bottom: 0;
        }
        .cs-col {
          max-width: var(--col-max);
          margin-left: var(--col-offset);
          margin-right: 0;
          margin-bottom: clamp(72px, 11vh, 128px);
        }
        .cs-bleed {
          margin-left: var(--col-offset);
          margin-right: clamp(24px, 4vw, 64px);
        }
        .cs-hero {
          min-height: 92vh;
          display: grid;
          grid-template-rows: auto 1fr auto;
          padding: clamp(112px, 18vh, 192px) clamp(24px, 5vw, 64px) clamp(56px, 8vh, 96px) var(--col-offset);
          max-width: 960px;
        }
        .cs-ledger {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: clamp(24px, 4vw, 64px);
          max-width: 640px;
          font-family: var(--font-stack-mono);
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }
        .cs-ledger__key { display: block; color: var(--ink-4); margin-bottom: 6px; }
        .cs-ledger__val { display: block; color: var(--ink-primary); font-variant-numeric: tabular-nums; }

        .cs-title {
          font-family: var(--font-stack-sans);
          font-weight: 500;
          font-size: clamp(32px, 4.4vw, 56px);
          line-height: 1.12;
          letter-spacing: -0.02em;
          color: var(--ink-primary);
          max-width: 22ch;
          align-self: center;
          margin: 64px 0;
        }
        .cs-stakes {
          font-size: 15px;
          line-height: 1.65;
          color: var(--ink-secondary);
          max-width: 56ch;
          padding-top: 24px;
          border-top: 1px solid var(--ink-ghost);
        }

        .cs-section-label {
          display: flex;
          gap: 16px;
          align-items: baseline;
          font-family: var(--font-stack-mono);
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--ink-3);
          margin-bottom: 24px;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--ink-ghost);
        }
        .cs-section-label__key {
          color: var(--ink-4);
          font-variant-numeric: tabular-nums;
        }
        .cs-section-body p {
          font-size: 15px;
          line-height: 1.7;
          color: var(--ink-secondary);
          max-width: 56ch;
        }
        .cs-section-body p + p { margin-top: 18px; }

        .cs-steps { display: grid; gap: 36px; }
        .cs-step { display: grid; grid-template-columns: 36px 1fr; gap: 20px; align-items: baseline; }
        .cs-step__num {
          font-family: var(--font-stack-mono);
          font-size: 11px;
          letter-spacing: 0.08em;
          color: var(--ink-4);
          font-variant-numeric: tabular-nums;
        }
        .cs-step__title {
          font-family: var(--font-stack-sans);
          font-weight: 500;
          font-size: 17px;
          color: var(--ink-primary);
          margin-bottom: 8px;
          letter-spacing: -0.005em;
        }

        .cs-highlights { display: grid; gap: 40px; }
        .cs-highlight__title {
          font-family: var(--font-stack-sans);
          font-weight: 500;
          font-size: 18px;
          color: var(--ink-primary);
          margin-bottom: 8px;
          letter-spacing: -0.005em;
        }
        .cs-highlight__caption {
          font-family: var(--font-stack-mono);
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--ink-3);
          margin-top: 10px;
        }

        .cs-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: clamp(32px, 5vw, 56px);
        }
        .cs-stat__label {
          display: block;
          font-family: var(--font-stack-mono);
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--ink-4);
          margin-bottom: 12px;
        }
        .cs-stat__value {
          display: block;
          font-family: var(--font-stack-sans);
          font-weight: 500;
          font-size: clamp(36px, 4.5vw, 56px);
          line-height: 1;
          color: var(--accent);
          font-variant-numeric: tabular-nums;
          letter-spacing: -0.03em;
        }

        .cs-signals { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 20px; }
        .cs-signals span {
          font-family: var(--font-stack-mono);
          font-size: 10px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--ink-3);
          padding: 4px 10px;
          border: 1px solid var(--ink-ghost);
          border-radius: 999px;
        }

        .cs-media {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 12px;
        }
        .cs-media figure { margin: 0; }
        .cs-media figcaption {
          font-family: var(--font-stack-mono);
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--ink-3);
          margin-top: 8px;
        }

        .cs-hero-image {
          margin-top: 64px;
          margin-bottom: 96px;
        }
        .cs-hero-image figure { margin: 0; }
        .cs-hero-image img {
          display: block;
          width: 100%;
          height: auto;
        }
        .cs-hero-image figcaption {
          font-family: var(--font-stack-mono);
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--ink-3);
          margin-top: 12px;
          display: flex;
          justify-content: space-between;
          max-width: var(--col-max);
        }

        .cs-next {
          padding: 32px var(--col-offset) 96px;
          max-width: var(--col-max);
          margin-left: 0;
        }
        .cs-next a {
          display: block;
          border-top: 1px solid var(--ink-ghost);
          padding-top: 28px;
        }
        .cs-next__key {
          font-family: var(--font-stack-mono);
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--ink-3);
          display: block;
          margin-bottom: 14px;
        }
        .cs-next__title {
          font-family: var(--font-stack-sans);
          font-weight: 500;
          font-size: clamp(28px, 3.2vw, 40px);
          line-height: 1.15;
          letter-spacing: -0.015em;
          color: var(--ink-primary);
          display: block;
          margin-bottom: 10px;
        }
        .cs-next__meta {
          font-family: var(--font-stack-mono);
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--ink-4);
          display: block;
        }

        @media (max-width: 767px) {
          .cs-outer { --col-offset: 24px; }
          .cs-hero { max-width: none; padding-top: 88px; padding-right: 24px; }
          .cs-title { margin: 48px 0; font-size: clamp(28px, 7vw, 40px); }
          .cs-ledger { grid-template-columns: repeat(2, 1fr); gap: 20px; }
          .cs-next { padding-left: 24px; padding-right: 24px; }
        }
      `}</style>

      <header className="cs-hero">
        <div data-entrance className="cs-ledger" style={{ opacity: 0 }}>
          <div>
            <span className="cs-ledger__key">ENTRY</span>
            <span className="cs-ledger__val">{piece.number}</span>
          </div>
          <div>
            <span className="cs-ledger__key">SECTOR</span>
            <span className="cs-ledger__val">{piece.sector.toUpperCase()}</span>
          </div>
          <div>
            <span className="cs-ledger__key">YEAR</span>
            <span className="cs-ledger__val">{piece.year}</span>
          </div>
          <div>
            <span className="cs-ledger__key">STATUS</span>
            <span className="cs-ledger__val">{piece.status === "wip" ? "IN PROGRESS" : "SHIPPED"}</span>
          </div>
        </div>

        <h1 className="cs-title" data-entrance style={{ opacity: 0 }}>
          {cs?.paradox ?? piece.title}
        </h1>

        {cs?.stakes && (
          <p className="cs-stakes" data-entrance style={{ opacity: 0 }}>
            {cs.stakes}
          </p>
        )}
      </header>

      {piece.image && (
        <div ref={heroRef} className="cs-hero-image cs-bleed" style={{ opacity: 0 }}>
          <figure>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={piece.image} alt={piece.title} />
            <figcaption>
              <span>FIG. 01 — {piece.title}</span>
              <span>{piece.sector.toUpperCase()} / {piece.year}</span>
            </figcaption>
          </figure>
        </div>
      )}

      {cs?.editorial && (
        <Section index={next()} label={cs.editorial.heading}>
          <p>{cs.editorial.copy}</p>
        </Section>
      )}

      {cs?.process && (
        <Section index={next()} label={cs.process.title}>
          <p>{cs.process.copy}</p>
        </Section>
      )}

      {cs?.processSteps && cs.processSteps.length > 0 && (
        <Section index={next()} label="Process">
          <div className="cs-steps">
            {cs.processSteps.map((step, i) => (
              <div key={i} className="cs-step">
                <span className="cs-step__num">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h4 className="cs-step__title">{step.title}</h4>
                  <p>{step.copy}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {cs?.highlights && cs.highlights.length > 0 && (
        <Section index={next()} label="Key details">
          <div className="cs-highlights">
            {cs.highlights.map((h) => (
              <div key={h.id}>
                <h4 className="cs-highlight__title">{h.title}</h4>
                <p>{h.description}</p>
                <p className="cs-highlight__caption">{h.challenge}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {cs?.engineering && (
        <Section index={next()} label={cs.engineering.title}>
          <p>{cs.engineering.copy}</p>
          <div className="cs-signals">
            {cs.engineering.signals.map((s) => (
              <span key={s}>{s}</span>
            ))}
          </div>
        </Section>
      )}

      {cs?.statistics && cs.statistics.length > 0 && (
        <Section index={next()} label="Numbers">
          <div className="cs-stats">
            {cs.statistics.map((stat, i) => (
              <div key={stat.label}>
                <span className="cs-stat__label">
                  {String(i + 1).padStart(2, "0")} / {stat.label}
                </span>
                <span className="cs-stat__value">{stat.value}</span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {cs?.videos && cs.videos.length > 0 && (
        <Section index={next()} label="Media">
          <div className="cs-media">
            {cs.videos.map((v, i) => (
              <figure key={i}>
                <video
                  src={v.src}
                  poster={v.poster}
                  autoPlay
                  muted
                  loop
                  playsInline
                  style={{ display: "block", width: "100%", aspectRatio: v.aspect || "16/9", objectFit: "cover" }}
                />
                <figcaption>
                  FIG. {String(i + 2).padStart(2, "0")} — {v.caption ?? "Video loop"}
                </figcaption>
              </figure>
            ))}
          </div>
        </Section>
      )}

      {nextPiece && (
        <div className="cs-next" data-reveal style={{ opacity: 0 }}>
          <Link href={`/work/${nextPiece.slug}`}>
            <span className="cs-next__key">NEXT ENTRY →</span>
            <span className="cs-next__title">{nextPiece.title}</span>
            <span className="cs-next__meta">{nextPiece.sector} / {nextPiece.year}</span>
          </Link>
        </div>
      )}
    </div>
  );
}
