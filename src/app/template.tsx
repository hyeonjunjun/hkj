"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useStudioStore } from "@/lib/store";
import { PROJECTS } from "@/constants/projects";

/**
 * Global Route Template
 * ─────────────────────
 * Gap 4: Project-aware page transition.
 * When navigating to a case study, the shutter shows the project title
 * and accent color. Generic transitions for other routes.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const transitionProject = useStudioStore((s) => s.transitionProject);
  const setTransitionProject = useStudioStore((s) => s.setTransitionProject);

  // Find project data for the transition
  const project = transitionProject
    ? PROJECTS.find((p) => p.id === transitionProject)
    : null;

  // Clear transition project after animation completes
  useEffect(() => {
    const t = setTimeout(() => setTransitionProject(null), 1200);
    return () => clearTimeout(t);
  }, [pathname, setTransitionProject]);

  return (
    <>
      {/* The Shutter Mask */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-[9990] flex items-end justify-between pointer-events-none"
        style={{
          backgroundColor: "var(--color-text)",
          padding: "clamp(1.5rem, 3vw, 3rem)",
        }}
        initial={{ height: "100svh" }}
        animate={{ height: "0svh" }}
        exit={{ height: "100svh" }}
        transition={{ duration: 0.9, ease: [0.77, 0, 0.175, 1], delay: 0.1 }}
      >
        {/* Left: system info */}
        <motion.div
          className="font-mono uppercase tracking-[0.2em]"
          style={{ fontSize: "10px", color: "var(--color-bg)" }}
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          [ MOUNTING MODULE ]
          <br />
          TARGET: {pathname || "/"}
          <br />
          STATUS: SYS.OK
        </motion.div>

        {/* Right: project title if navigating to a case study */}
        {project && (
          <motion.div
            className="text-right"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
          >
            <span
              className="font-display font-bold uppercase tracking-tighter leading-none block"
              style={{
                fontSize: "clamp(2rem, 5vw, 5rem)",
                color: project.mood || "var(--color-bg)",
              }}
            >
              {project.title.split(":")[0]}
            </span>
            <span
              className="font-mono uppercase tracking-[0.2em] block mt-2"
              style={{ fontSize: "10px", color: "var(--color-bg)", opacity: 0.5 }}
            >
              {project.sector}
            </span>
          </motion.div>
        )}
      </motion.div>

      {/* The Page Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
      >
        {children}
      </motion.div>
    </>
  );
}
