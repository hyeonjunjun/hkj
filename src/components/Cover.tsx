"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";
import DissolveImage from "@/components/DissolveImage";
import TransitionLink from "@/components/TransitionLink";
import type { Project } from "@/constants/projects";
import { GrainTexture } from "@/components/GrainTexture";

// ease-swift cubic-bezier — matches the FLIP morph timing
const EASE_SWIFT = "cubic-bezier(0.4, 0, 0.2, 1)";

const GLOW_COLOR = "rgba(180, 140, 80, 0.08)";

export function Cover({ project, index, dimmed = false }: { project: Project; index: number; dimmed?: boolean }) {
  const isDark = isDarkColor(project.cover.bg);
  const number = String(index + 1).padStart(2, "0");

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isSelfHovered, setIsSelfHovered] = useState(false);
  const [videoIdx, setVideoIdx] = useState(0);
  const videos = project.coverVideos || [];

  const handleMouseEnter = useCallback(() => {
    setIsSelfHovered(true);
    if (videos.length === 0) return;
    setIsHovered(true);
    setVideoIdx(0);
  }, [videos.length]);

  const handleMouseLeave = useCallback(() => {
    setIsSelfHovered(false);
    setIsHovered(false);
    setVideoIdx(0);
  }, []);

  /* Cycle to next video when current one ends */
  const handleVideoEnded = useCallback(() => {
    if (videos.length <= 1) {
      /* Single video: just loop */
      videoRef.current?.play();
      return;
    }
    setVideoIdx((prev) => (prev + 1) % videos.length);
  }, [videos.length]);

  /* Play video when hovered or when index changes */
  useEffect(() => {
    if (!isHovered || !videoRef.current) return;
    videoRef.current.currentTime = 0;
    videoRef.current.play().catch(() => {});
  }, [isHovered, videoIdx]);

  const linkStyle: React.CSSProperties = dimmed
    ? {
        display: "block",
        textDecoration: "none",
        borderRadius: "6px",
        overflow: "hidden",
        position: "relative",
        visibility: "hidden",
        opacity: 0.35,
        filter: "blur(1.5px)",
        transition: `opacity 400ms ${EASE_SWIFT}, filter 400ms ${EASE_SWIFT}, transform var(--duration-hover) var(--ease-out), box-shadow 0.3s ease-out`,
      }
    : {
        display: "block",
        textDecoration: "none",
        borderRadius: "6px",
        overflow: "hidden",
        position: "relative",
        visibility: "hidden",
        opacity: 1,
        filter: "none",
        transform: isSelfHovered ? "scale(1.005)" : "scale(1)",
        boxShadow: isSelfHovered ? `0 12px 40px ${GLOW_COLOR}` : "none",
        transition: `opacity 400ms ${EASE_SWIFT}, filter 400ms ${EASE_SWIFT}, transform var(--duration-hover) var(--ease-out), box-shadow 0.3s ease-out`,
      };

  return (
    <TransitionLink
      href={`/work/${project.slug}`}
      flipId={`project-${project.id}`}
      data-cover
      aria-label={`View ${project.title} case study`}
      style={linkStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Cover visual */}
      <div
        data-cover-image
        style={{
          backgroundColor: project.cover.bg,
          aspectRatio: "16 / 9",
          position: "relative",
          overflow: "hidden",
          borderRadius: "6px",
        }}
      >
        {project.coverImage ? (
          <>
            {/* Static cover image — height: 108% crops bottom to match video framing */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "108%",
                transition: "opacity 0.4s ease-out",
                opacity: isHovered && videos.length > 0 ? 0 : 1,
              }}
            >
              <DissolveImage
                src={project.coverImage}
                alt={project.title}
                fill
                sizes="(max-width: 768px) 100vw, 900px"
                style={{
                  objectFit: "cover",
                  objectPosition: "center top",
                }}
                className="cover-image"
                priority={index === 0}
                placeholder={project.coverBlur ? "blur" : undefined}
                blurDataURL={project.coverBlur}
              />
            </div>

            {/* Video on hover — crops bottom 8% to hide watermark */}
            {videos.length > 0 && (
              <video
                ref={videoRef}
                key={videos[videoIdx]}
                src={videos[videoIdx]}
                muted
                playsInline
                onEnded={handleVideoEnded}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "108%",
                  objectFit: "cover",
                  objectPosition: "center top",
                  opacity: isHovered ? 1 : 0,
                  transition: "opacity 0.4s ease-out",
                  pointerEvents: "none",
                }}
              />
            )}
          </>
        ) : (
          /* Color-field fallback with grain */
          <>
            <GrainTexture dark={isDark} />
            <span
              className="font-mono"
              style={{
                position: "absolute",
                top: "var(--space-comfortable)",
                left: "var(--space-comfortable)",
                fontSize: "var(--text-meta)",
                letterSpacing: "var(--tracking-label)",
                color: project.cover.accent,
                zIndex: 3,
                userSelect: "none",
              }}
            >
              {number}
            </span>
          </>
        )}
      </div>

      {/* Meta */}
      <div
        style={{
          paddingTop: "var(--space-standard)",
          paddingBottom: "var(--space-micro)",
        }}
      >
        <p
          className="font-display"
          style={{
            fontSize: "clamp(20px, 2.5vw, 26px)",
            lineHeight: "var(--leading-display)",
            color: "var(--ink-full)",
            marginBottom: "var(--space-small)",
          }}
        >
          {project.title}
        </p>

        <p
          style={{
            fontSize: "var(--text-body)",
            color: "var(--ink-secondary)",
            lineHeight: 1.55,
            maxWidth: "54ch",
            marginBottom: "var(--space-standard)",
          }}
        >
          {project.description}
        </p>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-standard)",
            flexWrap: "wrap",
          }}
        >
          <span
            className="font-mono"
            style={{
              fontSize: "var(--text-meta)",
              letterSpacing: "var(--tracking-label)",
              textTransform: "uppercase",
              color: "var(--ink-muted)",
            }}
          >
            {project.sector}
          </span>
          <span
            style={{
              width: 2,
              height: 2,
              borderRadius: "50%",
              backgroundColor: "var(--ink-faint)",
              flexShrink: 0,
            }}
          />
          <span
            className="font-mono"
            style={{
              fontSize: "var(--text-meta)",
              letterSpacing: "var(--tracking-label)",
              color: "var(--ink-muted)",
            }}
          >
            {project.year}
          </span>
          {project.status === "wip" && (
            <>
              <span
                style={{
                  width: 2,
                  height: 2,
                  borderRadius: "50%",
                  backgroundColor: "var(--ink-faint)",
                  flexShrink: 0,
                }}
              />
              <span
                className="font-mono"
                style={{
                  fontSize: "var(--text-meta)",
                  letterSpacing: "var(--tracking-label)",
                  textTransform: "uppercase",
                  color: "var(--ink-muted)",
                }}
              >
                In progress
              </span>
            </>
          )}
        </div>
      </div>
    </TransitionLink>
  );
}

function isDarkColor(hex: string): boolean {
  const c = hex.replace("#", "");
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.5;
}
