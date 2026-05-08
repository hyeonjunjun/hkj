"use client";

import type { Piece } from "@/constants/pieces";
import CatalogPlate from "@/components/CatalogPlate";
import Footer from "@/components/Footer";
import HomeHero from "@/components/HomeHero";

/**
 * HomeView — homepage composition.
 *
 * Shape borrowed from two sites:
 *   - hs68.la opens with a full-bleed video gate; the studio identity
 *     speaks through atmosphere first.
 *   - aino.agency follows with a quiet variable editorial grid: an
 *     asymmetric pair, a single positioning sentence, then a single
 *     offset, and a flat single-row footer.
 *
 * Pieces in display order:
 *   real[0] (large)  +  real[1] (small)   — Row C, asymmetric pair
 *   statement
 *   real[2]                                — Row D, single offset
 *
 * Placeholder rows have been retired; the catalog only ships real
 * work. If a real piece doesn't have a cover yet, its plate renders
 * the "In development" frame and still links through to a partial
 * case study.
 */
type Props = { pieces: Piece[] };

export default function HomeView({ pieces }: Props) {
  const real = pieces.filter((p) => !p.placeholder);

  return (
    <main id="main" className="home">
      <HomeHero
        src="/assets/cloudsatsea.mp4"
        meta={{
          title: "LA28",
          description: "Brand Campaign · Personal Concept",
          year: 2026,
        }}
      />

      {/* ROW C — Asymmetric pair (58 / 38). Each plate honours its
          own coverAspect — Sift at 9:16 reads taller than Halo Halo!
          at 3:4, and the row uses align-items: end so bottoms align
          and the differing tops become the editorial asymmetry. */}
      {real[0] && real[1] && (
        <section className="home__row home__row--C" aria-label="Featured">
          <div className="home__cell home__cell--58">
            <CatalogPlate piece={real[0]} aspect={real[0].coverAspect ?? "3 / 4"} />
          </div>
          <div className="home__cell home__cell--38">
            <CatalogPlate piece={real[1]} aspect={real[1].coverAspect ?? "3 / 4"} />
          </div>
        </section>
      )}

      {/* Statement — Aino's mid-page positioning sentence, plural studio voice */}
      <section className="home__statement" aria-label="Statement">
        <p>
          A design-engineering studio of one. Working between interface
          and identity, sketch to ship.
        </p>
      </section>

      {/* ROW D — Single offset (~45% width, pushed left). The empty
          space on the right IS the composition. Don't fill it. */}
      {real[2] && (
        <section className="home__row home__row--D" aria-label="Index">
          <div className="home__cell home__cell--45">
            <CatalogPlate piece={real[2]} aspect={real[2].coverAspect ?? "3 / 4"} />
          </div>
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

        .home__row {
          display: grid;
          gap: var(--gap-plates);
          margin-bottom: var(--space-row);
        }
        .home__row--C { grid-template-columns: 58fr 38fr; align-items: end; }
        .home__row--D {
          grid-template-columns: 45fr 55fr;
          align-items: start;
        }
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
          .home__row--C, .home__row--D { grid-template-columns: 1fr; }
          .home__row { margin-bottom: clamp(40px, 8vh, 64px); gap: 18px; }
        }
      `}</style>
    </main>
  );
}
