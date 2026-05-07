import Footer from "@/components/Footer";

/**
 * /studio — positioning and practice notes.
 *
 * Single editorial column, max-width 720px. Three short sections under
 * inline subheads, then a one-line marginalia of facts. No 3-column
 * "values" cards, no 5-column stat ledger, no fake section numbering.
 *
 * Aino's about page reads as a single document; this matches that.
 */
export default function StudioPage() {
  return (
    <main id="main" className="studio">
      <header className="studio__head">
        <p className="studio__eyebrow">Studio</p>
        <h1 className="studio__title">A studio of one.</h1>
        <p className="studio__lede">
          A design-engineering practice working between interface and
          identity systems. Small on purpose — one set of hands carrying
          the work from first sketch through the final ship.
        </p>
      </header>

      <section className="studio__body" aria-label="Practice">
        <Note heading="Concept to code.">
          Most engagements begin with editing. A product surface that has
          accumulated affordances; a brand that has outgrown its first
          marks; a small piece of typography that never quite settled.
          The work is to subtract first, then compose what remains until
          the system reads as one decision repeated.
        </Note>
        <Note heading="Design and engineering.">
          The interface is shipped, not handed off. Decisions about
          typography, motion, and state are made in the same tool that
          compiles them. A figure isn&apos;t styled in one place and
          assembled in another.
        </Note>
        <Note heading="Quiet by design.">
          Atmosphere lives in whitespace, type, and the photographs —
          never in color-shift or theatrical framing. Restraint is the
          position, not the absence of one.
        </Note>
      </section>

      <p className="studio__facts tabular" aria-label="Facts">
        Founded 2021 · New York · Selective for 2026.
      </p>

      <Footer />

      <style>{`
        .studio {
          padding: clamp(96px, 16vh, 168px) var(--margin-page) 0;
          max-width: 1080px;
          margin-inline: auto;
          display: grid;
          gap: var(--space-section);
        }

        .studio__head {
          display: grid;
          gap: 14px;
          max-width: 720px;
        }
        .studio__eyebrow {
          font-family: var(--font-stack-mono);
          font-size: var(--type-nav);
          line-height: 1;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--ink-3);
          margin: 0;
        }
        .studio__title {
          font-family: var(--font-stack-sans);
          font-weight: 380;
          font-size: var(--type-display);
          line-height: 1.1;
          letter-spacing: -0.02em;
          color: var(--ink);
          margin: 0;
          text-wrap: balance;
        }
        .studio__lede {
          font-family: var(--font-stack-sans);
          font-weight: 400;
          font-size: var(--type-statement);
          line-height: 1.4;
          letter-spacing: -0.005em;
          color: var(--ink-2);
          max-width: 50ch;
          margin: 8px 0 0;
          text-wrap: balance;
        }

        .studio__body {
          display: grid;
          gap: clamp(28px, 3vw, 40px);
          max-width: 56ch;
        }

        .studio__facts {
          font-family: var(--font-stack-mono);
          font-size: var(--type-meta);
          line-height: 1;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--ink-3);
          margin: 0;
          padding-top: var(--space-section);
          border-top: 1px solid var(--ink-hair);
        }
      `}</style>
    </main>
  );
}

function Note({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <div className="note">
      <p className="note__body">
        <span className="note__head">{heading}</span> {children}
      </p>
      <style>{`
        .note { display: block; }
        .note__body {
          font-family: var(--font-stack-sans);
          font-weight: 400;
          font-size: var(--type-body);
          line-height: 1.65;
          color: var(--ink-2);
          margin: 0;
          text-wrap: pretty;
        }
        .note__head {
          color: var(--ink);
          font-weight: 500;
        }
      `}</style>
    </div>
  );
}
