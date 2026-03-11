"use client";

import { useRef, useState, useCallback } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import SplitText from "@/components/ui/SplitText";
import MagneticButton from "@/components/ui/MagneticButton";
import LocalTime from "@/components/ui/LocalTime";
import RollingLink from "@/components/RollingLink";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const SOCIALS = [
  { label: "GitHub", href: "#" },
  { label: "LinkedIn", href: "#" },
  { label: "Twitter", href: "#" },
];

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);
  const reduced = useReducedMotion();

  const email = "hello@hkjstudio.com";

  useGSAP(
    () => {
      if (reduced || !sectionRef.current) return;

      gsap.fromTo(
        sectionRef.current,
        { backgroundColor: "#0a0a0a" },
        {
          backgroundColor: "#111110",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "top 20%",
            scrub: 1.5,
          },
        }
      );
    },
    { scope: sectionRef }
  );

  const copyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      const input = document.createElement("input");
      input.value = email;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }, [email]);

  return (
    <section
      ref={sectionRef}
      data-section="contact"
      className="relative min-h-screen flex flex-col justify-center px-6 md:px-12"
    >
      <div className="max-w-5xl">
        {/* Heading */}
        <SplitText
          text="Let's work together."
          tag="h2"
          type="words"
          animation="slide-up"
          stagger={0.08}
          duration={1}
          ease="power3.out"
          className="font-serif italic leading-tight mb-6"
          splitClassName="mr-[0.25em]"
          style={{ fontSize: "var(--text-2xl)" }}
        />

        {/* Personal note */}
        <p
          className="mb-10 font-mono uppercase tracking-widest"
          style={{
            color: "var(--color-text-dim)",
            fontSize: "var(--text-xs)",
          }}
        >
          Currently open to projects that make me nervous.
        </p>

        {/* The email IS the CTA */}
        <MagneticButton
          strength={0.2}
          radius={200}
          scale={1.02}
          onClick={copyEmail}
          className="group"
        >
          <h3
            className="font-serif italic leading-tight transition-colors duration-500"
            style={{
              fontSize: "var(--text-3xl)",
              color: copied ? "var(--color-gold)" : "var(--color-text)",
            }}
          >
            {copied ? "Copied." : email}
          </h3>
        </MagneticButton>

        <p
          className="mt-4 font-mono transition-opacity duration-300"
          style={{
            color: "var(--color-text-dim)",
            fontSize: "var(--text-xs)",
            opacity: copied ? 0 : 0.5,
          }}
        >
          Click to copy. I read every email.
        </p>
      </div>

      {/* Footer area */}
      <div
        className="absolute bottom-0 left-0 right-0 px-6 md:px-12 py-8"
        style={{ borderTop: "1px solid var(--color-border)" }}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          {/* Social links with RollingLink */}
          <div className="flex gap-8">
            {SOCIALS.map((s) => (
              <RollingLink key={s.label} href={s.href} label={s.label} />
            ))}
          </div>

          <div className="flex items-center gap-8">
            <LocalTime />
            <span
              className="font-mono"
              style={{
                color: "var(--color-text-dim)",
                fontSize: "var(--text-xs)",
                opacity: 0.4,
              }}
            >
              &copy; {new Date().getFullYear()} HKJ Studio
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
