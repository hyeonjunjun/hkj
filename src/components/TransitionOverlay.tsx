"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "@/lib/gsap";
import { useTransitionStore } from "@/store/useTransitionStore";

/**
 * TransitionOverlay — a circle-expand wipe from click origin.
 * Mounted once in layout. Listens to transition store.
 */
export default function TransitionOverlay() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const isTransitioning = useTransitionStore((s) => s.isTransitioning);
  const origin = useTransitionStore((s) => s.origin);
  const finish = useTransitionStore((s) => s.finish);
  const pathname = usePathname();

  // When route changes, reveal (animate overlay out)
  useEffect(() => {
    if (!overlayRef.current) return;

    if (isTransitioning) {
      // Route has changed — now animate the overlay away
      gsap.to(overlayRef.current, {
        clipPath: "circle(0% at 50% 50%)",
        duration: 0.6,
        ease: "power3.inOut",
        delay: 0.1,
        onComplete: () => finish(),
      });
    }
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  // When transition starts, animate overlay in from click origin
  useEffect(() => {
    if (!overlayRef.current || !isTransitioning || !origin) return;

    const ox = ((origin.x / window.innerWidth) * 100).toFixed(1);
    const oy = ((origin.y / window.innerHeight) * 100).toFixed(1);

    // Set initial state: tiny circle at click origin
    gsap.set(overlayRef.current, {
      clipPath: `circle(0% at ${ox}% ${oy}%)`,
      display: "block",
    });

    // Expand to cover the screen
    gsap.to(overlayRef.current, {
      clipPath: `circle(150% at ${ox}% ${oy}%)`,
      duration: 0.5,
      ease: "power3.inOut",
    });
  }, [isTransitioning, origin]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[55] pointer-events-none"
      style={{
        backgroundColor: "var(--color-bg)",
        clipPath: "circle(0% at 50% 50%)",
        display: "none",
      }}
    />
  );
}
