import { notFound } from "next/navigation";
import { works } from "@/data/works";
import RoomHeader from "@/components/RoomHeader";
import { MediaRenderer } from "@/components/works/WorkTile";
import CornerMark from "@/components/CornerMark";

export function generateStaticParams() {
  return works.map((work) => ({ slug: work.slug }));
}

interface WorkPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Scaffold for an individual Work case study. Renders the placeholder
 * shape (title, description, media, "coming soon" marker) for now — the
 * full case-study template arrives in a later build.
 */
export default async function WorkPage({ params }: WorkPageProps) {
  const { slug } = await params;
  const work = works.find((w) => w.slug === slug);
  if (!work) notFound();

  return (
    <main className="relative min-h-screen w-full bg-paper font-sans">
      <RoomHeader roomLabel="WORKS" />
      <div className="px-[var(--edge-margin)] pt-16 pb-32">
        <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-mist">
          • {work.romanNumeral} / {work.category}
        </p>
        <h2 className="mt-2 font-sans text-[36px] font-bold leading-[1.1] tracking-[-0.02em] text-ink md:text-[48px]">
          {work.title}
        </h2>
        <p className="mt-4 max-w-[560px] font-sans text-[16px] leading-[1.6] text-ink-soft">
          {work.description}
        </p>
        <div className="mt-8 max-w-[560px]">
          <MediaRenderer media={work.media} />
        </div>
        <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.08em] text-mist">
          Case study coming soon.
        </p>
      </div>
      <CornerMark />
    </main>
  );
}
