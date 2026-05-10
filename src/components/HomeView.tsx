"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import type { Piece } from "@/constants/pieces";
import LiveTime from "@/components/LiveTime";
import NowPlaying from "@/components/NowPlaying";
import { CONTACT_EMAIL } from "@/constants/contact";

/**
 * HomeView — polished Aino × HS68 grid for the main release.
 *
 * Image-forward, two-column project grid. Mixed cover aspects per
 * piece.coverAspect drive visual rhythm. Microtype captions below
 * each cover use the role-based .t-* utility classes throughout —
 * no music structural language (no "set 002", no "T-XX" track codes,
 * no runtime). Status grammar is plain: shipped / in progress /
 * reserved.
 *
 * Layout (scrollable on desktop, allowing the grid to breathe):
 *
 *   ┌───────────────────────────────────────────────────────────────┐
 *   │ ryan jun®                       work · about · time · contact│
 *   ├───────────────────────────────────────────────────────────────┤
 *   │ wordmark         lede paragraph (32ch)                         │
 *   │                  music-coded copy stays as content layer       │
 *   ├───────────────────────────────────────────────────────────────┤
 *   │ [project 01 cover]   [project 02 cover]                        │
 *   │  caption              caption                                   │
 *   │ [project 03 cover]   [project 04 cover]                        │
 *   │  ...                                                            │
 *   ├───────────────────────────────────────────────────────────────┤
 *   │ now playing (last.fm)                                          │
 *   │ contact line                                                   │
 *   ├───────────────────────────────────────────────────────────────┤
 *   │ © 2026 ryan jun · new york            v0.1 · 2026.05.10        │
 *   └───────────────────────────────────────────────────────────────┘
 *
 * Music as content layer (not structural):
 *   - lede stays Flo-Guo-style "old soul with a late-night ear..."
 *   - NowPlaying component lives in the footer band
 *
 * Custom cursor + split-flap clock + ASCII preloader carry over from
 * the experimental branch as the three signature interactions.
 */

type Props = { pieces: Piece[] };

