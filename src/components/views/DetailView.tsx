"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTheaterStore } from "@/store/useTheaterStore";
import { PIECES } from "@/constants/pieces";
import { CASE_STUDIES } from "@/constants/case-studies";

const PANELS = ["overview", "process", "engineering"] as const;

const panelLabels: Record<(typeof PANELS)[number], string> = {
  overview: "OVERVIEW",
  process: "PROCESS",
  engineering: "ENGINEERING",
};

export default function DetailView() {
  const selectedSlug = useTheaterStore((s) => s.selectedSlug);
  const activeDetailPanel = useTheaterStore((s) => s.activeDetailPanel);
  const setActiveDetailPanel = useTheaterStore((s) => s.setActiveDetailPanel);

  const piece = PIECES.find((p) => p.slug === selectedSlug);
  if (!piece) return null;

  const caseStudy = CASE_STUDIES[piece.slug];
  const orderLabel = String(piece.order).padStart(2, "0");

  return (
    <motion.div
      key={`detail-${piece.slug}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div
        style={{
          overflowY: "auto",
          scrollbarWidth: "none",
          height: "100%",
        }}
      >
        {/* 1. Project label */}
        <span
          className="block font-mono uppercase"
          style={{
            fontSize: 9,
            fontWeight: 400,
            letterSpacing: "0.06em",
            lineHeight: 1.8,
            color: "var(--fg-3)",
            marginBottom: 16,
          }}
        >
          {orderLabel} — {piece.type === "project" ? "PROJECT" : "EXPERIMENT"}
        </span>

        {/* 2. Title */}
        <h1
          className="font-display"
          style={{
            fontSize: 26,
            fontWeight: 500,
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
            color: "var(--fg)",
            margin: 0,
          }}
        >
          {piece.title}
        </h1>

        {/* 3. Divider */}
        <div
          style={{
            height: 1,
            background: "var(--fg-4)",
            marginTop: 16,
            marginBottom: 16,
          }}
        />

        {/* 4. Panel tabs */}
        <div style={{ display: "flex", gap: 16 }}>
          {PANELS.map((panel) => (
            <button
              key={panel}
              onClick={() => setActiveDetailPanel(panel)}
              className="font-mono uppercase"
              style={{
                fontSize: 10,
                fontWeight: 400,
                letterSpacing: "0.08em",
                lineHeight: 1,
                color:
                  activeDetailPanel === panel ? "var(--fg)" : "var(--fg-3)",
                background: "none",
                border: "none",
                padding: 0,
                paddingBottom: 8,
                cursor: "pointer",
                position: "relative",
              }}
            >
              {panelLabels[panel]}
              {activeDetailPanel === panel && (
                <motion.div
                  layoutId="detail-panel-indicator"
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 1,
                    background: "var(--fg)",
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                  }}
                />
              )}
            </button>
          ))}
        </div>

        {/* 5. Divider */}
        <div
          style={{
            height: 1,
            background: "var(--fg-4)",
            marginTop: 16,
            marginBottom: 16,
          }}
        />

        {/* 6. Panel content */}
        <AnimatePresence mode="wait">
          {activeDetailPanel === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* Description */}
              <p
                className="font-body"
                style={{
                  fontSize: 13,
                  fontWeight: 400,
                  letterSpacing: "-0.005em",
                  lineHeight: 1.7,
                  color: "var(--fg-2)",
                  maxWidth: 280,
                  margin: 0,
                }}
              >
                {piece.description}
              </p>

              {/* Divider */}
              <div
                style={{
                  height: 1,
                  background: "var(--fg-4)",
                  marginTop: 24,
                  marginBottom: 24,
                }}
              />

              {/* Tags */}
              <div
                className="flex flex-wrap"
                style={{ gap: 6, marginBottom: 12 }}
              >
                {piece.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-mono uppercase"
                    style={{
                      fontSize: 8,
                      fontWeight: 400,
                      letterSpacing: "0.06em",
                      lineHeight: 1,
                      border: "1px solid var(--fg-4)",
                      padding: "3px 8px",
                      color: "var(--fg-3)",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Year + status */}
              <span
                className="block font-mono uppercase"
                style={{
                  fontSize: 9,
                  fontWeight: 400,
                  letterSpacing: "0.06em",
                  lineHeight: 1.8,
                  color: "var(--fg-3)",
                }}
              >
                {piece.status === "wip" ? "IN PROGRESS" : piece.year}
              </span>
            </motion.div>
          )}

          {activeDetailPanel === "process" && (
            <motion.div
              key="process"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {caseStudy?.process ? (
                <>
                  <h2
                    className="font-display"
                    style={{
                      fontSize: 18,
                      fontWeight: 400,
                      letterSpacing: "-0.01em",
                      lineHeight: 1.3,
                      color: "var(--fg)",
                      margin: 0,
                      marginBottom: 12,
                    }}
                  >
                    {caseStudy.process.title}
                  </h2>
                  <p
                    className="font-body"
                    style={{
                      fontSize: 13,
                      fontWeight: 400,
                      letterSpacing: "-0.005em",
                      lineHeight: 1.7,
                      color: "var(--fg-2)",
                      margin: 0,
                    }}
                  >
                    {caseStudy.process.copy}
                  </p>
                </>
              ) : (
                <p
                  className="font-body"
                  style={{
                    fontSize: 11,
                    fontWeight: 400,
                    lineHeight: 1.6,
                    color: "var(--fg-3)",
                    margin: 0,
                  }}
                >
                  No process documented.
                </p>
              )}
            </motion.div>
          )}

          {activeDetailPanel === "engineering" && (
            <motion.div
              key="engineering"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {caseStudy?.engineering ? (
                <>
                  <h2
                    className="font-display"
                    style={{
                      fontSize: 18,
                      fontWeight: 400,
                      letterSpacing: "-0.01em",
                      lineHeight: 1.3,
                      color: "var(--fg)",
                      margin: 0,
                      marginBottom: 12,
                    }}
                  >
                    {caseStudy.engineering.title}
                  </h2>
                  <p
                    className="font-body"
                    style={{
                      fontSize: 13,
                      fontWeight: 400,
                      letterSpacing: "-0.005em",
                      lineHeight: 1.7,
                      color: "var(--fg-2)",
                      margin: 0,
                      marginBottom: 16,
                    }}
                  >
                    {caseStudy.engineering.copy}
                  </p>

                  {/* Signal badges */}
                  <div className="flex flex-wrap" style={{ gap: 6 }}>
                    {caseStudy.engineering.signals.map((signal) => (
                      <span
                        key={signal}
                        className="font-mono uppercase"
                        style={{
                          fontSize: 8,
                          fontWeight: 400,
                          letterSpacing: "0.06em",
                          lineHeight: 1,
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
              ) : (
                <p
                  className="font-body"
                  style={{
                    fontSize: 11,
                    fontWeight: 400,
                    lineHeight: 1.6,
                    color: "var(--fg-3)",
                    margin: 0,
                  }}
                >
                  No engineering details documented.
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scroll breathing room */}
        <div style={{ height: 56 }} />
      </div>
    </motion.div>
  );
}
