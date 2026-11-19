import Link from "next/link";
import { Tv, Home, Film } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-6 overflow-hidden">
      {/* Ambient Red Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* 404 Emblem */}
      <div className="relative z-10 w-24 h-24 rounded-3xl bg-[#14161E] border border-white/10 flex items-center justify-center shadow-2xl shadow-red-950/40">
        <Tv className="w-12 h-12 text-[#E50000] animate-pulse" />
      </div>

      {/* 404 Headline */}
      <div className="relative z-10 space-y-2 max-w-md">
        <span className="text-xs font-mono font-bold text-red-500 uppercase tracking-widest">
          ERROR 404 &bull; CONTENT NOT FOUND
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Lost in the Stream
        </h1>
        <p className="text-xs sm:text-sm text-[#9EA3B0] leading-relaxed">
          The movie, TV show, or live channel you requested does not exist or has been shifted to another stream server.
        </p>
      </div>

      {/* Action Navigation Buttons */}
      <div className="relative z-10 flex flex-wrap items-center justify-center gap-3 pt-2">
        <Link
          href="/"
          className="btn-screenbox-red text-xs sm:text-sm py-3 px-6 flex items-center gap-2 shadow-lg shadow-red-950/40"
        >
          <Home className="w-4 h-4" />
          <span>Return Home</span>
        </Link>

        <Link
          href="/tv"
          className="btn-screenbox-dark text-xs sm:text-sm py-3 px-5 flex items-center gap-2"
        >
          <Tv className="w-4 h-4 text-red-500" />
          <span>Live TV Hub</span>
        </Link>

        <Link
          href="/movies"
          className="btn-screenbox-dark text-xs sm:text-sm py-3 px-5 flex items-center gap-2"
        >
          <Film className="w-4 h-4 text-amber-400" />
          <span>Movies Catalog</span>
        </Link>
      </div>
    </div>
  );
}
