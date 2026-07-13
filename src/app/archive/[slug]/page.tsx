import { notFound } from "next/navigation";
import { archive } from "@/data/archive";
import RoomHeader from "@/components/RoomHeader";
import ArchiveEntry from "@/components/archive/ArchiveEntry";
import CornerMark from "@/components/CornerMark";

export function generateStaticParams() {
  return archive
    .filter((entry): entry is typeof entry & { slug: string } => Boolean(entry.slug))
    .map((entry) => ({ slug: entry.slug }));
}

interface ArchiveEntryPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Scaffold for an individual Archive entry permalink — more breathing
 * room than the feed's tight rule-separated rhythm, at the entry's
 * normal type scale for now. A dedicated large-type template can follow
 * once real long-form entries exist.
 */
export default async function ArchiveEntryPage({ params }: ArchiveEntryPageProps) {
  const { slug } = await params;
  const entry = archive.find((e) => e.slug === slug);
  if (!entry) notFound();

  return (
    <main className="relative min-h-screen w-full bg-paper">
      <RoomHeader roomLabel="ARCHIVE" />
      <div className="font-courier px-[var(--edge-margin)] pt-24 pb-32">
        <ArchiveEntry entry={entry} />
      </div>
      <CornerMark />
    </main>
  );
}
