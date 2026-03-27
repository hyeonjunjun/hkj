import { PIECES } from "@/constants/pieces";
import { CoverGrid } from "@/components/CoverGrid";

export const metadata = {
  title: "Work",
};

export default function WorkPage() {
  const projects = PIECES.filter((p) => p.type === "project");
  return <CoverGrid pieces={projects} />;
}
