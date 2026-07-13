import { studio } from "@/data/studio";
import RoomHeader from "@/components/RoomHeader";
import CornerMark from "@/components/CornerMark";

export default function InfoRoom() {
  return (
    <main className="relative min-h-screen w-full bg-paper font-sans">
      <RoomHeader roomLabel="INFO" />
      <div className="max-w-[720px] px-[var(--edge-margin)] pt-16 pb-32">
        <section className="mb-16">
          <h2 className="mb-4 font-mono text-[10px] uppercase tracking-[0.08em] text-mist">
            PRACTICE
          </h2>
          <p className="text-[16px] leading-[1.6] text-ink">{studio.standfirst}</p>
        </section>

        <section className="mb-16">
          <h2 className="mb-4 font-mono text-[10px] uppercase tracking-[0.08em] text-mist">
            CONTACT
          </h2>
          <p className="text-[16px] text-ink">
            <a
              href={`mailto:${studio.contactEmail}`}
              className="underline underline-offset-4"
            >
              {studio.contactEmail}
            </a>
          </p>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-[10px] uppercase tracking-[0.08em] text-mist">
            COLOPHON
          </h2>
          <div className="space-y-2 text-[14px] leading-[1.6] text-ink-soft">
            <p>Type set in Inter Tight, Courier Prime, and Instrument Serif.</p>
            <p>Built with Next.js and Tailwind. Deployed on Vercel.</p>
            <p>Colors in OKLCH color space.</p>
          </div>
        </section>
      </div>
      <CornerMark />
    </main>
  );
}
