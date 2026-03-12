import HeroSection from "@/components/sections/HeroSection";
import StudioSection from "@/components/sections/StudioSection";
import SelectedWork from "@/components/sections/SelectedWork";
import ContactSection from "@/components/sections/ContactSection";

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
