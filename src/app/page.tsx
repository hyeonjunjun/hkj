"use client";

import Nav from "@/components/Nav";
import HeroSection from "@/components/HeroSection";
import WorkIndex from "@/components/WorkIndex";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main">
        <HeroSection />
        <WorkIndex />
      </main>
      <Footer />
    </>
  );
}
