"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export interface ProcessStep {
  title: string;
  copy: string;
  image?: string;
}

/**
 * ProcessStrip 
 * ────────────
 * Alternating left/right text + image layout for case study process documentation.
 */
export default function ProcessStrip({ steps }: { steps: ProcessStep[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced || !containerRef.current) return;
      const items = containerRef.current.querySelectorAll(".process-step");
      items.forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 30,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            once: true,
          },
        });
      });
    },
    { scope: containerRef },
  );

  if (!steps || steps.length === 0) return null;

  return (
    <div ref={containerRef} className="space-y-24 py-16">
      {steps.map((step, i) => {
        const isReversed = i % 2 !== 0;
        return (
          <div
            key={i}
            className={`process-step grid grid-cols-1 md:grid-cols-2 gap-12 items-center ${isReversed ? "md:direction-rtl" : ""}`}
          >
            {/* Text */}
            <div className={`space-y-4 ${isReversed ? "md:order-2" : ""}`}>
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-text-ghost)]">
                Step {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-serif italic text-2xl md:text-3xl text-[var(--color-text)]">
                {step.title}
              </h3>
              <p className="font-grotesk text-[var(--color-text-dim)] leading-relaxed" style={{ fontSize: "16px" }}>
                {step.copy}
              </p>
            </div>
            {/* Image */}
            <div className={`${isReversed ? "md:order-1" : ""}`}>
              {step.image && !step.image.startsWith("/placeholder") ? (
                <div className="relative w-full aspect-[16/10] border border-[var(--color-border)] overflow-hidden">
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              ) : (
                <div
                  className="w-full aspect-[16/10] flex items-center justify-center border border-dashed border-[var(--color-border)]"
                  style={{ backgroundColor: "var(--color-surface)" }}
                >
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-text-ghost)]">
                    Media Pending
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
