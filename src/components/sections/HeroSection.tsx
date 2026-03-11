"use client";

import { useRef, useEffect, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { motion } from "framer-motion";

/**
 * Hero — Console Display
 * Large monospaced name, role as a dim label,
 * subtle oscilloscope line, grid-line texture background.
 */

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [year] = useState(() => new Date().getFullYear());

  useGSAP(
    () => {
      if (reduced || !sectionRef.current) return;

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "+=100vh",
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
      });

      gsap.to(".hero-content", {
        yPercent: -15,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=100vh",
          scrub: 1.5,
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen flex items-center justify-center overflow-hidden"
    >
      {/* 
        Background is now handled by GlobalCanvas (FluidBackground)
        We intentionally leave this section transparent so the WebGL context shows through.
      */}

      {/* Content */}
      <div className="hero-content relative z-10 flex flex-col items-center text-center px-6">
        {/* Status indicator */}
        <motion.div
          className="flex items-center gap-2 mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: "#4ade80" }}
          />
          <span className="label" style={{ fontSize: "var(--text-xs)" }}>
            Available for work
          </span>
        </motion.div>

        {/* Name */}
        <motion.h1
          className="font-mono uppercase tracking-[0.08em] leading-none"
          style={{ fontSize: "var(--text-display)", color: "var(--color-text)" }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          Ryan Jun
        </motion.h1>

        {/* Role */}
        <motion.p
          className="font-sans mt-4 tracking-[0.05em]"
          style={{
            fontSize: "var(--text-sm)",
            color: "var(--color-text-dim)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
        >
          Design Engineer
        </motion.p>

        {/* Coordinates / Year */}
        <motion.p
          className="font-mono uppercase tracking-[0.2em] mt-6"
          style={{
            color: "var(--color-text-ghost)",
            fontSize: "var(--text-xs)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
        >
          40.7128° N · NYC · {year}
        </motion.p>
      </div>

      {/* Scroll cue */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        style={{ color: "var(--color-text-ghost)" }}
        animate={{ opacity: [0.1, 0.4, 0.1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg
          width="1"
          height="48"
          viewBox="0 0 1 48"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        >
          <line x1="0.5" y1="0" x2="0.5" y2="48" />
        </svg>
      </motion.div>
    </section>
  );
}
