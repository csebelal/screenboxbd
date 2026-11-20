"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { Movie } from "@/types";
import { Play, Tv, Star, Clock, ChevronLeft, ChevronRight, Flame } from "lucide-react";
import { optimizeTmdbImage } from "@/lib/imageUtils";

interface HeroSlide {
  id: number;
  title: string;
  tagline: string;
  overview: string;
  rating: number;
  year: string;
  duration: string;
  badge: string;
  backdropUrl: string;
  posterUrl: string;
  genres: string[];
  href: string;
}

interface HeroMontageProps {
  movies?: Movie[];
  posters?: string[];
}

export default function HeroMontage({ movies = [] }: HeroMontageProps) {
  // Convert real trending blockbusters from database into ultra-premium cinematic slides
  const slides: HeroSlide[] = useMemo(() => {
    if (movies && movies.length > 0) {
      return movies.slice(0, 8).map((m, idx) => {
        const is2026 = m.release_year === "2026" || (m.release_date && m.release_date.startsWith("2026"));
        const tagPrefix = is2026 ? "2026 BLOCKBUSTER" : "TRENDING BLOCKBUSTER";

        // Accurate formatting of real duration (e.g. 181m -> 3h 1m, 145m -> 2h 25m)
        const durationFormatted = m.duration_minutes && m.duration_minutes > 0
          ? `${Math.floor(m.duration_minutes / 60)}h ${m.duration_minutes % 60 > 0 ? (m.duration_minutes % 60) + "m" : ""}`
          : "2h 15m";

        const realYear = m.release_year || (m.release_date ? m.release_date.slice(0, 4) : "2026");
        const realRating = m.rating ? Math.min(9.8, Math.max(5.0, Number(m.rating))) : 8.2;

        return {
          id: m.id,
          title: m.title,
          tagline: Array.isArray(m.genres) && m.genres.length > 0 
            ? `${tagPrefix} #${idx + 1} • ${m.genres.slice(0, 2).join(" & ")}`
            : `${tagPrefix} #${idx + 1}`,
          overview:
            m.overview ||
            "Experience breathtaking cinematic suspense, stellar visuals, and immersive Dolby surround sound in ultra high definition.",
          rating: realRating,
          year: String(realYear),
          duration: durationFormatted,
          badge: idx === 0 ? "4K ULTRA HD" : idx === 1 ? "IMAX ENHANCED" : "DOLBY VISION",
          backdropUrl: optimizeTmdbImage(
            m.backdrop_url || m.poster_url || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1920&q=80",
            "backdrop"
          ),
          posterUrl: optimizeTmdbImage(m.poster_url || m.backdrop_url || "", "thumbnail"),
          genres: Array.isArray(m.genres) ? m.genres : ["Cinema", "Action"],
          href: `/movies/${m.slug}`,
        };
      });
    }

    // High quality Live TV showcase slide fallback
    return [
      {
        id: 1,
        title: "ScreenBoxBD Live TV",
        tagline: "LIVE STREAMING • 200+ Premium IPTV Channels",
        overview:
          "Enjoy 200+ high-speed buffer-free BDIX Live TV channels including Sports, News, Entertainment, and Infotainment with multi-server backup streams.",
        rating: 9.8,
        year: "2026",
        duration: "24/7 Live",
        badge: "BDIX ULTRA FAST",
        backdropUrl: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&w=1920&q=80",
        posterUrl: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&w=600&q=80",
        genres: ["Live TV", "IPTV", "Sports", "News"],
        href: "/tv",
      },
    ];
  }, [movies]);

  const [activeSlide, setActiveSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const slideCount = slides.length;

  const nextSlide = useCallback(() => {
    if (slideCount <= 1) return;
    setActiveSlide((prev) => (prev + 1) % slideCount);
  }, [slideCount]);

  const prevSlide = useCallback(() => {
    if (slideCount <= 1) return;
    setActiveSlide((prev) => (prev - 1 + slideCount) % slideCount);
  }, [slideCount]);

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

  // Auto advance slides every 7 seconds when not hovered
  useEffect(() => {
    if (isHovered || slideCount <= 1) return;
    const timer = setInterval(nextSlide, 7000);
    return () => clearInterval(timer);
  }, [nextSlide, isHovered, slideCount]);

  // Keyboard left / right arrow navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "ArrowRight") nextSlide();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide]);

  const current = slides[activeSlide] || slides[0];

  return (
    <div
      className="relative w-full h-[75vh] sm:h-[82vh] lg:h-[88vh] min-h-[620px] max-h-[880px] flex items-center overflow-hidden bg-[#07080B] select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* ===================================================================== */}
      {/* 1. CINEMATIC SLIDING BACKDROPS WITH HEADROOM PRESERVATION & FADE       */}
      {/* ===================================================================== */}
      {slides.map((slide, index) => {
        const isActive = index === activeSlide;
        const isPrev = (activeSlide - 1 + slideCount) % slideCount === index;

        return (
          <div
            key={slide.id + "-" + slide.title}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              isActive
                ? "opacity-100 z-10 translate-x-0 scale-100"
                : isPrev
                ? "opacity-0 z-0 -translate-x-8 scale-[1.01] pointer-events-none"
                : "opacity-0 z-0 translate-x-8 scale-[1.01] pointer-events-none"
            }`}
          >
            {/* Backdrop Image - Positioned to preserve focal center and headroom */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={slide.backdropUrl}
              alt={slide.title}
              className={`w-full h-full object-cover object-[center_20%] sm:object-[center_15%] filter brightness-[0.94] contrast-[1.05] transition-transform duration-[7000ms] ease-out ${
                isActive ? "scale-[1.02]" : "scale-100"
              }`}
            />
          </div>
        );
      })}

      {/* Cinematic Vignettes: Left gradient for text legibility, Bottom gradient for section blend */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C0E] via-[#0B0C0E]/30 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#07080B] via-[#07080B]/85 via-45% to-transparent max-w-4xl z-10 pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-44 bg-gradient-to-b from-black/60 via-black/15 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(229,0,0,0.12)_0%,_transparent_60%)] z-10 pointer-events-none" />

      {/* ===================================================================== */}
      {/* 2. DYNAMIC CONTENT CONTAINER (ANIMATES IN ON SLIDE CHANGE)            */}
      {/* ===================================================================== */}
      <div className="relative z-20 w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-14 pt-28 sm:pt-36 lg:pt-40 pb-16 sm:pb-20">
        <div key={current.id} className="max-w-2xl space-y-4 sm:space-y-5 animate-in fade-in slide-in-from-left-6 duration-700 ease-out">
          {/* Top Badges: Quality, Real Rating, Year, Duration, Audio */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            <span className="badge-streamit-4k font-mono shadow-md shadow-red-950/40 text-[9px] sm:text-[10px] tracking-wider">
              {current.badge}
            </span>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-amber-500/30 text-amber-300 text-xs font-bold shadow-sm">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{current.rating.toFixed(1)} IMDb</span>
            </div>

            <span className="text-xs font-semibold text-[#E2E4E9] bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/[0.08]">
              {current.year}
            </span>

            <span className="text-xs font-semibold text-[#C2C6D1] flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/[0.08]">
              <Clock className="w-3.5 h-3.5 text-[#9EA3B0]" />
              {current.duration}
            </span>

            <span className="hidden sm:inline-flex text-[11px] font-bold text-zinc-300 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/[0.08] uppercase tracking-wider">
              Dolby Atmos • 5.1
            </span>
          </div>

          {/* Title & Tagline */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] sm:text-xs font-black tracking-widest uppercase text-[#E50000] flex items-center gap-1.5 font-['Space_Grotesk'] bg-red-600/10 px-2.5 py-0.5 rounded-full border border-red-500/20">
                <Flame className="w-3.5 h-3.5 fill-red-500 shrink-0" />
                <span>{current.tagline}</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white tracking-tight leading-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]">
              {current.title}
            </h1>
          </div>

          {/* Synopsis */}
          <p className="text-xs sm:text-sm md:text-base text-[#D0D4DF] leading-relaxed line-clamp-2 sm:line-clamp-3 max-w-xl font-normal drop-shadow">
            {current.overview}
          </p>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5 sm:gap-4 pt-2 sm:pt-3">
            <Link
              href={current.href}
              className="btn-screenbox-red flex-1 sm:flex-initial px-6 sm:px-8 py-3.5 sm:py-4 text-xs sm:text-base rounded-xl flex items-center justify-center gap-2 shadow-xl shadow-red-950/60 active:scale-95 hover:scale-105 transition-all duration-300 cursor-pointer"
            >
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white text-[#E50000] flex items-center justify-center shrink-0">
                <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current ml-0.5" />
              </div>
              <span className="font-extrabold whitespace-nowrap">Watch Now</span>
            </Link>

            <Link
              href="/tv"
              className="btn-screenbox-dark flex-1 sm:flex-initial px-5 sm:px-7 py-3.5 sm:py-4 text-xs sm:text-base rounded-xl flex items-center justify-center gap-2 border-white/10 hover:border-red-500/40 active:scale-95 hover:scale-105 transition-all duration-300 cursor-pointer"
            >
              <Tv className="w-4 h-4 text-red-500 shrink-0" />
              <span className="whitespace-nowrap">Explore Live TV</span>
            </Link>
          </div>

          {/* Platform Metrics Highlights */}
          <div className="pt-4 sm:pt-6 border-t border-white/[0.08] grid grid-cols-3 gap-2 sm:gap-4 max-w-lg">
            <div>
              <p className="text-base sm:text-2xl font-black text-white">218+</p>
              <p className="text-[9px] sm:text-[11px] text-[#9EA3B0] uppercase font-semibold">Live Channels</p>
            </div>
            <div>
              <p className="text-base sm:text-2xl font-black text-white">100%</p>
              <p className="text-[9px] sm:text-[11px] text-[#9EA3B0] uppercase font-semibold">BDIX Speed</p>
            </div>
            <div>
              <p className="text-base sm:text-2xl font-black text-white">0s</p>
              <p className="text-[9px] sm:text-[11px] text-[#9EA3B0] uppercase font-semibold">Buffer Delay</p>
            </div>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 3. BOTTOM SLIDE NAVIGATION & THUMBNAIL DOCK                           */}
      {/* ===================================================================== */}
      <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-8 lg:right-12 z-20 flex items-center gap-2 sm:gap-4">
        {/* Next Slide Previews / Thumbnails (Laptop & Desktop) */}
        <div className="hidden xl:flex items-center gap-2 bg-black/60 backdrop-blur-md p-1.5 rounded-2xl border border-white/10">
          {slides.map((slide, idx) => {
            const isSlideActive = idx === activeSlide;
            return (
              <button
                key={slide.id}
                type="button"
                onClick={() => {
                  setActiveSlide(idx);
                }}
                className={`relative w-14 h-9 rounded-lg overflow-hidden border transition-all duration-300 cursor-pointer ${
                  isSlideActive
                    ? "border-[#E50000] ring-2 ring-red-500/60 scale-105 opacity-100"
                    : "border-white/15 opacity-50 hover:opacity-100 hover:border-white/40"
                }`}
                title={`Jump to ${slide.title}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={slide.posterUrl || slide.backdropUrl}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
              </button>
            );
          })}
        </div>

        {/* Slide Indicators & Navigation Controls */}
        <div className="flex items-center gap-2 bg-black/75 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/10 shadow-2xl">
          {/* Indicators */}
          <div className="flex items-center gap-1.5 mr-1">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setActiveSlide(i);
                }}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  i === activeSlide ? "w-6 bg-[#E50000]" : "w-1.5 bg-white/30 hover:bg-white/60"
                }`}
                title={`Slide ${i + 1}`}
              />
            ))}
          </div>

          {/* Prev / Next Buttons */}
          <button
            type="button"
            onClick={prevSlide}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-[#E50000] text-white flex items-center justify-center transition cursor-pointer"
            title="Previous Slide"
          >
            <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
          </button>

          <button
            type="button"
            onClick={nextSlide}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-[#E50000] text-white flex items-center justify-center transition cursor-pointer"
            title="Next Slide"
          >
            <ChevronRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
}
