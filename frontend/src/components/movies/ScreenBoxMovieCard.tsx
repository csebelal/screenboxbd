"use client";

import { useState } from "react";
import Link from "next/link";
import { Movie } from "@/types";
import { Clock, Eye, Star, Play, Bookmark, Check } from "lucide-react";

interface ScreenBoxMovieCardProps {
  movie: Movie;
  badgeType?: "stats" | "release" | "rating";
}

export default function ScreenBoxMovieCard({
  movie,
  badgeType = "stats",
}: ScreenBoxMovieCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const durationText = movie.duration_minutes
    ? `${Math.floor(movie.duration_minutes / 60)}h ${movie.duration_minutes % 60}m`
    : "1h 45m";

  const ratingValue = movie.rating ? Number(movie.rating).toFixed(1) : "8.5";

  const handleBookmarkToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsBookmarked((prev) => !prev);
  };

  return (
    <Link
      href={`/movies/${movie.slug}`}
      className="group block screenbox-card p-3 sm:p-3.5 hover:border-red-600/40 hover:shadow-2xl hover:shadow-red-950/20 transition-all duration-300 cursor-pointer relative"
    >
      {/* Poster Image Container */}
      <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-[#0D0E12] mb-3 border border-white/[0.06]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={
            movie.poster_url ||
            "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=400&q=80"
          }
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
          decoding="async"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5 pointer-events-none">
          <span className="badge-streamit-4k">4K UHD</span>
        </div>

        {/* Top Right Quick Bookmark Button */}
        <button
          type="button"
          onClick={handleBookmarkToggle}
          className={`absolute top-2.5 right-2.5 z-10 w-7 h-7 rounded-lg backdrop-blur-md border transition duration-200 flex items-center justify-center cursor-pointer ${
            isBookmarked
              ? "bg-[#E50000] border-red-500 text-white opacity-100 shadow-md shadow-red-900/50"
              : "bg-black/60 border-white/20 text-white/80 hover:text-white hover:bg-red-600 hover:border-red-500 opacity-0 group-hover:opacity-100"
          }`}
          title={isBookmarked ? "In Watchlist" : "Add to Watchlist"}
        >
          {isBookmarked ? (
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          ) : (
            <Bookmark className="w-3.5 h-3.5" />
          )}
        </button>

        {/* Center Play Button Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#E50000] to-[#FF2E2E] flex items-center justify-center shadow-xl shadow-red-900/60 transform scale-75 group-hover:scale-100 transition-transform duration-300">
            <Play className="w-5 h-5 text-white fill-white ml-0.5" />
          </div>
        </div>
      </div>

      {/* Movie Title */}
      <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-red-500 transition-colors truncate mb-2">
        {movie.title}
      </h3>

      {/* Meta Footer Badge */}
      <div className="flex items-center justify-between text-xs text-[#9EA3B0] bg-[#101218] rounded-lg px-2.5 py-1.5 border border-white/[0.05]">
        {badgeType === "release" ? (
          <span className="truncate text-[11px] font-semibold text-zinc-400">
            Released {movie.release_year || "2024"}
          </span>
        ) : (
          <span className="flex items-center gap-1 text-[11px] font-semibold">
            <Clock className="w-3.5 h-3.5 text-[#666C7A]" />
            <span>{durationText}</span>
          </span>
        )}

        {/* Rating or Views */}
        {badgeType === "stats" ? (
          <span className="flex items-center gap-1 text-[11px] font-semibold text-zinc-400">
            <Eye className="w-3.5 h-3.5 text-[#666C7A]" />
            <span>2.8K</span>
          </span>
        ) : (
          <span className="flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-950/30 px-1.5 py-0.5 rounded border border-amber-500/20">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{ratingValue}</span>
          </span>
        )}
      </div>
    </Link>
  );
}
