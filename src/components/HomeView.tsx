import Image from "next/image";
import Link from "next/link";
import type { Piece } from "@/constants/pieces";
import LiveTime from "@/components/LiveTime";

/**
 * HomeView — single-composition departure-board portfolio.
 *
 * Krantz's structural insight (single 2D composition, no scroll, all
 * cells equally weighted, hairline grid) wedded to Solari's vocabulary
 * (live time in amber, ◆ LIVE status pulse on the active piece, status
 * grammar borrowed from a station board). The layout is the periodic-
 * table pattern; the language is the departure board.
 *
 * The page is a CSS-grid of fixed regions stacked vertically:
 *
 *   Frame (fixed, 48px) ─────────────────────────────────────────
 *   ┌──────────────────────────────────────────────────────────┐
 *   │ Name banner          stray            ryan@…    →        │
 *   ├──────────────────────────────────────────────────────────┤
 *   │ Intro: PRACTICE / NOW BOARDING / READING / LINKS         │
 *   ├──────────────────────────────────────────────────────────┤
 *   │ Element grid: 8 cols × 3 rows = 24 cells, aspect 4:3     │
 *   │   project / media / info / time / empty                  │
 *   ├──────────────────────────────────────────────────────────┤
 *   │ Foot: © stray · Ryan Jun         get in touch →          │
 *   └──────────────────────────────────────────────────────────┘
 *
 * The page sits in a `min-height: calc(100dvh - 48px)` container with
 * `display: flex; flex-direction: column;` and the grid as the elastic
 * region. At any viewport ≥720px tall, no scroll is needed — the grid
 * shrinks/grows to absorb the spare height. At smaller viewports the
 * page yields to natural scroll rather than forcing crammed cells.
 *
 * Cell aspect is 4:3 (landscape) rather than Krantz's 1:1 — keeps
 * cells board-row shaped (wider than tall) AND lets three rows fit
 * inside ~400px of vertical room on a 1440 viewport.
 *
 * Live elements (time digits, LA28 status indicator) carry the amber
 * accent and subtle motion; everything else is monochrome cream.
 */

type Props = { pieces: Piece[] };

const KOREAN_SEASON = (m: number): string => {
  if (m >= 3 && m <= 5) return "봄";
  if (m >= 6 && m <= 8) return "여름";
  if (m >= 9 && m <= 11) return "가을";
  return "겨울";
};

const STATUS_GLYPH = { shipped: "●", wip: "◆" } as const;

