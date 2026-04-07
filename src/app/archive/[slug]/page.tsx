import { notFound } from "next/navigation";
import { PIECES } from "@/constants/pieces";
import { CASE_STUDIES } from "@/constants/case-studies";
import DetailView from "@/components/DetailView";

const experiments = PIECES.filter((p) => p.type === "experiment").sort(
  (a, b) => a.order - b.order
);

export function generateStaticParams() {
  return experiments.map((p) => ({ slug: p.slug }));
}

export default async function ArchiveDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const currentIndex = experiments.findIndex((p) => p.slug === slug);
  if (currentIndex === -1) notFound();

  const piece = experiments[currentIndex];
  const caseStudy = CASE_STUDIES[piece.slug];
  const nextExp = experiments[(currentIndex + 1) % experiments.length];

  return (
    <DetailView
      piece={piece}
      caseStudy={caseStudy}
      nextSlug={nextExp.slug}
      nextTitle={nextExp.title}
      backHref="/archive"
      backLabel="Archive"
    />
  );
}
