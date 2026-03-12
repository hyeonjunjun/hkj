import HeroSection from "@/components/sections/HeroSection";
import StudioSection from "@/components/sections/StudioSection";
import SelectedWork from "@/components/sections/SelectedWork";
import ContactSection from "@/components/sections/ContactSection";

/**
 * Main Entry Point
 * 
 * Flow:
 * 1. HeroSection — Jonite Asymmetric + Dual Time
 * 2. StudioSection — Editorial Interlude / About
 * 3. SelectedWork — Radiance 2-column Grid
 * 4. ContactSection — SNP Dark Wordmark + Form
 */

export default function Home() {
  return (
    <main>
      <HeroSection />
      <StudioSection />
      <SelectedWork />
      <ContactSection />
    </main>
  );
}
