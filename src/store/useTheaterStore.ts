import { create } from "zustand";
import { PIECES } from "@/constants/pieces";

type Tab = "index" | "archive" | "about";

interface TheaterState {
  preloaderDone: boolean;
  setPreloaderDone: () => void;
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  selectedSlug: string;
  setSelectedSlug: (slug: string) => void;
  isDetailExpanded: boolean;
  expandDetail: () => void;
  collapseDetail: () => void;
}

const firstProject = PIECES.filter((p) => p.type === "project").sort((a, b) => a.order - b.order)[0];

export const useTheaterStore = create<TheaterState>((set) => ({
  preloaderDone: false,
  setPreloaderDone: () => set({ preloaderDone: true }),
  activeTab: "index",
  setActiveTab: (tab) => set({ activeTab: tab, isDetailExpanded: false }),
  selectedSlug: firstProject?.slug ?? "",
  setSelectedSlug: (slug) => set({ selectedSlug: slug }),
  isDetailExpanded: false,
  expandDetail: () => set({ isDetailExpanded: true }),
  collapseDetail: () => set({ isDetailExpanded: false }),
}));
