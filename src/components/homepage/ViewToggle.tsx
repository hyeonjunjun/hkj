"use client";

import { useStudioStore } from "@/lib/store";

export default function ViewToggle() {
  const viewMode = useStudioStore((s) => s.viewMode);
  const setViewMode = useStudioStore((s) => s.setViewMode);

  return (
    <div
      className="flex gap-3 font-mono uppercase tracking-[0.1em]"
      style={{ fontSize: "var(--text-micro)" }}
      role="tablist"
      aria-label="View mode"
    >
      <button
        role="tab"
        aria-selected={viewMode === "list"}
        onClick={() => setViewMode("list")}
        className="transition-opacity duration-200"
        style={{
          color: viewMode === "list"
            ? "var(--color-text-secondary)"
            : "var(--color-text-ghost)",
          opacity: viewMode === "list" ? 1 : 0.6,
        }}
      >
        List
      </button>
      <button
        role="tab"
        aria-selected={viewMode === "slider"}
        onClick={() => setViewMode("slider")}
        className="transition-opacity duration-200"
        style={{
          color: viewMode === "slider"
            ? "var(--color-text-secondary)"
            : "var(--color-text-ghost)",
          opacity: viewMode === "slider" ? 1 : 0.6,
        }}
      >
        Slider
      </button>
    </div>
  );
}
