"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Play,
  Star,
  ChevronLeft,
  ChevronRight,
  Clock,
  Calendar,
  X,
  Flame,
} from "lucide-react";
import { Movie } from "@/types";
import { optimizeTmdbImage } from "@/lib/imageUtils";

interface BillboardHeroProps {
  items: Movie[];
}

export default function BillboardHero({ items }: BillboardHeroProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<"next" | "prev">("next");
  const [trailerMovie, setTrailerMovie] = useState<Movie | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  // Take top 6 recently added movies
  const movies = items && items.length > 0 ? items.slice(0, 6) : [];
  const total = movies.length;

  const nextSlide = useCallback(() => {
    if (total <= 1) return;
    setSlideDirection("next");
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    if (total <= 1) return;
    setSlideDirection("prev");
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (diff > 45) {
      nextSlide();
    } else if (diff < -45) {
      prevSlide();
    }
    setTouchStartX(null);
  };

  const goToSlide = useCallback(
    (index: number) => {
      if (index === currentIndex) return;
      setSlideDirection(index > currentIndex ? "next" : "prev");
      setCurrentIndex(index);
    },
    [currentIndex]
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "ArrowRight") nextSlide();
      if (e.key === "Escape" && trailerMovie) setTrailerMovie(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide, trailerMovie]);

  // Auto-advance slide every 7 seconds when not hovered
  useEffect(() => {
    if (isHovered || total <= 1 || trailerMovie) return;
    const interval = setInterval(nextSlide, 7000);
    return () => clearInterval(interval);
  }, [nextSlide, isHovered, total, trailerMovie]);

  if (total === 0) return null;

  const prevIndex = (currentIndex - 1 + total) % total;
  const nextIndex = (currentIndex + 1) % total;
  const prevMovie = movies[prevIndex];
  const nextMovie = movies[nextIndex];

  return (
    <div
      className="relative w-full my-2 sm:my-4 select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Outer Coverflow Slider Stage */}
      <div className="relative w-full h-[480px] sm:h-[520px] lg:h-[580px] overflow-hidden rounded-2xl sm:rounded-3xl bg-[#090A0D] border border-white/[0.08] shadow-2xl shadow-black/90">
        {/* ========================================================= */}
        {/* 1. LEFT PEEKING SLIDE (Previous Movie) - Hidden on Mobile  */}
        {/* ========================================================= */}
        <div
          onClick={prevSlide}
          className="absolute left-0 top-0 bottom-0 w-[14%] sm:w-[16%] lg:w-[18%] z-10 cursor-pointer overflow-hidden group/prev transition-transform hidden sm:block"
          title={`Previous: ${prevMovie.title}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={`prev-${prevMovie.id}`}
            src={optimizeTmdbImage(prevMovie.backdrop_url || prevMovie.poster_url || "", "backdrop")}
            alt={prevMovie.title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover object-center filter brightness-[0.55] group-hover/prev:brightness-[0.75] transition-all duration-700 scale-105"
          />
          {/* Dark vignetted fade toward the center */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-black/80" />

          {/* Peeking Title Preview */}
          <div className="absolute bottom-10 left-4 right-2 hidden xl:block opacity-60 group-hover/prev:opacity-90 transition">
            <h4 className="text-sm font-bold text-white truncate">{prevMovie.title}</h4>
            <span className="text-[10px] text-amber-400 font-bold">★ {Number(prevMovie.rating || 8.0).toFixed(1)}</span>
          </div>
        </div>

        {/* Left Arrow Button (Hidden on Mobile Touch) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            prevSlide();
          }}
          className="hidden sm:flex absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-black/75 hover:bg-[#E50000] border border-white/20 hover:border-red-500 text-white items-center justify-center transition-all duration-300 shadow-2xl hover:scale-110 cursor-pointer"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
        </button>

        {/* ========================================================= */}
        {/* 2. CENTER ACTIVE SLIDE (Full width on mobile, Coverflow on tablet/desktop) */}
        {/* ========================================================= */}
        <div className="absolute inset-y-0 left-0 right-0 sm:left-[14%] sm:right-[14%] lg:left-[16%] lg:right-[16%] z-20 overflow-hidden bg-[#0B0C0E] shadow-2xl">
          {movies.map((movie, idx) => {
            const isActive = idx === currentIndex;
            const isPrev = (currentIndex - 1 + total) % total === idx;
            const isNext = (currentIndex + 1) % total === idx;

            // Rating & Duration formatting
            const ratingNum = movie.rating ? Number(movie.rating) : 8.2;
            const starCount = Math.min(5, Math.max(1, Math.round(ratingNum / 2)));
            const formattedDuration = movie.duration_minutes
              ? `${Math.floor(movie.duration_minutes / 60)}h ${movie.duration_minutes % 60}m`
              : "2h 15m";
            const releaseYear = movie.release_year || "2024";

            return (
              <div
                key={movie.id}
                className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                  isActive
                    ? "opacity-100 z-10 translate-x-0"
                    : slideDirection === "next"
                    ? isPrev
                      ? "opacity-0 z-0 -translate-x-full pointer-events-none"
                      : "opacity-0 z-0 translate-x-full pointer-events-none"
                    : isNext
                    ? "opacity-0 z-0 translate-x-full pointer-events-none"
                    : "opacity-0 z-0 -translate-x-full pointer-events-none"
                }`}
              >
                {/* Backdrop Image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    optimizeTmdbImage(movie.backdrop_url || movie.poster_url, "backdrop") ||
                    "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1920&q=80"
                  }
                  alt={movie.title}
                  decoding="async"
                  className={`w-full h-full object-cover object-center filter brightness-[0.93] contrast-[1.05] transition-transform duration-[7000ms] ease-out ${
                    isActive ? "scale-105" : "scale-100"
                  }`}
                />

                {/* Gradients */}
                <div className="absolute inset-y-0 left-0 w-full max-w-2xl bg-gradient-to-r from-black/95 via-black/60 to-transparent pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/95 via-black/40 to-transparent pointer-events-none" />
                <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />

                {/* Slide Content Overlay */}
                {isActive && (
                  <div className="absolute inset-0 p-4 sm:p-10 lg:p-14 flex flex-col justify-between animate-in fade-in slide-in-from-left-6 duration-700 ease-out">
                    {/* Top Badges */}
                    <div className="flex items-center gap-2">
                      <span className="badge-streamit-4k font-mono shadow-md shadow-red-950/40 text-[9px] sm:text-[10px]">
                        4K ULTRA HD
                      </span>
                      <span className="px-2 sm:px-2.5 py-0.5 rounded-md bg-[#E50000]/20 border border-red-500/30 text-[9px] sm:text-[10px] font-black text-red-400 uppercase tracking-widest flex items-center gap-1">
                        <Flame className="w-3 h-3 fill-red-500 shrink-0" />
                        <span>RECENT #{idx + 1}</span>
                      </span>
                    </div>

                    {/* Bottom & Center Info Group */}
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 sm:gap-6 pb-6 sm:pb-0">
                      {/* Left Details Block */}
                      <div className="max-w-2xl space-y-2.5 sm:space-y-4">
                        {/* Movie Title */}
                        <h1 className="text-xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight line-clamp-2 drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
                          {movie.title}
                        </h1>

                        {/* Rating & Metadata Bar */}
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-[#E2E4E9]">
                          {/* Star Rating Icons */}
                          <div className="flex items-center gap-0.5 text-amber-400">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${
                                  star <= starCount
                                    ? "fill-amber-400 text-amber-400"
                                    : "text-zinc-600 fill-zinc-800"
                                }`}
                              />
                            ))}
                            <span className="text-white font-black ml-1 text-xs">
                              {ratingNum.toFixed(1)}
                            </span>
                          </div>

                          <div className="flex items-center px-1.5 py-0.5 rounded bg-[#F5C518] text-black font-extrabold text-[10px] sm:text-[11px] tracking-tight shadow-sm">
                            IMDb
                          </div>

                          <span className="px-1.5 sm:px-2 py-0.5 rounded border border-white/30 text-white/90 text-[10px] sm:text-[11px] font-bold">
                            PG-13
                          </span>

                          <span className="flex items-center gap-1 text-[#C2C6D1] text-[11px] sm:text-xs font-semibold">
                            <Clock className="w-3 h-3 text-[#8D92A0]" />
                            <span>{formattedDuration}</span>
                          </span>

                          <span className="flex items-center gap-1 text-[#C2C6D1] text-[11px] sm:text-xs font-semibold">
                            <Calendar className="w-3 h-3 text-[#8D92A0]" />
                            <span>{releaseYear}</span>
                          </span>
                        </div>

                        {/* Overview / Synopsis Text */}
                        <p className="text-xs sm:text-sm text-[#C2C6D1] line-clamp-2 sm:line-clamp-3 leading-relaxed max-w-xl font-normal drop-shadow">
                          {movie.overview ||
                            "Experience high-octane suspense and breathtaking cinematic action in 4K resolution. Stream without interruptions now on ScreenBoxBD."}
                        </p>

                        {/* Actions Row (Play Now + Watch Trailer) */}
                        <div className="pt-2 flex flex-wrap items-center gap-2.5 sm:gap-4">
                          <Link
                            href={`/movies/${movie.slug}`}
                            className="btn-screenbox-red px-6 sm:px-9 py-2.5 sm:py-3.5 rounded-xl font-extrabold text-xs sm:text-base flex items-center gap-2 shadow-xl shadow-red-950/60 active:scale-95 hover:scale-105 transition-all duration-300 cursor-pointer"
                          >
                            <span>Play Now</span>
                            <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white" />
                          </Link>

                          {/* Watch Trailer Button */}
                          <button
                            type="button"
                            onClick={() => setTrailerMovie(movie)}
                            className="btn-screenbox-dark px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-xl font-bold text-xs sm:text-base flex items-center gap-2 border border-white/15 hover:border-red-500/40 active:scale-95 transition-all duration-300 cursor-pointer"
                          >
                            <Play className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                            <span>Watch Trailer</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ========================================================= */}
        {/* 3. RIGHT PEEKING SLIDE (Next Movie) - Hidden on Mobile     */}
        {/* ========================================================= */}
        <div
          onClick={nextSlide}
          className="absolute right-0 top-0 bottom-0 w-[14%] sm:w-[16%] lg:w-[18%] z-10 cursor-pointer overflow-hidden group/next transition-transform hidden sm:block"
          title={`Next: ${nextMovie.title}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={`next-${nextMovie.id}`}
            src={optimizeTmdbImage(nextMovie.backdrop_url || nextMovie.poster_url || "", "backdrop")}
            alt={nextMovie.title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover object-center filter brightness-[0.55] group-hover/next:brightness-[0.75] transition-all duration-700 scale-105"
          />
          {/* Dark vignetted fade toward the center */}
          <div className="absolute inset-0 bg-gradient-to-l from-black/75 via-black/40 to-black/80" />

          {/* Peeking Title Preview */}
          <div className="absolute bottom-10 right-4 left-2 hidden xl:block opacity-60 group-hover/next:opacity-90 transition text-right">
            <h4 className="text-sm font-bold text-white truncate">{nextMovie.title}</h4>
            <span className="text-[10px] text-amber-400 font-bold">★ {Number(nextMovie.rating || 8.0).toFixed(1)}</span>
          </div>
        </div>

        {/* Right Arrow Button (Hidden on Mobile Touch) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            nextSlide();
          }}
          className="hidden sm:flex absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-black/75 hover:bg-[#E50000] border border-white/20 hover:border-red-500 text-white items-center justify-center transition-all duration-300 shadow-2xl hover:scale-110 cursor-pointer"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-6 h-6 stroke-[2.5]" />
        </button>

        {/* Slide Indicator Dots (Bottom Center) */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
          {movies.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => goToSlide(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                idx === currentIndex
                  ? "w-6 bg-[#E50000]"
                  : "w-1.5 bg-white/40 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 4. MODAL: "WATCH TRAILER" Lightbox Preview Dialog          */}
      {/* ========================================================= */}
      {trailerMovie && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl bg-[#111318] border border-white/15 rounded-2xl overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0B0C0E]">
              <div className="flex items-center gap-2">
                <span className="badge-streamit-4k">TRAILER</span>
                <h3 className="text-base sm:text-lg font-bold text-white truncate max-w-md">
                  {trailerMovie.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setTrailerMovie(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#E50000] flex items-center justify-center text-white transition cursor-pointer"
                aria-label="Close Trailer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Video Player Frame */}
            <div className="relative w-full aspect-video bg-black flex items-center justify-center">
              <iframe
                src={`https://vidlink.pro/movie/${trailerMovie.tmdb_id || trailerMovie.id}`}
                title={`Trailer - ${trailerMovie.title}`}
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                className="w-full h-full border-0"
              />
            </div>

            {/* Footer */}
            <div className="p-4 bg-[#0B0C0E] border-t border-white/10 flex items-center justify-between">
              <p className="text-xs text-[#9EA3B0] truncate">
                Official 4K Cinematic Preview for {trailerMovie.title}
              </p>
              <Link
                href={`/movies/${trailerMovie.slug}`}
                onClick={() => setTrailerMovie(null)}
                className="btn-screenbox-red px-5 py-2 text-xs font-bold rounded-lg flex items-center gap-1.5"
              >
                <span>Watch Full Movie</span>
                <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
