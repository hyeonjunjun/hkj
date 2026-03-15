"use client";

import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";
import { useStudioStore } from "@/lib/store";

/**
 * StudioPreloader — Studio monogram + accent line
 *
 * Centered monogram on --color-bg. Thin 1px line beneath (--color-accent)
 * scales 0 → 60px. Grain visible from start. On complete: fades out.
 * Only shows first visit per session (sessionStorage).
 * Duration: 1-2 seconds max. No percentage counter.
 */

const SESSION_KEY = "hkj-preloader-shown";

export default function StudioPreloader() {
  const setLoaded = useStudioStore((s) => s.setLoaded);
  const isLoaded = useStudioStore((s) => s.isLoaded);
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Skip if already shown this session
    if (typeof window !== "undefined" && sessionStorage.getItem(SESSION_KEY)) {
      setLoaded(true);
      return;
    }

    const el = containerRef.current;
    const line = lineRef.current;
    if (!el || !line) return;

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(el, {
          opacity: 0,
          duration: 0.4,
          ease: "power2.in",
          onComplete: () => {
            sessionStorage.setItem(SESSION_KEY, "1");
            setLoaded(true);
          },
        });
      },
    });

    // Wait for fonts
    const fontsPromise = document.fonts.ready;
    const timeoutPromise = new Promise((r) => setTimeout(r, 3000));

    Promise.race([fontsPromise, timeoutPromise]).then(() => {
      // Line scales from 0 → 60px
      tl.fromTo(
        line,
        { scaleX: 0 },
        { scaleX: 1, duration: 1.2, ease: "power3.inOut" }
      );

      // Hold briefly
      tl.to({}, { duration: 0.3 });
    });
  }, [setLoaded]);

  if (isLoaded) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[1000] flex items-center justify-center"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <div className="flex flex-col items-center gap-5">
        {/* Studio monogram */}
        <span
          className="font-display"
          style={{
            fontSize: "clamp(13px, 1.2vw, 16px)",
            color: "var(--color-text-dim)",
            letterSpacing: "0.08em",
          }}
        >
          HKJ
        </span>

        {/* Accent line */}
        <div
          ref={lineRef}
          style={{
            width: 60,
            height: 1,
            backgroundColor: "var(--color-accent)",
            transformOrigin: "center",
            transform: "scaleX(0)",
          }}
        />
      </div>
    </div>
  );
}
