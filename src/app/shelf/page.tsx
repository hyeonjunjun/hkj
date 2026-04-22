"use client";

import { SHELF } from "@/constants/shelf";

export default function ShelfPage() {
  return (
    <main id="main" className="shelf">
      <article className="shelf__inner">
        <header className="shelf__head">
          <p className="eyebrow">
            <span>Shelf</span>
            <span className="eyebrow__sep">·</span>
            <span>New York</span>
            <span className="eyebrow__sep">·</span>
            <span className="tabular">2026</span>
            <span className="eyebrow__sep">·</span>
            <span className="tabular">{String(SHELF.length).padStart(2, "0")} Objects</span>
          </p>
          <h1 className="shelf__title">Objects I keep near while I work.</h1>
          <p className="shelf__lede">
            Books, tapes, zines, field notes. Each one changes the work in a
            small way.
          </p>
        </header>

        <ol className="shelf__list">
          {SHELF.map((item) => (
            <li key={item.id} className="shelf-plate">
              <div className="shelf-plate__top">
                <span className="plate-mark">
                  № {item.id} · {item.kind}
                </span>
                <span className="plate-mark tabular">{item.year}</span>
              </div>
              <h3 className="shelf-plate__title">{item.title}</h3>
              <p className="shelf-plate__subtitle">{item.subtitle}</p>
              <p className="shelf-plate__body">{item.body}</p>
              <p className="shelf-plate__tags">
                {item.tags.map((t, i) => (
                  <span key={t}>
                    {i > 0 && <span className="shelf-plate__tag-sep"> · </span>}
                    <span>{t}</span>
                  </span>
                ))}
              </p>
            </li>
          ))}
        </ol>

        <footer className="shelf__foot">
          <span className="plate-mark">Vol. 01 — more to come</span>
        </footer>
      </article>

      <style>{`
        .shelf {
          min-height: 100svh;
          padding: clamp(96px, 14vh, 160px) clamp(24px, 6vw, 72px) clamp(64px, 10vh, 120px);
          display: flex;
          justify-content: center;
        }
        .shelf__inner {
          width: 100%;
          max-width: 760px;
          display: grid;
          gap: clamp(56px, 8vh, 96px);
        }

        .shelf__head { display: grid; gap: 20px; }
        .shelf__title {
          font-family: var(--font-stack-mono);
          font-weight: 380;
          font-size: clamp(28px, 3.2vw, 38px);
          line-height: 1.25;
          letter-spacing: -0.005em;
          color: var(--ink);
          margin: 0;
          max-width: 22ch;
        }
        .shelf__lede {
          font-family: var(--font-stack-mono);
          font-weight: 380;
          font-size: 15px;
          line-height: 1.7;
          color: var(--ink-2);
          max-width: 52ch;
          margin: 0;
        }

        .shelf__list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          gap: clamp(40px, 5vh, 56px);
        }

        .shelf-plate {
          display: grid;
          gap: 10px;
          padding: 28px 0 0;
          border-top: 1px solid var(--ink-hair);
        }
        .shelf-plate__top {
          display: flex;
          justify-content: space-between;
          gap: 12px;
        }
        .shelf-plate__title {
          font-family: var(--font-stack-mono);
          font-weight: 400;
          font-size: 22px;
          line-height: 1.25;
          letter-spacing: -0.003em;
          color: var(--ink);
          margin: 6px 0 0;
        }
        .shelf-plate__subtitle {
          font-family: var(--font-stack-mono);
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--ink-3);
          margin: 0;
        }
        .shelf-plate__body {
          font-family: var(--font-stack-mono);
          font-weight: 380;
          font-size: 14px;
          line-height: 1.75;
          color: var(--ink-2);
          max-width: 56ch;
          margin: 8px 0 0;
        }
        .shelf-plate__tags {
          font-family: var(--font-stack-mono);
          font-size: 9px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--ink-3);
          margin: 6px 0 0;
        }
        .shelf-plate__tag-sep { color: var(--ink-4); }

        .shelf__foot {
          padding-top: 24px;
          border-top: 1px solid var(--ink-hair);
        }
      `}</style>
    </main>
  );
}
