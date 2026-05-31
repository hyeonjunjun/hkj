import type { Folio } from "./folio";

// Placeholder catalog — real content arrives later. Per the
// 2026-05-30 home-focus feedback the text stays simple; the work
// here is grid + type, not copy.
export const FOLIOS: Folio[] = [
  { id: "archive-of-me",      kind: "writing", no: 1, date: "2026-05-30", title: "archive of me",          status: "draft" },
  { id: "on-cataloguing",     kind: "writing", no: 2, date: "2026-05-22", title: "on cataloguing",         status: "draft" },
  { id: "after-the-corner",   kind: "writing", no: 3, date: "2026-05-18", title: "after the corner",       status: "draft" },

  { id: "la28",               kind: "work",    no: 1, date: "2026-04-12", title: "la28",                   status: "draft" },
  { id: "halo-halo",          kind: "work",    no: 2, date: "2026-03-08", title: "halo halo",              status: "live"  },
  { id: "sift",               kind: "work",    no: 3, date: "2025-11-04", title: "sift",                   status: "live"  },
  { id: "gyeol",              kind: "work",    no: 4, date: "2026-02-19", title: "gyeol",                  status: "live"  },

  { id: "xxiivv",             kind: "link",    no: 1, date: "2026-05-20", title: "xxiivv",                 status: "live"  },
  { id: "hara-designing",     kind: "link",    no: 2, date: "2026-05-10", title: "hara, designing design", status: "live"  },

  { id: "jonsi-tomatchi",     kind: "listen",  no: 1, date: "2026-05-28", title: "jónsi · tómatchi",       status: "live"  },
  { id: "fred-again-secure",  kind: "listen",  no: 2, date: "2026-05-21", title: "fred again · secure",    status: "live"  },

  { id: "first-fragment",     kind: "note",    no: 1, date: "2026-05-30", title: "first fragment",         status: "draft" },
  { id: "on-staying-in-one",  kind: "note",    no: 2, date: "2026-05-24", title: "on staying in one place",status: "draft" },
];

// Newest first across all kinds.
export const FOLIOS_BY_DATE = [...FOLIOS].sort((a, b) => (a.date < b.date ? 1 : -1));

export function foliosOfKind(kindId: Folio["kind"]) {
  return FOLIOS.filter((f) => f.kind === kindId).sort((a, b) => b.no - a.no);
}
