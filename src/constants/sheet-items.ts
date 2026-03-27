export type SheetItemType = "WORK" | "BRAND" | "EXPLORE";

export interface SheetItemData {
  id: string;
  type: SheetItemType;
  image: string | null;
  color?: string;
  href?: string;
  wide?: boolean;
  wip?: boolean;
  description: string;
  year: number;
}

export const SHEET_ITEMS: SheetItemData[] = [
  {
    id: "gyeol",
    type: "WORK",
    image: "/images/gyeol-display-hanji.webp",
    href: "/work/gyeol",
    description: "material typography exploring Korean craft and texture.",
    year: 2026,
  },
  {
    id: "sift",
    type: "WORK",
    image: "/images/sift-v2.webp",
    href: "/work/sift",
    description: "AI-powered tool for finding what matters in your camera roll.",
    year: 2025,
  },
  {
    id: "conductor",
    type: "WORK",
    image: null,
    color: "#3d3830",
    href: "/work/conductor",
    wip: true,
    description: "design system orchestrating consistency across product surfaces.",
    year: 2026,
  },
  {
    id: "brand-a",
    type: "BRAND",
    image: null,
    color: "#8B7355",
    wide: true,
    description: "coming soon.",
    year: 2026,
  },
  {
    id: "spring-grain",
    type: "EXPLORE",
    image: "/images/gyeol-spring.webp",
    description: "cherry blossom season captured in surface tension.",
    year: 2026,
  },
  {
    id: "brand-b",
    type: "BRAND",
    image: null,
    color: "#6B7B6B",
    wide: true,
    description: "coming soon.",
    year: 2026,
  },
  {
    id: "rain-on-stone",
    type: "EXPLORE",
    image: "/images/gyeol-rain.webp",
    description: "wet granite revealing what was always there.",
    year: 2026,
  },
  {
    id: "hanji-display",
    type: "EXPLORE",
    image: "/images/gyeol-display-hanji.webp",
    description: "Korean mulberry paper — light through, never piercing.",
    year: 2026,
  },
  {
    id: "green-tea",
    type: "EXPLORE",
    image: "/images/gyeol-green-tea.webp",
    description: "matcha as material.",
    year: 2026,
  },
  {
    id: "cushion",
    type: "EXPLORE",
    image: "/images/cushion-gyeol.webp",
    description: "softness rendered.",
    year: 2025,
  },
  {
    id: "clouds-at-sea",
    type: "EXPLORE",
    image: null,
    color: "#8fa8be",
    description: "between water and sky.",
    year: 2026,
  },
  {
    id: "project-d",
    type: "WORK",
    image: null,
    color: "#4A4540",
    description: "coming soon.",
    year: 2026,
  },
  {
    id: "project-e",
    type: "WORK",
    image: null,
    color: "#5A5550",
    description: "coming soon.",
    year: 2026,
  },
  {
    id: "brand-c",
    type: "BRAND",
    image: null,
    color: "#7A6B5A",
    description: "coming soon.",
    year: 2026,
  },
];
