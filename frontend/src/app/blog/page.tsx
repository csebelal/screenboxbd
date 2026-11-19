import { Metadata } from "next";
import { getAllPosts, getBlogCategories } from "@/lib/blogData";
import BlogListClient from "@/components/blog/BlogListClient";
import { BlogPost } from "@/types";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "ScreenBoxBD Blog - BDIX Streaming Guides, 4K Reviews & Setup Tutorials",
  description:
    "Discover the latest BDIX streaming guides, Android TV setup tutorials, 4K HDR movie recommendations, and zero-latency sports streaming tips from ScreenBoxBD.",
  openGraph: {
    title: "ScreenBoxBD Blog & Streaming Guides",
    description:
      "Bufferless BDIX streaming, 4K cinema reviews, and home theater setup tutorials.",
    type: "website",
  },
};

interface ApiBlogPost {
  id: number;
  slug: string;
  title: string;
  summary?: string;
  content?: string;
  banner_url?: string;
  category?: string;
  tags?: string[];
  author_name?: string;
  published_at?: string;
  reading_time?: string;
  views?: number;
}

export default async function BlogPage() {
  const fallbackPosts = getAllPosts();
  const categories = getBlogCategories();

  let posts: BlogPost[] = fallbackPosts;

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";
    const res = await fetch(`${apiUrl}/blogs`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(1500),
    });

    if (res.ok) {
      const json = await res.json();
      if (json.data && json.data.length > 0) {
        const dynamicPosts: BlogPost[] = json.data.map((item: ApiBlogPost) => ({
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
          readTime: item.reading_time || "5 min read",
          featured: true,
          views: item.views || 100,
          likes: 45,
        }));

        // Merge dynamic posts with fallback
        const existingSlugs = new Set(dynamicPosts.map((p) => p.slug));
        const nonDuplicateFallbacks = fallbackPosts.filter((p) => !existingSlugs.has(p.slug));
        posts = [...dynamicPosts, ...nonDuplicateFallbacks];
      }
    }
  } catch {
    // Backend offline or timeout -> uses fallback
  }

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-14 py-8 sm:py-12">
      <BlogListClient initialPosts={posts} categories={categories} />
    </div>
  );
}
