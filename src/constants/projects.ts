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

export interface Project {
    id: string;
    title: string;
    client: string;
    role: string;
    sector: string;
    year: string;
    tags: string[];
    image: string;
    mood: string;
    pitch: string;
    editorial: {
        headline: string;
        subhead: string;
        copy: string;
        images: string[];
    };
    process: {
        title: string;
        copy: string;
        images: string[];
    };
    highlights: ProjectHighlight[];
    engineering: {
        title: string;
        copy: string;
        signals: string[];
        images: string[];
    };
    statistics: ProjectStat[];
    launchVideos: LaunchVideo[];
    contributors: Array<{ name: string; role: string }>;
    schematic: {
        stack: string[];
        grid: string;
        typography: string;
        colors: string[];
    };
    /** New Case Study fields */
    paradox?: string;
    stakes?: string;
    gutPunch?: string;
    processSteps?: Array<{ title: string; copy: string; image?: string }>;
    has3dInspector?: boolean;
}

export const PROJECTS: Project[] = [
    {
        id: "sift",
        title: "Sift: Digital Sanctuary",
        client: "HKJ Studio",
        role: "Design & Engineering",
        sector: "Mobile · AI",
        year: "2025",
        tags: ["Digital Sanctuary", "UX of AI", "React Native"],
        image: "/images/sift-v2.jpg",
        mood: "#CF957B",
        pitch: "Curate your digital diet. A digital sanctuary that interprets chaotic social media links into a structured library.",
        editorial: {
            headline: "Save Anything, Understand Everything.",
            subhead: "The Knowledge Architect",
            copy: "Sift elevates your digital consumption by turning fleeting social media moments into a permanent, curated library. It combines advanced social media scraping, AI synthesis, and editorial presentation in a premium, warm aesthetic. Functioning as a 'personal librarian,' Sift strips away the noise to leave only what matters—guiding passive browsing into an active, structured knowledge base through 'The Gist', a single-sentence summary for every page.",
            images: ["/images/sift-v2.jpg", "/images/sift-v2.jpg", "/images/sift-v2.jpg"],
        },
        process: {
            title: "Quiet Luxury",
            copy: "The design language pursues a 'Digital Tactility' aesthetic—avoiding tech-cold blues and aggressive gamification in favor of warm earth tones (espresso, oat, clay). We paired classical serif typefaces (Playfair Display) with a modern humanist sans-serif (Satoshi) to position the app as a digital literary journal. Generous whitespace, organic radii, and subtle noise textures create a physical, calming experience.",
            images: ["/placeholder-rough-1.png"]
        },
        highlights: [
            {
                id: "tactility",
                title: "Digital Tactility",
                description: "SIFT rejects harsh gradients and flashy UI. Instead, we focused on 'perceptual consistency' by defining all palettes in the OKLCH color space with 3 tiers of warm shadows. Every pressable area engages physical haptic feedback, grounding the experience.",
                challenge: "How do you make an AI-driven app feel like a grounded, physical sanctuary rather than a typical productivity tool?",
                recipe: "OKLCH Color Space + Subtle Haptics + Custom Animation Easing",
                images: ["/images/sift-v2.jpg"],
            },
            {
                id: "curation",
                title: "Optimistic Curation",
                description: "I designed SIFT to feel like a digital extension of your memory. The UI reacts instantly even when the AI analysis is still pending.",
                challenge: "How do you maintain perceived speed when the backend requires 3-5 seconds for LLM processing?",
                recipe: "React Query + Optimistic Updates + Supabase Realtime",
                images: ["/images/sift-v2.jpg"],
            }
        ],
        engineering: {
            title: "Engineering",
            copy: "The backend utilizes a multi-stage scavenging pipeline using Apify for headless scraping and GPT-4o for AI extraction. On the frontend, a bespoke design system named 'Gentle SIFT' relies on Reanimated 4.1 and Moti for declarative, ease-in-out animations—strictly avoiding spring physics to maintain a calm brand personality. The UI consumes an OKLCH color scale dynamically mapped to hex values.",
            signals: ["Vector Search", "OKLCH Theme Context API", "Declarative Animation", "Headless Scraping"],
            images: ["/placeholder-eng-1.png"]
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
            { title: "Mapping the Chaos", copy: "We started by auditing our own saved links—hundreds of URLs scattered across Notes, bookmarks, and message threads. The pattern was clear: the save action is frictionless, but the retrieval is broken.", image: "/images/sift-v2.jpg" },
            { title: "Quiet Luxury UI", copy: "We rejected tech-cold blues and aggressive gamification. Instead, warm earth tones paired with classical serif typefaces create a digital literary journal.", image: "/images/sift-v2.jpg" },
        ],
    },
    {
        id: "verbaitim",
        title: "VerbAItim",
        client: "Linguistic Preservation Initiative",
        role: "Design Lead",
        sector: "AI / SaaS",
        year: "2026",
        tags: ["Design System", "Full Stack", "Linguistics"],
        image: "/images/verbaitim-hero.png",
        mood: "#4169E1",
        pitch: "High-precision linguistic SaaS bridging field documentation with pedagogical output.",
        editorial: {
            headline: "The future of language is verifiable data.",
            subhead: "Scientific Naturalism meets Awwwards-level Motion.",
            copy: "VerbAItim bridges the gap between field linguistics and diverse pedagogical output. By leveraging Allosaurus for universal phonetic capture and ByT5 for byte-level preservation, we create a 'Pipeline of Preservation' that ensures indigenous data sovereignty through rigorous Chain of Custody verification. The interface balances archival warmth with industrial precision, creating a digital workbench that feels both organic and surgical.",
            images: [
                "/images/verbaitim-hero.png",
                "/images/verbaitim-interface.png",
                "/images/verbaitim-hero.png",
                "/images/verbaitim-interface.png",
            ],
        },
        process: {
            title: "The Rough",
            copy: "Researching universal phonetic scripts and testing Allosaurus inference latency on mobile CPU. Sketches explored the 'Pipeline' metaphor—moving from raw audio to verified phonetic data.",
            images: ["/placeholder-rough-2.png"]
        },
        highlights: [
            {
                id: "phonetic",
                title: "Phonetic Precision",
                description: "Using Allosaurus for universal phonetic transcription across 2000+ languages.",
                challenge: "How do you visualize raw phonetic data for researchers while maintaining a consumer-grade UI?",
                recipe: "Web Audio API + SVG Visualizers + Allosaurus SDK",
                images: ["/images/verbaitim-interface.png"],
            }
        ],
        engineering: {
            title: "Engineering",
            copy: "Bridging phonetics with pedagogical data required a custom byte-level encoder using ByT5. We optimized the transformer inference to run on serverless workers while maintaining sub-second latency for real-time transcription.",
            signals: ["ByT5 Byte-Level", "Transformer Inference", "Audio Buffer Processing"],
            images: ["/placeholder-eng-2.png"]
        },
        statistics: [
            { label: "Impression", value: "50k+" },
            { label: "Features", value: "12" },
        ],
        launchVideos: [],
        contributors: [{ name: "Ryan Jun", role: "Design Lead" }],
        schematic: {
            stack: ["Next.js", "Framer Motion", "Lovable", "Allosaurus", "ByT5"],
            grid: "4px Industrial Precision",
            typography: "Instrument Serif / Inter",
            colors: ["#FAFAFA", "#0A0A0A", "#4169E1"],
        },
        paradox: "How do you build software that preserves languages for eternity while the technology itself becomes obsolete every 5 years?",
        stakes: "A language dies every 14 days. Each one carries irreplaceable knowledge about medicine, ecology, and human cognition.",
        gutPunch: "Every extinct language is a library that burned—one we could have saved.",
    },
    {
        id: "conductor",
        title: "CONDUCTOR",
        client: "Internal Tooling",
        role: "Developer",
        sector: "Design Systems",
        year: "2026",
        tags: ["Tooling", "Canvas API", "Low-Latency"],
        image: "/images/caliper-main.png",
        mood: "#FF4400",
        pitch: "Real-time visual guidance for structured thinking inside text fields.",
        editorial: {
            headline: "Precision measurement for thought.",
            subhead: "Automotive-Grade Input",
            copy: "Caliper lives inside existing text fields, providing real-time visual guidance. Designed with the rigor of high-end automotive displays, it enforces structured thinking through live color coding and floating dial controls. A rejection of playfulness in favor of pure instrument precision.",
            images: ["/images/caliper-main.png", "/images/caliper-main.png", "/images/caliper-main.png"],
        },
        process: {
            title: "The Rough",
            copy: "Inspired by vernier calipers and automotive dashboards. The initial sketches focused on the 'dial' metaphor—how to quantify semantic weight within a standard text input.",
            images: ["/placeholder-rough-3.png"]
        },
        highlights: [
            {
                id: "instrument",
                title: "Thought Instrument",
                description: "The UI acts as a vernier caliper for text, measuring semantic density in real-time.",
                challenge: "How do you provide complex visual feedback without distracting the user from the writing process?",
                recipe: "Canvas API + Low-Latency Input Buffers",
                images: ["/images/caliper-main.png"],
            }
        ],
        engineering: {
            title: "Engineering",
            copy: "The core measurement engine uses a custom buffer that intercepts keystrokes before they hit the DOM, calculating semantic density and returning coordinate shifts for the floating UI dials with <2ms jitter.",
            signals: ["Input Buffer Interception", "Jitter <2ms", "Canvas Rendering"],
            images: ["/placeholder-eng-3.png"]
        },
        statistics: [
            { label: "Latency", value: "2ms" },
            { label: "Components", value: "8" },
        ],
        launchVideos: [],
        contributors: [{ name: "Ryan Jun", role: "Developer" }],
        schematic: {
            stack: ["React", "Canvas API", "Local-First"],
            grid: "Dense Monospace",
            typography: "JetBrains Mono / Inter",
            colors: ["#E5E5E5", "#FF4400", "#111111"],
        },
        paradox: "Can a text input become a precision instrument without sacrificing the simplicity that makes it useful?",
        stakes: "Every prompt engineer writes in the dark. Conductor gives them a vernier caliper for thought.",
        gutPunch: "The best tools disappear into the work. Conductor is invisible until you need it.",
    },
    {
        id: "gyeol",
        title: "GYEOL",
        client: "HKJ Studio",
        role: "Design & Engineering",
        sector: "Material Science",
        year: "2026",
        tags: ["Coming Soon", "Material", "Texture"],
        image: "/images/sift-v2.jpg",
        mood: "#A0A0A0",
        pitch: "A study in digital materiality and perceived textures. Exploring the boundary between screen-rendered surfaces and physical material memory.",
        editorial: {
            headline: "Digital Grain",
            subhead: "Where Pixels Meet Patina",
            copy: "GYEOL explores the uncanny valley between digital rendering and physical material. By mapping real-world texture data onto WebGL surfaces, we create interfaces that feel tangibly present—like touching brushed aluminum or woven fabric through glass.",
            images: ["/images/sift-v2.jpg"],
        },
        process: { title: "Material Research", copy: "Sampling 200+ physical textures and converting displacement maps into GPU-accelerated shaders.", images: [] },
        highlights: [],
        engineering: { title: "Engineering", copy: "Custom PBR shader pipeline with real-time displacement mapping and subsurface scattering approximation.", signals: ["WebGL 2.0", "PBR Shading", "Displacement Maps"], images: [] },
        statistics: [],
        launchVideos: [],
        contributors: [],
        schematic: {
            stack: ["Three.js", "React Three Fiber", "Custom GLSL"],
            grid: "Modular",
            typography: "Inter",
            colors: ["#A0A0A0"],
        },
        paradox: "Can a screen ever truly feel like a physical surface?",
        stakes: "Every interface we touch is smooth glass. GYEOL asks: what if it wasn't?",
        gutPunch: "The future of UI isn't flatter. It's textured.",
        has3dInspector: true,
    },
];
