import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import AnnouncementRibbon from "@/components/layout/AnnouncementRibbon";
import Footer from "@/components/layout/Footer";
import BackToTop from "@/components/layout/BackToTop";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-manrope",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "ScreenBoxBD - Premium BDIX Cinema & Live TV Streaming",
  description:
    "ScreenBoxBD is Bangladesh's premier OTT streaming platform for watching your favorite blockbusters, TV shows, and bufferless 1080p Live TV channels on demand with BDIX ultra speed.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${manrope.variable} ${spaceGrotesk.variable}`}>
      <body className="min-h-screen bg-[#0B0C0E] text-white flex flex-col selection:bg-[#E50000] selection:text-white font-sans antialiased">
        <AnnouncementRibbon />
        <Navbar />
        <main className="flex-1 w-full">
          {children}
        </main>
        <Footer />
        <BackToTop />
      </body>
    </html>
  );
}
