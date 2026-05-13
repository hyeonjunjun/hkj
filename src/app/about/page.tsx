import Link from "next/link";
import { CONTACT_EMAIL } from "@/constants/contact";
import { NOTES } from "@/constants/notes";

/**
 * /about — multidisciplinary practice, in the home's mono register.
 *
 * Single editorial column. Top: eyebrow + display title + lede.
 * Middle: three numbered practice notes. Bottom: a facts ledger.
 * Hairline rules separate sections; everything composes from the
 * .t-* utility classes. No sans, no italics, no inline typography.
 *
 * Voice: multidisciplinary creative — designer + engineer + creative
 * direction. Music-coded sensibility (BTS, Fred Again) is allowed to
 * surface in the practice notes; the lede stays plain.
 */
export default function AboutPage() {
  return (
    <main id="main" className="about">
      <header className="about__head">
        <p className="t-eyebrow">About</p>
        <h1 className="t-display about__title">A multidisciplinary practice.</h1>
        <p className="t-prose about__lede">
          ryan jun designs, engineers, and directs — across interface,
          identity, and the spaces between. one set of hands, sketch to
          deployment, brief to release.
        </p>
      </header>

      <hr className="t-rule" />

      <section className="about__notes" aria-label="Practice">
        <header className="about__sec-head">
          <span className="t-section">Practice</span>
          <span className="t-meta">03 notes</span>
        </header>
        <ol className="about__list" role="list">
          <Note num="01" heading="Concept to code">
            most engagements begin with editing — subtract first, then
            compose what remains until the system reads as one decision
            repeated.
          </Note>
          <Note num="02" heading="Design and engineering">
            the interface is shipped, not handed off. typography, motion,
            and state are made in the same tool that compiles them.
          </Note>
          <Note num="03" heading="Music as a load-bearing input">
            atmosphere, restraint, and tracklist-as-grammar — the way bts
            and fred again sequence a release informs how a site sequences
            attention. composition before color, before chrome.
          </Note>
        </ol>
      </section>

      <hr className="t-rule" />

      <section className="about__facts" aria-label="Currently">
        <header className="about__sec-head">
          <span className="t-section">Currently</span>
          <span className="t-meta">2026.05.12</span>
        </header>
        <dl className="about__ledger">
          <Row label="Based">new york</Row>
          <Row label="Status">selective for q3 2026</Row>
          <Row label="Practice">design · engineering · direction</Row>
          <Row label="Founded">2021</Row>
          <Row label="Contact">
            <a href={`mailto:${CONTACT_EMAIL}`} className="about__email">
              {CONTACT_EMAIL}
            </a>
          </Row>
        </dl>
      </section>

      <hr className="t-rule" />

      <footer className="about__further">
        <Link href="/notes" className="about__further-link">
          <span className="t-section">Read</span>
          <span className="about__further-label">
            recent studio notes{" "}
            <span className="t-meta dim about__further-count">
              {String(NOTES.length).padStart(2, "0")}
            </span>
          </span>
          <span className="about__further-arrow" aria-hidden>
            ↗
          </span>
        </Link>
      </footer>

      <style>{`
        .about {
          padding: clamp(80px, 12vh, 140px) var(--margin-page) clamp(56px, 8vh, 96px);
          max-width: 920px;
          margin-inline: auto;
          display: grid;
          row-gap: clamp(48px, 6vh, 80px);
        }

        .about__head {
          display: grid;
          row-gap: clamp(14px, 1.6vh, 22px);
          max-width: 56ch;
        }
        .about__title {
          text-transform: none;
          letter-spacing: -0.03em;
        }
        .about__lede {
          color: var(--ink-2);
          text-transform: lowercase;
          max-width: 48ch;
        }

        .about__sec-head {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 24px;
          padding-bottom: clamp(12px, 1.4vh, 18px);
        }

        .about__list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          row-gap: clamp(20px, 2.4vh, 32px);
        }

        .about__ledger {
          margin: 0;
          display: grid;
          grid-template-columns: clamp(80px, 12vw, 120px) 1fr;
          row-gap: 6px;
          column-gap: 24px;
          max-width: 56ch;
        }
        .about__email {
          color: var(--ink);
          background-image: linear-gradient(currentColor, currentColor);
          background-size: 0% 1px;
          background-position: 0 100%;
          background-repeat: no-repeat;
          transition: background-size 200ms var(--ease);
        }
        .about__email:hover { background-size: 100% 1px; }

        .about__further {
          display: flex;
          align-items: baseline;
        }
        .about__further-link {
          display: grid;
          grid-template-columns: clamp(80px, 12vw, 120px) 1fr auto;
          column-gap: clamp(20px, 3vw, 40px);
          align-items: baseline;
          width: 100%;
          color: var(--ink);
          transition: opacity 200ms var(--ease);
        }
        .about__further-link:hover { opacity: 0.7; }
        .about__further-label {
          font-family: var(--font-stack-mono);
          font-size: var(--type-meta);
          letter-spacing: var(--track-loosest);
          text-transform: lowercase;
          color: var(--ink);
        }
        .about__further-count {
          margin-left: 6px;
        }
        .about__further-arrow {
          font-family: var(--font-stack-mono);
          font-size: var(--type-meta);
          color: var(--ink-3);
          letter-spacing: 0;
        }

        @media (max-width: 720px) {
          .about { row-gap: clamp(32px, 5vh, 56px); }
          .about__ledger {
            grid-template-columns: 1fr;
            row-gap: 12px;
          }
          .about__further-link {
            grid-template-columns: 1fr auto;
            row-gap: 6px;
          }
        }
      `}</style>
    </main>
  );
}

function Note({
  num,
  heading,
  children,
}: {
  num: string;
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <li className="note">
      <span className="t-code note__num">{num}</span>
      <p className="t-prose note__body">
        <span className="note__head">{heading}.</span> {children}
      </p>
      <style>{`
        .note {
          display: grid;
          grid-template-columns: clamp(28px, 3vw, 40px) 1fr;
          column-gap: clamp(16px, 2vw, 28px);
          align-items: baseline;
        }
        .note__num {
          color: var(--ink-3);
          padding-top: 3px;
        }
        .note__body {
          color: var(--ink-2);
          text-transform: lowercase;
          max-width: 50ch;
          margin: 0;
        }
        .note__head {
          color: var(--ink);
          text-transform: lowercase;
        }
      `}</style>
    </li>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <>
      <dt className="t-meta dim">{label}</dt>
      <dd className="t-meta about__row-val">{children}</dd>
      <style>{`
        .about__row-val {
          color: var(--ink);
          text-transform: lowercase;
          margin: 0;
        }
      `}</style>
    </>
  );
}
