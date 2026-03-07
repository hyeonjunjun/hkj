import type { Metadata } from "next";
import { Inter, Geist, Geist_Mono, Silkscreen, DotGothic16 } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import CurtainPreloader from "@/components/CurtainPreloader";
import TacticalCursor from "@/components/TacticalCursor";
import GlobalNav from "@/components/GlobalNav";

/* ─── Typography ─── */

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
});

const geistSans = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-mono",
});

const silkscreen = Silkscreen({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-pixel",
});

const dotGothic = DotGothic16({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dot",
});

/* ─── Metadata ─── */

export const metadata: Metadata = {
  title: "HKJ Studio",
  description:
    "HKJ Studio — Portfolio of Ryan Jun. Design engineering at the intersection of high-fidelity craft and deep systems thinking.",
};

/* ─── Root Layout ─── */

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${geistSans.variable} ${geistMono.variable} ${silkscreen.variable} ${dotGothic.variable} antialiased bg-canvas text-ink`}
      >
        <CurtainPreloader />
        <TacticalCursor />
        <GlobalNav />

        {/* Layer 1: Sensor Grid Overlay */}
        <div className="fixed inset-0 pointer-events-none z-10 bg-sensor-grid mix-blend-overlay" />


        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
