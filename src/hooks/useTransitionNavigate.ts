"use client";

import { useCallback } from "react";
import { usePathname } from "next/navigation";
import { useStudioStore } from "@/lib/store";

/**
 * Hook for programmatic navigation with page transition.
 */
export function useTransitionNavigate() {
  const pathname = usePathname();
  const startTransition = useStudioStore((s) => s.startTransition);
  const isTransitioning = useStudioStore((s) => s.isTransitioning);

  return useCallback(
    (href: string) => {
      if (
        isTransitioning ||
        href === pathname ||
        href.startsWith("#") ||
        href.startsWith("http")
      )
        return;

      startTransition(href);
    },
    [pathname, startTransition, isTransitioning]
  );
}
