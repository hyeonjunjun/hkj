import Image from "next/image";
import Link from "next/link";
import type { Piece } from "@/constants/pieces";
import LiveTime from "@/components/LiveTime";

/**
 * HomeView — single-composition departure board.
 *
 *   ┌──────────────────────────────────────────────────────────┐
 *   │  Ryan Jun   design engineer · NYC   ryan@ryanjun.com →   │  Banner
 *   ├──────────────────────────────────────────────────────────┤
 *   │  [LA28]   [Halo Halo!]   [Gyeol]   [Sift]                │  Media strip
 *   ├──────────────────────────────────────────────────────────┤
 *   │  Time │ No │ Destination │ Sector │ Status                │  Column header
 *   │ ◆ Departures                                              │  Section label
 *   │  2026 │ 01 │ LA28        │ Brand  │ ◆ Live                │
 *   │ ● Arrivals                                                │
 *   │  2026 │ 02 │ Halo Halo!  │ Brand  │ ● 2026                │
 *   │  2026 │ 03 │ Gyeol: 結    │ Brand  │ ● 2026                │
 *   │  2025 │ 04 │ Sift        │ Mobile │ ● 2025                │
 *   ├──────────────────────────────────────────────────────────┤
 *   │  © 2026 Ryan Jun                ryan@ryanjun.com →       │  Footer
 *   └──────────────────────────────────────────────────────────┘
 *
 * Solari/split-flap reference, not periodic-table reference. Three
 * structural moves separate this from the prior Krantz pass:
 *
 *   1. Tabular ROWS, not square cells. Each project is one wide row
 *      with consistent columns (Time / No / Destination / Sector /
 *      Status) — the Solari board's grammar. Krantz used 4-line
 *      vertical cell stacks; we lay the same data flat.
 *
 *   2. DEPARTURES and ARRIVALS partition. Real boards split outbound
 *      vs inbound; we split in-progress vs shipped. Iconography and
 *      semantics borrow directly: ◆ for live/departing, ● for landed.
 *
 *   3. Media strip above the board, not interspersed in the grid.
 *      Cover thumbnails sit as their own row of equal-aspect tiles
 *      so the visual statement is one band, not scattered cells.
 *      Below it, the rows are pure text — board-faithful.
 *
 * Single-viewport at any desktop size ≥720px tall. Phone widths
 * collapse the column header and stack rows vertically.
 */

type Props = { pieces: Piece[] };

const STATUS_GLYPH = { shipped: "●", wip: "◆" } as const;

