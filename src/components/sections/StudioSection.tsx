"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * StudioSection — Inline Editorial Interlude
 * 
 * Short breathing section between Hero and Work.
 * Two columns: editorial philosophy left, capabilities right.
 * Not a full-height section — compact and purposeful.
 * 
 * Fixes: removed double-padding bug (old code had className py-24 AND 
 * style padding: 6rem which conflicted). Now uses balanced clamp padding.
 */

const CAPABILITIES = [
  "Design Systems",
  "React Native",
  "Next.js / Vercel",
  "Motion Design",
  "Prototyping",
  "AI Integration",
  "Brand Identity",
  "Systems Thinking",
];

export default function StudioSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced || !sectionRef.current) return;
      const els = sectionRef.current.querySelectorAll("[data-about-reveal]");
      gsap.from(els, {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.06,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true,
        },
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="about"
      data-section="about"
      style={{
        backgroundColor: "var(--color-bg)",
        paddingTop: "clamp(4rem, 8vw, 10rem)",
        paddingBottom: "clamp(4rem, 8vw, 10rem)",
        paddingLeft: "var(--page-px)",
        paddingRight: "var(--page-px)",
        borderTop: "1px solid var(--color-border)",
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 max-w-[1200px] mx-auto">
        {/* Left — Editorial */}
        <div data-about-reveal>
          <span
            className="font-mono uppercase tracking-[0.2em] block mb-6"
            style={{ fontSize: "var(--text-micro)", color: "var(--color-text-ghost)" }}
          >
            About
          </span>
          <p
            className="font-serif"
            style={{
              fontSize: "clamp(1.25rem, 1rem + 1vw, 2rem)",
              fontWeight: 400,
              lineHeight: 1.4,
              letterSpacing: "-0.01em",
              color: "var(--color-text)",
            }}
          >
            HKJ Studio is one designer-engineer building software that feels like a precision instrument. 
            Every interface is an opportunity to create calm in complexity — where the craft disappears 
            and the user's intent flows unobstructed.
          </p>
          <p
            className="font-grotesk mt-8"
            style={{
              fontSize: "var(--text-sm)",
              lineHeight: 1.7,
              color: "var(--color-text-dim)",
              maxWidth: "480px"
            }}
          >
            Founded in NYC and Seoul, the studio specializes in the space between design and engineering — 
            where Figma files become React components, where color theory meets OKLCH color spaces, 
            and where every 4px matters.
          </p>
        </div>

        {/* Right — Capabilities */}
        <div data-about-reveal>
          <span
            className="font-mono uppercase tracking-[0.2em] block mb-6"
            style={{ fontSize: "var(--text-micro)", color: "var(--color-text-ghost)" }}
          >
            Capabilities
          </span>
          <ul className="space-y-0">
            {CAPABILITIES.map((cap, i) => (
              <li
                key={cap}
                data-about-reveal
                className="flex items-center justify-between py-4"
                style={{ borderBottom: "1px solid var(--color-border)" }}
              >
                <span
                  className="font-grotesk"
                  style={{ fontSize: "var(--text-sm)", color: "var(--color-text)", fontWeight: 450 }}
                >
                  {cap}
                </span>
                <span
                  className="font-mono tabular-nums"
                  style={{ fontSize: "var(--text-micro)", color: "var(--color-text-ghost)" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
