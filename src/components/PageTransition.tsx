"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useStudioStore } from "@/lib/store";

/**
 * Full-screen overlay that fades to --color-bg between page navigations.
 * Sequence: fade in → navigate → fade out.
 */
export default function PageTransition() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const isTransitioning = useStudioStore((s) => s.isTransitioning);
  const pendingRoute = useStudioStore((s) => s.pendingRoute);
  const endTransition = useStudioStore((s) => s.endTransition);
  const phaseRef = useRef<"idle" | "entering" | "navigated">("idle");

  // Phase 1: Fade overlay in, then navigate
  useEffect(() => {
    if (!isTransitioning || !pendingRoute || !overlayRef.current) return;

    phaseRef.current = "entering";
    overlayRef.current.style.opacity = "1";

    const timer = setTimeout(() => {
      phaseRef.current = "navigated";
      router.push(pendingRoute);
    }, 450);

    return () => clearTimeout(timer);
  }, [isTransitioning, pendingRoute, router]);

  // Phase 2: After pathname changes, fade overlay out
  useEffect(() => {
    if (phaseRef.current !== "navigated" || !overlayRef.current) return;

    phaseRef.current = "idle";

    // Brief delay to let new page render
    const timer = setTimeout(() => {
      if (overlayRef.current) overlayRef.current.style.opacity = "0";
      setTimeout(() => endTransition(), 450);
    }, 120);

    return () => clearTimeout(timer);
  }, [pathname, endTransition]);

  return (
    <div
      ref={overlayRef}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "var(--color-bg)",
        opacity: 0,
        pointerEvents: isTransitioning ? "all" : "none",
        zIndex: 9999,
        transition: "opacity 0.45s cubic-bezier(0.86, 0, 0.07, 1)",
      }}
    />
  );
}
