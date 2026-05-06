import { PIECES } from "@/constants/pieces";
import CatalogPlate from "@/components/CatalogPlate";
import Footer from "@/components/Footer";

/**
 * /work — full catalog index. Uses the same composition language
 * as the homepage Grid View but without the void or statement —
 * this page is the dedicated catalog, not the hello-stake.
 *
 * Section header instead of top void. Same Row Type rhythm as
 * the homepage so the visual language is unified.
 */
export default function WorkIndex() {
  const gyeol = PIECES.find((p) => p.slug === "gyeol")!;
  const sift = PIECES.find((p) => p.slug === "sift")!;
  const placeholders = PIECES.filter((p) => p.placeholder);
  const phRow1 = placeholders.slice(0, 3);
  const phRow2 = placeholders.slice(3, 5);

  return (
    <main id="main" className="workidx">
      <header className="workidx__head">
        <p className="workidx__eyebrow">
          <span>Work</span>
          <span className="workidx__sep">·</span>
          <span className="tabular">§01</span>
          <span className="workidx__sep">·</span>
          <span className="tabular">2025–2026</span>
        </p>
        <h1 className="workidx__title">Selected work and projects.</h1>
      </header>

      <section className="workidx__row workidx__row--C" aria-label="Featured">
        <div className="workidx__cell workidx__cell--58">
          <CatalogPlate piece={gyeol} aspect="3 / 4" />
        </div>
        <div className="workidx__cell workidx__cell--38">
          <CatalogPlate piece={sift} aspect="9 / 16" />
        </div>
      </section>

      {phRow1.length === 3 && (
        <section className="workidx__row workidx__row--E" aria-label="Index">
          {phRow1.map((p) => (
            <div key={p.slug} className="workidx__cell workidx__cell--33">
              <CatalogPlate piece={p} aspect="4 / 5" />
            </div>
          ))}
        </section>
      )}

      {phRow2.length === 2 && (
        <section className="workidx__row workidx__row--B" aria-label="Index continued">
          {phRow2.map((p) => (
            <div key={p.slug} className="workidx__cell workidx__cell--50">
              <CatalogPlate piece={p} aspect="16 / 9" />
            </div>
          ))}
        </section>
      )}

      <Footer />

      <style>{`
        .workidx {
          padding: clamp(96px, 16vh, 168px) var(--margin-page) 0;
          max-width: 1440px;
          margin-inline: auto;
          display: grid;
        }
        .workidx__head {
          display: grid;
          gap: 14px;
          max-width: 720px;
          margin-bottom: var(--space-section);
        }
        .workidx__eyebrow {
          display: inline-flex;
          flex-wrap: wrap;
          gap: 8px;
          font-family: var(--font-stack-sans);
          font-size: var(--type-nav);
          line-height: 1;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--ink-3);
          font-variant-numeric: tabular-nums;
          margin: 0;
        }
        .workidx__sep { color: var(--ink-4); }
        .workidx__title {
          font-family: var(--font-stack-sans);
          font-weight: 380;
          font-size: var(--type-display);
          line-height: 1.1;
          letter-spacing: -0.02em;
          color: var(--ink);
          margin: 0;
        }

        .workidx__row {
          display: grid;
          gap: var(--gap-plates);
          margin-bottom: var(--space-row);
        }
        .workidx__row--C { grid-template-columns: 58fr 38fr; align-items: end; }
        .workidx__row--E { grid-template-columns: 1fr 1fr 1fr; }
        .workidx__row--B { grid-template-columns: 1fr 1fr; }
        .workidx__cell { display: block; }

        /* Sibling-dim hover (§10) */
        .workidx__row:hover .workidx__cell { opacity: 0.5; transition: opacity 400ms var(--ease); }
        .workidx__row:hover .workidx__cell:hover { opacity: 1; transition: opacity 320ms var(--ease); }

        @media (max-width: 760px) {
          .workidx__row--C,
          .workidx__row--E,
          .workidx__row--B { grid-template-columns: 1fr; }
          .workidx__row { margin-bottom: clamp(40px, 8vh, 64px); gap: 18px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .workidx__row:hover .workidx__cell,
          .workidx__row:hover .workidx__cell:hover { transition: none; }
        }
      `}</style>
    </main>
  );
}
