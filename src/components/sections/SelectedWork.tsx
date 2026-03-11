"use client";

import { PROJECTS } from "@/constants/projects";
import SelectedWorkCard from "./SelectedWorkCard";

export default function SelectedWork() {
  const displayProjects = PROJECTS.filter((p) => p.id !== "gyeol");

  return (
    <section
      data-section="work"
      className="relative"
      style={{
        backgroundColor: "var(--color-bg)",
        padding: "6rem var(--page-px) 4rem",
      }}
    >
      {/* Section header — console-style */}
      <div
        className="flex items-center justify-between mb-12"
        style={{
          borderBottom: "1px solid var(--color-border)",
          paddingBottom: "0.75rem",
        }}
      >
        <span className="label">Selected Work</span>
        <span className="label">{displayProjects.length} Projects</span>
      </div>

      {/* Grid */}
      <div
        className="grid gap-6"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
        }}
      >
        {displayProjects.map((project, i) => (
          <SelectedWorkCard key={project.id} project={project} index={i} />
        ))}
      </div>
    </section>
  );
}
