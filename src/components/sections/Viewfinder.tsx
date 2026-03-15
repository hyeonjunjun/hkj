"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import { PROJECTS } from "@/constants/projects";
import WobblyRule from "@/components/ui/WobblyRule";

/**
 * Selected Work — Editorial Index with Floating Preview
 *
 * Full-width project rows: index number + title + sector/year.
 * Desktop: cursor-following preview image on hover (GSAP quickTo).
 * Mobile: clean rows, no floating preview.
 * Click row → navigate to case study.
 */
export default function Viewfinder() {
  const sectionRef = useRef<HTMLElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const previewImgRef = useRef<HTMLImageElement>(null);
  const previewVideoRef = useRef<HTMLVideoElement>(null);
  const hoveredRef = useRef<number | null>(null);

  // GSAP quickTo for smooth preview follow
  const xTo = useRef<gsap.QuickToFunc | null>(null);
  const yTo = useRef<gsap.QuickToFunc | null>(null);

  useEffect(() => {
    if (!previewRef.current) return;
    xTo.current = gsap.quickTo(previewRef.current, "x", {
      duration: 0.5,
      ease: "power3.out",
    });
    yTo.current = gsap.quickTo(previewRef.current, "y", {
      duration: 0.5,
      ease: "power3.out",
    });
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!xTo.current || !yTo.current || !sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    // Position preview offset from cursor
    xTo.current(e.clientX - rect.left + 24);
    yTo.current(e.clientY - rect.top - 120);
  }, []);

  const handleRowEnter = useCallback((index: number) => {
    hoveredRef.current = index;
    const project = PROJECTS[index];

    // Update preview content
    if (previewImgRef.current) {
      previewImgRef.current.src = project.image;
      previewImgRef.current.alt = project.title;
      previewImgRef.current.style.display = project.cardVideo ? "none" : "block";
    }
    if (previewVideoRef.current) {
      if (project.cardVideo) {
        previewVideoRef.current.src = project.cardVideo;
        previewVideoRef.current.style.display = "block";
        previewVideoRef.current.play().catch(() => {});
      } else {
        previewVideoRef.current.style.display = "none";
        previewVideoRef.current.pause();
      }
    }

    if (previewRef.current) {
      gsap.to(previewRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.35,
        ease: "power3.out",
        overwrite: true,
      });
    }
  }, []);

  const handleRowLeave = useCallback(() => {
    hoveredRef.current = null;
    if (previewRef.current) {
      gsap.to(previewRef.current, {
        opacity: 0,
        scale: 0.96,
        duration: 0.25,
        ease: "power2.in",
        overwrite: true,
      });
    }
    if (previewVideoRef.current) {
      previewVideoRef.current.pause();
    }
  }, []);

  // Scroll entrance
  useEffect(() => {
    if (!sectionRef.current) return;

    gsap.fromTo(
      sectionRef.current.querySelectorAll("[data-work-reveal]"),
      { opacity: 0.15 },
      {
        opacity: 1,
        duration: 0.9,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
      }
    );
  }, []);

  return (
    <section
      ref={sectionRef}
      id="viewfinder"
      className="relative"
      style={{
        paddingTop: "clamp(6rem, 12vh, 10rem)",
        paddingBottom: "clamp(8rem, 14vh, 12rem)",
      }}
      onMouseMove={handleMouseMove}
    >
      {/* Section label */}
      <div className="section-padding mb-8" data-work-reveal>
        <span
          className="font-mono uppercase"
          style={{
            fontSize: "var(--text-micro)",
            letterSpacing: "0.15em",
            color: "var(--color-text-ghost)",
          }}
        >
          Selected Work
        </span>
      </div>

      <WobblyRule className="section-padding" />

      {/* Project rows */}
      <div className="section-padding">
        {PROJECTS.map((project, i) => (
          <Link
            key={project.id}
            href={`/work/${project.id}`}
            data-cursor="project"
            data-work-reveal
            className="block group"
            onMouseEnter={() => handleRowEnter(i)}
            onMouseLeave={handleRowLeave}
          >
            <div
              className="flex items-baseline justify-between"
              style={{
                padding: "clamp(1.25rem, 2.5vh, 2rem) 0",
                borderBottom: "1px solid var(--color-border)",
              }}
            >
              {/* Left: index + title */}
              <div className="flex items-baseline gap-4 md:gap-6 min-w-0">
                <span
                  className="font-mono flex-shrink-0"
                  style={{
                    fontSize: "var(--text-micro)",
                    color: "var(--color-text-ghost)",
                    letterSpacing: "0.1em",
                    minWidth: "2ch",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3
                  className="font-display transition-colors duration-300 group-hover:text-[var(--color-text)]"
                  style={{
                    fontSize: "var(--text-h2)",
                    lineHeight: 1.2,
                    color: "var(--color-text-dim)",
                  }}
                >
                  {project.title}
                </h3>
              </div>

              {/* Right: sector + year */}
              <div className="hidden sm:flex items-baseline gap-6 flex-shrink-0 ml-6">
                <span
                  className="font-mono transition-colors duration-300 group-hover:text-[var(--color-text-dim)]"
                  style={{
                    fontSize: "var(--text-micro)",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--color-text-ghost)",
                  }}
                >
                  {project.sector}
                </span>
                <span
                  className="font-mono"
                  style={{
                    fontSize: "var(--text-micro)",
                    letterSpacing: "0.1em",
                    color: "var(--color-text-ghost)",
                  }}
                >
                  {project.year}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <WobblyRule className="section-padding mt-0" />

      {/* Floating preview — desktop only, cursor-following */}
      <div
        ref={previewRef}
        className="hidden md:block absolute pointer-events-none z-20"
        style={{
          width: 300,
          opacity: 0,
          transform: "scale(0.96)",
          top: 0,
          left: 0,
          willChange: "transform, opacity",
        }}
      >
        <div
          className="overflow-hidden"
          style={{
            aspectRatio: "16/10",
            backgroundColor: "var(--color-surface)",
          }}
        >
          <img
            ref={previewImgRef}
            src=""
            alt=""
            className="w-full h-full object-cover"
            style={{ filter: "brightness(0.85)" }}
          />
          <video
            ref={previewVideoRef}
            muted
            loop
            playsInline
            preload="none"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ display: "none", filter: "brightness(0.85)" }}
          />
        </div>
      </div>
    </section>
  );
}
