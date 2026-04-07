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

function ActiveView({
  activeTab,
  isDetailExpanded,
}: {
  activeTab: string;
  isDetailExpanded: boolean;
}) {
  if (isDetailExpanded) return <DetailView key="detail" />;

  switch (activeTab) {
    case "index":
      return <IndexView key="index" />;
    case "archive":
      return <ArchiveView key="archive" />;
    case "about":
      return <AboutView key="about" />;
    default:
      return null;
  }
}

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

      {/* Left zone — content views */}
      <div
        className="absolute flex items-center"
        style={{
          left: 0,
          top: 48,
          bottom: 40,
          width: "38%",
          paddingLeft: "clamp(32px, 8vw, 96px)",
        }}
      >
        <AnimatePresence mode="wait">
          <ActiveView activeTab={activeTab} isDetailExpanded={isDetailExpanded} />
        </AnimatePresence>
      </div>

      {/* Right zone — 3D scene */}
      <div
        className="absolute flex items-center justify-center"
        style={{
          right: 0,
          top: 48,
          bottom: 40,
          width: "60%",
        }}
      >
        <Scene3D />
      </div>
    </div>
  );
}
