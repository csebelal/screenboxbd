"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Series, Season, Episode, EpisodeStream } from "@/types";

const ArtPlayer = dynamic(() => import("@/components/player/ArtPlayer"), {
  ssr: false,
  loading: () => (
    <div className="w-full aspect-video bg-[#0D0E14] flex flex-col items-center justify-center p-8 text-center animate-pulse">
      <div className="w-12 h-12 rounded-full bg-red-600/20 text-[#E50000] flex items-center justify-center mb-3">
        <span className="w-3.5 h-3.5 rounded-full bg-[#E50000] live-pulse" />
      </div>
      <p className="text-xs text-[#9EA3B0] font-bold">Loading Series Player...</p>
    </div>
  ),
});

import {
  Server,
  Zap,
  RotateCw,
  Film,
  Play,
  Globe,
  Clock,
  Layers,
  ShieldCheck,
} from "lucide-react";

interface SeriesPlayerProps {
  series: Series;
}

export default function SeriesPlayer({ series }: SeriesPlayerProps) {
  const seasons = series.seasons || [];
  const initialSeason = seasons[0] || null;
  const initialEpisode = initialSeason?.episodes?.[0] || null;

  const [activeSeasonNumber, setActiveSeasonNumber] = useState<number>(
    initialSeason?.season_number || 1
  );
  const [activeEpisodeNumber, setActiveEpisodeNumber] = useState<number>(
    initialEpisode?.episode_number || 1
  );
  const [selectedServerIndex, setSelectedServerIndex] = useState<number>(0);
  const [reloadKey, setReloadKey] = useState<number>(0);
  const [failoverNotice, setFailoverNotice] = useState<string | null>(null);

  const handleServerFailover = () => {
    if (selectedServerIndex < streams.length - 1) {
      const nextIndex = selectedServerIndex + 1;
      const nextServer = streams[nextIndex];
      setSelectedServerIndex(nextIndex);
      setFailoverNotice(`Server unreachable on your ISP. Auto-switched to ${nextServer.server_name}`);
      setTimeout(() => setFailoverNotice(null), 5000);
    }
  };

  const currentSeason: Season | undefined =
    seasons.find((s) => s.season_number === activeSeasonNumber) || seasons[0];

  const episodes = currentSeason?.episodes || [];
  const currentEpisode: Episode | undefined =
    episodes.find((e) => e.episode_number === activeEpisodeNumber) || episodes[0];

  // Resolve episode stream servers (Clean, fast, ad-free embed sources)
  const tmdbId = series.tmdb_id;
  const defaultEmbedStreams: EpisodeStream[] = [
    {
      id: 2001,
      server_name: "VidLink VIP (Ad-Free)",
      stream_type: "embed",
      stream_url: `https://vidlink.pro/tv/${tmdbId}/${activeSeasonNumber}/${activeEpisodeNumber}`,
      quality: "1080p",
      priority: 10,
      is_embed: true,
    },
    {
      id: 2002,
      server_name: "Embed.su (Multi-Source)",
      stream_type: "embed",
      stream_url: `https://embed.su/embed/tv/${tmdbId}/${activeSeasonNumber}/${activeEpisodeNumber}`,
      quality: "Auto",
      priority: 20,
      is_embed: true,
    },
    {
      id: 2003,
      server_name: "VidSrc v2 Clean",
      stream_type: "embed",
      stream_url: `https://vidsrc.cc/v2/embed/tv/${tmdbId}/${activeSeasonNumber}/${activeEpisodeNumber}`,
      quality: "1080p",
      priority: 25,
      is_embed: true,
    },
    {
      id: 2004,
      server_name: "AutoEmbed (Fast CDN)",
      stream_type: "embed",
      stream_url: `https://player.autoembed.cc/embed/tv/${tmdbId}/${activeSeasonNumber}/${activeEpisodeNumber}`,
      quality: "1080p",
      priority: 30,
      is_embed: true,
    },
  ];

  const TOXIC_AD_HOSTS = [
    "vidsrc.to",
    "multiembed",
    "2embed",
    "smashystream",
  ];

  const rawStreams: EpisodeStream[] =
    currentEpisode?.streams && currentEpisode.streams.length > 0
      ? currentEpisode.streams
      : defaultEmbedStreams;

  const streams: EpisodeStream[] = rawStreams.filter(
    (s) => !TOXIC_AD_HOSTS.some((bad) => s.stream_url?.toLowerCase().includes(bad))
  );

  const activeStream: EpisodeStream | undefined =
    streams[selectedServerIndex] || streams[0];

  const isBdix = activeStream?.server_name?.toLowerCase().includes("bdix");
  const isCloudVip = activeStream?.server_name?.toLowerCase().includes("cloud vip");

  // Helper to extract clean YouTube embed
  const getYouTubeEmbedUrl = (url: string): string => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = match && match[2].length === 11 ? match[2] : url;
    return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0&iv_load_policy=3&controls=1`;
  };

  // Helper to resolve stream URL (handles Google Drive proxy)
  const resolveStreamUrl = (stream?: EpisodeStream): string => {
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

  const handleSelectEpisode = (epNum: number) => {
    setActiveEpisodeNumber(epNum);
    setSelectedServerIndex(0);
    setReloadKey((prev) => prev + 1);
  };

  const handleSelectSeason = (seasonNum: number) => {
    setActiveSeasonNumber(seasonNum);
    const targetSeason = seasons.find((s) => s.season_number === seasonNum);
    const firstEp = targetSeason?.episodes?.[0]?.episode_number || 1;
    setActiveEpisodeNumber(firstEp);
    setSelectedServerIndex(0);
    setReloadKey((prev) => prev + 1);
  };

  return (
    <div className="space-y-6">
      {/* Video Viewport Container */}
      <div className="relative w-full aspect-video rounded-3xl overflow-hidden bg-black border border-white/10 shadow-2xl shadow-black/90">
        {activeStream ? (
          isYouTube ? (
            <div key={`${activeStream.stream_url}-${reloadKey}`} className="relative w-full h-full">
              <iframe
                src={getYouTubeEmbedUrl(activeStream.stream_url)}
                title={`${series.title} - S${activeSeasonNumber}E${activeEpisodeNumber}`}
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
                title={`${series.title} - S${activeSeasonNumber}E${activeEpisodeNumber}`}
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
                poster={currentEpisode?.still_url || series.backdrop_url || series.poster_url || undefined}
                title={`${series.title} - S${activeSeasonNumber}E${activeEpisodeNumber}`}
                isLive={false}
                className="w-full h-full"
                onFallbackNeeded={() => handleServerFailover()}
              />
            </div>
          )
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-[#666C7A]">
            <Film className="w-12 h-12 text-[#454B5E] animate-pulse" />
            <p className="text-sm">Connecting to media stream source...</p>
          </div>
        )}

        {/* Failover Toast Notice */}
        {failoverNotice && (
          <div className="absolute top-14 left-1/2 -translate-x-1/2 z-20 px-4 py-2 rounded-xl bg-amber-500/90 text-black text-xs font-bold shadow-xl backdrop-blur-md flex items-center gap-2 animate-bounce">
            <span>⚡ {failoverNotice}</span>
          </div>
        )}

        {/* Ambient Top Shadow Bar */}
        <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-black/80 to-transparent pointer-events-none" />

        {/* Episode Info Badge Overlay */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md border shadow-md bg-black/60 border-white/10 text-zinc-200">
          <span className="text-red-400">
            S{activeSeasonNumber} • E{activeEpisodeNumber}
          </span>
          <span className="text-zinc-500">•</span>
          <span className="truncate max-w-[180px] sm:max-w-[280px]">
            {currentEpisode?.title || currentEpisode?.name || `Episode ${activeEpisodeNumber}`}
          </span>
          {isBdix ? (
            <span className="text-emerald-400 text-[10px] bg-emerald-500/20 px-1.5 py-0.5 rounded">BDIX</span>
          ) : isCloudVip ? (
            <span className="text-amber-300 text-[10px] bg-amber-500/20 px-1.5 py-0.5 rounded font-bold">Cloud VIP</span>
          ) : null}
        </div>
      </div>

      {/* Server Switcher Toolbar */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-[#12141C] border border-white/[0.08] backdrop-blur-md space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 hide-scrollbar flex-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#9EA3B0] px-1 shrink-0 uppercase tracking-wider">
              <Server className="w-3.5 h-3.5 text-[#E50000]" />
              <span>Servers:</span>
            </div>

            <div className="flex items-center gap-2">
              {streams.map((stream, idx) => {
                const isActive = idx === selectedServerIndex;
                const streamIsBdix = stream.server_name?.toLowerCase().includes("bdix");

                return (
                  <button
                    key={stream.id || idx}
                    type="button"
                    onClick={() => setSelectedServerIndex(idx)}
                    title={stream.server_name || `Server ${idx + 1}`}
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
                    <span>Server {idx + 1}</span>
                    {streamIsBdix && (
                      <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 uppercase">
                        BDIX
                      </span>
                    )}
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

          <button
            type="button"
            onClick={() => setReloadKey((prev) => prev + 1)}
            className="btn-screenbox-dark text-xs py-1.5 px-3 flex items-center gap-1.5 self-end sm:self-auto shrink-0"
            title="Reload episode stream"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Reload</span>
          </button>
        </div>

        <div className="flex items-center justify-between text-[11px] text-[#8E95A5] pt-2 border-t border-white/[0.04]">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Watching S{activeSeasonNumber} E{activeEpisodeNumber}. Switch streams if a server buffers.</span>
          </div>
        </div>
      </div>

      {/* Season & Episode Navigator Section */}
      <div className="p-4 sm:p-6 rounded-2xl bg-[#12141C] border border-white/[0.08] space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-red-500" />
            <h2 className="text-lg font-black text-white tracking-tight">
              Seasons & Episodes
            </h2>
          </div>

          {/* Season Selector Tabs */}
          {seasons.length > 1 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 hide-scrollbar">
              {seasons.map((s) => {
                const isSelected = s.season_number === activeSeasonNumber;
                return (
                  <button
                    key={s.id || s.season_number}
                    type="button"
                    onClick={() => handleSelectSeason(s.season_number)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                      isSelected
                        ? "bg-red-600 text-white shadow-md shadow-red-950/40"
                        : "bg-[#181A24] hover:bg-[#202330] text-[#9EA3B0] border border-white/[0.06]"
                    }`}
                  >
                    Season {s.season_number}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Episode Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[420px] overflow-y-auto pr-1">
          {episodes.map((ep) => {
            const isPlaying = ep.episode_number === activeEpisodeNumber;

            return (
              <button
                key={ep.id || ep.episode_number}
                type="button"
                onClick={() => handleSelectEpisode(ep.episode_number)}
                className={`p-2.5 rounded-xl text-left transition flex gap-3 group cursor-pointer border ${
                  isPlaying
                    ? "bg-red-950/30 border-red-500/60 shadow-lg shadow-red-950/30"
                    : "bg-[#181A24]/60 hover:bg-[#1E2230] border-white/[0.06]"
                }`}
              >
                {/* Thumbnail */}
                <div className="relative w-24 h-16 rounded-lg overflow-hidden shrink-0 bg-black/60 border border-white/[0.06] flex items-center justify-center">
                  {ep.still_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={ep.still_url}
                      alt={ep.title || `Episode ${ep.episode_number}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <Film className="w-6 h-6 text-zinc-600" />
                  )}
                  <div
                    className={`absolute inset-0 flex items-center justify-center transition-opacity ${
                      isPlaying ? "bg-red-600/40 opacity-100" : "bg-black/40 opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    <Play className="w-5 h-5 text-white fill-white" />
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className={`font-bold ${isPlaying ? "text-red-400" : "text-zinc-400"}`}>
                      Episode {ep.episode_number}
                    </span>
                    {ep.duration_minutes && (
                      <span className="text-[10px] text-zinc-500 flex items-center gap-0.5">
                        <Clock className="w-2.5 h-2.5" />
                        {ep.duration_minutes}m
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-white truncate group-hover:text-red-400 transition-colors">
                    {ep.title || ep.name || `Episode ${ep.episode_number}`}
                  </h4>
                  {ep.overview && (
                    <p className="text-[10px] text-zinc-400 line-clamp-1">
                      {ep.overview}
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