export default function HomeView({ pieces }: Props) {
  const real = pieces.filter((p) => !p.placeholder);
  const departures = real.filter((p) => p.status === "wip");
  const arrivals = real.filter((p) => p.status === "shipped");

  return (
    <main id="main" className="page">
      <header className="banner">
        <h1 className="banner__h1">Ryan Jun</h1>
        <span className="banner__role tabular">
          Design engineer
          <span className="banner__sep" aria-hidden> · </span>
          New York
          <span className="banner__sep" aria-hidden> · </span>
          <span className="banner__time">
            <LiveTime />
          </span>
          <span className="banner__edt"> EDT</span>
        </span>
        <a href="mailto:ryan@ryanjun.com" className="banner__cta">
          ryan@ryanjun.com →
        </a>
      </header>

      <section className="strip" aria-label="Cover plates">
        {real.map((piece) => (
          <Tile key={piece.slug} piece={piece} />
        ))}
      </section>

      <section className="board" aria-label="Schedule">
        <div className="board__cols" role="row" aria-hidden>
          <span className="col col--time">Time</span>
          <span className="col col--no">No</span>
          <span className="col col--dest">Destination</span>
          <span className="col col--sector">Sector</span>
          <span className="col col--status">Status</span>
        </div>

        <div className="board__section" data-kind="dep">
          <header className="section-bar">
            <span className="section-bar__icon" aria-hidden>◆</span>
            <span className="section-bar__label">Departures</span>
            <span className="section-bar__meta tabular">
              {String(departures.length).padStart(2, "0")} · LIVE
            </span>
          </header>
          {departures.map((piece, i) => (
            <DepRow key={piece.slug} piece={piece} idx={i + 1} live />
          ))}
        </div>

        <div className="board__section" data-kind="arr">
          <header className="section-bar">
            <span className="section-bar__icon" aria-hidden>●</span>
            <span className="section-bar__label">Arrivals</span>
            <span className="section-bar__meta tabular">
              {String(arrivals.length).padStart(2, "0")} · ON FILE
            </span>
          </header>
          {arrivals.map((piece, i) => (
            <DepRow
              key={piece.slug}
              piece={piece}
              idx={departures.length + i + 1}
            />
          ))}
        </div>
      </section>

      <footer className="foot" aria-label="Colophon">
        <span className="foot__copy">© 2026 Ryan Jun</span>
        <span className="foot__filler" aria-hidden />
        <a href="mailto:ryan@ryanjun.com" className="foot__cta">
          ryan@ryanjun.com →
        </a>
      </footer>

      <style>{`
        @keyframes pagefadein { from { opacity: 0; } to { opacity: 1; } }
        .page {
          animation: pagefadein 220ms ease;
          padding: 48px var(--margin-page) 0;
          max-width: 1680px;
          margin-inline: auto;
          min-height: calc(100dvh - 48px);
          display: flex;
          flex-direction: column;
        }
        @media (prefers-reduced-motion: reduce) {
          .page { animation: none; }
        }

        /* ── Banner ─────────────────────────────────────────────
           Three slots: name h1 left, role + station-meta center,
           email CTA right. The center carries the live time —
           the page's "this is a board, currently in operation"
           cue. h1 stays sans, role+time mono. */
        .banner {
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: baseline;
          gap: clamp(14px, 2vw, 28px);
          padding: clamp(10px, 1.2vw, 18px) 0;
          border-bottom: 1px solid var(--ink-hair);
        }
        .banner__h1 {
          font-family: var(--font-stack-sans);
          font-size: clamp(26px, 3vw, 42px);
          font-weight: 500;
          letter-spacing: -0.04em;
          line-height: 1;
          color: var(--ink);
          margin: 0;
        }
        .banner__role {
          font-family: var(--font-stack-mono);
          font-size: var(--type-nav);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--ink-3);
          justify-self: start;
          padding-left: clamp(0px, 1vw, 12px);
        }
        .banner__sep { color: var(--ink-4); }
        .banner__time {
          color: var(--accent);
          margin: 0 2px;
        }
        .banner__edt {
          color: var(--ink-3);
          font-size: 9px;
          margin-left: 2px;
        }
        .banner__cta {
          font-family: var(--font-stack-mono);
          font-size: var(--type-nav);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--ink-3);
          justify-self: end;
          transition: color 200ms var(--ease);
        }
        .banner__cta:hover { color: var(--ink); }

        /* ── Media strip ────────────────────────────────────────
           4 cover tiles, equal width, 21:9 cinematic aspect. Wide
           enough that LA28's 16:9 video crops minimally; tall
           enough that portrait Sift still reads. The strip is the
           only place imagery appears on the home — the board
           below it is text-only, board-faithful. */
        .strip {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1px;
          background: var(--ink-hair);
          padding: 1px;
          border: 1px solid var(--ink-hair);
          border-top: none;
        }
        .tile {
          display: block;
          position: relative;
          aspect-ratio: 21 / 9;
          background: var(--paper-2);
          overflow: hidden;
        }
        .tile__media {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: brightness(0.78) saturate(0.95);
          transition: filter 320ms var(--ease);
        }
        .tile:hover .tile__media,
        .tile:focus-within .tile__media {
          filter: brightness(1) saturate(1);
        }
        .tile__overlay {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          padding: 8px 12px;
          background: linear-gradient(transparent, rgba(0, 0, 0, 0.85));
          color: var(--ink);
          font-family: var(--font-stack-mono);
          font-size: 9px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          line-height: 1.3;
          opacity: 0;
          transform: translateY(4px);
          transition: opacity 280ms var(--ease), transform 280ms var(--ease);
          pointer-events: none;
        }
        .tile:hover .tile__overlay,
        .tile:focus-within .tile__overlay {
          opacity: 1;
          transform: translateY(0);
        }

        /* ── Board ──────────────────────────────────────────────
           Two sections (Departures, Arrivals) sharing one column
           system. The grid columns are defined once on the board
           and inherited by both the column-header row and every
           data row, so Time always lines up under Time. */
        .board {
          --row-grid: 88px 56px minmax(0, 1.6fr) minmax(0, 1.4fr) 140px;
          border-left: 1px solid var(--ink-hair);
          border-right: 1px solid var(--ink-hair);
        }
        .board__cols {
          display: grid;
          grid-template-columns: var(--row-grid);
          align-items: center;
          height: 24px;
          padding: 0 clamp(8px, 1vw, 14px);
          border-bottom: 1px solid var(--ink-hair);
          background: var(--paper-3);
        }
        .col {
          font-family: var(--font-stack-mono);
          font-size: 9px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--ink-3);
        }
        .col--status { text-align: right; }

        /* Sub-section label — DEPARTURES / ARRIVALS marker. Slightly
           lifted background so the label visually severs the row
           groups; icon left in cream (or amber for departures), label
           in cream caps, meta right in mono. */
        .section-bar {
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: baseline;
          gap: 8px;
          height: 28px;
          padding: 0 clamp(8px, 1vw, 14px);
          border-bottom: 1px solid var(--ink-hair);
          background: var(--paper-2);
        }
        .section-bar__icon {
          font-family: var(--font-stack-mono);
          font-size: 10px;
          line-height: 1;
        }
        .board__section[data-kind="dep"] .section-bar__icon {
          color: var(--accent);
          animation: live-pulse 2.6s ease-in-out infinite;
        }
        .board__section[data-kind="arr"] .section-bar__icon {
          color: var(--ink);
        }
        .section-bar__label {
          font-family: var(--font-stack-mono);
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--ink);
          font-weight: 500;
        }
        .section-bar__meta {
          font-family: var(--font-stack-mono);
          font-size: 9px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--ink-3);
        }

        /* ── Departure row ──────────────────────────────────────
           Wide horizontal row, five tabular columns. Time + No
           tabular mono left; Destination sans (the project title
           is the readable element); Sector mono uppercase; Status
           right-aligned with glyph + state. Hover tints the row
           background, no transform. */
        .row {
          display: grid;
          grid-template-columns: var(--row-grid);
          align-items: center;
          height: 50px;
          padding: 0 clamp(8px, 1vw, 14px);
          border-bottom: 1px solid var(--ink-hair);
          transition: background 200ms var(--ease);
        }
        .row:last-child { border-bottom: none; }
        .row:hover { background: var(--paper-2); }
        .row__time {
          font-family: var(--font-stack-mono);
          font-size: 12px;
          letter-spacing: 0.04em;
          color: var(--ink);
        }
        .row__no {
          font-family: var(--font-stack-mono);
          font-size: 11px;
          letter-spacing: 0.06em;
          color: var(--ink-3);
        }
        .row__dest {
          font-family: var(--font-stack-sans);
          font-size: clamp(15px, 1.4vw, 19px);
          font-weight: 500;
          letter-spacing: -0.02em;
          line-height: 1.1;
          color: var(--ink);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          min-width: 0;
        }
        .row__sector {
          font-family: var(--font-stack-mono);
          font-size: 10px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--ink-3);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          min-width: 0;
        }
        .row__status {
          display: inline-flex;
          align-items: baseline;
          gap: 6px;
          justify-self: end;
          font-family: var(--font-stack-mono);
          font-size: 10px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--ink-3);
        }
        .row__status .glyph {
          font-size: 10px;
          line-height: 1;
        }
        .row__status[data-status="shipped"] .glyph { color: var(--ink); }
        .row[data-live] .row__status {
          color: var(--accent);
          animation: live-pulse 2.6s ease-in-out infinite;
        }
        .row[data-live] .row__status .glyph { color: var(--accent); }

        @keyframes live-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.55; }
        }
        @media (prefers-reduced-motion: reduce) {
          .row[data-live] .row__status,
          .board__section[data-kind="dep"] .section-bar__icon {
            animation: none;
          }
        }

        /* ── Footer ─────────────────────────────────────────────
           Auto top-margin pushes the footer to the bottom on tall
           viewports so the gap absorbs below the board, not above
           the footer. Spine-rule fills the middle. */
        .foot {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: clamp(12px, 1.4vw, 18px) 0 clamp(14px, 1.6vw, 20px);
          margin-top: auto;
          flex-wrap: wrap;
        }
        .foot__copy {
          font-family: var(--font-stack-mono);
          font-size: var(--type-nav);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--ink-3);
        }
        .foot__filler {
          flex: 1 1 auto;
          height: 1px;
          background: var(--ink-hair);
          align-self: center;
        }
        .foot__cta {
          font-family: var(--font-stack-mono);
          font-size: var(--type-nav);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--ink);
          transition: color 200ms var(--ease);
        }
        .foot__cta:hover { color: var(--ink-3); }

        /* ── Responsive ────────────────────────────────────────
           The row's column grid narrows progressively. At ≤880px
           the Sector column moves below Destination as a sub-line.
           At ≤600px the column header drops, tiles stack 2-cols,
           rows reflow into a 2-line stack per project. */
        @media (max-width: 1100px) {
          .board {
            --row-grid: 72px 44px minmax(0, 1.4fr) minmax(0, 1.2fr) 120px;
          }
        }
        @media (max-width: 880px) {
          .board {
            --row-grid: 64px 40px minmax(0, 1fr) 100px;
          }
          .board__cols .col--sector,
          .row__sector {
            display: none;
          }
          .row__dest {
            white-space: normal;
            line-height: 1.15;
          }
          .strip { grid-template-columns: repeat(2, 1fr); }
          .tile { aspect-ratio: 16 / 9; }
        }
        @media (max-width: 600px) {
          .page { min-height: 0; padding-top: 48px; }
          .banner {
            grid-template-columns: 1fr auto;
            grid-template-rows: auto auto;
            row-gap: 6px;
          }
          .banner__h1 { grid-column: 1; grid-row: 1; }
          .banner__cta { grid-column: 2; grid-row: 1; }
          .banner__role {
            grid-column: 1 / -1;
            grid-row: 2;
            padding-left: 0;
            justify-self: start;
          }
          .strip { grid-template-columns: repeat(2, 1fr); gap: 1px; }
          .board__cols { display: none; }
          .board {
            --row-grid: 56px 36px 1fr 90px;
          }
          .row {
            height: auto;
            padding: 12px clamp(8px, 1vw, 14px);
          }
        }
      `}</style>
    </main>
  );
}

