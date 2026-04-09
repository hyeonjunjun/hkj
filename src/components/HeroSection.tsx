"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const els = containerRef.current.querySelectorAll("[data-reveal]");

    gsap.fromTo(
      els,
      { opacity: 0, y: 40, filter: "blur(4px)" },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.6,
        stagger: 0.08,
        ease: "power3.out",
        delay: 0.2,
      }
    );
  }, []);

  return (
    <section
      ref={containerRef}
      style={{
        paddingTop: 120,
        paddingBottom: 56,
        paddingInline: "clamp(24px, 5vw, 64px)",
        maxWidth: 900,
        margin: "0 auto",
      }}
    >
      <p
        data-reveal
        className="font-display italic"
        style={{
          fontSize: "clamp(22px, 3vw, 32px)",
          lineHeight: 1.35,
          fontWeight: 400,
          color: "var(--ink-primary)",
          maxWidth: "54ch",
          opacity: 0,
        }}
      >
        Design engineer building at the intersection of craft and systems thinking.
      </p>

      <p
        data-reveal
        className="font-mono uppercase"
        style={{
          fontSize: 10,
          letterSpacing: "0.06em",
          color: "var(--ink-muted)",
          marginTop: 24,
          opacity: 0,
        }}
      >
        New York · Open to Work
      </p>
    </section>
  );
}
