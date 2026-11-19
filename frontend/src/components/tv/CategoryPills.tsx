"use client";

import { Category } from "@/types";
import { Sparkles } from "lucide-react";

interface CategoryPillsProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (slug: string | null) => void;
  totalChannels?: number;
}

export default function CategoryPills({
  categories,
  selectedCategory,
  onSelectCategory,
  totalChannels,
}: CategoryPillsProps) {
  return (
    <div className="w-full overflow-x-auto pb-2 scrollbar-none">
      <div className="flex items-center gap-2 min-w-max">
        {/* "All Channels" Pill */}
        <button
          onClick={() => onSelectCategory(null)}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition cursor-pointer border ${
            selectedCategory === null
              ? "bg-red-600 text-white border-red-500 shadow-lg shadow-red-600/25"
              : "bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-white border-zinc-800"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>All Channels</span>
          {typeof totalChannels === "number" && (
            <span
              className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] ${
                selectedCategory === null
                  ? "bg-white/20 text-white"
                  : "bg-zinc-800 text-zinc-400"
              }`}
            >
              {totalChannels}
            </span>
          )}
        </button>

        {/* Dynamic Category Pills */}
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.slug;
          return (
            <button
              key={cat.id || cat.slug}
              onClick={() => onSelectCategory(cat.slug)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition cursor-pointer border ${
                isSelected
                  ? "bg-red-600 text-white border-red-500 shadow-lg shadow-red-600/25"
                  : "bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-white border-zinc-800"
              }`}
            >
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
