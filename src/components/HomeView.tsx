// src/components/HomeView.tsx
"use client";

import { IndexCarousel } from "@/components/home/IndexCarousel";

export default function HomeView() {
  return (
    <div className="home">
      <IndexCarousel />

      <style>{`
        .home {
          position: relative;
          width: 100%;
          height: 100dvh;
          overflow: hidden;
          padding-top: calc(var(--margin-page) + 48px); /* clear sitebar */
          padding-bottom: calc(var(--margin-page) + 48px); /* clear bottom bar */
        }
      `}</style>
    </div>
  );
}
