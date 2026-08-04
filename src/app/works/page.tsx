import { works } from "@/data/works";
import RoomHeader from "@/components/RoomHeader";
import WorkGrid from "@/components/works/WorkGrid";
import CornerMark from "@/components/CornerMark";

/**
 * The full catalog, as opposed to home's curated four-tile "look" (see
 * FeaturedGrid's top-of-file comment). Same room-index pattern as
 * /archive: RoomHeader chrome, then the room's own content, CornerMark
 * anchoring the page. WorkGrid already existed from before the homepage
 * became the works showcase (see WorkShowcase's "after the /works
 * retirement" note) — this route just puts it back behind a real page.
 */
export default function WorksRoom() {
  return (
    <main className="relative min-h-screen w-full bg-ws-paper font-instrument-sans">
      <RoomHeader roomLabel="WORKS" roomCount={works.length} />
      <WorkGrid works={works} />
      <CornerMark />
    </main>
  );
}
