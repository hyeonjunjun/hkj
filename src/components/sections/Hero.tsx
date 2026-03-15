"use client";

import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";
import { useStudioStore } from "@/lib/store";

/**
 * Hero — Full viewport, studio mark + offset video + role
 *
 * No headline. No tagline. No paragraph.
 * Video offset from center (~55/45 split), muted autoplay loop.
 * Combined reel: hero-reel + cropped gyeol b-roll (~5s total).
 * Scroll indicator at bottom center.
 */
export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const isLoaded = useStudioStore((s) => s.isLoaded);

  useEffect(() => {
    if (!isLoaded || !containerRef.current) return;

    const els = containerRef.current.querySelectorAll("[data-hero-reveal]");
    gsap.fromTo(
      els,
      { opacity: 0 },
      { opacity: 1, duration: 1.2, stagger: 0.15, ease: "power3.out" }
    );
  }, [isLoaded]);

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative h-screen flex flex-col justify-between section-padding"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      {/* Studio mark — top left */}
      <div className="pt-8" data-hero-reveal>
        <span
          className="font-display"
          style={{
            fontSize: "clamp(11px, 1vw, 13px)",
            color: "var(--color-text-dim)",
            letterSpacing: "0.05em",
          }}
        >
          HKJ
        </span>
      </div>

      {/* Video — offset from center */}
      <div
        className="flex-1 flex items-center"
        style={{ paddingLeft: "10%", paddingRight: "5%" }}
        data-hero-reveal
      >
        <div
          className="relative w-full"
          style={{ maxWidth: "55%", aspectRatio: "16/9" }}
        >
          <video
            src="/hero-combined.mp4"
            muted
            autoPlay
            loop
            playsInline
            preload="auto"
            className="w-full h-full object-cover"
            style={{ backgroundColor: "var(--color-surface)" }}
          />
        </div>
      </div>

      {/* Role descriptor — bottom */}
      <div
        className="flex justify-between items-end pb-8"
        data-hero-reveal
      >
        <span
          className="font-mono"
          style={{
            fontSize: "clamp(10px, 0.8vw, 11px)",
            color: "var(--color-text-dim)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          Design Engineer
        </span>

        {/* Scroll indicator */}
        <div className="flex flex-col items-center gap-2">
          <div
            className="overflow-hidden"
            style={{ width: 1, height: 24 }}
          >
            <div
              style={{
                width: 1,
                height: "100%",
                backgroundColor: "var(--color-text-dim)",
                animation: "scrollLine 2s ease-in-out infinite",
              }}
            />
          </div>
        </div>

        <span
          className="font-mono"
          style={{
            fontSize: "clamp(10px, 0.8vw, 11px)",
            color: "var(--color-text-dim)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          New York / Seoul
        </span>
      </div>
    </section>
  );
}
