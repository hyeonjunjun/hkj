"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import SplitText from "@/components/ui/SplitText";
import StatusBadge from "@/components/ui/StatusBadge";
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

      gsap.to(".hero-content", {
        yPercent: -20,
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
      {/* Ambient WebGL Background */}
      <HeroSurface />

      {/* Content — centered for maximum identity impact */}
      <div className="hero-content relative z-10 flex flex-col items-center text-center px-6">
        {/* Status badge */}
        <StatusBadge className="mb-10" />

        {/* Name — the identity anchor */}
        <SplitText
          text="Ryan Jun"
          tag="h1"
          type="chars"
          animation="slide-up"
          stagger={0.04}
          duration={1.2}
          ease="power3.out"
          delay={0.3}
          className="font-serif italic leading-[0.9] tracking-[-0.02em]"
          splitClassName="mx-[0.01em]"
          style={{ fontSize: "var(--text-display)" }}
        />

        {/* Role — secondary */}
        <SplitText
          text="Design Engineer"
          tag="p"
          type="words"
          animation="fade-in"
          stagger={0.1}
          duration={0.8}
          delay={0.8}
          className="font-serif italic mt-4"
          splitClassName="mr-[0.25em]"
          style={{ fontSize: "var(--text-xl)", color: "var(--color-text-dim)" }}
        />

        {/* Location + year */}
        <p
          className="mt-6 font-mono uppercase tracking-[0.3em] opacity-0"
          style={{
            color: "var(--color-text-dim)",
            fontSize: "var(--text-xs)",
            opacity: 0,
            animation: "fadeInSlow 1.5s ease 1.4s forwards",
          }}
        >
          New York City &middot; {new Date().getFullYear()}
        </p>
      </div>

      {/* Scroll cue — centered at bottom */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        style={{ color: "var(--color-text-dim)" }}
        animate={{ opacity: [0.15, 0.5, 0.15] }}
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
