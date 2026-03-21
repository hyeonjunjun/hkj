"use client";

import { useRef, useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { SOCIALS, CONTACT_EMAIL } from "@/constants/contact";

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!footerRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    ScrollTrigger.create({
      trigger: footerRef.current,
      start: "top 92%",
      once: true,
      onEnter: () => {
        const els = footerRef.current!.querySelectorAll("[data-footer-el]");
        gsap.fromTo(
          els,
          { opacity: 0, y: 8 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.06,
            ease: "expo.out",
          }
        );
      },
    });
  }, []);

  return (
    <footer
      ref={footerRef}
      className="section-padding"
      style={{
        borderTop: "1px solid var(--color-border)",
        paddingTop: "clamp(2rem, 4vh, 3rem)",
        paddingBottom: "clamp(2rem, 4vh, 3rem)",
        marginTop: "var(--section-py)",
      }}
    >
      {/* Row 1: Contact + Social */}
      <div
        data-footer-el
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div
          style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
        >
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="font-mono uppercase link-dim"
            style={{
              fontSize: "var(--text-micro)",
              letterSpacing: "var(--tracking-wider)",
            }}
          >
            {CONTACT_EMAIL}
          </a>
          <span
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              backgroundColor: "var(--color-warm)",
              flexShrink: 0,
            }}
          />
        </div>

        <div style={{ display: "flex", gap: "1.5rem" }}>
          {SOCIALS.map((link) => (
            <a
              key={link.label}
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
          ))}
        </div>
      </div>

      {/* Row 2: Colophon */}
      <div
        data-footer-el
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "1.5rem",
          flexWrap: "wrap",
          gap: "0.5rem",
        }}
      >
        <span
          className="font-mono"
          style={{
            fontSize: "var(--text-micro)",
            color: "var(--color-text-ghost)",
            letterSpacing: "var(--tracking-wide)",
          }}
        >
          Designed &amp; built by HKJ
        </span>
        <span
          className="font-mono"
          style={{
            fontSize: "var(--text-micro)",
            color: "var(--color-text-ghost)",
            letterSpacing: "var(--tracking-wide)",
          }}
        >
          Set in GT Alpina &amp; S&ouml;hne &middot; &copy;{" "}
          {new Date().getFullYear()}
        </span>
      </div>
    </footer>
  );
}
