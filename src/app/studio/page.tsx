import Link from "next/link";
import Footer from "@/components/Footer";
import { PIECES } from "@/constants/pieces";

/**
 * /studio — positioning + values + facts.
 *
 * Combined-reference shape:
 *  - Aino's /about: positioning paragraph, short value props,
 *    a facts row (founded · location · entries).
 *  - HS68's editorial register: small uppercase eyebrow + display
 *    title + narrow body column.
 *
 * Single sans family. No experience timeline. No ledger. No serif.
 */
export default function StudioPage() {
  const realCount = PIECES.filter((p) => !p.placeholder).length;
  const startedYear = 2021;

  return (
    <main id="main" className="studio">
      <section className="studio__hero">
        <p className="studio__eyebrow">
          <span>Studio</span>
          <span className="studio__sep" aria-hidden>·</span>
          <span className="tabular">02</span>
        </p>
        <h1 className="studio__title">Studio</h1>
        <p className="studio__lede">
          A design-engineering practice of one, working between interface
          and identity systems. Small on purpose — one set of hands
          carrying the work from first sketch through the final ship.
        </p>
      </section>

      <section className="studio__values" aria-label="Practice">
        <Value
          heading="Concept to code"
          body="Most engagements begin with editing. A product surface that has accumulated affordances; a brand that has outgrown its first marks; a small piece of typography that never quite settled. The work is to subtract first, then compose what remains until the system reads as one decision repeated."
        />
        <Value
          heading="Design and engineering"
          body="The interface is shipped, not handed off. Decisions about typography, motion, and state are made in the same tool that compiles them. A figure isn't styled in one place and assembled in another."
        />
        <Value
          heading="Quiet by design"
          body="Atmosphere lives in whitespace, type, and the photographs — never in color-shift or theatrical framing. Restraint is the position, not the absence of one."
        />
      </section>

      <section className="studio__facts" aria-label="Facts">
        <Fact label="Founded"   value={String(startedYear)} />
        <Fact label="Location"  value="New York" />
        <Fact label="Practice"  value="Design + Engineering" />
        <Fact label="Entries"   value={`${PIECES.length} (${realCount} shipped)`} />
        <Fact label="Available" value="2026 selective" />
      </section>

      <section className="studio__contact" aria-label="Get in touch">
        <p className="studio__contact-prompt">
          For new work, partnerships, or a quick question —{" "}
          <Link href="/contact" className="studio__contact-link">
            get in touch.
          </Link>
        </p>
      </section>

      <Footer />

      <style>{`
        .studio {
          padding: clamp(96px, 16vh, 168px) var(--margin-page) 0;
          max-width: 1440px;
          margin-inline: auto;
          display: grid;
          gap: var(--space-section);
        }

        .studio__hero {
          display: grid;
          gap: 18px;
          max-width: 720px;
        }
        .studio__eyebrow {
          display: inline-flex;
          gap: 8px;
          font-family: var(--font-stack-sans);
          font-size: var(--type-nav);
          line-height: 1;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--ink-3);
          font-variant-numeric: tabular-nums;
          margin: 0;
        }
        .studio__sep { color: var(--ink-4); }
        .studio__title {
          font-family: var(--font-stack-sans);
          font-weight: 380;
          font-size: var(--type-display);
          line-height: 1.05;
          letter-spacing: -0.02em;
          color: var(--ink);
          margin: 0;
        }
        .studio__lede {
          font-family: var(--font-stack-sans);
          font-weight: 400;
          font-size: var(--type-statement);
          line-height: 1.32;
          letter-spacing: -0.01em;
          color: var(--ink-2);
          max-width: 50ch;
          margin: 14px 0 0;
          text-wrap: balance;
        }

        .studio__values {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: clamp(24px, 3vw, 48px);
        }
        @media (max-width: 880px) {
          .studio__values { grid-template-columns: 1fr; gap: 28px; }
        }

        .studio__facts {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: clamp(20px, 2.4vw, 36px);
          padding-top: var(--space-section);
          border-top: 1px solid var(--ink-hair);
        }
        @media (max-width: 880px) {
          .studio__facts { grid-template-columns: 1fr 1fr; gap: 18px; }
        }

        .studio__contact {
          padding-top: var(--space-section);
          border-top: 1px solid var(--ink-hair);
        }
        .studio__contact-prompt {
          font-family: var(--font-stack-sans);
          font-weight: 400;
          font-size: var(--type-statement);
          line-height: 1.32;
          letter-spacing: -0.01em;
          color: var(--ink-2);
          max-width: 50ch;
          margin: 0;
          text-wrap: balance;
        }
        .studio__contact-link {
          color: var(--ink);
          text-decoration: underline;
          text-decoration-color: transparent;
          text-decoration-thickness: 1px;
          text-underline-offset: 4px;
          transition: text-decoration-color 180ms var(--ease);
        }
        .studio__contact-link:hover { text-decoration-color: currentColor; }
      `}</style>
    </main>
  );
}

function Value({ heading, body }: { heading: string; body: string }) {
  return (
    <div className="value">
      <h2 className="value__head">{heading}</h2>
      <p className="value__body">{body}</p>
      <style>{`
        .value { display: grid; gap: 12px; }
        .value__head {
          font-family: var(--font-stack-sans);
          font-weight: 500;
          font-size: var(--type-title);
          line-height: 1.3;
          color: var(--ink);
          margin: 0;
        }
        .value__body {
          font-family: var(--font-stack-sans);
          font-weight: 400;
          font-size: var(--type-body);
          line-height: 1.55;
          color: var(--ink-2);
          margin: 0;
          text-wrap: pretty;
        }
      `}</style>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="fact">
      <dt className="fact__label">{label}</dt>
      <dd className="fact__value tabular">{value}</dd>
      <style>{`
        .fact { display: grid; gap: 6px; }
        .fact__label {
          font-family: var(--font-stack-sans);
          font-size: var(--type-nav);
          line-height: 1;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--ink-3);
          margin: 0;
        }
        .fact__value {
          font-family: var(--font-stack-sans);
          font-size: var(--type-body);
          line-height: 1.3;
          color: var(--ink);
          margin: 0;
        }
      `}</style>
    </div>
  );
}
