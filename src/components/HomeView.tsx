"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Piece } from "@/constants/pieces";
import { CONTACT_EMAIL } from "@/constants/contact";
import NowPlaying from "@/components/NowPlaying";
import ThemeToggle from "@/components/ThemeToggle";

/**
 * HomeView — organic media on a digital editorial surface.
 *
 * Single hero composition: setlist left, single active image center,
 * intro + contact + listening + active meta right. Light register on
 * the home only. No scroll, no audio, no carousel.
 *
 * The concept is the tension between two registers:
 *   - ORGANIC media — photographs, video, real surfaces of the work
 *   - DIGITAL editorial — mono type, pixel details, white space, hairlines
 *
 * Signature moves that land that combination:
 *   1. Custom cursor — small dark ring lerping on requestAnimationFrame,
 *      grows when over interactive elements. SOTD-tier baseline.
 *   2. Image swap transition — clip-path wipe on key change. When the
 *      active project changes, the incoming image wipes in from one
 *      edge over 600ms. The organic photo enters through a digital
 *      mask.
 *   3. PreviewImages cycle — after 800ms dwell, the active image
 *      cycles through up to 4 fragments at 1.2s each. Each project
 *      becomes a teaser instead of a single frame.
 *   4. Cloud monogram echoes — small SVG pixel-cloud appears next to
 *      the wordmark and in the footer. The studio's recurring mark.
 *   5. NowPlaying — small text line in the right column showing what
 *      Ryan is listening to right now (Last.fm). Text only, no audio.
 */

type Props = { pieces: Piece[] };

function splitSector(sector: string): { category: string; disciplines: string } {
  const parts = sector.split("·").map((s) => s.trim()).filter(Boolean);
  return {
    category: parts[0] ?? sector,
    disciplines: parts.slice(1).join(", "),
  };
}

function pieceCoverSrc(piece: Piece): string | undefined {
  if (piece.cover?.kind === "image") return piece.cover.src;
  if (piece.cover?.kind === "video") return piece.cover.poster;
  return piece.image;
}

