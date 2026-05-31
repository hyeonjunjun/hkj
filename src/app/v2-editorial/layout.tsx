import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import "./v2.css";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "800"],
  display: "swap",
  variable: "--archivo",
});

export const metadata: Metadata = {
  title: "editorial reference / ryan jun",
  description: "editorial-engineered first attempt — kept as negative-space reference.",
};

export default function V2EditorialLayout({ children }: { children: React.ReactNode }) {
  return <div className={archivo.variable}>{children}</div>;
}
