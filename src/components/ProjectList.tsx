"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { REVEAL_CARD } from "@/lib/animations";
import TransitionLink from "@/components/TransitionLink";
import type { Project } from "@/constants/projects";

interface ProjectListProps {
  projects: Project[];
}

export default function ProjectList({ projects }: ProjectListProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!listRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rows = listRef.current.querySelectorAll("[data-project-row]");
    gsap.fromTo(rows, REVEAL_CARD.from, { ...REVEAL_CARD.to });
  }, []);

  return (
    <div ref={listRef}>
      {projects.map((project, i) => (
        <ProjectRow
          key={project.id}
          project={project}
          index={i}
          isHovered={hoveredId === project.id}
          isDimmed={hoveredId !== null && hoveredId !== project.id}
          onHover={() => setHoveredId(project.id)}
          onLeave={() => setHoveredId(null)}
        />
      ))}
    </div>
  );
}

function ProjectRow({
  project,
  index,
  isHovered,
  isDimmed,
  onHover,
  onLeave,
}: {
  project: Project;
  index: number;
  isHovered: boolean;
  isDimmed: boolean;
  onHover: () => void;
  onLeave: () => void;
}) {
  const number = String(index + 1).padStart(2, "0");

  return (
    <TransitionLink
      href={`/work/${project.slug}`}
      flipId={project.coverImage ? `project-${project.id}` : undefined}
      data-project-row
      data-link
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      style={{
        display: "block",
        textDecoration: "none",
        paddingTop: "clamp(24px, 3vh, 36px)",
        paddingBottom: "clamp(24px, 3vh, 36px)",
        borderBottom: "1px solid rgba(var(--ink-rgb), 0.06)",
        opacity: isDimmed ? 0.3 : 1,
        filter: isDimmed ? "blur(1px)" : "none",
        transition:
          "opacity 0.3s cubic-bezier(.23,.88,.26,.92), filter 0.3s cubic-bezier(.23,.88,.26,.92)",
        visibility: "hidden", /* GSAP autoAlpha handles this */
      }}
    >
      {/* Row: number + title + metadata */}
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          gap: "var(--space-standard)",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: "var(--space-standard)" }}>
          <span
            className="font-mono"
            style={{
              fontSize: "var(--text-meta)",
              letterSpacing: "var(--tracking-label)",
              color: "var(--ink-ghost)",
            }}
          >
            {number}
          </span>
          <span
            className="font-display"
            style={{
              fontSize: "clamp(18px, 2.5vw, 24px)",
              fontStyle: "italic",
              color: "var(--ink-primary)",
            }}
          >
            {project.title}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: "var(--space-compact)" }}>
          <span
            className="font-mono"
            style={{
              fontSize: "var(--text-meta)",
              letterSpacing: "var(--tracking-label)",
              textTransform: "uppercase",
              color: "var(--ink-muted)",
            }}
          >
            {project.sector}
          </span>
          <span className="font-mono" style={{ fontSize: "var(--text-meta)", color: "var(--ink-ghost)" }}>
            ·
          </span>
          <span
            className="font-mono"
            style={{
              fontSize: "var(--text-meta)",
              letterSpacing: "var(--tracking-label)",
              color: "var(--ink-muted)",
            }}
          >
            {project.year}
          </span>
          {project.status === "wip" && (
            <>
              <span className="font-mono" style={{ fontSize: "var(--text-meta)", color: "var(--ink-ghost)" }}>
                ·
              </span>
              <span
                className="font-mono"
                style={{
                  fontSize: "var(--text-meta)",
                  letterSpacing: "var(--tracking-label)",
                  textTransform: "uppercase",
                  color: "var(--ink-muted)",
                }}
              >
                In progress
              </span>
            </>
          )}
        </div>
      </div>

      {/* Cover image — reveals on hover (desktop) / always visible (mobile via CSS) */}
      {project.coverImage && (
        <div
          data-project-cover
          style={{
            maxHeight: isHovered ? "500px" : "0",
            opacity: isHovered ? 1 : 0,
            overflow: "hidden",
            transition:
              "max-height 0.5s cubic-bezier(.23,.88,.26,.92), opacity 0.4s cubic-bezier(.23,.88,.26,.92)",
            marginTop: isHovered ? "var(--space-comfortable)" : "0",
          }}
          className="project-row-cover"
        >
          <div
            data-cover-image
            style={{
              position: "relative",
              aspectRatio: "16 / 9",
              borderRadius: "6px",
              overflow: "hidden",
            }}
          >
            <Image
              src={project.coverImage}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, 900px"
              style={{ objectFit: "cover" }}
              placeholder={project.coverBlur ? "blur" : undefined}
              blurDataURL={project.coverBlur}
            />
          </div>
        </div>
      )}
    </TransitionLink>
  );
}
