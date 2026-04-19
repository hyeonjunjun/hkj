import type { Metadata } from "next";
import localFont from "next/font/local";
import { Newsreader, Caveat } from "next/font/google";
import "./globals.css";
import RouteAnnouncer from "@/components/RouteAnnouncer";
import SmoothScroll from "@/components/SmoothScroll";
import NavCoordinates from "@/components/NavCoordinates";
import PageTransition from "@/components/PageTransition";
import Reticle from "@/components/Reticle";
import SystemBar from "@/components/SystemBar";
import ColophonOverlay from "@/components/ColophonOverlay";
import Environment from "@/components/Environment";

const generalSans = localFont({
  src: "../fonts/general-sans/GeneralSans-Variable.woff2",
  variable: "--font-sans",
  weight: "200 700",
  display: "swap",
  preload: true,
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

const fragmentMono = localFont({
  src: "../fonts/fragment-mono/FragmentMono-Regular.woff2",
  variable: "--font-fragment",
  weight: "400",
  display: "swap",
  preload: true,
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-hand",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://hkjstudio.com"),
  title: { default: "Hyeonjoon", template: "%s — Hyeonjoon" },
  description:
    "Hyeonjoon — design engineer based in New York. Building brands, interfaces, and atmospheres.",
  openGraph: {
    title: "Hyeonjoon — design engineer, New York",
    description:
      "Hyeonjoon — design engineer based in New York. Building brands, interfaces, and atmospheres.",
    url: "https://hkjstudio.com",
    siteName: "Hyeonjoon",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hyeonjoon — design engineer, New York",
    description:
      "Hyeonjoon — design engineer based in New York. Building brands, interfaces, and atmospheres.",
    creator: "@hyeonjunjun",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${generalSans.variable} ${newsreader.variable} ${fragmentMono.variable} ${caveat.variable}`}
      >
        <Environment />
        <RouteAnnouncer />
        <SmoothScroll />
        <NavCoordinates />
        <Reticle />
        <SystemBar />
        <ColophonOverlay />
        <a href="#main" className="skip-to-content">
          Skip to content
        </a>
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  );
}
