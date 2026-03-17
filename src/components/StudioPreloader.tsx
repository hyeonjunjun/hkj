"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { useStudioStore } from "@/lib/store";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { PROJECTS } from "@/constants/projects";

const SESSION_KEY = "hkj-visited";
const CINEMATIC = "cubic-bezier(0.86, 0, 0.07, 1)";

export default function StudioPreloader() {
  const setLoaded = useStudioStore((s) => s.setLoaded);
  const isLoaded = useStudioStore((s) => s.isLoaded);
  const prefersReduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const thumbRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [shouldRender, setShouldRender] = useState(true);

  const activeProjects = PROJECTS.filter((p) => !p.wip);

  useEffect(() => {
    // Skip if already visited or prefers-reduced-motion
    if (typeof window !== "undefined") {
      if (sessionStorage.getItem(SESSION_KEY) || prefersReduced) {
        setLoaded(true);
        setShouldRender(false);
        return;
      }
    }

    const el = containerRef.current;
    const box = boxRef.current;
    if (!el || !box) return;

    const tl = gsap.timeline({
      defaults: { ease: CINEMATIC },
      onComplete: () => {
        gsap.to(el, {
          opacity: 0,
          duration: 0.4,
          ease: "power2.in",
          onComplete: () => {
            sessionStorage.setItem(SESSION_KEY, "1");
            setLoaded(true);
            setShouldRender(false);
          },
        });
      },
    });

    // Wait for fonts + images
    const fontsReady = document.fonts.ready;
    const timeout = new Promise((r) => setTimeout(r, 3000));

    Promise.race([fontsReady, timeout]).then(() => {
      // Phase 1 — Box appear (0.4s)
      tl.fromTo(
        box,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.4 }
      );

      // Phase 2 — Box expand (0.6s)
      tl.to(box, {
        width: "32.59vw",
        height: "auto",
        duration: 0.6,
      });

      // Show first thumbnail inside box
      if (thumbRefs.current[0]) {
        tl.fromTo(
          thumbRefs.current[0],
          { clipPath: "inset(100% 0 0 0)" },
          { clipPath: "inset(0% 0 0 0)", duration: 0.6 },
          "<"
        );
      }

      // Phase 3 — Split & distribute (0.8s)
      thumbRefs.current.forEach((thumb, i) => {
        if (!thumb) return;
        tl.to(
          thumb,
          {
            opacity: 0,
            scale: 0.6,
            y: -40,
            duration: 0.5,
          },
          `split+=${i * 0.1}`
        );
      });

      tl.to(box, { opacity: 0, duration: 0.3 }, "split+=0.3");

      // Phase 4 — Chrome reveal (0.4s)
      // Signal Hero that preloader is done so Hero's header/footer
      // fade in via isLoaded-gated entrance animations.
      // The preloader's onComplete callback sets isLoaded=true,
      // which triggers Hero's fadeUp variants on header and footer.
    });
  }, [setLoaded, prefersReduced]);

  if (!shouldRender || isLoaded) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[1000] flex items-center justify-center"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      {/* Central box with project thumbnails */}
      <div
        ref={boxRef}
        className="relative overflow-hidden flex items-center justify-center"
        style={{
          width: 60,
          height: 80,
          backgroundColor: "var(--color-border)",
        }}
      >
        {activeProjects.map((project, i) => (
          <div
            key={project.id}
            ref={(el) => { thumbRefs.current[i] = el; }}
            className="absolute inset-0"
            style={{
              clipPath: i === 0 ? undefined : "inset(100% 0 0 0)",
            }}
          >
            <Image
              src={project.image}
              alt=""
              fill
              className="object-cover"
              sizes="33vw"
              priority={i === 0}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
