"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTheaterStore } from "@/store/useTheaterStore";
import { PIECES } from "@/constants/pieces";

const projects = PIECES.filter((p) => p.type === "project").sort(
  (a, b) => a.order - b.order
);

export default function IndexView() {
  const selectedSlug = useTheaterStore((s) => s.selectedSlug);
  const setSelectedSlug = useTheaterStore((s) => s.setSelectedSlug);
  const expandDetail = useTheaterStore((s) => s.expandDetail);

  const selected = projects.find((p) => p.slug === selectedSlug) ?? projects[0];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Section label */}
      <span
        className="font-mono uppercase block"
        style={{
          fontSize: 10,
          fontWeight: 400,
          letterSpacing: "0.08em",
          lineHeight: 1,
          color: "var(--fg-3)",
          marginBottom: 32,
        }}
      >
        Projects
      </span>

      {/* Selector list */}
      <div className="flex flex-col" style={{ gap: 0 }}>
        {projects.map((p) => {
          const isActive = p.slug === selected.slug;
          return (
            <button
              key={p.slug}
              onClick={() => setSelectedSlug(p.slug)}
              className="text-left"
              style={{
                padding: "10px 0",
                display: "flex",
                alignItems: "baseline",
                gap: 12,
                borderBottom: "1px solid var(--fg-4)",
                transition: "all 0.2s ease",
              }}
            >
              <span
                className="font-mono"
                style={{
                  fontSize: 9,
                  letterSpacing: "0.06em",
                  fontVariantNumeric: "tabular-nums",
                  width: 24,
                  flexShrink: 0,
                  color: isActive ? "var(--fg-2)" : "var(--fg-3)",
                }}
              >
                {String(p.order).padStart(2, "0")}
              </span>
              <span
                className="font-body"
                style={{
                  fontSize: 13,
                  letterSpacing: "-0.005em",
                  fontWeight: isActive ? 500 : 400,
                  color: isActive ? "var(--fg)" : "var(--fg-3)",
                }}
              >
                {p.title}
              </span>
              {/* Year — right aligned, only on active */}
              <span
                className="font-mono ml-auto"
                style={{
                  fontSize: 9,
                  letterSpacing: "0.06em",
                  fontVariantNumeric: "tabular-nums",
                  color: "var(--fg-3)",
                  opacity: isActive ? 1 : 0,
                  transition: "opacity 0.2s",
                }}
              >
                {p.status === "wip" ? "WIP" : p.year}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Animated detail section ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selected.slug}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{ marginTop: 32 }}
        >
          {/* Compact metadata — just type and status */}
          <div
            className="font-mono uppercase"
            style={{
              fontSize: 9,
              fontWeight: 400,
              letterSpacing: "0.06em",
              lineHeight: 1.8,
              color: "var(--fg-3)",
              marginBottom: 16,
            }}
          >
            {selected.tags.join(" / ")}
            <span style={{ margin: "0 8px", opacity: 0.3 }}>—</span>
            {selected.status === "shipped" ? "Shipped" : "In progress"}
          </div>

          {/* Description */}
          <p
            className="font-body"
            style={{
              fontSize: 13,
              lineHeight: 1.7,
              letterSpacing: "-0.005em",
              color: "var(--fg-2)",
              maxWidth: 280,
            }}
          >
            {selected.description}
          </p>

          {/* CTA */}
          <button
            onClick={expandDetail}
            data-cursor-label="View"
            className="font-mono uppercase"
            style={{
              fontSize: 10,
              fontWeight: 400,
              letterSpacing: "0.08em",
              lineHeight: 1,
              color: "var(--fg)",
              marginTop: 24,
              display: "block",
            }}
          >
            View project →
          </button>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
