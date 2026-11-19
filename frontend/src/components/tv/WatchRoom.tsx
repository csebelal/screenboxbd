"use client";

import { useState, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Channel, ChannelStream } from "@/types";
import ArtPlayer from "@/components/player/ArtPlayer";
import ServerSelector from "@/components/player/ServerSelector";
import ChannelDrawer from "@/components/tv/ChannelDrawer";
import { Radio, Share2, Sparkles, Tv } from "lucide-react";

interface WatchRoomProps {
  channel: Channel;
  allChannels: Channel[];
}

export default function WatchRoom({ channel, allChannels }: WatchRoomProps) {
  const streams = useMemo(() => channel.streams || [], [channel.streams]);
  const primaryStream = streams[0] || null;

  // Selected stream URL
  const [currentStreamUrl, setCurrentStreamUrl] = useState<string>(
    primaryStream?.stream_url || ""
  );
  const [isUsingProxy, setIsUsingProxy] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Switch stream server
  const handleSelectStream = (stream: ChannelStream, useProxy: boolean) => {
    setIsUsingProxy(useProxy);
    setCurrentStreamUrl(useProxy ? stream.proxy_url : stream.stream_url);
  };

  // Automatic CORS failover handler
  const handleFallbackNeeded = useCallback(
    (failedUrl: string) => {
      console.warn("Direct stream failed. Attempting fallback to backend CORS proxy...", failedUrl);
      const matchingStream = streams.find((s) => s.stream_url === failedUrl) || streams[0];
      if (matchingStream && matchingStream.proxy_url && !isUsingProxy) {
        setIsUsingProxy(true);
        setCurrentStreamUrl(matchingStream.proxy_url);
      }
    },
    [streams, isUsingProxy]
  );

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Theater Player Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left Column: Player & Stream Info (3 Cols) */}
        <div className="lg:col-span-3 space-y-4">
          {/* Artplayer Container */}
          {currentStreamUrl ? (
            <ArtPlayer
              key={currentStreamUrl}
              url={currentStreamUrl}
              poster={channel.logo_url || undefined}
              title={channel.name}
              isLive={true}
              onFallbackNeeded={handleFallbackNeeded}
            />
          ) : (
            <div className="w-full aspect-video bg-black/80 rounded-xl flex flex-col items-center justify-center p-6 text-center border border-zinc-800">
              <Tv className="w-12 h-12 text-zinc-600 mb-2" />
              <h3 className="text-white font-bold text-lg">No Active Stream Available</h3>
              <p className="text-zinc-500 text-sm mt-1">This channel does not currently have active streams configured.</p>
            </div>
          )}

          {/* Server Selector Bar */}
          <ServerSelector
            streams={streams}
            currentStreamUrl={currentStreamUrl}
            isUsingProxy={isUsingProxy}
            onSelectStream={handleSelectStream}
          />

          {/* Channel Header Details */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-zinc-900/70 rounded-2xl border border-zinc-800/80 backdrop-blur-md">
            <div className="flex items-center gap-4">
              {/* Channel Logo */}
              <div className="w-14 h-14 rounded-2xl bg-black/70 p-2 flex items-center justify-center border border-zinc-800 shrink-0">
                {channel.logo_url ? (
                  <Image
                    src={channel.logo_url}
                    alt={channel.name}
                    width={48}
                    height={48}
                    className="object-contain"
                    unoptimized
                  />
                ) : (
                  <Radio className="w-6 h-6 text-zinc-400" />
                )}
              </div>

              {/* Title & Metadata */}
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-black text-white">{channel.name}</h1>
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-600/20 text-red-400 border border-red-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 live-pulse" />
                    LIVE
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-zinc-400">
                  {channel.category && (
                    <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300">
                      {channel.category.name}
                    </span>
                  )}
                  {channel.country && (
                    <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300">
                      {channel.country === "BD" ? "🇧🇩 Bangladesh" : channel.country}
                    </span>
                  )}
                  {isUsingProxy && (
                    <span className="px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-400 border border-emerald-800 text-[11px]">
                      Protected by StreamTV CORS Proxy
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Share / Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 transition cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copied ? "Link Copied!" : "Share Channel"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Quick Channel Zapper Drawer (1 Col) */}
        <div className="lg:col-span-1">
          <ChannelDrawer channels={allChannels} currentSlug={channel.slug} />
        </div>
      </div>

      {/* Recommended / More Live Channels Section */}
      <div className="pt-8 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-red-500" />
            <h2 className="text-base font-bold text-white">More Live Channels</h2>
          </div>
          <Link
            href="/"
            className="text-xs font-semibold text-red-400 hover:text-red-300 transition"
          >
            View All &rarr;
          </Link>
        </div>

        {/* Horizontal Mini Carousel */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {allChannels
            .filter((c) => c.slug !== channel.slug)
            .slice(0, 6)
            .map((recChannel) => (
              <Link
                key={recChannel.id}
                href={`/tv/${recChannel.slug}`}
                className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900/60 hover:bg-zinc-800/80 border border-zinc-800/80 hover:border-red-500/40 transition group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-lg bg-black/60 p-1 flex items-center justify-center shrink-0 border border-zinc-800">
                  {recChannel.logo_url ? (
                    <Image
                      src={recChannel.logo_url}
                      alt={recChannel.name}
                      width={32}
                      height={32}
                      className="object-contain"
                      unoptimized
                    />
                  ) : (
                    <Radio className="w-4 h-4 text-zinc-500" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate group-hover:text-red-400 transition-colors">
                    {recChannel.name}
                  </p>
                  <p className="text-[10px] text-zinc-500 truncate">
                    {recChannel.category?.name || "Live TV"}
                  </p>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
