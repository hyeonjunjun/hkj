"use client";

import type { Piece } from "@/constants/pieces";
import CatalogPlate from "@/components/CatalogPlate";
import Footer from "@/components/Footer";

/**
 * HomeView — homepage composition. Aino-style long-scroll catalog
 * with a positioning sentence partway through. No view toggle on
 * the homepage (Aino reserves the toggle for /work). The page is
 * intentionally short on a small portfolio: real pieces lead, then
 * the statement, then the rest of the catalog as small placeholder
 * blocks that don't pretend to be work.
 */
type Props = { pieces: Piece[] };

export default function HomeView({ pieces }: Props) {
  const real = pieces.filter((p) => !p.placeholder);
  const placeholders = pieces.filter((p) => p.placeholder);

  return (
    <main id="main" className="home">
      <div className="home__void" aria-hidden />

      {/* ROW C — Asymmetric pair (58 / 38) — featured real work */}
      {real[0] && real[1] && (
        <section className="home__row home__row--C" aria-label="Featured">
          <div className="home__cell home__cell--58">
            <CatalogPlate piece={real[0]} aspect="3 / 4" />
          </div>
          <div className="home__cell home__cell--38">
            <CatalogPlate piece={real[1]} aspect="3 / 4" />
          </div>
        </section>
      )}

      {/* Statement — Aino's mid-page positioning sentence */}
      <section className="home__statement" aria-label="Statement">
        <p>
          a design engineer building interfaces and brands — and the
          small things between them.
        </p>
      </section>

      {/* Placeholder rows — quiet, paper-2 only, no diagonal stripes */}
      {placeholders.length > 0 && (
        <section className="home__row home__row--B" aria-label="Index">
          {placeholders.slice(0, 2).map((p) => (
            <div key={p.slug} className="home__cell home__cell--50">
              <CatalogPlate piece={p} aspect="3 / 4" />
            </div>
          ))}
        </section>
      )}

      <Footer />

      <style>{`
        .home {
          padding: 0 var(--margin-page);
          max-width: 1440px;
          margin-inline: auto;
          display: grid;
        }
        .home__void { height: var(--space-void); }

        .home__row {
          display: grid;
          gap: var(--gap-plates);
          margin-bottom: var(--space-row);
        }
        .home__row--C { grid-template-columns: 58fr 38fr; align-items: end; }
        .home__row--B { grid-template-columns: 1fr 1fr; }
        .home__cell { display: block; }

        .home__statement {
          max-width: 880px;
          margin-inline: auto;
          padding: 0 8px;
          margin-bottom: var(--space-row);
          text-align: center;
        }
        .home__statement p {
          font-family: var(--font-stack-sans);
          font-weight: 400;
          font-size: var(--type-statement);
          line-height: 1.32;
          letter-spacing: -0.01em;
          color: var(--ink-2);
          margin: 0;
          text-wrap: balance;
        }

        @media (max-width: 760px) {
          .home__row--C, .home__row--B { grid-template-columns: 1fr; }
          .home__row { margin-bottom: clamp(40px, 8vh, 64px); gap: 18px; }
          .home__void { height: clamp(80px, 18vh, 140px); }
        }
      `}</style>
    </main>
  );
}
