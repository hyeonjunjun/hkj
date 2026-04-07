import HeroSection from "@/components/HeroSection";
import ProjectSection from "@/components/ProjectSection";
import Footer from "@/components/Footer";
import { PIECES } from "@/constants/pieces";

const allPieces = [...PIECES].sort((a, b) => a.order - b.order);

export default function Home() {
  return (
    <main id="main">
      <HeroSection />

      <div className="flex flex-col" style={{ gap: "clamp(120px, 20vh, 200px)" }}>
        {allPieces.map((piece, i) => (
          <ProjectSection key={piece.slug} piece={piece} index={i} />
        ))}
      </div>

      <div className="px-[clamp(32px,8vw,96px)]" style={{ marginTop: "clamp(120px, 15vh, 200px)" }}>
        <Footer />
      </div>
    </main>
  );
}
