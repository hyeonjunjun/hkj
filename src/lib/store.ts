import { create } from "zustand";
import type { TimePeriod } from "@/lib/time";

interface StudioState {
  /** True once critical resources are loaded */
  isLoaded: boolean;
  setLoaded: (v: boolean) => void;

  /** Whether the mobile menu is open */
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (v: boolean) => void;

  /** Page transition — pending href triggers exit animation */
  transitionHref: string | null;
  setTransitionHref: (v: string | null) => void;

  /** Current time period for dynamic theming */
  timePeriod: TimePeriod;
  setTimePeriod: (v: TimePeriod) => void;
}

export const useStudioStore = create<StudioState>((set) => ({
  isLoaded: false,
  setLoaded: (v) => set({ isLoaded: v }),

  mobileMenuOpen: false,
  setMobileMenuOpen: (v) => set({ mobileMenuOpen: v }),

  transitionHref: null,
  setTransitionHref: (v) => set({ transitionHref: v }),

  timePeriod: "day",
  setTimePeriod: (v) => set({ timePeriod: v }),
}));
