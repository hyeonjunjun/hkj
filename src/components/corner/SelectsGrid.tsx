"use client";

import Link from "next/link";
import Image from "next/image";
import type { Piece } from "@/constants/pieces";

/**
 * SelectsGrid — ethan&tom-style project grid.
 *
 * Each tile: numbered editorial caption ABOVE a 16:9 media block.
 *   [01] LA28
 *        BRAND · CAMPAIGN · PERSONAL
 *   ┌──────────────────────────────┐
 *   │       [media or "in progress"]│
 *   └──────────────────────────────┘
 *
 * Peek-then-navigate interaction (desktop):
 *   - First click on a tile  → calls `onPeek(slug)` to open the Now
 *     Playing panel beside the grid. Default link nav is prevented.
 *   - Click on a different tile while panel is open → swaps panel
 *     contents (still peek, no nav).
 *   - Click on the active tile a second time → allows default nav
 *     to /work/[slug]. Panel can be opened deeper.
 *
 * Below 960px, peek is disabled and clicks navigate directly — the
 * panel needs side-by-side room to read as "shift not overlay."
 *
 * Status tag (LIVE / CONCEPT) anchored bottom-right of the media.
 */

const PEEK_MIN_WIDTH = "(min-width: 960px)";

interface Props {
  pieces: ReadonlyArray<Piece>;
  activeSlug: string | null;
  onPeek: (slug: string) => void;
  /** True when a panel is open beside the grid; grid reflows to 3 cols. */
  panelOpen?: boolean;
}

export function SelectsGrid({ pieces, activeSlug, onPeek, panelOpen }: Props) {
  return (
    <section
      className="selects-grid"
      data-panel-open={panelOpen ? "" : undefined}
      aria-label="Index — visual project grid"
    >
      <div className="selects-grid__inner">
        {pieces.map((piece, i) => (
          <SelectTile
            key={piece.slug}
            piece={piece}
            index={i}
            isActive={activeSlug === piece.slug}
            onPeek={onPeek}
          />
        ))}
      </div>

      <style>{`
        .selects-grid {
          width: 100%;
        }
        /* 5-column grid at desktop (ethan&tom density). Horizontal
           padding consumes the shared --corner-gutter token defined
           on [data-page="corner"] in globals.css so the grid edges
           align with the CornerNav edges. */
        .selects-grid__inner {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          column-gap: clamp(12px, 1.4vw, 22px);
          row-gap: clamp(36px, 5vh, 64px);
          padding: 0 var(--corner-gutter);
          /* No CSS transition on grid-template-columns — View Transitions
             (per-tile, via view-transition-name in SelectTile) handle
             the column reflow smoothly. */
        }
        /* When the Now Playing panel is open, drop to 4 cols. */
        .selects-grid[data-panel-open] .selects-grid__inner {
          grid-template-columns: repeat(4, 1fr);
          padding-right: 0;
        }
        @media (max-width: 1440px) {
          .selects-grid__inner {
            grid-template-columns: repeat(4, 1fr);
          }
          .selects-grid[data-panel-open] .selects-grid__inner {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        @media (max-width: 1080px) {
          .selects-grid__inner {
            grid-template-columns: repeat(3, 1fr);
          }
          .selects-grid[data-panel-open] .selects-grid__inner {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 720px) {
          .selects-grid__inner {
            grid-template-columns: repeat(2, 1fr);
            column-gap: 12px;
            row-gap: 32px;
          }
        }
        @media (max-width: 480px) {
          .selects-grid__inner {
            grid-template-columns: 1fr;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .selects-grid__inner { transition: none; }
        }
      `}</style>
    </section>
  );
}

interface TileProps {
  piece: Piece;
  index: number;
  isActive: boolean;
  onPeek: (slug: string) => void;
}

function SelectTile({ piece, index, isActive, onPeek }: TileProps) {
  const number = `[${piece.number}]`;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Only intercept on the peek breakpoint. Below it, let the link
    // navigate normally — the side panel has no room and would cover
    // content.
    if (typeof window === "undefined") return;
    if (!window.matchMedia(PEEK_MIN_WIDTH).matches) return;
    if (isActive) {
      // Second click on the active tile → allow default navigation.
      return;
    }
    e.preventDefault();
    onPeek(piece.slug);
  };

  return (
    <article
      className="select-tile"
      style={{
        // Stagger entrance is delayed to ~900ms (after the CornerAudio
        // LCD boot finishes) + 60ms per tile so the grid cascades in
        // *after* the audio fixture has revealed its data. Choreographed
        // entrance sequence for first paint.
        animationDelay: `${900 + index * 60}ms`,
        // view-transition-name lets the browser morph this tile from
        // its 4-col position to its 3-col position when the panel
        // opens. Each tile is a separately-captured element.
        viewTransitionName: `corner-tile-${piece.slug}`,
      }}
      data-status={piece.status}
      data-active={isActive ? "" : undefined}
    >
      <Link
        href={`/v/corner/work/${piece.slug}`}
        className="select-tile__link"
        onClick={handleClick}
        aria-pressed={isActive}
      >
        <header className="select-tile__caption">
          <span className="t-warmth select-tile__number">{number}</span>
          <span className="select-tile__lines">
            <span
              className="t-warmth select-tile__title"
              style={{ viewTransitionName: `corner-project-${piece.slug}` }}
            >
              {piece.title}
            </span>
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
              <span className="t-warmth select-tile__placeholder-text">in progress</span>
            </div>
          )}

        </div>
      </Link>

      <style>{`
        .select-tile {
          opacity: 0;
          animation: select-tile-in 720ms var(--ease) both;
          transition: opacity 240ms var(--ease);
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
        /* Active (peeking) tile: amber rim so the panel binds visually
           to its source. */
        .select-tile[data-active] .select-tile__media {
          border-color: var(--accent);
          box-shadow: 0 0 0 1px var(--accent);
        }
        .select-tile__link:hover .select-tile__media {
          border-color: var(--ink-hair);
        }
        .select-tile[data-active] .select-tile__link:hover .select-tile__media {
          border-color: var(--accent);
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
          /* Placeholder diagonal hatch sits over --paper-2; ink-ghost
             token automatically inverts with theme (light: 4% dark on
             white, dark: 4% white on black). */
          background:
            repeating-linear-gradient(
              -45deg,
              transparent 0,
              transparent 12px,
              var(--ink-ghost) 12px,
              var(--ink-ghost) 13px
            ),
            var(--paper-2);
        }
        .select-tile__placeholder-text {
          color: var(--ink-3);
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.18em;
          line-height: 1;
          text-transform: uppercase;
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
