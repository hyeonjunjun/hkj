"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export type CursorState = "default" | "media" | "link" | "idle";

interface CursorData {
  state: CursorState;
  velocity: number;
}

function resolveState(target: EventTarget | null): Exclude<CursorState, "idle"> {
  if (!(target instanceof HTMLElement)) return "default";

  // Check for media
  if (target.closest("[data-cursor='media']")) return "media";

  // Check for link / button
  if (
    target.closest("a") ||
    target.closest("button") ||
    target.closest("[role='button']") ||
    target.closest("[data-cursor='link']")
  )
    return "link";

  return "default";
}

export function useCursorState(): CursorData {
  const [state, setState] = useState<CursorState>("default");
  const [velocity, setVelocity] = useState(0);

  const lastPos = useRef({ x: 0, y: 0 });
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeState = useRef<Exclude<CursorState, "idle">>("default");

  const resetIdle = useCallback(() => {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => {
      setState("idle");
    }, 2000);
  }, []);

  useEffect(() => {
    const handlePointerOver = (e: PointerEvent) => {
      const resolved = resolveState(e.target);
      activeState.current = resolved;
      setState(resolved);
    };

    const handlePointerMove = (e: PointerEvent) => {
      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      setVelocity(dist);

      lastPos.current = { x: e.clientX, y: e.clientY };

      // Revert from idle to the active state
      setState(activeState.current);
      resetIdle();
    };

    window.addEventListener("pointerover", handlePointerOver);
    window.addEventListener("pointermove", handlePointerMove);
    resetIdle();

    return () => {
      window.removeEventListener("pointerover", handlePointerOver);
      window.removeEventListener("pointermove", handlePointerMove);
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, [resetIdle]);

  return { state, velocity };
}
