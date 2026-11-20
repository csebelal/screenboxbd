"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Movie } from "@/types";
import { ChevronLeft, ChevronRight, Play, Star, Bookmark, Check } from "lucide-react";
import { optimizeTmdbImage } from "@/lib/imageUtils";

interface FullWidthMovieRailProps {
  title: string;
  subtitle?: string;
  movies: Movie[];
  variant?: "portrait" | "top10" | "landscape";
  viewAllLink?: string;
}

export default function FullWidthMovieRail({
  title,
  subtitle,
  movies,
  variant = "portrait",
  viewAllLink = "/movies",
}: FullWidthMovieRailProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<Record<number, boolean>>({});

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const clientWidth = scrollRef.current.clientWidth;
    const scrollAmount = direction === "left" ? -clientWidth * 0.75 : clientWidth * 0.75;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  const toggleBookmark = (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    e.stopPropagation();
    setBookmarkedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (!movies || movies.length === 0) return null;

  return (
    <section className="w-full space-y-3.5 sm:space-y-4 group/rail relative" aria-label={title}>
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>{title}</span>
            {variant === "top10" && (
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-red-600/20 text-red-400 border border-red-500/30 uppercase tracking-wider">
                Trending
              </span>
            )}
          </h2>
          {subtitle && (
            <p className="text-xs text-[#9EA3B0] mt-0.5 font-medium">{subtitle}</p>
          )}
        </div>

        {viewAllLink && (
          <Link
            href={viewAllLink}
            className="text-xs font-bold text-red-400 hover:text-red-300 transition flex items-center gap-1 group/link"
          >
            <span>See All</span>
            <span className="group-hover/link:translate-x-0.5 transition-transform">&rarr;</span>
          </Link>
        )}
      </div>

      {/* Rail Container with Floating Left / Right Circular Arrows */}
      <div className="relative">
        {/* Left Arrow Button */}
        <button
          type="button"
          onClick={() => scroll("left")}
          aria-label="Scroll left"
          className="btn-tactile absolute -left-2 sm:-left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/85 hover:bg-[#E50000] text-white border border-white/20 hover:border-red-500 backdrop-blur-md opacity-0 group-hover/rail:opacity-100 transition-all duration-300 shadow-2xl flex items-center justify-center cursor-pointer hover:scale-110 active:scale-95"
        >
          <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
        </button>

        {/* Scrollable Row */}
        <div
          ref={scrollRef}
          className="flex items-center gap-3 sm:gap-4 overflow-x-auto hide-scrollbar scroll-smooth py-2 px-0.5 snap-x snap-mandatory"
        >
          {movies.map((movie, index) => {
            const rank = index + 1;
            const isBookmarked = !!bookmarkedIds[movie.id];
            const isLandscape = variant === "landscape";
            const rawUrl = isLandscape
              ? movie.backdrop_url || movie.poster_url
              : movie.poster_url || movie.backdrop_url;
            const imageUrl = optimizeTmdbImage(rawUrl, isLandscape ? "backdrop" : "poster");

            return (
              <Link
                key={movie.id}
                href={`/movies/${movie.slug}`}
                className={`group/card relative flex-shrink-0 snap-start rounded-xl sm:rounded-2xl overflow-hidden bg-[#101218] border border-white/[0.07] hover:border-red-500/50 shadow-xl transition-all duration-300 cursor-pointer hover:scale-[1.03] hover:z-20 ${
                  isLandscape
                    ? "w-[240px] sm:w-[280px] md:w-[310px] xl:w-[calc(16.666%-14px)] aspect-[16/10]"
                    : "w-[145px] sm:w-[175px] md:w-[195px] xl:w-[calc(16.666%-14px)] aspect-[2/3]"
                }`}
              >
                {/* Poster / Backdrop Image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    imageUrl ||
                    "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=500&q=80"
                  }
                  alt={movie.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500 ease-out"
                />

                {/* Subtle dark gradient on bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

                {/* Top 10 Rank Number in Bottom Right Corner (Matching Reference Image 1) */}
                {variant === "top10" && (
                  <div className="absolute bottom-0 right-1.5 sm:right-2 z-20 pointer-events-none select-none">
                    <span className="font-sans font-black text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tighter drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)] text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-100 to-zinc-400 opacity-95">
                      {rank}
                    </span>
                  </div>
                )}

                {/* Top Left 4K / HD Badge */}
                <div className="absolute top-2 left-2 z-10 flex items-center gap-1 pointer-events-none">
                  <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-md text-white border border-white/20">
                    4K
                  </span>
                  {movie.rating > 0 && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/90 text-black flex items-center gap-0.5">
                      <Star className="w-2.5 h-2.5 fill-black" />
                      <span>{Number(movie.rating).toFixed(1)}</span>
                    </span>
                  )}
                </div>

                {/* Top Right Quick Bookmark Button */}
                <button
                  type="button"
                  onClick={(e) => toggleBookmark(e, movie.id)}
                  className={`btn-tactile absolute top-2 right-2 z-20 w-7 h-7 rounded-lg backdrop-blur-md border transition-all duration-200 flex items-center justify-center cursor-pointer active:scale-90 ${
                    isBookmarked
                      ? "bg-[#E50000] border-red-500 text-white opacity-100 shadow-md shadow-red-900/60"
                      : "bg-black/60 border-white/20 text-white/80 hover:text-white hover:bg-red-600 opacity-90 sm:opacity-0 sm:group-hover/card:opacity-100"
                  }`}
                  title={isBookmarked ? "In Watchlist" : "Add to Watchlist"}
                >
                  {isBookmarked ? (
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  ) : (
                    <Bookmark className="w-3.5 h-3.5" />
                  )}
                </button>

                {/* Center Hover Play Icon */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#E50000] flex items-center justify-center shadow-xl shadow-red-950/70 transform scale-75 group-hover/card:scale-100 transition-transform duration-300">
                    <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                  </div>
                </div>

                {/* Bottom Title & Genre overlay for non-top10 cards */}
                {variant !== "top10" && (
                  <div className="absolute bottom-2 left-2 right-2 z-10 pointer-events-none">
                    <h3 className="text-xs sm:text-sm font-bold text-white truncate drop-shadow">
                      {movie.title}
                    </h3>
                    <p className="text-[10px] text-zinc-400 truncate mt-0.5">
                      {Array.isArray(movie.genres) && movie.genres.length > 0
                        ? movie.genres.slice(0, 2).join(" • ")
                        : movie.release_year || "2024"}
                    </p>
                  </div>
                )}
              </Link>
            );
          })}
        </div>

        {/* Right Arrow Button */}
        <button
          type="button"
          onClick={() => scroll("right")}
          aria-label="Scroll right"
          className="btn-tactile absolute -right-2 sm:-right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/85 hover:bg-[#E50000] text-white border border-white/20 hover:border-red-500 backdrop-blur-md opacity-0 group-hover/rail:opacity-100 transition-all duration-300 shadow-2xl flex items-center justify-center cursor-pointer hover:scale-110 active:scale-95"
        >
          <ChevronRight className="w-6 h-6 stroke-[2.5]" />
        </button>
      </div>
    </section>
  );
}
