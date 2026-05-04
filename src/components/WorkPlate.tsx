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
 * WorkPlate — single full-width image + caption block. Used on the
 * home page (gallery view) and inside case studies for embedded
 * photographs. Caption block carries the four mandatory metadata
 * fields per the monograph spec §6: number · title · year+role ·
 * description, plus optional `meta` line for EXIF / coordinate /
 * source. Hover (desktop only) swaps to coverAlt if present, falls
 * back to a 1.012 scale otherwise. Preserves per-slug
 * viewTransitionName wiring on cover and title.
 *
 * Placeholder mode: when `piece.placeholder === true`, the plate is
 * rendered as a static reserved cell (no link, no cover, no view
 * transition) so the home grid keeps its rhythm before real content
 * lands.
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

  // Hover-swap source: prefer coverAlt when present + hovered + not reduced.
  const showAlt = hovered && !reduced && !!piece.coverAlt;
  const activeCover = showAlt ? piece.coverAlt! : piece.cover;

  const styles = (
    <style>{`
      .plate {
        display: grid;
        gap: clamp(16px, 2.5vh, 24px);
        color: var(--ink);
        padding-block-end: 0;
      }
      .plate__frame {
        position: relative;
        width: 100%;
        margin-inline: 0;
        background: var(--paper-2);
        overflow: hidden;
        isolation: isolate;
      }
      .plate--placeholder .plate__frame {
        border: 1px solid var(--ink-hair);
      }
      .plate--placeholder {
        cursor: default;
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
      .plate__cap {
        display: grid;
        gap: 12px;
        max-width: 60ch;
      }
      .plate--placeholder .plate__cap {
        color: var(--ink-3);
      }
      .plate__index {
        font-family: var(--font-stack-sans);
        font-size: 11px;
        letter-spacing: 0.02em;
        color: var(--ink-3);
      }
      .plate__title {
        font-family: var(--font-stack-sans);
        font-size: 19px;
        font-weight: 400;
        letter-spacing: -0.012em;
        line-height: 1.2;
        color: var(--ink);
        margin-block-start: 0;
      }
      .plate--placeholder .plate__title {
        color: var(--ink-3);
      }
      .plate__role {
        font-family: var(--font-stack-sans);
        font-size: 11px;
        letter-spacing: var(--microtype-tracking);
        text-transform: uppercase;
        color: var(--ink-3);
      }
      .plate__desc {
        font-family: var(--font-stack-sans);
        font-size: 14px;
        line-height: 1.6;
        color: var(--ink-2);
        max-width: 44ch;
        margin-block-start: 2px;
      }
      .plate--placeholder .plate__desc {
        color: var(--ink-3);
      }
      .plate__meta {
        font-family: var(--font-stack-sans);
        font-size: 11px;
        letter-spacing: var(--microtype-tracking);
        text-transform: uppercase;
        color: var(--ink-4);
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

  if (piece.placeholder) {
    return (
      <article className="plate plate--placeholder">
        <div
          className="plate__frame"
          style={{
            aspectRatio: piece.coverAspect ?? "4 / 5",
            ["--cover-width" as string]: `${piece.coverWidth ?? 100}%`,
          } as React.CSSProperties}
        />

        <div className="plate__cap">
          <span className="plate__index">
            <span className="tabular">{piece.number}</span>
            {" — "}
            <span className="tabular">{piece.year}</span>
          </span>
          <span className="plate__title">{piece.title}</span>
          <span className="plate__role">{piece.sector}</span>
          <span className="plate__desc">{piece.description}</span>
        </div>

        {styles}
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
    >
      <div
        className="plate__frame"
        style={{
          viewTransitionName: coverVtName,
          aspectRatio: piece.coverAspect ?? "4 / 5",
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
      </div>

      <div className="plate__cap">
        <span className="plate__index">
          <span className="tabular">№{piece.number}</span>
          {" / "}
          <span className="tabular">{piece.year}</span>
        </span>
        <span
          className="plate__title"
          style={{ viewTransitionName: titleVtName } as React.CSSProperties}
        >
          {piece.title}
        </span>
        <span className="plate__role">{piece.sector}</span>
        <span className="plate__desc">{piece.description}</span>
        {piece.meta && <span className="plate__meta">{piece.meta}</span>}
      </div>

      {styles}
    </Link>
  );
}
