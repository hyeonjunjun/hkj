import { create } from "zustand";

interface PanState { x: number; y: number; speed: number; }
interface TransitionOrigin { slug: string; x: number; y: number; }

interface StoreState {
  hoveredSlug: string | null;
  setHoveredSlug: (slug: string | null) => void;
  activeZoneSlug: string | null;
  setActiveZoneSlug: (slug: string | null) => void;
  pan: PanState;
  setPan: (pan: PanState) => void;
  transitionOrigin: TransitionOrigin | null;
  setTransitionOrigin: (origin: TransitionOrigin | null) => void;
}

export const useStore = create<StoreState>((set) => ({
  hoveredSlug: null,
  setHoveredSlug: (slug) => set({ hoveredSlug: slug }),
  activeZoneSlug: null,
  setActiveZoneSlug: (slug) => set({ activeZoneSlug: slug }),
  pan: { x: 0, y: 0, speed: 0 },
  setPan: (pan) => set({ pan }),
  transitionOrigin: null,
  setTransitionOrigin: (origin) => set({ transitionOrigin: origin }),
}));
