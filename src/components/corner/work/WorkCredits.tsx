import type { Piece } from "@/constants/pieces";
import type { WorkContent } from "@/constants/work-content";

/**
 * WorkCredits — masthead block for a project detail page.
 *
 * Layout:
 *   [NN]
 *   Project Title
 *   sector · sector · sector · year
 *   ──────────────────────────────
 *   ROLE        derived or override
 *   CLIENT      derived
 *   YEAR        derived
 *   DELIVERED   override or derived from started/ended
 *   STATUS      derived
 *
 * Reference: ethan&tom credit blocks — uppercase labels, sentence
 * values, generous line-height. Designed to read as a director's
 * credit slate.
 */

interface Props {
  piece: Piece;
  content?: WorkContent;
}

export function WorkCredits({ piece, content }: Props) {
  const number = `[${piece.number}]`;
  const status =
    piece.status === "wip" ? "Live · in progress" :
    piece.status === "concept" ? "Concept" :
    "Shipped";
  const deliveredFromPiece = piece.ended
    ? `${piece.started} → ${piece.ended}`
    : `${piece.started} → present`;
  const delivered = content?.credits?.delivered ?? deliveredFromPiece;
  const role = content?.credits?.role ?? "Design · Engineering";
  const client = piece.client ?? "—";

  return (
    <header className="work-credits">
      <div className="work-credits__head">
        <span className="t-warmth work-credits__num">{number}</span>
        <h1 className="t-warmth work-credits__title">{piece.title}</h1>
        <p className="t-warmth work-credits__line">
          {piece.sector}
          <span className="work-credits__sep" aria-hidden> · </span>
          <span className="tabular">{piece.year}</span>
        </p>
      </div>

      <hr className="t-rule" />

      <dl className="work-credits__table">
        <Pair label="Role" value={role} />
        <Pair label="Client" value={client} />
        <Pair label="Year" value={String(piece.year)} />
        <Pair label="Delivered" value={delivered} />
        <Pair label="Status" value={status} />
        {content?.credits?.collaborators && content.credits.collaborators.length > 0 && (
          <Pair label="With" value={content.credits.collaborators.join(", ")} />
        )}
      </dl>

      <style>{`
        .work-credits {
          display: grid;
          row-gap: clamp(20px, 2.4vh, 32px);
        }
        .work-credits__head {
          display: grid;
          row-gap: 12px;
        }
        .work-credits__num {
          color: var(--ink-3);
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.02em;
          line-height: 1;
        }
        .work-credits__title {
          color: var(--ink);
          font-size: clamp(30px, 5vw, 56px);
          font-weight: 500;
          letter-spacing: -0.02em;
          line-height: 1.05;
          margin: 0;
          text-transform: none;
          max-width: 22ch;
        }
        .work-credits__line {
          color: var(--ink-3);
          font-size: 12.5px;
          font-weight: 400;
          letter-spacing: 0.06em;
          line-height: 1.3;
          text-transform: uppercase;
          margin: 0;
        }
        .work-credits__sep {
          color: var(--ink-4);
        }
        .work-credits__table {
          display: grid;
          grid-template-columns: max-content 1fr;
          column-gap: clamp(20px, 2.4vw, 40px);
          row-gap: 10px;
          margin: 0;
          max-width: 64ch;
        }
        .work-credits__table dt {
          color: var(--ink-3);
          font-family: var(--font-stack-spotify);
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          line-height: 1.3;
        }
        .work-credits__table dd {
          color: var(--ink);
          font-family: var(--font-stack-spotify);
          font-size: 13px;
          font-weight: 400;
          letter-spacing: -0.005em;
          line-height: 1.3;
          margin: 0;
        }
      `}</style>
    </header>
  );
}

function Pair({ label, value }: { label: string; value: string }) {
  return (
    <>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </>
  );
}
