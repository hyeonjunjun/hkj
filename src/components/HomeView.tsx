import Image from "next/image";
import Link from "next/link";
import type { Piece } from "@/constants/pieces";

/**
 * HomeView — departure-board timetable of the practice.
 *
 *     ┌──────────────────────────────────────────────────────────┐
 *     │ NEW YORK                            62°F · OVERCAST · 봄 │  station header
 *     │   [void — clamp(120px, 24vh, 280px)]                       │
 *     │   [featured photograph, cols 2-11, 16:9]                  │
 *     │   GYEOL: 結 · MATERIAL BRAND · 2026                        │  caption
 *     │   ──────────────────────────────────────────────────────  │  hairline
 *     │   WORK                                       4 PROJECTS    │
 *     │   ──────────────────────────────────────────────────────  │
 *     │   01  LA28        BRAND · CAMPAIGN     2026  ◆ LIVE        │
 *     │   02  HALO HALO!  BRAND · CAFÉ         2026  ● SHIPPED     │
 *     │   03  SIFT        MOBILE · AI          2025  ● SHIPPED     │
 *     │   04  GYEOL: 結   BRAND · ECOMMERCE    2026  ● SHIPPED     │
 *     │   ──────────────────────────────────────────────────────  │
 *     │   CURRENTLY                            UPDATED 2026-05-09  │
 *     │   ──────────────────────────────────────────────────────  │
 *     │   Working between interface and identity systems...        │
 *     │                                                            │
 *     │   RYAN@RYANJUN.COM        62°F · OVERCAST · 봄              │  footer
 *     └──────────────────────────────────────────────────────────┘
 *
 * The five timetable principles from PORTFOLIO-DESIGN-BRIEF, inverted:
 *   1. Stem-and-leaf — mono structural cols (number, year, status)
 *      vs sans content cols (title, sector). Weight does the rest.
 *   2. Hairline rule separation — 1px (0.5px on retina) borders
 *      between sections, never between rows. Density stays legible
 *      because the grid is visible but nearly weightless.
 *   3. Blank cells as data — WIP/LIVE renders ◆ in amber; shipped
 *      renders ● in full ink. The symbol communicates state at a
 *      glance, no extra column needed.
 *   4. Two colors max — warm-cream luminance steps + a single accent
 *      (Solari amber) reserved for live data: clock, LIVE row, weather.
 *   5. Weight variation in one family — Mono 500 for headers, 400 for
 *      data; Sans 500 for project titles, 400 for prose.
 *
 * Single LIVE row pulses (LA28). Everything else is dead-still. The
 * asymmetry is the point: a board mostly static, one row breathing.
 */

type Props = { pieces: Piece[] };

const STATUS_GLYPH = { shipped: "●", wip: "◆" } as const;
const STATUS_LABEL = { shipped: "SHIPPED", wip: "LIVE" } as const;

const KOREAN_SEASON = (m: number): string => {
  if (m >= 3 && m <= 5) return "봄";
  if (m >= 6 && m <= 8) return "여름";
  if (m >= 9 && m <= 11) return "가을";
  return "겨울";
};

