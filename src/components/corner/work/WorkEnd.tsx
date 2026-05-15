import Link from "next/link";
import type { Piece } from "@/constants/pieces";

/**
 * WorkEnd — bottom-of-page navigation. Two affordances:
 *   ← Back to selects                     Next ↗  [NN] Project Title
 *
 * The "Next" link cycles through the sorted PIECES order. If we're
 * on the last piece, Next loops to the first — every project page
 * ends with a forward path, never a dead end.
 */

interface Props {
  /** The next piece in the sorted order (caller computes this so this
   *  component stays presentational). */
  next: Piece | null;
}

export function WorkEnd({ next }: Props) {
  return (
    <footer className="work-end">
      <Link href="/v/corner" className="t-warmth work-end__back">
        <span aria-hidden>←</span>
        <span>Back to index</span>
      </Link>

      {next && (
        <Link href={`/v/corner/work/${next.slug}`} className="t-warmth work-end__next">
          <span className="work-end__next-label">
            <span className="work-end__next-eyebrow">Next ↗</span>
            <span className="work-end__next-line">
              <span className="work-end__next-num">[{next.number}]</span>
              <span className="work-end__next-title">{next.title}</span>
            </span>
          </span>
        </Link>
      )}

      <style>{`
        .work-end {
          padding-top: clamp(40px, 5vh, 80px);
          border-top: 1px solid var(--ink-hair);
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 24px;
          flex-wrap: wrap;
        }
        .work-end__back {
          display: inline-flex;
          align-items: baseline;
          gap: 10px;
          color: var(--ink-3);
          font-size: 12.5px;
          font-weight: 500;
          letter-spacing: -0.005em;
          transition: color 200ms var(--ease), transform 200ms var(--ease);
        }
        .work-end__back:hover {
          color: var(--ink);
          transform: translateX(-2px);
        }

        .work-end__next {
          display: inline-flex;
          align-items: baseline;
          color: var(--ink);
          transition: transform 240ms var(--ease);
        }
        .work-end__next:hover {
          transform: translateX(4px);
        }
        .work-end__next-label {
          display: grid;
          row-gap: 6px;
          text-align: right;
        }
        .work-end__next-eyebrow {
          color: var(--ink-3);
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }
        .work-end__next-line {
          display: inline-flex;
          align-items: baseline;
          gap: 10px;
          justify-content: flex-end;
        }
        .work-end__next-num {
          color: var(--ink-3);
          font-size: 12.5px;
          font-weight: 400;
          letter-spacing: 0.02em;
        }
        .work-end__next-title {
          color: var(--ink);
          font-size: 16px;
          font-weight: 500;
          letter-spacing: -0.01em;
          text-transform: uppercase;
        }

        @media (prefers-reduced-motion: reduce) {
          .work-end__back,
          .work-end__next {
            transition: color 200ms var(--ease);
          }
        }
      `}</style>
    </footer>
  );
}
