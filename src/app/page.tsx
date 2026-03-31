"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { CONTACT_EMAIL } from "@/constants/contact";

const Constellation = dynamic(() => import("@/components/Constellation"), {
  ssr: false,
  loading: () => null,
});

export default function Home() {
  return (
    <>
      <Constellation />

      {/* Edge labels */}
      <span className="edge-label edge-tl">HKJ</span>
      <nav className="edge-label edge-tr">
        <Link href="/about">About</Link>
        <span className="edge-sep">&middot;</span>
        <a href={`mailto:${CONTACT_EMAIL}`}>Connect</a>
      </nav>
      <span className="edge-label edge-bl">Design &amp; development</span>
      <span className="edge-label edge-br">Est. 2025</span>
    </>
  );
}
