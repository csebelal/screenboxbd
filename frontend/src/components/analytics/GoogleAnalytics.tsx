"use client";

import React, { useEffect } from "react";
import Script from "next/script";
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

  // If tracking is explicitly disabled in the Admin Panel, do not load any scripts
  const isEnabled = settings?.google_analytics_enabled !== false;
  const gtmId = (settings?.google_tag_manager_id || "GTM-T4M9PSPK").trim();
  const gaId = (settings?.google_analytics_id || "").trim();
  const customHeader = (settings?.custom_header_scripts || "").trim();
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
      {/* 1. Google Tag Manager (GTM) Primary Container */}
      {gtmId && (
        <>
          {/* Main GTM Script as specified */}
          <Script
            id="gtm-script"
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtmId)}`}
          />

          {/* GTM dataLayer and gtag initialization */}
          <Script
            id="gtm-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                ${gaId ? `gtag('config', '${gaId}');` : ""}
              `,
            }}
          />

          {/* Fallback for noscript environments */}
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${encodeURIComponent(gtmId)}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
              title="Google Tag Manager"
            />
          </noscript>
        </>
      )}

      {/* 2. Standalone Google Analytics (GA4) if only GA ID is provided without GTM */}
      {!gtmId && gaId && (
        <>
          <Script
            id="ga4-script"
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`}
          />
          <Script
            id="ga4-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `,
            }}
          />
        </>
      )}

      {/* 3. Custom Header Tracking Scripts (e.g., Facebook Pixel, Ad Networks) */}
      {customHeader && (
        <div
          id="custom-header-scripts-container"
          dangerouslySetInnerHTML={{ __html: customHeader }}
        />
      )}

      {/* 4. Custom Footer / Body End Scripts (e.g., Live Chat Widgets) */}
      {customFooter && (
        <div
          id="custom-footer-scripts-container"
          dangerouslySetInnerHTML={{ __html: customFooter }}
        />
      )}
    </>
  );
}
