"use client";

import { useRef, ReactNode } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ContentRailProps {
  title: string;
  subtitle?: string;
  badge?: string;
  icon?: ReactNode;
  viewAllHref?: string;
  viewAllLabel?: string;
  children: ReactNode;
}

export default function ContentRail({
  title,
  subtitle,
  badge,
  icon,
  viewAllHref,
  viewAllLabel = "View All →",
  children,
}: ContentRailProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const offset = direction === "left" ? -450 : 450;
    scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
  };

  return (
    <section className="space-y-4 relative group">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {icon && (
            <div className="p-1.5 rounded-xl bg-zinc-800/80 text-red-500 border border-zinc-700/60 shadow-md">
              {icon}
            </div>
          )}
          <div>
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>{title}</span>
              {badge && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-600/20 text-red-400 border border-red-500/30 uppercase tracking-wider">
                  {badge}
                </span>
              )}
            </h2>
            {subtitle && <p className="text-xs text-zinc-400">{subtitle}</p>}
          </div>
        </div>

        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="text-xs font-bold text-red-400 hover:text-red-300 transition"
          >
            {viewAllLabel}
          </Link>
        )}
      </div>

      {/* Rail with Glide Chevrons */}
      <div className="relative">
        <button
          onClick={() => scroll("left")}
          aria-label="Scroll left"
          className="absolute -left-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/80 hover:bg-red-600 text-white border border-zinc-700 backdrop-blur-md opacity-0 group-hover:opacity-100 transition duration-300 shadow-xl cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div
          ref={scrollRef}
          className="flex items-center gap-3.5 overflow-x-auto hide-scrollbar scroll-smooth py-2 px-1 snap-x snap-mandatory"
        >
          {children}
        </div>

        <button
          onClick={() => scroll("right")}
          aria-label="Scroll right"
          className="absolute -right-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/80 hover:bg-red-600 text-white border border-zinc-700 backdrop-blur-md opacity-0 group-hover:opacity-100 transition duration-300 shadow-xl cursor-pointer"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
}
