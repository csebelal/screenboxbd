import Link from "next/link";

interface LogoProps {
  className?: string;
}

export default function ScreenBoxLogo({ className = "" }: LogoProps) {
  return (
    <Link
      href="/"
      className={`flex items-center gap-2.5 group cursor-pointer select-none transition-transform duration-200 active:scale-95 ${className}`}
      aria-label="ScreenBoxBD - Home"
    >
      {/* Cinematic Red ScreenBox Emblem */}
      <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-[#E50000] via-[#D10000] to-[#FF2E2E] flex items-center justify-center shadow-lg shadow-red-900/40 group-hover:shadow-red-700/60 transition-all duration-300 group-hover:scale-105 border border-white/20">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="w-4 h-4 sm:w-5 sm:h-5 text-white ml-0.5"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="6 3 20 12 6 21 6 3" fill="white" />
        </svg>

        {/* Pulsing Green Live Beacon */}
        <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#0B0C0E] animate-pulse" />
      </div>

      {/* Brand Wordmark: ScreenBox BD */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span className="text-xl sm:text-2xl font-black tracking-tight text-white leading-none">
            Screen<span className="text-[#E50000] group-hover:text-[#FF2E2E] transition-colors">Box</span>
          </span>
          <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-blue-600 text-white tracking-wider uppercase shadow-sm">
            BD
          </span>
        </div>
        <span className="text-[9px] font-bold tracking-widest text-[#9EA3B0] uppercase leading-none mt-1">
          Cinema &bull; Live TV BDIX
        </span>
      </div>
    </Link>
  );
}
