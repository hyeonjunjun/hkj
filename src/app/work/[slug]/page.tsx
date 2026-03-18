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

  // GSAP scroll reveals for media (spec Section 7.4)
  const hasAnimated = useRef(false);
  useEffect(() => {
    if (!containerRef.current || hasAnimated.current) return;
    hasAnimated.current = true;

    // Image reveals: opacity + y
    const imageEls = containerRef.current.querySelectorAll("[data-media-reveal='image']");
    imageEls.forEach((el, i) => {
      gsap.fromTo(el,
        { opacity: 0, y: 75 },
        { opacity: 1, y: 0, duration: 1.5, delay: i * 0.1, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 75%", once: true } }
      );
    });

    // Video reveals: opacity + y + scale (spec: scale 2→1)
    const videoEls = containerRef.current.querySelectorAll("[data-media-reveal='video']");
    videoEls.forEach((el, i) => {
      gsap.fromTo(el,
        { opacity: 0, y: 75, scale: 2 },
        { opacity: 1, y: 0, scale: 1, duration: 1.5, delay: i * 0.1, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 75%", once: true } }
      );
    });

    // Text reveals (spec Section 7.5)
    const textEls = containerRef.current.querySelectorAll("[data-text-reveal]");
    textEls.forEach((el, i) => {
      gsap.fromTo(el,
        { opacity: 0, y: 5, filter: "blur(4px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.75, delay: i * 0.122, ease: "power3.out" }
      );
    });

    // Role text has different stagger (0.2s per spec)
    const roleEls = containerRef.current.querySelectorAll("[data-role-reveal]");
    roleEls.forEach((el, i) => {
      gsap.fromTo(el,
        { opacity: 0, y: 5, filter: "blur(4px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.75, delay: i * 0.2, ease: "power3.out" }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [slug]);

  // Keyboard navigation (spec Section 7.9)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        navigate("/");
        return;
      }

      // Arrow Up/Down: scroll to adjacent media block
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        const blocks = Array.from(
          document.querySelectorAll("[data-media-reveal]")
        );
        if (!blocks.length) return;

        const viewportCenter = window.scrollY + window.innerHeight / 2;
        // Find the block closest to viewport center
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

      // Spacebar: toggle video play/pause
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
          fontSize: "11px",
          letterSpacing: "0.2em",
          color: "var(--color-text-dim)",
        }}
      >
        project not found
      </div>
    );
  }

  // Collect all media from the project
  const mediaItems: Array<{
    type: "image" | "video";
    src: string;
    poster?: string;
    aspect?: string;
  }> = [];

  // Editorial images
  project.editorial.images?.forEach((img) => {
    mediaItems.push({ type: "image", src: img });
  });

  // Process step images
  project.processSteps?.forEach((step) => {
    if (step.image) {
      mediaItems.push({ type: "image", src: step.image, aspect: "4/3" });
    }
  });

  // Videos
  project.videos?.forEach((video) => {
    mediaItems.push({
      type: "video",
      src: video.src,
      poster: video.poster,
      aspect: video.aspect,
    });
  });

  return (
    <div
      ref={containerRef}
      className="min-h-screen"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      {/* ── Content column ── */}
      <div
        className="span-w-7 span-ml-2 py-[10vh]"
      >
        {/* ── Project Metadata ── */}
        <div className="mb-16">
          <h1
            className="font-mono uppercase"
            style={{
              fontSize: "11px",
              letterSpacing: "0.08em",
              color: "var(--color-text)",
            }}
            data-text-reveal
          >
            {project.title}
          </h1>

          <p
            className="font-mono uppercase mt-4"
            style={{
              fontSize: "11px",
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
                  fontSize: "11px",
                  color: "var(--color-text-ghost)",
                  marginBottom: "4px",
                }}
              >
                Role
              </span>
              <span
                className="font-mono uppercase"
                style={{
                  fontSize: "11px",
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
                  fontSize: "11px",
                  color: "var(--color-text-ghost)",
                  marginBottom: "4px",
                }}
              >
                Year
              </span>
              <span
                className="font-mono uppercase"
                style={{
                  fontSize: "11px",
                  color: "var(--color-text-dim)",
                }}
              >
                {project.year}
              </span>
            </div>
          </div>
        </div>

        {/* ── Media Gallery ── */}
        <div className="flex flex-col gap-8">
          {mediaItems.map((item, i) => (
            <div key={i} data-media-reveal={item.type}>
              {item.type === "image" ? (
                <div
                  className="relative w-full overflow-hidden"
                  style={{
                    aspectRatio: item.aspect || "16/10",
                  }}
                >
                  {item.src.startsWith("/placeholder") ? (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{
                        backgroundColor: "var(--color-surface)",
                      }}
                    >
                      <span
                        className="font-mono uppercase"
                        style={{
                          fontSize: "11px",
                          color: "var(--color-text-ghost)",
                        }}
                      >
                        Media Pending
                      </span>
                    </div>
                  ) : (
                    <Image
                      src={item.src}
                      alt={`${project.title} — media ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 95vw, 57vw"
                      quality={90}
                    />
                  )}
                </div>
              ) : (
                <div
                  className="relative w-full overflow-hidden"
                  style={{ aspectRatio: item.aspect || "16/9" }}
                >
                  <video
                    src={item.src}
                    poster={item.poster}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
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
            fontSize: "11px",
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
                backgroundColor: "var(--color-border)",
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
                fontSize: "11px",
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
              fontSize: "11px",
              color: "var(--color-text-dim)",
              letterSpacing: "0.08em",
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
              fontSize: "11px",
              color: "var(--color-text-dim)",
              letterSpacing: "0.08em",
            }}
          >
            {nextProject.title} →
          </TransitionLink>
        )}
      </div>
    </div>
  );
}
