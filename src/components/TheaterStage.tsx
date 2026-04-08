"use client";

import { AnimatePresence } from "framer-motion";
import { useTheaterStore } from "@/store/useTheaterStore";
import { useURLSync } from "@/hooks/useURLSync";
import TopBar from "@/components/TopBar";
import BottomBar from "@/components/BottomBar";
import Scene3D from "@/components/Scene3D";
import IndexView from "@/components/views/IndexView";
import ArchiveView from "@/components/views/ArchiveView";
import AboutView from "@/components/views/AboutView";
import DetailView from "@/components/views/DetailView";

export default function TheaterStage() {
  useURLSync();

  const preloaderDone = useTheaterStore((s) => s.preloaderDone);
  const activeTab = useTheaterStore((s) => s.activeTab);
  const isDetailExpanded = useTheaterStore((s) => s.isDetailExpanded);

  if (!preloaderDone) return null;

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden" id="main">
      <TopBar />
      <BottomBar />

      {/* Text column — left 35% */}
      <div
        className="absolute z-10"
        style={{
          left: 0,
          top: 52,
          bottom: 40,
          width: "35%",
          paddingLeft: "clamp(32px, 6vw, 80px)",
          paddingRight: 24,
          display: "flex",
          alignItems: "center",
        }}
      >
        <div style={{ maxWidth: 320, width: "100%" }}>
          <AnimatePresence mode="wait">
            {isDetailExpanded ? (
              <DetailView key="detail" />
            ) : activeTab === "index" ? (
              <IndexView key="index" />
            ) : activeTab === "archive" ? (
              <ArchiveView key="archive" />
            ) : (
              <AboutView key="about" />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Vertical divider between zones */}
      <div
        className="absolute z-10"
        style={{
          left: "35%",
          top: 52,
          bottom: 40,
          width: 1,
          background: "linear-gradient(to bottom, transparent 10%, var(--fg-4) 30%, var(--fg-4) 70%, transparent 90%)",
        }}
      />

      {/* 3D canvas — right 65% */}
      <div
        className="absolute flex items-center justify-center"
        style={{
          right: 0,
          top: 52,
          bottom: 40,
          width: "65%",
          zIndex: 5,
          transform: activeTab === "about" ? "scale(0.7)" : "scale(1)",
          transition: "transform 0.5s ease",
        }}
      >
        <Scene3D />
      </div>
    </div>
  );
}
