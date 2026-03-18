import type { Metadata } from "next";
import localFont from "next/font/local";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import GlobalNav from "@/components/GlobalNav";
import TimeProvider from "@/components/TimeProvider";

/* ── Fonts ── */

const gtAlpina = localFont({
  src: [
    { path: "../fonts/gt-alpina/GT-Alpina-Standard-Light-Trial.otf", weight: "300", style: "normal" },
    { path: "../fonts/gt-alpina/GT-Alpina-Standard-Regular-Trial.otf", weight: "400", style: "normal" },
    { path: "../fonts/gt-alpina/GT-Alpina-Standard-Regular-Italic-Trial.otf", weight: "400", style: "italic" },
    { path: "../fonts/gt-alpina/GT-Alpina-Standard-Medium-Trial.otf", weight: "500", style: "normal" },
  ],
  variable: "--font-display",
  display: "swap",
});

const sohne = localFont({
  src: [
    { path: "../fonts/sohne/TestSohne-Leicht-BF663d89cd4952e.otf", weight: "300", style: "normal" },
    { path: "../fonts/sohne/TestSohne-Buch-BF663d89cd32e6a.otf", weight: "400", style: "normal" },
    { path: "../fonts/sohne/TestSohne-Kraftig-BF663d89cd37e26.otf", weight: "500", style: "normal" },
  ],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

/* ── Metadata ── */

export const metadata: Metadata = {
  metadataBase: new URL("https://hkjstudio.com"),
  title: {
    default: "HKJ — Ryan Jun",
    template: "%s | HKJ",
  },
  description:
    "Design engineering at the intersection of high-fidelity craft and deep systems thinking. Specializing in React Native, Next.js, and design systems.",
  openGraph: {
    title: "HKJ — Ryan Jun",
    description:
      "Design engineering at the intersection of high-fidelity craft and deep systems thinking.",
    url: "https://hkjstudio.com",
    siteName: "HKJ",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HKJ — Ryan Jun",
    description:
      "Design engineering at the intersection of high-fidelity craft and deep systems thinking.",
    creator: "@hyeonjunjun",
  },
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
        className={`${gtAlpina.variable} ${sohne.variable} ${jetbrainsMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <TimeProvider />
        <GlobalNav />

        {/* Grain overlay */}
        <div className="noise-grain" />

        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
