"use client";

import { useRef, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { gsap } from "@/lib/gsap";
import { REVEAL_HERO, REVEAL_CARD, REVEAL_CONTENT } from "@/lib/animations";
import { PROJECTS } from "@/constants/projects";
import { Cover } from "@/components/Cover";
import TransitionLink from "@/components/TransitionLink";
import { useStudioStore } from "@/lib/store";
import { NOW_TEXT } from "@/constants/now";

const Vinyl = dynamic(() => import("@/components/Vinyl"), { ssr: false });
const KineticText = dynamic(() => import("@/components/KineticText"), { ssr: false });

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<HTMLDivElement>(null);
  const loaded = useStudioStore((s) => s.loaded);
  const [hoveredProjectId, setHoveredProjectId] = useState<string | null>(null);

  useEffect(() => {
    if (!loaded) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    if (heroRef.current) {
      const els = heroRef.current.querySelectorAll("[data-hero-el]");
      gsap.fromTo(els, REVEAL_HERO.from, { ...REVEAL_HERO.to, delay: 0.15 });
    }

    if (gridRef.current) {
      const cards = gridRef.current.querySelectorAll("[data-cover]");
      gsap.fromTo(cards, REVEAL_CARD.from, { ...REVEAL_CARD.to, delay: 0.3 });
    }

    if (sectionsRef.current) {
      const sections = sectionsRef.current.querySelectorAll("[data-reveal]");
      sections.forEach((section) => {
        gsap.fromTo(section, REVEAL_CONTENT.from, {
          ...REVEAL_CONTENT.to,
          scrollTrigger: { trigger: section, start: "top 85%", once: true },
        });
      });
    }
  }, [loaded]);

  const allProjects = PROJECTS;

  return (
    <div className="page-container" style={{ position: "relative" }}>
      {/* ── Hero ── */}
      <header
        ref={heroRef}
        style={{
          paddingTop: "clamp(120px, 22vh, 220px)",
          paddingBottom: "clamp(60px, 12vh, 120px)",
          maxWidth: "var(--max-cover)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "var(--space-break)",
        }}
      >
        <div
          data-hero-el
          style={{
            opacity: 0,
            position: "relative",
          }}
        >
          {/* Warm halo behind the vinyl */}
          <div style={{
            position: "absolute",
            inset: "-40%",
            background: "radial-gradient(circle, rgba(200, 160, 80, 0.06) 0%, transparent 70%)",
            pointerEvents: "none",
            zIndex: -1,
          }} />
          <Vinyl />
        </div>
        <div data-hero-el style={{ textAlign: "center", opacity: 0 }}>
          <KineticText
            text="the quiet details are the loudest ones."
            className="font-display"
            style={{
              fontStyle: "italic",
              fontSize: "clamp(22px, 3vw, 32px)",
              lineHeight: 1.4,
              color: "var(--ink-primary)",
              maxWidth: "480px",
              margin: "0 auto",
            }}
          />
          <div
            className="font-mono"
            style={{
              fontSize: "var(--text-meta)",
              letterSpacing: "var(--tracking-label)",
              textTransform: "uppercase",
              color: "var(--ink-muted)",
              marginTop: "var(--space-standard)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "var(--space-small)",
            }}
          >
            <span>New York</span>
            <span
              style={{
                width: 3,
                height: 3,
                borderRadius: "50%",
                backgroundColor: "var(--ink-muted)",
              }}
            />
            <span>Open to work</span>
          </div>
        </div>
      </header>

      {/* ── Work ── */}
      <section
        id="work"
        style={{ maxWidth: "var(--max-cover)" }}
        onMouseLeave={() => setHoveredProjectId(null)}
      >
        <div
          ref={gridRef}
          style={{ display: "flex", flexDirection: "column", gap: "clamp(48px, 6vh, 72px)" }}
        >
          {allProjects.map((project, i) => (
            <div
              key={project.id}
              onMouseEnter={() => setHoveredProjectId(project.id)}
            >
              <Cover
                project={project}
                index={i}
                dimmed={hoveredProjectId !== null && hoveredProjectId !== project.id}
              />
            </div>
          ))}

          {/* Empty window slots for future projects */}
          {[1, 2].map((n) => (
            <div
              key={`empty-${n}`}
              data-cover
              style={{
                aspectRatio: "16 / 9",
                borderRadius: "6px",
                border: "1px dashed rgba(var(--ink-rgb), 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                visibility: "hidden",
              }}
            >
              <span
                className="font-mono"
                style={{
                  fontSize: "var(--text-meta)",
                  letterSpacing: "var(--tracking-label)",
                  textTransform: "uppercase",
                  color: "var(--ink-muted)",
                }}
              >
                Coming soon
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Below-fold content ── */}
      <div ref={sectionsRef}>
        {/* Exploration teaser */}
        <section
          data-reveal
          style={{
            maxWidth: "var(--max-cover)",
            paddingTop: "var(--space-section)",
            paddingBottom: "var(--space-section)",
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
            <TransitionLink
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
            </TransitionLink>
          </div>
        </section>

        {/* Now section */}
        <section
          data-reveal
          style={{
            maxWidth: "var(--max-cover)",
            paddingTop: "var(--space-section)",
            opacity: 0,
          }}
        >
          <span
            className="font-mono"
            style={{
              fontSize: "var(--text-meta)",
              letterSpacing: "var(--tracking-label)",
              textTransform: "uppercase",
              color: "var(--ink-muted)",
              display: "block",
              marginBottom: "var(--space-standard)",
            }}
          >
            Now
          </span>
          <p
            style={{
              fontSize: "var(--text-body)",
              color: "var(--ink-secondary)",
              lineHeight: 1.7,
              maxWidth: "54ch",
            }}
          >
            {NOW_TEXT}
          </p>
        </section>
      </div>
    </div>
  );
}
