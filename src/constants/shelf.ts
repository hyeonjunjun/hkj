export type ShelfKind = "BOOK" | "PORTFOLIO" | "ESSAY" | "ARCHIVE";
export type ShelfGroup = "READ" | "WATCH" | "KEEP" | "VISIT";

export interface ShelfItem {
  id: string;
  kind: ShelfKind;
  group: ShelfGroup;
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
  // ── READ ─────────────────────────────────────────────────────────
  {
    id: "b01",
    kind: "BOOK",
    group: "READ",
    title: "Designing Design",
    attribution: "Kenya Hara",
    year: "2007",
    note: "The whole direction of this site lives here — emptiness as active material, design as observation.",
  },
  {
    id: "b02",
    kind: "BOOK",
    group: "READ",
    title: "Super Normal",
    attribution: "Jasper Morrison & Naoto Fukasawa",
    year: "2006",
    note: "Documentary equality across 204 objects. The argument for restraint as the hardest design move.",
  },
  {
    id: "b03",
    kind: "BOOK",
    group: "READ",
    title: "The Nature of Order",
    attribution: "Christopher Alexander",
    year: "2003",
    note: "Still the clearest argument I know for why some interfaces feel alive and others don't.",
  },
  {
    id: "b04",
    kind: "BOOK",
    group: "READ",
    title: "Less and More",
    attribution: "Dieter Rams",
    year: "2010",
    note: "Ten theses I re-read quarterly.",
  },
  {
    id: "p01",
    kind: "PORTFOLIO",
    group: "READ",
    title: "Emil Kowalski",
    attribution: "emilkowal.ski",
    href: "https://emilkowal.ski",
    note: "The portfolio is the shipped components. Substance over packaging.",
  },
  {
    id: "p02",
    kind: "PORTFOLIO",
    group: "READ",
    title: "Flora Guo",
    attribution: "floguo.com",
    href: "https://www.floguo.com",
    note: "Dictionary-entry homepage — the editorial framing device is the whole concept.",
  },
  {
    id: "p03",
    kind: "PORTFOLIO",
    group: "READ",
    title: "Cathy Dolle",
    attribution: "cathydolle.com",
    href: "https://cathydolle.com",
    note: "Mirrored numbered index, mix-blend-difference cursor. Proof a catalog can be the whole hero.",
  },
  {
    id: "p04",
    kind: "PORTFOLIO",
    group: "READ",
    title: "Rauno Freiberg",
    attribution: "rauno.me",
    href: "https://rauno.me",
    note: "Craft you can feel in 40×40px details. One-line manifesto above the work.",
  },
  {
    id: "p05",
    kind: "PORTFOLIO",
    group: "READ",
    title: "Craig Mod",
    attribution: "craigmod.com",
    href: "https://craigmod.com",
    note: "Walking, writing, publishing. Scholarly-journal cadence on a personal site.",
  },
  {
    id: "e01",
    kind: "ESSAY",
    group: "READ",
    title: "A new species of product tool",
    attribution: "Linear",
    year: "Ongoing",
    href: "https://linear.app/about",
    note: "Philosophy sentences carrying the brand. The template for naming what you make.",
  },
  {
    id: "e02",
    kind: "ESSAY",
    group: "READ",
    title: "Rauno Freiberg — interviews + UI writing",
    attribution: "ui.land",
    href: "https://ui.land/interviews/rauno-freiberg",
    note: "On engineering craft as quiet discipline.",
  },
  {
    id: "a01",
    kind: "ARCHIVE",
    group: "READ",
    title: "Muji",
    attribution: "muji.com",
    href: "https://www.muji.com",
    note: "Hara's studio made visible in every product photograph.",
  },
  {
    id: "a02",
    kind: "ARCHIVE",
    group: "READ",
    title: "Teenage Engineering",
    attribution: "teenage.engineering",
    href: "https://teenage.engineering",
    note: "Manual-design discipline as a way of making.",
  },
  {
    id: "a03",
    kind: "ARCHIVE",
    group: "READ",
    title: "Vitsœ",
    attribution: "vitsoe.com",
    href: "https://www.vitsoe.com",
    note: "Dieter Rams's ten theses applied, still, 60 years later.",
  },

  // ── WATCH ────────────────────────────────────────────────────────
  {
    id: "w01",
    kind: "ESSAY",
    group: "WATCH",
    title: "Jasper Morrison — A Super Normal Conversation",
    attribution: "Vitra Design Museum",
    year: "2018",
    href: "https://www.youtube.com/results?search_query=jasper+morrison+super+normal",
    note: "Morrison in his own voice. The clearest primary source for what documentary equality means in practice.",
  },
  {
    id: "w02",
    kind: "ESSAY",
    group: "WATCH",
    title: "The Shape of the Invisible",
    attribution: "Kenya Hara · talks",
    year: "2015",
    note: "Hara's lecture format on emptiness — the precursor to Designing Design as a book.",
  },

  // ── KEEP ─────────────────────────────────────────────────────────
  {
    id: "k01",
    kind: "ARCHIVE",
    group: "KEEP",
    title: "OP-1 Field",
    attribution: "Teenage Engineering",
    note: "The instrument as a catalog. Manual typography on a portable device.",
  },
  {
    id: "k02",
    kind: "ARCHIVE",
    group: "KEEP",
    title: "Butterfly Stool",
    attribution: "Sori Yanagi · Vitra",
    year: "1954",
    note: "Near my desk. A reminder that the best objects don't explain themselves.",
  },

  // ── VISIT ────────────────────────────────────────────────────────
  {
    id: "v01",
    kind: "ARCHIVE",
    group: "VISIT",
    title: "MUJI 5th Avenue",
    attribution: "Manhattan",
    href: "https://www.muji.com/us/en/",
    note: "Not for the shopping — for the layout. A classroom on how to arrange a shelf.",
  },
  {
    id: "v02",
    kind: "ARCHIVE",
    group: "VISIT",
    title: "Strand Bookstore",
    attribution: "East Village",
    href: "https://www.strandbooks.com/",
    note: "Where most of the books under READ were found.",
  },
];
