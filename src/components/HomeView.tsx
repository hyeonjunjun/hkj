"use client";

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import type { Piece } from "@/constants/pieces";
import LiveTime from "@/components/LiveTime";
import { CONTACT_EMAIL } from "@/constants/contact";

/**
 * HomeView — single-section locked-viewport carousel, OBYS-line.
 *
 * Filmstrip (not crossfade): all covers stacked in a vertical strip
 * inside the center stage; the strip translates so the active cover's
 * center sits at the stage's vertical center. Adjacent covers peek
 * above and below — fades to transparent at the stage edges. Big
 * (   ) brackets flank the stage as the OBYS active-frame signature.
 *
 * Layout (single screen, locked to 100dvh):
 *
 *   ┌─ MARK ───────────── peek ─── NAV · TIME · MAIL ────────────┐
 *   │                                                              │
 *   │              [   peek of prev cover   ]                      │
 *   │ rail (    [          ACTIVE           ]    aside lede        │
 *   │  items     [    peek of next cover    ]      mail            │
 *   │              [   peek of next-1       ]                      │
 *   │                                                              │
 *   ├─ VIEW ── active title · sector · code · yr ───── COPYR ─────┤
 *   └──────────────────────────────────────────────────────────────┘
 *
 * Wheel / arrow / hover advances activeIdx (debounced 620ms). The
 * filmstrip's translateY is computed via CSS calc with --idx and --n
 * custom properties so the active cover's center always sits at the
 * stage's center.
 *
 * 8 pieces total: 4 shipped + 4 untitled placeholders. Placeholders
 * render with an empty hairline frame instead of a cover image; the
 * rail entry still exists so the catalog reads at full length.
 *
 * Smaller text + tighter rail spacing vs. the prior pass — the
 * compactness comes from rail items at fixed line-height (no flex
 * spread) and reduced clamp ranges on the wordmark.
 */

const WHEEL_DEBOUNCE_MS = 620;

type Props = { pieces: Piece[] };

