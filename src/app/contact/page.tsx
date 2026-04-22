"use client";

import { CONTACT_EMAIL, NETWORKS } from "@/constants/contact";

/**
 * Contact — business card as composition. Microtypography clusters in
 * the four corners of the card with a single hairline rule bisecting
 * the middle. Mono throughout; letterspacing and hierarchy do all the
 * work.
 */
export default function ContactPage() {
  return (
    <main id="main" className="contact">
      <article className="card" aria-label="Hyeonjoon Jun — contact card">
        <header className="card__row card__row--top">
          <div className="card__cluster">
            <span className="card__key">Correspondent</span>
            <h1 className="card__name">Hyeonjoon Jun</h1>
            <p className="card__line">Design engineer</p>
            <p className="card__line">New York — 2026</p>
          </div>

          <div className="card__cluster card__cluster--right">
            <span className="card__key">Availability</span>
            <p className="card__line">Select engagements</p>
            <p className="card__line">Through 2026</p>
            <p className="card__line tabular">40°43′N 73°59′W</p>
          </div>
        </header>

        <div className="card__rule" aria-hidden />

        <footer className="card__row card__row--bot">
          <div className="card__cluster">
            <span className="card__key">Electronic</span>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="card__handle"
            >
              {CONTACT_EMAIL}
            </a>
          </div>

          <div className="card__cluster card__cluster--right">
            <span className="card__key">Networks</span>
            <ul className="card__networks">
              {NETWORKS.map((n) => (
                <li key={n.label}>
                  <a
                    href={n.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card__handle"
                  >
                    <span className="card__network-label">{n.label}</span>
                    <span className="card__network-sep" aria-hidden>·</span>
                    <span>{n.handle}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </footer>
      </article>

      <div className="contact__signoff" aria-hidden>
        <span>Hyeonjoon Jun</span>
        <span className="contact__sep">·</span>
        <span>New York</span>
        <span className="contact__sep">·</span>
        <span className="tabular">MMXXVI</span>
      </div>

      <style>{`
        .contact {
          min-height: 100svh;
          background: var(--paper);
          color: var(--ink);
          padding: clamp(96px, 14vh, 160px) clamp(24px, 4vw, 72px) clamp(72px, 10vh, 120px);
          display: grid;
          place-items: center;
          position: relative;
        }

        .card {
          width: min(920px, 100%);
          min-height: min(520px, 62svh);
          display: grid;
          grid-template-rows: auto auto auto;
          gap: clamp(48px, 9vh, 112px);
        }

        /* ── Card rows (top, bottom) ─────────────────── */
        .card__row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(24px, 4vw, 64px);
          align-items: start;
        }

        .card__cluster {
          display: grid;
          gap: 4px;
          align-content: start;
        }
        .card__cluster--right {
          justify-items: end;
          text-align: right;
        }

        /* Tiny label key ("Correspondent", "Availability", etc.) */
        .card__key {
          font-family: var(--font-stack-mono);
          font-size: 9px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: var(--ink-4);
          margin-bottom: 14px;
        }

        /* The name — larger mono, letterspaced, sits as the masthead. */
        .card__name {
          font-family: var(--font-stack-mono);
          font-weight: 400;
          font-size: clamp(20px, 2.4vw, 30px);
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: var(--ink);
          margin: 0 0 6px;
        }

        /* Supporting lines — role, city, year, coords. */
        .card__line {
          font-family: var(--font-stack-mono);
          font-size: 10px;
          letter-spacing: 0.20em;
          text-transform: uppercase;
          color: var(--ink-2);
          margin: 0;
        }

        /* Hairline rule between top + bottom clusters. */
        .card__rule {
          height: 1px;
          background: var(--ink-hair);
          width: 100%;
        }

        /* Email + network handles — the only "larger" text on the card. */
        .card__handle {
          font-family: var(--font-stack-mono);
          font-size: 12px;
          letter-spacing: 0.02em;
          text-transform: lowercase;
          color: var(--ink);
          display: inline-flex;
          gap: 8px;
          align-items: baseline;
          padding-bottom: 2px;
          border-bottom: 1px solid var(--ink-hair);
          transition: border-color 180ms var(--ease), color 180ms var(--ease);
        }
        .card__handle:hover {
          border-bottom-color: var(--ink);
        }

        .card__networks {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          gap: 10px;
          justify-items: end;
        }
        .card__network-label {
          font-size: 9px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--ink-3);
        }
        .card__network-sep { color: var(--ink-4); }

        /* ── Signoff — small, fixed at bottom center ──── */
        .contact__signoff {
          position: fixed;
          bottom: clamp(24px, 4vh, 44px);
          left: 0;
          right: 0;
          display: flex;
          justify-content: center;
          gap: 10px;
          font-family: var(--font-stack-mono);
          font-size: 9px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: var(--ink-4);
          z-index: 3;
          pointer-events: none;
        }
        .contact__sep { color: var(--ink-4); opacity: 0.6; }

        /* ── Responsive ───────────────────────────────── */
        @media (max-width: 640px) {
          .card { gap: 40px; }
          .card__row {
            grid-template-columns: 1fr;
            gap: 32px;
          }
          .card__cluster--right {
            justify-items: start;
            text-align: left;
          }
          .card__networks { justify-items: start; }
          .card__name { font-size: clamp(22px, 6vw, 28px); }
        }
      `}</style>
    </main>
  );
}
