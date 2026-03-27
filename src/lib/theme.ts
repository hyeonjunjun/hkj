import type { ThemeMode } from "./store";

export function getInitialTheme(): ThemeMode {
  if (typeof window === "undefined") return "light";

  const stored = localStorage.getItem("hkj-theme");
  if (stored === "light" || stored === "dark") return stored;

  // Time-of-day default (NYC)
  const now = new Date();
  const nyc = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }));
  const hour = nyc.getHours();
  return hour >= 6 && hour < 18 ? "light" : "dark";
}

export function applyTheme(theme: ThemeMode) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("hkj-theme", theme);
}
