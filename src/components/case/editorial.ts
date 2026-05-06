/**
 * Editorial copy for the case-study template — keyed by piece slug.
 *
 * The template at /work/[slug] reads this map and falls back to a
 * single-line stub when no entry is present. Each block is a single
 * paragraph; margin annotations were retired with the reference
 * subtraction pass (neither hs68 nor aino uses them).
 */

export type EditorialBlock = {
  /** Body paragraph — set in Geist Sans. */
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
        paragraph:
          "결 — gyeol — is the Korean word for grain: the quiet pattern that runs through hanji paper, the soft directional sheen on a brushed brass cap, the way patience leaves a record in any material that took time to make. Gyeol the brand is a fragrance house built on that idea. Each scent is a small study of a Korean material at the moment its grain is most legible — paper just after sizing, metal just after the lathe, cedar still warm from the saw.",
      },
      {
        paragraph:
          "The site reads as a printed monograph rather than a storefront. Long measure, generous gutter, paper-and-ink palette, hairline rules — every decision is borrowed from the kind of catalog you would pick up in a Tokyo bookshop and bring home for the typography alone. Patience is the texture we were trying to render. Nothing flashes; nothing animates without earning it. Hover states are a single pixel of underline. The product photography breathes.",
      },
      {
        paragraph:
          "The fragrance bottle is a real-time WebGL render — Three.js with a custom GLSL shader that reads a brushed-brass anisotropic highlight against a hanji-fiber displacement map. On the product page it rotates slowly under cursor influence; on detail it freezes and reveals an exploded view of the cap, neck, and atomizer. Commerce flow is intentionally short: three steps from discovery to checkout, every screen typeset on the same 16-column grid as the editorial spreads, so the act of buying never breaks the reading rhythm.",
      },
    ],
  },
};
