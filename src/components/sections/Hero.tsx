"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "@/lib/gsap";
import TransitionLink from "@/components/TransitionLink";
import ProjectCover from "@/components/ProjectCover";
import { PROJECTS } from "@/constants/projects";
import { CONTACT_EMAIL, SOCIALS } from "@/constants/contact";

/*
 * Grid — curated placement.
 *
 * Row 1: featured work (descending scale, left to right)
 * Row 2: catalogue (uniform, supporting)
 */
const LAYOUT = [
  { id: "gyeol",     span: 5, index: 1 },
  { id: "sift",      span: 4, index: 2 },
  { id: "conductor", span: 3, index: 7 },
  { id: "hana",      span: 3, index: 3 },
  { id: "pour",      span: 3, index: 4 },
  { id: "moji",      span: 3, index: 5 },
  { id: "atlas",     span: 3, index: 6 },
] as const;

const projectMap = Object.fromEntries(PROJECTS.map((p) => [p.id, p]));

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  /* Entrance: covers first, identity + footer follow */
  useEffect(() => {
    if (!sectionRef.current) return;

    const covers = sectionRef.current.querySelectorAll("[data-image]");
    const identity = sectionRef.current.querySelector("[data-identity]");
    const footer = sectionRef.current.querySelector("[data-footer]");

    const tl = gsap.timeline();
    tl.fromTo(
      covers,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.06, ease: "power3.out" },
    );
    tl.fromTo(
      [identity, footer],
      { opacity: 0 },
      { opacity: 1, duration: 0.5, ease: "power2.out" },
      "-=0.4",
    );
  }, []);

  return (
    <div
      ref={sectionRef}
      style={{
        height: "100svh",
        overflow: "hidden",
        backgroundColor: "var(--color-bg)",
        display: "flex",
        flexDirection: "column",
        padding:
          "clamp(3.8rem, 7vh, 5.5rem) var(--page-px) clamp(0.8rem, 1.5vh, 1.2rem)",
      }}
    >
      {/* ── Identity ── */}
      <div
        data-identity
        style={{ marginBottom: "clamp(1.5rem, 3vh, 2.5rem)" }}
      >
        <h1
          className="font-display"
          style={{
            fontSize: "clamp(1.4rem, 2.2vw, 2rem)",
            fontWeight: 400,
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
            color: "var(--color-text)",
          }}
        >
          Hyeonjoon Jun
        </h1>
        <p
          className="font-sans"
          style={{
            fontSize: "var(--text-body)",
            color: "var(--color-text-secondary)",
            marginTop: "0.25em",
            lineHeight: 1.5,
          }}
        >
          Design engineer building interfaces that feel considered.
        </p>
      </div>

      {/* ── Grid ── */}
      <div
        className="tableau-grid"
        style={{ flex: 1, minHeight: 0 }}
      >
        {LAYOUT.map((item) => {
          const project = projectMap[item.id];
          if (!project) return null;

          const isWip = !!project.wip;

          return (
            <div
              key={item.id}
              className="tableau-cell"
              style={{
                gridColumn: `span ${item.span}`,
                opacity: isWip ? 0.18 : 1,
                filter: isWip ? "grayscale(0.4)" : undefined,
              }}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <TransitionLink
                href={isWip ? "#" : `/work/${project.id}`}
                className="block"
                style={{
                  flex: 1,
                  minHeight: 0,
                  cursor: isWip ? "default" : "pointer",
                }}
              >
                <ProjectCover
                  project={project}
                  index={item.index}
                  isHovered={hoveredId === item.id}
                  isWip={isWip}
                />
              </TransitionLink>
            </div>
          );
        })}
      </div>

      {/* ── Footer ── */}
      <footer
        data-footer
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: "clamp(0.4rem, 0.8vh, 0.6rem)",
        }}
      >
        <span
          className="font-mono uppercase"
          style={{
            fontSize: "8px",
            letterSpacing: "0.12em",
            color: "var(--color-text-ghost)",
          }}
        >
          {PROJECTS.length} Works · {Math.min(...PROJECTS.map(p => parseInt(p.year)))}–{Math.max(...PROJECTS.map(p => parseInt(p.year)))}
        </span>

        <div className="flex items-center gap-4">
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="font-mono uppercase transition-colors duration-300 hover:text-[var(--color-text)]"
            style={{
              fontSize: "9px",
              letterSpacing: "0.1em",
              color: "var(--color-text-ghost)",
            }}
          >
            {CONTACT_EMAIL}
          </a>
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono uppercase transition-colors duration-300 hover:text-[var(--color-text)] hidden sm:inline"
              style={{
                fontSize: "9px",
                letterSpacing: "0.1em",
                color: "var(--color-text-ghost)",
              }}
            >
              {s.label}
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
}
