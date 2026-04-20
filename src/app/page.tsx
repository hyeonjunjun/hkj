"use client";

import Link from "next/link";
import { PIECES } from "@/constants/pieces";
import CreatureField from "@/components/CreatureField";
import ModeCycle from "@/components/ModeCycle";
import { useMode } from "@/hooks/useMode";
import { useTheme } from "@/hooks/useTheme";

const ordered = [...PIECES].sort((a, b) => a.order - b.order);

export default function Home() {
  const { mode, setMode } = useMode("sea");
  const [theme] = useTheme();

  return (
    <main id="main" className="home">
      {/* Hero — creature field */}
      <section className="home-hero" aria-label="Hero">
        <CreatureField mode={mode} theme={theme} />
        <div className="home-hero__controls">
          <ModeCycle mode={mode} onSelect={setMode} />
        </div>
      </section>

      {/* Work list — quiet, numbered, mono */}
      <section className="home-work" aria-label="Selected work">
        <div className="home-work__intro">
          <span className="home-work__kicker">INDEX · 04 ENTRIES · 2024 — 2026</span>
          <h2 className="home-work__label">Selected work.</h2>
          <p className="home-work__lede">A small practice. Four projects made slowly.</p>
        </div>
        <ol className="home-work__list">
          {ordered.map((p, i) => (
            <li key={p.slug} className="home-work__row">
              <Link href={`/work/${p.slug}`} className="home-work__link">
                <span className="home-work__num">{String(i + 1).padStart(2, "0")}</span>
                <span className="home-work__title">{p.title}</span>
                <span className="home-work__sector">{p.sector}</span>
                <span className="home-work__year">{p.year}</span>
                <span className="home-work__arrow" aria-hidden>→</span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      {/* Footer signoff */}
      <footer className="home-foot">
        <span className="home-foot__name">Hyeonjoon Jun</span>
        <span className="home-foot__sep" aria-hidden> · </span>
        <span className="home-foot__role">design engineer, New York</span>
        <span className="home-foot__sep" aria-hidden> · </span>
        <a href="mailto:hyeonjunjun07@gmail.com" className="home-foot__mail">
          hyeonjunjun07@gmail.com
        </a>
      </footer>

      <style>{`
        .home {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        .home-hero {
          position: relative;
          height: 88vh;
          min-height: 560px;
          overflow: hidden;
        }
        .home-hero__controls {
          position: absolute;
          right: clamp(24px, 4vw, 64px);
          bottom: clamp(32px, 5vh, 56px);
          z-index: 2;
          left: auto;
          transform: none;
        }
        .home-work {
          max-width: 820px;
          margin: 0 auto;
          padding: clamp(72px, 12vh, 144px) clamp(24px, 5vw, 64px);
          width: 100%;
        }
        .home-work__intro {
          margin-bottom: clamp(32px, 5vh, 56px);
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .home-work__kicker {
          font-family: var(--font-stack-mono);
          font-size: 10px;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: var(--ink-faint);
        }
        .home-work__label {
          font-family: var(--font-stack-serif);
          font-style: italic;
          font-weight: 400;
          font-size: clamp(36px, 5vw, 56px);
          line-height: 1.02;
          letter-spacing: -0.025em;
          color: var(--ink);
          margin: 0;
        }
        .home-work__lede {
          font-family: var(--font-stack-serif);
          font-size: 15px;
          line-height: 1.55;
          color: var(--ink-muted);
          margin: 0;
          max-width: 32ch;
        }
        .home-work__list {
          list-style: none;
          padding: 0;
          margin: 0;
          border-top: 1px solid var(--ink-ghost);
        }
        .home-work__row {
          border-bottom: 1px solid var(--ink-ghost);
        }
        .home-work__link {
          display: grid;
          grid-template-columns: 48px 1.3fr 1.2fr 72px 20px;
          column-gap: clamp(12px, 2vw, 28px);
          align-items: baseline;
          padding: clamp(18px, 3vh, 28px) 4px;
          font-family: var(--font-stack-mono);
          font-size: 13px;
          color: var(--ink);
          text-decoration: none;
          transition: color 200ms var(--ease);
        }
        .home-work__link:hover {
          padding-left: 0;
        }
        .home-work__link:hover .home-work__title {
          text-decoration: underline;
          text-decoration-thickness: 1px;
          text-underline-offset: 5px;
          text-decoration-color: var(--accent);
        }
        .home-work__num {
          color: var(--ink-faint);
          font-variant-numeric: tabular-nums;
        }
        .home-work__title {
          color: var(--ink);
          font-family: var(--font-stack-serif);
          font-style: italic;
          font-size: 20px;
          letter-spacing: -0.01em;
          line-height: 1.15;
        }
        .home-work__sector {
          color: var(--ink-muted);
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }
        .home-work__year {
          color: var(--ink-muted);
          font-size: 11px;
          letter-spacing: 0.08em;
          text-align: right;
          font-variant-numeric: tabular-nums;
        }
        .home-work__arrow {
          color: var(--accent);
          opacity: 0;
          transform: translateX(-6px);
          transition: opacity 220ms var(--ease), transform 220ms var(--ease);
          text-align: right;
        }
        .home-work__link:hover .home-work__arrow {
          opacity: 1;
          transform: translateX(0);
        }
        .home-foot {
          padding: clamp(64px, 12vh, 128px) clamp(24px, 5vw, 64px);
          font-family: var(--font-stack-mono);
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--ink-muted);
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          justify-content: center;
        }
        .home-foot__name {
          font-family: var(--font-stack-serif);
          font-style: italic;
          font-size: 14px;
          letter-spacing: -0.01em;
          text-transform: none;
          color: var(--ink);
        }
        .home-foot__sep { color: var(--ink-faint); }
        .home-foot__role { color: var(--ink-muted); }
        .home-foot__mail {
          color: var(--ink);
          text-decoration: underline;
          text-underline-offset: 3px;
          text-decoration-thickness: 1px;
        }
        .home-foot__mail:hover { color: var(--accent); }

        @media (max-width: 640px) {
          .home-hero { height: 78vh; min-height: 480px; }
          .home-hero__controls {
            left: 50%;
            right: auto;
            transform: translateX(-50%);
          }
          .home-work__link {
            grid-template-columns: 32px 1fr auto;
            grid-template-areas:
              "num title year"
              ". sector arrow";
            row-gap: 4px;
          }
          .home-work__num { grid-area: num; }
          .home-work__title { grid-area: title; }
          .home-work__sector { grid-area: sector; }
          .home-work__year { grid-area: year; }
          .home-work__arrow { grid-area: arrow; }
          .home-foot {
            flex-direction: column;
            align-items: center;
          }
          .home-foot__sep { display: none; }
        }
      `}</style>
    </main>
  );
}
