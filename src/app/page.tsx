import Hero from "@/components/sections/Hero";
import Viewfinder from "@/components/sections/Viewfinder";
import About from "@/components/sections/About";
import Capabilities from "@/components/sections/Capabilities";
import Contact from "@/components/sections/Contact";
import Colophon from "@/components/sections/Colophon";

export default function Home() {
  return (
    <main>
      <Hero />
      <Viewfinder />
      <About />
      <Capabilities />
      <Contact />
      <Colophon />
    </main>
  );
}
