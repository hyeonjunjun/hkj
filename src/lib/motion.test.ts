import { describe, it, expect } from "vitest";
import { delay, duration, delaySeconds, durationSeconds, windEasing } from "./motion";

describe("delaySeconds / durationSeconds", () => {
  it("converts every delay constant to seconds", () => {
    expect(delaySeconds.wordmark).toBeCloseTo(delay.wordmark / 1000);
    expect(delaySeconds.standfirst).toBeCloseTo(delay.standfirst / 1000);
    expect(delaySeconds.nav).toBeCloseTo(delay.nav / 1000);
    expect(delaySeconds.thesis).toBeCloseTo(delay.thesis / 1000);
    expect(delaySeconds.cornerMark).toBeCloseTo(delay.cornerMark / 1000);
  });

  it("converts every duration constant to seconds", () => {
    expect(durationSeconds.fast).toBeCloseTo(duration.fast / 1000);
    expect(durationSeconds.base).toBeCloseTo(duration.base / 1000);
    expect(durationSeconds.slow).toBeCloseTo(duration.slow / 1000);
    expect(durationSeconds.reveal).toBeCloseTo(duration.reveal / 1000);
  });
});

describe("windEasing", () => {
  it("is the Windswept brief's organic-deceleration cubic-bezier tuple", () => {
    expect(windEasing).toEqual([0.16, 1, 0.3, 1]);
  });
});
