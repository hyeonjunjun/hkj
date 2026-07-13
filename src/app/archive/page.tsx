import { archive } from "@/data/archive";
import RoomHeader from "@/components/RoomHeader";
import ArchiveFeed from "@/components/archive/ArchiveFeed";
import CornerMark from "@/components/CornerMark";

export default function ArchiveRoom() {
  return (
    <main className="relative min-h-screen w-full bg-paper">
      <RoomHeader roomLabel="ARCHIVE" roomCount={archive.length} />
      <div className="font-courier px-[var(--edge-margin)] pt-16 pb-32">
        <ArchiveFeed entries={archive} />
      </div>
      <CornerMark />
    </main>
  );
}
