"use client";

import { useRef, useEffect } from "react";
import TransitionLink from "@/components/TransitionLink";
import { gsap } from "@/lib/gsap";
import Colophon from "@/components/sections/Colophon";

/**
 * About Page — Standalone editorial page
 *
 * Expanded version of the homepage about section.
 * Full-page layout with generous whitespace, offset image,
 * and restrained GSAP reveals.
 */
export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const reveals = containerRef.current.querySelectorAll("[data-reveal]");
    gsap.fromTo(
      reveals,
      { opacity: 0.15, y: 15 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
      }
    );
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen" style={{ backgroundColor: "var(--color-bg)" }}>
      {/* Hero area */}
      <section
        className="section-padding"
        style={{
          paddingTop: "clamp(10rem, 18vh, 14rem)",
          paddingBottom: "clamp(4rem, 8vh, 6rem)",
        }}
      >
        <div className="max-w-[900px] mx-auto">
          {/* Back link */}
          <TransitionLink
            href="/"
            className="font-mono transition-colors duration-300 hover:text-[var(--color-accent)] inline-block mb-16"
            style={{
              fontSize: "var(--text-micro)",
              color: "var(--color-text-dim)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
            data-reveal
          >
            &larr; Back
          </TransitionLink>

          {/* Section label */}
          <div className="mb-12" data-reveal>
            <span
              className="font-mono uppercase"
              style={{
                fontSize: "var(--text-micro)",
                letterSpacing: "0.15em",
                color: "var(--color-text-ghost)",
              }}
            >
              About
            </span>
          </div>

          <div>
            <p
              className="font-sans"
              style={{
                fontSize: "var(--text-body)",
                lineHeight: 1.8,
                color: "var(--color-text)",
                marginBottom: "clamp(1.5rem, 3vh, 2.5rem)",
                maxWidth: "58ch",
              }}
              data-reveal
            >
              HKJ is a one-person design engineering practice based between
              New York and Seoul. I build products that feel considered &mdash; from
              system design to pixel-level detail.
            </p>

            <p
              className="font-sans"
              style={{
                fontSize: "var(--text-body)",
                lineHeight: 1.8,
                color: "var(--color-text-secondary)",
                marginBottom: "clamp(1.5rem, 3vh, 2.5rem)",
                maxWidth: "58ch",
              }}
              data-reveal
            >
              My work sits at the intersection of design craft and deep technical
              execution. I care about type, motion, and the invisible details that
              make software feel intentional. Every project is a chance to close
              the gap between what designers envision and what engineers ship.
            </p>

            <p
              className="font-sans"
              style={{
                fontSize: "var(--text-body)",
                lineHeight: 1.8,
                color: "var(--color-text-secondary)",
                maxWidth: "58ch",
              }}
              data-reveal
            >
              Previously, I worked on products across mobile, AI, and design systems.
              I believe the best digital work borrows from the rigor of print and the
              warmth of physical objects.
            </p>

            {/* Personal aside */}
            <p
              className="font-mono mt-10"
              style={{
                fontSize: "var(--text-micro)",
                lineHeight: 1.7,
                color: "var(--color-text-ghost)",
                letterSpacing: "0.04em",
                maxWidth: "48ch",
              }}
              data-reveal
            >
              When I&rsquo;m not pushing pixels, I&rsquo;m probably hunting for good
              light to photograph, reading about material science, or making
              pour-overs that take too long.
            </p>
          </div>
        </div>
      </section>

      <Colophon />
    </div>
  );
}
