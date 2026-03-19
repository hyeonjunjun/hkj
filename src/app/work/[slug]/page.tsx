"use client";

import { useParams } from "next/navigation";
import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { PROJECTS } from "@/constants/projects";
import { useScrollNavigate } from "@/hooks/useScrollNavigate";
import { useTransitionNavigate } from "@/hooks/useTransitionNavigate";
import TransitionLink from "@/components/TransitionLink";

export default function CaseStudy() {
  const { slug } = useParams();
  const navigate = useTransitionNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollPercent, setScrollPercent] = useState(0);

  const project = PROJECTS.find((p) => p.id === slug);
  const { progress, direction, nextProject, prevProject } =
    useScrollNavigate({ currentSlug: slug as string });

  // Scroll progress indicator
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;
      const scrollY = window.scrollY;
      const pct = Math.round((scrollY / (scrollHeight - clientHeight)) * 100);
      setScrollPercent(Math.max(0, Math.min(pct, 100)));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // GSAP scroll reveals
  const hasAnimated = useRef(false);
  useEffect(() => {
    if (!containerRef.current || hasAnimated.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    hasAnimated.current = true;

    // Image reveals
    const imageEls = containerRef.current.querySelectorAll("[data-media-reveal='image']");
    imageEls.forEach((el, i) => {
      gsap.fromTo(el,
        { opacity: 0, y: 75 },
        { opacity: 1, y: 0, duration: 1.5, delay: i * 0.1, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 75%", once: true } }
      );
    });

    // Video reveals (toned down from scale 2)
    const videoEls = containerRef.current.querySelectorAll("[data-media-reveal='video']");
    videoEls.forEach((el, i) => {
      gsap.fromTo(el,
        { opacity: 0, y: 75, scale: 1.02 },
        { opacity: 1, y: 0, scale: 1, duration: 1.5, delay: i * 0.1, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 75%", once: true } }
      );
    });

    // Text reveals
    const textEls = containerRef.current.querySelectorAll("[data-text-reveal]");
    textEls.forEach((el, i) => {
      gsap.fromTo(el,
        { opacity: 0, y: 5, filter: "blur(4px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.75, delay: i * 0.122, ease: "power3.out" }
      );
    });

    // Role text stagger
    const roleEls = containerRef.current.querySelectorAll("[data-role-reveal]");
    roleEls.forEach((el, i) => {
      gsap.fromTo(el,
        { opacity: 0, y: 5, filter: "blur(4px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.75, delay: i * 0.2, ease: "power3.out" }
      );
    });

    // Section reveals
    const sectionEls = containerRef.current.querySelectorAll("[data-section-reveal]");
    sectionEls.forEach((el) => {
      gsap.fromTo(el,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.2, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 80%", once: true } }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [slug]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        navigate("/works");
        return;
      }

      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        const blocks = Array.from(
          document.querySelectorAll("[data-media-reveal]")
        );
        if (!blocks.length) return;

        const viewportCenter = window.scrollY + window.innerHeight / 2;
        let closestIdx = 0;
        let closestDist = Infinity;
        blocks.forEach((el, idx) => {
          const rect = (el as HTMLElement).getBoundingClientRect();
          const elCenter = window.scrollY + rect.top + rect.height / 2;
          const dist = Math.abs(elCenter - viewportCenter);
          if (dist < closestDist) {
            closestDist = dist;
            closestIdx = idx;
          }
        });

        const targetIdx =
          e.key === "ArrowDown"
            ? Math.min(closestIdx + 1, blocks.length - 1)
            : Math.max(closestIdx - 1, 0);

        blocks[targetIdx]?.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }

      if (e.key === " ") {
        e.preventDefault();
        const videos = document.querySelectorAll("video");
        videos.forEach((v) => {
          const rect = v.getBoundingClientRect();
          if (rect.top < window.innerHeight && rect.bottom > 0) {
            if (v.paused) { v.play(); } else { v.pause(); }
          }
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  if (!project) {
    return (
      <div
        className="w-full h-screen flex items-center justify-center font-mono uppercase"
        style={{
          fontSize: 10,
          letterSpacing: "0.1em",
          color: "var(--color-text-dim)",
        }}
      >
        project not found
      </div>
    );
  }

  // Helper: check if a string has real content
  const has = (s?: string) => s && s.trim().length > 0;

  return (
    <div
      ref={containerRef}
      className="min-h-screen"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      {/* ── Content column ── */}
      <div className="span-w-7 span-ml-2 py-[10vh]">
        {/* ── Project Metadata ── */}
        <div className="mb-16">
          <h1
            className="font-mono uppercase"
            style={{
              fontSize: 10,
              letterSpacing: "0.1em",
              color: "var(--color-text)",
            }}
            data-text-reveal
          >
            {project.title}
          </h1>

          <p
            className="font-mono uppercase mt-4"
            style={{
              fontSize: 10,
              lineHeight: "110%",
              color: "var(--color-text-dim)",
            }}
            data-text-reveal
          >
            {project.pitch}
          </p>

          <div className="flex gap-8 mt-6">
            <div data-role-reveal>
              <span
                className="font-mono uppercase block"
                style={{
                  fontSize: 10,
                  color: "var(--color-text-ghost)",
                  marginBottom: "4px",
                }}
              >
                Role
              </span>
              <span
                className="font-mono uppercase"
                style={{
                  fontSize: 10,
                  color: "var(--color-text-dim)",
                }}
              >
                {project.role}
              </span>
            </div>

            <div data-role-reveal>
              <span
                className="font-mono uppercase block"
                style={{
                  fontSize: 10,
                  color: "var(--color-text-ghost)",
                  marginBottom: "4px",
                }}
              >
                Year
              </span>
              <span
                className="font-mono uppercase"
                style={{
                  fontSize: 10,
                  color: "var(--color-text-dim)",
                }}
              >
                {project.year}
              </span>
            </div>

            <div data-role-reveal>
              <span
                className="font-mono uppercase block"
                style={{
                  fontSize: 10,
                  color: "var(--color-text-ghost)",
                  marginBottom: "4px",
                }}
              >
                Sector
              </span>
              <span
                className="font-mono uppercase"
                style={{
                  fontSize: 10,
                  color: "var(--color-text-dim)",
                }}
              >
                {project.sector}
              </span>
            </div>
          </div>
        </div>

        {/* ── Narrative Lede ── */}
        {(has(project.paradox) || has(project.stakes)) && (
          <div className="mb-16" data-section-reveal>
            {has(project.paradox) && (
              <p
                className="font-display italic"
                style={{
                  fontSize: "var(--text-h2)",
                  lineHeight: 1.4,
                  color: "var(--color-text)",
                  maxWidth: "58ch",
                  marginBottom: has(project.stakes) ? "1.5rem" : 0,
                }}
              >
                {project.paradox}
              </p>
            )}
            {has(project.stakes) && (
              <p
                className="font-sans"
                style={{
                  fontSize: "var(--text-body)",
                  lineHeight: 1.7,
                  color: "var(--color-text-secondary)",
                  maxWidth: "58ch",
                }}
              >
                {project.stakes}
              </p>
            )}
          </div>
        )}

        {/* ── Editorial Section ── */}
        {has(project.editorial.copy) && (
          <div className="mb-16" data-section-reveal>
            {has(project.editorial.headline) && (
              <h2
                className="font-display"
                style={{
                  fontSize: "var(--text-h2)",
                  fontWeight: 400,
                  color: "var(--color-text)",
                  marginBottom: "1rem",
                }}
              >
                {project.editorial.headline}
              </h2>
            )}
            {has(project.editorial.subhead) && (
              <p
                className="font-mono uppercase"
                style={{
                  fontSize: "var(--text-micro)",
                  letterSpacing: "0.1em",
                  color: "var(--color-text-ghost)",
                  marginBottom: "1rem",
                }}
              >
                {project.editorial.subhead}
              </p>
            )}
            <p
              className="font-sans"
              style={{
                fontSize: "var(--text-body)",
                lineHeight: 1.7,
                color: "var(--color-text-secondary)",
                maxWidth: "58ch",
              }}
            >
              {project.editorial.copy}
            </p>

            {/* Editorial images */}
            {project.editorial.images.length > 0 && (
              <div className="flex flex-col gap-8 mt-8">
                {project.editorial.images.map((img, i) => (
                  <div
                    key={i}
                    className="relative w-full overflow-hidden"
                    style={{ aspectRatio: "16/10" }}
                    data-media-reveal="image"
                  >
                    <Image
                      src={img}
                      alt={`${project.title} — editorial ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 95vw, 57vw"
                      quality={90}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Process Steps ── */}
        {project.processSteps && project.processSteps.length > 0 && (
          <div className="mb-16" data-section-reveal>
            <h2
              className="font-mono uppercase"
              style={{
                fontSize: "var(--text-micro)",
                letterSpacing: "0.1em",
                color: "var(--color-text-ghost)",
                marginBottom: "2rem",
              }}
            >
              Process
            </h2>
            <div className="flex flex-col gap-10">
              {project.processSteps.map((step, i) => (
                <div key={i} className="flex flex-col gap-4">
                  <div>
                    <span
                      className="font-mono"
                      style={{
                        fontSize: 10,
                        color: "var(--color-text-ghost)",
                        marginRight: "0.75rem",
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className="font-sans"
                      style={{
                        fontSize: "var(--text-body)",
                        fontWeight: 500,
                        color: "var(--color-text)",
                      }}
                    >
                      {step.title}
                    </span>
                  </div>
                  {has(step.copy) && (
                    <p
                      className="font-sans"
                      style={{
                        fontSize: "var(--text-small)",
                        lineHeight: 1.7,
                        color: "var(--color-text-secondary)",
                        maxWidth: "58ch",
                        paddingLeft: "2.5rem",
                      }}
                    >
                      {step.copy}
                    </p>
                  )}
                  {step.image && (
                    <div
                      className="relative w-full overflow-hidden"
                      style={{ aspectRatio: "4/3" }}
                      data-media-reveal="image"
                    >
                      <Image
                        src={step.image}
                        alt={`${project.title} — ${step.title}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 95vw, 57vw"
                        quality={90}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Highlights ── */}
        {project.highlights.length > 0 && (
          <div className="mb-16" data-section-reveal>
            <h2
              className="font-mono uppercase"
              style={{
                fontSize: "var(--text-micro)",
                letterSpacing: "0.1em",
                color: "var(--color-text-ghost)",
                marginBottom: "2rem",
              }}
            >
              Key Details
            </h2>
            <div className="flex flex-col gap-12">
              {project.highlights.map((hl) => (
                <div key={hl.id}>
                  <h3
                    className="font-sans"
                    style={{
                      fontSize: "var(--text-body)",
                      fontWeight: 500,
                      color: "var(--color-text)",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {hl.title}
                  </h3>
                  <p
                    className="font-sans"
                    style={{
                      fontSize: "var(--text-small)",
                      lineHeight: 1.7,
                      color: "var(--color-text-secondary)",
                      maxWidth: "58ch",
                    }}
                  >
                    {hl.description}
                  </p>
                  {has(hl.challenge) && (
                    <p
                      className="font-display italic mt-4"
                      style={{
                        fontSize: "var(--text-small)",
                        lineHeight: 1.5,
                        color: "var(--color-text-dim)",
                        maxWidth: "58ch",
                        paddingLeft: "1rem",
                        borderLeft: "1px solid rgba(var(--color-text-rgb), 0.06)",
                      }}
                    >
                      {hl.challenge}
                    </p>
                  )}
                  {has(hl.recipe) && (
                    <p
                      className="font-mono mt-3"
                      style={{
                        fontSize: "10px",
                        letterSpacing: "0.05em",
                        color: "var(--color-text-ghost)",
                      }}
                    >
                      {hl.recipe}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Engineering ── */}
        {has(project.engineering.copy) && (
          <div className="mb-16" data-section-reveal>
            <h2
              className="font-mono uppercase"
              style={{
                fontSize: "var(--text-micro)",
                letterSpacing: "0.1em",
                color: "var(--color-text-ghost)",
                marginBottom: "1rem",
              }}
            >
              Engineering
            </h2>
            <p
              className="font-sans"
              style={{
                fontSize: "var(--text-small)",
                lineHeight: 1.7,
                color: "var(--color-text-secondary)",
                maxWidth: "58ch",
              }}
            >
              {project.engineering.copy}
            </p>
            {project.engineering.signals.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {project.engineering.signals.map((signal) => (
                  <span
                    key={signal}
                    className="font-mono uppercase"
                    style={{
                      fontSize: 10,
                      letterSpacing: "0.1em",
                      color: "var(--color-text-dim)",
                      padding: "3px 8px",
                      border: "1px solid rgba(var(--color-text-rgb), 0.06)",
                    }}
                  >
                    {signal}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Videos ── */}
        {project.videos && project.videos.length > 0 && (
          <div className="flex flex-col gap-8 mb-16">
            {project.videos.map((video, i) => (
              <div key={i} data-media-reveal="video">
                <div
                  className="relative w-full overflow-hidden"
                  style={{ aspectRatio: video.aspect || "16/9" }}
                >
                  <video
                    src={video.src}
                    poster={video.poster}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                  />
                </div>
                {has(video.caption) && (
                  <p
                    className="font-mono mt-2"
                    style={{
                      fontSize: 10,
                      letterSpacing: "0.05em",
                      color: "var(--color-text-ghost)",
                    }}
                  >
                    {video.caption}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── Statistics ── */}
        {project.statistics.length > 0 && (
          <div className="mb-16" data-section-reveal>
            <div className="flex gap-8 flex-wrap">
              {project.statistics.map((stat) => (
                <div key={stat.label}>
                  <span
                    className="font-mono uppercase block"
                    style={{
                      fontSize: 10,
                      letterSpacing: "0.1em",
                      color: "var(--color-text-ghost)",
                      marginBottom: "4px",
                    }}
                  >
                    {stat.label}
                  </span>
                  <span
                    className="font-mono"
                    style={{
                      fontSize: "var(--text-body)",
                      color: "var(--color-text)",
                    }}
                  >
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Gut Punch (closing statement) ── */}
        {has(project.gutPunch) && (
          <div className="mb-16" data-section-reveal>
            <p
              className="font-display italic"
              style={{
                fontSize: "var(--text-h2)",
                lineHeight: 1.4,
                color: "var(--color-text)",
                maxWidth: "48ch",
              }}
            >
              {project.gutPunch}
            </p>
          </div>
        )}

        {/* ── Schematic / Technical Colophon ── */}
        {project.schematic && project.schematic.stack.length > 0 && (
          <div className="mb-16" data-section-reveal>
            <h2
              className="font-mono uppercase"
              style={{
                fontSize: "var(--text-micro)",
                letterSpacing: "0.1em",
                color: "var(--color-text-ghost)",
                marginBottom: "1rem",
              }}
            >
              Stack
            </h2>
            <div className="flex flex-wrap gap-2">
              {project.schematic.stack.map((item) => (
                <span
                  key={item}
                  className="font-mono"
                  style={{
                    fontSize: "10px",
                    color: "var(--color-text-dim)",
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
            {has(project.schematic.typography) && (
              <p
                className="font-mono mt-3"
                style={{
                  fontSize: "10px",
                  color: "var(--color-text-ghost)",
                }}
              >
                Type: {project.schematic.typography}
              </p>
            )}
          </div>
        )}

        {/* ── Contributors ── */}
        {project.contributors.length > 0 && (
          <div className="mb-16" data-section-reveal>
            <h2
              className="font-mono uppercase"
              style={{
                fontSize: "var(--text-micro)",
                letterSpacing: "0.1em",
                color: "var(--color-text-ghost)",
                marginBottom: "0.75rem",
              }}
            >
              Credits
            </h2>
            {project.contributors.map((c) => (
              <p
                key={c.name}
                className="font-mono"
                style={{
                  fontSize: "10px",
                  color: "var(--color-text-dim)",
                }}
              >
                {c.name} — {c.role}
              </p>
            ))}
          </div>
        )}
      </div>

      {/* ── Scroll progress ── */}
      <div
        className="fixed bottom-0 right-0 padding-x-1"
        style={{
          paddingBottom: "clamp(1rem, 2vh, 1.5rem)",
        }}
      >
        <span
          className="font-mono"
          style={{
            fontSize: 10,
            letterSpacing: "0.1em",
            color: "var(--color-text-ghost)",
          }}
        >
          {scrollPercent} %
        </span>
      </div>

      {/* ── Scroll-to-navigate progress bar ── */}
      {progress > 0 && direction && (
        <div
          className="fixed left-0 right-0 flex items-center justify-center"
          style={{
            [direction === "next" ? "bottom" : "top"]: "2rem",
          }}
        >
          <div className="flex items-center gap-3">
            <div
              style={{
                width: 120,
                height: 2,
                backgroundColor: "rgba(var(--color-text-rgb), 0.06)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${progress}%`,
                  height: "100%",
                  backgroundColor: "var(--color-text-dim)",
                  transition: "width 100ms linear",
                }}
              />
            </div>
            <span
              className="font-mono uppercase"
              style={{
                fontSize: 10,
                color: "var(--color-text-ghost)",
              }}
            >
              {direction === "next"
                ? nextProject?.title
                : prevProject?.title}
            </span>
          </div>
        </div>
      )}

      {/* ── Mobile nav buttons (< 768px) ── */}
      <div
        className="md:hidden padding-x-1 pb-8 flex justify-between"
      >
        {prevProject && (
          <TransitionLink
            href={`/work/${prevProject.id}`}
            className="font-mono uppercase"
            style={{
              fontSize: 10,
              color: "var(--color-text-dim)",
              letterSpacing: "0.1em",
            }}
          >
            ← {prevProject.title}
          </TransitionLink>
        )}
        {nextProject && (
          <TransitionLink
            href={`/work/${nextProject.id}`}
            className="font-mono uppercase ml-auto"
            style={{
              fontSize: 10,
              color: "var(--color-text-dim)",
              letterSpacing: "0.1em",
            }}
          >
            {nextProject.title} →
          </TransitionLink>
        )}
      </div>
    </div>
  );
}
