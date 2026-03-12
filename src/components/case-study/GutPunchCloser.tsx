"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * GutPunchCloser
 * ──────────────
 * Large serif impact statement to close a case study chapter.
 */
export default function GutPunchCloser({ text }: { text?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced || !ref.current) return;
      gsap.from(ref.current, {
        opacity: 0,
        y: 60,
        scale: 0.96,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 80%",
          once: true,
        },
      });
    },
    { scope: ref },
  );

  if (!text) return null;

  return (
    <div
      ref={ref}
      className="py-32 px-6 sm:px-12 flex items-center justify-center"
      style={{ borderTop: "1px solid var(--color-border)" }}
    >
      <h2
        className="editorial-display text-center max-w-4xl"
        style={{
          fontSize: "clamp(2rem, 5vw, 4rem)",
          color: "var(--color-text)",
        }}
      >
        &ldquo;{text}&rdquo;
      </h2>
    </div>
  );
}
