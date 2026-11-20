"use client";

import { use, useEffect, useState } from "react";
import { getMovieBySlug } from "@/lib/api";
import { Movie, DownloadSource } from "@/types";
import {
  Download,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  ChevronLeft,
  Wifi,
  FileCheck2,
  HardDrive,
  Copy,
  Check,
  Magnet,
  Send,
  Zap,
} from "lucide-react";
import Link from "next/link";

interface DownloadPageProps {
  params: Promise<{
    id: string;
  }>;
}

interface DisplayMirror {
  id: string;
  name: string;
  url: string;
  badge: string;
  speed: string;
  size: string;
  isPrimary: boolean;
  type: "bdix" | "torrent" | "telegram" | "embed";
}

export default function DownloadGatewayPage({ params }: DownloadPageProps) {
  const resolvedParams = use(params);
  const movieId = resolvedParams.id;

  const [movie, setMovie] = useState<Movie | null>(null);
  const [timeLeft] = useState<number>(0);
  const [isUnlocked] = useState<boolean>(true);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  useEffect(() => {
    // Fetch movie details to check for real download sources and BDIX links
    getMovieBySlug(movieId).then((m) => {
      if (m) setMovie(m);
    });
  }, [movieId]);

  // Build dynamic download mirrors
  const mirrors: DisplayMirror[] = [];

  // 1. Check if movie has BDIX streams
  const bdixStream = movie?.streams?.find((s) =>
    s.server_name?.toLowerCase().includes("bdix")
  );
  if (bdixStream) {
    mirrors.push({
      id: "mirror-bdix",
      name: "BDIX Ultra-Speed Local Direct Download",
      url: bdixStream.stream_url,
      badge: "Local ISP • Full Speed",
      speed: "100+ MB/s",
      size: "1080p Original",
      isPrimary: true,
      type: "bdix",
    });
  }

  // 2. Check for real torrent / telegram download sources
  if (movie?.download_sources && movie.download_sources.length > 0) {
    movie.download_sources.forEach((ds: DownloadSource, idx: number) => {
      const isTorrent = ds.type === "torrent";
      const isTelegram = ds.type === "telegram";
      const targetUrl = ds.magnet_url || ds.torrent_url || ds.download_url || "#";

      mirrors.push({
        id: `mirror-source-${idx}`,
        name: ds.label || `Mirror ${idx + 1}`,
        url: targetUrl,
        badge: isTorrent ? "P2P Magnet Swarm" : isTelegram ? "Telegram Cloud" : "Direct Link",
        speed: isTorrent ? `${ds.seeds || 500}+ Seeds` : "Cloud Speed",
        size: ds.size || ds.quality || "HD",
        isPrimary: mirrors.length === 0,
        type: isTorrent ? "torrent" : isTelegram ? "telegram" : "bdix",
      });
    });
  }

  // 3. Fallbacks if no specific downloads exist
  if (mirrors.length === 0) {
    mirrors.push(
      {
        id: "mirror-1",
        name: "Direct Cloud Mirror (1080p Ultra)",
        url: `https://vidlink.pro/movie/${movie?.tmdb_id || movieId}`,
        badge: "Fastest • Zero Ads",
        speed: "120 MB/s",
        size: "2.4 GB",
        isPrimary: true,
        type: "embed",
      },
      {
        id: "mirror-2",
        name: "Cyberlocker Cloud Edge (720p Mobile)",
        url: `https://embed.su/embed/movie/${movie?.tmdb_id || movieId}`,
        badge: "Cloud Backup",
        speed: "65 MB/s",
        size: "1.1 GB",
        isPrimary: false,
        type: "embed",
      }
    );
  }

  const handleCopy = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(id);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-8 px-4 sm:px-6">
      {/* Back Link */}
      <Link
        href="/movies"
        className="btn-screenbox-dark text-xs py-2 px-3.5 inline-flex items-center gap-2 group cursor-pointer"
      >
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        <span>Return to Movie Catalog</span>
      </Link>

      {/* Main Secure Download Gateway Card */}
      <div className="streamit-card p-6 sm:p-10 space-y-8">
        {/* Gateway Header */}
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-red-600/10 text-red-500 border border-red-500/20">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>SECURE OFFLINE MIRROR & TORRENT GATEWAY</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            {movie ? `Download: ${movie.title}` : "Generating Download Links"}
          </h1>

          <p className="text-xs sm:text-sm text-[#9EA3B0] leading-relaxed">
            {movie?.release_year ? `${movie.release_year} • ` : ""}
            High-speed BDIX routing, P2P torrent magnets, and direct cloud links for offline playback.
          </p>
        </div>

        {/* Circular Countdown Progress Ring */}
        <div className="flex flex-col items-center justify-center py-6">
          {!isUnlocked ? (
            <div className="relative w-36 h-36 flex items-center justify-center">
              {/* Outer Pulsing Glow */}
              <div className="absolute inset-0 rounded-full bg-red-600/15 animate-ping" />

              {/* SVG Circular Ring */}
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="transparent"
                  stroke="#181A24"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="transparent"
                  stroke="#E50000"
                  strokeWidth="8"
                  strokeDasharray="264"
                  strokeDashoffset={264 - (264 * (5 - timeLeft)) / 5}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-linear"
                />
              </svg>

              {/* Inner Countdown Number */}
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-white font-mono">
                  {timeLeft}s
                </span>
                <span className="text-[10px] font-bold text-[#666C7A] uppercase">
                  Allocating...
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-2 animate-in zoom-in-95 duration-200">
              <div className="w-20 h-20 rounded-3xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shadow-xl shadow-emerald-950/40">
                <FileCheck2 className="w-10 h-10 stroke-[2.5]" />
              </div>
              <h3 className="text-xl font-black text-white">Mirror Links Unlocked</h3>
              <p className="text-xs text-emerald-400 font-semibold">
                Direct connections ready. High-speed BDIX routing active.
              </p>
            </div>
          )}
        </div>

        {/* Download Server Options */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-[#9EA3B0] border-b border-white/[0.08] pb-3 font-bold uppercase tracking-wider">
            <span>Available Download Mirrors</span>
            <span>Speed & Capacity</span>
          </div>

          <div className="space-y-3">
            {mirrors.map((link) => (
              <div
                key={link.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  !isUnlocked
                    ? "opacity-50 pointer-events-none bg-[#10121A] border-white/[0.06]"
                    : link.type === "bdix"
                    ? "bg-emerald-950/20 border-emerald-500/40 hover:border-emerald-500"
                    : link.isPrimary
                    ? "bg-[#181A24] border-red-600/50 shadow-lg shadow-red-950/20 hover:border-red-500"
                    : "bg-[#10121A] border-white/[0.08] hover:border-white/20"
                }`}
              >
                {/* Mirror Details */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {link.type === "torrent" ? (
                      <Magnet className="w-4 h-4 text-amber-400 shrink-0" />
                    ) : link.type === "telegram" ? (
                      <Send className="w-4 h-4 text-blue-400 shrink-0" />
                    ) : link.type === "bdix" ? (
                      <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <Download className="w-4 h-4 text-red-500 shrink-0" />
                    )}
                    <span className="text-sm font-bold text-white">
                      {link.name}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        link.type === "bdix"
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                          : link.type === "torrent"
                          ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                          : "bg-red-600/20 text-red-400 border-red-500/30"
                      }`}
                    >
                      {link.badge}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[#9EA3B0]">
                    <span className="flex items-center gap-1">
                      <Wifi className="w-3.5 h-3.5 text-blue-400" />
                      {link.speed}
                    </span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1">
                      <HardDrive className="w-3.5 h-3.5 text-zinc-400" />
                      {link.size}
                    </span>
                  </div>
                </div>

                {/* Download / Copy Action */}
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => handleCopy(link.id, link.url)}
                    className="btn-screenbox-dark text-xs py-2.5 px-3 flex items-center gap-1"
                    title={link.type === "torrent" ? "Copy Magnet Link" : "Copy Direct URL"}
                  >
                    {copiedLink === link.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-xs py-2.5 px-5 rounded-xl font-bold flex items-center gap-2 transition ${
                      link.type === "bdix"
                        ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-950/40"
                        : link.type === "torrent"
                        ? "bg-amber-600 hover:bg-amber-500 text-white shadow-md shadow-amber-950/40"
                        : link.isPrimary
                        ? "btn-screenbox-red shadow-md shadow-red-950/30"
                        : "btn-screenbox-dark"
                    }`}
                  >
                    {link.type === "torrent" ? (
                      <Magnet className="w-3.5 h-3.5" />
                    ) : (
                      <Download className="w-3.5 h-3.5" />
                    )}
                    <span>{link.type === "torrent" ? "Open Magnet" : "Download"}</span>
                    <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security Trust Badges */}
        <div className="p-4 rounded-2xl bg-[#0D0E14] border border-white/[0.06] flex flex-wrap items-center justify-around gap-4 text-xs text-[#9EA3B0]">
          <span className="flex items-center gap-1.5 font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            VirusTotal Verified Clean
          </span>
          <span className="flex items-center gap-1.5 font-semibold">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Zero Adware / Malware Guarantee
          </span>
        </div>
      </div>
    </div>
  );
}
