"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Piece } from "@/constants/pieces";
import LiveTime from "@/components/LiveTime";
import { CONTACT_EMAIL } from "@/constants/contact";

/**
 * HomeView — single-section locked-viewport carousel.
 *
 * The body is locked to 100dvh with overflow hidden. The page does not
 * scroll. Wheel / trackpad / arrow / hover events change the active
 * project; the center stage crossfades between covers; the active
 * metadata band updates inline.
 *
 * Pattern lifted from obys.agency (`max-h-screen overflow-hidden`,
 * `h-[11vh]` per rail item, `mix-blend-difference` custom cursor) and
 * cathydolle.com (vertical ListSlider with wheel-driven activation).
 *
 * Layout grid (3 cols × 3 rows):
 *
 *   ┌─ MARK ───────────────────────────── NAV · TIME · MAIL ─┐
 *   │                                                         │
 *   │  ▶ rail item    [   single full-stage cover   ]   aside │
 *   │    rail item                                       lede │
 *   │    rail item                                       mail │
 *   │    rail item                                            │
 *   │                                                         │
 *   ├─ VIEW ──── active title · sector · code · yr ── COPYR ─┤
 *   └─────────────────────────────────────────────────────────┘
 *
 * Three carousel triggers (each adjusts activeIdx by ±1):
 *   - mouseenter on a rail item / stage cell → set absolute index
 *   - wheel / trackpad gesture (debounced 600ms)
 *   - ArrowUp / ArrowDown
 *
 * The custom cursor is a 10×10 hollow square at z-index 9999 with
 * mix-blend-mode: difference — sits white on dark surfaces, dark on
 * light ones. Single signature interaction. Hidden on touch devices.
 */

const WHEEL_DEBOUNCE_MS = 620;

type Props = { pieces: Piece[] };

