"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Piece } from "@/constants/pieces";
import NowPlaying from "@/components/NowPlaying";
import PixelEQ from "@/components/PixelEQ";
import { CONTACT_EMAIL } from "@/constants/contact";

/**
 * HomeView — Fred Again USB001 back-cover, faithful adaptation.
 *
 * The reference's discipline: the TRACKLIST IS the hero. The artist
 * name doesn't appear typeset large anywhere on the back cover —
 * it sits in the bottom credit strip as metadata ("Fred again..").
 * The middle of the composition is huge negative space. The whole
 * thing reads as ONE poster.
 *
 *   ┌─ MASTHEAD ──────────────────────────────────────────────────┐
 *   │ rj                                       index   about     │
 *   ├─────────────────────────────────────────────────────────────┤
 *   │ TYPE   NO.   WORK-RATE        PROJECT     CLIENT   DURATION│  ← SETLIST = HERO
 *   │ ────────────────────────────────────────────────────────── │
 *   │ BRAND  [01]  ▁▁▂▃▄▆▇████▇    LA28        Personal  04.26→ │
 *   │ BRAND  [02]  ▂▄▇█▇▆▅▃▂▁▁▁    Halo Halo!  Halo Halo  04.26 │
 *   │ PROD   [03]  ▁▂▃▅▆▇█▇▆▅▃▁    Sift        Self       09.25 │
 *   │ BRAND  [04]  ▁▂▃▅▇█████▆▃    Gyeol: 결    Gyeol      02.26 │
 *   │                                                             │
 *   │                                                             │
 *   │                                                             │
 *   │                  (vast negative space)                      │
 *   │                                                             │
 *   │                                                             │
 *   ├─────────────────────────────────────────────────────────────┤
 *   │ [Side A/B]                              Ryan Jun           │  ← bottom strip
 *   │                                          design engineer    │     name as METADATA
 *   │                                          new york / 2024 → │
 *   │                                                             │
 *   │ rykjun@gmail.com   ·   hyeonjunjun.com    ⏵ NowPlaying     │
 *   └─────────────────────────────────────────────────────────────┘
 *
 * Single-viewport poster. No scroll. Setlist row scale boosted so
 * the waveform reads as data, not decoration. Bottom strip plays
 * the role of Fred's "thank u so so much to these people" credits
 * block — colophon, not headline.
 */

type Props = { pieces: Piece[] };

function fmtMonth(stamp?: string): string {
  if (!stamp) return "—";
  const [y, m] = stamp.split("-");
  if (!y || !m) return stamp;
  return `${m}.${y.slice(2)}`;
}

function fmtDuration(piece: Piece): string {
  const start = fmtMonth(piece.started);
  if (piece.status === "wip" || !piece.ended) return `${start} → live`;
  return `${start} — ${fmtMonth(piece.ended)}`;
}

function shortType(sector: string): string {
  const head = sector.split("·")[0]?.trim() ?? sector;
  const upper = head.toUpperCase();
  if (upper.startsWith("PRODUCT")) return "PROD";
  if (upper.startsWith("MOBILE")) return "MOBL";
  return upper;
}

// Unicode block-element ramp (U+2581—U+2588). Index = intensity 0-7.
const BAR_RAMP = ["▁", "▂", "▃", "▄", "▅", "▆", "▇", "█"];

// Render a workLog (0-7 intensities) as a unicode-bar strip. Source
// of truth for the WORK-RATE column — pulls from piece.workLog if
// present, else falls back to the legacy `waveform` string, else a
// neutral default.
function renderWaveform(piece: Piece): string {
  if (piece.workLog && piece.workLog.length > 0) {
    return piece.workLog
      .map((n) => BAR_RAMP[Math.max(0, Math.min(7, Math.round(n)))])
      .join("");
  }
  return piece.waveform ?? "▁▂▃▄▅▆▇█▇▆▄▂";
}

