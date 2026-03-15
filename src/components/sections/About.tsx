"use client";

import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";
import WobblyRule from "@/components/ui/WobblyRule";

/**
 * About — Single column editorial text with offset image
 *
 * 60-70ch measure, deep margins. One image offset right, slightly rotated.
 * Subtle tonal background shift via ScrollTrigger.
 * Text fades with a single opacity 0.15→1 reveal. No translateY.
 */
export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    // Text reveal
    const textEls = sectionRef.current.querySelectorAll("[data-about-text]");
    gsap.fromTo(
      textEls,
      { opacity: 0.15 },
      {
        opacity: 1,
        duration: 1.2,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
      }
    );

    // Image reveal — delayed
    if (imageRef.current) {
      gsap.fromTo(
        imageRef.current,
        { opacity: 0.15 },
        {
          opacity: 1,
          duration: 1.4,
          ease: "power3.out",
          scrollTrigger: {
            trigger: imageRef.current,
            start: "top 80%",
          },
        }
      );
    }

    // Subtle background tonal shift
    if (bgRef.current) {
      gsap.fromTo(
        bgRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        }
      );
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative"
      style={{
        paddingTop: "clamp(10rem, 18vh, 14rem)",
        paddingBottom: "clamp(8rem, 14vh, 12rem)",
      }}
    >
      {/* Subtle tonal bg shift layer */}
      <div
        ref={bgRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(180deg, var(--color-bg) 0%, #161513 50%, var(--color-bg) 100%)",
          opacity: 0,
        }}
      />

      <div className="relative z-10 section-padding">
        {/* Section label */}
        <div className="max-w-[900px] mx-auto mb-16" data-about-text>
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

        <div className="max-w-[1100px] mx-auto relative">
          {/* Text column */}
          <div className="max-w-[900px]">
            <p
              className="font-sans"
              style={{
                fontSize: "var(--text-body)",
                lineHeight: 1.8,
                color: "var(--color-text)",
                marginBottom: "clamp(1.5rem, 3vh, 2.5rem)",
              }}
              data-about-text
            >
              HKJ is a one-person design engineering practice based between
              New York and Seoul. I build products that feel considered — from
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
              data-about-text
            >
              My work sits at the intersection of design craft and deep technical
              execution. I care about type, motion, and the invisible details that
              make software feel intentional. Every project is an opportunity to
              close the gap between what designers envision and what engineers ship.
            </p>

            <p
              className="font-sans"
              style={{
                fontSize: "var(--text-body)",
                lineHeight: 1.8,
                color: "var(--color-text-secondary)",
                maxWidth: "58ch",
              }}
              data-about-text
            >
              Previously, I worked on products across mobile, AI, and design systems.
              I believe the best digital work borrows from the rigor of print and the
              warmth of physical objects.
            </p>
          </div>

          {/* Offset image — outside text column, slightly rotated */}
          <div
            ref={imageRef}
            className="hidden lg:block absolute"
            style={{
              right: "-2rem",
              top: "-2rem",
              width: "260px",
              transform: "rotate(1.8deg)",
            }}
          >
            <div
              className="w-full overflow-hidden"
              style={{
                aspectRatio: "3/4",
                backgroundColor: "var(--color-surface)",
                /* Deckled edge mask using CSS clip-path */
                clipPath: `polygon(
                  0% 2%, 3% 0%, 8% 1%, 15% 0%, 22% 2%, 28% 0%, 35% 1%,
                  42% 0%, 50% 2%, 58% 0%, 65% 1%, 72% 0%, 78% 2%, 85% 0%,
                  92% 1%, 97% 0%, 100% 2%, 99% 8%, 100% 15%, 99% 22%,
                  100% 28%, 99% 35%, 100% 42%, 99% 50%, 100% 58%, 99% 65%,
                  100% 72%, 99% 78%, 100% 85%, 99% 92%, 100% 97%, 98% 100%,
                  92% 99%, 85% 100%, 78% 99%, 72% 100%, 65% 99%, 58% 100%,
                  50% 99%, 42% 100%, 35% 99%, 28% 100%, 22% 99%, 15% 100%,
                  8% 99%, 3% 100%, 0% 98%, 1% 92%, 0% 85%, 1% 78%,
                  0% 72%, 1% 65%, 0% 58%, 1% 50%, 0% 42%, 1% 35%,
                  0% 28%, 1% 22%, 0% 15%, 1% 8%
                )`,
              }}
            />
            <span
              className="font-mono block mt-3 text-center"
              style={{
                fontSize: "var(--text-micro)",
                color: "var(--color-text-ghost)",
                letterSpacing: "0.1em",
              }}
            >
              FIG. 1
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
