export type PieceType = "project" | "experiment";

export interface Piece {
  slug: string;
  title: string;
  type: PieceType;
  order: number;
  description: string;
  cover: {
    bg: string;
    text: string;
  };
  tags: string[];
  status: "shipped" | "wip";
  year: number;
  image?: string;
}

export const PIECES: Piece[] = [
  {
    slug: "gyeol",
    title: "GYEOL",
    type: "project",
    order: 1,
    description: "Conceptual fragrance and e-commerce brand rooted in Korean craft traditions.",
    cover: { bg: "#2a241c", text: "rgba(255,252,245,0.85)" },
    tags: ["brand", "ecommerce", "3d"],
    status: "shipped",
    year: 2026,
    image: "/images/gyeol-display-hanji.webp",
  },
  {
    slug: "sift",
    title: "SIFT",
    type: "project",
    order: 2,
    description: "AI-powered tool for finding what matters in your camera roll.",
    cover: { bg: "#e8e2d8", text: "rgba(35,32,28,0.82)" },
    tags: ["mobile", "ai", "product"],
    status: "shipped",
    year: 2025,
    image: "/images/sift-v2.webp",
  },
  {
    slug: "conductor",
    title: "CONDUCTOR",
    type: "project",
    order: 3,
    description: "A design system that orchestrates consistency across product surfaces.",
    cover: { bg: "#3d3830", text: "rgba(255,252,245,0.80)" },
    tags: ["design-system", "ui"],
    status: "wip",
    year: 2026,
  },
  {
    slug: "spring-grain",
    title: "SPRING GRAIN",
    type: "experiment",
    order: 4,
    description: "Cherry blossom season captured in surface tension.",
    cover: { bg: "#C4B5A0", text: "rgba(35,32,28,0.82)" },
    tags: ["texture", "material"],
    status: "shipped",
    year: 2026,
    image: "/images/gyeol-spring.webp",
  },
  {
    slug: "rain-on-stone",
    title: "RAIN ON STONE",
    type: "experiment",
    order: 5,
    description: "Wet granite. The way water reveals what was always there.",
    cover: { bg: "#7A8B8C", text: "rgba(255,252,245,0.85)" },
    tags: ["texture", "material"],
    status: "shipped",
    year: 2026,
    image: "/images/gyeol-rain.webp",
  },
  {
    slug: "clouds-at-sea",
    title: "CLOUDS AT SEA",
    type: "experiment",
    order: 6,
    description: "Somewhere between water and sky, the horizon dissolves.",
    cover: { bg: "#8BA4B8", text: "rgba(255,252,245,0.85)" },
    tags: ["webgl", "generative"],
    status: "shipped",
    year: 2026,
  },
];
