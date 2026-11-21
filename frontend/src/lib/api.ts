import {
  Category,
  Channel,
  Movie,
  Series,
  Episode,
  PaginatedResponse,
  AdSlotsResponse,
  PlatformSettings,
  SubscriptionPlanItem,
  FaqEntry,
} from "@/types";
import {
  FALLBACK_CATEGORIES,
  FALLBACK_CHANNELS,
  FALLBACK_MOVIES,
  FALLBACK_AD_SLOTS,
} from "./fallbackData";

const API_BASE_URL =
  typeof window === "undefined"
    ? (process.env.INTERNAL_API_URL ||
        (process.env.NEXT_PUBLIC_API_URL?.startsWith("http")
          ? process.env.NEXT_PUBLIC_API_URL
          : "http://127.0.0.1:8000/api/v1"))
    : (process.env.NEXT_PUBLIC_API_URL?.startsWith("http")
        ? process.env.NEXT_PUBLIC_API_URL
        : "/api/v1");

// Fast timeout to avoid holding SSR threads; falls back to instant cached data
const TIMEOUT_MS = 1500;
const TIMEOUT_DETAIL_MS = 6000;

// High-speed in-memory cache to eliminate duplicate PHP requests & accelerate response time
const apiCache = new Map<string, { data: unknown; expiry: number }>();

function getCached<T>(key: string): T | null {
  const item = apiCache.get(key);
  if (item && item.expiry > Date.now()) {
    return item.data as T;
  }
  return null;
}

function setCached(key: string, data: unknown, ttlMs: number = 60000) {
  apiCache.set(key, { data, expiry: Date.now() + ttlMs });
}

export interface ChannelFilterParams {
  category?: string;
  category_id?: number;
  country?: string;
  search?: string;
  featured?: boolean;
  per_page?: number;
  page?: number;
}

export interface MovieFilterParams {
  genre?: string;
  language?: string;
  quality?: string;
  platform?: string;
  bangla_ott?: boolean;
  year?: string | number;
  search?: string;
  sort?: "latest" | "rating" | "popular" | "oldest";
  featured?: boolean;
  hero_slider?: boolean;
  per_page?: number;
  page?: number;
}

/**
 * Fetch all categories with strict timeout and fallback
 */
