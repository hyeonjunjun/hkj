"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useTransitionStore } from "@/store/useTransitionStore";

/**
 * Returns a navigate function that triggers the transition overlay
 * before pushing to the new route.
 */
export function usePageTransition() {
  const router = useRouter();
  const start = useTransitionStore((s) => s.start);

  const navigate = useCallback(
    (href: string, e?: React.MouseEvent) => {
      const origin = e
        ? { x: e.clientX, y: e.clientY }
        : { x: window.innerWidth / 2, y: window.innerHeight / 2 };

      start(href, origin);

      // Delay navigation to let the overlay animate in
      setTimeout(() => {
        router.push(href);
      }, 500);
    },
    [router, start]
  );

  return navigate;
}