export default function HomeView({ pieces }: Props) {
  const all = pieces.slice().sort((a, b) => a.order - b.order);
  const cursorRef = useRef<HTMLDivElement | null>(null);

  // Custom cursor (mix-blend-difference). Hidden on touch +
  // reduced-motion via media queries below.
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

  return (
    <main id="main" className="ax">
      {/* Top — wordmark + nav cluster */}
      <header className="ax__top">
        <h1 className="t-monument ax__mark">
          ryan jun<sup className="ax__reg" aria-hidden>®</sup>
        </h1>
        <nav className="ax__nav" aria-label="Primary">
          <Link href="/work" className="t-meta ax__link" data-active="">
            work
          </Link>
          <span className="t-meta dimmer" aria-hidden>,</span>
          <Link href="/studio" className="t-meta ax__link">
            about
          </Link>
          <span className="t-meta tabular ax__time">
            edt <LiveTime />
          </span>
          <Link href="/contact" className="t-meta ax__link">
            contact
          </Link>
        </nav>
      </header>

      {/* Lede — sits below the wordmark at the right column edge,
          aligned to the page's typographic stair */}
      <section className="ax__lede-block" aria-label="About">
        <p className="t-prose ax__lede">
          old soul with a late-night ear; habitual collector of
          mixes and voice memos; admirer of the kind of song you
          have to play twice.
        </p>
      </section>

      {/* Work grid — 2-col mixed-aspect tiles */}
      <section className="ax__grid" aria-label="Work">
        {all.map((piece) => (
          <ProjectTile key={piece.slug} piece={piece} />
        ))}
      </section>

      {/* Live data band — now-playing + contact, side by side */}
      <section className="ax__live" aria-label="Live">
        <NowPlaying />
        <div className="ax__contact">
          <p className="t-meta dim">contact</p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="t-meta ax__email"
          >
            {CONTACT_EMAIL}
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="ax__foot">
        <span className="t-footnote">
          © 2026 ryan jun · new york
        </span>
        <span className="t-footnote dim">
          v0.1 · last deploy 2026.05.10
        </span>
      </footer>

      {/* Custom cursor */}
      <div ref={cursorRef} className="ax__cursor" aria-hidden />

      <style>{`
        @keyframes pagefadein { from { opacity: 0; } to { opacity: 1; } }

        .ax {
          animation: pagefadein 220ms ease;
          padding: clamp(20px, 2.4vw, 32px) clamp(24px, 4vw, 56px) clamp(40px, 5vw, 72px);
          max-width: 1440px;
          margin-inline: auto;
          cursor: none;
          display: grid;
          grid-template-columns: minmax(0, 1.4fr) minmax(280px, 1fr);
          column-gap: clamp(40px, 6vw, 96px);
          row-gap: clamp(32px, 5vw, 64px);
        }
        @media (prefers-reduced-motion: reduce) { .ax { animation: none; } }

        /* ── Top row ─────────────────────────────────────────── */
        .ax__top {
          grid-column: 1 / -1;
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 24px;
          flex-wrap: wrap;
          padding-bottom: clamp(8px, 1vh, 14px);
          border-bottom: 1px solid var(--ink-hair);
        }
        .ax__mark {
          font-size: clamp(48px, 7vw, 120px);
          line-height: 0.92;
          letter-spacing: -0.045em;
        }
        .ax__reg {
          font-size: 0.18em;
          vertical-align: top;
          margin-left: 0.06em;
          font-weight: 400;
          letter-spacing: 0.04em;
          color: var(--ink-3);
        }
        .ax__nav {
          display: inline-flex;
          align-items: baseline;
          gap: 6px;
          padding-top: 10px;
        }
        .ax__nav .t-meta { font-size: 11px; }
        .ax__link {
          color: var(--ink);
          background-image: linear-gradient(currentColor, currentColor);
          background-size: 0% 1px;
          background-position: 0 100%;
          background-repeat: no-repeat;
          transition: background-size 200ms var(--ease);
        }
        .ax__link[data-active], .ax__link:hover { background-size: 100% 1px; }
        .ax__time { padding: 0 6px; color: var(--ink); }

        /* ── Lede block ──────────────────────────────────────── */
        .ax__lede-block {
          grid-column: 2;
          grid-row: 2;
          align-self: start;
        }
        .ax__lede {
          color: var(--ink-2);
          font-size: clamp(13px, 1vw, 16px);
          line-height: 1.55;
          max-width: 32ch;
          text-transform: lowercase;
        }

        /* ── Work grid ───────────────────────────────────────── */
        /* 2-col on desktop. Each tile carries its own aspect via
           piece.coverAspect, so the grid has natural visual rhythm
           rather than uniform tile heights. */
        .ax__grid {
          grid-column: 1 / -1;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: clamp(40px, 5vw, 80px) clamp(32px, 4vw, 56px);
        }

        /* ── Live band ────────────────────────────────────────── */
        .ax__live {
          grid-column: 1 / -1;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(20px, 3vw, 40px);
          padding-top: clamp(20px, 3vw, 32px);
          border-top: 1px solid var(--ink-hair);
        }
        .ax__contact {
          display: grid;
          row-gap: 4px;
          justify-self: end;
          text-align: right;
          width: max-content;
        }
        .ax__contact .t-meta {
          font-size: 11px;
          text-transform: lowercase;
        }
        .ax__email {
          color: var(--ink);
          font-size: 11px;
          text-transform: lowercase;
          background-image: linear-gradient(currentColor, currentColor);
          background-size: 0% 1px;
          background-position: 0 100%;
          background-repeat: no-repeat;
          transition: background-size 200ms var(--ease);
          width: max-content;
          justify-self: end;
        }
        .ax__email:hover { background-size: 100% 1px; }

        /* ── Footer ──────────────────────────────────────────── */
        .ax__foot {
          grid-column: 1 / -1;
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 20px;
          padding-top: clamp(16px, 2vw, 24px);
          border-top: 1px solid var(--ink-hair);
          flex-wrap: wrap;
        }
        .ax__foot .t-footnote {
          text-transform: lowercase;
        }

        /* ── Cursor ──────────────────────────────────────────── */
        .ax__cursor {
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
          .ax { cursor: auto; }
          .ax__cursor { display: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ax__cursor { display: none; }
        }

        /* ── Responsive ──────────────────────────────────────── */
        @media (max-width: 1024px) {
          .ax {
            grid-template-columns: 1fr;
          }
          .ax__lede-block {
            grid-column: 1;
            grid-row: auto;
          }
          .ax__lede { max-width: 48ch; }
        }
        @media (max-width: 720px) {
          .ax__grid { grid-template-columns: 1fr; gap: clamp(28px, 6vw, 40px); }
          .ax__live { grid-template-columns: 1fr; }
          .ax__contact { justify-self: start; text-align: left; }
          .ax__email { justify-self: start; }
        }
      `}</style>
    </main>
  );
}

