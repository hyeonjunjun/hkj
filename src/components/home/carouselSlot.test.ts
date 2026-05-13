import { describe, it, expect } from "vitest";
import { computeSlot, type SlotRole } from "./carouselSlot";

describe("computeSlot", () => {
  it("returns center for the active piece", () => {
    expect(computeSlot(2, 2, 7)).toEqual({ slot: 0, role: "center" });
  });

  it("returns right-of-center for active + 1", () => {
    expect(computeSlot(3, 2, 7)).toEqual({ slot: 1, role: "right" });
  });

  it("returns left-of-center for active - 1 (wrapping)", () => {
    expect(computeSlot(1, 2, 7)).toEqual({ slot: 6, role: "left" });
  });

  it("wraps left from index 0", () => {
    expect(computeSlot(6, 0, 7)).toEqual({ slot: 6, role: "left" });
  });

  it("returns hidden for any other slot", () => {
    expect(computeSlot(4, 2, 7)).toEqual({ slot: 2, role: "hidden" });
    expect(computeSlot(5, 2, 7)).toEqual({ slot: 3, role: "hidden" });
  });
});
