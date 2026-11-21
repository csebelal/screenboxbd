"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { PlatformSettings } from "@/types";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

interface GoogleAnalyticsProps {
  settings: PlatformSettings;
}

export default function GoogleAnalytics({ settings }: GoogleAnalyticsProps) {
  const pathname = usePathname();
  const isEnabled = settings?.google_analytics_enabled !== false;
  const customFooter = (settings?.custom_footer_scripts || "").trim();

  // Track client-side SPA route navigations in Google Analytics / GTM
  useEffect(() => {
    if (!isEnabled || !pathname) return;

    if (typeof window !== "undefined" && window.dataLayer) {
      window.dataLayer.push({
        event: "page_view",
        page_path: pathname,
        page_location: window.location.href,
        page_title: document.title,
      });
    }
  }, [pathname, isEnabled]);

  if (!isEnabled) {
    return null;
  }

  return (
    <>
      {/* Custom Footer / Body End Scripts (e.g., Live Chat Widgets) */}
      {customFooter && (
        <div
          id="custom-footer-scripts-container"
          dangerouslySetInnerHTML={{ __html: customFooter }}
        />
      )}
    </>
  );
}
