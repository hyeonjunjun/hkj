"use client";

import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";
import TransitionLink from "@/components/TransitionLink";
import { SOCIALS, CONTACT_EMAIL } from "@/constants/contact";

/**
 * Hero — Dictionary-style identity statement.
 *
 * Inspired by floguo.com — headword, phonetic, part of speech,
 * numbered definitions, "See also" links.
 *
 * Typography:
 *   Headword: GT Alpina italic, --text-display
 *   Chrome: 10px JetBrains Mono, uppercase, tracked 0.1em
 *   Body: 15px Sohne, weight 400
 *
 * Grid: 4px baseline, vertically centered in viewport.
 */
export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const els = sectionRef.current.querySelectorAll("[data-entry]");
    gsap.fromTo(
      els,
      { opacity: 0, y: 6 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.06,
        ease: "power3.out",
        delay: 0.15,
      },
    );
  }, []);

  return (
    <div
      ref={sectionRef}
      style={{
        height: "100svh",
        overflow: "hidden",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        paddingLeft: "var(--page-px)",
        paddingRight: "var(--page-px)",
      }}
    >
      <div style={{ maxWidth: 560 }}>
        {/* Headword */}
        <h1
          data-entry
          className="font-display italic"
          style={{
            fontSize: "clamp(2.4rem, 4.5vw, 3.6rem)",
            fontWeight: 400,
            lineHeight: 1.05,
            color: "var(--color-text)",
            letterSpacing: "-0.02em",
            margin: 0,
          }}
        >
          hkj
        </h1>

        {/* Phonetic */}
        <span
          data-entry
          className="font-sans"
          style={{
            display: "block",
            fontSize: 15,
            fontWeight: 300,
            color: "var(--color-text-dim)",
            marginTop: 8,
            letterSpacing: "0.01em",
          }}
        >
          /eɪtʃ-keɪ-dʒeɪ/
        </span>

        {/* Part of speech */}
        <span
          data-entry
          className="font-mono"
          style={{
            display: "block",
            fontSize: 10,
            letterSpacing: "0.1em",
            textTransform: "uppercase" as const,
            color: "var(--color-text-ghost)",
            marginTop: 24,
          }}
        >
          noun.
        </span>

        {/* Divider */}
        <div
          data-entry
          style={{
            height: 1,
            backgroundColor: "rgba(var(--color-text-rgb), 0.06)",
            marginTop: 16,
            marginBottom: 24,
          }}
        />

        {/* Definition 1 — personal */}
        <div data-entry style={{ marginBottom: 20 }}>
          <span
            className="font-mono"
            style={{
              fontSize: 10,
              letterSpacing: "0.1em",
              color: "var(--color-text-ghost)",
              marginRight: 12,
            }}
          >
            1.
          </span>
          <span
            className="font-sans"
            style={{
              fontSize: 15,
              fontWeight: 400,
              lineHeight: 1.6,
              color: "var(--color-text-secondary)",
              letterSpacing: "-0.005em",
            }}
          >
            a quiet observer drawn to the space between craft and feeling;
            someone who builds things that breathe.
          </span>
        </div>

        {/* Definition 2 — professional */}
        <div data-entry style={{ marginBottom: 20 }}>
          <span
            className="font-mono"
            style={{
              fontSize: 10,
              letterSpacing: "0.1em",
              color: "var(--color-text-ghost)",
              marginRight: 12,
            }}
          >
            2.
          </span>
          <span
            className="font-sans"
            style={{
              fontSize: 15,
              fontWeight: 400,
              lineHeight: 1.6,
              color: "var(--color-text-secondary)",
              letterSpacing: "-0.005em",
            }}
          >
            a design engineer building at the intersection of visual systems
            and interactive media.
          </span>
        </div>

        {/* Divider */}
        <div
          data-entry
          style={{
            height: 1,
            backgroundColor: "rgba(var(--color-text-rgb), 0.06)",
            marginTop: 8,
            marginBottom: 20,
          }}
        />

        {/* See also */}
        <div data-entry>
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
      </div>

      {/* Bottom bar — works link left, email right */}
      <footer
        data-entry
        style={{
          position: "absolute",
          bottom: 24,
          left: "var(--page-px)",
          right: "var(--page-px)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <TransitionLink
          href="/works"
          className="font-mono"
          style={{
            fontSize: 10,
            letterSpacing: "0.1em",
            textTransform: "uppercase" as const,
            color: "var(--color-text-ghost)",
            textDecoration: "none",
            transition: "color 0.3s ease",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = "var(--color-text-dim)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "var(--color-text-ghost)")
          }
        >
          Works &rarr;
        </TransitionLink>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="font-mono"
          style={{
            fontSize: 10,
            letterSpacing: "0.1em",
            textTransform: "uppercase" as const,
            color: "var(--color-text-ghost)",
            textDecoration: "none",
            transition: "color 0.3s ease",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = "var(--color-text-dim)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "var(--color-text-ghost)")
          }
        >
          {CONTACT_EMAIL}
        </a>
      </footer>
    </div>
  );
}
