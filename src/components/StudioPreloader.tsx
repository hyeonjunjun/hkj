"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { useStudioStore } from "@/lib/store";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { PROJECTS } from "@/constants/projects";

const SESSION_KEY = "hkj-visited";

export default function StudioPreloader() {
  const setLoaded = useStudioStore((s) => s.setLoaded);
  const isLoaded = useStudioStore((s) => s.isLoaded);
  const prefersReduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLSpanElement>(null);
  const imageBoxRef = useRef<HTMLDivElement>(null);
  const thumbRefs = useRef<(HTMLDivElement | null)[]>([]);

  const activeProjects = PROJECTS.filter((p) => !p.wip);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) || prefersReduced) {
      setLoaded(true);
      return;
    }

    const el = containerRef.current;
    const mark = markRef.current;
    const imageBox = imageBoxRef.current;
    if (!el || !mark || !imageBox) return;

    const tl = gsap.timeline({
      onComplete: () => {
        // Final reveal — scale up the whole preloader and fade out
        gsap.to(el, {
          clipPath: "inset(50% 50% 50% 50%)",
          opacity: 0,
          duration: 0.8,
          ease: "power3.inOut",
          onComplete: () => {
            sessionStorage.setItem(SESSION_KEY, "1");
            setLoaded(true);
          },
        });
      },
    });

    const fontsReady = document.fonts.ready;
    const timeout = new Promise((r) => setTimeout(r, 3000));

    Promise.race([fontsReady, timeout]).then(() => {
      // Phase 1 — HKJ mark fades in (0.8s)
      tl.fromTo(
        mark,
        { opacity: 0, y: 8, filter: "blur(4px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.8,
          ease: "power3.out",
        }
      );

      // Hold for a moment (0.6s)
      tl.to({}, { duration: 0.6 });

      // Phase 2 — Mark shifts up, image box appears (0.7s)
      tl.to(mark, {
        y: -40,
        opacity: 0.4,
        duration: 0.7,
        ease: "power3.inOut",
      });

      tl.fromTo(
        imageBox,
        { opacity: 0, scale: 0.85, clipPath: "inset(10% 10% 10% 10%)" },
        {
          opacity: 1,
          scale: 1,
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 0.8,
          ease: "power3.out",
        },
        "<0.1"
      );

      // Phase 3 — Cycle through project thumbnails (0.5s each)
      thumbRefs.current.forEach((thumb, i) => {
        if (!thumb || i === 0) return;
        tl.fromTo(
          thumb,
          { clipPath: "inset(100% 0 0 0)" },
          {
            clipPath: "inset(0% 0 0 0)",
            duration: 0.5,
            ease: "power2.inOut",
          },
          `+=0.3`
        );
      });

      // Hold on last image (0.5s)
      tl.to({}, { duration: 0.5 });
    });
  }, [setLoaded, prefersReduced]);

  if (isLoaded) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[1000] flex flex-col items-center justify-center"
      style={{
        backgroundColor: "var(--color-bg)",
        clipPath: "inset(0% 0% 0% 0%)",
      }}
    >
      {/* HKJ Mark */}
      <span
        ref={markRef}
        className="font-display"
        style={{
          fontSize: "clamp(14px, 1.5vw, 18px)",
          color: "var(--color-text)",
          letterSpacing: "0.15em",
          opacity: 0,
        }}
      >
        HKJ
      </span>

      {/* Image box */}
      <div
        ref={imageBoxRef}
        className="relative overflow-hidden"
        style={{
          width: "clamp(260px, 28vw, 380px)",
          aspectRatio: "4/3",
          opacity: 0,
          marginTop: "1.5rem",
        }}
      >
        {activeProjects.map((project, i) => (
          <div
            key={project.id}
            ref={(el) => {
              thumbRefs.current[i] = el;
            }}
            className="absolute inset-0"
            style={{
              clipPath: i === 0 ? undefined : "inset(100% 0 0 0)",
              zIndex: i,
            }}
          >
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover"
              sizes="28vw"
              priority={i === 0}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
