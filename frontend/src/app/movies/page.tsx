import { getMovies } from "@/lib/api";
import BillboardHero from "@/components/movies/BillboardHero";
import FullWidthMovieRail from "@/components/movies/FullWidthMovieRail";
import CategoryCollageSection from "@/components/home/CategoryCollageSection";
import Link from "next/link";
import { Search, Film, Tv, Sparkles, X } from "lucide-react";

export const revalidate = 30;

interface MoviesPageProps {
  searchParams: Promise<{
    search?: string;
    genre?: string;
    tab?: "movies" | "shows" | "bangla_ott";
    page?: string;
  }>;
}

export default async function MoviesPage({ searchParams }: MoviesPageProps) {
  const params = await searchParams;
  const currentGenre = params.genre || "";
  const currentSearch = params.search || "";
  const activeTab = params.tab || "movies";
  const isBanglaOtt = activeTab === "bangla_ott" || currentGenre.toLowerCase().includes("bangla");

  // Fetch movies for all full-width rails
  const [popularRes, latestRes, topRatedRes] = await Promise.all([
    getMovies({
      genre: currentGenre || undefined,
      bangla_ott: isBanglaOtt || undefined,
      search: currentSearch || undefined,
      sort: "popular",
      per_page: 30,
    }),
    getMovies({
      bangla_ott: isBanglaOtt || undefined,
      sort: "latest",
      per_page: 25,
    }),
    getMovies({
      bangla_ott: isBanglaOtt || undefined,
      sort: "rating",
      per_page: 25,
    }),
  ]);

  const allPopular = popularRes?.data || [];
  const allLatest = latestRes?.data || [];
  const allTopRated = topRatedRes?.data || [];

  // 1. Recently Added Movies for Billboard Slider (always showing latest added)
  const heroMovies = allLatest.length >= 6 ? allLatest.slice(0, 6) : allPopular.slice(0, 6);

  // 2. Top 10 Blockbusters
  const top10Movies = allTopRated.length >= 10 ? allTopRated.slice(0, 10) : allPopular.slice(0, 10);

  // 3. Popular Movies (18 movies)
  const popularMovies = allPopular.slice(0, 18);

  // 4. Upcoming & New Releases (15 movies)
  const upcomingMovies = allLatest.slice(6, 21);

  // 5. Specials & Latest Movies (Portrait cards with real latest movies)
  const specialsMovies = allLatest.length >= 21 ? allLatest.slice(12, 28) : allPopular.slice(10, 28);

  // 6. Movies Recommended For You (18 movies)
  const recommendedMovies = allTopRated.slice(5, 23);

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-14 py-4 space-y-10 overflow-x-hidden">
      {/* 1. Cinematic 3-Slide Coverflow Billboard Slider (Latest 5 Movies) */}
      {heroMovies.length > 0 && <BillboardHero items={heroMovies} />}

      {/* 2. Top 10 Movies To Watch (Matching Reference Image 1 with bottom-right 3D numbers) */}
      {top10Movies.length > 0 && (
        <FullWidthMovieRail
          title="Top 10 Movies To Watch"
          movies={top10Movies}
          variant="top10"
          viewAllLink="/movies?sort=rating"
        />
      )}

      {/* 3. Popular Movies (Matching Reference Image 1) */}
      {popularMovies.length > 0 && (
        <FullWidthMovieRail
          title="Popular Movies"
          movies={popularMovies}
          variant="portrait"
          viewAllLink="/movies?sort=popular"
        />
      )}

      {/* 4. Upcoming Movies (Matching Reference Image 2) */}
      {upcomingMovies.length > 0 && (
        <FullWidthMovieRail
          title="Upcoming Movies"
          movies={upcomingMovies}
          variant="portrait"
          viewAllLink="/movies?sort=latest"
        />
      )}

      {/* 5. Specials & Latest Movies (Portrait cards matching Popular & Upcoming) */}
      {specialsMovies.length > 0 && (
        <FullWidthMovieRail
          title="Specials & Latest Movies"
          movies={specialsMovies}
          variant="portrait"
          viewAllLink="/movies?sort=latest"
        />
      )}

      {/* 6. Movies Recommended For You (Matching Reference Image 3) */}
      {recommendedMovies.length > 0 && (
        <FullWidthMovieRail
          title="Movies Recommended For You"
          movies={recommendedMovies}
          variant="portrait"
          viewAllLink="/movies?sort=popular"
        />
      )}

      {/* 7. Interactive Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-t border-b border-white/[0.08] py-6 my-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 bg-[#12141C] border border-white/[0.08] rounded-2xl p-1.5 self-start sm:self-auto">
          <Link
            href="/movies?tab=movies"
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              activeTab === "movies"
                ? "bg-[#E50000] text-white shadow-md shadow-red-950/40"
                : "text-[#9EA3B0] hover:text-white hover:bg-white/[0.04]"
            }`}
          >
            <Film className="w-4 h-4" />
            <span>Movies</span>
          </Link>

          <Link
            href="/movies?tab=shows"
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              activeTab === "shows"
                ? "bg-[#E50000] text-white shadow-md shadow-red-950/40"
                : "text-[#9EA3B0] hover:text-white hover:bg-white/[0.04]"
            }`}
          >
            <Tv className="w-4 h-4" />
            <span>TV Shows</span>
          </Link>

          <Link
            href="/movies?tab=bangla_ott"
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              activeTab === "bangla_ott"
                ? "bg-[#E50000] text-white shadow-md shadow-red-950/40"
                : "text-[#9EA3B0] hover:text-white hover:bg-white/[0.04]"
            }`}
          >
            <Sparkles className="w-4 h-4 fill-current" />
            <span>Bangla Originals</span>
          </Link>
        </div>

        {/* Search & Genre Filter Bar */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <form action="/movies" method="GET" className="relative flex-1 sm:w-80">
            <input type="hidden" name="tab" value={activeTab} />
            <input
              type="text"
              name="search"
              defaultValue={currentSearch}
              placeholder="Search by title, actor, or genre..."
              className="w-full bg-[#12141C] border border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-[#666C7A] focus:outline-none focus:border-red-500 transition"
            />
            <Search className="w-4 h-4 text-[#666C7A] absolute left-3.5 top-3" />
          </form>
        </div>
      </div>

      {/* Search / Filter Active State Banner */}
      {(currentSearch || currentGenre) && (
        <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {currentSearch ? `Search Results for "${currentSearch}"` : `Genre: ${currentGenre}`}
            </h2>
            <p className="text-xs text-[#9EA3B0] mt-0.5">
              Found {allPopular.length} title{allPopular.length === 1 ? "" : "s"}
            </p>
          </div>
          <Link
            href="/movies"
            className="btn-tactile inline-flex items-center gap-1.5 text-xs font-bold text-red-400 hover:text-white bg-red-600/10 hover:bg-red-600 border border-red-500/30 px-3 py-1.5 rounded-lg transition"
          >
            <span>Clear Filter</span>
            <X className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Empty State when no results found */}
      {allPopular.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-2xl bg-[#111318] border border-white/[0.08] my-8">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 mb-4">
            <Film className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No Titles Found</h3>
          <p className="text-sm text-[#9EA3B0] max-w-md mb-6">
            We couldn&apos;t find any titles matching &ldquo;{currentSearch || currentGenre}&rdquo;. Try another search term or reset filters.
          </p>
          <Link
            href="/movies"
            className="btn-screenbox-red px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold"
          >
            Clear All Filters
          </Link>
        </div>
      )}

      {/* 9. Explore Our Wide Variety of Categories (2x2 Multi-Poster Collage Cards) */}
      <CategoryCollageSection />
    </div>
  );
}
