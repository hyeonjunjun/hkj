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
    >
      <section
        style={{ paddingLeft: "var(--page-px)", paddingRight: "var(--page-px)", paddingTop: "clamp(80px, 12vh, 140px)" }}
      >
        <div style={{ maxWidth: "var(--max-text)" }}>
          <span
            className="font-mono uppercase"
            style={{
              fontSize: "var(--text-meta)",
              letterSpacing: "var(--tracking-label)",
              color: "var(--ink-muted)",
              display: "block",
              marginBottom: 32,
            }}
            data-reveal
          >
            About
          </span>

          <p
           
            style={{
              fontSize: "var(--text-body)",
              lineHeight: "var(--leading-body)",
              color: "var(--ink-primary)",
              marginBottom: 20,
              maxWidth: "58ch",
              letterSpacing: "-0.01em",
            }}
            data-reveal
          >
            HKJ is a one-person design engineering practice based in
            New York. I care about type, motion, and the invisible
            details that make software feel intentional.
          </p>

          <p
           
            style={{
              fontSize: "var(--text-body)",
              lineHeight: "var(--leading-body)",
              color: "var(--ink-secondary)",
              maxWidth: "58ch",
              letterSpacing: "-0.01em",
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
              fontSize: "var(--text-meta)",
              lineHeight: "var(--leading-body)",
              color: "var(--ink-muted)",
              letterSpacing: "var(--tracking-label)",
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
              backgroundColor: "rgba(var(--ink-rgb), 0.06)",
              marginTop: 40,
              marginBottom: 32,
            }}
          />

          <div data-reveal>
            <span
              className="font-mono uppercase"
              style={{
                fontSize: "var(--text-meta)",
                letterSpacing: "var(--tracking-label)",
                color: "var(--ink-muted)",
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
                      fontSize: "var(--text-meta)",
                      color: "var(--ink-muted)",
                    }}
                  >
                    {exp.period}
                  </span>
                  <span
                   
                    style={{
                      fontSize: "var(--text-body)",
                      color: "var(--ink-secondary)",
                      lineHeight: "1.5",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    <span style={{ color: "var(--ink-secondary)" }}>{exp.role}</span> &mdash; {exp.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div
            data-reveal
            style={{
              height: 1,
              backgroundColor: "rgba(var(--ink-rgb), 0.06)",
              marginTop: 40,
              marginBottom: 32,
            }}
          />

          <div data-reveal>
            <span
              className="font-mono uppercase"
              style={{
                fontSize: "var(--text-meta)",
                letterSpacing: "var(--tracking-label)",
                color: "var(--ink-muted)",
                display: "block",
                marginBottom: 16,
              }}
            >
              Get in touch
            </span>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              data-link
              className=" hover-step-muted"
              style={{
                fontSize: "var(--text-body)",
                letterSpacing: "-0.01em",
              }}
            >
              {CONTACT_EMAIL}
            </a>
            <p
              className="font-mono"
              style={{
                fontSize: "var(--text-meta)",
                color: "var(--ink-muted)",
                letterSpacing: "var(--tracking-label)",
                marginTop: 8,
              }}
            >
              New York &middot; Available for select projects
            </p>
          </div>

          <div data-reveal style={{ marginTop: 24 }}>
            <span
              className="font-mono uppercase"
              style={{
                fontSize: "var(--text-meta)",
                letterSpacing: "var(--tracking-label)",
                color: "var(--ink-muted)",
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
                  data-link
                  className="font-mono uppercase hover-step-muted"
                  style={{
                    fontSize: "var(--text-meta)",
                    letterSpacing: "var(--tracking-label)",
                  }}
                >
                  {link.label}
                </a>
                {i < SOCIALS.length - 1 && (
                  <span
                    className="font-mono"
                    style={{
                      fontSize: "var(--text-meta)",
                      color: "var(--ink-muted)",
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
