"use client";

import HeroSection from "@/components/HeroSection";
import WorkIndex from "@/components/WorkIndex";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <main id="main">
        <HeroSection />
        <WorkIndex />
      </main>
      <Footer />
    </>
  );
}
