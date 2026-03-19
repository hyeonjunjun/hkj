"use client";

import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";
import { SOCIALS, CONTACT_EMAIL } from "@/constants/contact";

/**
 * About Page — Atomic system (10px mono chrome / 15px sans body)
 * No ← Back, no Contact/Colophon components — all inline, consistent.
 */
export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const reveals = containerRef.current.querySelectorAll("[data-reveal]");
    gsap.fromTo(
      reveals,
      { opacity: 0, y: 6 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.06,
        ease: "power3.out",
        delay: 0.15,
      }
    );
  }, []);

  return (
    <div
      ref={containerRef}
      className="min-h-screen"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <section
        style={{
          paddingTop: 96,
          paddingBottom: 48,
          paddingLeft: "var(--page-px)",
          paddingRight: "var(--page-px)",
        }}
      >
        <div style={{ maxWidth: 560 }}>
          {/* Section label */}
          <span
            className="font-mono"
            style={{
              fontSize: 10,
              letterSpacing: "0.1em",
              textTransform: "uppercase" as const,
              color: "var(--color-text-ghost)",
              display: "block",
              marginBottom: 32,
            }}
            data-reveal
          >
            About
          </span>

          {/* Body */}
          <p
            className="font-sans"
            style={{
              fontSize: 15,
              lineHeight: 1.7,
              color: "var(--color-text)",
              marginBottom: 20,
              maxWidth: "58ch",
              letterSpacing: "-0.005em",
            }}
            data-reveal
          >
            HKJ is a one-person design engineering practice based between
            New York and Seoul. I build products that feel considered &mdash; from
            system design to pixel-level detail.
          </p>

          <p
            className="font-sans"
            style={{
              fontSize: 15,
              lineHeight: 1.7,
              color: "var(--color-text-secondary)",
              marginBottom: 20,
              maxWidth: "58ch",
              letterSpacing: "-0.005em",
            }}
            data-reveal
          >
            My work sits at the intersection of design craft and deep technical
            execution. I care about type, motion, and the invisible details that
            make software feel intentional. Every project is a chance to close
            the gap between what designers envision and what engineers ship.
          </p>

          <p
            className="font-sans"
            style={{
              fontSize: 15,
              lineHeight: 1.7,
              color: "var(--color-text-secondary)",
              maxWidth: "58ch",
              letterSpacing: "-0.005em",
            }}
            data-reveal
          >
            Previously, I worked on products across mobile, AI, and design systems.
            I believe the best digital work borrows from the rigor of print and the
            warmth of physical objects.
          </p>

          {/* Personal aside */}
          <p
            className="font-mono"
            style={{
              fontSize: 10,
              lineHeight: 1.7,
              color: "var(--color-text-ghost)",
              letterSpacing: "0.04em",
              maxWidth: "48ch",
              marginTop: 32,
            }}
            data-reveal
          >
            When I&rsquo;m not pushing pixels, I&rsquo;m probably hunting for good
            light to photograph, reading about material science, or making
            pour-overs that take too long.
          </p>

          {/* Divider */}
          <div
            data-reveal
            style={{
              height: 1,
              backgroundColor: "rgba(var(--color-text-rgb), 0.06)",
              marginTop: 40,
              marginBottom: 32,
            }}
          />

          {/* Capabilities */}
          <div data-reveal>
            <span
              className="font-mono"
              style={{
                fontSize: 10,
                letterSpacing: "0.1em",
                textTransform: "uppercase" as const,
                color: "var(--color-text-ghost)",
                display: "block",
                marginBottom: 16,
              }}
            >
              Capabilities
            </span>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { category: "Design", tools: "Figma, Type Systems, Motion Design, Editorial Layout" },
                { category: "Engineering", tools: "React, React Native, Next.js, Three.js, GSAP" },
                { category: "Infrastructure", tools: "Supabase, Vercel, Local-First, BLE" },
              ].map((cap) => (
                <div key={cap.category} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <span
                    className="font-mono"
                    style={{
                      fontSize: 10,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase" as const,
                      color: "var(--color-text-dim)",
                    }}
                  >
                    {cap.category}
                  </span>
                  <span
                    className="font-sans"
                    style={{
                      fontSize: 15,
                      color: "var(--color-text-secondary)",
                      lineHeight: 1.6,
                      letterSpacing: "-0.005em",
                    }}
                  >
                    {cap.tools}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div data-reveal style={{ marginTop: 32 }}>
            <span
              className="font-mono"
              style={{
                fontSize: 10,
                letterSpacing: "0.1em",
                textTransform: "uppercase" as const,
                color: "var(--color-text-ghost)",
                display: "block",
                marginBottom: 16,
              }}
            >
              Experience
            </span>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { period: "2024–", role: "HKJ Studio", desc: "Independent design engineering" },
                { period: "2023–24", role: "Product", desc: "Mobile & AI products" },
                { period: "2022–23", role: "Design Systems", desc: "Component architecture & tokens" },
              ].map((exp) => (
                <div key={exp.period} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <span
                    className="font-mono"
                    style={{
                      fontSize: 10,
                      color: "var(--color-text-ghost)",
                    }}
                  >
                    {exp.period}
                  </span>
                  <span
                    className="font-sans"
                    style={{
                      fontSize: 15,
                      color: "var(--color-text-secondary)",
                      lineHeight: 1.6,
                      letterSpacing: "-0.005em",
                    }}
                  >
                    <span style={{ color: "var(--color-text-dim)" }}>{exp.role}</span> &mdash; {exp.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div
            data-reveal
            style={{
              height: 1,
              backgroundColor: "rgba(var(--color-text-rgb), 0.06)",
              marginTop: 40,
              marginBottom: 32,
            }}
          />

          {/* Contact */}
          <div data-reveal>
            <span
              className="font-mono"
              style={{
                fontSize: 10,
                letterSpacing: "0.1em",
                textTransform: "uppercase" as const,
                color: "var(--color-text-ghost)",
                display: "block",
                marginBottom: 16,
              }}
            >
              Get in touch
            </span>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="font-sans"
              style={{
                fontSize: 15,
                color: "var(--color-text-dim)",
                textDecoration: "none",
                transition: "color 0.3s ease",
                letterSpacing: "-0.005em",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--color-text)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--color-text-dim)")
              }
            >
              {CONTACT_EMAIL}
            </a>
            <p
              className="font-mono"
              style={{
                fontSize: 10,
                color: "var(--color-text-ghost)",
                letterSpacing: "0.04em",
                marginTop: 8,
              }}
            >
              New York / Seoul &middot; Available for select projects
            </p>
          </div>

          {/* See also */}
          <div data-reveal style={{ marginTop: 24 }}>
            <span
              className="font-mono"
              style={{
                fontSize: 10,
                letterSpacing: "0.1em",
                textTransform: "uppercase" as const,
                color: "var(--color-text-ghost)",
                marginRight: 16,
              }}
            >
              See also:
            </span>
            {SOCIALS.map((link, i) => (
              <span key={link.label}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono"
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase" as const,
                    color: "var(--color-text-dim)",
                    textDecoration: "none",
                    transition: "color 0.3s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "var(--color-text)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "var(--color-text-dim)")
                  }
                >
                  {link.label}
                </a>
                {i < SOCIALS.length - 1 && (
                  <span
                    className="font-mono"
                    style={{
                      fontSize: 10,
                      color: "var(--color-text-ghost)",
                      margin: "0 8px",
                    }}
                  >
                    ·
                  </span>
                )}
              </span>
            ))}
          </div>

          {/* Colophon */}
          <div
            data-reveal
            style={{
              marginTop: 64,
              paddingTop: 24,
              borderTop: "1px solid rgba(var(--color-text-rgb), 0.06)",
            }}
          >
            <span
              className="font-mono"
              style={{
                fontSize: 10,
                color: "var(--color-text-ghost)",
                letterSpacing: "0.04em",
              }}
            >
              Designed & built by HKJ · Set in GT Alpina & Söhne · © 2026
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
