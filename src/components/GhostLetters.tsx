"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

export default function GhostLetters() {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (reducedMotion) {
      // Show at fixed 0.10 opacity, no parallax
      gsap.set(el, { opacity: 0.1, y: 0 });
      return;
    }

    const parent = el.parentElement;
    if (!parent) return;

    // Parallax + fade on scroll (from whatever opacity the entrance choreography set)
    gsap.to(el, {
      y: "-15vh",
      opacity: 0.03,
      ease: "none",
      scrollTrigger: {
        trigger: parent,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [reducedMotion]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-ghost-letters
      className="font-mono hidden md:block"
      style={{
        position: "absolute",
        bottom: "8vh",
        left: "-3vw",
        fontSize: "clamp(240px, 40vw, 480px)",
        letterSpacing: "-0.02em",
        lineHeight: 0.82,
        background: "linear-gradient(180deg, var(--ink-ghost) 0%, var(--ink-whisper) 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        userSelect: "none",
        pointerEvents: "none",
        opacity: 0,
        fontWeight: 400,
      }}
    >
      HKJ
    </div>
  );
}
