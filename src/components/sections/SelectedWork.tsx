"use client";

import { PROJECTS } from "@/constants/projects";
import SelectedWorkCard from "./SelectedWorkCard";

export default function SelectedWork() {
  const displayProjects = PROJECTS.filter((p) => p.id !== "gyeol");

  return (
    <section
      data-section="work"
      className="relative py-24 md:py-40"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      {/* Quiet section label */}
      <div className="px-6 md:px-12 mb-16">
        <span
          className="font-mono uppercase tracking-[0.3em]"
          style={{ fontSize: "var(--text-xs)", color: "var(--color-text-dim)" }}
        >
          Selected Work
        </span>
      </div>

      {displayProjects.map((project, i) => (
        <SelectedWorkCard key={project.id} project={project} index={i} />
      ))}
    </section>
  );
}
