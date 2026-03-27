import { PIECES } from "@/constants/pieces";
import { CoverGrid } from "@/components/CoverGrid";

export const metadata = {
  title: "Lab",
};

export default function LabPage() {
  const experiments = PIECES.filter((p) => p.type === "experiment");
  return <CoverGrid pieces={experiments} />;
}
