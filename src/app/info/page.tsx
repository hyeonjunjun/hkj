import { studio } from "@/data/studio";
import RoomHeader from "@/components/RoomHeader";
import CornerMark from "@/components/CornerMark";

export default function InfoRoom() {
  return (
    <main className="relative min-h-screen w-full bg-ws-paper font-instrument-sans">
      <RoomHeader roomLabel="INFO" />
      <div className="max-w-[720px] px-[var(--edge-margin)] pt-16 pb-32">
        <section className="mb-16">
          <h2 className="mb-4 text-[10px] font-bold uppercase tracking-[0.08em] text-ws-ink/40">
            PRACTICE
          </h2>
          <p className="text-[16px] leading-[1.6] text-ws-ink">{studio.standfirst}</p>
        </section>

        <section id="contact" className="mb-16 scroll-mt-20">
          <h2 className="mb-4 text-[10px] font-bold uppercase tracking-[0.08em] text-ws-ink/40">
            CONTACT
          </h2>
          <p className="text-[16px] text-ws-ink">
            <a
              href={`mailto:${studio.contactEmail}`}
              className="underline underline-offset-4"
            >
              {studio.contactEmail}
            </a>
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-[10px] font-bold uppercase tracking-[0.08em] text-ws-ink/40">
            COLOPHON
          </h2>
          <div className="space-y-2 text-[14px] leading-[1.6] text-ws-ink/60">
            <p>Type set in Instrument Sans.</p>
            <p>Built with Next.js and Tailwind. Deployed on Vercel.</p>
            <p>Colors in OKLCH color space.</p>
          </div>
        </section>
      </div>
      <CornerMark />
    </main>
  );
}
