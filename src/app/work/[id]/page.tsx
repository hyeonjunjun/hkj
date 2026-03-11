"use client";

import { use, useState, useEffect } from "react";
import { notFound } from "next/navigation";
import { PROJECTS, Project } from "@/constants/projects";
import ScrollStage from "@/components/case-study/ScrollStage";

export default function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const [project, setProject] = useState<Project | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const found = PROJECTS.find((p) => p.id === resolvedParams.id);
    if (found) {
      setProject(found);
    }
    setChecked(true);
  }, [resolvedParams.id]);

  if (!checked) return null;
  if (!project) return notFound();

  return (
    <main className="min-h-screen relative">
      <ScrollStage project={project} />
    </main>
  );
}