export default function HomeView({ pieces }: Props) {
  const real = pieces.filter((p) => !p.placeholder);
  const month = new Date().getMonth() + 1;
  const season = KOREAN_SEASON(month);
  const weather = "62°F";
  const conditions = "Overcast";

  return (
    <main id="main" className="page">
      <div className="name-banner">
        <h1 className="name-banner__h1">stray</h1>
        <span className="name-banner__meta tabular">
          New York ·{" "}
          <span className="name-banner__time">
            <LiveTime />
          </span>
          <span className="name-banner__edt">EDT</span>
        </span>
        <a href="mailto:ryan@ryanjun.com" className="name-banner__cta">
          ryan@ryanjun.com →
        </a>
      </div>

      <section className="intro" aria-label="Practice intro">
        <div className="intro__cell intro__cell--about">
          <span className="cell-label">Practice</span>
          <div className="intro__body">
            <p>
              A design-engineering studio of one in New York. Working
              between interface and identity systems for independent
              practices and studios.{" "}
              <Link href="/studio">↗</Link>
            </p>
          </div>
        </div>

        <div className="intro__cell">
          <span className="cell-label">Now Boarding</span>
          <ul className="ps-list" role="list">
            <li className="ps-row ps-row--live">
              <span className="ps-glyph" aria-hidden>◆</span>
              <span className="ps-name">
                <Link href="/work/la28">LA28 — Brand campaign ↗</Link>
              </span>
              <span className="ps-state">Live</span>
            </li>
            <li className="ps-row">
              <span className="ps-num">·</span>
              <span className="ps-name ps-name--mid">In development</span>
            </li>
          </ul>
        </div>

        <div className="intro__cell">
          <span className="cell-label">Reading</span>
          <ul className="ps-list" role="list">
            <li className="ps-row"><span className="ps-num">01</span><span className="ps-name">Designing Design — Hara</span></li>
            <li className="ps-row"><span className="ps-num">02</span><span className="ps-name">In Praise of Shadows — Tanizaki</span></li>
            <li className="ps-row"><span className="ps-num">03</span><span className="ps-name ps-name--mid">A Pattern Language</span></li>
          </ul>
        </div>

        <div className="intro__cell intro__cell--links">
          <span className="cell-label">Links</span>
          <ul className="ps-list" role="list">
            <li className="ps-row"><span className="ps-num">01</span><span className="ps-name"><a href="https://read.cv/ryanjun" target="_blank" rel="noopener noreferrer">Read.cv ↗</a></span></li>
            <li className="ps-row"><span className="ps-num">02</span><span className="ps-name"><a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a></span></li>
            <li className="ps-row"><span className="ps-num">03</span><span className="ps-name"><a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">Instagram ↗</a></span></li>
          </ul>
        </div>
      </section>

      <section className="grid" aria-label="Catalog">
        {/* Row 1 */}
        <InfoCell num="01" sym="St" name="stray" cat="Studio" />
        <MediaCell piece={real[0]} />
        <ProjectCell idx="02" piece={real[0]} />
        <TimeCell num="03" />
        <InfoCell num="04" sym="Ny" name="New York" cat="Origin" />
        <EmptyCell />
        <MediaCell piece={real[1]} />
        <ProjectCell idx="05" piece={real[1]} />

        {/* Row 2 */}
        <EmptyCell />
        <MediaCell piece={real[2]} />
        <ProjectCell idx="06" piece={real[2]} />
        <EmptyCell />
        <MediaCell piece={real[3]} />
        <ProjectCell idx="07" piece={real[3]} />
        <InfoCell num="08" sym={weather} name={conditions} cat="Atmos" tabular />
        <InfoCell num="09" sym={season} name="Spring" cat="Season" lang="ko" />

        {/* Row 3 */}
        <InfoCell num="10" sym="De" name="Design Engineer" cat="Role" />
        <EmptyCell />
        <EmptyCell />
        <NoteCell num="11" />
        <EmptyCell />
        <EmptyCell />
        <EmailCell num="12" />
        <EmptyCell />
      </section>

      <footer className="foot" aria-label="Colophon">
        <span className="foot__copy">© 2026 stray</span>
        <span className="foot__spine" aria-hidden>·</span>
        <span className="foot__copy">Ryan Jun</span>
        <span className="foot__filler" aria-hidden />
        <a href="mailto:ryan@ryanjun.com" className="foot__cta">
          Get in touch → ryan@ryanjun.com
        </a>
      </footer>

      <style>{`
        /* ── Page shell — single-composition viewport fit ──────
           The page reserves the full viewport height minus the fixed
           Frame (48px), then distributes its children: banner / intro
           / grid / footer. The grid is the elastic region; banner +
           intro + footer have content-driven heights and the grid
           absorbs whatever vertical space is left. At ≥720px viewport
           heights the content fits in one frame; below that the grid's
           cells stay at their aspect-ratio minimum and the page yields
           to natural scroll rather than collapsing the cell type. */
        @keyframes pagefadein { from { opacity: 0; } to { opacity: 1; } }
        .page {
          animation: pagefadein 220ms ease;
          padding: 0 var(--margin-page);
          max-width: 1680px;
          margin-inline: auto;
          min-height: calc(100dvh - 48px);
          display: flex;
          flex-direction: column;
          padding-top: 48px;     /* clear the fixed Frame */
        }
        @media (prefers-reduced-motion: reduce) {
          .page { animation: none; }
        }

        /* ── Name banner ─────────────────────────────────────────
           Three-slot row: wordmark · live "station" meta · email CTA.
           The middle slot carries New York · 14:32 EDT in mono — the
           page's "this is a station and the clock is running" cue.
           The clock digits sit in amber. */
        .name-banner {
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: baseline;
          gap: clamp(14px, 2vw, 28px);
          padding: clamp(10px, 1.2vw, 18px) 0;
          border-bottom: 1px solid var(--ink-hair);
        }
        .name-banner__h1 {
          font-family: var(--font-stack-sans);
          font-size: clamp(28px, 3.4vw, 48px);
          font-weight: 500;
          letter-spacing: -0.04em;
          line-height: 1;
          color: var(--ink);
          margin: 0;
          text-transform: lowercase;
        }
        .name-banner__meta {
          font-family: var(--font-stack-mono);
          font-size: var(--type-nav);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--ink-3);
          justify-self: start;
          padding-left: clamp(0px, 1vw, 12px);
        }
        .name-banner__time {
          color: var(--accent);
          margin: 0 4px;
        }
        .name-banner__edt {
          color: var(--ink-3);
          font-size: 9px;
        }
        .name-banner__cta {
          font-family: var(--font-stack-mono);
          font-size: var(--type-nav);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--ink-3);
          transition: color 200ms var(--ease);
          justify-self: end;
        }
        .name-banner__cta:hover { color: var(--ink); }

        /* ── Intro — 4 columns of hairline cells ────────────────
           Sits between the banner and the element grid. Cells share
           a complete hairline grid; left edge anchored, right edge
           closes via individual cell border-right. */
        .intro {
          display: grid;
          grid-template-columns: 2fr 1.2fr 1fr 0.8fr;
          border-left: 1px solid var(--ink-hair);
          border-bottom: 1px solid var(--ink-hair);
        }
        .intro__cell {
          border-right: 1px solid var(--ink-hair);
          display: flex;
          flex-direction: column;
          min-width: 0;
          min-height: 0;
        }
        .cell-label {
          font-family: var(--font-stack-mono);
          font-size: 9px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--ink-3);
          padding: 8px clamp(12px, 1.2vw, 18px);
          border-bottom: 1px solid var(--ink-hair);
          flex-shrink: 0;
        }
        .intro__body {
          padding: clamp(10px, 1.2vw, 16px) clamp(12px, 1.2vw, 18px);
        }
        .intro__body p {
          font-family: var(--font-stack-sans);
          font-size: clamp(12px, 0.8vw, 13.5px);
          line-height: 1.5;
          color: var(--ink-2);
          font-weight: 400;
          max-width: 50ch;
          margin: 0;
        }
        .intro__body a {
          color: var(--ink-3);
          transition: color 200ms var(--ease);
        }
        .intro__body a:hover { color: var(--ink); }

        /* Numbered list rows inside intro cells. */
        .ps-list {
          list-style: none;
          margin: 0;
          padding: 0;
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .ps-row {
          display: grid;
          grid-template-columns: 22px 1fr auto;
          align-items: center;
          gap: 8px;
          padding: 0 clamp(12px, 1.2vw, 18px);
          height: 26px;
          border-bottom: 1px solid var(--ink-hair);
          white-space: nowrap;
          overflow: hidden;
        }
        .ps-row:last-child { border-bottom: none; }
        .ps-num {
          font-family: var(--font-stack-mono);
          font-size: 10px;
          letter-spacing: 0.05em;
          color: var(--ink-3);
        }
        .ps-glyph {
          font-family: var(--font-stack-mono);
          font-size: 9px;
          color: var(--accent);
          animation: live-pulse 2.6s ease-in-out infinite;
        }
        .ps-state {
          font-family: var(--font-stack-mono);
          font-size: 9px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--accent);
          animation: live-pulse 2.6s ease-in-out infinite;
        }
        .ps-name {
          font-family: var(--font-stack-sans);
          font-size: 12px;
          color: var(--ink);
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .ps-name--mid { color: var(--ink-3); }
        .ps-name a {
          color: var(--ink);
          transition: color 200ms var(--ease);
        }
        .ps-name a:hover { color: var(--ink-3); }

        /* ── Element grid — 8 cols × 3 rows of 4:3 cells ──────
           4:3 (landscape) keeps the cell board-row-shaped: wider
           than tall, so three rows of cells fit comfortably in the
           vertical budget. Subgrid aligns intro borders to the grid
           below it visually. */
        .grid {
          display: grid;
          grid-template-columns: repeat(8, 1fr);
          border-left: 1px solid var(--ink-hair);
        }
        .cell {
          border-right: 1px solid var(--ink-hair);
          border-bottom: 1px solid var(--ink-hair);
          /* 3:2 landscape — wider than tall, board-row shaped, with
             enough vertical room for the four-line cell skeleton.
             Three rows of 3:2 cells at 164px wide ≈ 327px total grid
             height, well under any laptop viewport's vertical budget. */
          aspect-ratio: 3 / 2;
          display: flex;
          flex-direction: column;
          padding: clamp(8px, 0.9vw, 14px);
          min-width: 0;
          min-height: 0;
          overflow: hidden;
          position: relative;
        }
        .cell--empty { /* borders only */ }
        .cell__num {
          font-family: var(--font-stack-mono);
          font-size: 9px;
          letter-spacing: 0.05em;
          color: var(--ink-3);
          line-height: 1;
        }
        .cell__sym {
          font-family: var(--font-stack-sans);
          font-size: clamp(16px, 1.8vw, 26px);
          font-weight: 500;
          letter-spacing: -0.03em;
          line-height: 1.05;
          color: var(--ink);
          margin: auto 0 4px;
          /* Truncate single-line if symbol is long, never wrap into
             a second line that would push the cat below. */
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          min-width: 0;
        }
        .cell__sym--time {
          font-family: var(--font-stack-mono);
          font-size: clamp(14px, 1.5vw, 20px);
          letter-spacing: 0.02em;
          font-weight: 400;
          color: var(--accent);
        }
        .cell__sym--ko {
          font-family: var(--font-stack-sans);
        }
        .cell__name {
          font-family: var(--font-stack-sans);
          font-size: clamp(10px, 0.8vw, 12px);
          line-height: 1.25;
          color: var(--ink);
          margin-bottom: 2px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .cell__name a { color: inherit; }
        .cell__cat {
          font-family: var(--font-stack-mono);
          font-size: 8.5px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--ink-3);
          line-height: 1.3;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        /* Project cells link, hover yields a row-tint without
           transform — cells live in a grid; we don't lift them. */
        .cell--proj {
          transition: background 240ms var(--ease);
        }
        .cell--proj:hover { background: var(--paper-2); }

        /* Status row at cell foot. Shipped pieces show ● ON TIME in
           cream; LA28 (LIVE) shows ◆ LIVE in amber with the slow
           pulse — only the LIVE row breathes. */
        .cell__status {
          display: inline-flex;
          align-items: baseline;
          gap: 6px;
          font-family: var(--font-stack-mono);
          font-size: 8.5px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--ink-3);
        }
        .cell__status .glyph {
          font-size: 9px;
          color: var(--ink);
        }
        .cell__status[data-status="wip"] {
          color: var(--accent);
          animation: live-pulse 2.6s ease-in-out infinite;
        }
        .cell__status[data-status="wip"] .glyph { color: var(--accent); }
        @keyframes live-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.55; }
        }
        @media (prefers-reduced-motion: reduce) {
          .cell__status[data-status="wip"],
          .ps-glyph,
          .ps-state {
            animation: none;
          }
        }

        /* Media cells — full-bleed, dim at rest, brighten on hover.
           Title overlay slides up from bottom. */
        .cell--media { padding: 0; }
        .cell__media {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: brightness(0.78);
          transition: filter 320ms var(--ease);
        }
        .cell--media:hover .cell__media,
        .cell--media:focus-within .cell__media {
          filter: brightness(1);
        }
        .cell__overlay {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          padding: 6px 8px;
          background: linear-gradient(transparent, rgba(0, 0, 0, 0.82));
          color: var(--ink);
          font-family: var(--font-stack-mono);
          font-size: 8.5px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          line-height: 1.3;
          opacity: 0;
          transform: translateY(4px);
          transition: opacity 280ms var(--ease), transform 280ms var(--ease);
          pointer-events: none;
        }
        .cell--media:hover .cell__overlay,
        .cell--media:focus-within .cell__overlay {
          opacity: 1;
          transform: translateY(0);
        }

        /* ── Footer ─────────────────────────────────────────────
           One row, flat. Copyright + name left, contact CTA right.
           No top border — the grid's bottom border closes the
           composition; the footer is an outdented tail. */
        .foot {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: clamp(10px, 1.2vw, 16px) 0 clamp(12px, 1.4vw, 18px);
          flex-wrap: wrap;
          /* Push the footer to the bottom of the viewport when the
             grid + intro fit comfortably above. On taller viewports
             this prevents an unfinished gap below the footer; on
             tighter viewports the auto-margin collapses harmlessly. */
          margin-top: auto;
        }
        .foot__copy {
          font-family: var(--font-stack-mono);
          font-size: var(--type-nav);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--ink-3);
        }
        .foot__spine {
          color: var(--ink-4);
          font-family: var(--font-stack-mono);
          font-size: var(--type-nav);
        }
        .foot__filler {
          flex: 1 1 auto;
          height: 1px;
          background: var(--ink-hair);
          align-self: center;
          margin: 0 12px;
        }
        .foot__cta {
          font-family: var(--font-stack-sans);
          font-size: 12px;
          color: var(--ink);
          transition: color 200ms var(--ease);
        }
        .foot__cta:hover { color: var(--ink-3); }

        /* ── Responsive — keep fit-in-viewport across resolutions ─
           The principle: at every breakpoint the page reads as one
           composition, never crammed, never scrolling on a desktop
           viewport ≥720px tall. Below that, the page yields to
           natural scroll instead of squeezing cells past readability. */

        /* Wide desktops — already handled by clamp() and max-width. */

        /* Laptop / small desktop: same column counts, smaller cells
           via natural shrinkage (8 cols at 1024w → 128px cells). */
        @media (max-width: 1280px) {
          .intro { grid-template-columns: 1.8fr 1.2fr 1fr 0.8fr; }
          .name-banner__meta { padding-left: 0; }
        }

        /* Tablet — drop intro to 2 cols (about + boarding stay
           prominent; reading + links wrap below). Element grid keeps
           8 cols so the cell grammar stays consistent. */
        @media (max-width: 1024px) {
          .intro {
            grid-template-columns: 1.6fr 1fr;
          }
          .intro__cell--about { grid-column: 1; grid-row: 1; }
          .intro__cell:nth-child(2) { grid-column: 2; grid-row: 1; }
          .intro__cell:nth-child(3) { grid-column: 1; grid-row: 2; border-top: 1px solid var(--ink-hair); }
          .intro__cell--links { grid-column: 2; grid-row: 2; border-top: 1px solid var(--ink-hair); }
        }

        /* Smaller tablet / large phone landscape: drop the grid to
           6 cols. Three rows × 6 cols = 18 cells; the eight empties
           in the design naturally drop the right amount. */
        @media (max-width: 880px) {
          .grid { grid-template-columns: repeat(6, 1fr); }
          .name-banner {
            grid-template-columns: auto auto;
            grid-template-rows: auto auto;
          }
          .name-banner__meta { grid-column: 1; grid-row: 2; padding-left: 0; }
          .name-banner__cta { grid-column: 2; grid-row: 1 / span 2; align-self: center; }
        }

        /* Phone portrait. Single-viewport fit gives up here — the
           cells need vertical room to read, and 8/6 cols collapse
           past a useful size at 375. We accept scroll here; the
           composition reads top-to-bottom on phone but still shows
           the same content in the same order. */
        @media (max-width: 600px) {
          .page { min-height: 0; }
          .name-banner { padding: 12px 0; }
          .intro {
            grid-template-columns: 1fr;
            border-bottom: none;
          }
          .intro__cell,
          .intro__cell--about,
          .intro__cell:nth-child(2),
          .intro__cell:nth-child(3),
          .intro__cell--links {
            grid-column: 1;
            grid-row: auto;
            border-top: none;
          }
          .grid {
            grid-template-columns: repeat(2, 1fr);
            border-bottom: 1px solid var(--ink-hair);
          }
          .cell--empty { display: none; }
          .cell__sym { font-size: 18px; }
          .cell__sym--time { font-size: 16px; }
          .foot { gap: 12px; }
          .foot__filler { display: none; }
        }
      `}</style>
    </main>
  );
}

