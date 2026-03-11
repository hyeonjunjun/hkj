"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import SplitText from "@/components/ui/SplitText";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * About — reads like a personal letter, not a resume.
 * Single column, generous breathing room.
 * Words reveal at their own pace as you scroll.
 */

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced || !sectionRef.current) return;

      // Gentle background warmth as you read
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
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      data-section="about"
      className="relative py-32 md:py-48 px-6 md:px-12"
    >
      <div className="max-w-2xl mx-auto">
        {/* No "About" header — the section just begins, like a conversation */}

        <SplitText
          text="I've always been drawn to the space between things — between design and engineering, between concept and craft, between what something looks like and how it makes you feel."
          tag="p"
          type="words"
          animation="fade-in"
          scrub={1.5}
          stagger={0.015}
          duration={0.4}
          className="font-serif italic leading-relaxed mb-12"
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
          className="leading-relaxed mb-12"
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
          className="leading-relaxed mb-12"
          splitClassName="mr-[0.2em]"
        />

        {/* Personal detail — grounding, not boasting */}
        <div className="mt-20 pt-8" style={{ borderTop: "1px solid var(--color-border)" }}>
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
