// src/components/HomeView.tsx
"use client";

import { IndexCarousel } from "@/components/home/IndexCarousel";
import { DisciplineTicker } from "@/components/home/DisciplineTicker";

const TAGLINE = "Design, engineering, direction — one practice across surfaces.";

export default function HomeView() {
  return (
    <div className="home">
      <IndexCarousel />

      <footer className="home__bottom">
        <div className="home__ticker">
          <DisciplineTicker />
        </div>
        <p className="t-meta home__tagline">{TAGLINE}</p>
      </footer>

      <style>{`
        .home {
          position: relative;
          width: 100%;
          height: 100dvh;
          overflow: hidden;
          padding-top: calc(var(--margin-page) + 48px);
          padding-bottom: calc(var(--margin-page) + 48px);
        }
        .home__bottom {
          position: fixed;
          bottom: var(--margin-page);
          left: calc(var(--margin-page) + 48px); /* clear logo */
          right: calc(var(--margin-page) + 48px); /* clear folio */
          display: grid;
          grid-template-columns: 1fr 280px;
          gap: clamp(20px, 3vw, 48px);
          align-items: end;
          z-index: 40;
          pointer-events: none;
        }
        .home__ticker {
          pointer-events: auto;
          min-width: 0;
        }
        .home__tagline {
          color: var(--ink-2);
          text-align: right;
          max-width: 280px;
        }
        @media (max-width: 760px) {
          .home__bottom {
            grid-template-columns: 1fr;
            row-gap: 12px;
          }
          .home__tagline { text-align: left; }
        }
      `}</style>
    </div>
  );
}
