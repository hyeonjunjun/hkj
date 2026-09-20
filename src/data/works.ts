import type { MediaAsset } from "@/lib/types";

export type WorkCategory = "WORK" | "CONCEPT" | "STUDY";

/**
 * One documentation block on a Work's detail page — a process note, a
 * supporting image with caption, or both together. Every field is
 * optional so a section can be pure text, pure image, or a labeled
 * combination of the two; a Work with no `sections` (or an empty array)
 * still renders a complete page from just its header + hero, which is
 * the state every placeholder Work is in today.
 */
export interface WorkSection {
  /** Short quiet label above the section, e.g. "process", "concept" — same microtype as the metadata sidebar, not a heading-sized headline. */
  heading?: string;
  body?: string;
  media?: MediaAsset;
  /** Shown under `media`, prefixed with an auto-numbered "fig. NN —". */
  caption?: string;
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
  /** Case-study body, rendered below the hero on the Work detail page. See WorkSection. */
  sections?: WorkSection[];
}

/**
 * GROWTH STRATEGY (Works room):
 * - /works renders every entry in a plain two-column grid, in array order.
 * - Individual Work pages live at /works/[slug] as long-form case studies.
 * - Add a Work: append an object to this array with a unique slug.
 */

export const works: Work[] = [
  {
    id: "work-01",
    slug: "placeholder-i",
    index: 1,
    romanNumeral: "I",
    title: "PROJECT TITLE",
    caption: "placeholder caption",
    description: "Placeholder short description of the work.",
    category: "WORK",
    year: "YEAR",
    status: "LIVE",
    role: "Design + Build",
    media: {
      type: "image",
      src: "/images/IMG_7851.jpg",
      alt: "Ichiran ramen shop at night, queue along the sidewalk under neon",
      aspectRatio: "landscape",
    },
    sections: [
      {
        heading: "process",
        body: "Placeholder process note — a paragraph describing how the work took shape, the constraints it worked within, and the decisions that shaped the outcome.",
        media: { type: "placeholder", alt: "Process detail for Work I", aspectRatio: "landscape" },
        caption: "Placeholder caption for a process image.",
      },
      {
        heading: "outcome",
        body: "Placeholder outcome note — a second paragraph covering what shipped, what it's used for, or what came out of it.",
      },
    ],
  },
  {
    id: "work-02",
    slug: "placeholder-ii",
    index: 2,
    romanNumeral: "II",
    title: "PROJECT TITLE",
    caption: "placeholder caption",
    description: "Placeholder short description of the work.",
    category: "STUDY",
    year: "YEAR",
    status: "IN DEVELOPMENT",
    role: "Personal visual",
    media: {
      type: "video",
      src: "/assets/flower_trees.mp4",
      alt: "Cherry blossoms against a blue sky",
      aspectRatio: "wide",
    },
    sections: [
      {
        heading: "observation",
        body: "Placeholder observation note — what prompted the study, and what was being looked at closely.",
        media: { type: "placeholder", alt: "Study detail for Work II", aspectRatio: "portrait" },
        caption: "Placeholder caption for a study image.",
      },
      {
        heading: "notes",
        body: "Placeholder closing note — what the study turned up, or what it fed into afterward.",
      },
    ],
  },
  {
    id: "work-03",
    slug: "placeholder-iii",
    index: 3,
    romanNumeral: "III",
    title: "PROJECT TITLE",
    caption: "placeholder caption",
    description: "Placeholder short description of the work.",
    category: "CONCEPT",
    year: "YEAR",
    status: "IN DEVELOPMENT",
    role: "Concept + Direction",
    media: {
      type: "placeholder",
      alt: "Placeholder for Work III",
      aspectRatio: "square",
    },
    sections: [
      {
        heading: "concept",
        body: "Placeholder concept note — the idea being tested and why it seemed worth exploring.",
        media: { type: "placeholder", alt: "Concept detail for Work III", aspectRatio: "wide" },
        caption: "Placeholder caption for a concept image.",
      },
      {
        heading: "direction",
        body: "Placeholder direction note — where the concept could go if it were developed further.",
      },
    ],
  },
  {
    id: "work-04",
    slug: "placeholder-iv",
    index: 4,
    romanNumeral: "IV",
    title: "PROJECT TITLE",
    caption: "placeholder caption",
    description: "Placeholder short description of the work.",
    category: "WORK",
    year: "YEAR",
    status: "IN DEVELOPMENT",
    role: "Design + Build",
    media: {
      type: "placeholder",
      alt: "Placeholder for Work IV",
      aspectRatio: "portrait",
    },
    sections: [
      {
        heading: "process",
        body: "Placeholder process note — how the build was approached and what shaped the early decisions.",
        media: { type: "placeholder", alt: "Process detail for Work IV", aspectRatio: "square" },
        caption: "Placeholder caption for a process image.",
      },
      {
        heading: "outcome",
        body: "Placeholder outcome note — where the work stands now and what's still in progress.",
      },
    ],
  },
  {
    id: "work-05",
    slug: "placeholder-v",
    index: 5,
    romanNumeral: "V",
    title: "PROJECT TITLE",
    caption: "placeholder caption",
    description: "Placeholder short description of the work.",
    category: "CONCEPT",
    year: "YEAR",
    status: "CONCEPT",
    role: "Concept + Direction",
    media: {
      type: "placeholder",
      alt: "Placeholder for Work V",
      aspectRatio: "landscape",
    },
    sections: [
      {
        heading: "concept",
        body: "Placeholder concept note — the premise behind the piece and the question it was asking.",
        media: { type: "placeholder", alt: "Concept detail for Work V", aspectRatio: "landscape" },
        caption: "Placeholder caption for a concept image.",
      },
      {
        heading: "notes",
        body: "Placeholder closing note — open questions or what a next pass might change.",
      },
    ],
  },
];
