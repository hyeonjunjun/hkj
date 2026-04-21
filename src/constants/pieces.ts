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
  /** Hero asset for the /work/[slug] CaseStudy page. */
  image?: string;
  /** Home catalog frame media. Leave undefined for the typographic placeholder. */
  cover?: CatalogCover;
  /** "cover" fills the frame; "center" lets portrait assets breathe on a paper field. */
  coverFit?: "cover" | "center";
  /** Aspect ratio string for the home strip frame (e.g. "16 / 9", "4 / 5", "1 / 1"). */
  coverAspect?: string;
  tags: string[];
}

export const PIECES: Piece[] = [
  {
    slug: "clouds-at-sea",
    title: "Clouds at Sea",
    type: "experiment",
    order: 1,
    number: "01",
    sector: "WebGL / Generative",
    description: "Somewhere between water and sky, the horizon dissolves.",
    status: "shipped",
    year: 2026,
    cover: { kind: "video", src: "/assets/cloudsatsea.mp4" },
    coverAspect: "16 / 9",
    tags: ["webgl", "generative"],
  },
  {
    slug: "gyeol",
    title: "Gyeol: \uACB0",
    type: "project",
    order: 2,
    number: "02",
    sector: "Material Science",
    description: "Conceptual fragrance and e-commerce brand rooted in Korean craft traditions.",
    status: "shipped",
    year: 2026,
    image: "/images/gyeol-display-hanji.webp",
    cover: {
      kind: "video",
      src: "/assets/gyeol-broll-combined.mp4",
      poster: "/images/gyeol-spring.webp",
    },
    coverAspect: "4 / 5",
    tags: ["brand", "ecommerce", "3d"],
  },
  {
    slug: "pane",
    title: "Pane",
    type: "project",
    order: 3,
    number: "03",
    sector: "Ambient Computing",
    description:
      "A Jarvis-like ambient dashboard — contextual telemetry, focused attention, quiet systems.",
    status: "wip",
    year: 2026,
    coverAspect: "4 / 3",
    tags: ["dashboard", "ambient", "ai"],
  },
  {
    slug: "sift",
    title: "Sift",
    type: "project",
    order: 4,
    number: "04",
    sector: "Mobile / AI",
    description: "AI-powered tool for finding what matters in your camera roll.",
    status: "shipped",
    year: 2025,
    image: "/images/sift-v2.webp",
    cover: { kind: "image", src: "/images/sift-v2.webp" },
    coverFit: "center",
    coverAspect: "9 / 16",
    tags: ["mobile", "ai", "product"],
  },
  {
    slug: "ondo",
    title: "Ondo",
    type: "project",
    order: 5,
    number: "05",
    sector: "Brand Identity",
    description:
      "Seasonal apothecary concept — tactile packaging, Korean materia medica, a ritual brand.",
    status: "wip",
    year: 2026,
    coverAspect: "1 / 1",
    tags: ["brand", "packaging", "concept"],
  },
  {
    slug: "moa",
    title: "Moa",
    type: "project",
    order: 6,
    number: "06",
    sector: "Editorial Identity",
    description:
      "Micro-publication and reading society — a quiet typographic brand for slow thought.",
    status: "wip",
    year: 2026,
    coverAspect: "3 / 4",
    tags: ["brand", "editorial", "concept"],
  },
  {
    slug: "yeo",
    title: "Yeo",
    type: "project",
    order: 7,
    number: "07",
    sector: "Fragrance Atelier",
    description:
      "Objects and scent — sculptural bottle system, minimal ingredient-led identity.",
    status: "wip",
    year: 2026,
    coverAspect: "2 / 3",
    tags: ["brand", "fragrance", "concept"],
  },
  {
    slug: "halla",
    title: "Halla",
    type: "project",
    order: 8,
    number: "08",
    sector: "Hospitality",
    description:
      "Tea house identity and menu system — Hallasan heritage, ceramic-forward.",
    status: "wip",
    year: 2026,
    coverAspect: "5 / 4",
    tags: ["brand", "hospitality", "concept"],
  },
];
