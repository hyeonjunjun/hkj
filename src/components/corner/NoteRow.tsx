import Link from "next/link";
import type { CornerNote } from "@/constants/corner-notes";

/**
 * NoteRow — a single feed row. The fundamental unit of the corner.
 *
 * Layout (single line, mono):
 *   N003  2026-05-14  log     the corner exists.            ↗
 *
 * The whole row is the click target. The arrow rotates on hover; the
 * title shifts 2px right. View-transition-name is set on the title
 * span so the title block can carry into the detail page header.
 *
 * Number formatting: N-prefix + 3 digits (N001, N002, …). No § glyph
 * anywhere per project convention.
 */

interface Props {
  note: CornerNote;
  /** Whether to expose the view-transition-name for the title.
      Only the most-recent (or first-render) row should carry it, so
      browsers don't warn about duplicate names. */
  vtAnchor?: boolean;
}

export function NoteRow({ note, vtAnchor }: Props) {
  const number = `N${String(note.number).padStart(3, "0")}`;
  return (
    <li className="corner-row">
      <Link href={`/v/corner/${note.slug}`} className="corner-row__link">
        <span className="corner-row__num t-code tabular">{number}</span>
        <time className="corner-row__date t-meta tabular" dateTime={note.date}>
          {note.date}
        </time>
        <span className="corner-row__cat t-meta">{note.category}</span>
        <span
          className="corner-row__title t-row"
          style={vtAnchor ? { viewTransitionName: `corner-note-${note.slug}` } : undefined}
        >
          {note.title}
        </span>
        <span className="corner-row__arrow" aria-hidden>↗</span>
      </Link>
      <style>{`
        .corner-row {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .corner-row__link {
          display: grid;
          grid-template-columns: auto auto auto 1fr auto;
          column-gap: clamp(12px, 1.6vw, 24px);
          align-items: baseline;
          padding: 10px 0;
          color: inherit;
          text-decoration: none;
          border-bottom: 1px solid var(--ink-ghost);
          transition: border-color 220ms var(--ease);
        }
        .corner-row__link:hover {
          border-bottom-color: var(--ink-hair);
        }
        .corner-row__num {
          color: var(--ink-4);
        }
        .corner-row__date {
          color: var(--ink-3);
        }
        .corner-row__cat {
          color: var(--ink-3);
          text-transform: lowercase;
          font-family: var(--font-stack-mono);
          letter-spacing: var(--track-snug);
        }
        .corner-row__title {
          color: var(--ink);
          text-transform: none;
          transition: transform 220ms var(--ease);
          will-change: transform;
        }
        .corner-row__link:hover .corner-row__title {
          transform: translateX(2px);
        }
        .corner-row__arrow {
          color: var(--ink-3);
          display: inline-block;
          transition: transform 220ms var(--ease), color 220ms var(--ease);
          will-change: transform;
        }
        .corner-row__link:hover .corner-row__arrow {
          transform: rotate(8deg) translate(1px, -1px);
          color: var(--ink);
        }
        @media (max-width: 720px) {
          .corner-row__link {
            grid-template-columns: auto auto 1fr auto;
            column-gap: 12px;
          }
          .corner-row__date { display: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .corner-row__title,
          .corner-row__arrow,
          .corner-row__link {
            transition: none;
          }
        }
      `}</style>
    </li>
  );
}
