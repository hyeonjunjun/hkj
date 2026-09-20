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
    <main className="relative flex h-[100dvh] w-full flex-col bg-ws-paper">
      <div className="py-[var(--space-2)] md:py-[var(--space-3)]">
        <SiteNav trailing={<Clock />} />
      </div>

      <div className="min-h-0 flex-1">
        <WorkShowcase works={works} />
      </div>
    </main>
  );
}
