"use client";

import { useRef } from "react";
import Link from "next/link";
import { Movie } from "@/types";
import { ChevronLeft, ChevronRight, Play, Star, Sparkles } from "lucide-react";

interface BanglaOttRailProps {
  movies: Movie[];
}

export default function BanglaOttRail({ movies }: BanglaOttRailProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const clientWidth = scrollRef.current.clientWidth;
    const scrollAmount =
      direction === "left" ? -clientWidth * 0.75 : clientWidth * 0.75;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  if (!movies || movies.length === 0) return null;

  return (
    <section
      className="w-full space-y-4 group/rail relative px-4 sm:px-6 md:px-8 lg:px-12 xl:px-14"
      aria-label="Bangla Originals"
    >
      {/* Header Container */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-white/[0.06] pb-3">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-amber-500/20 to-red-600/20 border border-amber-500/30 text-amber-400">
              <Sparkles className="w-4 h-4 fill-amber-400/30" />
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Bangla Originals</span>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-red-600/20 text-red-400 border border-red-500/30">
                Exclusive
              </span>
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#9EA3B0] mt-1 font-medium">
            জনপ্রিয় ও শীর্ষ রেটেড বাংলা ব্লকবাস্টার মুভি ও ওয়েব সিরিজ
          </p>
        </div>

        {/* View All & Navigation Arrows */}
        <div className="flex items-center justify-between sm:justify-end gap-3">
          <Link
            href="/movies?tab=bangla_ott"
            className="text-xs font-bold text-red-500 hover:text-red-400 transition flex items-center gap-1"
          >
            <span>View All</span>
            <span aria-hidden="true">&rarr;</span>
          </Link>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => scroll("left")}
              aria-label="Scroll left"
              className="w-8 h-8 rounded-lg bg-[#141620] hover:bg-[#1E2232] border border-white/[0.08] flex items-center justify-center text-white transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              aria-label="Scroll right"
              className="w-8 h-8 rounded-lg bg-[#141620] hover:bg-[#1E2232] border border-white/[0.08] flex items-center justify-center text-white transition cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Scroll Rail */}
      <div
        ref={scrollRef}
        className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-none scroll-smooth pb-3 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {movies.map((movie) => {
          const durationText = movie.duration_minutes
            ? `${Math.floor(movie.duration_minutes / 60)}h ${movie.duration_minutes % 60}m`
            : "";

          return (
            <div
              key={movie.id}
              className="flex-shrink-0 w-[160px] sm:w-[190px] md:w-[210px] lg:w-[230px]"
            >
              <Link
                href={`/movies/${movie.slug}`}
                className="group block screenbox-card p-3 rounded-2xl transition-all duration-300 relative overflow-hidden bg-[#10121A] border border-white/[0.06] hover:border-red-600/50 hover:shadow-2xl hover:shadow-red-950/20"
              >
                {/* Poster Container */}
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
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      target.src =
                        "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=400&q=80";
                    }}
                  />

                  {/* Rating Top Right */}
                  {movie.rating > 0 && (
                    <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-black/70 backdrop-blur-md border border-amber-500/30 text-amber-300 text-[10px] font-black">
                      <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                      <span>{Number(movie.rating).toFixed(1)}</span>
                    </div>
                  )}

                  {/* Hover Quick Play Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="w-11 h-11 rounded-full flex items-center justify-center shadow-xl transform scale-75 group-hover:scale-100 transition-transform duration-300 bg-gradient-to-tr from-[#B00000] to-[#E50914] text-white shadow-red-900/60">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>
                </div>

                {/* Meta details */}
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white line-clamp-1 group-hover:text-red-400 transition">
                    {movie.title}
                  </h3>
                  <div className="flex items-center justify-between text-[11px] text-[#8E95A5]">
                    <span>
                      {movie.release_date
                        ? new Date(movie.release_date).getFullYear()
                        : "2024"}
                    </span>
                    {durationText && (
                      <span className="text-[10px] text-[#717684]">
                        {durationText}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
