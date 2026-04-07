"use client";

import { motion } from "framer-motion";
import { useTheaterStore } from "@/store/useTheaterStore";
import { PIECES } from "@/constants/pieces";

const projects = PIECES.filter((p) => p.type === "project").sort(
  (a, b) => a.order - b.order
);

const anim = {
  initial: { opacity: 0, x: -12 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -12 },
  transition: { duration: 0.3 },
};

export default function IndexView() {
  const selectedSlug = useTheaterStore((s) => s.selectedSlug);
  const setSelectedSlug = useTheaterStore((s) => s.setSelectedSlug);
  const expandDetail = useTheaterStore((s) => s.expandDetail);

  const selected = projects.find((p) => p.slug === selectedSlug) ?? projects[0];

  return (
    <motion.div className="w-full" {...anim}>
      {/* Project selector */}
      <div className="flex flex-col" style={{ gap: 6 }}>
        {projects.map((p) => (
          <button
            key={p.slug}
            onClick={() => setSelectedSlug(p.slug)}
            className="flex items-baseline text-left transition-colors duration-200"
            style={{
              gap: 12,
              color: p.slug === selected.slug ? "var(--fg)" : "var(--fg-3)",
              padding: "4px 0",
            }}
          >
            <span
              className="font-mono"
              style={{
                fontSize: 9,
                letterSpacing: "0.06em",
                fontVariantNumeric: "tabular-nums",
                width: "3ch",
                flexShrink: 0,
              }}
            >
              {String(p.order).padStart(2, "0")}
            </span>
            <span
              className="font-body"
              style={{
                fontSize: 15,
                letterSpacing: "-0.005em",
              }}
            >
              {p.title}
            </span>
          </button>
        ))}
      </div>

      {/* Divider */}
      <div
        style={{
          height: 1,
          width: 32,
          background: "var(--fg-4)",
          marginTop: 28,
          marginBottom: 24,
        }}
      />

      {/* Metadata grid */}
      <div
        className="grid font-mono uppercase"
        style={{
          gridTemplateColumns: "64px 1fr",
          gap: "8px 16px",
          fontSize: 9,
          letterSpacing: "0.06em",
        }}
      >
        <span style={{ color: "var(--fg-3)" }}>N</span>
        <span style={{ color: "var(--fg-2)" }}>
          {String(selected.order).padStart(2, "0")}
        </span>

        <span style={{ color: "var(--fg-3)" }}>Title</span>
        <span style={{ color: "var(--fg-2)" }}>{selected.title}</span>

        <span style={{ color: "var(--fg-3)" }}>Year</span>
        <span style={{ color: "var(--fg-2)" }}>
          {selected.status === "wip" ? "In progress" : selected.year}
        </span>

        <span style={{ color: "var(--fg-3)" }}>Type</span>
        <span style={{ color: "var(--fg-2)" }}>
          {selected.tags.join(" / ")}
        </span>

        <span style={{ color: "var(--fg-3)" }}>Status</span>
        <span style={{ color: "var(--fg-2)" }}>
          {selected.status === "wip" ? "WIP" : "Shipped"}
        </span>
      </div>

      {/* Description */}
      <p
        className="font-body"
        style={{
          fontSize: 14,
          lineHeight: 1.7,
          letterSpacing: "-0.005em",
          color: "var(--fg-2)",
          maxWidth: 340,
          marginTop: 24,
        }}
      >
        {selected.description}
      </p>

      {/* View project */}
      <button
        onClick={expandDetail}
        data-cursor-label="View"
        className="font-mono uppercase"
        style={{
          fontSize: 9,
          letterSpacing: "0.08em",
          color: "var(--fg)",
          marginTop: 28,
          display: "block",
        }}
      >
        View project →
      </button>
    </motion.div>
  );
}
