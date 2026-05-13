// src/components/transition/TransitionProvider.tsx
"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { TransitionContext } from "./useRouteTransition";
import type { TransitionPhase, TransitionContextValue } from "./types";

export function TransitionProvider({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<TransitionPhase>("idle");
  const [pendingPath, setPendingPath] = useState<string | null>(null);
  const phaseRef = useRef<TransitionPhase>("idle");
  const pendingPathRef = useRef<string | null>(null);
  const disposers = useRef<Map<string, () => void>>(new Map());
  const router = useRouter();

  // Mirror state into refs so callbacks read consistent values without
  // closure staleness. Effects run after commit so the ref lags by one
  // render — acceptable here because the only readers are user-driven
  // callbacks (clicks, GSAP onComplete) that fire after commit.
  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);
  useEffect(() => {
    pendingPathRef.current = pendingPath;
  }, [pendingPath]);

  const startTransition = useCallback((path: string) => {
    if (phaseRef.current !== "idle") return;
    phaseRef.current = "covering";
    pendingPathRef.current = path;
    setPendingPath(path);
    setPhase("covering");
  }, []);

  const onCoverComplete = useCallback(() => {
    // Run disposers first so any in-flight rAF / observer / timeline is cleaned up
    disposers.current.forEach((fn, key) => {
      try {
        fn();
      } catch (e) {
        console.error(`[TransitionProvider] disposer "${key}" threw:`, e);
      }
    });
    disposers.current.clear();

    const path = pendingPathRef.current;
    if (path) router.push(path);

    phaseRef.current = "exiting";
    setPhase("exiting");
  }, [router]);

  const onExitComplete = useCallback(() => {
    phaseRef.current = "idle";
    pendingPathRef.current = null;
    setPhase("idle");
    setPendingPath(null);
  }, []);

  const registerDisposer = useCallback((key: string, fn: () => void) => {
    disposers.current.set(key, fn);
  }, []);

  const unregisterDisposer = useCallback((key: string) => {
    disposers.current.delete(key);
  }, []);

  const value = useMemo<TransitionContextValue>(
    () => ({
      phase,
      isTransitioning: phase !== "idle",
      pendingPath,
      startTransition,
      onCoverComplete,
      onExitComplete,
      registerDisposer,
      unregisterDisposer,
    }),
    [
      phase,
      pendingPath,
      startTransition,
      onCoverComplete,
      onExitComplete,
      registerDisposer,
      unregisterDisposer,
    ],
  );

  return (
    <TransitionContext.Provider value={value}>
      {children}
    </TransitionContext.Provider>
  );
}
