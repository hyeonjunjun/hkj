"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { usePageTransition, TransitionOverlay } from "@/components/PageTransition";
import { gsap } from "@/lib/gsap";
import { useStudioStore } from "@/lib/store";

// NAV_HEIGHT — matches the site's fixed nav bar
const NAV_HEIGHT = 48;
// Max width of case study content column
const MAX_COVER_WIDTH = 900;

export default function TransitionManager() {
  const router = useRouter();
  const pathname = usePathname();
  const { overlayRef, triggerExit, triggerEnter } = usePageTransition();
  const setTransitioning = useStudioStore((s) => s.setTransitioning);

  // Refs for FLIP artifacts that persist across route change
  const flipCloneRef = useRef<HTMLImageElement | null>(null);
  const flipWashRef = useRef<HTMLDivElement | null>(null);
  const isFlipActiveRef = useRef(false);

  // ── Cleanup FLIP artifacts ──────────────────────────────────────────
  const cleanupFlip = (onComplete?: () => void) => {
    const clone = flipCloneRef.current;
    const wash = flipWashRef.current;
    if (!clone && !wash) { onComplete?.(); return; }

    gsap.to([clone, wash].filter(Boolean), {
      opacity: 0,
      duration: 0.2,
      ease: "power1.out",
      onComplete: () => {
        clone?.parentNode?.removeChild(clone);
        wash?.parentNode?.removeChild(wash);
        flipCloneRef.current = null;
        flipWashRef.current = null;
        isFlipActiveRef.current = false;
        onComplete?.();
      },
    });
  };

  // ── Standard (overlay) transition ──────────────────────────────────
  const runStandardTransition = async (href: string) => {
    await triggerExit();
    router.push(href);
  };

  // ── FLIP transition ─────────────────────────────────────────────────
  const runFlipTransition = (
    href: string,
    sourceRect: DOMRect,
    coverImageSrc: string | null
  ) => {
    setTransitioning(true);

    // 1. Compute target rect — full content column, top below nav, 16:9
    const vw = window.innerWidth;
    const targetWidth = Math.min(vw, MAX_COVER_WIDTH);
    const targetX = (vw - targetWidth) / 2;
    const targetY = NAV_HEIGHT;
    const targetHeight = Math.round(targetWidth * (9 / 16));

    // 2. Create dim wash overlay (transparent bg, NOT opaque)
    const wash = document.createElement("div");
    wash.style.cssText = `
      position: fixed;
      inset: 0;
      z-index: 8900;
      background: var(--bg);
      opacity: 0;
      pointer-events: none;
    `;
    document.body.appendChild(wash);
    flipWashRef.current = wash;

    // 3. Create clone image positioned at source
    const clone = document.createElement("img");
    if (coverImageSrc) {
      clone.src = coverImageSrc;
    }
    clone.style.cssText = `
      position: fixed;
      z-index: 8950;
      pointer-events: none;
      object-fit: cover;
      border-radius: 6px;
      left: ${sourceRect.left}px;
      top: ${sourceRect.top}px;
      width: ${sourceRect.width}px;
      height: ${sourceRect.height}px;
      opacity: 1;
    `;
    document.body.appendChild(clone);
    flipCloneRef.current = clone;
    isFlipActiveRef.current = true;

    // 4. Animate: fade in wash to 0.3, morph clone to target rect
    const tl = gsap.timeline({
      onComplete: () => {
        router.push(href);
      },
    });

    tl.to(wash, { opacity: 0.3, duration: 0.25, ease: "power1.out" }, 0);

    tl.to(
      clone,
      {
        left: targetX,
        top: targetY,
        width: targetWidth,
        height: targetHeight,
        borderRadius: "0px",
        duration: 0.6,
        ease: "power3.inOut",
      },
      0
    );
  };

  // ── Listen for page-transition events ──────────────────────────────
  useEffect(() => {
    const handleTransition = (e: Event) => {
      const { href, flipId, sourceRect, coverImageSrc } = (e as CustomEvent).detail as {
        href: string;
        flipId: string | null;
        sourceRect: DOMRect | null;
        coverImageSrc: string | null;
      };

      if (flipId && sourceRect) {
        runFlipTransition(href, sourceRect, coverImageSrc);
      } else {
        runStandardTransition(href);
      }
    };

    window.addEventListener("page-transition", handleTransition);
    return () => window.removeEventListener("page-transition", handleTransition);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── On route change: finish FLIP or run standard enter ─────────────
  useEffect(() => {
    if (isFlipActiveRef.current) {
      // New page mounted — clean up FLIP artifacts, then unblock
      // Small delay lets the new page paint before we fade out the clone
      const timer = setTimeout(() => {
        cleanupFlip(() => {
          setTransitioning(false);
        });
      }, 80);
      return () => clearTimeout(timer);
    } else {
      triggerEnter();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return <TransitionOverlay overlayRef={overlayRef} />;
}
