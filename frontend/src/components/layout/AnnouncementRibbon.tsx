"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, X, ChevronRight } from "lucide-react";

export default function AnnouncementRibbon() {
  const [visible, setVisible] = useState(true);
  const [data, setData] = useState<{
    active: boolean;
    text: string;
    link: string;
    color: string;
  }>({
    active: true,
    text: "🔥 নতুন আপডেট: BDIX 4K সার্ভার যুক্ত হয়েছে! কোনো প্রকার বাফারিং ছাড়াই সমস্ত খেলা ও মুভি উপভোগ করুন।",
    link: "/subscriptions",
    color: "emerald",
  });

  useEffect(() => {
    async function fetchBanner() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";
        const res = await fetch(`${apiUrl}/settings`);
        if (res.ok) {
          const json = await res.json();
          if (json.data) {
            setData({
              active: Boolean(json.data.announcement_active),
              text: json.data.announcement_text || "",
              link: json.data.announcement_link || "/subscriptions",
              color: json.data.announcement_color || "emerald",
            });
          }
        }
      } catch {
        // Fallback
      }
    }
    fetchBanner();
  }, []);

  if (!visible || !data.active || !data.text) return null;

  return (
    <aside aria-label="Announcement" className="relative z-50 w-full bg-gradient-to-r from-emerald-950/90 via-zinc-950 to-emerald-950/90 border-b border-emerald-500/20 text-xs py-2 px-4 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <Link
          href={data.link}
          className="flex-1 flex items-center justify-center gap-2 text-zinc-200 hover:text-white transition group text-center"
        >
          <span className="inline-flex items-center gap-1 rounded bg-emerald-500/20 px-2 py-0.5 text-[11px] font-semibold text-emerald-400 ring-1 ring-inset ring-emerald-500/30">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            LIVE
          </span>
          <span className="font-medium truncate max-w-xl sm:max-w-3xl">
            {data.text}
          </span>
          <span className="hidden sm:inline-flex items-center text-emerald-400 font-semibold group-hover:translate-x-0.5 transition">
            Details <ChevronRight className="w-3 h-3 ml-0.5" />
          </span>
        </Link>
        <button
          type="button"
          onClick={() => setVisible(false)}
          className="shrink-0 p-1 text-zinc-400 hover:text-white transition rounded-md hover:bg-white/10"
          aria-label="Close Announcement"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
}
