"use client";

interface Props {
  date: string;          // human, mono
  kind: string;
  status: string;
  measure: string;       // e.g. "66ch"
  hint?: string;
}

export function TopStrip({ date, kind, status, measure, hint }: Props) {
  return (
    <header className="v2-top">
      <div className="v2-top__left">
        <span>{date}</span>
        <span className="v2-top__sep">·</span>
        <span>{kind}</span>
        <span className="v2-top__sep">·</span>
        <span>{status}</span>
        <span className="v2-top__sep">·</span>
        <span>{measure}</span>
      </div>
      <div className="v2-top__right">
        {hint && <span className="v2-top__hint">{hint}</span>}
      </div>
    </header>
  );
}
