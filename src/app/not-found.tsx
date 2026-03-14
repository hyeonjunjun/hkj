import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen p-4 text-center"
      style={{ backgroundColor: "var(--color-bg)", color: "var(--color-text)" }}
    >
      <h1
        className="font-serif italic leading-none mb-4 select-none"
        style={{ fontSize: "12vw", opacity: 0.1 }}
      >
        404
      </h1>
      <h2
        className="font-serif italic mb-6"
        style={{ fontSize: "var(--text-2xl)" }}
      >
        Nothing here.
      </h2>
      <p
        className="font-sans max-w-md mb-12"
        style={{
          color: "var(--color-text-dim)",
          fontSize: "var(--text-sm)",
        }}
      >
        The page you&apos;re looking for doesn&apos;t exist, or it moved
        somewhere quieter.
      </p>
      <Link
        href="/"
        className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-full transition-colors duration-300 hover:bg-[var(--color-text)] hover:text-[var(--color-bg)]"
        style={{
          border: "1px solid var(--color-border)",
          color: "var(--color-text-dim)",
        }}
      >
        <span
          className="font-sans tracking-[0.02em]"
          style={{ fontSize: "var(--text-xs)" }}
        >
          back home
        </span>
      </Link>
    </div>
  );
}
