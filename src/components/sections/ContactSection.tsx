"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * ContactSection — SNP.agency-inspired
 *
 * Dark (#151518) section with:
 * - Top: metadata columns (description left, copyright right)
 * - Center: large serif wordmark "HKJ Studio" at low opacity
 * - Left: inline conversational contact form (name input + email + send)
 * - Bottom: nav links in mixed-size serif cluster
 * - Stronger grain overlay on dark background
 *
 * No particle effects.
 */

const NAV_LINKS = [
  { label: "Work", href: "#work", size: "large" as const },
  { label: "Studio", href: "#about", size: "medium" as const },
  { label: "Contact", href: "#contact", size: "medium" as const },
  {
    label: "GitHub",
    href: "https://github.com/hyeonjunjun",
    size: "small" as const,
    external: true,
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/hyeonjunjun",
    size: "small" as const,
    external: true,
  },
  {
    label: "Twitter",
    href: "https://twitter.com/hyeonjunjun",
    size: "small" as const,
    external: true,
  },
];

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [name, setName] = useState("");
  const [copied, setCopied] = useState(false);

  useGSAP(
    () => {
      if (reduced || !sectionRef.current) return;
      const els = sectionRef.current.querySelectorAll("[data-contact-reveal]");
      gsap.from(els, {
        opacity: 0,
        y: 30,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          once: true,
        },
      });
    },
    { scope: sectionRef },
  );

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("hello@hkjstudio.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      data-section="contact"
      className="relative overflow-hidden"
      style={{
        backgroundColor: "#151518",
        color: "#F7F3ED",
        minHeight: "100vh",
      }}
    >
      {/* Grain overlay — stronger in dark */}
      <div
        className="paper-noise absolute inset-0 pointer-events-none"
        style={{ opacity: 0.06 }}
      />

      <div
        className="relative z-10 flex flex-col min-h-screen"
        style={{
          paddingLeft: "var(--page-px)",
          paddingRight: "var(--page-px)",
          paddingTop: "var(--page-px)",
          paddingBottom: "var(--page-px)",
        }}
      >
        {/* ── Top Metadata Row ── */}
        <div
          data-contact-reveal
          className="flex flex-col sm:flex-row justify-between gap-6 pt-4 pb-12"
          style={{ borderBottom: "1px solid rgba(247,243,237,0.1)" }}
        >
          <div className="max-w-md">
            <p
              className="font-mono uppercase tracking-[0.1em] leading-relaxed"
              style={{
                fontSize: "var(--text-micro)",
                color: "rgba(247,243,237,0.5)",
              }}
            >
              Design engineering at the intersection of high-fidelity craft and
              deep systems thinking. Specializing in React Native, Next.js, and
              design systems.
            </p>
          </div>
          <div className="sm:text-right">
            <p
              className="font-mono uppercase tracking-[0.1em]"
              style={{
                fontSize: "var(--text-micro)",
                color: "rgba(247,243,237,0.35)",
              }}
            >
              © 2024 — {new Date().getFullYear()} HKJ Studio
            </p>
          </div>
        </div>

        {/* ── Center Wordmark ── */}
        <div className="flex-1 flex items-center justify-center py-16 lg:py-0">
          <h2
            data-contact-reveal
            className="font-serif text-center select-none"
            style={{
              fontSize: "clamp(3rem, 8vw, 10rem)",
              fontWeight: 400,
              letterSpacing: "-0.03em",
              lineHeight: 0.9,
              color: "rgba(247,243,237,0.08)",
            }}
          >
            HKJ Studio
          </h2>
        </div>

        {/* ── Bottom Section: Form + Nav ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12 lg:gap-16 pb-4">
          {/* Left — Contact Form */}
          <div data-contact-reveal>
            <div
              className="p-6"
              style={{
                border: "1px solid rgba(247,243,237,0.1)",
                backgroundColor: "rgba(247,243,237,0.03)",
              }}
            >
              <span
                className="font-mono uppercase tracking-[0.15em] block mb-6"
                style={{
                  fontSize: "var(--text-micro)",
                  color: "rgba(247,243,237,0.4)",
                }}
              >
                To HKJ Studio
              </span>

              {/* Name input */}
              <div className="flex items-baseline gap-2 mb-6">
                <span
                  className="font-grotesk"
                  style={{ fontSize: "var(--text-sm)", color: "#F7F3ED" }}
                >
                  Hi my name is
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter"
                  className="bg-transparent border-b font-grotesk outline-none flex-1 transition-colors focus:border-[rgba(247,243,237,0.5)]"
                  style={{
                    fontSize: "var(--text-sm)",
                    color: "#F7F3ED",
                    borderColor: "rgba(247,243,237,0.2)",
                    paddingBottom: "4px",
                  }}
                />
              </div>

              {/* Action row */}
              <div className="flex items-center justify-between mt-8">
                <button
                  onClick={handleCopyEmail}
                  className="font-mono uppercase tracking-[0.1em] transition-colors hover:text-white"
                  style={{
                    fontSize: "var(--text-micro)",
                    color: "rgba(247,243,237,0.5)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {copied ? "Copied ✓" : "hello@hkjstudio.com"}
                </button>

                <a
                  href={`mailto:hello@hkjstudio.com?subject=Hello from ${name || "there"}`}
                  className="font-mono uppercase tracking-[0.1em] px-4 py-2 transition-colors hover:border-[rgba(247,243,237,0.5)]"
                  style={{
                    fontSize: "var(--text-micro)",
                    border: "1px solid rgba(247,243,237,0.2)",
                    color: "rgba(247,243,237,0.7)",
                  }}
                >
                  Send Message
                </a>
              </div>
            </div>
          </div>

          {/* Right — Nav Links Cluster */}
          <div
            data-contact-reveal
            className="flex flex-wrap items-end justify-center lg:justify-end gap-x-6 gap-y-3"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noreferrer" : undefined}
                className="font-serif transition-colors hover:text-white group"
                style={{
                  fontSize:
                    link.size === "large"
                      ? "clamp(2rem, 4vw, 3.5rem)"
                      : link.size === "medium"
                        ? "clamp(1.5rem, 3vw, 2.5rem)"
                        : "clamp(1rem, 2vw, 1.5rem)",
                  color: "rgba(247,243,237,0.6)",
                  lineHeight: 1.1,
                }}
              >
                {link.label}
                {link.size === "small" && (
                  <span
                    className="font-mono uppercase ml-1 align-super"
                    style={{
                      fontSize: "0.5em",
                      color: "rgba(247,243,237,0.3)",
                    }}
                  >
                    {link.label === "GitHub"
                      ? "CODE"
                      : link.label === "LinkedIn"
                        ? "CONNECT"
                        : "SOCIAL"}
                  </span>
                )}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
