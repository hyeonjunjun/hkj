"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import { PIECES, type PieceType } from "@/constants/pieces";
import { useTransition } from "@/components/TransitionContext";
import TransitionLink from "@/components/TransitionLink";
import ThemeToggle from "@/components/ThemeToggle";
import ViewToggle from "@/components/ViewToggle";
import Footer from "@/components/Footer";

const allPieces = [...PIECES].sort((a, b) => a.order - b.order);

export default function Home() {
  const { navigateTo } = useTransition();

  const [filter, setFilter] = useState<PieceType | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "index">("list");
  // Sync view mode from localStorage after mount to avoid hydration mismatch
  useEffect(() => {
    const saved = localStorage.getItem("view-mode");
    if (saved === "index") setViewMode("index");
  }, []);
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const [activeSlug, setActiveSlug] = useState<string>(allPieces[0]?.slug ?? "");
  const [isAnimating, setIsAnimating] = useState(false);
  const [prevSlug, setPrevSlug] = useState(activeSlug);
  const preloadRef = useRef(false);

  useEffect(() => {
    if (preloadRef.current) return;
    preloadRef.current = true;
    allPieces.forEach((piece) => {
      if (!piece.image) return;
      const img = new window.Image();
      img.src = piece.image;
    });
  }, []);

  const pieces = filter
    ? allPieces.filter((p) => p.type === filter)
    : allPieces;

  const toggleView = useCallback(() => {
    setViewMode((prev) => {
      const next = prev === "list" ? "index" : "list";
      localStorage.setItem("view-mode", next);
      return next;
    });
  }, []);

  const handleFilter = useCallback((type: PieceType) => {
    setFilter((prev) => (prev === type ? null : type));
  }, []);

  const handleClick = useCallback(
    (slug: string, type: PieceType) => {
      const base = type === "project" ? "/work" : "/lab";
      navigateTo(`${base}/${slug}`);
    },
    [navigateTo]
  );

  const displaySlug = hoveredSlug || activeSlug;
  const displayPiece = allPieces.find((p) => p.slug === displaySlug) ?? allPieces[0];
  const prevPiece = allPieces.find((p) => p.slug === prevSlug) ?? allPieces[0];

  const handleHover = useCallback((slug: string) => {
    if (slug === activeSlug && !hoveredSlug) return;
    setPrevSlug(activeSlug);
    setIsAnimating(true);
    setHoveredSlug(slug);
    setActiveSlug(slug);
    // Reset animation after slide completes
    setTimeout(() => setIsAnimating(false), 300);
  }, [activeSlug, hoveredSlug]);

  return (
    <main className="home" id="main">
      {/* ── Layer 1: Fullscreen video/image ── */}
      <div className="media-layer">
        {displayPiece?.video ? (
          <video
            key={`v-${displayPiece.slug}`}
            src={displayPiece.video}
            autoPlay
            muted
            loop
            playsInline
            className="media-content"
          />
        ) : displayPiece?.image ? (
          <Image
            key={`i-${displayPiece.slug}`}
            src={displayPiece.image}
            alt=""
            fill
            sizes="100vw"
            priority
            className="media-content"
            style={{ objectFit: "cover" }}
          />
        ) : (
          <div
            key={`c-${displayPiece?.slug}`}
            className="media-content media-color"
            style={{ background: displayPiece?.cover.bg }}
          />
        )}
      </div>

      {/* ── Layer 2: Header (nav + index), pushed right ── */}
      <div className="header-module">
        {/* Nav row: brand left, links right */}
        <div className="header-nav">
          <div className="header-nav-left">
            <TransitionLink href="/" className="nav-mark">HKJ</TransitionLink>
            <TransitionLink href="/about" className="header-link">About</TransitionLink>
          </div>
          <div className="header-nav-right">
            <button
              onClick={() => handleFilter("project")}
              className={`header-link ${filter === "project" ? "active" : ""}`}
            >
              Work
            </button>
            <button
              onClick={() => handleFilter("experiment")}
              className={`header-link ${filter === "experiment" ? "active" : ""}`}
            >
              Archive
            </button>
            <ViewToggle mode={viewMode} onToggle={toggleView} />
            <ThemeToggle />
          </div>
        </div>

        {viewMode === "list" && (
          <div className="header-index">
            {pieces.map((piece) => (
              <a
                key={piece.slug}
                href={`/${piece.type === "project" ? "work" : "lab"}/${piece.slug}`}
                className={`index-row ${hoveredSlug === piece.slug || (!hoveredSlug && activeSlug === piece.slug) ? "active" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleClick(piece.slug, piece.type);
                }}
                onMouseEnter={() => handleHover(piece.slug)}
                onMouseLeave={() => setHoveredSlug(null)}
              >
                <span className="index-num">
                  {String(piece.order).padStart(3, "0")}
                </span>
                <span className="index-title">{piece.title}</span>
                <span className="index-year">
                  {piece.status === "wip" ? "WIP" : piece.year}
                </span>
              </a>
            ))}
          </div>
        )}
      </div>

      {/* ── Layer 3: Center text (project info at 50vh) — sliding window ── */}
      {viewMode === "list" && (
        <div className="center-info">
          <div className={`center-slider ${isAnimating ? "sliding" : ""}`}>
            {/* Current row (slides out) */}
            <div className="center-row">
              <span className="center-num">
                {String((isAnimating ? prevPiece : displayPiece)?.order ?? 1).padStart(3, "0")}
              </span>
              <span className="center-title">
                {(isAnimating ? prevPiece : displayPiece)?.title}
              </span>
              <span className="center-year">
                {(isAnimating ? prevPiece : displayPiece)?.status === "wip"
                  ? "WIP"
                  : (isAnimating ? prevPiece : displayPiece)?.year}
              </span>
            </div>
            {/* Next row (slides in) */}
            <div className="center-row">
              <span className="center-num">
                {String(displayPiece?.order ?? 1).padStart(3, "0")}
              </span>
              <span className="center-title">{displayPiece?.title}</span>
              <span className="center-year">
                {displayPiece?.status === "wip" ? "WIP" : displayPiece?.year}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── Archive / Index view ── */}
      {viewMode === "index" && (
        <div className="archive-view">
          <nav className="archive-nav">
            <div className="archive-nav-left">
              <TransitionLink href="/" className="nav-mark" style={{ color: "var(--fg)" }}>HKJ</TransitionLink>
              <span className="archive-label">Index of Projects</span>
            </div>
            <div className="archive-nav-right">
              <button
                onClick={() => handleFilter("project")}
                className={`header-link ${filter === "project" ? "active" : ""}`}
                style={{ color: filter === "project" ? "var(--fg)" : "var(--fg-3)" }}
              >
                Work
              </button>
              <button
                onClick={() => handleFilter("experiment")}
                className={`header-link ${filter === "experiment" ? "active" : ""}`}
                style={{ color: filter === "experiment" ? "var(--fg)" : "var(--fg-3)" }}
              >
                Archive
              </button>
              <TransitionLink href="/about" className="header-link" style={{ color: "var(--fg-3)" }}>About</TransitionLink>
              <ViewToggle mode={viewMode} onToggle={toggleView} />
              <ThemeToggle />
            </div>
          </nav>

          <div className="project-grid">
            {pieces.map((piece) => (
              <a
                key={piece.slug}
                href={`/${piece.type === "project" ? "work" : "lab"}/${piece.slug}`}
                className="project-card"
                onClick={(e) => {
                  e.preventDefault();
                  handleClick(piece.slug, piece.type);
                }}
              >
                {piece.video ? (
                  <video
                    src={piece.video}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="project-card-video"
                  />
                ) : piece.image ? (
                  <Image
                    src={piece.image}
                    alt={piece.title}
                    width={800}
                    height={600}
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="project-card-img"
                  />
                ) : (
                  <div
                    className="project-card-placeholder"
                    style={{ background: piece.cover.bg }}
                  >
                    <span>{piece.status === "wip" ? "In progress" : ""}</span>
                  </div>
                )}
                <div className="project-card-meta">
                  <span className="project-card-title">{piece.title}</span>
                  <span className="project-card-year">
                    {piece.status === "wip" ? "WIP" : piece.year}
                  </span>
                </div>
              </a>
            ))}
          </div>

          <Footer />
        </div>
      )}
    </main>
  );
}
