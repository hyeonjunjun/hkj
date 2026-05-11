"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Piece } from "@/constants/pieces";
import NowPlaying from "@/components/NowPlaying";
import PixelEQ from "@/components/PixelEQ";
import { CONTACT_EMAIL } from "@/constants/contact";

/**
 * HomeView — editorial / vinyl-manifest direction.
 *
 *   ┌─ MASTHEAD (sticky) ──────────────────────────────────────────────┐
 *   │ rj                       index, about         ▪▪▪▫▫ NowPlaying  │
 *   ├──────────────────────────────────────────────────────────────────┤
 *   │  Vol. 01 · RJ001 · New York · 2024 — present                     │
 *   │                                                                  │
 *   │  RYAN JUN.                                                       │
 *   │  Design engineer working between brand identity and the          │
 *   │  software it lives inside — building things slowly               │
 *   │  enough to mean them.                                            │
 *   ├──────────────────────────────────────────────────────────────────┤
 *   │  TYPE      NO.  WORK-RATE      PROJECT     CLIENT   DURATION    │
 *   │  ────────────────────────────────────────────────────────────── │
 *   │  BRAND    [01]  ▁▁▂▃▄▆▇████▇   LA28        Personal  04.26 → ▸ │
 *   │  BRAND    [02]  ▂▄▇█▇▆▅▃▂▁▁▁   Halo Halo!  Halo Halo! 04.26—09 │
 *   │  PRODUCT  [03]  ▁▂▃▅▆▇█▇▆▅▃▁   Sift        Self      09.25—12 │
 *   │  BRAND    [04]  ▁▂▃▅▇█████▆▃   Gyeol: 결    Gyeol      02.26—04 │
 *   │  — Side B · Reserved                                             │
 *   │  BRAND    [05]  ░░░░░░░░░░░░   Untitled    —          q3.26    │
 *   │  ...                                                             │
 *   ├──────────────────────────────────────────────────────────────────┤
 *   │ [Side A/B]  Ryan Jun · RJ001 · NYC · hyeonjunjun.com            │
 *   │             rykjun@gmail.com   currently: LA28 · listening: …   │
 *   └──────────────────────────────────────────────────────────────────┘
 *
 * Reference: Fred Again — USB001 back-cover manifest. The columns
 * (TYPE / NO. / WORK-RATE / PROJECT / CLIENT / DURATION) parallel
 * Fred's (SIDE / NUMBER / WAVEFORM / TITLE / BPM / TIME). The work-
 * rate column uses U+2581—U+2588 block elements as a typographic
 * waveform — same shape language, no SVG.
 *
 * Music shows up only as PixelEQ + NowPlaying in the masthead and
 * in the colophon footer. The page itself is typography first.
 *
 * Floating cover preview on row hover stays (Rauno / Bureau Borsche).
 */

type Props = { pieces: Piece[] };

// Compact duration formatting: YYYY-MM → "MM.YY".
function fmtMonth(stamp?: string): string {
  if (!stamp) return "—";
  const [y, m] = stamp.split("-");
  if (!y || !m) return stamp;
  return `${m}.${y.slice(2)}`;
}

function fmtDuration(piece: Piece): string {
  const start = fmtMonth(piece.started);
  if (piece.placeholder) return "q3 → q4 · 26";
  if (piece.status === "wip" || !piece.ended) return `${start} → live`;
  return `${start} — ${fmtMonth(piece.ended)}`;
}

// Default reserved waveform — light-shade U+2591 ×12, reads as
// "awaiting signal" against the data rows above.
const RESERVED_WAVE = "░░░░░░░░░░░░";

function shortType(sector: string): string {
  // Take the first segment of the sector ("Brand · Campaign · Personal"
  // → "Brand") so the TYPE column stays tight. Uppercase for tag feel.
  const head = sector.split("·")[0]?.trim() ?? sector;
  return head.toUpperCase();
}

