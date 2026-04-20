"use client";

import { useCallback, useEffect, useState } from "react";

export type Mode = "sea" | "land" | "sky" | "space";

export const MODES: Mode[] = ["sea", "land", "sky", "space"];

export function useMode(initial: Mode = "sea"): {
  mode: Mode;
  setMode: (m: Mode) => void;
  next: () => void;
  prev: () => void;
} {
  const [mode, setMode] = useState<Mode>(initial);

  const next = useCallback(() => {
    setMode((m) => {
      const i = MODES.indexOf(m);
      return MODES[(i + 1) % MODES.length];
    });
  }, []);

  const prev = useCallback(() => {
    setMode((m) => {
      const i = MODES.indexOf(m);
      return MODES[(i - 1 + MODES.length) % MODES.length];
    });
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "1") { e.preventDefault(); setMode("sea"); }
      else if (e.key === "2") { e.preventDefault(); setMode("land"); }
      else if (e.key === "3") { e.preventDefault(); setMode("sky"); }
      else if (e.key === "4") { e.preventDefault(); setMode("space"); }
      else if (e.key === "ArrowRight") { e.preventDefault(); next(); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  return { mode, setMode, next, prev };
}
