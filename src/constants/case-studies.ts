export interface ProjectHighlight {
    id: string;
    title: string;
    description: string;
    challenge: string;
    recipe?: string;
    images: string[];
}

export interface ProjectStat {
    label: string;
    value: string;
}

export interface LaunchVideo {
    id: string;
    title: string;
    thumbnail: string;
    url: string;
    type: "Short" | "Product Hunt" | "Full";
}

export interface VideoClip {
    src: string;
    poster?: string;
    caption?: string;
    aspect?: string;
}

export interface CaseStudy {
    id: string;
    client: string;
    role: string;
    tags: string[];
    editorial: {
        heading: string;
        copy: string;
        subhead?: string;
        images?: string[];
    };
    process?: {
        title: string;
        copy: string;
        images?: string[];
    };
    highlights?: ProjectHighlight[];
    engineering?: {
        title: string;
        copy: string;
        signals: string[];
        images?: string[];
    };
    statistics?: ProjectStat[];
    videos?: VideoClip[];
    contributors?: Array<{ name: string; role: string }>;
    paradox?: string;
    stakes?: string;
    gutPunch?: string;
    processSteps?: Array<{ title: string; copy: string; image?: string }>;
    image?: string;
    mood?: string;
    launchVideos?: LaunchVideo[];
    schematic?: {
        stack: string[];
        grid: string;
        typography: string;
        colors: string[];
    };
    cardVideo?: string;
    cardVideos?: string[];
    cardFormat?: "portrait" | "landscape";
    has3dInspector?: boolean;
    heroAnnotations?: Array<{
        brand?: string;
        label: string;
        anchorX: number; anchorY: number;
        targetX: number; targetY: number;
    }>;
}

