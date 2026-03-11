import HeroSection from "@/components/sections/HeroSection";
import SelectedWork from "@/components/sections/SelectedWork";
import AboutSection from "@/components/sections/AboutSection";
import ContactSection from "@/components/sections/ContactSection";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <SelectedWork />
      <AboutSection />
      <ContactSection />
    </main>
  );
}
