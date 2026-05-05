"use client";

import CopyEmailLink from "@/components/CopyEmailLink";
import { CONTACT_EMAIL, NETWORKS } from "@/constants/contact";
import { EXPERIENCE } from "@/constants/experience";

/**
 * /about — single surface for bio, engagements, contact, and a
 * condensed colophon. Pawson's stopping rule: three half-populated
 * pages collapse into one substantive page.
 *
 * Composition: eyebrow → name → one-line lede → bio → engagements →
 * contact → colophon. Running prose where prose belongs; rows where
 * data belongs.
 */
export default function AboutPage() {
  return (
    <main id="main" className="about">
      <article className="about__inner">
        <header className="about__head">
          <p className="eyebrow">
            <span>About</span>
            <span className="eyebrow__sep">·</span>
            <span className="tabular">2026</span>
          </p>
          <h1 className="about__title">Ryan Jun.</h1>
          <p className="about__lede">
            Designer working on interfaces and brands. New York. Available
            through 2026.{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="about__mail">
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </header>

        <section className="about__section">
          <header className="about__section-head">
            <span className="about__section-label">Bio</span>
          </header>
          <div className="about__prose">
            <p>
              I build for the web — brands, interfaces, and small experiments in
              between. I care about typography, motion, and the parts that make
              software feel made, not assembled.
            </p>
            <p className="about__prose-drop">
              I treat AI as a collaborator, not a shortcut.
            </p>
          </div>
        </section>

        <section className="about__section">
          <header className="about__section-head">
            <span className="about__section-label">Engagements</span>
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

        <section className="about__section">
          <header className="about__section-head">
            <span className="about__section-label">Contact</span>
          </header>
          <ul className="about__contact">
            <li className="about__contact-row">
              <span className="about__contact-key">Email</span>
              <CopyEmailLink className="about__handle" />
            </li>
            {NETWORKS.map((n) => (
              <li key={n.label} className="about__contact-row">
                <span className="about__contact-key">{n.label}</span>
                <a
                  href={n.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="about__handle"
                >
                  {n.handle}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="about__section">
          <header className="about__section-head">
            <span className="about__section-label">Colophon</span>
          </header>
          <div className="about__prose">
            <p>
              Set in Geist Sans and Newsreader. Modular type scale on a
              Perfect Fourth ratio. Paper-and-ink palette — no second hue.
              Motion sits in a 120–400 ms window with one approved easing
              catalog; nothing animates on idle. Built with Next.js 16 and
              the View Transitions API. Hosted on Vercel.
            </p>
          </div>
        </section>

        <footer className="colophon">
          <span className="colophon__year tabular">© 2026 RJ</span>
          <span className="colophon__build tabular">
            Build {process.env.NEXT_PUBLIC_BUILD_SHA?.slice(0, 7) ?? "local"}
          </span>
        </footer>
      </article>

      <style>{`
        .about {
          min-height: 100svh;
          padding: clamp(120px, 18vh, 200px) clamp(24px, 4vw, 72px) clamp(80px, 12vh, 120px);
          display: flex;
          justify-content: center;
          color: var(--ink);
        }
        .about__inner {
          width: 100%;
          max-width: 600px;
          display: grid;
          gap: clamp(48px, 7vh, 72px);
        }

        .about__head { display: grid; gap: 18px; }
        .about__title {
          font-family: var(--font-stack-sans);
          font-weight: 500;
          font-size: clamp(22px, 2.4vw, 30px);
          line-height: 1.25;
          letter-spacing: var(--track-heading);
          color: var(--ink);
          margin: 0;
        }
        .about__lede {
          font-family: var(--font-stack-sans);
          font-size: 13px;
          line-height: 1.7;
          color: var(--ink-2);
          max-width: 56ch;
          margin: 0;
        }
        .about__mail { color: var(--ink); }

        .about__section { display: grid; gap: 16px; }
        .about__section-head {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          padding-bottom: 10px;
          border-bottom: 1px solid var(--ink);
        }
        .about__section-label {
          font-family: var(--font-stack-mono);
          font-size: 11px;
          letter-spacing: var(--track-caps-mono);
          text-transform: uppercase;
          color: var(--ink);
        }
        .about__section-count {
          font-family: var(--font-stack-mono);
          font-size: 10px;
          letter-spacing: var(--track-caps-mono);
          text-transform: uppercase;
          color: var(--ink-3);
          font-variant-numeric: tabular-nums;
        }

        .about__prose {
          display: grid;
          gap: 1em;
          font-family: var(--font-stack-sans);
          font-size: 13px;
          line-height: 1.85;
          color: var(--ink-2);
          max-width: 56ch;
        }
        .about__prose p { margin: 0; }
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

        .about__timeline { margin: 0; display: grid; gap: 0; }
        .about__timeline-row {
          display: grid;
          grid-template-columns: 140px 1fr;
          gap: 24px;
          padding: 12px 0;
          border-bottom: 1px solid var(--ink-hair);
          align-items: baseline;
        }
        .about__timeline-period {
          font-family: var(--font-stack-mono);
          font-size: 11px;
          letter-spacing: var(--track-caps-mono);
          text-transform: uppercase;
          color: var(--ink-3);
          font-variant-numeric: tabular-nums;
        }
        .about__timeline-role {
          font-family: var(--font-stack-sans);
          font-size: 12px;
          color: var(--ink);
          margin: 0;
        }
        .about__timeline-org { color: var(--ink-3); }

        .about__contact { list-style: none; margin: 0; padding: 0; display: grid; gap: 0; }
        .about__contact-row {
          display: grid;
          grid-template-columns: 140px 1fr;
          gap: 24px;
          padding: 12px 0;
          border-bottom: 1px solid var(--ink-hair);
          align-items: baseline;
        }
        .about__contact-key {
          font-family: var(--font-stack-mono);
          font-size: 11px;
          letter-spacing: var(--track-caps-mono);
          text-transform: uppercase;
          color: var(--ink-3);
        }
        .about__handle {
          font-family: var(--font-stack-sans);
          font-size: 12px;
          color: var(--ink);
        }
        .about__handle[data-copied] { color: var(--ink-3); }

        .colophon {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          padding-top: clamp(24px, 4vh, 48px);
          margin-top: clamp(48px, 8vh, 96px);
          border-top: 1px solid var(--ink-hair);
          font-family: var(--font-stack-mono);
          font-size: 11px;
          letter-spacing: var(--track-caps-mono);
          text-transform: uppercase;
          color: var(--ink-3);
          font-variant-numeric: tabular-nums;
        }

        @media (max-width: 640px) {
          .about__timeline-row,
          .about__contact-row {
            grid-template-columns: 1fr;
            gap: 4px;
          }
        }
      `}</style>
    </main>
  );
}
