import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";
import localFont from "next/font/local";
import SmoothScroll from "@/components/SmoothScroll";
import ViewTransitions from "@/components/ViewTransitions";
import "./globals.css";

/**
 * The site's one working face. 500 is loaded because it is the hinge of
 * the whole type system — under the single-size scale a heading differs
 * from its own content by weight alone, so 500 has to be a real cut
 * rather than something the browser synthesizes.
 */
const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-instrument-sans",
  display: "swap",
});

/**
 * Switzer — the whole family in two variable files, 100-900 roman and
 * 100-900 italic, 43KB + 33KB. Free for commercial use under the ITF
 * Free Font License; self-hosted from Fontshare's CDN rather than linked,
 * so there is no third-party request at runtime.
 *
 * This is the face ethanandtom.com sets its nav in (Switzer 10.8px/600).
 * Loaded and ready but NOT yet the site default — flipping it is a
 * one-word change on <body> below, from font-instrument-sans to
 * font-switzer.
 *
 * Being variable, every weight is real: the single-size type system
 * leans entirely on weight, so nothing here is ever synthesized.
 */
const switzer = localFont({
  src: [
    { path: "../fonts/switzer/Switzer-Variable.woff2", weight: "100 900", style: "normal" },
    { path: "../fonts/switzer/Switzer-VariableItalic.woff2", weight: "100 900", style: "italic" },
  ],
  variable: "--font-switzer",
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
      className={`${generalSans.variable} ${instrumentSans.variable} ${switzer.variable}`}
    >
      {/* One face, one size, set once: the site has exactly one of each,
          so nothing below restates them. This was Inter Tight plus the
          old --ink token, which is how a second typeface and a third
          black leaked onto pages that never asked for either. */}
      <body className="bg-ws-paper font-instrument-sans text-value text-ws-ink antialiased">
        <SmoothScroll />
        <ViewTransitions />
        {children}
      </body>
    </html>
  );
}
