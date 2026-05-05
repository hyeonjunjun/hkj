import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { Newsreader } from "next/font/google";
import "./globals.css";
import RouteAnnouncer from "@/components/RouteAnnouncer";
import NavCoordinates from "@/components/NavCoordinates";
import PaperGrain from "@/components/PaperGrain";
import ThemeInit from "@/components/ThemeInit";
import CursorReadout from "@/components/CursorReadout";
import StatusReadout from "@/components/StatusReadout";

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://hkjstudio.com"),
  title: { default: "Hyeonjoon Jun", template: "%s / Hyeonjoon Jun" },
  description:
    "Hyeonjoon Jun — design engineer, New York. Work from the studio.",
  openGraph: {
    title: "Hyeonjoon Jun — design engineer, New York",
    description: "Work from the studio.",
    url: "https://hkjstudio.com",
    siteName: "Hyeonjoon Jun",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hyeonjoon Jun — design engineer, New York",
    description: "Work from the studio.",
    creator: "@hyeonjunjun",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${GeistSans.variable} ${newsreader.variable}`}>
        <ThemeInit />
        <PaperGrain />
        <RouteAnnouncer />
        <NavCoordinates />
        <StatusReadout />
        <CursorReadout />
        <a href="#main" className="skip-to-content">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
