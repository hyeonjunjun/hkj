"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo } from "react";
import { PIECES, type Piece } from "@/constants/pieces";
import { CASE_STUDIES } from "@/constants/case-studies";
import { useSectionReveal } from "@/hooks/useSectionReveal";

type Props = { piece: Piece };

export default function CaseStudy({ piece }: Props) {
  const data = CASE_STUDIES[piece.slug];
  const containerRef = useSectionReveal<HTMLElement>();

  const next = useMemo(() => {
    const sorted = [...PIECES].sort((a, b) => a.order - b.order);
    const idx = sorted.findIndex((p) => p.slug === piece.slug);
    return sorted[(idx + 1) % sorted.length];
  }, [piece.slug]);

  return (
    <article ref={containerRef} className="case">
      <header className="case__head">
        <p className="eyebrow">
          <span>Work</span>
          <span className="eyebrow__sep">·</span>
          <span>New York</span>
          <span className="eyebrow__sep">·</span>
          <span className="tabular">{piece.year}</span>
          <span className="eyebrow__sep">·</span>
          <span className="tabular">№{String(piece.order).padStart(3, "0")}</span>
        </p>
        <h1
          className="case__title"
          style={{ viewTransitionName: "work-title" } as React.CSSProperties}
        >
          {piece.title}
        </h1>
        <p className="case__sub">{piece.description}</p>

        <dl className="case__ledger">
          <div className="case__ledger-row">
            <dt>Sector</dt>
            <dd>{piece.sector}</dd>
          </div>
          {data?.role && (
            <div className="case__ledger-row">
              <dt>Role</dt>
              <dd>{data.role}</dd>
            </div>
          )}
          <div className="case__ledger-row">
            <dt>Year</dt>
            <dd className="tabular">{piece.year}</dd>
          </div>
          <div className="case__ledger-row">
            <dt>Status</dt>
            <dd>{piece.status === "wip" ? "In progress" : "Shipped"}</dd>
          </div>
          {data?.tags && data.tags.length > 0 && (
            <div className="case__ledger-row">
              <dt>Tags</dt>
              <dd>{data.tags.join(" · ")}</dd>
            </div>
          )}
        </dl>
      </header>

      {piece.image && (
        <figure className="case__plate">
          <div className="case__plate-frame">
            <Image
              src={piece.image}
              alt={`${piece.title} — cover plate`}
              fill
              sizes="(max-width: 760px) 100vw, 760px"
              style={{ objectFit: "cover" }}
              priority
            />
            <div className="case__plate-marks" aria-hidden>
              <span className="plate-mark case__plate-mark--tl">
                HKJ / PL. №{String(piece.order).padStart(3, "0")}
              </span>
              <span className="plate-mark case__plate-mark--br tabular">
                {piece.year}
              </span>
            </div>
          </div>
          <figcaption className="case__plate-caption">
            <span className="plate-mark">Fig. 01</span>
            <span className="case__plate-caption-text">
              {data?.editorial?.subhead ?? piece.sector}
            </span>
          </figcaption>
        </figure>
      )}

      {data?.stakes && (
        <section className="case__section">
          <p className="case__prose case__prose--lead">{data.stakes}</p>
        </section>
      )}

      {data?.paradox && (
        <section className="case__section">
          <p className="eyebrow"><span>The Question</span></p>
          <p className="case__prose case__prose--question">{data.paradox}</p>
        </section>
      )}

      {data?.editorial && (
        <section className="case__section">
          <p className="eyebrow">
            <span>§01</span>
            <span className="eyebrow__sep">·</span>
            <span>{data.editorial.heading}</span>
          </p>
          <p className="case__prose">{data.editorial.copy}</p>
        </section>
      )}

      {data?.process && (
        <section className="case__section">
          <p className="eyebrow">
            <span>§02</span>
            <span className="eyebrow__sep">·</span>
            <span>{data.process.title}</span>
          </p>
          <p className="case__prose">{data.process.copy}</p>
        </section>
      )}

      {data?.processSteps && data.processSteps.length > 0 && (
        <section className="case__section">
          <p className="eyebrow">
            <span>§03</span>
            <span className="eyebrow__sep">·</span>
            <span>Steps</span>
            <span className="eyebrow__sep">·</span>
            <span className="tabular">
              {String(data.processSteps.length).padStart(2, "0")}
            </span>
          </p>
          <ol className="case__steps">
            {data.processSteps.map((step, i) => (
              <li key={step.title} className="case__step">
                <span className="case__step-num tabular">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="case__step-body">
                  <h4 className="case__step-title">{step.title}</h4>
                  <p className="case__prose case__prose--step">{step.copy}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {data?.highlights && data.highlights.length > 0 && (
        <section className="case__section">
          <p className="eyebrow">
            <span>§04</span>
            <span className="eyebrow__sep">·</span>
            <span>Highlights</span>
          </p>
          <div className="case__highlights">
            {data.highlights.map((h) => (
              <div key={h.id} className="case__highlight">
                <h4 className="case__highlight-title">{h.title}</h4>
                <p className="case__prose case__prose--step">{h.description}</p>
                {h.challenge && (
                  <p className="case__highlight-challenge">
                    <span className="plate-mark">Challenge</span> {h.challenge}
                  </p>
                )}
                {h.recipe && (
                  <p className="case__highlight-recipe plate-mark">{h.recipe}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {data?.engineering && (
        <section className="case__section">
          <p className="eyebrow">
            <span>§05</span>
            <span className="eyebrow__sep">·</span>
            <span>{data.engineering.title}</span>
          </p>
          <p className="case__prose">{data.engineering.copy}</p>
          {data.engineering.signals.length > 0 && (
            <p className="case__signals">
              {data.engineering.signals.map((s, i) => (
                <span key={s}>
                  {i > 0 && <span className="case__signal-sep"> · </span>}
                  <span>{s}</span>
                </span>
              ))}
            </p>
          )}
        </section>
      )}

      {data?.statistics && data.statistics.length > 0 && (
        <section className="case__section">
          <p className="eyebrow">
            <span>§06</span>
            <span className="eyebrow__sep">·</span>
            <span>Numbers</span>
          </p>
          <dl className="case__stats">
            {data.statistics.map((s) => (
              <div key={s.label} className="case__stat">
                <dt className="plate-mark">{s.label}</dt>
                <dd className="case__stat-val">{s.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {data?.videos && data.videos.length > 0 && (
        <section className="case__section">
          <p className="eyebrow">
            <span>§07</span>
            <span className="eyebrow__sep">·</span>
            <span>Plates</span>
            <span className="eyebrow__sep">·</span>
            <span className="tabular">
              {String(data.videos.length).padStart(2, "0")}
            </span>
          </p>
          <div className="case__plates">
            {data.videos.map((v, i) => (
              <figure key={v.src} className="case__video-plate">
                <div
                  className="case__video-frame"
                  style={{ aspectRatio: v.aspect ?? "16 / 9" }}
                >
                  <video
                    src={v.src}
                    poster={v.poster}
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                  <span className="plate-mark case__video-mark">
                    Fig. {String(i + 2).padStart(2, "0")}
                  </span>
                </div>
                {v.caption && (
                  <figcaption className="case__video-caption">
                    {v.caption}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        </section>
      )}

      <footer className="case__foot">
        <Link href={`/work/${next.slug}`} className="case__next">
          <span className="plate-mark">Next entry</span>
          <span className="case__next-title">{next.title}</span>
          <span className="case__next-arrow" aria-hidden>→</span>
        </Link>
      </footer>

      <style>{`
        .case {
          width: 100%;
          max-width: 760px;
          margin: 0 auto;
          padding: clamp(96px, 14vh, 160px) clamp(24px, 6vw, 72px) clamp(64px, 10vh, 120px);
          display: grid;
          gap: clamp(56px, 8vh, 88px);
        }

        /* ─── Stage register: local token remap ─────────────────────────
           Remaps ink/paper tokens inside the .case subtree so every
           existing rule (prose, ledger, plates, stats, highlights, etc.)
           shifts to the stage palette without per-selector overrides. */
        html[data-register="stage"] .case {
          --ink:       var(--glow);
          --ink-2:     var(--glow-2);
          --ink-3:     var(--glow-2);
          --ink-4:     var(--glow-hair);
          --ink-hair:  var(--glow-hair);
          --paper:     var(--stage);
          --paper-2:   var(--stage-2);
          --paper-3:   var(--stage-3);
          --ink-ghost: rgba(248, 245, 236, 0.06);
          background: var(--stage);
          color: var(--glow);
        }

        .case__head { display: grid; gap: 20px; }
        .case__title {
          font-family: var(--font-stack-mono);
          font-weight: 380;
          font-size: clamp(32px, 4.2vw, 52px);
          line-height: 1.1;
          letter-spacing: -0.012em;
          color: var(--ink);
          margin: 0;
        }
        .case__sub {
          font-family: var(--font-stack-mono);
          font-weight: 380;
          font-size: 17px;
          line-height: 1.6;
          color: var(--ink-2);
          max-width: 48ch;
          margin: 4px 0 0;
        }

        .case__ledger {
          margin: 20px 0 0;
          border-top: 1px solid var(--ink-hair);
        }
        .case__ledger-row {
          display: grid;
          grid-template-columns: 120px 1fr;
          gap: 20px;
          padding: 10px 0;
          border-bottom: 1px solid var(--ink-hair);
          font-family: var(--font-stack-mono);
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--ink-2);
        }
        .case__ledger-row dt { color: var(--ink-4); }
        .case__ledger-row dd { margin: 0; color: var(--ink-2); }

        .case__plate { margin: 0; display: grid; gap: 10px; }
        .case__plate-frame {
          position: relative;
          width: 100%;
          aspect-ratio: 4 / 5;
          background: var(--paper-2);
          overflow: hidden;
          box-shadow: inset 0 0 0 1px var(--ink-hair);
        }
        .case__plate-marks { position: absolute; inset: 0; pointer-events: none; }
        .case__plate-mark--tl { position: absolute; top: 12px; left: 14px; color: rgba(17,17,16,0.55); mix-blend-mode: multiply; }
        .case__plate-mark--br { position: absolute; bottom: 12px; right: 14px; color: rgba(17,17,16,0.55); mix-blend-mode: multiply; }
        .case__plate-caption { display: flex; align-items: baseline; gap: 14px; }
        .case__plate-caption-text {
          font-family: var(--font-stack-mono);
          font-weight: 380;
          font-size: 13px;
          color: var(--ink-2);
        }

        .case__section {
          display: grid;
          gap: 16px;
          opacity: 0;
          transform: translateY(8px);
          transition:
            opacity 280ms var(--ease),
            transform 280ms var(--ease);
        }
        .case__section[data-revealed] {
          opacity: 1;
          transform: none;
        }
        .case__section:nth-child(2) { transition-delay: 50ms; }
        .case__section:nth-child(3) { transition-delay: 100ms; }
        .case__section:nth-child(4) { transition-delay: 150ms; }
        .case__section:nth-child(5) { transition-delay: 200ms; }

        @media (prefers-reduced-motion: reduce) {
          .case__section,
          .case__section[data-revealed] {
            opacity: 1;
            transform: none;
            transition: none;
          }
        }

        /* Body prose on case studies gets Gambetta — mono everywhere
           else stays. Reading faces let long form breathe. */
        .case__prose {
          font-family: var(--font-stack-serif);
          font-weight: 380;
          font-size: 17px;
          line-height: 1.75;
          letter-spacing: 0;
          color: var(--ink-2);
          max-width: 56ch;
          margin: 0;
        }
        .case__prose--lead {
          font-weight: 400;
          font-size: 20px;
          line-height: 1.55;
          color: var(--ink);
          max-width: 52ch;
        }
        .case__prose--question {
          font-family: var(--font-stack-serif);
          font-weight: 400;
          font-size: 26px;
          line-height: 1.35;
          letter-spacing: -0.005em;
          color: var(--ink);
          max-width: 36ch;
        }
        .case__prose--step { font-size: 16px; max-width: 52ch; }

        .case__steps { list-style: none; margin: 0; padding: 0; display: grid; gap: 24px; }
        .case__step {
          display: grid;
          grid-template-columns: 44px 1fr;
          gap: 16px;
          padding: 16px 0 0;
          border-top: 1px solid var(--ink-hair);
        }
        .case__step-num {
          font-family: var(--font-stack-mono);
          font-size: 10px;
          letter-spacing: 0.14em;
          color: var(--ink-4);
        }
        .case__step-title {
          font-family: var(--font-stack-mono);
          font-weight: 400;
          font-size: 17px;
          line-height: 1.3;
          color: var(--ink);
          margin: 0 0 6px;
        }

        .case__highlights { display: grid; gap: 32px; }
        .case__highlight {
          display: grid;
          gap: 8px;
          padding: 20px 0 0;
          border-top: 1px solid var(--ink-hair);
        }
        .case__highlight-title {
          font-family: var(--font-stack-mono);
          font-weight: 400;
          font-size: 19px;
          line-height: 1.3;
          color: var(--ink);
          margin: 0;
        }
        .case__highlight-challenge {
          font-family: var(--font-stack-serif);
          font-weight: 380;
          font-size: 15px;
          line-height: 1.7;
          color: var(--ink-3);
          max-width: 52ch;
          margin: 6px 0 0;
        }
        .case__highlight-recipe { color: var(--ink-3); margin: 2px 0 0; }

        .case__signals {
          font-family: var(--font-stack-mono);
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--ink-3);
          margin: 4px 0 0;
        }
        .case__signal-sep { color: var(--ink-4); }

        .case__stats {
          margin: 0;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 28px 32px;
          border-top: 1px solid var(--ink-hair);
          padding-top: 20px;
        }
        .case__stat { display: grid; gap: 6px; }
        .case__stat-val {
          font-family: var(--font-stack-mono);
          font-weight: 380;
          font-size: 28px;
          line-height: 1;
          color: var(--ink);
          margin: 0;
        }

        .case__plates { display: grid; gap: 32px; }
        .case__video-plate { margin: 0; display: grid; gap: 8px; }
        .case__video-frame {
          position: relative;
          width: 100%;
          background: var(--paper-2);
          overflow: hidden;
          box-shadow: inset 0 0 0 1px var(--ink-hair);
        }
        .case__video-frame video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .case__video-mark {
          position: absolute;
          top: 12px;
          left: 14px;
          color: rgba(17,17,16,0.55);
          mix-blend-mode: multiply;
        }
        .case__video-caption {
          font-family: var(--font-stack-mono);
          font-weight: 380;
          font-size: 13px;
          color: var(--ink-3);
        }

        .case__foot {
          padding-top: 24px;
          border-top: 1px solid var(--ink-hair);
        }
        .case__next {
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: baseline;
          gap: 16px;
          padding: 16px 0;
          transition: opacity 180ms var(--ease);
        }
        .case__next:hover { opacity: 0.6; }
        .case__next-title {
          font-family: var(--font-stack-mono);
          font-weight: 400;
          font-size: 20px;
          color: var(--ink);
        }
        .case__next-arrow {
          font-family: var(--font-stack-mono);
          font-size: 16px;
          color: var(--ink-3);
          transition: transform 220ms var(--ease);
        }
        .case__next:hover .case__next-arrow { transform: translateX(4px); color: var(--ink); }

        @media (max-width: 640px) {
          .case__ledger-row { grid-template-columns: 100px 1fr; gap: 12px; }
          .case__step { grid-template-columns: 32px 1fr; gap: 10px; }
          .case__stats { grid-template-columns: repeat(2, 1fr); gap: 20px; }
        }
      `}</style>
    </article>
  );
}
