"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import GeometricFrame from "./GeometricFrame";
import type { Piece } from "@/constants/pieces";

interface ProjectSectionProps {
  piece: Piece;
  index: number;
}

const spring = { type: "spring" as const, stiffness: 80, damping: 20, mass: 1 };

export default function ProjectSection({ piece, index }: ProjectSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });
  const isEven = index % 2 === 1;
  const detailPath =
    piece.type === "project" ? `/index/${piece.slug}` : `/archive/${piece.slug}`;

  return (
    <section
      ref={ref}
      className="px-[clamp(32px,8vw,96px)]"
    >
      {/* Number + type label */}
      <motion.div
        className="flex items-center gap-4 mb-8"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <span
          className="font-mono text-[10px] tracking-[0.12em] uppercase tabular-nums"
          style={{ color: "var(--fg-3)" }}
        >
          {String(piece.order).padStart(2, "0")}
        </span>
        <div className="flex-1 h-px" style={{ background: "var(--fg-4)" }} />
        <span
          className="font-mono text-[10px] tracking-[0.12em] uppercase"
          style={{ color: "var(--fg-3)" }}
        >
          {piece.type === "project" ? "Project" : "Experiment"}
        </span>
      </motion.div>

      {/* Main content area */}
      <div
        className={`flex gap-[clamp(32px,5vw,80px)] items-start ${
          isEven ? "flex-row-reverse" : "flex-row"
        } max-md:flex-col`}
      >
        {/* Media — large, commanding */}
        <motion.div
          className="w-[62%] max-md:w-full"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ ...spring, delay: 0.2 }}
        >
          <Link href={detailPath} data-cursor="media" className="block">
            <GeometricFrame
              layoutId={`frame-${piece.slug}`}
              accentGradient={piece.type === "project" ? "warm" : "cool"}
            >
              {piece.video ? (
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full aspect-[16/10] object-cover block"
                >
                  <source src={piece.video} />
                </video>
              ) : piece.image ? (
                <Image
                  src={piece.image}
                  alt={piece.title}
                  width={1600}
                  height={1000}
                  sizes="62vw"
                  priority={index === 0}
                  className="w-full aspect-[16/10] object-cover block"
                />
              ) : (
                <div
                  className="w-full aspect-[16/10] flex items-center justify-center"
                  style={{ background: piece.cover.bg }}
                >
                  <span
                    className="font-mono text-[10px] uppercase tracking-[0.12em]"
                    style={{ color: "var(--fg-3)" }}
                  >
                    In progress
                  </span>
                </div>
              )}
            </GeometricFrame>
          </Link>
        </motion.div>

        {/* Text — refined, restrained */}
        <div
          className={`w-[38%] max-md:w-full flex flex-col justify-center ${
            isEven ? "items-end text-right max-md:items-start max-md:text-left" : ""
          }`}
          style={{ paddingTop: "clamp(16px, 3vw, 48px)" }}
        >
          <motion.h2
            className="font-display font-normal tracking-[-0.02em] leading-[1.1] mb-4"
            style={{ fontSize: "clamp(28px, 3.5vw, 44px)", color: "var(--fg)" }}
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ ...spring, delay: 0.4 }}
          >
            <Link href={detailPath}>{piece.title}</Link>
          </motion.h2>

          <motion.p
            className="text-[13px] leading-[1.7] mb-6 max-w-[320px]"
            style={{ color: "var(--fg-2)" }}
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ ...spring, delay: 0.5 }}
          >
            {piece.description}
          </motion.p>

          {/* Tags */}
          <motion.div
            className="flex gap-3 flex-wrap"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.6 }}
          >
            {piece.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="font-mono text-[9px] uppercase tracking-[0.1em] px-2.5 py-1 border rounded-sm"
                style={{
                  color: "var(--fg-3)",
                  borderColor: "var(--fg-4)",
                }}
              >
                {tag}
              </span>
            ))}
          </motion.div>

          {/* Year */}
          <motion.span
            className="font-mono text-[10px] tracking-[0.08em] mt-4 tabular-nums"
            style={{ color: "var(--fg-3)" }}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.7 }}
          >
            {piece.status === "wip" ? "WIP" : piece.year}
          </motion.span>
        </div>
      </div>
    </section>
  );
}
