import HeroSection from "@/components/HeroSection";
import ProjectSection from "@/components/ProjectSection";
import Footer from "@/components/Footer";
import { PIECES } from "@/constants/pieces";

const allPieces = [...PIECES].sort((a, b) => a.order - b.order);

export default function Home() {
  return (
    <main id="main">
      <HeroSection />

      <div className="flex flex-col gap-[clamp(20vh,35vh,40vh)]">
        {allPieces.map((piece, i) => (
          <ProjectSection key={piece.slug} piece={piece} index={i} />
        ))}
      </div>

      <div className="px-[clamp(24px,6vw,48px)] mt-[20vh]">
        <Footer />
      </div>
    </main>
  );
}
