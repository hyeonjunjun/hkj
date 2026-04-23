"use client";

type FolioProps = {
  /** Middle segment — e.g. "§02", "N-001", "№02". */
  token: string;
  /** Optional 2-digit month (e.g. "04"); appends ".<month>" to the year. */
  month?: string;
};

const YEAR = 2026;

export default function Folio({ token, month }: FolioProps) {
  const year = month ? `${YEAR}.${month}` : `${YEAR}`;
  return (
    <div className="folio" aria-hidden>
      HKJ&nbsp;/&nbsp;{token}&nbsp;/&nbsp;{year}
      <style>{`
        .folio {
          position: fixed;
          top: 24px;
          right: 24px;
          z-index: 51;
          font-family: var(--font-stack-mono);
          font-size: 9px;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: var(--ink-4);
          pointer-events: none;
        }
        @media (max-width: 640px) {
          .folio { display: none; }
        }
      `}</style>
    </div>
  );
}
