export type PieceType = "project" | "experiment";

/**
 * Lifecycle states for a piece:
 *   - "concept": a proposed/in-conception case study. No shipped asset
 *     yet; renders with a sleeping-cat placeholder until media lands.
 *   - "wip":     active work in progress; live tag, amber accent.
 *   - "shipped": real shipped work; static.
 */
export type PieceStatus = "concept" | "wip" | "shipped";

/**
 * Editorial category:
 *   - "case-study": professional case-study identity. Concept and
 *     real client work that anchors the practice positioning.
 *   - "personal":   self-driven projects shown for craft signal, not
 *     as positioning anchors. Rendered in a dimmer register.
 */
export type PieceCategory = "case-study" | "personal";

/**
 * Cover media for the index card.
 *
 *  - `focus` is the crop anchor — any CSS `object-position` value
 *    (`"50% 30%"`, `"top right"`, `"center"`…). Defaults to `"center"`.
 *  - `scale` overflows the frame multiplicatively (1.10 = 10% bigger) so
 *    all four edges crop off symmetrically from center. Useful for
 *    swallowing baked-in letterboxes / corner watermarks while keeping
 *    the composition centered. Defaults to 1 (no overflow).
 */
interface CatalogCoverBase {
  focus?: string;
  scale?: number;
}
export type CatalogCover =
  | (CatalogCoverBase & { kind: "video"; src: string; poster?: string })
  | (CatalogCoverBase & { kind: "image"; src: string });

export interface Piece {
  slug: string;
  title: string;
  type: PieceType;
  order: number;
  number: string;
  category: PieceCategory;
  sector: string;
  description: string;
  status: PieceStatus;
  year: number;
  /** YYYY-MM stamp — when work began. Used in archive ledger row. */
  started: string;
  /** Hero asset for the /work/[slug] CaseStudy page. */
  image?: string;
  /** Home catalog frame media. Leave undefined for the typographic fallback. */
  cover?: CatalogCover;
  /** Aspect ratio string for the home strip frame (e.g. "16 / 9", "4 / 5", "1 / 1"). */
  coverAspect?: string;
  tags: string[];
  /** Optional alternate cover frame; revealed on hover. */
  coverAlt?: CatalogCover;
  placeholder?: boolean;
  runtime?: string;
  client?: string;
  waveform?: string;
  workLog?: number[];
  /** YYYY-MM stamp — when work ended/shipped. Undefined → still wip. */
  ended?: string;
  previewImages?: string[];
}

/**
 * The catalog — 2026-05-14 rewrite.
 *
 * Eight pieces in numbered slots. Two new lead concepts (Relay, Plot)
 * anchor the practice positioning at the top. LA28 moves to 03;
 * AURÉBOR enters at 08 carrying the aurebor_jeju video. Slots 04/05
 * hold incoming brand-study concepts. Sift and Gyeol stay in personal
 * 06/07 as shipped craft signal.
 *
 * Pieces with status "concept" render the sleeping-cat "project
 * incoming" placeholder on the index until real media lands.
 */
