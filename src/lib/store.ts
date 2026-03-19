import { create } from "zustand";
import type { TimePeriod } from "@/lib/time";

interface StudioState {
  /** Whether the mobile menu is open */
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (v: boolean) => void;

  /** Current time period for dynamic theming */
  timePeriod: TimePeriod;
  setTimePeriod: (v: TimePeriod) => void;

  /** Manual time override (click-to-cycle pixel art) — null = use clock */
  timeOverride: TimePeriod | null;
  setTimeOverride: (v: TimePeriod | null) => void;

  /** Page transition state */
  isTransitioning: boolean;
  pendingRoute: string | null;
  startTransition: (route: string) => void;
  endTransition: () => void;
}

export const useStudioStore = create<StudioState>((set) => ({
  mobileMenuOpen: false,
  setMobileMenuOpen: (v) => set({ mobileMenuOpen: v }),

  timePeriod: "day",
  setTimePeriod: (v) => set({ timePeriod: v }),

  timeOverride: null,
  setTimeOverride: (v) => set({ timeOverride: v }),

  isTransitioning: false,
  pendingRoute: null,
  startTransition: (route) =>
    set({ isTransitioning: true, pendingRoute: route }),
  endTransition: () =>
    set({ isTransitioning: false, pendingRoute: null }),
}));
