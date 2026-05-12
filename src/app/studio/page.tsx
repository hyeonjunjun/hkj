import { CONTACT_EMAIL } from "@/constants/contact";

/**
 * /studio — practice positioning, in the home's mono register.
 *
 * Single editorial column. Top: eyebrow + display title + lede.
 * Middle: three numbered practice notes ("Practice" section).
 * Bottom: a facts line ("Currently" section). Hairline rules
 * separate sections; everything composes from the .t-* utility
 * classes. No sans, no italics, no inline-style typography.
 *
 * The lede here speaks about the WORK; the home's lede speaks
 * about HOW HE LISTENS. They complement, don't duplicate.
 */
export default function StudioPage() {
  return (
    <main id="main" className="studio">
      <header className="studio__head">
        <p className="t-eyebrow">Studio</p>
        <h1 className="t-display studio__title">A studio of one.</h1>
        <p className="t-prose studio__lede">
          ryan jun designs and engineers interface and identity —
          one set of hands, sketch to deployment.
        </p>
      </header>

      <hr className="t-rule" />

      <section className="studio__notes" aria-label="Practice">
        <header className="studio__sec-head">
          <span className="t-section">Practice</span>
          <span className="t-meta">03 notes</span>
        </header>
        <ol className="studio__list" role="list">
          <Note num="01" heading="Concept to code">
            most engagements begin with editing — subtract first, then
            compose what remains until the system reads as one decision
            repeated.
          </Note>
          <Note num="02" heading="Design and engineering">
            the interface is shipped, not handed off. typography, motion,
            and state are made in the same tool that compiles them.
          </Note>
          <Note num="03" heading="Quiet by design">
            atmosphere lives in whitespace and type. never in color-shift
            or theatrical framing.
          </Note>
        </ol>
      </section>

      <hr className="t-rule" />

      <section className="studio__facts" aria-label="Currently">
        <header className="studio__sec-head">
          <span className="t-section">Currently</span>
          <span className="t-meta">2026.05.10</span>
        </header>
        <dl className="studio__ledger">
          <Row label="Based">new york</Row>
          <Row label="Status">selective for q3 2026</Row>
          <Row label="Founded">2021</Row>
          <Row label="Contact">
            <a href={`mailto:${CONTACT_EMAIL}`} className="studio__email">
              {CONTACT_EMAIL}
            </a>
          </Row>
        </dl>
      </section>

      <style>{`
        .studio {
          padding: clamp(80px, 12vh, 140px) var(--margin-page) clamp(56px, 8vh, 96px);
          max-width: 920px;
          margin-inline: auto;
          display: grid;
          row-gap: clamp(48px, 6vh, 80px);
        }

        /* Header — eyebrow + title + lede stacked tight. */
        .studio__head {
          display: grid;
          row-gap: clamp(14px, 1.6vh, 22px);
          max-width: 56ch;
        }
        .studio__title {
          /* Override t-display caps off — title is sentence case
             at this scale for editorial reading. */
          text-transform: none;
          letter-spacing: -0.03em;
        }
        .studio__lede {
          color: var(--ink-2);
          text-transform: lowercase;
          max-width: 48ch;
        }

        /* Section header — label + meta, hairline below already
           comes from the parent .t-rule sibling. */
        .studio__sec-head {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 24px;
          padding-bottom: clamp(12px, 1.4vh, 18px);
        }

        /* Numbered notes — inline-grid rows: number / body. */
        .studio__list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          row-gap: clamp(20px, 2.4vh, 32px);
        }

        /* Currently — label/value rows, similar microtype to home
           active block. */
        .studio__ledger {
          margin: 0;
          display: grid;
          grid-template-columns: clamp(80px, 12vw, 120px) 1fr;
          row-gap: 6px;
          column-gap: 24px;
          max-width: 56ch;
        }
        .studio__email {
          color: var(--ink);
          background-image: linear-gradient(currentColor, currentColor);
          background-size: 0% 1px;
          background-position: 0 100%;
          background-repeat: no-repeat;
          transition: background-size 200ms var(--ease);
        }
        .studio__email:hover { background-size: 100% 1px; }

        @media (max-width: 720px) {
          .studio { row-gap: clamp(32px, 5vh, 56px); }
          .studio__ledger {
            grid-template-columns: 1fr;
            row-gap: 12px;
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
      <dd className="t-meta studio__row-val">{children}</dd>
      <style>{`
        .studio__row-val {
          color: var(--ink);
          text-transform: lowercase;
          margin: 0;
        }
      `}</style>
    </>
  );
}
