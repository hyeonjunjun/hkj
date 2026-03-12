"use client";

import Link from "next/link";
import { PROJECTS } from "@/constants/projects";

/**
 * RecruiterView — Rail B
 * ──────────────────────
 * Single-scroll, document-style view for recruiters.
 * Zero WebGL, zero complex animations.
 * Max-width 800px centered, clean editorial reading experience.
 */
export default function RecruiterView() {
  const displayProjects = PROJECTS.filter((p) => p.id !== "gyeol");

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--color-bg)", color: "var(--color-text)" }}
    >
      <div className="max-w-[800px] mx-auto px-6 sm:px-8 py-32 space-y-24">
        {/* ── Intro ── */}
        <header className="space-y-8">
          <h1
            className="editorial-display"
            style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}
          >
            Calm interfaces for restless problems.
          </h1>
          <p
            className="font-grotesk text-[var(--color-text-dim)] leading-relaxed"
            style={{ fontSize: "var(--text-lg)" }}
          >
            Ryan Jun — Design Engineer based in NYC / Seoul. I specialize in
            building premium, tactile software products from concept to
            production. My work spans React Native, Next.js, and design systems
            that feel like precision instruments.
          </p>
        </header>

        {/* ── Tech Stack ── */}
        <section className="space-y-6">
          <h2 className="font-mono uppercase tracking-[0.2em] text-[var(--color-text-dim)]" style={{ fontSize: "var(--text-xs)" }}>
            Core Capabilities
          </h2>
          <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {["React Native", "Next.js", "TypeScript", "Framer Motion", "GSAP", "Supabase", "Design Systems", "Figma → Code", "AI / LLM Integration"].map((skill) => (
              <li
                key={skill}
                className="font-mono text-[var(--text-sm)] py-2 px-3 border border-[var(--color-border)]"
              >
                {skill}
              </li>
            ))}
          </ul>
        </section>

        {/* ── Projects ── */}
        <section className="space-y-8">
          <h2 className="font-mono uppercase tracking-[0.2em] text-[var(--color-text-dim)]" style={{ fontSize: "var(--text-xs)" }}>
            Selected Work
          </h2>
          <div className="space-y-6">
            {displayProjects.map((project) => (
              <Link
                key={project.id}
                href={`/work/${project.id}`}
                className="block border border-[var(--color-border)] p-6 hover:bg-[var(--color-surface)] transition-colors group"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-serif italic text-xl group-hover:text-[var(--color-accent)] transition-colors">
                    {project.title}
                  </h3>
                  <span className="font-mono text-[var(--text-micro)] text-[var(--color-text-ghost)] uppercase tracking-widest shrink-0 ml-4">
                    {project.year}
                  </span>
                </div>
                <p className="font-grotesk text-[var(--text-sm)] text-[var(--color-text-dim)] leading-relaxed">
                  {project.pitch}
                </p>
                <div className="flex gap-2 mt-4">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-mono text-[8px] uppercase tracking-widest text-[var(--color-text-ghost)] border border-[var(--color-border)] px-2 py-0.5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── CV Download ── */}
        <section className="border-t border-[var(--color-border)] pt-12 space-y-4">
          <h2 className="font-mono uppercase tracking-[0.2em] text-[var(--color-text-dim)]" style={{ fontSize: "var(--text-xs)" }}>
            Resume
          </h2>
          <a
            href="/HKJ_Studio_CV.pdf"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-3 font-mono text-[var(--text-sm)] uppercase tracking-[0.1em] border border-[var(--color-border)] px-6 py-3 hover:bg-[var(--color-surface)] hover:text-[var(--color-accent)] transition-colors"
          >
            Download CV &darr;
          </a>
        </section>

        {/* ── Contact ── */}
        <footer className="border-t border-[var(--color-border)] pt-12 space-y-6">
          <h2 className="font-mono uppercase tracking-[0.2em] text-[var(--color-text-dim)]" style={{ fontSize: "var(--text-xs)" }}>
            Get In Touch
          </h2>
          <a
            href="mailto:hello@hkjstudio.com"
            className="font-serif italic text-2xl hover:text-[var(--color-accent)] transition-colors block"
          >
            hello@hkjstudio.com
          </a>
          <div className="flex gap-6">
            {[
              { label: "GitHub", href: "https://github.com/hyeonjunjun" },
              { label: "LinkedIn", href: "https://linkedin.com/in/hyeonjunjun" },
              { label: "Twitter", href: "https://twitter.com/hyeonjunjun" },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-[var(--text-sm)] uppercase tracking-[0.1em] text-[var(--color-text-dim)] hover:text-[var(--color-accent)] transition-colors"
              >
                {s.label}
              </a>
            ))}
          </div>
          <p className="font-mono text-[var(--text-micro)] text-[var(--color-text-ghost)] uppercase tracking-widest pt-8">
            HKJ Studio &copy; {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </div>
  );
}
