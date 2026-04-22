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
 * GutterStrip — a wheel-driven snap carousel of project media.
 *
 * One wheel tick = one project. Each transition animates for ~900ms
 * with a cubic ease-in-out (the "heavy" feel). Parallax is applied
 * per-frame during animation. Content is tripled so the active
 * project is always sourced from the middle set; after each
 * transition settles, we teleport the scroll position back to the
 * middle-set equivalent so the loop is infinite and seamless.
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

  // DOM index within the tripled list; start at first item of middle set
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

  // Initial seek to middle set + initial active announce
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

  // Wheel interception — one tick, one project
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
        {tripled.map((p, i) => (
          <li
            key={`${p.slug}-${i}`}
            className="strip__item"
            style={{ width: `${p.coverWidth ?? 100}%` }}
          >
            <Link
              href={`/work/${p.slug}`}
              className="strip__link"
              data-cursor-label="OPEN PROJECT"
              aria-hidden={i < pieceCount || i >= pieceCount * 2 ? "true" : undefined}
              tabIndex={i < pieceCount || i >= pieceCount * 2 ? -1 : undefined}
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
                  ) : p.placeholderAscii ? (
                    <pre className="strip__ascii" aria-hidden>
                      {p.placeholderAscii}
                    </pre>
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
          overflow-y: hidden;
          overflow-x: hidden;
          scrollbar-width: none;
          -ms-overflow-style: none;
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

        /* Oversized so parallax at its extreme brings the media's natural
           top/bottom edge exactly to the frame border — no leak, no waste.
           Matched to parallax factor 0.08: ~18% headroom each side. */
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

        .strip__ascii {
          position: absolute;
          inset: 0;
          display: grid;
          place-items: center;
          font-family: var(--font-stack-mono);
          font-size: clamp(8px, 0.9vw, 12px);
          line-height: 1.15;
          letter-spacing: 0;
          color: var(--ink-2);
          opacity: 0.78;
          margin: 0;
          padding: 8%;
          white-space: pre;
          text-align: center;
        }

        @media (prefers-reduced-motion: reduce) {
          .strip__media-wrap { transform: none !important; }
        }
      `}</style>
    </div>
  );
}
