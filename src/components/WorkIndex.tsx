"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { motion, useSpring, useMotionValue, AnimatePresence } from "framer-motion";
import { PIECES, type Piece } from "@/constants/pieces";

const allPieces = [...PIECES].sort((a, b) => a.order - b.order);

function CursorImage({ src, alt }: { src: string; alt: string }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 120, damping: 22 });
  const springY = useSpring(y, { stiffness: 120, damping: 22 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      x.set(e.clientX + 24);
      y.set(e.clientY - 100);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);

  return (
    <motion.div
      className="fixed pointer-events-none z-40 overflow-hidden"
      style={{ x: springX, y: springY, width: 280 }}
      initial={{ opacity: 0, scale: 0.92, filter: "blur(8px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 0.92, filter: "blur(8px)" }}
      transition={{ duration: 0.4, ease: [0.23, 0.88, 0.26, 0.92] }}
    >
      <Image
        src={src}
        alt={alt}
        width={560}
        height={350}
        sizes="280px"
        className="w-full"
        style={{ display: "block", objectFit: "cover" }}
      />
    </motion.div>
  );
}

export default function WorkIndex() {
  const listRef = useRef<HTMLDivElement>(null);
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  useEffect(() => {
    if (!listRef.current) return;
    const rows = listRef.current.querySelectorAll("[data-row]");

    gsap.fromTo(
      rows,
      { opacity: 0, y: 40, filter: "blur(4px)" },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.6,
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.5,
      }
    );
  }, []);

  const hoveredPiece = allPieces.find((p) => p.slug === hoveredSlug);
  const hoveredImage = hoveredPiece?.image || hoveredPiece?.coverArt;

  return (
    <section
      style={{
        paddingInline: "clamp(24px, 5vw, 64px)",
        maxWidth: 900,
        margin: "0 auto",
        paddingBottom: 72,
      }}
    >
      <span
        className="font-mono uppercase block"
        style={{
          fontSize: 10,
          letterSpacing: "0.06em",
          color: "var(--ink-muted)",
          marginBottom: 32,
        }}
      >
        Selected Work
      </span>

      <div ref={listRef}>
        {allPieces.map((piece) => (
          <ProjectRow
            key={piece.slug}
            piece={piece}
            isAnyHovered={hoveredSlug !== null}
            isThisHovered={hoveredSlug === piece.slug}
            onHover={setHoveredSlug}
          />
        ))}
      </div>

      <AnimatePresence>
        {hoveredImage && hoveredPiece && (
          <CursorImage
            key={hoveredPiece.slug}
            src={hoveredImage}
            alt={hoveredPiece.title}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

interface ProjectRowProps {
  piece: Piece;
  isAnyHovered: boolean;
  isThisHovered: boolean;
  onHover: (slug: string | null) => void;
}

function ProjectRow({ piece, isAnyHovered, isThisHovered, onHover }: ProjectRowProps) {
  const dimmed = isAnyHovered && !isThisHovered;

  return (
    <Link
      href={`/work/${piece.slug}`}
      data-row
      onMouseEnter={() => onHover(piece.slug)}
      onMouseLeave={() => onHover(null)}
      className="block group"
      style={{
        display: "flex",
        alignItems: "baseline",
        justifyContent: "space-between",
        padding: "clamp(16px, 2.5vh, 28px) 0",
        borderBottom: "1px solid var(--ink-whisper)",
        color: dimmed ? "var(--ink-faint)" : "var(--ink-primary)",
        transition: "color 0.3s var(--ease-swift)",
        opacity: 0,
      }}
    >
      <div className="flex items-baseline" style={{ gap: 20 }}>
        <span
          className="font-mono"
          style={{
            fontSize: 10,
            letterSpacing: "0.04em",
            fontVariantNumeric: "tabular-nums",
            color: dimmed ? "var(--ink-whisper)" : "var(--ink-ghost)",
            transition: "color 0.3s var(--ease-swift)",
          }}
        >
          {piece.number}
        </span>

        <span
          className="font-display"
          style={{
            fontSize: "clamp(18px, 2.5vw, 24px)",
            fontWeight: 400,
            lineHeight: 1.35,
            letterSpacing: "-0.01em",
          }}
        >
          {piece.title}
        </span>
      </div>

      <div className="flex items-baseline" style={{ gap: 16 }}>
        <span
          className="font-mono uppercase mobile:hidden"
          style={{
            fontSize: 10,
            letterSpacing: "0.06em",
            color: dimmed ? "var(--ink-whisper)" : "var(--ink-muted)",
            transition: "color 0.3s var(--ease-swift)",
          }}
        >
          {piece.sector}
        </span>
        <span
          className="font-mono"
          style={{
            fontSize: 10,
            letterSpacing: "0.04em",
            fontVariantNumeric: "tabular-nums",
            color: dimmed ? "var(--ink-whisper)" : "var(--ink-muted)",
            transition: "color 0.3s var(--ease-swift)",
          }}
        >
          {piece.status === "wip" ? "In Progress" : piece.year}
        </span>
      </div>
    </Link>
  );
}
