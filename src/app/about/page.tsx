"use client";

import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";
import { REVEAL_CONTENT } from "@/lib/animations";
import { SOCIALS, CONTACT_EMAIL } from "@/constants/contact";

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const reveals = containerRef.current.querySelectorAll("[data-reveal]");
    gsap.fromTo(reveals, REVEAL_CONTENT.from, { ...REVEAL_CONTENT.to });
  }, []);

  return (
    <div
      ref={containerRef}
      className="min-h-screen"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <section
        className="section-padding"
        style={{ paddingTop: "var(--page-pt)" }}
      >
        <div style={{ maxWidth: 560 }}>
          <span
            className="font-mono uppercase"
            style={{
              fontSize: "var(--text-micro)",
              letterSpacing: "var(--tracking-wider)",
              color: "var(--color-text-ghost)",
              display: "block",
              marginBottom: 32,
            }}
            data-reveal
          >
            About
          </span>

          <p
            className="font-sans"
            style={{
              fontSize: "var(--text-body)",
              lineHeight: "var(--leading-relaxed)",
              color: "var(--color-text)",
              marginBottom: 20,
              maxWidth: "58ch",
              letterSpacing: "var(--tracking-snug)",
            }}
            data-reveal
          >
            HKJ is a one-person design engineering practice based between
            New York and Seoul. I care about type, motion, and the invisible
            details that make software feel intentional.
          </p>

          <p
            className="font-sans"
            style={{
              fontSize: "var(--text-body)",
              lineHeight: "var(--leading-relaxed)",
              color: "var(--color-text-secondary)",
              maxWidth: "58ch",
              letterSpacing: "var(--tracking-snug)",
            }}
            data-reveal
          >
            Previously, I worked on products across mobile, AI, and design
            systems. I believe the best digital work borrows from the rigor
            of print and the warmth of physical objects.
          </p>

          <p
            className="font-mono"
            style={{
              fontSize: "var(--text-micro)",
              lineHeight: "var(--leading-relaxed)",
              color: "var(--color-text-ghost)",
              letterSpacing: "var(--tracking-wide)",
              maxWidth: "48ch",
              marginTop: 32,
            }}
            data-reveal
          >
            When I&rsquo;m not pushing pixels, I&rsquo;m probably hunting for good
            light to photograph, reading about material science, or making
            pour-overs that take too long.
          </p>

          <div
            data-reveal
            style={{
              height: 1,
              backgroundColor: "var(--color-border)",
              marginTop: 40,
              marginBottom: 32,
            }}
          />

          <div data-reveal>
            <span
              className="font-mono uppercase"
              style={{
                fontSize: "var(--text-micro)",
                letterSpacing: "var(--tracking-wider)",
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
                      fontSize: "var(--text-micro)",
                      color: "var(--color-text-ghost)",
                    }}
                  >
                    {exp.period}
                  </span>
                  <span
                    className="font-sans"
                    style={{
                      fontSize: "var(--text-body)",
                      color: "var(--color-text-secondary)",
                      lineHeight: "var(--leading-normal)",
                      letterSpacing: "var(--tracking-snug)",
                    }}
                  >
                    <span style={{ color: "var(--color-text-dim)" }}>{exp.role}</span> &mdash; {exp.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div
            data-reveal
            style={{
              height: 1,
              backgroundColor: "var(--color-border)",
              marginTop: 40,
              marginBottom: 32,
            }}
          />

          <div data-reveal>
            <span
              className="font-mono uppercase"
              style={{
                fontSize: "var(--text-micro)",
                letterSpacing: "var(--tracking-wider)",
                color: "var(--color-text-ghost)",
                display: "block",
                marginBottom: 16,
              }}
            >
              Get in touch
            </span>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="font-sans link-dim"
              style={{
                fontSize: "var(--text-body)",
                letterSpacing: "var(--tracking-snug)",
              }}
            >
              {CONTACT_EMAIL}
            </a>
            <p
              className="font-mono"
              style={{
                fontSize: "var(--text-micro)",
                color: "var(--color-text-ghost)",
                letterSpacing: "var(--tracking-wide)",
                marginTop: 8,
              }}
            >
              New York / Seoul &middot; Available for select projects
            </p>
          </div>

          <div data-reveal style={{ marginTop: 24 }}>
            <span
              className="font-mono uppercase"
              style={{
                fontSize: "var(--text-micro)",
                letterSpacing: "var(--tracking-wider)",
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
                  className="font-mono uppercase link-dim"
                  style={{
                    fontSize: "var(--text-micro)",
                    letterSpacing: "var(--tracking-wider)",
                  }}
                >
                  {link.label}
                </a>
                {i < SOCIALS.length - 1 && (
                  <span
                    className="font-mono"
                    style={{
                      fontSize: "var(--text-micro)",
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
        </div>
      </section>
    </div>
  );
}