export default function HomeView({ pieces }: Props) {
  const all = pieces
    .slice()
    .filter((p) => !p.placeholder)
    .sort((a, b) => a.order - b.order);

  // Active project — defaults to the first piece. Sticky focus
  // (mouseleave doesn't reset). Hover or focus a setlist row or the
  // center plate to swap the active image.
  const [activeSlug, setActiveSlug] = useState<string | null>(
    all[0]?.slug ?? null,
  );
  const active = activeSlug
    ? all.find((p) => p.slug === activeSlug) ?? null
    : null;

  // ── Live time ──────────────────────────────────────────────────
  const [timeLabel, setTimeLabel] = useState<string>("");
  useEffect(() => {
    const update = () => {
      const now = new Date();
      const timeFmt = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/New_York",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
      const tzFmt = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/New_York",
        timeZoneName: "short",
      });
      const tz =
        tzFmt.formatToParts(now).find((p) => p.type === "timeZoneName")
          ?.value ?? "EDT";
      setTimeLabel(`${tz} ${timeFmt.format(now)}`);
    };
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, []);

  // ── Custom cursor — vanilla rAF lerp, no library ──────────────
  // Hidden on touch devices. Hidden when prefers-reduced-motion. The
  // cursor's hover-state changes are driven by `data-cursor-state`
  // attribute set on body via onMouseEnter handlers.
  //
  // Direction-aware "speed-line wake": behind the cursor dot, a 1-2px
  // line extends in the direction opposite to velocity, length scaled
  // by cursor speed. The wake is a separate element rotated each
  // frame; velocity is smoothed via lerp so the line doesn't jitter
  // on micro-movements.
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const cursorLineRef = useRef<HTMLDivElement | null>(null);
  const cursorPos = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const cursorVel = useRef({ vx: 0, vy: 0 });
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const tick = () => {
      const p = cursorPos.current;
      const k = 0.22;
      const prevTx = p.tx;
      const prevTy = p.ty;
      p.tx += (p.x - p.tx) * k;
      p.ty += (p.y - p.ty) * k;

      // Velocity = per-frame change in smoothed position. We lerp the
      // velocity vector itself so direction changes smoothly rather
      // than snapping. Lerp factor 0.25 — fast enough to feel
      // responsive, slow enough to ride out micro-jitter.
      const targetVx = p.tx - prevTx;
      const targetVy = p.ty - prevTy;
      const v = cursorVel.current;
      v.vx += (targetVx - v.vx) * 0.25;
      v.vy += (targetVy - v.vy) * 0.25;

      if (cursorRef.current) {
        // Snap to a 2px grid so the cursor moves in stepped pixel
        // increments — pixel-coded feel that matches the Departure
        // Mono and pixel-square dot.
        const sx = Math.round(p.tx / 2) * 2;
        const sy = Math.round(p.ty / 2) * 2;
        cursorRef.current.style.transform = `translate3d(${sx}px, ${sy}px, 0)`;
      }

      // Speed-line wake: width = speed × scale (clamped). Rotation =
      // velocity angle + 180° so the line points OPPOSITE to motion
      // (cursor leads, line trails behind). Below a small threshold
      // the line collapses to 0 width.
      if (cursorLineRef.current) {
        const speed = Math.sqrt(v.vx * v.vx + v.vy * v.vy);
        const length = speed < 0.45 ? 0 : Math.min(speed * 4.5, 44);
        const angleDeg = (Math.atan2(v.vy, v.vx) * 180) / Math.PI;
        cursorLineRef.current.style.width = `${length}px`;
        cursorLineRef.current.style.transform = `rotate(${angleDeg + 180}deg)`;
      }

      raf = requestAnimationFrame(tick);
    };

    const onMove = (e: MouseEvent) => {
      cursorPos.current.x = e.clientX;
      cursorPos.current.y = e.clientY;
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    document.body.setAttribute("data-cursor", "default");

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      document.body.removeAttribute("data-cursor");
    };
  }, []);

  // ── Preview image cycling ─────────────────────────────────────
  // After 800ms of activeSlug being stable, start cycling through
  // the active piece's previewImages at 1.2s per image. Resets when
  // activeSlug changes. Pieces with 0 or 1 previewImages stay on the
  // single cover.
  const [previewIndex, setPreviewIndex] = useState(0);
  useEffect(() => {
    setPreviewIndex(0);
    if (!activeSlug) return;
    const piece = all.find((p) => p.slug === activeSlug);
    if (!piece?.previewImages || piece.previewImages.length <= 1) return;

    let cycle: ReturnType<typeof setInterval> | undefined;
    const start = setTimeout(() => {
      cycle = setInterval(() => {
        setPreviewIndex((i) => (i + 1) % piece.previewImages!.length);
      }, 1200);
    }, 800);

    return () => {
      clearTimeout(start);
      if (cycle) clearInterval(cycle);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSlug]);

  // ── Cursor state helpers ──────────────────────────────────────
  // Set body data-cursor-state to drive the cursor's hover behavior
  // via CSS. No JS animation needed for the state changes — just an
  // attribute swap; transitions in CSS handle the visual.
  const cursorTo = (state: "default" | "link" | "media") => () => {
    if (typeof document === "undefined") return;
    document.body.setAttribute("data-cursor", state);
  };
  const cursorLeave = () => {
    if (typeof document === "undefined") return;
    document.body.setAttribute("data-cursor", "default");
  };

  return (
    <main id="main" className="obys">
      {/* ─── TOP ROW — wordmark left, nav cluster right ─── */}
      <header className="obys__top">
        <Link
          href="/"
          className="obys__wordmark"
          aria-label="Ryan Jun — home"
          onMouseEnter={cursorTo("link")}
          onMouseLeave={cursorLeave}
        >
          <span>Ryan Jun</span>
          <sup className="obys__reg" aria-hidden>®</sup>
        </Link>

        <div className="obys__topnav">
          <div className="obys__nav-cluster">
            <Link
              href="/work"
              className="obys__nav-link obys__nav-link--active"
              onMouseEnter={cursorTo("link")}
              onMouseLeave={cursorLeave}
            >
              Work
            </Link>
            <span className="obys__nav-sep">,</span>
            <Link
              href="/studio"
              className="obys__nav-link"
              onMouseEnter={cursorTo("link")}
              onMouseLeave={cursorLeave}
            >
              About
            </Link>
          </div>
          <span className="obys__time tabular">{timeLabel}</span>
          <Link
            href="/contact"
            className="obys__nav-link obys__nav-link--right"
            onMouseEnter={cursorTo("link")}
            onMouseLeave={cursorLeave}
          >
            Contact
          </Link>
          <div
            className="obys__theme-slot"
            onMouseEnter={cursorTo("link")}
            onMouseLeave={cursorLeave}
          >
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* ─── BODY — 3 columns, fills the 1fr row, no scroll ─── */}
      <section className="obys__body" aria-label="Selected work">
        {/* LEFT — type-only setlist, vertically centered */}
        <ol className="obys__setlist" role="list">
          {all.map((piece) => {
            const isActive = piece.slug === activeSlug;
            return (
              <li key={piece.slug} className="obys__setlist-item">
                <Link
                  href={`/work/${piece.slug}`}
                  className="obys__setlist-link"
                  data-active={isActive ? "" : undefined}
                  onMouseEnter={() => {
                    setActiveSlug(piece.slug);
                    cursorTo("link")();
                  }}
                  onFocus={() => setActiveSlug(piece.slug)}
                  onMouseLeave={cursorLeave}
                >
                  <span className="obys__setlist-num tabular">
                    {piece.number}
                  </span>
                  <span className="obys__setlist-title">{piece.title}</span>
                  <span className="obys__setlist-meta tabular" aria-hidden>
                    <span className="obys__setlist-arrow">↗</span>
                    <span>{piece.year}</span>
                    <span className="obys__setlist-sep">·</span>
                    <span>{piece.status === "wip" ? "wip" : "shipped"}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>

        {/* CENTER — single active image; key change triggers wipe-in */}
        <div className="obys__stage">
          {active && (
            <div
              className="obys__plate"
              onMouseEnter={cursorTo("media")}
              onMouseLeave={cursorLeave}
            >
              <PlateMedia
                key={active.slug}
                piece={active}
                previewIndex={previewIndex}
              />
            </div>
          )}
        </div>

        {/* RIGHT — intro + contact + listening (top), active meta (bottom) */}
        <aside className="obys__side">
          <div className="obys__intro">
            <p className="obys__intro-text">
              A design-engineering studio of one. Working between
              interface and identity, sketch to deployment.
            </p>
            <p className="obys__intro-contact">
              <span>Contact:</span>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="obys__intro-email"
                onMouseEnter={cursorTo("link")}
                onMouseLeave={cursorLeave}
              >
                {CONTACT_EMAIL}
              </a>
            </p>
            <div className="obys__intro-listening">
              <NowPlaying />
            </div>
          </div>

          {active && (
            <div className="obys__meta" key={`meta-${active.slug}`}>
              <div className="obys__meta-row">
                {splitSector(active.sector).category}
                {splitSector(active.sector).disciplines && (
                  <>
                    {", "}
                    {splitSector(active.sector).disciplines}
                  </>
                )}
              </div>
              <div className="obys__meta-row obys__meta-row--alt">
                <span>
                  {active.status === "wip" ? "In progress" : "Shipped"}
                </span>
                <span className="obys__meta-num tabular">{active.number}</span>
              </div>
            </div>
          )}
        </aside>
      </section>

      {/* ─── BOTTOM ROW — philosophy + copyright ─── */}
      <footer className="obys__bottom">
        <span className="obys__philosophy">
          <span className="obys__philosophy-active">design</span>, build, write
        </span>
        <span className="obys__copyright">
          All rights reserved. ©{new Date().getFullYear()} Ryan Jun
        </span>
      </footer>

      {/* ─── Custom cursor — pixel dot + speed-line wake.
          The line element is rendered BEFORE the dot so the dot
          sits on top of the line's anchor point. The line's width
          and rotation are driven each frame in the rAF tick. ─── */}
      <div ref={cursorRef} className="obys__cursor" aria-hidden>
        <div ref={cursorLineRef} className="obys__cursor-line" />
        <div className="obys__cursor-dot" />
      </div>

      <style>{`
        /* ─── Local vars track the global theme tokens ──────────
           Previously the home overrode globals to force a light
           register. Now that globals are theme-conditional, the
           --o-* locals just reference them — the theme toggle on
           the root flips both home and sub-pages uniformly. */
        .obys {
          --o-paper:   var(--paper);
          --o-paper-2: var(--paper-2);
          --o-ink:     var(--ink);
          --o-ink-2:   var(--ink-2);
          --o-ink-3:   var(--ink-3);
          --o-ink-4:   var(--ink-4);
          --o-hair:    var(--ink-hair);
          --o-ease:    cubic-bezier(0.2, 0.7, 0.2, 1);
          --o-wipe:    cubic-bezier(0.65, 0, 0.35, 1);

          background: var(--o-paper);
          color: var(--o-ink);
          height: 100dvh;
          width: 100%;
          padding: clamp(20px, 2.2vw, 32px) clamp(28px, 4vw, 56px);
          display: grid;
          grid-template-rows: auto 1fr auto;
          row-gap: clamp(20px, 2.4vw, 36px);
          overflow: hidden;
          /* Hide the system cursor when our custom cursor is active.
             On touch devices the custom cursor isn't mounted, so the
             system cursor is restored automatically. */
        }
        @media (pointer: fine) {
          .obys, .obys * { cursor: none !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .obys, .obys * { cursor: auto !important; }
        }

        /* ─── TOP ROW ─── */
        .obys__top {
          display: grid;
          grid-template-columns: auto 1fr;
          align-items: start;
          column-gap: clamp(32px, 4vw, 64px);
        }
        .obys__wordmark {
          display: inline-flex;
          align-items: baseline;
          color: var(--o-ink);
          font-family: var(--font-stack-sans);
          /* Normal weight — wordmark sits flat alongside the nav as
             one chrome element. Uppercase + 0 tracking still signal
             "brand mark", but it no longer outweighs the nav. */
          font-weight: 400;
          font-size: clamp(12px, 0.95vw, 14px);
          letter-spacing: 0.02em;
          line-height: 1;
          text-transform: uppercase;
          margin: 0;
          gap: 0.2em;
        }
        .obys__reg {
          font-size: 0.7em;
          line-height: 1;
          margin-left: 0.1em;
          font-weight: 500;
          letter-spacing: 0;
          vertical-align: super;
          position: relative;
          top: -0.15em;
        }
        .obys__topnav {
          justify-self: end;
          display: grid;
          grid-template-columns: auto auto auto auto;
          column-gap: clamp(24px, 3.6vw, 56px);
          align-items: baseline;
          font-family: var(--font-stack-sans);
          font-size: clamp(12px, 0.95vw, 14px);
          color: var(--o-ink);
        }
        .obys__theme-slot {
          display: inline-flex;
          align-items: baseline;
        }
        .obys__nav-cluster {
          display: inline-flex;
          align-items: baseline;
          gap: 4px;
        }
        .obys__nav-sep { color: var(--o-ink); }
        .obys__nav-link {
          color: var(--o-ink);
          background-image: linear-gradient(currentColor, currentColor);
          background-size: 0% 1px;
          background-position: 0 100%;
          background-repeat: no-repeat;
          transition: background-size 200ms var(--o-ease);
        }
        .obys__nav-link--active { background-size: 100% 1px; }
        .obys__nav-link:hover { background-size: 100% 1px; }
        .obys__time {
          font-family: var(--font-stack-sans);
          color: var(--o-ink);
          font-variant-numeric: tabular-nums lining-nums;
          justify-self: center;
        }

        /* ─── BODY — Plate variation ───────────────────────────
           Path B / Plate: the active image dominates. Setlist and
           right column flank the artwork like exhibition wall
           labels. Proportions ~16% / ~70% / ~14%. The center plate
           takes most of the visible width AND height; the typographic
           columns shrink to support, not compete. */
        .obys__body {
          display: grid;
          grid-template-columns:
            minmax(120px, 0.8fr)
            minmax(420px, 4fr)
            minmax(180px, 1fr);
          column-gap: clamp(40px, 5vw, 80px);
          align-items: stretch;
          min-height: 0;
        }

        /* LEFT — type-only setlist, vertically centered */
        .obys__setlist {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          row-gap: clamp(8px, 1vw, 14px);
          font-family: var(--font-stack-mono);
          font-size: clamp(13px, 1vw, 15px);
        }
        /* Setlist row — compound hover state. Default: number + title
           in --ink-3. Active: ink full, number scales up, hairline
           draws underneath, meta (year · status) slides in inline. */
        .obys__setlist-link {
          position: relative;
          display: grid;
          grid-template-columns: 2ch 1fr auto;
          column-gap: clamp(10px, 1.2vw, 18px);
          align-items: baseline;
          padding-bottom: 3px;
          color: var(--o-ink-3);
          transition: color 200ms var(--o-ease);
        }
        .obys__setlist-link:hover,
        .obys__setlist-link[data-active] { color: var(--o-ink); }

        /* Hairline rule under the active row — draws left-to-right. */
        .obys__setlist-link::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 1px;
          background: var(--o-ink);
          transform-origin: left center;
          transform: scaleX(0);
          transition: transform 280ms var(--o-ease);
        }
        .obys__setlist-link[data-active]::after {
          transform: scaleX(1);
        }

        .obys__setlist-num {
          font-variant-numeric: tabular-nums lining-nums;
          font-weight: 500;
          display: inline-block;
          transform-origin: left center;
          transition: transform 240ms var(--o-ease);
        }
        .obys__setlist-link[data-active] .obys__setlist-num {
          transform: scale(1.12);
        }

        .obys__setlist-title {
          font-weight: 500;
          letter-spacing: -0.005em;
        }

        /* Inline meta — year + status, with an upper-right arrow.
           Hidden by default, slides in from -8px translateX on active.
           Same baseline as the title; one step smaller. */
        .obys__setlist-meta {
          display: inline-flex;
          align-items: baseline;
          gap: 0.4ch;
          font-size: 0.82em;
          color: var(--o-ink-3);
          opacity: 0;
          transform: translateX(-8px);
          transition:
            opacity 240ms var(--o-ease) 40ms,
            transform 280ms var(--o-ease) 40ms;
          white-space: nowrap;
        }
        .obys__setlist-link[data-active] .obys__setlist-meta {
          opacity: 1;
          transform: translateX(0);
        }
        .obys__setlist-arrow {
          color: var(--o-ink);
          margin-right: 0.2ch;
        }
        .obys__setlist-sep {
          color: var(--o-ink-4);
        }

        /* CENTER — single active plate, clip-path wipe on key change */
        .obys__stage {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 0;
          height: 100%;
          width: 100%;
        }
        .obys__plate {
          display: inline-flex;
          align-items: center;
          max-height: 100%;
        }

        /* RIGHT */
        .obys__side {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          font-family: var(--font-stack-sans);
          min-height: 0;
        }
        .obys__intro {
          display: grid;
          row-gap: clamp(12px, 1.4vw, 18px);
          font-size: clamp(12px, 0.95vw, 14px);
          line-height: 1.5;
          color: var(--o-ink);
          max-width: 28ch;
        }
        .obys__intro-text { margin: 0; }
        .obys__intro-contact {
          margin: 0;
          display: grid;
          row-gap: 2px;
        }
        .obys__intro-email {
          color: var(--o-ink);
          background-image: linear-gradient(currentColor, currentColor);
          background-size: 100% 1px;
          background-position: 0 100%;
          background-repeat: no-repeat;
          transition: background-size 200ms var(--o-ease);
        }
        .obys__intro-email:hover { background-size: 0% 1px; }
        /* NowPlaying integration — small block below the contact email.
           The NowPlaying component renders its own dim "Now playing"
           label + the track link + the relative timestamp. */
        .obys__intro-listening {
          margin-top: 4px;
          color: var(--o-ink-3);
        }
        .obys__intro-listening :global(.np__label) {
          color: var(--o-ink-3);
        }
        .obys__intro-listening :global(.np__track) {
          color: var(--o-ink);
        }
        .obys__intro-listening :global(.np__stamp) {
          color: var(--o-ink-4);
        }

        .obys__meta {
          display: grid;
          row-gap: clamp(20px, 2.6vw, 40px);
          font-size: clamp(12px, 0.95vw, 14px);
          line-height: 1.45;
          color: var(--o-ink);
          max-width: 26ch;
          animation: obys-meta-in 300ms var(--o-ease);
        }
        @keyframes obys-meta-in {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .obys__meta-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 16px;
        }
        .obys__meta-row--alt { color: var(--o-ink-3); }
        .obys__meta-num { font-variant-numeric: tabular-nums lining-nums; }

        /* ─── BOTTOM ROW ─── */
        .obys__bottom {
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: baseline;
          font-family: var(--font-stack-sans);
          font-size: clamp(11px, 0.85vw, 13px);
          column-gap: clamp(16px, 2vw, 32px);
        }
        .obys__philosophy { color: var(--o-ink-3); }
        .obys__philosophy-active {
          color: var(--o-ink);
          text-decoration: underline;
          text-decoration-thickness: 1px;
          text-underline-offset: 3px;
        }
        .obys__copyright {
          color: var(--o-ink-3);
          justify-self: end;
        }

        /* ─── Custom cursor — placeholder pixel dot ────────────
           A small square (no border-radius) at the cursor position.
           Scales on link/media hover. This is the base position
           marker; a trail variation will layer on top once picked.
           Sharp edges via image-rendering: pixelated on the parent. */
        .obys__cursor {
          position: fixed;
          top: 0;
          left: 0;
          width: 0;
          height: 0;
          pointer-events: none;
          z-index: 9999;
          will-change: transform;
          image-rendering: pixelated;
        }
        .obys__cursor-dot {
          position: absolute;
          left: -2px;
          top: -2px;
          width: 4px;
          height: 4px;
          background: var(--o-ink);
          transition:
            width 200ms var(--o-ease),
            height 200ms var(--o-ease),
            left 200ms var(--o-ease),
            top 200ms var(--o-ease);
        }
        body[data-cursor="link"] .obys__cursor-dot {
          width: 8px;
          height: 8px;
          left: -4px;
          top: -4px;
        }
        body[data-cursor="media"] .obys__cursor-dot {
          width: 12px;
          height: 12px;
          left: -6px;
          top: -6px;
        }

        /* Speed-line wake: extends from the cursor in the opposite
           direction of velocity. The left edge of the element is the
           cursor anchor (transform-origin: left center); width grows
           with speed; rotation set each frame by the rAF tick. The
           gradient fades the far end to transparent so the wake reads
           as a comet tail rather than a flat stick. */
        .obys__cursor-line {
          position: absolute;
          left: 0;
          top: -1px;
          height: 2px;
          width: 0;
          /* Solid at the cursor end (left, anchor), transparent at the
             far end (right). Rotation moves the whole element, so the
             gradient direction rotates with it — the cursor end stays
             solid in screen space regardless of direction. */
          background: linear-gradient(
            to right,
            var(--o-ink) 0%,
            transparent 100%
          );
          transform-origin: left center;
          will-change: transform, width;
          pointer-events: none;
        }
        /* When hovering interactive elements, the wake fades back —
           the bigger cursor dot is the focus, the wake stays quiet. */
        body[data-cursor="link"] .obys__cursor-line,
        body[data-cursor="media"] .obys__cursor-line {
          opacity: 0.5;
        }
        .obys__cursor-line {
          transition: opacity 200ms var(--o-ease);
        }
        @media (pointer: coarse) {
          .obys__cursor { display: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .obys__cursor { display: none; }
        }

        /* ─── RESPONSIVE ─── */
        @media (max-width: 980px) {
          .obys {
            height: auto;
            min-height: 100dvh;
            overflow: visible;
          }
          .obys__body {
            grid-template-columns: 1fr;
            row-gap: clamp(32px, 5vw, 56px);
          }
          .obys__setlist { justify-content: flex-start; }
        }
        @media (max-width: 640px) {
          .obys__topnav {
            grid-template-columns: 1fr;
            row-gap: 4px;
            text-align: right;
          }
          .obys__time { justify-self: end; }
          .obys__bottom { grid-template-columns: 1fr; row-gap: 6px; }
          .obys__bottom-cloud, .obys__copyright { justify-self: start; }
        }
        @media (prefers-reduced-motion: reduce) {
          .obys__nav-link,
          .obys__setlist-link,
          .obys__intro-email,
          .obys__cursor-ring {
            transition: none;
          }
          .obys__meta { animation: none; }
        }
      `}</style>
    </main>
  );
}

/**
 * PlateMedia — the active image/video. The parent passes a key on
 * activeSlug so React mounts a fresh PlateMedia on every change;
 * that mount triggers the wipe-in CSS animation. Inside, the image
 * src is driven by `previewIndex` so the cycling preview replaces
 * the cover without remounting the whole tree.
 */
function PlateMedia({
  piece,
  previewIndex,
}: {
  piece: Piece;
  previewIndex: number;
}) {
  const baseSrc = pieceCoverSrc(piece);
  const cyclingSrc =
    piece.previewImages && piece.previewImages.length > 0
      ? piece.previewImages[previewIndex % piece.previewImages.length]
      : baseSrc;
  const aspect = piece.coverAspect ?? "4 / 3";

  return (
    <div
      className="obys__plate-frame"
      style={{ aspectRatio: aspect } as React.CSSProperties}
    >
      {piece.cover?.kind === "video" ? (
        <video
          src={piece.cover.src}
          poster={piece.cover.poster}
          muted
          loop
          playsInline
          autoPlay
          preload="metadata"
          className="obys__plate-media"
          aria-hidden
        />
      ) : cyclingSrc ? (
        <Image
          // Key on the cycling src so React swaps the underlying img
          // and the cross-fade transition can fire on each cycle.
          key={`${piece.slug}-${previewIndex}`}
          src={cyclingSrc}
          alt={`${piece.title} — cover`}
          fill
          sizes="(max-width: 760px) 100vw, 40vw"
          className="obys__plate-media"
          style={{ objectFit: "cover" }}
          priority
        />
      ) : (
        <div className="obys__plate-empty">In development</div>
      )}

      <style>{`
        .obys__plate-frame {
          position: relative;
          /* Plate variation: dominant proportions. The image takes
             most of the body row's vertical space and as much of the
             column width as its aspect allows. The 1fr column on
             either side becomes a label sidebar; the plate becomes
             the headline. */
          max-height: min(82vh, 900px);
          max-width: 100%;
          background: var(--o-paper-2);
          overflow: hidden;
          outline: 1px solid var(--o-hair);
          outline-offset: -1px;
          /* Wipe-in animation when this component mounts (active
             changed). The clip-path opens from the left to expose
             the new image; a small scale brings it forward as it
             enters. ~600ms total, cubic-bezier easing. */
          animation: plate-wipe-in 600ms var(--o-wipe);
        }
        @keyframes plate-wipe-in {
          from {
            clip-path: inset(0 100% 0 0);
            transform: scale(1.02);
          }
          to {
            clip-path: inset(0 0 0 0);
            transform: scale(1);
          }
        }
        .obys__plate-media {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          /* Cross-fade between cycling preview images. The Next Image
             component remounts via key change; this transition fires
             on each cycle. */
          animation: plate-media-fade 700ms var(--o-ease);
        }

        /* Crop source watermarks on plate videos. Scale 1.22× from the
           center — each edge clips ~11%. Symmetric crop (no translate)
           so the composition stays centered in the frame. The parent's
           overflow:hidden does the masking. */
        video.obys__plate-media {
          transform: scale(1.22);
          transform-origin: center center;
        }
        @keyframes plate-media-fade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .obys__plate-empty {
          position: absolute;
          inset: 0;
          display: grid;
          place-items: center;
          font-family: var(--font-stack-sans);
          font-size: 12px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--o-ink-4);
        }
        @media (prefers-reduced-motion: reduce) {
          .obys__plate-frame { animation: none; }
          .obys__plate-media { animation: none; }
        }
      `}</style>
    </div>
  );
}
