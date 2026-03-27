"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { EXPLORATIONS } from "@/constants/explorations";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, ease: [0.23, 0.88, 0.26, 0.92] as const },
};

export default function ExplorationPage() {
  return (
    <div data-page-scrollable>
      <div
        style={{
          padding: "clamp(80px, 12vh, 140px) 24px clamp(48px, 8vh, 80px)",
        }}
      >
        {/* Header */}
        <motion.div {...fadeUp} style={{ marginBottom: "clamp(3rem, 6vh, 5rem)" }}>
          <h1
            className="font-display"
            style={{
              fontSize: "clamp(22px, 3vw, 32px)",
              color: "var(--ink-full)",
              lineHeight: 1.1,
              fontStyle: "italic",
              margin: "0 0 12px",
            }}
          >
            Coddiwompling
          </h1>
          <p
            style={{
              fontSize: "var(--text-body)",
              color: "var(--ink-secondary)",
              fontStyle: "italic",
              maxWidth: "40ch",
              margin: 0,
            }}
          >
            traveling purposefully toward an unknown destination. visual studies, material research, and things that caught the light.
          </p>
        </motion.div>

        {/* Gallery — 3-col grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
          }}
        >
          {EXPLORATIONS.map((piece, i) => (
            <motion.div
              key={piece.id}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.05 }}
            >
              <div
                style={{
                  overflow: "hidden",
                  aspectRatio: "3/4",
                  position: "relative",
                }}
              >
                {piece.heroType === "video" ? (
                  <video
                    src={piece.hero}
                    autoPlay
                    muted
                    loop
                    playsInline
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <Image
                    src={piece.hero}
                    alt={piece.title}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="33vw"
                    quality={90}
                  />
                )}
              </div>

              <div style={{ marginTop: 12 }}>
                <span
                  className="font-display"
                  style={{
                    fontSize: "var(--text-body)",
                    color: "var(--ink-full)",
                    fontStyle: "italic",
                  }}
                >
                  {piece.title}
                </span>
                <span
                  className="font-mono"
                  style={{
                    fontSize: 10,
                    color: "var(--ink-muted)",
                    marginLeft: 12,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  {piece.medium}
                </span>
                <p
                  style={{
                    fontSize: 13,
                    color: "var(--ink-secondary)",
                    margin: "4px 0 0",
                    lineHeight: 1.5,
                  }}
                >
                  {piece.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
