import type { Metadata } from "next";
import { Inter_Tight, Instrument_Sans } from "next/font/google";
import localFont from "next/font/local";
import SmoothScroll from "@/components/SmoothScroll";
import "./globals.css";

const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

/**
 * The site's one working face. 500 is loaded because it is the hinge of
 * the whole type system — under the single-size scale a heading differs
 * from its own content by weight alone, so 500 has to be a real cut
 * rather than something the browser synthesizes.
 */
const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-instrument-sans",
  display: "swap",
});

/**
 * Windswept's structural-header display face — used only by the
 * landing page's Wordmark (hero variant) and ThesisStatement, not the
 * project's default sans (Inter Tight, --font-sans). Self-hosted since
 * General Sans isn't on Google Fonts.
 */
const generalSans = localFont({
  src: [
    { path: "../fonts/general-sans/GeneralSans-Regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/general-sans/GeneralSans-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ryan jun",
  description:
    "I'm an aspiring creative director & designer based in New York.",
  authors: [{ name: "Ryan Jun" }],
  creator: "Ryan Jun",
  openGraph: {
    title: "ryan jun",
    description: "Aspiring creative director & designer",
    type: "profile",
    url: "https://hkjstudio.com",
    siteName: "ryan jun's portfolio",
    firstName: "ryan",
    lastName: "jun",
  },
  twitter: {
    card: "summary_large_image",
    title: "ryan jun",
    description: "Aspiring creative director & designer",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${interTight.variable} ${generalSans.variable} ${instrumentSans.variable}`}
    >
      {/* font-instrument-sans + text-value as the document default: the
          site has exactly one face and one size, so nothing below should
          have to restate either. Previously this was font-sans (Inter
          Tight) + text-ink, which is how a third black and a second
          typeface were leaking onto pages that never asked for them. */}
      <body className="bg-ws-paper font-instrument-sans text-value text-ws-ink antialiased">
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
