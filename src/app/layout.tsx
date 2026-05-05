import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { Newsreader } from "next/font/google";
import "./globals.css";
import RouteAnnouncer from "@/components/RouteAnnouncer";
import Frame from "@/components/Frame";
import PaperGrain from "@/components/PaperGrain";
import ThemeInit from "@/components/ThemeInit";

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://hkjstudio.com"),
  title: { default: "Ryan Jun", template: "%s / Ryan Jun" },
  description: "Ryan Jun — designer and engineer, New York.",
  openGraph: {
    title: "Ryan Jun",
    description: "Designer and engineer, New York.",
    url: "https://hkjstudio.com",
    siteName: "Ryan Jun",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ryan Jun",
    description: "Designer and engineer, New York.",
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
        <Frame />
        <a href="#main" className="skip-to-content">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
