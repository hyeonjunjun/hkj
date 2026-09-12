import { works } from "@/data/works";
import RoomHeader from "@/components/RoomHeader";
import IndexList from "@/components/works/IndexList";
import CornerMark from "@/components/CornerMark";

/**
 * The full catalog, as opposed to home's one-at-a-time player (see
 * WorkPlayer's top-of-file comment). A plain text index (see IndexList's
 * comment) rather than a grid. Individual case studies stay at
 * /works/[slug] — a real internal page, unlike dylan.camera's Index
 * (which likely links out to external client work).
 */
export default function IndexRoom() {
  return (
    <main className="relative min-h-screen w-full bg-ws-paper font-instrument-sans">
      <RoomHeader roomLabel="Index" roomCount={works.length} activeRoom="index" />
      <IndexList works={works} />
      <CornerMark />
    </main>
  );
}
