import { studio } from "@/data/studio";
import { works } from "@/data/works";
import Wordmark from "@/components/Wordmark";
import Nav from "@/components/Nav";
import Standfirst from "@/components/Standfirst";
import ThesisStatement from "@/components/ThesisStatement";
import CornerMark from "@/components/CornerMark";
import HomeTimeline from "@/components/timeline/HomeTimeline";

/**
 * The landing masthead — a quiet room that opens onto the four rooms via
 * Nav. Deliberately no project previews in the middle of the composition
 * (Option ii from earlier discussion, adapted for shared-system launch);
 * revisit once real content exists across the rooms (Option i with room
 * counts, Option iii with live previews).
 */
export default function Landing() {
  return (
    <main className="relative min-h-screen w-full bg-paper font-sans md:h-screen md:overflow-hidden">
      {/* static (normal flow) on mobile so the block actually reserves
          space above ThesisStatement/CornerMark, which are also static
          there — md:absolute only from tablet up, matching the same
          responsive pattern used by every other corner-anchored piece. */}
      <div className="static flex flex-col items-start gap-8 px-[var(--edge-margin)] pt-[var(--edge-margin)] md:absolute md:inset-x-0 md:top-0 md:z-10 md:flex-row md:items-start md:justify-between md:gap-0 md:px-[var(--edge-margin)] md:pt-[var(--edge-margin)]">
        <div>
          <Wordmark />
          <Standfirst />
        </div>
        <Nav items={studio.navItems} />
      </div>

      <div className="mt-8 px-[var(--edge-margin)] md:absolute md:inset-x-0 md:top-[43%] md:mt-0 md:px-0">
        <HomeTimeline works={works} />
      </div>

      <ThesisStatement />
      <CornerMark />
    </main>
  );
}
