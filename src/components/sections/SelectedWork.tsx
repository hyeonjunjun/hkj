"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { PROJECTS } from "@/constants/projects";

/* ═══════════════════════════════════════════
   SelectedWork — Nothing OS / Teenage Eng.
   Strict table/grid layout. 1px borders.
   Technical, spec-sheet aesthetics.
   ═══════════════════════════════════════════ */

export default function SelectedWork() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const displayProjects = PROJECTS.filter((p) => p.id !== "gyeol");

  useGSAP(
    () => {
      if (reduced || !sectionRef.current) return;

      gsap.from(".work-row", {
        opacity: 0,
        y: 20,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true,
        },
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      data-section="work"
      className="relative w-full border-t border-b border-[var(--color-border)]"
      style={{
        backgroundColor: "var(--color-bg)",
      }}
    >
      {/* ─── Header Header ─── */}
      <div className="grid grid-cols-1 md:grid-cols-12 border-b border-[var(--color-border)]">
        <div className="md:col-span-2 p-6 md:p-8 md:border-r border-[var(--color-border)] flex items-center md:items-end">
          <span className="font-mono text-[var(--text-micro)] uppercase text-[var(--color-text-ghost)] tracking-widest">
            [ DIR: /WORK ]
          </span>
        </div>
        <div className="md:col-span-10 p-6 md:p-8 flex items-center md:items-end justify-between">
          <h2 className="font-display text-4xl md:text-6xl uppercase tracking-tighter leading-none">
            Index
          </h2>
          <span className="font-mono text-[var(--text-micro)] uppercase text-[var(--color-text-ghost)] tracking-widest hidden sm:block">
            Total Obj: {String(displayProjects.length).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* ─── Projects Table ─── */}
      <div className="flex flex-col">
        {displayProjects.map((project, i) => {
          const num = String(i + 1).padStart(2, "0");
          const isLast = i === displayProjects.length - 1;

          return (
            <Link
              key={project.id}
              href={`/work/${project.id}`}
              className={`work-row group grid grid-cols-1 md:grid-cols-12 ${!isLast ? 'border-b border-[var(--color-border)]' : ''} hover:bg-[var(--color-surface)] transition-colors duration-300`}
            >
              {/* ID */}
              <div className="hidden md:flex md:col-span-2 p-6 md:p-8 border-r border-[var(--color-border)] items-start">
                <span className="font-mono text-[var(--text-sm)] text-[var(--color-text-dim)] group-hover:text-[var(--color-accent)] transition-colors">
                  {num}
                </span>
              </div>

              {/* Image Thumbnail */}
              <div className="md:col-span-4 p-6 md:p-8 md:border-r border-[var(--color-border)]">
                <div
                  className="relative w-full overflow-hidden bg-[var(--color-bg)] border border-[var(--color-border)] p-1"
                  style={{ aspectRatio: "16/10" }}
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 transform group-hover:scale-105"
                    />
                    {/* Tech Corner brackets effect */}
                    <div className="absolute inset-0 border border-black/5 group-hover:border-[var(--color-accent)] transition-colors duration-500 pointer-events-none mix-blend-overlay"></div>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="md:col-span-6 p-6 md:p-8 flex flex-col justify-between gap-6">
                <div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-2">
                    <h3 className="font-display text-2xl md:text-4xl uppercase tracking-tight group-hover:text-[var(--color-accent)] transition-colors">
                      {project.title.split(":")[0]}
                    </h3>
                    <span className="font-mono text-[var(--text-micro)] uppercase tracking-widest text-[var(--color-text-ghost)] border border-[var(--color-border)] px-2 py-1 rounded-sm w-fit shrink-0">
                      {project.sector}
                    </span>
                  </div>
                  <p className="font-sans text-[var(--text-sm)] text-[var(--color-text-dim)] max-w-md leading-relaxed">
                    {project.pitch}
                  </p>
                </div>
                
                <div className="flex justify-between items-end mt-4 md:mt-0">
                   <div className="flex items-center gap-2">
                     <span className="w-1.5 h-1.5 bg-[var(--color-border)] group-hover:bg-[var(--color-accent)] transition-colors rounded-full" />
                     <span className="font-mono text-[10px] tracking-widest uppercase text-[var(--color-text-ghost)]">OK</span>
                   </div>
                   <span className="font-mono text-[var(--text-micro)] text-[var(--color-text)] uppercase tracking-widest flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                     [ OPEN ] 
                     <span className="text-[var(--color-accent)]">&rarr;</span>
                   </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
