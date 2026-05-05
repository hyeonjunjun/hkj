"use client";

import WorkPlate from "@/components/WorkPlate";
import { PIECES } from "@/constants/pieces";

/**
 * /work — the catalog. Single document of plates inside the frame.
 * Renders every piece (real + placeholder); placeholders sit at the
 * registry weight per WorkPlate's placeholder mode.
 */
export default function WorkIndex() {
  return (
    <main id="main" className="work">
      <article className="work__inner">
        <header className="work__head">
          <p className="eyebrow">
            <span>Work</span>
            <span className="eyebrow__sep">·</span>
            <span className="tabular">2026</span>
          </p>
          <h1 className="work__title">Selected work and projects.</h1>
        </header>

        <section className="work__gallery" aria-label="Work catalog">
          {PIECES.map((piece) => (
            <WorkPlate key={piece.slug} piece={piece} />
          ))}
        </section>
      </article>

      <style>{`
        .work {
          min-height: 100svh;
          padding: clamp(120px, 18vh, 200px) clamp(24px, 4vw, 56px) clamp(80px, 12vh, 120px);
          display: flex;
          justify-content: center;
        }
        .work__inner {
          width: 100%;
          max-width: 1240px;
          display: grid;
          gap: clamp(48px, 8vh, 80px);
        }
        .work__head { display: grid; gap: 18px; max-width: 720px; }
        .work__title {
          font-family: var(--font-stack-sans);
          font-weight: 400;
          font-size: clamp(22px, 2.4vw, 30px);
          line-height: 1.35;
          letter-spacing: -0.005em;
          color: var(--ink);
          margin: 6px 0 0;
        }
        .work__gallery {
          display: grid;
          grid-template-columns: 1fr 1fr;
          column-gap: clamp(20px, 3vw, 48px);
          row-gap: clamp(32px, 4.5vh, 64px);
        }
        @media (max-width: 720px) {
          .work__gallery { grid-template-columns: 1fr; }
        }
      `}</style>
    </main>
  );
}
