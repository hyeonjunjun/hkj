import { archive } from "@/data/archive";
import RoomHeader from "@/components/RoomHeader";
import ArchiveFeed from "@/components/archive/ArchiveFeed";
import CornerMark from "@/components/CornerMark";

/**
 * Ongoing writing about process, work, and life — kept as its own
 * fifth section alongside Home/Index/Gallery/Info rather than folded
 * into either, since mixing personal writing into the polished
 * work-facing sections would dilute what makes Index/Gallery work.
 * Reuses the existing dated-entry data model and feed component as-is
 * (internally still named "archive" — only the route and chrome moved
 * to "journal"; the data model change wasn't part of this pass).
 */
export default function JournalRoom() {
  return (
    <main className="relative min-h-screen w-full bg-ws-paper">
      <RoomHeader roomLabel="Journal" roomCount={archive.length} activeRoom="journal" />
      <div className="font-instrument-sans px-[var(--edge-margin)] pt-16 pb-32">
        <ArchiveFeed entries={archive} />
      </div>
      <CornerMark />
    </main>
  );
}
