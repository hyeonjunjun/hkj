"use client";

import { useCallback, useSyncExternalStore } from "react";

export type PreloaderState = "active" | "dismissed";

const STORAGE_KEY = "hkj.preloader.dismissed";
const DOM_KEY = "preloaderState";

// Set to "session" to use sessionStorage instead. Default "local".
const STORAGE: "local" | "session" = "local";

function storage(): Storage | null {
  if (typeof window === "undefined") return null;
  return STORAGE === "local" ? window.localStorage : window.sessionStorage;
}

function getSnapshot(): PreloaderState {
  if (typeof document === "undefined") return "active";
  const v = document.documentElement.dataset[DOM_KEY];
  return v === "dismissed" ? "dismissed" : "active";
}

function getServerSnapshot(): PreloaderState {
  return "active";
}

const listeners = new Set<() => void>();

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function usePreloaderState(): {
  state: PreloaderState;
  dismiss: () => void;
} {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const dismiss = useCallback(() => {
    if (typeof document === "undefined") return;
    document.documentElement.dataset[DOM_KEY] = "dismissed";
    try {
      storage()?.setItem(STORAGE_KEY, "1");
    } catch {
      // ignore
    }
    listeners.forEach((cb) => cb());
  }, []);

  return { state, dismiss };
}

export { STORAGE_KEY };
