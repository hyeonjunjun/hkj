import type { Metadata } from "next";
import Footer from "@/components/Footer";
import { SHELF, type ShelfGroup, type ShelfItem } from "@/constants/shelf";

export const metadata: Metadata = {
  title: "Bookmarks",
  description: "A working bibliography — references actively consulted.",
};

const GROUP_ORDER: ShelfGroup[] = ["READ", "WATCH", "KEEP", "VISIT"];

const GROUP_LABEL: Record<ShelfGroup, string> = {
  READ: "Read",
  WATCH: "Watch",
  KEEP: "Keep",
  VISIT: "Visit",
};

/**
 * /bookmarks — list page sourced from SHELF (spec §08, §03 in folio).
 *
 * Numbered rows grouped by ShelfGroup. Each row has index, title,
 * attribution/year, and a small kind tag. Linked rows reveal an
 * arrow on hover; non-linked rows render as plain rows.
 */
type IndexedItem = ShelfItem & { indexLabel: string };

export default function BookmarksPage() {
  // Continuous numbering across groups, computed once before render
  // via reduce to avoid mutable counters (lint: react-hooks/immutability).
  const groups = GROUP_ORDER.reduce<
    { acc: { group: ShelfGroup; items: IndexedItem[] }[]; offset: number }
  >(
    ({ acc, offset }, group) => {
      const raw = SHELF.filter((s) => s.group === group);
      const items: IndexedItem[] = raw.map((it, i) => ({
        ...it,
        indexLabel: String(offset + i + 1).padStart(2, "0"),
      }));
      if (items.length === 0) return { acc, offset };
      return {
        acc: [...acc, { group, items }],
        offset: offset + items.length,
      };
    },
    { acc: [], offset: 0 },
  ).acc;

  return (
    <main id="main" className="bookmarks">
      <div className="bookmarks__void" aria-hidden />

      <article className="bookmarks__inner">
        <header className="bookmarks__head">
          <p className="bookmarks__eyebrow">
            <span>Bookmarks</span>
            <span className="bookmarks__eyebrow-sep" aria-hidden>
              ·
            </span>
            <span className="tabular">§03</span>
          </p>
          <h1 className="bookmarks__title">Bookmarks</h1>
          <p className="bookmarks__lede">
            A working bibliography — books, portfolios, essays, and
            archives I return to when the work needs weight.
          </p>
        </header>

        {groups.map(({ group, items }) => (
          <section key={group} className="bookmarks__section" aria-label={GROUP_LABEL[group]}>
            <header className="bookmarks__section-head">
              <span className="bookmarks__section-label">
                {GROUP_LABEL[group]}
              </span>
              <span className="bookmarks__section-count tabular">
                {String(items.length).padStart(2, "0")} Entries
              </span>
            </header>
            <ol className="bookmarks__list">
              {items.map((item) => {
                const meta = [item.attribution, item.year]
                  .filter(Boolean)
                  .join(" · ");

                const inner = (
                  <>
                    <span className="bookmarks__row-num tabular">
                      {item.indexLabel}
                    </span>
                    <span className="bookmarks__row-title">{item.title}</span>
                    <span className="bookmarks__row-meta">{meta}</span>
                    <span className="bookmarks__row-kind">{item.kind}</span>
                    {item.href ? (
                      <span className="bookmarks__row-arrow" aria-hidden>
                        →
                      </span>
                    ) : (
                      <span className="bookmarks__row-arrow" aria-hidden />
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
                        {inner}
                      </a>
                    ) : (
                      <div className="bookmarks__row-link bookmarks__row-link--static">
                        {inner}
                      </div>
                    )}
                  </li>
                );
              })}
            </ol>
          </section>
        ))}
      </article>

      <Footer />

      <style>{`
        .bookmarks {
          padding: 0 var(--margin-page);
          max-width: 1280px;
          margin-inline: auto;
          color: var(--ink);
        }
        .bookmarks__void { height: var(--space-void); }
        .bookmarks__inner {
          display: grid;
          gap: var(--space-section);
        }

        /* ─── Head ─────────────────────────────────────────────────── */
        .bookmarks__head { display: grid; gap: 18px; max-width: 720px; }
        .bookmarks__eyebrow {
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
        .bookmarks__eyebrow-sep { color: var(--ink-4); }
        .bookmarks__title {
          font-family: var(--font-stack-sans);
          font-weight: 380;
          font-size: var(--type-display);
          line-height: 1.05;
          letter-spacing: var(--track-display);
          color: var(--ink);
          margin: 0;
        }
        .bookmarks__lede {
          font-family: var(--font-stack-sans);
          font-size: var(--type-body);
          line-height: 1.55;
          color: var(--ink-2);
          max-width: 56ch;
          margin: 0;
        }

        /* ─── Sections ─────────────────────────────────────────────── */
        .bookmarks__section { display: grid; gap: 12px; }
        .bookmarks__section-head {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          padding-bottom: 10px;
          border-bottom: 1px solid var(--ink);
        }
        .bookmarks__section-label {
          font-family: var(--font-stack-sans);
          font-size: var(--type-nav);
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--ink);
        }
        .bookmarks__section-count {
          font-family: var(--font-stack-mono);
          font-size: var(--type-meta);
          letter-spacing: var(--track-caps-mono);
          text-transform: uppercase;
          color: var(--ink-3);
          font-variant-numeric: tabular-nums;
        }

        /* ─── List ─────────────────────────────────────────────────── */
        .bookmarks__list { list-style: none; margin: 0; padding: 0; }
        .bookmarks__row { border-bottom: 1px solid var(--ink-hair); }
        .bookmarks__row-link {
          display: grid;
          grid-template-columns: 56px minmax(180px, 2fr) minmax(160px, 1.6fr) 96px 22px;
          gap: 20px;
          align-items: baseline;
          padding: 14px 8px;
          margin: 0 -8px;
          color: var(--ink);
          transition: background 380ms var(--ease);
        }
        .bookmarks__row-link:hover {
          background: var(--ink-ghost);
        }
        .bookmarks__row-link--static { cursor: default; }

        .bookmarks__row-num {
          font-family: var(--font-stack-mono);
          font-size: var(--type-number);
          letter-spacing: var(--track-caps-mono);
          text-transform: uppercase;
          color: var(--ink-3);
          font-variant-numeric: tabular-nums;
        }
        .bookmarks__row-title {
          font-family: var(--font-stack-sans);
          font-size: var(--type-title);
          color: var(--ink);
          line-height: 1.35;
        }
        .bookmarks__row-meta {
          font-family: var(--font-stack-sans);
          font-size: var(--type-meta);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--ink-3);
          font-variant-numeric: tabular-nums;
          line-height: 1.4;
        }
        .bookmarks__row-kind {
          font-family: var(--font-stack-mono);
          font-size: var(--type-meta);
          letter-spacing: var(--track-caps-mono);
          text-transform: uppercase;
          color: var(--ink-4);
          font-variant-numeric: tabular-nums;
          text-align: right;
        }
        .bookmarks__row-arrow {
          font-family: var(--font-stack-sans);
          font-size: 12px;
          color: var(--ink-3);
          text-align: right;
          opacity: 0;
          transform: translateX(0);
          transition: opacity 200ms var(--ease), transform 200ms cubic-bezier(0.33, 0.12, 0.15, 1);
        }
        a.bookmarks__row-link:hover .bookmarks__row-arrow {
          opacity: 1;
          transform: translateX(6px);
        }

        /* ─── Mobile ──────────────────────────────────────────────── */
        @media (max-width: 760px) {
          .bookmarks__row-link {
            grid-template-columns: 40px 1fr;
            row-gap: 4px;
            column-gap: 12px;
          }
          .bookmarks__row-meta {
            grid-column: 2;
          }
          .bookmarks__row-kind {
            grid-column: 2;
            text-align: left;
          }
          .bookmarks__row-arrow { display: none; }
        }

        @media (prefers-reduced-motion: reduce) {
          .bookmarks__row-link,
          .bookmarks__row-arrow { transition: none; }
        }
      `}</style>
    </main>
  );
}
