"use client";

import { useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";

/**
 * Hook for programmatic navigation.
 */
export function useTransitionNavigate() {
  const router = useRouter();
  const pathname = usePathname();

  return useCallback(
    (href: string) => {
      if (href === pathname || href.startsWith("#") || href.startsWith("http"))
        return;
      router.push(href);
    },
    [pathname, router]
  );
}
