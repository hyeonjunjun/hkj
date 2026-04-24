"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import Folio from "@/components/Folio";
import { NOTES } from "@/constants/notes";

export default function NoteDetailPage() {
  const params = useParams<{ slug: string }>();
  const note = NOTES.find((n) => n.slug === params?.slug);

  if (!note) {
    return (
      <main id="main" className="note-404">
        <p className="eyebrow">
          <span>Notes</span>
          <span className="eyebrow__sep">·</span>
          <span>Not found</span>
        </p>
        <p className="note-404__body">
          No entry at that address.{" "}
          <Link href="/notes" className="note-404__link">
            Back to the index
          </Link>
          .
        </p>
        <style>{`
          .note-404 {
            min-height: 100svh;
            padding: clamp(96px, 14vh, 160px) clamp(24px, 6vw, 72px);
            display: grid;
            gap: 20px;
            place-content: center;
          }
          .note-404__body {
            font-family: var(--font-stack-serif);
            font-weight: 380;
            font-size: 17px;
            line-height: 1.6;
            color: var(--ink-2);
            max-width: 40ch;
          }
          .note-404__link { color: var(--ink); }
        `}</style>
      </main>
    );
  }

  const paragraphs = note.body.split("\n\n");

  return (
    <main id="main" className="note">
      <Folio token={`N-${note.number}`} month={note.month} />

      <div className="note__runhead" aria-hidden>
        <span>N-{note.number}</span>
        <span className="note__runhead-dot">·</span>
        <span>{note.title}</span>
        {note.runheadKeyword && (
          <>
            <span className="note__runhead-dot">·</span>
            {/* ! moment for /notes/[slug] — one keyword from the essay */}
            <span className="note__runhead-kw">{note.runheadKeyword}</span>
          </>
        )}
      </div>

      <article className="note__inner">
        <header className="note__head">
          <p className="eyebrow">
            <span>Note</span>
            <span className="eyebrow__sep">·</span>
            <span className="tabular">N-{note.number}</span>
            <span className="eyebrow__sep">·</span>
            <span className="tabular">{note.dateLabel}</span>
          </p>
          <h1 className="note__title">{note.title}</h1>
        </header>

        <section className="note__body">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </section>

        <footer className="note__foot">
          <Link href="/notes" className="note__back">
            <span className="arrow-glyph" aria-hidden>←</span>
            <span>All notes</span>
          </Link>
        </footer>
      </article>

      <style>{`
        .note {
          min-height: 100svh;
          padding: clamp(88px, 12vh, 128px) clamp(24px, 4vw, 72px) clamp(56px, 9vh, 96px);
          display: flex;
          justify-content: center;
          color: var(--ink);
        }
        .note__inner {
          width: 100%;
          max-width: 640px;
          display: grid;
          gap: clamp(40px, 6vh, 64px);
        }

        .note__runhead {
          position: sticky;
          top: 56px;
          z-index: 45;
          display: flex;
          gap: 10px;
          padding: 8px 0;
          font-family: var(--font-stack-mono);
          font-size: 9px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--ink-3);
          background: linear-gradient(to bottom, var(--paper) 60%, transparent 100%);
          align-self: center;
          max-width: 640px;
          width: 100%;
          padding-inline: clamp(24px, 4vw, 72px);
          margin-left: calc(50% - 50vw);
          box-sizing: border-box;
          pointer-events: none;
        }
        .note__runhead-dot { color: var(--ink-4); }
        .note__runhead-kw { color: var(--ink); }

        .note__head { display: grid; gap: 18px; }
        .note__title {
          font-family: var(--font-stack-serif);
          font-weight: 400;
          font-size: clamp(24px, 2.6vw, 32px);
          line-height: 1.3;
          letter-spacing: -0.005em;
          color: var(--ink);
          margin: 6px 0 0;
          max-width: 32ch;
          font-feature-settings: "onum" on;
        }

        .note__body {
          display: grid;
          gap: 1.4em;
          font-family: var(--font-stack-serif);
          font-size: 17px;
          line-height: 1.75;
          color: var(--ink-2);
          font-feature-settings: "onum" on;
          hanging-punctuation: first last;
          text-wrap: pretty;
        }
        .note__body p { margin: 0; max-width: 56ch; }

        .note__foot {
          padding-top: 24px;
          border-top: 1px solid var(--ink-hair);
        }
        .note__back {
          display: inline-flex;
          align-items: baseline;
          gap: 10px;
          font-family: var(--font-stack-mono);
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--ink-3);
        }
        .note__back:hover > .arrow-glyph,
        .note__back:focus-visible > .arrow-glyph {
          transform: translateX(-6px);
        }
      `}</style>
    </main>
  );
}
