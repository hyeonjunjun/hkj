import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import GeometricFrame from "@/components/GeometricFrame";
import DetailContent from "@/components/DetailContent";
import Footer from "@/components/Footer";
import { PIECES } from "@/constants/pieces";
import { CASE_STUDIES } from "@/constants/case-studies";

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
    <main id="main" className="min-h-screen">
      {/* Hero */}
      <div className="px-[clamp(24px,6vw,48px)] pt-16">
        <GeometricFrame
          variant="hero"
          layoutId={`frame-${piece.slug}`}
        >
          <div
            className="w-full overflow-hidden relative"
            style={{
              aspectRatio: "16 / 9",
              backgroundColor: piece.cover.bg,
            }}
          >
            {piece.video ? (
              <video
                src={piece.video}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
            ) : piece.image ? (
              <Image
                src={piece.image}
                alt={piece.title}
                fill
                sizes="100vw"
                className="object-cover"
                priority
              />
            ) : null}
          </div>
        </GeometricFrame>
      </div>

      {/* Header */}
      <div className="px-[clamp(24px,6vw,48px)] pt-10">
        <h1 className="font-display text-[clamp(22px,4vw,32px)] text-fg tracking-tight">
          {piece.title}
        </h1>
        <p className="text-[13px] text-fg-2 mt-2 max-w-[600px] leading-relaxed">
          {piece.description}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-3 mt-4">
          <span className="font-mono text-[11px] text-fg-3 tabular-nums">
            {piece.year}
          </span>
          {piece.tags.map((tag) => (
            <span
              key={tag}
              className="font-mono text-[10px] uppercase tracking-[0.04em] border border-fg-4 rounded-sm px-2 py-0.5 text-fg-3"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Case study content */}
      <DetailContent
        caseStudy={caseStudy}
        fallbackDescription={piece.description}
      />

      {/* Next project link */}
      <div className="px-[clamp(24px,6vw,48px)] pb-14">
        <Link
          href={`/index/${nextProject.slug}`}
          data-cursor="link"
          className="block border-t border-fg-4 pt-8 group"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-fg-3 block mb-2">
            Next
          </span>
          <span className="font-display text-[clamp(18px,3vw,24px)] text-fg block transition-transform duration-300 group-hover:translate-x-2">
            {nextProject.title}
          </span>
          <span className="text-[13px] text-fg-2 block mt-1 transition-opacity duration-300 group-hover:opacity-70">
            {nextProject.description}
          </span>
        </Link>
      </div>

      <Footer />
    </main>
  );
}
