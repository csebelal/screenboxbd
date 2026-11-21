import { getMovies } from "@/lib/api";
import MoviesCategoryHub from "@/components/movies/MoviesCategoryHub";
import FullWidthMovieRail from "@/components/movies/FullWidthMovieRail";
import CategoryCollageSection from "@/components/home/CategoryCollageSection";
import Link from "next/link";
import { Film, Tv, X } from "lucide-react";

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

  // Deduplicate movies across all rails so sections never display identical duplicate cards!
  const usedIds = new Set<number>();

  // 1. Top 10 Blockbusters (highest rated)
  const top10Movies = (allTopRated.length >= 10 ? allTopRated : allPopular).slice(0, 10);
  top10Movies.forEach((m) => usedIds.add(m.id));

  // 2. Popular Movies (strictly excluding Top 10)
  const popularMovies = allPopular.filter((m) => !usedIds.has(m.id)).slice(0, 18);
  popularMovies.forEach((m) => usedIds.add(m.id));

  // 3. Upcoming & New Releases (15 movies)
  const upcomingMovies = allLatest.filter((m) => !usedIds.has(m.id)).slice(0, 16);
  upcomingMovies.forEach((m) => usedIds.add(m.id));

  // 4. Specials & Latest Movies (Portrait cards with real latest movies)
  const specialsMovies = allLatest.filter((m) => !usedIds.has(m.id)).slice(0, 16);
  specialsMovies.forEach((m) => usedIds.add(m.id));

  // 5. Movies Recommended For You (18 movies)
  const recommendedMovies = allTopRated.filter((m) => !usedIds.has(m.id)).slice(0, 16);

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-14 py-4 space-y-10 overflow-x-hidden">
      {/* 1. Cinema Catalog Directory Hub (30 Categories from Image 3, Search Bar, Quick Tags - Slider Removed) */}
      <MoviesCategoryHub
        currentGenre={currentGenre}
        currentSearch={currentSearch}
        activeTab={activeTab}
      />

      {/* Search / Filter Active State Banner */}
      {(currentSearch || currentGenre) && (
        <div className="flex items-center justify-between py-3 px-4 rounded-2xl bg-red-950/20 border border-red-500/20">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
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

      {/* 2. Top 10 Movies To Watch */}
      {top10Movies.length > 0 && (
        <FullWidthMovieRail
          title="Top 10 Movies To Watch"
          movies={top10Movies}
          variant="top10"
          viewAllLink="/movies?sort=rating"
        />
      )}

      {/* 3. Popular Movies */}
      {popularMovies.length > 0 && (
        <FullWidthMovieRail
          title="Popular Movies"
          movies={popularMovies}
          variant="portrait"
          viewAllLink="/movies?sort=popular"
        />
      )}

      {/* 4. Upcoming Movies */}
      {upcomingMovies.length > 0 && (
        <FullWidthMovieRail
          title="Upcoming Movies"
          movies={upcomingMovies}
          variant="portrait"
          viewAllLink="/movies?sort=latest"
        />
      )}

      {/* 5. Specials & Latest Movies */}
      {specialsMovies.length > 0 && (
        <FullWidthMovieRail
          title="Specials & Latest Movies"
          movies={specialsMovies}
          variant="portrait"
          viewAllLink="/movies?sort=latest"
        />
      )}

      {/* 6. Movies Recommended For You */}
      {recommendedMovies.length > 0 && (
        <FullWidthMovieRail
          title="Movies Recommended For You"
          movies={recommendedMovies}
          variant="portrait"
          viewAllLink="/movies?sort=popular"
        />
      )}

      {/* Empty State when no results found */}
      {allPopular.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-2xl bg-[#111318] border border-white/[0.08] my-8">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 mb-4">
            <Film className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            {currentSearch || currentGenre ? "No Titles Found" : "Movie Catalog Is Currently Empty"}
          </h3>
          <p className="text-sm text-[#9EA3B0] max-w-md mb-6">
            {currentSearch || currentGenre
              ? `We couldn't find any titles matching "${currentSearch || currentGenre}". Try another search term or reset filters.`
              : "All auto-imported movie titles have been cleared. Browse 200+ buffer-free Live TV channels now."}
          </p>
          <Link
            href="/tv"
            className="btn-screenbox-red px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2"
          >
            <Tv className="w-4 h-4" />
            <span>Watch Live TV</span>
          </Link>
        </div>
      )}

      {/* 9. Explore Our Wide Variety of Categories (2x2 Multi-Poster Collage Cards) */}
      <CategoryCollageSection />
    </div>
  );
}
