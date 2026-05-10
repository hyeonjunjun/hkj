export type PieceType = "project" | "experiment";

export type CatalogCover =
  | { kind: "video"; src: string; poster?: string }
  | { kind: "image"; src: string };

export interface Piece {
  slug: string;
  title: string;
  type: PieceType;
  order: number;
  number: string;
  sector: string;
  description: string;
  status: "shipped" | "wip";
  year: number;
  /** YYYY-MM stamp — when work began. Used in archive ledger row. */
  started: string;
  /** Hero asset for the /work/[slug] CaseStudy page. */
  image?: string;
  /** Home catalog frame media. Leave undefined for the typographic fallback. */
  cover?: CatalogCover;
  /** "cover" fills the frame; "center" lets portrait assets breathe on a paper field. */
  coverFit?: "cover" | "center";
  /** Aspect ratio string for the home strip frame (e.g. "16 / 9", "4 / 5", "1 / 1"). */
  coverAspect?: string;
  tags: string[];
  /**
   * Optional alternate cover frame; revealed on hover. Same shape as
   * `cover` (video or image discriminated union) so the renderer can
   * reuse the existing branch.
   */
  coverAlt?: CatalogCover;
  /**
   * When true, the plate renders as a static reserved cell (no link,
   * no cover, paper-2 fill). Used for "Untitled" placeholders that
   * hold the grid's rhythm before content lands. Currently no entries
   * use this — the catalog only ships real work.
   */
  placeholder?: boolean;
  /**
   * Decorative MM:SS runtime for the home's tracklist column. Reads
   * as a music-coded duration — 1 month of work ≈ 1 minute is the
   * rough mapping but each piece is hand-tuned for set rhythm.
   * Undefined for placeholders → renders as "—:—".
   */
  runtime?: string;
}

/**
 * The catalog. Four real pieces. LA28 leads as the first item with
 * `status: "wip"` — its plate carries the homepage's hero video and
 * receives the WIP backdrop-blur on hover (the visual stays intact
 * but un-clarified, the way a teaser plate should). Halo Halo!,
 * Sift, and Gyeol follow as shipped pieces in the catalog spread.
 */
export const PIECES: Piece[] = [
  {
    slug: "la28",
    title: "LA28",
    type: "project",
    order: 1,
    number: "01",
    sector: "Brand · Campaign · Personal",
    description:
      "A personal concept for the LA28 Olympic brand campaign — atmosphere first, identity following the weather.",
    status: "wip",
    year: 2026,
    started: "2026-04",
    cover: {
      kind: "video",
      src: "/assets/cloudsatsea.mp4",
    },
    coverAspect: "16 / 9",
    tags: ["brand", "campaign", "personal"],
    runtime: "02:30",
  },
  {
    slug: "halo-halo",
    title: "Halo Halo!",
    type: "project",
    order: 2,
    number: "02",
    sector: "Brand · Café",
    description:
      "A café brand for Halo Halo! — a New York ube shop. Purple-forward identity, packaging, and signage.",
    status: "shipped",
    year: 2026,
    started: "2026-04",
    image: "/images/halo-halo/image-31.png",
    cover: { kind: "image", src: "/images/halo-halo/image-31.png" },
    coverAspect: "3 / 4",
    tags: ["brand", "cafe"],
    runtime: "04:18",
  },
  {
    slug: "sift",
    title: "Sift",
    type: "project",
    order: 3,
    number: "03",
    sector: "Mobile · AI · Product",
    description:
      "An AI tool that surfaces what matters in your camera roll.",
    status: "shipped",
    year: 2025,
    started: "2025-09",
    image: "/images/sift-v2.webp",
    cover: { kind: "image", src: "/images/sift-v2.webp" },
    coverFit: "center",
    coverAspect: "9 / 16",
    tags: ["mobile", "ai", "product"],
    runtime: "06:42",
  },
  {
    slug: "gyeol",
    title: "Gyeol: 결",
    type: "project",
    order: 4,
    number: "04",
    sector: "Brand · Ecommerce · 3D",
    description:
      "A fragrance brand rooted in Korean material grain — hanji, brushed metal, the texture of patience.",
    status: "shipped",
    year: 2026,
    started: "2026-02",
    image: "/images/gyeol-rain.webp",
    cover: { kind: "image", src: "/images/gyeol-rain.webp" },
    coverAspect: "3 / 4",
    tags: ["brand", "ecommerce", "3d"],
    runtime: "08:24",
  },

  /* Reserved slots for upcoming work — Q3 2026 onward.
     Rendered as "Untitled" rail items with no cover; the rail entry
     exists so the catalog reads at full length while the work is in
     development. As each piece lands, replace title/sector/cover and
     drop the placeholder flag. */
  {
    slug: "rj-26-05",
    title: "Untitled",
    type: "project",
    order: 5,
    number: "05",
    sector: "Brand · Identity",
    description: "In development — Q3 2026.",
    status: "wip",
    year: 2026,
    started: "2026-05",
    coverAspect: "3 / 4",
    tags: ["brand"],
    placeholder: true,
  },
  {
    slug: "rj-26-06",
    title: "Untitled",
    type: "project",
    order: 6,
    number: "06",
    sector: "Product · SaaS",
    description: "In development — Q3 2026.",
    status: "wip",
    year: 2026,
    started: "2026-05",
    coverAspect: "3 / 4",
    tags: ["product", "saas"],
    placeholder: true,
  },
  {
    slug: "rj-26-07",
    title: "Untitled",
    type: "project",
    order: 7,
    number: "07",
    sector: "Mobile · Consumer",
    description: "In development — Q4 2026.",
    status: "wip",
    year: 2026,
    started: "2026-06",
    coverAspect: "3 / 4",
    tags: ["mobile", "consumer"],
    placeholder: true,
  },
  {
    slug: "rj-26-08",
    title: "Untitled",
    type: "project",
    order: 8,
    number: "08",
    sector: "Brand · Editorial",
    description: "In development — Q4 2026.",
    status: "wip",
    year: 2026,
    started: "2026-06",
    coverAspect: "3 / 4",
    tags: ["brand", "editorial"],
    placeholder: true,
  },
];
