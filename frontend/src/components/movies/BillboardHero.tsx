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
  Sparkles,
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
      className="relative w-full my-4 select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Outer Coverflow Slider Stage */}
      <div className="relative w-full h-[460px] sm:h-[520px] lg:h-[580px] overflow-hidden rounded-3xl bg-[#090A0D] border border-white/[0.08] shadow-2xl shadow-black/90">
        {/* ========================================================= */}
        {/* 1. LEFT PEEKING SLIDE (Previous Movie)                     */}
        {/* ========================================================= */}
        <div
          onClick={prevSlide}
          className="absolute left-0 top-0 bottom-0 w-[14%] sm:w-[16%] lg:w-[18%] z-10 cursor-pointer overflow-hidden group/prev transition-transform"
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

        {/* Left Arrow Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            prevSlide();
          }}
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-black/75 hover:bg-[#E50000] border border-white/20 hover:border-red-500 text-white flex items-center justify-center transition-all duration-300 shadow-2xl hover:scale-110 cursor-pointer"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
        </button>

        {/* ========================================================= */}
        {/* 2. CENTER ACTIVE SLIDE (Direction-Aware Smooth Slide)      */}
        {/* ========================================================= */}
        <div className="absolute inset-y-0 left-[12%] right-[12%] sm:left-[14%] sm:right-[14%] lg:left-[16%] lg:right-[16%] z-20 overflow-hidden bg-[#0B0C0E] shadow-2xl">
          {movies.map((movie, idx) => {
            const isActive = idx === currentIndex;
            const isPrev = (currentIndex - 1 + total) % total === idx;
            const isNext = (currentIndex + 1) % total === idx;

            // Rating & Duration formatting
            const ratingNum = movie.rating ? Number(movie.rating) : 8.2;
            const starCount = Math.min(5, Math.max(1, Math.round(ratingNum / 2)));
            const formattedDuration = movie.duration_minutes
              ? `${Math.floor(movie.duration_minutes / 60)}hr : ${movie.duration_minutes % 60}m`
              : "2hr : 15m";
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
                {/* Backdrop Image with Slow Ken-Burns Camera Zoom & Vivid Highlighting */}
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

                {/* Cinematic Highlight Gradients: Focused on left text for legibility, open & vivid on center & right */}
                <div className="absolute inset-y-0 left-0 w-full max-w-2xl bg-gradient-to-r from-black/95 via-black/55 to-transparent pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/90 via-black/25 to-transparent pointer-events-none" />
                <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />

                {/* Slide Content Overlay with Staggered Entrance Animation */}
                {isActive && (
                  <div className="absolute inset-0 p-6 sm:p-10 lg:p-14 flex flex-col justify-between animate-in fade-in slide-in-from-left-6 duration-700 ease-out">
                    {/* Top Badges */}
                    <div className="flex items-center gap-2">
                      <span className="badge-streamit-4k font-mono shadow-md shadow-red-950/40">
                        4K ULTRA HD
                      </span>
                      <span className="px-2.5 py-0.5 rounded-md bg-[#E50000]/20 border border-red-500/30 text-[10px] font-black text-red-400 uppercase tracking-widest flex items-center gap-1">
                        <Flame className="w-3 h-3 fill-red-500" />
                        <span>RECENTLY ADDED #{idx + 1}</span>
                      </span>
                    </div>

                    {/* Bottom & Center Info Group */}
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                      {/* Left Details Block */}
                      <div className="max-w-2xl space-y-3.5 sm:space-y-4">
                        {/* Movie Title */}
                        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight line-clamp-2 drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
                          {movie.title}
                        </h1>

                        {/* Rating & Metadata Bar */}
                        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs text-[#E2E4E9]">
                          {/* Star Rating Icons */}
                          <div className="flex items-center gap-0.5 text-amber-400">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-3.5 h-3.5 ${
                                  star <= starCount
                                    ? "fill-amber-400 text-amber-400"
                                    : "text-zinc-600 fill-zinc-800"
                                }`}
                              />
                            ))}
                            <span className="text-white font-black ml-1.5 text-xs">
                              {ratingNum.toFixed(1)}
                            </span>
                          </div>

                          {/* Gold IMDb Badge */}
                          <div className="flex items-center px-1.5 py-0.5 rounded bg-[#F5C518] text-black font-extrabold text-[11px] tracking-tight shadow-sm">
                            IMDb
                          </div>

                          {/* PG Certification Badge */}
                          <span className="px-2 py-0.5 rounded border border-white/30 text-white/90 text-[11px] font-bold">
                            PG-13
                          </span>

                          {/* Duration */}
                          <span className="flex items-center gap-1 text-[#C2C6D1] text-xs font-semibold">
                            <Clock className="w-3.5 h-3.5 text-[#8D92A0]" />
                            <span>{formattedDuration}</span>
                          </span>

                          {/* Release Year */}
                          <span className="flex items-center gap-1 text-[#C2C6D1] text-xs font-semibold">
                            <Calendar className="w-3.5 h-3.5 text-[#8D92A0]" />
                            <span>{releaseYear}</span>
                          </span>
                        </div>

                        {/* Overview / Synopsis Text */}
                        <p className="text-xs sm:text-sm text-[#C2C6D1] line-clamp-2 sm:line-clamp-3 leading-relaxed max-w-xl font-normal drop-shadow">
                          {movie.overview ||
                            "Experience high-octane suspense and breathtaking cinematic action in 4K resolution. Stream without interruptions now on ScreenBoxBD."}
                        </p>

                        {/* Play Button Row */}
                        <div className="pt-2 flex items-center gap-4">
                          <Link
                            href={`/movies/${movie.slug}`}
                            className="btn-screenbox-red px-7 sm:px-9 py-3 sm:py-3.5 rounded-xl font-extrabold text-sm sm:text-base flex items-center gap-2.5 shadow-xl shadow-red-950/60 hover:scale-105 transition-all duration-300 cursor-pointer"
                          >
                            <span>Play Now</span>
                            <Play className="w-4 h-4 fill-white" />
                          </Link>
                        </div>
                      </div>

                      {/* Right Side: Circular "WATCH TRAILER" Action Button */}
                      <div className="self-start lg:self-center pb-2 lg:pb-0 lg:pr-8">
                        <button
                          type="button"
                          onClick={() => setTrailerMovie(movie)}
                          className="flex items-center gap-3 sm:gap-4 group/trailer cursor-pointer focus:outline-none"
                          aria-label={`Watch Trailer for ${movie.title}`}
                        >
                          <div className="w-14 h-14 sm:w-18 sm:h-18 rounded-full border-2 border-white/80 group-hover/trailer:border-[#E50000] backdrop-blur-md bg-white/10 group-hover/trailer:bg-[#E50000]/20 flex items-center justify-center transition-all duration-300 shadow-2xl group-hover/trailer:scale-110 shadow-black/80">
                            <Play className="w-6 h-6 sm:w-7 sm:h-7 text-white fill-white ml-0.5 group-hover/trailer:fill-[#E50000] group-hover/trailer:text-[#E50000] transition-colors" />
                          </div>
                          <div className="text-left">
                            <span className="block text-xs sm:text-sm font-black tracking-widest text-white uppercase group-hover/trailer:text-red-400 transition-colors">
                              WATCH TRAILER
                            </span>
                            <span className="text-[10px] text-[#9EA3B0] font-semibold">
                              Full HD 1080p
                            </span>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ========================================================= */}
        {/* 3. RIGHT PEEKING SLIDE (Next Movie)                        */}
        {/* ========================================================= */}
        <div
          onClick={nextSlide}
          className="absolute right-0 top-0 bottom-0 w-[14%] sm:w-[16%] lg:w-[18%] z-10 cursor-pointer overflow-hidden group/next transition-transform"
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

        {/* Right Arrow Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            nextSlide();
          }}
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-black/75 hover:bg-[#E50000] border border-white/20 hover:border-red-500 text-white flex items-center justify-center transition-all duration-300 shadow-2xl hover:scale-110 cursor-pointer"
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
                src={`https://vidsrc.to/embed/movie/${trailerMovie.tmdb_id || trailerMovie.id}`}
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
