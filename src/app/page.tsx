"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import { REVEAL_HERO, REVEAL_CARD, REVEAL_CONTENT } from "@/lib/animations";
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
  }, []);

  const allProjects = PROJECTS;

  return (
    <div className="page-container" style={{ position: "relative" }}>
      {/* ── Hero ── */}
      <header
        ref={heroRef}
        style={{
          paddingTop: "clamp(100px, 18vh, 180px)",
          paddingBottom: "clamp(60px, 10vh, 120px)",
          maxWidth: "var(--max-cover)",
        }}
      >
        <p
          data-hero-el
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "clamp(18px, 2.2vw, 24px)",
            lineHeight: 1.6,
            color: "var(--ink-primary)",
            maxWidth: "520px",
            opacity: 0,
          }}
        >
          design engineer building, conceptualizing, designing products and the stories behind them.
        </p>
        <div
          data-hero-el
          className="font-mono"
          style={{
            fontSize: "var(--text-meta)",
            letterSpacing: "var(--tracking-label)",
            textTransform: "uppercase",
            color: "var(--ink-muted)",
            marginTop: "var(--space-standard)",
            display: "flex",
            alignItems: "center",
            gap: "var(--space-small)",
            opacity: 0,
          }}
        >
          <span>New York</span>
          <span style={{ width: 3, height: 3, borderRadius: "50%", backgroundColor: "var(--ink-muted)", flexShrink: 0 }} />
          <span>Open to work</span>
        </div>
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
        <div ref={gridRef} style={{ display: "flex", flexDirection: "column", gap: "var(--space-section)" }}>
          {allProjects.map((project, i) => (
            <Cover key={project.id} project={project} index={i} />
          ))}

          {/* Empty window slots for future projects */}
          {[1, 2].map((n) => (
            <div
              key={`empty-${n}`}
              data-cover
              style={{
                aspectRatio: "16 / 9",
                borderRadius: "6px",
                border: "1px dashed rgba(var(--ink-rgb), 0.08)",
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
                  color: "var(--ink-faint)",
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
