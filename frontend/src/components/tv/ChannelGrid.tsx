"use client";

import { useMemo, useState } from "react";
import { Category, Channel } from "@/types";
import ChannelCard from "./ChannelCard";
import CategoryPills from "./CategoryPills";
import { Search, SlidersHorizontal, Tv2, X } from "lucide-react";

interface ChannelGridProps {
  initialChannels: Channel[];
  categories: Category[];
}

export default function ChannelGrid({
  initialChannels,
  categories,
}: ChannelGridProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string>("all");

  // Unique list of countries from channels
  const countries = useMemo(() => {
    const set = new Set<string>();
    initialChannels.forEach((c) => {
      if (c.country) set.add(c.country.toUpperCase());
    });
    return Array.from(set).sort();
  }, [initialChannels]);

  // Filter channels in real-time
  const filteredChannels = useMemo(() => {
    return initialChannels.filter((channel) => {
      // Category filter
      if (selectedCategory) {
        if (!channel.category || channel.category.slug !== selectedCategory) {
          return false;
        }
      }

      // Country filter
      if (selectedCountry !== "all") {
        if (channel.country?.toUpperCase() !== selectedCountry) {
          return false;
        }
      }

      // Search query filter (name or country)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = channel.name.toLowerCase().includes(query);
        const matchesCat = channel.category?.name.toLowerCase().includes(query);
        if (!matchesName && !matchesCat) {
          return false;
        }
      }

      return true;
    });
  }, [initialChannels, selectedCategory, selectedCountry, searchQuery]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory(null);
    setSelectedCountry("all");
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800/80 backdrop-blur-md">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search channels by name or genre..."
            className="w-full pl-10 pr-10 py-2.5 bg-zinc-950/80 rounded-xl border border-zinc-800 focus:border-red-500 focus:ring-1 focus:ring-red-500 text-sm text-white placeholder-zinc-500 outline-none transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Country Filter Selector */}
        {countries.length > 0 && (
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-zinc-400 hidden sm:block" />
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="px-3.5 py-2.5 bg-zinc-950/80 rounded-xl border border-zinc-800 text-xs font-semibold text-zinc-300 focus:border-red-500 outline-none cursor-pointer"
            >
              <option value="all">All Countries</option>
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country === "BD" ? "🇧🇩 Bangladesh (BD)" : country}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Category Pills Navigation */}
      <CategoryPills
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        totalChannels={initialChannels.length}
      />

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-zinc-400 font-medium px-1">
        <span>
          Showing <span className="text-white font-bold">{filteredChannels.length}</span> channels
          {selectedCategory && ` in ${selectedCategory}`}
          {selectedCountry !== "all" && ` (${selectedCountry})`}
        </span>

        {(selectedCategory || selectedCountry !== "all" || searchQuery) && (
          <button
            onClick={handleResetFilters}
            className="text-red-400 hover:text-red-300 hover:underline cursor-pointer"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Grid of Channels */}
      {filteredChannels.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredChannels.map((channel) => (
            <ChannelCard key={channel.id} channel={channel} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center p-16 bg-zinc-900/40 rounded-2xl border border-dashed border-zinc-800 text-center">
          <div className="w-16 h-16 rounded-2xl bg-zinc-800/80 flex items-center justify-center mb-4">
            <Tv2 className="w-8 h-8 text-zinc-500" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">No channels found</h3>
          <p className="text-sm text-zinc-400 max-w-sm mb-6">
            We couldn&apos;t find any channels matching &ldquo;{searchQuery || selectedCategory}&rdquo;. Try another search term or reset filters.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-lg shadow-red-600/30 transition cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
}
