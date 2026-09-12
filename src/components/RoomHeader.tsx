import Link from "next/link";
import { studio } from "@/data/studio";
import type { RoomKey } from "@/lib/types";
import Clock from "./Clock";

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
 * call), then a room-label row with the plain serif clock in the same
 * top-right position it holds on every other page.
 */
export default function RoomHeader({ roomLabel, roomCount, activeRoom }: RoomHeaderProps) {
  return (
    <header className="relative z-10 px-[var(--edge-margin)] pt-[var(--edge-margin)]">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
        <Link href="/" className="font-instrument-sans text-[15px] font-bold text-ws-ink">
          {studio.wordmark}
        </Link>
        <nav aria-label="Primary" className="flex flex-wrap items-center gap-5">
          {studio.navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`font-instrument-sans text-[13px] font-medium transition-colors hover:text-ws-ink ${
                item.room === activeRoom ? "text-ws-ink" : "text-ws-ink/50"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/info"
            className={`font-instrument-sans text-[13px] font-medium transition-colors hover:text-ws-ink ${
              activeRoom === "info" ? "text-ws-ink" : "text-ws-ink/50"
            }`}
          >
            info
          </Link>
        </nav>
      </div>
      <div className="mt-4 flex items-baseline justify-between border-b border-ws-ink/10 pb-4">
        <p className="font-instrument-sans text-[12px] font-medium text-ws-ink">
          {roomCount !== undefined ? `${roomLabel} · ${roomCount}` : roomLabel}
        </p>
        <Clock />
      </div>
    </header>
  );
}
