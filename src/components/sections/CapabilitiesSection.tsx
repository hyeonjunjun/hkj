"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import ScrollReveal from "@/components/ui/ScrollReveal";

interface Capability {
  title: string;
  description: string;
  tools: string[];
}

const CAPABILITIES: Capability[] = [
  {
    title: "Design Engineering",
    description:
      "Bridging design and development with pixel-perfect implementations. From Figma to production-ready code with obsessive attention to motion, layout, and interaction quality.",
    tools: ["React", "Next.js", "TypeScript", "CSS", "Tailwind"],
  },
  {
    title: "Motion Design",
    description:
      "Scroll-driven animations, page transitions, and micro-interactions that create meaning. Every motion serves the narrative — nothing moves without purpose.",
    tools: ["GSAP", "Framer Motion", "Three.js", "WebGL", "Lottie"],
  },
  {
    title: "Full-Stack Development",
    description:
      "End-to-end application architecture from database design to deployment. APIs, auth systems, real-time features, and performance optimization.",
    tools: ["Node.js", "PostgreSQL", "Supabase", "Vercel", "Docker"],
  },
  {
    title: "Design Systems",
    description:
      "Component libraries and design tokens that scale. Typography systems, color architectures, spacing scales, and documentation that keeps teams aligned.",
    tools: ["Storybook", "Figma", "Radix UI", "CSS Variables"],
  },
  {
    title: "Creative Direction",
    description:
      "Conceptual strategy that connects brand identity to digital experience. Visual language development, mood boarding, and art direction for digital products.",
    tools: ["Brand Strategy", "Visual Identity", "Art Direction"],
  },
];

export default function CapabilitiesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced || !sectionRef.current) return;

      gsap.from(".capability-item", {
        opacity: 0,
        y: 30,
        stagger: 0.08,
        duration: 0.6,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });
    },
    { scope: sectionRef }
  );

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <section
      ref={sectionRef}
      className="relative py-32 px-6"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <ScrollReveal className="mb-16">
          <span
            className="font-mono uppercase tracking-widest"
            style={{
              color: "var(--color-text-dim)",
              fontSize: "var(--text-xs)",
            }}
          >
            Capabilities
          </span>
          <h2
            className="font-serif mt-4"
            style={{ fontSize: "var(--text-2xl)" }}
          >
            What I Do
          </h2>
        </ScrollReveal>

        {/* Accordion */}
        <div>
          {CAPABILITIES.map((cap, i) => (
            <div
              key={cap.title}
              className="capability-item"
              style={{ borderBottom: "1px solid var(--color-border)" }}
            >
              <button
                onClick={() => toggle(i)}
                onKeyDown={(e) => {
                  if (e.key === "Escape" && openIndex === i) setOpenIndex(null);
                }}
                aria-expanded={openIndex === i}
                className="w-full py-8 flex justify-between items-center group text-left"
              >
                <span
                  className="font-serif transition-colors duration-300"
                  style={{
                    fontSize: "var(--text-xl)",
                    color:
                      openIndex === i
                        ? "var(--color-gold)"
                        : "var(--color-text)",
                  }}
                >
                  {cap.title}
                </span>
                <motion.span
                  animate={{ rotate: openIndex === i ? 45 : 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="text-2xl flex-shrink-0 ml-4"
                  style={{ color: "var(--color-text-dim)" }}
                >
                  +
                </motion.span>
              </button>

              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{
                      height: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
                      opacity: { duration: 0.3, delay: 0.1 },
                    }}
                    className="overflow-hidden"
                  >
                    <div className="pb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <p
                        className="leading-relaxed"
                        style={{
                          color: "var(--color-text-dim)",
                          fontSize: "var(--text-base)",
                        }}
                      >
                        {cap.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {cap.tools.map((tool) => (
                          <span
                            key={tool}
                            className="font-mono px-3 py-1 rounded-full"
                            style={{
                              fontSize: "var(--text-xs)",
                              color: "var(--color-text-dim)",
                              border: "1px solid var(--color-border)",
                            }}
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