/* ── Cover tile ──────────────────────────────────────────────── */

function Tile({ piece }: { piece: Piece }) {
  if (!piece.cover) {
    return (
      <span className="tile" aria-hidden>
        <span className="tile__overlay">{piece.title}</span>
      </span>
    );
  }
  const overlay = `${piece.number} · ${piece.title} · ${piece.year}`;
  return (
    <Link href={`/work/${piece.slug}`} className="tile">
      {piece.cover.kind === "video" ? (
        <video
          className="tile__media"
          src={piece.cover.src}
          poster={piece.cover.poster}
          autoPlay
          loop
          muted
          playsInline
          aria-hidden
        />
      ) : (
        <Image
          className="tile__media"
          src={piece.cover.src}
          alt={piece.title}
          fill
          sizes="(max-width: 600px) 50vw, (max-width: 880px) 50vw, 25vw"
          priority={piece.order <= 2}
        />
      )}
      <span className="tile__overlay">{overlay}</span>
    </Link>
  );
}

/* ── Departure row ──────────────────────────────────────────── */

function DepRow({
  piece,
  idx,
  live,
}: {
  piece: Piece;
  idx: number;
  live?: boolean;
}) {
  const num = String(idx).padStart(2, "0");
  return (
    <Link
      href={`/work/${piece.slug}`}
      className="row"
      data-live={live ? "" : undefined}
    >
      <span className="row__time tabular">{piece.year}</span>
      <span className="row__no tabular">{num}</span>
      <span className="row__dest">{piece.title}</span>
      <span className="row__sector">{piece.sector}</span>
      <span className="row__status" data-status={piece.status}>
        <span className="glyph" aria-hidden>{STATUS_GLYPH[piece.status]}</span>
        <span>{live ? "Live" : `${piece.year}`}</span>
      </span>
    </Link>
  );
}
