"use client";

import { useRef } from "react";
import Link from "next/link";
import { Movie } from "@/types";
import { Flame, Star, Play, ChevronLeft, ChevronRight } from "lucide-react";

interface Top10RailProps {
  movies: Movie[];
  title?: string;
  subtitle?: string;
}

export default function Top10Rail({
  movies,
  title = "Top 10 Blockbusters Today",
  subtitle = "Most streamed cinematic titles worldwide in 4K HDR.",
}: Top10RailProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const offset = direction === "left" ? -460 : 460;
    scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
  };

  const top10 = movies.slice(0, 10);
  if (top10.length === 0) return null;

  return (
    <section className="space-y-6 relative group/rail" aria-label={title}>
      {/* Rail Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-[#E50000] to-amber-500 text-white shadow-lg shadow-red-900/30">
            <Flame className="w-5 h-5 fill-white" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>{title}</span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-red-600/20 text-red-400 border border-red-500/30 uppercase tracking-wider">
                Trending
              </span>
            </h2>
            <p className="text-xs text-[#9EA3B0] mt-0.5">
              {subtitle}
            </p>
          </div>
        </div>

        <Link
          href="/movies?sort=popular"
          className="text-xs font-bold text-red-400 hover:text-red-300 transition flex items-center gap-1"
        >
          <span>See Full Top List &rarr;</span>
        </Link>
      </div>

      {/* Snap slider container with Left/Right hover arrows */}
      <div className="relative">
        {/* Left Arrow Button */}
        <button
          onClick={() => scroll("left")}
          aria-label="Scroll left"
          className="absolute -left-3 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/85 hover:bg-[#E50000] text-white border border-white/20 backdrop-blur-md opacity-0 group-hover/rail:opacity-100 transition duration-300 shadow-2xl flex items-center justify-center cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Scrollable Container */}
        <div
          ref={scrollRef}
          className="flex items-center gap-5 overflow-x-auto hide-scrollbar scroll-smooth py-4 px-1 snap-x snap-mandatory"
        >
          {top10.map((movie, index) => {
            const rank = index + 1;
            return (
              <Link
                key={movie.id}
                href={`/movies/${movie.slug}`}
                className="group/card relative flex-shrink-0 flex items-end snap-start cursor-pointer transition-transform duration-300 hover:scale-105"
                style={{ width: "240px" }}
              >
                {/* Large Background 3D Rank Number */}
                <div className="rank-number-text -mr-7 sm:-mr-9 z-0">
                  {rank}
                </div>

                {/* Poster Card */}
                <div className="relative w-36 sm:w-44 aspect-[2/3] rounded-2xl overflow-hidden bg-[#12141C] border border-white/[0.08] group-hover/card:border-red-600/60 shadow-2xl shadow-black/80 z-10">
                  {movie.poster_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={movie.poster_url}
                      alt={movie.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500 ease-out"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center p-3 text-xs text-center text-[#666C7A]">
                      {movie.title}
                    </div>
                  )}

                  {/* Rating Badge */}
                  <div className="absolute top-2 left-2 z-10 flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md border border-amber-500/30 text-amber-300 text-[10px] font-bold">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{movie.rating ? Number(movie.rating).toFixed(1) : "8.5"}</span>
                  </div>

                  {/* Hover Overlay with Play Button */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-3 text-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#E50000] to-[#FF2E2E] flex items-center justify-center shadow-lg shadow-red-900/60 transform scale-75 group-hover/card:scale-100 transition-transform duration-300 mb-2">
                      <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                    </div>
                    <span className="text-xs font-bold text-white line-clamp-1">
                      {movie.title}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Right Arrow Button */}
        <button
          onClick={() => scroll("right")}
          aria-label="Scroll right"
          className="absolute -right-3 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/85 hover:bg-[#E50000] text-white border border-white/20 backdrop-blur-md opacity-0 group-hover/rail:opacity-100 transition duration-300 shadow-2xl flex items-center justify-center cursor-pointer"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </section>
  );
}
