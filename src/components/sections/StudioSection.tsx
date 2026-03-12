"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/* ═══════════════════════════════════════════
   StudioSection — Nothing OS / Teenage Eng
   Hardware spec sheet aesthetic.
   ═══════════════════════════════════════════ */

export default function StudioSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced || !sectionRef.current) return;

      gsap.from(".spec-row", {
        opacity: 0,
        x: -10,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          once: true,
        },
      });
      
      gsap.from(".studio-image-box", {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          once: true,
        },
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      data-section="about"
      className="relative w-full border-b border-[var(--color-border)]"
      style={{
        backgroundColor: "var(--color-bg)",
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-[var(--color-border)]">
        
        {/* ─── Left: Image & Hardware Vibe ─── */}
        <div className="p-8 lg:p-16 flex flex-col justify-center items-center relative overflow-hidden">
          {/* Faux grid background */}
          <div 
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: "linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
              backgroundPosition: "center center"
            }}
          />
          
          <div className="studio-image-box relative w-full max-w-sm border border-[var(--color-border)] p-2 bg-[var(--color-bg)] shadow-[4px_4px_0_var(--color-border)]">
            <div className="flex justify-between items-center px-2 py-1 border-b border-[var(--color-border)] mb-2">
               <span className="font-mono text-[10px] tracking-widest uppercase text-[var(--color-text-dim)]">FIG 1.0</span>
               <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-pulse" />
            </div>
            <div className="relative overflow-hidden w-full" style={{ aspectRatio: "3/4" }}>
              <Image
                src="/images/ethereal_butterfly.jpeg"
                alt="Studio Aesthetic"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover grayscale contrast-125"
              />
            </div>
            {/* Tech overlays */}
            <div className="absolute bottom-4 left-4 font-mono text-[10px] text-white mix-blend-difference tracking-widest drop-shadow-md">
              REC // 00:00:00
            </div>
          </div>
        </div>

        {/* ─── Right: Spec Sheet ─── */}
        <div className="p-8 lg:p-16 flex flex-col justify-center bg-[var(--color-surface)]">
          <div className="mb-12">
            <span className="font-mono text-[var(--text-micro)] uppercase tracking-widest text-[var(--color-text-ghost)] mb-6 block border border-[var(--color-border)] w-fit px-2 py-1 bg-[var(--color-bg)]">
              {"//"} MANUAL : SEC.01
            </span>
            <h2 className="font-display text-4xl lg:text-5xl uppercase tracking-tighter mb-6 leading-[0.9]">
              Systems &<br/>Surfaces
            </h2>
            <p className="font-sans text-[var(--text-base)] text-[var(--color-text-dim)] max-w-md leading-relaxed">
              A one-person studio at the intersection of high-fidelity craft and deep systems thinking. Specializing in React Native, Next.js, and design systems that feel like instruments—precise, purposeful, built to last.
            </p>
          </div>

          {/* Specs Table */}
          <ul className="border-t border-[var(--color-border)]">
            <li className="spec-row flex justify-between items-center py-4 border-b border-[var(--color-border)]">
              <span className="font-mono text-[var(--text-xs)] uppercase tracking-widest text-[var(--color-text-ghost)]">Model</span>
              <span className="font-mono text-[var(--text-sm)] uppercase">HKJ-01</span>
            </li>
            <li className="spec-row flex justify-between items-center py-4 border-b border-[var(--color-border)]">
              <span className="font-mono text-[var(--text-xs)] uppercase tracking-widest text-[var(--color-text-ghost)]">Function</span>
              <span className="font-mono text-[var(--text-sm)] uppercase text-right">Design Engineer</span>
            </li>
            <li className="spec-row flex justify-between items-center py-4 border-b border-[var(--color-border)]">
              <span className="font-mono text-[var(--text-xs)] uppercase tracking-widest text-[var(--color-text-ghost)]">Location</span>
              <span className="font-mono text-[var(--text-sm)] uppercase text-right">NYC / Seoul</span>
            </li>
            <li className="spec-row flex justify-between items-center py-4 border-b border-[var(--color-border)]">
              <span className="font-mono text-[var(--text-xs)] uppercase tracking-widest text-[var(--color-text-ghost)]">Core Stack</span>
              <span className="font-mono text-[var(--text-sm)] uppercase text-right max-w-[150px] sm:max-w-none text-balance leading-tight">Next.js, TS, React Native</span>
            </li>
            <li className="spec-row flex justify-between items-center py-4 border-b border-[var(--color-border)]">
              <span className="font-mono text-[var(--text-xs)] uppercase tracking-widest text-[var(--color-text-ghost)]">Status</span>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse hidden sm:block"></span>
                <span className="font-mono text-[var(--text-sm)] uppercase">Available</span>
              </div>
            </li>
          </ul>

        </div>
      </div>
    </section>
  );
}
