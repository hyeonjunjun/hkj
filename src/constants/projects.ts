export type ProjectStatus = "shipped" | "wip";

export interface Project {
    id: string;
    title: string;
    slug: string;
    order: number;
    description: string;
    year: string;
    sector: string;
    coverImage?: string;
    coverBlur?: string;
    coverVideos?: string[];
    cover: {
        bg: string;
        text: string;
        accent: string;
    };
    status: ProjectStatus;
}

export const PROJECTS: Project[] = [
    {
        id: "gyeol",
        title: "GYEOL: 결",
        slug: "gyeol",
        order: 1,
        description: "material typography system exploring Korean craft and texture.",
        year: "2026",
        sector: "Material Science",
        coverImage: "/images/gyeol-display-hanji.webp",
        coverBlur: "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACwAQCdASoIAAgABUB8JYgCdACkHCGAAPvK+2OSZrljwuJp7MSZzsNF6n+VQAAA",
        coverVideos: ["/assets/gyeol-broll4.mp4", "/assets/gyeol-broll1.mp4", "/assets/gyeol-broll2.mp4", "/assets/gyeol-broll3.mp4"],
        cover: {
            bg: "#2a241c",
            text: "rgba(255, 252, 245, 0.85)",
            accent: "rgba(255, 252, 245, 0.15)",
        },
        status: "shipped",
    },
    {
        id: "sift",
        title: "Sift",
        slug: "sift",
        order: 2,
        description: "camera roll search that surfaces the photos you actually want.",
        year: "2025",
        sector: "Mobile / AI",
        coverImage: "/images/sift-v2.webp",
        coverBlur: "data:image/webp;base64,UklGRkAAAABXRUJQVlA4IDQAAADQAQCdASoIAAgABUB8JbAC7ADdSgBAQAD2n1jIQGi7bxrzIrGXy4r6PIMvhFNjFhOc0IAA",
        cover: {
            bg: "#e8e2d8",
            text: "rgba(35, 32, 28, 0.82)",
            accent: "rgba(35, 32, 28, 0.10)",
        },
        status: "shipped",
    },
    {
        id: "conductor",
        title: "Conductor",
        slug: "conductor",
        order: 3,
        description: "design system for scaling consistency across product surfaces.",
        year: "2026",
        sector: "Design Systems",
        cover: {
            bg: "#3d3830",
            text: "rgba(255, 252, 245, 0.80)",
            accent: "rgba(255, 252, 245, 0.12)",
        },
        status: "wip",
    },
];
