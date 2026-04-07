"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import GameLink from "@/components/GameLink";
import { PIECES } from "@/constants/pieces";

const projects = PIECES.filter((p) => p.type === "project").sort(
  (a, b) => a.order - b.order
);

export default function IndexPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = projects[activeIndex];

  return (
    <main id="main" className="game-screen">
      {/* Full-screen media background */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={active.slug}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {active.video ? (
              <video
                src={active.video}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
            ) : active.image ? (
              <Image
                src={active.image}
                alt={active.title}
                fill
                sizes="100vw"
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full" style={{ background: active.cover.bg }} />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Left-side readability gradient */}
        <div
          className="absolute inset-0 z-10"
          style={{
            background:
              "linear-gradient(to right, rgba(10,10,11,0.85) 0%, rgba(10,10,11,0.4) 50%, rgba(10,10,11,0.15) 100%)",
          }}
        />
        {/* Bottom gradient */}
        <div
          className="absolute inset-0 z-10"
          style={{
            background: "linear-gradient(to top, rgba(10,10,11,0.6) 0%, transparent 25%)",
          }}
        />
      </div>

      {/* Top bar */}
      <div
        className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between h-14"
        style={{ paddingInline: "clamp(32px, 8vw, 96px)" }}
      >
        <GameLink
          href="/"
          className="font-mono text-[11px] tracking-[0.04em] hover:opacity-60 transition-opacity"
          style={{ color: "var(--fg-2)" }}
          data-cursor="link"
        >
          ← Back
        </GameLink>
        <span
          className="font-mono text-[10px] tracking-[0.12em] uppercase"
          style={{ color: "var(--fg-3)" }}
        >
          Index — Projects
        </span>
      </div>

      {/* Project info — left side, vertically centered */}
      <div
        className="absolute left-[clamp(32px,8vw,96px)] top-1/2 -translate-y-1/2 z-20"
        style={{ maxWidth: "380px" }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={active.slug}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Number */}
            <span
              className="block font-mono text-[10px] tracking-[0.14em] uppercase mb-4 tabular-nums"
              style={{ color: "var(--accent-warm-1)" }}
            >
              {String(active.order).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
            </span>

            {/* Title */}
            <h1
              className="font-display font-normal tracking-[-0.02em] leading-[1.05] mb-4"
              style={{ fontSize: "clamp(36px, 5vw, 56px)", color: "var(--fg)" }}
            >
              {active.title}
            </h1>

            {/* Description */}
            <p className="text-[13px] leading-[1.7] mb-6" style={{ color: "var(--fg-2)" }}>
              {active.description}
            </p>

            {/* Tags */}
            <div className="flex gap-2 flex-wrap mb-8">
              {active.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-[9px] uppercase tracking-[0.1em] px-2.5 py-1 border rounded-sm"
                  style={{ color: "var(--fg-3)", borderColor: "var(--fg-4)" }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* View project CTA */}
            <GameLink
              href={`/index/${active.slug}`}
              className="inline-flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.1em] transition-all duration-300 group"
              style={{ color: "var(--fg-2)" }}
              data-cursor="link"
            >
              <span className="group-hover:text-[var(--fg)] transition-colors duration-300">
                View project
              </span>
              <div
                className="w-6 group-hover:w-10 h-px transition-all duration-500"
                style={{ background: "linear-gradient(90deg, var(--accent-warm-1), transparent)" }}
              />
            </GameLink>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Character selector — right side, vertical strip */}
      <div className="absolute right-[clamp(32px,8vw,96px)] top-1/2 -translate-y-1/2 z-30 flex flex-col gap-3">
        {projects.map((piece, i) => {
          const isActive = i === activeIndex;
          return (
            <button
              key={piece.slug}
              onClick={() => setActiveIndex(i)}
              className="relative w-[72px] h-[72px] overflow-hidden transition-all duration-500"
              data-cursor="link"
              style={{
                border: isActive
                  ? "1px solid var(--accent-warm-1)"
                  : "1px solid rgba(240,238,232,0.1)",
                opacity: isActive ? 1 : 0.5,
              }}
            >
              {piece.image ? (
                <Image src={piece.image} alt={piece.title} fill sizes="64px" className="object-cover" />
              ) : (
                <div className="w-full h-full" style={{ background: piece.cover.bg }} />
              )}
              {isActive && (
                <>
                  <motion.div
                    className="absolute top-0 left-0 w-2.5 h-px"
                    style={{ background: "var(--accent-warm-1)" }}
                    layoutId="selector-h"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                  <motion.div
                    className="absolute top-0 left-0 h-2.5 w-px"
                    style={{ background: "var(--accent-warm-1)" }}
                    layoutId="selector-v"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                </>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom info */}
      <div
        className="absolute bottom-6 left-[clamp(32px,8vw,96px)] right-[clamp(32px,8vw,96px)] z-20 flex justify-between items-end"
      >
        <span className="font-mono text-[10px] tracking-[0.06em] tabular-nums" style={{ color: "var(--fg-3)" }}>
          {active.status === "wip" ? "In progress" : active.year}
        </span>
        <span className="font-mono text-[10px] tracking-[0.06em]" style={{ color: "var(--fg-3)" }}>
          {active.type === "project" ? "Project" : "Experiment"}
        </span>
      </div>
    </main>
  );
}
