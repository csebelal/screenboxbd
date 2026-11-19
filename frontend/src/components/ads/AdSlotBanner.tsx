"use client";

import { useEffect, useRef } from "react";
import { AdSlot } from "@/types";

interface AdSlotBannerProps {
  slot?: AdSlot | null;
  className?: string;
  fallbackLabel?: string;
}

export default function AdSlotBanner({
  slot,
  className = "",
  fallbackLabel,
}: AdSlotBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!slot || !containerRef.current) return;

    if (slot.ad_type === "html_code" || slot.ad_type === "google_adsense") {
      const container = containerRef.current;
      container.innerHTML = "";

      if (slot.code_content) {
        // Create a wrapper and parse script tags
        const range = document.createRange();
        range.selectNode(container);
        const documentFragment = range.createContextualFragment(slot.code_content);
        container.appendChild(documentFragment);
      }
    }
  }, [slot]);

  if (!slot) {
    if (fallbackLabel) {
      return (
        <div
          className={`flex items-center justify-center p-4 rounded-xl border border-dashed border-zinc-800 bg-zinc-950/40 text-xs text-zinc-600 ${className}`}
        >
          <span>{fallbackLabel}</span>
        </div>
      );
    }
    return null;
  }

  // 1. Image Banner with Affiliate / Sponsor Link
  if (slot.ad_type === "banner_image" && slot.banner_image_url) {
    const bannerContent = (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={slot.banner_image_url}
        alt={slot.title || "Sponsor Advertisement"}
        className="w-full h-auto max-h-32 object-contain rounded-xl hover:opacity-95 transition-opacity"
      />
    );

    return (
      <div className={`relative overflow-hidden flex justify-center items-center my-3 ${className}`}>
        {slot.target_url ? (
          <a
            href={slot.target_url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="w-full flex justify-center cursor-pointer group"
          >
            {bannerContent}
          </a>
        ) : (
          bannerContent
        )}
      </div>
    );
  }

  // 2. HTML / JavaScript Ad code
  return (
    <div
      ref={containerRef}
      className={`ad-container overflow-hidden flex justify-center items-center my-3 min-h-[50px] ${className}`}
    />
  );
}
