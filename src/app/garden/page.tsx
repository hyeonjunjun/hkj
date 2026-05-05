export const metadata = {
  title: "Garden",
};

/**
 * /garden — currently empty. Personal projects, creative coding,
 * experiments will land here. The shape of garden gets defined by
 * what gets planted, not by spec.
 */
export default function GardenPage() {
  return (
    <main id="main" className="garden">
      <article className="garden__inner">
        <header className="garden__head">
          <p className="eyebrow">
            <span>Garden</span>
            <span className="eyebrow__sep">·</span>
            <span className="tabular">2026</span>
          </p>
          <h1 className="garden__title">Tended in private. Showing soon.</h1>
        </header>
      </article>

      <style>{`
        .garden {
          min-height: 100svh;
          padding: clamp(120px, 18vh, 200px) clamp(24px, 4vw, 72px) clamp(56px, 9vh, 96px);
          display: flex;
          justify-content: center;
        }
        .garden__inner {
          width: 100%;
          max-width: 720px;
          display: grid;
          gap: clamp(32px, 5vh, 48px);
        }
        .garden__head { display: grid; gap: 18px; }
        .garden__title {
          font-family: var(--font-stack-sans);
          font-weight: 500;
          font-size: clamp(22px, 2.4vw, 30px);
          line-height: 1.25;
          letter-spacing: var(--track-heading);
          color: var(--ink);
          margin: 6px 0 0;
          max-width: 32ch;
        }
      `}</style>
    </main>
  );
}