export const PIECES: Piece[] = [
  {
    slug: "relay",
    title: "Relay",
    type: "project",
    order: 1,
    number: "01",
    category: "case-study",
    sector: "Brand · Product · Concept",
    description:
      "Project incoming — a relay concept currently being scoped.",
    status: "concept",
    year: 2026,
    started: "2026-05",
    coverAspect: "16 / 9",
    tags: ["brand", "product", "concept"],
    runtime: "—:—",
    client: "Concept",
  },
  {
    slug: "plot",
    title: "Plot",
    type: "project",
    order: 2,
    number: "02",
    category: "case-study",
    sector: "Brand · Editorial · Concept",
    description:
      "Project incoming — Plot is in early framing.",
    status: "concept",
    year: 2026,
    started: "2026-05",
    coverAspect: "16 / 9",
    tags: ["brand", "editorial", "concept"],
    runtime: "—:—",
    client: "Concept",
  },
  {
    slug: "la28",
    title: "LA28",
    type: "project",
    order: 3,
    number: "03",
    category: "case-study",
    sector: "Brand · Campaign · Personal",
    description:
      "A personal concept for the LA28 Olympic brand campaign — atmosphere first, identity following the weather.",
    status: "wip",
    year: 2026,
    started: "2026-04",
    coverAspect: "16 / 9",
    tags: ["brand", "campaign", "personal"],
    runtime: "02:30",
    client: "Personal",
    workLog: [0, 0, 1, 2, 3, 5, 6, 7, 7, 7, 7, 6],
  },
  {
    slug: "fashion-brand-study",
    title: "Fashion Brand Study",
    type: "project",
    order: 4,
    number: "04",
    category: "case-study",
    sector: "Brand · Fashion · Concept",
    description:
      "Project incoming — a study on contemporary fashion brand identity.",
    status: "concept",
    year: 2026,
    started: "2026-05",
    coverAspect: "16 / 9",
    tags: ["brand", "fashion", "concept"],
    runtime: "—:—",
    client: "Concept",
  },
  {
    slug: "cpg-startup-study",
    title: "CPG Startup Study",
    type: "project",
    order: 5,
    number: "05",
    category: "case-study",
    sector: "Brand · CPG · Concept",
    description:
      "Project incoming — a study on consumer packaged goods identity for early-stage brands.",
    status: "concept",
    year: 2026,
    started: "2026-05",
    coverAspect: "16 / 9",
    tags: ["brand", "cpg", "concept"],
    runtime: "—:—",
    client: "Concept",
  },
  {
    slug: "sift",
    title: "Sift",
    type: "project",
    order: 6,
    number: "06",
    category: "personal",
    sector: "Mobile · AI · Product",
    description:
      "An AI tool that surfaces what matters in your camera roll.",
    status: "shipped",
    year: 2025,
    started: "2025-09",
    image: "/images/sift-v2.webp",
    cover: { kind: "image", src: "/images/sift-v2.webp" },
    coverAspect: "2 / 1",
    tags: ["mobile", "ai", "product"],
    runtime: "06:42",
    client: "Self",
    workLog: [0, 1, 2, 4, 5, 6, 7, 6, 5, 4, 2, 0],
    ended: "2025-12",
  },
  {
    slug: "gyeol",
    title: "Gyeol: 결",
    type: "project",
    order: 7,
    number: "07",
    category: "personal",
    sector: "Brand · Ecommerce · 3D",
    description:
      "A fragrance brand rooted in Korean material grain — hanji, brushed metal, the texture of patience.",
    status: "shipped",
    year: 2026,
    started: "2026-02",
    image: "/images/gyeol-rain.webp",
    cover: {
      kind: "video",
      src: "/assets/gyeol-broll-combined.mp4",
      poster: "/images/gyeol-rain.webp",
      // Source carries a Veo watermark + baked-in letterbox edges. Scale
      // overflows from center so top/bottom strips clip off equally.
      scale: 1.1,
    },
    coverAspect: "16 / 9",
    tags: ["brand", "ecommerce", "3d"],
    runtime: "08:24",
    client: "Gyeol",
    workLog: [0, 1, 2, 4, 6, 7, 7, 7, 7, 7, 5, 2],
    ended: "2026-04",
    previewImages: [
      "/images/gyeol-rain.webp",
      "/images/gyeol-spring.webp",
      "/images/gyeol-green-tea.webp",
      "/images/gyeol-display-hanji.webp",
    ],
  },
  {
    slug: "aurebor",
    title: "AURÉBOR",
    type: "project",
    order: 8,
    number: "08",
    category: "case-study",
    sector: "Brand · Atmosphere · WIP",
    description:
      "An atmospheric brand experiment captured on location in Jeju.",
    status: "wip",
    year: 2026,
    started: "2026-04",
    cover: {
      kind: "video",
      src: "/assets/aurebor_jeju.mp4",
      // Top + bottom letterbox bars and the bottom-right Veo watermark.
      // Center-origin scale clips both strips off symmetrically.
      scale: 1.1,
    },
    coverAspect: "16 / 9",
    tags: ["brand", "atmosphere", "wip"],
    runtime: "03:14",
    client: "Personal",
    workLog: [0, 1, 2, 3, 4, 5, 5, 6, 6, 5, 4, 3],
  },
];