/* ── Cell components ─────────────────────────────────────────── */

function ProjectCell({ idx, piece }: { idx: string; piece: Piece | undefined }) {
  if (!piece) return <EmptyCell />;
  const live = piece.status === "wip";
  return (
    <Link href={`/work/${piece.slug}`} className="cell cell--proj">
      <span className="cell__num tabular">{idx}</span>
      <span className="cell__sym">{piece.title}</span>
      <span className="cell__name">{piece.sector}</span>
      <span className="cell__status" data-status={piece.status}>
        <span className="glyph" aria-hidden>{STATUS_GLYPH[piece.status]}</span>
        <span>{live ? "Live" : `${piece.year}`}</span>
      </span>
    </Link>
  );
}

function MediaCell({ piece }: { piece: Piece | undefined }) {
  if (!piece || !piece.cover) return <EmptyCell />;
  const overlay = `${piece.title} · ${piece.year}`;
  return (
    <Link href={`/work/${piece.slug}`} className="cell cell--media">
      {piece.cover.kind === "video" ? (
        <video
          className="cell__media"
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
          className="cell__media"
          src={piece.cover.src}
          alt={piece.title}
          fill
          sizes="(max-width: 600px) 50vw, (max-width: 880px) 16vw, 12vw"
        />
      )}
      <span className="cell__overlay">{overlay}</span>
    </Link>
  );
}

