export type PieceType = "project" | "experiment";

/**
 * Lifecycle states for a piece:
 *   - "concept": a proposed/in-conception case study. No shipped asset
 *     yet; renders with a typographic placeholder until media lands.
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

export type CatalogCover =
  | { kind: "video"; src: string; poster?: string }
  | { kind: "image"; src: string };

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
   * use this — the catalog only ships real work or named concepts.
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
 * The catalog. Five case-study pieces anchor the practice positioning:
 * LA28 (the wip personal flagship) plus four concept projects that
 * read the multidisciplinary brief in different registers — AI
 * hardware identity, spatial audio, generative music tooling, and a
 * concept-car website. Two personal pieces (Sift, Gyeol) live in a
 * separate category — real shipped work that signals craft but not
 * positioning.
 */
export const PIECES: Piece[] = [
  {
    slug: "la28",
    title: "LA28",
    type: "project",
    order: 1,
    number: "01",
    category: "case-study",
    sector: "Brand · Campaign · Personal",
    description:
      "A personal concept for the LA28 Olympic brand campaign — atmosphere first, identity following the weather.",
    status: "wip",
    year: 2026,
    started: "2026-04",
    cover: {
      kind: "video",
      src: "/assets/aurebor_jeju.mp4",
    },
    coverAspect: "16 / 9",
    tags: ["brand", "campaign", "personal"],
    runtime: "02:30",
    client: "Personal",
    workLog: [0, 0, 1, 2, 3, 5, 6, 7, 7, 7, 7, 6],
  },
  {
    slug: "ai-hardware",
    title: "AI Hardware Brand",
    type: "project",
    order: 2,
    number: "02",
    category: "case-study",
    sector: "Brand · Product · Identity",
    description:
      "A premium identity for a fictional AI companion device — brand, packaging, product page, campaign. Treating AI hardware as furniture, not tech: Nothing's transparency meets Teenage Engineering's personality meets Aesop's restraint.",
    status: "concept",
    year: 2026,
    started: "2026-03",
    coverAspect: "4 / 5",
    tags: ["brand", "product", "identity"],
    runtime: "02:14",
    client: "Concept",
    workLog: [0, 1, 3, 5, 6, 5, 4, 3, 2, 1, 1, 1],
  },
  {
    slug: "spatial-audio",
    title: "Spatial Audio Brand",
    type: "project",
    order: 3,
    number: "03",
    category: "case-study",
    sector: "Brand · Sound · Web Audio",
    description:
      "A fictional brand designing sound for physical spaces — restaurants, hotels, retail. Audio treated as interior design. The site itself uses Web Audio API so visitors hear the difference as they scroll between rooms, not just read about it.",
    status: "concept",
    year: 2026,
    started: "2026-03",
    coverAspect: "16 / 9",
    tags: ["brand", "sound", "web-audio"],
    runtime: "02:48",
    client: "Concept",
    workLog: [0, 2, 4, 6, 5, 3, 2, 1, 0, 0, 0, 0],
  },
  {
    slug: "album-cover-generator",
    title: "Album Cover System",
    type: "project",
    order: 4,
    number: "04",
    category: "case-study",
    sector: "Creative Code · Music · Tool",
    description:
      "A web tool that generates album covers from audio. Upload a track; the system reads frequency, tempo, and dynamics and renders a visual that responds to the music. Sound becomes image, algorithmically — the BTS/Fred Again register made literal.",
    status: "concept",
    year: 2026,
    started: "2026-04",
    coverAspect: "1 / 1",
    tags: ["creative-code", "music", "tool"],
    runtime: "03:32",
    client: "Concept",
    workLog: [0, 1, 2, 3, 4, 5, 6, 6, 5, 4, 3, 2],
  },
  {
    slug: "concept-car",
    title: "Concept Car Brand",
    type: "project",
    order: 5,
    number: "05",
    category: "case-study",
    sector: "Brand · WebGL · Direction",
    description:
      "A fictional concept car for 2030 — brand, product page, configurator, campaign. The site is the showroom: full-screen media, shader transitions, scroll-driven camera. Automotive websites are stuck in 2019; this rewrites the category.",
    status: "concept",
    year: 2026,
    started: "2026-04",
    coverAspect: "21 / 9",
    tags: ["brand", "webgl", "direction"],
    runtime: "04:06",
    client: "Concept",
    workLog: [0, 1, 2, 4, 6, 7, 7, 6, 5, 4, 3, 2],
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
