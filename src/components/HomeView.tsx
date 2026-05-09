import Image from "next/image";
import Link from "next/link";
import type { Piece } from "@/constants/pieces";
import LiveTime from "@/components/LiveTime";

/**
 * HomeView — single-composition portfolio (Krantz line).
 *
 * The whole thesis in one frame: a name banner, a four-column intro
 * (Practice / Currently / Reading / Links), and an 8-column element
 * grid of square cells. Project cells, media cells, info cells, and
 * empty cells share the same hairline grid — each cell is one cell,
 * weighted equally. Photography is interspersed inside the grid as
 * peers of the text cells, not as a featured hero above it.
 *
 * Cell types share the same skeleton: small index number top, big
 * symbol mid-bottom, name + category at the bottom edge. Media cells
 * are full-bleed; empty cells render only their borders. The grid
 * IS the page; there is no "scroll to see more."
 *
 * Reference: juliakrantz.com — element-grid pattern, intro-section
 * pattern, hairline cell borders, the periodic-table-of-practice
 * organizing fiction. Adapted (not copied): we drop the chemistry
 * symbol layer and let the project number do the visual job, and
 * we keep the live time + Korean season + weather as content cells
 * inside the grid rather than as a separate live-data bar.
 */

type Props = { pieces: Piece[] };

const KOREAN_SEASON = (m: number): string => {
  if (m >= 3 && m <= 5) return "봄";
  if (m >= 6 && m <= 8) return "여름";
  if (m >= 9 && m <= 11) return "가을";
  return "겨울";
};

