import Link from "next/link";
import { studio } from "@/data/studio";
import { works } from "@/data/works";
import Clock from "@/components/Clock";
import WorkShowcase from "@/components/home/WorkShowcase";

/**
 * Homepage: a bare top row (wordmark, nav, info, clock — no chip/pill
 * backgrounds, per the editorial-analog rebuild) over HomeIndex's
 * work-index centerpiece. Locked to one viewport on desktop -- no page
 * scroll. The clock sits top-right in the same plain serif on every
 * page (see Clock's own comment); the verbose DateTimeReadout this
 * replaced is retired.
 */
export default function Landing() {
  return (
    <main className="relative flex h-[100dvh] w-full flex-col bg-ws-paper">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 px-[var(--edge-margin)] py-4 md:py-6">
        <Link href="/" className="font-instrument-sans text-body font-bold text-ws-ink">
          {studio.wordmark}
        </Link>
        <nav aria-label="Primary" className="flex flex-wrap items-center gap-5">
          {studio.navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-instrument-sans text-meta font-medium text-ws-ink/50 transition-colors hover:text-ws-ink"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/info"
            className="font-instrument-sans text-meta font-medium text-ws-ink/50 transition-colors hover:text-ws-ink"
          >
            info
          </Link>
        </nav>
        <Clock />
      </div>

      <div className="min-h-0 flex-1">
        <WorkShowcase works={works} />
      </div>
    </main>
  );
}
