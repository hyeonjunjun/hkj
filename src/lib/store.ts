import { create } from "zustand";
import type { TimePeriod } from "@/lib/time";

interface StudioState {
  /** Whether the mobile menu is open */
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (v: boolean) => void;

  /** Current time period for dynamic theming */
  timePeriod: TimePeriod;
  setTimePeriod: (v: TimePeriod) => void;
}

export const useStudioStore = create<StudioState>((set) => ({
  mobileMenuOpen: false,
  setMobileMenuOpen: (v) => set({ mobileMenuOpen: v }),

  timePeriod: "day",
  setTimePeriod: (v) => set({ timePeriod: v }),
}));
