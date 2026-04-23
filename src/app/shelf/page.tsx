"use client";

import { SHELF, type ShelfKind } from "@/constants/shelf";
import Folio from "@/components/Folio";

const GROUPS: Array<{ kind: ShelfKind; label: string }> = [
  { kind: "BOOK", label: "Books" },
  { kind: "PORTFOLIO", label: "Portfolios" },
  { kind: "ESSAY", label: "Essays" },
  { kind: "ARCHIVE", label: "Archives" },
];

export default function ShelfPage() {
  return (
    <main id="main" className="shelf">
      <Folio token="§03" />
      <article className="shelf__inner">
        <header className="shelf__head">
          <p className="eyebrow">
            <span>Shelf</span>
            <span className="eyebrow__sep">·</span>
            <span>My digital library</span>
            <span className="eyebrow__sep">·</span>
            <span className="tabular">2026</span>
          </p>
          <h1 className="shelf__title">A list of resources I refer to</h1>
        </header>

        {GROUPS.map((g) => {
          const items = SHELF.filter((s) => s.kind === g.kind);
          if (items.length === 0) return null;

          return (
            <section key={g.kind} className="shelf__group">
              <header className="shelf__group-head">
                <span className="shelf__group-label">{g.label}</span>
                <span className="shelf__group-count tabular">
                  {String(items.length).padStart(2, "0")} Entries
                </span>
              </header>

              <ol className="shelf__list">
                {items.map((item) => {
                  const rowBody = (
                    <>
                      <span className="shelf__row-year tabular">
                        {item.year ?? ""}
                      </span>
                      <span className="shelf__row-title">{item.title}</span>
                      <span className="shelf__row-attribution">
                        {item.attribution ?? ""}
                      </span>
                      {item.note && (
                        <span className="shelf__row-note">{item.note}</span>
                      )}
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
                          {rowBody}
                        </a>
                      ) : (
                        <div className="shelf__row-link shelf__row-link--static">
                          {rowBody}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ol>
            </section>
          );
        })}

        <footer className="shelf__foot">
          <span>Living bibliography</span>
          <span className="shelf__foot-dot" aria-hidden>·</span>
          <span className="tabular">Updated 2026</span>
        </footer>
      </article>

      <style>{`
        .shelf {
          min-height: 100svh;
          padding: clamp(88px, 12vh, 128px) clamp(24px, 4vw, 72px) clamp(56px, 9vh, 96px);
          display: flex;
          justify-content: center;
          color: var(--ink);
        }

        .shelf__inner {
          width: 100%;
          max-width: 820px;
          display: grid;
          gap: clamp(48px, 7vh, 72px);
        }

        /* ── Head ─────────────────────────────────────── */
        .shelf__head { display: grid; gap: 18px; }
        .shelf__title {
          font-family: var(--font-stack-mono);
          font-weight: 400;
          font-size: clamp(22px, 2.4vw, 30px);
          line-height: 1.35;
          letter-spacing: -0.005em;
          color: var(--ink);
          margin: 6px 0 0;
          max-width: 32ch;
        }
        .shelf__lede {
          font-family: var(--font-stack-mono);
          font-size: 12px;
          line-height: 1.75;
          letter-spacing: 0;
          color: var(--ink-2);
          max-width: 54ch;
          margin: 0;
        }

        /* ── Group ────────────────────────────────────── */
        .shelf__group { display: grid; gap: 12px; }
        .shelf__group-head {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          padding-bottom: 10px;
          border-bottom: 1px solid var(--ink);
        }
        .shelf__group-label {
          font-family: var(--font-stack-mono);
          font-size: 10px;
          letter-spacing: 0.26em;
          text-transform: uppercase;
          color: var(--ink);
        }
        .shelf__group-count {
          font-family: var(--font-stack-mono);
          font-size: 9px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--ink-3);
        }

        /* ── List ─────────────────────────────────────── */
        .shelf__list {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .shelf__row { border-bottom: 1px solid var(--ink-hair); }
        .shelf__row-link {
          display: grid;
          grid-template-columns: 64px minmax(180px, 1.3fr) 1fr;
          column-gap: 20px;
          row-gap: 4px;
          padding: 14px 0;
          color: var(--ink);
          transition: background 200ms var(--ease);
          align-items: baseline;
        }
        a.shelf__row-link:hover { background: var(--ink-ghost); }
        .shelf__row-link--static { cursor: default; }

        .shelf__row-year {
          font-family: var(--font-stack-mono);
          font-size: 10px;
          letter-spacing: 0.14em;
          color: var(--ink-4);
        }
        .shelf__row-title {
          font-family: var(--font-stack-mono);
          font-size: 13px;
          letter-spacing: 0;
          color: var(--ink);
        }
        .shelf__row-attribution {
          font-family: var(--font-stack-mono);
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--ink-3);
          text-align: right;
        }
        .shelf__row-note {
          grid-column: 2 / -1;
          font-family: var(--font-stack-mono);
          font-size: 11px;
          line-height: 1.7;
          letter-spacing: 0;
          color: var(--ink-2);
          margin-top: 2px;
          max-width: 60ch;
        }

        /* ── Foot ─────────────────────────────────────── */
        .shelf__foot {
          display: flex;
          align-items: baseline;
          gap: 10px;
          padding-top: 16px;
          border-top: 1px solid var(--ink-hair);
          font-family: var(--font-stack-mono);
          font-size: 9px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--ink-3);
        }
        .shelf__foot-dot { color: var(--ink-4); }

        @media (max-width: 640px) {
          .shelf__row-link {
            grid-template-columns: 52px 1fr;
            gap: 12px 14px;
          }
          .shelf__row-attribution {
            grid-column: 2;
            text-align: left;
          }
        }
      `}</style>
    </main>
  );
}
