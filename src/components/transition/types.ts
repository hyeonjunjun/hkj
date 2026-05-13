// src/components/transition/types.ts

export type TransitionPhase = "idle" | "covering" | "exiting";

export type TransitionContextValue = {
  phase: TransitionPhase;
  isTransitioning: boolean;
  pendingPath: string | null;
  startTransition: (path: string) => void;
  onCoverComplete: () => void;
  onExitComplete: () => void;
  registerDisposer: (key: string, fn: () => void) => void;
  unregisterDisposer: (key: string) => void;
};
