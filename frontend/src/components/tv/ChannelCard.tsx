"use client";

import { useState } from "react";
import Link from "next/link";
import { Channel } from "@/types";
import { Play, Radio, Signal } from "lucide-react";

interface ChannelCardProps {
  channel: Channel;
}

export default function ChannelCard({ channel }: ChannelCardProps) {
  const [imageError, setImageError] = useState(false);

  const getInitials = (name: string) => {
    return (
      name
        .replace(/[^a-zA-Z0-9 ]/g, "")
        .trim()
        .split(" ")
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("") || "TV"
    );
  };

  const streamCount = channel.streams?.length || 1;

  return (
    <Link
      href={`/tv/${channel.slug}`}
      className="group relative flex flex-col bg-zinc-900/80 hover:bg-zinc-800/90 rounded-2xl p-3 sm:p-4 border border-zinc-800/90 hover:border-red-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-red-600/10 cursor-pointer overflow-hidden"
    >
      {/* Top badges: Category & Live Indicator */}
      <div className="flex items-center justify-between gap-2 mb-2.5 z-10">
        <div className="flex items-center gap-1.5">
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-600/20 text-red-400 border border-red-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 live-pulse" />
            LIVE
          </span>
          {channel.country && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-zinc-800 text-zinc-400 border border-zinc-700">
              {channel.country}
            </span>
          )}
        </div>

        {channel.category && (
          <span className="text-[11px] font-medium text-zinc-400 truncate max-w-[90px]">
            {channel.category.name}
          </span>
        )}
      </div>

      {/* Channel Logo / Visual Area with safe inline styling */}
      <div
        className="channel-logo-container relative w-full rounded-xl bg-black/60 border border-zinc-800/80 group-hover:border-zinc-700 transition overflow-hidden"
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "16 / 10",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {channel.logo_url && !imageError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={channel.logo_url}
            alt={channel.name}
            className="max-w-[85%] max-h-[85%] object-contain group-hover:scale-105 transition-transform duration-300 pointer-events-none"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center rounded-lg bg-gradient-to-br from-zinc-800 to-zinc-950 p-2 text-center">
            <Radio className="w-8 h-8 text-zinc-600 mb-1 group-hover:text-red-500 transition-colors" />
            <span className="text-xs font-bold text-zinc-300">
              {getInitials(channel.name)}
            </span>
          </div>
        )}

        {/* Play Icon Overlay on Hover */}
        <div className="absolute inset-0 bg-red-600/30 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <div className="w-11 h-11 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-700/50 transform scale-75 group-hover:scale-100 transition-transform">
            <Play className="w-5 h-5 fill-white ml-0.5" />
          </div>
        </div>
      </div>

      {/* Channel Title & Stream info */}
      <div className="mt-3 flex items-center justify-between">
        <h3 className="text-sm font-bold text-white group-hover:text-red-400 transition-colors truncate">
          {channel.name}
        </h3>
        <div className="flex items-center gap-1 text-[11px] text-zinc-500 font-medium shrink-0">
          <Signal className="w-3 h-3 text-emerald-400" />
          <span>{streamCount} {streamCount > 1 ? "streams" : "stream"}</span>
        </div>
      </div>
    </Link>
  );
}
