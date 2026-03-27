import { create } from "zustand";

export type ViewMode = "index" | "drift" | "archive";
export type ThemeMode = "light" | "dark";

interface StudioStore {
  activeView: ViewMode;
  setActiveView: (view: ViewMode) => void;

  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;

  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;

  activeItemId: string | null;
  setActiveItemId: (id: string | null) => void;

  preloaderDone: boolean;
  setPreloaderDone: (done: boolean) => void;
}

export const useStudioStore = create<StudioStore>((set) => ({
  activeView: "index",
  setActiveView: (view) => set({ activeView: view }),

  theme: "light",
  setTheme: (theme) => set({ theme }),
  toggleTheme: () =>
    set((s) => ({ theme: s.theme === "light" ? "dark" : "light" })),

  mobileMenuOpen: false,
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),

  activeItemId: null,
  setActiveItemId: (id) => set({ activeItemId: id }),

  preloaderDone: false,
  setPreloaderDone: (done) => set({ preloaderDone: done }),
}));
