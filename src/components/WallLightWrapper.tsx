"use client";

import dynamic from "next/dynamic";

const WallLight = dynamic(() => import("@/components/WallLight"), {
  ssr: false,
});

export default function WallLightWrapper() {
  return <WallLight />;
}
