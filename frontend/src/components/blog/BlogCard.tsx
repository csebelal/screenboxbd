import Link from "next/link";
import { Calendar, Clock, Eye, ArrowRight, Sparkles } from "lucide-react";
import { BlogPost } from "@/types";

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

export default function BlogCard({ post, featured = false }: BlogCardProps) {
  if (featured) {
    return (
      <article className="group relative rounded-3xl overflow-hidden bg-gradient-to-b from-[#181A24] to-[#12141C] border border-white/10 hover:border-red-500/40 transition-all duration-300 shadow-2xl hover:shadow-red-950/20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Image Banner */}
          <div className="lg:col-span-7 relative h-72 sm:h-96 lg:h-full min-h-[300px] overflow-hidden">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#12141C] via-[#12141C]/30 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-[#12141C]/30 lg:to-[#12141C]" />
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#E50000] text-white shadow-lg shadow-red-900/50">
                <Sparkles className="w-3.5 h-3.5" /> ফিচারড আর্টিকেল
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-black/60 backdrop-blur-md text-white/90 border border-white/10">
                {post.category}
              </span>
            </div>
          </div>

          {/* Content Info */}
          <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-4 text-xs text-[#9EA3B0]">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-red-500" />
                  {new Date(post.publishedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <span className="w-1 h-1 rounded-full bg-zinc-600" />
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  {post.readTime}
                </span>
                {post.views && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-zinc-600" />
                    <span className="flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-blue-400" />
                      {post.views.toLocaleString()} views
                    </span>
                  </>
                )}
              </div>

              <Link href={`/blog/${post.slug}`} className="block group-hover:text-red-400 transition-colors">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight leading-snug">
                  {post.title}
                </h2>
              </Link>

              <p className="text-sm sm:text-base text-[#9EA3B0] leading-relaxed line-clamp-3">
                {post.excerpt}
              </p>
            </div>

            {/* Author & CTA Button */}
            <div className="pt-6 border-t border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-10 h-10 rounded-full object-cover border border-white/20"
                />
                <div>
                  <p className="text-xs sm:text-sm font-bold text-white leading-tight">
                    {post.author.name}
                  </p>
                  <p className="text-[11px] text-[#666C7A]">{post.author.role}</p>
                </div>
              </div>

              <Link
                href={`/blog/${post.slug}`}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.08] hover:bg-[#E50000] text-white text-xs sm:text-sm font-semibold transition-all duration-200 group/btn"
              >
                <span>সম্পূর্ণ পড়ুন</span>
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group flex flex-col h-full rounded-2xl overflow-hidden bg-[#14161E] border border-white/[0.08] hover:border-red-500/40 hover:bg-[#181A24] transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-black/60">
      {/* Thumbnail */}
      <Link href={`/blog/${post.slug}`} className="relative block h-48 sm:h-52 w-full overflow-hidden shrink-0">
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#14161E] via-transparent to-black/20" />
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-black/70 backdrop-blur-md text-white border border-white/10">
          {post.category}
        </span>
      </Link>

      {/* Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          <div className="flex items-center gap-3 text-[11px] text-[#9EA3B0]">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-red-500" />
              {new Date(post.publishedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
            <span className="w-1 h-1 rounded-full bg-zinc-600" />
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-amber-400" />
              {post.readTime}
            </span>
          </div>

          <Link href={`/blog/${post.slug}`} className="block">
            <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-red-400 transition-colors line-clamp-2 leading-snug">
              {post.title}
            </h3>
          </Link>

          <p className="text-xs sm:text-sm text-[#9EA3B0] line-clamp-2 leading-relaxed">
            {post.excerpt}
          </p>
        </div>

        {/* Tags preview */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-2 py-0.5 rounded-md bg-white/[0.04] text-[#9EA3B0] border border-white/[0.05]"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer info */}
        <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-6 h-6 rounded-full object-cover border border-white/20"
            />
            <span className="text-[11px] font-semibold text-white/90 truncate max-w-[120px]">
              {post.author.name}
            </span>
          </div>

          <Link
            href={`/blog/${post.slug}`}
            className="text-[11px] font-bold text-red-500 hover:text-red-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
          >
            পড়ুন <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </article>
  );
}
