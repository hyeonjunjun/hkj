"use client";

import { useRef, useState, useCallback } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import MagneticButton from "@/components/ui/MagneticButton";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Contact — intimate, not corporate.
 * The email is the entire section. Giant. Unmissable.
 * A personal closing note, not a CTA.
 */

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
        {/* Personal note — not a CTA */}
        <p
          className="mb-8 font-mono uppercase tracking-widest"
          style={{
            color: "var(--color-text-dim)",
            fontSize: "var(--text-xs)",
          }}
        >
          Currently open to projects that make me nervous.
        </p>

        {/* The email IS the section */}
        <MagneticButton
          strength={0.2}
          radius={200}
          scale={1.02}
          onClick={copyEmail}
          className="group"
        >
          <h2
            className="font-serif italic leading-tight transition-colors duration-500"
            style={{
              fontSize: "var(--text-3xl)",
              color: copied ? "var(--color-gold)" : "var(--color-text)",
            }}
          >
            {copied ? "Copied." : email}
          </h2>
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

        {/* Minimal links — no labeled "social links" section */}
        <div className="mt-24 flex gap-8">
          {["GitHub", "LinkedIn", "Twitter"].map((label) => (
            <a
              key={label}
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono uppercase tracking-wider transition-colors duration-300"
              style={{
                fontSize: "var(--text-xs)",
                color: "var(--color-text-dim)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--color-gold)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--color-text-dim)")
              }
              data-cursor="magnetic"
            >
              {label}
            </a>
          ))}
        </div>
      </div>

      {/* Footer — barely there */}
      <div className="absolute bottom-8 left-6 md:left-12">
        <p
          className="font-mono"
          style={{
            color: "var(--color-text-dim)",
            fontSize: "var(--text-xs)",
            opacity: 0.4,
          }}
        >
          &copy; {new Date().getFullYear()} HKJ Studio
        </p>
      </div>
    </section>
  );
}
