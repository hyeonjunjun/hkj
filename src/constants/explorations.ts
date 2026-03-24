/**
 * Explorations stub — content pending.
 * This file re-exports an empty array so existing pages compile.
 */
export interface Exploration {
  id: string;
  title: string;
  slug: string;
  date: string;
  description: string;
  tags: string[];
  image?: string;
  images?: string[];
  video?: string;
  aspect?: string;
}

export const EXPLORATIONS: Exploration[] = [];
