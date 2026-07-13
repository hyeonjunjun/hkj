import { references } from "@/data/references";
import RoomHeader from "@/components/RoomHeader";
import ReferenceGrid from "@/components/references/ReferenceGrid";
import CornerMark from "@/components/CornerMark";

export default function ReferencesRoom() {
  return (
    <main className="relative min-h-screen w-full bg-paper font-sans">
      <RoomHeader roomLabel="REFERENCES" roomCount={references.length} />
      <div className="px-[var(--edge-margin)] pt-16 pb-32">
        <ReferenceGrid references={references} />
      </div>
      <CornerMark />
    </main>
  );
}
