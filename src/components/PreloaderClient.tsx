"use client";

import { useEffect } from "react";
import { usePreloaderState } from "@/hooks/usePreloaderState";

/**
 * PreloaderClient — listens for click anywhere on the document and
 * for keypress (Enter/Space/Escape). On any of those, runs the exit
 * animation by adding a class to the preloader root, then dismisses
 * via the hook (which writes localStorage and updates the DOM
 * attribute, hiding the preloader via CSS).
 *
 * Reduced motion: skip the animation; immediate dismiss.
 */
export default function PreloaderClient() {
  const { state, dismiss } = usePreloaderState();

  useEffect(() => {
    if (state !== "active") return;

    function handleDismiss() {
      const root = document.querySelector(".preloader") as HTMLElement | null;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduced || !root) {
        dismiss();
        return;
      }

      // Add exiting class to trigger CSS-driven staggered fade
      root.classList.add("preloader--exiting");
      // After animation completes, dismiss (CSS hides the preloader)
      window.setTimeout(() => {
        dismiss();
      }, 600);
    }

    function onClick() {
      handleDismiss();
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Enter" || e.key === " " || e.key === "Escape") {
        e.preventDefault();
        handleDismiss();
      }
    }

    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [state, dismiss]);

  return null;
}
