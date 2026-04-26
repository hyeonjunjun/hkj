"use client";

import { SHELF } from "@/constants/shelf";
import Folio from "@/components/Folio";

/**
 * Bookmarks — single chronological list of references the studio returns to.
 * Subtracted from the prior four-vertical structure (Read/Watch/Keep/Visit)
 * down to one vertical: only the entries that exist in volume show up. The
 * other verticals were sparse scaffolding announcing future ambition more
 * than current substance — Hara reading: dishonest by quiet implication.
 * They return when they have substance.
 */
export default function BookmarksPage() {
  // Only the READ vertical (the only one with real volume); future verticals
  // come back as the data exists to support them.
  const items = SHELF.filter((s) => s.group === "READ");

  return (
    <main id="main" className="bookmarks">
      <Folio token="§03" />
      <article className="bookmarks__inner">
        <header className="bookmarks__head">
          <p className="eyebrow">
            <span>Bookmarks</span>
            <span className="eyebrow__sep">·</span>
            <span className="tabular">2026</span>
          </p>
          <h1 className="bookmarks__title">A list of resources I refer to.</h1>
        </header>

        <section className="bookmarks__section">
          <ol className="bookmarks__list">
            {items.map((item) => {
              const rowBody = (
                <>
                  <span className="bookmarks__row-year tabular">
                    {item.year ?? ""}
                  </span>
                  <span className="bookmarks__row-title">{item.title}</span>
                  <span className="bookmarks__row-attribution">
                    {item.attribution ?? ""}
                  </span>
                  {item.note && (
                    <span className="bookmarks__row-note">{item.note}</span>
                  )}
                </>
              );

              return (
                <li key={item.id} className="bookmarks__row">
                  {item.href ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bookmarks__row-link"
                    >
                      {rowBody}
                    </a>
                  ) : (
                    <div className="bookmarks__row-link bookmarks__row-link--static">
                      {rowBody}
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        </section>

        <footer className="bookmarks__foot">
          <span>Living bibliography</span>
          <span className="bookmarks__foot-dot" aria-hidden>·</span>
          <span className="tabular">Updated 2026</span>
        </footer>
      </article>

      <style>{`
        .bookmarks {
          min-height: 100svh;
          padding: clamp(88px, 12vh, 128px) clamp(24px, 4vw, 72px) clamp(56px, 9vh, 96px);
          display: flex;
          justify-content: center;
          color: var(--ink);
        }

        .bookmarks__inner {
          width: 100%;
          max-width: 820px;
          display: grid;
          gap: clamp(48px, 7vh, 72px);
        }

        .bookmarks__head { display: grid; gap: 18px; }
        .bookmarks__title {
          font-family: var(--font-stack-sans);
          font-weight: 400;
          font-size: clamp(22px, 2.4vw, 30px);
          line-height: 1.35;
          letter-spacing: -0.005em;
          color: var(--ink);
          margin: 6px 0 0;
          max-width: 32ch;
        }

        .bookmarks__section { display: grid; gap: 0; }

        .bookmarks__list {
          list-style: none;
          margin: 0;
          padding: 0;
          border-top: 1px solid var(--ink);
        }
        .bookmarks__row { border-bottom: 1px solid var(--ink-hair); }
        .bookmarks__row-link {
          display: grid;
          grid-template-columns: 64px minmax(180px, 1.3fr) 1fr;
          column-gap: 20px;
          row-gap: 4px;
          padding: 14px 0;
          color: var(--ink);
          transition: background 200ms var(--ease);
          align-items: baseline;
        }
        a.bookmarks__row-link:hover { background: var(--ink-ghost); }
        .bookmarks__row-link--static { cursor: default; }

        .bookmarks__row-year {
          font-family: var(--font-stack-sans);
          font-size: 10px;
          letter-spacing: 0.04em;
          color: var(--ink-4);
        }
        .bookmarks__row-title {
          font-family: var(--font-stack-sans);
          font-size: 13px;
          letter-spacing: 0;
          color: var(--ink);
        }
        .bookmarks__row-attribution {
          font-family: var(--font-stack-sans);
          font-size: 10px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--ink-3);
          text-align: right;
        }
        .bookmarks__row-note {
          grid-column: 2 / -1;
          font-family: var(--font-stack-sans);
          font-size: 11px;
          line-height: 1.7;
          letter-spacing: 0;
          color: var(--ink-2);
          margin-top: 2px;
          max-width: 60ch;
        }

        .bookmarks__foot {
          display: flex;
          align-items: baseline;
          gap: 10px;
          padding-top: 16px;
          border-top: 1px solid var(--ink-hair);
          font-family: var(--font-stack-sans);
          font-size: 9px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--ink-3);
        }
        .bookmarks__foot-dot { color: var(--ink-4); }

        @media (max-width: 640px) {
          .bookmarks__row-link {
            grid-template-columns: 52px 1fr;
            gap: 12px 14px;
          }
          .bookmarks__row-attribution {
            grid-column: 2;
            text-align: left;
          }
        }
      `}</style>
    </main>
  );
}
