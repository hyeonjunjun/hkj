import Link from "next/link";
import RoomHeader from "@/components/RoomHeader";
import CornerMark from "@/components/CornerMark";

export default function NotFound() {
  return (
    <main className="relative min-h-screen w-full bg-ws-paper flex flex-col justify-between">
      <RoomHeader />
      <div className="flex-1 flex flex-col items-start justify-center px-[var(--edge-margin)] py-32">
        <p className="text-value uppercase text-ws-ink-mute">
          • 404 / ERROR
        </p>
        <h2 className="mt-2 text-label uppercase text-ws-ink">
          Nothing here.
        </h2>
        <p className="mt-4 max-w-[560px] text-prose text-ws-ink-mute">
          The page you are looking for doesn&apos;t exist, or it has moved somewhere quieter.
        </p>
        <Link
          href="/"
          className="mt-8 text-value uppercase text-ws-ink underline underline-offset-4"
        >
          Back to home
        </Link>
      </div>
      <CornerMark />
    </main>
  );
}
