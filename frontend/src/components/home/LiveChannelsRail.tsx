"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Channel } from "@/types";
import { Tv, Play, ChevronRight, Radio } from "lucide-react";
import { getChannels } from "@/lib/api";

interface LiveChannelsRailProps {
  channels: Channel[];
  totalChannels?: number;
}

export default function LiveChannelsRail({ channels, totalChannels }: LiveChannelsRailProps) {
  const [dynamicTotal, setDynamicTotal] = useState<number>(totalChannels || channels.length);

  // Dynamically sync and keep channel count fresh
  useEffect(() => {
    if (totalChannels && totalChannels > 0) {
      setDynamicTotal(totalChannels);
    } else {
      getChannels({ per_page: 1 }).then((res) => {
        if (res?.meta?.total) {
          setDynamicTotal(res.meta.total);
        }
      });
    }
  }, [totalChannels]);

  // Take exactly 10 channels to fit on 1 single row
  const displayChannels = channels.slice(0, 10);

  return (
    <section className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-14 py-3 sm:py-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-3.5 sm:mb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-bold bg-red-600/10 text-red-500 border border-red-500/20 mb-1.5">
            <Radio className="w-3.5 h-3.5 live-pulse" />
            <span>24/7 LIVE BDIX BROADCASTS</span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">
            Live TV Channels
          </h2>
          <p className="text-xs sm:text-sm text-[#9EA3B0] mt-0.5">
            Bufferless high-definition IPTV streams with instant multi-server failover.
          </p>
        </div>

        <Link
          href="/tv"
          className="text-xs sm:text-sm font-bold text-white hover:text-red-400 bg-[#14161E] hover:bg-[#1C1F2B] border border-white/[0.08] hover:border-white/20 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl transition self-start sm:self-auto cursor-pointer flex items-center gap-1.5"
        >
          <span>All Channels ({dynamicTotal})</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Channels Grid: EXACTLY 10 CHANNELS IN 1 SINGLE ROW ON DESKTOP */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 xl:grid-cols-10 gap-2 sm:gap-2.5">
        {displayChannels.map((channel) => {
          return (
            <Link
              key={channel.id}
              href={`/tv/${channel.slug}`}
              className="group block screenbox-card p-1 sm:p-1.5 hover:border-red-600/50 hover:shadow-xl hover:shadow-red-950/20 transition-all duration-300 cursor-pointer relative overflow-hidden btn-tactile hover:scale-[1.02] active:scale-[0.98]"
            >
            {/* Thumbnail Box with LIVE Badge & Play Overlay */}
            <div className="relative aspect-video rounded-xl overflow-hidden bg-[#0D0E14] border border-white/[0.06] mb-1.5 flex items-center justify-center p-1">
              {/* Subtle Radial Glow Behind Logos */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.06)_0%,transparent_70%)] pointer-events-none" />

              {/* Pulsing Live Badge */}
              <div className="absolute top-1 left-1 z-10 flex items-center gap-1 bg-[#E50000] text-white text-[8px] sm:text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-md">
                <span className="w-1.5 h-1.5 rounded-full bg-white live-pulse" />
                <span>LIVE</span>
              </div>

              {/* Quality Badge */}
              <div className="absolute top-1 right-1 z-10">
                <span className="text-[8px] sm:text-[9px] font-black px-1 py-0.5 rounded bg-black/70 text-zinc-300 border border-white/10">
                  HD
                </span>
              </div>

              {channel.logo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={channel.logo_url}
                    alt={channel.name}
                    className="w-full h-full max-h-12 sm:max-h-14 lg:max-h-16 max-w-[88%] object-contain filter group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <Tv className="w-8 h-8 sm:w-9 sm:h-9 text-[#666C7A] group-hover:text-red-500 transition-colors" />
                )}

                {/* Hover Play Button */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-[#E50000] to-[#FF2E2E] flex items-center justify-center shadow-lg shadow-red-900/60 transform scale-75 group-hover:scale-100 transition-transform duration-200">
                    <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                  </div>
                </div>
              </div>

              {/* Channel Metadata */}
              <div className="text-center w-full px-0.5 pb-0.5">
                <h3
                  className="text-[11px] sm:text-xs font-bold text-white group-hover:text-red-500 transition-colors truncate"
                  title={channel.name}
                >
                  {channel.name}
                </h3>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
