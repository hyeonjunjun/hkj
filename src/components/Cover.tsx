import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/constants/projects";
import { GrainTexture } from "@/components/GrainTexture";

export function Cover({ project, index }: { project: Project; index: number }) {
  const isDark = isDarkColor(project.cover.bg);
  const number = String(index + 1).padStart(2, "0");

  return (
    <Link
      href={`/work/${project.slug}`}
      data-cover
      aria-label={`View ${project.title} case study`}
      style={{
        display: "block",
        textDecoration: "none",
        borderRadius: "6px",
        overflow: "hidden",
        position: "relative",
        visibility: "hidden",
      }}
    >
      {/* Cover visual — image or color-field fallback */}
      <div
        style={{
          backgroundColor: project.cover.bg,
          aspectRatio: "16 / 9",
          position: "relative",
          overflow: "hidden",
          borderRadius: "6px",
        }}
      >
        {project.coverImage ? (
          <Image
            src={project.coverImage}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, 900px"
            style={{ objectFit: "cover" }}
            priority={index === 0}
          />
        ) : (
          /* Color-field fallback with grain — for WIP / image-less projects */
          <>
            <GrainTexture dark={isDark} />
            {/* Number — top-left, only on color-field covers */}
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

      {/* Meta — below the cover image */}
      <div
        style={{
          paddingTop: "var(--space-standard)",
          paddingBottom: "var(--space-micro)",
        }}
      >
        {/* Title row */}
        <p
          className="font-display"
          style={{
            fontSize: "var(--text-title)",
            lineHeight: "var(--leading-display)",
            color: "var(--ink-full)",
            marginBottom: "var(--space-small)",
          }}
        >
          {project.title}
        </p>

        {/* Description */}
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

        {/* Sector · Year · WIP badge */}
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
    </Link>
  );
}

function isDarkColor(hex: string): boolean {
  const c = hex.replace("#", "");
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.5;
}
