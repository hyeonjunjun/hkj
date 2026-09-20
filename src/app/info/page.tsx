import { studio } from "@/data/studio";
import RoomHeader from "@/components/RoomHeader";
import CornerMark from "@/components/CornerMark";

/**
 * Plain stacked sections, hairline-divided — no boxed/pill containers,
 * per the editorial-analog rebuild's site-wide chrome rule. Every text
 * element, including the quote, uses the same plain grotesk as the nav
 * bar — editorial comes from the hairline-divided composition, not a
 * display serif.
 */
export default function InfoRoom() {
  return (
    <main className="relative min-h-screen w-full bg-ws-paper">
      <RoomHeader activeRoom="info" />
      {/* pb-56 (not a smaller pad) leaves room for CornerMark, which is
          `absolute bottom-[edge-margin]` against <main> and lands wherever
          this content's own bottom edge happens to be. */}
      <div className="max-w-[640px] px-[var(--edge-margin)] pt-16 pb-56">
        <section className="border-b border-ws-rule pb-10 mb-10">
          <h2 className="mb-4 text-value text-ws-ink-mute">Practice</h2>
          <p className="text-prose text-ws-ink">{studio.standfirst}</p>
        </section>

        {studio.quote && (
          <section className="border-b border-ws-rule pb-10 mb-10">
            <h2 className="mb-4 text-value text-ws-ink-mute">Philosophy</h2>
            <blockquote className="text-label leading-relaxed text-ws-ink">
              “{studio.quote.text}”
              <footer className="mt-3 text-value font-normal text-ws-ink-mute">
                — {studio.quote.author}
              </footer>
            </blockquote>
          </section>
        )}

        <section id="contact" className="scroll-mt-20 border-b border-ws-rule pb-10 mb-10">
          <h2 className="mb-4 text-value text-ws-ink-mute">Contact</h2>
          <p className="text-prose text-ws-ink">
            <a href={`mailto:${studio.contactEmail}`} className="underline underline-offset-4">
              {studio.contactEmail}
            </a>
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-value text-ws-ink-mute">Colophon</h2>
          <div className="space-y-2 text-value text-ws-ink-mute">
            <p>Set in Instrument Sans.</p>
            <p>Built with Next.js and Tailwind. Deployed on Vercel.</p>
            <p>Colors in OKLCH color space.</p>
          </div>
        </section>
      </div>
      <CornerMark />
    </main>
  );
}
