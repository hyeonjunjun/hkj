import { works } from "@/data/works";
import Clock from "@/components/Clock";
import SiteNav, { Wordmark } from "@/components/SiteNav";
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
    <main className="relative flex h-[100dvh] w-full flex-col bg-ws-paper">
      <div className="flex flex-wrap items-baseline gap-x-[var(--space-3)] gap-y-2 px-[var(--edge-margin)] pt-[var(--space-1)] pb-[var(--space-2)]">
        <Wordmark />
        <SiteNav />
        <Clock />
      </div>

      <div className="min-h-0 flex-1">
        <WorkShowcase works={works} />
      </div>
    </main>
  );
}
