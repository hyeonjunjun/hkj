import Link from "next/link";
import Image from "next/image";
import { PIECES, type Piece } from "@/constants/pieces";
import { CONTACT_EMAIL } from "@/constants/contact";

/**
 * / — editorial homepage on the hs68.la line.
 *
 * Sections (top → bottom):
 *   1. Hero tagline — two-line, large sans, slash-divided
 *   2. Statement   — short prose ledger
 *   3. Featured    — 2×2 square plate grid (first 4 pieces)
 *   4. Archive     — numbered, dated row list (all 7)
 *   5. Footer      — quiet mono caps registration line
 *
 * The CloudscapeWallpaper sits behind everything as fixed atmosphere
 * (heavy paper overlay so the photograph reads as ground, not figure).
 * The Frame chrome layers above as fixed corner notation.
 */
export default function Home() {
  const featured = PIECES.slice(0, 4);
  // Archive preserves curated PIECES order — numbers match catalog
  // sequence (01–07). Real pieces sit at their declared positions;
  // placeholders hold the rhythm of the index until claimed.
  const archive = PIECES;

  return (
    <main id="main" className="home">
      <section className="home__hero" aria-label="Tagline">
        <h1 className="home__tagline">
          <span className="home__tagline-line">Designer &amp; Engineer</span>
          <span className="home__tagline-line home__tagline-line--2">
            <span className="home__tagline-slash" aria-hidden>/ </span>
            Studio of One, New York
          </span>
        </h1>
      </section>

      <section className="home__statement" aria-label="Statement">
        <p className="home__statement-body">
          Ryan Jun is a designer and engineer in New York, building
          interfaces, brands, and the small things between them.
        </p>
        <p className="home__statement-meta">
          <span>Studio 2026</span>
          <span className="home__statement-sep" aria-hidden>·</span>
          <span>Available for selective engagements</span>
        </p>
      </section>

      <section className="home__featured" aria-label="Featured work">
        <header className="home__section-head">
          <span>Featured</span>
          <span className="home__section-head-meta">
            {featured.length} of {PIECES.length}
          </span>
        </header>
        <ol className="home__featured-grid">
          {featured.map((piece) => (
            <li key={piece.slug}>
              <FeaturedPlate piece={piece} />
            </li>
          ))}
        </ol>
      </section>

      <section className="home__archive" aria-label="Archive">
        <header className="home__section-head">
          <span>Index</span>
          <span className="home__section-head-meta">
            {archive.length} entries · 2025–2026
          </span>
        </header>
        <ol className="home__archive-list">
          {archive.map((piece) => (
            <li key={piece.slug}>
              <ArchiveRow piece={piece} />
            </li>
          ))}
        </ol>
      </section>

      <footer className="home__footer" aria-label="Colophon">
        <span>Ryan Jun</span>
        <span className="home__footer-sep" aria-hidden>·</span>
        <span>New York</span>
        <span className="home__footer-sep" aria-hidden>·</span>
        <span className="tabular">2026</span>
        <span className="home__footer-sep" aria-hidden>·</span>
        <a className="home__footer-mail" href={`mailto:${CONTACT_EMAIL}`}>
          {CONTACT_EMAIL}
        </a>
      </footer>

      <HomeStyle />
    </main>
  );
}

function FeaturedPlate({ piece }: { piece: Piece }) {
  const numberLabel = piece.number;
  const titleLabel = piece.placeholder ? "Untitled" : piece.title;
  const yearLabel = String(piece.year);
  const cover = piece.cover;

  const inner = (
    <article className="plate" data-placeholder={piece.placeholder ? "" : undefined}>
      <div className="plate__frame">
        {!piece.placeholder && cover?.kind === "image" ? (
          <Image
            src={cover.src}
            alt={`${piece.title} — cover`}
            fill
            sizes="(max-width: 720px) 100vw, 640px"
            className="plate__media"
            style={{ objectFit: "cover" }}
          />
        ) : !piece.placeholder && cover?.kind === "video" ? (
          <video
            className="plate__media"
            src={cover.src}
            poster={cover.poster}
            muted
            loop
            playsInline
            autoPlay
            preload="metadata"
            aria-hidden
          />
        ) : null}
      </div>
      <footer className="plate__caption">
        <span className="plate__num tabular">{numberLabel}</span>
        <span className="plate__title">{titleLabel}</span>
        <span className="plate__year tabular">{yearLabel}</span>
      </footer>
    </article>
  );

  if (piece.placeholder) return inner;
  return (
    <Link href={`/work/${piece.slug}`} className="plate-link" aria-label={`${titleLabel} — view`}>
      {inner}
    </Link>
  );
}

