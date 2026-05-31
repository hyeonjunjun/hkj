"use client";

import { FOLIOS_BY_DATE } from "../lib/content";
import { folioCode } from "../lib/folio";
import { KINDS } from "../lib/kinds";

interface Props {
  activeId?: string;
  onSelect?: (id: string) => void;
}

export function BottomStrip({ activeId, onSelect }: Props) {
  return (
    <footer className="v2-bottom" aria-label="folio index">
      {FOLIOS_BY_DATE.map((f) => {
        const code = folioCode(f);
        const isActive = f.id === activeId;
        return (
          <button
            key={f.id}
            type="button"
            className={`v2-bottom__item ${isActive ? "is-active" : ""}`}
            onClick={() => onSelect?.(f.id)}
            style={isActive ? { borderBottomColor: KINDS[f.kind].color, color: "var(--ink)" } : undefined}
            aria-current={isActive ? "true" : undefined}
          >
            {code}
          </button>
        );
      })}
    </footer>
  );
}
