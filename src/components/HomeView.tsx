import Image from "next/image";
import Link from "next/link";
import type { Piece } from "@/constants/pieces";
import LiveTime from "@/components/LiveTime";
import { CONTACT_EMAIL } from "@/constants/contact";

/**
 * HomeView — single-composition departure board.
 *
 *   ┌────────────────────────────────────────────────────────────┐
 *   │  Ryan Jun       Design engineer · NYC · 14:32 EDT      → │  Banner
 *   ├────────────────────────────────────────────────────────────┤
 *   │  THUMB │ TIME │ NO │ DESTINATION │ SECTOR │ STATUS         │  Col header
 *   │  ◆ DEPARTURES                              01 · LIVE       │
 *   │ │[▶︎]  │ 2026 │ 01 │ LA28        │ Brand  │ ◆ LIVE          │  Live row (amber bar + pulse)
 *   │  ● ARRIVALS                                03 · ON FILE    │
 *   │  [HH] │ 2026 │ 02 │ Halo Halo!  │ Brand  │ ● 2026          │
 *   │  [Gy] │ 2026 │ 03 │ Gyeol: 결    │ Brand  │ ● 2026          │
 *   │  [Sf] │ 2025 │ 04 │ Sift        │ Mobile │ ● 2025          │
 *   ├────────────────────────────────────────────────────────────┤
 *   │  © 2026 Ryan Jun ─────────────────  rykjun@gmail.com →    │
 *   └────────────────────────────────────────────────────────────┘
 *
 * Iteration past the OK-but-not-brilliant first board:
 *
 *  1. Cover strip removed. The board is now the page's only visual
 *     band — every project gets an inline thumbnail in its row, so
 *     media is in service of the schedule rather than a separate
 *     spread above it.
 *
 *  2. Rows commanded up. Height 76px (was 50px) with destination
 *     type at clamp(20-26px) — readable from across the room, the
 *     way a real flap board reads.
 *
 *  3. LIVE row gets a left-edge amber bar (3px, full row height,
 *     pulsing in sync with the status cell). The bar is the "this
 *     row is currently active" cue — Solari boards literally light
 *     up the row that's about to depart.
 *
 *  4. Banner h1 lifted to clamp(34-60px) — the name now sits as
 *     the station-name anchor, not as masthead-sized chrome.
 *
 *  5. Split-flap clock in the banner (LiveTime). Each digit's an
 *     individual flap that animates scaleY collapse-and-expand on
 *     value change. Single mechanical click per minute boundary.
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
        <a href={`mailto:${CONTACT_EMAIL}`} className="banner__cta">
          {CONTACT_EMAIL} →
        </a>
      </header>

      <section className="board" aria-label="Schedule">
        <div className="board__cols" role="row" aria-hidden>
          <span className="col col--thumb" />
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
        <a href={`mailto:${CONTACT_EMAIL}`} className="foot__cta">
          {CONTACT_EMAIL} →
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
           h1 lifted to station-name scale (clamp 34-60). Role line
           carries the live data: city · split-flap clock · timezone.
           Amber lives only on the time digits (and the LIVE bar /
           status / section-icon below). */
        .banner {
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: baseline;
          gap: clamp(16px, 2.4vw, 32px);
          padding: clamp(14px, 1.6vw, 22px) 0 clamp(14px, 1.6vw, 22px);
          border-bottom: 1px solid var(--ink-hair);
        }
        .banner__h1 {
          font-family: var(--font-stack-sans);
          font-size: clamp(34px, 4vw, 60px);
          font-weight: 500;
          letter-spacing: -0.04em;
          line-height: 0.95;
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
          padding-left: clamp(0px, 1vw, 16px);
        }
        .banner__sep { color: var(--ink-4); }
        .banner__time {
          color: var(--accent);
          margin: 0 2px;
          font-weight: 500;
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

        /* ── Board ──────────────────────────────────────────────
           Single column system shared between both sections. The
           thumbnail column is fixed-width (56px on desktop) so
           cover frames align cleanly down the column edge. */
        .board {
          --row-grid:
            56px            /* thumbnail */
            72px            /* time */
            44px            /* no */
            minmax(0, 1.4fr)  /* destination */
            minmax(0, 1fr)    /* sector */
            130px;          /* status */
          --row-gap: clamp(10px, 1.2vw, 18px);
          border: 1px solid var(--ink-hair);
        }
        .board__cols {
          display: grid;
          grid-template-columns: var(--row-grid);
          column-gap: var(--row-gap);
          align-items: center;
          height: 28px;
          padding: 0 clamp(10px, 1.2vw, 18px);
          border-bottom: 1px solid var(--ink-hair);
          background: var(--paper-3);
        }
        .col {
          font-family: var(--font-stack-mono);
          font-size: 9px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--ink-3);
          font-weight: 500;
        }
        .col--status { text-align: right; }

        /* ── Section bar ─────────────────────────────────────────
           DEPARTURES / ARRIVALS sub-header. Icon left + label +
           meta right. Lifted background separates it from the data
           rows below. */
        .section-bar {
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: baseline;
          gap: 10px;
          height: 32px;
          padding: 0 clamp(10px, 1.2vw, 18px);
          border-bottom: 1px solid var(--ink-hair);
          background: var(--paper-2);
        }
        .section-bar__icon {
          font-family: var(--font-stack-mono);
          font-size: 11px;
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
          font-size: 11px;
          letter-spacing: 0.14em;
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
           76px tall — commanding height for read-from-distance type.
           Thumbnail anchored left, destination is the row's hero,
           status right-aligned. LIVE row has a 3px amber bar on the
           left edge (pulsing) as the "this seat is active" cue. */
        .row {
          display: grid;
          grid-template-columns: var(--row-grid);
          column-gap: var(--row-gap);
          align-items: center;
          height: 76px;
          padding: 0 clamp(10px, 1.2vw, 18px);
          border-bottom: 1px solid var(--ink-hair);
          transition: background 200ms var(--ease);
          position: relative;
        }
        .row:last-child { border-bottom: none; }
        .row:hover { background: var(--paper-2); }

        /* LIVE row — amber left-edge bar runs full height,
           synchronized with the status pulse. The bar is the
           strongest of the live cues; status text is the second;
           section-bar icon is the third. */
        .row[data-live]::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 3px;
          background: var(--accent);
          animation: live-pulse 2.6s ease-in-out infinite;
        }

        .row__thumb {
          width: 56px;
          height: 56px;
          background: var(--paper-2);
          overflow: hidden;
          position: relative;
          flex-shrink: 0;
        }
        .row__thumb-media {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: brightness(0.86) saturate(0.95);
          transition: filter 320ms var(--ease);
        }
        .row:hover .row__thumb-media {
          filter: brightness(1) saturate(1);
        }

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
          font-size: clamp(20px, 1.8vw, 26px);
          font-weight: 500;
          letter-spacing: -0.025em;
          line-height: 1.05;
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
          gap: 8px;
          justify-self: end;
          font-family: var(--font-stack-mono);
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--ink-3);
        }
        .row__status .glyph {
          font-size: 11px;
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
          .row[data-live]::before,
          .board__section[data-kind="dep"] .section-bar__icon {
            animation: none;
          }
        }

        /* ── Footer ─────────────────────────────────────────────
           Pushed to the bottom on tall viewports via margin-top: auto. */
        .foot {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: clamp(14px, 1.6vw, 22px) 0 clamp(16px, 2vw, 24px);
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
           1100px: row grid narrows (smaller fixed cols, smaller
           gap). Sector still visible.
           880px: sector column drops; row reflows to thumb / time +
           no / destination (with sector as sub-line) / status.
           600px: column header hidden; row is a 2-line stack with
           thumb left and stacked text right. */
        @media (max-width: 1280px) {
          .board {
            --row-grid: 52px 64px 40px minmax(0, 1.3fr) minmax(0, 1fr) 120px;
          }
        }
        @media (max-width: 1100px) {
          .board {
            --row-grid: 48px 60px 36px minmax(0, 1.2fr) minmax(0, 0.9fr) 110px;
          }
          .row { height: 72px; }
          .row__thumb { width: 48px; height: 48px; }
        }
        @media (max-width: 880px) {
          .board {
            --row-grid: 48px 56px 32px minmax(0, 1fr) 100px;
          }
          .col--sector,
          .row__sector {
            display: none;
          }
          .row { height: 68px; }
          .row__dest { font-size: 18px; }
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
          .board__cols { display: none; }
          .board {
            --row-grid: 44px 1fr 90px;
          }
          .row {
            height: auto;
            padding: 12px clamp(10px, 1.2vw, 18px);
          }
          .row__thumb { width: 44px; height: 44px; }
          .row__time, .row__no { display: none; }
          .row__dest { font-size: 16px; }
        }
      `}</style>
    </main>
  );
}

/* ── Departure row with inline thumbnail ───────────────────── */

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
      <span className="row__thumb">
        {piece.cover?.kind === "video" ? (
          <video
            className="row__thumb-media"
            src={piece.cover.src}
            poster={piece.cover.poster}
            autoPlay
            loop
            muted
            playsInline
            aria-hidden
          />
        ) : piece.cover?.kind === "image" ? (
          <Image
            className="row__thumb-media"
            src={piece.cover.src}
            alt={piece.title}
            fill
            sizes="56px"
          />
        ) : null}
      </span>
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
