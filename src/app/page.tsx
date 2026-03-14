"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useStudioStore } from "@/lib/store";
import ProjectListView from "@/components/ProjectListView";
import HeroToGridSection from "@/components/HeroToGridSection";
import ViewModeToggle from "@/components/ui/ViewModeToggle";

/**
 * Homepage — Hero-to-Grid with View Mode Toggle
 *
 * Structure:
 *   1. Grid mode: HeroToGridSection (scroll-driven zoom from hero to grid)
 *   2. List mode: ProjectListView (full-bleed vertical image cards)
 *   3. Footer CTA → opens ContactOverlay
 *   4. ViewModeToggle appears after grid reveals (or always in list mode)
 */

export default function Home() {
  const viewMode = useStudioStore((s) => s.viewMode);
  const setActiveOverlay = useStudioStore((s) => s.setActiveOverlay);
  const gridRevealed = useStudioStore((s) => s.gridRevealed);

  return (
    <main>
      {/* Gallery */}
      <AnimatePresence mode="wait">
        {viewMode === "list" ? (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <ProjectListView />
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <HeroToGridSection />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer CTA */}
      <section
        className="section-padding"
        style={{
          paddingTop: "clamp(4rem, 8vh, 6rem)",
          paddingBottom: "clamp(6rem, 12vh, 10rem)",
          borderTop: "1px solid var(--color-border)",
        }}
      >
        <button
          onClick={() => setActiveOverlay("contact")}
          data-cursor="project"
          className="group block w-full text-left headline-mixed"
        >
          <span
            className="font-sans font-medium uppercase block"
            style={{
              fontSize: "var(--text-3xl)",
              letterSpacing: "-0.02em",
              lineHeight: 1,
              color: "var(--color-text)",
              transition: "color 0.4s ease",
            }}
          >
            LET&apos;S
          </span>
          <em
            className="block group-hover:text-[var(--color-accent)] transition-colors duration-400"
            style={{
              fontSize: "var(--text-3xl)",
              lineHeight: 1,
              color: "var(--color-text)",
            }}
          >
            work together.
          </em>
        </button>
      </section>

      {/* ViewModeToggle — visible after grid reveals or in list mode */}
      {(gridRevealed || viewMode === "list") && <ViewModeToggle />}
    </main>
  );
}
