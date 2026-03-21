"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import TransitionLink from "@/components/TransitionLink";
import { gsap } from "@/lib/gsap";
import { REVEAL_MEDIA } from "@/lib/animations";
import { PROJECTS } from "@/constants/projects";

const visibleProjects = PROJECTS.filter((p) => !p.wip);

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    if (heroRef.current) {
      const els = heroRef.current.querySelectorAll("[data-hero-el]");
      gsap.fromTo(
        els,
        { opacity: 0, y: 12 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.06,
          ease: "expo.out",
          delay: 0.15,
        }
      );
    }

    if (gridRef.current) {
      const cards = gridRef.current.querySelectorAll("[data-project-card]");
      gsap.fromTo(cards, REVEAL_MEDIA.from, { ...REVEAL_MEDIA.to });
    }
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        paddingTop: "var(--page-pt-home)",
        paddingBottom: "var(--row-py)",
      }}
    >
      {/* ── Hero ── */}
      <header
        ref={heroRef}
        className="section-padding"
        style={{ marginBottom: "clamp(4rem, 8vh, 7rem)" }}
      >
        <h1
          data-hero-el
          className="font-display italic"
          style={{
            fontSize: "clamp(2.2rem, 4vw, 3.6rem)",
            fontWeight: 400,
            color: "var(--color-text)",
            lineHeight: "var(--leading-tight)",
            letterSpacing: "var(--tracking-tight)",
            maxWidth: "18ch",
          }}
        >
          Design engineering practice
        </h1>
        <p
          data-hero-el
          className="font-sans"
          style={{
            fontSize: "var(--text-body)",
            color: "var(--color-text-secondary)",
            marginTop: "clamp(1rem, 2vh, 1.5rem)",
            letterSpacing: "var(--tracking-snug)",
            lineHeight: "var(--leading-relaxed)",
            maxWidth: "38ch",
          }}
        >
          Building products that feel considered — from system
          design to pixel-level detail.
        </p>

        <div
          data-hero-el
          style={{
            display: "flex",
            gap: "1.5rem",
            alignItems: "center",
            marginTop: "clamp(1.5rem, 3vh, 2.5rem)",
          }}
        >
          <span
            className="font-mono uppercase"
            style={{
              fontSize: "var(--text-micro)",
              letterSpacing: "var(--tracking-wider)",
              color: "var(--color-text-dim)",
            }}
          >
            New York / Seoul
          </span>
          <span
            style={{
              width: 3,
              height: 3,
              borderRadius: "50%",
              backgroundColor: "var(--color-warm)",
              flexShrink: 0,
            }}
          />
          <span
            className="font-mono uppercase"
            style={{
              fontSize: "var(--text-micro)",
              letterSpacing: "var(--tracking-wider)",
              color: "var(--color-text-dim)",
            }}
          >
            Available for select projects
          </span>
        </div>
      </header>

      {/* ── Selected Work label ── */}
      <div
        className="section-padding"
        style={{ marginBottom: "clamp(1.5rem, 3vh, 2.5rem)" }}
      >
        <span
          data-hero-el
          className="font-mono uppercase"
          style={{
            fontSize: "var(--text-micro)",
            letterSpacing: "var(--tracking-wider)",
            color: "var(--color-text-ghost)",
          }}
        >
          Selected Work
        </span>
      </div>

      {/* ── Project Grid ── */}
      <div
        ref={gridRef}
        className="section-padding"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "clamp(1.5rem, 3vw, 2.5rem)",
        }}
      >
        {visibleProjects.map((project) => (
          <TransitionLink
            key={project.id}
            href={`/work/${project.id}`}
            data-project-card
            style={{ visibility: "hidden", display: "block" }}
          >
            <article
              style={{
                backgroundColor: "var(--color-surface)",
                borderRadius: "4px",
                overflow: "hidden",
              }}
            >
              {/* Cover image */}
              <div
                className="card-image"
                style={{
                  aspectRatio:
                    project.cardFormat === "portrait" ? "3/4" : "16/10",
                  position: "relative",
                  backgroundColor:
                    project.cover?.bg ?? "var(--color-elevated)",
                  overflow: "hidden",
                }}
              >
                {project.image ? (
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 767px) 100vw, 50vw"
                    quality={85}
                  />
                ) : null}
              </div>

              {/* Card meta */}
              <div style={{ padding: "1rem 1.25rem 1.25rem" }}>
                <div
                  className="flex items-center justify-between"
                  style={{ marginBottom: "0.25rem" }}
                >
                  <span
                    className="font-mono uppercase"
                    style={{
                      fontSize: "var(--text-micro)",
                      letterSpacing: "var(--tracking-wider)",
                      color: "var(--color-text-dim)",
                    }}
                  >
                    {project.sector}
                  </span>
                  <span
                    className="font-mono"
                    style={{
                      fontSize: "var(--text-micro)",
                      color: "var(--color-text-dim)",
                    }}
                  >
                    {project.year}
                  </span>
                </div>
                <h2
                  className="font-display"
                  style={{
                    fontSize: "var(--text-h3)",
                    color: "var(--color-text)",
                    lineHeight: "var(--leading-snug)",
                  }}
                >
                  {project.title}
                </h2>
                <p
                  style={{
                    fontSize: "var(--text-small)",
                    color: "var(--color-text-secondary)",
                    marginTop: "0.35rem",
                    lineHeight: 1.5,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {project.pitch}
                </p>
              </div>
            </article>
          </TransitionLink>
        ))}
      </div>

      {/* ── Coddiwomple Teaser ── */}
      <section
        className="section-padding"
        style={{
          marginTop: "clamp(4rem, 10vh, 8rem)",
          paddingTop: "2rem",
          borderTop: "1px solid var(--color-border)",
        }}
      >
        <div className="flex items-end justify-between">
          <div>
            <h2
              className="font-display italic"
              style={{
                fontSize: "var(--text-h2)",
                color: "var(--color-text)",
                lineHeight: "var(--leading-tight)",
              }}
            >
              Coddiwomple
            </h2>
            <p
              style={{
                fontSize: "var(--text-body)",
                color: "var(--color-text-secondary)",
                marginTop: "0.4rem",
                maxWidth: "38ch",
              }}
            >
              Visual studies, material research, and things that caught the
              light.
            </p>
          </div>
          <TransitionLink
            href="/coddiwomple"
            className="font-mono uppercase link-dim"
            style={{
              fontSize: "var(--text-micro)",
              letterSpacing: "var(--tracking-wider)",
              flexShrink: 0,
              marginLeft: "2rem",
            }}
          >
            View all &rarr;
          </TransitionLink>
        </div>
      </section>
    </main>
  );
}
