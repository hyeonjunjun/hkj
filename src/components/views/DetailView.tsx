"use client";

import { motion } from "framer-motion";
import { useTheaterStore } from "@/store/useTheaterStore";
import { PIECES } from "@/constants/pieces";
import { CASE_STUDIES } from "@/constants/case-studies";

const enter = { opacity: 0, y: 16 };
const visible = { opacity: 1, y: 0 };
const transition = { duration: 0.4, ease: [0.16, 1, 0.3, 1] };

export default function DetailView() {
  const selectedSlug = useTheaterStore((s) => s.selectedSlug);
  const piece = PIECES.find((p) => p.slug === selectedSlug);
  if (!piece) return null;

  const caseStudy = CASE_STUDIES[piece.slug];
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
          letterSpacing: "0.14em",
          color: "var(--fg-3)",
          marginBottom: 12,
        }}
      >
        {orderLabel} — Project
      </span>

      {/* Title */}
      <h1
        className="font-display"
        style={{
          fontSize: "clamp(28px, 4vw, 44px)",
          letterSpacing: "-0.02em",
          color: "var(--fg)",
          lineHeight: 1.1,
          margin: 0,
          marginBottom: 16,
        }}
      >
        {piece.title}
      </h1>

      {/* Description */}
      <p
        style={{
          fontSize: 14,
          lineHeight: 1.7,
          color: "var(--fg-2)",
          maxWidth: 400,
          margin: 0,
          marginBottom: 20,
        }}
      >
        {piece.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5" style={{ marginBottom: 16 }}>
        {piece.tags.map((tag) => (
          <span
            key={tag}
            className="font-mono uppercase"
            style={{
              fontSize: 8,
              letterSpacing: "0.08em",
              border: "1px solid var(--fg-4)",
              paddingInline: 8,
              paddingBlock: 2,
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
          color: "var(--fg-3)",
        }}
      >
        {piece.year}
      </span>

      {/* Case study content */}
      {caseStudy && (
        <>
          {/* Divider */}
          <div
            style={{
              height: 1,
              width: "100%",
              background: "var(--fg-4)",
              marginBlock: 32,
            }}
          />

          {/* Editorial */}
          <h2
            className="font-display"
            style={{
              fontSize: "clamp(20px, 2.5vw, 28px)",
              color: "var(--fg)",
              lineHeight: 1.2,
              margin: 0,
              marginBottom: caseStudy.editorial.subhead ? 8 : 16,
            }}
          >
            {caseStudy.editorial.heading}
          </h2>

          {caseStudy.editorial.subhead && (
            <span
              className="block font-mono uppercase"
              style={{
                fontSize: 9,
                letterSpacing: "0.14em",
                color: "var(--fg-3)",
                marginBottom: 16,
              }}
            >
              {caseStudy.editorial.subhead}
            </span>
          )}

          <p
            style={{
              fontSize: 14,
              lineHeight: 1.75,
              color: "var(--fg-2)",
              margin: 0,
            }}
          >
            {caseStudy.editorial.copy}
          </p>

          {/* Process section */}
          {caseStudy.process && (
            <>
              <div
                style={{
                  height: 1,
                  width: "100%",
                  background: "var(--fg-4)",
                  marginBlock: 32,
                }}
              />

              <h3
                className="font-display"
                style={{
                  fontSize: "clamp(20px, 2.5vw, 28px)",
                  color: "var(--fg)",
                  lineHeight: 1.2,
                  margin: 0,
                  marginBottom: 16,
                }}
              >
                {caseStudy.process.title}
              </h3>

              <p
                style={{
                  fontSize: 14,
                  lineHeight: 1.75,
                  color: "var(--fg-2)",
                  margin: 0,
                }}
              >
                {caseStudy.process.copy}
              </p>
            </>
          )}

          {/* Engineering section */}
          {caseStudy.engineering && (
            <>
              <div
                style={{
                  height: 1,
                  width: "100%",
                  background: "var(--fg-4)",
                  marginBlock: 32,
                }}
              />

              <h3
                className="font-display"
                style={{
                  fontSize: "clamp(20px, 2.5vw, 28px)",
                  color: "var(--fg)",
                  lineHeight: 1.2,
                  margin: 0,
                  marginBottom: 16,
                }}
              >
                {caseStudy.engineering.title}
              </h3>

              <p
                style={{
                  fontSize: 14,
                  lineHeight: 1.75,
                  color: "var(--fg-2)",
                  margin: 0,
                  marginBottom: 16,
                }}
              >
                {caseStudy.engineering.copy}
              </p>

              {/* Signal badges */}
              <div className="flex flex-wrap gap-1.5">
                {caseStudy.engineering.signals.map((signal) => (
                  <span
                    key={signal}
                    className="font-mono uppercase"
                    style={{
                      fontSize: 8,
                      letterSpacing: "0.08em",
                      border: "1px solid var(--fg-4)",
                      paddingInline: 8,
                      paddingBlock: 2,
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

      {/* Bottom padding for scroll breathing room */}
      <div style={{ height: 48 }} />
    </motion.div>
  );
}
