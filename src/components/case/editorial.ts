/**
 * Editorial copy for the case-study template — keyed by piece slug.
 *
 * The template at /work/[slug] reads from this map and falls back to
 * a single-line stub when no entry is present. Each entry is a list
 * of paragraphs paired with an optional margin annotation (the small
 * uppercase microtype that sits to the left of the prose column on
 * desktop, à la a printed monograph's running header).
 *
 * Copy is intentionally short and editorial — the case-study page is
 * a reading surface, not a feature list. Three paragraphs is the
 * default rhythm; longer cases can run more.
 */

export type EditorialBlock = {
  /** Optional left-margin label, rendered in uppercase Geist Sans. */
  annotation?: string;
  /** Body paragraph — set in Newsreader serif. */
  paragraph: string;
};

export type EditorialEntry = {
  /** Role line for the ledger, e.g. "Design + Development". */
  role: string;
  blocks: EditorialBlock[];
};

export const EDITORIAL: Record<string, EditorialEntry> = {
  gyeol: {
    role: "Design + Development",
    blocks: [
      {
        annotation: "On the grain",
        paragraph:
          "결 — gyeol — is the Korean word for grain: the quiet pattern that runs through hanji paper, the soft directional sheen on a brushed brass cap, the way patience leaves a record in any material that took time to make. Gyeol the brand is a fragrance house built on that idea. Each scent is a small study of a Korean material at the moment its grain is most legible — paper just after sizing, metal just after the lathe, cedar still warm from the saw.",
      },
      {
        annotation: "Patience as texture",
        paragraph:
          "The site reads as a printed monograph rather than a storefront. Long measure, generous gutter, paper-and-ink palette, hairline rules — every decision is borrowed from the kind of catalog you would pick up in a Tokyo bookshop and bring home for the typography alone. Patience is the texture we were trying to render. Nothing flashes; nothing animates without earning it. Hover states are a single pixel of underline. The product photography breathes.",
      },
      {
        annotation: "Bottle as object",
        paragraph:
          "The fragrance bottle is a real-time WebGL render — Three.js with a custom GLSL shader that reads a brushed-brass anisotropic highlight against a hanji-fiber displacement map. On the product page it rotates slowly under cursor influence; on detail it freezes and reveals an exploded view of the cap, neck, and atomizer. Commerce flow is intentionally short: three steps from discovery to checkout, every screen typeset on the same 16-column grid as the editorial spreads, so the act of buying never breaks the reading rhythm.",
      },
    ],
  },
};
