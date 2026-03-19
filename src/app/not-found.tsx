"use client";

import TransitionLink from "@/components/TransitionLink";

export default function NotFound() {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen p-4 text-center"
      style={{ backgroundColor: "var(--color-bg)", color: "var(--color-text)" }}
    >
      <h1
        className="font-display italic leading-none mb-4 select-none"
        style={{ fontSize: "12vw", opacity: 0.08 }}
      >
        404
      </h1>
      <h2
        className="font-display italic mb-6"
        style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)" }}
      >
        Nothing here.
      </h2>
      <p
        className="font-sans max-w-md mb-12"
        style={{
          color: "var(--color-text-dim)",
          fontSize: 15,
          lineHeight: 1.6,
          letterSpacing: "-0.005em",
        }}
      >
        The page you&apos;re looking for doesn&apos;t exist, or it moved
        somewhere quieter.
      </p>
      <TransitionLink
        href="/"
        className="font-mono transition-colors duration-300 hover:text-[var(--color-text)]"
        style={{
          fontSize: 10,
          color: "var(--color-text-dim)",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}
      >
        Back home
      </TransitionLink>
    </div>
  );
}
