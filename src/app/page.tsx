"use client";

import { useEffect } from "react";
import gsap from "gsap";
import GhostLetters from "@/components/GhostLetters";
import WorkSequence from "@/components/WorkSequence";
import { SOCIALS, CONTACT_EMAIL } from "@/constants/contact";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export default function Home() {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const waveCanvas = document.querySelector<HTMLElement>("canvas[aria-hidden]");
    const nav = document.querySelector<HTMLElement>("[data-nav-reveal]");
    const ghost = document.querySelector<HTMLElement>("[data-ghost-letters]");
    const colophon = document.querySelector<HTMLElement>("[data-colophon]");

    if (reducedMotion) {
      // Skip entrance choreography entirely — show everything immediately
      if (waveCanvas) gsap.set(waveCanvas, { clipPath: "inset(0 0% 0 0)" });
      if (ghost) gsap.set(ghost, { opacity: 0.1 });
      if (colophon) gsap.set(colophon, { opacity: 1 });
      if (nav) gsap.set(nav, { opacity: 1, filter: "blur(0px)" });
      return;
    }

    const isFirstVisit = !sessionStorage.getItem("hkj-visited");

    if (isFirstVisit) {
      sessionStorage.setItem("hkj-visited", "1");

      // Set all entrance elements to invisible before choreography
      if (waveCanvas) gsap.set(waveCanvas, { clipPath: "inset(0 100% 0 0)" });
      if (nav) gsap.set(nav, { opacity: 0, filter: "blur(6px)" });
      if (ghost) gsap.set(ghost, { opacity: 0 });
      if (colophon) gsap.set(colophon, { opacity: 0 });

      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      // t=0: Waveform draws left-to-right over 800ms
      if (waveCanvas) {
        tl.to(waveCanvas, {
          clipPath: "inset(0 0% 0 0)",
          duration: 0.8,
          ease: "power1.inOut",
        }, 0);
      }

      // t=400ms: Nav blur-reveal
      if (nav) {
        tl.to(nav, {
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.5,
        }, 0.4);
      }

      // t=600ms: Ghost letters fade in to 0.10
      if (ghost) {
        tl.to(ghost, {
          opacity: 0.1,
          duration: 0.6,
        }, 0.6);
      }

      // t=800ms: Colophon reveal
      if (colophon) {
        tl.to(colophon, {
          opacity: 1,
          duration: 0.4,
        }, 0.8);
      }
    } else {
      // Repeat visit: quick 300ms fade-in of all content
      if (waveCanvas) gsap.set(waveCanvas, { clipPath: "inset(0 0% 0 0)" });
      if (ghost) gsap.set(ghost, { opacity: 0.1 });
      if (colophon) gsap.set(colophon, { opacity: 1 });
      if (nav) {
        gsap.set(nav, { opacity: 0 });
        gsap.to(nav, { opacity: 1, duration: 0.3 });
      }
    }
  }, [reducedMotion]);

  return (
    <>
      <main id="main">
        {/* First viewport — the opening measure */}
        <section
          style={{
            position: "relative",
            height: "100vh",
            overflow: "hidden",
          }}
        >
          <GhostLetters />

          {/* Colophon — bottom right */}
          <div
            data-colophon
            className="font-mono uppercase"
            style={{
              position: "absolute",
              bottom: 20,
              right: "clamp(24px, 5vw, 64px)",
              fontSize: 11,
              letterSpacing: "0.06em",
              color: "var(--ink-ghost)",
            }}
          >
            Design Engineering &middot; New York &middot; 2026
          </div>
        </section>

        {/* Work sequence */}
        <WorkSequence />

        {/* Footer — minimal */}
        <footer
          id="home-footer"
          style={{
            marginTop: "clamp(100px, 15vh, 180px)",
            marginLeft: "8vw",
            maxWidth: 900,
            paddingBottom: 72,
            paddingInline: "clamp(24px, 5vw, 64px)",
          }}
        >
          <div
            className="flex items-baseline justify-between flex-wrap"
            style={{ gap: 24 }}
          >
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="font-mono"
              style={{
                fontSize: 11,
                letterSpacing: "0.04em",
                color: "var(--ink-secondary)",
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
                    fontSize: 11,
                    letterSpacing: "0.06em",
                    color: "var(--ink-muted)",
                  }}
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
          <p
            className="font-mono"
            style={{
              fontSize: 11,
              letterSpacing: "0.04em",
              color: "var(--ink-ghost)",
              marginTop: 32,
            }}
          >
            &copy; {new Date().getFullYear()} HKJ Studio
          </p>
        </footer>
      </main>
    </>
  );
}
