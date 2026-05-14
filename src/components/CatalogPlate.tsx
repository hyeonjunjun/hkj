"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import type { Piece } from "@/constants/pieces";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { ConceptPlate } from "@/components/home/ConceptPlate";

/**
 * CatalogPlate — homepage Grid View project card per spec §06.
 *
 *   ┌───────────────────────────┐
 *   │      [cover image/video]  │  ← natural aspect via prop
 *   └───────────────────────────┘
 *     §01 · Clouds at Sea          ← number + title
 *     WebGL / Generative · 2026    ← type + year
 *
 * Cover: sharp corners, object-fit: cover, video autoplay via
 * IntersectionObserver. Caption: 12px gap below frame, two lines.
 *
 * Hover: sibling plates dim to 0.5 (driven by `data-hover` on the
 * grid container), active plate stays full opacity. No transform.
 */
type Props = {
  piece: Piece;
  /** Natural aspect ratio override (e.g. "16 / 9", "21 / 9"). Defaults to 16 / 9 landscape. */
  aspect?: string;
};

export default function CatalogPlate({ piece, aspect = "16 / 9" }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const v = videoRef.current;
    if (!v || reduced) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            v.play().catch(() => {});
          } else {
            v.pause();
          }
        }
      },
      { threshold: [0, 0.5, 1] },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [reduced]);

  const number = piece.number;
  const title = piece.placeholder ? "Untitled" : piece.title;
  const cover = piece.cover;
  const showLink = !piece.placeholder;
  const yearLabel = piece.placeholder ? "Reserved" : String(piece.year);

  const inner = (
    <article className="cat-plate" data-placeholder={piece.placeholder ? "" : undefined}>
      <div
        className="cat-plate__frame"
        style={
          {
            aspectRatio: aspect,
            // Shared-element morph target — matches CaseHero's frame on
            // /work/[slug]. Only emit when the plate links somewhere;
            // placeholders share no destination so a name would be
            // orphaned. View-transition-names must also be unique on
            // any single page, which holds because each slug renders
            // at most one plate per route.
            ...(showLink
              ? { viewTransitionName: `work-cover-${piece.slug}` }
              : null),
          } as React.CSSProperties
        }
      >
        {!piece.placeholder && cover?.kind === "video" ? (
          <video
            ref={videoRef}
            src={cover.src}
            poster={cover.poster}
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden
            className="cat-plate__media"
          />
        ) : !piece.placeholder && cover?.kind === "image" ? (
          <Image
            src={cover.src}
            alt={`${title} — cover`}
            fill
            sizes="(max-width: 760px) 100vw, 50vw"
            className="cat-plate__media"
            style={{ objectFit: "cover" }}
          />
        ) : !piece.placeholder ? (
          // Concept piece without media: render the typographic plate
          // used by the home carousel for visual consistency.
          <ConceptPlate piece={piece} />
        ) : (
          <div className="cat-plate__placeholder">
            <span>Reserved</span>
          </div>
        )}

        {/* WIP teaser: a frosted overlay that materialises on hover.
            Visual stays intact (the video keeps playing underneath)
            but is un-clarified — the work is in progress, the viewer
            sees a frosted version of it. Only renders for pieces with
            status: "wip"; shipped plates have no overlay. */}
        {piece.status === "wip" && !piece.placeholder && (
          <div className="cat-plate__wip" aria-hidden />
        )}
      </div>
      <footer className="cat-plate__caption">
        <span className="cat-plate__num tabular">{number}</span>
        <span className="cat-plate__title">{title}</span>
        <span className="cat-plate__year tabular">{yearLabel}</span>
      </footer>

      <PlateStyle />
    </article>
  );

  if (!showLink) return inner;
  return (
    <Link
      href={`/work/${piece.slug}`}
      className="cat-plate-link"
      aria-label={`${title} — view`}
    >
      {inner}
    </Link>
  );
}

function PlateStyle() {
  return (
    <style>{`
      .cat-plate-link {
        display: block;
        color: inherit;
      }
      .cat-plate {
        display: grid;
        gap: var(--space-caption);
      }
      .cat-plate__frame {
        position: relative;
        width: 100%;
        background: var(--paper-2);
        overflow: hidden;
        outline: 1px solid var(--ink-hair);
        outline-offset: -1px;
        transition: outline-color 240ms var(--ease);
      }
      .cat-plate-link:hover .cat-plate__frame {
        outline-color: var(--ink-3);
      }
      .cat-plate[data-placeholder] .cat-plate__frame {
        background: var(--paper-2);
      }
      .cat-plate__media {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }
      .cat-plate__placeholder {
        position: absolute;
        inset: 0;
        display: grid;
        place-items: center;
        color: var(--ink-4);
        font-family: var(--font-stack-mono);
        font-size: var(--type-meta);
        letter-spacing: 0.06em;
        text-transform: uppercase;
      }

      /* WIP frosted overlay — invisible at rest, materialises on hover.
         backdrop-filter blurs whatever is behind (the video). The 0.04
         warm-paper tint is a hint of physical surface so the blur reads
         as "frosted glass" rather than "out-of-focus camera." */
      .cat-plate__wip {
        position: absolute;
        inset: 0;
        opacity: 0;
        background: rgba(251, 250, 246, 0.04);
        backdrop-filter: blur(10px) saturate(0.85);
        -webkit-backdrop-filter: blur(10px) saturate(0.85);
        transition: opacity 280ms var(--ease);
        pointer-events: none;
      }
      .cat-plate-link:hover .cat-plate__wip {
        opacity: 1;
      }
      @media (prefers-reduced-motion: reduce) {
        .cat-plate__wip { transition: none; }
      }

      /* Aino-style flat caption: number — title — year on a single row,
         with the year flush right via grid alignment. */
      .cat-plate__caption {
        display: grid;
        grid-template-columns: auto 1fr auto;
        align-items: baseline;
        gap: 12px;
        line-height: 1.3;
      }
      .cat-plate__num {
        font-family: var(--font-stack-mono);
        font-size: var(--type-number);
        letter-spacing: 0.06em;
        color: var(--ink-3);
        font-variant-numeric: tabular-nums;
      }
      /* Plate caption title — mono row register, lowercase. Matches
         the home setlist titles and the /work list-view titles. */
      .cat-plate__title {
        font-family: var(--font-stack-mono);
        font-size: var(--type-row);
        font-weight: 400;
        letter-spacing: var(--track-snug);
        color: var(--ink);
        text-transform: lowercase;
        text-wrap: balance;
      }
      .cat-plate[data-placeholder] .cat-plate__title { color: var(--ink-3); }
      .cat-plate__year {
        font-family: var(--font-stack-mono);
        font-size: var(--type-meta);
        letter-spacing: 0.06em;
        color: var(--ink-3);
        font-variant-numeric: tabular-nums lining-nums;
        justify-self: end;
      }
    `}</style>
  );
}
