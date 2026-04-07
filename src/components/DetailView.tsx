"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import GameLink from "./GameLink";
import type { Piece } from "@/constants/pieces";
import type { CaseStudy } from "@/constants/case-studies";

interface DetailViewProps {
  piece: Piece;
  caseStudy?: CaseStudy;
  nextSlug: string;
  nextTitle: string;
  backHref: string;
  backLabel: string;
}

const reveal = {
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { type: "spring" as const, stiffness: 120, damping: 20, mass: 0.8, delay: 0.1 },
};

export default function DetailView({
  piece,
  caseStudy: cs,
  nextSlug,
  nextTitle,
  backHref,
  backLabel,
}: DetailViewProps) {
  const basePath = backHref === "/index" ? "/index" : "/archive";

  return (
    <main id="main" className="scrollable-screen">
      {/* Top bar — fixed */}
      <div
        className="sticky top-0 z-30 flex items-center justify-between h-14"
        style={{
          paddingInline: "clamp(32px, 8vw, 96px)",
          background: "rgba(10, 10, 11, 0.7)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--fg-4)",
        }}
      >
        <GameLink
          href={backHref}
          className="font-mono text-[11px] tracking-[0.04em] hover:opacity-60 transition-opacity"
          style={{ color: "var(--fg-2)" }}
          data-cursor="link"
        >
          ← {backLabel}
        </GameLink>
        <span
          className="font-mono text-[10px] tracking-[0.12em] uppercase"
          style={{ color: "var(--fg-3)" }}
        >
          {piece.title}
        </span>
      </div>

      {/* Hero media */}
      <div style={{ paddingInline: "clamp(32px, 8vw, 96px)" }}>
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: "16/9" }}>
          {piece.video ? (
            <video
              src={piece.video}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />
          ) : piece.image ? (
            <Image
              src={piece.image}
              alt={piece.title}
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full" style={{ background: piece.cover.bg }} />
          )}

          {/* Corner accents on hero */}
          <div className="absolute top-0 left-0 w-5 h-px" style={{ background: "var(--accent-warm-1)" }} />
          <div className="absolute top-0 left-0 h-5 w-px" style={{ background: "var(--accent-warm-1)" }} />
          <div className="absolute bottom-0 right-0 w-5 h-px" style={{ background: "var(--accent-warm-1)", opacity: 0.4 }} />
          <div className="absolute bottom-0 right-0 h-5 w-px" style={{ background: "var(--accent-warm-1)", opacity: 0.4 }} />
        </div>
      </div>

      {/* Project header */}
      <motion.div
        className="mt-10 mb-8"
        style={{ paddingInline: "clamp(32px, 8vw, 96px)" }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <span
          className="block font-mono text-[10px] tracking-[0.14em] uppercase mb-3"
          style={{ color: "var(--accent-warm-1)" }}
        >
          {String(piece.order).padStart(2, "0")} — {piece.type === "project" ? "Project" : "Experiment"}
        </span>

        <h1
          className="font-display font-normal tracking-[-0.02em] leading-[1.1] mb-4"
          style={{ fontSize: "clamp(32px, 4vw, 52px)", color: "var(--fg)" }}
        >
          {piece.title}
        </h1>

        <p className="text-[14px] leading-[1.7] max-w-[560px] mb-6" style={{ color: "var(--fg-2)" }}>
          {piece.description}
        </p>

        <div className="flex items-center gap-3 flex-wrap">
          {piece.tags.map((tag) => (
            <span
              key={tag}
              className="font-mono text-[9px] uppercase tracking-[0.1em] px-2.5 py-1 border rounded-sm"
              style={{ color: "var(--fg-3)", borderColor: "var(--fg-4)" }}
            >
              {tag}
            </span>
          ))}
          <span className="font-mono text-[10px] tabular-nums ml-2" style={{ color: "var(--fg-3)" }}>
            {piece.status === "wip" ? "WIP" : piece.year}
          </span>
        </div>
      </motion.div>

      {/* Case study content */}
      {cs && (
        <article
          className="max-w-[680px] pb-16"
          style={{ paddingInline: "clamp(32px, 8vw, 96px)" }}
        >
          {/* Divider */}
          <div className="relative h-px my-10" style={{ background: "var(--fg-4)" }}>
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rotate-45"
              style={{ background: "var(--fg-4)" }}
            />
          </div>

          <motion.h2
            {...reveal}
            className="font-display font-normal tracking-[-0.02em] leading-[1.15] mb-4"
            style={{ fontSize: "clamp(22px, 3vw, 32px)", color: "var(--fg)" }}
          >
            {cs.editorial.heading}
          </motion.h2>

          {cs.editorial.subhead && (
            <motion.p
              {...reveal}
              className="font-mono text-[10px] uppercase tracking-[0.08em] mb-4"
              style={{ color: "var(--fg-3)" }}
            >
              {cs.editorial.subhead}
            </motion.p>
          )}

          <motion.p {...reveal} className="text-[14px] leading-[1.75]" style={{ color: "var(--fg-2)" }}>
            {cs.editorial.copy}
          </motion.p>

          {cs.process && (
            <>
              <div className="relative h-px my-10" style={{ background: "var(--fg-4)" }}>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rotate-45" style={{ background: "var(--fg-4)" }} />
              </div>
              <motion.h3 {...reveal} className="font-mono text-[10px] uppercase tracking-[0.08em] mb-4" style={{ color: "var(--fg-3)" }}>
                {cs.process.title}
              </motion.h3>
              <motion.p {...reveal} className="text-[14px] leading-[1.75]" style={{ color: "var(--fg-2)" }}>
                {cs.process.copy}
              </motion.p>
            </>
          )}

          {cs.engineering && (
            <>
              <div className="relative h-px my-10" style={{ background: "var(--fg-4)" }}>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rotate-45" style={{ background: "var(--fg-4)" }} />
              </div>
              <motion.h3 {...reveal} className="font-mono text-[10px] uppercase tracking-[0.08em] mb-4" style={{ color: "var(--fg-3)" }}>
                {cs.engineering.title}
              </motion.h3>
              <motion.p {...reveal} className="text-[14px] leading-[1.75]" style={{ color: "var(--fg-2)" }}>
                {cs.engineering.copy}
              </motion.p>
              <motion.div {...reveal} className="flex gap-2 flex-wrap mt-4">
                {cs.engineering.signals.map((s) => (
                  <span key={s} className="font-mono text-[9px] uppercase tracking-[0.08em] px-2 py-0.5 border rounded-sm" style={{ color: "var(--fg-3)", borderColor: "var(--fg-4)" }}>
                    {s}
                  </span>
                ))}
              </motion.div>
            </>
          )}
        </article>
      )}

      {/* Next project */}
      <div
        className="pb-12"
        style={{
          paddingInline: "clamp(32px, 8vw, 96px)",
          borderTop: "1px solid var(--fg-4)",
          paddingTop: "2rem",
        }}
      >
        <GameLink
          href={`${basePath}/${nextSlug}`}
          className="group inline-flex flex-col gap-1"
          data-cursor="link"
        >
          <span className="font-mono text-[9px] uppercase tracking-[0.1em]" style={{ color: "var(--fg-3)" }}>
            Next project
          </span>
          <span
            className="font-display text-[clamp(20px,3vw,28px)] tracking-[-0.02em] transition-all duration-300 group-hover:translate-x-2"
            style={{ color: "var(--fg)" }}
          >
            {nextTitle}
          </span>
        </GameLink>
      </div>
    </main>
  );
}
