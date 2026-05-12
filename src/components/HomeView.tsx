"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Piece } from "@/constants/pieces";
import { CONTACT_EMAIL } from "@/constants/contact";
import NowPlaying from "@/components/NowPlaying";

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

// ─── Cloud pixel monogram ─────────────────────────────────────────
// Same 8×5 silhouette as /app/icon.tsx and /app/opengraph-image.tsx.
// One mark, repeated across surfaces, so the cloud reads as the
// studio's signature wherever it appears.
const CLOUD: ReadonlyArray<ReadonlyArray<0 | 1>> = [
  [0, 0, 1, 1, 1, 1, 0, 0],
  [0, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [0, 1, 1, 1, 1, 1, 1, 0],
];

function CloudGlyph({ size = 14 }: { size?: number }) {
  // 8 columns × 5 rows. Width follows the column count so the
  // pixel shape stays square at any rendered size.
  const w = (size * 8) / 5;
  return (
    <svg
      width={w}
      height={size}
      viewBox="0 0 8 5"
      aria-hidden
      style={{ display: "inline-block", verticalAlign: "middle" }}
    >
      {CLOUD.flatMap((row, y) =>
        row.map((cell, x) =>
          cell ? (
            <rect
              key={`${x}-${y}`}
              x={x}
              y={y}
              width="1"
              height="1"
              fill="currentColor"
              shapeRendering="crispEdges"
            />
          ) : null,
        ),
      )}
    </svg>
  );
}

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
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const cursorPos = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const tick = () => {
      const p = cursorPos.current;
      const k = 0.18;
      p.tx += (p.x - p.tx) * k;
      p.ty += (p.y - p.ty) * k;
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${p.tx}px, ${p.ty}px, 0)`;
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
          <span className="obys__wordmark-cloud" aria-hidden>
            <CloudGlyph size={10} />
          </span>
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

      {/* ─── BOTTOM ROW — philosophy + cloud mark + copyright ─── */}
      <footer className="obys__bottom">
        <span className="obys__philosophy">
          <span className="obys__philosophy-active">design</span>, build, write
        </span>
        <span className="obys__bottom-cloud" aria-hidden>
          <CloudGlyph size={9} />
        </span>
        <span className="obys__copyright">
          All rights reserved. ©{new Date().getFullYear()} Ryan Jun
        </span>
      </footer>

      {/* ─── Custom cursor — fixed, follows the pointer ─── */}
      <div ref={cursorRef} className="obys__cursor" aria-hidden>
        <div className="obys__cursor-ring" />
      </div>

      <style>{`
        /* ─── Local light register ─── */
        .obys {
          --o-paper:   #FBFAF6;
          --o-paper-2: #F4F3EE;
          --o-ink:     #000000;
          --o-ink-2:   rgba(0, 0, 0, 0.84);
          --o-ink-3:   rgba(0, 0, 0, 0.45);
          --o-ink-4:   rgba(0, 0, 0, 0.30);
          --o-hair:    rgba(0, 0, 0, 0.12);
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
          align-items: flex-start;
          color: var(--o-ink);
          font-family: var(--font-stack-sans);
          font-weight: 700;
          font-size: clamp(22px, 2.6vw, 38px);
          letter-spacing: -0.03em;
          line-height: 0.95;
          text-transform: uppercase;
          margin: 0;
          gap: 0.08em;
        }
        .obys__reg {
          font-size: 0.36em;
          line-height: 1;
          margin-left: 0.1em;
          margin-top: 0.2em;
          font-weight: 500;
          letter-spacing: 0;
        }
        /* Pixel-cloud echo next to the wordmark — small, --ink-3 so
           it reads as a subordinate stamp rather than competing with
           the name. */
        .obys__wordmark-cloud {
          color: var(--o-ink-3);
          margin-left: 0.5em;
          margin-top: 0.55em;
          opacity: 0.75;
        }

        .obys__topnav {
          justify-self: end;
          display: grid;
          grid-template-columns: auto auto auto;
          column-gap: clamp(36px, 5vw, 72px);
          align-items: baseline;
          font-family: var(--font-stack-sans);
          font-size: clamp(12px, 0.95vw, 14px);
          color: var(--o-ink);
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

        /* ─── BODY — 3-column ─── */
        .obys__body {
          display: grid;
          grid-template-columns:
            minmax(160px, 1fr)
            minmax(320px, 2.6fr)
            minmax(220px, 1.2fr);
          column-gap: clamp(32px, 4vw, 64px);
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
        .obys__setlist-link {
          display: grid;
          grid-template-columns: 2ch 1fr;
          column-gap: clamp(12px, 1.4vw, 22px);
          align-items: baseline;
          color: var(--o-ink-3);
          transition: color 200ms var(--o-ease);
        }
        .obys__setlist-link:hover,
        .obys__setlist-link[data-active] { color: var(--o-ink); }
        .obys__setlist-num {
          font-variant-numeric: tabular-nums lining-nums;
          font-weight: 500;
        }
        .obys__setlist-title {
          font-weight: 500;
          letter-spacing: -0.005em;
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
          grid-template-columns: 1fr auto 1fr;
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
        /* Cloud echo in the footer center — same mark as the wordmark
           and the favicon. Subordinate tint. */
        .obys__bottom-cloud {
          color: var(--o-ink-4);
          justify-self: center;
        }
        .obys__copyright {
          color: var(--o-ink-3);
          justify-self: end;
        }

        /* ─── Custom cursor ─── */
        .obys__cursor {
          position: fixed;
          top: 0;
          left: 0;
          width: 0;
          height: 0;
          pointer-events: none;
          z-index: 9999;
          will-change: transform;
        }
        .obys__cursor-ring {
          position: absolute;
          left: -10px;
          top: -10px;
          width: 20px;
          height: 20px;
          border: 1px solid var(--o-ink);
          border-radius: 999px;
          background: transparent;
          transition:
            width 240ms var(--o-ease),
            height 240ms var(--o-ease),
            left 240ms var(--o-ease),
            top 240ms var(--o-ease),
            background-color 240ms var(--o-ease),
            border-color 240ms var(--o-ease);
        }
        /* Hover-state changes driven by body[data-cursor] attribute,
           set by onMouseEnter handlers on interactive elements. */
        body[data-cursor="link"] .obys__cursor-ring {
          width: 36px;
          height: 36px;
          left: -18px;
          top: -18px;
          border-color: var(--o-ink);
          background: rgba(0, 0, 0, 0.04);
        }
        body[data-cursor="media"] .obys__cursor-ring {
          width: 56px;
          height: 56px;
          left: -28px;
          top: -28px;
          border-color: var(--o-ink);
          background: rgba(0, 0, 0, 0.03);
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
          max-height: min(70vh, 720px);
          max-width: clamp(280px, 38vw, 520px);
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
