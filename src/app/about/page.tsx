"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { SOCIALS, CONTACT_EMAIL } from "@/constants/contact";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!containerRef.current) return;
    const els = containerRef.current.querySelectorAll("[data-reveal]");

    if (reducedMotion) {
      gsap.set(els, { opacity: 1, y: 0, filter: "blur(0px)" });
      return;
    }

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
  }, [reducedMotion]);

  return (
    <main
      id="main"
      ref={containerRef}
      style={{
        maxWidth: 900,
        marginLeft: "8vw",
        paddingRight: "clamp(24px, 5vw, 64px)",
      }}
    >
      <style>{`
        @media (max-width: 767px) {
          #main {
            margin-left: 0 !important;
            max-width: none !important;
            padding-inline: 24px !important;
            padding-right: 24px !important;
          }
        }
      `}</style>
      {/* ── Philosophy statement ── */}
      <p
        data-reveal
        className="font-display"
        style={{
          fontStyle: "italic",
          fontSize: "clamp(22px, 3vw, 32px)",
          lineHeight: 1.35,
          fontWeight: 400,
          color: "var(--ink-primary)",
          maxWidth: "54ch",
          paddingTop: 96,
          opacity: 0,
        }}
      >
        Design engineer building at the intersection of craft and systems thinking.
      </p>

      {/* ── Body ── */}
      <p
        data-reveal
        className="font-body"
        style={{
          fontSize: 15,
          lineHeight: 1.7,
          color: "var(--ink-secondary)",
          maxWidth: "54ch",
          marginTop: 24,
          opacity: 0,
        }}
      >
        I care about type, motion, and the invisible details that make digital products feel considered.
      </p>

      <p
        data-reveal
        className="font-body"
        style={{
          fontSize: 15,
          lineHeight: 1.7,
          color: "var(--ink-secondary)",
          maxWidth: "54ch",
          marginTop: 0,
          opacity: 0,
        }}
      >
        Based in New York, working independently on projects that bridge design engineering and brand craft.
      </p>

      {/* ── Experience ── */}
      <div style={{ marginTop: 48 }}>
        <span
          data-reveal
          className="font-mono"
          style={{
            display: "block",
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            color: "var(--ink-muted)",
            marginBottom: 24,
            opacity: 0,
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
            data-reveal
            style={{
              display: "flex",
              gap: 24,
              padding: "10px 0",
              borderBottom: "1px solid var(--ink-ghost)",
              opacity: 0,
            }}
          >
            <span
              className="font-mono"
              style={{
                fontSize: 11,
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
      <div style={{ marginTop: 48, paddingBottom: 72 }}>
        <span
          data-reveal
          className="font-mono"
          style={{
            display: "block",
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            color: "var(--ink-muted)",
            marginBottom: 24,
            opacity: 0,
          }}
        >
          Contact
        </span>

        <p
          data-reveal
          className="font-body"
          style={{
            fontSize: 15,
            color: "var(--ink-primary)",
            marginBottom: 16,
            opacity: 0,
          }}
        >
          For work inquiries, reach me at{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            style={{ color: "inherit", textDecoration: "underline", textUnderlineOffset: 3 }}
          >
            {CONTACT_EMAIL}
          </a>
        </p>

        <div
          data-reveal
          style={{
            display: "flex",
            gap: 20,
            flexWrap: "wrap",
            opacity: 0,
          }}
        >
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono"
              style={{
                fontSize: 11,
                textTransform: "uppercase",
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
  );
}