const STATUS_GLYPH = { shipped: "●", wip: "◇" } as const;

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
              practices and studios — sketch through final ship, the
              same set of hands carrying the work the entire way.{" "}
              <Link href="/studio">↗</Link>
            </p>
          </div>
        </div>

        <div className="intro__cell">
          <span className="cell-label">Currently</span>
          <ul className="ps-list" role="list">
            <li className="ps-row">
              <span className="ps-num" aria-hidden>◇</span>
              <span className="ps-name">
                <Link href="/work/la28">LA28 — Brand campaign ↗</Link>
              </span>
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
            <li className="ps-row"><span className="ps-num">03</span><span className="ps-name ps-name--mid">The Architecture of Happiness</span></li>
            <li className="ps-row"><span className="ps-num">04</span><span className="ps-name ps-name--mid">A Pattern Language</span></li>
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
        {/* Row 1 — Stray mark · LA28 video · LA28 text · Live time · NYC · Empty · Halo media · Halo text */}
        <InfoCell num="01" sym="St" name="stray" cat="Studio" />
        <MediaCell piece={real[0]} />
        <ProjectCell idx="02" piece={real[0]} />
        <TimeCell num="03" />
        <InfoCell num="04" sym="Ny" name="New York" cat="Location" />
        <EmptyCell />
        <MediaCell piece={real[1]} />
        <ProjectCell idx="05" piece={real[1]} />

        {/* Row 2 — Empty · Sift media · Sift text · Empty · Gyeol media · Gyeol text · Weather · Season */}
        <EmptyCell />
        <MediaCell piece={real[2]} />
        <ProjectCell idx="06" piece={real[2]} />
        <EmptyCell />
        <MediaCell piece={real[3]} />
        <ProjectCell idx="07" piece={real[3]} />
        <InfoCell num="08" sym={weather} name={conditions} cat="Weather · NYC" tabular />
        <InfoCell num="09" sym={season} name="Spring" cat="Season" lang="ko" />

        {/* Row 3 — Role · Empty · Empty · Note · Empty · Empty · Email · Empty */}
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
        <span className="foot__copy">© 2026 stray · Ryan Jun</span>
        <a href="mailto:ryan@ryanjun.com" className="foot__cta">
          Get in touch → ryan@ryanjun.com
        </a>
      </footer>

      <style>{`
        /* Page fade-in — single global entry, 220ms, never staggers.
           Krantz pattern: the whole composition resolves at once. */
        @keyframes pagefadein { from { opacity: 0; } to { opacity: 1; } }
        .page {
          animation: pagefadein 220ms ease;
          padding: 0 var(--margin-page);
          max-width: 1440px;
          margin-inline: auto;
        }
        @media (prefers-reduced-motion: reduce) {
          .page { animation: none; }
        }

        /* ── Name banner ─────────────────────────────────────────
           h1 left at clamp 28-52px, email-as-CTA right (smaller mono,
           baseline-aligned). One row, no border above (the page top
           is air); border below comes from the intro section's top
           border so the banner reads as flush with the grid. */
        .name-banner {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 24px;
          flex-wrap: wrap;
          padding: clamp(20px, 2.4vw, 36px) 0;
        }
        .name-banner__h1 {
          font-family: var(--font-stack-sans);
          font-size: clamp(28px, 4vw, 56px);
          font-weight: 500;
          letter-spacing: -0.04em;
          line-height: 1;
          color: var(--ink);
          margin: 0;
          text-transform: lowercase;
        }
        .name-banner__cta {
          font-family: var(--font-stack-mono);
          font-size: var(--type-nav);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--ink-3);
          transition: color 200ms var(--ease);
        }
        .name-banner__cta:hover { color: var(--ink); }

        /* ── Intro section ───────────────────────────────────────
           Four columns: about (2fr — bio prose), currently (1fr),
           reading (1fr), links (0.8fr). All cells share hairline
           borders forming a complete grid. About cell holds prose;
           the rest hold numbered ps-lists. */
        .intro {
          display: grid;
          grid-template-columns: 2fr 1.2fr 1fr 0.8fr;
          border-top: 1px solid var(--ink-hair);
          border-left: 1px solid var(--ink-hair);
        }
        .intro__cell {
          border-right: 1px solid var(--ink-hair);
          border-bottom: 1px solid var(--ink-hair);
          display: flex;
          flex-direction: column;
          min-width: 0;
        }
        .cell-label {
          font-family: var(--font-stack-mono);
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--ink-3);
          padding: 10px clamp(14px, 1.4vw, 20px);
          border-bottom: 1px solid var(--ink-hair);
          flex-shrink: 0;
        }
        .intro__body {
          padding: clamp(18px, 2.4vw, 32px) clamp(14px, 1.4vw, 20px);
        }
        .intro__body p {
          font-family: var(--font-stack-sans);
          font-size: clamp(13px, 0.95vw, 15px);
          line-height: 1.6;
          color: var(--ink-2);
          font-weight: 400;
          max-width: 56ch;
          margin: 0;
        }
        .intro__body a {
          color: var(--ink-3);
          transition: color 200ms var(--ease);
        }
        .intro__body a:hover { color: var(--ink); }

        /* Numbered list — one row each, hairline-separated, mono num
           + sans name (Krantz: clash for both, but we have only the
           Geist family so we differentiate via the family split). */
        .ps-list {
          list-style: none;
          margin: 0;
          padding: 0;
          flex: 1;
        }
        .ps-row {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0 clamp(14px, 1.4vw, 20px);
          height: 32px;
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
          min-width: 24px;
          flex-shrink: 0;
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

        /* ── Element grid ────────────────────────────────────────
           8 columns, each cell aspect-ratio 1/1 (perfect square).
           Hairline borders form a complete grid. Mix of project
           cells, media cells, info cells, empty cells. */
        .grid {
          display: grid;
          grid-template-columns: repeat(8, 1fr);
          border-top: 1px solid var(--ink-hair);
          border-left: 1px solid var(--ink-hair);
          margin-top: -1px;
        }
        .cell {
          border-right: 1px solid var(--ink-hair);
          border-bottom: 1px solid var(--ink-hair);
          aspect-ratio: 1 / 1;
          display: flex;
          flex-direction: column;
          padding: clamp(12px, 1.2vw, 18px);
          min-width: 0;
          min-height: 0;
          overflow: hidden;
          position: relative;
        }
        .cell--empty {
          /* Just borders — the negative space is the content. */
        }
        .cell__num {
          font-family: var(--font-stack-mono);
          font-size: 10px;
          letter-spacing: 0.05em;
          color: var(--ink-3);
          line-height: 1;
        }
        .cell__sym {
          font-family: var(--font-stack-sans);
          font-size: clamp(20px, 2.2vw, 32px);
          font-weight: 500;
          letter-spacing: -0.04em;
          line-height: 1;
          color: var(--ink);
          margin: auto 0 6px;
        }
        .cell__sym--time {
          font-family: var(--font-stack-mono);
          font-size: clamp(16px, 1.8vw, 22px);
          letter-spacing: 0.02em;
          font-weight: 400;
        }
        .cell__sym--ko {
          font-family: var(--font-stack-sans);
        }
        .cell__name {
          font-family: var(--font-stack-sans);
          font-size: clamp(11px, 0.9vw, 13px);
          line-height: 1.3;
          color: var(--ink);
          margin-bottom: 4px;
          overflow-wrap: break-word;
        }
        .cell__name a { color: inherit; }
        .cell__cat {
          font-family: var(--font-stack-mono);
          font-size: 9px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--ink-3);
          line-height: 1.3;
        }

        /* Project cells link to /work/[slug]; whole cell is the
           hit area. Subtle background-tint hover instead of
           transform — cell is a square in a grid; we don't want
           it to lift. */
        .cell--proj {
          transition: background 240ms var(--ease);
        }
        .cell--proj:hover {
          background: var(--paper-2);
        }

        /* WIP / live status — diamond glyph, no amber, no pulse.
           Krantz uses no accent color anywhere. The diamond vs.
           filled-circle does the state work on its own. */
        .cell__status {
          display: inline-flex;
          align-items: baseline;
          gap: 6px;
          font-family: var(--font-stack-mono);
          font-size: 9px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--ink-3);
        }
        .cell__status[data-status="wip"] { color: var(--ink); }
        .cell__status .glyph { font-size: 10px; }

        /* ── Media cells ─────────────────────────────────────────
           Full-bleed image/video, slightly dimmed at rest, brightens
           on hover. Title overlay fades in from bottom on hover. */
        .cell--media {
          padding: 0;
        }
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
          padding: 8px 10px;
          background: linear-gradient(transparent, rgba(0, 0, 0, 0.72));
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
        .cell--media:hover .cell__overlay,
        .cell--media:focus-within .cell__overlay {
          opacity: 1;
          transform: translateY(0);
        }

        /* ── Footer ──────────────────────────────────────────────
           Plain row. Copy left in mono uppercase, CTA right in sans.
           No border-top on the footer itself — the grid's bottom
           border closes the composition; the footer is an outdented
           tail. */
        .foot {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: clamp(20px, 2.4vw, 32px) 0 clamp(36px, 4vw, 56px);
          gap: 24px;
          flex-wrap: wrap;
        }
        .foot__copy {
          font-family: var(--font-stack-mono);
          font-size: var(--type-nav);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--ink-3);
        }
        .foot__cta {
          font-family: var(--font-stack-sans);
          font-size: 13px;
          color: var(--ink);
          transition: color 200ms var(--ease);
        }
        .foot__cta:hover { color: var(--ink-3); }

        /* ── Responsive ─────────────────────────────────────────
           Below 1100px: intro to 3 cols, grid to 5 cols.
           Below 760px: intro stacks; grid to 2 cols, empty cells
           hidden so we don't waste rows on negative space. */
        @media (max-width: 1100px) {
          .intro { grid-template-columns: 2fr 1fr 1fr; }
          .intro__cell--links { grid-column: 3; }
          .grid { grid-template-columns: repeat(5, 1fr); }
        }
        @media (max-width: 760px) {
          .name-banner { padding: 16px 0; }
          .intro { grid-template-columns: 1fr; }
          .intro__cell--about { grid-column: 1 / -1; }
          .grid { grid-template-columns: repeat(2, 1fr); }
          .cell--empty { display: none; }
          .cell__sym { font-size: 22px; }
          .cell__sym--time { font-size: 18px; }
        }
      `}</style>
    </main>
  );
}

/* ── Cell components ───────────────────────────────────────────
   Each cell is a tiny composition: small num top, big sym in the
   middle, name + cat at the bottom. Variants below trade the body
   contents but keep the skeleton, so the grid reads as one system. */

function ProjectCell({ idx, piece }: { idx: string; piece: Piece }) {
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
          sizes="(max-width: 760px) 50vw, 12.5vw"
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
      <span className="cell__cat">New York · Live</span>
    </div>
  );
}

function NoteCell({ num }: { num: string }) {
  return (
    <Link href="/notes/n-001" className="cell cell--proj">
      <span className="cell__num tabular">{num}</span>
      <span className="cell__sym">N-01</span>
      <span className="cell__name">On restraint as the hardest move</span>
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
