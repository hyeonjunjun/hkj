"use client";

import { useTheaterStore } from "@/store/useTheaterStore";
import { PIECES } from "@/constants/pieces";

export default function BottomBar() {
  const activeTab = useTheaterStore((s) => s.activeTab);
  const selectedSlug = useTheaterStore((s) => s.selectedSlug);

  const selectedPiece = PIECES.find((p) => p.slug === selectedSlug);
  const experimentCount = PIECES.filter((p) => p.type === "experiment").length;

  const contextText = (() => {
    switch (activeTab) {
      case "index":
        return selectedPiece ? String(selectedPiece.year) : "";
      case "archive":
        return `${experimentCount} collected`;
      case "about":
        return "New York";
    }
  })();

  return (
    <div
      className="absolute bottom-0 left-0 right-0 z-20 flex items-center justify-between"
      style={{
        height: 44,
        paddingInline: "clamp(32px, 8vw, 96px)",
        borderTop: "1px solid var(--fg-4)",
      }}
    >
      <span
        className="font-mono uppercase"
        style={{ fontSize: 9, letterSpacing: "0.06em", color: "var(--fg-3)" }}
      >
        {contextText}
      </span>
      <span
        className="font-mono"
        style={{ fontSize: 9, letterSpacing: "0.06em", color: "var(--fg-3)", fontVariantNumeric: "tabular-nums" }}
      >
        v1.0
      </span>
    </div>
  );
}
