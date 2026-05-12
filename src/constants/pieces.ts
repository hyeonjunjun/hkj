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
  /** Client / brand the work is for. "Personal" / "Self" for spec. */
  client?: string;
  /**
   * Hand-tuned 12-char unicode bar string showing the project's work
   * intensity over its duration. DEPRECATED — prefer `workLog`
   * (typed, future-API-compatible). Kept only as fallback.
   */
  waveform?: string;
  /**
   * Work-rate intensity samples across the project's duration. Each
   * value is 0–7, mapping 1:1 to one of the eight unicode block
   * elements (U+2581—U+2588). 12 samples is the canonical strip
   * length so all rows align.
   *
   * Schema kept narrow so it can later be sourced from a live API:
   *   GET /api/work-rate/[slug] → { workLog: number[], updatedAt }
   * For now, hand-curated per project but renderer-driven.
   */
  workLog?: number[];
  /** YYYY-MM stamp — when work ended/shipped. Undefined → still wip. */
  ended?: string;
  /**
   * Multi-image preview cycle for the cursor-tracked preview. When
   * the cursor lingers on a row for >800ms, the preview cycles
   * through these images at ~1.2s per image. Each piece gets up to
   * 4 fragments (concept + real-world + detail + context) so the
   * hover becomes a teaser rather than a single cover. Borrowed
   * from caverzasio.ch's multi-image project preview. Falls back
   * to a single-image cycle when undefined.
   */
  previewImages?: string[];
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
    client: "Personal",
    workLog: [0, 0, 1, 2, 3, 5, 6, 7, 7, 7, 7, 6],
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
    client: "Halo Halo!",
    workLog: [1, 3, 6, 7, 6, 5, 4, 2, 1, 0, 0, 0],
    ended: "2026-09",
    previewImages: [
      "/images/halo-halo/image-31.png", // product hero — packaging
      "/images/halo-halo/image-20.png", // lifestyle — tote in the city
      "/images/halo-halo/image-21.png", // typographic — printed menu
      "/images/halo-halo/image-29.png", // architectural — storefront
    ],
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
    client: "Self",
    workLog: [0, 1, 2, 4, 5, 6, 7, 6, 5, 4, 2, 0],
    ended: "2025-12",
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
    client: "Gyeol",
    workLog: [0, 1, 2, 4, 6, 7, 7, 7, 7, 7, 5, 2],
    ended: "2026-04",
    previewImages: [
      "/images/gyeol-rain.webp",            // atmospheric — rain plate
      "/images/gyeol-spring.webp",          // sunlit — yellow flowers
      "/images/gyeol-green-tea.webp",       // tea-ceremony context
      "/images/gyeol-display-hanji.webp",   // packaging detail
    ],
  },
];
