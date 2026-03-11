"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import type { Project, ProjectHighlight } from "@/constants/projects";
import { PROJECTS } from "@/constants/projects";
import Link from "next/link";
import Image from "next/image";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface ScrollStageProps {
  project: Project;
}

/* ─── Shared reveal helper for GSAP ─── */
function useRevealOnScroll(
  containerRef: React.RefObject<HTMLElement | null>,
  selector: string,
  reduced: boolean
) {
  useGSAP(
    () => {
      if (reduced || !containerRef.current) return;
      const els = containerRef.current.querySelectorAll(selector);
      els.forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 40,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        });
      });
    },
    { scope: containerRef }
  );
}

/* ─── Sub-components ─── */

function MetaItem({
  label,
  value,
}: {
  label: string;
  value: string | React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span
        className="font-mono uppercase tracking-[0.25em]"
        style={{ fontSize: "var(--text-xs)", color: "var(--color-gold)" }}
      >
        {label}
      </span>
      <span
        className="font-sans leading-relaxed"
        style={{ fontSize: "var(--text-sm)", color: "var(--color-text)" }}
      >
        {value}
      </span>
    </div>
  );
}

function PlaceholderFrame({ label }: { label: string }) {
  return (
    <div
      className="w-full aspect-[16/10] flex items-center justify-center rounded-sm"
      style={{
        backgroundColor: "var(--color-surface)",
        border: "1px dashed var(--color-border)",
      }}
    >
      <span
        className="font-mono uppercase tracking-[0.2em]"
        style={{ fontSize: "var(--text-xs)", color: "var(--color-text-dim)" }}
      >
        {label}
      </span>
    </div>
  );
}

function ImageBlock({
  src,
  fullWidth = false,
  placeholder,
}: {
  src: string;
  index: number;
  fullWidth?: boolean;
  placeholder?: string;
}) {
  if (src.startsWith("/placeholder")) {
    return <PlaceholderFrame label={placeholder || "Media Pending"} />;
  }

  return (
    <div
      className={`reveal-block relative w-full aspect-[16/10] overflow-hidden rounded-sm group ${fullWidth ? "md:col-span-2" : "md:col-span-1"}`}
    >
      <Image
        src={src}
        alt=""
        fill
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
        sizes="(max-width: 768px) 100vw, 60vw"
        quality={90}
      />
    </div>
  );
}

function ProcessSection({ project }: { project: Project }) {
  if (!project?.process) return null;

  return (
    <section className="py-24 sm:py-32" style={{ borderTop: "1px solid var(--color-border)" }}>
      <div className="px-6 sm:px-12 lg:px-0 mb-16">
        <div className="reveal-block">
          <p
            className="font-mono uppercase tracking-[0.3em] mb-4"
            style={{ fontSize: "var(--text-xs)", color: "var(--color-gold)" }}
          >
            (01) The Rough
          </p>
          <h2
            className="font-serif italic leading-[1.1] mb-8"
            style={{
              fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
              color: "var(--color-text)",
            }}
          >
            {project.process.title}
          </h2>
          <p
            className="font-sans leading-[1.7] max-w-2xl"
            style={{
              fontSize: "18px",
              color: "var(--color-text-dim)",
            }}
          >
            {project.process.copy}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6 sm:px-12 lg:px-0 mt-12">
        {project.process.images?.map((img, i) => (
          <ImageBlock key={i} src={img} index={i} placeholder="Sketch / Wireframe" />
        )) || <PlaceholderFrame label="Process Media Pending" />}
      </div>
    </section>
  );
}

