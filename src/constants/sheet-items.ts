export type SheetItemType = "WORK" | "BRAND" | "EXPLORE";

export interface SheetItemData {
  id: string;
  title: string;
  number: string;
  type: SheetItemType;
  image: string | null;
  color?: string;
  href?: string;
  wide?: boolean;
  wip?: boolean;
  description: string;
  year: number;
  gallery?: string[];
}

export const SHEET_ITEMS: SheetItemData[] = [
  {
    id: "gyeol",
    title: "GYEOL: 결",
    number: "01",
    type: "WORK",
    image: "/images/gyeol-display-hanji.webp",
    href: "/work/gyeol",
    description: "material typography exploring Korean craft and texture.",
    year: 2026,
    gallery: ["/images/gyeol-spring.webp", "/images/gyeol-rain.webp"],
  },
  {
    id: "sift",
    title: "Sift",
    number: "02",
    type: "WORK",
    image: "/images/sift-v2.webp",
    href: "/work/sift",
    description: "AI-powered tool for finding what matters in your camera roll.",
    year: 2025,
  },
  {
    id: "conductor",
    title: "Conductor",
    number: "03",
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
    title: "Brand A",
    number: "04",
    type: "BRAND",
    image: null,
    color: "#8B7355",
    wide: true,
    description: "coming soon.",
    year: 2026,
  },
  {
    id: "spring-grain",
    title: "Spring Grain",
    number: "05",
    type: "EXPLORE",
    image: "/images/gyeol-spring.webp",
    description: "cherry blossom season captured in surface tension.",
    year: 2026,
  },
  {
    id: "brand-b",
    title: "Brand B",
    number: "06",
    type: "BRAND",
    image: null,
    color: "#6B7B6B",
    wide: true,
    description: "coming soon.",
    year: 2026,
  },
  {
    id: "rain-on-stone",
    title: "Rain on Stone",
    number: "07",
    type: "EXPLORE",
    image: "/images/gyeol-rain.webp",
    description: "wet granite revealing what was always there.",
    year: 2026,
  },
  {
    id: "hanji-display",
    title: "Hanji Display",
    number: "08",
    type: "EXPLORE",
    image: "/images/gyeol-display-hanji.webp",
    description: "Korean mulberry paper — light through, never piercing.",
    year: 2026,
  },
  {
    id: "green-tea",
    title: "Green Tea",
    number: "09",
    type: "EXPLORE",
    image: "/images/gyeol-green-tea.webp",
    description: "matcha as material.",
    year: 2026,
  },
  {
    id: "cushion",
    title: "Cushion",
    number: "10",
    type: "EXPLORE",
    image: "/images/cushion-gyeol.webp",
    description: "softness rendered.",
    year: 2025,
  },
  {
    id: "clouds-at-sea",
    title: "Clouds at Sea",
    number: "11",
    type: "EXPLORE",
    image: null,
    color: "#8fa8be",
    description: "between water and sky.",
    year: 2026,
  },
  {
    id: "project-d",
    title: "Project D",
    number: "12",
    type: "WORK",
    image: null,
    color: "#4A4540",
    description: "coming soon.",
    year: 2026,
  },
  {
    id: "project-e",
    title: "Project E",
    number: "13",
    type: "WORK",
    image: null,
    color: "#5A5550",
    description: "coming soon.",
    year: 2026,
  },
  {
    id: "brand-c",
    title: "Brand C",
    number: "14",
    type: "BRAND",
    image: null,
    color: "#7A6B5A",
    description: "coming soon.",
    year: 2026,
  },
];
