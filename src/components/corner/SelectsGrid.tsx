"use client";

import Link from "next/link";
import Image from "next/image";
import { PIECES, type Piece } from "@/constants/pieces";

/**
 * SelectsGrid — ethan&tom-style project grid.
 *
 * Replaces the horizontal slider as the default view of /v/corner.
 * Layout: 4-column responsive grid, each tile is a fixed-aspect media
 * block with a numbered editorial caption ABOVE it:
 *
 *   [01] LA28
 *        BRAND · CAMPAIGN · PERSONAL
 *   ┌────────────────────────────┐
 *   │                            │
 *   │       [media: video        │
 *   │        or image, or        │
 *   │        typographic         │
 *   │        placeholder]        │
 *   │                            │
 *   └────────────────────────────┘
 *
 * Each tile is a Link to /work/[slug]. Hover state: media lightens
 * slightly + scales 1.02×, caption shifts 2px right. Stagger-fade-in
 * on first paint, ~50ms per tile.
 *
 * Visible status (WIP / CONCEPT) renders as a small tag in the bottom-
 * right corner of the media — non-intrusive but informative.
 */

const SORTED: Piece[] = [...PIECES].sort((a, b) => a.order - b.order);

export function SelectsGrid() {
  return (
    <section className="selects-grid" aria-label="Selects — visual project index">
      <div className="selects-grid__inner">
        {SORTED.map((piece, i) => (
          <SelectTile key={piece.slug} piece={piece} index={i} />
        ))}
      </div>

      <style>{`
        .selects-grid {
          width: 100%;
        }
        .selects-grid__inner {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          column-gap: clamp(16px, 2vw, 28px);
          row-gap: clamp(36px, 5vh, 64px);
          padding: 0 var(--margin-page);
        }
        @media (max-width: 1080px) {
          .selects-grid__inner {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        @media (max-width: 720px) {
          .selects-grid__inner {
            grid-template-columns: repeat(2, 1fr);
            column-gap: 14px;
            row-gap: 32px;
          }
        }
        @media (max-width: 480px) {
          .selects-grid__inner {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}

interface TileProps {
  piece: Piece;
  index: number;
}

function SelectTile({ piece, index }: TileProps) {
  const number = `[${piece.number}]`;
  const isWip = piece.status === "wip";
  const isConcept = piece.status === "concept";

  return (
    <article
      className="select-tile"
      style={{ animationDelay: `${200 + index * 50}ms` }}
      data-status={piece.status}
    >
      <Link href={`/work/${piece.slug}`} className="select-tile__link">
        <header className="select-tile__caption">
          <span className="t-warmth select-tile__number">{number}</span>
          <span className="select-tile__lines">
            <span className="t-warmth select-tile__title">{piece.title}</span>
            <span className="t-warmth select-tile__sector">
              {piece.sector.toUpperCase()}
            </span>
          </span>
        </header>

        <div className="select-tile__media">
          {piece.cover?.kind === "video" ? (
            <video
              className="select-tile__video"
              src={piece.cover.src}
              poster={piece.cover.poster}
              autoPlay
              muted
              loop
              playsInline
              aria-hidden
            />
          ) : piece.cover?.kind === "image" ? (
            <Image
              src={piece.cover.src}
              alt={piece.title}
              fill
              sizes="(max-width: 480px) 100vw, (max-width: 720px) 50vw, (max-width: 1080px) 33vw, 25vw"
              className="select-tile__image"
              style={{ objectFit: "cover" }}
            />
          ) : (
            <div className="select-tile__placeholder" aria-hidden>
              <span className="t-warmth select-tile__placeholder-title">{piece.title}</span>
              <span className="t-warmth select-tile__placeholder-sector">{piece.sector}</span>
            </div>
          )}

          {(isWip || isConcept) && (
            <span className={`select-tile__tag${isWip ? " is-live" : ""}`}>
              <span className="t-warmth">{isWip ? "LIVE" : "CONCEPT"}</span>
            </span>
          )}
        </div>
      </Link>

      <style>{`
        .select-tile {
          opacity: 0;
          animation: select-tile-in 720ms var(--ease) both;
        }
        @keyframes select-tile-in {
          0%   { opacity: 0; transform: translateY(8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .select-tile__link {
          display: grid;
          row-gap: 10px;
          color: inherit;
        }
        .select-tile__caption {
          display: grid;
          grid-template-columns: auto 1fr;
          column-gap: 14px;
          align-items: baseline;
          padding-bottom: 2px;
          transition: transform 240ms var(--ease);
        }
        .select-tile__link:hover .select-tile__caption {
          transform: translateX(2px);
        }
        .select-tile__number {
          color: var(--ink-3);
          font-size: 11px;
          letter-spacing: 0.02em;
          font-weight: 400;
        }
        .select-tile__lines {
          display: grid;
          row-gap: 4px;
        }
        .select-tile__title {
          color: var(--ink);
          font-size: 13px;
          font-weight: 500;
          letter-spacing: -0.005em;
          text-transform: uppercase;
          line-height: 1.15;
        }
        .select-tile__sector {
          color: var(--ink-3);
          font-size: 10.5px;
          font-weight: 400;
          letter-spacing: 0.06em;
          line-height: 1.15;
        }

        .select-tile__media {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          overflow: hidden;
          background: var(--paper-2);
          border: 1px solid var(--ink-ghost);
          transition: border-color 320ms var(--ease);
        }
        .select-tile__link:hover .select-tile__media {
          border-color: var(--ink-hair);
        }
        .select-tile__video,
        .select-tile__image {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 720ms var(--ease), filter 720ms var(--ease);
          will-change: transform;
        }
        .select-tile__link:hover .select-tile__video,
        .select-tile__link:hover .select-tile__image {
          transform: scale(1.04);
          filter: brightness(1.06);
        }

        .select-tile__placeholder {
          position: absolute;
          inset: 0;
          display: grid;
          place-content: center;
          gap: 8px;
          text-align: center;
          padding: 20px;
          background:
            repeating-linear-gradient(
              -45deg,
              transparent 0,
              transparent 12px,
              rgba(255,255,255,0.035) 12px,
              rgba(255,255,255,0.035) 13px
            ),
            var(--paper-2);
        }
        .select-tile__placeholder-title {
          color: var(--ink-2);
          font-size: 18px;
          font-weight: 500;
          letter-spacing: -0.01em;
          line-height: 1.1;
          text-transform: uppercase;
        }
        .select-tile__placeholder-sector {
          color: var(--ink-4);
          font-size: 9px;
          font-weight: 400;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .select-tile__tag {
          position: absolute;
          bottom: 10px;
          right: 10px;
          padding: 3px 7px;
          background: rgba(0, 0, 0, 0.55);
          backdrop-filter: blur(6px);
          border: 1px solid var(--ink-hair);
          border-radius: 1px;
        }
        .select-tile__tag.is-live {
          background: var(--accent);
          border-color: var(--accent);
        }
        .select-tile__tag.is-live .t-warmth {
          color: #000;
        }
        .select-tile__tag .t-warmth {
          color: var(--ink);
          font-size: 8.5px;
          font-weight: 600;
          letter-spacing: 0.14em;
        }

        @media (prefers-reduced-motion: reduce) {
          .select-tile { animation: none; opacity: 1; transform: none; }
          .select-tile__video,
          .select-tile__image,
          .select-tile__caption {
            transition: none;
          }
        }
      `}</style>
    </article>
  );
}
