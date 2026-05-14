"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { Piece } from "@/constants/pieces";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { ConceptPlate } from "@/components/home/ConceptPlate";

type Props = { piece: Piece };

/**
 * CaseHero — full-bleed cover plate at the top of /work/[slug].
 *
 * Sharp corners, paper-2 fill, natural aspect ratio derived from
 * piece.coverAspect (falls back to 16 / 9). The hero respects the
 * page-margin gutter; it is full-width within those gutters, not
 * full-viewport edge-to-edge.
 *
 * Video covers do NOT autoplay — per spec, they show a poster frame
 * and play on click via a centered play-button overlay. The play
 * control is keyboard-reachable and toggles to a pause glyph once
 * playback is in progress.
 *
 * The frame carries `view-transition-name: work-cover-{slug}` so the
 * homepage CatalogPlate cover (when it adopts the same name) can
 * morph into this position via the browser's shared-element route
 * transition. Globals.css already declares matching keyframes for
 * `gyeol`, `sift`, `pane`, `clouds-at-sea`.
 */
export default function CaseHero({ piece }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();
  const [playing, setPlaying] = useState(false);

  const aspect = piece.coverAspect ?? "16 / 9";
  const isVideo = piece.cover?.kind === "video";

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play()
        .then(() => setPlaying(true))
        .catch(() => {});
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  // Determine source for the rendered media.
  const mediaSrc =
    piece.cover?.kind === "image"
      ? piece.cover.src
      : piece.cover?.kind === "video"
        ? piece.cover.poster
        : piece.image;

  return (
    <figure className="case-hero">
      <div
        className="case-hero__frame"
        style={
          {
            aspectRatio: aspect,
            viewTransitionName: `work-cover-${piece.slug}`,
          } as React.CSSProperties
        }
      >
        {isVideo && piece.cover?.kind === "video" ? (
          <>
            <video
              ref={videoRef}
              className="case-hero__media"
              src={piece.cover.src}
              poster={piece.cover.poster}
              muted
              loop
              playsInline
              preload="metadata"
              onEnded={() => setPlaying(false)}
              onPause={() => setPlaying(false)}
              onPlay={() => setPlaying(true)}
              aria-label={`${piece.title} — cover footage`}
            />
            {!reduced && (
              <button
                type="button"
                className="case-hero__play"
                data-playing={playing ? "" : undefined}
                onClick={togglePlay}
                aria-label={playing ? "Pause cover footage" : "Play cover footage"}
              >
                <span className="case-hero__play-glyph" aria-hidden>
                  {playing ? "❚❚" : "▶"}
                </span>
              </button>
            )}
          </>
        ) : mediaSrc ? (
          <Image
            src={mediaSrc}
            alt={`${piece.title} — cover plate`}
            fill
            sizes="(max-width: 760px) 100vw, 960px"
            style={{ objectFit: "cover" }}
            priority
          />
        ) : (
          // Concept piece without media: render the typographic plate
          // (same component the home carousel uses for these pieces).
          <ConceptPlate piece={piece} />
        )}
      </div>

      <style>{`
        .case-hero {
          margin: 0;
          width: 100%;
        }
        .case-hero__frame {
          position: relative;
          width: 100%;
          background: var(--paper-2);
          overflow: hidden;
          /* Sharp corners — never round. */
          border-radius: 0;
          box-shadow: inset 0 0 0 1px var(--ink-hair);
        }
        .case-hero__media {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .case-hero__empty {
          position: absolute;
          inset: 0;
          display: grid;
          place-items: center;
          color: var(--ink-4);
        }

        /* Play button — paper disc on a soft inner shadow. Sized as
           a thumbprint, not a billboard. Hidden once the cover is
           playing so the footage owns the frame. */
        .case-hero__play {
          position: absolute;
          inset: 0;
          margin: auto;
          width: clamp(56px, 6vw, 80px);
          height: clamp(56px, 6vw, 80px);
          display: grid;
          place-items: center;
          /* Hollow circle on the dark register — border + faint
             tint so the disc reads against any cover. */
          background: rgba(248, 248, 248, 0.06);
          color: var(--ink);
          border: 1px solid rgba(248, 248, 248, 0.32);
          border-radius: 50%;
          cursor: pointer;
          font-family: var(--font-stack-mono);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          transition:
            opacity 200ms var(--ease),
            transform 200ms var(--ease),
            background-color 200ms var(--ease),
            border-color 200ms var(--ease);
        }
        .case-hero__play:hover {
          background: rgba(248, 248, 248, 0.14);
          border-color: var(--ink);
          transform: scale(1.04);
        }
        .case-hero__play:focus-visible {
          outline: 1px solid var(--ink);
          outline-offset: 4px;
        }
        .case-hero__play[data-playing] {
          opacity: 0;
          pointer-events: none;
        }
        .case-hero__play[data-playing]:hover,
        .case-hero__play[data-playing]:focus-visible {
          opacity: 1;
          pointer-events: auto;
        }
        .case-hero__play-glyph {
          font-size: clamp(13px, 1.1vw, 15px);
          letter-spacing: 0;
          line-height: 1;
          /* Optical centering of the play triangle */
          transform: translateX(1px);
        }
        .case-hero__play[data-playing] .case-hero__play-glyph {
          transform: none;
        }

        @media (prefers-reduced-motion: reduce) {
          .case-hero__play,
          .case-hero__play:hover { transition: none; transform: none; }
        }
      `}</style>
    </figure>
  );
}
