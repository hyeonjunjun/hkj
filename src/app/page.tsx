"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { PIECES } from "@/constants/pieces";
import { CONTACT_EMAIL } from "@/constants/contact";

const pieces = [...PIECES].sort((a, b) => a.order - b.order);

type Filter = "all" | "brand" | "product" | "lab";

function matchesFilter(piece: (typeof pieces)[0], filter: Filter): boolean {
  if (filter === "all") return true;
  if (filter === "lab") return piece.type === "experiment";
  if (filter === "brand") return piece.tags.some((t) => ["brand", "ecommerce", "3d", "texture", "material"].includes(t));
  if (filter === "product") return piece.tags.some((t) => ["mobile", "ai", "product", "design-system", "ui", "webgl", "generative"].includes(t));
  return true;
}

export default function Home() {
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<Filter>("all");

  const filtered = pieces.filter((p) => matchesFilter(p, activeFilter));
  const hoveredPiece = pieces.find((p) => p.slug === hoveredSlug) ?? filtered[0];
  const filters: { label: string; value: Filter }[] = [
    { label: "All", value: "all" },
    { label: "Brand", value: "brand" },
    { label: "Product", value: "product" },
    { label: "Lab", value: "lab" },
  ];

  return (
    <div className="registry" id="main">
      {/* ═══ LEFT: Index ═══ */}
      <div className="registry-index">
        {/* Nav */}
        <nav className="site-nav entrance" style={{ "--i": 0 } as React.CSSProperties}>
          <span className="site-mark">HKJ</span>
          <Link href="/about">About</Link>
        </nav>

        {/* Statement */}
        <p className="statement entrance" style={{ "--i": 1 } as React.CSSProperties}>
          making things that feel right
        </p>

        {/* Filters */}
        <div className="filter-bar entrance" style={{ "--i": 2 } as React.CSSProperties}>
          {filters.map((f) => (
            <button
              key={f.value}
              className={`filter-btn${activeFilter === f.value ? " active" : ""}`}
              onClick={() => setActiveFilter(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Project List */}
        <div className="project-list">
          {filtered.map((piece, i) => {
            const href = piece.type === "project"
              ? `/work/${piece.slug}`
              : `/lab/${piece.slug}`;
            const globalIndex = pieces.indexOf(piece);

            return (
              <Link
                key={piece.slug}
                href={href}
                className="project-row entrance"
                style={{ "--i": i + 3 } as React.CSSProperties}
                onMouseEnter={() => setHoveredSlug(piece.slug)}
                onMouseLeave={() => setHoveredSlug(null)}
              >
                <div className="project-row-main">
                  <span className="project-row-number">
                    {String(globalIndex + 1).padStart(2, "0")}/
                  </span>
                  <span className="project-row-title">{piece.title}</span>
                  <span className="project-row-year">{piece.year}</span>
                </div>
                <div className="project-row-tags">
                  {piece.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Footer */}
        <footer className="site-footer entrance" style={{ "--i": filtered.length + 3 } as React.CSSProperties}>
          <span>design engineer</span>
          <a href={`mailto:${CONTACT_EMAIL}`}>Contact</a>
        </footer>
      </div>

      {/* ═══ RIGHT: Image Canvas ═══ */}
      <div className="registry-canvas">
        {pieces.map((piece) => (
          <div
            key={piece.slug}
            className={`canvas-image${hoveredPiece?.slug === piece.slug ? " active" : ""}`}
          >
            {piece.image ? (
              <Image
                src={piece.image}
                alt={piece.title}
                fill
                sizes="60vw"
                style={{ objectFit: "cover", objectPosition: "center 30%" }}
                priority={piece.order <= 2}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundColor: piece.cover.bg,
                }}
              />
            )}
          </div>
        ))}
        <div className="canvas-grain" aria-hidden="true" />
        <div className="canvas-vignette" aria-hidden="true" />
      </div>
    </div>
  );
}
