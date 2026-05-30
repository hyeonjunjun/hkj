import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import "./portfolio.css";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "v2 / ryan jun",
  description: "single-page portfolio — european editorial register.",
};

export default function V2Layout({ children }: { children: React.ReactNode }) {
  return <div className={archivo.className}>{children}</div>;
}