export async function getCategories(type: string = "tv"): Promise<Category[]> {
  const cacheKey = `categories:${type}`;
  const cached = getCached<Category[]>(cacheKey);
  if (cached) return cached;

  try {
    const res = await fetch(`${API_BASE_URL}/categories?type=${encodeURIComponent(type)}`, {
      next: { revalidate: 120 },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (res.ok) {
      const json = await res.json();
      const data = json.data || [];
      if (data.length > 0) {
        setCached(cacheKey, data, 60000);
        return data;
      }
    }
  } catch {
    // Timeout or network error
  }

  return FALLBACK_CATEGORIES.filter((c) => !type || c.type === type);
}

export interface HomePayload {
  hero: Movie[];
  top_10?: Movie[];
  popular_movies?: Movie[];
  trending_movies: Movie[];
  latest_movies: Movie[];
  action_movies?: Movie[];
  bollywood_movies?: Movie[];
  animation_movies?: Movie[];
  bangla_ott_originals: Movie[];
  popular_series: Series[];
  featured_channels: Channel[];
  categories: Category[];
  settings?: PlatformSettings;
}

/**
 * Fetch aggregated home payload in a single round-trip with backend cache
 */
export async function getHomeData(): Promise<HomePayload | null> {
  const cacheKey = "home:aggregated";
  const cached = getCached<HomePayload>(cacheKey);
  if (cached) return cached;

  try {
    const res = await fetch(`${API_BASE_URL}/home`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (res.ok) {
      const json = await res.json();
      if (json.data) {
        setCached(cacheKey, json.data, 60000);
        return json.data as HomePayload;
      }
    }
  } catch {
    // Timeout or network error
  }

  return null;
}

/**
 * Fetch paginated channels with strict timeout and fallback
 */
export async function getChannels(
  params: ChannelFilterParams = {}
): Promise<PaginatedResponse<Channel>> {
  const cacheKey = `channels:${JSON.stringify(params)}`;
  const cached = getCached<PaginatedResponse<Channel>>(cacheKey);
  if (cached) return cached;

  try {
    const query = new URLSearchParams();
    if (params.category) query.append("category", params.category);
    if (params.category_id) query.append("category_id", String(params.category_id));
    if (params.country) query.append("country", params.country);
    if (params.search) query.append("search", params.search);
    if (params.featured) query.append("featured", "1");
    if (params.per_page) query.append("per_page", String(params.per_page));
    if (params.page) query.append("page", String(params.page));

    const url = `${API_BASE_URL}/channels?${query.toString()}`;
    const res = await fetch(url, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (res.ok) {
      const json = await res.json();
      if (json.data && Array.isArray(json.data)) {
        setCached(cacheKey, json, 30000);
        return json;
      }
    }
  } catch {
    // Timeout or offline
  }

  // Fast in-memory filtering of fallback channels
  let filtered = [...FALLBACK_CHANNELS];
  if (params.category) {
    filtered = filtered.filter(
      (c) => c.category?.slug.toLowerCase() === params.category?.toLowerCase()
    );
  }
  if (params.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter((c) => c.name.toLowerCase().includes(q));
  }
  if (params.featured) {
    filtered = filtered.filter((c) => c.is_featured);
  }

  return {
    data: filtered,
    meta: {
      total: filtered.length,
      current_page: params.page || 1,
      per_page: params.per_page || 50,
      from: 1,
      last_page: 1,
      path: "",
      to: filtered.length,
    },
  };
}

/**
 * Fetch single channel by slug with strict timeout
 */
export async function getChannelBySlug(slug: string): Promise<Channel | null> {
  const cacheKey = `channel:${slug}`;
  const cached = getCached<Channel>(cacheKey);
  if (cached) return cached;

  try {
    const res = await fetch(`${API_BASE_URL}/channels/${encodeURIComponent(slug)}`, {
      next: { revalidate: 30 },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (res.ok) {
      const json = await res.json();
      if (json.data) {
        setCached(cacheKey, json.data, 60000);
        return json.data;
      }
    }
  } catch {
    // Timeout or offline
  }

  const match = FALLBACK_CHANNELS.find((c) => c.slug === slug);
  return match || FALLBACK_CHANNELS[0] || null;
}

/**
 * Fetch paginated movies with strict timeout and fallback
 */
export async function getMovies(
  params: MovieFilterParams = {}
): Promise<PaginatedResponse<Movie>> {
  const cacheKey = `movies:${JSON.stringify(params)}`;
  const cached = getCached<PaginatedResponse<Movie>>(cacheKey);
  if (cached) return cached;

  try {
    const query = new URLSearchParams();
    if (params.genre) query.append("genre", params.genre);
    if (params.language) query.append("language", params.language);
    if (params.quality) query.append("quality", params.quality);
    if (params.platform) query.append("platform", params.platform);
    if (params.bangla_ott) query.append("bangla_ott", "1");
    if (params.year) query.append("year", String(params.year));
    if (params.search) query.append("search", params.search);
    if (params.sort) query.append("sort", params.sort);
    if (params.featured) query.append("featured", "1");
    if (params.hero_slider) query.append("hero_slider", "1");
    if (params.per_page) query.append("per_page", String(params.per_page));
    if (params.page) query.append("page", String(params.page));

    const url = `${API_BASE_URL}/movies?${query.toString()}`;
    const res = await fetch(url, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (res.ok) {
      const json = await res.json();
      if (json.data && Array.isArray(json.data)) {
        setCached(cacheKey, json, 30000);
        return json;
      }
    }
  } catch {
    // Timeout or offline
  }

  // Fast in-memory filtering of fallback movies
  let filtered = [...FALLBACK_MOVIES];
  if (params.platform) {
    const targetPlatforms = params.platform.split(",").map((p) => p.trim().toLowerCase());
    filtered = filtered.filter(
      (m) => m.ott_platform && targetPlatforms.includes(m.ott_platform.toLowerCase())
    );
  }
  if (params.bangla_ott) {
    filtered = filtered.filter(
      (m) =>
        m.ott_platform ||
        (Array.isArray(m.genres) &&
          m.genres.some((g) => g.toLowerCase().includes("bangla")))
    );
  }
  if (params.genre) {
    const g = params.genre.toLowerCase();
    filtered = filtered.filter((m) =>
      Array.isArray(m.genres) && m.genres.some((genre) => genre.toLowerCase() === g)
    );
  }
  if (params.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        (m.overview && m.overview.toLowerCase().includes(q))
    );
  }
  if (params.featured) {
    filtered = filtered.filter((m) => m.is_featured);
  }
  if (params.sort === "rating") {
    filtered.sort((a, b) => b.rating - a.rating);
  } else if (params.sort === "popular") {
    filtered.sort((a, b) => b.views - a.views);
  }

  return {
    data: filtered,
    meta: {
      total: filtered.length,
      current_page: params.page || 1,
      per_page: params.per_page || 30,
      from: 1,
      last_page: 1,
      path: "",
      to: filtered.length,
    },
  };
}

export interface MovieCatalogData {
  top_10: Movie[];
  trending: Movie[];
  recently_added: Movie[];
  box_office: Movie[];
  coming_soon: Movie[];
  action: Movie[];
  thriller: Movie[];
  comedy: Movie[];
  bangla: Movie[];
  scifi_fantasy: Movie[];
  horror: Movie[];
  crime_mystery: Movie[];
  romance: Movie[];
  drama: Movie[];
  adventure: Movie[];
  animation: Movie[];
}

/**
 * Fetch full 16-category catalog payload for /movies in a single high-speed request
 */
export async function getMoviesCatalog(): Promise<MovieCatalogData | null> {
  const cacheKey = "movies_catalog_all_16_rails_v4";
  const cached = getCached<MovieCatalogData>(cacheKey);
  if (cached) return cached;

  try {
    const res = await fetch(`${API_BASE_URL}/movies?catalog=true`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(TIMEOUT_DETAIL_MS),
    });

    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        setCached(cacheKey, json.data, 30000);
        return json.data as MovieCatalogData;
      }
    }
  } catch {
    // Timeout or fallback
  }

  return null;
}

/**
 * Fetch single movie by slug with strict timeout
 */
export async function getMovieBySlug(slug: string): Promise<Movie | null> {
  const cacheKey = `movie:${slug}`;
  const cached = getCached<Movie>(cacheKey);
  if (cached && cached.cast && cached.cast.length > 0) return cached;

  try {
    const res = await fetch(`${API_BASE_URL}/movies/${encodeURIComponent(slug)}`, {
      next: { revalidate: 10 },
      signal: AbortSignal.timeout(TIMEOUT_DETAIL_MS),
    });

    if (res.ok) {
      const json = await res.json();
      const movie: Movie = json.data;
      if (json.related) {
        movie.related = json.related;
      }
      if (movie.cast && movie.cast.length > 0) {
        setCached(cacheKey, movie, 60000);
      }
      return movie;
    }
  } catch {
    // Timeout or offline
  }

  const match = FALLBACK_MOVIES.find((m) => m.slug === slug);
  if (match) {
    return {
      ...match,
      related: FALLBACK_MOVIES.filter((m) => m.slug !== slug).slice(0, 4),
    };
  }

  return FALLBACK_MOVIES[0] || null;
}

export interface SeriesFilterParams {
  genre?: string;
  platform?: string;
  bangla_ott?: boolean;
  search?: string;
  featured?: boolean;
  per_page?: number;
  page?: number;
}

/**
 * Fetch paginated TV series list
 */
export async function getSeries(
  params: SeriesFilterParams = {}
): Promise<PaginatedResponse<Series>> {
  const query = new URLSearchParams();
  if (params.genre) query.append("genre", params.genre);
  if (params.platform) query.append("platform", params.platform);
  if (params.bangla_ott) query.append("bangla_ott", "1");
  if (params.search) query.append("search", params.search);
  if (params.featured) query.append("featured", "1");
  if (params.per_page) query.append("per_page", String(params.per_page));
  if (params.page) query.append("page", String(params.page));

  try {
    const res = await fetch(`${API_BASE_URL}/series?${query.toString()}`, {
      next: { revalidate: 30 },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Timeout or offline
  }

  return {
    data: [],
    links: { first: "", last: "", prev: null, next: null },
    meta: { current_page: 1, from: 0, last_page: 1, path: "", per_page: 24, to: 0, total: 0 },
  };
}

/**
 * Fetch single TV series with seasons & episodes
 */
export async function getSeriesBySlug(slug: string): Promise<Series | null> {
  const cacheKey = `series:${slug}`;
  const cached = getCached<Series>(cacheKey);
  if (cached && cached.cast && cached.cast.length > 0) return cached;

  try {
    const res = await fetch(`${API_BASE_URL}/series/${encodeURIComponent(slug)}`, {
      next: { revalidate: 10 },
      signal: AbortSignal.timeout(TIMEOUT_DETAIL_MS),
    });
    if (res.ok) {
      const json = await res.json();
      if (json.data) {
        if (json.data.cast && json.data.cast.length > 0) {
          setCached(cacheKey, json.data, 60000);
        }
        return json.data;
      }
    }
  } catch {
    // Timeout or offline
  }
  return null;
}

/**
 * Fetch single episode details with resolved streaming servers
 */
export async function getEpisode(id: number | string): Promise<Episode | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/episodes/${id}`, {
      next: { revalidate: 30 },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (res.ok) {
      const json = await res.json();
      return json.data || null;
    }
  } catch {
    // Timeout or offline
  }
  return null;
}

/**
 * Fetch active ad placement slots with strict timeout
 */
export async function getAdSlots(): Promise<AdSlotsResponse | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/ads/slots`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Timeout or offline
  }

  return FALLBACK_AD_SLOTS;
}

/**
 * Fetch dynamic platform settings configured via Admin Panel
 */
export async function getPlatformSettings(): Promise<PlatformSettings> {
  try {
    const res = await fetch(`${API_BASE_URL}/settings`, {
      next: { revalidate: 30 },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (res.ok) {
      const json = await res.json();
      if (json.data) return json.data;
    }
  } catch {
    // Timeout or offline
  }

  return {
    site_name: "ScreenBoxBD",
    site_tagline: "BDIX আল্ট্রা-ফাস্ট লাইভ টিভি ও প্রিমিয়াম মুভি স্ট্রিমিং",
    announcement_active: false,
    announcement_text: "",
    announcement_color: "emerald",
    announcement_link: "/subscriptions",
    support_email: "support@screenboxbd.com",
    support_phone: "+880 1700-000000",
    support_telegram: "https://t.me/screenboxbd",
    support_whatsapp: "https://wa.me/8801700000000",
    support_facebook: "https://facebook.com/screenboxbd",
    enable_subscriptions: false,
    google_analytics_enabled: true,
    google_tag_manager_id: "GTM-T4M9PSPK",
    google_analytics_id: "",
    custom_header_scripts: "",
    custom_footer_scripts: "",
  };
}

/**
 * Fetch dynamic subscription plans configured via Admin Panel
 */
export async function getSubscriptionPlans(): Promise<SubscriptionPlanItem[]> {
  const cacheKey = "plans_all";
  const cached = getCached<SubscriptionPlanItem[]>(cacheKey);
  if (cached) return cached;

  try {
    const res = await fetch(`${API_BASE_URL}/plans`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (res.ok) {
      const json = await res.json();
      if (json.data && json.data.length > 0) {
        setCached(cacheKey, json.data, 300000); // 5 minutes cache
        return json.data;
      }
    }
  } catch {
    // Timeout or offline
  }

  return [];
}

/**
 * Fetch dynamic FAQs configured via Admin Panel
 */
export async function getFaqs(category?: string): Promise<FaqEntry[]> {
  const cacheKey = `faqs_${category || "all"}`;
  const cached = getCached<FaqEntry[]>(cacheKey);
  if (cached) return cached;

  try {
    const url = category ? `${API_BASE_URL}/faqs?category=${encodeURIComponent(category)}` : `${API_BASE_URL}/faqs`;
    const res = await fetch(url, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (res.ok) {
      const json = await res.json();
      if (json.data && json.data.length > 0) {
        setCached(cacheKey, json.data, 300000); // 5 minutes cache
        return json.data;
      }
    }
  } catch {
    // Timeout or offline
  }

  return [];
}
