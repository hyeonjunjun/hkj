"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import type { Piece } from "@/constants/pieces";

/**
 * NowPlayingPanel — right-rail Spotify-style detail pane that surfaces
 * project details when a tile is "peeked" (first click).
 *
 * Content:
 *   - "Now Playing" header + close button
 *   - Larger media preview (16:9)
 *   - Numbered title + sector
 *   - Status / Year / Client / Started → table
 *   - Description (full)
 *   - "Open project →" CTA (links to /work/[slug])
 *
 * The panel sits to the right of the SelectsGrid and shifts the grid
 * from 4 cols to 3 cols (or 2 on narrower viewports). The panel does
 * not overlay anything — it lives in the layout grid as a real column.
 *
 * Esc key closes the panel.
 */

interface Props {
  piece: Piece;
  onClose: () => void;
}

export function NowPlayingPanel({ piece, onClose }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const number = `[${piece.number}]`;
  const isWip = piece.status === "wip";
  const statusLabel =
    piece.status === "wip" ? "Live · in progress" :
    piece.status === "concept" ? "Concept" :
    "Shipped";

  return (
    <aside
      className="np-panel"
      aria-label={`Now playing: ${piece.title}`}
      style={{ viewTransitionName: "corner-rail" }}
    >
      <div className="np-panel__inner">
        <header className="np-panel__head">
          <span className="t-warmth np-panel__head-title">
            <span className="np-panel__head-dot" data-live={isWip ? "" : undefined} aria-hidden />
            Now Playing
          </span>
          <button
            type="button"
            className="np-panel__close"
            aria-label="Close panel"
            onClick={onClose}
          >
            <span aria-hidden>×</span>
          </button>
        </header>

        <div className="np-panel__media" style={{ aspectRatio: piece.coverAspect ?? "16 / 9" }}>
          {piece.cover?.kind === "video" ? (
            <video
              className="np-panel__video"
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
              sizes="(max-width: 960px) 100vw, 400px"
              className="np-panel__image"
              style={{ objectFit: "cover" }}
            />
          ) : (
            <div className="np-panel__placeholder" aria-hidden>
              <span className="t-warmth np-panel__placeholder-text">in progress</span>
            </div>
          )}
        </div>

        <div className="np-panel__caption">
          <span className="t-warmth np-panel__number">{number}</span>
          <h2 className="t-warmth np-panel__title">{piece.title}</h2>
          <p className="t-warmth np-panel__sector">{piece.sector.toUpperCase()}</p>
        </div>

        <hr className="t-rule" />

        <dl className="np-panel__table">
          <Pair label="Status" value={statusLabel} />
          <Pair label="Year" value={String(piece.year)} />
          <Pair label="Client" value={piece.client ?? "—"} />
          <Pair label="Started" value={piece.started} />
          {piece.ended && <Pair label="Ended" value={piece.ended} />}
          {piece.runtime && <Pair label="Runtime" value={piece.runtime} />}
        </dl>

        <hr className="t-rule" />

        <p className="t-warmth np-panel__desc">{piece.description}</p>

        <hr className="t-rule" />

        <Link href={`/v/corner/work/${piece.slug}`} className="np-panel__cta t-warmth">
          <span>Open project</span>
          <span aria-hidden>→</span>
        </Link>
      </div>

      <style>{`
        .np-panel {
          width: 100%;
          height: 100%;
          /* Lives inside the IndexShell grid as a real column — does
             NOT use position:fixed, so it shifts layout instead of
             covering content. */
          border-left: 1px solid var(--ink-hair);
          background: var(--paper);
          overflow-y: auto;
          scrollbar-width: thin;
        }
        .np-panel__inner {
          padding: clamp(20px, 2.6vh, 32px) clamp(20px, 2.4vw, 32px) clamp(48px, 6vh, 80px);
          display: grid;
          row-gap: clamp(16px, 2vh, 24px);
          /* No CSS keyframe entrance — View Transitions (corner-rail
             name) drive the slide-in/out animation. Running both was
             the source of the panel-appearance jank. */
        }

        .np-panel__head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        .np-panel__head-title {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: var(--ink);
          font-size: 13px;
          font-weight: 600;
          letter-spacing: -0.005em;
        }
        .np-panel__head-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--ink-3);
        }
        .np-panel__head-dot[data-live] {
          background: var(--accent);
          box-shadow: 0 0 0 0 rgba(232, 178, 90, 0.5);
          animation: np-panel-pulse 2.4s ease-in-out infinite;
        }
        @keyframes np-panel-pulse {
          0%   { box-shadow: 0 0 0 0 rgba(232, 178, 90, 0.45); }
          70%  { box-shadow: 0 0 0 6px transparent; }
          100% { box-shadow: 0 0 0 0 transparent; }
        }
        .np-panel__close {
          appearance: none;
          background: transparent;
          border: 0;
          color: var(--ink-3);
          cursor: pointer;
          font-size: 18px;
          line-height: 1;
          padding: 4px 6px;
          transition: color 180ms var(--ease), transform 120ms var(--ease);
        }
        .np-panel__close:hover { color: var(--ink); }
        .np-panel__close:active { transform: scale(0.92); }

        .np-panel__media {
          position: relative;
          width: 100%;
          overflow: hidden;
          background: var(--paper-2);
          border: 1px solid var(--ink-hair);
        }
        .np-panel__video,
        .np-panel__image {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .np-panel__placeholder {
          position: absolute;
          inset: 0;
          display: grid;
          place-content: center;
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
        .np-panel__placeholder-text {
          color: var(--ink-3);
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .np-panel__caption {
          display: grid;
          row-gap: 6px;
        }
        .np-panel__number {
          color: var(--ink-3);
          font-size: 11px;
          letter-spacing: 0.02em;
        }
        .np-panel__title {
          color: var(--ink);
          font-size: clamp(20px, 1.6vw, 26px);
          font-weight: 600;
          letter-spacing: -0.015em;
          line-height: 1.1;
          margin: 0;
          text-transform: none;
        }
        .np-panel__sector {
          color: var(--ink-3);
          font-size: 10.5px;
          font-weight: 400;
          letter-spacing: 0.08em;
          margin: 0;
        }

        .np-panel__table {
          display: grid;
          grid-template-columns: max-content 1fr;
          column-gap: 16px;
          row-gap: 6px;
          margin: 0;
        }
        .np-panel__table dt {
          color: var(--ink-3);
          font-family: var(--font-stack-spotify);
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .np-panel__table dd {
          color: var(--ink);
          font-family: var(--font-stack-spotify);
          font-size: 12px;
          font-weight: 400;
          letter-spacing: -0.005em;
          margin: 0;
        }

        .np-panel__desc {
          color: var(--ink-2);
          font-size: 13px;
          line-height: 1.55;
          letter-spacing: -0.005em;
          margin: 0;
          max-width: 48ch;
        }

        .np-panel__cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: var(--ink);
          font-size: 13px;
          font-weight: 600;
          letter-spacing: -0.005em;
          padding: 8px 0;
          border-bottom: 1px solid var(--ink);
          align-self: start;
          transition: transform 240ms var(--ease), color 180ms var(--ease);
        }
        .np-panel__cta:hover {
          transform: translateX(2px);
        }

        @media (prefers-reduced-motion: reduce) {
          .np-panel__head-dot[data-live] { animation: none; }
          .np-panel__close { transition: none; }
          .np-panel__cta { transition: color 180ms var(--ease); }
        }
      `}</style>
    </aside>
  );
}

function Pair({ label, value }: { label: string; value: string }) {
  return (
    <>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </>
  );
}