export default function HomeView({ pieces }: Props) {
  // Show ALL pieces, including placeholders. Placeholders render as
  // empty frames in the stage; rail entries exist either way.
  const all = pieces.slice().sort((a, b) => a.order - b.order);
  const [activeIdx, setActiveIdx] = useState(0);
  const lastWheelAt = useRef(0);
  const cursorRef = useRef<HTMLDivElement | null>(null);

  const goTo = (idx: number) => {
    const next = Math.max(0, Math.min(all.length - 1, idx));
    setActiveIdx(next);
  };

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
  }, [activeIdx, all.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        goTo(activeIdx + 1);
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        goTo(activeIdx - 1);
      } else if (e.key === "Home") goTo(0);
      else if (e.key === "End") goTo(all.length - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIdx, all.length]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
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

  const active = all[activeIdx];

  return (
    <main id="main" className="ob">
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
          <span className="t-meta tabular ob__nav-time">
            EDT <LiveTime />
          </span>
          <Link href="/contact" className="t-meta ob__nav-link">
            Contact
          </Link>
        </nav>
      </header>

      <section className="ob__main">
        <ul className="ob__rail" role="list" aria-label="Catalog">
          {all.map((piece, i) => {
            const isActive = i === activeIdx;
            const isPlaceholder = piece.placeholder;
            return (
              <li
                key={piece.slug}
                className="ob__rail-item"
                data-active={isActive ? "" : undefined}
                onMouseEnter={() => goTo(i)}
                onFocus={() => goTo(i)}
              >
                <Link
                  href={isPlaceholder ? "#" : `/work/${piece.slug}`}
                  className="ob__rail-link"
                  data-disabled={isPlaceholder ? "" : undefined}
                  onClick={(e) => {
                    if (isPlaceholder) e.preventDefault();
                  }}
                >
                  <span className="ob__rail-marker" aria-hidden>▶</span>
                  <span className="ob__rail-title">{piece.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Stage — filmstrip of all covers, brackets flanking. */}
        <div className="ob__stage">
          <span className="ob__bracket ob__bracket--left" aria-hidden>(</span>
          <div
            className="ob__strip"
            style={
              {
                "--idx": activeIdx,
                "--n": all.length,
              } as CSSProperties
            }
            aria-hidden
          >
            {all.map((piece, i) => {
              const isActive = i === activeIdx;
              return (
                <div
                  key={piece.slug}
                  className="ob__cover"
                  data-active={isActive ? "" : undefined}
                  onMouseEnter={() => goTo(i)}
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
                      /* preload=metadata limits the bandwidth on
                         dev-server HMR double-mounts (which trigger
                         the net::ERR_ABORTED artifact). In production
                         autoPlay is unaffected. */
                      preload="metadata"
                    />
                  ) : piece.cover?.kind === "image" ? (
                    <Image
                      className="ob__cover-media"
                      src={piece.cover.src}
                      alt={piece.title}
                      fill
                      sizes="(max-width: 880px) 80vw, 30vw"
                      /* Priority on the first three image covers so
                         whichever lands as LCP (depends on which is
                         the active when the page renders) gets the
                         eager-load. Beyond i=2, lazy-load is fine. */
                      priority={i <= 2}
                    />
                  ) : (
                    <div className="ob__cover-placeholder">
                      <span className="t-caption dimmer">In development</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <span className="ob__bracket ob__bracket--right" aria-hidden>)</span>
        </div>

        <aside className="ob__aside">
          {/* Intro — lede + contact bonded as one unit. The "who I
              am + how to reach me" block sits at the top of the
              aside; the project details below are pushed to the
              vertical center via grid placement. */}
          <div className="ob__intro">
            <p className="t-prose ob__lede">
              old soul
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
          </div>

          {/* Active project — sits in row 2 of the grid, align-self
              center, with a minimum padding-top so it never crowds
              the intro on shorter viewports. */}
          <div className="ob__active" aria-live="polite">
            <span className="ob__active-title">{active.title}</span>
            <span className="ob__active-meta">
              <span>{active.sector}</span>
              <span className="t-sep">·</span>
              <span className="t-code">{active.number}</span>
              <span className="t-sep">·</span>
              <span className="tabular">{active.year}</span>
              {active.status === "wip" && (
                <>
                  <span className="t-sep">·</span>
                  <span>Live</span>
                </>
              )}
            </span>
          </div>
        </aside>
      </section>

      <footer className="ob__bottom">
        <div className="ob__view">
          <span className="t-meta" data-active="">Vertical</span>
          <span className="t-meta dimmer" aria-hidden>,</span>
          <span className="t-meta dim">Grid</span>
        </div>

        <p className="ob__colophon t-footnote">
          All rights reserved. © 2026 Ryan Jun
        </p>
      </footer>

      <div ref={cursorRef} className="ob__cursor" aria-hidden />

      <style>{`
        @keyframes pagefadein { from { opacity: 0; } to { opacity: 1; } }

        html, body { overscroll-behavior: none; }

        .ob {
          animation: pagefadein 220ms ease;
          height: 100dvh;
          width: 100%;
          overflow: hidden;
          display: grid;
          grid-template-columns:
            minmax(160px, 1fr)
            minmax(0, 2.6fr)
            minmax(200px, 1.1fr);
          grid-template-rows: auto 1fr auto;
          column-gap: clamp(24px, 4vw, 64px);
          row-gap: clamp(10px, 1.4vw, 20px);
          padding: clamp(14px, 1.6vw, 22px) clamp(20px, 3vw, 48px);
        }
        @media (prefers-reduced-motion: reduce) { .ob { animation: none; } }

        /* ── Top row ───────────────────────────────────────────── */
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
          /* Wordmark size lives in --type-monument (globals.css).
             Local overrides only adjust line-height and tracking
             for the optical caps treatment. */
          line-height: 0.9;
          letter-spacing: -0.05em;
        }
        .ob__reg {
          font-size: 0.18em;
          vertical-align: top;
          margin-left: 0.06em;
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
          padding-top: 6px;
          font-size: 11px;
        }
        .ob__nav .t-meta { font-size: 11px; }
        .ob__nav-link {
          color: var(--ink);
          background-image: linear-gradient(currentColor, currentColor);
          background-size: 0% 1px;
          background-position: 0 100%;
          background-repeat: no-repeat;
          transition: background-size 200ms var(--ease);
        }
        .ob__nav-link[data-active],
        .ob__nav-link:hover { background-size: 100% 1px; }
        .ob__nav-time {
          padding: 0 6px;
          color: var(--ink);
        }

        /* ── Middle row ────────────────────────────────────────── */
        .ob__main {
          grid-column: 1 / -1;
          grid-row: 2;
          display: grid;
          grid-template-columns: subgrid;
          align-items: stretch;
          column-gap: inherit;
          min-height: 0;
        }

        /* Rail — tightly stacked items at fixed line-height. No flex
           spread; the list is a typeset block, not a distributed bar.
           Centered vertically in the column. */
        .ob__rail {
          grid-column: 1;
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          gap: 1px;
          min-height: 0;
        }
        .ob__rail-item {
          display: block;
          height: clamp(20px, 2.6vh, 26px);
        }
        .ob__rail-link {
          display: inline-grid;
          grid-template-columns: 12px auto;
          gap: 6px;
          align-items: center;
          height: 100%;
          font-family: var(--font-stack-mono);
          font-size: 12px;
          font-weight: 400;
          letter-spacing: -0.005em;
          color: var(--ink-3);
          transition: color 180ms var(--ease);
        }
        .ob__rail-link[data-disabled] {
          cursor: default;
        }
        .ob__rail-item[data-active] .ob__rail-link {
          color: var(--ink);
        }
        .ob__rail-marker {
          font-family: var(--font-stack-mono);
          font-size: 8px;
          line-height: 1;
          color: var(--ink);
          opacity: 0;
          transform: translateX(-2px);
          transition: opacity 180ms var(--ease), transform 180ms var(--ease);
        }
        .ob__rail-item[data-active] .ob__rail-marker {
          opacity: 1;
          transform: translateX(0);
        }
        .ob__rail-title {
          line-height: 1.2;
        }

        /* ── Stage (filmstrip + brackets) ──────────────────────── */
        .ob__stage {
          grid-column: 2;
          position: relative;
          width: 100%;
          height: 100%;
          min-height: 0;
          overflow: visible;
        }

        /* The strip: vertical column of all covers. Translated so the
           active cover's center sits at stage center. CSS calc reads
           --idx and --n custom props from inline style. Translate
           formula puts the active cover (index = idx) at the stage's
           vertical center. Transition is 600ms — slightly longer
           than the wheel debounce so a held gesture animates
           smoothly through. */
        .ob__strip {
          --cover-h: clamp(220px, 38vh, 340px);
          --cover-w: calc(var(--cover-h) * 0.78);
          --strip-gap: clamp(12px, 2vh, 24px);
          position: absolute;
          left: 50%;
          top: 50%;
          display: flex;
          flex-direction: column;
          gap: var(--strip-gap);
          width: var(--cover-w);
          transform: translate(
            -50%,
            calc(
              -50% - (var(--idx) - (var(--n) - 1) / 2)
                   * (var(--cover-h) + var(--strip-gap))
            )
          );
          transition: transform 600ms cubic-bezier(0.4, 0, 0.2, 1);
          will-change: transform;
        }
        .ob__cover {
          position: relative;
          flex: 0 0 auto;
          width: 100%;
          height: var(--cover-h, clamp(220px, 38vh, 340px));
          background: var(--paper-2);
          overflow: hidden;
          opacity: 0.32;
          filter: grayscale(0.6) brightness(0.78);
          transition: opacity 480ms var(--ease), filter 480ms var(--ease);
          cursor: pointer;
        }
        .ob__cover[data-active] {
          opacity: 1;
          filter: grayscale(0) brightness(1);
        }
        .ob__cover-media {
          position: absolute !important;
          inset: 0;
          width: 100% !important;
          height: 100% !important;
          object-fit: cover;
        }
        .ob__cover-placeholder {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: 1px solid var(--ink-hair);
        }

        /* Brackets — large mono "(  )" flanking the stage. They mark
           the active frame in the OBYS pattern. Sized via clamp
           proportional to viewport height; positioned just outside
           the strip's effective width. */
        .ob__bracket {
          position: absolute;
          top: 50%;
          font-family: var(--font-stack-mono);
          font-size: clamp(120px, 22vh, 220px);
          font-weight: 400;
          line-height: 0.85;
          color: var(--ink);
          pointer-events: none;
          transform: translateY(-50%);
          user-select: none;
          z-index: 2;
        }
        .ob__bracket--left {
          left: calc(50% - clamp(180px, 28vh, 280px));
        }
        .ob__bracket--right {
          left: auto;
          right: calc(50% - clamp(180px, 28vh, 280px));
        }

        /* ── Aside ─────────────────────────────────────────────── */
        /* Grid with two rows: intro group at top (auto), spacer
           row containing the active block centered (1fr). The
           active block has padding-top to guarantee a minimum gap
           from the intro on short viewports — when there's spare
           space, align-self: center pushes it toward the middle
           of the spacer. */
        .ob__aside {
          grid-column: 3;
          display: grid;
          grid-template-rows: auto 1fr;
          align-items: start;
          min-height: 0;
          padding-top: 6px;
        }

        /* Intro — lede + contact as one bonded unit. Tight inner
           gap between the paragraph and the contact line so they
           read as a single "who I am + how to reach me" block. */
        .ob__intro {
          grid-row: 1;
          display: flex;
          flex-direction: column;
          gap: clamp(12px, 1.6vh, 20px);
        }
        .ob__lede {
          color: var(--ink-2);
          font-size: clamp(11px, 0.85vw, 13px);
          line-height: 1.55;
          max-width: 30ch;
        }
        .ob__contact {
          display: grid;
          row-gap: 4px;
          width: 100%;
        }
        .ob__contact .t-meta { font-size: 10.5px; }

        /* Active project block — vertically centered in row 2 with
           a guaranteed minimum gap from the intro above. Title on
           its own line; meta wraps below in mono caps. */
        .ob__active {
          grid-row: 2;
          align-self: center;
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding-top: clamp(48px, 6vh, 96px);
          padding-bottom: clamp(24px, 4vh, 64px);
          width: 100%;
        }
        .ob__active-title {
          font-family: var(--font-stack-mono);
          font-size: clamp(13px, 0.9vw, 14px);
          font-weight: 500;
          letter-spacing: -0.005em;
          color: var(--ink);
          line-height: 1.2;
        }
        .ob__active-meta {
          font-family: var(--font-stack-mono);
          font-size: 10px;
          font-weight: 400;
          letter-spacing: 0.06em;
          line-height: 1.5;
          text-transform: uppercase;
          color: var(--ink-3);
          font-feature-settings: "tnum" on, "lnum" on;
          font-variant-numeric: tabular-nums lining-nums;
          display: flex;
          align-items: baseline;
          flex-wrap: wrap;
          gap: 6px;
        }
        .ob__active-meta .t-code {
          font-size: 10px;
        }
        .ob__email {
          color: var(--ink);
          font-size: 10.5px;
          background-image: linear-gradient(currentColor, currentColor);
          background-size: 0% 1px;
          background-position: 0 100%;
          background-repeat: no-repeat;
          transition: background-size 200ms var(--ease);
          width: max-content;
        }
        .ob__email:hover { background-size: 100% 1px; }

        /* ── Bottom row ────────────────────────────────────────── */
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
        .ob__view .t-meta { font-size: 10.5px; }
        .ob__view .t-meta[data-active] {
          color: var(--ink);
          background-image: linear-gradient(currentColor, currentColor);
          background-size: 100% 1px;
          background-position: 0 100%;
          background-repeat: no-repeat;
        }
        .ob__colophon {
          grid-column: 3;
          margin: 0;
          justify-self: end;
          font-size: 10px;
        }

        /* ── Cursor ────────────────────────────────────────────── */
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
        @media (pointer: coarse) { .ob__cursor { display: none; } }
        @media (prefers-reduced-motion: reduce) { .ob__cursor { display: none; } }

        /* ── Responsive ────────────────────────────────────────── */
        @media (max-width: 1280px) {
          .ob {
            grid-template-columns:
              minmax(140px, 0.9fr)
              minmax(0, 2.4fr)
              minmax(180px, 1fr);
          }
        }
        @media (max-width: 1024px) {
          .ob__lede { max-width: 24ch; font-size: 11px; }
          .ob__bracket { font-size: clamp(80px, 16vh, 160px); }
        }
        @media (max-width: 880px) {
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
          .ob__mark, .ob__nav { grid-column: 1; }
          .ob__nav { padding-top: 0; }
          .ob__main { grid-template-columns: 1fr; row-gap: 24px; }
          .ob__rail, .ob__stage, .ob__aside { grid-column: 1; }
          .ob__stage {
            aspect-ratio: 4 / 3;
            height: auto;
          }
          .ob__strip {
            --cover-h: clamp(180px, 50vw, 280px);
          }
          .ob__bracket { display: none; }
          .ob__bottom { grid-template-columns: 1fr; row-gap: 12px; }
          .ob__view, .ob__colophon {
            grid-column: 1;
            justify-self: start;
          }
        }
      `}</style>
    </main>
  );
}
