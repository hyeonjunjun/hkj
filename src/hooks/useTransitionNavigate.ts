"use client";

import { useCallback } from "react";
import { usePathname } from "next/navigation";
import { useStudioStore } from "@/lib/store";

/**
 * Hook for programmatic navigation with page transitions.
 * Use this instead of router.push() when you want the cinematic transition.
 */
export function useTransitionNavigate() {
  const pathname = usePathname();
  const setTransitionHref = useStudioStore((s) => s.setTransitionHref);

  return useCallback(
    (href: string) => {
      if (href === pathname || href.startsWith("#") || href.startsWith("http")) return;
      setTransitionHref(href);
    },
    [pathname, setTransitionHref]
  );
}
