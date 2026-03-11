import HeroSection from "@/components/sections/HeroSection";
import SelectedWork from "@/components/sections/SelectedWork";
import AboutSection from "@/components/sections/AboutSection";
import ContactSection from "@/components/sections/ContactSection";
import InfiniteMarquee from "@/components/ui/InfiniteMarquee";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <InfiniteMarquee
        items={["Design", "Code", "Motion", "NYC"]}
        separator="·"
        speed={40}
      />
      <SelectedWork />
      <InfiniteMarquee
        items={["Let's make something", "Let's make something"]}
        separator="—"
        speed={30}
        direction="right"
      />
      <AboutSection />
      <ContactSection />
    </main>
  );
}
