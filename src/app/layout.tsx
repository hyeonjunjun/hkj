import type { Metadata } from "next";
import { Space_Mono, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import CurtainPreloader from "@/components/CurtainPreloader";
import Cursor from "@/components/Cursor";
import GlobalNav from "@/components/GlobalNav";
import TransitionOverlay from "@/components/TransitionOverlay";
import GlobalCanvas from "@/components/webgl/GlobalCanvas";

/* ── Typography ── */

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-mono",
});

const ibmPlex = IBM_Plex_Sans({
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-ibm-plex",
});

/* ── Metadata ── */

export const metadata: Metadata = {
  title: {
    default: "HKJ Studio — Ryan Jun",
    template: "%s | HKJ Studio",
  },
  description:
    "Design engineering at the intersection of high-fidelity craft and deep systems thinking.",
};

/* ── Root Layout ── */

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${spaceMono.variable} ${ibmPlex.variable} antialiased`}
        style={{
          backgroundColor: "var(--color-bg)",
          color: "var(--color-text)",
        }}
      >
        <CurtainPreloader />
        <Cursor />
        <GlobalNav />
        <TransitionOverlay />

        {/* Global WebGL Context */}
        <GlobalCanvas />

        {/* Tape Noise Overlay */}
        <div
          className="fixed inset-0 pointer-events-none z-10 opacity-[0.03] mix-blend-overlay film-grain"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
          }}
        />

        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
