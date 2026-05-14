"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useState } from "react";
import type { Piece } from "@/constants/pieces";

/**
 * ProjectCard — one card in the index slider. Vertical stack:
 *
 *   ┌────────────────────────────┐
 *   │                             │
 *   │         [media]             │   ← cover (video or image)
 *   │                             │
 *   │                             │
 *   ├─────────────────────────────┤
 *   │ N01    LA28      WIP        │   ← number / title / status
 *   │ brand · campaign · personal │   ← sector
 *   │ 2026                        │   ← year
 *   └─────────────────────────────┘
 *
 * Hover reveals the description (slides up below the metadata).
 * Cover scales 1.04× and lightens slightly. The video auto-plays
 * muted+loop+playsInline; the image gets a Ken-Burns-style 6s slow
 * scale. Whole card is the link target.
 *
 * Number formatted as N## (consistent with N001 note convention but
 * 2-digit for projects since they're a small set).
 *
 * View-transition-name `corner-project-<slug>` lets the card morph
 * into the project detail hero on navigation.
 */

interface Props {
  piece: Piece;
  /** Index within the visible set; used for stagger-fade entrance. */
  index: number;
}

export function ProjectCard({ piece, index }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [hovered, setHovered] = useState(false);

  const number = `N${piece.number}`;
  const isWip = piece.status === "wip";
  const isConcept = piece.status === "concept";

  return (
    <article
      className="corner-card"
      data-status={piece.status}
      style={{ animationDelay: `${260 + index * 80}ms` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link
        href={`/work/${piece.slug}`}
        className="corner-card__link"
        aria-label={`${piece.title} — ${piece.sector}`}
      >
        <div
          className="corner-card__media"
          style={{ aspectRatio: piece.coverAspect ?? "4 / 5" }}
        >
          {piece.cover?.kind === "video" ? (
            <video
              ref={videoRef}
              className="corner-card__video"
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
              sizes="(max-width: 720px) 80vw, 32vw"
              className="corner-card__image"
              style={{ objectFit: "cover" }}
            />
          ) : (
            <div className="corner-card__placeholder" aria-hidden>
              <span className="t-eyebrow dimmer">{piece.sector}</span>
              <span className="t-display">{piece.title}</span>
            </div>
          )}

          {/* Status tag — top-left of media */}
          {(isWip || isConcept) && (
            <span className={`corner-card__tag${isWip ? " is-live" : ""}`}>
              <span className="t-footnote">{isWip ? "LIVE" : "CONCEPT"}</span>
            </span>
          )}
        </div>

        <div className="corner-card__meta">
          <div className="corner-card__row corner-card__row--top">
            <span className="t-code tabular corner-card__num">{number}</span>
            <span className="t-row corner-card__title">{piece.title}</span>
            <span className="t-meta tabular dim corner-card__year">{piece.year}</span>
          </div>
          <div className="corner-card__row corner-card__row--sector">
            <span className="t-meta corner-card__sector">{piece.sector}</span>
          </div>
          <div
            className="corner-card__desc"
            data-visible={hovered ? "" : undefined}
          >
            <span className="t-caption dim">{piece.description}</span>
          </div>
        </div>
      </Link>

      <style>{`
        .corner-card {
          flex: 0 0 auto;
          width: clamp(280px, 32vw, 420px);
          scroll-snap-align: start;
          opacity: 0;
          animation: corner-card-in 720ms var(--ease) both;
          display: block;
        }
        .corner-card[data-status="personal"] { /* future hook */ }

        @keyframes corner-card-in {
          0% {
            opacity: 0;
            transform: translate3d(0, 14px, 0);
            filter: blur(2px);
          }
          100% {
            opacity: 1;
            transform: translate3d(0, 0, 0);
            filter: blur(0);
          }
        }

        .corner-card__link {
          display: block;
          color: inherit;
          text-decoration: none;
        }

        .corner-card__media {
          position: relative;
          width: 100%;
          overflow: hidden;
          background: var(--paper-2);
          border: 1px solid var(--ink-hair);
          /* Slight inner shadow so cover sits in a frame, not bolted on. */
          box-shadow: 0 1px 0 var(--ink-hair) inset;
          transition: border-color 320ms var(--ease);
        }
        .corner-card__link:hover .corner-card__media {
          border-color: var(--ink-3);
        }

        .corner-card__video,
        .corner-card__image {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 720ms var(--ease), filter 720ms var(--ease);
          will-change: transform;
        }
        .corner-card__link:hover .corner-card__video,
        .corner-card__link:hover .corner-card__image {
          transform: scale(1.045);
          filter: brightness(1.04);
        }

        .corner-card__placeholder {
          position: absolute;
          inset: 0;
          display: grid;
          place-content: center;
          gap: 8px;
          text-align: center;
          padding: 24px;
          background:
            repeating-linear-gradient(
              -45deg,
              transparent 0,
              transparent 14px,
              rgba(0,0,0,0.03) 14px,
              rgba(0,0,0,0.03) 15px
            ),
            var(--paper-2);
          color: var(--ink-3);
        }
        :root[data-theme="dark"] .corner-card__placeholder {
          background:
            repeating-linear-gradient(
              -45deg,
              transparent 0,
              transparent 14px,
              rgba(255,255,255,0.035) 14px,
              rgba(255,255,255,0.035) 15px
            ),
            var(--paper-2);
        }
        .corner-card__placeholder .t-display {
          font-size: clamp(20px, 3vw, 32px);
          letter-spacing: -0.02em;
          color: var(--ink-2);
          text-transform: none;
        }

        .corner-card__tag {
          position: absolute;
          top: 12px;
          left: 12px;
          padding: 4px 8px;
          background: var(--ink);
          color: var(--paper);
          border-radius: 2px;
          letter-spacing: 0.16em;
          z-index: 2;
        }
        .corner-card__tag.is-live {
          background: var(--accent);
          color: var(--ink);
        }

        .corner-card__meta {
          padding: 14px 2px 0;
          display: grid;
          row-gap: 6px;
        }
        .corner-card__row {
          display: flex;
          align-items: baseline;
          gap: 10px;
        }
        .corner-card__row--top {
          align-items: baseline;
        }
        .corner-card__num {
          color: var(--ink-4);
          flex: 0 0 auto;
        }
        .corner-card__title {
          flex: 1 1 auto;
          color: var(--ink);
          letter-spacing: -0.005em;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          transition: transform 280ms var(--ease);
        }
        .corner-card__link:hover .corner-card__title {
          transform: translateX(2px);
        }
        .corner-card__year {
          flex: 0 0 auto;
          color: var(--ink-3);
        }
        .corner-card__sector {
          color: var(--ink-3);
          text-transform: lowercase;
          font-family: var(--font-stack-mono);
          font-size: var(--type-caption);
          letter-spacing: var(--track-snug);
        }
        .corner-card__desc {
          max-height: 0;
          overflow: hidden;
          opacity: 0;
          transition:
            max-height 320ms var(--ease),
            opacity 220ms var(--ease) 60ms;
          padding-top: 0;
        }
        .corner-card__desc[data-visible] {
          max-height: 120px;
          opacity: 1;
          padding-top: 6px;
        }

        @media (max-width: 720px) {
          .corner-card { width: 78vw; }
          .corner-card__desc[data-visible] {
            /* Touch — show by default */
            max-height: 120px;
            opacity: 1;
            padding-top: 6px;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .corner-card { animation: none; opacity: 1; transform: none; filter: none; }
          .corner-card__video,
          .corner-card__image,
          .corner-card__title,
          .corner-card__desc {
            transition: none;
          }
        }
      `}</style>
    </article>
  );
}
