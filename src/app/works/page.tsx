"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import TransitionLink from "@/components/TransitionLink";
import { PROJECTS } from "@/constants/projects";

/**
 * Works — Comprehensive catalog of all projects.
 */
export default function WorksPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const els = containerRef.current.querySelectorAll("[data-reveal]");
    gsap.fromTo(
      els,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.06,
        ease: "power3.out",
      }
    );
  }, []);

  const active = PROJECTS.filter((p) => !p.wip);
  const upcoming = PROJECTS.filter((p) => p.wip);

  return (
    <main
      ref={containerRef}
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--color-bg)",
        paddingTop: "clamp(6rem, 12vh, 10rem)",
        paddingBottom: "var(--section-py)",
      }}
    >
      {/* Header */}
      <div
        className="section-padding"
        style={{ marginBottom: "clamp(3rem, 6vh, 5rem)" }}
      >
        <h1
          className="font-display italic"
          style={{
            fontSize: "var(--text-display)",
            color: "var(--color-text)",
            lineHeight: 1.1,
          }}
          data-reveal
        >
          Work
        </h1>
        <p
          style={{
            fontSize: "var(--text-body)",
            color: "var(--color-text-dim)",
            marginTop: "0.75rem",
            maxWidth: "40ch",
          }}
          data-reveal
        >
          Selected projects in design engineering, material science, and mobile.
        </p>
      </div>

      {/* Active projects */}
      <div className="section-padding">
        {active.map((project, i) => (
          <TransitionLink
            key={project.id}
            href={`/work/${project.id}`}
            className="block group"
            data-reveal
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "clamp(1.5rem, 3vw, 3rem)",
              alignItems: "center",
              paddingTop: i === 0 ? 0 : "clamp(2rem, 4vh, 3rem)",
              paddingBottom: "clamp(2rem, 4vh, 3rem)",
              borderBottom: "1px solid var(--color-border)",
            }}
          >
            {/* Media */}
            <div
              className="relative overflow-hidden"
              style={{ aspectRatio: "16/10" }}
            >
              {project.cardVideo ? (
                <video
                  src={project.cardVideo}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                />
              ) : (
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                  sizes="45vw"
                  quality={90}
                />
              )}
            </div>

            {/* Info */}
            <div>
              <h2
                className="font-display italic"
                style={{
                  fontSize: "var(--text-h2)",
                  color: "var(--color-text)",
                  lineHeight: 1.15,
                }}
              >
                {project.title}
              </h2>
              <span
                className="font-mono uppercase block"
                style={{
                  fontSize: "10px",
                  letterSpacing: "0.12em",
                  color: "var(--color-text-ghost)",
                  marginTop: "0.5rem",
                }}
              >
                {project.role} · {project.sector} · {project.year}
              </span>
              <p
                className="font-sans"
                style={{
                  fontSize: "var(--text-small)",
                  color: "var(--color-text-dim)",
                  lineHeight: 1.6,
                  marginTop: "0.75rem",
                  maxWidth: "36ch",
                }}
              >
                {project.pitch}
              </p>
            </div>
          </TransitionLink>
        ))}
      </div>

      {/* WIP projects */}
      {upcoming.length > 0 && (
        <div
          className="section-padding"
          style={{ marginTop: "clamp(3rem, 6vh, 5rem)" }}
        >
          <span
            className="font-mono uppercase block"
            style={{
              fontSize: "10px",
              letterSpacing: "0.15em",
              color: "var(--color-text-ghost)",
              marginBottom: "clamp(1.5rem, 3vh, 2rem)",
            }}
            data-reveal
          >
            Coming Soon
          </span>

          {upcoming.map((project) => (
            <div
              key={project.id}
              data-reveal
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1.5rem",
                paddingBottom: "clamp(1rem, 2vh, 1.5rem)",
                opacity: 0.5,
              }}
            >
              <div
                className="relative overflow-hidden shrink-0"
                style={{ width: "clamp(80px, 8vw, 120px)", aspectRatio: "4/3" }}
              >
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover"
                  sizes="10vw"
                />
              </div>
              <div>
                <span
                  className="font-display italic"
                  style={{
                    fontSize: "var(--text-body)",
                    color: "var(--color-text-dim)",
                  }}
                >
                  {project.title}
                </span>
                <span
                  className="font-mono uppercase block"
                  style={{
                    fontSize: "10px",
                    letterSpacing: "0.1em",
                    color: "var(--color-text-ghost)",
                    marginTop: "0.2rem",
                  }}
                >
                  {project.sector} · {project.year}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
