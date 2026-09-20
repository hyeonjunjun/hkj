import { works } from "@/data/works";
import Clock from "@/components/Clock";
import SiteNav from "@/components/SiteNav";
import WorkShowcase from "@/components/home/WorkShowcase";

/**
 * Homepage: a bare top row (wordmark, nav, info, clock — no chip/pill
 * backgrounds, per the editorial-analog rebuild) over HomeIndex's
 * work-index centerpiece. Locked to one viewport on desktop -- no page
 * scroll. The clock sits top-right in the same plain grotesk on every
 * page (see Clock's own comment); the verbose DateTimeReadout this
 * replaced is retired.
 */
export default function Landing() {
  return (
    <main className="relative flex min-h-[100dvh] w-full flex-col bg-ws-paper">
      <div className="sticky top-0 z-20 bg-ws-paper pb-[var(--space-2)]">
        <SiteNav trailing={<Clock className="text-label text-ws-ink" />} />
      </div>

      <div className="flex-1">
        <WorkShowcase works={works} />
      </div>
    </main>
  );
}
