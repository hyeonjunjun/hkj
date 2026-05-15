"use client";

import Link from "next/link";
import { PIECES, type Piece } from "@/constants/pieces";

/**
 * IndexLedger — text-only multi-column ledger of all projects.
 *
 * The companion to SelectsGrid. Same data, no media:
 *
 *   [01]  LA28                          [02]  AI HARDWARE BRAND
 *         BRAND · CAMPAIGN · PERSONAL         BRAND · PRODUCT · IDENTITY
 *
 *   [03]  SPATIAL AUDIO BRAND           [04]  ALBUM COVER SYSTEM
 *         BRAND · SOUND · WEB AUDIO           CREATIVE CODE · MUSIC · TOOL
 *
 * Reference: ethan&tom's Index view — high-density typographic listing
 * that lets the body of work read at a glance. Each entry routes to
 * /work/[slug].
 *
 * Five columns × N rows on desktop, collapsing to three / two / one
 * on smaller viewports.
 */

const SORTED: Piece[] = [...PIECES].sort((a, b) => a.order - b.order);

export function IndexLedger() {
  return (
    <section className="index-ledger" aria-label="Index — text ledger">
      <div className="index-ledger__grid">
        {SORTED.map((piece, i) => (
          <LedgerRow key={piece.slug} piece={piece} index={i} />
        ))}
      </div>

      <style>{`
        .index-ledger {
          width: 100%;
          padding: 0 var(--margin-page);
        }
        .index-ledger__grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          column-gap: clamp(20px, 2vw, 32px);
          row-gap: clamp(20px, 2.5vh, 32px);
        }
        @media (max-width: 1200px) {
          .index-ledger__grid { grid-template-columns: repeat(4, 1fr); }
        }
        @media (max-width: 960px) {
          .index-ledger__grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 640px) {
          .index-ledger__grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 420px) {
          .index-ledger__grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  );
}

interface RowProps {
  piece: Piece;
  index: number;
}

function LedgerRow({ piece, index }: RowProps) {
  const number = `[${piece.number}]`;
  return (
    <Link
      href={`/v/corner/work/${piece.slug}`}
      className="ledger-row"
      style={{ animationDelay: `${120 + index * 30}ms` }}
    >
      <span className="ledger-row__num t-warmth">{number}</span>
      <span className="ledger-row__lines">
        <span
          className="ledger-row__title t-warmth"
          style={{ viewTransitionName: `corner-project-${piece.slug}` }}
        >
          {piece.title.toUpperCase()}
        </span>
        <span className="ledger-row__sector t-warmth">{piece.sector.toUpperCase()}</span>
      </span>
      <style>{`
        .ledger-row {
          display: grid;
          grid-template-columns: auto 1fr;
          column-gap: 14px;
          align-items: baseline;
          color: inherit;
          padding: 4px 0;
          opacity: 0;
          animation: ledger-in 540ms var(--ease) both;
          transition: transform 220ms var(--ease);
        }
        @keyframes ledger-in {
          0%   { opacity: 0; transform: translateY(3px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .ledger-row:hover {
          transform: translateX(2px);
        }
        .ledger-row__num {
          color: var(--ink-3);
          font-size: 11px;
          font-weight: 400;
          letter-spacing: 0.02em;
          line-height: 1.2;
        }
        .ledger-row__lines {
          display: grid;
          row-gap: 3px;
        }
        .ledger-row__title {
          color: var(--ink);
          font-size: 13px;
          font-weight: 500;
          letter-spacing: -0.005em;
          line-height: 1.2;
          transition: color 200ms var(--ease);
        }
        .ledger-row:hover .ledger-row__title {
          color: var(--ink);
        }
        .ledger-row__sector {
          color: var(--ink-3);
          font-size: 10.5px;
          font-weight: 400;
          letter-spacing: 0.06em;
          line-height: 1.25;
        }
        @media (prefers-reduced-motion: reduce) {
          .ledger-row { animation: none; opacity: 1; transform: none; }
          .ledger-row:hover { transform: none; }
        }
      `}</style>
    </Link>
  );
}
