import Link from "next/link";
import RoomHeader from "@/components/RoomHeader";
import CornerMark from "@/components/CornerMark";

export default function NotFound() {
  return (
    <main className="relative min-h-screen w-full bg-paper font-sans flex flex-col justify-between">
      <RoomHeader roomLabel="NOT FOUND" />
      <div className="flex-1 flex flex-col items-start justify-center px-[var(--edge-margin)] py-32">
        <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-mist">
          • 404 / ERROR
        </p>
        <h2 className="mt-2 font-sans text-[36px] font-bold leading-[1.1] tracking-[-0.02em] text-ink md:text-[48px]">
          Nothing here.
        </h2>
        <p className="mt-4 max-w-[560px] font-sans text-[16px] leading-[1.6] text-ink-soft">
          The page you are looking for doesn&apos;t exist, or it has moved somewhere quieter.
        </p>
        <Link
          href="/"
          className="mt-8 font-mono text-[10px] uppercase tracking-[0.08em] text-ink underline underline-offset-4"
        >
          Back to home
        </Link>
      </div>
      <CornerMark />
    </main>
  );
}
