"use client";

import WorkPlate from "@/components/WorkPlate";
import { PIECES } from "@/constants/pieces";

/**
 * /classic — the editorial fallback for mobile and forced-classic
 * visitors. Preserves the hello-stake + featured-plates layout
 * that the OS surface (/) replaces.
 *
 * Frame chrome (TL identity, TR nav, BR action) renders normally
 * via the root layout — the Dock and CloudscapeWallpaper are
 * suppressed for /classic by their own pathname checks.
 */
export default function ClassicHome() {
  const featured = PIECES.filter((p) => !p.placeholder).slice(0, 2);

  return (
    <main id="main" className="classic-home">
      <section className="classic-home__stake" aria-label="Introduction">
        <p className="classic-home__lede">
          Ryan Jun is a designer and engineer in New York,
          building interfaces, brands, and the small things between them.
        </p>
        <p className="classic-home__location tabular">2026 — New York</p>
      </section>

      {featured.length > 0 && (
        <section className="classic-home__featured" aria-label="Featured work">
          {featured.map((piece) => (
            <WorkPlate key={piece.slug} piece={piece} />
          ))}
        </section>
      )}

      <style>{`
        .classic-home {
          min-height: 100svh;
          padding: clamp(140px, 24vh, 220px) clamp(24px, 4vw, 56px) clamp(80px, 12vh, 120px);
          display: grid;
          gap: clamp(64px, 12vh, 120px);
          align-content: start;
          position: relative;
          z-index: 1;
        }
        .classic-home__stake {
          max-width: 760px;
          margin-inline: auto;
          width: 100%;
          display: grid;
          gap: 14px;
        }
        .classic-home__lede {
          font-family: var(--font-stack-sans);
          font-weight: 400;
          font-size: clamp(16px, 1.5vw, 19px);
          line-height: 1.5;
          color: var(--ink);
          margin: 0;
          max-width: 38ch;
        }
        .classic-home__location {
          font-family: var(--font-stack-mono);
          font-size: 11px;
          letter-spacing: 0.10em;
          text-transform: uppercase;
          color: var(--ink-3);
          margin: 0;
          font-variant-numeric: tabular-nums;
        }
        .classic-home__featured {
          max-width: 1240px;
          margin-inline: auto;
          width: 100%;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(20px, 3vw, 48px);
        }
        @media (max-width: 720px) {
          .classic-home__featured {
            grid-template-columns: 1fr;
            row-gap: clamp(32px, 5vh, 56px);
          }
        }
      `}</style>
    </main>
  );
}
