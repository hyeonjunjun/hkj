import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import "./portfolio.css";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "blit reference / ryan jun",
  description: "blit-style first attempt — kept as negative-space reference.",
};

export default function BlitLayout({ children }: { children: React.ReactNode }) {
  return <div className={archivo.className}>{children}</div>;
}
