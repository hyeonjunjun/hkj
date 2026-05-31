// Kind taxonomy — §4 of RYKJUN-PROJECT-FRAMEWORK.md
// Each kind owns a letter prefix, semantic color, body measure, glyph.

export type KindId = "writing" | "work" | "link" | "listen" | "note";

export interface Kind {
  id: KindId;
  prefix: "W" | "P" | "L" | "A" | "N";
  glyph: string;
  color: string;
  measureCh: number;
  label: string;
}

export const KINDS: Record<KindId, Kind> = {
  writing: { id: "writing", prefix: "W", glyph: "W", color: "#B0241A", measureCh: 66, label: "writing" },
  work:    { id: "work",    prefix: "P", glyph: "P", color: "#1A2E5A", measureCh: 48, label: "work"    },
  link:    { id: "link",    prefix: "L", glyph: "L", color: "#6B6B6B", measureCh: 32, label: "link"    },
  listen:  { id: "listen",  prefix: "A", glyph: "A", color: "#C58A1A", measureCh: 24, label: "listen"  },
  note:    { id: "note",    prefix: "N", glyph: "N", color: "#2E6B3A", measureCh: 40, label: "note"    },
};

export const KIND_ORDER: KindId[] = ["writing", "work", "link", "listen", "note"];
