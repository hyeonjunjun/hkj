"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
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
  const reduced = useReducedMotion();

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section
      ref={sectionRef}
      data-section="about"
      className="relative"
      style={{
        padding: "6rem var(--page-px)",
        borderTop: "1px solid var(--color-border)",
      }}
    >
      <motion.div
        className="max-w-5xl mx-auto"
        variants={reduced ? undefined : containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        {/* Section label */}
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-between mb-12"
          style={{
            borderBottom: "1px solid var(--color-border)",
            paddingBottom: "0.75rem",
          }}
        >
          <span className="label">About</span>
          <span className="label">Liner Notes</span>
        </motion.div>

        {/* Two-column: Bio + Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
          {/* Left: Bio */}
          <div>
            <motion.p
              variants={itemVariants}
              className="font-sans leading-relaxed mb-6"
              style={{
                fontSize: "var(--text-base)",
                color: "var(--color-text)",
              }}
            >
              I&apos;ve always been drawn to the space between things — between
              design and engineering, between concept and craft, between what
              something looks like and how it makes you feel.
            </motion.p>

            <motion.p
              variants={itemVariants}
              className="font-sans leading-relaxed mb-6"
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--color-text-dim)",
              }}
            >
              I build for the web. Not templates or wireframes — real things.
              Interactive things. Things that respond to your cursor, that
              breathe when you scroll, that reward the people who slow down and
              pay attention.
            </motion.p>

            <motion.p
              variants={itemVariants}
              className="font-sans leading-relaxed"
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--color-text-dim)",
              }}
            >
              I care about the weight of a typeface. The easing curve on a
              transition. The half-second between a click and a response.
              These are the details that separate something good from
              something you remember.
            </motion.p>
          </div>

          {/* Right: Details grid */}
          <div>
            {/* Info rows */}
            {[
              { label: "Location", value: "New York City" },
              { label: "Focus", value: "Design Engineering" },
              { label: "Status", value: "Available" },
            ].map((row) => (
              <motion.div
                key={row.label}
                variants={itemVariants}
                className="flex justify-between items-baseline py-3"
                style={{
                  borderBottom: "1px solid var(--color-border)",
                }}
              >
                <span className="label">{row.label}</span>
                <span
                  className="font-mono"
                  style={{
                    fontSize: "var(--text-xs)",
                    color: "var(--color-text)",
                  }}
                >
                  {row.value}
                </span>
              </motion.div>
            ))}

            {/* Skills */}
            <motion.div variants={itemVariants} className="mt-8">
              <span className="label block mb-4">Stack</span>
              <div className="flex flex-wrap gap-2">
                {SKILLS.map((skill) => (
                  <span
                    key={skill}
                    className="font-mono px-2 py-1"
                    style={{
                      fontSize: "var(--text-xs)",
                      color: "var(--color-text-dim)",
                      border: "1px solid var(--color-border)",
                      letterSpacing: "0.03em",
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
