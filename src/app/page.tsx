"use client";

import WorkPlate from "@/components/WorkPlate";
import { PIECES } from "@/constants/pieces";

/**
 * Home — hello-stake. One body-sized statement, two featured plates.
 * The frame surrounds (TL: Ryan Jun, TR: nav, BR: email); the
 * document inside is short. Everything else lives behind a nav item.
 */
export default function Home() {
  // Featured = first two real pieces (skip placeholders).
  const featured = PIECES.filter((p) => !p.placeholder).slice(0, 2);

  return (
    <main id="main" className="home">
      <section className="home__stake" aria-label="Introduction">
        <p className="home__lede">
          Ryan Jun is a designer and engineer in New York,
          building interfaces, brands, and the small things between them.
        </p>
        <p className="home__location tabular">2026 — New York</p>
      </section>

      {featured.length > 0 && (
        <section className="home__featured" aria-label="Featured work">
          {featured.map((piece) => (
            <WorkPlate key={piece.slug} piece={piece} />
          ))}
        </section>
      )}

      <style>{`
        .home {
          min-height: 100svh;
          padding: clamp(140px, 24vh, 220px) clamp(24px, 4vw, 56px) clamp(80px, 12vh, 120px);
          display: grid;
          gap: clamp(64px, 12vh, 120px);
          align-content: start;
        }
        .home__stake {
          max-width: 760px;
          margin-inline: auto;
          width: 100%;
          display: grid;
          gap: 14px;
        }
        .home__lede {
          font-family: var(--font-stack-sans);
          font-size: clamp(16px, 1.5vw, 19px);
          line-height: 1.5;
          letter-spacing: 0;
          color: var(--ink);
          margin: 0;
          max-width: 38ch;
        }
        .home__location {
          font-family: var(--font-stack-sans);
          font-size: 11px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--ink-3);
          margin: 0;
        }
        .home__featured {
          max-width: 1240px;
          margin-inline: auto;
          width: 100%;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(20px, 3vw, 48px);
        }
        @media (max-width: 720px) {
          .home__featured {
            grid-template-columns: 1fr;
            row-gap: clamp(32px, 5vh, 56px);
          }
        }
      `}</style>
    </main>
  );
}
