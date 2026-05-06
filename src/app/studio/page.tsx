import type { Metadata } from "next";
import CopyEmailLink from "@/components/CopyEmailLink";
import Footer from "@/components/Footer";
import { CONTACT_EMAIL, NETWORKS } from "@/constants/contact";
import { EXPERIENCE } from "@/constants/experience";

export const metadata: Metadata = {
  title: "Studio",
  description:
    "Studio — practice notes, availability, and contact for hyeonjoon jun.",
};

/**
 * /studio — bio + colophon page (spec §08, §02 in the folio register).
 *
 * Two-column at desktop (about prose | ledger of meta), stacked on
 * mobile. A small experience timeline lives below when the data is
 * present. Footer is the shared component.
 */
export default function StudioPage() {
  return (
    <main id="main" className="studio">
      <div className="studio__void" aria-hidden />

      <article className="studio__inner">
        <header className="studio__head">
          <p className="studio__eyebrow">
            <span>Studio</span>
            <span className="studio__eyebrow-sep" aria-hidden>
              ·
            </span>
            <span className="tabular">§02</span>
          </p>
          <h1 className="studio__title">About the Practice</h1>
        </header>

        <section className="studio__body">
          <div className="studio__about prose">
            <p>
              hyeonjoon jun is a design engineer working between interfaces
              and identity systems. The practice is small on purpose —
              one set of hands carrying the work from first sketch
              through the final ship.
            </p>
            <p>
              Most engagements begin with editing. A product surface
              that has accumulated affordances; a brand that has
              outgrown its first marks; a small piece of typography that
              never quite settled. The work is to subtract first, then
              compose what remains until the system reads as one
              decision repeated.
            </p>
            <p>
              I&apos;m taking on a small slate of selective engagements
              through 2026 — typography systems, product surfaces, and
              identity work for teams that want a single author across
              brand and interface. Reach me at{" "}
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
            </p>
          </div>

          <aside className="studio__ledger" aria-label="Practice ledger">
            <dl>
              <div className="studio__row">
                <dt className="studio__key">Location</dt>
                <dd className="studio__val">New York</dd>
              </div>
              <div className="studio__row">
                <dt className="studio__key">Role</dt>
                <dd className="studio__val">Design Engineer</dd>
              </div>
              <div className="studio__row">
                <dt className="studio__key">Available</dt>
                <dd className="studio__val">
                  Selective engagements 2026
                </dd>
              </div>
              <div className="studio__row">
                <dt className="studio__key">Email</dt>
                <dd className="studio__val">
                  <CopyEmailLink className="studio__mail" />
                </dd>
              </div>
              {NETWORKS.map((n) => (
                <div key={n.label} className="studio__row">
                  <dt className="studio__key">{n.label}</dt>
                  <dd className="studio__val">
                    <a
                      href={n.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="studio__handle"
                    >
                      {n.handle}
                    </a>
                  </dd>
                </div>
              ))}
            </dl>
          </aside>
        </section>

        {EXPERIENCE.length > 0 && (
          <section className="studio__experience" aria-label="Experience">
            <header className="studio__section-head">
              <span className="studio__section-label">Experience</span>
              <span className="studio__section-count tabular">
                {String(EXPERIENCE.length).padStart(2, "0")} Entries
              </span>
            </header>
            <dl className="studio__timeline">
              {EXPERIENCE.map((e) => (
                <div key={e.period} className="studio__timeline-row">
                  <dt className="studio__timeline-period tabular">
                    {e.period}
                  </dt>
                  <dd className="studio__timeline-role">
                    <span>{e.role}</span>
                    {e.org ? (
                      <span className="studio__timeline-org">, {e.org}</span>
                    ) : null}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        )}
      </article>

      <Footer />

      <style>{`
        .studio {
          padding: 0 var(--margin-page);
          max-width: 1280px;
          margin-inline: auto;
          color: var(--ink);
        }
        .studio__void { height: var(--space-void); }

        .studio__inner {
          display: grid;
          gap: var(--space-section);
        }

        /* ─── Head ─────────────────────────────────────────────────── */
        .studio__head { display: grid; gap: 18px; }
        .studio__eyebrow {
          display: flex;
          gap: 10px;
          font-family: var(--font-stack-sans);
          font-size: var(--type-nav);
          line-height: 1;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--ink-3);
          font-variant-numeric: tabular-nums;
        }
        .studio__eyebrow-sep { color: var(--ink-4); }
        .studio__title {
          font-family: var(--font-stack-sans);
          font-weight: 380;
          font-size: var(--type-display);
          line-height: 1.05;
          letter-spacing: var(--track-display);
          color: var(--ink);
          max-width: 14ch;
          margin: 0;
        }

        /* ─── Body — two columns at desktop ────────────────────────── */
        .studio__body {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(280px, 380px);
          gap: clamp(32px, 5vw, 96px);
          align-items: start;
        }

        .studio__about {
          font-family: var(--font-stack-serif);
          font-weight: 400;
          font-size: var(--type-prose);
          line-height: 1.65;
          color: var(--ink-2);
          max-width: 480px;
        }
        .studio__about p + p { margin-top: 1em; }

        /* ─── Ledger ───────────────────────────────────────────────── */
        .studio__ledger dl {
          display: grid;
          gap: 0;
          margin: 0;
        }
        .studio__row {
          display: grid;
          grid-template-columns: 88px 1fr;
          gap: 16px;
          padding: 12px 0;
          border-bottom: 1px solid var(--ink-hair);
          align-items: baseline;
        }
        .studio__row:first-child { border-top: 1px solid var(--ink-hair); }
        .studio__key {
          font-family: var(--font-stack-sans);
          font-size: var(--type-nav);
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--ink-3);
        }
        .studio__val {
          font-family: var(--font-stack-mono);
          font-size: var(--type-number);
          color: var(--ink-2);
          font-variant-numeric: tabular-nums;
          margin: 0;
        }
        .studio__mail,
        .studio__handle {
          color: var(--ink);
        }

        /* ─── Experience ───────────────────────────────────────────── */
        .studio__experience { display: grid; gap: 16px; }
        .studio__section-head {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          padding-bottom: 10px;
          border-bottom: 1px solid var(--ink);
        }
        .studio__section-label {
          font-family: var(--font-stack-sans);
          font-size: var(--type-nav);
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--ink);
        }
        .studio__section-count {
          font-family: var(--font-stack-mono);
          font-size: var(--type-meta);
          letter-spacing: var(--track-caps-mono);
          text-transform: uppercase;
          color: var(--ink-3);
          font-variant-numeric: tabular-nums;
        }
        .studio__timeline { margin: 0; display: grid; gap: 0; }
        .studio__timeline-row {
          display: grid;
          grid-template-columns: 160px 1fr;
          gap: 24px;
          padding: 14px 0;
          border-bottom: 1px solid var(--ink-hair);
          align-items: baseline;
        }
        .studio__timeline-period {
          font-family: var(--font-stack-mono);
          font-size: var(--type-number);
          letter-spacing: var(--track-caps-mono);
          text-transform: uppercase;
          color: var(--ink-3);
          font-variant-numeric: tabular-nums;
        }
        .studio__timeline-role {
          font-family: var(--font-stack-sans);
          font-size: var(--type-title);
          color: var(--ink);
          margin: 0;
        }
        .studio__timeline-org { color: var(--ink-3); }

        /* ─── Mobile ──────────────────────────────────────────────── */
        @media (max-width: 760px) {
          .studio__body {
            grid-template-columns: 1fr;
            gap: clamp(24px, 5vh, 40px);
          }
          .studio__row {
            grid-template-columns: 1fr;
            gap: 4px;
          }
          .studio__timeline-row {
            grid-template-columns: 1fr;
            gap: 4px;
          }
        }
      `}</style>
    </main>
  );
}
