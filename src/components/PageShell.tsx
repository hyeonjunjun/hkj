"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { TransitionProvider } from "./TransitionContext";
import { useReducedMotion } from "@/hooks/useReducedMotion";

function getVisited(): string[] {
  try {
    const raw = sessionStorage.getItem("hkj-visited");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function markVisited(path: string) {
  try {
    const visited = getVisited();
    if (!visited.includes(path)) {
      visited.push(path);
      sessionStorage.setItem("hkj-visited", JSON.stringify(visited));
    }
  } catch {
    // sessionStorage unavailable
  }
}

export default function PageShell({ children }: { children: ReactNode }) {
  const shellRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = shellRef.current;
    if (!el) return;

    // Clear previous state
    el.classList.remove("page-exit", "page-enter", "page-enter-fast");

    if (reducedMotion) return;

    const visited = getVisited();
    const isRepeatVisit = visited.includes(pathname);

    // Apply the entrance class
    el.classList.add(isRepeatVisit ? "page-enter-fast" : "page-enter");
    markVisited(pathname);

    // Clean up after all animations complete (use a timeout matching the longest animation)
    const duration = isRepeatVisit ? 400 : 2600;
    const timer = setTimeout(() => {
      el.classList.remove("page-enter", "page-enter-fast");
    }, duration);

    return () => {
      clearTimeout(timer);
      el.classList.remove("page-enter", "page-enter-fast");
    };
  }, [pathname, reducedMotion]);

  return (
    <TransitionProvider>
      <div className="page-shell" ref={shellRef}>
        {children}
      </div>
    </TransitionProvider>
  );
}