export default function HomeView({ pieces }: Props) {
  const real = pieces.filter((p) => !p.placeholder);
  const [activeIdx, setActiveIdx] = useState(0);
  const lastWheelAt = useRef(0);
  const cursorRef = useRef<HTMLDivElement | null>(null);

  const goTo = (idx: number) => {
    const next = Math.max(0, Math.min(real.length - 1, idx));
    setActiveIdx(next);
  };

  // Wheel-driven carousel — debounced so trackpad inertia doesn't
  // skip multiple cards in one gesture. Each gesture moves ±1.
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < 4) return;
      const now = Date.now();
      if (now - lastWheelAt.current < WHEEL_DEBOUNCE_MS) {
        e.preventDefault();
        return;
      }
      lastWheelAt.current = now;
      e.preventDefault();
      goTo(activeIdx + (e.deltaY > 0 ? 1 : -1));
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [activeIdx, real.length]);

  // Keyboard — Up/Down arrows. Accessibility + power-user.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        goTo(activeIdx + 1);
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        goTo(activeIdx - 1);
      } else if (e.key === "Home") {
        goTo(0);
      } else if (e.key === "End") {
        goTo(real.length - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIdx, real.length]);

  // Custom cursor — fixed div tracked to mouse via translate. Hidden
  // when finger-pointer is detected (touch device).
  useEffect(() => {
    if (typeof window === "undefined") return;
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    if (isCoarse) return;

    let raf = 0;
    let x = 0;
    let y = 0;
    const onMove = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        if (cursorRef.current) {
          cursorRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
          cursorRef.current.style.opacity = "1";
        }
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const active = real[activeIdx];

  return (
    <main id="main" className="ob">
      {/* ── Top: wordmark + nav + time + email ──────────── */}
      <header className="ob__top">
        <h1 className="t-monument ob__mark">
          Ryan Jun<sup className="ob__reg" aria-hidden>®</sup>
        </h1>
        <nav className="ob__nav" aria-label="Primary">
          <Link href="/work" className="t-meta ob__nav-link" data-active="">
            Work
          </Link>
          <span className="t-meta dimmer" aria-hidden>,</span>
          <Link href="/studio" className="t-meta ob__nav-link">
            About
          </Link>
          <span className="t-meta tabular live ob__nav-time">
            EDT <LiveTime />
          </span>
          <Link href="/contact" className="t-meta ob__nav-link">
            Contact
          </Link>
        </nav>
      </header>

      {/* ── Middle: rail | stage | aside ────────────────── */}
      <section className="ob__main">
        <ul className="ob__rail" role="list" aria-label="Catalog">
          {real.map((piece, i) => {
            const isActive = i === activeIdx;
            return (
              <li
                key={piece.slug}
                className="ob__rail-item"
                data-active={isActive ? "" : undefined}
                onMouseEnter={() => goTo(i)}
                onFocus={() => goTo(i)}
              >
                <Link
                  href={`/work/${piece.slug}`}
                  className="ob__rail-link"
                >
                  <span className="ob__rail-marker" aria-hidden>
                    ▶
                  </span>
                  <span className="t-row">{piece.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="ob__stage" aria-hidden>
          {real.map((piece, i) => {
            const isActive = i === activeIdx;
            return (
              <div
                key={piece.slug}
                className="ob__cover"
                data-active={isActive ? "" : undefined}
              >
                {piece.cover?.kind === "video" ? (
                  <video
                    className="ob__cover-media"
                    src={piece.cover.src}
                    poster={piece.cover.poster}
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                ) : piece.cover?.kind === "image" ? (
                  <Image
                    className="ob__cover-media"
                    src={piece.cover.src}
                    alt={piece.title}
                    fill
                    sizes="(max-width: 880px) 80vw, 50vw"
                    priority={i === 0}
                  />
                ) : null}
              </div>
            );
          })}
        </div>

        <aside className="ob__aside">
          <p className="t-prose ob__lede">
            I&apos;m Ryan Jun — a design engineer working between
            interface and identity systems. Small on purpose: one set
            of hands carrying the work from sketch to ship.
          </p>
          <div className="ob__contact">
            <p className="t-meta dim">Contact:</p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="t-meta ob__email"
            >
              {CONTACT_EMAIL}
            </a>
          </div>
        </aside>
      </section>

      {/* ── Bottom: view toggle | active metadata | colophon ── */}
      <footer className="ob__bottom">
        <div className="ob__view">
          <span className="t-meta" data-active="">
            Vertical
          </span>
          <span className="t-meta dimmer" aria-hidden>,</span>
          <span className="t-meta dim">Horizontal</span>
          <span className="t-meta dimmer" aria-hidden>,</span>
          <span className="t-meta dim">Grid</span>
        </div>

        <div className="ob__active" aria-live="polite">
          <span className="t-row">{active.title}</span>
          <span className="t-sep">·</span>
          <span className="t-meta">{active.sector}</span>
          <span className="t-sep">·</span>
          <span className="t-code">{active.number}</span>
          <span className="t-sep">·</span>
          <span className="t-meta tabular">{active.year}</span>
        </div>

        <p className="ob__colophon t-footnote">
          All rights reserved. © 2026 Ryan Jun
        </p>
      </footer>

      {/* ── Custom cursor — mix-blend-difference square ──── */}
      <div ref={cursorRef} className="ob__cursor" aria-hidden />

      <style>{`
        @keyframes pagefadein { from { opacity: 0; } to { opacity: 1; } }

        /* The page locks to viewport. Body itself is allowed to scroll
           on mobile (≤880px) where the layout reflows; on desktop the
           wheel handler takes over and the page is fixed. */
        html, body {
          overscroll-behavior: none;
        }

        .ob {
          animation: pagefadein 220ms ease;
          height: 100dvh;
          width: 100%;
          overflow: hidden;
          display: grid;
          grid-template-columns:
            minmax(180px, 1.1fr)
            minmax(0, 2.4fr)
            minmax(220px, 1.2fr);
          grid-template-rows: auto 1fr auto;
          column-gap: clamp(20px, 3vw, 48px);
          row-gap: clamp(14px, 1.6vw, 22px);
          padding: clamp(16px, 2vw, 28px) clamp(20px, 3vw, 48px) clamp(14px, 1.8vw, 22px);
        }
        @media (prefers-reduced-motion: reduce) {
          .ob { animation: none; }
        }

        /* ── Top row ────────────────────────────────────────────
           Wordmark spans cols 1-2 left, nav cluster right. */
        .ob__top {
          grid-column: 1 / -1;
          grid-row: 1;
          display: grid;
          grid-template-columns: subgrid;
          align-items: start;
          column-gap: inherit;
        }
        .ob__mark {
          grid-column: 1 / span 2;
          line-height: 0.92;
          letter-spacing: -0.045em;
        }
        .ob__reg {
          font-size: 0.18em;
          vertical-align: top;
          margin-left: 0.08em;
          font-weight: 400;
          letter-spacing: 0.04em;
          color: var(--ink-3);
        }
        .ob__nav {
          grid-column: 3;
          display: inline-flex;
          align-items: baseline;
          gap: 6px;
          flex-wrap: wrap;
          justify-self: start;
          padding-top: 4px;
        }
        .ob__nav-link {
          color: var(--ink);
          background-image: linear-gradient(currentColor, currentColor);
          background-size: 0% 1px;
          background-position: 0 100%;
          background-repeat: no-repeat;
          transition: background-size 200ms var(--ease);
        }
        .ob__nav-link[data-active],
        .ob__nav-link:hover {
          background-size: 100% 1px;
        }
        .ob__nav-time {
          padding: 0 6px;
        }

        /* ── Middle row ────────────────────────────────────────
           Three columns: rail | stage | aside. The stage is the
           hero — a single full-bleed cover that crossfades on
           active change. The rail is OBYS-style equal-height
           items spread across the available height. */
        .ob__main {
          grid-column: 1 / -1;
          grid-row: 2;
          display: grid;
          grid-template-columns: subgrid;
          align-items: stretch;
          column-gap: inherit;
          min-height: 0;
        }

        .ob__rail {
          grid-column: 1;
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: flex-start;
          min-height: 0;
        }
        .ob__rail-item {
          display: block;
          padding: clamp(6px, 1vh, 14px) 0;
        }
        .ob__rail-link {
          display: inline-grid;
          grid-template-columns: 14px auto;
          gap: 6px;
          align-items: baseline;
          color: var(--ink-3);
          transition: color 180ms var(--ease);
        }
        .ob__rail-item[data-active] .ob__rail-link {
          color: var(--ink);
        }
        .ob__rail-marker {
          font-family: var(--font-stack-mono);
          font-size: 9px;
          line-height: 1;
          color: var(--accent);
          opacity: 0;
          transform: translateX(-2px);
          transition: opacity 180ms var(--ease), transform 180ms var(--ease);
        }
        .ob__rail-item[data-active] .ob__rail-marker {
          opacity: 1;
          transform: translateX(0);
        }

        /* The stage. All covers stacked absolutely; only active is
           opacity 1. Crossfade duration matches wheel debounce so
           gestures feel synchronous with the visual. */
        .ob__stage {
          grid-column: 2;
          position: relative;
          width: 100%;
          height: 100%;
          min-height: 0;
          background: transparent;
        }
        .ob__cover {
          position: absolute;
          inset: 0;
          opacity: 0;
          transition: opacity 480ms var(--ease);
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        }
        .ob__cover[data-active] {
          opacity: 1;
          pointer-events: auto;
        }
        .ob__cover-media {
          /* Inset slightly from the cell edge so the stage feels
             like a "frame" rather than full-bleed. The covers
             retain their aspect via object-fit: contain — covers
             of different aspects don't get cropped, they sit
             centered in the stage. */
          position: absolute !important;
          inset: 0;
          width: 100% !important;
          height: 100% !important;
          object-fit: contain;
        }

        .ob__aside {
          grid-column: 3;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: flex-start;
          min-height: 0;
          padding-top: 4px;
        }
        .ob__lede {
          color: var(--ink-2);
          max-width: 32ch;
        }
        .ob__contact {
          display: grid;
          row-gap: 4px;
        }
        .ob__email {
          color: var(--ink);
          background-image: linear-gradient(currentColor, currentColor);
          background-size: 0% 1px;
          background-position: 0 100%;
          background-repeat: no-repeat;
          transition: background-size 200ms var(--ease);
          width: max-content;
        }
        .ob__email:hover { background-size: 100% 1px; }

        /* ── Bottom row ────────────────────────────────────────
           View toggle col 1, active band col 2, colophon col 3. */
        .ob__bottom {
          grid-column: 1 / -1;
          grid-row: 3;
          display: grid;
          grid-template-columns: subgrid;
          align-items: baseline;
          column-gap: inherit;
          padding-top: clamp(8px, 1.2vw, 14px);
          border-top: 1px solid var(--ink-hair);
        }
        .ob__view {
          grid-column: 1;
          display: inline-flex;
          align-items: baseline;
          gap: 6px;
        }
        .ob__view .t-meta[data-active] {
          color: var(--ink);
          background-image: linear-gradient(currentColor, currentColor);
          background-size: 100% 1px;
          background-position: 0 100%;
          background-repeat: no-repeat;
        }
        .ob__active {
          grid-column: 2;
          display: flex;
          align-items: baseline;
          gap: 8px;
          flex-wrap: wrap;
          justify-self: start;
        }
        .ob__colophon {
          grid-column: 3;
          margin: 0;
          justify-self: end;
        }

        /* ── Custom cursor ──────────────────────────────────────
           10×10 hollow square. mix-blend-mode: difference inverts
           against whatever's behind — white on dark, dark on light.
           The square reads more "engineering" than a circle would. */
        .ob__cursor {
          position: fixed;
          top: 0;
          left: 0;
          width: 10px;
          height: 10px;
          margin-left: -5px;
          margin-top: -5px;
          border: 1px solid #ffffff;
          background: transparent;
          pointer-events: none;
          z-index: 9999;
          mix-blend-mode: difference;
          opacity: 0;
          transition: opacity 200ms var(--ease);
          will-change: transform;
        }
        @media (pointer: coarse) {
          .ob__cursor { display: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ob__cursor { display: none; }
        }

        /* ── Responsive ────────────────────────────────────────
           1280: tighter column ratios.
           1024: smaller aside, lede shrinks.
           880: page becomes scrollable; carousel collapses to a
                stacked column where each piece is shown in turn,
                rail moves above stage.
           600: wordmark scales down; aside moves under stage. */
        @media (max-width: 1280px) {
          .ob {
            grid-template-columns:
              minmax(160px, 1fr)
              minmax(0, 2fr)
              minmax(200px, 1fr);
          }
        }
        @media (max-width: 1024px) {
          .ob__lede { max-width: 26ch; }
        }
        @media (max-width: 880px) {
          /* Below 880, kill the wheel-jacking and reflow to a
             stacked layout with body scroll. The carousel is a
             desktop affordance; mobile gets a clean linear list. */
          html, body { overscroll-behavior: auto; }
          .ob {
            height: auto;
            min-height: 100dvh;
            overflow: visible;
            grid-template-columns: 1fr;
            grid-template-rows: auto auto auto auto auto;
            row-gap: clamp(20px, 4vw, 32px);
          }
          .ob__top { grid-template-columns: 1fr; row-gap: 12px; }
          .ob__mark { grid-column: 1; }
          .ob__nav { grid-column: 1; padding-top: 0; }
          .ob__main { grid-template-columns: 1fr; row-gap: 24px; }
          .ob__rail { grid-column: 1; }
          .ob__stage { grid-column: 1; aspect-ratio: 4 / 3; height: auto; }
          .ob__aside { grid-column: 1; }
          .ob__bottom { grid-template-columns: 1fr; row-gap: 12px; }
          .ob__view, .ob__active, .ob__colophon { grid-column: 1; justify-self: start; }
        }
        @media (max-width: 600px) {
          .ob {
            padding: 14px 18px;
          }
        }
      `}</style>
    </main>
  );
}
