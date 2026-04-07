"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "@/components/Footer";
import GeometricFrame from "@/components/GeometricFrame";
import { PIECES, type Piece } from "@/constants/pieces";

const projects = PIECES.filter((p) => p.type === "project").sort(
  (a, b) => a.order - b.order
);

export default function IndexPage() {
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  const hovered = projects.find((p) => p.slug === hoveredSlug) ?? null;

  return (
    <main id="main" className="min-h-screen">
      <div
        style={{
          paddingTop: 64,
          paddingLeft: "var(--pad)",
          paddingRight: "var(--pad)",
          paddingBottom: 48,
        }}
      >
        {/* Label */}
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "var(--fg-3)",
            display: "block",
            marginBottom: 32,
          }}
        >
          Index
        </motion.span>

        {/* Two-panel layout */}
        <div
          style={{
            display: "flex",
            gap: 48,
          }}
          className="flex-col md:flex-row"
        >
          {/* Left panel: project list */}
          <div style={{ flex: "0 0 65%" }} className="w-full md:w-auto">
            {projects.map((project, i) => (
              <motion.div
                key={project.slug}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i, duration: 0.4 }}
              >
                <Link
                  href={`/index/${project.slug}`}
                  data-cursor="link"
                  onMouseEnter={() => setHoveredSlug(project.slug)}
                  onMouseLeave={() => setHoveredSlug(null)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    paddingTop: 16,
                    paddingBottom: 16,
                    borderBottom: "1px solid var(--fg-4)",
                    textDecoration: "none",
                    color: "inherit",
                    transition: "opacity 0.2s",
                  }}
                >
                  {/* Thumbnail */}
                  <GeometricFrame variant="thumbnail" className="shrink-0">
                    <div
                      style={{
                        width: 120,
                        height: 90,
                        overflow: "hidden",
                        position: "relative",
                        backgroundColor: project.cover.bg,
                      }}
                    >
                      {project.image && (
                        <Image
                          src={project.image}
                          alt={project.title}
                          fill
                          sizes="120px"
                          style={{ objectFit: "cover" }}
                        />
                      )}
                    </div>
                  </GeometricFrame>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 15,
                        color: "var(--fg)",
                        display: "block",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {project.title}
                    </span>
                    <span
                      style={{
                        fontSize: 13,
                        color: "var(--fg-2)",
                        display: "block",
                        marginTop: 4,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {project.description}
                    </span>
                  </div>

                  {/* Year */}
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 11,
                      color: "var(--fg-3)",
                      fontVariantNumeric: "tabular-nums",
                      flexShrink: 0,
                    }}
                  >
                    {project.year}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Right panel: hover preview */}
          <div
            className="hidden md:block"
            style={{
              flex: "0 0 35%",
              position: "sticky",
              top: 80,
              alignSelf: "flex-start",
            }}
          >
            <GeometricFrame variant="default" layoutId="index-preview">
              <div
                style={{
                  aspectRatio: "4 / 3",
                  overflow: "hidden",
                  position: "relative",
                  backgroundColor: hovered?.cover.bg ?? "var(--bg-2)",
                }}
              >
                <AnimatePresence mode="wait">
                  {hovered && (
                    <motion.div
                      key={hovered.slug}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      style={{
                        position: "absolute",
                        inset: 0,
                      }}
                    >
                      {hovered.video ? (
                        <video
                          src={hovered.video}
                          autoPlay
                          muted
                          loop
                          playsInline
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : hovered.image ? (
                        <Image
                          src={hovered.image}
                          alt={hovered.title}
                          fill
                          sizes="35vw"
                          style={{ objectFit: "cover" }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            backgroundColor: hovered.cover.bg,
                          }}
                        />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </GeometricFrame>

            {/* Preview meta */}
            <AnimatePresence mode="wait">
              {hovered && (
                <motion.div
                  key={`meta-${hovered.slug}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ marginTop: 16 }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 18,
                      color: "var(--fg)",
                      display: "block",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {hovered.title}
                  </span>
                  <span
                    style={{
                      fontSize: 13,
                      color: "var(--fg-2)",
                      display: "block",
                      marginTop: 6,
                      lineHeight: 1.5,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {hovered.description}
                  </span>

                  {/* Tags */}
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 6,
                      marginTop: 12,
                    }}
                  >
                    {hovered.tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 10,
                          textTransform: "uppercase",
                          letterSpacing: "0.04em",
                          border: "1px solid var(--fg-4)",
                          borderRadius: 2,
                          paddingLeft: 8,
                          paddingRight: 8,
                          paddingTop: 2,
                          paddingBottom: 2,
                          color: "var(--fg-3)",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
