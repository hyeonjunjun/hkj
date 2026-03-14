"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLenis } from "lenis/react";
import { useStudioStore } from "@/lib/store";
import ProjectIndex from "@/components/ProjectIndex";
import ProjectSelects from "@/components/ProjectSelects";
import InfoView from "@/components/InfoView";
import NowPlayingPanel from "@/components/NowPlayingPanel";
import PlayerBar from "@/components/PlayerBar";

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

export default function AppShell() {
  const activeView = useStudioStore((s) => s.activeView);
  const isPanelOpen = useStudioStore((s) => s.isPanelOpen);
  const setIsPanelOpen = useStudioStore((s) => s.setIsPanelOpen);
  const playerVisible = useStudioStore((s) => s.playerVisible);
  const lenis = useLenis();
  const prevPanelOpen = useRef(isPanelOpen);

  // Resize Lenis after panel transitions
  useEffect(() => {
    if (prevPanelOpen.current !== isPanelOpen) {
      prevPanelOpen.current = isPanelOpen;
      const timer = setTimeout(() => lenis?.resize(), 550);
      return () => clearTimeout(timer);
    }
  }, [isPanelOpen, lenis]);

  return (
    <>
      <div
        className="flex min-h-screen transition-all duration-500 ease-out"
        style={{
          paddingBottom: playerVisible ? 56 : 0,
        }}
      >
        {/* Main content area */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            {activeView === "index" && (
              <motion.div
                key="index"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5, ease }}
              >
                <ProjectIndex />
              </motion.div>
            )}
            {activeView === "selects" && (
              <motion.div
                key="selects"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5, ease }}
              >
                <ProjectSelects />
              </motion.div>
            )}
            {activeView === "info" && (
              <motion.div
                key="info"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5, ease }}
              >
                <InfoView />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Now Playing Panel — desktop push (>= 1280px) */}
        <AnimatePresence>
          {isPanelOpen && (
            <NowPlayingPanel />
          )}
        </AnimatePresence>
      </div>

      {/* Backdrop for overlay/sheet mode (768-1279px) */}
      <AnimatePresence>
        {isPanelOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-30 hidden md:block xl:hidden"
            style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
            onClick={() => setIsPanelOpen(false)}
          />
        )}
      </AnimatePresence>

      <PlayerBar />
    </>
  );
}
