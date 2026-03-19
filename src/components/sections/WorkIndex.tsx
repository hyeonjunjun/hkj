"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "@/lib/gsap";
import TransitionLink from "@/components/TransitionLink";
import { PROJECTS } from "@/constants/projects";

/**
 * WorkIndex — V6 atomic project list.
 * 10px mono chrome / 15px sans titles, 48px rows, 4px baseline grid.
 */
export default function WorkIndex() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const rows = sectionRef.current.querySelectorAll("[data-row]");
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(
      rows,
      { opacity: 0, y: 4 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.035 },
      0.2,
    );
  }, []);

  return (
    <div
      ref={sectionRef}
      style={{
        minHeight: "100vh",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        paddingTop: 48,
        paddingLeft: "var(--page-px)",
        paddingRight: "var(--page-px)",
        paddingBottom: 48,
      }}
    >
      {/* Section label */}
      <span
        className="font-mono"
        style={{
          fontSize: 10,
          letterSpacing: "0.1em",
          textTransform: "uppercase" as const,
          color: "var(--color-text-ghost)",
          display: "block",
          marginBottom: 24,
        }}
      >
        Work
      </span>

      <nav style={{ width: "100%" }}>
        {PROJECTS.map((project, i) => {
          const isWip = !!project.wip;
          const isActive = activeId === project.id;
          const isFaded = activeId !== null && !isActive;

          return (
            <div
              key={project.id}
              data-row
              onMouseEnter={() => setActiveId(project.id)}
              onMouseLeave={() => setActiveId(null)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                height: 48,
                borderBottom: "1px solid rgba(var(--color-text-rgb), 0.06)",
                cursor: isWip ? "default" : "pointer",
                transition: isFaded
                  ? "opacity 0.45s cubic-bezier(0.4, 0, 0.2, 1)"
                  : "opacity 0.2s cubic-bezier(0, 0, 0.2, 1)",
                opacity: isFaded ? 0.1 : 1,
              }}
            >
              {/* Left: number + title */}
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 12,
                }}
              >
                <span
                  className="font-mono"
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase" as const,
                    color: "var(--color-text-ghost)",
                    minWidth: "2ch",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                {isWip ? (
                  <span
                    className="font-sans"
                    style={{
                      fontSize: 15,
                      fontWeight: 400,
                      letterSpacing: "-0.01em",
                      color: "var(--color-text-ghost)",
                    }}
                  >
                    {project.title}
                  </span>
                ) : (
                  <TransitionLink
                    href={`/work/${project.id}`}
                    className="font-sans"
                    style={{
                      fontSize: 15,
                      fontWeight: 400,
                      letterSpacing: "-0.01em",
                      color: "var(--color-text-secondary)",
                      textDecoration: "none",
                    }}
                  >
                    {project.title}
                  </TransitionLink>
                )}
              </div>

              {/* Right: sector + year */}
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 32,
                }}
              >
                <span
                  className="font-mono"
                  data-sector
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase" as const,
                    color: "var(--color-text-ghost)",
                    whiteSpace: "nowrap",
                    display: "none",
                  }}
                >
                  {project.sector}
                </span>
                <span
                  className="font-mono"
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase" as const,
                    color: "var(--color-text-ghost)",
                    whiteSpace: "nowrap",
                    minWidth: "3ch",
                    textAlign: "right" as const,
                  }}
                >
                  {isWip ? "WIP" : project.year}
                </span>
              </div>
            </div>
          );
        })}
      </nav>

      <style>{`
        @media (min-width: 768px) {
          [data-sector] { display: inline !important; }
        }
      `}</style>
    </div>
  );
}
