"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef } from "react";
import type { Piece } from "@/constants/pieces";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type Props = {
  pieces: Piece[];
  /** Called with the logical 0-based project index whenever the active project changes. */
  onActiveChange?: (activeIdx: number) => void;
};

/**
 * GutterStrip — wheel-driven looping snap carousel of project media.
 *
 * One wheel tick = one project. Each transition animates for ~920ms
 * with a cubic ease-in-out; parallax (factor 0.08) applies per-frame
 * so the media settles in lockstep with the scroll. Content is
 * tripled so the active project is always sourced from the middle
 * copy; after each snap settles we teleport scrollTop by one
 * set-height if the new DOM index has drifted out of the middle copy
 * boundary. scroll-behavior: auto keeps the teleport invisible.
 *
 * Reduced-motion clients see static framing, no parallax, no snap.
 */
const SNAP_DURATION = 920;
const PARALLAX = 0.08;
const WHEEL_LOCK_MS = 280;

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export default function GutterStrip({ pieces, onActiveChange }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const tripled = useMemo(() => [...pieces, ...pieces, ...pieces], [pieces]);

  const pieceCount = pieces.length;

  // DOM index within the tripled list; start at first item of the middle copy
  const domIdxRef = useRef(pieceCount);
  const animIdRef = useRef<number | null>(null);
  const isAnimatingRef = useRef(false);
  const wheelLockRef = useRef(false);

  const getItems = useCallback(() => {
    const strip = rootRef.current;
    if (!strip) return [] as HTMLElement[];
    return Array.from(strip.querySelectorAll<HTMLElement>(".strip__item"));
  }, []);

  const scrollTopForDomIdx = useCallback(
    (domIdx: number) => {
      const strip = rootRef.current;
      if (!strip) return 0;
      const items = getItems();
      const target = items[domIdx];
      if (!target) return 0;
      return (
        target.offsetTop + target.offsetHeight / 2 - strip.clientHeight / 2
      );
    },
    [getItems]
  );

  const applyParallax = useCallback(() => {
    const strip = rootRef.current;
    if (!strip || reduced) return;
    const stripRect = strip.getBoundingClientRect();
    const stripCenter = stripRect.top + stripRect.height / 2;
    getItems().forEach((item) => {
      const media = item.querySelector<HTMLElement>(".strip__media-wrap");
      if (!media) return;
      const rect = item.getBoundingClientRect();
      const itemCenter = rect.top + rect.height / 2;
      const distance = itemCenter - stripCenter;
      const offset = distance * PARALLAX;
      media.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
    });
  }, [getItems, reduced]);

  /** If the current domIdx has drifted out of the middle copy, silently
   *  teleport scrollTop + domIdx by one set-height so we're always
   *  anchored in the middle copy with buffer on both sides. */
  const teleportIfNeeded = useCallback(() => {
    const strip = rootRef.current;
    if (!strip) return;
    const domIdx = domIdxRef.current;
    if (domIdx < pieceCount) {
      domIdxRef.current = domIdx + pieceCount;
      strip.scrollTop = scrollTopForDomIdx(domIdxRef.current);
      applyParallax();
    } else if (domIdx >= pieceCount * 2) {
      domIdxRef.current = domIdx - pieceCount;
      strip.scrollTop = scrollTopForDomIdx(domIdxRef.current);
      applyParallax();
    }
  }, [applyParallax, pieceCount, scrollTopForDomIdx]);

  const animateTo = useCallback(
    (newDomIdx: number) => {
      const strip = rootRef.current;
      if (!strip) return;

      if (animIdRef.current !== null) {
        cancelAnimationFrame(animIdRef.current);
      }

      const startTop = strip.scrollTop;
      const targetTop = scrollTopForDomIdx(newDomIdx);
      const delta = targetTop - startTop;
      const startTime = performance.now();

      isAnimatingRef.current = true;

      const frame = (now: number) => {
        const elapsed = now - startTime;
        const t = Math.min(elapsed / SNAP_DURATION, 1);
        const eased = easeInOutCubic(t);
        strip.scrollTop = startTop + delta * eased;
        applyParallax();

        if (t < 1) {
          animIdRef.current = requestAnimationFrame(frame);
        } else {
          animIdRef.current = null;
          isAnimatingRef.current = false;
          domIdxRef.current = newDomIdx;
          teleportIfNeeded();
        }
      };
      animIdRef.current = requestAnimationFrame(frame);
    },
    [applyParallax, scrollTopForDomIdx, teleportIfNeeded]
  );

  // Initial seek to the middle copy + announce first active
  useEffect(() => {
    const strip = rootRef.current;
    if (!strip) return;

    const init = () => {
      domIdxRef.current = pieceCount;
      strip.scrollTop = scrollTopForDomIdx(pieceCount);
      applyParallax();
      onActiveChange?.(0);
    };

    requestAnimationFrame(() => requestAnimationFrame(init));

    const ro = new ResizeObserver(() => {
      if (!isAnimatingRef.current) {
        strip.scrollTop = scrollTopForDomIdx(domIdxRef.current);
        applyParallax();
      }
    });
    ro.observe(strip);

    return () => {
      ro.disconnect();
      if (animIdRef.current !== null) cancelAnimationFrame(animIdRef.current);
    };
  }, [pieceCount, scrollTopForDomIdx, applyParallax, onActiveChange]);

  // Wheel interception — one tick, one project; loops forever
  useEffect(() => {
    const strip = rootRef.current;
    if (!strip) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (reduced) return;
      if (isAnimatingRef.current || wheelLockRef.current) return;

      const direction = e.deltaY > 0 ? 1 : -1;

      wheelLockRef.current = true;
      window.setTimeout(() => {
        wheelLockRef.current = false;
      }, WHEEL_LOCK_MS);

      const newDomIdx = domIdxRef.current + direction;
      const activeIdx =
        ((newDomIdx - pieceCount) % pieceCount + pieceCount) % pieceCount;
      onActiveChange?.(activeIdx);
      animateTo(newDomIdx);
    };

    strip.addEventListener("wheel", handleWheel, { passive: false });
    return () => strip.removeEventListener("wheel", handleWheel);
  }, [animateTo, onActiveChange, pieceCount, reduced]);

  return (
    <div
      ref={rootRef}
      className="strip"
      aria-label="Project media, wheel-to-advance"
      data-lenis-prevent
    >
      <ol className="strip__list">
        {tripled.map((p, i) => {
          const isCanonical = i >= pieceCount && i < pieceCount * 2;

          const pauseVideo = (el: HTMLElement | null) => {
            const v = el?.querySelector<HTMLVideoElement>("video");
            if (v && !v.paused) v.pause();
          };
          const resumeVideo = (el: HTMLElement | null) => {
            if (reduced) return;
            const v = el?.querySelector<HTMLVideoElement>("video");
            if (v && v.paused) v.play().catch(() => {});
          };

          return (
            <li
              key={`${p.slug}-${i}`}
              className="strip__item"
              style={{ width: `${p.coverWidth ?? 100}%` }}
            >
              <Link
                href={`/work/${p.slug}`}
                className="strip__link"
                aria-hidden={!isCanonical ? "true" : undefined}
                tabIndex={!isCanonical ? -1 : undefined}
                onPointerEnter={(e) => pauseVideo(e.currentTarget)}
                onPointerLeave={(e) => resumeVideo(e.currentTarget)}
                onFocus={(e) => pauseVideo(e.currentTarget)}
                onBlur={(e) => resumeVideo(e.currentTarget)}
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
                        sizes="(max-width: 900px) 100vw, 720px"
                        className="strip__media"
                        data-fit={p.coverFit ?? "cover"}
                      />
                    ) : (
                      <span className="strip__placeholder">
                        In development &nbsp;—&nbsp; {p.year}
                      </span>
                    )}
                  </div>

                  {/* View-project overlay — fades in on hover/focus,
                      arrow slides in with a short delay after the plate
                      backdrop settles. */}
                  <div className="strip__overlay" aria-hidden>
                    <span className="strip__overlay-text">View project</span>
                    <span className="strip__overlay-arrow">→</span>
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ol>

      <style>{`
        .strip {
          height: 100%;
          overflow-y: hidden;
          overflow-x: hidden;
          scrollbar-width: none;
          -ms-overflow-style: none;
          scroll-behavior: auto;
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
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0;
        }
        .strip__item { margin: 0; flex: 0 0 auto; }

        .strip__link { display: block; color: var(--ink); }

        .strip__plate {
          position: relative;
          width: 100%;
          background: color-mix(in oklab, var(--paper) 94%, var(--ink) 6%);
          overflow: hidden;
        }

        /* ── View-project overlay ────────────────────────────── */
        .strip__overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          z-index: 2;
          pointer-events: none;

          /* paper-tone backdrop so the mono text reads over any media */
          background: color-mix(in oklab, var(--paper) 68%, transparent);

          opacity: 0;
          transition: opacity 240ms var(--ease);

          font-family: var(--font-stack-mono);
          font-size: 11px;
          letter-spacing: 0.26em;
          text-transform: uppercase;
          color: var(--ink);
        }
        .strip__link:hover .strip__overlay,
        .strip__link:focus-visible .strip__overlay {
          opacity: 1;
        }

        .strip__overlay-text {
          /* text fades in first, slight upward drift */
          transform: translateY(4px);
          opacity: 0;
          transition:
            transform 280ms cubic-bezier(0.22, 1, 0.36, 1) 40ms,
            opacity  260ms var(--ease) 40ms;
        }
        .strip__link:hover .strip__overlay-text,
        .strip__link:focus-visible .strip__overlay-text {
          transform: translateY(0);
          opacity: 1;
        }

        .strip__overlay-arrow {
          /* arrow slides in a beat after the text */
          display: inline-block;
          transform: translateX(-6px);
          opacity: 0;
          transition:
            transform 340ms cubic-bezier(0.22, 1, 0.36, 1) 120ms,
            opacity  260ms var(--ease) 120ms;
        }
        .strip__link:hover .strip__overlay-arrow,
        .strip__link:focus-visible .strip__overlay-arrow {
          transform: translateX(0);
          opacity: 1;
        }

        @media (prefers-reduced-motion: reduce) {
          .strip__overlay,
          .strip__overlay-text,
          .strip__overlay-arrow {
            transition: none;
            transform: none;
          }
        }

        /* Matched to parallax factor 0.08 — no leak, no waste */
        .strip__media-wrap {
          position: absolute;
          top: -18%;
          left: 0;
          width: 100%;
          height: 136%;
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
