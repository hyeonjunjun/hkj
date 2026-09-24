import { describe, it, expect } from "vitest";
import { delay, duration, delaySeconds, durationSeconds, easeMove, easing } from "./motion";

describe("delaySeconds / durationSeconds", () => {
  it("converts every delay constant to seconds", () => {
    expect(delaySeconds.wordmark).toBeCloseTo(delay.wordmark / 1000);
    expect(delaySeconds.standfirst).toBeCloseTo(delay.standfirst / 1000);
    expect(delaySeconds.nav).toBeCloseTo(delay.nav / 1000);
    expect(delaySeconds.thesis).toBeCloseTo(delay.thesis / 1000);
    expect(delaySeconds.cornerMark).toBeCloseTo(delay.cornerMark / 1000);
  });

  it("converts every duration constant to seconds", () => {
    expect(durationSeconds.micro).toBeCloseTo(duration.micro / 1000);
    expect(durationSeconds.mid).toBeCloseTo(duration.mid / 1000);
    expect(durationSeconds.move).toBeCloseTo(duration.move / 1000);
    expect(durationSeconds.reveal).toBeCloseTo(duration.reveal / 1000);
  });
});

describe("the motion system", () => {
  it("exposes easing.move as the same curve in tuple form", () => {
    expect(`cubic-bezier(${easeMove.join(", ")})`).toBe(easing.move);
  });

  it("pairs each duration with a curve, slowest last", () => {
    expect(duration.micro).toBeLessThan(duration.mid);
    expect(duration.mid).toBeLessThan(duration.move);
  });

  it("uses symmetric ease-in-out curves — the first control point must not start at full speed", () => {
    // An ease-OUT reads as the page reacting; the site's character is a
    // curve that gathers itself first. Both of ours start shallow.
    for (const curve of [easing.micro, easing.move]) {
      const [x1, y1] = curve.match(/[\d.]+/g)!.slice(0, 2).map(Number);
      expect(y1).toBe(0);
      expect(x1).toBeGreaterThan(0.5);
    }
  });
});
