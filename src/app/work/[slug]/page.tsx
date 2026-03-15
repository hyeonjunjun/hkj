"use client";

import { useParams, useRouter } from "next/navigation";
import { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import { PROJECTS } from "@/constants/projects";
import GutPunchCloser from "@/components/case-study/GutPunchCloser";
import VideoShowcase from "@/components/case-study/VideoShowcase";
import WobblyRule from "@/components/ui/WobblyRule";
import Colophon from "@/components/sections/Colophon";

/* ─── Helpers ─── */

function ImageBlock({ src, placeholder }: { src: string; placeholder?: string }) {
  if (src.startsWith("/placeholder")) {
    return (
      <div
        className="w-full aspect-[16/10] flex items-center justify-center"
        style={{
          backgroundColor: "var(--color-surface)",
          border: "1px dashed var(--color-border)",
        }}
      >
        <span className="micro">{placeholder || "Media Pending"}</span>
      </div>
    );
  }
  return (
    <div className="relative w-full aspect-[16/10] overflow-hidden">
      <Image
        src={src}
        alt=""
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 60vw"
        quality={90}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════
   ProjectDetail — GSAP-only, simplified structure
   ═══════════════════════════════════════════ */

export default function ProjectDetail() {
  const { slug } = useParams();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const project = PROJECTS.find((p) => p.id === slug);
  const currentIndex = project ? PROJECTS.findIndex((p) => p.id === project.id) : -1;
  const nextProject = PROJECTS[(currentIndex + 1) % PROJECTS.length];
  const prevProject = PROJECTS[(currentIndex - 1 + PROJECTS.length) % PROJECTS.length];
  const hasVideos = !!(project?.videos && project.videos.length > 0);

  // GSAP scroll reveals
  useEffect(() => {
    if (!containerRef.current) return;

    const reveals = containerRef.current.querySelectorAll("[data-reveal]");
    reveals.forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0.15 },
        {
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
          },
        }
      );
    });
  }, [project]);

  if (!project) {
    return (
      <div
        className="w-full h-screen flex items-center justify-center font-mono uppercase"
        style={{
          fontSize: "var(--text-micro)",
          letterSpacing: "0.2em",
          color: "var(--color-text-dim)",
        }}
      >
        project not found
      </div>
    );
  }

  return (
    <div ref={containerRef} className="min-h-screen" style={{ backgroundColor: "var(--color-bg)" }}>
      {/* ── Hero ── */}
      <section className="relative w-full min-h-[80vh] flex flex-col justify-end section-padding pb-16">
        <div className="absolute inset-0">
          <Image
            src={project.image}
            alt={project.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
            style={{ filter: "brightness(0.7)" }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to top, var(--color-bg) 0%, transparent 60%)",
            }}
          />
        </div>

        <div className="relative z-10">
          <span
            className="font-mono uppercase block mb-4"
            style={{
              fontSize: "var(--text-micro)",
              letterSpacing: "0.15em",
              color: "var(--color-text-dim)",
            }}
          >
            {project.sector} · {project.year}
          </span>
          <h1
            className="font-display"
            style={{
              fontSize: "var(--text-display)",
              color: "var(--color-text)",
              lineHeight: 1.1,
            }}
          >
            {project.title}
          </h1>
          <div className="flex gap-6 mt-6">
            <span
              className="font-mono"
              style={{
                fontSize: "var(--text-micro)",
                color: "var(--color-text-ghost)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              {project.client}
            </span>
            <span
              className="font-mono"
              style={{
                fontSize: "var(--text-micro)",
                color: "var(--color-text-ghost)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              {project.role}
            </span>
          </div>
        </div>
      </section>

      {/* ── Back button ── */}
      <div className="section-padding pt-8">
        <button
          onClick={() => router.back()}
          className="font-mono transition-colors duration-300 hover:text-[var(--color-accent)]"
          style={{
            fontSize: "var(--text-micro)",
            color: "var(--color-text-dim)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          ← Back
        </button>
      </div>

      {/* ── Body ── */}
      <div className="max-w-[900px] mx-auto section-padding">
        {/* Paradox */}
        {project.paradox && (
          <section className="pt-24 pb-16" data-reveal>
            <h2
              className="font-display italic"
              style={{
                fontSize: "var(--text-h2)",
                color: "var(--color-text)",
                lineHeight: 1.3,
              }}
            >
              {project.paradox}
            </h2>
            {project.stakes && (
              <p
                className="font-sans mt-6"
                style={{
                  fontSize: "var(--text-body)",
                  color: "var(--color-text-dim)",
                  lineHeight: 1.7,
                  maxWidth: "60ch",
                }}
              >
                {project.stakes}
              </p>
            )}
          </section>
        )}

        <WobblyRule />

        {/* Editorial */}
        <section className="py-20" data-reveal>
          <h2
            className="font-display italic mb-4"
            style={{
              fontSize: "var(--text-h2)",
              color: "var(--color-text)",
              lineHeight: 1.2,
            }}
          >
            {project.editorial.headline}
          </h2>
          <p
            className="font-sans"
            style={{
              fontSize: "var(--text-body)",
              color: "var(--color-text-dim)",
              lineHeight: 1.7,
              maxWidth: "60ch",
            }}
          >
            {project.editorial.copy}
          </p>
        </section>

        {/* Editorial images */}
        {project.editorial.images?.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-20" data-reveal>
            {project.editorial.images.map((img, i) => (
              <ImageBlock key={i} src={img} placeholder="Editorial Media" />
            ))}
          </div>
        )}

        <WobblyRule />

        {/* Process */}
        <section className="py-20" data-reveal>
          <span className="micro block mb-6" style={{ color: "var(--color-text-ghost)" }}>
            Process
          </span>
          <p
            className="font-sans mb-8"
            style={{
              fontSize: "var(--text-body)",
              color: "var(--color-text-dim)",
              lineHeight: 1.7,
              maxWidth: "60ch",
            }}
          >
            {project.process.copy}
          </p>

          {project.processSteps && project.processSteps.length > 0 && (
            <div className="space-y-8 mt-12">
              {project.processSteps.map((step, i) => (
                <div key={i} data-reveal>
                  <h4
                    className="font-sans mb-2"
                    style={{ fontSize: "var(--text-small)", color: "var(--color-text)" }}
                  >
                    {step.title}
                  </h4>
                  <p
                    className="font-sans"
                    style={{
                      fontSize: "var(--text-body)",
                      color: "var(--color-text-dim)",
                      lineHeight: 1.7,
                    }}
                  >
                    {step.copy}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Video showcase */}
        {hasVideos && (
          <>
            <WobblyRule />
            <section className="py-20" data-reveal>
              <span className="micro block mb-6" style={{ color: "var(--color-text-ghost)" }}>
                B-Roll
              </span>
              <VideoShowcase videos={project.videos!} />
            </section>
          </>
        )}

        <WobblyRule />

        {/* Engineering */}
        <section className="py-20" data-reveal>
          <span className="micro block mb-6" style={{ color: "var(--color-text-ghost)" }}>
            Engineering
          </span>
          <p
            className="font-sans mb-8"
            style={{
              fontSize: "var(--text-body)",
              color: "var(--color-text-dim)",
              lineHeight: 1.7,
              maxWidth: "60ch",
            }}
          >
            {project.engineering.copy}
          </p>
          <div className="flex flex-wrap gap-2">
            {project.engineering.signals?.map((signal) => (
              <span
                key={signal}
                className="font-mono uppercase"
                style={{
                  fontSize: "var(--text-micro)",
                  letterSpacing: "0.12em",
                  color: "var(--color-text-dim)",
                  padding: "4px 10px",
                  border: "1px solid var(--color-border)",
                }}
              >
                {signal}
              </span>
            ))}
          </div>
        </section>

        {/* Stats */}
        {project.statistics?.length > 0 && (
          <>
            <WobblyRule />
            <section className="py-20" data-reveal>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
                {project.statistics.map((stat) => (
                  <div key={stat.label}>
                    <span className="micro block mb-2">{stat.label}</span>
                    <span
                      className="font-display"
                      style={{ fontSize: "var(--text-h3)", color: "var(--color-text)" }}
                    >
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {/* Gut punch */}
        <GutPunchCloser text={project.gutPunch} />

        {/* Schematic */}
        <div
          className="grid grid-cols-2 sm:grid-cols-4 gap-6 p-6 mb-20"
          style={{
            backgroundColor: "var(--color-surface)",
            border: "1px solid var(--color-border)",
          }}
          data-reveal
        >
          <div className="flex flex-col gap-1">
            <span className="micro">Typography</span>
            <span className="font-mono" style={{ fontSize: "var(--text-micro)", color: "var(--color-text)" }}>
              {project.schematic.typography}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="micro">Grid</span>
            <span className="font-mono" style={{ fontSize: "var(--text-micro)", color: "var(--color-text)" }}>
              {project.schematic.grid}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="micro">Stack</span>
            <span className="font-mono" style={{ fontSize: "var(--text-micro)", color: "var(--color-text)" }}>
              {project.schematic.stack.join(", ")}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="micro">Palette</span>
            <div className="flex gap-1 mt-1">
              {project.schematic.colors?.map((c) => (
                <div
                  key={c}
                  style={{
                    width: 14,
                    height: 14,
                    backgroundColor: c,
                    border: "1px solid var(--color-border)",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Prev / Next Navigation ── */}
      <div
        className="grid grid-cols-2"
        style={{ borderTop: "1px solid var(--color-border)" }}
      >
        <Link
          href={`/work/${prevProject.id}`}
          className="block px-6 sm:px-12 py-16 transition-colors duration-500 hover:bg-[var(--color-surface)]"
          style={{ borderRight: "1px solid var(--color-border)" }}
        >
          <span className="micro block mb-3">← Previous</span>
          <h3
            className="font-display"
            style={{ fontSize: "var(--text-h3)", color: "var(--color-text)", lineHeight: 1.3 }}
          >
            {prevProject.title}
          </h3>
        </Link>
        <Link
          href={`/work/${nextProject.id}`}
          className="block px-6 sm:px-12 py-16 text-right transition-colors duration-500 hover:bg-[var(--color-surface)]"
        >
          <span className="micro block mb-3">Next →</span>
          <h3
            className="font-display"
            style={{ fontSize: "var(--text-h3)", color: "var(--color-text)", lineHeight: 1.3 }}
          >
            {nextProject.title}
          </h3>
        </Link>
      </div>

      {/* ── Footer ── */}
      <Colophon />
    </div>
  );
}