// "since" relative-time stamp. Returns a short human string from a
// stored timestamp (ms since epoch).
function fmtSince(then: number, now: number): string {
  const diffMs = now - then;
  const mins = Math.floor(diffMs / 60_000);
  const hours = Math.floor(diffMs / 3_600_000);
  const days = Math.floor(diffMs / 86_400_000);
  if (mins < 2) return "just now";
  if (mins < 60) return `${mins} min ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return `${Math.floor(days / 365)}y ago`;
}

// Time-of-day shift label. Anchors the colophon to the *now* the
// reader is reading at.
function shiftFor(hour: number): string {
  if (hour < 5) return "late shift";
  if (hour < 11) return "morning shift";
  if (hour < 17) return "afternoon shift";
  if (hour < 22) return "evening shift";
  return "late shift";
}

export default function HomeView({ pieces }: Props) {
  const all = pieces
    .slice()
    .filter((p) => !p.placeholder)
    .sort((a, b) => a.order - b.order);

  // Floating cover preview — Rauno / Bureau Borsche pattern.
  const previewRef = useRef<HTMLDivElement | null>(null);
  const [previewPiece, setPreviewPiece] = useState<Piece | null>(null);
  const rafRef = useRef(0);
  const posRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  // Aliveness — last-visit stamp + time-of-day shift. Both client-
  // only to avoid hydration mismatches (server has no Date or
  // localStorage access). Empty string before mount; populates after.
  const [sinceLabel, setSinceLabel] = useState<string>("");
  const [shiftLabel, setShiftLabel] = useState<string>("");

  useEffect(() => {
    const STORAGE_KEY = "rj-last-visit";
    const now = Date.now();
    setShiftLabel(shiftFor(new Date().getHours()));

    try {
      const prev = window.localStorage.getItem(STORAGE_KEY);
      if (prev) {
        const then = parseInt(prev, 10);
        if (!Number.isNaN(then) && now - then > 60_000) {
          // Only show "since" if the gap is at least a minute — within
          // a minute it's effectively the same session, not a return.
          setSinceLabel(`since ${fmtSince(then, now)}`);
        } else if (!Number.isNaN(then)) {
          setSinceLabel("welcome back");
        }
      } else {
        setSinceLabel("first visit");
      }
      window.localStorage.setItem(STORAGE_KEY, String(now));
    } catch {
      // localStorage may be unavailable (private mode, etc) — silently
      // skip; the colophon line just won't render.
    }
  }, []);

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
    <main id="main" className="ps">
      {/* MASTHEAD — thin, minimal. No NowPlaying — it lives in the
          colophon below now, where credits live. */}
      <header className="ps__top">
        <Link href="/" className="ps__mark" aria-label="Ryan Jun — home">
          rj
        </Link>
        <nav className="ps__nav" aria-label="Primary">
          <Link href="/work" className="ps__nav-link" data-active="">
            index
          </Link>
          <Link href="/studio" className="ps__nav-link">
            about
          </Link>
        </nav>
      </header>

      {/* SETLIST — THE hero. Sits right below the masthead. */}
      <section
        className="ps__set"
        aria-label="Setlist"
        onMouseLeave={() => setPreviewPiece(null)}
      >
        <div className="ps__row ps__row--head" role="row">
          <span role="columnheader">type</span>
          <span role="columnheader">no.</span>
          <span role="columnheader">work-rate</span>
          <span role="columnheader">project</span>
          <span role="columnheader">client</span>
          <span role="columnheader">duration</span>
        </div>

        <ol className="ps__list">
          {all.map((piece) => (
            <li
              key={piece.slug}
              className="ps__row-li"
              onMouseEnter={() => setPreviewPiece(piece)}
            >
              <Link
                href={`/work/${piece.slug}`}
                className="ps__row"
                data-cursor="link"
              >
                <span className="ps__cell ps__cell--type">
                  {shortType(piece.sector)}
                </span>
                <span className="ps__cell ps__cell--num">[{piece.number}]</span>
                <span className="ps__cell ps__cell--wave">
                  {renderWaveform(piece)}
                </span>
                <span className="ps__cell ps__cell--title">
                  {piece.title}
                  {piece.status === "wip" && (
                    <span className="ps__live-tag" aria-label="In progress">
                      live
                    </span>
                  )}
                </span>
                <span className="ps__cell ps__cell--client">
                  {piece.client ?? "—"}
                </span>
                <span className="ps__cell ps__cell--dur">
                  {fmtDuration(piece)}
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      {/* NEGATIVE SPACE — explicit grid row. The vast empty middle
          is the design. Don't fill it. */}
      <div className="ps__space" aria-hidden />

      {/* COLOPHON — bottom strip. Fred's "Fred again.. USB001 USB
          Volume 1" metadata + thank-yous, here as Side A/B pill +
          Ryan Jun colophon + contact + listening. */}
      <footer className="ps__bottom">
        <div className="ps__bottom-grid">
          <div className="ps__bottom-side">
            <span className="ps__pill">Side A / B</span>
          </div>

          <div className="ps__bottom-credit">
            <div className="ps__credit-name">Ryan Jun</div>
            <div className="ps__credit-line">design engineer</div>
            <div className="ps__credit-line">new york · 2024 → present</div>
            {(shiftLabel || sinceLabel) && (
              <div className="ps__credit-now">
                {shiftLabel}
                {shiftLabel && sinceLabel ? " · " : ""}
                {sinceLabel}
              </div>
            )}
          </div>
        </div>

        <div className="ps__bottom-strip">
          <div className="ps__contact">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="ps__contact-link"
              data-cursor="link"
            >
              {CONTACT_EMAIL}
            </a>
            <span className="ps__contact-sep">·</span>
            <a href="https://hyeonjunjun.com" className="ps__contact-link">
              hyeonjunjun.com
            </a>
          </div>

          <div className="ps__listening">
            <span className="ps__listening-key">listening</span>
            <span className="ps__listening-now">
              <PixelEQ />
              <NowPlaying />
            </span>
          </div>
        </div>
      </footer>

      {/* FLOATING COVER PREVIEW */}
      <div
        ref={previewRef}
        className="ps__preview"
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
            className="ps__preview-media"
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
            className="ps__preview-media"
          />
        ) : null}
      </div>

      <style>{`
        @keyframes psfadein { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

        html, body { background: var(--paper); overflow: hidden; }

        .ps {
          /* ── Type scale — FOUR sizes, no more.
             Every text element on this page MUST be one of these.
             Hierarchy elsewhere comes from color + weight + position. */
          --ps-t-micro: 9.5px;   /* live tag only — signal at the edge */
          --ps-t-meta:  11px;    /* meta cells, nav, pills, captions */
          --ps-t-body:  12.5px;  /* titles, waveform — primary read */
          --ps-t-mark:  13px;    /* brand mark, credit name */
          /* Letter-spacing — THREE values.
             flat for body, wide for uppercase tags, xwide for the
             live signal (only place that earns the extra emphasis). */
          --ps-ls-flat:  0;
          --ps-ls-wide:  0.08em;
          --ps-ls-xwide: 0.16em;
          /* Spring for hover/transitions — slight overshoot. */
          --ps-spring: cubic-bezier(0.34, 1.2, 0.64, 1);

          color: var(--ink);
          height: 100dvh;
          width: 100%;
          padding: clamp(16px, 1.8vw, 26px) clamp(24px, 4vw, 64px) clamp(20px, 2vw, 32px);
          display: grid;
          /* masthead → setlist → vast negative space → bottom strip */
          grid-template-rows: auto auto 1fr auto;
          row-gap: clamp(24px, 3vw, 44px);
          animation: psfadein 520ms cubic-bezier(0.16, 1, 0.3, 1);
          overflow: hidden;
        }

        /* ── Masthead — thin, minimal ───────────────────────── */
        .ps__top {
          display: grid;
          grid-template-columns: auto 1fr;
          align-items: center;
        }
        .ps__mark {
          font-family: var(--font-stack-mono);
          font-size: var(--ps-t-mark);
          font-weight: 500;
          letter-spacing: var(--ps-ls-flat);
          text-transform: lowercase;
          color: var(--ink);
          line-height: 1;
        }
        .ps__nav {
          display: inline-flex;
          align-items: baseline;
          gap: clamp(20px, 3vw, 36px);
          justify-self: end;
        }
        .ps__nav-link {
          font-family: var(--font-stack-mono);
          font-size: var(--ps-t-meta);
          font-weight: 500;
          letter-spacing: var(--ps-ls-wide);
          text-transform: lowercase;
          color: var(--ink-3);
          background-image: linear-gradient(currentColor, currentColor);
          background-size: 0% 1px;
          background-position: 0 100%;
          background-repeat: no-repeat;
          transition: color 200ms var(--ease), background-size 200ms var(--ease);
        }
        .ps__nav-link[data-active] { color: var(--ink); }
        .ps__nav-link:hover {
          color: var(--ink);
          background-size: 100% 1px;
        }

        /* ── Setlist — THE hero ─────────────────────────────── */
        .ps__set {
          width: 100%;
          max-width: 1480px;
          margin: 0 auto;
          border-top: 1px solid var(--ink-hair);
        }
        .ps__row {
          display: grid;
          /* Column proportions matched to Fred's USB001: WAVEFORM
             and TITLE get the bulk of the horizontal real estate.
             Hierarchy comes from horizontal space + color/weight,
             not from font size. All cells stay the same modest size. */
          grid-template-columns:
            minmax(64px, 0.5fr)       /* TYPE */
            minmax(40px, 0.3fr)       /* NO. */
            minmax(180px, 2.4fr)      /* WORK-RATE */
            minmax(180px, 3fr)        /* PROJECT */
            minmax(100px, 0.7fr)      /* CLIENT */
            minmax(110px, 1fr);       /* DURATION */
          align-items: center;
          column-gap: clamp(14px, 1.6vw, 28px);
          padding: 8px clamp(6px, 0.8vw, 12px);
          font-family: var(--font-stack-mono);
          font-variant-numeric: tabular-nums;
          color: var(--ink);
        }
        .ps__row--head {
          font-size: var(--ps-t-meta);
          font-weight: 500;
          letter-spacing: var(--ps-ls-wide);
          text-transform: uppercase;
          color: var(--ink-3);
          border-bottom: 1px solid var(--ink-hair);
          padding-top: 8px;
          padding-bottom: 8px;
          /* Header fades in first — anchors the table before rows. */
          animation: ps-row-in 540ms var(--ps-spring) 180ms backwards;
        }
        .ps__list {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .ps__row-li {
          /* No row borders — Fred's tracklist is borderless, the
             discipline comes from baseline alignment alone. */
          transition: background 180ms var(--ease);
          /* Row entry stagger — rows trail in after the shell + header.
             Per-row delays applied via :nth-child below. */
          animation: ps-row-in 540ms var(--ps-spring) backwards;
        }
        .ps__row-li:nth-child(1) { animation-delay: 240ms; }
        .ps__row-li:nth-child(2) { animation-delay: 290ms; }
        .ps__row-li:nth-child(3) { animation-delay: 340ms; }
        .ps__row-li:nth-child(4) { animation-delay: 390ms; }
        .ps__row-li:nth-child(5) { animation-delay: 440ms; }
        .ps__row-li:nth-child(6) { animation-delay: 490ms; }
        .ps__row-li:hover { background: var(--paper-2); }
        @keyframes ps-row-in {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* All data cells: same modest size. Differentiation via
           color (var(--ink) vs var(--ink-3)) and weight only.
           Transitions for hover spring — title slides, dim cells brighten. */
        .ps__cell {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: color 200ms var(--ease), transform 320ms var(--ps-spring);
        }
        .ps__cell--type {
          font-size: var(--ps-t-meta);
          letter-spacing: var(--ps-ls-wide);
          color: var(--ink);
          font-weight: 500;
          text-transform: uppercase;
        }
        .ps__cell--num {
          font-size: var(--ps-t-meta);
          color: var(--ink-3);
          font-weight: 400;
        }
        .ps__cell--wave {
          /* Block-element waveform at body size so it sits inside
             the row band, not on top of it. Slight tracking pull
             so the bars touch each other and read as a strip. */
          font-size: var(--ps-t-body);
          color: var(--ink-3);
          letter-spacing: -0.05em;
          line-height: 1;
        }
        .ps__cell--title {
          font-size: var(--ps-t-body);
          color: var(--ink);
          letter-spacing: var(--ps-ls-flat);
          font-weight: 500;
        }
        .ps__cell--client {
          font-size: var(--ps-t-meta);
          color: var(--ink-3);
          text-transform: lowercase;
          font-weight: 400;
        }
        .ps__cell--dur {
          font-size: var(--ps-t-meta);
          color: var(--ink-3);
          text-transform: lowercase;
          font-weight: 400;
        }

        /* Row hover spring — title slides right slightly, dim cells
           brighten one step. Cheap CSS transitions but tuned with a
           slight-overshoot easing so they read as physical. */
        .ps__row:hover .ps__cell--title { transform: translateX(4px); }
        .ps__row:hover .ps__cell--wave,
        .ps__row:hover .ps__cell--client,
        .ps__row:hover .ps__cell--dur,
        .ps__row:hover .ps__cell--num { color: var(--ink-2); }

        .ps__live-tag {
          font-size: var(--ps-t-micro);
          letter-spacing: var(--ps-ls-xwide);
          text-transform: uppercase;
          color: var(--accent);
          line-height: 1;
          font-weight: 500;
          /* Subtle heartbeat — proves the page is alive without
             being decorative. 3.6s cycle, opacity-only so it doesn't
             draw the eye away from the work. */
          animation: ps-live-pulse 3.6s ease-in-out infinite;
        }
        @keyframes ps-live-pulse {
          0%, 100% { opacity: 0.55; }
          50% { opacity: 1; }
        }

        /* ── Negative space — the design ────────────────────── */
        .ps__space {
          min-height: 0;
        }

        /* ── Colophon ───────────────────────────────────────── */
        .ps__bottom {
          width: 100%;
          max-width: 1480px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: clamp(14px, 1.8vw, 24px);
        }
        .ps__bottom-grid {
          display: grid;
          grid-template-columns: auto 1fr;
          align-items: end;
          column-gap: 24px;
        }
        .ps__bottom-side {
          justify-self: start;
          align-self: end;
        }
        .ps__pill {
          display: inline-block;
          font-family: var(--font-stack-mono);
          font-size: var(--ps-t-meta);
          font-weight: 500;
          letter-spacing: var(--ps-ls-wide);
          color: var(--ink);
          padding: 5px 10px;
          border: 1px solid var(--ink);
          background: transparent;
          line-height: 1;
          text-transform: none;
        }
        .ps__bottom-credit {
          justify-self: end;
          text-align: right;
          font-family: var(--font-stack-mono);
          color: var(--ink-3);
        }
        .ps__credit-name {
          font-size: var(--ps-t-mark);
          font-weight: 500;
          letter-spacing: var(--ps-ls-flat);
          color: var(--ink);
          margin-bottom: 2px;
        }
        .ps__credit-line {
          font-size: var(--ps-t-meta);
          font-weight: 400;
          letter-spacing: var(--ps-ls-flat);
          text-transform: lowercase;
          color: var(--ink-3);
          line-height: 1.5;
        }
        .ps__credit-now {
          /* The aliveness line — shift + last-visit stamp. Dimmer
             still than the address lines above; reads as live state,
             not bio. Fades in once the client-only effects fire. */
          font-size: var(--ps-t-meta);
          font-weight: 400;
          letter-spacing: var(--ps-ls-flat);
          text-transform: lowercase;
          color: var(--ink-4);
          line-height: 1.5;
          margin-top: 6px;
          padding-top: 6px;
          border-top: 1px solid var(--ink-ghost);
          animation: ps-credit-fade 600ms ease 200ms backwards;
        }
        @keyframes ps-credit-fade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        .ps__bottom-strip {
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: center;
          padding-top: clamp(10px, 1.2vw, 14px);
          border-top: 1px solid var(--ink-hair);
          gap: 24px;
        }
        .ps__contact {
          display: inline-flex;
          align-items: baseline;
          gap: 10px;
          font-family: var(--font-stack-mono);
          font-size: var(--ps-t-meta);
          letter-spacing: var(--ps-ls-flat);
          text-transform: lowercase;
        }
        .ps__contact-link {
          color: var(--ink);
          background-image: linear-gradient(currentColor, currentColor);
          background-size: 0% 1px;
          background-position: 0 100%;
          background-repeat: no-repeat;
          transition: background-size 200ms var(--ease);
        }
        .ps__contact-link:hover { background-size: 100% 1px; }
        .ps__contact-sep { color: var(--ink-3); }
        .ps__listening {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-family: var(--font-stack-mono);
          font-size: var(--ps-t-meta);
          letter-spacing: var(--ps-ls-flat);
          text-transform: lowercase;
        }
        .ps__listening-key { color: var(--ink-3); }
        .ps__listening-now {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: var(--ink);
        }

        /* ── Floating cover preview ─────────────────────────── */
        .ps__preview {
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
        .ps__preview[data-visible] { opacity: 1; }
        .ps__preview-media {
          position: absolute !important;
          inset: 0;
          width: 100% !important;
          height: 100% !important;
          object-fit: cover;
        }

        /* ── Responsive ─────────────────────────────────────── */
        @media (max-width: 980px) {
          .ps__row {
            grid-template-columns:
              minmax(54px, 0.5fr)
              minmax(36px, 0.3fr)
              minmax(140px, 2fr)
              minmax(140px, 2.4fr)
              minmax(80px, 0.7fr)
              minmax(90px, 1fr);
            column-gap: 12px;
          }
        }

        @media (max-width: 720px) {
          html, body { overflow: auto; }
          .ps {
            height: auto;
            min-height: 100dvh;
            overflow: visible;
            grid-template-rows: auto auto auto auto;
          }
          .ps__space { display: none; }
          .ps__row--head { display: none; }
          .ps__row {
            grid-template-columns: auto 1fr auto;
            grid-template-areas:
              "num title dur"
              "type wave wave"
              "type client client";
            row-gap: 4px;
            padding: 10px 6px;
          }
          .ps__cell--num { grid-area: num; }
          .ps__cell--title { grid-area: title; font-size: 13px; }
          .ps__cell--dur { grid-area: dur; text-align: right; }
          .ps__cell--type { grid-area: type; }
          .ps__cell--wave { grid-area: wave; font-size: 13px; }
          .ps__cell--client { grid-area: client; }
          .ps__preview { display: none; }
          .ps__bottom-grid { grid-template-columns: 1fr; gap: 16px; }
          .ps__bottom-credit { justify-self: start; text-align: left; }
          .ps__bottom-strip { grid-template-columns: 1fr; gap: 10px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .ps,
          .ps__live-tag,
          .ps__credit-now,
          .ps__row--head,
          .ps__row-li,
          .ps__cell { animation: none; transition: none; }
          .ps__live-tag { opacity: 1; }
          .ps__row:hover .ps__cell--title { transform: none; }
        }
      `}</style>
    </main>
  );
}
