"use client";

import { SHEET_ITEMS, type SheetItemData } from "@/constants/sheet-items";
import { GridItem } from "@/components/GridItem";

function getItemWidth(type: SheetItemData["type"]): number {
  if (type === "WORK") return 280;
  if (type === "BRAND") return 240;
  return 200;
}

export function ArchiveView() {
  // Group items by year
  const byYear = SHEET_ITEMS.reduce<Record<number, SheetItemData[]>>((acc, item) => {
    if (!acc[item.year]) acc[item.year] = [];
    acc[item.year].push(item);
    return acc;
  }, {});

  // Sort years descending
  const years = Object.keys(byYear)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <>
      <div
        style={{
          padding: "0 24px",
          maxWidth: 1200,
          margin: "0 auto",
          paddingTop: 80,
          overflowY: "auto",
        }}
      >
        {years.map((year) => (
          <section key={year} style={{ marginBottom: 64 }}>
            {/* Year label */}
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontStyle: "italic",
                fontSize: "clamp(36px, 5vw, 56px)",
                color: "var(--ink-full)",
                fontWeight: 400,
                margin: 0,
                marginBottom: 24,
                lineHeight: 1.1,
              }}
            >
              {year}
            </h2>

            {/* Horizontal row */}
            <div
              className="archive-row"
              style={{
                display: "flex",
                gap: 16,
                overflowX: "auto",
                paddingBottom: 16,
                scrollbarWidth: "none",
                msOverflowStyle: "none" as React.CSSProperties["msOverflowStyle"],
              }}
            >
              {byYear[year].map((item) => (
                <div
                  key={item.id}
                  data-flip-id={item.id}
                  style={{
                    width: getItemWidth(item.type),
                    flexShrink: 0,
                  }}
                >
                  <GridItem item={item} />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <style>{`
        .archive-row::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
}

export default ArchiveView;
