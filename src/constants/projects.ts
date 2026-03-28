import { PIECES } from "./pieces";

export interface Project {
  id: string;
  slug: string;
  title: string;
  order: number;
  description: string;
  cover: { bg: string; text: string };
  coverImage?: string;
  tags: string[];
  sector: string;
  status: "shipped" | "wip";
  year: number;
}

/** Derive sector label from tags */
function deriveSector(tags: string[]): string {
  const map: Record<string, string> = {
    brand: "Branding",
    ecommerce: "E-Commerce",
    "3d": "3D",
    mobile: "Mobile",
    ai: "AI",
    product: "Product",
    "design-system": "Design System",
    ui: "UI",
    texture: "Material",
    material: "Material",
    webgl: "WebGL",
    generative: "Generative",
  };
  for (const tag of tags) {
    if (map[tag]) return map[tag];
  }
  return "Design";
}

export const PROJECTS: Project[] = PIECES.filter((p) => p.type === "project").map((p) => ({
  id: p.slug,
  slug: p.slug,
  title: p.title,
  order: p.order,
  description: p.description,
  cover: p.cover,
  tags: p.tags,
  sector: deriveSector(p.tags),
  status: p.status,
  year: p.year,
}));
