"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Piece } from "@/constants/pieces";
import LiveTime from "@/components/LiveTime";
import NowPlaying from "@/components/NowPlaying";
import { CONTACT_EMAIL } from "@/constants/contact";

/**
 * HomeView — single-section tracklist (CD-inlay register).
 *
 *   ┌────────────────────────────────────────────────────────────────┐
 *   │ ryan jun®                          work · about · time · contact│
 *   ├────────────────────────────────────────────────────────────────┤
 *   │ SET 002 / 2026 / NEW YORK                                       │
 *   │ 04 RELEASED · 04 B-SIDE · RUNTIME 21:54                         │
 *   ├────────────────────── tracklist ──────────┬─── featured ───────┤
 *   │ T-01  LA28           brand · campaign  ◆  │  [now-playing       │
 *   │ T-02  Halo Halo!     brand · café      ●  │   cover, large]     │
 *   │ T-03  Sift           mobile · ai       ●  │                     │
 *   │ T-04  Gyeol: 결      brand · ecommerce ●  │  old soul lede...   │
 *   │ T-05  untitled       brand · identity  ◌  │                     │
 *   │ T-06  untitled       product · saas    ◌  │  now playing        │
 *   │ T-07  untitled       mobile · consumer ◌  │  fred again — ...   │
 *   │ T-08  untitled       brand · editorial ◌  │                     │
 *   │                                            │  contact            │
 *   ├────────────────────────────────────────────┴────────────────────┤
 *   │ vertical, grid                                       © 2026     │
 *   └────────────────────────────────────────────────────────────────┘
 *
 * Music-coded vocabulary throughout (light coding):
 *   - status grammar: live (◆) / released (●) / b-side (◌)
 *   - track codes: T-01 through T-08
 *   - runtime per track in MM:SS, set total in header
 *   - "now playing" feeds Last.fm (real-time evidence of the lede)
 *
 * No flowing borders, no audio visualizers, no ambient audio bed.
 * Music register lives in vocabulary and one live data line.
 */

const WHEEL_DEBOUNCE_MS = 480;

type Props = { pieces: Piece[] };

const STATUS_GLYPH: Record<string, string> = {
  released: "●",
  live: "◆",
  "b-side": "◌",
};

const STATUS_LABEL: Record<string, string> = {
  released: "released",
  live: "live",
  "b-side": "b-side",
};

function statusKey(piece: Piece): "live" | "released" | "b-side" {
  if (piece.placeholder) return "b-side";
  if (piece.status === "wip") return "live";
  return "released";
}