/* ── Project tile — cover + microtype caption ─────────────── */

function ProjectTile({ piece }: { piece: Piece }) {
  const isPlaceholder = piece.placeholder;
  const code = `RJ-26-${String(piece.order).padStart(2, "0")}`;
  const aspect = piece.coverAspect ?? "3 / 4";
  const status = isPlaceholder
    ? "reserved"
    : piece.status === "wip"
      ? "in progress"
      : "shipped";

  const inner = (
    <>
      <span className="tile__plate" style={{ aspectRatio: aspect }}>
        {piece.cover?.kind === "video" ? (
          <video
            className="tile__media"
            src={piece.cover.src}
            poster={piece.cover.poster}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
          />
        ) : piece.cover?.kind === "image" ? (
          <Image
            className="tile__media"
            src={piece.cover.src}
            alt={piece.title}
            fill
            sizes="(max-width: 720px) 90vw, 45vw"
            priority={piece.order <= 2}
          />
        ) : (
          <span className="tile__placeholder">
            <span className="t-caption dimmer">reserved</span>
          </span>
        )}
      </span>
      <span className="tile__caption">
        <span className="t-code tile__code">{code}</span>
        <span className="t-row tile__title">{piece.title}</span>
        <span className="t-meta tile__meta">
          {piece.sector}
          <span className="t-sep">·</span>
          <span className="tabular">{piece.year}</span>
          <span className="t-sep">·</span>
          {status}
        </span>
      </span>

      <style>{`
        .tile {
          display: grid;
          row-gap: clamp(12px, 1.4vh, 18px);
          color: var(--ink);
          transition: opacity 240ms var(--ease);
        }
        .tile[data-disabled] {
          cursor: default;
        }
        .tile__plate {
          position: relative;
          width: 100%;
          background: var(--paper-2);
          overflow: hidden;
          display: block;
        }
        .tile__media {
          position: absolute !important;
          inset: 0;
          width: 100% !important;
          height: 100% !important;
          object-fit: cover;
          filter: brightness(0.92) saturate(0.97);
          transition: filter 320ms var(--ease);
        }
        .tile:hover .tile__media,
        .tile:focus-within .tile__media {
          filter: brightness(1.02) saturate(1);
        }
        .tile__placeholder {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .tile__caption {
          display: grid;
          row-gap: 4px;
          width: 100%;
        }
        .tile__code {
          color: var(--ink-3);
        }
        .tile__title {
          font-family: var(--font-stack-mono);
          font-size: clamp(14px, 1.1vw, 17px);
          font-weight: 500;
          letter-spacing: -0.01em;
          line-height: 1.2;
          color: var(--ink);
          text-transform: lowercase;
        }
        .tile__meta {
          color: var(--ink-3);
          text-transform: lowercase;
          display: inline-flex;
          align-items: baseline;
          gap: 8px;
          flex-wrap: wrap;
        }
      `}</style>
    </>
  );

  if (isPlaceholder) {
    return (
      <div className="tile" data-disabled aria-label={`${code} reserved`}>
        {inner}
      </div>
    );
  }

  return (
    <Link href={`/work/${piece.slug}`} className="tile">
      {inner}
    </Link>
  );
}
