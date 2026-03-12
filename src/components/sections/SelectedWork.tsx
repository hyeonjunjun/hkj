"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { PROJECTS } from "@/constants/projects";

/**
 * SelectedWork — Radiance-inspired
 *
 * 2-column square grid with full-bleed images.
 * Project name as mono uppercase label in top-left overlay.
 * Hover: subtle zoom on image + dark overlay.
 * Scroll-triggered staggered entrance.
 *
 * Fixes: removed double-padding bug (old code had className py-24 AND
 * style padding: 6rem which conflicted). Now uses inline style only.
 */

export default function SelectedWork() {
  const gridRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced || !gridRef.current) return;
      const cards = gridRef.current.querySelectorAll(".work-card");
      gsap.from(cards, {
        opacity: 0,
        y: 40,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 80%",
          once: true,
        },
      });
    },
    { scope: gridRef },
  );

  return (
    <section
      id="work"
      data-section="work"
      style={{
        backgroundColor: "var(--color-bg)",
        paddingTop: "clamp(4rem, 8vw, 8rem)",
        paddingBottom: "clamp(4rem, 8vw, 8rem)",
        paddingLeft: "var(--page-px)",
        paddingRight: "var(--page-px)",
      }}
    >
      {/* Section heading — centered serif italic */}
      <h2
        className="font-serif italic text-center"
        style={{
          fontSize: "clamp(1.75rem, 1.5rem + 1vw, 2.5rem)",
          fontWeight: 400,
          color: "var(--color-text)",
          letterSpacing: "-0.02em",
          marginBottom: "clamp(3rem, 5vw, 5rem)",
        }}
      >
        We love what we do
      </h2>

      {/* 2-column grid */}
      <div ref={gridRef} className="grid grid-cols-2 gap-3 lg:gap-4">
        {PROJECTS.map((project) => (
          <Link
            key={project.id}
            href={`/work/${project.id}`}
            className="work-card group relative block overflow-hidden"
            style={{ aspectRatio: "1 / 1" }}
          >
            {/* Image */}
            <Image
              src={project.image}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 50vw, 50vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              quality={85}
            />

            {/* Dark overlay on hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />

            {/* Project name — top-left mono label */}
            <span
              className="absolute top-3 left-3 lg:top-4 lg:left-4 font-mono uppercase tracking-[0.12em] z-10"
              style={{
                fontSize: "clamp(0.55rem, 0.5rem + 0.15vw, 0.7rem)",
                color: "#F2F2F2",
                textShadow: "0 1px 4px rgba(0,0,0,0.4)",
              }}
            >
              {project.title}
            </span>

            {/* Coming soon badge for GYEOL */}
            {project.id === "gyeol" && (
              <span
                className="absolute bottom-3 right-3 lg:bottom-4 lg:right-4 font-mono uppercase tracking-[0.15em] px-2.5 py-1 z-10"
                style={{
                  fontSize: "var(--text-micro)",
                  backgroundColor: "rgba(255,255,255,0.9)",
                  color: "#151518",
                  backdropFilter: "blur(8px)",
                }}
              >
                Coming Soon
              </span>
            )}
          </Link>
        ))}
      </div>

      {/* View all CTA */}
      <div
        className="flex justify-center"
        style={{ marginTop: "clamp(2rem, 4vw, 3rem)" }}
      >
        <Link
          href="/work"
          className="font-mono uppercase tracking-[0.15em] transition-colors hover:text-[var(--color-accent)]"
          style={{
            fontSize: "var(--text-xs)",
            color: "var(--color-text-dim)",
            borderBottom: "1px solid var(--color-border)",
            paddingBottom: "4px",
          }}
        >
          View all work →
        </Link>
      </div>
    </section>
  );
}
