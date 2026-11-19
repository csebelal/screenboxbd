import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { BlogPost } from "@/types";
import {
  getAllPosts,
  getPostBySlug,
  getRelatedPosts,
} from "@/lib/blogData";
import BlogCard from "@/components/blog/BlogCard";
import BlogShareButtons from "@/components/blog/BlogShareButtons";
import BlogInteraction from "@/components/blog/BlogInteraction";
import BlogContentRenderer, { parseHeadings } from "@/components/blog/BlogContentRenderer";
import {
  Calendar,
  Clock,
  Eye,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Tv,
  List,
  ShieldCheck,
} from "lucide-react";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

async function fetchPost(slug: string): Promise<BlogPost | null> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";
    const res = await fetch(`${apiUrl}/blogs/${encodeURIComponent(slug)}`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(1500),
    });
    if (res.ok) {
      const json = await res.json();
      if (json.data) {
        const item = json.data;
        const post: BlogPost = {
          id: String(item.id),
          slug: item.slug,
          title: item.title,
          excerpt: item.summary || "",
          content: item.content || "",
          coverImage: item.banner_url || "https://images.unsplash.com/photo-1593784991095-a205069470b6?q=80&w=1200&auto=format&fit=crop",
          category: item.category || "Tech & Guides",
          categorySlug: (item.category || "tech-guides").toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          tags: Array.isArray(item.tags) ? item.tags : ["Streaming", "BDIX"],
          author: {
            name: item.author_name || "ScreenBoxBD Editorial",
            role: "Tech Writer & Streaming Analyst",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop",
          },
          publishedAt: item.published_at ? new Date(item.published_at).toISOString().split("T")[0] : "2026-11-18",
          updatedAt: item.updated_at ? new Date(item.updated_at).toISOString().split("T")[0] : undefined,
          readTime: item.reading_time || "5 min read",
          featured: true,
          views: item.views || 100,
          likes: 45,
        };
        return post;
      }
    }
  } catch {}
  return getPostBySlug(slug) || null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchPost(slug);

  if (!post) {
    return {
      title: "Article Not Found - ScreenBoxBD",
      description: "The requested blog article does not exist.",
    };
  }

  return {
    title: `${post.title} - ScreenBoxBD Blog`,
    description: post.excerpt,
    authors: [{ name: post.author.name }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt || post.publishedAt,
      authors: [post.author.name],
      images: [
        {
          url: post.coverImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await fetchPost(slug);

  if (!post) {
    notFound();
  }

  const allPosts = getAllPosts();
  const currentIndex = allPosts.findIndex((p) => p.slug === slug);
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
  const relatedPosts = getRelatedPosts(slug, 3);
  const headings = parseHeadings(post.content);

  // Extract FAQ Schema for AEO / Rich Snippets
  const faqRegex = /### প্রশ্ন:\s*([\s\S]*?)\n\*\*উত্তর:\*\*\s*([\s\S]*?)(?=\n###|\n##|$)/g;
  const faqEntities: { "@type": string; name: string; acceptedAnswer: { "@type": string; text: string } }[] = [];
  let faqMatch;
  while ((faqMatch = faqRegex.exec(post.content)) !== null) {
    faqEntities.push({
      "@type": "Question",
      name: faqMatch[1].trim(),
      acceptedAnswer: {
        "@type": "Answer",
        text: faqMatch[2].trim().replace(/\[(.*?)\]\(.*?\)/g, "$1"),
      },
    });
  }

  // Schema.org Structured Data
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    inLanguage: "bn-BD",
    author: {
      "@type": "Person",
      name: post.author.name,
      jobTitle: post.author.role,
    },
    publisher: {
      "@type": "Organization",
      name: "ScreenBoxBD",
      url: "https://screenboxbd.com",
      logo: {
        "@type": "ImageObject",
        url: "https://screenboxbd.com/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://screenboxbd.com/blog/${post.slug}`,
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://screenboxbd.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: "https://screenboxbd.com/blog",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `https://screenboxbd.com/blog/${post.slug}`,
      },
    ],
  };

  return (
    <article className="w-full pb-20">
      {/* JSON-LD Structured Data for Google Rich Snippets, AI Search & AEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqEntities.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faqEntities,
            }),
          }}
        />
      )}

      {/* 1. Breadcrumbs */}
      <div className="w-full bg-[#0E1016] border-b border-white/[0.06] py-3.5">
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-14 flex items-center gap-2 text-xs text-[#9EA3B0] overflow-x-auto hide-scrollbar">
          <Link href="/" className="hover:text-white transition shrink-0">
            হোম
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
          <Link href="/blog" className="hover:text-white transition shrink-0">
            ব্লগ ও গাইড
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
          <span className="text-white/60 truncate max-w-xs sm:max-w-md">{post.title}</span>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-14 pt-8 sm:pt-12 space-y-8">
        {/* Back button */}
        <div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#9EA3B0] hover:text-white transition group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>সকল আর্টিকেলে ফিরে যান</span>
          </Link>
        </div>

        {/* 2. Article Header */}
        <header className="space-y-6 max-w-4xl">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#E50000] text-white shadow-md shadow-red-950/40">
              {post.category}
            </span>
            {post.featured && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <Sparkles className="w-3 h-3" /> বিশেষ ফিচারড আর্টিকেল
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-base sm:text-xl text-[#9EA3B0] leading-relaxed font-normal">
              {post.excerpt}
            </p>
          )}

          {/* Meta & Author Bar */}
          <div className="pt-4 pb-4 border-y border-white/[0.08] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-white/20 shadow-md"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">{post.author.name}</span>
                  <span className="inline-flex items-center text-[10px] text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-1.5 py-0.5 rounded">
                    যাচাইকৃত বিশেষজ্ঞ
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-[#9EA3B0] mt-0.5">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-red-500" />
                    {new Date(post.publishedAt).toLocaleDateString("bn-BD", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-zinc-600" />
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    {post.readTime}
                  </span>
                  {post.views && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-zinc-600" />
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-blue-400" />
                        {post.views.toLocaleString()} বার পঠিত
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Social Share Buttons */}
            <BlogShareButtons title={post.title} />
          </div>
        </header>

        {/* 3. Hero Cover Image */}
        <div className="relative w-full h-64 sm:h-96 lg:h-[460px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C0E] via-transparent to-black/20" />
        </div>

        {/* 4. Two-Column Layout: Article Body + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Main Article Content (8 cols) */}
          <div className="lg:col-span-8 space-y-10">
            {/* Rendered Markdown Body */}
            <div className="article-body">
              <BlogContentRenderer content={post.content} />
            </div>

            {/* Tags Cloud */}
            {post.tags && post.tags.length > 0 && (
              <div className="pt-6 border-t border-white/[0.08] space-y-2.5">
                <p className="text-xs font-bold text-[#666C7A] uppercase tracking-wider">
                  আর্টিকেল ট্যাগ ও বিষয়সমূহ
                </p>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/blog`}
                      className="text-xs px-3 py-1.5 rounded-lg bg-[#14161E] border border-white/[0.08] hover:border-red-500/40 hover:text-white text-[#9EA3B0] transition"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Interactive Feedback & Likes */}
            <BlogInteraction initialLikes={post.likes || 320} />

            {/* Author Bio Box */}
            <div className="rounded-2xl bg-[#14161E] border border-white/[0.08] p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-5">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-[#E50000]/40 shrink-0"
              />
              <div className="space-y-2 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h4 className="text-base font-bold text-white">{post.author.name}</h4>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-white/[0.06] text-[#9EA3B0]">
                    {post.author.role}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#9EA3B0] leading-relaxed">
                  {post.author.bio ||
                    "স্ক্রিনবক্সবিডির টেক লেখক ও কন্ট্রিবিউটর, নেটওয়ার্ক স্পিড, ৪কে স্ট্রিমিং ও ওটিটি প্রযুক্তি বিশ্লেষক।"}
                </p>
              </div>
            </div>

            {/* Next / Previous Post Navigation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              {prevPost ? (
                <Link
                  href={`/blog/${prevPost.slug}`}
                  className="group rounded-2xl bg-[#14161E] border border-white/[0.08] hover:border-white/20 p-5 space-y-2 transition flex flex-col justify-between"
                >
                  <div className="flex items-center gap-1.5 text-xs text-[#666C7A] font-bold uppercase tracking-wider group-hover:text-red-500 transition">
                    <ArrowLeft className="w-3.5 h-3.5" /> পূর্ববর্তী আর্টিকেল
                  </div>
                  <p className="text-sm font-bold text-white group-hover:text-red-400 transition line-clamp-2">
                    {prevPost.title}
                  </p>
                </Link>
              ) : (
                <div className="hidden sm:block" />
              )}

              {nextPost && (
                <Link
                  href={`/blog/${nextPost.slug}`}
                  className="group rounded-2xl bg-[#14161E] border border-white/[0.08] hover:border-white/20 p-5 space-y-2 transition flex flex-col justify-between text-right sm:text-right"
                >
                  <div className="flex items-center justify-end gap-1.5 text-xs text-[#666C7A] font-bold uppercase tracking-wider group-hover:text-red-500 transition">
                    পরবর্তী আর্টিকেল <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                  <p className="text-sm font-bold text-white group-hover:text-red-400 transition line-clamp-2">
                    {nextPost.title}
                  </p>
                </Link>
              )}
            </div>
          </div>

          {/* Sidebar (4 cols) */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
            {/* Table of Contents */}
            {headings.length > 0 && (
              <div className="rounded-2xl bg-[#12141C] border border-white/[0.08] p-5 space-y-3 shadow-lg">
                <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider border-b border-white/[0.06] pb-3">
                  <List className="w-4 h-4 text-red-500" />
                  এই আর্টিকেলের বিষয়বস্তু
                </div>
                <nav className="space-y-1.5 max-h-80 overflow-y-auto">
                  {headings.map((h) => (
                    <a
                      key={h.id}
                      href={`#${h.id}`}
                      className={`block text-xs py-1 transition hover:text-red-400 ${
                        h.level === 3 ? "pl-3 text-[#666C7A]" : "text-[#9EA3B0] font-medium"
                      }`}
                    >
                      {h.text}
                    </a>
                  ))}
                </nav>
              </div>
            )}

            {/* Quick Article Overview Box */}
            <div className="rounded-2xl bg-[#14161E] border border-white/[0.08] p-5 space-y-3.5 text-xs">
              <h4 className="font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> এক নজরে তথ্য
              </h4>
              <div className="divide-y divide-white/[0.06] space-y-2.5">
                <div className="flex items-center justify-between pt-2">
                  <span className="text-[#666C7A]">ক্যাটাগরি</span>
                  <span className="font-bold text-white">{post.category}</span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-[#666C7A]">পড়ার সময়</span>
                  <span className="font-bold text-white">{post.readTime}</span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-[#666C7A]">কাদের জন্য</span>
                  <span className="font-bold text-white">স্ট্রিমিং ও ওটিটি দর্শক</span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-[#666C7A]">বিডিআইএক্স স্পিড</span>
                  <span className="font-bold text-emerald-400">১০০% অপ্টিমাইজড</span>
                </div>
              </div>
            </div>

            {/* ScreenBoxBD VIP Promo Card */}
            <div className="rounded-3xl bg-gradient-to-br from-red-950/60 via-[#181A24] to-[#12141C] border border-red-500/30 p-6 space-y-4 shadow-xl">
              <div className="w-10 h-10 rounded-2xl bg-[#E50000] flex items-center justify-center text-white shadow-lg shadow-red-900/50">
                <Tv className="w-5 h-5" />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-base font-bold text-white">৪কে বাফারলেস স্ট্রিমিং করতে প্রস্তুত?</h4>
                <p className="text-xs text-[#9EA3B0] leading-relaxed">
                  ২৪০+ লাইভ চ্যানেল, ডলবি অ্যাটমস ও সেরা সিনেমাগুলো উপভোগ করুন দেশের দ্রুততম বিডিআইএক্স স্পিডে।
                </p>
              </div>
              <Link
                href="/subscriptions"
                className="w-full btn-screenbox-red text-xs py-3 text-center block font-bold"
              >
                ৭ দিনের ফ্রি ট্রায়াল শুরু করুন
              </Link>
            </div>
          </aside>
        </div>

        {/* 5. Related Articles Grid */}
        {relatedPosts.length > 0 && (
          <section className="pt-16 border-t border-white/[0.08] space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-red-500 uppercase tracking-wider">
                  আরও জানুন
                </p>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  সম্পর্কিত গাইড ও রিভিউ
                </h3>
              </div>
              <Link
                href="/blog"
                className="text-xs font-bold text-[#9EA3B0] hover:text-white flex items-center gap-1 transition"
              >
                সকল আর্টিকেল <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {relatedPosts.map((relPost) => (
                <BlogCard key={relPost.id} post={relPost} />
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
