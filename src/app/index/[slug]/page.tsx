import { notFound } from "next/navigation";
import Image from "next/image";
import { PIECES } from "@/constants/pieces";
import { CASE_STUDIES } from "@/constants/case-studies";
import DetailView from "@/components/DetailView";

const projects = PIECES.filter((p) => p.type === "project").sort(
  (a, b) => a.order - b.order
);

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const currentIndex = projects.findIndex((p) => p.slug === slug);
  if (currentIndex === -1) notFound();

  const piece = projects[currentIndex];
  const caseStudy = CASE_STUDIES[piece.slug];
  const nextProject = projects[(currentIndex + 1) % projects.length];

  return (
    <DetailView
      piece={piece}
      caseStudy={caseStudy}
      nextSlug={nextProject.slug}
      nextTitle={nextProject.title}
      backHref="/index"
      backLabel="Index"
    />
  );
}
