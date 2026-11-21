import type { Metadata, Viewport } from "next";
import Navbar from "@/components/layout/Navbar";
import AnnouncementRibbon from "@/components/layout/AnnouncementRibbon";
import Footer from "@/components/layout/Footer";
import BackToTop from "@/components/layout/BackToTop";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import { getPlatformSettings } from "@/lib/api";
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getPlatformSettings();
  const enableSubscriptions = Boolean(settings?.enable_subscriptions);
  const isAnalyticsEnabled = settings?.google_analytics_enabled !== false;
  const gtmId = (settings?.google_tag_manager_id || "GTM-T4M9PSPK").trim();
  const gaId = (settings?.google_analytics_id || "").trim();
  const customHeader = (settings?.custom_header_scripts || "").trim();

  return (
    <html lang="en" className="dark">
      <head>
        {/* Google tag (gtag.js) - Immediately after <head> */}
        {isAnalyticsEnabled && gtmId && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtm.js?id=${gtmId}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer = window.dataLayer || [];\nfunction gtag(){dataLayer.push(arguments);}\ngtag('js', new Date());${gaId ? `\ngtag('config', '${gaId}');` : ""}`,
              }}
            />
          </>
        )}
      </head>
      <body className="min-h-screen bg-[#0B0C0E] text-white flex flex-col selection:bg-[#E50000] selection:text-white font-sans antialiased overflow-x-hidden">
        {/* Custom Header tracking if present */}
        {isAnalyticsEnabled && customHeader && (
          <div
            id="custom-header-scripts-container"
            style={{ display: "none" }}
            dangerouslySetInnerHTML={{ __html: customHeader }}
          />
        )}
        {/* Google Tag Manager (noscript) */}
        {isAnalyticsEnabled && gtmId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
              title="Google Tag Manager"
            />
          </noscript>
        )}
        <GoogleAnalytics settings={settings} />
        <AnnouncementRibbon />
        <Navbar enableSubscriptions={enableSubscriptions} />
        <main className="flex-1 w-full pb-16 md:pb-0">
          {children}
        </main>
        <Footer enableSubscriptions={enableSubscriptions} />
        <BackToTop />
        <MobileBottomNav enableSubscriptions={enableSubscriptions} />
      </body>
    </html>
  );
}
