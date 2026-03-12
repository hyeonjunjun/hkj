"use client";

import { useStudioStore } from "@/lib/store";

/**
 * ExperienceToggle
 *
 * Minimal [ CIN / REC ] monospace toggle for switching between
 * cinematic (Rail A) and recruiter (Rail B) experience modes.
 */
export default function ExperienceToggle() {
  const mode = useStudioStore((s) => s.experienceMode);
  const setMode = useStudioStore((s) => s.setExperienceMode);

  return (
    <button
      onClick={() => setMode(mode === "cinematic" ? "recruiter" : "cinematic")}
      className="font-mono uppercase tracking-[0.2em] transition-colors hover:text-[var(--color-accent)]"
      style={{ fontSize: "var(--text-micro)", color: "var(--color-text-ghost)" }}
      aria-label={`Switch to ${mode === "cinematic" ? "recruiter" : "cinematic"} mode`}
    >
      <span style={{ color: mode === "cinematic" ? "var(--color-text)" : "var(--color-text-ghost)" }}>
        CIN
      </span>
      <span className="mx-1 opacity-40">/</span>
      <span style={{ color: mode === "recruiter" ? "var(--color-text)" : "var(--color-text-ghost)" }}>
        REC
      </span>
    </button>
  );
}
