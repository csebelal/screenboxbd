"use client";

import { useState } from "react";
import { Share2, Copy, Check } from "lucide-react";

interface BlogShareButtonsProps {
  title: string;
  url?: string;
}

export default function BlogShareButtons({ title }: BlogShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const getFullUrl = () => {
    if (typeof window !== "undefined") {
      return window.location.href;
    }
    return "";
  };

  const handleCopyLink = async () => {
    const url = getFullUrl();
    if (url) {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title,
          url: getFullUrl(),
        });
      } catch {
        // User cancelled or unsupported
      }
    } else {
      handleCopyLink();
    }
  };

  const shareLinks = [
    {
      name: "Twitter / X",
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        title
      )}&url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`,
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      hoverClass: "hover:bg-white hover:text-black",
    },
    {
      name: "WhatsApp",
      href: `https://api.whatsapp.com/send?text=${encodeURIComponent(
        `${title} - ` + (typeof window !== "undefined" ? window.location.href : "")
      )}`,
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
        </svg>
      ),
      hoverClass: "hover:bg-emerald-600 hover:text-white",
    },
    {
      name: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        typeof window !== "undefined" ? window.location.href : ""
      )}`,
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.6 5H18V0h-3.808C10.597 0 9 1.583 9 4.615V8z" />
        </svg>
      ),
      hoverClass: "hover:bg-blue-600 hover:text-white",
    },
  ];

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold text-[#9EA3B0] hidden sm:inline mr-1">
        Share:
      </span>

      {/* Copy Link Button with dynamic feedback */}
      <button
        type="button"
        onClick={handleCopyLink}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
          copied
            ? "bg-emerald-950/50 border-emerald-500/50 text-emerald-400"
            : "bg-[#14161E] border-white/[0.08] text-[#9EA3B0] hover:text-white hover:border-white/20"
        }`}
        title="Copy article link"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>Copied!</span>
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Copy Link</span>
          </>
        )}
      </button>

      {/* Social Buttons */}
      {shareLinks.map((item) => (
        <a
          key={item.name}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share on ${item.name}`}
          className={`w-8 h-8 rounded-xl bg-[#14161E] border border-white/[0.08] text-[#9EA3B0] flex items-center justify-center transition-all ${item.hoverClass}`}
        >
          {item.icon}
        </a>
      ))}

      {/* Mobile Native Share */}
      <button
        type="button"
        onClick={handleNativeShare}
        className="sm:hidden w-8 h-8 rounded-xl bg-[#14161E] border border-white/[0.08] text-[#9EA3B0] hover:text-white flex items-center justify-center transition-all"
        title="Share"
      >
        <Share2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
