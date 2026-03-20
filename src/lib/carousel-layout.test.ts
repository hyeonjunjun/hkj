import { describe, it, expect } from "vitest";
import {
  getCardDimensions,
  buildCardPositions,
  buildCardLeftEdges,
  snapToNearest,
  findNearestIndex,
  circularDistance,
  distanceToOpacity,
  distanceToBlur,
  LIST_LAYOUT,
} from "./carousel-layout";

/* ── Slider card dimensions ── */

describe("getCardDimensions", () => {
  it("desktop (1440px): portrait ≈ 32vw wide, 1.5 aspect", () => {
    const dims = getCardDimensions(1440, 900);
    expect(dims.portrait.width).toBeCloseTo(1440 * 0.32, 0); // ~461px
    expect(dims.portrait.height).toBeCloseTo(1440 * 0.32 * 1.5, 0); // ~691px
  });

  it("desktop (1440px): landscape ≈ 49vw wide, 1.75 aspect", () => {
    const dims = getCardDimensions(1440, 900);
    expect(dims.landscape.width).toBeCloseTo(1440 * 0.49, 0); // ~706px
    expect(dims.landscape.height).toBeCloseTo(1440 * 0.49 / 1.75, 0); // ~403px
  });

  it("mobile (<768px): both formats use full viewport width", () => {
    const dims = getCardDimensions(375, 812);
    expect(dims.portrait.width).toBe(375);
    expect(dims.landscape.width).toBe(375);
  });

  it("tablet (768-1023): scales between mobile and desktop", () => {
    const dims = getCardDimensions(800, 600);
    expect(dims.portrait.width).toBeCloseTo(800 * 0.38, 0);
    expect(dims.landscape.width).toBeCloseTo(800 * 0.55, 0);
  });
});

/* ── Position model ── */

describe("buildCardPositions", () => {
  it("first card centers at x = (viewport/2 - width/2)", () => {
    // 3 cards: 400, 600, 400 in a 1440 viewport
    const positions = buildCardPositions([400, 600, 400], 1440);
    // Card 0: -(0 + 200 - 720) = 520
    expect(positions[0]).toBe(520);
  });

  it("subsequent cards account for cumulative width", () => {
    const positions = buildCardPositions([400, 600, 400], 1440);
    // Card 1: -(400 + 300 - 720) = 20
    expect(positions[1]).toBe(20);
    // Card 2: -(1000 + 200 - 720) = -480
    expect(positions[2]).toBe(-480);
  });

  it("positions are monotonically decreasing", () => {
    const positions = buildCardPositions([460, 700, 460, 700, 460, 700], 1440);
    for (let i = 1; i < positions.length; i++) {
      expect(positions[i]).toBeLessThan(positions[i - 1]);
    }
  });
});

describe("buildCardLeftEdges", () => {
  it("first card starts at 0", () => {
    const edges = buildCardLeftEdges([400, 600, 400]);
    expect(edges[0]).toBe(0);
  });

  it("edges are cumulative sums", () => {
    const edges = buildCardLeftEdges([400, 600, 400]);
    expect(edges[1]).toBe(400);
    expect(edges[2]).toBe(1000);
  });
});

/* ── Snap behavior ── */

describe("snapToNearest", () => {
  const positions = [520, 20, -480];

  it("snaps to exact position", () => {
    expect(snapToNearest(520, positions)).toBe(520);
  });

  it("snaps to closest when between positions", () => {
    expect(snapToNearest(300, positions)).toBe(520);
    expect(snapToNearest(200, positions)).toBe(20);
  });

  it("snaps to last position when past the end", () => {
    expect(snapToNearest(-1000, positions)).toBe(-480);
  });
});

describe("findNearestIndex", () => {
  const positions = [520, 20, -480];

  it("returns 0 for value near first position", () => {
    expect(findNearestIndex(500, positions)).toBe(0);
  });

  it("returns last index for value past the end", () => {
    expect(findNearestIndex(-900, positions)).toBe(2);
  });

  it("returns middle index for value in the middle", () => {
    expect(findNearestIndex(50, positions)).toBe(1);
  });
});

/* ── List view: circular distance ── */

describe("circularDistance", () => {
  it("adjacent items have distance 1", () => {
    expect(circularDistance(0, 1, 12)).toBe(1);
    expect(circularDistance(5, 6, 12)).toBe(1);
  });

  it("wraps around: first and last are distance 1 in 12 items", () => {
    expect(circularDistance(0, 11, 12)).toBe(1);
  });

  it("maximum distance is floor(total/2)", () => {
    expect(circularDistance(0, 6, 12)).toBe(6);
  });

  it("same index has distance 0", () => {
    expect(circularDistance(3, 3, 12)).toBe(0);
  });

  it("works with 6 items", () => {
    expect(circularDistance(0, 5, 6)).toBe(1); // wraps
    expect(circularDistance(0, 3, 6)).toBe(3); // max distance
  });
});

/* ── Proximity hover falloff ── */

describe("distanceToOpacity", () => {
  it("hovered item (dist=0) gets 0.85 opacity", () => {
    expect(distanceToOpacity(0, 12)).toBe(0.85);
  });

  it("adjacent items get ~0.49 opacity", () => {
    const opacity = distanceToOpacity(1, 12);
    expect(opacity).toBeGreaterThan(0.35);
    expect(opacity).toBeLessThan(0.65);
  });

  it("far items bottom out at 0.15", () => {
    const opacity = distanceToOpacity(6, 12);
    expect(opacity).toBe(0.15);
  });

  it("opacity decreases with distance", () => {
    const o1 = distanceToOpacity(1, 12);
    const o2 = distanceToOpacity(2, 12);
    const o3 = distanceToOpacity(3, 12);
    expect(o1).toBeGreaterThan(o2);
    expect(o2).toBeGreaterThan(o3);
  });
});

describe("distanceToBlur", () => {
  it("hovered item has 0 blur", () => {
    expect(distanceToBlur(0, 12)).toBe(0);
  });

  it("nearest items have ~0.3px blur", () => {
    const blur = distanceToBlur(1, 12);
    expect(blur).toBeGreaterThanOrEqual(0.3);
    expect(blur).toBeLessThan(0.5);
  });

  it("farthest items have ~0.9px blur", () => {
    const blur = distanceToBlur(6, 12);
    expect(blur).toBeCloseTo(0.9, 1);
  });
});

/* ── List layout constants match Cathydolle ── */

describe("LIST_LAYOUT constants", () => {
  it("row height is 11vh", () => {
    expect(LIST_LAYOUT.rowHeightVh).toBe(11);
  });

  it("side margin is 7.73vw", () => {
    expect(LIST_LAYOUT.sideMarginVw).toBe(7.73);
  });

  it("vertical padding is 10vh", () => {
    expect(LIST_LAYOUT.verticalPaddingVh).toBe(10);
  });

  it("number column is 7.73vw", () => {
    expect(LIST_LAYOUT.numberColumnVw).toBe(7.73);
  });

  it("row gap is 8px", () => {
    expect(LIST_LAYOUT.rowGapPx).toBe(8);
  });

  it("at 1440px viewport, side margin ≈ 111px", () => {
    const marginPx = (LIST_LAYOUT.sideMarginVw / 100) * 1440;
    expect(marginPx).toBeCloseTo(111, 0);
  });

  it("at 900px viewport height, row height ≈ 99px", () => {
    const rowPx = (LIST_LAYOUT.rowHeightVh / 100) * 900;
    expect(rowPx).toBeCloseTo(99, 0);
  });
});
