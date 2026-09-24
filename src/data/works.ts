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
  /**
   * The home spread. One, two or three plates shown side by side at a
   * shared height — dylan.camera's handling, measured off his site:
   * the block is a fixed 8 columns and the count divides its width
   * (1 item 1260px, 2 items 624px, 3 items 412px at a 1920 viewport).
   * Aspect ratio is NOT preserved; everything cover-crops to the common
   * height, which is what lets a 16:9 still sit beside a portrait.
   *
   * Omit to show `media` alone.
   */
  plates?: MediaAsset[];
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
    slug: "words-to-the-world",
    index: 1,
    romanNumeral: "I",
    title: "Words to the World",
    caption: "Instruction Sets for Strangers",
    description:
      "This project has been through many iterations — two physical, and many more in my imagination. The final one was intended to serve as a physical space for individuals to express themselves, their thoughts, and emotions.",
    category: "STUDY",
    year: "2026",
    status: "LIVE",
    role: "Design + Build",
    media: {
      type: "image",
      src: "/images/words-to-the-world/writing.jpg",
      alt: "A man adding to the canvas on its easel in the park, the sheet already half covered in coloured writing",
      aspectRatio: "wide",
    },
    /* The arc, left to right: the blank invitation, a stranger adding to
       it, the surface once it had filled. */
    plates: [
      {
        type: "image",
        src: "/images/words-to-the-world/invitation.jpg",
        alt: "The easel standing under trees in the park early on, the sheet carrying only a few marks, with markers taped along the top edge",
        aspectRatio: "portrait",
      },
      {
        type: "image",
        src: "/images/words-to-the-world/writing.jpg",
        alt: "A man adding to the canvas, the sheet already half covered in coloured writing",
        aspectRatio: "wide",
      },
      {
        type: "image",
        src: "/images/words-to-the-world/surface.jpg",
        alt: "The filled canvas, covered edge to edge in phrases, names and drawings in several languages",
        aspectRatio: "landscape",
      },
    ],
    sections: [
      {
        heading: "the object",
        body: "A roughly 28\u2033 \u00d7 38\u2033 handmade wooden backboard, a wooden easel standing 62\u201364\u2033 tall, and three sheets of plotter paper. Each sheet is mostly blank, with the exception of two individual quotation marks \u2014 one at the top-left corner, one at the bottom-right.",
        media: {
          type: "image",
          src: "/images/words-to-the-world/board.jpg",
          alt: "The finished backboard on its easel in the woodshop, blank except for a quotation mark in each opposing corner",
          aspectRatio: "portrait",
        },
        caption: "The sheet before anything is on it. The quotation marks are the whole instruction.",
      },
      {
        heading: "the instruction",
        body: "The initial goal was to have strangers sign their names, or write whatever came to their minds. That intention was only partially accomplished.",
        media: {
          type: "image",
          src: "/images/words-to-the-world/first-mark.jpg",
          alt: "The first mark on the blank sheet — the words hello world written in blue marker",
          aspectRatio: "wide",
        },
        caption: "The first mark.",
      },
      {
        heading: "what happened",
        body: "The more natural instinct, when a stranger sees a blank canvas roughly taped to a backboard with painter\u2019s tape and is handed colourful Sharpies, is to draw and write. A signature is a more formal way of expressing oneself \u2014 and although most people only ever use one for legal matters, there is of course the memory of signing a childhood drawing before it goes up on the fridge.",
        media: {
          type: "image",
          src: "/images/words-to-the-world/detail.jpg",
          alt: "Close detail of the filled sheet, with messages in several languages including Korean and English",
          aspectRatio: "portrait",
        },
        caption: "Contributions in several languages, a few signed, most not.",
      },
      {
        heading: "outcome",
        body: "Many of the contributions were remarks, questions, motivation, expressions of love, support, and hope. A few were signed, and a few were signatures, but the majority were phrases and thoughts. Overall I would consider the project a success, despite difficulties with time management and the lack of a well thought-out process.",
        media: {
          type: "image",
          src: "/images/words-to-the-world/surface.jpg",
          alt: "The canvas at the end of the day, filled edge to edge",
          aspectRatio: "landscape",
        },
        caption: "The sheet at the end of the day.",
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
