import type { RoomKey } from "@/lib/types";
import Clock from "./Clock";
import SiteNav from "./SiteNav";

interface RoomHeaderProps {
  /** Displayed as-is in the room label, e.g. "Index · 5". */
  roomLabel: string;
  /** Optional count, appended to roomLabel as " · {roomCount}". */
  roomCount?: number;
  /** Which nav item (if any) should render active rather than muted. */
  activeRoom?: RoomKey;
}

/**
 * Shared chrome at the top of every room: wordmark / nav / info as bare
 * text (no pill/container backgrounds — the editorial-analog rebuild's
 * explicit rule, applied site-wide per the "chips out everywhere"
 * call), then a room-label row with the plain grotesk clock in the same
 * top-right position it holds on every other page.
 */
export default function RoomHeader({ roomLabel, roomCount, activeRoom }: RoomHeaderProps) {
  return (
    <header className="relative z-10 pt-[var(--edge-margin)]">
      <SiteNav activeRoom={activeRoom} />

      <div className="grid12 mt-[var(--space-3)] items-baseline">
        <div className="col-span-12 col-start-1 flex items-baseline justify-between pb-[var(--space-2)]">
          <p className="text-label uppercase text-ws-ink">
            {roomCount !== undefined ? `${roomLabel} · ${roomCount}` : roomLabel}
          </p>
          <Clock />
        </div>
      </div>
    </header>
  );
}
