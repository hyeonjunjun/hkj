import type { MediaAsset } from "@/lib/types";

export type ArchiveEntryType = "photo" | "note" | "mix" | "video" | "sketch" | "thought";

export interface ArchiveEntry {
  id: string;
  /** Optional — creates a permalink at /archive/{slug} for entries that deserve their own page. */
  slug?: string;
  /** ISO 8601, e.g. "2026-07-09". */
  date: string;
  type: ArchiveEntryType;
  title?: string;
  body?: string;
  media?: MediaAsset;
  tags?: string[];
}

/**
 * GROWTH STRATEGY (Archive room):
 * - Entries are dated ISO format. Sorted reverse-chronological on render.
 * - Each entry is a small module. Some have media, some are text-only,
 *   some are just a link or a quote.
 * - Optional slug creates a permalink at /archive/[slug] for entries
 *   that deserve their own page (longer notes, essays).
 * - Add an entry: append an object to this array with a unique id.
 * - Types drive small visual variations but all entries share the same
 *   Courier register.
 */

export const archive: ArchiveEntry[] = [
  {
    id: "arch-placeholder-01",
    date: "2026-07-09",
    type: "note",
    title: "First entry placeholder",
    body: "Placeholder entry body. Replace with real content when ready.",
    tags: ["placeholder"],
  },
  {
    id: "arch-placeholder-02",
    date: "2026-07-05",
    type: "photo",
    title: "Placeholder photo",
    body: "Placeholder caption for photo entry.",
    media: {
      type: "placeholder",
      alt: "Placeholder image",
      aspectRatio: "landscape",
    },
    tags: ["placeholder"],
  },
  {
    id: "arch-placeholder-03",
    date: "2026-06-28",
    type: "thought",
    body: "Placeholder thought — a short line of writing without title or media.",
  },
];
