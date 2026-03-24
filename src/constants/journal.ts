/**
 * Journal stub — content pending.
 * This file re-exports an empty array so existing pages compile.
 */
export type JournalTag = "design" | "code" | "life";

export interface JournalEntry {
  id: string;
  slug: string;
  title: string;
  date: string;
  tags: JournalTag[];
  excerpt: string;
  body?: string;
  image?: string;
}

export const JOURNAL_ENTRIES: JournalEntry[] = [];