function InfoCell({
  num,
  sym,
  name,
  cat,
  tabular,
  lang,
}: {
  num: string;
  sym: string;
  name: string;
  cat: string;
  tabular?: boolean;
  lang?: string;
}) {
  return (
    <div className="cell">
      <span className="cell__num tabular">{num}</span>
      <span
        className={`cell__sym${tabular ? " tabular cell__sym--time" : ""}${lang === "ko" ? " cell__sym--ko" : ""}`}
        lang={lang}
      >
        {sym}
      </span>
      <span className="cell__name">{name}</span>
      <span className="cell__cat">{cat}</span>
    </div>
  );
}

function TimeCell({ num }: { num: string }) {
  return (
    <div className="cell">
      <span className="cell__num tabular">{num}</span>
      <span className="cell__sym cell__sym--time tabular">
        <LiveTime />
      </span>
      <span className="cell__name">Local time</span>
      <span className="cell__cat">NYC · Live</span>
    </div>
  );
}

function NoteCell({ num }: { num: string }) {
  return (
    <Link href="/notes/n-001" className="cell cell--proj">
      <span className="cell__num tabular">{num}</span>
      <span className="cell__sym">N-01</span>
      <span className="cell__name">On restraint</span>
      <span className="cell__cat">Note · 2026</span>
    </Link>
  );
}

function EmailCell({ num }: { num: string }) {
  return (
    <a href="mailto:ryan@ryanjun.com" className="cell cell--proj">
      <span className="cell__num tabular">{num}</span>
      <span className="cell__sym">@</span>
      <span className="cell__name">ryan@ryanjun.com</span>
      <span className="cell__cat">Contact</span>
    </a>
  );
}

function EmptyCell() {
  return <div className="cell cell--empty" aria-hidden />;
}
