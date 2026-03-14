"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useStudioStore } from "@/lib/store";
import { PROJECTS } from "@/constants/projects";

export default function PlayerBar() {
  const playerVisible = useStudioStore((s) => s.playerVisible);
  const activeProject = useStudioStore((s) => s.activeProject);
  const setActiveProject = useStudioStore((s) => s.setActiveProject);
  const isPlaying = useStudioStore((s) => s.isPlaying);
  const togglePlayback = useStudioStore((s) => s.togglePlayback);
  const isPanelOpen = useStudioStore((s) => s.isPanelOpen);
  const setIsPanelOpen = useStudioStore((s) => s.setIsPanelOpen);

  const currentIndex = PROJECTS.findIndex((p) => p.id === activeProject);
  const project = currentIndex >= 0 ? PROJECTS[currentIndex] : null;

  const skip = (direction: 1 | -1) => {
    const len = PROJECTS.length;
    const next = ((currentIndex + direction) % len + len) % len;
    setActiveProject(PROJECTS[next].id);
    if (isPanelOpen) setIsPanelOpen(true); // keep panel open

    // Scroll row into view
    const row = document.querySelector(`[data-project-row="${PROJECTS[next].id}"]`);
    if (row) {
      row.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <AnimatePresence>
      {playerVisible && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
          className="fixed bottom-0 left-0 right-0 z-40 flex items-center"
          style={{
            height: 56,
            borderTop: "1px solid var(--color-border)",
            backgroundColor: "var(--color-bg)",
          }}
        >
          {/* Progress line */}
          {project && (
            <div
              className="absolute top-0 left-0 h-[2px]"
              style={{
                width: `${((currentIndex + 1) / PROJECTS.length) * 100}%`,
                backgroundColor: "var(--color-accent)",
                transition: "width 0.4s ease",
              }}
            />
          )}

          {/* Left: Controls */}
          <div className="flex items-center gap-1 pl-4 md:pl-6">
            <button
              onClick={togglePlayback}
              className="font-mono hover:text-[var(--color-accent)] transition-colors p-2"
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--color-text)",
              }}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? "❚❚" : "▶"}
            </button>

            <button
              onClick={() => skip(-1)}
              className="font-mono hover:text-[var(--color-accent)] transition-colors p-2 hidden md:block"
              style={{
                fontSize: "var(--text-micro)",
                color: "var(--color-text-secondary)",
              }}
              aria-label="Previous project"
            >
              ◁
            </button>

            <button
              onClick={() => skip(1)}
              className="font-mono hover:text-[var(--color-accent)] transition-colors p-2 hidden md:block"
              style={{
                fontSize: "var(--text-micro)",
                color: "var(--color-text-secondary)",
              }}
              aria-label="Next project"
            >
              ▷
            </button>
          </div>

          {/* Center: Project info */}
          <div className="flex-1 min-w-0 px-4">
            {project && (
              <div className="truncate">
                <span
                  className="font-sans font-medium uppercase"
                  style={{
                    fontSize: "var(--text-xs)",
                    letterSpacing: "0.04em",
                    color: "var(--color-text)",
                  }}
                >
                  {project.title}
                </span>
                <span
                  className="font-mono ml-3 hidden sm:inline"
                  style={{
                    fontSize: "var(--text-micro)",
                    color: "var(--color-text-ghost)",
                  }}
                >
                  {project.sector} — {project.year}
                </span>
              </div>
            )}
          </div>

          {/* Right: Position */}
          <div className="pr-4 md:pr-6">
            <span
              className="font-mono"
              style={{
                fontSize: "var(--text-micro)",
                color: "var(--color-text-ghost)",
              }}
            >
              {currentIndex >= 0 ? currentIndex + 1 : "—"} / {PROJECTS.length}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
