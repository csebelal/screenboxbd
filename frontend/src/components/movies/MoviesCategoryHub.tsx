"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

interface MoviesCategoryHubProps {
  currentGenre?: string;
  currentSearch?: string;
  activeTab?: string;
}

interface CategoryItem {
  name: string;
  href: string;
  isAccent?: boolean;
  badge?: string;
}

// Exact 30 categories from Image 3, optimized for compact multi-column grid
const ALL_CATEGORIES: CategoryItem[] = [
  // Row 1 - Headliners
  { name: "Movies", href: "/movies?tab=movies", isAccent: true },
  { name: "TVShows", href: "/movies?tab=shows", isAccent: true },
  { name: "Bangla", href: "/movies?genre=Bangla", isAccent: true, badge: "HOT" },
  { name: "Bollywood", href: "/movies?genre=Bollywood" },
  { name: "South Indian", href: "/movies?genre=South+Indian" },
  { name: "4K Collection", href: "/movies?genre=4K", isAccent: true, badge: "UHD" },

  // Row 2 - Formats & Trending
  { name: "Trending", href: "/movies?sort=popular", isAccent: true, badge: "TOP" },
  { name: "Ongoing Series", href: "/movies?genre=Ongoing+Series" },
  { name: "HDCAM-Hallprint", href: "/movies?genre=HDCAM-Hallprint" },
  { name: "Action", href: "/movies?genre=Action" },
  { name: "Animation", href: "/movies?genre=Animation" },
  { name: "Genre List", href: "#categories-grid" },

  // Row 3 - Popular Genres
  { name: "Crime", href: "/movies?genre=Crime" },
  { name: "Comedy", href: "/movies?genre=Comedy" },
  { name: "Drama", href: "/movies?genre=Drama" },
  { name: "Documentary", href: "/movies?genre=Documentary" },
  { name: "Fantasy", href: "/movies?genre=Fantasy" },
  { name: "Family", href: "/movies?genre=Family" },

  // Row 4 - Thrill & Regional
  { name: "Horror", href: "/movies?genre=Horror" },
  { name: "History", href: "/movies?genre=History" },
  { name: "K-Drama", href: "/movies?genre=K-Drama" },
  { name: "Music", href: "/movies?genre=Music" },
  { name: "Mystery", href: "/movies?genre=Mystery" },
  { name: "Romance", href: "/movies?genre=Romance" },

  // Row 5 - Sci-Fi & Legal
  { name: "Sci-Fic", href: "/movies?genre=Sci-Fi" },
  { name: "SuperHero", href: "/movies?genre=Superhero" },
  { name: "Slasher", href: "/movies?genre=Slasher" },
  { name: "Thriller", href: "/movies?genre=Thriller" },
  { name: "War", href: "/movies?genre=War" },
  { name: "Privacy Policy", href: "/privacy" },
];

export default function MoviesCategoryHub({
  currentGenre = "",
  currentSearch = "",
  activeTab = "movies",
}: MoviesCategoryHubProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState(currentSearch);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/movies?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      router.push("/movies");
    }
  };

  const isItemActive = (item: CategoryItem) => {
    if (currentGenre && item.href.toLowerCase().includes(`genre=${currentGenre.toLowerCase()}`)) {
      return true;
    }
    if (activeTab === "shows" && item.name === "TVShows") return true;
    if (activeTab === "movies" && item.name === "Movies" && !currentGenre && !currentSearch) return true;
    return false;
  };

  return (
    <section className="relative w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-white/[0.08] bg-gradient-to-b from-[#12141F]/90 via-[#0B0C12]/95 to-[#07080C] p-3 sm:p-5 shadow-2xl backdrop-blur-2xl">
      {/* Ambient background glow accents */}
      <div className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-red-600/10 blur-2xl" />
      <div className="pointer-events-none absolute -right-16 -bottom-16 h-48 w-48 rounded-full bg-red-500/10 blur-2xl" />

      {/* 1. Large High-Contrast Search Bar (Inspired by Reference Image 2) */}
      <div className="relative mb-3.5 sm:mb-4">
        <form onSubmit={handleSearch} className="relative flex w-full items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-[#7F8596] transition-colors" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Movie বা Series-এর English নাম লিখুন..."
              className="w-full rounded-xl sm:rounded-2xl border border-white/[0.12] bg-[#0A0B10]/90 py-2.5 sm:py-3 pl-10 sm:pl-12 pr-9 text-xs sm:text-sm font-medium text-white placeholder-[#686E7E] shadow-inner transition-all duration-200 focus:border-red-500 focus:bg-[#0E1017] focus:outline-none focus:ring-2 focus:ring-red-500/20"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 hover:bg-white/10 hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="ml-2 inline-flex h-[42px] sm:h-[46px] items-center justify-center gap-1.5 sm:gap-2 rounded-xl sm:rounded-2xl bg-gradient-to-r from-red-600 to-[#E50000] px-4 sm:px-6 text-xs sm:text-sm font-bold text-white shadow-lg shadow-red-950/50 transition-all duration-200 hover:brightness-110 active:scale-[0.98] cursor-pointer"
          >
            <Search className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span>Search</span>
          </button>
        </form>
      </div>

      {/* 2. Optimized Compact 30 Categories Grid (Takes minimal space, clean scannable buttons) */}
      <div id="categories-grid" className="relative">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-1.5 sm:gap-2">
          {ALL_CATEGORIES.map((item) => {
            const active = isItemActive(item);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center justify-between h-8 sm:h-9 px-2.5 rounded-xl text-[11px] sm:text-xs font-semibold transition-all duration-150 cursor-pointer ${
                  active
                    ? "bg-red-600 text-white shadow-md shadow-red-950/50"
                    : item.isAccent
                    ? "bg-red-950/25 text-red-300 hover:bg-red-600/20 hover:text-white border border-red-500/30"
                    : "bg-[#10121C]/80 text-[#B0B6C7] hover:bg-white/[0.06] hover:text-white border border-white/[0.06]"
                }`}
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <span
                    className={`text-[9px] shrink-0 transition-transform duration-150 group-hover:translate-x-0.5 ${
                      active
                        ? "text-white"
                        : item.isAccent
                        ? "text-red-400"
                        : "text-[#585E70] group-hover:text-red-400"
                    }`}
                  >
                    ▶
                  </span>
                  <span className="truncate">{item.name}</span>
                </div>

                {item.badge && (
                  <span
                    className={`ml-1 shrink-0 rounded px-1 py-0.2 text-[8px] font-extrabold uppercase tracking-wide ${
                      active
                        ? "bg-white text-red-600"
                        : "bg-red-500/20 text-red-400 border border-red-500/30"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
