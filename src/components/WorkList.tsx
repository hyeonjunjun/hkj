"use client";

import Link from "next/link";
import { type Piece } from "@/constants/pieces";

type Props = {
  pieces: Piece[];
};

/**
 * WorkList — typeset row index of the catalog. No images. One <a>
 * per piece with full keyboard support. Tabular `tnum` numerals for
 * the number column. Per spec §7 (Anatomy).
 */
export default function WorkList({ pieces }: Props) {
  return (
    <ol className="worklist" aria-label="Studio catalog index">
      {pieces.map((piece) => (
        <li key={piece.slug} className="worklist__row">
          {piece.placeholder ? (
            <span className="worklist__link worklist__link--placeholder">
              <span className="worklist__num tabular">{piece.number}</span>
              <span className="worklist__title">{piece.title}</span>
              <span className="worklist__year tabular">{piece.year}</span>
              <span className="worklist__role">{piece.sector}</span>
              <span className="worklist__desc">{piece.description}</span>
            </span>
          ) : (
            <Link href={`/work/${piece.slug}`} className="worklist__link">
              <span className="worklist__num tabular">{piece.number}</span>
              <span className="worklist__title">{piece.title}</span>
              <span className="worklist__year tabular">{piece.year}</span>
              <span className="worklist__role">{piece.sector}</span>
              <span className="worklist__desc">{piece.description}</span>
              <span className="worklist__arrow" aria-hidden>→</span>
            </Link>
          )}
        </li>
      ))}

      <style>{`
        .worklist {
          list-style: none;
          padding: 0;
          margin: 0;
          width: 100%;
          max-width: 920px;
          margin-inline: auto;
          display: grid;
          gap: 0;
        }
        .worklist__row {
          border-top: 1px solid var(--ink-hair);
        }
        .worklist__row:last-child {
          border-bottom: 1px solid var(--ink-hair);
        }
        .worklist__link {
          display: grid;
          grid-template-columns: 56px minmax(120px, 0.9fr) 56px 1fr 1.6fr 24px;
          gap: clamp(12px, 2vw, 24px);
          align-items: baseline;
          padding-block: 0.95rem;
          padding-inline: clamp(8px, 1.2vw, 16px);
          color: var(--ink);
          transition: background 200ms var(--ease);
        }
        .worklist__link:hover {
          background: var(--ink-hair);
        }
        .worklist__link--placeholder {
          cursor: default;
          color: var(--ink-3);
        }
        .worklist__link--placeholder:hover {
          background: transparent;
        }
        .worklist__num {
          font-family: var(--font-stack-sans);
          font-size: 11px;
          letter-spacing: 0.02em;
          color: var(--ink-3);
        }
        .worklist__title {
          font-family: var(--font-stack-sans);
          font-size: 18px;
          font-weight: 400;
          letter-spacing: -0.012em;
          color: var(--ink);
        }
        .worklist__year {
          font-family: var(--font-stack-sans);
          font-size: 11px;
          letter-spacing: var(--microtype-tracking);
          text-transform: uppercase;
          color: var(--ink-3);
        }
        .worklist__role {
          font-family: var(--font-stack-sans);
          font-size: 11px;
          letter-spacing: var(--microtype-tracking);
          text-transform: uppercase;
          color: var(--ink-3);
        }
        .worklist__desc {
          font-family: var(--font-stack-sans);
          font-size: 14px;
          line-height: 1.6;
          color: var(--ink-2);
        }
        .worklist__arrow {
          font-family: var(--font-stack-sans);
          font-size: 13px;
          color: var(--ink-3);
          opacity: 0;
          transition: opacity 200ms var(--ease);
          justify-self: end;
        }
        .worklist__link:hover .worklist__arrow,
        .worklist__link:focus-visible .worklist__arrow {
          opacity: 1;
        }

        @media (max-width: 720px) {
          .worklist__link {
            grid-template-columns: 40px 1fr auto;
            grid-template-areas:
              "num title year"
              "num role role"
              "num desc desc";
            row-gap: 4px;
          }
          .worklist__num { grid-area: num; }
          .worklist__title { grid-area: title; }
          .worklist__year { grid-area: year; justify-self: end; }
          .worklist__role { grid-area: role; }
          .worklist__desc { grid-area: desc; }
          .worklist__arrow { display: none; }
        }

        @media (prefers-reduced-motion: reduce) {
          .worklist__link,
          .worklist__arrow { transition: none; }
        }
      `}</style>
    </ol>
  );
}
