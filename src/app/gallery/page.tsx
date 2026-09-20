import { works } from "@/data/works";
import RoomHeader from "@/components/RoomHeader";
import GalleryWall from "@/components/works/GalleryWall";
import CornerMark from "@/components/CornerMark";

/**
 * Every still across every work, pooled into one long-scrolling wall —
 * see GalleryWall's top-of-file comment. RoomHeader is sticky here so
 * the chrome stays put while the wall scrolls beneath it, matching
 * dylan.camera's fixed-chrome-over-scrolling-grid Gallery.
 */
export default function GalleryRoom() {
  return (
    <main className="relative min-h-screen w-full bg-ws-paper">
      <div className="sticky top-0 z-10 bg-ws-paper pb-4">
        <RoomHeader roomLabel="Gallery" activeRoom="gallery" />
      </div>
      <GalleryWall works={works} />
      <CornerMark />
    </main>
  );
}
