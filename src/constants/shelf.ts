export type ShelfKind = "BOOK" | "PORTFOLIO" | "ESSAY" | "ARCHIVE";

export interface ShelfItem {
  id: string;
  kind: ShelfKind;
  title: string;
  /** For books/essays: the author or source. For portfolios/archives: optional. */
  attribution?: string;
  /** Publication year for books/essays. */
  year?: string;
  /** External link — omitted for books that don't have a canonical URL. */
  href?: string;
  /** Optional one-line note on why this lives on the shelf. */
  note?: string;
}

/**
 * Shelf — a working bibliography. Things I return to when the work
 * needs weight. Not a reading list; a reference set actively consulted.
 */
export const SHELF: ShelfItem[] = [
  // ── BOOKS ────────────────────────────────────────────────────────
  {
    id: "b01",
    kind: "BOOK",
    title: "Designing Design",
    attribution: "Kenya Hara",
    year: "2007",
    note: "The whole direction of this site lives here — emptiness as active material, design as observation.",
  },
  {
    id: "b02",
    kind: "BOOK",
    title: "Super Normal",
    attribution: "Jasper Morrison & Naoto Fukasawa",
    year: "2006",
    note: "Documentary equality across 204 objects. The argument for restraint as the hardest design move.",
  },
  {
    id: "b03",
    kind: "BOOK",
    title: "The Nature of Order",
    attribution: "Christopher Alexander",
    year: "2003",
    note: "Still the clearest argument I know for why some interfaces feel alive and others don't.",
  },
  {
    id: "b04",
    kind: "BOOK",
    title: "Less and More",
    attribution: "Dieter Rams",
    year: "2010",
    note: "Ten theses I re-read quarterly.",
  },

  // ── PORTFOLIOS ───────────────────────────────────────────────────
  {
    id: "p01",
    kind: "PORTFOLIO",
    title: "Emil Kowalski",
    attribution: "emilkowal.ski",
    href: "https://emilkowal.ski",
    note: "The portfolio is the shipped components. Substance over packaging.",
  },
  {
    id: "p02",
    kind: "PORTFOLIO",
    title: "Flora Guo",
    attribution: "floguo.com",
    href: "https://www.floguo.com",
    note: "Dictionary-entry homepage — the editorial framing device is the whole concept.",
  },
  {
    id: "p03",
    kind: "PORTFOLIO",
    title: "Cathy Dolle",
    attribution: "cathydolle.com",
    href: "https://cathydolle.com",
    note: "Mirrored numbered index with mix-blend-difference cursor. The mechanic this site borrows.",
  },
  {
    id: "p04",
    kind: "PORTFOLIO",
    title: "Rauno Freiberg",
    attribution: "rauno.me",
    href: "https://rauno.me",
    note: "Craft you can feel in 40×40px details. One-line manifesto above the work.",
  },
  {
    id: "p05",
    kind: "PORTFOLIO",
    title: "Craig Mod",
    attribution: "craigmod.com",
    href: "https://craigmod.com",
    note: "Walking, writing, publishing. Scholarly-journal cadence on a personal site.",
  },

  // ── ESSAYS ────────────────────────────────────────────────────────
  {
    id: "e01",
    kind: "ESSAY",
    title: "A new species of product tool",
    attribution: "Linear",
    year: "Ongoing",
    href: "https://linear.app/about",
    note: "Philosophy sentences carrying the brand. The template for naming what you make.",
  },
  {
    id: "e02",
    kind: "ESSAY",
    title: "Rauno Freiberg — interviews + UI writing",
    attribution: "ui.land",
    href: "https://ui.land/interviews/rauno-freiberg",
    note: "On engineering craft as quiet discipline.",
  },

  // ── ARCHIVES ──────────────────────────────────────────────────────
  {
    id: "a01",
    kind: "ARCHIVE",
    title: "Muji",
    attribution: "muji.com",
    href: "https://www.muji.com",
    note: "Hara's studio made visible in every product photograph.",
  },
  {
    id: "a02",
    kind: "ARCHIVE",
    title: "Teenage Engineering",
    attribution: "teenage.engineering",
    href: "https://teenage.engineering",
    note: "Manual-design discipline as a way of making.",
  },
  {
    id: "a03",
    kind: "ARCHIVE",
    title: "Vitsœ",
    attribution: "vitsoe.com",
    href: "https://www.vitsoe.com",
    note: "Dieter Rams's ten theses applied, still, 60 years later.",
  },
];
