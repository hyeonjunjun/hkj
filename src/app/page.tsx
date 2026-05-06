import { PIECES } from "@/constants/pieces";
import HomeView from "@/components/HomeView";

/**
 * / — homepage. The catalog is the home; HomeView orchestrates
 * Grid ↔ List switching and the Row Type composition (§05).
 * The Footer renders inside HomeView so layout padding stays in
 * a single source of truth.
 */
export default function Home() {
  return <HomeView pieces={PIECES} />;
}
