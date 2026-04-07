import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import RouteAnnouncer from "@/components/RouteAnnouncer";
import Cursor from "@/components/Cursor";

const switzer = localFont({
  src: "../fonts/switzer/Switzer-Variable.woff2",
  variable: "--font-sans",
  weight: "100 900",
  display: "swap",
  preload: true,
});

const gambetta = localFont({
  src: "../fonts/gambetta/Gambetta-Variable.woff2",
  variable: "--font-serif",
  weight: "300 700",
  display: "swap",
  preload: true,
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
        className={`${switzer.variable} ${gambetta.variable} ${fragmentMono.variable}`}
      >
        <RouteAnnouncer />
        <Cursor />
        <a href="#main" className="skip-to-content">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
