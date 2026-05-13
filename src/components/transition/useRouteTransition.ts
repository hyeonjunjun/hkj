// src/components/transition/useRouteTransition.ts
"use client";

import { createContext, useContext } from "react";
import type { TransitionContextValue } from "./types";

export const TransitionContext = createContext<TransitionContextValue | null>(null);

export function useRouteTransition(): TransitionContextValue {
  const ctx = useContext(TransitionContext);
  if (!ctx) {
    throw new Error(
      "useRouteTransition must be used within TransitionProvider",
    );
  }
  return ctx;
}