export default function HomeView({ pieces }: Props) {
  const all = pieces.slice().sort((a, b) => a.order - b.order);
  const real = all.filter((p) => !p.placeholder);
  const reserved = all.filter((p) => p.placeholder);

  // Floating cover preview — single positioned element that follows
  // the cursor with a soft lerp when a setlist row is hovered.
  const previewRef = useRef<HTMLDivElement | null>(null);
  const [previewPiece, setPreviewPiece] = useState<Piece | null>(null);
  const rafRef = useRef(0);
  const posRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const tick = () => {
      const p = posRef.current;
      const k = 0.22;
      p.tx += (p.x - p.tx) * k;
      p.ty += (p.y - p.ty) * k;
      if (previewRef.current) {
        previewRef.current.style.transform = `translate3d(${p.tx}px, ${p.ty}px, 0)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    const onMove = (e: MouseEvent) => {
      posRef.current.x = e.clientX + 28;
      posRef.current.y = e.clientY + 24;
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <main id="main" className="ed">
      {/* MASTHEAD — sticky, mono, three slots */}
      <header className="ed__top">
        <Link href="/" className="ed__mark" aria-label="Ryan Jun — home">
          rj
        </Link>
        <nav className="ed__nav" aria-label="Primary">
          <Link href="/work" className="t-meta ed__nav-link" data-active="">
            index
          </Link>
          <span className="t-meta dimmer" aria-hidden>,</span>
          <Link href="/studio" className="t-meta ed__nav-link">
            about
          </Link>
        </nav>
        <div className="ed__now">
          <PixelEQ />
          <NowPlaying />
        </div>
      </header>

      <div className="ed__sheet">
        {/* HERO — album-cover positioning. The Vol. label sits over
            the name like a release tag, name + lede underneath. */}
        <section className="ed__hero" aria-label="About">
          <div className="ed__hero-tag">
            <span className="ed__hero-tag-pill">Vol. 01</span>
            <span className="t-meta dim">RJ001</span>
            <span className="t-meta dim">·</span>
            <span className="t-meta dim">new york</span>
            <span className="t-meta dim">·</span>
            <span className="t-meta dim">2024 — present</span>
          </div>
          <h1 className="ed__hero-name">Ryan Jun.</h1>
          <p className="ed__hero-lede">
            design engineer working between brand identity and the
            software it lives inside —{" "}
            <span className="ed__hero-em">
              building things slowly enough to mean them.
            </span>
          </p>
        </section>

        {/* SETLIST — Fred Again USB001 back-cover, adapted.
            Columns: TYPE / NO. / WORK-RATE / PROJECT / CLIENT / DURATION. */}
        <section
          className="ed__set"
          aria-label="Selected work"
          onMouseLeave={() => setPreviewPiece(null)}
        >
          <div className="ed__set-frame" role="table" aria-label="Setlist">
            <div className="ed__set-head" role="row">
              <span role="columnheader">type</span>
              <span role="columnheader">no.</span>
              <span role="columnheader">work-rate</span>
              <span role="columnheader">project</span>
              <span role="columnheader">client</span>
              <span role="columnheader">duration</span>
            </div>

            <ol className="ed__set-list" aria-label="Released">
              {real.map((piece) => (
                <li
                  key={piece.slug}
                  className="ed__set-row"
                  role="row"
                  onMouseEnter={() => setPreviewPiece(piece)}
                >
                  <Link
                    href={`/work/${piece.slug}`}
                    className="ed__set-link"
                    data-cursor="link"
                  >
                    <span className="ed__cell ed__cell--type" role="cell">
                      {shortType(piece.sector)}
                    </span>
                    <span className="ed__cell ed__cell--num" role="cell">
                      [{piece.number}]
                    </span>
                    <span className="ed__cell ed__cell--wave" role="cell">
                      {piece.waveform ?? "▁▂▃▄▅▆▇█▇▆▄▂"}
                    </span>
                    <span className="ed__cell ed__cell--title" role="cell">
                      {piece.title}
                      {piece.status === "wip" && (
                        <span className="ed__live-tag" aria-label="In progress">
                          live
                        </span>
                      )}
                    </span>
                    <span className="ed__cell ed__cell--client" role="cell">
                      {piece.client ?? "—"}
                    </span>
                    <span className="ed__cell ed__cell--dur" role="cell">
                      {fmtDuration(piece)}
                    </span>
                  </Link>
                </li>
              ))}
            </ol>

            {reserved.length > 0 && (
              <>
                <div className="ed__set-divider" role="separator">
                  <span className="t-meta dim">— Side B · Reserved</span>
                </div>
                <ol className="ed__set-list" aria-label="Reserved">
                  {reserved.map((piece) => (
                    <li
                      key={piece.slug}
                      className="ed__set-row ed__set-row--reserved"
                      role="row"
                    >
                      <span className="ed__set-link" aria-disabled>
                        <span className="ed__cell ed__cell--type" role="cell">
                          {shortType(piece.sector)}
                        </span>
                        <span className="ed__cell ed__cell--num" role="cell">
                          [{piece.number}]
                        </span>
                        <span className="ed__cell ed__cell--wave" role="cell">
                          {RESERVED_WAVE}
                        </span>
                        <span className="ed__cell ed__cell--title" role="cell">
                          untitled
                        </span>
                        <span className="ed__cell ed__cell--client" role="cell">
                          —
                        </span>
                        <span className="ed__cell ed__cell--dur" role="cell">
                          {fmtDuration(piece)}
                        </span>
                      </span>
                    </li>
                  ))}
                </ol>
              </>
            )}
          </div>
        </section>
      </div>

      {/* COLOPHON FOOTER — Fred Again's back-cover credits energy.
          Left: framed "Side A/B" pill. Middle: release metadata.
          Right: contact + currently-listening signal. */}
      <footer className="ed__bottom">
        <div className="ed__bottom-pill">Side A / B</div>

        <div className="ed__bottom-credit">
          <span className="t-meta">Ryan Jun</span>
          <span className="t-meta dim">·</span>
          <span className="t-meta dim">RJ001</span>
          <span className="t-meta dim">·</span>
          <span className="t-meta dim">Volume 01</span>
          <span className="t-meta dim">·</span>
          <a
            href="https://hyeonjunjun.com"
            className="t-meta ed__bottom-link"
          >
            hyeonjunjun.com
          </a>
        </div>

        <div className="ed__bottom-right">
          <div className="ed__currently-mini">
            <span className="t-meta dim">currently</span>
            <span className="t-meta">LA28 · brand campaign</span>
          </div>
          <div className="ed__currently-mini">
            <span className="t-meta dim">listening</span>
            <span className="ed__currently-play">
              <PixelEQ />
              <NowPlaying />
            </span>
          </div>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="t-meta ed__email"
            data-cursor="link"
          >
            {CONTACT_EMAIL} ↗
          </a>
        </div>
      </footer>

      {/* FLOATING COVER PREVIEW — single fixed div, transform lerps
          toward cursor in raf tick. */}
      <div
        ref={previewRef}
        className="ed__preview"
        data-visible={previewPiece && previewPiece.cover ? "" : undefined}
        aria-hidden
      >
        {previewPiece?.cover?.kind === "image" ? (
          <Image
            key={previewPiece.slug}
            src={previewPiece.cover.src}
            alt=""
            fill
            sizes="260px"
            className="ed__preview-media"
            priority={false}
          />
        ) : previewPiece?.cover?.kind === "video" ? (
          <video
            key={previewPiece.slug}
            src={previewPiece.cover.src}
            poster={previewPiece.cover.poster}
            autoPlay
            loop
            muted
            playsInline
            className="ed__preview-media"
          />
        ) : null}
      </div>

      <style>{`
        @keyframes edfadein { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }

        html, body { background: var(--paper); }

        .ed {
          color: var(--ink);
          min-height: 100dvh;
          width: 100%;
          padding: clamp(14px, 1.6vw, 22px) clamp(20px, 4vw, 56px) clamp(16px, 2vw, 28px);
          display: grid;
          grid-template-rows: auto 1fr auto;
          gap: clamp(28px, 4vw, 56px);
          animation: edfadein 420ms cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* ── Masthead ───────────────────────────────────────── */
        .ed__top {
          position: sticky;
          top: clamp(14px, 1.6vw, 22px);
          z-index: 5;
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          column-gap: clamp(16px, 2.4vw, 32px);
          padding-bottom: clamp(6px, 0.8vw, 10px);
          border-bottom: 1px solid var(--ink-hair);
          background: var(--paper);
        }
        .ed__mark {
          font-family: var(--font-stack-mono);
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: lowercase;
          color: var(--ink);
          line-height: 1;
          justify-self: start;
        }
        .ed__nav {
          display: inline-flex;
          align-items: baseline;
          gap: 6px;
          justify-self: center;
        }
        .ed__nav .t-meta { font-size: 11px; }
        .ed__nav-link {
          color: var(--ink);
          background-image: linear-gradient(currentColor, currentColor);
          background-size: 0% 1px;
          background-position: 0 100%;
          background-repeat: no-repeat;
          transition: background-size 200ms var(--ease);
        }
        .ed__nav-link[data-active],
        .ed__nav-link:hover { background-size: 100% 1px; }
        .ed__now {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          justify-self: end;
          max-width: min(45vw, 480px);
          overflow: hidden;
        }

        /* ── Sheet ──────────────────────────────────────────── */
        .ed__sheet {
          grid-row: 2;
          display: flex;
          flex-direction: column;
          gap: clamp(40px, 6vw, 96px);
          width: 100%;
          margin: 0 auto;
          max-width: 1480px;
        }

        /* ── Hero — release-tag + name + lede ───────────────── */
        .ed__hero {
          display: flex;
          flex-direction: column;
          gap: clamp(16px, 2vw, 28px);
          padding: clamp(20px, 4vw, 56px) 0 clamp(12px, 2vw, 24px);
        }
        .ed__hero-tag {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .ed__hero-tag-pill {
          font-family: var(--font-stack-mono);
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--ink);
          padding: 3px 7px;
          border: 1px solid var(--ink-hair);
          background: var(--paper-2);
          line-height: 1;
        }
        .ed__hero-tag .t-meta { font-size: 11px; text-transform: lowercase; }
        .ed__hero-name {
          font-family: var(--font-stack-mono);
          font-size: clamp(40px, 7vw, 88px);
          font-weight: 500;
          letter-spacing: -0.035em;
          line-height: 0.94;
          color: var(--ink);
          margin: 0;
          text-transform: none;
        }
        .ed__hero-lede {
          font-family: var(--font-stack-mono);
          font-size: clamp(15px, 1.3vw, 18px);
          line-height: 1.5;
          letter-spacing: -0.005em;
          color: var(--ink-2);
          max-width: 64ch;
          text-wrap: balance;
          margin: 0;
        }
        .ed__hero-em {
          color: var(--ink);
          font-style: italic;
        }

        /* ── Setlist table ──────────────────────────────────── */
        .ed__set-frame {
          width: 100%;
          /* The two horizontal rules that sandwich the table; matches
             Fred Again's manifest framing where the header row has a
             rule above and a hairline below. */
          border-top: 1px solid var(--ink-hair);
          border-bottom: 1px solid var(--ink-hair);
        }

        /* Row template — kept identical across head + rows so columns
           align across the entire table. Tabular nums everywhere so
           numbers track. */
        .ed__set-head,
        .ed__set-link {
          display: grid;
          grid-template-columns:
            minmax(96px, 0.7fr)      /* TYPE */
            minmax(48px, 0.35fr)     /* NO.  */
            minmax(150px, 1.1fr)     /* WORK-RATE */
            minmax(180px, 1.6fr)     /* PROJECT */
            minmax(120px, 0.9fr)     /* CLIENT */
            minmax(120px, 0.9fr);    /* DURATION */
          align-items: baseline;
          column-gap: clamp(12px, 1.6vw, 28px);
          padding: clamp(10px, 1vw, 14px) clamp(8px, 1vw, 12px);
          font-family: var(--font-stack-mono);
          font-variant-numeric: tabular-nums;
        }

        .ed__set-head {
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--ink-3);
          border-bottom: 1px solid var(--ink-hair);
          background: var(--paper-2);
        }
        .ed__set-head > span { display: inline-block; }

        .ed__set-list {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .ed__set-row {
          border-bottom: 1px solid var(--ink-ghost);
          transition: background 180ms var(--ease);
        }
        .ed__set-row:last-child { border-bottom: 0; }
        .ed__set-row:hover {
          background: var(--paper-2);
        }
        .ed__set-link {
          color: var(--ink);
          font-size: clamp(13px, 1vw, 15px);
          font-weight: 400;
        }

        .ed__cell { display: inline-flex; align-items: baseline; gap: 8px; }
        .ed__cell--type {
          font-size: 11px;
          letter-spacing: 0.08em;
          color: var(--ink-2);
          font-weight: 500;
        }
        .ed__cell--num {
          font-size: 11px;
          color: var(--ink-3);
        }
        .ed__cell--wave {
          font-size: clamp(14px, 1.1vw, 17px);
          color: var(--ink-3);
          letter-spacing: -0.05em;
          line-height: 1;
          /* Block elements (U+2581—U+2588) sit on the baseline by
             default; nudge up so they visually center with the row's
             text x-height. */
          transform: translateY(2px);
        }
        .ed__cell--title {
          font-size: clamp(15px, 1.2vw, 18px);
          color: var(--ink);
          letter-spacing: -0.005em;
        }
        .ed__cell--client {
          font-size: 11.5px;
          color: var(--ink-3);
          text-transform: lowercase;
        }
        .ed__cell--dur {
          font-size: 11.5px;
          color: var(--ink-3);
          text-transform: lowercase;
        }

        .ed__live-tag {
          font-size: 9px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--accent);
          border: 1px solid var(--accent-2);
          padding: 2px 5px;
          line-height: 1;
          transform: translateY(-2px);
          font-weight: 500;
        }

        .ed__set-divider {
          padding: clamp(12px, 1.4vw, 18px) clamp(8px, 1vw, 12px) 6px;
          font-family: var(--font-stack-mono);
          letter-spacing: 0.06em;
        }
        .ed__set-divider .t-meta {
          font-size: 10.5px;
          text-transform: lowercase;
        }
        .ed__set-row--reserved .ed__set-link {
          opacity: 0.5;
          cursor: default;
        }
        .ed__set-row--reserved:hover { background: transparent; }

        /* ── Colophon footer ────────────────────────────────── */
        .ed__bottom {
          grid-row: 3;
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: end;
          column-gap: clamp(16px, 2vw, 32px);
          padding-top: clamp(12px, 1.4vw, 18px);
          border-top: 1px solid var(--ink-hair);
          max-width: 1480px;
          width: 100%;
          margin: 0 auto;
        }
        .ed__bottom-pill {
          font-family: var(--font-stack-mono);
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.08em;
          color: var(--ink);
          padding: 4px 7px;
          border: 1px solid var(--ink-hair);
          background: var(--paper-2);
          line-height: 1;
          justify-self: start;
          text-transform: none;
        }
        .ed__bottom-credit {
          display: inline-flex;
          align-items: baseline;
          gap: 8px;
          flex-wrap: wrap;
          justify-self: center;
        }
        .ed__bottom-credit .t-meta { font-size: 10.5px; text-transform: lowercase; }
        .ed__bottom-credit .t-meta:not(.dim) { color: var(--ink); }
        .ed__bottom-link {
          color: var(--ink);
          background-image: linear-gradient(currentColor, currentColor);
          background-size: 0% 1px;
          background-position: 0 100%;
          background-repeat: no-repeat;
          transition: background-size 200ms var(--ease);
        }
        .ed__bottom-link:hover { background-size: 100% 1px; }

        .ed__bottom-right {
          display: flex;
          flex-direction: column;
          gap: 4px;
          align-items: flex-end;
          justify-self: end;
          font-family: var(--font-stack-mono);
        }
        .ed__currently-mini {
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .ed__currently-mini .t-meta { font-size: 10.5px; text-transform: lowercase; }
        .ed__currently-play {
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .ed__email {
          color: var(--ink);
          font-size: 10.5px;
          text-transform: lowercase;
          background-image: linear-gradient(currentColor, currentColor);
          background-size: 0% 1px;
          background-position: 0 100%;
          background-repeat: no-repeat;
          transition: background-size 200ms var(--ease);
          margin-top: 4px;
        }
        .ed__email:hover { background-size: 100% 1px; }

        /* ── Floating cover preview ─────────────────────────── */
        .ed__preview {
          position: fixed;
          top: 0;
          left: 0;
          width: 260px;
          aspect-ratio: 3 / 4;
          pointer-events: none;
          opacity: 0;
          z-index: 10;
          will-change: transform, opacity;
          transition: opacity 220ms var(--ease);
          background: var(--paper-2);
          border: 1px solid var(--ink-hair);
          overflow: hidden;
        }
        .ed__preview[data-visible] { opacity: 1; }
        .ed__preview-media {
          position: absolute !important;
          inset: 0;
          width: 100% !important;
          height: 100% !important;
          object-fit: cover;
        }

        /* ── Responsive — collapse the setlist on narrow ────── */
        @media (max-width: 920px) {
          .ed__set-head,
          .ed__set-link {
            grid-template-columns:
              minmax(70px, 0.7fr)
              minmax(40px, 0.3fr)
              minmax(110px, 1fr)
              minmax(110px, 1.4fr)
              minmax(80px, 0.7fr)
              minmax(90px, 0.8fr);
            column-gap: 12px;
          }
        }

        @media (max-width: 720px) {
          .ed__set-head { display: none; }
          .ed__set-link {
            grid-template-columns: auto 1fr auto;
            grid-template-areas:
              "num title dur"
              "type wave wave"
              "type client client";
            row-gap: 4px;
          }
          .ed__cell--num { grid-area: num; }
          .ed__cell--title { grid-area: title; font-size: 16px; }
          .ed__cell--dur { grid-area: dur; text-align: right; }
          .ed__cell--type { grid-area: type; }
          .ed__cell--wave { grid-area: wave; transform: none; font-size: 15px; }
          .ed__cell--client { grid-area: client; }
          .ed__preview { display: none; }
          .ed__bottom {
            grid-template-columns: 1fr;
            gap: 10px;
          }
          .ed__bottom-pill,
          .ed__bottom-credit,
          .ed__bottom-right { justify-self: start; align-items: flex-start; }
        }

        @media (prefers-reduced-motion: reduce) {
          .ed { animation: none; }
        }
      `}</style>
    </main>
  );
}
