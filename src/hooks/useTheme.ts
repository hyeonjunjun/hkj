"use client";

import { useCallback, useSyncExternalStore } from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "hkj.theme";
const DOM_KEY = "theme"; // -> data-theme

function timeOfDayDefault(): Theme {
  const h = new Date().getHours();
  return h >= 7 && h < 19 ? "light" : "dark";
}

function getSnapshot(): Theme {
  if (typeof document === "undefined") return "light";
  const v = document.documentElement.dataset[DOM_KEY];
  return v === "dark" ? "dark" : "light";
}

function getServerSnapshot(): Theme {
  return "light";
}

const listeners = new Set<() => void>();

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) cb();
  };
  if (typeof window !== "undefined") {
    window.addEventListener("storage", onStorage);
  }
  return () => {
    listeners.delete(cb);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", onStorage);
    }
  };
}

/**
 * Reads + writes the resolved theme. Source-of-truth model:
 * `document.documentElement.dataset.theme` is canonical at runtime.
 * `localStorage('hkj.theme')` is write-only persistence — read once
 * by ThemeInit before paint, then ignored at runtime. The hook
 * subscribes to the DOM attribute via useSyncExternalStore; setTheme
 * writes both the DOM attribute and localStorage atomically.
 */
export function useTheme(): {
  theme: Theme;
  setTheme: (next: Theme) => void;
  toggle: () => void;
} {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setTheme = useCallback((next: Theme) => {
    if (typeof document === "undefined") return;
    document.documentElement.dataset[DOM_KEY] = next;
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore localStorage failures (private mode, quota)
    }
    listeners.forEach((cb) => cb());
  }, []);

  const toggle = useCallback(() => {
    setTheme(getSnapshot() === "light" ? "dark" : "light");
  }, [setTheme]);

  return { theme, setTheme, toggle };
}

// Exported for the inline init script and tests
export { timeOfDayDefault, STORAGE_KEY };