function EngineeringSection({ project }: { project: Project }) {
  if (!project?.engineering) return null;

  return (
    <section
      className="py-24 sm:py-32"
      style={{
        backgroundColor: "var(--color-surface)",
        borderTop: "1px solid var(--color-border)",
        borderBottom: "1px solid var(--color-border)",
      }}
    >
      <div className="px-6 sm:px-12 lg:px-0">
        <div className="reveal-block">
          <p
            className="font-mono uppercase tracking-[0.3em] mb-4"
            style={{ fontSize: "var(--text-xs)", color: "var(--color-gold)" }}
          >
            (03) Engineering
          </p>
          <h2
            className="font-serif italic leading-[1.1] mb-8"
            style={{
              fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
              color: "var(--color-text)",
            }}
          >
            {project.engineering.title}
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-16 items-start">
            <div className="space-y-8">
              <p
                className="font-sans leading-[1.8]"
                style={{ fontSize: "18px", color: "var(--color-text-dim)" }}
              >
                {project.engineering.copy}
              </p>
              <div className="flex flex-wrap gap-3">
                {project.engineering.signals?.map((signal) => (
                  <span
                    key={signal}
                    className="px-3 py-1 rounded-full font-mono uppercase tracking-[0.1em]"
                    style={{
                      fontSize: "8px",
                      color: "var(--color-text)",
                      border: "1px solid var(--color-border)",
                    }}
                  >
                    {signal}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              {project.engineering.images?.map((img, i) => (
                <ImageBlock
                  key={i}
                  src={img}
                  index={i}
                  placeholder="Technical Architecture"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SystemSection({ project }: { project: Project }) {
  if (!project?.schematic) return null;

  return (
    <section className="py-24 sm:py-32" style={{ borderTop: "1px solid var(--color-border)" }}>
      <div className="px-6 sm:px-12 lg:px-0 mb-20">
        <p
          className="font-mono uppercase tracking-[0.3em] mb-4"
          style={{ fontSize: "var(--text-xs)", color: "var(--color-gold)" }}
        >
          (04) The System
        </p>
        <h2
          className="font-serif italic leading-[1.1]"
          style={{
            fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
            color: "var(--color-text)",
          }}
        >
          Design Specifications
        </h2>
      </div>

      <div className="px-6 sm:px-12 lg:px-0">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-20">
          <div className="space-y-20">
            {/* Typography */}
            <div className="pt-10" style={{ borderTop: "1px solid var(--color-border)" }}>
              <p
                className="font-mono uppercase tracking-[0.2em] mb-10"
                style={{ fontSize: "8px", color: "var(--color-text-dim)" }}
              >
                Typeface
              </p>
              <div className="space-y-4">
                <h3
                  className="font-serif italic leading-none"
                  style={{
                    fontSize: "clamp(3.5rem, 8vw, 7rem)",
                    color: "var(--color-text)",
                  }}
                >
                  Aa Zz
                </h3>
                <p
                  className="font-sans uppercase tracking-[0.1em]"
                  style={{
                    fontSize: "var(--text-sm)",
                    color: "var(--color-text-dim)",
                  }}
                >
                  {project.schematic.typography}
                </p>
              </div>
            </div>

            {/* Grid */}
            <div className="pt-10" style={{ borderTop: "1px solid var(--color-border)" }}>
              <p
                className="font-mono uppercase tracking-[0.2em] mb-10"
                style={{ fontSize: "8px", color: "var(--color-text-dim)" }}
              >
                Grid Rules
              </p>
              <div
                className="h-64 relative overflow-hidden flex items-center justify-center"
                style={{
                  border: "1px solid var(--color-border)",
                  backgroundColor: "var(--color-bg)",
                }}
              >
                <div className="absolute inset-0 grid grid-cols-12 gap-px px-px">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-full"
                      style={{ backgroundColor: "rgba(255,255,255,0.02)" }}
                    />
                  ))}
                </div>
                <span
                  className="relative z-10 font-mono uppercase tracking-[0.2em]"
                  style={{ fontSize: "8px", color: "var(--color-text-dim)" }}
                >
                  {project.schematic.grid}
                </span>
              </div>
            </div>
          </div>

          {/* Colors */}
          <div className="pt-10" style={{ borderTop: "1px solid var(--color-border)" }}>
            <p
              className="font-mono uppercase tracking-[0.2em] mb-10"
              style={{ fontSize: "8px", color: "var(--color-text-dim)" }}
            >
              Atmospheric Palette
            </p>
            <div className="space-y-6">
              {project.schematic.colors?.map((color) => (
                <div key={color} className="flex items-center gap-6">
                  <div
                    className="w-16 h-16 rounded-sm"
                    style={{
                      backgroundColor: color,
                      border: "1px solid var(--color-border)",
                    }}
                  />
                  <div>
                    <p
                      className="font-mono uppercase tracking-[0.1em]"
                      style={{
                        fontSize: "10px",
                        color: "var(--color-text)",
                      }}
                    >
                      {color}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HighlightSection({
  highlight,
  index,
  id,
}: {
  highlight: ProjectHighlight;
  index: number;
  id: string;
}) {
  if (!highlight) return null;

  return (
    <div id={id} className="py-12 sm:py-16">
      <div className="px-6 sm:px-12 lg:px-0 mb-12">
        <div className="reveal-block">
          <p
            className="font-mono uppercase tracking-[0.3em] mb-4"
            style={{ fontSize: "var(--text-xs)", color: "var(--color-text-dim)" }}
          >
            02.{index + 1} // HIGHLIGHT
          </p>
          <h2
            className="font-serif italic leading-[1.1] mb-10"
            style={{
              fontSize: "clamp(2rem, 5vw, 4rem)",
              color: "var(--color-text)",
            }}
          >
            {highlight.title}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_350px] gap-12 items-start">
            <p
              className="font-sans leading-[1.8]"
              style={{ fontSize: "16px", color: "var(--color-text-dim)" }}
            >
              {highlight.description}
            </p>
            <div
              className="p-8 rounded-sm"
              style={{
                backgroundColor: "var(--color-surface)",
                border: "1px solid var(--color-border)",
              }}
            >
              <p
                className="font-sans italic leading-relaxed mb-4"
                style={{ fontSize: "var(--text-sm)", color: "var(--color-text)" }}
              >
                Challenge: {highlight.challenge}
              </p>
              {highlight.recipe && (
                <p
                  className="font-mono uppercase tracking-[0.1em]"
                  style={{ fontSize: "8px", color: "var(--color-gold)" }}
                >
                  Recipe: {highlight.recipe}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 px-6 sm:px-12 lg:px-0">
        {highlight.images?.map((img, i) => (
          <ImageBlock
            key={`${img}-${i}`}
            src={img}
            index={i}
            fullWidth={i === 0 && highlight.images.length % 2 !== 0}
          />
        )) || <PlaceholderFrame label="Highlight Media Pending" />}
      </div>
    </div>
  );
}

/* ─── Main Component ─── */

export default function ScrollStage({ project }: ScrollStageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // GSAP scroll reveals for all .reveal-block elements
  useRevealOnScroll(containerRef, ".reveal-block", reduced);

  const currentIndex = PROJECTS.findIndex((p) => p.id === project.id);
  const nextProject = PROJECTS[(currentIndex + 1) % PROJECTS.length] || PROJECTS[0];
  const prevProject =
    PROJECTS[(currentIndex - 1 + PROJECTS.length) % PROJECTS.length] || PROJECTS[PROJECTS.length - 1];

  return (
    <div
      ref={containerRef}
      className="min-h-screen relative overflow-hidden"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      {/* Scroll Progress */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] z-[100] origin-left"
        style={{ scaleX, backgroundColor: "var(--color-gold)" }}
      />

      <div className="max-w-[1200px] mx-auto">
        {/* ─── Header ─── */}
        <motion.div
          className="flex items-center justify-between px-6 sm:px-12 pt-24 pb-4"
          style={{ borderBottom: "1px solid var(--color-border)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Link
            href="/"
            className="font-mono uppercase tracking-[0.2em] transition-colors duration-300"
            style={{ fontSize: "var(--text-xs)", color: "var(--color-text-dim)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-dim)")}
          >
            &larr; Back
          </Link>
          <div className="flex gap-2">
            {project.tags?.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 rounded-full font-mono uppercase tracking-[0.15em]"
                style={{
                  fontSize: "7px",
                  color: "var(--color-text-dim)",
                  border: "1px solid var(--color-border)",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </motion.div>

        {/* ─── Hero ─── */}
        <div className="px-6 sm:px-12 pt-16 sm:pt-24 pb-16 sm:pb-20">
          <div className="max-w-4xl">
            <motion.p
              className="font-mono uppercase tracking-[0.3em] mb-4"
              style={{ fontSize: "var(--text-xs)", color: "var(--color-text-dim)" }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              ({project.client})
            </motion.p>

            <motion.h1
              className="font-serif italic leading-[1.05] tracking-[-0.02em]"
              style={{
                fontSize: "clamp(2.5rem, 8vw, 6rem)",
                color: "var(--color-text)",
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              {project.editorial.headline}
            </motion.h1>

            <motion.p
              className="font-serif italic mt-4 leading-[1.3]"
              style={{
                fontSize: "clamp(1.2rem, 2.5vw, 2.2rem)",
                color: "var(--color-text-dim)",
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              {project.pitch}
            </motion.p>
          </div>
        </div>

        {/* ─── Metadata ─── */}
        <div
          className="px-6 sm:px-12 py-12"
          style={{
            borderTop: "1px solid var(--color-border)",
            borderBottom: "1px solid var(--color-border)",
          }}
        >
          <div className="reveal-block grid grid-cols-2 sm:grid-cols-5 gap-8">
            <MetaItem label="Client" value={project.client} />
            <MetaItem label="Year" value={project.year} />
            <MetaItem
              label="Stack"
              value={project.schematic.stack.slice(0, 3).join(", ")}
            />
            <MetaItem label="System" value={project?.schematic?.grid} />
            <MetaItem
              label="Team"
              value={
                project.contributors?.map((c) => c.name).join(", ") || "Solo"
              }
            />
          </div>
        </div>

        {/* ─── Content ─── */}
        <div>
          {/* Mission */}
          <div className="px-6 sm:px-12 py-24 sm:py-32">
            <div className="reveal-block max-w-3xl">
              <p
                className="font-mono uppercase tracking-[0.25em] mb-8"
                style={{ fontSize: "var(--text-xs)", color: "var(--color-text-dim)" }}
              >
                The Mission
              </p>
              <p
                className="font-sans italic leading-[1.7]"
                style={{
                  fontSize: "clamp(1.1rem, 1.5vw, 1.4rem)",
                  color: "var(--color-text-dim)",
                }}
              >
                {project.editorial.copy}
              </p>
            </div>
          </div>

          <ProcessSection project={project} />

          {/* Highlights */}
          <div className="space-y-12">
            <div className="px-6 sm:px-12 pt-24 pb-12">
              <p
                className="font-mono uppercase tracking-[0.3em] mb-4"
                style={{ fontSize: "var(--text-xs)", color: "var(--color-gold)" }}
              >
                (02) Highlights
              </p>
              <h2
                className="font-serif italic leading-[1.1]"
                style={{
                  fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
                  color: "var(--color-text)",
                }}
              >
                Core Capabilities
              </h2>
            </div>
            {project.highlights?.map((h, i) => (
              <HighlightSection
                key={h.id}
                highlight={h}
                index={i}
                id={`highlight-${i}`}
              />
            ))}
          </div>

          <EngineeringSection project={project} />
          <SystemSection project={project} />

          {/* ─── Statistics ─── */}
          {project.statistics?.length > 0 && (
            <section
              className="px-6 sm:px-12 py-32"
              style={{ borderTop: "1px solid var(--color-border)" }}
            >
              <p
                className="font-mono uppercase tracking-[0.3em] mb-16"
                style={{ fontSize: "var(--text-xs)", color: "var(--color-text-dim)" }}
              >
                Quantitative Data
              </p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
                {project.statistics.map((stat) => (
                  <div key={stat.label} className="reveal-block">
                    <p
                      className="font-serif italic leading-none mb-3"
                      style={{
                        fontSize: "clamp(3.5rem, 7vw, 5.5rem)",
                        color: "var(--color-text)",
                      }}
                    >
                      {stat.value}
                    </p>
                    <p
                      className="font-mono uppercase tracking-[0.2em]"
                      style={{
                        fontSize: "var(--text-xs)",
                        color: "var(--color-text-dim)",
                      }}
                    >
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ─── Launch Videos ─── */}
          {project.launchVideos?.length > 0 && (
            <section
              className="px-6 sm:px-12 py-32"
              style={{ borderTop: "1px solid var(--color-border)" }}
            >
              <p
                className="font-mono uppercase tracking-[0.3em] mb-16"
                style={{ fontSize: "var(--text-xs)", color: "var(--color-text-dim)" }}
              >
                The Reveal
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                {project.launchVideos.map((vid) => (
                  <div key={vid.id} className="group reveal-block">
                    <div
                      className="relative aspect-[9/16] rounded-sm overflow-hidden mb-4"
                      style={{
                        backgroundColor: "var(--color-surface)",
                        border: "1px solid var(--color-border)",
                      }}
                    >
                      {vid.thumbnail && (
                        <Image
                          src={vid.thumbnail}
                          alt={vid.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      )}
                    </div>
                    <p
                      className="font-mono uppercase tracking-[0.1em] mb-1"
                      style={{ fontSize: "8px", color: "var(--color-gold)" }}
                    >
                      {vid.type}
                    </p>
                    <p
                      className="font-sans"
                      style={{
                        fontSize: "var(--text-sm)",
                        color: "var(--color-text)",
                      }}
                    >
                      {vid.title}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* ─── Prev / Next Navigation ─── */}
        <div
          className="grid grid-cols-2 mt-auto"
          style={{ borderTop: "1px solid var(--color-border)" }}
        >
          <Link
            href={`/work/${prevProject.id}`}
            className="group block px-6 sm:px-12 py-20 sm:py-28 transition-colors duration-500"
            style={{ borderRight: "1px solid var(--color-border)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--color-surface)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
          >
            <p
              className="font-mono uppercase tracking-[0.3em] mb-4"
              style={{ fontSize: "var(--text-xs)", color: "var(--color-text-dim)" }}
            >
              &larr; Previous
            </p>
            <h3
              className="font-serif italic leading-[1.15] transition-colors duration-500 group-hover:text-[var(--color-gold)]"
              style={{
                fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
                color: "var(--color-text)",
              }}
            >
              {prevProject.title}
            </h3>
          </Link>

          <Link
            href={`/work/${nextProject.id}`}
            className="group block px-6 sm:px-12 py-20 sm:py-28 text-right transition-colors duration-500"
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--color-surface)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
          >
            <p
              className="font-mono uppercase tracking-[0.3em] mb-4"
              style={{ fontSize: "var(--text-xs)", color: "var(--color-text-dim)" }}
            >
              Next &rarr;
            </p>
            <h3
              className="font-serif italic leading-[1.15] transition-colors duration-500 group-hover:text-[var(--color-gold)]"
              style={{
                fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
                color: "var(--color-text)",
              }}
            >
              {nextProject.title}
            </h3>
          </Link>
        </div>

        {/* ─── Footer ─── */}
        <footer
          className="px-6 sm:px-12 py-12 flex justify-between items-center"
          style={{ borderTop: "1px solid var(--color-border)" }}
        >
          <span
            className="font-mono uppercase tracking-[0.3em]"
            style={{ fontSize: "var(--text-xs)", color: "var(--color-text-dim)", opacity: 0.5 }}
          >
            HKJ Studio &copy; {new Date().getFullYear()}
          </span>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="font-mono uppercase tracking-[0.3em] transition-colors duration-300"
            style={{ fontSize: "var(--text-xs)", color: "var(--color-text-dim)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-gold)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-dim)")}
          >
            &uarr; Top
          </button>
        </footer>
      </div>
    </div>
  );
}
