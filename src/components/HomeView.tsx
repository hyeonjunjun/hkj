"use client";

import type { Piece } from "@/constants/pieces";
import CatalogPlate from "@/components/CatalogPlate";
import Footer from "@/components/Footer";

/**
 * HomeView — homepage composition on a 12-column grid with
 * content sitting at columns 2 through 11 (10 cols of content,
 * cols 1 and 12 as outer paper margins).
 *
 *     Hero / LA28      cols 2/-2   (full content row, 16:9 video)
 *     Asymmetric pair  cols 2/8 + 8/-2   (6 + 4 inside the 10-col area)
 *     Statement        cols 4/10   (6 cols centered)
 *     Single offset    cols 2/7    (5 cols, 5 of paper to the right)
 *     Footer           cols 2/-2
 *
 * Cols 1 and 12 are paper gutters between the page-margin padding
 * and the content. They give a consistent "framing" margin inside
 * the page that holds at every viewport size — the ratio of paper
 * to content is fixed by the column grid, not by viewport math.
 *
 * The hero is no longer a separate component — LA28 is just the
 * first plate, with a wider 16:9 aspect to read as the catalog's
 * lead. WIP status (LA28) gives it a backdrop-blur on hover.
 */
type Props = { pieces: Piece[] };

export default function HomeView({ pieces }: Props) {
  const real = pieces.filter((p) => !p.placeholder);
  const [hero, second, third, fourth] = real;

  return (
    <main id="main" className="home">
      {hero && (
        <section className="home__hero" aria-label="Featured piece">
          <CatalogPlate piece={hero} aspect={hero.coverAspect ?? "16 / 9"} />
        </section>
      )}

      {second && third && (
        <section className="home__row home__row--c" aria-label="Catalog">
          <div className="home__cell home__cell--span-6">
            <CatalogPlate piece={second} aspect={second.coverAspect ?? "3 / 4"} />
          </div>
          <div className="home__cell home__cell--span-4">
            <CatalogPlate piece={third} aspect={third.coverAspect ?? "3 / 4"} />
          </div>
        </section>
      )}

      <section className="home__statement" aria-label="Statement">
        <p>
          A design-engineering studio of one. Working between interface
          and identity, sketch to ship.
        </p>
      </section>

      {fourth && (
        <section className="home__row home__row--d" aria-label="Index">
          <div className="home__cell home__cell--span-5 home__cell--start-1">
            <CatalogPlate piece={fourth} aspect={fourth.coverAspect ?? "3 / 4"} />
          </div>
        </section>
      )}

      <Footer />

      <style>{`
        .home {
          display: grid;
          grid-template-columns: repeat(12, minmax(0, 1fr));
          column-gap: var(--gap-plates);
          row-gap: var(--space-row);
          max-width: 1440px;
          margin-inline: auto;
          padding: 0 var(--margin-page);
        }

        /* Default placement for direct children: cols 2-11.
           grid-column: 2 / -2 means start at line 2, end at the
           second-to-last line (which on a 12-col grid is line 12),
           so it spans cols 2 through 11 — 10 cols of content with
           cols 1 and 12 left as outer paper gutters. */
        .home > * {
          grid-column: 2 / -2;
        }

        /* The hero is just a wrapper section so the plate inside can
           sit at cols 2-11 and own its own aspect ratio. */
        .home__hero {
          display: block;
        }

        /* Sub-row sections inherit the parent's column tracks via
           subgrid, so a row placed at cols 2-11 has 10 internal
           tracks aligned exactly with the parent grid. Cells inside
           use grid-column: span N to occupy slices of those 10. */
        .home__row {
          display: grid;
          grid-template-columns: subgrid;
          column-gap: var(--gap-plates);
        }
        .home__row--c { align-items: end; }
        .home__row--d { align-items: start; }

        .home__cell--span-6 { grid-column: span 6; }
        .home__cell--span-4 { grid-column: span 4; }
        .home__cell--span-5 { grid-column: span 5; }
        .home__cell--start-1 { grid-column-start: 1; }

        /* Statement: 6 cols centered. Within a 12-col parent that
           means cols 4-9, which sits centered inside the cols 2-11
           content area (2 cols of buffer on each side). */
        .home__statement {
          grid-column: 4 / span 6;
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
          /* Mobile: collapse the column system. The 10-col content
             area would put plates at ~32px wide on a 375 phone —
             below readable threshold. Single column + full spans
             instead. */
          .home {
            grid-template-columns: 1fr;
            row-gap: clamp(40px, 8vh, 64px);
          }
          .home > *,
          .home__cell,
          .home__cell--span-6,
          .home__cell--span-4,
          .home__cell--span-5,
          .home__statement {
            grid-column: 1 / -1;
          }
          .home__row {
            grid-template-columns: 1fr;
            row-gap: 18px;
          }
        }
      `}</style>
    </main>
  );
}
