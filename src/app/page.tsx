"use client";

import Link from "next/link";
import Image from "next/image";
import { PIECES } from "@/constants/pieces";
import { CONTACT_EMAIL, SOCIALS } from "@/constants/contact";

const projects = PIECES.filter((p) => p.type === "project").sort(
  (a, b) => a.order - b.order
);

export default function Home() {
  return (
    <main className="home" id="main">
      {/* ── Top bar ── */}
      <header className="top-bar fade-in" style={{ animationDelay: "0.1s" }}>
        <div className="top-bar-left">
          <span className="top-bar-mark">HKJ</span>
          <span className="top-bar-sep">/</span>
          <span className="top-bar-sub">Studio</span>
        </div>
        <nav className="top-bar-nav">
          <Link href="/about">About</Link>
          <a href={`mailto:${CONTACT_EMAIL}`}>Connect</a>
        </nav>
      </header>

      {/* ── Hero statement ── */}
      <div className="hero-statement fade-in" style={{ animationDelay: "0.2s" }}>
        <h1 className="hero-title">
          Design engineering
          <br />
          for brands that care
        </h1>
        <p className="hero-sub">
          HKJ Studio crafts brands, products, and digital experiences
          with intention and precision.
        </p>
      </div>

      {/* ── Featured projects — horizontal row with stagger ── */}
      <section className="projects-row">
        {projects.map((piece, i) => {
          const href = `/work/${piece.slug}`;
          const globalIdx = PIECES.indexOf(piece);

          return (
            <Link
              key={piece.slug}
              href={href}
              className="project-card fade-in"
              style={{ animationDelay: `${0.35 + i * 0.12}s` }}
            >
              {/* Image */}
              <div className="project-thumb">
                {piece.image ? (
                  <Image
                    src={piece.image}
                    alt={piece.title}
                    width={800}
                    height={500}
                    sizes="(max-width: 768px) 90vw, 30vw"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    priority={i < 2}
                  />
                ) : (
                  <div className="project-thumb-empty">
                    <span>{piece.status === "wip" ? "In progress" : piece.title}</span>
                  </div>
                )}
              </div>

              {/* Callout line — SVG connecting image to label */}
              <div className="project-annotation">
                <svg
                  className="project-line"
                  width="100%"
                  height="24"
                  preserveAspectRatio="none"
                >
                  <line x1="0" y1="12" x2="100%" y2="12" />
                  <rect x="0" y="9" width="6" height="6" />
                </svg>
              </div>

              {/* Project meta */}
              <div className="project-meta">
                <div className="project-meta-left">
                  <span className="project-num">
                    {String(globalIdx + 1).padStart(2, "0")}
                  </span>
                  <span className="project-name">{piece.title}</span>
                </div>
                <span className="project-tags">
                  {piece.tags.map((tag, ti) => (
                    <span key={tag}>
                      {ti > 0 && " · "}
                      {ti === 0 ? <strong>{tag}</strong> : tag}
                    </span>
                  ))}
                </span>
              </div>

              <span className="project-year">{piece.year}</span>
            </Link>
          );
        })}
      </section>

      {/* ── Hand note ── */}
      <span
        className="hand-note fade-in"
        style={{ animationDelay: "0.9s" }}
      >
        &ldquo;making things that feel right&rdquo;
      </span>

      {/* ── Bottom bar ── */}
      <footer className="bottom-bar fade-in" style={{ animationDelay: "0.7s" }}>
        <div className="bottom-bar-left">
          <span>Design engineer</span>
          <span className="bottom-bar-dot">·</span>
          <span>New York</span>
        </div>
        <div className="bottom-bar-right">
          {SOCIALS.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer">
              {s.label}
            </a>
          ))}
        </div>
      </footer>
    </main>
  );
}
