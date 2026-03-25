"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import { PROJECTS } from "@/constants/projects";
import { Cover } from "@/components/Cover";

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    if (heroRef.current) {
      const els = heroRef.current.querySelectorAll("[data-hero-el]");
      gsap.fromTo(
        els,
        { opacity: 0, y: 14 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: "expo.out",
          delay: 0.15,
        }
      );

    }

    if (gridRef.current) {
      const cards = gridRef.current.querySelectorAll("[data-cover]");
      gsap.fromTo(
        cards,
        { autoAlpha: 0, y: 32 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "expo.out",
          delay: 0.6,
        }
      );
    }

    if (sectionsRef.current) {
      const sections = sectionsRef.current.querySelectorAll("[data-reveal]");
      sections.forEach((section) => {
        gsap.fromTo(
          section,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "expo.out",
            scrollTrigger: {
              trigger: section,
              start: "top 88%",
              once: true,
            },
          }
        );
      });
    }
  }, []);

  const imageProjects = PROJECTS.filter((p) => p.coverImage);
  const wipProjects = PROJECTS.filter((p) => !p.coverImage);

  return (
    <div className="page-container">

      {/* ── Hero ── */}
      <header
        ref={heroRef}
        style={{
          paddingTop: "var(--space-break)",
          marginBottom: "clamp(3rem, 8vh, 5rem)",
          maxWidth: "var(--max-cover)",
        }}
      >

      </header>

      {/* ── Work ── */}
      <section id="work" style={{ maxWidth: "var(--max-cover)" }}>
        <span
          className="font-mono"
          style={{
            fontSize: "var(--text-meta)",
            letterSpacing: "var(--tracking-label)",
            textTransform: "uppercase",
            color: "var(--ink-muted)",
            display: "block",
            marginBottom: "var(--space-comfortable)",
          }}
        >
          Selected work
        </span>
        <div ref={gridRef} className="cover-grid">
          {imageProjects.map((project, i) => (
            <Cover key={project.id} project={project} index={i} />
          ))}
        </div>

        {/* WIP projects — text-only below the image covers */}
        {wipProjects.length > 0 && (
          <div
            style={{
              marginTop: 80,
              borderTop: "1px solid rgba(var(--ink-rgb), 0.08)",
              paddingTop: "var(--space-comfortable)",
            }}
          >
            {wipProjects.map((project) => (
              <div
                key={project.id}
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "var(--space-small)",
                  paddingTop: "var(--space-compact)",
                  paddingBottom: "var(--space-compact)",
                }}
              >
                <div style={{ display: "flex", alignItems: "baseline", gap: "var(--space-standard)" }}>
                  <span
                    className="font-display"
                    style={{
                      fontSize: "var(--text-body)",
                      color: "var(--ink-primary)",
                    }}
                  >
                    {project.title}
                  </span>
                  <span
                    style={{
                      fontSize: "var(--text-body)",
                      color: "var(--ink-secondary)",
                    }}
                  >
                    {project.description}
                  </span>
                </div>
                <span
                  className="font-mono"
                  style={{
                    fontSize: "var(--text-meta)",
                    letterSpacing: "var(--tracking-label)",
                    textTransform: "uppercase",
                    color: "var(--ink-muted)",
                    flexShrink: 0,
                  }}
                >
                  In progress
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Below-fold content ── */}
      <div ref={sectionsRef}>
        <section
          data-reveal
          style={{
            maxWidth: "var(--max-cover)",
            paddingTop: "var(--space-breath)",
            paddingBottom: "var(--space-breath)",
            borderTop: "1px solid rgba(var(--ink-rgb), 0.08)",
            marginTop: "var(--space-breath)",
            opacity: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "var(--space-small)",
            }}
          >
            <div style={{ display: "flex", alignItems: "baseline", gap: "var(--space-standard)" }}>
              <h2
                className="font-display"
                style={{
                  fontSize: "var(--text-body)",
                  fontStyle: "italic",
                  color: "var(--ink-full)",
                }}
              >
                Exploration
              </h2>
              <span
                style={{
                  fontSize: "var(--text-body)",
                  color: "var(--ink-secondary)",
                }}
              >
                texture studies, generative work, and other small things.
              </span>
            </div>
            <Link
              href="/exploration"
              className="font-mono hover-step-muted"
              style={{
                fontSize: "var(--text-meta)",
                letterSpacing: "var(--tracking-label)",
                textTransform: "uppercase",
                flexShrink: 0,
              }}
            >
              View all &rarr;
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
