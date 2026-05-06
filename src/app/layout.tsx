import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import RouteAnnouncer from "@/components/RouteAnnouncer";
import Frame from "@/components/Frame";

export const metadata: Metadata = {
  metadataBase: new URL("https://hkjstudio.com"),
  title: { default: "Hyeonjoon Jun", template: "%s / Hyeonjoon Jun" },
  description: "Hyeonjoon Jun — design engineer, New York.",
  openGraph: {
    title: "Hyeonjoon Jun",
    description: "Design engineer, New York.",
    url: "https://hkjstudio.com",
    siteName: "Hyeonjoon Jun",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hyeonjoon Jun",
    description: "Design engineer, New York.",
    creator: "@hyeonjunjun",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${GeistSans.variable} ${GeistMono.variable}`}>
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
