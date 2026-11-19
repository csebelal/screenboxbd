"use client";

import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Channel, ChannelStream } from "@/types";
import ServerSelector from "@/components/player/ServerSelector";

const ArtPlayer = dynamic(() => import("@/components/player/ArtPlayer"), {
  ssr: false,
  loading: () => (
    <div className="w-full aspect-video bg-[#0D0E14] flex flex-col items-center justify-center p-8 text-center animate-pulse">
      <div className="w-12 h-12 rounded-full bg-red-600/20 text-[#E50000] flex items-center justify-center mb-3">
        <span className="w-3.5 h-3.5 rounded-full bg-[#E50000] live-pulse" />
      </div>
      <p className="text-xs text-[#9EA3B0] font-bold">Loading Live TV Player...</p>
    </div>
  ),
});

import {
  ArrowLeft,
  Tv,
  Search,
  Maximize2,
  Minimize2,
  Radio,
  Share2,
  Check,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

interface LiveTvTheaterProps {
  initialChannel: Channel;
  allChannels: Channel[];
}

export default function LiveTvTheater({
  initialChannel,
  allChannels,
}: LiveTvTheaterProps) {
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const fsScrollRef = useRef<HTMLDivElement>(null);

  const [activeChannel, setActiveChannel] = useState<Channel>(initialChannel);
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [copiedShare, setCopiedShare] = useState<boolean>(false);

  // Fullscreen hover dock states
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isHoveringFsDock, setIsHoveringFsDock] = useState<boolean>(false);
  const [isMouseActiveInFs, setIsMouseActiveInFs] = useState<boolean>(false);
  const fsTimerRef = useRef<NodeJS.Timeout | null>(null);

  const streams = useMemo(
    () => activeChannel.streams || [],
    [activeChannel.streams]
  );
  const primaryStream = streams[0] || null;

  const [currentStreamUrl, setCurrentStreamUrl] = useState<string>(
    primaryStream?.stream_url || ""
  );
  const [isUsingProxy, setIsUsingProxy] = useState<boolean>(false);

  // Switch active channel seamlessly
  const handleChannelChange = (channel: Channel) => {
    setActiveChannel(channel);
    const newStreams = channel.streams || [];
    const first = newStreams[0];
    if (first) {
      setCurrentStreamUrl(first.stream_url);
      setIsUsingProxy(false);
    } else {
      setCurrentStreamUrl("");
    }
  };

  // Switch stream server
  const handleSelectStream = (stream: ChannelStream, useProxy: boolean) => {
    setIsUsingProxy(useProxy);
    setCurrentStreamUrl(useProxy ? stream.proxy_url : stream.stream_url);
  };

  // Fallback to proxy
  const handleFallbackNeeded = useCallback(
    (failedUrl: string) => {
      const match = streams.find((s) => s.stream_url === failedUrl) || streams[0];
      if (match?.proxy_url && !isUsingProxy) {
        setIsUsingProxy(true);
        setCurrentStreamUrl(match.proxy_url);
      }
    },
    [streams, isUsingProxy]
  );

  // Share URL copy
  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.origin + `/tv/${activeChannel.slug}`);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  // Fullscreen Toggle
  const toggleFullscreen = () => {
    if (!playerContainerRef.current) return;
    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // Listen to fullscreen changes
  useEffect(() => {
    const onFsChange = () => {
      const isFs = !!document.fullscreenElement;
      setIsFullscreen(isFs);
      if (!isFs) {
        setIsHoveringFsDock(false);
        setIsMouseActiveInFs(false);
      }
    };
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  // Handle mouse movement in fullscreen to reveal bottom channels dock
  const handleMouseMoveFullscreen = () => {
    if (!isFullscreen) return;
    setIsMouseActiveInFs(true);
    if (fsTimerRef.current) clearTimeout(fsTimerRef.current);
    fsTimerRef.current = setTimeout(() => {
      if (!isHoveringFsDock) {
        setIsMouseActiveInFs(false);
      }
    }, 3200);
  };

  // Horizontal mouse wheel scrolling handler (slides from right to left)
  const handleHorizontalWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (e.currentTarget) {
      // deltaY > 0 (wheel down) increases scrollLeft, moving items from right to left
      e.currentTarget.scrollLeft += e.deltaY * 2.0;
    }
  };

  // Scroll fullscreen rail left / right via buttons
  const scrollFsRail = (direction: "left" | "right") => {
    if (fsScrollRef.current) {
      const scrollAmt = direction === "left" ? -400 : 400;
      fsScrollRef.current.scrollBy({ left: scrollAmt, behavior: "smooth" });
    }
  };

  // Categories list derived from allChannels with counts
  const { categories, categoryCounts } = useMemo(() => {
    const counts: Record<string, number> = { All: allChannels.length };
    const set = new Set<string>();
    set.add("All");

    allChannels.forEach((c) => {
      const catName = c.category?.name || "General";
      set.add(catName);
      counts[catName] = (counts[catName] || 0) + 1;
    });

    return {
      categories: Array.from(set),
      categoryCounts: counts,
    };
  }, [allChannels]);

  // Filtered channels based on search and category
  const filteredChannels = useMemo(() => {
    return allChannels.filter((c) => {
      const matchesSearch = c.name
        .toLowerCase()
        .includes(searchFilter.toLowerCase().trim());
      const matchesCat =
        selectedCategory === "All" || (c.category?.name || "General") === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [allChannels, searchFilter, selectedCategory]);

  return (
    <div className="w-full px-3 sm:px-5 md:px-7 lg:px-10 xl:px-12 py-5 sm:py-7 space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-600/10 text-red-500 border border-red-500/20 mb-1">
            <Radio className="w-3.5 h-3.5 live-pulse" />
            <span>IPTV LIVE BROADCAST &bull; BDIX ULTRA HIGH SPEED</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Live TV Theater
          </h1>
          <p className="text-xs sm:text-sm text-[#9EA3B0] mt-0.5">
            Streaming bufferless 1080p IPTV channels with 218 direct broadcast feeds.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleShare}
            className="btn-screenbox-dark text-xs py-2 px-3 flex items-center gap-1.5"
            title="Share channel link"
          >
            {copiedShare ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={toggleFullscreen}
            className="btn-screenbox-dark text-xs py-2 px-3 flex items-center gap-1.5"
            title="Toggle full screen mode"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Full Screen</span>
          </button>

          <Link
            href="/"
            className="btn-screenbox-dark text-xs py-2 px-3 flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* MAIN 2-COLUMN STAGE: 60% STREAMING (LEFT) + 40% CHANNELS (RIGHT)     */}
      {/* ===================================================================== */}
      <div className="flex flex-col lg:flex-row gap-5 lg:gap-6 items-start w-full">
        {/* =================================================================== */}
        {/* 1. LEFT SIDE: STREAMING PLAYER & CONTROLS (60% Width)              */}
        {/* =================================================================== */}
        <div className="w-full lg:w-[60%] shrink-0 space-y-4">
          {/* Video Player Wrapper Container (Supports Browser Fullscreen) */}
          <div
            ref={playerContainerRef}
            onMouseMove={handleMouseMoveFullscreen}
            className={`relative rounded-2xl overflow-hidden border border-white/10 bg-black shadow-2xl shadow-black/95 ${
              isFullscreen ? "fixed inset-0 z-50 rounded-none border-none w-screen h-screen" : "w-full aspect-video"
            }`}
          >
            {/* Top Badges Overlay */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2 pointer-events-none">
              <span className="badge-streamit-live">
                <span className="w-2 h-2 rounded-full bg-white live-pulse" />
                LIVE
              </span>
              <span className="badge-streamit-4k">1080p 60FPS</span>
            </div>

            <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-black/70 backdrop-blur-md text-emerald-400 border border-emerald-500/30">
                ● LOW LATENCY
              </span>
              {isFullscreen && (
                <button
                  type="button"
                  onClick={toggleFullscreen}
                  className="w-8 h-8 rounded-lg bg-black/70 hover:bg-red-600 text-white flex items-center justify-center border border-white/20 transition cursor-pointer"
                  title="Exit Fullscreen"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Artplayer Streaming Canvas */}
            {currentStreamUrl ? (
              <ArtPlayer
                key={currentStreamUrl}
                url={currentStreamUrl}
                poster={activeChannel.logo_url || undefined}
                title={activeChannel.name}
                isLive={true}
                onFallbackNeeded={handleFallbackNeeded}
                onToggleFullscreen={toggleFullscreen}
                className="w-full h-full"
              />
            ) : (
              <div className="w-full h-full bg-[#0D0E14] flex flex-col items-center justify-center p-8 text-center">
                <Tv className="w-14 h-14 text-[#666C7A] mb-3 animate-pulse" />
                <h3 className="text-white font-bold text-lg">
                  Connecting to Broadcast Feed...
                </h3>
                <p className="text-xs text-[#9EA3B0] mt-1 max-w-sm">
                  Please select another server or channel from the guide on the right.
                </p>
              </div>
            )}

            {/* =============================================================== */}
            {/* FULLSCREEN TV CHANNELS SINGLE ROW ON SCREEN BOTTOM (HOVER)     */}
            {/* =============================================================== */}
            {isFullscreen && (
              <>
                {/* Bottom Hotspot Trigger Zone */}
                <div
                  onMouseEnter={() => setIsHoveringFsDock(true)}
                  className="absolute bottom-0 inset-x-0 h-28 z-30 pointer-events-auto"
                />

                {/* Floating Bottom Single Row Channels Dock (Reveals on Hover / Move) */}
                <div
                  onMouseEnter={() => setIsHoveringFsDock(true)}
                  onMouseLeave={() => setIsHoveringFsDock(false)}
                  className={`absolute bottom-0 inset-x-0 z-40 bg-gradient-to-t from-black via-black/95 to-black/75 backdrop-blur-2xl border-t border-white/15 px-4 sm:px-6 py-3 sm:py-4 transition-all duration-300 shadow-2xl ${
                    isMouseActiveInFs || isHoveringFsDock
                      ? "opacity-100 translate-y-0 pointer-events-auto"
                      : "opacity-0 translate-y-full pointer-events-none"
                  }`}
                >
                  {/* Dock Top Sub-Bar */}
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-[#E50000] live-pulse" />
                      <h4 className="text-xs sm:text-sm font-black text-white tracking-wide">
                        TV Channels &bull; {filteredChannels.length} Feeds
                      </h4>
                      <span className="text-[10px] sm:text-[11px] text-zinc-400 font-medium hidden md:inline">
                        (Scroll mouse wheel to slide channels right to left)
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Left & Right Slide Buttons */}
                      <button
                        type="button"
                        onClick={() => scrollFsRail("left")}
                        className="w-7 h-7 rounded-lg bg-white/10 hover:bg-[#E50000] text-white flex items-center justify-center transition cursor-pointer"
                        title="Slide left"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => scrollFsRail("right")}
                        className="w-7 h-7 rounded-lg bg-white/10 hover:bg-[#E50000] text-white flex items-center justify-center transition cursor-pointer"
                        title="Slide right"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsHoveringFsDock(false);
                          setIsMouseActiveInFs(false);
                        }}
                        className="w-7 h-7 rounded-lg bg-white/10 hover:bg-red-600 text-white flex items-center justify-center transition cursor-pointer ml-1"
                        title="Hide channel bar"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* SINGLE HORIZONTAL ROW: MOUSE WHEEL SCROLLS CONTENT RIGHT TO LEFT */}
                  <div
                    ref={fsScrollRef}
                    onWheel={handleHorizontalWheel}
                    className="flex items-center gap-2.5 sm:gap-3 overflow-x-auto hide-scrollbar scroll-smooth py-1 select-none"
                  >
                    {filteredChannels.map((channel) => {
                      const isActive = channel.id === activeChannel.id;

                      return (
                        <button
                          key={channel.id}
                          type="button"
                          onClick={() => handleChannelChange(channel)}
                          className={`flex-shrink-0 w-28 sm:w-32 p-1.5 rounded-xl border text-center transition-all duration-150 cursor-pointer flex flex-col items-center justify-between overflow-hidden ${
                            isActive
                              ? "bg-red-950/40 border-[#E50000] ring-2 ring-red-500 shadow-lg shadow-red-950/70 scale-105"
                              : "bg-[#11131B] border-white/10 hover:border-red-500/50 hover:bg-[#181B26] hover:scale-105"
                          }`}
                        >
                          {/* Channel Logo Frame */}
                          <div className="w-full aspect-[16/10] rounded-lg bg-black/60 p-1 flex items-center justify-center overflow-hidden my-0.5">
                            {channel.logo_url ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={channel.logo_url}
                                alt={channel.name}
                                loading="lazy"
                                className="max-h-full max-w-full object-contain filter group-hover:scale-105 transition-transform"
                              />
                            ) : (
                              <Tv className="w-5 h-5 text-[#666C7A]" />
                            )}
                          </div>

                          {/* Channel Name */}
                          <div className="w-full mt-1 pointer-events-none">
                            <h5
                              className={`text-[10px] sm:text-[11px] font-bold truncate leading-tight ${
                                isActive ? "text-red-400 font-black" : "text-white"
                              }`}
                              title={channel.name}
                            >
                              {channel.name}
                            </h5>
                            {isActive && (
                              <span className="text-[7.5px] font-bold text-red-500 uppercase tracking-widest block mt-0.5">
                                ● PLAYING
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Active Channel Details & Stream Controls Bar */}
          <div className="screenbox-card p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-[#0D0E14] border border-white/[0.08] flex items-center justify-center p-2 shrink-0 shadow-inner">
                {activeChannel.logo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={activeChannel.logo_url}
                    alt={activeChannel.name}
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <Tv className="w-6 h-6 text-[#9EA3B0]" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-black text-white">
                    {activeChannel.name}
                  </h2>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/[0.06] text-zinc-300 uppercase">
                    {activeChannel.country || "BD"}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold shadow-sm">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                    <span className="tracking-wide">LIVE BROADCAST</span>
                  </div>
                  <span className="text-[11px] text-zinc-500 hidden sm:inline">&bull;</span>
                  <span className="text-xs text-[#9EA3B0]">
                    {activeChannel.category?.name || "General"} &bull; 1080p BDIX &bull; Multi-Server
                  </span>
                </div>
              </div>
            </div>

            {/* Server Selector Bar */}
            {streams.length > 0 && (
              <div className="self-start sm:self-auto">
                <ServerSelector
                  streams={streams}
                  currentStreamUrl={currentStreamUrl}
                  isUsingProxy={isUsingProxy}
                  onSelectStream={handleSelectStream}
                />
              </div>
            )}
          </div>
        </div>

        {/* =================================================================== */}
        {/* 2. RIGHT SIDE: LIVE CHANNELS GUIDE PANEL (40% Width)                */}
        {/* =================================================================== */}
        <div className="w-full lg:w-[40%] screenbox-card p-4 sm:p-5 space-y-4">
          {/* Guide Header with Live Count */}
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white">
                  Live Channels
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-red-600/20 text-red-400 border border-red-500/30 uppercase tracking-wider">
                  5 per row
                </span>
              </div>
              <p className="text-xs text-[#9EA3B0] mt-0.5">
                {filteredChannels.length} active broadcast feeds
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#12141C] border border-white/[0.08] text-white flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 live-pulse" />
              <span>Live TV</span>
            </span>
          </div>

          {/* Search Input Filter */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#666C7A] absolute left-3 top-3" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search 218 channels..."
              className="w-full bg-[#0D0E14] border border-white/[0.08] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-[#666C7A] focus:outline-none focus:border-red-500 transition shadow-inner"
            />
            {searchFilter && (
              <button
                type="button"
                onClick={() => setSearchFilter("")}
                aria-label="Clear search"
                className="absolute right-2.5 top-2.5 p-1 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Filter Pills Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar pb-1">
            {categories.map((cat) => {
              const count = categoryCounts[cat] || 0;
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-lg whitespace-nowrap transition cursor-pointer flex items-center gap-1 ${
                    isSelected
                      ? "bg-[#E50000] text-white shadow-sm"
                      : "bg-[#10121A] border border-white/[0.08] text-[#9EA3B0] hover:text-white"
                  }`}
                >
                  <span>{cat}</span>
                  <span className="text-[9px] opacity-70">({count})</span>
                </button>
              );
            })}
          </div>

          {/* ================================================================= */}
          {/* EXACTLY 5 CHANNELS PER ROW GRID (lg:grid-cols-5)                  */}
          {/* ================================================================= */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-1.5 sm:gap-2 max-h-[660px] overflow-y-auto pr-1">
            {filteredChannels.length === 0 ? (
              <div className="col-span-full p-8 text-center text-xs text-[#666C7A]">
                No channels match your search.
              </div>
            ) : (
              filteredChannels.map((channel) => {
                const isActive = channel.id === activeChannel.id;

                return (
                  <button
                    key={channel.id}
                    type="button"
                    onClick={() => handleChannelChange(channel)}
                    className={`group text-left p-1 sm:p-1.5 rounded-lg border transition-all duration-150 cursor-pointer flex flex-col justify-between overflow-hidden btn-tactile ${
                      isActive
                        ? "bg-red-950/40 border-[#E50000] ring-2 ring-red-500/60 shadow-lg shadow-red-950/50 scale-[1.02]"
                        : "bg-[#0E1017] border-white/[0.06] hover:border-red-500/50 hover:bg-[#141722] hover:scale-[1.02] active:scale-[0.98]"
                    }`}
                  >
                    {/* Logo Frame */}
                    <div className="w-full aspect-[4/3] rounded-md bg-[#08090D] border border-white/[0.04] p-1 flex items-center justify-center overflow-hidden">
                      {channel.logo_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={channel.logo_url}
                          alt=""
                          loading="lazy"
                          className="max-h-full max-w-full object-contain filter group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <Tv className="w-4 h-4 text-[#666C7A]" />
                      )}
                    </div>

                    {/* Title */}
                    <div className="text-center mt-0.5 w-full pointer-events-none">
                      <h4
                        className={`text-[10px] sm:text-[11px] font-bold truncate leading-tight ${
                          isActive ? "text-red-400 font-black" : "text-white group-hover:text-red-400"
                        }`}
                        title={channel.name}
                      >
                        {channel.name}
                      </h4>
                      {isActive && (
                        <span className="inline-flex items-center justify-center gap-1 text-[7.5px] font-black text-red-400 uppercase tracking-wider mt-0.5">
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
                          </span>
                          LIVE
                        </span>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
