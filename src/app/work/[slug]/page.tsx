"use client";

import { useParams, useRouter } from "next/navigation";
import { PROJECTS } from "@/constants/projects";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useSpring } from "framer-motion";
import { useRef, useMemo } from "react";
import ChapterSidebar from "@/components/case-study/ChapterSidebar";
import HighlightAccordion from "@/components/case-study/HighlightAccordion";
import StatGrid from "@/components/case-study/StatGrid";
import GutPunchCloser from "@/components/case-study/GutPunchCloser";
import VideoShowcase from "@/components/case-study/VideoShowcase";

/* ─── Constants ─── */

function buildChapters(hasVideos: boolean) {
  const items: Array<{ id: string; label: string }> = [
    { id: "ch-cover", label: "Cover" },
    { id: "ch-paradox", label: "The Paradox" },
    { id: "ch-brief", label: "The Brief" },
    { id: "ch-process", label: "The Process" },
  ];
  if (hasVideos) {
    items.push({ id: "ch-reel", label: "The Reel" });
  }
  items.push(
    { id: "ch-craft", label: "The Craft" },
    { id: "ch-engine", label: "The Engine" },
    { id: "ch-numbers", label: "The Numbers" },
    { id: "ch-closer", label: "The Closer" },
  );
  return items.map((item, i) => ({ ...item, num: String(i + 1).padStart(2, "0") }));
}

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

/* ─── Helpers ─── */

function ChapterLabel({ num, title }: { num: string; title: string }) {
  return (
    <div
      className="flex items-center gap-4 mb-8"
      style={{ borderBottom: "1px solid var(--color-border)", paddingBottom: "0.75rem" }}
    >
      <span className="micro" style={{ color: "var(--color-text-ghost)" }}>
        {num}
      </span>
      <span
        className="font-mono uppercase"
        style={{
          fontSize: "var(--text-xs)",
          letterSpacing: "0.15em",
          color: "var(--color-text-dim)",
        }}
      >
        {title}
      </span>
    </div>
  );
}

function PlaceholderFrame({ label }: { label: string }) {
  return (
    <div
      className="w-full aspect-[16/10] flex items-center justify-center"
      style={{
        backgroundColor: "var(--color-surface)",
        border: "1px dashed var(--color-border)",
      }}
    >
      <span className="micro">{label}</span>
    </div>
  );
}

function ImageBlock({ src, placeholder }: { src: string; placeholder?: string }) {
  if (src.startsWith("/placeholder")) {
    return <PlaceholderFrame label={placeholder || "Media Pending"} />;
  }
  return (
    <div className="relative w-full aspect-[16/10] overflow-hidden group">
      <Image
        src={src}
        alt=""
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
        sizes="(max-width: 768px) 100vw, 60vw"
        quality={90}
      />
    </div>
  );
}

/** Strata band separator — a horizontal surface-colored band */
function StrataBand() {
  return (
    <div
      className="w-full"
      style={{
        height: 48,
        backgroundColor: "var(--color-surface)",
        borderTop: "1px solid var(--color-border)",
        borderBottom: "1px solid var(--color-border)",
      }}
    />
  );
}

/* ═══════════════════════════════════════════
   ProjectDetail — Editorial Serif + Strata Bands
   7-chapter structure with pinned sidebar
   ═══════════════════════════════════════════ */

