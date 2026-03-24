"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import { PROJECTS } from "@/constants/projects";
import { CONTACT_EMAIL, SOCIALS } from "@/constants/contact";
import { Cover } from "@/components/Cover";

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    /* ── Hero: word-by-word stagger ── */
    if (heroRef.current) {
      const words = heroRef.current.querySelectorAll("[data-word]");
      gsap.fromTo(
        words,
        { yPercent: 100, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.04,
          ease: "expo.out",
          delay: 0.15,
        }
      );

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
          delay: 0.4,
        }
      );
    }

    /* ── Grid: stagger reveal ── */
    if (gridRef.current) {
      const cards = gridRef.current.querySelectorAll("[data-cover]");
      gsap.fromTo(
        cards,
        { autoAlpha: 0, y: 32 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: "expo.out",
          delay: 0.6,
        }
      );
    }

    /* ── Below-fold sections: scroll-triggered ── */
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

  const tagline = "Hyeon Jun";

  return (
    <div className="page-container">

      {/* ── Hero ── */}
      <header
        ref={heroRef}
        style={{
          paddingTop: "var(--space-breath)",
          marginBottom: "clamp(3rem, 8vh, 5rem)",
          maxWidth: "var(--max-text)",
        }}
      >
        <h1
          className="font-display"
          style={{
            fontSize: "clamp(2.2rem, 4.5vw, 3.6rem)",
            fontWeight: 400,
            fontStyle: "italic",
            color: "var(--ink-full)",
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
            maxWidth: "16ch",
          }}
        >
          {tagline.split(" ").map((word, i) => (
            <span
              key={i}
              style={{
                display: "inline-block",
                overflow: "hidden",
                verticalAlign: "top",
                paddingBottom: "0.05em",
              }}
            >
              <span
                data-word
                style={{ display: "inline-block", opacity: 0 }}
              >
                {word}
              </span>
              {i < tagline.split(" ").length - 1 && "\u00A0"}
            </span>
          ))}
        </h1>

        <p
          data-hero-el
          style={{
            fontSize: "var(--text-body)",
            color: "var(--ink-secondary)",
            marginTop: "var(--space-standard)",
            lineHeight: "var(--leading-body)",
            maxWidth: "38ch",
            opacity: 0,
          }}
        >
          design engineer building interfaces, systems, and the
          things between them.
        </p>

        <div
          data-hero-el
          style={{
            display: "flex",
            gap: "var(--space-standard)",
            alignItems: "center",
            marginTop: "var(--space-comfortable)",
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
            }}
          >
            New York
          </span>
          <span
            style={{
              width: 3,
              height: 3,
              borderRadius: "50%",
              backgroundColor: "var(--ink-muted)",
              flexShrink: 0,
            }}
          />
          <span
            className="font-mono"
            style={{
              fontSize: "var(--text-meta)",
              letterSpacing: "var(--tracking-label)",
              textTransform: "uppercase",
              color: "var(--ink-muted)",
            }}
          >
            Open to work
          </span>
        </div>
      </header>

      {/* ── Work ── */}
      <section id="work" style={{ maxWidth: "var(--max-cover)" }}>
        <p
          className="font-mono"
          style={{
            fontSize: "var(--text-meta)",
            letterSpacing: "var(--tracking-label)",
            textTransform: "uppercase",
            color: "var(--ink-muted)",
            marginBottom: "var(--space-comfortable)",
          }}
        >
          Work
        </p>
        <div ref={gridRef} className="cover-grid">
          {PROJECTS.map((project, i) => (
            <Cover key={project.id} project={project} index={i} />
          ))}
        </div>
      </section>

      {/* ── Below-fold content ── */}
      <div ref={sectionsRef}>

        {/* ── Exploration Teaser ── */}
        <section
          data-reveal
          style={{
            maxWidth: "var(--max-cover)",
            paddingTop: "var(--space-breath)",
            paddingBottom: "var(--space-section)",
            borderTop: "1px solid rgba(var(--ink-rgb), 0.08)",
            marginTop: "var(--space-breath)",
            opacity: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: "var(--space-break)",
              flexWrap: "wrap",
            }}
          >
            {/* Text + link */}
            <div style={{ flex: "1 1 260px" }}>
              <h2
                className="font-display"
                style={{
                  fontSize: "var(--text-title)",
                  fontStyle: "italic",
                  color: "var(--ink-full)",
                  lineHeight: "var(--leading-display)",
                }}
              >
                Exploration
              </h2>
              <p
                style={{
                  fontSize: "var(--text-body)",
                  color: "var(--ink-secondary)",
                  marginTop: "var(--space-small)",
                  maxWidth: "36ch",
                  lineHeight: "var(--leading-body)",
                }}
              >
                texture studies, generative work, and other small things.
              </p>
              <Link
                href="/exploration"
                className="font-mono hover-step-muted"
                style={{
                  display: "inline-block",
                  fontSize: "var(--text-meta)",
                  letterSpacing: "var(--tracking-label)",
                  textTransform: "uppercase",
                  marginTop: "var(--space-standard)",
                }}
              >
                View all &rarr;
              </Link>
            </div>

            {/* Video preview */}
            <div
              style={{
                flex: "0 0 auto",
                width: "clamp(200px, 30%, 280px)",
                borderRadius: "4px",
                overflow: "hidden",
                position: "relative",
              }}
            >
              <video
                src="/assets/cloudsatsea.mp4"
                autoPlay
                muted
                loop
                playsInline
                style={{
                  display: "block",
                  width: "100%",
                  aspectRatio: "16 / 9",
                  objectFit: "cover",
                  borderRadius: "4px",
                  opacity: 0.85,
                }}
              />
            </div>
          </div>
        </section>

        {/* ── Now ── */}
        <section
          data-reveal
          style={{
            maxWidth: "var(--max-text)",
            paddingBottom: "var(--space-section)",
            opacity: 0,
          }}
        >
          <p
            className="font-mono"
            style={{
              fontSize: "var(--text-meta)",
              letterSpacing: "var(--tracking-label)",
              textTransform: "uppercase",
              color: "var(--ink-muted)",
              marginBottom: "var(--space-standard)",
            }}
          >
            Now
          </p>
          <p
            style={{
              fontSize: "var(--text-body)",
              color: "var(--ink-primary)",
              lineHeight: "var(--leading-body)",
            }}
          >
            finishing conductor, a design system for product surfaces.
            exploring material typography on the side. open to new work.
          </p>
        </section>

        {/* ── Contact ── */}
        <section
          data-reveal
          style={{
            maxWidth: "var(--max-text)",
            paddingBottom: "var(--space-breath)",
            opacity: 0,
          }}
        >
          <p
            className="font-mono"
            style={{
              fontSize: "var(--text-meta)",
              letterSpacing: "var(--tracking-label)",
              textTransform: "uppercase",
              color: "var(--ink-muted)",
              marginBottom: "var(--space-standard)",
            }}
          >
            Contact
          </p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="font-display hover-step"
            style={{
              fontSize: "var(--text-title)",
              lineHeight: "var(--leading-display)",
              display: "block",
              marginBottom: "var(--space-standard)",
            }}
          >
            {CONTACT_EMAIL}
          </a>
          <div style={{ display: "flex", gap: "var(--space-comfortable)", flexWrap: "wrap" }}>
            {SOCIALS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono hover-step-muted"
                style={{
                  fontSize: "var(--text-meta)",
                  letterSpacing: "var(--tracking-label)",
                  textTransform: "uppercase",
                }}
              >
                {social.label}
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
