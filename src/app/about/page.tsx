"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { SOCIALS, CONTACT_EMAIL } from "@/constants/contact";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { DUR } from "@/lib/motion";

const EXPERIENCE: Array<[string, string]> = [
  ["2024 — Present", "Independent, Design Engineering"],
  ["2023 — 2024", "Design Technologist"],
  ["2021 — 2023", "Frontend Developer"],
];

export default function AboutPage() {
  const containerRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!containerRef.current) return;
    const els = containerRef.current.querySelectorAll("[data-reveal]");

    if (reducedMotion) {
      gsap.set(els, { opacity: 1, y: 0 });
      return;
    }

    gsap.fromTo(
      els,
      { opacity: 0, y: 16 },
      {
        opacity: 1,
        y: 0,
        duration: DUR.reveal ?? 0.8,
        stagger: 0.08,
        ease: "power2.out",
        delay: 0.2,
      }
    );
  }, [reducedMotion]);

  return (
    <main
      id="main"
      ref={containerRef}
      style={{ position: "relative", zIndex: 1 }}
    >
      <div className="about-grid">
        <figure className="about-portrait" data-reveal style={{ opacity: 0 }}>
          <div className="about-portrait__frame" aria-hidden>
            <div className="about-portrait__placeholder" />
          </div>
          <figcaption className="about-portrait__caption">
            <span>FIG. 00 — OBSERVER</span>
            <span>NEW YORK / EST. 2021</span>
          </figcaption>
        </figure>

        <div className="about-philosophy" data-reveal style={{ opacity: 0 }}>
          <div className="about-kicker">ABOUT · HYEONJOON · 2026</div>
          <p className="about-statement">
            I&apos;m a design engineer working at the intersection of craft
            and systems thinking.
          </p>
          <p className="about-body">
            I care about type, motion, and the invisible details that make
            digital products feel considered. I treat AI as a collaborator —
            a force multiplier, not a shortcut — and I build brands,
            interfaces, and atmospheres for people who take care of the work.
          </p>
          <p className="about-body">
            Based in New York. Available for full-time design engineering
            roles and selected consulting through 2026.
          </p>
        </div>

        <div className="about-experience" data-reveal style={{ opacity: 0 }}>
          <div className="about-section-label">
            {"\u25B8 EXPERIENCE \u00B7 03 ENTRIES \u00B7 2021\u20132026"}
          </div>
          <div className="about-experience__inner">
            {EXPERIENCE.map(([period, role], i) => (
              <div
                key={period}
                className="about-experience__row"
                style={{
                  borderTop: i === 0 ? "1px solid var(--ink-ghost)" : "none",
                  borderBottom: "1px solid var(--ink-ghost)",
                }}
              >
                <span className="about-experience__period">{period}</span>
                <span className="about-experience__role">{role}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="about-contact" data-reveal style={{ opacity: 0 }}>
          <div className="about-section-label">
            {"\u25B8 CONTACT \u00B7 AVAILABLE 2026 \u00B7 NEW YORK"}
          </div>
          <div className="about-contact__inner">
            <p className="about-contact__lede">
              For work inquiries, freelance, or a quick hello — reach me at{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="about-contact__mail"
              >
                {CONTACT_EMAIL}
              </a>
              .
            </p>
            <div className="about-contact__socials">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="about-contact__social"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <footer className="about-signoff" data-reveal style={{ opacity: 0 }}>
          <div className="about-signoff__name">Hyeonjoon</div>
          <div className="about-signoff__role">
            — DESIGN ENGINEER · NEW YORK · AVAILABLE 2026
          </div>
        </footer>
      </div>

      <style>{`
        .about-grid {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: clamp(16px, 2vw, 32px);
          max-width: 1200px;
          margin: 0 auto;
          padding: clamp(72px, 10vh, 120px) clamp(24px, 4vw, 64px) clamp(48px, 8vh, 96px);
        }
        .about-portrait { grid-column: 1 / span 5; }
        .about-philosophy { grid-column: 7 / span 6; }
        .about-experience {
          grid-column: 1 / span 12;
          margin-top: clamp(64px, 10vh, 120px);
        }
        .about-contact {
          grid-column: 7 / span 6;
          margin-top: clamp(48px, 6vh, 72px);
        }
        .about-signoff {
          grid-column: 1 / span 12;
          text-align: right;
          margin-top: clamp(80px, 12vh, 140px);
          margin-bottom: clamp(48px, 8vh, 96px);
        }
        .about-portrait__frame {
          width: 100%;
          aspect-ratio: 4 / 5;
          border: 1px solid var(--ink-ghost);
          background: var(--paper-2);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .about-portrait__placeholder {
          width: 64%;
          height: 76%;
          background:
            linear-gradient(180deg, #E8E8E4 0%, #C8C8C2 50%, #A8A8A2 100%);
          border-radius: 2px;
        }
        .about-portrait__caption {
          margin-top: 12px;
          display: flex;
          justify-content: space-between;
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--ink-3);
          font-variant-numeric: tabular-nums;
        }
        .about-kicker {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--ink-faint);
          margin-bottom: 32px;
        }
        .about-statement {
          font-family: var(--font-sans);
          font-weight: 500;
          font-size: clamp(26px, 3vw, 38px);
          line-height: 1.25;
          letter-spacing: -0.015em;
          color: var(--ink);
          max-width: 28ch;
          margin: 0 0 32px 0;
        }
        .about-statement__em {
          font-family: var(--font-sans);
          font-weight: 600;
        }
        .about-body {
          font-family: var(--font-sans);
          font-size: 16px;
          line-height: 1.7;
          color: var(--ink-muted);
          max-width: 54ch;
          margin: 0 0 20px 0;
        }
        .about-section-label {
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--ink-faint);
          margin-bottom: 24px;
        }
        .about-experience__inner {
          padding: 0;
        }
        .about-experience__row {
          display: flex;
          gap: 32px;
          padding: 18px 0;
        }
        .about-experience__period {
          font-family: var(--font-mono);
          font-size: 12px;
          letter-spacing: 0.04em;
          font-variant-numeric: tabular-nums;
          color: var(--ink-faint);
          width: 180px;
          flex-shrink: 0;
          text-transform: uppercase;
        }
        .about-experience__role {
          font-family: var(--font-sans);
          font-size: 15px;
          color: var(--ink);
        }
        .about-contact__inner {
          padding: 0;
        }
        .about-contact__lede {
          font-family: var(--font-sans);
          font-size: 15px;
          line-height: 1.7;
          color: var(--ink-muted);
          margin: 0 0 24px 0;
          max-width: 48ch;
        }
        .about-contact__mail {
          color: var(--ink);
          text-decoration: underline;
          text-decoration-thickness: 1px;
          text-underline-offset: 3px;
        }
        .about-contact__socials {
          display: flex;
          gap: 24px;
          flex-wrap: wrap;
        }
        .about-contact__social {
          font-family: var(--font-mono);
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--ink-muted);
          transition: color 0.3s var(--ease);
        }
        .about-contact__social:hover {
          color: var(--ink);
        }
        .about-signoff__name {
          font-family: var(--font-sans);
          font-weight: 500;
          font-size: clamp(40px, 5vw, 72px);
          line-height: 1.1;
          letter-spacing: -0.02em;
          color: var(--ink);
        }
        .about-signoff__role {
          font-family: var(--font-mono);
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--ink-muted);
          margin-top: 16px;
        }
        @media (max-width: 767px) {
          .about-portrait,
          .about-philosophy,
          .about-experience,
          .about-contact,
          .about-signoff {
            grid-column: 1 / -1;
          }
          .about-signoff {
            text-align: left;
          }
        }
      `}</style>
    </main>
  );
}
