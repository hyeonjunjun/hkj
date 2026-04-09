"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import Footer from "@/components/Footer";
import { SOCIALS, CONTACT_EMAIL } from "@/constants/contact";

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const els = containerRef.current.querySelectorAll("[data-reveal]");

    gsap.fromTo(
      els,
      { opacity: 0, y: 32, filter: "blur(3px)" },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.5,
        stagger: 0.06,
        ease: "power3.out",
        delay: 0.2,
      }
    );
  }, []);

  return (
    <>
      <main
        id="main"
        ref={containerRef}
        style={{
          maxWidth: 900,
          margin: "0 auto",
          paddingInline: "clamp(24px, 5vw, 64px)",
        }}
      >
        {/* ── Bio ── */}
        <div data-reveal style={{ paddingTop: 120, paddingBottom: 48, opacity: 0 }}>
          <p
            className="font-display italic"
            style={{
              fontSize: "clamp(22px, 3vw, 32px)",
              lineHeight: 1.35,
              fontWeight: 400,
              color: "var(--ink-primary)",
              maxWidth: "54ch",
            }}
          >
            Design engineer building at the intersection of craft and systems thinking.
          </p>
          <p
            className="font-body"
            style={{
              fontSize: 15,
              lineHeight: 1.7,
              color: "var(--ink-secondary)",
              marginTop: 24,
              maxWidth: "54ch",
            }}
          >
            I care about type, motion, and the invisible details that make digital products feel considered.
            Based in New York, working independently on projects that bridge design engineering and brand craft.
          </p>
        </div>

        {/* ── Experience ── */}
        <div data-reveal style={{ paddingBottom: 48, opacity: 0 }}>
          <span
            className="font-mono uppercase block"
            style={{
              fontSize: 10,
              letterSpacing: "0.06em",
              color: "var(--ink-muted)",
              marginBottom: 24,
            }}
          >
            Experience
          </span>
          {[
            ["2024 \u2014", "Independent, Design Engineering"],
            ["2023 \u2014 24", "Design Technologist"],
            ["2021 \u2014 23", "Frontend Developer"],
          ].map(([period, role]) => (
            <div
              key={period}
              className="flex"
              style={{
                gap: 24,
                padding: "10px 0",
                borderBottom: "1px solid var(--ink-whisper)",
              }}
            >
              <span
                className="font-mono"
                style={{
                  fontSize: 10,
                  letterSpacing: "0.04em",
                  fontVariantNumeric: "tabular-nums",
                  color: "var(--ink-muted)",
                  width: 80,
                  flexShrink: 0,
                }}
              >
                {period}
              </span>
              <span
                className="font-body"
                style={{
                  fontSize: 15,
                  color: "var(--ink-primary)",
                }}
              >
                {role}
              </span>
            </div>
          ))}
        </div>

        {/* ── Contact ── */}
        <div data-reveal style={{ paddingBottom: 72, opacity: 0 }}>
          <span
            className="font-mono uppercase block"
            style={{
              fontSize: 10,
              letterSpacing: "0.06em",
              color: "var(--ink-muted)",
              marginBottom: 24,
            }}
          >
            Contact
          </span>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="font-body block"
            style={{
              fontSize: 15,
              color: "var(--ink-primary)",
              marginBottom: 16,
            }}
          >
            {CONTACT_EMAIL}
          </a>
          <div className="flex" style={{ gap: 20 }}>
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono uppercase"
                style={{
                  fontSize: 10,
                  letterSpacing: "0.06em",
                  color: "var(--ink-muted)",
                  transition: "color 0.3s var(--ease-swift)",
                }}
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
