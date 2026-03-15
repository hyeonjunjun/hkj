import { create } from "zustand";

interface StudioState {
  /** True once critical resources are loaded */
  isLoaded: boolean;
  setLoaded: (v: boolean) => void;

  /** Active project id for viewfinder + case study navigation */
  activeProject: string | null;
  setActiveProject: (id: string | null) => void;

  /** Whether the fixed nav bar is visible */
  navVisible: boolean;
  setNavVisible: (v: boolean) => void;

  /** Whether the mobile menu is open */
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (v: boolean) => void;
}

export const useStudioStore = create<StudioState>((set) => ({
  isLoaded: false,
  setLoaded: (v) => set({ isLoaded: v }),

  activeProject: null,
  setActiveProject: (id) => set({ activeProject: id }),

  navVisible: false,
  setNavVisible: (v) => set({ navVisible: v }),

  mobileMenuOpen: false,
  setMobileMenuOpen: (v) => set({ mobileMenuOpen: v }),
}));
