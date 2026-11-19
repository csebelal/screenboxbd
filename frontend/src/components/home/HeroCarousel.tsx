"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Play,
  Info,
  ChevronLeft,
  ChevronRight,
  Star,
  Zap,
  Clock,
} from "lucide-react";

export interface HeroItem {
  id: string | number;
  type: "tv" | "movie";
  title: string;
  slug: string;
  overview: string | null;
  backdropUrl: string | null;
  posterUrl: string | null;
  rating?: number;
  year?: string | null;
  badge?: string;
  genres?: string[];
  durationMinutes?: number | null;
}

interface HeroCarouselProps {
  items: HeroItem[];
}

export default function HeroCarousel({ items }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const total = items.length;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Auto-advance slides every 6 seconds unless user is hovering
  useEffect(() => {
    if (total <= 1 || isPaused) return;

    const timer = setInterval(() => {
      nextSlide();
    }, 6000);

    return () => clearInterval(timer);
  }, [total, isPaused, nextSlide]);

  if (!items || items.length === 0) return null;

  const current = items[currentIndex];
  const watchUrl = current.type === "tv" ? `/tv/${current.slug}` : `/movies/${current.slug}`;

  return (
    <div
      className="relative w-full rounded-3xl overflow-hidden bg-zinc-950 border border-zinc-800 shadow-2xl group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="region"
      aria-label="Featured Showcase Carousel"
    >
      {/* Background Image with Deep Cinematic Gradients */}
      <div className="relative w-full aspect-[21/9] min-h-[360px] md:min-h-[460px] overflow-hidden">
        {current.backdropUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={current.backdropUrl}
            alt={current.title}
            className="w-full h-full object-cover object-center scale-105 transition-all duration-1000 ease-out"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-red-950/80 via-zinc-900 to-zinc-950" />
        )}

        {/* Multi-layered Cinema Shadows (Left, Bottom, and Subtle Top) */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-transparent w-full md:w-3/4 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/60 to-transparent z-10" />

        {/* Content Container */}
        <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 md:p-12 max-w-3xl space-y-3.5">
          {/* Status Badge */}
          <div className="flex flex-wrap items-center gap-2">
            {current.type === "tv" ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/30 text-red-400 border border-red-500/40 text-xs font-black uppercase tracking-wider backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-red-500 live-pulse" />
                <span>LIVE BROADCAST</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold backdrop-blur-md">
                <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>BLOCKBUSTER STREAM</span>
              </span>
            )}

            {current.rating && current.rating > 0 ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-zinc-900/80 text-amber-400 text-xs font-bold border border-zinc-700 backdrop-blur-md">
                <Star className="w-3 h-3 fill-amber-400" />
                <span>{current.rating.toFixed(1)}</span>
              </span>
            ) : null}

            {current.year && (
              <span className="px-2.5 py-0.5 rounded-full bg-zinc-900/80 text-zinc-300 text-xs font-semibold border border-zinc-700 backdrop-blur-md">
                {current.year}
              </span>
            )}

            {current.durationMinutes ? (
              <span className="hidden sm:inline-flex items-center gap-1 text-xs text-zinc-400">
                <Clock className="w-3 h-3 text-zinc-500" />
                <span>{current.durationMinutes}m</span>
              </span>
            ) : null}
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight line-clamp-2">
            {current.title}
          </h1>

          {/* Overview / Synopsis */}
          <p className="text-xs sm:text-sm md:text-base text-zinc-300/90 line-clamp-2 max-w-xl font-normal leading-relaxed">
            {current.overview ||
              "Stream in Ultra HD with zero buffering, multi-server backup, and adaptive HLS playback."}
          </p>

          {/* Genre Tags */}
          {current.genres && current.genres.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {current.genres.slice(0, 3).map((g) => (
                <span
                  key={g}
                  className="px-2 py-0.5 rounded-md bg-zinc-800/70 border border-zinc-700/50 text-[11px] text-zinc-300 font-medium"
                >
                  {g}
                </span>
              ))}
            </div>
          )}

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href={watchUrl}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-xl shadow-red-600/30 transition transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{current.type === "tv" ? "Watch Live Now" : "Stream in 1080p"}</span>
            </Link>

            <Link
              href={current.type === "tv" ? "/tv" : "/movies"}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 hover:text-white font-semibold text-sm border border-zinc-700 transition cursor-pointer"
            >
              <Info className="w-4 h-4 text-zinc-400" />
              <span className="hidden sm:inline">Explore More</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Prev / Next Slide Chevrons (Appear on hover) */}
      {total > 1 && (
        <>
          <button
            onClick={prevSlide}
            aria-label="Previous Featured Slide"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-black/60 hover:bg-red-600 text-white border border-white/10 backdrop-blur-md opacity-0 group-hover:opacity-100 transition duration-300 cursor-pointer shadow-lg"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            aria-label="Next Featured Slide"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-black/60 hover:bg-red-600 text-white border border-white/10 backdrop-blur-md opacity-0 group-hover:opacity-100 transition duration-300 cursor-pointer shadow-lg"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Bottom Progress Indicator Dots */}
      {total > 1 && (
        <div className="absolute bottom-4 right-6 z-30 flex items-center gap-1.5">
          {items.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                idx === currentIndex
                  ? "w-7 bg-red-600 shadow-md shadow-red-600/50"
                  : "w-2 bg-zinc-600/70 hover:bg-zinc-400"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
