"use client";

import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";
import { REVEAL_HERO, REVEAL_CONTENT } from "@/lib/animations";
import { PROJECTS } from "@/constants/projects";
import { NOW_TEXT } from "@/constants/now";
import { useStudioStore } from "@/lib/store";
import TransitionLink from "@/components/TransitionLink";
import { Cover } from "@/components/Cover";

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<HTMLDivElement>(null);
  const loaded = useStudioStore((s) => s.loaded);

  useEffect(() => {
    if (!loaded) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    if (heroRef.current) {
      const els = heroRef.current.querySelectorAll("[data-hero-el]");
      gsap.fromTo(els, REVEAL_HERO.from, { ...REVEAL_HERO.to, delay: 0.2 });
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

  return (
    <div className="page-container">
      {/* Hero */}
      <header
        ref={heroRef}
        style={{
          paddingTop: "var(--space-breath)",
          paddingBottom: "var(--space-section)",
          maxWidth: "var(--max-cover)",
        }}
      >
        <p
          data-hero-el
          className="font-display"
          style={{
            fontStyle: "italic",
            fontSize: "clamp(22px, 3vw, 32px)",
            lineHeight: 1.35,
            color: "var(--ink-primary)",
            maxWidth: "520px",
            opacity: 0,
          }}
        >
          design engineering studio building interfaces, systems, and the quiet details between them.
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
          <span style={{ width: 3, height: 3, borderRadius: "50%", backgroundColor: "var(--ink-muted)" }} />
          <span>Open to work</span>
        </div>
      </header>

      {/* Work */}
      <section id="work" style={{ maxWidth: "var(--max-cover)" }}>
        <div
          style={{ display: "flex", flexDirection: "column", gap: "clamp(48px, 6vh, 72px)" }}
        >
          {PROJECTS.map((project, i) => (
            <Cover key={project.id} project={project} index={i} />
          ))}
        </div>
      </section>

      {/* Below fold */}
      <div ref={sectionsRef}>
        {/* Exploration */}
        <section
          data-reveal
          style={{
            maxWidth: "var(--max-cover)",
            paddingTop: "var(--space-section)",
            paddingBottom: "var(--space-section)",
            borderTop: "1px solid rgba(var(--ink-rgb), 0.06)",
            marginTop: "var(--space-section)",
            opacity: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: "var(--space-small)" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: "var(--space-standard)" }}>
              <h2 className="font-display" style={{ fontSize: "var(--text-body)", fontStyle: "italic", color: "var(--ink-full)" }}>
                Exploration
              </h2>
              <span style={{ fontSize: "var(--text-body)", color: "var(--ink-secondary)" }}>
                texture studies, generative work, and other small things.
              </span>
            </div>
            <TransitionLink
              href="/exploration"
              className="font-mono hover-step-muted"
              data-link
              style={{ fontSize: "var(--text-meta)", letterSpacing: "var(--tracking-label)", textTransform: "uppercase", flexShrink: 0 }}
            >
              View all &rarr;
            </TransitionLink>
          </div>
        </section>

        {/* Now */}
        <section
          data-reveal
          style={{
            maxWidth: "var(--max-cover)",
            paddingTop: "var(--space-section)",
            paddingBottom: "var(--space-breath)",
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
          <p style={{ fontSize: "var(--text-body)", color: "var(--ink-secondary)", lineHeight: 1.7, maxWidth: "54ch" }}>
            {NOW_TEXT}
          </p>
        </section>
      </div>
    </div>
  );
}
