"use client";

import Link from "next/link";
import Folio from "@/components/Folio";
import { NOTES } from "@/constants/notes";

function groupByMonth(notes: typeof NOTES) {
  const groups: Record<string, typeof NOTES> = {};
  for (const n of notes) {
    const key = n.date.slice(0, 7);
    (groups[key] ??= []).push(n);
  }
  return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]));
}

function formatMonthHeader(ym: string) {
  const [y, m] = ym.split("-");
  const date = new Date(Number(y), Number(m) - 1, 1);
  return date.toLocaleString("en-US", { month: "long", year: "numeric" });
}

export default function NotesIndexPage() {
  const sorted = [...NOTES].sort((a, b) => b.date.localeCompare(a.date));
  const grouped = groupByMonth(sorted);

  return (
    <main id="main" className="notes">
      <Folio token="§05" />

      <article className="notes__inner" data-cascade>
        <header className="notes__head">
          <p className="eyebrow">
            <span>Notes</span>
            <span className="eyebrow__sep">·</span>
            <span>Working out loud</span>
            <span className="eyebrow__sep">·</span>
            <span className="tabular">2026</span>
          </p>
          <h1 className="notes__title">Short entries, dated.</h1>
        </header>

        {grouped.map(([ym, items]) => (
          <section key={ym} className="notes__group">
            <header className="notes__group-head">
              <span className="notes__group-label">{formatMonthHeader(ym)}</span>
              <span className="notes__group-count tabular">
                {String(items.length).padStart(2, "0")} Entries
              </span>
            </header>

            <ol className="notes__list">
              {items.map((n) => (
                <li key={n.slug} className="notes__row">
                  <Link href={`/notes/${n.slug}`} className="notes__row-link">
                    <span className="notes__row-num tabular">N-{n.number}</span>
                    <span className="notes__row-date tabular">{n.dateLabel}</span>
                    <span className="notes__row-title">{n.title}</span>
                    <span className="notes__row-arrow arrow-glyph" aria-hidden>→</span>
                  </Link>
                </li>
              ))}
            </ol>
          </section>
        ))}

        <footer className="notes__foot">
          <span>Numbered from N-001.</span>
          <span className="notes__foot-dot" aria-hidden>·</span>
          <span className="tabular">Visible gaps are draft issues.</span>
        </footer>
      </article>

      <style>{`
        .notes {
          min-height: 100svh;
          padding: clamp(88px, 12vh, 128px) clamp(24px, 4vw, 72px) clamp(56px, 9vh, 96px);
          display: flex;
          justify-content: center;
          color: var(--ink);
        }
        .notes__inner {
          width: 100%;
          max-width: 820px;
          display: grid;
          gap: clamp(48px, 7vh, 72px);
        }

        .notes__head { display: grid; gap: 18px; }
        .notes__title {
          font-family: var(--font-stack-mono);
          font-weight: 400;
          font-size: clamp(22px, 2.4vw, 30px);
          line-height: 1.35;
          letter-spacing: -0.005em;
          color: var(--ink);
          margin: 6px 0 0;
          max-width: 32ch;
        }

        .notes__group { display: grid; gap: 12px; }
        .notes__group-head {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          padding-bottom: 10px;
          border-bottom: 1px solid var(--ink);
        }
        .notes__group-label {
          font-family: var(--font-stack-mono);
          font-size: 10px;
          letter-spacing: 0.26em;
          text-transform: uppercase;
          color: var(--ink);
        }
        .notes__group-count {
          font-family: var(--font-stack-mono);
          font-size: 9px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--ink-3);
        }

        .notes__list { list-style: none; margin: 0; padding: 0; }
        .notes__row { border-bottom: 1px solid var(--ink-hair); }
        .notes__row-link {
          display: grid;
          grid-template-columns: 64px 110px 1fr 22px;
          gap: 20px;
          align-items: baseline;
          padding: 14px 0;
          color: var(--ink);
          transition: background 200ms var(--ease);
        }
        .notes__row-link:hover { background: var(--ink-ghost); }
        .notes__row-num {
          font-family: var(--font-stack-mono);
          font-size: 9px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--ink-4);
        }
        .notes__row-date {
          font-family: var(--font-stack-mono);
          font-size: 10px;
          letter-spacing: 0.14em;
          color: var(--ink-3);
        }
        .notes__row-title {
          font-family: var(--font-stack-mono);
          font-size: 13px;
          letter-spacing: 0;
          color: var(--ink);
        }
        .notes__row-arrow {
          font-family: var(--font-stack-mono);
          font-size: 12px;
          color: var(--ink-3);
          text-align: right;
        }

        .notes__foot {
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
        .notes__foot-dot { color: var(--ink-4); }

        @media (max-width: 640px) {
          .notes__row-link {
            grid-template-columns: 56px 1fr 18px;
            gap: 12px 14px;
          }
          .notes__row-date { display: none; }
        }
      `}</style>
    </main>
  );
}
