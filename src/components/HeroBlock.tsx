"use client";

import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";
import { useStudioStore } from "@/lib/store";
import { PROJECTS } from "@/constants/projects";

const GHOST_COUNT = 2;

export default function HeroBlock() {
  const isLoaded = useStudioStore((s) => s.isLoaded);
  const containerRef = useRef<HTMLDivElement>(null);

  const projectCount = PROJECTS.length;

  // GSAP stagger entrance after preloader
  useEffect(() => {
    if (!isLoaded) return;
    const lines = containerRef.current?.querySelectorAll("[data-hero-line]");
    if (!lines?.length) return;

    gsap.fromTo(
      lines,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: "power3.out",
      }
    );
  }, [isLoaded]);

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center justify-center text-center"
      style={{
        minHeight: "40vh",
        padding: "clamp(4rem, 10vh, 8rem) var(--page-px)",
      }}
    >
      <div
        data-hero-line
        className="font-mono uppercase tracking-[0.3em] opacity-0"
        style={{
          fontSize: "var(--text-lg)",
          color: "var(--color-text)",
          marginBottom: "0.75rem",
        }}
      >
        HKJ
      </div>

      <div
        data-hero-line
        className="opacity-0"
        style={{
          width: "3rem",
          height: "1px",
          backgroundColor: "var(--color-border-strong)",
          marginBottom: "1.5rem",
        }}
      />

      <div
        data-hero-line
        className="font-mono lowercase tracking-[0.2em] opacity-0"
        style={{
          fontSize: "var(--text-sm)",
          color: "var(--color-text-secondary)",
          marginBottom: "0.25rem",
        }}
      >
        design engineering
      </div>

      <div
        data-hero-line
        className="font-mono lowercase tracking-[0.2em] opacity-0"
        style={{
          fontSize: "var(--text-sm)",
          color: "var(--color-text-secondary)",
          marginBottom: "2rem",
        }}
      >
        nyc & seoul
      </div>

      <div
        data-hero-line
        className="font-mono lowercase tracking-[0.15em] opacity-0"
        style={{
          fontSize: "var(--text-micro)",
          color: "var(--color-text-ghost)",
          marginBottom: "0.125rem",
        }}
      >
        portfolio v2.0
      </div>

      <div
        data-hero-line
        className="font-mono lowercase tracking-[0.15em] opacity-0"
        style={{
          fontSize: "var(--text-micro)",
          color: "var(--color-text-ghost)",
          marginBottom: "0.125rem",
        }}
      >
        {projectCount} projects loaded
      </div>

      <div
        data-hero-line
        className="font-mono lowercase tracking-[0.15em] opacity-0"
        style={{
          fontSize: "var(--text-micro)",
          color: "var(--color-text-ghost)",
        }}
      >
        {GHOST_COUNT} in development
      </div>
    </div>
  );
}
