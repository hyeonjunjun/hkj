"use client";

import { useEffect } from "react";
import { useTheaterStore } from "@/store/useTheaterStore";
import { PIECES } from "@/constants/pieces";

export function useURLSync() {
  const activeTab = useTheaterStore((s) => s.activeTab);
  const selectedSlug = useTheaterStore((s) => s.selectedSlug);
  const isDetailExpanded = useTheaterStore((s) => s.isDetailExpanded);

  // Push URL when state changes
  useEffect(() => {
    let url = "/";
    if (isDetailExpanded && selectedSlug) {
      const piece = PIECES.find((p) => p.slug === selectedSlug);
      url =
        piece?.type === "experiment"
          ? `/archive/${selectedSlug}`
          : `/index/${selectedSlug}`;
    } else if (activeTab === "archive") {
      url = "/archive";
    } else if (activeTab === "about") {
      url = "/about";
    }

    if (window.location.pathname !== url) {
      window.history.pushState(null, "", url);
    }
  }, [activeTab, selectedSlug, isDetailExpanded]);

  // Handle popstate (back/forward)
  useEffect(() => {
    const onPop = () => {
      const path = window.location.pathname;
      const store = useTheaterStore.getState();

      if (path === "/") {
        store.setActiveTab("index");
        store.collapseDetail();
      } else if (path === "/archive") {
        store.setActiveTab("archive");
        store.collapseDetail();
      } else if (path === "/about") {
        store.setActiveTab("about");
        store.collapseDetail();
      } else if (path.startsWith("/index/")) {
        const slug = path.split("/index/")[1];
        if (slug) {
          store.setActiveTab("index");
          store.setSelectedSlug(slug);
          store.expandDetail();
        }
      } else if (path.startsWith("/archive/")) {
        const slug = path.split("/archive/")[1];
        if (slug) {
          store.setActiveTab("archive");
          store.setSelectedSlug(slug);
          store.expandDetail();
        }
      }
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);
}
