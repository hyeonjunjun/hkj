import { create } from "zustand";

export type ExperienceMode = "cinematic" | "recruiter";
export type ColorPhase = "day" | "dusk" | "night";
export type CursorMode = "default" | "caliper";

interface StudioState {
    /** True once critical resources are loaded */
    isLoaded: boolean;
    setLoaded: (v: boolean) => void;

    /** Currently visible section for nav tracking */
    activeSection: string;
    setActiveSection: (s: string) => void;

    /** Project slug being transitioned to (for page transition) */
    transitionProject: string | null;
    setTransitionProject: (id: string | null) => void;

    /** Dual-rail: cinematic (immersive) or recruiter (minimal document) */
    experienceMode: ExperienceMode;
    setExperienceMode: (mode: ExperienceMode) => void;

    /** Current scroll-driven color phase for Day-to-Night system */
    colorPhase: ColorPhase;
    setColorPhase: (phase: ColorPhase) => void;

    /** Cursor contextual mode */
    cursorMode: CursorMode;
    setCursorMode: (mode: CursorMode) => void;
}

// Read persisted experience mode from localStorage (client-side only)
function getPersistedMode(): ExperienceMode {
    if (typeof window === "undefined") return "cinematic";
    return (localStorage.getItem("hkj-experience-mode") as ExperienceMode) || "cinematic";
}

export const useStudioStore = create<StudioState>((set) => ({
    isLoaded: false,
    setLoaded: (v) => set({ isLoaded: v }),

    activeSection: "hero",
    setActiveSection: (s) => set({ activeSection: s }),

    transitionProject: null,
    setTransitionProject: (id) => set({ transitionProject: id }),

    experienceMode: getPersistedMode(),
    setExperienceMode: (mode) => {
        if (typeof window !== "undefined") {
            localStorage.setItem("hkj-experience-mode", mode);
        }
        set({ experienceMode: mode });
    },

    colorPhase: "day",
    setColorPhase: (phase) => set({ colorPhase: phase }),

    cursorMode: "default",
    setCursorMode: (mode) => set({ cursorMode: mode }),
}));
