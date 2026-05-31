"use client";

import { KIND_ORDER, KINDS } from "../lib/kinds";
import { foliosOfKind } from "../lib/content";

interface Props {
  onOpenCatalog: () => void;
}

// Home recto — the catalog announcing itself as a catalog.
// Diagonal-anchor composition: lowercase display top-left, statement
// bottom-right, kind-legend mono micro-row in the middle, mono meta
// stack top-right. Per 2026-05-30 feedback the display stays small
// (~1.5–2.2rem) to leave room for the legend.
export function Home({ onOpenCatalog }: Props) {
  return (
    <section className="v2-home" aria-label="home folio">
      <h1 className="v2-home__mark">
        ryan jun<span className="v2-home__period">.</span>
      </h1>

      <div className="v2-home__meta">
        <span>folio · R000</span>
        <span>frontispiece</span>
        <span>2026 · ny</span>
      </div>

      <ul className="v2-home__legend" aria-label="catalog by kind">
        {KIND_ORDER.map((kindId) => {
          const k = KINDS[kindId];
          const items = foliosOfKind(kindId);
          return (
            <li
              key={kindId}
              className="v2-home__legend-cell"
              style={{ ["--kind" as string]: k.color }}
            >
              <span className="v2-home__legend-glyph">{k.glyph}</span>
              <span className="v2-home__legend-label">{k.label}</span>
              <span className="v2-home__legend-count">
                {String(items.length).padStart(2, "0")}
              </span>
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        className="v2-home__cta"
        onClick={onOpenCatalog}
        aria-label="open catalog"
      >
        open catalog
      </button>

      <p className="v2-home__statement">
        a small <em>catalogued</em> practice — design, engineering, direction.
      </p>
    </section>
  );
}
