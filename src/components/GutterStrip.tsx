"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useRef } from "react";
import type { Piece } from "@/constants/pieces";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type Props = { pieces: Piece[] };

/**
 * GutterStrip — a looping vertical carousel of project media.
 *
 * The pieces list is tripled so the strip can wrap seamlessly: on
 * mount we seek to the middle copy, and any time the user scrolls
 * past the first or third copy boundary we silently jump back by
 * exactly one set's height. scroll-behavior is `auto` inside the
 * strip so the teleport is invisible.
 *
 * Each frame uses the project's own `coverAspect` — portraits and
 * landscapes and squares stacked into an organic magazine column,
 * the way Cathy Dolle's Slider stack reads.
 *
 * Media inside each frame is oversized (130% height, -15% top) and
 * receives a transform on scroll proportional to that frame's
 * distance from the strip's viewport center. Slight parallax — the
 * media appears to hold its depth while the frame scrolls past.
 * Reduced-motion clients get static framing and no loop teleport.
 */
export default function GutterStrip({ pieces }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const tripled = useMemo(() => [...pieces, ...pieces, ...pieces], [pieces]);

  useEffect(() => {
    const strip = rootRef.current;
    if (!strip) return;

    const setCount = pieces.length;
    const items = Array.from(
      strip.querySelectorAll<HTMLElement>(".strip__item")
    );
    if (items.length === 0) return;

    // Seek to the top of the middle copy so the user has buffer on both sides.
    const seekToMiddle = () => {
      const singleSetHeight = strip.scrollHeight / 3;
      strip.scrollTop = singleSetHeight;
    };

    if (!reduced) {
      // Double rAF so layout settles before we seek.
      requestAnimationFrame(() => requestAnimationFrame(seekToMiddle));
    }

    let rafPending = false;
    const update = () => {
      rafPending = false;
      const stripRect = strip.getBoundingClientRect();
      const stripCenter = stripRect.top + stripRect.height / 2;

      items.forEach((item) => {
        const media = item.querySelector<HTMLElement>(".strip__media-wrap");
        if (!media) return;
        const itemRect = item.getBoundingClientRect();
        const itemCenter = itemRect.top + itemRect.height / 2;
        const distance = itemCenter - stripCenter;
        const offset = distance * 0.14; // slight parallax
        media.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
      });

      // Teleport loop: if we're in the first or third set, jump back to middle.
      if (!reduced) {
        const singleSetHeight = strip.scrollHeight / 3;
        const s = strip.scrollTop;
        if (s < singleSetHeight * 0.5) {
          strip.scrollTop = s + singleSetHeight;
        } else if (s > singleSetHeight * 2.5) {
          strip.scrollTop = s - singleSetHeight;
        }
      }
    };

    const handleScroll = () => {
      if (rafPending) return;
      rafPending = true;
      requestAnimationFrame(update);
    };

    strip.addEventListener("scroll", handleScroll, { passive: true });

    // Resize observer to re-seek + re-parallax on layout changes.
    const ro = new ResizeObserver(() => {
      if (!reduced) seekToMiddle();
      update();
    });
    ro.observe(strip);

    return () => {
      strip.removeEventListener("scroll", handleScroll);
      ro.disconnect();
    };
  }, [pieces.length, reduced]);

  return (
    <div
      ref={rootRef}
      className="strip"
      aria-label="Project media, scrollable"
      data-reduced={reduced ? "" : undefined}
      data-lenis-prevent
    >
      <ol className="strip__list">
        {tripled.map((p, i) => (
          <li key={`${p.slug}-${i}`} className="strip__item">
            <Link
              href={`/work/${p.slug}`}
              className="strip__link"
              data-cursor-label="OPEN PROJECT"
              aria-hidden={i >= pieces.length ? "true" : undefined}
              tabIndex={i >= pieces.length ? -1 : undefined}
            >
              <div
                className="strip__plate"
                style={{ aspectRatio: p.coverAspect ?? "16 / 9" }}
              >
                <div className="strip__media-wrap">
                  {p.cover?.kind === "video" ? (
                    <video
                      src={p.cover.src}
                      poster={p.cover.poster}
                      muted
                      loop
                      playsInline
                      autoPlay={!reduced}
                      preload="metadata"
                      className="strip__media"
                      data-fit={p.coverFit ?? "cover"}
                    />
                  ) : p.cover?.kind === "image" ? (
                    <Image
                      src={p.cover.src}
                      alt={p.title}
                      fill
                      sizes="(max-width: 900px) 100vw, 420px"
                      className="strip__media"
                      data-fit={p.coverFit ?? "cover"}
                    />
                  ) : (
                    <span className="strip__placeholder">
                      In development &nbsp;—&nbsp; {p.year}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ol>

      <style>{`
        .strip {
          height: 100%;
          overflow-y: auto;
          overflow-x: hidden;
          scrollbar-width: none;
          -ms-overflow-style: none;
          scroll-behavior: auto;
          /* Soft vertical fade so scroll-hidden edges don't feel cut */
          -webkit-mask-image: linear-gradient(
            to bottom,
            transparent 0,
            black 32px,
            black calc(100% - 32px),
            transparent 100%
          );
          mask-image: linear-gradient(
            to bottom,
            transparent 0,
            black 32px,
            black calc(100% - 32px),
            transparent 100%
          );
        }
        .strip::-webkit-scrollbar { display: none; }

        .strip__list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          gap: 0;
        }
        .strip__item { margin: 0; }

        .strip__link { display: block; color: var(--ink); }

        .strip__plate {
          position: relative;
          width: 100%;
          background: color-mix(in oklab, var(--paper) 94%, var(--ink) 6%);
          overflow: hidden;
          will-change: contents;
        }

        /* Oversized wrap: parallax transforms apply here, never showing bg */
        .strip__media-wrap {
          position: absolute;
          top: -15%;
          left: 0;
          width: 100%;
          height: 130%;
          will-change: transform;
        }

        video.strip__media {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .strip__media { object-fit: cover; }
        .strip__media[data-fit="center"] {
          object-fit: contain;
          object-position: center;
          padding: 4% 0;
        }

        .strip__placeholder {
          position: absolute;
          inset: 0;
          display: grid;
          place-items: center;
          font-family: var(--font-stack-mono);
          font-size: 9px;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: var(--ink-4);
          white-space: nowrap;
        }

        @media (prefers-reduced-motion: reduce) {
          .strip__media-wrap { transform: none !important; }
        }
      `}</style>
    </div>
  );
}
