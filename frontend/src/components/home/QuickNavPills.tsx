"use client";

import { useState } from "react";
import { Zap, Film, Radio, Trophy, Newspaper, Sparkles } from "lucide-react";

interface QuickNavPillsProps {
  onSelectCategory?: (category: string) => void;
  activePill?: string;
}

export default function QuickNavPills({
  onSelectCategory,
  activePill = "all",
}: QuickNavPillsProps) {
  const [selected, setSelected] = useState<string>(activePill);

  const pills = [
    { id: "all", label: "All Hub", icon: Sparkles, target: "#all" },
    { id: "sports", label: "Sports Live", icon: Trophy, target: "#channels-directory" },
    { id: "movies", label: "Top Movies", icon: Film, target: "#top-movies" },
    { id: "bdix", label: "BDIX Ultra", icon: Zap, target: "#channels-directory" },
    { id: "news", label: "Live News", icon: Newspaper, target: "#channels-directory" },
    { id: "channels", label: "All Channels", icon: Radio, target: "#channels-directory" },
  ];

  const handleClick = (id: string, target: string) => {
    setSelected(id);
    if (onSelectCategory) {
      onSelectCategory(id);
    }
    const element = document.querySelector(target);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="w-full overflow-x-auto hide-scrollbar py-1">
      <div className="flex items-center gap-2 min-w-max">
        {pills.map((pill) => {
          const Icon = pill.icon;
          const isActive = selected === pill.id;

          return (
            <button
              key={pill.id}
              onClick={() => handleClick(pill.id, pill.target)}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all duration-300 cursor-pointer shadow-sm ${
                isActive
                  ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-600/30 scale-105"
                  : "bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-zinc-400"}`} />
              <span>{pill.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
