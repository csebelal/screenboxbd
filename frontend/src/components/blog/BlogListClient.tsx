"use client";

import { useState, useMemo } from "react";
import { Search, X, Sparkles, BookOpen, Film, Flame, Send, CheckCircle2 } from "lucide-react";
import { BlogPost, BlogCategory } from "@/types";
import BlogCard from "./BlogCard";

interface BlogListClientProps {
  initialPosts: BlogPost[];
  categories: BlogCategory[];
}

export default function BlogListClient({ initialPosts, categories }: BlogListClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Extract all unique tags
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    initialPosts.forEach((post) => {
      post.tags.forEach((tag) => tagsSet.add(tag));
    });
    return Array.from(tagsSet);
  }, [initialPosts]);

  // Filtered posts based on category, search query, and tag
  const filteredPosts = useMemo(() => {
    return initialPosts.filter((post) => {
      // Category filter
      if (selectedCategory !== "all" && post.categorySlug !== selectedCategory) {
        return false;
      }

      // Tag filter
      if (selectedTag && !post.tags.includes(selectedTag)) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const inTitle = post.title.toLowerCase().includes(query);
        const inExcerpt = post.excerpt.toLowerCase().includes(query);
        const inCategory = post.category.toLowerCase().includes(query);
        const inTags = post.tags.some((t) => t.toLowerCase().includes(query));
        const inAuthor = post.author.name.toLowerCase().includes(query);

        if (!inTitle && !inExcerpt && !inCategory && !inTags && !inAuthor) {
          return false;
        }
      }

      return true;
    });
  }, [initialPosts, selectedCategory, selectedTag, searchQuery]);

  // Featured post (only prominent when no search or specific tag is active, and category is all)
  const featuredPost = useMemo(() => {
    if (selectedCategory === "all" && !selectedTag && !searchQuery.trim()) {
      return initialPosts.find((p) => p.featured) || initialPosts[0];
    }
    return null;
  }, [initialPosts, selectedCategory, selectedTag, searchQuery]);

  // Remaining posts to show in the grid
  const gridPosts = useMemo(() => {
    if (featuredPost) {
      return filteredPosts.filter((p) => p.id !== featuredPost.id);
    }
    return filteredPosts;
  }, [filteredPosts, featuredPost]);

  const handleResetFilters = () => {
    setSelectedCategory("all");
    setSelectedTag(null);
    setSearchQuery("");
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubscribed(true);
      setNewsletterEmail("");
    }
  };

  return (
    <div className="space-y-12">
      {/* 1. Header Banner & Search Controls */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-[#141620] via-[#10121A] to-[#0B0C0E] border border-white/[0.08] p-6 sm:p-10 lg:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-red-600/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            স্ক্রিনবক্সবিডি অফিসিয়াল ব্লগ
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            বিডিআইএক্স স্ট্রিমিং, টেক গাইড ও সিনেমা রিভিউ
          </h1>

          <p className="text-sm sm:text-base text-[#9EA3B0] leading-relaxed max-w-2xl">
            বাংলাদেশে বাফারলেস বিডিআইএক্স স্ট্রিমিং, ৪কে স্মার্ট টিভি সেটআপ, লেটেস্ট মুভি রিভিউ এবং জিরো-ল্যাগ লাইভ খেলার যাবতীয় ট্রিকস ও টিউটোরিয়াল।
          </p>

          {/* Search Bar Input */}
          <div className="pt-4 max-w-xl">
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-[#9EA3B0]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="আর্টিকেল খুঁজুন... যেমন: BDIX, 4K, Android TV, ক্রিকেট..."
                className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-[#181A24] border border-white/10 text-white placeholder-[#666C7A] text-sm focus:outline-none focus:border-red-500 transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 p-1 rounded-lg text-[#9EA3B0] hover:text-white hover:bg-white/[0.08] transition"
                  title="ক্লিয়ার করুন"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Category Filter Pills */}
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-2 sm:pb-0 w-full sm:w-auto">
            {categories.map((cat) => {
              const active = selectedCategory === cat.slug;
              return (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat.slug);
                    setSelectedTag(null);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 shrink-0 flex items-center gap-2 cursor-pointer ${
                    active
                      ? "bg-[#E50000] text-white shadow-lg shadow-red-950/50"
                      : "bg-[#14161E] border border-white/[0.08] text-[#9EA3B0] hover:text-white hover:border-white/20"
                  }`}
                >
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>

          <span className="text-xs text-[#666C7A] font-semibold">
            মোট {filteredPosts.length}টি আর্টিকেল
          </span>
        </div>

        {/* Active Tag filter indicator */}
        {selectedTag && (
          <div className="flex items-center gap-2 pt-1 text-xs">
            <span className="text-[#9EA3B0]">ফিল্টার ট্যাগ:</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-950/40 border border-red-800/40 text-red-400 font-semibold">
              #{selectedTag}
              <button
                type="button"
                onClick={() => setSelectedTag(null)}
                className="hover:text-white"
                title="ফিল্টার মুছুন"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          </div>
        )}
      </section>

      {/* 3. Featured Hero Article (when applicable) */}
      {featuredPost && (
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#9EA3B0] uppercase tracking-wider">
            <Flame className="w-4 h-4 text-red-500" />
            আলোচিত ট্রেন্ডিং আর্টিকেল
          </div>
          <BlogCard post={featuredPost} featured={true} />
        </section>
      )}

      {/* 4. Article Grid */}
      <section className="space-y-6">
        {featuredPost && (
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-red-500" />
              সাম্প্রতিক গাইড ও আর্টিকেলসমূহ
            </h2>
          </div>
        )}

        {gridPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {gridPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          /* Empty Search / Filter State */
          <div className="rounded-2xl bg-[#12141C] border border-white/[0.08] p-12 text-center space-y-4 max-w-lg mx-auto">
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto text-red-500">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">কোনো আর্টিকেল পাওয়া যায়নি</h3>
            <p className="text-xs sm:text-sm text-[#9EA3B0]">
              &ldquo;{searchQuery || selectedTag || selectedCategory}&rdquo;-এর সাথে মিলে এমন কোনো কন্টেন্ট পাওয়া যায়নি। অন্য কোনো কি-ওয়ার্ড দিয়ে খুঁজুন অথবা ফিল্টার রিসেট করুন।
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#E50000] text-white text-xs font-bold hover:bg-red-600 transition"
            >
              সকল ফিল্টার রিসেট করুন
            </button>
          </div>
        )}
      </section>

      {/* 5. Popular Topics Cloud */}
      <section className="rounded-2xl bg-[#12141C] border border-white/[0.08] p-6 sm:p-8 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Film className="w-4 h-4 text-red-500" />
          জনপ্রিয় টপিকসমূহ
        </h3>
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => {
            const isSelected = selectedTag === tag;
            return (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTag(isSelected ? null : tag)}
                className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition cursor-pointer ${
                  isSelected
                    ? "bg-[#E50000] text-white border-red-500"
                    : "bg-[#181A24] border-white/[0.08] text-[#9EA3B0] hover:text-white hover:border-white/20"
                }`}
              >
                #{tag}
              </button>
            );
          })}
        </div>
      </section>

      {/* 6. Newsletter Subscription Card */}
      <section className="rounded-3xl bg-gradient-to-r from-[#181A24] via-[#151722] to-[#12141C] border border-white/10 p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl text-center md:text-left">
          <h3 className="text-xl sm:text-2xl font-black text-white">
            স্ক্রিনবক্সবিডি উইকলি ডাইজেস্ট সাবস্ক্রাইব করুন
          </h3>
          <p className="text-xs sm:text-sm text-[#9EA3B0]">
            প্রতি সপ্তাহের নতুন ৪কে সিনেমা রিলিজ, লাইভ খেলার সময়সূচী এবং বিডিআইএক্স স্পিড বৃদ্ধির টিপস সরাসরি ইমেইলে পান। সম্পূর্ণ স্প্যামমুক্ত।
          </p>
        </div>

        <div className="w-full md:w-auto min-w-[280px] sm:min-w-[340px]">
          {newsletterSubscribed ? (
            <div className="flex items-center gap-2 text-sm font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 p-4 rounded-2xl">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>ধন্যবাদ! আপনি সফলভাবে সাবস্ক্রাইব করেছেন।</span>
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="আপনার ইমেইল অ্যাড্রেস লিখুন..."
                className="flex-1 px-4 py-3 rounded-xl bg-[#0F1117] border border-white/10 text-white placeholder-[#666C7A] text-xs focus:outline-none focus:border-red-500 transition"
              />
              <button
                type="submit"
                className="px-5 py-3 rounded-xl bg-[#E50000] hover:bg-red-600 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
              >
                <span>সাবস্ক্রাইব</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
