import type { Metadata, Viewport } from "next";
import Navbar from "@/components/layout/Navbar";
import AnnouncementRibbon from "@/components/layout/AnnouncementRibbon";
import Footer from "@/components/layout/Footer";
import BackToTop from "@/components/layout/BackToTop";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#0B0C0E",
};

export const metadata: Metadata = {
  title: "ScreenBoxBD - Premium BDIX Cinema & Live TV Streaming",
  description:
    "ScreenBoxBD is Bangladesh's premier OTT streaming platform for watching your favorite blockbusters, TV shows, and bufferless 1080p Live TV channels on demand with BDIX ultra speed.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#0B0C0E] text-white flex flex-col selection:bg-[#E50000] selection:text-white font-sans antialiased overflow-x-hidden">
        <AnnouncementRibbon />
        <Navbar />
        <main className="flex-1 w-full pb-16 md:pb-0">
          {children}
        </main>
        <Footer />
        <BackToTop />
        <MobileBottomNav />
      </body>
    </html>
  );
}
