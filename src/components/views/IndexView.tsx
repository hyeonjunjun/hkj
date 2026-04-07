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
        className="font-mono uppercase"
        style={{
          display: "block",
          fontSize: 10,
          fontWeight: 400,
          letterSpacing: "0.08em",
          lineHeight: 1,
          color: "var(--fg-3)",
          marginBottom: 24,
        }}
      >
        PROJECTS
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
                padding: "8px 0",
                display: "flex",
                alignItems: "baseline",
                gap: 12,
              }}
            >
              {/* Number */}
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

              {/* Title */}
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
            </button>
          );
        })}
      </div>

      {/* Divider */}
      <div
        style={{
          height: 1,
          width: "100%",
          background: "var(--fg-4)",
          marginTop: 24,
          marginBottom: 24,
        }}
      />

      {/* Animated metadata + description + CTA */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selected.slug}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Metadata grid */}
          <div
            className="font-mono"
            style={{
              display: "grid",
              gridTemplateColumns: "64px 1fr",
              gap: "8px 16px",
              fontSize: 9,
              fontWeight: 400,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
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
              {selected.status === "wip" ? "IN PROGRESS" : selected.year}
            </span>

            <span style={{ color: "var(--fg-3)" }}>Type</span>
            <span style={{ color: "var(--fg-2)" }}>
              {selected.tags.join(" / ")}
            </span>

            <span style={{ color: "var(--fg-3)" }}>Status</span>
            <span style={{ color: "var(--fg-2)" }}>
              {selected.status === "shipped" ? "SHIPPED" : "WIP"}
            </span>
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
              marginTop: 16,
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
            VIEW PROJECT →
          </button>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
