"use client";

import { useEffect, useRef, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap } from "@/lib/gsap";
import { useStudioStore } from "@/lib/store";

/**
 * PageTransition — Content-based cinematic transition
 *
 * Instead of an overlay, animates the actual page content:
 * Exit:  Current page scales down, blurs, fades out
 * Enter: New page scales from slightly large, unblurs, fades in
 *
 * Targets #page-content wrapper in layout.tsx
 */

export default function PageTransition() {
  const pathname = usePathname();
  const router = useRouter();
  const prevPathname = useRef(pathname);
  const isFirstRender = useRef(true);

  const transitionHref = useStudioStore((s) => s.transitionHref);
  const setTransitionHref = useStudioStore((s) => s.setTransitionHref);

  // Phase 1: EXIT — scale down, blur, fade the current page
  useEffect(() => {
    if (!transitionHref) return;

    const content = document.getElementById("page-content");
    if (!content) return;

    const href = transitionHref;

    gsap.to(content, {
      scale: 0.97,
      opacity: 0,
      filter: "blur(8px)",
      duration: 0.5,
      ease: "power2.in",
      onComplete: () => {
        setTransitionHref(null);
        router.push(href);
      },
    });
  }, [transitionHref, router, setTransitionHref]);

  // Phase 2: ENTER — scale up from slightly large, unblur, fade in
  const playEnter = useCallback(() => {
    const content = document.getElementById("page-content");
    if (!content) return;

    gsap.fromTo(
      content,
      { scale: 1.02, opacity: 0, filter: "blur(6px)" },
      {
        scale: 1,
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.6,
        ease: "power3.out",
        delay: 0.05,
      }
    );
  }, []);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      prevPathname.current = pathname;
      return;
    }

    if (pathname !== prevPathname.current) {
      prevPathname.current = pathname;
      playEnter();
    }
  }, [pathname, playEnter]);

  // No DOM element needed — we target #page-content directly
  return null;
}
