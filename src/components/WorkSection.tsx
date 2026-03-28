"use client";

import { useRef, useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { PROJECTS } from "@/constants/projects";
import { Cover } from "@/components/Cover";

// Bento layout slots — maps project index to [colSpan, aspectRatio]
const GRID_SLOTS: Array<[number, string]> = [
  [8, "16/10"],  // featured — landscape-ish
  [4, "3/4"],    // secondary — portrait
  [12, "21/9"],  // wide banner
];

function getSlot(index: number): [number, string] {
  return GRID_SLOTS[index] ?? [6, "4/3"];
}

export default function WorkSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<HTMLSpanElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // Make everything visible
      [markerRef, headingRef, countRef].forEach((r) => {
        if (r.current) r.current.style.opacity = "1";
      });
      if (gridRef.current) {
        gsap.set(gridRef.current.children, { autoAlpha: 1, y: 0 });
      }
      return;
    }

    const ctx = gsap.context(() => {
      // Header entrance
      ScrollTrigger.create({
        trigger: headerRef.current,
        start: "top 88%",
        once: true,
        onEnter: () => {
          gsap.fromTo(
            [markerRef.current, headingRef.current, countRef.current],
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: 0.7, ease: "expo.out", stagger: 0.08 }
          );
        },
      });

      // Grid cards entrance
      ScrollTrigger.create({
        trigger: gridRef.current,
        start: "top 85%",
        once: true,
        onEnter: () => {
          gsap.fromTo(
            gridRef.current!.children,
            { autoAlpha: 0, y: 40 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.7,
              stagger: 0.1,
              ease: "expo.out",
            }
          );
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const projects = [...PROJECTS].sort((a, b) => a.order - b.order);

  return (
    <section ref={sectionRef} id="section-work" style={{ paddingBottom: "clamp(80px, 12vh, 160px)" }}>

      {/* Section header — 12-col grid */}
      <div
        ref={headerRef}
        className="site-grid"
        style={{
          marginBottom: "clamp(32px, 5vh, 56px)",
          paddingTop: "clamp(64px, 10vh, 120px)",
          alignItems: "end",
        }}
      >
        {/* Col 1-2: rotated "02" marker */}
        <div
          className="hero-marker"
          style={{ gridColumn: "span 2", display: "flex", alignItems: "center" }}
        >
          <span
            ref={markerRef}
            className="font-mono"
            style={{
              fontSize: "var(--text-label)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--ink-muted)",
              transform: "rotate(-90deg)",
              whiteSpace: "nowrap",
              display: "block",
              opacity: 0,
            }}
            aria-hidden="true"
          >
            02
          </span>
        </div>

        {/* Col 3-8: "Work" heading */}
        <h2
          ref={headingRef}
          className="font-display col-span-6"
          style={{
            fontSize: "var(--text-display-md)",
            fontWeight: 700,
            color: "var(--ink-full)",
            lineHeight: "var(--leading-display-md)",
            opacity: 0,
          }}
        >
          Work
        </h2>

        {/* Col 9-12: project count — right-aligned, baseline */}
        <div
          style={{
            gridColumn: "span 4",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "flex-end",
            paddingBottom: "0.2em",
          }}
        >
          <span
            ref={countRef}
            className="font-mono"
            style={{
              fontSize: "var(--text-meta)",
              letterSpacing: "0.06em",
              color: "var(--ink-muted)",
              opacity: 0,
            }}
          >
            ( {projects.length} Projects )
          </span>
        </div>
      </div>

      {/* Bento grid */}
      <div
        ref={gridRef}
        className="site-grid"
        style={{ alignItems: "stretch" }}
      >
        {projects.map((project, i) => {
          const [colSpan, aspectRatio] = getSlot(i);
          return (
            <Cover
              key={project.id}
              project={project}
              index={i}
              colSpan={colSpan}
              aspectRatio={aspectRatio}
            />
          );
        })}
      </div>

    </section>
  );
}
