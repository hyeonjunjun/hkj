import { create } from "zustand";

interface TransitionState {
  isTransitioning: boolean;
  origin: { x: number; y: number } | null;
  targetHref: string | null;
  start: (href: string, origin: { x: number; y: number }) => void;
  finish: () => void;
}

export const useTransitionStore = create<TransitionState>((set) => ({
  isTransitioning: false,
  origin: null,
  targetHref: null,
  start: (href, origin) =>
    set({ isTransitioning: true, targetHref: href, origin }),
  finish: () =>
    set({ isTransitioning: false, targetHref: null, origin: null }),
}));
