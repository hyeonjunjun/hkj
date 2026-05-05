"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { type Piece } from "@/constants/pieces";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type Props = {
  piece: Piece;
  /** Optional href override; defaults to /work/{slug}. */
  href?: string;
};

/**
 * WorkPlate — Aino-format tile. Full-bleed media frame with a single
 * label overlaid at bottom-left in mono uppercase: `R{NNN} {NAME}`.
 *
 * The overlay IS the caption — no separate caption block below.
 * Supporting metadata (role, year, description, EXIF) lives on the
 * detail page, not the tile. Aino's home format applied:
 *
 *   ┌──────────────────────────────────┐
 *   │                                  │
 *   │      [full-bleed media]          │
 *   │                                  │
 *   │                                  │
 *   │  R002 GYEOL: 결                  │
 *   └──────────────────────────────────┘
 *
 * Hover: image swap to coverAlt if provided, else 1.012 scale.
 * Placeholder mode: paper-2 fill, ink-3 label, no link, no scrim.
 * View transitions preserved per-slug on cover and label.
 */
export default function WorkPlate({ piece, href }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || reduced) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) v.play().catch(() => {});
          else v.pause();
        }
      },
      { threshold: 0.35 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, [reduced]);

  const target = href ?? `/work/${piece.slug}`;
  const coverVtName = `work-cover-${piece.slug}`;
  const titleVtName = `work-title-${piece.slug}`;

  // Aino-format label: single brand-letter + 3-digit padded number,
  // space, then UPPERCASE title. e.g. "R002 GYEOL: 결".
  const code = `R${piece.number.padStart(3, "0")}`;
  const labelText = `${code} ${piece.title.toUpperCase()}`;

  // Hover-swap source: prefer coverAlt when present + hovered + not reduced.
  const showAlt = hovered && !reduced && !!piece.coverAlt;
  const activeCover = showAlt ? piece.coverAlt! : piece.cover;

  const label = (
    <span
      className="plate__label"
      style={{ viewTransitionName: titleVtName } as React.CSSProperties}
    >
      {labelText}
    </span>
  );

  if (piece.placeholder) {
    return (
      <article className="plate plate--placeholder" aria-label={labelText}>
        <div
          className="plate__frame"
          style={{
            aspectRatio: "4 / 5",
            ["--cover-width" as string]: `${piece.coverWidth ?? 100}%`,
          } as React.CSSProperties}
        >
          <span className="plate__crosshairs" aria-hidden>
            <span />
          </span>
          {label}
        </div>
        <PlateStyle />
      </article>
    );
  }

  return (
    <Link
      href={target}
      className="plate"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-has-alt={piece.coverAlt ? "true" : "false"}
      aria-label={labelText}
    >
      <div
        className="plate__frame"
        style={{
          viewTransitionName: coverVtName,
          aspectRatio: "4 / 5",
          ["--cover-width" as string]: `${piece.coverWidth ?? 100}%`,
        } as React.CSSProperties}
      >
        {activeCover?.kind === "video" ? (
          <video
            ref={videoRef}
            className="plate__media"
            src={activeCover.src}
            poster={activeCover.poster}
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden
          />
        ) : activeCover?.kind === "image" ? (
          <Image
            src={activeCover.src}
            alt={`${piece.title} — cover`}
            fill
            sizes="(max-width: 720px) 100vw, 720px"
            className="plate__media"
            style={{ objectFit: "cover" }}
          />
        ) : (
          <div className="plate__placeholder">
            <span className="plate-mark">In development · {piece.year}</span>
          </div>
        )}
        <span className="plate__crosshairs" aria-hidden>
          <span />
        </span>
        {label}
      </div>
      <PlateStyle />
    </Link>
  );
}

function PlateStyle() {
  return (
    <style>{`
      .plate {
        display: block;
        color: var(--ink);
      }
      .plate--placeholder { cursor: default; }

      .plate__frame {
        position: relative;
        width: 100%;
        background: var(--paper-2);
        overflow: hidden;
        isolation: isolate;
        outline: 1px solid transparent;
        outline-offset: -1px;
        transition: outline-color 240ms var(--ease);
      }
      .plate:hover .plate__frame { outline-color: var(--ink-hair); }
      .plate--placeholder .plate__frame { outline-color: var(--ink-hair); }

      /* Bottom scrim — light gradient so the white label reads against
         any media. Suppressed on placeholders (no media to wash). */
      .plate__frame::after {
        content: "";
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 32%;
        background: linear-gradient(
          to top,
          rgba(14, 13, 9, 0.45) 0%,
          rgba(14, 13, 9, 0) 100%
        );
        pointer-events: none;
        z-index: 1;
      }
      .plate--placeholder .plate__frame::after { display: none; }

      /* Crosshair registration marks at all four inner corners. */
      .plate__crosshairs {
        position: absolute;
        inset: 0;
        pointer-events: none;
        z-index: 2;
      }
      .plate__crosshairs::before,
      .plate__crosshairs::after,
      .plate__crosshairs > span::before,
      .plate__crosshairs > span::after {
        content: "";
        position: absolute;
        width: 5px;
        height: 5px;
        background: var(--ink-4);
      }
      .plate__crosshairs::before { top: 6px; left: 6px; }
      .plate__crosshairs::after  { top: 6px; right: 6px; }
      .plate__crosshairs > span {
        position: absolute;
        inset: 0;
        display: block;
      }
      .plate__crosshairs > span::before { bottom: 6px; left: 6px; }
      .plate__crosshairs > span::after  { bottom: 6px; right: 6px; }
      .plate--placeholder .plate__crosshairs::before,
      .plate--placeholder .plate__crosshairs::after,
      .plate--placeholder .plate__crosshairs > span::before,
      .plate--placeholder .plate__crosshairs > span::after {
        background: var(--ink-3);
      }

      /* The label — Aino format: code + UPPERCASE name, mono, always
         visible. Bottom-left of the frame. White on media (over the
         scrim), ink-3 on placeholders. */
      .plate__label {
        position: absolute;
        bottom: clamp(10px, 1.5vw, 16px);
        left: clamp(10px, 1.5vw, 16px);
        right: clamp(10px, 1.5vw, 16px);
        font-family: var(--font-stack-mono);
        font-size: clamp(10px, 0.95vw, 12px);
        letter-spacing: var(--track-caps-mono);
        text-transform: uppercase;
        color: rgba(248, 245, 236, 0.96);
        font-variant-numeric: tabular-nums;
        pointer-events: none;
        z-index: 3;
        text-shadow: 0 1px 2px rgba(14, 13, 9, 0.35);
        /* Single line; truncate with ellipsis if title is unusually long */
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .plate--placeholder .plate__label {
        color: var(--ink-3);
        text-shadow: none;
      }

      .plate__media {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
        transition: opacity 320ms var(--ease), transform 280ms var(--ease);
      }
      .plate[data-has-alt="false"]:hover .plate__media {
        transform: scale(1.012);
      }
      .plate__placeholder {
        position: absolute;
        inset: 0;
        display: grid;
        place-items: center;
        padding: 24px;
      }

      @media (max-width: 720px) {
        .plate__frame {
          width: var(--cover-width, 100%);
          margin-inline: auto;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .plate__media { transition: none; }
        .plate[data-has-alt="false"]:hover .plate__media { transform: none; }
      }

      @media (hover: none), (pointer: coarse) {
        .plate[data-has-alt="false"]:hover .plate__media { transform: none; }
      }
    `}</style>
  );
}
