"use client";

import { FOLIOS_BY_DATE } from "../lib/content";
import { folioCode, formatDate } from "../lib/folio";
import { KINDS } from "../lib/kinds";

interface Props {
  onBackHome: () => void;
}

// Projects recto — catalog raisonné stamp grid. Each stamp is one
// folio, regardless of kind. The kind color appears as a 2px tab at
// the stamp's top-left corner; otherwise the surface is ink-on-paper.
// Hover lifts the stamp 2px and recesses the paper one register.
export function Projects({ onBackHome }: Props) {
  return (
    <section className="v2-projects" aria-label="catalog">
      <header className="v2-projects__head">
        <h2 className="v2-projects__title">
          catalog<span className="v2-home__period">.</span>
        </h2>
        <span className="v2-projects__count">
          {String(FOLIOS_BY_DATE.length).padStart(2, "0")} items
        </span>
      </header>

      <ul className="v2-stamps" aria-label="all folios">
        {FOLIOS_BY_DATE.map((f) => {
          const k = KINDS[f.kind];
          return (
            <li key={f.id}>
              <button
                type="button"
                className="v2-stamp"
                style={{ ["--kind" as string]: k.color }}
              >
                <span className="v2-stamp__code">
                  <span className="v2-stamp__code-kind">{k.prefix}</span>
                  <span className="v2-stamp__code-num">{folioCode(f).slice(1)}</span>
                  <span style={{ marginLeft: "auto", color: "var(--ink-3)" }}>{k.label}</span>
                </span>
                <span className="v2-stamp__title">{f.title}</span>
                <span className="v2-stamp__date">{formatDate(f.date)}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <footer className="v2-projects__foot">
        <button type="button" className="v2-projects__back" onClick={onBackHome}>
          frontispiece
        </button>
        <span className="v2-projects__hint">press g · reveal baseline</span>
      </footer>
    </section>
  );
}
