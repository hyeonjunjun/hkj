"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import type { Piece } from "@/constants/pieces";
import { useReducedMotion } from "@/hooks/useReducedMotion";

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
  /** Natural aspect ratio override (e.g. "16 / 9", "3 / 4"). Defaults to 4 / 5 portrait. */
  aspect?: string;
};

export default function CatalogPlate({ piece, aspect = "4 / 5" }: Props) {
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

  const number = `§${piece.number}`;
  const title = piece.placeholder ? "Untitled" : piece.title;
  const cover = piece.cover;
  const showLink = !piece.placeholder;
  const meta = piece.placeholder
    ? "Reserved · " + piece.year
    : `${piece.sector} · ${piece.year}`;

  const inner = (
    <article className="cat-plate" data-placeholder={piece.placeholder ? "" : undefined}>
      <div
        className="cat-plate__frame"
        style={{ aspectRatio: aspect } as React.CSSProperties}
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
        ) : (
          <div className="cat-plate__placeholder">
            <span>In development</span>
          </div>
        )}
      </div>
      <footer className="cat-plate__caption">
        <div className="cat-plate__line cat-plate__line--1">
          <span className="cat-plate__num tabular">{number}</span>
          <span className="cat-plate__sep" aria-hidden>·</span>
          <span className="cat-plate__title">{title}</span>
        </div>
        <div className="cat-plate__line cat-plate__line--2 tabular">{meta}</div>
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
      .cat-plate[data-placeholder] .cat-plate__frame::after {
        content: "";
        position: absolute;
        inset: 0;
        background: repeating-linear-gradient(
          45deg,
          transparent 0,
          transparent 14px,
          var(--ink-hair) 14px,
          var(--ink-hair) 15px
        );
        opacity: 0.6;
        pointer-events: none;
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

      .cat-plate__caption {
        display: grid;
        gap: 4px;
        line-height: 1.3;
      }
      .cat-plate__line--1 {
        display: inline-flex;
        align-items: baseline;
        gap: 8px;
        flex-wrap: wrap;
        font-family: var(--font-stack-sans);
      }
      .cat-plate__num {
        font-family: var(--font-stack-mono);
        font-size: var(--type-number);
        letter-spacing: 0.06em;
        color: var(--ink-3);
      }
      .cat-plate__sep { color: var(--ink-4); }
      .cat-plate__title {
        font-family: var(--font-stack-sans);
        font-size: var(--type-title);
        font-weight: 400;
        letter-spacing: 0;
        color: var(--ink);
      }
      .cat-plate[data-placeholder] .cat-plate__title { color: var(--ink-3); }
      .cat-plate__line--2 {
        font-family: var(--font-stack-sans);
        font-size: var(--type-meta);
        letter-spacing: 0.04em;
        color: var(--ink-3);
      }
    `}</style>
  );
}
