import { PIECES } from "@/constants/pieces";
import CatalogPlate from "@/components/CatalogPlate";
import Footer from "@/components/Footer";

/**
 * / — homepage Grid View per spec §05.
 *
 * Top void → variable editorial composition → footer.
 * Each row is a composed "spread" — Row Types A/B/C/D/E.
 *
 *   ROW C (asymmetric 58/38):  GYEOL  │  Sift
 *   STATEMENT LINE
 *   ROW E (three-column):      §01 · §03 · §05
 *   ROW B (equal pair 50/50):  §06  │  §07
 *
 * No CloudscapeWallpaper. No Dock. Pure paper ground; the project
 * media provides all color.
 */
export default function Home() {
  // Real pieces lead the composition; placeholders hold the rhythm.
  const gyeol = PIECES.find((p) => p.slug === "gyeol")!;
  const sift = PIECES.find((p) => p.slug === "sift")!;
  const placeholders = PIECES.filter((p) => p.placeholder);
  const phRow1 = placeholders.slice(0, 3); // 3-col row
  const phRow2 = placeholders.slice(3, 5); // pair row

  return (
    <main id="main" className="home">
      <div className="home__void" aria-hidden />

      {/* ROW C — Asymmetric pair (58 / 38) */}
      <section className="home__row home__row--C" aria-label="Featured">
        <div className="home__cell home__cell--58">
          <CatalogPlate piece={gyeol} aspect="3 / 4" />
        </div>
        <div className="home__cell home__cell--38">
          <CatalogPlate piece={sift} aspect="9 / 16" />
        </div>
      </section>

      {/* Statement line — Aino's mid-page sentence */}
      <section className="home__statement" aria-label="Statement">
        <p>
          a design engineer building interfaces and brands — and the small
          things between them.
        </p>
      </section>

      {/* ROW E — Three column */}
      {phRow1.length === 3 && (
        <section className="home__row home__row--E" aria-label="Index continued">
          {phRow1.map((p) => (
            <div key={p.slug} className="home__cell home__cell--33">
              <CatalogPlate piece={p} aspect="4 / 5" />
            </div>
          ))}
        </section>
      )}

      {/* ROW B — Equal pair (50 / 50) */}
      {phRow2.length === 2 && (
        <section className="home__row home__row--B" aria-label="Index continued">
          {phRow2.map((p) => (
            <div key={p.slug} className="home__cell home__cell--50">
              <CatalogPlate piece={p} aspect="16 / 9" />
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
        .home__void {
          height: var(--space-void);
        }
        .home__row {
          display: grid;
          gap: var(--gap-plates);
          margin-bottom: var(--space-row);
        }
        .home__row--C { grid-template-columns: 58fr 38fr; }
        .home__row--E { grid-template-columns: 1fr 1fr 1fr; }
        .home__row--B { grid-template-columns: 1fr 1fr; }
        .home__cell { display: block; }

        /* ─── Statement line — §05 + §02 ─────────────────────────────── */
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

        /* ─── Sibling-dim hover (§10) ─────────────────────────────────── */
        .home__row:hover .home__cell { opacity: 0.5; transition: opacity 400ms var(--ease); }
        .home__row:hover .home__cell:hover { opacity: 1; transition: opacity 320ms var(--ease); }

        /* Mobile: collapse all rows to single column */
        @media (max-width: 760px) {
          .home__row--C,
          .home__row--E,
          .home__row--B {
            grid-template-columns: 1fr;
          }
          .home__row { margin-bottom: clamp(40px, 8vh, 64px); gap: 18px; }
          .home__void { height: clamp(80px, 18vh, 140px); }
        }

        @media (prefers-reduced-motion: reduce) {
          .home__row:hover .home__cell,
          .home__row:hover .home__cell:hover { transition: none; }
        }
      `}</style>
    </main>
  );
}
