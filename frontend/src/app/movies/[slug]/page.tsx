import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMovieBySlug } from "@/lib/api";
import MoviePlayer from "@/components/player/MoviePlayer";
import CastCarousel from "@/components/movies/CastCarousel";
import MetadataSidebar from "@/components/movies/MetadataSidebar";
import ScreenBoxMovieCard from "@/components/movies/ScreenBoxMovieCard";
import Link from "next/link";
import { Play, Plus, ThumbsUp, ArrowLeft, Download, Star } from "lucide-react";
import { sanitizePosterUrl } from "@/lib/imageUtils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const movie = await getMovieBySlug(slug);

  if (!movie) {
    return {
      title: "Movie Not Found - ScreenBoxBD",
      description: "This title is not available.",
    };
  }

  return {
    title: `${movie.title} (${movie.release_year || "4K"}) - ScreenBoxBD`,
    description: movie.overview || `Watch ${movie.title} online in HD on ScreenBoxBD.`,
  };
}

export default async function MovieWatchPage({ params }: PageProps) {
  const { slug } = await params;

  const movie = await getMovieBySlug(slug);

  if (!movie) {
    notFound();
  }

  const streams = movie.streams || [];
  const relatedMovies = movie.related || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Top Breadcrumb Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/movies"
          className="btn-screenbox-dark text-xs py-2 px-3.5 flex items-center gap-2 group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Movies & Shows</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href={`/download/${movie.id}`}
            className="btn-screenbox-red text-xs py-2 px-3.5 flex items-center gap-1.5 shadow-md"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Offline Download</span>
          </Link>
        </div>
      </div>

      {/* Top Player / Hero Stage */}
      <div className="space-y-4">
        {streams.length > 0 ? (
          <div className="rounded-3xl overflow-hidden border border-white/10 bg-black shadow-2xl shadow-black/90">
            <MoviePlayer
              streams={streams}
              posterUrl={sanitizePosterUrl(movie.poster_url) || undefined}
              backdropUrl={sanitizePosterUrl(movie.backdrop_url) || undefined}
              movieTitle={movie.title}
            />
          </div>
        ) : (
          <div className="relative aspect-[16/9] sm:aspect-[21/9] max-h-[520px] rounded-3xl overflow-hidden border border-white/10 bg-[#0B0C0E] shadow-2xl shadow-black/80">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={sanitizePosterUrl(movie.backdrop_url) || sanitizePosterUrl(movie.poster_url) || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1920&q=80"}
              alt={movie.title}
              className="w-full h-full object-cover filter brightness-[0.7]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C0E] via-[#0B0C0E]/50 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 space-y-3 max-w-3xl">
              <div className="flex items-center gap-2">
                <span className="badge-streamit-4k">4K ULTRA HD</span>
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md border border-amber-500/30 text-amber-300 text-xs font-bold">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>{movie.rating ? Number(movie.rating).toFixed(1) : "8.6"}</span>
                </div>
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
                {movie.title}
              </h1>

              <p className="text-xs sm:text-sm text-[#9EA3B0] line-clamp-2 max-w-2xl">
                {movie.overview}
              </p>

              <div className="flex items-center gap-3 pt-2">
                <Link
                  href={`/download/${movie.id}`}
                  className="btn-screenbox-red px-6 py-3 text-sm flex items-center gap-2"
                >
                  <Play className="w-4 h-4 fill-white ml-0.5" />
                  <span>Play Stream</span>
                </Link>

                <button
                  type="button"
                  className="w-10 h-10 rounded-xl bg-[#14161E]/80 border border-white/10 text-white flex items-center justify-center hover:bg-[#1E212B] transition"
                  title="Add to Watchlist"
                >
                  <Plus className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  className="w-10 h-10 rounded-xl bg-[#14161E]/80 border border-white/10 text-white flex items-center justify-center hover:bg-[#1E212B] transition"
                  title="Like"
                >
                  <ThumbsUp className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2-Column Content Grid: Cast & Recommendations (Left) + Metadata Sidebar (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 cols = 67%) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Cast & Crew Carousel */}
          <CastCarousel cast={movie.cast} />

          {/* More Like This / Recommended Titles */}
          {relatedMovies.length > 0 && (
            <div className="streamit-card p-6 space-y-5">
              <div>
                <h3 className="text-base sm:text-lg font-black text-white">
                  More Like This
                </h3>
                <p className="text-xs text-[#9EA3B0] mt-0.5">
                  Recommended movies similar to {movie.title}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {relatedMovies.slice(0, 8).map((m) => (
                  <ScreenBoxMovieCard key={m.id} movie={m} badgeType="rating" />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column (4 cols = 33%) */}
        <div className="lg:col-span-4">
          <MetadataSidebar movie={movie} />
        </div>
      </div>
    </div>
  );
}
