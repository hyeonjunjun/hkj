"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Piece } from "@/constants/pieces";
import LiveTime from "@/components/LiveTime";
import { CONTACT_EMAIL } from "@/constants/contact";

/**
 * HomeView — single-viewport OBYS-style microtypographic composition.
 *
 *   ┌─────────────────────────────────────────────────────────────────┐
 *   │  RYAN JUN®                              Work, About  EDT 14:32:18   Contact
 *   │
 *   │                            ┌──────────┐
 *   │                            │  cover   │       I'm Ryan Jun — a design
 *   │                            │  active  │       engineer working between
 *   │                            └──────────┘       interface and identity.
 *   │   La28                     ┌──────────┐
 *   │   Halo Halo!               │  cover   │       Contact:
 *   │ ▶ Sift                     │  next    │       rykjun@gmail.com
 *   │   Gyeol                    └──────────┘
 *   │
 *   │   Sift  ·  Mobile · AI · 2025  ·  03  ·  Concept, Engineering, Product
 *   │
 *   │   Vertical, Horizontal, Grid                       © 2026 Ryan Jun
 *   └─────────────────────────────────────────────────────────────────┘
 *
 * Layout grid (3 cols × 4 rows):
 *
 *   ┌───────────┬─────────────────┬───────────┐
 *   │ MARK         (spans cols 1-2)  │  TOP-NAV  │   row 1: top
 *   │           │                 │           │
 *   │ RAIL      │   IMAGE STACK   │  TEXT     │   row 2: middle (1fr — fills)
 *   │           │                 │           │
 *   ├───────────┴─────────────────┴───────────┤
 *   │  ACTIVE-ROW  (spans all 3)              │   row 3: active metadata
 *   ├───────────┬─────────────────┬───────────┤
 *   │ VIEW      │                 │ COLOPHON  │   row 4: bottom
 *   └───────────┴─────────────────┴───────────┘
 *
 * Every piece of text uses the microtype framework defined in
 * globals.css — no inline font definitions, no one-off sizes. The
 * compositional rhythm comes from grid placement; the typographic
 * rhythm comes from `.t-*` class composition.
 *
 * Single-viewport on any desktop ≥720px tall. The grid yields to a
 * stacked column on mobile (≤880px); the wordmark scales down via
 * `clamp` and the rail collapses below the image stack.
 */

type Props = { pieces: Piece[] };

