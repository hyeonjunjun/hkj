import type { Metadata } from "next";
import localFont from "next/font/local";
import { Newsreader } from "next/font/google";
import "./globals.css";
import RouteAnnouncer from "@/components/RouteAnnouncer";
import SmoothScroll from "@/components/SmoothScroll";
import NavCoordinates from "@/components/NavCoordinates";
import PageTransition from "@/components/PageTransition";

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

export const metadata: Metadata = {
  metadataBase: new URL("https://hkjstudio.com"),
  title: { default: "HKJ", template: "%s — HKJ" },
  description:
    "Design engineering at the intersection of craft and systems thinking.",
  openGraph: {
    title: "HKJ",
    description:
      "Design engineering at the intersection of craft and systems thinking.",
    url: "https://hkjstudio.com",
    siteName: "HKJ",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HKJ",
    description:
      "Design engineering at the intersection of craft and systems thinking.",
    creator: "@hyeonjunjun",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${generalSans.variable} ${newsreader.variable} ${fragmentMono.variable}`}
      >
        <RouteAnnouncer />
        <SmoothScroll />
        <NavCoordinates />
        <a href="#main" className="skip-to-content">
          Skip to content
        </a>
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  );
}
