"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import SplitText from "@/components/ui/SplitText";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { motion } from "framer-motion";

const HeroSurface = dynamic(() => import("@/components/HeroSurface"), {
  ssr: false,
});

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

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

      // Parallax drift on scroll
      gsap.to(".hero-content", {
        yPercent: -30,
        opacity: 0.3,
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
      className="relative w-full h-screen flex flex-col justify-end overflow-hidden"
    >
      {/* Ambient WebGL Background */}
      <HeroSurface />

      {/* Content — pushed to bottom-left for editorial asymmetry */}
      <div className="hero-content relative z-10 px-6 md:px-12 pb-16 md:pb-24 max-w-4xl">
        {/* REPLACE THIS TEXT WITH YOUR OWN — this is your creative thesis */}
        <SplitText
          text="I shape how"
          tag="h1"
          type="words"
          animation="slide-up"
          stagger={0.08}
          duration={1.2}
          ease="power3.out"
          delay={0.2}
          className="font-serif italic leading-[0.95]"
          splitClassName="mr-[0.3em]"
          style={{ fontSize: "var(--text-display)" }}
        />
        <SplitText
          text="things feel."
          tag="h1"
          type="words"
          animation="slide-up"
          stagger={0.08}
          duration={1.2}
          ease="power3.out"
          delay={0.5}
          className="font-serif italic leading-[0.95]"
          splitClassName="mr-[0.3em]"
          style={{ fontSize: "var(--text-display)" }}
        />

        {/* Quiet subtitle — not a job description */}
        <p
          className="mt-8 max-w-md leading-relaxed opacity-0"
          style={{
            color: "var(--color-text-dim)",
            fontSize: "var(--text-sm)",
            animation: "fadeInSlow 1.5s ease 1.2s forwards",
          }}
        >
          Ryan Jun &mdash; design, code, motion.
          <br />
          NYC.
        </p>
      </div>

      {/* Scroll cue — minimal, not a labeled button */}
      <motion.div
        className="absolute bottom-6 right-8 z-10"
        style={{ color: "var(--color-text-dim)" }}
        animate={{ opacity: [0.2, 0.6, 0.2] }}
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
