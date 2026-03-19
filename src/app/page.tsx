"use client";

import { AnimatePresence } from "framer-motion";
import { useStudioStore } from "@/lib/store";
import HomepageChrome from "@/components/homepage/HomepageChrome";
import HomepageList from "@/components/homepage/HomepageList";

export default function Home() {
  const viewMode = useStudioStore((s) => s.viewMode);

  return (
    <main style={{ height: "100dvh", overflow: "hidden" }}>
      <HomepageChrome />
      <AnimatePresence mode="wait">
        {viewMode === "list" && <HomepageList key="list" />}
        {/* Slider mode added in next chunk */}
      </AnimatePresence>
    </main>
  );
}
