"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, User } from "lucide-react";

interface CastMember {
  name: string;
  role?: string;
  character?: string;
  photoUrl?: string;
  profile_url?: string | null;
}

interface CastCarouselProps {
  cast?: CastMember[];
}

export default function CastCarousel({ cast = [] }: CastCarouselProps) {
  const [startIndex, setStartIndex] = useState(0);

  // If no cast exists for this title, show a clean informative state instead of mismatched fake data
  if (!cast || cast.length === 0) {
    return (
      <div className="streamit-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-black text-white">Cast & Crew</h3>
            <p className="text-xs text-[#9EA3B0]">Lead performers and starring roles</p>
          </div>
        </div>
        <div className="p-6 rounded-2xl bg-[#10121A] border border-white/[0.06] text-center space-y-2">
          <div className="w-10 h-10 rounded-full bg-white/5 mx-auto flex items-center justify-center text-[#666C7A]">
            <User className="w-5 h-5" />
          </div>
          <p className="text-xs font-semibold text-white/80">Cast Information</p>
          <p className="text-xs text-[#666C7A] max-w-sm mx-auto">
            Official cast and crew credits are currently being synced with studio records.
          </p>
        </div>
      </div>
    );
  }

  const next = () => {
    setStartIndex((prev) => (prev + 1) % cast.length);
  };

  const prev = () => {
    setStartIndex((prev) => (prev - 1 + cast.length) % cast.length);
  };

  // Circular slice for carousel if more than 6 members
  const itemsToShow = Math.min(cast.length, 6);
  const displayItems = Array.from({ length: itemsToShow }).map((_, i) => {
    return cast[(startIndex + i) % cast.length];
  });

  return (
    <div className="streamit-card p-6 space-y-5">
      {/* Header + Nav Arrows */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base sm:text-lg font-black text-white">Cast & Crew</h3>
          <p className="text-xs text-[#9EA3B0]">Lead performers and starring roles ({cast.length})</p>
        </div>

        {cast.length > 6 && (
          <div className="flex items-center gap-1.5 bg-[#12141C] border border-white/[0.08] rounded-xl p-1">
            <button
              type="button"
              onClick={prev}
              className="w-8 h-8 rounded-lg bg-[#181A24] hover:bg-[#202330] flex items-center justify-center text-[#9EA3B0] hover:text-white transition cursor-pointer"
              aria-label="Previous Cast"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={next}
              className="w-8 h-8 rounded-lg bg-[#181A24] hover:bg-[#202330] flex items-center justify-center text-[#9EA3B0] hover:text-white transition cursor-pointer"
              aria-label="Next Cast"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Cast Avatar List */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4">
        {displayItems.map((member, idx) => {
          const avatarUrl = member.profile_url || member.photoUrl;
          const initials = member.name
            ? member.name
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")
            : "ACT";

          return (
            <div key={`${member.name}-${idx}`} className="flex flex-col items-center text-center space-y-2 group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-[#0D0E14] border border-white/[0.08] group-hover:border-red-600/50 shadow-md group-hover:scale-105 transition-all duration-300 flex items-center justify-center">
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={avatarUrl}
                    alt={member.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#1A1D27] to-[#0E1017] flex items-center justify-center text-xs font-bold text-white/70">
                    {initials}
                  </div>
                )}
              </div>
              <div className="w-full">
                <p className="text-xs font-bold text-white group-hover:text-red-400 transition-colors truncate">
                  {member.name}
                </p>
                <p className="text-[11px] text-[#9EA3B0] truncate">
                  {member.character || member.role || "Actor"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
