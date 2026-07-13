import { describe, it, expect } from "vitest";
import {
  dampStep,
  classifyWheelGesture,
  findNearestIndex,
  clampIndex,
  sortWorksForTimeline,
} from "./timelineMotion";
import type { Work } from "@/data/works";

describe("dampStep", () => {
  it("moves partway from current toward target by the damping factor", () => {
    expect(dampStep(0, 100, 0.1)).toBeCloseTo(10);
    expect(dampStep(50, 50, 0.1)).toBe(50);
  });

  it("snaps to target once within a small epsilon, to avoid infinite tiny steps", () => {
    // 0.05px away, well under the 0.1px settle threshold.
    expect(dampStep(99.95, 100, 0.1)).toBe(100);
  });
});

describe("classifyWheelGesture", () => {
  it("classifies a vertical-dominant gesture (plain mouse wheel)", () => {
    expect(classifyWheelGesture({ deltaX: 0, deltaY: 40 })).toBe("vertical");
  });

  it("classifies a horizontal-dominant gesture (trackpad swipe)", () => {
    expect(classifyWheelGesture({ deltaX: 40, deltaY: 5 })).toBe("horizontal");
  });

  it("treats an exact tie as horizontal (let native scroll handle it)", () => {
    expect(classifyWheelGesture({ deltaX: 20, deltaY: 20 })).toBe("horizontal");
  });
});

describe("findNearestIndex", () => {
  it("returns the index of the center closest to the target", () => {
    expect(findNearestIndex([0, 100, 200, 300], 210)).toBe(2);
  });

  it("returns 0 for an empty-adjacent edge case (single center)", () => {
    expect(findNearestIndex([150], 9999)).toBe(0);
  });

  it("breaks exact ties toward the earlier (lower) index", () => {
    expect(findNearestIndex([0, 100], 50)).toBe(0);
  });
});

describe("clampIndex", () => {
  it("clamps below zero up to zero", () => {
    expect(clampIndex(-1, 5)).toBe(0);
  });

  it("clamps at-or-above length down to length - 1 (no wraparound)", () => {
    expect(clampIndex(5, 5)).toBe(4);
    expect(clampIndex(99, 5)).toBe(4);
  });

  it("passes through an in-range index unchanged", () => {
    expect(clampIndex(2, 5)).toBe(2);
  });
});

describe("sortWorksForTimeline", () => {
  const work = (id: string, year: string, index: number): Work => ({
    id,
    slug: id,
    index,
    romanNumeral: String(index),
    title: `Title ${id}`,
    caption: "caption",
    description: "description",
    category: "WORK",
    year,
    status: "LIVE",
    role: "role",
    media: { type: "placeholder", alt: "alt", aspectRatio: "square" },
    layout: {
      desktopColumn: "left",
      desktopVerticalAnchor: 0,
      desktopSize: "sm",
      captionPosition: "below",
    },
  });

  it("sorts newest year first", () => {
    const input = [work("a", "2024", 1), work("b", "2026", 2), work("c", "2025", 3)];
    expect(sortWorksForTimeline(input).map((w) => w.id)).toEqual(["b", "c", "a"]);
  });

  it("breaks same-year ties by index, descending", () => {
    const input = [work("a", "2025", 1), work("b", "2025", 3), work("c", "2025", 2)];
    expect(sortWorksForTimeline(input).map((w) => w.id)).toEqual(["b", "c", "a"]);
  });

  it("does not mutate the input array", () => {
    const input = [work("a", "2024", 1), work("b", "2026", 2)];
    const inputCopy = [...input];
    sortWorksForTimeline(input);
    expect(input).toEqual(inputCopy);
  });
});
