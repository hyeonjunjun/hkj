"use client";

import Image from "next/image";
import type { Project } from "@/constants/projects";

interface ProjectCoverProps {
  project: Project;
  index: number;
  isHovered: boolean;
  isWip?: boolean;
}

export default function ProjectCover({
  project,
  index,
  isHovered,
  isWip,
}: ProjectCoverProps) {
  const hasMedia = !!(project.cardVideo || project.image);

  return (
    <div
      data-image
      className="cover-grain"
      style={{
        height: "100%",
        position: "relative",
        overflow: "hidden",
        backgroundColor: project.cover.bg,
        scale: isHovered && !isWip ? "1.015" : "1",
        transition: "scale 0.6s cubic-bezier(0.23, 1, 0.32, 1)",
      }}
    >
      {/* Layer 2: Media */}
      {hasMedia && !isWip && (
        <>
          {project.cardVideo ? (
            <video
              src={project.cardVideo}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          )}

          {/* Layer 3: Color tint — ties media back to project identity */}
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: project.cover.bg,
              opacity: 0.15,
              mixBlendMode: "multiply",
            }}
          />
        </>
      )}

      {/* Layer 4: Grain — handled by .cover-grain::after */}

      {/* Layer 5: Typography */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          padding: "clamp(0.5rem, 1vw, 0.8rem)",
          color: project.cover.text,
        }}
      >
        <span
          className="font-mono block"
          style={{
            fontSize: "8px",
            opacity: 0.5,
            letterSpacing: "0.05em",
            marginBottom: "2px",
          }}
        >
          {String(index).padStart(2, "0")}
        </span>
        <span
          className="font-display italic block"
          style={{
            fontSize: "var(--text-h3)",
            lineHeight: 1.2,
            color: isHovered ? "var(--color-accent)" : project.cover.text,
            transition: "color 0.3s ease",
          }}
        >
          {project.title}
        </span>
        <span
          className="font-mono uppercase block"
          style={{
            fontSize: "8px",
            letterSpacing: "0.1em",
            opacity: 0.5,
            marginTop: "2px",
          }}
        >
          {project.sector} · {project.year}
          {isWip && " · Coming Soon"}
        </span>
      </div>
    </div>
  );
}