function ArchiveRow({ piece }: { piece: Piece }) {
  const isReal = !piece.placeholder;
  const titleLabel = piece.placeholder ? "Untitled" : piece.title;
  const dateLabel = isReal ? piece.started : "—";
  const sectorLabel = isReal ? piece.sector : "Reserved";
  const inner = (
    <div className="row">
      <span className="row__num tabular" aria-hidden>{piece.number}</span>
      <span className="row__title">{titleLabel}</span>
      <span className="row__date tabular">{dateLabel}</span>
      <span className="row__sector">{sectorLabel}</span>
      <span className="row__action" aria-hidden>
        {isReal ? "View →" : "Soon"}
      </span>
    </div>
  );
  if (!isReal) return <div className="row-link row-link--disabled">{inner}</div>;
  return (
    <Link href={`/work/${piece.slug}`} className="row-link" aria-label={`${titleLabel} — view`}>
      {inner}
    </Link>
  );
}

function HomeStyle() {
  return (
    <style>{`
      .home {
        position: relative;
        z-index: 1;
        min-height: 100svh;
        max-width: 1280px;
        margin-inline: auto;
        padding: clamp(140px, 22vh, 220px) clamp(24px, 5vw, 64px) clamp(80px, 12vh, 120px);
        display: grid;
        gap: clamp(80px, 14vh, 144px);
      }

      /* ─── Hero tagline ────────────────────────────────────────────── */
      .home__hero {
        max-width: 1100px;
      }
      .home__tagline {
        display: block;
        font-family: var(--font-stack-sans);
        font-weight: 400;
        font-size: clamp(40px, 7vw, 88px);
        line-height: 0.98;
        letter-spacing: -0.022em;
        color: var(--ink);
        text-shadow: 0 0 18px rgba(248, 245, 236, 0.45);
        margin: 0;
      }
      html[data-theme="dark"] .home__tagline {
        text-shadow: 0 0 18px rgba(14, 13, 9, 0.5);
      }
      .home__tagline-line {
        display: block;
      }
      .home__tagline-line--2 {
        color: var(--ink-2);
      }
      .home__tagline-slash {
        color: var(--ink-3);
        font-weight: 300;
      }

      /* ─── Statement ───────────────────────────────────────────────── */
      .home__statement {
        max-width: 56ch;
        display: grid;
        gap: 22px;
      }
      .home__statement-body {
        font-family: var(--font-stack-sans);
        font-weight: 400;
        font-size: clamp(15px, 1.3vw, 18px);
        line-height: 1.55;
        color: var(--ink-2);
        margin: 0;
        text-wrap: pretty;
      }
      .home__statement-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        font-family: var(--font-stack-mono);
        font-size: 11px;
        line-height: 1;
        letter-spacing: var(--microtype-tracking);
        text-transform: uppercase;
        color: var(--ink-3);
        font-variant-numeric: tabular-nums;
        margin: 0;
      }
      .home__statement-sep { color: var(--ink-4); }

      /* ─── Section heading (Featured / Index) ──────────────────────── */
      .home__section-head {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        gap: 24px;
        padding-bottom: 14px;
        margin-bottom: clamp(20px, 2.4vw, 32px);
        border-bottom: 1px solid var(--ink-hair);
        font-family: var(--font-stack-mono);
        font-size: 11px;
        line-height: 1;
        letter-spacing: var(--microtype-tracking);
        text-transform: uppercase;
        color: var(--ink);
        font-variant-numeric: tabular-nums;
      }
      .home__section-head-meta { color: var(--ink-3); }

      /* ─── Featured grid (2×2 square) ──────────────────────────────── */
      .home__featured-grid {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: clamp(16px, 2vw, 28px);
      }

      .plate-link {
        display: block;
        color: inherit;
      }
      .plate {
        display: grid;
        gap: 14px;
      }
      .plate__frame {
        position: relative;
        width: 100%;
        aspect-ratio: 1 / 1;
        background: var(--paper-2);
        overflow: hidden;
        outline: 1px solid var(--ink-hair);
        outline-offset: -1px;
        transition: outline-color 240ms var(--ease);
      }
      .plate-link:hover .plate__frame { outline-color: var(--ink-3); }
      .plate__media {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
        transition: transform 360ms var(--ease);
      }
      .plate-link:hover .plate__media { transform: scale(1.012); }
      .plate[data-placeholder] .plate__frame {
        background: var(--paper-2);
      }
      .plate[data-placeholder] .plate__frame::after {
        content: "";
        position: absolute;
        inset: 0;
        background:
          repeating-linear-gradient(
            45deg,
            transparent 0,
            transparent 14px,
            var(--ink-hair) 14px,
            var(--ink-hair) 15px
          );
        opacity: 0.6;
      }

      .plate__caption {
        display: grid;
        grid-template-columns: auto 1fr auto;
        align-items: baseline;
        gap: 12px;
        padding-top: 2px;
        font-family: var(--font-stack-mono);
        font-size: 11px;
        line-height: 1.2;
        letter-spacing: var(--microtype-tracking);
        text-transform: uppercase;
        color: var(--ink);
        font-variant-numeric: tabular-nums;
      }
      .plate[data-placeholder] .plate__caption { color: var(--ink-3); }
      .plate__num { color: var(--ink-3); }
      .plate__year { color: var(--ink-3); }
      .plate__title {
        font-family: var(--font-stack-sans);
        font-size: 13px;
        letter-spacing: 0;
        text-transform: none;
        color: inherit;
        font-weight: 500;
      }

      @media (max-width: 720px) {
        .home__featured-grid { grid-template-columns: 1fr; }
      }

      /* ─── Archive list ─────────────────────────────────────────────── */
      .home__archive-list {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        gap: 0;
      }
      .home__archive-list > li + li .row { border-top: 1px solid var(--ink-hair); }
      .home__archive-list > li:first-child .row { border-top: 1px solid var(--ink-hair); }
      .home__archive-list > li:last-child .row { border-bottom: 1px solid var(--ink-hair); }

      .row-link {
        display: block;
        color: inherit;
        transition: padding-left 220ms var(--ease);
      }
      .row-link:hover { padding-left: 6px; }
      .row-link--disabled {
        cursor: default;
        color: var(--ink-3);
      }
      .row {
        display: grid;
        grid-template-columns: 56px 1fr 100px 200px 80px;
        align-items: baseline;
        gap: 24px;
        padding: 18px 4px;
        font-family: var(--font-stack-mono);
        font-size: 12px;
        line-height: 1.2;
        letter-spacing: var(--microtype-tracking);
        text-transform: uppercase;
        font-variant-numeric: tabular-nums;
        transition: border-color 220ms var(--ease);
      }
      .row__num { color: var(--ink-3); }
      .row__title {
        font-family: var(--font-stack-sans);
        font-size: 16px;
        letter-spacing: 0;
        text-transform: none;
        color: var(--ink);
        font-weight: 500;
      }
      .row-link--disabled .row__title { color: var(--ink-3); font-weight: 400; }
      .row__date { color: var(--ink-2); }
      .row__sector { color: var(--ink-3); }
      .row__action {
        color: var(--ink);
        text-align: right;
        transition: transform 220ms var(--ease);
      }
      .row-link--disabled .row__action { color: var(--ink-4); }
      .row-link:hover .row__action { transform: translateX(6px); }

      @media (max-width: 860px) {
        .row {
          grid-template-columns: 40px 1fr auto;
          gap: 14px;
        }
        .row__sector,
        .row__action { display: none; }
      }

      /* ─── Footer ───────────────────────────────────────────────────── */
      .home__footer {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        padding-top: clamp(40px, 6vh, 80px);
        border-top: 1px solid var(--ink-hair);
        font-family: var(--font-stack-mono);
        font-size: 11px;
        line-height: 1;
        letter-spacing: var(--microtype-tracking);
        text-transform: uppercase;
        color: var(--ink-3);
        font-variant-numeric: tabular-nums;
      }
      .home__footer-sep { color: var(--ink-4); }
      .home__footer-mail {
        color: var(--ink);
        transition: opacity 180ms var(--ease);
      }
      .home__footer-mail:hover { opacity: 0.65; }

      @media (prefers-reduced-motion: reduce) {
        .row-link, .row__action, .plate__media { transition: none; }
        .row-link:hover { padding-left: 0; }
        .row-link:hover .row__action { transform: none; }
        .plate-link:hover .plate__media { transform: none; }
      }
    `}</style>
  );
}
