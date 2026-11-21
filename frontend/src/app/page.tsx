import { getChannels, getMovies, getHomeData } from "@/lib/api";
import HeroMontage from "@/components/home/HeroMontage";
import LiveChannelsRail from "@/components/home/LiveChannelsRail";
import BanglaOttRail from "@/components/home/BanglaOttRail";
import FullWidthMovieRail from "@/components/movies/FullWidthMovieRail";
import CategoryCollageSection from "@/components/home/CategoryCollageSection";
import DeviceGrid from "@/components/home/DeviceGrid";
import FaqAccordion from "@/components/home/FaqAccordion";
import PricingSection from "@/components/home/PricingSection";
import { Movie } from "@/types";

export const revalidate = 30; // ISR revalidate every 30 seconds

export default async function HomePage() {
  // Attempt single-query aggregated home payload first for maximum speed
  const homeData = await getHomeData();
  const showSubscriptions = Boolean(homeData?.settings?.enable_subscriptions);

  let heroMovies = homeData?.hero || [];
  let channels = homeData?.featured_channels || [];
  let rawTop10: Movie[] = homeData?.top_10 || [];
  let rawPopular: Movie[] = homeData?.popular_movies || homeData?.trending_movies || [];
  let rawLatest: Movie[] = homeData?.latest_movies || [];
  const rawAction: Movie[] = homeData?.action_movies || [];
  const rawBollywood: Movie[] = homeData?.bollywood_movies || [];
  const rawAnimation: Movie[] = homeData?.animation_movies || [];
  let banglaOttMovies = homeData?.bangla_ott_originals || [];
  let totalChannelsCount = channels.length;

  // Fallback to granular fetch if aggregated payload was empty or unavailable
  if (!homeData || channels.length === 0 || rawPopular.length === 0) {
    const [heroMoviesRes, channelsRes, moviesRes, latestRes, banglaOttRes, topRatedRes] = await Promise.all([
      getMovies({ hero_slider: true, per_page: 10 }),
      getChannels({ per_page: 50 }),
      getMovies({ per_page: 30, sort: "popular" }),
      getMovies({ per_page: 25, sort: "latest" }),
      getMovies({ bangla_ott: true, per_page: 20 }),
      getMovies({ per_page: 20, sort: "rating" }),
    ]);

    heroMovies = heroMoviesRes?.data || [];
    channels = channelsRes?.data || [];
    rawPopular = moviesRes?.data || [];
    rawLatest = latestRes?.data || [];
    rawTop10 = topRatedRes?.data || [];
    banglaOttMovies = banglaOttRes?.data || [];
    totalChannelsCount = channelsRes?.meta?.total || channels.length;
  }

  // If specific query returns few items, include any matching movies from pool
  if (banglaOttMovies.length === 0) {
    const combined = [...rawPopular, ...rawLatest];
    banglaOttMovies = combined.filter((m) => m.ott_platform);
  }

  // Strict deduplication across categories so Top 10, Popular, Latest etc. never duplicate!
  const usedIds = new Set<number>();

  const top10Movies = (rawTop10.length >= 10 ? rawTop10 : rawPopular).slice(0, 10);
  top10Movies.forEach((m) => usedIds.add(m.id));

  const popularMovies = rawPopular.filter((m) => !usedIds.has(m.id)).slice(0, 16);
  popularMovies.forEach((m) => usedIds.add(m.id));

  const latestMovies = rawLatest.filter((m) => !usedIds.has(m.id)).slice(0, 16);
  latestMovies.forEach((m) => usedIds.add(m.id));

  const actionMovies = rawAction.filter((m) => !usedIds.has(m.id)).slice(0, 16);
  actionMovies.forEach((m) => usedIds.add(m.id));

  const bollywoodMovies = rawBollywood.filter((m) => !usedIds.has(m.id)).slice(0, 16);
  bollywoodMovies.forEach((m) => usedIds.add(m.id));

  const animationMovies = rawAnimation.slice(0, 16);

  const moviePosters = [...top10Movies, ...popularMovies, ...latestMovies]
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

      {/* Full-width Movies Dynamic Presentation Sections */}
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-14 space-y-10">
        {/* 4. Top 10 Movies To Watch */}
        {top10Movies.length > 0 && (
          <FullWidthMovieRail
            title="Top 10 Movies To Watch"
            movies={top10Movies}
            variant="top10"
            viewAllLink="/movies?sort=rating"
          />
        )}

        {/* 5. Popular Movies (Distinct from Top 10) */}
        {popularMovies.length > 0 && (
          <FullWidthMovieRail
            title="Popular Movies"
            movies={popularMovies}
            variant="portrait"
            viewAllLink="/movies?sort=popular"
          />
        )}

        {/* 6. Specials & Latest 2026 Releases */}
        {latestMovies.length > 0 && (
          <FullWidthMovieRail
            title="Latest Releases (2026)"
            subtitle="Freshly added high-speed BDIX streams"
            movies={latestMovies}
            variant="portrait"
            viewAllLink="/movies?sort=latest"
          />
        )}

        {/* 7. Action & Blockbusters */}
        {actionMovies.length > 0 && (
          <FullWidthMovieRail
            title="Action & Blockbusters"
            subtitle="Adrenaline-pumping action and thriller movies"
            movies={actionMovies}
            variant="portrait"
            viewAllLink="/movies?genre=Action"
          />
        )}

        {/* 8. Bollywood & South Indian Cinema */}
        {bollywoodMovies.length > 0 && (
          <FullWidthMovieRail
            title="Bollywood & Hindi Hits"
            subtitle="Popular Indian cinema in 1080p high definition"
            movies={bollywoodMovies}
            variant="portrait"
            viewAllLink="/movies?genre=Drama"
          />
        )}

        {/* 9. Animation & Family Favorites */}
        {animationMovies.length > 0 && (
          <FullWidthMovieRail
            title="Animation & Family Corner"
            subtitle="Beloved animated adventures for everyone"
            movies={animationMovies}
            variant="portrait"
            viewAllLink="/movies?genre=Animation"
          />
        )}
      </div>

      {/* 10. Explore Our Wide Variety of Categories (Collage Cards) */}
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-14">
        <CategoryCollageSection />
      </div>

      {/* 11. Device Support Grid */}
      <DeviceGrid />

      {/* 12. Frequently Asked Questions Numbered Accordion */}
      <FaqAccordion />

      {/* 13. Choose The Plan That's Right For You (Admin controlled) */}
      {showSubscriptions && <PricingSection />}
    </div>
  );
}
