"use client";

import Link from "next/link";
import { NOTES } from "@/constants/notes";
import { SHELF } from "@/constants/shelf";

/**
 * /shelf — combined notes + bookmarks. Two sub-sections inside one
 * document: what I've written (top), what I keep (bottom). Notes
 * carry an N-NNN registry; bookmarks carry year + attribution.
 *
 * Detail pages for individual notes still live at /notes/[slug].
 */
export default function ShelfPage() {
  const notes = [...NOTES].sort((a, b) => b.date.localeCompare(a.date));
  const bookmarks = SHELF.filter((s) => s.group === "READ");

  return (
    <main id="main" className="shelf">
      <article className="shelf__inner">
        <header className="shelf__head">
          <p className="eyebrow">
            <span>Shelf</span>
            <span className="eyebrow__sep">·</span>
            <span className="tabular">2026</span>
          </p>
          <h1 className="shelf__title">
            Notes I write, references I keep.
          </h1>
        </header>

        <section className="shelf__section">
          <header className="shelf__section-head">
            <span className="shelf__section-label">Notes</span>
            <span className="shelf__section-count tabular">
              {String(notes.length).padStart(2, "0")} Entries
            </span>
          </header>
          <ol className="shelf__list">
            {notes.map((n) => (
              <li key={n.slug} className="shelf__row">
                <Link href={`/notes/${n.slug}`} className="shelf__row-link">
                  <span className="shelf__row-num tabular">N-{n.number}</span>
                  <span className="shelf__row-date tabular">{n.dateLabel}</span>
                  <span className="shelf__row-title">{n.title}</span>
                  <span className="shelf__row-arrow" aria-hidden>→</span>
                </Link>
              </li>
            ))}
          </ol>
        </section>

        <section className="shelf__section">
          <header className="shelf__section-head">
            <span className="shelf__section-label">Bookmarks</span>
            <span className="shelf__section-count tabular">
              {String(bookmarks.length).padStart(2, "0")} Entries
            </span>
          </header>
          <ol className="shelf__list">
            {bookmarks.map((item) => {
              const body = (
                <>
                  <span className="shelf__row-year tabular">
                    {item.year ?? ""}
                  </span>
                  <span className="shelf__row-title">{item.title}</span>
                  <span className="shelf__row-attribution">
                    {item.attribution ?? ""}
                  </span>
                </>
              );
              return (
                <li key={item.id} className="shelf__row">
                  {item.href ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shelf__row-link"
                    >
                      {body}
                    </a>
                  ) : (
                    <div className="shelf__row-link shelf__row-link--static">
                      {body}
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        </section>
      </article>

      <style>{`
        .shelf {
          min-height: 100svh;
          padding: clamp(120px, 18vh, 200px) clamp(24px, 4vw, 72px) clamp(80px, 12vh, 120px);
          display: flex;
          justify-content: center;
        }
        .shelf__inner {
          width: 100%;
          max-width: 820px;
          display: grid;
          gap: clamp(48px, 7vh, 72px);
        }

        .shelf__head { display: grid; gap: 18px; }
        .shelf__title {
          font-family: var(--font-stack-sans);
          font-weight: 500;
          font-size: clamp(22px, 2.4vw, 30px);
          line-height: 1.25;
          letter-spacing: var(--track-heading);
          color: var(--ink);
          margin: 6px 0 0;
          max-width: 32ch;
        }

        .shelf__section { display: grid; gap: 12px; }
        .shelf__section-head {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          padding-bottom: 10px;
          border-bottom: 1px solid var(--ink);
        }
        .shelf__section-label {
          font-family: var(--font-stack-mono);
          font-size: 11px;
          letter-spacing: var(--track-caps-mono);
          text-transform: uppercase;
          color: var(--ink);
        }
        .shelf__section-count {
          font-family: var(--font-stack-mono);
          font-size: 10px;
          letter-spacing: var(--track-caps-mono);
          text-transform: uppercase;
          color: var(--ink-3);
          font-variant-numeric: tabular-nums;
        }

        .shelf__list { list-style: none; margin: 0; padding: 0; }
        .shelf__row { border-bottom: 1px solid var(--ink-hair); }
        .shelf__row-link {
          display: grid;
          grid-template-columns: 64px 110px 1fr 22px;
          gap: 20px;
          align-items: baseline;
          padding: 14px 0;
          color: var(--ink);
          transition: background 200ms var(--ease);
        }
        .shelf__row-link:hover { background: var(--ink-ghost); }
        .shelf__row-link--static { cursor: default; }

        /* Notes section */
        .shelf__row-num {
          font-family: var(--font-stack-mono);
          font-size: 10px;
          letter-spacing: var(--track-caps-mono);
          text-transform: uppercase;
          color: var(--ink-4);
          font-variant-numeric: tabular-nums;
        }
        .shelf__row-date {
          font-family: var(--font-stack-mono);
          font-size: 11px;
          letter-spacing: 0;
          color: var(--ink-3);
          font-variant-numeric: tabular-nums;
        }
        .shelf__row-arrow {
          font-family: var(--font-stack-sans);
          font-size: 12px;
          color: var(--ink-3);
          text-align: right;
        }

        /* Bookmarks section — different grid columns */
        .shelf__section:nth-of-type(2) .shelf__row-link {
          grid-template-columns: 64px minmax(180px, 1.3fr) 1fr;
        }
        .shelf__row-year {
          font-family: var(--font-stack-mono);
          font-size: 11px;
          letter-spacing: 0;
          color: var(--ink-4);
          font-variant-numeric: tabular-nums;
        }
        .shelf__row-title {
          font-family: var(--font-stack-sans);
          font-size: 13px;
          letter-spacing: 0;
          color: var(--ink);
        }
        .shelf__row-attribution {
          font-family: var(--font-stack-mono);
          font-size: 11px;
          letter-spacing: var(--track-caps-mono);
          text-transform: uppercase;
          color: var(--ink-3);
          text-align: right;
        }

        @media (max-width: 640px) {
          .shelf__row-link {
            grid-template-columns: 56px 1fr 18px;
            gap: 12px 14px;
          }
          .shelf__row-date { display: none; }
          .shelf__section:nth-of-type(2) .shelf__row-link {
            grid-template-columns: 52px 1fr;
          }
          .shelf__row-attribution {
            grid-column: 2;
            text-align: left;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .shelf__row-link { transition: none; }
        }
      `}</style>
    </main>
  );
}
