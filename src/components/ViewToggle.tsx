"use client";

interface ViewToggleProps {
  mode: "list" | "index";
  onToggle: () => void;
}

export default function ViewToggle({ mode, onToggle }: ViewToggleProps) {
  return (
    <button
      onClick={onToggle}
      aria-label={`Switch to ${mode === "list" ? "index" : "list"} view`}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        fontFamily: "var(--font-mono)",
        fontSize: "11px",
        color: "var(--fg-3)",
        padding: "4px",
        transition: "color 0.3s var(--ease)",
        lineHeight: 1,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--fg)")}
      onMouseLeave={(e) => (e.currentTarget.style.color = "var(--fg-3)")}
    >
      {mode === "list" ? "☰" : "▦"}
    </button>
  );
}
