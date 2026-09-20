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
 * call), then a room-label row with the plain grotesk clock in the same
 * top-right position it holds on every other page.
 */
export default function RoomHeader({ roomLabel, roomCount, activeRoom }: RoomHeaderProps) {
  return (
    <header className="relative z-10 px-[var(--edge-margin)] pt-[var(--edge-margin)]">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
        <Link href="/" className="text-label text-ws-ink">
          {studio.wordmark}
        </Link>
        <nav aria-label="Primary" className="flex flex-wrap items-center gap-5">
          {studio.navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`transition-colors hover:text-ws-ink ${
                item.room === activeRoom
                  ? "text-label text-ws-ink"
                  : "text-value text-ws-ink-mute"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/info"
            className={`transition-colors hover:text-ws-ink ${
              activeRoom === "info"
                ? "text-label text-ws-ink"
                : "text-value text-ws-ink-mute"
            }`}
          >
            info
          </Link>
        </nav>
      </div>
      <div className="mt-[var(--space-3)] flex items-baseline justify-between border-b border-ws-rule pb-[var(--space-2)]">
        <p className="text-label uppercase text-ws-ink">
          {roomCount !== undefined ? `${roomLabel} · ${roomCount}` : roomLabel}
        </p>
        <Clock />
      </div>
    </header>
  );
}
