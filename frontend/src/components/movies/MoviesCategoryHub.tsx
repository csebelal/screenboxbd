"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  X,
  Mic,
  SlidersHorizontal,
  ChevronDown,
  Globe,
  Layers,
  Monitor,
  Calendar,
  Clapperboard,
  Headphones,
  Star,
  Tv,
  Drama as DramaIcon,
  Swords,
  Crosshair,
  Smile,
  Rocket,
  Ghost,
  Heart,
  Mountain,
  Play,
} from "lucide-react";

interface MoviesCategoryHubProps {
  currentGenre?: string;
  currentSearch?: string;
  activeTab?: string;
}

// Popular Collections
const POPULAR_COLLECTIONS = [
  {
    name: "Top IMDb",
    href: "/movies?genre=Top+IMDb",
    icon: Star,
    badge: "TOP 250",
    badgeColor: "bg-amber-500/20 text-amber-300 border border-amber-500/30",
    isSpecial: true,
  },
  {
    name: "South Indian (Hindi Dubbed)",
    href: "/movies?genre=South+Indian",
    icon: Clapperboard,
    badge: "POPULAR",
    badgeColor: "bg-red-500/20 text-red-400 border border-red-500/30",
  },
  {
    name: "Bangla Cinema",
    href: "/movies?genre=Bangla",
    icon: Clapperboard,
    badge: "HOT",
    badgeColor: "bg-red-600 text-white font-black",
  },
  {
    name: "Dual Audio",
    href: "/movies?genre=Dual+Audio",
    icon: Headphones,
  },
  {
    name: "Bollywood",
    href: "/movies?genre=Bollywood",
    icon: Star,
  },
  {
    name: "Hollywood",
    href: "/movies?genre=Hollywood",
    icon: Star,
  },
  {
    name: "Web Series & TV Shows",
    href: "/movies?tab=shows",
    icon: Tv,
    isSpecial: true,
  },
  {
    name: "K-Drama & Anime",
    href: "/movies?genre=K-Drama",
    icon: DramaIcon,
  },
];

// 10 Visual Genres with custom artwork gradients & glowing icons
const VISUAL_GENRES = [
  {
    name: "Action",
    href: "/movies?genre=Action",
    icon: Swords,
    bgGradient: "from-red-950/80 via-red-900/40 to-black/90",
    glowColor: "text-red-400 group-hover:text-red-300",
    borderColor: "hover:border-red-500/60",
  },
  {
    name: "Thriller",
    href: "/movies?genre=Thriller",
    icon: Crosshair,
    bgGradient: "from-blue-950/80 via-indigo-950/40 to-black/90",
    glowColor: "text-cyan-400 group-hover:text-cyan-300",
    borderColor: "hover:border-cyan-500/60",
  },
  {
    name: "Comedy",
    href: "/movies?genre=Comedy",
    icon: Smile,
    bgGradient: "from-amber-950/80 via-yellow-950/40 to-black/90",
    glowColor: "text-amber-400 group-hover:text-amber-300",
    borderColor: "hover:border-amber-500/60",
  },
  {
    name: "Sci-Fi & Fantasy",
    href: "/movies?genre=Sci-Fi+%26+Fantasy",
    icon: Rocket,
    bgGradient: "from-purple-950/80 via-violet-950/40 to-black/90",
    glowColor: "text-purple-400 group-hover:text-purple-300",
    borderColor: "hover:border-purple-500/60",
  },
  {
    name: "Horror",
    href: "/movies?genre=Horror",
    icon: Ghost,
    bgGradient: "from-emerald-950/80 via-teal-950/40 to-black/90",
    glowColor: "text-teal-400 group-hover:text-teal-300",
    borderColor: "hover:border-teal-500/60",
  },
  {
    name: "Crime & Mystery",
    href: "/movies?genre=Crime+%26+Mystery",
    icon: Search,
    bgGradient: "from-slate-900/90 via-zinc-900/60 to-black/90",
    glowColor: "text-emerald-400 group-hover:text-emerald-300",
    borderColor: "hover:border-emerald-500/60",
  },
  {
    name: "Romance",
    href: "/movies?genre=Romance",
    icon: Heart,
    bgGradient: "from-pink-950/80 via-rose-950/40 to-black/90",
    glowColor: "text-pink-400 group-hover:text-pink-300",
    borderColor: "hover:border-pink-500/60",
  },
  {
    name: "Drama",
    href: "/movies?genre=Drama",
    icon: DramaIcon,
    bgGradient: "from-orange-950/80 via-amber-950/40 to-black/90",
    glowColor: "text-orange-400 group-hover:text-orange-300",
    borderColor: "hover:border-orange-500/60",
  },
  {
    name: "Adventure",
    href: "/movies?genre=Adventure",
    icon: Mountain,
    bgGradient: "from-sky-950/80 via-cyan-950/40 to-black/90",
    glowColor: "text-sky-400 group-hover:text-sky-300",
    borderColor: "hover:border-sky-500/60",
  },
  {
    name: "Animation",
    href: "/movies?genre=Animation",
    icon: Play,
    bgGradient: "from-blue-950/80 via-indigo-900/40 to-black/90",
    glowColor: "text-blue-400 group-hover:text-blue-300",
    borderColor: "hover:border-blue-500/60",
  },
];

