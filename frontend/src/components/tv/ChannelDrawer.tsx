"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Channel } from "@/types";
import { ChevronDown, ChevronUp, Radio, Search, Tv } from "lucide-react";

interface ChannelDrawerProps {
  channels: Channel[];
  currentSlug: string;
}

export default function ChannelDrawer({
  channels,
  currentSlug,
}: ChannelDrawerProps) {
  const [filterQuery, setFilterQuery] = useState("");

  const currentIndex = channels.findIndex((c) => c.slug === currentSlug);
  const prevChannel =
    currentIndex > 0 ? channels[currentIndex - 1] : channels[channels.length - 1];
  const nextChannel =
    currentIndex >= 0 && currentIndex < channels.length - 1
      ? channels[currentIndex + 1]
      : channels[0];

  const filtered = useMemo(() => {
    if (!filterQuery.trim()) return channels;
    const q = filterQuery.toLowerCase();
    return channels.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.category?.name.toLowerCase().includes(q)
    );
  }, [channels, filterQuery]);

  return (
    <div className="flex flex-col bg-zinc-900/80 rounded-2xl border border-zinc-800/80 p-4 backdrop-blur-md h-full">
      {/* Header with Quick Prev/Next Channel Controls */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <Tv className="w-4 h-4 text-red-500" />
          <h3 className="text-sm font-bold text-white">Channel Zapper</h3>
          <span className="text-xs text-zinc-500">({channels.length})</span>
        </div>

        {/* Remote Next/Prev Channel Buttons */}
        <div className="flex items-center gap-1">
          {prevChannel && (
            <Link
              href={`/tv/${prevChannel.slug}`}
              title={`Previous: ${prevChannel.name}`}
              className="p-1.5 rounded-lg bg-zinc-800 hover:bg-red-600 text-zinc-300 hover:text-white transition"
            >
              <ChevronUp className="w-4 h-4" />
            </Link>
          )}
          {nextChannel && (
            <Link
              href={`/tv/${nextChannel.slug}`}
              title={`Next: ${nextChannel.name}`}
              className="p-1.5 rounded-lg bg-zinc-800 hover:bg-red-600 text-zinc-300 hover:text-white transition"
            >
              <ChevronDown className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>

      {/* Mini Search Bar */}
      <div className="my-3 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
        <input
          type="text"
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
          placeholder="Filter channels..."
          className="w-full pl-8 pr-3 py-1.5 bg-zinc-950/80 rounded-lg border border-zinc-800 text-xs text-white placeholder-zinc-500 outline-none focus:border-red-500 transition"
        />
      </div>

      {/* Channel Scrollable List */}
      <div className="flex-1 overflow-y-auto space-y-1.5 max-h-[500px] pr-1">
        {filtered.map((channel, idx) => {
          const isActive = channel.slug === currentSlug;
          return (
            <Link
              key={channel.id || channel.slug}
              href={`/tv/${channel.slug}`}
              className={`flex items-center gap-3 p-2 rounded-xl transition cursor-pointer group ${
                isActive
                  ? "bg-red-600/20 border border-red-500/50 text-white shadow-inner"
                  : "bg-zinc-950/40 hover:bg-zinc-800/60 border border-transparent text-zinc-300 hover:text-white"
              }`}
            >
              {/* Channel Number */}
              <span className="text-[10px] font-bold text-zinc-500 w-5 text-center">
                {idx + 1}
              </span>

              {/* Logo / Icon */}
              <div className="w-8 h-8 rounded-lg bg-black/60 p-1 flex items-center justify-center border border-zinc-800/80 shrink-0">
                {channel.logo_url ? (
                  <Image
                    src={channel.logo_url}
                    alt={channel.name}
                    width={28}
                    height={28}
                    className="object-contain"
                    unoptimized
                  />
                ) : (
                  <Radio className="w-4 h-4 text-zinc-500" />
                )}
              </div>

              {/* Name & Details */}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold truncate group-hover:text-red-400 transition-colors">
                  {channel.name}
                </p>
                <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
                  {channel.category && <span>{channel.category.name}</span>}
                  {channel.country && <span>• {channel.country}</span>}
                </div>
              </div>

              {/* Active Indicator */}
              {isActive && (
                <span className="w-2 h-2 rounded-full bg-red-500 live-pulse shrink-0" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
