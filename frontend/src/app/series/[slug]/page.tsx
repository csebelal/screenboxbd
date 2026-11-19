import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";
import SeriesPlayer from "@/components/series/SeriesPlayer";
import CastCarousel from "@/components/movies/CastCarousel";
import ReviewSection from "@/components/movies/ReviewSection";
import MetadataSidebar from "@/components/movies/MetadataSidebar";
import { getSeriesBySlug } from "@/lib/api";
import { Movie } from "@/types";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const series = await getSeriesBySlug(slug);

  const title = series?.title || slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return {
    title: `${title} - Watch TV Series Online - ScreenBoxBD`,
    description: series?.overview || `Stream complete seasons and episodes of ${title} in HD on ScreenBoxBD.`,
  };
}

export default async function ShowWatchPage({ params }: PageProps) {
  const { slug } = await params;
  let series = await getSeriesBySlug(slug);

  if (!series) {
    // If not found in API, check fallback
    const title = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    series = {
      id: 999,
      tmdb_id: 66732,
      title: title || "Stranger Things",
      slug: slug,
      overview:
        "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.",
      poster_url:
        "https://images.unsplash.com/photo-1518676599649-7c77da3157a2?auto=format&fit=crop&w=600&q=80",
      backdrop_url:
        "https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=1920&q=80",
      first_air_date: "2023-07-01",
      release_year: "2023",
      rating: 8.7,
      genres: ["Sci-Fi TV", "Teen TV Shows", "Horror", "Drama"],
      is_featured: true,
      views: 84000,
      seasons: [
        {
          id: 1,
          season_number: 1,
          title: "Season 1",
          episodes: [
            {
              id: 101,
              episode_number: 1,
              title: "Chapter One: The Vanishing of Will Byers",
              duration_minutes: 48,
              overview: "On his way home from a friend's house, young Will sees something terrifying.",
            },
            {
              id: 102,
              episode_number: 2,
              title: "Chapter Two: The Weirdo on Maple Street",
              duration_minutes: 55,
              overview: "Lucas, Mike and Dustin try to talk to the girl they found in the woods.",
            },
          ],
        },
      ],
    };
  }

  // Adapter for MetadataSidebar which expects Movie type
  const metadataMovie: Movie = {
    id: series.id,
    tmdb_id: series.tmdb_id,
    title: series.title,
    slug: series.slug,
    ott_platform: series.ott_platform,
    overview: series.overview,
    poster_url: series.poster_url,
    backdrop_url: series.backdrop_url,
    trailer_url: series.trailer_url,
    release_date: series.first_air_date,
    release_year: series.release_year || "2024",
    duration_minutes: 50,
    rating: series.rating,
    genres: series.genres || [],
    cast: series.cast,
    director: series.director,
    director_avatar: series.director_avatar,
    languages: series.languages,
    is_featured: (series.is_featured ?? false),
    views: series.views || 1000,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Top Breadcrumb Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/movies?tab=shows"
          className="btn-screenbox-dark text-xs py-2 px-3.5 flex items-center gap-2 group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to TV Shows</span>
        </Link>

        <Link
          href={`/download/${series.id}`}
          className="btn-screenbox-red text-xs py-2 px-3.5 flex items-center gap-1.5 shadow-md"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Offline Seasons & Torrents</span>
        </Link>
      </div>

      {/* Main Interactive Cinema Series Player */}
      <div className="space-y-4">
        <SeriesPlayer series={series} />
      </div>

      {/* 2-Column Content Grid: Cast & Reviews (Left) + Metadata Sidebar (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 cols = 67%) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Cast Carousel */}
          <CastCarousel cast={series.cast} />

          {/* Customer Reviews Section */}
          <ReviewSection
            movieTitle={series.title}
            movieRating={series.rating}
            movieSlug={series.slug}
            genres={series.genres}
          />
        </div>

        {/* Right Column (4 cols = 33%) */}
        <div className="lg:col-span-4">
          <MetadataSidebar movie={metadataMovie} />
        </div>
      </div>
    </div>
  );
}
