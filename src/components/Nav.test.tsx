import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Nav from "./Nav";
import type { NavItem } from "@/data/studio";

// usePathname() returns null in this project's test environment (no
// router-context mock exists) -- and isNavItemActive explicitly returns
// false for a null pathname, so every item would render as inactive
// without this mock, making the active-state assertions below
// impossible to exercise. "/" matches the "works" item's href.
vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

const items: NavItem[] = [
  { label: "works", href: "/", room: "works" },
  { label: "archive", href: "/archive", room: "archive" },
];

describe("Nav default (room) variant", () => {
  it("renders plain-text labels, no brackets", () => {
    render(<Nav items={items} />);
    expect(screen.getByText("works")).toBeInTheDocument();
    expect(screen.queryByText("[ works ]")).not.toBeInTheDocument();
  });
});

describe("Nav landing variant", () => {
  it("renders each label wrapped in brackets", () => {
    render(<Nav items={items} variant="landing" />);
    expect(screen.getByText(/\[\s*works\s*\]/)).toBeInTheDocument();
    expect(screen.getByText(/\[\s*archive\s*\]/)).toBeInTheDocument();
  });

  it("uses uppercase styling and the ws-accent color on the active link, not ember", () => {
    render(<Nav items={items} variant="landing" />);
    const activeLink = screen.getByRole("link", { name: /works/i });
    expect(activeLink.className).toContain("uppercase");
    const underline = activeLink.querySelector("span[aria-hidden]");
    expect(underline).toHaveClass("bg-ws-accent");
    expect(underline).not.toHaveClass("bg-ember");
  });
});