export default function HomeView({ pieces }: Props) {
  const all = pieces.slice().sort((a, b) => a.order - b.order);
  const [activeIdx, setActiveIdx] = useState(0);
  const lastWheelAt = useRef(0);
  const cursorRef = useRef<HTMLDivElement | null>(null);

  const goTo = (idx: number) => {
    const next = Math.max(0, Math.min(all.length - 1, idx));
    setActiveIdx(next);
  };

  // Wheel — debounced ±1 step
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

  // Keyboard
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

  // Custom cursor
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

  const released = all.filter((p) => statusKey(p) === "released").length;
  const bside = all.filter((p) => statusKey(p) === "b-side").length;

  // Cumulative set runtime — sum of all defined runtimes
  const setRuntime = sumRuntimes(all);

  return (
    <main id="main" className="ob">
      <header className="ob__top">
        <h1 className="t-monument ob__mark">
          ryan jun<sup className="ob__reg" aria-hidden>®</sup>
        </h1>
        <nav className="ob__nav" aria-label="Primary">
          <Link href="/work" className="t-meta ob__nav-link" data-active="">
            work
          </Link>
          <span className="t-meta dimmer" aria-hidden>,</span>
          <Link href="/studio" className="t-meta ob__nav-link">
            about
          </Link>
          <span className="t-meta tabular ob__nav-time">
            edt <LiveTime />
          </span>
          <Link href="/contact" className="t-meta ob__nav-link">
            contact
          </Link>
        </nav>
      </header>

      {/* Set header — metadata band above the tracklist. */}
      <header className="ob__set" aria-label="Set metadata">
        <span className="t-section ob__set-title">set 002 / 2026</span>
        <span className="t-meta ob__set-meta">
          new york
          <span className="t-sep">·</span>
          {String(released).padStart(2, "0")} released
          <span className="t-sep">·</span>
          {String(bside).padStart(2, "0")} b-side
          <span className="t-sep">·</span>
          runtime <span className="tabular">{setRuntime}</span>
        </span>
      </header>

      <section className="ob__main">
        <ol className="ob__tracklist" aria-label="Catalog">
          <li className="ob__tracklist-head" aria-hidden>
            <span className="t-meta dim">#</span>
            <span className="t-meta dim">title</span>
            <span className="t-meta dim ob__col-sector">sector</span>
            <span className="t-meta dim ob__col-runtime">runtime</span>
            <span className="t-meta dim ob__col-status">status</span>
          </li>
          {all.map((piece, i) => {
            const isActive = i === activeIdx;
            const sk = statusKey(piece);
            const isPlaceholder = piece.placeholder;
            const code = `T-${String(piece.order).padStart(2, "0")}`;
            return (
              <li
                key={piece.slug}
                className="ob__track"
                data-active={isActive ? "" : undefined}
                onFocus={() => goTo(i)}
              >
                <Link
                  href={isPlaceholder ? "#" : `/work/${piece.slug}`}
                  className="ob__track-link"
                  data-disabled={isPlaceholder ? "" : undefined}
                  onClick={(e) => {
                    if (isPlaceholder) e.preventDefault();
                  }}
                >
                  <span className="ob__col-num t-code tabular">{code}</span>
                  <span className="ob__col-title">{piece.title}</span>
                  <span className="ob__col-sector t-meta">{piece.sector}</span>
                  <span className="ob__col-runtime t-meta tabular">
                    {piece.runtime ?? "—:—"}
                  </span>
                  <span className="ob__col-status">
                    <span className="ob__status-glyph" aria-hidden>
                      {STATUS_GLYPH[sk]}
                    </span>
                    <span className="t-meta">{STATUS_LABEL[sk]}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>

        <aside className="ob__aside">
          {/* Featured cover — large, swaps on active change. */}
          <div className="ob__featured">
            {all.map((piece, i) => {
              const isActive = i === activeIdx;
              return (
                <div
                  key={piece.slug}
                  className="ob__cover"
                  data-active={isActive ? "" : undefined}
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
                      preload="metadata"
                    />
                  ) : piece.cover?.kind === "image" ? (
                    <Image
                      className="ob__cover-media"
                      src={piece.cover.src}
                      alt={piece.title}
                      fill
                      sizes="(max-width: 880px) 80vw, 28vw"
                      priority={i <= 2}
                    />
                  ) : (
                    <div className="ob__cover-placeholder">
                      <span className="t-caption dimmer">b-side</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="ob__intro">
            <p className="t-prose ob__lede">
              old soul with a late-night ear; habitual collector of
              mixes and voice memos; admirer of the kind of song you
              have to play twice.
            </p>
          </div>

          <NowPlaying />

          <div className="ob__contact">
            <p className="t-meta dim">contact:</p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="t-meta ob__email"
            >
              {CONTACT_EMAIL}
            </a>
          </div>
        </aside>
      </section>

      <footer className="ob__bottom">
        <div className="ob__view">
          <span className="t-meta" data-active="">tracklist</span>
          <span className="t-meta dimmer" aria-hidden>,</span>
          <span className="t-meta dim">grid</span>
        </div>
        <p className="ob__colophon t-footnote">
          all rights reserved. © 2026 ryan jun
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
          cursor: none;
          display: grid;
          grid-template-columns: minmax(0, 2.4fr) minmax(280px, 1fr);
          grid-template-rows: auto auto 1fr auto;
          column-gap: clamp(28px, 4vw, 56px);
          row-gap: clamp(12px, 1.4vw, 18px);
          padding: clamp(14px, 1.6vw, 22px) clamp(20px, 3vw, 48px);
        }
        @media (prefers-reduced-motion: reduce) { .ob { animation: none; } }

        /* ── Top row ──────────────────────────────────────────── */
        .ob__top {
          grid-column: 1 / -1;
          grid-row: 1;
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: clamp(20px, 3vw, 48px);
          flex-wrap: wrap;
        }
        .ob__mark {
          line-height: 0.9;
          letter-spacing: -0.045em;
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
          display: inline-flex;
          align-items: baseline;
          gap: 6px;
          padding-top: 6px;
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
        .ob__nav-link[data-active], .ob__nav-link:hover {
          background-size: 100% 1px;
        }
        .ob__nav-time { padding: 0 6px; color: var(--ink); }

        /* ── Set header ────────────────────────────────────────── */
        .ob__set {
          grid-column: 1 / -1;
          grid-row: 2;
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 20px;
          padding-bottom: clamp(8px, 1vh, 14px);
          border-bottom: 1px solid var(--ink-hair);
          flex-wrap: wrap;
        }
        .ob__set-title { color: var(--ink); }
        .ob__set-meta {
          color: var(--ink-3);
          display: inline-flex;
          align-items: baseline;
          gap: 8px;
          flex-wrap: wrap;
        }
        .ob__set-meta .tabular { color: var(--ink); }

        /* ── Main two-column layout ────────────────────────────── */
        .ob__main {
          grid-column: 1 / -1;
          grid-row: 3;
          display: grid;
          grid-template-columns: subgrid;
          column-gap: inherit;
          min-height: 0;
          align-items: start;
        }

        /* ── Tracklist ─────────────────────────────────────────── */
        .ob__tracklist {
          grid-column: 1;
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          row-gap: 1px;
          align-self: start;
        }

        /* Column system shared by header + every track row. The
           grid-template-columns is set once on the link/header so
           every row aligns vertically. */
        .ob__tracklist-head,
        .ob__track-link {
          display: grid;
          grid-template-columns:
            56px                /* T-01 */
            minmax(0, 1.6fr)    /* title */
            minmax(0, 1.4fr)    /* sector */
            68px                /* runtime */
            128px;              /* status */
          column-gap: clamp(12px, 1.6vw, 22px);
          align-items: baseline;
          padding: 6px 8px;
        }
        .ob__tracklist-head {
          padding-top: 0;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--ink-hair);
        }
        .ob__col-status { text-align: left; }

        .ob__track {
          border-bottom: 1px solid var(--ink-hair);
        }
        .ob__track:last-child { border-bottom: none; }
        .ob__track-link {
          color: var(--ink-3);
          transition: background 200ms var(--ease), color 180ms var(--ease);
          padding: clamp(10px, 1.4vh, 14px) 8px;
        }
        .ob__track[data-active] .ob__track-link {
          color: var(--ink);
          background: var(--paper-2);
        }
        .ob__track-link[data-disabled] { cursor: default; }

        .ob__col-num { color: var(--ink-3); }
        .ob__track[data-active] .ob__col-num { color: var(--ink); }
        .ob__col-title {
          font-family: var(--font-stack-mono);
          font-size: clamp(13px, 1vw, 15px);
          font-weight: 500;
          letter-spacing: -0.005em;
          color: inherit;
          line-height: 1.2;
          text-transform: lowercase;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .ob__col-sector {
          color: var(--ink-3);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          text-transform: lowercase;
        }
        .ob__col-runtime { color: var(--ink-3); }
        .ob__col-status {
          display: inline-flex;
          align-items: baseline;
          gap: 6px;
          color: var(--ink-3);
        }
        .ob__status-glyph {
          font-family: var(--font-stack-mono);
          font-size: 10px;
          line-height: 1;
          color: var(--ink);
        }
        .ob__track[data-active] .ob__status-glyph {
          color: var(--ink);
        }

        /* ── Aside ─────────────────────────────────────────────── */
        .ob__aside {
          grid-column: 2;
          display: flex;
          flex-direction: column;
          gap: clamp(14px, 2vh, 22px);
          min-height: 0;
          padding-top: 6px;
        }

        /* Featured cover stack — same crossfade as before, square
           aspect, max-width capped so it doesn't dominate. */
        .ob__featured {
          position: relative;
          width: 100%;
          aspect-ratio: 1 / 1;
          background: var(--paper-2);
          overflow: hidden;
          border: 1px solid var(--ink-hair);
        }
        .ob__cover {
          position: absolute;
          inset: 0;
          opacity: 0;
          transition: opacity 480ms var(--ease);
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        }
        .ob__cover[data-active] {
          opacity: 1;
          pointer-events: auto;
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
        }

        .ob__intro {
          display: flex;
          flex-direction: column;
        }
        .ob__lede {
          color: var(--ink-2);
          font-size: clamp(11px, 0.85vw, 13px);
          line-height: 1.55;
          max-width: 32ch;
          text-transform: lowercase;
        }

        .ob__contact {
          display: grid;
          row-gap: 4px;
          width: 100%;
        }
        .ob__contact .t-meta { font-size: 10.5px; text-transform: lowercase; }
        .ob__email {
          color: var(--ink);
          font-size: 10.5px;
          text-transform: lowercase;
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
          grid-row: 4;
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          padding-top: clamp(8px, 1.2vw, 14px);
          border-top: 1px solid var(--ink-hair);
          gap: 20px;
          flex-wrap: wrap;
        }
        .ob__view {
          display: inline-flex;
          align-items: baseline;
          gap: 6px;
        }
        .ob__view .t-meta { font-size: 10.5px; text-transform: lowercase; }
        .ob__view .t-meta[data-active] {
          color: var(--ink);
          background-image: linear-gradient(currentColor, currentColor);
          background-size: 100% 1px;
          background-position: 0 100%;
          background-repeat: no-repeat;
        }
        .ob__colophon {
          margin: 0;
          font-size: 10px;
          text-transform: lowercase;
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
        @media (pointer: coarse) {
          .ob { cursor: auto; }
          .ob__cursor { display: none; }
        }
        @media (prefers-reduced-motion: reduce) { .ob__cursor { display: none; } }

        /* ── Responsive ────────────────────────────────────────── */
        @media (max-width: 1100px) {
          .ob__tracklist-head,
          .ob__track-link {
            grid-template-columns: 48px minmax(0, 1.4fr) minmax(0, 1fr) 60px 100px;
            column-gap: 14px;
          }
        }
        @media (max-width: 880px) {
          html, body { overscroll-behavior: auto; }
          .ob {
            height: auto;
            min-height: 100dvh;
            overflow: visible;
            grid-template-columns: 1fr;
            row-gap: clamp(20px, 4vw, 28px);
            cursor: auto;
          }
          .ob__top, .ob__set, .ob__main, .ob__bottom { grid-column: 1; }
          .ob__main { grid-template-columns: 1fr; row-gap: 24px; }
          .ob__tracklist, .ob__aside { grid-column: 1; }
          .ob__tracklist-head { display: none; }
          .ob__tracklist-head,
          .ob__track-link {
            grid-template-columns: 40px 1fr 60px 80px;
            column-gap: 10px;
          }
          .ob__col-sector { display: none; }
          .ob__featured { aspect-ratio: 4 / 3; }
        }
      `}</style>
    </main>
  );
}

/** Sum HH:MM or MM:SS strings into a single MM:SS total. */
function sumRuntimes(pieces: Piece[]): string {
  let totalSeconds = 0;
  for (const p of pieces) {
    if (!p.runtime) continue;
    const [m, s] = p.runtime.split(":").map(Number);
    if (Number.isFinite(m) && Number.isFinite(s)) {
      totalSeconds += m * 60 + s;
    }
  }
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
