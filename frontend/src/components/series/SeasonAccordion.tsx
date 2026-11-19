"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Play, Clock } from "lucide-react";

interface Episode {
  id: string;
  number: string;
  title: string;
  duration: string;
  overview: string;
  thumbnailUrl: string;
  streamUrl?: string;
}

interface Season {
  id: string;
  title: string;
  episodesCount: number;
  episodes: Episode[];
}

interface SeasonAccordionProps {
  onSelectEpisode?: (ep: Episode) => void;
}

export default function SeasonAccordion({
  onSelectEpisode,
}: SeasonAccordionProps) {
  const seasons: Season[] = [
    {
      id: "s1",
      title: "Season 01",
      episodesCount: 8,
      episodes: [
        {
          id: "s1e1",
          number: "01",
          title: "Chapter One: The Vanishing of Will Byers",
          duration: "49 min",
          overview:
            "On his way home, young Will sees something terrifying. Nearby, a sinister secret lurks in the depths of a government lab.",
          thumbnailUrl:
            "https://images.unsplash.com/photo-1518676599649-7c77da3157a2?auto=format&fit=crop&w=300&q=80",
        },
        {
          id: "s1e2",
          number: "02",
          title: "Chapter Two: The Weirdo on Maple Street",
          duration: "56 min",
          overview:
            "Lucas, Mike and Dustin try to talk to the mysterious girl they found in the woods. Hopper questions an anxious Joyce.",
          thumbnailUrl:
            "https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=300&q=80",
        },
        {
          id: "s1e3",
          number: "03",
          title: "Chapter Three: Holly, Jolly",
          duration: "52 min",
          overview:
            "An increasingly concerned Nancy looks for Barb and investigates Jonathan. Joyce is convinced Will is attempting contact.",
          thumbnailUrl:
            "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=300&q=80",
        },
        {
          id: "s1e4",
          number: "04",
          title: "Chapter Four: The Body",
          duration: "51 min",
          overview:
            "Refusing to believe Will is dead, Joyce tries to connect with her son. The boys give Eleven a disguise.",
          thumbnailUrl:
            "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&w=300&q=80",
        },
      ],
    },
    {
      id: "s2",
      title: "Season 02",
      episodesCount: 9,
      episodes: [
        {
          id: "s2e1",
          number: "01",
          title: "Chapter One: MADMAX",
          duration: "48 min",
          overview:
            "As the town preps for Halloween, a high-scoring arcade rival shakes things up, and a skeptical Hopper inspects rotting pumpkin patches.",
          thumbnailUrl:
            "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=300&q=80",
        },
        {
          id: "s2e2",
          number: "02",
          title: "Chapter Two: Trick or Treat, Freak",
          duration: "55 min",
          overview:
            "After Will sees something terrifying on trick-or-treat night, Mike wonders if Eleven is still out there. Nancy wrestles with grief.",
          thumbnailUrl:
            "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=300&q=80",
        },
      ],
    },
  ];

  const [expandedSeason, setExpandedSeason] = useState<string>("s1");
  const [activeEpisodeId, setActiveEpisodeId] = useState<string>("s1e1");

  const toggleSeason = (id: string) => {
    setExpandedSeason((prev) => (prev === id ? "" : id));
  };

  const handleSelect = (ep: Episode) => {
    setActiveEpisodeId(ep.id);
    if (onSelectEpisode) {
      onSelectEpisode(ep);
    }
  };

  return (
    <div className="streamit-card p-6 space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-base sm:text-lg font-black text-white">
          Seasons & Episodes
        </h3>
        <p className="text-xs text-[#9EA3B0]">
          Stream all episodes in 1080p Full HD with subtitle options
        </p>
      </div>

      {/* Accordion Seasons List */}
      <div className="space-y-4">
        {seasons.map((season) => {
          const isExpanded = expandedSeason === season.id;
          return (
            <div
              key={season.id}
              className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                isExpanded
                  ? "border-red-600/40 bg-[#12141C]"
                  : "border-white/[0.08] bg-[#0E1016]"
              }`}
            >
              {/* Season Trigger Button */}
              <button
                type="button"
                onClick={() => toggleSeason(season.id)}
                className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left cursor-pointer hover:bg-white/[0.02] transition"
              >
                <div className="flex items-center gap-3">
                  <span className="text-base font-black text-white">
                    {season.title}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/[0.06] text-[#9EA3B0]">
                    {season.episodesCount} Episodes
                  </span>
                </div>

                <div className="w-8 h-8 rounded-lg bg-[#181A24] border border-white/[0.08] flex items-center justify-center text-[#9EA3B0]">
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-red-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </button>

              {/* Episodes Grid within expanded season */}
              {isExpanded && (
                <div className="p-4 sm:p-5 pt-0 space-y-3 border-t border-white/[0.06] animate-in fade-in duration-200">
                  {season.episodes.map((ep) => {
                    const isActive = ep.id === activeEpisodeId;
                    return (
                      <div
                        key={ep.id}
                        onClick={() => handleSelect(ep)}
                        className={`p-3 sm:p-4 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col sm:flex-row items-start sm:items-center gap-4 ${
                          isActive
                            ? "bg-[#1C1F2B] border-red-600/60 shadow-md shadow-red-950/20"
                            : "bg-[#10121A] border-white/[0.06] hover:border-white/20 hover:bg-[#161822]"
                        }`}
                      >
                        {/* Thumbnail with Play Hover */}
                        <div className="relative w-full sm:w-40 aspect-video rounded-lg overflow-hidden bg-[#0D0E14] border border-white/[0.06] shrink-0 group">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={ep.thumbnailUrl}
                            alt={ep.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <div className="w-8 h-8 rounded-full bg-[#E50000] text-white flex items-center justify-center shadow-md">
                              <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                            </div>
                          </div>
                        </div>

                        {/* Episode Info */}
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center justify-between gap-2">
                            <h4
                              className={`text-sm font-bold truncate ${
                                isActive ? "text-red-400" : "text-white"
                              }`}
                            >
                              {ep.title}
                            </h4>
                            <span className="text-xs text-[#9EA3B0] shrink-0 flex items-center gap-1 font-mono">
                              <Clock className="w-3 h-3 text-[#666C7A]" />
                              {ep.duration}
                            </span>
                          </div>
                          <p className="text-xs text-[#9EA3B0] line-clamp-2 leading-relaxed">
                            {ep.overview}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
