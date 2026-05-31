import { KINDS, type KindId } from "./kinds";

export interface Folio {
  id: string;            // canonical slug
  kind: KindId;
  no: number;            // restart per kind
  date: string;          // YYYY-MM-DD
  title: string;
  status: "draft" | "live" | "archived";
}

// Pad note number to 3 digits, prefix with kind letter.
export function folioCode(f: Folio): string {
  return `${KINDS[f.kind].prefix}${String(f.no).padStart(3, "0")}`;
}

export function formatDate(iso: string): string {
  // 2026-05-30 → 2026·05·30 (mono middle-dots)
  return iso.replaceAll("-", "·");
}
