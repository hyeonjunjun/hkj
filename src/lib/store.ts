import { create } from "zustand";

export type OverlayType = "about" | "contact" | null;
export type ActiveView = "index" | "selects" | "info";

interface StudioState {
  /** True once critical resources are loaded */
  isLoaded: boolean;
  setLoaded: (v: boolean) => void;

  /** Project slug being transitioned to (for page transition) */
  transitionProject: string | null;
  setTransitionProject: (id: string | null) => void;

  /** Active full-screen overlay (contact only now — about moved to InfoView) */
  activeOverlay: OverlayType;
  setActiveOverlay: (overlay: OverlayType) => void;

  /** Current homepage view */
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;

  /** Active project id for Now Playing panel + player bar */
  activeProject: string | null;
  setActiveProject: (id: string | null) => void;

  /** Whether the Now Playing panel is open */
  isPanelOpen: boolean;
  setIsPanelOpen: (open: boolean) => void;

  /** Global video play/pause state */
  isPlaying: boolean;
  togglePlayback: () => void;

  /** Whether the player bar has been revealed */
  playerVisible: boolean;
  setPlayerVisible: (v: boolean) => void;
}

export const useStudioStore = create<StudioState>((set) => ({
  isLoaded: false,
  setLoaded: (v) => set({ isLoaded: v }),

  transitionProject: null,
  setTransitionProject: (id) => set({ transitionProject: id }),

  activeOverlay: null,
  setActiveOverlay: (overlay) => set({ activeOverlay: overlay }),

  activeView: "index",
  setActiveView: (view) => set({ activeView: view }),

  activeProject: null,
  setActiveProject: (id) => set({ activeProject: id }),

  isPanelOpen: false,
  setIsPanelOpen: (open) => set({ isPanelOpen: open }),

  isPlaying: true,
  togglePlayback: () => set((s) => ({ isPlaying: !s.isPlaying })),

  playerVisible: false,
  setPlayerVisible: (v) => set({ playerVisible: v }),
}));