export default function HomeView({ pieces }: Props) {
  const real = pieces.filter((p) => !p.placeholder);
  const featured = real[0];
  const month = new Date().getMonth() + 1;
  const season = KOREAN_SEASON(month);

  // Static for the mockup; replace with real edge fetch later.
  const weather = "62°F · OVERCAST";
  const updated = "2026-05-09";

  return (
    <main id="main" className="board">
      <header className="board__station" aria-label="Station header">
        <span className="board__city">New York</span>
        <span className="board__atmos tabular">
          <span>{weather}</span>
          <span className="board__sep" aria-hidden>·</span>
          <span className="board__season" lang="ko">{season}</span>
        </span>
      </header>

      <div className="board__void" aria-hidden />

      {featured && (
        <figure className="board__featured" aria-label="Featured piece">
          <Link href={`/work/${featured.slug}`} className="board__featured-link">
            <span className="board__plate">
              {featured.cover?.kind === "video" ? (
                <video
                  className="board__media"
                  src={featured.cover.src}
                  poster={featured.cover.poster}
                  autoPlay
                  loop
                  muted
                  playsInline
                  aria-hidden
                />
              ) : featured.cover?.kind === "image" ? (
                <Image
                  className="board__media"
                  src={featured.cover.src}
                  alt={featured.title}
                  fill
                  sizes="(max-width: 760px) 100vw, 90vw"
                  priority
                />
              ) : null}
            </span>
          </Link>
          <figcaption className="board__caption">
            <span className="board__caption-title">{featured.title}</span>
            <span className="board__caption-sep" aria-hidden>·</span>
            <span className="board__caption-meta">{featured.sector}</span>
            <span className="board__caption-sep" aria-hidden>·</span>
            <span className="board__caption-meta tabular">{featured.year}</span>
          </figcaption>
        </figure>
      )}

      <Section
        label="Work"
        meta={`${String(real.length).padStart(2, "0")} PROJECTS`}
      >
        <ol className="tt" aria-label="Work index">
          {real.map((piece) => {
            const live = piece.status === "wip";
            return (
              <li key={piece.slug} className="tt__row" data-live={live ? "" : undefined}>
                <Link href={`/work/${piece.slug}`} className="tt__link">
                  <span className="tt__num tabular">{piece.number}</span>
                  <span className="tt__title">{piece.title}</span>
                  <span className="tt__sector">{piece.sector}</span>
                  <span className="tt__year tabular">{piece.year}</span>
                  <span
                    className="tt__status"
                    data-status={piece.status}
                  >
                    <span className="tt__glyph" aria-hidden>{STATUS_GLYPH[piece.status]}</span>
                    <span className="tt__state">{STATUS_LABEL[piece.status]}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </Section>

      <Section label="Currently" meta={`UPDATED ${updated}`} dim>
        <p className="board__prose">
          Working between interface and identity systems for independent
          studios and personal practice. New York, open to small
          collaborations.
        </p>
      </Section>

      <Section label="Notes" meta="01 ENTRY">
        <ol className="tt tt--notes" aria-label="Notes">
          <li className="tt__row">
            <Link href="/notes/n-001" className="tt__link">
              <span className="tt__num tabular">N-001</span>
              <span className="tt__title">On restraint as the hardest move</span>
              <span className="tt__sector">Process</span>
              <span className="tt__year tabular">2026-04</span>
              <span className="tt__status" aria-hidden>
                <span className="tt__arrow">→</span>
              </span>
            </Link>
          </li>
        </ol>
      </Section>

      <footer className="board__foot" aria-label="Colophon">
        <a href="mailto:ryan@ryanjun.com" className="board__email">
          ryan@ryanjun.com
        </a>
        <span className="board__atmos tabular">
          <span>{weather}</span>
          <span className="board__sep" aria-hidden>·</span>
          <span className="board__season" lang="ko">{season}</span>
        </span>
      </footer>

      <style>{`
        .board {
          display: grid;
          grid-template-columns: repeat(12, minmax(0, 1fr));
          column-gap: var(--gap-plates);
          row-gap: clamp(48px, 6vw, 96px);
          max-width: 1440px;
          margin-inline: auto;
          padding: 64px var(--margin-page) var(--space-row);
        }
        .board > * {
          grid-column: 2 / -2;
        }

        /* ── Station header ─────────────────────────────────────────
           NEW YORK left (sans, larger), atmospherics right (mono).
           This is the page's "station name + current conditions" bar
           — pinned to the top of the board, not the global masthead.
           The masthead clock in Frame ticks throughout the scroll;
           this header sets the location once at entry. */
        .board__station {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--ink-hair);
        }
        .board__city {
          font-family: var(--font-stack-sans);
          font-size: clamp(20px, 2.4vw, 32px);
          font-weight: 500;
          letter-spacing: -0.01em;
          color: var(--ink);
        }
        .board__atmos {
          display: inline-flex;
          align-items: baseline;
          gap: 10px;
          font-family: var(--font-stack-mono);
          font-size: var(--type-nav);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--ink-3);
        }
        .board__sep { color: var(--ink-4); }
        .board__season {
          color: var(--ink);
          font-size: 12px;
          letter-spacing: 0;
          text-transform: none;
        }

        /* ── Void ──────────────────────────────────────────────────
           The hardest-working space on the page. On a 13" laptop this
           is breathing room; on a 27" display it's a statement. The
           emptiness is the first thing the visitor reads. */
        .board__void {
          height: clamp(96px, 18vh, 200px);
        }

        /* ── Featured piece ────────────────────────────────────────
           One photograph. The single visual statement that prevents
           the board from reading as a developer README. */
        .board__featured {
          margin: 0;
          display: grid;
          gap: 12px;
        }
        .board__featured-link {
          display: block;
          background: var(--paper-2);
          /* No hover transform — it's a photograph, not a button. The
             caption below carries the link affordance. */
        }
        .board__plate {
          position: relative;
          display: block;
          width: 100%;
          aspect-ratio: 16 / 9;
          overflow: hidden;
        }
        .board__media {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .board__caption {
          display: inline-flex;
          align-items: baseline;
          flex-wrap: wrap;
          gap: 8px;
          font-family: var(--font-stack-mono);
          font-size: var(--type-nav);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--ink-3);
        }
        .board__caption-title { color: var(--ink); }
        .board__caption-sep { color: var(--ink-4); }
        .board__caption-meta { color: var(--ink-3); }

        /* ── Section header (label + meta + hairline) ──────────────
           Mono uppercase label flush left, mono meta flush right,
           hairline rule below. The label sits ON the rule's top edge
           via padding-top: 0 — reads as stamped onto the line, not
           hovering above it. */
        .section {
          display: grid;
          gap: 16px;
        }
        .section__head {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--ink-hair);
        }
        .section__label {
          font-family: var(--font-stack-mono);
          font-size: var(--type-nav);
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--ink-3);
        }
        .section--dim .section__label { color: var(--ink-4); }
        .section__meta {
          font-family: var(--font-stack-mono);
          font-size: var(--type-meta);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--ink-4);
        }

        /* ── Timetable rows ────────────────────────────────────────
           Five-column grid: number / title / sector / year / status.
           Title is sans (the content register), all others are mono
           (the structural register). Same font-size; weight + family
           do all the differentiation. */
        .tt {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
        }
        .tt__row {
          border-bottom: 1px solid var(--ink-hair);
        }
        .tt__row:last-child {
          border-bottom: none;
        }
        .tt__link {
          display: grid;
          grid-template-columns:
            [num] 64px
            [title] minmax(0, 1.4fr)
            [sector] minmax(0, 1fr)
            [year] auto
            [status] 120px;
          align-items: baseline;
          gap: clamp(12px, 2vw, 24px);
          padding: 18px 0;
          transition: background 200ms var(--ease);
        }
        .tt__row:hover {
          background: var(--paper-2);
          /* Subtle row-tint hover — replaces the per-element opacity
             dance with a single environmental shift. The actual links
             beneath stay still; only the surface lifts a half-step. */
        }
        .tt__num {
          font-family: var(--font-stack-mono);
          font-size: var(--type-nav);
          letter-spacing: 0.06em;
          color: var(--ink-4);
          /* Mono numbers sit slightly higher than sans titles at the
             same nominal size — translateY pulls them down one px so
             the optical baseline matches. */
          transform: translateY(1px);
        }
        .tt__title {
          font-family: var(--font-stack-sans);
          font-size: clamp(15px, 1.5vw, 19px);
          font-weight: 500;
          letter-spacing: -0.005em;
          color: var(--ink);
          line-height: 1.2;
        }
        .tt__sector {
          font-family: var(--font-stack-mono);
          font-size: var(--type-meta);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--ink-3);
        }
        .tt__year {
          font-family: var(--font-stack-mono);
          font-size: var(--type-meta);
          letter-spacing: 0.06em;
          color: var(--ink-3);
        }
        .tt__status {
          display: inline-flex;
          align-items: baseline;
          gap: 8px;
          font-family: var(--font-stack-mono);
          font-size: var(--type-meta);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--ink-3);
          justify-self: end;
        }
        .tt__glyph {
          font-size: 11px;
          line-height: 1;
          /* Glyph baseline runs slightly off the cap height — pull
             down 1px to land on the row's baseline. */
          transform: translateY(0.5px);
        }
        .tt__status[data-status="shipped"] .tt__glyph { color: var(--ink); }
        .tt__status[data-status="wip"] {
          color: var(--accent);
        }
        .tt__status[data-status="wip"] .tt__glyph { color: var(--accent); }

        /* ── LIVE row pulse ────────────────────────────────────────
           Only the status cell breathes — the title and the rest of
           the row stay still. A whole-row pulse reads as urgent /
           anxious; a status-cell-only pulse reads as the indicator
           light on a board, which is what we want. */
        .tt__row[data-live] .tt__status {
          animation: tt-live 2.6s ease-in-out infinite;
        }
        @keyframes tt-live {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.55; }
        }
        @media (prefers-reduced-motion: reduce) {
          .tt__row[data-live] .tt__status { animation: none; }
        }

        .tt__arrow {
          font-family: var(--font-stack-sans);
          color: var(--ink-4);
          transition: transform 200ms var(--ease), color 200ms var(--ease);
          display: inline-block;
        }
        .tt__row:hover .tt__arrow {
          color: var(--ink);
          transform: translateX(4px);
        }

        /* ── Currently prose ───────────────────────────────────────
           Sans, ink-2, max 56ch. The CURRENTLY label runs faintest
           (--ink-4 via .section--dim) so the prose below can carry
           the page's voice without the chrome competing. */
        .board__prose {
          font-family: var(--font-stack-sans);
          font-size: var(--type-statement);
          line-height: 1.5;
          color: var(--ink-2);
          max-width: 56ch;
          margin: 0;
          padding: 6px 0;
          text-wrap: pretty;
        }

        /* ── Footer ───────────────────────────────────────────────
           Email left + atmospherics right. The same atmospherics line
           as the station header — bookends the page in real-time data.
           No socials, no colophon, no bio. The page's voice is the
           index above; the footer is just the edge. */
        .board__foot {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 24px;
          padding-top: 28px;
          margin-top: clamp(48px, 6vw, 96px);
          border-top: 1px solid var(--ink-hair);
        }
        .board__email {
          font-family: var(--font-stack-mono);
          font-size: var(--type-nav);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--ink);
          background-image: linear-gradient(currentColor, currentColor);
          background-size: 0% 1px;
          background-position: 0 100%;
          background-repeat: no-repeat;
          transition: background-size 200ms var(--ease);
        }
        .board__email:hover { background-size: 100% 1px; }

        /* ── Mobile ───────────────────────────────────────────────
           The 5-col timetable cannot survive at 375px — collapse to
           a stacked layout: number + status on one row, title on the
           next, sector + year on a third. Hairlines still separate
           rows, but each row is now three lines tall. */
        @media (max-width: 760px) {
          .board {
            grid-template-columns: 1fr;
            row-gap: clamp(40px, 8vh, 64px);
          }
          .board > * { grid-column: 1 / -1; }
          .board__void { height: clamp(48px, 12vh, 96px); }

          .tt__link {
            grid-template-columns: auto 1fr auto;
            grid-template-areas:
              "num    title   status"
              "sector sector  year";
            gap: 8px 12px;
            padding: 14px 0;
          }
          .tt__num    { grid-area: num; }
          .tt__title  { grid-area: title; font-size: 16px; }
          .tt__status { grid-area: status; }
          .tt__sector { grid-area: sector; }
          .tt__year   { grid-area: year; justify-self: end; }
        }
      `}</style>
    </main>
  );
}

function Section({
  label,
  meta,
  dim,
  children,
}: {
  label: string;
  meta?: string;
  dim?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className={`section${dim ? " section--dim" : ""}`} aria-label={label}>
      <header className="section__head">
        <h2 className="section__label">{label}</h2>
        {meta && <span className="section__meta tabular">{meta}</span>}
      </header>
      {children}
    </section>
  );
}
