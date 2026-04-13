import { create } from "zustand";

interface StoreState {
  hoveredSlug: string | null;
  setHoveredSlug: (slug: string | null) => void;
}

export const useStore = create<StoreState>((set) => ({
  hoveredSlug: null,
  setHoveredSlug: (slug) => set({ hoveredSlug: slug }),
}));
