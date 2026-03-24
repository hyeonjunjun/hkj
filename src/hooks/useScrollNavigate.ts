"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { PROJECTS } from "@/constants/projects";

const THRESHOLD = 1750; // px of accumulated wheel delta before navigating

interface ScrollNavigateOptions {
  currentSlug: string;
}

export function useScrollNavigate({ currentSlug }: ScrollNavigateOptions) {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [direction, setDirection] = useState<"next" | "prev" | null>(null);
  const accumulatedDelta = useRef(0);
  const isNavigating = useRef(false);

  const activeProjects = PROJECTS.filter((p) => p.status === "shipped");
  const currentIndex = activeProjects.findIndex((p) => p.id === currentSlug);

  const nextProject =
    activeProjects[(currentIndex + 1) % activeProjects.length];
  const prevProject =
    activeProjects[
      (currentIndex - 1 + activeProjects.length) % activeProjects.length
    ];

  const navigateTo = useCallback(
    (slug: string) => {
      if (isNavigating.current) return;
      isNavigating.current = true;
      router.replace(`/work/${slug}`, { scroll: false });
      // Reset after navigation
      setTimeout(() => {
        isNavigating.current = false;
        setProgress(0);
        setDirection(null);
        accumulatedDelta.current = 0;
      }, 600);
    },
    [router]
  );

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isNavigating.current) return;

      const scrollTop = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;
      const atTop = scrollTop <= 25;
      const atBottom = scrollTop >= scrollHeight - clientHeight - 25;

      if (!atTop && !atBottom) {
        // Reset if not at boundary
        accumulatedDelta.current = 0;
        setProgress(0);
        setDirection(null);
        return;
      }

      const delta = e.deltaY;

      // At bottom, scrolling down → next project
      if (atBottom && delta > 0) {
        accumulatedDelta.current += Math.abs(delta);
        setDirection("next");
      }
      // At top, scrolling up → previous project
      else if (atTop && delta < 0) {
        accumulatedDelta.current += Math.abs(delta);
        setDirection("prev");
      } else {
        // Wrong direction — reset
        accumulatedDelta.current = 0;
        setProgress(0);
        setDirection(null);
        return;
      }

      const pct = Math.min(
        (accumulatedDelta.current / THRESHOLD) * 100,
        100
      );
      setProgress(pct);

      if (pct >= 100) {
        if (direction === "next" && nextProject) {
          navigateTo(nextProject.id);
        } else if (direction === "prev" && prevProject) {
          navigateTo(prevProject.id);
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [direction, nextProject, prevProject, navigateTo]);

  return {
    progress,
    direction,
    nextProject,
    prevProject,
  };
}