export default function HomeView({ pieces }: Props) {
  const real = pieces.filter((p) => !p.placeholder);
  const [activeIdx, setActiveIdx] = useState(0);
  const active = real[activeIdx] ?? real[0];

  return (
    <main id="main" className="ob">
      {/* Top-left wordmark — t-monument scale, the page's anchor. */}
      <div className="ob__mark">
        <h1 className="t-monument">
          Ryan Jun<sup className="ob__reg" aria-hidden>®</sup>
        </h1>
      </div>

      {/* Top-right cluster — nav row, station-meta, studio paragraph,
          contact line. Stays in column 3 across rows 1-2. */}
      <aside className="ob__topright">
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

        <p className="t-prose ob__lede">
          I&apos;m Ryan Jun — a design engineer working between interface
          and identity systems. Small on purpose: one set of hands
          carrying the work from sketch to ship.
        </p>

        <div className="ob__contact">
          <p className="t-meta dim">Contact:</p>
          <a href={`mailto:${CONTACT_EMAIL}`} className="t-meta ob__email">
            {CONTACT_EMAIL}
          </a>
        </div>
      </aside>

      {/* Left rail — project list. Active piece is full ink, others
          are dimmer; on hover the row activates and the center column
          updates the highlighted cover + active metadata band updates
          its data. */}
      <ul className="ob__rail" role="list" aria-label="Catalog">
        {real.map((piece, i) => {
          const isActive = i === activeIdx;
          return (
            <li
              key={piece.slug}
              className="ob__rail-item"
              data-active={isActive ? "" : undefined}
              onMouseEnter={() => setActiveIdx(i)}
              onFocus={() => setActiveIdx(i)}
            >
              <Link
                href={`/work/${piece.slug}`}
                className={`ob__rail-link ${isActive ? "" : "dim"}`}
              >
                <span className="ob__rail-marker" aria-hidden>
                  {isActive ? "▶" : ""}
                </span>
                <span className="t-row">{piece.title}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Center column — image stack. All covers shown vertically,
          the active one full-bright; siblings dim. The stack is the
          page's only imagery. */}
      <div className="ob__stack" aria-hidden>
        {real.map((piece, i) => {
          const isActive = i === activeIdx;
          return (
            <div
              key={piece.slug}
              className="ob__stack-cell"
              data-active={isActive ? "" : undefined}
              onMouseEnter={() => setActiveIdx(i)}
            >
              {piece.cover?.kind === "video" ? (
                <video
                  className="ob__stack-media"
                  src={piece.cover.src}
                  poster={piece.cover.poster}
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              ) : piece.cover?.kind === "image" ? (
                <Image
                  className="ob__stack-media"
                  src={piece.cover.src}
                  alt={piece.title}
                  fill
                  sizes="(max-width: 880px) 80vw, 28vw"
                  priority={i === 0}
                />
              ) : null}
            </div>
          );
        })}
      </div>

      {/* Active metadata band — full-width row showing the active
          piece's title, sector, code, services. Microtype, dot-
          separated, mono caps for code, sentence case for title. */}
      <div className="ob__active" aria-live="polite">
        <span className="t-row">{active.title}</span>
        <span className="t-sep">·</span>
        <span className="t-meta">{active.sector}</span>
        <span className="t-sep">·</span>
        <span className="t-code">{active.number}</span>
        <span className="t-sep">·</span>
        <span className="t-meta tabular">{active.year}</span>
      </div>

      {/* Bottom-left view toggle. Vertical is active by default;
          horizontal/grid are reserved as future view modes. */}
      <div className="ob__view">
        <span className="t-meta" data-active="">Vertical</span>
        <span className="t-meta dimmer" aria-hidden>,</span>
        <span className="t-meta dim">Horizontal</span>
        <span className="t-meta dimmer" aria-hidden>,</span>
        <span className="t-meta dim">Grid</span>
      </div>

      {/* Bottom-right colophon. */}
      <p className="ob__colophon t-footnote">
        All rights reserved. © 2026 Ryan Jun
      </p>

      <style>{`
        @keyframes pagefadein { from { opacity: 0; } to { opacity: 1; } }

        /* ── Page grid ────────────────────────────────────────────
           Single-viewport composition. Three columns × four rows.
           Middle row (1fr) absorbs spare height; rest are content-
           sized. Padding generous on top, tighter on bottom so the
           wordmark feels seated at the page's edge. */
        .ob {
          animation: pagefadein 220ms ease;
          display: grid;
          grid-template-columns:
            minmax(180px, 1.1fr)
            minmax(0, 2.4fr)
            minmax(220px, 1.2fr);
          grid-template-rows: auto 1fr auto auto;
          column-gap: clamp(24px, 4vw, 56px);
          row-gap: clamp(20px, 3vw, 32px);
          min-height: 100dvh;
          padding: clamp(20px, 2.4vw, 32px) clamp(24px, 4vw, 56px) clamp(16px, 2vw, 24px);
        }
        @media (prefers-reduced-motion: reduce) {
          .ob { animation: none; }
        }

        /* ── Wordmark ──────────────────────────────────────────────
           Spans cols 1-2 of row 1. Aligned to the page's top-left.
           The ® is a small superscript at the top-right of the mark.
           Letter-spacing is tighter than t-monument's default for
           the optical effect of caps at this scale. */
        .ob__mark {
          grid-column: 1 / span 2;
          grid-row: 1;
          align-self: start;
          line-height: 1;
        }
        .ob__mark .t-monument {
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

        /* ── Top-right cluster ─────────────────────────────────────
           Spans column 3, rows 1-2. Inside is a small grid: nav row,
           lede paragraph, contact. */
        .ob__topright {
          grid-column: 3;
          grid-row: 1 / span 2;
          display: grid;
          grid-template-rows: auto auto auto;
          row-gap: clamp(18px, 2.2vw, 28px);
          align-self: start;
          padding-top: 4px;
        }

        .ob__nav {
          display: inline-flex;
          align-items: baseline;
          gap: 6px;
          flex-wrap: wrap;
        }
        .ob__nav-link {
          color: var(--ink);
          text-decoration: none;
          background-image: linear-gradient(currentColor, currentColor);
          background-size: 0% 1px;
          background-position: 0 100%;
          background-repeat: no-repeat;
          transition: background-size 200ms var(--ease);
        }
        .ob__nav-link[data-active] {
          background-size: 100% 1px;
        }
        .ob__nav-link:hover {
          background-size: 100% 1px;
        }
        .ob__nav-time {
          margin-left: auto;
          padding-left: 12px;
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

        /* ── Left rail ─────────────────────────────────────────────
           Column 1, row 2. Project list aligned to the BOTTOM of the
           cell so it sits adjacent to the active-row band below.
           Gap between items is tight — Aino-style row density. */
        .ob__rail {
          grid-column: 1;
          grid-row: 2;
          align-self: end;
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .ob__rail-item {
          display: block;
        }
        .ob__rail-link {
          display: inline-grid;
          grid-template-columns: 14px auto;
          gap: 6px;
          align-items: baseline;
          color: var(--ink);
          transition: color 160ms var(--ease);
        }
        .ob__rail-link.dim { color: var(--ink-3); }
        .ob__rail-link:hover { color: var(--ink); }
        .ob__rail-marker {
          font-family: var(--font-stack-mono);
          font-size: 10px;
          line-height: 1;
          color: var(--accent);
          opacity: 0;
          transition: opacity 160ms var(--ease);
        }
        .ob__rail-item[data-active] .ob__rail-marker {
          opacity: 1;
        }

        /* ── Center stack ──────────────────────────────────────────
           Column 2, row 2. Vertically-stacked covers, all visible.
           Active cover is full brightness; siblings dim to 0.4. The
           stack is the page's only imagery — there is no separate
           hero image. Each cell is 3:4 aspect, narrow column. */
        .ob__stack {
          grid-column: 2;
          grid-row: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: clamp(8px, 1vw, 14px);
          min-height: 0;
          /* Stack reads as a vertical "spine" of covers. Width and
             aspect are tuned so all four real pieces fit inside the
             1fr middle row at 720px+ viewport heights without forcing
             scroll. Square (1:1) is the neutral aspect — works for
             LA28 video, Sift portrait, Halo packaging, Gyeol render. */
          width: 100%;
          max-width: clamp(140px, 18vw, 220px);
          margin-inline: auto;
        }
        .ob__stack-cell {
          position: relative;
          width: 100%;
          aspect-ratio: 1 / 1;
          background: var(--paper-2);
          overflow: hidden;
          opacity: 0.32;
          filter: grayscale(0.6) brightness(0.7);
          transition: opacity 220ms var(--ease), filter 220ms var(--ease),
                      transform 240ms var(--ease);
          cursor: pointer;
        }
        /* Active cover scales up slightly — visual hierarchy without
           changing layout flow. The siblings step down, creating the
           "spine with featured center" gesture. */
        .ob__stack-cell[data-active] {
          opacity: 1;
          filter: grayscale(0) brightness(1);
          transform: scale(1.18);
          z-index: 1;
        }
        .ob__stack-media {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* ── Active row ────────────────────────────────────────────
           Spans all 3 columns, row 3. Single line of dot-separated
           microtype showing the active piece's title + sector + code
           + year. Sits as a band between the stack and the bottom row. */
        .ob__active {
          grid-column: 1 / -1;
          grid-row: 3;
          display: flex;
          align-items: baseline;
          gap: 10px;
          flex-wrap: wrap;
          padding-top: clamp(12px, 1.6vw, 20px);
          border-top: 1px solid var(--ink-hair);
        }

        /* ── Bottom row ────────────────────────────────────────────
           View toggle col 1, colophon col 3, row 4. Microtype, both
           dim. The toggle's active option is full ink; others are
           --ink-3. */
        .ob__view {
          grid-column: 1;
          grid-row: 4;
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

        .ob__colophon {
          grid-column: 3;
          grid-row: 4;
          justify-self: end;
          margin: 0;
        }

        /* ── Responsive ────────────────────────────────────────────
           1100px: text column tightens; gap closes.
           880px: 3-col grid collapses to single column. Wordmark
                  scales via clamp; topright moves under wordmark;
                  rail moves under stack.
           600px: tightened paddings, reflowed rail. */
        @media (max-width: 1280px) {
          .ob {
            grid-template-columns:
              minmax(160px, 1fr)
              minmax(0, 2fr)
              minmax(200px, 1fr);
          }
        }
        @media (max-width: 1024px) {
          .ob {
            grid-template-columns: 1fr 1.4fr 1fr;
          }
          .ob__lede { max-width: 28ch; }
        }
        @media (max-width: 880px) {
          .ob {
            grid-template-columns: 1fr;
            grid-template-rows: auto auto auto auto auto auto;
            row-gap: clamp(20px, 4vw, 32px);
          }
          .ob__mark        { grid-column: 1; grid-row: 1; }
          .ob__topright    { grid-column: 1; grid-row: 2; }
          .ob__stack       { grid-column: 1; grid-row: 3; max-width: 280px; }
          .ob__rail        { grid-column: 1; grid-row: 4; align-self: start; }
          .ob__active      { grid-column: 1; grid-row: 5; }
          .ob__view        { grid-column: 1; grid-row: 6; }
          .ob__colophon    { grid-column: 1; grid-row: 6; justify-self: end; }

          .ob__nav-time {
            margin-left: 0;
            padding-left: 0;
          }
        }
        @media (max-width: 600px) {
          .ob {
            padding: 16px 20px;
          }
          .ob__view {
            grid-column: 1; grid-row: 6;
          }
          .ob__colophon {
            grid-column: 1; grid-row: 7;
            justify-self: start;
            margin-top: 8px;
          }
        }
      `}</style>
    </main>
  );
}
