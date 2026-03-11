import HeroSection from "@/components/sections/HeroSection";
import ProjectGrid from "@/components/sections/ProjectGrid";
import AboutSection from "@/components/sections/AboutSection";
import ContactSection from "@/components/sections/ContactSection";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <ProjectGrid />
      <AboutSection />
      <ContactSection />
    </main>
  );
}
