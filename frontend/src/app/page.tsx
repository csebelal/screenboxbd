import { getChannels, getMovies, getHomeData } from "@/lib/api";
import HeroMontage from "@/components/home/HeroMontage";
import LiveChannelsRail from "@/components/home/LiveChannelsRail";
import BanglaOttRail from "@/components/home/BanglaOttRail";
import FullWidthMovieRail from "@/components/movies/FullWidthMovieRail";
import CategoryCollageSection from "@/components/home/CategoryCollageSection";
import DeviceGrid from "@/components/home/DeviceGrid";
import FaqAccordion from "@/components/home/FaqAccordion";
import PricingSection from "@/components/home/PricingSection";

export const revalidate = 30; // ISR revalidate every 30 seconds

export default async function HomePage() {
  // Attempt single-query aggregated home payload first for maximum speed
  const homeData = await getHomeData();

  let heroMovies = homeData?.hero || [];
  let channels = homeData?.featured_channels || [];
  let popularMovies = homeData?.trending_movies || [];
  let latestMovies = homeData?.latest_movies || [];
  let banglaOttMovies = homeData?.bangla_ott_originals || [];
  let totalChannelsCount = channels.length;

  // Fallback to granular fetch if aggregated payload was empty or unavailable
  if (!homeData || channels.length === 0 || popularMovies.length === 0) {
    const [heroMoviesRes, channelsRes, moviesRes, latestRes, banglaOttRes] = await Promise.all([
      getMovies({ hero_slider: true, per_page: 10 }),
      getChannels({ per_page: 50 }),
      getMovies({ per_page: 30, sort: "popular" }),
      getMovies({ per_page: 25, sort: "latest" }),
      getMovies({ bangla_ott: true, per_page: 20 }),
    ]);

    heroMovies = heroMoviesRes?.data || [];
    channels = channelsRes?.data || [];
    popularMovies = moviesRes?.data || [];
    latestMovies = latestRes?.data || [];
    banglaOttMovies = banglaOttRes?.data || [];
    totalChannelsCount = channelsRes?.meta?.total || channels.length;
  }

  // If specific query returns few items, include any matching movies from pool
  if (banglaOttMovies.length === 0) {
    const combined = [...popularMovies, ...latestMovies];
    banglaOttMovies = combined.filter((m) => m.ott_platform);
  }

  const top10Movies = popularMovies.slice(0, 10);
  const featuredPopular = popularMovies.slice(0, 18);
  const specialsMovies = latestMovies.length > 0 ? latestMovies.slice(0, 18) : popularMovies.slice(10, 28);

  const moviePosters = popularMovies
    .map((m) => m.poster_url || m.backdrop_url)
    .filter(Boolean) as string[];

  return (
    <div className="space-y-8 sm:space-y-12 pb-16 w-full overflow-x-hidden">
      {/* 1. Hero Cinematic Showcase (2026 Trending / Admin Curated Slides) */}
      <HeroMontage movies={heroMovies.length > 0 ? heroMovies : popularMovies} posters={moviePosters} />

      {/* 2. Bangla Originals Dedicated Showcase */}
      {banglaOttMovies.length > 0 && (
        <BanglaOttRail movies={banglaOttMovies} />
      )}

      {/* 3. Live TV Channels Rail (Full Width) */}
      {channels.length > 0 && (
        <LiveChannelsRail
          channels={channels}
          totalChannels={totalChannelsCount}
        />
      )}

      {/* Full-width Movies Presentation Section */}
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-14 space-y-10">
        {/* 4. Top 10 Movies To Watch (Matching Reference Image 1 with bottom-right 3D rank numbers) */}
        {top10Movies.length > 0 && (
          <FullWidthMovieRail
            title="Top 10 Movies To Watch"
            movies={top10Movies}
            variant="top10"
            viewAllLink="/movies"
          />
        )}

        {/* 5. Popular Movies (Matching Reference Image 1) */}
        {featuredPopular.length > 0 && (
          <FullWidthMovieRail
            title="Popular Movies"
            movies={featuredPopular}
            variant="portrait"
            viewAllLink="/movies?sort=popular"
          />
        )}

        {/* 6. Specials & Latest Movies (Portrait cards matching Popular Movies) */}
        {specialsMovies.length > 0 && (
          <FullWidthMovieRail
            title="Specials & Latest Movies"
            movies={specialsMovies}
            variant="portrait"
            viewAllLink="/movies?sort=latest"
          />
        )}
      </div>

      {/* 7. Explore Our Wide Variety of Categories (Collage Cards) */}
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-14">
        <CategoryCollageSection />
      </div>

      {/* 8. Device Support Grid */}
      <DeviceGrid />

      {/* 9. Frequently Asked Questions Numbered Accordion */}
      <FaqAccordion />

      {/* 10. Choose The Plan That's Right For You */}
      <PricingSection />
    </div>
  );
}