export default function ProjectDetail() {
  const { slug } = useParams();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const project = PROJECTS.find((p) => p.id === slug);

  const hasVideos = !!(project?.videos && project.videos.length > 0);
  const chapters = useMemo(() => buildChapters(hasVideos), [hasVideos]);
  const chapterNum = (id: string) => chapters.find((c) => c.id === id)?.num || "00";

  // Scroll progress bar
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Next/Prev navigation
  const currentIndex = project ? PROJECTS.findIndex((p) => p.id === project.id) : -1;
  const nextProject = PROJECTS[(currentIndex + 1) % PROJECTS.length];
  const prevProject = PROJECTS[(currentIndex - 1 + PROJECTS.length) % PROJECTS.length];

  if (!project) {
    return (
      <div
        className="w-full h-screen flex items-center justify-center font-mono uppercase"
        style={{ fontSize: "var(--text-xs)", letterSpacing: "0.2em", color: "var(--color-text-dim)" }}
      >
        project not found
      </div>
    );
  }

  return (
    <div ref={containerRef} className="min-h-screen relative" style={{ backgroundColor: "var(--color-bg)" }}>
      {/* ── Scroll Progress Bar ── */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[1px] z-[100] origin-left"
        style={{ scaleX, backgroundColor: "var(--color-text)" }}
      />

      {/* ── Chapter Sidebar ── */}
      <ChapterSidebar chapters={chapters} />

      {/* ── Back Button ── */}
      <motion.button
        onClick={() => router.back()}
        className="fixed top-6 right-6 z-50 flex items-center gap-2 group"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <span
          className="font-sans transition-colors duration-300"
          style={{
            fontSize: "var(--text-xs)",
            letterSpacing: "0.02em",
            color: "var(--color-text-dim)",
          }}
        >
          ← back
        </span>
      </motion.button>

      {/* ════════════════════════════════════════
         CH.01 COVER — Hero block with TL;DR
         ════════════════════════════════════════ */}
      <section id="ch-cover" className="relative w-full min-h-screen flex flex-col justify-end" style={{ padding: "var(--page-px)" }}>
        {/* Hero image — full color */}
        <motion.div
          layoutId={`project-image-${project.id}`}
          className="absolute inset-0"
        >
          <Image
            src={project.image}
            alt={project.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
            style={{ filter: "brightness(0.85)" }}
          />
          {/* Bone gradient overlay at bottom for text legibility */}
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to top, var(--color-bg) 0%, transparent 60%)",
            }}
          />
        </motion.div>

        {/* Title + TL;DR panel */}
        <div className="relative z-10 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease }}
          >
            <span
              className="font-mono uppercase block mb-4"
              style={{
                fontSize: "var(--text-micro)",
                letterSpacing: "0.2em",
                color: "var(--color-text-dim)",
              }}
            >
              {project.sector} / {project.year}
            </span>
            <h1
              className="font-serif italic leading-[0.95] tracking-[-0.02em]"
              style={{
                fontSize: "var(--text-display)",
                color: "var(--color-text)",
              }}
            >
              {project.title}
            </h1>
          </motion.div>

          {/* TL;DR panel */}
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-12 p-6"
            style={{
              backgroundColor: "var(--color-surface)",
              border: "1px solid var(--color-border-strong)",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6, ease }}
          >
            {[
              { label: "Problem", value: project.pitch },
              { label: "Role", value: project.role },
              { label: "Tools", value: project.schematic.stack.slice(0, 3).join(", ") },
              { label: "Outcome", value: project.editorial.subhead },
            ].map((item) => (
              <div key={item.label} className="flex flex-col gap-2">
                <span className="micro">{item.label}</span>
                <span
                  className="font-sans"
                  style={{
                    fontSize: "var(--text-sm)",
                    color: "var(--color-text)",
                    lineHeight: 1.5,
                  }}
                >
                  {item.value}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Paradox + Stakes (new CH.02) ── */}
      <div className="max-w-[900px] mx-auto" style={{ padding: "0 var(--page-px)" }}>
        {project.paradox && (
          <section id="ch-paradox" className="pt-32 pb-24">
            <ChapterLabel num={chapterNum("ch-paradox")} title="The Paradox" />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease }}
            >
              <h2
                className="editorial-display mb-8"
                style={{ fontSize: "var(--text-2xl)", color: "var(--color-text)" }}
              >
                {project.paradox}
              </h2>
              {project.stakes && (
                <p
                  className="font-grotesk leading-[1.8]"
                  style={{ fontSize: "var(--text-base)", color: "var(--color-text-dim)", maxWidth: 650 }}
                >
                  {project.stakes}
                </p>
              )}
            </motion.div>
          </section>
        )}
      </div>

      <StrataBand />

      {/* ── Main content container ── */}
      <div className="max-w-[900px] mx-auto" style={{ padding: "0 var(--page-px)" }}>

        {/* ════════════════════════════════════════
           CH.03 THE BRIEF — Editorial
           ════════════════════════════════════════ */}
        <section id="ch-brief" className="pt-32 pb-24">
          <ChapterLabel num={chapterNum("ch-brief")} title="The Brief" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease }}
          >
            <h2
              className="font-serif italic leading-[1.1] mb-6"
              style={{
                fontSize: "var(--text-2xl)",
                color: "var(--color-text)",
              }}
            >
              {project.editorial.headline}
            </h2>

            <p
              className="font-mono uppercase mb-8"
              style={{
                fontSize: "var(--text-xs)",
                letterSpacing: "0.15em",
                color: "var(--color-text-dim)",
              }}
            >
              {project.editorial.subhead}
            </p>

            <p
              className="font-sans leading-[1.8]"
              style={{
                fontSize: "var(--text-base)",
                color: "var(--color-text-dim)",
                maxWidth: "650px",
              }}
            >
              {project.editorial.copy}
            </p>
          </motion.div>

          {/* Metadata row */}
          <div
            className="grid grid-cols-2 sm:grid-cols-5 gap-6 mt-16 pt-6"
            style={{ borderTop: "1px solid var(--color-border)" }}
          >
            {[
              { label: "Client", value: project.client },
              { label: "Year", value: project.year },
              { label: "Stack", value: project.schematic.stack.slice(0, 3).join(", ") },
              { label: "System", value: project.schematic.grid },
              { label: "Team", value: project.contributors?.map((c) => c.name).join(", ") || "Solo" },
            ].map((meta) => (
              <div key={meta.label} className="flex flex-col gap-1">
                <span className="micro">{meta.label}</span>
                <span
                  className="font-mono"
                  style={{ fontSize: "var(--text-xs)", color: "var(--color-text)", letterSpacing: "0.05em" }}
                >
                  {meta.value}
                </span>
              </div>
            ))}
          </div>

          {/* Editorial images */}
          {project.editorial.images?.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-16">
              {project.editorial.images.map((img, i) => (
                <ImageBlock key={i} src={img} placeholder="Editorial Media" />
              ))}
            </div>
          )}
        </section>
      </div>

      <StrataBand />

      <div className="max-w-[900px] mx-auto" style={{ padding: "0 var(--page-px)" }}>
        {/* ════════════════════════════════════════
           CH.04 THE PROCESS — Rough sketches
           ════════════════════════════════════════ */}
        <section id="ch-process" className="py-24">
          <ChapterLabel num={chapterNum("ch-process")} title="The Process" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease }}
          >
            <h3
              className="font-serif italic leading-[1.15] mb-6"
              style={{ fontSize: "var(--text-xl)", color: "var(--color-text)" }}
            >
              {project.process.title}
            </h3>
            <p
              className="font-sans leading-[1.8] mb-12"
              style={{
                fontSize: "var(--text-base)",
                color: "var(--color-text-dim)",
                maxWidth: "650px",
              }}
            >
              {project.process.copy}
            </p>
          </motion.div>

          {project.process.images?.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.process.images.map((img, i) => (
                <ImageBlock key={i} src={img} placeholder="Sketch / Wireframe" />
              ))}
            </div>
          )}
        </section>

        {/* ════════════════════════════════════════
           THE REEL — B-Roll Video Showcase (conditional)
           ════════════════════════════════════════ */}
        {hasVideos && (
          <>
            <div className="hairline" />
            <section id="ch-reel" className="py-24">
              <ChapterLabel num={chapterNum("ch-reel")} title="The Reel" />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease }}
              >
                <VideoShowcase videos={project.videos!} />
              </motion.div>
            </section>
          </>
        )}

        <div className="hairline" />

        {/* ════════════════════════════════════════
           THE CRAFT — Highlights Accordion
           ════════════════════════════════════════ */}
        <section id="ch-craft" className="py-24">
          <ChapterLabel num={chapterNum("ch-craft")} title="The Craft" />

          {project.highlights?.length > 0 ? (
            <HighlightAccordion highlights={project.highlights} />
          ) : (
            <p className="micro">No highlights documented yet.</p>
          )}
        </section>
      </div>

      <StrataBand />

      <div className="max-w-[900px] mx-auto" style={{ padding: "0 var(--page-px)" }}>
        {/* ════════════════════════════════════════
           CH.06 THE ENGINE — Engineering + Signals
           ════════════════════════════════════════ */}
        <section id="ch-engine" className="py-24">
          <ChapterLabel num={chapterNum("ch-engine")} title="The Engine" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease }}
            className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-12"
          >
            <div className="space-y-6">
              <p
                className="font-sans leading-[1.8]"
                style={{ fontSize: "var(--text-base)", color: "var(--color-text-dim)" }}
              >
                {project.engineering.copy}
              </p>

              {/* Signal tags */}
              <div className="flex flex-wrap gap-2 mt-6">
                {project.engineering.signals?.map((signal) => (
                  <span
                    key={signal}
                    className="font-mono uppercase"
                    style={{
                      fontSize: "var(--text-micro)",
                      letterSpacing: "0.15em",
                      color: "var(--color-text-dim)",
                      padding: "4px 10px",
                      border: "1px solid var(--color-border-strong)",
                    }}
                  >
                    {signal}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {project.engineering.images?.map((img, i) => (
                <ImageBlock key={i} src={img} placeholder="Technical Architecture" />
              ))}
            </div>
          </motion.div>
        </section>

        <div className="hairline" />

        {/* ════════════════════════════════════════
           CH.07 THE NUMBERS — Stats Dashboard
           ════════════════════════════════════════ */}
        <section id="ch-numbers" className="py-24">
          <ChapterLabel num={chapterNum("ch-numbers")} title="The Numbers" />
          <StatGrid stats={project.statistics} />
        </section>
      </div>

      <StrataBand />

      <div className="max-w-[900px] mx-auto" style={{ padding: "0 var(--page-px)" }}>
        {/* ════════════════════════════════════════
           CH.08 THE CLOSER — Gut-Punch + Credits
           ════════════════════════════════════════ */}
        <section id="ch-closer" className="py-24">
          <ChapterLabel num={chapterNum("ch-closer")} title="The Closer" />

          <GutPunchCloser text={project.gutPunch} />

          {/* Contributors */}
          <div className="mb-16">
            {project.contributors?.map((c) => (
              <div
                key={c.name}
                className="flex items-center justify-between py-3"
                style={{ borderBottom: "1px solid var(--color-border)" }}
              >
                <span
                  className="font-sans"
                  style={{ fontSize: "var(--text-sm)", color: "var(--color-text)" }}
                >
                  {c.name}
                </span>
                <span className="label">{c.role}</span>
              </div>
            ))}
          </div>

          {/* Schematic summary */}
          <div
            className="grid grid-cols-2 sm:grid-cols-4 gap-6 p-6"
            style={{
              backgroundColor: "var(--color-surface)",
              border: "1px solid var(--color-border)",
            }}
          >
            <div className="flex flex-col gap-1">
              <span className="micro">Typography</span>
              <span className="font-mono" style={{ fontSize: "var(--text-xs)", color: "var(--color-text)" }}>
                {project.schematic.typography}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="micro">Grid</span>
              <span className="font-mono" style={{ fontSize: "var(--text-xs)", color: "var(--color-text)" }}>
                {project.schematic.grid}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="micro">Palette</span>
              <div className="flex gap-1 mt-1">
                {project.schematic.colors?.map((c) => (
                  <div
                    key={c}
                    style={{
                      width: 16,
                      height: 16,
                      backgroundColor: c,
                      border: "1px solid var(--color-border)",
                    }}
                  />
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="micro">Stack</span>
              <span className="font-mono" style={{ fontSize: "var(--text-xs)", color: "var(--color-text)" }}>
                {project.schematic.stack.join(", ")}
              </span>
            </div>
          </div>
        </section>
      </div>

      {/* ── Prev / Next Navigation ── */}
      <div
        className="grid grid-cols-2"
        style={{ borderTop: "1px solid var(--color-border-strong)" }}
      >
        <Link
          href={`/work/${prevProject.id}`}
          className="group block px-6 sm:px-12 py-20 transition-colors duration-500 hover:bg-[var(--color-surface)]"
          style={{ borderRight: "1px solid var(--color-border)" }}
        >
          <span className="label block mb-3">← Previous</span>
          <h3
            className="font-serif italic leading-[1.15]"
            style={{
              fontSize: "var(--text-lg)",
              color: "var(--color-text)",
            }}
          >
            {prevProject.title}
          </h3>
        </Link>

        <Link
          href={`/work/${nextProject.id}`}
          className="group block px-6 sm:px-12 py-20 text-right transition-colors duration-500 hover:bg-[var(--color-surface)]"
        >
          <span className="label block mb-3">Next →</span>
          <h3
            className="font-serif italic leading-[1.15]"
            style={{
              fontSize: "var(--text-lg)",
              color: "var(--color-text)",
            }}
          >
            {nextProject.title}
          </h3>
        </Link>
      </div>

      {/* ── Footer ── */}
      <footer
        className="flex items-center justify-between px-6 sm:px-12 py-8"
        style={{ borderTop: "1px solid var(--color-border)" }}
      >
        <span className="micro" style={{ opacity: 0.4 }}>
          HKJ Studio © {new Date().getFullYear()}
        </span>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="font-mono uppercase transition-colors duration-300"
          style={{
            fontSize: "var(--text-xs)",
            letterSpacing: "0.15em",
            color: "var(--color-text-dim)",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          ↑ Top
        </button>
      </footer>
    </div>
  );
}
