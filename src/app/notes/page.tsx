import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import { NOTES } from "@/constants/notes";

export const metadata: Metadata = {
  title: "Notes",
  description:
    "Notes — short essays and observations on practice, restraint, and craft.",
};

/**
 * /notes — index of essays and observations (spec §08, §04 in folio).
 *
 * Reverse-chronological list, each row links to /notes/[slug]. Hover
 * reveals a hairline ghost background and slides a forward arrow.
 */
export default function NotesPage() {
  const notes = [...NOTES].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <main id="main" className="notes">
      <div className="notes__void" aria-hidden />

      <article className="notes__inner">
        <header className="notes__head">
          <p className="notes__eyebrow">
            <span>Notes</span>
            <span className="notes__eyebrow-sep" aria-hidden>
              ·
            </span>
            <span className="tabular">§04</span>
          </p>
          <h1 className="notes__title">Notes</h1>
          <p className="notes__lede">
            Short essays from the studio — process notes, restraint
            principles, and what gets cut along the way.
          </p>
        </header>

        <section className="notes__section" aria-label="Notes index">
          <header className="notes__section-head">
            <span className="notes__section-label">Index</span>
            <span className="notes__section-count tabular">
              {String(notes.length).padStart(2, "0")} Entries
            </span>
          </header>
          <ol className="notes__list">
            {notes.map((n) => {
              const yyyymm = n.date.slice(0, 7);
              return (
                <li key={n.slug} className="notes__row">
                  <Link href={`/notes/${n.slug}`} className="notes__row-link">
                    <span className="notes__row-date tabular">{yyyymm}</span>
                    <span className="notes__row-num tabular">
                      N-{n.number}
                    </span>
                    <span className="notes__row-title">{n.title}</span>
                    <span className="notes__row-excerpt">{n.excerpt}</span>
                    <span className="notes__row-arrow" aria-hidden>
                      →
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </section>
      </article>

      <Footer />

      <style>{`
        .notes {
          padding: 0 var(--margin-page);
          max-width: 1280px;
          margin-inline: auto;
          color: var(--ink);
        }
        .notes__void { height: var(--space-void); }
        .notes__inner {
          display: grid;
          gap: var(--space-section);
        }

        .notes__head { display: grid; gap: 18px; max-width: 720px; }
        .notes__eyebrow {
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
        .notes__eyebrow-sep { color: var(--ink-4); }
        .notes__title {
          font-family: var(--font-stack-sans);
          font-weight: 380;
          font-size: var(--type-display);
          line-height: 1.05;
          letter-spacing: var(--track-display);
          color: var(--ink);
          margin: 0;
        }
        .notes__lede {
          font-family: var(--font-stack-sans);
          font-size: var(--type-body);
          line-height: 1.55;
          color: var(--ink-2);
          max-width: 56ch;
          margin: 0;
        }

        .notes__section { display: grid; gap: 12px; }
        .notes__section-head {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          padding-bottom: 10px;
          border-bottom: 1px solid var(--ink);
        }
        .notes__section-label {
          font-family: var(--font-stack-sans);
          font-size: var(--type-nav);
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--ink);
        }
        .notes__section-count {
          font-family: var(--font-stack-mono);
          font-size: var(--type-meta);
          letter-spacing: var(--track-caps-mono);
          text-transform: uppercase;
          color: var(--ink-3);
          font-variant-numeric: tabular-nums;
        }

        .notes__list { list-style: none; margin: 0; padding: 0; }
        .notes__row { border-bottom: 1px solid var(--ink-hair); }
        .notes__row-link {
          display: grid;
          grid-template-columns: 80px 64px minmax(220px, 1.6fr) minmax(0, 2fr) 22px;
          gap: 20px;
          align-items: baseline;
          padding: 18px 8px;
          margin: 0 -8px;
          color: var(--ink);
          transition: background 380ms var(--ease);
        }
        .notes__row-link:hover {
          background: var(--ink-ghost);
        }

        .notes__row-date {
          font-family: var(--font-stack-mono);
          font-size: var(--type-number);
          letter-spacing: 0;
          color: var(--ink-3);
          font-variant-numeric: tabular-nums;
        }
        .notes__row-num {
          font-family: var(--font-stack-mono);
          font-size: var(--type-number);
          letter-spacing: var(--track-caps-mono);
          text-transform: uppercase;
          color: var(--ink-4);
          font-variant-numeric: tabular-nums;
        }
        .notes__row-title {
          font-family: var(--font-stack-sans);
          font-size: var(--type-title);
          color: var(--ink);
          line-height: 1.35;
        }
        .notes__row-excerpt {
          font-family: var(--font-stack-sans);
          font-size: var(--type-meta);
          letter-spacing: 0;
          color: var(--ink-3);
          line-height: 1.55;
          text-transform: none;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .notes__row-arrow {
          font-family: var(--font-stack-sans);
          font-size: 12px;
          color: var(--ink-3);
          text-align: right;
          opacity: 0;
          transform: translateX(0);
          transition: opacity 200ms var(--ease), transform 200ms cubic-bezier(0.33, 0.12, 0.15, 1);
        }
        .notes__row-link:hover .notes__row-arrow {
          opacity: 1;
          transform: translateX(6px);
        }

        @media (max-width: 760px) {
          .notes__row-link {
            grid-template-columns: 64px 1fr;
            row-gap: 6px;
            column-gap: 12px;
          }
          .notes__row-num { display: none; }
          .notes__row-title { grid-column: 2; }
          .notes__row-excerpt { grid-column: 2; }
          .notes__row-arrow { display: none; }
        }

        @media (prefers-reduced-motion: reduce) {
          .notes__row-link,
          .notes__row-arrow { transition: none; }
        }
      `}</style>
    </main>
  );
}