export default function MoviesCategoryHub({
  currentGenre = "",
  currentSearch = "",
  activeTab = "movies",
}: MoviesCategoryHubProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(currentSearch);

  // Filter dropdown state
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const selectedGenre = searchParams.get("genre") || "All";
  const selectedLang = searchParams.get("lang") || "All";
  const selectedType = searchParams.get("type") || (activeTab === "shows" ? "Series" : "All");
  const selectedQuality = searchParams.get("quality") || "All";
  const selectedYear = searchParams.get("year") || "All";

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/movies?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      router.push("/movies");
    }
  };

  const applyFilter = (param: string, value: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    if (value === "All") {
      current.delete(param);
    } else {
      current.set(param, value);
    }
    setOpenDropdown(null);
    router.push(`/movies?${current.toString()}`);
  };

  const isCollectionActive = (item: (typeof POPULAR_COLLECTIONS)[0]) => {
    if (currentGenre && item.href.toLowerCase().includes(`genre=${currentGenre.toLowerCase()}`)) {
      return true;
    }
    if (activeTab === "shows" && item.name.includes("Web Series")) return true;
    return false;
  };

  const isGenreActive = (item: (typeof VISUAL_GENRES)[0]) => {
    if (currentGenre && item.href.toLowerCase().includes(`genre=${currentGenre.toLowerCase()}`)) {
      return true;
    }
    return false;
  };

  return (
    <section className="relative w-full overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-b from-[#11131c]/95 via-[#0b0c12]/98 to-[#06070a] p-5 sm:p-7 shadow-2xl backdrop-blur-2xl">
      {/* 3D Cinema Film Reel Artwork at Top Right */}
      <div className="pointer-events-none absolute -right-6 -top-10 w-72 h-72 opacity-25 sm:opacity-35 select-none overflow-hidden">
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full text-red-600/40 drop-shadow-[0_0_35px_rgba(229,0,0,0.5)] transform rotate-12"
          fill="none"
          stroke="currentColor"
        >
          {/* Film Reel Outer Rim */}
          <circle cx="100" cy="100" r="88" strokeWidth="6" stroke="rgba(255,255,255,0.15)" />
          <circle cx="100" cy="100" r="82" strokeWidth="2" stroke="rgba(229,0,0,0.6)" />
          {/* Film Spool Windows */}
          <circle cx="100" cy="55" r="22" strokeWidth="4" stroke="rgba(255,255,255,0.2)" fill="rgba(0,0,0,0.5)" />
          <circle cx="100" cy="145" r="22" strokeWidth="4" stroke="rgba(255,255,255,0.2)" fill="rgba(0,0,0,0.5)" />
          <circle cx="55" cy="100" r="22" strokeWidth="4" stroke="rgba(255,255,255,0.2)" fill="rgba(0,0,0,0.5)" />
          <circle cx="145" cy="100" r="22" strokeWidth="4" stroke="rgba(255,255,255,0.2)" fill="rgba(0,0,0,0.5)" />
          {/* Center Hub */}
          <circle cx="100" cy="100" r="28" strokeWidth="5" stroke="rgba(229,0,0,0.8)" fill="rgba(15,15,20,0.9)" />
          <circle cx="100" cy="100" r="10" strokeWidth="3" stroke="rgba(255,255,255,0.4)" fill="#E50000" />
        </svg>
      </div>

      {/* Ambient ambient glow */}
      <div className="pointer-events-none absolute -left-20 -top-20 w-80 h-80 rounded-full bg-red-600/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 -top-10 w-80 h-80 rounded-full bg-red-600/15 blur-3xl" />

      {/* 1. Header Section */}
      <div className="relative mb-5">
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
          Find Your Next <span className="text-[#E50000]">Watch</span>
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-[#8E95A5] font-medium">
          Search movies, series, web shows, and more
        </p>
      </div>

      {/* 2. Main Search Bar */}
      <div className="relative mb-4">
        <form onSubmit={handleSearch} className="relative flex w-full items-center gap-2.5">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#7F8596] transition-colors group-focus-within:text-red-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for movies, series or channels..."
              className="w-full rounded-2xl border border-red-500/20 bg-[#0A0B10]/95 py-3.5 pl-12 pr-20 text-xs sm:text-sm font-medium text-white placeholder-[#686E7E] shadow-[0_0_20px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)] transition-all duration-200 focus:border-red-500 focus:bg-[#0E1017] focus:outline-none focus:ring-2 focus:ring-red-500/20"
            />
            {/* Right icons inside input: Clear, Mic, Filter */}
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-2 text-[#7F8596]">
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="rounded-full p-1 hover:bg-white/10 hover:text-white transition"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <Mic className="h-4 w-4 hover:text-white cursor-pointer transition hidden sm:inline" />
              <SlidersHorizontal className="h-4 w-4 hover:text-white cursor-pointer transition" />
            </div>
          </div>

          <button
            type="submit"
            className="inline-flex h-[50px] shrink-0 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-600 via-[#E50000] to-red-600 px-6 sm:px-8 text-xs sm:text-sm font-bold text-white shadow-lg shadow-red-950/50 transition-all duration-200 hover:brightness-110 active:scale-[0.98] cursor-pointer"
          >
            <Search className="h-4 w-4" />
            <span>Search</span>
          </button>
        </form>
      </div>

      {/* 3. Dropdown Filter Row (Genre, Language, Type, Quality, Year) */}
      <div className="relative mb-6 flex flex-wrap items-center gap-2">
        {/* Genre Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpenDropdown(openDropdown === "genre" ? null : "genre")}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium text-[#C0C5D2] bg-[#12141D]/90 border border-white/[0.08] hover:border-white/[0.15] hover:text-white transition cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-[#73798B]" />
            <span>Genre: {selectedGenre}</span>
            <ChevronDown className="w-3 h-3 text-[#73798B]" />
          </button>
          {openDropdown === "genre" && (
            <div className="absolute top-full left-0 mt-1.5 w-48 max-h-56 overflow-y-auto rounded-xl bg-[#141622] border border-white/[0.1] shadow-2xl p-1 z-30">
              {["All", "Top IMDb", "Action", "Thriller", "Comedy", "Sci-Fi", "Horror", "Crime", "Romance", "Drama", "Animation"].map(
                (g) => (
                  <button
                    key={g}
                    onClick={() => applyFilter("genre", g)}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium text-[#B8BED0] hover:text-white hover:bg-white/[0.08] transition"
                  >
                    {g}
                  </button>
                )
              )}
            </div>
          )}
        </div>

        {/* Language Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpenDropdown(openDropdown === "lang" ? null : "lang")}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium text-[#C0C5D2] bg-[#12141D]/90 border border-white/[0.08] hover:border-white/[0.15] hover:text-white transition cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-[#73798B]" />
            <span>Language: {selectedLang}</span>
            <ChevronDown className="w-3 h-3 text-[#73798B]" />
          </button>
          {openDropdown === "lang" && (
            <div className="absolute top-full left-0 mt-1.5 w-44 rounded-xl bg-[#141622] border border-white/[0.1] shadow-2xl p-1 z-30">
              {["All", "Bangla", "Hindi", "English", "Tamil/Telugu", "Korean"].map((l) => (
                <button
                  key={l}
                  onClick={() => applyFilter("lang", l)}
                  className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium text-[#B8BED0] hover:text-white hover:bg-white/[0.08] transition"
                >
                  {l}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Type Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpenDropdown(openDropdown === "type" ? null : "type")}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium text-[#C0C5D2] bg-[#12141D]/90 border border-white/[0.08] hover:border-white/[0.15] hover:text-white transition cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-[#73798B]" />
            <span>Type: {selectedType}</span>
            <ChevronDown className="w-3 h-3 text-[#73798B]" />
          </button>
          {openDropdown === "type" && (
            <div className="absolute top-full left-0 mt-1.5 w-40 rounded-xl bg-[#141622] border border-white/[0.1] shadow-2xl p-1 z-30">
              {["All", "Movies", "Series", "TV Shows"].map((t) => (
                <button
                  key={t}
                  onClick={() => applyFilter("type", t)}
                  className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium text-[#B8BED0] hover:text-white hover:bg-white/[0.08] transition"
                >
                  {t}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quality Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpenDropdown(openDropdown === "quality" ? null : "quality")}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium text-[#C0C5D2] bg-[#12141D]/90 border border-white/[0.08] hover:border-white/[0.15] hover:text-white transition cursor-pointer"
          >
            <Monitor className="w-3.5 h-3.5 text-[#73798B]" />
            <span>Quality: {selectedQuality}</span>
            <ChevronDown className="w-3 h-3 text-[#73798B]" />
          </button>
          {openDropdown === "quality" && (
            <div className="absolute top-full left-0 mt-1.5 w-40 rounded-xl bg-[#141622] border border-white/[0.1] shadow-2xl p-1 z-30">
              {["All", "4K Ultra HD", "1080p FHD", "720p HD", "HDCAM"].map((q) => (
                <button
                  key={q}
                  onClick={() => applyFilter("quality", q)}
                  className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium text-[#B8BED0] hover:text-white hover:bg-white/[0.08] transition"
                >
                  {q}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Year Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpenDropdown(openDropdown === "year" ? null : "year")}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium text-[#C0C5D2] bg-[#12141D]/90 border border-white/[0.08] hover:border-white/[0.15] hover:text-white transition cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 text-[#73798B]" />
            <span>Year: {selectedYear}</span>
            <ChevronDown className="w-3 h-3 text-[#73798B]" />
          </button>
          {openDropdown === "year" && (
            <div className="absolute top-full left-0 mt-1.5 w-40 max-h-56 overflow-y-auto rounded-xl bg-[#141622] border border-white/[0.1] shadow-2xl p-1 z-30">
              {["All", "2026", "2025", "2024", "2023", "2022", "2021", "2020"].map((y) => (
                <button
                  key={y}
                  onClick={() => applyFilter("year", y)}
                  className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium text-[#B8BED0] hover:text-white hover:bg-white/[0.08] transition"
                >
                  {y}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 4. Popular Collections Section */}
      <div className="relative mb-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-3.5 rounded-full bg-red-600" />
          <h2 className="text-xs sm:text-sm font-bold text-white tracking-wide">
            Popular Collections
          </h2>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {POPULAR_COLLECTIONS.map((col) => {
            const Icon = col.icon;
            const active = isCollectionActive(col);
            return (
              <Link
                key={col.name}
                href={col.href}
                className={`inline-flex shrink-0 items-center gap-2 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-150 cursor-pointer ${
                  active
                    ? "bg-red-600 text-white shadow-lg shadow-red-950/60 border border-red-500"
                    : col.isSpecial
                    ? "bg-red-950/30 text-red-200 border border-red-500/30 hover:bg-red-600/20 hover:text-white"
                    : "bg-[#12141D]/90 text-[#C0C5D2] border border-white/[0.08] hover:border-red-500/30 hover:bg-red-600/10 hover:text-white"
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 ${
                    active ? "text-white" : col.isSpecial ? "text-red-400" : "text-[#7B8194]"
                  }`}
                />
                <span>{col.name}</span>
                {col.badge && (
                  <span
                    className={`ml-1 px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${col.badgeColor}`}
                  >
                    {col.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* 5. Browse by Genre Section (Visual Genre Cards matching Reference Image) */}
      <div className="relative">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-3.5 rounded-full bg-red-600" />
          <h2 className="text-xs sm:text-sm font-bold text-white tracking-wide">
            Browse by Genre
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2 sm:gap-2.5">
          {VISUAL_GENRES.map((genre) => {
            const Icon = genre.icon;
            const active = isGenreActive(genre);
            return (
              <Link
                key={genre.name}
                href={genre.href}
                className={`group relative flex flex-col items-center justify-center h-[68px] sm:h-[72px] rounded-2xl p-2 border transition-all duration-200 overflow-hidden cursor-pointer ${
                  genre.borderColor
                } ${
                  active
                    ? "border-red-500 ring-2 ring-red-500/40 bg-gradient-to-b from-red-900/60 to-black/90 shadow-lg shadow-red-950/60"
                    : `border-white/[0.08] bg-gradient-to-b ${genre.bgGradient} hover:scale-[1.03]`
                }`}
              >
                {/* Subtle dark ambient texture */}
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.06),transparent_70%)]" />

                <div className="relative flex flex-col items-center gap-1.5">
                  <Icon
                    className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 group-hover:scale-110 ${
                      active ? "text-white" : genre.glowColor
                    }`}
                  />
                  <span
                    className={`text-[10.5px] sm:text-[11.5px] font-bold tracking-tight text-center truncate max-w-full ${
                      active ? "text-white" : "text-[#D3D8E6] group-hover:text-white"
                    }`}
                  >
                    {genre.name}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
