import { getMovies, getMoviesCatalog, getSeries, MovieCatalogData } from "@/lib/api";
import MoviesCategoryHub from "@/components/movies/MoviesCategoryHub";
import FullWidthMovieRail from "@/components/movies/FullWidthMovieRail";
import CategoryCollageSection from "@/components/home/CategoryCollageSection";
import MovieCard from "@/components/movies/MovieCard";
import Link from "next/link";
import { Film, X, Filter } from "lucide-react";
import { Movie } from "@/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface MoviesPageProps {
  searchParams: Promise<{
    search?: string;
    genre?: string;
    language?: string;
    lang?: string;
    quality?: string;
    year?: string;
    sort?: "latest" | "rating" | "popular" | "oldest";
    tab?: "movies" | "shows" | "bangla_ott";
    type?: string;
    page?: string;
  }>;
}

export default async function MoviesPage({ searchParams }: MoviesPageProps) {
  const params = await searchParams;
  const currentGenre = params.genre || "";
  const currentSearch = params.search || "";
  const currentLanguage = params.language || params.lang || "";
  const currentQuality = params.quality || "";
  const currentYear = params.year || "";
  const currentSort = params.sort || "";
  const activeTab = params.tab || (params.type === "Series" || params.type === "TV Shows" ? "shows" : "movies");

  const hasActiveFilter = Boolean(
    currentSearch ||
    currentGenre ||
    currentLanguage ||
    currentQuality ||
    currentYear ||
    currentSort ||
    activeTab === "shows" ||
    activeTab === "bangla_ott"
  );

  let filteredMovies: Movie[] = [];
  let catalog: MovieCatalogData | null = null;

  if (hasActiveFilter) {
    if (activeTab === "shows") {
      const seriesRes = await getSeries({
        search: currentSearch || undefined,
        genre: currentGenre || undefined,
        per_page: 48,
      });
      // Map series to Movie format for uniform grid display
      filteredMovies = (seriesRes?.data || []).map((s) => ({
        id: s.id,
        tmdb_id: s.tmdb_id,
        imdb_id: s.imdb_id,
        title: s.title,
        slug: s.slug,
        ott_platform: s.ott_platform,
        overview: s.overview,
        poster_url: s.poster_url,
        backdrop_url: s.backdrop_url,
        release_date: s.first_air_date,
        release_year: s.first_air_date ? parseInt(s.first_air_date.substring(0, 4)) : 2024,
        duration_minutes: 45,
        rating: s.rating,
        genres: s.genres,
        cast: s.cast,
        languages: s.languages,
        is_published: true,
        is_featured: Boolean(s.is_featured),
        views: s.views || 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })) as unknown as Movie[];
    } else {
      // When a movie filter is selected, fetch filtered results
      const isBanglaOtt = activeTab === "bangla_ott";
      const moviesRes = await getMovies({
        search: currentSearch || undefined,
        genre: currentGenre || undefined,
        language: currentLanguage || undefined,
        quality: currentQuality || undefined,
        year: currentYear || undefined,
        sort: (currentSort as "latest" | "rating" | "popular" | "oldest") || "popular",
        bangla_ott: isBanglaOtt || undefined,
        per_page: 48,
      });
      filteredMovies = moviesRes?.data || [];
    }
  } else {
    // When on default catalog view, fetch all 16 rails in single high-speed call
    catalog = await getMoviesCatalog();

    // Fallback if catalog was unavailable
    if (!catalog) {
      const [popRes, latestRes, topRes] = await Promise.all([
        getMovies({ sort: "popular", per_page: 30 }),
        getMovies({ sort: "latest", per_page: 30 }),
        getMovies({ sort: "rating", per_page: 30 }),
      ]);
      const pop = popRes?.data || [];
      const lat = latestRes?.data || [];
      const top = topRes?.data || [];

      catalog = {
        top_10: top.slice(0, 10),
        trending: pop.slice(0, 18),
        recently_added: lat.slice(0, 18),
        box_office: top.slice(0, 18),
        coming_soon: lat.slice(0, 18),
        action: pop.filter((m) => m.genres?.includes("Action")).slice(0, 18),
        thriller: pop.filter((m) => m.genres?.includes("Thriller")).slice(0, 18),
        comedy: pop.filter((m) => m.genres?.includes("Comedy")).slice(0, 18),
        bangla: pop.filter((m) => m.genres?.some((g) => g.toLowerCase().includes("bangla"))).slice(0, 18),
        scifi_fantasy: pop.filter((m) => m.genres?.some((g) => g.includes("Science") || g.includes("Fantasy"))).slice(0, 18),
        horror: pop.filter((m) => m.genres?.includes("Horror")).slice(0, 18),
        crime_mystery: pop.filter((m) => m.genres?.some((g) => g.includes("Crime") || g.includes("Mystery"))).slice(0, 18),
        romance: pop.filter((m) => m.genres?.includes("Romance")).slice(0, 18),
        drama: pop.filter((m) => m.genres?.includes("Drama")).slice(0, 18),
        adventure: pop.filter((m) => m.genres?.includes("Adventure")).slice(0, 18),
        animation: pop.filter((m) => m.genres?.includes("Animation")).slice(0, 18),
      };
    }
  }

  // Active filter label generator
  const getFilterTitle = () => {
    if (currentSearch) return `Search: "${currentSearch}"`;
    if (currentGenre) return `Category: ${currentGenre}`;
    if (currentLanguage) return `Language: ${currentLanguage}`;
    if (currentYear) return `Year: ${currentYear}`;
    if (currentQuality) return `Quality: ${currentQuality}`;
    if (activeTab === "shows") return "Web Series & TV Shows";
    return "Filtered Titles";
  };

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-14 py-4 space-y-10 overflow-x-hidden">
      {/* 1. Cinema Catalog Directory Hub (Search, Quick Tags & Category Cards) */}
      <MoviesCategoryHub
        currentGenre={currentGenre}
        currentSearch={currentSearch}
        activeTab={activeTab}
      />

      {/* FILTER ACTIVE STATE: When user searches or clicks any category/filter */}
      {hasActiveFilter ? (
        <div className="space-y-6">
          {/* Active Filter Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-red-950/40 via-[#141620] to-[#10121A] border border-red-500/20 backdrop-blur-md shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-500 shadow-lg">
                <Filter className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-2">
                  <span>{getFilterTitle()}</span>
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                </h2>
                <p className="text-xs text-[#9EA3B0] mt-0.5">
                  Showing {filteredMovies.length} matching title{filteredMovies.length === 1 ? "" : "s"} &bull; Fast BDIX playback ready
                </p>
              </div>
            </div>

            <Link
              href="/movies"
              className="btn-tactile inline-flex items-center justify-center gap-1.5 text-xs font-bold text-red-400 hover:text-white bg-red-600/10 hover:bg-red-600 border border-red-500/30 px-4 py-2 rounded-xl transition self-start sm:self-auto"
            >
              <span>Clear Filter</span>
              <X className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Filtered Movie Results Grid */}
          {filteredMovies.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 sm:gap-4 md:gap-5">
              {filteredMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-2xl bg-[#111318] border border-white/[0.08] my-4">
              <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 mb-4">
                <Film className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No Titles Found</h3>
              <p className="text-sm text-[#9EA3B0] max-w-md mb-6">
                We couldn&apos;t find any titles matching &ldquo;{getFilterTitle()}&rdquo;. Try another filter or reset to browse all categories.
              </p>
              <Link
                href="/movies"
                className="btn-screenbox-red px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2"
              >
                <span>Browse All Movies</span>
              </Link>
            </div>
          )}
        </div>
      ) : (
        /* DEFAULT CATALOG VIEW: All 16 requested categories in exact specified order */
        catalog && (
          <div className="space-y-10 sm:space-y-12">
            {/* 1. ⭐ Top 10 Movies To Watch (FIRST, with ranking badge 1-10) */}
            {catalog.top_10.length > 0 && (
              <FullWidthMovieRail
                title="Top 10 Movies To Watch"
                subtitle="The highest-rated blockbusters and all-time favorites"
                movies={catalog.top_10}
                variant="top10"
                badge="TOP 10"
                viewAllLink="/movies?genre=Top+IMDb"
              />
            )}

            {/* 2. 🔥 Trending Now */}
            {catalog.trending.length > 0 && (
              <FullWidthMovieRail
                title="Trending Now"
                subtitle="Most-streamed titles across Bangladesh right now"
                movies={catalog.trending}
                variant="portrait"
                badge="HOT"
                viewAllLink="/movies?genre=Trending+Now"
              />
            )}

            {/* 3. ✨ Recently Added */}
            {catalog.recently_added.length > 0 && (
              <FullWidthMovieRail
                title="Recently Added"
                subtitle="Freshly indexed titles with 1080p BDIX high-speed streams"
                movies={catalog.recently_added}
                variant="portrait"
                badge="JUST ADDED"
                viewAllLink="/movies?genre=Recently+Added"
              />
            )}

            {/* 4. 🏆 Box Office Hits */}
            {catalog.box_office.length > 0 && (
              <FullWidthMovieRail
                title="Box Office Hits"
                subtitle="Global and regional box office record breakers"
                movies={catalog.box_office}
                variant="portrait"
                badge="BLOCKBUSTER"
                viewAllLink="/movies?genre=Box+Office+Hits"
              />
            )}

            {/* 5. ⏳ Coming Soon */}
            {catalog.coming_soon.length > 0 && (
              <FullWidthMovieRail
                title="Coming Soon"
                subtitle="Anticipated 2026 releases and upcoming blockbusters"
                movies={catalog.coming_soon}
                variant="portrait"
                badge="2026 RELEASES"
                viewAllLink="/movies?genre=Coming+Soon"
              />
            )}

            {/* 6. ⚔️ Action */}
            {catalog.action.length > 0 && (
              <FullWidthMovieRail
                title="Action"
                subtitle="High-octane thrillers, martial arts, and explosive spectacles"
                movies={catalog.action}
                variant="portrait"
                badge="ACTION"
                viewAllLink="/movies?genre=Action"
              />
            )}

            {/* 7. 🎯 Thriller */}
            {catalog.thriller.length > 0 && (
              <FullWidthMovieRail
                title="Thriller"
                subtitle="Nail-biting suspense and psychological twists"
                movies={catalog.thriller}
                variant="portrait"
                badge="THRILLER"
                viewAllLink="/movies?genre=Thriller"
              />
            )}

            {/* 8. 😄 Comedy */}
            {catalog.comedy.length > 0 && (
              <FullWidthMovieRail
                title="Comedy"
                subtitle="Feel-good humor, satire, and laugh-out-loud entertainment"
                movies={catalog.comedy}
                variant="portrait"
                badge="COMEDY"
                viewAllLink="/movies?genre=Comedy"
              />
            )}

            {/* 9. 🎬 Bangla */}
            {catalog.bangla.length > 0 && (
              <FullWidthMovieRail
                title="Bangla Cinema"
                subtitle="The best of Kolkata Bangla and Dhallywood cinema in HD"
                movies={catalog.bangla}
                variant="portrait"
                badge="BENGALI HITS"
                viewAllLink="/movies?genre=Bangla"
              />
            )}

            {/* 10. 🚀 Sci-Fi & Fantasy */}
            {catalog.scifi_fantasy.length > 0 && (
              <FullWidthMovieRail
                title="Sci-Fi & Fantasy"
                subtitle="Futuristic worlds, magical realms, and mind-bending universes"
                movies={catalog.scifi_fantasy}
                variant="portrait"
                badge="SCI-FI"
                viewAllLink="/movies?genre=Sci-Fi+%26+Fantasy"
              />
            )}

            {/* 11. 👻 Horror */}
            {catalog.horror.length > 0 && (
              <FullWidthMovieRail
                title="Horror"
                subtitle="Supernatural chills, haunted mysteries, and dark cinema"
                movies={catalog.horror}
                variant="portrait"
                badge="HORROR"
                viewAllLink="/movies?genre=Horror"
              />
            )}

            {/* 12. 🔍 Crime & Mystery */}
            {catalog.crime_mystery.length > 0 && (
              <FullWidthMovieRail
                title="Crime & Mystery"
                subtitle="Detective investigations, mob stories, and dark secrets"
                movies={catalog.crime_mystery}
                variant="portrait"
                badge="CRIME"
                viewAllLink="/movies?genre=Crime+%26+Mystery"
              />
            )}

            {/* 13. 💖 Romance */}
            {catalog.romance.length > 0 && (
              <FullWidthMovieRail
                title="Romance"
                subtitle="Timeless love stories, romantic comedies, and heartfelt drama"
                movies={catalog.romance}
                variant="portrait"
                badge="ROMANCE"
                viewAllLink="/movies?genre=Romance"
              />
            )}

            {/* 14. 🎭 Drama */}
            {catalog.drama.length > 0 && (
              <FullWidthMovieRail
                title="Drama"
                subtitle="Powerful narratives, emotional depth, and award winners"
                movies={catalog.drama}
                variant="portrait"
                badge="DRAMA"
                viewAllLink="/movies?genre=Drama"
              />
            )}

            {/* 15. 🏔️ Adventure */}
            {catalog.adventure.length > 0 && (
              <FullWidthMovieRail
                title="Adventure"
                subtitle="Epic quests, jungle explorations, and daring journeys"
                movies={catalog.adventure}
                variant="portrait"
                badge="ADVENTURE"
                viewAllLink="/movies?genre=Adventure"
              />
            )}

            {/* 16. 🎨 Animation */}
            {catalog.animation.length > 0 && (
              <FullWidthMovieRail
                title="Animation"
                subtitle="Anime masterpieces, Disney-Pixar favorites, and family cinema"
                movies={catalog.animation}
                variant="portrait"
                badge="ANIMATION"
                viewAllLink="/movies?genre=Animation"
              />
            )}
          </div>
        )
      )}

      {/* Explore Our Wide Variety of Categories (Collage Cards) */}
      <CategoryCollageSection />
    </div>
  );
}
