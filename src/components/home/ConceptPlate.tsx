// src/components/home/ConceptPlate.tsx
import type { Piece } from "@/constants/pieces";

type Props = {
  piece: Piece;
  className?: string;
};

const STATUS_LABEL: Record<Piece["status"], string> = {
  concept: "concept",
  wip: "wip",
  shipped: "shipped",
};

export function ConceptPlate({ piece, className = "" }: Props) {
  return (
    <div
      className={`concept-plate ${className}`}
      role="img"
      aria-label={`${piece.title}${piece.sector ? ` — ${piece.sector}` : ""}`}
    >
      <span className="t-code tabular concept-plate__num">§{piece.number}</span>
      <span
        className={`t-meta concept-plate__status${piece.status === "wip" ? " live" : ""}`}
      >
        {STATUS_LABEL[piece.status]}
      </span>
      <h2
        className="concept-plate__title"
        aria-label={piece.title}
      >
        {piece.title}
      </h2>
      {piece.sector && (
        <span className="t-meta concept-plate__sector">{piece.sector}</span>
      )}

      <style>{`
        .concept-plate {
          position: absolute;
          inset: 0;
          display: grid;
          grid-template-rows: auto 1fr auto;
          padding: clamp(12px, 1.5vw, 20px);
          background: var(--paper-2);
        }
        .concept-plate__num {
          grid-row: 1;
          grid-column: 1;
          color: var(--ink-3);
          align-self: start;
        }
        .concept-plate__status {
          grid-row: 1;
          grid-column: 2;
          color: var(--ink-3);
          justify-self: end;
          align-self: start;
        }
        .concept-plate__status.live { color: var(--accent); }
        .concept-plate__title {
          grid-row: 2;
          grid-column: 1 / span 2;
          align-self: center;
          font-family: var(--font-stack-mono);
          font-size: clamp(40px, 5vw, 80px);
          font-weight: 500;
          letter-spacing: -0.04em;
          line-height: 0.95;
          color: var(--ink);
          text-transform: uppercase;
          margin: 0;
          overflow-wrap: anywhere;
        }
        .concept-plate__sector {
          grid-row: 3;
          grid-column: 1 / span 2;
          color: var(--ink-3);
          align-self: end;
        }
      `}</style>
    </div>
  );
}
