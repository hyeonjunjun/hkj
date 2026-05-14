import { CORNER_NOTES } from "@/constants/corner-notes";
import { NoteRow } from "./NoteRow";

/**
 * NotesFeed — the corner's main column. Reverse-chronological list of
 * notes with asterisk dividers between month groups (Craig Mod move).
 *
 * The feed is a server component; data is read at build time from the
 * constants file. The list itself is semantic <ol> for screen readers
 * and document-outline purposes.
 *
 * Stagger-fade entrance is applied via CSS animation-delay computed
 * per row. The animation runs once per page load; no scroll handler.
 */

const MONTH_FORMATTER = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  timeZone: "America/New_York",
});

function monthKey(date: string): string {
  return MONTH_FORMATTER.format(new Date(date + "T12:00:00Z"));
}

export function NotesFeed() {
  // Notes are pre-sorted in the constants file (newest first). Group
  // by month to insert dividers when the month changes.
  const sorted = [...CORNER_NOTES].sort((a, b) =>
    b.date.localeCompare(a.date) || b.number - a.number,
  );

  let lastMonth: string | null = null;
  const rows: React.ReactNode[] = [];
  sorted.forEach((note, i) => {
    const mk = monthKey(note.date);
    if (mk !== lastMonth) {
      if (lastMonth !== null) {
        rows.push(
          <li key={`div-${mk}`} className="corner-feed__divider" aria-hidden>
            <span>* * *</span>
          </li>,
        );
      }
      rows.push(
        <li key={`label-${mk}`} className="corner-feed__month" aria-label={mk}>
          <span className="t-section">{mk}</span>
        </li>,
      );
      lastMonth = mk;
    }
    rows.push(
      <div
        key={note.slug}
        className="corner-feed__row-anim"
        style={{ animationDelay: `${i * 36}ms` }}
      >
        <NoteRow note={note} vtAnchor={i === 0} />
      </div>,
    );
  });

  return (
    <section className="corner-feed" aria-label="Notes feed">
      <header className="corner-feed__head">
        <span className="t-section">Notes</span>
        <span className="t-meta dim">·</span>
        <span className="t-meta tabular dim">
          {String(sorted.length).padStart(3, "0")} entries
        </span>
      </header>
      <ol className="corner-feed__list" role="list">
        {rows}
      </ol>

      <style>{`
        .corner-feed {
          display: grid;
          row-gap: clamp(20px, 2.4vh, 32px);
        }
        .corner-feed__head {
          display: inline-flex;
          align-items: baseline;
          gap: 10px;
        }
        .corner-feed__list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: grid;
          row-gap: 0;
        }
        .corner-feed__month {
          list-style: none;
          padding: clamp(16px, 2vh, 24px) 0 6px;
          color: var(--ink-3);
        }
        .corner-feed__divider {
          list-style: none;
          text-align: center;
          padding: clamp(20px, 3vh, 36px) 0;
          color: var(--ink-4);
          letter-spacing: 0.4em;
          font-family: var(--font-stack-chrome);
          font-size: 10px;
        }
        .corner-feed__divider > span {
          opacity: 0.7;
        }
        .corner-feed__row-anim {
          animation: corner-row-in 420ms var(--ease) both;
        }
        @keyframes corner-row-in {
          0%   { opacity: 0; transform: translateY(4px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .corner-feed__row-anim {
            animation: none;
            opacity: 1;
            transform: none;
          }
        }
      `}</style>
    </section>
  );
}
