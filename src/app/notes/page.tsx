import { NOTES } from "@/constants/notes";

/**
 * /notes — short studio-journal entries, in the home's mono register.
 *
 * Single editorial column. One header, then a stack of dated notes.
 * Each note: ledger row (date + slug code) → title → prose body.
 * Hairline rules between notes; everything composes from the .t-*
 * utility classes. No sans, no italics, no inline-style typography.
 *
 * Voice: lowercase mono prose. First-person but spare. These are
 * thinking-out-loud entries — what the practice is, not a polished
 * argument for it. New entries push to the top; the displayed number
 * runs in descending order so the most recent is the highest §.
 */

export default function NotesPage() {
  return (
    <main id="main" className="notes">
      <header className="notes__head">
        <p className="t-eyebrow">Notes</p>
        <h1 className="t-display notes__title">Studio notes.</h1>
        <p className="t-prose notes__lede">
          short entries from the practice — what i&apos;m thinking about
          while the work is being made. unedited. new entries push to
          the top.
        </p>
      </header>

      <hr className="t-rule" />

      <ol className="notes__list" role="list">
        {NOTES.map((note, i) => (
          <li key={note.slug} className="note-entry">
            <header className="note-entry__head">
              <span className="t-code note-entry__num">
                {String(NOTES.length - i).padStart(2, "0")}
              </span>
              <time className="t-meta note-entry__date" dateTime={note.date}>
                {note.date}
              </time>
            </header>
            <h2 className="t-statement note-entry__title">{note.title}</h2>
            <div className="t-prose note-entry__body">{note.body}</div>
            {i < NOTES.length - 1 && <hr className="t-rule note-entry__rule" />}
          </li>
        ))}
      </ol>

      <style>{`
        .notes {
          padding: clamp(80px, 12vh, 140px) var(--margin-page) clamp(56px, 8vh, 96px);
          max-width: 760px;
          margin-inline: auto;
          display: grid;
          row-gap: clamp(40px, 5vh, 64px);
        }

        .notes__head {
          display: grid;
          row-gap: clamp(14px, 1.6vh, 22px);
          max-width: 56ch;
        }
        .notes__title {
          text-transform: none;
          letter-spacing: -0.03em;
        }
        .notes__lede {
          color: var(--ink-2);
          text-transform: lowercase;
          max-width: 48ch;
        }

        .notes__list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          row-gap: clamp(40px, 5vh, 64px);
        }

        .note-entry {
          display: grid;
          row-gap: clamp(14px, 1.8vh, 22px);
        }
        .note-entry__head {
          display: flex;
          align-items: baseline;
          gap: clamp(16px, 2vw, 28px);
        }
        .note-entry__num {
          color: var(--ink-3);
        }
        .note-entry__date {
          color: var(--ink-3);
          font-variant-numeric: tabular-nums;
        }
        .note-entry__title {
          text-transform: none;
          letter-spacing: -0.01em;
          color: var(--ink);
          max-width: 50ch;
          margin: 0;
        }
        .note-entry__body {
          color: var(--ink-2);
          text-transform: lowercase;
          max-width: 56ch;
          margin: 0;
        }
        .note-entry__body em {
          font-style: normal;
          color: var(--ink);
          background-image: linear-gradient(var(--ink-hair), var(--ink-hair));
          background-size: 100% 1px;
          background-position: 0 100%;
          background-repeat: no-repeat;
          padding-bottom: 1px;
        }
        .note-entry__rule {
          margin-top: clamp(28px, 3vh, 44px);
        }

        @media (max-width: 720px) {
          .notes { row-gap: clamp(28px, 4vh, 48px); }
          .notes__list { row-gap: clamp(32px, 4vh, 48px); }
        }
      `}</style>
    </main>
  );
}
