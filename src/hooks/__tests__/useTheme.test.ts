import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useTheme } from "../useTheme";

describe("useTheme", () => {
  beforeEach(() => {
    window.localStorage.clear();
    delete document.documentElement.dataset.theme;
  });

  it("returns light when DOM has no data-theme", async () => {
    const { result } = renderHook(() => useTheme());
    await waitFor(() => expect(result.current.theme).toBe("light"));
  });

  it("returns dark when DOM has data-theme='dark'", async () => {
    document.documentElement.dataset.theme = "dark";
    const { result } = renderHook(() => useTheme());
    await waitFor(() => expect(result.current.theme).toBe("dark"));
  });

  it("setTheme writes DOM attribute and localStorage", () => {
    const { result } = renderHook(() => useTheme());
    act(() => result.current.setTheme("dark"));
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(window.localStorage.getItem("hkj.theme")).toBe("dark");
  });

  it("toggle flips between light and dark", async () => {
    const { result } = renderHook(() => useTheme());
    await waitFor(() => expect(result.current.theme).toBe("light"));
    act(() => result.current.toggle());
    expect(result.current.theme).toBe("dark");
    expect(window.localStorage.getItem("hkj.theme")).toBe("dark");
    act(() => result.current.toggle());
    expect(result.current.theme).toBe("light");
    expect(window.localStorage.getItem("hkj.theme")).toBe("light");
  });

  it("reading from DOM is canonical, not localStorage", async () => {
    // Set localStorage but NOT the DOM attribute
    window.localStorage.setItem("hkj.theme", "dark");
    const { result } = renderHook(() => useTheme());
    // Hook should read DOM (which is unset → "light"), not localStorage
    await waitFor(() => expect(result.current.theme).toBe("light"));
  });
});
