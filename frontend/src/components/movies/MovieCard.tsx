"use client";

import Link from "next/link";
import { Movie } from "@/types";
import { Star, Play, Film, Clock } from "lucide-react";
import { sanitizePosterUrl } from "@/lib/imageUtils";

interface MovieCardProps {
  movie: Movie;
  priority?: boolean;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const durationText = movie.duration_minutes ? `${movie.duration_minutes}m` : null;
  const posterUrl = sanitizePosterUrl(movie.poster_url);

  return (
    <Link
      href={`/movies/${movie.slug}`}
      className="group relative flex flex-col rounded-2xl overflow-hidden bg-[#14161E] border border-white/[0.08] hover:border-red-600/40 transition-all duration-300 hover:shadow-2xl hover:shadow-red-950/20 hover:-translate-y-1 cursor-pointer"
    >
      {/* Poster Image Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-[#0D0E12]">
        {posterUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={posterUrl}
            alt={movie.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-[#666C7A]">
            <Film className="w-10 h-10 mb-2" />
            <span className="text-xs text-center font-medium line-clamp-2">{movie.title}</span>
          </div>
        )}

        {/* Rating & Year Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none z-10">
          <span className="badge-streamit-4k">4K UHD</span>

          {movie.rating > 0 ? (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md border border-amber-500/30 text-amber-300 text-[11px] font-bold shadow-lg">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{movie.rating.toFixed(1)}</span>
            </div>
          ) : (
            <div />
          )}
        </div>

        {/* Hover Ambient Overlay with Play Button */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#E50000] to-[#FF2E2E] text-white flex items-center justify-center shadow-lg shadow-red-900/60 transform scale-75 group-hover:scale-100 transition-transform duration-300">
            <Play className="w-5 h-5 fill-white ml-0.5" />
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-3.5 flex flex-col flex-grow justify-between gap-1.5 bg-[#12141C]">
        <h3 className="font-bold text-sm text-white group-hover:text-red-500 transition-colors line-clamp-1">
          {movie.title}
        </h3>

        <div className="flex items-center justify-between text-[11px] text-[#9EA3B0]">
          <span className="line-clamp-1">
            {movie.genres && movie.genres.length > 0
              ? movie.genres.slice(0, 2).join(", ")
              : "Feature Film"}
          </span>
          {durationText && (
            <span className="shrink-0 flex items-center gap-1 text-[#666C7A]">
              <Clock className="w-3 h-3" />
              {durationText}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
