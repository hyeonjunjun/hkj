"use client";

import { motion } from "framer-motion";
import { useTheaterStore } from "@/store/useTheaterStore";
import { PIECES } from "@/constants/pieces";
import { CASE_STUDIES } from "@/constants/case-studies";

const enter = { opacity: 0, y: 16 };
const visible = { opacity: 1, y: 0 };
const transition = { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const };

function SectionDivider() {
  return (
    <div
      style={{
        height: 1,
        width: "100%",
        background: "var(--fg-4)",
        marginTop: 36,
        marginBottom: 32,
      }}
    />
  );
}

export default function DetailView() {
  const selectedSlug = useTheaterStore((s) => s.selectedSlug);
  const piece = PIECES.find((p) => p.slug === selectedSlug);
  if (!piece) return null;

  const cs = CASE_STUDIES[piece.slug];
  const orderLabel = String(piece.order).padStart(2, "0");

  return (
    <motion.div
      key={`detail-${piece.slug}`}
      className="w-full h-full overflow-y-auto pr-4"
      style={{ scrollbarWidth: "none" }}
      initial={enter}
      animate={visible}
      exit={{ opacity: 0, y: 16 }}
      transition={transition}
    >
      {/* Project label */}
      <span
        className="block font-mono uppercase"
        style={{
          fontSize: 9,
          letterSpacing: "0.08em",
          color: "var(--fg-3)",
          marginBottom: 16,
        }}
      >
        {orderLabel} — {piece.type === "project" ? "Project" : "Experiment"}
      </span>

      {/* Title */}
      <h1
        className="font-display"
        style={{
          fontSize: "clamp(32px, 4.5vw, 48px)",
          letterSpacing: "-0.02em",
          lineHeight: 1.05,
          color: "var(--fg)",
          margin: 0,
          marginBottom: 20,
        }}
      >
        {piece.title}
      </h1>

      {/* Description */}
      <p
        className="font-body"
        style={{
          fontSize: 14,
          lineHeight: 1.75,
          letterSpacing: "-0.005em",
          color: "var(--fg-2)",
          maxWidth: 420,
          margin: 0,
          marginBottom: 24,
        }}
      >
        {piece.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap" style={{ gap: 6, marginBottom: 8 }}>
        {piece.tags.map((tag) => (
          <span
            key={tag}
            className="font-mono uppercase"
            style={{
              fontSize: 8,
              letterSpacing: "0.06em",
              border: "1px solid var(--fg-4)",
              padding: "3px 8px",
              color: "var(--fg-3)",
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Year */}
      <span
        className="block font-mono"
        style={{
          fontSize: 9,
          fontVariantNumeric: "tabular-nums",
          letterSpacing: "0.06em",
          color: "var(--fg-3)",
        }}
      >
        {piece.status === "wip" ? "In progress" : piece.year}
      </span>

      {/* Case study content */}
      {cs && (
        <>
          <SectionDivider />

          {/* Editorial */}
          <h2
            className="font-display"
            style={{
              fontSize: "clamp(20px, 2.5vw, 28px)",
              letterSpacing: "-0.01em",
              lineHeight: 1.2,
              color: "var(--fg)",
              margin: 0,
              marginBottom: cs.editorial.subhead ? 8 : 16,
            }}
          >
            {cs.editorial.heading}
          </h2>

          {cs.editorial.subhead && (
            <span
              className="block font-mono uppercase"
              style={{
                fontSize: 9,
                letterSpacing: "0.08em",
                color: "var(--fg-3)",
                marginBottom: 16,
              }}
            >
              {cs.editorial.subhead}
            </span>
          )}

          <p
            className="font-body"
            style={{
              fontSize: 14,
              lineHeight: 1.8,
              letterSpacing: "-0.005em",
              color: "var(--fg-2)",
              margin: 0,
            }}
          >
            {cs.editorial.copy}
          </p>

          {/* Process section */}
          {cs.process && (
            <>
              <SectionDivider />

              <span
                className="block font-mono uppercase"
                style={{
                  fontSize: 10,
                  letterSpacing: "0.08em",
                  color: "var(--fg-3)",
                  marginBottom: 16,
                }}
              >
                {cs.process.title}
              </span>

              <p
                className="font-body"
                style={{
                  fontSize: 14,
                  lineHeight: 1.8,
                  letterSpacing: "-0.005em",
                  color: "var(--fg-2)",
                  margin: 0,
                }}
              >
                {cs.process.copy}
              </p>
            </>
          )}

          {/* Engineering section */}
          {cs.engineering && (
            <>
              <SectionDivider />

              <span
                className="block font-mono uppercase"
                style={{
                  fontSize: 10,
                  letterSpacing: "0.08em",
                  color: "var(--fg-3)",
                  marginBottom: 16,
                }}
              >
                {cs.engineering.title}
              </span>

              <p
                className="font-body"
                style={{
                  fontSize: 14,
                  lineHeight: 1.8,
                  letterSpacing: "-0.005em",
                  color: "var(--fg-2)",
                  margin: 0,
                  marginBottom: 16,
                }}
              >
                {cs.engineering.copy}
              </p>

              {/* Signal badges */}
              <div className="flex flex-wrap" style={{ gap: 6 }}>
                {cs.engineering.signals.map((signal) => (
                  <span
                    key={signal}
                    className="font-mono uppercase"
                    style={{
                      fontSize: 8,
                      letterSpacing: "0.06em",
                      border: "1px solid var(--fg-4)",
                      padding: "3px 8px",
                      color: "var(--fg-3)",
                    }}
                  >
                    {signal}
                  </span>
                ))}
              </div>
            </>
          )}
        </>
      )}

      {/* Scroll breathing room */}
      <div style={{ height: 56 }} />
    </motion.div>
  );
}
