"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { motion } from "framer-motion";
import { PROJECTS } from "@/constants/projects";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { usePageTransition } from "@/hooks/usePageTransition";

/**
 * Each project gets its own bespoke layout treatment.
 * No uniform grid — each card is curated like an editorial spread.
 */

const LAYOUT_VARIANTS = [
  // Project 1: Full-width cinematic
  {
    wrapper: "col-span-12",
    aspect: "aspect-[21/9]",
    titleSize: "var(--text-3xl)",
    alignment: "items-end justify-start p-8 md:p-12",
  },
  // Project 2: Compact, tucked right
  {
    wrapper: "col-span-12 md:col-span-5 md:col-start-8",
    aspect: "aspect-[3/4]",
    titleSize: "var(--text-xl)",
    alignment: "items-start justify-end p-6",
  },
  // Project 3: Medium left
  {
    wrapper: "col-span-12 md:col-span-7",
    aspect: "aspect-[16/10]",
    titleSize: "var(--text-2xl)",
    alignment: "items-end justify-start p-8",
  },
];

export default function ProjectGrid() {
  const gridRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const navigate = usePageTransition();

  useGSAP(
    () => {
      if (reduced || !gridRef.current) return;

      const cards = gridRef.current.querySelectorAll(".project-card");
      cards.forEach((card, i) => {
        gsap.from(card, {
          opacity: 0,
          y: 80,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 90%",
            toggleActions: "play none none none",
          },
          delay: i * 0.05,
        });
      });
    },
    { scope: gridRef }
  );

  const displayProjects = PROJECTS.filter((p) => p.id !== "gyeol");

  return (
    <section
      ref={gridRef}
      data-section="work"
      className="relative py-24 md:py-40 px-6 md:px-12"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      {/* No "Selected Work" header — the work speaks for itself */}

      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-4 md:gap-6">
        {displayProjects.map((project, i) => {
          const layout = LAYOUT_VARIANTS[i % LAYOUT_VARIANTS.length];

          return (
            <motion.div
              key={project.id}
              role="link"
              tabIndex={0}
              onClick={(e) => navigate(`/work/${project.id}`, e)}
              onKeyDown={(e) => {
                if (e.key === "Enter") navigate(`/work/${project.id}`);
              }}
              className={`project-card group block relative overflow-hidden rounded-sm cursor-pointer ${layout.wrapper} ${layout.aspect}`}
              whileHover="hover"
              data-cursor="explore"
            >
              {/* Image with parallax hover */}
              <motion.div
                className="absolute inset-0"
                variants={{
                  hover: { scale: 1.04 },
                }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 70vw"
                  className="object-cover"
                />
                {/* Vignette — not a flat gradient */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.6) 100%)",
                  }}
                />
              </motion.div>

              {/* Content — each project positioned per its layout variant */}
              <div
                className={`relative z-10 flex flex-col h-full ${layout.alignment}`}
              >
                <div>
                  {/* Sector + Year in a quiet line */}
                  <span
                    className="font-mono uppercase tracking-widest block mb-3 opacity-60"
                    style={{ fontSize: "var(--text-xs)" }}
                  >
                    {project.sector} &middot; {project.year}
                  </span>

                  {/* Title — sized per layout */}
                  <h3
                    className="font-serif leading-tight"
                    style={{ fontSize: layout.titleSize }}
                  >
                    {project.title}
                  </h3>

                  {/* One-line pitch, visible on hover */}
                  <motion.p
                    className="mt-2 max-w-sm leading-relaxed"
                    style={{
                      color: "var(--color-text-dim)",
                      fontSize: "var(--text-sm)",
                    }}
                    initial={{ opacity: 0, y: 10 }}
                    variants={{
                      hover: { opacity: 1, y: 0 },
                    }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                  >
                    {project.pitch}
                  </motion.p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
