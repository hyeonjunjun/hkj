import HeroSanctuary from "@/components/sections/HeroSanctuary";
import IntroStatement from "@/components/sections/IntroStatement";
import PullQuote from "@/components/sections/PullQuote";
import WorkOverview from "@/components/sections/WorkOverview";
import Colophon from "@/components/sections/Colophon";
import StickyNav from "@/components/StickyNav";

export default function Home() {
  return (
    <main>
      <StickyNav />
      <HeroSanctuary />
      <IntroStatement />
      <PullQuote />
      <WorkOverview />
      <Colophon />
    </main>
  );
}
