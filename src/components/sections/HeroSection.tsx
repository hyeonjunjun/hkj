"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useLenis } from "lenis/react";
import { useTextScramble } from "@/hooks/useTextScramble";

/**
 * ScrambleWord
 * Adds a hacker-like scramble effect to a single word on mount and hover.
 */
function ScrambleWord({ word }: { word: string }) {
  const { displayText, scramble } = useTextScramble(word);

  useEffect(() => {
    // Short delay to let the page settle before scrambling
    const t = setTimeout(() => {
      scramble();
    }, 400);
    return () => clearTimeout(t);
  }, [scramble]);

  return (
    <span 
      onMouseEnter={scramble}
      className="inline-block cursor-crosshair transition-colors hover:text-[var(--color-accent)]"
    >
      {displayText}
    </span>
  );
}

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const lenis = useLenis();

  const scrollTo = (target: string) => {
    const el = document.querySelector(target) as HTMLElement | null;
    if (el && lenis) lenis.scrollTo(el, { offset: 0, duration: 1.5 });
  };

  return (
    <section
      ref={sectionRef}
      data-section="hero"
      className="relative w-full flex flex-col justify-end overflow-hidden"
      style={{
        backgroundColor: "var(--color-bg)",
        minHeight: "100svh",
        padding: "var(--page-px)",
        paddingBottom: "clamp(2rem, 5vh, 4rem)",
      }}
    >
      {/* ═══ Background Noise / Grain Overlay (Valiente Vibe) ═══ */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.15]"
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
          backgroundSize: "200px 200px",
          mixBlendMode: "multiply",
        }}
      />

      {/* ═══ Massive Typographic Statement ═══ */}
      <div className="relative z-10 w-full flex flex-col">
        <motion.h1 
          className="font-display font-bold uppercase tracking-tighter leading-[0.85] w-full text-center lg:text-left"
          style={{ fontSize: "clamp(4.5rem, 16vw, 18rem)", color: "var(--color-text)" }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="overflow-hidden">
            <ScrambleWord word="DESIGN" />
          </div>
          <div className="overflow-hidden">
            <ScrambleWord word="ENGINEERING" />
          </div>
        </motion.h1>

        {/* ═══ Supporting Info (Bottom Bar) ═══ */}
        <div className="flex flex-col md:flex-row justify-between items-end mt-12 md:mt-16 lg:mt-24 gap-8">
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="w-full md:w-1/3"
          >
            <p className="font-sans text-balance text-[var(--color-text-dim)]" style={{ fontSize: "var(--text-lg)" }}>
              Tactile products at the intersection of high-fidelity craft and deep systems thinking.
            </p>
          </motion.div>

          <motion.button
            onClick={() => scrollTo("[data-section='about']")}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="group flex flex-col items-center gap-4 cursor-pointer"
          >
            <span className="font-mono uppercase tracking-widest text-[var(--text-micro)] text-[var(--color-text-dim)] group-hover:text-[var(--color-accent)] transition-colors">
              Scroll To Explore
            </span>
            <div className="w-[1px] h-12 bg-black/20 group-hover:bg-[var(--color-accent)] transition-colors" />
          </motion.button>

        </div>
      </div>
    </section>
  );
}
