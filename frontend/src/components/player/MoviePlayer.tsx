"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { MovieStream } from "@/types";

const ArtPlayer = dynamic(() => import("@/components/player/ArtPlayer"), {
  ssr: false,
  loading: () => (
    <div className="w-full aspect-video bg-[#0D0E14] flex flex-col items-center justify-center p-8 text-center animate-pulse">
      <div className="w-12 h-12 rounded-full bg-red-600/20 text-[#E50000] flex items-center justify-center mb-3">
        <span className="w-3.5 h-3.5 rounded-full bg-[#E50000] live-pulse" />
      </div>
      <p className="text-xs text-[#9EA3B0] font-bold">Loading Cinema Video Player...</p>
    </div>
  ),
});

import {
  Server,
  Zap,
  RotateCw,
  Film,
  AlertTriangle,
  Check,
  Globe,
  Radio,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

interface MoviePlayerProps {
  movieTitle: string;
  posterUrl?: string | null;
  backdropUrl?: string | null;
  streams: MovieStream[];
}

export default function MoviePlayer({
  movieTitle,
  posterUrl,
  backdropUrl,
  streams,
}: MoviePlayerProps) {
  // Filter out any legacy dummy/test streams so only genuine movie servers are rendered
  const validStreams = (streams || []).filter(
    (s) =>
      s?.stream_url &&
      !s.stream_url.includes("test-streams.mux.dev") &&
      !s.stream_url.includes("BigBuckBunny") &&
      !s.stream_url.includes("akamaized.net/hls/live/2000341")
  );

  // Hard blacklist of known ad-heavy, pop-up, or CAPTCHA-injecting embed hosts
  const TOXIC_AD_HOSTS = [
    "vidsrc.to",
    "multiembed",
    "2embed",
    "smashystream",
  ];

  const safeStreams = (validStreams.length > 0 ? validStreams : streams).filter(
    (s) => !TOXIC_AD_HOSTS.some((bad) => s.stream_url?.toLowerCase().includes(bad))
  );

  const availableStreams = safeStreams.length > 0 ? safeStreams : [
    {
      id: 9999,
      server_name: "VidLink VIP (Ad-Free)",
      stream_type: "embed" as const,
      stream_url: `https://vidlink.pro/movie/${movieTitle}`,
      quality: "1080p",
      priority: 1,
      is_embed: true,
    }
  ];

  const [selectedStreamIndex, setSelectedStreamIndex] = useState<number>(0);
  const [reloadKey, setReloadKey] = useState<number>(0);
  const [reportSent, setReportSent] = useState<boolean>(false);

  const activeStream: MovieStream | undefined = availableStreams[selectedStreamIndex] || availableStreams[0];

  const handleReload = () => {
    setReloadKey((prev) => prev + 1);
  };

  const handleReport = () => {
    setReportSent(true);
    setTimeout(() => setReportSent(false), 4000);
  };

  const isBdix = activeStream?.server_name?.toLowerCase().includes("bdix");

  // Helper to extract clean YouTube embed
  const getYouTubeEmbedUrl = (url: string): string => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = match && match[2].length === 11 ? match[2] : url;
    return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0&iv_load_policy=3&controls=1`;
  };

  // Helper to resolve stream URL (handles Google Drive proxy)
  const resolveStreamUrl = (stream?: MovieStream): string => {
    if (!stream?.stream_url) return "";
    const url = stream.stream_url.trim();

    if (stream.stream_type === "drive" || url.includes("drive.google.com")) {
      const match = url.match(/(?:file\/d\/|id=)([a-zA-Z0-9_-]{25,})/);
      const fileId = match ? match[1] : url;
      return `/api/v1/stream/drive/${fileId}`;
    }

    return stream.proxy_url || url;
  };

  const isYouTube =
    activeStream?.stream_type === "youtube" ||
    activeStream?.stream_url?.includes("youtube.com") ||
    activeStream?.stream_url?.includes("youtu.be");

  const isNative =
    !isYouTube &&
    (activeStream?.stream_type === "hls" ||
      activeStream?.stream_type === "mp4" ||
      activeStream?.stream_type === "direct" ||
      activeStream?.stream_type === "drive" ||
      (activeStream?.stream_url &&
        (activeStream.stream_url.includes(".m3u8") ||
          activeStream.stream_url.includes(".mp4") ||
          activeStream.stream_url.includes("/api/v1/stream"))));

  const isEmbed = !isYouTube && !isNative;

  return (
    <div className="space-y-4">
      {/* Video Viewport Container */}
      <div className="relative w-full aspect-video rounded-3xl overflow-hidden bg-black border border-white/10 shadow-2xl shadow-black/90">
        {activeStream ? (
          isYouTube ? (
            <div key={`${activeStream.stream_url}-${reloadKey}`} className="relative w-full h-full">
              <iframe
                src={getYouTubeEmbedUrl(activeStream.stream_url)}
                title={`${movieTitle} - ${activeStream.server_name}`}
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                referrerPolicy="strict-origin-when-cross-origin"
                className="w-full h-full border-0"
              />
            </div>
          ) : isEmbed ? (
            <div key={`${activeStream.stream_url}-${reloadKey}`} className="relative w-full h-full">
              <iframe
                src={activeStream.stream_url}
                title={`${movieTitle} - ${activeStream.server_name}`}
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                referrerPolicy="origin"
                className="w-full h-full border-0"
              />
            </div>
          ) : (
            <div key={`${activeStream.stream_url}-${reloadKey}`} className="w-full h-full">
              <ArtPlayer
                url={resolveStreamUrl(activeStream)}
                poster={backdropUrl || posterUrl || undefined}
                title={movieTitle}
                isLive={false}
                className="w-full h-full"
              />
            </div>
          )
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-[#666C7A]">
            <Film className="w-12 h-12 text-[#454B5E] animate-pulse" />
            <p className="text-sm">Connecting to media stream source...</p>
          </div>
        )}

        {/* Ambient Top Shadow Bar */}
        <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-black/80 to-transparent pointer-events-none" />

        {/* Active Source Tag */}
        {activeStream && (
          <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold backdrop-blur-md border shadow-md bg-black/60 border-white/10 text-zinc-200">
            {isBdix ? (
              <>
                <Radio className="w-3 h-3 text-emerald-400 live-pulse" />
                <span className="text-emerald-400">BDIX 10Gbps</span>
              </>
            ) : (
              <>
                <Globe className="w-3 h-3 text-blue-400" />
                <span>Cloud Multi-Server</span>
              </>
            )}
            <span className="text-zinc-500">•</span>
            <span>{activeStream.quality || "HD"}</span>
          </div>
        )}
      </div>

      {/* Server Switcher & Controls Bar */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-[#12141C] border border-white/[0.08] backdrop-blur-md space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Server Selector Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 hide-scrollbar flex-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#9EA3B0] px-1 shrink-0 uppercase tracking-wider">
              <Server className="w-3.5 h-3.5 text-[#E50000]" />
              <span>Servers:</span>
            </div>

            <div className="flex items-center gap-2">
              {availableStreams.map((stream, idx) => {
                const isActive = idx === selectedStreamIndex;
                const streamIsBdix = stream.server_name?.toLowerCase().includes("bdix");

                return (
                  <button
                    key={stream.id || idx}
                    type="button"
                    onClick={() => setSelectedStreamIndex(idx)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                      isActive
                        ? "bg-[#E50000] text-white shadow-md shadow-red-950/40 ring-1 ring-red-400"
                        : streamIsBdix
                        ? "bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-500/30"
                        : "bg-[#181A24] hover:bg-[#202330] text-[#E2E4E9] border border-white/[0.06]"
                    }`}
                  >
                    {streamIsBdix ? (
                      <Zap className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Globe className="w-3 h-3 text-blue-400" />
                    )}
                    <span>{stream.server_name || `Server ${idx + 1}`}</span>
                    {stream.quality && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/40 text-zinc-300">
                        {stream.quality}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reload & Report Buttons */}
          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <button
              type="button"
              onClick={handleReload}
              className="btn-screenbox-dark text-xs py-1.5 px-3 flex items-center gap-1.5"
              title="Reload current stream"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Reload</span>
            </button>

            <button
              type="button"
              onClick={handleReport}
              className="btn-screenbox-dark text-xs py-1.5 px-3 flex items-center gap-1.5 text-amber-400 hover:text-amber-300"
              title="Report playback problem"
            >
              {reportSent ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Reported</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Report</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Helper Banner */}
        {streams.length > 1 && (
          <div className="flex items-center justify-between text-[11px] text-[#8E95A5] pt-2 border-t border-white/[0.04]">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Having buffering or playback issues? Click other servers above for instant alternative stream.</span>
            </div>
            {selectedStreamIndex < streams.length - 1 && (
              <button
                type="button"
                onClick={() => setSelectedStreamIndex((prev) => (prev + 1) % streams.length)}
                className="text-red-400 hover:text-red-300 font-semibold flex items-center gap-0.5 cursor-pointer ml-2"
              >
                <span>Switch to next server</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
