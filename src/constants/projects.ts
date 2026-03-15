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
    aspect?: string; // e.g., "16/9", "9/16", "1/1", "4/3"
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
    /** B-roll video clips for case study showcase */
    videos?: VideoClip[];
    /** Optional short video for project card preview */
    cardVideo?: string;
}

export const PROJECTS: Project[] = [
    {
        id: "sift",
        title: "Sift: Digital Sanctuary",
        client: "HKJ",
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
        title: "GYEOL: 결",
        client: "HKJ",
        role: "Design & Engineering",
        sector: "Material Science",
        year: "2026",
        tags: ["Material", "Texture", "WebGL"],
        image: "/images/gyeol-hero.jpg",
        mood: "#A0A0A0",
        pitch: "A study in digital materiality and perceived textures. Exploring the boundary between screen-rendered surfaces and physical material memory.",
        editorial: {
            headline: "Digital Grain.",
            subhead: "Where Pixels Meet Patina",
            copy: "결 (gyeol) is the Korean word for grain — the invisible pattern that gives wood its character, stone its identity, fabric its hand-feel. GYEOL explores the uncanny valley between digital rendering and physical material. By mapping real-world texture data onto WebGL surfaces, we create interfaces that feel tangibly present — like touching brushed aluminum or woven fabric through glass. The project began as a personal obsession: why does every screen feel the same?",
            images: ["/images/gyeol-hero.jpg"],
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
        cardVideo: "/assets/gyeol-broll3.mp4",
        videos: [
            { src: "/videos/gyeol/material-study-01.mp4", poster: "/images/gyeol-hero.jpg", caption: "oak grain displacement", aspect: "16/9" },
            { src: "/videos/gyeol/material-study-02.mp4", poster: "/images/gyeol-hero.jpg", caption: "marble subsurface scattering", aspect: "1/1" },
            { src: "/videos/gyeol/material-study-03.mp4", poster: "/images/gyeol-hero.jpg", caption: "brushed aluminum anisotropy", aspect: "1/1" },
            { src: "/videos/gyeol/material-study-04.mp4", poster: "/images/gyeol-hero.jpg", caption: "woven linen displacement", aspect: "16/9" },
        ],
    },
];
