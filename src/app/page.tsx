import { ContactSheet } from "@/components/ContactSheet";
import { BottomBar } from "@/components/BottomBar";

export default function HomePage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 48px)", paddingTop: 48 }}>
      <ContactSheet />
      <BottomBar />
    </div>
  );
}
