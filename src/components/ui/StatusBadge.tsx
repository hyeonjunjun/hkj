"use client";

interface StatusBadgeProps {
  status?: string;
  className?: string;
}

export default function StatusBadge({
  status = "Available for freelance",
  className = "",
}: StatusBadgeProps) {
  return (
    <div
      className={`inline-flex items-center gap-3 rounded-full px-4 py-2 ${className}`}
      style={{ border: "1px solid var(--color-border)" }}
    >
      <span
        className="relative w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: "var(--color-gold)" }}
      >
        <span
          className="absolute inset-0 rounded-full status-pulse"
          style={{ backgroundColor: "var(--color-gold)" }}
        />
      </span>
      <span
        className="font-mono uppercase tracking-wider"
        style={{ fontSize: "var(--text-xs)", color: "var(--color-text-dim)" }}
      >
        {status}
      </span>
    </div>
  );
}
