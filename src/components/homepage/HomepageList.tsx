"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { PROJECTS } from "@/constants/projects";
import { useStudioStore } from "@/lib/store";
import TransitionLink from "@/components/TransitionLink";
import {
  circularDistance,
  distanceToOpacity,
  distanceToBlur,
  LIST_LAYOUT,
} from "@/lib/carousel-layout";

const activeProjects = PROJECTS.filter((p) => !p.wip);
const len = activeProjects.length;
const half = Math.ceil(len / 2);
const leftColumn = activeProjects.slice(0, half);
const rightColumn = activeProjects.slice(half);

/* ── Image strip constants ── */
const IMAGE_H_VH = 34;
const STEP_VH = 36; // slight gap between stacked images
const HALF_LEN = Math.ceil(len / 2);

/**
 * Signed circular distance: shortest path around the ring,
 * negative = above center, positive = below center.
 */
function signedCircularDist(index: number, active: number): number {
  let d = index - active;
  if (d > len / 2) d -= len;
  if (d < -len / 2) d += len;
  return d;
}

export default function HomepageList() {
  const activeIndex = useStudioStore((s) => s.activeProjectIndex);
  const setActiveIndex = useStudioStore((s) => s.setActiveProjectIndex);
  const containerRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef(activeIndex);
  activeIndexRef.current = activeIndex;

  /* ── Scroll / wheel navigation (looping) ── */

  const scrollAccumRef = useRef(0);
  const isScrolling = useRef(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (isScrolling.current) return;

      scrollAccumRef.current += e.deltaY;

      clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        scrollAccumRef.current = 0;
      }, 150);

      if (Math.abs(scrollAccumRef.current) > 50) {
        const direction = scrollAccumRef.current > 0 ? 1 : -1;
        const current = activeIndexRef.current;
        const next = (current + direction + len) % len;

        setActiveIndex(next);
        isScrolling.current = true;
        setTimeout(() => {
          isScrolling.current = false;
        }, 500);

        scrollAccumRef.current = 0;
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      container.removeEventListener("wheel", handleWheel);
      clearTimeout(scrollTimeoutRef.current);
    };
  }, [setActiveIndex]);

  /* ── Touch swipe navigation (looping) ── */

  const touchStartY = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isScrolling.current) return;
      const deltaY = touchStartY.current - e.changedTouches[0].clientY;

      if (Math.abs(deltaY) > 30) {
        const direction = deltaY > 0 ? 1 : -1;
        const current = activeIndexRef.current;
        const next = (current + direction + len) % len;

        setActiveIndex(next);
        isScrolling.current = true;
        setTimeout(() => {
          isScrolling.current = false;
        }, 500);
      }
    };

    container.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    container.addEventListener("touchend", handleTouchEnd, { passive: true });
    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, [setActiveIndex]);

  /* ── Arrow key navigation (looping) ── */

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        setActiveIndex((activeIndex + 1) % len);
      }
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        setActiveIndex((activeIndex - 1 + len) % len);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, setActiveIndex]);

  /* ── Video refs ── */

  const videoRefs = useRef<Map<number, HTMLVideoElement>>(new Map());

  useEffect(() => {
    videoRefs.current.forEach((video, idx) => {
      if (idx === activeIndex) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [activeIndex]);

  /* ── Proximity styles for text items ── */

  function getItemStyles(index: number) {
    const dist = circularDistance(index, activeIndex, len);
    const opacity = distanceToOpacity(dist, len);
    const blur = distanceToBlur(dist, len);

    return {
      opacity,
      filter: blur > 0 ? `blur(${blur}px)` : "none",
    };
  }

  return (
    <motion.div
      ref={containerRef}
      className="relative"
      style={{ height: "100dvh", overflow: "hidden" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* ── Stacked image strip — vertically looping behind text ── */}
      <div className="absolute inset-0 flex justify-center pointer-events-none overflow-hidden">
        {activeProjects.map((project, i) => {
          const d = signedCircularDist(i, activeIndex);
          const absDist = Math.abs(d);
          const yOffset = d * STEP_VH; // vh from center

          // Fade out far items — items at max distance are invisible
          // so wrap-around repositioning is hidden
          const imgOpacity =
            absDist === 0
              ? 0.85
              : absDist >= HALF_LEN
                ? 0
                : 0.85 * Math.pow(0.5, absDist);

          return (
            <div
              key={project.id}
              className="absolute overflow-hidden"
              style={{
                width: "32vw",
                height: `${IMAGE_H_VH}vh`,
                top: "50%",
                transform: `translateY(calc(${yOffset}vh - 50%))`,
                opacity: imgOpacity,
                transition:
                  "transform 700ms cubic-bezier(0.16, 1, 0.3, 1), opacity 500ms cubic-bezier(0.4, 0, 0.2, 1)",
                borderRadius: "2px",
                willChange: "transform, opacity",
              }}
            >
              {project.cardVideo ? (
                <video
                  ref={(el) => {
                    if (el) videoRefs.current.set(i, el);
                    else videoRefs.current.delete(i);
                  }}
                  src={project.cardVideo}
                  muted
                  loop
                  playsInline
                  poster={project.image || undefined}
                  className="w-full h-full object-cover"
                />
              ) : project.image ? (
                <img
                  src={project.image}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className="w-full h-full"
                  style={{ backgroundColor: project.cover.bg }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* ── Desktop: Two-column text overlay ── */}
      <div
        className="hidden md:flex h-full items-center"
        style={{
          paddingTop: "14vh",
          paddingBottom: `${LIST_LAYOUT.verticalPaddingVh}vh`,
          paddingLeft: `${LIST_LAYOUT.sideMarginVw}vw`,
          paddingRight: `${LIST_LAYOUT.sideMarginVw}vw`,
        }}
      >
        {/* Left column — left-aligned */}
        <div
          className="flex flex-col justify-center flex-1"
          style={{ gap: `${LIST_LAYOUT.rowGapPx}px` }}
        >
          {leftColumn.map((project, colIdx) => {
            const globalIdx = colIdx;
            const styles = getItemStyles(globalIdx);
            return (
              <TransitionLink
                key={project.id}
                href={`/work/${project.id}`}
                aria-label={`Project ${globalIdx + 1}: ${project.title}`}
                className="flex items-center font-mono uppercase tracking-[0.05em] font-medium"
                style={{
                  height: `${LIST_LAYOUT.rowHeightVh}vh`,
                  fontSize: "var(--text-micro)",
                  color: "var(--color-text)",
                  ...styles,
                  transition: "all 400ms cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                <span
                  style={{
                    width: `${LIST_LAYOUT.numberColumnVw}vw`,
                    color: "var(--color-text-ghost)",
                  }}
                >
                  {String(globalIdx + 1).padStart(2, "0")}/
                </span>
                <span style={{ width: `${LIST_LAYOUT.nameColumnVw}vw` }}>
                  {project.title}
                </span>
              </TransitionLink>
            );
          })}
        </div>

        {/* Right column — right-aligned, flex-row-reverse */}
        <div
          className="flex flex-col justify-center items-end flex-1"
          style={{ gap: `${LIST_LAYOUT.rowGapPx}px` }}
        >
          {rightColumn.map((project, colIdx) => {
            const globalIdx = colIdx + half;
            const styles = getItemStyles(globalIdx);
            return (
              <TransitionLink
                key={project.id}
                href={`/work/${project.id}`}
                aria-label={`Project ${globalIdx + 1}: ${project.title}`}
                className="flex flex-row-reverse items-center font-mono uppercase tracking-[0.05em] font-medium text-end"
                style={{
                  height: `${LIST_LAYOUT.rowHeightVh}vh`,
                  fontSize: "var(--text-micro)",
                  color: "var(--color-text)",
                  ...styles,
                  transition: "all 400ms cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                <span
                  style={{
                    width: `${LIST_LAYOUT.numberColumnVw}vw`,
                    color: "var(--color-text-ghost)",
                    textAlign: "end",
                  }}
                >
                  /{String(globalIdx + 1).padStart(2, "0")}
                </span>
                <span style={{ width: `${LIST_LAYOUT.nameColumnVw}vw` }}>
                  {project.title}
                </span>
              </TransitionLink>
            );
          })}
        </div>
      </div>

      {/* ── Mobile: Single-column list ── */}
      <div
        className="flex md:hidden flex-col justify-center h-full"
        style={{
          paddingTop: "14vh",
          paddingBottom: `${LIST_LAYOUT.verticalPaddingVh}vh`,
          paddingLeft: `${LIST_LAYOUT.sideMarginVw}vw`,
          paddingRight: `${LIST_LAYOUT.sideMarginVw}vw`,
        }}
      >
        <div
          className="flex flex-col"
          style={{ gap: `${LIST_LAYOUT.rowGapPx}px` }}
        >
          {activeProjects.map((project, i) => {
            const styles = getItemStyles(i);
            return (
              <TransitionLink
                key={project.id}
                href={`/work/${project.id}`}
                aria-label={`Project ${i + 1}: ${project.title}`}
                className="flex items-center font-mono uppercase tracking-[0.05em] font-medium"
                style={{
                  height: `${LIST_LAYOUT.rowHeightVh}vh`,
                  fontSize: "var(--text-micro)",
                  color: "var(--color-text)",
                  ...styles,
                  transition: "all 400ms cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                <span
                  style={{
                    width: `${LIST_LAYOUT.numberColumnVw}vw`,
                    color: "var(--color-text-ghost)",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}/
                </span>
                <span>{project.title}</span>
              </TransitionLink>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
