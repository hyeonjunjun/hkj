"use client";

import { CONTACT_EMAIL } from "@/constants/contact";
import { EXPERIENCE } from "@/constants/experience";
import Folio from "@/components/Folio";

export default function AboutPage() {
  return (
    <main id="main" className="about">
      <Folio token="§02" />
      <article className="about__inner" data-cascade>
        <header className="about__head">
          <p className="eyebrow">
            <span>About</span>
            <span className="eyebrow__sep">·</span>
            <span>A short account</span>
            <span className="eyebrow__sep">·</span>
            <span className="tabular">2026</span>
          </p>
          <h1 className="about__title">A design engineer, based in New York.</h1>
        </header>

        <section className="about__prose">
          <p>
            I build for the web — brands, interfaces, and small experiments in
            between. I care about typography, motion, and the parts that make
            software feel made, not assembled.
          </p>
          <p className="about__prose-drop">
            I treat AI as a collaborator, not a shortcut.
          </p>
          <p>
            Available for select engagements through 2026.{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="about__mail">
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </section>

        <section className="about__section">
          <header className="about__section-head">
            <span className="about__section-label">Where I&apos;ve worked</span>
            <span className="about__section-count tabular">
              {String(EXPERIENCE.length).padStart(2, "0")} Entries
            </span>
          </header>
          <dl className="about__timeline">
            {EXPERIENCE.map((e) => (
              <div key={e.period} className="about__timeline-row">
                <dt className="about__timeline-period tabular">{e.period}</dt>
                <dd className="about__timeline-role">
                  <span>{e.role}</span>
                  {e.org ? <span className="about__timeline-org">, {e.org}</span> : null}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <footer className="about__foot">
          <span>Hyeonjoon Jun</span>
          <span className="about__foot-dot" aria-hidden>·</span>
          <span>New York</span>
          <span className="about__foot-dot" aria-hidden>·</span>
          <span className="tabular">2026</span>
        </footer>
      </article>

      <style>{`
        .about {
          min-height: 100svh;
          padding: clamp(88px, 12vh, 128px) clamp(24px, 4vw, 72px) clamp(56px, 9vh, 96px);
          display: flex;
          justify-content: center;
          color: var(--ink);
        }
        .about__inner {
          width: 100%;
          max-width: 680px;
          display: grid;
          gap: clamp(48px, 7vh, 72px);
        }

        /* ── Head ─────────────────────────────────────── */
        .about__head { display: grid; gap: 18px; }
        .about__title {
          font-family: var(--font-stack-mono);
          font-weight: 400;
          font-size: clamp(22px, 2.4vw, 30px);
          line-height: 1.35;
          letter-spacing: -0.005em;
          color: var(--ink);
          margin: 6px 0 0;
          max-width: 32ch;
        }

        /* ── Prose ─────────────────────────────────────── */
        .about__prose {
          display: grid;
          gap: 1em;
          font-family: var(--font-stack-mono);
          font-size: 13px;
          line-height: 1.85;
          letter-spacing: 0;
          color: var(--ink-2);
          max-width: 54ch;
        }
        .about__prose p { margin: 0; }

        /* ! moment: the argument paragraph receives a Gambetta drop cap.
           Invisible systematically — felt as "this paragraph is load-bearing." */
        .about__prose-drop::first-letter {
          font-family: var(--font-stack-serif);
          font-weight: 500;
          font-size: 1.6em;
          line-height: 1;
          float: left;
          margin-right: 0.1em;
          margin-top: 0.06em;
          color: var(--ink);
        }

        /* ── Section ──────────────────────────────────── */
        .about__section { display: grid; gap: 12px; }
        .about__section-head {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          padding-bottom: 10px;
          border-bottom: 1px solid var(--ink);
        }
        .about__section-label {
          font-family: var(--font-stack-mono);
          font-size: 10px;
          letter-spacing: 0.26em;
          text-transform: uppercase;
          color: var(--ink);
        }
        .about__section-count {
          font-family: var(--font-stack-mono);
          font-size: 9px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--ink-3);
        }

        /* ── Timeline ─────────────────────────────────── */
        .about__timeline { margin: 0; }
        .about__timeline-row {
          display: grid;
          grid-template-columns: 180px 1fr;
          gap: 20px;
          padding: 14px 0;
          border-bottom: 1px solid var(--ink-hair);
        }
        .about__timeline-period {
          font-family: var(--font-stack-mono);
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--ink-4);
          align-self: baseline;
        }
        .about__timeline-role {
          font-family: var(--font-stack-mono);
          font-weight: 400;
          font-size: 13px;
          color: var(--ink);
          margin: 0;
        }
        .about__timeline-org { color: var(--ink-3); }

        /* ── Foot ─────────────────────────────────────── */
        .about__foot {
          display: flex;
          align-items: baseline;
          gap: 10px;
          padding-top: 16px;
          border-top: 1px solid var(--ink-hair);
          font-family: var(--font-stack-mono);
          font-size: 9px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--ink-3);
        }
        .about__foot-dot { color: var(--ink-4); }

        @media (max-width: 640px) {
          .about__timeline-row {
            grid-template-columns: 1fr;
            gap: 4px;
          }
        }
      `}</style>
    </main>
  );
}
