import { describe, it, expect } from "vitest";
import { isNavItemActive } from "./navActive";
import type { NavItem } from "@/data/studio";

const worksItem: NavItem = { label: "works", href: "/", room: "works" };
const archiveItem: NavItem = { label: "archive", href: "/archive", room: "archive" };

describe("isNavItemActive", () => {
  it("matches when pathname equals href exactly", () => {
    expect(isNavItemActive("/", worksItem)).toBe(true);
    expect(isNavItemActive("/archive", archiveItem)).toBe(true);
  });

  it("matches a room-prefixed sub-path even when href doesn't share that prefix", () => {
    // The bug case: href is "/" but the room is "works", and a case-study
    // page at /works/[slug] should still light up the "works" tab.
    expect(isNavItemActive("/works/placeholder-i", worksItem)).toBe(true);
  });

  it("matches a room-prefixed sub-path when href and room already agree", () => {
    expect(isNavItemActive("/archive/some-entry", archiveItem)).toBe(true);
  });

  it("does not match an unrelated path", () => {
    expect(isNavItemActive("/references", worksItem)).toBe(false);
    expect(isNavItemActive("/info", archiveItem)).toBe(false);
  });

  it("does not match a path that merely starts with the same characters", () => {
    // "/archived-notes" should not match the "archive" room's prefix check.
    expect(isNavItemActive("/archived-notes", archiveItem)).toBe(false);
  });

  it("returns false for a null pathname (usePathname can return null during render)", () => {
    expect(isNavItemActive(null, worksItem)).toBe(false);
  });
});