export const CASE_STUDIES: Record<string, CaseStudy> = {
    gyeol: {
        id: "gyeol",
        client: "HKJ",
        role: "Design & Engineering",
        tags: ["Material", "Texture", "WebGL"],
        image: "/images/gyeol-spring.webp",
        mood: "#A0A0A0",
        editorial: {
            heading: "Digital Grain.",
            subhead: "Where Pixels Meet Patina",
            copy: "결 (gyeol) is the Korean word for grain — the invisible pattern that gives wood its character, stone its identity, fabric its hand-feel. GYEOL explores the uncanny valley between digital rendering and physical material. By mapping real-world texture data onto WebGL surfaces, we create interfaces that feel tangibly present — like touching brushed aluminum or woven fabric through glass. The project began as a personal obsession: why does every screen feel the same?",
            images: ["/images/gyeol-spring.webp"],
        },
        process: {
            title: "Material Research",
            copy: "We started by cataloging 200+ physical textures — scanning surfaces with a macro lens, extracting displacement maps, and converting them into GPU-accelerated shaders. Each material went through a 'feel test': could someone identify the material just by watching it respond to light and motion on screen?",
            images: [],
        },
        highlights: [
            {
                id: "displacement",
                title: "Displacement Mapping",
                description: "Real-world surface data captured at sub-millimeter resolution drives the vertex shader. The displacement isn't decorative — it's data-driven, reproducing the actual topology of each material at interactive frame rates.",
                challenge: "How do you render physically accurate surface displacement at 60fps on consumer GPUs without tessellation?",
                recipe: "Custom LOD System + Parallax Occlusion Mapping + Deferred Rendering",
                images: [],
            },
            {
                id: "subsurface",
                title: "Perceived Warmth",
                description: "Materials have temperature. Marble feels cold, oak feels warm — even on screen. We built a subsurface scattering approximation that shifts light transmission based on material density, creating an instinctive sense of thermal character.",
                challenge: "How do you make a flat screen communicate the thermal character of a physical material?",
                recipe: "SSS Approximation + Color Temperature Mapping + Ambient Occlusion",
                images: [],
            },
        ],
        engineering: {
            title: "Engineering",
            copy: "The rendering pipeline uses a custom PBR shader stack built on Three.js with React Three Fiber for component architecture. Displacement maps drive vertex manipulation in real-time, while a deferred rendering pass handles subsurface scattering approximation. The entire system runs at 60fps on integrated GPUs through aggressive LOD management and texture streaming.",
            signals: ["WebGL 2.0", "PBR Shading", "Displacement Maps", "SSS Approximation", "Texture Streaming"],
            images: [],
        },
        statistics: [
            { label: "Materials", value: "200+" },
            { label: "Frame Rate", value: "60fps" },
            { label: "Shader Lines", value: "2.4k" },
            { label: "Texture Res", value: "4K" },
        ],
        launchVideos: [],
        contributors: [{ name: "Ryan Jun", role: "Design & Engineering" }],
        schematic: {
            stack: ["Three.js", "React Three Fiber", "Custom GLSL"],
            grid: "Modular",
            typography: "Inter",
            colors: ["#A0A0A0", "#2C2C2C", "#E8E4DF"],
        },
        paradox: "Can a screen ever truly feel like a physical surface?",
        stakes: "Every interface we touch is smooth glass. GYEOL asks: what if it wasn't? The grain of a material carries its entire history — growth rings, geological pressure, woven thread count. Screens flatten all of this into uniform smoothness.",
        gutPunch: "The future of UI isn't flatter. It's textured.",
        processSteps: [
            { title: "Surface Cataloging", copy: "Macro photography of 200+ materials — wood, stone, metal, fabric, ceramic. Each surface scanned at multiple angles to capture how light reveals grain." },
            { title: "Displacement Extraction", copy: "Converting high-resolution photographs into height maps and normal maps using photogrammetry. Building a library of GPU-ready material data." },
            { title: "Shader Prototyping", copy: "Iterative GLSL development — testing each material's response to dynamic lighting, user interaction, and ambient conditions in real-time." },
            { title: "Feel Testing", copy: "Blind tests with designers and non-designers: can they identify the material just by watching it on screen? Success rate drove shader refinement." },
        ],
        has3dInspector: true,
        heroAnnotations: [
            { brand: "material", label: "hanji paper", anchorX: 75, anchorY: 30, targetX: 45, targetY: 40 },
            { brand: "detail", label: "korean seal", anchorX: 25, anchorY: 55, targetX: 50, targetY: 52 },
            { brand: "product", label: "display light", anchorX: 70, anchorY: 75, targetX: 55, targetY: 65 },
        ],
        cardVideo: "/assets/gyeol-broll3.mp4",
        cardVideos: [
            "/assets/gyeol-broll1.mp4",
            "/assets/gyeol-broll2.mp4",
            "/assets/gyeol-broll3.mp4",
            "/assets/gyeol-broll4.mp4",
        ],
        videos: [
            { src: "/assets/gyeol-broll1.mp4", poster: "/images/gyeol-spring.webp", caption: "oak grain displacement", aspect: "16/9" },
            { src: "/assets/gyeol-broll2.mp4", poster: "/images/gyeol-spring.webp", caption: "marble subsurface scattering", aspect: "1/1" },
            { src: "/assets/gyeol-broll3.mp4", poster: "/images/gyeol-spring.webp", caption: "brushed aluminum anisotropy", aspect: "1/1" },
            { src: "/assets/gyeol-broll4.mp4", poster: "/images/gyeol-spring.webp", caption: "woven linen displacement", aspect: "16/9" },
        ],
        cardFormat: "portrait",
    },
    sift: {
        id: "sift",
        client: "HKJ",
        role: "Design & Engineering",
        tags: ["Digital Sanctuary", "UX of AI", "React Native"],
        image: "/images/sift-v2.webp",
        mood: "#CF957B",
        editorial: {
            heading: "Save Anything, Understand Everything.",
            subhead: "The Knowledge Architect",
            copy: "Sift elevates your digital consumption by turning fleeting social media moments into a permanent, curated library. It combines advanced social media scraping, AI synthesis, and editorial presentation in a premium, warm aesthetic. Functioning as a 'personal librarian,' Sift strips away the noise to leave only what matters—guiding passive browsing into an active, structured knowledge base through 'The Gist', a single-sentence summary for every page.",
            images: ["/images/sift-v2.webp", "/images/sift-v2.webp", "/images/sift-v2.webp"],
        },
        process: {
            title: "Quiet Luxury",
            copy: "The design language pursues a 'Digital Tactility' aesthetic—avoiding tech-cold blues and aggressive gamification in favor of warm earth tones (espresso, oat, clay). We paired classical serif typefaces (Playfair Display) with a modern humanist sans-serif (Satoshi) to position the app as a digital literary journal. Generous whitespace, organic radii, and subtle noise textures create a physical, calming experience.",
            images: [],
        },
        highlights: [
            {
                id: "tactility",
                title: "Digital Tactility",
                description: "SIFT rejects harsh gradients and flashy UI. Instead, we focused on 'perceptual consistency' by defining all palettes in the OKLCH color space with 3 tiers of warm shadows. Every pressable area engages physical haptic feedback, grounding the experience.",
                challenge: "How do you make an AI-driven app feel like a grounded, physical sanctuary rather than a typical productivity tool?",
                recipe: "OKLCH Color Space + Subtle Haptics + Custom Animation Easing",
                images: ["/images/sift-v2.webp"],
            },
            {
                id: "curation",
                title: "Optimistic Curation",
                description: "I designed SIFT to feel like a digital extension of your memory. The UI reacts instantly even when the AI analysis is still pending.",
                challenge: "How do you maintain perceived speed when the backend requires 3-5 seconds for LLM processing?",
                recipe: "React Query + Optimistic Updates + Supabase Realtime",
                images: ["/images/sift-v2.webp"],
            },
        ],
        engineering: {
            title: "Engineering",
            copy: "The backend utilizes a multi-stage scavenging pipeline using Apify for headless scraping and GPT-4o for AI extraction. On the frontend, a bespoke design system named 'Gentle SIFT' relies on Reanimated 4.1 and Moti for declarative, ease-in-out animations—strictly avoiding spring physics to maintain a calm brand personality. The UI consumes an OKLCH color scale dynamically mapped to hex values.",
            signals: ["Vector Search", "OKLCH Theme Context API", "Declarative Animation", "Headless Scraping"],
            images: [],
        },
        statistics: [
            { label: "Color Space", value: "OKLCH" },
            { label: "Radii Scale", value: "14-48dp" },
            { label: "Components Built", value: "40+" },
        ],
        launchVideos: [],
        contributors: [{ name: "Ryan Jun", role: "Founder & Engineer" }],
        schematic: {
            stack: ["React Native", "NativeWind", "Supabase", "GPT-4o", "Apify"],
            grid: "16-48dp Padding · Organic",
            typography: "Playfair Display / Satoshi",
            colors: ["#443732", "#FDFCF8", "#CF957B"],
        },
        paradox: "How do you make an AI-driven app feel like a physical sanctuary instead of another cold productivity tool?",
        stakes: "The average person saves 50+ links per week and never revisits them. Sift turns passive hoarding into active curation.",
        gutPunch: "Your digital memory deserves the same care as your physical bookshelf.",
        processSteps: [
            { title: "Mapping the Chaos", copy: "We started by auditing our own saved links—hundreds of URLs scattered across Notes, bookmarks, and message threads. The pattern was clear: the save action is frictionless, but the retrieval is broken.", image: "/images/sift-v2.webp" },
            { title: "Quiet Luxury UI", copy: "We rejected tech-cold blues and aggressive gamification. Instead, warm earth tones paired with classical serif typefaces create a digital literary journal.", image: "/images/sift-v2.webp" },
        ],
        cardFormat: "landscape",
    },
    pane: {
        id: "pane",
        client: "HKJ",
        role: "Design & Engineering",
        tags: ["Ambient", "Dashboard", "AI"],
        editorial: {
            heading: "A quiet dashboard.",
            subhead: "Ambient telemetry. In development.",
            copy: "Pane is a dashboard that earns attention by staying out of the way. A study in ambient systems — telemetry that lives at the edge of attention until it's needed, then recedes again.",
        },
        paradox: "What if a dashboard could disappear?",
        stakes: "Most dashboards shout. Pane argues the opposite — the best ambient systems earn their place by staying quiet.",
        cardFormat: "landscape",
    },
    "clouds-at-sea": {
        id: "clouds-at-sea",
        client: "HKJ",
        role: "Design & Engineering",
        tags: ["WebGL", "Generative", "Experiment"],
        editorial: {
            heading: "A generative horizon.",
            subhead: "A shader study.",
            copy: "A short generative piece that sits between water and sky. Volume noise for clouds, atmospheric scattering for the sky, one light. Built in a weekend. Meant to loop, unobserved.",
        },
        paradox: "What does software look like when it has no purpose?",
        stakes: "Every shipped app solves a problem. This one doesn't.",
        cardFormat: "landscape",
    },
};
