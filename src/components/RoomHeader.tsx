import { studio } from "@/data/studio";
import Clock from "./Clock";
import Nav from "./Nav";
import Wordmark from "./Wordmark";

interface RoomHeaderProps {
  /** Displayed uppercase, e.g. "WORKS". */
  roomLabel: string;
  /** Optional count, rendered as "· {roomCount}" next to the label. */
  roomCount?: number;
}

/**
 * Shared chrome at the top of every room page: a shrunk wordmark (linking
 * back to "/") and Nav on the first row, then a room label/count and the
 * live clock on a second row, separated from the room's own content by a
 * hairline rule.
 */
export default function RoomHeader({ roomLabel, roomCount }: RoomHeaderProps) {
  return (
    <header className="relative z-10 px-[var(--edge-margin)] pt-[var(--edge-margin)]">
      <div className="flex items-start justify-between">
        <Wordmark variant="room" />
        <Nav items={studio.navItems} />
      </div>
      <div className="mt-12 flex items-baseline justify-between border-b border-ws-ink/10 pb-4">
        <p className="font-instrument-sans text-[12px] font-bold uppercase tracking-[0.08em] text-ws-ink">
          {roomLabel}
          {roomCount !== undefined && <span className="text-ws-ink/40"> · {roomCount}</span>}
        </p>
        <Clock />
      </div>
    </header>
  );
}
