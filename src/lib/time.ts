export type TimePeriod = "dawn" | "day" | "dusk" | "night";

/**
 * Get the current hour in NYC Eastern Time (0-23).
 */
export function getNYCHour(): number {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    hour: "numeric",
    hour12: false,
  });
  return parseInt(formatter.format(new Date()), 10);
}

/**
 * Determine the time period based on NYC hour.
 *
 * Dawn:  5–7
 * Day:   7–17
 * Dusk:  17–19
 * Night: 19–5
 */
export function getTimePeriod(hour?: number): TimePeriod {
  const h = hour ?? getNYCHour();
  if (h >= 5 && h < 7) return "dawn";
  if (h >= 7 && h < 17) return "day";
  if (h >= 17 && h < 19) return "dusk";
  return "night";
}
