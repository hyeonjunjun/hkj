import { studio } from "@/data/studio";
import { works } from "@/data/works";
import Nav from "@/components/Nav";
import DateTimeReadout from "@/components/DateTimeReadout";
import WorkShowcase from "@/components/home/WorkShowcase";

/**
 * Homepage: a thin utility top bar (wordmark, live date/time, nav,
 * email) over a single large contained work image, centered in the
 * remaining viewport height, with a matching bottom utility bar
 * (prev/next paging, tagline, current work caption, email). Locked to
 * one viewport on desktop -- no page scroll, only paging through works.
 */
export default function Landing() {
  return (
    <main className="relative flex h-[100dvh] w-full flex-col bg-ws-paper font-display">
      <div aria-hidden="true" className="h-[3px] w-full shrink-0 bg-ws-ink" />
      <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-2 px-[var(--edge-margin)] pb-8 pt-4">
        <span className="font-display text-[15px] font-bold text-ws-ink">{studio.wordmark}</span>
        <DateTimeReadout />
        <Nav items={studio.navItems} variant="bar" />
        <div className="flex items-center gap-4">
          <a
            href={`mailto:${studio.contactEmail}`}
            className="font-display text-[13px] text-ws-ink transition-opacity hover:opacity-60"
          >
            Email
          </a>
          <a href="#" className="font-display text-[13px] text-ws-ink transition-opacity hover:opacity-60">
            Instagram
          </a>
        </div>
      </div>

      <div className="min-h-0 flex-1">
        <WorkShowcase works={works} />
      </div>
    </main>
  );
}
