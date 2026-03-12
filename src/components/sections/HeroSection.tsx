"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useStudioStore } from "@/lib/store";
import LiveClock from "@/components/ui/LiveClock";

/**
 * HeroSection — Jonite-inspired
 *
 * Asymmetric editorial layout:
 * - Left: large serif headline + metadata row (dual clocks, EST. date)
 * - Right: offset hero image with white pill CTA
 * - Bottom: horizontal skills marquee ticker + dark pill "Get In Touch"
 *
 * Fixes: text clipping (removed max-w constraint), image overflow
 * (constrained via maxHeight), section contained to 100svh via flex layout.
 */

const SKILLS = [
  "React Native",
  "Next.js",
  "TypeScript",
  "Design Systems",
  "GSAP",
  "Framer Motion",
  "Supabase",
  "AI / LLM",
  "Figma → Code",
];

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isLoaded = useStudioStore((s) => s.isLoaded);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced || !sectionRef.current || !isLoaded) return;

      const els = sectionRef.current.querySelectorAll("[data-hero-reveal]");
      gsap.from(els, {
        opacity: 0,
        y: 30,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.1,
        delay: 0.15,
      });
    },
    { scope: sectionRef, dependencies: [isLoaded] },
  );

  return (
    <section
      ref={sectionRef}
      data-section="hero"
      className="relative flex flex-col"
      style={{
        backgroundColor: "var(--color-bg)",
        minHeight: "100svh",
        paddingLeft: "var(--page-px)",
        paddingRight: "var(--page-px)",
      }}
    >
      {/* ── Main Grid: Left text + Right image ── */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 pt-24 lg:pt-32">
        {/* Left Column — Headline + Metadata */}
        <div className="flex flex-col justify-center lg:justify-between pb-8 lg:pb-16">
          {/* Headline */}
          <div data-hero-reveal className="lg:mt-8">
            <h1
              className="font-serif"
              style={{
                fontSize: "clamp(2.25rem, 1.5rem + 3vw, 3.5rem)",
                fontWeight: 400,
                lineHeight: 1.15,
                letterSpacing: "-0.025em",
                color: "var(--color-text)",
              }}
            >
              Calm interfaces for
              <br />
              restless problems.
            </h1>
          </div>

          {/* Metadata Row — Clocks + EST */}
          <div data-hero-reveal className="flex items-end gap-12 lg:gap-16 mt-auto pt-12">
            <div className="flex gap-8 lg:gap-12">
              <div className="flex flex-col">
                <span
                  className="font-mono uppercase tracking-[0.15em] mb-1"
                  style={{
                    fontSize: "var(--text-micro)",
                    color: "var(--color-text-ghost)",
                  }}
                >
                  New York
                </span>
                <LiveClock timezone="America/New_York" />
              </div>
              <div className="flex flex-col">
                <span
                  className="font-mono uppercase tracking-[0.15em] mb-1"
                  style={{
                    fontSize: "var(--text-micro)",
                    color: "var(--color-text-ghost)",
                  }}
                >
                  Seoul
                </span>
                <LiveClock timezone="Asia/Seoul" />
              </div>
            </div>

            <span
              className="font-mono tracking-[0.1em] hidden sm:block"
              style={{
                fontSize: "var(--text-xs)",
                color: "var(--color-text-dim)",
              }}
            >
              EST. 2024
            </span>
          </div>
        </div>

        {/* Right Column — Hero Image */}
        <div
          data-hero-reveal
          className="relative flex items-start lg:items-center justify-center lg:justify-end"
        >
          <div
            className="relative w-full overflow-hidden"
            style={{
              maxWidth: 520,
              aspectRatio: "4 / 5",
              maxHeight: "min(65svh, 600px)",
            }}
          >
            <Image
              src="/images/sift-v2.jpg"
              alt="HKJ Studio — featured work"
              fill
              priority
              sizes="(max-width: 1024px) 90vw, 45vw"
              className="object-cover"
              quality={90}
            />
            {/* Pill CTA */}
            <motion.a
              href="#work"
              className="absolute bottom-6 left-6 flex items-center gap-2 bg-white/95 backdrop-blur-sm px-5 py-2.5 rounded-full shadow-sm group"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.2 }}
            >
              <span
                className="font-grotesk"
                style={{
                  fontSize: "var(--text-sm)",
                  color: "#151518",
                  fontWeight: 450,
                }}
              >
                View Work
              </span>
              <span
                className="font-grotesk transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                style={{ fontSize: "var(--text-sm)", color: "#151518" }}
              >
                ↗
              </span>
            </motion.a>
          </div>
        </div>
      </div>

      {/* ── Bottom Ticker Bar ── */}
      <div
        data-hero-reveal
        className="flex items-center justify-between py-5 shrink-0"
        style={{ borderTop: "1px solid var(--color-border)" }}
      >
        {/* Dot + Label */}
        <div className="flex items-center gap-3 shrink-0">
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: "var(--color-text)" }}
          />
          <span
            className="font-mono uppercase tracking-[0.15em]"
            style={{
              fontSize: "var(--text-micro)",
              color: "var(--color-text-dim)",
            }}
          >
            Capabilities
          </span>
        </div>

        {/* Marquee */}
        <div className="flex-1 overflow-hidden mx-6 lg:mx-8">
          <div
            className="marquee-track flex gap-8 animate-marquee"
            style={{ width: "max-content" }}
          >
            {[...SKILLS, ...SKILLS].map((skill, i) => (
              <span
                key={`${skill}-${i}`}
                className="font-mono uppercase whitespace-nowrap"
                style={{
                  fontSize: "var(--text-micro)",
                  letterSpacing: "0.1em",
                  color: "var(--color-text-ghost)",
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* CTA Pill */}
        <a
          href="#contact"
          className="shrink-0 font-mono uppercase tracking-[0.1em] px-5 py-2 rounded-full transition-colors hidden sm:block"
          style={{
            fontSize: "var(--text-micro)",
            backgroundColor: "var(--color-text)",
            color: "var(--color-bg)",
          }}
        >
          Get In Touch →
        </a>
      </div>
    </section>
  );
}
