import type { MediaAsset } from "@/lib/types";

export type ReferenceType = "image" | "link" | "quote" | "video";

export interface Reference {
  id: string;
  /** ISO 8601. */
  addedDate: string;
  type: ReferenceType;
  /** Where it came from. */
  source?: string;
  /** Link back to source. */
  sourceUrl?: string;
  title?: string;
  /** For quotes or notes. */
  body?: string;
  /** Ryan's note about why this matters. */
  note?: string;
  media?: MediaAsset;
  tags?: string[];
}

/**
 * GROWTH STRATEGY (References room):
 * - Curated collected attention. Not chronological — grouped by tags
 *   and rendered as a masonry-style grid.
 * - Sourced from Cosmos and Sublime manually for now. Future: consider
 *   API integration with Cosmos or a Notion/Airtable feed.
 * - Add a reference: append an object with unique id.
 * - When empty, room renders a quiet placeholder message.
 */

export const references: Reference[] = [];
