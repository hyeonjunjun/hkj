"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import SplitText from "@/components/ui/SplitText";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const SKILLS = [
  "React",
  "Next.js",
  "TypeScript",
  "GSAP",
  "Three.js",
  "Framer Motion",
  "Figma",
  "Node.js",
  "Supabase",
  "WebGL",
  "Tailwind CSS",
  "React Native",
];

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced || !sectionRef.current) return;

      // Background warmth
      gsap.fromTo(
        sectionRef.current,
        { backgroundColor: "#0a0a0a" },
        {
          backgroundColor: "#0f0e0c",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top center",
            end: "bottom center",
            scrub: 1.5,
          },
        }
      );

      // Image frame parallax
      if (imageRef.current) {
        gsap.fromTo(
          imageRef.current,
          { y: 30 },
          {
            y: -30,
            ease: "none",
            scrollTrigger: {
              trigger: imageRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.5,
            },
          }
        );
      }
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      data-section="about"
      className="relative py-32 md:py-48 px-6 md:px-12"
    >
      <div className="max-w-6xl mx-auto">
        {/* Split layout: image + text */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
          {/* Left: Portrait placeholder */}
          <div className="order-1">
            <div
              ref={imageRef}
              className="relative aspect-[4/3] md:aspect-[3/4] overflow-hidden rounded-sm"
              style={{
                backgroundColor: "var(--color-surface)",
                border: "1px solid var(--color-border)",
              }}
            >
              {/* Grain texture */}
              <div
                className="absolute inset-0 opacity-[0.06] mix-blend-overlay"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "repeat",
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  className="font-mono uppercase tracking-[0.3em]"
                  style={{
                    fontSize: "var(--text-xs)",
                    color: "var(--color-text-dim)",
                    opacity: 0.3,
                  }}
                >
                  Portrait
                </span>
              </div>
            </div>
          </div>

          {/* Right: Text */}
          <div className="order-2 self-center">
            <SplitText
              text="I've always been drawn to the space between things — between design and engineering, between concept and craft, between what something looks like and how it makes you feel."
              tag="p"
              type="words"
              animation="fade-in"
              scrub={1.5}
              stagger={0.015}
              duration={0.4}
              className="font-serif italic leading-relaxed mb-10"
              splitClassName="mr-[0.22em]"
              style={{ fontSize: "var(--text-xl)" }}
            />

            <SplitText
              text="I build for the web. Not templates or wireframes — real things. Interactive things. Things that respond to your cursor, that breathe when you scroll, that reward the people who slow down and pay attention."
              tag="p"
              type="words"
              animation="fade-in"
              scrub={1.5}
              stagger={0.012}
              duration={0.4}
              className="leading-relaxed mb-10"
              splitClassName="mr-[0.2em]"
            />

            <SplitText
              text="I care about the weight of a typeface. The easing curve on a transition. The half-second between a click and a response. These are the details that separate something good from something you remember."
              tag="p"
              type="words"
              animation="fade-in"
              scrub={1.5}
              stagger={0.012}
              duration={0.4}
              className="leading-relaxed"
              splitClassName="mr-[0.2em]"
            />
          </div>
        </div>

        {/* Skills row */}
        <ScrollReveal animation="fade-up" delay={0.1}>
          <div
            className="mt-20 pt-10"
            style={{ borderTop: "1px solid var(--color-border)" }}
          >
            <p
              className="font-mono uppercase tracking-[0.3em] mb-6"
              style={{
                fontSize: "var(--text-xs)",
                color: "var(--color-text-dim)",
              }}
            >
              Tools &amp; Technologies
            </p>
            <p
              className="font-mono leading-loose"
              style={{
                fontSize: "var(--text-xs)",
                color: "var(--color-text-dim)",
              }}
            >
              {SKILLS.join(" · ")}
            </p>
          </div>
        </ScrollReveal>

        {/* Personal detail */}
        <div
          className="mt-16 pt-8"
          style={{ borderTop: "1px solid var(--color-border)" }}
        >
          <p
            className="font-mono leading-loose"
            style={{
              color: "var(--color-text-dim)",
              fontSize: "var(--text-sm)",
            }}
          >
            Ryan Jun
            <br />
            New York City
            <br />
            Formerly everywhere, currently here.
          </p>
        </div>
      </div>
    </section>
  );
}
