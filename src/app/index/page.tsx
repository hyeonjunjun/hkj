import { works } from "@/data/works";
import RoomHeader from "@/components/RoomHeader";
import IndexList from "@/components/works/IndexList";
import CornerMark from "@/components/CornerMark";

/**
 * The full catalog, as opposed to the home page's one-at-a-time
 * spread. A plain text index (see IndexList) rather than a grid.
 * Individual case studies stay at /works/[slug].
 *
 * NOTE: this is still the old thumbnail list. The intent is for /index
 * to be a typographic view of the SAME layout the home page uses, so
 * the shared view-transition names have something to flip between —
 * not a separate composition. Rebuilding it is outstanding work.
 */
export default function IndexRoom() {
  return (
    <main className="relative min-h-screen w-full bg-ws-paper">
      <RoomHeader activeRoom="index" />
      <IndexList works={works} />
      <CornerMark />
    </main>
  );
}
