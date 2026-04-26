"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import CopyEmailLink from "@/components/CopyEmailLink";
import Folio from "@/components/Folio";
import { PIECES, type Piece } from "@/constants/pieces";
import { useReducedMotion } from "@/hooks/useReducedMotion";

function Tile({ piece }: { piece: Piece }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const v = videoRef.current;
    if (!v || reduced) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) v.play().catch(() => {});
          else v.pause();
        }
      },
      { threshold: 0.35 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, [reduced]);

  const coverVtName = `work-cover-${piece.slug}`;

  return (
    <Link href={`/work/${piece.slug}`} className="home__tile">
      <div
        className="home__tile-frame"
        style={{ viewTransitionName: coverVtName } as React.CSSProperties}
      >
        {piece.cover?.kind === "video" ? (
          <video
            ref={videoRef}
            className="home__tile-media"
            src={piece.cover.src}
            poster={piece.cover.poster}
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden
          />
        ) : piece.cover?.kind === "image" ? (
          <Image
            src={piece.cover.src}
            alt={`${piece.title} — cover`}
            fill
            sizes="(max-width: 720px) 100vw, 290px"
            className="home__tile-media"
            style={{ objectFit: "cover" }}
          />
        ) : (
          <div className="home__tile-placeholder">
            <span className="plate-mark">In development · {piece.year}</span>
          </div>
        )}
      </div>
      <div className="home__tile-cap">
        <span
          className="home__tile-name"
          style={{ viewTransitionName: `work-title-${piece.slug}` } as React.CSSProperties}
        >
          {piece.title}.
        </span>
        <span className="home__tile-meta">
          {piece.sector}. <span className="tabular">{piece.year}</span>.
        </span>
      </div>
    </Link>
  );
}

/**
 * Home — studio catalog. Opens with substantial vertical void; the catalog
 * arrives only after a real pause. Plates are uniform 1:1 squares in a
 * 2-column grid scaling 2 × n as more pieces ship; container is 600px so
 * each plate is ~290px (the "deliberately small so caption typography can
 * stand" register from Wang Zhi-Hong / Daikoku). Captions read as museum
 * labels — mixed case, sentence-shaped, period-terminated — not as data
 * spec lines. The index IS the home (nendo move): no eyebrow, no h1.
 */
export default function Home() {
  return (
    <main id="main" className="home">
      <Folio token="§01" />

      <section className="home__grid" aria-label="Studio catalog">
        {PIECES.map((piece) => (
          <Tile key={piece.slug} piece={piece} />
        ))}
      </section>

      <footer className="home__foot">
        <CopyEmailLink className="home__mail" />
        <span className="home__loc tabular">2026 · new york</span>
      </footer>

      <style>{`
        .home {
          min-height: 100svh;
          background: var(--paper);
          color: var(--ink);
          padding: clamp(200px, 36vh, 360px) clamp(20px, 4vw, 56px) clamp(56px, 9vh, 88px);
          display: grid;
          gap: clamp(56px, 9vh, 96px);
        }

        .home__grid {
          max-width: 600px;
          margin-inline: auto;
          width: 100%;
          display: grid;
          grid-template-columns: 1fr 1fr;
          column-gap: clamp(20px, 3vw, 28px);
          row-gap: clamp(48px, 7vh, 72px);
        }

        .home__tile {
          display: grid;
          gap: 14px;
          color: var(--ink);
        }

        .home__tile-frame {
          position: relative;
          width: 100%;
          aspect-ratio: 1 / 1;
          background: var(--paper-2);
          overflow: hidden;
        }
        .home__tile-media {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .home__tile-placeholder {
          position: absolute;
          inset: 0;
          display: grid;
          place-items: center;
          padding: 24px;
        }

        .home__tile-cap {
          display: grid;
          gap: 4px;
        }
        .home__tile-name {
          font-family: var(--font-stack-mono);
          font-size: 12px;
          letter-spacing: 0.005em;
          color: var(--ink);
        }
        .home__tile-meta {
          font-family: var(--font-stack-mono);
          font-size: 11px;
          letter-spacing: 0.005em;
          color: var(--ink-3);
        }

        .home__foot {
          max-width: 600px;
          margin-inline: auto;
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          padding-top: clamp(16px, 2.5vh, 24px);
          border-top: 1px solid var(--ink-hair);
          font-family: var(--font-stack-mono);
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }
        .home__mail { color: var(--ink); }
        .home__mail[data-copied] { color: var(--ink-3); }
        .home__loc { color: var(--ink-3); }

        @media (max-width: 640px) {
          .home__grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </main>
  );
}
