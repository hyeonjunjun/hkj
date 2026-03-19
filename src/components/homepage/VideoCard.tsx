"use client";

import { useRef, useEffect } from "react";
import type { Project } from "@/constants/projects";

interface VideoCardProps {
  project: Project;
  index: number;
  isActive: boolean;
}

export default function VideoCard({ project, index, isActive }: VideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;
    if (isActive) {
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
    }
  }, [isActive]);

  const hasVideo = !!project.cardVideo;
  const hasImage = !!project.image;

  return (
    <div
      className="relative flex flex-col justify-end"
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "var(--color-surface)",
        padding: "var(--page-px)",
      }}
      aria-label={`Project ${index + 1}: ${project.title}, ${project.tags.slice(0, 2).join(" and ")}, ${project.year}`}
    >
      {/* Media area — letterboxed center */}
      <div
        className="absolute inset-0 flex items-center justify-center overflow-hidden"
        style={{ padding: "clamp(2rem, 6vh, 5rem) var(--page-px)" }}
      >
        {hasVideo ? (
          <video
            ref={videoRef}
            src={project.cardVideo}
            muted
            loop
            playsInline
            preload={isActive ? "auto" : "none"}
            poster={project.image || undefined}
            className="w-full h-full object-cover"
            style={{ aspectRatio: "16/9", maxHeight: "60vh", borderRadius: "2px" }}
            aria-hidden="true"
          />
        ) : hasImage ? (
          <img
            src={project.image}
            alt=""
            className="w-full h-full object-cover"
            style={{ aspectRatio: "16/9", maxHeight: "60vh", borderRadius: "2px" }}
            aria-hidden="true"
          />
        ) : (
          /* Gradient fallback */
          <div
            className="w-full flex items-center justify-center"
            style={{
              aspectRatio: "16/9",
              maxHeight: "60vh",
              backgroundColor: project.cover.bg,
              borderRadius: "2px",
            }}
          >
            <span
              className="font-display italic"
              style={{
                fontSize: "var(--text-display)",
                color: project.cover.text,
                opacity: 0.6,
              }}
            >
              {project.title}
            </span>
          </div>
        )}
      </div>

      {/* Metadata overlay — bottom */}
      <div className="relative z-10 mt-auto" style={{ paddingBottom: "24px" }}>
        <span
          className="font-mono uppercase tracking-[0.1em] block"
          style={{
            fontSize: "var(--text-micro)",
            color: "var(--color-text-ghost)",
            marginBottom: "8px",
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <h2
          className="font-display italic"
          style={{
            fontSize: "var(--text-display)",
            color: "var(--color-text)",
            lineHeight: 1.1,
            marginBottom: "8px",
          }}
        >
          {project.title}
        </h2>
        <div className="flex justify-between items-baseline">
          <span
            className="font-mono uppercase tracking-[0.1em]"
            style={{
              fontSize: "var(--text-micro)",
              color: "var(--color-text-ghost)",
            }}
          >
            {project.tags.slice(0, 2).join(" · ")}
          </span>
          <span
            className="font-mono uppercase tracking-[0.1em]"
            style={{
              fontSize: "var(--text-micro)",
              color: "var(--color-text-ghost)",
            }}
          >
            {project.year}
          </span>
        </div>
      </div>
    </div>
  );
}
