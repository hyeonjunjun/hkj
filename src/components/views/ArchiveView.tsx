"use client";

import { SHEET_ITEMS } from "@/constants/sheet-items";
import { GridItem } from "@/components/GridItem";

// Sort all items chronologically — newest first
const SORTED_ITEMS = [...SHEET_ITEMS].sort((a, b) => b.year - a.year);

export function ArchiveView() {
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Type lockup */}
      <div
        style={{
          textAlign: "center",
          paddingTop: 24,
          paddingBottom: 32,
          flexShrink: 0,
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "clamp(48px, 8vw, 96px)",
            textTransform: "uppercase",
            lineHeight: 0.9,
            color: "var(--ink-full)",
            margin: 0,
            letterSpacing: "-0.02em",
          }}
        >
          The Archive
        </h1>
      </div>

      {/* Horizontally scrolling card row */}
      <div
        className="archive-scroll"
        style={{
          display: "flex",
          gap: 24,
          overflowX: "auto",
          overflowY: "hidden",
          scrollSnapType: "x proximity",
          padding: "0 calc(50vw - 180px) 48px",
          alignItems: "flex-start",
          flex: 1,
          scrollbarWidth: "none",
          msOverflowStyle: "none" as React.CSSProperties["msOverflowStyle"],
        }}
      >
        {SORTED_ITEMS.map((item) => (
          <div
            key={item.id}
            data-flip-id={item.id}
            style={{
              width: 360,
              flexShrink: 0,
              scrollSnapAlign: "center",
            }}
          >
            <GridItem item={item} style={{ aspectRatio: "3/4" }} />

            {/* Card meta below image */}
            <div style={{ marginTop: 12, paddingLeft: 2 }}>
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: 18,
                  color: "var(--ink-full)",
                  margin: 0,
                  marginBottom: 4,
                  lineHeight: 1.2,
                }}
              >
                {item.title}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 13,
                  color: "var(--ink-secondary)",
                  margin: 0,
                  marginBottom: 8,
                  lineHeight: 1.5,
                }}
              >
                {item.description}
              </p>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 9,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "var(--ink-muted)",
                }}
              >
                {item.type} — {item.year}
              </span>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .archive-scroll::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

export default ArchiveView;
