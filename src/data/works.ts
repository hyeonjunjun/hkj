import type { MediaAsset } from "@/lib/types";

export type WorkCategory = "WORK" | "CONCEPT" | "STUDY";
export type CaptionPosition =
  | "right"
  | "above-center"
  | "above-right"
  | "above-left"
  | "below";

/** Desktop poster-composition placement for a single Work tile. */
export interface WorkLayout {
  desktopColumn: "left" | "center" | "right";
  /** Vertical anchor as a percentage (0-100) from the top of the viewport. */
  desktopVerticalAnchor: number;
  desktopSize: "sm" | "md" | "lg";
  captionPosition: CaptionPosition;
}

export interface Work {
  id: string;
  /** URL slug — the piece lives at /works/{slug}. */
  slug: string;
  /** 1-based order; also drives motion stagger and mobile stacking order. */
  index: number;
  romanNumeral: string;
  title: string;
  /** Short italic caption — the site's one serif-italic accent. */
  caption: string;
  /** Longer description shown on the individual Work page. */
  description: string;
  category: WorkCategory;
  year: string;
  status: "LIVE" | "IN DEVELOPMENT" | "CONCEPT";
  role: string;
  media: MediaAsset;
  layout: WorkLayout;
}

/**
 * GROWTH STRATEGY (Works room):
 * - Works 1-3 render in the poster composition on the /works index.
 * - Works 4+ overflow to a horizontal strip below the poster.
 * - Individual Work pages live at /works/[slug] as long-form case studies.
 * - Add a Work: append an object to this array with a unique slug.
 */

export const works: Work[] = [
  {
    id: "work-01",
    slug: "placeholder-i",
    index: 1,
    romanNumeral: "I",
    title: "Placeholder Title I",
    caption: "placeholder caption",
    description: "Placeholder short description of the work.",
    category: "WORK",
    year: "2025",
    status: "LIVE",
    role: "Design + Build",
    media: {
      type: "placeholder",
      alt: "Placeholder for Work I",
      aspectRatio: "portrait",
    },
    layout: {
      desktopColumn: "left",
      desktopVerticalAnchor: 55,
      desktopSize: "md",
      captionPosition: "right",
    },
  },
  {
    id: "work-02",
    slug: "placeholder-ii",
    index: 2,
    romanNumeral: "II",
    title: "Placeholder Title II",
    caption: "placeholder caption",
    description: "Placeholder short description of the work.",
    category: "WORK",
    year: "2025",
    status: "LIVE",
    role: "Design + Build",
    media: {
      type: "placeholder",
      alt: "Placeholder for Work II",
      aspectRatio: "square",
    },
    layout: {
      desktopColumn: "center",
      desktopVerticalAnchor: 40,
      desktopSize: "sm",
      captionPosition: "above-center",
    },
  },
  {
    id: "work-03",
    slug: "placeholder-iii",
    index: 3,
    romanNumeral: "III",
    title: "Placeholder Title III",
    caption: "placeholder caption",
    description: "Placeholder short description of the work.",
    category: "CONCEPT",
    year: "2026",
    status: "IN DEVELOPMENT",
    role: "Concept + Direction",
    media: {
      type: "placeholder",
      alt: "Placeholder for Work III",
      aspectRatio: "square",
    },
    layout: {
      desktopColumn: "right",
      desktopVerticalAnchor: 30,
      desktopSize: "lg",
      captionPosition: "above-right",
    },
  },
];
