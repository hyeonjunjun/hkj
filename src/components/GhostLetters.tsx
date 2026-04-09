"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function GhostLetters() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

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
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-ghost-letters
      className="font-mono"
      style={{
        position: "absolute",
        bottom: "10vh",
        left: "-5vw",
        fontSize: "clamp(240px, 40vw, 480px)",
        letterSpacing: "0.02em",
        lineHeight: 0.85,
        color: "var(--ink-ghost)",
        userSelect: "none",
        pointerEvents: "none",
        opacity: 0,
      }}
    >
      <span className="hidden md:block">HKJ</span>
    </div>
  );
}
