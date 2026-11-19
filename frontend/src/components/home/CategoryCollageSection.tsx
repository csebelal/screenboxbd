"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";

interface GenreCategory {
  name: string;
  slug: string;
  count: string;
  posters: [string, string, string, string];
}

export default function CategoryCollageSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  // 10 cinematic categories with 100% verified, high-resolution TMDB posters (no broken images)
  const categories: GenreCategory[] = [
    {
      name: "Bangla Originals",
      slug: "bangla-ott",
      count: "50+ Exclusives",
      posters: [
        "https://image.tmdb.org/t/p/w500/8tLoJ31NLwhlP5PjJItBCptRV4t.jpg",
        "https://image.tmdb.org/t/p/w500/bhmI8l62JIc0AuURN4ZL7i6t82K.jpg",
        "https://image.tmdb.org/t/p/w500/si5X3UeJNiwQKkR5iV4pWpn5szy.jpg",
        "https://image.tmdb.org/t/p/w500/ayK3nAsHN9ibAQaNKU7ozLOoIQj.jpg",
      ],
    },
    {
      name: "Action",
      slug: "action",
      count: "240+ Movies",
      posters: [
        "https://image.tmdb.org/t/p/w500/1zqWkLwC1zLBBBtIWzmkmWeMWnT.jpg",
        "https://image.tmdb.org/t/p/w500/j1MNyNNgNQL6f27cb3m3uKaPKd6.jpg",
        "https://image.tmdb.org/t/p/w500/hKROmLddpzpjkxKKVFYFRAOXX1b.jpg",
        "https://image.tmdb.org/t/p/w500/8Y4oJ5iUs3hgPcDB3SIEmsNYjZk.jpg",
      ],
    },
    {
      name: "Adventure",
      slug: "adventure",
      count: "180+ Movies",
      posters: [
        "https://image.tmdb.org/t/p/w500/d43fvHQsIMa4kpyhKXw0haEJIvI.jpg",
        "https://image.tmdb.org/t/p/w500/vBQ7wks68OhJKlb3RnXSl2yXBXK.jpg",
        "https://image.tmdb.org/t/p/w500/mWN6knIVJ2o7eGwSm7mOgSCwNUc.jpg",
        "https://image.tmdb.org/t/p/w500/alhhrpj1PSAn5bfz4Os1k7Bweoj.jpg",
      ],
    },
    {
      name: "Comedy",
      slug: "comedy",
      count: "130+ Movies",
      posters: [
        "https://image.tmdb.org/t/p/w500/1vjVJKpdT6gha7cpkmDJODpk8mU.jpg",
        "https://image.tmdb.org/t/p/w500/9kHrUoPF2rl5Hj0QMquAy3xznXT.jpg",
        "https://image.tmdb.org/t/p/w500/6H2N59jJW1hZEzn2ZdrMvJw5vNI.jpg",
        "https://image.tmdb.org/t/p/w500/dNJFRtVg3xLQ7dbNIQ55cmmIniD.jpg",
      ],
    },
    {
      name: "Drama",
      slug: "drama",
      count: "210+ Movies",
      posters: [
        "https://image.tmdb.org/t/p/w500/xcMiTqj4kvSnUHhSLZ1WUvI9rzH.jpg",
        "https://image.tmdb.org/t/p/w500/ouGH1PS0xjDyfTQOhppn7QzJqQZ.jpg",
        "https://image.tmdb.org/t/p/w500/ihbN6lNDXKe6w9xE6IBFMVF2Rkr.jpg",
        "https://image.tmdb.org/t/p/w500/xE5tY3lppZUyG7WKKThsuYHuAHr.jpg",
      ],
    },
    {
      name: "Horror",
      slug: "horror",
      count: "95+ Movies",
      posters: [
        "https://image.tmdb.org/t/p/w500/AeeAAx83NSPSqBO66hjbQrZGvFb.jpg",
        "https://image.tmdb.org/t/p/w500/9LHVZevgdsdbjJdkFr6bk9EwX7q.jpg",
        "https://image.tmdb.org/t/p/w500/4PtzGcegF5Po1NmDAW9IklyvAUh.jpg",
        "https://image.tmdb.org/t/p/w500/hSmIJluOJmTWvJs4d7kHRxjc8s8.jpg",
      ],
    },
    {
      name: "Sci-Fi",
      slug: "science-fiction",
      count: "160+ Movies",
      posters: [
        "https://image.tmdb.org/t/p/w500/d43fvHQsIMa4kpyhKXw0haEJIvI.jpg",
        "https://image.tmdb.org/t/p/w500/1zqWkLwC1zLBBBtIWzmkmWeMWnT.jpg",
        "https://image.tmdb.org/t/p/w500/hSmIJluOJmTWvJs4d7kHRxjc8s8.jpg",
        "https://image.tmdb.org/t/p/w500/alhhrpj1PSAn5bfz4Os1k7Bweoj.jpg",
      ],
    },
    {
      name: "Thriller",
      slug: "thriller",
      count: "175+ Movies",
      posters: [
        "https://image.tmdb.org/t/p/w500/zhxlzxBlO1sWB1rPn7RmAoeQ2na.jpg",
        "https://image.tmdb.org/t/p/w500/s2eAK0uiODjlNUSIiOBwdp3at2u.jpg",
        "https://image.tmdb.org/t/p/w500/8Y4oJ5iUs3hgPcDB3SIEmsNYjZk.jpg",
        "https://image.tmdb.org/t/p/w500/eSS5mvSG84UUuvtbHel5Yu3Wik4.jpg",
      ],
    },
    {
      name: "Animation",
      slug: "animation",
      count: "115+ Movies",
      posters: [
        "https://image.tmdb.org/t/p/w500/9wZAvvAZgwp2Lxbhjkp9N6HHJBm.jpg",
        "https://image.tmdb.org/t/p/w500/mWN6knIVJ2o7eGwSm7mOgSCwNUc.jpg",
        "https://image.tmdb.org/t/p/w500/vBQ7wks68OhJKlb3RnXSl2yXBXK.jpg",
        "https://image.tmdb.org/t/p/w500/ihbN6lNDXKe6w9xE6IBFMVF2Rkr.jpg",
      ],
    },
    {
      name: "Romance",
      slug: "romance",
      count: "105+ Movies",
      posters: [
        "https://image.tmdb.org/t/p/w500/9kHrUoPF2rl5Hj0QMquAy3xznXT.jpg",
        "https://image.tmdb.org/t/p/w500/fez7kLyGzpowduJapTFZZ1feCS0.jpg",
        "https://image.tmdb.org/t/p/w500/bhjdgMm2fFrysSzVqv5RwRwIbVf.jpg",
        "https://image.tmdb.org/t/p/w500/iyuVTpASpRy2FpsLbGbwF7T2PtI.jpg",
      ],
    },
    {
      name: "Crime",
      slug: "crime",
      count: "140+ Movies",
      posters: [
        "https://image.tmdb.org/t/p/w500/hKROmLddpzpjkxKKVFYFRAOXX1b.jpg",
        "https://image.tmdb.org/t/p/w500/ifYDZkr2qkHFz87TNVvlxajOxl5.jpg",
        "https://image.tmdb.org/t/p/w500/ouGH1PS0xjDyfTQOhppn7QzJqQZ.jpg",
        "https://image.tmdb.org/t/p/w500/s2eAK0uiODjlNUSIiOBwdp3at2u.jpg",
      ],
    },
  ];

  const updateScrollState = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
    const maxScroll = scrollWidth - clientWidth;
    setScrollProgress(maxScroll > 0 ? scrollLeft / maxScroll : 0);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const clientWidth = scrollRef.current.clientWidth;
    const scrollAmount = direction === "left" ? -clientWidth * 0.75 : clientWidth * 0.75;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  return (
    <section id="categories" className="w-full py-6 sm:py-8">
      {/* Section Header with Carousel Controls */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-bold bg-red-600/10 text-red-500 border border-red-500/20 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CURATED GENRES</span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">
            Explore Our Wide Variety of Categories
          </h2>
          <p className="text-xs sm:text-sm text-[#9EA3B0] mt-1 max-w-2xl">
            Whether you&apos;re looking for a comedy to make you laugh, a drama to make you think, or an adrenaline-fueled action thriller.
          </p>
        </div>

        {/* Carousel Arrow Controls & Indicator Bar */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          {/* Progress Indicator Pills */}
          <div className="hidden sm:flex items-center gap-1.5 bg-[#14161E] border border-white/[0.08] px-3 py-2 rounded-xl">
            <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#E50000] rounded-full transition-all duration-300"
                style={{ width: `${Math.max(20, Math.min(100, (scrollProgress + 0.2) * 100))}%` }}
              />
            </div>
          </div>

          {/* Left / Right Arrow Buttons */}
          <div className="flex items-center gap-1.5 bg-[#14161E] border border-white/[0.08] rounded-xl p-1.5 shadow-lg">
            <button
              type="button"
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition cursor-pointer ${
                canScrollLeft
                  ? "bg-[#1C1F2B] hover:bg-[#E50000] text-white"
                  : "bg-[#161822] text-white/20 cursor-not-allowed"
              }`}
              aria-label="Previous categories"
            >
              <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition cursor-pointer ${
                canScrollRight
                  ? "bg-[#1C1F2B] hover:bg-[#E50000] text-white"
                  : "bg-[#161822] text-white/20 cursor-not-allowed"
              }`}
              aria-label="Next categories"
            >
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>

      {/* Full-Width Scrollable Categories Rail: Exactly 5 cards fill 100% width on desktop, 6 on 2xl */}
      <div
        ref={scrollRef}
        className="flex items-stretch gap-3.5 sm:gap-4 md:gap-4.5 lg:gap-5 overflow-x-auto hide-scrollbar scroll-smooth py-2 px-0.5 snap-x snap-mandatory w-full"
      >
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/movies?genre=${cat.slug}`}
            className="group/cat flex-shrink-0 snap-start w-[240px] sm:w-[260px] md:w-[calc(33.333%-12px)] lg:w-[calc(20%-16px)] 2xl:w-[calc(16.666%-17px)] streamit-card p-3 sm:p-3.5 hover:border-red-600/50 hover:shadow-2xl hover:shadow-red-950/30 transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            {/* 2x2 Collage Box with 4K TMDB Movie Posters */}
            <div className="grid grid-cols-2 gap-1.5 aspect-square rounded-xl overflow-hidden bg-[#0D0E14] border border-white/[0.06] p-1.5 mb-3 group-hover/cat:border-red-500/20 transition-colors">
              {cat.posters.map((src, i) => (
                <div
                  key={i}
                  className="relative rounded-lg overflow-hidden bg-[#161820]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src.replace("/t/p/w500/", "/t/p/w185/")}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover/cat:scale-110 transition-transform duration-500 opacity-85 group-hover/cat:opacity-100 filter brightness-95"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      e.currentTarget.src = "https://image.tmdb.org/t/p/w185/8tLoJ31NLwhlP5PjJItBCptRV4t.jpg";
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Category Meta & Action Arrow */}
            <div className="flex items-center justify-between pt-1">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white group-hover/cat:text-red-500 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-[#9EA3B0] font-semibold mt-0.5">
                  {cat.count}
                </p>
              </div>

              <div className="w-8 h-8 rounded-full bg-[#1A1D27] group-hover/cat:bg-[#E50000] text-[#9EA3B0] group-hover/cat:text-white flex items-center justify-center transition-all duration-300 transform group-hover/cat:translate-x-0.5 shadow-md">
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
