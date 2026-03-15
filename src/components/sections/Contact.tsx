"use client";

import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";
import { SOCIALS, CONTACT_EMAIL } from "@/constants/contact";

/**
 * Contact — Email in display serif, socials as text, maximum whitespace
 *
 * MOST whitespace: padding above 200px+, below 160px+.
 * No large CTA, no form, no magnetic hover.
 * Email at --text-h2 in display serif.
 * Social links as middot-separated mono text.
 */
export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const els = sectionRef.current.querySelectorAll("[data-contact-reveal]");
    gsap.fromTo(
      els,
      { opacity: 0.15 },
      {
        opacity: 1,
        duration: 1.2,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
      }
    );
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="section-padding"
      style={{
        paddingTop: "clamp(14rem, 24vh, 20rem)",
        paddingBottom: "clamp(10rem, 18vh, 16rem)",
      }}
    >
      <div className="max-w-[900px] mx-auto">
        {/* Section label */}
        <div className="mb-12" data-contact-reveal>
          <span
            className="font-mono uppercase"
            style={{
              fontSize: "var(--text-micro)",
              letterSpacing: "0.15em",
              color: "var(--color-text-ghost)",
            }}
          >
            Get in touch
          </span>
        </div>

        {/* Email — large display serif */}
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="font-display block group"
          style={{
            fontSize: "var(--text-h2)",
            color: "var(--color-text)",
            lineHeight: 1.3,
          }}
          data-contact-reveal
        >
          <span className="relative inline-block">
            {CONTACT_EMAIL}
            {/* Hand-drawn underline on hover */}
            <span
              className="absolute -bottom-1 left-0 right-0 h-[1px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
              style={{
                backgroundColor: "var(--color-accent)",
                transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            />
          </span>
        </a>

        {/* City / availability */}
        <p
          className="font-sans mt-6"
          style={{
            fontSize: "var(--text-small)",
            color: "var(--color-text-dim)",
            lineHeight: 1.6,
          }}
          data-contact-reveal
        >
          New York / Seoul · Available for select projects
        </p>

        {/* Social links — middot separated */}
        <div
          className="mt-8 flex items-center flex-wrap"
          data-contact-reveal
        >
          {SOCIALS.map((social, i) => (
            <span key={social.label} className="flex items-center">
              {i > 0 && (
                <span
                  className="mx-3"
                  style={{
                    color: "var(--color-text-ghost)",
                    fontSize: "var(--text-micro)",
                  }}
                >
                  ·
                </span>
              )}
              <a
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono relative group/social"
                style={{
                  fontSize: "var(--text-micro)",
                  letterSpacing: "0.1em",
                  color: "var(--color-text-dim)",
                  textTransform: "uppercase",
                }}
              >
                <span className="transition-colors duration-300 group-hover/social:text-[var(--color-text)]">
                  {social.label}
                </span>
                <span
                  className="absolute -bottom-0.5 left-0 right-0 h-[1px] origin-left scale-x-0 group-hover/social:scale-x-100 transition-transform duration-400"
                  style={{
                    backgroundColor: "var(--color-text-dim)",
                    transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                />
              </a>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
