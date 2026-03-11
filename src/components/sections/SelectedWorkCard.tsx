"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { motion } from "framer-motion";
import type { Project } from "@/constants/projects";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { usePageTransition } from "@/hooks/usePageTransition";

interface SelectedWorkCardProps {
  project: Project;
  index: number;
}

export default function SelectedWorkCard({
  project,
  index,
}: SelectedWorkCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const xTo = useRef<ReturnType<typeof gsap.quickTo> | null>(null);
  const yTo = useRef<ReturnType<typeof gsap.quickTo> | null>(null);
  const reduced = useReducedMotion();
  const navigate = usePageTransition();
  const num = String(index + 1).padStart(2, "0");

  // Card entrance animation
  useGSAP(
    () => {
      if (reduced || !cardRef.current) return;

      gsap.from(cardRef.current, {
        opacity: 0,
        y: 100,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    },
    { scope: cardRef }
  );

  // Image parallax on scroll
  useGSAP(
    () => {
      if (reduced || !imageRef.current || !cardRef.current) return;

      gsap.fromTo(
        imageRef.current,
        { yPercent: -8 },
        {
          yPercent: 8,
          ease: "none",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          },
        }
      );
    },
    { scope: cardRef }
  );

  // Mouse-tracking parallax on image hover
  useEffect(() => {
    if (reduced || !imageRef.current) return;

    xTo.current = gsap.quickTo(imageRef.current, "x", {
      duration: 0.8,
      ease: "power3.out",
    });
    yTo.current = gsap.quickTo(imageRef.current, "y", {
      duration: 0.8,
      ease: "power3.out",
    });
  }, [reduced]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current || !xTo.current || !yTo.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const cx = (e.clientX - rect.left) / rect.width - 0.5;
    const cy = (e.clientY - rect.top) / rect.height - 0.5;
    xTo.current(cx * 20);
    yTo.current(cy * 10);
  };

  const handleMouseLeave = () => {
    xTo.current?.(0);
    yTo.current?.(0);
  };

  return (
    <motion.div
      ref={cardRef}
      role="link"
      tabIndex={0}
      onClick={(e) => navigate(`/work/${project.id}`, e)}
      onKeyDown={(e) => {
        if (e.key === "Enter") navigate(`/work/${project.id}`);
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group cursor-pointer mb-24 md:mb-40 px-6 md:px-12"
      data-cursor="explore"
      whileHover="hover"
    >
      {/* Number + Metadata row */}
      <div className="flex justify-between items-baseline mb-4 max-w-7xl mx-auto">
        <span
          className="font-mono uppercase tracking-widest"
          style={{ fontSize: "var(--text-xs)", color: "var(--color-text-dim)" }}
        >
          {num}
        </span>
        <span
          className="font-mono uppercase tracking-widest"
          style={{ fontSize: "var(--text-xs)", color: "var(--color-text-dim)" }}
        >
          {project.sector} &middot; {project.year}
        </span>
      </div>

      {/* Image container */}
      <div className="relative w-full max-w-7xl mx-auto aspect-[16/9] md:aspect-[16/9] overflow-hidden rounded-sm">
        <div ref={imageRef} className="absolute inset-[-10%]">
          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes="100vw"
            className="object-cover transition-[filter] duration-500 group-hover:brightness-110"
            priority={index === 0}
          />
        </div>
        {/* Vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)",
          }}
        />
      </div>

      {/* Title + Pitch below image */}
      <div className="max-w-7xl mx-auto mt-6">
        <h3
          className="font-serif italic leading-tight transition-colors duration-500 group-hover:text-[var(--color-gold)]"
          style={{
            fontSize: "var(--text-3xl)",
            color: "var(--color-text)",
          }}
        >
          {project.title}
        </h3>
        <p
          className="mt-3 max-w-lg leading-relaxed"
          style={{
            fontSize: "var(--text-sm)",
            color: "var(--color-text-dim)",
          }}
        >
          {project.pitch}
        </p>
      </div>
    </motion.div>
  );
}
