"use client";

import { KINDS, type KindId } from "../lib/kinds";
import { formatDate } from "../lib/folio";

interface Props {
  code: string;          // e.g. "R000" or "W001"
  kind: KindId | "catalog";
  date: string;          // ISO
  total: number;
  index: number;         // 1-based position in the catalog
}

export function Spine({ code, kind, date, total, index }: Props) {
  const kindLabel = kind === "catalog" ? "catalog" : KINDS[kind].label;
  return (
    <aside className="v2-spine" aria-label="folio spine">
      <span className="v2-spine__code">{code}</span>
      <span className="v2-spine__kind">{kindLabel}</span>
      <span className="v2-spine__date">{formatDate(date)}</span>
      <span className="v2-spine__hanko" aria-hidden>r</span>
      <span className="v2-spine__count">no. {String(index).padStart(2, "0")} of {String(total).padStart(2, "0")}</span>
    </aside>
  );
}
