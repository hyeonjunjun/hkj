import Link from "next/link";
import type { Project } from "@/constants/projects";
import { GrainTexture } from "@/components/GrainTexture";

export function Cover({ project, index }: { project: Project; index: number }) {
  const isDark = isDarkColor(project.cover.bg);
  const number = String(index + 1).padStart(2, "0");

  const metaParts = [
    project.sector,
    project.year,
    project.status === "wip" ? "In progress" : null,
  ].filter(Boolean).join(" · ");

  return (
    <Link
      href={`/work/${project.slug}`}
      data-cover
      aria-label={`View ${project.title} case study`}
      style={{
        display: "block",
        textDecoration: "none",
        backgroundColor: project.cover.bg,
        borderRadius: "4px",
        overflow: "hidden",
        position: "relative",
        aspectRatio: "4 / 3",
      }}
    >
      {/* Grain texture layer */}
      <GrainTexture dark={isDark} />

      {/* Project number — top-left */}
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

      {/* Bottom area — title + meta */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "var(--space-comfortable)",
          zIndex: 3,
        }}
      >
        <p
          className="font-display"
          style={{
            fontSize: "var(--text-title)",
            lineHeight: "var(--leading-display)",
            color: project.cover.text,
            marginBottom: "var(--space-small)",
          }}
        >
          {project.title}
        </p>
        <p
          className="font-mono"
          style={{
            fontSize: "var(--text-meta)",
            letterSpacing: "var(--tracking-label)",
            textTransform: "uppercase",
            color: project.cover.accent,
          }}
        >
          {metaParts}
        </p>
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
